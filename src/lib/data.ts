import type { Product, City, Category, Occasion, Bundle, Season } from './types'

const IMG = (id: string) => `https://images.unsplash.com/${id}?w=500&h=500&fit=crop`
export const LKR = (n: number) => `Rs. ${Number(n).toLocaleString('en-LK')}`

export const CATALOG: Product[] = [
  // ---- Cakes ----
  { id:'CAKE-2291', name:'Belgian Chocolate Fudge Cake — 1kg', summary:'Rich layered ganache, made fresh to order.', price:4500, was:5200, cat:'Cakes', img:IMG('photo-1578985545062-69928b1d9587'), perishable:true, occ:['birthday','anniversary','mother'] },
  { id:'CAKE-1180', name:'Ribbon Butter Cake — 1kg', summary:'A Sri Lankan classic — soft, buttery, nostalgic.', price:3200, cat:'Cakes', img:IMG('photo-1565958011703-44f9829ba187'), perishable:true, occ:['birthday','mother'] },
  { id:'CAKE-3340', name:'Fresh Strawberry Gateau — 1kg', summary:'Whipped cream & seasonal strawberries.', price:5400, cat:'Cakes', img:IMG('photo-1464349095431-e9a21285b5f3'), perishable:true, occ:['birthday','anniversary'] },
  { id:'CAKE-7782', name:'Red Velvet Cream Cheese Cake', summary:'Velvety crumb, tangy cream-cheese frosting.', price:4900, cat:'Cakes', img:IMG('photo-1586985289688-ca3cf47d3e6e'), perishable:true, occ:['anniversary','valentine'] },
  { id:'CAKE-5521', name:'Chocolate Drip Birthday Cake', summary:'Tall, dramatic, candle-ready.', price:6200, was:6900, cat:'Cakes', img:IMG('photo-1535141192574-5d4897c12636'), perishable:true, occ:['birthday'] },

  // ---- Flowers ----
  { id:'FLOWERS-118', name:'Red Rose Bouquet — Dozen', summary:'A dozen long-stem roses, hand-tied.', price:6900, cat:'Flowers', img:IMG('photo-1518895949257-7621c3c786d7'), perishable:true, occ:['anniversary','valentine','mother'] },
  { id:'FLOWERS-204', name:'Mixed Gerbera Basket', summary:'Bright daisies arranged in a woven basket.', price:5200, cat:'Flowers', img:IMG('photo-1490750967868-88aa4486c946'), perishable:true, occ:['mother','birthday'] },
  { id:'FLOWERS-330', name:'White Lily Arrangement', summary:'Elegant, fragrant lilies for any occasion.', price:6100, cat:'Flowers', img:IMG('photo-1561181286-d3fee7d55364'), perishable:true, occ:['anniversary','sympathy'] },
  { id:'FLOWERS-410', name:'Sunflower & Rose Bunch', summary:'A burst of sunshine, hand-wrapped.', price:4800, cat:'Flowers', img:IMG('photo-1597848212624-a19eb35e2651'), perishable:true, occ:['birthday','mother'] },

  // ---- Chocolates ----
  { id:'CHOC-540', name:'Lindt Lindor Assorted Box', summary:'Smooth-melting Swiss truffles.', price:3200, was:3800, cat:'Chocolates', img:IMG('photo-1549007994-cb92caebd54b'), occ:['birthday','valentine','anniversary'] },
  { id:'CHOC-612', name:'Ferrero Rocher T24', summary:'Golden hazelnut classics, 24-piece.', price:4100, cat:'Chocolates', img:IMG('photo-1481391319762-47dff72954d9'), occ:['anniversary','valentine'] },
  { id:'CHOC-330', name:'Kapruka Dark Truffle Selection', summary:'70% Ceylon dark — locally crafted.', price:2900, cat:'Chocolates', img:IMG('photo-1606312619070-d48b4c652a52'), occ:['birthday','mother'] },

  // ---- Hampers ----
  { id:'GIFT-2201', name:'Pamper Hamper for Mum', summary:'Chocolates, tea & a scented candle.', price:4800, cat:'Hampers', img:IMG('photo-1513885535751-8b9238bd345a'), occ:['mother','birthday'] },
  { id:'GIFT-3090', name:'Avurudu Sweetmeats Hamper', summary:'Kokis, kavum, aluwa — the full New Year spread.', price:5600, was:6400, cat:'Hampers', img:IMG('photo-1601493700631-2b16ec4b4716'), occ:['avurudu'] },
  { id:'GIFT-4412', name:'Gourmet Coffee & Cookies Box', summary:'Roasted beans, biscotti & a ceramic mug.', price:5200, cat:'Hampers', img:IMG('photo-1559056199-641a0ac8b55e'), occ:['father','birthday'] },

  // ---- Perfumes ----
  { id:'PERF-091', name:'Floral Eau de Parfum — 50ml', summary:'Jasmine & sandalwood notes.', price:7900, cat:'Perfumes', img:IMG('photo-1541643600914-78b084683601'), low:true, occ:['anniversary','mother','valentine'] },
  { id:'PERF-150', name:'Mens Wood & Spice EDT — 100ml', summary:'Warm cedar, bergamot, a hint of pepper.', price:8400, cat:'Perfumes', img:IMG('photo-1594035910387-fea47794261f'), occ:['father','anniversary'] },

  // ---- Jewellery ----
  { id:'JEWEL-070', name:'Rose-Gold Heart Pendant', summary:'18k-plated, with a delicate chain.', price:9200, was:11000, cat:'Jewellery', img:IMG('photo-1599643478518-a784e5dc4c8f'), occ:['anniversary','valentine'] },
  { id:'JEWEL-122', name:'Pearl Drop Earrings', summary:'Freshwater pearls, classic elegance.', price:6800, cat:'Jewellery', img:IMG('photo-1535632066927-ab7c9ab60908'), low:true, occ:['mother','anniversary'] },

  // ---- Electronics ----
  { id:'ELEC-330', name:'True-Wireless Earbuds Pro', summary:'ANC, 30-hr case, USB-C.', price:12900, was:15900, cat:'Electronics', img:IMG('photo-1572569511254-d8f925fe2cbb'), occ:['father','birthday','graduation'] },
  { id:'ELEC-410', name:'Smart Fitness Band', summary:'Heart-rate, sleep & step tracking.', price:7400, cat:'Electronics', img:IMG('photo-1575311373937-040b8e1fd5b6'), occ:['father','graduation'] },

  // ---- Soft Toys ----
  { id:'TOY-205', name:'Giant Teddy Bear — 80cm', summary:'Super-soft, huggable, gift-ready.', price:5900, cat:'Soft Toys', img:IMG('photo-1559454403-b8fb88521f11'), occ:['birthday','valentine'] },
]

