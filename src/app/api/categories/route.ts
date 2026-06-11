import { NextResponse } from 'next/server'
import { callKaprukaTool } from '@/lib/kapruka-mcp'
import { splitCategories, type RawCategory } from '@/lib/category-meta'
import type { Category } from '@/lib/types'

/**
 * Live category strip for the home screen.
 *
 * Calls kapruka_list_categories via the raw MCP client and returns ready-to-
 * render tiles (label, emoji, image-proxy URL, click query). Cached in-memory
 * for 30 minutes — matching the MCP server's own product/category cache — so
 * the home screen doesn't hit MCP on every visit. New categories on Kapruka
 * appear automatically on the next cache refresh.
 */

let cache: { categories: Category[]; occasions: Category[]; ts: number } | null = null
const TTL = 30 * 60 * 1000 // 30 minutes

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractRaw(data: any): RawCategory[] {
  // JSON shape: { categories: [{ name, url, children? }] }
  if (data && Array.isArray(data.categories)) {
    return data.categories.map((c: { name: string; url: string }) => ({ name: c.name, url: c.url }))
  }
  // Markdown fallback: "- [Name](url)" lines
  if (typeof data === 'string') {
    const out: RawCategory[] = []
    const re = /^\s*-\s*\[([^\]]+)\]\(([^)]+)\)/gm
    let m
    while ((m = re.exec(data)) !== null) out.push({ name: m[1], url: m[2] })
    return out
  }
  return []
}

export async function GET() {
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev && cache && Date.now() - cache.ts < TTL) {
    return NextResponse.json({ ok: true, categories: cache.categories, occasions: cache.occasions, cached: true })
  }

  const result = await callKaprukaTool('kapruka_list_categories', { depth: 1, response_format: 'json' })
  if (!result.ok) {
    // Serve stale cache if we have it; otherwise signal failure so the client keeps its static list.
    if (cache) return NextResponse.json({ ok: true, categories: cache.categories, occasions: cache.occasions, cached: true, stale: true })
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 })
  }

  const raw = extractRaw(result.data)
  if (raw.length === 0) {
    if (cache) return NextResponse.json({ ok: true, categories: cache.categories, occasions: cache.occasions, cached: true, stale: true })
    return NextResponse.json({ ok: false, error: 'No categories returned' }, { status: 502 })
  }

  const { categories, occasions } = splitCategories(raw)
  cache = { categories, occasions, ts: Date.now() }
  return NextResponse.json({ ok: true, categories, occasions })
}
