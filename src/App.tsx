import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProfileSetup } from './components/profile/ProfileSetup';
import { ScholarshipDiscovery } from './components/scholarships/ScholarshipDiscovery';
import { SafeRoutesView } from './components/routes/SafeRoutesView';
import { DeadlinesView } from './components/deadlines/DeadlinesView';
import { DocumentsView } from './components/documents/DocumentsView';
import { ActiveWalletRenewalsView } from './components/wallet/ActiveWalletRenewalsView';
import { RuleInterpreterView } from './components/interpreter/RuleInterpreterView';
import { AdminPanel } from './components/admin/AdminPanel';
import { LoadingAnalysis } from './components/common/LoadingAnalysis';
import { ScholarshipDetailsModal } from './components/scholarships/ScholarshipDetailsModal';
import { ConflictAlertModal } from './components/conflicts/ConflictAlertModal';
import { AiAdvisorDrawer } from './components/advisor/AiAdvisorDrawer';
import { Bot } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, isAiDrawerOpen, setIsAiDrawerOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 relative">
      {/* Global Navigation */}
      <Navbar />
      <MobileNav />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'profile' && <ProfileSetup />}
        {activeTab === 'discover' && <ScholarshipDiscovery />}
        {activeTab === 'routes' && <SafeRoutesView />}
        {activeTab === 'wallet' && <ActiveWalletRenewalsView />}
        {activeTab === 'nlp' && <RuleInterpreterView />}
        {activeTab === 'deadlines' && <DeadlinesView />}
        {activeTab === 'documents' && <DocumentsView />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Floating AI Advisor Quick Trigger (Bottom-Right) */}
      {!isAiDrawerOpen && (
        <button
          id="btn-floating-advisor"
          type="button"
          onClick={() => setIsAiDrawerOpen(true)}
          className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-30 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-semibold text-xs shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 border border-white/20 cursor-pointer"
          title="Open AI Scholarship Advisor"
        >
          <Bot className="w-4 h-4 text-cyan-200 animate-bounce" />
          <span className="hidden sm:inline">Ask AI Advisor</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      )}

      {/* Global Footer */}
      <Footer />

      {/* AI Advisor Drawer */}
      <AiAdvisorDrawer />

      {/* 5-Step Animated Analysis Modal */}
      <LoadingAnalysis />

      {/* Detail Inspection Modal */}
      <ScholarshipDetailsModal />

      {/* Real-time Exclusivity Alert Modal */}
      <ConflictAlertModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
