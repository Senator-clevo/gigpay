'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useSearchParams } from 'next/navigation'

export default function PayPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const [job, setJob] = useState(null)
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paid, setPaid] = useState(false)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    if (!id) return

    // Check if returning from Payaza payment
    if (searchParams.get('paid') === 'true') {
      setPaid(true)
    }

    loadJob()
  }, [id])

  async function loadJob() {
    try {
      const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !job) {
        setLoading(false)
        return
      }

      setJob(job)
      if (job.status !== 'awaiting_payment') setPaid(true)

      const { data: worker } = await supabase
        .from('users')
        .select('name, email')
        .eq('id', job.worker_id)
        .single()

      setWorker(worker)
    } catch (error) {
      console.error('Error loading job:', error)
    } finally {
      setLoading(false)
    }
  }

  
function handlePayWithPayaza() {
  if (!job) return
  setPaying(true)

  try {
    const reference = `${job.id}_${Date.now()}`
    const callbackUrl = `${window.location.origin}/pay/${job.id}?paid=true`

    // Make sure amount is in Naira not kobo
    const amountInNaira = Number(job.amount) > 100000000 
      ? Number(job.amount) / 100  // divide if accidentally in kobo
      : Number(job.amount)

    const params = new URLSearchParams({
      merchant_key: 'PZ78-PKTEST-93987866-9EF7-4D96-8BF2-9F1EF818286C',
      amount: amountInNaira,
      currency: 'NGN',
      email: 'client@gigpay.app',
      first_name: job.client_name?.split(' ')[0] || 'Client',
      last_name: job.client_name?.split(' ')[1] || 'User',
      reference: reference,
      description: job.title,
      callback_url: callbackUrl
    })

    const checkoutUrl = `https://checkout.payaza.africa/?${params.toString()}`
    console.log('Opening checkout:', checkoutUrl)

    // Open in new tab to avoid frame blocking
    const newTab = window.open(checkoutUrl, '_blank')
    
    if (!newTab) {
      // If popup blocked, redirect in same tab
      window.location.href = checkoutUrl
    }

    setPaying(false)

  } catch (err) {
    console.error('Checkout error:', err)
    setPaying(false)
    alert('Could not open payment. Please try again.')
  }
}
  if (loading) return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💸</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
          Loading payment details...
        </div>
      </div>
    </div>
  )

  if (!job) return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '28px', padding: '64px', maxWidth: '480px', width: '100%', textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔗</div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
          Payment Link Not Found
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
          This payment link may have expired or doesn't exist.
        </p>
      </div>
    </div>
  )

  if (paid) return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(155deg, #1a1a1a 0%, #0d2d18 55%, #0a1a0f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,255,136,0.2)',
        borderRadius: '28px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
          Payment Confirmed!
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: 1.6 }}>
          Your payment of{' '}
          <strong style={{ color: '#00ff88' }}>₦{Number(job.amount).toLocaleString()}</strong>{' '}
          is secured in escrow. It will be released to {worker?.name} once the job is delivered.
        </p>
        <div style={{
          background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)',
          borderRadius: '16px', padding: '20px'
        }}>
          {[
            { label: 'Job', value: job.title },
            { label: 'Amount', value: `₦${Number(job.amount).toLocaleString()}` },
            { label: 'Freelancer', value: worker?.name },
            { label: 'Status', value: '🔒 Secured in escrow' },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', padding: '8px 0',
              borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#00ff88' }}>{row.value}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '24px', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
          Powered by <span style={{ color: '#C9A84C' }}>GigPay</span> ×{' '}
          <span style={{ color: '#C9A84C' }}>Payaza</span>
        </p>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .gp-pay-root {
          min-height: 100svh;
          background: linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%);
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 24px; position: relative; overflow: hidden;
        }
        .gp-orb { position: fixed; border-radius: 50%; background: #C9A84C; pointer-events: none; z-index: 0; }
        .gp-orb-1 { width: 340px; height: 340px; opacity: 0.08; top: -100px; left: -80px; }
        .gp-orb-2 { width: 200px; height: 200px; opacity: 0.06; bottom: -60px; right: -40px; }
        .gp-pay-card {
          background: rgba(255,255,255,0.03); backdrop-filter: blur(30px);
          border: 1px solid rgba(201,168,76,0.2); border-radius: 28px;
          padding: clamp(28px, 5vw, 48px); max-width: 480px; width: 100%;
          position: relative; z-index: 1; box-shadow: 0 32px 80px rgba(0,0,0,0.4);
        }
        .gp-pay-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #C9A84C, transparent, #C9A84C);
          border-radius: 28px 28px 0 0;
        }
        .gp-avatar {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%);
          border-radius: 24px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px; font-size: 28px; font-weight: 700; color: #1a1209;
          box-shadow: 0 12px 32px rgba(201,168,76,0.3);
        }
        .gp-pay-btn {
          width: 100%;
          background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%);
          color: #1a1209; border: none; border-radius: 24px; padding: 22px;
          font-size: 17px; font-weight: 700; cursor: pointer;
          transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.05em;
          font-family: 'DM Sans', sans-serif;
        }
        .gp-pay-btn:hover:not(:disabled) {
          transform: translateY(-3px); box-shadow: 0 20px 48px rgba(201,168,76,0.4);
        }
        .gp-pay-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <div className="gp-pay-root">
        <div className="gp-orb gp-orb-1" />
        <div className="gp-orb gp-orb-2" />

        <div className="gp-pay-card">

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="gp-avatar">{worker?.name?.charAt(0) || 'F'}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display', serif" }}>
              {worker?.name || 'Freelancer'}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              is requesting payment for
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: '20px',
            padding: '24px', marginBottom: '24px', border: '1px solid rgba(201,168,76,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display', serif", marginBottom: '10px' }}>
              {job.title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontSize: '14px', marginBottom: '12px' }}>
              {job.description}
            </p>
            {job.deadline && (
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                📅 Due {new Date(job.deadline).toLocaleDateString('en-NG', {
                  weekday: 'long', month: 'long', day: 'numeric'
                })}
              </div>
            )}
            {job.virtual_account_number && (
              <div style={{
                background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)',
                borderRadius: '12px', padding: '12px', fontFamily: 'monospace',
                fontSize: '13px', color: '#00ff88', textAlign: 'center', marginTop: '12px'
              }}>
                💳 Bank Transfer: {job.virtual_account_number}
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              fontSize: 'clamp(36px, 8vw, 48px)', fontWeight: 800,
              background: 'linear-gradient(135deg, #C9A84C 0%, #A67C30 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', lineHeight: 1, marginBottom: '8px'
            }}>
              ₦{Number(job.amount).toLocaleString()}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
              🔒 Secured in escrow by Payaza
            </div>
          </div>

          <div style={{
            background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: '16px', padding: '16px 20px', textAlign: 'center',
            marginBottom: '28px', fontSize: '13px', color: '#C9A84C', fontWeight: 500, lineHeight: 1.5
          }}>
            🛡️ Your money is held safely until the freelancer delivers.
            <br />Zero risk • Instant refund if undelivered
          </div>

          <button onClick={handlePayWithPayaza} disabled={paying} className="gp-pay-btn">
            {paying ? '🔄 Opening checkout...' : `Pay ₦${Number(job.amount).toLocaleString()} Now`}
          </button>

          <div style={{
            display: 'flex', justifyContent: 'center', gap: '20px',
            marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.35)', flexWrap: 'wrap'
          }}>
            <span>💳 Card</span>
            <span>🏦 Bank Transfer</span>
            <span>📱 USSD</span>
            <span>💰 Mobile Money</span>
          </div>

          <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            Powered by <span style={{ color: '#C9A84C' }}>GigPay</span> ×{' '}
            <span style={{ color: '#C9A84C' }}>Payaza</span>
          </div>
        </div>
      </div>
    </>
  )
}