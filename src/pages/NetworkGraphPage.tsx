import React, { useMemo, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Share2,
  ShieldAlert,
  Info,
  DollarSign,
  Building,
  UserCheck,
  TrendingUp,
  MapPin,
  Lock,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { Account, Complaint, Transaction } from '../types';
import { computeAccountNetwork } from '../utils/graphAnalytics';
import { useTheme } from '../context/ThemeContext';

interface NetworkGraphPageProps {
  accounts: Account[];
  transactions: Transaction[];
  activeComplaint: Complaint;
  onNavigateTab: (tab: any) => void;
}

// Custom Node Component for styled rendering
const CustomAccountNode = ({ data }: any) => {
  const isVictim = data.isVictim;
  const isMule = data.isMule;
  const isBeneficiary = data.isBeneficiary;
  const isAtm = data.isAtm;

  let borderColor = 'border-slate-300 dark:border-slate-700';
  let badgeColor = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  let roleTitle = 'Account';

  if (isVictim) {
    borderColor = 'border-blue-500 shadow-blue-500/20';
    badgeColor = 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    roleTitle = 'Victim Account';
  } else if (isMule) {
    borderColor = 'border-amber-500 shadow-amber-500/20';
    badgeColor = 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    roleTitle = 'Mule Node';
  } else if (isBeneficiary) {
    borderColor = 'border-rose-500 shadow-rose-500/20';
    badgeColor = 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    roleTitle = 'Liquidation Hub';
  } else if (isAtm) {
    borderColor = 'border-emerald-500 shadow-emerald-500/20';
    badgeColor = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    roleTitle = 'Target ATM Exit';
  }

  return (
    <div
      className={`px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border-2 shadow-lg min-w-[190px] transition-all cursor-pointer ${borderColor}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${badgeColor}`}>
          {roleTitle}
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          Hop {data.hopsFromVictim ?? 0}
        </span>
      </div>

      <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
        {data.label}
      </div>

      <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
        {data.accountRef}
      </div>

      <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
        <span className="text-slate-500 dark:text-slate-400">{data.bankName}</span>
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          {data.totalVolume ? `₹${(data.totalVolume / 1000).toFixed(0)}k` : 'ATM'}
        </span>
      </div>
    </div>
  );
};

export const NetworkGraphPage: React.FC<NetworkGraphPageProps> = ({
  accounts,
  transactions,
  activeComplaint,
  onNavigateTab,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Compute graph data
  const network = useMemo(() => {
    return computeAccountNetwork(activeComplaint.id, accounts, transactions);
  }, [activeComplaint.id, accounts, transactions]);

  // Layout positions for React Flow
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [
      // Victim
      {
        id: 'ACC-VIC-8812',
        type: 'custom',
        position: { x: 50, y: 160 },
        data: {
          label: 'Aarav Sharma',
          accountRef: 'SB-8812-XXXX-71',
          bankName: 'HDFC Bank',
          isVictim: true,
          hopsFromVictim: 0,
          totalVolume: 50000,
          riskScore: 5,
          kycStatus: 'Verified',
          centralityScore: 25.0,
        },
      },
      // Mule Layer 1
      {
        id: 'ACC-MULE-4011',
        type: 'custom',
        position: { x: 300, y: 160 },
        data: {
          label: 'Dinesh Kumar (Mule L1)',
          accountRef: 'SB-4011-XXXX-99',
          bankName: 'State Bank of India',
          isMule: true,
          hopsFromVictim: 1,
          totalVolume: 50000,
          riskScore: 78,
          kycStatus: 'Pending Verification',
          centralityScore: 75.0,
        },
      },
      // Mule Layer 2A
      {
        id: 'ACC-MULE-9022',
        type: 'custom',
        position: { x: 550, y: 70 },
        data: {
          label: 'Sunil Rao (Layer 2A)',
          accountRef: 'SB-9022-XXXX-14',
          bankName: 'ICICI Bank',
          isMule: true,
          hopsFromVictim: 2,
          totalVolume: 28000,
          riskScore: 84,
          kycStatus: 'Forged Aadhaar',
          centralityScore: 40.0,
        },
      },
      // Mule Layer 2B
      {
        id: 'ACC-MULE-1044',
        type: 'custom',
        position: { x: 550, y: 250 },
        data: {
          label: 'Manoj Verma (Layer 2B)',
          accountRef: 'SB-1044-XXXX-38',
          bankName: 'Axis Bank',
          isMule: true,
          hopsFromVictim: 2,
          totalVolume: 21500,
          riskScore: 82,
          kycStatus: 'Mule Ring Flagged',
          centralityScore: 35.0,
        },
      },
      // Consolidation Hub
      {
        id: 'ACC-CASH-7721',
        type: 'custom',
        position: { x: 800, y: 160 },
        data: {
          label: 'Apex Cash Hub',
          accountRef: 'CA-7721-XXXX-00',
          bankName: 'Canara Bank',
          isBeneficiary: true,
          hopsFromVictim: 3,
          totalVolume: 48500,
          riskScore: 92,
          kycStatus: 'Shell Entity',
          centralityScore: 80.0,
        },
      },
      // Target ATM Exit
      {
        id: 'ATM-SBI-KOR-501',
        type: 'custom',
        position: { x: 1050, y: 160 },
        data: {
          label: 'SBI ATM Koramangala 5th',
          accountRef: 'SBI-KOR-501',
          bankName: 'State Bank of India',
          isAtm: true,
          hopsFromVictim: 4,
          totalVolume: 40000,
          riskScore: 88,
          kycStatus: 'Physical Kiosk',
          centralityScore: 50.0,
        },
      },
    ];
    return nodes;
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    return [
      {
        id: 'e1',
        source: 'ACC-VIC-8812',
        target: 'ACC-MULE-4011',
        animated: true,
        label: '₹50,000 (UPI)',
        labelStyle: { fill: isDark ? '#93C5FD' : '#1D4ED8', fontWeight: 700, fontSize: 11 },
        style: { stroke: '#3B82F6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      },
      {
        id: 'e2',
        source: 'ACC-MULE-4011',
        target: 'ACC-MULE-9022',
        animated: true,
        label: '₹28,000 (IMPS)',
        labelStyle: { fill: isDark ? '#FCD34D' : '#B45309', fontWeight: 700, fontSize: 11 },
        style: { stroke: '#F59E0B', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' },
      },
      {
        id: 'e3',
        source: 'ACC-MULE-4011',
        target: 'ACC-MULE-1044',
        animated: true,
        label: '₹21,500 (UPI)',
        labelStyle: { fill: isDark ? '#FCD34D' : '#B45309', fontWeight: 700, fontSize: 11 },
        style: { stroke: '#F59E0B', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' },
      },
      {
        id: 'e4',
        source: 'ACC-MULE-9022',
        target: 'ACC-CASH-7721',
        animated: true,
        label: '₹27,500 (NEFT)',
        labelStyle: { fill: isDark ? '#FCA5A5' : '#B91C1C', fontWeight: 700, fontSize: 11 },
        style: { stroke: '#EF4444', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
      },
      {
        id: 'e5',
        source: 'ACC-MULE-1044',
        target: 'ACC-CASH-7721',
        animated: true,
        label: '₹21,000 (IMPS)',
        labelStyle: { fill: isDark ? '#FCA5A5' : '#B91C1C', fontWeight: 700, fontSize: 11 },
        style: { stroke: '#EF4444', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
      },
      {
        id: 'e6',
        source: 'ACC-CASH-7721',
        target: 'ATM-SBI-KOR-501',
        animated: true,
        label: '₹40,000 Cashout',
        labelStyle: { fill: isDark ? '#6EE7B7' : '#047857', fontWeight: 700, fontSize: 11 },
        style: { stroke: '#10B981', strokeWidth: 2.5, strokeDasharray: '5,5' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
      },
    ];
  }, [isDark]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({ custom: CustomAccountNode }), []);

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node.data);
  };

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Multi-Hop Account Network Topology</span>
            </h2>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {activeComplaint.complaintNumber}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            NetworkX-style centrality, layered node flow, and candidate ATM liquidation endpoint
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('prediction')}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all active:scale-98"
          >
            <span>Run Spatial Prediction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Network Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-shrink-0">
        <div className="bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Connected Accounts</div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">5 Nodes + ATM</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Total Hops</div>
          <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">4 Hops (3 Layers)</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Total Stolen Flow</div>
          <div className="text-lg font-black font-mono text-slate-900 dark:text-slate-100 mt-0.5">₹50,000</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Centrality Anchor</div>
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1 truncate">Dinesh Kumar (75%)</div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Topology Modus</div>
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-1 truncate">Fan-out then Fan-in</div>
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="flex-1 bg-white dark:bg-[#070b14] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs overflow-hidden relative min-h-[420px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color={isDark ? '#1e293b' : '#CBD5E1'} gap={18} size={1} />
          <Controls className="dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300" />
          <MiniMap
            nodeColor={(n: any) => {
              if (n.data?.isVictim) return '#3B82F6';
              if (n.data?.isMule) return '#F59E0B';
              if (n.data?.isBeneficiary) return '#EF4444';
              return '#10B981';
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </ReactFlow>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 space-y-3 z-10 animate-in fade-in slide-in-from-right-4 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Node Forensics
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{selectedNode.label}</div>
              <div className="font-mono text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                {selectedNode.accountRef}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-[10px] text-slate-400 font-mono">Bank Entity</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                  {selectedNode.bankName}
                </div>
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-[10px] text-slate-400 font-mono">Risk Score</span>
                <div className="font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5">{selectedNode.riskScore}%</div>
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-[10px] text-slate-400 font-mono">Centrality</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedNode.centralityScore}%
                </div>
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-[10px] text-slate-400 font-mono">KYC Status</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                  {selectedNode.kycStatus}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Hops from Victim:</span>
              <span className="font-bold text-xs font-mono bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                Layer {selectedNode.hopsFromVictim}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
