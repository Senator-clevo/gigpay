'use client'
import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useSearchParams } from 'next/navigation'

const GOLD = 'linear-gradient(135deg, #C9A84C, #A67C30)'
const DARK = 'linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%)'

function PayInner() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const [job, setJob] = useState(null)
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paid, setPaid] = useState(false)
  const [paying, setPaying] = useState(false)
  const [sdkLoaded, setSdkLoaded] = useState(false) // ✅ ADDED

  useEffect(() => {
    if (!id) return
    console.log('Supabase URL set:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Key:', process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY)
    if (searchParams.get('paid') === 'true') setPaid(true)
    loadJob()
    loadPayazaSdk() // ✅ Load SDK on mount
  }, [id])

  async function loadJob() {
    try {
      const { data: jobData } = await supabase
        .from('jobs').select('*').eq('id', id).single()
      if (!jobData) { setLoading(false); return }
      setJob(jobData)
      if (jobData.status !== 'awaiting_payment') setPaid(true)
      const { data: workerData } = await supabase
        .from('users').select('name, email').eq('id', jobData.worker_id).single()
      setWorker(workerData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ FIXED: Properly load SDK from correct URL
  async function loadPayazaSdk() {
    if (window.PayazaCheckout) {
      console.log('✅ Payaza SDK already loaded')
      setSdkLoaded(true)
      return
    }

    console.log('📦 Attempting to load Payaza SDK from CDN...')
    
    const urls = [
      'https://checkout.payaza.africa/js/payaza-checkout.js', // Primary (correct)
      'https://cdn.payaza.africa/checkout/payaza-checkout.js'   // Fallback
    ]

    for (const url of urls) {
      try {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = url
          script.type = 'text/javascript'
          script.async = true
          
          script.onload = () => {
            console.log(`✅ Payaza SDK loaded from: ${url}`)
            if (window.PayazaCheckout) {
              console.log('✅ PayazaCheckout available on window')
              setSdkLoaded(true)
              resolve()
            } else {
              reject(new Error('PayazaCheckout not found on window'))
            }
          }
          
          script.onerror = () => {
            console.warn(`⚠️ Failed to load from ${url}`)
            reject(new Error(`Failed to load from ${url}`))
          }
          
          document.head.appendChild(script)
        })
        return // Success, exit function
      } catch (err) {
        console.error(err.message)
        // Continue to next URL
      }
    }

    // All URLs failed
    console.error('❌ Failed to load Payaza SDK from all CDN URLs')
    setSdkLoaded(false)
  }

  async function handlePayWithPayaza() {
    console.log('🚀 Starting Payaza payment...')
    
    if (!sdkLoaded || !window.PayazaCheckout) {
      alert('❌ Payaza SDK is still loading. Please wait and try again.')
      console.error('SDK not ready. sdkLoaded:', sdkLoaded, 'window.PayazaCheckout:', !!window.PayazaCheckout)
      return
    }

    if (!job || paying) return
    setPaying(true)

    try {
      console.log('⚙️ Setting up Payaza checkout...')
      
      window.PayazaCheckout.setup({
        key: process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY,
        customer: {
          email: job.client_email || 'client@gigpay.app',
          name: job.client_name || 'Client',
          phone_number: '08000000000'
        },
        amount: Number(job.amount),
        currency: 'NGN',
        reference: job.payaza_reference || job.id,
        onClose: function() {
          console.log('⏹️ Payaza checkout closed')
          setPaying(false)
        },
        onSuccess: function(response) {
          console.log('✅ Payaza payment successful:', response)
          setPaid(true)
          setPaying(false)
        },
        onError: function(error) {
          console.error('❌ Payaza payment error:', error)
          setPaying(false)
          alert('Payment failed: ' + (error?.message || 'Unknown error'))
        }
      })

      console.log('🔓 Opening Payaza iframe...')
      window.PayazaCheckout.openIframe()

    } catch (err) {
      console.error('❌ Payaza checkout error:', err)
      setPaying(false)
      alert('Payment setup error: ' + err.message)
    }
  }

  const displayAmount = job ? Number(job.amount) : 0

  if (loading) {
    return (
      <div style={{ minHeight: '100svh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>{'💸'}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '12px' }}>{'Loading...'}</div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div style={{ minHeight: '100svh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '28px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '56px' }}>{'🔗'}</div>
          <h2 style={{ color: '#fff', fontSize: '22px', margin: '16px 0 8px' }}>{'Payment Link Not Found'}</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{'This link may have expired.'}</p>
        </div>
      </div>
    )
  }

  if (paid) {
    return (
      <div style={{ minHeight: '100svh', background: 'linear-gradient(155deg, #1a1a1a 0%, #0d2d18 55%, #0a1a0f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '28px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '56px' }}>{'✅'}</div>
          <h2 style={{ color: '#fff', fontSize: '26px', margin: '16px 0 12px' }}>{'Payment Confirmed!'}</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            {'Your payment of '}
            <strong style={{ color: '#00ff88' }}>{'₦' + displayAmount.toLocaleString()}</strong>
            {' is secured in escrow and will be released to ' + (worker ? worker.name : 'the freelancer') + ' on delivery.'}
          </p>
          <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: '16px', padding: '16px' }}>
            {[
              { label: 'Job', value: job.title },
              { label: 'Amount', value: '₦' + displayAmount.toLocaleString() },
              { label: 'Freelancer', value: worker ? worker.name : '-' },
              { label: 'Status', value: '🔒 Secured in escrow' },
            ].map(function(row, i) {
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#00ff88' }}>{row.value}</span>
                </div>
              )
            })}
          </div>
          <p style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            {'Powered by '}
            <span style={{ color: '#C9A84C' }}>{'GigPay'}</span>
            {' × '}
            <span style={{ color: '#C9A84C' }}>{'Payaza'}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100svh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '28px', padding: 'clamp(24px,5vw,48px)', maxWidth: '480px', width: '100%', position: 'relative' }}>

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #C9A84C, transparent, #C9A84C)', borderRadius: '28px 28px 0 0' }} />

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', background: GOLD, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px', fontWeight: 700, color: '#1a1209' }}>
            {worker && worker.name ? worker.name.charAt(0) : 'F'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>
            {worker ? worker.name : 'Freelancer'}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
            {'is requesting payment for'}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{job.title}</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: '8px' }}>{job.description}</div>
          {job.deadline && (
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              {'📅 Due ' + new Date(job.deadline).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: 'clamp(32px,8vw,46px)', fontWeight: 800, background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {'₦' + displayAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            {'🔒 Secured in escrow by Payaza'}
          </div>
        </div>

        <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '14px', padding: '14px', textAlign: 'center', fontSize: '13px', color: '#C9A84C', lineHeight: 1.5, marginBottom: '24px' }}>
          {'🛡️ Your money is held safely until delivery. Zero risk.'}
        </div>

        <button
          onClick={handlePayWithPayaza}
          disabled={paying || !sdkLoaded}
          style={{
            width: '100%',
            background: (paying || !sdkLoaded) ? 'rgba(201,168,76,0.35)' : GOLD,
            color: '#1a1209',
            border: 'none',
            borderRadius: '20px',
            padding: '20px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: (paying || !sdkLoaded) ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {!sdkLoaded ? '⏳ Loading Payment System...' : paying ? 'Processing...' : 'Pay ₦' + displayAmount.toLocaleString() + ' Now'}
        </button>

        {job.virtual_account_number && (
          <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: '18px', padding: '18px', color: '#fff' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>{'Payaza virtual account'}</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{job.virtual_account_number}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>{'Reference: ' + (job.payaza_reference || job.id)}</div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', flexWrap: 'wrap' }}>
          <span>{'💳 Card'}</span>
          <span>{'🏦 Transfer'}</span>
          <span>{'📱 USSD'}</span>
          <span>{'💰 Mobile Money'}</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
          {'Powered by '}
          <span style={{ color: '#C9A84C' }}>{'GigPay'}</span>
          {' × '}
          <span style={{ color: '#C9A84C' }}>{'Payaza'}</span>
        </div>

      </div>
    </div>
  )
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100svh', background: 'linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{'Loading...'}</div>
      </div>
    }>
      <PayInner />
    </Suspense>
  )
}