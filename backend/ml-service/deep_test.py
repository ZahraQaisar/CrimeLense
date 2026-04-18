"""
Deep test: compare model output with WRONG (default) vs CORRECT (new lookup) features.
This proves whether the geo_norm fix actually changes model predictions.
"""
import pickle, math, pandas as pd, numpy as np
from pathlib import Path

D   = Path(r'C:\Users\Admin\Desktop\Rafia\CrimeLense Website\Models files')
lk  = pickle.load(open(D/'feature_lookup_tables.pkl','rb'))
fc  = pickle.load(open(D/'feature_cols.pkl','rb'))
xgb = pickle.load(open(D/'final_cat_xgb.pkl','rb'))
lgb = pickle.load(open(D/'final_cat_lgb.pkl','rb'))
enc = pickle.load(open(D/'category_v2_encoder.pkl','rb'))
bxg = pickle.load(open(D/'final_bin_xgb.pkl','rb'))
blg = pickle.load(open(D/'final_bin_lgb.pkl','rb'))
sxg = pickle.load(open(D/'final_sev_xgb.pkl','rb'))
slg = pickle.load(open(D/'final_sev_lgb.pkl','rb'))
senc= pickle.load(open(D/'severity_encoder.pkl','rb'))

cat_key = "('OTHER', 22)"

def make_row(area_density, hour_risk, cat_hr, area=1, hour=22, weapon=0):
    is_night = 1 if (hour >= 20 or hour < 6) else 0
    return {
        'Hour': hour, 'Day': 18, 'Month': 4, 'Year': 2024, 'Weekday': 4,
        'is_night': is_night, 'is_weekend': 0, 'is_morning': 0, 'is_evening': 0,
        'hour_sin': math.sin(2*math.pi*hour/24),
        'hour_cos': math.cos(2*math.pi*hour/24),
        'month_sin': math.sin(2*math.pi*4/12),
        'month_cos': math.cos(2*math.pi*4/12),
        'weekday_sin': math.sin(2*math.pi*4/7),
        'weekday_cos': math.cos(2*math.pi*4/7),
        'hour_risk_score': hour_risk, 'weekend_night': 0,
        'is_peak_hour': 0, 'is_high_risk_hour': 1 if is_night else 0,
        'AREA': area, 'Rpt Dist No': area*100+1,
        'geohash_encoded': area_density,
        'area_crime_density': area_density,
        'area_severity_profile': lk['area_sev_mean'].get(area, 1.7),
        'area_violent_ratio': lk['violent_ratio'].get(area, 0.3),
        'geo_crime_density': area_density,
        'dist_crime_density': lk['dist_norm'].get(area*100+1, 0.3),
        'area_hour_risk': lk['area_hour_risk'].get(f'{area}_{hour}', hour_risk),
        'dist_hour_density': lk['dist_norm'].get(area*100+1, 0.3) * hour_risk,
        'Vict Age': 30, 'Vict Sex': 1, 'Part 1-2': 1,
        'has_weapon': weapon, 'weapon_night': weapon*is_night,
        'area_month_density': lk['area_month_map'].get(f'({area}, 4)', 5000),
        'vict_age_bin': 2, 'cat_hour_risk': cat_hr,
        'dist_violent_ratio': lk['dist_violent'].get(area*100+1, 0.3),
        'area_sev_mean': lk['area_sev_mean'].get(area, 1.7),
        'weapon_part1': weapon, 'night_dist_violent': is_night * lk['dist_violent'].get(area*100+1, 0.3),
        'hour_quartile': hour // 6,
    }

def predict_all(row, label):
    df = pd.DataFrame([row])[fc]
    # Category
    pc = xgb.predict_proba(df)[0]*0.55 + lgb.predict_proba(df)[0]*0.45
    cat_label = enc.classes_[np.argmax(pc)]
    # Binary
    pb = bxg.predict_proba(df)[0]*0.55 + blg.predict_proba(df)[0]*0.45
    danger = pb[1]
    # Severity
    df_s = df.copy()
    df_s['predicted_category'] = int(np.argmax(pc))
    df_s['binary_risk']        = 1 if danger >= 0.49 else 0
    ps = sxg.predict_proba(df_s)[0]*0.55 + slg.predict_proba(df_s)[0]*0.45
    sev_label = senc.classes_[np.argmax(ps)]
    print(f"\n{label}")
    print(f"  Category  : {cat_label} ({max(pc)*100:.1f}%)")
    print(f"  Severity  : {sev_label}  (H={ps[list(senc.classes_).index('HIGH')]*100:.1f}% M={ps[list(senc.classes_).index('MEDIUM')]*100:.1f}%)")
    print(f"  Danger%%   : {danger*100:.2f}%%")
    for c,v in sorted(zip(enc.classes_, pc), key=lambda x:-x[1]):
        bar = '#'*int(v*30)
        print(f"    {c:<20}: {v*100:5.1f}%%  {bar}")

# Values from new lookup
v_area     = lk['geo_norm'].get(1, 0.3)
v_hour_r   = lk['hour_risk'].get(22, 0.5)
v_cat_hr   = lk['cat_hour_risk'].get(cat_key, 0.5)

print("="*60)
print(f"New lookup values for Downtown (AREA=1), hour=22:")
print(f"  geo_norm[1]           = {v_area:.4f}")
print(f"  hour_risk[22]         = {v_hour_r:.4f}")
print(f"  cat_hour_risk OTHER22 = {v_cat_hr:.4f}")
print("="*60)

# Test 1: old broken defaults (0.3 everywhere)
predict_all(make_row(0.3, 0.5, 0.5), "OLD DEFAULTS (0.3/0.5/0.5)")

# Test 2: new correct values
predict_all(make_row(v_area, v_hour_r, v_cat_hr), "NEW CORRECT (from lookup)")

# Test 3: just changing area density
predict_all(make_row(1.0, 0.5, 0.5), "Only area_density=1.0, rest default")
predict_all(make_row(0.3, 0.5, 0.0), "Only cat_hour_risk=0.0, rest default")
