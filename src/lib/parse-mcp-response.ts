import type { EngineResponse } from './types'

/**
 * Parse Claude's JSON response from the MCP-powered chat.
 * Claude is instructed to return pure JSON but may sometimes wrap it
 * in markdown code fences or add explanatory text. This handles that.
 */
export function parseClaudeResponse(raw: string): EngineResponse {
  const text = raw.trim()

  // Try direct JSON parse first (happy path)
  try {
    const parsed = JSON.parse(text)
    if (parsed && typeof parsed === 'object') return normalise(parsed)
  } catch { /* continue */ }

  // Extract JSON from markdown code fences ```json ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    try {
      const parsed = JSON.parse(fenceMatch[1].trim())
      if (parsed && typeof parsed === 'object') return normalise(parsed)
    } catch { /* continue */ }
  }

  // Extract JSON from { ... } block (find outermost braces)
  const braceStart = text.indexOf('{')
  const braceEnd = text.lastIndexOf('}')
  if (braceStart !== -1 && braceEnd > braceStart) {
    try {
      const parsed = JSON.parse(text.slice(braceStart, braceEnd + 1))
      if (parsed && typeof parsed === 'object') return normalise(parsed)
    } catch { /* continue */ }
  }

  // Last resort: return raw text as plain response
  return { lang: 'en', text: text || "I'm having trouble right now. Please try again!" }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalise(obj: Record<string, any>): EngineResponse {
  const result: EngineResponse = {
    lang: obj.lang ?? 'en',
    text: typeof obj.text === 'string' ? obj.text : undefined,
    chips: Array.isArray(obj.chips) ? obj.chips.filter((c: unknown) => typeof c === 'string') : undefined,
    card: obj.card ?? undefined,
  }

  // Normalise carousel items from MCP data shapes
  if (result.card?.type === 'carousel' && Array.isArray(result.card.items)) {
    result.card = {
      type: 'carousel',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: result.card.items.map((item: any) => ({
        id: String(item.id ?? item.product_id ?? ''),
        name: String(item.name ?? ''),
        summary: String(item.summary ?? item.description ?? ''),
        price: parsePrice(item.price),
        was: item.was != null ? parsePrice(item.was) : undefined,
        cat: String(item.cat ?? item.category?.name ?? ''),
        img: String(item.img ?? item.image_url ?? ''),
        inStock: Boolean(item.inStock ?? item.in_stock ?? true),
        low: Boolean(item.low ?? (item.stock_level === 'low')),
        perishable: Boolean(item.perishable),
        url: String(item.url ?? ''),
        occ: Array.isArray(item.occ) ? item.occ : [],
      })),
    }
  }

  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePrice(val: any): number {
  if (typeof val === 'number') return val
  if (val && typeof val === 'object' && val.amount != null) return Number(val.amount)
  return 0
}
