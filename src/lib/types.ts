export type Lang = 'en' | 'si' | 'tl'

export interface Product {
  id: string
  name: string
  summary: string
  price: number
  was?: number
  cat: string
  img: string
  low?: boolean
  inStock?: boolean
  perishable?: boolean
  url?: string
  occ?: string[]
}

export interface CartItem {
  p: Product
  qty: number
  icing: string
}

export interface DateItem {
  iso: string
  label: string
  day: number
  mon: string
  disabled: boolean
}

export interface OrderData {
  ref: string
  city: string
  date?: DateItem
  rate: number
  recipient: string
  phone: string
  address: string
  notes: string
  sender: string
  msg: string
  items: CartItem[]
  subtotal: number
  total: number
  perishable: boolean
  /** Real Kapruka click-to-pay URL returned by kapruka_create_order (MCP tier).
   *  When present, the CheckoutCard "Pay Now" button opens this instead of the
   *  simulated client-side payment used by the scripted demo flow. */
  url?: string
}

export interface OrderItem {
  img: string
  name: string
  qty: number
  price: number
  icing?: string
}

export interface PlacedOrder {
  number: string
  statusDisplay: string
  stage: number
  live: boolean
  orderDate: string
  deliveryDate: string
  recipient: string
  amount: number
  items: OrderItem[]
}

// Card union types
export type CardData =
  | { type: 'carousel'; items: Product[] }
  | { type: 'bundle'; key: string }
  | { type: 'delivery'; city: string; rate: number; slow?: boolean; available?: boolean; date?: string; reason?: string | null; nextDate?: string | null; perishableWarning?: string | null }
  | { type: 'tracker'; number?: string; statusDisplay?: string; stage?: number; live?: boolean; orderDate?: string; deliveryDate?: string; recipient?: string; amount?: number; items?: OrderItem[] }
  | { type: 'checkout'; order: OrderData }

export interface Message {
  role: 'user' | 'kapri'
  text?: string
  image?: string // Data URI for visual search
  card?: CardData
  chips?: string[]
  lang?: Lang
  action?: string
}

export interface City {
  name: string
  rate: number
  slow?: boolean
}

export interface Category {
  name: string
  emoji: string
  q: string
  img: string
}

export interface Occasion {
  name: string
  emoji: string
  q: string
  img: string
}

export interface Bundle {
  title: string
  blurb: string
  ids: string[]
  message: string
}

export interface Season {
  key: string
  emoji: string
  greeting: string
  sub: string
  cta: string
  q: string
}

export interface EngineResponse {
  lang: Lang
  text?: string
  card?: CardData
  chips?: string[]
  action?: string
}

export interface AvailabilityResult {
  available: boolean
  rate: number
  currency: string
  reason?: string | null
  nextDate?: string | null
  perishableWarning?: string | null
}
