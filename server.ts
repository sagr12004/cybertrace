import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { GoogleGenAI } from '@google/genai';
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
} from './src/data/mockData';
import { executeWithdrawalPrediction } from './src/utils/predictionEngine';
import { computeAccountNetwork } from './src/utils/graphAnalytics';
import { Alert, AuditLog, Complaint, Investigation, WithdrawalPrediction } from './src/types';
import { generateScenarioEvents, SCENARIO_METADATA, ScenarioType } from './simulator/generator';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-Memory Database store with seed data
let dbComplaints: Complaint[] = JSON.parse(JSON.stringify(INITIAL_COMPLAINTS));
let dbAccounts = JSON.parse(JSON.stringify(INITIAL_ACCOUNTS));
let dbTransactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
let dbAtms = JSON.parse(JSON.stringify(ATM_LOCATIONS));
let dbWithdrawals = JSON.parse(JSON.stringify(HISTORICAL_WITHDRAWALS));
let dbPredictions: WithdrawalPrediction[] = JSON.parse(JSON.stringify(INITIAL_PREDICTIONS));
let dbAlerts: Alert[] = JSON.parse(JSON.stringify(INITIAL_ALERTS));
let dbInvestigations: Investigation[] = JSON.parse(JSON.stringify(INITIAL_INVESTIGATIONS));
let dbAuditLogs: AuditLog[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));

// Gemini API client initialization
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI();
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI with key:', err);
  }
}

// ---------------- REST API ENDPOINTS ----------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'CyberTrace AI SIH Prototype API',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    database: 'In-Memory / Supabase-ready Mock Engine',
    timestamp: new Date().toISOString(),
  });
});

// Complaints
app.get('/api/complaints', (req: Request, res: Response) => {
  const { category, status, search } = req.query;
  let results = [...dbComplaints];

  if (category && typeof category === 'string') {
    results = results.filter((c) => c.crimeCategory === category);
  }
  if (status && typeof status === 'string') {
    results = results.filter((c) => c.status === status);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.complaintNumber.toLowerCase().includes(q) ||
        c.victimName.toLowerCase().includes(q) ||
        c.suspectedAccount.toLowerCase().includes(q) ||
        c.incidentLocation.toLowerCase().includes(q)
    );
  }
  res.json(results);
});

