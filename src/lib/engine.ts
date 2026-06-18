/**
 * Tier 3 — Scripted Engine (no API key needed)
 *
 * A comprehensive, offline-capable conversational engine that handles
 * product discovery, delivery quoting, checkout, tracking, greetings,
 * farewell, thank-you, comparisons, recommendations, icing text,
 * price-range queries, category browsing, and graceful fallbacks.
 *
 * Reads from the product cache (real Kapruka MCP data) first, then
 * falls back to the hardcoded CATALOG if the cache has no matches.
 *
 * This is the safety net — the app ALWAYS responds, even with zero API keys.
 */
import type { Lang, EngineResponse, Product } from './types'
import { CATALOG, BUNDLES, CITIES, CATEGORIES } from './data'
import { getCachedProducts, getCachedCities } from './product-cache'
import { detectLang as sharedDetectLang } from './detect-lang'

// ═══════════════════════════════════════════════════════════
//  Language Detection — delegated to shared module
// ═══════════════════════════════════════════════════════════

const SI_WORD_RE = /[\u0D80-\u0DFF]{2,}/g

function detectLang(text: string): Lang {
  return sharedDetectLang(text)
}

/** Pick a translation by language, fallback to English */
function L(lang: Lang, m: Partial<Record<Lang, string>>): string {
  return m[lang] ?? m.en ?? ''
}

// ═══════════════════════════════════════════════════════════
//  Budget & Price Range Parsing
// ═══════════════════════════════════════════════════════════

function parseBudget(text: string): { min: number | null; max: number | null } {
  const t = text.replace(/,/g, '').toLowerCase()

  // Range: "between X and Y", "X to Y", "X - Y"
  let m = t.match(/(?:between|from)\s*(?:rs\.?\s*)?([\d]{3,6})\s*(?:and|to|-|–)\s*(?:rs\.?\s*)?([\d]{3,6})/i)
  if (m) return { min: parseInt(m[1], 10), max: parseInt(m[2], 10) }

  m = t.match(/(?:rs\.?\s*)?([\d]{3,6})\s*(?:to|-|–)\s*(?:rs\.?\s*)?([\d]{3,6})/i)
  if (m) return { min: parseInt(m[1], 10), max: parseInt(m[2], 10) }

  // Under/below/max budget
  m = t.match(/(?:under|below|less than|max|budget|යට|ට\s*අඩු|wadi nathi|adin)\D*([\d]{3,6})/i)
  if (m) return { min: null, max: parseInt(m[1], 10) }

  m = t.match(/([\d]{4,6})\s*(?:ට|ta|rupees|rs|ekata)/i)
  if (m) return { min: null, max: parseInt(m[1], 10) }

  m = t.match(/rs\.?\s*([\d]{3,6})/i)
  if (m && /under|below|less|යට|wadi nathi|budget|adin/i.test(t)) return { min: null, max: parseInt(m[1], 10) }

  // Above/over/more than
  m = t.match(/(?:above|over|more than|minimum|atleast|at least|wadi)\D*([\d]{3,6})/i)
  if (m) return { min: parseInt(m[1], 10), max: null }

  return { min: null, max: null }
}

// ═══════════════════════════════════════════════════════════
//  Category & Occasion Detection
// ═══════════════════════════════════════════════════════════

const CAT_KEYS: Record<string, string[]> = {
  Cakes:       ['cake','cakes','gateau','කේක්','cake ekak','kek','birthday cake','wedding cake','cupcake'],
  Flowers:     ['flower','flowers','bouquet','rose','roses','මල්','mal','mala','lily','lilies','sunflower','gerbera','orchid'],
  Chocolates:  ['chocolate','chocolates','choc','truffle','ferrero','lindt','චොකලට්','cadbury','toblerone','godiva'],
  Hampers:     ['hamper','hampers','gift set','giftset','basket','gift box','gift basket','combo pack'],
  Perfumes:    ['perfume','perfumes','fragrance','scent','edt','edp','cologne','spray','body mist'],
  Jewellery:   ['jewellery','jewelry','pendant','earring','earrings','necklace','ring','bracelet','chain','bangle','anklet'],
  Electronics: ['electronic','electronics','earbud','earbuds','headphone','headphones','gadget','watch','smartwatch','band','tech','speaker','charger'],
  'Soft Toys': ['soft toy','soft toys','teddy','toy','plush','bear','stuffed','cuddly','doll'],
  Cosmetics:   ['cosmetic','cosmetics','makeup','skincare','lipstick','foundation','moisturizer','cream','lotion','serum'],
  'Kids & Toys':['kids','children','baby','infant','toddler','newborn','baby gift'],
  //Liquor:      ['liquor','wine','whisky','whiskey','beer','champagne','vodka','rum','brandy','gin','arrack'],
  Books:       ['book','books','novel','reading','storybook','cookbook','diary','journal','planner'],
}

const OCC_KEYS: Record<string, string[]> = {
  mother:      ['mother','mom','mum','amma','ammata','amage','අම්ම','mother\'s day','mothers day','for mom','for mum','for amma'],
  father:      ['father','dad','thaaththa','thatta','appa','තාත්ත','father\'s day','fathers day','for dad','for appa'],
  birthday:    ['birthday','bday','උපන්දින','upandina','janma','birth day','happy birthday'],
  anniversary: ['anniversary','wedding anniversary','සංවත්සර','anniv','wedding day'],
  valentine:   ['valentine','valentines','love','girlfriend','boyfriend','wife','husband','ආදර','partner','sweetheart','romantic'],
  avurudu:     ['avurudu','aurudu','new year','අවුරුදු','aluth avurudu','sinhala new year','tamil new year'],
  graduation:  ['graduation','graduate','convocation','passing out','degree','diploma'],
  wedding:     ['wedding','bride','groom','bridal','engagement','married','getting married'],
  sympathy:    ['sympathy','condolence','funeral','sorry for your loss','bereavement','passing','rip'],
  christmas:   ['christmas','xmas','noel','santa','festive','holiday season'],
  baby:        ['baby shower','newborn','new baby','baby gift','maternity','expecting'],
  housewarming:['housewarming','new home','new house','moving in','gewal warming'],
}

