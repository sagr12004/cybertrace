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
  Target,
  ShieldCheck,
  Link2,
  CheckCircle2,
  HelpCircle,
  Info,
  X,
  Building,
  Smartphone,
  Check,
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
  const [isSihModalOpen, setIsSihModalOpen] = useState(false);

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
      {/* Top Banner: National Cyber Command Callout */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl border border-blue-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-xs uppercase tracking-wider border border-blue-400/30 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                NATIONAL CYBER FORENSICS &amp; FINANCIAL DEFENSE
              </span>
              <span className="text-xs text-slate-300 font-mono">• National Cybercrime Reporting Portal (NCRP)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-400/30">
                ~8,000 Complaints/Day Proactive Defense
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-black tracking-tight text-white">
              CyberTrace: Predictive Analytics &amp; Cash Withdrawal Forecasting
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Transitioning from reactive investigation to <strong>proactive intervention</strong>: forecasting likely cash withdrawal locations,
              generating real-time actionable intelligence for LEAs &amp; Banks via CFCFRMS, and establishing immutable blockchain evidence chains.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap">
            <button
              onClick={() => setIsSihModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-600/40 hover:bg-indigo-600/70 text-indigo-200 border border-indigo-400/30 rounded-xl text-xs font-semibold backdrop-blur-xs transition-all active:scale-98"
            >
              <Info className="w-4 h-4" />
              <span>System Guide</span>
            </button>
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

      {/* Core Capabilities Bento Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Capability 1 */}
        <div
          onClick={() => onNavigateTab('prediction')}
          className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-blue-200 dark:border-blue-900/40 shadow-2xs hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-bold mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider">AI Predictive Engine</span>
              <Target className="w-4 h-4 transition-transform group-hover:scale-110" />
            </div>
            <h4 className="font-heading font-black text-sm text-slate-900 dark:text-slate-100">Predictive Engine</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              ML pattern detection &amp; geospatial risk modeling on 8,000+ daily complaints.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
            <span>Forecast Hotspots</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Capability 2 */}
        <div
          onClick={() => onNavigateTab('map')}
          className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-emerald-200 dark:border-emerald-900/40 shadow-2xs hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider">Tactical GIS Heatmap</span>
              <MapPin className="w-4 h-4 transition-transform group-hover:scale-110" />
            </div>
            <h4 className="font-heading font-black text-sm text-slate-900 dark:text-slate-100">Risk Heatmap GIS</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              GIS visualization of real-time &amp; potential risk zones with time/crime drill-downs.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
            <span>Interactive Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Capability 3 */}
        <div
          onClick={() => onNavigateTab('investigations')}
          className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-purple-200 dark:border-purple-900/40 shadow-2xs hover:border-purple-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-bold mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider">Investigator Workspace</span>
              <ShieldCheck className="w-4 h-4 transition-transform group-hover:scale-110" />
            </div>
            <h4 className="font-heading font-black text-sm text-slate-900 dark:text-slate-100">Law Enforcement UI</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Secure investigator interface: Sec 91 &amp; 102 CrPC legal documentation.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">
            <span>Investigator Desk</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Capability 4 */}
        <div
          onClick={() => onNavigateTab('alerts')}
          className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-rose-200 dark:border-rose-900/40 shadow-2xs hover:border-rose-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-bold mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider">Threat Broadcast System</span>
              <Bell className="w-4 h-4 transition-transform group-hover:scale-110" />
            </div>
            <h4 className="font-heading font-black text-sm text-slate-900 dark:text-slate-100">Alert Dispatch</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Real-time dispatch to LEAs, Banks &amp; I4C officers via SMS, Email &amp; Webhook API.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400">
            <span>Dispatch System</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Capability 5 */}
        <div
          onClick={() => onNavigateTab('blockchain')}
          className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-indigo-200 dark:border-indigo-900/40 shadow-2xs hover:border-indigo-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider">Bharat-Chain Ledger</span>
              <Link2 className="w-4 h-4 transition-transform group-hover:scale-110" />
            </div>
            <h4 className="font-heading font-black text-sm text-slate-900 dark:text-slate-100">Bharat-Chain</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Consortium proof-of-custody: SHA-256 evidence integrity &amp; Sec 102 fund freezes.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
            <span>Verify Hashes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* KPI Metric Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-blue-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>NCRP Daily Complaints</span>
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
            8,142
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live National Feed
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-indigo-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Active Investigations</span>
            <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-110" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
            {activeInvestigations}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono mt-1">State Cyber Cell</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-purple-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Layering Transactions</span>
            <ArrowRightLeft className="w-4 h-4 text-purple-600 dark:text-purple-400 transition-transform group-hover:scale-110" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
            {suspiciousTxns}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-mono mt-1">Multi-hop Mules</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-amber-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Flagged Mules</span>
            <Users className="w-4 h-4 text-amber-500 dark:text-amber-400 transition-transform group-hover:scale-110" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
            12
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-1">CFCFRMS Block List</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-rose-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Predicted Hotspots</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 transition-transform group-hover:scale-110" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
            {highRiskPredictions}
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-mono mt-1">&gt;80% Risk ATMs</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-orange-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Alerts &amp; Dispatches</span>
            <Bell className="w-4 h-4 text-orange-500 dark:text-orange-400 transition-transform group-hover:scale-110" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono tracking-tight text-orange-600 dark:text-orange-400 tabular-nums">
            {pendingAlerts.length}
          </div>
          <div className="text-[11px] text-orange-600 dark:text-orange-400 font-mono mt-1">SMS / API Dispatched</div>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crime Category Distribution */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">NCRP Crime Category Distribution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Proportion of reported cyber fraud vectors</p>
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
                <span className="font-medium">{item.name}</span>
                <span className="font-mono text-slate-400">({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mule Layering & Cash-out Velocity Curve */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Layering Flow &amp; Cashout Velocity</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Chronological fund splitting before ATM exit</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Avg 75 min Latency
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <XAxis dataKey="time" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(val: any, _: any, item: any) => [`₹${val.toLocaleString()}`, item.payload.label]}
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

          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
            Funds split across 2 intermediate mule tiers before converging at high-liquidity ATM kiosks within 90 minutes.
          </p>
        </div>

        {/* High Risk Withdrawal Hotspots List */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Top Predicted Cashout Hotspots</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ranked by ML geospatial probability</p>
              </div>
              <button
                onClick={() => onNavigateTab('map')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              >
                <span>Full Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {hotspotList.map((item, index) => (
                <div
                  key={item.zone}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.zone}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Target: {item.atms} • Window: {item.time}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                        item.risk >= 85
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {item.risk}% Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">CFCFRMS Rapid Freeze Protocol</span>
            <button
              onClick={() => onNavigateTab('prediction')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all"
            >
              Analyze Prediction
            </button>
          </div>
        </div>
      </div>

      {/* NCRP Intake Table */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
              National Cybercrime Reporting Portal (NCRP) Active Intake
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live case pipeline prioritized for proactive cash withdrawal prediction and fund recovery
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Escalated">Escalated</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="UPI fraud">UPI fraud</option>
              <option value="Phishing">Phishing</option>
              <option value="Online banking fraud">Online banking fraud</option>
              <option value="Investment fraud">Investment fraud</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Victim</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Suspect Account</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {filteredComplaints.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {c.complaintNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {c.victimName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {c.crimeCategory}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    ₹{c.fraudAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300 text-[11px]">
                    <div>{c.suspectedAccount}</div>
                    <div className="text-[10px] text-slate-400">{c.bankName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'New'
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                          : c.status === 'Under Investigation'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                          : c.status === 'Escalated'
                          ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        onSelectComplaint(c);
                        onNavigateTab('prediction');
                      }}
                      className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                    >
                      <span>Forecast</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Guide & Architecture Modal */}
      {isSihModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-400" />
                <h3 className="font-heading font-extrabold text-sm text-white">
                  National Cybercrime Mitigation Architecture &amp; System Overview
                </h3>
              </div>
              <button
                onClick={() => setIsSihModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 space-y-1">
                <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                  System Mission &amp; Purpose
                </span>
                <h4 className="font-heading font-black text-sm text-slate-900 dark:text-slate-100 leading-snug">
                  Predictive Analytics Framework for Cybercrime Complaints to Forecast Likely Cash Withdrawal Locations in Advance, Enabling Proactive Cybercrime Intervention.
                </h4>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                  <span>Framework: <strong>Blockchain &amp; Cybersecurity</strong></span>
                  <span>•</span>
                  <span>Authority: <strong>I4C / MHA / NCRP</strong></span>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Core Architectural Modules:
                </h5>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>1. Predictive Analytics Engine</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                    AI/ML-based system to analyze historical cybercrime &amp; financial data (~8,000 complaints daily) to predict potential withdrawal hotspots. Includes velocity decay, layering hops, geospatial distance modeling, and real-time alerts.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>2. Tactical Risk Heatmap Dashboard</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                    GIS-enabled tactical map visualizing real-time and potential risk zones with drill-down filters by time window, jurisdiction, and crime category (UPI, Phishing, Investment fraud).
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>3. Law Enforcement Interface</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                    Secure interface for police investigators to access alerts, intelligence briefs, Section 91 CrPC CCTV summons, and Section 102 CrPC bank account freezing orders.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>4. Alert &amp; Threat Notification System</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                    Real-time notifications to law enforcement (Patrol SMS), Banks (CFCFRMS REST API webhook), and I4C officers (Gov Flash Mail) with live dispatch execution simulator.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>5. Bharat-Chain Immutable Forensics Ledger</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                    Tamper-proof cryptographic chain of custody using SHA-256 Merkle proofs and Proof-of-Authority consensus (I4C, RBI, CID) ensuring Section 65B legal admissibility in court.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsSihModalOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
