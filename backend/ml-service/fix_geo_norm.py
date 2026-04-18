"""
fix_geo_norm.py
===============
Fixes the broken geo_norm lookup table in feature_lookup_tables.pkl.

Problem: geo_norm[1] = 0.0 (Downtown LA shows 0 crime density — WRONG!)
Fix:     Recompute geo_norm from area_profiles.json which has real counts.

Run this ONCE:
    python fix_geo_norm.py
Then restart Flask.
"""

import pickle, json, shutil
from pathlib import Path

MODELS_DIR = Path("../../Models files").resolve()
BACKUP_PATH = MODELS_DIR / "feature_lookup_tables.BACKUP.pkl"
TARGET_PATH = MODELS_DIR / "feature_lookup_tables.pkl"

# LAPD area_id → area name mapping (same as app.py)
LAPD_DIV_NAMES = {
    1: "Central",     2: "Rampart",     3: "Southwest",   4: "Hollenbeck",
    5: "Harbor",      6: "Hollywood",   7: "Wilshire",    8: "West LA",
    9: "Van Nuys",   10: "West Valley", 11: "Northeast", 12: "77th Street",
   13: "Newton",     14: "Pacific",    15: "N Hollywood", 16: "Foothill",
   17: "Devonshire", 18: "Southeast",  19: "Mission",    20: "Topanga",
   21: "Olympic",
}

print("=" * 60)
print("  CrimeLense — Fix geo_norm Lookup Table")
print("=" * 60)

# ── Step 1: Load current lookup tables ─────────────────────────────────────
with open(TARGET_PATH, "rb") as f:
    lookup = pickle.load(f)

print(f"\n📦 Loaded feature_lookup_tables.pkl")
print(f"   Current geo_norm sample (first 5 area entries):")
geo_norm_old = lookup.get("geo_norm", {})
for i in range(1, 6):
    print(f"   area_id={i} → {geo_norm_old.get(i, 'MISSING'):.6f}")

# ── Step 2: Load area_profiles.json (has real crime counts) ────────────────
with open(MODELS_DIR / "area_profiles.json") as f:
    area_prof = json.load(f)

print(f"\n📊 Area crime counts from area_profiles.json:")
crime_counts = {}
for area_id, area_name in LAPD_DIV_NAMES.items():
    profile = area_prof.get(area_name, {})
    total = profile.get("total_crimes", None)
    crime_counts[area_id] = total
    print(f"   area_id={area_id:2d} ({area_name:15s}): {total:,}" if total else f"   area_id={area_id:2d} ({area_name:15s}): MISSING")

# ── Step 3: Normalize to 0-1 range ─────────────────────────────────────────
valid_counts = [v for v in crime_counts.values() if v is not None]
min_crimes = min(valid_counts)
max_crimes = max(valid_counts)

print(f"\n⚙️  Normalization range: min={min_crimes:,}  max={max_crimes:,}")

new_geo_norm = dict(geo_norm_old)  # keep cluster_id entries (keys 0, 22+)

for area_id, total in crime_counts.items():
    if total is not None:
        # Min-max normalize to 0.0–1.0
        normalized = (total - min_crimes) / (max_crimes - min_crimes)
        new_geo_norm[area_id] = normalized

print(f"\n✅ New geo_norm values for LAPD areas:")
for area_id in range(1, 22):
    name = LAPD_DIV_NAMES.get(area_id, "?")
    old  = geo_norm_old.get(area_id, 0.0)
    new  = new_geo_norm.get(area_id, 0.0)
    changed = "← FIXED!" if abs(new - old) > 0.01 else ""
    print(f"   area_id={area_id:2d} ({name:15s}): {old:.4f} → {new:.4f}  {changed}")

# ── Step 4: Backup + Save ───────────────────────────────────────────────────
# Backup original
shutil.copy2(TARGET_PATH, BACKUP_PATH)
print(f"\n💾 Backup saved: {BACKUP_PATH.name}")

# Update geo_norm in lookup
lookup["geo_norm"] = new_geo_norm

with open(TARGET_PATH, "wb") as f:
    pickle.dump(lookup, f)

print(f"✅ Updated feature_lookup_tables.pkl saved!")
print(f"\n🔄 Now restart Flask:  python app.py")
print(f"   Then test again — binary model should give DANGEROUS for Downtown LA!")
print("=" * 60)