export const CATEGORIES: Category[] = [
  { name:'Cakes',       emoji:'🎂', q:'cakes',       img:IMG('photo-1578985545062-69928b1d9587') },
  { name:'Flowers',     emoji:'🌹', q:'flowers',     img:IMG('photo-1518895949257-7621c3c786d7') },
  { name:'Chocolates',  emoji:'🍫', q:'Chocolates',  img:IMG('photo-1549007994-cb92caebd54b') },
  { name:'Grocery',     emoji:'🛒', q:'grocery',     img:IMG('photo-1542838132-92c53300491e') },
  { name:'Fashion',     emoji:'👗', q:'fashion',     img:IMG('photo-1743764180148-b712e5293800') },
  { name:'Hampers',     emoji:'🧺', q:'Giftset',     img:IMG('photo-1513885535751-8b9238bd345a') },
  { name:'Jewellery',   emoji:'💍', q:'Jewellery',   img:IMG('photo-1599643478518-a784e5dc4c8f') },
  { name:'Electronics', emoji:'📱', q:'Electronic',  img:IMG('photo-1572569511254-d8f925fe2cbb') },
  { name:'Cosmetics',   emoji:'🧴', q:'Cosmetics',   img:IMG('photo-1620916566398-39f1143ab7be') },
  { name:'Household',   emoji:'🏠', q:'household',   img:IMG('photo-1619216083420-6e54b895f730') },
  { name:'Kids & Toys', emoji:'🧸', q:'KidsToys',    img:IMG('photo-1559454403-b8fb88521f11') },
  //{ name:'Liquor',      emoji:'🍷', q:'Liquor',      img:IMG('photo-1569529465841-dfecdab7503b') },
  { name:'Books',       emoji:'📚', q:'Books',       img:IMG('photo-1544947950-fa07a98d237f') },
]

