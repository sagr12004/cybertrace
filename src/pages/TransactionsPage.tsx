import React, { useState } from 'react';
import {
  ArrowRightLeft,
  AlertTriangle,
  Search,
  Filter,
  ShieldAlert,
  Clock,
  ExternalLink,
  Lock,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Complaint, Transaction } from '../types';

interface TransactionsPageProps {
  transactions: Transaction[];
  activeComplaint: Complaint;
  onNavigateTab: (tab: any) => void;
  onFreezeRequest?: (txnRef: string, accountRef: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
  activeComplaint,
  onNavigateTab,
  onFreezeRequest,
}) => {
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyComplaintTxns, setShowOnlyComplaintTxns] = useState(true);
  const [frozenTxns, setFrozenTxns] = useState<Set<string>>(new Set());

  // Filter logic
  let displayTxns = showOnlyComplaintTxns
    ? transactions.filter((t) => t.complaintId === activeComplaint.id)
    : transactions;

  if (displayTxns.length === 0) {
    displayTxns = transactions.slice(0, 6);
  }

  if (filterType !== 'ALL') {
    displayTxns = displayTxns.filter((t) => t.transactionType === filterType);
  }

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    displayTxns = displayTxns.filter(
      (t) =>
        t.transactionReference.toLowerCase().includes(q) ||
        t.senderName.toLowerCase().includes(q) ||
        t.receiverName.toLowerCase().includes(q) ||
        t.senderAccountRef.toLowerCase().includes(q) ||
        t.receiverAccountRef.toLowerCase().includes(q)
    );
  }

  const totalVolume = displayTxns.reduce((sum, t) => sum + t.amount, 0);
  const flaggedCount = displayTxns.filter((t) => t.flags && t.flags.length > 0).length;

  const handleFreeze = (txnId: string, accRef: string) => {
    setFrozenTxns((prev) => new Set(prev).add(txnId));
    if (onFreezeRequest) onFreezeRequest(txnId, accRef);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Financial Transaction Money Trail</span>
            </h2>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {activeComplaint.complaintNumber}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hop-by-hop forensic analysis of stolen funds layering and rapid velocity detection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('network')}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 rounded-xl text-xs font-bold transition-all active:scale-98"
          >
            <span>Open Account Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Forensic Detection Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Forensic Heuristic Rules Engine</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Total Flow: <strong className="text-slate-900 dark:text-slate-100">₹{totalVolume.toLocaleString('en-IN')}</strong> • Flagged Hops: <strong className="text-amber-600 dark:text-amber-400">{flaggedCount}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="text-slate-500 dark:text-slate-400 font-medium text-[11px] flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Layering Velocity</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 mt-1 text-sm">Ultra-Rapid (&lt; 4 mins)</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Funds moved from Layer 1 to Layer 2 in 205 seconds, bypassing standard cooling thresholds.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="text-slate-500 dark:text-slate-400 font-medium text-[11px] flex items-center gap-1.5 font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
              <span>Fractional Smurfing</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 mt-1 text-sm">2-Way Split Topology</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              ₹50,000 partitioned into ₹28,000 and ₹21,500 across two independent bank entities (HDFC &amp; ICICI).
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="text-slate-500 dark:text-slate-400 font-medium text-[11px] flex items-center gap-1.5 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Liquidation Staging</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 mt-1 text-sm">High ATM Exit Risk</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Both streams reconsolidated into Apex Cash Hub (ACC-CASH-7721), historically liquidated via South BLR ATMs.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Switcher Controls */}
      <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Txn Reference, Sender, Receiver..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowOnlyComplaintTxns(!showOnlyComplaintTxns)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showOnlyComplaintTxns
                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {showOnlyComplaintTxns ? 'Current Case Hops Only' : 'Show All Global Txns'}
          </button>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="ALL">All Payment Rails</option>
            <option value="UPI">UPI</option>
            <option value="IMPS">IMPS</option>
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-mono font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Layer</th>
                <th className="py-3 px-4">Txn Reference</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Sender (Debit)</th>
                <th className="py-3 px-4">Receiver (Credit)</th>
                <th className="py-3 px-4">Rail</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Forensic Indicators</th>
                <th className="py-3 px-4 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayTxns.map((txn, idx) => {
                const isFrozen = frozenTxns.has(txn.id);
                return (
                  <tr key={txn.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all">
                    {/* Layer indicator */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          txn.layer === 0
                            ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                            : txn.layer === 1
                            ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300'
                            : 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300'
                        }`}
                      >
                        Hop {idx + 1} (L{txn.layer})
                      </span>
                    </td>

                    {/* Txn Ref */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {txn.transactionReference}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {txn.transactionTimestamp.replace('T', ' ').slice(0, 19)}
                    </td>

                    {/* Sender */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{txn.senderName}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {txn.senderAccountRef}
                      </div>
                    </td>

                    {/* Receiver */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{txn.receiverName}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {txn.receiverAccountRef}
                      </div>
                    </td>

                    {/* Rail */}
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                        {txn.transactionType}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </td>

                    {/* Flags */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {txn.flags && txn.flags.length > 0 ? (
                          txn.flags.map((flag, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20"
                            >
                              {flag}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400">Standard</span>
                        )}
                      </div>
                    </td>

                    {/* Intervention */}
                    <td className="py-3.5 px-4 text-right">
                      {isFrozen ? (
                        <span className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 inline-flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Freeze Notice Sent</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleFreeze(txn.id, txn.receiverAccountRef)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-all flex items-center gap-1 ml-auto active:scale-98"
                          title="Simulate bank freeze notice under Section 91 CrPC"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Freeze Account</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
