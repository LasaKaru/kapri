import * as React from 'react';

export interface KaprukaProductLite {
  id: string;
  name: string;
  summary?: string;
  /** Amount in LKR (formatted as Rs. with en-LK grouping). */
  price: number;
  /** Original price for a strike-through + discount badge. */
  compareAtPrice?: number;
  image?: string;
  category?: string;
  inStock?: boolean;
  lowStock?: boolean;
}

/**
 * Product card — the atom of every Kapri carousel. Lifts on hover, shows
 * category/discount/stock badges, mono ID chip, price, and an Add-to-Cart CTA
 * that flips to a green "Added!" state.
 *
 * @startingPoint section="Commerce" subtitle="Product card with add-to-cart" viewport="700x320"
 */
export interface ProductCardProps {
  product: KaprukaProductLite;
  /** Narrow 176px variant for dense carousels. @default false */
  compact?: boolean;
  onAdd?: (product: KaprukaProductLite) => void;
  style?: React.CSSProperties;
}

export function ProductCard(props: ProductCardProps): React.ReactElement;
