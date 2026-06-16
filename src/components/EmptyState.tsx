'use client'
import React from 'react'
import { Ico } from './ui/Icons'
import type { Category, Occasion } from '@/lib/types'

interface Prompt { icon: string; text: string }

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
  const [showAvatar, setShowAvatar] = React.useState(false)
  const [typedText, setTypedText] = React.useState('')
  const fullText = "ආයුබෝවන්! I'm Kapri"

  React.useEffect(() => {
    // 1. Float in the avatar
    const t1 = setTimeout(() => setShowAvatar(true), 100)
    
    // 2. Start typing the greeting shortly after the avatar appears
    let i = 0
    const t2 = setTimeout(() => {
      const typeInterval = setInterval(() => {
        setTypedText(fullText.slice(0, i + 1))
        i++
        if (i >= fullText.length) clearInterval(typeInterval)
      }, 50)
      return () => clearInterval(typeInterval)
    }, 500)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
      minHeight:'100%', width: '100%', overflowX: 'hidden' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20, padding:'24px 0', margin: 'auto 0', width: '100%', textAlign:'center' }}>
      
      {/* Animated Avatar Hero */}
      <div style={{ 
        display:'flex', flexDirection:'column', alignItems:'center', gap:12,
        transform: showAvatar ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.85)',
        opacity: showAvatar ? 1 : 0,
        transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)' 
      }}>
        <div style={{ 
          width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 8px 24px rgba(68,42,115,0.25)', 
          border: '2px solid var(--purple-200)', background: '#fff', 
          animation: showAvatar ? 'kapri-breathe 4s ease-in-out infinite alternate' : 'none' 
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kapri-avatar.png" alt="Kapri Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.5)', transformOrigin: 'center 20%' }} />
        </div>
      </div>
      
      <div style={{ padding: '0 20px', minHeight: 70 }}>
        <h1 className="sinhala-text" style={{ 
          margin:0, fontSize:26, fontWeight:800, color:'var(--purple-700)', 
          letterSpacing: '-0.5px', height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          {typedText}
          <span style={{ 
            display: 'inline-block', width: 2, height: 24, background: 'var(--purple-500)', 
            marginLeft: 4, animation: 'kapri-blink 1s step-end infinite',
            opacity: typedText.length === fullText.length ? 0 : 1 
          }} />
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8,
            opacity: typedText.length === fullText.length ? 1 : 0,
            transformOrigin: '70% 70%',
            animation: typedText.length === fullText.length ? 'kapri-waving-hand 2s infinite' : 'none',
            transition: 'opacity 0.3s ease'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#FBE840" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 0 0-4 0v5"/>
              <path d="M14 10.5V5a2 2 0 0 0-4 0v6"/>
              <path d="M10 10.5V4a2 2 0 0 0-4 0v7"/>
              <path d="M6 12V8a2 2 0 0 0-4 0v7.6c0 3.3 2.7 6 6 6h2c3.3 0 6-2.7 6-6V12a2 2 0 0 0-4 0"/>
            </svg>
          </span>
        </h1>
        <p className="sinhala-text" style={{ 
          margin:'10px auto 0', maxWidth:330, fontSize:14, color:'var(--muted)', lineHeight:1.6,
          opacity: typedText.length > 5 ? 1 : 0, transition: 'opacity 0.8s ease'
        }}>
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
            <span style={{ display:'flex', alignItems:'center', justifyContent:'center', width: 28, height: 28, background: 'var(--yellow-300)', borderRadius: 8, color: 'var(--purple-900)' }}>
              <Ico name={p.icon} size={16} />
            </span>
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

      <p style={{ margin:'12px 0 0', fontSize:11, color:'var(--purple-200)' }}>Powered by Kapruka · Island-wide delivery</p>
      </div>
    </div>
  )
}
