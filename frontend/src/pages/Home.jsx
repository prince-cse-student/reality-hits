import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Clock, Shield, Cpu, ChevronRight, Building2, Users, Timer, TrendingUp, Landmark, MapPin } from 'lucide-react'
import AIAnalysisShowcase from '../components/AIAnalysisShowcase'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-20 pb-24 px-5 md:px-8 overflow-hidden">
        {/* Hero ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(79,140,255,0.1) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="animate-fade-in-up">
              <h1 className="text-hero-sm md:text-hero text-text-primary mb-5">
                Smart Public
                <br />
                <span className="text-gradient">Grievance Resolution</span>
                <br />
                Platform
              </h1>

              <p className="text-text-secondary text-[15px] leading-relaxed max-w-md mb-8 font-body">
                File complaints instantly — no signup needed. Our AI classifies, routes, and tracks your grievance automatically.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-10">
                <Link to="/submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-btn text-[13px] font-semibold text-white bg-accent hover:bg-accent-hover shadow-button-accent hover:shadow-lg transition-base group">
                  File a Complaint
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link to="/track"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-btn text-[13px] font-semibold text-text-secondary border border-border-primary hover:border-border-hover hover:text-text-primary hover:bg-white/[0.03] transition-base">
                  Track Complaint
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-5 text-text-tertiary">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-success-muted flex items-center justify-center">
                    <Users size={10} className="text-success" />
                  </div>
                  <span className="text-[12px] font-medium">12,800+ citizens</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-accent-muted flex items-center justify-center">
                    <Timer size={10} className="text-accent" />
                  </div>
                  <span className="text-[12px] font-medium">~2 min response</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-cyan-muted flex items-center justify-center">
                    <Shield size={10} className="text-cyan" />
                  </div>
                  <span className="text-[12px] font-medium">94% satisfaction</span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="animate-fade-in-up-d2 hidden lg:block">
              <AIAnalysisShowcase />
            </div>
          </div>
        </div>
      </section>


      {/* Metrics */}
      <section className="py-16 px-5 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-up-d1">
            {[
              { value: '12,847', label: 'Complaints Filed', color: 'text-accent' },
              { value: '3,214', label: 'Pending Review', color: 'text-warning' },
              { value: '8,901', label: 'Resolved', color: 'text-success' },
              { value: '94%', label: 'Satisfaction', color: 'text-cyan' },
            ].map((s, i) => (
              <div key={i} className="card p-5 text-center transition-base hover:border-border-hover">
                <p className={`text-2xl md:text-[1.75rem] font-bold tracking-tight ${s.color} mb-0.5`}>{s.value}</p>
                <p className="text-[11px] text-text-tertiary font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-glow py-20 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <h2 className="text-section text-text-primary mb-3">
              How <span className="text-gradient">CitizenVoice</span> Works
            </h2>
            <p className="text-text-secondary text-[14px] max-w-lg mx-auto font-body">
              End-to-end complaint lifecycle management powered by machine learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Cpu, title: 'AI Classification',
                desc: 'Complaints are automatically categorized, prioritized, and routed to the correct department using NLP.',
                accent: 'from-accent/10 to-transparent', iconBg: 'bg-accent-muted text-accent',
              },
              {
                icon: BarChart3, title: 'Real-time Dashboard',
                desc: 'Track complaint status, department performance, and resolution metrics in a live analytics dashboard.',
                accent: 'from-cyan/10 to-transparent', iconBg: 'bg-cyan-muted text-cyan',
              },
              {
                icon: Shield, title: 'Transparent Resolution',
                desc: 'Full audit trail with status updates, department responses, and citizen satisfaction tracking.',
                accent: 'from-purple/10 to-transparent', iconBg: 'bg-purple-muted text-purple',
              },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="card p-6 transition-base hover:border-border-hover group relative overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}>
                  {/* Top gradient accent */}
                  <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${f.accent} pointer-events-none`} />
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.iconBg}`}>
                      <Icon size={18} />
                    </div>
                    <h3 className="text-[15px] font-semibold text-text-primary mb-2">{f.title}</h3>
                    <p className="text-[13px] text-text-secondary leading-relaxed font-body">{f.desc}</p>
                    <div className="mt-4 flex items-center gap-1 text-accent text-[12px] font-medium opacity-0 group-hover:opacity-100 transition-base">
                      Learn more <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="card p-10 md:p-14 text-center relative overflow-hidden animate-fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-cyan/[0.03] pointer-events-none" />
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-accent-muted flex items-center justify-center mx-auto mb-5">
                <Building2 size={20} className="text-accent" />
              </div>
              <h2 className="text-section text-text-primary mb-3">Ready to get started?</h2>
              <p className="text-text-secondary text-[14px] mb-8 max-w-md mx-auto font-body">
                File your first complaint and experience AI-powered grievance resolution in under 2 minutes.
              </p>
              <Link to="/submit"
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-btn text-[13px] font-semibold text-white bg-accent hover:bg-accent-hover shadow-button-accent transition-base group">
                File a Complaint
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-primary py-8 px-5 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-[10px]">⚖️</div>
            <span className="text-[13px] font-semibold text-text-secondary">CitizenVoice</span>
          </div>
          <p className="text-[12px] text-text-tertiary font-body">© 2025 CitizenVoice. Built for transparent governance.</p>
        </div>
      </footer>
    </>
  )
}
