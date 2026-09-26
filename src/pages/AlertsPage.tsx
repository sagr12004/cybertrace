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
  Smartphone,
  Mail,
  Webhook,
  Zap,
  Volume2,
  X,
  FileCheck,
  Check,
  ArrowLeft,
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
  const [activeDispatchAlert, setActiveDispatchAlert] = useState<Alert | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<{
    sms: boolean;
    email: boolean;
    api: boolean;
    dashboard: boolean;
  }>({
    sms: true,
    email: true,
    api: true,
    dashboard: true,
  });
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccessData, setDispatchSuccessData] = useState<any>(null);

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

  const handleOpenDispatchModal = (alert: Alert) => {
    setActiveDispatchAlert(alert);
    setDispatchSuccessData(null);
  };

  const handleExecuteMultiChannelDispatch = () => {
    if (!activeDispatchAlert) return;
    setIsDispatching(true);

    setTimeout(() => {
      onUpdateAlertStatus(activeDispatchAlert.id, 'Under Review');
      setIsDispatching(false);
      setDispatchSuccessData({
        timestamp: new Date().toLocaleTimeString(),
        smsCount: selectedChannels.sms ? 4 : 0,
        recipients: [
          ...(selectedChannels.sms ? ['Koramangala Traffic & Patrol Van #04 (SMS)', 'Beat Constable Suresh M. (SMS)'] : []),
          ...(selectedChannels.email ? ['State Cyber Cell SP (Gov Mail)', 'I4C Liaison Officer (Flash Mail)'] : []),
          ...(selectedChannels.api ? ['SBI / HDFC CFCFRMS Webhook Gateway (REST 200 OK)'] : []),
        ],
      });
      setDispatchToast(
        `Multi-Channel Dispatch Broadcast Successfully Executed for ${activeDispatchAlert.predictedArea}`
      );
      setTimeout(() => setDispatchToast(null), 5000);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <button
              onClick={() => onNavigateTab('overview')}
              className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
              INTERCEPTION GATEWAY ACTIVE
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• Section 91 CrPC Automated Interdiction</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Real-Time Threat Broadcast to Police Patrols &amp; Bank Desks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Multi-agency tactical notification pipeline delivering target coordinates, mule identities, and ATM hold requests across C-DAC DLT SMS, CFCFRMS Webhooks, and NIC Gov Mail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>4 Gateways Online</span>
          </div>
        </div>
      </div>

      {/* Simulated Dispatch Toast */}
      {dispatchToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 shadow-2xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{dispatchToast}</span>
        </div>
      )}

      {/* Notification Statistics & Channels Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>LEA Patrol SMS</span>
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">CDAC / TRAI DLT</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">Instant GPS Broadcast</p>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Bank CFCFRMS Gateway</span>
            <Webhook className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">REST Webhooks</p>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-mono mt-0.5">Automated ATM Hold</p>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>I4C Gov Email</span>
            <Mail className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">NIC Gateway</p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-mono mt-0.5">State SP Escalation</p>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Actionable Threats</span>
            <Bell className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-base font-bold text-amber-600 dark:text-amber-400">
            {alerts.filter((a) => a.status === 'New' || a.status === 'Under Review').length} Pending
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">&gt;70% Confidence Threshold</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts by Alert ID, Case Number, Target Area, ATM..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
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

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{alert.supportingEvidence}</p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">
                      <strong>Target:</strong> {alert.candidateAtm}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>
                      <strong>Window:</strong> {alert.timeWindow}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Building className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="truncate">
                      <strong>Unit:</strong> {alert.assignedUnit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">
                      <strong>Case:</strong> {alert.complaintNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    const match = complaints.find((c) => c.complaintNumber === alert.complaintNumber);
                    if (match) {
                      onSelectComplaint(match);
                      onNavigateTab('prediction');
                    }
                  }}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Inspect ML Factors</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDispatchModal(alert)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Broadcast Dispatch</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Channel Real-Time Dispatch Modal */}
      {activeDispatchAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-rose-400" />
                <h3 className="font-heading font-extrabold text-sm text-white">
                  Multi-Channel Alert Dispatcher &amp; Emergency Broadcast
                </h3>
              </div>
              <button
                onClick={() => setActiveDispatchAlert(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{activeDispatchAlert.title}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                    Risk {activeDispatchAlert.riskScore}%
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  Target: {activeDispatchAlert.candidateAtm} | Window: {activeDispatchAlert.timeWindow} | Unit: {activeDispatchAlert.assignedUnit}
                </p>
              </div>

              {/* Channel Selector */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                  Select Actionable Dispatch Channels:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      selectedChannels.sms
                        ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedChannels.sms}
                      onChange={(e) => setSelectedChannels((prev) => ({ ...prev, sms: e.target.checked }))}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-rose-500" />
                        <span>Police Patrol SMS</span>
                      </div>
                      <span className="text-[10px] text-slate-500">TRAI DLT Template to PCR Vans</span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      selectedChannels.api
                        ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedChannels.api}
                      onChange={(e) => setSelectedChannels((prev) => ({ ...prev, api: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <Webhook className="w-3.5 h-3.5 text-blue-500" />
                        <span>Bank CFCFRMS API</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Instant ATM Cash-Hold Payload</span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      selectedChannels.email
                        ? 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedChannels.email}
                      onChange={(e) => setSelectedChannels((prev) => ({ ...prev, email: e.target.checked }))}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-purple-500" />
                        <span>I4C Gov Flash Mail</span>
                      </div>
                      <span className="text-[10px] text-slate-500">State SP &amp; I4C Central Desk</span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      selectedChannels.dashboard
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedChannels.dashboard}
                      onChange={(e) => setSelectedChannels((prev) => ({ ...prev, dashboard: e.target.checked }))}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Dashboard Siren Push</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Live Terminals Audio Broadcast</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payload Preview */}
              <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[10px] space-y-1">
                <div className="text-slate-400 font-bold mb-1">// Real-Time Dispatch Payload Preview</div>
                <div>DESTINATION_ATM: {activeDispatchAlert.candidateAtm}</div>
                <div>RISK_SCORE: {activeDispatchAlert.riskScore}% | WINDOW: {activeDispatchAlert.timeWindow}</div>
                <div>ACTION_DIRECTIVE: Immediate Physical Interception &amp; Sec 102 CrPC ATM Cash Dispensary Hold</div>
              </div>

              {/* Delivery Receipt when completed */}
              {dispatchSuccessData && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Dispatch Confirmed at {dispatchSuccessData.timestamp}</span>
                  </div>
                  <ul className="text-[11px] text-emerald-700 dark:text-emerald-300 list-disc list-inside space-y-0.5">
                    {dispatchSuccessData.recipients.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                {Object.values(selectedChannels).filter(Boolean).length} channels armed
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveDispatchAlert(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleExecuteMultiChannelDispatch}
                  disabled={isDispatching}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isDispatching ? (
                    <span>Broadcasting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Live Broadcast</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
