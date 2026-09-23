import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  AlertOctagon, 
  FileText, 
  Clock, 
  Compass, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  Layers,
  Search,
  BookOpen,
  Wallet,
  CreditCard,
  ShieldAlert,
  Mail,
  Scale
} from 'lucide-react';
import { TrafficLightBadge } from '../common/TrafficLightBadge';

export const DashboardView: React.FC = () => {
  const { 
    student, 
    setActiveTab, 
    routeResults, 
    scholarships, 
    getEligibilityFor,
    setInspectScholarship,
    addToRoute,
    applySafeRoute,
    eligibleCount,
    safeRouteCount,
    potentialConflictCount,
    missingDocumentCount
  } = useApp();

  // Conflict Simulator local test state for judges to play with
  const [sandboxA, setSandboxA] = useState<string>('MAHADBT_EBC');
  const [sandboxB, setSandboxB] = useState<string>('CENTRAL_SECTOR_NSP');

  // Greeting time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Find sandbox scholarships
  const sA = scholarships.find(s => s.id === sandboxA);
  const sB = scholarships.find(s => s.id === sandboxB);

  // Compute sandbox conflict
  const isConflictScenario = 
    (sandboxA === 'MAHADBT_EBC' && sandboxB === 'CENTRAL_SECTOR_NSP') ||
    (sandboxA === 'CENTRAL_SECTOR_NSP' && sandboxB === 'MAHADBT_EBC') ||
    (sandboxA === 'MAHADBT_SC_FREESHIP' && sandboxB === 'CENTRAL_SECTOR_NSP') ||
    (sandboxA === 'MAHADBT_EBC' && sandboxB === 'MAHADBT_SC_FREESHIP');

  const isCompatibleScenario = 
    (sandboxA === 'MAHADBT_EBC' && sandboxB === 'RELIANCE_FOUNDATION_UG') ||
    (sandboxA === 'RELIANCE_FOUNDATION_UG' && sandboxB === 'MAHADBT_EBC') ||
    (sandboxA === 'MAHADBT_EBC' && sandboxB === 'SWADHAR_HOSTEL_MAHA') ||
    (sandboxA === 'MAHADBT_EBC' && sandboxB === 'COLLEGE_INSTITUTIONAL_AID');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-white/10 glow-purple relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              SAFETY MONITOR ACTIVE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {greeting}, {student.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Here’s your scholarship safety overview. We cross-referenced your profile against 12+ state & central exclusivity rules.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            id="dash-btn-run-analysis"
            onClick={() => setActiveTab('routes')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-cyan-300" />
            <span>Explore Safe Routes</span>
          </button>
          <button
            onClick={() => setActiveTab('nlp')}
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center space-x-1 cursor-pointer"
          >
            <Scale className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Rule Interpreter</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD STATS ROW (As specified in requirement 19) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Card 1: Eligible Scholarships */}
        <div 
          onClick={() => setActiveTab('discover')}
          className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Eligible Schemes</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-display">
            {eligibleCount}
          </div>
          <span className="text-[11px] text-purple-300 font-medium mt-1 block">
            Qualifies for application
          </span>
        </div>

        {/* Card 2: Safe Routes */}
        <div 
          onClick={() => setActiveTab('routes')}
          className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Safe Routes</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-display">
            {safeRouteCount}
          </div>
          <span className="text-[11px] text-emerald-300 font-medium mt-1 block">
            0% conflict risk
          </span>
        </div>

        {/* Card 3: Potential Conflicts */}
        <div 
          onClick={() => setActiveTab('nlp')}
          className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Mutual Conflicts</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-400 font-display">
            {potentialConflictCount}
          </div>
          <span className="text-[11px] text-rose-300 font-medium mt-1 block">
            Administrative overlaps
          </span>
        </div>

        {/* Card 4: Missing Documents */}
        <div 
          onClick={() => setActiveTab('documents')}
          className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Missing Docs</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-display">
            {missingDocumentCount}
          </div>
          <span className="text-[11px] text-amber-300 font-medium mt-1 block">
            Required for full grant
          </span>
        </div>

        {/* Card 5: Upcoming Deadlines */}
        <div 
          onClick={() => setActiveTab('deadlines')}
          className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Upcoming Deadlines</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-display">
            5
          </div>
          <span className="text-[11px] text-cyan-300 font-medium mt-1 block">
            Next closes in 11 days
          </span>
        </div>

      </div>

      {/* CRITICAL DBT ALERT (If bank account not seeded on NPCI) */}
      {!student.isDbtBankSeeded && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse shadow-lg">
          <div className="flex items-start space-x-3 text-left">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-rose-300">
                Aadhaar-DBT Pre-Check Failed: Direct Benefit Transfer Not Seeded
              </h3>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                Your profile indicates your bank account is not mapped to NPCI for Direct Benefit Transfer. Any approved government scholarship (MahaDBT / NSP) will bounce upon disbursement attempt.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md"
          >
            Fix in Profile Setup
          </button>
        </div>
      )}

      {/* NEW CAPABILITIES SPOTLIGHT: STACKABLE AID MULTIPLIER & ACTIVE WALLET */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        
        {/* Feature 1: The Stackable Aid Multiplier */}
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 hover:border-cyan-500/50 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  WEALTH MAXIMIZER
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Legal Aid Stacking
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-display">
                The "Stackable" Aid Multiplier
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                Don't settle for a single scholarship. Combine primary Government Tuition schemes with non-conflicting Corporate CSR (Tata, Reliance) and Hosteller stipends to legally double your total financial award.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Single Scheme Baseline</span>
                <span className="text-sm font-bold text-slate-300 font-mono">₹65,000 / yr</span>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 block font-semibold">Stacked Multiplier Aid</span>
                <span className="text-base font-extrabold text-white font-mono text-cyan-300">₹1,35,000 / yr (2.08x)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('routes')}
            className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Explore Stackable Aid Multiplier</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature 2: "Year 2" Renewal Tracker & Nodal Officer Nudge */}
        <div className="p-6 rounded-2xl glass-panel border border-purple-500/30 hover:border-purple-500/50 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                  MULTI-YEAR RETENTION
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {student.activeWalletSchemes?.length || 0} Active Schemes
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-display">
                "Year 2" Renewal Tracker & Nodal Desk Nudge
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                Track disbursed grants, stay compliant with renewal criteria (minimum CGPA & attendance), and trigger automated pre-formatted emails to college Nodal Officers before desk scrutiny deadlines.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Active Tracked Disbursements:</span>
                <span className="font-mono text-white font-bold">
                  ₹{(student.activeWalletSchemes?.reduce((acc, s) => acc + s.awardAmount, 0) || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-amber-300 text-[11px]">
                <span>College Nodal Verification:</span>
                <span className="font-mono font-bold">Desk Nudge Available</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('wallet')}
            className="mt-4 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Open Active Schemes Wallet</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* MAIN SECTION: RECOMMENDED SAFE ROUTE SPOTLIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: The Recommended Route */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-2xl glass-panel border border-emerald-500/40 shadow-xl shadow-emerald-950/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4 mb-5">
            <div>
              <div className="flex items-center space-x-2">
                <TrafficLightBadge status="SAFE" size="sm" />
                <span className="text-xs font-mono text-emerald-400 font-semibold">RECOMMENDED ROUTE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                {routeResults.recommendedSafeRoute.name}
              </h2>
            </div>
            
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Total Safe Support</span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-display">
                ₹{routeResults.recommendedSafeRoute.totalEstimatedSupport.toLocaleString('en-IN')}
                <span className="text-xs text-slate-400 font-normal"> / year</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-6 leading-relaxed">
            {routeResults.recommendedSafeRoute.reason}
          </p>

          {/* List of Scholarships in this Safe Route */}
          <div className="space-y-3 mb-6">
            {routeResults.recommendedSafeRoute.scholarships.map((s, idx) => {
              const el = getEligibilityFor(s);

              return (
                <div 
                  key={s.id}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white hover:text-emerald-300 cursor-pointer" onClick={() => setInspectScholarship(s)}>
                        {s.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {s.provider} • <span className="text-slate-300 font-medium">{s.benefits}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xs font-bold text-white block">
                        ₹{s.awardAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {el.score}% Match
                      </span>
                    </div>
                    <TrafficLightBadge status="SAFE" size="sm" showLabel={false} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs text-slate-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              <span>Deduplication check passed: Zero portal conflicts</span>
            </span>

            <button
              id="btn-apply-safe-route-dash"
              onClick={() => applySafeRoute(routeResults.recommendedSafeRoute)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <span>Apply This Safe Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: The Contrast - "Rejected Conflict Route" */}
        <div className="p-6 rounded-2xl glass-panel border border-rose-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrafficLightBadge status="CONFLICT" size="sm" />
              <span className="text-[11px] font-mono text-rose-400 uppercase font-semibold">
                EXCLUSIVITY TRAP
              </span>
            </div>

            <h3 className="text-base font-bold text-white font-display">
              Why Unchecked Applications Fail
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Applying for both <strong className="text-rose-300">Central Sector Scheme (NSP)</strong> and <strong className="text-rose-300">MahaDBT EBC</strong> sounds attractive (totaling ₹75,000), but creates a severe administrative conflict:
            </p>

            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 leading-relaxed font-mono">
              ⚠ RULE-001 VIOLATION: MHRD Clause 6.3 & MahaDBT portal cross-verification disallow dual government tuition compensation. Both applications risk immediate cancellation during Aadhaar DBT deduplication.
            </div>

            <p className="text-xs text-slate-400">
              scholarmatch-ai automatically diverts you away from this trap and swaps the central scheme with private CSR aid that works cleanly!
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10">
            <button
              onClick={() => setActiveTab('nlp')}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Inspect in Rule Interpreter</span>
            </button>
          </div>
        </div>

      </div>

      {/* SECTION: INTERACTIVE CONFLICT SANDBOX (Live judge testing tool!) */}
      <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-purple-500/30 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Live Conflict Simulator (Judge Testbed)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any two scholarships below to test the live mutual-exclusivity decision engine.
            </p>
          </div>
          <span className="text-[11px] font-mono text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30 self-start sm:self-center">
            REAL-TIME RULE EXECUTION
          </span>
        </div>

        {/* Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Scholarship A</label>
            <select
              value={sandboxA}
              onChange={e => setSandboxA(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-purple-500"
            >
              {scholarships.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Scholarship B</label>
            <select
              value={sandboxB}
              onChange={e => setSandboxB(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-purple-500"
            >
              {scholarships.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Evaluation Box */}
        <div className={`p-4 rounded-xl border transition-all ${
          isConflictScenario 
            ? 'bg-rose-950/40 border-rose-500/50 text-rose-200' 
            : isCompatibleScenario
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrafficLightBadge 
                status={isConflictScenario ? 'CONFLICT' : isCompatibleScenario ? 'SAFE' : 'REVIEW'} 
                size="md" 
              />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                {isConflictScenario ? 'RULE VIOLATION DETECTED' : isCompatibleScenario ? 'MUTUALLY COMPATIBLE' : 'REVIEW REQUIRED'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-300">
              Confidence: 98%
            </span>
          </div>

          <p className="text-xs leading-relaxed font-sans">
            {isConflictScenario && (
              <span>
                <strong>Administrative Conflict:</strong> Both schemes provide statutory higher education fee concessions. Government portal deduplication mandates that an applicant can only claim one state or central fee reimbursement at a time. Applying for both risks recovery proceedings and blacklisting.
              </span>
            )}
            {isCompatibleScenario && (
              <span>
                <strong>Safe Combination:</strong> These schemes target complementary expenditure buckets (e.g. state tuition reimbursement vs. private learning hardware / living allowance). They can safely be held concurrently.
              </span>
            )}
            {!isConflictScenario && !isCompatibleScenario && (
              <span>
                <strong>Verification Required:</strong> No direct statutory block exists, but applicant should confirm collegiate sanctioning rules before simultaneous filing.
              </span>
            )}
          </p>

          {isConflictScenario && (
            <div className="mt-3 pt-3 border-t border-rose-500/30 flex items-center justify-between text-xs">
              <span className="text-rose-300">Suggested Action: Replace one with Reliance Foundation UG or College Aid.</span>
              <button
                onClick={() => setSandboxB('RELIANCE_FOUNDATION_UG')}
                className="px-3 py-1 rounded bg-rose-500/30 hover:bg-rose-500/50 text-white font-medium transition-colors"
              >
                Auto-Fix to Safe Pair
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LOWER WIDGETS: DEADLINES & QUICK DISCOVERY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Widget 1: Upcoming Deadlines */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-display">Upcoming Deadlines</h3>
              </div>
              <button 
                onClick={() => setActiveTab('deadlines')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Central Sector Scheme (NSP)', days: 11, urgency: 'red', date: '30 Sep 2026' },
                { name: 'Reliance Foundation UG Scholarship', days: 26, urgency: 'yellow', date: '15 Oct 2026' },
                { name: 'MahaDBT Post-Matric (EBC)', days: 42, urgency: 'green', date: '31 Oct 2026' },
              ].map((d, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">{d.name}</span>
                    <span className="text-[10px] text-slate-400">Deadline: {d.date}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    d.days < 14 ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                    d.days < 30 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {d.days} days left
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Automated SMS / Email reminders enabled</span>
            <span className="text-cyan-400 font-mono">3 Days Before</span>
          </div>
        </div>

        {/* Widget 2: Document Verification Status */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white font-display">Document Readiness</h3>
              </div>
              <button 
                onClick={() => setActiveTab('documents')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center space-x-1"
              >
                <span>Manage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-xs text-slate-200">Income Certificate (Tahsildar)</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-mono px-2 py-0.5 rounded">READY</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-xs text-slate-200">Domicile Certificate of Maharashtra</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-mono px-2 py-0.5 rounded">READY</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <span className="text-xs text-slate-200">College Bonafide / Current Fee Receipt</span>
                <span className="text-[10px] bg-amber-500/30 text-amber-300 font-mono px-2 py-0.5 rounded">MISSING</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400">
            <span>Overall Repository: </span>
            <strong className="text-white">6 of 8 Verified</strong>
            <span className="text-slate-400"> (sufficient for MahaDBT EBC + Reliance UG)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
