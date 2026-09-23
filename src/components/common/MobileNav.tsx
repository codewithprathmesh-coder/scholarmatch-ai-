import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Search, Compass, Clock, User, Scale, Wallet } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, selectedScholarshipIds } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'discover', label: 'Find', icon: Search },
    { id: 'routes', label: 'Routes', icon: Compass, badge: selectedScholarshipIds.length },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'nlp', label: 'Rules', icon: Scale },
    { id: 'documents', label: 'Docs', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 flex justify-around items-center">
      {tabs.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors relative ${
              isActive ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-purple-600 text-white text-[9px] flex items-center justify-center font-bold">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
