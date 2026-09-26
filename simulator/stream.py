"""
CyberTrace AI - Controllable Synthetic Event Stream Simulator CLI (SIH 2026 / PS 26184)
Command-line generator supporting multi-scenario output:
  - stable_hotspot
  - fraud_burst
  - cold_location
"""

import os
import sys
import json
import argparse
import datetime
from typing import Dict, Any, List

SCENARIOS = {
    'stable_hotspot': {
        'title': 'Stable Urban Hotspot (Koramangala - BTM Syndicate)',
        'description': 'High-density urban syndicate with recurring mule footprints at known high-risk ATMs.',
        'primary_zone': 'Koramangala - BTM Layout Corridor',
        'default_atms': [
            {'id': 'ATM-KOR-01', 'code': 'SBI-KOR-044', 'area': 'Koramangala', 'lat': 12.9352, 'lng': 77.6245},
            {'id': 'ATM-BTM-01', 'code': 'PNB-BTM-003', 'area': 'BTM Layout', 'lat': 12.9166, 'lng': 77.6101},
        ]
    },
    'fraud_burst': {
        'title': 'High-Velocity Fraud Burst (Multi-Node Fan-out)',
        'description': 'Ultra-rapid layering (<5 min inter-hop) with simultaneous cashout attempts across 4+ ATMs.',
        'primary_zone': 'Indiranagar - Whitefield Express Corridor',
        'default_atms': [
            {'id': 'ATM-IND-01', 'code': 'ICICI-IND-008', 'area': 'Indiranagar', 'lat': 12.9784, 'lng': 77.6408},
            {'id': 'ATM-IND-02', 'code': 'AXIS-IND-021', 'area': 'Indiranagar', 'lat': 12.9799, 'lng': 77.6450},
        ]
    },
    'cold_location': {
        'title': 'Cold-Location Generalization (Peenya - Yelahanka Industrial)',
        'description': 'Emerging geographic corridor testing model spatial reasoning on ATMs with zero/low historical fraud priors.',
        'primary_zone': 'Peenya - Yelahanka Industrial Corridor',
        'default_atms': [
            {'id': 'ATM-PEE-01', 'code': 'BOB-PEE-011', 'area': 'Peenya', 'lat': 13.0287, 'lng': 77.5197},
            {'id': 'ATM-HEB-01', 'code': 'SBI-HEB-006', 'area': 'Hebbal', 'lat': 13.0358, 'lng': 77.5970},
        ]
    }
}

