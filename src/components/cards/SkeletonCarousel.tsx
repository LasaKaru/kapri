'use client'
import React from 'react'

export function SkeletonCarousel() {
  const sk: React.CSSProperties = { background:'var(--purple-100)', borderRadius:8 }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:9, width:'100%' }}>
      <div style={{ display:'flex', gap:7 }}>
        {[60,54,54].map((w, i) => (
          <div key={i} className="skeleton" style={{ width:w, height:24, borderRadius:999 }} />
        ))}
      </div>
      <div style={{ display:'flex', gap:12, overflow:'hidden' }}>
        {[0,1,2,3].map((i) => (
          <div key={i} style={{ width:210, flexShrink:0, background:'#fff', border:'1px solid var(--line)',
            borderRadius:'var(--radius-lg)', overflow:'hidden', boxShadow:'var(--shadow-card)' }}>
            <div className="skeleton" style={{ height:188, borderRadius:0 }} />
            <div style={{ padding:12, display:'flex', flexDirection:'column', gap:8 }}>
              <div className="skeleton" style={{ ...sk, height:12, width:'90%' }} />
              <div className="skeleton" style={{ ...sk, height:12, width:'60%' }} />
              <div className="skeleton" style={{ ...sk, height:22, width:66 }} />
              <div className="skeleton" style={{ ...sk, height:34, width:'100%', marginTop:4 }} />
            </div>
          </div>
        ))}
      </div>
      <p style={{ margin:0, fontSize:11.5, color:'var(--muted)' }}>Searching Kapruka for you…</p>
    </div>
  )
}
