'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SessionGuard({ children }) {
  const router = useRouter()

  useEffect(() => {
    // Auto logout after 30 minutes of inactivity
    let timeout
    const TIMEOUT_DURATION = 30 * 60 * 1000 // 30 minutes

    function resetTimer() {
      clearTimeout(timeout)
      timeout = setTimeout(async () => {
        await supabase.auth.signOut()
        router.push('/login?reason=timeout')
      }, TIMEOUT_DURATION)
    }

    // Listen for any user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer()

    return () => {
      clearTimeout(timeout)
      events.forEach(e => window.removeEventListener(e, resetTimer))
    }
  }, [])

  return children
}