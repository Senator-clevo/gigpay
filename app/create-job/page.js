'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { QRCodeCanvas } from 'qrcode.react'
import Link from 'next/link'

const gigCategories = [
  'Logo Design', 'Brand Identity', 'Flyer Design', 'Social Media Graphics',
  'Website Development', 'Mobile App', 'WordPress Site', 'UI/UX Design',
  'Copywriting', 'Blog Writing', 'Video Editing', 'Photo Editing',
  'Social Media Manager', 'SEO Services', 'Virtual Assistant'
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
      setSuggestions(filtered.slice(0, 6))
      setShowSuggestions(true)
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
      setError('Please add job title and amount first')
      return
    }
    setAiLoading(true)
    setError('')
    // Simulate AI generation
    setTimeout(() => {
      setForm(prev => ({
        ...prev,
        description: `Professional ${form.title.toLowerCase()} service including ${form.title.includes('design') ? '3 revisions, source files, and fast delivery' : 'full implementation, testing, and deployment'}. Deliverables will be provided within the specified deadline.`
      }))
      setAiLoading(false)
    }, 1500)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate job creation
    setTimeout(() => {
      setPaymentLink(data.paymentLink) // ← REPLACE with actual payment link from API response
      setLoading(false)
    }, 2000)
  }

  // Success screen
  if (paymentLink) {
    return (
      <SuccessScreen paymentLink={paymentLink} jobData={form} />
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .gp-create-root {
          min-height: 100svh;
          background: linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%);
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }

        .gp-orb { 
          position: fixed; border-radius: 50%; background: #C9A84C; 
          pointer-events: none; z-index: 0;
        }
        .gp-orb-1 { width: 300px; height: 300px; opacity: 0.06; top: -80px; left: -60px; }
        .gp-orb-2 { width: 180px; height: 180px; opacity: 0.05; bottom: -40px; right: 0; }

        .gp-header {
          position: sticky; top: 0; z-index: 100;
          background: rgba(26,26,26,0.95); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(201,168,76,0.2); padding: 20px 32px;
        }
        .gp-back { 
          display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.7);
          font-size: 14px; font-weight: 500; text-decoration: none;
          transition: all 0.2s;
        }
        .gp-back:hover { color: #C9A84C; }

        .gp-main { padding: 40px 32px; max-width: 480px; margin: 0 auto; }

        .gp-card {
          background: rgba(255,255,255,0.03); backdrop-filter: blur(20px);
          border: 1px solid rgba(201,168,76,0.15); border-radius: 24px;
          padding: 40px; position: relative; overflow: hidden;
        }
        .gp-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #C9A84C, transparent, #C9A84C);
        }
        .gp-card-title {
          font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700;
          background: linear-gradient(135deg, #fff 0%, #C9A84C 70%); -webkit-background-clip: text;
          background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 8px; text-align: center;
        }
        .gp-card-subtitle { 
          text-align: center; font-size: 14px; color: rgba(255,255,255,0.5);
          margin-bottom: 36px;
        }

        .gp-field { position: relative; margin-bottom: 24px; }
        .gp-label {
          position: absolute; left: 16px; top: 14px; font-size: 11px; font-weight: 500;
          color: rgba(201,168,76,0.7); letter-spacing: 0.05em; text-transform: uppercase;
          pointer-events: none; transition: all 0.2s;
        }
        .gp-input, .gp-textarea {
          width: 100%; background: rgba(255,255,255,0.02); border: 2px solid rgba(201,168,76,0.2);
          border-radius: 16px; padding: 20px 16px 16px; font-size: 15px; color: #fff;
          font-family: inherit; transition: all 0.2s; outline: none;
        }
        .gp-input:focus, .gp-textarea:focus {
          border-color: #C9A84C; box-shadow: 0 0 0 4px rgba(201,168,76,0.1);
          background: rgba(255,255,255,0.04);
        }
        .gp-input:focus + .gp-label, .gp-textarea:focus + .gp-label,
        .gp-input:not(:placeholder-shown) + .gp-label, .gp-textarea:not(:placeholder-shown) + .gp-label {
          top: 8px; font-size: 10px; color: #C9A84C;
        }
        .gp-textarea { resize: vertical; min-height: 120px; }

        .gp-suggestions {
          position: absolute; top: 100%; left: 0; right: 0; z-index: 10;
          background: rgba(26,26,26,0.98); backdrop-filter: blur(20px);
          border: 1px solid rgba(201,168,76,0.3); border-radius: 0 0 16px 16px;
          max-height: 200px; overflow-y: auto;
        }
        .gp-suggestion {
          padding: 16px; border-bottom: 1px solid rgba(201,168,76,0.1);
          cursor: pointer; transition: all 0.2s; font-size: 14px;
        }
        .gp-suggestion:hover, .gp-suggestion.active {
          background: rgba(201,168,76,0.1); color: #C9A84C;
        }
        .gp-suggestion:last-child { border-bottom: none; }

        .gp-ai-btn {
          position: absolute; top: 16px; right: 16px; padding: 8px 16px;
          background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3);
          color: #C9A84C; border-radius: 99px; font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .gp-ai-btn:hover:not(:disabled) {
          background: rgba(201,168,76,0.25); transform: scale(1.05);
        }
        .gp-ai-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .gp-error {
          background: rgba(255,107,107,0.15); border: 1px solid rgba(255,107,107,0.4);
          color: #ff6b6b; border-radius: 12px; padding: 14px 18px; font-size: 13px;
          margin-bottom: 20px;
        }

        .gp-submit {
          width: 100%; background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%);
          color: #1a1209; border: none; border-radius: 20px; padding: 20px;
          font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s;
          box-shadow: 0 8px 24px rgba(201,168,76,0.3); font-family: inherit;
        }
        .gp-submit:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 12px 32px rgba(201,168,76,0.4);
        }
        .gp-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        @media (max-width: 768px) {
          .gp-main { padding: 24px 20px; }
          .gp-card { padding: 32px 24px; }
          .gp-card-title { font-size: 24px; }
        }
      `}</style>

      <div className="gp-create-root">
        <div className="gp-orb gp-orb-1" />
        <div className="gp-orb gp-orb-2" />

        {/* Header */}
        <header className="gp-header">
          <Link href="/dashboard" className="gp-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '18px'}}>
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Dashboard
          </Link>
        </header>

        <main className="gp-main">
          <div className="gp-card">
            <h1 className="gp-card-title">New Job</h1>
            <p className="gp-card-subtitle">Create a secure payment link for your client</p>

            {error && <div className="gp-error">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title with suggestions */}
              <div className="gp-field">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleTitleChange}
                  className="gp-input"
                  placeholder=" "
                  required
                />
                <label className="gp-label">Job Title</label>
                {showSuggestions && (
                  <div className="gp-suggestions">
                    {suggestions.map((suggestion, i) => (
                      <div
                        key={i}
                        className="gp-suggestion"
                        onClick={() => selectSuggestion(suggestion)}
                        onMouseEnter={e => e.target.classList.add('active')}
                        onMouseLeave={e => e.target.classList.remove('active')}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="gp-field">
                <input
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  className="gp-input"
                  placeholder=" "
                  required
                />
                <label className="gp-label">Amount (₦)</label>
              </div>

              <div className="gp-field">
                <input
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  className="gp-input"
                  placeholder=" "
                  required
                />
                <label className="gp-label">Client Name</label>
              </div>

              <div className="gp-field">
                <input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  className="gp-input"
                  placeholder=" "
                  required
                />
                <label className="gp-label">Deadline</label>
              </div>

              {/* Description with AI */}
              <div className="gp-field relative">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="gp-textarea"
                  placeholder=" "
                  required
                />
                <label className="gp-label">Job Description</label>
                <button
                  type="button"
                  className="gp-ai-btn"
                  onClick={generateDescription}
                  disabled={aiLoading}
                >
                  {aiLoading ? '✨ AI...' : '✨ AI Generate'}
                </button>
              </div>

              <button type="submit" className="gp-submit" disabled={loading || aiLoading}>
                {loading ? '⏳ Creating Payment Link...' : '🔗 Generate Payment Link'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}

function SuccessScreen({ paymentLink, jobData }) {
  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink)
    // Add toast notification here
  }

  const shareWhatsApp = () => {
    const message = `Hi! Please use this secure GigPay link to pay ₦${jobData.amount} for "${jobData.title}": ${paymentLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <>
      <style>{`
        .gp-success-root {
          min-height: 100svh;
          background: linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%);
          display: flex; align-items: center; justify-content: center; padding: 40px 24px;
          font-family: 'DM Sans', sans-serif;
        }
        .gp-success-card {
          background: rgba(255,255,255,0.03); backdrop-filter: blur(20px);
          border: 1px solid rgba(201,168,76,0.2); border-radius: 28px;
          padding: 48px; max-width: 480px; width: 100%; text-align: center;
        }
        .gp-success-icon {
          width: 80px; height: 80px; background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%);
          border-radius: 24px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px; box-shadow: 0 12px 32px rgba(201,168,76,0.3);
        }
        .gp-success-title { 
          font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700;
          background: linear-gradient(135deg, #fff 0%, #C9A84C 70%); -webkit-background-clip: text;
          background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px;
        }
        .gp-success-subtitle { font-size: 15px; color: rgba(255,255,255,0.7); margin-bottom: 32px; }
        .gp-qr-container { 
          background: #fff; border-radius: 20px; padding: 24px; margin: 32px 0;
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
        }
        .gp-link-display {
          background: rgba(10,10,15,0.8); border-radius: 16px; padding: 16px;
          font-family: 'SF Mono', monospace; font-size: 13px; word-break: break-all;
          border: 1px solid rgba(201,168,76,0.3); margin: 20px 0;
        }
        .gp-success-btn {
          width: 100%; padding: 18px 24px; border-radius: 20px; font-weight: 600;
          font-size: 15px; border: none; cursor: pointer; transition: all 0.3s;
          margin-bottom: 12px; font-family: inherit;
        }
        .gp-success-primary {
          background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%);
          color: #1a1209; box-shadow: 0 8px 24px rgba(201,168,76,0.3);
        }
        .gp-success-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(201,168,76,0.4); }
        .gp-success-secondary {
          background: rgba(255,255,255,0.05); color: #fff;
          border: 1px solid rgba(201,168,76,0.3);
        }
        .gp-success-secondary:hover { background: rgba(201,168,76,0.1); border-color: #C9A84C; }
      `}</style>

      <div className="gp-success-root">
        <div className="gp-success-card">
          <div className="gp-success-icon">✅</div>
          <h1 className="gp-success-title">Payment Link Ready!</h1>
          <p className="gp-success-subtitle">Send this secure link to your client</p>

          <div className="gp-qr-container">
            <QRCodeCanvas value={paymentLink} size={200} />
          </div>

          <div className="gp-link-display">{paymentLink}</div>

          <div className="space-y-3">
            <button className="gp-success-btn gp-success-primary" onClick={shareWhatsApp}>
              📱 Share on WhatsApp
            </button>
            <button className="gp-success-btn gp-success-secondary" onClick={copyLink}>
              📋 Copy Link
            </button>
            <Link href="/dashboard" className="gp-success-btn gp-success-secondary">
              ← Back to Dashboard
            </Link>
          </div>

          <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '32px'}}>
            Client will pay ₦{Number(jobData.amount).toLocaleString()} for "{jobData.title}"
          </div>
        </div>
      </div>
    </>
  )
}