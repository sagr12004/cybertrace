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
    // Default to Insp Rajesh Varma
    const matched = INVESTIGATORS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    onLogin(matched || INVESTIGATORS[0]);
  };

  const handleQuickDemoLogin = (user: User) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">CyberTrace AI</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-400/30">
                SIH 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Cybercrime Investigation &amp; Financial Withdrawal Prediction Portal
            </p>
          </div>
        </div>

        {/* Demo Fast Login Selector */}
        <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>One-Click Hackathon Demo Login</span>
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
                  <div className="text-[10px] text-slate-400">
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
            Or Sign in with Credentials
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Investigator Official Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@cybercrime.kar.gov.in"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Secure Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Authenticate &amp; Enter Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-500 text-center">
          Authorized personnel only. Sessions are cryptographically audited.
        </p>
      </div>
    </div>
  );
};
