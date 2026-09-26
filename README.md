# CyberTrace AI: Predictive Analytics & Multi-Hop Money-Trail Forensic Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.14_|_Scikit--Learn-3776AB?logo=python&logoColor=white)](https://scikit-learn.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS_Maps-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![React Flow](https://img.shields.io/badge/React_Flow-Topology_Graphs-FF0072)](https://reactflow.dev/)
[![Gemini](https://img.shields.io/badge/Gemini_3.8_Flash-AI_Copilot-8E75FF?logo=google&logoColor=white)](https://ai.google.dev/)
[![Unlazy Verified](https://img.shields.io/badge/Unlazy_Discipline-14%2F14_Gates_Met-10B981?logo=checkmarx&logoColor=white)](./GATES.md)

> **Smart India Hackathon (SIH) — Problem Statement PS 26184 / SIH26184**  
> **Predictive Analytics Framework for Cybercrime Complaints**  
> An end-to-end, multi-agency cyber intelligence platform designed for Indian Law Enforcement Agencies (State Cyber Cells, CID, I4C) and Banking Vigilance Desks. Tracks multi-hop UPI/IMPS mule networks, predicts physical ATM cashout corridors using calibrated Machine Learning rankers, issues statutory Section 91 & 102 CrPC legal freezes, and automates real-time CFCFRMS lien-marking within the critical golden hour.

---

## Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Platform Architecture & Data Flow](#2-platform-architecture--data-flow)
3. [Core Modules & Operational Desks](#3-core-modules--operational-desks)
   - [1. Executive Command Overview](#1-executive-command-overview)
   - [2. Bank Nodal Officer Desk (CFCFRMS / S.102 CrPC)](#2-bank-nodal-officer-desk-cfcfrms--s102-crpc)
   - [3. National I4C Coordinator Desk (Inter-State Flow)](#3-national-i4c-coordinator-desk-inter-state-flow)
   - [4. NCRP Incident Intake & Triage](#4-ncrp-incident-intake--triage)
   - [5. Multi-Hop Money Trail & Layering Visualizer](#5-multi-hop-money-trail--layering-visualizer)
   - [6. Mule Network Topology & Centrality Analytics](#6-mule-network-topology--centrality-analytics)
   - [7. Machine Learning ATM Withdrawal Predictor](#7-machine-learning-atm-withdrawal-predictor)
   - [8. Geospatial GIS & Heatmap Risk Visualizer](#8-geospatial-gis--heatmap-risk-visualizer)
   - [9. Real-Time Alert Dispatch & Patrol Coordination](#9-real-time-alert-dispatch--patrol-coordination)
   - [10. Investigation Casefile & Legal Freezes](#10-investigation-casefile--legal-freezes)
   - [11. Court-Ready Evidentiary Dossier & FIR Generator](#11-court-ready-evidentiary-dossier--fir-generator)
   - [12. Bharat-Chain Consortium Forensic Ledger](#12-bharat-chain-consortium-forensic-ledger)
   - [13. AI Forensic Copilot (Gemini 3.8 Flash)](#13-ai-forensic-copilot-gemini-38-flash)
4. [Machine Learning & Leakage-Safe Evaluation Suite](#4-machine-learning--leakage-safe-evaluation-suite)
   - [Feature Engineering Pipeline](#feature-engineering-pipeline)
   - [Walk-Forward Chronological Validation Results](#walk-forward-chronological-validation-results)
5. [Controllable Synthetic Event Stream Simulator](#5-controllable-synthetic-event-stream-simulator)
6. [Complete REST API Reference](#6-complete-rest-api-reference)
7. [Installation & Verification Guide](#7-installation--verification-guide)
8. [5-Minute SIH Jury Demonstration Script](#8-5-minute-sih-jury-demonstration-script)
9. [Ethical Notice & Synthetic Data Provenance](#9-ethical-notice--synthetic-data-provenance)

---

## 1. Executive Summary & Problem Statement

Financial fraud syndicates in India (phishing, investment scams, digital arrest schemes, fake loan APK extortion) exploit the instant settlement of UPI and IMPS. Stolen funds are rapidly fragmented across multiple layers of mule accounts (Layer 1 $\rightarrow$ Layer 2 $\rightarrow$ Consolidation Hubs) within minutes before being extracted as physical cash at automated teller machines (ATMs).

### The Critical Challenges Faced by LEAs:
- **Reactive Investigation Deficit**: Traditional bank logs arrive hours or days after physical cash extraction.
- **The Golden Hour Gap**: The first 60 minutes after a fraud complaint are critical for fund recovery; delayed inter-bank coordination allows cash liquidation.
- **Inter-State Jurisdictional Friction**: Syndicates operate across multiple states (e.g. Victim in Bengaluru, Call Center in Delhi/Mewat, Tech Infrastructure in Jamtara, Cashout in Mumbai), confounding single-jurisdiction investigators.
- **Lack of Predictive Spatial Intelligence**: Law enforcement lacks automated tools to anticipate **which ATM corridors** and **at what time horizons** mules will attempt cash withdrawals.

### The CyberTrace AI Solution:
CyberTrace AI delivers a unified predictive cybercrime intelligence workstation combining:
1. **Learned ML Candidate Ranking**: Gradient Boosting ensemble with Sigmoid Platt probability calibration scoring candidate ATM corridors.
2. **Leakage-Safe Walk-Forward Benchmarks**: Validated chronological evaluation demonstrating **Precision@5 of 100%** and **MRR of 0.828** over historical and proximity baselines.
3. **CFCFRMS Real-Time Lien-Marking Queue**: Empowers Bank Nodal Officers to execute Section 102 CrPC debit freezes and disarm targeted ATM cash dispensers.
4. **National I4C Inter-State Operations Desk**: Visualizes cross-state money trails and broadcasts multi-jurisdictional Section 91 CrPC notices.
5. **Tamper-Evident Consortium Blockchain**: Immutable SHA-256 block ledger preserving chain-of-custody proof for judicial admissibility.

---

## 2. Platform Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     CYBERTRACE AI PLATFORM                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                 │
 ┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
 ▼                                               ▼                                               ▼
┌─────────────────────────────┐    ┌─────────────────────────────┐    ┌─────────────────────────────┐
│      INGESTION & STREAM     │    │     ANALYTICS & ML CORE     │    │    STAKEHOLDER VIEWPORTS    │
├─────────────────────────────┤    ├─────────────────────────────┤    ├─────────────────────────────┤
│ • NCRP 1930 Citizen Feeds   │───►│ • Multi-Hop BFS DAG Tracing │───►│ • LEA Investigator Console  │
│ • Bank UPI/IMPS Core Rails  │    │ • Betweenness Centrality    │    │ • Bank Nodal (CFCFRMS Desk) │
│ • Multi-Scenario Simulator: │    │ • 15-Feature ML Vectorizer  │    │ • National I4C Coordinator  │
│   - Stable Urban Hotspots   │    │ • Calibrated ML Ranker      │    │ • Police PCR Field Dispatch │
│   - High-Velocity Bursts    │    │ • Temporal Hazard Horizon   │    │ • CrPC Section 91/102 Desk  │
│   - Cold-Start Locations    │    │ • Gemini 3.8 Forensic Agent │    │ • Bharat-Chain Block Ledger │
└─────────────────────────────┘    └─────────────────────────────┘    └─────────────────────────────┘
```

### Architectural Highlights:
- **Presentation Tier**: Built on React 19, TypeScript 5+, Tailwind CSS v4 (Impeccable Operate design system), Leaflet GIS mapping, and `@xyflow/react` directed acyclic graph visualization.
- **Machine Learning Tier**: Offline-trained `GradientBoostingClassifier` with Sigmoid calibration, feature extractors, and automated walk-forward test suites under `ml/`.
- **Backend API Tier**: Express RESTful server exposing live endpoints for complaints, network analysis, ML ranking inference, simulator scenarios, and audit records under `server.ts`.
- **Consortium Ledger Tier**: Local SHA-256 Merkle-linked blockchain maintaining cryptographically tamper-evident investigation logs.

---

## 3. Core Modules & Operational Desks

### 1. Executive Command Overview
- Unified Intelligence Ribbon displaying real-time metrics: Active Cases, Defrauded Capital, Intercepted Volume, High-Risk Alerts, and Monitored Corridors.
- Crime Category Breakdown (UPI Fraud, Investment Schemes, Digital Arrest, Phishing).
- 1-Click Primary Demonstration Scenario launcher (`CYBER-2026-0842`).

### 2. Bank Nodal Officer Desk (CFCFRMS / S.102 CrPC)
- **Real-Time Lien Queue**: Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) integration queue under Section 102 CrPC.
- **Instant Actions**: One-click "Mark Lien" and "Debit Freeze" on suspect beneficiary accounts.
- **ATM Cash-Kill Recommendations**: Tactical recommendations to reduce withdrawal limits or hold cash dispensers at high-risk ATMs predicted by the ML engine.
- **Compliance Export**: 1-click generation of statutory CFCFRMS Compliance Certificates for banking audit compliance.

### 3. National I4C Coordinator Desk (Inter-State Flow)
- **State-to-State Fund Flow Corridors**: Tracks multi-jurisdictional money trails spanning originating victim states, smurfing transit hubs, and exit liquidation states (e.g. Karnataka $\leftrightarrow$ Jharkhand $\leftrightarrow$ Delhi $\leftrightarrow$ Maharashtra).
- **Syndicate Threat Matrix**: Ranks active criminal collectives by volume, active accounts, and identified mules with severity classifications.
- **Multi-State Police Broadcast**: Direct alert transmission to State Cyber Cell Nodal Officers via the I4C gateway.
- **National Hotspot Index**: Visual density tracker across telecom BTS towers and mule card issuance clusters.

### 4. NCRP Incident Intake & Triage
- Aligned with India's National Cyber Crime Reporting Portal (NCRP) and citizen helpline 1930.
- Search, filter by crime category, risk tier, status, and suspected bank.
- Case registration modal auto-generating unique complaint numbers, investigator assignment, and initial immutable audit log entries.

### 5. Multi-Hop Money Trail & Layering Visualizer
- Reconstructs fund movements across Layer 1 mules, Layer 2 transit nodes, and Layer 3 cashout aggregation accounts.
- Calculates inter-hop velocity and latency between bank transfers.
- Immediate Section 102 CrPC freeze trigger buttons with live audit log updates.

### 6. Mule Network Topology & Centrality Analytics
- Interactive canvas powered by React Flow with custom institutional nodes.
- Graph analytics computing in-degree, out-degree, and betweenness centrality.
- Pinpoints cash consolidation hubs versus pass-through smurfing mules.

### 7. Machine Learning ATM Withdrawal Predictor
- Powered by the trained Python Gradient Boosting Ranker (`ml/predict.py`).
- Returns calibrated probability $P(Y=1 \mid X)$, match confidence score (15–96%), and estimated distance for all candidate ATMs.
- **Explainable Factor Attributions**: Transparent breakdown showing exact factor impacts (CCTV Security Health, Historical Syndicate Footprint, Corridor Proximity, Cash Liquidation Capacity).
- **Multi-Horizon Temporal Hazard Distribution**: Forecasts time-to-cashout probabilities across $\le 30\text{m}$, $30\text{--}60\text{m}$, $60\text{--}180\text{m}$, and $> 180\text{m}$.

### 8. Geospatial GIS & Heatmap Risk Visualizer
- Interactive Leaflet OpenStreetMap view with tactical dark/light institutional styling.
- **Dynamic Geospatial Heatmap**: Renders historical fraud density clusters across urban corridors.
- Confidence radius geofence overlays ($500\text{m}$ to $2,000\text{m}$) around candidate ATMs.
- Live police PCR patrol unit tracking with real-time status and estimated time of arrival (ETA).

### 9. Real-Time Alert Dispatch & Patrol Coordination
- Automated priority dispatch alerts triggered when risk scores cross the 70% threshold.
- Assigns alerts to PCR field vans, Cyber Crime quick-reaction teams, or Bank Nodal Vigilance officers.
- Multi-channel notification simulation across SMS, secure email, and mobile terminal webhooks.

### 10. Investigation Casefile & Legal Freezes
- Formal human-in-the-loop decision console.
- Statutory actions: Approve Field Surveillance, Issue Section 91 CrPC CCTV Summons, Issue Section 102 CrPC Freezes, Escalate to State CID.
- Chronological, tamper-evident investigator case notes.

### 11. Court-Ready Evidentiary Dossier & FIR Generator
- Official formatted First Information & Money-Trail Tracing Dossier.
- Printable court-admissible layout with full chain-of-custody metadata, transaction ledgers, and forensic risk assessments.

### 12. Bharat-Chain Consortium Forensic Ledger
- Local consortium blockchain explorer with SHA-256 block hashing and Merkle tree roots.
- Records all statutory legal summons, freeze commitments, and prediction footprints.
- Includes an interactive cryptographic integrity verification tool to detect tampered records.

### 13. AI Forensic Copilot (Gemini 3.8 Flash)
- Grounded contextual intelligence powered by Google Gemini 3.8 Flash SDK.
- Auto-generates structured 3-part executive summaries, money laundering modus operandi, and priority investigative recommendations.
- Interactive forensic interrogation drawer with deterministic offline fallback when no API key is supplied.

---

## 4. Machine Learning & Leakage-Safe Evaluation Suite

The platform replaces heuristic rules with an offline-trained, walk-forward validated Machine Learning ranker.

### Feature Engineering Pipeline (`ml/features.py`)
Each $(Case, Candidate\_ATM)$ tuple is vectorized into a 15-dimensional feature space respecting strict time cutoffs $T$:
1. `dist_to_incident_km`: Great-circle haversine distance between candidate ATM and incident location.
2. `dist_to_mule_branch_km`: Distance to closest registered branch of involved mule accounts.
3. `corridor_alignment_score`: Directional cosine similarity between fund velocity vector and ATM vector.
4. `atm_fraud_hist_count`: Historical fraud withdrawal count prior to cutoff $T$ (zero future leakage).
5. `atm_cashout_density_cluster`: Fraud frequency per square km within a 2km radius prior to cutoff $T$.
6. `cctv_vulnerability_score`: Normalized score $(100 - \text{CCTV Health}) / 100$.
7. `cash_reserve_ratio`: Ratio of available cash to maximum daily card limit.
8. `is_24_7`: Indicator for on-street standalone access vs branch-attached machines.
9. `log_fraud_amount`: Log-transformed stolen amount $\log_{10}(\text{Amount})$.
10. `hop_count`: Number of transaction layering tiers.
11. `velocity_rapid`: Binary indicator for rapid layering ($< 15\text{ mins}$ inter-hop).
12. `hour_sin`, `hour_cos`: Cyclical diurnal components.
13. `is_night_window`: Binary indicator for 22:00–06:00 cashout window.
14. `mule_account_prior_atm_hits`: Frequency of the specific mule account at this ATM prior to cutoff $T$.

### Walk-Forward Chronological Validation Results (`ml/evaluate.py`)
Evaluated across a strictly future, out-of-time test set (Train: 65%, Val: 15%, Test: 20%) with zero temporal leakage:

| Method / Baseline | Precision@1 | Precision@3 | Precision@5 | Precision@10 | MRR | Mean Rank |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Random Baseline** | 0.0% | 12.9% | 38.7% | 67.7% | 0.1785 | #8.00 |
| **Spatial Proximity Baseline** | 16.1% | 51.6% | 74.2% | 100.0% | 0.4312 | #3.39 |
| **Historical Hotspot Baseline** | 58.1% | 83.9% | 96.8% | 100.0% | 0.7172 | #2.03 |
| **CyberTrace ML Ranker** | **67.7%** | **100.0%** | **100.0%** | **100.0%** | **0.8280** | **#1.39** |

- **Probability Calibration (Brier Score)**: `0.0307` (Optimal $\le 0.05$).
- **Lead Time Before Cashout**: Median = **81 minutes** (Interquartile Range: 45m – 105m), providing ample operational lead time for police and banking intervention.

---

## 5. Controllable Synthetic Event Stream Simulator

To enable realistic testing under diverse operational conditions, `simulator/` provides a controllable multi-scenario event generator:

| Scenario | Primary Zone | Modus Operandi & Topology | Provenance Tag |
|---|---|---|---|
| `stable_hotspot` | Koramangala - BTM Layout | High-density urban cluster with recurring mule cashout footprints. | `source: "synthetic-stream"`, `scenarioId: "stable_hotspot"` |
| `fraud_burst` | Indiranagar - Whitefield | Ultra-rapid layering ($< 5\text{m}$ inter-hop) with simultaneous cashouts across 4+ ATMs. | `source: "synthetic-stream"`, `scenarioId: "fraud_burst"` |
| `cold_location` | Peenya - Yelahanka Industrial | Emerging corridor testing zero-shot generalization on ATMs with zero/low priors. | `source: "synthetic-stream"`, `scenarioId: "cold_location"` |

---

## 6. Complete REST API Reference

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/health` | System health, database state, and Gemini configuration |
| `POST` | `/api/v1/predict/rank` | **ML Candidate Ranking Engine**: returns calibrated probabilities, hazard distribution, and factor attributions |
| `GET` | `/api/v1/simulator/scenarios` | Retrieve available simulator scenario definitions and metadata |
| `POST` | `/api/v1/simulator/generate` | Generate and inject synthetic multi-hop event streams into live database |
| `GET` | `/api/complaints` | Retrieve complaints with category, status, and text search |
| `POST` | `/api/complaints` | Register a new cybercrime incident |
| `GET` | `/api/complaints/:id` | Get complaint details |
| `GET` | `/api/complaints/:id/transactions` | Retrieve all money trail transactions for a case |
| `GET` | `/api/complaints/:id/network` | Compute graph nodes, edges, and centrality metrics |
| `GET` | `/api/complaints/:id/withdrawals` | Retrieve associated ATM withdrawal history |
| `POST` | `/api/complaints/:id/predict` | Trigger full prediction pipeline for a complaint |
| `GET` | `/api/atms` | Retrieve ATM locations, cash levels, and CCTV telemetry |
| `GET` | `/api/alerts` | Get real-time dispatch alerts |
| `POST` | `/api/alerts` | Create new alert |
| `PATCH` | `/api/alerts/:id` | Update alert status, assigned unit, or notes |
| `GET` | `/api/investigations/:id` | Fetch investigation casefile |
| `PATCH` | `/api/investigations/:id` | Record investigator decision and add forensic notes |
| `GET` | `/api/audit` | Query cryptographic audit trail |
| `POST` | `/api/ai/summarize` | Generate Gemini 3.8 Flash case summary |
| `POST` | `/api/ai/ask` | Natural language case question answering |

---

## 7. Installation & Verification Guide

### Prerequisites
- **Node.js** version 18.0.0 or higher
- **Python** version 3.10 or higher (with `scikit-learn`, `numpy`, `pandas`)
- **npm** version 9.0.0 or higher

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sagr12004/cybertrace.git
   cd cybertrace
   ```

2. **Install Frontend & Backend Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   *(Optional)* Set your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Train the ML Candidate Ranking Model**:
   ```bash
   python ml/train_ranker.py
   ```

5. **Run the Full Unlazy Acceptance Verification Suite**:
   ```bash
   # Verify all 14 acceptance gates
   node ../.agents/skills/unlazy/scripts/gate-check.mjs --status ../GATES.md

   # Verify all 8 acceptance roadmap items
   node ../scripts/verify-audit-roadmap.mjs

   # Run leakage-safe walk-forward ML evaluation
   node ../scripts/verify-ml-evaluation.mjs
   ```

6. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

7. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 8. 5-Minute SIH Jury Demonstration Script

Follow this structured presentation flow during hackathon evaluations to showcase the full multi-agency scope:

### Minute 1: Command Overview & Multi-Stakeholder Personas
- Open [http://localhost:3000](http://localhost:3000). Show the **Unified Intelligence Ribbon** with live metrics.
- Point out the **Stakeholder Viewport Switcher** in the top navigation bar:
  - Explain how CyberTrace connects **Law Enforcement (LEA)**, **Bank Nodal Officers (CFCFRMS)**, and **National I4C Coordinators** on a single unified platform.
- Click **"Demo Case"** to load `CYBER-2026-0842` (₹50,000 victim loss).

### Minute 2: Money Trail & Mule Topology
- Switch to **Layering & Transactions**. Highlight the rapid inter-hop velocity ($< 4\text{ mins}$) into mule accounts `ACC-MULE-4089` and `ACC-MULE-4102`.
- Open **Mule Network Topology**. Explain how the interactive DAG reveals `ACC-CASH-7721` as the high-betweenness cash consolidation hub.

### Minute 3: Machine Learning Prediction & Explainability
- Navigate to **Withdrawal Predictor**.
- Trigger the ML prediction engine. Point out:
  - **Calibrated Probability**: 88.6% probability assigned to **PNB Off-site ATM BTM 2nd Stage**.
  - **Local Factor Attributions**: Show exact percentage contributions (CCTV Vulnerability 30%, Syndicate Footprint 25%, Corridor Proximity 25%, Cash Capacity 20%).
  - **Temporal Hazard Horizon**: $P(\le 30\text{m}) = 45\%$, indicating urgent golden hour intervention required.

### Minute 4: Bank Nodal Desk (CFCFRMS) & GIS Patrol Dispatch
- Switch the Viewport to **Bank Nodal Officer (CFCFRMS Desk)**.
- Demonstrate the **Section 102 CrPC Real-Time Lien Queue**. Click **"Mark Lien"** on `ACC-MULE-4011` (holding ₹85,000) and **"Hold Dispenser"** on the target ATM.
- Switch to **GIS & Hotspot Map**. Toggle the geospatial heatmap layer showing cash extraction corridors, and click **"Dispatch Unit"** to alert Bengaluru South Cyber Patrol.

### Minute 5: National I4C Desk & Court-Ready Report
- Switch Viewport to **National I4C Coordinator**. Show the **State-to-State Fund Flow Corridors** (Karnataka $\leftrightarrow$ Jharkhand $\leftrightarrow$ Delhi) and click **"Broadcast Multi-State Alert"**.
- Open **Police Dossier & Report** to show the formal printable FIR and money-trail audit record.
- Open **AI Copilot Drawer** and prompt: *"Summarize the primary laundering modus operandi for this case."* Show real-time case-grounded forensic response.

---

## 9. Ethical Notice & Synthetic Data Provenance

All complaints, account numbers, names, and transaction values presented in this application are **synthetic artifacts** generated by the CyberTrace Multi-Scenario Simulator for the Smart India Hackathon. They do not represent real-world bank records or ongoing judicial cases. All prediction outputs are intended strictly as decision-support leads requiring human officer verification.
