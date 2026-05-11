import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintService } from '../services/api'
import StatCard from '../components/StatCard'
import PriorityBadge from '../components/PriorityBadge'
import SkeletonLoader from '../components/SkeletonLoader'
import { AlertCircle, CheckCircle, Clock, TrendingUp, ExternalLink } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#4F8CFF', '#22D3EE', '#7C3AED', '#FBBF24', '#22C55E', '#F87171']

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card p-2.5 text-[11px]">
      <p className="text-text-primary font-semibold mb-0.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

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
      <div className="max-w-6xl mx-auto"><h1 className="text-section text-text-primary mb-6">Dashboard</h1><SkeletonLoader /></div>
    </div>
  )

  return (
    <div className="min-h-screen py-10 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-section text-text-primary mb-1">Dashboard</h1>
          <p className="text-[14px] text-text-secondary font-body">Real-time grievance resolution analytics</p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-fade-in-up-d1">
            <StatCard icon={TrendingUp} label="Total Complaints" value={stats.total_complaints} color="blue" />
            <StatCard icon={Clock} label="Pending" value={stats.pending_complaints} color="gold" />
            <StatCard icon={AlertCircle} label="High Priority" value={stats.high_priority_complaints} color="red" />
            <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved_complaints} color="green" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {categoryData.length > 0 && (
            <div className="card p-5 animate-fade-in-up-d1">
              <h2 className="text-[14px] font-semibold text-text-primary mb-5">By Category</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart><Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="rgba(11,16,32,0.8)" strokeWidth={2}
                  label={({ category, value }) => `${category}: ${value}`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie><Tooltip content={<ChartTooltip />} /></PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {priorityData.length > 0 && (
            <div className="card p-5 animate-fade-in-up-d2">
              <h2 className="text-[14px] font-semibold text-text-primary mb-5">By Priority</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="priority" tick={{ fill: '#6b7fa3', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                  <YAxis tick={{ fill: '#6b7fa3', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="count" fill="#4F8CFF" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card p-5 animate-fade-in-up-d3">
          <h2 className="text-[14px] font-semibold text-text-primary mb-4">Recent Complaints</h2>
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {['all', 'high', 'pending', 'resolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-btn text-[11px] font-semibold transition-base ${
                  filter === f ? 'bg-accent-muted text-accent border border-accent/20' : 'bg-white/[0.03] text-text-tertiary hover:text-text-secondary border border-transparent'
                }`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-primary">
                  {['Complaint', 'Category', 'Priority', 'Status', 'Dept', ''].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id} onClick={() => navigate(`/complaints/${c._id}`)}
                    className="border-b border-border-primary/50 hover:bg-white/[0.02] transition-base cursor-pointer group">
                    <td className="py-3.5 px-3 text-[13px] text-text-primary max-w-[200px] truncate font-body">{c.text}</td>
                    <td className="py-3.5 px-3 text-[12px] text-text-secondary">{c.category}</td>
                    <td className="py-3.5 px-3"><PriorityBadge priority={c.priority} /></td>
                    <td className="py-3.5 px-3"><span className="text-[11px] font-semibold text-accent bg-accent-muted px-2 py-0.5 rounded">{c.status}</span></td>
                    <td className="py-3.5 px-3 text-[12px] text-text-secondary">{c.department}</td>
                    <td className="py-3.5 px-3"><ExternalLink size={12} className="text-text-tertiary group-hover:text-accent transition-base" /></td>
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
