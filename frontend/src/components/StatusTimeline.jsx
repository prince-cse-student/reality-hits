import { CheckCircle2, Clock, AlertCircle, Zap, UserCheck, FolderCheck } from 'lucide-react'

export default function StatusTimeline({ status }) {
  const steps = [
    { label: 'Submitted', icon: CheckCircle2 },
    { label: 'Under Review', icon: Clock },
    { label: 'Assigned', icon: UserCheck },
    { label: 'In Progress', icon: Zap },
    { label: 'Resolved', icon: FolderCheck },
    { label: 'Closed', icon: AlertCircle },
  ]
  const idx = steps.findIndex(s => s.label === status)
  const activeIdx = idx === -1 ? 0 : idx

  return (
    <div className="relative py-4">
      {/* Desktop layout */}
      <div className="hidden sm:flex items-start justify-between relative">
        <div className="absolute top-[1.15rem] left-[8%] right-[8%] h-[2px] bg-border-primary" />
        <div className="absolute top-[1.15rem] left-[8%] h-[2px] bg-brand transition-all duration-700"
          style={{ width: `${Math.max(0, (activeIdx / (steps.length - 1)) * 84)}%` }} />

        {steps.map((step, i) => {
          const done = i < activeIdx
          const active = i === activeIdx
          const I = step.icon
          return (
            <div key={step.label} className="flex flex-col items-center flex-1 relative z-10">
              <div className={`w-8 h-8 flex items-center justify-center mb-1.5 border-2 transition-base ${
                active ? 'bg-brand text-white border-brand shadow-brand'
                : done ? 'bg-success-muted text-success border-success'
                : 'bg-white text-text-tertiary border-border-primary'
              }`}>
                <I size={14} />
              </div>
              <p className={`text-[9px] font-bold text-center leading-tight uppercase tracking-wider ${
                active ? 'text-brand' : done ? 'text-success' : 'text-text-tertiary'
              }`}>{step.label}</p>
            </div>
          )
        })}
      </div>

      {/* Mobile layout — vertical */}
      <div className="sm:hidden space-y-3">
        {steps.map((step, i) => {
          const done = i < activeIdx
          const active = i === activeIdx
          const I = step.icon
          return (
            <div key={step.label} className="flex items-center gap-3">
              <div className={`w-7 h-7 flex items-center justify-center border-2 flex-shrink-0 ${
                active ? 'bg-brand text-white border-brand'
                : done ? 'bg-success-muted text-success border-success'
                : 'bg-white text-text-tertiary border-border-primary'
              }`}>
                <I size={12} />
              </div>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${
                active ? 'text-brand' : done ? 'text-success' : 'text-text-tertiary'
              }`}>{step.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
