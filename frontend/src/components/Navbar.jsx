import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAdmin, logout } = useAuth()
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'HOME' },
    { to: '/features', label: 'FEATURES' },
    { to: '/submit', label: 'FILE COMPLAINT' },
    { to: '/track', label: 'TRACK COMPLAINT' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border-primary">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-[18px] font-extrabold tracking-tight text-text-primary uppercase">
                CITIZENVOICE
              </span>
            </Link>
            <div className="hidden md:block h-8 w-px bg-border-primary" />
            <span className="hidden md:block text-[10px] font-medium text-text-tertiary uppercase tracking-widest leading-tight">
              PUBLIC GRIEVANCE<br />RESOLUTION SYSTEM
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-2 text-[12px] font-semibold tracking-wider transition-base ${
                  pathname === l.to
                    ? 'text-text-primary border-b-2 border-text-primary -mb-px'
                    : 'text-text-secondary hover:text-text-primary'
                }`}>{l.label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center">
            {isAdmin && (
              <div className="flex items-center gap-3">
                <Link to="/admin/dashboard"
                  className="text-[12px] font-semibold tracking-wider text-brand hover:text-brand-hover transition-base">
                  DASHBOARD
                </Link>
                <button onClick={logout}
                  className="text-[12px] font-semibold tracking-wider text-text-tertiary hover:text-danger transition-base">
                  LOGOUT
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-text-primary" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-5 pt-2 border-t border-border-primary space-y-1">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 text-[13px] font-semibold tracking-wide ${
                  pathname === l.to ? 'text-brand bg-brand-muted' : 'text-text-secondary'
                }`}>{l.label}</Link>
            ))}
            <div className="pt-3 mt-3 border-t border-border-primary">
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-[13px] font-semibold text-brand">DASHBOARD</Link>
                  <button onClick={() => { logout(); setOpen(false) }}
                    className="block px-3 py-2 text-[13px] font-semibold text-danger">LOGOUT</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
