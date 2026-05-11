import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { complaintService } from '../services/api'
import PriorityBadge from '../components/PriorityBadge'
import SkeletonLoader from '../components/SkeletonLoader'
import { Plus, Search, ExternalLink, LogOut, User, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 })

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const res = await complaintService.getMyComplaints()
      const list = res.data || []
      setComplaints(list)
      setStats({
        total: list.length,
        pending: list.filter(c => !['Resolved', 'Closed'].includes(c.status)).length,
        resolved: list.filter(c => ['Resolved', 'Closed'].includes(c.status)).length,
      })
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen py-10 px-5 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-section text-text-primary">My Dashboard</h1>
            <p className="text-[13px] text-text-secondary mt-0.5 font-body">Welcome, {user?.full_name}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link to="/submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn text-[12px] font-semibold text-white bg-accent hover:bg-accent-hover shadow-button-accent transition-base">
              <Plus size={14} />New Complaint
            </Link>
            <Link to="/track"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn text-[12px] font-semibold text-text-secondary border border-border-primary hover:border-border-hover transition-base">
              <Search size={14} />Track
            </Link>
            <button onClick={() => { logout(); navigate('/') }}
              className="p-2 rounded-btn text-text-tertiary hover:text-danger transition-base" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-in-up-d1">
          {[
            { label: 'Total Filed', value: stats.total, icon: User, color: 'text-accent' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-warning' },
            { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-success' },
          ].map((s, i) => {
            const I = s.icon
            return (
              <div key={i} className="card p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color === 'text-accent' ? 'bg-accent-muted' : s.color === 'text-warning' ? 'bg-warning-muted' : 'bg-success-muted'}`}>
                  <I size={16} className={s.color} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-text-tertiary font-medium">{s.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Complaints list */}
        <div className="card p-5 animate-fade-in-up-d2">
          <h2 className="text-[14px] font-semibold text-text-primary mb-4">My Complaints</h2>

          {loading ? <SkeletonLoader /> : complaints.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle size={32} className="text-text-tertiary mx-auto mb-3" />
              <p className="text-text-secondary text-[14px] font-medium">No complaints yet</p>
              <p className="text-text-tertiary text-[12px] mt-1">File your first complaint to get started</p>
              <Link to="/submit" className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-btn text-[12px] font-semibold text-white bg-accent shadow-button-accent transition-base">
                <Plus size={14} />File Complaint
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {complaints.map(c => (
                <div key={c._id} onClick={() => navigate(`/complaints/${c._id}`)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border-primary hover:border-border-hover hover:bg-white/[0.02] cursor-pointer transition-base group">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-semibold text-accent bg-accent-muted px-1.5 py-0.5 rounded">{c.complaint_id || 'N/A'}</span>
                      <PriorityBadge priority={c.priority} />
                    </div>
                    <p className="text-[13px] text-text-primary truncate">{c.title || c.text}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-text-tertiary">{c.category}</span>
                      <span className="text-[10px] text-text-tertiary">•</span>
                      <span className="text-[10px] text-text-tertiary">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-accent-muted text-accent">{c.status}</span>
                    <ExternalLink size={12} className="text-text-tertiary group-hover:text-accent transition-base" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
