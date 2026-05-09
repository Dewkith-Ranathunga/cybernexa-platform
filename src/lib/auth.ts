// Store JWT in a cookie
export function saveToken(token: string) {
  document.cookie = `payload-token=${token}; path=/; max-age=86400`
}

// Get JWT from cookie
export function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/payload-token=([^;]+)/)
  return match ? match[1] : null
}

// Remove JWT (logout)
export function removeToken() {
  document.cookie = 'payload-token=; path=/; max-age=0'
}

// Decode the JWT payload (no library needed)
export function decodeToken(token: string): { id: string; role: string; email: string } | null {
  try {
    const base64 = token.split('.')[1]
    const decoded = JSON.parse(atob(base64))
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.collection === 'users' ? decoded.role || 'user' : 'user',
    }
  } catch {
    return null
  }
}

// Get current user from stored token
export async function getCurrentUser() {
  const token = getToken()
  if (!token) return null

  try {
    const res = await fetch('/api/users/me', {
      headers: { Authorization: `JWT ${token}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.user
  } catch {
    return null
  }
}
