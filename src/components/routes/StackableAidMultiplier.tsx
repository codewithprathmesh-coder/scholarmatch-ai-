import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  Building2, 
  Award,
  DollarSign,
  Info,
  ExternalLink
} from 'lucide-react';
import { computeStackableAidGroups } from '../../algorithms/stackableAidEngine';
import { StackableAidGroup, Scholarship } from '../../types';

export const StackableAidMultiplier: React.FC = () => {
  const { scholarships, applySafeRoute, setActiveTab, setInspectScholarship } = useApp();
  const stackableGroups = computeStackableAidGroups(scholarships);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(stackableGroups[0]?.id || '');

  const activeGroup = stackableGroups.find(g => g.id === selectedGroupId) || stackableGroups[0];

  const handleApplyGroup = (group: StackableAidGroup) => {
    const groupScholarships = [
      ...(group.primaryGovtScheme ? [group.primaryGovtScheme] : []),
      ...group.safeStackablePrivateSchemes
    ];

    const safeRoute = {
      id: group.id,
      name: group.title,
      tagline: `Stacked Legal Aid: ${group.multiplierFactor} Multiplier`,
      scholarships: groupScholarships,
      totalEstimatedSupport: group.totalSupportAmount,
      averageEligibility: 95,
      riskStatus: 'SAFE' as const,
      reason: group.legalExemptionCitation,
      bestFor: 'Maximum Legal Wealth Accumulation'
    };

    applySafeRoute(safeRoute);
    setActiveTab('routes');
  };

  if (!activeGroup) return null;

  return (
    <div className="space-y-6 text-left">
      
      {/* Wealth Maximizer Feature Header */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/40 glow-purple relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                WEALTH MAXIMIZER ENGINE
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Legally Stackable
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              The "Stackable" Aid Multiplier
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Most students assume they can only win one scholarship. While two government tuition schemes conflict, combining a primary Government Scheme with non-conflicting Private/CSR & Hostel Grants legally maximizes your total funding.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {stackableGroups.map((g, idx) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroupId(g.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedGroupId === g.id
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                Option {idx + 1}: ₹{g.totalSupportAmount.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Wealth Maximizer Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
            <span className="text-xs text-slate-400 block">Single Scheme Baseline</span>
            <span className="text-lg font-bold text-slate-300 font-mono">
              ₹{activeGroup.primaryGovtScheme?.awardAmount.toLocaleString('en-IN') || 0}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Standard Govt Freeship Only</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/30">
            <span className="text-xs text-emerald-400 block font-semibold">Stacked Combined Aid</span>
            <span className="text-2xl font-extrabold text-white font-mono">
              ₹{activeGroup.totalSupportAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-300 block mt-0.5 font-bold">
              +{activeGroup.multiplierFactor}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/30">
            <span className="text-xs text-cyan-400 block font-semibold">Pure Extra Legitimate Cash</span>
            <span className="text-xl font-extrabold text-cyan-300 font-mono">
              +₹{activeGroup.stackedBonusAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-cyan-200/80 block mt-0.5">Direct to Student Bank Account</span>
          </div>
        </div>
      </div>

      {/* TWO DISTINCT COLUMNS: PRIMARY GOVT SCHEME vs SAFE STACKABLE PRIVATE SCHEMES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLUMN 1: PRIMARY GOVERNMENT SCHEME */}
        <div className="p-6 rounded-3xl glass-panel border border-purple-500/30 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white font-display">
                Column 1: Primary Government Scheme
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
              Tuition / Institutional Aid
            </span>
          </div>

          {activeGroup.primaryGovtScheme ? (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-white leading-snug">
                    {activeGroup.primaryGovtScheme.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeGroup.primaryGovtScheme.provider}
                  </p>
                </div>
                <span className="text-lg font-mono font-extrabold text-purple-300">
                  ₹{activeGroup.primaryGovtScheme.awardAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeGroup.primaryGovtScheme.benefits}
              </p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  Code: {activeGroup.primaryGovtScheme.code}
                </span>
                <button
                  onClick={() => setInspectScholarship(activeGroup.primaryGovtScheme)}
                  className="text-purple-400 hover:text-purple-300 text-xs font-semibold flex items-center space-x-1"
                >
                  <span>Inspect Details</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No primary government scheme selected.</p>
          )}

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-200/90 leading-relaxed">
            <strong>Role in Stack:</strong> Covers your formal institute fee and examination fee, paid either directly to college or via student escrow.
          </div>
        </div>

        {/* COLUMN 2: SAFE STACKABLE PRIVATE SCHEMES */}
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-display">
                Column 2: Safe Stackable Private Schemes
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              Living Stipend / CSR Grants
            </span>
          </div>

          <div className="space-y-3">
            {activeGroup.safeStackablePrivateSchemes.map(s => (
              <div key={s.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {s.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {s.provider}
                    </p>
                  </div>
                  <span className="text-base font-mono font-bold text-cyan-300">
                    ₹{s.awardAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {s.benefits}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    ✓ Verified Non-Conflicting
                  </span>
                  <button
                    onClick={() => setInspectScholarship(s)}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center space-x-1"
                  >
                    <span>View Scheme</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-cyan-200/90 leading-relaxed">
            <strong>Role in Stack:</strong> Disbursed directly into your bank account to cover hostel rent, books, laptop, and daily living expenses.
          </div>
        </div>
      </div>

      {/* LEGAL CITATION & COMPLIANCE BOX */}
      <div className="p-5 rounded-2xl bg-black/50 border border-white/15 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
          <h4 className="text-sm font-bold text-white">
            Legal Basis & Mutual Compatibility Certification
          </h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
          "{activeGroup.legalExemptionCitation}"
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
          <span className="text-emerald-400 font-mono font-bold">
            {activeGroup.conflictFreeCertificate}
          </span>
          <button
            onClick={() => handleApplyGroup(activeGroup)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer shrink-0"
          >
            <span>Apply This Stack to My Live Route</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
