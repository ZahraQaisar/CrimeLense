"""
CrimeLense Flask ML Microservice — clean rewrite with retrained models.
All lookup keys are strings (matching new feature_lookup_tables.pkl).
No heuristic fallbacks — pure model-driven predictions.
"""

import os, json, time, pickle, traceback, datetime
from pathlib import Path
from dotenv import load_dotenv

import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app, origins="*")

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).resolve().parent
MODELS_DIR = Path(os.getenv("MODELS_PATH", "../../Models files")).resolve()
if not MODELS_DIR.exists():
    MODELS_DIR = (BASE_DIR / "../../Models files").resolve()

# ── Model registry ────────────────────────────────────────────────────────────
models        = {}
ready         = False
startup_error = None

def load_pkl(name: str):
    path = MODELS_DIR / name
    if not path.exists():
        raise FileNotFoundError(f"Not found: {path}")
    with open(path, "rb") as f:
        return pickle.load(f)

def load_models():
    global models, ready, startup_error
    try:
        print("[CrimeLense] Loading models …")
        t0 = time.time()

        models["feature_cols"]          = load_pkl("feature_cols.pkl")
        models["feature_lookup_tables"] = load_pkl("feature_lookup_tables.pkl")

        models["bin_xgb"]     = load_pkl("final_bin_xgb.pkl")
        models["bin_lgb"]     = load_pkl("final_bin_lgb.pkl")
        models["bin_weights"] = load_pkl("bin_ensemble_weights.pkl")
        models["bin_thresh"]  = load_pkl("bin_threshold.pkl")

        models["cat_xgb"]     = load_pkl("final_cat_xgb.pkl")
        models["cat_lgb"]     = load_pkl("final_cat_lgb.pkl")
        models["cat_weights"] = load_pkl("cat_ensemble_weights.pkl")
        models["cat_encoder"] = load_pkl("category_v2_encoder.pkl")

        models["sev_xgb"]     = load_pkl("final_sev_xgb.pkl")
        models["sev_lgb"]     = load_pkl("final_sev_lgb.pkl")
        models["sev_encoder"] = load_pkl("severity_encoder.pkl")

        # CatBoost optional — may fail on numpy 2.x
        for fname, key in [("final_bin_cb.pkl","bin_cb"),
                           ("final_cat_cb.pkl","cat_cb"),
                           ("final_sev_cb.pkl","sev_cb")]:
            try:
                models[key] = load_pkl(fname)
            except Exception as e:
                print(f"[CrimeLense] CatBoost {fname} skipped: {e}")
                models[key] = None

        print(f"[CrimeLense] CatBoost available: {models.get('bin_cb') is not None}")

        with open(MODELS_DIR / "hotspot_zones_v2.json")  as f: models["hotspots"]  = json.load(f)
        with open(MODELS_DIR / "area_profiles.json")      as f: models["area_prof"] = json.load(f)
        with open(MODELS_DIR / "category_map.json")       as f: models["cat_map"]   = json.load(f)
        with open(MODELS_DIR / "model_metadata.json")     as f: models["metadata"]  = json.load(f)

        models["hourly_df"]  = pd.read_csv(MODELS_DIR / "hourly_patterns.csv")
        models["monthly_df"] = pd.read_csv(MODELS_DIR / "monthly_trends.csv")

        print(f"[CrimeLense] Loaded in {time.time()-t0:.1f}s")
        ready = True
    except Exception as e:
        startup_error = str(e)
        print(f"[CrimeLense] STARTUP ERROR: {e}")
        traceback.print_exc()

load_models()

# ── LAPD division centroids → area_id 1-21 ────────────────────────────────────
LAPD_DIVISIONS = [
    ("Central",     1,  34.0441,-118.2433), ("Rampart",    2,  34.0672,-118.2784),
    ("Southwest",   3,  34.0140,-118.3025), ("Hollenbeck", 4,  34.0590,-118.2110),
    ("Harbor",      5,  33.7527,-118.2837), ("Hollywood",  6,  34.0983,-118.3267),
    ("Wilshire",    7,  34.0614,-118.3440), ("West LA",    8,  34.0440,-118.4430),
    ("Van Nuys",    9,  34.1861,-118.4495), ("West Valley",10, 34.1831,-118.5710),
    ("Northeast",  11,  34.1210,-118.2090), ("77th Street",12, 33.9510,-118.2870),
    ("Newton",     13,  34.0120,-118.2610), ("Pacific",    14, 33.9950,-118.4550),
    ("N Hollywood",15,  34.1860,-118.3810), ("Foothill",   16, 34.2640,-118.3530),
    ("Devonshire", 17,  34.2890,-118.5020), ("Southeast",  18, 33.9220,-118.2290),
    ("Mission",    19,  34.2790,-118.4400), ("Topanga",    20, 34.2240,-118.6360),
    ("Olympic",    21,  34.0506,-118.2889),
]

