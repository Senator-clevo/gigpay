import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createVirtualAccount } from '@/lib/payaza'

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, description, amount, clientName, deadline, workerEmail, workerId } = body

    // Generate reference
    const reference = `gig_${Date.now()}`

    // 1. Create gig
    const { data: gig, error } = await supabase
      .from('jobs')  // ← FIXED table name
      .insert({
        worker_id: workerId,
        title,
        description,
        amount: amount * 100, // kobo
        client_name: clientName,
        client_email: workerEmail, // use worker email for now
        deadline,
        status: 'awaiting_payment',
        payaza_reference: reference
      })
      .select()
      .single()

    if (error) throw error

    // 2. Create Payaza virtual account
    const virtualAccount = await createVirtualAccount(
      reference,  // ← use reference not jobId
      amount * 100, // kobo
      workerEmail,
      clientName
    )

    // 3. Save virtual account
    await supabase
      .from('jobs')
      .update({
        virtual_account_number: virtualAccount?.data?.account_number,
      })
      .eq('id', gig.id)

    return NextResponse.json({
      success: true,
      gigId: gig.id,
      paymentLink: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${gig.id}`,
      virtualAccountNumber: virtualAccount?.data?.account_number,
      reference
    })

  } catch (error) {
    console.error('Create gig error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
