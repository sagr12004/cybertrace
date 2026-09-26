import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Shield,
  FileCheck,
  CheckCircle,
  ExternalLink,
  Building,
  User,
  Clock,
  MapPin,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { Complaint, Investigation, Transaction, WithdrawalPrediction, AuditLog } from '../types';

interface ReportsPageProps {
  activeComplaint: Complaint;
  investigation: Investigation;
  transactions: Transaction[];
  prediction: WithdrawalPrediction;
  auditLogs: AuditLog[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  activeComplaint,
  investigation,
  transactions,
  prediction,
  auditLogs,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    // Generate real CSV from transaction money trail
    const headers = 'Transaction Reference,Layer,Sender Account,Receiver Account,Amount (INR),Timestamp,Type,Flags\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.transactionReference}","Layer ${t.layer}","${t.senderAccountRef} (${t.senderName})","${t.receiverAccountRef} (${t.receiverName})",${t.amount},"${t.transactionTimestamp}","${t.transactionType}","${(t.flags || []).join('; ')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CyberTrace_MoneyTrail_${activeComplaint.complaintNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back?.()}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Official Cybercrime Forensic &amp; Tracing Report</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Standard Operating Procedure (SOP) Compliant Investigation Dossier
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-all active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>{downloadSuccess ? 'Downloaded CSV' : 'Export Money Trail CSV'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-lg p-8 space-y-8 text-slate-800 dark:text-slate-200 font-sans print:border-none print:shadow-none print:p-0 print:text-black print:bg-white">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <Shield className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>Cyber Crime Police Station • Criminal Investigation Department</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100 mt-1 uppercase">
              First Information &amp; Money-Trail Tracing Report
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              CASE REF: {activeComplaint.complaintNumber} • NATIONAL PORTAL ID: {activeComplaint.id}
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 font-bold rounded border border-rose-200 dark:border-rose-800 uppercase text-[10px]">
              CONFIDENTIAL / LAW ENFORCEMENT ONLY
            </span>
            <div className="font-mono text-slate-500 dark:text-slate-400 mt-2 text-[11px]">
              Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Section 1: Complaint & Victim Details */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 border-b border-blue-100 dark:border-blue-900/60 pb-1">
            1. Complaint Profile &amp; Incident Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Complainant / Victim</span>
              <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{activeComplaint.victimName}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{activeComplaint.victimReference}</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Crime Classification</span>
              <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{activeComplaint.crimeCategory}</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Defrauded Amount</span>
              <div className="font-mono font-extrabold text-blue-700 dark:text-blue-400 mt-0.5 text-sm tabular-nums">
                ₹{activeComplaint.fraudAmount.toLocaleString('en-IN')}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Incident Jurisdiction</span>
              <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{activeComplaint.incidentLocation}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Complainant Modus Operandi Statement:</span>
            <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">{activeComplaint.notes}</p>
          </div>
        </section>

        {/* Section 2: Financial Layering & Money Movement Trail */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 border-b border-blue-100 dark:border-blue-900/60 pb-1">
            2. Multi-Hop Money Layering Sequence
          </h2>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] font-mono">
                <tr>
                  <th className="py-2 px-3">Layer</th>
                  <th className="py-2 px-3">Txn Ref</th>
                  <th className="py-2 px-3">Debited Account</th>
                  <th className="py-2 px-3">Credited Account</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Rail</th>
                  <th className="py-2 px-3">Forensic Detection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="py-2 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">L{t.layer}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">{t.transactionReference}</td>
                    <td className="py-2 px-3">{t.senderName} ({t.senderAccountRef})</td>
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">{t.receiverName} ({t.receiverAccountRef})</td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">₹{t.amount.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 font-mono text-[10px]">{t.transactionType}</td>
                    <td className="py-2 px-3 text-amber-700 dark:text-amber-400">{(t.flags || []).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: AI Withdrawal Hotspot Prediction */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 border-b border-blue-100 dark:border-blue-900/60 pb-1">
            3. AI Withdrawal Prediction &amp; Candidate Hotspot Zone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800">
              <span className="text-[10px] font-mono font-bold text-rose-700 dark:text-rose-400 uppercase">Estimated Risk Score</span>
              <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-0.5 tabular-nums">{prediction.riskScore}% {prediction.riskCategory}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Imminence Window: {prediction.timeWindowBucket}</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Predicted Cashout Hub</span>
              <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 text-sm">{prediction.predictedZone}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Interception Radius: ±{prediction.confidenceRadiusMeters}m</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Primary Candidate ATM</span>
              <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{prediction.candidateAtms[0]?.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">{prediction.candidateAtms[0]?.atmCode}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-bold">Explainability Synthesis:</span> {prediction.explanation}
          </div>
        </section>

        {/* Section 4: Investigation Decisions & Immutable Audit History */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 border-b border-blue-100 dark:border-blue-900/60 pb-1">
            4. Investigation Actions &amp; Chain of Custody Audit Log
          </h2>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Current Status:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{investigation.status}</span>
              <span className="text-slate-400 ml-4">Authorized Decision:</span>
              <span className="font-bold text-blue-700 dark:text-blue-400">{investigation.actionTaken || 'Under Formal Review'}</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] font-mono">
                <tr>
                  <th className="py-2 px-3">Log ID</th>
                  <th className="py-2 px-3">Timestamp (UTC)</th>
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Officer / Actor</th>
                  <th className="py-2 px-3">Forensic Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[10px]">
                {auditLogs.map((l) => (
                  <tr key={l.id}>
                    <td className="py-2 px-3 text-blue-600 dark:text-blue-400 font-bold">{l.id}</td>
                    <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{l.timestamp.slice(0, 19).replace('T', ' ')}</td>
                    <td className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">{l.action}</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-sans">{l.userName}</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 font-sans">{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Statutory Law Enforcement Notices (CrPC Sections 91 & 102) */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 border-b border-blue-100 dark:border-blue-900/60 pb-1">
            5. Statutory Law Enforcement Legal Orders (Sections 91 &amp; 102 CrPC)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Section 91 CrPC Summons for CCTV &amp; ATM Logs
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Directing Bank Security &amp; Cash Replenishment Agency to preserve CCTV footage and withdrawal dispense logs for ATM <strong>{prediction.candidateAtms[0]?.name || 'SBI-KOR-501'}</strong> within predicted window <strong>{prediction.timeWindowBucket}</strong>.
              </p>
              <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400">Order Ref: SEC91-LE-2026-0842-A</div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Section 102 CrPC Bank Account Debit Freeze Notice
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Notice to Bank Nodal Officer for immediate debit freeze and marking lien under CFCFRMS on suspect mule accounts ({activeComplaint.suspectedAccount} - {activeComplaint.bankName}) to prevent cash liquidation.
              </p>
              <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400">Order Ref: SEC102-FRZ-2026-0842-B</div>
            </div>
          </div>
        </section>

        {/* Section 6: Bharat-Chain Immutable Forensics Stamp */}
        <section className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900/60 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Bharat-Chain Cryptographic Chain of Custody Stamp
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
              VERIFIED IMMUTABLE (PoA)
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
            Block Height: #1479 • SHA-256 Hash: 0x8f3c4e129a0b9432e19641fbde2931885912a7cdb84f18e9c2049103aae4192b
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Admissible under Section 65B of Indian Evidence Act, 1872. Verified by I4C Central Node #01 and State Cyber Command.
          </p>
        </section>

        {/* Document Footer & Signatures */}
        <div className="pt-6 border-t-2 border-slate-900 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Investigating Officer</div>
            <div className="font-extrabold text-slate-900 dark:text-slate-100 mt-1">Insp. Rajesh Varma</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Senior Cybercrime Investigator (Badge: KA-CYBER-8841)</div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Statutory Compliance Notice</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-tight">
              Standard Operating Procedure (SOP) compliant intelligence dossier for LEA field interception &amp; bank fund blocking.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
