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
    try { return localStorage.getItem('kapri_season_x_' + season.key) !== '1' } catch { return true }
  })
  if (!show) return null
  const dismiss = () => {
    setShow(false)
    try { localStorage.setItem('kapri_season_x_' + season.key, '1') } catch {}
  }
  return (
    <div style={{ display:'flex', justifyContent:'center', background:'linear-gradient(90deg, var(--yellow-300), var(--yellow-400))', flexShrink:0 }}>
      <div style={{ width:'100%', maxWidth:1180, display:'flex', alignItems:'center', gap:12, padding:'8px 16px' }}>
        <span style={{ fontSize:20, lineHeight:1 }}>{season.emoji}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <span style={{ fontSize:13.5, fontWeight:700, color:'var(--purple-800)' }}>{season.greeting}</span>
          <span className="kapri-hide-sm" style={{ fontSize:12.5, color:'var(--purple-700)', marginLeft:8, opacity:.85 }}>{season.sub}</span>
        </div>
        <button onClick={() => onShop(season.q)}
          style={{ flexShrink:0, display:'flex', alignItems:'center', gap:6, padding:'6px 13px', borderRadius:999,
            background:'var(--purple-700)', color:'#fff', border:'none', fontSize:12.5, fontWeight:600,
            cursor:'pointer', fontFamily:'var(--font-sans)' }}>
          {season.cta} <Ico name="arrow-right" size={14} />
        </button>
        <button onClick={dismiss} aria-label="Dismiss"
          style={{ flexShrink:0, background:'none', border:'none', cursor:'pointer', color:'var(--purple-700)', padding:4, display:'flex' }}>
          <Ico name="x" size={16} />
        </button>
      </div>
    </div>
  )
}
