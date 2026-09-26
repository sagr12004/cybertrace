/**
 * CyberTrace AI - Controllable Synthetic Event Stream Simulator (SIH 2026 / PS 26184)
 * Generates multi-scenario financial crime streams across:
 * 1. stable_hotspot: Recurring mule withdrawals in dense urban corridors.
 * 2. fraud_burst: High-velocity parallel fan-out cashouts across distributed ATMs.
 * 3. cold_location: Emerging corridors with cold ATMs testing zero-shot generalization.
 */

export type ScenarioType = 'stable_hotspot' | 'fraud_burst' | 'cold_location';

export interface SimulatedComplaint {
  id: string;
  complaintNumber: string;
  victimReference: string;
  victimName: string;
  crimeCategory: string;
  fraudAmount: number;
  complaintTimestamp: string;
  transactionReference: string;
  suspectedAccount: string;
  suspectedAccountName: string;
  bankName: string;
  incidentLocation: string;
  status: 'New' | 'Under Investigation' | 'Action Taken';
  notes: string;
  provenance: EventProvenance;
}

export interface SimulatedTransaction {
  id: string;
  transactionReference: string;
  complaintId: string;
  senderAccountId: string;
  receiverAccountId: string;
  amount: number;
  channel: 'UPI' | 'IMPS' | 'NEFT' | 'RTGS';
  layer: number;
  transactionTimestamp: string;
  status: 'Completed' | 'Frozen' | 'Flagged';
  provenance: EventProvenance;
}

export interface SimulatedWithdrawal {
  id: string;
  complaintId: string;
  accountId: string;
  atmId: string;
  atmCode: string;
  amount: number;
  timestamp: string;
  status: 'Attempted' | 'Completed' | 'Intercepted';
  provenance: EventProvenance;
}

export interface EventProvenance {
  source: 'synthetic-stream';
  scenarioId: ScenarioType;
  worldId: string;
  generatedAt: string;
  isSynthetic: true;
}

export interface ScenarioResult {
  scenario: ScenarioType;
  worldId: string;
  description: string;
  generatedAt: string;
  summary: {
    complaintsCount: number;
    transactionsCount: number;
    withdrawalsCount: number;
    totalFraudVolume: number;
    primaryZone: string;
  };
  complaints: SimulatedComplaint[];
  transactions: SimulatedTransaction[];
  withdrawals: SimulatedWithdrawal[];
}

export const SCENARIO_METADATA: Record<ScenarioType, { title: string; description: string; expectedCorridor: string }> = {
  stable_hotspot: {
    title: 'Stable Urban Hotspot (Koramangala - BTM Syndicate)',
    description: 'High-density urban syndicate with recurring mule footprints at known high-risk ATMs.',
    expectedCorridor: 'Koramangala - BTM Layout Corridor',
  },
  fraud_burst: {
    title: 'High-Velocity Fraud Burst (Multi-Node Fan-out)',
    description: 'Ultra-rapid layering (<5 min inter-hop) with simultaneous cashout attempts across 4+ ATMs.',
    expectedCorridor: 'Indiranagar - Whitefield Express Corridor',
  },
  cold_location: {
    title: 'Cold-Location Generalization (Peenya - Yelahanka Industrial)',
    description: 'Emerging geographic corridor testing model spatial reasoning on ATMs with zero/low historical fraud priors.',
    expectedCorridor: 'Peenya - Yelahanka Industrial Corridor',
  },
};

