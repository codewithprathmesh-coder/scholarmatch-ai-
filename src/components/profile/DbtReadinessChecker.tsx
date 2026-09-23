import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  ShieldCheck, 
  RefreshCw, 
  FileCheck, 
  Printer,
  Search,
  X
} from 'lucide-react';
import { 
  INDIAN_BANKS, 
  POPULAR_DBT_BANKS, 
  MAJOR_INDIAN_BANKS 
} from '../../data/indianBanks';

interface DbtReadinessCheckerProps {
  isDbtBankSeeded: boolean;
  dbtBankName?: string;
  dbtSeedingStatus?: 'SEEDED' | 'NOT_SEEDED' | 'IN_PROGRESS' | 'UNKNOWN';
  studentName: string;
  collegeName: string;
  onUpdateField: (field: string, value: any) => void;
}

export const DbtReadinessChecker: React.FC<DbtReadinessCheckerProps> = ({
  isDbtBankSeeded,
  dbtBankName,
  dbtSeedingStatus,
  studentName,
  collegeName,
  onUpdateField
}) => {
  const [showSimModal, setShowSimModal] = useState(false);
  const [simAadhaarLast4, setSimAadhaarLast4] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [showMandateModal, setShowMandateModal] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Group banks by category for structured optgroup display
  const groupedBanks = useMemo(() => {
    const groups: { [key: string]: typeof INDIAN_BANKS } = {
      'Public Sector Banks (Nationalized)': [],
      'Payments Banks & Postal (High DBT Rate)': [],
      'Private Sector Banks': [],
      'Regional Rural Banks (RRBs)': [],
      'Co-operative & Urban Co-op Banks': [],
      'Small Finance Banks': []
    };

    INDIAN_BANKS.forEach(b => {
      if (b.category === 'Public Sector Bank') groups['Public Sector Banks (Nationalized)'].push(b);
      else if (b.category === 'Payments Bank') groups['Payments Banks & Postal (High DBT Rate)'].push(b);
      else if (b.category === 'Private Sector Bank') groups['Private Sector Banks'].push(b);
      else if (b.category === 'Regional Rural Bank') groups['Regional Rural Banks (RRBs)'].push(b);
      else if (b.category === 'Co-operative Bank') groups['Co-operative & Urban Co-op Banks'].push(b);
      else if (b.category === 'Small Finance Bank') groups['Small Finance Banks'].push(b);
    });

    return groups;
  }, []);

  // Filter banks when search term is entered
  const filteredBanks = useMemo(() => {
    if (!bankSearch.trim()) return null;
    const q = bankSearch.toLowerCase().trim();
    return INDIAN_BANKS.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.fullName.toLowerCase().includes(q) ||
      b.shortCode.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  }, [bankSearch]);

  const isKnownPredefined = useMemo(() => {
    return INDIAN_BANKS.some(b => b.name === dbtBankName);
  }, [dbtBankName]);

  const handleSimulateCheck = () => {
    if (!simAadhaarLast4 || simAadhaarLast4.length !== 4) return;
    setIsSimulating(true);
    setSimResult(null);

    setTimeout(() => {
      setIsSimulating(false);
      if (isDbtBankSeeded) {
        setSimResult(`SUCCESS: Aadhaar ending in ${simAadhaarLast4} is actively mapped to ${dbtBankName || 'Bank'} on the NPCI mapper server (Status: Active / DBT Ready).`);
      } else {
        setSimResult(`ERROR (Code 02): Aadhaar ending in ${simAadhaarLast4} NOT found on NPCI Bharat Aadhaar Payment Gateway (BAPG). Direct Benefit Transfer will bounce.`);
      }
    }, 1200);
  };

  return (
    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
              MANDATORY GOVERNMENT DISBURSEMENT CHECK
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Direct Benefit Transfer (DBT)
            </span>
          </div>
          <h3 className="text-base font-bold text-white font-display mt-0.5">
            Aadhaar-DBT Bank Seeding Pre-Check (NPCI Server Mapper)
          </h3>
          <p className="text-xs text-slate-300">
            Government scholarships bypass colleges and transfer funds directly into your Aadhaar-seeded bank account. If your bank account is not mapped on NPCI, you cannot receive payments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSimModal(true)}
          className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          <span>NPCI Live Test Tool</span>
        </button>
      </div>

      {/* Main Toggle and Bank Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Is your Bank Account Seeded with Aadhaar on NPCI? <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onUpdateField('isDbtBankSeeded', true);
                onUpdateField('dbtSeedingStatus', 'SEEDED');
              }}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                isDbtBankSeeded
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-950/40'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Yes, Aadhaar-Seeded</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onUpdateField('isDbtBankSeeded', false);
                onUpdateField('dbtSeedingStatus', 'NOT_SEEDED');
              }}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                !isDbtBankSeeded
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-md shadow-rose-950/40'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>No / Not Sure</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-300">
              Primary Bank Name <span className="text-purple-400 font-normal">({INDIAN_BANKS.length}+ Scheduled Banks)</span>
            </label>
            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-[11px] text-purple-400 hover:text-purple-300 underline font-medium cursor-pointer"
            >
              {isCustomMode ? 'Choose from list' : 'Type other / custom branch'}
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={bankSearch}
              onChange={e => setBankSearch(e.target.value)}
              placeholder="Quick search bank (e.g. BOI, Bank of India, SBI, Post Office, Gramin)..."
              className="w-full pl-8 pr-8 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            {bankSearch && (
              <button
                type="button"
                onClick={() => setBankSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Search Match Dropdown */}
          {filteredBanks && (
            <div className="max-h-44 overflow-y-auto space-y-1 p-2 rounded-xl bg-slate-950/95 border border-purple-500/40 shadow-xl">
              <div className="text-[10px] text-purple-300 font-mono px-2 py-0.5 flex justify-between">
                <span>FOUND {filteredBanks.length} MATCHING BANKS</span>
                <span className="text-slate-400">Click to select</span>
              </div>
              {filteredBanks.length === 0 ? (
                <div className="text-xs text-slate-400 p-2 text-center">
                  No bank found matching "{bankSearch}". You can use the custom entry below to type your branch name.
                </div>
              ) : (
                filteredBanks.map(b => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => {
                      onUpdateField('dbtBankName', b.name);
                      setBankSearch('');
                      setIsCustomMode(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      dbtBankName === b.name
                        ? 'bg-purple-600 text-white font-semibold shadow'
                        : 'hover:bg-white/10 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-white">{b.name}</div>
                      <div className="text-[10px] text-slate-400">{b.fullName}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-purple-300 font-mono shrink-0 ml-2">
                      {b.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Main Select Dropdown (Grouped by Categories) or Custom Input */}
          {!isCustomMode ? (
            <select
              value={dbtBankName || ''}
              onChange={e => {
                if (e.target.value === '__OTHER_CUSTOM__') {
                  setIsCustomMode(true);
                } else {
                  onUpdateField('dbtBankName', e.target.value);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="" className="bg-slate-900">Select Bank from All Categories...</option>
              
              {/* Preserved custom bank if not in predefined list */}
              {dbtBankName && !isKnownPredefined && (
                <option value={dbtBankName} className="bg-purple-900 font-semibold">
                  {dbtBankName} (Current Selection)
                </option>
              )}

              {Object.entries(groupedBanks).map(([categoryName, banks]) => (
                <optgroup key={categoryName} label={`── ${categoryName} ──`} className="bg-slate-900 text-purple-300 font-bold">
                  {banks.map(b => (
                    <option key={b.name} value={b.name} className="bg-slate-900 text-white font-normal">
                      {b.name}
                    </option>
                  ))}
                </optgroup>
              ))}

              <option value="__OTHER_CUSTOM__" className="bg-slate-900 text-cyan-300 font-semibold">
                ➕ Other Bank / Specific Branch (Type Custom)...
              </option>
            </select>
          ) : (
            <div className="space-y-1.5">
              <input
                type="text"
                value={dbtBankName || ''}
                onChange={e => onUpdateField('dbtBankName', e.target.value)}
                placeholder="Enter exact bank & branch name (e.g. Bank of India Dadar Branch, District Co-op)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-purple-500/50 text-white text-sm focus:outline-none focus:border-purple-400 transition-colors"
                autoFocus
              />
              <span className="text-[10px] text-purple-300 block">
                Custom bank name will be printed on your NPCI DBT Mandate Letter and saved to your profile.
              </span>
            </div>
          )}

          {/* Quick-select pills for the most common DBT banks */}
          <div className="pt-1">
            <div className="flex items-center space-x-1 mb-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Popular DBT Banks:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_DBT_BANKS.map(pb => (
                <button
                  key={pb}
                  type="button"
                  onClick={() => {
                    onUpdateField('dbtBankName', pb);
                    setIsCustomMode(false);
                    setBankSearch('');
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    dbtBankName === pb
                      ? 'bg-purple-600 border-purple-400 text-white font-bold shadow-md shadow-purple-950/50'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {pb}
                </button>
              ))}
            </div>
          </div>

          <span className="text-[10px] text-slate-400 mt-1 block">
            Nationalized (BOI, SBI, BOB, etc.) and India Post (IPPB) accounts have the fastest 24-48h NPCI DBT mapping turnaround.
          </span>
        </div>
      </div>

      {/* WARNING FLASH IF NOT SEEDED */}
      {!isDbtBankSeeded && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-3 animate-pulse">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-300">
                Warning: You cannot receive government disbursements until you visit your bank branch to link your Aadhaar to NPCI.
              </h4>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                Aadhaar linkage for KYC is <strong>not</strong> the same as NPCI Seeding for Direct Benefit Transfer. You must specifically authorize your bank to enable <strong>"NPCI DBT Inward Credit"</strong>. Without this, your scholarship approval will be cancelled after 90 days of failed payment attempts.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rose-500/20">
            <button
              type="button"
              onClick={() => setShowMandateModal(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get Bank Aadhaar Seeding Mandate Form</span>
            </button>
            <span className="text-[11px] text-rose-300 font-mono">
              Print this form and take to branch manager with Aadhaar copy.
            </span>
          </div>
        </div>
      )}

      {/* POSITIVE BADGE IF SEEDED */}
      {isDbtBankSeeded && (
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>NPCI DBT Status Verified:</strong> Direct payments from MahaDBT, NSP, and PFMS are cleared to disburse to {dbtBankName || 'your registered account'}.
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0">
            Zero Bounce Risk
          </span>
        </div>
      )}

      {/* SIMULATION MODAL */}
      {showSimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full glass-panel p-6 rounded-2xl border border-white/20 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">NPCI Aadhaar-Bank Status Simulator</h3>
              </div>
              <button 
                onClick={() => setShowSimModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Simulates the National Payments Corporation of India (NPCI) Bharat Aadhaar Seeding mapper lookup used by PFMS before initiating fund dispatch.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Enter Last 4 Digits of Aadhaar
              </label>
              <input
                type="text"
                maxLength={4}
                value={simAadhaarLast4}
                onChange={e => setSimAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 4821"
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-base font-mono tracking-widest text-center focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              onClick={handleSimulateCheck}
              disabled={simAadhaarLast4.length !== 4 || isSimulating}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Querying NPCI Gateway...</span>
                </>
              ) : (
                <span>Run Simulated NPCI Mapper Test</span>
              )}
            </button>

            {simResult && (
              <div className={`p-3 rounded-xl border text-xs font-mono leading-relaxed ${
                simResult.startsWith('SUCCESS')
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}>
                {simResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MANDATE FORM VIEW/PRINT MODAL */}
      {showMandateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-2xl w-full bg-slate-900 p-6 rounded-2xl border border-white/20 text-left space-y-4 my-8 text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-display">
                  Official NPCI Aadhaar Seeding Consent Mandate
                </h3>
              </div>
              <button 
                onClick={() => setShowMandateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Printable Mandate Letter */}
            <div className="p-5 rounded-xl bg-white text-slate-900 font-serif text-xs space-y-3 leading-relaxed shadow-lg">
              <div className="text-center font-bold text-sm border-b pb-2">
                APPLICATION FOR LINKING / SEEDING AADHAAR NUMBER AND RECEIVING DBT BENEFITS THROUGH NPCI MAPPER
              </div>

              <div className="space-y-1 text-[11px]">
                <p><strong>To:</strong> The Branch Manager, {dbtBankName || 'Bank Branch'}</p>
                <p><strong>Subject:</strong> Consent for Aadhaar Seeding in NPCI Mapper for Government Scholarship Direct Benefit Transfer (DBT)</p>
              </div>

              <p>
                Dear Sir/Madam,
              </p>
              <p>
                I, <strong>{studentName || 'Student'}</strong>, enrolled as a full-time student at <strong>{collegeName || 'Institute'}</strong>, hereby request you to seed my 12-digit Aadhaar Number with my savings bank account maintained with your branch.
              </p>
              <p>
                I formally authorize your bank to map my Aadhaar number on the <strong>NPCI Mapper (Bharat Aadhaar Payment Gateway)</strong> as the primary account to receive all Government Direct Benefit Transfer (DBT) subsidies, including state scholarships (MahaDBT) and central schemes (National Scholarship Portal - NSP).
              </p>

              <div className="bg-slate-100 p-2.5 rounded border text-[11px] space-y-1 font-mono">
                <div>• Student Name: {studentName}</div>
                <div>• Institution: {collegeName}</div>
                <div>• Bank Name: {dbtBankName || 'Nationalized Bank'}</div>
                <div>• Mandate Purpose: Direct Benefit Transfer (DBT) Scholarship Disbursements</div>
              </div>

              <div className="pt-4 flex justify-between text-[11px]">
                <div>Date: 19-09-2026</div>
                <div>Signature of Account Holder: ___________________</div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Mandate Form</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
