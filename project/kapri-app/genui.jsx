/* Kapri demo — generative UI cards. */
const { Ico, Chip } = window.KapriUI
const { LKR } = window.KapriData

function Pill({ tone, children }) {
  const t = {
    purple: { background: 'rgba(68,42,115,0.82)', color: '#fff', backdropFilter: 'blur(4px)' },
    accent: { background: 'var(--yellow-400)', color: 'var(--purple-700)', fontWeight: 700 },
    success: { background: 'rgba(31,157,87,0.92)', color: '#fff' },
    warn: { background: 'rgba(217,138,0,0.92)', color: '#fff' },
    ink: { background: 'rgba(27,18,48,0.72)', color: '#fff', backdropFilter: 'blur(4px)' },
  }[tone]
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, lineHeight: 1,
    padding: '4px 8px', borderRadius: 999, whiteSpace: 'nowrap', ...t }}>{children}</span>
}

function EmptyState({ prompts, onPrompt, categories, onCategory, lang }) {
  const feats = [['🎁', 'Find gifts'], ['🎂', 'Order cakes'], ['🌹', 'Send flowers']]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100%', textAlign: 'center', gap: 20, padding: '12px 0 24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, animation: 'kapri-breathe 3.5s ease-in-out infinite' }}>
        <div style={{ background: 'var(--purple-700)', borderRadius: 'var(--radius-lg)', padding: '14px 26px', boxShadow: 'var(--shadow-lg)' }}>
          <img src="../assets/kapruka-logo.jpg" alt="Kapruka" style={{ height: 42, width: 'auto', borderRadius: 5 }} />
        </div>
        <span style={{ padding: '5px 13px', borderRadius: 999, background: 'var(--yellow-400)', color: 'var(--purple-700)',
          fontSize: 12, fontWeight: 700, boxShadow: 'var(--shadow-sm)' }}>Kapri — AI Shopping Concierge</span>
      </div>
      <div>
        <h1 className="sinhala-text" style={{ margin: 0, fontSize: 25, fontWeight: 700, color: 'var(--purple-700)' }}>ආයුබෝවන්! I'm Kapri 👋</h1>
        <p className="sinhala-text" style={{ margin: '7px auto 0', maxWidth: 330, fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
          Your shopping concierge for Kapruka.lk — Sri Lanka's #1 gifting platform. Chat in <strong style={{ color: 'var(--ink)' }}>English</strong>, <strong style={{ color: 'var(--ink)' }}>සිංහල</strong>, or <strong style={{ color: 'var(--ink)' }}>Tanglish</strong>!
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, width: '100%', maxWidth: 320 }}>
        {feats.map(([e, t]) => (
          <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 4px',
            background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: 24 }}>{e}</span><span style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 500 }}>{t}</span>
          </div>
        ))}
      </div>
      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>Try saying…</p>
        {prompts.map((p) => (
          <button key={p.text} onClick={() => onPrompt(p.text)} className="sinhala-text" style={{ width: '100%', textAlign: 'left',
            padding: '12px 15px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', fontSize: 14,
            color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
            transition: 'all .15s var(--ease-out)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--purple-700)'; e.currentTarget.style.background = 'var(--purple-50)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = '#fff' }}>
            <span style={{ fontSize: 19 }}>{p.emoji}</span><span style={{ flex: 1 }}>{p.text}</span><Ico name="sparkles" size={15} color="var(--purple-300)" />
          </button>
        ))}
      </div>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <p style={{ margin: '0 0 8px', fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>Or browse</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center' }}>
          {categories.map((c) => (
            <button key={c.name} onClick={() => onCategory(c.q)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
              borderRadius: 999, background: '#fff', border: '1px solid var(--line)', fontSize: 13, color: 'var(--ink)', cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)', fontFamily: 'var(--font-sans)' }}>
              <span style={{ fontSize: 15 }}>{c.emoji}</span>{c.name}</button>
          ))}
        </div>
      </div>
      <button onClick={() => onPrompt('Track my order')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 999,
        background: 'var(--purple-100)', border: '1px solid var(--purple-200)', color: 'var(--purple-700)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
        <Ico name="package" size={15} color="var(--purple-700)" /> Track an order</button>
      <p style={{ margin: 0, fontSize: 11, color: 'var(--purple-200)' }}>Powered by Kapruka × Anthropic Claude</p>
    </div>
  )
}

function ProductCard({ p, inCart, onAdd, onOpen }) {
  const [hover, setHover] = React.useState(false)
  const [imgErr, setImgErr] = React.useState(false)
  const [added, setAdded] = React.useState(false)
  const hasDisc = p.was && p.was > p.price
  const pct = hasDisc ? Math.round((1 - p.price / p.was) * 100) : 0
  const lowStock = p.low && !p.perishable
  const add = (e) => { e.stopPropagation(); setAdded(true); onAdd(p); setTimeout(() => setAdded(false), 1600) }
  const open = () => onOpen && onOpen(p)
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 210, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: hover ? '0 12px 28px rgba(68,42,115,.20)' : 'var(--shadow-card)',
        transform: hover ? 'translateY(-3px)' : 'none', transition: 'all .25s var(--ease-out)', scrollSnapAlign: 'start' }}>
      <div onClick={open} title="View details" style={{ position: 'relative', height: 188, background: 'var(--purple-50)', overflow: 'hidden', cursor: 'pointer' }}>
        {!imgErr ? <img src={p.img} alt={p.name} onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover',
          transform: hover ? 'scale(1.05)' : 'none', transition: 'transform .4s var(--ease-out)' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46 }}>🎁</div>}
        <span style={{ position: 'absolute', top: 8, left: 8 }}><Pill tone="purple">{p.cat}</Pill></span>
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {lowStock && <Pill tone="warn">Low Stock</Pill>}
          {hasDisc && <Pill tone="success">-{pct}%</Pill>}
        </div>
      </div>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
        <p onClick={open} style={{ margin: 0, fontWeight: 600, fontSize: 13.5, lineHeight: 1.35, color: 'var(--ink)', cursor: 'pointer',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</p>
        <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45, color: 'var(--muted)', display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.summary}</p>
        <span style={{ alignSelf: 'flex-start', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--muted)',
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 7, padding: '2px 6px' }}>{p.id}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
          <span style={{ fontWeight: 700, fontSize: 15.5, color: 'var(--purple-700)' }}>{LKR(p.price)}</span>
          {hasDisc && <span style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'line-through' }}>{LKR(p.was)}</span>}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 3 }}>
          <button onClick={add} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 0', borderRadius: 'var(--radius-md)', border: 'none', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-sans)',
            cursor: 'pointer', color: '#fff', background: added ? 'var(--success)' : inCart ? 'var(--purple-500)' : 'var(--purple-700)', transition: 'background .15s' }}>
            <Ico name={added ? 'check' : 'cart'} size={14} />{added ? 'Added!' : inCart ? 'Add again' : 'Add to Cart'}
          </button>
          <button onClick={open} title="View details" style={{ width: 34, height: 34, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--muted)', cursor: 'pointer' }}>
            <Ico name="search" size={14} /></button>
        </div>
      </div>
    </div>
  )
}

