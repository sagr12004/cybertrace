# CyberTrace AI System Architecture Specification

## 1. Executive Summary & Problem Domain

Financial cybercrimes in India (UPI fraud, investment scams, phishing, job scams, OTP theft) operate on lightning-fast fund layering across interconnected mule account networks. Within minutes of fraudulent transfer, money is split and routed across 3 to 7 intermediary bank accounts to evade automated transaction monitoring and freeze orders before being extracted as physical cash at automated teller machines (ATMs).

**CyberTrace AI** solves this critical window of vulnerability by providing:
1. **Real-time Money Trail Decomposition & Graph Centrality Analytics** (tracing multi-hop layering in seconds).
2. **Explainable 7-Stage ATM Withdrawal Prediction Engine** (forecasting high-probability cashout ATM corridors and time windows).
3. **Geospatial GIS & Heatmap Risk Visualizer** (displaying dynamic risk radii, candidate ATM clusters, CCTV health, and patrol routes).
4. **Law Enforcement Dispatch & Section 91 CrPC Interventions** (enabling immediate bank debit freezes and police unit dispatch).
5. **Court-Admissible Tamper-Evident Forensic Audit Ledger** (recording every investigator action and evidence chain).
6. **Gemini 3.8 Flash Powered AI Forensic Copilot** (generating structured case summaries and contextual interrogations).

---

## 2. High-Level Architecture Topology

```
+---------------------------------------------------------------------------------------+
|                                    PRESENTATION LAYER                                 |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  |                             React 19 SPA (Vite + TS)                            |  |
|  |                                                                                 |  |
|  |  +--------------------+  +----------------------+  +-------------------------+  |  |
|  |  |  Executive Command |  |  NCRP/1930 Complaint |  |   Multi-Hop Transaction |  |  |
|  |  |     Dashboard      |  |      Intake Desk     |  |       Flow Visualizer   |  |  |
|  |  +--------------------+  +----------------------+  +-------------------------+  |  |
|  |  +--------------------+  +----------------------+  +-------------------------+  |  |
|  |  |  React Flow Graph  |  |   7-Stage Prediction |  |   GIS Leaflet Heatmap   |  |  |
|  |  |  Topology Analyzer |  |     Engine Studio    |  |     & Geofence Hub      |  |  |
|  |  +--------------------+  +----------------------+  +-------------------------+  |  |
|  |  +--------------------+  +----------------------+  +-------------------------+  |  |
|  |  |  Real-Time Alerts  |  | Investigator Decision|  | Forensic Evidentiary    |  |  |
|  |  |   & Dispatch Deck  |  |  & CrPC Freeze Desk  |  | Report & Audit Ledger   |  |  |
|  |  +--------------------+  +----------------------+  +-------------------------+  |  |
|  +---------------------------------------------------------------------------------+  |
+-------------------------------------------|-------------------------------------------+
                                            | REST API / JSON over HTTP
                                            v
+---------------------------------------------------------------------------------------+
|                                    APPLICATION LAYER                                  |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  |                       Node.js + Express REST Controller                         |  |
|  |                                                                                 |  |
|  |  /api/complaints   /api/transactions   /api/network   /api/predict   /api/hotspots  |  |
|  |  /api/alerts       /api/investigations /api/report    /api/ai/ask    /api/audit     |  |
|  +---------------------------------------------------------------------------------+  |
|                                            |                                          |
|            +-------------------------------+-------------------------------+          |
|            |                               |                               |          |
|            v                               v                               v          |
|  +-------------------+           +-------------------+           +-----------------+  |
|  | 7-Stage Prediction|           |  Graph Analytics  |           | Google GenAI SDK|  |
|  |   ML Pipeline     |           | Engine (Centrality|           | (Gemini 3.8     |  |
|  |  (DBSCAN, Velocity|           |  & Layer Ratios)  |           |  Flash Model)   |  |
|  |  Risk Attribution)|           +-------------------+           +--------|--------+  |
|  +-------------------+                     |                              |           |
+------------|-------------------------------|------------------------------|-----------+
             |                               |                              |
             v                               v                              v
+---------------------------------------------------------------------------------------+
|                                      DATA LAYER                                       |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  |                       In-Memory Fast Engine & Synthetic DB                      |  |
|  |  - Indian Banking Mule Accounts (Layer 1, Layer 2, Aggregation Nodes)           |  |
|  |  - NCRP Incident Records & Modus Operandi Taxonomies                           |  |
|  |  - 110+ Forensic ATM Cash Extraction Records (Bengaluru Metropolitan Region)   |  |
|  |  - ATM Geolocation, Cash Reserve, CCTV Health, & Crime Radius Metadata         |  |
|  |  - Cryptographically Hashed Immutable Forensic Audit Logs                      |  |
|  +---------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------+
```

