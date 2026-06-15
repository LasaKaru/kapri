'use client'
import React from 'react'
import { Ico } from './ui/Icons'
import type { Category, Occasion } from '@/lib/types'

interface Prompt { emoji: string; text: string }

interface EmptyStateProps {
  prompts: Prompt[]
  onPrompt: (text: string) => void
  categories: Category[]
  occasions: Occasion[]
  onCategory: (q: string) => void
  lang: string
  hasChat?: boolean
  onResumeChat?: () => void
  onClearChat?: () => void
}

/** A single category/occasion tile. Lazy-loads its image (live categories pull
 *  the Kapruka og:image via the proxy) and falls back to an emoji gradient tile
 *  if the image is missing or fails to load — so new categories never look broken. */
const CategoryTile = ({ item, onClick }: { item: Category | Occasion, onClick: (q: string) => void }) => {
  const [failed, setFailed] = React.useState(false)
  const showImg = item.img && !failed
  return (
    <div onClick={() => onClick(item.q)} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(item.q) }}
      style={{ scrollSnapAlign: 'start', display:'flex', flexDirection:'column', alignItems:'center', gap:6, minWidth:72, background:'transparent', border:'none', padding:0, cursor:'pointer' }}>
      <span style={{ position:'relative', width:72, height:72, borderRadius:'var(--radius-lg)', overflow:'hidden', boxShadow:'var(--shadow-sm)', display:'flex', alignItems:'center', justifyContent:'center',
        background: showImg ? 'var(--purple-100)' : 'linear-gradient(135deg, var(--purple-100), var(--purple-200))' }}>
        {showImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.img} alt={item.name} loading="lazy" onError={() => setFailed(true)}
            style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        ) : (
          <span style={{ fontSize:30 }} aria-hidden>{item.emoji || '🎁'}</span>
        )}
      </span>
      <span style={{ fontSize:11, fontWeight:500, color:'var(--ink)', whiteSpace:'nowrap' }}>{item.name}</span>
    </div>
  )
}

const ScrollRow = ({ title, items, onClick }: { title: string, items: (Category|Occasion)[], onClick: (q: string) => void }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  
  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 220
      scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div style={{ width:'100%', maxWidth:640, marginTop:12, position: 'relative', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <p style={{ margin:0, fontSize:11, color:'var(--muted)', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', textAlign:'left' }}>
          {title}
        </p>
        <div className="hide-on-mobile" style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => scroll('left')} style={{ background: 'var(--purple-100)', color: 'var(--purple-700)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .15s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--purple-200)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--purple-100)'}>
            <Ico name="chevron-left" size={14} />
          </button>
          <button onClick={() => scroll('right')} style={{ background: 'var(--purple-100)', color: 'var(--purple-700)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .15s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--purple-200)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--purple-100)'}>
            <Ico name="chevron-right" size={14} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="scrollbar-hide" style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:8, scrollSnapType: 'x mandatory' }}>
        {items.map((c) => (
          <CategoryTile key={c.name} item={c} onClick={onClick} />
        ))}
      </div>
    </div>
  )
}

export function EmptyState({ prompts, onPrompt, categories, occasions, onCategory, hasChat, onResumeChat, onClearChat }: EmptyStateProps) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
      minHeight:'100%', width: '100%', overflowX: 'hidden' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20, padding:'24px 0', margin: 'auto 0', width: '100%', textAlign:'center' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, animation:'kapri-breathe 3.5s ease-in-out 3' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '2px solid var(--purple-200)', background: '#fff', animation: 'kapri-neon-border 3s infinite alternate ease-in-out' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kapri-avatar.png" alt="Kapri Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.6)', transformOrigin: 'center 20%' }} />
        </div>
      </div>
      <div style={{ padding: '0 20px' }}>
        <h1 className="sinhala-text" style={{ margin:0, fontSize:25, fontWeight:700, color:'var(--purple-700)' }}>
          ආයුබෝවන්! I&#39;m Kapri 👋
        </h1>
        <p className="sinhala-text" style={{ margin:'7px auto 0', maxWidth:330, fontSize:14, color:'var(--muted)', lineHeight:1.6 }}>
          Chat in <strong style={{ color:'var(--ink)' }}>English</strong>, <strong style={{ color:'var(--ink)' }}>සිංහල</strong>, or <strong style={{ color:'var(--ink)' }}>Tanglish</strong> — gifts, groceries, electronics, fashion &amp; more. I&apos;ll find it and deliver it.
        </p>
      </div>
      
      <ScrollRow title="Shop by Category" items={categories} onClick={onCategory} />
      <ScrollRow title="Shop by Occasion" items={occasions} onClick={onCategory} />

      <div style={{ width:'100%', maxWidth:420, display:'flex', flexDirection:'column', gap:8, marginTop: 8, padding: '0 20px' }}>
        <p style={{ margin:0, fontSize:11, color:'var(--muted)', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', textAlign:'left' }}>Try saying…</p>
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

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => onPrompt('Track my order')}
          style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:999,
            background:'var(--purple-100)', border:'1px solid var(--purple-200)', color:'var(--purple-700)',
            fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-sans)' }}>
          <Ico name="package" size={15} color="var(--purple-700)" /> Track an order
        </button>

        {hasChat && onResumeChat && (
          <button onClick={onResumeChat}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:999,
              background:'var(--purple-600)', border:'1px solid var(--purple-700)', color:'#fff',
              fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-sans)', boxShadow:'var(--shadow-sm)' }}>
            <Ico name="message-square" size={15} color="#fff" /> Resume last chat
          </button>
        )}

        {hasChat && onClearChat && (
          <button onClick={onClearChat} className="kapri-btn-clear"
            style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:999,
              fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-sans)' }}>
            <Ico name="trash" size={15} color="currentColor" /> Clear
          </button>
        )}
      </div>

      <p style={{ margin:'12px 0 0', fontSize:11, color:'var(--purple-200)' }}>Powered by Kapruka</p>
      </div>
    </div>
  )
}
