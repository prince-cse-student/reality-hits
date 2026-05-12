import { useState } from 'react'
import { complaintService, resolveUploadUrl } from '../services/api'
import ComplaintTimeline from '../components/ComplaintTimeline'
import { Search, AlertTriangle } from 'lucide-react'

export default function TrackComplaint() {
  const [mode, setMode] = useState('id')
  const [query, setQuery] = useState('')
  const [contact, setContact] = useState('')
  const [results, setResults] = useState([])
  const [single, setSingle] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTrack = async (e) => {
    e.preventDefault(); setError(''); setResults([]); setSingle(null)
    if (!query.trim()) return setError('Please enter your complaint reference ID.')
    if (!contact.trim()) return setError('Please enter the registered email or mobile number.')
    setLoading(true)
    try {
      const isEmail = contact.includes('@')
      const params = isEmail
        ? { complaint_id: query.trim(), email: contact.trim() }
        : { complaint_id: query.trim(), mobile: contact.trim() }
      const res = await complaintService.trackComplaint(params)
      if (res.data) setResults(res.data)
      else setSingle(res)
    } catch (err) { setError(err.response?.data?.detail || 'No matching records found.') }
    finally { setLoading(false) }
  }

  const modes = [
    { id: 'id', label: 'REFERENCE ID', placeholder: 'CV-...' },
  ]

  const renderComplaint = (c) => {
    const fwd = c.forwarding || {}
    return (
      <div key={c._id} className="mt-8 space-y-6">

        {/* Header */}
        <div className="border border-border-primary bg-white">
          <div className="h-1 bg-brand" />
          <div className="p-6 md:p-8 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">COMPLAINT RECORD</p>
              <h3 className="text-[22px] font-extrabold text-text-primary font-mono tracking-wider">{c.complaint_id}</h3>
            </div>
            <span className="px-3 py-1 bg-brand text-white text-[10px] font-bold uppercase tracking-widest">
              {c.status}
            </span>
          </div>
        </div>

        {/* Complaint Metadata */}
        <section className="border border-border-primary bg-white">
          <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary">
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">COMPLAINT METADATA</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-primary">
            {[
              { label: 'COMPLAINT ID', value: c.complaint_id, mono: true },
              { label: 'SUBMISSION DATE', value: new Date(c.created_at).toLocaleDateString() },
              { label: 'STATUS', value: c.status },
              { label: 'PRIORITY', value: c.priority, color: c.priority === 'High' ? 'text-danger' : c.priority === 'Medium' ? 'text-warning' : 'text-success' },
              { label: 'CATEGORY', value: c.category },
              { label: 'LANGUAGE', value: c.language || 'English' },
              { label: 'CONFIDENCE', value: `${c.ai_confidence || 0}%`, mono: true },
              { label: 'DEPARTMENT', value: c.department },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4">
                <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{item.label}</p>
                <p className={`text-[13px] font-bold uppercase ${item.color || 'text-text-primary'} ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Citizen Information */}
        <section className="border border-border-primary bg-white">
          <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary">
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">CITIZEN INFORMATION</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-primary">
            {[
              { label: 'NAME', value: c.citizen_name || '—' },
              { label: 'PHONE', value: c.citizen_phone || '—' },
              { label: 'EMAIL', value: c.citizen_email || '—' },
              { label: 'LOCATION', value: c.location || '—' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4">
                <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-0.5">{item.label}</p>
                <p className="text-[13px] text-text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Complaint Summary */}
        <section className="border border-border-primary bg-white">
          <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary">
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">COMPLAINT SUMMARY</h2>
          </div>
          <div className="p-5">
            <p className="text-[14px] text-text-primary leading-relaxed">{c.ai_summary || c.title || 'Summary unavailable.'}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 pt-3 border-t border-border-primary">
              {c.citizen_name && <span className="text-[11px] text-text-secondary"><strong className="text-text-primary">Filed by:</strong> {c.citizen_name}</span>}
              <span className="text-[11px] text-text-secondary"><strong className="text-text-primary">Location:</strong> {c.location}</span>
              <span className="text-[11px] text-text-secondary"><strong className="text-text-primary">Date:</strong> {new Date(c.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          {c.language && c.language !== 'English' && (
            <div className="px-5 pb-5">
              <div className="border-t border-border-primary pt-4">
                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-2">DESCRIPTION IN ENGLISH</p>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {c.ai_summary || 'No English translation available.'}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3">
                  {c.citizen_name && <span className="text-[11px] text-text-secondary"><strong className="text-text-primary">Filed by:</strong> {c.citizen_name}</span>}
                  <span className="text-[11px] text-text-secondary"><strong className="text-text-primary">Location:</strong> {c.location}</span>
                  <span className="text-[11px] text-text-secondary"><strong className="text-text-primary">Date:</strong> {new Date(c.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* AI Analysis */}
        <section className="border border-border-primary bg-white">
          <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary">
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">AI ANALYSIS</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border-primary">
            {[
              { label: 'DEPARTMENT', value: c.department },
              { label: 'CATEGORY', value: c.category },
              { label: 'PRIORITY', value: c.priority, color: c.priority === 'High' ? 'text-danger' : c.priority === 'Medium' ? 'text-warning' : 'text-success' },
              { label: 'CONFIDENCE SCORE', value: `${c.ai_confidence || 0}%`, mono: true },
              { label: 'LANGUAGE DETECTED', value: c.language || 'English' },
              { label: 'STATUS', value: c.status },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4">
                <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{item.label}</p>
                <p className={`text-[13px] font-bold uppercase ${item.color || 'text-text-primary'} ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
              </div>
            ))}
          </div>
          {c.ai_reasoning && (
            <div className="px-5 py-4 border-t border-border-primary">
              <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1.5">AI REASONING</p>
              <p className="text-[13px] text-text-secondary leading-relaxed">{c.ai_reasoning}</p>
            </div>
          )}
          {c.ai_summary && (
            <div className="px-5 py-4 border-t border-border-primary">
              <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1.5">AI SUMMARY</p>
              <p className="text-[13px] text-text-secondary leading-relaxed">{c.ai_summary}</p>
            </div>
          )}
        </section>

        {/* Dispatch Information */}
        <section className="border border-border-primary bg-white">
          <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary flex items-center justify-between">
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">DISPATCH INFORMATION</h2>
            {fwd.forwarded && <span className="text-[9px] font-bold text-success uppercase tracking-widest">✓ FORWARDED</span>}
          </div>
          {fwd.forwarded ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border-primary">
              {[
                { label: 'FORWARDED TO', value: fwd.forwarded_to },
                { label: 'INTERNAL REF', value: fwd.tracking_reference, mono: true },
                { label: 'SLA TIME', value: fwd.response_sla },
                { label: 'DEPT. HEAD', value: fwd.department_head || '—' },
                { label: 'METHOD', value: fwd.forward_method || '—' },
                { label: 'FORWARDED AT', value: fwd.forwarded_at ? new Date(fwd.forwarded_at).toLocaleString() : '—', mono: true },
              ].map((item, i) => (
                <div key={i} className="bg-white p-4">
                  <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{item.label}</p>
                  <p className={`text-[12px] font-bold text-text-primary ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 flex items-center justify-center">
              <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest">AWAITING DISPATCH</p>
            </div>
          )}
        </section>

        {/* Case Timeline */}
        {c.timeline?.length > 0 && (
          <section className="border border-border-primary bg-white">
            <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary">
              <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">CASE TIMELINE</h2>
            </div>
            <div className="p-5">
              <ComplaintTimeline timeline={c.timeline} />
            </div>
          </section>
        )}

        {/* Evidence */}
        {c.image_url && (
          <section className="border border-border-primary bg-white">
            <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary">
              <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">EVIDENCE</h2>
            </div>
            <div className="p-5">
              <img src={resolveUploadUrl(c.image_url)} alt="Evidence" className="max-w-full border border-border-primary" />
            </div>
          </section>
        )}

      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-5 md:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-2">TRACKING PORTAL</p>
        <h1 className="text-[28px] md:text-[32px] font-extrabold text-text-primary uppercase tracking-tight mb-3">TRACK YOUR COMPLAINT</h1>
        <p className="text-[14px] text-text-secondary max-w-md">
          Look up your complaint status using your reference ID and registered contact detail.
        </p>
        <div className="w-16 h-[2px] bg-brand mt-5" />
      </div>

      {/* Search */}
      <div className="border border-border-primary bg-white mb-4 animate-fade-in-up-d1">
        <div className="flex border-b border-border-primary">
          {modes.map(m => (
            <button key={m.id} onClick={() => { setMode(m.id); setResults([]); setSingle(null); setError(''); setQuery(''); setContact('') }}
              className={`px-5 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                mode === m.id ? 'text-brand border-b-2 border-brand -mb-px bg-brand-light' : 'text-text-tertiary hover:text-text-primary'
              }`}>{m.label}</button>
          ))}
        </div>

        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-3 p-5">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder={modes.find(m => m.id === mode)?.placeholder}
            className="flex-1 px-4 py-3 border border-border-primary text-[14px]" />
          <input type="text" value={contact} onChange={e => setContact(e.target.value)}
            placeholder="Registered email or mobile"
            className="flex-1 px-4 py-3 border border-border-primary text-[14px]" />
          <button type="submit" disabled={loading}
            className="px-8 py-3 bg-text-primary text-white text-[13px] font-bold uppercase tracking-wider hover:bg-brand transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'SEARCHING...' : <><Search size={16} /> SEARCH</>}
          </button>
        </form>

        {error && (
          <div className="flex items-center gap-3 mx-5 mb-5 p-3 border border-danger bg-danger-muted">
            <AlertTriangle size={14} className="text-danger flex-shrink-0" />
            <p className="text-danger text-[12px]">{error}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {single && renderComplaint(single)}
      {results.length > 0 && <div className="space-y-8">{results.map(c => renderComplaint(c))}</div>}
    </div>
  )
}
