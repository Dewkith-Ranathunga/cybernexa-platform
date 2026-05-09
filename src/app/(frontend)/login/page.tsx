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

  // GSAP: staggered entrance
  useEffect(() => {
    if (!formRef.current) return
    const elements = formRef.current.querySelectorAll('.animate-in')
    gsap.from(elements, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    })
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

      // GSAP: slide out before redirect
      gsap.to(formRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          const role = data.user?.role
          if (role === 'admin') {
            router.push('/dashboard/admin')
          } else {
            router.push('/dashboard/user')
          }
        },
      })
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
            {loading ? 'Signing in...' : 'Sign in'}
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
