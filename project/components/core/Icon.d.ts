import * as React from 'react';

/** Lucide-faithful outline icon (2px stroke, round caps). */
export interface IconProps {
  /** Lucide icon name, e.g. "shopping-cart", "check-circle", "truck". */
  name: string;
  /** px. @default 18 */
  size?: number;
  /** @default "currentColor" */
  color?: string;
  /** @default 2 */
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export function Icon(props: IconProps): React.ReactElement;
