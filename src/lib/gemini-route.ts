/**
 * Gemini fallback route for Kapruka MCP integration.
 *
 * Gemini rejects fully-dynamic AI SDK tools whose schemas are inferred at runtime.
 * We pass explicit Zod schemas via client.tools({ schemas: {...} }) so the toolset
 * is statically typed and Gemini-compatible.
 */
import { generateText, stepCountIs } from 'ai'
import { google } from '@ai-sdk/google'
import { createMCPClient } from '@ai-sdk/mcp'
import { z } from 'zod'
import { buildSystemPrompt } from './system-prompt'
import { parseClaudeResponse } from './parse-mcp-response'
import type { CartItem } from './types'

export type HistoryMessage = { role: 'user' | 'assistant'; text: string }

/** Unwrap @ai-sdk/mcp tool result envelope.
 *  Shape: { type:'content', value:[{type:'text', text:'{...json}'}] }
 *  or just a plain JSON string / object.
 */
export function unwrapMCPResult(result: unknown): unknown {
  if (!result || typeof result !== 'object') {
    // Plain string
    if (typeof result === 'string') {
      try { return JSON.parse(result) } catch { return result }
    }
    return result
  }
  const r = result as Record<string, unknown>

  // Envelope shape 1: { type:'content', value:[{type:'text', text:'...'}] }
  if (r.type === 'content' && Array.isArray(r.value)) {
    for (const item of r.value as Record<string, unknown>[]) {
      if (item.type === 'text' && typeof item.text === 'string') {
        try { return JSON.parse(item.text) } catch { return item.text }
      }
    }
  }

  // Envelope shape 2: plain array [{type:'text', text:'...'}]
  if (Array.isArray(result)) {
    for (const item of result as Record<string, unknown>[]) {
      if (item.type === 'text' && typeof item.text === 'string') {
        try { return JSON.parse(item.text) } catch { return item.text }
      }
    }
  }

  // Already a plain object — check if it has a nested text field
  if (typeof r.text === 'string') {
    try { return JSON.parse(r.text) } catch { return r.text }
  }

  return result
}

/** Static Zod schemas for each Kapruka MCP tool.
 *  Gemini requires explicit schemas at startup — cannot use 'automatic'. */
const KAPRUKA_SCHEMAS = {
  kapruka_search_products: {
    inputSchema: z.object({
      q: z.string().min(1).describe('Search query in English'),
      category: z.string().optional(),
      min_price: z.number().optional(),
      max_price: z.number().optional(),
      in_stock_only: z.boolean().optional(),
      sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest', 'bestseller']).optional(),
      limit: z.number().int().min(1).max(50).optional().default(8),
      cursor: z.string().optional(),
      response_format: z.literal('json').optional().default('json'),
    }),
  },
  kapruka_get_product: {
    inputSchema: z.object({
      product_id: z.string().describe('Product ID e.g. CAKE00KA001843'),
      currency: z.string().optional().default('LKR'),
      response_format: z.literal('json').optional().default('json'),
    }),
  },
  kapruka_list_categories: {
    inputSchema: z.object({
      depth: z.number().int().min(1).max(2).optional().default(1),
      response_format: z.literal('json').optional().default('json'),
    }),
  },
  kapruka_list_delivery_cities: {
    inputSchema: z.object({
      query: z.string().min(1).describe('City name or partial name to search'),
      limit: z.number().int().min(1).max(50).optional().default(25),
      response_format: z.literal('json').optional().default('json'),
    }),
  },
  kapruka_check_delivery: {
    inputSchema: z.object({
      city: z.string().describe('Canonical city name from list_delivery_cities'),
      delivery_date: z.string().describe('Date in YYYY-MM-DD format'),
      product_id: z.string().optional().describe('Product ID for perishable check'),
      response_format: z.literal('json').optional().default('json'),
    }),
  },
  kapruka_track_order: {
    inputSchema: z.object({
      order_number: z.string().describe('VIMP tracking number from confirmation email'),
      response_format: z.literal('json').optional().default('json'),
    }),
  },
}

export async function callGemini(
  history: HistoryMessage[],
  cart: CartItem[],
  lastVimp?: string | null
): Promise<Record<string, unknown>> {
  const mcpClient = await createMCPClient({
    transport: { type: 'http', url: 'https://mcp.kapruka.com/mcp' },
  })

  try {
    // Use our static Zod schemas — makes Gemini happy while keeping real MCP execution
    const tools = await mcpClient.tools({ schemas: KAPRUKA_SCHEMAS })

    const messages = history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.text,
    }))

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system: buildSystemPrompt(cart, lastVimp),
      messages,
      tools,
      stopWhen: stepCountIs(6),
    })

    return parseClaudeResponse(text) as unknown as Record<string, unknown>
  } finally {
    await mcpClient.close()
  }
}
