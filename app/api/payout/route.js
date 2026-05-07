import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { sendPayout } from '@/lib/payaza'

export async function POST(request) {
  try {
    const body = await request.json()
    const { jobId } = body

    const supabase = createServerSupabase()

    // Get job
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })
    }

    // Get worker bank details
    const { data: worker } = await supabase
      .from('users')
      .select('bank_code, account_number, name')
      .eq('id', job.worker_id)
      .single()

    if (!worker || !worker.account_number) {
      return NextResponse.json({ success: false, error: 'Worker bank details not found' }, { status: 400 })
    }

    // Calculate payout (amount - 1.5% fee)
    const fee = job.amount * 0.015
    const payoutAmount = job.amount - fee

    // Initiate payout via Payaza
    const payoutResponse = await sendPayout(
      payoutAmount,
      worker.bank_code,
      worker.account_number,
      `Payment for ${job.title}`
    )

    if (!payoutResponse || payoutResponse.resp_code !== '09') {
      return NextResponse.json({ success: false, error: 'Payout failed', details: payoutResponse }, { status: 400 })
    }

    // Update job status
    await supabase
      .from('jobs')
      .update({ status: 'paid_out' })
      .eq('id', jobId)

    return NextResponse.json({ success: true, payoutResponse })
  } catch (error) {
    console.error('Payout error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}