function ProductCarousel({ products, cartIds, onAdd, onOpen }) {
  const [sort, setSort] = React.useState('rel')
  const scrollRef = React.useRef(null)
  const [edges, setEdges] = React.useState({ left: false, right: false })
  let list = [...products]
  if (sort === 'asc') list.sort((a, b) => a.price - b.price)
  if (sort === 'desc') list.sort((a, b) => b.price - a.price)
  const pills = [['rel', 'Relevance'], ['asc', 'Price ↑'], ['desc', 'Price ↓']]

  const updateEdges = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setEdges({ left: el.scrollLeft > 8, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8 })
  }, [])
  React.useEffect(() => { updateEdges(); const t = setTimeout(updateEdges, 200); return () => clearTimeout(t) }, [updateEdges, sort, list.length])
  const scrollBy = (dir) => { const el = scrollRef.current; if (el) el.scrollBy({ left: dir * 234, behavior: 'smooth' }) }

  const arrow = (dir) => (
    <button onClick={() => scrollBy(dir)} aria-label={dir < 0 ? 'Previous' : 'Next'}
      style={{ position: 'absolute', top: 94, [dir < 0 ? 'left' : 'right']: -6, transform: 'translateY(-50%)', zIndex: 4,
        width: 38, height: 38, borderRadius: 999, background: '#fff', border: '1px solid var(--line)', boxShadow: 'var(--shadow-lg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--purple-700)' }}>
      <Ico name={dir < 0 ? 'chevron-left' : 'chevron-right'} size={20} color="var(--purple-700)" />
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, width: '100%' }}>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {pills.map(([id, l]) => (
          <button key={id} onClick={() => setSort(id)} style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 999, cursor: 'pointer',
            border: '1px solid', ...(sort === id ? { background: 'var(--purple-700)', color: '#fff', borderColor: 'var(--purple-700)' }
              : { background: 'var(--purple-100)', color: 'var(--purple-700)', borderColor: 'var(--purple-200)' }) }}>{l}</button>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        {edges.left && arrow(-1)}
        {edges.right && arrow(1)}
        <div ref={scrollRef} onScroll={updateEdges} className="scrollbar-hide" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6, scrollSnapType: 'x proximity' }}>
          {list.map((p) => <ProductCard key={p.id} p={p} inCart={cartIds.includes(p.id)} onAdd={onAdd} onOpen={onOpen} />)}
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)' }}>{list.length} results · {edges.right ? 'use the arrows or swipe →' : 'swipe to browse'}</p>
    </div>
  )
}

