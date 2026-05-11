import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Send, AlertCircle, CheckCircle, Copy, FileText } from 'lucide-react'
import { complaintService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function SubmitComplaint({ showToast }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    citizen_name: '', citizen_email: '', citizen_phone: '',
    title: '', text: '', location: '', language: 'English', image: null,
  })
  const [error, setError] = useState('')
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 5 * 1024 * 1024) setFormData(prev => ({ ...prev, image: file }))
    else if (file) setError('Image must be under 5MB')
  }
  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!formData.citizen_name.trim()) return setError('Full name is required')
    if (!/^[\w.+-]+@[\w-]+\.[\w-.]+$/.test(formData.citizen_email)) return setError('Valid email is required')
    if (formData.citizen_phone.replace(/[\s\-+]/g, '').length < 10) return setError('Valid mobile (min 10 digits)')
    if (formData.text.trim().length < 10) return setError('Complaint must be at least 10 characters')
    if (!formData.location.trim()) return setError('Location is required')
    setLoading(true)
    try {
      const d = new FormData()
      Object.entries(formData).forEach(([k, v]) => { if (v && k !== 'image') d.append(k, v) })
      if (formData.image) d.append('image', formData.image)
      setSuccess(await complaintService.submitComplaint(d))
      showToast?.('Complaint submitted!', 'success')
    } catch (err) { const m = err.response?.data?.detail || 'Failed'; setError(m); showToast?.(m, 'error') }
    finally { setLoading(false) }
  }
  const copyId = () => { navigator.clipboard.writeText(success?.complaint_id || ''); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16">
      <div className="card p-8 max-w-lg w-full text-center animate-fade-in-up">
        <div className="w-16 h-16 mx-auto rounded-full bg-success-muted flex items-center justify-center mb-5"><CheckCircle size={32} className="text-success" /></div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Complaint Submitted!</h2>
        <p className="text-[13px] text-text-secondary mb-6 font-body">Your complaint is being processed by our AI system.</p>
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 mb-4">
          <p className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Your Complaint ID</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-2xl font-bold font-mono text-accent">{success.complaint_id}</p>
            <button onClick={copyId} className="p-1.5 rounded text-text-tertiary hover:text-accent transition-base"><Copy size={16} /></button>
          </div>
          {copied && <p className="text-[10px] text-success mt-1">Copied!</p>}
          <p className="text-[11px] text-text-tertiary mt-2">Save this ID to track your complaint</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary text-left">
            <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Category</p>
            <p className="text-[13px] font-semibold text-accent">{success.category}</p>
          </div>
          <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary text-left">
            <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Priority</p>
            <p className={`text-[13px] font-semibold ${success.priority === 'High' ? 'text-danger' : success.priority === 'Medium' ? 'text-warning' : 'text-success'}`}>{success.priority}</p>
          </div>
          <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary text-left">
            <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Department</p>
            <p className="text-[12px] text-text-primary font-medium">{success.department}</p>
          </div>
          <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary text-left">
            <p className="text-[9px] text-text-tertiary uppercase tracking-wider mb-0.5">Est. Response</p>
            <p className="text-[12px] text-warning font-semibold">{success.response_sla || '48 hours'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/track')} className="flex-1 py-2.5 rounded-btn text-[13px] font-semibold text-white bg-accent hover:bg-accent-hover shadow-button-accent transition-base flex items-center justify-center gap-1.5"><FileText size={14} />Track</button>
          <button onClick={() => { setSuccess(null); setFormData({ citizen_name: '', citizen_email: '', citizen_phone: '', title: '', text: '', location: '', language: 'English', image: null }) }} className="flex-1 py-2.5 rounded-btn text-[13px] font-semibold text-text-secondary border border-border-primary hover:border-border-hover transition-base">File Another</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-10 px-5 md:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-section text-text-primary mb-1">File a Complaint</h1>
          {/* <p className="text-[14px] text-text-secondary font-body">No signup needed. AI will classify and route your complaint.</p> */}
        </div>
        {loading && <LoadingSpinner />}
        {!loading && (
          <form onSubmit={handleSubmit} className="card overflow-hidden animate-fade-in-up-d1">
            <div className="p-6 space-y-5">
              {error && <div className="flex items-start gap-2.5 p-3.5 bg-danger-muted rounded-xl border border-danger/10"><AlertCircle size={15} className="text-danger flex-shrink-0 mt-0.5" /><p className="text-danger text-[13px]">{error}</p></div>}
              <div className="border border-border-primary rounded-xl p-4 bg-bg-secondary/50">
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-3">Your Information</p>
                <div className="space-y-3">
                  <div><label className="block text-[12px] font-semibold text-text-tertiary mb-1.5">Full Name *</label><input type="text" name="citizen_name" value={formData.citizen_name} onChange={handleChange} placeholder="Your full name" className="w-full px-3.5 py-2.5 rounded-xl text-[13px]" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><label className="block text-[12px] font-semibold text-text-tertiary mb-1.5">Email *</label><input type="email" name="citizen_email" value={formData.citizen_email} onChange={handleChange} placeholder="you@email.com" className="w-full px-3.5 py-2.5 rounded-xl text-[13px]" /></div>
                    <div><label className="block text-[12px] font-semibold text-text-tertiary mb-1.5">Mobile *</label><input type="tel" name="citizen_phone" value={formData.citizen_phone} onChange={handleChange} placeholder="+91 98765 43210" className="w-full px-3.5 py-2.5 rounded-xl text-[13px]" /></div>
                  </div>
                </div>
              </div>
              <div><label className="block text-[12px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">Complaint Details *</label><textarea name="text" value={formData.text} onChange={handleChange} placeholder="Describe your complaint in detail..." className="w-full px-3.5 py-3 rounded-xl text-[13px] resize-none font-body" rows={5} /><p className="text-[11px] text-text-tertiary mt-1">{formData.text.length} chars</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">Location *</label><input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Sector 5, Mumbai" className="w-full px-3.5 py-2.5 rounded-xl text-[13px]" /></div>
                <div><label className="block text-[12px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">Language</label><select name="language" value={formData.language} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl text-[13px]"><option>English</option><option>Hindi</option></select></div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">Evidence (Optional)</label>
                <label className="flex items-center justify-center w-full px-4 py-7 border border-dashed border-border-primary rounded-card cursor-pointer hover:border-accent/30 transition-base"><div className="text-center"><Upload className="mx-auto text-text-tertiary mb-1.5" size={18} /><p className="text-[12px] font-medium text-text-secondary">Click to upload</p><p className="text-[10px] text-text-tertiary mt-0.5">PNG, JPG up to 5MB</p></div><input type="file" onChange={handleImageChange} accept="image/*" className="hidden" /></label>
                {formData.image && <p className="text-[12px] text-success mt-1.5">✓ {formData.image.name}</p>}
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-btn text-[13px] font-semibold text-white bg-accent hover:bg-accent-hover shadow-button-accent transition-base disabled:opacity-50 flex items-center justify-center gap-2"><Send size={14} />Submit Complaint</button>
              {/* <p className="text-[11px] text-text-tertiary text-center">No account needed. You'll get a tracking ID.</p> */}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
