import React from 'react'

/**
 * Small status / metadata badge. Used for discounts, stock state,
 * category pills over images, and the yellow cart/LIVE badges.
 */
export function Badge({ tone = 'neutral', children, style = {}, ...props }) {
  const tones = {
    neutral:  { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--line)' },
    purple:   { background: 'rgba(68,42,115,0.80)', color: '#fff', backdropFilter: 'blur(4px)' },
    accent:   { background: 'var(--yellow-400)', color: 'var(--purple-700)', fontWeight: 700 },
    success:  { background: 'rgba(31,157,87,0.90)', color: '#fff' },
    warn:     { background: 'rgba(217,138,0,0.90)', color: '#fff' },
    error:    { background: 'rgba(214,59,59,0.90)', color: '#fff' },
    ink:      { background: 'rgba(27,18,48,0.70)', color: '#fff', backdropFilter: 'blur(4px)' },
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontFamily: 'var(--font-sans)',
        fontSize: 10,
        fontWeight: tones[tone].fontWeight || 600,
        lineHeight: 1,
        padding: '4px 8px',
        borderRadius: 'var(--radius-full)',
        whiteSpace: 'nowrap',
        ...tones[tone],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
