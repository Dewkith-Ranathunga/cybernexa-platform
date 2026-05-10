'use client'

import { gsap } from 'gsap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const formRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // GSAP: staggered entrance animation using timeline
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
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data?.errors?.[0]?.message || 'Registration failed')
        setLoading(false)
        return
      }

      // GSAP: success animation then redirect using timeline
      setSuccess(true)
      const btn = formRef.current?.querySelector('.btn')

      const tl = gsap.timeline({
        onComplete: () => {
          window.location.href = '/login'
        },
      })

      tl.to(btn, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      }).to(
        formRef.current,
        {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          ease: 'power2.in',
        },
        '+=0.1',
      )
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="card" ref={formRef}>
        <h1 className="animate-in">Create account</h1>
        <p className="animate-in">Join the CyberNexa platform</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group animate-in">
            <label>Full name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button className="btn animate-in" type="submit" disabled={loading}>
            {success ? '✓ Success!' : loading ? 'Creating account...' : 'Create account'}
          </button>

          {error && <p className="error-msg">{error}</p>}
        </form>

        <p className="link-text animate-in">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
