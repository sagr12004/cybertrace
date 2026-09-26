import React, { useState } from 'react';
import {
  Target,
  Clock,
  MapPin,
  AlertTriangle,
  RefreshCw,
  Save,
  Check,
  Eye,
  ArrowLeft,
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
  const [timeWindowOverride, setTimeWindowOverride] = useState<TimeWindow>(
    currentPrediction.timeWindowBucket || '0-6 hours'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleExecuteEngine = async () => {
    setIsRunning(true);
    try {
      await onRunPrediction(timeWindowOverride);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    onSaveToInvestigation(currentPrediction);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigateTab('overview')}
              className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span>Predictive Analytics &amp; Cashout Forecasting</span>
            </h1>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {activeComplaint.complaintNumber}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Spatial-temporal cashout likelihood model calibrated against historical Bangalore cybercrime callsets &amp; mule velocity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExecuteEngine}
            disabled={isRunning}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing Model...' : 'Execute Model Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Model Specs & Calibration Strip */}
      <div className="bg-white dark:bg-[#0B1120] rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Model Engine:</span>{' '}
            <span className="font-mono font-medium text-slate-900 dark:text-slate-200">{currentPrediction.modelVersion}</span>
          </div>
          <div className="h-3 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-slate-500 dark:text-slate-400">Pipeline Status:</span>{' '}
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Inference Ready (DBSCAN + Multi-factor)</span>
          </div>
          <div className="h-3 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-slate-500 dark:text-slate-400">Target Area:</span>{' '}
            <span className="font-medium text-slate-900 dark:text-slate-200">{currentPrediction.predictedZone}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-slate-500 dark:text-slate-400">Window Sensitivity:</span>
          <select
            value={timeWindowOverride}
            onChange={(e) => setTimeWindowOverride(e.target.value as TimeWindow)}
            className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="0-6 hours">0-6 hours (Immediate)</option>
            <option value="6-12 hours">6-12 hours (Mid-Range)</option>
            <option value="12-24 hours">12-24 hours (Extended)</option>
            <option value="24+ hours">24+ hours (Deferred)</option>
          </select>
        </div>
      </div>

      {/* Primary Prediction Output Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Forensic Assessment Dossier */}
        <div className="bg-white dark:bg-[#0B1120] rounded-xl p-5 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Threat Classification
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {currentPrediction.id}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold font-mono text-rose-600 dark:text-rose-500 tabular-nums">
                  {currentPrediction.riskScore}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ 100 Risk Score</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  {currentPrediction.riskCategory} Risk Threshold Exceeded
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>Predicted Target Corridor</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                  {currentPrediction.predictedZone}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  Confidence Radius: ±{currentPrediction.confidenceRadiusMeters}m
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Estimated Interception Window</span>
                </div>
                <div className="font-semibold text-amber-600 dark:text-amber-400 mt-1">
                  {currentPrediction.timeWindowBucket} (Immediate Interception)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  Active Period: {currentPrediction.predictedStart.slice(11, 16)} – {currentPrediction.predictedEnd.slice(11, 16)} UTC
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 mt-4">
            <button
              onClick={() => onNavigateTab('map')}
              className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Plot on GIS</span>
            </button>

            <button
              onClick={handleSave}
              className={`py-1.5 px-3 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 border transition-colors ${
                savedSuccess
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Center & Right: Candidate ATMs & Explainable Weights */}
        <div className="lg:col-span-2 space-y-5">
          {/* Ranked Candidate ATMs */}
          <div className="bg-white dark:bg-[#0B1120] rounded-xl p-5 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Ranked Candidate ATMs</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target teller machines ordered by historical syndicate affinity and route proximity
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Top Matches
              </span>
            </div>

            <div className="space-y-2">
              {currentPrediction.candidateAtms.map((atm, idx) => (
                <div
                  key={atm.atmId}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                        idx === 0
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : idx === 1
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{atm.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="font-mono">{atm.atmCode}</span>
                        <span>•</span>
                        <span>Area: {atm.area}</span>
                        <span>•</span>
                        <span>Proximity: ~{atm.estimatedDistanceKm} km</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{atm.matchScore}% Match</div>
                    <div className="text-[10px] text-slate-400">Cluster Density Model</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explainable AI Factors */}
          <div className="bg-white dark:bg-[#0B1120] rounded-xl p-5 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Explainable Risk Attribution Factors
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Weighted mathematical contribution to the composite risk score</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {currentPrediction.factors.map((factor, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{factor.name}</span>
                    <span className="font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {factor.weight}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{factor.description}</p>
                </div>
              ))}
            </div>

            {/* Verifiable Case Evidence */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Supporting Case Evidence Citations</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
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
