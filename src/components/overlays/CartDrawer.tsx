'use client'
import React from 'react'
import { Ico } from '../ui/Icons'
import { LKR } from '@/lib/data'
import type { CartItem, Lang } from '@/lib/types'

const qbtn: React.CSSProperties = { width:25, height:25, borderRadius:8, background:'#fff', border:'1px solid var(--line)',
  display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--ink)' }

interface CartDrawerProps {
  open: boolean
  items: CartItem[]
  giftMessage: string
  onClose: () => void
  onQty: (id: string, d: number) => void
  onRemove: (id: string) => void
  onIcing: (id: string, v: string) => void
  onCheckout: () => void
  lang: Lang
}

export function CartDrawer({ open, items, giftMessage, onClose, onQty, onRemove, onIcing, onCheckout }: CartDrawerProps) {
  const subtotal = items.reduce((s, i) => s + i.p.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', backdropFilter:'blur(2px)',
        zIndex:40, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition:'opacity .3s' }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'100%', maxWidth:380, background:'#fff', zIndex:50,
        display:'flex', flexDirection:'column', boxShadow:'var(--shadow-xl)',
        transform: open ? 'translateX(0)' : 'translateX(100%)', transition:'transform .4s var(--ease-out)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'15px 18px',
          background:'var(--purple-700)', color:'#fff' }}>
          <span style={{ display:'flex', alignItems:'center', gap:8, fontWeight:600, fontSize:17 }}>
            <Ico name="bag" size={20} /> Your Cart{count > 0 && ` (${count})`}
          </span>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', padding:6 }}>
            <Ico name="x" size={20} />
          </button>
        </div>

        <div className="scrollbar-hide" style={{ flex:1, overflowY:'auto', padding:14, display:'flex', flexDirection:'column', gap:11 }}>
          {items.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:12, color:'var(--muted)' }}>
              <Ico name="bag" size={54} color="var(--purple-200)" />
              <p style={{ margin:0, fontWeight:500, fontSize:14 }}>Your cart is empty</p>
              <p style={{ margin:0, fontSize:12.5, textAlign:'center', maxWidth:190 }}>Ask Kapri to find something special for you! 🎁</p>
            </div>
          ) : items.map((it) => {
            const isCake = it.p.id.toUpperCase().includes('CAKE')
            return (
              <div key={it.p.id} style={{ display:'flex', flexDirection:'column', gap:8, background:'var(--surface)',
                borderRadius:'var(--radius-lg)', padding:11, boxShadow:'var(--shadow-sm)' }}>
                <div style={{ display:'flex', gap:11 }}>
                  <img src={it.p.img} alt={it.p.name} style={{ width:60, height:60, borderRadius:'var(--radius-md)', objectFit:'cover', flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:0, fontSize:13.5, fontWeight:500, color:'var(--ink)', lineHeight:1.3,
                      display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{it.p.name}</p>
                    <p style={{ margin:'3px 0 0', fontSize:13.5, fontWeight:700, color:'var(--purple-700)' }}>{LKR(it.p.price)}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                      <button onClick={() => onQty(it.p.id, -1)} style={qbtn}><Ico name="minus" size={12} /></button>
                      <span style={{ fontSize:13.5, fontWeight:600, width:18, textAlign:'center' }}>{it.qty}</span>
                      <button onClick={() => onQty(it.p.id, 1)} style={qbtn}><Ico name="plus" size={12} /></button>
                      <button onClick={() => onRemove(it.p.id)} style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--muted)', cursor:'pointer', padding:2 }}>
                        <Ico name="trash" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                {isCake && (
                  <input value={it.icing || ''} onChange={(e) => onIcing(it.p.id, e.target.value)}
                    maxLength={120} placeholder="✍️ Message on cake (optional)" className="sinhala-text"
                    style={{ width:'100%', fontSize:12, borderRadius:'var(--radius-md)', border:'1px solid var(--line)',
                      padding:'7px 11px', outline:'none', background:'#fff', fontFamily:'var(--font-sans)', boxSizing:'border-box' }} />
                )}
              </div>
            )
          })}
          {items.length > 0 && giftMessage && (
            <div style={{ display:'flex', gap:8, alignItems:'flex-start', padding:'10px 12px', background:'var(--purple-50)',
              borderRadius:'var(--radius-md)', border:'1px dashed var(--purple-200)' }}>
              <Ico name="gift" size={15} color="var(--purple-700)" style={{ marginTop:1 }} />
              <p className="sinhala-text" style={{ margin:0, fontSize:12, color:'var(--ink)', fontStyle:'italic', lineHeight:1.45 }}>
                &ldquo;{giftMessage}&rdquo;
              </p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding:16, borderTop:'1px solid var(--line)', display:'flex', flexDirection:'column', gap:11 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ color:'var(--muted)', fontSize:14 }}>Subtotal</span>
              <span style={{ fontWeight:700, color:'var(--purple-700)', fontSize:18 }}>{LKR(subtotal)}</span>
            </div>
            <p style={{ margin:0, fontSize:11.5, color:'var(--muted)' }}>Flat delivery fee per order — calculated at checkout</p>
            <button onClick={onCheckout} style={{ width:'100%', padding:'13px', borderRadius:'var(--radius-md)', border:'none',
              background:'var(--purple-700)', color:'#fff', fontWeight:600, fontSize:15, cursor:'pointer',
              fontFamily:'var(--font-sans)', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
              Checkout with Kapri <Ico name="arrow-right" size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
