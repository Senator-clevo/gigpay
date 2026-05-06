'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get('job')
  const reference = searchParams.get('reference')

  useEffect(() => {
    // Notify backend payment confirmed
    if (reference) {
      fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference })
      })
    }
  }, [reference])

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#1a1a1a', color: 'white', textAlign: 'center', padding: '40px'
    }}>
      <div>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
        <h1 style={{ fontSize: '36px', marginBottom: '16px' }}>Payment Successful!</h1>
        <p>Your payment has been secured in escrow. The freelancer will be notified.</p>
        <p style={{ fontSize: '14px', opacity: 0.7, marginTop: '24px' }}>
          Reference: {reference || 'Loading...'}
        </p>
      </div>
    </div>
  )
}