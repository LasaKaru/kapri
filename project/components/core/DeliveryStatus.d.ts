import * as React from 'react';

/**
 * Delivery availability card — generative UI for a delivery check. Green
 * frame when available, red when not. The perishable warning is amber and
 * advisory only (delivery is still possible) — never render it as an error.
 */
export interface DeliveryStatusProps {
  city: string;
  /** Human-readable date, e.g. "Sat, 14 Jun 2026". */
  date: string;
  /** @default true */
  available?: boolean;
  /** Flat delivery fee in LKR (shown when available). */
  rate?: number;
  /** Reason shown in red when unavailable. */
  reason?: string;
  /** Suggested fallback date when unavailable. */
  nextAvailableDate?: string;
  /** Amber advisory note for cakes/flowers/combos. */
  perishableWarning?: string;
  style?: React.CSSProperties;
}

export function DeliveryStatus(props: DeliveryStatusProps): React.ReactElement;
