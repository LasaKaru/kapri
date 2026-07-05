'use client'
import React from 'react'
import { Ico } from './Icons'
import { OrderTracker } from '../cards/OrderTracker'
import { LKR } from '@/lib/data'
import type { CartItem, PlacedOrder } from '@/lib/types'

interface DesktopSidePanelProps {
  cart: CartItem[]
  trackedOrders: any[]
  hasPurchased?: boolean
  onManageCart: () => void
  onCheckout: () => void
  onRemoveItem: (id: string) => void
  onTrackOrder: (num: string) => void
}

export function DesktopSidePanel({ cart, trackedOrders, hasPurchased, onManageCart, onCheckout, onRemoveItem, onTrackOrder }: DesktopSidePanelProps) {
  const subtotal = cart.reduce((acc, it) => acc + (it.p.price * it.qty), 0)
  const cartCount = cart.reduce((acc, it) => acc + it.qty, 0)

  return (
    <div style={{ width: 340, flexShrink: 0, borderLeft: '1px solid var(--line)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* CART CARD */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--purple-900)', fontWeight: 700, fontSize: 14 }}>
              <Ico name="cart" size={16} />
              Your Cart {cartCount > 0 && `(${cartCount})`}
            </div>
            {cartCount > 0 && (
              <button onClick={onManageCart} style={{ background: 'none', border: 'none', color: 'var(--purple-700)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                Manage
              </button>
            )}
          </div>
          
          {cartCount === 0 ? (
            <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--purple-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple-300)' }}>
                <Ico name="package" size={24} />
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                Your cart is empty.<br/>Ask Kapri for ideas! 🎁
              </div>
            </div>
          ) : (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto' }} className="scrollbar-hide">
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <img src={item.p.img} alt={item.p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--line)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.p.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>×{item.qty} · {LKR(item.p.price)}</div>
                    </div>
                    <button onClick={() => onRemoveItem(item.p.id)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 4, display: 'flex', opacity: 0.7 }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.opacity = '1' }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.opacity = '0.7' }}>
                      <Ico name="trash" size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Subtotal</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--purple-900)' }}>{LKR(subtotal)}</span>
                </div>
                <button onClick={onCheckout} style={{ width: '100%', padding: '12px 0', background: 'var(--purple-700)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}>
                  Checkout <Ico name="arrow-right" size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TRACK ORDER FORM */}
        <div style={{ padding: '16px', background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--purple-900)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Ico name="search" size={14} /> Track your order
          </div>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            const form = e.target as HTMLFormElement; 
            const input = form.elements.namedItem('trackNum') as HTMLInputElement; 
            if (input.value.trim()) { 
              onTrackOrder(input.value.trim()); 
              input.value = ''; 
            } 
          }} style={{ display: 'flex', gap: 8 }}>
            <input name="trackNum" type="text" placeholder="e.g. VIMP12345" style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', fontSize: 13, outline: 'none' }} />
            <button type="submit" style={{ padding: '8px 16px', background: 'var(--purple-700)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--purple-800)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--purple-700)'}>Find</button>
          </form>
        </div>

        {/* CHECK EMAIL NOTIFICATION */}
        {hasPurchased && (
          <div style={{ padding: '16px', background: 'var(--success-50)', border: '1px solid var(--success-200)', borderRadius: 'var(--radius-xl)', display: 'flex', gap: 12, alignItems: 'flex-start', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--success-600)', marginTop: 2 }}><Ico name="check-circle" size={18} /></div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--success-700)', marginBottom: 4 }}>Order Placed!</div>
              <div style={{ fontSize: 12.5, color: 'var(--success-600)', lineHeight: 1.4 }}>
                Please check your email for tracking details. You can track your order at any time using the form above.
              </div>
            </div>
          </div>
        )}

        {/* TRACKED ORDERS */}
        {trackedOrders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {trackedOrders.map((o, idx) => (
              <OrderTracker key={idx} order={o} />
            ))}
          </div>
        )}

        {/* TIP BOX */}
        <div style={{ padding: 12, borderRadius: 'var(--radius-lg)', border: '1px dashed var(--purple-300)', background: 'rgba(255,255,255,0.5)', display: 'flex', gap: 10 }}>
          <div style={{ marginTop: 2, color: 'var(--purple-400)' }}><Ico name="sparkles" size={16} /></div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
            Tip: tell me the <strong style={{ color: 'var(--ink)' }}>person, occasion and budget</strong> in one message — I'll do the rest. — Kapri 🛍️
          </div>
        </div>

      </div>
    </div>
  )
}
