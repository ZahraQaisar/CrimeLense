"""
Patches app.py to add a smart risk score engine using area_profiles
instead of relying on the miscalibrated binary classifier probability.
"""

path = r'C:\Users\Admin\Desktop\Rafia\CrimeLense Website\backend\ml-service\app.py'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Map area_id (1-21) to area profile name
AREA_NAME_MAP = '''
# LAPD division_id -> area_profiles.json key
LAPD_DIV_NAMES = {
    1: "Central",      2: "Rampart",     3: "Southwest",  4: "Hollenbeck",
    5: "Harbor",       6: "Hollywood",   7: "Wilshire",   8: "West LA",
    9: "Van Nuys",    10: "West Valley", 11: "Northeast", 12: "77th Street",
   13: "Newton",      14: "Pacific",     15: "N Hollywood",16: "Foothill",
   17: "Devonshire",  18: "Southeast",   19: "Mission",   20: "Topanga",
   21: "Olympic",
}

# Max total_crimes across all LA divisions (for normalisation)
_MAX_TOTAL_CRIMES = 70000
_MIN_TOTAL_CRIMES = 25000

def compute_smart_risk_score(area_id: int, hour: int, is_night: int,
                              weapon_used: int, cluster_tier: int) -> int:
    """
    Rule-based 0-100 risk score using area_profiles instead of the
    binary classifier (which is miscalibrated due to class imbalance).
    """
    area_name = LAPD_DIV_NAMES.get(area_id, "Central")
    profile   = models.get("area_prof", {}).get(area_name, {})

    # 1. Area base score (0-35) from total_crimes volume
    total  = profile.get("total_crimes", 40000)
    a_norm = max(0.0, min(1.0, (total - _MIN_TOTAL_CRIMES) / (_MAX_TOTAL_CRIMES - _MIN_TOTAL_CRIMES)))
    area_score = a_norm * 35

    # 2. Hourly activity score (0-25)
    hourly  = profile.get("hourly_distribution", {})
    if hourly:
        max_h   = max(hourly.values())
        h_count = hourly.get(str(hour), sum(hourly.values()) / 24)
        h_norm  = h_count / max_h if max_h > 0 else 0.5
    else:
        h_norm  = 0.5
    hour_score = h_norm * 25

    # 3. Severity profile score (0-30) — weighted by seriousness
    sev = profile.get("severity_distribution", {})
    sev_score = (
        sev.get("CRITICAL", 0.2) * 30 +
        sev.get("HIGH",     0.25) * 18 +
        sev.get("MEDIUM",   0.3)  *  8 +
        sev.get("LOW",      0.25) *  0
    )

    # 4. Cluster hotspot tier bonus (0-9)
    tier_score = cluster_tier * 3

    raw = area_score + hour_score + sev_score + tier_score

    # 5. Night multiplier (+15% at night)
    if is_night:
        night_pct = profile.get("night_crime_pct", 33) / 100
        raw *= (1 + night_pct * 0.5)

    # 6. Weapon multiplier (+weapon_pct risk)
    if weapon_used:
        w_pct = profile.get("weapon_pct", 30) / 100
        raw  *= (1 + w_pct * 0.4)

    return max(0, min(100, int(raw)))

'''

# Insert after LAPD_DIVISIONS list and _lat_lon_to_area function
insert_after = 'def _find_nearest_cluster(lat: float, lon: float) -> int:'
assert insert_after in content, f"Anchor not found: {insert_after}"

content = content.replace(insert_after, AREA_NAME_MAP + insert_after)

# Now replace get_risk_score to use the new smart scorer
old_score = '''def get_risk_score(binary_result: dict, severity_result: dict) -> int:
    """Compute 0-100 risk score from binary danger prob + severity."""
    base      = binary_result["danger_prob"]
    sev_boost = {"LOW": 0, "MEDIUM": 10, "HIGH": 20, "CRITICAL": 30}
    return min(100, int(base + sev_boost.get(severity_result["label"], 0)))'''

new_score = '''def get_risk_score(binary_result: dict, severity_result: dict) -> int:
    """
    Kept for API compatibility. The /predict/full endpoint now uses
    compute_smart_risk_score() directly for a meaningful 0-100 score.
    Falls back to ML-based score if needed.
    """
    base      = binary_result["danger_prob"]
    sev_boost = {"LOW": 0, "MEDIUM": 10, "HIGH": 20, "CRITICAL": 30}
    return min(100, int(base + sev_boost.get(severity_result["label"], 0)))'''

assert old_score in content, "get_risk_score not found"
content = content.replace(old_score, new_score)

# Replace the score calculation in predict_full to use smart scorer
old_predict_full_score = '''        severity    = predict_severity(X_sev)
        score       = get_risk_score(binary, severity)'''

new_predict_full_score = '''        severity    = predict_severity(X_sev)

        # Use smart rule-based score (area profiles + time + hotspot tier)
        # instead of miscalibrated binary classifier probability
        cluster_id_for_score = _find_nearest_cluster(inputs["lat"], inputs["lon"])
        cluster_tier_val     = _get_cluster_tier_int(cluster_id_for_score)
        area_id_for_score    = _lat_lon_to_area(inputs["lat"], inputs["lon"])
        is_night_val         = 1 if (inputs["hour"] >= 20 or inputs["hour"] < 6) else 0

        score = compute_smart_risk_score(
            area_id_for_score, inputs["hour"],
            is_night_val, inputs["weapon"], cluster_tier_val
        )'''

assert old_predict_full_score in content, "predict_full score block not found"
content = content.replace(old_predict_full_score, new_predict_full_score)

# Add helper to get cluster tier as int
old_find_cluster = 'def _find_nearest_cluster(lat: float, lon: float) -> int:'
new_find_cluster = '''def _get_cluster_tier_int(cluster_id: int) -> int:
    """Return 0=LOW, 1=MEDIUM, 2=HIGH, 3=CRITICAL for a cluster_id."""
    tier_map = {"LOW": 0, "MEDIUM": 1, "HIGH": 2, "CRITICAL": 3}
    for zone in models.get("hotspots", []):
        if zone["cluster_id"] == cluster_id:
            return tier_map.get(zone.get("tier", "MEDIUM"), 1)
    return 1

def _find_nearest_cluster(lat: float, lon: float) -> int:'''

content = content.replace(old_find_cluster, new_find_cluster, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"SUCCESS: smart risk scorer added. Total lines: {content.count(chr(10))}")
checks = ['compute_smart_risk_score', 'LAPD_DIV_NAMES', '_get_cluster_tier_int',
          'compute_smart_risk_score(', 'area_score + hour_score + sev_score']
import re
for c in checks:
    found = c in content
    print(f"  [{'OK' if found else 'MISSING'}] {c}")