function BundleCard({ bundle, products, cartIds, onAdd, onAddAll, onGiftMsg }) {
  const total = products.reduce((s, p) => s + p.price, 0)
  return (
    <div style={{ width: '100%', maxWidth: 380, background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)',
      overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ padding: '14px 16px', background: 'linear-gradient(120deg, var(--purple-700), var(--purple-600))' }}>
        <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 16 }}>{bundle.title}</p>
        <p style={{ margin: '5px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 12.5, lineHeight: 1.5 }}>{bundle.blurb}</p>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {products.map((p) => (
          <div key={p.id} style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
            <img src={p.img} alt={p.name} style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--purple-700)', fontWeight: 700 }}>{LKR(p.price)}</p>
            </div>
            <button onClick={() => onAdd(p)} style={{ width: 30, height: 30, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0,
              background: cartIds.includes(p.id) ? 'var(--success)' : 'var(--purple-100)', color: cartIds.includes(p.id) ? '#fff' : 'var(--purple-700)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ico name={cartIds.includes(p.id) ? 'check' : 'plus'} size={15} /></button>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Bundle total</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--purple-700)' }}>{LKR(total)}</span>
        </div>
        <button onClick={onAddAll} style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: 'none',
          background: 'var(--yellow-400)', color: 'var(--purple-700)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'var(--font-sans)' }}>
          <Ico name="gift" size={16} /> Add all to cart</button>
        <button onClick={() => onGiftMsg(bundle.message)} style={{ width: '100%', padding: '9px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--purple-200)', background: '#fff', color: 'var(--purple-700)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--font-sans)' }}>
          <Ico name="wand" size={15} /> Use the suggested gift message</button>
      </div>
    </div>
  )
}

