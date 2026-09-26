import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  Database,
  RefreshCw,
  Cpu,
  CheckCircle,
  Sun,
  Moon,
  Monitor,
  Sparkles,
} from 'lucide-react';
import { User as UserType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SettingsPageProps {
  currentUser: UserType;
  onResetDemo: () => Promise<void>;
  healthStatus?: any;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentUser,
  onResetDemo,
  healthStatus,
}) => {
  const { theme, setTheme } = useTheme();
  const [highRiskThreshold, setHighRiskThreshold] = useState(70);
  const [medRiskThreshold, setMedRiskThreshold] = useState(45);
  const [defaultTimeWindow, setDefaultTimeWindow] = useState('0-6 hours');
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      await onResetDemo();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>System Settings &amp; SIH Demo Controls</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure appearance, risk thresholds, time windows, and manage local synthetic forensic datasets
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Demo scenario and forensic state reset to pristine initial values.</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance & Theme (Inspira UI Inspired) */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Interface &amp; Visual Theme</h3>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {theme === 'dark' ? 'Dark Command' : 'Light Mode'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select your preferred display theme. Dark mode provides reduced eye strain during tactical monitoring operations.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${
                theme === 'dark'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-xs ring-1 ring-blue-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Moon className="w-6 h-6 text-indigo-400" />
              <span className="text-xs font-bold">Dark Tactical</span>
              <span className="text-[10px] text-slate-400">Cyber command aesthetic</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${
                theme === 'light'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Sun className="w-6 h-6 text-amber-500" />
              <span className="text-xs font-bold">Light Contrast</span>
              <span className="text-[10px] text-slate-400">Crisp daytime readability</span>
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold text-sm font-mono">
              RV
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{currentUser.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.role}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Badge ID:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentUser.badgeNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{currentUser.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Station Jurisdiction:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">Cyber Crime PS, Bengaluru South</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Access Level:</span>
              <span className="font-bold text-blue-700 dark:text-blue-400">Level 3 (Forensic Lead)</span>
            </div>
          </div>
        </div>

        {/* System Environment & AI Status */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">AI &amp; Backend Runtime Status</h3>
          </div>

          <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">FastAPI / Express Server:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active (Port 3000)</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Google Gemini API:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {healthStatus?.geminiConfigured ? (
                  <span className="text-emerald-600 dark:text-emerald-400">Active (Gemini 3.8 Flash)</span>
                ) : (
                  <span className="text-blue-600 dark:text-blue-400">Local Forensic Copilot (Fallback Ready)</span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Database Engine:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">In-Memory Forensic Store</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Prediction Engine Version:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">SpatialEnsemble-v1.4</span>
            </div>
          </div>
        </div>

        {/* Prediction Threshold Tuning */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Prediction Threshold Tuning</h3>
          </div>

          <div className="space-y-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-slate-700 dark:text-slate-300">High Risk Alert Trigger:</span>
                <span className="font-bold text-red-600 dark:text-red-400 font-mono">{highRiskThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={highRiskThreshold}
                onChange={(e) => setHighRiskThreshold(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Predictions above this value automatically trigger PCR patrol dispatch alerts.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-slate-700 dark:text-slate-300">Default Interception Window:</span>
              </div>
              <select
                value={defaultTimeWindow}
                onChange={(e) => setDefaultTimeWindow(e.target.value)}
                className="w-full p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="0-6 hours">0-6 hours (Immediate Liquidation)</option>
                <option value="6-12 hours">6-12 hours (Standard Shift)</option>
                <option value="12-24 hours">12-24 hours (Staged Draining)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dataset Statistics & Reset */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Synthetic Forensic Dataset Sandbox</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Complaints</span>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">10 Cases</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Accounts</span>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">12 Nodes</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Transactions</span>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">14 Layered Hops</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Withdrawals</span>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">110+ Records</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400">
              Restores initial complaints, transactions, and predictions for a pristine live jury demonstration.
            </p>
            <button
              onClick={handleReset}
              disabled={resetting}
              className="w-full sm:w-auto py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>{resetting ? 'Resetting Database...' : 'Reset Demo Scenario & State'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

