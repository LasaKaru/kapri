'use client'
import React from 'react'
import { Ico } from './ui/Icons'
import type { Category, Season } from '@/lib/types'

interface Prompt { emoji: string; text: string }

interface EmptyStateProps {
  prompts: Prompt[]
  onPrompt: (text: string) => void
  categories: Category[]
  onCategory: (q: string) => void
  lang: string
}

export function EmptyState({ prompts, onPrompt, categories, onCategory }: EmptyStateProps) {
  const feats: [string, string][] = [['🎁','Find gifts'],['🎂','Order cakes'],['🌹','Send flowers']]
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      minHeight:'100%', textAlign:'center', gap:20, padding:'12px 0 24px' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, animation:'kapri-breathe 3.5s ease-in-out infinite' }}>
        <div style={{ background:'var(--purple-700)', borderRadius:'var(--radius-lg)', padding:'14px 26px', boxShadow:'var(--shadow-lg)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kapruka-logo.jpg" alt="Kapruka" style={{ height:42, width:'auto', borderRadius:5 }} />
        </div>
        <span style={{ padding:'5px 13px', borderRadius:999, background:'var(--yellow-400)', color:'var(--purple-700)',
          fontSize:12, fontWeight:700, boxShadow:'var(--shadow-sm)' }}>
          Kapri — AI Shopping Concierge
        </span>
      </div>
      <div>
        <h1 className="sinhala-text" style={{ margin:0, fontSize:25, fontWeight:700, color:'var(--purple-700)' }}>
          ආයුබෝවන්! I&#39;m Kapri 👋
        </h1>
        <p className="sinhala-text" style={{ margin:'7px auto 0', maxWidth:330, fontSize:14, color:'var(--muted)', lineHeight:1.6 }}>
          Your shopping concierge for Kapruka.lk — Sri Lanka&#39;s #1 gifting platform.
          Chat in <strong style={{ color:'var(--ink)' }}>English</strong>, <strong style={{ color:'var(--ink)' }}>සිංහල</strong>, or <strong style={{ color:'var(--ink)' }}>Tanglish</strong>!
        </p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, width:'100%', maxWidth:320 }}>
        {feats.map(([e,t]) => (
          <div key={t} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 4px',
            background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)' }}>
            <span style={{ fontSize:24 }}>{e}</span>
            <span style={{ fontSize:11.5, color:'var(--muted)', fontWeight:500 }}>{t}</span>
          </div>
        ))}
      </div>
      <div style={{ width:'100%', maxWidth:380, display:'flex', flexDirection:'column', gap:8 }}>
        <p style={{ margin:0, fontSize:11, color:'var(--muted)', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>Try saying…</p>
        {prompts.map((p) => (
          <button key={p.text} onClick={() => onPrompt(p.text)} className="sinhala-text"
            style={{ width:'100%', textAlign:'left', padding:'12px 15px', background:'#fff', borderRadius:'var(--radius-lg)',
              border:'1px solid var(--line)', fontSize:14, color:'var(--ink)', display:'flex', alignItems:'center',
              gap:12, cursor:'pointer', boxShadow:'var(--shadow-sm)', transition:'all .15s var(--ease-out)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor='var(--purple-700)'; e.currentTarget.style.background='var(--purple-50)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor='var(--line)'; e.currentTarget.style.background='#fff' }}>
            <span style={{ fontSize:19 }}>{p.emoji}</span>
            <span style={{ flex:1 }}>{p.text}</span>
            <Ico name="sparkles" size={15} color="var(--purple-300)" />
          </button>
        ))}
      </div>
      <div style={{ width:'100%', maxWidth:380 }}>
        <p style={{ margin:'0 0 8px', fontSize:11, color:'var(--muted)', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>Or browse</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:7, justifyContent:'center' }}>
          {categories.map((c) => (
            <button key={c.name} onClick={() => onCategory(c.q)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:999,
                background:'#fff', border:'1px solid var(--line)', fontSize:13, color:'var(--ink)',
                cursor:'pointer', boxShadow:'var(--shadow-sm)', fontFamily:'var(--font-sans)' }}>
              <span style={{ fontSize:15 }}>{c.emoji}</span>{c.name}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => onPrompt('Track my order')}
        style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:999,
          background:'var(--purple-100)', border:'1px solid var(--purple-200)', color:'var(--purple-700)',
          fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-sans)' }}>
        <Ico name="package" size={15} color="var(--purple-700)" /> Track an order
      </button>
      <p style={{ margin:0, fontSize:11, color:'var(--purple-200)' }}>Powered by Kapruka × Anthropic Claude</p>
    </div>
  )
}
