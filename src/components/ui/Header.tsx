'use client'
import React from 'react'
import { Ico } from './Icons'
import type { Lang } from '@/lib/types'

interface HeaderProps {
  count: number
  onCart: () => void
  favoritesCount?: number
  onFavorites?: () => void
  lang: Lang
  onLang: () => void
  onLogoClick?: () => void
  onBack?: () => void
}

export function Header({ count, onCart, favoritesCount, onFavorites, lang, onLang, onLogoClick, onBack }: HeaderProps) {
  return (
    <header style={{ display:'flex', justifyContent:'center', padding:'11px 16px', background:'var(--purple-700)',
      boxShadow:'var(--shadow-lg)', zIndex:20, flexShrink:0, position:'relative' }}>
      <div style={{ width:'100%', maxWidth:1180, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {onBack && (
            <button onClick={onBack} aria-label="Go back" style={{ background:'rgba(255,255,255,0.15)', border:'none', width:32, height:32, borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', transition:'background .2s', marginRight: -4 }} onMouseEnter={(e) => e.currentTarget.style.background='rgba(255,255,255,0.25)'} onMouseLeave={(e) => e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
              <Ico name="chevron-left" size={18} />
            </button>
          )}
          <button onClick={() => { if(onLogoClick) onLogoClick(); else window.location.href='https://www.kapruka.com/'; }} 
            style={{ background:'none', border:'none', padding:0, cursor:'pointer', display:'flex' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kapruka-logo.jpg" alt="Kapruka" style={{ height:30, width:'auto', borderRadius:5 }} />
          </button>
          <div style={{ width:1, height:22, background:'rgba(255,255,255,0.2)' }} />
          <div>
            <div style={{ fontSize:12.5, color:'var(--yellow-400)', fontWeight:700, lineHeight:1 }}>Kapri</div>
            <div style={{ fontSize:9.5, color:'rgba(255,255,255,0.6)', lineHeight:1, marginTop:2, letterSpacing:'.02em' }}>AI Shopping Concierge</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={onLang} title="Switch language"
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 11px', borderRadius:'var(--radius-md)',
              background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:12, fontWeight:600,
              border:'none', cursor:'pointer', fontFamily:'var(--font-sans)' }}>
            <Ico name="globe" size={14} color="rgba(255,255,255,.8)" />
            {lang === 'en'
              ? <span>EN <span style={{ opacity:.55 }}>· සිං</span></span>
              : <span><span style={{ opacity:.55 }}>EN ·</span> සිං</span>}
          </button>
          {onFavorites && (
            <button onClick={onFavorites} aria-label="Favorites"
              style={{ position:'relative', width:40, height:40, display:'flex', alignItems:'center',
                justifyContent:'center', borderRadius:'var(--radius-md)', background:'rgba(255,255,255,0.1)',
                color:'#fff', border:'none', cursor:'pointer', transition:'background .2s' }}>
              <Ico name="heart" size={18} />
              {(favoritesCount || 0) > 0 && (
                <span style={{ position:'absolute', top:-6, right:-6, minWidth:19, height:19, padding:'0 4px',
                  background:'var(--error)', color:'#fff', fontSize:11, fontWeight:700,
                  borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'var(--shadow-sm)', animation:'kapri-pop .3s var(--ease-spring)' }}>
                  {favoritesCount}
                </span>
              )}
            </button>
          )}
          <button onClick={onCart} aria-label="Cart"
            style={{ position:'relative', width:40, height:40, display:'flex', alignItems:'center',
              justifyContent:'center', borderRadius:'var(--radius-md)', background:'rgba(255,255,255,0.1)',
              color:'#fff', border:'none', cursor:'pointer' }}>
            <Ico name="cart" size={20} />
            {count > 0 && (
              <span style={{ position:'absolute', top:-6, right:-6, minWidth:19, height:19, padding:'0 4px',
                background:'var(--yellow-400)', color:'var(--purple-700)', fontSize:11, fontWeight:700,
                borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'var(--shadow-sm)', animation:'kapri-pop .3s var(--ease-spring)' }}>
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