app.post('/api/complaints', (req: Request, res: Response) => {
  const body = req.body;
  const count = dbComplaints.length + 842;
  const complaintNumber = `CYBER-2026-0${count}`;
  const newComplaint: Complaint = {
    id: `CMP-2026-0${count}`,
    complaintNumber,
    victimReference: body.victimReference || `VIC-BLR-${Math.floor(1000 + Math.random() * 9000)}`,
    victimName: body.victimName || 'Anonymous Complainant',
    crimeCategory: body.crimeCategory || 'UPI fraud',
    fraudAmount: Number(body.fraudAmount) || 25000,
    complaintTimestamp: body.complaintTimestamp || new Date().toISOString(),
    transactionReference: body.transactionReference || `TXN-${Date.now().toString().slice(-6)}`,
    suspectedAccount: body.suspectedAccount || 'ACC-MULE-4011',
    suspectedAccountName: body.suspectedAccountName || 'Suspected Beneficiary Account',
    bankName: body.bankName || 'State Bank of India',
    incidentLocation: body.incidentLocation || 'Koramangala, Bengaluru',
    status: 'New',
    notes: body.notes || 'Complaint lodged via CyberTrace intake portal.',
    createdAt: new Date().toISOString(),
  };

  dbComplaints.unshift(newComplaint);

  // Automatically create investigation entry
  const newInv: Investigation = {
    id: `INV-2026-0${count}`,
    complaintId: newComplaint.id,
    investigatorId: CURRENT_INVESTIGATOR.id,
    investigatorName: CURRENT_INVESTIGATOR.name,
    status: 'Active',
    notes: [`Initial cybercrime complaint ${complaintNumber} registered.`],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  dbInvestigations.unshift(newInv);

  // Add audit log
  const newLog: AuditLog = {
    id: `AUD-${Date.now()}`,
    investigationId: newInv.id,
    complaintId: newComplaint.id,
    userId: CURRENT_INVESTIGATOR.id,
    userName: CURRENT_INVESTIGATOR.name,
    userRole: CURRENT_INVESTIGATOR.role,
    action: 'COMPLAINT_REGISTERED',
    details: `Registered complaint ${complaintNumber} for ₹${newComplaint.fraudAmount.toLocaleString('en-IN')}`,
    ipAddress: '10.14.22.84',
    timestamp: new Date().toISOString(),
  };
  dbAuditLogs.unshift(newLog);

  res.status(201).json(newComplaint);
});

app.get('/api/complaints/:id', (req: Request, res: Response) => {
  const complaint = dbComplaints.find((c) => c.id === req.params.id || c.complaintNumber === req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  res.json(complaint);
});

app.patch('/api/complaints/:id', (req: Request, res: Response) => {
  const index = dbComplaints.findIndex((c) => c.id === req.params.id || c.complaintNumber === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  dbComplaints[index] = { ...dbComplaints[index], ...req.body };
  res.json(dbComplaints[index]);
});

// Transactions
app.get('/api/transactions', (req: Request, res: Response) => {
  const { complaintId } = req.query;
  if (complaintId && typeof complaintId === 'string') {
    return res.json(dbTransactions.filter((t: any) => t.complaintId === complaintId));
  }
  res.json(dbTransactions);
});

app.get('/api/complaints/:id/transactions', (req: Request, res: Response) => {
  const txns = dbTransactions.filter((t: any) => t.complaintId === req.params.id);
  res.json(txns);
});

// Account Network Analysis
app.get('/api/complaints/:id/network', (req: Request, res: Response) => {
  const network = computeAccountNetwork(req.params.id, dbAccounts, dbTransactions);
  res.json(network);
});

// Withdrawals
app.get('/api/withdrawals', (req: Request, res: Response) => {
  res.json(dbWithdrawals);
});

app.get('/api/complaints/:id/withdrawals', (req: Request, res: Response) => {
  const complaint = dbComplaints.find((c) => c.id === req.params.id);
  if (!complaint) return res.json(dbWithdrawals.slice(0, 10));
  const related = dbWithdrawals.filter((w: any) => w.complaintId === req.params.id || w.accountId === complaint.suspectedAccount);
  res.json(related.length > 0 ? related : dbWithdrawals.slice(0, 15));
});

// Predictions
app.get('/api/complaints/:id/predictions', (req: Request, res: Response) => {
  const preds = dbPredictions.filter((p) => p.complaintId === req.params.id);
  res.json(preds);
});

// Production ML Candidate Ranking Bridge (Milestone 1)
app.post('/api/v1/predict/rank', async (req: Request, res: Response) => {
  try {
    const { complaintId, complaint: customComplaint, candidateAtms, customTimeWindow } = req.body || {};
    let complaint = customComplaint;
    if (!complaint && complaintId) {
      complaint = dbComplaints.find((c) => c.id === complaintId || c.complaintNumber === complaintId);
    }
    if (!complaint && dbComplaints.length > 0) {
      complaint = dbComplaints[0];
    }
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const payload = {
      complaint,
      candidateAtms: candidateAtms || dbAtms,
      transactions: dbTransactions.filter((t: any) => t.complaintId === complaint.id),
      historicalWithdrawals: dbWithdrawals,
      customTimeWindow,
    };

    const pythonScript = path.join(__dirname, 'ml', 'predict.py');
    execFile(
      'python',
      [pythonScript, '--payload', JSON.stringify(payload)],
      { maxBuffer: 10 * 1024 * 1024, cwd: path.join(__dirname, 'ml') },
      (error, stdout, stderr) => {
        if (error || !stdout) {
          console.warn('Python ML runner fallback triggered:', stderr || error);
          const legacyPred = executeWithdrawalPrediction({
            complaint,
            transactions: dbTransactions,
            accounts: dbAccounts,
            historicalWithdrawals: dbWithdrawals,
            atms: dbAtms,
            customTimeWindow,
          });
          return res.json({
            status: 'success',
            mode: 'fallback_heuristic',
            predictedZone: legacyPred.predictedZone,
            overallRiskScore: legacyPred.riskScore,
            overallRiskCategory: legacyPred.riskCategory,
            candidateAtms: legacyPred.candidateAtms,
            timeHorizonProbabilities: {
              within_30m: 0.35,
              within_60m: 0.45,
              within_180m: 0.15,
              beyond_180m: 0.05
            },
            modelMetadata: {
              model: 'CyberTrace-SpatialEnsemble-Ranker',
              version: '1.4.0-sih (Fallback)',
              status: 'Active'
            }
          });
        }
        try {
          const result = JSON.parse(stdout);
          return res.json(result);
        } catch (parseErr) {
          return res.status(500).json({ error: 'Failed to parse ML output', details: String(parseErr) });
        }
      }
    );
  } catch (err: any) {
    res.status(500).json({ error: 'Ranking inference failed', message: err.message });
  }
});

// Controllable Synthetic Stream Simulator Endpoints (Milestone 3)
app.get('/api/v1/simulator/scenarios', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    scenarios: SCENARIO_METADATA,
  });
});

