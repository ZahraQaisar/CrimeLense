"""
debug_inference.py
Run: python debug_inference.py
Shows exactly what feature values the models receive at inference time
vs what they should be getting from the training data.
"""

import pickle, json
import numpy as np
import pandas as pd
from pathlib import Path

MODELS_DIR = Path("../../Models files").resolve()

print("=" * 60)
print("  CrimeLense Model Debug Tool")
print("=" * 60)

# Load assets
with open(MODELS_DIR / "feature_cols.pkl", "rb") as f:
    feature_cols = pickle.load(f)

with open(MODELS_DIR / "feature_lookup_tables.pkl", "rb") as f:
    lookup = pickle.load(f)

with open(MODELS_DIR / "area_profiles.json") as f:
    area_prof = pickle.load(open(MODELS_DIR / "area_profiles.json".replace(".json",""), "rb")) if False else json.load(open(MODELS_DIR / "area_profiles.json"))

with open(MODELS_DIR / "bin_threshold.pkl", "rb") as f:
    threshold = pickle.load(f)

# ── What keys exist in lookup tables? ──────────────────────────────────────
print("\n📦 Keys in feature_lookup_tables.pkl:")
for key in lookup.keys():
    val = lookup[key]
    if isinstance(val, dict):
        sample = list(val.items())[:3]
        print(f"   {key}: dict with {len(val)} entries  | sample: {sample}")
    elif isinstance(val, list):
        print(f"   {key}: list with {len(val)} items    | sample: {val[:5]}")
    else:
        print(f"   {key}: {type(val).__name__} = {val}")

# ── Binary threshold ────────────────────────────────────────────────────────
print(f"\n🎯 Binary threshold: {threshold}")

# ── Area profiles summary ────────────────────────────────────────────────────
print(f"\n🗺️  Area profiles loaded: {list(area_prof.keys())[:5]}...")

# ── Simulate features for Downtown LA, 2 PM ─────────────────────────────────
import datetime, sys
sys.path.insert(0, str(Path(__file__).parent))

# Replicate engineer_features logic
hour, month, weapon = 14, 4, 0
lat, lon = 34.0522, -118.2437

LAPD_DIVISIONS = [
    ("Central",1,34.0441,-118.2433),("Rampart",2,34.0672,-118.2784),
    ("Southwest",3,34.0140,-118.3025),("Hollenbeck",4,34.0590,-118.2110),
    ("Hollywood",6,34.0983,-118.3267),
]

def nearest_area(lat, lon):
    best_id, best_d = 1, float("inf")
    for _, aid, dlat, dlon in LAPD_DIVISIONS:
        d = (dlat-lat)**2 + (dlon-lon)**2
        if d < best_d:
            best_d, best_id = d, aid
    return best_id

area_id = nearest_area(lat, lon)
print(f"\n📍 Input: lat={lat}, lon={lon}, hour={hour}, month={month}")
print(f"   → Mapped to LAPD Area ID: {area_id}")

geo_norm   = lookup.get("geo_norm", {})
viol_ratio = lookup.get("violent_ratio", {})
area_sev   = lookup.get("area_sev_mean", {})
hr_map     = lookup.get("hour_risk", {})

area_crime_density = float(geo_norm.get(area_id, geo_norm.get(0, "MISSING")))
area_violent_ratio = float(viol_ratio.get(area_id, "DEFAULT=0.3"))
area_sev_mean      = float(area_sev.get(area_id, "DEFAULT=1.7"))
hour_risk_score    = float(hr_map.get(hour, "DEFAULT=0.5"))

print(f"\n📊 Key Feature Values (what the model actually sees):")
print(f"   area_crime_density : {area_crime_density:.4f}  ← Should be HIGH for Downtown (>0.5)")
print(f"   area_violent_ratio : {area_violent_ratio:.4f}  ← Should be HIGH for Downtown (>0.3)")
print(f"   area_sev_mean      : {area_sev_mean:.4f}  ← Severity mean")
print(f"   hour_risk_score    : {hour_risk_score:.4f}  ← Should be low for 2PM (0.3-0.5)")

print(f"\n🔍 geo_norm lookup keys sample: {list(geo_norm.keys())[:10]}")
print(f"   (area_id={area_id} exists in geo_norm: {area_id in geo_norm})")

# ── Load binary model and get raw probabilities ──────────────────────────────
print("\n" + "="*60)
print("  Running Binary Model Directly")
print("="*60)

try:
    with open(MODELS_DIR / "final_bin_xgb.pkl", "rb") as f:
        bin_xgb = pickle.load(f)

    # Create a minimal feature row
    n_features = len(feature_cols)
    print(f"   Model expects {n_features} features: {feature_cols[:5]}...")

    # Check if model has feature_names_in_
    if hasattr(bin_xgb, 'feature_names_in_'):
        print(f"   Model's feature names match feature_cols: {list(bin_xgb.feature_names_in_) == list(feature_cols)}")

except Exception as e:
    print(f"   Could not load binary model: {e}")

print("\n✅ Debug complete. Check the values above to identify the mismatch.")
print("   Expected: area_crime_density > 0.5 for Downtown LA")
print("   If it's very low (< 0.1), that's why model says SAFE.")
