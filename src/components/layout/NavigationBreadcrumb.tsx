import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, HelpCircle, Info, X, Shield, Sparkles } from 'lucide-react';
import { NavTab } from './Sidebar';

interface NavigationBreadcrumbProps {
  currentTab: NavTab;
  onNavigateTab: (tab: NavTab) => void;
}

interface ModuleInfo {
  title: string;
  category: string;
  description: string;
  purpose: string;
  whoUses: string;
  keyActions: string[];
}

const MODULE_INFO: Record<NavTab, ModuleInfo> = {
  overview: {
    title: 'Command Overview',
    category: 'National Cyber Intelligence Hub',
    description: 'Central operational dashboard synthesizing high-velocity cybercrime complaints from the National Cybercrime Reporting Portal (NCRP) and citizen helpline 1930.',
    purpose: 'Provides live awareness of ongoing multi-hop frauds, active mule networks, and top predicted cashout hotspots.',
    whoUses: 'Senior Investigators, State Cyber Cell Chiefs, and Banking Vigilance Officers.',
    keyActions: ['Monitor ~8,000 daily complaints', 'Inspect crime category distribution', 'Launch ₹50,000 demo fraud case'],
  },
  complaints: {
    title: 'NCRP Complaints Intake',
    category: 'Citizen Reporting & Triage',
    description: 'Centralized repository of verified cyber fraud complaints arriving from the National Cybercrime Reporting Portal across India.',
    purpose: 'Allows investigators to review victim statements, suspected bank accounts, lost amounts, and prioritize cases for immediate proactive intervention.',
    whoUses: 'Cyber Desk Sub-Inspectors, Station House Officers (SHOs), and First Responders.',
    keyActions: ['Filter complaints by category & status', 'Register a new citizen complaint', 'Select case for automated money-trail tracing'],
  },
  transactions: {
    title: 'Layering & Transactions Analysis',
    category: 'Financial Forensic Analysis',
    description: 'Chronological reconstruction of how stolen money is rapidly split and moved across multiple bank accounts (Layer 0 to Layer 3).',
    purpose: 'Exposes syndicate laundering tactics such as rapid micro-splitting, smurfing, and immediate ATM liquidation hops.',
    whoUses: 'Forensic Financial Auditors, Bank AML Analysts, and Cyber Investigators.',
    keyActions: ['Trace transaction hops chronologically', 'Inspect suspicious transaction flags', 'Identify high-risk recipient accounts'],
  },
  network: {
    title: 'Mule Network Topology',
    category: 'Interactive Graph Forensics',
    description: 'Visual network graph showing the complete flow of stolen funds from the victim through mule accounts to cashout targets.',
    purpose: 'Enables investigators to identify syndicate hub accounts, high-centrality mules, and understand the structural topology of criminal networks.',
    whoUses: 'Cyber Crime Technical Cells, Intelligence Analysts, and Forensic Officers.',
    keyActions: ['Click nodes to inspect balance & KYC status', 'Hover over edges to view transaction rails & amounts', 'Identify primary consolidation mules'],
  },
  withdrawals: {
    title: 'Withdrawal Patterns',
    category: 'Historical Cybercrime Analytics',
    description: 'Historical database of physical cash withdrawals linked to past financial fraud complaints.',
    purpose: 'Detects recurring withdrawal times, favorite ATM locations, and card type preferences used by cashout mules.',
    whoUses: 'Crime Intelligence Units, Beat Police Officers, and Bank Fraud Prevention Teams.',
    keyActions: ['Analyze withdrawal times and amounts', 'Filter by ATM area & bank name', 'Export historical patterns for predictive modeling'],
  },
  prediction: {
    title: 'Withdrawal Predictor Engine',
    category: 'Predictive Analytics & AI Modeling',
    description: 'Machine learning framework that calculates the most probable physical ATM kiosks where mules will withdraw cash before it disappears.',
    purpose: 'Shifts law enforcement from reactive reporting to proactive physical interception and rapid bank fund-blocking.',
    whoUses: 'State Cyber Command Task Forces, Police Control Rooms (PCRs), and Bank Nodal Officers.',
    keyActions: ['Execute 7-stage ML prediction pipeline', 'Inspect weighted risk factors & explainability', 'Adjust time window sensitivity & save to casefile'],
  },
  map: {
    title: 'GIS Tactical Risk Heatmap',
    category: 'Geospatial Intelligence Dashboard',
    description: 'Interactive OpenStreetMap dashboard visualizing live and potential cashout risk zones, candidate ATMs, and police patrol units.',
    purpose: 'Enables tactical coordination and dispatch of field interception teams to high-risk ATMs.',
    whoUses: 'Police Dispatchers, Flying Squads, Cheetah Patrol Units, and Station Officers.',
    keyActions: ['Drill-down by time window, jurisdiction, and risk', 'Inspect ATM cash availability & CCTV operational status', 'Track live PCR patrol van proximity'],
  },
  alerts: {
    title: 'Alert Dispatch Center',
    category: 'Real-Time Interception Management',
    description: 'Automated threat broadcast pipeline triggered when predictive risk scores exceed actionable thresholds.',
    purpose: 'Dispatches instant notifications to Police Patrol Vans (SMS), Banks (CFCFRMS API), and I4C officers (Gov Mail) to stop cash liquidation.',
    whoUses: 'Command Center Dispatchers, Emergency Response Officers, and Bank Liaisons.',
    keyActions: ['Review actionable high-risk alerts', 'Broadcast multi-channel dispatch (SMS, API, Email)', 'Monitor transmission receipts & acknowledgments'],
  },
  investigations: {
    title: 'Investigation Casefile',
    category: 'Human-in-the-Loop Case Management',
    description: 'Secure investigator workspace for recording formal decisions, reviewing ML predictions, and maintaining an immutable audit log.',
    purpose: 'Guarantees human oversight and legal accountability before physical arrests or asset freezing occur.',
    whoUses: 'Investigating Officers (IOs), Cyber Cell Inspectors, and Supervisory Officers.',
    keyActions: ['Approve cases for field interception', 'Issue Section 102 CrPC bank account freezes', 'Record investigation log entries & notes'],
  },
  reports: {
    title: 'Police Dossier & Legal Reports',
    category: 'Statutory Documentation & Prosecution',
    description: 'Comprehensive, court-ready investigation dossier compliant with Indian criminal procedure and standard operating procedures (SOP).',
    purpose: 'Generates Section 91 CrPC CCTV summons and Section 102 CrPC bank freeze notices with cryptographic chain-of-custody verification.',
    whoUses: 'Public Prosecutors, Station House Officers, and Judicial Magistrates.',
    keyActions: ['Export money-trail CSV table', 'Print or save court-admissible PDF dossier', 'Verify Section 65B Indian Evidence Act certification'],
  },
  blockchain: {
    title: 'Blockchain Forensics Ledger',
    category: 'Immutable Chain of Custody (Bharat-Chain)',
    description: 'Consortium blockchain ledger anchoring every NCRP complaint, Section 102 bank freeze order, and ML prediction hash.',
    purpose: 'Prevents evidence tampering or repudiation, guaranteeing full legal admissibility in court under Section 65B of the Indian Evidence Act.',
    whoUses: 'Judicial Officers, Forensic Experts, I4C Central Command, and RBI Nodal Auditors.',
    keyActions: ['Inspect recent blocks & validator signatures', 'Verify cryptographic SHA-256 hash for any complaint', 'Confirm non-repudiation proof of custody'],
  },
  settings: {
    title: 'Controls & System Config',
    category: 'Administrative & API Controls',
    description: 'Operational settings for model thresholds, demo scenarios, user credentials, and backend synchronization.',
    purpose: 'Allows administrators to configure alerting sensitivities and manage investigator authentication.',
    whoUses: 'System Administrators and Command Staff.',
    keyActions: ['Reset demo investigation scenario', 'Check system and API health status', 'Configure risk threshold sensitivities'],
  },
  bank_desk: {
    title: 'Bank Nodal Desk (CFCFRMS / S.102 CrPC)',
    category: 'Banking Vigilance & Immediate Recovery',
    description: 'Direct console for Bank Nodal Officers and Financial Intelligence Units to process real-time debit freezes, mark account liens, and disarm predicted cashout ATMs.',
    purpose: 'Enables rapid execution of Section 102 CrPC freezes within the critical golden hour before funds are withdrawn in cash.',
    whoUses: 'Bank Nodal Officers, CFCFRMS Desks, and AML Compliance Leads.',
    keyActions: ['Review real-time Section 102 CrPC lien queue', 'Execute immediate debit freeze orders', 'Disarm high-risk ATM cash dispensers', 'Export official compliance certificates'],
  },
  i4c_desk: {
    title: 'National I4C Inter-State Operations Desk',
    category: 'Cross-Jurisdictional Syndicate Coordination',
    description: 'Indian Cybercrime Coordination Centre (I4C) console tracking inter-state fund velocity and coordinating multi-state police interventions.',
    purpose: 'Bridges jurisdictional boundaries by correlating cross-state money trails from victim origin states to transit smurfing hubs and exit states.',
    whoUses: 'I4C National Coordinators, State Cyber Cell Chiefs, and Inter-State Investigation Teams.',
    keyActions: ['Track state-to-state fund corridors', 'Monitor national syndicate threat indices', 'Dispatch multi-jurisdictional Section 91 CrPC notices', 'Broadcast urgent inter-state police alerts'],
  },
};