function DeliveryStatus({ city, date, available, rate, reason, nextDate, perishableWarning }) {
  return (
    <div style={{ width: '100%', maxWidth: 360, background: '#fff', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      border: `2px solid ${available ? 'var(--success)' : 'var(--error)'}`, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: available ? 'var(--success-tint)' : 'var(--error-tint)' }}>
        <Ico name={available ? 'check-circle' : 'x'} size={20} color={available ? 'var(--success)' : 'var(--error)'} />
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: available ? 'var(--success)' : 'var(--error)' }}>
            {available ? 'Delivery Available!' : '❌ Not Available'}</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Ico name="calendar" size={12} /> {city} · {date}</p>
        </div>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {available && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}>
            <Ico name="truck" size={16} color="var(--purple-700)" /> Delivery fee (flat per order)</span>
          <span style={{ fontWeight: 700, color: 'var(--purple-700)' }}>{LKR(rate)}</span></div>}
        {reason && <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--error-tint)' }}>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--error)' }}>{reason}</p></div>}
        {nextDate && <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>Next available: <strong style={{ color: 'var(--ink)' }}>{nextDate}</strong></p>}
        {perishableWarning && <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', borderRadius: 'var(--radius-md)',
          background: 'var(--warn-tint)', border: '1px solid var(--yellow-200)' }}>
          <Ico name="warn" size={16} color="var(--warn)" style={{ marginTop: 1 }} />
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: '#92400E' }}>{perishableWarning}</p></div>}
      </div>
    </div>
  )
}

