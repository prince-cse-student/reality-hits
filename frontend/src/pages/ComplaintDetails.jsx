import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { complaintService } from '../services/api'
import ComplaintTimeline from '../components/ComplaintTimeline'
import PriorityBadge from '../components/PriorityBadge'
import SkeletonLoader from '../components/SkeletonLoader'
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

  if (loading) return <div className="min-h-screen px-5 md:px-8 py-10"><div className="max-w-3xl mx-auto"><SkeletonLoader /></div></div>

  if (!c) return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center">
        <AlertCircle size={36} className="text-danger mx-auto mb-3" />
        <h2 className="text-xl font-bold text-text-primary mb-1">Not Found</h2>
        <p className="text-[13px] text-text-secondary mb-5 font-body">This complaint doesn't exist.</p>
        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-[13px] font-medium text-accent bg-accent-muted rounded-btn transition-base hover:bg-accent/20">Back to Dashboard</button>
      </div>
    </div>
  )

  const fwd = c.forwarding || {}

  return (
    <div className="min-h-screen py-10 px-5 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 animate-fade-in-up">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-[13px] font-medium transition-base mb-5 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />Back
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-section text-text-primary">Complaint Details</h1>
            {c.complaint_id && <span className="text-[11px] font-mono font-semibold text-accent bg-accent-muted px-2 py-0.5 rounded">{c.complaint_id}</span>}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-accent-muted text-accent">{c.status}</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Complaint text */}
          <div className="card p-6 animate-fade-in-up-d1">
            <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">Complaint</p>
            {c.title && <h3 className="text-[15px] font-semibold text-text-primary mb-2">{c.title}</h3>}
            <p className="text-text-secondary text-[13px] leading-relaxed font-body">{c.text}</p>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border-primary flex-wrap">
              <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary"><MapPin size={11} />{c.location}</span>
              <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary"><Calendar size={11} />{new Date(c.created_at).toLocaleDateString()}</span>
              {c.email && <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary"><Mail size={11} />{c.email}</span>}
            </div>
          </div>

          {/* AI Analysis */}
          <div className="card p-6 relative overflow-hidden animate-fade-in-up-d2">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-accent/[0.04] to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-accent-muted flex items-center justify-center"><Cpu size={13} className="text-accent" /></div>
                <h2 className="text-[14px] font-semibold text-text-primary">AI Analysis</h2>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
                  <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Category</p>
                  <p className="text-[14px] font-bold text-accent">{c.category}</p>
                </div>
                <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
                  <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Priority</p>
                  <PriorityBadge priority={c.priority} />
                </div>
                <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
                  <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Department</p>
                  <div className="flex items-center gap-1"><Building2 size={11} className="text-text-secondary" /><span className="text-[12px] text-text-primary font-medium">{c.department}</span></div>
                </div>
                <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
                  <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Confidence</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-accent">{c.ai_confidence || 0}%</span>
                    <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-accent to-cyan progress-glow" style={{ width: `${c.ai_confidence || 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              {c.ai_summary && (
                <div className="mt-3 pt-3 border-t border-border-primary">
                  <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-1">AI Summary</p>
                  <p className="text-[12px] text-text-secondary font-body">{c.ai_summary}</p>
                </div>
              )}
              {c.ai_reasoning && (
                <div className="mt-2 pt-2 border-t border-border-primary">
                  <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-1">AI Reasoning</p>
                  <p className="text-[12px] text-text-secondary font-body italic">{c.ai_reasoning}</p>
                </div>
              )}
            </div>
          </div>

          {/* Forwarding Proof */}
          {fwd.forwarded && (
            <div className="card p-6 relative overflow-hidden animate-fade-in-up-d2">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-success/[0.03] to-transparent pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-success-muted flex items-center justify-center"><Send size={13} className="text-success" /></div>
                  <h2 className="text-[14px] font-semibold text-text-primary">Forwarding Proof</h2>
                  <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded bg-success-muted text-success">✓ Forwarded</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
                    <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Forwarded To</p>
                    <p className="text-[12px] font-semibold text-text-primary">{fwd.forwarded_to}</p>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
                    <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Tracking Reference</p>
                    <p className="text-[12px] font-mono font-semibold text-cyan">{fwd.tracking_reference}</p>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
                    <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Method</p>
                    <p className="text-[12px] text-text-primary">{fwd.forward_method}</p>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
                    <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Response SLA</p>
                    <p className="text-[12px] text-warning font-semibold">{fwd.response_sla}</p>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
                    <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Department Head</p>
                    <p className="text-[12px] text-text-primary">{fwd.department_head}</p>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
                    <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Forwarded At</p>
                    <p className="text-[11px] text-text-secondary font-mono">{new Date(fwd.forwarded_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Log */}
          {c.email_logs?.length > 0 && (
            <div className="card p-6 animate-fade-in-up-d3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-cyan-muted flex items-center justify-center"><Mail size={13} className="text-cyan" /></div>
                <h2 className="text-[14px] font-semibold text-text-primary">Email Delivery Log</h2>
              </div>
              {c.email_logs.map((log, i) => (
                <div key={i} className="bg-bg-secondary rounded-xl p-3.5 border border-border-primary">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-text-secondary">{log.to}</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-success-muted text-success">{log.status}</span>
                  </div>
                  <p className="text-[12px] text-text-primary font-medium mb-1">{log.subject}</p>
                  <div className="flex items-center gap-3 text-[10px] text-text-tertiary flex-wrap">
                    <span>ID: {log.message_id}</span>
                    <span>{new Date(log.sent_at).toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-text-tertiary mt-1 italic">{log.delivery_status}</p>
                </div>
              ))}
            </div>
          )}

          {/* Lifecycle Timeline */}
          {c.timeline?.length > 0 && (
            <div className="card p-6 animate-fade-in-up-d3">
              <h2 className="text-[14px] font-semibold text-text-primary mb-4">Complaint Lifecycle</h2>
              <ComplaintTimeline timeline={c.timeline} />
            </div>
          )}

          {/* Admin Notes */}
          {c.admin_notes?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-[14px] font-semibold text-text-primary mb-3">Admin Notes</h2>
              <div className="space-y-2">
                {c.admin_notes.map((n, i) => (
                  <div key={i} className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
                    <p className="text-[12px] text-text-primary font-body">{n.note}</p>
                    <p className="text-[10px] text-text-tertiary mt-1">{n.admin} • {n.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {c.image_url && (
            <div className="card p-6">
              <h2 className="text-[14px] font-semibold text-text-primary mb-3">Evidence</h2>
              <img src={c.image_url} alt="Evidence" className="max-w-full rounded-xl border border-border-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
