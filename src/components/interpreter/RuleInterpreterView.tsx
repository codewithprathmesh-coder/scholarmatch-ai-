import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Code, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Search, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Scale, 
  Layers, 
  Copy, 
  HelpCircle,
  ExternalLink,
  PlusCircle,
  FileCheck2,
  ArrowLeft
} from 'lucide-react';
import { ConflictRule } from '../../types';

interface PresetCircular {
  id: string;
  title: string;
  source: string;
  date: string;
  text: string;
  extractedOutcome: {
    relationship: 'MUTUALLY_EXCLUSIVE' | 'COMPATIBLE' | 'REVIEW_REQUIRED';
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    schemesInvolved: string[];
    exclusivityType: string;
    incomeThreshold?: string;
    penaltyClause: string;
    plainEnglishSummary: string;
    recommendation: string;
  };
}

const PRESET_CIRCULARS: PresetCircular[] = [
  {
    id: 'mahadbt-ebc-gr',
    title: 'MahaDBT DHE Gazette - Section 4(B) on Dual Fee Availment',
    source: 'Directorate of Higher Education, Govt of Maharashtra (GR No. TEM-2024/CR-142)',
    date: 'July 2024 (Enforced for 2026-27 Academic Cycle)',
    text: `4(B). No student shall be eligible to receive tuition fee reimbursement or exam fee waiver under the Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC) if the candidate is already in receipt of any other central government or state government scholarship or fee concession scheme covering tuition fees for the same academic year. Any student found obtaining duplicate tuition benefits through National Scholarship Portal (NSP) or other state department portals will face immediate cancellation of admission benefits and recovery under the Maharashtra Government Revenue Recovery Act. However, maintenance allowances, hostel stipends (e.g. Swadhar Yojna), and private non-governmental CSR grants are exempted from this restriction.`,
    extractedOutcome: {
      relationship: 'MUTUALLY_EXCLUSIVE',
      severity: 'CRITICAL',
      schemesInvolved: ['MahaDBT EBC (MH-EBC-2026)', 'Central Sector Scheme (NSP-CSSS-2026)'],
      exclusivityType: 'Tuition Fee Double-Dipping Ban',
      incomeThreshold: '₹8,00,000 / annum (Family Income)',
      penaltyClause: 'Immediate cancellation of fee concessions and recovery under Maharashtra Revenue Recovery Act.',
      plainEnglishSummary: 'You cannot claim both MahaDBT EBC and Central Sector NSP tuition waivers simultaneously. However, you are 100% permitted to pair MahaDBT EBC with private CSR scholarships (like Reliance or Infosys) or hostel maintenance aid (like Swadhar).',
      recommendation: 'Combine MahaDBT EBC (50% Tuition Fee) + Reliance Foundation or Tata Trusts (Living Stipend) for maximal safe benefit.'
    }
  },
  {
    id: 'nsp-csss-clause-6',
    title: 'Ministry of Education - Central Sector Scheme (NSP) Clause 6.3',
    source: 'Department of Higher Education, MoE, Govt of India (PM-USP Guidelines)',
    date: 'Updated Gazette 2024/2026',
    text: `Clause 6.3 (Exclusivity of Award): A scholar under the Central Sector Scheme of Scholarship for College and University Students (CSSS) shall not receive any other scholarship, stipend, or financial assistance from any State Government, Central Government, or Local Body during the tenure of the scholarship. If a scholar is awarded any other government scholarship, they must surrender one of the two within 30 days of sanction. Aadhaar-based PFMS deduplication will automatically halt DBT disbursement if dual active enrolments are flagged across state and national databases.`,
    extractedOutcome: {
      relationship: 'MUTUALLY_EXCLUSIVE',
      severity: 'CRITICAL',
      schemesInvolved: ['Central Sector Scheme (CSSS)', 'All State Post-Matric Schemes (MahaDBT)'],
      exclusivityType: 'Strict Government Exclusivity (State vs Central)',
      incomeThreshold: '₹4,50,000 / annum',
      penaltyClause: 'Automatic DBT freeze on PFMS, reversal of funds, and permanent blacklisting on the National Scholarship Portal.',
      plainEnglishSummary: 'Central government scholarships strictly forbid taking any state government scholarship concurrently. The Public Financial Management System (PFMS) uses your Aadhaar number to identify and block duplicate disbursements.',
      recommendation: 'Compare the net payout: For high engineering college tuition fees (>₹80,000), MahaDBT EBC/Freeship yields higher value than the fixed ₹20,000 Central Sector NSP grant.'
    }
  },
  {
    id: 'reliance-csr-compat',
    title: 'Reliance Foundation Undergraduate Scholarship - CSR Clause 7.1',
    source: 'Reliance Foundation Education Charter & Guidelines',
    date: 'Current 2026-27 Guidelines',
    text: `7.1 Concurrent Aid Policy: The Reliance Foundation Undergraduate Scholarship is a philanthropic, merit-cum-means financial aid grant designed to support student living costs, technical equipment (laptops), and educational supplies. Scholars are permitted to concurrently avail government tuition fee waivers, freeships, and fee concessions (including MahaDBT, NSP, and institutional waivers), provided the government scheme does not specifically prohibit private CSR co-funding.`,
    extractedOutcome: {
      relationship: 'COMPATIBLE',
      severity: 'INFO',
      schemesInvolved: ['Reliance Foundation UG', 'MahaDBT EBC', 'MahaDBT Freeship', 'Institutional Aid'],
      exclusivityType: 'Permissible Stackable CSR Grant',
      incomeThreshold: 'Up to ₹15,00,000 (Preference < ₹2.5L)',
      penaltyClause: 'None. Fully compliant with state and central higher education regulatory norms.',
      plainEnglishSummary: 'Private CSR grants like Reliance Foundation do NOT conflict with state government fee waivers because they fund living and study expenses rather than duplicating the college tuition fee invoice.',
      recommendation: 'Safely stack Reliance Foundation UG (₹50,000/yr) with your state government tuition concession (e.g. MahaDBT EBC ₹55,000/yr) for ₹1,05,000 total support.'
    }
  },
  {
    id: 'aicte-pragati-rules',
    title: 'AICTE Pragati Scholarship for Girl Students - Guideline 5.2',
    source: 'All India Council for Technical Education (AICTE), New Delhi',
    date: 'Annual Technical Education Circular',
    text: `Clause 5.2: The Pragati scholarship of ₹50,000 per annum is paid towards college fee payment, purchase of computers, stationery, books, and equipment. A student already in receipt of any government scholarship/freeship through State Government or Central Government covering identical tuition expenses cannot claim duplicate tuition fees. However, institutional merit awards or private grants may be accepted. One girl child per family is eligible with family income below ₹8 Lakh per annum.`,
    extractedOutcome: {
      relationship: 'REVIEW_REQUIRED',
      severity: 'WARNING',
      schemesInvolved: ['AICTE Pragati', 'MahaDBT EBC / Freeship'],
      exclusivityType: 'Category & Dual Reimbursement Condition',
      incomeThreshold: '₹8,00,000 / annum',
      penaltyClause: 'Recovery of duplicate amount and disqualification from future AICTE schemes.',
      plainEnglishSummary: 'AICTE Pragati allows tuition and equipment spending, but colleges must not claim double reimbursement from the state treasury for the same fee heads.',
      recommendation: 'Check with your college scholarship clerk to confirm fee head breakdown before filing concurrent applications.'
    }
  }
];

