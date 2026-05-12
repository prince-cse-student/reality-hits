export default function PriorityBadge({ priority }) {
  const styles = {
    High: 'text-danger bg-danger-muted border-danger',
    Medium: 'text-warning bg-warning-muted border-warning',
    Low: 'text-success bg-success-muted border-success',
    Critical: 'text-danger bg-danger-muted border-danger',
  }
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${styles[priority] || 'text-text-tertiary bg-bg-secondary border-border-primary'}`}>
      {priority}
    </span>
  )
}
