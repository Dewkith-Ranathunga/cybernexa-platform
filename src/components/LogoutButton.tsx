'use client'

import { removeToken } from '@/lib/auth'
import { gsap } from 'gsap'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const btnRef = useRef<HTMLButtonElement>(null)

  function handleLogout() {
    // GSAP: animate the full page out before redirecting using timeline
    const tl = gsap.timeline({
      onComplete: () => {
        removeToken()
        router.push('/login')
      },
    })

    tl.to(btnRef.current, { scale: 0.95, opacity: 0.7, duration: 0.1 }).to(
      'body',
      { opacity: 0, y: -10, duration: 0.4, ease: 'power2.in' },
      '+=0.1',
    )
  }

  return (
    <button ref={btnRef} className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  )
}
