import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Shield, LogOut } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isAdmin, logout } = useAuth()
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/submit', label: 'File Complaint' },
    { to: '/track', label: 'Track' },
  ]

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-bg-primary/80 border-b border-border-primary">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-button-accent">
              <span className="text-white text-sm font-bold">⚡</span>
            </div>
            <span className="text-[15px] font-bold tracking-tight text-text-primary">
              Citizen<span className="text-accent">Voice</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-1.5 rounded-btn text-[13px] font-medium transition-base ${
                  pathname === l.to ? 'text-text-primary bg-white/[0.06]' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'
                }`}>{l.label}</Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2">
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-[12px] font-semibold text-purple bg-purple-muted border border-purple/20 transition-base hover:bg-purple/20">
                  <Shield size={13} />Admin Panel
                </Link>
                <button onClick={logout}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-btn text-[12px] text-text-tertiary hover:text-danger transition-base">
                  <LogOut size={13} />Logout
                </button>
              </>
            ) : (
              <Link to="/admin/login"
                className="text-[12px] text-text-tertiary hover:text-text-secondary transition-base">
                Admin →
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-text-secondary" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 pt-1 border-t border-border-primary">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded text-[13px] font-medium transition-base ${
                  pathname === l.to ? 'text-accent' : 'text-text-secondary'
                }`}>{l.label}</Link>
            ))}
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded text-[13px] font-medium text-purple">Admin Panel</Link>
                <button onClick={() => { logout(); setOpen(false) }}
                  className="block px-3 py-2 rounded text-[13px] text-danger">Logout</button>
              </>
            ) : (
              <Link to="/admin/login" onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded text-[13px] text-text-tertiary">Admin Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