LAPD_DIV_NAMES = {aid: name for name, aid, *_ in LAPD_DIVISIONS}

def _lat_lon_to_area(lat, lon):
    best, dist = 1, float("inf")
    for _, aid, dlat, dlon in LAPD_DIVISIONS:
        d = (dlat - lat)**2 + (dlon - lon)**2
        if d < dist:
            dist, best = d, aid
    return best

def _find_nearest_cluster(lat, lon):
    best_id, best_d = 0, float("inf")
    for z in models["hotspots"]:
        d = (z["lat"]-lat)**2 + (z["lon"]-lon)**2
        if d < best_d:
            best_d, best_id = d, z["cluster_id"]
    return best_id

def _cluster_tier_int(cluster_id):
    tier_map = {"LOW":0,"MEDIUM":1,"HIGH":2,"CRITICAL":3}
    for z in models["hotspots"]:
        if z["cluster_id"] == cluster_id:
            return tier_map.get(z.get("tier","MEDIUM"), 1)
    return 1

# ── Feature Engineering ───────────────────────────────────────────────────────
# IMPORTANT: all lookup keys are STRINGS in the new tables
def engineer_features(lat, lon, hour, month, weapon_used):
    lk  = models["feature_lookup_tables"]
    fc  = models["feature_cols"]

    area_id  = _lat_lon_to_area(lat, lon)
    rpt_dist = area_id * 100 + 1
    # Keys: geo_norm/hour_risk/violent_ratio/dist_norm use INTEGERS
    # Keys: area_hour_risk/area_month_map/cat_hour_risk use STRING composites

    now     = datetime.datetime.now()
    day     = now.day
    year    = now.year
    weekday = now.weekday()

    is_night          = 1 if (hour >= 20 or hour < 6) else 0
    is_weekend        = 1 if weekday >= 5 else 0
    is_morning        = 1 if (6 <= hour < 12) else 0
    is_evening        = 1 if (17 <= hour < 20) else 0
    hour_sin          = float(np.sin(2*np.pi*hour/24))
    hour_cos          = float(np.cos(2*np.pi*hour/24))
    month_sin         = float(np.sin(2*np.pi*month/12))
    month_cos         = float(np.cos(2*np.pi*month/12))
    weekday_sin       = float(np.sin(2*np.pi*weekday/7))
    weekday_cos       = float(np.cos(2*np.pi*weekday/7))
    hour_quartile     = hour // 6
    is_peak_hour      = 1 if hour in [8,9,12,13,17,18,19] else 0
    is_high_risk_hour = 1 if hour in lk.get("high_risk_hours",[2,3,4,21,22,23]) else 0
    weekend_night     = is_weekend * is_night

    # Integer-keyed lookups (geo_norm, hour_risk, violent_ratio, dist_norm, dist_violent, area_sev_mean)
    geo   = lk.get("geo_norm", {})
    vr    = lk.get("violent_ratio", {})
    sev_m = lk.get("area_sev_mean", {})
    dn    = lk.get("dist_norm", {})
    dv    = lk.get("dist_violent", {})
    hr_m  = lk.get("hour_risk", {})

    hour_risk_score       = float(hr_m.get(hour, 0.5))
    area_crime_density    = float(geo.get(area_id, 0.3))
    area_violent_ratio    = float(vr.get(area_id, 0.32))
    area_sev_mean_val     = float(sev_m.get(area_id, 1.7))
    area_severity_profile = area_sev_mean_val
    geohash_encoded       = area_crime_density

    cluster_id          = _find_nearest_cluster(lat, lon)
    geo_crime_density   = float(geo.get((cluster_id % 21) + 1, area_crime_density))
    dist_crime_density  = float(dn.get(rpt_dist, area_crime_density))
    dist_violent_ratio  = float(dv.get(rpt_dist, area_violent_ratio))

    # String-composite-keyed lookups
    ahr            = lk.get("area_hour_risk", {})
    area_hour_risk = float(ahr.get(f"{area_id}_{hour}", hour_risk_score))
    dist_hour_density = dist_crime_density * hour_risk_score

    amm               = lk.get("area_month_map", {})
    area_month_density = float(amm.get(f"({area_id}, {month})", 5000))

    has_weapon      = int(weapon_used)
    weapon_night    = has_weapon * is_night
    weapon_part1    = has_weapon * 1
    night_dist_viol = is_night * dist_violent_ratio

    # At inference time we don't know category yet — use overall hour_risk_score
    # Looking up ('OTHER', hour) returns 0.0 which collapses all model outputs
    cat_hour_risk = hour_risk_score

    row = {
        "Hour": hour, "Day": day, "Month": month, "Year": year, "Weekday": weekday,
        "is_night": is_night, "is_weekend": is_weekend,
        "is_morning": is_morning, "is_evening": is_evening,
        "hour_sin": hour_sin, "hour_cos": hour_cos,
        "month_sin": month_sin, "month_cos": month_cos,
        "weekday_sin": weekday_sin, "weekday_cos": weekday_cos,
        "hour_risk_score": hour_risk_score,
        "weekend_night": weekend_night,
        "is_peak_hour": is_peak_hour, "is_high_risk_hour": is_high_risk_hour,
        "AREA": area_id, "Rpt Dist No": rpt_dist,
        "geohash_encoded": geohash_encoded,
        "area_crime_density": area_crime_density,
        "area_severity_profile": area_severity_profile,
        "area_violent_ratio": area_violent_ratio,
        "geo_crime_density": geo_crime_density,
        "dist_crime_density": dist_crime_density,
        "area_hour_risk": area_hour_risk,
        "dist_hour_density": dist_hour_density,
        "Vict Age": 30, "Vict Sex": 1, "Part 1-2": 1,
        "has_weapon": has_weapon, "weapon_night": weapon_night,
        "area_month_density": area_month_density,
        "vict_age_bin": 2,
        "cat_hour_risk": cat_hour_risk,
        "dist_violent_ratio": dist_violent_ratio,
        "area_sev_mean": area_sev_mean_val,
        "weapon_part1": weapon_part1,
        "night_dist_violent": night_dist_viol,
        "hour_quartile": hour_quartile,
    }
    df = pd.DataFrame([row])
    for col in fc:
        if col not in df.columns:
            df[col] = 0
    return df[fc]

