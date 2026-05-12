import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'
import { Shield, ArrowRight, AlertTriangle } from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { loginAdmin, isAdmin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAdmin) { navigate('/admin/dashboard'); return null }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!email || !password) return setError('Email and password are required.')
    setLoading(true)
    try {
      const data = await authService.adminLogin({ email, password })
      loginAdmin(data)
      navigate('/admin/dashboard')
    } catch (err) { setError(err.response?.data?.detail || 'Invalid credentials.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 bg-bg-secondary">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="border border-border-primary bg-white shadow-card">
          {/* Top accent */}
          <div className="h-1 bg-brand" />

          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={22} className="text-brand" />
              <div>
                <h1 className="text-[20px] font-extrabold text-text-primary uppercase tracking-tight">ADMIN LOGIN</h1>
                <p className="text-[11px] text-text-tertiary">Authorized personnel only</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-2 p-3 border border-danger bg-danger-muted">
                  <AlertTriangle size={14} className="text-danger flex-shrink-0 mt-0.5" />
                  <p className="text-danger text-[12px]">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">EMAIL</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@domain.gov"
                  className="w-full px-4 py-3 border border-border-primary text-[14px]" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">PASSWORD</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border-primary text-[14px]" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-text-primary text-white text-[13px] font-bold uppercase tracking-wider hover:bg-brand transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'AUTHENTICATING...' : <><span>LOGIN</span><ArrowRight size={14} /></>}
              </button>
            </form>

            <div className="border-t border-border-primary mt-6 pt-4">
              <p className="text-[9px] text-text-tertiary text-center uppercase tracking-widest">
                Unauthorized access is prohibited and logged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
