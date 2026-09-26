import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  ArrowRight,
  Shield,
  Layers,
  Send,
  AlertCircle,
  TrendingUp,
  FileText,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { Complaint, Transaction } from '../types';

interface I4cNationalDeskPageProps {
  complaints: Complaint[];
  activeComplaint: Complaint;
  transactions: Transaction[];
}

interface InterstateSyndicateFlow {
  syndicateId: string;
  name: string;
  sourceState: string;
  transitStates: string[];
  destinationState: string;
  totalDefraudedVolume: number;
  activeAccounts: number;
  identifiedMules: number;
  threatLevel: 'Severe' | 'Elevated' | 'Guarded';
  primaryModusOperandi: string;
}

export const I4cNationalDeskPage: React.FC<I4cNationalDeskPageProps> = ({
  complaints,
  activeComplaint,
  transactions,
}) => {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  const syndicateFlows: InterstateSyndicateFlow[] = [
    {
      syndicateId: 'SYN-NAT-01',
      name: 'Bengaluru-Jamtara Investment Extortion Ring',
      sourceState: 'Karnataka',
      transitStates: ['Jharkhand', 'West Bengal'],
      destinationState: 'Karnataka',
      totalDefraudedVolume: 18500000,
      activeAccounts: 42,
      identifiedMules: 16,
      threatLevel: 'Severe',
      primaryModusOperandi: 'Digital arrest + Fast UPI Layering',
    },
    {
      syndicateId: 'SYN-NAT-02',
      name: 'Delhi-NCR / Mewat Cyber Extortion Collective',
      sourceState: 'Delhi',
      transitStates: ['Haryana', 'Rajasthan'],
      destinationState: 'Maharashtra',
      totalDefraudedVolume: 12400000,
      activeAccounts: 28,
      identifiedMules: 9,
      threatLevel: 'Elevated',
      primaryModusOperandi: 'Part-time task job fraud + Telegram',
    },
    {
      syndicateId: 'SYN-NAT-03',
      name: 'Mumbai Coastal Smurfing Corridor',
      sourceState: 'Maharashtra',
      transitStates: ['Gujarat', 'Goa'],
      destinationState: 'Karnataka',
      totalDefraudedVolume: 8900000,
      activeAccounts: 19,
      identifiedMules: 7,
      threatLevel: 'Guarded',
      primaryModusOperandi: 'Loan app APK extraction & extortion',
    },
    {
      syndicateId: 'SYN-NAT-04',
      name: 'Hyderabad-Odisha Multi-Tier Syndicate',
      sourceState: 'Telangana',
      transitStates: ['Odisha', 'Andhra Pradesh'],
      destinationState: 'Tamil Nadu',
      totalDefraudedVolume: 6700000,
      activeAccounts: 15,
      identifiedMules: 5,
      threatLevel: 'Guarded',
      primaryModusOperandi: 'Fake electricity bill SMS spoofing',
    },
  ];

  const filteredFlows = syndicateFlows.filter((flow) => {
    if (selectedState === 'All') return true;
    return (
      flow.sourceState === selectedState ||
      flow.destinationState === selectedState ||
      flow.transitStates.includes(selectedState)
    );
  });

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {broadcastSent && (
        <div className="fixed top-16 right-6 z-50 bg-blue-950/90 text-blue-200 border border-blue-700/60 px-4 py-2.5 rounded shadow-lg text-xs font-mono flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-400" />
          <span>Inter-State Alert successfully broadcasted to Karnataka, Jharkhand, and Delhi Cyber Cells via I4C Gateway.</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Globe className="w-4 h-4" />
              </div>
              <h1 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                National I4C Inter-State Operations Desk
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-medium">
                I4C Gateway Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Indian Cybercrime Coordination Centre (MHA) cross-jurisdictional syndicate tracking console. Correlate multi-hop funds crossing state borders and dispatch coordinated warrants.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBroadcast}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Multi-State Alert</span>
            </button>
          </div>
        </div>

        {/* National Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Tracked Syndicates</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
              {syndicateFlows.length} Syndicates
            </div>
            <div className="text-[11px] text-slate-500">Cross-state financial rings</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">National Defrauded Volume</div>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
              ₹4.65 Cr
            </div>
            <div className="text-[11px] text-slate-500">Active under investigation</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Interstate Mule Nodes</div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
              104 Mules
            </div>
            <div className="text-[11px] text-slate-500">Across 8 state jurisdictions</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Inter-State Warrants Dispatched</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              23 Warrants
            </div>
            <div className="text-[11px] text-slate-500">Section 91 CrPC active</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: State-to-State Flow Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-900 dark:text-slate-200">
                State-to-State Fund Flow Corridors
              </h2>
              <p className="text-[11px] text-slate-500">
                Tracking fund movements across originating victim states, smurfing hubs, and cashout regions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Filter State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="py-1 px-2.5 bg-slate-50 dark:bg-slate-900 text-xs rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono"
              >
                <option value="All">All Jurisdictions</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredFlows.map((flow) => (
              <div
                key={flow.syndicateId}
                className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{flow.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">({flow.syndicateId})</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{flow.primaryModusOperandi}</div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                      flow.threatLevel === 'Severe'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        : flow.threatLevel === 'Elevated'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                    }`}
                  >
                    {flow.threatLevel} Threat
                  </span>
                </div>

                {/* Corridor Path Visualization */}
                <div className="flex items-center gap-2 py-2 px-3 bg-white dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 rounded text-xs font-mono">
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded border border-blue-500/20">
                    Origin: {flow.sourceState}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  {flow.transitStates.map((ts, idx) => (
                    <React.Fragment key={ts}>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded border border-amber-500/20">
                        Transit: {ts}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </React.Fragment>
                  ))}
                  <span className="px-2 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded border border-rose-500/20">
                    Exit: {flow.destinationState}
                  </span>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-600 dark:text-slate-400">
                  <div>
                    Volume: <strong className="text-slate-900 dark:text-slate-100">₹{(flow.totalDefraudedVolume / 100000).toFixed(1)} Lakh</strong>
                  </div>
                  <div>
                    Accounts: <strong className="text-slate-900 dark:text-slate-100">{flow.activeAccounts}</strong>
                  </div>
                  <div>
                    Identified Mules: <strong className="text-slate-900 dark:text-slate-100">{flow.identifiedMules}</strong>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Initiated Multi-State Mutual Legal Assistance Request for ${flow.name} through I4C Gateway.`);
                    }}
                    className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-[11px] font-medium transition-colors"
                  >
                    Dispatch Notice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Multi-Jurisdictional Police Dispatch Desk */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-500" />
              State Cyber Cell Coordination
            </h2>
            <p className="text-[11px] text-slate-500">
              Active liaison channels with state cyber police nodal officers for simultaneous multi-point intercepts.
            </p>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Karnataka CID Cyber Crime</div>
                  <div className="text-[10px] text-slate-500">Nodal: SP Cyber Operations, CID BLR</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Online
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Jharkhand Cyber Defense Unit</div>
                  <div className="text-[10px] text-slate-500">Nodal: Deoghar / Jamtara Spl Unit</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Online
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Delhi Police IFSO Unit</div>
                  <div className="text-[10px] text-slate-500">Nodal: Special Cell Cyber, Dwarka</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Online
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Maharashtra Cyber HQ</div>
                  <div className="text-[10px] text-slate-500">Nodal: World Trade Centre, Cuffe Parade</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Online
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              National Hotspot Index
            </h3>
            <p className="text-[11px] text-slate-500">
              Corridor density score computed across telecom BTS towers and mule card issuance points.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span>1. Bengaluru Urban (KA)</span>
                <strong className="text-rose-500">Risk: 94/100</strong>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[94%]" />
              </div>

              <div className="flex items-center justify-between font-mono pt-1">
                <span>2. Jamtara-Deoghar (JH)</span>
                <strong className="text-rose-500">Risk: 91/100</strong>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[91%]" />
              </div>

              <div className="flex items-center justify-between font-mono pt-1">
                <span>3. Mewat-Bharatpur (RJ/HR)</span>
                <strong className="text-amber-500">Risk: 84/100</strong>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[84%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