---

## 3. Detailed Component Architecture

### 3.1 Frontend Presentation Tier (`src/`)
- **React 19 + TypeScript**: Modular components adhering to strict typing and reactive lifecycle states.
- **Tailwind CSS (v4)**: Modern styling framework ensuring clean, professional dark-mode cyber defense UI aesthetics.
- **Interactive Visualizations**:
  - `@xyflow/react` (React Flow): Custom DAG nodes displaying bank logos, transaction amounts, timestamps, KYC alert tags, and layering depth.
  - `leaflet` + OpenStreetMap tiles: High-performance geospatial rendering supporting custom SVG marker pins, dynamic pulsing risk polygons, confidence radius overlays (500m - 2000m), and live heatmap heat points.
  - `recharts`: Time-series withdrawal velocity histograms, 24-hour crime window curves, risk factor radar/bar charts, and breakdown distributions.
  - `lucide-react`: Semantic icon system for law enforcement operations.

### 3.2 Backend Service Tier (`server.ts`)
- **Express Server**: Handles routing, parameter sanitization, rate handling, and stateful lifecycle controls.
- **Vite Middleware in Development**: Rapid hot development environment serving SPA assets while executing live Express routes on port 3000.
- **Production Bundle**: Single-command Node.js runtime serving pre-built static Vite production assets with zero build drift.

### 3.3 Graph Analytics Engine (`src/utils/graphAnalytics.ts`)
The graph engine computes structural indicators to identify laundering hubs and mule orchestrators:
1. **Node Degree**: In-degree $d_{in}(v)$ (inflow accounts) vs. Out-degree $d_{out}(v)$ (outflow dispersion).
2. **Betweenness Centrality**:
   $$C_B(v) = \sum_{s \neq v \neq t} \frac{\sigma_{st}(v)}{\sigma_{st}}$$
   where $\sigma_{st}$ is total shortest paths from $s$ to $t$ and $\sigma_{st}(v)$ is paths through $v$.
3. **Pass-Through Velocity**: Time delta $\Delta t = t_{out} - t_{in}$. Accounts with $\Delta t < 5\text{ mins}$ and pass-through ratio $\frac{\text{Outflow}}{\text{Inflow}} \ge 0.95$ are classified as **Critical Layering Mules**.

---

## 4. The 7-Stage ATM Withdrawal Prediction Pipeline

```
[Complaint & Transaction Inflow]
               │
               ▼
   [Stage 1: Ingestion & Filter] ──────► Filter linked case transactions & mule graph
               │
               ▼
   [Stage 2: Feature Extraction] ──────► Compute Velocity, Layering Depth, Time Delta, Flow Amount
               │
               ▼
   [Stage 3: Spatial Clustering] ──────► Geospatial DBSCAN on historical withdrawal records (ε = 1.5km)
               │
               ▼
   [Stage 4: Multi-Factor Risk]  ──────► Aggregate weighted risk score (0 - 100%)
               │
               ▼
   [Stage 5: Time Window Model]  ──────► Classify extraction urgency (0-6h, 6-12h, 12-24h, 24h+)
               │
               ▼
   [Stage 6: Explainability AI]  ──────► Synthesize attribution breakdown & evidentiary rationale
               │
               ▼
   [Stage 7: Candidate Dispatch] ──────► Select top 3 candidate ATMs + Confidence Radius + PCR Alert
```

