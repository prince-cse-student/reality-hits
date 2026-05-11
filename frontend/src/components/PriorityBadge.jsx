import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'

export default function PriorityBadge({ priority }) {
  const config = {
    High: { bg: 'bg-danger-muted', text: 'text-danger', icon: AlertCircle },
    Medium: { bg: 'bg-warning-muted', text: 'text-warning', icon: Clock },
    Low: { bg: 'bg-success-muted', text: 'text-success', icon: CheckCircle2 },
  }
  const { bg, text, icon: Icon } = config[priority] || config['Medium']

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${bg} ${text} text-[11px] font-semibold`}>
      <Icon size={11} />
      {priority}
    </span>
  )
}
