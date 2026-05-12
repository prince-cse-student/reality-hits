import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Clock, BarChart3, Droplets, AlertTriangle, Building2 } from 'lucide-react'

export default function Home() {
  // Live analysis demo state
  const [demoState, setDemoState] = useState('idle')
  const [typedText, setTypedText] = useState('')
  const [confidence, setConfidence] = useState(0)

  const fullText = '"Water leakage on main road near Sector 12, causing disruption for 3 days."'

  useEffect(() => {
    let timeout
    let interval

    if (demoState === 'idle') {
      timeout = setTimeout(() => setDemoState('typing'), 800)
    } else if (demoState === 'typing') {
      let i = 0; setTypedText('')
      const typeChar = () => {
        if (i < fullText.length) { setTypedText(fullText.slice(0, i + 1)); i++; timeout = setTimeout(typeChar, 35) }
        else { timeout = setTimeout(() => setDemoState('analyzing'), 400) }
      }
      typeChar()
    } else if (demoState === 'analyzing') {
      timeout = setTimeout(() => {
        setDemoState('complete')
        let c = 0
        interval = setInterval(() => { c += 4; if (c >= 98) { setConfidence(98); clearInterval(interval) } else setConfidence(c) }, 15)
      }, 1200)
    } else if (demoState === 'complete') {
      timeout = setTimeout(() => { setDemoState('idle'); setTypedText(''); setConfidence(0) }, 6000)
    }
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [demoState])

  return (
    <div className="min-h-screen">

      {/* ═══════════════════════════════════════════════ */}
      {/* HERO SECTION — matching reference image 1      */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left: Editorial headline */}
          <div className="animate-fade-in-up">
            {/* <p className="text-[12px] font-bold text-brand uppercase tracking-[0.2em] mb-5">
              ENTERPRISE GOV-TECH
            </p> */}

            <h1 className="text-hero-sm md:text-hero text-text-primary leading-[1.05] mb-8">
              AI-POWERED<br />
              PUBLIC<br />
              GRIEVANCE<br />
              <span className="text-brand">INTELLIGENCE.</span>
            </h1>

            <div className="w-16 h-[2px] bg-text-primary mb-8" />

            <p className="text-[15px] text-text-secondary leading-relaxed max-w-md mb-10">
              Automating complaint classification, intelligent routing,
              tracking, and governance workflows using state-of-the-art
              Artificial Intelligence to empower modern smart cities.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/submit"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-text-primary text-white text-[13px] font-bold uppercase tracking-wider hover:bg-brand transition-colors">
                FILE COMPLAINT <ArrowRight size={16} />
              </Link>
              <Link to="/track"
                className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-text-primary text-text-primary text-[13px] font-bold uppercase tracking-wider hover:bg-bg-secondary transition-colors">
                TRACK COMPLAINT
              </Link>
            </div>
          </div>

          {/* Right: Live Analysis Panel */}
          <div className="animate-fade-in-up-d1">
            <div className="border border-border-primary bg-white shadow-card">
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary bg-bg-secondary">
                <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">LIVE ANALYSIS</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${demoState === 'complete' ? 'bg-success' : 'bg-brand animate-pulse'}`} />
                  <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                    {demoState === 'idle' ? 'STANDBY' : demoState === 'typing' ? 'RECEIVING...' : demoState === 'analyzing' ? 'ANALYZING...' : 'COMPLETE'}
                  </span>
                </div>
              </div>

              {/* Input */}
              <div className="px-6 py-5 border-b border-border-primary">
                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-2">INPUT</p>
                <p className="text-[14px] text-text-primary leading-relaxed min-h-[60px]">
                  {typedText}
                  {demoState === 'typing' && <span className="inline-block w-[2px] h-4 bg-brand ml-0.5 animate-pulse" />}
                </p>
              </div>

              {/* Analysis results */}
              <div className={`transition-opacity duration-300 ${demoState === 'complete' ? 'opacity-100' : 'opacity-30'}`}>
                <div className="grid grid-cols-2 border-b border-border-primary">
                  <div className="px-6 py-4 border-r border-border-primary">
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1.5">CATEGORY</p>
                    <div className="flex items-center gap-2">
                      <Droplets size={16} className="text-brand" />
                      <span className="text-[14px] font-bold text-text-primary uppercase">WATER SUPPLY</span>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1.5">PRIORITY</p>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-danger" />
                      <span className="text-[14px] font-bold text-text-primary uppercase">HIGH</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-b border-border-primary">
                  <div className="px-6 py-4 border-r border-border-primary">
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1.5">ROUTED TO</p>
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-text-secondary" />
                      <span className="text-[14px] font-bold text-text-primary uppercase">WATER SUPPLY DEPT.</span>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1.5">CONFIDENCE</p>
                    <p className="text-[28px] font-extrabold text-text-primary leading-none mb-2">{confidence}%</p>
                    <div className="w-full h-2 bg-bg-tertiary rounded-sm overflow-hidden">
                      <div className="h-full bg-brand rounded-sm transition-all duration-150" style={{ width: `${confidence}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-6 py-3">
                  <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">PROCESSING TIME</p>
                  <p className="text-[14px] font-bold text-text-primary">1.2s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* STATS ROW                                       */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="border-t border-b border-border-primary bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-primary">
            {[
              { icon: Users, value: '12,800+', label: 'CITIZENS SERVED' },
              { icon: Clock, value: '~2 MIN', label: 'AVG RESPONSE TIME' },
              { icon: BarChart3, value: '94%', label: 'SATISFACTION RATE' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 py-6 md:py-8 px-6 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <s.icon size={24} className="text-text-tertiary flex-shrink-0" />
                <div>
                  <p className="text-[22px] font-extrabold text-text-primary tracking-tight">{s.value}</p>
                  <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.15em]">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* AI IN ACTION — Demo terminal                    */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-5 md:px-8 py-24">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-section text-text-primary uppercase mb-3">SEE THE AI IN ACTION</h2>
          <p className="text-[14px] text-text-secondary">Real-time natural language processing and classification.</p>
        </div>

        <div className="animate-fade-in-up-d1">
          <div className="bg-bg-dark rounded-lg overflow-hidden shadow-elevated">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand/20 flex items-center justify-center">
                  <span className="text-brand text-[16px]">⚡</span>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-white uppercase tracking-wider">PROPRIETARY CLASSIFICATION ENGINE</p>
                  <p className="text-[11px] text-white/50">Secure complaint intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${demoState === 'complete' ? 'bg-success' : 'bg-brand'}`} />
                <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
                  {demoState === 'idle' ? 'STANDBY' : demoState === 'typing' ? 'RECEIVING...' : demoState === 'analyzing' ? 'PROCESSING...' : 'COMPLETE'}
                </span>
              </div>
            </div>

            {/* Terminal content */}
            <div className="px-6 py-5">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">CITIZEN INPUT</p>
              <div className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 min-h-[48px]">
                <p className="text-[14px] text-white/80 font-mono">
                  {typedText}
                  {demoState === 'typing' && <span className="inline-block w-[2px] h-4 bg-brand ml-0.5 animate-pulse" />}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* HOW IT WORKS — Workflow                         */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="border-t border-border-primary bg-bg-secondary py-24">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-section text-text-primary uppercase mb-3">INTELLIGENT WORKFLOW</h2>
            <p className="text-[14px] text-text-secondary">From citizen submission to final resolution, completely automated.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up-d1">
            {[
              { step: '01', title: 'CITIZEN FILES', desc: 'Submit complaint via digital form.' },
              { step: '02', title: 'AI ANALYSIS', desc: 'NLP engine classifies and prioritizes.' },
              { step: '03', title: 'SMART ROUTING', desc: 'Automatically dispatched to department.' },
              { step: '04', title: 'RESOLUTION', desc: 'Track progress until closure.' },
            ].map((w, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-brand-muted flex items-center justify-center">
                  <span className="text-[18px] font-extrabold text-brand">{w.step}</span>
                </div>
                <h4 className="text-[12px] font-bold text-text-primary uppercase tracking-wider mb-2">{w.title}</h4>
                <p className="text-[12px] text-text-secondary leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* CTA                                             */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="border-t border-border-primary py-20">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center animate-fade-in-up">
          <h2 className="text-section text-text-primary mb-4">READY TO GET STARTED?</h2>
          <p className="text-[14px] text-text-secondary mb-10 max-w-lg mx-auto">
            File your first complaint and experience AI-powered grievance resolution in under 2 minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-text-primary text-white text-[13px] font-bold uppercase tracking-wider hover:bg-brand transition-colors">
              FILE A COMPLAINT <ArrowRight size={16} />
            </Link>
            <Link to="/track"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border-primary text-text-primary text-[13px] font-bold uppercase tracking-wider hover:border-text-primary transition-colors">
              TRACK EXISTING
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
