'use client'
import { useState } from 'react'

export default function PinModal({ onConfirm, onCancel, loading }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  function handleConfirm() {
    if (pin.length < 4) { setError('Enter your 4-digit PIN'); return }
    onConfirm(pin)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center px-6 z-50"
      style={{background: 'rgba(0,0,0,0.85)'}}>
      <div className="w-full max-w-sm rounded-3xl p-6" style={{background: '#13131f', border: '1px solid #1e1e2e'}}>
        <div className="text-center mb-6">
          <div className="text-3xl mb-3">🔐</div>
          <h3 className="text-lg font-bold text-white">Confirm Payout</h3>
          <p className="text-sm mt-1" style={{color: '#888'}}>Enter your 4-digit security PIN to release payment</p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm mb-4 text-center" style={{background: '#2a0f0f', color: '#ff6b6b'}}>
            {error}
          </div>
        )}

        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setError('') }}
          className="w-full px-4 py-3 rounded-xl text-white text-center text-2xl tracking-widest focus:outline-none mb-4"
          style={{background: '#0a0a0f', border: '1px solid #1e1e2e', letterSpacing: '0.5em'}}
          placeholder="••••"
        />

        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-semibold text-sm"
            style={{background: '#1e1e2e', color: '#888'}}>
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading}
            className="flex-1 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
            style={{background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', color: '#0a0a0f'}}>
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}