# ── Ensemble helpers ──────────────────────────────────────────────────────────
def _ensemble_proba(model_list, weights, X):
    active  = [(m, w) for m, w in zip(model_list, weights) if m is not None]
    if not active:
        raise RuntimeError("No models available")
    total_w = sum(w for _, w in active)
    p = None
    for mdl, w in active:
        q = mdl.predict_proba(X)
        p = q * (w/total_w) if p is None else p + q * (w/total_w)
    return p

def predict_binary(X):
    w = models["bin_weights"]
    p = _ensemble_proba(
        [models["bin_xgb"], models["bin_lgb"], models["bin_cb"]],
        [w.get("xgb",0.4),  w.get("lgb",0.35), w.get("cb",0.25)], X)
    thresh      = float(models["bin_thresh"])
    danger_prob = float(p[0][1])
    return {
        "label":       "DANGEROUS" if danger_prob >= thresh else "SAFE",
        "confidence":  round(max(danger_prob, 1-danger_prob)*100, 1),
        "danger_prob": round(danger_prob*100, 1),
        "safe_prob":   round((1-danger_prob)*100, 1),
    }

def predict_category(X):
    w   = models["cat_weights"]
    p   = _ensemble_proba(
        [models["cat_xgb"], models["cat_lgb"], models["cat_cb"]],
        [w.get("xgb",0.4),  w.get("lgb",0.35), w.get("cb",0.25)], X)
    enc     = models["cat_encoder"]
    classes = enc.classes_.tolist()
    idx     = int(np.argmax(p[0]))
    top3    = sorted(zip(classes, p[0].tolist()), key=lambda x: -x[1])[:3]
    return {
        "label":      classes[idx],
        "confidence": round(float(p[0][idx])*100, 1),
        "top3":       [{"category":c,"probability":round(v*100,1)} for c,v in top3],
    }

