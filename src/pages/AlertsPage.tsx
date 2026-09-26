import React, { useState } from 'react';
import {
  Bell,
  Search,
  Filter,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Radio,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Alert, AlertStatus, Complaint } from '../types';

interface AlertsPageProps {
  alerts: Alert[];
  complaints: Complaint[];
  onUpdateAlertStatus: (alertId: string, status: AlertStatus) => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onNavigateTab: (tab: any) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  complaints,
  onUpdateAlertStatus,
  onSelectComplaint,
  onNavigateTab,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  const filtered = alerts.filter((a) => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        a.complaintNumber.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.predictedArea.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSimulatedDispatch = (alert: Alert) => {
    onUpdateAlertStatus(alert.id, 'Under Review');
    setDispatchToast(
      `Dispatched urgent PCR Patrol & Bank Vigilance notification for ${alert.predictedArea} (${alert.candidateAtm})`
    );
    setTimeout(() => setDispatchToast(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>Field Alert &amp; Interception Dispatch Management</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated alerts triggered when withdrawal prediction risk exceeds 70%
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>Simulated Police &amp; Bank Nodal Feed Active</span>
        </div>
      </div>

      {/* Simulated Dispatch Toast */}
      {dispatchToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{dispatchToast}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts by Alert ID, Case Number, Area..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="ALL">All Alert Statuses</option>
            <option value="New">New</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((alert) => {
          const isHigh = alert.riskCategory === 'High';
          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900/90 border-2 shadow-2xs transition-all flex flex-col justify-between space-y-4 ${
                alert.status === 'New'
                  ? 'border-rose-400 dark:border-rose-700/80 bg-rose-50/10 dark:bg-rose-950/20 ring-2 ring-rose-500/10'
                  : 'border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        isHigh
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {alert.riskScore}% {alert.riskCategory} Risk
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">{alert.id}</span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      alert.status === 'New'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : alert.status === 'Under Review'
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                        : alert.status === 'Acknowledged'
                        ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-snug">{alert.title}</h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Target ATM</span>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{alert.candidateAtm}</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Area &amp; Window</span>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{alert.timeWindow}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {alert.supportingEvidence}
                </p>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 font-mono">
                  <span>Unit: {alert.assignedUnit}</span>
                  <span>{alert.createdAt.slice(11, 16)} UTC</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    const c = complaints.find((x) => x.id === alert.complaintId || x.complaintNumber === alert.complaintNumber);
                    if (c) {
                      onSelectComplaint(c);
                      onNavigateTab('investigations');
                    }
                  }}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Investigation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  {alert.status === 'New' && (
                    <button
                      onClick={() => onUpdateAlertStatus(alert.id, 'Acknowledged')}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 active:scale-98"
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => handleSimulatedDispatch(alert)}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 transition-all active:scale-98"
                    >
                      <Send className="w-3 h-3" />
                      <span>Dispatch Units</span>
                    </button>
                  )}

                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => onUpdateAlertStatus(alert.id, 'Resolved')}
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg border border-emerald-200 dark:border-emerald-800 active:scale-98"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
