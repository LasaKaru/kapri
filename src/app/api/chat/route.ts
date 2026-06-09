import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt } from '@/lib/system-prompt'
import { parseClaudeResponse } from '@/lib/parse-mcp-response'
import { respond } from '@/lib/engine'
import type { CartItem } from '@/lib/types'

// Anthropic message format for conversation history
interface HistoryMessage {
  role: 'user' | 'assistant'
  text: string
}

async function callClaude(
  history: HistoryMessage[],
  cart: CartItem[],
  latestText: string,
): Promise<NextResponse> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // Build messages array — include up to 10 turns for context
  const recentHistory = history.slice(-10)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any[] = recentHistory.map((m) => ({
    role: m.role,
    content: m.text,
  }))

  const systemPrompt = buildSystemPrompt(cart)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await (client.beta.messages as any).create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages,
    betas: ['mcp-client-2025-11-20'],
    mcp_servers: [
      {
        type: 'url',
        url: 'https://mcp.kapruka.com/mcp',
        name: 'kapruka',
      },
    ],
  })

  // Extract the final text content from Claude's response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textBlock = response.content?.find((c: any) => c.type === 'text')
  const rawText = textBlock?.text ?? ''

  const result = parseClaudeResponse(rawText)
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      // New format: full conversation history + cart
      messages?: HistoryMessage[]
      cart?: CartItem[]
      // Legacy format: single message (fallback/scripted engine)
      text?: string
      cartCount?: number
      lastVimp?: string | null
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    // === Real Claude + Kapruka MCP ===
    if (apiKey && body.messages && body.messages.length > 0) {
      try {
        return await callClaude(body.messages, body.cart ?? [], body.messages.at(-1)?.text ?? '')
      } catch (mcpError) {
        console.error('Claude/MCP error:', mcpError)
        // Fall through to scripted engine on error
      }
    }

    // === Scripted engine fallback ===
    const text = body.text ?? body.messages?.at(-1)?.text ?? ''
    const cartCount = body.cart?.reduce((s, i) => s + i.qty, 0) ?? body.cartCount ?? 0
    const lastVimp = body.lastVimp
    const result = respond(text, { cartCount, lastVimp })
    return NextResponse.json(result)

  } catch (err) {
    console.error('Chat route error:', err)
    return NextResponse.json(
      { lang: 'en', text: "Sorry, something went wrong. Please try again!", chips: [] },
      { status: 500 },
    )
  }
}
