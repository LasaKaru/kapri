import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt } from '@/lib/system-prompt'
import { parseClaudeResponse } from '@/lib/parse-mcp-response'
import { respond } from '@/lib/engine'
import type { CartItem } from '@/lib/types'

export type HistoryMessage = { role: 'user' | 'assistant'; text: string; image?: string }

// ═══════════════════════════════════════════════════════════
// Tier 1 — Anthropic (claude-haiku-4-5 + Kapruka MCP beta)
// Anthropic's servers proxy MCP calls → works from any IP.
// ═══════════════════════════════════════════════════════════
async function callAnthropic(history: HistoryMessage[], cart: CartItem[], lastVimp?: string | null): Promise<NextResponse> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  // Hard 120s timeout: a stuck request should fail fast and fall through to
  // Tier 2/3 rather than hang the user's chat for minutes.
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 120000, maxRetries: 1 })

  const MODEL = 'claude-haiku-4-5-20251001'

  const messages = history.slice(-12).map((m) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let content: any = m.text
    if (m.image) {
      const match = m.image.match(/^data:(image\/[a-z]+);base64,(.*)$/)
      if (match) {
        content = []
        if (m.text) content.push({ type: 'text', text: m.text })
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: match[1], data: match[2] }
        })
      }
    }
    return {
      role: m.role as 'user' | 'assistant',
      content,
    }
  })

  // Stream instead of a plain create: the server-side MCP tool loop can run
  // for a long time (city lookup → delivery check → create order), and a
  // non-streaming connection sits idle the whole while — observed hanging
  // for minutes. Streaming keeps bytes flowing; finalMessage() returns the
  // same complete Message object.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestParams = (extraMessages: any[] = []): any => ({
    model: MODEL,
    max_tokens: 4096,
    system: buildSystemPrompt(cart, lastVimp),
    messages: [...messages, ...extraMessages],
    betas: ['mcp-client-2025-11-20'],
    mcp_servers: [{ type: 'url', url: 'https://mcp.kapruka.com/mcp', name: 'kapruka' }],
    // mcp-client-2025-11-20 requires every server in mcp_servers to be
    // referenced by exactly one mcp_toolset in tools
    tools: [{ type: 'mcp_toolset', mcp_server_name: 'kapruka' }],
    // The Kapruka MCP server deadlocks on concurrent calls within one
    // session (one call stalls until the connector's 300s timeout), so
    // force tool calls to run one at a time.
    tool_choice: { type: 'auto', disable_parallel_tool_use: true },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response = await (client.beta.messages as any).stream(requestParams()).finalMessage()

  // The server-side MCP tool loop pauses after ~10 iterations with
  // stop_reason 'pause_turn' — re-send with the assistant turn appended
  // so it resumes where it left off.
  for (let i = 0; i < 3 && response.stop_reason === 'pause_turn'; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response = await (client.beta.messages as any)
      .stream(requestParams([{ role: 'assistant', content: response.content }]))
      .finalMessage()
  }

  // Tool-use turns interleave text blocks ("Let me check…") with tool calls;
  // the JSON reply the UI needs is in the LAST text block, not the first.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textBlocks = (response.content ?? []).filter((c: any) => c.type === 'text')
  const result = parseClaudeResponse(textBlocks.at(-1)?.text ?? '')
  return NextResponse.json(result)
}

// ═══════════════════════════════════════════════════════════
// Tier 2 — Gemini (gemini-2.5-flash + @ai-sdk/mcp + Kapruka)
// Direct HTTP to MCP; works on Vercel / local but NOT in
// the Claude Code sandbox (IP not in allowlist).
// ═══════════════════════════════════════════════════════════
async function callGemini(history: HistoryMessage[], cart: CartItem[], lastVimp?: string | null): Promise<NextResponse> {
  const { callGemini: geminiHandler } = await import('@/lib/gemini-route')
  const result = await geminiHandler(history, cart, lastVimp)
  return NextResponse.json(result)
}

// ═══════════════════════════════════════════════════════════
// Tier 3 — Scripted engine (always works, no API key needed)
// ═══════════════════════════════════════════════════════════
function callScriptedEngine(lastText: string, cartCount: number, lastVimp?: string | null): NextResponse {
  const result = respond(lastText, { cartCount, lastVimp })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      messages?: HistoryMessage[]
      cart?: CartItem[]
      // legacy single-shot format
      text?: string
      cartCount?: number
      lastVimp?: string | null
    }

    const history = body.messages ?? []
    const cart = body.cart ?? []
    const lastText = body.text ?? history.at(-1)?.text ?? ''
    const cartCount = cart.reduce((s, i) => s + i.qty, 0) ?? body.cartCount ?? 0
    const lastVimp = body.lastVimp

    const hasHistory = history.length > 0

    // — Tier 1: Anthropic —
    if (process.env.ANTHROPIC_API_KEY && hasHistory) {
      try {
        return await callAnthropic(history, cart, lastVimp)
      } catch (err) {
        console.error('[Tier1-Anthropic] failed, trying Gemini:', (err as Error).message)
      }
    }

    // — Tier 2: Gemini —
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY && hasHistory) {
      try {
        return await callGemini(history, cart, lastVimp)
      } catch (err) {
        console.error('[Tier2-Gemini] failed, falling back to scripted:', (err as Error).message)
      }
    }

    // — Tier 3: Scripted engine —
    return callScriptedEngine(lastText, cartCount, lastVimp)

  } catch (err) {
    console.error('[Chat route] fatal:', err)
    return NextResponse.json(
      { lang: 'en', text: "Sorry, something went wrong. Please try again!", chips: ['Try again'] },
      { status: 500 },
    )
  }
}
