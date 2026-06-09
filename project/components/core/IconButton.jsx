import React from 'react'
import { Icon } from './Icon'

/**
 * Circular/rounded icon-only button. Used in chrome (cart, send, mic)
 * and inline actions. Defaults to the translucent-on-purple chrome style.
 */
export function IconButton({
  icon,
  variant = 'chrome',
  size = 40,
  active = false,
  disabled = false,
  ariaLabel,
  style = {},
  ...props
}) {
  const variants = {
    chrome: { background: 'rgba(255,255,255,0.10)', color: '#fff' },
    soft: { background: 'var(--purple-100)', color: 'var(--purple-700)' },
    solid: { background: 'var(--purple-700)', color: '#fff' },
    danger: { background: 'var(--error)', color: '#fff' },
  }
  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        ...variants[variant],
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.92)' }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      {...props}
    >
      {typeof icon === 'string' ? <Icon name={icon} size={Math.round(size * 0.45)} /> : icon}
    </button>
  )
}