export const RuleInterpreterView: React.FC = () => {
  const { scholarships, rules, addRule, goBack } = useApp();

  // Tab: 'circular' (NLP parser) vs 'pairwise' (Interactive Explainer) vs 'faq' (Gazette Dictionary)
  const [activeSubTab, setActiveSubTab] = useState<'circular' | 'pairwise' | 'faq'>('circular');

  // Circular NLP state
  const [selectedPresetId, setSelectedPresetId] = useState<string>('mahadbt-ebc-gr');
  const [inputText, setInputText] = useState<string>(PRESET_CIRCULARS[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<PresetCircular['extractedOutcome'] | null>(PRESET_CIRCULARS[0].extractedOutcome);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Pairwise Interactive Explainer state
  const [schemeAId, setSchemeAId] = useState<string>('MAHADBT_EBC');
  const [schemeBId, setSchemeBId] = useState<string>('CENTRAL_SECTOR_NSP');

  const handleSelectPreset = (p: PresetCircular) => {
    setSelectedPresetId(p.id);
    setInputText(p.text);
    setAnalysisResult(p.extractedOutcome);
  };

  const handleRunNlpAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Deterministic NLP clause extraction logic
      const textLower = inputText.toLowerCase();

      let rel: 'MUTUALLY_EXCLUSIVE' | 'COMPATIBLE' | 'REVIEW_REQUIRED' = 'COMPATIBLE';
      let sev: 'CRITICAL' | 'WARNING' | 'INFO' = 'INFO';
      let exclusivity = 'General Concurrent Allowance';

      if (
        textLower.includes('no student shall be eligible') ||
        textLower.includes('shall not receive any other') ||
        textLower.includes('cannot be availed') ||
        textLower.includes('not receive any other scholarship') ||
        textLower.includes('prohibited') ||
        textLower.includes('de-duplication') ||
        textLower.includes('recovery')
      ) {
        rel = 'MUTUALLY_EXCLUSIVE';
        sev = 'CRITICAL';
        exclusivity = 'Strict Mutual Exclusivity & Double-Dipping Ban';
      } else if (
        textLower.includes('review') ||
        textLower.includes('identical tuition') ||
        textLower.includes('conditional') ||
        textLower.includes('subject to')
      ) {
        rel = 'REVIEW_REQUIRED';
        sev = 'WARNING';
        exclusivity = 'Conditional Co-funding with Institution Consent';
      } else {
        rel = 'COMPATIBLE';
        sev = 'INFO';
        exclusivity = 'Stackable Living Allowance & Private Philanthropy';
      }

      // Extract income limit regex
      const incomeMatch = inputText.match(/(₹|rs\.?|inr)\s?([0-9,]+(\s?lakhs?)?)/i);
      const incomeStr = incomeMatch ? incomeMatch[0] : 'Standard Scheme Cap';

      setAnalysisResult({
        relationship: rel,
        severity: sev,
        schemesInvolved: ['Analyzed Government / Gazette Notification'],
        exclusivityType: exclusivity,
        incomeThreshold: incomeStr,
        penaltyClause: rel === 'MUTUALLY_EXCLUSIVE' 
          ? 'Mandatory PFMS DBT halt, repayment notice, and potential portal blacklisting.'
          : 'None detected in parsed text.',
        plainEnglishSummary: rel === 'MUTUALLY_EXCLUSIVE'
          ? 'The circular contains strict exclusionary clauses forbidding dual receipt of public funds for identical educational expenses.'
          : rel === 'REVIEW_REQUIRED'
          ? 'The circular permits co-existence under specific conditions (e.g. non-overlapping fee heads).'
          : 'The clause contains no prohibitions against combining this aid with legitimate state fee concessions.',
        recommendation: rel === 'MUTUALLY_EXCLUSIVE'
          ? 'Do not submit concurrent applications for both schemes on state and central portals.'
          : 'Safe to proceed with concurrent application. Ensure receipts are cataloged.'
      });
      setIsAnalyzing(false);
    }, 450);
  };

  // Pairwise computation
  const pairwiseAnalysis = useMemo(() => {
    const sA = scholarships.find(s => s.id === schemeAId);
    const sB = scholarships.find(s => s.id === schemeBId);
    if (!sA || !sB) return null;

    // Look for matching rule in matrix
    const matchingRule = rules.find(
      r => r.active &&
      ((r.scholarshipAId === schemeAId && r.scholarshipBId === schemeBId) ||
       (r.scholarshipBId === schemeAId && r.scholarshipAId === schemeBId))
    );

    const isExplicitConflict = 
      sA.conflictingScholarshipIds?.includes(schemeBId) ||
      sB.conflictingScholarshipIds?.includes(schemeAId) ||
      matchingRule?.relationship === 'MUTUALLY_EXCLUSIVE';

    const isCompatible = 
      sA.compatibleScholarshipIds?.includes(schemeBId) ||
      sB.compatibleScholarshipIds?.includes(schemeAId) ||
      matchingRule?.relationship === 'COMPATIBLE';

    return {
      sA,
      sB,
      matchingRule,
      isExplicitConflict,
      isCompatible,
      relationship: matchingRule ? matchingRule.relationship : (isExplicitConflict ? 'MUTUALLY_EXCLUSIVE' : isCompatible ? 'COMPATIBLE' : 'REVIEW_REQUIRED'),
      reason: matchingRule ? matchingRule.reason : (isExplicitConflict ? 'Both schemes cover tuition fees from government sources and are strictly mutually exclusive.' : 'No direct conflict detected. Schemes cover different fee components.')
    };
  }, [schemeAId, schemeBId, scholarships, rules]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
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
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              LEGAL CLAUSE DECONSTRUCTOR
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              Deterministic NLP Gazette Parser
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-0.5">
            Scholarship Rule & Circular Interpreter
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Parse dense Indian government resolutions (GRs), UGC circulars, and portal gazettes into clear, actionable conflict decisions and stacking allowances.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('circular')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'circular'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Circular NLP Parser</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('pairwise')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'pairwise'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pairwise Explainer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('faq')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'faq'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Gazette Terms</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: CIRCULAR NLP DECONSTRUCTOR */}
      {activeSubTab === 'circular' && (
        <div className="space-y-6">
          
          {/* Preset Circular Selectors */}
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center space-x-1.5">
                <FileCheck2 className="w-4 h-4 text-purple-400" />
                <span>Select an Official Government Circular / Gazette Clause:</span>
              </span>
              <span className="text-[11px] text-slate-400">or paste any text below</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PRESET_CIRCULARS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPresetId === p.id
                      ? 'bg-purple-600/20 border-purple-500/60 shadow-md text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold text-xs line-clamp-1">{p.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{p.source}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Input & NLP Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Input Textbox */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium">Government Circular / Clause Text</span>
                <span className="text-[11px] font-mono text-slate-400">{inputText.length} characters</span>
              </div>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                rows={11}
                placeholder="Paste any scholarship circular clause, government resolution (GR), or university ordinance text here..."
                className="w-full p-3.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-purple-500 transition-colors leading-relaxed resize-none"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleRunNlpAnalysis}
                  disabled={isAnalyzing || !inputText.trim()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzing ? 'Parsing Clause Legal Syntax...' : 'Run Automated Clause NLP'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(inputText);
                    setCopiedSuccess(true);
                    setTimeout(() => setCopiedSuccess(false), 2000);
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSuccess ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            {/* Right: Extracted Intelligence Cards */}
            <div className="lg:col-span-6 space-y-4">
              {analysisResult ? (
                <div className="p-5 rounded-2xl glass-panel border border-white/15 space-y-4">
                  
                  {/* Status Headline */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                      {analysisResult.relationship === 'MUTUALLY_EXCLUSIVE' ? (
                        <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                      ) : analysisResult.relationship === 'COMPATIBLE' ? (
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                          Extracted Legal Finding
                        </div>
                        <div className={`text-sm font-bold ${
                          analysisResult.relationship === 'MUTUALLY_EXCLUSIVE' ? 'text-rose-400' :
                          analysisResult.relationship === 'COMPATIBLE' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {analysisResult.relationship === 'MUTUALLY_EXCLUSIVE' && 'Strict Mutual Conflict Barred'}
                          {analysisResult.relationship === 'COMPATIBLE' && '100% Stackable Concurrent Aid'}
                          {analysisResult.relationship === 'REVIEW_REQUIRED' && 'Conditional Dual Availment'}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                      analysisResult.severity === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' :
                      analysisResult.severity === 'WARNING' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                      'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    }`}>
                      {analysisResult.severity} SEVERITY
                    </span>
                  </div>

                  {/* Core Structured Dimensions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Exclusivity Category</span>
                      <span className="font-semibold text-white">{analysisResult.exclusivityType}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Income Ceiling Detected</span>
                      <span className="font-semibold text-cyan-300 font-mono">{analysisResult.incomeThreshold || 'Not Specified in Extract'}</span>
                    </div>
                  </div>

                  {/* Plain English Translation */}
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-1 text-xs">
                    <span className="text-[10px] text-purple-300 uppercase font-bold tracking-wider block">
                      Plain English Synthesis for Students:
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      {analysisResult.plainEnglishSummary}
                    </p>
                  </div>

                  {/* Penalty / Enforcement Clause */}
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1 text-xs">
                    <span className="text-[10px] text-rose-300 uppercase font-bold tracking-wider block">
                      Legal Audit & Penalty Risk:
                    </span>
                    <p className="text-rose-200/90 text-[11px] leading-relaxed">
                      {analysisResult.penaltyClause}
                    </p>
                  </div>

                  {/* Practical Action Recommendation */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1 text-xs">
                    <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">
                      Recommended Route Action:
                    </span>
                    <p className="text-emerald-200 leading-relaxed font-medium">
                      {analysisResult.recommendation}
                    </p>
                  </div>

                </div>
              ) : (
                <div className="p-12 rounded-2xl glass-panel border border-white/10 text-center text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="text-xs">Paste or select a circular on the left to deconstruct its clauses.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 2: PAIRWISE SCHOLARSHIP EXPLAINER */}
      {activeSubTab === 'pairwise' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Pairwise Conflict & Stacking Simulator
            </h2>
            <p className="text-xs text-slate-400">
              Select any two scholarships in the repository to inspect why they can or cannot be held simultaneously.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">First Scholarship (Scheme A)</label>
                <select
                  value={schemeAId}
                  onChange={e => setSchemeAId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  {scholarships.map(s => (
                    <option key={s.id} value={s.id} className="bg-slate-900">
                      {s.name} ({s.code}) - ₹{s.awardAmount.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Second Scholarship (Scheme B)</label>
                <select
                  value={schemeBId}
                  onChange={e => setSchemeBId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  {scholarships.map(s => (
                    <option key={s.id} value={s.id} className="bg-slate-900">
                      {s.name} ({s.code}) - ₹{s.awardAmount.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pairwise Result Card */}
          {pairwiseAnalysis && (
            <div className="p-6 rounded-2xl glass-panel border border-purple-500/30 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  {pairwiseAnalysis.relationship === 'MUTUALLY_EXCLUSIVE' ? (
                    <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                  ) : pairwiseAnalysis.relationship === 'COMPATIBLE' ? (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Inter-Scheme Legal Status</div>
                    <div className={`text-lg font-bold ${
                      pairwiseAnalysis.relationship === 'MUTUALLY_EXCLUSIVE' ? 'text-rose-400' :
                      pairwiseAnalysis.relationship === 'COMPATIBLE' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {pairwiseAnalysis.relationship === 'MUTUALLY_EXCLUSIVE' && 'Strict Mutual Conflict — Cannot Avail Both'}
                      {pairwiseAnalysis.relationship === 'COMPATIBLE' && '100% Legally Compatible — Safe Dual Stacking'}
                      {pairwiseAnalysis.relationship === 'REVIEW_REQUIRED' && 'Review Conditions Before Applying'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Combined Max Annual Value</div>
                  <div className="text-base font-mono font-bold text-white">
                    ₹{(pairwiseAnalysis.sA.awardAmount + pairwiseAnalysis.sB.awardAmount).toLocaleString('en-IN')} / yr
                  </div>
                </div>
              </div>

              {/* Side by side cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-purple-300 uppercase px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                    {pairwiseAnalysis.sA.providerType}
                  </span>
                  <div className="font-bold text-white text-sm">{pairwiseAnalysis.sA.name}</div>
                  <div className="text-slate-400 text-[11px]">{pairwiseAnalysis.sA.provider}</div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-slate-400">Award Amount:</span>
                    <span className="font-mono font-bold text-emerald-400">₹{pairwiseAnalysis.sA.awardAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    {pairwiseAnalysis.sB.providerType}
                  </span>
                  <div className="font-bold text-white text-sm">{pairwiseAnalysis.sB.name}</div>
                  <div className="text-slate-400 text-[11px]">{pairwiseAnalysis.sB.provider}</div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-slate-400">Award Amount:</span>
                    <span className="font-mono font-bold text-emerald-400">₹{pairwiseAnalysis.sB.awardAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Rationale */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <Scale className="w-3.5 h-3.5 text-purple-400" />
                  <span>Official Government Rationale:</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {pairwiseAnalysis.reason}
                </p>
              </div>

            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: GAZETTE TERMS & AUDIT FAQ */}
      {activeSubTab === 'faq' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>What is "Double Dipping" on Public Funds?</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              When a student claims college tuition fee reimbursement from more than one state or central government portal for the same academic semester (e.g. MahaDBT EBC + NSP CSSS). Indian audit authorities treat this as financial fraud under Section 42 of the Revenue Recovery Act, freezing payments via PFMS.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Can I Combine Government and Private CSR Scholarships?</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              <strong>Yes!</strong> Private CSR grants (such as Reliance Foundation, Infosys STEM Stars, Tata Trusts, and Sitaram Jindal) fund living stipends, study supplies, and laptops. They do not invoice the state treasury for college tuition fees, making them 100% stackable and legally safe.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>How does PFMS Deduplication Work in 2026-27?</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              The Public Financial Management System (PFMS) maintains an automated NPCI Aadhaar mapper. Whenever a state or central ministry sanctions scholarship DBT, the system checks whether the student's 12-digit Aadhaar has already received tuition aid under another scheme ID. If duplicate enrolments exist, subsequent credits bounce automatically.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Freeship vs Scholarship: What is the Distinction?</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              A <strong>Freeship</strong> directly waives 50% to 100% of college tuition/exam fees credited straight to the educational institute's account (e.g. MahaDBT SC/OBC/EBC). A <strong>Scholarship / Maintenance Allowance</strong> is a recurring cash stipend transferred directly to the student's personal bank account for living costs.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
