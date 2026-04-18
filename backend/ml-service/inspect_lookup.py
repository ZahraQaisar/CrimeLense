"""
Inspect new feature_lookup_tables.pkl to understand exact structure.
Run: python inspect_lookup.py
"""
import pickle, json
from pathlib import Path

MODELS_DIR = Path(r'C:\Users\Admin\Desktop\Rafia\CrimeLense Website\Models files')

# 1. Feature columns
fc = pickle.load(open(MODELS_DIR / 'feature_cols.pkl', 'rb'))
print("=== feature_cols.pkl ===")
print(f"Count: {len(fc)}")
print(f"Cols: {fc}")
print()

# 2. Lookup tables
lookup = pickle.load(open(MODELS_DIR / 'feature_lookup_tables.pkl', 'rb'))
print("=== feature_lookup_tables.pkl ===")
print(f"Top-level keys: {list(lookup.keys())}")
print()
for k, v in lookup.items():
    if isinstance(v, dict):
        items = list(v.items())
        print(f"  [{k}] -> dict, {len(v)} entries")
        print(f"    Sample keys (first 5): {[str(i[0]) for i in items[:5]]}")
        print(f"    Sample values (first 5): {[round(float(i[1]),4) if isinstance(i[1],(int,float)) else i[1] for i in items[:5]]}")
    elif isinstance(v, list):
        print(f"  [{k}] -> list, {len(v)} entries, sample: {v[:5]}")
    else:
        print(f"  [{k}] -> {type(v).__name__} = {v}")
    print()

# 3. Threshold
thresh = pickle.load(open(MODELS_DIR / 'bin_threshold.pkl', 'rb'))
print(f"=== bin_threshold.pkl ===")
print(f"Type: {type(thresh)}, Value: {thresh}")
print()

# 4. Ensemble weights
bw = pickle.load(open(MODELS_DIR / 'bin_ensemble_weights.pkl', 'rb'))
cw = pickle.load(open(MODELS_DIR / 'cat_ensemble_weights.pkl', 'rb'))
print(f"bin_ensemble_weights: {bw}")
print(f"cat_ensemble_weights: {cw}")
print()

# 5. Category encoder classes
enc = pickle.load(open(MODELS_DIR / 'category_v2_encoder.pkl', 'rb'))
print(f"category_v2_encoder classes: {enc.classes_.tolist()}")

sev_enc = pickle.load(open(MODELS_DIR / 'severity_encoder.pkl', 'rb'))
print(f"severity_encoder classes: {sev_enc.classes_.tolist()}")
