import React, { useEffect, useState } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AiCopilotDrawer } from './components/ai/AiCopilotDrawer';
import { NewComplaintModal } from './components/complaints/NewComplaintModal';

import { DashboardPage } from './pages/DashboardPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { NetworkGraphPage } from './pages/NetworkGraphPage';
import { HistoricalWithdrawalsPage } from './pages/HistoricalWithdrawalsPage';
import { PredictionPage } from './pages/PredictionPage';
import { GisMapPage } from './pages/GisMapPage';
import { AlertsPage } from './pages/AlertsPage';
import { InvestigationsPage } from './pages/InvestigationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

import {
  ATM_LOCATIONS,
  CURRENT_INVESTIGATOR,
  HISTORICAL_WITHDRAWALS,
  INITIAL_ACCOUNTS,
  INITIAL_ALERTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_COMPLAINTS,
  INITIAL_INVESTIGATIONS,
  INITIAL_PREDICTIONS,
  INITIAL_TRANSACTIONS,
} from './data/mockData';
import {
  Account,
  Alert,
  AlertStatus,
  AtmLocation,
  AuditLog,
  Complaint,
  Investigation,
  TimeWindow,
  Transaction,
  User,
  WithdrawalPrediction,
  WithdrawalRecord,
} from './types';
import { api } from './services/api';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(CURRENT_INVESTIGATOR);

  // Active Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');

  // Core Data States
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [activeComplaint, setActiveComplaint] = useState<Complaint>(INITIAL_COMPLAINTS[0]);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [atms, setAtms] = useState<AtmLocation[]>(ATM_LOCATIONS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(HISTORICAL_WITHDRAWALS);
  const [predictions, setPredictions] = useState<WithdrawalPrediction[]>(INITIAL_PREDICTIONS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [investigations, setInvestigations] = useState<Investigation[]>(INITIAL_INVESTIGATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // UI Modals
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  // Initialize data from API
  useEffect(() => {
    async function loadInitial() {
      try {
        const [complaintsData, txnsData, atmsData, alertsData, health] = await Promise.all([
          api.getComplaints(),
          api.getTransactions(),
          api.getAtms(),
          api.getAlerts(),
          api.getHealth(),
        ]);
        if (complaintsData?.length) {
          setComplaints(complaintsData);
          setActiveComplaint(complaintsData[0]);
        }
        if (txnsData?.length) setTransactions(txnsData);
        if (atmsData?.length) setAtms(atmsData);
        if (alertsData?.length) setAlerts(alertsData);
        if (health) setHealthStatus(health);
      } catch (err) {
        console.warn('Backend API connection offline, running on synchronized local mock engine:', err);
      }
    }
    loadInitial();
  }, []);

  // Compute active prediction
  const currentPrediction =
    predictions.find((p) => p.complaintId === activeComplaint.id) || predictions[0];

  // Compute active investigation
  const currentInvestigation =
    investigations.find((i) => i.complaintId === activeComplaint.id) || {
      id: `INV-${activeComplaint.id}`,
      complaintId: activeComplaint.id,
      investigatorId: currentUser?.id || 'USR-INSP-409',
      investigatorName: currentUser?.name || 'Insp. Rajesh Varma',
      status: 'Active',
      notes: [`Investigation file initialized for complaint ${activeComplaint.complaintNumber}.`],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

  // Filter audit logs for active complaint
  const activeAuditLogs = auditLogs.filter(
    (l) => l.complaintId === activeComplaint.id || l.investigationId === currentInvestigation.id
  );

  // --- ACTIONS ---

  // Load Primary Demo Scenario (₹50k UPI Fraud)
  const handleLoadDemoScenario = () => {
    const demoComplaint = complaints.find((c) => c.complaintNumber === 'CYBER-2026-0842') || complaints[0];
    setActiveComplaint(demoComplaint);
    setCurrentTab('overview');
  };

  // Register New Complaint
  const handleRegisterComplaint = async (data: Partial<Complaint>) => {
    try {
      const created = await api.createComplaint(data);
      setComplaints((prev) => [created, ...prev]);
      setActiveComplaint(created);

      // Create new investigation & audit log entry
      const newInv: Investigation = {
        id: `INV-${created.id}`,
        complaintId: created.id,
        investigatorId: currentUser?.id || 'USR-INSP-409',
        investigatorName: currentUser?.name || 'Insp. Rajesh Varma',
        status: 'Active',
        notes: [`Initial cybercrime complaint ${created.complaintNumber} registered.`],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      setInvestigations((prev) => [newInv, ...prev]);

      const log: AuditLog = {
        id: `AUD-${Date.now()}`,
        investigationId: newInv.id,
        complaintId: created.id,
        userId: currentUser?.id || 'USR-INSP-409',
        userName: currentUser?.name || 'Insp. Rajesh Varma',
        userRole: currentUser?.role || 'Senior Cybercrime Investigator',
        action: 'COMPLAINT_REGISTERED',
        details: `Registered complaint ${created.complaintNumber} for ₹${created.fraudAmount.toLocaleString('en-IN')}`,
        ipAddress: '10.14.22.84',
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prev) => [log, ...prev]);

      setCurrentTab('transactions');
    } catch (err) {
      console.error('Failed to create complaint:', err);
    }
  };

  // Run ML Prediction Engine
  const handleRunPrediction = async (customTimeWindow?: TimeWindow): Promise<WithdrawalPrediction> => {
    const result = await api.runPrediction(activeComplaint.id, customTimeWindow);
    setPredictions((prev) => [result, ...prev.filter((p) => p.id !== result.id)]);

    // Check if alert should be dispatched
    if (result.riskScore >= 70) {
      const existing = alerts.find((a) => a.complaintId === activeComplaint.id && a.status !== 'Resolved');
      if (!existing) {
        const newAlert: Alert = {
          id: `ALT-${Date.now().toString().slice(-6)}`,
          complaintId: activeComplaint.id,
          complaintNumber: activeComplaint.complaintNumber,
          predictionId: result.id,
          title: `High-Risk Cashout Imminent - ${result.predictedZone}`,
          predictedArea: result.candidateAtms[0]?.area || result.predictedZone,
          candidateAtm: result.candidateAtms[0]?.name || 'ATM Cluster',
          riskScore: result.riskScore,
          riskCategory: result.riskCategory,
          timeWindow: result.timeWindowBucket,
          alertType: 'High-Velocity Cashout Risk',
          status: 'New',
          assignedUnit: 'Bengaluru South Cyber Police Patrol / SBI Nodal Desk',
          supportingEvidence: result.explanation,
          createdAt: new Date().toISOString(),
        };
        setAlerts((prev) => [newAlert, ...prev]);
      }
    }

    return result;
  };

  // Save Prediction to Investigation
  const handleSavePrediction = (pred: WithdrawalPrediction) => {
    const note = `Prediction ${pred.id} committed: ${pred.riskScore}% risk score for ${pred.predictedZone} (Time Window: ${pred.timeWindowBucket}).`;
    handleAddInvestigationNote(note);
  };

  // Update Alert Status
  const handleUpdateAlertStatus = async (alertId: string, status: AlertStatus) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status } : a))
    );
    try {
      await api.updateAlert(alertId, { status });
    } catch (e) {
      // client updated
    }
  };

  // Investigation Actions (Approve, Reject, Escalate, Freeze)
  const handleInvestigationAction = async (actionTaken: string, details?: string) => {
    const updated = await api.updateInvestigation(activeComplaint.id, {
      actionTaken,
      note: details,
    });

    setInvestigations((prev) =>
      prev.map((inv) => (inv.complaintId === activeComplaint.id ? updated : inv))
    );

    const log: AuditLog = {
      id: `AUD-${Date.now()}`,
      investigationId: updated.id,
      complaintId: activeComplaint.id,
      userId: currentUser?.id || 'USR-INSP-409',
      userName: currentUser?.name || 'Insp. Rajesh Varma',
      userRole: currentUser?.role || 'Senior Cybercrime Investigator',
      action: `DECISION_${actionTaken.toUpperCase().replace(/\s+/g, '_')}`,
      details: details || actionTaken,
      ipAddress: '10.14.22.84',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Add Case Note
  const handleAddInvestigationNote = async (noteText: string) => {
    const updated = await api.updateInvestigation(activeComplaint.id, {
      note: noteText,
    });
    setInvestigations((prev) =>
      prev.map((inv) => (inv.complaintId === activeComplaint.id ? updated : inv))
    );

    const log: AuditLog = {
      id: `AUD-${Date.now()}`,
      investigationId: updated.id,
      complaintId: activeComplaint.id,
      userId: currentUser?.id || 'USR-INSP-409',
      userName: currentUser?.name || 'Insp. Rajesh Varma',
      userRole: currentUser?.role || 'Senior Cybercrime Investigator',
      action: 'CASE_NOTE_RECORDED',
      details: noteText,
      ipAddress: '10.14.22.84',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Freeze Request from Transactions page
  const handleFreezeRequest = (txnRef: string, accountRef: string) => {
    handleInvestigationAction(
      'Account Freeze Request Issued',
      `Issued Section 91 CrPC notice for ${accountRef} associated with txn ${txnRef}`
    );
  };

  // Reset Demo State
  const handleResetDemo = async () => {
    await api.resetDemo();
    setComplaints(INITIAL_COMPLAINTS);
    setActiveComplaint(INITIAL_COMPLAINTS[0]);
    setTransactions(INITIAL_TRANSACTIONS);
    setAccounts(INITIAL_ACCOUNTS);
    setAtms(ATM_LOCATIONS);
    setWithdrawals(HISTORICAL_WITHDRAWALS);
    setPredictions(INITIAL_PREDICTIONS);
    setAlerts(INITIAL_ALERTS);
    setInvestigations(INITIAL_INVESTIGATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentTab('overview');
  };

  // Render Login page if logged out
  if (!currentUser) {
    return <LoginPage onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        alerts={alerts}
        onOpenAi={() => setIsAiOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          complaints={complaints}
          activeComplaint={activeComplaint}
          onSelectComplaint={(c) => setActiveComplaint(c)}
          onLoadDemoScenario={handleLoadDemoScenario}
          onOpenNewComplaintModal={() => setIsNewComplaintOpen(true)}
          onOpenAi={() => setIsAiOpen(true)}
          onOpenAlerts={() => setCurrentTab('alerts')}
          currentUser={currentUser}
          alerts={alerts}
        />

        {/* Tab Pages */}
        <main className="flex-1 overflow-y-auto bg-slate-50/70 dark:bg-[#060a12] transition-colors duration-300">
          {currentTab === 'overview' && (
            <DashboardPage
              complaints={complaints}
              transactions={transactions}
              predictions={predictions}
              alerts={alerts}
              onSelectComplaint={(c) => setActiveComplaint(c)}
              onNavigateTab={setCurrentTab}
              onLoadDemoScenario={handleLoadDemoScenario}
            />
          )}

          {currentTab === 'complaints' && (
            <ComplaintsPage
              complaints={complaints}
              activeComplaint={activeComplaint}
              onSelectComplaint={(c) => setActiveComplaint(c)}
              onOpenNewComplaintModal={() => setIsNewComplaintOpen(true)}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'transactions' && (
            <TransactionsPage
              transactions={transactions}
              activeComplaint={activeComplaint}
              onNavigateTab={setCurrentTab}
              onFreezeRequest={handleFreezeRequest}
            />
          )}

          {currentTab === 'network' && (
            <NetworkGraphPage
              accounts={accounts}
              transactions={transactions}
              activeComplaint={activeComplaint}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'withdrawals' && (
            <HistoricalWithdrawalsPage
              withdrawals={withdrawals}
              atms={atms}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'prediction' && (
            <PredictionPage
              activeComplaint={activeComplaint}
              currentPrediction={currentPrediction}
              onRunPrediction={handleRunPrediction}
              onNavigateTab={setCurrentTab}
              onSaveToInvestigation={handleSavePrediction}
            />
          )}

          {currentTab === 'map' && (
            <GisMapPage
              atms={atms}
              predictions={predictions}
              activeComplaint={activeComplaint}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              complaints={complaints}
              onUpdateAlertStatus={handleUpdateAlertStatus}
              onSelectComplaint={(c) => setActiveComplaint(c)}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'investigations' && (
            <InvestigationsPage
              activeComplaint={activeComplaint}
              investigation={currentInvestigation}
              currentPrediction={currentPrediction}
              auditLogs={activeAuditLogs}
              onTakeAction={handleInvestigationAction}
              onAddNote={handleAddInvestigationNote}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsPage
              activeComplaint={activeComplaint}
              investigation={currentInvestigation}
              transactions={transactions.filter((t) => t.complaintId === activeComplaint.id)}
              prediction={currentPrediction}
              auditLogs={activeAuditLogs}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              currentUser={currentUser}
              onResetDemo={handleResetDemo}
              healthStatus={healthStatus}
            />
          )}
        </main>
      </div>

      {/* AI Copilot Drawer */}
      <AiCopilotDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        activeComplaint={activeComplaint}
        activePrediction={currentPrediction}
        onAddNoteToInvestigation={handleAddInvestigationNote}
      />

      {/* Register Complaint Modal */}
      <NewComplaintModal
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
        onSubmit={handleRegisterComplaint}
      />
    </div>
  );
}
