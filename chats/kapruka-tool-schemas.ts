import { z } from 'zod'
import { tool } from 'ai'
import type { Tool } from 'ai'

/**
 * Creates static AI SDK tools wrapping the dynamic MCP tools.
 *
 * Why this exists: some providers (Gemini) reject "dynamic" tool type from
 * mcpClient.tools(). We wrap each MCP tool with a native tool() call that
 * has a static Zod schema. The execute function passes args under { params }
 * because the Kapruka MCP validates inputs as { params: { ... } } internally.
 *
 * Param shapes are taken from 09-VERIFIED-MCP-REFERENCE.md.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createStaticKaprukaTools(mcpTools: Record<string, Tool<any, any>>): Record<string, Tool<any, any>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function wrap<T extends z.ZodObject<any>>(name: string, schema: T, description: string) {
    const mcpTool = mcpTools[name]
    if (!mcpTool) return null
    return tool({
      description,
      parameters: schema,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      execute: async (args: any, ctx: any) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return mcpTool.execute!({ params: args }, ctx)
      },
    })
  }

  const tools: Record<string, Tool | null> = {
    kapruka_search_products: wrap(
      'kapruka_search_products',
      z.object({
        q: z.string().describe('Search query, min 3 chars (e.g. "chocolate birthday cake")'),
        category: z.string().optional().describe('Category filter (e.g. "cakes", "flowers", "birthday")'),
        limit: z.number().int().min(1).max(50).optional().describe('Results per page, default 10'),
        cursor: z.string().optional().describe('Pagination cursor from next_cursor'),
        currency: z.string().optional().describe('LKR (default) | USD | GBP | AUD | CAD | EUR'),
        min_price: z.number().optional(),
        max_price: z.number().optional().describe('Maximum price filter'),
        in_stock_only: z.boolean().optional(),
        sort: z.string().optional().describe('relevance | price_asc | price_desc | newest | bestseller'),
      }),
      'Search Kapruka products by keyword with optional filters'
    ),

    kapruka_get_product: wrap(
      'kapruka_get_product',
      z.object({
        product_id: z.string().describe('Product ID, e.g. "cake00ka002034"'),
        currency: z.string().optional(),
      }),
      'Get full details for a single Kapruka product by ID'
    ),

    kapruka_list_categories: wrap(
      'kapruka_list_categories',
      z.object({
        depth: z.number().int().min(1).max(2).optional().describe('1 or 2'),
      }),
      'List all Kapruka product categories'
    ),

    kapruka_list_delivery_cities: wrap(
      'kapruka_list_delivery_cities',
      z.object({
        query: z.string().describe('Partial match on city name — resolves Sinhala/Tanglish names'),
        limit: z.number().int().min(1).max(50).optional().describe('Default 25'),
      }),
      'Search Kapruka delivery cities by name'
    ),

    kapruka_check_delivery: wrap(
      'kapruka_check_delivery',
      z.object({
        city: z.string().describe('Canonical city name from list_delivery_cities'),
        delivery_date: z.string().optional().describe('YYYY-MM-DD, defaults to today'),
        product_id: z.string().optional().describe('Optional — enables perishable-item warning'),
      }),
      'Check delivery availability for a city and optional date'
    ),

    kapruka_create_order: wrap(
      'kapruka_create_order',
      z.object({
        cart: z
          .array(
            z.object({
              product_id: z.string(),
              quantity: z.number().int().min(1).max(99).default(1),
              icing_text: z.string().max(120).optional().describe('Cakes only — message on the cake'),
            })
          )
          .min(1)
          .max(30),
        recipient: z.object({
          name: z.string().describe('Recipient full name'),
          phone: z.string().describe('E.164 (+9477…) or local (077…)'),
        }),
        delivery: z.object({
          address: z.string(),
          city: z.string().describe('Must be a valid Kapruka delivery city'),
          location_type: z.string().optional().describe('house | apartment | office | other'),
          date: z.string().describe('YYYY-MM-DD, today or future'),
          instructions: z.string().optional(),
        }),
        sender: z.object({
          name: z.string(),
          anonymous: z.boolean().optional(),
        }),
        gift_message: z.string().max(300).optional(),
        currency: z.string().optional(),
      }),
      'Create a Kapruka guest checkout order'
    ),

    kapruka_track_order: wrap(
      'kapruka_track_order',
      z.object({
        order_number: z.string().describe('Paid-order number from the email (e.g. VIMP34456CB2)'),
      }),
      'Track the status of a Kapruka order by order number'
    ),
  }

  // Filter out any tools that weren't available in the MCP client
  return Object.fromEntries(
    Object.entries(tools).filter(([, v]) => v !== null)
  ) as Record<string, Tool>
}
