import React from 'react'
import { Icon } from './Icon'

function formatLKR(amount) {
  return `Rs. ${Number(amount).toLocaleString('en-LK')}`
}

/**
 * Delivery availability card — generative UI for kapruka_check_delivery.
 * Green 2px border + soft header when available, red when not. Shows flat
 * delivery rate, and an amber (advisory, NOT error) perishable warning.
 */
export function DeliveryStatus({
  city, date, available = true, rate, reason, nextAvailableDate, perishableWarning, style = {},
}) {
  return (
    <div style={{
      width: '100%', maxWidth: 360, background: '#fff', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      border: `2px solid ${available ? 'var(--success)' : 'var(--error)'}`,
      boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-sans)', ...style,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        background: available ? 'var(--success-tint)' : 'var(--error-tint)' }}>
        <Icon name={available ? 'check-circle' : 'x-circle'} size={20} color={available ? 'var(--success)' : 'var(--error)'} />
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: available ? 'var(--success)' : 'var(--error)' }}>
            {available ? 'Delivery Available!' : 'Delivery Not Available'}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="calendar" size={12} /> {city} · {date}
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {available && rate != null && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}>
              <Icon name="truck" size={16} color="var(--purple-700)" /> Delivery fee (flat per order)
            </span>
            <span style={{ fontWeight: 700, color: 'var(--purple-700)' }}>{formatLKR(rate)}</span>
          </div>
        )}

        {reason && (
          <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--error-tint)' }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--error)' }}>{reason}</p>
          </div>
        )}

        {nextAvailableDate && (
          <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>
            Next available: <strong style={{ color: 'var(--ink)' }}>{nextAvailableDate}</strong>
          </p>
        )}

        {perishableWarning && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px',
            borderRadius: 'var(--radius-md)', background: 'var(--warn-tint)', border: '1px solid var(--yellow-200)' }}>
            <Icon name="alert-triangle" size={16} color="var(--warn)" style={{ marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: '#92400E' }}>{perishableWarning}</p>
          </div>
        )}
      </div>
    </div>
  )
}
