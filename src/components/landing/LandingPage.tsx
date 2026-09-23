import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  AlertOctagon, 
  Compass, 
  CheckCircle2, 
  FileCheck2, 
  Clock, 
  PlayCircle,
  TrendingUp,
  Award,
  Users,
  Building,
  GraduationCap,
  ChevronRight,
  Layers
} from 'lucide-react';
import { TrafficLightBadge } from '../common/TrafficLightBadge';

export const LandingPage: React.FC = () => {
  const { setActiveTab, triggerDemoJudgeFlow } = useApp();

  return (
    <div className="min-h-screen bg-cyber-grid relative overflow-hidden">
      
      {/* Background Cyber Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-gradient-to-b from-purple-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 text-center">
        
        {/* Hackathon Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium mb-6 shadow-sm shadow-purple-500/10">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>MUSA CODEX 2026 • Problem Statement CX0705 — The Scholarship Maze</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display max-w-4xl mx-auto leading-[1.1] mb-6">
          Find Scholarships. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
            Apply Safely.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          AI-powered scholarship matching that checks eligibility and mutual-exclusivity rules before you apply.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <button
            id="hero-btn-check-scholarships"
            onClick={() => setActiveTab('profile')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center space-x-2 border border-white/20 active:scale-95 cursor-pointer"
          >
            <span>Check My Scholarships</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-btn-try-demo"
            onClick={triggerDemoJudgeFlow}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-purple-200 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 hover:border-purple-400 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Try 1-Click Judge Demo (Aarav Sharma)</span>
          </button>
        </div>

        {/* Prominent Core Value Statement */}
        <div className="max-w-3xl mx-auto mb-16 p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 glow-purple relative">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-semibold mb-2">
            The Central Breakthrough
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white font-display leading-snug">
            “Don’t just find eligible scholarships. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
              Find scholarships that work together.”
            </span>
          </p>
        </div>

        {/* Visual Workflow Preview Mockup */}
        <div className="max-w-5xl mx-auto rounded-2xl glass-panel border border-purple-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 text-left">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-slate-400 ml-2 font-mono">scholarmatch-ai Conflict Prevention Pipeline</span>
            </div>
            <span className="text-[11px] text-purple-300 font-mono bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
              LIVE ARCHITECTURE
            </span>
          </div>

          {/* Interactive Pipeline Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative text-left">
            
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold">STAGE 01</span>
                <h4 className="text-sm font-semibold text-white mt-1">Student Profile</h4>
                <p className="text-xs text-slate-400 mt-1">State, Course, Family Income & Category.</p>
              </div>
              <div className="mt-3 text-[11px] text-purple-300 font-mono bg-purple-950/40 p-1.5 rounded border border-purple-500/20">
                Aarav Sharma • 78% • ₹1.8L
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">STAGE 02</span>
                <h4 className="text-sm font-semibold text-white mt-1">Eligibility Check</h4>
                <p className="text-xs text-slate-400 mt-1">Income & academic threshold evaluation.</p>
              </div>
              <div className="mt-3 text-[11px] text-emerald-300 font-mono bg-emerald-950/40 p-1.5 rounded border border-emerald-500/20 flex items-center justify-between">
                <span>12 Matches</span>
                <span className="text-[10px] bg-emerald-500/30 px-1 rounded">PASS</span>
              </div>
            </div>

            {/* Step 3 - Highlighted Conflict Engine */}
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/50 flex flex-col justify-between shadow-lg shadow-purple-900/20">
              <div>
                <span className="text-[10px] font-mono text-rose-400 font-bold">STAGE 03 (CORE)</span>
                <h4 className="text-sm font-semibold text-white mt-1">Conflict Engine</h4>
                <p className="text-xs text-slate-300 mt-1">Deduplication & mutual exclusivity check.</p>
              </div>
              <div className="mt-3 text-[11px] text-rose-300 font-mono bg-rose-950/50 p-1.5 rounded border border-rose-500/30 flex items-center space-x-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">2 Conflicts Caught</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">STAGE 04</span>
                <h4 className="text-sm font-semibold text-white mt-1">Safe Route</h4>
                <p className="text-xs text-slate-400 mt-1">Maximal aid with zero conflict risk.</p>
              </div>
              <div className="mt-3 text-[11px] text-cyan-300 font-mono bg-cyan-950/40 p-1.5 rounded border border-cyan-500/20">
                ₹1,30,000 Safe Aid
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">STAGE 05</span>
                <h4 className="text-sm font-semibold text-white mt-1">Application</h4>
                <p className="text-xs text-slate-400 mt-1">Direct official links & deadline reminders.</p>
              </div>
              <div className="mt-3 text-[11px] text-slate-300 font-mono bg-white/5 p-1.5 rounded border border-white/10 flex items-center justify-between">
                <span>MahaDBT + CSR</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

          </div>

          {/* Quick Demo Preview Card below pipeline */}
          <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-white">Recommended Tri-Tier Safe Route</span>
                  <TrafficLightBadge status="SAFE" size="sm" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  MahaDBT EBC (50% Tuition) + Reliance Foundation UG (Living Grant) + College Alumni Aid
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('routes')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 transition-all flex items-center space-x-1 shrink-0"
            >
              <span>Inspect Routes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </section>

      {/* METRIC PILLARS (Product-oriented metrics, honest & technical) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-purple-500/30 transition-all">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Eligibility Matching</h3>
            <p className="text-xs text-slate-400 mt-1">
              Multi-criteria matching checking state domicile, quota, marks, and annual income.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-rose-500/30 transition-all">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Conflict Detection</h3>
            <p className="text-xs text-slate-400 mt-1">
              Rule-based mutual-exclusivity engine flagging portal deduplication traps.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Document Tracking</h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-time audit of Tahsildar income certs, domicile, CAP letters, and caste validity.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/30 transition-all">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Deadline Alerts</h3>
            <p className="text-xs text-slate-400 mt-1">
              Urgency calendar categorizing approaching deadlines (&lt;7 days, 14 days).
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono tracking-wider text-purple-400">Step-by-Step Workflow</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-display mt-1">
            How scholarmatch-ai Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Five deliberate phases from student onboarding to certified conflict-free submission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Create Profile',
              desc: 'Enter state, academic percentages, family income, and uploaded verification papers.',
              tab: 'profile'
            },
            {
              step: '02',
              title: 'Match Eligibility',
              desc: 'Automated evaluation cross-checks state rules and minimum academic cutoffs.',
              tab: 'discover'
            },
            {
              step: '03',
              title: 'Detect Conflicts',
              desc: 'Engine identifies legal, central/state, and portal-level exclusivity constraints.',
              tab: 'nlp'
            },
            {
              step: '04',
              title: 'Choose Safe Route',
              desc: 'Select optimized combinations that deliver maximum financial aid safely.',
              tab: 'routes'
            },
            {
              step: '05',
              title: 'Track Applications',
              desc: 'Monitor remaining documentation requirements and deadline countdowns.',
              tab: 'deadlines'
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveTab(item.tab)}
              className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-purple-500/40 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black font-display text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-indigo-600">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mt-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-purple-400 group-hover:text-cyan-300 transition-colors">
                <span>Explore</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TARGET AUDIENCE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono tracking-wider text-cyan-400">Ecosystem Value</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
            Built for the Entire Financial Aid Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">For Students</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Never face surprise disqualification or repayment notices. Understand which government fee waivers combine cleanly with private foundation grants.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero surprise portal lockouts</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Optimized total financial coverage</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">For Counselors</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Equip college financial-aid advisors and mentors with an instant conflict matrix to guide first-generation scholars with 100% confidence.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Instant rule citations & clauses</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Document readiness audits</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-4">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">For Institutions</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              University verification cells and registrar departments drastically reduce rejection rates and audit overhead on state scholarship portals.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Lower verification rejection volume</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Pre-cleared candidate applications</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* FINAL LANDING CTA & ENDING MESSAGE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-purple-500/40 relative overflow-hidden glow-purple">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display mb-3">
            “Your scholarship journey shouldn't be a maze.”
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            scholarmatch-ai helps you understand where you qualify, what conflicts, and which route is safest before you apply.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => setActiveTab('profile')}
              className="px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-purple-600/30 transition-all flex items-center space-x-2 border border-white/20 active:scale-95 cursor-pointer"
            >
              <span>Build My Safe Route</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={triggerDemoJudgeFlow}
              className="px-6 py-4 rounded-xl font-semibold text-sm text-purple-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-cyan-400" />
              <span>Launch Demo Flow</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
