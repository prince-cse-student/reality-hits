import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore admin session from localStorage
    const stored = localStorage.getItem('cv_admin')
    const token = localStorage.getItem('cv_token')
    if (stored && token) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('cv_admin') }
    }
    setLoading(false)
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
