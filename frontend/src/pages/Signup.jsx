import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle } from 'lucide-react'
import { authService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', mobile: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!form.full_name || !form.email || !form.mobile || !form.password) { setError('All fields required'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await authService.signup(form)
      login(res.access_token, res.user)
      navigate('/user/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed')
    } finally { setLoading(false) }
  }

  const fields = [
    { name: 'full_name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'you@example.com' },
    { name: 'mobile', label: 'Mobile Number', icon: Phone, type: 'tel', placeholder: '+91 98765 43210' },
    { name: 'password', label: 'Password', icon: Lock, type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-xl mb-4 shadow-button-accent">⚖️</div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Create account</h1>
          <p className="text-[13px] text-text-secondary mt-1 font-body">Join CitizenVoice platform</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-danger-muted rounded-xl text-[12px] text-danger">
              <AlertCircle size={14} />{error}
            </div>
          )}

          {fields.map(f => {
            const Icon = f.icon
            return (
              <div key={f.name}>
                <label className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">{f.label}</label>
                <div className="relative">
                  <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input type={f.type} value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                    placeholder={f.placeholder} className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[13px]" />
                </div>
              </div>
            )
          })}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-btn text-[13px] font-semibold text-white bg-accent hover:bg-accent-hover shadow-button-accent transition-base disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <div className="spinner w-4 h-4" /> : <><span>Create Account</span><ArrowRight size={14} /></>}
          </button>

          <p className="text-center text-[12px] text-text-tertiary">
            Already have an account? <Link to="/login" className="text-accent font-semibold hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
