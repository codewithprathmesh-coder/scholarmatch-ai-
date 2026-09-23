import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Compass, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Bookmark, 
  User, 
  Code, 
  Settings, 
  Bot, 
  PlayCircle,
  Layers,
  MapPin,
  Wallet,
  ArrowLeft
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    goBack,
    canGoBack,
    triggerDemoJudgeFlow, 
    isAiDrawerOpen, 
    setIsAiDrawerOpen, 
    selectedScholarshipIds,
    activeRouteAnalysis
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'discover', label: 'Find Scholarships', icon: Search },
    { id: 'routes', label: 'Safe Routes', icon: Compass, badge: selectedScholarshipIds.length > 0 ? selectedScholarshipIds.length : undefined },
    { id: 'wallet', label: 'Active Wallet', icon: Wallet },
    { id: 'deadlines', label: 'Deadlines', icon: Clock },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'nlp', label: 'Rule Interpreter', icon: Code },
    { id: 'admin', label: 'Admin Rules', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080b11]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Slogan & In-App Back Button */}
          <div className="flex items-center space-x-3">
            {canGoBack && (
              <button
                id="btn-app-back"
                type="button"
                onClick={goBack}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/15 transition-all text-xs font-semibold cursor-pointer shadow-sm active:scale-95 group shrink-0"
                title="Go back to previous screen (or use browser back button)"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-cyan-400" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <div 
              id="nav-brand-logo"
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => setActiveTab('landing')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
                <div className="w-full h-full bg-[#0d121d] rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-bold tracking-tight text-white font-display">
                    scholar<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">match-ai</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    MUSA CODEX
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  “Safer Applications. Brighter Tomorrows.”
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                    isActive 
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      activeRouteAnalysis.overallStatus === 'CONFLICT'
                        ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                        : activeRouteAnalysis.overallStatus === 'REVIEW'
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs: 1-Click Judge Demo & AI Assistant */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Demo Judge Trigger Button */}
            <button
              id="btn-trigger-demo-aarav"
              onClick={triggerDemoJudgeFlow}
              className="group relative inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 hover:shadow-purple-600/50 transition-all border border-purple-400/30 active:scale-95"
              title="Click to automatically load Aarav Sharma demo profile and execute full conflict analysis"
            >
              <PlayCircle className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span>Try Demo <span className="text-purple-200 hidden md:inline">(Aarav)</span></span>
            </button>

            {/* AI Assistant Drawer Toggle */}
            <button
              id="btn-toggle-ai-assistant"
              onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
              className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center space-x-1"
              title="scholarmatch-ai Advisor"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="text-xs hidden md:inline">AI Advisor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-1 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-1" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