export const OCCASIONS: Occasion[] = [
  { name:'Birthday',    emoji:'🎉', q:'birthday',    img:IMG('photo-1558636508-e0db3814bd1d') },
  { name:'Anniversary', emoji:'💞', q:'anniversary', img:IMG('photo-1518199266791-5375a83190b7') },
  { name:'For Mom',     emoji:'👩', q:'mother',      img:IMG('photo-1511895426328-dc8714191300') },
  { name:'For Dad',     emoji:'👨', q:'father',      img:IMG('photo-1506506200949-df8644f002d1') },
  { name:'Wedding',     emoji:'💒', q:'wedding',     img:IMG('photo-1511285560929-80b456fea0bc') },
  { name:'Graduation',  emoji:'🎓', q:'graduation',  img:IMG('photo-1541339907198-e08756dedf3f') },
]

export const CITIES: City[] = [
  { name:'Colombo',       rate:350 },
  { name:'Dehiwala',      rate:350 },
  { name:'Mount Lavinia', rate:400 },
  { name:'Nugegoda',      rate:350 },
  { name:'Kandy',         rate:550 },
  { name:'Galle',         rate:600 },
  { name:'Negombo',       rate:450 },
  { name:'Kurunegala',    rate:600 },
  { name:'Matara',        rate:700 },
  { name:'Jaffna',        rate:850, slow:true },
  { name:'Batticaloa',    rate:850, slow:true },
  { name:'Anuradhapura',  rate:700 },
  { name:'Ratnapura',     rate:650 },
  { name:'Badulla',       rate:750 },
]

export const BUNDLES: Record<string, Bundle> = {
  avurudu: {
    title:'Avurudu Celebration Hamper 🇱🇰',
    blurb:"Suba Aluth Avuruddak! Here's a hamper that brings the whole New Year table together — sweetmeats to share, blooms for the home, and a little something sweet.",
    ids:['GIFT-3090','FLOWERS-204','CHOC-330'],
    message:'Suba Aluth Avuruddak! Wishing you and the family health, happiness and a table full of kavum. 🇱🇰',
  },
  mother: {
    title:'Pamper-Mum Bundle 💐',
    blurb:"For the woman who does everything — flowers she'll display proudly, a cake to share, and a scent that's all hers.",
    ids:['FLOWERS-118','CAKE-1180','PERF-091'],
    message:'Amma, thank you for everything. You deserve the world today and every day. 💜',
  },
  birthday: {
    title:'Birthday Surprise Bundle 🎉',
    blurb:"Everything for a birthday they won't forget — a show-stopper cake, a cuddly friend, and chocolates for the table.",
    ids:['CAKE-5521','TOY-205','CHOC-540'],
    message:'Happy Birthday! Hope your day is as wonderful as you are. 🎂🎉',
  },
}

/**
 * Full-year seasonal calendar for Sri Lanka.
 * Each entry has a date window (MM-DD start → end, inclusive).
 * The first matching entry wins, so order matters within each month.
 * When one event ends, the next automatically takes over.
 */
