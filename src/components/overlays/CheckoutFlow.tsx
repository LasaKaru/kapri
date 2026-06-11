'use client'
import React, { useState, useMemo } from 'react'
import { Ico } from '../ui/Icons'
import { LKR, CITIES } from '@/lib/data'
import { DeliveryStatus } from '../cards/DeliveryStatus'
import type { CartItem, DateItem, OrderData, Lang, AvailabilityResult, City } from '@/lib/types'

const inp: React.CSSProperties = { width:'100%', borderRadius:'var(--radius-md)', border:'1px solid var(--line)',
  padding:'11px 13px', fontSize:14, color:'var(--ink)', background:'#fff', outline:'none',
  fontFamily:'var(--font-sans)', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:'var(--ink)', marginBottom:8 }

function Field({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={lbl}><Ico name={icon} size={14} color="var(--purple-700)" /> {label}</label>
      {children}
    </div>
  )
}
function Summary({ l, v }: { l: string; v: string }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13.5 }}>
      <span style={{ color:'var(--muted)' }}>{l}</span>
      <span style={{ fontWeight:600, color:'var(--ink)' }}>{v}</span>
    </div>
  )
}

const GIFT_REWRITES = {
  warm: [
    {
      en: "Thinking of you today and always. This little something is sent with all my love — enjoy every bite and every moment. 💜",
      si: "අද සහ හැමදාම ඔබ ගැන හිතනවා. මේ පුංචි තෑග්ග මගේ සියලු ආදරයෙන් එවනවා. 💜",
      tl: "Adath, hetath, hamadama oba gæna hithanawa. Mehe punchi dheyak — mage siyalu adarayen. Bohoma snehayen! 💜",
    },
    {
      en: "Just a small token to brighten your day! Sending you lots of love and warm hugs. Hope you love it! 💜",
      si: "ඔබේ දවස ලස්සන කරන්න පුංචි තෑග්ගක්! ගොඩක් ආදරේ සහ උණුසුම් වැළඳගැනීම්. 💜",
      tl: "Oyage dawasa lassana karanna punchi thæggak! Godak adarei saha unusum hugs. 💜",
    },
    {
      en: "Because you deserve the best today and every day. Wishing you endless happiness and joy with this gift. 💜",
      si: "ඔබ හැමදාම හොඳම දේ ලැබිය යුතු නිසා. මේ තෑග්ගෙන් ඔබට නිමක් නැති සතුටක් ලැබේවා. 💜",
      tl: "Obata hamadama hondama de labiya yuthu nisa. Me thæggen oyata nimak næthi sathutak labewa. 💜",
    }
  ],
  witty: [
    {
      en: "Warning: contents may cause excessive smiling and at least one happy dance. No regifting allowed. 😄🎁",
      si: "අවවාදයයි: මේ තෑග්ග වැඩිපුර හිනා වෙන්න සහ පොඩි නැටුමක් දාන්න හේතු වෙන්න පුළුවන්! 😄",
      tl: "Warning eka: meka open kaloth wadipura hinawenna puluwan, podi natumak ekka! Re-gift karanna epa hari? 😄🎁",
    },
    {
      en: "I was going to get you something expensive, but then I remembered my presence is a present. Here’s a little something anyway! 😉",
      si: "ගණන් වැඩි දෙයක් ගන්න හිටියේ, ඒත් මාව ලැබුණු එකම ලොකු තෑග්ගක් නේ. කොහොම වුණත් මේක තියාගන්න! 😉",
      tl: "Ganan wædi deyak ganna hitiye, eeth mawa labunu ekama loku thæggak ne. Kohoma unath meka thiyaganna! 😉",
    },
    {
      en: "If this isn’t exactly what you wanted, please pretend enthusiastically. Just kidding, I know you’ll love it! 😂🎉",
      si: "මේක ඔයාට හරියටම ඕනෙ කරපු දේ නෙමෙයි නම්, බොරුවට හරි සතුටු වෙන්න. විහිළුවක් කළේ, මම දන්නවා ඔයා මේකට කැමති වෙයි කියලා! 😂🎉",
      tl: "Meka oyata hariyatama oney karapu de nemei nam, boruwata hari sathutu venna. Vihiluwak kale, mama dannawa oya mekata kæmathi wei kiyala! 😂🎉",
    }
  ],
  formal: [
    {
      en: "With warm wishes and heartfelt regards on this special occasion. May it bring you joy and good fortune.",
      si: "මෙම විශේෂ අවස්ථාවේදී සුබ පැතුම් සහ හෘදයාංගම ආචාර. සතුට සහ සශ්‍රීකත්වය ළඟා වේවා.",
      tl: "Me vishesha avasthawe subha pætum. Satutai sashreekathwayai oba veta lægavewa.",
    },
    {
      en: "Please accept this gift as a token of my sincere appreciation and respect. Wishing you all the very best.",
      si: "මාගේ අවංක ඇගයීම සහ ගෞරවයේ සංකේතයක් ලෙස කරුණාකර මෙම තෑග්ග භාරගන්න. ඔබට සියලු සුබ පැතුම්.",
      tl: "Mage avanka agayeema saha gourawaye sankethayak lesa karunakara mema thægga bhara ganna. Obata siyalu subha pætum.",
    },
    {
      en: "Sending you our sincerest congratulations and best wishes for continued success and happiness.",
      si: "ඔබගේ අඛණ්ඩ සාර්ථකත්වය සහ සතුට වෙනුවෙන් අපගේ හෘදයාංගම සුබ පැතුම් මෙයින් ගෙන එන්නෙමු.",
      tl: "Obage akhanda sarthakathwaya saha sathuta venuwen apage hrudayangama subha pætum meyin gena ennemu.",
    }
  ],
}

