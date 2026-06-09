'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Header } from './ui/Header'
import { SeasonBanner } from './ui/SeasonBanner'
import { Chip } from './ui/Chip'
import { UserBubble, KapriRow, KapriText, Typing } from './ui/Bubbles'
import { Composer } from './ui/Composer'
import { EmptyState } from './EmptyState'
import { ProductCarousel } from './cards/ProductCarousel'
import { SkeletonCarousel } from './cards/SkeletonCarousel'
import { BundleCard } from './cards/BundleCard'
import { DeliveryStatus } from './cards/DeliveryStatus'
import { OrderTracker } from './cards/OrderTracker'
import { CheckoutCard } from './cards/CheckoutCard'
import { ProductDetail } from './cards/ProductDetail'
import { CartDrawer } from './overlays/CartDrawer'
import { CheckoutFlow } from './overlays/CheckoutFlow'
import { PaymentSheet } from './overlays/PaymentSheet'
import { CATALOG, BUNDLES, CATEGORIES, SEASON } from '@/lib/data'

import type { Message, CartItem, Lang, Product, OrderData, PlacedOrder, CardData } from '@/lib/types'

const DEMO_ITEMS = ['CAKE-2291', 'FLOWERS-118', 'CHOC-540']
  .map(id => CATALOG.find(p => p.id === id))
  .filter(Boolean) as Product[]

const PROMPTS = [
  { emoji: '🎁', text: 'I need a gift for my mother, under Rs. 5,000' },
  { emoji: '🎂', text: 'Birthday cake for tomorrow, Colombo delivery' },
  { emoji: '🌹', text: 'Send roses to Kandy for our anniversary' },
  { emoji: '🇱🇰', text: 'Avurudu hamper — family celebration' },
]

const DEMO_ORDER: PlacedOrder = {
  number: 'VIMP-38291',
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

export default function App() {
  const [msgs, setMsgs] = useState<Message[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [lang, setLang] = useState<Lang>('en')
  const [typing, setTyping] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [payOrder, setPayOrder] = useState<OrderData | null>(null)
  const [detail, setDetail] = useState<Product | null>(null)
  const [giftMessage, setGiftMessage] = useState('')
  const [recording, setRecording] = useState(false)
  const [input, setInput] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [paidOrders, setPaidOrders] = useState<Set<string>>(new Set())
  const [searchPending, setSearchPending] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setCart(loadCart())
    try { setLang((localStorage.getItem('kapri_lang') as Lang) || 'en') } catch {}
    try { setGiftMessage(localStorage.getItem('kapri_gift') || '') } catch {}
  }, [])

  // Persist cart
  useEffect(() => { saveCart(cart) }, [cart])
  useEffect(() => { try { localStorage.setItem('kapri_lang', lang) } catch {} }, [lang])
  useEffect(() => { try { localStorage.setItem('kapri_gift', giftMessage) } catch {} }, [giftMessage])

  // Auto-scroll on new messages
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

  const send = useCallback(async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', text }
    setMsgs(prev => [...prev, userMsg])
    setTyping(true)
    setSearchPending(true)

    try {
      const lastVimp = msgs.slice().reverse().find(m => m.card?.type === 'tracker')
      const cartCount = cart.reduce((s, i) => s + i.qty, 0)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, cartCount, lastVimp: (lastVimp?.card as { number?: string })?.number }),
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
    } catch {
      setMsgs(prev => [...prev, { role: 'kapri', text: 'Oops, something went wrong. Please try again!' }])
    } finally {
      setTyping(false)
      setSearchPending(false)
    }
  }, [msgs, cart])

  const onMic = useCallback(() => {
    if (recording) {
      recognitionRef.current?.stop()
      setRecording(false)
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    setPayOrder(order)
    // Add checkout card to chat
    const checkoutMsg: Message = { role: 'kapri', card: { type: 'checkout', order } }
    setMsgs(prev => [...prev, checkoutMsg])
  }, [])

  const onPaid = useCallback((order: OrderData) => {
    setPayOrder(null)
    setPaidOrders(prev => new Set([...prev, order.ref]))
    // Generate a tracker
    const trackerOrder: PlacedOrder = {
      number: `VIMP-${Math.floor(10000 + Math.random() * 89999)}`,
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
    }
    setMsgs(prev => {
      // Attach the PlacedOrder data alongside the tracker card so OrderTracker renders correctly
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
        const deliveryDate = card.slow ? 'In 2 days' : 'Tomorrow'
        return (
          <DeliveryStatus
            key={idx}
            city={card.city}
            date={deliveryDate}
            available={true}
            rate={card.rate}
          />
        )
      }
      case 'tracker': {
        const placedOrder = msg._placedOrder
        const order = placedOrder || DEMO_ORDER
        return <OrderTracker key={idx} order={order} />
      }
      case 'checkout':
        return (
          <CheckoutCard
            key={idx}
            order={card.order}
            paid={paidOrders.has(card.order.ref)}
            onPay={(o) => setPayOrder(o)}
          />
        )
      default:
        return null
    }
  }

  const season = SEASON

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', maxWidth: 768, margin: '0 auto',
      background: '#fff', position: 'relative', boxShadow: 'var(--shadow-xl)' }}>

      <Header
        lang={lang}
        count={cartCount}
        onLang={() => setLang(l => l === 'en' ? 'si' : 'en')}
        onCart={() => setCartOpen(true)}
      />

      {season && <SeasonBanner season={season} onShop={(q) => { send(q) }} />}

      {/* Chat scroll area */}
      <div ref={scrollRef} className="scrollbar-hide"
        style={{ flex: 1, overflowY: 'auto', padding: '12px 0 8px', display: 'flex', flexDirection: 'column' }}>

        {msgs.length === 0 ? (
          <EmptyState
            prompts={PROMPTS}
            onPrompt={send}
            categories={CATEGORIES}
            onCategory={send}
            lang={lang}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px' }}>
            {msgs.map((msg, i) => {
              const extMsg = msg as Message & { _placedOrder?: PlacedOrder }
              if (msg.role === 'user') {
                return <UserBubble key={i}>{msg.text || ''}</UserBubble>
              }
              return (
                <KapriRow key={i}>
                  {msg.text && <KapriText>{msg.text}</KapriText>}
                  {msg.card && renderCard(msg.card, extMsg, i)}
                  {msg.chips && msg.chips.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      {msg.chips.map((c, ci) => (
                        <Chip key={ci} onClick={() => send(c)}>{c}</Chip>
                      ))}
                    </div>
                  )}
                </KapriRow>
              )
            })}

            {typing && (
              <KapriRow>
                {searchPending ? <SkeletonCarousel /> : <Typing />}
              </KapriRow>
            )}
          </div>
        )}
      </div>

      <Composer
        lang={lang}
        recording={recording}
        value={input}
        onChange={setInput}
        onSend={() => { if (input.trim()) { send(input); setInput('') } }}
        onMic={onMic}
      />

      {/* Overlays */}
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

      {detail && (
        <ProductDetail
          p={detail}
          inCart={cart.some(i => i.p.id === detail.id)}
          onClose={() => setDetail(null)}
          onAdd={(p, qty, icing) => { addToCart(p, qty, icing); setDetail(null) }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--purple-700)', color: '#fff', padding: '10px 18px', borderRadius: 'var(--radius-md)',
          fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', zIndex: 200,
          animation: 'kapri-up .25s var(--ease-out)', boxShadow: 'var(--shadow-lg)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