export function generateScenarioEvents(
  scenario: ScenarioType,
  options: { caseCount?: number; baseTime?: Date } = {}
): ScenarioResult {
  const caseCount = options.caseCount || (scenario === 'fraud_burst' ? 4 : 2);
  const baseTime = options.baseTime || new Date();
  const worldId = `WORLD-${scenario.toUpperCase()}-${Date.now().toString().slice(-6)}`;

  const complaints: SimulatedComplaint[] = [];
  const transactions: SimulatedTransaction[] = [];
  const withdrawals: SimulatedWithdrawal[] = [];

  let totalFraudVolume = 0;

  for (let c = 0; c < caseCount; c++) {
    const compIdx = c + 1;
    const complaintId = `CMP-SIM-${scenario.slice(0, 3).toUpperCase()}-${compIdx.toString().padStart(3, '0')}`;
    const compNumber = `CYBER-2026-SIM-${Math.floor(1000 + Math.random() * 9000)}`;

    const provenance: EventProvenance = {
      source: 'synthetic-stream',
      scenarioId: scenario,
      worldId,
      generatedAt: new Date().toISOString(),
      isSynthetic: true,
    };

    let amount = 50000;
    let incidentArea = 'Koramangala, Bengaluru';
    let muleAccount = 'ACC-MULE-4011';
    let atmTarget = { id: 'ATM-KOR-01', code: 'SBI-KOR-044' };
    let interHopMinutes = 15;

    if (scenario === 'stable_hotspot') {
      amount = 75000 + c * 40000;
      incidentArea = c % 2 === 0 ? 'Koramangala 5th Block, Bengaluru' : 'BTM Layout 2nd Stage, Bengaluru';
      muleAccount = c % 2 === 0 ? 'ACC-MULE-4011' : 'ACC-MULE-4089';
      atmTarget = c % 2 === 0 ? { id: 'ATM-KOR-01', code: 'SBI-KOR-044' } : { id: 'ATM-BTM-01', code: 'PNB-BTM-003' };
      interHopMinutes = 12;
    } else if (scenario === 'fraud_burst') {
      amount = 120000 + c * 50000;
      incidentArea = 'Indiranagar 100ft Road, Bengaluru';
      muleAccount = `ACC-BURST-${8000 + c}`;
      atmTarget = { id: `ATM-IND-0${(c % 2) + 1}`, code: c % 2 === 0 ? 'ICICI-IND-008' : 'AXIS-IND-021' };
      interHopMinutes = 3; // rapid burst
    } else if (scenario === 'cold_location') {
      amount = 35000 + c * 20000;
      incidentArea = 'Peenya Industrial Area Stage 1, Bengaluru';
      muleAccount = `ACC-COLD-${3000 + c}`;
      atmTarget = { id: 'ATM-PEE-01', code: 'BOB-PEE-011' };
      interHopMinutes = 45; // deliberate delay
    }

    totalFraudVolume += amount;

    // 1. Complaint
    const compTime = new Date(baseTime.getTime() - 90 * 60000 + c * 10 * 60000);
    complaints.push({
      id: complaintId,
      complaintNumber: compNumber,
      victimReference: `VIC-SIM-${100 + c}`,
      victimName: `Complainant ${compIdx} (${scenario})`,
      crimeCategory: scenario === 'fraud_burst' ? 'Digital arrest scam' : (scenario === 'cold_location' ? 'Loan app extortion' : 'UPI fraud'),
      fraudAmount: amount,
      complaintTimestamp: compTime.toISOString(),
      transactionReference: `TXN-ROOT-${compIdx}`,
      suspectedAccount: muleAccount,
      suspectedAccountName: `Syndicate Layer Node ${compIdx}`,
      bankName: 'State Bank of India',
      incidentLocation: incidentArea,
      status: 'New',
      notes: `Synthetic event stream: Generated under scenario '${scenario}' with provenance ${worldId}.`,
      provenance,
    });

    // 2. Multi-hop Transactions
    const hopCount = scenario === 'fraud_burst' ? 3 : 2;
    let currHopTime = new Date(compTime.getTime() - 40 * 60000);
    const splitAmount = Math.floor(amount / (hopCount === 3 ? 2 : 1));

    for (let h = 1; h <= hopCount; h++) {
      currHopTime = new Date(currHopTime.getTime() + interHopMinutes * 60000);
      transactions.push({
        id: `TXN-SIM-${scenario.slice(0, 3).toUpperCase()}-${compIdx}-${h}`,
        transactionReference: `TXN-REF-${compIdx}${h}${Math.floor(100 + Math.random() * 900)}`,
        complaintId,
        senderAccountId: h === 1 ? `ACC-VICTIM-${compIdx}` : `ACC-MULE-L1-${compIdx}`,
        receiverAccountId: h === hopCount ? muleAccount : `ACC-MULE-L${h}-${compIdx}`,
        amount: splitAmount,
        channel: 'UPI',
        layer: h,
        transactionTimestamp: currHopTime.toISOString(),
        status: 'Completed',
        provenance,
      });
    }

    // 3. Simulated Withdrawal (attempted or projected cashout)
    const withdrawalTime = new Date(currHopTime.getTime() + (scenario === 'fraud_burst' ? 18 : 65) * 60000);
    withdrawals.push({
      id: `WDL-SIM-${scenario.slice(0, 3).toUpperCase()}-${compIdx}`,
      complaintId,
      accountId: muleAccount,
      atmId: atmTarget.id,
      atmCode: atmTarget.code,
      amount: Math.min(amount, 40000), // Max daily card limit
      timestamp: withdrawalTime.toISOString(),
      status: 'Attempted',
      provenance,
    });
  }

  return {
    scenario,
    worldId,
    description: SCENARIO_METADATA[scenario].description,
    generatedAt: new Date().toISOString(),
    summary: {
      complaintsCount: complaints.length,
      transactionsCount: transactions.length,
      withdrawalsCount: withdrawals.length,
      totalFraudVolume,
      primaryZone: SCENARIO_METADATA[scenario].expectedCorridor,
    },
    complaints,
    transactions,
    withdrawals,
  };
}