function OrderTracker({ order }) {
  const stages = [['Received', 'package'], ['Confirmed', 'check-circle'], ['Out for Delivery', 'truck'], ['Delivered', 'gift']]
  return (
    <div style={{ width: '100%', maxWidth: 360, background: '#fff', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ background: 'var(--purple-700)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Ico name="package" size={16} color="var(--yellow-400)" /> {order.number}</p>
          <p style={{ margin: '2px 0 0', color: 'rgba(249,219,9,0.85)', fontSize: 12 }}>{order.statusDisplay}</p>
        </div>
        {order.live && <span style={{ padding: '3px 9px', borderRadius: 999, background: 'var(--yellow-400)', color: 'var(--purple-700)',
          fontSize: 10, fontWeight: 700, animation: 'kapri-pulse 1.6s infinite' }}>● LIVE</span>}
      </div>
      <div style={{ padding: '20px 16px 10px' }}>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ position: 'absolute', top: 16, left: 16, right: 16, height: 2, background: 'var(--line)' }} />
          <div style={{ position: 'absolute', top: 16, left: 16, height: 2, background: 'var(--success)',
            width: `calc(${(order.stage / 3) * 100}% - ${(order.stage / 3) * 32}px)`, transition: 'width .7s var(--ease-out)' }} />
          {stages.map(([label, icon], i) => {
            const done = i <= order.stage
            return (
              <div key={label} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--success)' : 'var(--surface)', border: done ? 'none' : '1px solid var(--line)',
                  boxShadow: i === order.stage ? '0 0 0 4px rgba(31,157,87,.2)' : 'none' }}>
                  <Ico name={icon} size={15} color={done ? '#fff' : 'var(--muted)'} /></div>
                <span style={{ fontSize: 9.5, fontWeight: 500, textAlign: 'center', maxWidth: 58, lineHeight: 1.2, color: done ? 'var(--ink)' : 'var(--muted)' }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ padding: '8px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 'var(--radius-md)',
          background: 'var(--yellow-100)', border: '1px solid var(--yellow-300)' }}>
          <Ico name="gift" size={16} color="var(--purple-700)" />
          <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>Delivery photo available — proof of a delivered smile 🎁</span></div>
      </div>
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5 }}>
        {[['clock', 'Ordered', order.orderDate], ['truck', 'Delivery', order.deliveryDate], ['pin', 'To', order.recipient]].map(([ic, l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}><Ico name={ic} size={14} /> {l}</span>
            <span style={{ color: 'var(--ink)', fontWeight: 500, textAlign: 'right' }}>{v}</span></div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          <span style={{ color: 'var(--muted)' }}>Total paid</span><span style={{ color: 'var(--purple-700)', fontWeight: 700 }}>{LKR(order.amount)}</span></div>
      </div>

      {order.items && order.items.length > 0 && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)' }}>
          <p style={{ margin: '0 0 9px', fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {order.items.length} item{order.items.length > 1 ? 's' : ''} in this order</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {order.items.map((it, idx) => {
              const itemStatus = ['Preparing', 'Packed', 'Out for delivery', 'Delivered'][order.stage] || 'Preparing'
              return (
                <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <img src={it.img} alt={it.name} onError={(e) => { e.currentTarget.style.display = 'none' }}
                    style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0, background: 'var(--purple-50)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999,
                        background: order.stage >= 3 ? 'rgba(31,157,87,.12)' : 'var(--purple-100)', color: order.stage >= 3 ? 'var(--success)' : 'var(--purple-700)' }}>
                        <span style={{ width: 5, height: 5, borderRadius: 999, background: order.stage >= 3 ? 'var(--success)' : 'var(--purple-500)' }} />{itemStatus}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>Qty {it.qty}</span>
                      {it.icing && <span style={{ fontSize: 10, color: 'var(--purple-700)', background: 'var(--purple-50)', padding: '1px 6px', borderRadius: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 110 }}>✍️ {it.icing}</span>}
                    </div>
                  </div>
                  {it.price != null && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', flexShrink: 0 }}>{LKR(it.price * it.qty)}</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Maps to the Kapruka MCP "Get Product Details" tool — full single-product view.
const CAT_BLURB = {
  Cakes: "Freshly baked to order by Kapruka's master bakers using premium ingredients, and delivered on a sturdy board with a complimentary message card. Personalise it with an icing message below.",
  Flowers: "Hand-arranged by our florists on the morning of delivery and presented in protective wrapping so it arrives garden-fresh.",
  Chocolates: "Stored and shipped with care to keep every piece perfect. A crowd-pleasing gift for any occasion.",
  Hampers: "Thoughtfully curated and gift-wrapped, ready to hand over. A little of everything they'll love.",
  Perfumes: "100% authentic, sealed stock sourced through authorised channels. Comes boxed and gift-ready.",
  Jewellery: "Comes in a presentation box with a care card — a keepsake they'll treasure.",
  Electronics: "Genuine stock with manufacturer warranty. Boxed and ready to gift or use straight away.",
  'Soft Toys': "Super-soft, cuddle-tested and surface-washable — a friend for keeps.",
}

function SpecRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
      <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function ProductDetail({ p, inCart, onAdd, onClose }) {
  const [qty, setQty] = React.useState(1)
  const [icing, setIcing] = React.useState('')
  const [imgErr, setImgErr] = React.useState(false)
  const [added, setAdded] = React.useState(false)
  if (!p) return null
  const isCake = p.id.toUpperCase().includes('CAKE')
  const hasDisc = p.was && p.was > p.price
  const pct = hasDisc ? Math.round((1 - p.price / p.was) * 100) : 0
  const lowStock = p.low && !p.perishable
  const availability = p.perishable ? 'Made fresh to order' : lowStock ? 'Low stock — order soon' : 'In stock'
  const add = () => { onAdd(p, qty, isCake ? icing : undefined); setAdded(true); setTimeout(() => { setAdded(false); onClose() }, 700) }
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(36,21,68,0.45)', backdropFilter: 'blur(3px)', animation: 'kapri-up .3s var(--ease-out)' }}>
      <div className="kapri-modal" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 540, height: '100%', display: 'flex',
        flexDirection: 'column', background: 'var(--surface)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--purple-700)', color: '#fff' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Ico name="search" size={17} color="var(--yellow-400)" /> Product details</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}><Ico name="x" size={20} /></button>
        </div>

        <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ position: 'relative', height: 300, background: 'var(--purple-50)' }}>
            {!imgErr ? <img src={p.img} alt={p.name} onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>🎁</div>}
            <div style={{ position: 'absolute', top: 12, left: 12 }}><Pill tone="purple">{p.cat}</Pill></div>
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
              {lowStock && <Pill tone="warn">Low Stock</Pill>}
              {hasDisc && <Pill tone="success">-{pct}% OFF</Pill>}
            </div>
          </div>

          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <h2 className="sinhala-text" style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>{p.name}</h2>
              <span style={{ display: 'inline-block', marginTop: 7, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)',
                background: '#fff', border: '1px solid var(--line)', borderRadius: 7, padding: '3px 8px' }}>{p.id}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 26, color: 'var(--purple-700)' }}>{LKR(p.price)}</span>
              {hasDisc && <span style={{ fontSize: 15, color: 'var(--muted)', textDecoration: 'line-through' }}>{LKR(p.was)}</span>}
              {hasDisc && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>Save {LKR(p.was - p.price)}</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: p.perishable ? 'var(--warn)' : 'var(--success)', fontWeight: 600 }}>
              <Ico name={p.perishable ? 'clock' : 'check-circle'} size={16} color={p.perishable ? 'var(--warn)' : 'var(--success)'} /> {availability}
            </div>

            <p className="sinhala-text" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink)' }}>
              {p.summary} {CAT_BLURB[p.cat] || ''}
            </p>

            <div>
              <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>Details</p>
              <SpecRow label="Category" value={p.cat} />
              <SpecRow label="Product ID" value={p.id} />
              <SpecRow label="Availability" value={availability} />
              {isCake && <SpecRow label="Size" value="1 kg (serves ~8)" />}
              <SpecRow label="Delivery" value="Island-wide · flat fee per order" />
              <SpecRow label="Personalisation" value={isCake ? 'Icing message (≤120 chars)' : 'Free gift message at checkout'} />
            </div>

            {p.perishable && (
              <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--warn-tint)', border: '1px solid var(--yellow-200)' }}>
                <Ico name="warn" size={15} color="var(--warn)" style={{ marginTop: 1 }} />
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: '#92400E' }}>Fresh item — prepared on the delivery day. Choose a date 1–2 days ahead and make sure someone can receive it.</p>
              </div>
            )}

            {isCake && (
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 7 }}>
                  <Ico name="edit" size={14} color="var(--purple-700)" /> Message on cake (optional)</label>
                <input value={icing} onChange={(e) => setIcing(e.target.value)} maxLength={120} placeholder="e.g. Happy Birthday Amma! 🎂" className="sinhala-text"
                  style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', padding: '10px 12px', fontSize: 13.5,
                    outline: 'none', background: '#fff', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }} />
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: 16, borderTop: '1px solid var(--line)', background: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '6px 10px' }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', display: 'flex' }}><Ico name="minus" size={15} /></button>
            <span style={{ fontSize: 15, fontWeight: 700, width: 18, textAlign: 'center' }}>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', display: 'flex' }}><Ico name="plus" size={15} /></button>
          </div>
          <button onClick={add} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 'var(--radius-md)',
            border: 'none', background: added ? 'var(--success)' : 'var(--purple-700)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            <Ico name={added ? 'check' : 'cart'} size={17} /> {added ? 'Added to cart!' : `Add ${qty} · ${LKR(p.price * qty)}`}
          </button>
        </div>
      </div>
    </div>
  )
}

function SkeletonCarousel() {
  const sk = { background: 'var(--purple-100)', borderRadius: 8 }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, width: '100%' }}>
      <div style={{ display: 'flex', gap: 7 }}>
        {[60, 54, 54].map((w, i) => <div key={i} className="skeleton" style={{ width: w, height: 24, borderRadius: 999 }} />)}
      </div>
      <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: 210, flexShrink: 0, background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            <div className="skeleton" style={{ height: 188, borderRadius: 0 }} />
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ ...sk, height: 12, width: '90%' }} />
              <div className="skeleton" style={{ ...sk, height: 12, width: '60%' }} />
              <div className="skeleton" style={{ ...sk, height: 22, width: 66 }} />
              <div className="skeleton" style={{ ...sk, height: 34, width: '100%', marginTop: 4 }} />
            </div>
          </div>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)' }}>Searching Kapruka for you…</p>
    </div>
  )
}

window.KapriGenUI = { Pill, EmptyState, ProductCard, ProductCarousel, BundleCard, DeliveryStatus, OrderTracker, ProductDetail, SkeletonCarousel }
