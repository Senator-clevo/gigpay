import { NextResponse } from 'next/server'

export async function POST(request) {
  const body = await request.json()
  console.log('=== PAYAZA DEBUG WEBHOOK ===')
  console.log(JSON.stringify(body, null, 2))
  console.log('=== END DEBUG ===')
  return NextResponse.json({ received: true })
}
