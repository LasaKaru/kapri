import React from 'react'

/**
 * Chat message bubble. User = purple, right-aligned with a tail on the
 * top-right. Kapri = purple-100 ink, left-aligned with a 🛍️ avatar and a
 * tail on the top-left. Set `sinhala` for සිංහල/Tanglish line-height.
 */
export function MessageBubble({ role = 'kapri', children, sinhala = false, style = {} }) {
  const isUser = role === 'user'

  const bubble = (
    <div
      style={{
        maxWidth: isUser ? '82%' : '100%',
        padding: '10px 16px',
        fontFamily: sinhala ? 'var(--font-sinhala)' : 'var(--font-sans)',
        fontSize: 14,
        lineHeight: sinhala ? 1.6 : 1.5,
        color: isUser ? '#fff' : 'var(--ink)',
        background: isUser ? 'var(--purple-700)' : 'var(--purple-100)',
        borderRadius: 'var(--radius-lg)',
        borderTopRightRadius: isUser ? 'var(--radius-sm)' : 'var(--radius-lg)',
        borderTopLeftRadius: isUser ? 'var(--radius-lg)' : 'var(--radius-sm)',
        boxShadow: 'var(--shadow-sm)',
        whiteSpace: 'pre-wrap',
      }}
    >
      {children}
    </div>
  )

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', ...style }}>
        {bubble}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, ...style }}>
      <div style={{
        width: 28,
        height: 28,
        flexShrink: 0,
        marginTop: 2,
        borderRadius: 'var(--radius-full)',
        background: 'var(--purple-700)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        boxShadow: 'var(--shadow-sm)',
      }}>🛍️</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: '90%', minWidth: 0 }}>
        {bubble}
      </div>
    </div>
  )
}
