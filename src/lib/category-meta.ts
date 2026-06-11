import type { Category } from './types'

/**
 * Category presentation metadata for the dynamic "Shop by Category" strip.
 *
 * kapruka_list_categories returns only { name, url } — no images, and some
 * names are raw slugs ("combopack", "newyear_january"). This module turns the
 * raw MCP list into nice display tiles:
 *   - a friendly label,
 *   - an emoji (used as the image fallback),
 *   - a real image pulled live from the category landing page's og:image via
 *     the /api/product-image proxy (so brand-new categories get an image too),
 *   - a sensible display order (popular shopping categories first).
 */

/** Friendly labels for raw/ugly category slugs (keyed by lowercased name). */
const LABELS: Record<string, string> = {
  combopack: 'Combo Packs',
  giftset: 'Gift Sets',
  giftcert: 'Gift Vouchers',
  greetingcards: 'Greeting Cards',
  kidstoys: 'Kids & Toys',
  softtoy: 'Soft Toys',
  babyitems: 'Baby Items',
  schoolpride: 'School Pride',
  uniquegifts: 'Unique Gifts',
  bestsellers: 'Bestsellers',
  newadditions: 'New Arrivals',
  newyear_january: 'New Year',
  samedaydelivery: 'Same-Day Delivery',
  childrensday: "Children's Day",
  fathersday: "Father's Day",
  teachersday: "Teachers' Day",
  womenday: "Women's Day",
  momtobe: 'Mom to Be',
  bridetobe: 'Bride to Be',
  youandme: 'You & Me',
  thaipongle: 'Thai Pongal',
  pirikara: 'Pirikara',
  electronic: 'Electronics',
  household: 'Household',
  ornaments: 'Ornaments',
  promotions: 'Promotions',
  sympathies: 'Sympathies',
  corporate: 'Corporate',
  diwali: 'Deepavali',
}

/** Emoji per category (fallback tile when the image can't load). Keyed by lowercased name. */
const EMOJI: Record<string, string> = {
  cakes: '🎂', flowers: '🌹', chocolates: '🍫', giftset: '🧺', combopack: '🎁',
  jewellery: '💍', electronic: '📱', cosmetics: '🧴', perfumes: '🌸', kidstoys: '🧸',
  softtoy: '🧸', liquor: '🍷', books: '📚', fruits: '🍎', grocery: '🛒',
  vegetables: '🥦', curd: '🥛', clothing: '👕', fashion: '👗', sports: '⚽',
  pet: '🐾', pharmacy: '💊', automobile: '🚗', bicycle: '🚲', household: '🏠',
  babyitems: '🍼', childrens: '🧒', greetingcards: '💌', giftcert: '🎟️',
  birthday: '🎉', anniversary: '💞', wedding: '💒', valentine: '❤️', mother: '👩',
  father: '👨', christmas: '🎄', diwali: '🪔', halloween: '🎃', graduation: '🎓',
  corporate: '💼', sympathies: '🕊️', bestsellers: '⭐', newadditions: '🆕',
  promotions: '🏷️', food: '🍽️', ayurvedic: '🌿', services: '🛠️', ornaments: '🏺',
}

/** Preferred display order — popular shopping categories first (lowercased names). */
const PRIORITY = [
  'cakes', 'flowers', 'chocolates', 'giftset', 'combopack', 'jewellery',
  'electronic', 'cosmetics', 'perfumes', 'kidstoys', 'softtoy', 'liquor',
  'books', 'fruits', 'grocery', 'fashion', 'clothing', 'bestsellers',
  'newadditions', 'birthday', 'anniversary', 'wedding',
]

/** Title-case a raw slug/name for display (handles _ separators and camelCase). */
export function prettifyCategory(name: string): string {
  const key = name.toLowerCase()
  if (LABELS[key]) return LABELS[key]
  return name
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export type RawCategory = { name: string; url: string }

/**
 * Turn the raw MCP category list into ordered display tiles. The image is the
 * category landing page's og:image, fetched through our proxy so it stays in
 * sync with the live catalog and works for categories we've never seen.
 */
export function toCategoryTiles(raw: RawCategory[]): Category[] {
  const rank = (n: string) => {
    const i = PRIORITY.indexOf(n.toLowerCase())
    return i === -1 ? PRIORITY.length : i
  }
  return [...raw]
    .filter((c) => c?.name && c?.url)
    .sort((a, b) => {
      const r = rank(a.name) - rank(b.name)
      if (r !== 0) return r
      return prettifyCategory(a.name).localeCompare(prettifyCategory(b.name))
    })
    .map((c) => ({
      name: prettifyCategory(c.name),
      emoji: EMOJI[c.name.toLowerCase()] || '🎁',
      q: prettifyCategory(c.name),
      img: `/api/product-image?url=${encodeURIComponent(c.url)}`,
    }))
}
