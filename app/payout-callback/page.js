'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function PayoutCallbackInner() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('ref')
    const statusParam = searchParams.get('status')

    async function handleCallback() {
      if (!reference) {
        setStatus('error')
        setMessage('No payment reference found')
        return
      }

      if (statusParam === 'success' || statusParam === 'successful') {
        // Find job by reference and update status
        const jobId = reference.split('_')[0]
        const { error } = await supabase
          .from('jobs')
          .update({ status: 'funded' })
          .eq('id', jobId)

        if (error) {
          console.error('Update error:', error)
          setStatus('error')
          setMessage('Payment received but status update failed. Contact support.')
        } else {
          setStatus('success')
          setMessage('Payment confirmed and secured in escrow!')
        }
      } else {
        setStatus('error')
        setMessage('Payment was not completed. Please try again.')
      }
    }

    handleCallback()
  }, [])

  if (status === 'loading') return (
    <div style={{ minHeight: '100svh', background: 'linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏳</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Confirming your payment...</div>
      </div>
    </div>
  )

  if (status === 'success') return (
    <div style={{ minHeight: '100svh', background: 'linear-gradient(155deg, #1a1a1a 0%, #0d2d18 55%, #0a1a0f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '28px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Payment Confirmed!</h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '24px' }}>
          {message}
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
          The freelancer will be notified and your money is safely held in escrow until delivery.
        </p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
          {'Powered by '}
          <span style={{ color: '#C9A84C' }}>GigPay</span>
          {' × '}
          <span style={{ color: '#C9A84C' }}>Payaza</span>
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100svh', background: 'linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '28px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>❌</div>
        <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Payment Not Completed</h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '24px' }}>
          {message}
        </p>
        <Link
          href="/"
          style={{ display: 'inline-block', background: 'linear-gradient(135deg, #C9A84C, #A67C30)', color: '#1a1209', borderRadius: '14px', padding: '14px 28px', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}
        >
          Go back
        </Link>
      </div>
    </div>
  )
}

export default function PayoutCallback() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100svh', background: 'linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Loading...</div>
      </div>
    }>
      <PayoutCallbackInner />
    </Suspense>
  )
}