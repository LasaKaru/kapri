'use client'
import React, { useState } from 'react'
import { Ico } from '../ui/Icons'
import { LKR, CAT_BLURB } from '@/lib/data'
import type { Product } from '@/lib/types'

function Pill({ tone, children }: { tone: 'purple'|'success'|'warn'; children: React.ReactNode }) {
  const t = {
    purple:  { background:'rgba(68,42,115,0.82)', color:'#fff', backdropFilter:'blur(4px)' },
    success: { background:'rgba(31,157,87,0.92)', color:'#fff' },
    warn:    { background:'rgba(217,138,0,0.92)', color:'#fff' },
  }[tone]
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, fontWeight:600, lineHeight:1, padding:'4px 8px', borderRadius:999, whiteSpace:'nowrap', ...t }}>{children}</span>
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', gap:12, padding:'9px 0', borderBottom:'1px solid var(--line)' }}>
      <span style={{ fontSize:12.5, color:'var(--muted)' }}>{label}</span>
      <span style={{ fontSize:12.5, fontWeight:600, color:'var(--ink)', textAlign:'right' }}>{value}</span>
    </div>
  )
}

interface ProductDetailProps {
  p: Product
  inCart: boolean
  onAdd: (p: Product, qty: number, icing?: string) => void
  onClose: () => void
  isFavorite?: boolean
  onToggleFavorite?: (p: Product) => void
}

