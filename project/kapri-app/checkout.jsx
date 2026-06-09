/* Kapri demo — cart drawer, gift-message editor, checkout flow, checkout card. */
const { Ico } = window.KapriUI
const { LKR, CITIES } = window.KapriData
const { DeliveryStatus } = window.KapriGenUI

const DELIVERY_FEE_DEFAULT = 350

// Mirrors the Kapruka MCP "Check Delivery Availability and Rate" tool:
// input: city, delivery_date (+ perishable items); output: available, rate,
// currency, reason, next_available_date, perishable_warning.
function checkAvailability(cityObj, dateObj, hasPerishable) {
  if (!cityObj || !dateObj) return null
  const dow = new Date(dateObj.iso).getDay() // 0 = Sunday
  // Outstation hubs don't run Sunday routes — surface next_available_date.
  if (cityObj.slow && dow === 0) {
    const nd = new Date(dateObj.iso); nd.setDate(nd.getDate() + 1)
    return { available: false, rate: cityObj.rate, currency: 'LKR',
      reason: `Sorry — we don't run delivery routes to ${cityObj.name} on Sundays.`,
      nextDate: nd.toLocaleDateString('en-LK', { weekday: 'short', day: 'numeric', month: 'short' }) }
  }
  return { available: true, rate: cityObj.rate, currency: 'LKR', reason: null, nextDate: null,
    perishableWarning: hasPerishable
      ? `This order has fresh items (cake/flowers) — they're prepared on the delivery day. Please make sure someone can receive it. Delivery to ${cityObj.name} is available! ✅`
      : null }
}


// ---- Gift message AI "rewriter" (canned, tone × language) ----
const GIFT_REWRITES = {
  warm: {
    en: "Thinking of you today and always. This little something is sent with all my love — enjoy every bite and every moment. 💜",
    si: "අද සහ හැමදාම ඔබ ගැන හිතනවා. මේ පුංචි තෑග්ග මගේ සියලු ආදරයෙන් එවනවා. 💜",
    tl: "Adath, hetath, hamadama oba gæna hithanawa. Mehe punchi dheyak — mage siyalu adarayen. Bohoma snehayen! 💜",
  },
  witty: {
    en: "Warning: contents may cause excessive smiling and at least one happy dance. No regifting allowed. 😄🎁",
    si: "අවවාදයයි: මේ තෑග්ග වැඩිපුර හිනා වෙන්න සහ පොඩි නැටුමක් දාන්න හේතු වෙන්න පුළුවන්! 😄",
    tl: "Warning eka: meka open kaloth wadipura hinawenna puluwan, podi natumak ekka! Re-gift karanna epa hari? 😄🎁",
  },
  formal: {
    en: "With warm wishes and heartfelt regards on this special occasion. May it bring you joy and good fortune.",
    si: "මෙම විශේෂ අවස්ථාවේදී සුබ පැතුම් සහ හෘදයාංගම ආචාර. සතුට සහ සශ්‍රීකත්වය ළඟා වේවා.",
    tl: "Me vishesha avasthawe subha pætum. Satutai sashreekathwayai oba veta lægavewa.",
  },
}

function GiftMessageEditor({ value, lang, onChange }) {
  const [tone, setTone] = React.useState('warm')
  const [busy, setBusy] = React.useState(false)
  const enhance = () => {
    setBusy(true)
    setTimeout(() => { onChange(GIFT_REWRITES[tone][lang] || GIFT_REWRITES[tone].en); setBusy(false) }, 700)
  }
  const tones = [['warm', 'Warm 💜'], ['witty', 'Witty 😄'], ['formal', 'Formal 🎩']]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} maxLength={240} rows={3} placeholder="Write a gift message…" className="sinhala-text"
        style={{ width: '100%', resize: 'none', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', padding: '10px 12px',
          fontSize: 13.5, color: 'var(--ink)', background: 'var(--surface)', outline: 'none', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>Tone:</span>
        {tones.map(([id, l]) => (
          <button key={id} onClick={() => setTone(id)} style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
            border: '1px solid', ...(tone === id ? { background: 'var(--purple-700)', color: '#fff', borderColor: 'var(--purple-700)' }
              : { background: '#fff', color: 'var(--purple-700)', borderColor: 'var(--line)' }) }}>{l}</button>
        ))}
        <button onClick={enhance} disabled={busy} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700,
          padding: '5px 12px', borderRadius: 999, border: 'none', cursor: 'pointer', background: 'var(--yellow-400)', color: 'var(--purple-700)', fontFamily: 'var(--font-sans)' }}>
          <Ico name="wand" size={13} /> {busy ? 'Writing…' : 'Enhance'}</button>
      </div>
    </div>
  )
}

