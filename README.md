# CyberTrace AI: Cybercrime Investigation & Financial Withdrawal Prediction Platform

> 
> AI-assisted cybercrime investigation, multi-hop financial fraud money-trail tracing, geospatial analysis, and explainable ATM withdrawal prediction platform.

---

## 1. System Overview

Cybercrime investigations frequently involve complex account layering to evade detection and liquidate stolen funds into physical cash via automated teller machines (ATMs). 

**CyberTrace AI** delivers a unified command workspace for law-enforcement cybercrime investigators to:
1. Intake and manage cybercrime complaints (UPI fraud, phishing, investment scams, SIM swaps).
2. Trace multi-hop transaction flows between victim accounts, intermediate mules, and cash consolidation hubs.
3. Visualize account topology networks (React Flow) with degree and betweenness centrality metrics.
4. Analyze historical cash extraction patterns across Bengaluru ATMs (110+ synthetic forensic records).
5. Predict candidate ATM cashout hotspots and time windows using a 7-stage spatial clustering and velocity-based risk estimation engine.
6. Display hotspots on an interactive GIS Leaflet Map with OpenStreetMap layers.
7. Dispatch field alerts to police patrol units and bank nodal desks.
8. Enforce investigator-in-the-loop decisions (approve surveillance, issue Section 91 CrPC freeze notices, escalate to State CID).
9. Maintain an immutable forensic audit log and generate court-ready investigation reports (PDF/CSV).
10. Query the **AI Forensic Copilot** (Gemini 3.8 Flash) for natural language case summaries, suspect account explanations, and evidence breakdowns.

---

## 2.  Workflow

Investigators or judges can test the end-to-end workflow in under 5 minutes:

1. **Login & Dashboard**:
   - Authenticate with the 1-click investigator profile (**Insp. Rajesh Varma**, Senior Cybercrime Investigator).
   - Review high-level KPIs, crime category distributions, and active field alerts.
   - Click **"Launch Primary Demo"** to load primary scenario **CYBER-2026-0842** (₹50,000 UPI fraud).

2. **Complaints & Tracing**:
   - Inspect victim Aarav Sharma's complaint details and reported modus operandi.
   - Click **Trace** to enter the **Transaction Analysis** module.

3. **Multi-Hop Layering & Freeze Intervention**:
   - Observe rapid layering velocity (&lt; 4 minutes between hops) from Layer 1 mule (`ACC-MULE-4011`) into Layer 2 split nodes (`ACC-MULE-4089` and `ACC-MULE-4102`).
   - Click **Freeze Account** to simulate issuing a Section 91 CrPC notice to the beneficiary bank.

4. **Account Network Graph**:
   - Explore the interactive topology graph. Click on nodes to inspect degree centrality, in/out degrees, and KYC discrepancy indicators.
   - Note the consolidation path into **Apex Cash Liquidation Hub** (`ACC-CASH-7721`).

5. **Historical Withdrawals Analysis**:
   - Examine the 24-hour withdrawal distribution graph showing peak cash extraction between 18:00 and 22:00.
   - Observe previous withdrawal clusters at SBI Koramangala 5th Block and HDFC BTM 2nd Stage.

6. **Explainable AI Prediction Engine**:
   - Trigger the **7-stage prediction pipeline** (Data Prep &rarr; Feature Engineering &rarr; Spatial DBSCAN &rarr; Multi-factor Risk Scoring &rarr; Time Window Estimation &rarr; Explainability Synthesis &rarr; Candidate Dispatch).
   - Inspect the **88% High Risk score** for the Koramangala 5th Block corridor within the **0-6 hours** window.
   - Review transparent attribution factors (Historical ATM Affinity 35%, Layering Velocity 25%, Graph Centrality 20%, Time-of-Day 20%).

7. **GIS Map & Hotspot Radii**:
   - View candidate ATMs and the ±1,200m confidence radius on the Leaflet map.
   - Click the candidate ATM pin to inspect cash availability, CCTV status, and historical fraud counts.

8. **Alert Management & Dispatch**:
   - View auto-generated field alert `ALT-2026-904`.
   - Click **Dispatch Units** to notify Bengaluru South patrol and bank vigilance officers.

9. **Investigator Decision & Audit Trail**:
   - Open the **Investigation Workspace**.
   - Review evidence and click **Approve for Field Surveillance**. Confirm the action to commit it to the cryptographic audit trail.
   - Add custom forensic case notes.

10. **Report Generation & AI Copilot**:
    - Click **Investigation Report** to view the official First Information & Money-Trail Tracing Report.
    - Export raw transaction data as **CSV** or click **Print / Save as PDF**.
    - Open the **AI Copilot** drawer to ask questions grounded in case data.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, `@xyflow/react` (React Flow), Leaflet, Recharts, Lucide React.
- **Backend**: Express REST API running with Node.js / `tsx` (serving `/api/*` endpoints and Vite middlewares in development).
- **AI Integration**: Google Gen AI SDK (`@google/genai`) using `gemini-3.8-flash` on server-side with structured deterministic forensic fallback.
- **Geospatial & Analytics**: Leaflet OpenStreetMap tiles, DBSCAN-equivalent centroid radius clustering, network degree centrality, and velocity analysis.

---

## 4. API Endpoints

- `GET /api/health` - System health and Gemini status
- `GET /api/complaints` - Query complaints with filters
- `POST /api/complaints` - Register new cybercrime complaint
- `GET /api/complaints/:id/transactions` - Money trail transactions for a complaint
- `GET /api/complaints/:id/network` - Graph nodes, edges, and centrality metrics
- `POST /api/complaints/:id/predict` - Execute 7-stage prediction engine
- `GET /api/atms` - Bengaluru ATM locations and historical metadata
- `GET /api/hotspots` - Geospatial hotspot predictions
- `GET /api/alerts` / `PATCH /api/alerts/:id` - Alert management and dispatch
- `GET /api/investigations/:id` / `PATCH` - Case notes and formal decisions
- `GET /api/investigations/:id/report` - Formatted investigation report
- `POST /api/ai/summarize` - Case summarization via Gemini or local rules
- `POST /api/ai/ask` - Forensic investigator question answering
- `POST /api/demo/reset` - Reset state to initial clean demo data

---

## 5. Ethical & Synthetic Data Notice

All complaints, account numbers, names, and transaction values presented in this application are **synthetic demo artifacts** created specifically for the Smart India Hackathon. They do not represent real-world bank records or ongoing judicial cases. Predictions are intended strictly as decision-support leads requiring human investigator verification.
