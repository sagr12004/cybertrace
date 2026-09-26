import React, { useMemo, useState } from 'react';
import {
  History,
  Search,
  Filter,
  CreditCard,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Download,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AtmLocation, WithdrawalRecord } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HistoricalWithdrawalsPageProps {
  withdrawals: WithdrawalRecord[];
  atms: AtmLocation[];
  onNavigateTab: (tab: any) => void;
}

export const HistoricalWithdrawalsPage: React.FC<HistoricalWithdrawalsPageProps> = ({
  withdrawals,
  atms,
  onNavigateTab,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAtm, setSelectedAtm] = useState('ALL');
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  // Filtered dataset
  const filtered = useMemo(() => {
    return withdrawals.filter((w) => {
      if (selectedAtm !== 'ALL' && w.atmId !== selectedAtm) return false;
      if (selectedArea !== 'ALL' && w.atmArea !== selectedArea) return false;
      if (onlyFlagged && !w.isFlagged) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          w.accountRef.toLowerCase().includes(q) ||
          w.atmCode.toLowerCase().includes(q) ||
          w.atmArea.toLowerCase().includes(q) ||
          w.cardType.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [withdrawals, selectedAtm, selectedArea, onlyFlagged, searchTerm]);

  // Hourly distribution for chart
  const hourlyData = useMemo(() => {
    const counts = new Array(24).fill(0);
    withdrawals.forEach((w) => {
      const hour = new Date(w.withdrawalTimestamp).getUTCHours();
      counts[hour]++;
    });
    return counts.map((count, hour) => ({
      hour: `${String(hour).padStart(2, '0')}:00`,
      count,
    }));
  }, [withdrawals]);

  // ATM frequency for chart
  const atmData = useMemo(() => {
    const counts: Record<string, number> = {};
    withdrawals.forEach((w) => {
      counts[w.atmCode] = (counts[w.atmCode] || 0) + 1;
    });
    return Object.keys(counts)
      .map((code) => ({ code, count: counts[code] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [withdrawals]);

  const uniqueAreas = Array.from(new Set(atms.map((a) => a.area)));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Historical ATM Withdrawal Database</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geospatial &amp; temporal cash-extraction logs across Bengaluru (110+ synthetic forensic records)
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('prediction')}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all self-start sm:self-auto active:scale-98"
        >
          <span>Feed into Prediction Engine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly distribution */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Withdrawal Activity by Time of Day (24h)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Mule syndicate exhibits high density between 18:00 - 22:00</p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
              Peak: 19:00 - 21:00
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: isDark ? '#94A3B8' : '#64748B' }} interval={2} />
                <YAxis tick={{ fontSize: 10, fill: isDark ? '#94A3B8' : '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} withdrawals`, 'Count']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#1e293b',
                    borderColor: isDark ? '#334155' : '#475569',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ATM frequency */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Top Cash Extraction ATM Hubs</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Highest volume automated teller machines</p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              Top: SBI Koramangala
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={atmData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: isDark ? '#94A3B8' : '#64748B' }} />
                <YAxis dataKey="code" type="category" tick={{ fontSize: 10, fill: isDark ? '#94A3B8' : '#64748B' }} width={95} />
                <Tooltip
                  formatter={(val: any) => [`${val} historical records`, 'Frequency']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#1e293b',
                    borderColor: isDark ? '#334155' : '#475569',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Account, ATM Code, Area, Card..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="ALL">All Bengaluru Areas</option>
            {uniqueAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          <button
            onClick={() => setOnlyFlagged(!onlyFlagged)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              onlyFlagged
                ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {onlyFlagged ? 'Flagged Night Runs Only' : 'All Withdrawals'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-mono font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Withdrawal ID</th>
                <th className="py-3 px-4">Account Reference</th>
                <th className="py-3 px-4">ATM Code &amp; Area</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Card Rail</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Syndicate Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.slice(0, 15).map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">{w.id}</td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">{w.accountRef}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{w.atmCode}</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-1.5">({w.atmArea})</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                    ₹{w.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{w.cardType}</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {w.withdrawalTimestamp.replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {w.isFlagged ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                        High Pattern Match
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Baseline</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Showing {Math.min(filtered.length, 15)} of {filtered.length} withdrawal logs</span>
          <span className="text-[11px] text-slate-400">Historical records anchor DBSCAN cluster centroids</span>
        </div>
      </div>
    </div>
  );
};