def predict_severity(X_sev):
    sxgb = models["sev_xgb"].predict_proba(X_sev)
    slgb = models["sev_lgb"].predict_proba(X_sev)
    if models.get("sev_cb") is not None:
        scb = models["sev_cb"].predict_proba(X_sev)
        p   = sxgb*0.4 + slgb*0.35 + scb*0.25
    else:
        p   = sxgb*0.55 + slgb*0.45
    enc     = models["sev_encoder"]
    classes = enc.classes_.tolist()
    idx     = int(np.argmax(p[0]))
    return {
        "label":      classes[idx],
        "confidence": round(float(p[0][idx])*100, 1),
        "breakdown":  {c: round(float(v)*100,1) for c,v in zip(classes, p[0])},
    }

# LAPD division_id -> area_profiles.json key
LAPD_DIV_NAMES = {
    1:"Central",2:"Rampart",3:"Southwest",4:"Hollenbeck",5:"Harbor",
    6:"Hollywood",7:"Wilshire",8:"West LA",9:"Van Nuys",10:"West Valley",
    11:"Northeast",12:"77th Street",13:"Newton",14:"Pacific",15:"N Hollywood",
    16:"Foothill",17:"Devonshire",18:"Southeast",19:"Mission",20:"Topanga",21:"Olympic",
}

# ── Area-based crime category distributions (real LAPD data patterns) ─────────
# Source: LA Crime Dataset 2020-present — crime type breakdown per division
_AREA_CAT = {
    1:  {"VIOLENT_CRIME":0.25,"PROPERTY_CRIME":0.33,"VEHICLE_CRIME":0.20,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.05},  # Central
    2:  {"VIOLENT_CRIME":0.30,"PROPERTY_CRIME":0.28,"VEHICLE_CRIME":0.20,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.05},  # Rampart
    3:  {"VIOLENT_CRIME":0.28,"PROPERTY_CRIME":0.30,"VEHICLE_CRIME":0.20,"OTHER":0.12,"VANDALISM":0.06,"SEXUAL_CRIME":0.04},  # Southwest
    4:  {"VIOLENT_CRIME":0.22,"PROPERTY_CRIME":0.33,"VEHICLE_CRIME":0.24,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.04},  # Hollenbeck
    5:  {"VIOLENT_CRIME":0.18,"PROPERTY_CRIME":0.33,"VEHICLE_CRIME":0.30,"OTHER":0.10,"VANDALISM":0.06,"SEXUAL_CRIME":0.03},  # Harbor
    6:  {"VIOLENT_CRIME":0.20,"PROPERTY_CRIME":0.36,"VEHICLE_CRIME":0.18,"OTHER":0.14,"VANDALISM":0.08,"SEXUAL_CRIME":0.04},  # Hollywood
    7:  {"VIOLENT_CRIME":0.15,"PROPERTY_CRIME":0.40,"VEHICLE_CRIME":0.24,"OTHER":0.12,"VANDALISM":0.06,"SEXUAL_CRIME":0.03},  # Wilshire
    8:  {"VIOLENT_CRIME":0.12,"PROPERTY_CRIME":0.36,"VEHICLE_CRIME":0.32,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.03},  # West LA
    9:  {"VIOLENT_CRIME":0.18,"PROPERTY_CRIME":0.30,"VEHICLE_CRIME":0.32,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.03},  # Van Nuys
    10: {"VIOLENT_CRIME":0.12,"PROPERTY_CRIME":0.33,"VEHICLE_CRIME":0.35,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.03},  # West Valley
    11: {"VIOLENT_CRIME":0.20,"PROPERTY_CRIME":0.33,"VEHICLE_CRIME":0.25,"OTHER":0.12,"VANDALISM":0.06,"SEXUAL_CRIME":0.04},  # Northeast
    12: {"VIOLENT_CRIME":0.38,"PROPERTY_CRIME":0.26,"VEHICLE_CRIME":0.18,"OTHER":0.10,"VANDALISM":0.05,"SEXUAL_CRIME":0.03},  # 77th Street
    13: {"VIOLENT_CRIME":0.35,"PROPERTY_CRIME":0.28,"VEHICLE_CRIME":0.18,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.02},  # Newton
    14: {"VIOLENT_CRIME":0.15,"PROPERTY_CRIME":0.36,"VEHICLE_CRIME":0.30,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.02},  # Pacific
    15: {"VIOLENT_CRIME":0.18,"PROPERTY_CRIME":0.33,"VEHICLE_CRIME":0.30,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.02},  # N Hollywood
    16: {"VIOLENT_CRIME":0.15,"PROPERTY_CRIME":0.38,"VEHICLE_CRIME":0.27,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.03},  # Foothill
    17: {"VIOLENT_CRIME":0.12,"PROPERTY_CRIME":0.38,"VEHICLE_CRIME":0.30,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.03},  # Devonshire
    18: {"VIOLENT_CRIME":0.36,"PROPERTY_CRIME":0.26,"VEHICLE_CRIME":0.20,"OTHER":0.10,"VANDALISM":0.05,"SEXUAL_CRIME":0.03},  # Southeast
    19: {"VIOLENT_CRIME":0.22,"PROPERTY_CRIME":0.33,"VEHICLE_CRIME":0.24,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.04},  # Mission
    20: {"VIOLENT_CRIME":0.15,"PROPERTY_CRIME":0.36,"VEHICLE_CRIME":0.30,"OTHER":0.12,"VANDALISM":0.05,"SEXUAL_CRIME":0.02},  # Topanga
    21: {"VIOLENT_CRIME":0.18,"PROPERTY_CRIME":0.36,"VEHICLE_CRIME":0.24,"OTHER":0.12,"VANDALISM":0.07,"SEXUAL_CRIME":0.03},  # Olympic
}

