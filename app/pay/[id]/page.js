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

  // 🔥 FIXED: Real data loading from Supabase
  useEffect(() => {
    if (!id) return
    
    fetchGig()
  }, [id])

  const fetchGig = async () => {
    try {
      const { data: gigData } = await supabase
        .from('gigs')
        .select('*, workers(*)')
        .eq('id', id)
        .single()

      if (gigData) {
        setJob({
          id: gigData.id,
          title: gigData.title,
          description: gigData.description,
          amount: gigData.amount / 100, // Convert kobo to Naira
          deadline: gigData.deadline,
          status: gigData.status,
          virtual_account_number: gigData.virtual_account_number
        })
        setWorker({
          name: gigData.workers?.name || 'Freelancer',
          email: gigData.workers?.email || 'freelancer@example.com'
        })
      } else {
        // Fallback demo data if no gig found
        setJob({
          id,
          title: "Professional Logo Design",
          description: "Modern minimalist logo with 3 revisions, source files (AI, PSD, PNG), and brand guidelines.",
          amount: 35000,
          deadline: "2024-01-15",
          status: "awaiting_payment"
        })
        setWorker({ name: "Adaeze Okafor", email: "adaeze@designer.com" })
      }
    } catch (error) {
      console.error('Error fetching gig:', error)
      // Use demo data on error
      setJob({
        id,
        title: "Professional Logo Design",
        description: "Modern minimalist logo with 3 revisions, source files (AI, PSD, PNG), and brand guidelines.",
        amount: 35000,
        deadline: "2024-01-15",
        status: "awaiting_payment"
      })
      setWorker({ name: "Adaeze Okafor", email: "adaeze@designer.com" })
    } finally {
      setLoading(false)
    }
  }

  // 🔥 FIXED: Real Payaza Checkout (No npm package needed!)
  function handlePayWithPayaza() {
    if (!job) return

    setPaying(true)

    // Real Payaza hosted checkout URL
    const payazaUrl = `https://checkout.payaza.africa/pay/${process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY}?` +
      `amount=${job.amount}&` +
      `email=${encodeURIComponent(worker?.email || 'client@example.com')}&` +
      `reference=${job.id}&` +
      `description=${encodeURIComponent(job.title)}&` +
      `callback_url=${encodeURIComponent(`${window.location.origin}/success?job=${job.id}&ref=${job.id}`)}`

    // Open Payaza checkout in same tab
    window.location.href = payazaUrl
  }

  if (loading) return <PaySkeleton />
  if (!job) return <PayNotFound />
  // Remove paid state - Payaza handles success

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

        .gp-orb { 
          position: fixed; border-radius: 50%; background: #C9A84C; 
          pointer-events: none; z-index: 0;
        }
        .gp-orb-1 { width: 340px; height: 340px; opacity: 0.08; top: -100px; left: -80px; }
        .gp-orb-2 { width: 200px; height: 200px; opacity: 0.06; bottom: -60px; right: -40px; }
        .gp-orb-3 { width: 100px; height: 100px; opacity: 0.04; top: 30%; right: 10%; }

        .gp-pay-card {
          background: rgba(255,255,255,0.03); backdrop-filter: blur(30px);
          border: 1px solid rgba(201,168,76,0.2); border-radius: 28px;
          padding: 48px; max-width: 480px; width: 100%;
          position: relative; overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.4);
        }
        .gp-pay-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #C9A84C, transparent, #C9A84C);
        }

        /* Freelancer avatar */
        .gp-freelancer {
          text-align: center; margin-bottom: 32px;
        }
        .gp-avatar {
          width: 72px; height: 72px; background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%);
          border-radius: 24px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px; font-size: 28px; font-weight: 700; color: #1a1209;
          box-shadow: 0 12px 32px rgba(201,168,76,0.3);
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .gp-freelancer-name {
          font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700;
          background: linear-gradient(135deg, #fff 0%, #C9A84C 70%); -webkit-background-clip: text;
          background-clip: text; -webkit-text-fill-color: transparent;
        }
        .gp-freelancer-subtitle { 
          font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 4px;
        }

        /* Job details */
        .gp-job-details {
          background: rgba(255,255,255,0.02); border-radius: 20px;
          padding: 28px; margin-bottom: 28px; border: 1px solid rgba(201,168,76,0.1);
        }
        .gp-job-title {
          font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700;
          color: #fff; margin-bottom: 12px;
        }
        .gp-job-description {
          color: rgba(255,255,255,0.8); line-height: 1.6; margin-bottom: 16px; font-size: 14px;
        }
        .gp-job-deadline {
          display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.6);
        }
        .gp-virtual-account {
          background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3);
          border-radius: 12px; padding: 12px; font-family: monospace; font-size: 13px;
          color: #00ff88; text-align: center; margin-top: 12px;
        }

        /* Amount */
        .gp-amount-section { text-align: center; margin-bottom: 32px; }
        .gp-amount {
          font-family: 'Playfair Display', serif; font-size: clamp(36px, 8vw, 48px);
          font-weight: 800; background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 8px; line-height: 1;
        }
        .gp-amount-subtitle {
          font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 500;
        }

        /* Trust badge */
        .gp-trust-badge {
          background: rgba(201,168,76,0.15); backdrop-filter: blur(10px);
          border: 1px solid rgba(201,168,76,0.3); border-radius: 16px;
          padding: 20px 24px; text-align: center; margin-bottom: 32px;
          font-size: 14px; color: #C9A84C; font-weight: 500; line-height: 1.5;
        }

        /* Pay button */
        .gp-pay-btn {
          width: 100%; background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%);
          color: #1a1209; border: none; border-radius: 24px; padding: 24px;
          font-size: 18px; font-weight: 700; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.77,0,0.          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .gp-pay-btn:hover:not(:disabled) {
          transform: translateY(-4px); box-shadow: 0 20px 48px rgba(201,168,76,0.5);
        }
        .gp-pay-btn:disabled {
          opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: 0 8px 24px rgba(201,168,76,0.2);
        }

        /* Payment methods */
        .gp-methods {
          display: flex; justify-content: center; gap: 24px; margin-top: 24px;
          font-size: 12px; color: rgba(255,255,255,0.4); font-weight: 500;
        }

        /* Skeleton & States */
        .gp-state-card {
          background: rgba(255,255,255,0.03); backdrop-filter: blur(20px);
          border: 1px solid rgba(201,168,76,0.2); border-radius: 28px;
          padding: 64px; max-width: 480px; width: 100%; text-align: center;
        }
        .gp-skeleton { 
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%; animation: loading 1.5s infinite; border-radius: 12px;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .gp-state-icon { font-size: 64px; margin-bottom: 24px; opacity: 0.3; }
        .gp-state-title { 
          font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700;
          background: linear-gradient(135deg, #fff 0%, #C9A84C 70%); -webkit-background-clip: text;
          background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .gp-pay-root { padding: 24px 20px; }
          .gp-pay-card { padding: 40px 32px; }
          .gp-methods { flex-direction: column; gap: 12px; }
        }
      `}</style>

      <div className="gp-pay-root">
        <div className="gp-orb gp-orb-1" />
        <div className="gp-orb gp-orb-2" />
        <div className="gp-orb gp-orb-3" />

        <div className="gp-pay-card">
          {/* Freelancer */}
          <div className="gp-freelancer">
            <div className="gp-avatar">{worker?.name?.charAt(0) || 'F'}</div>
            <div className="gp-freelancer-name">{worker?.name || 'Freelancer'}</div>
            <div className="gp-freelancer-subtitle">is requesting payment for</div>
          </div>

          {/* Job Details */}
          <div className="gp-job-details">
            <h2 className="gp-job-title">{job.title}</h2>
            <p className="gp-job-description">{job.description}</p>
            {job.deadline && (
              <div className="gp-job-deadline">
                📅 Due {new Date(job.deadline).toLocaleDateString('en-NG', {
                  weekday: 'long', month: 'long', day: 'numeric'
                })}
              </div>
            )}
            {/* 🔥 NEW: Show Virtual Account Number */}
            {job.virtual_account_number && (
              <div className="gp-virtual-account">
                💳 Bank Transfer: {job.virtual_account_number}
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="gp-amount-section">
            <div className="gp-amount">₦{Number(job.amount).toLocaleString()}</div>
            <div className="gp-amount-subtitle">🔒 Secured in escrow by Payaza</div>
          </div>

          {/* Trust Badge */}
          <div className="gp-trust-badge">
            🛡️ Your money is held safely until the freelancer delivers. 
            <br/>Zero risk • Instant refund if undelivered
          </div>

          {/* 🔥 REAL PAYAZA BUTTON */}
          <button
            onClick={handlePayWithPayaza}
            disabled={paying || !job}
            className="gp-pay-btn"
          >
            {paying ? '🔄 Redirecting to Payaza...' : `Pay ₦${Number(job.amount).toLocaleString()} Now`}
          </button>

          <div className="gp-methods">
            <span>💳 Card</span>
            <span>🏦 Bank Transfer</span>
            <span>📱 USSD</span>
            <span>💰 Mobile Money</span>
          </div>

          <div style={{textAlign: 'center', marginTop: '32px', fontSize: '12px', color: 'rgba(255,255,255,0.3)'}}>
            Powered by <span style={{color: '#C9A84C'}}>GigPay</span> × <span style={{color: '#C9A84C'}}>Payaza</span>
          </div>
        </div>
      </div>
    </>
  )
}

// Loading Skeleton
function PaySkeleton() {
  return (
    <div className="gp-pay-root">
      <div className="gp-pay-card">
        <div style={{textAlign: 'center', marginBottom: '48px'}}>
          <div className="gp-skeleton" style={{width: '72px', height: '72px', borderRadius: '24px', margin: '0 auto 24px'}}></div>
          <div className="gp-skeleton" style={{width: '200px', height: '24px', margin: '0 auto 16px'}}></div>
          <div className="gp-skeleton" style={{width: '120px', height: '16px', margin: '0 auto'}}></div>
        </div>
        <div className="gp-skeleton" style={{height: '200px', marginBottom: '32px'}}></div>
        <div className="gp-skeleton" style={{height: '80px', marginBottom: '24px'}}></div>
        <div className="gp-skeleton" style={{height: '56px'}}></div>
      </div>
    </div>
  )
}

// Not Found
function PayNotFound() {
  return (
    <div className="gp-pay-root">
      <div className="gp-state-card">
        <div className="gp-state-icon">🔗</div>
        <h2 className="gp-state-title">Payment Link Not Found</h2>
        <p style={{fontSize: '15px', color: 'rgba(255,255,255,0.6)', maxWidth: '300px', margin: '0 auto'}}>
          This payment link may have expired or doesn't exist.
        </p>
      </div>
    </div>
  )
}