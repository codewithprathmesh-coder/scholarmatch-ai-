/**
 * Fuzzy Identity Sync & Name Mismatch Detector
 * Real-life Problem: Beneficiary Name Mismatch across 10th Marksheet, Aadhaar Card,
 * and Bank Passbook is one of the highest causes of DBT scholarship rejection.
 */

export interface NameComparisonResult {
  pair: string;
  nameA: string;
  nameB: string;
  similarity: number; // 0 to 100
  isMatch: boolean;
  isWarning: boolean;
  notes: string;
}

export interface NameMatchAnalysis {
  overallScore: number;
  status: 'PERFECT_MATCH' | 'ACCEPTABLE_VARIATION' | 'CRITICAL_MISMATCH';
  headline: string;
  badgeColor: 'emerald' | 'amber' | 'rose';
  detailedAdvice: string;
  hasInitialMismatch: boolean;
  hasMissingNameComponent: boolean;
  comparisons: NameComparisonResult[];
}

function cleanString(str: string): string {
  if (!str) return '';
  return str
    .toUpperCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\b(MR|MS|MRS|SHRI|SMT|KUMAR|KUMARI)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = cleanString(str1);
  const s2 = cleanString(str2);

  if (!s1 || !s2) return 0;
  if (s1 === s2) return 100;

  const maxLen = Math.max(s1.length, s2.length);
  const distance = levenshteinDistance(s1, s2);
  const levRatio = Math.max(0, 1 - distance / maxLen) * 100;

  // Token-based Jaccard / inclusion check (handles order e.g. "Dhore Prathmesh" vs "Prathmesh Dhore")
  const tokens1 = s1.split(' ').filter(Boolean);
  const tokens2 = s2.split(' ').filter(Boolean);

  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  const common = tokens1.filter(t => set2.has(t));
  const tokenScore = (common.length / Math.max(set1.size, set2.size)) * 100;

  // Weighted combination
  return Math.round(levRatio * 0.5 + tokenScore * 0.5);
}

function analyzePair(labelA: string, nameA: string, labelB: string, nameB: string): NameComparisonResult {
  const cleanedA = cleanString(nameA);
  const cleanedB = cleanString(nameB);

  if (!cleanedA || !cleanedB) {
    return {
      pair: `${labelA} vs ${labelB}`,
      nameA: nameA || '(Not provided)',
      nameB: nameB || '(Not provided)',
      similarity: 0,
      isMatch: false,
      isWarning: true,
      notes: 'One or both names are missing in profile.'
    };
  }

  if (cleanedA === cleanedB) {
    return {
      pair: `${labelA} vs ${labelB}`,
      nameA,
      nameB,
      similarity: 100,
      isMatch: true,
      isWarning: false,
      notes: 'Identical character-for-character match.'
    };
  }

  const tokensA = cleanedA.split(' ').filter(Boolean);
  const tokensB = cleanedB.split(' ').filter(Boolean);

  // Check if initials were used (e.g. S vs SUNIL)
  const isInitialVariant = tokensA.some(t => t.length === 1 && tokensB.some(b => b.startsWith(t))) ||
                           tokensB.some(t => t.length === 1 && tokensA.some(a => a.startsWith(t)));

  // Check if token order reversed (e.g. Surname first)
  const sameTokensDifferentOrder = tokensA.length === tokensB.length &&
                                   tokensA.every(t => tokensB.includes(t));

  const similarity = calculateStringSimilarity(cleanedA, cleanedB);

  let notes = '';
  let isWarning = false;
  let isMatch = similarity >= 85;

  if (sameTokensDifferentOrder) {
    notes = 'Same words in different order (e.g., Surname first vs Last). Generally accepted if Aadhaar XML matches.';
    isMatch = true;
  } else if (isInitialVariant) {
    notes = 'Abbreviated initials detected (e.g. S. vs Sunil). High risk of bank NPCI DBT mapping rejection!';
    isWarning = true;
    isMatch = false;
  } else if (tokensA.length !== tokensB.length) {
    notes = 'Missing component (e.g., Father’s middle name omitted on Bank passbook). DBT PFMS transfer may fail.';
    isWarning = true;
    isMatch = false;
  } else if (similarity >= 80) {
    notes = 'Minor phonetic/spelling variation detected.';
    isWarning = true;
  } else {
    notes = 'Substantial mismatch. Bank or Marks authority verification will likely flag this application.';
    isWarning = true;
  }

  return {
    pair: `${labelA} vs ${labelB}`,
    nameA,
    nameB,
    similarity,
    isMatch,
    isWarning,
    notes
  };
}

export function performFuzzyIdentityCheck(
  fullName: string,
  nameOnAadhaar?: string,
  nameOnMarksheet?: string,
  nameOnBankAccount?: string
): NameMatchAnalysis {
  // Default fallbacks to fullName if specific fields aren't yet populated
  const aadhaar = nameOnAadhaar || fullName || '';
  const marksheet = nameOnMarksheet || fullName || '';
  const bank = nameOnBankAccount || fullName || '';

  const comparisons: NameComparisonResult[] = [
    analyzePair('Aadhaar Card', aadhaar, '10th Marksheet', marksheet),
    analyzePair('Aadhaar Card', aadhaar, 'Bank Account', bank),
    analyzePair('10th Marksheet', marksheet, 'Bank Account', bank)
  ];

  const totalSim = comparisons.reduce((sum, c) => sum + c.similarity, 0);
  const overallScore = Math.round(totalSim / comparisons.length);

  const hasAnyWarning = comparisons.some(c => c.isWarning);
  const hasInitialMismatch = comparisons.some(c => c.notes.includes('Abbreviated initials'));
  const hasMissingNameComponent = comparisons.some(c => c.notes.includes('Missing component'));

  if (overallScore >= 95 && !hasAnyWarning) {
    return {
      overallScore: 100,
      status: 'PERFECT_MATCH',
      headline: 'Identity Fully Synchronized (100% DBT Safe)',
      badgeColor: 'emerald',
      detailedAdvice: 'Your name matches character-for-character across Aadhaar, Class 10th Board Records, and Bank Passbook. Zero risk of name-mismatch bounce on the NPCI gateway.',
      hasInitialMismatch: false,
      hasMissingNameComponent: false,
      comparisons
    };
  }

  if (overallScore >= 80 && !hasMissingNameComponent && !hasInitialMismatch) {
    return {
      overallScore,
      status: 'ACCEPTABLE_VARIATION',
      headline: 'Minor Name Order / Spacing Discrepancy',
      badgeColor: 'amber',
      detailedAdvice: 'Minor differences detected (e.g. name word order). State portals typically accept this, but please ensure your bank has your full name registered as per your Aadhaar card.',
      hasInitialMismatch,
      hasMissingNameComponent,
      comparisons
    };
  }

  return {
    overallScore,
    status: 'CRITICAL_MISMATCH',
    headline: 'Identity Mismatch Detected: High DBT Failure Risk',
    badgeColor: 'rose',
    detailedAdvice: 'Critical discrepancy between your government documents and bank account title. The Public Financial Management System (PFMS) automatically rejects electronic remittances if the beneficiary name on the NPCI Aadhaar mapper diverges from the portal record. Please request a bank KYC update before applying.',
    hasInitialMismatch,
    hasMissingNameComponent,
    comparisons
  };
}
