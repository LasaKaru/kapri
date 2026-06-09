/* Kapri demo — conversation engine: language detect + intents + multilingual replies. */
const { CATALOG, BUNDLES, CITIES } = window.KapriData

const TANGLISH_HINTS = ['mata','ekak','ekata','gannako','ganna','amma','ammata','thaaththa','hadanna','oyaa','mama','tikak','hoyanna','hoya','neda','denna','puluwan','kawda','monawada','mal','genna','avurudu','suba','bohoma','ane','hari','kohomada','kiyanna','heta','ada','salli']
const SI_RE = /[\u0D80-\u0DFF]/

function detectLang(text) {
  if (SI_RE.test(text)) return 'si'
  const t = ' ' + text.toLowerCase() + ' '
  let hits = 0
  for (const w of TANGLISH_HINTS) if (t.includes(' ' + w + ' ') || t.includes(w)) hits++
  return hits >= 1 ? 'tl' : 'en'
}

function L(lang, m) { return m[lang] || m.en }

function parseBudget(text) {
  const t = text.replace(/,/g, '')
  let m = t.match(/(?:under|below|less than|max|budget|යට|ට\s*අඩු|wadi nathi|under)\D*(\d{3,6})/i)
  if (m) return parseInt(m[1], 10)
  m = t.match(/(\d{4,6})\s*(?:ට|ta|wලට|rupees|rs)/i)
  if (m) return parseInt(m[1], 10)
  m = t.match(/rs\.?\s*(\d{3,6})/i)
  if (m && /under|below|less|යට|wadi nathi|budget/i.test(t)) return parseInt(m[1], 10)
  return null
}

const CAT_KEYS = {
  Cakes: ['cake', 'cakes', 'gateau', 'කේක්', 'cake ekak'],
  Flowers: ['flower', 'flowers', 'bouquet', 'rose', 'roses', 'මල්', 'mal', 'mala'],
  Chocolates: ['chocolate', 'chocolates', 'choc', 'truffle', 'ferrero', 'lindt', 'චොකලට්'],
  Hampers: ['hamper', 'hampers', 'gift set', 'giftset', 'basket'],
  Perfumes: ['perfume', 'perfumes', 'fragrance', 'scent', 'edt', 'edp', 'cologne'],
  Jewellery: ['jewellery', 'jewelry', 'pendant', 'earring', 'earrings', 'necklace', 'ring'],
  Electronics: ['electronic', 'electronics', 'earbud', 'earbuds', 'headphone', 'gadget', 'watch', 'band', 'tech'],
  'Soft Toys': ['soft toy', 'soft toys', 'teddy', 'toy', 'plush', 'bear'],
}
const OCC_KEYS = {
  mother: ['mother', 'mom', 'mum', 'amma', 'ammata', 'amage', 'අම්ම'],
  father: ['father', 'dad', 'thaaththa', 'thatta', 'appa', 'තාත්ත'],
  birthday: ['birthday', 'bday', 'උපන්දින', 'upandina', 'janma'],
  anniversary: ['anniversary', 'wedding anniversary', 'සංවත්සර'],
  valentine: ['valentine', 'love', 'girlfriend', 'boyfriend', 'wife', 'husband', 'ආදර'],
  avurudu: ['avurudu', 'aurudu', 'new year', 'අවුරුදු', 'aluth avurudu'],
  graduation: ['graduation', 'graduate', 'convocation'],
}

function findCat(t) { for (const [c, ks] of Object.entries(CAT_KEYS)) if (ks.some((k) => t.includes(k))) return c; return null }
function findOcc(t) { for (const [o, ks] of Object.entries(OCC_KEYS)) if (ks.some((k) => t.includes(k))) return o; return null }
function findCity(text) { return CITIES.find((c) => new RegExp('\\b' + c.name + '\\b', 'i').test(text)) }

function search({ cat, occ, budget }) {
  let list = CATALOG.slice()
  if (cat) list = list.filter((p) => p.cat === cat)
  if (occ) list = list.filter((p) => (p.occ || []).includes(occ))
  if (budget) list = list.filter((p) => p.price <= budget)
  if (list.length === 0 && occ) list = CATALOG.filter((p) => (p.occ || []).includes(occ))
  if (list.length === 0) list = CATALOG.filter((p) => ['Cakes', 'Flowers', 'Chocolates', 'Hampers'].includes(p.cat))
  return list.slice(0, 8)
}

