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
import type { CartItem, Product } from './types'

export type HistoryMessage = { role: 'user' | 'assistant'; text: string; image?: string }

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
 *  Gemini requires explicit schemas at startup — cannot use 'automatic'.
 *
 *  The Kapruka server (FastMCP) declares every tool with a single required
 *  `params` object — flat arguments are rejected with a Pydantic
 *  "params Field required" validation error, so each schema below wraps
 *  its fields in `params`. Field names/enums mirror the live server schema
 *  (additionalProperties: false — unknown fields are rejected).
 */
const KAPRUKA_SCHEMAS = {
  kapruka_search_products: {
    inputSchema: z.object({
      params: z.object({
        q: z.string().min(3).describe('Search query in English, min 3 chars'),
        category: z.string().optional(),
        min_price: z.number().optional(),
        max_price: z.number().optional(),
        in_stock_only: z.boolean().optional(),
        sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest', 'bestseller']).optional(),
        limit: z.number().int().min(1).max(50).optional().default(8),
        cursor: z.string().optional(),
        response_format: z.literal('json').optional().default('json'),
      }),
    }),
  },
  kapruka_get_product: {
    inputSchema: z.object({
      params: z.object({
        product_id: z.string().describe('Product ID e.g. CAKE00KA001843'),
        currency: z.string().optional().default('LKR'),
        response_format: z.literal('json').optional().default('json'),
      }),
    }),
  },
  kapruka_list_categories: {
    inputSchema: z.object({
      params: z.object({
        depth: z.number().int().min(1).max(2).optional().default(1),
        response_format: z.literal('json').optional().default('json'),
      }),
    }),
  },
  kapruka_list_delivery_cities: {
    inputSchema: z.object({
      params: z.object({
        query: z.string().min(1).describe('City name or partial name to search'),
        limit: z.number().int().min(1).max(50).optional().default(25),
        response_format: z.literal('json').optional().default('json'),
      }),
    }),
  },
  kapruka_check_delivery: {
    inputSchema: z.object({
      params: z.object({
        city: z.string().describe('Canonical city name from list_delivery_cities'),
        delivery_date: z.string().optional().describe('Date in YYYY-MM-DD format (defaults to today)'),
        product_id: z.string().optional().describe('Product ID for perishable check'),
        response_format: z.literal('json').optional().default('json'),
      }),
    }),
  },
  kapruka_create_order: {
    inputSchema: z.object({
      params: z.object({
        cart: z.array(z.object({
          product_id: z.string().describe('Product ID e.g. CAKE00KA001843'),
          quantity: z.number().int().min(1).max(99).default(1),
          icing_text: z.string().max(120).optional().describe('Icing message for cakes, max 120 chars'),
        })).min(1).max(30).describe('Cart items to order'),
        recipient: z.object({
          name: z.string().min(1).describe('Recipient full name'),
          phone: z.string().describe('Sri Lankan phone number e.g. 0771234567 or +94771234567'),
        }),
        delivery: z.object({
          address: z.string().min(3).describe('Full delivery address'),
          city: z.string().describe('Canonical city name from list_delivery_cities'),
          date: z.string().describe('Delivery date in YYYY-MM-DD format (today or future)'),
          location_type: z.enum(['house', 'apartment', 'office', 'other']).optional().default('house'),
          instructions: z.string().max(250).optional().describe('Free-form delivery instructions'),
        }),
        sender: z.object({
          name: z.string().min(1).describe('Sender name on the gift card'),
          anonymous: z.boolean().optional().default(false).describe('Hide sender name from recipient'),
        }),
        gift_message: z.string().max(300).optional().describe('Gift message to include with the order'),
        currency: z.string().optional().default('LKR'),
        response_format: z.literal('json').optional().default('json'),
      }),
    }),
  },
  kapruka_track_order: {
    inputSchema: z.object({
      params: z.object({
        order_number: z.string().describe('VIMP tracking number from confirmation email'),
        response_format: z.literal('json').optional().default('json'),
      }),
    }),
  },
}

export async function callGemini(
  history: HistoryMessage[],
  cart: CartItem[],
  lastVimp?: string | null,
  favorites: Product[] = [],
  lang: 'en' | 'si' = 'en'
): Promise<Record<string, unknown>> {
  const mcpClient = await createMCPClient({
    transport: { type: 'http', url: 'https://mcp.kapruka.com/mcp' },
  })

  try {
    // Use our static Zod schemas — makes Gemini happy while keeping real MCP execution
    const tools = await mcpClient.tools({ schemas: KAPRUKA_SCHEMAS })

    const messages = history.map((m) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const content: any[] = [{ type: 'text', text: m.text }]
      if (m.image) {
        content.push({ type: 'image', image: m.image })
      }
      return {
        role: m.role as 'user' | 'assistant',
        content,
      }
    })

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system: buildSystemPrompt(cart, lastVimp, favorites, lang),
      messages,
      tools,
      stopWhen: stepCountIs(6),
    })

    return parseClaudeResponse(text) as unknown as Record<string, unknown>
  } finally {
    await mcpClient.close()
  }
}
