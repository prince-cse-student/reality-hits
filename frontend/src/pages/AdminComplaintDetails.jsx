import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminService, resolveUploadUrl } from '../services/api'
import ComplaintTimeline from '../components/ComplaintTimeline'
import { ArrowLeft, MapPin, Calendar, User, Phone, Mail, Globe, Building2, Cpu, Send, Image } from 'lucide-react'

const STATUSES = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed']

export default function AdminComplaintDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [c, setC] = useState(null)
  const [loading, setLoading] = useState(true)
  const [noteText, setNoteText] = useState('')

  useEffect(() => { load() }, [id])
  const load = async () => {
    try { setC(await adminService.getComplaintById(id)) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const updateStatus = async (newStatus) => {
    try { await adminService.updateComplaint(id, { status: newStatus }); load() } catch (e) { console.error(e) }
  }

  const addNote = async () => {
    if (!noteText.trim()) return
    try { await adminService.updateComplaint(id, { admin_note: noteText }); setNoteText(''); load() } catch (e) { console.error(e) }
  }

  if (loading) return (
    <div className="min-h-screen px-5 md:px-8 py-10 max-w-4xl mx-auto">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-bg-secondary w-48 border border-border-primary" />
        <div className="h-48 bg-bg-secondary border border-border-primary" />
      </div>
    </div>
  )

  if (!c) return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-text-primary mb-1">Record Not Found</h2>
        <p className="text-[13px] text-text-secondary mb-5">This complaint does not exist in the registry.</p>
        <button onClick={() => navigate('/admin/dashboard')} className="px-5 py-2 bg-text-primary text-white text-[12px] font-bold uppercase tracking-wider hover:bg-brand transition-colors">
          Back to Dashboard
        </button>
      </div>
    </div>
  )

  const fwd = c.forwarding || {}

  return (
    <div className="min-h-screen py-8 px-5 md:px-8 max-w-4xl mx-auto">

      {/* Back + Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-[12px] font-bold uppercase tracking-wider transition-colors mb-5 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Dashboard
        </button>
        <div className="flex items-start justify-between pb-5 border-b border-border-primary">
          <div>
            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">CASE FILE</p>
            <h1 className="text-[26px] font-extrabold text-text-primary font-mono tracking-wider">{c.complaint_id}</h1>
          </div>
          <div className="flex items-center gap-3">
            <select value={c.status} onChange={e => updateStatus(e.target.value)}
              className="bg-white border border-border-primary text-[11px] font-bold uppercase px-3 py-1.5 cursor-pointer hover:border-brand transition-colors outline-none">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {/* ═══════════════════════════════════════════════ */}
        {/* 1. COMPLAINT METADATA                          */}
        {/* ═══════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════ */}
        {/* 2. CITIZEN INFORMATION                         */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="border border-border-primary bg-white">
          <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary">
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">CITIZEN INFORMATION</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-primary">
            {[
              { icon: User, label: 'NAME', value: c.citizen_name || '—' },
              { icon: Phone, label: 'PHONE', value: c.citizen_phone || '—' },
              { icon: Mail, label: 'EMAIL', value: c.citizen_email || '—' },
              { icon: MapPin, label: 'LOCATION', value: c.location || '—' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 flex items-start gap-3">
                <item.icon size={14} className="text-text-tertiary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-0.5">{item.label}</p>
                  <p className="text-[13px] text-text-primary">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* 3. ORIGINAL COMPLAINT                          */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="border border-border-primary bg-white">
          <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary">
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">ORIGINAL COMPLAINT</h2>
          </div>
          <div className="p-5">
            <p className="text-[14px] text-text-primary leading-relaxed">{c.text}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 pt-3 border-t border-border-primary">
              {c.citizen_name && <span className="text-[11px] text-text-secondary"><strong className="text-text-primary">Filed by:</strong> {c.citizen_name}</span>}
              <span className="text-[11px] text-text-secondary"><strong className="text-text-primary">Location:</strong> {c.location}</span>
              <span className="text-[11px] text-text-secondary"><strong className="text-text-primary">Date:</strong> {new Date(c.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Description in English — only for non-English complaints */}
          {c.language && c.language !== 'English' && (
            <div className="px-5 pb-5 pt-0">
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

        {/* ═══════════════════════════════════════════════ */}
        {/* 4. AI ANALYSIS                                 */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="border border-border-primary bg-white">
          <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary flex items-center gap-2">
            <Cpu size={14} className="text-brand" />
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

        {/* ═══════════════════════════════════════════════ */}
        {/* 5. DISPATCH INFORMATION                        */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="border border-border-primary bg-white">
          <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send size={14} className="text-text-primary" />
              <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">DISPATCH INFORMATION</h2>
            </div>
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

        {/* ═══════════════════════════════════════════════ */}
        {/* 6. TIMELINE / WORKFLOW                         */}
        {/* ═══════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════ */}
        {/* 7. EVIDENCE                                    */}
        {/* ═══════════════════════════════════════════════ */}
        {c.image_url && (
          <section className="border border-border-primary bg-white">
            <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary flex items-center gap-2">
              <Image size={14} className="text-text-primary" />
              <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">EVIDENCE</h2>
            </div>
            <div className="p-5">
              <img src={resolveUploadUrl(c.image_url)} alt="Evidence" className="max-w-full border border-border-primary" />
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* 8. EMAIL DELIVERY LOG                          */}
        {/* ═══════════════════════════════════════════════ */}
        {c.email_logs?.length > 0 && (
          <section className="border border-border-primary bg-white">
            <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary flex items-center gap-2">
              <Mail size={14} className="text-text-primary" />
              <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">EMAIL DELIVERY LOG</h2>
            </div>
            <div className="divide-y divide-border-primary">
              {c.email_logs.map((log, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-text-secondary">{log.to}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-success-muted text-success uppercase">{log.status}</span>
                  </div>
                  <p className="text-[12px] font-bold text-text-primary mb-1">{log.subject}</p>
                  <div className="flex items-center gap-3 text-[10px] text-text-tertiary">
                    <span>ID: {log.message_id}</span>
                    <span>{new Date(log.sent_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* 9. ADMIN NOTES                                 */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="border border-border-primary bg-white">
          <div className="bg-bg-secondary px-5 py-3 border-b border-border-primary">
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest">ADMINISTRATIVE REMARKS</h2>
          </div>
          {c.admin_notes?.length > 0 ? (
            <div className="divide-y divide-border-primary">
              {c.admin_notes.map((n, i) => (
                <div key={i} className="p-4 flex items-start gap-3">
                  <div className="w-1 self-stretch bg-brand flex-shrink-0" />
                  <div>
                    <p className="text-[13px] text-text-primary mb-0.5">{n.note}</p>
                    <p className="text-[10px] text-text-tertiary uppercase tracking-widest">BY: {n.admin} | {n.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-[11px] text-text-tertiary">No admin notes recorded.</div>
          )}
          {/* Add note inline */}
          <div className="p-4 bg-bg-secondary border-t border-border-primary">
            <div className="flex items-center gap-3">
              <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Add administrative remark..."
                className="flex-1 px-3 py-1.5 text-[12px] border border-border-primary bg-white outline-none focus:border-brand" />
              <button onClick={addNote}
                className="px-4 py-1.5 bg-brand text-white text-[11px] font-bold uppercase tracking-wider hover:bg-brand-hover transition-colors">
                Save
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
