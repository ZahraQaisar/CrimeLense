import pickle
from pathlib import Path

MODELS_DIR = Path("../../Models files")
with open(MODELS_DIR / "final_bin_xgb.pkl", "rb") as f:
    bin_m = pickle.load(f)
with open(MODELS_DIR / "final_cat_xgb.pkl", "rb") as f:
    cat_m = pickle.load(f)
with open(MODELS_DIR / "final_sev_xgb.pkl", "rb") as f:
    sev_m = pickle.load(f)

print("Binary model features:", len(bin_m.feature_names_in_))
print(bin_m.feature_names_in_)
print("\nCategory model features:", len(cat_m.feature_names_in_))
print(cat_m.feature_names_in_[-5:])
print("\nSeverity model features:", len(sev_m.feature_names_in_))
print(sev_m.feature_names_in_[-5:])

# Also what are the labels in cat_encoder?
with open(MODELS_DIR / "category_v2_encoder.pkl", "rb") as f:
    enc = pickle.load(f)
print("\nCat encoder classes:", enc.classes_)
