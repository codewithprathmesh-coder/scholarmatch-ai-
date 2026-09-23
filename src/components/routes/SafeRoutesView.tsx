import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  X, 
  Plus, 
  ArrowRight, 
  FileText, 
  Info,
  Layers,
  Award,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { TrafficLightBadge } from '../common/TrafficLightBadge';
import { SafeRoute } from '../../types';
import { StackableAidMultiplier } from './StackableAidMultiplier';

export const SafeRoutesView: React.FC = () => {
  const { 
    routeResults, 
    activeRouteAnalysis, 
    selectedScholarshipIds, 
    removeFromRoute, 
    addToRoute,
    applySafeRoute,
    scholarships, 
    setInspectScholarship,
    rules,
    goBack
  } = useApp();

  const [selectedRouteTab, setSelectedRouteTab] = useState<'stackable' | 'recommended' | 'all' | 'builder'>('stackable');

  const allSafeRoutes = [routeResults.recommendedSafeRoute, ...(routeResults.alternativeSafeRoutes || [])];
  const selectedScholarships = scholarships.filter(s => selectedScholarshipIds.includes(s.id));
  const candidateTotalAmount = selectedScholarships.reduce((acc, s) => acc + s.awardAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center space-x-1.5 mb-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              MAXIMUM SUPPORT • ZERO DISQUALIFICATION RISK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Safe Route Optimization & Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Combine compatible scholarships to maximize legitimate financial aid without triggering portal deduplication blacklists.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center space-x-2 bg-white/5 p-1.5 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setSelectedRouteTab('stackable')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedRouteTab === 'stackable'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ★ Stackable Multiplier
          </button>
          <button
            onClick={() => setSelectedRouteTab('recommended')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedRouteTab === 'recommended'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Recommended Plan
          </button>
          <button
            onClick={() => setSelectedRouteTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedRouteTab === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Safe Routes ({allSafeRoutes.length})
          </button>
          <button
            onClick={() => setSelectedRouteTab('builder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedRouteTab === 'builder'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Builder ({selectedScholarshipIds.length})
          </button>
        </div>
      </div>

      {/* TAB 0: STACKABLE AID MULTIPLIER (Wealth Maximizer) */}
      {selectedRouteTab === 'stackable' && (
        <StackableAidMultiplier />
      )}

      {/* TAB 1: RECOMMENDED SAFE ROUTE (Section 11 & 12) */}
      {selectedRouteTab === 'recommended' && (
        <div className="space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-500/40 shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <TrafficLightBadge status="SAFE" size="md" />
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    BEST OPTIMIZED COMBINATION
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  {routeResults.recommendedSafeRoute.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {routeResults.recommendedSafeRoute.reason}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-right shrink-0">
                <span className="text-xs font-mono text-slate-300 block">Total Legitimate Support</span>
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-white font-display">
                  ₹{routeResults.recommendedSafeRoute.totalEstimatedSupport.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-emerald-300 font-mono block mt-0.5">
                  100% Conflict-Free • Deduplication Safe
                </span>
              </div>
            </div>

            {/* Schemes in Recommended Route */}
            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Included Scholarships & Compatible Buckets:
              </h3>

              {routeResults.recommendedSafeRoute.scholarships.map((s, idx) => (
                <div 
                  key={s.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center space-x-3.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 
                          onClick={() => setInspectScholarship(s)}
                          className="text-sm sm:text-base font-bold text-white hover:text-emerald-300 cursor-pointer transition-colors"
                        >
                          {s.name}
                        </h4>
                        <a
                          href={s.officialPortalUrl || s.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-emerald-300 transition-colors p-1"
                          title={`Open official scheme page for ${s.name}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-400">
                        {s.provider} • <strong className="text-slate-300">{s.benefits}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-center shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-bold text-white block font-mono">
                        ₹{s.awardAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Direct Account Transfer
                      </span>
                    </div>
                    <TrafficLightBadge status="SAFE" size="sm" showLabel={false} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-white/10">
              <div className="text-xs text-slate-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Exclusivity checks passed: 0 statutory overlaps between MahaDBT fee remission and CSR learning grants.</span>
              </div>

              <button
                id="btn-apply-recommended-route"
                onClick={() => applySafeRoute(routeResults.recommendedSafeRoute)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>Adopt This Safe Route</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Contrast Comparison Box (Section 12: Comparing Safe Route vs Rejected Route) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Safe Route Summary */}
            <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 space-y-3">
              <div className="flex items-center space-x-2">
                <TrafficLightBadge status="SAFE" size="sm" />
                <h4 className="text-sm font-bold text-white font-display">
                  Recommended Safe Route (₹1,30,000)
                </h4>
              </div>
              <ul className="text-xs space-y-2 text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>MahaDBT Post-Matric:</strong> State covers official 50% tuition reimbursement.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>Reliance Foundation UG:</strong> Private CSR covers laptops, books & living stipends.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>College Aid:</strong> University discretionary hardship fund is permissible alongside CSR.</span>
                </li>
              </ul>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-mono">
                OUTCOME: All 3 awards safely disbursed without portal cancellation.
              </div>
            </div>

            {/* Rejected Route Summary */}
            <div className="p-6 rounded-2xl glass-panel border border-rose-500/30 space-y-3">
              <div className="flex items-center space-x-2">
                <TrafficLightBadge status="CONFLICT" size="sm" />
                <h4 className="text-sm font-bold text-white font-display">
                  Common Trap: NSP + MahaDBT (₹75,000)
                </h4>
              </div>
              <ul className="text-xs space-y-2 text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-rose-400">✗</span>
                  <span><strong>Central Sector Scheme (NSP):</strong> Requires certification that no other fee grant is claimed.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-400">✗</span>
                  <span><strong>MahaDBT EBC:</strong> Cross-checks NSP database via PFMS Aadhaar seeded accounts.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-400">✗</span>
                  <span><strong>Result:</strong> Administrative audit flags dual tuition grant. MahaDBT cancels sanction.</span>
                </li>
              </ul>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-mono">
                OUTCOME: Both awards withheld; applicant placed under review.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: ALL SAFE ROUTES */}
      {selectedRouteTab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSafeRoutes.map((route, i) => (
            <div 
              key={route.id}
              className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <TrafficLightBadge status="SAFE" size="sm" />
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    ₹{route.totalEstimatedSupport.toLocaleString('en-IN')} / yr
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-display">
                  {route.name}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {route.reason}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Schemes ({route.scholarships.length}):</span>
                  {route.scholarships.map(s => (
                    <div key={s.id} className="text-xs text-slate-200 flex items-center space-x-1.5">
                      <span className="text-emerald-400 text-[10px]">●</span>
                      <span className="truncate">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10">
                <button
                  onClick={() => applySafeRoute(route)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Select This Route</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: LIVE ROUTE BUILDER & CONFLICT AUDIT */}
      {selectedRouteTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Candidate Route List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/10">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Your Candidate Route
                </h3>
                <p className="text-xs text-slate-400">
                  Add or remove schemes to test combinations live against state rules.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-mono">Combined Total</span>
                <span className="text-xl font-bold text-white font-mono">
                  ₹{candidateTotalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {selectedScholarships.length === 0 ? (
              <div className="p-12 text-center rounded-2xl glass-panel border border-white/10">
                <p className="text-sm font-semibold text-white">Your route is currently empty.</p>
                <p className="text-xs text-slate-400 mt-1">Browse scholarships in Discover to add candidates.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedScholarships.map(s => (
                  <div 
                    key={s.id}
                    className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{s.name}</h4>
                      <p className="text-xs text-slate-400">{s.provider} • ₹{s.awardAmount.toLocaleString('en-IN')}</p>
                    </div>

                    <button
                      onClick={() => removeFromRoute(s.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                      title="Remove from candidate route"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right 1 Col: Live Conflict Audit Box */}
          <div className="space-y-4">
            <div className={`p-6 rounded-2xl glass-panel border transition-all ${
              activeRouteAnalysis.overallStatus === 'CONFLICT' 
                ? 'border-rose-500/50 bg-rose-950/20' 
                : activeRouteAnalysis.overallStatus === 'SAFE'
                ? 'border-emerald-500/50 bg-emerald-950/20'
                : 'border-amber-500/50 bg-amber-950/20'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <TrafficLightBadge status={activeRouteAnalysis.overallStatus} size="md" />
                <span className="text-xs font-mono font-bold text-white">
                  {activeRouteAnalysis.conflicts.length} Violations
                </span>
              </div>

              <h4 className="text-base font-bold text-white font-display mb-1">
                Route Safety Verdict
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {activeRouteAnalysis.conflicts.length > 0 
                  ? 'Mutual-exclusivity violation detected! Removing one of the conflicting government fee concessions will restore deduplication safety.'
                  : 'All candidate scholarships in this route are compatible and can be claimed concurrently without administrative penalty.'}
              </p>

              {/* Detected Conflicts */}
              {activeRouteAnalysis.conflicts.length > 0 && (
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <span className="text-[11px] font-mono text-rose-400 font-bold block">
                    Detected Statutory Conflicts:
                  </span>

                  {activeRouteAnalysis.conflicts.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200">
                      <div className="font-semibold text-rose-300">
                        {c.scholarshipA.name} ⚡ {c.scholarshipB.name}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        {c.reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
