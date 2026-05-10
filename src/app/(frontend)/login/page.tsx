'use client'

import { saveToken } from '@/lib/auth'
import { gsap } from 'gsap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const formRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // GSAP: staggered entrance using timeline
  useEffect(() => {
    if (!formRef.current) return
    const elements = formRef.current.querySelectorAll('.animate-in')

    const tl = gsap.timeline()
    tl.from(formRef.current, { opacity: 0, y: 20, duration: 0.4, ease: 'power2.out' }).from(
      elements,
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      },
      '-=0.2',
    )
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      // Save the JWT token
      saveToken(data.token)

      // GSAP: slide out before redirect using timeline
      const elements = formRef.current?.querySelectorAll('.animate-in')
      const tl = gsap.timeline({
        onComplete: () => {
          const role = data.user?.role
          window.location.href = role === 'admin' ? '/dashboard/admin' : '/dashboard/user'
        },
      })

      if (elements && elements.length > 0) {
        tl.to(Array.from(elements).reverse(), {
          y: -10,
          opacity: 0,
          duration: 0.2,
          stagger: 0.05,
          ease: 'power2.in',
        })
      }

      tl.to(
        formRef.current,
        {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          ease: 'power2.in',
        },
        '-=0.1',
      )
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="card" ref={formRef}>
        <h1 className="animate-in">Welcome back</h1>
        <p className="animate-in">Sign in to your CyberNexa account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group animate-in">
            <label>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group animate-in">
            <label>Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn animate-in" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          {error && <p className="error-msg">{error}</p>}
        </form>

        <p className="link-text animate-in">
          No account yet? <Link href="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
