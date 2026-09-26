import React from 'react';
import {
  LayoutDashboard,
  FileText,
  ArrowRightLeft,
  Share2,
  History,
  Target,
  MapPin,
  Bell,
  ShieldCheck,
  FileSpreadsheet,
  Settings,
  Sparkles,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import { Alert } from '../../types';

export type NavTab =
  | 'overview'
  | 'complaints'
  | 'transactions'
  | 'network'
  | 'withdrawals'
  | 'prediction'
  | 'map'
  | 'alerts'
  | 'investigations'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  alerts: Alert[];
  onOpenAi: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  alerts,
  onOpenAi,
}) => {
  const pendingAlertsCount = alerts.filter(
    (a) => a.status === 'New' || a.status === 'Under Review'
  ).length;

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Command Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'complaints', label: 'NCRP Complaints', icon: <FileText className="w-4 h-4" /> },
    { id: 'transactions', label: 'Layering & Transactions', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { id: 'network', label: 'Mule Network Topology', icon: <Share2 className="w-4 h-4" /> },
    { id: 'withdrawals', label: 'Withdrawal Patterns', icon: <History className="w-4 h-4" /> },
    { id: 'prediction', label: 'Withdrawal Predictor', icon: <Target className="w-4 h-4" /> },
    { id: 'map', label: 'GIS & Hotspot Map', icon: <MapPin className="w-4 h-4" /> },
    {
      id: 'alerts',
      label: 'Alert Dispatch',
      icon: <Bell className="w-4 h-4" />,
      badge: pendingAlertsCount > 0 ? pendingAlertsCount : undefined,
    },
    { id: 'investigations', label: 'Investigation Casefile', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'reports', label: 'Police Dossier & Report', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'settings', label: 'Controls & System Config', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 dark:bg-[#070b14] text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800/80 select-none transition-colors duration-300 z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
            <Compass className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-0 rounded-xl bg-blue-400/20 blur-sm pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-white tracking-tight text-sm">CyberTrace AI</h1>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                SIH'26
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-tight">Bengaluru Cyber Command</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Forensic Modules
        </div>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 active:scale-98 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white text-blue-700' : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Copilot Quick Callout */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={onOpenAi}
          className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-600/10 via-indigo-600/15 to-purple-600/10 border border-blue-500/30 p-3 text-left hover:border-blue-400 transition-all duration-300 shadow-xs"
        >
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>AI Forensic Copilot</span>
          </div>
          <p className="text-[11px] text-slate-400 group-hover:text-slate-200 transition-colors">
            Ask Gemini questions regarding money trails, freeze priorities, or suspect mules.
          </p>
        </button>
      </div>

      {/* Synthetic Dataset Notice */}
      <div className="p-2.5 bg-slate-950/80 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span>Demonstration Pilot • Synthetic Sandbox</span>
      </div>
    </aside>
  );
};

