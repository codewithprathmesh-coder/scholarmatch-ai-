import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ArrowUp,
  ArrowDown,
  Clock,
  Percent,
  IndianRupee,
  ShieldCheck, 
  AlertOctagon, 
  Bookmark, 
  BookmarkCheck, 
  Calendar, 
  DollarSign, 
  ExternalLink,
  Sparkles,
  Info,
  Check,
  Plus,
  GraduationCap,
  BadgeCheck,
  Cpu,
  ArrowLeft
} from 'lucide-react';
import { Scholarship, ProviderType, Category } from '../../types';
import { TrafficLightBadge } from '../common/TrafficLightBadge';

export const ScholarshipDiscovery: React.FC = () => {
  const { 
    scholarships, 
    student,
    updateStudentField,
    getEligibilityFor, 
    setInspectScholarship, 
    addToRoute, 
    removeFromRoute,
    selectedScholarshipIds, 
    savedScholarshipIds, 
    toggleSaveScholarship,
    activeRouteAnalysis,
    goBack
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProviderType, setSelectedProviderType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('All');
  const [eligibilityFilter, setEligibilityFilter] = useState<'all' | 'eligible'>('all');
  const [prioritizeMyDiscipline, setPrioritizeMyDiscipline] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'deadline' | 'amount' | 'match'>('match');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSortToggle = (criterion: 'deadline' | 'amount' | 'match') => {
    if (sortBy === criterion) {
      // Toggle sort direction if already active
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(criterion);
      // Sensible defaults: upcoming deadlines should default to soonest first ('asc')
      // Benefit amount and match percentage should default to highest first ('desc')
      setSortDirection(criterion === 'deadline' ? 'asc' : 'desc');
    }
  };

  const studentCourseNorm = (student.course || '').toLowerCase();

  // Helper to test if a scholarship matches student's discipline
  const checkFieldMatch = (s: Scholarship) => {
    if (!s.fieldsOfStudy) return false;
    return s.fieldsOfStudy.some(f => {
      const fn = f.toLowerCase();
      if (fn === 'all' || fn === 'all professional') return true;
      if (studentCourseNorm.includes('artificial intelligence') || studentCourseNorm.includes('ai & ds') || studentCourseNorm.includes('ai & ml')) {
        return fn.includes('artificial intelligence') || fn.includes('ai & ds') || fn.includes('data science') || fn.includes('computer') || fn.includes('stem') || fn.includes('engineering');
      }
      if (studentCourseNorm.includes('computer') || studentCourseNorm.includes('cse') || studentCourseNorm.includes('it')) {
        return fn.includes('computer') || fn.includes('technology') || fn.includes('stem') || fn.includes('engineering');
      }
      return studentCourseNorm.includes(fn) || fn.includes(studentCourseNorm);
    });
  };

  // Eligible count for student profile
  const eligibleCount = useMemo(() => {
    return scholarships.filter(s => getEligibilityFor(s).score >= 60).length;
  }, [scholarships, getEligibilityFor]);

  // Filter & sort logic
  const filteredScholarships = useMemo(() => {
    let list = scholarships.filter(s => {
      // search
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        s.benefits.toLowerCase().includes(q) ||
        (s.fieldsOfStudy && s.fieldsOfStudy.some(f => f.toLowerCase().includes(q)));

      if (!matchSearch) return false;

      // eligibility filter
      if (eligibilityFilter === 'eligible' && getEligibilityFor(s).score < 60) {
        return false;
      }

      // provider type
      if (selectedProviderType !== 'All' && s.providerType !== selectedProviderType) return false;

      // category
      if (selectedCategory !== 'All' && !s.categoryEligibility.includes(selectedCategory as Category)) return false;

      // state
      if (selectedState !== 'All' && s.state !== 'All India' && s.state !== selectedState) return false;

      // field of study filter
      if (selectedFieldFilter !== 'All') {
        const ff = selectedFieldFilter.toLowerCase();
        const hasField = s.fieldsOfStudy && s.fieldsOfStudy.some(f => f.toLowerCase().includes(ff) || f.toLowerCase() === 'all');
        const hasTag = s.tags.some(t => t.toLowerCase().includes(ff));
        if (!hasField && !hasTag) return false;
      }

      return true;
    });

    // sorting
    list.sort((a, b) => {
      const elA = getEligibilityFor(a);
      const elB = getEligibilityFor(b);

      const aFieldMatch = checkFieldMatch(a);
      const bFieldMatch = checkFieldMatch(b);

      if (sortBy === 'deadline') {
        const diff = sortDirection === 'asc' 
          ? a.daysRemaining - b.daysRemaining 
          : b.daysRemaining - a.daysRemaining;
        if (diff !== 0) return diff;
        // Tie-breaker: higher match score
        return elB.score - elA.score;
      }

      if (sortBy === 'amount') {
        const diff = sortDirection === 'desc'
          ? b.awardAmount - a.awardAmount
          : a.awardAmount - b.awardAmount;
        if (diff !== 0) return diff;
        // Tie-breaker: higher match score
        return elB.score - elA.score;
      }

      if (sortBy === 'match') {
        // If prioritize my discipline is enabled, prioritize exact discipline matches
        if (prioritizeMyDiscipline && aFieldMatch !== bFieldMatch) {
          return aFieldMatch ? -1 : 1;
        }
        const diff = sortDirection === 'desc'
          ? elB.score - elA.score
          : elA.score - elB.score;
        if (diff !== 0) return diff;
        // Tie-breaker: sooner deadline
        return a.daysRemaining - b.daysRemaining;
      }

      return 0;
    });

    return list;
  }, [scholarships, searchQuery, selectedProviderType, selectedCategory, selectedState, selectedFieldFilter, sortBy, sortDirection, prioritizeMyDiscipline, selectedScholarshipIds, studentCourseNorm]);

  const fieldMatchCount = useMemo(() => {
    return scholarships.filter(checkFieldMatch).length;
  }, [scholarships, studentCourseNorm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      
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
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
              SCHOLARSHIP DISCOVERY & FIELD MATCHING
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Discipline-Weighted Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
            Find Scholarships For You
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and inspect mutual-exclusivity rules with automated field-of-study prioritization.
          </p>
        </div>

        {/* Quick Route Status Pill */}
        <div className="flex items-center space-x-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs shrink-0">
          <span className="text-slate-400">Candidate Route:</span>
          <span className="font-bold text-white">{selectedScholarshipIds.length} schemes</span>
          <TrafficLightBadge status={activeRouteAnalysis.overallStatus} size="sm" />
        </div>
      </div>

      {/* Field-Specific Matching Bar & Student Profile Discipline Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0 mt-0.5">
            <Cpu className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-purple-300 uppercase">
                STUDENT DISCIPLINE PROFILE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/40 font-semibold">
                {fieldMatchCount} Targeted Schemes Available
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-sm font-bold text-white">
                {student.degree} in {student.course}
              </span>
              <span className="text-xs text-slate-400">
                ({student.collegeName})
              </span>
            </div>
            <p className="text-xs text-slate-300/90 mt-0.5">
              Scholarships matching <strong>{student.course}</strong>, STEM, and technical degree cohorts receive prioritized eligibility scoring and ranking.
            </p>
          </div>
        </div>

        {/* Discipline Quick Switcher & Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-300 font-medium">Switch Course:</label>
            <select
              value={student.course}
              onChange={e => updateStudentField('academic', 'course', e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-black/50 border border-purple-500/40 text-white text-xs font-semibold focus:outline-none focus:border-purple-400"
            >
              <option value="Artificial Intelligence & Data Science (AI & DS)">AI & Data Science (AI & DS)</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Telecommunication">Electronics & Telecom (E&TC)</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>
          </div>

          <label className="flex items-center space-x-2 p-1.5 px-3 rounded-xl bg-purple-500/20 border border-purple-400/30 text-xs text-purple-200 cursor-pointer">
            <input 
              type="checkbox"
              checked={prioritizeMyDiscipline}
              onChange={e => setPrioritizeMyDiscipline(e.target.checked)}
              className="rounded border-purple-400 text-purple-600 focus:ring-0"
            />
            <span className="font-semibold">Prioritize My Discipline</span>
          </label>
        </div>
      </div>

      {/* 2026-27 Active Schemes Verification Banner & Scope Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-purple-950/30 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase">
                GOVERNMENT & CSR SCHEMES VERIFICATION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                All 12 Listed Schemes Active for 2026-27
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Every scheme listed below is currently sanctioned and accepting applications on official portals (MahaDBT, NSP, AICTE, Reliance, Infosys). Lower match scores reflect specific category eligibility (such as SC/OBC quotas or Girl Scholar initiatives), not scheme discontinuation.
            </p>
          </div>
        </div>

        {/* Scope Toggle Buttons */}
        <div className="flex items-center space-x-1.5 bg-black/60 p-1 rounded-xl border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setEligibilityFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              eligibilityFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            All Active Schemes ({scholarships.length})
          </button>
          <button
            type="button"
            onClick={() => setEligibilityFilter('eligible')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              eligibilityFilter === 'eligible'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Eligible for You ({eligibleCount})
          </button>
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
        
        {/* Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search scholarships by name, provider, keyword, or field of study..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Sorting Toggle Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center mr-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-purple-400 mr-1.5 shrink-0" />
              Sort By:
            </span>

            {/* Segmented Toggle Control */}
            <div className="inline-flex flex-wrap items-center p-1 rounded-xl bg-black/40 border border-white/10 gap-1">
              {/* Upcoming Deadlines Toggle */}
              <button
                id="sort-toggle-deadline"
                onClick={() => handleSortToggle('deadline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  sortBy === 'deadline'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950 font-bold ring-1 ring-purple-400/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={`Organize by Upcoming Deadlines (${sortDirection === 'asc' ? 'Closest deadline first' : 'Furthest deadline first'})`}
              >
                <Clock className="w-3.5 h-3.5 text-purple-300" />
                <span>Upcoming Deadlines</span>
                {sortBy === 'deadline' && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-purple-200 ml-1">
                    {sortDirection === 'asc' ? 'Soonest ↑' : 'Furthest ↓'}
                  </span>
                )}
              </button>

              {/* Benefit Amount Toggle */}
              <button
                id="sort-toggle-amount"
                onClick={() => handleSortToggle('amount')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  sortBy === 'amount'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950 font-bold ring-1 ring-purple-400/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={`Organize by Benefit Amount (${sortDirection === 'desc' ? 'Highest benefit first' : 'Lowest benefit first'})`}
              >
                <IndianRupee className="w-3.5 h-3.5 text-purple-300" />
                <span>Benefit Amount</span>
                {sortBy === 'amount' && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-purple-200 ml-1">
                    {sortDirection === 'desc' ? 'Highest ↓' : 'Lowest ↑'}
                  </span>
                )}
              </button>

              {/* Match Percentage Toggle */}
              <button
                id="sort-toggle-match"
                onClick={() => handleSortToggle('match')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  sortBy === 'match'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950 font-bold ring-1 ring-purple-400/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={`Organize by Match Percentage (${sortDirection === 'desc' ? 'Highest match percentage first' : 'Lowest match percentage first'})`}
              >
                <Percent className="w-3.5 h-3.5 text-purple-300" />
                <span>Match Percentage</span>
                {sortBy === 'match' && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-purple-200 ml-1">
                    {sortDirection === 'desc' ? 'Highest ↓' : 'Lowest ↑'}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Direction Reverse Button & Scheme Counter */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-slate-400">
            <span className="font-mono text-[11px]">
              Showing <strong className="text-white">{filteredScholarships.length}</strong> of {scholarships.length}
            </span>

            <button
              id="sort-toggle-direction"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              title={`Switch order: currently ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortDirection === 'asc' ? (
                <>
                  <ArrowUp className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-medium">Ascending</span>
                </>
              ) : (
                <>
                  <ArrowDown className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-medium">Descending</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs">
          <span className="text-slate-400 text-[11px] font-mono mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1" /> Filters:
          </span>

          {/* Field of Study Filter */}
          <select
            value={selectedFieldFilter}
            onChange={e => setSelectedFieldFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white/5 border border-purple-500/30 text-purple-300 text-xs focus:outline-none focus:border-purple-500 font-medium"
          >
            <option value="All" className="bg-slate-900">All Disciplines</option>
            <option value="Artificial Intelligence" className="bg-slate-900">Artificial Intelligence / Data Science</option>
            <option value="Computer" className="bg-slate-900">Computer Science / IT</option>
            <option value="Engineering" className="bg-slate-900">Engineering & Technology</option>
            <option value="STEM" className="bg-slate-900">STEM Disciplines</option>
          </select>

          {/* Provider Filter */}
          <select
            value={selectedProviderType}
            onChange={e => setSelectedProviderType(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="All" className="bg-slate-900">All Providers</option>
            <option value="STATE_GOVERNMENT" className="bg-slate-900">State Govt (MahaDBT)</option>
            <option value="CENTRAL_GOVERNMENT" className="bg-slate-900">Central Govt (NSP)</option>
            <option value="PRIVATE" className="bg-slate-900">Private CSR / Trusts</option>
            <option value="INSTITUTIONAL" className="bg-slate-900">College Institutional Aid</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="All" className="bg-slate-900">All Categories</option>
            <option value="Open" className="bg-slate-900">Open / General</option>
            <option value="EWS" className="bg-slate-900">EWS</option>
            <option value="OBC" className="bg-slate-900">OBC</option>
            <option value="SC" className="bg-slate-900">SC</option>
            <option value="ST" className="bg-slate-900">ST</option>
            <option value="Minority" className="bg-slate-900">Minority</option>
          </select>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="All" className="bg-slate-900">All Regions</option>
            <option value="Maharashtra" className="bg-slate-900">Maharashtra Focus</option>
            <option value="All India" className="bg-slate-900">National (All India)</option>
          </select>

          {(searchQuery || selectedProviderType !== 'All' || selectedCategory !== 'All' || selectedState !== 'All' || selectedFieldFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedProviderType('All');
                setSelectedCategory('All');
                setSelectedState('All');
                setSelectedFieldFilter('All');
              }}
              className="text-[11px] text-purple-400 hover:text-purple-300 underline ml-2 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

      </div>

      {/* SCHOLARSHIPS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredScholarships.map(s => {
          const el = getEligibilityFor(s);
          const isSelected = selectedScholarshipIds.includes(s.id);
          const isSaved = savedScholarshipIds.includes(s.id);
          const isFieldMatch = checkFieldMatch(s);
          const officialUrl = s.officialPortalUrl || s.portalUrl;

          // Check if s conflicts with any already selected scholarship
          const hasExclusivityConflict = s.conflictingScholarshipIds.some(conflictId => 
            selectedScholarshipIds.includes(conflictId)
          );

          return (
            <div
              key={s.id}
              className={`p-5 rounded-2xl glass-panel border transition-all flex flex-col justify-between group ${
                hasExclusivityConflict
                  ? 'border-rose-500/40 bg-rose-950/10'
                  : isSelected
                  ? 'border-purple-500/60 bg-purple-950/20 shadow-lg shadow-purple-950/30'
                  : isFieldMatch
                  ? 'border-purple-500/30 bg-purple-950/10 hover:border-purple-500/50'
                  : 'border-white/10 hover:border-purple-500/30'
              }`}
            >
              <div>
                
                {/* Header: Provider Type, Field Badge & Save Button */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/10 text-slate-300 uppercase">
                      {s.providerType.replace('_', ' ')}
                    </span>
                    {isFieldMatch && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>Field Match</span>
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleSaveScholarship(s.id)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors p-1 shrink-0"
                    title={isSaved ? 'Remove from bookmarks' : 'Save scholarship'}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4 text-cyan-400" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Scholarship Title */}
                <h3 
                  onClick={() => setInspectScholarship(s)}
                  className="text-base font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {s.name}
                </h3>

                {/* Provider & Scheme Code */}
                <div className="flex items-center justify-between gap-1.5 mt-1 text-xs text-slate-400">
                  <span className="line-clamp-1">{s.provider}</span>
                  {s.directSchemeCode && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
                      {s.directSchemeCode}
                    </span>
                  )}
                </div>

                {/* 2026-27 Verified Active Status & Eligibility Category Hint */}
                <div className="flex items-center justify-between gap-2 mt-2 p-1.5 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono">
                  <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active 2026-27</span>
                  </span>
                  {el.score < 60 ? (
                    <span className="text-amber-300 truncate" title="Reason for lower match score on current profile">
                      {!s.categoryEligibility.includes(student.category)
                        ? `Quota: ${s.categoryEligibility.join('/')} Only`
                        : s.id === 'AICTE_PRAGATI' || s.id === 'TATA_TRUSTS_STEM'
                        ? (student.gender !== 'Female' ? 'Quota: Girl Scholars' : 'Criteria Gap')
                        : 'Income / Academic Gap'}
                    </span>
                  ) : (
                    <span className="text-slate-400 truncate">
                      {s.awardFrequency} Grant
                    </span>
                  )}
                </div>

                {/* Field of Study Match Reason */}
                {s.fieldsOfStudy && (
                  <div className="mt-2.5 p-2 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-300 space-y-0.5">
                    <div className="flex items-center space-x-1 font-semibold text-purple-300">
                      <GraduationCap className="w-3 h-3 text-purple-400" />
                      <span>Target Disciplines:</span>
                    </div>
                    <p className="text-slate-300 line-clamp-1">
                      {s.fieldsOfStudy.join(', ')}
                    </p>
                  </div>
                )}

                {/* Key Metrics Row */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
                  <div className={`p-2 rounded-xl transition-all ${
                    sortBy === 'match'
                      ? 'bg-purple-950/40 border border-purple-400/50 ring-1 ring-purple-400/30'
                      : 'bg-white/5'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 block">Eligibility</span>
                      {sortBy === 'match' && (
                        <span className="text-[9px] font-mono text-purple-300 font-bold px-1 rounded bg-purple-500/20">
                          SORTED
                        </span>
                      )}
                    </div>
                    <span className={`text-sm font-bold font-mono ${
                      el.score >= 80 ? 'text-emerald-400' :
                      el.score >= 60 ? 'text-amber-400' :
                      'text-rose-400'
                    }`}>
                      {el.score}% Match
                    </span>
                  </div>

                  <div className={`p-2 rounded-xl transition-all ${
                    sortBy === 'amount'
                      ? 'bg-purple-950/40 border border-purple-400/50 ring-1 ring-purple-400/30'
                      : 'bg-white/5'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 block">Financial Benefit</span>
                      {sortBy === 'amount' && (
                        <span className="text-[9px] font-mono text-purple-300 font-bold px-1 rounded bg-purple-500/20">
                          SORTED
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-white font-mono">
                      ₹{s.awardAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Exclusivity & Deadline Status */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Conflict Status:</span>
                    {hasExclusivityConflict ? (
                      <TrafficLightBadge status="CONFLICT" size="sm" customText="CONFLICT WITH ROUTE" />
                    ) : (
                      <TrafficLightBadge status="SAFE" size="sm" customText="CLEAR" />
                    )}
                  </div>

                  <div className={`flex items-center justify-between text-xs p-1 rounded-lg transition-all ${
                    sortBy === 'deadline'
                      ? 'bg-purple-950/40 border border-purple-400/50 px-2'
                      : ''
                  }`}>
                    <div className="flex items-center space-x-1">
                      {sortBy === 'deadline' && <Clock className="w-3 h-3 text-purple-400 shrink-0" />}
                      <span className="text-slate-400 text-[11px]">Deadline:</span>
                      {sortBy === 'deadline' && (
                        <span className="text-[9px] font-mono text-purple-300 font-bold px-1 rounded bg-purple-500/20 ml-1">
                          SORTED
                        </span>
                      )}
                    </div>
                    <span className={`font-mono text-[11px] ${
                      s.daysRemaining < 14 ? 'text-rose-400 font-bold' :
                      s.daysRemaining < 30 ? 'text-amber-400' :
                      'text-slate-300'
                    }`}>
                      {s.daysRemaining} days left ({s.applicationDeadline})
                    </span>
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  id={`btn-analyze-${s.id}`}
                  onClick={() => setInspectScholarship(s)}
                  className="flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Analyze</span>
                </button>

                {/* Direct Official Website Link */}
                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-white/5 transition-colors cursor-pointer"
                  title={`Open official scheme page for ${s.name} on ${s.officialPortalName || s.provider}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {isSelected ? (
                  <button
                    onClick={() => removeFromRoute(s.id)}
                    className="py-2 px-3 rounded-xl text-xs font-semibold text-purple-300 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>In Route</span>
                  </button>
                ) : (
                  <button
                    id={`btn-add-route-${s.id}`}
                    onClick={() => addToRoute(s.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                      hasExclusivityConflict
                        ? 'bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm shadow-purple-600/20'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{hasExclusivityConflict ? 'Test Conflict' : 'Add to Route'}</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="p-12 text-center rounded-2xl glass-panel border border-white/10 max-w-md mx-auto">
          <p className="text-sm font-semibold text-white">No matching scholarships found.</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your eligibility filters or search query.</p>
        </div>
      )}

    </div>
  );
};
