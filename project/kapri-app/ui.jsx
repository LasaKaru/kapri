/* Kapri demo — UI primitives. */

const ICONS = {
  'cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  'bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  'send': '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  'mic': '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
  'sparkles': '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="M19 3v4M21 5h-4M5 17v4M7 19H3"/>',
  'link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'minus': '<path d="M5 12h14"/>',
  'trash': '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  'truck': '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  'calendar': '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  'pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  'package': '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  'gift': '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  'warn': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'wand': '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M17.8 6.2 19 5M3 21l9-9M12.2 6.2 11 5"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'edit': '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
  'heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'globe': '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>',
}

function Ico({ name, size = 18, color = 'currentColor', sw = 2, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block', ...(style || {}) }}
      dangerouslySetInnerHTML={{ __html: ICONS[name] || '' }} />
  )
}

function Header({ count, onCart, lang, onLang }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'center', padding: '11px 16px', background: 'var(--purple-700)',
      boxShadow: 'var(--shadow-lg)', zIndex: 20, flexShrink: 0, position: 'relative' }}>
      <div style={{ width: '100%', maxWidth: 1180, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="../assets/kapruka-logo.jpg" alt="Kapruka" style={{ height: 30, width: 'auto', borderRadius: 5 }} />
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.2)' }} />
        <div>
          <div style={{ fontSize: 12.5, color: 'var(--yellow-400)', fontWeight: 700, lineHeight: 1 }}>Kapri</div>
          <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1, marginTop: 2, letterSpacing: '.02em' }}>AI Shopping Concierge</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={onLang} title="Switch language" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px',
          borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, fontWeight: 600,
          border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          <Ico name="globe" size={14} color="rgba(255,255,255,.8)" />
          {lang === 'en' ? <span>EN <span style={{ opacity: .55 }}>· සිං</span></span> : <span><span style={{ opacity: .55 }}>EN ·</span> සිං</span>}
        </button>
        <button onClick={onCart} aria-label="Cart" style={{ position: 'relative', width: 40, height: 40, display: 'flex', alignItems: 'center',
          justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}>
          <Ico name="cart" size={20} />
          {count > 0 && <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 19, height: 19, padding: '0 4px',
            background: 'var(--yellow-400)', color: 'var(--purple-700)', fontSize: 11, fontWeight: 700, borderRadius: 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)',
            animation: 'kapri-pop .3s var(--ease-spring)' }}>{count}</span>}
        </button>
      </div>
      </div>
    </header>
  )
}

function Avatar() {
  return <div style={{ width: 30, height: 30, flexShrink: 0, marginTop: 2, borderRadius: 999, background: 'var(--purple-700)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: 'var(--shadow-sm)' }}>🛍️</div>
}

function UserBubble({ children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', animation: 'kapri-in-right .3s var(--ease-out)' }}>
      <div className="sinhala-text" style={{ maxWidth: '82%', padding: '10px 15px', fontSize: 14, color: '#fff',
        background: 'var(--purple-700)', borderRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-sm)', whiteSpace: 'pre-wrap' }}>{children}</div>
    </div>
  )
}

function KapriRow({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, animation: 'kapri-in-left .3s var(--ease-out)' }}>
      <Avatar />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  )
}

function KapriText({ children }) {
  return <div className="sinhala-text" style={{ alignSelf: 'flex-start', maxWidth: '92%', padding: '10px 15px',
    background: 'var(--purple-100)', color: 'var(--ink)', borderRadius: 'var(--radius-lg)', borderTopLeftRadius: 'var(--radius-sm)',
    fontSize: 14, lineHeight: 1.5, boxShadow: 'var(--shadow-sm)', whiteSpace: 'pre-wrap' }}>{children}</div>
}

function Typing() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
      <Avatar />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 15px', background: 'var(--purple-100)',
        borderRadius: 'var(--radius-lg)', borderTopLeftRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--purple-500)',
          animation: `kapri-bounce 1s ease-in-out ${i * 0.18}s infinite` }} />)}
      </div>
    </div>
  )
}

