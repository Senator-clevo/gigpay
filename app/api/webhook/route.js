import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Payaza webhook received:', body)

    const { transaction_reference, status, amount } = body

    if (status === 'successful' || status === 'SUCCESSFUL') {
      // Find the job by its reference
      const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('payaza_reference', transaction_reference)
        .single()

      if (job && !error) {
        // Update job status to funded
        await supabase
          .from('jobs')
          .update({ status: 'funded' })
          .eq('id', job.id)

        console.log(`Job ${job.id} funded successfully`)
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}