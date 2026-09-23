import { StudentProfile, Scholarship, EligibilityResult, CriteriaCheck } from '../types';

export function checkScholarshipEligibility(student: StudentProfile, scholarship: Scholarship): EligibilityResult {
  const checks: CriteriaCheck[] = [];

  // 1. Academic requirement
  const academicReq = scholarship.minAcademicPercentage;
  const studentAcademic = student.academicPercentage;
  if (studentAcademic >= academicReq) {
    checks.push({
      criteria: 'Academic Percentage',
      required: `≥ ${academicReq}%`,
      studentValue: `${studentAcademic}%`,
      status: 'PASS',
      message: `Student academic score of ${studentAcademic}% meets or exceeds the minimum required ${academicReq}%.`
    });
  } else if (studentAcademic >= academicReq - 5) {
    checks.push({
      criteria: 'Academic Percentage',
      required: `≥ ${academicReq}%`,
      studentValue: `${studentAcademic}%`,
      status: 'WARNING',
      message: `Score of ${studentAcademic}% is slightly below regular cutoff ${academicReq}%. May qualify under relaxation quotas.`
    });
  } else {
    checks.push({
      criteria: 'Academic Percentage',
      required: `≥ ${academicReq}%`,
      studentValue: `${studentAcademic}%`,
      status: 'FAIL',
      message: `Academic percentage (${studentAcademic}%) is below the scheme threshold (${academicReq}%).`
    });
  }

  // 2. Family Income requirement
  const incomeLimit = scholarship.incomeLimit;
  const studentIncome = student.annualFamilyIncome;
  if (incomeLimit === 0) {
    checks.push({
      criteria: 'Family Annual Income',
      required: 'No Upper Limit (Merit Scheme)',
      studentValue: `₹${studentIncome.toLocaleString('en-IN')}`,
      status: 'PASS',
      message: 'This scheme does not enforce a family income cap.'
    });
  } else if (studentIncome <= incomeLimit) {
    checks.push({
      criteria: 'Family Annual Income',
      required: `≤ ₹${incomeLimit.toLocaleString('en-IN')}`,
      studentValue: `₹${studentIncome.toLocaleString('en-IN')}`,
      status: 'PASS',
      message: `Family income of ₹${studentIncome.toLocaleString('en-IN')} is within the permitted cap of ₹${incomeLimit.toLocaleString('en-IN')}.`
    });
  } else {
    checks.push({
      criteria: 'Family Annual Income',
      required: `≤ ₹${incomeLimit.toLocaleString('en-IN')}`,
      studentValue: `₹${studentIncome.toLocaleString('en-IN')}`,
      status: 'FAIL',
      message: `Annual family income (₹${studentIncome.toLocaleString('en-IN')}) exceeds the configured scheme threshold of ₹${incomeLimit.toLocaleString('en-IN')}.`
    });
  }

  // 3. State Domicile
  const reqState = scholarship.state;
  const studentState = student.state;
  if (reqState === 'All India' || reqState.toLowerCase() === studentState.toLowerCase()) {
    checks.push({
      criteria: 'State Domicile',
      required: reqState,
      studentValue: studentState,
      status: 'PASS',
      message: `State criteria satisfied (${studentState} resident eligible for ${reqState} scheme).`
    });
  } else {
    checks.push({
      criteria: 'State Domicile',
      required: reqState,
      studentValue: studentState,
      status: 'FAIL',
      message: `Scheme is restricted to residents of ${reqState}; student holds ${studentState} domicile.`
    });
  }

  // 4. Course / Degree Level & Field of Study
  const studentCourseNorm = (student.course || '').toLowerCase();
  const studentDegreeNorm = (student.degree || '').toLowerCase();

  // Check general course eligibility
  const levelMatch = scholarship.educationLevel.includes(student.educationLevel);
  const generalCourseMatch = scholarship.courseEligibility.includes('All') || 
                      scholarship.courseEligibility.some(c => 
                        studentCourseNorm.includes(c.toLowerCase()) || 
                        studentDegreeNorm.includes(c.toLowerCase()) ||
                        (c.toLowerCase() === 'engineering' && (studentCourseNorm.includes('engineering') || studentCourseNorm.includes('technology') || studentCourseNorm.includes('ai') || studentCourseNorm.includes('data science') || studentDegreeNorm.includes('b.tech') || studentDegreeNorm.includes('b.e.')))
                      );
  
  // Specific Field of Study match (e.g. Artificial Intelligence & Data Science)
  const isDirectFieldMatch = scholarship.fieldsOfStudy && scholarship.fieldsOfStudy.some(f => {
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

  const matchedFieldName = isDirectFieldMatch ? (scholarship.fieldsOfStudy?.find(f => f !== 'All') || student.course) : undefined;

  if (levelMatch && (generalCourseMatch || isDirectFieldMatch)) {
    checks.push({
      criteria: 'Course & Field of Study',
      required: `${student.educationLevel} (${scholarship.courseEligibility.slice(0, 3).join(', ')})`,
      studentValue: `${student.degree} in ${student.course}`,
      status: 'PASS',
      isFieldMatch: Boolean(isDirectFieldMatch),
      message: isDirectFieldMatch 
        ? `🎯 Priority Match: Enrolled discipline (${student.course}) directly matches the target field for this scheme.`
        : `Enrolled course (${student.degree} ${student.course}) matches accepted disciplines.`
    });
  } else if (levelMatch && !generalCourseMatch) {
    checks.push({
      criteria: 'Course & Field of Study',
      required: scholarship.courseEligibility.join(', '),
      studentValue: `${student.degree} - ${student.course}`,
      status: 'WARNING',
      isFieldMatch: false,
      message: `Degree level matches, but specific branch (${student.course}) might require special collegiate verification.`
    });
  } else {
    checks.push({
      criteria: 'Course & Field of Study',
      required: scholarship.educationLevel.join(', '),
      studentValue: student.educationLevel,
      status: 'FAIL',
      isFieldMatch: false,
      message: `Education level (${student.educationLevel}) does not meet scheme requirements.`
    });
  }

  // 5. Social Category
  const catMatch = scholarship.categoryEligibility.includes(student.category);
  if (catMatch) {
    checks.push({
      criteria: 'Social Category',
      required: scholarship.categoryEligibility.join(' / '),
      studentValue: student.category,
      status: 'PASS',
      message: `Student's category (${student.category}) is explicitly covered by this scheme.`
    });
  } else {
    checks.push({
      criteria: 'Social Category',
      required: scholarship.categoryEligibility.join(' / '),
      studentValue: student.category,
      status: 'FAIL',
      message: `Scheme is designated specifically for ${scholarship.categoryEligibility.join(', ')} categories.`
    });
  }

  // 6. Document Availability
  const readyDocs = new Set(student.documents.filter(d => d.status === 'ready').map(d => d.name.toLowerCase()));
  let matchedDocsCount = 0;
  scholarship.requiredDocuments.forEach(reqDoc => {
    const isAvailable = Array.from(readyDocs).some(doc => 
      reqDoc.toLowerCase().includes(doc) || doc.includes(reqDoc.toLowerCase().split(' ')[0])
    );
    if (isAvailable) matchedDocsCount++;
  });

  const docRatio = scholarship.requiredDocuments.length > 0 ? (matchedDocsCount / scholarship.requiredDocuments.length) : 1;
  if (docRatio >= 0.75) {
    checks.push({
      criteria: 'Document Readiness',
      required: 'Essential Verification Documents',
      studentValue: `${matchedDocsCount} / ${scholarship.requiredDocuments.length} Ready`,
      status: 'PASS',
      message: `Core documentation is verified and ready in student repository.`
    });
  } else {
    checks.push({
      criteria: 'Document Readiness',
      required: 'Essential Verification Documents',
      studentValue: `${matchedDocsCount} / ${scholarship.requiredDocuments.length} Ready`,
      status: 'WARNING',
      message: `Some supporting documents are currently pending upload or verification.`
    });
  }

  // Calculate final score
  const failCount = checks.filter(c => c.status === 'FAIL').length;
  const warningCount = checks.filter(c => c.status === 'WARNING').length;
  const passCount = checks.filter(c => c.status === 'PASS').length;

  let score = 0;
  if (failCount === 0) {
    score = Math.max(70, Math.min(98, 100 - (warningCount * 6)));
    // Prioritize direct field matches (e.g. AI & Data Science) with a score bonus up to 99%
    if (isDirectFieldMatch && score >= 80) {
      score = Math.min(99, score + 4);
    }
  } else if (failCount === 1 && warningCount <= 1) {
    score = Math.max(40, 60 - (failCount * 15));
  } else {
    score = Math.max(15, 45 - (failCount * 12));
  }

  // Determine status
  let status: 'ELIGIBLE' | 'PARTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE' = 'ELIGIBLE';
  if (failCount > 0) {
    status = failCount === 1 && warningCount <= 1 ? 'PARTIALLY_ELIGIBLE' : 'NOT_ELIGIBLE';
  } else if (warningCount > 1) {
    status = 'PARTIALLY_ELIGIBLE';
  }

  let summary = '';
  if (status === 'ELIGIBLE') {
    summary = isDirectFieldMatch 
      ? `High compatibility (${score}%). Meets all criteria with priority match for your discipline (${student.course}).`
      : `High compatibility (${score}%). All critical academic, income, state, and category rules are met.`;
  } else if (status === 'PARTIALLY_ELIGIBLE') {
    summary = `Review required (${score}%). Meets primary criteria but minor prerequisites or documents require attention.`;
  } else {
    summary = `Ineligible (${score}%). One or more administrative requirements (e.g. income limit or category) are not satisfied.`;
  }

  return {
    scholarshipId: scholarship.id,
    score,
    status,
    checks,
    summary,
    isFieldMatch: Boolean(isDirectFieldMatch),
    matchedField: matchedFieldName
  };
}
