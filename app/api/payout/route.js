import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendPayout } from '@/lib/payaza'

export async function POST(request) {
  try {
    const { jobId } = await request.json()

    // Get job details
    const { data: job } = await supabase
      .from('jobs')
      .select('*, users(*)')
      .eq('id', jobId)
      .single()

    if (!job) throw new Error('Job not found')
    if (job.status !== 'delivered') throw new Error('Job not marked as delivered yet')

    // Calculate payout — deduct 1.5% GigPay fee
    const fee = job.amount * 0.015
    const netAmount = job.amount - fee

    // Send payout via Payaza
    const payout = await sendPayout(
      netAmount, // in Naira
      job.users.bank_code,
      job.users.account_number,
      `GigPay payout - ${job.title}`
    )

    // Update job status
    await supabase
      .from('jobs')
      .update({
        status: 'paid_out',
        paid_out_at: new Date().toISOString()
      })
      .eq('id', jobId)

    return NextResponse.json({ success: true, payout })

  } catch (error) {
    console.error('Payout error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}