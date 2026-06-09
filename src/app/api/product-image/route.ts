import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache for product images
const imageCache = new Map<string, { url: string; ts: number }>()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export async function GET(req: NextRequest) {
  const productUrl = req.nextUrl.searchParams.get('url')
  if (!productUrl) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  // Check cache
  const cached = imageCache.get(productUrl)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.redirect(cached.url)
  }

  try {
    // Fetch the Kapruka product page
    const pageRes = await fetch(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Kapruka-Kapri/1.0)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(5000),
    })

    if (!pageRes.ok) throw new Error(`Page fetch failed: ${pageRes.status}`)

    const html = await pageRes.text()

    // Extract og:image
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)

    if (ogMatch?.[1]) {
      const imgUrl = ogMatch[1]
      imageCache.set(productUrl, { url: imgUrl, ts: Date.now() })
      return NextResponse.redirect(imgUrl)
    }

    // Try to find any product image in page
    const imgMatch = html.match(/https:\/\/static2\.kapruka\.com\/[^"'\s]+\.(jpg|jpeg|png|webp)/i)
    if (imgMatch?.[0]) {
      const imgUrl = imgMatch[0]
      imageCache.set(productUrl, { url: imgUrl, ts: Date.now() })
      return NextResponse.redirect(imgUrl)
    }

    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  } catch (err) {
    console.error('Product image proxy error:', err)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
}
