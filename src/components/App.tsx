'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { Header } from './ui/Header'
import { SeasonBanner } from './ui/SeasonBanner'
import { Chip } from './ui/Chip'
import { UserBubble, KapriRow, KapriText, Typing } from './ui/Bubbles'
import { Composer } from './ui/Composer'
import { EmptyState } from './EmptyState'
import { ProductCarousel } from './cards/ProductCarousel'
import { SkeletonCarousel } from './cards/SkeletonCarousel'
import { BundleCard } from './cards/BundleCard'
import { ComparisonCard } from './cards/ComparisonCard'
import { DeliveryStatus } from './cards/DeliveryStatus'
import { OrderTracker } from './cards/OrderTracker'
import { CheckoutCard } from './cards/CheckoutCard'
import { ProductDetail } from './cards/ProductDetail'
import { CartDrawer } from './overlays/CartDrawer'
import { FavoritesDrawer } from './overlays/FavoritesDrawer'
import { CheckoutFlow } from './overlays/CheckoutFlow'
import { PaymentSheet } from './overlays/PaymentSheet'
import { PaymentFrame } from './overlays/PaymentFrame'
import { OnboardingOverlay } from './overlays/OnboardingOverlay'
import { CATALOG, BUNDLES, CATEGORIES, OCCASIONS, SEASON } from '@/lib/data'

import type { Message, CartItem, Lang, Product, OrderData, PlacedOrder, CardData, Category } from '@/lib/types'

const DEMO_ITEMS = ['CAKE-2291', 'FLOWERS-118', 'CHOC-540']
  .map(id => CATALOG.find(p => p.id === id))
  .filter(Boolean) as Product[]

const PROMPTS = [
  { icon: 'gift', text: 'I need a gift for my mother, under Rs. 5,000' },
  { icon: 'cake', text: 'Birthday cake for tomorrow, Colombo delivery' },
  { icon: 'headphones', text: 'I need good wireless earbuds for myself' },
  { icon: 'cart', text: 'Weekly grocery essentials — deliver to Nugegoda' },
]

const DEMO_ORDER: PlacedOrder = {
  number: 'VIMP38291',
  statusDisplay: 'Out for Delivery · Est. 4 pm',
  stage: 2,
  live: true,
  orderDate: 'Today, 9:14 am',
  deliveryDate: 'Today, by 6 pm',
  recipient: 'Nimal Perera',
  amount: 14600,
  items: DEMO_ITEMS.map(p => ({ img: p.img, name: p.name, qty: 1, price: p.price })),
}

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem('kapri_cart') || '[]') } catch { return [] }
}

function saveCart(cart: CartItem[]) {
  try { localStorage.setItem('kapri_cart', JSON.stringify(cart)) } catch {}
}

let audioCtx: AudioContext | null = null
const playClick = () => {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05)
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.05)
  } catch(e) {}
}

