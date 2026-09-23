/**
 * Comprehensive master directory of Indian Banks for Aadhaar Direct Benefit Transfer (DBT),
 * NPCI mapper verification, and scholarship disbursements across India.
 */

export interface IndianBankItem {
  name: string;
  fullName: string;
  shortCode: string;
  category: 'Public Sector Bank' | 'Private Sector Bank' | 'Payments Bank' | 'Regional Rural Bank' | 'Small Finance Bank' | 'Co-operative Bank';
  isDbtPopular?: boolean;
}

export const INDIAN_BANKS: IndianBankItem[] = [
  // --- 1. PUBLIC SECTOR BANKS (ALL 12 NATIONALIZED BANKS) ---
  {
    name: 'Bank of India (BOI)',
    fullName: 'Bank of India',
    shortCode: 'BOI',
    category: 'Public Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'State Bank of India (SBI)',
    fullName: 'State Bank of India',
    shortCode: 'SBI',
    category: 'Public Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'Bank of Baroda (BOB)',
    fullName: 'Bank of Baroda',
    shortCode: 'BOB',
    category: 'Public Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'Punjab National Bank (PNB)',
    fullName: 'Punjab National Bank',
    shortCode: 'PNB',
    category: 'Public Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'Canara Bank',
    fullName: 'Canara Bank',
    shortCode: 'CANARA',
    category: 'Public Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'Union Bank of India (UBI)',
    fullName: 'Union Bank of India',
    shortCode: 'UBI',
    category: 'Public Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'Bank of Maharashtra (BOM)',
    fullName: 'Bank of Maharashtra',
    shortCode: 'BOM',
    category: 'Public Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'Central Bank of India (CBI)',
    fullName: 'Central Bank of India',
    shortCode: 'CBI',
    category: 'Public Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'Indian Bank',
    fullName: 'Indian Bank',
    shortCode: 'IB',
    category: 'Public Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'Indian Overseas Bank (IOB)',
    fullName: 'Indian Overseas Bank',
    shortCode: 'IOB',
    category: 'Public Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'UCO Bank',
    fullName: 'UCO Bank',
    shortCode: 'UCO',
    category: 'Public Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'Punjab & Sind Bank (PSB)',
    fullName: 'Punjab and Sind Bank',
    shortCode: 'PSB',
    category: 'Public Sector Bank',
    isDbtPopular: true
  },

  // --- 2. PAYMENTS BANKS & POSTAL (CRITICAL FOR AADHAAR DBT) ---
  {
    name: 'India Post Payments Bank (IPPB)',
    fullName: 'India Post Payments Bank',
    shortCode: 'IPPB',
    category: 'Payments Bank',
    isDbtPopular: true
  },
  {
    name: 'Airtel Payments Bank',
    fullName: 'Airtel Payments Bank',
    shortCode: 'AIRTEL',
    category: 'Payments Bank',
    isDbtPopular: true
  },
  {
    name: 'Fino Payments Bank',
    fullName: 'Fino Payments Bank',
    shortCode: 'FINO',
    category: 'Payments Bank',
    isDbtPopular: true
  },
  {
    name: 'Paytm Payments Bank',
    fullName: 'Paytm Payments Bank',
    shortCode: 'PAYTM',
    category: 'Payments Bank'
  },
  {
    name: 'Jio Payments Bank',
    fullName: 'Jio Payments Bank',
    shortCode: 'JIO',
    category: 'Payments Bank'
  },

  // --- 3. PRIVATE SECTOR BANKS ---
  {
    name: 'HDFC Bank',
    fullName: 'HDFC Bank Limited',
    shortCode: 'HDFC',
    category: 'Private Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'ICICI Bank',
    fullName: 'ICICI Bank Limited',
    shortCode: 'ICICI',
    category: 'Private Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'Axis Bank',
    fullName: 'Axis Bank Limited',
    shortCode: 'AXIS',
    category: 'Private Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'Kotak Mahindra Bank',
    fullName: 'Kotak Mahindra Bank Limited',
    shortCode: 'KOTAK',
    category: 'Private Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'IDBI Bank',
    fullName: 'IDBI Bank Limited',
    shortCode: 'IDBI',
    category: 'Private Sector Bank',
    isDbtPopular: true
  },
  {
    name: 'IndusInd Bank',
    fullName: 'IndusInd Bank Limited',
    shortCode: 'INDUSIND',
    category: 'Private Sector Bank'
  },
  {
    name: 'Federal Bank',
    fullName: 'The Federal Bank Limited',
    shortCode: 'FEDERAL',
    category: 'Private Sector Bank'
  },
  {
    name: 'Yes Bank',
    fullName: 'Yes Bank Limited',
    shortCode: 'YES',
    category: 'Private Sector Bank'
  },
  {
    name: 'IDFC FIRST Bank',
    fullName: 'IDFC FIRST Bank Limited',
    shortCode: 'IDFC',
    category: 'Private Sector Bank'
  },
  {
    name: 'Bandhan Bank',
    fullName: 'Bandhan Bank Limited',
    shortCode: 'BANDHAN',
    category: 'Private Sector Bank'
  },
  {
    name: 'RBL Bank',
    fullName: 'RBL Bank Limited',
    shortCode: 'RBL',
    category: 'Private Sector Bank'
  },
  {
    name: 'South Indian Bank',
    fullName: 'The South Indian Bank Limited',
    shortCode: 'SIB',
    category: 'Private Sector Bank'
  },
  {
    name: 'Karnataka Bank',
    fullName: 'Karnataka Bank Limited',
    shortCode: 'KTK',
    category: 'Private Sector Bank'
  },
  {
    name: 'City Union Bank',
    fullName: 'City Union Bank Limited',
    shortCode: 'CUB',
    category: 'Private Sector Bank'
  },
  {
    name: 'Karur Vysya Bank',
    fullName: 'The Karur Vysya Bank Limited',
    shortCode: 'KVB',
    category: 'Private Sector Bank'
  },
  {
    name: 'Tamilnad Mercantile Bank',
    fullName: 'Tamilnad Mercantile Bank Limited',
    shortCode: 'TMB',
    category: 'Private Sector Bank'
  },
  {
    name: 'Jammu & Kashmir Bank (J&K Bank)',
    fullName: 'The Jammu and Kashmir Bank Limited',
    shortCode: 'JKB',
    category: 'Private Sector Bank'
  },
  {
    name: 'CSB Bank',
    fullName: 'CSB Bank Limited',
    shortCode: 'CSB',
    category: 'Private Sector Bank'
  },
  {
    name: 'Dhanlaxmi Bank',
    fullName: 'Dhanlaxmi Bank Limited',
    shortCode: 'DHAN',
    category: 'Private Sector Bank'
  },
  {
    name: 'DCB Bank',
    fullName: 'DCB Bank Limited',
    shortCode: 'DCB',
    category: 'Private Sector Bank'
  },
  {
    name: 'Nainital Bank',
    fullName: 'The Nainital Bank Limited',
    shortCode: 'NTL',
    category: 'Private Sector Bank'
  },

  // --- 4. REGIONAL RURAL BANKS (RRBs) ---
  {
    name: 'Maharashtra Gramin Bank (MGB)',
    fullName: 'Maharashtra Gramin Bank',
    shortCode: 'MGB',
    category: 'Regional Rural Bank',
    isDbtPopular: true
  },
  {
    name: 'Vidharbha Konkan Gramin Bank (VKGB)',
    fullName: 'Vidharbha Konkan Gramin Bank',
    shortCode: 'VKGB',
    category: 'Regional Rural Bank',
    isDbtPopular: true
  },
  {
    name: 'Baroda UP Bank',
    fullName: 'Baroda UP Bank',
    shortCode: 'BUPB',
    category: 'Regional Rural Bank',
    isDbtPopular: true
  },
  {
    name: 'Aryavart Bank',
    fullName: 'Aryavart Bank (Uttar Pradesh)',
    shortCode: 'ARYAVART',
    category: 'Regional Rural Bank',
    isDbtPopular: true
  },
  {
    name: 'Prathama UP Gramin Bank',
    fullName: 'Prathama UP Gramin Bank',
    shortCode: 'PRATHAMA',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Dakshin Bihar Gramin Bank',
    fullName: 'Dakshin Bihar Gramin Bank',
    shortCode: 'DBGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Uttar Bihar Gramin Bank',
    fullName: 'Uttar Bihar Gramin Bank',
    shortCode: 'UBGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Madhya Pradesh Gramin Bank',
    fullName: 'Madhya Pradesh Gramin Bank',
    shortCode: 'MPGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Madhyanchal Gramin Bank',
    fullName: 'Madhyanchal Gramin Bank',
    shortCode: 'MCGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Rajasthan Marudhara Gramin Bank',
    fullName: 'Rajasthan Marudhara Gramin Bank',
    shortCode: 'RMGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Baroda Rajasthan Kshetriya Gramin Bank',
    fullName: 'Baroda Rajasthan Kshetriya Gramin Bank',
    shortCode: 'BRKGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Sarva Haryana Gramin Bank',
    fullName: 'Sarva Haryana Gramin Bank',
    shortCode: 'SHGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Punjab Gramin Bank',
    fullName: 'Punjab Gramin Bank',
    shortCode: 'PGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Himachal Pradesh Gramin Bank',
    fullName: 'Himachal Pradesh Gramin Bank',
    shortCode: 'HPGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Karnataka Vikas Grameena Bank',
    fullName: 'Karnataka Vikas Grameena Bank',
    shortCode: 'KVGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Karnataka Gramin Bank',
    fullName: 'Karnataka Gramin Bank',
    shortCode: 'KGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Kerala Gramin Bank',
    fullName: 'Kerala Gramin Bank',
    shortCode: 'KLGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Andhra Pradesh Grameena Vikas Bank',
    fullName: 'Andhra Pradesh Grameena Vikas Bank',
    shortCode: 'APGVB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Andhra Pragathi Grameena Bank',
    fullName: 'Andhra Pragathi Grameena Bank',
    shortCode: 'APGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Telangana Grameena Bank',
    fullName: 'Telangana Grameena Bank',
    shortCode: 'TGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Chaitanya Godavari Grameena Bank',
    fullName: 'Chaitanya Godavari Grameena Bank',
    shortCode: 'CGGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Paschim Banga Gramin Bank',
    fullName: 'Paschim Banga Gramin Bank',
    shortCode: 'PBGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Bangiya Gramin Vikash Bank',
    fullName: 'Bangiya Gramin Vikash Bank',
    shortCode: 'BGVB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Uttarbanga Kshetriya Gramin Bank',
    fullName: 'Uttarbanga Kshetriya Gramin Bank',
    shortCode: 'UKGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Assam Gramin Vikash Bank',
    fullName: 'Assam Gramin Vikash Bank',
    shortCode: 'AGVB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Tripura Gramin Bank',
    fullName: 'Tripura Gramin Bank',
    shortCode: 'TRIPURA',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Odisha Gramya Bank',
    fullName: 'Odisha Gramya Bank',
    shortCode: 'OGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Utkal Grameen Bank',
    fullName: 'Utkal Grameen Bank',
    shortCode: 'UGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Chhattisgarh Rajya Gramin Bank',
    fullName: 'Chhattisgarh Rajya Gramin Bank',
    shortCode: 'CRGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Jharkhand Rajya Gramin Bank',
    fullName: 'Jharkhand Rajya Gramin Bank',
    shortCode: 'JRGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Saurashtra Gramin Bank',
    fullName: 'Saurashtra Gramin Bank',
    shortCode: 'SGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'Baroda Gujarat Gramin Bank',
    fullName: 'Baroda Gujarat Gramin Bank',
    shortCode: 'BGGB',
    category: 'Regional Rural Bank'
  },
  {
    name: 'J&K Grameen Bank',
    fullName: 'J&K Grameen Bank',
    shortCode: 'JKGB',
    category: 'Regional Rural Bank'
  },

  // --- 5. CO-OPERATIVE & URBAN CO-OPERATIVE BANKS ---
  {
    name: 'Saraswat Co-operative Bank',
    fullName: 'Saraswat Co-operative Bank Limited',
    shortCode: 'SARASWAT',
    category: 'Co-operative Bank',
    isDbtPopular: true
  },
  {
    name: 'The Cosmos Co-operative Bank',
    fullName: 'The Cosmos Co-operative Bank Limited',
    shortCode: 'COSMOS',
    category: 'Co-operative Bank',
    isDbtPopular: true
  },
  {
    name: 'SVC Co-operative Bank (Shamrao Vithal)',
    fullName: 'SVC Co-operative Bank Limited',
    shortCode: 'SVC',
    category: 'Co-operative Bank'
  },
  {
    name: 'Abhyudaya Co-operative Bank',
    fullName: 'Abhyudaya Co-operative Bank Limited',
    shortCode: 'ABHYUDAYA',
    category: 'Co-operative Bank'
  },
  {
    name: 'TJSB Sahakari Bank',
    fullName: 'TJSB Sahakari Bank Limited',
    shortCode: 'TJSB',
    category: 'Co-operative Bank'
  },
  {
    name: 'NKGSB Co-operative Bank',
    fullName: 'NKGSB Co-operative Bank Limited',
    shortCode: 'NKGSB',
    category: 'Co-operative Bank'
  },
  {
    name: 'Bharat Co-operative Bank',
    fullName: 'Bharat Co-operative Bank (Mumbai) Limited',
    shortCode: 'BHARAT',
    category: 'Co-operative Bank'
  },
  {
    name: 'Dombivli Nagari Sahakari Bank (DNS Bank)',
    fullName: 'Dombivli Nagari Sahakari Bank Limited',
    shortCode: 'DNS',
    category: 'Co-operative Bank'
  },
  {
    name: 'Maharashtra State Co-operative Bank (MSCB)',
    fullName: 'The Maharashtra State Co-operative Bank Limited',
    shortCode: 'MSCB',
    category: 'Co-operative Bank'
  },
  {
    name: 'Pune District Central Co-operative Bank (PDCC)',
    fullName: 'Pune District Central Co-operative Bank Limited',
    shortCode: 'PDCC',
    category: 'Co-operative Bank'
  },
  {
    name: 'Mumbai District Central Co-operative Bank (MDCC)',
    fullName: 'Mumbai District Central Co-operative Bank Limited',
    shortCode: 'MDCC',
    category: 'Co-operative Bank'
  },
  {
    name: 'Thane District Central Co-operative Bank (TDCC)',
    fullName: 'Thane District Central Co-operative Bank Limited',
    shortCode: 'TDCC',
    category: 'Co-operative Bank'
  },
  {
    name: 'The Kalupur Commercial Co-op Bank',
    fullName: 'The Kalupur Commercial Co-operative Bank Limited',
    shortCode: 'KALUPUR',
    category: 'Co-operative Bank'
  },
  {
    name: 'Apna Sahakari Bank',
    fullName: 'Apna Sahakari Bank Limited',
    shortCode: 'APNA',
    category: 'Co-operative Bank'
  },
  {
    name: 'Janaseva Sahakari Bank',
    fullName: 'Janaseva Sahakari Bank Limited',
    shortCode: 'JANASEVA',
    category: 'Co-operative Bank'
  },
  {
    name: 'The Gujarat State Co-operative Bank',
    fullName: 'The Gujarat State Co-operative Bank Limited',
    shortCode: 'GSCB',
    category: 'Co-operative Bank'
  },
  {
    name: 'The Surat District Co-op Bank',
    fullName: 'The Surat District Co-operative Bank Limited',
    shortCode: 'SDCC',
    category: 'Co-operative Bank'
  },
  {
    name: 'The Kangra Co-operative Bank',
    fullName: 'The Kangra Co-operative Bank Limited',
    shortCode: 'KANGRA',
    category: 'Co-operative Bank'
  },
  {
    name: 'Citizen Credit Co-operative Bank',
    fullName: 'Citizen Credit Co-operative Bank Limited',
    shortCode: 'CITIZEN',
    category: 'Co-operative Bank'
  },

  // --- 6. SMALL FINANCE BANKS (SFB) ---
  {
    name: 'AU Small Finance Bank',
    fullName: 'AU Small Finance Bank Limited',
    shortCode: 'AU',
    category: 'Small Finance Bank'
  },
  {
    name: 'Equitas Small Finance Bank',
    fullName: 'Equitas Small Finance Bank Limited',
    shortCode: 'EQUITAS',
    category: 'Small Finance Bank'
  },
  {
    name: 'Ujjivan Small Finance Bank',
    fullName: 'Ujjivan Small Finance Bank Limited',
    shortCode: 'UJJIVAN',
    category: 'Small Finance Bank'
  },
  {
    name: 'Jana Small Finance Bank',
    fullName: 'Jana Small Finance Bank Limited',
    shortCode: 'JANA',
    category: 'Small Finance Bank'
  },
  {
    name: 'Capital Small Finance Bank',
    fullName: 'Capital Small Finance Bank Limited',
    shortCode: 'CAPITAL',
    category: 'Small Finance Bank'
  },
  {
    name: 'ESAF Small Finance Bank',
    fullName: 'ESAF Small Finance Bank Limited',
    shortCode: 'ESAF',
    category: 'Small Finance Bank'
  },
  {
    name: 'Suryoday Small Finance Bank',
    fullName: 'Suryoday Small Finance Bank Limited',
    shortCode: 'SURYODAY',
    category: 'Small Finance Bank'
  },
  {
    name: 'Utkarsh Small Finance Bank',
    fullName: 'Utkarsh Small Finance Bank Limited',
    shortCode: 'UTKARSH',
    category: 'Small Finance Bank'
  },
  {
    name: 'Fincare Small Finance Bank',
    fullName: 'Fincare Small Finance Bank Limited',
    shortCode: 'FINCARE',
    category: 'Small Finance Bank'
  },
  {
    name: 'Shivalik Small Finance Bank',
    fullName: 'Shivalik Small Finance Bank Limited',
    shortCode: 'SHIVALIK',
    category: 'Small Finance Bank'
  },
  {
    name: 'North East Small Finance Bank',
    fullName: 'North East Small Finance Bank Limited',
    shortCode: 'NESFB',
    category: 'Small Finance Bank'
  },
  {
    name: 'Unity Small Finance Bank',
    fullName: 'Unity Small Finance Bank Limited',
    shortCode: 'UNITY',
    category: 'Small Finance Bank'
  }
];

export const MAJOR_INDIAN_BANKS = INDIAN_BANKS.map(b => b.name);

export const POPULAR_DBT_BANKS = [
  'Bank of India (BOI)',
  'State Bank of India (SBI)',
  'Bank of Baroda (BOB)',
  'Union Bank of India (UBI)',
  'Bank of Maharashtra (BOM)',
  'Punjab National Bank (PNB)',
  'Canara Bank',
  'India Post Payments Bank (IPPB)',
  'Central Bank of India (CBI)',
  'Indian Bank',
  'HDFC Bank',
  'ICICI Bank'
];

export const BANK_CATEGORIES = [
  'Public Sector Bank',
  'Private Sector Bank',
  'Payments Bank',
  'Regional Rural Bank',
  'Co-operative Bank',
  'Small Finance Bank'
] as const;
