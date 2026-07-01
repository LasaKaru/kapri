// Kapruka tracking numbers aren't always "VIMP…" — the confirmation email can
// also issue "VPAY…" (confirmed via Kapruka's official VPAY827982BA test order)
// and possibly other short-alpha-prefix codes. Match the general shape instead
// of hardcoding one prefix.
export const ORDER_NUMBER_RE = /\bV[A-Z]{2,5}\d[A-Z0-9]{2,}\b/i

export function extractOrderNumber(text: string): string | null {
  const match = text.match(ORDER_NUMBER_RE)
  return match ? match[0].toUpperCase() : null
}

export function looksLikeOrderNumber(value: string): boolean {
  return new RegExp(`^(?:${ORDER_NUMBER_RE.source})$`, 'i').test(value)
}
