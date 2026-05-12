import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintService } from '../services/api'
import PriorityBadge from '../components/PriorityBadge'
import { AlertCircle, CheckCircle, Clock, TrendingUp, ExternalLink } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#1479FF', '#14D2FF', '#14A5FF', '#D97706', '#16A34A', '#DC2626']

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [categoryData, setCategoryData] = useState([])
  const [priorityData, setPriorityData] = useState([])
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [s, c, p, co] = await Promise.all([
        complaintService.getDashboardStats(), complaintService.getCategoryStats(),
        complaintService.getPriorityStats(), complaintService.getComplaints({ limit: 10 })
      ])
      setStats(s); setCategoryData(c); setPriorityData(p); setComplaints(co.data || [])
    } catch (e) { console.error('Dashboard load failed:', e) }
    finally { setLoading(false) }
  }

  if (loading) return (
    <div className="min-h-screen px-5 md:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-[28px] font-extrabold text-text-primary uppercase tracking-tight mb-6">Dashboard</h1>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-bg-secondary border border-border-primary" />)}</div>
          <div className="h-64 bg-bg-secondary border border-border-primary" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-10 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">PUBLIC ANALYTICS</p>
          <h1 className="text-[28px] font-extrabold text-text-primary uppercase tracking-tight mb-1">Dashboard</h1>
          <p className="text-[14px] text-text-secondary">Real-time grievance resolution analytics</p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-primary border border-border-primary mb-8 animate-fade-in-up-d1">
            {[
              { icon: TrendingUp, label: 'TOTAL', value: stats.total_complaints, color: 'text-brand' },
              { icon: Clock, label: 'PENDING', value: stats.pending_complaints, color: 'text-warning' },
              { icon: AlertCircle, label: 'HIGH PRIORITY', value: stats.high_priority_complaints, color: 'text-danger' },
              { icon: CheckCircle, label: 'RESOLVED', value: stats.resolved_complaints, color: 'text-success' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-5 flex items-center gap-3">
                <s.icon size={20} className={s.color} />
                <div>
                  <p className="text-[22px] font-extrabold text-text-primary font-mono">{s.value}</p>
                  <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          {categoryData.length > 0 && (
            <div className="border border-border-primary bg-white p-5 animate-fade-in-up-d1">
              <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest mb-5 pb-2 border-b border-border-primary">By Category</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart><Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="#FFFFFF" strokeWidth={2}
                  label={({ category, value }) => `${category}: ${value}`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie><Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px', color: '#193B68' }} /></PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {priorityData.length > 0 && (
            <div className="border border-border-primary bg-white p-5 animate-fade-in-up-d2">
              <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest mb-5 pb-2 border-b border-border-primary">By Priority</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="priority" tick={{ fill: '#5A6B82', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} />
                  <YAxis tick={{ fill: '#5A6B82', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px', color: '#193B68' }} />
                  <Bar dataKey="count" fill="#1479FF" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="border border-border-primary bg-white animate-fade-in-up-d3">
          <div className="p-5 border-b border-border-primary bg-bg-secondary">
            <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-widest mb-3">Recent Complaints</h2>
            <div className="flex gap-2 flex-wrap">
              {['all', 'high', 'pending', 'resolved'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-base ${
                    filter === f ? 'bg-brand-muted text-brand border border-brand' : 'bg-white text-text-tertiary border border-border-primary hover:text-text-primary'
                  }`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-primary">
                  {['Complaint', 'Category', 'Priority', 'Status', 'Dept', ''].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest bg-bg-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {complaints.map(c => (
                  <tr key={c._id} onClick={() => navigate(`/complaints/${c._id}`)}
                    className="hover:bg-bg-secondary transition-base cursor-pointer group">
                    <td className="py-3 px-4 text-[13px] text-text-primary max-w-[200px] truncate">{c.text}</td>
                    <td className="py-3 px-4 text-[12px] text-text-secondary">{c.category}</td>
                    <td className="py-3 px-4"><PriorityBadge priority={c.priority} /></td>
                    <td className="py-3 px-4"><span className="text-[11px] font-bold text-brand bg-brand-muted px-2 py-0.5 uppercase">{c.status}</span></td>
                    <td className="py-3 px-4 text-[12px] text-text-secondary">{c.department}</td>
                    <td className="py-3 px-4"><ExternalLink size={12} className="text-text-tertiary group-hover:text-brand transition-base" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
