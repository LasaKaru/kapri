import type { KaprukaProduct, KaprukaSearchResult, KaprukaDeliveryCheck, KaprukaOrderResult, KaprukaCitiesResult, KaprukaTrackOrder, KaprukaTrackProgressStep, KaprukaTrackItem } from '@/types/kapruka'

/**
 * Extract the text content from an MCP tool result envelope.
 *
 * MCP results come back as:
 *   { content: [{ type: "text", text: "..." }], structuredContent: { result: "..." }, isError: false }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractMcpText(data: unknown): { text: string; isError: boolean } | null {
  if (data === null || data === undefined) return null
  if (typeof data === 'string') return { text: data, isError: false }

  if (typeof data !== 'object') return null
  const obj = data as Record<string, unknown>

  const isError = obj.isError === true

  // Try content array first
  if (Array.isArray(obj.content) && obj.content.length > 0) {
    const first = obj.content[0] as Record<string, unknown>
    if (typeof first?.text === 'string') {
      return { text: first.text, isError }
    }
  }

  // Try structuredContent.result
  if (obj.structuredContent && typeof (obj.structuredContent as Record<string, unknown>).result === 'string') {
    return { text: (obj.structuredContent as Record<string, unknown>).result as string, isError }
  }

  // Try value array (alternate envelope)
  if (Array.isArray(obj.value) && obj.value.length > 0) {
    const first = obj.value[0] as Record<string, unknown>
    if (typeof first?.text === 'string') {
      return { text: first.text, isError }
    }
  }

  return null
}

/**
 * Parse products from the MCP's markdown format.
 *
 * Expected format:
 * **1. Product Name**
 *    ID: `PRODUCT_ID` · LKR 6,500 · In stock (low) · ships internationally
 *    [View product](URL)
 */
