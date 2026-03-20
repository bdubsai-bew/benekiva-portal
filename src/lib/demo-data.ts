export type ClaimStatus = 'Processing' | 'Approved' | 'Under Review' | 'Pending Documents' | 'Denied';
export type ClaimType = 'LTC' | 'STD' | 'LTD' | 'Life' | 'Annuity';

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
  aiConfidence: number;
  riskScore: number;
  fraudProbability: number;
  docCompleteness: number;
  recommendedAction: string;
  submittedAt: string;
  documents: string[];
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  detail: string;
  type: 'system' | 'ai' | 'human' | 'document';
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

export const SAMPLE_CLAIMS: Claim[] = [
  {
    id: 'CLM-2024-0891',
    claimantFirst: 'Margaret',
    claimantLast: 'Thompson',
    policyNumber: 'MLI-78234-LTC',
    dob: '1948-03-15',
    claimType: 'LTC',
    dateOfLoss: '2024-01-08',
    description: 'Patient requires long-term care placement following hip replacement surgery and subsequent complications.',
    status: 'Approved',
    aiConfidence: 96,
    riskScore: 12,
    fraudProbability: 3,
    docCompleteness: 98,
    recommendedAction: 'Approve — All eligibility criteria met. Policy active, waiting period satisfied.',
    submittedAt: '2024-01-10T09:23:00Z',
    documents: ['Attending Physician Statement', 'Hospital Records', 'Policy Certificate', 'ADL Assessment'],
    timeline: [
      { timestamp: '2024-01-10T09:23:00Z', event: 'Claim Submitted', detail: 'FNOL received via portal', type: 'system' },
      { timestamp: '2024-01-10T09:24:12Z', event: 'AI Intake Complete', detail: 'Documents extracted and validated', type: 'ai' },
      { timestamp: '2024-01-10T09:25:01Z', event: 'Identity Verified', detail: 'Biometric and record match confirmed', type: 'ai' },
      { timestamp: '2024-01-10T09:26:30Z', event: 'Coverage Confirmed', detail: 'LTC benefit trigger conditions met', type: 'ai' },
      { timestamp: '2024-01-10T11:00:00Z', event: 'Claim Approved', detail: 'Auto-approved by AI — high confidence', type: 'ai' },
    ],
  },
  {
    id: 'CLM-2024-0892',
    claimantFirst: 'Robert',
    claimantLast: 'Chen',
    policyNumber: 'MLI-45891-LTD',
    dob: '1972-07-22',
    claimType: 'LTD',
    dateOfLoss: '2023-12-15',
    description: 'Claimant unable to perform occupational duties due to degenerative disc disease L4-L5.',
    status: 'Under Review',
    aiConfidence: 78,
    riskScore: 34,
    fraudProbability: 12,
    docCompleteness: 82,
    recommendedAction: 'Human Review Required — Incomplete occupational capacity assessment.',
    submittedAt: '2024-01-05T14:10:00Z',
    documents: ['Medical Records', 'Employer Statement', 'Policy Certificate'],
    timeline: [
      { timestamp: '2024-01-05T14:10:00Z', event: 'Claim Submitted', detail: 'FNOL received via portal', type: 'system' },
      { timestamp: '2024-01-05T14:11:22Z', event: 'AI Intake Complete', detail: 'Partial document set identified', type: 'ai' },
      { timestamp: '2024-01-05T14:12:10Z', event: 'Document Gap Detected', detail: 'Functional Capacity Evaluation missing', type: 'ai' },
      { timestamp: '2024-01-05T15:30:00Z', event: 'Routed to Adjuster', detail: 'Human review triggered — confidence below threshold', type: 'human' },
    ],
  },
  {
    id: 'CLM-2024-0893',
    claimantFirst: 'Patricia',
    claimantLast: 'Williams',
    policyNumber: 'MLI-92017-LIFE',
    dob: '1955-11-30',
    claimType: 'Life',
    dateOfLoss: '2024-01-02',
    description: 'Death benefit claim following insured\'s passing due to cardiac arrest.',
    status: 'Processing',
    aiConfidence: 91,
    riskScore: 8,
    fraudProbability: 5,
    docCompleteness: 95,
    recommendedAction: 'Approve — Documentation complete. Death certificate verified.',
    submittedAt: '2024-01-12T10:00:00Z',
    documents: ['Death Certificate', 'Policy Certificate', 'Beneficiary Designation', 'Medical Records'],
    timeline: [
      { timestamp: '2024-01-12T10:00:00Z', event: 'Claim Submitted', detail: 'FNOL received', type: 'system' },
      { timestamp: '2024-01-12T10:01:05Z', event: 'AI Processing Started', detail: 'Document analysis underway', type: 'ai' },
      { timestamp: '2024-01-12T10:03:22Z', event: 'Death Certificate Verified', detail: 'State registry cross-reference complete', type: 'ai' },
    ],
  },
  {
    id: 'CLM-2024-0894',
    claimantFirst: 'James',
    claimantLast: 'Rodriguez',
    policyNumber: 'MLI-33478-STD',
    dob: '1985-04-18',
    claimType: 'STD',
    dateOfLoss: '2024-01-09',
    description: 'Short-term disability due to pregnancy-related complications requiring bed rest.',
    status: 'Approved',
    aiConfidence: 98,
    riskScore: 5,
    fraudProbability: 1,
    docCompleteness: 100,
    recommendedAction: 'Approve — All criteria met. Standard pregnancy benefit applies.',
    submittedAt: '2024-01-11T08:45:00Z',
    documents: ['Physician Statement', 'Hospital Records', 'Policy Certificate'],
    timeline: [
      { timestamp: '2024-01-11T08:45:00Z', event: 'Claim Submitted', detail: 'FNOL received', type: 'system' },
      { timestamp: '2024-01-11T08:46:15Z', event: 'AI Intake Complete', detail: 'All documents verified', type: 'ai' },
      { timestamp: '2024-01-11T08:47:00Z', event: 'Claim Approved', detail: 'Auto-approved — 98% confidence', type: 'ai' },
    ],
  },
  {
    id: 'CLM-2024-0895',
    claimantFirst: 'Susan',
    claimantLast: 'Park',
    policyNumber: 'MLI-61234-ANN',
    dob: '1950-08-05',
    claimType: 'Annuity',
    dateOfLoss: '2024-01-01',
    description: 'Annuity claim for guaranteed income benefit, death of spouse triggering survivor benefit.',
    status: 'Pending Documents',
    aiConfidence: 65,
    riskScore: 45,
    fraudProbability: 8,
    docCompleteness: 60,
    recommendedAction: 'Request Documents — Marriage certificate and spouse death certificate required.',
    submittedAt: '2024-01-08T16:20:00Z',
    documents: ['Policy Certificate'],
    timeline: [
      { timestamp: '2024-01-08T16:20:00Z', event: 'Claim Submitted', detail: 'FNOL received', type: 'system' },
      { timestamp: '2024-01-08T16:21:10Z', event: 'Document Gap Detected', detail: 'Missing: marriage cert, death cert', type: 'ai' },
      { timestamp: '2024-01-08T16:22:00Z', event: 'Documents Requested', detail: 'Automated request sent to claimant', type: 'system' },
    ],
  },
  {
    id: 'CLM-2024-0896',
    claimantFirst: 'David',
    claimantLast: 'Martinez',
    policyNumber: 'MLI-88901-LTC',
    dob: '1944-12-20',
    claimType: 'LTC',
    dateOfLoss: '2023-12-01',
    description: 'Alzheimer\'s diagnosis requiring memory care facility placement.',
    status: 'Approved',
    aiConfidence: 95,
    riskScore: 10,
    fraudProbability: 2,
    docCompleteness: 97,
    recommendedAction: 'Approve — Cognitive impairment trigger confirmed by specialist.',
    submittedAt: '2023-12-05T11:30:00Z',
    documents: ['Physician Statement', 'Specialist Report', 'Policy Certificate', 'ADL Assessment', 'Care Plan'],
    timeline: [
      { timestamp: '2023-12-05T11:30:00Z', event: 'Claim Submitted', detail: 'FNOL received', type: 'system' },
      { timestamp: '2023-12-05T11:31:22Z', event: 'AI Intake Complete', detail: 'Cognitive impairment documents analyzed', type: 'ai' },
      { timestamp: '2023-12-05T11:33:00Z', event: 'Benefit Trigger Confirmed', detail: 'Cognitive impairment ADL criteria met', type: 'ai' },
      { timestamp: '2023-12-05T13:00:00Z', event: 'Claim Approved', detail: 'Auto-approved — 95% confidence', type: 'ai' },
    ],
  },
  {
    id: 'CLM-2024-0897',
    claimantFirst: 'Linda',
    claimantLast: 'Johnson',
    policyNumber: 'MLI-29045-LTD',
    dob: '1968-06-14',
    claimType: 'LTD',
    dateOfLoss: '2024-01-05',
    description: 'Long-term disability claim for fibromyalgia and chronic fatigue syndrome.',
    status: 'Under Review',
    aiConfidence: 72,
    riskScore: 52,
    fraudProbability: 18,
    docCompleteness: 75,
    recommendedAction: 'Specialist Review — Subjective condition requires independent medical exam.',
    submittedAt: '2024-01-09T13:00:00Z',
    documents: ['Physician Statement', 'Medical Records', 'Policy Certificate'],
    timeline: [
      { timestamp: '2024-01-09T13:00:00Z', event: 'Claim Submitted', detail: 'FNOL received', type: 'system' },
      { timestamp: '2024-01-09T13:01:18Z', event: 'Elevated Risk Flagged', detail: 'Subjective symptom pattern detected', type: 'ai' },
      { timestamp: '2024-01-09T13:05:00Z', event: 'Routed for IME', detail: 'Independent medical exam requested', type: 'human' },
    ],
  },
  {
    id: 'CLM-2024-0898',
    claimantFirst: 'Michael',
    claimantLast: 'Davis',
    policyNumber: 'MLI-54321-LIFE',
    dob: '1960-09-28',
    claimType: 'Life',
    dateOfLoss: '2024-01-14',
    description: 'Term life insurance death benefit claim — accidental death.',
    status: 'Processing',
    aiConfidence: 88,
    riskScore: 22,
    fraudProbability: 9,
    docCompleteness: 88,
    recommendedAction: 'Near Approval — Awaiting coroner report cross-reference.',
    submittedAt: '2024-01-15T07:00:00Z',
    documents: ['Death Certificate', 'Policy Certificate', 'Police Report'],
    timeline: [
      { timestamp: '2024-01-15T07:00:00Z', event: 'Claim Submitted', detail: 'FNOL received', type: 'system' },
      { timestamp: '2024-01-15T07:01:30Z', event: 'AI Intake Started', detail: 'Accidental death protocol initiated', type: 'ai' },
      { timestamp: '2024-01-15T07:05:00Z', event: 'Coroner Report Requested', detail: 'Awaiting official record', type: 'system' },
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
    status: 'Training',
    accuracy: 87,
    claimsProcessed: 428,
    lastActive: '1 hr ago',
  },
];

export const ACTIVITY_FEED: ActivityItem[] = [
  { id: '1', message: 'CLM-2024-0893 moved to Processing', time: '2 min ago', type: 'claim', claimId: 'CLM-2024-0893' },
  { id: '2', message: 'CLM-2024-0891 auto-approved by AI', time: '15 min ago', type: 'approval', claimId: 'CLM-2024-0891' },
  { id: '3', message: 'Fraud alert cleared on CLM-2024-0897', time: '32 min ago', type: 'alert', claimId: 'CLM-2024-0897' },
  { id: '4', message: 'Documents received for CLM-2024-0895', time: '1 hr ago', type: 'document', claimId: 'CLM-2024-0895' },
  { id: '5', message: 'CLM-2024-0894 auto-approved — 98% confidence', time: '2 hr ago', type: 'approval', claimId: 'CLM-2024-0894' },
  { id: '6', message: 'CLM-2024-0898 intake complete', time: '3 hr ago', type: 'claim', claimId: 'CLM-2024-0898' },
  { id: '7', message: 'New FNOL submitted: CLM-2024-0898', time: '3 hr ago', type: 'claim', claimId: 'CLM-2024-0898' },
  { id: '8', message: 'CLM-2024-0896 approved — LTC benefits active', time: '5 hr ago', type: 'approval', claimId: 'CLM-2024-0896' },
];

export const DASHBOARD_STATS = {
  claimsProcessed: 156,
  aiAccuracy: 94,
  processingSpeedGain: 68,
  pendingReview: 3,
  approvedThisWeek: 12,
  avgProcessingHours: 1.4,
};