const SEASONAL_CALENDAR: Season[] = [
  // ──── January ────
  { key:'new-year',     startDate:'01-01', endDate:'01-07', emoji:'🎆', greeting:'Happy New Year!',              sub:'Start 2026 with the perfect gift — cakes, hampers & more',           cta:'New Year gifts',     q:'gifts' },
  { key:'thai-pongal',  startDate:'01-08', endDate:'01-16', emoji:'🌾', greeting:'Happy Thai Pongal!',           sub:'Celebrate the harvest — sweets, flowers & festive hampers',           cta:'Pongal gifts',       q:'hampers' },
  { key:'jan-gifting',  startDate:'01-17', endDate:'01-31', emoji:'💝', greeting:'New Year, new surprises!',     sub:'Treat someone special this January',                                  cta:'Shop now',           q:'gifts' },

  // ──── February ────
  { key:'valentine-early', startDate:'02-01', endDate:'02-07', emoji:'💕', greeting:"Valentine's is coming!",    sub:"Don't wait — order flowers, chocolates & gifts early",                cta:'Early bird deals',   q:'valentine' },
  { key:'valentine',       startDate:'02-08', endDate:'02-15', emoji:'❤️', greeting:"Happy Valentine's Day!",    sub:'Say it with roses, chocolates & a heartfelt note',                    cta:'Valentine gifts',    q:'valentine' },
  { key:'feb-love',        startDate:'02-16', endDate:'02-28', emoji:'🌹', greeting:'Love lingers on',           sub:"It's never too late to surprise someone special",                     cta:'Send love',          q:'flowers' },

  // ──── March ────
  { key:'womens-day',     startDate:'03-01', endDate:'03-10', emoji:'👩', greeting:"Happy Women's Day!",         sub:'Celebrate the amazing women in your life',                            cta:'Gifts for her',      q:'mother' },
  { key:'spring-gifting', startDate:'03-11', endDate:'03-25', emoji:'🌸', greeting:'Spring into gifting!',       sub:'Fresh flowers, cakes & hampers — delivered island-wide',              cta:'Spring gifts',       q:'flowers' },
  { key:'avurudu-prep',   startDate:'03-26', endDate:'03-31', emoji:'🇱🇰', greeting:'Avurudu is around the corner!', sub:'Get your sweetmeats, hampers & gifts ready early',              cta:'Pre-order now',      q:'Avurudu hamper bundle' },

  // ──── April ────
  { key:'avurudu',       startDate:'04-01', endDate:'04-16', emoji:'🇱🇰', greeting:'Suba Aluth Avuruddak!',     sub:'Avurudu hampers, sweets & kiribath gifts — island-wide',              cta:'Avurudu hampers',    q:'Avurudu hamper bundle' },
  { key:'april-treats',  startDate:'04-17', endDate:'04-30', emoji:'🎊', greeting:'Post-Avurudu treats',        sub:'Keep the festive spirit going — cakes, gifts & more',                 cta:'Shop treats',        q:'cakes' },

  // ──── May ────
  { key:'may-day',       startDate:'05-01', endDate:'05-04', emoji:'✊', greeting:'Happy May Day!',              sub:'Celebrate with gifts for your favourite people',                      cta:'Shop gifts',         q:'gifts' },
  { key:'wesak',         startDate:'05-05', endDate:'05-15', emoji:'🪔', greeting:'Happy Wesak!',               sub:'Brighten the season with a thoughtful gift',                          cta:'Wesak gifts',        q:'gifts' },
  { key:'mothers-day',   startDate:'05-16', endDate:'05-31', emoji:'💐', greeting:"Happy Mother's Day!",        sub:"Show Amma your love — flowers, cakes & pampering gifts",              cta:"Gifts for Mom",      q:'mother' },

  // ──── June ────
  { key:'poson',         startDate:'06-01', endDate:'06-15', emoji:'🌕', greeting:'Happy Poson!',               sub:'Share the Poson spirit — flowers, sweets & more',                     cta:'Poson gifts',        q:'flowers' },
  { key:'fathers-day',   startDate:'06-16', endDate:'06-25', emoji:'👔', greeting:"Happy Father's Day!",        sub:'Gadgets, grooming & gifts Dad will actually love',                    cta:'Gifts for Dad',      q:'father' },
  { key:'june-gifting',  startDate:'06-26', endDate:'06-30', emoji:'🎁', greeting:'Mid-year gifting',           sub:'Surprise someone — cakes, chocolates & hampers',                      cta:'Shop now',           q:'gifts' },

  // ──── July ────
  { key:'esala',         startDate:'07-01', endDate:'07-15', emoji:'🐘', greeting:'Esala Perahera Season!',     sub:'Celebrate Sri Lankan heritage — festive hampers & gifts',              cta:'Festive gifts',      q:'hampers' },
  { key:'friendship',    startDate:'07-16', endDate:'07-31', emoji:'🤝', greeting:'Friendship Month!',          sub:'Send your bestie something sweet — chocolates, cakes & more',         cta:'BFF gifts',          q:'chocolates' },

  // ──── August ────
  { key:'nikini',        startDate:'08-01', endDate:'08-10', emoji:'🌕', greeting:'Happy Nikini Poya!',         sub:'A mindful gift for a meaningful day',                                  cta:'Poya gifts',         q:'gifts' },
  { key:'back-to-school',startDate:'08-11', endDate:'08-25', emoji:'📚', greeting:'Back to School!',            sub:'Books, stationery & treats for the little ones',                      cta:'Shop for kids',      q:'KidsToys' },
  { key:'aug-gifting',   startDate:'08-26', endDate:'08-31', emoji:'🎁', greeting:'End of summer treats',       sub:'Wrap up August with a surprise delivery',                             cta:'Send a gift',        q:'gifts' },

  // ──── September ────
  { key:'teachers-day',  startDate:'09-01', endDate:'09-07', emoji:'📝', greeting:"Happy Teachers' Day!",       sub:"Thank your favourite teacher — flowers, hampers & more",               cta:'Teacher gifts',      q:'hampers' },
  { key:'sep-wellness',  startDate:'09-08', endDate:'09-20', emoji:'🧘', greeting:'Self-care season',           sub:'Treat yourself — cosmetics, perfumes & pamper kits',                   cta:'Pamper gifts',       q:'Cosmetics' },
  { key:'sep-gifting',   startDate:'09-21', endDate:'09-30', emoji:'🎁', greeting:'Surprise someone today!',    sub:'Flowers, cakes & chocolates — delivered with love',                    cta:'Send joy',           q:'gifts' },

  // ──── October ────
  { key:'deepavali',     startDate:'10-01', endDate:'10-15', emoji:'🪔', greeting:'Happy Deepavali!',           sub:'Sweets, lights & gifts for the festival of lights',                   cta:'Deepavali gifts',    q:'chocolates' },
  { key:'halloween',     startDate:'10-16', endDate:'10-31', emoji:'🎃', greeting:'Trick or Treat!',            sub:'Spooky sweets, chocolate hampers & fun gifts',                        cta:'Halloween treats',   q:'chocolates' },

  // ──── November ────
  { key:'nov-gratitude', startDate:'11-01', endDate:'11-14', emoji:'🙏', greeting:'Season of gratitude',        sub:'Say thank you with a heartfelt gift',                                  cta:'Thank-you gifts',    q:'gifts' },
  { key:'black-friday',  startDate:'11-15', endDate:'11-30', emoji:'🛍️', greeting:'Black Friday deals!',       sub:'Unbeatable prices on gifts, electronics & hampers',                    cta:'Shop deals',         q:'Electronic' },

  // ──── December ────
  { key:'christmas-early', startDate:'12-01', endDate:'12-20', emoji:'🎄', greeting:'Christmas is coming!',     sub:'Order early — cakes, hampers & gifts for everyone on your list',       cta:'Christmas gifts',    q:'hampers' },
  { key:'christmas',       startDate:'12-21', endDate:'12-26', emoji:'🎅', greeting:'Merry Christmas!',         sub:'Christmas cakes, hampers & gifts to spread cheer',                    cta:'Last-minute gifts',  q:'hampers' },
  { key:'year-end',        startDate:'12-27', endDate:'12-31', emoji:'🥂', greeting:'Cheers to a great year!',  sub:'End the year on a sweet note — cakes, chocolates & more',             cta:'Year-end gifts',     q:'gifts' },
]