// ---- Cart Drawer ----
function CartDrawer({ open, items, giftMessage, onClose, onQty, onRemove, onIcing, onCheckout, lang }) {
  const subtotal = items.reduce((s, i) => s + i.p.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)',
        zIndex: 40, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity .3s' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 380, background: '#fff', zIndex: 50,
        display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xl)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .4s var(--ease-out)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 18px', background: 'var(--purple-700)', color: '#fff' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 17 }}><Ico name="bag" size={20} /> Your Cart{count > 0 && ` (${count})`}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 6 }}><Ico name="x" size={20} /></button>
        </div>
        <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--muted)' }}>
              <Ico name="bag" size={54} color="var(--purple-200)" />
              <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>Your cart is empty</p>
              <p style={{ margin: 0, fontSize: 12.5, textAlign: 'center', maxWidth: 190 }}>Ask Kapri to find something special for you! 🎁</p>
            </div>
          ) : items.map((it) => {
            const isCake = it.p.id.toUpperCase().includes('CAKE')
            return (
              <div key={it.p.id} style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 11, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', gap: 11 }}>
                  <img src={it.p.img} alt={it.p.name} style={{ width: 60, height: 60, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.p.name}</p>
                    <p style={{ margin: '3px 0 0', fontSize: 13.5, fontWeight: 700, color: 'var(--purple-700)' }}>{LKR(it.p.price)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                      <button onClick={() => onQty(it.p.id, -1)} style={qbtn}><Ico name="minus" size={12} /></button>
                      <span style={{ fontSize: 13.5, fontWeight: 600, width: 18, textAlign: 'center' }}>{it.qty}</span>
                      <button onClick={() => onQty(it.p.id, 1)} style={qbtn}><Ico name="plus" size={12} /></button>
                      <button onClick={() => onRemove(it.p.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 2 }}><Ico name="trash" size={16} /></button>
                    </div>
                  </div>
                </div>
                {isCake && (
                  <input value={it.icing || ''} onChange={(e) => onIcing(it.p.id, e.target.value)} maxLength={120} placeholder="✍️ Message on cake (optional)" className="sinhala-text"
                    style={{ width: '100%', fontSize: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', padding: '7px 11px', outline: 'none', background: '#fff', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }} />
                )}
              </div>
            )
          })}
          {items.length > 0 && giftMessage && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--purple-50)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--purple-200)' }}>
              <Ico name="gift" size={15} color="var(--purple-700)" style={{ marginTop: 1 }} />
              <p className="sinhala-text" style={{ margin: 0, fontSize: 12, color: 'var(--ink)', fontStyle: 'italic', lineHeight: 1.45 }}>“{giftMessage}”</p>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div style={{ padding: 16, borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)', fontSize: 14 }}>Subtotal</span>
              <span style={{ fontWeight: 700, color: 'var(--purple-700)', fontSize: 18 }}>{LKR(subtotal)}</span></div>
            <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)' }}>Flat delivery fee per order — calculated at checkout</p>
            <button onClick={onCheckout} style={{ width: '100%', padding: '13px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--purple-700)',
              color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
              Checkout with Kapri <Ico name="arrow-right" size={16} /></button>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
const qbtn = { width: 25, height: 25, borderRadius: 8, background: '#fff', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink)' }

// ---- Checkout Flow (multi-step) ----
function dateStrip(leadDays) {
  const out = []
  const today = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i)
    out.push({ iso: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-LK', { weekday: 'short' }),
      day: d.getDate(), mon: d.toLocaleDateString('en-LK', { month: 'short' }),
      disabled: i < leadDays })
  }
  return out
}

function CheckoutFlow({ items, giftMessage, onClose, onPlaced, lang }) {
  const [step, setStep] = React.useState(0)
  const [f, setF] = React.useState({ name: '', phone: '', city: 'Colombo', address: '', notes: '', date: '', sender: '', anon: false, msg: giftMessage || '' })
  const [cityQuery, setCityQuery] = React.useState('')
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const cityObj = CITIES.find((c) => c.name === f.city) || CITIES[0]
  const lead = cityObj.slow ? 2 : 1
  const dates = React.useMemo(() => dateStrip(lead), [lead])
  const hasPerishable = items.some((i) => i.p.perishable)
  const subtotal = items.reduce((s, i) => s + i.p.price * i.qty, 0)
  const cityMatches = cityQuery.trim()
    ? CITIES.filter((c) => c.name.toLowerCase().includes(cityQuery.trim().toLowerCase())).slice(0, 6)
    : []
  const avail = checkAvailability(cityObj, dates.find((d) => d.iso === f.date), hasPerishable)

  const steps = ['Recipient', 'Delivery', 'Gift', 'Review']
  const canNext = [
    f.name.trim() && f.phone.trim().length >= 9,
    f.address.trim().length >= 6 && f.date && avail && avail.available,
    true,
    true,
  ][step]

  const place = () => {
    onPlaced({
      ref: 'ORD-' + Math.floor(1000 + Math.random() * 8999) + '-KP',
      city: f.city, date: dates.find((d) => d.iso === f.date), rate: cityObj.rate,
      recipient: f.name, phone: f.phone, address: f.address, notes: f.notes, sender: f.anon ? 'Anonymous' : f.sender, msg: f.msg,
      items, subtotal, total: subtotal + cityObj.rate, perishable: hasPerishable,
    })
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(36,21,68,0.45)', backdropFilter: 'blur(3px)', animation: 'kapri-up .3s var(--ease-out)' }}>
    <div className="kapri-modal" style={{ width: '100%', maxWidth: 540, height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: 'var(--purple-700)', color: '#fff' }}>
        {step > 0 ? <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 2 }}><Ico name="chevron-left" size={22} /></button>
          : <Ico name="bag" size={20} color="var(--yellow-400)" />}
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Checkout</p>
          <p style={{ margin: '1px 0 0', fontSize: 11.5, color: 'rgba(255,255,255,0.65)' }}>Step {step + 1} of 4 · {steps[step]}</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}><Ico name="x" size={20} /></button>
      </div>
      {/* progress */}
      <div style={{ display: 'flex', gap: 4, padding: '10px 16px', background: '#fff', borderBottom: '1px solid var(--line)' }}>
        {steps.map((s, i) => <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= step ? 'var(--purple-700)' : 'var(--line)', transition: 'background .3s' }} />)}
      </div>

      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {step === 0 && (
          <React.Fragment>
            <Field label="Recipient name" icon="user"><input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Who is this for?" style={inp} /></Field>
            <Field label="Recipient phone" icon="phone"><input value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="07X XXX XXXX" inputMode="tel" style={inp} /></Field>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>We'll only use this to coordinate delivery — Sri Lankan numbers (07X… or +947X…).</p>
          </React.Fragment>
        )}
        {step === 1 && (
          <React.Fragment>
            <div>
              <label style={lbl}><Ico name="pin" size={14} color="var(--purple-700)" /> Delivery city</label>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...inp, padding: '0 12px' }}>
                  <Ico name="search" size={15} color="var(--muted)" />
                  <input value={cityQuery || f.city} onChange={(e) => setCityQuery(e.target.value)} placeholder="Search a Sri Lankan city…"
                    style={{ flex: 1, border: 'none', outline: 'none', padding: '11px 0', fontSize: 14, background: 'transparent', fontFamily: 'var(--font-sans)' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--purple-700)', whiteSpace: 'nowrap' }}>{LKR(cityObj.rate)}</span>
                </div>
                {cityMatches.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#fff', border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 5, overflow: 'hidden' }}>
                    {cityMatches.map((c) => (
                      <button key={c.name} onClick={() => { set('city', c.name); set('date', ''); setCityQuery('') }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 13px', border: 'none',
                          borderBottom: '1px solid var(--line)', background: '#fff', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--ink)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Ico name="pin" size={13} color="var(--purple-400)" /> {c.name}{c.slow ? <span style={{ fontSize: 11, color: 'var(--warn)' }}> · 2-day lead</span> : ''}</span>
                        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{LKR(c.rate)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 11, color: 'var(--muted)' }}>We deliver to {CITIES.length}+ cities island-wide — type to find yours.</p>
            </div>

            <Field label="Delivery address" icon="bag">
              <textarea value={f.address} onChange={(e) => set('address', e.target.value)} rows={2} placeholder="House / building no, street, area" className="sinhala-text"
                style={{ ...inp, resize: 'none' }} />
            </Field>
            <Field label="Delivery notes (optional)" icon="edit">
              <input value={f.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Landmark, gate code, best time…" className="sinhala-text" style={inp} />
            </Field>

            <div>
              <label style={lbl}><Ico name="calendar" size={14} color="var(--purple-700)" /> Delivery date</label>
              <div className="scrollbar-hide" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {dates.map((d) => (
                  <button key={d.iso} disabled={d.disabled} onClick={() => set('date', d.iso)} style={{ flexShrink: 0, width: 56, padding: '9px 0', borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${f.date === d.iso ? 'var(--purple-700)' : 'var(--line)'}`, cursor: d.disabled ? 'not-allowed' : 'pointer', opacity: d.disabled ? 0.35 : 1,
                    background: f.date === d.iso ? 'var(--purple-700)' : '#fff', color: f.date === d.iso ? '#fff' : 'var(--ink)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, fontFamily: 'var(--font-sans)' }}>
                    <span style={{ fontSize: 10, opacity: .7 }}>{d.label}</span>
                    <span style={{ fontSize: 17, fontWeight: 700 }}>{d.day}</span>
                    <span style={{ fontSize: 9.5, opacity: .7 }}>{d.mon}</span>
                  </button>
                ))}
              </div>
              {cityObj.slow && <p style={{ margin: '8px 0 0', fontSize: 11.5, color: 'var(--warn)', display: 'flex', alignItems: 'center', gap: 5 }}><Ico name="warn" size={13} color="var(--warn)" /> {f.city} needs a 2-day lead time — earliest dates are disabled.</p>}
            </div>

            {/* Live availability + rate check (Kapruka MCP: Check Delivery Availability and Rate) */}
            {f.date && avail && (
              <div>
                <label style={lbl}><Ico name="truck" size={14} color="var(--purple-700)" /> Availability &amp; rate</label>
                <DeliveryStatus city={f.city} date={`${dates.find((d) => d.iso === f.date).label} ${dates.find((d) => d.iso === f.date).day} ${dates.find((d) => d.iso === f.date).mon}`}
                  available={avail.available} rate={avail.rate} reason={avail.reason} nextDate={avail.nextDate} perishableWarning={avail.perishableWarning} />
                {!avail.available && <p style={{ margin: '8px 0 0', fontSize: 11.5, color: 'var(--error)' }}>Pick another date to continue.</p>}
              </div>
            )}
          </React.Fragment>
        )}
        {step === 2 && (
          <React.Fragment>
            <Field label="From (sender name)" icon="user"><input value={f.sender} onChange={(e) => set('sender', e.target.value)} placeholder="Your name" disabled={f.anon} style={{ ...inp, opacity: f.anon ? .5 : 1 }} /></Field>
            <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', fontSize: 13.5, color: 'var(--ink)' }}>
              <input type="checkbox" checked={f.anon} onChange={(e) => set('anon', e.target.checked)} style={{ width: 17, height: 17, accentColor: 'var(--purple-700)' }} />
              Send as a secret admirer 🤫 (anonymous)
            </label>
            <div>
              <label style={lbl}><Ico name="gift" size={14} color="var(--purple-700)" /> Gift message</label>
              <GiftMessageEditor value={f.msg} lang={lang} onChange={(v) => set('msg', v)} />
            </div>
          </React.Fragment>
        )}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((it) => (
              <div key={it.p.id} style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
                <img src={it.p.img} alt={it.p.name} style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}><p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.p.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--muted)' }}>Qty {it.qty}{it.icing ? ` · ✍️ "${it.icing}"` : ''}</p></div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{LKR(it.p.price * it.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
              <Summary l="Items" v={LKR(subtotal)} />
              <Summary l={`Delivery to ${f.city} (flat)`} v={LKR(cityObj.rate)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 7, borderTop: '1px solid var(--line)' }}>
                <span style={{ fontWeight: 700, color: 'var(--ink)' }}>Total</span><span style={{ fontWeight: 700, fontSize: 19, color: 'var(--purple-700)' }}>{LKR(subtotal + cityObj.rate)}</span></div>
            </div>
            <div style={{ padding: '11px 13px', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>
              <div><strong style={{ color: 'var(--ink)' }}>To:</strong> {f.name || '—'} · {f.phone}</div>
              <div><strong style={{ color: 'var(--ink)' }}>Address:</strong> {f.address || '—'}, {f.city}</div>
              {f.notes && <div><strong style={{ color: 'var(--ink)' }}>Notes:</strong> {f.notes}</div>}
              <div><strong style={{ color: 'var(--ink)' }}>Date:</strong> {dates.find((d) => d.iso === f.date)?.label} {dates.find((d) => d.iso === f.date)?.day} {dates.find((d) => d.iso === f.date)?.mon}</div>
              <div><strong style={{ color: 'var(--ink)' }}>From:</strong> {f.anon ? 'Anonymous 🤫' : (f.sender || '—')}</div>
              {f.msg && <div className="sinhala-text" style={{ marginTop: 4, fontStyle: 'italic' }}>“{f.msg}”</div>}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: 16, borderTop: '1px solid var(--line)', background: '#fff' }}>
        {step < 3 ? (
          <button onClick={() => canNext && setStep(step + 1)} disabled={!canNext} style={{ width: '100%', padding: '13px', borderRadius: 'var(--radius-md)', border: 'none',
            background: 'var(--purple-700)', color: '#fff', fontWeight: 600, fontSize: 15, cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : .45,
            fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>Continue <Ico name="arrow-right" size={16} /></button>
        ) : (
          <button onClick={place} style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--yellow-400)',
            color: 'var(--purple-700)', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Ico name="check-circle" size={18} /> Place order — {LKR(subtotal + cityObj.rate)}</button>
        )}
      </div>
    </div>
    </div>
  )
}
const inp = { width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', padding: '11px 13px', fontSize: 14, color: 'var(--ink)', background: '#fff', outline: 'none', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }
const lbl = { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }
function Field({ label, icon, children }) { return <div><label style={lbl}><Ico name={icon} size={14} color="var(--purple-700)" /> {label}</label>{children}</div> }
function Summary({ l, v }) { return <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}><span style={{ color: 'var(--muted)' }}>{l}</span><span style={{ fontWeight: 600, color: 'var(--ink)' }}>{v}</span></div> }

// ---- Checkout Card (pay link + countdown) ----
function CheckoutCard({ order, onPay, paid }) {
  const [secs, setSecs] = React.useState(3600)
  React.useEffect(() => { const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t) }, [])
  const mm = String(Math.floor(secs / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0')
  const warn = secs < 300
  return (
    <div style={{ width: '100%', maxWidth: 360, background: '#fff', borderRadius: 'var(--radius-lg)', border: '2px solid var(--purple-700)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ background: 'var(--purple-700)', padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--yellow-400)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'kapri-pop .4s var(--ease-spring)' }}>
          <Ico name="check-circle" size={24} color="var(--purple-700)" /></div>
        <div><p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 16 }}>Order Ready! 🎉</p>
          <p style={{ margin: '2px 0 0', color: 'rgba(249,219,9,0.85)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Ico name="package" size={12} /> Ref: {order.ref}</p></div>
      </div>
      <div style={{ padding: '12px 16px 0' }}>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '8px 12px', lineHeight: 1.5 }}>
          💡 Your tracking number (VIMP…) arrives by email after payment — {order.ref} is just your order reference.</p>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--line)', marginTop: 12 }}>
        <Summary l="Items" v={LKR(order.subtotal)} /><Summary l="Delivery (flat per order)" v={LKR(order.rate)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          <span style={{ fontWeight: 700, color: 'var(--ink)' }}>Total</span><span style={{ fontWeight: 700, fontSize: 20, color: 'var(--purple-700)' }}>{LKR(order.total)}</span></div>
      </div>
      <div style={{ padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {paid ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 'var(--radius-md)',
            background: 'var(--success-tint)', color: 'var(--success)', fontWeight: 700, fontSize: 15, border: '1px solid var(--success)' }}>
            <Ico name="check-circle" size={18} color="var(--success)" /> Payment received — thank you! 🎉</div>
        ) : (
          <button onClick={() => onPay && onPay(order)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 'var(--radius-md)',
            background: 'var(--yellow-400)', color: 'var(--purple-700)', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Pay Now on Kapruka <Ico name="arrow-right" size={16} /></button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: paid ? 'var(--success)' : warn ? 'var(--warn)' : 'var(--muted)', fontWeight: warn || paid ? 600 : 400 }}>
          <Ico name={paid ? 'check' : 'clock'} size={12} /> {paid ? 'Paid · tracking enabled' : `Price locked · ${mm}:${ss}`}</div>
      </div>
    </div>
  )
}

// ---- Mock payment sheet (demo). In production the CheckoutCard's pay button
//      opens the real Kapruka `checkout_url` returned by kapruka_create_order. ----
function PaymentSheet({ order, onClose, onPaid }) {
  const [method, setMethod] = React.useState('card') // card | account
  const [num, setNum] = React.useState('')
  const [name, setName] = React.useState('')
  const [exp, setExp] = React.useState('')
  const [cvv, setCvv] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [pw, setPw] = React.useState('')
  const [phase, setPhase] = React.useState('form') // form | processing | done
  const fmtNum = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const fmtExp = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d }
  const validCard = num.replace(/\s/g, '').length >= 15 && name.trim() && exp.length === 5 && cvv.length >= 3
  const validAccount = (/\S+@\S+\.\S+/.test(email) || /\d{9,}/.test(email)) && pw.length >= 4
  const valid = method === 'card' ? validCard : validAccount
  const pay = () => {
    if (!valid) return
    setPhase('processing')
    setTimeout(() => { setPhase('done'); setTimeout(() => onPaid(order), 1300) }, method === 'account' ? 1400 : 1700)
  }
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(36,21,68,0.5)', backdropFilter: 'blur(3px)', animation: 'kapri-up .3s var(--ease-out)' }}>
      <div onClick={(e) => e.stopPropagation()} className="kapri-modal" style={{ width: '100%', maxWidth: 440, height: '100%', display: 'flex',
        flexDirection: 'column', background: 'var(--surface)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--purple-700)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <img src="../assets/kapruka-logo.jpg" alt="Kapruka" style={{ height: 22, borderRadius: 4 }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Secure Checkout</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}><Ico name="x" size={20} /></button>
        </div>

        {phase === 'done' ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'kapri-pop .4s var(--ease-spring)' }}>
              <Ico name="check" size={38} color="#fff" /></div>
            <div>
              <h2 style={{ margin: 0, fontSize: 21, fontWeight: 700, color: 'var(--ink)' }}>Payment successful! 🎉</h2>
              <p style={{ margin: '8px 0 0', fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5 }}>Rs. {Number(order.total).toLocaleString('en-LK')} paid. Your order is confirmed — a VIMP tracking number is on its way to your inbox.</p>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Amount */}
              <div style={{ background: 'var(--purple-700)', borderRadius: 'var(--radius-lg)', padding: '14px 16px', color: '#fff' }}>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Amount to pay · {order.ref}</p>
                <p style={{ margin: '3px 0 0', fontSize: 26, fontWeight: 700 }}>Rs. {Number(order.total).toLocaleString('en-LK')}</p>
              </div>

              {/* Method switcher */}
              <div style={{ display: 'flex', gap: 8, background: 'var(--purple-100)', padding: 4, borderRadius: 'var(--radius-md)' }}>
                {[['card', 'cart', 'Pay by card'], ['account', 'user', 'Kapruka account']].map(([m, ic, label]) => (
                  <button key={m} onClick={() => setMethod(m)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '9px 6px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                    background: method === m ? '#fff' : 'transparent', color: method === m ? 'var(--purple-700)' : 'var(--purple-500)',
                    boxShadow: method === m ? 'var(--shadow-sm)' : 'none', transition: 'all .15s' }}>
                    <Ico name={ic} size={15} color={method === m ? 'var(--purple-700)' : 'var(--purple-500)'} /> {label}</button>
                ))}
              </div>

              {method === 'card' ? (
                <React.Fragment>
                  {/* Card preview */}
                  <div style={{ background: 'linear-gradient(120deg, var(--purple-600), var(--purple-800))', borderRadius: 'var(--radius-lg)', padding: 16, color: '#fff', minHeight: 92,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ width: 34, height: 24, borderRadius: 4, background: 'var(--yellow-400)' }} />
                      <span style={{ fontSize: 12, opacity: .8, fontWeight: 600, letterSpacing: '.1em' }}>VISA</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, letterSpacing: '.12em' }}>{num || '•••• •••• •••• ••••'}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: .85 }}>
                      <span>{name.toUpperCase() || 'CARDHOLDER NAME'}</span><span>{exp || 'MM/YY'}</span>
                    </div>
                  </div>
                  <div><label style={lbl}><Ico name="cart" size={13} color="var(--purple-700)" /> Card number</label>
                    <input value={num} onChange={(e) => setNum(fmtNum(e.target.value))} inputMode="numeric" placeholder="4242 4242 4242 4242" style={inp} /></div>
                  <div><label style={lbl}><Ico name="user" size={13} color="var(--purple-700)" /> Name on card</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="As printed on card" style={inp} /></div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}><label style={lbl}>Expiry</label>
                      <input value={exp} onChange={(e) => setExp(fmtExp(e.target.value))} inputMode="numeric" placeholder="MM/YY" style={inp} /></div>
                    <div style={{ flex: 1 }}><label style={lbl}>CVV</label>
                      <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="•••" style={inp} /></div>
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Ico name="check-circle" size={13} color="var(--success)" /> Demo only — no real card is charged. Use any test numbers.</p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 14px', background: 'var(--purple-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--purple-100)' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--purple-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Ico name="user" size={18} color="var(--yellow-400)" /></div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>Sign in to Kapruka</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--muted)' }}>Your saved cards, addresses &amp; loyalty points apply automatically.</p>
                    </div>
                  </div>
                  <div><label style={lbl}><Ico name="user" size={13} color="var(--purple-700)" /> Email or mobile</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com or 07X XXX XXXX" style={inp} /></div>
                  <div><label style={lbl}><Ico name="check-circle" size={13} color="var(--purple-700)" /> Password</label>
                    <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="Your Kapruka password" style={inp} /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11.5, color: 'var(--purple-700)', fontWeight: 600, cursor: 'pointer' }}>Forgot password?</span>
                    <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>New here? Create account</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Ico name="check-circle" size={13} color="var(--success)" /> Demo only — no real login. Enter any email &amp; password.</p>
                </React.Fragment>
              )}
            </div>
            <div style={{ padding: 16, borderTop: '1px solid var(--line)', background: '#fff' }}>
              <button onClick={pay} disabled={!valid || phase === 'processing'} style={{ width: '100%', padding: 14, borderRadius: 'var(--radius-md)', border: 'none',
                background: 'var(--yellow-400)', color: 'var(--purple-700)', fontWeight: 700, fontSize: 16, cursor: valid ? 'pointer' : 'not-allowed', opacity: valid ? 1 : .5,
                fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {phase === 'processing'
                  ? <React.Fragment><span style={{ width: 16, height: 16, border: '2px solid rgba(68,42,115,.3)', borderTopColor: 'var(--purple-700)', borderRadius: 999, animation: 'kapri-spin .7s linear infinite' }} /> {method === 'account' ? 'Signing in…' : 'Processing…'}</React.Fragment>
                  : <React.Fragment><Ico name="check-circle" size={17} /> {method === 'account' ? 'Sign in & Pay' : 'Pay'} Rs. {Number(order.total).toLocaleString('en-LK')}</React.Fragment>}
              </button>
              <p style={{ margin: '9px 0 0', fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>🔒 Secured by Kapruka Payments</p>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

window.KapriCheckout = { CartDrawer, CheckoutFlow, CheckoutCard, GiftMessageEditor, PaymentSheet }
