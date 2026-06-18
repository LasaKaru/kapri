/**
 * Product Cache — server-side Redis cache for Kapruka MCP products via Vercel KV.
 *
 * Every successful Tier 1/2 response that contains product data is
 * cached here. Tier 3 (scripted engine) reads from this cache first,
 * falling back to the hardcoded CATALOG only if the cache is empty.
 *
 * - Cache persists across server restarts.
 * - Fire-and-forget writes — never blocks the response pipeline.
 */
import { kv } from '@vercel/kv'
import type { Product, City } from './types'

const PRODUCTS_KEY = 'kapri:products'
const CITIES_KEY = 'kapri:cities'
const MAX_PRODUCTS = 1000

export function cacheProducts(products: Product[]): void {
  if (!products || products.length === 0) return
  
  try {
    const pipeline = kv.pipeline()
    for (const p of products) {
      if (!p.id || !p.name) continue
      pipeline.hset(PRODUCTS_KEY, { [p.id]: p })
    }
    // Fire and forget
    pipeline.exec().catch(err => {
      console.error('[ProductCache-KV] cacheProducts exec error:', err.message)
    })
  } catch (err) {
    console.error('[ProductCache-KV] cacheProducts error:', (err as Error).message)
  }
}

export function cacheCities(cities: City[]): void {
  if (!cities || cities.length === 0) return
  
  try {
    const pipeline = kv.pipeline()
    for (const c of cities) {
      if (!c.name) continue
      pipeline.hset(CITIES_KEY, { [c.name]: c })
    }
    // Fire and forget
    pipeline.exec().catch(err => {
      console.error('[ProductCache-KV] cacheCities exec error:', err.message)
    })
  } catch (err) {
    console.error('[ProductCache-KV] cacheCities error:', (err as Error).message)
  }
}

export async function getCachedProducts(): Promise<Product[]> {
  try {
    const data = await kv.hgetall<Record<string, Product>>(PRODUCTS_KEY)
    if (!data) return []
    return Object.values(data)
  } catch (err) {
    console.error('[ProductCache-KV] getCachedProducts error:', (err as Error).message)
    return []
  }
}

export async function getCachedCities(): Promise<City[]> {
  try {
    const data = await kv.hgetall<Record<string, City>>(CITIES_KEY)
    if (!data) return []
    return Object.values(data)
  } catch (err) {
    console.error('[ProductCache-KV] getCachedCities error:', (err as Error).message)
    return []
  }
}

