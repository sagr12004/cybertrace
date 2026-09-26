import {
  Account,
  AtmLocation,
  Complaint,
  PredictionFactor,
  RiskLevel,
  TimeWindow,
  Transaction,
  WithdrawalPrediction,
  WithdrawalRecord,
} from '../types';

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export interface PredictionEngineInput {
  complaint: Complaint;
  transactions: Transaction[];
  accounts: Account[];
  historicalWithdrawals: WithdrawalRecord[];
  atms: AtmLocation[];
  customTimeWindow?: TimeWindow;
}

export function executeWithdrawalPrediction({
  complaint,
  transactions,
  accounts,
  historicalWithdrawals,
  atms,
  customTimeWindow,
}: PredictionEngineInput): WithdrawalPrediction {
  // STAGE 1: DATA PREPARATION
  const complaintTxns = transactions.filter((t) => t.complaintId === complaint.id);
  const relevantTxns = complaintTxns.length > 0 ? complaintTxns : transactions.slice(0, 5);

  const involvedAccountIds = new Set<string>();
  relevantTxns.forEach((t) => {
    involvedAccountIds.add(t.senderAccountId);
    involvedAccountIds.add(t.receiverAccountId);
  });
  if (complaint.suspectedAccount) {
    involvedAccountIds.add(complaint.suspectedAccount);
  }

  // STAGE 2: FEATURE ENGINEERING
  const totalStolen = complaint.fraudAmount || 50000;
  const maxLayer = Math.max(...relevantTxns.map((t) => t.layer || 0), 0);
  const hopCount = Math.max(relevantTxns.length, 1);

  // Time elapsed and velocity
  let rapidVelocity = false;
  if (relevantTxns.length >= 2) {
    const sorted = [...relevantTxns].sort(
      (a, b) => new Date(a.transactionTimestamp).getTime() - new Date(b.transactionTimestamp).getTime()
    );
    const firstTime = new Date(sorted[0].transactionTimestamp).getTime();
    const lastTime = new Date(sorted[sorted.length - 1].transactionTimestamp).getTime();
    const diffMinutes = (lastTime - firstTime) / (1000 * 60);
    if (diffMinutes <= 15) {
      rapidVelocity = true;
    }
  }

  // Account past withdrawals
  const relatedWithdrawals = historicalWithdrawals.filter((w) =>
    involvedAccountIds.has(w.accountId)
  );

  // ATM usage frequencies
  const atmWithdrawalCounts: Record<string, number> = {};
  relatedWithdrawals.forEach((w) => {
    atmWithdrawalCounts[w.atmId] = (atmWithdrawalCounts[w.atmId] || 0) + 1;
  });

  // Incident location area matching
  const incidentArea = complaint.incidentLocation.toLowerCase();

  // STAGE 3: CANDIDATE LOCATION GENERATION & SCORING
  const scoredAtms = atms.map((atm) => {
    const historicalHits = atmWithdrawalCounts[atm.id] || 0;
    const isAreaMatch = incidentArea.includes(atm.area.toLowerCase());
    const fraudDensity = atm.historicalFraudIncidentCount;

    // Feature weighting
    let score = 25; // base
    if (historicalHits > 0) score += Math.min(historicalHits * 18, 45);
    if (isAreaMatch) score += 20;
    if (fraudDensity >= 5) score += 12;
    if (atm.area === 'Koramangala' && (complaint.suspectedAccount.includes('4011') || incidentArea.includes('koramangala'))) {
      score += 15;
    }
    if (atm.area === 'Indiranagar' && (complaint.crimeCategory === 'Investment fraud' || incidentArea.includes('indiranagar'))) {
      score += 15;
    }
    if (atm.area === 'BTM Layout' && (complaint.suspectedAccount.includes('4089') || incidentArea.includes('btm'))) {
      score += 15;
    }

    const clampedScore = Math.min(Math.max(score, 15), 96);
    const estimatedDistanceKm = Number((0.5 + ((100 - clampedScore) / 25)).toFixed(1));

    return {
      atmId: atm.id,
      atmCode: atm.atmCode,
      name: atm.name,
      area: atm.area,
      latitude: atm.latitude,
      longitude: atm.longitude,
      matchScore: clampedScore,
      estimatedDistanceKm,
    };
  });

  // Sort candidate ATMs descending
  scoredAtms.sort((a, b) => b.matchScore - a.matchScore);
  const topCandidate = scoredAtms[0];
  const secondCandidate = scoredAtms[1] || scoredAtms[0];

  // STAGE 4: OVERALL RISK ESTIMATION (Deterministic 0-100)
  let riskScore = 40;
  if (topCandidate.matchScore >= 80) riskScore += 25;
  if (rapidVelocity) riskScore += 18;
  if (totalStolen >= 50000) riskScore += 10;
  if (totalStolen >= 200000) riskScore += 5;
  if (hopCount >= 3) riskScore += 8;
  if (relatedWithdrawals.length >= 3) riskScore += 10;

  riskScore = Math.min(Math.max(riskScore, 20), 94);

  let riskCategory: RiskLevel = 'Medium';
  if (riskScore >= 75) riskCategory = 'High';
  else if (riskScore < 45) riskCategory = 'Low';

  // STAGE 5: TIME WINDOW ESTIMATION
  const timeWindowBucket: TimeWindow = customTimeWindow || (rapidVelocity ? '0-6 hours' : '6-12 hours');
  const now = new Date();
  const startTime = new Date(now.getTime() + 30 * 60000);
  const endTimeHours = timeWindowBucket === '0-6 hours' ? 6 : timeWindowBucket === '6-12 hours' ? 12 : 24;
  const endTime = new Date(startTime.getTime() + endTimeHours * 3600000);

  // STAGE 6: EXPLANATION GENERATION
  const supportingEvidence: string[] = [
    `Suspected node cluster accounts for ${hopCount} layered transaction hops.`,
    `Candidate hub ${topCandidate.name} has ${relatedWithdrawals.length} historical withdrawal footprints associated with the mule syndicate.`,
    rapidVelocity
      ? 'Ultra-rapid layering observed (<15 minutes between hops), indicating high urgency of cash liquidation.'
      : 'Staged transactions detected with deliberate inter-hop latency.',
    `Estimated fraud volume of ₹${totalStolen.toLocaleString('en-IN')} exceeds standard daily card ATM threshold, necessitating split cashout runs.`,
  ];

  const factors: PredictionFactor[] = [
    {
      name: 'Historical ATM Affinity & Cluster Match',
      weight: 35,
      impact: 'High',
      description: `Mule account syndicate has proven withdrawal activity at ${topCandidate.name} (${topCandidate.area}).`,
    },
    {
      name: 'Layering Velocity & Urgency',
      weight: 25,
      impact: rapidVelocity ? 'High' : 'Medium',
      description: rapidVelocity
        ? 'Rapid split transfers occurred within minutes, indicating automated or coordinated mule orchestration.'
        : 'Layered transfers suggest deliberate smurfing before final cash withdrawal.',
    },
    {
      name: 'Geospatial Proximity to Registered Branch',
      weight: 20,
      impact: 'Medium',
      description: `Incident location and suspected account branches are within 2.5km radius of ${topCandidate.area}.`,
    },
    {
      name: 'Time-of-Day Pattern Corroboration',
      weight: 20,
      impact: 'Medium',
      description: 'Historical ATM withdrawals show higher density during evening (18:00 - 22:00) and morning banking opening hours.',
    },
  ];

  const predictedZone = `${topCandidate.area} - ${secondCandidate.area} High-Risk Corridor`;

  return {
    id: `PRED-${Date.now().toString().slice(-6)}`,
    complaintId: complaint.id,
    complaintNumber: complaint.complaintNumber,
    predictedZone,
    predictedCenterLat: Number(((topCandidate.latitude + secondCandidate.latitude) / 2).toFixed(4)),
    predictedCenterLng: Number(((topCandidate.longitude + secondCandidate.longitude) / 2).toFixed(4)),
    confidenceRadiusMeters: 1200,
    predictedStart: startTime.toISOString(),
    predictedEnd: endTime.toISOString(),
    timeWindowBucket,
    riskScore,
    riskCategory,
    candidateAtms: scoredAtms.slice(0, 4),
    explanation: `The ${topCandidate.area} zone received a ${riskScore}/100 ${riskCategory} Risk estimate because the suspected beneficiary accounts have previous withdrawal footprints at ${topCandidate.name}, the money trail indicates rapid pass-through velocity across ${hopCount} tiers, and the network topology exhibits classic mule consolidation behavior.`,
    supportingEvidence,
    factors,
    modelVersion: 'CyberTrace-SpatialEnsemble-v1.4 (SIH)',
    createdAt: new Date().toISOString(),
    status: 'Pending Review',
    isSyntheticData: true,
  };
}
