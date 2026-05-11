export default function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const styles = {
    blue:   { text: 'text-accent',  iconBg: 'bg-accent-muted text-accent',  border: 'hover:border-accent/20' },
    cyan:   { text: 'text-cyan',    iconBg: 'bg-cyan-muted text-cyan',      border: 'hover:border-cyan/20' },
    gold:   { text: 'text-warning', iconBg: 'bg-warning-muted text-warning', border: 'hover:border-warning/20' },
    green:  { text: 'text-success', iconBg: 'bg-success-muted text-success', border: 'hover:border-success/20' },
    red:    { text: 'text-danger',  iconBg: 'bg-danger-muted text-danger',   border: 'hover:border-danger/20' },
    purple: { text: 'text-purple',  iconBg: 'bg-purple-muted text-purple',   border: 'hover:border-purple/20' },
  }
  const s = styles[color] || styles.blue

  return (
    <div className={`card p-5 transition-base ${s.border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] font-medium text-text-tertiary mb-1">{label}</p>
          <p className={`text-2xl font-bold tracking-tight ${s.text}`}>{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${s.iconBg}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}