function GiftMessageEditor({ value, lang, onChange }: { value: string; lang: Lang; onChange: (v: string) => void }) {
  const [tone, setTone] = useState<'warm'|'witty'|'formal'>('warm')
  const [busy, setBusy] = useState(false)
  const tones: [typeof tone, string][] = [['warm','Warm 💜'],['witty','Witty 😄'],['formal','Formal 🎩']]
  const enhance = () => {
    setBusy(true)
    setTimeout(() => {
      const rewrites = GIFT_REWRITES[tone]
      const options = rewrites.filter(r => r[lang as keyof typeof r] !== value && r.en !== value)
      const selected = options[Math.floor(Math.random() * options.length)] || rewrites[0]
      onChange(selected[lang as keyof typeof selected] || selected.en)
      setBusy(false)
    }, 600)
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} maxLength={240} rows={3}
        placeholder="Write a gift message…" className="sinhala-text"
        style={{ ...inp, resize:'none' }} />
      <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
        <span style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>Tone:</span>
        {tones.map(([id, l]) => (
          <button key={id} onClick={() => setTone(id)}
            style={{ fontSize:11.5, fontWeight:600, padding:'4px 10px', borderRadius:999, cursor:'pointer', border:'1px solid',
              ...(tone === id ? { background:'var(--purple-700)', color:'#fff', borderColor:'var(--purple-700)' }
                : { background:'#fff', color:'var(--purple-700)', borderColor:'var(--line)' }) }}>
            {l}
          </button>
        ))}
        <button onClick={enhance} disabled={busy} style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5,
          fontSize:12, fontWeight:700, padding:'5px 12px', borderRadius:999, border:'none', cursor:'pointer',
          background:'var(--yellow-400)', color:'var(--purple-700)', fontFamily:'var(--font-sans)' }}>
          <Ico name="wand" size={13} /> {busy ? 'Writing…' : 'Enhance'}
        </button>
      </div>
    </div>
  )
}

function dateStrip(leadDays: number): DateItem[] {
  const out: DateItem[] = []
  const today = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i)
    out.push({ iso: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-LK', { weekday:'short' }),
      day: d.getDate(), mon: d.toLocaleDateString('en-LK', { month:'short' }),
      disabled: i < leadDays })
  }
  return out
}

function checkAvailability(cityObj: City, dateObj: DateItem | undefined, hasPerishable: boolean): AvailabilityResult | null {
  if (!cityObj || !dateObj) return null
  const dow = new Date(dateObj.iso).getDay()
  if (cityObj.slow && dow === 0) {
    const nd = new Date(dateObj.iso); nd.setDate(nd.getDate() + 1)
    return { available: false, rate: cityObj.rate, currency:'LKR',
      reason: `Sorry — we don't run delivery routes to ${cityObj.name} on Sundays.`,
      nextDate: nd.toLocaleDateString('en-LK', { weekday:'short', day:'numeric', month:'short' }) }
  }
  return { available: true, rate: cityObj.rate, currency:'LKR', reason: null, nextDate: null,
    perishableWarning: hasPerishable
      ? `This order has fresh items (cake/flowers) — they're prepared on the delivery day. Please make sure someone can receive it. Delivery to ${cityObj.name} is available! ✅`
      : null }
}

