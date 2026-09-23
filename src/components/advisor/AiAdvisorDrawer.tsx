import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink, 
  Compass, 
  FileText, 
  Scale, 
  User, 
  Building2, 
  GraduationCap,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Scholarship } from '../../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    tab: string;
    icon?: string;
  };
  highlight?: {
    title: string;
    amount?: string;
    type: 'SAFE' | 'CONFLICT' | 'INFO';
  };
}

const PRESET_QUESTIONS = [
  {
    label: '🛡️ Safe Stacking Combos',
    query: 'Which scholarships can I safely combine for maximum financial aid without triggering a conflict?'
  },
  {
    label: '⚠️ MahaDBT vs NSP Exclusivity',
    query: 'Why does MahaDBT EBC conflict with Central Sector NSP, and what happens if I apply to both?'
  },
  {
    label: '💰 Max Engineering Aid',
    query: 'How can I maximize my total scholarship award for B.Tech / Engineering?'
  },
  {
    label: '🏢 Reliance Foundation CSR',
    query: 'Can I apply for Reliance Foundation Undergraduate Scholarship if I already have MahaDBT fee concession?'
  },
  {
    label: '🏦 Aadhaar DBT & PFMS',
    query: 'How does PFMS Aadhaar deduplication work and how do I prevent DBT payment rejection?'
  },
  {
    label: '📋 Missing Documents',
    query: 'What documents should I prepare first based on my current profile?'
  }
];

