"""
CyberTrace AI - Chronological Benchmark Dataset Generator (SIH 2026)
Generates leakage-safe historical case-candidate pairs with ground-truth cashouts.
"""

import os
import sys
import math
import random
import datetime
from typing import List, Dict, Any, Tuple

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from features import extract_features, AREA_COORDINATES

# Realistic ATM locations in Bengaluru
SEED_ATMS = [
    {"id": "ATM-KOR-01", "atmCode": "SBI-KOR-044", "name": "SBI e-Corner Koramangala 5th Block", "area": "Koramangala", "latitude": 12.9352, "longitude": 77.6245, "cctvHealthScore": 38, "cashReserves": 680000, "historicalFraudIncidentCount": 18, "is24x7": True},
    {"id": "ATM-KOR-02", "atmCode": "HDFC-KOR-012", "name": "HDFC 24x7 ATM Sony World Junction", "area": "Koramangala", "latitude": 12.9378, "longitude": 77.6279, "cctvHealthScore": 72, "cashReserves": 450000, "historicalFraudIncidentCount": 11, "is24x7": True},
    {"id": "ATM-IND-01", "atmCode": "ICICI-IND-008", "name": "ICICI Bank ATM 100ft Road Indiranagar", "area": "Indiranagar", "latitude": 12.9784, "longitude": 77.6408, "cctvHealthScore": 88, "cashReserves": 320000, "historicalFraudIncidentCount": 7, "is24x7": True},
    {"id": "ATM-IND-02", "atmCode": "AXIS-IND-021", "name": "Axis Bank CMH Road Indiranagar", "area": "Indiranagar", "latitude": 12.9799, "longitude": 77.6450, "cctvHealthScore": 44, "cashReserves": 580000, "historicalFraudIncidentCount": 14, "is24x7": True},
    {"id": "ATM-BTM-01", "atmCode": "PNB-BTM-003", "name": "PNB Off-site ATM BTM 2nd Stage", "area": "BTM Layout", "latitude": 12.9166, "longitude": 77.6101, "cctvHealthScore": 31, "cashReserves": 720000, "historicalFraudIncidentCount": 22, "is24x7": True},
    {"id": "ATM-BTM-02", "atmCode": "CAN-BTM-019", "name": "Canara Bank ATM Outer Ring Road BTM", "area": "BTM Layout", "latitude": 12.9142, "longitude": 77.6155, "cctvHealthScore": 65, "cashReserves": 390000, "historicalFraudIncidentCount": 9, "is24x7": True},
    {"id": "ATM-HSR-01", "atmCode": "BOB-HSR-005", "name": "Bank of Baroda ATM 27th Main HSR", "area": "HSR Layout", "latitude": 12.9121, "longitude": 77.6446, "cctvHealthScore": 80, "cashReserves": 410000, "historicalFraudIncidentCount": 5, "is24x7": True},
    {"id": "ATM-HSR-02", "atmCode": "SBI-HSR-033", "name": "SBI Sector 1 HSR Layout", "area": "HSR Layout", "latitude": 12.9189, "longitude": 77.6492, "cctvHealthScore": 48, "cashReserves": 610000, "historicalFraudIncidentCount": 12, "is24x7": True},
    {"id": "ATM-WFD-01", "atmCode": "SBI-WFD-009", "name": "SBI ITPL Main Road Whitefield", "area": "Whitefield", "latitude": 12.9698, "longitude": 77.7500, "cctvHealthScore": 92, "cashReserves": 800000, "historicalFraudIncidentCount": 4, "is24x7": False},
    {"id": "ATM-WFD-02", "atmCode": "HDFC-WFD-015", "name": "HDFC Hope Farm Junction Whitefield", "area": "Whitefield", "latitude": 12.9812, "longitude": 77.7588, "cctvHealthScore": 40, "cashReserves": 540000, "historicalFraudIncidentCount": 10, "is24x7": True},
    {"id": "ATM-JAY-01", "atmCode": "AXIS-JAY-004", "name": "Axis Bank 4th Block Jayanagar", "area": "Jayanagar", "latitude": 12.9308, "longitude": 77.5838, "cctvHealthScore": 85, "cashReserves": 350000, "historicalFraudIncidentCount": 3, "is24x7": False},
    {"id": "ATM-ELC-01", "atmCode": "ICICI-ELC-002", "name": "ICICI Phase 1 Electronic City", "area": "Electronic City", "latitude": 12.8452, "longitude": 77.6602, "cctvHealthScore": 55, "cashReserves": 690000, "historicalFraudIncidentCount": 13, "is24x7": True},
    {"id": "ATM-MGR-01", "atmCode": "SBI-MGR-001", "name": "SBI Brigade Road / MG Road", "area": "MG Road", "latitude": 12.9756, "longitude": 77.6066, "cctvHealthScore": 90, "cashReserves": 480000, "historicalFraudIncidentCount": 6, "is24x7": True},
    {"id": "ATM-MAR-01", "atmCode": "CAN-MAR-007", "name": "Canara Bank Marathahalli Bridge", "area": "Marathahalli", "latitude": 12.9591, "longitude": 77.6974, "cctvHealthScore": 35, "cashReserves": 750000, "historicalFraudIncidentCount": 16, "is24x7": True},
    {"id": "ATM-PEE-01", "atmCode": "BOB-PEE-011", "name": "Bank of Baroda Peenya Industrial Area", "area": "Peenya", "latitude": 13.0287, "longitude": 77.5197, "cctvHealthScore": 30, "cashReserves": 640000, "historicalFraudIncidentCount": 15, "is24x7": True},
    {"id": "ATM-HEB-01", "atmCode": "SBI-HEB-006", "name": "SBI Hebbal Flyover Junction", "area": "Hebbal", "latitude": 13.0358, "longitude": 77.5970, "cctvHealthScore": 60, "cashReserves": 420000, "historicalFraudIncidentCount": 8, "is24x7": True},
]

