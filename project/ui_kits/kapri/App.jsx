/* Kapri UI kit — interactive App. Scripted fake conversation engine that
   demonstrates: empty state → search → add to cart → checkout → track. */

const CATALOG = {
  cakes: [
    { id: 'CAKE-2291', name: 'Belgian Chocolate Fudge Cake — 1kg', summary: 'Rich layered ganache, made fresh to order.', price: 4500, compareAtPrice: 5200, category: 'Cakes', inStock: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop' },
    { id: 'CAKE-1180', name: 'Ribbon Butter Cake — 1kg', summary: 'A Sri Lankan classic, soft and buttery.', price: 3200, category: 'Cakes', inStock: true, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop' },
    { id: 'CAKE-3340', name: 'Fresh Strawberry Gateau — 1kg', summary: 'Whipped cream & seasonal strawberries.', price: 5400, category: 'Cakes', inStock: true, image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop' },
    { id: 'CAKE-7782', name: 'Red Velvet Cream Cheese Cake', summary: 'Velvety crumb, tangy frosting.', price: 4900, category: 'Cakes', inStock: true, image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=400&fit=crop' },
  ],
  gifts: [
    { id: 'GIFT-2201', name: 'Pamper Hamper for Mum', summary: 'Chocolates, tea & a scented candle.', price: 4800, category: 'Giftset', inStock: true, image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop' },
    { id: 'CHOC-540', name: 'Lindt Lindor Assorted Box', summary: 'Smooth-melting Swiss truffles.', price: 3200, compareAtPrice: 3800, category: 'Chocolates', inStock: true, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop' },
    { id: 'PERF-091', name: 'Floral Eau de Parfum — 50ml', summary: 'Jasmine & sandalwood notes.', price: 7900, category: 'Perfumes', inStock: true, lowStock: true, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop' },
    { id: 'FLOWERS-118', name: 'Red Rose Bouquet — Dozen', summary: 'A dozen long-stem roses, hand-tied.', price: 6900, category: 'Flowers', inStock: true, image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop' },
  ],
  flowers: [
    { id: 'FLOWERS-118', name: 'Red Rose Bouquet — Dozen', summary: 'A dozen long-stem roses, hand-tied.', price: 6900, category: 'Flowers', inStock: true, image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop' },
    { id: 'FLOWERS-204', name: 'Mixed Gerbera Basket', summary: 'Bright daisies in a woven basket.', price: 5200, category: 'Flowers', inStock: true, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop' },
    { id: 'FLOWERS-330', name: 'White Lily Arrangement', summary: 'Elegant lilies for any occasion.', price: 6100, category: 'Flowers', inStock: true, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=400&fit=crop' },
  ],
}

const PROMPTS = [
  { emoji: '🎁', text: 'I need a gift for my mother, under Rs. 5,000' },
  { emoji: '🎂', text: 'Mata ammata cake ekak gannako — Colombo ekata' },
  { emoji: '🇱🇰', text: 'Avurudu hamper bundle ekak hadanna under Rs. 8,000' },
  { emoji: '🛍️', text: 'අම්මට තෑග්ගක් — රු. 5000ට අඩුවෙන්' },
]

function reply(text) {
  const t = text.toLowerCase()
  if (t.includes('track') || t.includes('vimp')) {
    return { text: "Mama balannam! 📦 Mehe oyage order eke latest status eka:", card: { type: 'tracker' } }
  }
  if (t.includes('checkout') || t.includes('check out') || t.includes('pay') || t.includes('order')) {
    return { text: "Suba! Colombo ekata delivery eka confirm karannam — eth ekka order eka ready! 🎉", card: { type: 'checkout' } }
  }
  if (t.includes('cake')) return { text: "Mata amma ta lassana cake tikak hoyaa-gaththa! Balanna 🎂", card: { type: 'carousel', items: CATALOG.cakes } }
  if (t.includes('flower') || t.includes('rose') || t.includes('මල්')) return { text: "Here are some beautiful fresh flowers for you 🌹", card: { type: 'carousel', items: CATALOG.flowers } }
  return { text: "Mehe mama hithapu hondha gift ideas tikak — amma ta perfect! 🎁", card: { type: 'carousel', items: CATALOG.gifts } }
}

function CartDrawer({ open, items, onClose, onQty, onRemove, onCheckout }) {
  const total = items.reduce((s, i) => s + i.p.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)
  return (
    <React.Fragment>
      {open && <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(2px)', zIndex: 40 }} />}
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 360, background: '#fff',
        zIndex: 50, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xl)',
        transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .4s var(--ease-out)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px',
          background: 'var(--purple-700)', color: '#fff' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 18 }}>
            <Ico name="shopping-bag" size={20} /> Your Cart{count > 0 && ` (${count})`}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 6 }}><Ico name="x" size={20} /></button>
        </div>
        <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--muted)' }}>
              <Ico name="shopping-bag" size={56} color="var(--purple-200)" />
              <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>Your cart is empty</p>
              <p style={{ margin: 0, fontSize: 12, textAlign: 'center', maxWidth: 180 }}>Ask Kapri to find something special for you! 🎁</p>
            </div>
          ) : items.map((it) => (
            <div key={it.p.id} style={{ display: 'flex', gap: 12, background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 12, boxShadow: 'var(--shadow-sm)' }}>
              <img src={it.p.image} alt={it.p.name} style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.35,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.p.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 700, color: 'var(--purple-700)' }}>{LKR(it.p.price)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <button onClick={() => onQty(it.p.id, -1)} style={qtyBtn}><Ico name="minus" size={12} /></button>
                  <span style={{ fontSize: 14, fontWeight: 600, width: 18, textAlign: 'center' }}>{it.qty}</span>
                  <button onClick={() => onQty(it.p.id, 1)} style={qtyBtn}><Ico name="plus" size={12} /></button>
                  <button onClick={() => onRemove(it.p.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 2 }}><Ico name="trash-2" size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ padding: 16, borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)', fontSize: 14 }}>Subtotal</span>
              <span style={{ fontWeight: 700, color: 'var(--purple-700)', fontSize: 18 }}>{LKR(total)}</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>Flat delivery fee per order — calculated at checkout</p>
            <button onClick={onCheckout} style={{ width: '100%', padding: '13px', borderRadius: 'var(--radius-md)', border: 'none',
              background: 'var(--purple-700)', color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Checkout with Kapri 🛍️</button>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
const qtyBtn = { width: 24, height: 24, borderRadius: 8, background: '#fff', border: '1px solid var(--line)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink)' }

function App() {
  const [msgs, setMsgs] = React.useState([])
  const [input, setInput] = React.useState('')
  const [cart, setCart] = React.useState([])
  const [cartOpen, setCartOpen] = React.useState(false)
  const [lang, setLang] = React.useState('en')
  const [thinking, setThinking] = React.useState(false)
  const scrollRef = React.useRef(null)

  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, [msgs, thinking])

  const count = cart.reduce((s, i) => s + i.qty, 0)

  const send = (text) => {
    const t = (text ?? input).trim()
    if (!t) return
    setInput('')
    setMsgs((m) => [...m, { role: 'user', text: t }])
    setThinking(true)
    setTimeout(() => {
      setThinking(false)
      setMsgs((m) => [...m, { role: 'kapri', ...reply(t) }])
    }, 850)
  }

  const addToCart = (p) => setCart((c) => {
    const ex = c.find((i) => i.p.id === p.id)
    return ex ? c.map((i) => i.p.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { p, qty: 1 }]
  })
  const changeQty = (id, d) => setCart((c) => c.map((i) => i.p.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))
  const removeItem = (id) => setCart((c) => c.filter((i) => i.p.id !== id))

  const checkout = () => { setCartOpen(false); send("I'd like to checkout the items in my cart.") }

  const order = {
    ref: 'ORD-8842-KP', total: cart.reduce((s, i) => s + i.p.price * i.qty, 0) + 350 || 4850,
    expires: 3540,
    lines: [
      { label: 'Items', amount: cart.reduce((s, i) => s + i.p.price * i.qty, 0) || 4500 },
      { label: 'Delivery (flat per order)', amount: 350 },
    ],
  }
  const trackOrder = {
    number: 'VIMP34456CB2', statusDisplay: 'Out for delivery', stage: 2, live: true, proof: true,
    orderDate: 'Thu, 12 Jun 2026', deliveryDate: 'Sat, 14 Jun 2026', recipient: 'Amma, Colombo 05', amount: 4850,
  }

  const lastKapri = msgs.map((m) => m.role).lastIndexOf('kapri')

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--surface)' }}>
      <Header cartCount={count} onCart={() => setCartOpen(true)} lang={lang} onLang={() => setLang((l) => l === 'en' ? 'si' : 'en')} />
      <div ref={scrollRef} className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {msgs.length === 0 ? (
          <EmptyState prompts={PROMPTS} onPrompt={send} />
        ) : (
          <React.Fragment>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {m.role === 'user'
                  ? <Bubble role="user">{m.text}</Bubble>
                  : (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ width: 28, height: 28, flexShrink: 0, marginTop: 2, borderRadius: 999, background: 'var(--purple-700)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, boxShadow: 'var(--shadow-sm)' }}>🛍️</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minWidth: 0 }}>
                        <div style={{ alignSelf: 'flex-start', maxWidth: '90%' }}>
                          <div className="sinhala-text" style={{ padding: '10px 16px', background: 'var(--purple-100)', color: 'var(--ink)',
                            borderRadius: 'var(--radius-lg)', borderTopLeftRadius: 'var(--radius-sm)', fontSize: 14, boxShadow: 'var(--shadow-sm)' }}>{m.text}</div>
                        </div>
                        {m.card?.type === 'carousel' && <ProductCarousel products={m.card.items} onAdd={addToCart} />}
                        {m.card?.type === 'checkout' && <React.Fragment>
                          <DeliveryStatus d={{ city: 'Colombo', date: 'Sat, 14 Jun 2026', available: true, rate: 350,
                            perishableWarning: 'Cakes are made fresh — please make sure someone can receive it on the day.' }} />
                          <CheckoutCard order={order} />
                        </React.Fragment>}
                        {m.card?.type === 'tracker' && <OrderTracker order={trackOrder} />}
                        {i === lastKapri && <QuickReplies items={['Show more', 'Under Rs. 3,000', 'Track my order']} onPick={send} />}
                      </div>
                    </div>
                  )}
              </div>
            ))}
            {thinking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fff',
                  borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map((i) => <span key={i} style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--purple-700)',
                      animation: `kapruka-breathe 1s ease-in-out ${i * 0.2}s infinite` }} />)}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--muted)' }}>Kapri is thinking...</span>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
      <Composer value={input} onChange={setInput} onSend={() => send()} lang={lang} />
      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onQty={changeQty} onRemove={removeItem} onCheckout={checkout} />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
