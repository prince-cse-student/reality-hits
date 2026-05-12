export default function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-bg-secondary border border-border-primary" />
        ))}
      </div>
      <div className="h-64 bg-bg-secondary border border-border-primary" />
      <div className="h-48 bg-bg-secondary border border-border-primary" />
    </div>
  )
}
