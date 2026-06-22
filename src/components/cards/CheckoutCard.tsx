'use client'
import React, { useState, useEffect } from 'react'
import { Ico } from '../ui/Icons'
import { LKR } from '@/lib/data'
import type { OrderData } from '@/lib/types'

function Summary({ l, v }: { l: string; v: string }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13.5 }}>
      <span style={{ color:'var(--muted)' }}>{l}</span>
      <span style={{ fontWeight:600, color:'var(--ink)' }}>{v}</span>
    </div>
  )
}

interface CheckoutCardProps {
  order: OrderData
  paid?: boolean
  onPay?: (o: OrderData) => void
}

export function CheckoutCard({ order, paid, onPay }: CheckoutCardProps) {
  const [secs, setSecs] = useState(() => {
    if (order.expiresAt) {
      const ms = new Date(order.expiresAt).getTime() - Date.now()
      return Math.max(0, Math.floor(ms / 1000))
    }
    return 3600
  })

  useEffect(() => {
    const t = setInterval(() => {
      setSecs((prev) => {
        if (order.expiresAt) {
          const ms = new Date(order.expiresAt).getTime() - Date.now()
          return Math.max(0, Math.floor(ms / 1000))
        }
        return Math.max(0, prev - 1)
      })
    }, 1000)
    return () => clearInterval(t)
  }, [order.expiresAt])

  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  const warn = secs < 300

  return (
    <div style={{ width:'100%', maxWidth:360, background:'#fff', borderRadius:'var(--radius-lg)',
      border:'2px solid var(--purple-700)', overflow:'hidden', boxShadow:'var(--shadow-lg)' }}>
      <div style={{ background:'var(--purple-700)', padding:16, display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:44, height:44, borderRadius:999, background:'var(--yellow-400)', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center', animation:'kapri-pop .4s var(--ease-spring)' }}>
          <Ico name="check-circle" size={24} color="var(--purple-700)" />
        </div>
        <div>
          <p style={{ margin:0, color:'#fff', fontWeight:700, fontSize:16 }}>Order Ready! 🎉</p>
          <p style={{ margin:'2px 0 0', color:'rgba(249,219,9,0.85)', fontSize:12, display:'flex', alignItems:'center', gap:4 }}>
            <Ico name="package" size={12} /> Ref: {order.ref}
          </p>
        </div>
      </div>
      <div style={{ padding:'12px 16px 0' }}>
        <p style={{ margin:0, fontSize:12, color:'var(--muted)', background:'var(--surface)', borderRadius:'var(--radius-md)', padding:'8px 12px', lineHeight:1.5 }}>
          💡 Your tracking number (VIMP…) arrives by email after payment — {order.ref} is just your order reference.
        </p>
      </div>
      <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:8, borderTop:'1px solid var(--line)', marginTop:12 }}>
        <Summary l="Items" v={LKR(order.subtotal)} />
        <Summary l="Delivery (calculated fee)" v={LKR(order.rate)} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, borderTop:'1px solid var(--line)' }}>
          <span style={{ fontWeight:700, color:'var(--ink)' }}>Total</span>
          <span style={{ fontWeight:700, fontSize:20, color:'var(--purple-700)' }}>{LKR(order.total)}</span>
        </div>
      </div>
      <div style={{ padding:'4px 16px 16px', display:'flex', flexDirection:'column', gap:10 }}>
        {paid ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:14, borderRadius:'var(--radius-md)',
            background:'var(--success-tint)', color:'var(--success)', fontWeight:700, fontSize:15, border:'1px solid var(--success)' }}>
            <Ico name="check-circle" size={18} color="var(--success)" /> Payment received — thank you! 🎉
          </div>
        ) : (
          <button onClick={() => onPay?.(order)} disabled={secs === 0}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:14, borderRadius:'var(--radius-md)',
              background: secs === 0 ? 'var(--line)' : 'var(--yellow-400)',
              color: secs === 0 ? 'var(--muted)' : 'var(--purple-700)',
              fontWeight:700, fontSize:16, border:'none',
              cursor: secs === 0 ? 'not-allowed' : 'pointer', fontFamily:'var(--font-sans)', transition:'background .2s' }}>
            {secs === 0 ? 'Link Expired' : 'Pay Now on Kapruka'} <Ico name="arrow-right" size={16} />
          </button>
        )}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontSize:12,
          color: paid ? 'var(--success)' : (secs === 0 ? 'var(--error)' : warn ? 'var(--warn)' : 'var(--muted)'),
          fontWeight: (warn || paid || secs === 0) ? 600 : 400 }}>
          <Ico name={paid ? 'check' : secs === 0 ? 'x' : 'clock'} size={12} />
          {paid ? 'Paid · tracking enabled' : secs === 0 ? 'Payment link expired' : `Price locked · ${mm}:${ss}`}
        </div>
      </div>
    </div>
  )
}
