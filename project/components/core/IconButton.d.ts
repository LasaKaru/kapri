import * as React from 'react';

/**
 * Icon-only button for chrome and inline actions (cart, send, mic, quantity).
 */
export interface IconButtonProps {
  /** Lucide icon name (string) or a custom node. */
  icon: string | React.ReactNode;
  /** chrome = translucent-on-purple header style. @default "chrome" */
  variant?: 'chrome' | 'soft' | 'solid' | 'danger';
  /** Square px size. @default 40 */
  size?: number;
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
}

export function IconButton(props: IconButtonProps): React.ReactElement;
