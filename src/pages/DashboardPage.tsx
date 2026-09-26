import React, { useState } from 'react';
import {
  FileText,
  ShieldAlert,
  ArrowRightLeft,
  Users,
  AlertTriangle,
  Bell,
  MapPin,
  ChevronRight,
  ExternalLink,
  Zap,
  Radio,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Alert, Complaint, Transaction, WithdrawalPrediction } from '../types';
import { useTheme } from '../context/ThemeContext';

interface DashboardPageProps {
  complaints: Complaint[];
  transactions: Transaction[];
  predictions: WithdrawalPrediction[];
  alerts: Alert[];
  onSelectComplaint: (complaint: Complaint) => void;
  onNavigateTab: (tab: any) => void;
  onLoadDemoScenario: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  complaints,
  transactions,
  predictions,
  alerts,
  onSelectComplaint,
  onNavigateTab,
  onLoadDemoScenario,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Computed metrics
  const totalComplaints = complaints.length;
  const activeInvestigations = complaints.filter(
    (c) => c.status === 'Under Investigation' || c.status === 'Assigned' || c.status === 'Escalated'
  ).length;
  const suspiciousTxns = transactions.filter((t) => t.flags && t.flags.length > 0).length;
  const highRiskPredictions = predictions.filter((p) => p.riskCategory === 'High').length;
  const pendingAlerts = alerts.filter((a) => a.status === 'New' || a.status === 'Under Review');

