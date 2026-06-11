import { NextResponse } from 'next/server'
import { callKaprukaTool } from '@/lib/kapruka-mcp'

/**
 * Place a REAL Kapruka guest-checkout order from the UI checkout form.
 *
 * Body shape (built by CheckoutFlow):
 * {
 *   cart: [{ product_id, quantity, icing_text? }],
 *   recipient: { name, phone },
 *   delivery: { address, city, date, location_type?, instructions? },
 *   sender: { name, anonymous? },
 *   gift_message?: string,
 *   currency?: string
 * }
 *
 * Returns the live kapruka_create_order result (checkout_url, order_ref,
 * summary) so the client can show a real click-to-pay link. On any failure
 * (invalid/offline product IDs, non-deliverable city, rate limit) it returns
 * { ok:false, error } and the client falls back to its simulated flow.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Minimal validation — the MCP server does the authoritative checks.
    if (!Array.isArray(body?.cart) || body.cart.length === 0) {
      return NextResponse.json({ ok: false, error: 'Cart is empty' }, { status: 400 })
    }
    if (!body?.recipient?.name || !body?.recipient?.phone) {
      return NextResponse.json({ ok: false, error: 'Recipient name and phone are required' }, { status: 400 })
    }
    if (!body?.delivery?.address || !body?.delivery?.city || !body?.delivery?.date) {
      return NextResponse.json({ ok: false, error: 'Delivery address, city and date are required' }, { status: 400 })
    }
    if (!body?.sender?.name) {
      return NextResponse.json({ ok: false, error: 'Sender name is required' }, { status: 400 })
    }

    const result = await callKaprukaTool('kapruka_create_order', {
      cart: body.cart,
      recipient: body.recipient,
      delivery: body.delivery,
      sender: body.sender,
      gift_message: body.gift_message ?? undefined,
      currency: body.currency ?? 'LKR',
      response_format: 'json',
    })

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 502 })
    }
    return NextResponse.json({ ok: true, order: result.data })
  } catch (err) {
    console.error('[orders/create] error:', err)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
