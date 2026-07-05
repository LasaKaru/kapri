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
  image: string | null
  onImage: (img: string | null) => void
}

export function Composer({ value, onChange, onSend, onMic, recording, lang, image, onImage }: ComposerProps) {
  const [pendingAction, setPendingAction] = React.useState<'mic' | 'camera' | null>(null)

  const placeholder = lang === 'en'
    ? 'Type in English, Sinhala, Tamil, or Tanglish…'
    : 'සිංහලෙන්, English, தமிழ் හෝ Tanglish ලියන්න…'

  return (
    <div style={{ flexShrink:0, padding:'12px 16px', paddingBottom: '24px', zIndex:10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {image && (
        <div style={{ width: '100%', maxWidth: 816, margin: '0 auto 8px', display: 'flex' }}>
          <div style={{ position: 'relative', display: 'inline-block', animation: 'kapri-pop .2s var(--ease-spring)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Upload preview" style={{ height: 60, borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', objectFit: 'cover' }} />
            <button type="button" onClick={() => onImage(null)} aria-label="Remove image"
              style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ico name="x" size={12} sw={2.5} />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); onSend() }}
        style={{ display:'flex', alignItems:'flex-end', gap:8, width: '100%', maxWidth:816, margin:'0 auto' }}>
        <input type="file" accept="image/*" hidden id="kapri-camera" onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            // Downscale logic can be done here or in App.tsx. Simple reader for now.
            const reader = new FileReader()
            reader.onload = (e) => onImage(e.target?.result as string)
            reader.readAsDataURL(file)
          }
          e.target.value = ''
        }} />
        <button type="button" onClick={() => setPendingAction('camera')} title="Upload image"
          style={{ width:44, height:44, flexShrink:0, borderRadius:'var(--radius-lg)', border:'none',
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
            background: 'var(--purple-50)', color: 'var(--purple-700)', transition: 'background .2s' }}>
          <Ico name="camera" size={18} sw={2.5} />
        </button>
        <input value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} className="sinhala-text"
          style={{ flex:1, minWidth:0, borderRadius:'var(--radius-lg)', border:'1px solid var(--line)', padding:'12px 16px',
            fontSize:14, color:'var(--ink)', background:'var(--surface)', outline:'none', fontFamily:'var(--font-sans)' }}
          onFocus={(e) => { e.target.style.borderColor='var(--purple-700)'; e.target.style.background='#fff'; e.target.style.boxShadow='0 0 0 3px var(--focus-ring)' }}
          onBlur={(e) => { e.target.style.borderColor='var(--line)'; e.target.style.background='var(--surface)'; e.target.style.boxShadow='none' }} />
        <button type="button" onClick={() => {
            if (recording) { onMic(); return; }
            setPendingAction('mic')
          }} aria-label="Voice input"
          style={{ width:44, height:44, flexShrink:0, borderRadius:'var(--radius-lg)', border:'none',
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
            background: recording ? 'var(--error)' : 'var(--purple-100)',
            color: recording ? '#fff' : 'var(--purple-700)',
            animation: recording ? 'kapri-pulse 1s infinite' : 'none' }}>
          <Ico name="mic" size={18} sw={2.5} />
        </button>
        <button type="submit" disabled={!value.trim() && !image} aria-label="Send"
          style={{ width:44, height:44, flexShrink:0, borderRadius:'var(--radius-lg)', border:'none',
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor: (value.trim() || image) ? 'pointer' : 'not-allowed',
            background:'var(--purple-700)', color:'#fff', opacity: (value.trim() || image) ? 1 : 0.45 }}>
          <Ico name="send" size={18} sw={2.5} />
        </button>
      </form>
      {recording && (
        <div style={{ display:'flex', alignItems:'center', gap:9, width: '100%', maxWidth:816, margin:'9px auto 0', padding:'0 2px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:3, height:18 }}>
            {[0,1,2,3,4,5,6].map((i) => (
              <span key={i} style={{ width:3, height:'100%', borderRadius:999, background:'var(--error)', transformOrigin:'center',
                animation:`kapri-wave .7s ease-in-out ${i * 0.09}s infinite alternate` }} />
            ))}
          </div>
          <span className="sinhala-text" style={{ fontSize:12, color:'var(--error)', fontWeight:600 }}>
            Listening… speak in {lang === 'si' ? 'සිංහල' : lang === 'ta' ? 'தமிழ்' : 'English'} · tap mic to stop
          </span>
        </div>
      )}

      {pendingAction && (
        <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center',
          background:'rgba(36,21,68,0.45)', backdropFilter:'blur(3px)', animation:'kapri-up .3s var(--ease-out)' }}>
          <div style={{ width:'90%', maxWidth:340, background:'#fff', borderRadius:'var(--radius-lg)', padding:24, boxShadow:'var(--shadow-xl)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <div style={{ width:40, height:40, borderRadius:999, background:'var(--purple-100)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Ico name={pendingAction === 'mic' ? 'mic' : 'camera'} size={20} color="var(--purple-700)" />
              </div>
              <h3 style={{ margin:0, color:'var(--ink)', fontSize:18, fontWeight:700 }}>
                {pendingAction === 'mic' ? 'Voice Input Tip 🎤' : 'Visual Search Tip 📸'}
              </h3>
            </div>
            
            {pendingAction === 'mic' ? (
              <div style={{ margin:'0 0 20px', fontSize:14, color:'var(--muted)', lineHeight:1.5 }}>
                For the best voice recognition and accurate shopping results, we highly recommend speaking in <strong style={{ color:'var(--purple-700)' }}>English</strong>. Kapri AI understands it best!
              </div>
            ) : (
              <div style={{ margin:'0 0 20px', fontSize:14, color:'var(--muted)', lineHeight:1.5 }}>
                For the best visual search results, please upload a <strong style={{ color:'var(--purple-700)' }}>clear, well-lit image</strong> of the item you are looking for.
              </div>
            )}

            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button onClick={() => setPendingAction(null)} style={{ padding:'10px 16px', borderRadius:'var(--radius-md)', border:'none', background:'var(--surface)', color:'var(--ink)', fontWeight:600, cursor:'pointer', fontFamily:'var(--font-sans)' }}>
                Cancel
              </button>
              <button onClick={() => {
                const act = pendingAction
                setPendingAction(null)
                if (act === 'mic') onMic()
                if (act === 'camera') document.getElementById('kapri-camera')?.click()
              }} style={{ padding:'10px 16px', borderRadius:'var(--radius-md)', border:'none', background:'var(--yellow-400)', color:'var(--purple-700)', fontWeight:700, cursor:'pointer', fontFamily:'var(--font-sans)' }}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
