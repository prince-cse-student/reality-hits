import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { complaintService } from '../services/api'
import ComplaintTimeline from '../components/ComplaintTimeline'
import PriorityBadge from '../components/PriorityBadge'
import { ArrowLeft, MapPin, Calendar, AlertCircle, Building2, Cpu, Send, Mail } from 'lucide-react'

export default function ComplaintDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [c, setC] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [id])
  const load = async () => {
    try { setC(await complaintService.getComplaintById(id)) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  if (loading) return (
    <div className="min-h-screen px-5 md:px-8 py-10">
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-bg-secondary w-48 border border-border-primary" />
        <div className="h-48 bg-bg-secondary border border-border-primary" />
        <div className="h-32 bg-bg-secondary border border-border-primary" />
      </div>
    </div>
  )

  if (!c) return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center">
        <AlertCircle size={36} className="text-danger mx-auto mb-3" />
        <h2 className="text-xl font-bold text-text-primary mb-1">Not Found</h2>
        <p className="text-[13px] text-text-secondary mb-5">This complaint doesn't exist.</p>
        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-[13px] font-bold text-brand bg-brand-muted uppercase tracking-wider transition-base hover:bg-brand hover:text-white">Back to Dashboard</button>
      </div>
    </div>
  )

  const fwd = c.forwarding || {}

  return (
    <div className="min-h-screen py-10 px-5 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 animate-fade-in-up">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-[13px] font-semibold transition-base mb-5 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />Back
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[24px] font-extrabold text-text-primary uppercase tracking-tight">Complaint Details</h1>
            {c.complaint_id && <span className="text-[11px] font-mono font-bold text-brand bg-brand-muted px-2 py-0.5">{c.complaint_id}</span>}
            <span className="text-[10px] font-bold px-2 py-0.5 bg-brand text-white uppercase tracking-widest">{c.status}</span>
          </div>
        </div>

        <div className="space-y-5">
          {/* Complaint text */}
          <div className="border border-border-primary bg-white p-6 animate-fade-in-up-d1">
            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-2">COMPLAINT</p>
            {c.title && <h3 className="text-[15px] font-bold text-text-primary mb-2">{c.title}</h3>}
            <p className="text-text-secondary text-[14px] leading-relaxed">{c.text}</p>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border-primary flex-wrap">
              <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary"><MapPin size={11} />{c.location}</span>
              <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary"><Calendar size={11} />{new Date(c.created_at).toLocaleDateString()}</span>
              {c.email && <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary"><Mail size={11} />{c.email}</span>}
            </div>
          </div>

          {/* AI Analysis */}
          <div className="border border-border-primary bg-white p-6 animate-fade-in-up-d2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-brand-muted flex items-center justify-center"><Cpu size={13} className="text-brand" /></div>
              <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-widest">AI Analysis</h2>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border-primary border border-border-primary">
              <div className="bg-white p-3">
                <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-0.5">Category</p>
                <p className="text-[14px] font-bold text-brand">{c.category}</p>
              </div>
              <div className="bg-white p-3">
                <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-0.5">Priority</p>
                <PriorityBadge priority={c.priority} />
              </div>
              <div className="bg-white p-3">
                <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-0.5">Department</p>
                <div className="flex items-center gap-1"><Building2 size={11} className="text-text-secondary" /><span className="text-[12px] font-bold text-text-primary">{c.department}</span></div>
              </div>
              <div className="bg-white p-3">
                <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-0.5">Confidence</p>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-brand font-mono">{c.ai_confidence || 0}%</span>
                  <div className="flex-1 h-1.5 bg-bg-tertiary overflow-hidden">
                    <div className="h-full bg-brand" style={{ width: `${c.ai_confidence || 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
            {c.ai_summary && (
              <div className="mt-4 pt-3 border-t border-border-primary">
                <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">AI Summary</p>
                <p className="text-[12px] text-text-secondary">{c.ai_summary}</p>
              </div>
            )}
            {c.ai_reasoning && (
              <div className="mt-3 pt-3 border-t border-border-primary">
                <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">AI Reasoning</p>
                <p className="text-[12px] text-text-secondary italic">{c.ai_reasoning}</p>
              </div>
            )}
          </div>

          {/* Forwarding Proof */}
          {fwd.forwarded && (
            <div className="border border-border-primary bg-white p-6 animate-fade-in-up-d2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-success-muted flex items-center justify-center"><Send size={13} className="text-success" /></div>
                <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-widest">Forwarding Proof</h2>
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 bg-success-muted text-success uppercase">✓ Forwarded</span>
              </div>
              <div className="grid grid-cols-2 gap-px bg-border-primary border border-border-primary">
                {[
                  { label: 'FORWARDED TO', value: fwd.forwarded_to },
                  { label: 'TRACKING REF', value: fwd.tracking_reference, mono: true },
                  { label: 'METHOD', value: fwd.forward_method },
                  { label: 'RESPONSE SLA', value: fwd.response_sla },
                  { label: 'DEPT HEAD', value: fwd.department_head },
                  { label: 'FORWARDED AT', value: new Date(fwd.forwarded_at).toLocaleString(), mono: true },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-3">
                    <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className={`text-[12px] font-bold text-text-primary ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Log */}
          {c.email_logs?.length > 0 && (
            <div className="border border-border-primary bg-white p-6 animate-fade-in-up-d3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-brand-muted flex items-center justify-center"><Mail size={13} className="text-brand" /></div>
                <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-widest">Email Delivery Log</h2>
              </div>
              {c.email_logs.map((log, i) => (
                <div key={i} className="bg-bg-secondary p-3.5 border border-border-primary mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-text-secondary">{log.to}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-success-muted text-success uppercase">{log.status}</span>
                  </div>
                  <p className="text-[12px] font-bold text-text-primary mb-1">{log.subject}</p>
                  <div className="flex items-center gap-3 text-[10px] text-text-tertiary flex-wrap">
                    <span>ID: {log.message_id}</span>
                    <span>{new Date(log.sent_at).toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-text-tertiary mt-1 italic">{log.delivery_status}</p>
                </div>
              ))}
            </div>
          )}

          {/* Timeline */}
          {c.timeline?.length > 0 && (
            <div className="border border-border-primary bg-white p-6 animate-fade-in-up-d3">
              <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-widest mb-4">Complaint Lifecycle</h2>
              <ComplaintTimeline timeline={c.timeline} />
            </div>
          )}

          {/* Admin Notes */}
          {c.admin_notes?.length > 0 && (
            <div className="border border-border-primary bg-white p-6">
              <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-widest mb-3">Admin Notes</h2>
              <div className="space-y-2">
                {c.admin_notes.map((n, i) => (
                  <div key={i} className="bg-bg-secondary p-3 border border-border-primary">
                    <p className="text-[12px] text-text-primary">{n.note}</p>
                    <p className="text-[10px] text-text-tertiary mt-1">{n.admin} • {n.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {c.image_url && (
            <div className="border border-border-primary bg-white p-6">
              <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-widest mb-3">Evidence</h2>
              <img src={c.image_url} alt="Evidence" className="max-w-full border border-border-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
