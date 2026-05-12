import { FileText, Cpu, Building2, Send, Clock, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react'

const ICON_MAP = {
  'file-text': FileText,
  'cpu': Cpu,
  'building': Building2,
  'send': Send,
  'clock': Clock,
  'check-circle': CheckCircle,
  'refresh-cw': RefreshCw,
  'message-square': MessageSquare,
}

export default function ComplaintTimeline({ timeline = [] }) {
  if (!timeline.length) return null

  return (
    <div className="relative">
      <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-border-primary" />

      <div className="space-y-0">
        {timeline.map((event, i) => {
          const Icon = ICON_MAP[event.icon] || Clock
          const isCompleted = event.status === 'completed'
          const isActive = event.status === 'active'
          const isPending = event.status === 'pending'

          return (
            <div key={i} className="flex gap-3.5 relative">
              <div className={`w-[32px] h-[32px] flex items-center justify-center flex-shrink-0 z-10 border-2 transition-base ${
                isCompleted ? 'bg-success-muted border-success text-success'
                : isActive ? 'bg-brand-muted border-brand text-brand'
                : 'bg-bg-secondary border-border-primary text-text-tertiary'
              }`}>
                <Icon size={13} />
              </div>

              <div className={`flex-1 pb-5 ${isPending ? 'opacity-40' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-[13px] font-bold ${
                    isCompleted ? 'text-text-primary' : isActive ? 'text-brand' : 'text-text-tertiary'
                  }`}>{event.label}</p>
                  {isActive && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-muted text-brand uppercase tracking-widest">Active</span>
                  )}
                </div>
                <p className="text-[12px] text-text-secondary leading-relaxed">{event.description}</p>
                {event.timestamp && (
                  <p className="text-[10px] text-text-tertiary mt-1 font-mono">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
