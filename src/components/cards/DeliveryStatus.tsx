'use client'
import React from 'react'
import { Ico } from '../ui/Icons'
import { LKR } from '@/lib/data'

interface DeliveryStatusProps {
  city: string
  date: string
  available: boolean
  rate?: number
  reason?: string | null
  nextDate?: string | null
  perishableWarning?: string | null
}

export function DeliveryStatus({ city, date, available, rate, reason, nextDate, perishableWarning }: DeliveryStatusProps) {
  return (
    <div style={{ width:'100%', maxWidth:360, background:'#fff', borderRadius:'var(--radius-lg)', overflow:'hidden',
      border:`2px solid ${available ? 'var(--success)' : 'var(--error)'}`, boxShadow:'var(--shadow-md)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px',
        background: available ? 'var(--success-tint)' : 'var(--error-tint)' }}>
        <Ico name={available ? 'check-circle' : 'x'} size={20} color={available ? 'var(--success)' : 'var(--error)'} />
        <div>
          <p style={{ margin:0, fontSize:14, fontWeight:700, color: available ? 'var(--success)' : 'var(--error)' }}>
            {available ? '✅ Delivery Available!' : '❌ Not Available'}
          </p>
          <p style={{ margin:'2px 0 0', fontSize:12, color:'var(--muted)', display:'flex', alignItems:'center', gap:4 }}>
            <Ico name="calendar" size={12} /> {city} · {date}
          </p>
        </div>
      </div>
      <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:10 }}>
        {available && rate != null && (
          <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:14 }}>
              <span style={{ display:'flex', alignItems:'center', gap:6, color:'var(--muted)' }}>
                <Ico name="truck" size={16} color="var(--purple-700)" /> Delivery fee (estimated base)
              </span>
              <span style={{ fontWeight:700, color:'var(--purple-700)' }}>{LKR(rate)}</span>
            </div>
            <p style={{ margin:0, fontSize:11, color:'var(--muted)', lineHeight:1.3 }}>
              * Final delivery fee calculates at checkout based on weight and exact distance.
            </p>
          </>
        )}
        {reason && (
          <div style={{ padding:'8px 12px', borderRadius:'var(--radius-md)', background:'var(--error-tint)' }}>
            <p style={{ margin:0, fontSize:12, color:'var(--error)' }}>{reason}</p>
          </div>
        )}
        {nextDate && (
          <p style={{ margin:0, fontSize:12, color:'var(--muted)' }}>
            Next available: <strong style={{ color:'var(--ink)' }}>{nextDate}</strong>
          </p>
        )}
        {perishableWarning && (
          <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'10px 12px',
            borderRadius:'var(--radius-md)', background:'var(--warn-tint)', border:'1px solid var(--yellow-200)' }}>
            <Ico name="warn" size={16} color="var(--warn)" style={{ marginTop:1 }} />
            <p style={{ margin:0, fontSize:12, lineHeight:1.5, color:'#92400E' }}>{perishableWarning}</p>
          </div>
        )}
      </div>
    </div>
  )
}
