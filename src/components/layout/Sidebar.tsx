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
  Shield,
  Link2,
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
  | 'blockchain'
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
    { id: 'blockchain', label: 'Blockchain Forensics', icon: <Link2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Controls & System Config', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-60 bg-white dark:bg-[#070B14] text-slate-700 dark:text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-200 dark:border-slate-800/80 select-none z-20">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/30 dark:border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 dark:text-white tracking-tight text-sm">CyberTrace</span>
              <span className="text-[9px] font-mono font-medium px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                PROACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">National Cyber Forensics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        <div className="px-2.5 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
          Modules
        </div>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold dark:bg-blue-600/15 dark:text-blue-400 dark:border-blue-500/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30'
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
      <div className="p-2.5 border-t border-slate-200 dark:border-slate-800/80">
        <button
          onClick={onOpenAi}
          className="w-full rounded-md bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 p-2.5 text-left transition-colors"
        >
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span>Forensic Copilot</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Query money trails, freeze priorities, and suspect mule indicators.
          </p>
        </button>
      </div>

      {/* Synthetic Dataset Notice */}
      <div className="px-3 py-2 bg-slate-50 dark:bg-[#05080F] border-t border-slate-200 dark:border-slate-800/80 text-[10px] font-mono text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>Pilot v1.4</span>
        <span>•</span>
        <span>Sandbox Environment</span>
      </div>
    </aside>
  );
};