export function ProductDetail({ p, inCart, onAdd, onClose, isFavorite, onToggleFavorite }: ProductDetailProps) {
  const [qty, setQty] = useState(1)
  const [icing, setIcing] = useState('')
  const [imgErr, setImgErr] = useState(false)
  const [added, setAdded] = useState(false)

  const isCake = p.id.toUpperCase().includes('CAKE')
  const hasDisc = !!(p.was && p.was > p.price)
  const pct = hasDisc ? Math.round((1 - p.price / p.was!) * 100) : 0
  const lowStock = p.low && !p.perishable
  const availability = p.perishable ? 'Made fresh to order' : lowStock ? 'Low stock — order soon' : 'In stock'

  const add = () => {
    onAdd(p, qty, isCake ? icing : undefined)
    setAdded(true)
    setTimeout(() => { setAdded(false); onClose() }, 700)
  }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'center',
      justifyContent:'center', background:'rgba(36,21,68,0.45)', backdropFilter:'blur(3px)',
      animation:'kapri-up .3s var(--ease-out)' }}>
      <div className="kapri-modal" onClick={(e) => e.stopPropagation()}
        style={{ width:'100%', maxWidth:540, height:'100%', display:'flex', flexDirection:'column',
          background:'var(--surface)', overflow:'hidden', boxShadow:'var(--shadow-xl)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px',
          background:'var(--purple-700)', color:'#fff' }}>
          <p style={{ margin:0, fontWeight:700, fontSize:16, display:'flex', alignItems:'center', gap:8 }}>
            <Ico name="search" size={17} color="var(--yellow-400)" /> Product details
          </p>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', padding:4 }}>
            <Ico name="x" size={20} />
          </button>
        </div>

        <div className="scrollbar-hide" style={{ flex:1, overflowY:'auto' }}>
          <div style={{ position:'relative', height:300, background:'var(--purple-50)' }}>
            {!imgErr
              ? <img src={p.img} alt={p.name} onError={() => setImgErr(true)}
                  style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:64 }}>🎁</div>}
            <div style={{ position:'absolute', top:12, left:12, display:'flex', gap:6, alignItems:'flex-start' }}>
              <Pill tone="purple">{p.cat}</Pill>
              <button onClick={(e) => { e.stopPropagation(); if(onToggleFavorite) onToggleFavorite(p) }} aria-label="Toggle favorite"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', width:30, height:30, borderRadius:'50%', border:'none', cursor:'pointer', background:'rgba(255,255,255,0.85)', color: isFavorite ? 'var(--error)' : 'var(--muted)', boxShadow:'var(--shadow-sm)', transition:'transform .2s', transform: isFavorite ? 'scale(1.1)' : 'none' }}>
                <Ico name={isFavorite ? 'heart-filled' : 'heart'} size={16} />
              </button>
            </div>
            <div style={{ position:'absolute', top:12, right:12, display:'flex', flexDirection:'column', gap:5, alignItems:'flex-end' }}>
              {lowStock && <Pill tone="warn">Low Stock</Pill>}
              {hasDisc && <Pill tone="success">-{pct}% OFF</Pill>}
            </div>
          </div>

          <div style={{ padding:18, display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <h2 className="sinhala-text" style={{ margin:0, fontSize:20, fontWeight:700, color:'var(--ink)', lineHeight:1.3 }}>{p.name}</h2>
              <span style={{ display:'inline-block', marginTop:7, fontFamily:'var(--font-mono)', fontSize:11, color:'var(--muted)',
                background:'#fff', border:'1px solid var(--line)', borderRadius:7, padding:'3px 8px' }}>{p.id}</span>
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
              <span style={{ fontWeight:700, fontSize:26, color:'var(--purple-700)' }}>{LKR(p.price)}</span>
              {hasDisc && <span style={{ fontSize:15, color:'var(--muted)', textDecoration:'line-through' }}>{LKR(p.was!)}</span>}
              {hasDisc && <span style={{ fontSize:12, fontWeight:700, color:'var(--success)' }}>Save {LKR(p.was! - p.price)}</span>}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color: p.perishable ? 'var(--warn)' : 'var(--success)', fontWeight:600 }}>
              <Ico name={p.perishable ? 'clock' : 'check-circle'} size={16} color={p.perishable ? 'var(--warn)' : 'var(--success)'} /> {availability}
            </div>
            <p className="sinhala-text" style={{ margin:0, fontSize:13.5, lineHeight:1.6, color:'var(--ink)' }}>
              {p.summary} {CAT_BLURB[p.cat] || ''}
            </p>
            <div>
              <p style={{ margin:'0 0 2px', fontSize:11, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--muted)' }}>Details</p>
              <SpecRow label="Category" value={p.cat} />
              <SpecRow label="Product ID" value={p.id} />
              <SpecRow label="Availability" value={availability} />
              {isCake && <SpecRow label="Size" value="1 kg (serves ~8)" />}
              <SpecRow label="Delivery" value="Island-wide · flat fee per order" />
              <SpecRow label="Personalisation" value={isCake ? 'Icing message (≤120 chars)' : 'Free gift message at checkout'} />
            </div>
            {p.perishable && (
              <div style={{ display:'flex', gap:8, padding:'10px 12px', borderRadius:'var(--radius-md)', background:'var(--warn-tint)', border:'1px solid var(--yellow-200)' }}>
                <Ico name="warn" size={15} color="var(--warn)" style={{ marginTop:1 }} />
                <p style={{ margin:0, fontSize:12, lineHeight:1.5, color:'#92400E' }}>Fresh item — prepared on the delivery day. Choose a date 1–2 days ahead and make sure someone can receive it.</p>
              </div>
            )}
            {isCake && (
              <div>
                <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:'var(--ink)', marginBottom:7 }}>
                  <Ico name="edit" size={14} color="var(--purple-700)" /> Message on cake (optional)
                </label>
                <input value={icing} onChange={(e) => setIcing(e.target.value)} maxLength={120}
                  placeholder="e.g. Happy Birthday Amma! 🎂" className="sinhala-text"
                  style={{ width:'100%', borderRadius:'var(--radius-md)', border:'1px solid var(--line)',
                    padding:'10px 12px', fontSize:13.5, outline:'none', background:'#fff',
                    fontFamily:'var(--font-sans)', boxSizing:'border-box' }} />
              </div>
            )}
          </div>
        </div>

        <div style={{ padding:16, borderTop:'1px solid var(--line)', background:'#fff', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, border:'1px solid var(--line)', borderRadius:'var(--radius-md)', padding:'6px 10px' }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink)', display:'flex' }}>
              <Ico name="minus" size={15} />
            </button>
            <span style={{ fontSize:15, fontWeight:700, width:18, textAlign:'center' }}>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink)', display:'flex' }}>
              <Ico name="plus" size={15} />
            </button>
          </div>
          <button onClick={add} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px',
            borderRadius:'var(--radius-md)', border:'none',
            background: added ? 'var(--success)' : 'var(--purple-700)', color:'#fff', fontWeight:700, fontSize:15,
            cursor:'pointer', fontFamily:'var(--font-sans)' }}>
            <Ico name={added ? 'check' : 'cart'} size={17} />
            {added ? 'Added to cart!' : `Add ${qty} · ${LKR(p.price * qty)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
