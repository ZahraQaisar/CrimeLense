"""
HOW TO TEST THE NEW MODELS — run: python test_predictions.py
This hits the Flask service directly and shows predictions for 8 different
LA areas at different times, so you can visually verify the scores vary
realistically (high-crime areas + night + weapon = high score).
"""
import urllib.request, json, sys

FLASK_URL = "http://localhost:5000"

def call(lat, lon, hour, month=4, weapon=0):
    body = json.dumps({"latitude":lat,"longitude":lon,"hour":hour,
                       "month":month,"weapon_used":weapon}).encode()
    req  = urllib.request.Request(f"{FLASK_URL}/predict/full", data=body,
                                   headers={"Content-Type":"application/json"})
    try:
        resp = urllib.request.urlopen(req, timeout=20)
        return json.loads(resp.read())
    except urllib.error.URLError as e:
        return {"error": str(e)}

# ── Health check first ─────────────────────────────────────────────────────────
print("Checking Flask health …")
try:
    h = urllib.request.urlopen(f"{FLASK_URL}/health", timeout=5)
    health = json.loads(h.read())
    print(f"  Status    : {health['status']}")
    print(f"  CatBoost  : {health['catboost']}")
    print(f"  Models dir: {health['models_dir']}")
    if not health["models_loaded"]:
        print("  ERROR: models not loaded — check Flask console for details")
        sys.exit(1)
except Exception as e:
    print(f"  Flask not reachable: {e}")
    print("  Start Flask first:  cd backend/ml-service && python app.py")
    sys.exit(1)

print()

# ── Test cases ─────────────────────────────────────────────────────────────────
# (label, lat, lon, hour, weapon)  — expected: high-crime areas score higher
tests = [
    ("Central/Downtown   10 PM  no weapon",  34.044,-118.243, 22, 0),
    ("Central/Downtown    2 AM WITH weapon", 34.044,-118.243,  2, 1),
    ("Hollywood          2 AM  no weapon",   34.098,-118.327,  2, 0),
    ("77th Street        2 AM WITH weapon",  33.951,-118.287,  2, 1),
    ("Southeast          3 AM WITH weapon",  33.922,-118.229,  3, 1),
    ("Wilshire           6 PM  no weapon",   34.061,-118.344, 18, 0),
    ("West Valley        9 AM  no weapon",   34.183,-118.571,  9, 0),
    ("Devonshire (safe)  9 AM  no weapon",   34.289,-118.502,  9, 0),
]

print(f"{'Area / Time':<40} | {'Score':>5} | {'Label':<10} | {'Danger%':>7} | Severity  | Category")
print("-" * 105)

for label, lat, lon, hour, weapon in tests:
    r = call(lat, lon, hour, weapon=weapon)
    if "error" in r:
        print(f"{label:<40} | ERROR: {r['error']}")
        continue
    score    = r.get("risk_score", "?")
    bl       = r.get("binary",{}).get("label","?")
    dp       = r.get("binary",{}).get("danger_prob", 0)
    sev      = r.get("severity",{}).get("label","?")
    cat      = r.get("category",{}).get("label","?")
    print(f"{label:<40} | {str(score):>5} | {bl:<10} | {dp:>7.1f}% | {sev:<9} | {cat}")

print()
print("DONE. If scores vary meaningfully across areas/times, the models are working correctly.")
print("  Expected: Downtown/77th at 2AM > West Valley at 9AM")
print("  Adding weapon=1 should increase both score and danger_prob.")