/** Resolve which seasonal event is active right now based on today's date. */
function currentSeason(): Season {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const today = `${mm}-${dd}`

  for (const s of SEASONAL_CALENDAR) {
    if (s.startDate && s.endDate && today >= s.startDate && today <= s.endDate) {
      return s
    }
  }
  // Fallback — should never happen since every day is covered
  return { key:'evergreen', emoji:'🎁', greeting:'Gifting made joyful', sub:'Find the perfect gift for any occasion — island-wide delivery', cta:'Popular gifts', q:'gifts' }
}
export const SEASON = currentSeason()
/** Expose the full calendar for components that need upcoming events. */
export const SEASONAL_EVENTS = SEASONAL_CALENDAR

export const CAT_BLURB: Record<string, string> = {
  Cakes:       "Freshly baked to order by Kapruka's master bakers using premium ingredients, and delivered on a sturdy board with a complimentary message card. Personalise it with an icing message below.",
  Flowers:     "Hand-arranged by our florists on the morning of delivery and presented in protective wrapping so it arrives garden-fresh.",
  Chocolates:  "Stored and shipped with care to keep every piece perfect. A crowd-pleasing gift for any occasion.",
  Hampers:     "Thoughtfully curated and gift-wrapped, ready to hand over. A little of everything they'll love.",
  Perfumes:    "100% authentic, sealed stock sourced through authorised channels. Comes boxed and gift-ready.",
  Jewellery:   "Comes in a presentation box with a care card — a keepsake they'll treasure.",
  Electronics: "Genuine stock with manufacturer warranty. Boxed and ready to gift or use straight away.",
  'Soft Toys': "Super-soft, cuddle-tested and surface-washable — a friend for keeps.",
}
