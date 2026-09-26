import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  Eye,
  ArrowRight,
  Shield,
  Calendar,
  MapPin,
  Building,
  CreditCard,
  UserCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Complaint, CrimeCategory, ComplaintStatus } from '../types';

interface ComplaintsPageProps {
  complaints: Complaint[];
  activeComplaint: Complaint;
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenNewComplaintModal: () => void;
  onNavigateTab: (tab: any) => void;
}

export const ComplaintsPage: React.FC<ComplaintsPageProps> = ({
  complaints,
  activeComplaint,
  onSelectComplaint,
  onOpenNewComplaintModal,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDetail, setSelectedDetail] = useState<Complaint | null>(null);

  const filtered = complaints.filter((c) => {
    if (categoryFilter !== 'ALL' && c.crimeCategory !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        c.complaintNumber.toLowerCase().includes(q) ||
        c.victimName.toLowerCase().includes(q) ||
        c.suspectedAccount.toLowerCase().includes(q) ||
        c.incidentLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Cybercrime Complaints Repository</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            National Cybercrime Intake Portal Records &amp; Money-Trail Linking
          </p>
        </div>

        <button
          onClick={onOpenNewComplaintModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all self-start sm:self-auto active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Complaint</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Complaint ID, Victim Name, Suspected Account, Area..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="UPI fraud">UPI fraud</option>
            <option value="Phishing">Phishing</option>
            <option value="Online banking fraud">Online banking fraud</option>
            <option value="Investment fraud">Investment fraud</option>
            <option value="Other cybercrime">Other cybercrime</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Assigned">Assigned</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-mono font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Victim Profile</th>
                <th className="py-3 px-4">Crime Category</th>
                <th className="py-3 px-4">Fraud Amount</th>
                <th className="py-3 px-4">Suspected Beneficiary</th>
                <th className="py-3 px-4">Incident Area</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((complaint) => {
                const isSelected = complaint.id === activeComplaint.id;
                return (
                  <tr
                    key={complaint.id}
                    className={`hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all ${
                      isSelected ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {complaint.complaintNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{complaint.victimName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {complaint.victimReference}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{complaint.crimeCategory}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                      ₹{complaint.fraudAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                        {complaint.suspectedAccount}
                      </div>
                      <div className="text-[10px] text-slate-400">{complaint.bankName}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {complaint.incidentLocation}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                          complaint.status === 'Under Investigation'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                            : complaint.status === 'Escalated'
                            ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
                            : complaint.status === 'Resolved'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDetail(complaint)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                          title="View Case Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            onSelectComplaint(complaint);
                            onNavigateTab('transactions');
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-all active:scale-98"
                        >
                          <span>Trace</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Slide-Over Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  {selectedDetail.complaintNumber}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedDetail.victimName} — ₹{selectedDetail.fraudAmount.toLocaleString('en-IN')}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Category</div>
                <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedDetail.crimeCategory}</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Status</div>
                <div className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">{selectedDetail.status}</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Incident Area</div>
                <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{selectedDetail.incidentLocation}</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Suspected Bank</div>
                <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{selectedDetail.bankName}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Suspected Account</div>
              <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedDetail.suspectedAccount}</div>
              <div className="text-slate-500 dark:text-slate-400">{selectedDetail.suspectedAccountName}</div>
            </div>

            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl text-xs border border-blue-100 dark:border-blue-900/60">
              <div className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold uppercase mb-1">
                Modus Operandi Notes
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedDetail.notes}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectComplaint(selectedDetail);
                  setSelectedDetail(null);
                  onNavigateTab('transactions');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <span>Initiate Forensic Money Trail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
