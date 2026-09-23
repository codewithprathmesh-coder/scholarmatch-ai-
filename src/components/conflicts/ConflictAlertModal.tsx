import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, X, ShieldCheck, ArrowRight, Check, Sparkles } from 'lucide-react';
import { TrafficLightBadge } from '../common/TrafficLightBadge';

export const ConflictAlertModal: React.FC = () => {
  const { 
    conflictModalData, 
    closeConflictModal, 
    removeFromRoute, 
    addToRoute,
    scholarships, 
    rules,
    setActiveTab 
  } = useApp();

  if (!conflictModalData.isOpen) return null;

  const sA = conflictModalData.scholarshipA;
  const sB = conflictModalData.scholarshipB;

  // Safe alternatives that are compatible with sA (e.g. Reliance Foundation UG or College Aid)
  const safeAlternatives = scholarships.filter(s => 
    s.id !== sA?.id && 
    s.id !== sB?.id && 
    sA?.compatibleScholarshipIds.includes(s.id)
  ).slice(0, 2);

  const handleApplyAlternative = (altId: string) => {
    if (sB) removeFromRoute(sB.id);
    addToRoute(altId);
    closeConflictModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-xl rounded-3xl glass-panel border border-rose-500/50 shadow-2xl shadow-rose-950/40 p-6 sm:p-8 relative overflow-hidden text-left">
        
        {/* Glow Header */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider block">
                ADMINISTRATIVE EXCLUSIVITY VIOLATION
              </span>
              <h2 className="text-xl font-bold text-white font-display">
                Administrative Conflict Detected
              </h2>
            </div>
          </div>

          <button
            onClick={closeConflictModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflicting Schemes Box */}
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-3 mb-5">
          <div className="text-xs text-rose-200">
            You selected an incompatible combination:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] text-slate-400 block font-mono">SCHOLARSHIP A</span>
              <span className="font-semibold text-white mt-0.5 block">{sA?.name}</span>
              <span className="text-[10px] text-slate-400">{sA?.provider}</span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-rose-500/30">
              <span className="text-[10px] text-rose-400 block font-mono">SCHOLARSHIP B (CONFLICT)</span>
              <span className="font-semibold text-rose-200 mt-0.5 block">{sB?.name}</span>
              <span className="text-[10px] text-slate-400">{sB?.provider}</span>
            </div>
          </div>

          <div className="text-xs text-rose-300 leading-relaxed font-sans pt-1">
            <strong>Potential Disqualification Risk:</strong> {conflictModalData.reason || 'These scholarships have a configured mutual-exclusivity relationship. Applying for both may trigger automatic rejection during Aadhaar DBT deduplication.'}
          </div>
        </div>

        {/* Safe Alternatives Section (Section 21) */}
        {safeAlternatives.length > 0 && (
          <div className="mb-6 space-y-2.5">
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Conflict-Free Alternatives:</span>
            </div>

            <div className="space-y-2">
              {safeAlternatives.map(alt => (
                <div 
                  key={alt.id}
                  className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block">{alt.name}</span>
                    <span className="text-[11px] text-slate-300">
                      Benefit: <strong className="text-emerald-400">₹{alt.awardAmount.toLocaleString('en-IN')}</strong> • 🟢 100% Compatible
                    </span>
                  </div>

                  <button
                    onClick={() => handleApplyAlternative(alt.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shrink-0 flex items-center space-x-1"
                  >
                    <span>Swap Safely</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-white/10">
          <button
            onClick={() => {
              if (sB) removeFromRoute(sB.id);
              closeConflictModal();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-colors"
          >
            Remove Incompatible Scheme
          </button>

          <button
            onClick={() => {
              closeConflictModal();
              setActiveTab('nlp');
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            View in Rule Interpreter
          </button>

          <button
            onClick={closeConflictModal}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Keep for Testing
          </button>
        </div>

      </div>
    </div>
  );
};
