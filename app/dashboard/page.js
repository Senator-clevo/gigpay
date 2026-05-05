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
      setLoading(false)
    }
    loadData()
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

    if (data.success) {
      setJobs(jobs.map(j => j.id === selectedJobId ? { ...j, status: 'paid_out' } : j))
      alert('Payout sent successfully!')
    } else {
      alert('Payout failed: ' + data.error)
    }
  }

  const totalEarned = jobs
    .filter(j => j.status === 'paid_out')
    .reduce((sum, j) => sum + j.amount * 0.985, 0)

  const completedJobs = jobs.filter(j => j.status === 'paid_out').length
  const activeJobs = jobs.filter(j => ['funded', 'delivered'].includes(j.status)).length

  const chartData = ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, i) => {
    const weekJobs = jobs.filter(j => {
      if (j.status !== 'paid_out') return false
      const jobDate = new Date(j.paid_out_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - (3 - i) * 7)
      const weekEnd = new Date()
      weekEnd.setDate(weekEnd.getDate() - (2 - i) * 7)
      return jobDate >= weekAgo && jobDate < weekEnd
    })
    return { week, earned: weekJobs.reduce((sum, j) => sum + j.amount, 0) }
  })

  const statusConfig = {
    awaiting_payment: { label: 'Awaiting Payment', bg: '#1a1200', color: '#f5a623', border: '#2e2000' },
    funded: { label: 'Funded ✓', bg: '#001a2e', color: '#00aaff', border: '#002e4e' },
    delivered: { label: 'Delivered', bg: '#1a001a', color: '#cc88ff', border: '#2e002e' },
    paid_out: { label: 'Paid Out ✓', bg: '#0a1a0f', color: '#00ff88', border: '#0d2d18' }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: '#0a0a0f' }}>
      <div className="text-center">
        <div className="text-3xl mb-3">💸</div>
        <div className="text-sm" style={{ color: '#888' }}>Loading your dashboard...</div>
      </div>
    </div>
  )

  return (
    <SessionGuard>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%)' }}>

        {/* PIN Modal */}
        {showPinModal && (
          <div className="fixed inset-0 flex items-center justify-center px-6 z-50"
            style={{ background: 'rgba(0,0,0,0.85)' }}>
            <div className="w-full max-w-sm rounded-3xl p-6" style={{ background: '#13131f', border: '1px solid #1e1e2e' }}>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🔐</div>
                <h3 className="text-lg font-bold text-white">Confirm Payout</h3>
                <p className="text-sm mt-1" style={{ color: '#888' }}>Enter your 4-digit security PIN to release payment</p>
              </div>
              {pinError && (
                <div className="rounded-xl px-4 py-3 text-sm mb-4 text-center"
                  style={{ background: '#2a0f0f', color: '#ff6b6b', border: '1px solid #3d1515' }}>
                  {pinError}
                </div>
              )}
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setPinError('') }}
                className="w-full px-4 py-4 rounded-xl text-white text-center text-2xl focus:outline-none mb-4"
                style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', letterSpacing: '0.5em' }}
                placeholder="••••"
                autoFocus
              />
              <div className="flex gap-3">
                <button onClick={() => setShowPinModal(false)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: '#1e1e2e', color: '#888' }}>
                  Cancel
                </button>
                <button onClick={confirmPayout} disabled={payoutLoading}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', color: '#0a0a0f' }}>
                  {payoutLoading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
          style={{ background: 'rgba(10,10,15,0.95)', borderBottom: '1px solid #1e1e2e', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)' }}>
              <span className="text-sm">💸</span>
            </div>
            <span className="font-bold text-white">GigPay</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: '#888' }}>
              Hi, {profile?.name?.split(' ')[0]}
            </span>
            <button onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ background: '#2a0f0f', color: '#ff6b6b' }}>
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: `₦${totalEarned.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`, label: 'Total Earned', color: '#00ff88' },
              { value: activeJobs, label: 'Active Jobs', color: '#00aaff' },
              { value: completedJobs, label: 'Completed', color: '#cc88ff' }
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl p-4 text-center"
                style={{ background: '#13131f', border: '1px solid #1e1e2e' }}>
                <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: '#555' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          {completedJobs > 0 && (
            <div className="rounded-2xl p-4" style={{ background: '#13131f', border: '1px solid #1e1e2e' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#888' }}>EARNINGS — LAST 4 WEEKS</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={chartData}>
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val) => [`₦${val.toLocaleString()}`, 'Earned']}
                    contentStyle={{ background: '#13131f', border: '1px solid #1e1e2e', borderRadius: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="earned" fill="#00ff88" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* New Job Button */}
          <Link href="/create-job"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', color: '#0a0a0f' }}>
            + Create New Job
          </Link>

          {/* Jobs List */}
          <div>
            <h2 className="text-xs font-semibold mb-3" style={{ color: '#555' }}>YOUR JOBS</h2>
            {jobs.length === 0 ? (
              <div className="rounded-2xl p-10 text-center" style={{ background: '#13131f', border: '1px solid #1e1e2e' }}>
                <div className="text-4xl mb-3">📋</div>
                <div className="text-sm" style={{ color: '#555' }}>No jobs yet.</div>
                <div className="text-xs mt-1" style={{ color: '#444' }}>Create your first job above to get started.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map(job => {
                  const config = statusConfig[job.status] || statusConfig.awaiting_payment
                  return (
                    <div key={job.id} className="rounded-2xl p-4"
                      style={{ background: '#13131f', border: '1px solid #1e1e2e' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-white text-sm">{job.title}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#666' }}>{job.client_name}</div>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-white">
                          ₦{Number(job.amount).toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          {job.status === 'awaiting_payment' && (
                            <Link href={`/pay/${job.id}`}
                              className="text-xs px-3 py-2 rounded-xl font-medium"
                              style={{ background: '#001a2e', color: '#00aaff', border: '1px solid #002e4e' }}>
                              View Link
                            </Link>
                          )}
                          {job.status === 'funded' && (
                            <button onClick={() => markDelivered(job.id)}
                              className="text-xs px-3 py-2 rounded-xl font-medium"
                              style={{ background: '#1a001a', color: '#cc88ff', border: '1px solid #2e002e' }}>
                              Mark Delivered
                            </button>
                          )}
                          {job.status === 'delivered' && (
                            <button onClick={() => openPayoutModal(job.id)}
                              className="text-xs px-3 py-2 rounded-xl font-medium"
                              style={{ background: '#0a1a0f', color: '#00ff88', border: '1px solid #0d2d18' }}>
                              Release Payout
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </SessionGuard>
  )
}