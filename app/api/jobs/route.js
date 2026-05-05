import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createVirtualAccount } from '@/lib/payaza'

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, description, amount, clientName, deadline, workerEmail, workerName, workerId } = body

    // Step 1 — save job to Supabase first
    const { data: job, error } = await supabase
      .from('jobs')
      .insert({
        worker_id: workerId,
        title,
        description,
        amount,
        client_name: clientName,
        deadline,
        status: 'awaiting_payment'
      })
      .select()
      .single()

    if (error) throw error

    // Step 2 — create Payaza virtual account for this job
    const virtualAccount = await createVirtualAccount(
      job.id,
      amount,
      workerEmail,
      clientName
    )

    // Step 3 — save the virtual account details back to the job
    await supabase
      .from('jobs')
      .update({
        virtual_account_number: virtualAccount?.data?.account_number,
        payaza_reference: job.id
      })
      .eq('id', job.id)

    return NextResponse.json({
      success: true,
      jobId: job.id,
      paymentLink: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${job.id}`,
      virtualAccount: virtualAccount?.data
    })

  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}