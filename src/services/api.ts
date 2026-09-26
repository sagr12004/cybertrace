import {
  ATM_LOCATIONS,
  CURRENT_INVESTIGATOR,
  HISTORICAL_WITHDRAWALS,
  INITIAL_ACCOUNTS,
  INITIAL_ALERTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_COMPLAINTS,
  INITIAL_INVESTIGATIONS,
  INITIAL_PREDICTIONS,
  INITIAL_TRANSACTIONS,
} from '../data/mockData';
import {
  Alert,
  AtmLocation,
  AuditLog,
  Complaint,
  Investigation,
  Transaction,
  WithdrawalPrediction,
  WithdrawalRecord,
} from '../types';
import { executeWithdrawalPrediction } from '../utils/predictionEngine';
import { computeAccountNetwork } from '../utils/graphAnalytics';

// Helper for safe fetch with mock fallback
async function fetchWithFallback<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if (fallbackData !== undefined) {
      console.info(`Using client-side fallback for ${url}:`, err);
      return fallbackData;
    }
    throw err;
  }
}

export const api = {
  // System Health
  async getHealth() {
    return fetchWithFallback('/api/health', undefined, {
      status: 'online',
      system: 'CyberTrace AI SIH Prototype (Client-Engine)',
      geminiConfigured: false,
      database: 'Synchronized State',
      timestamp: new Date().toISOString(),
    });
  },

  // Complaints
  async getComplaints(params?: { category?: string; status?: string; search?: string }): Promise<Complaint[]> {
    const query = new URLSearchParams(params as any).toString();
    const url = `/api/complaints${query ? `?${query}` : ''}`;
    return fetchWithFallback<Complaint[]>(url, undefined, INITIAL_COMPLAINTS);
  },

  async getComplaint(id: string): Promise<Complaint> {
    return fetchWithFallback<Complaint>(
      `/api/complaints/${id}`,
      undefined,
      INITIAL_COMPLAINTS.find((c) => c.id === id || c.complaintNumber === id) || INITIAL_COMPLAINTS[0]
    );
  },

  async createComplaint(data: Partial<Complaint>): Promise<Complaint> {
    return fetchWithFallback<Complaint>(
      '/api/complaints',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      {
        id: `CMP-${Date.now().toString().slice(-6)}`,
        complaintNumber: `CYBER-2026-0${INITIAL_COMPLAINTS.length + 843}`,
        victimReference: data.victimReference || 'VIC-BLR-9999',
        victimName: data.victimName || 'Anonymous',
        crimeCategory: data.crimeCategory || 'UPI fraud',
        fraudAmount: data.fraudAmount || 45000,
        complaintTimestamp: new Date().toISOString(),
        transactionReference: data.transactionReference || 'TXN-998811',
        suspectedAccount: data.suspectedAccount || 'ACC-MULE-4011',
        suspectedAccountName: data.suspectedAccountName || 'Suspected Account',
        bankName: data.bankName || 'State Bank of India',
        incidentLocation: data.incidentLocation || 'Koramangala, Bengaluru',
        status: 'New',
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
      }
    );
  },

  async updateComplaint(id: string, updates: Partial<Complaint>): Promise<Complaint> {
    return fetchWithFallback<Complaint>(
      `/api/complaints/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      },
      {
        ...(INITIAL_COMPLAINTS.find((c) => c.id === id) || INITIAL_COMPLAINTS[0]),
        ...updates,
      }
    );
  },

  // Transactions
  async getTransactions(complaintId?: string): Promise<Transaction[]> {
    const url = complaintId ? `/api/transactions?complaintId=${complaintId}` : '/api/transactions';
    const fallback = complaintId
      ? INITIAL_TRANSACTIONS.filter((t) => t.complaintId === complaintId)
      : INITIAL_TRANSACTIONS;
    return fetchWithFallback<Transaction[]>(url, undefined, fallback);
  },

  // Network Graph
  async getAccountNetwork(complaintId: string) {
    const fallback = computeAccountNetwork(complaintId, INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS);
    return fetchWithFallback(`/api/complaints/${complaintId}/network`, undefined, fallback);
  },

  // Withdrawals
  async getWithdrawals(complaintId?: string): Promise<WithdrawalRecord[]> {
    const url = complaintId ? `/api/complaints/${complaintId}/withdrawals` : '/api/withdrawals';
    return fetchWithFallback<WithdrawalRecord[]>(url, undefined, HISTORICAL_WITHDRAWALS);
  },

  // Predictions
  async getPredictions(complaintId: string): Promise<WithdrawalPrediction[]> {
    const fallback = INITIAL_PREDICTIONS.filter((p) => p.complaintId === complaintId);
    return fetchWithFallback<WithdrawalPrediction[]>(
      `/api/complaints/${complaintId}/predictions`,
      undefined,
      fallback.length > 0 ? fallback : [INITIAL_PREDICTIONS[0]]
    );
  },

  async runPrediction(complaintId: string, customTimeWindow?: string): Promise<WithdrawalPrediction> {
    const complaint = INITIAL_COMPLAINTS.find((c) => c.id === complaintId) || INITIAL_COMPLAINTS[0];
    const fallbackPrediction = executeWithdrawalPrediction({
      complaint,
      transactions: INITIAL_TRANSACTIONS,
      accounts: INITIAL_ACCOUNTS,
      historicalWithdrawals: HISTORICAL_WITHDRAWALS,
      atms: ATM_LOCATIONS,
      customTimeWindow: customTimeWindow as any,
    });

    return fetchWithFallback<WithdrawalPrediction>(
      `/api/complaints/${complaintId}/predict`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customTimeWindow }),
      },
      fallbackPrediction
    );
  },

  // ATMs & Hotspots
  async getAtms(): Promise<AtmLocation[]> {
    return fetchWithFallback<AtmLocation[]>('/api/atms', undefined, ATM_LOCATIONS);
  },

  async getHotspots(): Promise<any[]> {
    const fallback = INITIAL_PREDICTIONS.map((p) => ({
      id: p.id,
      complaintId: p.complaintId,
      complaintNumber: p.complaintNumber,
      name: p.predictedZone,
      latitude: p.predictedCenterLat,
      longitude: p.predictedCenterLng,
      radiusMeters: p.confidenceRadiusMeters,
      riskScore: p.riskScore,
      riskCategory: p.riskCategory,
      timeWindow: p.timeWindowBucket,
      candidateAtms: p.candidateAtms,
      explanation: p.explanation,
    }));
    return fetchWithFallback<any[]>('/api/hotspots', undefined, fallback);
  },

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return fetchWithFallback<Alert[]>('/api/alerts', undefined, INITIAL_ALERTS);
  },

  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert> {
    return fetchWithFallback<Alert>(
      `/api/alerts/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      },
      {
        ...(INITIAL_ALERTS.find((a) => a.id === id) || INITIAL_ALERTS[0]),
        ...updates,
      }
    );
  },

  // Investigations
  async getInvestigation(complaintId: string): Promise<Investigation> {
    const fallback =
      INITIAL_INVESTIGATIONS.find((i) => i.complaintId === complaintId) || {
        id: `INV-${complaintId}`,
        complaintId,
        investigatorId: CURRENT_INVESTIGATOR.id,
        investigatorName: CURRENT_INVESTIGATOR.name,
        status: 'Active',
        notes: ['Investigation initiated.'],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
    return fetchWithFallback<Investigation>(`/api/investigations/${complaintId}`, undefined, fallback);
  },

  async updateInvestigation(
    complaintId: string,
    updates: { actionTaken?: string; note?: string; status?: any }
  ): Promise<Investigation> {
    return fetchWithFallback<Investigation>(
      `/api/investigations/${complaintId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      },
      {
        id: `INV-${complaintId}`,
        complaintId,
        investigatorId: CURRENT_INVESTIGATOR.id,
        investigatorName: CURRENT_INVESTIGATOR.name,
        status: updates.status || 'Active',
        actionTaken: updates.actionTaken as any,
        notes: updates.note ? [updates.note] : [],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }
    );
  },

  // Audit Logs
  async getAuditLogs(complaintId?: string): Promise<AuditLog[]> {
    const url = complaintId ? `/api/investigations/${complaintId}/audit` : '/api/audit';
    const fallback = complaintId
      ? INITIAL_AUDIT_LOGS.filter((l) => l.complaintId === complaintId)
      : INITIAL_AUDIT_LOGS;
    return fetchWithFallback<AuditLog[]>(url, undefined, fallback);
  },

  // Comprehensive Report
  async getReport(complaintId: string) {
    const complaint = INITIAL_COMPLAINTS.find((c) => c.id === complaintId) || INITIAL_COMPLAINTS[0];
    const txns = INITIAL_TRANSACTIONS.filter((t) => t.complaintId === complaint.id);
    const prediction = INITIAL_PREDICTIONS.find((p) => p.complaintId === complaint.id) || INITIAL_PREDICTIONS[0];
    const investigation = INITIAL_INVESTIGATIONS.find((i) => i.complaintId === complaint.id);
    const logs = INITIAL_AUDIT_LOGS.filter((l) => l.complaintId === complaint.id);
    const network = computeAccountNetwork(complaint.id, INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS);

    const fallback = {
      reportTitle: `POLICE FIRST INFORMATION & MONEY-TRAIL TRACING REPORT - ${complaint.complaintNumber}`,
      generatedAt: new Date().toISOString(),
      investigator: CURRENT_INVESTIGATOR,
      complaint,
      transactions: txns,
      networkSummary: network.metrics,
      prediction,
      investigation,
      auditLogs: logs,
      disclaimer: 'SYNTHETIC DATASET DEMONSTRATION PROTOTYPE FOR SMART INDIA HACKATHON. NOT FOR REAL JUDICIAL USE.',
    };

    return fetchWithFallback(`/api/investigations/${complaintId}/report`, undefined, fallback);
  },

  // AI Copilot
  async summarizeComplaint(complaintId: string) {
    return fetchWithFallback(
      '/api/ai/summarize',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaintId }),
      },
      {
        summary: `Complaint ${complaintId} involves structured cyber fraud where funds moved via rapid layering across multiple mule tiers. High risk of physical ATM withdrawal estimated in South Bengaluru corridor. Immediate bank nodal freeze recommended.`,
        source: 'CyberTrace Forensic Engine (Local Fallback)',
      }
    );
  },

  async askAi(question: string, complaintId: string) {
    return fetchWithFallback(
      '/api/ai/ask',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, complaintId }),
      },
      {
        answer: `Forensic Analysis: Regarding "${question}", the money trail exhibits high-velocity fan-out into mule accounts with proven repeat cash extractions at candidate ATM hubs. Surveillance and nodal freeze are advised.`,
        source: 'CyberTrace Forensic Intelligence Engine (Rule-based Fallback)',
      }
    );
  },

  // Reset Demo
  async resetDemo() {
    return fetchWithFallback(
      '/api/demo/reset',
      { method: 'POST' },
      { success: true, message: 'Reset successful' }
    );
  },
};
