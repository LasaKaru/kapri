import * as React from 'react';

/**
 * Kapruka primary action button — purple, outline, ghost, or yellow CTA.
 * Rounded 14px, semibold, springs down on press.
 *
 * @startingPoint section="Core" subtitle="Brand button — 4 variants, 3 sizes" viewport="700x200"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'ghost' | 'yellow';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to container width. @default false */
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button(props: ButtonProps): React.ReactElement;
