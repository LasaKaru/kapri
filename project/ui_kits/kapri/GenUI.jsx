/* Kapri UI kit — generative-UI cards: ProductCard, ProductCarousel,
   DeliveryStatus, CheckoutCard, OrderTracker, EmptyState. */

function Pill({ tone, children }) {
  const tones = {
    purple: { background: 'rgba(68,42,115,0.82)', color: '#fff', backdropFilter: 'blur(4px)' },
    accent: { background: 'var(--yellow-400)', color: 'var(--purple-700)', fontWeight: 700 },
    success: { background: 'rgba(31,157,87,0.92)', color: '#fff' },
    warn: { background: 'rgba(217,138,0,0.92)', color: '#fff' },
    ink: { background: 'rgba(27,18,48,0.72)', color: '#fff', backdropFilter: 'blur(4px)' },
  }
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600,
    lineHeight: 1, padding: '4px 8px', borderRadius: 999, whiteSpace: 'nowrap', ...tones[tone] }}>{children}</span>
}

function ProductCard({ p, onAdd }) {
  const [hover, setHover] = React.useState(false)
  const [added, setAdded] = React.useState(false)
  const hasDisc = p.compareAtPrice && p.compareAtPrice > p.price
  const pct = hasDisc ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0
  const add = () => { if (!p.inStock) return; setAdded(true); onAdd(p); setTimeout(() => setAdded(false), 1800) }
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#fff',
        border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        boxShadow: hover ? '0 12px 28px rgba(68,42,115,.20)' : 'var(--shadow-card)',
        transform: hover ? 'translateY(-3px)' : 'none', transition: 'all .25s var(--ease-out)' }}>
      <div style={{ position: 'relative', height: 196, background: 'var(--purple-50)', overflow: 'hidden' }}>
        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover',
          transform: hover ? 'scale(1.05)' : 'none', transition: 'transform .4s var(--ease-out)' }} />
        {p.category && <span style={{ position: 'absolute', top: 8, left: 8 }}><Pill tone="purple">{p.category}</Pill></span>}
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {!p.inStock && <Pill tone="ink">Out of Stock</Pill>}
          {p.inStock && p.lowStock && <Pill tone="warn">Low Stock</Pill>}
          {hasDisc && <Pill tone="success">-{pct}%</Pill>}
        </div>
      </div>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, lineHeight: 1.35, color: 'var(--ink)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</p>
        {p.summary && <p style={{ margin: 0, fontSize: 11, lineHeight: 1.5, color: 'var(--muted)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.summary}</p>}
        <span style={{ alignSelf: 'flex-start', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)',
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, padding: '2px 6px' }}>{p.id}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--purple-700)' }}>{LKR(p.price)}</span>
          {hasDisc && <span style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'line-through' }}>{LKR(p.compareAtPrice)}</span>}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 4 }}>
          <button onClick={add} disabled={!p.inStock} style={{ flex: 1, display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', gap: 6, padding: '8px 0', borderRadius: 'var(--radius-md)', border: 'none',
            fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: p.inStock ? 'pointer' : 'not-allowed',
            color: p.inStock ? '#fff' : 'var(--muted)', background: added ? 'var(--success)' : p.inStock ? 'var(--purple-700)' : 'var(--line)',
            transition: 'background .15s' }}>
            <Ico name={added ? 'check' : 'shopping-cart'} size={14} />{added ? 'Added!' : 'Add to Cart'}
          </button>
          <span style={{ width: 34, height: 34, flexShrink: 0, display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'var(--surface)',
            border: '1px solid var(--line)', color: 'var(--muted)', cursor: 'pointer' }}><Ico name="external-link" size={14} /></span>
        </div>
      </div>
    </div>
  )
}

function ProductCarousel({ products, onAdd }) {
  const [sort, setSort] = React.useState('rel')
  const sorted = [...products].sort((a, b) =>
    sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : 0)
  const pills = [['rel', 'Relevance'], ['asc', 'Price ↑'], ['desc', 'Price ↓']]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {pills.map(([id, l]) => (
          <button key={id} onClick={() => setSort(id)} style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px',
            borderRadius: 999, cursor: 'pointer', border: '1px solid',
            ...(sort === id ? { background: 'var(--purple-700)', color: '#fff', borderColor: 'var(--purple-700)' }
              : { background: 'var(--purple-100)', color: 'var(--purple-700)', borderColor: 'var(--purple-200)' }) }}>{l}</button>
        ))}
      </div>
      <div className="scrollbar-hide" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {sorted.map((p) => <ProductCard key={p.id} p={p} onAdd={onAdd} />)}
      </div>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>{products.length} results · Scroll to see more</p>
    </div>
  )
}

