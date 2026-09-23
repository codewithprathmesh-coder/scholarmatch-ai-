/**
 * Document Expiry & Financial Year Validity Scanner
 * Catches expired income certificates, invalid financial year filings,
 * and outdated caste/non-creamy layer papers before institutional submission.
 */

import { DocumentInfo } from '../types';

export interface DocumentValidityReport {
  documentId: string;
  documentName: string;
  issueDate?: string;
  validUntil?: string;
  financialYear: string;
  status: 'VALID' | 'EXPIRED' | 'EXPIRING_SOON' | 'NEEDS_DATE_INPUT';
  badgeColor: 'emerald' | 'rose' | 'amber' | 'slate';
  warningMessage?: string;
  actionRequired?: string;
  validityPolicy: string;
}

export function evaluateDocumentValidity(doc: DocumentInfo): DocumentValidityReport {
  const currentAcademicYear = '2026-2027';
  const fyStartDate = new Date('2026-04-01');
  const fyEndDate = new Date('2027-03-31');

  // If no issue date entered yet
  if (!doc.issueDate) {
    if (doc.name.toLowerCase().includes('income')) {
      return {
        documentId: doc.id,
        documentName: doc.name,
        financialYear: currentAcademicYear,
        status: 'NEEDS_DATE_INPUT',
        badgeColor: 'amber',
        warningMessage: 'Issue date not verified. Income certificates must be dated on or after 1st April 2026 for AY 2026-27.',
        actionRequired: 'Input the certificate issue date printed at the top-left/seal of your Tahsildar document.',
        validityPolicy: 'Mandatory 1-Year Financial Year Cycle (Rule 3A, Maharashtra MahaDBT & NSP Directives).'
      };
    }

    if (doc.name.toLowerCase().includes('creamy') || doc.name.toLowerCase().includes('ncl')) {
      return {
        documentId: doc.id,
        documentName: doc.name,
        financialYear: currentAcademicYear,
        status: 'NEEDS_DATE_INPUT',
        badgeColor: 'amber',
        warningMessage: 'Non-Creamy Layer (NCL) certificates must be valid up to March 31, 2027.',
        actionRequired: 'Check the validity statement printed on your NCL certificate and specify the issue/expiry date.',
        validityPolicy: 'Valid for 1 or 3 financial years up to March 31 of current cycle.'
      };
    }

    return {
      documentId: doc.id,
      documentName: doc.name,
      financialYear: currentAcademicYear,
      status: 'VALID',
      badgeColor: 'emerald',
      validityPolicy: 'Standard certification (Permanent / Academic Record).'
    };
  }

  const issueDateObj = new Date(doc.issueDate);

  // 1. Income Certificate Check
  if (doc.name.toLowerCase().includes('income')) {
    // If issued before April 1, 2026
    if (issueDateObj < fyStartDate) {
      return {
        documentId: doc.id,
        documentName: doc.name,
        issueDate: doc.issueDate,
        validUntil: '2026-03-31',
        financialYear: '2025-2026 (Expired)',
        status: 'EXPIRED',
        badgeColor: 'rose',
        warningMessage: 'Action Required: Expired Certificate Detected! This document was issued prior to April 1, 2026 and reflects the previous financial year.',
        actionRequired: 'Apply for a new Tahsildar / Revenue Department Income Certificate for FY 2026-27 before portal submission. Uploading this will result in immediate scrutiny desk rejection.',
        validityPolicy: 'Annual Financial Year Expiry: Income certificates expire every year on 31st March.'
      };
    }

    return {
      documentId: doc.id,
      documentName: doc.name,
      issueDate: doc.issueDate,
      validUntil: '2027-03-31',
      financialYear: '2026-2027 (Current FY)',
      status: 'VALID',
      badgeColor: 'emerald',
      actionRequired: 'Document is verified current and ready for institutional desk submission.',
      validityPolicy: 'Issued in FY 2026-27 by authorized Tahsildar / Executive Magistrate.'
    };
  }

  // 2. Non-Creamy Layer (NCL) Check
  if (doc.name.toLowerCase().includes('creamy') || doc.name.toLowerCase().includes('ncl')) {
    // If expiring before March 31, 2027
    const threeYearsAgo = new Date('2024-04-01');
    if (issueDateObj < threeYearsAgo) {
      return {
        documentId: doc.id,
        documentName: doc.name,
        issueDate: doc.issueDate,
        validUntil: '2026-03-31',
        financialYear: 'Expired',
        status: 'EXPIRED',
        badgeColor: 'rose',
        warningMessage: 'Action Required: Non-Creamy Layer certificate has exceeded 3-year validity window.',
        actionRequired: 'Renew your NCL certificate at the Sub-Divisional Office (SDO) or MahaOnline Setu Kendra.',
        validityPolicy: 'Maximum validity is 3 financial years up to March 31, 2026.'
      };
    }

    return {
      documentId: doc.id,
      documentName: doc.name,
      issueDate: doc.issueDate,
      validUntil: '2027-03-31',
      financialYear: '2026-2027 Valid',
      status: 'VALID',
      badgeColor: 'emerald',
      validityPolicy: 'Sub-Divisional Officer (SDO) certification valid for OBC/VJNT/SBC category quota.'
    };
  }

  // Default permanent documents (Caste Certificate, Domicile, 10th/12th Marksheet)
  return {
    documentId: doc.id,
    documentName: doc.name,
    issueDate: doc.issueDate,
    validUntil: 'Permanent / Lifetime',
    financialYear: 'Permanent',
    status: 'VALID',
    badgeColor: 'emerald',
    validityPolicy: 'Permanent statutory document. No expiry unless revoked by Scrutiny Committee.'
  };
}

export function auditAllStudentDocuments(documents: DocumentInfo[]) {
  const reports = documents.map(d => evaluateDocumentValidity(d));
  const validCount = reports.filter(r => r.status === 'VALID').length;
  const expiredCount = reports.filter(r => r.status === 'EXPIRED').length;
  const pendingDateCount = reports.filter(r => r.status === 'NEEDS_DATE_INPUT').length;

  return {
    reports,
    validCount,
    expiredCount,
    pendingDateCount,
    hasExpiredDocuments: expiredCount > 0,
    hasPendingDates: pendingDateCount > 0
  };
}

