import * as React from 'react';

/**
 * Category / occasion tile — a colour emoji over a small label.
 * Used in grids for wayfinding (Cakes, Flowers, Birthday…).
 */
export interface CategoryTileProps {
  /** Emoji glyph, e.g. "🎂". */
  emoji: string;
  label: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function CategoryTile(props: CategoryTileProps): React.ReactElement;
