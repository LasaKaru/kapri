'use client'
import React from 'react'
import { Ico } from './Icons'

export function Avatar() {
  return (
    <div style={{ width:30, height:30, flexShrink:0, marginTop:2, borderRadius:999, background:'var(--purple-700)',
      display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, boxShadow:'var(--shadow-sm)' }}>
      🛍️
    </div>
  )
}

export function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:'flex', justifyContent:'flex-end', animation:'kapri-in-right .3s var(--ease-out)' }}>
      <div className="sinhala-text" style={{ maxWidth:'82%', padding:'10px 15px', fontSize:14, color:'#fff',
        background:'var(--purple-700)', borderRadius:'var(--radius-lg)', borderTopRightRadius:'var(--radius-sm)',
        boxShadow:'var(--shadow-sm)', whiteSpace:'pre-wrap' }}>
        {children}
      </div>
    </div>
  )
}

export function KapriRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:9, animation:'kapri-in-left .3s var(--ease-out)' }}>
      <Avatar />
      <div style={{ display:'flex', flexDirection:'column', gap:12, flex:1, minWidth:0 }}>
        {children}
      </div>
    </div>
  )
}

export function KapriText({ children }: { children: React.ReactNode }) {
  return (
    <div className="sinhala-text" style={{ alignSelf:'flex-start', maxWidth:'92%', padding:'10px 15px',
      background:'var(--purple-100)', color:'var(--ink)', borderRadius:'var(--radius-lg)',
      borderTopLeftRadius:'var(--radius-sm)', fontSize:14, lineHeight:1.5,
      boxShadow:'var(--shadow-sm)', whiteSpace:'pre-wrap' }}>
      {children}
    </div>
  )
}

export function Typing() {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:9 }}>
      <Avatar />
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 15px', background:'var(--purple-100)',
        borderRadius:'var(--radius-lg)', borderTopLeftRadius:'var(--radius-sm)', boxShadow:'var(--shadow-sm)' }}>
        {[0,1,2].map((i) => (
          <span key={i} style={{ width:7, height:7, borderRadius:999, background:'var(--purple-500)',
            animation:`kapri-bounce 1s ease-in-out ${i * 0.18}s infinite` }} />
        ))}
      </div>
    </div>
  )
}
