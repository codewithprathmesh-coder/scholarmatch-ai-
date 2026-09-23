export type EducationLevel = 'High School' | 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Doctoral';

export type Category = 'Open' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority';

export type ProviderType = 'CENTRAL_GOVERNMENT' | 'STATE_GOVERNMENT' | 'PRIVATE' | 'INSTITUTIONAL';

export type TrafficLightStatus = 'SAFE' | 'REVIEW' | 'CONFLICT';

export type CriteriaStatus = 'PASS' | 'FAIL' | 'WARNING' | 'UNKNOWN';

export type RuleSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export interface DocumentInfo {
  id: string;
  name: string;
  category: 'Identity' | 'Academic' | 'Financial' | 'Reservation' | 'Institutional';
  status: 'ready' | 'missing' | 'optional';
  fileName?: string;
  uploadedAt?: string;
  fileSize?: string;
  description?: string;
  mandatory?: boolean;
  issueDate?: string; // YYYY-MM-DD
  validUntil?: string; // YYYY-MM-DD
  validityStatus?: 'VALID' | 'EXPIRED' | 'EXPIRING_SOON' | 'NOT_SET' | 'NEEDS_DATE_INPUT';
  validityMessage?: string;
  financialYear?: string;
  // DigiLocker integration
  isDigiLockerVerified?: boolean;
  verifiedVia?: 'DIGILOCKER' | 'MANUAL_UPLOAD' | 'NONE';
  digiLockerDocId?: string;
  digiLockerDocUri?: string;
  digiLockerIssuer?: string;
  digiLockerVerifiedAt?: string;
}

export type StudentDocument = DocumentInfo;

export interface ActiveSchemeItem {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  providerType: ProviderType;
  applicationId: string;
  awardAmount: number;
  appliedDate: string;
  academicYear: string;
  currentStatus: 'APPLIED' | 'PENDING_INSTITUTE_VERIFICATION' | 'APPROVED_BY_NODAL_OFFICER' | 'DISBURSED' | 'RENEWAL_DUE';
  instituteDeadline: string;
  daysToInstituteDeadline: number;
  expectedRenewalDate: string;
  daysToRenewal: number;
  renewalMinPercentage: number;
  renewalMinAttendance: number;
  nodalOfficerName?: string;
  nodalOfficerEmail?: string;
  nodalOfficerPhone?: string;
  lastNudgedDate?: string;
}

export interface StudentProfile {
  // Step 1: Personal
  id: string;
  fullName: string;
  nameOnAadhaar?: string;
  nameOnMarksheet?: string;
  nameOnBankAccount?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  state: string;
  district: string;
  category: Category;
  hasDisability: boolean;
  disabilityPercentage?: number;
  isFirstGenerationLearner: boolean;

  // Step 2: Academic
  collegeName: string;
  course: string;
  degree: string;
  educationLevel: EducationLevel;
  yearOfStudy: number; // e.g. 2 for 2nd Year
  currentSemester: number;
  academicPercentage: number; // e.g. 78%
  attendancePercentage: number; // e.g. 85%
  university: string;

  // Step 3: Financial & Banking
  annualFamilyIncome: number; // e.g. 180000
  hasIncomeCertificate: boolean;
  economicCategory: 'BPL' | 'EWS' | 'Low Income' | 'Middle Income';
  familyMembersCount: number;
  otherFinancialAidReceived: boolean;
  isDbtBankSeeded: boolean; // Aadhaar linked to NPCI mapper
  dbtBankName?: string;
  dbtSeedingStatus?: 'SEEDED' | 'NOT_SEEDED' | 'IN_PROGRESS' | 'UNKNOWN';
  dbtLastCheckedDate?: string;

  // Step 4: Scholarship History & Active Wallet
  currentlyReceivedScholarships: string[]; // names or IDs
  previousScholarships: string[];
  hasGovtScholarshipCurrently: boolean;
  hasPrivateScholarshipCurrently: boolean;
  renewalStatus: 'None' | 'Eligible' | 'Applied' | 'Approved';
  activeWalletSchemes?: ActiveSchemeItem[];

