import { 
  Scholarship, 
  ConflictRule, 
  PairwiseConflictResult, 
  ActiveRouteAnalysis, 
  TrafficLightStatus 
} from '../types';

/**
 * Checks conflict between two individual scholarships based on rules and heuristic policies
 */
export function checkPairwiseConflict(
  scholarshipA: Scholarship, 
  scholarshipB: Scholarship, 
  rules: ConflictRule[]
): PairwiseConflictResult {
  if (scholarshipA.id === scholarshipB.id) {
    return {
      scholarshipA,
      scholarshipB,
      relationship: 'COMPATIBLE',
      trafficStatus: 'SAFE',
      severity: 'LOW',
      reason: 'Identical scheme reference.'
    };
  }

  // 1. Look for explicit configured rule in database
  const directRule = rules.find(r => 
    r.active && 
    ((r.scholarshipAId === scholarshipA.id && r.scholarshipBId === scholarshipB.id) ||
     (r.scholarshipAId === scholarshipB.id && r.scholarshipBId === scholarshipA.id))
  );

  if (directRule) {
    const trafficStatus: TrafficLightStatus = 
      directRule.relationship === 'MUTUALLY_EXCLUSIVE' ? 'CONFLICT' :
      directRule.relationship === 'REVIEW_REQUIRED' ? 'REVIEW' : 'SAFE';

    return {
      scholarshipA,
      scholarshipB,
      relationship: directRule.relationship,
      trafficStatus,
      severity: directRule.severity,
      reason: directRule.reason,
      ruleId: directRule.id
    };
  }

  // 2. Check scholarship object explicit lists
  if (scholarshipA.conflictingScholarshipIds.includes(scholarshipB.id) || 
      scholarshipB.conflictingScholarshipIds.includes(scholarshipA.id)) {
    return {
      scholarshipA,
      scholarshipB,
      relationship: 'MUTUALLY_EXCLUSIVE',
      trafficStatus: 'CONFLICT',
      severity: 'HIGH',
      reason: `Administrative conflict: ${scholarshipA.name} and ${scholarshipB.name} have a declared mutual-exclusivity restriction under scheme guidelines.`
    };
  }

  if (scholarshipA.compatibleScholarshipIds.includes(scholarshipB.id) || 
      scholarshipB.compatibleScholarshipIds.includes(scholarshipA.id)) {
    return {
      scholarshipA,
      scholarshipB,
      relationship: 'COMPATIBLE',
      trafficStatus: 'SAFE',
      severity: 'LOW',
      reason: `Verified Compatible: These schemes address complementary expense categories (e.g. tuition waiver vs. stipend/hostel allowance).`
    };
  }

  // 3. Fallback Heuristic Policy
  // Policy A: Dual government tuition scholarships (Central Govt + State Govt fee schemes)
  const isBothGovernment = 
    (scholarshipA.providerType === 'CENTRAL_GOVERNMENT' || scholarshipA.providerType === 'STATE_GOVERNMENT') &&
    (scholarshipB.providerType === 'CENTRAL_GOVERNMENT' || scholarshipB.providerType === 'STATE_GOVERNMENT');

  const bothCoverTuition = 
    (scholarshipA.benefits.toLowerCase().includes('fee') || scholarshipA.benefits.toLowerCase().includes('tuition')) &&
    (scholarshipB.benefits.toLowerCase().includes('fee') || scholarshipB.benefits.toLowerCase().includes('tuition'));

  if (isBothGovernment && bothCoverTuition && scholarshipA.providerType !== scholarshipB.providerType) {
    return {
      scholarshipA,
      scholarshipB,
      relationship: 'MUTUALLY_EXCLUSIVE',
      trafficStatus: 'CONFLICT',
      severity: 'HIGH',
      reason: `Automated Conflict: State and Central government guidelines universally prohibit drawing dual government tuition fee compensations simultaneously.`
    };
  }

  // Policy B: Private CSR + Government Scheme -> Generally Compatible
  const onePrivateOneGovt = 
    (scholarshipA.providerType === 'PRIVATE' && (scholarshipB.providerType === 'STATE_GOVERNMENT' || scholarshipB.providerType === 'CENTRAL_GOVERNMENT')) ||
    (scholarshipB.providerType === 'PRIVATE' && (scholarshipA.providerType === 'STATE_GOVERNMENT' || scholarshipA.providerType === 'CENTRAL_GOVERNMENT'));

  if (onePrivateOneGovt) {
    return {
      scholarshipA,
      scholarshipB,
      relationship: 'COMPATIBLE',
      trafficStatus: 'SAFE',
      severity: 'LOW',
      reason: `Compatible: Private philanthropic stipends are generally permitted alongside statutory government fee concessions.`
    };
  }

  // Default: Review required
  return {
    scholarshipA,
    scholarshipB,
    relationship: 'REVIEW_REQUIRED',
    trafficStatus: 'REVIEW',
    severity: 'MEDIUM',
    reason: `Unspecified relationship: Please verify specific college sanctioning guidelines before submitting both applications concurrently.`
  };
}

/**
 * Analyzes a full candidate route (set of selected scholarships)
 */
export function analyzeSelectedRoute(
  selectedScholarships: Scholarship[], 
  allScholarships: Scholarship[],
  rules: ConflictRule[]
): ActiveRouteAnalysis {
  if (selectedScholarships.length === 0) {
    return {
      selectedScholarships: [],
      overallStatus: 'SAFE',
      totalFinancialSupport: 0,
      conflicts: [],
      reviews: [],
      safePairs: [],
      alternativeSuggestions: []
    };
  }

  const conflicts: PairwiseConflictResult[] = [];
  const reviews: PairwiseConflictResult[] = [];
  const safePairs: PairwiseConflictResult[] = [];

  // Pairwise cross checking
  for (let i = 0; i < selectedScholarships.length; i++) {
    for (let j = i + 1; j < selectedScholarships.length; j++) {
      const result = checkPairwiseConflict(selectedScholarships[i], selectedScholarships[j], rules);
      if (result.trafficStatus === 'CONFLICT') {
        conflicts.push(result);
      } else if (result.trafficStatus === 'REVIEW') {
        reviews.push(result);
      } else {
        safePairs.push(result);
      }
    }
  }

  // Overall status
  let overallStatus: TrafficLightStatus = 'SAFE';
  if (conflicts.length > 0) {
    overallStatus = 'CONFLICT';
  } else if (reviews.length > 0) {
    overallStatus = 'REVIEW';
  }

  // Total financial sum
  const totalFinancialSupport = selectedScholarships.reduce((sum, s) => sum + s.awardAmount, 0);

  // Alternative suggestions when conflicts exist
  const conflictingIds = new Set<string>();
  conflicts.forEach(c => {
    conflictingIds.add(c.scholarshipA.id);
    conflictingIds.add(c.scholarshipB.id);
  });

  const selectedIds = new Set(selectedScholarships.map(s => s.id));
  
  // Find safe alternatives that are not selected, not conflicting with the safe ones, and provide good value
  const alternativeSuggestions = allScholarships.filter(s => {
    if (selectedIds.has(s.id)) return false;
    
    // Check if s is safe with at least the first chosen scholarship
    if (selectedScholarships.length > 0) {
      const primary = selectedScholarships[0];
      const check = checkPairwiseConflict(primary, s, rules);
      return check.trafficStatus === 'SAFE';
    }
    return true;
  }).slice(0, 3);

  return {
    selectedScholarships,
    overallStatus,
    totalFinancialSupport,
    conflicts,
    reviews,
    safePairs,
    alternativeSuggestions
  };
}
