import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Mail, 
  Copy, 
  ExternalLink, 
  Download, 
  Send, 
  Building2, 
  Sparkles, 
  Bell, 
  ChevronRight,
  ShieldCheck,
  FileText,
  HelpCircle,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { ActiveSchemeItem } from '../../types';

export const ActiveWalletRenewalsView: React.FC = () => {
  const { student, updateStudentField, setActiveTab, scholarships, goBack } = useApp();
  const [selectedSchemeForNudge, setSelectedSchemeForNudge] = useState<ActiveSchemeItem | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const walletSchemes = student.activeWalletSchemes || [];

  const handleCopyEmail = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleAddAppliedScheme = (scholarshipId: string) => {
    const sc = scholarships.find(s => s.id === scholarshipId);
    if (!sc) return;

    const newItem: ActiveSchemeItem = {
      id: `active-${Date.now()}`,
      scholarshipId: sc.id,
      scholarshipName: sc.name,
      provider: sc.provider,
      providerType: sc.providerType,
      applicationId: `APP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      awardAmount: sc.awardAmount,
      appliedDate: '2026-09-15',
      academicYear: `${student.yearOfStudy}th Year (2026-27)`,
      currentStatus: 'PENDING_INSTITUTE_VERIFICATION',
      instituteDeadline: '2026-10-06',
      daysToInstituteDeadline: 5,
      expectedRenewalDate: '2027-08-01',
      daysToRenewal: 315,
      renewalMinPercentage: sc.minAcademicPercentage || 50,
      renewalMinAttendance: 75,
      nodalOfficerName: 'College Scholarship Incharge',
      nodalOfficerEmail: 'scholarship.desk@college.edu.in',
      nodalOfficerPhone: '+91 22 2400 0000'
    };

    const updated = [...walletSchemes, newItem];
    updateStudentField('wallet', 'activeWalletSchemes', updated);
    setShowAddModal(false);
  };

  const generateGoogleCalendarUrl = (item: ActiveSchemeItem) => {
    const title = encodeURIComponent(`Scholarship Renewal Window Open: ${item.scholarshipName}`);
    const details = encodeURIComponent(
      `Reminder to submit Renewal Application for ${item.scholarshipName}.\nApplication ID: ${item.applicationId}\nRequirements: Min ${item.renewalMinPercentage}% Marks, 75% Attendance.`
    );
    const dateStr = item.expectedRenewalDate.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateStr}/${dateStr}`;
  };

  const generateNudgeEmailBody = (item: ActiveSchemeItem) => {
    return `Respected Sir/Madam (${item.nodalOfficerName || 'Scholarship Nodal Officer'}),

I am ${student.fullName}, studying in ${student.course} (${student.yearOfStudy}th Year) at ${student.collegeName}.

I have successfully submitted my online application for "${item.scholarshipName}" under Application ID: ${item.applicationId}.

According to the state portal guidelines, the Institute-level verification cutoff deadline is ${item.instituteDeadline} (${item.daysToInstituteDeadline} days remaining). Currently, the portal status displays "Pending at Institute Desk".

May I kindly request you to review and verify my submitted application and uploaded documents at the earliest to prevent automatic cancellation before the state cutoff?

Application Summary:
• Student Name: ${student.fullName}
• College PRN / Roll No: 2024-ENG-082
• Application ID: ${item.applicationId}
• Scheme Name: ${item.scholarshipName}
• Institute Deadline: ${item.instituteDeadline}

Thank you for your valuable support.

Sincerely,
${student.fullName}
${student.collegeName}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-purple-500/30 glow-purple">
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
              RETENTION & RENEWAL ENGINE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
            Active Schemes Wallet & "Year 2" Renewal Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Securing a scholarship is only half the battle. Track multi-year disbursements, automated renewal windows, and Nodal Officer verification deadlines.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Applied Scheme</span>
          </button>
        </div>
      </div>

      {/* WALLET CARDS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {walletSchemes.map(item => {
          const isUrgentNudge = item.currentStatus === 'PENDING_INSTITUTE_VERIFICATION' && item.daysToInstituteDeadline <= 5;
          const isRenewalDue = item.currentStatus === 'RENEWAL_DUE' || item.daysToRenewal <= 30;

          return (
            <div 
              key={item.id}
              className={`p-6 rounded-2xl glass-panel border space-y-5 transition-all relative overflow-hidden ${
                isUrgentNudge 
                  ? 'border-amber-500/50 shadow-lg shadow-amber-950/20'
                  : 'border-white/10'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      {item.academicYear}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      item.currentStatus === 'DISBURSED'
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                        : item.currentStatus === 'RENEWAL_DUE'
                        ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300 animate-pulse'
                        : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                    }`}>
                      {item.currentStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {item.scholarshipName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {item.provider} • ID: <span className="font-mono text-cyan-300">{item.applicationId}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 block font-mono">Disbursement</span>
                  <span className="text-lg font-extrabold text-white font-mono">
                    ₹{item.awardAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* RENEWAL TRACKER MODULE */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Year {student.yearOfStudy + 1} Renewal Window Countdown</span>
                  </div>
                  <span className="font-mono text-white text-[11px]">
                    Expected: {item.expectedRenewalDate}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Min. Marks Criteria:</span>
                    <span className="font-bold text-white">{item.renewalMinPercentage}% (Clear All Subjects)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Min. Attendance:</span>
                    <span className="font-bold text-white">{item.renewalMinAttendance}% Mandatory</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <a
                    href={generateGoogleCalendarUrl(item)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-300 hover:text-white flex items-center space-x-1.5 font-medium transition-colors text-[11px]"
                  >
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>Add Renewal Alert to Google Calendar</span>
                  </a>

                  <span className="text-[11px] font-mono text-slate-400">
                    {item.daysToRenewal > 0 ? `${item.daysToRenewal} Days Left` : 'Active Window!'}
                  </span>
                </div>
              </div>

              {/* AUTOMATED NODAL OFFICER NUDGE (If Pending Verification) */}
              {item.currentStatus === 'PENDING_INSTITUTE_VERIFICATION' && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-amber-300">
                          Verification Cutoff in {item.daysToInstituteDeadline} Days ({item.instituteDeadline})
                        </h4>
                        <p className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
                          Status: Pending at College Nodal Officer desk. If not approved before deadline, application gets rejected.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-amber-500/20">
                    <div className="text-[11px] text-slate-300">
                      Nodal Officer: <span className="text-white font-medium">{item.nodalOfficerName}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedSchemeForNudge(item)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Nodal Officer Nudge</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {walletSchemes.length === 0 && (
        <div className="p-12 rounded-3xl glass-panel border border-white/10 text-center space-y-4">
          <Wallet className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Scholarship Wallet is Empty</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Once you apply for scholarships, add them here to monitor multi-year renewals and trigger automated college administrative nudges.
          </p>
          <button
            onClick={() => setActiveTab('discover')}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
          >
            Find Eligible Scholarships
          </button>
        </div>
      )}

      {/* NODAL OFFICER NUDGE MODAL */}
      {selectedSchemeForNudge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-xl w-full bg-slate-900 p-6 rounded-2xl border border-white/20 text-left space-y-4 my-8 text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-display">
                  Automated Nodal Officer Verification Nudge
                </h3>
              </div>
              <button 
                onClick={() => setSelectedSchemeForNudge(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Pre-formatted, respectful formal communication containing your exact Application ID, Scheme Title, and state verification cutoff deadline to prompt desk approval.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px] text-slate-300">
                <strong>Recipient:</strong> {selectedSchemeForNudge.nodalOfficerEmail || 'scholarships@college.edu.in'} ({selectedSchemeForNudge.nodalOfficerName})
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/15 font-mono text-xs whitespace-pre-line text-slate-200 leading-relaxed max-h-72 overflow-y-auto select-all">
                {generateNudgeEmailBody(selectedSchemeForNudge)}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleCopyEmail(generateNudgeEmailBody(selectedSchemeForNudge))}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Email Template'}</span>
              </button>

              <a
                href={`mailto:${selectedSchemeForNudge.nodalOfficerEmail || 'scholarship.desk@college.edu.in'}?subject=${encodeURIComponent(`URGENT: Request for Institute Verification of Scholarship Application [${selectedSchemeForNudge.applicationId}]`)}&body=${encodeURIComponent(generateNudgeEmailBody(selectedSchemeForNudge))}`}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-md shadow-amber-950/40"
              >
                <Send className="w-4 h-4" />
                <span>Open in Mail Client</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ADD SCHOLARSHIP MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full glass-panel p-6 rounded-2xl border border-white/20 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Add Applied Scholarship to Wallet</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {scholarships.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleAddAppliedScheme(s.id)}
                  className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">{s.name}</span>
                    <span className="text-[11px] text-slate-400">{s.provider} • ₹{s.awardAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <Plus className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
