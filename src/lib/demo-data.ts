export type ClaimStage = 'New' | 'Under Review' | 'AI Processing' | 'Adjudication' | 'Approved' | 'Denied';
export type ClaimStatus = ClaimStage | 'Processing' | 'Pending Documents';
export type ClaimType = 'Life' | 'Disability' | 'Health' | 'LTC' | 'STD' | 'LTD' | 'Annuity';

export interface Claim {
  id: string;
  claimantFirst: string;
  claimantLast: string;
  policyNumber: string;
  dob: string;
  claimType: ClaimType;
  dateOfLoss: string;
  description: string;
  status: ClaimStatus;
  stage: ClaimStage;
  amount: number;
  assignedAgent: string;
  aiConfidence: number;
  riskScore: number;
  fraudProbability: number;
  docCompleteness: number;
  recommendedAction: string;
  submittedAt: string;
  aiProcessingMinutes: number;
  manualEstimateHours: string;
  documents: string[];
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  detail: string;
  type: 'system' | 'ai' | 'human' | 'document';
  agent?: string;
  confidence?: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'Active' | 'Training' | 'Idle';
  accuracy: number;
  claimsProcessed: number;
  lastActive: string;
}

export interface ActivityItem {
  id: string;
  message: string;
  time: string;
  type: 'claim' | 'alert' | 'approval' | 'document';
  claimId?: string;
}

export const CLAIM_STAGES: ClaimStage[] = ['New', 'Under Review', 'AI Processing', 'Adjudication', 'Approved', 'Denied'];

