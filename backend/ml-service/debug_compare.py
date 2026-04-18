"""Debug: compare feature values between diagnostic and Flask engineer_features."""
import pickle, math
import numpy as np
import pandas as pd
from pathlib import Path

MODELS_DIR = Path(r'C:\Users\Admin\Desktop\Rafia\CrimeLense Website\Models files')
def load(n): return pickle.load(open(MODELS_DIR/n,'rb'))

lk = load('feature_lookup_tables.pkl')
fc = load('feature_cols.pkl')

lat, lon, hour, month = 34.044, -118.243, 22, 4

LAPD_DIVISIONS = [
    ("Central",1,34.0441,-118.2433), ("Rampart",2,34.0672,-118.2784),
    ("Olympic",21,34.0506,-118.2889),
]

def nearest_area(lat, lon):
    best, d = 1, float('inf')
    for nm, aid, dlat, dlon in [
        ("Central",1,34.0441,-118.2433),("Rampart",2,34.0672,-118.2784),
        ("Southwest",3,34.0140,-118.3025),("Hollenbeck",4,34.0590,-118.2110),
        ("Harbor",5,33.7527,-118.2837),("Hollywood",6,34.0983,-118.3267),
        ("Wilshire",7,34.0614,-118.3440),("West LA",8,34.0440,-118.4430),
        ("Van Nuys",9,34.1861,-118.4495),("West Valley",10,34.1831,-118.5710),
        ("Northeast",11,34.1210,-118.2090),("77th Street",12,33.9510,-118.2870),
        ("Newton",13,34.0120,-118.2610),("Pacific",14,33.9950,-118.4550),
        ("N Hollywood",15,34.1860,-118.3810),("Foothill",16,34.2640,-118.3530),
        ("Devonshire",17,34.2890,-118.5020),("Southeast",18,33.9220,-118.2290),
        ("Mission",19,34.2790,-118.4400),("Topanga",20,34.2240,-118.6360),
        ("Olympic",21,34.0506,-118.2889),
    ]:
        dd = (dlat-lat)**2+(dlon-lon)**2
        if dd < d:
            d, best = dd, aid
    return best

area_id = nearest_area(lat, lon)
rpt_dist = area_id * 100 + 1
s_area = str(area_id)
s_dist = str(rpt_dist)
s_hour = str(hour)

geo  = lk.get('geo_norm', {})
hr   = lk.get('hour_risk', {})
ahr  = lk.get('area_hour_risk', {})
amm  = lk.get('area_month_map', {})
dn   = lk.get('dist_norm', {})
dv   = lk.get('dist_violent', {})
vr   = lk.get('violent_ratio', {})
sm   = lk.get('area_sev_mean', {})
chr_ = lk.get('cat_hour_risk', {})

print("=== FEATURE DEBUG ===")
print(f"area_id              = {area_id} ({['Central','Rampart','Southwest','Hollenbeck','Harbor','Hollywood','Wilshire','West LA','Van Nuys','West Valley','Northeast','77th Street','Newton','Pacific','N Hollywood','Foothill','Devonshire','Southeast','Mission','Topanga','Olympic'][area_id-1]})")
print(f"rpt_dist             = {rpt_dist}")
print()
print(f"geo_norm[{s_area!r}]      = {geo.get(s_area, 'MISSING')}")
print(f"hour_risk[{s_hour!r}]    = {hr.get(s_hour, 'MISSING')}")
print(f"area_hour_risk key   = '{area_id}_{hour}'")
print(f"area_hour_risk val   = {ahr.get(f'{area_id}_{hour}', 'MISSING')}")
print(f"dist_norm[{s_dist!r}]  = {dn.get(s_dist, 'MISSING')}")
print(f"violent_ratio[{s_area!r}] = {vr.get(s_area, 'MISSING')}")
print(f"area_sev_mean[{s_area!r}] = {sm.get(s_area, 'MISSING')}")
print(f"area_month_map key   = '({area_id}, {month})'")
print(f"area_month_map val   = {amm.get(f'({area_id}, {month})', 'MISSING')}")
print()

# cat_hour_risk key format check
sample_key = list(chr_.keys())[0]
print(f"cat_hour_risk sample key format: {sample_key!r}")
flask_key = f"('OTHER', {hour})"
print(f"Flask uses key: {flask_key!r}")
print(f"Value found: {chr_.get(flask_key, 'MISSING')}")
print()

# Now build actual features and test model
print("=== RUNNING MODEL ===")
cat_xgb = load('final_cat_xgb.pkl')
cat_lgb = load('final_cat_lgb.pkl')
cat_enc = load('category_v2_encoder.pkl')

hour_risk_score = float(hr.get(s_hour, 0.5))
area_crime_density = float(geo.get(s_area, 0.3))
area_violent_ratio = float(vr.get(s_area, 0.32))
area_sev_mean_val  = float(sm.get(s_area, 1.7))
dist_crime_density = float(dn.get(s_dist, area_crime_density))
dist_violent_ratio = float(dv.get(s_dist, area_violent_ratio))
area_hour_risk     = float(ahr.get(f'{area_id}_{hour}', hour_risk_score))
area_month_density = float(amm.get(f'({area_id}, {month})', 5000))
cat_hour_risk      = float(chr_.get(flask_key, hour_risk_score))

import datetime
now = datetime.datetime.now()
weekday = now.weekday()

row = {
    'Hour': hour, 'Day': now.day, 'Month': month, 'Year': now.year, 'Weekday': weekday,
    'is_night': 1, 'is_weekend': 0, 'is_morning': 0, 'is_evening': 0,
    'hour_sin': math.sin(2*math.pi*hour/24), 'hour_cos': math.cos(2*math.pi*hour/24),
    'month_sin': math.sin(2*math.pi*month/12), 'month_cos': math.cos(2*math.pi*month/12),
    'weekday_sin': math.sin(2*math.pi*weekday/7), 'weekday_cos': math.cos(2*math.pi*weekday/7),
    'hour_risk_score': hour_risk_score, 'weekend_night': 0,
    'is_peak_hour': 0, 'is_high_risk_hour': 1,
    'AREA': area_id, 'Rpt Dist No': rpt_dist,
    'geohash_encoded': area_crime_density, 'area_crime_density': area_crime_density,
    'area_severity_profile': area_sev_mean_val, 'area_violent_ratio': area_violent_ratio,
    'geo_crime_density': area_crime_density, 'dist_crime_density': dist_crime_density,
    'area_hour_risk': area_hour_risk, 'dist_hour_density': dist_crime_density * hour_risk_score,
    'Vict Age': 30, 'Vict Sex': 1, 'Part 1-2': 1,
    'has_weapon': 0, 'weapon_night': 0,
    'area_month_density': area_month_density, 'vict_age_bin': 2,
    'cat_hour_risk': cat_hour_risk, 'dist_violent_ratio': dist_violent_ratio,
    'area_sev_mean': area_sev_mean_val, 'weapon_part1': 0,
    'night_dist_violent': 1 * dist_violent_ratio, 'hour_quartile': hour // 6,
}

df = pd.DataFrame([row])[fc]
px = cat_xgb.predict_proba(df)[0]
pl = cat_lgb.predict_proba(df)[0]
p  = px * 0.55 + pl * 0.45
classes = cat_enc.classes_.tolist()

print("Category predictions with Flask-exact features:")
for c, v in sorted(zip(classes, p), key=lambda x: -x[1]):
    print(f"  {c:<20}: {v*100:.1f}%")