function findCat(t: string): string | null {
  for (const [c, ks] of Object.entries(CAT_KEYS)) if (ks.some((k) => t.includes(k))) return c
  return null
}

function findOcc(t: string): string | null {
  for (const [o, ks] of Object.entries(OCC_KEYS)) if (ks.some((k) => t.includes(k))) return o
  return null
}

// ═══════════════════════════════════════════════════════════
//  City Detection — supports aliases
// ═══════════════════════════════════════════════════════════

const CITY_ALIASES: Record<string, string> = {
  'colombo':'Colombo', 'col':'Colombo', 'kolomba':'Colombo', 'කොළඹ':'Colombo',
  'kandy':'Kandy', 'මහනුවර':'Kandy', 'mahanuwara':'Kandy', 'maha nuwara':'Kandy',
  'galle':'Galle', 'ගාල්ල':'Galle', 'gaalla':'Galle',
  'negombo':'Negombo', 'මීගමුව':'Negombo', 'migamuwa':'Negombo',
  'matara':'Matara', 'මාතර':'Matara',
  'jaffna':'Jaffna', 'යාපනය':'Jaffna', 'yaapanaya':'Jaffna',
  'kurunegala':'Kurunegala', 'කුරුණෑගල':'Kurunegala',
  'anuradhapura':'Anuradhapura', 'අනුරාධපුර':'Anuradhapura', 'anuradha':'Anuradhapura',
  'batticaloa':'Batticaloa', 'බත්තිකලෝව':'Batticaloa', 'batti':'Batticaloa',
  'ratnapura':'Ratnapura', 'රත්නපුර':'Ratnapura',
  'badulla':'Badulla', 'බදුල්ල':'Badulla',
  'nugegoda':'Nugegoda', 'නුගේගොඩ':'Nugegoda',
  'dehiwala':'Dehiwala', 'දෙහිවල':'Dehiwala',
  'mt lavinia':'Mount Lavinia', 'mount lavinia':'Mount Lavinia', 'මවුන්ට් ලැවීනියා':'Mount Lavinia',
}

async function findCity(text: string) {
  const lower = text.toLowerCase()
  // Check aliases first (includes Sinhala names)
  for (const [alias, canonical] of Object.entries(CITY_ALIASES)) {
    if (lower.includes(alias)) {
      // Try cached cities first (real MCP rates), then hardcoded
      const cached = await getCachedCities()
      const fromCache = cached.find(c => c.name === canonical)
      if (fromCache) return fromCache
      return CITIES.find(c => c.name === canonical) ?? null
    }
  }
  // Fallback to direct name match — check cache then hardcoded
  const cached = await getCachedCities()
  const fromCache = cached.find(c => new RegExp('\\b' + c.name + '\\b', 'i').test(text))
  if (fromCache) return fromCache
  return CITIES.find((c) => new RegExp('\\b' + c.name + '\\b', 'i').test(text)) ?? null
}

// ═══════════════════════════════════════════════════════════
//  Smart Search — scored, multi-factor, fuzzy
// ═══════════════════════════════════════════════════════════

async function search({ cat, occ, budget, keywords, sort }: {
  cat: string | null
  occ: string | null
  budget: { min: number | null; max: number | null }
  keywords?: string[]
  sort?: 'price_asc' | 'price_desc' | 'popular'
}): Promise<Product[]> {
  // Try cached products first (real Kapruka MCP data), then hardcoded
  const cached = await getCachedProducts()
  const source = cached.length > 0 ? cached : CATALOG
  let list = source.slice()

  // Filter by category
  if (cat) list = list.filter(p => p.cat === cat)

  // Filter by occasion
  if (occ) list = list.filter(p => (p.occ || []).includes(occ))

  // Filter by price range
  if (budget.max) list = list.filter(p => p.price <= budget.max!)
  if (budget.min) list = list.filter(p => p.price >= budget.min!)

  // Keyword matching — score products by relevance
  if (keywords && keywords.length > 0) {
    list = list.map(p => {
      let score = 0
      const text = (p.name + ' ' + p.summary + ' ' + p.cat).toLowerCase()
      for (const kw of keywords) {
        if (text.includes(kw)) score += 2
      }
      return { ...p, _score: score }
    }).filter(p => (p as Product & { _score: number })._score > 0 || !cat)
      .sort((a, b) => ((b as Product & { _score: number })._score || 0) - ((a as Product & { _score: number })._score || 0))
  }

  // Fallback widening — if cache had no matches, try hardcoded CATALOG
  if (list.length === 0 && cached.length > 0) {
    // Cache had data but no matches — try the hardcoded catalog as backup
    let fallback = CATALOG.slice()
    if (cat) fallback = fallback.filter(p => p.cat === cat)
    if (occ) fallback = fallback.filter(p => (p.occ || []).includes(occ))
    if (budget.max) fallback = fallback.filter(p => p.price <= budget.max!)
    if (budget.min) fallback = fallback.filter(p => p.price >= budget.min!)
    if (fallback.length > 0) list = fallback
  }

  // Original fallback widening
  if (list.length === 0 && occ) {
    list = (source.length > 0 ? source : CATALOG).filter(p => (p.occ || []).includes(occ))
    if (budget.max) list = list.filter(p => p.price <= budget.max!)
  }
  if (list.length === 0 && cat) {
    list = (source.length > 0 ? source : CATALOG).filter(p => p.cat === cat)
  }
  if (list.length === 0) {
    list = CATALOG.filter(p => ['Cakes', 'Flowers', 'Chocolates', 'Hampers'].includes(p.cat))
  }

  // Sort
  if (sort === 'price_asc') list.sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)
  else if (sort === 'popular') list.sort((a, b) => (b.was ? 1 : 0) - (a.was ? 1 : 0)) // items with was (discount) = popular

  return list.slice(0, 8)
}

