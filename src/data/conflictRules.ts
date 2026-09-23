import { ConflictRule } from '../types';

export const INITIAL_CONFLICT_RULES: ConflictRule[] = [
  {
    id: 'RULE-001',
    scholarshipAId: 'MAHADBT_EBC',
    scholarshipBId: 'CENTRAL_SECTOR_NSP',
    scholarshipAName: 'MahaDBT EBC Fee Concession',
    scholarshipBName: 'Central Sector Scheme (NSP)',
    relationship: 'MUTUALLY_EXCLUSIVE',
    severity: 'HIGH',
    reason: 'Both schemes provide government-subsidized education allowances. Central Sector Scheme guidelines (Clause 6.3) and MahaDBT portal cross-verification mandate that a beneficiary cannot simultaneously draw two state/central government scholarship benefits for tuition fees.',
    source: 'MHRD CSSS Guidelines 2025-26 & MahaDBT Circular No. 2024/ED-88',
    active: true
  },
  {
    id: 'RULE-002',
    scholarshipAId: 'MAHADBT_SC_FREESHIP',
    scholarshipBId: 'CENTRAL_SECTOR_NSP',
    scholarshipAName: 'MahaDBT SC Post-Matric Scholarship',
    scholarshipBName: 'Central Sector Scheme (NSP)',
    relationship: 'MUTUALLY_EXCLUSIVE',
    severity: 'HIGH',
    reason: 'SC Post-Matric provides 100% full fee waiver from State/Central funds. Simultaneous enrollment in Central Sector scheme on the National Scholarship Portal triggers automated Aadhaar-linked duplicate benefit rejection.',
    source: 'NSP DBT Exclusivity Matrix & Ministry of Social Justice Guidelines',
    active: true
  },
  {
    id: 'RULE-003',
    scholarshipAId: 'MAHADBT_EBC',
    scholarshipBId: 'MAHADBT_SC_FREESHIP',
    scholarshipAName: 'MahaDBT EBC Concession',
    scholarshipBName: 'MahaDBT SC Freeship',
    relationship: 'MUTUALLY_EXCLUSIVE',
    severity: 'HIGH',
    reason: 'A student can only register under ONE social welfare department on the MahaDBT portal during a single academic year. Dual portal submissions will cancel both applications.',
    source: 'MahaDBT General User Rule 4.1',
    active: true
  },
  {
    id: 'RULE-004',
    scholarshipAId: 'MAHADBT_EBC',
    scholarshipBId: 'SWADHAR_HOSTEL_MAHA',
    scholarshipAName: 'MahaDBT EBC Concession',
    scholarshipBName: 'Swadhar Hostel & Food Allowance',
    relationship: 'COMPATIBLE',
    severity: 'LOW',
    reason: 'SAFE ROUTE: MahaDBT EBC covers 50% tuition & exam fees, while Swadhar Yojna provides food, lodging, and living allowance for students not residing in government hostels. They serve disjoint expense heads.',
    source: 'Directorate of Higher Education Circular DHE-FEE-2023/19',
    active: true
  },
  {
    id: 'RULE-005',
    scholarshipAId: 'MAHADBT_EBC',
    scholarshipBId: 'RELIANCE_FOUNDATION_UG',
    scholarshipAName: 'MahaDBT EBC Concession',
    scholarshipBName: 'Reliance Foundation UG Scholarship',
    relationship: 'COMPATIBLE',
    severity: 'LOW',
    reason: 'SAFE ROUTE: Reliance Foundation is a private CSR grant disbursed directly to the scholar for learning equipment, laptops, and living costs. It explicitly permits students to claim state government statutory fee waivers.',
    source: 'Reliance Foundation FAQs 2025 Section 5 (External Aid Compatibility)',
    active: true
  },
  {
    id: 'RULE-006',
    scholarshipAId: 'CENTRAL_SECTOR_NSP',
    scholarshipBId: 'AICTE_PRAGATI',
    scholarshipAName: 'Central Sector Scheme',
    scholarshipBName: 'AICTE Pragati Scheme',
    relationship: 'MUTUALLY_EXCLUSIVE',
    severity: 'HIGH',
    reason: 'Both schemes are processed through the National Scholarship Portal (NSP). The NSP backend enforces single-scholarship verification per registered Aadhaar demographic record.',
    source: 'National Scholarship Portal (NSP) System Deduplication Specs',
    active: true
  },
  {
    id: 'RULE-007',
    scholarshipAId: 'MAHADBT_EBC',
    scholarshipBId: 'MAHADBT_MINORITY',
    scholarshipAName: 'MahaDBT EBC Concession',
    scholarshipBName: 'MahaDBT State Minority Scholarship',
    relationship: 'MUTUALLY_EXCLUSIVE',
    severity: 'HIGH',
    reason: 'Both are state-sponsored tuition assistance schemes operating on the MahaDBT platform. An applicant must select either EBC (General) or Minority Welfare Department.',
    source: 'Minority Development Dept Notification No. MKY-2024/CR-12',
    active: true
  },
  {
    id: 'RULE-008',
    scholarshipAId: 'TATA_TRUSTS_STEM',
    scholarshipBId: 'RELIANCE_FOUNDATION_UG',
    scholarshipAName: 'Tata Trusts Women in STEM',
    scholarshipBName: 'Reliance Foundation UG',
    relationship: 'REVIEW_REQUIRED',
    severity: 'MEDIUM',
    reason: 'POTENTIAL OVERLAP: While both are private trusts, both provide high-value cash stipends exceeding ₹50,000/yr. Both trust agreements require written disclosure of any concurrent private scholarship exceeding ₹30,000.',
    source: 'Tata Trusts Allied Grant Policy Section 9.2',
    active: true
  },
  {
    id: 'RULE-009',
    scholarshipAId: 'MAHADBT_EBC',
    scholarshipBId: 'COLLEGE_INSTITUTIONAL_AID',
    scholarshipAName: 'MahaDBT EBC Concession',
    scholarshipBName: 'College Alumni Need-Based Aid',
    relationship: 'COMPATIBLE',
    severity: 'LOW',
    reason: 'SAFE ROUTE: Institutional alumni aid is tailored to pay remaining non-reimbursed college development and exam costs after state fee deduction.',
    source: 'Autonomous College Financial Aid By-laws 2024',
    active: true
  },
  {
    id: 'RULE-010',
    scholarshipAId: 'MAHADBT_EBC',
    scholarshipBId: 'SITARAM_JINDAL_SCHOLARSHIP',
    scholarshipAName: 'MahaDBT EBC Concession',
    scholarshipBName: 'Sitaram Jindal Scholarship',
    relationship: 'COMPATIBLE',
    severity: 'LOW',
    reason: 'SAFE ROUTE: Sitaram Jindal provides a monthly book & study allowance. It does not disqualify candidates receiving government tuition subsidies.',
    source: 'Sitaram Jindal Foundation Terms & Conditions',
    active: true
  },
  {
    id: 'RULE-011',
    scholarshipAId: 'CENTRAL_SECTOR_NSP',
    scholarshipBId: 'RELIANCE_FOUNDATION_UG',
    scholarshipAName: 'Central Sector Scheme',
    scholarshipBName: 'Reliance Foundation UG',
    relationship: 'COMPATIBLE',
    severity: 'LOW',
    reason: 'SAFE ROUTE: Central government rules disallow concurrent state/central government scholarships, but permit non-government, private merit endowments.',
    source: 'Ministry of Education Clarification Gazette 2024',
    active: true
  },
  {
    id: 'RULE-012',
    scholarshipAId: 'MAHADBT_OBC_FREESHIP',
    scholarshipBId: 'CENTRAL_SECTOR_NSP',
    scholarshipAName: 'MahaDBT OBC Freeship',
    scholarshipBName: 'Central Sector Scheme',
    relationship: 'MUTUALLY_EXCLUSIVE',
    severity: 'HIGH',
    reason: 'Dual central/state scholarship ban applies under Central Sector scheme terms and MahaDBT system validation.',
    source: 'OBC Welfare Department Maharashtra Rule 7',
    active: true
  }
];
