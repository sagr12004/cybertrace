import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { Complaint, CrimeCategory } from '../../types';

interface NewComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (complaintData: Partial<Complaint>) => void;
}

export const NewComplaintModal: React.FC<NewComplaintModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [victimName, setVictimName] = useState('');
  const [victimReference, setVictimReference] = useState(`VIC-BLR-${Math.floor(1000 + Math.random() * 9000)}`);
  const [crimeCategory, setCrimeCategory] = useState<CrimeCategory>('UPI fraud');
  const [fraudAmount, setFraudAmount] = useState<number>(45000);
  const [transactionReference, setTransactionReference] = useState(`UPI-${Date.now().toString().slice(-6)}`);
  const [suspectedAccount, setSuspectedAccount] = useState('ACC-MULE-4011');
  const [suspectedAccountName, setSuspectedAccountName] = useState('Dinesh Kumar (Mule Layer 1)');
  const [bankName, setBankName] = useState('State Bank of India');
  const [incidentLocation, setIncidentLocation] = useState('Koramangala, Bengaluru');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!victimName.trim()) errs.victimName = 'Victim name is required';
    if (!fraudAmount || fraudAmount <= 0) errs.fraudAmount = 'Enter valid positive fraud amount';
    if (!suspectedAccount.trim()) errs.suspectedAccount = 'Suspected account is required';
    if (!incidentLocation.trim()) errs.incidentLocation = 'Incident location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      victimName,
      victimReference,
      crimeCategory,
      fraudAmount: Number(fraudAmount),
      transactionReference,
      suspectedAccount,
      suspectedAccountName,
      bankName,
      incidentLocation,
      notes: notes || `Victim reported unauthorized ${crimeCategory} debit of ₹${fraudAmount}.`,
      status: 'New',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-white dark:bg-[#070b14] text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Register Cybercrime Complaint</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">National Cybercrime Reporting Intake (SIH Prototype)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Victim Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Victim Full Name *
              </label>
              <input
                type="text"
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                  errors.victimName ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {errors.victimName && (
                <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">{errors.victimName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Victim Reference ID
              </label>
              <input
                type="text"
                value={victimReference}
                onChange={(e) => setVictimReference(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Crime Category & Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Crime Category *
              </label>
              <select
                value={crimeCategory}
                onChange={(e) => setCrimeCategory(e.target.value as CrimeCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="UPI fraud">UPI fraud</option>
                <option value="Phishing">Phishing</option>
                <option value="Online banking fraud">Online banking fraud</option>
                <option value="Investment fraud">Investment fraud</option>
                <option value="Other cybercrime">Other cybercrime</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fraud Amount (₹) *
              </label>
              <input
                type="number"
                value={fraudAmount}
                onChange={(e) => setFraudAmount(Number(e.target.value))}
                min="100"
                step="500"
                className={`w-full px-3 py-2 text-xs border rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                  errors.fraudAmount ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {errors.fraudAmount && (
                <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">{errors.fraudAmount}</p>
              )}
            </div>
          </div>

          {/* Suspected Account & Bank */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Suspected Beneficiary Account *
              </label>
              <input
                type="text"
                value={suspectedAccount}
                onChange={(e) => setSuspectedAccount(e.target.value)}
                placeholder="e.g. ACC-MULE-4011"
                className={`w-full px-3 py-2 text-xs border rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                  errors.suspectedAccount ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {errors.suspectedAccount && (
                <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">{errors.suspectedAccount}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Suspected Account Holder
              </label>
              <input
                type="text"
                value={suspectedAccountName}
                onChange={(e) => setSuspectedAccountName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Bank & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Beneficiary Bank Name
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. State Bank of India"
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Incident Location (Area / City) *
              </label>
              <input
                type="text"
                value={incidentLocation}
                onChange={(e) => setIncidentLocation(e.target.value)}
                placeholder="e.g. Koramangala, Bengaluru"
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                  errors.incidentLocation ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {errors.incidentLocation && (
                <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">{errors.incidentLocation}</p>
              )}
            </div>
          </div>

          {/* Modus Operandi & Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Modus Operandi / Detailed Incident Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe how the victim was contacted, fraudulent links, SMS/WhatsApp instructions, APK files installed, etc."
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1.5 active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Register &amp; Initiate Tracing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
