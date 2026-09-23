import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  AlertOctagon, 
  Calendar, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  Plus,
  Check,
  Award,
  BookOpen,
  Sparkles,
  Lock,
  BadgeCheck,
  Building2,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';
import { TrafficLightBadge } from '../common/TrafficLightBadge';

export const ScholarshipDetailsModal: React.FC = () => {
  const { 
    inspectScholarship, 
    setInspectScholarship, 
    getEligibilityFor, 
    addToRoute, 
    removeFromRoute, 
    selectedScholarshipIds,
    scholarships,
    student,
    rules
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'documents' | 'rules' | 'conflicts' | 'apply'>('eligibility');

  if (!inspectScholarship) return null;

  const s = inspectScholarship;
  const el = getEligibilityFor(s);
  const isSelected = selectedScholarshipIds.includes(s.id);

  const officialUrl = s.officialPortalUrl || s.portalUrl;
  const portalName = s.officialPortalName || s.provider;

  // Check if s conflicts with any already selected scholarship
  const conflictingWith = selectedScholarshipIds
    .filter(id => s.conflictingScholarshipIds.includes(id))
    .map(id => scholarships.find(item => item.id === id))
    .filter(Boolean);

  const hasConflict = conflictingWith.length > 0;

  // Check course / field match with student
  const studentCourse = (student.course || '').toLowerCase();
  const isDirectFieldMatch = s.fieldsOfStudy && s.fieldsOfStudy.some(f => {
    const fn = f.toLowerCase();
    if (studentCourse.includes('artificial intelligence') || studentCourse.includes('ai & ds')) {
      return fn.includes('artificial intelligence') || fn.includes('ai & ds') || fn.includes('stem') || fn.includes('engineering');
    }
    return studentCourse.includes(fn) || fn.includes(studentCourse);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl glass-panel border border-purple-500/30 shadow-2xl relative overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between bg-[#0a0d16]/90 shrink-0">
          <div className="space-y-1 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                {s.providerType.replace('_', ' ')}
              </span>
              <TrafficLightBadge status={hasConflict ? 'CONFLICT' : 'SAFE'} size="sm" />
              <span className="text-[11px] text-slate-400 font-mono">Code: {s.code}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display leading-tight">
              {s.name}
            </h2>
            <p className="text-xs text-slate-400">
              {s.provider} • {s.state}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setInspectScholarship(null)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors text-xs font-semibold cursor-pointer"
              title="Back to Scholarships"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setInspectScholarship(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-white/10 bg-[#080b12] overflow-x-auto shrink-0">
          {[
            { id: 'eligibility', label: 'Eligibility Score' },
            { id: 'overview', label: 'Overview' },
            { id: 'documents', label: 'Documents Checklist' },
            { id: 'conflicts', label: 'Exclusivity & Conflicts' },
            { id: 'rules', label: 'Official Rules' },
            { id: 'apply', label: 'How to Apply' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-purple-400 text-purple-300 bg-purple-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          
          {/* TAB 1: ELIGIBILITY ENGINE (Section 9) */}
          {activeTab === 'eligibility' && (
            <div className="space-y-5">
              
              {/* Overall Score Card */}
              <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-purple-400 uppercase font-semibold">
                    ELIGIBILITY ENGINE ANALYSIS
                  </span>
                  <div className="text-3xl font-extrabold text-white font-display mt-0.5">
                    {el.score}% Match
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {el.summary}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full uppercase ${
                    el.status === 'ELIGIBLE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    el.status === 'PARTIALLY_ELIGIBLE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {el.status}
                  </span>
                </div>
              </div>

              {/* Individual Checks Table */}
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Individual Parameter Verification
              </h4>

              <div className="space-y-2.5">
                {el.checks.map((c, i) => {
                  const isPass = c.status === 'PASS';
                  const isWarn = c.status === 'WARNING';
                  const isFail = c.status === 'FAIL';

                  return (
                    <div 
                      key={i}
                      className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isPass ? 'bg-emerald-500/5 border-emerald-500/20' :
                        isWarn ? 'bg-amber-500/5 border-amber-500/20' :
                        'bg-rose-500/5 border-rose-500/20'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {isWarn && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                          {isFail && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                          <span className="font-semibold text-white">{c.criteria}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                          {c.message}
                        </p>
                      </div>

                      <div className="text-right shrink-0 pl-6 sm:pl-0 font-mono text-[11px]">
                        <div className="text-slate-400">Required: <span className="text-slate-200">{c.required}</span></div>
                        <div className="text-slate-400">Student: <span className="text-cyan-300 font-bold">{c.studentValue}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs">
              
              {/* Field of Study Priority Match Banner */}
              {s.fieldsOfStudy && (
                <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
                  isDirectFieldMatch 
                    ? 'bg-purple-950/40 border-purple-500/40' 
                    : 'bg-white/5 border-white/10'
                }`}>
                  <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">Target Discipline / Field of Study</span>
                      {isDirectFieldMatch && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          🎯 Priority Match for {student.course}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {s.fieldMatchReason || `Designated for students pursuing ${s.fieldsOfStudy.join(', ')}.`}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {s.fieldsOfStudy.map((f, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 font-mono">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-slate-200 text-sm mb-1">Description</h4>
                <p className="text-slate-300 leading-relaxed">{s.description}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="font-semibold text-purple-300 text-sm">Award & Support Breakdown</h4>
                <p className="text-white font-medium text-sm">{s.benefits}</p>
                <p className="text-slate-400">Approx. Direct Support: <strong className="text-white font-mono">₹{s.awardAmount.toLocaleString('en-IN')} / {s.awardFrequency}</strong></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block mb-1">Target Disciplines</span>
                  <span className="text-white font-medium">{s.courseEligibility.join(', ')}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block mb-1">Eligible Categories</span>
                  <span className="text-white font-medium">{s.categoryEligibility.join(', ')}</span>
                </div>
              </div>

              {/* Direct Official Link Info Card */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-xs">
                      <BadgeCheck className="w-4 h-4" />
                      <span>Dedicated Scheme Page • Official Application</span>
                    </div>
                    <p className="text-white font-medium text-xs">
                      {s.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                      <span>Portal: <strong className="text-emerald-300">{portalName}</strong></span>
                      {s.directSchemeCode && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                          {s.directSchemeCode}
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shrink-0 transition-all shadow-md shadow-emerald-950 cursor-pointer"
                    title={`Open official page for ${s.name}`}
                  >
                    <span>Apply on Official Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-[10px] text-emerald-400/80 font-mono break-all pt-1 border-t border-emerald-500/20">
                  Target Deep-Link: {officialUrl}
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: DOCUMENTS CHECKLIST */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300 mb-3">
                Mandatory documents required to complete institutional verification for this scheme:
              </p>
              {s.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium">{doc}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/20 text-emerald-300">
                    MANDATORY
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CONFLICTS & EXCLUSIVITY */}
          {activeTab === 'conflicts' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  <span>Configured Mutual-Exclusivity Restrictions</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  These schemes CANNOT be combined with {s.name} under administrative rules:
                </p>
              </div>

              <div className="space-y-2.5">
                {s.conflictingScholarshipIds.map(conflictId => {
                  const conflictingScheme = scholarships.find(item => item.id === conflictId);
                  const isCurrentlyInRoute = selectedScholarshipIds.includes(conflictId);

                  return (
                    <div 
                      key={conflictId}
                      className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                        isCurrentlyInRoute 
                          ? 'bg-rose-500/20 border-rose-500/40 text-white' 
                          : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-white block">
                          {conflictingScheme?.name || conflictId}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {conflictingScheme?.provider}
                        </span>
                      </div>

                      {isCurrentlyInRoute ? (
                        <span className="text-[10px] font-mono px-2 py-1 rounded bg-rose-500/40 text-rose-200 border border-rose-500/50 font-bold">
                          ACTIVE CONFLICT IN YOUR ROUTE
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-400">
                          INCOMPATIBLE
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-white/10">
                <h5 className="text-xs font-semibold text-emerald-400 mb-2">
                  Verified Compatible Schemes (Safe to Apply Together):
                </h5>
                <div className="flex flex-wrap gap-2">
                  {s.compatibleScholarshipIds.map(compId => {
                    const compScheme = scholarships.find(item => item.id === compId);
                    return (
                      <span key={compId} className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                        ✓ {compScheme?.code || compId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-semibold text-white text-sm">Official Scheme Conditions</h4>
              <ul className="space-y-2 text-slate-300">
                {s.eligibilityConditions.map((cond, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-purple-400 font-mono">•</span>
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>

              <h4 className="font-semibold text-white text-sm pt-3 border-t border-white/10">
                Renewal Regulations
              </h4>
              <p className="text-slate-300 leading-relaxed">{s.renewalRules}</p>
            </div>
          )}

          {/* TAB 6: HOW TO APPLY */}
          {activeTab === 'apply' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center space-x-2">
                <BadgeCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">Direct Scheme Application Page</h4>
              </div>
              <p className="text-slate-300 leading-relaxed">
                scholarmatch-ai directly links you to the exact application page for <strong>{s.name}</strong>, avoiding generic portal dashboards or complex site navigation:
              </p>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-white font-bold text-sm block">{portalName}</span>
                    <span className="text-emerald-400 font-mono text-[11px] break-all block">{officialUrl}</span>
                    {s.directSchemeCode && (
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30 mt-1">
                        Scheme Code: {s.directSchemeCode}
                      </span>
                    )}
                  </div>
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center space-x-1.5 shrink-0 transition-all shadow-md shadow-emerald-950 cursor-pointer"
                    title={`Directly open official application page for ${s.name}`}
                  >
                    <span>Apply on Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="pt-2 border-t border-emerald-500/20 flex items-center space-x-2 text-[11px] text-slate-300">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Direct Deep-Link Navigation:</strong> Opens the specific scheme page for <strong>{s.name}</strong> on {s.provider} rather than an empty home dashboard.
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-slate-300">
                <h5 className="font-semibold text-white">Application Pre-Check Checklist:</h5>
                <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                  <li>Ensure your DigiLocker documents are verified for instant one-click paperless KYC on the portal.</li>
                  <li>Verify that your bank account is Aadhaar-seeded for Direct Benefit Transfer (DBT).</li>
                  <li>Check that you do not hold conflicting government awards for the same academic cycle.</li>
                </ol>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-5 border-t border-white/10 bg-[#0a0d16] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            Award: <strong className="text-white">₹{s.awardAmount.toLocaleString('en-IN')}</strong> • Deadline: <strong className="text-white">{s.daysRemaining} days left</strong>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setInspectScholarship(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Close
            </button>

            {/* Apply on Official Website Action */}
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-200 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <span>Apply on Official Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
            </a>

            {isSelected ? (
              <button
                onClick={() => removeFromRoute(s.id)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-colors cursor-pointer"
              >
                Remove from My Route
              </button>
            ) : (
              <button
                onClick={() => {
                  addToRoute(s.id);
                  setInspectScholarship(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  hasConflict
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{hasConflict ? 'Add & Test Conflict' : 'Add to My Route'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