export function parseProductsFromMarkdown(text: string): KaprukaSearchResult {
  const products: KaprukaProduct[] = []

  // Extract cursor from: *More results available. Pass `cursor="..."` for the next page.*
  const cursorMatch = text.match(/cursor="([^"]+)"/)
  const nextCursor = cursorMatch ? cursorMatch[1] : null

  // Match each product block
  const productPattern = /\*\*\d+\.\s+(.+?)\*\*\s*\n\s*ID:\s*`([^`]+)`\s*·\s*(?:LKR|USD|EUR|GBP|AUD|CAD)\s+([\d,]+)\s*·\s*(.*?)·?\s*(?:ships\s+internationally)?\s*\n\s*\[View product\]\(([^)]+)\)/g

  let match
  while ((match = productPattern.exec(text)) !== null) {
    const name = match[1].trim()
    const id = match[2].trim()
    const priceStr = match[3].replace(/,/g, '')
    const price = parseInt(priceStr, 10) || 0
    const stockInfo = match[4].trim()
    const url = match[5].trim()

    // Parse stock info: "In stock (low)", "Out of stock", etc.
    const inStock = stockInfo.toLowerCase().includes('in stock')
    let stockLevel = 'medium'
    const stockLevelMatch = stockInfo.match(/\((\w+)\)/)
    if (stockLevelMatch) {
      stockLevel = stockLevelMatch[1].toLowerCase()
    }

    // Use our new proxy endpoint to resolve the og:image from the product page
    const imageUrl = `/api/product-image?url=${encodeURIComponent(url)}`

    // Try to get category from ID prefix
    let categoryName = 'General'
    const idLower = id.toLowerCase()
    if (idLower.startsWith('cake')) categoryName = 'Cakes'
    else if (idLower.startsWith('flower')) categoryName = 'Flowers'
    else if (idLower.startsWith('combo')) categoryName = 'Combos'
    else if (idLower.startsWith('choco')) categoryName = 'Chocolates'
    else if (idLower.startsWith('gift')) categoryName = 'Gifts'
    else if (idLower.startsWith('toy')) categoryName = 'Toys'
    else if (idLower.startsWith('elec')) categoryName = 'Electronics'
    else if (idLower.startsWith('cloth')) categoryName = 'Clothing'
    else if (idLower.startsWith('groc')) categoryName = 'Grocery'

    products.push({
      id,
      name,
      summary: '',
      price: { amount: price, currency: 'LKR' },
      compare_at_price: null,
      in_stock: inStock,
      stock_level: stockLevel,
      image_url: imageUrl,
      category: { id: categoryName.toLowerCase(), name: categoryName, slug: categoryName.toLowerCase() },
      rating: null,
      ships_internationally: stockInfo.toLowerCase().includes('ships internationally') || text.includes('ships internationally'),
      url,
    })
  }

  return {
    results: products,
    next_cursor: nextCursor,
    applied_filters: {},
  }
}

/**
 * Parse a single product detail from MCP markdown.
 *
 * Expected format similar to search but for a single product with more detail.
 */
export function parseSingleProductFromMarkdown(text: string): KaprukaProduct | null {
  // Try the same pattern but for a single product
  const products = parseProductsFromMarkdown(text).results
  if (products.length > 0) return products[0]

  // Fallback: try to parse a different single-product format
  const nameMatch = text.match(/\*\*(.+?)\*\*/)
  const idMatch = text.match(/ID:\s*`([^`]+)`/)
  const priceMatch = text.match(/(?:LKR|Price:?)\s*([\d,]+)/)
  const urlMatch = text.match(/\[View product\]\(([^)]+)\)/)

  if (nameMatch && idMatch) {
    const id = idMatch[1]
    const url = urlMatch?.[1] ?? `https://www.kapruka.com/buyonline/${id.toLowerCase()}`
    return {
      id,
      name: nameMatch[1].trim(),
      summary: '',
      price: { amount: parseInt((priceMatch?.[1] ?? '0').replace(/,/g, ''), 10), currency: 'LKR' },
      compare_at_price: null,
      in_stock: !text.toLowerCase().includes('out of stock'),
      stock_level: 'medium',
      image_url: `/api/product-image?url=${encodeURIComponent(url)}`,
      category: { id: 'general', name: 'General', slug: 'general' },
      rating: null,
      ships_internationally: text.includes('ships internationally'),
      url,
    }
  }

  return null
}

/**
 * Parse delivery check result from MCP markdown.
 */
export function parseDeliveryFromMarkdown(text: string): KaprukaDeliveryCheck | null {
  const cityMatch = text.match(/(?:City|Delivery to)[:\s]*\**([^*\n·]+)/i)
  const availableMatch = text.match(/(?:available|unavailable|delivery\s+is\s+(available|not available))/i)
  const rateMatch = text.match(/(?:rate|fee|charge)[:\s]*(?:LKR\s*)?([\d,]+)/i)
  const dateMatch = text.match(/(?:date|on)[:\s]*(\d{4}-\d{2}-\d{2})/i)
  const perishMatch = text.match(/(?:perishable|⚠️)[\s:]*(.+?)(?:\n|$)/i)

  if (!cityMatch) return null

  return {
    city: cityMatch[1].trim(),
    now: new Date().toISOString(),
    checked_date: dateMatch?.[1] ?? new Date().toISOString().split('T')[0],
    available: availableMatch ? !text.toLowerCase().includes('not available') && !text.toLowerCase().includes('unavailable') : true,
    rate: parseInt((rateMatch?.[1] ?? '0').replace(/,/g, ''), 10),
    currency: 'LKR',
    reason: null,
    next_available_date: null,
    perishable_warning: perishMatch?.[1]?.trim() ?? null,
  }
}

/**
 * Parse order result from MCP markdown.
 */
