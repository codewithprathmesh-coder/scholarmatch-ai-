import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Plus, 
  Check, 
  Trash2, 
  Sliders, 
  Filter, 
  AlertOctagon, 
  CheckCircle2, 
  HelpCircle,
  FileCheck,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { ConflictRule, ConflictRelationship, RuleSeverity } from '../../types';
import { TrafficLightBadge } from '../common/TrafficLightBadge';

export const AdminPanel: React.FC = () => {
  const { rules, toggleRuleActive, addRule, scholarships, goBack } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);

  // New rule form state
  const [newSchA, setNewSchA] = useState(scholarships[0]?.id || '');
  const [newSchB, setNewSchB] = useState(scholarships[1]?.id || '');
  const [newRel, setNewRel] = useState<ConflictRelationship>('MUTUALLY_EXCLUSIVE');
  const [newSev, setNewSev] = useState<RuleSeverity>('HIGH');
  const [newReason, setNewReason] = useState('');
  const [newCitation, setNewCitation] = useState('');

  const filteredRules = rules.filter(r => {
    if (filterType === 'ALL') return true;
    return r.relationship === filterType;
  });

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReason || !newCitation) return;

    addRule({
      id: `RULE-CUSTOM-${Date.now()}`,
      scholarshipAId: newSchA,
      scholarshipBId: newSchB,
      relationship: newRel,
      severity: newSev,
      reason: newReason,
      source: newCitation,
      policyCitation: newCitation,
      active: true
    });

    setNewReason('');
    setNewCitation('');
    setShowAddForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Top Header */}
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
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
              SYSTEM ADMINISTRATION • RULE ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Cross-Portal Exclusivity Rules Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure, calibrate, and audit state & central mutual-exclusivity rules, circulars, and deduplication logic.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 transition-all flex items-center space-x-1.5 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Add New Rule'}</span>
        </button>
      </div>

      {/* Add Rule Form Modal / Collapsible */}
      {showAddForm && (
        <form onSubmit={handleCreateRule} className="p-6 rounded-2xl glass-panel border border-purple-500/30 space-y-4">
          <h3 className="text-sm font-bold text-white font-display">
            Define New Mutual Exclusivity / Compatibility Rule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Scholarship A</label>
              <select
                value={newSchA}
                onChange={e => setNewSchA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                {scholarships.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Scholarship B</label>
              <select
                value={newSchB}
                onChange={e => setNewSchB(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                {scholarships.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Relationship Type</label>
              <select
                value={newRel}
                onChange={e => setNewRel(e.target.value as ConflictRelationship)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="MUTUALLY_EXCLUSIVE" className="bg-slate-900">MUTUALLY_EXCLUSIVE (Red Conflict)</option>
                <option value="COMPATIBLE" className="bg-slate-900">COMPATIBLE (Green Safe)</option>
                <option value="REVIEW_REQUIRED" className="bg-slate-900">REVIEW_REQUIRED (Amber Flag)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Severity</label>
              <select
                value={newSev}
                onChange={e => setNewSev(e.target.value as RuleSeverity)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="HIGH" className="bg-slate-900">HIGH (Disqualification Risk)</option>
                <option value="MEDIUM" className="bg-slate-900">MEDIUM (Administrative Query)</option>
                <option value="LOW" className="bg-slate-900">LOW (Informational)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Rule Explanation & Rationale</label>
              <textarea
                value={newReason}
                onChange={e => setNewReason(e.target.value)}
                placeholder="Explain why these two schemes cannot or can be held simultaneously..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Official Government Circular / Policy Citation</label>
              <input
                type="text"
                value={newCitation}
                onChange={e => setNewCitation(e.target.value)}
                placeholder="e.g. MHRD Guidelines Section 6.3 / MahaDBT GR No. 2023/118"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30"
            >
              Save & Activate Rule
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 bg-white/5 p-1.5 rounded-xl border border-white/10 shrink-0 self-start">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterType === 'ALL' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Rules ({rules.length})
        </button>
        <button
          onClick={() => setFilterType('MUTUALLY_EXCLUSIVE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterType === 'MUTUALLY_EXCLUSIVE' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Mutually Exclusive ({rules.filter(r => r.relationship === 'MUTUALLY_EXCLUSIVE').length})
        </button>
        <button
          onClick={() => setFilterType('COMPATIBLE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterType === 'COMPATIBLE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Compatible ({rules.filter(r => r.relationship === 'COMPATIBLE').length})
        </button>
      </div>

      {/* Rules Table / Cards */}
      <div className="space-y-3">
        {filteredRules.map(rule => {
          const sA = scholarships.find(s => s.id === rule.scholarshipAId);
          const sB = scholarships.find(s => s.id === rule.scholarshipBId);

          return (
            <div 
              key={rule.id}
              className={`p-5 rounded-2xl glass-panel border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                !rule.active 
                  ? 'opacity-50 border-white/5' 
                  : rule.relationship === 'MUTUALLY_EXCLUSIVE'
                  ? 'border-rose-500/20 hover:border-rose-500/40'
                  : 'border-emerald-500/20 hover:border-emerald-500/40'
              }`}
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    {rule.id}
                  </span>

                  <TrafficLightBadge 
                    status={
                      rule.relationship === 'MUTUALLY_EXCLUSIVE' ? 'CONFLICT' :
                      rule.relationship === 'COMPATIBLE' ? 'SAFE' : 'REVIEW'
                    } 
                    size="sm" 
                  />

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    rule.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-300' :
                    rule.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-slate-500/20 text-slate-300'
                  }`}>
                    {rule.severity} SEVERITY
                  </span>
                </div>

                <div className="text-sm font-bold text-white flex flex-wrap items-center gap-2">
                  <span>{sA?.name || rule.scholarshipAId}</span>
                  <span className="text-slate-400 font-normal">↔</span>
                  <span>{sB?.name || rule.scholarshipBId}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {rule.reason}
                </p>

                <div className="text-[11px] font-mono text-purple-300">
                  Citation: {rule.policyCitation || rule.source}
                </div>
              </div>

              {/* Toggle Active Switch */}
              <div className="flex items-center space-x-3 self-end md:self-center shrink-0">
                <button
                  onClick={() => toggleRuleActive(rule.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-all ${
                    rule.active 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${rule.active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <span>{rule.active ? 'Enforced' : 'Disabled'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
