import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  FileCheck2, 
  ExternalLink, 
  X, 
  ArrowRight, 
  Sparkles, 
  KeyRound,
  FileText,
  BadgeCheck,
  Building2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerifiedCheckmark } from './VerifiedCheckmark';

interface DigiLockerDocCandidate {
  id: string; // Target student doc ID
  name: string;
  category: 'Identity' | 'Financial' | 'Academic' | 'Institutional';
  issuer: string;
  docId: string;
  docUri: string;
  issueDate: string;
  validUntil?: string;
  fileName: string;
  isSelected: boolean;
}

export const DigiLockerModal: React.FC = () => {
  const { isDigiLockerModalOpen, setIsDigiLockerModalOpen, connectDigiLocker, student } = useApp();

  const [authStep, setAuthStep] = useState<'LOGIN' | 'CONSENT' | 'SELECT_DOCS' | 'VERIFYING' | 'SUCCESS'>('LOGIN');
  const [aadhaarOrMobile, setAadhaarOrMobile] = useState('98765 43210');
  const [pin, setPin] = useState('••••••');
  const [otp, setOtp] = useState('654321');
  const [consentGiven, setConsentGiven] = useState(true);

  // Available issued documents in the DigiLocker repository for Aarav Patil
  const [availableDocs, setAvailableDocs] = useState<DigiLockerDocCandidate[]>([
    {
      id: 'doc-1',
      name: 'Aadhaar Card (UIDAI e-Aadhaar)',
      category: 'Identity',
      issuer: 'Unique Identification Authority of India (UIDAI)',
      docId: 'DL-UIDAI-AADHAAR-8942',
      docUri: 'in.gov.uidai-aadhaar-98124982',
      issueDate: '2022-03-15',
      fileName: 'e_aadhaar_verified_uidai.xml',
      isSelected: true
    },
    {
      id: 'doc-2',
      name: 'Annual Income Certificate (Tahsildar Barcoded FY 2026-27)',
      category: 'Financial',
      issuer: 'Revenue Dept, Govt of Maharashtra (MahaOnline e-District)',
      docId: 'DL-MH-REV-INC-2026-449102',
      docUri: 'in.gov.maharashtra.mahaonline-inc-2026-449102',
      issueDate: '2026-04-18',
      validUntil: '2027-03-31',
      fileName: 'maharashtra_income_cert_2026_tahsildar.pdf',
      isSelected: true
    },
    {
      id: 'doc-3',
      name: 'Certificate of Age, Nationality & Domicile',
      category: 'Identity',
      issuer: 'Executive Magistrate & Tehsildar, Maharashtra',
      docId: 'DL-MH-DOM-782103',
      docUri: 'in.gov.maharashtra.mahaonline-dom-782103',
      issueDate: '2023-06-10',
      fileName: 'domicile_certificate_maharashtra_gov.pdf',
      isSelected: true
    },
    {
      id: 'doc-4',
      name: 'Class XII (HSC) Marksheet & Passing Certificate',
      category: 'Academic',
      issuer: 'Maharashtra State Board of Secondary & Higher Secondary Education (MSBSHSE)',
      docId: 'DL-MSBSHSE-HSC-2024-9182',
      docUri: 'in.gov.msbshse-hsc-2024-9182',
      issueDate: '2024-05-25',
      fileName: 'msbshse_hsc_science_marksheet.pdf',
      isSelected: true
    },
    {
      id: 'doc-7',
      name: 'Academic Bank of Credits / SPPU Bonafide Record',
      category: 'Institutional',
      issuer: 'National Academic Depository (NAD) / Digilocker ABC ID',
      docId: 'DL-NAD-ABC-2026-8910',
      docUri: 'in.gov.nad-abc-sppu-2026-8910',
      issueDate: '2026-07-15',
      validUntil: '2027-06-30',
      fileName: 'sppu_collegiate_bonafide_abc_verified.pdf',
      isSelected: true
    },
    {
      id: 'doc-6',
      name: 'Aadhaar-Seeded DBT Account Mandate Confirmation',
      category: 'Financial',
      issuer: 'National Payments Corporation of India (NPCI) / SBI',
      docId: 'DL-NPCI-DBT-2026-0192',
      docUri: 'in.gov.npci-dbt-sbi-0192',
      issueDate: '2026-01-10',
      fileName: 'npci_dbt_seeding_certificate.pdf',
      isSelected: true
    }
  ]);

  if (!isDigiLockerModalOpen) return null;

  const toggleDocSelection = (docId: string) => {
    setAvailableDocs(prev => prev.map(d => d.id === docId ? { ...d, isSelected: !d.isSelected } : d));
  };

  const handleSelectAll = (select: boolean) => {
    setAvailableDocs(prev => prev.map(d => ({ ...d, isSelected: select })));
  };

  const handleStartImport = () => {
    setAuthStep('VERIFYING');
    setTimeout(() => {
      const selected = availableDocs.filter(d => d.isSelected);
      connectDigiLocker(selected.map(d => ({
        id: d.id,
        issuer: d.issuer,
        docUri: d.docUri,
        docId: d.docId,
        fileName: d.fileName,
        issueDate: d.issueDate,
        validUntil: d.validUntil
      })));
      setAuthStep('SUCCESS');
    }, 1200);
  };

  const handleClose = () => {
    setIsDigiLockerModalOpen(false);
    setAuthStep('LOGIN');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Official DigiLocker Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 px-6 py-4 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  NATIONAL E-GOVERNANCE DIVISION (NeGD)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  MeitY Govt. of India
                </span>
              </div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>DigiLocker Document Access & Verification</span>
              </h2>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">

          {/* STEP 1: LOGIN / MERIPEHCHAAN */}
          {authStep === 'LOGIN' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start space-x-3">
                <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200/90 leading-relaxed">
                  <strong className="text-white">Direct Verification:</strong> Fetch digitally signed, tamper-proof educational marksheets, domicile, and Tahsildar income certificates directly from government issuers. <strong>No manual scanning or document physical upload required.</strong>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Aadhaar Number or Registered Mobile Number
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={aadhaarOrMobile}
                      onChange={e => setAadhaarOrMobile(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="Enter 12-digit Aadhaar or 10-digit Mobile"
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
                      VERIFIED UIDAI
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      6-Digit DigiLocker Security PIN
                    </label>
                    <input 
                      type="password"
                      value={pin}
                      onChange={e => setPin(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="******"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      OTP (Sent to Aadhaar Mobile)
                    </label>
                    <input 
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="654321"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/5 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center space-x-1.5 font-semibold text-slate-300">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Privacy & Security Assurances</span>
                </div>
                <p>
                  Documents are accessed under Section 9A of the Information Technology Act. Digital documents fetched from DigiLocker are treated at par with original physical documents by all Central and State Scholarship scrutinies.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Connecting for: <strong className="text-white">{student.fullName}</strong>
                </span>
                <button
                  onClick={() => setAuthStep('CONSENT')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Authenticate via DigiLocker</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONSENT GRANT */}
          {authStep === 'CONSENT' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-white/10 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <KeyRound className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      scholarmatch-ai Application Consent Request
                    </h3>
                    <p className="text-xs text-slate-400">
                      Authorizing OAuth 2.0 PKCE access to your issued government document locker
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 space-y-2 text-xs text-slate-300">
                  <p className="font-semibold text-slate-200">The application will be permitted to:</p>
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
                    <li>Read your issued academic marksheets and degree certificates (MSBSHSE / SPPU / NAD).</li>
                    <li>Verify your current financial year Income Certificate issued by Tahsildar / MahaOnline.</li>
                    <li>Check your Aadhaar profile and Domicile Certificate for scholarship eligibility.</li>
                    <li>Verify DBT bank account seeding status from NPCI registry.</li>
                  </ul>
                </div>
              </div>

              <label className="flex items-start space-x-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={consentGiven}
                  onChange={e => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded border-emerald-500/50 text-emerald-600 focus:ring-0"
                />
                <span className="text-xs text-emerald-200">
                  I hereby provide my free and informed consent under the Digital Personal Data Protection (DPDP) Act to share only the minimum required educational and eligibility documents with scholarmatch-ai for scholarship verification.
                </span>
              </label>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setAuthStep('LOGIN')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  disabled={!consentGiven}
                  onClick={() => setAuthStep('SELECT_DOCS')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    consentGiven
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-lg shadow-emerald-950'
                      : 'bg-white/10 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Grant Consent & View Documents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT AVAILABLE DOCUMENTS */}
          {authStep === 'SELECT_DOCS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Select Documents Available in Your DigiLocker
                  </h3>
                  <p className="text-xs text-slate-400">
                    {availableDocs.filter(d => d.isSelected).length} of {availableDocs.length} documents selected for instant verification
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <button 
                    onClick={() => handleSelectAll(true)}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    Select All
                  </button>
                  <span className="text-slate-600">•</span>
                  <button 
                    onClick={() => handleSelectAll(false)}
                    className="text-slate-400 hover:underline font-semibold"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {availableDocs.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => toggleDocSelection(doc.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      doc.isSelected 
                        ? 'bg-emerald-950/30 border-emerald-500/40 shadow-sm shadow-emerald-950' 
                        : 'bg-white/5 border-white/5 hover:border-white/10 opacity-70'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        checked={doc.isSelected}
                        onChange={() => {}} // Handled by parent div
                        className="mt-1 rounded border-emerald-500/50 text-emerald-600 focus:ring-0 cursor-pointer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-white">
                            {doc.name}
                          </h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                            {doc.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>Issuer: {doc.issuer}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-500">
                          <span>URI: {doc.docUri}</span>
                          <span>Issued: {doc.issueDate}</span>
                          {doc.validUntil && <span className="text-emerald-400">Valid Until: {doc.validUntil}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center space-x-1 text-emerald-400 text-xs font-mono">
                      <BadgeCheck className="w-4 h-4" />
                      <span className="text-[11px]">Official</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-start space-x-2 text-xs text-blue-200">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>No manual upload required:</strong> Once imported via DigiLocker, these documents are cryptographically verified and satisfy all scrutiny guidelines automatically.
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setAuthStep('CONSENT')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  disabled={availableDocs.filter(d => d.isSelected).length === 0}
                  onClick={handleStartImport}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950 flex items-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Verify & Import ({availableDocs.filter(d => d.isSelected).length}) Documents</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: VERIFYING ANIMATION */}
          {authStep === 'VERIFYING' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center animate-pulse">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Verifying with DigiLocker National Repository...
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Fetching PKI digital certificates, validating XML signatures, and generating audit-ready verification stamps for scholarship scrutiny officers.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {authStep === 'SUCCESS' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-5">
              <div className="flex items-center justify-center">
                <VerifiedCheckmark size="lg" showGlow={true} />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  OFFICIAL DIGILOCKER VERIFICATION COMPLETE
                </span>
                <h3 className="text-xl font-bold text-white">
                  Documents Successfully Verified & Synced!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your educational certificates, domicile, and Tahsildar income certificate have been authenticated directly from government repositories. Manual upload is no longer required for these documents.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-left max-w-md w-full space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">DigiLocker ID:</span>
                  <span className="text-emerald-400 font-mono font-bold">DL-MH-2026-9814</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-white font-semibold flex items-center space-x-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified via DigiLocker</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scrutiny Exemption:</span>
                  <span className="text-cyan-300 font-mono">100% Pre-Audited</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950 cursor-pointer"
              >
                Return to Document Locker
              </button>
            </div>
          )}

        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>National e-Governance Division (NeGD) • Ministry of Electronics & IT</span>
          <span className="text-emerald-400">OAuth 2.0 PKCE Secure</span>
        </div>

      </div>
    </div>
  );
};