def generate_stream(scenario: str, case_count: int = 3, base_time: datetime.datetime = None) -> Dict[str, Any]:
    if scenario not in SCENARIOS:
        raise ValueError(f"Unknown scenario '{scenario}'. Supported: {list(SCENARIOS.keys())}")
        
    base_time = base_time or datetime.datetime.now()
    scen_info = SCENARIOS[scenario]
    world_id = f"WORLD-{scenario.upper()}-{base_time.strftime('%Y%m%d%H%M%S')}"
    
    complaints = []
    transactions = []
    withdrawals = []
    total_volume = 0
    
    for i in range(case_count):
        idx = i + 1
        comp_id = f"CMP-SIM-{scenario[:3].upper()}-{idx:03d}"
        comp_num = f"CYBER-2026-SIM-{2000 + i}"
        
        provenance = {
            "source": "synthetic-stream",
            "scenarioId": scenario,
            "worldId": world_id,
            "generatedAt": datetime.datetime.now().isoformat(),
            "isSynthetic": True
        }
        
        atm = scen_info['default_atms'][i % len(scen_info['default_atms'])]
        
        if scenario == 'stable_hotspot':
            amt = 85000 + i * 25000
            loc = f"{atm['area']}, Bengaluru"
            mule = f"ACC-MULE-40{11 + i*10}"
            rapid = False
            inter_hop = 15
        elif scenario == 'fraud_burst':
            amt = 150000 + i * 40000
            loc = f"Indiranagar 100ft Road, Bengaluru"
            mule = f"ACC-BURST-8{100 + i}"
            rapid = True
            inter_hop = 4
        else: # cold_location
            amt = 38000 + i * 15000
            loc = f"Peenya Industrial Area, Bengaluru"
            mule = f"ACC-COLD-3{200 + i}"
            rapid = False
            inter_hop = 45
            
        total_volume += amt
        comp_time = base_time - datetime.timedelta(minutes=60 - i * 10)
        
        complaints.append({
            "id": comp_id,
            "complaintNumber": comp_num,
            "victimReference": f"VIC-SIM-{idx:03d}",
            "victimName": f"Complainant {idx} ({scenario})",
            "crimeCategory": "UPI fraud" if scenario == 'stable_hotspot' else ("Digital arrest scam" if scenario == 'fraud_burst' else "Loan app extortion"),
            "fraudAmount": amt,
            "complaintTimestamp": comp_time.isoformat(),
            "transactionReference": f"TXN-SIM-ROOT-{idx}",
            "suspectedAccount": mule,
            "suspectedAccountName": f"Mule Node {idx}",
            "bankName": "State Bank of India",
            "incidentLocation": loc,
            "status": "New",
            "notes": f"Synthetic scenario stream: {scenario}",
            "provenance": provenance
        })
        
        # Transactions
        hop_count = 3 if scenario == 'fraud_burst' else 2
        txn_time = comp_time - datetime.timedelta(minutes=30)
        split_amt = amt // (2 if hop_count == 3 else 1)
        for h in range(1, hop_count + 1):
            txn_time += datetime.timedelta(minutes=inter_hop)
            transactions.append({
                "id": f"TXN-SIM-{scenario[:3].upper()}-{idx}-{h}",
                "transactionReference": f"TXN-SIM-REF-{idx}{h}",
                "complaintId": comp_id,
                "senderAccountId": f"ACC-VICTIM-{idx}" if h == 1 else f"ACC-MULE-L1-{idx}",
                "receiverAccountId": mule if h == hop_count else f"ACC-MULE-L{h}-{idx}",
                "amount": split_amt,
                "layer": h,
                "transactionTimestamp": txn_time.isoformat(),
                "provenance": provenance
            })
            
        # Cashout attempt
        cashout_time = txn_time + datetime.timedelta(minutes=15 if scenario == 'fraud_burst' else 45)
        withdrawals.append({
            "id": f"WDL-SIM-{scenario[:3].upper()}-{idx}",
            "complaintId": comp_id,
            "accountId": mule,
            "atmId": atm["id"],
            "atmCode": atm["code"],
            "amount": min(amt, 40000),
            "timestamp": cashout_time.isoformat(),
            "status": "Attempted",
            "provenance": provenance
        })
        
    return {
        "status": "success",
        "scenario": scenario,
        "worldId": world_id,
        "description": scen_info["description"],
        "generatedAt": datetime.datetime.now().isoformat(),
        "summary": {
            "complaintsCount": len(complaints),
            "transactionsCount": len(transactions),
            "withdrawalsCount": len(withdrawals),
            "totalFraudVolume": total_volume,
            "primaryZone": scen_info["primary_zone"]
        },
        "complaints": complaints,
        "transactions": transactions,
        "withdrawals": withdrawals
    }

def main():
    parser = argparse.ArgumentParser(description="CyberTrace Synthetic Stream Simulator")
    parser.add_argument("--scenario", type=str, default="stable_hotspot", choices=["stable_hotspot", "fraud_burst", "cold_location"], help="Scenario to generate")
    parser.add_argument("--count", type=int, default=3, help="Number of cases to generate")
    parser.add_argument("--out", type=str, help="Output JSON path")
    args = parser.parse_args()
    
    result = generate_stream(scenario=args.scenario, case_count=args.count)
    
    if args.out:
        with open(args.out, "w") as f:
            json.dump(result, f, indent=2)
        print(f"Scenario '{args.scenario}' saved to {args.out}")
    else:
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
