import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Webhook received:', JSON.stringify(body))

    // ✅ Validate HMAC signature to prevent fake webhooks
    const signature = request.headers.get('x-payaza-signature')
    if (signature) {
      const secretKey = process.env.PAYAZA_SECRET_KEY
      const payload = JSON.stringify(body)
      
      const computedSignature = crypto
        .createHmac('sha512', secretKey)
        .update(payload, 'utf8')
        .digest('base64')
      
      if (computedSignature !== signature) {
        console.error('Webhook signature mismatch. Possible fake webhook.')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const supabase = createServerSupabase()

    const reference = 
      body?.merchant_reference ||
      body?.transaction_reference ||
      body?.account_reference ||
      null

    const status = body?.status || body?.transaction_status || null

    console.log('Reference:', reference, 'Status:', status)

    if (reference && (status === 'Completed' || status === 'Funds Received')) {
      const jobId = reference.split('_')[0]

      const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .or(`id.eq.${jobId},payaza_reference.eq.${reference}`)
        .single()

      if (job) {
        await supabase
          .from('jobs')
          .update({ status: 'funded' })
          .eq('id', job.id)
        console.log('Job funded:', job.id)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}