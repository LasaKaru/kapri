import React from 'react'

/**
 * Kapruka primary action button.
 * Variants: primary (purple), secondary (outline), ghost, yellow (CTA).
 * Rounded 14px, semibold, springs down on press (active:scale-95).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  style = {},
  ...props
}) {
  const sizes = {
    sm: { fontSize: 12, padding: '6px 12px' },
    md: { fontSize: 14, padding: '8px 16px' },
    lg: { fontSize: 16, padding: '12px 24px' },
  }

  const variants = {
    primary: { background: 'var(--purple-700)', color: '#fff', border: '2px solid transparent' },
    secondary: { background: 'transparent', color: 'var(--purple-700)', border: '2px solid var(--purple-700)' },
    ghost: { background: 'transparent', color: 'var(--muted)', border: '2px solid transparent' },
    yellow: { background: 'var(--yellow-400)', color: 'var(--purple-700)', border: '2px solid transparent', fontWeight: 700 },
  }

  const [hover, setHover] = React.useState(false)
  const hoverBg = {
    primary: 'var(--purple-600)',
    secondary: 'rgba(68,42,115,0.05)',
    ghost: 'var(--purple-100)',
    yellow: 'var(--yellow-500)',
  }

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: fullWidth ? '100%' : 'auto',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontWeight: variants[variant].fontWeight || 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        ...sizes[size],
        ...variants[variant],
        ...(hover && !disabled ? { background: hoverBg[variant] } : {}),
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.95)' }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      {...props}
    >
      {children}
    </button>
  )
}
