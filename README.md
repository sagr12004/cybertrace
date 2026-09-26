# CyberTrace AI: Cybercrime Investigation & Financial Withdrawal Prediction Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS_Maps-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![React Flow](https://img.shields.io/badge/React_Flow-Topology_Graphs-FF0072)](https://reactflow.dev/)
[![Gemini](https://img.shields.io/badge/Gemini_3.8_Flash-AI_Copilot-8E75FF?logo=google&logoColor=white)](https://ai.google.dev/)

> **Smart India Hackathon (SIH) High-Impact Prototype**  
> An end-to-end cybercrime intelligence, multi-hop money-trail forensic tracing, geospatial risk heatmap, and explainable ATM withdrawal prediction platform designed for Indian law enforcement agencies (State Cyber Cells, CID, and Central Law Enforcement).

---

## Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [System Architecture & Workflow](#2-system-architecture--workflow)
3. [Core Modules & Capabilities](#3-core-modules--capabilities)
   - [1. Executive Command Dashboard](#1-executive-command-dashboard)
   - [2. NCRP / 1930 Incident Intake & Triage](#2-ncrp--1930-incident-intake--triage)
   - [3. Multi-Hop Money Trail & Layering Visualizer](#3-multi-hop-money-trail--layering-visualizer)
   - [4. Account Network Topology & Centrality Analytics](#4-account-network-topology--centrality-analytics)
   - [5. Historical ATM Withdrawal Telemetry & Diurnal Trends](#5-historical-atm-withdrawal-telemetry--diurnal-trends)
   - [6. 7-Stage Explainable ATM Prediction Engine](#6-7-stage-explainable-atm-prediction-engine)
   - [7. Geospatial GIS & Heatmap Risk Visualizer](#7-geospatial-gis--heatmap-risk-visualizer)
   - [8. Real-Time Alert Desk & Police Patrol Dispatch](#8-real-time-alert-desk--police-patrol-dispatch)
   - [9. Investigator Decision & Section 91 CrPC Freezes](#9-investigator-decision--section-91-crpc-freezes)
   - [10. Court-Ready Evidentiary Reports & Audit Ledger](#10-court-ready-evidentiary-reports--audit-ledger)
   - [11. AI Forensic Copilot (Gemini 3.8 Flash)](#11-ai-forensic-copilot-gemini-38-flash)
4. [Mathematical & Algorithmic Foundations](#4-mathematical--algorithmic-foundations)
5. [API Reference](#5-api-reference)
6. [Quick Start & Installation Guide](#6-quick-start--installation-guide)
7. [5-Minute SIH Demo & Evaluation Script](#7-5-minute-sih-demo--evaluation-script)
8. [Ethical Notice & Synthetic Data](#8-ethical-notice--synthetic-data)

---

## 1. Executive Summary & Problem Statement

Financial fraud syndicates in India (phishing, investment scams, digital arrest fraud, OTP extortion) exploit the speed of instant settlement systems like UPI and IMPS. Stolen funds are rapidly fragmented through multiple layers of "mule accounts" (Layer 1 $\rightarrow$ Layer 2 $\rightarrow$ Aggregation Nodes) within minutes to evade freeze notices before being extracted as physical cash at automated teller machines (ATMs).

### The Critical Gap:
- **Traditional investigation is reactive**: Bank transaction logs arrive hours or days after the cash is already withdrawn.
- **Mule networks are distributed**: Identifying cash consolidation hubs requires tedious cross-bank manual ledger stitching.
- **Predictive intervention is missing**: Law enforcement lacks automated tools to anticipate **which ATM corridors** and **at what time windows** the syndicate will extract physical cash.

### The CyberTrace AI Solution:
**CyberTrace AI** delivers a unified intelligence workstation combining **graph centrality metrics**, **spatial density clustering (DBSCAN)**, **velocity scoring**, and **Google Gemini 3.8 Flash AI** to trace fund flows and predict cashout events in advance, empowering police dispatch and bank nodal officers to intercept cashouts before funds vanish.

---

## 2. System Architecture & Workflow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CYBERTRACE AI PLATFORM                               │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
  ┌────────────────────────────────────────┼────────────────────────────────────────┐
  ▼                                        ▼                                        ▼
┌───────────────────────┐        ┌───────────────────────┐        ┌───────────────────────┐
│     DATA INGESTION    │        │   ANALYTICS ENGINE    │        │  INTELLIGENCE OUTPUT  │
├───────────────────────┤        ├───────────────────────┤        ├───────────────────────┤
│ • NCRP 1930 Feeds     │  ───►  │ • Graph Centrality    │  ───►  │ • GIS Heatmap Corridors│
│ • Bank UPI / IMPS Logs│        │ • Multi-Hop Layering  │        │ • ATM Risk Hotspots   │
│ • Synthetic ATM Logs  │        │ • DBSCAN Clustering   │        │ • Patrol Dispatch Deck│
│ • KYC Discrepancy Data│        │ • 7-Stage Risk Engine │        │ • CrPC Freeze Notices │
│ • CCTV & Cash Telemetry│       │ • Gemini 3.8 Copilot  │        │ • Court Reports (PDF) │
└───────────────────────┘        └───────────────────────┘        └───────────────────────┘
```

### Architectural Highlights:
- **Frontend**: Single-page application built on React 19, TypeScript, Tailwind CSS, Leaflet GIS, React Flow (`@xyflow/react`), and Recharts.
- **Backend API**: Express RESTful backend with live endpoints serving transaction metrics, graph topology, geospatial hotspots, and audit logs.
- **AI Intelligence**: Server-side Google GenAI SDK integration with Gemini 3.8 Flash and deterministic, zero-dependency offline forensic fallback.
- **Full Architecture Documentation**: Detailed design specs, UML diagrams, and data contracts are documented in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## 3. Core Modules & Capabilities

### 1. Executive Command Dashboard
- High-level KPIs: Active Complaints, High-Risk Alerts, At-Risk Capital, Monitored ATM Corridors.
- Crime Category Breakdown (UPI Fraud, Phishing, Investment Schemes, SIM Swaps).
- 1-Click Primary Demo Launcher: Auto-loads high-priority case `CYBER-2026-0842` (₹50,000 UPI fraud).

### 2. NCRP / 1930 Incident Intake & Triage
- Law-enforcement complaint registry aligned with India's National Cyber Crime Reporting Portal.
- Search, filter by crime category, risk tier, and status.
- Add new complaint with auto-generated case IDs, investigator assignment, and initial audit trail entry.

### 3. Multi-Hop Money Trail & Layering Visualizer
- Chronological breakdown of fund movements across Layer 1 mules, Layer 2 splits, and cash hubs.
- Velocity calculation (minutes elapsed between hops).
- 1-Click Section 91 CrPC Bank Freeze button with real-time status update.

### 4. Account Network Topology & Centrality Analytics
- Interactive canvas powered by React Flow with custom node cards.
- Computes node degree, in-degree, out-degree, and betweenness centrality.
- Visual highlight of suspect pass-through mule nodes vs. cash consolidation hubs.

### 5. Historical ATM Withdrawal Telemetry & Diurnal Trends
- Synthetic telemetry of 110+ cash withdrawals across South and Central Bengaluru.
- 24-hour diurnal withdrawal curve highlighting peak syndicate activity windows (18:00–22:00 IST).
- Correlation between withdrawal frequencies, withdrawal amounts, and bank branch networks.

### 6. 7-Stage Explainable ATM Prediction Engine
- Real-time pipeline execution:
  1. Data Ingestion & Sanitization
  2. Feature Engineering (Velocity, Hop Delays, Amounts)
  3. Spatial DBSCAN Density Clustering
  4. Multi-Factor Risk Calculation (0–100%)
  5. Diurnal Time-Window Forecasting (0–6h, 6–12h, 12–24h)
  6. Explainable AI Factor Attribution Breakdown
  7. Candidate ATM Dispatch Scoring
- Transparent factor breakdown: Historical ATM Affinity (35%), Layering Velocity (25%), Graph Centrality (20%), Time-of-Day Match (20%).

### 7. Geospatial GIS & Heatmap Risk Visualizer
- Interactive Leaflet OpenStreetMap view with custom cybercrime styling.
- **Dynamic Geospatial Heatmap Layer**: High-density withdrawal clusters rendered with smooth Gaussian heat intensity gradients.
- Confidence radius geofence circles (500m to 2,000m) around candidate cashout hubs.
- ATM pin telemetry: Cash reserve status, CCTV health, and historical fraud counts.

### 8. Real-Time Alert Desk & Police Patrol Dispatch
- Priority alert feeds automatically generated when risk scores exceed the 70% threshold.
- Assign alert to field patrol units (PCR Vans, Cyber Crime Field Units, Bank Nodal Vigilance).
- Status workflow: New $\rightarrow$ Dispatched $\rightarrow$ Under Surveillance $\rightarrow$ Intercepted / Resolved.

### 9. Investigator Decision & Section 91 CrPC Freezes
- Formal investigator-in-the-loop decision console.
- Actions: Approve Surveillance, Issue Section 91 CrPC Notice, Escalate to State CID, Close Case.
- Case notes append-only chronological log.

### 10. Court-Ready Evidentiary Reports & Audit Ledger
- Official formatted First Information & Money-Trail Tracing Report.
- Export as printable court-admissible PDF or export raw transaction data as CSV.
- Cryptographically timestamped, tamper-evident audit ledger tracking every investigator query.

### 11. AI Forensic Copilot (Gemini 3.8 Flash)
- Grounded contextual analysis powered by Google Gemini 3.8 Flash.
- Auto-generates 3-part structured executive summaries, money movement modus operandi, and priority investigative recommendations.
- Interactive question-answering drawer for real-time natural language case interrogation.

---

## 4. Mathematical & Algorithmic Foundations

### Risk Score Formulation
The composite risk score $R \in [0, 100]$ for any candidate ATM zone is calculated via:

$$R = \min\left(100, \sum_{i=1}^{n} w_i \cdot S_i\right)$$

| Factor ($i$) | Weight ($w_i$) | Signal Description ($S_i$) |
|:---|:---:|:---|
| **Historical Affinity** | 0.35 | Density of prior syndicate withdrawals within radius $\epsilon = 1.5\text{ km}$ |
| **Layering Velocity** | 0.25 | Inverse of inter-hop elapsed duration ($\Delta t < 5\text{ mins} \rightarrow 100\text{ pts}$) |
| **Network Centrality** | 0.20 | Normalized betweenness centrality and proximity to cash consolidation hubs |
| **Temporal Affinity** | 0.20 | Proximity to empirical peak extraction hours ($18:00 - 22:00\text{ IST}$) |

---

## 5. API Reference

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/health` | System health, database state, and Gemini configuration |
| `GET` | `/api/complaints` | Retrieve complaints with category/status/search query params |
| `POST` | `/api/complaints` | Intake and register a new cybercrime complaint |
| `GET` | `/api/complaints/:id` | Get individual complaint details |
| `GET` | `/api/complaints/:id/transactions` | Retrieve all money trail transactions for a case |
| `GET` | `/api/complaints/:id/network` | Compute graph nodes, edges, and centrality metrics |
| `GET` | `/api/complaints/:id/withdrawals` | Retrieve associated ATM withdrawal history |
| `POST` | `/api/complaints/:id/predict` | Trigger 7-stage ATM cashout prediction pipeline |
| `GET` | `/api/atms` | Retrieve ATM locations, cash levels, and CCTV telemetry |
| `GET` | `/api/hotspots` | Retrieve geospatial candidate hotspot predictions |
| `GET` | `/api/alerts` | Get real-time dispatch alerts |
| `POST` | `/api/alerts` | Create new alert |
| `PATCH` | `/api/alerts/:id` | Update alert status, assigned unit, or notes |
| `GET` | `/api/investigations/:id` | Fetch investigation case file |
| `PATCH` | `/api/investigations/:id` | Record investigator decision and add forensic notes |
| `GET` | `/api/investigations/:id/report` | Generate comprehensive court-ready report JSON |
| `GET` | `/api/audit` | Query cryptographic audit trail |
| `POST` | `/api/ai/summarize` | Generate Gemini 3.8 Flash case summary |
| `POST` | `/api/ai/ask` | Natural language case question answering |
| `POST` | `/api/demo/reset` | Reset state to clean default demo scenario |

---

## 6. Quick Start & Installation Guide

### Prerequisites
- Node.js version 18.0.0 or higher
- npm version 9.0.0 or higher (or Bun / yarn / pnpm)
- (Optional) `GEMINI_API_KEY` for Google GenAI Copilot features

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sagr12004/cybertrace.git
   cd cybertrace
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   *(Optional)* Add your Gemini API key inside `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
   *Note: If no API key is supplied, CyberTrace AI seamlessly activates its deterministic local forensic intelligence engine.*

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 7. 5-Minute SIH Demo & Evaluation Script

Follow this structured presentation flow during hackathon evaluations:

1. **Minute 1: Dashboard & Case Intake**
   - Show Executive Dashboard metrics. Click **"Launch Primary Demo"** to load `CYBER-2026-0842`.
   - Explain how the victim reported a ₹50,000 fraudulent UPI transfer through NCRP.

2. **Minute 2: Multi-Hop Trail & Account Network**
   - Open **Transactions** tab. Highlight rapid layering ($< 4\text{ mins}$) into mule accounts `ACC-MULE-4089` and `ACC-MULE-4102`.
   - Switch to **Network Graph**. Explain how the React Flow topology pinpoints `ACC-CASH-7721` as the high-betweenness cash hub.
   - Click **Freeze Account** under Section 91 CrPC.

3. **Minute 3: 7-Stage Prediction Pipeline**
   - Navigate to **Prediction Engine**.
   - Run the 7-stage pipeline. Highlight the **88% High Risk Score** calculated for **SBI Koramangala 5th Block** within the **0-6 hours** window.
   - Walk through the explainability factors (Affinity 35%, Velocity 25%, Centrality 20%, Diurnal 20%).

4. **Minute 4: GIS Heatmap & Police Dispatch**
   - Switch to **GIS Map**.
   - Toggle the **Geospatial Heatmap Layer** to show historical cash extraction clusters across Bengaluru South.
   - Review the candidate ATM marker: CCTV health (Operational), cash reserve (₹4.2L), and confidence radius ($1,200\text{m}$).
   - Go to **Alerts** and click **Dispatch Units** to assign Bengaluru South Cyber Patrol.

5. **Minute 5: Court Report & AI Copilot**
   - Open **Investigation Report**. Demonstrate the court-ready printable FIR & Money Trail document with PDF/CSV export.
   - Open **AI Copilot Drawer** and ask: *"Why is ACC-MULE-4011 flagged as high risk?"* Show real-time case-grounded forensic response.

---

## 8. Ethical Notice & Synthetic Data

All complaints, account numbers, names, and transaction values presented in this application are **synthetic demo artifacts** created specifically for the Smart India Hackathon. They do not represent real-world bank records or ongoing judicial cases. Predictions are intended strictly as decision-support leads requiring human investigator verification.

---