export const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({
  currentTab,
  onNavigateTab,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const info = MODULE_INFO[currentTab] || MODULE_INFO.overview;
  const isOverview = currentTab === 'overview';

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-2.5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Navigation Breadcrumb & Back Button */}
        <div className="flex items-center gap-2 text-xs">
          {!isOverview && (
            <button
              onClick={() => onNavigateTab('overview')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800 transition-all active:scale-95 shadow-2xs mr-1"
              title="Return to Command Overview"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <button
              onClick={() => onNavigateTab('overview')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Command
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 text-[11px] hidden md:inline">{info.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
            <span className="font-bold text-slate-900 dark:text-slate-100">{info.title}</span>
          </div>
        </div>

        {/* "What is this?" Explainer Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              showInfo
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <span>{showInfo ? 'Hide Guide' : 'What is this module?'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Module Explainer Card */}
      {showInfo && (
        <div className="max-w-7xl mx-auto mt-2.5 p-3.5 bg-slate-50 dark:bg-slate-900/90 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold uppercase">
                  {info.category}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {info.title} — How this works
                </h4>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {info.description} {info.purpose}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-[11px]">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">
                    Target Users:
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">{info.whoUses}</span>
                </div>

                <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-[11px]">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">
                    Key Actions You Can Take:
                  </span>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-0.5">
                    {info.keyActions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
              title="Close guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
