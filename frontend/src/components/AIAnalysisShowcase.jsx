import { useState, useEffect } from 'react'
import { CheckCircle2, Droplets, ArrowUp, Building2, Timer } from 'lucide-react'

export default function AIAnalysisShowcase() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1000),
      setTimeout(() => setStep(3), 1500),
      setTimeout(() => setStep(4), 2000),
    ]
    return () => t.forEach(clearTimeout)
  }, [])

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0 relative">
      <div className="border border-border-primary bg-white shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-primary bg-bg-secondary">
          <div className="flex items-center gap-2">
            <Timer size={14} className="text-brand" />
            <p className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Live Analysis</p>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
            step >= 4 ? 'bg-success-muted text-success' : 'text-text-tertiary'
          }`}>
            {step >= 4 && <CheckCircle2 size={9} />}
            {step >= 4 ? 'Complete' : 'Analyzing...'}
          </span>
        </div>

        {/* Input */}
        <div className={`px-5 py-4 border-b border-border-primary transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1.5">Input</p>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            "Water leakage on main road near Sector 12, causing disruption for 3 days."
          </p>
        </div>

        {/* Results */}
        <div className={`grid grid-cols-2 border-b border-border-primary transition-opacity duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-4 border-r border-border-primary">
            <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Category</p>
            <div className="flex items-center gap-1.5">
              <Droplets size={12} className="text-brand" />
              <span className="text-[12px] font-bold text-text-primary uppercase">Water Supply</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Priority</p>
            <div className="flex items-center gap-1.5">
              <ArrowUp size={12} className="text-danger" />
              <span className="text-[10px] font-bold text-danger bg-danger-muted px-1.5 py-0.5 uppercase">High</span>
            </div>
          </div>
        </div>

        {/* Department + Confidence */}
        <div className={`px-5 py-4 border-b border-border-primary transition-opacity duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-0.5">Routed to</p>
              <div className="flex items-center gap-1.5">
                <Building2 size={12} className="text-text-secondary" />
                <span className="text-[12px] font-bold text-text-primary">Water Supply Dept.</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-0.5">Confidence</p>
              <span className="text-[18px] font-extrabold text-text-primary">98%</span>
            </div>
          </div>
          <div className="w-full h-2 bg-bg-tertiary overflow-hidden">
            <div className="h-full bg-brand transition-all duration-1000"
              style={{ width: step >= 3 ? '98%' : '0%' }} />
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between px-5 py-3 transition-opacity duration-300 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Processing time</span>
          <span className="text-[12px] font-bold text-text-primary">1.2s</span>
        </div>
      </div>
    </div>
  )
}