function DeliveryStatus({ d }) {
  return (
    <div style={{ width: '100%', maxWidth: 360, background: '#fff', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      border: `2px solid ${d.available ? 'var(--success)' : 'var(--error)'}`, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        background: d.available ? 'var(--success-tint)' : 'var(--error-tint)' }}>
        <Ico name={d.available ? 'check-circle' : 'x'} size={20} color={d.available ? 'var(--success)' : 'var(--error)'} />
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: d.available ? 'var(--success)' : 'var(--error)' }}>
            {d.available ? 'Delivery Available!' : '❌ Not Available'}</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Ico name="calendar" size={12} /> {d.city} · {d.date}</p>
        </div>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {d.available && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}>
              <Ico name="truck" size={16} color="var(--purple-700)" /> Delivery fee (flat per order)</span>
            <span style={{ fontWeight: 700, color: 'var(--purple-700)' }}>{LKR(d.rate)}</span>
          </div>
        )}
        {d.perishableWarning && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px',
            borderRadius: 'var(--radius-md)', background: 'var(--warn-tint)', border: '1px solid var(--yellow-200)' }}>
            <Ico name="alert-triangle" size={16} color="var(--warn)" style={{ marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: '#92400E' }}>{d.perishableWarning}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function CheckoutCard({ order }) {
  const [secs, setSecs] = React.useState(order.expires || 3600)
  React.useEffect(() => { const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t) }, [])
  const mm = String(Math.floor(secs / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0')
  return (
    <div style={{ width: '100%', maxWidth: 360, background: '#fff', borderRadius: 'var(--radius-lg)',
      border: '2px solid var(--purple-700)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ background: 'var(--purple-700)', padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--yellow-400)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico name="check-circle" size={24} color="var(--purple-700)" /></div>
        <div>
          <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 16 }}>Order Ready! 🎉</p>
          <p style={{ margin: '2px 0 0', color: 'rgba(249,219,9,0.85)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Ico name="package" size={12} /> Ref: {order.ref}</p>
        </div>
      </div>
      <div style={{ padding: '12px 16px 0' }}>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '8px 12px' }}>
          💡 Your tracking number (VIMP…) arrives by email after payment — {order.ref} is your order reference.</p>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--line)', marginTop: 12 }}>
        {order.lines.map((l, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: 'var(--muted)' }}>{l.label}</span><span style={{ fontWeight: 600, color: 'var(--ink)' }}>{LKR(l.amount)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          <span style={{ fontWeight: 700, color: 'var(--ink)' }}>Total</span>
          <span style={{ fontWeight: 700, fontSize: 20, color: 'var(--purple-700)' }}>{LKR(order.total)}</span>
        </div>
      </div>
      <div style={{ padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--yellow-400)', color: 'var(--ink)',
          fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Pay Now on Kapruka <Ico name="external-link" size={16} /></a>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
          <Ico name="clock" size={12} /> Price locked · {mm}:{ss}</div>
      </div>
    </div>
  )
}

function OrderTracker({ order }) {
  const stages = [['Received', 'package'], ['Confirmed', 'check-circle'], ['Out for Delivery', 'truck'], ['Delivered', 'gift']]
  const active = order.stage
  return (
    <div style={{ width: '100%', maxWidth: 360, background: '#fff', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ background: 'var(--purple-700)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Ico name="package" size={16} color="var(--yellow-400)" /> {order.number}</p>
          <p style={{ margin: '2px 0 0', color: 'rgba(249,219,9,0.85)', fontSize: 12 }}>{order.statusDisplay}</p>
        </div>
        {order.live && <span style={{ padding: '3px 8px', borderRadius: 999, background: 'var(--yellow-400)',
          color: 'var(--purple-700)', fontSize: 10, fontWeight: 700 }}>● LIVE</span>}
      </div>
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ position: 'absolute', top: 16, left: 16, right: 16, height: 2, background: 'var(--line)' }} />
          <div style={{ position: 'absolute', top: 16, left: 16, height: 2, background: 'var(--success)',
            width: `calc(${(active / 3) * 100}% - ${(active / 3) * 32}px)`, transition: 'width .6s var(--ease-out)' }} />
          {stages.map(([label, icon], i) => {
            const done = i <= active
            return (
              <div key={label} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--success)' : 'var(--surface)', color: done ? '#fff' : 'var(--muted)',
                  border: done ? 'none' : '1px solid var(--line)', boxShadow: i === active ? '0 0 0 4px rgba(31,157,87,.2)' : 'none' }}>
                  <Ico name={icon} size={16} color={done ? '#fff' : 'var(--muted)'} /></div>
                <span style={{ fontSize: 10, fontWeight: 500, textAlign: 'center', maxWidth: 60, lineHeight: 1.2,
                  color: done ? 'var(--ink)' : 'var(--muted)' }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
      {order.proof && (
        <div style={{ padding: '8px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 'var(--radius-md)',
            background: 'var(--yellow-100)', border: '1px solid var(--yellow-300)' }}>
            <Ico name="gift" size={16} color="var(--purple-700)" />
            <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>Delivery photo available — proof of a delivered smile 🎁</span>
          </div>
        </div>
      )}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
        <Row icon="clock" label="Ordered" value={order.orderDate} />
        <Row icon="truck" label="Delivery" value={order.deliveryDate} />
        <Row icon="map-pin" label="To" value={order.recipient} />
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          <span style={{ color: 'var(--muted)' }}>Total paid</span><span style={{ color: 'var(--purple-700)', fontWeight: 700 }}>{LKR(order.amount)}</span>
        </div>
      </div>
    </div>
  )
}
function Row({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}><Ico name={icon} size={14} /> {label}</span>
      <span style={{ color: 'var(--ink)', fontWeight: 500, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function EmptyState({ prompts, onPrompt }) {
  const feats = [['🎁', 'Find gifts'], ['🎂', 'Order cakes'], ['🌹', 'Send flowers']]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100%', textAlign: 'center', gap: 22, padding: '24px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, animation: 'kapruka-breathe 3s ease-in-out infinite' }}>
        <div style={{ background: 'var(--purple-700)', borderRadius: 'var(--radius-lg)', padding: '14px 24px', boxShadow: 'var(--shadow-lg)' }}>
          <img src="../../assets/kapruka-logo.jpg" alt="Kapruka" style={{ height: 44, width: 'auto', borderRadius: 4 }} />
        </div>
        <span style={{ padding: '5px 12px', borderRadius: 999, background: 'var(--yellow-400)', color: 'var(--purple-700)',
          fontSize: 12, fontWeight: 700, boxShadow: 'var(--shadow-sm)' }}>Kapri — AI Shopping Concierge</span>
      </div>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--purple-700)' }} className="sinhala-text">ආයුබෝවන්! I'm Kapri 👋</h1>
        <p className="sinhala-text" style={{ margin: '6px auto 0', maxWidth: 320, fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
          Your AI shopping concierge for Kapruka.lk — chat in <strong>English</strong>, <strong>සිංහල</strong>, or <strong>Tanglish</strong>!</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, width: '100%', maxWidth: 320 }}>
        {feats.map(([e, t]) => (
          <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 12,
            background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: 24 }}>{e}</span><span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{t}</span>
          </div>
        ))}
      </div>
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>Try saying...</p>
        {prompts.map((p) => (
          <button key={p.text} onClick={() => onPrompt(p.text)} className="sinhala-text" style={{ width: '100%', textAlign: 'left',
            padding: '12px 16px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)',
            fontSize: 14, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: 20 }}>{p.emoji}</span><span style={{ flex: 1 }}>{p.text}</span><Ico name="sparkles" size={16} color="var(--line)" />
          </button>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 11, color: 'var(--line)' }}>Powered by Kapruka MCP × Anthropic Claude</p>
    </div>
  )
}

Object.assign(window, { ProductCarousel, DeliveryStatus, CheckoutCard, OrderTracker, EmptyState, Pill })