def generate_synthetic_benchmark_dataset(num_cases: int = 120, seed: int = 42) -> List[Dict[str, Any]]:
    """
    Generates a deterministic, reproducible series of historical cybercrime complaints,
    each with candidate ATM ranking sets and ground truth liquidation ATM labels.
    Chronologically sorted from past to present.
    """
    random.seed(seed)
    base_time = datetime.datetime(2026, 1, 1, 9, 0, 0)
    cases = []
    
    # Cumulative historical withdrawals tracking (for leak-free past lookups)
    historical_withdrawals = []
    
    crime_types = ['UPI fraud', 'Investment fraud', 'Job offer scam', 'Digital arrest scam', 'Loan app extortion', 'Credit card fraud']
    areas = list(AREA_COORDINATES.keys())
    
    for i in range(num_cases):
        case_id = f"CMP-BENCH-{i+1:04d}"
        # Advance time chronologically (12-36 hours per case)
        delta_hours = random.uniform(8.0, 32.0)
        base_time += datetime.timedelta(hours=delta_hours)
        case_time_iso = base_time.isoformat()
        
        crime_cat = random.choice(crime_types)
        inc_area = random.choice(areas[:8]) # Focus on primary areas
        inc_lat, inc_lng = AREA_COORDINATES[inc_area]
        
        fraud_amount = round(random.choice([15000, 25000, 48000, 75000, 120000, 250000, 480000]), -2)
        mule_acc = f"ACC-MULE-{random.randint(1000, 9999)}"
        
        # Determine likely true liquidation ATM based on domain physics:
        # Fraudsters prefer: 1) Within 1-4km of corridor, 2) Poor CCTV, 3) High cash reserves, 4) Repeat syndicate pattern
        candidate_scores = []
        for atm in SEED_ATMS:
            # Physics score for ground truth probability
            dist = math.hypot(atm['latitude'] - inc_lat, atm['longitude'] - inc_lng) * 111.0
            cctv_vuln = (100 - atm['cctvHealthScore']) / 100.0
            hist_bias = atm['historicalFraudIncidentCount'] / 20.0
            proximity_factor = max(0.0, 1.0 - (dist / 15.0))
            
            ground_truth_logit = 2.5 * proximity_factor + 2.0 * cctv_vuln + 1.8 * hist_bias + random.gauss(0, 0.3)
            candidate_scores.append((ground_truth_logit, atm))
            
        candidate_scores.sort(key=lambda x: x[0], reverse=True)
        true_atm = candidate_scores[0][1]
        
        # Cashout time after complaint (between 15 min to 180 min)
        lead_time_min = int(random.uniform(20, 150))
        cashout_time = base_time + datetime.timedelta(minutes=lead_time_min)
        
        # Record into historical log (only available for FUTURE cases after cashout_time)
        historical_withdrawals.append({
            "withdrawalId": f"WDL-BENCH-{i+1:04d}",
            "complaintId": case_id,
            "accountId": mule_acc,
            "atmId": true_atm["id"],
            "atmCode": true_atm["atmCode"],
            "amount": fraud_amount,
            "timestamp": cashout_time.isoformat()
        })
        
        # Transactions multi-hop trail
        hop_count = random.choice([2, 3, 4])
        txns = []
        rapid_velocity = random.random() < 0.65
        curr_t = base_time - datetime.timedelta(minutes=random.randint(30, 90))
        for h in range(hop_count):
            curr_t += datetime.timedelta(minutes=random.randint(2, 6) if rapid_velocity else random.randint(15, 45))
            txns.append({
                "transactionId": f"TXN-{i+1}-{h+1}",
                "complaintId": case_id,
                "senderAccountId": f"ACC-VICTIM-{i+1}" if h == 0 else f"ACC-MULE-L{h}",
                "receiverAccountId": mule_acc if h == hop_count - 1 else f"ACC-MULE-L{h+1}",
                "amount": fraud_amount,
                "layer": h + 1,
                "transactionTimestamp": curr_t.isoformat()
            })
            
        complaint = {
            "id": case_id,
            "complaintNumber": f"CYBER-2026-{i+1:04d}",
            "crimeCategory": crime_cat,
            "fraudAmount": fraud_amount,
            "complaintTimestamp": case_time_iso,
            "incidentLocation": inc_area.title() + ", Bengaluru",
            "incidentLat": inc_lat,
            "incidentLng": inc_lng,
            "suspectedAccount": mule_acc,
            "suspectedBranchArea": inc_area.title(),
            "rapidVelocity": rapid_velocity,
            "trueAtmId": true_atm["id"],
            "trueAtmCode": true_atm["atmCode"],
            "actualLeadTimeMinutes": lead_time_min,
            "actualCashoutTime": cashout_time.isoformat()
        }
        
        # Candidate set for this case (all seed ATMs)
        candidates = list(SEED_ATMS)
        random.shuffle(candidates)
        
        cases.append({
            "complaint": complaint,
            "transactions": txns,
            "candidates": candidates,
            "trueAtmId": true_atm["id"],
            "cutoffTime": case_time_iso,
            "historicalSnapshot": list(historical_withdrawals) # snapshot up to this point
        })
        
    return cases
