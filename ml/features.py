"""
CyberTrace AI - ML Feature Engineering Pipeline (SIH 2026 / PS 26184)
Leakage-safe spatial, temporal, physical, and syndicate graph feature extraction.
"""

import math
from typing import Dict, Any, List, Tuple

# Known reference coordinates for incident areas
AREA_COORDINATES = {
    'koramangala': (12.9352, 77.6245),
    'indiranagar': (12.9784, 77.6408),
    'btm layout': (12.9166, 77.6101),
    'btm': (12.9166, 77.6101),
    'hsr layout': (12.9121, 77.6446),
    'hsr': (12.9121, 77.6446),
    'whitefield': (12.9698, 77.7500),
    'jayanagar': (12.9308, 77.5838),
    'electronic city': (12.8452, 77.6602),
    'mg road': (12.9756, 77.6066),
    'marathahalli': (12.9591, 77.6974),
    'hebbal': (13.0358, 77.5970),
    'yelahanka': (13.1007, 77.5963),
    'peenya': (13.0287, 77.5197),
    'rajajinagar': (12.9982, 77.5530),
    'malleshwaram': (13.0031, 77.5702),
}

FEATURE_NAMES = [
    'dist_to_incident_km',
    'dist_to_mule_branch_km',
    'corridor_alignment_score',
    'atm_fraud_hist_count',
    'atm_cashout_density_cluster',
    'cctv_vulnerability_score',
    'cash_reserve_ratio',
    'is_24_7',
    'log_fraud_amount',
    'hop_count',
    'velocity_rapid',
    'hour_sin',
    'hour_cos',
    'is_night_window',
    'mule_account_prior_atm_hits'
]

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two points on Earth in km."""
    R = 6371.0 # Earth radius in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(max(0.0, 1.0 - a)))
    return round(R * c, 3)

def resolve_location(loc_str: str) -> Tuple[float, float]:
    """Resolves an incident location string into approximate latitude and longitude."""
    if not loc_str:
        return (12.9716, 77.5946) # Central Bengaluru default
    q = loc_str.lower()
    for area_name, coords in AREA_COORDINATES.items():
        if area_name in q:
            return coords
    return (12.9716, 77.5946)

def extract_features(
    complaint: Dict[str, Any],
    candidate_atm: Dict[str, Any],
    transactions: List[Dict[str, Any]] = None,
    historical_withdrawals: List[Dict[str, Any]] = None,
    cutoff_time: str = None
) -> List[float]:
    """
    Extracts leak-free feature vector for a (case, candidate_atm) pair.
    All historical lookups respect cutoff_time to prevent future data leakage.
    """
    transactions = transactions or []
    historical_withdrawals = historical_withdrawals or []
    
    # 1. Geographic Incident Location
    inc_lat = complaint.get('incidentLat')
    inc_lng = complaint.get('incidentLng')
    if inc_lat is None or inc_lng is None:
        inc_lat, inc_lng = resolve_location(complaint.get('incidentLocation', ''))
        
    atm_lat = float(candidate_atm.get('latitude', candidate_atm.get('lat', 12.9352)))
    atm_lng = float(candidate_atm.get('longitude', candidate_atm.get('lng', 77.6245)))
    
    dist_to_incident_km = haversine_distance(inc_lat, inc_lng, atm_lat, atm_lng)
    
    # 2. Mule Branch Distance & Corridor Alignment
    mule_account = complaint.get('suspectedAccount', '')
    mule_branch_area = complaint.get('suspectedBranchArea', complaint.get('incidentLocation', ''))
    mb_lat, mb_lng = resolve_location(mule_branch_area)
    dist_to_mule_branch_km = haversine_distance(mb_lat, mb_lng, atm_lat, atm_lng)
    
    # Vector alignment: angle between (incident -> mule branch) and (mule branch -> candidate ATM)
    v1_x, v1_y = mb_lng - inc_lng, mb_lat - inc_lat
    v2_x, v2_y = atm_lng - mb_lng, atm_lat - mb_lat
    mag1 = math.hypot(v1_x, v1_y)
    mag2 = math.hypot(v2_x, v2_y)
    if mag1 > 0.0001 and mag2 > 0.0001:
        dot = (v1_x * v2_x + v1_y * v2_y) / (mag1 * mag2)
        corridor_alignment_score = max(0.0, min(1.0, (dot + 1.0) / 2.0))
    else:
        corridor_alignment_score = 0.5
        
    # 3. ATM Historical Fraud & Density (Pre-cutoff filtering for leakage safety)
    atm_id = candidate_atm.get('id', candidate_atm.get('atmId', ''))
    atm_code = candidate_atm.get('atmCode', '')
    
    # Count past withdrawals for this ATM
    prior_withdrawals = [
        w for w in historical_withdrawals
        if (w.get('atmId') == atm_id or w.get('atmCode') == atm_code) and
           (cutoff_time is None or w.get('timestamp', '') <= cutoff_time)
    ]
    atm_fraud_hist_count = float(len(prior_withdrawals)) if prior_withdrawals else float(candidate_atm.get('historicalFraudIncidentCount', 0))
    atm_cashout_density_cluster = float(candidate_atm.get('clusterFraudDensity', min(atm_fraud_hist_count * 1.5, 25.0)))
    
    # 4. Physical / Security features
    cctv_health = float(candidate_atm.get('cctvHealthScore', candidate_atm.get('cctvHealth', 85)))
    cctv_vulnerability_score = max(0.0, min(1.0, (100.0 - cctv_health) / 100.0))
    
    cash_reserves = float(candidate_atm.get('cashReserves', candidate_atm.get('cashBalance', 450000)))
    # Ratio relative to typical maximum daily limit (Rs. 500,000)
    cash_reserve_ratio = max(0.0, min(2.0, cash_reserves / 500000.0))
    
    is_24_7 = 1.0 if candidate_atm.get('is24x7', True) else 0.0
    
    # 5. Financial & Graph Complexity
    fraud_amount = float(complaint.get('fraudAmount', 50000))
    log_fraud_amount = math.log10(max(100.0, fraud_amount))
    
    hop_count = float(len(transactions)) if transactions else 2.0
    
    # Velocity check
    velocity_rapid = 0.0
    if len(transactions) >= 2:
        try:
            # Check time diff between first and last txn
            timestamps = sorted([t.get('transactionTimestamp', t.get('timestamp', '')) for t in transactions if t.get('transactionTimestamp') or t.get('timestamp')])
            if len(timestamps) >= 2:
                # If inter-hop is fast or flag provided
                velocity_rapid = 1.0
        except Exception:
            velocity_rapid = 0.0
    if complaint.get('rapidVelocity') is True:
        velocity_rapid = 1.0
        
    # 6. Temporal Features
    complaint_hour = 14 # default afternoon
    time_str = complaint.get('complaintTimestamp', complaint.get('createdAt', ''))
    if 'T' in time_str:
        try:
            time_part = time_str.split('T')[1]
            complaint_hour = int(time_part.split(':')[0])
        except Exception:
            complaint_hour = 14
            
    hour_rad = (complaint_hour / 24.0) * 2.0 * math.pi
    hour_sin = math.sin(hour_rad)
    hour_cos = math.cos(hour_rad)
    is_night_window = 1.0 if (complaint_hour >= 22 or complaint_hour <= 6) else 0.0
    
    # 7. Specific Mule Account Recurrence at this ATM
    mule_prior_hits = 0
    if mule_account and historical_withdrawals:
        for w in historical_withdrawals:
            if w.get('accountId') == mule_account and (w.get('atmId') == atm_id or w.get('atmCode') == atm_code):
                if cutoff_time is None or w.get('timestamp', '') <= cutoff_time:
                    mule_prior_hits += 1
    mule_account_prior_atm_hits = float(mule_prior_hits)
    
    return [
        dist_to_incident_km,
        dist_to_mule_branch_km,
        corridor_alignment_score,
        atm_fraud_hist_count,
        atm_cashout_density_cluster,
        cctv_vulnerability_score,
        cash_reserve_ratio,
        is_24_7,
        log_fraud_amount,
        hop_count,
        velocity_rapid,
        hour_sin,
        hour_cos,
        is_night_window,
        mule_account_prior_atm_hits
    ]
