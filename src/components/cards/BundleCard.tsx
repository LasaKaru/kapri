'use client'
import React from 'react'
import { Ico } from '../ui/Icons'
import { LKR } from '@/lib/data'
import type { Product, Bundle } from '@/lib/types'

interface BundleCardProps {
  bundle: Bundle
  products: Product[]
  cartIds: string[]
  onAdd: (p: Product) => void
  onAddAll: () => void
  onGiftMsg: (msg: string) => void
}

export function BundleCard({ bundle, products, cartIds, onAdd, onAddAll, onGiftMsg }: BundleCardProps) {
  const total = products.reduce((s, p) => s + p.price, 0)
  return (
    <div style={{ width:'100%', maxWidth:380, background:'#fff', borderRadius:'var(--radius-lg)',
      border:'1px solid var(--line)', overflow:'hidden', boxShadow:'var(--shadow-md)' }}>
      <div style={{ padding:'14px 16px', background:'linear-gradient(120deg, var(--purple-700), var(--purple-600))' }}>
        <p style={{ margin:0, color:'#fff', fontWeight:700, fontSize:16 }}>{bundle.title}</p>
        <p style={{ margin:'5px 0 0', color:'rgba(255,255,255,0.8)', fontSize:12.5, lineHeight:1.5 }}>{bundle.blurb}</p>
      </div>
      <div style={{ padding:14, display:'flex', flexDirection:'column', gap:10 }}>
        {products.map((p) => (
          <div key={p.id} style={{ display:'flex', gap:11, alignItems:'center' }}>
            <img src={p.img} alt={p.name} style={{ width:52, height:52, borderRadius:'var(--radius-md)', objectFit:'cover', flexShrink:0 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ margin:0, fontSize:13, fontWeight:600, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</p>
              <p style={{ margin:'2px 0 0', fontSize:12, color:'var(--purple-700)', fontWeight:700 }}>{LKR(p.price)}</p>
            </div>
            <button onClick={() => onAdd(p)} style={{ width:30, height:30, borderRadius:999, border:'none', cursor:'pointer', flexShrink:0,
              background: cartIds.includes(p.id) ? 'var(--success)' : 'var(--purple-100)',
              color: cartIds.includes(p.id) ? '#fff' : 'var(--purple-700)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Ico name={cartIds.includes(p.id) ? 'check' : 'plus'} size={15} />
            </button>
          </div>
        ))}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:8, borderTop:'1px solid var(--line)' }}>
          <span style={{ fontSize:13, color:'var(--muted)' }}>Bundle total</span>
          <span style={{ fontSize:16, fontWeight:700, color:'var(--purple-700)' }}>{LKR(total)}</span>
        </div>
        <button onClick={onAddAll} style={{ width:'100%', padding:'11px', borderRadius:'var(--radius-md)', border:'none',
          background:'var(--yellow-400)', color:'var(--purple-700)', fontWeight:700, fontSize:14, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:7, fontFamily:'var(--font-sans)' }}>
          <Ico name="gift" size={16} /> Add all to cart
        </button>
        <button onClick={() => onGiftMsg(bundle.message)} style={{ width:'100%', padding:'9px', borderRadius:'var(--radius-md)',
          border:'1px solid var(--purple-200)', background:'#fff', color:'var(--purple-700)', fontWeight:600, fontSize:13,
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontFamily:'var(--font-sans)' }}>
          <Ico name="wand" size={15} /> Use the suggested gift message
        </button>
      </div>
    </div>
  )
}
