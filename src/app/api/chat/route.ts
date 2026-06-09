import { NextRequest, NextResponse } from 'next/server'
import { respond } from '@/lib/engine'

export async function POST(req: NextRequest) {
  try {
    const { text, cartCount, lastVimp } = await req.json() as {
      text: string
      cartCount?: number
      lastVimp?: string | null
    }

    // == Scripted engine (swap for Claude + Kapruka MCP when ANTHROPIC_API_KEY is set) ==
    const result = respond(text, { cartCount: cartCount ?? 0, lastVimp })

    // == Real Claude + Kapruka MCP (uncomment & set ANTHROPIC_API_KEY to activate) ==
    // import Anthropic from '@anthropic-ai/sdk'
    // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    // const response = await client.beta.messages.create({
    //   model: 'claude-sonnet-4-6',
    //   max_tokens: 4096,
    //   system: KAPRI_SYSTEM_PROMPT,
    //   messages: conversationHistory,
    //   betas: ['mcp-client-2025-04-04'],
    //   mcp_servers: [{ type: 'url', url: 'https://mcp.kapruka.com/mcp', name: 'kapruka' }]
    // })
    // const result = parseClaudeResponse(response)

    return NextResponse.json(result)
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}
