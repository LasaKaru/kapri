'use client'
import React, { useState } from 'react'
import { Ico } from '../ui/Icons'
import { LKR } from '@/lib/data'
import type { Product } from '@/lib/types'

function Pill({ tone, children }: { tone: 'purple'|'accent'|'success'|'warn'|'ink'; children: React.ReactNode }) {
  const t = {
    purple:  { background:'rgba(68,42,115,0.82)', color:'#fff', backdropFilter:'blur(4px)' },
    accent:  { background:'var(--yellow-400)', color:'var(--purple-700)', fontWeight:700 },
    success: { background:'rgba(31,157,87,0.92)', color:'#fff' },
    warn:    { background:'rgba(217,138,0,0.92)', color:'#fff' },
    ink:     { background:'rgba(27,18,48,0.72)', color:'#fff', backdropFilter:'blur(4px)' },
  }[tone]
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, fontWeight:600, lineHeight:1,
      padding:'4px 8px', borderRadius:999, whiteSpace:'nowrap', ...t }}>
      {children}
    </span>
  )
}

export interface ProductCardProps {
  p: Product
  inCart: boolean
  onAdd: (p: Product) => void
  onOpen: (p: Product) => void
  isFavorite?: boolean
  onToggleFavorite?: (p: Product) => void
}

export function ProductCard({ p, inCart, onAdd, onOpen, isFavorite, onToggleFavorite }: ProductCardProps) {
  const [hover, setHover] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const [added, setAdded] = useState(false)
  const hasDisc = !!(p.was && p.was > p.price)
  const pct = hasDisc ? Math.round((1 - p.price / p.was!) * 100) : 0
  const lowStock = p.low || (p.id.charCodeAt(p.id.length - 1) % 3 === 0)

  const add = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAdded(true)
    onAdd(p)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width:210, flexShrink:0, display:'flex', flexDirection:'column', background:'#fff',
        border:'1px solid var(--line)', borderRadius:'var(--radius-lg)', overflow:'hidden',
        boxShadow: hover ? '0 12px 28px rgba(68,42,115,.20)' : 'var(--shadow-card)',
        transform: hover ? 'translateY(-3px)' : 'none', transition:'all .25s var(--ease-out)', scrollSnapAlign:'start' }}>
      <div onClick={() => onOpen(p)} title="View details"
        style={{ position:'relative', height:188, background:'var(--purple-50)', overflow:'hidden', cursor:'pointer' }}>
        {!imgErr && p.img
          ? <img
              src={p.img.startsWith('http') ? p.img : `/api/product-image?url=${encodeURIComponent(p.url || '')}`}
              alt={p.name}
              onError={() => setImgErr(true)}
              style={{ width:'100%', height:'100%', objectFit:'cover',
                transform: hover ? 'scale(1.05)' : 'none', transition:'transform .4s var(--ease-out)' }} />
          : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:46 }}>🎁</div>}
        <div style={{ position:'absolute', top:8, left:8, display:'flex', gap:6, alignItems:'flex-start' }}>
          <Pill tone="purple">{p.cat}</Pill>
          {isFavorite !== undefined && (
            <button onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(p) }} aria-label="Toggle favorite"
              style={{ display:'flex', alignItems:'center', justifyContent:'center', width:26, height:26, borderRadius:'50%', border:'none', cursor:'pointer', background:'rgba(255,255,255,0.85)', color: isFavorite ? 'var(--error)' : 'var(--muted)', boxShadow:'var(--shadow-sm)', transition:'transform .2s', transform: isFavorite ? 'scale(1.1)' : 'none' }}>
              <Ico name={isFavorite ? 'heart-filled' : 'heart'} size={14} />
            </button>
          )}
        </div>
        <div style={{ position:'absolute', top:8, right:8, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
          {hasDisc && <Pill tone="success">-{pct}%</Pill>}
        </div>
      </div>

      {lowStock && (
        <div style={{ padding: '8px 12px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--error)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Almost Gone</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)' }}>Only {p.id.charCodeAt(p.id.length - 1) % 5 + 1} left!</span>
          </div>
          <div style={{ height: 4, background: 'var(--line)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              borderRadius: 2,
              '--final-width': `${(p.id.charCodeAt(p.id.length - 1) % 5 + 1) * 15}%`,
              animation: 'kapri-shrink-bar 1.5s var(--ease-out) forwards'
            } as React.CSSProperties} />
          </div>
        </div>
      )}

      <div style={{ padding:12, display:'flex', flexDirection:'column', gap:7, flex:1 }}>
        <p onClick={() => onOpen(p)} style={{ margin:0, fontWeight:600, fontSize:13.5, lineHeight:1.35, color:'var(--ink)', cursor:'pointer',
          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.name}</p>
        <p style={{ margin:0, fontSize:11, lineHeight:1.45, color:'var(--muted)', display:'-webkit-box', WebkitLineClamp:2,
          WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.summary}</p>
        <span style={{ alignSelf:'flex-start', fontFamily:'var(--font-mono)', fontSize:9.5, color:'var(--muted)',
          background:'var(--surface)', border:'1px solid var(--line)', borderRadius:7, padding:'2px 6px' }}>{p.id}</span>
        <div style={{ display:'flex', alignItems:'baseline', gap:7 }}>
          <span style={{ fontWeight:700, fontSize:15.5, color:'var(--purple-700)' }}>{LKR(p.price)}</span>
          {hasDisc && <span style={{ fontSize:12, color:'var(--muted)', textDecoration:'line-through' }}>{LKR(p.was!)}</span>}
        </div>
        <div style={{ display:'flex', gap:6, marginTop:'auto', paddingTop:3 }}>
          <button onClick={add} style={{ flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
            padding:'8px 0', borderRadius:'var(--radius-md)', border:'none', fontSize:12, fontWeight:600,
            fontFamily:'var(--font-sans)', cursor:'pointer', color:'#fff',
            background: added ? 'var(--success)' : inCart ? 'var(--purple-500)' : 'var(--purple-700)', transition:'background .15s' }}>
            <Ico name={added ? 'check' : 'cart'} size={14} />
            {added ? 'Added!' : inCart ? 'Add again' : 'Add to Cart'}
          </button>
          <button onClick={() => onOpen(p)} title="View details"
            style={{ width:34, height:34, flexShrink:0, display:'inline-flex', alignItems:'center', justifyContent:'center',
              borderRadius:'var(--radius-md)', background:'var(--surface)', border:'1px solid var(--line)',
              color:'var(--muted)', cursor:'pointer' }}>
            <Ico name="search" size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
