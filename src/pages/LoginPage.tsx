import React, { useState } from 'react';
import {
  Shield,
  Target,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Zap,
  CheckCircle2,
  Building,
  Radio,
} from 'lucide-react';
import { INVESTIGATORS } from '../data/mockData';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('r.varma@cybercrime.kar.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide officer email address');
      return;
    }
    const matched = INVESTIGATORS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    onLogin(
      matched || {
        id: `USR-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        role: 'Senior Cybercrime Investigator',
        badgeNumber: 'LE-IND-409',
      }
    );
  };

  const handleQuickDemoLogin = (user: User) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-blue-600 mx-auto flex items-center justify-center text-white shadow-xs">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl font-heading font-black text-white tracking-tight">CyberTrace</h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-400/30">
                PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              National Cybercrime Investigation &amp; Financial Withdrawal Prediction Portal
            </p>
          </div>
        </div>

        {/* Authorized Officer Quick Access */}
        <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 font-mono">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Select Authorized Role for Quick Access</span>
          </div>

          <div className="space-y-1.5">
            {INVESTIGATORS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickDemoLogin(u)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/90 hover:bg-blue-600/20 hover:border-blue-500/50 border border-slate-700/60 transition-all flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                    {u.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {u.role} • {u.badgeNumber}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Traditional Form Divider */}
        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-slate-900 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Or Sign in with Officer Credentials
          </span>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@cybercrime.gov.in"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Authentication Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin(INVESTIGATORS[0])}
            className="text-xs text-slate-400 hover:text-white underline decoration-slate-600 transition-colors"
          >
            Continue as Guest Investigator (Insp. Rajesh Varma)
          </button>
        </div>

        {/* Security Notice */}
        <div className="pt-2 text-center text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5">
          <Shield className="w-3 h-3 text-slate-500" />
          <span>Restricted to Authorized Law Enforcement &amp; Bank Nodal Officers</span>
        </div>
      </div>
    </div>
  );
};
