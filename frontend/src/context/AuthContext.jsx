import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('cv_admin')
    const token = localStorage.getItem('cv_token')
    if (stored && token && !isTokenExpired(token)) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('cv_admin') }
    } else {
      localStorage.removeItem('cv_token')
      localStorage.removeItem('cv_admin')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => setUser(null)
    window.addEventListener('cv:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('cv:unauthorized', handleUnauthorized)
  }, [])

  const loginAdmin = (data) => {
    localStorage.setItem('cv_token', data.access_token)
    localStorage.setItem('cv_admin', JSON.stringify(data.user))
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('cv_token')
    localStorage.removeItem('cv_admin')
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, isAdmin, loginAdmin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp ? payload.exp * 1000 <= Date.now() : true
  } catch {
    return true
  }
}
