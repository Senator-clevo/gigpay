'use client'
import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const GOLD = 'linear-gradient(135deg, #C9A84C, #A67C30)'
const DARK = 'linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%)'

export default function JobDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    loadJob()
  }, [id])

  async function loadJob() {
    try {
      const { data } = await supabase
        .from('jobs').select('*').eq('id', id).single()
      setJob(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function copyLink() {
    const link = `${window.location.origin}/pay/${job.id}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusConfig = {
    awaiting_payment: { label: 'Awaiting Payment', color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', icon: '⏳' },
    funded:           { label: 'Funded — In Escrow', color: '#C9A84C', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.3)', icon: '🔒' },
    delivered:        { label: 'Delivered', color: '#cc88ff', bg: 'rgba(160,136,255,0.1)', border: 'rgba(160,136,255,0.3)', icon: '📦' },
    paid_out:         { label: 'Paid Out', color: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.3)', icon: '✅' },
  }

  if (loading) return (
    <div style={{ minHeight: '100svh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '48px' }}>⏳</div>
    </div>
  )

  if (!job) return (
    <div style={{ minHeight: '100svh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#fff', fontSize: '18px' }}>Job not found</div>
    </div>
  )

  const status = statusConfig[job.status] || statusConfig.awaiting_payment
  const amount = Number(job.amount)
  const fee = amount * 0.015
  const payout = amount - fee

  return (
    <div style={{ minHeight: '100svh', background: DARK, fontFamily: 'system-ui, sans-serif', padding: '24px' }}>
      
      {/* Back button */}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => router.push('/dashboard')}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ← Back to Dashboard
        </button>

        {/* Status banner */}
        <div style={{ background: status.bg, border: `1px solid ${status.border}`, borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <span style={{ fontSize: '24px' }}>{status.icon}</span>
          <div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>Current Status</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: status.color }}>{status.label}</div>
          </div>
        </div>

        {/* Main card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '24px', padding: '32px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #C9A84C, transparent, #C9A84C)' }} />

          <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{job.title}</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', lineHeight: 1.6 }}>{job.description}</div>

          {/* Amount breakdown */}
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Job Amount</span>
              <span style={{ fontSize: '18px', fontWeight: 700, background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₦{amount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>GigPay fee (1.5%)</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>−₦{fee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>You receive</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#00ff88' }}>₦{payout.toLocaleString()}</span>
            </div>
          </div>

          {/* Details grid */}
          {[
            { label: 'Client', value: job.client_name || '—' },
            { label: 'Client Email', value: job.client_email || '—' },
            { label: 'Deadline', value: job.deadline ? new Date(job.deadline).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
            { label: 'Created', value: new Date(job.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }) },
            { label: 'Job ID', value: job.id },
            { label: 'Reference', value: job.payaza_reference || '—' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none', gap: '16px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{row.label}</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 500, textAlign: 'right', wordBreak: 'break-all' }}>{row.value}</span>
            </div>
          ))}

          {/* Virtual account if exists */}
          {job.virtual_account_number && (
            <div style={{ marginTop: '20px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payaza Virtual Account</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#C9A84C', letterSpacing: '0.05em' }}>{job.virtual_account_number}</div>
            </div>
          )}
        </div>

        {/* QR Code + Copy link */}
{job.status === 'awaiting_payment' && (
  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '24px', padding: '32px', marginBottom: '16px', textAlign: 'center' }}>
    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
      Client scans to pay
    </div>
    <div style={{ background: '#fff', borderRadius: '16px', padding: '16px', display: 'inline-block', marginBottom: '20px' }}>
      <QRCodeSVG
        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/pay/${job.id}`}
        size={180}
        bgColor="#ffffff"
        fgColor="#1a1209"
        level="H"
      />
    </div>
    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
      or share the link below
    </div>
    <button onClick={copyLink}
      style={{ width: '100%', background: copied ? 'rgba(0,255,136,0.15)' : GOLD, border: copied ? '1px solid rgba(0,255,136,0.4)' : 'none', borderRadius: '16px', padding: '18px', fontSize: '15px', fontWeight: 700, color: copied ? '#00ff88' : '#1a1209', cursor: 'pointer', transition: 'all 0.3s' }}>
      {copied ? '✅ Link Copied!' : '🔗 Copy Payment Link'}
    </button>
  </div>
)}

        <div style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '16px' }}>
          Powered by <span style={{ color: '#C9A84C' }}>GigPay</span> × <span style={{ color: '#C9A84C' }}>Payaza</span>
        </div>
      </div>
    </div>
  )
}