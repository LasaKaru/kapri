'use client'
import React, { useState } from 'react'
import { Ico } from '../ui/Icons'
import type { OrderData } from '@/lib/types'

interface PaymentFrameProps {
  order: OrderData
  onClose: () => void
}

/**
 * In-app payment modal that loads the REAL Kapruka click-to-pay page
 * (order.url → continue_order.jsp → secure payment) inside a responsive,
 * sandboxed iframe, so the customer pays without leaving the Kapri app.
 *
 * The iframe is sandboxed WITHOUT `allow-top-navigation`, which lets the
 * Kapruka page run scripts/forms normally but prevents it from navigating
 * (frame-busting) the parent app away. A "new tab" fallback is always
 * offered in case a payment step (e.g. a 3-D Secure bank redirect) needs a
 * full top-level window.
 */
export function PaymentFrame({ order, onClose }: PaymentFrameProps) {
  const [loading, setLoading] = useState(true)
  const url = order.url || ''

  return (
    <div onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:80, display:'flex', alignItems:'center', justifyContent:'center',
        background:'rgba(36,21,68,0.55)', backdropFilter:'blur(3px)', animation:'kapri-up .3s var(--ease-out)' }}>
      <div onClick={(e) => e.stopPropagation()} className="kapri-modal"
        style={{ width:'100%', maxWidth:480, height:'100%', maxHeight:'100%', display:'flex', flexDirection:'column',
          background:'#fff', overflow:'hidden', boxShadow:'var(--shadow-xl)' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'var(--purple-700)', color:'#fff', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, minWidth:0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kapruka-logo.jpg" alt="Kapruka" style={{ height:22, borderRadius:4 }} />
            <div style={{ minWidth:0 }}>
              <p style={{ margin:0, fontSize:13, fontWeight:600 }}>Secure Checkout</p>
              <p style={{ margin:'1px 0 0', fontSize:11, color:'rgba(255,255,255,0.7)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {order.ref} · Rs. {Number(order.total).toLocaleString('en-LK')}
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background:'none', border:'none', color:'#fff', cursor:'pointer', padding:4, flexShrink:0 }}>
            <Ico name="x" size={20} />
          </button>
        </div>

        {/* Payment page (real Kapruka URL) */}
        <div style={{ flex:1, position:'relative', background:'var(--surface)' }}>
          {loading && (
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, color:'var(--muted)' }}>
              <div style={{ width:34, height:34, borderRadius:999, border:'3px solid var(--purple-100)', borderTopColor:'var(--purple-700)', animation:'kapri-spin 0.8s linear infinite' }} />
              <p style={{ margin:0, fontSize:13 }}>Loading secure payment…</p>
            </div>
          )}
          {url && (
            <iframe
              src={url}
              title="Kapruka Secure Payment"
              onLoad={() => setLoading(false)}
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              style={{ width:'100%', height:'100%', border:'none', display:'block' }}
            />
          )}
        </div>

        {/* Fallback / reassurance footer */}
        <div style={{ flexShrink:0, padding:'10px 16px', borderTop:'1px solid var(--line)', background:'#fff',
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:'var(--muted)' }}>
            <Ico name="check-circle" size={12} /> Processed securely by Kapruka
          </span>
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:600, color:'var(--purple-700)', textDecoration:'none', whiteSpace:'nowrap' }}>
            Open in new tab <Ico name="arrow-right" size={13} />
          </a>
        </div>
      </div>
    </div>
  )
}