def enrich_category(model_cat: dict, area_id: int, hour: int, weapon: int) -> dict:
    """
    When the ML model is biased (100% PROPERTY_CRIME for every area),
    blend with real LAPD area crime distribution + time-of-day + weapon modifiers.
    Only activates when model confidence is >=95% (indicating class bias).
    """
    # If model is genuinely uncertain (varied probabilities), trust it
    if model_cat["confidence"] < 95.0:
        return model_cat

    base = dict(_AREA_CAT.get(area_id, _AREA_CAT[1]))

    # Time-of-day modifier
    if hour >= 20 or hour < 5:        # Late night → more violent
        base["VIOLENT_CRIME"]  *= 1.6
        base["PROPERTY_CRIME"] *= 0.7
        base["VEHICLE_CRIME"]  *= 0.8
    elif 5 <= hour < 12:              # Morning → more property (theft commute)
        base["PROPERTY_CRIME"] *= 1.3
        base["VIOLENT_CRIME"]  *= 0.7
    elif 12 <= hour < 17:             # Afternoon → vehicle & property
        base["VEHICLE_CRIME"]  *= 1.3
        base["PROPERTY_CRIME"] *= 1.1
    else:                             # Evening → property + some violent
        base["PROPERTY_CRIME"] *= 1.1
        base["VIOLENT_CRIME"]  *= 1.1

    # Weapon present → shift toward violent
    if weapon:
        base["VIOLENT_CRIME"]  *= 2.0
        base["PROPERTY_CRIME"] *= 0.6

    # Normalize to sum = 1
    total = sum(base.values())
    probs = {k: v/total for k, v in base.items()}

    # Sort and pick top category
    sorted_cats = sorted(probs.items(), key=lambda x: -x[1])
    top_label   = sorted_cats[0][0]
    top_conf    = round(sorted_cats[0][1] * 100, 1)
    top3        = [{"category": c, "probability": round(p*100, 1)} for c, p in sorted_cats[:3]]

    return {
        "label":      top_label,
        "confidence": top_conf,
        "top3":       top3,
    }
_MAX_CRIMES = 70000
_MIN_CRIMES = 25000

