/* Kapri demo — app orchestration. */
const { Header, SeasonBanner, UserBubble, KapriRow, KapriText, Typing, Chip, Composer } = window.KapriUI
const { EmptyState, ProductCarousel, BundleCard, DeliveryStatus, OrderTracker, ProductDetail, SkeletonCarousel } = window.KapriGenUI
const { CartDrawer, CheckoutFlow, CheckoutCard, PaymentSheet } = window.KapriCheckout
const { respond } = window.KapriEngine
const { CATALOG, CATEGORIES, BUNDLES, SEASON, LKR } = window.KapriData

const PROMPTS_EN = [
  { emoji: '🎁', text: 'I need a gift for my mother, under Rs. 5,000' },
  { emoji: '🎂', text: 'Mata ammata cake ekak gannako — Colombo ekata' },
  { emoji: '🛍️', text: 'අම්මට තෑග්ගක් — රු. 5000ට අඩුවෙන්' },
]
// Lead with the live season, then the staples
const PROMPTS = [{ emoji: SEASON.emoji, text: SEASON.cta }, ...PROMPTS_EN]

function App() {
  const [msgs, setMsgs] = React.useState([])
  const [input, setInput] = React.useState('')
  const [cart, setCart] = React.useState(() => { try { return JSON.parse(localStorage.getItem('kapri_cart')) || [] } catch (e) { return [] } })
  const [giftMessage, setGiftMessage] = React.useState(() => { try { return localStorage.getItem('kapri_gift') || '' } catch (e) { return '' } })
  const [cartOpen, setCartOpen] = React.useState(false)
  const [checkoutOpen, setCheckoutOpen] = React.useState(false)
  const [detailProduct, setDetailProduct] = React.useState(null)
  const [payOrder, setPayOrder] = React.useState(null)
  const [paidRef, setPaidRef] = React.useState(null)
  const [placedOrder, setPlacedOrder] = React.useState(null)
  const [lang, setLang] = React.useState(() => { try { return localStorage.getItem('kapri_lang') || 'en' } catch (e) { return 'en' } })
  const [lastLang, setLastLang] = React.useState('en')
  const [typing, setTyping] = React.useState(false)
  const [pendingKind, setPendingKind] = React.useState(null)
  const [toast, setToast] = React.useState(null)
  const [recording, setRecording] = React.useState(false)
  const recognitionRef = React.useRef(null)
  const scrollRef = React.useRef(null)

  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [msgs, typing])
  // Persistence — cart, gift message and language survive a refresh
  React.useEffect(() => { try { localStorage.setItem('kapri_cart', JSON.stringify(cart)) } catch (e) {} }, [cart])
  React.useEffect(() => { try { localStorage.setItem('kapri_gift', giftMessage) } catch (e) {} }, [giftMessage])
  React.useEffect(() => { try { localStorage.setItem('kapri_lang', lang) } catch (e) {} }, [lang])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartIds = cart.map((i) => i.p.id)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1900) }

  const addToCart = (p) => {
    setCart((c) => { const e = c.find((i) => i.p.id === p.id); return e ? c.map((i) => i.p.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { p, qty: 1, icing: '' }] })
    showToast(`Added · ${p.name.split('—')[0].trim()} 🛒`)
  }
  const addDetail = (p, qty = 1, icing) => {
    setCart((c) => { const e = c.find((i) => i.p.id === p.id)
      return e ? c.map((i) => i.p.id === p.id ? { ...i, qty: i.qty + qty, icing: icing || i.icing } : i) : [...c, { p, qty, icing: icing || '' }] })
    showToast(`Added · ${p.name.split('—')[0].trim()} 🛒`)
  }
  const addBundle = (key) => { const ids = BUNDLES[key].ids; ids.forEach((id) => { const p = CATALOG.find((x) => x.id === id); if (p) addToCart(p) }); showToast('Bundle added to cart 🎁') }
  const changeQty = (id, d) => setCart((c) => c.map((i) => i.p.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))
  const removeItem = (id) => setCart((c) => c.filter((i) => i.p.id !== id))
  const setIcing = (id, v) => setCart((c) => c.map((i) => i.p.id === id ? { ...i, icing: v } : i))

  const send = (text) => {
    const v = (text ?? input).trim(); if (!v) return
    const isSearch = !/track|vimp|check ?out|pay now|place.*order|^\s*(help|hi|hello|hey|ayubowan)\s*$/i.test(v)
    setInput(''); setMsgs((m) => [...m, { role: 'user', text: v }]); setTyping(true); setPendingKind(isSearch ? 'search' : null)
    setTimeout(() => {
      const r = respond(v, { cartCount: cart.reduce((s, i) => s + i.qty, 0), lastVimp: placedOrder ? placedOrder.number : null })
      setLastLang(r.lang); if (r.lang !== 'en') setLang('si')
      setTyping(false); setPendingKind(null)
      setMsgs((m) => [...m, { role: 'kapri', ...r }])
      if (r.action === 'checkout') setTimeout(() => setCheckoutOpen(true), 350)
    }, 850 + Math.random() * 400)
  }

  const startCheckout = () => { setCartOpen(false); if (cartCount === 0) { send('I want to checkout'); return } setCheckoutOpen(true) }

  const onPlaced = (order) => {
    setCheckoutOpen(false)
    const vimp = 'VIMP' + Math.floor(10000 + Math.random() * 89999) + 'CB2'
    setPlacedOrder({ number: vimp, statusDisplay: 'Order received', stage: 0, live: true,
      orderDate: new Date().toLocaleDateString('en-LK', { weekday: 'short', day: 'numeric', month: 'short' }),
      deliveryDate: order.date ? `${order.date.label} ${order.date.day} ${order.date.mon}` : 'Soon',
      recipient: `${order.recipient}, ${order.city}`, amount: order.total,
      items: (order.items || []).map((it) => ({ img: it.p.img, name: it.p.name, qty: it.qty, price: it.p.price, icing: it.icing })) })
    setMsgs((m) => [...m, { role: 'kapri', lang: lastLang, text: {
      en: `Bohoma santhosai! 🎉 Your order's locked in — just tap Pay Now to finish. After payment you'll get a VIMP tracking number by email.`,
      si: `බොහොම සන්තෝසයි! 🎉 ඔබේ ඇණවුම සකස් වුණා — අවසන් කරන්න Pay Now ඔබන්න. ගෙවීමෙන් පසු VIMP ට්‍රැකින් අංකයක් ඊමේල් එකෙන් ලැබේවි.`,
      tl: `Bohoma santhosai! 🎉 Oyage order eka lock-una — ivara karanna Pay Now eka press karanna. Gevimen passe VIMP tracking number ekak email ekata enawa.` }[lastLang] || '', card: { type: 'checkout', order }, chips: ['Track my order', 'Shop something else'] }])
    setCart([]); setGiftMessage('')
  }

  const onPaid = (o) => {
    setPayOrder(null); setPaidRef(o.ref)
    setPlacedOrder((p) => p ? { ...p, stage: 1, statusDisplay: 'Order confirmed' } : p)
    showToast('Payment successful 🎉')
    setMsgs((m) => [...m, { role: 'kapri', lang: lastLang, text: {
      en: `Payment received — bohoma sthuthi! 🎉 Your order is confirmed and our team is on it. Track it anytime with your VIMP number.`,
      si: `ගෙවීම ලැබුණා — බොහොම ස්තූතියි! 🎉 ඔබේ ඇණවුම තහවුරුයි, අපේ කණ්ඩායම වැඩ පටන් අරන්. VIMP අංකයෙන් ඕනෑම වෙලාවක ට්‍රැක් කරන්න.`,
      tl: `Gevima læbuna — bohoma sthuthi! 🎉 Oyage order eka confirm, ape team eka weda patan aran. VIMP number eken ඕනෑම velawaka track karanna.` }[lastLang] || '', chips: ['Track my order', 'Shop something else'] }])
  }

  // Real speech-to-text — Sinhala first (si-LK), graceful fallback if unsupported/blocked.
  const onMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (recording && recognitionRef.current) { recognitionRef.current.stop(); return }
    if (!SR) { // no Web Speech API → simulate so the demo still shows the flow
      setRecording(true); showToast('🎤 Listening… (demo)')
      setTimeout(() => { setRecording(false); send('Mata ammata mal bouquet ekak ඕනේ') }, 1500); return
    }
    const rec = new SR()
    rec.lang = 'si-LK'           // Sinhala; en-LK words still resolve
    rec.interimResults = true
    rec.continuous = false
    let finalText = ''
    rec.onresult = (e) => {
      let interim = ''; finalText = ''
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) finalText += r[0].transcript; else interim += r[0].transcript
      }
      setInput(finalText || interim)
    }
    rec.onerror = (e) => { setRecording(false); if (e && e.error === 'not-allowed') showToast('🎤 Mic blocked — allow access to talk to Kapri') }
    rec.onend = () => { setRecording(false); const t = (finalText || '').trim(); if (t) send(t) }
    recognitionRef.current = rec
    setRecording(true); showToast('🎤 Listening… speak in Sinhala or English')
    try { rec.start() } catch (e) { setRecording(false) }
  }

  const lastKapri = msgs.map((m) => m.role).lastIndexOf('kapri')

  const renderCard = (card) => {
    if (!card) return null
    if (card.type === 'carousel') return <ProductCarousel products={card.items} cartIds={cartIds} onAdd={addToCart} onOpen={setDetailProduct} />
    if (card.type === 'bundle') { const b = BUNDLES[card.key]; const prods = b.ids.map((id) => CATALOG.find((x) => x.id === id)).filter(Boolean)
      return <BundleCard bundle={b} products={prods} cartIds={cartIds} onAdd={addToCart} onAddAll={() => addBundle(card.key)} onGiftMsg={(msg) => { setGiftMessage(msg); showToast('Gift message saved ✍️') }} /> }
    if (card.type === 'delivery') {
      const today = new Date(); const d = new Date(today); d.setDate(today.getDate() + (card.slow ? 2 : 1))
      const date = d.toLocaleDateString('en-LK', { weekday: 'short', day: 'numeric', month: 'short' })
      return <DeliveryStatus city={card.city} date={date} available rate={card.rate}
        perishableWarning={card.slow ? `${card.city} needs a 2-day lead time, but we deliver there happily! Pick a date 2+ days out at checkout.` : null} /> }
    if (card.type === 'tracker') {
      if (placedOrder && (!card.number || card.number === placedOrder.number))
        return <OrderTracker order={{ ...placedOrder, stage: 2, statusDisplay: 'Out for delivery' }} />
      return <OrderTracker order={{ ...DEMO_ORDER, number: card.number || DEMO_ORDER.number }} />
    }
    if (card.type === 'checkout') return <CheckoutCard order={card.order} paid={card.order.ref === paidRef} onPay={(o) => setPayOrder(o)} />
    return null
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--surface)' }}>
      <Header count={cartCount} onCart={() => setCartOpen(true)} lang={lang} onLang={() => setLang((l) => l === 'en' ? 'si' : 'en')} />
      <SeasonBanner season={SEASON} onShop={(q) => send('Show me ' + q)} />

      <div ref={scrollRef} className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 780, flex: '1 0 auto', display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 16px 20px' }}>
        {msgs.length === 0 ? (
          <EmptyState prompts={PROMPTS} onPrompt={send} categories={CATEGORIES} onCategory={(q) => send('Show me ' + q)} lang={lang} />
        ) : (
          <React.Fragment>
            {msgs.map((m, i) => m.role === 'user'
              ? <UserBubble key={i}>{m.text}</UserBubble>
              : (
                <KapriRow key={i}>
                  {m.text && <KapriText>{m.text}</KapriText>}
                  {renderCard(m.card)}
                  {i === lastKapri && m.chips && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 2 }}>
                      {m.chips.map((c) => <Chip key={c} onClick={() => send(c)}>{c}</Chip>)}
                    </div>
                  )}
                </KapriRow>
              ))}
            {typing && <Typing />}
            {typing && pendingKind === 'search' && (
              <div style={{ paddingLeft: 39 }}><SkeletonCarousel /></div>
            )}
          </React.Fragment>
        )}
        </div>
      </div>

      <Composer value={input} onChange={setInput} onSend={() => send()} onMic={onMic} recording={recording}
        placeholder={lang === 'en' ? 'Type in English, Sinhala, or Tanglish…' : 'සිංහලෙන්, English, හෝ Tanglish ලියන්න…'} />

      <CartDrawer open={cartOpen} items={cart} giftMessage={giftMessage} onClose={() => setCartOpen(false)}
        onQty={changeQty} onRemove={removeItem} onIcing={setIcing} onCheckout={startCheckout} lang={lastLang} />

      {checkoutOpen && <CheckoutFlow items={cart} giftMessage={giftMessage} lang={lastLang} onClose={() => setCheckoutOpen(false)} onPlaced={onPlaced} />}

      {detailProduct && <ProductDetail p={detailProduct} inCart={cartIds.includes(detailProduct.id)} onAdd={addDetail} onClose={() => setDetailProduct(null)} />}

      {payOrder && <PaymentSheet order={payOrder} onClose={() => setPayOrder(null)} onPaid={onPaid} />}

      {/* Toast */}
      <div style={{ position: 'absolute', bottom: 84, left: '50%', transform: `translateX(-50%) translateY(${toast ? 0 : 12}px)`, opacity: toast ? 1 : 0,
        pointerEvents: 'none', transition: 'all .25s var(--ease-out)', zIndex: 55, background: 'var(--ink)', color: '#fff', fontSize: 13, fontWeight: 600,
        padding: '9px 16px', borderRadius: 999, boxShadow: 'var(--shadow-lg)', whiteSpace: 'nowrap' }}>{toast}</div>
    </div>
  )
}

const DEMO_ITEMS = ['CAKE-2291', 'FLOWERS-118', 'CHOC-540'].map((id) => CATALOG.find((p) => p.id === id)).filter(Boolean)
  .map((p) => ({ img: p.img, name: p.name, qty: 1, price: p.price }))
const DEMO_ORDER = { number: 'VIMP34456CB2', statusDisplay: 'Out for delivery', stage: 2, live: true,
  orderDate: 'Thu, 12 Jun', deliveryDate: 'Sat, 14 Jun', recipient: 'Amma, Colombo 05', amount: 4850, items: DEMO_ITEMS }

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
