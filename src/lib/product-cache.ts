/**
 * Product Cache — server-side JSON cache for Kapruka MCP products.
 *
 * Every successful Tier 1/2 response that contains product data is
 * cached here. Tier 3 (scripted engine) reads from this cache first,
 * falling back to the hardcoded CATALOG only if the cache is empty.
 *
 * - Cache resets at midnight Sri Lanka time (Asia/Colombo, UTC+5:30).
 * - Capped at 500 products; oldest entries evicted first.
 * - Fire-and-forget writes — never blocks the response pipeline.
 */
import fs from 'fs'
import path from 'path'
import type { Product, City } from './types'

const CACHE_PATH = path.join(process.cwd(), 'product-cache.json')
const MAX_PRODUCTS = 1000

interface CacheData {
  date: string            // YYYY-MM-DD in Asia/Colombo — cache resets when this changes
  products: Record<string, Product & { cachedAt: string }>
  cities: Record<string, City>
}

/** Get today's date string in Sri Lanka timezone */
function todaySLT(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' })  // YYYY-MM-DD
}

/** Read the cache file. Returns a fresh structure if missing, corrupted, or expired. */
function readCache(): CacheData {
  const today = todaySLT()
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const raw = fs.readFileSync(CACHE_PATH, 'utf-8')
      const data: CacheData = JSON.parse(raw)
      // Expired? Reset at midnight
      if (data.date !== today) {
        console.log('[ProductCache] New day — cache reset')
        return { date: today, products: {}, cities: {} }
      }
      return data
    }
  } catch (err) {
    console.error('[ProductCache] Read error, starting fresh:', (err as Error).message)
  }
  return { date: today, products: {}, cities: {} }
}

/** Write the cache file (fire-and-forget, async). */
function writeCache(data: CacheData): void {
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(data), 'utf-8')
  } catch (err) {
    console.error('[ProductCache] Write error:', (err as Error).message)
  }
}

/**
 * Cache an array of products. Deduplicates by ID, caps at MAX_PRODUCTS,
 * evicting the oldest entries (by cachedAt) first.
 */
export function cacheProducts(products: Product[]): void {
  if (!products || products.length === 0) return
  try {
    const data = readCache()
    const now = new Date().toISOString()

    for (const p of products) {
      if (!p.id || !p.name) continue
      data.products[p.id] = { ...p, cachedAt: now }
    }

    // Enforce cap — evict oldest entries
    const entries = Object.entries(data.products)
    if (entries.length > MAX_PRODUCTS) {
      entries.sort((a, b) => a[1].cachedAt.localeCompare(b[1].cachedAt))
      const toRemove = entries.slice(0, entries.length - MAX_PRODUCTS)
      for (const [id] of toRemove) {
        delete data.products[id]
      }
    }

    writeCache(data)
    console.log(`[ProductCache] Cached ${products.length} product(s), total: ${Object.keys(data.products).length}`)
  } catch (err) {
    console.error('[ProductCache] cacheProducts error:', (err as Error).message)
  }
}

/** Cache delivery cities from MCP responses. */
export function cacheCities(cities: City[]): void {
  if (!cities || cities.length === 0) return
  try {
    const data = readCache()
    for (const c of cities) {
      if (!c.name) continue
      data.cities[c.name] = c
    }
    writeCache(data)
    console.log(`[ProductCache] Cached ${cities.length} city(ies), total: ${Object.keys(data.cities).length}`)
  } catch (err) {
    console.error('[ProductCache] cacheCities error:', (err as Error).message)
  }
}

/** Get all cached products as an array. Returns [] if cache is empty or expired. */
export function getCachedProducts(): Product[] {
  try {
    const data = readCache()
    return Object.values(data.products)
  } catch {
    return []
  }
}

/** Get all cached cities as an array. Returns [] if cache is empty or expired. */
export function getCachedCities(): City[] {
  try {
    const data = readCache()
    return Object.values(data.cities)
  } catch {
    return []
  }
}
