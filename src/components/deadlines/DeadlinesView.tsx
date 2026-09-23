import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Bell, 
  BellRing, 
  ExternalLink, 
  Filter, 
  AlertTriangle, 
  CheckCircle2,
  Info,
  ArrowLeft
} from 'lucide-react';
import { TrafficLightBadge } from '../common/TrafficLightBadge';

export const DeadlinesView: React.FC = () => {
  const { scholarships, selectedScholarshipIds, setInspectScholarship, goBack } = useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'route' | 'urgent'>('all');
  const [reminders, setReminders] = useState<{ [key: string]: boolean }>({
    CENTRAL_SECTOR_NSP: true,
    RELIANCE_FOUNDATION_UG: true
  });

  const toggleReminder = (id: string) => {
    setReminders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter & sort by daysRemaining ascending
  const sortedScholarships = [...scholarships]
    .filter(s => {
      if (filterMode === 'route') return selectedScholarshipIds.includes(s.id);
      if (filterMode === 'urgent') return s.daysRemaining <= 21;
      return true;
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header */}
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
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              DEADLINE TRACKER & TIME HORIZON
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Application Deadlines & Countdown
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Never miss a sanction window. Prioritize urgent closing dates to avoid late institutional rejection.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 bg-white/5 p-1.5 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'all'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Deadlines ({scholarships.length})
          </button>
          <button
            onClick={() => setFilterMode('route')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'route'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            In My Route ({selectedScholarshipIds.length})
          </button>
          <button
            onClick={() => setFilterMode('urgent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'urgent'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Closing Soon (&lt;21d)
          </button>
        </div>
      </div>

      {/* Deadlines Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedScholarships.map(s => {
          const isUrgent = s.daysRemaining <= 14;
          const isMedium = s.daysRemaining > 14 && s.daysRemaining <= 30;
          const isInRoute = selectedScholarshipIds.includes(s.id);
          const hasReminder = reminders[s.id];

          return (
            <div
              key={s.id}
              className={`p-5 rounded-2xl glass-panel border transition-all flex flex-col justify-between ${
                isUrgent 
                  ? 'border-rose-500/40 bg-rose-950/10' 
                  : isMedium
                  ? 'border-amber-500/30'
                  : 'border-white/10'
              }`}
            >
              <div>
                
                {/* Status & Urgent Pill */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    isUrgent ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    isMedium ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {s.daysRemaining} Days Left
                  </span>

                  {isInRoute && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      In Your Route
                    </span>
                  )}
                </div>

                {/* Scholarship Name */}
                <h3 
                  onClick={() => setInspectScholarship(s)}
                  className="text-base font-bold text-white hover:text-cyan-300 cursor-pointer transition-colors leading-snug"
                >
                  {s.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {s.provider}
                </p>

                {/* Exact Date & Award */}
                <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5 text-slate-400">
                      <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Closing Date:</span>
                    </span>
                    <strong className="font-mono text-white">{s.applicationDeadline}</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Award Amount:</span>
                    <span className="font-mono font-bold text-white">₹{s.awardAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => toggleReminder(s.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-all ${
                    hasReminder
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                  title="Toggle SMS / Email reminder"
                >
                  {hasReminder ? <BellRing className="w-3.5 h-3.5 text-cyan-400" /> : <Bell className="w-3.5 h-3.5" />}
                  <span>{hasReminder ? 'Reminder Active' : 'Set Reminder'}</span>
                </button>

                <a
                  href={s.officialPortalUrl || s.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                  title={`Open official scheme page for ${s.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
