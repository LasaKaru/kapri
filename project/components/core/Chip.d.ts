import * as React from 'react';

/**
 * Pill button — quick-reply chips under Kapri messages and the
 * sort/refine bar on product carousels.
 */
export interface ChipProps {
  children: React.ReactNode;
  /** Solid purple when true. @default false */
  selected?: boolean;
  /** outline = white pill; tonal = purple-100 pill. @default "outline" */
  variant?: 'outline' | 'tonal';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Chip(props: ChipProps): React.ReactElement;
