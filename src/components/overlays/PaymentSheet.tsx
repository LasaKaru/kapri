'use client'
import React, { useState } from 'react'
import { Ico } from '../ui/Icons'
import type { OrderData } from '@/lib/types'

const inp: React.CSSProperties = { width:'100%', borderRadius:'var(--radius-md)', border:'1px solid var(--line)',
  padding:'11px 13px', fontSize:14, color:'var(--ink)', background:'#fff', outline:'none',
  fontFamily:'var(--font-sans)', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:'var(--ink)', marginBottom:8 }

interface PaymentSheetProps {
  order: OrderData
  onClose: () => void
  onPaid: (o: OrderData) => void
}

export function PaymentSheet({ order, onClose, onPaid }: PaymentSheetProps) {
  const [method, setMethod] = useState<'card'|'account'>('card')
  const [num, setNum] = useState('')
  const [name, setName] = useState('')
  const [exp, setExp] = useState('')
  const [cvv, setCvv] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [phase, setPhase] = useState<'form'|'processing'|'done'>('form')

  const fmtNum = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const fmtExp = (v: string) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length > 2 ? d.slice(0,2)+'/'+d.slice(2) : d }

  const validCard = num.replace(/\s/g,'').length >= 15 && name.trim().length > 0 && exp.length === 5 && cvv.length >= 3
  const validAccount = (/\S+@\S+\.\S+/.test(email) || /\d{9,}/.test(email)) && pw.length >= 4
  const valid = method === 'card' ? validCard : validAccount

  const pay = () => {
    if (!valid) return
    setPhase('processing')
    setTimeout(() => { setPhase('done'); setTimeout(() => onPaid(order), 1300) }, method === 'account' ? 1400 : 1700)
  }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:70, display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(36,21,68,0.5)', backdropFilter:'blur(3px)', animation:'kapri-up .3s var(--ease-out)' }}>
      <div onClick={(e) => e.stopPropagation()} className="kapri-modal"
        style={{ width:'100%', maxWidth:440, height:'100%', display:'flex', flexDirection:'column',
          background:'var(--surface)', overflow:'hidden', boxShadow:'var(--shadow-xl)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'var(--purple-700)', color:'#fff' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kapruka-logo.jpg" alt="Kapruka" style={{ height:22, borderRadius:4 }} />
            <span style={{ fontSize:13, fontWeight:600 }}>Secure Checkout</span>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', padding:4 }}>
            <Ico name="x" size={20} />
          </button>
        </div>

        {phase === 'done' ? (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:16, padding:24, textAlign:'center' }}>
            <div style={{ width:72, height:72, borderRadius:999, background:'var(--success)', display:'flex',
              alignItems:'center', justifyContent:'center', animation:'kapri-pop .4s var(--ease-spring)' }}>
              <Ico name="check" size={38} color="#fff" />
            </div>
            <div>
              <h2 style={{ margin:0, fontSize:21, fontWeight:700, color:'var(--ink)' }}>Payment successful! 🎉</h2>
              <p style={{ margin:'8px 0 0', fontSize:13.5, color:'var(--muted)', lineHeight:1.5 }}>
                Rs. {Number(order.total).toLocaleString('en-LK')} paid. Your order is confirmed — a VIMP tracking number is on its way to your inbox.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="scrollbar-hide" style={{ flex:1, overflowY:'auto', padding:18, display:'flex', flexDirection:'column', gap:14 }}>
              {/* Amount */}
              <div style={{ background:'var(--purple-700)', borderRadius:'var(--radius-lg)', padding:'14px 16px', color:'#fff' }}>
                <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.7)' }}>Amount to pay · {order.ref}</p>
                <p style={{ margin:'3px 0 0', fontSize:26, fontWeight:700 }}>Rs. {Number(order.total).toLocaleString('en-LK')}</p>
              </div>

              {/* Method switcher */}
              <div style={{ display:'flex', gap:8, background:'var(--purple-100)', padding:4, borderRadius:'var(--radius-md)' }}>
                {([['card','cart','Pay by card'],['account','user','Kapruka account']] as [typeof method, string, string][]).map(([m, ic, label]) => (
                  <button key={m} onClick={() => setMethod(m)}
                    style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                      padding:'9px 6px', borderRadius:'var(--radius-sm)', border:'none', cursor:'pointer',
                      fontFamily:'var(--font-sans)', fontSize:13, fontWeight:600,
                      background: method === m ? '#fff' : 'transparent',
                      color: method === m ? 'var(--purple-700)' : 'var(--purple-500)',
                      boxShadow: method === m ? 'var(--shadow-sm)' : 'none', transition:'all .15s' }}>
                    <Ico name={ic} size={15} color={method === m ? 'var(--purple-700)' : 'var(--purple-500)'} /> {label}
                  </button>
                ))}
              </div>

              {method === 'card' ? (
                <>
                  {/* Card preview */}
                  <div style={{ background:'linear-gradient(120deg, var(--purple-600), var(--purple-800))', borderRadius:'var(--radius-lg)', padding:16, color:'#fff',
                    minHeight:92, display:'flex', flexDirection:'column', justifyContent:'space-between', boxShadow:'var(--shadow-md)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ width:34, height:24, borderRadius:4, background:'var(--yellow-400)' }} />
                      <span style={{ fontSize:12, opacity:.8, fontWeight:600, letterSpacing:'.1em' }}>VISA</span>
                    </div>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:16, letterSpacing:'.12em' }}>{num || '•••• •••• •••• ••••'}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, opacity:.85 }}>
                      <span>{name.toUpperCase() || 'CARDHOLDER NAME'}</span>
                      <span>{exp || 'MM/YY'}</span>
                    </div>
                  </div>
                  <div>
                    <label style={lbl}><Ico name="cart" size={13} color="var(--purple-700)" /> Card number</label>
                    <input value={num} onChange={(e) => setNum(fmtNum(e.target.value))} inputMode="numeric" placeholder="4242 4242 4242 4242" style={inp} />
                  </div>
                  <div>
                    <label style={lbl}><Ico name="user" size={13} color="var(--purple-700)" /> Name on card</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="As printed on card" style={inp} />
                  </div>
                  <div style={{ display:'flex', gap:12 }}>
                    <div style={{ flex:1 }}>
                      <label style={lbl}>Expiry</label>
                      <input value={exp} onChange={(e) => setExp(fmtExp(e.target.value))} inputMode="numeric" placeholder="MM/YY" style={inp} />
                    </div>
                    <div style={{ flex:1 }}>
                      <label style={lbl}>CVV</label>
                      <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g,'').slice(0,4))} inputMode="numeric" placeholder="•••" style={inp} />
                    </div>
                  </div>
                  <p style={{ margin:0, fontSize:11, color:'var(--muted)', display:'flex', alignItems:'center', gap:5 }}>
                    <Ico name="check-circle" size={13} color="var(--success)" /> Demo only — no real card is charged. Use any test numbers.
                  </p>
                </>
              ) : (
                <>
                  <div style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', background:'var(--purple-50)',
                    borderRadius:'var(--radius-lg)', border:'1px solid var(--purple-100)' }}>
                    <div style={{ width:38, height:38, borderRadius:999, background:'var(--purple-700)', display:'flex',
                      alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Ico name="user" size={18} color="var(--yellow-400)" />
                    </div>
                    <div>
                      <p style={{ margin:0, fontSize:13.5, fontWeight:700, color:'var(--ink)' }}>Sign in to Kapruka</p>
                      <p style={{ margin:'2px 0 0', fontSize:11.5, color:'var(--muted)' }}>Your saved cards, addresses &amp; loyalty points apply automatically.</p>
                    </div>
                  </div>
                  <div>
                    <label style={lbl}><Ico name="user" size={13} color="var(--purple-700)" /> Email or mobile</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com or 07X XXX XXXX" style={inp} />
                  </div>
                  <div>
                    <label style={lbl}><Ico name="check-circle" size={13} color="var(--purple-700)" /> Password</label>
                    <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="Your Kapruka password" style={inp} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:11.5, color:'var(--purple-700)', fontWeight:600, cursor:'pointer' }}>Forgot password?</span>
                    <span style={{ fontSize:11.5, color:'var(--muted)' }}>New here? Create account</span>
                  </div>
                  <p style={{ margin:0, fontSize:11, color:'var(--muted)', display:'flex', alignItems:'center', gap:5 }}>
                    <Ico name="check-circle" size={13} color="var(--success)" /> Demo only — no real login. Enter any email &amp; password.
                  </p>
                </>
              )}
            </div>

            <div style={{ padding:16, borderTop:'1px solid var(--line)', background:'#fff' }}>
              <button onClick={pay} disabled={!valid || phase === 'processing'}
                style={{ width:'100%', padding:14, borderRadius:'var(--radius-md)', border:'none',
                  background:'var(--yellow-400)', color:'var(--purple-700)', fontWeight:700, fontSize:16,
                  cursor: valid ? 'pointer' : 'not-allowed', opacity: valid ? 1 : .5,
                  fontFamily:'var(--font-sans)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {phase === 'processing' ? (
                  <>
                    <span style={{ width:16, height:16, border:'2px solid rgba(68,42,115,.3)', borderTopColor:'var(--purple-700)',
                      borderRadius:999, animation:'kapri-spin .7s linear infinite' }} />
                    {method === 'account' ? 'Signing in…' : 'Processing…'}
                  </>
                ) : (
                  <>
                    <Ico name="check-circle" size={17} />
                    {method === 'account' ? 'Sign in & Pay' : 'Pay'} Rs. {Number(order.total).toLocaleString('en-LK')}
                  </>
                )}
              </button>
              <p style={{ margin:'9px 0 0', fontSize:11, color:'var(--muted)', textAlign:'center' }}>🔒 Secured by Kapruka Payments</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
