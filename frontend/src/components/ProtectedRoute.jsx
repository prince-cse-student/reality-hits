import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return null
  return isAdmin ? children : <Navigate to="/admin/login" />
}
