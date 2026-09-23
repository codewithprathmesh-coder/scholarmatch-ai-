import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Cpu, Database, Network, CheckCircle2, Sparkles } from 'lucide-react';

export const LoadingAnalysis: React.FC = () => {
  const { isAnalyzing, analysisStep, analysisStepLabel } = useApp();

  if (!isAnalyzing) return null;

  const steps = [
    { num: 1, label: 'Reading student profile...', icon: Cpu },
    { num: 2, label: 'Checking eligibility parameters...', icon: Database },
    { num: 3, label: 'Analyzing administrative conflict rules...', icon: ShieldCheck },
    { num: 4, label: 'Building conflict graph & exclusivity matrix...', icon: Network },
    { num: 5, label: 'Synthesizing maximal-benefit safe routes...', icon: Sparkles }
  ];

  const progressPercent = Math.min(100, Math.round((analysisStep / 5) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090e]/85 backdrop-blur-md px-4">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl glass-panel border border-purple-500/30 shadow-2xl shadow-purple-900/40 text-center relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-cyan-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Central Pulsing Radar */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping opacity-60" />
          <div className="absolute inset-2 rounded-full border border-cyan-400/40 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
            <ShieldCheck className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-1">
          scholarmatch-ai Engine Active
        </h3>
        <p className="text-xs text-purple-300 font-mono mb-6">
          AI-POWERED MUTUAL-EXCLUSIVITY AUDIT IN PROGRESS
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2.5 mb-6 overflow-hidden p-0.5 border border-white/10">
          <div 
            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="space-y-3 text-left">
          {steps.map(s => {
            const Icon = s.icon;
            const isCompleted = s.num < analysisStep;
            const isCurrent = s.num === analysisStep;

            return (
              <div 
                key={s.num}
                className={`flex items-center space-x-3 p-2.5 rounded-xl border transition-all ${
                  isCurrent 
                    ? 'bg-purple-600/20 border-purple-500/50 text-white' 
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isCompleted ? 'bg-emerald-500/20 text-emerald-400' :
                  isCurrent ? 'bg-purple-500/30 text-cyan-300 animate-pulse' :
                  'bg-white/5 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="flex-1 text-xs">
                  <span className={`font-medium ${isCurrent ? 'text-purple-200' : ''}`}>
                    Step {s.num}: {s.label}
                  </span>
                </div>
                {isCurrent && (
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 animate-pulse">
                    RUNNING
                  </span>
                )}
                {isCompleted && (
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    VERIFIED
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-[11px] text-slate-400 flex items-center justify-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mr-1" />
          <span>Cross-referencing Maharashtra DHE & MHRD guidelines...</span>
        </div>

      </div>
    </div>
  );
};
