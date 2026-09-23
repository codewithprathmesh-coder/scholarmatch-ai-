import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck, 
  FileText, 
  UploadCloud, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  Info,
  Layers,
  Calendar,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  BadgeCheck,
  Sparkles,
  Lock,
  Building2,
  RefreshCw,
  Check,
  ArrowLeft
} from 'lucide-react';
import { StudentDocument } from '../../types';
import { evaluateDocumentValidity, auditAllStudentDocuments } from '../../algorithms/validityScanner';
import { DigiLockerModal } from './DigiLockerModal';
import { VerifiedCheckmark, DigiLockerSuccessToast } from './VerifiedCheckmark';

export const DocumentsView: React.FC = () => {
  const { 
    student, 
    setStudent, 
    uploadDocument, 
    deleteDocument,
    setIsDigiLockerModalOpen,
    verifySingleDocViaDigiLocker,
    disconnectDigiLocker,
    recentlyVerifiedDocIds,
    clearRecentlyVerifiedDoc,
    goBack
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ready' | 'missing' | 'expired' | 'digilocker'>('all');
  const [retrievingDocId, setRetrievingDocId] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<{
    docName: string;
    issuer?: string;
    docId?: string;
  } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Sync toast notification if bulk imported via DigiLockerModal
  useEffect(() => {
    if (recentlyVerifiedDocIds.length > 0 && !toastNotification && !retrievingDocId) {
      const lastId = recentlyVerifiedDocIds[recentlyVerifiedDocIds.length - 1];
      const doc = student.documents.find(d => d.id === lastId);
      if (doc) {
        setToastNotification({
          docName: recentlyVerifiedDocIds.length > 1 
            ? `${recentlyVerifiedDocIds.length} Certificates Verified` 
            : doc.name,
          issuer: doc.digiLockerIssuer || 'National Academic Depository / UIDAI',
          docId: lastId
        });
      }
    }
  }, [recentlyVerifiedDocIds]);

  const handleDigiLockerFetch = (doc: StudentDocument) => {
    setRetrievingDocId(doc.id);
    setTimeout(() => {
      verifySingleDocViaDigiLocker(doc.id);
      setRetrievingDocId(null);
      setToastNotification({
        docName: doc.name,
        issuer: doc.name.includes('Income') ? 'Revenue Department, Govt of Maharashtra' :
                doc.name.includes('Aadhaar') ? 'Unique Identification Authority of India (UIDAI)' :
                doc.name.includes('Marksheet') ? 'Maharashtra State Board of Secondary & Higher Secondary Education' :
                doc.name.includes('Domicile') ? 'Executive Magistrate, Maharashtra' :
                'National Academic Depository (NAD)',
        docId: doc.id
      });
    }, 650);
  };

  const auditReport = auditAllStudentDocuments(student.documents);
  const readyDocs = student.documents.filter(d => d.status === 'ready');
  const missingDocs = student.documents.filter(d => d.status === 'missing');
  const digiLockerDocs = student.documents.filter(d => d.isDigiLockerVerified || d.verifiedVia === 'DIGILOCKER');
  const completenessPercent = Math.round((readyDocs.length / student.documents.length) * 100);

  const handleFileUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadDocument(docId, e.target.files[0]);
    }
  };

  const handleUpdateDocDate = (docId: string, field: 'issueDate' | 'validUntil', value: string) => {
    setStudent(prev => ({
      ...prev,
      documents: prev.documents.map(d => {
        if (d.id === docId) {
          const updatedDoc = { ...d, [field]: value };
          const validity = evaluateDocumentValidity(updatedDoc);
          return {
            ...updatedDoc,
            validityStatus: validity.status,
            validityMessage: validity.warningMessage || validity.actionRequired || validity.validityPolicy,
            financialYear: validity.financialYear
          };
        }
        return d;
      })
    }));
  };

  const filteredDocs = student.documents.filter(d => {
    const val = evaluateDocumentValidity(d);
    if (selectedFilter === 'ready') return d.status === 'ready' && val.status !== 'EXPIRED';
    if (selectedFilter === 'missing') return d.status === 'missing';
    if (selectedFilter === 'expired') return val.status === 'EXPIRED';
    if (selectedFilter === 'digilocker') return d.isDigiLockerVerified || d.verifiedVia === 'DIGILOCKER';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* DigiLocker Auth & Import Modal */}
      <DigiLockerModal />

      {/* Header with Prominent DigiLocker Button */}
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
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
              DOCUMENT READINESS & VALIDITY SCANNER
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              FY 2026-27 Audit Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
            Document Locker & Expiry Pre-Check
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access verified educational and eligibility documents directly via <strong>DigiLocker</strong>, or upload physical certificates with automated FY 2026-27 expiry pre-checks.
          </p>
        </div>

        {/* Primary Action: Access Documents via DigiLocker */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsDigiLockerModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950 flex items-center space-x-2.5 cursor-pointer border border-emerald-400/40"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Access Documents via DigiLocker</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-emerald-100 uppercase">
              Govt. Verified
            </span>
          </button>
        </div>
      </div>

      {/* DigiLocker Integration Showcase Banner */}
      <div className={`p-5 rounded-2xl border transition-all ${
        student.isDigiLockerConnected 
          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30 border-emerald-500/30'
          : 'bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border-emerald-500/20'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
              <BadgeCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  DIGILOCKER NATIONAL DEPOSITORY INTEGRATION
                </span>
                {student.isDigiLockerConnected ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>CONNECTED ({student.digiLockerId || 'DL-MH-2026-9814'})</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-400 border border-white/10">
                    NOT CONNECTED
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white">
                {student.isDigiLockerConnected 
                  ? `${digiLockerDocs.length} Government-Issued Documents Authenticated & Pre-Audited`
                  : 'Skip Manual Uploads — Pull Verified Documents in 1-Click via DigiLocker'}
              </h3>
              <p className="text-xs text-slate-300/90 leading-relaxed max-w-3xl">
                {student.isDigiLockerConnected
                  ? 'Your educational marksheets, domicile, and Tahsildar income certificate are cryptographically verified through DigiLocker. These tamper-proof records prevent scrutiny rejections across MahaDBT and NSP.'
                  : 'National Scholarship Portal (NSP) and State DBT portals accept DigiLocker digitally signed certificates at par with physical originals (under IT Act Section 9A). Access your documents directly without manual scanning.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            {student.isDigiLockerConnected ? (
              <>
                <button
                  onClick={() => setIsDigiLockerModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync More Documents</span>
                </button>
                <button
                  onClick={disconnectDigiLocker}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Disconnect DigiLocker Account"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsDigiLockerModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950 flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Connect DigiLocker Account</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 bg-white/5 p-1.5 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Docs ({student.documents.length})
          </button>
          <button
            onClick={() => setSelectedFilter('digilocker')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
              selectedFilter === 'digilocker' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified via DigiLocker ({digiLockerDocs.length})</span>
          </button>
          <button
            onClick={() => setSelectedFilter('ready')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'ready' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Valid FY 26-27 ({readyDocs.length - auditReport.expiredCount})
          </button>
          <button
            onClick={() => setSelectedFilter('expired')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'expired' ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-white'
            }`}
          >
            Expired / Invalid ({auditReport.expiredCount})
          </button>
          <button
            onClick={() => setSelectedFilter('missing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'missing' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Missing ({missingDocs.length})
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-white font-bold">{filteredDocs.length}</span> of {student.documents.length} repository files
        </div>
      </div>

      {/* Expiry Warning Flash Banner (If any document is expired) */}
      {auditReport.expiredCount > 0 && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/50 space-y-3 shadow-xl">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-rose-300">
                CRITICAL WARNING: {auditReport.expiredCount} Document(s) Expired or From Previous Financial Year!
              </h3>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                MahaDBT and National Scholarship Portal (NSP) strictly mandate that Income Certificates for Academic Year 2026-27 must be issued <strong>on or after 1st April 2026</strong>. Submitting previous year certificates results in permanent rejection at the Scrutiny Officer desk.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 pt-1 border-t border-rose-500/20 text-xs">
            <button
              onClick={() => setIsDigiLockerModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Fetch Valid FY 2026-27 Certificate from DigiLocker</span>
            </button>
            <a
              href="https://aaplesarkar.mahaonline.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-rose-600/60 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <span>Renew on Aaple Sarkar Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Readiness Overview Bar */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 glow-purple">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
              PORTAL READINESS AUDIT
            </span>
            <h3 className="text-lg font-bold text-white">
              {completenessPercent}% Documents Ready ({readyDocs.length} of {student.documents.length})
            </h3>
          </div>
          <div className="text-xs text-slate-300 font-mono flex items-center space-x-3">
            <span className="text-emerald-400 font-bold">✓ {digiLockerDocs.length} DigiLocker Verified</span>
            <span>•</span>
            <span className="text-cyan-300">{auditReport.validCount} Valid FY 26-27</span>
            <span>•</span>
            <span className="text-amber-400">{missingDocs.length} Missing</span>
          </div>
        </div>

        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${completenessPercent}%` }}
          />
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>Official Rule: Digital certificates fetched through DigiLocker carry legal validity under Section 9A of the IT Act.</span>
          <span className="text-emerald-400 font-semibold">
            Target Academic Cycle: 2026-2027
          </span>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDocs.map(doc => {
          const isReady = doc.status === 'ready';
          const isDigiLocker = doc.isDigiLockerVerified || doc.verifiedVia === 'DIGILOCKER';
          const isJustVerified = recentlyVerifiedDocIds.includes(doc.id);
          const validity = evaluateDocumentValidity(doc);
          const isExpired = validity.status === 'EXPIRED';

          return (
            <motion.div 
              key={doc.id}
              layout
              initial={isJustVerified ? { scale: 0.98 } : false}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              className={`p-5 rounded-2xl glass-panel border transition-all flex flex-col justify-between space-y-4 ${
                isExpired
                  ? 'border-rose-500/60 bg-rose-950/20 shadow-lg shadow-rose-950/30'
                  : isJustVerified
                  ? 'border-emerald-400/90 bg-emerald-950/30 shadow-xl shadow-emerald-950/50 ring-1 ring-emerald-400/50'
                  : isDigiLocker
                  ? 'border-emerald-500/40 bg-emerald-950/20 shadow-md shadow-emerald-950/20'
                  : isReady 
                  ? 'border-blue-500/30 bg-blue-950/10' 
                  : 'border-white/10 hover:border-purple-500/30'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isExpired ? 'bg-rose-500/20 text-rose-400' :
                      isDigiLocker ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      isReady ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-slate-400'
                    }`}>
                      {isExpired ? (
                        <ShieldAlert className="w-5 h-5 text-rose-400" />
                      ) : isDigiLocker ? (
                        <VerifiedCheckmark size="sm" showGlow={isJustVerified} />
                      ) : isReady ? (
                        <FileCheck className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white leading-snug">
                          {doc.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                        <span>{doc.category} Document</span>
                        {isDigiLocker && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-mono font-medium flex items-center space-x-1">
                              <span>DigiLocker Verified</span>
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    {isDigiLocker ? (
                      <motion.span 
                        initial={isJustVerified ? { scale: 0.8, opacity: 0 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 20 }}
                        className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase shrink-0 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 shadow-sm"
                      >
                        <VerifiedCheckmark size="xs" showGlow={false} />
                        <span>Verified via DigiLocker</span>
                      </motion.span>
                    ) : (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                        isExpired ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' :
                        isReady ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isExpired ? 'EXPIRED' : doc.status}
                      </span>
                    )}

                    {doc.financialYear && (
                      <span className="text-[10px] font-mono text-slate-400">
                        FY: {doc.financialYear}
                      </span>
                    )}
                  </div>
                </div>

                {/* Newly Verified Subtle Callout Banner */}
                {isDigiLocker && isJustVerified && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                    className="mt-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-950/60 via-emerald-900/40 to-slate-900 border border-emerald-400/50 flex items-center justify-between text-xs text-emerald-200 shadow-md"
                  >
                    <div className="flex items-center space-x-2">
                      <VerifiedCheckmark size="xs" showGlow={true} />
                      <span className="font-semibold text-emerald-300 text-[11px]">
                        Successfully retrieved & cryptographically verified
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400/80 uppercase">
                      Audit Approved
                    </span>
                  </motion.div>
                )}

                {/* DigiLocker Verified Details Box */}
                {isDigiLocker ? (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 font-semibold text-emerald-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Cryptographically Authenticated</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-300/80">
                        {doc.digiLockerDocId || 'DL-CERT-VERIFIED'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-[11px] text-slate-300">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">
                        Issuer: {doc.digiLockerIssuer || (doc.name.includes('Income') ? 'Revenue Department, Govt of Maharashtra' : 'Authorized Government Issuer')}
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-emerald-500/20 flex items-center justify-between text-[10px] font-mono text-emerald-300/90">
                      <span>✓ No manual upload required</span>
                      <span>100% Scrutiny Exemption</span>
                    </div>
                  </div>
                ) : isReady && (
                  /* Standard Manual Upload Validity Feedback Banner */
                  <div className={`p-2.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                    isExpired
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      : 'bg-black/30 border-white/5 text-slate-300'
                  }`}>
                    <div className="flex items-center space-x-1.5 font-semibold">
                      {isExpired ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      <span>{validity.warningMessage || validity.actionRequired || validity.validityPolicy}</span>
                    </div>

                    {/* Date Input Controls */}
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10 text-[11px]">
                      <div>
                        <label className="block text-[10px] text-slate-400">Issue Date:</label>
                        <input
                          type="date"
                          value={doc.issueDate || ''}
                          onChange={e => handleUpdateDocDate(doc.id, 'issueDate', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-black/50 border border-white/10 text-white text-[11px] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400">Valid Until:</label>
                        <input
                          type="date"
                          value={doc.validUntil || ''}
                          onChange={e => handleUpdateDocDate(doc.id, 'validUntil', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-black/50 border border-white/10 text-white text-[11px] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isReady && doc.fileName && (
                  <div className="mt-3 p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="truncate mr-2">{doc.fileName}</span>
                    <span className="text-slate-400 shrink-0">{doc.fileSize}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons & Fallback */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {isDigiLocker ? 'Verified via DigiLocker' : doc.name.includes('Income') ? 'Mandatory Annual Renewal' : 'Official Certificate'}
                </span>

                <div className="flex items-center space-x-2">
                  {isReady ? (
                    <div className="flex items-center space-x-1.5">
                      {!isDigiLocker && (
                        <button
                          onClick={() => handleDigiLockerFetch(doc)}
                          disabled={retrievingDocId === doc.id}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all flex items-center space-x-1 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                          title="Authenticate via DigiLocker instead"
                        >
                          {retrievingDocId === doc.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                              <span>Retrieving...</span>
                            </>
                          ) : (
                            <>
                              <BadgeCheck className="w-3.5 h-3.5" />
                              <span>Link to DigiLocker</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* Missing Document Actions: Primary DigiLocker Fetch + Fallback Manual Upload */
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDigiLockerFetch(doc)}
                        disabled={retrievingDocId === doc.id}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950 flex items-center space-x-1.5 cursor-pointer disabled:opacity-80 disabled:cursor-wait"
                      >
                        {retrievingDocId === doc.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-100" />
                            <span>Retrieving from DigiLocker...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                            <span>Fetch via DigiLocker</span>
                          </>
                        )}
                      </button>

                      {/* Manual Upload Fallback */}
                      <label className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 cursor-pointer flex items-center space-x-1.5 transition-all">
                        <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                        <span>Upload Manually</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={e => handleFileUpload(doc.id, e)} 
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* Floating DigiLocker Verified Animated Notification Toast */}
      <DigiLockerSuccessToast
        notification={toastNotification}
        onClose={() => setToastNotification(null)}
      />

    </div>
  );
};
