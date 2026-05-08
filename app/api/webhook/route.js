import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Webhook received:', JSON.stringify(body))

    const supabase = createServerSupabase()

    const reference =
      body?.merchant_reference ||
      body?.transaction_reference ||
      null

    const status = body?.status || body?.transaction_status || null

    console.log('Reference:', reference, 'Status:', status)

    if (reference && (status === 'Completed' || status === 'Funds Received')) {
      const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .or(`id.eq.${reference},payaza_reference.eq.${reference}`)
        .single()

      if (job) {
        await supabase
          .from('jobs')
          .update({ status: 'funded' })
          .eq('id', job.id)
        console.log('Job funded:', job.id)
      } else {
        console.log('No job found for reference:', reference)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}