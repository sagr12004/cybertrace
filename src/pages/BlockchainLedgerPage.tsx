import React, { useState } from 'react';
import {
  Link2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Hash,
  Database,
  Search,
  Lock,
  FileCheck,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Copy,
  Check,
  Radio,
  ArrowLeft,
} from 'lucide-react';
import { Complaint, WithdrawalPrediction } from '../types';

interface BlockchainBlock {
  blockNumber: number;
  blockHash: string;
  previousHash: string;
  merkleRoot: string;
  timestamp: string;
  transactionsCount: number;
  validator: string;
  evidenceType: 'Section 102 Account Freeze' | 'NCRP Complaint Registration' | 'ML Prediction Commitment' | 'Section 91 CCTV Summons' | 'CFCFRMS Fund Recovery';
  relatedEntity: string;
  status: 'Confirmed' | 'Pending';
}

interface BlockchainLedgerPageProps {
  complaints: Complaint[];
  predictions: WithdrawalPrediction[];
  activeComplaint: Complaint;
  onSelectComplaint: (complaint: Complaint) => void;
  onNavigateTab: (tab: any) => void;
}

export const BlockchainLedgerPage: React.FC<BlockchainLedgerPageProps> = ({
  complaints,
  predictions,
  activeComplaint,
  onSelectComplaint,
  onNavigateTab,
}) => {
  const [selectedBlockNumber, setSelectedBlockNumber] = useState<number>(1482);
  const [verifyInput, setVerifyInput] = useState<string>(activeComplaint.complaintNumber);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'validating' | 'verified' | 'tampered';
    computedHash?: string;
    merkleRoot?: string;
    blockNumber?: number;
    timestamp?: string;
    validator?: string;
    details?: string;
  }>({ status: 'idle' });
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Simulated consortium blockchain blocks
  const blocks: BlockchainBlock[] = [
    {
      blockNumber: 1482,
      blockHash: '0x8f3c4e129a0b9432e19641fbde2931885912a7cdb84f18e9c2049103aae4192b',
      previousHash: '0x3a91e42bc8819024f8d91012ca92837490192eab91283c4819283740192a8374',
      merkleRoot: '0x5b19e273019842aef91209384710293847102938471029384710293847102938',
      timestamp: '2026-09-26 06:45:12 UTC',
      transactionsCount: 8,
      validator: 'I4C Bharat-Chain Node #01 (MHA)',
      evidenceType: 'Section 102 Account Freeze',
      relatedEntity: 'ACC-MULE-4819 (AXIS0000842) - ₹27,500 Locked',
      status: 'Confirmed',
    },
    {
      blockNumber: 1481,
      blockHash: '0x3a91e42bc8819024f8d91012ca92837490192eab91283c4819283740192a8374',
      previousHash: '0x12a9bc7419283eab091283740192837401928374019283740192837401928374',
      merkleRoot: '0x9923847102938471029384710293847102938471029384710293847102938471',
      timestamp: '2026-09-26 06:32:04 UTC',
      transactionsCount: 14,
      validator: 'RBI Financial Intelligence Unit Node #04',
      evidenceType: 'ML Prediction Commitment',
      relatedEntity: `Prediction Model v2.4 - Hotspot SBI-KOR-501 (Risk 88%)`,
      status: 'Confirmed',
    },
    {
      blockNumber: 1480,
      blockHash: '0x12a9bc7419283eab091283740192837401928374019283740192837401928374',
      previousHash: '0x7e81920384710293847102938471029384710293847102938471029384710293',
      merkleRoot: '0x1029384710293847102938471029384710293847102938471029384710293847',
      timestamp: '2026-09-26 06:21:18 UTC',
      transactionsCount: 6,
      validator: 'Karnataka CID Cyber Crime Wing Node #02',
      evidenceType: 'Section 91 CCTV Summons',
      relatedEntity: 'Legal Order Issued for SBI Koramangala 5th Block ATM CCTV Logs',
      status: 'Confirmed',
    },
    {
      blockNumber: 1479,
      blockHash: '0x7e81920384710293847102938471029384710293847102938471029384710293',
      previousHash: '0x4481920384710293847102938471029384710293847102938471029384710293',
      merkleRoot: '0x8829384710293847102938471029384710293847102938471029384710293847',
      timestamp: '2026-09-26 06:14:30 UTC',
      transactionsCount: 19,
      validator: 'I4C Bharat-Chain Node #01 (MHA)',
      evidenceType: 'NCRP Complaint Registration',
      relatedEntity: `Complaint ${activeComplaint.complaintNumber} - ₹${activeComplaint.fraudAmount.toLocaleString()} (${activeComplaint.crimeCategory})`,
      status: 'Confirmed',
    },
    {
      blockNumber: 1478,
      blockHash: '0x4481920384710293847102938471029384710293847102938471029384710293',
      previousHash: '0x9981920384710293847102938471029384710293847102938471029384710293',
      merkleRoot: '0x3329384710293847102938471029384710293847102938471029384710293847',
      timestamp: '2026-09-26 05:58:11 UTC',
      transactionsCount: 11,
      validator: 'SBI Nodal Security Node #03',
      evidenceType: 'CFCFRMS Fund Recovery',
      relatedEntity: 'CFCFRMS-1930 Lien Marked on Recipient Bank Account',
      status: 'Confirmed',
    },
  ];

  const selectedBlock = blocks.find((b) => b.blockNumber === selectedBlockNumber) || blocks[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleVerify = () => {
    setVerificationResult({ status: 'validating' });
    setTimeout(() => {
      // Deterministic SHA-256 style mock hash computation based on complaint or reference
      const seed = verifyInput.trim() || activeComplaint.complaintNumber;
      const isKnown =
        complaints.some((c) => c.complaintNumber.toLowerCase() === seed.toLowerCase()) ||
        seed.includes('CYBER') ||
        seed.includes('0x');

      if (isKnown) {
        setVerificationResult({
          status: 'verified',
          computedHash: '0x8f3c4e129a0b9432e19641fbde2931885912a7cdb84f18e9c2049103aae4192b',
          merkleRoot: '0x5b19e273019842aef91209384710293847102938471029384710293847102938',
          blockNumber: 1479,
          timestamp: '2026-09-26 06:14:30 UTC',
          validator: 'I4C Bharat-Chain Node #01 (MHA)',
          details: 'The digital record, Section 91/102 notices, and evidence chain are 100% untampered and cryptographically validated on the I4C Consortium Blockchain.',
        });
      } else {
        setVerificationResult({
          status: 'tampered',
          details: 'No cryptographic commitment found on Bharat-Chain for this query. Hash mismatch or invalid evidence anchor.',
        });
      }
    }, 700);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <button
                onClick={() => onNavigateTab('overview')}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors mr-1"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs uppercase tracking-wider border border-indigo-400/30 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                BHARAT-CHAIN CONSORTIUM FORENSICS
              </span>
              <span className="text-xs text-slate-300 font-mono">• Immutable Forensics Ledger</span>
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-black tracking-tight text-white flex items-center gap-2">
              <span>Bharat-Chain Forensics &amp; Legal Chain of Custody</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Cryptographic evidence anchoring for NCRP cybercrime complaints, ML predictive withdrawal models, and
              Sections 91 &amp; 102 CrPC freezing orders. Prevents evidence repudiation and guarantees admissibility in court.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 self-stretch md:self-auto">
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Police Legal Dossier</span>
            </button>
            <button
              onClick={() => onNavigateTab('prediction')}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <span>Predictor Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Consortium Network Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Consortium Network</span>
            <Database className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-slate-100">I4C Bharat-Chain</p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>4 Validator Nodes Live</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Latest Block Height</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-slate-100">#1,482</p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">Block time: ~45 sec (PoA)</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Anchored Legal Orders</span>
            <Lock className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-slate-100">8,429 Hashes</p>
          <p className="mt-1 text-[11px] text-purple-600 dark:text-purple-400 font-mono">Sec 91 &amp; 102 CrPC</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>CFCFRMS Fund Freezes</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹4.82 Cr</p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">Smart Contract Protected</p>
        </div>
      </div>

      {/* Main Grid: Interactive Block Explorer & Cryptographic Verification Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Blocks on Chain (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900/90 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-indigo-500" />
                  <span>Consortium Forensics Ledger Blocks</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click a block to inspect cryptographic proofs and validator signatures
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                PoA Consensus Active
              </span>
            </div>

            <div className="space-y-3">
              {blocks.map((block) => {
                const isSelected = block.blockNumber === selectedBlockNumber;
                return (
                  <div
                    key={block.blockNumber}
                    onClick={() => setSelectedBlockNumber(block.blockNumber)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500/30'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-bold">
                          Block #{block.blockNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {block.evidenceType}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {block.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-2">
                      {block.relatedEntity}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-400">Hash:</span>
                        <span className="text-indigo-600 dark:text-indigo-400 truncate max-w-[240px]">
                          {block.blockHash}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[10px] shrink-0">
                        Validator: {block.validator.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Block Details & Cryptographic Verification Tool (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Block Inspection */}
          <div className="bg-white dark:bg-slate-900/90 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Block #{selectedBlock.blockNumber} Proofs</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold">
                {selectedBlock.status}
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Block Hash (SHA-256)</span>
                <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-lg font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all">
                  <span className="truncate flex-1">{selectedBlock.blockHash}</span>
                  <button
                    onClick={() => handleCopy(selectedBlock.blockHash)}
                    className="p-1 hover:text-indigo-500 text-slate-400 transition-colors"
                    title="Copy block hash"
                  >
                    {copiedHash === selectedBlock.blockHash ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Merkle Root</span>
                <div className="p-2 bg-slate-100 dark:bg-slate-800/80 rounded-lg font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate">
                  {selectedBlock.merkleRoot}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Transactions</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {selectedBlock.transactionsCount} Anchors
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Validation Node</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono truncate block">
                    {selectedBlock.validator}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Evidence Verification Tool */}
          <div className="bg-white dark:bg-slate-900/90 rounded-xl p-5 border border-indigo-200 dark:border-indigo-900/50 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Independent Hash Verification Tool
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Validate cryptographic non-repudiation for LEA court submission (Section 65B Indian Evidence Act).
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Query NCRP Complaint Number or Evidence Hash
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                    placeholder="e.g. CYBER-2026-0842"
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  <button
                    onClick={handleVerify}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-slate-400">Quick load:</span>
                {complaints.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setVerifyInput(c.complaintNumber);
                      onSelectComplaint(c);
                    }}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                      verifyInput === c.complaintNumber
                        ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {c.complaintNumber}
                  </button>
                ))}
              </div>

              {/* Verification Result Display */}
              {verificationResult.status === 'validating' && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                  Querying I4C Bharat-Chain Merkle Tree &amp; computing SHA-256 state...
                </div>
              )}

              {verificationResult.status === 'verified' && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>CRYPTOGRAPHIC PROOF VERIFIED: IMMUTABLE</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-200 leading-relaxed">
                    {verificationResult.details}
                  </p>
                  <div className="pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60 font-mono text-[10px] space-y-1 text-emerald-700 dark:text-emerald-300">
                    <div>Block Height: #{verificationResult.blockNumber}</div>
                    <div className="truncate">Merkle Root: {verificationResult.merkleRoot}</div>
                    <div>Witness: {verificationResult.validator}</div>
                  </div>
                </div>
              )}

              {verificationResult.status === 'tampered' && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>HASH MISMATCH / RECORD NOT FOUND</span>
                  </div>
                  <p className="text-[11px] text-rose-800 dark:text-rose-200">
                    {verificationResult.details}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
