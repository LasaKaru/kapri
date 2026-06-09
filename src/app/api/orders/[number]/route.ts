import { NextResponse } from 'next/server'
import { getOrderFromDb } from '@/lib/db'

export async function GET(request: Request, { params }: { params: { number: string } }) {
  try {
    const order = await getOrderFromDb(params.number)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
