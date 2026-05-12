export default function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colors = {
    blue: 'text-brand',
    gold: 'text-warning',
    red: 'text-danger',
    green: 'text-success',
  }
  return (
    <div className="border border-border-primary bg-white p-5 flex items-center gap-3">
      <Icon size={20} className={colors[color] || 'text-brand'} />
      <div>
        <p className="text-[22px] font-extrabold text-text-primary font-mono">{value}</p>
        <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">{label}</p>
      </div>
    </div>
  )
}
