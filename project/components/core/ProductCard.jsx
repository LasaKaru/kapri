import React from 'react'
import { Icon } from './Icon'
import { Badge } from './Badge'

function formatLKR(amount) {
  return `Rs. ${Number(amount).toLocaleString('en-LK')}`
}

/**
 * Product card — the atom of every carousel. White, rounded-20, purple-tinted
 * shadow, lifts on hover. Shows image, category tag, discount/stock badges,
 * name, summary, mono ID chip, price, and Add-to-Cart + open-on-Kapruka.
 */
export function ProductCard({ product, compact = false, onAdd, style = {} }) {
  const {
    name, summary, id, price, compareAtPrice, image, category,
    inStock = true, lowStock = false,
  } = product

  const [hover, setHover] = React.useState(false)
  const [added, setAdded] = React.useState(false)
  const hasDiscount = compareAtPrice && compareAtPrice > price
  const discountPct = hasDiscount ? Math.round((1 - price / compareAtPrice) * 100) : 0

  const handleAdd = () => {
    if (!inStock) return
    setAdded(true)
    onAdd && onAdd(product)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: compact ? 176 : 224,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: hover ? '0 12px 28px rgba(68,42,115,.20)' : 'var(--shadow-card)',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: compact ? 160 : 208, background: 'var(--purple-50)', overflow: 'hidden' }}>
        {image ? (
          <img src={image} alt={name} style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hover ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform var(--dur-slow) var(--ease-out)',
          }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>🎁</div>
        )}
        {category && (
          <span style={{ position: 'absolute', top: 8, left: 8 }}>
            <Badge tone="purple">{category}</Badge>
          </span>
        )}
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {!inStock && <Badge tone="ink">Out of Stock</Badge>}
          {inStock && lowStock && <Badge tone="warn">Low Stock</Badge>}
          {hasDiscount && <Badge tone="success">-{discountPct}%</Badge>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: compact ? 12 : 14, lineHeight: 1.35, color: 'var(--ink)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{name}</p>

        {!compact && summary && (
          <p style={{ margin: 0, fontSize: 11, lineHeight: 1.5, color: 'var(--muted)',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{summary}</p>
        )}

        <span style={{ alignSelf: 'flex-start', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)',
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '2px 6px' }}>{id}</span>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: compact ? 14 : 16, color: 'var(--purple-700)' }}>{formatLKR(price)}</span>
          {hasDiscount && <span style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'line-through' }}>{formatLKR(compareAtPrice)}</span>}
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 4 }}>
          <button
            onClick={handleAdd}
            disabled={!inStock}
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 0', borderRadius: 'var(--radius-md)', border: 'none',
              fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, cursor: inStock ? 'pointer' : 'not-allowed',
              color: inStock ? '#fff' : 'var(--muted)',
              background: added ? 'var(--success)' : inStock ? 'var(--purple-700)' : 'var(--line)',
              transition: 'background var(--dur-fast) var(--ease-out)',
            }}
          >
            <Icon name={added ? 'check' : 'shopping-cart'} size={14} />
            {added ? 'Added!' : 'Add to Cart'}
          </button>
          <span style={{
            width: 34, height: 34, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--muted)', cursor: 'pointer',
          }}>
            <Icon name="external-link" size={14} />
          </span>
        </div>
      </div>
    </div>
  )
}
