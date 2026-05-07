'use client'
import { useSearchParams } from 'next/navigation'

export default function PayoutCallbackPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status') || 'unknown'
  const reference = searchParams.get('reference') || ''
  const message = searchParams.get('message') || ''
  const success = status.toLowerCase() === 'success' || status.toLowerCase() === 'completed'

  return (
    <div style={{ minHeight: '100svh', background: 'linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '560px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '54px', marginBottom: '18px' }}>{success ? '✅' : '⚠️'}</div>
        <h1 style={{ fontSize: '28px', margin: '0 0 12px', color: '#fff' }}>
          {success ? 'Payout Completed' : 'Payout Callback Received'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 24px', lineHeight: 1.6 }}>
          {success
            ? 'Your payout event has been received. Please check your dashboard for the updated transaction status.'
            : 'We received a payout callback, but the status is not marked as completed. Please verify the event details and check the payout logs.'}
        </p>

        {reference && (
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '18px', marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Reference</div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>{reference}</div>
          </div>
        )}

        {message && (
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', margin: '0 0 24px' }}>{message}</p>
        )}

        <a href="/dashboard" style={{ display: 'inline-block', padding: '14px 24px', background: '#C9A84C', color: '#1a1209', borderRadius: '18px', fontWeight: 700, textDecoration: 'none' }}>
          Back to Dashboard
        </a>
      </div>
    </div>
  )
}
