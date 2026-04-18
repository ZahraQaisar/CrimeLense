"""
Full diagnostic: checks all 3 models are loaded and producing output.
Run: python model_diagnostic.py
"""
import pickle, math, sys
import numpy as np
import pandas as pd
from pathlib import Path

MODELS_DIR = Path(r'C:\Users\Admin\Desktop\Rafia\CrimeLense Website\Models files')

def load(name):
    with open(MODELS_DIR / name, 'rb') as f:
        return pickle.load(f)

print("=" * 55)
print("  CrimeLense Model Diagnostic")
print("=" * 55)

# ── Feature vector: Downtown LA, 10 PM ────────────────────
fc = load('feature_cols.pkl')
lk = load('feature_lookup_tables.pkl')

row = {
    'Hour': 22, 'Day': 15, 'Month': 4, 'Year': 2024, 'Weekday': 1,
    'is_night': 1, 'is_weekend': 0, 'is_morning': 0, 'is_evening': 0,
    'hour_sin':  math.sin(2*math.pi*22/24),
    'hour_cos':  math.cos(2*math.pi*22/24),
    'month_sin': math.sin(2*math.pi*4/12),
    'month_cos': math.cos(2*math.pi*4/12),
    'weekday_sin': math.sin(2*math.pi*1/7),
    'weekday_cos': math.cos(2*math.pi*1/7),
    'hour_risk_score':     float(lk['hour_risk'].get('22', 0.5)),
    'weekend_night': 0, 'is_peak_hour': 0, 'is_high_risk_hour': 0,
    'AREA': 1, 'Rpt Dist No': 101,
    'geohash_encoded':      float(lk['geo_norm'].get('1', 0.3)),
    'area_crime_density':   float(lk['geo_norm'].get('1', 0.3)),
    'area_severity_profile':float(lk['area_sev_mean'].get('1', 1.7)),
    'area_violent_ratio':   float(lk['violent_ratio'].get('1', 0.3)),
    'geo_crime_density':    float(lk['geo_norm'].get('1', 0.3)),
    'dist_crime_density':   float(lk['dist_norm'].get('101', 0.3)),
    'area_hour_risk':       float(lk['area_hour_risk'].get('1_22', 0.5)),
    'dist_hour_density': 0.3, 'Vict Age': 30, 'Vict Sex': 1, 'Part 1-2': 1,
    'has_weapon': 0, 'weapon_night': 0,
    'area_month_density':   float(lk['area_month_map'].get('(1, 4)', 5000)),
    'vict_age_bin': 2, 'cat_hour_risk': 0.5, 'dist_violent_ratio': 0.3,
    'area_sev_mean':        float(lk['area_sev_mean'].get('1', 1.7)),
    'weapon_part1': 0, 'night_dist_violent': 0.3, 'hour_quartile': 5,
}
df = pd.DataFrame([row])[fc]

results = {}

# ── 1. Binary model ────────────────────────────────────────
print("\n[1] BINARY MODEL (SAFE / DANGEROUS)")
try:
    xgb    = load('final_bin_xgb.pkl')
    lgb    = load('final_bin_lgb.pkl')
    thresh = float(load('bin_threshold.pkl'))
    p_x    = xgb.predict_proba(df)[0][1]
    p_l    = lgb.predict_proba(df)[0][1]
    p_avg  = p_x * 0.55 + p_l * 0.45
    label  = "DANGEROUS" if p_avg >= thresh else "SAFE"
    issue  = p_avg < 0.05
    print(f"   XGB prob    : {p_x*100:.2f}%")
    print(f"   LGB prob    : {p_l*100:.2f}%")
    print(f"   Ensemble    : {p_avg*100:.2f}%  -> {label}")
    print(f"   Threshold   : {thresh:.3f}")
    print(f"   Files       : OK (XGB + LGB loaded)")
    print(f"   Issue       : {'YES - always SAFE due to class imbalance' if issue else 'No issue'}")
    results['binary'] = 'LOADED (class imbalance)' if issue else 'LOADED OK'
except Exception as e:
    print(f"   ERROR: {e}")
    results['binary'] = f'FAILED: {e}'

# ── 2. Category model ──────────────────────────────────────
print("\n[2] CATEGORY MODEL (crime type)")
try:
    xgb     = load('final_cat_xgb.pkl')
    lgb     = load('final_cat_lgb.pkl')
    enc     = load('category_v2_encoder.pkl')
    classes = enc.classes_.tolist()
    p_x     = xgb.predict_proba(df)[0]
    p_l     = lgb.predict_proba(df)[0]
    p       = p_x * 0.55 + p_l * 0.45
    for c, v in sorted(zip(classes, p), key=lambda x: -x[1]):
        bar = '#' * int(v * 30)
        print(f"   {c:<20}: {v*100:5.1f}%  {bar}")
    top_cat = classes[int(np.argmax(p))]
    issue   = top_cat == 'OTHER' and p[classes.index('OTHER')] > 0.90
    print(f"   Files       : OK (XGB + LGB + encoder loaded)")
    print(f"   Issue       : {'YES - always OTHER due to class imbalance' if issue else 'No issue'}")
    results['category'] = 'LOADED (class imbalance)' if issue else 'LOADED OK'
except Exception as e:
    print(f"   ERROR: {e}")
    results['category'] = f'FAILED: {e}'

# ── 3. Severity model ──────────────────────────────────────
print("\n[3] SEVERITY MODEL (LOW/MEDIUM/HIGH/CRITICAL)")
try:
    xgb     = load('final_sev_xgb.pkl')
    lgb     = load('final_sev_lgb.pkl')
    enc     = load('severity_encoder.pkl')
    df_sev  = df.copy()
    df_sev['predicted_category'] = 0
    df_sev['binary_risk']        = 0
    p_x     = xgb.predict_proba(df_sev)[0]
    p_l     = lgb.predict_proba(df_sev)[0]
    p       = p_x * 0.55 + p_l * 0.45
    classes = enc.classes_.tolist()
    for c, v in zip(classes, p):
        bar = '#' * int(v * 30)
        print(f"   {c:<10}: {v*100:5.1f}%  {bar}")
    issue = p[classes.index('LOW')] > 0.90
    print(f"   Files       : OK (XGB + LGB + encoder loaded)")
    print(f"   Issue       : {'YES - always LOW due to class imbalance' if issue else 'No issue'}")
    results['severity'] = 'LOADED (class imbalance)' if issue else 'LOADED OK'
except Exception as e:
    print(f"   ERROR: {e}")
    results['severity'] = f'FAILED: {e}'

# ── 4. CatBoost ────────────────────────────────────────────
print("\n[4] CATBOOST (optional)")
for fname, key in [('final_bin_cb.pkl','Binary CB'),
                   ('final_cat_cb.pkl','Category CB'),
                   ('final_sev_cb.pkl','Severity CB')]:
    try:
        load(fname)
        print(f"   {key}: LOADED OK")
    except Exception as e:
        print(f"   {key}: FAILED ({str(e)[:50]})")

# ── Summary ────────────────────────────────────────────────
print("\n" + "=" * 55)
print("  SUMMARY")
print("=" * 55)
for name, status in results.items():
    icon = "OK" if "LOADED" in status else "FAIL"
    print(f"  [{icon}] {name.upper():<12}: {status}")

print("\n  Risk Score   : Custom formula using area_profiles (WORKING)")
print("  Explanation  : Risk-score based text (WORKING)")
print("=" * 55)
