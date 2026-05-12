import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { authService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!form.email || !form.password) { setError('All fields required'); return }
    setLoading(true)
    try {
      const res = await authService.login(form)
      login(res.access_token, res.user)
      navigate('/user/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-xl mb-4 shadow-button-accent">⚖️</div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Welcome back</h1>
          <p className="text-[13px] text-text-secondary mt-1 font-body">Sign in to CitizenVoice</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-danger-muted rounded-xl text-[12px] text-danger">
              <AlertCircle size={14} />{error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[13px]" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[13px]" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-btn text-[13px] font-semibold text-white bg-accent hover:bg-accent-hover shadow-button-accent transition-base disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <div className="spinner w-4 h-4" /> : <><span>Sign In</span><ArrowRight size={14} /></>}
          </button>

          <p className="text-center text-[12px] text-text-tertiary">
            Don't have an account? <Link to="/signup" className="text-accent font-semibold hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