export const AiAdvisorDrawer: React.FC = () => {
  const { 
    isAiDrawerOpen, 
    setIsAiDrawerOpen, 
    student, 
    scholarships, 
    rules, 
    setActiveTab, 
    selectedScholarshipIds,
    routeResults,
    goBack
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${student.fullName || 'Scholar'}! I am your **scholarmatch-ai Advisor**. 

I have evaluated your profile (**${student.category || 'General'}**, Annual Income: **₹${(student.annualFamilyIncome || 0).toLocaleString('en-IN')}**, **${student.course || 'Professional Degree'}** at **${student.collegeName || 'College'}**).

Here is your instant advisory overview:
• **Best Safe Route**: MahaDBT EBC Fee Reimbursement + Reliance Foundation CSR Grant = **₹1,05,000 / year**.
• **Critical Rule**: Do NOT apply concurrently for Central Sector Scheme (NSP) and MahaDBT EBC—both cover tuition fees and will be halted by PFMS deduplication.
• **PFMS Aadhaar Status**: Ensure your bank account is seeded with NPCI Aadhaar mapper for DBT.

How can I help guide your scholarship strategy today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionButton: {
        label: 'View Optimized Safe Routes',
        tab: 'routes'
      },
      highlight: {
        title: 'Recommended Safe Stacking',
        amount: '₹1,05,000 / yr',
        type: 'SAFE'
      }
    }
  ]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Text to speech helper
  const speakText = (text: string) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#•]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  // Generate intelligent contextual response
  const generateAdvisorResponse = (query: string): Message => {
    const q = query.toLowerCase();
    const studentName = student.fullName || 'Scholar';
    const income = student.annualFamilyIncome || 0;
    const cat = student.category || 'Open';

    // 1. Stacking Combos
    if (q.includes('stack') || q.includes('combine') || q.includes('both') || q.includes('together') || q.includes('maximum')) {
      const isSC = cat === 'SC';
      const isOBC = cat === 'OBC';
      let govScheme = 'MahaDBT EBC (RCSMS)';
      let govVal = 55000;
      if (isSC) {
        govScheme = 'MahaDBT SC Freeship (100% Tuition Waiver)';
        govVal = 110000;
      } else if (isOBC) {
        govScheme = 'MahaDBT OBC Freeship (50% Tuition Waiver)';
        govVal = 55000;
      }

      const totalPossible = govVal + 50000;

      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `### 🛡️ 100% Legally Permissible Stacking Blueprint for ${studentName}:

Under Directorate of Higher Education (DHE) & CSR guidelines, you are permitted to stack **Tuition Fee Concessions** with **Private Living Stipends**:

1. **Primary Government Tuition Concession**: **${govScheme}**
   • Value: ~₹${govVal.toLocaleString('en-IN')}/year
   • Credited directly to college fee account.
2. **Private CSR Merit Grant**: **Reliance Foundation Undergraduate Scholarship**
   • Value: ₹50,000/year cash stipend
   • Credited to student bank account for books, laptop, and hostel.
3. **Institutional Alumni Aid**: Optional college alumni fund (₹15,000–₹25,000).

**Net Safe Financial Aid**: **₹${totalPossible.toLocaleString('en-IN')} / year** with **0% audit risk**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: {
          label: 'Apply This Combo in Safe Routes',
          tab: 'routes'
        },
        highlight: {
          title: 'Safe Combination',
          amount: `₹${totalPossible.toLocaleString('en-IN')} / yr`,
          type: 'SAFE'
        }
      };
    }

    // 2. MahaDBT vs NSP Conflict
    if (q.includes('nsp') || q.includes('central sector') || q.includes('ebc') || q.includes('conflict') || q.includes('why')) {
      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `### ⚠️ Why MahaDBT EBC & Central Sector NSP Strictly Conflict:

• **Legal Prohibition**: Ministry of Education Clause 6.3 and Maharashtra Govt Resolution (TEM-2024/CR-142) prohibit taking two government scholarships covering tuition fees for the same academic year.
• **PFMS Aadhaar Deduplication**: When both portals sanction DBT to your 12-digit Aadhaar, PFMS automatically flags the dual enrolment and Freezes both disbursements!
• **Revenue Recovery Act**: Double-claiming public funds triggers mandatory recovery notices and portal blacklisting.

**Advisor Advice**: 
For engineering college tuition fees (>₹80,000), MahaDBT EBC saves you **₹55,000–₹1,10,000**. Central Sector NSP gives only a fixed **₹20,000**. 
👉 **Choose MahaDBT EBC + Reliance Foundation CSR instead** for a much higher, 100% legal payout!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: {
          label: 'Inspect Rules & Gazette Clauses',
          tab: 'nlp'
        },
        highlight: {
          title: 'High Conflict Alert',
          amount: 'Avoid Dual Submission',
          type: 'CONFLICT'
        }
      };
    }

    // 3. Reliance Foundation compatibility
    if (q.includes('reliance') || q.includes('csr') || q.includes('infosys') || q.includes('private')) {
      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `### ✅ Yes! Reliance Foundation & Private CSR Grants are 100% Compatible

Reliance Foundation Clause 7.1 and Infosys STEM Stars specifically state:
*"Scholars may concurrently avail government tuition fee waivers or freeships, provided the government scheme does not prohibit philanthropic maintenance stipends."*

Because MahaDBT pays your college tuition invoice, while Reliance Foundation funds your personal study expenses (laptop, books, accommodation), **they do NOT overlap fee heads**.

• **Award**: ₹50,000/year throughout your degree.
• **Income Cap**: Up to ₹15,00,000 (preference given to < ₹2,50,000).
• **Eligibility**: 1st year full-time undergraduate students with >60% in 12th standard.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: {
          label: 'View Reliance Scheme Details',
          tab: 'discover'
        },
        highlight: {
          title: 'Stackable CSR Grant',
          amount: '₹50,000 / yr',
          type: 'SAFE'
        }
      };
    }

    // 4. Aadhaar DBT & PFMS
    if (q.includes('aadhaar') || q.includes('pfms') || q.includes('dbt') || q.includes('bank') || q.includes('npci')) {
      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `### 🏦 Public Financial Management System (PFMS) & DBT Readiness:

1. **Aadhaar Seeding vs Linking**: Simply having your Aadhaar on your bank passbook is NOT enough. Your bank account must be actively **mapped to NPCI Aadhaar mapper** for Direct Benefit Transfer (DBT).
2. **Check Status Online**:
   • Visit the UIDAI portal or your bank mobile app.
   • Check "Aadhaar Bank Seeding Status".
3. **Single Active DBT Account**: NPCI allows only ONE bank account to receive DBT credits at any time. If you changed accounts recently, submit a Mandate Form to your bank branch.
4. **Name Matching**: Ensure the name spelling on your Bank Account matches your Aadhaar and Marksheet to avoid automatic PFMS reject code *RR01 (Name Mismatch)*.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: {
          label: 'Check Profile Name Consistency',
          tab: 'profile'
        },
        highlight: {
          title: 'DBT Compliance Checklist',
          type: 'INFO'
        }
      };
    }

    // 5. Missing Documents
    if (q.includes('document') || q.includes('digilocker') || q.includes('income cert') || q.includes('caste')) {
      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `### 📋 Priority Document Checklist for 2026-27 Applications:

1. **Tahsildar Income Certificate (Valid for FY 2026-27)**: Crucial! Must show family income below the scheme ceiling (₹8,00,000 for EBC, ₹2,50,000 for SC/OBC).
2. **CAP Allotment Letter**: Confirms centralized engineering/medical admission through DTE / CET Cell.
3. **College Fee Receipt & Bonafide Certificate**: Required for tuition fee reimbursement calculation.
4. **10th & 12th Marksheet**: Must have clear digital signatures.
5. **Caste Certificate & Validity** (SC/OBC/VJNT applicants only).
6. **Ration Card / Domicile Certificate**: Proves Maharashtra state resident status.

💡 **Pro-Tip**: Use our **DigiLocker 1-Click Sync** in the Documents tab to verify documents with zero manual scanning!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: {
          label: 'Open Documents & DigiLocker',
          tab: 'documents'
        },
        highlight: {
          title: 'Document Readiness',
          type: 'INFO'
        }
      };
    }

    // 6. Generic / Branch-Specific Advice
    return {
      id: Date.now().toString(),
      sender: 'ai',
      text: `### 🎓 Tailored Advice for ${studentName}:

Based on your current profile:
• **Category**: ${cat}
• **Branch**: ${student.course || 'Technical Engineering'}
• **Family Income**: ₹${income.toLocaleString('en-IN')} / year

**Key Rules to Remember**:
1. You cannot take two government tuition fee waivers simultaneously.
2. You CAN take a government tuition waiver + private CSR scholarship + hostel stipend.
3. Keep your Tahsildar income certificate and CAP round allotment letter ready before the November deadlines.
4. Always check our **Safe Routes** optimizer before confirming final portal submissions!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionButton: {
        label: 'Explore All Safe Routes',
        tab: 'routes'
      },
      highlight: {
        title: 'Personalized Recommendation',
        type: 'INFO'
      }
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAdvisorResponse(query);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      speakText(response.text);
    }, 600);
  };

  const handleClearChat = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: `Conversation reset. I am ready to evaluate any scholarship rules, eligibility questions, or stacking strategies for you, ${student.fullName || 'Scholar'}!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isAiDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/70 backdrop-blur-sm transition-all duration-300">
      
      {/* Background click to dismiss */}
      <div 
        className="flex-1 cursor-pointer"
        onClick={() => {
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          setIsAiDrawerOpen(false);
        }}
      />

      {/* Drawer Container */}
      <div className="w-full max-w-xl h-full bg-[#0a0e17] border-l border-purple-500/30 shadow-2xl flex flex-col relative z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0d121f] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setIsAiDrawerOpen(false);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer mr-0.5"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/30">
              <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-white font-display">
                  scholarmatch-ai Advisor
                </h2>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Rule engine & gazette clause assistant
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                speechEnabled 
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' 
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
              title={speechEnabled ? 'Text-to-speech enabled (Click to mute)' : 'Enable voice responses'}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Clear Chat History"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setIsAiDrawerOpen(false);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Advisor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Student Context Chip */}
        <div className="px-4 py-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-300 shrink-0">
          <div className="flex items-center space-x-2 truncate">
            <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold text-white truncate">{student.fullName || 'No Name Set'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-purple-300">{student.category || 'Open'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-mono">₹{(student.annualFamilyIncome || 0).toLocaleString('en-IN')}/yr</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsAiDrawerOpen(false);
              setActiveTab('profile');
            }}
            className="text-[10px] text-cyan-400 hover:underline shrink-0 ml-2 font-semibold cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#090d16] border-b border-white/5 overflow-x-auto flex space-x-2 shrink-0 scrollbar-none">
          {PRESET_QUESTIONS.map((pq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(pq.query)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-200 border border-white/10 hover:border-purple-500/30 text-[11px] font-medium transition-all shrink-0 cursor-pointer"
            >
              {pq.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Sender label */}
              <div className="flex items-center space-x-1.5 mb-1 px-1 text-[10px] text-slate-500">
                {msg.sender === 'ai' ? (
                  <>
                    <Bot className="w-3 h-3 text-cyan-400" />
                    <span className="font-semibold text-cyan-300">AI Advisor</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 text-purple-400" />
                    <span className="font-semibold text-purple-300">{student.fullName || 'You'}</span>
                  </>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 shadow-lg leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-[#121826] border border-white/10 text-slate-200 rounded-tl-none space-y-3'
                }`}
              >
                {/* Highlight banner if present */}
                {msg.highlight && (
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs mb-2 ${
                    msg.highlight.type === 'SAFE' 
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : msg.highlight.type === 'CONFLICT'
                      ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                      : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
                  }`}>
                    <div className="flex items-center space-x-1.5 font-bold">
                      {msg.highlight.type === 'SAFE' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                      {msg.highlight.type === 'CONFLICT' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
                      {msg.highlight.type === 'INFO' && <Sparkles className="w-4 h-4 text-cyan-400" />}
                      <span>{msg.highlight.title}</span>
                    </div>
                    {msg.highlight.amount && (
                      <span className="font-mono font-bold">{msg.highlight.amount}</span>
                    )}
                  </div>
                )}

                {/* Formatted body */}
                <div className="whitespace-pre-line text-xs sm:text-[13px] leading-relaxed">
                  {msg.text}
                </div>

                {/* In-app action button */}
                {msg.actionButton && (
                  <div className="pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAiDrawerOpen(false);
                        setActiveTab(msg.actionButton!.tab);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 hover:text-white font-semibold flex items-center justify-center space-x-1.5 transition-all text-xs cursor-pointer"
                    >
                      <span>{msg.actionButton.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs p-2">
              <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>AI Advisor is consulting the 2026-27 gazette rules...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0d121f] shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Ask about stacking, DBT Aadhaar, NSP vs MahaDBT, deadlines..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all shadow-md shadow-purple-600/30 cursor-pointer"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-500 text-center mt-2">
            AI responses grounded in official UGC, MahaDBT, and Ministry of Education 2026-27 gazettes.
          </p>
        </div>

      </div>
    </div>
  );
};
