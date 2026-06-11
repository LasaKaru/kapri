import type { Category } from './types'
import { CATEGORIES, OCCASIONS } from './data'

/**
 * Category presentation metadata for the dynamic "Shop by Category" strip.
 *
 * kapruka_list_categories returns only { name, url } — no images, and some
 * names are raw slugs ("combopack", "newyear_january"). This module turns the
 * raw MCP list into nice display tiles:
 *   - a friendly label,
 *   - an emoji (used as the image fallback),
 *   - a real image pulled live from the category landing page's og:image via
 *     the /api/product-image proxy (so brand-new categories get an image too).
 */
const IMG = (id: string) => `https://images.unsplash.com/${id}?w=500&h=500&fit=crop`

const STATIC_IMAGES: Record<string, string> = {
  perfumes: IMG('photo-1523293182086-7651a899d37f'),
  fruits: IMG('photo-1601004890684-d8cbf643f5f2'),
  grocery: IMG('photo-1542838132-92c53300491e'),
  clothing: IMG('photo-1441984904996-e0b6ba687e04'),
  fashion: IMG('photo-1743764180148-b712e5293800'),
  gift: IMG('photo-1549465220-1a8b9238cd48'),
  bestsellers: IMG('photo-1589828994425-cee7c6e8dbf8'),
  newadditions: IMG('photo-1620924049153-4d32fcbe88fe'),
  'adult products': IMG('photo-1654512041772-446bd165a3b3'),
  automobile: IMG('photo-1580273916550-e323be2ae537'),
  ayurvedic: IMG('photo-1492552181161-62217fc3076d'),
  babyitems: IMG('photo-1533483595632-c5f0e57a1936'),
  bicycle: IMG('photo-1485965120184-e220f721d03e'),
  bridetobe: IMG('photo-1519741497674-611481863552'),
  childrensday: IMG('photo-1540479859555-17af45c78602'),
  childrens: IMG('photo-1540479859555-17af45c78602'),
  christmas: IMG('photo-1545048702-79362596cdc9'),
  corporate: IMG('photo-1773332598414-44a45e364d85'),
  curd: IMG('photo-1581868164904-77b124b80242'),
  diwali: IMG('photo-1605292356183-a77d0a9c9d1d'),
  food: IMG('photo-1546069901-ba9599a7e63c'),
  giftcert: IMG('photo-1526614180703-827d23e7c8f2'),
  greetingcards: IMG('photo-1566125882500-87e10f726cdc'),
  halloween: IMG('photo-1477516561410-f0b5dd8319e4'),
  household: IMG('photo-1619216083420-6e54b895f730'),
  lover: IMG('photo-1518621736915-f3b1c41bfd00'),
  momtobe: IMG('photo-1533483595632-c5f0e57a1936'),
  newyear_january: IMG('photo-1573690706484-86f444f0b940'),
  ornaments: IMG('photo-1553986782-9f6de60b51b4'),
  party: IMG('photo-1517263904808-5dc91e3e7044'),
  pet: IMG('photo-1530281700549-e82e7bf110d6'),
  pharmacy: IMG('photo-1631549916768-4119b2e5f926'),
  pirikara: IMG('photo-1549465220-1a8b9238cd48'),
  promotions: IMG('photo-1587614313085-5da51cebd8ac'),
  samedaydelivery: IMG('photo-1616432043562-3671ea2e5242'),
  schoolpride: IMG('photo-1503676260728-1c00da094a0b'),
  services: IMG('photo-1605152276897-4f618f831968'),
  sports: IMG('photo-1461896836934-ffe607ba8211'),
  sympathies: IMG('photo-1682352689072-7b2c0b8580c2'),
  teachersday: IMG('photo-1580894732444-8ecded7900cd'),
  thaipongle: IMG('photo-1732603891196-2b8cc24f39a5'),
  uniquegifts: IMG('photo-1549465220-1a8b9238cd48'),
  valentine: IMG('photo-1518199266791-5375a83190b7'),
  vegetables: IMG('photo-1555939594-58d7cb561ad1'),
  womenday: IMG('photo-1580489944761-15a19d654956'),
  youandme: IMG('photo-1591969851586-adbbd4accf81'),
  combopack: IMG('photo-1737999183056-20bf6b8952e6'),
  softtoy: IMG('photo-1615486363973-f79d875780cf'),
  liquor: IMG('photo-1569529465841-dfecdab7503b'),
  'personalized gifts': IMG('photo-1549465220-1a8b9238cd48'),
  personalizedgifts: IMG('photo-1549465220-1a8b9238cd48'),
  fathersday: IMG('photo-1506506200949-df8644f002d1'),
}

CATEGORIES.forEach(c => {
  if (c.img) STATIC_IMAGES[c.name.toLowerCase()] = c.img
  if (c.img && c.q) STATIC_IMAGES[c.q.toLowerCase()] = c.img
})
OCCASIONS.forEach(o => {
  if (o.img) STATIC_IMAGES[o.name.toLowerCase()] = o.img
  if (o.img && o.q) STATIC_IMAGES[o.q.toLowerCase()] = o.img
})

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
  mother: 'For Mom',
  father: 'For Dad',
}

/** Emoji per category (fallback tile when the image can't load). Keyed by lowercased name. */
const EMOJI: Record<string, string> = {
  cakes: '🎂', flowers: '🌹', chocolates: '🍫', giftset: '🧺', combopack: '🎁',
  jewellery: '💍', electronic: '📱', cosmetics: '🧴', perfumes: '🌸', kidstoys: '🧸',
  softtoy: '🧸', books: '📚', fruits: '🍎', grocery: '🛒',
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
  'electronic', 'cosmetics', 'perfumes', 'kidstoys', 'softtoy',
  'books', 'fruits', 'grocery', 'fashion', 'clothing', 'bestsellers',
  'newadditions', 'birthday', 'anniversary', 'mother', 'father', 'wedding', 'graduation'
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
      img: STATIC_IMAGES[c.name.toLowerCase()] || STATIC_IMAGES[prettifyCategory(c.name).toLowerCase()],
    }))
}

/** 
 * Splits the raw Kapruka list into regular Categories and Occasions/Recipients, 
 * then converts both into display tiles. 
 */
export function splitCategories(raw: RawCategory[]): { categories: Category[], occasions: Category[] } {
  const OCCASION_KEYS = new Set([
    'birthday', 'anniversary', 'wedding', 'bridetobe', 'childrensday', 
    'christmas', 'diwali', 'fathersday', 'graduation', 'halloween', 
    'momtobe', 'mother', 'father', 'newyear_january', 'party', 
    'sympathies', 'teachersday', 'thaipongle', 'valentine', 'womenday', 
    'youandme', 'lover'
  ])

  const catRaw: RawCategory[] = []
  const occRaw: RawCategory[] = []
  
  const seen = new Set<string>()
  const uniqueRaw = raw.filter(r => {
    if (!r?.name) return false
    const key = r.name.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  
  for (const r of uniqueRaw) {
    if (OCCASION_KEYS.has(r.name.toLowerCase())) {
      occRaw.push(r)
    } else {
      catRaw.push(r)
    }
  }

  return {
    categories: toCategoryTiles(catRaw),
    occasions: toCategoryTiles(occRaw),
  }
}
