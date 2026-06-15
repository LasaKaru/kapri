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

// ═══════════════════════════════════════════════════════════
//  Language Detection — Sinhala, Tanglish, English
// ═══════════════════════════════════════════════════════════

const TANGLISH_HINTS = [
  // common words
  'mata','ekak','ekata','gannako','ganna','hadanna','oya','mama','tikak',
  'hoyanna','hoya','neda','denna','puluwan','kawda','monawada','genna',
  'kiyanna','heta','ada','salli','karanna','innawa','yanawa','enna','balanna',
  // family
  'amma','ammata','amage','thaththa','thatta','appa','nangi','akka','malli','aiya',
  // shopping
  'ganne','baduwak','thagi','thagga','gaana','gaanata','hodama','lassana',
  'sappu','baduwak miladi gamu','order','gannada','aran','arinna','gamu',
  // emotions
  'suba','bohoma','ane','hari','sthuthi','supiri','niyamai','hari hari',
  // greetings
  'ayubowan','kohomada','kohomada hodin innawada',
  // occasions
  'avurudu','wesak','poson','uppanna','upandina','mal',
  // delivery
  'genna','yawanna','yawanawa','gehen','gedara','gedarata',
]

const SI_RE = /[඀-෿]/
const SI_WORD_RE = /[\u0D80-\u0DFF]{2,}/g

