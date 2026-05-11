import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintService } from '../services/api'
import ComplaintTimeline from '../components/ComplaintTimeline'
import PriorityBadge from '../components/PriorityBadge'
import { Search, AlertCircle, MapPin, Calendar, Building2, Cpu, Send, Mail, User, Phone } from 'lucide-react'

export default function TrackComplaint() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('id')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [single, setSingle] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTrack = async (e) => {
    e.preventDefault(); setError(''); setResults([]); setSingle(null)
    if (!query.trim()) return setError('Enter a value to search')
    setLoading(true)
    try {
      const params = mode === 'id' ? { complaint_id: query.trim() } : mode === 'email' ? { email: query.trim() } : { mobile: query.trim() }
      const res = await complaintService.trackComplaint(params)
      if (res.data) setResults(res.data)
      else setSingle(res)
    } catch (err) { setError(err.response?.data?.detail || 'No complaints found') }
    finally { setLoading(false) }
  }

  const modes = [
    { id: 'id', label: 'Complaint ID', icon: Search, placeholder: 'e.g., CV-2026-000001' },
    { id: 'email', label: 'Email', icon: Mail, placeholder: 'you@email.com' },
    { id: 'mobile', label: 'Mobile', icon: Phone, placeholder: '9876543210' },
  ]

  const renderComplaint = (c) => {
    const fwd = c.forwarding || {}
    return (
      <div key={c._id} className="space-y-3">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <span className="text-[11px] font-mono font-semibold text-accent bg-accent-muted px-2 py-0.5 rounded">{c.complaint_id}</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-accent-muted text-accent">{c.status}</span>
          </div>
          {c.title && <h3 className="text-[14px] font-semibold text-text-primary mb-1">{c.title}</h3>}
          <p className="text-text-secondary text-[13px] leading-relaxed mb-3 font-body">{c.text}</p>
          <div className="flex items-center gap-4 text-[11px] text-text-tertiary flex-wrap">
            {c.citizen_name && <span className="flex items-center gap-1"><User size={11}/>{c.citizen_name}</span>}
            <span className="flex items-center gap-1"><MapPin size={11}/>{c.location}</span>
            <span className="flex items-center gap-1"><Calendar size={11}/>{new Date(c.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-1.5 mb-3"><Cpu size={14} className="text-accent"/><h3 className="text-[13px] font-semibold text-text-primary">AI Analysis</h3></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary"><p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Category</p><p className="text-[13px] font-semibold text-accent">{c.category}</p></div>
            <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary"><p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Priority</p><PriorityBadge priority={c.priority}/></div>
            <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary"><p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Department</p><div className="flex items-center gap-1"><Building2 size={11} className="text-text-secondary"/><span className="text-[12px] text-text-primary">{c.department}</span></div></div>
            <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary"><p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Confidence</p><p className="text-[13px] font-bold text-accent">{c.ai_confidence||0}%</p></div>
          </div>
        </div>
        {fwd.forwarded && (
          <div className="card p-5">
            <div className="flex items-center gap-1.5 mb-3"><Send size={14} className="text-success"/><h3 className="text-[13px] font-semibold text-text-primary">Forwarding Proof</h3><span className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded bg-success-muted text-success">✓ Forwarded</span></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary"><p className="text-[9px] text-text-tertiary uppercase mb-0.5">To</p><p className="text-[12px] font-semibold text-text-primary">{fwd.forwarded_to}</p></div>
              <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary"><p className="text-[9px] text-text-tertiary uppercase mb-0.5">Tracking Ref</p><p className="text-[12px] font-mono font-semibold text-cyan">{fwd.tracking_reference}</p></div>
              <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary"><p className="text-[9px] text-text-tertiary uppercase mb-0.5">Dept Head</p><p className="text-[12px] text-text-primary">{fwd.department_head}</p></div>
              <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary"><p className="text-[9px] text-text-tertiary uppercase mb-0.5">SLA</p><p className="text-[12px] text-warning font-semibold">{fwd.response_sla}</p></div>
            </div>
          </div>
        )}
        {c.timeline?.length > 0 && <div className="card p-5"><h3 className="text-[13px] font-semibold text-text-primary mb-3">Lifecycle</h3><ComplaintTimeline timeline={c.timeline}/></div>}
        {c.admin_notes?.length > 0 && (
          <div className="card p-5"><h3 className="text-[13px] font-semibold text-text-primary mb-3">Admin Remarks</h3>
            <div className="space-y-2">{c.admin_notes.map((n,i)=><div key={i} className="bg-bg-secondary rounded-xl p-3 border border-border-primary"><p className="text-[12px] text-text-primary font-body">{n.note}</p><p className="text-[10px] text-text-tertiary mt-1">{n.admin} • {n.timestamp}</p></div>)}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-5 md:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-section text-text-primary mb-1">Track Complaint</h1>
          <p className="text-[14px] text-text-secondary font-body">Check status, forwarding proof, and resolution updates</p>
        </div>
        <div className="card p-5 mb-6 animate-fade-in-up-d1">
          <div className="flex gap-2 mb-4">
            {modes.map(m=><button key={m.id} onClick={()=>{setMode(m.id);setResults([]);setSingle(null);setError('');setQuery('')}} className={`px-3 py-1.5 rounded-btn text-[11px] font-semibold transition-base flex items-center gap-1 ${mode===m.id?'bg-accent-muted text-accent border border-accent/20':'text-text-tertiary border border-transparent'}`}><m.icon size={11}/>{m.label}</button>)}
          </div>
          <form onSubmit={handleTrack} className="space-y-3">
            <input type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder={modes.find(m=>m.id===mode)?.placeholder} className="w-full px-3.5 py-2.5 rounded-xl text-[13px]"/>
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-btn text-[13px] font-semibold text-white bg-accent hover:bg-accent-hover shadow-button-accent transition-base disabled:opacity-50 flex items-center justify-center gap-2">
              {loading?<div className="spinner w-4 h-4"/>:<><Search size={14}/>Track</>}
            </button>
          </form>
          {error && <div className="flex items-center gap-2 mt-3 p-3 bg-danger-muted rounded-xl text-[12px] text-danger"><AlertCircle size={14}/>{error}</div>}
        </div>
        {single && <div className="animate-fade-in-up">{renderComplaint(single)}</div>}
        {results.length > 0 && <div className="space-y-6 animate-fade-in-up">{results.map(c=>renderComplaint(c))}</div>}
      </div>
    </div>
  )
}