  // Chart data: Crime Category Breakdown
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryCounts[c.crimeCategory] = (categoryCounts[c.crimeCategory] || 0) + 1;
  });
  const pieData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat],
  }));
  const PIE_COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#F59E0B', '#EF4444'];

  // Chart data: Transaction Volume by Hour/Layer
  const volumeData = [
    { time: '06:15', volume: 50000, label: 'L0 Victim Debit' },
    { time: '06:18', volume: 28000, label: 'L1 Split Mule A' },
    { time: '06:19', volume: 21500, label: 'L1 Split Mule B' },
    { time: '06:24', volume: 27500, label: 'L2 Consolidation' },
    { time: '06:25', volume: 21000, label: 'L2 Hub Intake' },
    { time: '07:30', volume: 40000, label: 'Target ATM Exit' },
  ];

  // Hotspots Summary
  const hotspotList = [
    { zone: 'Koramangala 5th Block', risk: 88, atms: 'SBI-KOR-501', time: '0-6 hours', count: 7 },
    { zone: 'BTM Layout 2nd Stage', risk: 86, atms: 'HDFC-BTM-202', time: '0-6 hours', count: 5 },
    { zone: 'Indiranagar 100ft Rd', risk: 82, atms: 'AXIS-IND-104', time: '6-12 hours', count: 4 },
    { zone: 'Jayanagar 4th Block', risk: 76, atms: 'ICICI-JAY-405', time: '12-24 hours', count: 3 },
  ];

  // Filtered Complaints for Table
  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && c.crimeCategory !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Inspira UI style dark gradient callout */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl border border-blue-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-xs uppercase tracking-wider border border-blue-400/30 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                SIH 2026 PROTOTYPE
              </span>
              <span className="text-xs text-slate-300 font-mono">• Bengaluru Cyber Intelligence Unit</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              CyberTrace AI: Financial Fraud & Withdrawal Prediction
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Multi-hop mule network tracing paired with explainable geospatial ATM withdrawal prediction.
              Select any active complaint to trace suspect accounts, analyze flow velocity, inspect risk envelopes, and dispatch field interception alerts.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={onLoadDemoScenario}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/25 transition-all active:scale-98"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Demo Case (₹50k Flow)</span>
            </button>
            <button
              onClick={() => onNavigateTab('prediction')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/20 transition-all active:scale-98"
            >
              <span>Predictor</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Bento Grid with Hairline borders & Inspira UI style hover */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-blue-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Total Complaints</span>
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
            {totalComplaints}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            100% Synced
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-indigo-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Active Cases</span>
            <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-110" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
            {activeInvestigations}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono mt-1">Under Investigation</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-purple-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Flagged Txns</span>
            <ArrowRightLeft className="w-4 h-4 text-purple-600 dark:text-purple-400 transition-transform group-hover:scale-110" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
            {suspiciousTxns}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-mono mt-1">Multi-hop Layering</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-amber-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Mule Accounts</span>
            <Users className="w-4 h-4 text-amber-500 dark:text-amber-400 transition-transform group-hover:scale-110" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
            12
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-1">Syndicate Nodes</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-rose-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>High-Risk Hotspots</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 transition-transform group-hover:scale-110" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
            {highRiskPredictions}
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-mono mt-1">Risk Score &gt; 80%</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-orange-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Pending Alerts</span>
            <Bell className="w-4 h-4 text-orange-500 dark:text-orange-400 transition-transform group-hover:scale-110" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-orange-600 dark:text-orange-400 tabular-nums">
            {pendingAlerts.length}
          </div>
          <div className="text-[11px] text-orange-600 dark:text-orange-400 font-mono mt-1">Awaiting Dispatch</div>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crime Category Distribution */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Crime Category Distribution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Breakdown of reported cyber fraud types</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} complaints`, name]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#1e293b',
                    borderColor: isDark ? '#334155' : '#475569',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-3 border-t border-slate-100 dark:border-slate-800">
            {pieData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span>{item.name}: <strong className="text-slate-800 dark:text-slate-200 font-mono">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Flow Timeline Chart */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Layering Velocity Pattern</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Rapid fund splitting across tiers (₹ Volume)</p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              &lt; 15 mins
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: isDark ? '#94A3B8' : '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#1e293b',
                    borderColor: isDark ? '#334155' : '#475569',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="volume" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 text-center">
            Victim debit was split into 2 secondary accounts within 3 minutes and staged for cashout.
          </p>
        </div>

        {/* Geographic Hotspot Summary */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Predicted Withdrawal Hotspots</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Bengaluru ATM clusters flagged by ML</p>
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {hotspotList.map((hotspot) => (
              <div
                key={hotspot.zone}
                onClick={() => onNavigateTab('map')}
                className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/40 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span>{hotspot.zone}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Target: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{hotspot.atms}</span> • {hotspot.time}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-extrabold text-rose-600 dark:text-rose-400">{hotspot.risk}% Risk</div>
                  <div className="text-[10px] font-mono text-slate-400">{hotspot.count} hits</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent High-Priority Alerts & Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Recent Cybercrime Complaints</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click any complaint to inspect full money trail and evidence</p>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">All Categories</option>
                <option value="UPI fraud">UPI fraud</option>
                <option value="Phishing">Phishing</option>
                <option value="Investment fraud">Investment fraud</option>
                <option value="Online banking fraud">Online banking fraud</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Escalated">Escalated</option>
                <option value="New">New</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-mono font-bold border-y border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Complaint ID</th>
                  <th className="py-2.5 px-3">Victim</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredComplaints.slice(0, 6).map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => {
                      onSelectComplaint(c);
                      onNavigateTab('transactions');
                    }}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-950/30 cursor-pointer transition-all"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {c.complaintNumber}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                      {c.victimName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                      {c.crimeCategory}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      ₹{c.fraudAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                          c.status === 'Under Investigation'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                            : c.status === 'Escalated'
                            ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
                            : c.status === 'Resolved'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold inline-flex items-center gap-0.5 group-hover:underline">
                        Trace <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent High Priority Alerts Feed */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>Field Dispatch Alerts</span>
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Instant law enforcement notifications</p>
            </div>
            <button
              onClick={() => onNavigateTab('alerts')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              All Alerts
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-orange-500/40 bg-slate-50/50 dark:bg-slate-800/40 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                    {alert.riskScore}% {alert.riskCategory} Risk
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{alert.id}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {alert.title}
                </h4>

                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Target ATM: <strong className="text-slate-800 dark:text-slate-200 font-mono">{alert.candidateAtm}</strong>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Unit: {alert.assignedUnit.split('/')[0]}</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{alert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
