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
import type { Product, City, EngineResponse } from './types'
import { CATALOG } from './data'
import { createMCPClient } from '@ai-sdk/mcp'
import { z } from 'zod'

const PRODUCTS_KEY = 'kapri:products'
const CITIES_KEY = 'kapri:cities'
const MAX_PRODUCTS = 1000

export function cacheProducts(products: Product[]): void {
  if (!products || products.length === 0) return
  
  try {
    const validProducts = products.filter(p => p && p.id && p.name && p.img)
    if (validProducts.length === 0) return
    
    const pipeline = kv.pipeline()
    for (const p of validProducts) {
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
    return Object.values(data).filter(p => p && p.img)
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

export async function enrichEngineResponse(response: EngineResponse): Promise<void> {
  if (!response?.card) return
  
  const items: any[] = []
  if (response.card.type === 'carousel' && Array.isArray(response.card.items)) {
    items.push(...response.card.items)
  } else if (response.card.type === 'comparison' && Array.isArray(response.card.items)) {
    items.push(...response.card.items.map((i: any) => i.product).filter(Boolean))
  }
  
  const missingImgItems = items.filter(p => {
    if (!p || !p.id) return false
    if (!p.img || typeof p.img !== 'string') return true
    if (p.img.length < 10) return true
    if (!p.img.startsWith('http')) return true
    return false
  })
  if (missingImgItems.length === 0) return

  const cached = await getCachedProducts()
  
  let mcpClient: any = null
  let mcpTools: any = null
  
  try {
    for (const item of missingImgItems) {
      const found = cached.find(c => c.id === item.id) || CATALOG.find(c => c.id === item.id)
      if (found && found.img) {
        item.img = found.img
        if (!item.name) item.name = found.name
        if (!item.price) item.price = found.price
        if (!item.cat) item.cat = found.cat
      } else if (item.id) {
        // If image is still missing (hallucinated from user text), fetch it from MCP
        try {
          if (!mcpClient) {
            mcpClient = await createMCPClient({
              transport: { type: 'http', url: 'https://mcp.kapruka.com/mcp' },
            })
            mcpTools = await mcpClient.tools({
              schemas: {
                kapruka_get_product: {
                  inputSchema: z.object({
                    params: z.object({ product_id: z.string() })
                  })
                }
              }
            })
          }
          
          // Execute tool to get real product data
          const result = await mcpTools.kapruka_get_product.execute({ params: { product_id: item.id } }) as string | { content?: { text?: string }[] } | undefined
          
          let text = ''
          if (typeof result === 'string') text = result
          else if (result && typeof result === 'object' && Array.isArray(result.content)) {
            text = result.content[0]?.text || ''
          } else if (result && typeof result === 'object' && (result as any).text) {
            text = (result as any).text
          }
          
          console.log(`[ProductCache] MCP result text length:`, text?.length)
          if (text) {
            const imgMatch = text.match(/\*\*Image\*\*:\s*(https:\/\/[^\s]+)/)
            console.log(`[ProductCache] ImgMatch for ${item.id}:`, imgMatch?.[1])
            if (imgMatch && imgMatch[1]) {
              item.img = imgMatch[1]
              // Cache the newly enriched product to prevent future lookups
              cacheProducts([item])
            }
          }
        } catch (err) {
          console.error('[ProductCache] Failed to enrich product from MCP:', item.id, err)
        }
      }
    }
  } finally {
    if (mcpClient) {
      try { await mcpClient.close() } catch (e) { /* ignore */ }
    }
  }
}

