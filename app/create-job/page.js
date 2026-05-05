'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import Link from 'next/link'

const gigCategories = [
  'Logo Design', 'Brand Identity Design', 'Flyer Design', 'Banner Design',
  'Social Media Graphics', 'UI/UX Design', 'Poster Design', 'Business Card Design',
  'Website Development', 'Mobile App Development', 'Landing Page Design',
  'WordPress Website', 'E-commerce Website', 'Bug Fixing', 'API Integration',
  'Copywriting', 'Blog Writing', 'Product Description Writing', 'CV Writing',
  'Social Media Content', 'Script Writing', 'Proofreading & Editing',
  'Video Editing', 'Motion Graphics', 'Photography', 'Photo Editing',
  'YouTube Thumbnail Design', 'Intro/Outro Video',
  'Social Media Management', 'SEO Optimization', 'Email Marketing',
  'Instagram Management', 'Facebook Ads Setup',
  'Virtual Assistant', 'Data Entry', 'Translation', 'Voiceover',
  'Music Production', 'Tutoring', 'Event Photography'
]

export default function CreateJob() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [paymentLink, setPaymentLink] = useState(null)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', amount: '', clientName: '', deadline: ''
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleTitleChange(e) {
    const value = e.target.value
    setForm({ ...form, title: value })
    if (value.length > 1) {
      const filtered = gigCategories.filter(cat =>
        cat.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  function selectSuggestion(suggestion) {
    setForm({ ...form, title: suggestion })
    setSuggestions([])
    setShowSuggestions(false)
  }

  async function generateDescription() {
    if (!form.title || !form.amount) {
      alert('Enter a job title and amount first')
      return
    }
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, amount: form.amount })
      })
      const data = await res.json()
      if (data.description) {
        setForm(prev => ({ ...prev, description: data.description }))
      } else {
        alert('Could not generate description. ' + (data.error || ''))
      }
    } catch (err) {
      alert('Something went wrong generating description')
    }
    setAiLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: profile } = await supabase
      .from('users').select('*').eq('id', user.id).single()

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        workerId: user.id,
        workerEmail: user.email,
        workerName: profile?.name
      })
    })

    const data = await res.json()
    if (data.success) {
      setPaymentLink(data.paymentLink)
    } else {
      setError(data.error || 'Something went wrong')
    }
    setLoading(false)
  }

  function copyLink() {
    navigator.clipboard.writeText(paymentLink)
    alert('Link copied!')
  }

  function shareWhatsApp() {
    const message = `Hi! Please use this secure link to pay for our job via GigPay: ${paymentLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)
  }

  const inputStyle = { background: '#0a0a0f', border: '1px solid #1e1e2e' }
  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"

  // --- Payment link success screen ---
  if (paymentLink) return (
    <div className="min-h-screen flex flex-col justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%)' }}>
      <div className="max-w-md w-full mx-auto">
        <div className="rounded-3xl p-6 text-center" style={{ background: '#13131f', border: '1px solid #1e1e2e' }}>

          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#0a1a0f', border: '2px solid #00ff88' }}>
            <span className="text-2xl">✅</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">Payment Link Ready!</h2>
          <p className="text-sm mb-6" style={{ color: '#888' }}>Send this to your client to get paid securely</p>

          <div className="flex justify-center mb-6 p-4 rounded-2xl" style={{ background: '#ffffff' }}>
            <QRCode value={paymentLink} size={160} />
          </div>

          <div className="rounded-xl p-3 text-xs mb-6 break-all text-left"
            style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#888' }}>
            {paymentLink}
          </div>

          <div className="space-y-3">
            <button onClick={shareWhatsApp}
              className="w-full py-3 rounded-xl font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', color: '#0a0a0f' }}>
              📲 Share on WhatsApp
            </button>
            <button onClick={copyLink}
              className="w-full py-3 rounded-xl font-semibold text-sm"
              style={{ background: '#1e1e2e', color: '#ccc' }}>
              📋 Copy Link
            </button>
            <Link href="/dashboard"
              className="block w-full py-3 rounded-xl font-semibold text-sm text-center"
              style={{ background: '#13131f', border: '1px solid #1e1e2e', color: '#888' }}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  // --- Create job form ---
  return (
    <div className="min-h-screen px-6 py-10"
      style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%)' }}>
      <div className="max-w-md w-full mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-sm" style={{ color: '#888' }}>← Back</Link>
          <h1 className="text-xl font-bold text-white">New Job</h1>
        </div>

        <div className="rounded-3xl p-6" style={{ background: '#13131f', border: '1px solid #1e1e2e' }}>
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm"
                style={{ background: '#2a0f0f', color: '#ff6b6b', border: '1px solid #3d1515' }}>
                {error}
              </div>
            )}

            {/* Job Title with autocomplete */}
            <div className="relative">
  <label className="text-xs font-medium block mb-2" style={{color: '#888'}}>JOB TITLE</label>
  <input
    name="title"
    value={form.title}
    onChange={handleTitleChange}
    onFocus={() => form.title.length > 1 && setShowSuggestions(true)}
    className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"
    style={{background: '#0a0a0f', border: '1px solid #1e1e2e'}}
    onFocusCapture={e => e.target.style.borderColor = '#00ff88'}
    onBlur={e => { e.target.style.borderColor = '#1e1e2e'; setTimeout(() => setShowSuggestions(false), 150) }}
    placeholder="e.g. Logo design, Website development..."
    required
  />
  {showSuggestions && (
    <div className="absolute z-10 w-full mt-1 rounded-xl overflow-hidden"
      style={{background: '#13131f', border: '1px solid #1e1e2e'}}>
      {suggestions.map((s, i) => (
        <button key={i} type="button"
          onClick={() => selectSuggestion(s)}
          className="w-full text-left px-4 py-3 text-sm transition-all"
          style={{color: '#ccc', borderBottom: i < suggestions.length - 1 ? '1px solid #1e1e2e' : 'none'}}
          onMouseEnter={e => { e.target.style.background = '#1e1e2e'; e.target.style.color = '#00ff88' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#ccc' }}>
          {s}
        </button>
      ))}
    </div>
  )}
</div>

            {/* Amount */}
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: '#888' }}>AMOUNT (₦)</label>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#00ff88'}
                onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                placeholder="e.g. 35000"
                required
              />
            </div>

            {/* Client Name */}
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: '#888' }}>CLIENT NAME</label>
              <input
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                className={inputClass}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#00ff88'}
                onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                placeholder="e.g. Tunde Bello"
                required
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: '#888' }}>DEADLINE</label>
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                className={inputClass}
                style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={e => e.target.style.borderColor = '#00ff88'}
                onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                required
              />
            </div>

            {/* Description with AI */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: '#888' }}>JOB DESCRIPTION</label>
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={aiLoading}
                  className="text-xs font-semibold px-3 py-1 rounded-lg disabled:opacity-50 transition-all"
                  style={{ background: '#0a1a0f', color: '#00ff88', border: '1px solid #0d2d18' }}>
                  {aiLoading ? '⏳ Generating...' : '✨ AI Generate'}
                </button>
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                style={{ ...inputStyle, height: '96px' }}
                onFocus={e => e.target.style.borderColor = '#00ff88'}
                onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                placeholder="Describe what you will deliver..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-sm disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', color: '#0a0a0f' }}>
              {loading ? '⏳ Creating job...' : '🔗 Generate Payment Link'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}