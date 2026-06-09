import React from 'react'

/**
 * Category / occasion tile — emoji over label, used in the CategoryGrid.
 * Lifts and tints purple on hover.
 */
export function CategoryTile({ emoji, label, onClick, style = {}, ...props }) {
  const [hover, setHover] = React.useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: 10,
        background: hover ? 'var(--purple-50)' : '#fff',
        border: `1px solid ${hover ? 'var(--purple-400)' : 'var(--line)'}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'all var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      {...props}
    >
      <span style={{ fontSize: 22, lineHeight: 1 }} role="img" aria-label={label}>{emoji}</span>
      <span style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 10,
        fontWeight: 500,
        color: 'var(--ink)',
        textAlign: 'center',
        lineHeight: 1.2,
      }}>{label}</span>
    </button>
  )
}
