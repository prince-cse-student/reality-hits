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
      {/* Subtle glow behind card */}
      <div className="absolute -inset-3 rounded-[20px] opacity-60"
        style={{ background: 'radial-gradient(ellipse at center, rgba(79,140,255,0.06) 0%, transparent 70%)' }} />

      <div className="card p-5 space-y-3 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-accent-muted flex items-center justify-center">
              <Timer size={11} className="text-accent" />
            </div>
            <p className="text-[13px] font-semibold text-text-primary">Live Analysis</p>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all duration-300 ${
            step >= 4
              ? 'bg-success-muted text-success'
              : 'bg-white/[0.04] text-text-tertiary'
          }`}>
            {step >= 4 && <CheckCircle2 size={9} />}
            {step >= 4 ? 'Complete' : 'Analyzing...'}
          </span>
        </div>

        {/* Input */}
        <div className={`bg-bg-secondary rounded-xl p-3.5 border border-border-primary transition-all duration-400 ${step >= 1 ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
          <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Input</p>
          <p className="text-[12.5px] text-text-secondary leading-relaxed font-body">
            "Water leakage on main road near Sector 12, causing disruption for 3 days."
          </p>
        </div>

        {/* Results */}
        <div className={`grid grid-cols-2 gap-2 transition-all duration-400 ${step >= 2 ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
          <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
            <p className="text-[9px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">Category</p>
            <div className="flex items-center gap-1.5">
              <Droplets size={12} className="text-accent" />
              <span className="text-[12px] font-semibold text-text-primary">Water Supply</span>
            </div>
          </div>
          <div className="bg-bg-secondary rounded-xl p-3 border border-border-primary">
            <p className="text-[9px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">Priority</p>
            <div className="flex items-center gap-1.5">
              <ArrowUp size={12} className="text-danger" />
              <span className="text-[11px] font-semibold text-danger bg-danger-muted px-1.5 py-0.5 rounded">High</span>
            </div>
          </div>
        </div>

        {/* Department + Confidence */}
        <div className={`bg-bg-secondary rounded-xl p-3.5 border border-border-primary transition-all duration-400 ${step >= 3 ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <p className="text-[9px] font-semibold text-text-tertiary uppercase tracking-wider mb-0.5">Routed to</p>
              <div className="flex items-center gap-1.5">
                <Building2 size={12} className="text-text-secondary" />
                <span className="text-[12px] font-medium text-text-primary">Water Supply Dept.</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-semibold text-text-tertiary uppercase tracking-wider mb-0.5">Confidence</p>
              <span className="text-[14px] font-bold text-accent">98%</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-cyan transition-all duration-1000 progress-glow"
              style={{ width: step >= 3 ? '98%' : '0%' }} />
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between pt-0.5 transition-all duration-400 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[10px] text-text-tertiary font-body">Processing time</span>
          <span className="text-[10px] font-semibold text-text-secondary">1.2s</span>
        </div>
      </div>
    </div>
  )
}
