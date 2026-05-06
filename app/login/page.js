'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [centered, setCentered] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setCentered(true)
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      // keep centered after error so form stays full width
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .gp-login-root {
          min-height: 100svh;
          background: #fff;
          display: flex;
          align-items: stretch;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        /* ── BRAND PANEL (left) ── */
        .gp-brand {
          position: relative;
          width: 50%;
          background: linear-gradient(155deg, #1a1a1a 0%, #2d2310 55%, #1a1209 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 52px;
          overflow: hidden;
          transition: width 0.65s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity 0.5s cubic-bezier(0.77, 0, 0.175, 1),
                      padding 0.65s cubic-bezier(0.77, 0, 0.175, 1);
          flex-shrink: 0;
        }
        .gp-brand.hidden {
          width: 0;
          opacity: 0;
          padding-left: 0;
          padding-right: 0;
          overflow: hidden;
        }

        .gp-orb {
          position: absolute;
          border-radius: 50%;
          background: #C9A84C;
          pointer-events: none;
        }
        .gp-orb-1 { width: 340px; height: 340px; opacity: 0.12; top: -100px; left: -80px; }
        .gp-orb-2 { width: 200px; height: 200px; opacity: 0.10; bottom: -60px; right: -40px; }
        .gp-orb-3 { width: 80px;  height: 80px;  opacity: 0.08; top: 55%;    left: 55%; }

        .gp-brand-inner { position: relative; z-index: 1; }

        .gp-brand-tag {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #C9A84C;
          font-weight: 500;
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .gp-brand-tag::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 1px;
          background: #C9A84C;
        }

        .gp-brand-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3vw, 42px);
          font-weight: 700;
          color: #fff;
          line-height: 1.25;
          margin-bottom: 20px;
        }
        .gp-brand-headline span { color: #C9A84C; }

        .gp-brand-body {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          line-height: 1.8;
          margin-bottom: 36px;
          max-width: 340px;
        }

        .gp-brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.28);
          border-radius: 99px;
          padding: 8px 16px;
          font-size: 12px;
          color: #C9A84C;
          font-weight: 500;
        }
        .gp-brand-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #C9A84C;
          box-shadow: 0 0 6px #C9A84C;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        /* ── FORM PANEL (right) ── */
        .gp-form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 52px;
          background: #fff;
          transition: padding 0.65s cubic-bezier(0.77, 0, 0.175, 1);
          min-width: 0;
        }
        .gp-form-panel.centered {
          padding: 60px 80px;
        }

        .gp-form-inner {
          width: 100%;
          max-width: 400px;
          transition: opacity 0.22s ease;
        }
        .gp-form-inner.fading { opacity: 0; }

        .gp-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 36px;
        }
        .gp-logo-mark {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          box-shadow: 0 8px 24px rgba(201,168,76,0.28);
        }
        .gp-logo-mark svg { width: 26px; height: 26px; fill: #fff; }
        .gp-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.01em;
        }
        .gp-logo-sub { font-size: 12px; color: #bbb; margin-top: 2px; }

        .gp-form-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 6px;
        }
        .gp-form-subtitle {
          font-size: 13px;
          color: #999;
          margin-bottom: 28px;
        }

        .gp-error {
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 13px;
          color: #B91C1C;
          margin-bottom: 20px;
        }

        .gp-field { margin-bottom: 18px; }
        .gp-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: #999;
          margin-bottom: 7px;
          text-transform: uppercase;
        }
        .gp-input {
          width: 100%;
          background: #fff;
          border: 1.5px solid #E8E2D4;
          border-radius: 12px;
          padding: 13px 16px;
          font-size: 14px;
          color: #1a1a1a;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .gp-input:focus {
          border-color: #C9A84C;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
        }
        .gp-input::placeholder { color: #ccc; }

        .gp-pw-wrap { position: relative; }
        .gp-pw-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #bbb;
          cursor: pointer;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          padding: 4px;
          font-weight: 500;
        }
        .gp-pw-toggle:hover { color: #A67C30; }

        .gp-forgot {
          display: block;
          text-align: right;
          font-size: 12px;
          color: #A67C30;
          font-weight: 500;
          text-decoration: none;
          margin-top: 6px;
          margin-bottom: 4px;
        }
        .gp-forgot:hover { text-decoration: underline; }

        .gp-submit {
          width: 100%;
          background: linear-gradient(135deg, #C9A84C 0%, #A67C30 100%);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 15px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
          transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(166,124,48,0.3);
        }
        .gp-submit:hover:not(:disabled) {
          opacity: 0.92;
          box-shadow: 0 6px 20px rgba(166,124,48,0.4);
        }
        .gp-submit:active:not(:disabled) { transform: scale(0.99); }
        .gp-submit:disabled {
          background: #E8E2D4;
          color: #bbb;
          box-shadow: none;
          cursor: not-allowed;
        }

        .gp-switch {
          text-align: center;
          font-size: 13px;
          color: #999;
          margin-top: 20px;
        }
        .gp-switch a {
          color: #A67C30;
          font-weight: 600;
          text-decoration: none;
        }
        .gp-switch a:hover { text-decoration: underline; }

        /* Mobile: stack vertically */
        @media (max-width: 768px) {
          .gp-login-root { flex-direction: column; }
          .gp-brand {
            width: 100% !important;
            min-height: 220px;
            padding: 40px 28px;
          }
          .gp-brand.hidden { min-height: 0; height: 0; padding: 0; }
          .gp-form-panel { padding: 40px 24px; }
          .gp-form-panel.centered { padding: 40px 24px; }
          .gp-brand-headline { font-size: 26px; }
        }
      `}</style>

      <div className="gp-login-root">

        {/* Brand panel — left */}
        <div className={`gp-brand${centered ? ' hidden' : ''}`}>
          <div className="gp-orb gp-orb-1" />
          <div className="gp-orb gp-orb-2" />
          <div className="gp-orb gp-orb-3" />
          <div className="gp-brand-inner">
            <div className="gp-brand-tag">Trusted by freelancers</div>
            <h1 className="gp-brand-headline">
              Your work deserves<br />to be <span>paid for.</span>
            </h1>
            <p className="gp-brand-body">
              No more chasing clients. No more fake alerts.
              GigPay holds your client's money in escrow until
              you deliver — then sends it straight to your bank.
            </p>
            <div className="gp-brand-pill">
              <span className="gp-brand-dot" />
              Powered by Payaza
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
              <div className="gp-logo-sub">Get paid. On time. Every time.</div>
            </div>

            <div className="gp-form-title">Welcome back</div>
            <div className="gp-form-subtitle">Sign in to your account</div>

            {error && <div className="gp-error">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="gp-field">
                <label className="gp-label">Email Address</label>
                <input
                  className="gp-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                />
              </div>

              <div className="gp-field">
                <label className="gp-label">Password</label>
                <div className="gp-pw-wrap">
                  <input
                    className="gp-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ paddingRight: '60px' }}
                    required
                  />
                  <button
                    type="button"
                    className="gp-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <a href="#" className="gp-forgot">Forgot password?</a>
              </div>

              <button type="submit" className="gp-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <div className="gp-switch">
              Don&apos;t have an account?{' '}
              <Link href="/signup">Sign up free</Link>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}