/** Extract simple keywords from user text for product matching */
function extractKeywords(text: string): string[] {
  const STOP_WORDS = new Set([
    'a','an','the','i','me','my','we','you','your','he','she','it','they',
    'is','am','are','was','were','be','been','being',
    'have','has','had','do','does','did','will','would','could','should',
    'and','or','but','for','of','to','in','on','at','by','from','with',
    'that','this','these','those','what','which','who','when','where','how',
    'not','no','can','want','need','looking','find','show','me','please',
    'some','any','something','anything','get','give','send','like','good',
    'nice','best','cheap','expensive','mata','ekak','ekata','ganna','hoyanna',
    'den','denna','one','two','under','below','above','rs','rupees',
  ])
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
}

// ═══════════════════════════════════════════════════════════
//  Sort Detection
// ═══════════════════════════════════════════════════════════

function detectSort(text: string): 'price_asc' | 'price_desc' | 'popular' | undefined {
  if (/cheapest|lowest price|price low|ascending|salli adin/i.test(text)) return 'price_asc'
  if (/expensive|highest price|price high|premium|luxury|descending|mahaguwen/i.test(text)) return 'price_desc'
  if (/popular|best ?sell|trending|top rated|famous|hodama/i.test(text)) return 'popular'
  return undefined
}

// ═══════════════════════════════════════════════════════════
//  Response Helpers
// ═══════════════════════════════════════════════════════════

const occLabel: Record<string, Partial<Record<Lang, string>>> = {
  mother:      { en:'your amma', si:'ඔබේ අම්මාට', sg:'oyage ammata' },
  father:      { en:'your dad', si:'ඔබේ තාත්තාට', sg:'oyage thaatthatata' },
  birthday:    { en:'the birthday', si:'උපන්දිනයට', sg:'birthday ekata' },
  anniversary: { en:'the anniversary', si:'සංවත්සරයට', sg:'anniversary ekata' },
  valentine:   { en:'your special someone', si:'ඔබේ ආදරවන්තයාට/ආදරවන්තිමට', sg:'oyage special kenata' },
  avurudu:     { en:'Avurudu', si:'අවුරුදුට', sg:'Avurudu ekata' },
  graduation:  { en:'the graduate', si:'උපාධිධාරියාට', sg:'graduate ekata' },
  wedding:     { en:'the wedding', si:'මංගල්‍යයට', sg:'wedding ekata' },
  sympathy:    { en:'a difficult time', si:'දුෂ්කර අවස්ථාවට', sg:'difficult time ekata' },
  christmas:   { en:'Christmas', si:'නත්තලට', sg:'Christmas ekata' },
  baby:        { en:'the new baby', si:'අලුත් බබාට', sg:'aluth babata' },
  housewarming:{ en:'the new home', si:'අලුත් ගෙදරට', sg:'aluth gedarata' },
}

function formatPrice(n: number): string {
  return `Rs. ${n.toLocaleString('en-LK')}`
}

// ═══════════════════════════════════════════════════════════
//  Main respond() function
// ═══════════════════════════════════════════════════════════