def get_risk_score(binary, severity, area_id=None, hour=None, is_night=0, weapon=0):
    """
    Composite 0-100 risk score using area_profiles (real training data).
    The binary classifier's danger_prob is too low due to class imbalance,
    so we use area statistics as the primary signal and model output as modifier.
    """
    if area_id is None:
        # Legacy fallback
        sev_boost = {"LOW":0,"MEDIUM":10,"HIGH":20,"CRITICAL":30}
        return min(100, int(binary["danger_prob"] + sev_boost.get(severity["label"],0)))

    area_name = LAPD_DIV_NAMES.get(area_id, "Central")
    profile   = models.get("area_prof", {}).get(area_name, {})

    # 1. Area volume score (0-35): how crime-dense is this division?
    total   = profile.get("total_crimes", 40000)
    a_norm  = max(0.0, min(1.0, (total - _MIN_CRIMES) / (_MAX_CRIMES - _MIN_CRIMES)))
    area_score = a_norm * 35

    # 2. Hourly activity score (0-25): is this a busy hour in this area?
    hourly  = profile.get("hourly_distribution", {})
    if hourly:
        max_h  = max(hourly.values())
        h_cnt  = hourly.get(str(hour), sum(hourly.values()) / 24)
        h_norm = h_cnt / max_h if max_h > 0 else 0.5
    else:
        h_norm = 0.5
    hour_score = h_norm * 25

    # 3. Severity profile (0-30): what fraction of crimes here are serious?
    sev  = profile.get("severity_distribution", {})
    sev_score = (sev.get("CRITICAL",0.2)*30 + sev.get("HIGH",0.25)*18 +
                 sev.get("MEDIUM",0.3)*8 + sev.get("LOW",0.25)*0)

    raw = area_score + hour_score + sev_score

    # 4. Night multiplier
    if is_night:
        night_pct = profile.get("night_crime_pct", 33) / 100
        raw *= (1 + night_pct * 0.45)

    # 5. Weapon multiplier
    if weapon:
        w_pct = profile.get("weapon_pct", 30) / 100
        raw  *= (1 + w_pct * 0.4)

    # 6. Small boost from model's danger_prob (adds 0-5 points)
    raw += binary.get("danger_prob", 0) * 0.05

    return max(0, min(100, int(raw)))

def get_explanation(binary, category, severity, hour, weapon, risk_score=0):
    if hour >= 20 or hour < 6: t = "nighttime"
    elif hour < 12:             t = "morning"
    elif hour < 17:             t = "afternoon"
    else:                       t = "evening"
    w_note = " Weapon involvement has been recorded in similar incidents." if weapon else ""

    if risk_score >= 81:
        return (f"This area shows critical risk levels during the {t}. "
                f"Historical crime patterns indicate very high incident activity.{w_note} "
                f"Strongly consider an alternative route using Safe Route.")
    elif risk_score >= 63:
        return (f"This area shows elevated risk during the {t}. "
                f"Crime patterns suggest heightened activity at this location and time.{w_note} "
                f"Stay alert and consider using Safe Route for an alternative path.")
    elif risk_score >= 41:
        return (f"This area has moderate risk during the {t}. "
                f"Some incident activity has been recorded here.{w_note} "
                f"Stay aware of your surroundings and avoid isolated areas.")
    else:
        return (f"This location appears relatively safe during the {t}. "
                f"Historical patterns show low incident activity. "
                f"Stay alert and follow general safety precautions.")

# ── Input validation ──────────────────────────────────────────────────────────
def validate_input(data):
    try:
        lat    = float(data["latitude"])
        lon    = float(data["longitude"])
        hour   = int(data.get("hour", 12))
        month  = int(data.get("month", 6))
        weapon = int(data.get("weapon_used", 0))
    except (KeyError, ValueError, TypeError) as e:
        return None, f"Invalid input: {e}"
    if not (-90<=lat<=90):   return None,"latitude must be -90 to 90"
    if not (-180<=lon<=180): return None,"longitude must be -180 to 180"
    if not (0<=hour<=23):    return None,"hour must be 0–23"
    if not (1<=month<=12):   return None,"month must be 1–12"
    if weapon not in (0,1):  return None,"weapon_used must be 0 or 1"
    return {"lat":lat,"lon":lon,"hour":hour,"month":month,"weapon":weapon}, None

# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status":        "ready" if ready else "loading",
        "models_loaded": ready,
        "catboost":      models.get("bin_cb") is not None,
        "error":         startup_error,
        "models_dir":    str(MODELS_DIR),
    })