function detectLang(text: string): Lang {
  if (SI_RE.test(text)) return 'si'
  const t = ' ' + text.toLowerCase() + ' '
  let hits = 0
  for (const w of TANGLISH_HINTS) {
    if (t.includes(' ' + w + ' ') || t.includes(' ' + w + '.') || t.includes(' ' + w + '?')) hits++
    else if (t.includes(w)) hits += 0.5
  }
  return hits >= 1 ? 'tl' : 'en'
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
  'negombo':'Negombo', 'මීගමුව':'Negombo', 'mīgamuwa':'Negombo',
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

function findCity(text: string) {
  const lower = text.toLowerCase()
  // Check aliases first (includes Sinhala names)
  for (const [alias, canonical] of Object.entries(CITY_ALIASES)) {
    if (lower.includes(alias)) {
      // Try cached cities first (real MCP rates), then hardcoded
      const cached = getCachedCities()
      const fromCache = cached.find(c => c.name === canonical)
      if (fromCache) return fromCache
      return CITIES.find(c => c.name === canonical) ?? null
    }
  }
  // Fallback to direct name match — check cache then hardcoded
  const cached = getCachedCities()
  const fromCache = cached.find(c => new RegExp('\\b' + c.name + '\\b', 'i').test(text))
  if (fromCache) return fromCache
  return CITIES.find((c) => new RegExp('\\b' + c.name + '\\b', 'i').test(text)) ?? null
}

// ═══════════════════════════════════════════════════════════
//  Smart Search — scored, multi-factor, fuzzy
// ═══════════════════════════════════════════════════════════

function search({ cat, occ, budget, keywords, sort }: {
  cat: string | null
  occ: string | null
  budget: { min: number | null; max: number | null }
  keywords?: string[]
  sort?: 'price_asc' | 'price_desc' | 'popular'
}): Product[] {
  // Try cached products first (real Kapruka MCP data), then hardcoded
  const cached = getCachedProducts()
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

const occLabel: Record<string, Record<Lang, string>> = {
  mother:      { en:'your amma', si:'ඔබේ අම්මාට', tl:'oyage ammata' },
  father:      { en:'your dad', si:'ඔබේ තාත්තාට', tl:'oyage thaatthatata' },
  birthday:    { en:'the birthday', si:'උපන්දිනයට', tl:'birthday ekata' },
  anniversary: { en:'the anniversary', si:'සංවත්සරයට', tl:'anniversary ekata' },
  valentine:   { en:'your special someone', si:'ඔබේ ආදරයාට', tl:'oyage special ekata' },
  avurudu:     { en:'Avurudu', si:'අවුරුදුට', tl:'Avurudu ekata' },
  graduation:  { en:'the graduate', si:'උපාධිධාරියාට', tl:'graduate ekata' },
  wedding:     { en:'the wedding', si:'මංගල්‍යයට', tl:'wedding ekata' },
  sympathy:    { en:'a difficult time', si:'දුෂ්කර අවස්ථාවට', tl:'difficult time ekata' },
  christmas:   { en:'Christmas', si:'නත්තලට', tl:'Christmas ekata' },
  baby:        { en:'the new baby', si:'අලුත් බබාට', tl:'aluth babata' },
  housewarming:{ en:'the new home', si:'අලුත් ගෙදරට', tl:'aluth gedarata' },
}

function formatPrice(n: number): string {
  return `Rs. ${n.toLocaleString('en-LK')}`
}

// ═══════════════════════════════════════════════════════════
//  Main respond() function
// ═══════════════════════════════════════════════════════════

export function respond(text: string, ctx: { cartCount: number; lastVimp?: string | null }): EngineResponse {
  const lang = detectLang(text)
  const t = ' ' + text.toLowerCase().trim() + ' '
  const { cartCount } = ctx

  // ─── 1. Track order ───────────────────────────────────
  if (/track|vimp|where.*order|order.*status|kohedha|tracking|enu thaen/i.test(text)) {
    const vimpMatch = text.match(/VIMP[A-Z0-9]+/i)
    const vimp = vimpMatch ? vimpMatch[0] : null
    if (vimp) return { lang, text: L(lang, {
      en: `Found it! 📦 Here's where ${vimp.toUpperCase()} is right now:`,
      si: `හම්බුණා! 📦 ${vimp.toUpperCase()} දැන් ඉන්නේ මෙතන:`,
      tl: `Hambuna! 📦 ${vimp.toUpperCase()} dæn inne mehe:` }),
      card: { type: 'tracker', number: vimp.toUpperCase() },
      chips: ['Shop something new', 'Talk to support'] }
    if (ctx.lastVimp) return { lang, text: L(lang, {
      en: 'Sure! Here\'s your most recent order. To track any other order, just paste its VIMP number. 📦',
      si: 'හරි! ඔබේ අලුත්ම ඇණවුම මෙන්න. වෙන ඇණවුමක් track කරන්න VIMP අංකය paste කරන්න. 📦',
      tl: 'Hari! Oyage aluthma order eka mehe. Wena order ekak track karanna VIMP number eka paste karanna. 📦' }),
      card: { type: 'tracker', number: ctx.lastVimp }, chips: ['Shop something new'] }
    return { lang, text: L(lang, {
      en: "Happy to track that! 📦 What's your order number? It starts with VIMP… (you'll find it in your confirmation email).",
      si: 'ට්‍රැක් කරන්නම්! 📦 ඔබේ ඇණවුම් අංකය මොකක්ද? VIMP… වලින් පටන් ගන්නවා (ඊමේල් එකේ තියෙනවා).',
      tl: 'Track karannam! 📦 Oyage order number eka mokakda? VIMP… valin patan gannawa (email eke thiyenawa).' }),
      chips: ['VIMP34456CB2', 'Shop something new'] }
  }

  // ─── 2. Checkout intent ───────────────────────────────
  if (/check ?out|pay now|place.*order|buy now|proceed|order karanna|salli|ganan karamu|pay karanna|gathannak/i.test(text)) {
    if (cartCount === 0) return { lang, text: L(lang, {
      en: "Your cart's empty right now! 🛍️ Tell me who you're shopping for and I'll find something lovely first.",
      si: 'ඔබේ කරත්තය දැන් හිස්! 🛍️ කාටද ගන්නේ කියන්න, මම මුලින්ම ලස්සන දෙයක් හොයන්නම්.',
      tl: 'Oyage cart eka dæn his! 🛍️ Kaatada ganne kiyanna, mama mulinma lassana dheyak hoyannam.' }),
      chips: ['Gifts for mom', 'Birthday cakes', 'Avurudu hamper'] }
    return { lang, action: 'checkout', text: L(lang, {
      en: "Let's get this delivered! Just a few quick details… 🚚",
      si: 'මේක ගෙදරටම ගේමු! පොඩි විස්තර කිහිපයක්… 🚚',
      tl: 'Apita meka deliver karamu! Podi vistara tikak witharai… 🚚' }) }
  }

  // ─── 3. Greetings & Help ──────────────────────────────
  if (/^\s*(help|what can you|who are you|hi+|hello+|hey+|ayubowan|ආයුබෝවන්|hari|start|good morning|good evening|good afternoon|vanakkam|namaste|supiri)\s*[?!.]*$/i.test(text) || /what.*do you do|what.*your.*name/i.test(text)) {
    return { lang, text: L(lang, {
      en: "Hi, I'm Kapri — your Kapruka shopping concierge! 🛍️ Tell me who you're shopping for and your budget, and I'll find the perfect gift, sort delivery to any city in Sri Lanka, and take you all the way to a pay link. What are we shopping for today? — Kapri 🛍️",
      si: 'ආයුබෝවන්! මම Kapri — ඔබේ Kapruka සාප්පු සහායක! 🛍️ කාටද, කොච්චරටද කියන්න — මම හොඳම තෑග්ග හොයලා, ලංකාවේ ඕනෑම නගරයකට බෙදාහැරීම සකසලා, ගෙවීම දක්වාම ඔබව රැගෙන යන්නම්. අද මොනවද ගන්නේ? — Kapri 🛍️',
      tl: 'Ayubowan! Mama Kapri — oyage Kapruka shopping concierge! 🛍️ Kaatada, koccharatada kiyanna — mama hondama gift eka hoyala, Lankawe kohehari town ekakata delivery eka set-kara, pay link ekata kanma oyawa aran yannam. Ada monawada ganne? — Kapri 🛍️' }),
      chips: ['Gifts for mom under Rs. 5,000', 'Birthday cakes', 'Avurudu hamper', 'What categories do you have?'] }
  }

  // ─── 4. Thank you / farewell ──────────────────────────
  if (/^(thanks?|thank you|sthuthi|sthu+thi|bohoma sthuthi|cheers|thanks a lot|ty|thx|nandri)\s*[!.]*$/i.test(text)) {
    return { lang, text: L(lang, {
      en: "You're very welcome! 💜 It was lovely helping you. Come back anytime you need a gift — I'll be right here! — Kapri 🛍️",
      si: 'ඉතා සතුටුයි! 💜 ඔබට උදව් කරන්න ලැබීම සතුටක්. ඕනෑම වෙලාවක ආපහු එන්න — මම මෙහෙම ඉන්නවා! — Kapri 🛍️',
      tl: 'Bohoma santhosai! 💜 Oyata udaw karanna labuna eka lassanai. Kohahari welet aapahu enna — mama mehema innawa! — Kapri 🛍️' }),
      chips: ['Shop something new', 'Track my order'] }
  }

  if (/^(bye|goodbye|good ?bye|see you|tata|gihin ennam|yamu|laterz?)\s*[!.]*$/i.test(text)) {
    return { lang, text: L(lang, {
      en: "Goodbye! 👋 Enjoy your gifts, and remember — anytime you need something special delivered across Sri Lanka, Kapri's got you! 🛍️🇱🇰",
      si: 'ගිහින් එන්නම්! 👋 තෑගි භුක්ති විඳින්න — ඕනෑම වෙලාවක ලංකාවට special එකක් ගේන්න ඕනේ නම්, Kapri ඉන්නවා! 🛍️🇱🇰',
      tl: 'Gihin ennam! 👋 Gifts enjoy karanna — kohahari welet Lankawata special ekak genna oney nam, Kapri innawa! 🛍️🇱🇰' }),
      chips: ['Shop something new'] }
  }

  // ─── 5. Category browsing ─────────────────────────────
  if (/what.*categor|show.*categor|list.*categor|browse|categories|monawada thiyen|mokak.*thiyen|what.*have|what.*sell|what.*offer|go back|back to start|start over/i.test(text)) {
    const catList = CATEGORIES.map(c => `${c.emoji} ${c.name}`).join(', ')
    return { lang, text: L(lang, {
      en: `Here's what I can help you with! 🗂️ We have: ${catList}. Just tell me a category or describe what you're looking for!`,
      si: `මට ඔබට උදව් කරන්න පුළුවන් දේවල් මෙන්න! 🗂️ ${catList}. ඕනෑම category එකක් හෝ ඔබ හොයන දේ කියන්න!`,
      tl: `Mata oyata udaw karanna puluwan deval mehe! 🗂️ ${catList}. Category ekak hari, oyata oney deyak kiyanna!` }),
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
      si: 'අනේ මට හැම්පර් හදන්න ආසයි! 🎁 මම හැදුව පුංචි එකතුවක් මෙන්න — එක ටැප් එකෙන් එකතු කරන්න:',
      tl: 'Ane mata hamper hadanna aasai! 🎁 Mama curate-kaloth podi ekak mehe — eka tap eken okkoma add karanna:' }),
      card: { type: 'bundle', key }, chips: ['Show me cakes', 'Add a gift message', 'Checkout'] }
  }

  // ─── 7. Delivery to a city ────────────────────────────
  const city = findCity(text)
  if (city && /deliver|delivery|send|ship|ගේන්න|genna|yawanna|dispatch|courier/i.test(text)) {
    return { lang, text: L(lang, {
      en: `Good news! 🚚 Here's the delivery details for ${city.name}:`,
      si: `සුබ ආරංචියක්! 🚚 ${city.name} සඳහා බෙදාහැරීමේ විස්තර මෙන්න:`,
      tl: `Suba aranchiyak! 🚚 ${city.name} ekata delivery eka mehe:` }),
      card: { type: 'delivery', city: city.name, rate: city.rate, slow: city.slow, available: true,
              date: city.slow ? 'In 2–3 days' : 'Tomorrow' },
      chips: ['Find a gift', 'Change city', 'Checkout'] }
  }

  // City-only mention (no delivery verb) — still helpful
  if (city && !(/deliver|delivery|send|ship/i.test(text))) {
    return { lang, text: L(lang, {
      en: `I see you mentioned ${city.name}! 📍 Delivery there costs ${formatPrice(city.rate)} flat${city.slow ? ' (takes 2–3 days for this area)' : ' (next-day available)'}. Would you like me to find some gifts to send there?`,
      si: `${city.name} ගැන! 📍 එහිට බෙදාහැරීම ${formatPrice(city.rate)} flat${city.slow ? ' (දින 2–3 ගතවේ)' : ' (හෙට ලැබේ)'}. එහිට යවන්න තෑගි හොයන්නද?`,
      tl: `${city.name} about! 📍 Ehata delivery eka ${formatPrice(city.rate)} flat${city.slow ? ' (days 2–3 gahawi)' : ' (heta labei)'}. Ehata yawanna gifts hoyannada?` }),
      chips: [`Gifts to ${city.name}`, 'Birthday cakes', 'Flowers'] }
  }

  // ─── 8. Gift message help ─────────────────────────────
  if (/gift message|card message|what.*write|message.*card|sandeshaya|liyanna|icing|write on.*cake|cake.*message/i.test(text)) {
    const isCakeIcing = /icing|write on.*cake|cake.*message|cake.*icing/i.test(text)
    if (isCakeIcing) {
      return { lang, text: L(lang, {
        en: "Great idea! 🎂 You can add a personalized icing message (up to 120 characters) to any cake. Just add a cake to your cart, and you'll see the icing text field in the cart drawer. Here are some ideas:\n\n• \"Happy Birthday [Name]! 🎉\"\n• \"Happy Anniversary Love 💕\"\n• \"Congratulations! 🎓\"\n• \"Suba Aluth Avuruddak! 🇱🇰\"",
        si: 'හොඳ අදහසක්! 🎂 ඕනෑම කේක් එකකට පුද්ගලීකරණය කළ icing පණිවිඩයක් (අක්ෂර 120ක් දක්වා) එකතු කරන්න පුළුවන්. කේක් එකක් කරත්තයට දාන්න, එවිට icing text field එක පෙනෙනවා.',
        tl: 'Honda adahasak! 🎂 Onem cake ekakata personalized icing message ekak (characters 120 dakwa) add karanna puluwan. Cake ekak cart ekata daanna, eviṭa icing text field eka penennawa.' }),
        chips: ['Show me cakes', 'Birthday cakes', 'Add to cart'] }
    }
    return { lang, text: L(lang, {
      en: "I'd love to help you write the perfect note! ✍️ Add an item to your cart, then at checkout I'll help you craft a warm, witty, or formal message — in any language. Here are some starters:\n\n• 🎂 \"Wishing you the sweetest birthday ever!\"\n• 💐 \"Thank you for being amazing, Amma.\"\n• 🇱🇰 \"සුබ අලුත් අවුරුද්දක්! සෞඛ්‍ය සම්පත් ලැබේවා.\"\n• 💝 \"You make every day special. Love always.\"",
      si: 'හරිම ලස්සන සටහනක් ලියන්න මම උදව් කරන්නම්! ✍️ බඩුවක් කරත්තයට දාලා, චෙක්අවුට් එකේදී උණුසුම්, විනෝද හෝ විධිමත් පණිවිඩයක් හදමු — ඕනෑම භාෂාවකින්.',
      tl: 'Lassanama note ekak liyanna mama udaw karannam! ✍️ Baduwak cart ekata daala, checkout ekedi warm, witty nætnam formal message ekak hadamu — onem bhashawakin.' }),
      chips: ['Gifts for mom', 'Birthday cakes', 'Checkout'] }
  }

  // ─── 9. Comparison / recommendation ───────────────────
  if (/which.*better|compare|recommend|suggest|best|hodama|koyda honda|vs|versus|difference between/i.test(text)) {
    const cat = findCat(t)
    const items = search({ cat, occ: null, budget: { min: null, max: null }, sort: 'popular' })
    return { lang, text: L(lang, {
      en: `Here are my top recommendations${cat ? ` in ${cat}` : ''} — the most popular picks! ⭐ I've sorted them by what customers love most:`,
      si: `${cat ? cat + ' වලින් ' : ''}මගේ හොඳම නිර්දේශ මෙන්න — වඩාත්ම ජනප්‍රිය තේරීම්! ⭐`,
      tl: `${cat ? cat + ' walin ' : ''}Mage hondama recommendations mehe — wadaathma popular picks! ⭐` }),
      card: { type: 'carousel', items },
      chips: ['Under Rs. 5,000', 'Show me flowers', 'Make it a hamper'] }
  }

  // ─── 10. "Show me more" / "different options" ─────────
  if (/more|another|different|other|else|options|alternatives|wenath|wenama|thawa/i.test(text) && !/more.*info|more.*detail/i.test(text)) {
    const cat = findCat(t) || null
    const occ = findOcc(t) || null
    const items = search({ cat, occ, budget: { min: null, max: null } })
    // Shuffle for variety
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]]
    }
    return { lang, text: L(lang, {
      en: "Sure! Here are some different picks for you 🔄 — tap Add to pop one in your cart:",
      si: 'හරි! ඔබට වෙනස් තේරීම් කිහිපයක් මෙන්න 🔄 — Add ඔබලා කරත්තයට දාන්න:',
      tl: 'Hari! Oyata wenama picks tikak mehe 🔄 — Add eka press karala cart ekata danna:' }),
      card: { type: 'carousel', items },
      chips: ['Show me cakes', 'Under Rs. 5,000', 'Make it a hamper'] }
  }

  // ─── 11. Delivery fee inquiry ─────────────────────────
  if (/delivery fee|delivery charge|delivery cost|shipping cost|how much.*delivery|delivery.*how much|kochchara.*delivery/i.test(text)) {
    return { lang, text: L(lang, {
      en: "Delivery is a flat fee per order (not per item!) 🚚\n\nHere are some sample rates:\n• Colombo / Nugegoda / Dehiwala — Rs. 350\n• Negombo — Rs. 450\n• Kandy — Rs. 550\n• Galle — Rs. 600\n• Jaffna / Batticaloa — Rs. 850 (2–3 days)\n\nTell me a city and I'll get you the exact rate!",
      si: 'බෙදාහැරීම ඇණවුමකට flat fee එකකි (බඩුවකට නොවේ!) 🚚\n\nනගර කිහිපයකට ගාස්තු:\n• කොළඹ / නුගේගොඩ — රු. 350\n• නේගොම්බ — රු. 450\n• මහනුවර — රු. 550\n• ගාල්ල — රු. 600\n\nනගරය කියන්න, මම හරියටම ගාස්තුව කියන්නම්!',
      tl: 'Delivery eka order ekakata flat fee ekak (baduwakṭa newei!) 🚚\n\n• Colombo — Rs. 350\n• Kandy — Rs. 550\n• Galle — Rs. 600\n• Jaffna — Rs. 850\n\nCity eka kiyanna, mama exact rate eka kiyannṃ!' }),
      chips: ['Deliver to Colombo', 'Deliver to Kandy', 'Deliver to Galle'] }
  }

  // ─── 12. Support / Contact ────────────────────────────
  if (/support|contact|call|phone|help desk|whatsapp|hotline|customer care|complaint|refund|return|cancel/i.test(text)) {
    const isRefund = /refund|return|cancel/i.test(text)
    return { lang, text: L(lang, {
      en: `${isRefund ? "For refunds, returns, or cancellations, please contact Kapruka directly" : "Kapruka's here to help"}! 📞\n\n**24/7 Hotline:** +94 117 551 111\n**WhatsApp (24/7):** +94 707 117 777\n**Order by phone:** 1337 (within Sri Lanka)\n**Global Shop:** WhatsApp +94 707 115 533\n**Head Office:** 147 Old Kottawa Road, Nugegoda\n\nThey'll sort you out in no time! — Kapri`,
      si: `${isRefund ? "ආපසු ගෙවීම්, ආපසු ලබා දීම්, හෝ අවලංගු කිරීම් සඳහා Kapruka සෘජුවම සම්බන්ධ කරගන්න" : "Kapruka ඔබට උදව් කරන්න ලෑස්තියි"}! 📞\n\n**24/7 ක්ෂණික ඇමතුම්:** +94 117 551 111\n**WhatsApp (24/7):** +94 707 117 777\n**දුරකථනයෙන් ඇණවුම්:** 1337\n**ප්‍රධාන කාර්යාලය:** 147 පැරණි කොට්ටාව පාර, නුගේගොඩ`,
      tl: `${isRefund ? "Refunds, returns hari cancellations walata Kapruka directly contact karanna" : "Kapruka oyata udaw karanna lesthiyi"}! 📞\n\n**24/7 Hotline:** +94 117 551 111\n**WhatsApp (24/7):** +94 707 117 777\n**Phone eken order:** 1337\n**Head Office:** 147 Old Kottawa Road, Nugegoda` }),
      chips: ['Track my order', 'Shop something new'] }
  }

  // ─── 13. Cart inquiry ─────────────────────────────────
  if (/what.*cart|my cart|cart.*item|view.*cart|show.*cart|kart eke|cart eke/i.test(text)) {
    if (cartCount === 0) {
      return { lang, text: L(lang, {
        en: "Your cart is empty right now! 🛒 Let me help you find something amazing. What are you looking for?",
        si: 'ඔබේ කරත්තය දැන් හිස්! 🛒 මම ඔබට අපූරු දෙයක් හොයන්න උදව් කරන්නම්. මොනවද හොයන්නේ?',
        tl: 'Oyage cart eka dan his! 🛒 Mama oyata apuru deyak hoyanna udaw karannam. Monawada hoyanne?' }),
        chips: ['Birthday cakes', 'Flowers for mom', 'Gift hamper'] }
    }
    return { lang, action: 'open_cart', text: L(lang, {
      en: `You have ${cartCount} item${cartCount > 1 ? 's' : ''} in your cart! 🛒 Tap the cart icon to review, or say "checkout" when you're ready.`,
      si: `ඔබේ කරත්තයේ බඩු ${cartCount}ක් තියෙනවා! 🛒 බලන්න cart icon එක ඔබන්න, නැත්නම් "checkout" කියන්න.`,
      tl: `Oyage cart eke items ${cartCount}k thiyenawa! 🛒 Balanna cart icon eka obanna, nætnam "checkout" kiyanna.` }),
      chips: ['Checkout', 'Add more items', 'Clear cart'] }
  }

  // ─── 14. Price / sale / discount inquiry ──────────────
  if (/sale|discount|offer|promotion|deal|bargain|cheap|vilata|割引|savings|save money/i.test(text)) {
    const discounted = CATALOG.filter(p => p.was && p.was > p.price)
    if (discounted.length > 0) {
      return { lang, text: L(lang, {
        en: `Great eye for deals! 🏷️ Here are items currently on sale — save up to ${Math.max(...discounted.map(p => Math.round(((p.was! - p.price) / p.was!) * 100)))}% off:`,
        si: `ලස්සන ඇහැක් deals වලට! 🏷️ දැන් sale එකේ තියෙන items මෙන්න:`,
        tl: `Lassana deals walata ayak! 🏷️ Dæn sale eke thiyena items mehe:` }),
        card: { type: 'carousel', items: discounted.slice(0, 8) },
        chips: ['Under Rs. 5,000', 'Show me cakes', 'Checkout'] }
    }
  }

  // ─── 15. Perishable / freshness inquiry ───────────────
  if (/fresh|perishable|how long.*last|expire|shelf life|refrigerat|fridge/i.test(text)) {
    return { lang, text: L(lang, {
      en: "Great question! 🌸 Cakes and flowers are **perishable** — they're made/arranged fresh on the day of delivery. Here's what to know:\n\n• 🎂 **Cakes** — made to order, best consumed same day. Refrigerate if keeping overnight.\n• 💐 **Flowers** — hand-arranged morning of delivery. Put in water immediately.\n• 📦 **Chocolates, hampers, gifts** — non-perishable, no special care needed.\n\nWhen you check delivery for perishable items, I'll flag any date-specific warnings!",
      si: 'හොඳ ප්‍රශ්නයක්! 🌸 කේක් සහ මල් **perishable** — බෙදාහැරීමේ දිනයේම නැවුම්ව සාදනු/සකසනු ලබයි.',
      tl: 'Honda prashnayak! 🌸 Cakes saha flowers **perishable** — delivery dine fresh-wa hadanawa. Cakes same day kaanna hondai. Flowers water walata danna.' }),
      chips: ['Show me cakes', 'Order flowers', 'Non-perishable gifts'] }
  }

  // ─── 16. Search — the main product discovery path ─────
  const cat = findCat(t)
  const occ = findOcc(t)
  const budget = parseBudget(text)
  const sort = detectSort(text)
  const keywords = extractKeywords(text)

  if (cat || occ || budget.max || budget.min || sort || /gift|present|buy|find|show|need|want|තෑග|gift ekak|baduwak|ganna|hoyanna|looking for/i.test(text)) {
    const items = search({ cat, occ, budget, keywords, sort })

    const occText = occ ? (occLabel[occ]?.[lang] || occLabel[occ]?.en || occ) : null
    const budgetText = budget.max
      ? (budget.min ? `${formatPrice(budget.min)} – ${formatPrice(budget.max)}` : `under ${formatPrice(budget.max)}`)
      : (budget.min ? `above ${formatPrice(budget.min)}` : null)

    const bridge = L(lang, {
      en: `Here are some lovely picks${occText ? ' for ' + occText : ''}${budgetText ? ' ' + budgetText : ''}${cat ? ' in ' + cat : ''} 🎁 — tap Add to drop one in your cart:`,
      si: `${budgetText ? budgetText + ' ' : ''}${occText ? occText + ' ' : ''}ලස්සන තේරීම් කිහිපයක් මෙන්න${cat ? ' ' + cat + ' වලින්' : ''} 🎁 — කරත්තයට දාන්න Add ඔබන්න:`,
      tl: `${budgetText ? budgetText + ' ' : ''}${occText ? occText + ' ' : ''}lassana picks tikak mehe${cat ? ' ' + cat + ' walin' : ''} 🎁 — cart ekata danna Add eka press karanna:`,
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
  const items = search({ cat: null, occ: null, budget: { min: null, max: null } })
  return { lang, text: L(lang, {
    en: "I want to get this just right! 💜 Tell me a little more — who's it for, roughly your budget, and any occasion? Meanwhile, here are some all-time favourites:",
    si: 'මට හරියටම හොයලා දෙන්න ඕනේ! 💜 කාටද, කොච්චරටද, occasion එක මොකක්ද කියන්න. මේ අතරේ, හැමෝම කැමති ටික මෙන්න:',
    tl: 'Mata hariyatama hoyala denna oney! 💜 Kaatada, koccharatada, occasion eka mokakda kiyanna. Mesentharen, hæmotama favourite tika mehe:' }),
    card: { type: 'carousel', items },
    chips: ['Gifts for mom', 'Birthday cakes', 'Avurudu hamper', 'What categories do you have?'] }
}
