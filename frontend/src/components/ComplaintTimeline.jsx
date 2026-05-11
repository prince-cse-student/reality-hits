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
            <div key={i} className="flex gap-3.5 relative group">
              <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-base ${
                isCompleted ? 'bg-success-muted border-success/30 text-success'
                : isActive ? 'bg-accent-muted border-accent/30 text-accent animate-pulse-slow'
                : 'bg-bg-card border-border-primary text-text-tertiary'
              }`}>
                <Icon size={13} />
              </div>

              <div className={`flex-1 pb-5 ${isPending ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-[13px] font-semibold ${
                    isCompleted ? 'text-text-primary' : isActive ? 'text-accent' : 'text-text-tertiary'
                  }`}>{event.label}</p>
                  {isActive && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-accent-muted text-accent">In Progress</span>
                  )}
                </div>
                <p className="text-[11px] text-text-secondary font-body leading-relaxed">{event.description}</p>
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