function respond(text, ctx) {
  const lang = detectLang(text)
  const t = ' ' + text.toLowerCase().trim() + ' '
  const cartCount = ctx.cartCount

  // --- track order (Kapruka MCP: Track Kapruka Order — by VIMP number) ---
  if (/track|vimp|where.*order|order.*status|kohedha|tracking/i.test(text)) {
    const vimp = (text.match(/VIMP[A-Z0-9]+/i) || [])[0]
    if (vimp) return { lang, text: L(lang, {
      en: `Found it! 📦 Here's where ${vimp.toUpperCase()} is right now:`,
      si: `හම්බුණා! 📦 ${vimp.toUpperCase()} දැන් ඉන්නේ මෙතන:`,
      tl: `Hambuna! 📦 ${vimp.toUpperCase()} dæn inne mehe:` }), card: { type: 'tracker', number: vimp.toUpperCase() },
      chips: ['Shop something new', 'Talk to support'] }
    if (ctx.lastVimp) return { lang, text: L(lang, {
      en: `Sure! Here's your most recent order. To track any other order, just paste its VIMP number. 📦`,
      si: `හරි! ඔබේ අලුත්ම ඇණවුම මෙන්න. වෙන ඇණවුමක් track කරන්න VIMP අංකය paste කරන්න. 📦`,
      tl: `Hari! Oyage aluthma order eka mehe. Wena order ekak track karanna VIMP number eka paste karanna. 📦` }), card: { type: 'tracker', number: ctx.lastVimp },
      chips: ['Shop something new'] }
    return { lang, text: L(lang, {
      en: "Happy to track that! 📦 What's your order number? It starts with VIMP… (you'll find it in your confirmation email).",
      si: "ට්‍රැක් කරන්නම්! 📦 ඔබේ ඇණවුම් අංකය මොකක්ද? VIMP… වලින් පටන් ගන්නවා (ඊමේල් එකේ තියෙනවා).",
      tl: "Track karannam! 📦 Oyage order number eka mokakda? VIMP… valin patan gannawa (email eke thiyenawa)." }),
      chips: ['VIMP34456CB2', 'Shop something new'] }
  }

  // --- checkout intent ---
  if (/check ?out|pay now|place.*order|buy now|proceed|order karanna|salli/i.test(text)) {
    if (cartCount === 0) return { lang, text: L(lang, {
      en: "Your cart's empty right now! 🛍️ Tell me who you're shopping for and I'll find something lovely first.",
      si: "ඔබේ කරත්තය දැන් හිස්! 🛍️ කාටද ගන්නේ කියන්න, මම මුලින්ම ලස්සන දෙයක් හොයන්නම්.",
      tl: "Oyage cart eka dæn his! 🛍️ Kaatada ganne kiyanna, mama mulinma lassana dheyak hoyannam." }), chips: ['Gifts for mom', 'Birthday cakes', 'Avurudu hamper'] }
    return { lang, action: 'checkout', text: L(lang, {
      en: "Let's get this delivered! Just a few quick details… 🚚",
      si: "මේක ගෙදරටම ගේමු! පොඩි විස්තර කිහිපයක්… 🚚",
      tl: "Apita meka deliver karamu! Podi vistara tikak witharai… 🚚" }) }
  }

  // --- bundle / hamper builder ---
  if (/hamper|bundle|combo|themed|package deal|curate/i.test(text) || (/avurudu|aurudu|new year/i.test(text) && /hamper|bundle|gift/i.test(text))) {
    let key = 'birthday'
    if (/avurudu|aurudu|new year|අවුරුදු/i.test(text)) key = 'avurudu'
    else if (findOcc(t) === 'mother') key = 'mother'
    return { lang, text: L(lang, {
      en: "Ooh, I love a good hamper! 🎁 Here's a little something I curated — add it all in one tap:",
      si: "අනේ මට හැම්පර් හදන්න ආසයි! 🎁 මම හැදුව පුංචි එකතුවක් මෙන්න — එක ටැප් එකෙන් එකතු කරන්න:",
      tl: "Ane mata hamper hadanna aasai! 🎁 Mama curate-kaloth podi ekak mehe — eka tap eken okkoma add karanna:" }),
      card: { type: 'bundle', key }, chips: ['Show me cakes', 'Add a gift message', 'Checkout'] }
  }

  // --- delivery to a city ---
  const city = findCity(text)
  if (city && /deliver|delivery|send to|ship|ගේන්න|genna/i.test(text)) {
    return { lang, text: L(lang, {
      en: `Good news — here's the delivery picture for ${city.name}:`,
      si: `සුබ ආරංචියක් — ${city.name} සඳහා බෙදාහැරීමේ විස්තර මෙන්න:`,
      tl: `Suba aranchiyak — ${city.name} ekata delivery eka mehe:` }),
      card: { type: 'delivery', city: city.name, rate: city.rate, slow: city.slow },
      chips: ['Find a gift', 'Checkout'] }
  }

  // --- gift message help ---
  if (/gift message|card message|what.*write|message.*card|sandeshaya|liyanna/i.test(text)) {
    return { lang, text: L(lang, {
      en: "I'd love to help you write the perfect note! ✍️ Add an item to your cart, then at checkout I'll help you craft a warm, witty, or formal message — in any language.",
      si: "හරිම ලස්සන සටහනක් ලියන්න මම උදව් කරන්නම්! ✍️ බඩුවක් කරත්තයට දාලා, චෙක්අවුට් එකේදී උණුසුම්, විනෝද හෝ විධිමත් පණිවිඩයක් හදමු.",
      tl: "Lassanama note ekak liyanna mama udaw karannam! ✍️ Baduwak cart ekata daala, checkout ekedi warm, witty nætnam formal message ekak hadamu — ඕනෑම language ekakin." }),
      chips: ['Gifts for mom', 'Birthday cakes', 'Checkout'] }
  }

  // --- help / capabilities ---
  if (/^\s*(help|what can you|who are you|hi|hello|hey|ayubowan|ආයුබෝවන්|hari|start)\s*$/i.test(text) || /what.*do you do/i.test(text)) {
    return { lang, text: L(lang, {
      en: "Hi, I'm Kapri — your Kapruka shopping concierge! 🛍️ Tell me who you're shopping for and your budget, and I'll find the perfect gift, sort delivery to any city in Sri Lanka, and take you all the way to a pay link. What are we shopping for today?",
      si: "ආයුබෝවන්! මම Kapri — ඔබේ Kapruka සාප්පු සහායක! 🛍️ කාටද, කොච්චරටද කියන්න — මම හොඳම තෑග්ග හොයලා, ලංකාවේ ඕනෑම නගරයකට බෙදාහැරීම සකසලා, ගෙවීම දක්වාම ඔබව රැගෙන යන්නම්. අද මොනවද ගන්නේ?",
      tl: "Ayubowan! Mama Kapri — oyage Kapruka shopping concierge! 🛍️ Kaatada, koccharatada kiyanna — mama hondama gift eka hoyala, Lankawe ඕනෑම town ekakata delivery eka set-kara, pay link ekata kanma oyawa aran yannam. Ada monawada ganne?" }),
      chips: ['Gifts for mom under Rs. 5,000', 'Birthday cakes', 'Avurudu hamper'] }
  }

  // --- search (category / occasion / budget) ---
  const cat = findCat(t), occ = findOcc(t), budget = parseBudget(text)
  if (cat || occ || budget || /gift|present|buy|find|show|need|want|තෑග|gift ekak|baduwak/i.test(text)) {
    const items = search({ cat, occ, budget })
    const occLabel = { mother: 'your amma', father: 'your thaaththa', birthday: 'the birthday', anniversary: 'the anniversary', valentine: 'your special someone', avurudu: 'Avurudu', graduation: 'the graduate' }[occ]
    const bridge = L(lang, {
      en: `Here are some lovely picks${occLabel ? ' for ' + occLabel : ''}${budget ? ' under Rs. ' + budget.toLocaleString('en-LK') : ''} 🎁 — tap Add to drop one in your cart:`,
      si: `${budget ? 'රු. ' + budget.toLocaleString('en-LK') + 'ට අඩුවෙන් ' : ''}ලස්සන තේරීම් කිහිපයක් මෙන්න 🎁 — කරත්තයට දාන්න Add ඔබන්න:`,
      tl: `${budget ? 'Rs. ' + budget.toLocaleString('en-LK') + 'ට yatin ' : ''}lassana picks tikak mehe 🎁 — cart ekata danna Add eka press karanna:` })
    return { lang, text: bridge, card: { type: 'carousel', items }, chips: budget ? ['Even cheaper', 'Add a gift message', 'Checkout'] : ['Under Rs. 5,000', 'Make it a hamper', 'Checkout'] }
  }

  // --- fallback ---
  const items = search({ cat: null, occ: null, budget: null })
  return { lang, text: L(lang, {
    en: "I want to get this just right! 💜 Tell me a little more — who's it for and roughly your budget? Meanwhile, here are some all-time favourites:",
    si: "මට හරියටම හොයලා දෙන්න ඕනේ! 💜 කාටද, කොච්චරටද කියන්න. මේ අතරේ, හැමෝම කැමති ටික මෙන්න:",
    tl: "Mata hariyatama hoyala denna ඕනේ! 💜 Kaatada, koccharatada kiyanna. Mesentharen, hæmotama favourite tika mehe:" }),
    card: { type: 'carousel', items }, chips: ['Gifts for mom', 'Birthday cakes', 'Avurudu hamper'] }
}

window.KapriEngine = { detectLang, respond }
