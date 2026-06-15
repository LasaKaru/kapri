import type { EngineResponse } from './types'
import { cacheProducts } from './product-cache'

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

  // Normalise tracker cards built from kapruka_track_order. The model may pass
  // raw MCP fields (status, status_display, delivery_date) or the app's own
  // names — accept both and map status → a 0–3 stage for the progress bar.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (result.card?.type === 'tracker') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = result.card as any
    const STAGE: Record<string, number> = {
      received: 0, confirmed: 1, processing: 1, preparing: 1,
      shipped: 2, 'out-for-delivery': 2, 'out for delivery': 2, dispatched: 2,
      delivered: 3, completed: 3,
    }
    const status = String(t.status ?? '').toLowerCase()
    result.card = {
      type: 'tracker',
      number: t.number ?? t.order_number ?? undefined,
      statusDisplay: t.statusDisplay ?? t.status_display ?? undefined,
      stage: t.stage != null ? Number(t.stage) : (status in STAGE ? STAGE[status] : undefined),
      live: t.live != null ? Boolean(t.live) : Boolean(t.live_tracking_available),
      orderDate: t.orderDate ?? t.order_date ?? undefined,
      deliveryDate: t.deliveryDate ?? t.delivery_date ?? undefined,
      recipient: typeof t.recipient === 'string' ? t.recipient
        : (t.recipient && typeof t.recipient.name === 'string' ? t.recipient.name : undefined),
      amount: t.amount != null ? parsePrice(t.amount) : undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: Array.isArray(t.items) ? t.items.map((i: any) => ({
        img: String(i.img ?? i.image_url ?? ''),
        name: String(i.name ?? ''),
        qty: Number(i.qty ?? i.quantity ?? 1),
        price: parsePrice(i.price),
        icing: i.icing ?? i.icing_text ?? undefined,
      })) : undefined,
    }
  }

  // Normalise checkout cards. The model builds these after kapruka_create_order,
  // so the fields may arrive with MCP names (order_ref, checkout_url, grand_total).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (result.card?.type === 'checkout' && (result.card as any).order) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const o = (result.card as any).order
    result.card = {
      type: 'checkout',
      order: {
        ref: String(o.ref ?? o.order_ref ?? ''),
        city: String(o.city ?? ''),
        date: o.date ?? undefined,
        rate: parsePrice(o.rate ?? o.delivery_fee),
        recipient: String(o.recipient ?? ''),
        phone: String(o.phone ?? ''),
        address: String(o.address ?? ''),
        notes: String(o.notes ?? ''),
        sender: String(o.sender ?? ''),
        msg: String(o.msg ?? o.gift_message ?? ''),
        items: Array.isArray(o.items) ? o.items : [],
        subtotal: parsePrice(o.subtotal ?? o.items_total),
        total: parsePrice(o.total ?? o.grand_total),
        perishable: Boolean(o.perishable),
        url: o.url ?? o.checkout_url ?? undefined,
      },
    }
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
    // Fire-and-forget: cache real Kapruka products for Tier 3
    try { cacheProducts(result.card.items) } catch { /* never block response */ }
  }

  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePrice(val: any): number {
  if (typeof val === 'number') return val
  if (val && typeof val === 'object' && val.amount != null) return Number(val.amount)
  return 0
}
