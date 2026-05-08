'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SessionGuard from '@/components/SessionGuard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPinModal, setShowPinModal] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [payoutLoading, setPayoutLoading] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [fundedNotification, setFundedNotification] = useState(null)

  useEffect(() => {
  
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: profile } = await supabase
        .from('users').select('*').eq('id', user.id).single()
      setProfile(profile)

      const { data: jobs } = await supabase
        .from('jobs').select('*')
        .eq('worker_id', user.id)
        .order('created_at', { ascending: false })
      setJobs(jobs || [])
      console.log('Jobs loaded:', jobs)
      setLoading(false)
    }
    loadData()

    const channel = supabase
    .channel('jobs-changes')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'jobs' },
      (payload) => {
        console.log('Job updated:', payload.new)
        // Update the job in state if it belongs to this worker
        setJobs(prev => prev.map(j => 
          j.id === payload.new.id ? { ...j, ...payload.new } : j
        ))
        // Show notification if job just got funded
        if (payload.new.status === 'funded') {
          setFundedNotification(payload.new.title)
          setTimeout(() => setFundedNotification(null), 5000)
        }
      }
    )
    .subscribe()

  // Cleanup on unmount
  return () => supabase.removeChannel(channel)
}, [])
  

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function markDelivered(jobId) {
    await supabase.from('jobs')
      .update({ status: 'delivered', delivered_at: new Date().toISOString() })
      .eq('id', jobId)
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'delivered' } : j))
  }

  function openPayoutModal(jobId) {
    setSelectedJobId(jobId)
    setPin('')
    setPinError('')
    setShowPinModal(true)
  }

  async function confirmPayout() {
    if (pin.length < 4) { setPinError('Enter your 4-digit PIN'); return }
    if (pin !== profile?.pin) { setPinError('Incorrect PIN. Try again.'); return }

    setPayoutLoading(true)
    const res = await fetch('/api/payout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: selectedJobId })
    })
    const data = await res.json()
    setPayoutLoading(false)
    setShowPinModal(false)

    console.log('Payout response:', data)

    setJobs(jobs.map(j => j.id === selectedJobId ? { ...j, status: 'paid_out' } : j))
  }

  
  const totalEarned = jobs
    .filter(j => j.status === 'paid_out')
    .reduce((sum, j) => sum + j.amount * 0.985, 0)

  const completedJobs = jobs.filter(j => j.status === 'paid_out').length
  const activeJobs = jobs.filter(j => ['funded', 'delivered'].includes(j.status)).length

  const chartData = ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, i) => ({
    week, earned: Math.random() * 50000 + 10000
  }))

  if (loading) return <DashboardSkeleton />

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .gp-dash-root {
          min-height: 100svh;
          background: linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        .gp-orb { 
          position: fixed; border-radius: 50%; background: #C9A84C; 
          pointer-events: none; z-index: 0;
        }
        .gp-orb-1 { width: 340px; height: 340px; opacity: 0.08; top: -120px; left: -80px; }
        .gp-orb-2 { width: 200px; height: 200px; opacity: 0.06; bottom: -60px; right: -40px; }
        .gp-orb-3 { width: 120px; height: 120px; opacity: 0.04; top: 20%; right: 10%; }

        /* Header */
        .gp-header {
          position: sticky; top: 0; z-index: 100;
          background: rgba(26,26,26,0.95); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(201,168,76,0.2);
          padding: 20px 32px;
        }
        .gp-logo { 
          display: flex; align-items: center; gap: 12px;
          font-family: 'Playfair Display', serif; font-weight: 700; font-size: 20px;
          color: #fff; text-decoration: none;
        }
        .gp-logo-mark {
          width: 36px; height: 36px; border-radius: 12px;
          background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(201,168,76,0.3);
        }
        .gp-header-right { display: flex; align-items: center; gap: 16px; }
        .gp-welcome { font-size: 13px; color: rgba(255,255,255,0.6); }
        .gp-logout {
          padding: 8px 16px; border-radius: 12px; font-size: 12px; font-weight: 500;
          background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.3);
          color: #C9A84C; text-decoration: none; transition: all 0.2s;
        }
        .gp-logout:hover { background: rgba(201,168,76,0.2); transform: translateY(-1px); }

        /* Main content */
        .gp-main { padding: 40px 32px; max-width: 1200px; margin: 0 auto; }
        .gp-section { margin-bottom: 48px; }

        /* Stats cards */
        .gp-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .gp-stat-card {
          background: rgba(255,255,255,0.03); backdrop-filter: blur(10px);
          border: 1px solid rgba(201,168,76,0.15); border-radius: 20px;
          padding: 28px 24px; text-align: center; transition: all 0.3s cubic-bezier(0.77,0,0.175,1);
          position: relative; overflow: hidden;
        }
        .gp-stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #C9A84C, #A67C30, #C9A84C);
        }
        .gp-stat-card:hover {
          transform: translateY(-8px); box-shadow: 0 20px 40px rgba(201,168,76,0.15);
          border-color: rgba(201,168,76,0.3);
        }
        .gp-stat-value { 
          font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 4px;
          background: linear-gradient(135deg, #C9A84C, #A67C30); -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
        }
        .gp-stat-label { font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.05em; }

        /* Chart card */
        .gp-chart-card {
          background: rgba(255,255,255,0.02); backdrop-filter: blur(20px);
          border: 1px solid rgba(201,168,76,0.1); border-radius: 24px;
          padding: 32px; position: relative; overflow: hidden;
        }
        .gp-chart-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent);
        }
        .gp-chart-title { 
          font-size: 13px; color: rgba(255,255,255,0.6); 
          font-weight: 500; margin-bottom: 24px; letter-spacing: 0.05em;
        }

        /* CTA Button */
        .gp-cta {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%);
          color: #1a1209; font-weight: 600; font-size: 15px; text-decoration: none;
          padding: 20px 32px; border-radius: 20px; transition: all 0.3s cubic-bezier(0.77,0,0.175,1);
          box-shadow: 0 8px 24px rgba(201,168,76,0.3);
        }
        .gp-cta:hover {
          transform: translateY(-4px); box-shadow: 0 16px 32px rgba(201,168,76,0.4);
        }

        /* Jobs section */
        .gp-jobs-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
        }
        .gp-jobs-title { 
          font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700;
          background: linear-gradient(135deg, #fff 0%, #C9A84C 50%); -webkit-background-clip: text;
          background-clip: text; -webkit-text-fill-color: transparent;
        }
        .gp-jobs-subtitle { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 4px; }

        /* Job cards */
        .gp-job-card {
          background: rgba(255,255,255,0.02); backdrop-filter: blur(10px);
          border: 1px solid rgba(201,168,76,0.1); border-radius: 20px;
          padding: 24px; transition: all 0.3s cubic-bezier(0.77,0,0.175,1);
          position: relative; overflow: hidden;
        }
        .gp-job-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent);
        }
        .gp-job-card:hover {
          transform: translateY(-4px); border-color: rgba(201,168,76,0.3);
          box-shadow: 0 16px 32px rgba(0,0,0,0.3);
        }
        .gp-job-title { font-weight: 600; color: #fff; font-size: 16px; margin-bottom: 4px; }
        .gp-job-meta { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 16px; }
        .gp-job-amount { 
          font-size: 20px; font-weight: 700; color: #C9A84C;
          background: linear-gradient(135deg, #C9A84C, #A67C30); -webkit-background-clip: text;
          background-clip: text; -webkit-text-fill-color: transparent;
        }
        .gp-status-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 99px; font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .gp-status-funded { background: rgba(201,168,76,0.15); color: #C9A84C; border: 1px solid rgba(201,168,76,0.3); }
        .gp-status-delivered { background: rgba(160,136,255,0.15); color: #cc88ff; border: 1px solid rgba(160,136,255,0.3); }
        .gp-status-paid { background: rgba(0,255,136,0.15); color: #00ff88; border: 1px solid rgba(0,255,136,0.3); }

        .gp-job-actions { display: flex; gap: 8px; margin-top: 16px; }
        .gp-action-btn {
          flex: 1; padding: 10px 16px; border-radius: 12px; font-size: 12px; font-weight: 500;
          border: none; cursor: pointer; transition: all 0.2s;
        }
        .gp-action-primary { 
          background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%); color: #1a1209;
          box-shadow: 0 4px 12px rgba(201,168,76,0.3);
        }
        .gp-action-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(201,168,76,0.4); }

        /* Empty state */
        .gp-empty {
          text-align: center; padding: 60px 40px;
          background: rgba(255,255,255,0.02); border-radius: 24px; border: 1px solid rgba(201,168,76,0.1);
        }
        .gp-empty-icon { font-size: 64px; margin-bottom: 24px; opacity: 0.3; }
        .gp-empty-title { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 8px; }
        .gp-empty-subtitle { font-size: 14px; color: rgba(255,255,255,0.4); max-width: 300px; margin: 0 auto; }

        /* Modal */
        .gp-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.85);
          backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .gp-modal {
          background: linear-gradient(155deg, #1a1a1a 0%, #2d2310 100%);
          border: 1px solid rgba(201,168,76,0.3); border-radius: 24px;
          padding: 40px; max-width: 400px; width: 100%; position: relative;
        }
        .gp-pin-input {
          background: rgba(255,255,255,0.03); border: 2px solid rgba(201,168,76,0.3);
          border-radius: 16px; padding: 20px; text-align: center; font-size: 28px;
          font-weight: 700; color: #fff; letter-spacing: 0.3em; width: 100%;
          transition: all 0.2s;
        }
        .gp-pin-input:focus { border-color: #C9A84C; box-shadow: 0 0 0 4px rgba(201,168,76,0.2); }
        .gp-error { 
          background: rgba(255,107,107,0.15); border: 1px solid rgba(255,107,107,0.4);
          color: #ff6b6b; border-radius: 12px; padding: 12px 16px; font-size: 13px; margin: 16px 0;
        }

        /* Skeleton */
        .gp-skeleton { background: rgba(255,255,255,0.05); border-radius: 12px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes slideDown {
  from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
        @media (max-width: 768px) {
          .gp-main { padding: 24px 20px; }
          .gp-header { padding: 16px 20px; }
          .gp-stats { grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .gp-stat-card { padding: 20px 16px; }
          .gp-stat-value { font-size: 22px; }
        }
      `}</style>

      <div className="gp-dash-root">
        {fundedNotification && (
  <div style={{
    position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #00ff88, #00cc66)',
    color: '#0a1a0f', padding: '16px 24px', borderRadius: '16px',
    fontWeight: 700, fontSize: '14px', zIndex: 9999,
    boxShadow: '0 8px 32px rgba(0,255,136,0.4)',
    animation: 'slideDown 0.3s ease'
  }}>
    💰 Payment received! "{fundedNotification}" is now funded and in escrow.
  </div>
)}
        <div className="gp-orb gp-orb-1" />
        <div className="gp-orb gp-orb-2" />
        <div className="gp-orb gp-orb-3" />

        {/* Header */}
        <header className="gp-header">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="gp-logo">
              <div className="gp-logo-mark">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '18px', height: '18px'}}>
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              GigPay
            </Link>
            <div className="gp-header-right">
              <span className="gp-welcome">Hi, {profile?.name?.split(' ')[0] || 'Freelancer'}</span>
              <a href="#" onClick={handleLogout} className="gp-logout">Sign Out</a>
            </div>
          </div>
        </header>

        <main className="gp-main">
          {/* Stats */}
          <section className="gp-section">
            <div className="gp-stats">
              <div className="gp-stat-card">
                <div className="gp-stat-value">₦{totalEarned.toLocaleString()}</div>
                <div className="gp-stat-label">Total Earned</div>
              </div>
              <div className="gp-stat-card">
                <div className="gp-stat-value">{activeJobs}</div>
                <div className="gp-stat-label">Active Jobs</div>
              </div>
              <div className="gp-stat-card">
                <div className="gp-stat-value">{completedJobs}</div>
                <div className="gp-stat-label">Completed</div>
              </div>
            </div>
          </section>

          {/* Chart */}
          {completedJobs > 0 && (
            <section className="gp-section">
              <div className="gp-chart-card">
                <div className="gp-chart-title">EARNINGS — LAST 4 WEEKS</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'rgba(26,26,26,0.95)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '12px' }} />
                    <Bar dataKey="earned" fill="url(#goldGradient)" radius={[4, 4, 0, 0]}>
                      <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C9A84C"/>
                          <stop offset="100%" stopColor="#A67C30"/>
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="gp-section">
            <Link href="/create-job" className="gp-cta">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '20px', height: '20px'}}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Create New Job
            </Link>
          </section>

          {/* Jobs */}
          <section>
            <div className="gp-jobs-header">
              <div>
                <h2 className="gp-jobs-title">Your Jobs</h2>
                <div className="gp-jobs-subtitle">{jobs.length} active projects</div>
              </div>
            </div>
            
            {jobs.length === 0 ? (
              <div className="gp-empty">
                <div className="gp-empty-icon">📋</div>
                <h3 className="gp-empty-title">No jobs yet</h3>
                <p className="gp-empty-subtitle">
                  Create your first job using the button above to start earning.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div key={job.id} className="gp-job-card" onClick={() => router.push(`/jobs/${job.id}`)} style={{ cursor: 'pointer' }}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="gp-job-title">{job.title}</div>
                        <div className="gp-job-meta">{job.client_name}</div>
                      </div>
                      <div className={`gp-status-badge gp-status-${job.status}`}>
                        {job.status === 'funded' && 'Funded ✓'}
                        {job.status === 'delivered' && 'Delivered'}
                        {job.status === 'paid_out' && 'Paid Out ✓'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="gp-job-amount">₦{Number(job.amount).toLocaleString()}</div>
                      <div className="gp-job-actions">
                        {job.status === 'funded' && (
  <button className="gp-action-btn gp-action-primary" onClick={(e) => { e.stopPropagation(); markDelivered(job.id) }}>
    Mark Delivered
  </button>
)}
                        {job.status === 'delivered' && (
  <button className="gp-action-btn gp-action-primary" onClick={(e) => { e.stopPropagation(); openPayoutModal(job.id) }}>
    Release Payout
  </button>
)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* PIN Modal */}
        {showPinModal && (
          <div className="gp-modal-overlay" onClick={() => setShowPinModal(false)}>
            <div className="gp-modal" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-8">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-xl font-bold text-white mb-2">Confirm Payout</h3>
                <p className="text-sm" style={{color: 'rgba(255,255,255,0.6)'}}>Enter your 4-digit PIN</p>
              </div>
              {pinError && <div className="gp-error">{pinError}</div>}
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setPinError('') }}
                className="gp-pin-input"
                placeholder="••••"
                autoFocus
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
  <button
    style={{
      flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 500,
      fontSize: '14px', border: '1px solid rgba(255,255,255,0.15)',
      background: 'transparent', color: 'rgba(255,255,255,0.7)', cursor: 'pointer'
    }}
    onClick={() => setShowPinModal(false)}>
    Cancel
  </button>
  <button
    style={{
      flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 600,
      fontSize: '14px', border: 'none', cursor: payoutLoading ? 'not-allowed' : 'pointer',
      background: 'linear-gradient(135deg, #C9A84C 0%, #A67C30 100%)',
      color: '#1a1209', opacity: payoutLoading ? 0.7 : 1
    }}
    onClick={confirmPayout} disabled={payoutLoading}>
    {payoutLoading ? 'Processing...' : 'Confirm Payout'}
  </button>
</div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%)'}}>
      <div className="text-center space-y-4">
        <div className="gp-skeleton w-16 h-16 rounded-full mx-auto mb-6"></div>
        <div className="gp-skeleton w-48 h-6 mx-auto mb-2"></div>
        <div className="gp-skeleton w-32 h-4 mx-auto"></div>
      </div>
    </div>
  )
}