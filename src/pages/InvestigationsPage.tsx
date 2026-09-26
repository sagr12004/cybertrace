import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  Send,
  MessageSquare,
  Lock,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Check,
} from 'lucide-react';
import { Complaint, Investigation, WithdrawalPrediction, AuditLog } from '../types';

interface InvestigationsPageProps {
  activeComplaint: Complaint;
  investigation: Investigation;
  currentPrediction: WithdrawalPrediction;
  auditLogs: AuditLog[];
  onTakeAction: (actionTaken: string, note?: string) => Promise<void>;
  onAddNote: (note: string) => Promise<void>;
  onNavigateTab: (tab: any) => void;
}

export const InvestigationsPage: React.FC<InvestigationsPageProps> = ({
  activeComplaint,
  investigation,
  currentPrediction,
  auditLogs,
  onTakeAction,
  onAddNote,
  onNavigateTab,
}) => {
  const [noteInput, setNoteInput] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    actionTitle: string;
    actionType: string;
    description: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleConfirmAction = async () => {
    if (!confirmDialog) return;
    setSubmitting(true);
    try {
      await onTakeAction(confirmDialog.actionType, confirmDialog.description);
      setToastMessage(`Action recorded: ${confirmDialog.actionTitle}`);
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setSubmitting(false);
      setConfirmDialog(null);
    }
  };

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    await onAddNote(noteInput);
    setNoteInput('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Law Enforcement Interface &amp; Dossier (SIH Deliverable C)</span>
            </h2>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {activeComplaint.complaintNumber}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Secure interface for investigators: Section 91 &amp; 102 CrPC legal documentation, field interception authorization, and forensic audit trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('blockchain')}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 rounded-xl text-xs font-bold transition-all active:scale-98"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Bharat-Chain Proofs</span>
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-98"
          >
            <span>Generate Official Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Human in the loop legal disclaimer notice */}
      <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Human-in-the-Loop Mandate:</span> Under Indian Cyber Crime Investigation SOPs, AI-generated predictions represent investigative leads only. Physical interception, surveillance, or formal account freezing must be reviewed and authorized by an investigator before execution.
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Case Overview & Primary Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Decision Actions Card */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Investigator Decision</h3>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                investigation.status === 'Active'
                  ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
              }`}
            >
              {investigation.status}
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() =>
                setConfirmDialog({
                  actionTitle: 'Approve Prediction for Field Interception',
                  actionType: 'Approved for Field Interception',
                  description: `Authorize field police dispatch to ${currentPrediction.candidateAtms[0]?.name || 'predicted ATM cluster'} within time window ${currentPrediction.timeWindowBucket}.`,
                })
              }
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve for Field Surveillance</span>
            </button>

            <button
              onClick={() =>
                setConfirmDialog({
                  actionTitle: 'Escalate Case to State CID',
                  actionType: 'Escalated to State CID',
                  description: 'Transfer investigation to CID Financial Intelligence Unit due to inter-state mule network involvement.',
                })
              }
              className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Escalate to State CID / Special Cell</span>
            </button>

            <button
              onClick={() =>
                setConfirmDialog({
                  actionTitle: 'Issue Bank Account Freeze Notice',
                  actionType: 'Account Freeze Request Issued',
                  description: `Send formal Section 91 CrPC notice to ${activeComplaint.bankName} Nodal Officer to freeze ${activeComplaint.suspectedAccount}.`,
                })
              }
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Issue Section 91 Freeze Notice</span>
            </button>

            <button
              onClick={() =>
                setConfirmDialog({
                  actionTitle: 'Reject Prediction as False Positive',
                  actionType: 'Rejected - False Positive',
                  description: 'Dismiss current withdrawal prediction after human evidence review.',
                })
              }
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <XCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Reject (False Positive)</span>
            </button>
          </div>

          {investigation.actionTaken && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Latest Decision:</span>
              <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{investigation.actionTaken}</div>
            </div>
          )}
        </div>

        {/* Center: Case & Prediction Evidence Summary */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Case Evidence Summary</h3>
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              ₹{activeComplaint.fraudAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Victim Reference</span>
              <div className="font-bold text-slate-800 dark:text-slate-200">{activeComplaint.victimName} ({activeComplaint.victimReference})</div>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Primary Suspected Node</span>
              <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{activeComplaint.suspectedAccount}</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">{activeComplaint.suspectedAccountName} • {activeComplaint.bankName}</div>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Predicted Interception Hotspot</span>
              <div className="font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5">
                {currentPrediction.predictedZone} ({currentPrediction.riskScore}% Risk)
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Candidate ATM: <strong className="text-slate-800 dark:text-slate-200">{currentPrediction.candidateAtms[0]?.name}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chronological Investigator Notes */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Investigator Case Notes</span>
            </h3>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-56 pr-1">
            {investigation.notes.map((note, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {note}
              </div>
            ))}
          </div>

          {/* Post note input */}
          <form onSubmit={handlePostNote} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Record forensic observation note..."
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
            <button
              type="submit"
              disabled={!noteInput.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Audit History Log Table */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Chain of Custody &amp; Forensic Audit Trail</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Immutable chronological log of all officer actions and ML triggers</p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Total Entries: {auditLogs.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-mono font-bold border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Authorized Actor</th>
                <th className="py-2.5 px-3">Forensic Details</th>
                <th className="py-2.5 px-3 text-right">Terminal IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">{log.id}</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{log.timestamp.replace('T', ' ').slice(0, 19)}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-sans">{log.userName}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300">{log.details}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{confirmDialog.actionTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Official Forensic Action Confirmation</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              {confirmDialog.description}
            </p>

            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              This action will be permanently recorded in the forensic audit trail with your badge signature (KA-CYBER-8841).
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setConfirmDialog(null)}
                disabled={submitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Confirm &amp; Commit to Audit Log</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
