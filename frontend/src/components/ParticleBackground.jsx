export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {/* Hero ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(79,140,255,0.07) 0%, transparent 70%)' }} />
      {/* Left accent */}
      <div className="absolute top-[30%] left-0 w-[400px] h-[400px]"
        style={{ background: 'radial-gradient(circle at 0% 50%, rgba(124,58,237,0.04) 0%, transparent 70%)' }} />
      {/* Right accent */}
      <div className="absolute top-[50%] right-0 w-[400px] h-[400px]"
        style={{ background: 'radial-gradient(circle at 100% 50%, rgba(34,211,238,0.03) 0%, transparent 70%)' }} />
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[300px]"
        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(11,16,32,0.5) 100%)' }} />
    </div>
  )
}
