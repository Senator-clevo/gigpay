import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Payaza webhook received:', JSON.stringify(body))

    const event = body?.event || null
    const reference =
      body?.reference ||
      body?.merchant_reference ||
      body?.transaction_reference ||
      null
    const status = body?.status || body?.transaction_status || null

    const successEvents = [
      'charge.success',
      'payment.success',
      'virtual_account.credit',
      'collection.success'
    ]

    const successStatuses = [
      'Completed',
      'Funds Received',
      'TRANSACTION_COMPLETED',
      'TRANSACTION_SETTLED',
      'NIP_SUCCESS',
      'successful',
      'success'
    ]

    const isSuccess =
      (event && successEvents.includes(event)) ||
      (status && successStatuses.includes(status))

    if (isSuccess && reference) {
      const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('payaza_reference', reference)
        .single()

      if (error) {
        console.error('Job lookup error:', error)
      } else if (job) {
        await supabase
          .from('jobs')
          .update({ status: 'funded' })
          .eq('id', job.id)
        console.log(`Job ${job.id} funded successfully`)
      } else {
        console.log('No job found for reference:', reference)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}