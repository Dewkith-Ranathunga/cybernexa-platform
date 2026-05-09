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

export default function AdminDashboard() {
  const router = useRouter()
  const bodyRef = useRef<HTMLDivElement>(null)
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    // First verify the current user is an admin
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
        // Block non-admins
        if (data.user.role !== 'admin') {
          router.push('/dashboard/user')
          return
        }

        setCurrentUser(data.user)

        // Fetch all users (only admins can do this)
        return fetch('/api/users?limit=100', {
          headers: { Authorization: `JWT ${token}` },
        })
      })
      .then((res) => res?.json())
      .then((data) => {
        if (!data?.docs) return
        setUsers(data.docs)

        // GSAP: animate everything in
        const items = bodyRef.current?.querySelectorAll('.stat-card, .users-table')
        if (items) {
          gsap.from(items, {
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

  if (!currentUser) return <div style={{ padding: '2rem', color: '#8888aa' }}>Loading...</div>

  const admins = users.filter((u) => u.role === 'admin').length
  const regularUsers = users.filter((u) => u.role === 'user').length

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <span className="logo">⬡ CyberNexa</span>
        <LogoutButton />
      </nav>

      <div className="dashboard-body" ref={bodyRef}>
        <div className="dashboard-header">
          <h1>Admin Panel</h1>
          <p>Manage all registered users</p>
        </div>

        <div className="cards-grid">
          <div className="stat-card">
            <div className="stat-label">Total users</div>
            <div className="stat-value">{users.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Admins</div>
            <div className="stat-value">{admins}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Regular users</div>
            <div className="stat-value">{regularUsers}</div>
          </div>
        </div>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td style={{ color: '#8888aa' }}>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                  </td>
                  <td style={{ color: '#8888aa' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
