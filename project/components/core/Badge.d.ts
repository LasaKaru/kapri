import * as React from 'react';

/**
 * Compact pill for discounts, stock state, image-overlay category tags,
 * and the yellow cart / LIVE indicators.
 */
export interface BadgeProps {
  /** @default "neutral" */
  tone?: 'neutral' | 'purple' | 'accent' | 'success' | 'warn' | 'error' | 'ink';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Badge(props: BadgeProps): React.ReactElement;
