import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  // Verify it's actually Vercel calling this, not a random person
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Lightweight ping — just count jobs, touches the DB without doing anything heavy
  const { count, error } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  console.log('Supabase keep-alive ping successful, jobs count:', count)
  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() })
}