function Chip({ children, onClick, tone }) {
  const [h, setH] = React.useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: '6px 13px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        fontFamily: 'var(--font-sans)', boxShadow: 'var(--shadow-sm)', transition: 'all .15s var(--ease-out)',
        background: tone === 'accent' ? 'var(--yellow-400)' : (h ? 'var(--purple-50)' : '#fff'),
        color: tone === 'accent' ? 'var(--purple-700)' : 'var(--purple-700)',
        border: `1px solid ${tone === 'accent' ? 'var(--yellow-400)' : (h ? 'var(--purple-700)' : 'var(--line)')}` }}>
      {children}
    </button>
  )
}

function Composer({ value, onChange, onSend, onMic, recording, placeholder }) {
  const ref = React.useRef(null)
  return (
    <div style={{ flexShrink: 0, padding: '12px 16px', background: '#fff', borderTop: '1px solid var(--line)', zIndex: 10 }}>
      <form onSubmit={(e) => { e.preventDefault(); onSend() }} style={{ display: 'flex', alignItems: 'flex-end', gap: 8, maxWidth: 780, margin: '0 auto' }}>
        <input ref={ref} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="sinhala-text"
          style={{ flex: 1, borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', padding: '12px 16px', fontSize: 14,
            color: 'var(--ink)', background: 'var(--surface)', outline: 'none', fontFamily: 'var(--font-sans)' }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--purple-700)'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px var(--focus-ring)' }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--line)'; e.target.style.background = 'var(--surface)'; e.target.style.boxShadow = 'none' }} />
        <button type="button" onClick={onMic} aria-label="Voice input" style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 'var(--radius-lg)',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          background: recording ? 'var(--error)' : 'var(--purple-100)', color: recording ? '#fff' : 'var(--purple-700)',
          animation: recording ? 'kapri-pulse 1s infinite' : 'none' }}>
          <Ico name="mic" size={18} />
        </button>
        <button type="submit" disabled={!value.trim()} aria-label="Send" style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 'var(--radius-lg)',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: value.trim() ? 'pointer' : 'not-allowed',
          background: 'var(--purple-700)', color: '#fff', opacity: value.trim() ? 1 : 0.45 }}>
          <Ico name="send" size={18} />
        </button>
      </form>
      {recording && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, maxWidth: 780, margin: '9px auto 0', padding: '0 2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 18 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} style={{ width: 3, height: '100%', borderRadius: 999, background: 'var(--error)', transformOrigin: 'center',
                animation: `kapri-wave .7s ease-in-out ${i * 0.09}s infinite alternate` }} />
            ))}
          </div>
          <span style={{ fontSize: 12, color: 'var(--error)', fontWeight: 600 }} className="sinhala-text">Listening… speak in සිංහල or English · tap mic to stop</span>
        </div>
      )}
    </div>
  )
}

function SeasonBanner({ season, onShop }) {
  const [show, setShow] = React.useState(() => { try { return localStorage.getItem('kapri_season_x_' + season.key) !== '1' } catch (e) { return true } })
  if (!show) return null
  const dismiss = () => { setShow(false); try { localStorage.setItem('kapri_season_x_' + season.key, '1') } catch (e) {} }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', background: 'linear-gradient(90deg, var(--yellow-300), var(--yellow-400))', flexShrink: 0 }}>
      <div style={{ width: '100%', maxWidth: 1180, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px' }}>
        <span style={{ fontSize: 20, lineHeight: 1 }}>{season.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--purple-800)' }}>{season.greeting}</span>
          <span style={{ fontSize: 12.5, color: 'var(--purple-700)', marginLeft: 8, opacity: .85 }} className="kapri-hide-sm">{season.sub}</span>
        </div>
        <button onClick={() => onShop(season.q)} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 13px', borderRadius: 999,
          background: 'var(--purple-700)', color: '#fff', border: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          {season.cta} <Ico name="arrow-right" size={14} /></button>
        <button onClick={dismiss} aria-label="Dismiss" style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--purple-700)', padding: 4, display: 'flex' }}>
          <Ico name="x" size={16} /></button>
      </div>
    </div>
  )
}

window.KapriUI = { Ico, Header, SeasonBanner, Avatar, UserBubble, KapriRow, KapriText, Typing, Chip, Composer }
