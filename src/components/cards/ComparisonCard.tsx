'use client'
import React from 'react'
import { ProductCard } from './ProductCard'
import type { Product } from '@/lib/types'
import { Ico } from '../ui/Icons'

export interface ComparisonCardProps {
  products: { product: Product; pros: string[]; cons: string[] }[]
  cartIds: string[]
  onAdd: (p: Product) => void
  onOpen: (p: Product) => void
  favorites?: string[]
  onToggleFavorite?: (p: Product) => void
}

export function ComparisonCard({ products, cartIds, onAdd, onOpen, favorites = [], onToggleFavorite }: ComparisonCardProps) {
  if (!products || products.length === 0) return null

  return (
    <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, maxWidth: '100vw', scrollSnapType: 'x mandatory' }}>
      {products.map((item, idx) => {
        const inCart = cartIds.includes(item.product.id)
        const isFav = favorites.includes(item.product.id)

        return (
          <div key={item.product.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: 12, scrollSnapAlign: 'start' }}>
            <ProductCard
              p={item.product}
              inCart={inCart}
              onAdd={onAdd}
              onOpen={onOpen}
              isFavorite={isFav}
              onToggleFavorite={onToggleFavorite}
            />
            
            <div style={{ 
              background: '#fff', 
              border: '1px solid var(--line)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              width: 210
            }}>
              {item.pros && item.pros.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h4 style={{ margin: 0, fontSize: 12, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Pros</h4>
                  {item.pros.map((pro, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, color: 'var(--ink)', lineHeight: 1.3 }}>
                      <span style={{ color: 'var(--success)', marginTop: 1 }}><Ico name="check" size={14} /></span>
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {item.cons && item.cons.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h4 style={{ margin: 0, fontSize: 12, color: 'var(--error)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Cons</h4>
                  {item.cons.map((con, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, color: 'var(--ink)', lineHeight: 1.3 }}>
                      <span style={{ color: 'var(--error)', marginTop: 1 }}><Ico name="x" size={14} /></span>
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
