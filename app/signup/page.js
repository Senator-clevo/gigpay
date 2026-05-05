'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Signup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
const [form, setForm] = useState({
  name: '', email: '', phone: '',
  password: '', bank_code: '', account_number: '', pin: ''
})

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
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

  const inputStyle = {background: '#0a0a0f', border: '1px solid #1e1e2e'}
  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10" style={{background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%)'}}>
      <div className="max-w-md w-full mx-auto">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)'}}>
            <span className="text-2xl">💸</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="mt-2 text-sm" style={{color: '#888'}}>Join thousands of Nigerian freelancers</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-6">
          {[1,2].map(s => (
            <div key={s} className="h-1 flex-1 rounded-full transition-all"
              style={{background: step >= s ? '#00ff88' : '#1e1e2e'}} />
          ))}
        </div>

        <div className="rounded-3xl p-6" style={{background: '#13131f', border: '1px solid #1e1e2e'}}>
          <h2 className="text-sm font-semibold mb-1" style={{color: '#00ff88'}}>
            STEP {step} OF 2
          </h2>
          <h3 className="text-lg font-bold text-white mb-6">
            {step === 1 ? 'Personal details' : 'Bank details'}
          </h3>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm mb-4" style={{background: '#2a0f0f', color: '#ff6b6b', border: '1px solid #3d1515'}}>
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-2" style={{color: '#888'}}>FULL NAME</label>
                <input name="name" value={form.name} onChange={handleChange}
                  className={inputClass} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00ff88'}
                  onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                  placeholder="Adaeze Okafor" required />
              </div>
              <div>
                <label className="text-xs font-medium block mb-2" style={{color: '#888'}}>EMAIL ADDRESS</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  className={inputClass} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00ff88'}
                  onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                  placeholder="you@email.com" required />
              </div>
              <div>
                <label className="text-xs font-medium block mb-2" style={{color: '#888'}}>PHONE NUMBER</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className={inputClass} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00ff88'}
                  onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                  placeholder="08012345678" required />
              </div>
              <div>
                <label className="text-xs font-medium block mb-2" style={{color: '#888'}}>PASSWORD</label>
                <input name="password" type="password" value={form.password} onChange={handleChange}
                  className={inputClass} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00ff88'}
                  onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                  placeholder="Min. 8 characters" required />
              </div>
              <button type="button"
                onClick={() => { if (!form.name || !form.email || !form.phone || !form.password) { setError('Please fill in all fields'); return; } setError(''); setStep(2) }}
                className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', color: '#0a0a0f'}}>
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSignup} className="space-y-4">
              
              <div>
  <label className="text-xs font-medium block mb-2" style={{color: '#888'}}>CREATE A 4-DIGIT SECURITY PIN</label>
  <input name="pin" type="password" value={form.pin || ''} onChange={handleChange}
    className={inputClass} style={inputStyle}
    onFocus={e => e.target.style.borderColor = '#00ff88'}
    onBlur={e => e.target.style.borderColor = '#1e1e2e'}
    placeholder="Used to confirm payouts"
    maxLength={4}
    required />
</div>
              <div>
                <label className="text-xs font-medium block mb-2" style={{color: '#888'}}>YOUR BANK</label>
                <select name="bank_code" value={form.bank_code} onChange={handleChange}
                  className={inputClass} style={{...inputStyle, color: form.bank_code ? 'white' : '#555'}}
                  onFocus={e => e.target.style.borderColor = '#00ff88'}
                  onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                  required>
                  <option value="" style={{background: '#13131f'}}>Select your bank</option>
                  {banks.map(b => (
                    <option key={b.code} value={b.code} style={{background: '#13131f'}}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-2" style={{color: '#888'}}>ACCOUNT NUMBER</label>
                <input name="account_number" value={form.account_number} onChange={handleChange}
                  className={inputClass} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00ff88'}
                  onBlur={e => e.target.style.borderColor = '#1e1e2e'}
                  placeholder="0123456789" maxLength={10} required />
              </div>
              <div className="rounded-xl p-3 text-xs" style={{background: '#0a1a0f', border: '1px solid #0d2d18', color: '#00cc6a'}}>
                🔒 Your bank details are encrypted and only used to send your payouts. We never charge your account.
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm"
                  style={{background: '#1e1e2e', color: '#888'}}>
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
                  style={{background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', color: '#0a0a0f'}}>
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm mt-6" style={{color: '#555'}}>
          Already have an account?{' '}
          <Link href="/login" style={{color: '#00ff88'}} className="font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}