export async function respond(text: string, ctx: { cartCount: number; lastVimp?: string | null; effectiveLang?: Lang }): Promise<EngineResponse> {
  // Use the session's effective language when available; fall back to per-message detection
  const lang = ctx.effectiveLang || detectLang(text)
  const t = ' ' + text.toLowerCase().trim() + ' '
  const { cartCount } = ctx

  // ─── 1. Track order ───────────────────────────────────
  if (/track|vimp|where.*order|order.*status|kohedha|tracking|enu thaen/i.test(text)) {
    const vimpMatch = text.match(/VIMP[A-Z0-9]+/i)
    const vimp = vimpMatch ? vimpMatch[0] : null
    if (vimp) return { lang, text: L(lang, {
      en: `Found it! 📦 Here's where ${vimp.toUpperCase()} is right now:`,
      si: `සොයාගත්තා! 📦 ${vimp.toUpperCase()} මෙන්න දැන් තියෙන තැන:`,
      sg: `Hambauna! 📦 ${vimp.toUpperCase()} menna dan thiyena thena:` }),
      card: { type: 'tracker', number: vimp.toUpperCase() },
      chips: ['Shop something new', 'Talk to support'] }
    if (ctx.lastVimp) return { lang, text: L(lang, {
      en: 'Sure! Here\'s your most recent order. To track any other order, just paste its VIMP number. 📦',
      si: 'හරි! ඔබ අවසන් වරට සිදු කළ ඇණවුම මෙන්න. වෙනත් ඇණවුමක් පිළිබඳව සොයා බැලීමට, එහි VIMP අංකය මෙහි ඇතුළත් කරන්න. 📦',
      sg: 'Hari! Menna oyage aluthma order eka. Wena order ekak track karanna VIMP number eka athulath karanna. 📦' }),
      card: { type: 'tracker', number: ctx.lastVimp }, chips: ['Shop something new'] }
    return { lang, text: L(lang, {
      en: "Happy to track that! 📦 What's your order number? It starts with VIMP… (you'll find it in your confirmation email).",
      si: 'අපි ඒක Track කරලා බලමු!! 📦 ඔයාගේ ඇණවුම් අංකය මොකක්ද? ඒක පටන් ගන්නේ VIMP… වලින් (ඔයාට ආපු Confirmation ඊමේල් එකේ ඒක තියෙනවා.).',
      sg: 'Track karannam! 📦 Oyage order number eka mokakda? VIMP… valin patan gannawa (email eke thiyenawa).' }),
      chips: ['VIMP34456CB2', 'Shop something new'] }
  }

  // ─── 2. Checkout intent ───────────────────────────────
  if (/check ?out|pay now|place.*order|buy now|proceed|order karanna|salli|ganan karamu|pay karanna|gathannak/i.test(text)) {
    if (cartCount === 0) return { lang, text: L(lang, {
      en: "Your cart's empty right now! 🛍️ Tell me who you're shopping for and I'll find something lovely first.",
      si: 'ඔබේ සාප්පු කූඩයෙහි දැනට කිසිවක් නොමැත! 🛍️ ඔබ මේක ගන්නේ කාටද කියලා කියන්නකෝ. මම ඔයාට ගැළපෙනම දේ හොයලා දෙන්නම්.',
      sg: 'Oyage cart eke danata kisima deyak naha! 🛍️ oya meka ganne katada kiyannako. mama oyata galapenama de hoyala dennam.' }),
      chips: ['Gifts for mom', 'Birthday cakes', 'Avurudu hamper'] }
    return { lang, action: 'checkout', text: L(lang, {
      en: "Let's get this delivered! Just a few quick details… 🚚",
      si: 'ඔබේ ඇණවුම නිවසටම ගෙන්වා ගනිමු! ඒ සඳහා අවශ්‍ය තව කුඩා විස්තර කිහිපයක් පමණයි… 🚚',
      sg: 'Api meka deliver karamu! Podi vistara tikak awashyai… 🚚' }) }
  }

  // ─── 3. Greetings & Help ──────────────────────────────
  if (/^\s*(help|what can you|who are you|hi+|hello+|hey+|ayubowan|ආයුබෝවන්|hari|start|good morning|good evening|good afternoon|vanakkam|namaste|supiri)\s*[?!.]*$/i.test(text) || /what.*do you do|what.*your.*name/i.test(text)) {
    return { lang, text: L(lang, {
      en: "Hi, I'm Kapri — your Kapruka shopping concierge! 🛍️ Tell me who you're shopping for and your budget, and I'll find the perfect gift, sort delivery to any city in Sri Lanka, and take you all the way to a pay link. What are we shopping for today? — Kapri 🛍️",
      si: 'ආයුබෝවන්! මම Kapri — ඔබේ Kapruka සාප්පු සහායක! 🛍️ ඔබ තෑග්ග ගන්නේ කා වෙනුවෙන්ද සහ ඔබේ බජට් එක මට කියන්න. මම ඔබට ගැළපෙනම තෑග්ග හොයලා දීලා, ලංකාවේ ඕනෑම නගරයකට ඩිලිවරි (Delivery) පහසුකම සකසලා, මුදල් ගෙවන පියවර දක්වාම ඔබට සහාය වෙන්නම්. අපි අද මොනවද මිලදී ගන්නේ? — Kapri 🛍️',
      sg: 'Ayubowan! Mama Kapri — oyage Kapruka shopping concierge! 🛍️ Oya meka ganne kaatada, oyage budget eka mokakda kiyanna — mama hondama gift eka hoyala, Lankawe onema town ekakata delivery eka arrange karala, payment link eka wenakanma oyata udaw karannam. Api ada monawada ganne? — Kapri 🛍️' }),
      chips: ['Gifts for mom under Rs. 5,000', 'Birthday cakes', 'Avurudu hamper', 'What categories do you have?'] }
  }

  // ─── 4. Thank you / farewell ──────────────────────────
  if (/^(thanks?|thank you|sthuthi|sthu+thi|bohoma sthuthi|cheers|thanks a lot|ty|thx|nandri)\s*[!.]*$/i.test(text)) {
    return { lang, text: L(lang, {
      en: "You're very welcome! 💜 It was lovely helping you. Come back anytime you need a gift — I'll be right here! — Kapri 🛍️",
      si: 'ඔබට උදව් කිරීමට ලැබීම මටත් ලොකු සතුටක්! 💜 තෑග්ගක් අවශ්‍ය වුණු ඕනෑම වෙලාවක ආයෙත් එන්න — මම ඔබට උදව් කරන්න මෙතැනම ඉන්නවා! — Kapri 🛍️',
      sg: 'Oyata udaw karanna labunu eka mata loku sathutak! 💜 Gift ekak ona wunu onema welawaka aayeth enna — mama udaw karanna methanama innawa! — Kapri 🛍️' }),
      chips: ['Shop something new', 'Track my order'] }
  }

  if (/^(bye|goodbye|good ?bye|see you|tata|gihin ennam|yamu|laterz?)\s*[!.]*$/i.test(text)) {
    return { lang, text: L(lang, {
      en: "Goodbye! 👋 Enjoy your gifts, and remember — anytime you need something special delivered across Sri Lanka, Kapri's got you! 🛍️🇱🇰",
      si: 'සුබ දවසක්! 👋 ඔබේ තෑගිවලින් සතුටු වන්න. ඒ වගේම මතක තබාගන්න — ලංකාවේ ඕනෑම තැනකට විශේෂ යමක් යවන්න අවශ්‍ය වුණු ඕනෑම වෙලාවක, ඔබ වෙනුවෙන් Kapri ඉන්නවා! 🛍️🇱🇰',
      sg: 'Suba dawasak! 👋 Oyage gifts enjoy karanna, e wagemai — Lankawe onema thanakata special deyak deliver karanna ona wunu onema welawaka, oya wenuwen Kapri innawa! 🛍️🇱🇰' }),
      chips: ['Shop something new'] }
  }

  // ─── 5. Category browsing ─────────────────────────────
  if (/what.*categor|show.*categor|list.*categor|browse|categories|monawada thiyen|mokak.*thiyen|what.*have|what.*sell|what.*offer|go back|back to start|start over/i.test(text)) {
    const catList = CATEGORIES.map(c => `${c.emoji} ${c.name}`).join(', ')
    return { lang, text: L(lang, {
      en: `Here's what I can help you with! 🗂️ We have: ${catList}. Just tell me a category or describe what you're looking for!`,
      si: `මට ඔබට සහාය විය හැකි දේවල් මෙන්න! 🗂️ අප සතුව තිබෙනවා  ${catList}. මෙයින් ඔබට අවශ්‍ය Category එකක් හෝ ඔබ සොයන දේ මට කියන්න!`,
      sg: `Mata oyata udaw karanna puluwan deewal menna! 🗂️ Api gawa thiyenawa: ${catList}. Methanin category ekak hari, oya hoyana deyak hari mata kiyanna!` }),
      chips: ['Cakes', 'Flowers', 'Chocolates', 'Hampers', 'Electronics', 'Jewellery'] }
  }

  // ─── 6. Bundle / Hamper ───────────────────────────────
  if (/hamper|bundle|combo|themed|package deal|curate|gift pack|assortment/i.test(text) || (/avurudu|aurudu|new year/i.test(text) && /hamper|bundle|gift/i.test(text))) {
    let key = 'birthday'
    if (/avurudu|aurudu|new year|අවුරුදු/i.test(text)) key = 'avurudu'
    else if (findOcc(t) === 'mother' || /mom|mum|amma/i.test(text)) key = 'mother'
    else if (/father|dad|thaaththa/i.test(text)) key = 'birthday' // fallback — no father bundle yet
    return { lang, text: L(lang, {
      en: "Ooh, I love a good hamper! 🎁 Here's a little something I curated — add it all in one tap:",
      si: 'ෂා! මමත් ලස්සන Hampers වලට ගොඩක් ආසයි! 🎁 මෙන්න මම ඔබ වෙනුවෙන්ම තෝරාගත් අපූරු එකතුවක් — මේ සියල්ලම එකම Tap එකකින් එකතු කරගන්න:',
      sg: 'Shaa! Mamath lassana hampers walata godak aasai! 🎁 Menna mama oya wenuwenma thoragaththu apuru ekathuwak — me okkoma eka tap ekakin add karaganna:' }),
      card: { type: 'bundle', key }, chips: ['Show me cakes', 'Add a gift message', 'Checkout'] }
  }

  // ─── 7. Delivery to a city ────────────────────────────
  const city = await findCity(text)
  if (city && /deliver|delivery|send|ship|ගේන්න|genna|yawanna|dispatch|courier/i.test(text)) {
    return { lang, text: L(lang, {
      en: `Good news! 🚚 Here's the delivery details for ${city.name}:`,
      si: `මෙන්න හොඳ ආරංචියක්! 🚚 ${city.name} සඳහා ඩිලිවරි (Delivery) විස්තර මෙන්න:`,
      sg: `Suba aranchiyak! 🚚 ${city.name} walata delivery wisthara menna :` }),
      card: { type: 'delivery', city: city.name, rate: city.rate, slow: city.slow, available: true,
              date: city.slow ? 'In 2–3 days' : 'Tomorrow' },
      chips: ['Find a gift', 'Change city', 'Checkout'] }
  }

  // City-only mention (no delivery verb) — still helpful
  if (city && !(/deliver|delivery|send|ship/i.test(text))) {
    return { lang, text: L(lang, {
      en: `I see you mentioned ${city.name}! 📍 Delivery there costs ${formatPrice(city.rate)} flat${city.slow ? ' (takes 2–3 days for this area)' : ' (next-day available)'}. Would you like me to find some gifts to send there?`,
      si: `ඔබ ${city.name} ගැන සඳහන් කළා නේද! 📍 එහෙට ඩිලිවරි (Delivery) ගාස්තුව ${formatPrice(city.rate)} flat${city.slow ? ' (මෙම ප්‍රදේශයට දින 2–3ක් ගත වේ)' : ' (ඊළඟ දවසේම ලබා දිය හැකියි)'}. මම එහෙට යවන්න පුළුවන් අපූරු තෑගි ටිකක් හොයලා දෙන්නද?`,
      sg: `oya ${city.name} gana kiyala thibuna neda! 📍 Eheta delivery charge eka ${formatPrice(city.rate)} flat${city.slow ? ' (me patthata dawas 2-3k yanawa)' : ' (heta unath deliver karanna puluwan)'}. Mama eheta yawanna puluwan gifts tikak hoyala dennada?` }),
      chips: [`Gifts to ${city.name}`, 'Birthday cakes', 'Flowers'] }
  }

  // ─── 8. Gift message help ─────────────────────────────
  if (/gift message|card message|what.*write|message.*card|sandeshaya|liyanna|icing|write on.*cake|cake.*message/i.test(text)) {
    const isCakeIcing = /icing|write on.*cake|cake.*message|cake.*icing/i.test(text)
    if (isCakeIcing) {
      return { lang, text: L(lang, {
        en: "Great idea! 🎂 You can add a personalized icing message (up to 120 characters) to any cake. Just add a cake to your cart, and you'll see the icing text field in the cart drawer. Here are some ideas:\n\n• \"Happy Birthday [Name]! 🎉\"\n• \"Happy Anniversary Love 💕\"\n• \"Congratulations! 🎓\"\n• \"Suba Aluth Avuruddak! 🇱🇰\"",
        si: 'නියම අදහසක්! 🎂 ඕනෑම කේක් එකකට ඔබේ කැමැත්තට අනුව අයිසිං සටහනක් (අකුරු 120ක් දක්වා) එකතු කරන්න පුළුවන්. කේක් එක Cart එකට එකතු කළ විට, එහි ඇති Icing Text Field එක ඔබට දැකගන්න පුළුවන්:.',
        sg: 'Niyama adahasak! 🎂 Onema cake ekakata oyage kamaththa anuwa icing message ekak (characters 120k wenakan) add karanna puluwan. Cake eka cart ekata add karaama, eke thiyena icing text field eka oyata penewi.' }),
        chips: ['Show me cakes', 'Birthday cakes', 'Add to cart'] }
    }
    return { lang, text: L(lang, {
      en: "I'd love to help you write the perfect note! ✍️ Add an item to your cart, then at checkout I'll help you craft a warm, witty, or formal message — in any language. Here are some starters:\n\n• 🎂 \"Wishing you the sweetest birthday ever!\"\n• 💐 \"Thank you for being amazing, Amma.\"\n• 🇱🇰 \"සුබ අලුත් අවුරුද්දක්! සෞඛ්‍ය සම්පත් ලැබේවා.\"\n• 💝 \"You make every day special. Love always.\"",
      si: 'ඔබට අපූරු සුබපැතුම් සටහනක් නිර්මාණය කරගන්න මම ආසාවෙන් උදව් කරන්නම්! ✍️ ඔබට අවශ්‍ය දේ Cart එකට එකතු කරන්න, ඉන්පසු Checkout කරන අවස්ථාවේදී ඕනෑම භාෂාවකින් ආදරණීය, විනෝදාත්මක හෝ විධිමත් පණිවිඩයක් සකසා ගන්න මම සහාය වෙන්නම්.',
      sg: 'Lassanama note ekak liyanna mama aasaawen udaw karannam! ✍️ Item ekak cart ekata add karanna, iitapasse checkout weddi onema bhashawakin adaraniya, fun hari formal hari message ekak hadaganna mama udaw karannam.' }),
      chips: ['Gifts for mom', 'Birthday cakes', 'Checkout'] }
  }

  // ─── 9. Comparison / recommendation ───────────────────
  if (/which.*better|compare|recommend|suggest|best|hodama|koyda honda|vs|versus|difference between/i.test(text)) {
    const cat = findCat(t)
    const items = await search({ cat, occ: null, budget: { min: null, max: null }, sort: 'popular' })
    return { lang, text: L(lang, {
      en: `Here are my top recommendations${cat ? ` in ${cat}` : ''} — the most popular picks! ⭐ I've sorted them by what customers love most:`,
      si: `මෙන්න ${cat ? cat + ' සඳහා ' : ''}මගේ හොඳම නිර්දේශ — වඩාත්ම ජනප්‍රිය තේරීම්! ⭐ පාරිභෝගිකයින් වඩාත් කැමති පිළිවෙළට මම මේවා සකස් කර තිබෙනවා: ⭐`,
      sg: `$Menna {cat ? cat + ' sadaha ' : ''}mage hondama recommendations — godakma popular picks! ⭐ Customersla wadiyenma kamathi piliwelata mama mewa sort karala thiyenawa: ⭐` }),
      card: { type: 'carousel', items },
      chips: ['Under Rs. 5,000', 'Show me flowers', 'Make it a hamper'] }
  }

  // ─── 10. "Show me more" / "different options" ─────────
  if (/more|another|different|other|else|options|alternatives|wenath|wenama|thawa/i.test(text) && !/more.*info|more.*detail/i.test(text)) {
    const cat = findCat(t) || null
    const occ = findOcc(t) || null
    const items = await search({ cat, occ, budget: { min: null, max: null } })
    // Shuffle for variety
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]]
    }
    return { lang, text: L(lang, {
      en: "Sure! Here are some different picks for you 🔄 — tap Add to pop one in your cart:",
      si: 'හරි! මෙන්න ඔබ සඳහා වෙනත් තේරීම් කිහිපයක් 🔄 — එය Cart එකට එකතු කරගැනීමට "Add" මත Tap කරන්න:',
      sg: 'Hari! Menna oyata wenas picks tikak 🔄 — Cart ekata add karaganna "Add" eka tap karanna:' }),
      card: { type: 'carousel', items },
      chips: ['Show me cakes', 'Under Rs. 5,000', 'Make it a hamper'] }
  }

  // ─── 11. Delivery fee inquiry ─────────────────────────
  if (/delivery fee|delivery charge|delivery cost|shipping cost|how much.*delivery|delivery.*how much|kochchara.*delivery/i.test(text)) {
    return { lang, text: L(lang, {
      en: "Delivery is a flat fee per order (not per item!) 🚚\n\nHere are some sample rates:\n• Colombo / Nugegoda / Dehiwala — Rs. 350\n• Negombo — Rs. 450\n• Kandy — Rs. 550\n• Galle — Rs. 600\n• Jaffna / Batticaloa — Rs. 850 (2–3 days)\n\nTell me a city and I'll get you the exact rate!",
      si: 'ඩිලිවරි (Delivery) ගාස්තුව අයවන්නේ සම්පූර්ණ ඇණවුමටමයි (එක් එක් භාණ්ඩයට වෙන වෙනම නොවේ!) 🚚\n\nසඳහා ගාස්තු මෙන්න:\n• කොළඹ / නුගේගොඩ — රු. 350\n• නේගොම්බ — රු. 450\n• මහනුවර — රු. 550\n• ගාල්ල — රු. 600\n• යාපනය / මඩකලපුව — රු. 850 (දින 2–3)\n\nඔබට අවශ්‍ය නගරය මට කියන්න, මම හරියටම ගාස්තුව කියන්නම්!',
      sg: 'Delivery charge eka ayawenne mulu order ekatama ekawarai (eka eka item ekata wena wenama newei!) 🚚\n\nCities kihipayak sadaha rates menna:\n• Colombo / Nugegoda / Dehiwala — Rs. 350\n• Negombo — Rs. 450\n• Kandy — Rs. 550\n• Galle — Rs. 600\n• Jaffna / Batticaloa — Rs. 850 (2–3 days)\n\nOyata ona city eka mata kiyanna, mama exact rate eka kiyannam!' }),
      chips: ['Deliver to Colombo', 'Deliver to Kandy', 'Deliver to Galle'] }
  }

  // ─── 12. Support / Contact ────────────────────────────
  if (/support|contact|call|phone|help desk|whatsapp|hotline|customer care|complaint|refund|return|cancel/i.test(text)) {
    const isRefund = /refund|return|cancel/i.test(text)
    return { lang, text: L(lang, {
      en: `${isRefund ? "For refunds, returns, or cancellations, please contact Kapruka directly" : "Kapruka's here to help"}! 📞\n\n**24/7 Hotline:** +94 117 551 111\n**WhatsApp (24/7):** +94 707 117 777\n**Order by phone:** 1337 (within Sri Lanka)\n**Global Shop:** WhatsApp +94 707 115 533\n**Head Office:** 147 Old Kottawa Road, Nugegoda\n\nThey'll sort you out in no time! — Kapri`,
      si: `${isRefund ? "මුදල් ආපසු ලබාගැනීම්, භාණ්ඩ මාරු කිරීම් හෝ ඇණවුම් අවලංගු කිරීම් සඳහා කරුණාකර සෘජුවම Kapruka හා සම්බන්ධ වන්න" : "ඔබට සහාය වීමට Kapruka සූදානම්"}! 📞\n\n**24/7 ක්ෂණික ඇමතුම්:** +94 117 551 111\n**WhatsApp (24/7):** +94 707 117 777\n**දුරකථනයෙන් ඇණවුම් කිරීමට:** 1337 (ලංකාව ඇතුළත)\n**Global Shop:** WhatsApp +94 707 115 533\n**ප්‍රධාන කාර්යාලය:** 147 පැරණි කොට්ටාව පාර, නුගේගොඩ\n\nඔවුන් ඔබට ඉක්මනින්ම සහාය වනු ඇත! `,
      sg: `${isRefund ? "Refunds, returns, hari cancellations walata karunakara kelinma Kapruka contact karanna" : "Oyata udaw karanna Kapruka lahasthiyi"}! 📞\n\n**24/7 Hotline:** +94 117 551 111\n**WhatsApp (24/7):** +94 707 117 777\n**Phone eken order karanna:** 1337 (Lankawa athulatha)\n**Global Shop:** WhatsApp +94 707 115 533\n**Head Office:** 147 Old Kottawa Road, Nugegoda\n\nEyal oyata ikmanatama udaw karawi! — Kapri` }),
      chips: ['Track my order', 'Shop something new'] }
  }

  // ─── 13. Cart inquiry ─────────────────────────────────
  if (/what.*cart|my cart|cart.*item|view.*cart|show.*cart|kart eke|cart eke/i.test(text)) {
    if (cartCount === 0) {
      return { lang, text: L(lang, {
        en: "Your cart is empty right now! 🛒 Let me help you find something amazing. What are you looking for?",
        si: 'ඔබේ Cart එක දැනට හිස්! 🛒 ඔබට ගැළපෙනම අපූරු දෙයක් තෝරාගන්න මම උදව් කරන්නම්. ඔබ මොන වගේ දෙයක්ද හොයන්නේ?',
        sg: 'Oyage cart eka danata his! 🛒 Oyata galapenama lassana deyak hoyaganna mama udaw karannam. Oya mona wage deyakda hoyanne?' }),
        chips: ['Birthday cakes', 'Flowers for mom', 'Gift hamper'] }
    }
    return { lang, action: 'open_cart', text: L(lang, {
      en: `You have ${cartCount} item${cartCount > 1 ? 's' : ''} in your cart! 🛒 Tap the cart icon to review, or say "checkout" when you're ready.`,
      si: `ඔබේ Cart එකේ අයිතම ${cartCount}ක් තිබෙනවා! 🛒 ඒවා නැවත පරීක්ෂා කිරීමට Cart අයිකනය (Icon) මත Tap කරන්න, නැත්නම් ඔබ සූදානම් වූ පසු "checkout" ලෙස මට කියන්න.`,
      sg: `Oyage cart eke items ${cartCount}k thiyenawa! 🛒 Ewa check karanna cart icon eka tap karanna, nathnam oya lahasthi wunama "checkout" kiyala mata kiyanna.` }),
      chips: ['Checkout', 'Add more items', 'Clear cart'] }
  }

  // ─── 14. Price / sale / discount inquiry ──────────────
  if (/sale|discount|offer|promotion|deal|bargain|cheap|vilata|割引|savings|save money/i.test(text)) {
    const discounted = CATALOG.filter(p => p.was && p.was > p.price)
    if (discounted.length > 0) {
      return { lang, text: L(lang, {
        en: `Great eye for deals! 🏷️ Here are items currently on sale — save up to ${Math.max(...discounted.map(p => Math.round(((p.was! - p.price) / p.was!) * 100)))}% off:`,
        si: `ඔබ හොඳම Deals තෝරාගන්න දක්ෂයෙක්! 🏷️ දැනට Sale එකේ (වට්ටම් සහිතව) තිබෙන අයිතම මෙන්න — මෙයින් ${Math.max(...discounted.map(p => Math.round(((p.was! - p.price) / p.was!) * 100)))}% ක් දක්වා ඔබේ මුදල් ඉතිරි කරගන්න:`,
        sg: `Oya hondama deals thoraganna harima dakshayek! 🏷️ Danata sale eke thiyena items menna — meyin ${Math.max(...discounted.map(p => Math.round(((p.was! - p.price) / p.was!) * 100)))}% k dakwa oyage salli ithiri karaganna:` }),
        card: { type: 'carousel', items: discounted.slice(0, 8) },
        chips: ['Under Rs. 5,000', 'Show me cakes', 'Checkout'] }
    }
  }

  // ─── 15. Perishable / freshness inquiry ───────────────
  if (/fresh|perishable|how long.*last|expire|shelf life|refrigerat|fridge/i.test(text)) {
    return { lang, text: L(lang, {
      en: "Great question! 🌸 Cakes and flowers are **perishable** — they're made/arranged fresh on the day of delivery. Here's what to know:\n\n• 🎂 **Cakes** — made to order, best consumed same day. Refrigerate if keeping overnight.\n• 💐 **Flowers** — hand-arranged morning of delivery. Put in water immediately.\n• 📦 **Chocolates, hampers, gifts** — non-perishable, no special care needed.\n\nWhen you check delivery for perishable items, I'll flag any date-specific warnings!",
      si: 'හොඳ ප්‍රශ්නයක්! 🌸 කේක් සහ මල් කියන්නේ ඉක්මනින් නරක් විය හැකි (perishable) දේවල් — ඒවා ඩිලිවරි (Delivery) කරන දවසේම නැවුම්ව තමයි සකස් කරන්නේ. මේ ගැන ඔබ දැනගත යුතු දේවල් මෙන්න:\n\n• 🎂 **කේක්** — ඇණවුමට අනුව පමණක් සාදන නිසා, එදිනම ආහාරයට ගැනීම වඩාත් සුදුසුයි. ඊළඟ දවසට තබාගන්නවා නම් ශීතකරණයේ (Fridge) තබන්න.\n• 💐 **මල්** — ඩිලිවරි කරන දවසේ උදෑසන තමයි සකස් කරන්නේ. ලැබුණු වහාම වතුරකට දමා තබන්න.\n• 📦 **චොකලට්, හැම්පර්ස් (Hampers) සහ තෑගි** — මේවා ඉක්මනින් නරක් නොවන නිසා විශේෂ සැලකිල්ලක් අවශ්‍ය වෙන්නේ නැහැ.\n\nඔබ මේ වගේ ඉක්මනින් නරක් විය හැකි දේවල් සඳහා ඩිලිවරි දිනයක් තෝරන විට, දිනය සම්බන්ධයෙන් යම් විශේෂ දැනුවත් කිරීමක් තිබේ නම් මම ඔබට ඒ බව කියන්නම්!',
      sg: 'Honda prashnayak! 🌸 Cakes saha flowers kiyanne ikmanin narak wenna puluwan (perishable) deewal — ewa delivery karana dawasema aluthinma hadala/arrange karala thamai ewanne. Oya dänaganna oone deewal menna:\n\n• 🎂 **Cakes** — order ekata anuwa hadana nisa, e dawasema kaana eka hondai. Pahuwadaata thiyagannawa nam fridge eke danna.\n• 💐 **Flowers** — delivery karana dawase ude thamai arrange karanne. Labunu gaman wathura ekakata danna.\n• 📦 **Chocolates, hampers, gifts** — meewa ikmanin narak wenne nathi nisa, vishesha salakillak aawashya wenne naha.\n\nOya me wage perishable items delivery karanna dawasak thoranakota, e dawasata adala monawa hari warnings thiyenawa nam mama oyata kiyannam!' }),
      chips: ['Show me cakes', 'Order flowers', 'Non-perishable gifts'] }
  }

  // ─── 16. Search — the main product discovery path ─────
  const cat = findCat(t)
  const occ = findOcc(t)
  const budget = parseBudget(text)
  const sort = detectSort(text)
  const keywords = extractKeywords(text)

  if (cat || occ || budget.max || budget.min || sort || /gift|present|buy|find|show|need|want|තෑග|gift ekak|baduwak|ganna|hoyanna|looking for/i.test(text)) {
    const items = await search({ cat, occ, budget, keywords, sort })

    const occText = occ ? (occLabel[occ]?.[lang] || occLabel[occ]?.en || occ) : null
    const budgetText = budget.max
      ? (budget.min ? `${formatPrice(budget.min)} – ${formatPrice(budget.max)}` : `under ${formatPrice(budget.max)}`)
      : (budget.min ? `above ${formatPrice(budget.min)}` : null)

    const bridge = L(lang, {
      en: `Here are some lovely picks${occText ? ' for ' + occText : ''}${budgetText ? ' ' + budgetText : ''}${cat ? ' in ' + cat : ''} 🎁 — tap Add to drop one in your cart:`,
      si: `මෙන්න${occText ? ' ' + occText + ' සඳහා' : ''}${budgetText ? ' ' + budgetText : ''}${cat ? ' ' + cat + ' වලින්' : ''} අපූරු තේරීම් කිහිපයක් 🎁 — Cart එකට එකතු කරගැනීමට "Add" මත Tap කරන්න:`,
      sg: `Menna${occText ? ' ' + occText + ' wenuwen' : ''}${budgetText ? ' ' + budgetText : ''}${cat ? ' ' + cat + ' walin' : ''} lassana picks tikak 🎁 — Cart ekata add karaganna "Add" eka tap karanna:`,
    })

    const chips = ['Start over']
    if (!budget.max) chips.push('Under Rs. 5,000')
    if (!cat) chips.push('Show me cakes')
    if (items.length >= 6) chips.push('Show me more')
    chips.push('Make it a hamper')
    if (cartCount > 0) chips.push('Checkout')

    return { lang, text: bridge, card: { type: 'carousel', items }, chips: chips.slice(0, 5) }
  }

  // ─── 17. Fallback — always show something ─────────────
  const items = await search({ cat: null, occ: null, budget: { min: null, max: null } })
  return { lang, text: L(lang, {
    en: "I want to get this just right! 💜 Tell me a little more — who's it for, roughly your budget, and any occasion? Meanwhile, here are some all-time favourites:",
    si: 'මට ඔබට හරියටම ගැළපෙන දේ තෝරලා දෙන්න ඕනෙ! 💜 ඒ නිසා මට තව විස්තර ටිකක් කියන්න — මේ තෑග්ග කා වෙනුවෙන්ද, ඔබේ බජට් එක දළ වශයෙන් කීයක් වගේද, සහ මේක මොන වගේ අවස්ථාවක් (Occasion) සඳහාද? ඒ අතරතුර, හැමෝම ගොඩක්ම කැමති අපූරු තේරීම් කිහිපයක් මෙන්න:',
    sg: 'Mata oyata hariyatama galapena de thorala denna oone! 💜 E nisa mata thawa wisthara tikak kiyanna — me gift eka kaatada, oyage budget eka dala washayen kiyak wageda, saha meka mona wage occasion ekakatada? E atharathura, hamoma godakma kamathi all-time favourites tikak menna:' }),
    card: { type: 'carousel', items },
    chips: ['Gifts for mom', 'Birthday cakes', 'Avurudu hamper', 'What categories do you have?'] }
}
