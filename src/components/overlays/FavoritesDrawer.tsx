'use client'
import React from 'react'
import { Ico } from '../ui/Icons'
import { LKR } from '@/lib/data'
import type { Product, Lang } from '@/lib/types'

interface FavoritesDrawerProps {
  open: boolean
  favorites: Product[]
  onClose: () => void
  onRemove: (p: Product) => void
  onAddToCart: (p: Product) => void
  lang: Lang
}

export function FavoritesDrawer({ open, favorites, onClose, onRemove, onAddToCart }: FavoritesDrawerProps) {
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
            <Ico name="heart-filled" size={20} /> Favorites{favorites.length > 0 && ` (${favorites.length})`}
          </span>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', padding:6 }}>
            <Ico name="x" size={20} />
          </button>
        </div>

        <div className="scrollbar-hide" style={{ flex:1, overflowY:'auto', padding:14, display:'flex', flexDirection:'column', gap:11 }}>
          {favorites.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:12, color:'var(--muted)' }}>
              <Ico name="heart" size={54} color="var(--purple-200)" />
              <p style={{ margin:0, fontWeight:500, fontSize:14 }}>No favorites yet</p>
              <p style={{ margin:0, fontSize:12.5, textAlign:'center', maxWidth:190 }}>Tap the heart icon on products you love! ❤️</p>
            </div>
          ) : favorites.map((p) => {
            return (
              <div key={p.id} style={{ display:'flex', gap:11, background:'var(--surface)',
                borderRadius:'var(--radius-lg)', padding:11, boxShadow:'var(--shadow-sm)' }}>
                <img src={p.img} alt={p.name} style={{ width:72, height:72, borderRadius:'var(--radius-md)', objectFit:'cover', flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
                  <p style={{ margin:0, fontSize:13.5, fontWeight:500, color:'var(--ink)', lineHeight:1.3,
                    display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.name}</p>
                  <p style={{ margin:'3px 0 0', fontSize:13.5, fontWeight:700, color:'var(--purple-700)' }}>{LKR(p.price)}</p>
                  <div style={{ display:'flex', gap:6, marginTop:'auto', paddingTop:6 }}>
                    <button onClick={() => onAddToCart(p)} style={{ flex:1, padding:'6px 0', borderRadius:'var(--radius-sm)', border:'none',
                      background:'var(--purple-700)', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                      Add to Cart
                    </button>
                    <button onClick={() => onRemove(p)} aria-label="Remove"
                      style={{ width:28, flexShrink:0, background:'none', border:'1px solid var(--line)', borderRadius:'var(--radius-sm)',
                        color:'var(--muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Ico name="trash" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
