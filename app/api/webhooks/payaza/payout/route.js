import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Payaza payout webhook received:', body)

    const {
      event,
      reference,
      transaction_reference,
      transaction_status,
      response_status
    } = body

    const successEvents = [
      'payout.success',
      'payment.payout.success',
      'payout_initiated',
      'payout.completed'
    ]

    const successStatuses = [
      'NIP_SUCCESS',
      'TRANSACTION_INITIATED',
      'TRANSACTION_COMPLETED',
      'TRANSACTION_SETTLED',
      'TRANSACTION_INITIATED'
    ]

    const isSuccessful = successEvents.includes(event) ||
      successStatuses.includes(transaction_status) ||
      successStatuses.includes(response_status)

    const webhookReference = reference || transaction_reference

    if (isSuccessful && webhookReference) {
      const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('payaza_reference', webhookReference)
        .single()

      if (error) {
        console.error('Payout webhook job lookup error:', error)
      } else if (job) {
        await supabase
          .from('jobs')
          .update({
            status: 'paid_out',
            paid_out_at: new Date().toISOString()
          })
          .eq('id', job.id)

        console.log(`Job ${job.id} marked paid_out by payout webhook`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Payaza payout webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
