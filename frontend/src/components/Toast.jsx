import { AlertCircle, CheckCircle, InfoIcon, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  const config = {
    success: { bg: 'bg-success-muted border-success/20', text: 'text-success', icon: CheckCircle },
    error: { bg: 'bg-danger-muted border-danger/20', text: 'text-danger', icon: AlertCircle },
    info: { bg: 'bg-accent-muted border-accent/20', text: 'text-accent', icon: InfoIcon },
    warning: { bg: 'bg-warning-muted border-warning/20', text: 'text-warning', icon: AlertCircle },
  }
  const { bg, text, icon: IconComp } = config[type] || config.success

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
      <div className={`${bg} border rounded-card p-3.5 flex items-start gap-2.5 max-w-xs shadow-elevated`}>
        <IconComp size={16} className={`flex-shrink-0 mt-0.5 ${text}`} />
        <p className="text-[13px] font-medium text-text-primary flex-1">{message}</p>
        <button onClick={onClose} className="text-text-tertiary hover:text-text-secondary transition-base flex-shrink-0">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
