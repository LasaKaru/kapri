'use client'
import React, { useState } from 'react'
import { Ico } from './Icons'
import type { Season } from '@/lib/types'

interface SeasonBannerProps {
  season: Season
  onShop: (q: string) => void
}

export function SeasonBanner({ season, onShop }: SeasonBannerProps) {
  const [show, setShow] = useState(() => {
    try { return sessionStorage.getItem('kapri_season_x_' + season.key) !== '1' } catch { return true }
  })
  if (!show) return null
  const dismiss = () => {
    setShow(false)
    try { sessionStorage.setItem('kapri_season_x_' + season.key, '1') } catch {}
  }
  return (
    <div style={{ display:'flex', justifyContent:'center', padding:'8px 16px 0', flexShrink:0 }}>
      <div style={{
        width:'100%', maxWidth:820,
        display:'flex', alignItems:'center', gap:12,
        padding:'10px 18px',
        background:'var(--yellow-300)',
        borderRadius:12,
      }}>
        <span style={{ fontSize:22, lineHeight:1 }}>{season.emoji}</span>
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:1 }}>
          <span style={{ fontSize:14, fontWeight:700, color:'var(--purple-900)', lineHeight:1.3 }}>{season.greeting}</span>
          <span className="kapri-hide-sm" style={{ fontSize:12, color:'var(--purple-800)', opacity:.75, lineHeight:1.3 }}>{season.sub}</span>
        </div>
        <button onClick={() => onShop(season.q)}
          style={{ flexShrink:0, display:'flex', alignItems:'center', gap:6, padding:'7px 16px', borderRadius:999,
            background:'var(--purple-700)', color:'#fff', border:'none', fontSize:12.5, fontWeight:600,
            cursor:'pointer', fontFamily:'var(--font-sans)' }}>
          {season.cta} <Ico name="arrow-right" size={14} />
        </button>
        <button onClick={dismiss} aria-label="Dismiss"
          style={{ flexShrink:0, background:'none', border:'none', cursor:'pointer', color:'var(--purple-700)', padding:4, display:'flex', opacity:.7 }}>
          <Ico name="x" size={16} />
        </button>
      </div>
    </div>
  )
}
