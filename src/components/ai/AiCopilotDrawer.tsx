import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Copy,
  Check,
  FileCheck,
  HelpCircle,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { Complaint, WithdrawalPrediction } from '../../types';
import { api } from '../../services/api';

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeComplaint: Complaint;
  activePrediction?: WithdrawalPrediction;
  onAddNoteToInvestigation?: (note: string) => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  source?: string;
  timestamp: string;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({
  isOpen,
  onClose,
  activeComplaint,
  activePrediction,
  onAddNoteToInvestigation,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello Investigator. I am **CyberTrace AI Copilot**. I am synchronized with complaint **${activeComplaint.complaintNumber}** (₹${activeComplaint.fraudAmount.toLocaleString('en-IN')}, ${activeComplaint.crimeCategory}). How can I assist your investigation today?`,
      source: 'CyberTrace Forensic Core',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const res = await api.askAi(questionText, activeComplaint.id);
      const aiMsg: Message = {
        sender: 'ai',
        text: res.answer,
        source: res.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errMsg: Message = {
        sender: 'ai',
        text: 'Unable to analyze currently. Forensic summary: Mule transactions are staged across multiple accounts with immediate cashout threat.',
        source: 'CyberTrace Rule Engine',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: 'Summarize this complaint and identify key money trail evidence.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    try {
      const res = await api.summarizeComplaint(activeComplaint.id);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.summary,
          source: res.source,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Complaint ${activeComplaint.complaintNumber} involves ₹${activeComplaint.fraudAmount.toLocaleString('en-IN')} routed via suspected mule ${activeComplaint.suspectedAccount}. Layering pattern observed.`,
          source: 'CyberTrace Fallback',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const promptChips = [
    { label: '📋 Summarize Complaint', action: handleSummarize },
    {
      label: '🚩 Why is this account suspicious?',
      action: () => handleAsk(`Why is suspected account ${activeComplaint.suspectedAccount} flagged as high risk?`),
    },
    {
      label: '⚡ Which transactions to freeze first?',
      action: () => handleAsk('Which initial transactions and beneficiary accounts should be frozen immediately?'),
    },
    {
      label: '📍 Explain predicted ATM location',
      action: () => handleAsk('Explain the predicted withdrawal hotspot and what evidence supports this location.'),
    },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 md:w-[480px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-[#070b14] text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              CyberTrace AI Copilot
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-400/30">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Active Case: <span className="text-white font-mono font-medium">{activeComplaint.complaintNumber}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5">
        {promptChips.map((chip, i) => (
          <button
            key={i}
            onClick={chip.action}
            disabled={loading}
            className="text-[11px] font-medium px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 rounded-md border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-all shadow-2xs disabled:opacity-50 active:scale-98"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-[#060a12]/50">
        {messages.map((msg, index) => {
          const isAi = msg.sender === 'ai';
          return (
            <div key={index} className={`flex gap-3 ${isAi ? '' : 'flex-row-reverse'}`}>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isAi
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-800 dark:bg-slate-700 text-white shadow-xs'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] ${isAi ? '' : 'text-right'}`}>
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    isAi
                      ? 'bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs whitespace-pre-line'
                      : 'bg-blue-600 text-white shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 px-1 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.source && <span className="font-medium">• {msg.source}</span>}
                  {isAi && (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => copyMessage(msg.text, index)}
                        className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-0.5"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      {onAddNoteToInvestigation && (
                        <button
                          onClick={() => onAddNoteToInvestigation(msg.text)}
                          className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-0.5"
                          title="Save to Case Notes"
                        >
                          <FileCheck className="w-3 h-3" />
                          <span>Save Note</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-3 bg-white dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            <span>Analyzing forensic money trail and generating intelligence response...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(inputQuestion);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask question about complaint, mule accounts, or ATMs..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputQuestion.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all shadow-xs active:scale-98"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center">
          Forensic decision support tool. Powered by Gemini with grounded case data.
        </p>
      </div>
    </div>
  );
};
