import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Bell,
  Save,
  Check,
  Eye,
} from 'lucide-react';
import { Complaint, TimeWindow, WithdrawalPrediction } from '../types';

interface PredictionPageProps {
  activeComplaint: Complaint;
  currentPrediction: WithdrawalPrediction;
  onRunPrediction: (customTimeWindow?: TimeWindow) => Promise<WithdrawalPrediction>;
  onNavigateTab: (tab: any) => void;
  onSaveToInvestigation: (pred: WithdrawalPrediction) => void;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({
  activeComplaint,
  currentPrediction,
  onRunPrediction,
  onNavigateTab,
  onSaveToInvestigation,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(7);
  const [timeWindowOverride, setTimeWindowOverride] = useState<TimeWindow>(
    currentPrediction.timeWindowBucket || '0-6 hours'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleExecuteEngine = async () => {
    setIsRunning(true);
    setCurrentStep(1);

    // Simulate animated step progression through the 7 stages
    for (let step = 1; step <= 6; step++) {
      await new Promise((r) => setTimeout(r, 220));
      setCurrentStep(step + 1);
    }

    try {
      await onRunPrediction(timeWindowOverride);
    } finally {
      setIsRunning(false);
      setCurrentStep(7);
    }
  };

  const handleSave = () => {
    onSaveToInvestigation(currentPrediction);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const stages = [
    { num: 1, name: 'Data Prep', desc: 'Isolating complaint transactions & mule accounts' },
    { num: 2, name: 'Feature Engineering', desc: 'Velocity, hops, time-of-day & ATM affinity' },
    { num: 3, name: 'Spatial Clustering', desc: 'DBSCAN cluster extraction near Bengaluru ATMs' },
    { num: 4, name: 'Risk Estimation', desc: 'Deterministic multi-factor risk model (0-100)' },
    { num: 5, name: 'Time Window', desc: 'Elapsed latency & historical liquidation velocity' },
    { num: 6, name: 'Explainability', desc: 'Grounding factors with verifiable case evidence' },
    { num: 7, name: 'Candidate Dispatch', desc: 'Target ATMs & field alert preparation' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>AI Withdrawal Prediction Engine</span>
            </h2>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {activeComplaint.complaintNumber}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geospatial &amp; temporal ATM cashout estimation based on money-trail layering velocity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExecuteEngine}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 active:scale-98"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running Prediction...' : 'Re-Run Prediction Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* 7 Stages Stepper Visualizer */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              7-Stage Forensic Prediction Architecture
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Model: {currentPrediction.modelVersion}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {stages.map((st) => {
            const isCompleted = currentStep >= st.num;
            const isCurrent = isRunning && currentStep === st.num;
            return (
              <div
                key={st.num}
                className={`p-2.5 rounded-xl border transition-all text-xs ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/30'
                    : isCompleted
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[10px]">STAGE 0{st.num}</span>
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-3 h-3 text-blue-600 dark:text-blue-400 animate-spin" />
                  ) : null}
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">{st.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                  {st.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Prediction Output Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Overall Risk & Zone Output */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Prediction Assessment
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {currentPrediction.id}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <div className="text-5xl font-black text-rose-500 font-mono tracking-tight tabular-nums">
                {currentPrediction.riskScore}%
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {currentPrediction.riskCategory} Risk
                </span>
                <p className="text-[11px] text-slate-400 mt-1">High Imminence Threshold Exceeded</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                <div className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1.5 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Predicted Hotspot Corridor</span>
                </div>
                <div className="font-extrabold text-sm text-white mt-1">
                  {currentPrediction.predictedZone}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Confidence Radius: ±{currentPrediction.confidenceRadiusMeters} meters
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                <div className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Estimated Time Window</span>
                </div>
                <div className="font-extrabold text-sm text-amber-300 mt-1">
                  {currentPrediction.timeWindowBucket} (Immediate Interception Window)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Window: {currentPrediction.predictedStart.slice(11, 16)} to {currentPrediction.predictedEnd.slice(11, 16)} UTC
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 mt-4">
            <button
              onClick={() => onNavigateTab('map')}
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Plot on GIS Map</span>
            </button>

            <button
              onClick={handleSave}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all active:scale-98 ${
                savedSuccess
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Center & Right: Candidate ATMs & Explainable Weights */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ranked Candidate ATMs */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Ranked Candidate ATMs (DBSCAN Clusters)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target teller machines ordered by historical affinity and route proximity
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                Top 3 Matches
              </span>
            </div>

            <div className="space-y-2.5">
              {currentPrediction.candidateAtms.map((atm, idx) => (
                <div
                  key={atm.atmId}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/40 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                        idx === 0
                          ? 'bg-rose-600 text-white'
                          : idx === 1
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      #{idx + 1}
                    </div>

                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{atm.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{atm.atmCode}</span>
                        <span>• Area: {atm.area}</span>
                        <span>• Proximity: ~{atm.estimatedDistanceKm} km</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-mono font-extrabold text-blue-700 dark:text-blue-400">{atm.matchScore}% Match Score</div>
                    <div className="text-[10px] text-slate-400">DBSCAN Density Cluster</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explainable AI Factors */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Explainable AI (XAI) Attribution Factors</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Transparent mathematical contribution to the risk score</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {currentPrediction.factors.map((factor, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{factor.name}</span>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {factor.weight}% Weight
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">{factor.description}</p>
                </div>
              ))}
            </div>

            {/* Verifiable Case Evidence */}
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-800/60 text-xs">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Supporting Case Evidence Citations</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                {currentPrediction.supportingEvidence.map((ev, idx) => (
                  <li key={idx}>{ev}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