interface CheckoutFlowProps {
  items: CartItem[]
  giftMessage: string
  lang: Lang
  onClose: () => void
  onPlaced: (order: OrderData) => void
}

export function CheckoutFlow({ items, giftMessage, lang, onClose, onPlaced }: CheckoutFlowProps) {
  const [step, setStep] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [f, setF] = useState({ name:'', phone:'', city:'Colombo', address:'', notes:'', date:'', sender:'', anon:false, msg: giftMessage || '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [cityQuery, setCityQuery] = useState('Colombo')
  
  const set = (k: string, v: string | boolean) => setF((p) => ({ ...p, [k]: v }))
  const onBlur = (k: string) => setTouched(p => ({ ...p, [k]: true }))

  const cityObj = CITIES.find((c) => c.name === f.city) || CITIES[0]
  const lead = cityObj.slow ? 2 : 1
  const dates = useMemo(() => dateStrip(lead), [lead])
  const hasPerishable = items.some((i) => i.p.perishable)
  const subtotal = items.reduce((s, i) => s + i.p.price * i.qty, 0)

  const cityMatches = cityQuery.trim() && cityQuery !== f.city
    ? CITIES.filter((c) => c.name.toLowerCase().includes(cityQuery.trim().toLowerCase())).slice(0, 6)
    : []

  const avail = checkAvailability(cityObj, dates.find((d) => d.iso === f.date), hasPerishable)

  const isPhoneValid = /^(?:0|\+94)7\d{8}$/.test(f.phone.replace(/[\s-]/g, ''))
  const isNameValid = f.name.trim().length >= 2
  const isAddressValid = f.address.trim().length >= 8
  const isSenderValid = f.anon || f.sender.trim().length >= 2

  const steps = ['Recipient','Delivery','Gift','Review']
  const canNext = [
    isNameValid && isPhoneValid,
    isAddressValid && !!f.date && !!(avail && avail.available),
    isSenderValid,
    true,
  ][step]

  // Build the simulated order (used as a fallback when a real Kapruka order
  // can't be placed — e.g. offline catalog IDs, non-deliverable city).
  const simulatedOrder = (): OrderData => ({
    ref: 'ORD-' + Math.floor(1000 + Math.random() * 8999) + '-KP',
    city: f.city, date: dates.find((d) => d.iso === f.date), rate: cityObj.rate,
    recipient: f.name, phone: f.phone, address: f.address, notes: f.notes,
    sender: f.anon ? 'Anonymous' : f.sender, msg: f.msg,
    items, subtotal, total: subtotal + cityObj.rate, perishable: hasPerishable,
  })

  const place = async () => {
    if (placing) return
    setPlacing(true)
    try {
      // Bare "Colombo" isn't a canonical Kapruka delivery city — default to a zone.
      const mcpCity = f.city === 'Colombo' ? 'Colombo 03' : f.city
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: items.map((i) => ({
            product_id: i.p.id,
            quantity: i.qty,
            ...(i.icing ? { icing_text: i.icing } : {}),
          })),
          recipient: { name: f.name, phone: f.phone },
          delivery: { address: f.address, city: mcpCity, date: f.date, location_type: 'house', ...(f.notes ? { instructions: f.notes } : {}) },
          sender: { name: f.anon ? 'Anonymous' : f.sender, anonymous: f.anon },
          ...(f.msg ? { gift_message: f.msg } : {}),
          currency: 'LKR',
        }),
      })
      const data = await res.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const o = data?.order as any
      if (data?.ok && o?.checkout_url) {
        onPlaced({
          ref: o.order_ref ?? simulatedOrder().ref,
          url: o.checkout_url,
          city: f.city, date: dates.find((d) => d.iso === f.date),
          rate: o.summary?.delivery_fee ?? cityObj.rate,
          recipient: f.name, phone: f.phone, address: f.address, notes: f.notes,
          sender: f.anon ? 'Anonymous' : f.sender, msg: f.msg,
          items,
          subtotal: o.summary?.items_total ?? subtotal,
          total: o.summary?.grand_total ?? (subtotal + cityObj.rate),
          perishable: hasPerishable,
        })
        return
      }
      // Real order failed — fall back to the simulated flow so the demo always completes.
      console.warn('[checkout] real order failed, using simulated order:', data?.error)
      onPlaced(simulatedOrder())
    } catch (err) {
      console.warn('[checkout] order request error, using simulated order:', err)
      onPlaced(simulatedOrder())
    } finally {
      setPlacing(false)
    }
  }

  const selDate = dates.find((d) => d.iso === f.date)

  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(36,21,68,0.45)', backdropFilter:'blur(3px)', animation:'kapri-up .3s var(--ease-out)' }}>
      <div className="kapri-modal" style={{ width:'100%', maxWidth:540, height:'100%', display:'flex',
        flexDirection:'column', background:'var(--surface)', overflow:'hidden', boxShadow:'var(--shadow-xl)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 16px', background:'var(--purple-700)', color:'#fff' }}>
          {step > 0
            ? <button onClick={() => setStep(step - 1)} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', padding:2 }}><Ico name="chevron-left" size={22} /></button>
            : <Ico name="bag" size={20} color="var(--yellow-400)" />}
          <div style={{ flex:1 }}>
            <p style={{ margin:0, fontWeight:700, fontSize:16 }}>Checkout</p>
            <p style={{ margin:'1px 0 0', fontSize:11.5, color:'rgba(255,255,255,0.65)' }}>Step {step + 1} of 4 · {steps[step]}</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', padding:4 }}>
            <Ico name="x" size={20} />
          </button>
        </div>
        {/* Progress bar */}
        <div style={{ display:'flex', gap:4, padding:'10px 16px', background:'#fff', borderBottom:'1px solid var(--line)' }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex:1, height:4, borderRadius:999, background: i <= step ? 'var(--purple-700)' : 'var(--line)', transition:'background .3s' }} />
          ))}
        </div>

        <div className="scrollbar-hide" style={{ flex:1, overflowY:'auto', padding:18, display:'flex', flexDirection:'column', gap:16 }}>
          {step === 0 && (
            <>
              <Field label="Recipient name" icon="user">
                <input value={f.name} onChange={(e) => set('name', e.target.value)} onBlur={() => onBlur('name')} placeholder="Who is this for?" 
                  style={{ ...inp, borderColor: touched.name && !isNameValid ? '#e11d48' : 'var(--line)' }} />
                {touched.name && !isNameValid && <p style={{ margin:'4px 0 0', fontSize:11, color:'#e11d48' }}>Please enter a valid name (at least 2 characters).</p>}
              </Field>
              <Field label="Recipient phone" icon="phone">
                <input value={f.phone} onChange={(e) => set('phone', e.target.value)} onBlur={() => onBlur('phone')} placeholder="07X XXX XXXX" inputMode="tel" 
                  style={{ ...inp, borderColor: touched.phone && !isPhoneValid ? '#e11d48' : 'var(--line)' }} />
                {touched.phone && !isPhoneValid && <p style={{ margin:'4px 0 0', fontSize:11, color:'#e11d48' }}>Must be a valid Sri Lankan mobile number (e.g., 0771234567).</p>}
              </Field>
              <p style={{ margin:0, fontSize:12, color:'var(--muted)', lineHeight:1.5 }}>We&apos;ll only use this to coordinate delivery — Sri Lankan numbers (07X… or +947X…).</p>
            </>
          )}
          {step === 1 && (
            <>
              <div>
                <label style={lbl}><Ico name="pin" size={14} color="var(--purple-700)" /> Delivery city</label>
                <div style={{ position:'relative' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, ...inp, padding:'0 12px' }}>
                    <Ico name="search" size={15} color="var(--muted)" />
                    <input value={cityQuery} onChange={(e) => setCityQuery(e.target.value)}
                      onBlur={() => { if (cityQuery !== f.city) setCityQuery(f.city) }}
                      placeholder="Search a Sri Lankan city…"
                      style={{ flex:1, border:'none', outline:'none', padding:'11px 0', fontSize:14, background:'transparent', fontFamily:'var(--font-sans)' }} />
                    <span style={{ fontSize:12, fontWeight:700, color:'var(--purple-700)', whiteSpace:'nowrap' }}>{LKR(cityObj.rate)}</span>
                  </div>
                  {cityMatches.length > 0 && (
                    <div style={{ position:'absolute', top:'100%', left:0, right:0, marginTop:4, background:'#fff',
                      border:'1px solid var(--line)', borderRadius:'var(--radius-md)', boxShadow:'var(--shadow-lg)', zIndex:5, overflow:'hidden' }}>
                      {cityMatches.map((c) => (
                        <button key={c.name} type="button" onMouseDown={(e) => { e.preventDefault(); set('city', c.name); set('date', ''); setCityQuery(c.name) }}
                          style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                            padding:'10px 13px', border:'none', borderBottom:'1px solid var(--line)', background:'#fff',
                            cursor:'pointer', fontFamily:'var(--font-sans)', fontSize:13.5, color:'var(--ink)' }}>
                          <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <Ico name="pin" size={13} color="var(--purple-400)" /> {c.name}
                            {c.slow && <span style={{ fontSize:11, color:'var(--warn)' }}> · 2-day lead</span>}
                          </span>
                          <span style={{ fontSize:12, color:'var(--muted)' }}>{LKR(c.rate)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p style={{ margin:'6px 0 0', fontSize:11, color:'var(--muted)' }}>We deliver to {CITIES.length}+ cities island-wide — type to find yours.</p>
              </div>

              <Field label="Delivery address" icon="bag">
                <textarea value={f.address} onChange={(e) => set('address', e.target.value)} onBlur={() => onBlur('address')} rows={2}
                  placeholder="House / building no, street, area" className="sinhala-text"
                  style={{ ...inp, resize:'none', borderColor: touched.address && !isAddressValid ? '#e11d48' : 'var(--line)' }} />
                {touched.address && !isAddressValid && <p style={{ margin:'4px 0 0', fontSize:11, color:'#e11d48' }}>Please enter a complete delivery address.</p>}
              </Field>
              <Field label="Delivery notes (optional)" icon="edit">
                <input value={f.notes} onChange={(e) => set('notes', e.target.value)}
                  placeholder="Landmark, gate code, best time…" className="sinhala-text" style={inp} />
              </Field>

              <div>
                <label style={lbl}><Ico name="calendar" size={14} color="var(--purple-700)" /> Delivery date</label>
                <div className="scrollbar-hide" style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
                  {dates.map((d) => (
                    <button key={d.iso} disabled={d.disabled} onClick={() => set('date', d.iso)}
                      style={{ flexShrink:0, width:56, padding:'9px 0', borderRadius:'var(--radius-md)',
                        border:`1.5px solid ${f.date === d.iso ? 'var(--purple-700)' : 'var(--line)'}`,
                        cursor: d.disabled ? 'not-allowed' : 'pointer', opacity: d.disabled ? 0.35 : 1,
                        background: f.date === d.iso ? 'var(--purple-700)' : '#fff',
                        color: f.date === d.iso ? '#fff' : 'var(--ink)',
                        display:'flex', flexDirection:'column', alignItems:'center', gap:1, fontFamily:'var(--font-sans)' }}>
                      <span style={{ fontSize:10, opacity:.7 }}>{d.label}</span>
                      <span style={{ fontSize:17, fontWeight:700 }}>{d.day}</span>
                      <span style={{ fontSize:9.5, opacity:.7 }}>{d.mon}</span>
                    </button>
                  ))}
                </div>
                {cityObj.slow && (
                  <p style={{ margin:'8px 0 0', fontSize:11.5, color:'var(--warn)', display:'flex', alignItems:'center', gap:5 }}>
                    <Ico name="warn" size={13} color="var(--warn)" /> {f.city} needs a 2-day lead time — earliest dates are disabled.
                  </p>
                )}
              </div>

              {f.date && avail && (
                <div>
                  <label style={lbl}><Ico name="truck" size={14} color="var(--purple-700)" /> Availability &amp; rate</label>
                  <DeliveryStatus city={f.city}
                    date={selDate ? `${selDate.label} ${selDate.day} ${selDate.mon}` : ''}
                    available={avail.available} rate={avail.rate}
                    reason={avail.reason} nextDate={avail.nextDate} perishableWarning={avail.perishableWarning} />
                  {!avail.available && <p style={{ margin:'8px 0 0', fontSize:11.5, color:'var(--error)' }}>Pick another date to continue.</p>}
                </div>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <Field label="From (sender name)" icon="user">
                <input value={f.sender} onChange={(e) => set('sender', e.target.value)} onBlur={() => onBlur('sender')} placeholder="Your name"
                  disabled={f.anon} style={{ ...inp, opacity: f.anon ? .5 : 1, borderColor: !f.anon && touched.sender && !isSenderValid ? '#e11d48' : 'var(--line)' }} />
                {!f.anon && touched.sender && !isSenderValid && <p style={{ margin:'4px 0 0', fontSize:11, color:'#e11d48' }}>Please enter your name, or choose to send anonymously.</p>}
              </Field>
              <label style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer', fontSize:13.5, color:'var(--ink)' }}>
                <input type="checkbox" checked={f.anon} onChange={(e) => set('anon', e.target.checked)}
                  style={{ width:17, height:17, accentColor:'var(--purple-700)' }} />
                Send as a secret admirer 🤫 (anonymous)
              </label>
              <div>
                <label style={lbl}><Ico name="gift" size={14} color="var(--purple-700)" /> Gift message</label>
                <GiftMessageEditor value={f.msg} lang={lang} onChange={(v) => set('msg', v)} />
              </div>
            </>
          )}
          {step === 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {items.map((it) => (
                <div key={it.p.id} style={{ display:'flex', gap:11, alignItems:'center' }}>
                  <img src={it.p.img} alt={it.p.name} style={{ width:46, height:46, borderRadius:'var(--radius-md)', objectFit:'cover' }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:0, fontSize:13, fontWeight:500, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.p.name}</p>
                    <p style={{ margin:'2px 0 0', fontSize:12, color:'var(--muted)' }}>Qty {it.qty}{it.icing ? ` · ✍️ "${it.icing}"` : ''}</p>
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--ink)' }}>{LKR(it.p.price * it.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop:'1px solid var(--line)', paddingTop:12, display:'flex', flexDirection:'column', gap:7 }}>
                <Summary l="Items" v={LKR(subtotal)} />
                <Summary l={`Delivery to ${f.city} (flat)`} v={LKR(cityObj.rate)} />
                <div style={{ display:'flex', justifyContent:'space-between', paddingTop:7, borderTop:'1px solid var(--line)' }}>
                  <span style={{ fontWeight:700, color:'var(--ink)' }}>Total</span>
                  <span style={{ fontWeight:700, fontSize:19, color:'var(--purple-700)' }}>{LKR(subtotal + cityObj.rate)}</span>
                </div>
              </div>
              <div style={{ padding:'11px 13px', background:'#fff', borderRadius:'var(--radius-md)', border:'1px solid var(--line)', fontSize:12.5, color:'var(--muted)', lineHeight:1.6 }}>
                <div><strong style={{ color:'var(--ink)' }}>To:</strong> {f.name || '—'} · {f.phone}</div>
                <div><strong style={{ color:'var(--ink)' }}>Address:</strong> {f.address || '—'}, {f.city}</div>
                {f.notes && <div><strong style={{ color:'var(--ink)' }}>Notes:</strong> {f.notes}</div>}
                {selDate && <div><strong style={{ color:'var(--ink)' }}>Date:</strong> {selDate.label} {selDate.day} {selDate.mon}</div>}
                <div><strong style={{ color:'var(--ink)' }}>From:</strong> {f.anon ? 'Anonymous 🤫' : (f.sender || '—')}</div>
                {f.msg && <div className="sinhala-text" style={{ marginTop:4, fontStyle:'italic' }}>&ldquo;{f.msg}&rdquo;</div>}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding:16, borderTop:'1px solid var(--line)', background:'#fff' }}>
          {step < 3 ? (
            <button onClick={() => canNext && setStep(step + 1)} disabled={!canNext}
              style={{ width:'100%', padding:'13px', borderRadius:'var(--radius-md)', border:'none',
                background:'var(--purple-700)', color:'#fff', fontWeight:600, fontSize:15,
                cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : .45,
                fontFamily:'var(--font-sans)', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
              Continue <Ico name="arrow-right" size={16} />
            </button>
          ) : (
            <button onClick={place} disabled={placing}
              style={{ width:'100%', padding:'14px', borderRadius:'var(--radius-md)', border:'none',
                background:'var(--yellow-400)', color:'var(--purple-700)', fontWeight:700, fontSize:16,
                cursor: placing ? 'wait' : 'pointer', opacity: placing ? .6 : 1,
                fontFamily:'var(--font-sans)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Ico name="check-circle" size={18} /> {placing ? 'Placing order…' : `Place order — ${LKR(subtotal + cityObj.rate)}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
