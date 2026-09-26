import React from 'react';
import {
  Sparkles,
  Play,
  Plus,
  Bell,
  ChevronDown,
  Shield,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { Alert, Complaint, User } from '../../types';
import { useTheme } from '../../context/ThemeContext';

export type StakeholderPersona = 'lea' | 'bank' | 'i4c';

interface HeaderProps {
  complaints: Complaint[];
  activeComplaint: Complaint;
  onSelectComplaint: (complaint: Complaint) => void;
  onLoadDemoScenario: () => void;
  onOpenNewComplaintModal: () => void;
  onOpenAi: () => void;
  onOpenAlerts: () => void;
  currentUser: User | null;
  onLogout: () => void;
  alerts: Alert[];
  activePersona?: StakeholderPersona;
  onSelectPersona?: (persona: StakeholderPersona) => void;
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
  onLogout,
  alerts,
  activePersona = 'lea',
  onSelectPersona,
}) => {
  const { theme, toggleTheme } = useTheme();
  const pendingAlerts = alerts.filter((a) => a.status === 'New');

  return (
    <header className="h-14 bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800/80 px-5 flex items-center justify-between flex-shrink-0 z-10 select-none">
      {/* Left: Active Case Selector & Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 font-semibold uppercase">
            CASE
          </span>
          <div className="relative">
            <select
              value={activeComplaint.id}
              onChange={(e) => {
                const found = complaints.find((c) => c.id === e.target.value);
                if (found) onSelectComplaint(found);
              }}
              className="appearance-none bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/90 dark:hover:bg-slate-850 text-slate-900 dark:text-slate-100 font-medium text-xs py-1.5 pl-3 pr-8 rounded-md border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-mono"
            >
              {complaints.map((c) => (
                <option key={c.id} value={c.id} className="dark:bg-slate-900 dark:text-slate-200 font-sans">
                  {c.complaintNumber} — {c.victimName} (₹{c.fraudAmount.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Status Pill */}
        <span
          className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${
            activeComplaint.status === 'Under Investigation'
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              : activeComplaint.status === 'Escalated'
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
          }`}
        >
          {activeComplaint.status}
        </span>

        {/* Stakeholder Role Switcher */}
        <div className="hidden xl:flex items-center gap-1.5 ml-1 pl-3 border-l border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-semibold">
            VIEWPORT:
          </span>
          <div className="relative">
            <select
              value={activePersona}
              onChange={(e) => onSelectPersona?.(e.target.value as StakeholderPersona)}
              className="appearance-none bg-blue-50/60 dark:bg-blue-950/40 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-medium text-xs py-1 pl-2.5 pr-7 rounded border border-blue-200 dark:border-blue-800/80 focus:outline-none cursor-pointer"
            >
              <option value="lea">Senior Cybercrime Investigator (LEA)</option>
              <option value="bank">Bank Nodal Officer (CFCFRMS Desk)</option>
              <option value="i4c">National I4C Coordinator (Inter-State)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-blue-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right: Actions and User */}
      <div className="flex items-center gap-2">
        {/* Load Demo Scenario button */}
        <button
          onClick={onLoadDemoScenario}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 rounded-md text-xs font-medium transition-colors"
          title="Load Primary Investigation Scenario (₹50,000 Flow)"
        >
          <Play className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>Demo Case</span>
        </button>

        {/* Register Complaint */}
        <button
          onClick={onOpenNewComplaintModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Intake</span>
        </button>

        {/* AI Copilot Button */}
        <button
          onClick={onOpenAi}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/80 rounded-md text-xs font-medium transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span>Copilot</span>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Alerts Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          title="View Active Alerts"
        >
          <Bell className="w-4 h-4" />
          {pendingAlerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          )}
        </button>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme mode"
          className="p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-slate-400 hover:text-amber-400 transition-colors" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 hover:text-blue-600 transition-colors" />
          )}
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* User Profile */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-1">
            <div className="w-7 h-7 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-xs font-mono">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <span>{currentUser.name}</span>
                <Shield className="w-3 h-3 text-blue-500" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {currentUser.badgeNumber}
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-md"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};

