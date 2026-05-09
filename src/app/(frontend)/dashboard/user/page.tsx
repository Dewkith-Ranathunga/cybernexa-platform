'use client'

import LogoutButton from '@/components/LogoutButton'
import { getToken, removeToken } from '@/lib/auth'
import { gsap } from 'gsap'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function UserDashboard() {
  const router = useRouter()
  const bodyRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    fetch('/api/users/me', {
      headers: { Authorization: `JWT ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          removeToken()
          router.push('/login')
          return
        }
        // Block admins from this page
        if (data.user.role === 'admin') {
          router.push('/dashboard/admin')
          return
        }
        setUser(data.user)

        // GSAP: animate cards in on mount
        const cards = bodyRef.current?.querySelectorAll('.stat-card, .profile-card')
        if (cards) {
          gsap.from(cards, {
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.2,
          })
        }
      })
      .catch(() => {
        removeToken()
        router.push('/login')
      })
  }, [router])

  if (!user) return <div style={{ padding: '2rem', color: '#8888aa' }}>Loading...</div>

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <span className="logo">⬡ CyberNexa</span>
        <LogoutButton />
      </nav>

      <div className="dashboard-body" ref={bodyRef}>
        <div className="dashboard-header">
          <h1>Hello, {user.name} 👋</h1>
          <p>Welcome to your personal dashboard</p>
        </div>

        <div className="cards-grid">
          <div className="stat-card">
            <div className="stat-label">Your role</div>
            <div className="stat-value" style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>
              {user.role}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Member since</div>
            <div className="stat-value" style={{ fontSize: '1.1rem' }}>
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Account status</div>
            <div className="stat-value" style={{ fontSize: '1.1rem', color: '#22c55e' }}>
              Active
            </div>
          </div>
        </div>

        <div className="stat-card profile-card" style={{ maxWidth: 420 }}>
          <div className="stat-label" style={{ marginBottom: '1rem' }}>
            Profile details
          </div>
          <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: '#8888aa' }}>Name: </span>
            {user.name}
          </p>
          <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: '#8888aa' }}>Email: </span>
            {user.email}
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            <span style={{ color: '#8888aa' }}>ID: </span>
            {user.id}
          </p>
        </div>
      </div>
    </div>
  )
}
