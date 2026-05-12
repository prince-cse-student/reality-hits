import { Link } from 'react-router-dom'
import { 
  Bot, AlertTriangle, Languages, GitMerge, Search, BarChart, 
  Clock, BrainCircuit, ShieldCheck, Network, ArrowRight, Building2
} from 'lucide-react'

export default function Features() {
  const features = [
    { num: '01', icon: Bot, title: 'AI COMPLAINT\nCLASSIFICATION', desc: 'Automatically categorizes complaints using advanced NLP and AI analysis.' },
    { num: '02', icon: AlertTriangle, title: 'SMART PRIORITY\nDETECTION', desc: 'Detects complaint severity from Low to Critical instantly using machine learning.' },
    { num: '03', icon: Languages, title: 'MULTILINGUAL\nSUPPORT', desc: 'Understands Hindi, English, Hinglish, and mixed-language inputs seamlessly.' },
    { num: '04', icon: GitMerge, title: 'INTELLIGENT DEPARTMENT\nROUTING', desc: 'Routes complaints to the right department automatically based on context and rules.' },
    { num: '05', icon: Search, title: 'COMPLAINT TRACKING\nSYSTEM', desc: 'Citizens can track their complaint status in real-time at every step.' },
    { num: '06', icon: BarChart, title: 'ADMIN ANALYTICS\nDASHBOARD', desc: 'Advanced analytics for data-driven decisions and performance monitoring.' },
    { num: '07', icon: Clock, title: 'LIFECYCLE\nTIMELINE', desc: 'Shows transparent progress tracking from submission to final resolution.' },
    { num: '08', icon: BrainCircuit, title: 'AI REASONING\nENGINE', desc: 'Displays exactly why complaints were categorized and prioritized by AI.' },
    { num: '09', icon: ShieldCheck, title: 'SECURE CITIZEN\nDATA', desc: 'Protected grievance records with strict role-based admin access controls.' },
  ]

  return (
    <div className="min-h-screen">

      {/* ═══════════════════════════════════════════════ */}
      {/* HERO — matching reference image 2               */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-16 md:pt-20 pb-16 border-b border-border-primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end animate-fade-in-up">
          <div>
            <h1 className="text-hero-sm md:text-hero text-text-primary leading-[1.05] uppercase">
              PLATFORM<br />CAPABILITIES
            </h1>
          </div>
          <div>
            <p className="text-[15px] text-text-secondary leading-relaxed max-w-md">
              Comprehensive toolkit for modernizing municipal grievance redressal systems.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* FEATURES GRID — matching reference image 2      */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-primary border border-border-primary">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-7 md:p-8 group animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              {/* Number + Icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-text-primary flex items-center justify-center">
                  <span className="text-[12px] font-bold text-white">{f.num}</span>
                </div>
                <f.icon size={28} className="text-text-primary" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="text-[14px] font-extrabold text-text-primary uppercase tracking-wide leading-snug mb-4 whitespace-pre-line">
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-[13px] text-text-secondary leading-relaxed mb-6">
                {f.desc}
              </p>

              {/* Link */}
              <div className="flex items-center gap-1 text-[12px] font-bold text-text-primary uppercase tracking-wider group-hover:text-brand transition-colors cursor-pointer">
                LEARN MORE <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* CTA FOOTER — matching reference image 2         */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-20">
        <div className="border border-border-primary bg-bg-secondary p-8 md:p-12 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <Building2 size={32} className="text-text-primary flex-shrink-0" />
              <div>
                <h3 className="text-[18px] font-extrabold text-text-primary uppercase tracking-wide mb-1">READY TO GET STARTED?</h3>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  File your first complaint and experience<br className="hidden md:block" />
                  AI-powered grievance resolution in under 2 minutes.
                </p>
              </div>
            </div>
            <Link to="/submit"
              className="flex items-center gap-2 px-8 py-4 border-2 border-text-primary text-text-primary text-[13px] font-bold uppercase tracking-wider hover:bg-text-primary hover:text-white transition-colors flex-shrink-0">
              FILE A COMPLAINT <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
