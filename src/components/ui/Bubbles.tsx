'use client'
import React from 'react'
import { Ico } from './Icons'

export function Avatar() {
  return (
    <div style={{ width:30, height:30, flexShrink:0, marginTop:2, borderRadius:999, background:'#fff',
      display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
      <img src="/kapri-avatar.png" alt="Kapri" style={{ width:'100%', height:'100%', objectFit:'cover', transform:'scale(1.35) translateY(2px)' }} />
    </div>
  )
}

export function UserBubble({ children, image }: { children: React.ReactNode; image?: string }) {
  return (
    <div style={{ display:'flex', justifyContent:'flex-end', animation:'kapri-in-right .3s var(--ease-out)', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
      {image && (
        <div style={{ padding: '6px', background: 'var(--line)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="User upload" style={{ maxWidth: 200, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
        </div>
      )}
      {children && (
        <div className="sinhala-text" style={{ maxWidth:'82%', padding:'10px 15px', fontSize:14, color:'#fff',
          background:'var(--purple-700)', borderRadius:'var(--radius-lg)', borderTopRightRadius:(image ? 'var(--radius-lg)' : 'var(--radius-sm)'),
          boxShadow:'var(--shadow-sm)', whiteSpace:'pre-wrap' }}>
          {children}
        </div>
      )}
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
  const formatText = (text: React.ReactNode) => {
    if (typeof text !== 'string') return text
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <div className="sinhala-text" style={{ alignSelf:'flex-start', maxWidth:'92%', padding:'10px 15px',
      background:'var(--purple-100)', color:'var(--ink)', borderRadius:'var(--radius-lg)',
      borderTopLeftRadius:'var(--radius-sm)', fontSize:14, lineHeight:1.5,
      boxShadow:'var(--shadow-sm)', whiteSpace:'pre-wrap' }}>
      {formatText(children)}
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