export default function App() {
  const [msgs, setMsgs] = useState<Message[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [lang, setLang] = useState<Lang>('en')
  const [sessionOrders, setSessionOrders] = useState<PlacedOrder[]>([])
  const [view, setView] = useState<'home' | 'chat'>('home')
  const [typing, setTyping] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false)
  const [payOrder, setPayOrder] = useState<OrderData | null>(null)
  const [frameOrder, setFrameOrder] = useState<OrderData | null>(null)
  const [detail, setDetail] = useState<Product | null>(null)
  const [giftMessage, setGiftMessage] = useState('')
  const [recording, setRecording] = useState(false)
  const [input, setInput] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [paidOrders, setPaidOrders] = useState<Set<string>>(new Set())
  const [searchPending, setSearchPending] = useState(false)
  const [categories, setCategories] = useState<Category[]>(CATEGORIES)
  const [occasions, setOccasions] = useState<Category[]>(OCCASIONS)
  const [imageInput, setImageInput] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Product[]>([])
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [typingTopic, setTypingTopic] = useState<'cake'|'flowers'|null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setCart(loadCart())
    try { setLang((localStorage.getItem('kapri_lang') as Lang) || 'en') } catch {}
    try { setGiftMessage(localStorage.getItem('kapri_gift') || '') } catch {}
    try { setSessionOrders(JSON.parse(localStorage.getItem('kapri_orders') || '[]')) } catch {}
    try { 
      const savedMsgs = JSON.parse(localStorage.getItem('kapri_chat') || '[]')
      setMsgs(savedMsgs)
      if (savedMsgs.length > 0) setView('chat')
    } catch {}
    try { setFavorites(JSON.parse(localStorage.getItem('kapri_favs') || '[]')) } catch {}
    
    // Onboarding check
    if (!localStorage.getItem('kapri_onboarded')) {
      setShowOnboarding(true)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/categories')
      .then(r => r.json())
      .then((d: { ok?: boolean; categories?: Category[]; occasions?: Category[] }) => {
        if (!cancelled && d?.ok) {
          if (Array.isArray(d.categories) && d.categories.length) setCategories(d.categories)
          if (Array.isArray(d.occasions) && d.occasions.length) setOccasions(d.occasions)
        }
      })
      .catch(() => { })
    return () => { cancelled = true }
  }, [])

  useEffect(() => { saveCart(cart) }, [cart])
  useEffect(() => { try { localStorage.setItem('kapri_lang', lang) } catch {} }, [lang])
  useEffect(() => { try { localStorage.setItem('kapri_gift', giftMessage) } catch {} }, [giftMessage])
  useEffect(() => { try { localStorage.setItem('kapri_orders', JSON.stringify(sessionOrders)) } catch {} }, [sessionOrders])
  useEffect(() => { try { localStorage.setItem('kapri_chat', JSON.stringify(msgs)) } catch {} }, [msgs])
  useEffect(() => { try { localStorage.setItem('kapri_favs', JSON.stringify(favorites)) } catch {} }, [favorites])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [msgs, typing])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2800)
  }, [])

  const toggleFavorite = useCallback((p: Product) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === p.id)) {
        return prev.filter(f => f.id !== p.id)
      }
      showToast(`${p.name.split('—')[0].trim()} saved to favorites ❤️`)
      return [...prev, p]
    })
  }, [showToast])

  const addToCart = useCallback((p: Product, qty = 1, icing = '') => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.p.id === p.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + qty }
        return next
      }
      return [...prev, { p, qty, icing }]
    })
    
    // Confetti burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.9 },
      colors: ['#442A73', '#7452B2', '#F9DB09', '#FBE840']
    })
    
    showToast(`${p.name.split('—')[0].trim()} added to cart 🛍️`)
  }, [showToast])

  const changeQty = useCallback((id: string, delta: number) => {
    setCart(prev => {
      const next = prev.map(i => i.p.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
      return next
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.p.id !== id))
  }, [])

  const setIcing = useCallback((id: string, v: string) => {
    setCart(prev => prev.map(i => i.p.id === id ? { ...i, icing: v } : i))
  }, [])

  // Strip card/carousel JSON from Kapri's past replies to save API tokens.
  // The AI doesn't need to re-read its own product cards — just the conversational text.
  const stripCardJson = (raw: string): string => {
    if (!raw) return ''
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed.text === 'string') return parsed.text
    } catch { /* not JSON, return as-is */ }
    return raw
  }

  const send = useCallback(async (text: string) => {
    if (!text.trim() && !imageInput) return
    const userMsg: Message = { role: 'user', text, image: imageInput || undefined }
    setMsgs(prev => [...prev, userMsg])
    const lowerText = text.toLowerCase()
    if (lowerText.includes('cake') || lowerText.includes('cakes')) setTypingTopic('cake')
    else if (lowerText.includes('flower') || lowerText.includes('flowers') || lowerText.includes('rose')) setTypingTopic('flowers')
    else setTypingTopic(null)
    setTyping(true)
    setSearchPending(true)
    setImageInput(null)
    setView('chat')

    try {
      const history = [...msgs, userMsg].map(m => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        text: m.role === 'kapri' ? stripCardJson(m.text || '') : (m.text || ''),
        image: m.role === 'user' ? m.image : undefined
      })).filter(m => m.text.trim() || m.image)

      const lastOrder = sessionOrders.length > 0 ? sessionOrders[sessionOrders.length - 1] : null;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, cart, lastVimp: lastOrder?.number, favorites, lang }),
      })
      const data: { lang?: Lang; text?: string; card?: CardData; chips?: string[]; action?: string } = await res.json()
      if (data.lang) setLang(data.lang)

      const kapriMsg: Message = {
        role: 'kapri',
        text: data.text,
        card: data.card,
        chips: data.chips,
        lang: data.lang,
        action: data.action,
      }
      setMsgs(prev => [...prev, kapriMsg])
      playClick()

      if (data.action === 'checkout') {
        if (cart.length > 0) {
          setCartOpen(true)
        } else {
          showToast('Please add at least one item to checkout 🛍️')
        }
      }
    } catch {
      setMsgs(prev => [...prev, { role: 'kapri', text: 'Oops, something went wrong. Please try again!' }])
    } finally {
      setTyping(false)
      setSearchPending(false)
      setTypingTopic(null)
    }
  }, [msgs, cart, imageInput, sessionOrders, showToast, favorites])

  const onMic = useCallback(() => {
    if (recording) {
      recognitionRef.current?.stop()
      setRecording(false)
      return
    }
    const w = window as any
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SR) { showToast('Voice input not supported in this browser'); return }
    const rec = new SR()
    rec.lang = lang === 'si' ? 'si-LK' : 'en-US'
    rec.interimResults = false
    rec.onresult = (e: { results: { [0]: { [0]: { transcript: string } } } }) => {
      const transcript = e.results[0][0].transcript
      if (transcript) { setInput(''); send(transcript) }
    }
    rec.onerror = () => { setRecording(false) }
    rec.onend = () => { setRecording(false) }
    rec.start()
    recognitionRef.current = rec
    setRecording(true)
  }, [recording, lang, send, showToast])

  const onPlaced = useCallback((order: OrderData) => {
    setCheckoutOpen(false)
    setCart([])
    if (!order.url) setPayOrder(order)
    const checkoutMsg: Message = { role: 'kapri', card: { type: 'checkout', order } }
    setMsgs(prev => [...prev, checkoutMsg])
  }, [])

  const onPaid = useCallback((order: OrderData) => {
    setPayOrder(null)
    setPaidOrders(prev => new Set([...prev, order.ref]))
    const trackerOrder: PlacedOrder = {
      number: `VIMP${Math.floor(10000 + Math.random() * 89999)}`,
      statusDisplay: 'Order Confirmed · Processing',
      stage: 1,
      live: false,
      orderDate: new Date().toLocaleString('en-LK', { hour: '2-digit', minute: '2-digit', hour12: true }),
      deliveryDate: order.date?.label || 'Tomorrow',
      recipient: order.recipient,
      amount: order.total,
      items: order.items.map(i => ({ img: i.p.img, name: i.p.name, qty: i.qty, price: i.p.price, icing: i.icing || undefined })),
    }
    const trackerMsg: Message = {
      role: 'kapri',
      text: `🎉 Payment received! Here's your live tracking for this order.`,
      card: { type: 'tracker', number: trackerOrder.number },
      chips: ['Buy more gifts', 'Shop for another occasion', 'View all categories']
    }
    
    setSessionOrders(prev => [...prev, trackerOrder])
    
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackerOrder),
    }).catch(console.error)

    setMsgs(prev => {
      return [...prev, { ...trackerMsg, _placedOrder: trackerOrder } as Message & { _placedOrder: PlacedOrder }]
    })
    showToast('Order placed! 🎁 Tracking number on its way to your inbox.')
  }, [showToast])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  function renderCard(card: CardData, msg: Message & { _placedOrder?: PlacedOrder }, idx: number) {
    const cartIds = cart.map(i => i.p.id)
    switch (card.type) {
      case 'carousel':
        return (
          <ProductCarousel
            key={idx}
            products={card.items}
            cartIds={cartIds}
            onAdd={(p) => addToCart(p)}
            onOpen={setDetail}
            favorites={favorites.map(f => f.id)}
            onToggleFavorite={toggleFavorite}
          />
        )
      case 'comparison':
        return (
          <ComparisonCard
            key={idx}
            products={card.items}
            cartIds={cartIds}
            onAdd={(p) => addToCart(p)}
            onOpen={setDetail}
            favorites={favorites.map(f => f.id)}
            onToggleFavorite={toggleFavorite}
          />
        )
      case 'bundle': {
        const bundle = BUNDLES[card.key]
        if (!bundle) return null
        const bundleProducts = bundle.ids.map(id => CATALOG.find(p => p.id === id)).filter(Boolean) as Product[]
        return (
          <BundleCard
            key={idx}
            bundle={bundle}
            products={bundleProducts}
            cartIds={cartIds}
            onAdd={(p) => addToCart(p)}
            onAddAll={() => bundleProducts.forEach(p => addToCart(p))}
            onGiftMsg={setGiftMessage}
          />
        )
      }
      case 'delivery': {
        const dc = card as CardData & { available?: boolean; date?: string; reason?: string | null; nextDate?: string | null; perishableWarning?: string | null }
        return (
          <DeliveryStatus
            key={idx}
            city={card.city}
            date={dc.date ?? (card.slow ? 'In 2 days' : 'Tomorrow')}
            available={dc.available ?? true}
            rate={card.rate}
            reason={dc.reason}
            nextDate={dc.nextDate}
            perishableWarning={dc.perishableWarning}
          />
        )
      }
      case 'tracker': {
        const trackerCard = card as Extract<CardData, { type: 'tracker' }>
        const placedOrder = msg._placedOrder || sessionOrders.find(o => o.number === trackerCard.number)
        let order = placedOrder || DEMO_ORDER
        if (!placedOrder && trackerCard.number) {
          order = {
            ...order,
            number: trackerCard.number,
            statusDisplay: trackerCard.statusDisplay ?? order.statusDisplay,
            stage: trackerCard.stage ?? order.stage,
            live: trackerCard.live ?? order.live,
            orderDate: trackerCard.orderDate ?? order.orderDate,
            deliveryDate: trackerCard.deliveryDate ?? order.deliveryDate,
            recipient: trackerCard.recipient ?? order.recipient,
            amount: trackerCard.amount ?? order.amount,
            items: trackerCard.items && trackerCard.items.length ? trackerCard.items : order.items,
          }
        }
        return <OrderTracker key={idx} order={order} />
      }
      case 'checkout':
        return (
          <CheckoutCard
            key={idx}
            order={card.order}
            paid={paidOrders.has(card.order.ref)}
            onPay={(o) => o.url ? setFrameOrder(o) : setPayOrder(o)}
          />
        )
      default:
        return null
    }
  }

  const season = SEASON

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', width: '100%',
      background: '#fff', position: 'relative' }}>

      <Header
        lang={lang}
        count={cartCount}
        favoritesCount={favorites.length}
        onLang={() => setLang(l => l === 'en' ? 'si' : 'en')}
        onCart={() => setCartOpen(true)}
        onFavorites={() => setFavoritesOpen(true)}
        onLogoClick={() => {
          if (msgs.length > 0 && view === 'chat') setExitConfirmOpen(true)
          else window.location.href = 'https://www.kapruka.com/'
        }}
        onBack={view === 'chat' && msgs.length > 0 ? () => setView('home') : undefined}
      />

      {season && <SeasonBanner season={season} onShop={(q) => { send(q) }} />}

      <div ref={scrollRef} className="scrollbar-hide"
        style={{ flex: 1, overflowY: 'auto', padding: '12px 0 8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {view === 'home' ? (
          <EmptyState
            prompts={PROMPTS}
            onPrompt={send}
            categories={categories}
            occasions={occasions}
            onCategory={send}
            lang={lang}
            hasChat={msgs.length > 0}
            onResumeChat={() => setView('chat')}
            onClearChat={() => { setMsgs([]); setView('home'); localStorage.removeItem('kapri_chat') }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px', width: '100%', maxWidth: 840 }}>
            {msgs.map((msg, i) => {
              const extMsg = msg as Message & { _placedOrder?: PlacedOrder }
              if (msg.role === 'user') {
                return <UserBubble key={i} image={msg.image}>{msg.text || ''}</UserBubble>
              }
              return (
                <KapriRow key={i}>
                  {msg.text && <KapriText>{msg.text}</KapriText>}
                  {msg.card && renderCard(msg.card, extMsg, i)}
                  {msg.chips && msg.chips.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      <Chip onClick={() => setMsgs([])}>‹ Back</Chip>
                      {msg.chips.map((c, ci) => (
                        <Chip key={ci} onClick={() => send(c)}>{c}</Chip>
                      ))}
                    </div>
                  )}
                </KapriRow>
              )
            })}

            {typing && (
              <>
                <Typing topic={typingTopic} />
                {searchPending && (
                  <KapriRow>
                    <SkeletonCarousel />
                  </KapriRow>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <Composer
        lang={lang}
        recording={recording}
        value={input}
        onChange={setInput}
        onSend={() => { if (input.trim() || imageInput) { send(input); setInput('') } }}
        onMic={onMic}
        image={imageInput}
        onImage={setImageInput}
      />

      <FavoritesDrawer
        open={favoritesOpen}
        favorites={favorites}
        onClose={() => setFavoritesOpen(false)}
        onRemove={toggleFavorite}
        onAddToCart={(p) => { addToCart(p); setFavoritesOpen(false); }}
        lang={lang}
      />
      <CartDrawer
        open={cartOpen}
        items={cart}
        giftMessage={giftMessage}
        onClose={() => setCartOpen(false)}
        onQty={changeQty}
        onRemove={removeItem}
        onIcing={setIcing}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }}
        lang={lang}
      />

      {checkoutOpen && (
        <CheckoutFlow
          items={cart}
          giftMessage={giftMessage}
          onClose={() => setCheckoutOpen(false)}
          onPlaced={onPlaced}
          lang={lang}
        />
      )}

      {payOrder && (
        <PaymentSheet
          order={payOrder}
          onClose={() => setPayOrder(null)}
          onPaid={onPaid}
        />
      )}

      {exitConfirmOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:999,
          display:'flex', alignItems:'center', justifyContent:'center', padding:20, backdropFilter:'blur(4px)' }}>
          <div style={{ background:'#fff', padding:'24px 28px', borderRadius:'var(--radius-xl)', maxWidth:360, width:'100%',
            boxShadow:'var(--shadow-xl)', animation:'kapri-pop .3s var(--ease-spring)', textAlign:'center' }}>
            <h3 className="sinhala-text" style={{ margin:'0 0 12px', color:'var(--purple-700)', fontSize:20, fontWeight:700 }}>Exit Chat?</h3>
            <p className="sinhala-text" style={{ margin:'0 0 24px', fontSize:14.5, color:'var(--muted)', lineHeight:1.5 }}>
              Are you sure you want to leave Kapri and return to the main Kapruka homepage? Your current chat will be cleared.
            </p>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={() => setExitConfirmOpen(false)}
                style={{ flex:1, padding:'12px 0', background:'var(--line)', color:'var(--ink)',
                  border:'none', borderRadius:999, fontWeight:600, fontSize:14, cursor:'pointer' }}>
                Cancel
              </button>
              <button onClick={() => window.location.href='https://www.kapruka.com/'}
                style={{ flex:1, padding:'12px 0', background:'var(--error)', color:'#fff',
                  border:'none', borderRadius:999, fontWeight:600, fontSize:14, cursor:'pointer', boxShadow:'var(--shadow-sm)' }}>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {frameOrder && (
        <PaymentFrame
          order={frameOrder}
          onClose={() => setFrameOrder(null)}
        />
      )}

      {detail && (
        <ProductDetail
          p={detail}
          inCart={cart.some(i => i.p.id === detail.id)}
          onClose={() => setDetail(null)}
          onAdd={(p, qty, icing) => { addToCart(p, qty, icing); setDetail(null) }}
          isFavorite={favorites.some(f => f.id === detail.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--purple-700)', color: '#fff', padding: '10px 18px', borderRadius: 'var(--radius-md)',
          fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', zIndex: 200,
          animation: 'kapri-up .25s var(--ease-out)', boxShadow: 'var(--shadow-lg)' }}>
          {toast}
        </div>
      )}

      {showOnboarding && (
        <OnboardingOverlay
          onFinish={() => {
            setShowOnboarding(false)
            localStorage.setItem('kapri_onboarded', '1')
          }}
        />
      )}
    </div>
  )
}
