import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  BookOpen, 
  IndianRupee, 
  History, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  UploadCloud, 
  FileCheck, 
  Trash2, 
  PlayCircle, 
  Building2, 
  GraduationCap, 
  School, 
  MapPin,
  RotateCcw,
  Plus,
  Check
} from 'lucide-react';
import { Category, EducationLevel } from '../../types';
import { AutocompleteInput } from '../common/AutocompleteInput';
import { 
  INDIAN_COLLEGES, 
  INDIAN_UNIVERSITIES, 
  INDIAN_DISTRICTS, 
  INDIAN_DEGREES, 
  INDIAN_COURSES,
  INDIAN_STATES,
  EXISTING_SCHOLARSHIPS_LIST
} from '../../data/indianInstitutions';
import { NameConsistencyChecker } from './NameConsistencyChecker';
import { DbtReadinessChecker } from './DbtReadinessChecker';

export const ProfileSetup: React.FC = () => {
  const { 
    student, 
    setStudent, 
    loadPresetStudent, 
    clearStudentProfile,
    runFullAnalysis, 
    uploadDocument, 
    deleteDocument,
    goBack 
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Formatted Autocomplete Option sets
  const collegeOptions = useMemo(() => {
    return INDIAN_COLLEGES.map(c => ({
      label: c.name,
      sublabel: `${c.city}, ${c.state} • ${c.type}`,
      badge: c.category,
      value: c.name
    }));
  }, []);

  const universityOptions = useMemo(() => {
    return INDIAN_UNIVERSITIES.map(u => ({
      label: u.name,
      sublabel: `${u.city}, ${u.state}`,
      badge: u.type,
      value: u.name
    }));
  }, []);

  const districtOptions = useMemo(() => {
    return INDIAN_DISTRICTS.map(d => ({
      label: d.name,
      sublabel: d.state,
      badge: d.isMaharashtra ? 'Maharashtra' : d.state,
      value: d.name
    }));
  }, []);

  const degreeOptions = useMemo(() => {
    return INDIAN_DEGREES.map(d => ({
      label: d,
      value: d
    }));
  }, []);

  const courseOptions = useMemo(() => {
    return INDIAN_COURSES.map(c => ({
      label: c,
      value: c
    }));
  }, []);

  const steps = [
    { num: 1, title: 'Personal', icon: User },
    { num: 2, title: 'Academic', icon: BookOpen },
    { num: 3, title: 'Financial', icon: IndianRupee },
    { num: 4, title: 'History', icon: History },
    { num: 5, title: 'Documents', icon: FileText }
  ];

  const handleInputChange = (field: string, value: any) => {
    setStudent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadDocument(docId, e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
              STUDENT PROFILE WIZARD
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Personal & Academic Information
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete your profile to unlock verified eligibility checks and conflict-free safe routes.
          </p>
        </div>

        {/* Quick Demo Presets & Clear Profile Button */}
        <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 shrink-0">
          <span className="text-[11px] font-mono text-slate-400 px-1">Presets:</span>
          <button
            type="button"
            onClick={() => loadPresetStudent('blank')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center space-x-1 cursor-pointer ${
              !student.fullName
                ? 'bg-cyan-600 text-white shadow-sm font-semibold' 
                : 'text-cyan-300 hover:text-white hover:bg-cyan-500/20'
            }`}
            title="Start with a blank profile for a new student"
          >
            <Plus className="w-3 h-3" />
            <span>New Student</span>
          </button>
          <button
            type="button"
            onClick={() => loadPresetStudent('aarav')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              student.fullName === 'Aarav Sharma' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Aarav (B.Tech)
          </button>
          <button
            type="button"
            onClick={() => loadPresetStudent('ananya')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              student.fullName === 'Ananya Patil' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Ananya (OBC)
          </button>
          <button
            type="button"
            onClick={() => loadPresetStudent('rahul')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              student.fullName === 'Rahul Deshmukh' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Rahul (SC)
          </button>
          <button
            type="button"
            onClick={() => loadPresetStudent('kjsit')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              student.fullName === 'Prathmesh Dhore' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Prathmesh (KJSIT)
          </button>
          <div className="h-4 w-[1px] bg-white/10 mx-0.5" />
          <button
            type="button"
            onClick={clearStudentProfile}
            className="px-2.5 py-1 text-xs rounded-lg font-medium text-rose-300 hover:text-white hover:bg-rose-600/30 transition-all flex items-center space-x-1 cursor-pointer"
            title="Reset and clear all inputs to start fresh"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Form</span>
          </button>
        </div>
      </div>

      {/* Aarav Sharma Pre-fill Notice Banner if loaded */}
      {student.fullName === 'Aarav Sharma' && (
        <div className="mb-6 p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5 text-purple-200">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              Sample profile for <strong>Aarav Sharma</strong> is loaded for quick testing. Entering your own information?
            </span>
          </div>
          <button
            type="button"
            onClick={clearStudentProfile}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center space-x-1.5 shadow cursor-pointer text-xs shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All & Start Fresh</span>
          </button>
        </div>
      )}

      {/* Progress & Completeness Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 mb-8">
        <div className="flex items-center justify-between text-xs mb-2 font-medium">
          <span className="text-slate-300">Profile Completeness</span>
          <span className="text-cyan-400 font-mono font-bold">{student.profileCompleteness}% Verified</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${student.profileCompleteness}%` }}
          />
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-5 gap-2 mt-6">
          {steps.map(s => {
            const Icon = s.icon;
            const isCurrent = currentStep === s.num;
            const isDone = currentStep > s.num;

            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex flex-col sm:flex-row items-center justify-center p-2 sm:p-2.5 rounded-xl border text-xs transition-all ${
                  isCurrent 
                    ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-sm' 
                    : isDone
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="sm:mr-2">
                  {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="text-[11px] font-medium hidden sm:inline">{s.title}</span>
                <span className="text-[10px] font-mono sm:hidden">{s.num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wizard Form Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 relative">
        
        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white font-display border-b border-white/10 pb-3">
              Step 1: Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={student.fullName}
                  onChange={e => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="e.g. Aarav Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Age</label>
                <input
                  type="number"
                  value={student.age || ''}
                  onChange={e => handleInputChange('age', e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="e.g. 19"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Gender</label>
                <select
                  value={student.gender}
                  onChange={e => handleInputChange('gender', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="Male" className="bg-slate-900">Male</option>
                  <option value="Female" className="bg-slate-900">Female</option>
                  <option value="Other" className="bg-slate-900">Other</option>
                  <option value="Prefer not to say" className="bg-slate-900">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">State of Domicile</label>
                <select
                  value={student.state}
                  onChange={e => handleInputChange('state', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {INDIAN_STATES.map(st => (
                    <option key={st} value={st} className="bg-slate-900">
                      {st} {st === 'Maharashtra' ? '★ (MahaDBT Native State)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <AutocompleteInput
                  id="student-district"
                  label="District"
                  badge="All Districts"
                  value={student.district}
                  onChange={val => handleInputChange('district', val)}
                  options={districtOptions}
                  placeholder="Type or search district (e.g. Pune, Mumbai, Nagpur)..."
                  popularSuggestions={['Pune', 'Mumbai Suburban', 'Nagpur', 'Nashik', 'Chhatrapati Sambhajinagar', 'Thane', 'Kolhapur']}
                  hint="Type any Maharashtra or Indian district. Custom districts are also accepted."
                  icon={<MapPin className="w-4 h-4 text-cyan-400" />}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Social Category</label>
                <select
                  value={student.category}
                  onChange={e => handleInputChange('category', e.target.value as Category)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="Open" className="bg-slate-900">Open / General</option>
                  <option value="EWS" className="bg-slate-900">EWS (Economically Weaker Section)</option>
                  <option value="OBC" className="bg-slate-900">OBC (Other Backward Class)</option>
                  <option value="SC" className="bg-slate-900">SC (Scheduled Caste)</option>
                  <option value="ST" className="bg-slate-900">ST (Scheduled Tribe)</option>
                  <option value="Minority" className="bg-slate-900">Religious Minority</option>
                </select>
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={student.isFirstGenerationLearner}
                  onChange={e => handleInputChange('isFirstGenerationLearner', e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs text-slate-300">
                  First-Generation Learner (no parent attended college)
                </span>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={student.hasDisability}
                  onChange={e => handleInputChange('hasDisability', e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs text-slate-300">
                  Person with Benchmark Disability (PwD)
                </span>
              </label>
            </div>

            {/* Fuzzy Identity Sync (Name Mismatch Detector) */}
            <div className="pt-2">
              <NameConsistencyChecker
                fullName={student.fullName}
                nameOnAadhaar={student.nameOnAadhaar}
                nameOnMarksheet={student.nameOnMarksheet}
                nameOnBankAccount={student.nameOnBankAccount}
                onUpdateField={handleInputChange}
              />
            </div>
          </div>
        )}

        {/* STEP 2: ACADEMIC INFORMATION */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white font-display border-b border-white/10 pb-3">
              Step 2: Academic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <AutocompleteInput
                  id="college-name"
                  label="College / Institution Name"
                  badge="Pan-India Directory"
                  value={student.collegeName}
                  onChange={val => handleInputChange('collegeName', val)}
                  options={collegeOptions}
                  placeholder="Search every college in India (e.g. COEP, VJTI, IIT Bombay, PICT, SPIT, Ferguson)..."
                  popularSuggestions={[
                    'K. J. Somaiya Institute of Technology (KJSIT Sion, Mumbai)',
                    'K. J. Somaiya College of Engineering (KJSCE Vidyavihar)',
                    'COEP Technological University (College of Engineering Pune)',
                    'Veermata Jijabai Technological Institute (VJTI)',
                    'Pune Institute of Computer Technology (PICT)',
                    'Sardar Patel Institute of Technology (SPIT)',
                    'Thakur College of Engineering and Technology (TCET Kandivali)',
                    'Indian Institute of Technology Bombay (IIT Bombay)'
                  ]}
                  hint="Type any keyword, acronym, or city to filter instantly. Custom college names are always preserved."
                  icon={<Building2 className="w-4 h-4 text-purple-400" />}
                />
              </div>

              <div>
                <AutocompleteInput
                  id="affiliated-university"
                  label="Affiliated University"
                  badge="State & Central"
                  value={student.university}
                  onChange={val => handleInputChange('university', val)}
                  options={universityOptions}
                  placeholder="Search university (e.g. SPPU, Mumbai University, DBATU, DU, VTU)..."
                  popularSuggestions={[
                    'Savitribai Phule Pune University (SPPU Pune)',
                    'University of Mumbai (MU Mumbai)',
                    'Dr. Babasaheb Ambedkar Technological University (DBATU Lonere)',
                    'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU Nagpur)',
                    'Maharashtra State Board of Technical Education (MSBTE)'
                  ]}
                  hint="Type university name or acronym. All state, central, and technological boards included."
                  icon={<School className="w-4 h-4 text-cyan-400" />}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Education Level</label>
                <select
                  value={student.educationLevel}
                  onChange={e => handleInputChange('educationLevel', e.target.value as EducationLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="Undergraduate" className="bg-slate-900">Undergraduate (UG)</option>
                  <option value="Postgraduate" className="bg-slate-900">Postgraduate (PG)</option>
                  <option value="Diploma" className="bg-slate-900">Diploma / Polytechnic</option>
                  <option value="High School" className="bg-slate-900">Junior College / 12th</option>
                </select>
              </div>

              <div>
                <AutocompleteInput
                  id="degree-program"
                  label="Degree Program"
                  badge="All Degrees"
                  value={student.degree}
                  onChange={val => handleInputChange('degree', val)}
                  options={degreeOptions}
                  placeholder="Search or select degree (e.g. B.Tech, B.E., B.Sc, Diploma, MBBS)..."
                  popularSuggestions={[
                    'B.Tech - Bachelor of Technology',
                    'B.E. - Bachelor of Engineering',
                    'B.Sc - Bachelor of Science',
                    'Diploma in Engineering (Polytechnic)',
                    'M.Tech - Master of Technology'
                  ]}
                  hint="Select your formal degree abbreviation or full title."
                  icon={<GraduationCap className="w-4 h-4 text-purple-400" />}
                />
              </div>

              <div>
                <AutocompleteInput
                  id="course-branch"
                  label="Course / Branch / Specialization"
                  badge="Curriculum"
                  value={student.course}
                  onChange={val => handleInputChange('course', val)}
                  options={courseOptions}
                  placeholder="Search branch (e.g. Computer Engineering, AI & DS, IT, Mechanical)..."
                  popularSuggestions={[
                    'Computer Engineering',
                    'Computer Science and Engineering (CSE)',
                    'Artificial Intelligence & Data Science (AI & DS)',
                    'Information Technology (IT)',
                    'Electronics and Telecommunication (E&TC)'
                  ]}
                  hint="Matches standard DTE, AICTE, and University syllabus branches."
                  icon={<BookOpen className="w-4 h-4 text-emerald-400" />}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Year of Study</label>
                <select
                  value={student.yearOfStudy}
                  onChange={e => handleInputChange('yearOfStudy', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value={1} className="bg-slate-900">1st Year (Fresher)</option>
                  <option value={2} className="bg-slate-900">2nd Year</option>
                  <option value={3} className="bg-slate-900">3rd Year</option>
                  <option value={4} className="bg-slate-900">4th Year (Final)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Semester</label>
                <input
                  type="number"
                  value={student.currentSemester || ''}
                  onChange={e => handleInputChange('currentSemester', e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="e.g. 1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Previous Percentage / CGPA (%)</label>
                <input
                  type="number"
                  value={student.academicPercentage || ''}
                  onChange={e => handleInputChange('academicPercentage', e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="e.g. 78"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Attendance (%)</label>
                <input
                  type="number"
                  value={student.attendancePercentage || ''}
                  onChange={e => handleInputChange('attendancePercentage', e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="e.g. 85"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FINANCIAL INFORMATION */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white font-display border-b border-white/10 pb-3">
              Step 3: Financial & Income Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Annual Family Income (INR ₹)
                </label>
                <input
                  type="number"
                  value={student.annualFamilyIncome || ''}
                  onChange={e => handleInputChange('annualFamilyIncome', e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="e.g. 180000"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {student.annualFamilyIncome > 0 
                    ? `Current format: ₹${student.annualFamilyIncome.toLocaleString('en-IN')} / year`
                    : 'Enter total annual family income'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Economic Classification
                </label>
                <select
                  value={student.economicCategory}
                  onChange={e => handleInputChange('economicCategory', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="BPL" className="bg-slate-900">Below Poverty Line (BPL &lt; ₹1L)</option>
                  <option value="Low Income" className="bg-slate-900">Low Income (₹1L - ₹2.5L)</option>
                  <option value="EWS" className="bg-slate-900">EWS (Under ₹8L)</option>
                  <option value="Middle Income" className="bg-slate-900">Middle Income (&gt; ₹8L)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Number of Dependent Family Members
                </label>
                <input
                  type="number"
                  value={student.familyMembersCount || ''}
                  onChange={e => handleInputChange('familyMembersCount', e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="e.g. 4"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer w-full mt-4">
                  <input
                    type="checkbox"
                    checked={student.hasIncomeCertificate}
                    onChange={e => handleInputChange('hasIncomeCertificate', e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-xs text-white font-medium block">
                      Tahsildar Income Certificate Available
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Mandatory for MahaDBT EBC & Central Sector
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Mandatory Aadhaar-DBT Bank Seeding Pre-Check */}
            <div className="pt-2">
              <DbtReadinessChecker
                isDbtBankSeeded={!!student.isDbtBankSeeded}
                dbtBankName={student.dbtBankName}
                dbtSeedingStatus={student.dbtSeedingStatus}
                studentName={student.fullName}
                collegeName={student.collegeName}
                onUpdateField={handleInputChange}
              />
            </div>
          </div>
        )}

        {/* STEP 4: SCHOLARSHIP HISTORY */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white font-display border-b border-white/10 pb-3">
              Step 4: Scholarship History & Existing Aid
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20">
                <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
                  Why this step is critical:
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Existing active scholarships are the #1 cause of portal disqualification. If you are already receiving a government scholarship, applying for a second one without formal surrender triggers duplicate benefit flags.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={student.hasGovtScholarshipCurrently}
                    onChange={e => handleInputChange('hasGovtScholarshipCurrently', e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-xs text-white font-medium block">
                      Currently receiving a Government Scholarship
                    </span>
                    <span className="text-[10px] text-slate-400">
                      e.g. NSP, MahaDBT, or AICTE
                    </span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={student.hasPrivateScholarshipCurrently}
                    onChange={e => handleInputChange('hasPrivateScholarshipCurrently', e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-xs text-white font-medium block">
                      Currently receiving a Private Foundation Grant
                    </span>
                    <span className="text-[10px] text-slate-400">
                      e.g. Reliance, Tata, or Sitaram Jindal
                    </span>
                  </div>
                </label>
              </div>

              {(student.hasGovtScholarshipCurrently || student.hasPrivateScholarshipCurrently) && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2 animate-in fade-in">
                  <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Select Active Scholarship / Grant Scheme Name</span>
                  </div>
                  <AutocompleteInput
                    id="existing-scholarship-search"
                    label="Current Scheme Title"
                    badge="Conflict Engine Input"
                    value={student.currentlyReceivedScholarships[0] || ''}
                    onChange={val => handleInputChange('currentlyReceivedScholarships', val ? [val] : [])}
                    options={EXISTING_SCHOLARSHIPS_LIST}
                    placeholder="Search scheme (e.g. MahaDBT EBC, NSP CSSS, Reliance, Tata, AICTE Pragati)..."
                    popularSuggestions={[
                      'MahaDBT - Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti (EBC Fee Concession)',
                      'NSP - Central Sector Scheme of Scholarship for College and University Students (CSSS)',
                      'AICTE - Pragati Scholarship Scheme for Girl Students (Degree/Diploma)',
                      'Reliance Foundation Undergraduate Scholarship'
                    ]}
                    hint="Our Conflict Matrix uses this scheme title to check double-dipping and dual-disqualification rules."
                    icon={<FileCheck className="w-4 h-4 text-amber-400" />}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Renewal Status for Ongoing Aid
                </label>
                <select
                  value={student.renewalStatus}
                  onChange={e => handleInputChange('renewalStatus', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="None" className="bg-slate-900">None (Fresh Applicant)</option>
                  <option value="Eligible" className="bg-slate-900">Eligible for Renewal</option>
                  <option value="Applied" className="bg-slate-900">Renewal Application Submitted</option>
                  <option value="Approved" className="bg-slate-900">Renewal Sanctioned</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DOCUMENTS REPOSITORY */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white font-display">
                Step 5: Document Repository & Verification
              </h2>
              <span className="text-xs text-purple-300 font-mono">
                {student.documents.filter(d => d.status === 'ready').length} of {student.documents.length} Ready
              </span>
            </div>

            <div className="space-y-3">
              {student.documents.map(doc => {
                const isReady = doc.status === 'ready';

                return (
                  <div 
                    key={doc.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      isReady 
                        ? 'bg-emerald-500/10 border-emerald-500/20' 
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-400'
                      }`}>
                        {isReady ? <FileCheck className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-white">{doc.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-mono ${
                            isReady ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                        {isReady && doc.fileName && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            {doc.fileName} • {doc.fileSize}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      {isReady ? (
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Remove document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <label className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-medium border border-purple-500/30 cursor-pointer flex items-center space-x-1">
                          <UploadCloud className="w-3.5 h-3.5 text-cyan-300" />
                          <span>Upload</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={e => handleFileUpload(doc.id, e)} 
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Controls Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : <div />}

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              id="btn-analyze-my-scholarships"
              onClick={runFullAnalysis}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-purple-600/40 flex items-center space-x-2 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>Analyze My Scholarship Options</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
