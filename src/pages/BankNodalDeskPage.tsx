import React, { useState } from 'react';
import {
  Building2,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  Lock,
  Search,
  Filter,
  DollarSign,
  FileCheck,
  Ban,
  ArrowUpRight,
} from 'lucide-react';
import { Account, Complaint, Transaction, WithdrawalPrediction } from '../types';

interface BankNodalDeskPageProps {
  complaints: Complaint[];
  activeComplaint: Complaint;
  accounts: Account[];
  transactions: Transaction[];
  activePrediction: WithdrawalPrediction | null;
}

interface LienRecord {
  id: string;
  accountNumber: string;
  accountHolder: string;
  bankName: string;
  branch: string;
  amountHeld: number;
  crpcSection: '102 CrPC' | '91 CrPC';
  status: 'Pending Action' | 'Lien Marked' | 'Debit Frozen' | 'Compliance Verified';
  cfcfrmsRef: string;
  timestamp: string;
  urgency: 'Critical (<15m)' | 'High' | 'Normal';
}

export const BankNodalDeskPage: React.FC<BankNodalDeskPageProps> = ({
  complaints,
  activeComplaint,
  accounts,
  transactions,
  activePrediction,
}) => {
  const [selectedBank, setSelectedBank] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Seed Lien Queue
  const [lienQueue, setLienQueue] = useState<LienRecord[]>([
    {
      id: 'LIEN-2026-081',
      accountNumber: 'ACC-MULE-4011 (SBI)',
      accountHolder: 'Ramesh Kumar (Suspected Layer-1 Mule)',
      bankName: 'State Bank of India',
      branch: 'Koramangala 4th Block, Bengaluru',
      amountHeld: 85000,
      crpcSection: '102 CrPC',
      status: 'Pending Action',
      cfcfrmsRef: 'CFCFRMS/2026/KA/BLR/8841',
      timestamp: '14 mins ago',
      urgency: 'Critical (<15m)',
    },
    {
      id: 'LIEN-2026-082',
      accountNumber: 'ACC-MULE-4089 (HDFC)',
      accountHolder: 'Pooja Enterprises (Shell Current Account)',
      bankName: 'HDFC Bank',
      branch: 'Indiranagar 100ft Road, Bengaluru',
      amountHeld: 150000,
      crpcSection: '102 CrPC',
      status: 'Pending Action',
      cfcfrmsRef: 'CFCFRMS/2026/KA/BLR/8842',
      timestamp: '22 mins ago',
      urgency: 'High',
    },
    {
      id: 'LIEN-2026-083',
      accountNumber: 'ACC-MULE-4022 (ICICI)',
      accountHolder: 'Devendra Patel (Layer-2 Transit Node)',
      bankName: 'ICICI Bank',
      branch: 'BTM 2nd Stage, Bengaluru',
      amountHeld: 48000,
      crpcSection: '102 CrPC',
      status: 'Lien Marked',
      cfcfrmsRef: 'CFCFRMS/2026/KA/BLR/8839',
      timestamp: '45 mins ago',
      urgency: 'Normal',
    },
    {
      id: 'LIEN-2026-084',
      accountNumber: 'ACC-MULE-4055 (PNB)',
      accountHolder: 'Sunil Verma (Layer-3 Cashout Node)',
      bankName: 'Punjab National Bank',
      branch: 'Outer Ring Road, Bengaluru',
      amountHeld: 92000,
      crpcSection: '102 CrPC',
      status: 'Debit Frozen',
      cfcfrmsRef: 'CFCFRMS/2026/KA/BLR/8830',
      timestamp: '2 hours ago',
      urgency: 'Normal',
    },
  ]);

  const handleMarkLien = (id: string, newStatus: LienRecord['status']) => {
    setLienQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setSuccessToast(`Lien status updated to "${newStatus}" under Section 102 CrPC.`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const filteredQueue = lienQueue.filter((item) => {
    const matchesBank = selectedBank === 'All' || item.bankName === selectedBank;
    const matchesSearch =
      item.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accountHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cfcfrmsRef.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBank && matchesSearch;
  });

  const totalHeld = lienQueue
    .filter((i) => i.status !== 'Pending Action')
    .reduce((acc, curr) => acc + curr.amountHeld, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-950/90 text-emerald-200 border border-emerald-700/60 px-4 py-2.5 rounded shadow-lg text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Building2 className="w-4 h-4" />
              </div>
              <h1 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                Bank Nodal Operations Desk (CFCFRMS / S.102 CrPC)
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                Live Intercept Bridge
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Standardized citizen financial fraud response console. Process real-time Section 102 CrPC debit freezes, mark account liens, and disarm vulnerable cashout points before liquidation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                alert(`Exporting CFCFRMS Consolidated Compliance Report for ${activeComplaint.complaintNumber} with total frozen volume ₹${totalHeld.toLocaleString('en-IN')}`);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Compliance Certificate</span>
            </button>
          </div>
        </div>

        {/* Operational Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Pending Actions</div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
              {lienQueue.filter((i) => i.status === 'Pending Action').length} Cases
            </div>
            <div className="text-[11px] text-slate-500">Requires instant lien marking</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Active Liens Marked</div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5">
              {lienQueue.filter((i) => i.status === 'Lien Marked').length} Accounts
            </div>
            <div className="text-[11px] text-slate-500">Secured pending court order</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Total Funds Intercepted</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              ₹{totalHeld.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500">Prevented from ATM liquidation</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Median Bank Response Time</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
              7.4 Mins
            </div>
            <div className="text-[11px] text-slate-500">Within Golden Hour threshold</div>
          </div>
        </div>
      </div>

      {/* Main Action Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Lien Queue Table */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-900 dark:text-slate-200">
                CFCFRMS Real-Time Lien Queue (S.102 CrPC)
              </h2>
              <p className="text-[11px] text-slate-500">
                Suspected mule beneficiary accounts identified across transaction layers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter account or ref..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-slate-50 dark:bg-slate-900 text-xs rounded border border-slate-200 dark:border-slate-800 font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="py-1 px-2 bg-slate-50 dark:bg-slate-900 text-xs rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono"
              >
                <option value="All">All Banks</option>
                <option value="State Bank of India">SBI</option>
                <option value="HDFC Bank">HDFC</option>
                <option value="ICICI Bank">ICICI</option>
                <option value="Punjab National Bank">PNB</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px] border-y border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Account & Holder</th>
                  <th className="py-2.5 px-3">Bank & Branch</th>
                  <th className="py-2.5 px-3">Lien Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">CrPC Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {filteredQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{item.accountNumber}</div>
                      <div className="text-[11px] text-slate-500 font-sans">{item.accountHolder}</div>
                      <div className="text-[10px] text-slate-400">{item.cfcfrmsRef}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 dark:text-slate-200">{item.bankName}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{item.branch}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                      ₹{item.amountHeld.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${
                          item.status === 'Pending Action'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            : item.status === 'Lien Marked'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {item.status === 'Pending Action' && <Clock className="w-3 h-3" />}
                        {item.status === 'Lien Marked' && <Lock className="w-3 h-3" />}
                        {item.status === 'Debit Frozen' && <Ban className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {item.status === 'Pending Action' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleMarkLien(item.id, 'Lien Marked')}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-medium transition-colors"
                          >
                            Mark Lien
                          </button>
                          <button
                            onClick={() => handleMarkLien(item.id, 'Debit Frozen')}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-medium transition-colors"
                          >
                            Freeze
                          </button>
                        </div>
                      ) : item.status === 'Lien Marked' ? (
                        <button
                          onClick={() => handleMarkLien(item.id, 'Debit Frozen')}
                          className="px-2 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded text-[11px] font-medium transition-colors"
                        >
                          Elevate to Freeze
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-500 dark:text-emerald-400 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Frozen
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Tactical ATM Cash-Kill & Security Queue */}
        <div className="space-y-6">
          {/* ATM Intercept Box */}
          <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                ATM Cash-Kill Recommendations
              </h2>
            </div>
            <p className="text-[11px] text-slate-500">
              Corridor ATMs ranked highest by the ML prediction engine. Temporary cash dispenser limits prevent large-scale liquidation runs.
            </p>

            <div className="space-y-3">
              {activePrediction?.candidateAtms.slice(0, 3).map((atm, i) => (
                <div
                  key={atm.atmId || i}
                  className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{atm.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{atm.atmCode} • {atm.area}</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      Score {atm.matchScore}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-slate-500">Est. Dist: {atm.estimatedDistanceKm} km</span>
                    <button
                      onClick={() => {
                        alert(`Dispatched temporary withdrawal rate limiter to ATM switch for ${atm.atmCode}. Daily limit reduced to ₹10,000.`);
                      }}
                      className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-[10px] font-medium"
                    >
                      Hold Dispenser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Legal Summons Box */}
          <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-500" />
              Section 91 CrPC Summons Desk
            </h3>
            <p className="text-[11px] text-slate-500">
              Immediate statutory summons issued to Bank Nodal Officers for Account Aggregator transaction logs and ATM CCTV footage.
            </p>
            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5">
              <div className="font-semibold text-blue-600 dark:text-blue-400">Section 91 CrPC Notice Active</div>
              <div>Summons Ref: SEC91/2026/CYBER/BLR-0042</div>
              <div>Recipients: Nodal Officer, State Bank of India & HDFC Bank</div>
              <div>Turnaround Deadline: 48 Hours statutory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
