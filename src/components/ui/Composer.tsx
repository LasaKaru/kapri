'use client'
import React from 'react'
import { Ico } from './Icons'
import type { Lang } from '@/lib/types'

interface ComposerProps {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  onMic: () => void
  recording: boolean
  lang: Lang
}

export function Composer({ value, onChange, onSend, onMic, recording, lang }: ComposerProps) {
  const placeholder = lang === 'en'
    ? 'Type in English, Sinhala, or Tanglish…'
    : 'සිංහලෙන්, English, හෝ Tanglish ලියන්න…'

  return (
    <div style={{ flexShrink:0, padding:'12px 16px', background:'#fff', borderTop:'1px solid var(--line)', zIndex:10 }}>
      <form onSubmit={(e) => { e.preventDefault(); onSend() }}
        style={{ display:'flex', alignItems:'flex-end', gap:8, maxWidth:780, margin:'0 auto' }}>
        <input value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} className="sinhala-text"
          style={{ flex:1, borderRadius:'var(--radius-lg)', border:'1px solid var(--line)', padding:'12px 16px',
            fontSize:14, color:'var(--ink)', background:'var(--surface)', outline:'none', fontFamily:'var(--font-sans)' }}
          onFocus={(e) => { e.target.style.borderColor='var(--purple-700)'; e.target.style.background='#fff'; e.target.style.boxShadow='0 0 0 3px var(--focus-ring)' }}
          onBlur={(e) => { e.target.style.borderColor='var(--line)'; e.target.style.background='var(--surface)'; e.target.style.boxShadow='none' }} />
        <button type="button" onClick={onMic} aria-label="Voice input"
          style={{ width:44, height:44, flexShrink:0, borderRadius:'var(--radius-lg)', border:'none',
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
            background: recording ? 'var(--error)' : 'var(--purple-100)',
            color: recording ? '#fff' : 'var(--purple-700)',
            animation: recording ? 'kapri-pulse 1s infinite' : 'none' }}>
          <Ico name="mic" size={18} />
        </button>
        <button type="submit" disabled={!value.trim()} aria-label="Send"
          style={{ width:44, height:44, flexShrink:0, borderRadius:'var(--radius-lg)', border:'none',
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor: value.trim() ? 'pointer' : 'not-allowed',
            background:'var(--purple-700)', color:'#fff', opacity: value.trim() ? 1 : 0.45 }}>
          <Ico name="send" size={18} />
        </button>
      </form>
      {recording && (
        <div style={{ display:'flex', alignItems:'center', gap:9, maxWidth:780, margin:'9px auto 0', padding:'0 2px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:3, height:18 }}>
            {[0,1,2,3,4,5,6].map((i) => (
              <span key={i} style={{ width:3, height:'100%', borderRadius:999, background:'var(--error)', transformOrigin:'center',
                animation:`kapri-wave .7s ease-in-out ${i * 0.09}s infinite alternate` }} />
            ))}
          </div>
          <span className="sinhala-text" style={{ fontSize:12, color:'var(--error)', fontWeight:600 }}>
            Listening… speak in සිංහල or English · tap mic to stop
          </span>
        </div>
      )}
    </div>
  )
}
