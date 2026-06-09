'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Ico } from '../ui/Icons'
import { ProductCard } from './ProductCard'
import type { Product } from '@/lib/types'

interface ProductCarouselProps {
  products: Product[]
  cartIds: string[]
  onAdd: (p: Product) => void
  onOpen: (p: Product) => void
}

export function ProductCarousel({ products, cartIds, onAdd, onOpen }: ProductCarouselProps) {
  const [sort, setSort] = useState<'rel'|'asc'|'desc'>('rel')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  let list = [...products]
  if (sort === 'asc') list.sort((a, b) => a.price - b.price)
  if (sort === 'desc') list.sort((a, b) => b.price - a.price)

  const pills: [typeof sort, string][] = [['rel','Relevance'],['asc','Price ↑'],['desc','Price ↓']]

  const updateEdges = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setEdges({ left: el.scrollLeft > 8, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8 })
  }, [])

  useEffect(() => {
    updateEdges()
    const t = setTimeout(updateEdges, 200)
    return () => clearTimeout(t)
  }, [updateEdges, sort, list.length])

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 234, behavior: 'smooth' })
  }

  const Arrow = ({ dir }: { dir: number }) => (
    <button onClick={() => scrollBy(dir)} aria-label={dir < 0 ? 'Previous' : 'Next'}
      style={{ position:'absolute', top:94, [dir < 0 ? 'left' : 'right']:-6, transform:'translateY(-50%)', zIndex:4,
        width:38, height:38, borderRadius:999, background:'#fff', border:'1px solid var(--line)',
        boxShadow:'var(--shadow-lg)', display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', color:'var(--purple-700)' }}>
      <Ico name={dir < 0 ? 'chevron-left' : 'chevron-right'} size={20} color="var(--purple-700)" />
    </button>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:9, width:'100%' }}>
      <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
        {pills.map(([id, l]) => (
          <button key={id} onClick={() => setSort(id)}
            style={{ fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:999, cursor:'pointer', border:'1px solid',
              ...(sort === id
                ? { background:'var(--purple-700)', color:'#fff', borderColor:'var(--purple-700)' }
                : { background:'var(--purple-100)', color:'var(--purple-700)', borderColor:'var(--purple-200)' }) }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ position:'relative' }}>
        {edges.left && <Arrow dir={-1} />}
        {edges.right && <Arrow dir={1} />}
        <div ref={scrollRef} onScroll={updateEdges} className="scrollbar-hide"
          style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:6, scrollSnapType:'x proximity' }}>
          {list.map((p) => (
            <ProductCard key={p.id} p={p} inCart={cartIds.includes(p.id)} onAdd={onAdd} onOpen={onOpen} />
          ))}
        </div>
      </div>
      <p style={{ margin:0, fontSize:11.5, color:'var(--muted)' }}>
        {list.length} results · {edges.right ? 'use the arrows or swipe →' : 'swipe to browse'}
      </p>
    </div>
  )
}
