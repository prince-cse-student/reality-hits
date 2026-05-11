import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'
import { Shield, ArrowRight, AlertCircle } from 'lucide-react'

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
    if (!email || !password) return setError('Email and password required')
    setLoading(true)
    try {
      const data = await authService.adminLogin({ email, password })
      loginAdmin(data)
      navigate('/admin/dashboard')
    } catch (err) { setError(err.response?.data?.detail || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-muted flex items-center justify-center mb-4"><Shield size={24} className="text-purple" /></div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Admin Access</h1>
          <p className="text-[13px] text-text-secondary">Authorized personnel only</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-7 space-y-5">
          {error && <div className="flex items-center gap-2 p-3 bg-danger-muted rounded-xl text-[12px] text-danger"><AlertCircle size={14}/>{error}</div>}
          <div>
            <label className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">Admin Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@email.com" className="w-full px-3.5 py-2.5 rounded-xl text-[13px]"/>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-xl text-[13px]"/>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-btn text-[13px] font-semibold text-white bg-purple hover:bg-purple/80 transition-base disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <div className="spinner w-4 h-4"/> : <><span>Admin Login</span><ArrowRight size={14}/></>}
          </button>
        </form>
      </div>
    </div>
  )
}