export const STAGE_COLORS: Record<ClaimStage, { bg: string; text: string; border: string }> = {
  'New': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Under Review': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  'AI Processing': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Adjudication': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Approved': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Denied': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export const SAMPLE_CLAIMS: Claim[] = [
  {
    id: 'CLM-2026-0001',
    claimantFirst: 'Margaret',
    claimantLast: 'Thompson',
    policyNumber: 'BEN-78234-LIFE',
    dob: '1958-03-15',
    claimType: 'Life',
    dateOfLoss: '2026-01-08',
    description: 'Term life insurance death benefit claim. Insured passed due to natural causes. Beneficiary is surviving spouse.',
    status: 'Approved',
    stage: 'Approved',
    amount: 125000,
    assignedAgent: 'Claims Automation Agent',
    aiConfidence: 97,
    riskScore: 8,
    fraudProbability: 2,
    docCompleteness: 100,
    recommendedAction: 'Auto-adjudication recommended: APPROVE ($125,000)',
    submittedAt: '2026-01-10T09:23:00Z',
    aiProcessingMinutes: 2.3,
    manualEstimateHours: '4-6',
    documents: ['Death Certificate', 'Policy Certificate', 'Beneficiary Designation', 'Attending Physician Statement'],
    timeline: [
      { timestamp: '2026-01-10T09:23:00Z', event: 'Claim Submitted', detail: 'FNOL received via digital portal', type: 'system' },
      { timestamp: '2026-01-10T09:23:18Z', event: 'Document Validator verified death certificate', detail: '99.1% confidence — state registry cross-referenced', type: 'ai', agent: 'Document Validator', confidence: 99.1 },
      { timestamp: '2026-01-10T09:23:45Z', event: 'Document Validator verified medical records', detail: '98.5% confidence — cause of death confirmed', type: 'ai', agent: 'Document Validator', confidence: 98.5 },
      { timestamp: '2026-01-10T09:24:02Z', event: 'Fraud Detection Agent: No anomalies detected', detail: 'Risk score: 8/100 — all patterns normal', type: 'ai', agent: 'Fraud Detection Agent', confidence: 96 },
      { timestamp: '2026-01-10T09:24:30Z', event: 'Underwriting Agent: Policy eligible, coverage confirmed', detail: 'Policy active since 2018, premium current, no exclusions apply', type: 'ai', agent: 'Underwriting Agent', confidence: 99 },
      { timestamp: '2026-01-10T09:25:18Z', event: 'Auto-adjudication recommended: APPROVE ($125,000)', detail: 'All criteria met — straight-through processing', type: 'ai', agent: 'Adjudication Engine', confidence: 97 },
      { timestamp: '2026-01-10T09:25:20Z', event: 'Claim Approved', detail: 'AI processed in 2.3 minutes vs 4-6 hours manual', type: 'system' },
    ],
  },
  {
    id: 'CLM-2026-0002',
    claimantFirst: 'Robert',
    claimantLast: 'Chen',
    policyNumber: 'BEN-45891-DIS',
    dob: '1972-07-22',
    claimType: 'Disability',
    dateOfLoss: '2026-01-05',
    description: 'Long-term disability claim. Degenerative disc disease L4-L5 preventing occupational duties as construction supervisor.',
    status: 'Adjudication',
    stage: 'Adjudication',
    amount: 84000,
    assignedAgent: 'Underwriting Agent',
    aiConfidence: 78,
    riskScore: 34,
    fraudProbability: 12,
    docCompleteness: 85,
    recommendedAction: 'Human adjudicator review required — incomplete occupational capacity assessment',
    submittedAt: '2026-01-06T14:10:00Z',
    aiProcessingMinutes: 3.8,
    manualEstimateHours: '5-8',
    documents: ['Medical Records', 'Employer Statement', 'Policy Certificate', 'MRI Report'],
    timeline: [
      { timestamp: '2026-01-06T14:10:00Z', event: 'Claim Submitted', detail: 'FNOL received via portal', type: 'system' },
      { timestamp: '2026-01-06T14:10:22Z', event: 'Document Validator verified medical records', detail: '94.2% confidence — MRI findings extracted', type: 'ai', agent: 'Document Validator', confidence: 94.2 },
      { timestamp: '2026-01-06T14:11:05Z', event: 'Fraud Detection Agent: Low risk with note', detail: 'Risk score: 34/100 — prior claim history flagged for context', type: 'ai', agent: 'Fraud Detection Agent', confidence: 82 },
      { timestamp: '2026-01-06T14:11:40Z', event: 'Document Gap Detected', detail: 'Functional Capacity Evaluation missing — requested from claimant', type: 'ai', agent: 'Document Validator' },
      { timestamp: '2026-01-06T14:13:48Z', event: 'Underwriting Agent: Policy eligible, benefit confirmed', detail: 'LTD benefit: $7,000/month, 90-day elimination period satisfied', type: 'ai', agent: 'Underwriting Agent', confidence: 91 },
      { timestamp: '2026-01-06T14:14:00Z', event: 'Routed to Human Adjudicator', detail: 'Confidence below auto-approve threshold — requires specialist review', type: 'human' },
    ],
  },
  {
    id: 'CLM-2026-0003',
    claimantFirst: 'Patricia',
    claimantLast: 'Williams',
    policyNumber: 'BEN-92017-LIFE',
    dob: '1965-11-30',
    claimType: 'Life',
    dateOfLoss: '2026-01-12',
    description: 'Whole life insurance death benefit. Insured passed due to cardiac arrest. Two named beneficiaries.',
    status: 'AI Processing',
    stage: 'AI Processing',
    amount: 250000,
    assignedAgent: 'Document Validator',
    aiConfidence: 91,
    riskScore: 15,
    fraudProbability: 5,
    docCompleteness: 92,
    recommendedAction: 'Near approval — coroner report verification in progress',
    submittedAt: '2026-01-14T10:00:00Z',
    aiProcessingMinutes: 1.8,
    manualEstimateHours: '4-6',
    documents: ['Death Certificate', 'Policy Certificate', 'Beneficiary Designation', 'Hospital Records'],
    timeline: [
      { timestamp: '2026-01-14T10:00:00Z', event: 'Claim Submitted', detail: 'FNOL received — high-value claim flagged for priority', type: 'system' },
      { timestamp: '2026-01-14T10:00:15Z', event: 'Document Validator verified death certificate', detail: '97.8% confidence — state registry match confirmed', type: 'ai', agent: 'Document Validator', confidence: 97.8 },
      { timestamp: '2026-01-14T10:00:48Z', event: 'Fraud Detection Agent: No anomalies detected', detail: 'Risk score: 15/100 — standard death benefit pattern', type: 'ai', agent: 'Fraud Detection Agent', confidence: 94 },
      { timestamp: '2026-01-14T10:01:30Z', event: 'Beneficiary validation in progress', detail: 'Two beneficiaries — split 60/40 per designation', type: 'ai', agent: 'Claims Automation Agent' },
    ],
  },
  {
    id: 'CLM-2026-0004',
    claimantFirst: 'James',
    claimantLast: 'Rodriguez',
    policyNumber: 'BEN-33478-HLTH',
    dob: '1985-04-18',
    claimType: 'Health',
    dateOfLoss: '2026-01-09',
    description: 'Major medical claim for emergency appendectomy and 3-day hospital stay.',
    status: 'Approved',
    stage: 'Approved',
    amount: 42500,
    assignedAgent: 'Claims Automation Agent',
    aiConfidence: 99,
    riskScore: 3,
    fraudProbability: 1,
    docCompleteness: 100,
    recommendedAction: 'Auto-adjudication recommended: APPROVE ($42,500)',
    submittedAt: '2026-01-11T08:45:00Z',
    aiProcessingMinutes: 1.4,
    manualEstimateHours: '3-5',
    documents: ['Hospital Bill', 'Surgical Report', 'Physician Statement', 'Insurance Card'],
    timeline: [
      { timestamp: '2026-01-11T08:45:00Z', event: 'Claim Submitted', detail: 'FNOL received via hospital direct-submit', type: 'system' },
      { timestamp: '2026-01-11T08:45:12Z', event: 'Document Validator verified hospital records', detail: '99.4% confidence — CPT codes validated', type: 'ai', agent: 'Document Validator', confidence: 99.4 },
      { timestamp: '2026-01-11T08:45:30Z', event: 'Fraud Detection Agent: No anomalies detected', detail: 'Risk score: 3/100 — routine surgical claim', type: 'ai', agent: 'Fraud Detection Agent', confidence: 99 },
      { timestamp: '2026-01-11T08:45:55Z', event: 'Underwriting Agent: Coverage confirmed', detail: 'Deductible met, in-network provider, pre-auth on file', type: 'ai', agent: 'Underwriting Agent', confidence: 99 },
      { timestamp: '2026-01-11T08:46:24Z', event: 'Auto-adjudication recommended: APPROVE ($42,500)', detail: 'Straight-through processing — all criteria met', type: 'ai', agent: 'Adjudication Engine', confidence: 99 },
      { timestamp: '2026-01-11T08:46:25Z', event: 'Claim Approved', detail: 'AI processed in 1.4 minutes vs 3-5 hours manual', type: 'system' },
    ],
  },
  {
    id: 'CLM-2026-0005',
    claimantFirst: 'Susan',
    claimantLast: 'Park',
    policyNumber: 'BEN-61234-LIFE',
    dob: '1950-08-05',
    claimType: 'Life',
    dateOfLoss: '2026-01-01',
    description: 'Universal life death benefit claim. Insured passed in hospice care after terminal illness.',
    status: 'Under Review',
    stage: 'Under Review',
    amount: 175000,
    assignedAgent: 'Document Validator',
    aiConfidence: 65,
    riskScore: 42,
    fraudProbability: 8,
    docCompleteness: 60,
    recommendedAction: 'Request documents — hospice records and updated beneficiary form required',
    submittedAt: '2026-01-08T16:20:00Z',
    aiProcessingMinutes: 2.1,
    manualEstimateHours: '6-8',
    documents: ['Death Certificate', 'Policy Certificate'],
    timeline: [
      { timestamp: '2026-01-08T16:20:00Z', event: 'Claim Submitted', detail: 'FNOL received via portal', type: 'system' },
      { timestamp: '2026-01-08T16:20:15Z', event: 'Document Validator: Partial document set', detail: '65% completeness — critical documents missing', type: 'ai', agent: 'Document Validator', confidence: 65 },
      { timestamp: '2026-01-08T16:21:10Z', event: 'Document Gap Detected', detail: 'Missing: hospice records, attending physician statement, beneficiary update', type: 'ai', agent: 'Document Validator' },
      { timestamp: '2026-01-08T16:22:00Z', event: 'Automated document request sent', detail: 'Email and SMS sent to claimant with upload link', type: 'system' },
    ],
  },
  {
    id: 'CLM-2026-0006',
    claimantFirst: 'David',
    claimantLast: 'Martinez',
    policyNumber: 'BEN-88901-DIS',
    dob: '1978-12-20',
    claimType: 'Disability',
    dateOfLoss: '2025-12-15',
    description: 'Short-term disability claim following workplace injury. Torn rotator cuff requiring surgery and 8 weeks recovery.',
    status: 'Approved',
    stage: 'Approved',
    amount: 12450,
    assignedAgent: 'Claims Automation Agent',
    aiConfidence: 96,
    riskScore: 10,
    fraudProbability: 3,
    docCompleteness: 98,
    recommendedAction: 'Auto-adjudication recommended: APPROVE ($12,450)',
    submittedAt: '2025-12-18T11:30:00Z',
    aiProcessingMinutes: 2.1,
    manualEstimateHours: '4-6',
    documents: ['Physician Statement', 'Surgical Report', 'Employer Incident Report', 'Policy Certificate', 'MRI Report'],
    timeline: [
      { timestamp: '2025-12-18T11:30:00Z', event: 'Claim Submitted', detail: 'FNOL received via employer portal', type: 'system' },
      { timestamp: '2025-12-18T11:30:20Z', event: 'Document Validator verified medical records', detail: '98.5% confidence — surgical report and MRI confirmed injury', type: 'ai', agent: 'Document Validator', confidence: 98.5 },
      { timestamp: '2025-12-18T11:30:55Z', event: 'Fraud Detection Agent: No anomalies detected', detail: 'Risk score: 10/100 — employer report corroborates claim', type: 'ai', agent: 'Fraud Detection Agent', confidence: 95 },
      { timestamp: '2025-12-18T11:31:20Z', event: 'Underwriting Agent: Policy eligible, coverage confirmed', detail: 'STD benefit: $1,556.25/week for 8 weeks', type: 'ai', agent: 'Underwriting Agent', confidence: 97 },
      { timestamp: '2025-12-18T11:32:06Z', event: 'Auto-adjudication recommended: APPROVE ($12,450)', detail: 'All criteria verified — workplace injury protocol', type: 'ai', agent: 'Adjudication Engine', confidence: 96 },
      { timestamp: '2025-12-18T11:32:08Z', event: 'Claim Approved', detail: 'AI processed in 2.1 minutes vs 4-6 hours manual', type: 'system' },
    ],
  },
  {
    id: 'CLM-2026-0007',
    claimantFirst: 'Linda',
    claimantLast: 'Johnson',
    policyNumber: 'BEN-29045-HLTH',
    dob: '1968-06-14',
    claimType: 'Health',
    dateOfLoss: '2026-01-05',
    description: 'Health claim for chronic pain management program. Multiple specialist visits and prescription medications.',
    status: 'Adjudication',
    stage: 'Adjudication',
    amount: 18750,
    assignedAgent: 'Underwriting Agent',
    aiConfidence: 72,
    riskScore: 48,
    fraudProbability: 15,
    docCompleteness: 78,
    recommendedAction: 'Specialist review required — treatment plan exceeds standard protocol',
    submittedAt: '2026-01-09T13:00:00Z',
    aiProcessingMinutes: 3.2,
    manualEstimateHours: '5-8',
    documents: ['Physician Statement', 'Prescription Records', 'Treatment Plan'],
    timeline: [
      { timestamp: '2026-01-09T13:00:00Z', event: 'Claim Submitted', detail: 'FNOL received via portal', type: 'system' },
      { timestamp: '2026-01-09T13:00:18Z', event: 'Document Validator verified physician statement', detail: '88.3% confidence — treatment codes validated', type: 'ai', agent: 'Document Validator', confidence: 88.3 },
      { timestamp: '2026-01-09T13:01:02Z', event: 'Fraud Detection Agent: Elevated pattern detected', detail: 'Risk score: 48/100 — multiple provider visits in short window flagged', type: 'ai', agent: 'Fraud Detection Agent', confidence: 72 },
      { timestamp: '2026-01-09T13:02:15Z', event: 'Underwriting Agent: Coverage review needed', detail: 'Treatment plan exceeds standard protocol — medical necessity review required', type: 'ai', agent: 'Underwriting Agent', confidence: 75 },
      { timestamp: '2026-01-09T13:03:12Z', event: 'Routed to Medical Director', detail: 'AI recommends peer review before adjudication', type: 'human' },
    ],
  },
  {
    id: 'CLM-2026-0008',
    claimantFirst: 'Michael',
    claimantLast: 'Davis',
    policyNumber: 'BEN-54321-LIFE',
    dob: '1960-09-28',
    claimType: 'Life',
    dateOfLoss: '2026-01-14',
    description: 'Accidental death benefit claim. Motor vehicle accident. Double indemnity rider applies.',
    status: 'AI Processing',
    stage: 'AI Processing',
    amount: 200000,
    assignedAgent: 'Fraud Detection Agent',
    aiConfidence: 85,
    riskScore: 28,
    fraudProbability: 9,
    docCompleteness: 82,
    recommendedAction: 'Pending — coroner report and police report cross-reference in progress',
    submittedAt: '2026-01-15T07:00:00Z',
    aiProcessingMinutes: 4.1,
    manualEstimateHours: '6-10',
    documents: ['Death Certificate', 'Policy Certificate', 'Police Report', 'Insurance Card'],
    timeline: [
      { timestamp: '2026-01-15T07:00:00Z', event: 'Claim Submitted', detail: 'FNOL received — accidental death protocol activated', type: 'system' },
      { timestamp: '2026-01-15T07:00:20Z', event: 'Document Validator verified death certificate', detail: '93.2% confidence — accidental cause confirmed', type: 'ai', agent: 'Document Validator', confidence: 93.2 },
      { timestamp: '2026-01-15T07:01:05Z', event: 'Fraud Detection Agent: Standard screening in progress', detail: 'Risk score: 28/100 — double indemnity requires enhanced verification', type: 'ai', agent: 'Fraud Detection Agent', confidence: 85 },
      { timestamp: '2026-01-15T07:02:00Z', event: 'Coroner report cross-reference initiated', detail: 'Awaiting automated verification from county records', type: 'ai', agent: 'Document Validator' },
    ],
  },
  {
    id: 'CLM-2026-0009',
    claimantFirst: 'Karen',
    claimantLast: 'Wilson',
    policyNumber: 'BEN-71456-DIS',
    dob: '1980-02-11',
    claimType: 'Disability',
    dateOfLoss: '2026-01-10',
    description: 'Short-term disability for pregnancy complications requiring extended bed rest per physician order.',
    status: 'New',
    stage: 'New',
    amount: 8200,
    assignedAgent: 'Claims Automation Agent',
    aiConfidence: 0,
    riskScore: 0,
    fraudProbability: 0,
    docCompleteness: 45,
    recommendedAction: 'Awaiting initial AI processing',
    submittedAt: '2026-01-16T14:30:00Z',
    aiProcessingMinutes: 0,
    manualEstimateHours: '3-5',
    documents: ['Physician Statement', 'Policy Certificate'],
    timeline: [
      { timestamp: '2026-01-16T14:30:00Z', event: 'Claim Submitted', detail: 'FNOL received via portal — queued for AI processing', type: 'system' },
    ],
  },
  {
    id: 'CLM-2026-0010',
    claimantFirst: 'Thomas',
    claimantLast: 'Anderson',
    policyNumber: 'BEN-39087-HLTH',
    dob: '1955-05-03',
    claimType: 'Health',
    dateOfLoss: '2025-12-28',
    description: 'Major medical claim denied. Experimental treatment not covered under current policy terms.',
    status: 'Denied',
    stage: 'Denied',
    amount: 67800,
    assignedAgent: 'Underwriting Agent',
    aiConfidence: 94,
    riskScore: 22,
    fraudProbability: 4,
    docCompleteness: 100,
    recommendedAction: 'DENY — treatment classified as experimental, policy exclusion 4.2(b) applies',
    submittedAt: '2025-12-30T09:15:00Z',
    aiProcessingMinutes: 2.8,
    manualEstimateHours: '4-6',
    documents: ['Treatment Records', 'Policy Certificate', 'Physician Statement', 'Clinical Trial Documentation'],
    timeline: [
      { timestamp: '2025-12-30T09:15:00Z', event: 'Claim Submitted', detail: 'FNOL received via portal', type: 'system' },
      { timestamp: '2025-12-30T09:15:18Z', event: 'Document Validator verified treatment records', detail: '96.1% confidence — experimental classification detected', type: 'ai', agent: 'Document Validator', confidence: 96.1 },
      { timestamp: '2025-12-30T09:15:55Z', event: 'Fraud Detection Agent: No anomalies detected', detail: 'Risk score: 22/100 — legitimate claim, coverage issue', type: 'ai', agent: 'Fraud Detection Agent', confidence: 92 },
      { timestamp: '2025-12-30T09:16:30Z', event: 'Underwriting Agent: Policy exclusion identified', detail: 'Treatment falls under experimental exclusion 4.2(b)', type: 'ai', agent: 'Underwriting Agent', confidence: 94 },
      { timestamp: '2025-12-30T09:17:48Z', event: 'Auto-adjudication recommended: DENY', detail: 'Experimental treatment exclusion — not eligible for coverage', type: 'ai', agent: 'Adjudication Engine', confidence: 94 },
      { timestamp: '2025-12-30T10:00:00Z', event: 'Claim Denied', detail: 'AI processed in 2.8 minutes vs 4-6 hours manual. Appeal rights notification sent.', type: 'system' },
    ],
  },
];

export const AI_AGENTS: Agent[] = [
  {
    id: 'agent-claims',
    name: 'Claims Automation',
    description: 'End-to-end FNOL intake, document extraction, eligibility verification, and straight-through processing for low-complexity claims.',
    icon: 'FileCheck',
    status: 'Active',
    accuracy: 94,
    claimsProcessed: 1247,
    lastActive: '2 min ago',
  },
  {
    id: 'agent-docs',
    name: 'Document Intelligence',
    description: 'AI-powered OCR and NLP extraction from medical records, physician statements, and policy documents with 99.2% field accuracy.',
    icon: 'Scan',
    status: 'Active',
    accuracy: 99,
    claimsProcessed: 3892,
    lastActive: '1 min ago',
  },
  {
    id: 'agent-fraud',
    name: 'Fraud Detection',
    description: 'Multi-layer anomaly detection using behavioral patterns, network analysis, and historical fraud signals to flag suspicious claims.',
    icon: 'ShieldAlert',
    status: 'Active',
    accuracy: 91,
    claimsProcessed: 1247,
    lastActive: '5 min ago',
  },
  {
    id: 'agent-uw',
    name: 'Underwriting AI',
    description: 'Real-time risk scoring and underwriting decision support integrating medical, demographic, and actuarial data.',
    icon: 'Brain',
    status: 'Active',
    accuracy: 87,
    claimsProcessed: 428,
    lastActive: '1 hr ago',
  },
];

export const ACTIVITY_FEED: ActivityItem[] = [
  { id: '1', message: 'CLM-2026-0009 submitted — queued for AI processing', time: '2 min ago', type: 'claim', claimId: 'CLM-2026-0009' },
  { id: '2', message: 'CLM-2026-0001 auto-approved by AI — $125,000', time: '15 min ago', type: 'approval', claimId: 'CLM-2026-0001' },
  { id: '3', message: 'Fraud Detection cleared CLM-2026-0008 — enhanced verification continues', time: '32 min ago', type: 'alert', claimId: 'CLM-2026-0008' },
  { id: '4', message: 'Documents requested for CLM-2026-0005', time: '1 hr ago', type: 'document', claimId: 'CLM-2026-0005' },
  { id: '5', message: 'CLM-2026-0004 auto-approved — 99% confidence ($42,500)', time: '2 hr ago', type: 'approval', claimId: 'CLM-2026-0004' },
  { id: '6', message: 'CLM-2026-0006 approved — disability benefits active ($12,450)', time: '3 hr ago', type: 'approval', claimId: 'CLM-2026-0006' },
  { id: '7', message: 'CLM-2026-0010 denied — experimental treatment exclusion', time: '4 hr ago', type: 'claim', claimId: 'CLM-2026-0010' },
  { id: '8', message: 'CLM-2026-0002 routed to human adjudicator', time: '5 hr ago', type: 'claim', claimId: 'CLM-2026-0002' },
];

export const DASHBOARD_STATS = {
  claimsProcessed: 156,
  aiAccuracy: 94,
  processingSpeedGain: 68,
  pendingReview: 3,
  approvedThisWeek: 12,
  avgProcessingHours: 1.4,
};
