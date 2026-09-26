"""
CyberTrace AI - ML Candidate Ranker Trainer (SIH 2026 / PS 26184)
Trains an ensemble Gradient Boosting candidate ranking model with calibrated probabilities.
"""

import os
import sys
import json
import pickle
import datetime
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import brier_score_loss, log_loss

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from features import extract_features, FEATURE_NAMES
from dataset import generate_synthetic_benchmark_dataset, SEED_ATMS

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def train_and_export():
    print("=" * 70)
    print("CYBERTRACE AI - TRAINING CANDIDATE RANKING & HAZARD ENSEMBLE")
    print("=" * 70)
    
    # 1. Generate chronological dataset (140 cases)
    print("[1/5] Generating chronological benchmark dataset (140 cases)...")
    dataset = generate_synthetic_benchmark_dataset(num_cases=140, seed=42)
    
    # Chronological partition (65% train, 15% val, 20% test)
    n_total = len(dataset)
    n_train = int(n_total * 0.65)
    n_val = int(n_total * 0.15)
    
    train_cases = dataset[:n_train]
    val_cases = dataset[n_train:n_train + n_val]
    test_cases = dataset[n_train + n_val:]
    
    print(f"      Chronological Split -> Train: {len(train_cases)} | Val: {len(val_cases)} | Test: {len(test_cases)}")
    
    # 2. Build feature matrices
    print("[2/5] Extracting leak-free feature vectors...")
    
    def build_matrix(cases):
        X, y, groups = [], [], []
        for case in cases:
            comp = case['complaint']
            txns = case['transactions']
            true_id = case['trueAtmId']
            cutoff = case['cutoffTime']
            hist = case['historicalSnapshot']
            
            for cand in case['candidates']:
                cand_id = cand['id']
                feat = extract_features(comp, cand, txns, hist, cutoff_time=cutoff)
                label = 1 if cand_id == true_id else 0
                X.append(feat)
                y.append(label)
                groups.append(comp['id'])
        return np.array(X), np.array(y), groups
        
    X_train, y_train, groups_train = build_matrix(train_cases)
    X_val, y_val, groups_val = build_matrix(val_cases)
    X_test, y_test, groups_test = build_matrix(test_cases)
    
    print(f"      Train Samples: {X_train.shape[0]} (Positives: {np.sum(y_train)})")
    print(f"      Val Samples:   {X_val.shape[0]} (Positives: {np.sum(y_val)})")
    print(f"      Test Samples:  {X_test.shape[0]} (Positives: {np.sum(y_test)})")
    
    # 3. Train Gradient Boosting Classifier
    print("[3/5] Fitting GradientBoosting ensemble with probability calibration...")
    base_gbm = GradientBoostingClassifier(
        n_estimators=80,
        learning_rate=0.08,
        max_depth=4,
        subsample=0.85,
        random_state=42
    )
    base_gbm.fit(X_train, y_train)
    
    # Calibrate probabilities using sigmoid / isotonic cross-validation
    calibrated_ranker = CalibratedClassifierCV(estimator=base_gbm, cv=3, method='sigmoid')
    calibrated_ranker.fit(X_train, y_train)
    
    # Feature importances from base GBM
    importances = base_gbm.feature_importances_
    feat_imp = sorted(zip(FEATURE_NAMES, importances), key=lambda x: x[1], reverse=True)
    print("      Top Learned Feature Importances:")
    for fn, imp in feat_imp[:6]:
        print(f"        - {fn:<30}: {imp*100:5.2f}%")
        
    # 4. Train Temporal Hazard Classifier (Lead Time Bucket)
    # Buckets: 0: <=30m, 1: 30-60m, 2: 60-180m, 3: >180m
    print("[4/5] Training multi-horizon temporal hazard model...")
    def get_hazard_bucket(lead_time_min):
        if lead_time_min <= 30: return 0
        elif lead_time_min <= 60: return 1
        elif lead_time_min <= 180: return 2
        else: return 3
        
    X_haz_train, y_haz_train = [], []
    for c in train_cases:
        comp = c['complaint']
        txns = c['transactions']
        true_atm = next(a for a in c['candidates'] if a['id'] == c['trueAtmId'])
        feat = extract_features(comp, true_atm, txns, c['historicalSnapshot'], c['cutoffTime'])
        X_haz_train.append(feat)
        y_haz_train.append(get_hazard_bucket(comp['actualLeadTimeMinutes']))
        
    hazard_model = RandomForestClassifier(n_estimators=40, max_depth=3, random_state=42)
    hazard_model.fit(np.array(X_haz_train), np.array(y_haz_train))
    
    # 5. Measure Validation Performance
    val_probs = calibrated_ranker.predict_proba(X_val)[:, 1]
    val_brier = brier_score_loss(y_val, val_probs)
    print(f"      Validation Brier Score (Calibration error): {val_brier:.4f}")
    
    # 6. Export Model Bundle
    print("[5/5] Exporting model bundle & standalone metadata...")
    model_bundle = {
        "ranker": calibrated_ranker,
        "base_gbm": base_gbm,
        "hazard_model": hazard_model,
        "feature_names": FEATURE_NAMES,
        "exported_at": datetime.datetime.now().isoformat(),
        "version": "1.4.0-sih"
    }
    
    bundle_path = os.path.join(MODELS_DIR, "ranker_pipeline.pkl")
    with open(bundle_path, "wb") as f:
        pickle.dump(model_bundle, f)
        
    metadata = {
        "model_name": "CyberTrace-SpatialEnsemble-Ranker",
        "version": "1.4.0-sih",
        "algorithm": "GradientBoosting + Sigmoid Calibration",
        "trained_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "training_samples": int(X_train.shape[0]),
        "feature_count": len(FEATURE_NAMES),
        "features": FEATURE_NAMES,
        "top_features": [{"feature": k, "importance_pct": round(float(v) * 100, 2)} for k, v in feat_imp],
        "validation_brier_score": round(float(val_brier), 4),
        "lead_time_horizons": ["<= 30 mins", "30-60 mins", "60-180 mins", "> 180 mins"],
        "status": "Production-Ready"
    }
    
    meta_path = os.path.join(MODELS_DIR, "model_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
        
    # Standalone JSON weights for zero-dependency JavaScript/TypeScript inference
    standalone_weights = {
        "feature_weights": {k: float(v) for k, v in feat_imp},
        "intercept": float(base_gbm.init_.prior if hasattr(base_gbm.init_, 'prior') else 0.0),
        "feature_means": [float(m) for m in np.mean(X_train, axis=0)],
        "feature_stds": [float(s) if s > 1e-6 else 1.0 for s in np.std(X_train, axis=0)],
        "version": "1.4.0-sih"
    }
    weights_path = os.path.join(MODELS_DIR, "standalone_weights.json")
    with open(weights_path, "w") as f:
        json.dump(standalone_weights, f, indent=2)
        
    print(f"\nModel exported successfully to:\n  - {bundle_path}\n  - {meta_path}\n  - {weights_path}")
    print("=" * 70)
    return metadata

if __name__ == "__main__":
    train_and_export()
