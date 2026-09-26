export type CrimeCategory =
  | 'UPI fraud'
  | 'Phishing'
  | 'Online banking fraud'
  | 'Investment fraud'
  | 'Other cybercrime';

export type ComplaintStatus =
  | 'New'
  | 'Assigned'
  | 'Under Investigation'
  | 'Escalated'
  | 'Resolved'
  | 'Closed';

export type RiskLevel = 'High' | 'Medium' | 'Low' | 'Informational';

export type AccountRiskStatus = 'High Risk' | 'Suspicious' | 'Under Observation' | 'Verified Safe';

export type TransactionType = 'UPI' | 'IMPS' | 'NEFT' | 'RTGS' | 'Card / POS' | 'ATM Withdrawal';

export type AlertStatus = 'New' | 'Acknowledged' | 'Under Review' | 'Resolved';

export type TimeWindow = '0-6 hours' | '6-12 hours' | '12-24 hours' | 'Over 24 hours';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Senior Cybercrime Investigator' | 'Cyber Fraud Analyst' | 'Bank Nodal Officer';
  badgeNumber: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  victimReference: string;
  victimName: string;
  crimeCategory: CrimeCategory;
  fraudAmount: number;
  complaintTimestamp: string;
  transactionReference: string;
  suspectedAccount: string;
  suspectedAccountName: string;
  bankName: string;
  incidentLocation: string;
  status: ComplaintStatus;
  investigatorId?: string;
  investigatorName?: string;
  notes?: string;
  evidenceFiles?: string[];
  createdAt: string;
}

export interface Account {
  id: string;
  accountReference: string;
  holderName: string;
  bankName: string;
  accountType: 'Savings' | 'Current' | 'Mule Candidate' | 'Beneficiary' | 'Victim Account';
  riskStatus: AccountRiskStatus;
  riskScore: number; // 0-100
  totalInflow: number;
  totalOutflow: number;
  kycStatus: 'Verified' | 'Unverified / Forged' | 'Flagged';
  openedDate: string;
  branch: string;
  city: string;
}

export interface Transaction {
  id: string;
  transactionReference: string;
  senderAccountId: string;
  senderAccountRef: string;
  senderName: string;
  receiverAccountId: string;
  receiverAccountRef: string;
  receiverName: string;
  amount: number;
  transactionTimestamp: string;
  transactionType: TransactionType;
  status: 'Completed' | 'Pending' | 'Flagged' | 'Frozen';
  complaintId: string;
  layer: number; // 0 = victim to 1st mule, 1 = layer 1 to layer 2, etc.
  flags: string[];
}

export interface AtmLocation {
  id: string;
  atmCode: string;
  name: string;
  bankName: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  cashAvailable: boolean;
  cctvOperational: boolean;
  totalHistoricalWithdrawals: number;
  historicalFraudIncidentCount: number;
}

export interface WithdrawalRecord {
  id: string;
  accountId: string;
  accountRef: string;
  atmId: string;
  atmCode: string;
  atmArea: string;
  amount: number;
  withdrawalTimestamp: string;
  latitude: number;
  longitude: number;
  complaintId?: string;
  cardType: string;
  isFlagged: boolean;
}

export interface PredictionFactor {
  name: string;
  weight: number;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface WithdrawalPrediction {
  id: string;
  complaintId: string;
  complaintNumber: string;
  candidateAtms: {
    atmId: string;
    atmCode: string;
    name: string;
    area: string;
    latitude: number;
    longitude: number;
    matchScore: number; // 0 - 100
    estimatedDistanceKm: number;
  }[];
  predictedZone: string;
  predictedCenterLat: number;
  predictedCenterLng: number;
  confidenceRadiusMeters: number;
  predictedStart: string;
  predictedEnd: string;
  timeWindowBucket: TimeWindow;
  riskScore: number; // 0 - 100
  riskCategory: RiskLevel;
  explanation: string;
  supportingEvidence: string[];
  factors: PredictionFactor[];
  modelVersion: string;
  createdAt: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Escalated';
  isSyntheticData: boolean;
}

export interface Alert {
  id: string;
  complaintId: string;
  complaintNumber: string;
  predictionId?: string;
  title: string;
  predictedArea: string;
  candidateAtm: string;
  riskScore: number;
  riskCategory: RiskLevel;
  timeWindow: string;
  alertType: 'High-Velocity Cashout Risk' | 'Mule Liquidation Imminent' | 'Geo-Proximity Alert';
  status: AlertStatus;
  assignedUnit: string;
  supportingEvidence: string;
  createdAt: string;
}

export interface Investigation {
  id: string;
  complaintId: string;
  investigatorId: string;
  investigatorName: string;
  status: 'Active' | 'Under Review' | 'Escalated to Cyber Cell' | 'Liaison Bank Notified' | 'Resolved';
  actionTaken?: 'Approved for Field Interception' | 'Rejected - False Positive' | 'Escalated to State CID' | 'Account Freeze Request Issued';
  notes: string[];
  updatedAt: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  investigationId: string;
  complaintId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface GraphNodeData {
  id: string;
  label: string;
  accountRef: string;
  accountType: string;
  bankName: string;
  riskStatus: AccountRiskStatus;
  riskScore: number;
  totalVolume: number;
  inDegree: number;
  outDegree: number;
  hopsFromVictim: number;
  centralityScore: number;
  isVictim?: boolean;
  isMule?: boolean;
  isBeneficiary?: boolean;
  isAtmTarget?: boolean;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  amount: number;
  timestamp: string;
  transactionRef: string;
  type: TransactionType;
  layer: number;
  flags: string[];
}
