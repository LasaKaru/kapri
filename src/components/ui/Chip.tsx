'use client'
import React, { useState } from 'react'

interface ChipProps {
  children: React.ReactNode
  onClick?: () => void
  tone?: 'accent' | 'default'
}

export function Chip({ children, onClick, tone }: ChipProps) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding:'6px 13px', borderRadius:999, fontSize:12.5, fontWeight:600, cursor:'pointer',
        fontFamily:'var(--font-sans)', boxShadow:'var(--shadow-sm)', transition:'all .15s var(--ease-out)',
        background: tone === 'accent' ? 'var(--yellow-400)' : (h ? 'var(--purple-50)' : '#fff'),
        color:'var(--purple-700)',
        border:`1px solid ${tone === 'accent' ? 'var(--yellow-400)' : (h ? 'var(--purple-700)' : 'var(--line)')}` }}>
      {children}
    </button>
  )
}