app.post('/api/v1/simulator/generate', (req: Request, res: Response) => {
  try {
    const { scenario = 'stable_hotspot', count, inject = true } = req.body || {};
    const result = generateScenarioEvents(scenario as ScenarioType, { caseCount: count });
    
    if (inject) {
      result.complaints.forEach((comp: any) => {
        dbComplaints.unshift(comp as Complaint);
      });
      result.transactions.forEach((txn: any) => {
        dbTransactions.unshift(txn);
      });
      result.withdrawals.forEach((wdl: any) => {
        dbWithdrawals.unshift(wdl);
      });
    }

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Simulation generation failed', message: err.message });
  }
});

app.post('/api/complaints/:id/predict', (req: Request, res: Response) => {
  const complaint = dbComplaints.find((c) => c.id === req.params.id || c.complaintNumber === req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const { customTimeWindow } = req.body || {};
  const prediction = executeWithdrawalPrediction({
    complaint,
    transactions: dbTransactions,
    accounts: dbAccounts,
    historicalWithdrawals: dbWithdrawals,
    atms: dbAtms,
    customTimeWindow,
  });

  dbPredictions.unshift(prediction);

  // If high risk (>70%), auto-generate alert if one does not exist
  if (prediction.riskScore >= 70) {
    const existingAlert = dbAlerts.find((a) => a.complaintId === complaint.id && a.status !== 'Resolved');
    if (!existingAlert) {
      const newAlert: Alert = {
        id: `ALT-${Date.now().toString().slice(-6)}`,
        complaintId: complaint.id,
        complaintNumber: complaint.complaintNumber,
        predictionId: prediction.id,
        title: `High-Risk Cashout Imminent - ${prediction.predictedZone}`,
        predictedArea: prediction.candidateAtms[0]?.area || prediction.predictedZone,
        candidateAtm: prediction.candidateAtms[0]?.atmCode || 'ATM Cluster',
        riskScore: prediction.riskScore,
        riskCategory: prediction.riskCategory,
        timeWindow: prediction.timeWindowBucket,
        alertType: 'High-Velocity Cashout Risk',
        status: 'New',
        assignedUnit: 'Cyber Crime Police Field Dispatch Unit',
        supportingEvidence: prediction.explanation,
        createdAt: new Date().toISOString(),
      };
      dbAlerts.unshift(newAlert);
    }
  }

  // Audit log entry
  const log: AuditLog = {
    id: `AUD-${Date.now()}`,
    investigationId: `INV-${complaint.id}`,
    complaintId: complaint.id,
    userId: CURRENT_INVESTIGATOR.id,
    userName: CURRENT_INVESTIGATOR.name,
    userRole: CURRENT_INVESTIGATOR.role,
    action: 'WITHDRAWAL_PREDICTION_RUN',
    details: `Executed ML prediction engine. Result: ${prediction.riskScore}% risk score for ${prediction.predictedZone}`,
    ipAddress: '10.14.22.84',
    timestamp: new Date().toISOString(),
  };
  dbAuditLogs.unshift(log);

  res.json(prediction);
});

// Map ATMs and Hotspots
app.get('/api/atms', (req: Request, res: Response) => {
  res.json(dbAtms);
});

app.get('/api/hotspots', (req: Request, res: Response) => {
  // Aggregate predictions and high-activity ATM clusters
  const hotspots = dbPredictions.map((p) => ({
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
  res.json(hotspots);
});

// Alerts
app.get('/api/alerts', (req: Request, res: Response) => {
  res.json(dbAlerts);
});

app.post('/api/alerts', (req: Request, res: Response) => {
  const newAlert: Alert = {
    id: `ALT-${Date.now().toString().slice(-6)}`,
    ...req.body,
    status: req.body.status || 'New',
    createdAt: new Date().toISOString(),
  };
  dbAlerts.unshift(newAlert);
  res.status(201).json(newAlert);
});

app.patch('/api/alerts/:id', (req: Request, res: Response) => {
  const index = dbAlerts.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  dbAlerts[index] = { ...dbAlerts[index], ...req.body };
  res.json(dbAlerts[index]);
});

// Investigations
app.get('/api/investigations', (req: Request, res: Response) => {
  res.json(dbInvestigations);
});

app.get('/api/investigations/:id', (req: Request, res: Response) => {
  const inv = dbInvestigations.find((i) => i.id === req.params.id || i.complaintId === req.params.id);
  if (!inv) return res.status(404).json({ error: 'Investigation not found' });
  res.json(inv);
});

app.patch('/api/investigations/:id', (req: Request, res: Response) => {
  const index = dbInvestigations.findIndex((i) => i.id === req.params.id || i.complaintId === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Investigation not found' });
  }
  const current = dbInvestigations[index];
  const updated = {
    ...current,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  if (req.body.note) {
    updated.notes = [
      `${new Date().toISOString().replace('T', ' ').slice(0, 16)} - ${req.body.note}`,
      ...(current.notes || []),
    ];
  }
  dbInvestigations[index] = updated;

  // Add audit log
  const log: AuditLog = {
    id: `AUD-${Date.now()}`,
    investigationId: updated.id,
    complaintId: updated.complaintId,
    userId: CURRENT_INVESTIGATOR.id,
    userName: CURRENT_INVESTIGATOR.name,
    userRole: CURRENT_INVESTIGATOR.role,
    action: req.body.actionTaken ? `DECISION_${req.body.actionTaken.toUpperCase().replace(/\s+/g, '_')}` : 'INVESTIGATION_UPDATED',
    details: req.body.actionTaken || req.body.note || 'Investigation updated by investigator.',
    ipAddress: '10.14.22.84',
    timestamp: new Date().toISOString(),
  };
  dbAuditLogs.unshift(log);

  res.json(updated);
});

// Audit Logs
app.get('/api/investigations/:id/audit', (req: Request, res: Response) => {
  const logs = dbAuditLogs.filter(
    (l) => l.investigationId === req.params.id || l.complaintId === req.params.id
  );
  res.json(logs.length > 0 ? logs : dbAuditLogs);
});

app.get('/api/audit', (req: Request, res: Response) => {
  res.json(dbAuditLogs);
});

// Comprehensive Investigation Report
app.get('/api/investigations/:id/report', (req: Request, res: Response) => {
  const complaint = dbComplaints.find((c) => c.id === req.params.id || c.complaintNumber === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const txns = dbTransactions.filter((t: any) => t.complaintId === complaint.id);
  const prediction = dbPredictions.find((p) => p.complaintId === complaint.id) || dbPredictions[0];
  const investigation = dbInvestigations.find((i) => i.complaintId === complaint.id);
  const logs = dbAuditLogs.filter((l) => l.complaintId === complaint.id);
  const network = computeAccountNetwork(complaint.id, dbAccounts, dbTransactions);

  res.json({
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
  });
});

// Reset Demo Scenario to initial state
app.post('/api/demo/reset', (req: Request, res: Response) => {
  dbComplaints = JSON.parse(JSON.stringify(INITIAL_COMPLAINTS));
  dbAccounts = JSON.parse(JSON.stringify(INITIAL_ACCOUNTS));
  dbTransactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
  dbAtms = JSON.parse(JSON.stringify(ATM_LOCATIONS));
  dbWithdrawals = JSON.parse(JSON.stringify(HISTORICAL_WITHDRAWALS));
  dbPredictions = JSON.parse(JSON.stringify(INITIAL_PREDICTIONS));
  dbAlerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
  dbInvestigations = JSON.parse(JSON.stringify(INITIAL_INVESTIGATIONS));
  dbAuditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));

  res.json({ success: true, message: 'Demo scenario reset to initial clean state.' });
});

// AI Copilot Endpoints (with intelligent deterministic fallback if Gemini key is unset)
app.post('/api/ai/summarize', async (req: Request, res: Response) => {
  const { complaintId } = req.body;
  const complaint = dbComplaints.find((c) => c.id === complaintId || c.complaintNumber === complaintId) || dbComplaints[0];
  const txns = dbTransactions.filter((t: any) => t.complaintId === complaint.id);
  const prediction = dbPredictions.find((p) => p.complaintId === complaint.id);

  // If Gemini API is active, call gemini-3.8-flash
  if (genAI && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are CyberTrace AI, an expert cybercrime forensic analyst assistant for Indian law enforcement.
Summarize the following cybercrime complaint and transaction trail concisely for an investigator:
Complaint Number: ${complaint.complaintNumber}
Victim: ${complaint.victimName} (${complaint.victimReference})
Fraud Category: ${complaint.crimeCategory}
Amount: ₹${complaint.fraudAmount}
Suspected Account: ${complaint.suspectedAccount} (${complaint.suspectedAccountName}, ${complaint.bankName})
Location: ${complaint.incidentLocation}
Notes: ${complaint.notes}
Transactions count: ${txns.length}
Predicted Withdrawal Hotspot: ${prediction ? prediction.predictedZone : 'Under analysis'}
Risk Score: ${prediction ? prediction.riskScore : 'Pending'}

Provide:
1. Executive Summary (2 sentences)
2. Money Movement Modus Operandi
3. Urgent Investigative Actions Recommended`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        summary: response.text,
        source: 'Gemini 3.8 Flash (Server-Side)',
      });
    } catch (err: any) {
      console.warn('Gemini summarization failed, using local forensic rule-based engine:', err?.message);
    }
  }

  // High-fidelity deterministic forensic summary fallback
  const fallbackSummary = `### Forensic Complaint Summary: ${complaint.complaintNumber}
**Victim Profile:** ${complaint.victimName} (Ref: ${complaint.victimReference})
**Loss Incurred:** ₹${complaint.fraudAmount.toLocaleString('en-IN')} via ${complaint.crimeCategory}

**Modus Operandi Breakdown:**
- **Primary Intake:** The victim was deceived via ${complaint.notes}
- **Rapid Layering Velocity:** Stolen capital was forwarded to suspected mule node ${complaint.suspectedAccount} (${complaint.bankName}) and split across multiple secondary nodes within minutes.
- **Withdrawal Threat:** ${prediction ? `Risk score estimated at ${prediction.riskScore}% for ${prediction.predictedZone} with candidate ATM ${prediction.candidateAtms[0]?.name || 'ATM Cluster'}.` : 'Prediction engine flagged imminent liquidation.'}

**Immediate Recommended Actions:**
1. Issue urgent Section 91 CrPC notice to ${complaint.bankName} Nodal Officer to freeze debit privileges on ${complaint.suspectedAccount}.
2. Dispatch PCR mobile surveillance team to inspect CCTV feeds at ${prediction?.candidateAtms[0]?.name || 'predicted ATM cluster'}.
3. Trace CDR / IP-DR logs linked to mobile banking session registered under the suspected mule.`;

  res.json({
    summary: fallbackSummary,
    source: 'CyberTrace Deterministic Forensic Rule Engine (Local Fallback)',
  });
});

app.post('/api/ai/ask', async (req: Request, res: Response) => {
  const { question, complaintId } = req.body;
  const complaint = dbComplaints.find((c) => c.id === complaintId || c.complaintNumber === complaintId) || dbComplaints[0];
  const txns = dbTransactions.filter((t: any) => t.complaintId === complaint.id);
  const prediction = dbPredictions.find((p) => p.complaintId === complaint.id);

  if (genAI && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are CyberTrace AI Copilot, assisting an Indian law enforcement cybercrime investigator.
Current Case Context:
Complaint: ${complaint.complaintNumber} - ${complaint.crimeCategory} - ₹${complaint.fraudAmount}
Victim: ${complaint.victimName}
Suspected Beneficiary: ${complaint.suspectedAccount} (${complaint.suspectedAccountName}, ${complaint.bankName})
Transactions in file: ${txns.length} transactions totaling ₹${txns.reduce((s: number, t: any) => s + t.amount, 0)}
Predicted ATM Hotspot: ${prediction?.predictedZone || 'Koramangala 5th Block'}
Risk Score: ${prediction?.riskScore || 88}%
Time Window: ${prediction?.timeWindowBucket || '0-6 hours'}

Investigator's Question: "${question}"

Provide a crisp, actionable, law-enforcement-oriented answer based STRICTLY on the actual case data. Do not fabricate banks, names or amounts not present in the data.`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        answer: response.text,
        source: 'Gemini 3.8 Flash (Server-Side)',
      });
    } catch (err: any) {
      console.warn('Gemini chat failed, using deterministic AI assistant response:', err?.message);
    }
  }

  // Context-aware forensic fallback answers
  const q = (question || '').toLowerCase();
  let answer = '';

  if (q.includes('why') && (q.includes('suspicious') || q.includes('mule'))) {
    answer = `Account **${complaint.suspectedAccount} (${complaint.suspectedAccountName})** is flagged high-risk because:
1. **Pass-through Ratio:** 99.2% of inflow was liquidated or split into secondary accounts in under 5 minutes.
2. **KYC Discrepancy:** Bank KYC documentation was verified as flagged/forged with recently altered registered mobile numbers.
3. **Syndicate Links:** Graph analysis links this account directly to ${txns.length} hops culminating in Cash Liquidation Hub ACC-CASH-7721.`;
  } else if (q.includes('predicted') || q.includes('atm') || q.includes('location')) {
    answer = `The predicted hotspot **${prediction?.predictedZone || 'Koramangala 5th Block'}** was computed using:
1. **Spatial DBSCAN Clustering:** 7 historical withdrawals linked to this syndicate occurred at ${prediction?.candidateAtms[0]?.name || 'SBI Koramangala 5th Block ATM'}.
2. **Velocity Trigger:** Funds reached stage 2 aggregation within 15 minutes, which historically correlates with physical ATM extraction in South Bengaluru.
3. **Time-of-Day Match:** Current time matches the historical 18:00 - 22:00 / morning banking window liquidation pattern.`;
  } else if (q.includes('first') || q.includes('priority') || q.includes('investigate')) {
    answer = `**Priority Investigative Leads:**
1. **Target Account Freeze:** Priority 1 is transaction \`${txns[0]?.transactionReference || 'UPI-260926-881204'}\` targeting ${complaint.suspectedAccount}.
2. **CCTV Preservation:** Request urgent 24-hour DVR backup from ${prediction?.candidateAtms[0]?.name || 'SBI Koramangala 5th Block'}.
3. **Device Fingerprint:** Check IMEI and UPI app device IDs through NPCI liaison desk.`;
  } else {
    answer = `Based on complaint **${complaint.complaintNumber}** (₹${complaint.fraudAmount.toLocaleString('en-IN')}), the funds have layered across ${txns.length} accounts. Prediction engine calculates an **${prediction?.riskScore || 88}% High Risk** for cash extraction at **${prediction?.candidateAtms[0]?.name || 'SBI Koramangala 5th Block'}** in the **${prediction?.timeWindowBucket || '0-6 hours'}** window. Human review and bank liaison notice are strongly advised.`;
  }

  res.json({
    answer,
    source: 'CyberTrace Forensic Intelligence Engine (Rule-based Fallback)',
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CyberTrace AI] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
