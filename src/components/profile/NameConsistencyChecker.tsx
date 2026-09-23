import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { performFuzzyIdentityCheck } from '../../algorithms/nameMatcher';

interface NameConsistencyCheckerProps {
  fullName: string;
  nameOnAadhaar?: string;
  nameOnMarksheet?: string;
  nameOnBankAccount?: string;
  onUpdateField: (field: string, value: string) => void;
}

export const NameConsistencyChecker: React.FC<NameConsistencyCheckerProps> = ({
  fullName,
  nameOnAadhaar,
  nameOnMarksheet,
  nameOnBankAccount,
  onUpdateField
}) => {
  const isAllEmpty = !fullName && !nameOnAadhaar && !nameOnMarksheet && !nameOnBankAccount;

  const analysis = performFuzzyIdentityCheck(
    fullName,
    nameOnAadhaar,
    nameOnMarksheet,
    nameOnBankAccount
  );

  return (
    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              CRITICAL DBT PREREQUISITE
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              PFMS & NPCI Guard
            </span>
          </div>
          <h3 className="text-base font-bold text-white font-display mt-0.5">
            Fuzzy Identity Sync (Name Mismatch Detector)
          </h3>
          <p className="text-xs text-slate-300">
            Over 28% of scholarship disbursements bounce because names differ between Aadhaar, Marksheets, and Bank accounts.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
            isAllEmpty
              ? 'bg-slate-800/60 border-slate-700 text-slate-300'
              : analysis.status === 'PERFECT_MATCH' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : analysis.status === 'ACCEPTABLE_VARIATION'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300 animate-pulse'
          }`}>
            {isAllEmpty ? 'Awaiting Input' : `${analysis.overallScore}% Identity Sync`}
          </span>
        </div>
      </div>

      {/* Inputs for 3 Critical Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Name on Aadhaar Card <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={nameOnAadhaar || ''}
            onChange={e => onUpdateField('nameOnAadhaar', e.target.value)}
            placeholder="e.g. Rahul Sunil Deshmukh"
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            Exact name on UIDAI printed card
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Name on 10th / 12th Marksheet <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={nameOnMarksheet || ''}
            onChange={e => onUpdateField('nameOnMarksheet', e.target.value)}
            placeholder="e.g. Rahul Sunil Deshmukh"
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            As registered in SSC / Board records
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Name on Bank Account Passbook <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={nameOnBankAccount || ''}
            onChange={e => onUpdateField('nameOnBankAccount', e.target.value)}
            placeholder="e.g. Rahul Deshmukh"
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            Title as shown on bank statement
          </span>
        </div>
      </div>

      {/* Live Match Results Banner */}
      <div className={`p-4 rounded-xl border ${
        isAllEmpty
          ? 'bg-slate-900/60 border-slate-700/60'
          : analysis.status === 'PERFECT_MATCH'
          ? 'bg-emerald-950/20 border-emerald-500/30'
          : analysis.status === 'ACCEPTABLE_VARIATION'
          ? 'bg-amber-950/20 border-amber-500/30'
          : 'bg-rose-950/30 border-rose-500/40'
      }`}>
        <div className="flex items-start space-x-3">
          {isAllEmpty ? (
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          ) : analysis.status === 'PERFECT_MATCH' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : analysis.status === 'ACCEPTABLE_VARIATION' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
          )}

          <div className="space-y-1">
            <h4 className={`text-xs sm:text-sm font-bold ${
              isAllEmpty
                ? 'text-cyan-300'
                : analysis.status === 'PERFECT_MATCH'
                ? 'text-emerald-300'
                : analysis.status === 'ACCEPTABLE_VARIATION'
                ? 'text-amber-300'
                : 'text-rose-300'
            }`}>
              {isAllEmpty ? 'Awaiting Identity Information' : analysis.headline}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAllEmpty
                ? 'Enter your name as registered on Aadhaar, Marksheets, and Bank account to calculate PFMS / NPCI DBT sync scores and identify potential disbursement rejections.'
                : analysis.detailedAdvice}
            </p>

            {/* Quick pair breakdown */}
            {!isAllEmpty && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/10 text-[11px]">
                {analysis.comparisons.map((c, i) => (
                  <div key={i} className="p-2 rounded-lg bg-black/30 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-slate-300 font-semibold">
                      <span>{c.pair}</span>
                      <span className={c.similarity >= 85 ? 'text-emerald-400' : 'text-rose-400'}>
                        {c.similarity}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {c.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
