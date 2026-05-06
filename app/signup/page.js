'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const banks = [
  { code: '044', name: 'Access Bank' },
  { code: '011', name: 'First Bank' },
  { code: '058', name: 'Guaranty Trust Bank' },
  { code: '057', name: 'Zenith Bank' },
  { code: '033', name: 'United Bank for Africa' },
  { code: '214', name: 'First City Monument Bank' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '076', name: 'Polaris Bank' },
  { code: '526', name: 'Moniepoint' },
  { code: '999', name: 'OPay' },
  { code: '327', name: 'PalmPay' },
  { code: '090405', name: 'Kuda Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '032', name: 'Union Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '232', name: 'Sterling Bank' },
]

export default function Signup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [centered, setCentered] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    password: '', bank_code: '', account_number: '', pin: ''
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleContinue() {
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Please fill in all fields')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setError('')
    setCentered(true)
    setStep(2)
  }

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: authData, error: authError } = await supabase.auth.signUp({
  email: form.email,
  password: form.password,
  options: {
    emailRedirectTo: null,
    data: {
      name: form.name
    }
  }
})
    if (authError) { setError(authError.message); setLoading(false); return }

    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      bank_code: form.bank_code,
      account_number: form.account_number,
      pin: form.pin
    })
    if (profileError) { setError(profileError.message); setLoading(false); return }

    router.push('/dashboard')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .gp-signup-root {
          min-height: 100svh;
          background: #fff;
          display: flex;
          align-items: stretch;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .gp-brand {
          position: relative;
          width: 50%;
          background: linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 52px;
          overflow: hidden;
          transition: width 0.65s cubic-bezier(0.77,0,0.175,1),
                      opacity 0.5s cubic-bezier(0.77,0,0.175,1),
                      padding 0.65s cubic-bezier(0.77,0,0.175,1);
          flex-shrink: 0;
        }
        .gp-brand.hidden {
          width: 0; opacity: 0;
          padding-left: 0; padding-right: 0;
          overflow: hidden;
        }

        .gp-orb { position:absolute; border-radius:50%; background:#C9A84C; pointer-events:none; }
        .gp-orb-1 { width:340px; height:340px; opacity:0.12; top:-100px; left:-80px; }
        .gp-orb-2 { width:200px; height:200px; opacity:0.10; bottom:-60px; right:-40px; }
        .gp-orb-3 { width:80px; height:80px; opacity:0.08; top:55%; left:55%; }

        .gp-brand-inner { position:relative; z-index:1; }
        .gp-brand-tag {
          font-size:11px; letter-spacing:0.2em; color:#C9A84C;
          font-weight:500; text-transform:uppercase; margin-bottom:20px;
          display:flex; align-items:center; gap:8px;
        }
        .gp-brand-tag::before {
          content:''; display:inline-block;
          width:24px; height:1px; background:#C9A84C;
        }
        .gp-brand-headline {
          font-family:'Playfair Display',serif;
          font-size:clamp(28px,3vw,42px); font-weight:700;
          color:#fff; line-height:1.25; margin-bottom:20px;
        }
        .gp-brand-headline span { color:#C9A84C; }
        .gp-brand-body {
          font-size:14px; color:rgba(255,255,255,0.45);
          line-height:1.8; margin-bottom:36px; max-width:340px;
        }
        .gp-brand-pill {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(201,168,76,0.12); border:1px solid rgba(201,168,76,0.28);
          border-radius:99px; padding:8px 16px;
          font-size:12px; color:#C9A84C; font-weight:500;
        }
        .gp-brand-dot {
          width:7px; height:7px; border-radius:50%;
          background:#C9A84C; box-shadow:0 0 6px #C9A84C;
          animation:pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.85); }
        }

        .gp-form-panel {
          flex:1; display:flex; flex-direction:column;
          justify-content:center; align-items:center;
          padding:60px 52px; background:#fff;
          transition:padding 0.65s cubic-bezier(0.77,0,0.175,1);
          min-width:0; overflow-y:auto;
        }
        .gp-form-panel.centered { padding:60px 80px; }

        .gp-form-inner {
          width:100%; max-width:400px;
          transition:opacity 0.22s ease;
        }

        .gp-logo {
          display:flex; flex-direction:column;
          align-items:center; margin-bottom:28px;
        }
        .gp-logo-mark {
          width:52px; height:52px;
          background:linear-gradient(135deg,#C9A84C 0%,#A67C30 100%);
          border-radius:16px; display:flex; align-items:center;
          justify-content:center; margin-bottom:12px;
          box-shadow:0 8px 24px rgba(201,168,76,0.28);
        }
        .gp-logo-mark svg { width:26px; height:26px; fill:#fff; }
        .gp-logo-name {
          font-family:'Playfair Display',serif;
          font-size:24px; font-weight:700; color:#1a1a1a;
          letter-spacing:-0.01em;
        }
        .gp-logo-sub { font-size:12px; color:#bbb; margin-top:2px; }

        .gp-progress { display:flex; gap:6px; margin-bottom:16px; }
        .gp-pb {
          height:3px; flex:1; border-radius:99px;
          background:#E8E2D4; transition:background 0.4s;
        }
        .gp-pb.on { background:#C9A84C; }

        .gp-step-tag {
          font-size:11px; font-weight:500;
          color:#C9A84C; letter-spacing:0.08em;
          text-transform:uppercase; margin-bottom:4px;
        }
        .gp-form-title {
          font-size:20px; font-weight:600;
          color:#1a1a1a; margin-bottom:6px;
        }
        .gp-form-subtitle {
          font-size:13px; color:#999; margin-bottom:24px;
        }

        .gp-error {
          background:#FEF2F2; border:1px solid #FCA5A5;
          border-radius:12px; padding:12px 16px;
          font-size:13px; color:#B91C1C; margin-bottom:18px;
        }

        .gp-field { margin-bottom:16px; }
        .gp-label {
          display:block; font-size:11px; font-weight:500;
          letter-spacing:0.08em; color:#999;
          margin-bottom:7px; text-transform:uppercase;
        }
        .gp-input {
          width:100%; background:#fff;
          border:1.5px solid #E8E2D4; border-radius:12px;
          padding:13px 16px; font-size:14px; color:#1a1a1a;
          outline:none; font-family:'DM Sans',sans-serif;
          transition:border-color 0.2s,box-shadow 0.2s;
          box-sizing:border-box;
        }
        .gp-input:focus {
          border-color:#C9A84C;
          box-shadow:0 0 0 3px rgba(201,168,76,0.12);
        }
        .gp-input::placeholder { color:#ccc; }

        .gp-note {
          background:#FBF7EE; border:1px solid #E8D99A;
          border-radius:10px; padding:11px 14px;
          font-size:12px; color:#8a6a1e; line-height:1.6;
          margin-bottom:16px;
        }

        .gp-submit {
          width:100%;
          background:linear-gradient(135deg,#C9A84C 0%,#A67C30 100%);
          color:#fff; border:none; border-radius:14px;
          padding:15px; font-size:15px; font-weight:600;
          cursor:pointer; font-family:'DM Sans',sans-serif;
          letter-spacing:0.02em;
          transition:opacity 0.2s,transform 0.1s,box-shadow 0.2s;
          box-shadow:0 4px 16px rgba(166,124,48,0.3);
        }
        .gp-submit:hover:not(:disabled) {
          opacity:0.92;
          box-shadow:0 6px 20px rgba(166,124,48,0.4);
        }
        .gp-submit:active:not(:disabled) { transform:scale(0.99); }
        .gp-submit:disabled {
          background:#E8E2D4; color:#bbb;
          box-shadow:none; cursor:not-allowed;
        }

        .gp-back-btn {
          flex:1; padding:14px; border-radius:12px;
          background:#F2F0EC; border:none; color:#666;
          font-size:14px; font-weight:500; cursor:pointer;
          font-family:'DM Sans',sans-serif;
          transition:background 0.2s;
        }
        .gp-back-btn:hover { background:#E8E4DC; }

        .gp-btn-row { display:flex; gap:10px; margin-top:4px; }
        .gp-btn-row .gp-submit { flex:2; }

        .gp-switch {
          text-align:center; font-size:13px;
          color:#999; margin-top:20px;
        }
        .gp-switch a { color:#A67C30; font-weight:600; text-decoration:none; }
        .gp-switch a:hover { text-decoration:underline; }

        @media (max-width:768px) {
          .gp-signup-root { flex-direction:column; }
          .gp-brand {
            width:100% !important; min-height:200px;
            padding:36px 24px;
          }
          .gp-brand.hidden { min-height:0; height:0; padding:0; }
          .gp-form-panel { padding:32px 20px; }
          .gp-form-panel.centered { padding:32px 20px; }
        }
      `}</style>

      <div className="gp-signup-root">

        {/* Brand panel — left */}
        <div className={`gp-brand${centered ? ' hidden' : ''}`}>
          <div className="gp-orb gp-orb-1" />
          <div className="gp-orb gp-orb-2" />
          <div className="gp-orb gp-orb-3" />
          <div className="gp-brand-inner">
            <div className="gp-brand-tag">Join thousands of freelancers</div>
            <h1 className="gp-brand-headline">
              Stop chasing.<br />Start <span>earning.</span>
            </h1>
            <p className="gp-brand-body">
              Create your account in 2 minutes. Add your bank details
              once — and every job you complete pays straight into
              your account. No delays. No excuses.
            </p>
            <div className="gp-brand-pill">
              <span className="gp-brand-dot" />
              Secure & encrypted
            </div>
          </div>
        </div>

        {/* Form panel — right */}
        <div className={`gp-form-panel${centered ? ' centered' : ''}`}>
          <div className="gp-form-inner">

            <div className="gp-logo">
              <div className="gp-logo-mark">
                <svg viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </svg>
              </div>
              <div className="gp-logo-name">GigPay</div>
              <div className="gp-logo-sub">Get paid. Every time.</div>
            </div>

            <div className="gp-progress">
              <div className={`gp-pb on`} />
              <div className={`gp-pb${step >= 2 ? ' on' : ''}`} />
            </div>

            {step === 1 && (
              <>
                <div className="gp-step-tag">Step 1 of 2</div>
                <div className="gp-form-title">Personal details</div>
                <div className="gp-form-subtitle">Tell us a bit about yourself</div>

                {error && <div className="gp-error">{error}</div>}

                <div className="gp-field">
                  <label className="gp-label">Full Name</label>
                  <input className="gp-input" name="name" value={form.name}
                    onChange={handleChange} placeholder="Adaeze Okafor" required />
                </div>
                <div className="gp-field">
                  <label className="gp-label">Email Address</label>
                  <input className="gp-input" name="email" type="email" value={form.email}
                    onChange={handleChange} placeholder="you@email.com" required />
                </div>
                <div className="gp-field">
                  <label className="gp-label">Phone Number</label>
                  <input className="gp-input" name="phone" value={form.phone}
                    onChange={handleChange} placeholder="08012345678" required />
                </div>
                <div className="gp-field">
                  <label className="gp-label">Password</label>
                  <input className="gp-input" name="password" type="password"
                    value={form.password} onChange={handleChange}
                    placeholder="Min. 8 characters" required />
                </div>

                <button className="gp-submit" type="button" onClick={handleContinue}>
                  Continue →
                </button>

                <div className="gp-switch">
                  Already have an account? <Link href="/login">Sign in</Link>
                </div>
              </>
            )}

            {step === 2 && (
              <form onSubmit={handleSignup}>
                <div className="gp-step-tag">Step 2 of 2</div>
                <div className="gp-form-title">Bank details</div>
                <div className="gp-form-subtitle">Where should we send your payments?</div>

                {error && <div className="gp-error">{error}</div>}

                <div className="gp-field">
                  <label className="gp-label">4-Digit Security PIN</label>
                  <input className="gp-input" name="pin" type="password"
                    value={form.pin} onChange={handleChange}
                    placeholder="Used to confirm payouts"
                    maxLength={4} required />
                </div>
                <div className="gp-field">
                  <label className="gp-label">Your Bank</label>
                  <select className="gp-input" name="bank_code"
                    value={form.bank_code} onChange={handleChange} required
                    style={{ color: form.bank_code ? '#1a1a1a' : '#ccc' }}>
                    <option value="">Select your bank</option>
                    {banks.map(b => (
                      <option key={b.code} value={b.code}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="gp-field">
                  <label className="gp-label">Account Number</label>
                  <input className="gp-input" name="account_number"
                    value={form.account_number} onChange={handleChange}
                    placeholder="0123456789" maxLength={10} required />
                </div>

                <div className="gp-note">
                  🔒 Your bank details are encrypted and only used to send your payouts. We never charge your account.
                </div>

                <div className="gp-btn-row">
                  <button type="button" className="gp-back-btn"
                    onClick={() => { setStep(1); setCentered(false) }}>
                    ← Back
                  </button>
                  <button type="submit" className="gp-submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>
    </>
  )
}