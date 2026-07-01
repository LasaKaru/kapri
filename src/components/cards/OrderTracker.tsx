'use client'
import React, { useState, useEffect } from 'react'
import { Ico } from '../ui/Icons'
import { LKR } from '@/lib/data'
import { looksLikeOrderNumber } from '@/lib/order-number'
import type { PlacedOrder } from '@/lib/types'

interface OrderTrackerProps {
  order: PlacedOrder
}

const STAGES: [string, string][] = [
  ['Received','package'],
  ['Confirmed','check-circle'],
  ['Out for Delivery','truck'],
  ['Delivered','gift'],
]

export function OrderTracker({ order: initialOrder }: OrderTrackerProps) {
  const [order, setOrder] = useState<PlacedOrder>(initialOrder)

  useEffect(() => {
    if (order.number && looksLikeOrderNumber(order.number)) {
      fetch(`/api/orders/${order.number}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error && data.number) {
            setOrder(data)
          }
        })
        .catch(err => console.error('Failed to fetch order from DB:', err))
    }
  }, [order.number])

  return (
    <div style={{ width:'100%', maxWidth:360, background:'#fff', borderRadius:'var(--radius-lg)',
      overflow:'hidden', border:'1px solid var(--line)', boxShadow:'var(--shadow-md)' }}>
      <div style={{ background:'var(--purple-700)', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ margin:0, color:'#fff', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', gap:6 }}>
            <Ico name="package" size={16} color="var(--yellow-400)" /> {order.number}
          </p>
          <p style={{ margin:'2px 0 0', color:'rgba(249,219,9,0.85)', fontSize:12 }}>{order.statusDisplay}</p>
        </div>
        {order.live && (
          <span style={{ padding:'3px 9px', borderRadius:999, background:'var(--yellow-400)', color:'var(--purple-700)',
            fontSize:10, fontWeight:700, animation:'kapri-pulse 1.6s infinite' }}>● LIVE</span>
        )}
      </div>

      <div style={{ padding:'20px 16px 10px' }}>
        <div style={{ position:'relative', display:'flex', justifyContent:'space-between' }}>
          <div style={{ position:'absolute', top:16, left:16, right:16, height:2, background:'var(--line)' }} />
          <div style={{ position:'absolute', top:16, left:16, height:2, background:'var(--success)',
            width:`calc(${(order.stage / 3) * 100}% - ${(order.stage / 3) * 32}px)`,
            transition:'width .7s var(--ease-out)' }} />
          {STAGES.map(([label, icon], i) => {
            const done = i <= order.stage
            return (
              <div key={label} style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:6, zIndex:1 }}>
                <div style={{ width:32, height:32, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center',
                  background: done ? 'var(--success)' : 'var(--surface)',
                  border: done ? 'none' : '1px solid var(--line)',
                  boxShadow: i === order.stage ? '0 0 0 4px rgba(31,157,87,.2)' : 'none' }}>
                  <Ico name={icon} size={15} color={done ? '#fff' : 'var(--muted)'} />
                </div>
                <span style={{ fontSize:9.5, fontWeight:500, textAlign:'center', maxWidth:58, lineHeight:1.2,
                  color: done ? 'var(--ink)' : 'var(--muted)' }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ padding:'8px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderRadius:'var(--radius-md)',
          background:'var(--yellow-100)', border:'1px solid var(--yellow-300)' }}>
          <Ico name="gift" size={16} color="var(--purple-700)" />
          <span style={{ fontSize:12, color:'var(--ink)', fontWeight:500 }}>Delivery photo available — proof of a delivered smile 🎁</span>
        </div>
      </div>

      <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line)', display:'flex', flexDirection:'column', gap:8, fontSize:13.5 }}>
        {([['clock','Ordered',order.orderDate],['truck','Delivery',order.deliveryDate],['pin','To',order.recipient]] as [string,string,string][]).map(([ic,l,v]) => (
          <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ display:'flex', alignItems:'center', gap:6, color:'var(--muted)' }}>
              <Ico name={ic} size={14} /> {l}
            </span>
            <span style={{ color:'var(--ink)', fontWeight:500, textAlign:'right' }}>{v}</span>
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', paddingTop:8, borderTop:'1px solid var(--line)' }}>
          <span style={{ color:'var(--muted)' }}>Total paid</span>
          <span style={{ color:'var(--purple-700)', fontWeight:700 }}>{LKR(order.amount)}</span>
        </div>
      </div>

      {order.items && order.items.length > 0 && (
        <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line)' }}>
          <p style={{ margin:'0 0 9px', fontSize:11, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--muted)' }}>
            {order.items.length} item{order.items.length > 1 ? 's' : ''} in this order
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {order.items.map((it, idx) => {
              const itemStatus = ['Preparing','Packed','Out for delivery','Delivered'][order.stage] || 'Preparing'
              return (
                <div key={idx} style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <img src={it.img} alt={it.name} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display='none' }}
                    style={{ width:42, height:42, borderRadius:'var(--radius-md)', objectFit:'cover', flexShrink:0, background:'var(--purple-50)' }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:0, fontSize:12.5, fontWeight:600, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.name}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, fontWeight:600, padding:'2px 7px', borderRadius:999,
                        background: order.stage >= 3 ? 'rgba(31,157,87,.12)' : 'var(--purple-100)',
                        color: order.stage >= 3 ? 'var(--success)' : 'var(--purple-700)' }}>
                        <span style={{ width:5, height:5, borderRadius:999, background: order.stage >= 3 ? 'var(--success)' : 'var(--purple-500)' }} />
                        {itemStatus}
                      </span>
                      <span style={{ fontSize:11, color:'var(--muted)' }}>Qty {it.qty}</span>
                      {it.icing && (
                        <span style={{ fontSize:10, color:'var(--purple-700)', background:'var(--purple-50)', padding:'1px 6px', borderRadius:6,
                          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:110 }}>✍️ {it.icing}</span>
                      )}
                    </div>
                  </div>
                  {it.price != null && (
                    <span style={{ fontSize:12, fontWeight:600, color:'var(--ink)', flexShrink:0 }}>{LKR(it.price * it.qty)}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
