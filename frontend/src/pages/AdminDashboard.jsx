import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../services/api'
import { LogOut, RefreshCw, Search } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const STATUSES = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed']

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

  const loadStats = async () => { try { setStats(await adminService.getStats()) } catch (e) { console.error(e) } }

  const loadComplaints = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.status) params.status = filters.status
      if (filters.priority) params.priority = filters.priority
      if (filters.department) params.department = filters.department
      if (filters.search) params.search = filters.search
      const res = await adminService.getComplaints(params)
      setComplaints(res.data || []); setTotal(res.total || 0)
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
    <div className="min-h-screen py-8 px-5 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-border-primary">
        <div>
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">ADMIN OPERATIONS</p>
          <h1 className="text-[28px] font-extrabold text-text-primary uppercase tracking-tight">DASHBOARD</h1>
          <p className="text-[12px] text-text-secondary mt-1">Logged in as <strong className="text-text-primary">{user?.email}</strong></p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <button onClick={() => { loadStats(); loadComplaints() }} className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-text-secondary hover:text-brand transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => { logout(); navigate('/') }} className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-text-secondary hover:text-danger transition-colors">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-primary border border-border-primary mb-8">
          {[
            { label: 'TOTAL COMPLAINTS', value: stats.total_complaints, accent: false },
            { label: 'PENDING', value: stats.pending_complaints, accent: 'border-b-2 border-warning' },
            { label: 'HIGH PRIORITY', value: stats.high_priority_complaints, accent: 'border-b-2 border-danger' },
            { label: 'RESOLVED', value: stats.resolved_complaints, accent: 'border-b-2 border-success' },
          ].map((s, i) => (
            <div key={i} className={`bg-white p-5 ${s.accent || ''}`}>
              <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-[28px] font-extrabold text-text-primary font-mono">{s.value}</p>
            </div>
          ))}
        </section>
      )}

      {/* Charts */}
      {stats && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {stats.departments?.length > 0 && (
            <div className="border border-border-primary bg-white p-5">
              <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest mb-5 pb-2 border-b border-border-primary">DEPARTMENT DISTRIBUTION</h2>
              <div className="space-y-3">
                {stats.departments.slice(0, 5).map((d, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[11px] font-bold text-text-primary uppercase">{d.department}</span>
                      <span className="text-[11px] font-mono text-text-secondary">{d.count}</span>
                    </div>
                    <div className="w-full h-2 bg-bg-tertiary">
                      <div className="h-full bg-brand transition-all" style={{ width: `${Math.min(100, (d.count / (stats.total_complaints || 1)) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {stats.priorities?.length > 0 && (
            <div className="border border-border-primary bg-white p-5">
              <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest mb-5 pb-2 border-b border-border-primary">PRIORITY BREAKDOWN</h2>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.priorities}>
                    <XAxis dataKey="priority" tick={{ fill: '#5A6B82', fontSize: 10 }} axisLine={{ stroke: '#E5E7EB' }} />
                    <YAxis tick={{ fill: '#5A6B82', fontSize: 10 }} axisLine={{ stroke: '#E5E7EB' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px', color: '#193B68' }} />
                    <Bar dataKey="count" fill="#1479FF" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Complaints Table */}
      <section className="border border-border-primary bg-white">
        <div className="p-4 border-b border-border-primary bg-bg-secondary flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-widest">CASE REGISTRY <span className="text-text-tertiary font-mono">({total})</span></h2>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center border border-border-primary bg-white px-2">
              <Search size={14} className="text-text-tertiary" />
              <input type="text" placeholder="Search..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="w-28 bg-transparent border-none text-[11px] px-2 py-1.5 outline-none" />
            </div>
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}
              className="border border-border-primary bg-white text-[11px] font-bold px-2 py-1.5 uppercase outline-none">
              <option value="">STATUS: ALL</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value })}
              className="border border-border-primary bg-white text-[11px] font-bold px-2 py-1.5 uppercase outline-none">
              <option value="">PRIORITY: ALL</option>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-primary text-[10px] font-bold text-text-tertiary uppercase tracking-widest bg-bg-secondary">
                <th className="p-3 font-normal">REF ID</th>
                <th className="p-3 font-normal">DATE</th>
                <th className="p-3 font-normal">CATEGORY</th>
                <th className="p-3 font-normal">DEPARTMENT</th>
                <th className="p-3 font-normal">STATUS</th>
                <th className="p-3 font-normal text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-[12px] divide-y divide-border-primary">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-[12px] text-text-tertiary">Loading...</td></tr>
              ) : complaints.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-[12px] text-text-tertiary">No records found</td></tr>
              ) : complaints.map(c => (
                <tr key={c._id} className="hover:bg-bg-secondary transition-colors">
                  <td className="p-3 align-top">
                    <span onClick={() => navigate(`/admin/complaint/${c._id}`)}
                      className="font-mono font-bold text-brand cursor-pointer hover:underline">{c.complaint_id}</span>
                    <span className={`block text-[9px] font-bold uppercase mt-0.5 ${c.priority === 'High' ? 'text-danger' : 'text-text-tertiary'}`}>{c.priority}</span>
                  </td>
                  <td className="p-3 font-mono text-text-secondary align-top">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="p-3 align-top max-w-[180px]">
                    <span className="font-bold text-text-primary uppercase text-[11px]">{c.category}</span>
                    <span className="block text-[11px] text-text-secondary truncate mt-0.5">{c.text}</span>
                  </td>
                  <td className="p-3 align-top">
                    <span className="font-bold text-text-primary uppercase text-[11px]">{c.department}</span>
                    {c.forwarding?.forwarded && <span className="block text-[9px] text-success font-bold mt-0.5">FWD: {c.forwarding.tracking_reference}</span>}
                  </td>
                  <td className="p-3 align-top">
                    <select value={c.status} onChange={e => updateStatus(c._id, e.target.value)}
                      className="bg-white border border-border-primary text-[11px] font-bold uppercase px-2 py-1 cursor-pointer hover:border-brand transition-colors outline-none">
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3 align-top text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => navigate(`/admin/complaint/${c._id}`)}
                        className="text-[10px] font-bold uppercase tracking-wider text-text-primary border border-border-primary px-2 py-1 hover:bg-text-primary hover:text-white transition-colors">
                        VIEW
                      </button>
                      <button onClick={() => setEditing(editing === c._id ? null : c._id)}
                        className="text-[10px] font-bold uppercase tracking-wider text-brand border border-brand px-2 py-1 hover:bg-brand hover:text-white transition-colors">
                        NOTE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editing && (
          <div className="p-4 bg-bg-secondary border-t border-border-primary animate-fade-in">
            <div className="flex items-center gap-3 max-w-xl ml-auto">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest whitespace-nowrap">
                {complaints.find(c => c._id === editing)?.complaint_id}:
              </span>
              <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Add admin note..." className="flex-1 px-3 py-1.5 text-[12px] border border-border-primary bg-white outline-none focus:border-brand" />
              <button onClick={() => addNote(editing)}
                className="px-4 py-1.5 bg-brand text-white text-[11px] font-bold uppercase tracking-wider hover:bg-brand-hover transition-colors">
                Save
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
