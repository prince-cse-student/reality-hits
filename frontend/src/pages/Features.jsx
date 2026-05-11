import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Bot, AlertTriangle, Languages, GitMerge, Search, BarChart, 
  Clock, BrainCircuit, ShieldCheck, Network, ArrowRight, CheckCircle, Cpu, Zap, Lock, Server, FileText
} from 'lucide-react'

export default function Features() {
  const [demoState, setDemoState] = useState('idle') // idle, typing, analyzing, complete
  const [typedText, setTypedText] = useState('')
  const [confidence, setConfidence] = useState(0)

  const fullText = "Sector 12 me transformer blast hua hai, current leak ho raha hai."

  useEffect(() => {
    let timeout
    if (demoState === 'typing') {
      let i = 0
      setTypedText('')
      const typeChar = () => {
        if (i < fullText.length) {
          setTypedText(fullText.slice(0, i + 1))
          i++
          timeout = setTimeout(typeChar, 40)
        } else {
          timeout = setTimeout(() => setDemoState('analyzing'), 500)
        }
      }
      typeChar()
    } else if (demoState === 'analyzing') {
      timeout = setTimeout(() => {
        setDemoState('complete')
        let c = 0
        const fillBar = setInterval(() => {
          c += 5
          if (c >= 97) {
            setConfidence(97)
            clearInterval(fillBar)
          } else {
            setConfidence(c)
          }
        }, 20)
      }, 1500)
    } else if (demoState === 'complete') {
      timeout = setTimeout(() => {
        setDemoState('idle')
        setTypedText('')
        setConfidence(0)
      }, 5000)
    }

    return () => clearTimeout(timeout)
  }, [demoState])

  // Auto-start demo
  useEffect(() => {
    const t = setTimeout(() => setDemoState('typing'), 1000)
    return () => clearTimeout(t)
  }, [])

  const features = [
    { icon: Bot, title: "AI Complaint Classification", desc: "Automatically categorizes complaints using advanced NLP and AI analysis." },
    { icon: AlertTriangle, title: "Smart Priority Detection", desc: "Detects complaint severity from Low to Critical instantly." },
    { icon: Languages, title: "Multilingual Support", desc: "Understands Hindi, English, Hinglish, and mixed-language inputs seamlessly." },
    { icon: GitMerge, title: "Intelligent Department Routing", desc: "Routes complaints to the correct municipal authorities automatically." },
    { icon: Search, title: "Complaint Tracking System", desc: "Track resolution status using complaint ID, phone number, or email." },
    { icon: BarChart, title: "Admin Analytics Dashboard", desc: "Real-time analytics, monitoring, and comprehensive workflow management." },
    { icon: Clock, title: "Complaint Lifecycle Timeline", desc: "Shows transparent progress tracking from submission to final resolution." },
    { icon: BrainCircuit, title: "AI Reasoning Engine", desc: "Displays exactly why complaints were categorized and prioritized by AI." },
    { icon: ShieldCheck, title: "Secure Citizen Data", desc: "Protected grievance records with strict role-based admin access controls." },
    { icon: Network, title: "Scalable Governance Workflow", desc: "Designed robustly for large-scale municipal and public grievance management." }
  ]

  const workflowSteps = [
    { title: "Citizen Complaint", icon: FileText },
    { title: "AI Analysis", icon: BrainCircuit },
    { title: "Priority Detection", icon: AlertTriangle },
    { title: "Department Routing", icon: GitMerge },
    { title: "Admin Review", icon: ShieldCheck },
    { title: "Resolution Tracking", icon: CheckCircle }
  ]

  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative px-5 md:px-8 mb-32 text-center max-w-5xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(79,140,255,0.15) 0%, transparent 80%)' }} />
        
        <div className="relative animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Zap size={14} className="text-accent" />
            <span className="text-[12px] font-semibold text-accent uppercase tracking-wider">Enterprise Gov-Tech</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary mb-6 leading-tight">
            AI-Powered Public
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-cyan to-purple animate-gradient-x">
              Grievance Intelligence
            </span>
          </h1>
          
          <p className="text-[15px] md:text-[17px] text-text-secondary leading-relaxed max-w-2xl mx-auto mb-10 font-body">
            Automating complaint classification, intelligent routing, tracking, and governance workflows using state-of-the-art Artificial Intelligence to empower modern smart cities.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/submit" className="px-7 py-3 rounded-btn text-[14px] font-bold text-white bg-accent hover:bg-accent-hover shadow-button-accent hover:shadow-[0_0_25px_rgba(79,140,255,0.4)] transition-all">
              File Complaint
            </Link>
            <Link to="/track" className="px-7 py-3 rounded-btn text-[14px] font-bold text-text-primary border border-border-primary hover:border-border-hover hover:bg-white/[0.03] transition-all">
              Track Complaint
            </Link>
          </div>
        </div>
      </section>

      {/* 4. LIVE AI DEMO SHOWCASE (Moved up for impact) */}
      <section className="px-5 md:px-8 mb-32 max-w-4xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-text-primary mb-3">See the AI in Action</h2>
          <p className="text-text-secondary text-[14px]">Real-time natural language processing and classification.</p>
        </div>

        <div className="card p-1 relative overflow-hidden animate-fade-in-up-d1 bg-gradient-to-b from-white/[0.05] to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-purple/10 to-transparent opacity-50 blur-xl pointer-events-none" />
          
          <div className="bg-bg-primary rounded-[20px] p-6 md:p-10 border border-border-primary relative z-10">
            <div className="flex items-center justify-between mb-8 border-b border-border-primary pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center">
                  <Cpu className="text-accent" size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-text-primary">LM Studio Engine</h3>
                  <p className="text-[12px] text-text-tertiary">Local LLM Processing</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  {(demoState === 'typing' || demoState === 'analyzing') && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${demoState === 'complete' ? 'bg-success' : 'bg-accent'}`}></span>
                </span>
                <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider">
                  {demoState === 'idle' ? 'STANDBY' : demoState === 'typing' ? 'RECEIVING INPUT...' : demoState === 'analyzing' ? 'ANALYZING...' : 'ANALYSIS COMPLETE'}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Input Area */}
              <div>
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">Citizen Input</p>
                <div className="w-full bg-bg-input border border-border-primary rounded-xl p-4 min-h-[80px]">
                  <p className="text-[14px] text-text-primary font-body">
                    {typedText}
                    {demoState === 'typing' && <span className="inline-block w-1.5 h-4 bg-accent ml-1 animate-pulse" />}
                  </p>
                </div>
              </div>

              {/* Output Area */}
              <div className={`transition-all duration-700 ease-out ${demoState === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">AI Extraction</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-bg-secondary rounded-xl p-4 border border-border-primary hover:border-accent/30 transition-base">
                    <p className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Department</p>
                    <p className="text-[14px] font-bold text-text-primary">Electricity</p>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-4 border border-border-primary hover:border-danger/30 transition-base">
                    <p className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Priority</p>
                    <p className="text-[14px] font-bold text-danger flex items-center gap-1.5"><AlertTriangle size={14}/> Critical</p>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-4 border border-border-primary hover:border-purple/30 transition-base">
                    <p className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Escalation</p>
                    <p className="text-[14px] font-bold text-purple">TRUE</p>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-4 border border-border-primary hover:border-cyan/30 transition-base">
                    <p className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Confidence</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-bold text-cyan">{confidence}%</p>
                      <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full bg-cyan" style={{ width: `${confidence}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES GRID */}
      <section className="px-5 md:px-8 mb-32 max-w-6xl mx-auto">
        <div className="text-center mb-14 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-text-primary mb-3">Platform Capabilities</h2>
          <p className="text-text-secondary text-[14px] max-w-2xl mx-auto">Comprehensive toolkit for modernizing municipal grievance redressal systems.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="card p-6 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-xl bg-bg-input border border-border-primary flex items-center justify-center mb-5 group-hover:border-accent/30 group-hover:bg-accent/[0.02] transition-colors relative z-10">
                <f.icon className="text-text-secondary group-hover:text-accent transition-colors" size={22} />
              </div>
              <h3 className="text-[16px] font-bold text-text-primary mb-2 relative z-10">{f.title}</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed font-body relative z-10">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW AI WORKS SECTION (Workflow Timeline) */}
      <section className="px-5 md:px-8 mb-32 max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-text-primary mb-3">Intelligent Workflow</h2>
          <p className="text-text-secondary text-[14px]">From citizen submission to final resolution, completely automated.</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-border-primary -translate-y-1/2 overflow-hidden z-0">
            <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent animate-[pulse_3s_ease-in-out_infinite]" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-0 relative z-10">
            {workflowSteps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-14 h-14 rounded-full bg-bg-secondary border-2 border-border-primary flex items-center justify-center mb-4 relative group hover:border-accent hover:shadow-[0_0_20px_rgba(79,140,255,0.3)] transition-all bg-bg-primary">
                  <s.icon size={20} className="text-text-tertiary group-hover:text-accent transition-colors" />
                  {/* Pulse effect for first step */}
                  {i === 0 && <span className="absolute inset-0 rounded-full border border-accent animate-ping opacity-50"></span>}
                </div>
                <h4 className="text-[12px] font-bold text-text-primary w-24 leading-snug">{s.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECURITY & SCALABILITY SECTION */}
      <section className="px-5 md:px-8 mb-32 max-w-6xl mx-auto">
        <div className="card p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-bg-secondary to-bg-primary border border-border-primary/50 animate-fade-in-up">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-purple/10 blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-4">Enterprise-Grade Infrastructure</h2>
              <p className="text-[14px] text-text-secondary leading-relaxed font-body mb-6">
                Built to handle city-scale traffic securely and reliably. Combining the power of NoSQL databases with robust AI orchestration.
              </p>
              <ul className="space-y-3">
                {[
                  { text: "Secure Data Handling with encrypted transmission", icon: Lock },
                  { text: "Scalable MongoDB document architecture", icon: Server },
                  { text: "Role-Based Admin Access & strict JWT guards", icon: ShieldCheck },
                  { text: "Real-time logging and audit trails", icon: Clock }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13px] text-text-primary font-medium">
                    <div className="w-6 h-6 rounded-md bg-white/[0.03] flex items-center justify-center border border-border-primary">
                      <item.icon size={12} className="text-purple" />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              {/* Abstract code/terminal graphic */}
              <div className="bg-[#0A0D14] rounded-2xl border border-border-primary p-5 shadow-2xl relative overflow-hidden">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-danger/80"></div>
                  <div className="w-3 h-3 rounded-full bg-warning/80"></div>
                  <div className="w-3 h-3 rounded-full bg-success/80"></div>
                </div>
                <div className="space-y-2 font-mono text-[11px] text-text-tertiary">
                  <p><span className="text-purple">async def</span> <span className="text-accent">analyze_complaint</span>(text: str):</p>
                  <p className="pl-4">engine = AI.connect()</p>
                  <p className="pl-4">res = <span className="text-purple">await</span> engine.extract_entities(text)</p>
                  <p className="pl-4 text-success"># 100% Secure & Isolated</p>
                  <p className="pl-4">db.complaints.insert_one(res.dict())</p>
                  <p className="pl-4"><span className="text-purple">return</span> res.route_to_department()</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="px-5 md:px-8 max-w-4xl mx-auto text-center animate-fade-in-up">
        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">
          Transform Public Grievance Management
        </h2>
        <p className="text-[15px] text-text-secondary mb-10 font-body max-w-2xl mx-auto">
          Experience the future of civic technology today. Fast, transparent, and completely automated.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/submit" className="px-8 py-3.5 rounded-btn text-[14px] font-bold text-white bg-accent hover:bg-accent-hover shadow-button-accent transition-all flex items-center gap-2">
            File a Complaint <ArrowRight size={16} />
          </Link>
          <Link to="/track" className="px-8 py-3.5 rounded-btn text-[14px] font-bold text-text-primary border border-border-primary hover:border-border-hover hover:bg-white/[0.03] transition-all">
            Track Existing
          </Link>
          <Link to="/admin/login" className="px-8 py-3.5 rounded-btn text-[14px] font-bold text-purple border border-purple/20 hover:bg-purple/10 transition-all ml-0 md:ml-4 flex items-center gap-2">
            <ShieldCheck size={16} /> Admin Access
          </Link>
        </div>
      </section>
    </div>
  )
}
