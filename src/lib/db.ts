import { kv } from '@vercel/kv'
import type { PlacedOrder } from './types'

export async function saveOrderToDb(order: PlacedOrder) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.warn('Vercel KV credentials missing, skipping DB save.')
    return
  }
  
  try {
    await kv.set(`order:${order.number}`, order)
  } catch (error) {
    console.error('Failed to save order to Vercel KV:', error)
  }
}

export async function getOrderFromDb(orderNumber: string): Promise<PlacedOrder | null> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null
  }
  
  try {
    const order = await kv.get<PlacedOrder>(`order:${orderNumber}`)
    return order
  } catch (error) {
    console.error('Failed to get order from Vercel KV:', error)
    return null
  }
}
