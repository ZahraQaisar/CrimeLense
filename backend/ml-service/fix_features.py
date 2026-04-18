"""
Patches app.py: replaces the broken engineer_features block with the
correct implementation that matches feature_cols.pkl from training.
"""
import re

path = r'C:\Users\Admin\Desktop\Rafia\CrimeLense Website\backend\ml-service\app.py'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the block to replace: from "def engineer_features" up to (not including) "def get_risk_score"
start = content.find('def engineer_features')
end   = content.find('\ndef get_risk_score')  # newline before def

assert start != -1, "engineer_features not found"
assert end   != -1, "get_risk_score not found"

new_block = '''def engineer_features(lat: float, lon: float, hour: int, month: int, weapon_used: int) -> pd.DataFrame:
    """
    Map 5 raw inputs to the 42-feature vector expected by the trained models.
    Column names MUST exactly match feature_cols.pkl from training.
    """
    import datetime
    lookup = models["feature_lookup_tables"]
    fc     = models["feature_cols"]   # 42 cols in exact training order

    # 1. Map (lat, lon) to nearest LAPD division ID (1-21)
    LAPD_DIVISIONS = [
        ("Central",       1,  34.0441, -118.2433),
        ("Rampart",       2,  34.0672, -118.2784),
        ("Southwest",     3,  34.0140, -118.3025),
        ("Hollenbeck",    4,  34.0590, -118.2110),
        ("Harbor",        5,  33.7527, -118.2837),
        ("Hollywood",     6,  34.0983, -118.3267),
        ("Wilshire",      7,  34.0614, -118.3440),
        ("West LA",       8,  34.0440, -118.4430),
        ("Van Nuys",      9,  34.1861, -118.4495),
        ("West Valley",  10,  34.1831, -118.5710),
        ("Northeast",    11,  34.1210, -118.2090),
        ("77th Street",  12,  33.9510, -118.2870),
        ("Newton",       13,  34.0120, -118.2610),
        ("Pacific",      14,  33.9950, -118.4550),
        ("N Hollywood",  15,  34.1860, -118.3810),
        ("Foothill",     16,  34.2640, -118.3530),
        ("Devonshire",   17,  34.2890, -118.5020),
        ("Southeast",    18,  33.9220, -118.2290),
        ("Mission",      19,  34.2790, -118.4400),
        ("Topanga",      20,  34.2240, -118.6360),
        ("Olympic",      21,  34.0506, -118.2889),
    ]
    best_area, best_dist = 1, float("inf")
    for _, aid, dlat, dlon in LAPD_DIVISIONS:
        d = (dlat - lat) ** 2 + (dlon - lon) ** 2
        if d < best_dist:
            best_dist = d
            best_area = aid
    area_id  = best_area
    rpt_dist = area_id * 100 + 1   # representative district (e.g. area 7 -> 701)

    # 2. Time features
    now      = datetime.datetime.now()
    day      = now.day
    year     = now.year
    weekday  = now.weekday()   # 0=Mon .. 6=Sun

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

    # 4. Area-level lookups (keyed by integer area_id 1-21)
    geo_norm_map      = lookup.get("geo_norm", {})
    violent_ratio_map = lookup.get("violent_ratio", {})
    area_sev_map      = lookup.get("area_sev_mean", {})
    dist_norm_map     = lookup.get("dist_norm", {})
    dist_violent_map  = lookup.get("dist_violent", {})

    area_crime_density    = float(geo_norm_map.get(area_id, geo_norm_map.get(0, 0.1)))
    area_violent_ratio    = float(violent_ratio_map.get(area_id, 0.3))
    area_sev_mean_val     = float(area_sev_map.get(area_id, 1.7))
    area_severity_profile = area_sev_mean_val
    geohash_encoded       = area_crime_density

    cluster_id          = _find_nearest_cluster(lat, lon)
    geo_crime_density   = float(geo_norm_map.get(cluster_id % 21 + 1, area_crime_density))
    dist_crime_density  = float(dist_norm_map.get(rpt_dist, area_crime_density))
    dist_violent_ratio  = float(dist_violent_map.get(rpt_dist, area_violent_ratio))

    # 5. Area x hour risk
    ahr_map        = lookup.get("area_hour_risk", {})
    ah_key         = f"{area_id}_{hour}"
    area_hour_risk = float(ahr_map.get(ah_key, hour_risk_score))
    dist_hour_density = dist_crime_density * hour_risk_score

    # 6. Area x month density
    amm            = lookup.get("area_month_map", {})
    am_key         = f"({area_id}, {month})"
    area_month_density = float(amm.get(am_key, 5000))

    # 7. Victim / crime features (population medians as defaults)
    vict_age    = 30
    vict_sex    = 1          # 1=Male (most common)
    part_1_2    = 1          # Part 1 = serious crime
    vict_age_bin = 2         # adult bin

    has_weapon      = int(weapon_used)
    weapon_night    = has_weapon * is_night
    weapon_part1    = has_weapon * part_1_2
    night_dist_viol = is_night * dist_violent_ratio

    chr_map       = lookup.get("cat_hour_risk", {})
    ch_key        = f"('OTHER', {hour})"
    cat_hour_risk = float(chr_map.get(ch_key, hour_risk_score))

    # 8. Build row with EXACT column names from feature_cols.pkl
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


def _cluster_tier(cluster_id: int) -> int:
    tier_map = {"LOW": 0, "MEDIUM": 1, "HIGH": 2, "CRITICAL": 3}
    for zone in models["hotspots"]:
        if zone["cluster_id"] == cluster_id:
            return tier_map.get(zone.get("tier", "MEDIUM"), 1)
    return 1'''

new_content = content[:start] + new_block + content[end:]
with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print("SUCCESS: app.py patched. Lines:", new_content.count('\n'))