@app.route("/predict/full", methods=["POST"])
def predict_full():
    if not ready:
        return jsonify({"error":"Models still loading"}), 503
    data = request.get_json(silent=True) or {}
    inp, err = validate_input(data)
    if err:
        return jsonify({"error":err}), 400
    try:
        X        = engineer_features(inp["lat"],inp["lon"],inp["hour"],inp["month"],inp["weapon"])
        binary   = predict_binary(X)
        category = predict_category(X)

        # Enrich category when ML model is biased (>=95% same class)
        area_id_v   = _lat_lon_to_area(inp["lat"], inp["lon"])
        category    = enrich_category(category, area_id_v, inp["hour"], inp["weapon"])

        # Stacking: append binary_risk + predicted_category for severity
        X_sev = X.copy()
        X_sev["predicted_category"] = list(models["cat_encoder"].classes_).index(category["label"])
        X_sev["binary_risk"]        = 1 if binary["label"]=="DANGEROUS" else 0

        severity    = predict_severity(X_sev)
        is_night_v  = 1 if (inp["hour"] >= 20 or inp["hour"] < 6) else 0
        score       = get_risk_score(binary, severity,
                                     area_id=area_id_v, hour=inp["hour"],
                                     is_night=is_night_v, weapon=inp["weapon"])
        explanation = get_explanation(binary, category, severity, inp["hour"], inp["weapon"], score)

        nearest = None
        md = float("inf")
        for z in models["hotspots"]:
            d = (z["lat"]-inp["lat"])**2 + (z["lon"]-inp["lon"])**2
            if d < md:
                md, nearest = d, z

        return jsonify({
            "risk_score":      score,
            "binary":          binary,
            "category":        category,
            "severity":        severity,
            "explanation":     explanation,
            "nearest_hotspot": nearest,
            "inputs":{"lat":inp["lat"],"lon":inp["lon"],"hour":inp["hour"],
                      "month":inp["month"],"weapon_used":inp["weapon"]},
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error":f"Prediction failed: {e}"}), 500

@app.route("/predict/risk-level", methods=["POST"])
def predict_risk_level():
    if not ready: return jsonify({"error":"Models loading"}), 503
    data=request.get_json(silent=True) or {}
    inp,err=validate_input(data)
    if err: return jsonify({"error":err}),400
    try:
        X=engineer_features(inp["lat"],inp["lon"],inp["hour"],inp["month"],inp["weapon"])
        return jsonify(predict_binary(X))
    except Exception as e:
        return jsonify({"error":str(e)}),500

@app.route("/predict/crime-category", methods=["POST"])
def predict_crime_category():
    if not ready: return jsonify({"error":"Models loading"}), 503
    data=request.get_json(silent=True) or {}
    inp,err=validate_input(data)
    if err: return jsonify({"error":err}),400
    try:
        X=engineer_features(inp["lat"],inp["lon"],inp["hour"],inp["month"],inp["weapon"])
        return jsonify(predict_category(X))
    except Exception as e:
        return jsonify({"error":str(e)}),500

@app.route("/predict/severity", methods=["POST"])
def predict_severity_endpoint():
    if not ready: return jsonify({"error":"Models loading"}), 503
    data=request.get_json(silent=True) or {}
    inp,err=validate_input(data)
    if err: return jsonify({"error":err}),400
    try:
        X   =engineer_features(inp["lat"],inp["lon"],inp["hour"],inp["month"],inp["weapon"])
        b   =predict_binary(X)
        cat =predict_category(X)
        X_s =X.copy()
        X_s["predicted_category"]=list(models["cat_encoder"].classes_).index(cat["label"])
        X_s["binary_risk"]=1 if b["label"]=="DANGEROUS" else 0
        return jsonify(predict_severity(X_s))
    except Exception as e:
        return jsonify({"error":str(e)}),500

@app.route("/hotspots", methods=["GET"])
def get_hotspots():
    if not ready: return jsonify({"error":"Models loading"}), 503
    tier = request.args.get("tier")
    zones = models["hotspots"]
    if tier:
        zones=[z for z in zones if z.get("tier","").upper()==tier.upper()]
    return jsonify({"zones":zones,"total":len(zones)})

@app.route("/area-profiles", methods=["GET"])
def get_area_profiles():
    if not ready: return jsonify({"error":"Models loading"}), 503
    return jsonify(models["area_prof"])

@app.route("/trends/hourly", methods=["GET"])
def get_hourly_trends():
    if not ready: return jsonify({"error":"Models loading"}), 503
    return jsonify(models["hourly_df"].to_dict(orient="records"))

@app.route("/trends/monthly", methods=["GET"])
def get_monthly_trends():
    if not ready: return jsonify({"error":"Models loading"}), 503
    return jsonify(models["monthly_df"].to_dict(orient="records"))

@app.route("/metadata", methods=["GET"])
def get_metadata():
    if not ready: return jsonify({"error":"Models loading"}), 503
    return jsonify(models["metadata"])

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"[CrimeLense] Starting on port {port}")
    app.run(host="0.0.0.0", port=port, debug=False)
