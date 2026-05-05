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

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '24px 20px',
    }}>
      <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '28px'
          }}>💸</div>
          <h1 style={{ fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 800, color: '#fff', margin: 0 }}>GigPay</h1>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '6px' }}>Get paid. On time. Every time.</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#13131f',
          border: '1px solid #1e1e2e',
          borderRadius: '24px',
          padding: 'clamp(20px, 5vw, 32px)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{
                background: '#2a0f0f', color: '#ff6b6b',
                border: '1px solid #3d1515',
                borderRadius: '12px', padding: '12px 16px',
                fontSize: '13px', marginBottom: '16px'
              }}>{error}</div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', background: '#0a0a0f',
                  border: '1px solid #1e1e2e', borderRadius: '12px',
                  padding: '14px 16px', fontSize: '15px', color: '#fff',
                  outline: 'none', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#00ff88'}
                onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                placeholder="you@email.com" required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%', background: '#0a0a0f',
                    border: '1px solid #1e1e2e', borderRadius: '12px',
                    padding: '14px 48px 14px 16px', fontSize: '15px', color: '#fff',
                    outline: 'none', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#00ff88'}
                  onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                  placeholder="••••••••" required
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: '#555', cursor: 'pointer', fontSize: '16px', padding: '4px'
                  }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: loading ? '#1e1e2e' : 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
              color: loading ? '#666' : '#0a0a0f',
              border: 'none', borderRadius: '14px',
              padding: '16px', fontSize: '15px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#555', marginTop: '20px' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: '#00ff88', fontWeight: 600, textDecoration: 'none' }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}