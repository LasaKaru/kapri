/* Kapri UI kit — shared parts: Icon, Header, MessageBubble, Composer, chrome.
   Self-contained (no bundle dependency) so the kit always renders.
   Styling references the design-system tokens from styles.css. */

const ICON_PATHS = {
  'shopping-cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  'shopping-bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  'send': '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  'mic': '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
  'sparkles': '<path d="M9.94 14.06 8 21l-1.94-6.94L-.88 12l6.94-1.94L8 3l1.94 6.94L16 12l-6.06 2.06Z" transform="translate(4)"/>',
  'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'minus': '<path d="M5 12h14"/>',
  'trash-2': '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  'truck': '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  'calendar': '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  'package': '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  'gift': '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
}

function Ico({ name, size = 18, color = 'currentColor', sw = 2, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block', ...(style || {}) }}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || '' }} />
  )
}

const LKR = (n) => `Rs. ${Number(n).toLocaleString('en-LK')}`

function Header({ cartCount, onCart, lang, onLang }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px', background: 'var(--purple-700)', boxShadow: 'var(--shadow-lg)', zIndex: 10, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="../../assets/kapruka-logo.jpg" alt="Kapruka" style={{ height: 30, width: 'auto', borderRadius: 4 }} />
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)' }} />
        <div>
          <div style={{ fontSize: 12, color: 'var(--yellow-400)', fontWeight: 600, lineHeight: 1 }}>Kapri</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', lineHeight: 1, marginTop: 2 }}>AI Shopping Concierge</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={onLang} style={chromeBtn} aria-label="Toggle language">
          {lang === 'en'
            ? <span>EN | <span style={{ opacity: 0.7, fontWeight: 400 }}>සිං</span></span>
            : <span><span style={{ opacity: 0.7, fontWeight: 400 }}>EN</span> | සිං</span>}
        </button>
        <button onClick={onCart} style={{ ...chromeBtn, position: 'relative', padding: 8 }} aria-label="Cart">
          <Ico name="shopping-cart" size={20} color="#fff" />
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 19, height: 19, padding: '0 4px',
              background: 'var(--yellow-400)', color: 'var(--purple-700)', fontSize: 11, fontWeight: 700,
              borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  )
}
const chromeBtn = {
  padding: '7px 10px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
}

function Bubble({ role, sinhala, children }) {
  const isUser = role === 'user'
  const bub = (
    <div style={{
      maxWidth: isUser ? '82%' : '100%', padding: '10px 16px',
      fontFamily: sinhala ? 'var(--font-sinhala)' : 'var(--font-sans)', fontSize: 14,
      lineHeight: sinhala ? 1.6 : 1.5, color: isUser ? '#fff' : 'var(--ink)',
      background: isUser ? 'var(--purple-700)' : 'var(--purple-100)',
      borderRadius: 'var(--radius-lg)',
      borderTopRightRadius: isUser ? 'var(--radius-sm)' : 'var(--radius-lg)',
      borderTopLeftRadius: isUser ? 'var(--radius-lg)' : 'var(--radius-sm)',
      boxShadow: 'var(--shadow-sm)', whiteSpace: 'pre-wrap', animation: 'kapruka-fade-in .3s var(--ease-out)',
    }}>{children}</div>
  )
  if (isUser) return <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{bub}</div>
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <div style={{ width: 28, height: 28, flexShrink: 0, marginTop: 2, borderRadius: 999,
        background: 'var(--purple-700)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, boxShadow: 'var(--shadow-sm)' }}>🛍️</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: '90%', minWidth: 0 }}>{bub}</div>
    </div>
  )
}

function QuickReplies({ items, onPick }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingLeft: 36, marginTop: -4 }}>
      {items.map((c) => (
        <button key={c} onClick={() => onPick(c)} style={{
          padding: '5px 12px', borderRadius: 999, background: '#fff', border: '1px solid var(--line)',
          color: 'var(--purple-700)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)', fontFamily: 'var(--font-sans)' }}>{c}</button>
      ))}
    </div>
  )
}

function Composer({ value, onChange, onSend, lang }) {
  return (
    <div style={{ flexShrink: 0, padding: '12px 16px', background: '#fff', borderTop: '1px solid var(--line)' }}>
      <form onSubmit={(e) => { e.preventDefault(); onSend() }} style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <input
          value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="Type in English, Sinhala, or Tanglish..."
          className="sinhala-text"
          style={{ flex: 1, resize: 'none', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)',
            padding: '11px 16px', fontSize: 14, color: 'var(--ink)', background: 'var(--surface)',
            outline: 'none', fontFamily: 'var(--font-sans)' }} />
        <button type="button" style={{ ...sqBtn, background: 'var(--purple-100)', color: 'var(--purple-700)' }} aria-label="Voice">
          <Ico name="mic" size={18} />
        </button>
        <button type="submit" style={{ ...sqBtn, background: 'var(--purple-700)', color: '#fff' }} aria-label="Send">
          <Ico name="send" size={18} />
        </button>
      </form>
    </div>
  )
}
const sqBtn = { width: 42, height: 42, flexShrink: 0, borderRadius: 'var(--radius-lg)', border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }

Object.assign(window, { Ico, LKR, Header, Bubble, QuickReplies, Composer })
