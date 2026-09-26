import React from 'react';
import {
  Sparkles,
  Zap,
  PlusCircle,
  Bell,
  ChevronDown,
  Shield,
  Sun,
  Moon,
  Radio,
} from 'lucide-react';
import { Alert, Complaint, User } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  complaints: Complaint[];
  activeComplaint: Complaint;
  onSelectComplaint: (complaint: Complaint) => void;
  onLoadDemoScenario: () => void;
  onOpenNewComplaintModal: () => void;
  onOpenAi: () => void;
  onOpenAlerts: () => void;
  currentUser: User;
  alerts: Alert[];
}

export const Header: React.FC<HeaderProps> = ({
  complaints,
  activeComplaint,
  onSelectComplaint,
  onLoadDemoScenario,
  onOpenNewComplaintModal,
  onOpenAi,
  onOpenAlerts,
  currentUser,
  alerts,
}) => {
  const { theme, toggleTheme } = useTheme();
  const pendingAlerts = alerts.filter((a) => a.status === 'New');

  return (
    <header className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 flex items-center justify-between flex-shrink-0 z-10 transition-colors duration-300">
      {/* Left: Active Complaint Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            CASE:
          </span>
          <div className="relative">
            <select
              value={activeComplaint.id}
              onChange={(e) => {
                const found = complaints.find((c) => c.id === e.target.value);
                if (found) onSelectComplaint(found);
              }}
              className="appearance-none bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800/90 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold text-xs py-1.5 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-all shadow-xs"
            >
              {complaints.map((c) => (
                <option key={c.id} value={c.id} className="dark:bg-slate-900 dark:text-slate-200">
                  {c.complaintNumber} — {c.victimName} (₹{c.fraudAmount.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border transition-colors ${
            activeComplaint.status === 'Under Investigation'
              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
              : activeComplaint.status === 'Escalated'
              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
              : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
          }`}
        >
          {activeComplaint.status}
        </span>
      </div>

      {/* Right: Actions and User */}
      <div className="flex items-center gap-2.5">
        {/* Load Demo Scenario button */}
        <button
          onClick={onLoadDemoScenario}
          className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow-md hover:shadow-orange-500/20 transition-all active:scale-98"
          title="Load Primary SIH Demo Scenario (₹50,000 UPI Fraud & ATM Prediction)"
        >
          <Zap className="w-3.5 h-3.5 fill-current transition-transform group-hover:scale-110" />
          <span>Load Demo</span>
        </button>

        {/* Register Complaint */}
        <button
          onClick={onOpenNewComplaintModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all active:scale-98"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Complaint</span>
        </button>

        {/* AI Copilot Button */}
        <button
          onClick={onOpenAi}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 rounded-lg text-xs font-semibold transition-all relative active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>AI Copilot</span>
          <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 absolute -top-0.5 -right-0.5 animate-ping" />
        </button>

        {/* Alerts Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
          title="View Active Alerts"
        >
          <Bell className="w-4 h-4" />
          {pendingAlerts.length > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {pendingAlerts.length}
            </span>
          )}
        </button>

        {/* Inspira UI-inspired Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme mode"
          className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-all active:scale-95 shadow-xs"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-all duration-300 rotate-0 scale-100" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-all duration-300 rotate-0 scale-100" />
            )}
          </div>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold text-xs font-mono">
            RV
          </div>
          <div className="text-left hidden lg:block">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <span>{currentUser.name}</span>
              <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{currentUser.badgeNumber}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

