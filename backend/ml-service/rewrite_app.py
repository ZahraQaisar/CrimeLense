"""
Rewrites app.py completely with:
1. Correct engineer_features() matching feature_cols.pkl
2. CatBoost made optional (numpy 2.x mismatch fix)
3. All ensemble/predict functions restored
"""
import os

path = r'C:\Users\Admin\Desktop\Rafia\CrimeLense Website\backend\ml-service\app.py'

new_app = r'''"""
CrimeLense Flask ML Microservice
Endpoints:
  GET  /health
  POST /predict/risk-level
  POST /predict/crime-category
  POST /predict/severity
  POST /predict/full          <- all 3 at once (used by frontend)
  GET  /hotspots
  GET  /area-profiles
  GET  /trends/hourly
  GET  /trends/monthly
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

# --- Paths ---
BASE_DIR   = Path(__file__).resolve().parent
MODELS_DIR = Path(os.getenv("MODELS_PATH", "../../Models files")).resolve()
if not MODELS_DIR.exists():
    MODELS_DIR = (BASE_DIR / "../../Models files").resolve()

# --- Model registry ---
models = {}
ready  = False
startup_error = None

def load_pkl(name: str):
    path = MODELS_DIR / name
    if not path.exists():
        raise FileNotFoundError(f"Model file not found: {path}")
    with open(path, "rb") as f:
        return pickle.load(f)

def load_models():
    global models, ready, startup_error
    try:
        print("[CrimeLense] Loading model files ...")
        t0 = time.time()

        # Feature engineering assets
        models["feature_cols"]          = load_pkl("feature_cols.pkl")
        models["feature_lookup_tables"] = load_pkl("feature_lookup_tables.pkl")

        # Binary risk (SAFE / DANGEROUS) - XGBoost + LightGBM always
        models["bin_xgb"]     = load_pkl("final_bin_xgb.pkl")
        models["bin_lgb"]     = load_pkl("final_bin_lgb.pkl")
        models["bin_weights"] = load_pkl("bin_ensemble_weights.pkl")
        models["bin_thresh"]  = load_pkl("bin_threshold.pkl")

        # Crime category (multi-class)
        models["cat_xgb"]     = load_pkl("final_cat_xgb.pkl")
        models["cat_lgb"]     = load_pkl("final_cat_lgb.pkl")
        models["cat_weights"] = load_pkl("cat_ensemble_weights.pkl")
        models["cat_encoder"] = load_pkl("category_v2_encoder.pkl")

        # Severity (LOW / MEDIUM / HIGH / CRITICAL)
        models["sev_xgb"]     = load_pkl("final_sev_xgb.pkl")
        models["sev_lgb"]     = load_pkl("final_sev_lgb.pkl")
        models["sev_encoder"] = load_pkl("severity_encoder.pkl")

        # CatBoost models - OPTIONAL (may fail due to numpy 2.x incompatibility)
        for cb_name, model_key in [
            ("final_bin_cb.pkl", "bin_cb"),
            ("final_cat_cb.pkl", "cat_cb"),
            ("final_sev_cb.pkl", "sev_cb"),
        ]:
            try:
                models[model_key] = load_pkl(cb_name)
            except Exception as cb_err:
                print(f"[CrimeLense] CatBoost {cb_name} skipped: {cb_err}")
                models[model_key] = None

        cb_ok = all(models.get(k) is not None for k in ["bin_cb", "cat_cb", "sev_cb"])
        print(f"[CrimeLense] CatBoost available: {cb_ok}")

        # Static JSON / CSV data
        with open(MODELS_DIR / "hotspot_zones_v2.json")  as f: models["hotspots"]  = json.load(f)
        with open(MODELS_DIR / "area_profiles.json")      as f: models["area_prof"] = json.load(f)
        with open(MODELS_DIR / "category_map.json")       as f: models["cat_map"]   = json.load(f)
        with open(MODELS_DIR / "model_metadata.json")     as f: models["metadata"]  = json.load(f)

        models["hourly_df"]  = pd.read_csv(MODELS_DIR / "hourly_patterns.csv")
        models["monthly_df"] = pd.read_csv(MODELS_DIR / "monthly_trends.csv")

        elapsed = time.time() - t0
        print(f"[CrimeLense] Models loaded in {elapsed:.1f}s")
        ready = True

    except Exception as e:
        startup_error = str(e)
        print(f"[CrimeLense] STARTUP ERROR: {e}")
        traceback.print_exc()

load_models()

# --- LAPD Division centroids (area_id 1-21) ---
LAPD_DIVISIONS = [
    ("Central",      1,  34.0441, -118.2433),
    ("Rampart",      2,  34.0672, -118.2784),
    ("Southwest",    3,  34.0140, -118.3025),
    ("Hollenbeck",   4,  34.0590, -118.2110),
    ("Harbor",       5,  33.7527, -118.2837),
    ("Hollywood",    6,  34.0983, -118.3267),
    ("Wilshire",     7,  34.0614, -118.3440),
    ("West LA",      8,  34.0440, -118.4430),
    ("Van Nuys",     9,  34.1861, -118.4495),
    ("West Valley", 10,  34.1831, -118.5710),
    ("Northeast",   11,  34.1210, -118.2090),
    ("77th Street", 12,  33.9510, -118.2870),
    ("Newton",      13,  34.0120, -118.2610),
    ("Pacific",     14,  33.9950, -118.4550),
    ("N Hollywood", 15,  34.1860, -118.3810),
    ("Foothill",    16,  34.2640, -118.3530),
    ("Devonshire",  17,  34.2890, -118.5020),
    ("Southeast",   18,  33.9220, -118.2290),
    ("Mission",     19,  34.2790, -118.4400),
    ("Topanga",     20,  34.2240, -118.6360),
    ("Olympic",     21,  34.0506, -118.2889),
]

def _lat_lon_to_area(lat: float, lon: float) -> int:
    """Return nearest LAPD division ID (1-21) for given coordinates."""
    best_id, best_dist = 1, float("inf")
    for _, aid, dlat, dlon in LAPD_DIVISIONS:
        d = (dlat - lat) ** 2 + (dlon - lon) ** 2
        if d < best_dist:
            best_dist = d
            best_id   = aid
    return best_id

def _find_nearest_cluster(lat: float, lon: float) -> int:
    """Return cluster_id of nearest DBSCAN hotspot."""
    zones = models["hotspots"]
    best_id, best_dist = 0, float("inf")
    for zone in zones:
        d = (zone["lat"] - lat) ** 2 + (zone["lon"] - lon) ** 2
        if d < best_dist:
            best_dist = d
            best_id   = zone["cluster_id"]
    return best_id

# --- Feature Engineering ---
def engineer_features(lat: float, lon: float, hour: int, month: int, weapon_used: int) -> pd.DataFrame:
    """
    Map 5 raw inputs to the 42-feature vector expected by the trained models.
    Column names MUST exactly match feature_cols.pkl from training.
    """
    lookup = models["feature_lookup_tables"]
    fc     = models["feature_cols"]

    # 1. Location -> LAPD area
    area_id  = _lat_lon_to_area(lat, lon)
    rpt_dist = area_id * 100 + 1   # representative district number

    # 2. Time
    now         = datetime.datetime.now()
    day         = now.day
    year        = now.year
    weekday     = now.weekday()   # 0=Mon..6=Sun

    is_night          = 1 if (hour >= 20 or hour < 6) else 0
    is_weekend        = 1 if weekday >= 5 else 0
    is_morning        = 1 if (6 <= hour < 12) else 0
    is_evening        = 1 if (17 <= hour < 20) else 0
    hour_sin          = float(np.sin(2 * np.pi * hour    / 24))
    hour_cos          = float(np.cos(2 * np.pi * hour    / 24))
    month_sin         = float(np.sin(2 * np.pi * month   / 12))
    month_cos         = float(np.cos(2 * np.pi * month   / 12))
    weekday_sin       = float(np.sin(2 * np.pi * weekday / 7))
    weekday_cos       = float(np.cos(2 * np.pi * weekday / 7))
    hour_quartile     = hour // 6
    is_peak_hour      = 1 if hour in [8, 9, 12, 13, 17, 18, 19] else 0
    high_risk_hours   = lookup.get("high_risk_hours", [2, 3, 4, 21, 22, 23])
    is_high_risk_hour = 1 if hour in high_risk_hours else 0
    weekend_night     = is_weekend * is_night

    # 3. Hour risk score
    hr_map          = lookup.get("hour_risk", {})
    hour_risk_score = float(hr_map.get(hour, 0.5))

    # 4. Area-level lookups
    geo_norm      = lookup.get("geo_norm", {})
    viol_ratio    = lookup.get("violent_ratio", {})
    area_sev      = lookup.get("area_sev_mean", {})
    dist_norm     = lookup.get("dist_norm", {})
    dist_viol     = lookup.get("dist_violent", {})

    area_crime_density    = float(geo_norm.get(area_id, geo_norm.get(0, 0.1)))
    area_violent_ratio    = float(viol_ratio.get(area_id, 0.3))
    area_sev_mean_val     = float(area_sev.get(area_id, 1.7))
    area_severity_profile = area_sev_mean_val
    geohash_encoded       = area_crime_density

    cluster_id          = _find_nearest_cluster(lat, lon)
    geo_crime_density   = float(geo_norm.get(cluster_id % 21 + 1, area_crime_density))
    dist_crime_density  = float(dist_norm.get(rpt_dist, area_crime_density))
    dist_violent_ratio  = float(dist_viol.get(rpt_dist, area_violent_ratio))

    # 5. Area x hour risk
    ahr           = lookup.get("area_hour_risk", {})
    area_hour_risk = float(ahr.get(f"{area_id}_{hour}", hour_risk_score))
    dist_hour_density = dist_crime_density * hour_risk_score

    # 6. Area x month density
    amm               = lookup.get("area_month_map", {})
    area_month_density = float(amm.get(f"({area_id}, {month})", 5000))

    # 7. Victim / crime defaults
    vict_age     = 30
    vict_sex     = 1
    part_1_2     = 1
    vict_age_bin = 2
    has_weapon      = int(weapon_used)
    weapon_night    = has_weapon * is_night
    weapon_part1    = has_weapon * part_1_2
    night_dist_viol = is_night * dist_violent_ratio

    chr_map       = lookup.get("cat_hour_risk", {})
    cat_hour_risk = float(chr_map.get(f"('OTHER', {hour})", hour_risk_score))

    # 8. Build row with EXACT column names
    row = {
        "Hour":                  hour,
        "Day":                   day,
        "Month":                 month,
        "Year":                  year,
        "Weekday":               weekday,
        "is_night":              is_night,
        "is_weekend":            is_weekend,
        "is_morning":            is_morning,
        "is_evening":            is_evening,
        "hour_sin":              hour_sin,
        "hour_cos":              hour_cos,
        "month_sin":             month_sin,
        "month_cos":             month_cos,
        "weekday_sin":           weekday_sin,
        "weekday_cos":           weekday_cos,
        "hour_risk_score":       hour_risk_score,
        "weekend_night":         weekend_night,
        "is_peak_hour":          is_peak_hour,
        "is_high_risk_hour":     is_high_risk_hour,
        "AREA":                  area_id,
        "Rpt Dist No":           rpt_dist,
        "geohash_encoded":       geohash_encoded,
        "area_crime_density":    area_crime_density,
        "area_severity_profile": area_severity_profile,
        "area_violent_ratio":    area_violent_ratio,
        "geo_crime_density":     geo_crime_density,
        "dist_crime_density":    dist_crime_density,
        "area_hour_risk":        area_hour_risk,
        "dist_hour_density":     dist_hour_density,
        "Vict Age":              vict_age,
        "Vict Sex":              vict_sex,
        "Part 1-2":              part_1_2,
        "has_weapon":            has_weapon,
        "weapon_night":          weapon_night,
        "area_month_density":    area_month_density,
        "vict_age_bin":          vict_age_bin,
        "cat_hour_risk":         cat_hour_risk,
        "dist_violent_ratio":    dist_violent_ratio,
        "area_sev_mean":         area_sev_mean_val,
        "weapon_part1":          weapon_part1,
        "night_dist_violent":    night_dist_viol,
        "hour_quartile":         hour_quartile,
    }

    df = pd.DataFrame([row])
    for col in fc:
        if col not in df.columns:
            df[col] = 0
    df = df[fc]
    return df


# --- Ensemble helpers ---
def _ensemble_proba(model_list, weights, X_df: pd.DataFrame) -> np.ndarray:
    """Weighted soft-voting; skips None models (e.g. unavailable CatBoost)."""
    active  = [(m, w) for m, w in zip(model_list, weights) if m is not None]
    if not active:
        raise RuntimeError("No models available for prediction")
    total_w = sum(w for _, w in active)
    proba   = None
    for mdl, w in active:
        p     = mdl.predict_proba(X_df)
        proba = p * (w / total_w) if proba is None else proba + p * (w / total_w)
    return proba


def predict_binary(X_df: pd.DataFrame) -> dict:
    """Binary risk: SAFE or DANGEROUS."""
    w       = models["bin_weights"]
    p       = _ensemble_proba(
        [models["bin_xgb"], models["bin_lgb"], models["bin_cb"]],
        [w.get("xgb", 0.55), w.get("lgb", 0.45), w.get("cb", 0.25)],
        X_df
    )
    thresh       = float(models["bin_thresh"]) if not isinstance(models["bin_thresh"], dict) else 0.49
    danger_prob  = float(p[0][1])
    label        = "DANGEROUS" if danger_prob >= thresh else "SAFE"
    return {
        "label":       label,
        "confidence":  round(max(danger_prob, 1 - danger_prob) * 100, 1),
        "danger_prob": round(danger_prob * 100, 1),
        "safe_prob":   round((1 - danger_prob) * 100, 1),
    }


def predict_category(X_df: pd.DataFrame) -> dict:
    """Multi-class crime category."""
    w    = models["cat_weights"]
    p    = _ensemble_proba(
        [models["cat_xgb"], models["cat_lgb"], models["cat_cb"]],
        [w.get("xgb", 0.55), w.get("lgb", 0.45), w.get("cb", 0.25)],
        X_df
    )
    enc     = models["cat_encoder"]
    classes = enc.classes_.tolist()
    idx     = int(np.argmax(p[0]))
    label   = classes[idx]
    top3    = sorted(zip(classes, p[0].tolist()), key=lambda x: -x[1])[:3]
    return {
        "label":      label,
        "confidence": round(float(p[0][idx]) * 100, 1),
        "top3":       [{"category": c, "probability": round(v * 100, 1)} for c, v in top3],
    }


def predict_severity(X_df: pd.DataFrame) -> dict:
    """Severity: LOW / MEDIUM / HIGH / CRITICAL."""
    sev_xgb = models["sev_xgb"].predict_proba(X_df)
    sev_lgb = models["sev_lgb"].predict_proba(X_df)
    if models["sev_cb"] is not None:
        sev_cb = models["sev_cb"].predict_proba(X_df)
        p      = sev_xgb * 0.4 + sev_lgb * 0.35 + sev_cb * 0.25
    else:
        p      = sev_xgb * 0.55 + sev_lgb * 0.45

    enc     = models["sev_encoder"]
    classes = enc.classes_.tolist()
    idx     = int(np.argmax(p[0]))
    label   = classes[idx]
    return {
        "label":     label,
        "confidence": round(float(p[0][idx]) * 100, 1),
        "breakdown": {c: round(float(v) * 100, 1) for c, v in zip(classes, p[0])},
    }


def get_risk_score(binary_result: dict, severity_result: dict) -> int:
    """Compute 0-100 risk score from binary danger prob + severity."""
    base      = binary_result["danger_prob"]
    sev_boost = {"LOW": 0, "MEDIUM": 10, "HIGH": 20, "CRITICAL": 30}
    return min(100, int(base + sev_boost.get(severity_result["label"], 0)))


def get_plain_explanation(binary: dict, category: dict, severity: dict, hour: int, weapon: int) -> str:
    risk     = binary["label"]
    cat      = category["label"].replace("_", " ").title()
    sev      = severity["label"].capitalize()
    time_str = "nighttime" if (hour >= 20 or hour < 6) else (
        "morning" if hour < 12 else ("afternoon" if hour < 17 else "evening"))
    if risk == "SAFE":
        return (f"This location appears relatively safe during the {time_str}. "
                f"Historical patterns show low incident activity. Stay alert and follow general safety precautions.")
    else:
        weapon_note = " Weapon involvement has been recorded in similar incidents." if weapon else ""
        return (f"This area shows elevated risk during the {time_str}. Our AI predicts a {sev.lower()} severity "
                f"{cat} incident profile.{weapon_note} Consider using our Safe Route tool for an alternative path.")


# --- Input validation ---
def validate_input(data: dict):
    try:
        lat    = float(data["latitude"])
        lon    = float(data["longitude"])
        hour   = int(data.get("hour",   12))
        month  = int(data.get("month",   6))
        weapon = int(data.get("weapon_used", 0))
    except (KeyError, ValueError, TypeError) as e:
        return None, f"Invalid input: {e}."
    if not (-90 <= lat <= 90):   return None, "latitude must be between -90 and 90"
    if not (-180 <= lon <= 180): return None, "longitude must be between -180 and 180"
    if not (0 <= hour <= 23):    return None, "hour must be between 0 and 23"
    if not (1 <= month <= 12):   return None, "month must be between 1 and 12"
    if weapon not in (0, 1):     return None, "weapon_used must be 0 or 1"
    return {"lat": lat, "lon": lon, "hour": hour, "month": month, "weapon": weapon}, None


# --- Routes ---
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
        return jsonify({"error": "Models are still loading. Please wait."}), 503
    data = request.get_json(silent=True) or {}
    inputs, err = validate_input(data)
    if err:
        return jsonify({"error": err}), 400
    try:
        X        = engineer_features(inputs["lat"], inputs["lon"], inputs["hour"], inputs["month"], inputs["weapon"])
        binary   = predict_binary(X)
        category = predict_category(X)

        X_sev = X.copy()
        X_sev["predicted_category"] = list(models["cat_encoder"].classes_).index(category["label"])
        X_sev["binary_risk"]        = 1 if binary["label"] == "DANGEROUS" else 0

        severity    = predict_severity(X_sev)
        score       = get_risk_score(binary, severity)
        explanation = get_plain_explanation(binary, category, severity, inputs["hour"], inputs["weapon"])

        nearest_zone = None
        min_dist = float("inf")
        for zone in models["hotspots"]:
            d = (zone["lat"] - inputs["lat"]) ** 2 + (zone["lon"] - inputs["lon"]) ** 2
            if d < min_dist:
                min_dist     = d
                nearest_zone = zone

        return jsonify({
            "risk_score":      score,
            "binary":          binary,
            "category":        category,
            "severity":        severity,
            "explanation":     explanation,
            "nearest_hotspot": nearest_zone,
            "inputs": {
                "lat":         inputs["lat"],
                "lon":         inputs["lon"],
                "hour":        inputs["hour"],
                "month":       inputs["month"],
                "weapon_used": inputs["weapon"],
            }
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


@app.route("/predict/risk-level", methods=["POST"])
def predict_risk_level():
    if not ready: return jsonify({"error": "Models loading"}), 503
    data = request.get_json(silent=True) or {}
    inputs, err = validate_input(data)
    if err: return jsonify({"error": err}), 400
    try:
        X = engineer_features(inputs["lat"], inputs["lon"], inputs["hour"], inputs["month"], inputs["weapon"])
        return jsonify(predict_binary(X))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict/crime-category", methods=["POST"])
def predict_crime_category():
    if not ready: return jsonify({"error": "Models loading"}), 503
    data = request.get_json(silent=True) or {}
    inputs, err = validate_input(data)
    if err: return jsonify({"error": err}), 400
    try:
        X = engineer_features(inputs["lat"], inputs["lon"], inputs["hour"], inputs["month"], inputs["weapon"])
        return jsonify(predict_category(X))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict/severity", methods=["POST"])
def predict_severity_endpoint():
    if not ready: return jsonify({"error": "Models loading"}), 503
    data = request.get_json(silent=True) or {}
    inputs, err = validate_input(data)
    if err: return jsonify({"error": err}), 400
    try:
        X        = engineer_features(inputs["lat"], inputs["lon"], inputs["hour"], inputs["month"], inputs["weapon"])
        bin_dict = predict_binary(X)
        cat_dict = predict_category(X)
        X_sev    = X.copy()
        X_sev["predicted_category"] = list(models["cat_encoder"].classes_).index(cat_dict["label"])
        X_sev["binary_risk"]        = 1 if bin_dict["label"] == "DANGEROUS" else 0
        return jsonify(predict_severity(X_sev))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/hotspots", methods=["GET"])
def get_hotspots():
    if not ready: return jsonify({"error": "Models loading"}), 503
    tier_filter = request.args.get("tier")
    zones = models["hotspots"]
    if tier_filter:
        zones = [z for z in zones if z.get("tier", "").upper() == tier_filter.upper()]
    return jsonify({"zones": zones, "total": len(zones)})


@app.route("/area-profiles", methods=["GET"])
def get_area_profiles():
    if not ready: return jsonify({"error": "Models loading"}), 503
    return jsonify(models["area_prof"])


@app.route("/trends/hourly", methods=["GET"])
def get_hourly_trends():
    if not ready: return jsonify({"error": "Models loading"}), 503
    return jsonify(models["hourly_df"].to_dict(orient="records"))


@app.route("/trends/monthly", methods=["GET"])
def get_monthly_trends():
    if not ready: return jsonify({"error": "Models loading"}), 503
    return jsonify(models["monthly_df"].to_dict(orient="records"))


@app.route("/metadata", methods=["GET"])
def get_metadata():
    if not ready: return jsonify({"error": "Models loading"}), 503
    return jsonify(models["metadata"])


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"[CrimeLense] Flask ML service starting on port {port}")
    app.run(host="0.0.0.0", port=port, debug=False)
'''

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_app)

print(f"SUCCESS: app.py rewritten ({new_app.count(chr(10))} lines)")
checks = ['LAPD_DIVISIONS', 'Rpt Dist No', '_ensemble_proba', 'predict_binary', 'predict_category',
          'predict_severity', 'get_risk_score', 'bin_cb.*None', 'CatBoost.*optional']
import re
for c in checks:
    found = bool(re.search(c, new_app))
    print(f"  [{'OK' if found else 'MISSING'}] {c}")
