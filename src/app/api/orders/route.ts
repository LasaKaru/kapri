import { NextResponse } from 'next/server'
import { saveOrderToDb } from '@/lib/db'
import type { PlacedOrder } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const order: PlacedOrder = await request.json()
    if (!order || !order.number) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
    }
    
    await saveOrderToDb(order)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
