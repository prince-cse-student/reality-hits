export default function SkeletonLoader() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="card p-5">
          <div className="space-y-2.5">
            <div className="h-3.5 bg-white/[0.04] rounded w-3/4 animate-pulse" />
            <div className="h-3.5 bg-white/[0.04] rounded w-1/2 animate-pulse" />
            <div className="h-3.5 bg-white/[0.04] rounded w-2/3 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
