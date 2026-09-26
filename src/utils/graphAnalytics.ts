import { Account, GraphEdgeData, GraphNodeData, Transaction } from '../types';

export interface GraphAnalysisResult {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  metrics: {
    totalAccounts: number;
    totalHops: number;
    totalVolume: number;
    highestCentralityNode: string;
    suspiciousMuleCount: number;
    maxLayer: number;
  };
}

export function computeAccountNetwork(
  complaintId: string,
  accounts: Account[],
  transactions: Transaction[]
): GraphAnalysisResult {
  // Filter transactions linked to complaint (or default subset)
  const complaintTxns = transactions.filter((t) => t.complaintId === complaintId);
  const activeTxns = complaintTxns.length > 0 ? complaintTxns : transactions.slice(0, 6);

  // Identify involved account IDs
  const involvedAccountIds = new Set<string>();
  activeTxns.forEach((txn) => {
    involvedAccountIds.add(txn.senderAccountId);
    involvedAccountIds.add(txn.receiverAccountId);
  });

  const accountMap = new Map<string, Account>();
  accounts.forEach((acc) => {
    accountMap.set(acc.id, acc);
  });

  // Calculate in/out degree & volume per node
  const inDegree: Record<string, number> = {};
  const outDegree: Record<string, number> = {};
  const nodeVolume: Record<string, number> = {};

  activeTxns.forEach((txn) => {
    outDegree[txn.senderAccountId] = (outDegree[txn.senderAccountId] || 0) + 1;
    inDegree[txn.receiverAccountId] = (inDegree[txn.receiverAccountId] || 0) + 1;
    nodeVolume[txn.senderAccountId] = (nodeVolume[txn.senderAccountId] || 0) + txn.amount;
    nodeVolume[txn.receiverAccountId] = (nodeVolume[txn.receiverAccountId] || 0) + txn.amount;
  });

  // Calculate hops from source / victim
  // Source is node with outDegree > 0 and inDegree == 0
  const sourceNodeId =
    Array.from(involvedAccountIds).find(
      (id) => (outDegree[id] || 0) > 0 && (inDegree[id] || 0) === 0
    ) || Array.from(involvedAccountIds)[0];

  const hopsFromVictim: Record<string, number> = {};
  hopsFromVictim[sourceNodeId] = 0;

  // Simple BFS for hops
  const queue: { id: string; hops: number }[] = [{ id: sourceNodeId, hops: 0 }];
  const visited = new Set<string>([sourceNodeId]);

  while (queue.length > 0) {
    const { id, hops } = queue.shift()!;
    const outgoingTxns = activeTxns.filter((t) => t.senderAccountId === id);
    outgoingTxns.forEach((t) => {
      if (!visited.has(t.receiverAccountId)) {
        visited.add(t.receiverAccountId);
        hopsFromVictim[t.receiverAccountId] = hops + 1;
        queue.push({ id: t.receiverAccountId, hops: hops + 1 });
      }
    });
  }

  // Calculate degree centrality (normalized by total nodes - 1)
  const totalInvolved = Math.max(involvedAccountIds.size, 1);
  const nodes: GraphNodeData[] = Array.from(involvedAccountIds).map((accId) => {
    const acc = accountMap.get(accId);
    const inDeg = inDegree[accId] || 0;
    const outDeg = outDegree[accId] || 0;
    const totalDeg = inDeg + outDeg;
    const centralityScore = Number(((totalDeg / Math.max(totalInvolved - 1, 1)) * 100).toFixed(1));

    const isVictim = acc?.accountType === 'Victim Account' || accId === sourceNodeId;
    const isBeneficiary = acc?.accountType === 'Beneficiary' || outDeg === 0;
    const isMule = !isVictim && (acc?.accountType === 'Mule Candidate' || (inDeg > 0 && outDeg > 0));

    return {
      id: accId,
      label: acc?.holderName || accId,
      accountRef: acc?.accountReference || accId,
      accountType: acc?.accountType || 'Current',
      bankName: acc?.bankName || 'Unknown Bank',
      riskStatus: acc?.riskStatus || 'Suspicious',
      riskScore: acc?.riskScore || 70,
      totalVolume: nodeVolume[accId] || 0,
      inDegree: inDeg,
      outDegree: outDeg,
      hopsFromVictim: hopsFromVictim[accId] !== undefined ? hopsFromVictim[accId] : 1,
      centralityScore,
      isVictim,
      isMule,
      isBeneficiary,
    };
  });

  const edges: GraphEdgeData[] = activeTxns.map((txn) => ({
    id: txn.id,
    source: txn.senderAccountId,
    target: txn.receiverAccountId,
    amount: txn.amount,
    timestamp: txn.transactionTimestamp,
    transactionRef: txn.transactionReference,
    type: txn.transactionType,
    layer: txn.layer,
    flags: txn.flags,
  }));

  // Find node with highest degree centrality
  const sortedNodes = [...nodes].sort((a, b) => b.centralityScore - a.centralityScore);
  const highestCentralityNode = sortedNodes[0]?.label || 'None';

  const totalVolume = activeTxns.reduce((sum, t) => sum + t.amount, 0);
  const maxLayer = Math.max(...activeTxns.map((t) => t.layer || 0), 0);
  const suspiciousMuleCount = nodes.filter((n) => n.isMule).length;

  return {
    nodes,
    edges,
    metrics: {
      totalAccounts: nodes.length,
      totalHops: edges.length,
      totalVolume,
      highestCentralityNode,
      suspiciousMuleCount,
      maxLayer: maxLayer + 1,
    },
  };
}