export function parseOrderFromMarkdown(text: string): KaprukaOrderResult | null {
  const urlMatch = text.match(/(?:checkout|pay|payment)[^(]*\(([^)]+)\)/i) || text.match(/(https:\/\/[^\s)]+checkout[^\s)]*)/i)
  const refMatch = text.match(/(?:order|ref|reference)[:\s#]*([A-Z0-9-]+)/i)
  const expiresMatch = text.match(/(?:expires?|valid)[:\s]*([^\n]+)/i)
  const totalMatch = text.match(/(?:total|grand)[:\s]*(?:LKR\s*)?([\d,]+)/i)

  if (!urlMatch) return null

  return {
    checkout_url: urlMatch[1],
    order_ref: refMatch?.[1] ?? 'PENDING',
    summary: {
      items_total: 0,
      delivery_fee: 0,
      addons_total: 0,
      grand_total: parseInt((totalMatch?.[1] ?? '0').replace(/,/g, ''), 10),
      currency: 'LKR',
    },
    expires_at: expiresMatch?.[1]?.trim() ?? new Date(Date.now() + 3600000).toISOString(),
  }
}

/**
 * Parse cities from MCP markdown.
 */
export function parseCitiesFromMarkdown(text: string): KaprukaCitiesResult | null {
  const cities: { name: string; aliases: string[] }[] = []

  // Match city entries: **City Name** or - City Name or numbered list
  const cityPattern = /(?:\*\*|(?:^|\n)\s*(?:\d+\.|-)\s*)([A-Za-z\s]+?)(?:\*\*|\s*(?:·|\|)\s*aliases?:\s*(.+?))?(?:\n|$)/g
  let match
  while ((match = cityPattern.exec(text)) !== null) {
    const name = match[1].trim()
    if (name && name.length > 1) {
      const aliases = match[2] ? match[2].split(/[,;]/).map(a => a.trim()).filter(Boolean) : []
      cities.push({ name, aliases })
    }
  }

  if (cities.length === 0) return null

  return {
    cities,
    total_matched: cities.length,
    showing: cities.length,
  }
}

/**
 * Parse order tracking from MCP markdown.
 */
export function parseTrackOrderFromMarkdown(text: string): KaprukaTrackOrder | null {
  const orderMatch = text.match(/(?:order|tracking)[:\s#]*([A-Z0-9]+)/i)
  const statusMatch = text.match(/(?:status)[:\s]*(.+?)(?:\n|$)/i)
  const dateMatch = text.match(/(?:order date|placed)[:\s]*(.+?)(?:\n|$)/i)
  const deliveryDateMatch = text.match(/(?:delivery date|expected)[:\s]*(.+?)(?:\n|$)/i)

  if (!orderMatch) return null

  const progress: KaprukaTrackProgressStep[] = []
  const stepPattern = /(?:✅|☑|✓|→|►)\s*(.+?)(?:\s*[-–—]\s*(.+?))?(?:\n|$)/g
  let stepMatch
  while ((stepMatch = stepPattern.exec(text)) !== null) {
    progress.push({
      step: stepMatch[1].trim(),
      timestamp: stepMatch[2]?.trim() ?? '',
    })
  }

  const items: KaprukaTrackItem[] = []
  const itemPattern = /(?:\d+x|\d+\s*×)\s*(.+?)(?:\s*\(([^)]+)\))?(?:\n|$)/g
  let itemMatch
  while ((itemMatch = itemPattern.exec(text)) !== null) {
    items.push({
      product_id: itemMatch[2] ?? '',
      name: itemMatch[1].trim(),
      quantity: 1,
    })
  }

  return {
    order_number: orderMatch[1],
    status: statusMatch?.[1]?.trim() ?? 'unknown',
    status_display: statusMatch?.[1]?.trim() ?? 'Unknown',
    order_date: dateMatch?.[1]?.trim() ?? '',
    delivery_date: deliveryDateMatch?.[1]?.trim() ?? '',
    shipped_date: null,
    amount: '',
    payment_method: '',
    comments: null,
    recipient: { name: '', phone: '', address: '', city: '' },
    greeting_message: null,
    special_instructions: null,
    progress,
    live_tracking_available: false,
    has_delivery_video: text.includes('video'),
    has_delivery_photo: text.includes('photo'),
    items,
  }
}
