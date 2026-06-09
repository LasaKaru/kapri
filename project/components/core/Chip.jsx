import React from 'react'

/**
 * Pill button used for quick-reply chips under Kapri messages and
 * the refine/sort bar on carousels. Two looks: outline (white) and
 * tonal (purple-100). Selected = solid purple.
 */
export function Chip({ children, selected = false, variant = 'outline', onClick, style = {}, ...props }) {
  const [hover, setHover] = React.useState(false)
  const base = {
    outline: { background: '#fff', color: 'var(--purple-700)', border: '1px solid var(--line)' },
    tonal:   { background: 'var(--purple-100)', color: 'var(--purple-700)', border: '1px solid var(--purple-200)' },
  }
  const sel = { background: 'var(--purple-700)', color: '#fff', border: '1px solid var(--purple-700)' }
  const hov = {
    outline: { borderColor: 'var(--purple-700)', background: 'var(--purple-50)' },
    tonal:   { borderColor: 'var(--purple-400)' },
  }
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        fontWeight: 600,
        padding: '5px 12px',
        borderRadius: 'var(--radius-full)',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--dur-fast) var(--ease-out)',
        ...(selected ? sel : base[variant]),
        ...(hover && !selected ? hov[variant] : {}),
        ...style,
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      {...props}
    >
      {children}
    </button>
  )
}
