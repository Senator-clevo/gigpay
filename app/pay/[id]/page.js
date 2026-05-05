'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function PayPage() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paid, setPaid] = useState(false)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    async function loadJob() {
      const { data: job } = await supabase
        .from('jobs').select('*').eq('id', id).single()
      if (job) {
        setJob(job)
        if (job.status !== 'awaiting_payment') setPaid(true)
        const { data: worker } = await supabase
          .from('users').select('name, email').eq('id', job.worker_id).single()
        setWorker(worker)
      }
      setLoading(false)
    }
    loadJob()
  }, [id])

  function handlePayWithPayaza() {
    setPaying(true)
    const script = document.createElement('script')
    script.src = 'https://js.payaza.africa/inline.js'
    script.onload = () => {
      window.PayazaCheckout.init({
        merchant_key: process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY,
        amount: job.amount,
        currency_code: 'NGN',
        email: 'client@gigpay.app',
        first_name: job.client_name.split(' ')[0] || 'Client',
        last_name: job.client_name.split(' ')[1] || '',
        reference: job.payaza_reference || job.id,
        description: job.title,
        callback: function(response) {
          if (response.status === 'successful') {
            setPaid(true)
          }
          setPaying(false)
        }
      })
    }
    script.onerror = () => setPaying(false)
    document.head.appendChild(script)
  }

  const containerStyle = {
    minHeight: '100svh',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
  }

  const cardStyle = {
    background: '#13131f',
    border: '1px solid #1e1e2e',
    borderRadius: '24px',
    padding: 'clamp(20px, 5vw, 32px)',
    width: '100%',
    maxWidth: '420px',
  }

  if (loading) return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>💸</div>
        <div style={{ color: '#666', fontSize: '14px' }}>Loading payment details...</div>
      </div>
    </div>
  )

  if (!job) return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>❌</div>
        <div style={{ color: '#666', fontSize: '14px' }}>Payment link not found</div>
      </div>
    </div>
  )

  if (paid) return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '72px', height: '72px',
            background: '#0a1a0f', border: '2px solid #00ff88',
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '32px'
          }}>✅</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
            Payment Confirmed!
          </h2>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Your payment is secured in escrow until the job is delivered.
          </p>
        </div>

        <div style={{
          background: '#0a0a0f', borderRadius: '16px',
          padding: '16px', marginBottom: '20px'
        }}>
          {[
            { label: 'Job', value: job.title },
            { label: 'Amount', value: `₦${Number(job.amount).toLocaleString()}` },
            { label: 'Freelancer', value: worker?.name },
            { label: 'Status', value: '🔒 Secured in escrow', green: true },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0',
              borderBottom: i < 3 ? '1px solid #1e1e2e' : 'none'
            }}>
              <span style={{ fontSize: '13px', color: '#666' }}>{row.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: row.green ? '#00ff88' : '#fff' }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#444' }}>
          Powered by <span style={{ color: '#00ff88' }}>GigPay</span> × <span style={{ color: '#00ff88' }}>Payaza</span>
        </p>
      </div>
    </div>
  )

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>

        {/* Worker info */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '22px', fontWeight: 800, color: '#0a0a0f'
          }}>
            {worker?.name?.charAt(0) || '?'}
          </div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '16px' }}>{worker?.name}</div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>is requesting payment for:</div>
        </div>

        {/* Job details */}
        <div style={{
          background: '#0a0a0f', borderRadius: '16px',
          padding: '16px', marginBottom: '16px'
        }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '15px', marginBottom: '6px' }}>
            {job.title}
          </div>
          <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, marginBottom: '8px' }}>
            {job.description}
          </div>
          {job.deadline && (
            <div style={{ fontSize: '12px', color: '#555' }}>
              📅 Deadline: {new Date(job.deadline).toLocaleDateString('en-NG', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </div>
          )}
        </div>

        {/* Amount */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: 'clamp(32px, 8vw, 42px)', fontWeight: 800, color: '#fff' }}>
            ₦{Number(job.amount).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
            🔒 Secured by Payaza escrow
          </div>
        </div>

        {/* Trust badge */}
        <div style={{
          background: '#0a1a0f', border: '1px solid #0d2d18',
          borderRadius: '12px', padding: '12px 16px',
          fontSize: '13px', color: '#00cc6a',
          textAlign: 'center', marginBottom: '20px',
          lineHeight: 1.5
        }}>
          🛡️ Your money is held in escrow and only released when the job is delivered. Zero risk to you.
        </div>

        {/* Pay button */}
        <button
          onClick={handlePayWithPayaza}
          disabled={paying}
          style={{
            width: '100%',
            background: paying ? '#1e1e2e' : 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
            color: paying ? '#666' : '#0a0a0f',
            border: 'none', borderRadius: '16px',
            padding: '18px', fontSize: '16px', fontWeight: 800,
            cursor: paying ? 'not-allowed' : 'pointer',
            marginBottom: '12px', transition: 'all 0.2s'
          }}>
          {paying ? 'Opening checkout...' : `Pay ₦${Number(job.amount).toLocaleString()} Now`}
        </button>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#444' }}>
          Card · Bank Transfer · USSD · Mobile Money
        </div>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#333', marginTop: '16px' }}>
          Powered by <span style={{ color: '#00ff88' }}>GigPay</span> × <span style={{ color: '#00ff88' }}>Payaza</span>
        </div>
      </div>
    </div>
  )
}