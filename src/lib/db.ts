import { createClient } from '@vercel/kv'
import type { PlacedOrder } from './types'

// Support both legacy Vercel KV and the new Upstash Marketplace integration
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

const kv = url && token ? createClient({ url, token }) : null

export async function saveOrderToDb(order: PlacedOrder) {
  if (!kv) {
    console.warn('Vercel KV/Upstash credentials missing, skipping DB save.')
    return
  }
  
  try {
    await kv.set(`order:${order.number}`, order)
  } catch (error) {
    console.error('Failed to save order to DB:', error)
  }
}

export async function getOrderFromDb(orderNumber: string): Promise<PlacedOrder | null> {
  if (!kv) return null
  
  try {
    const order = await kv.get<PlacedOrder>(`order:${orderNumber}`)
    return order
  } catch (error) {
    console.error('Failed to get order from Vercel KV:', error)
    return null
  }
}
