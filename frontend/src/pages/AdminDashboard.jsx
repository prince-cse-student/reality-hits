import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../services/api'
import PriorityBadge from '../components/PriorityBadge'
import StatCard from '../components/StatCard'
import SkeletonLoader from '../components/SkeletonLoader'
import { TrendingUp, Clock, AlertCircle, CheckCircle, Search, LogOut, Shield, ExternalLink, MessageSquare, Send } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#4F8CFF', '#22D3EE', '#7C3AED', '#FBBF24', '#22C55E', '#F87171']
const STATUSES = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed']

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card p-2 text-[10px]">
      <p className="text-text-primary font-semibold">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  )
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', priority: '', department: '', search: '' })
  const [editing, setEditing] = useState(null)
  const [noteText, setNoteText] = useState('')

  useEffect(() => { loadStats() }, [])
  useEffect(() => { loadComplaints() }, [filters])

  const loadStats = async () => {
    try { setStats(await adminService.getStats()) } catch (e) { console.error(e) }
  }

  const loadComplaints = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.status) params.status = filters.status
      if (filters.priority) params.priority = filters.priority
      if (filters.department) params.department = filters.department
      if (filters.search) params.search = filters.search
      const res = await adminService.getComplaints(params)
      setComplaints(res.data || [])
      setTotal(res.total || 0)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const updateStatus = async (id, newStatus) => {
    try { await adminService.updateComplaint(id, { status: newStatus }); loadComplaints(); loadStats() } catch (e) { console.error(e) }
  }

  const addNote = async (id) => {
    if (!noteText.trim()) return
    try { await adminService.updateComplaint(id, { admin_note: noteText }); setNoteText(''); setEditing(null); loadComplaints() } catch (e) { console.error(e) }
  }

  return (
    <div className="min-h-screen py-10 px-5 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-muted flex items-center justify-center"><Shield size={16} className="text-purple" /></div>
            <div>
              <h1 className="text-section text-text-primary">Admin Panel</h1>
              <p className="text-[12px] text-text-tertiary">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/') }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-[12px] text-text-tertiary hover:text-danger border border-border-primary transition-base">
            <LogOut size={14} />Logout
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-fade-in-up-d1">
            <StatCard icon={TrendingUp} label="Total" value={stats.total_complaints} color="blue" />
            <StatCard icon={Clock} label="Pending" value={stats.pending_complaints} color="gold" />
            <StatCard icon={AlertCircle} label="High Priority" value={stats.high_priority_complaints} color="red" />
            <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved_complaints} color="green" />
          </div>
        )}

        {/* Charts */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {stats.categories?.length > 0 && (
              <div className="card p-5 animate-fade-in-up-d1">
                <h2 className="text-[13px] font-semibold text-text-primary mb-3">By Category</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart><Pie data={stats.categories} cx="50%" cy="50%" outerRadius={65} dataKey="value" stroke="rgba(11,16,32,0.8)" strokeWidth={2}
                    label={({ category, value }) => `${category}: ${value}`}>
                    {stats.categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie><Tooltip content={<Tip />} /></PieChart>
                </ResponsiveContainer>
              </div>
            )}
            {stats.priorities?.length > 0 && (
              <div className="card p-5 animate-fade-in-up-d2">
                <h2 className="text-[13px] font-semibold text-text-primary mb-3">By Priority</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={stats.priorities}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="priority" tick={{ fill: '#6b7fa3', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                    <YAxis tick={{ fill: '#6b7fa3', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                    <Tooltip content={<Tip />} />
                    <Bar dataKey="count" fill="#4F8CFF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {stats.departments?.length > 0 && (
              <div className="card p-5 animate-fade-in-up-d3">
                <h2 className="text-[13px] font-semibold text-text-primary mb-3">By Department</h2>
                <div className="space-y-2">
                  {stats.departments.slice(0, 6).map((d, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-[11px] text-text-secondary truncate">{d.department}</p>
                          <span className="text-[10px] font-semibold text-accent ml-2">{d.count}</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-accent to-cyan" style={{ width: `${Math.min(100, (d.count / (stats.total_complaints || 1)) * 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Complaints Table */}
        <div className="card p-5 animate-fade-in-up-d3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <h2 className="text-[14px] font-semibold text-text-primary">All Complaints ({total})</h2>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input type="text" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search..." className="pl-7 pr-3 py-1.5 rounded-btn text-[11px] w-36" />
              </div>
              <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}
                className="px-2 py-1.5 rounded-btn text-[11px] bg-bg-input border border-border-primary text-text-secondary">
                <option value="">All Status</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value })}
                className="px-2 py-1.5 rounded-btn text-[11px] bg-bg-input border border-border-primary text-text-secondary">
                <option value="">All Priority</option>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
              {stats?.departments?.length > 0 && (
                <select value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value })}
                  className="px-2 py-1.5 rounded-btn text-[11px] bg-bg-input border border-border-primary text-text-secondary">
                  <option value="">All Departments</option>
                  {stats.departments.map(d => <option key={d.department} value={d.department}>{d.department}</option>)}
                </select>
              )}
            </div>
          </div>

          {loading ? <SkeletonLoader /> : complaints.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle size={28} className="text-text-tertiary mx-auto mb-2" />
              <p className="text-text-secondary text-[13px]">No complaints found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {complaints.map(c => {
                const fwd = c.forwarding || {}
                return (
                  <div key={c._id} className="border border-border-primary rounded-card p-3.5 hover:border-border-hover transition-base">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-mono font-semibold text-accent bg-accent-muted px-1.5 py-0.5 rounded">{c.complaint_id || 'N/A'}</span>
                          <PriorityBadge priority={c.priority} />
                          <span className="text-[10px] text-text-tertiary">{c.category}</span>
                          {fwd.forwarded && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-success-muted text-success flex items-center gap-0.5">
                              <Send size={8} />Forwarded
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-text-primary truncate">{c.title || c.text}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-text-tertiary">{c.location}</span>
                          <span className="text-[10px] text-text-tertiary">•</span>
                          <span className="text-[10px] text-text-tertiary">{new Date(c.created_at).toLocaleDateString()}</span>
                          {fwd.tracking_reference && (
                            <>
                              <span className="text-[10px] text-text-tertiary">•</span>
                              <span className="text-[10px] font-mono text-cyan">{fwd.tracking_reference}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <select value={c.status} onChange={e => updateStatus(c._id, e.target.value)}
                          className="px-2 py-1 rounded text-[10px] font-semibold bg-bg-input border border-border-primary text-accent">
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => setEditing(editing === c._id ? null : c._id)}
                          className="p-1.5 rounded text-text-tertiary hover:text-accent transition-base" title="Add note">
                          <MessageSquare size={12} />
                        </button>
                        <button onClick={() => navigate(`/complaints/${c._id}`)}
                          className="p-1.5 rounded text-text-tertiary hover:text-accent transition-base">
                          <ExternalLink size={12} />
                        </button>
                      </div>
                    </div>
                    {editing === c._id && (
                      <div className="mt-2.5 flex gap-2">
                        <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                          placeholder="Add admin note..." className="flex-1 px-3 py-1.5 rounded-btn text-[11px]" />
                        <button onClick={() => addNote(c._id)}
                          className="px-3 py-1.5 rounded-btn text-[11px] font-semibold text-white bg-accent transition-base">Add</button>
                      </div>
                    )}
                    {c.admin_notes?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {c.admin_notes.slice(-2).map((n, i) => (
                          <p key={i} className="text-[10px] text-text-tertiary bg-bg-secondary rounded px-2 py-1">💬 {n.note} — {n.admin}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
