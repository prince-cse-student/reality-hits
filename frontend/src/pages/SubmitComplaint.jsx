import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileCheck, Copy, ArrowRight, AlertTriangle } from 'lucide-react'
import { complaintService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function SubmitComplaint({ showToast }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    citizen_name: '', citizen_email: '', citizen_phone: '',
    text: '', location: '', language: 'English', image: null,
  })
  const [error, setError] = useState('')

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 5 * 1024 * 1024) setFormData(prev => ({ ...prev, image: file }))
    else if (file) setError('File exceeds 5MB limit.')
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!formData.citizen_name.trim()) return setError('Full name is required.')
    if (!formData.location.trim()) return setError('Location is required.')
    if (formData.citizen_phone.replace(/[\s\-+]/g, '').length < 10) return setError('Valid mobile number (min 10 digits) is required.')
    if (formData.text.trim().length < 10) return setError('Complaint detail must be at least 10 characters.')

    setLoading(true)
    try {
      const d = new FormData()
      d.append('citizen_name', formData.citizen_name)
      d.append('citizen_phone', formData.citizen_phone)
      d.append('text', formData.text)
      d.append('location', formData.location)
      d.append('language', formData.language)
      // Auto-generate placeholder email from phone if not provided
      if (!formData.citizen_email) d.append('citizen_email', `${formData.citizen_phone.replace(/[\s\-+]/g, '')}@citizen.local`)
      else d.append('citizen_email', formData.citizen_email)
      if (formData.image) d.append('image', formData.image)
      setSuccess(await complaintService.submitComplaint(d))
      showToast?.('Complaint filed successfully.', 'success')
    } catch (err) {
      const m = err.response?.data?.detail || 'Submission failed. Please try again.'
      setError(m); showToast?.(m, 'error')
    } finally { setLoading(false) }
  }

  const copyId = () => {
    navigator.clipboard.writeText(success?.complaint_id || '')
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  // ─── Success State ───
  if (success) return (
    <div className="min-h-screen py-16 px-5 md:px-8 max-w-2xl mx-auto animate-fade-in-up">
      <div className="border border-border-primary bg-white">
        <div className="h-1 bg-brand w-full" />
        <div className="p-8 md:p-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">CONFIRMATION</p>
              <h1 className="text-[24px] font-extrabold text-text-primary uppercase tracking-tight">Complaint Filed Successfully</h1>
            </div>
            <FileCheck size={28} className="text-success flex-shrink-0" />
          </div>

          <div className="bg-bg-secondary border border-border-primary p-5 mb-8">
            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-2">TRACKING REFERENCE</p>
            <div className="flex items-center gap-3">
              <span className="text-[26px] font-extrabold text-text-primary font-mono tracking-wider">{success.complaint_id}</span>
              <button onClick={copyId} className="p-1.5 border border-border-primary hover:bg-brand-muted transition-colors text-text-secondary hover:text-brand" title="Copy ID">
                <Copy size={16} />
              </button>
              {copied && <span className="text-[11px] font-bold text-brand">Copied!</span>}
            </div>
            <p className="text-[12px] text-text-secondary mt-2">Save this reference to track your complaint status.</p>
          </div>

          <div className="grid grid-cols-2 gap-px bg-border-primary border border-border-primary mb-8">
            {[
              { label: 'DEPARTMENT', value: success.department },
              { label: 'CATEGORY', value: success.category },
              { label: 'PRIORITY', value: success.priority, color: success.priority === 'High' ? 'text-danger' : 'text-text-primary' },
              { label: 'SLA', value: success.response_sla || '48 Hours' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4">
                <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{item.label}</p>
                <p className={`text-[14px] font-bold uppercase ${item.color || 'text-text-primary'}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/track')}
              className="flex-1 py-3 px-6 bg-text-primary text-white text-[13px] font-bold uppercase tracking-wider hover:bg-brand transition-colors text-center">
              Track Complaint
            </button>
            <button onClick={() => { setSuccess(null); setFormData({ citizen_name: '', citizen_email: '', citizen_phone: '', text: '', location: '', language: 'English', image: null }) }}
              className="flex-1 py-3 px-6 border border-border-primary text-text-primary text-[13px] font-bold uppercase tracking-wider hover:bg-bg-secondary transition-colors text-center">
              File Another
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ─── Form ───
  return (
    <div className="min-h-screen py-12 px-5 md:px-8 max-w-2xl mx-auto">
      {/* Title */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-[28px] md:text-[36px] font-extrabold text-text-primary uppercase tracking-tight">
          FILE COMPLAINT
        </h1>
        <div className="w-12 h-[2px] bg-brand mt-4" />
      </div>

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center border border-border-primary bg-bg-secondary">
          <LoadingSpinner />
          <p className="text-[12px] text-text-secondary mt-2">Processing your complaint...</p>
        </div>
      )}

      {!loading && (
        <form onSubmit={handleSubmit} className="animate-fade-in-up-d1">
          {error && (
            <div className="flex items-start gap-3 p-4 border border-danger bg-danger-muted mb-6">
              <AlertTriangle size={16} className="text-danger flex-shrink-0 mt-0.5" />
              <p className="text-danger text-[13px]">{error}</p>
            </div>
          )}

          {/* Single card container */}
          <div className="border border-border-primary bg-white">
            <div className="p-6 md:p-8 space-y-5">

              {/* Row 1: Name | Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Name</label>
                  <input type="text" name="citizen_name" value={formData.citizen_name} onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-border-primary text-[14px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange}
                    placeholder="Street, Area, City"
                    className="w-full px-4 py-3 border border-border-primary text-[14px]" />
                </div>
              </div>

              {/* Row 2: No. | Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">No.</label>
                  <input type="tel" name="citizen_phone" value={formData.citizen_phone} onChange={handleChange}
                    placeholder="+91 ..."
                    className="w-full px-4 py-3 border border-border-primary text-[14px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Language</label>
                  <select name="language" value={formData.language} onChange={handleChange}
                    className="w-full px-4 py-3 border border-border-primary text-[14px] appearance-none">
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </div>
              </div>

              {/* Complaint Detail */}
              <div>
                <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Complaint Detail</label>
                <textarea name="text" value={formData.text} onChange={handleChange} rows={6}
                  placeholder="Describe the issue in detail..."
                  className="w-full px-4 py-3 border border-border-primary text-[14px] resize-none" />
              </div>

              {/* Evidence */}
              <div>
                <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Evidence</label>
                <label className="flex items-center justify-center w-full py-6 border border-dashed border-border-primary bg-bg-secondary cursor-pointer hover:border-brand transition-colors group">
                  <div className="flex items-center gap-3">
                    <Upload className="text-text-tertiary group-hover:text-brand transition-colors" size={20} />
                    <span className="text-[13px] text-text-secondary group-hover:text-text-primary transition-colors">
                      {formData.image ? formData.image.name : 'Upload photo evidence (JPG, PNG — Max 5MB)'}
                    </span>
                  </div>
                  <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" />
                </label>
                {formData.image && (
                  <div className="mt-2 p-2 bg-brand-muted border border-brand/20 flex items-center justify-between">
                    <span className="text-[12px] font-mono text-text-primary truncate">{formData.image.name}</span>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: null }))} className="text-[10px] font-bold text-danger uppercase">Remove</button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-text-primary text-white text-[14px] font-bold uppercase tracking-wider hover:bg-brand transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                SUBMIT <ArrowRight size={16} />
              </button>

            </div>
          </div>
        </form>
      )}
    </div>
  )
}