  // Step 5: Documents
  documents: DocumentInfo[];
  profileCompleteness: number; // 0 - 100
  isDigiLockerConnected?: boolean;
  digiLockerId?: string;
  digiLockerConnectedAt?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  code: string;
  provider: string;
  providerType: ProviderType;
  state: string; // 'All India' | 'Maharashtra' | etc.
  educationLevel: EducationLevel[];
  courseEligibility: string[]; // e.g. ['Engineering', 'Medical', 'General Science', 'All']
  categoryEligibility: Category[];
  incomeLimit: number; // e.g. 800000 (0 if no limit)
  minAcademicPercentage: number; // e.g. 50
  requiredDocuments: string[]; // Document names
  benefits: string; // Human description e.g. '50% Tuition Waiver + Exam Fee'
  awardAmount: number; // Numerical value for math e.g. 55000
  awardFrequency: 'Annual' | 'One-time' | 'Monthly' | 'Course Duration';
  applicationDeadline: string; // ISO date string or '2026-10-31'
  daysRemaining: number;
  renewalRules: string;
  eligibilityConditions: string[];
  exclusivityRules: string[];
  conflictingScholarshipIds: string[];
  compatibleScholarshipIds: string[];
  sourceUrl: string;
  portalUrl: string;
  officialPortalUrl?: string; // Direct official provider application page (specific scheme page, not dashboard)
  officialPortalName?: string; // e.g. "MahaDBT Official Portal"
  directSchemeCode?: string; // e.g. "MahaDBT Scheme ID: 1142" or "NSP Scheme Code: 1054"
  fieldsOfStudy?: string[]; // Specific disciplines e.g. ['Artificial Intelligence & Data Science', 'Computer Engineering', 'STEM']
  fieldMatchReason?: string;
  description: string;
  tags: string[];
  isPopular?: boolean;
}

export interface CriteriaCheck {
  criteria: string;
  required: string;
  studentValue: string;
  status: CriteriaStatus;
  message: string;
  isFieldMatch?: boolean;
}

export interface EligibilityResult {
  scholarshipId: string;
  score: number; // 0 - 100%
  status: 'ELIGIBLE' | 'PARTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
  checks: CriteriaCheck[];
  summary: string;
  isFieldMatch?: boolean;
  matchedField?: string;
}

export type ConflictRelationship = 'MUTUALLY_EXCLUSIVE' | 'COMPATIBLE' | 'REVIEW_REQUIRED';

export interface ConflictRule {
  id: string;
  scholarshipAId: string;
  scholarshipBId: string;
  scholarshipAName?: string;
  scholarshipBName?: string;
  relationship: ConflictRelationship;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  source: string;
  policyCitation?: string;
  active: boolean;
}

export interface PairwiseConflictResult {
  scholarshipA: Scholarship;
  scholarshipB: Scholarship;
  relationship: ConflictRelationship;
  trafficStatus: TrafficLightStatus;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  ruleId?: string;
}

export interface ActiveRouteAnalysis {
  selectedScholarships: Scholarship[];
  overallStatus: TrafficLightStatus;
  totalFinancialSupport: number;
  conflicts: PairwiseConflictResult[];
  reviews: PairwiseConflictResult[];
  safePairs: PairwiseConflictResult[];
  alternativeSuggestions: Scholarship[];
}

export interface SafeRoute {
  id: string;
  name: string;
  tagline: string;
  scholarships: Scholarship[];
  totalEstimatedSupport: number;
  averageEligibility: number;
  riskStatus: TrafficLightStatus;
  reason: string;
  bestFor: string;
}

export interface StackableAidGroup {
  id: string;
  title: string;
  description: string;
  primaryGovtScheme: Scholarship | null;
  safeStackablePrivateSchemes: Scholarship[];
  totalSupportAmount: number;
  stackedBonusAmount: number;
  multiplierFactor: string;
  legalExemptionCitation: string;
  conflictFreeCertificate: string;
}

export interface ParsedRuleEntity {
  id: string;
  rawText: string;
  title: string;
  ruleType: 'MUTUAL EXCLUSIVITY' | 'INCOME THRESHOLD' | 'MINIMUM MERIT' | 'RENEWAL RESTRICTION';
  detectedEntities: string[];
  conditionString: string;
  outputAction: string;
  confidence: number;
  applicableSchemes: string[];
  sourceReference: string;
}

export interface GraphNode {
  id: string;
  label: string;
  provider: string;
  type: ProviderType;
  amount: number;
  eligibility: number;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: ConflictRelationship;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
}