### Mathematical Formulation of Multi-Factor Risk Score:
The aggregate cashout probability score $R \in [0, 100]$ is computed as:
$$R = w_{\text{affinity}} \cdot S_{\text{affinity}} + w_{\text{velocity}} \cdot S_{\text{velocity}} + w_{\text{centrality}} \cdot S_{\text{centrality}} + w_{\text{temporal}} \cdot S_{\text{temporal}}$$

Where:
- $w_{\text{affinity}} = 0.35$: Historical ATM extraction affinity of the detected mule syndicate.
- $w_{\text{velocity}} = 0.25$: Layering speed (faster hop times correlate with expedited cash extraction).
- $w_{\text{centrality}} = 0.20$: Account position in the money-trail graph (proximity to cash consolidation nodes).
- $w_{\text{temporal}} = 0.20$: Match against the 24-hour diurnal withdrawal peak curves (18:00 - 22:00 IST).

---

## 5. Security, Auditability, and Legal Compliance

1. **Investigator-in-the-Loop Safeguard**: Automated predictions never trigger binding real-world freezes unilaterally; all freeze actions require human investigator authorization under Section 91 of the Code of Criminal Procedure (CrPC).
2. **Immutable Forensic Ledger**: Every login, search, prediction trigger, freeze request, and report export is timestamped, signed with the investigator's badge ID and role, and appended to the tamper-evident audit ledger.
3. **Privacy & Data Ethics**: All data provided in this reference build is synthetic, purpose-built for the Smart India Hackathon, and contains zero real PII or live banking credentials.

---

## 6. Directory Structure Overview

```
cybertrace/
├── index.html                   # HTML entry point with synchronized metadata & OpenGraph tags
├── package.json                 # Project dependencies and script definitions
├── server.ts                    # Full-stack Express API controller and Vite server
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler configuration with Tailwind CSS plugin
├── metadata.json                # AI Studio application metadata and capabilities
├── ARCHITECTURE.md              # Detailed architectural design and system specification
├── README.md                    # Primary documentation, quick start, and demo pitch script
└── src/
    ├── App.tsx                  # Primary React application shell and navigation state
    ├── main.tsx                 # React DOM mount point
    ├── index.css                # Global CSS rules and Tailwind CSS directives
    ├── components/
    │   ├── copilot/             # AI Forensic Copilot drawer & chat components
    │   └── layout/              # Header, Sidebar, and Breadcrumb components
    ├── data/
    │   └── mockData.ts          # Forensic dataset: complaints, mules, ATMs, withdrawals, logs
    ├── pages/
    │   ├── AlertsPage.tsx             # Real-time alert feed and dispatch operations
    │   ├── BlockchainLedgerPage.tsx   # Cryptographic immutable audit trail view
    │   ├── ComplaintsPage.tsx         # NCRP/1930 complaint triage and intake
    │   ├── DashboardPage.tsx          # Executive command KPI overview & quick demo launcher
    │   ├── GisMapPage.tsx             # Leaflet GIS interactive map with heatmap layers
    │   ├── HistoricalWithdrawalsPage.tsx # ATM withdrawal telemetry & 24h charts
    │   ├── InvestigationsPage.tsx     # Investigation case files & CrPC decision desk
    │   ├── LoginPage.tsx              # Role-based investigator authentication
    │   ├── NetworkGraphPage.tsx       # React Flow money-trail graph analyzer
    │   ├── PredictionPage.tsx         # 7-Stage ATM cashout prediction studio
    │   ├── ReportsPage.tsx            # Evidentiary FIR & money-trail report generator
    │   └── SettingsPage.tsx           # System configuration, API keys, & reset controls
    ├── services/
    │   └── api.ts               # Typed client-side API layer communicating with Express backend
    ├── types/
    │   └── index.ts             # Comprehensive TypeScript data interfaces
    └── utils/
        ├── graphAnalytics.ts    # Graph centrality and topological sorting algorithms
        └── predictionEngine.ts  # 7-stage explainable ATM prediction algorithm
```
