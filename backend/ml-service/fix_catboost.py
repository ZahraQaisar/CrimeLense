"""
Patches app.py to make CatBoost loading optional.
If CatBoost fails (numpy version mismatch), the ensemble falls back to XGBoost + LightGBM only.
"""

path = r'C:\Users\Admin\Desktop\Rafia\CrimeLense Website\backend\ml-service\app.py'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ── Patch 1: Make the 3 CatBoost model loads optional ─────────────────────────
old_cb_load = '''        # Binary risk (SAFE / DANGEROUS)
        models["bin_xgb"]     = load_pkl("final_bin_xgb.pkl")
        models["bin_lgb"]     = load_pkl("final_bin_lgb.pkl")
        models["bin_cb"]      = load_pkl("final_bin_cb.pkl")
        models["bin_weights"] = load_pkl("bin_ensemble_weights.pkl")
        models["bin_thresh"]  = load_pkl("bin_threshold.pkl")

        # Crime category (multi-class)
        models["cat_xgb"]      = load_pkl("final_cat_xgb.pkl")
        models["cat_lgb"]      = load_pkl("final_cat_lgb.pkl")
        models["cat_cb"]       = load_pkl("final_cat_cb.pkl")
        models["cat_weights"]  = load_pkl("cat_ensemble_weights.pkl")
        models["cat_encoder"]  = load_pkl("category_v2_encoder.pkl")

        # Severity (LOW / MEDIUM / HIGH / CRITICAL)
        models["sev_xgb"]     = load_pkl("final_sev_xgb.pkl")
        models["sev_lgb"]     = load_pkl("final_sev_lgb.pkl")
        models["sev_cb"]      = load_pkl("final_sev_cb.pkl")
        models["sev_encoder"] = load_pkl("severity_encoder.pkl")'''

new_cb_load = '''        # Binary risk (SAFE / DANGEROUS)
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

        # CatBoost models — optional (numpy 2.x incompatibility on some systems)
        try:
            models["bin_cb"]  = load_pkl("final_bin_cb.pkl")
            models["cat_cb"]  = load_pkl("final_cat_cb.pkl")
            models["sev_cb"]  = load_pkl("final_sev_cb.pkl")
            print("[CrimeLense] CatBoost models loaded OK")
        except Exception as cb_err:
            print(f"[CrimeLense] CatBoost skipped (numpy mismatch): {cb_err}")
            models["bin_cb"]  = None
            models["cat_cb"]  = None
            models["sev_cb"]  = None'''

assert old_cb_load in content, "CB load block not found"
content = content.replace(old_cb_load, new_cb_load)

# ── Patch 2: Update _ensemble_proba to skip None models ───────────────────────
old_ensemble = '''def _ensemble_proba(models_list, weights, X_df: pd.DataFrame) -> np.ndarray:
    """Weighted soft-voting ensemble — returns averaged probability array."""
    total_w = sum(weights)
    proba   = None
    for mdl, w in zip(models_list, weights):
        p = mdl.predict_proba(X_df)
        proba = p * (w / total_w) if proba is None else proba + p * (w / total_w)
    return proba'''

new_ensemble = '''def _ensemble_proba(models_list, weights, X_df: pd.DataFrame) -> np.ndarray:
    """Weighted soft-voting ensemble — returns averaged probability array. Skips None models."""
    active = [(m, w) for m, w in zip(models_list, weights) if m is not None]
    if not active:
        raise RuntimeError("No models available for ensemble")
    total_w = sum(w for _, w in active)
    proba   = None
    for mdl, w in active:
        p = mdl.predict_proba(X_df)
        proba = p * (w / total_w) if proba is None else proba + p * (w / total_w)
    return proba'''

assert old_ensemble in content, "ensemble proba block not found"
content = content.replace(old_ensemble, new_ensemble)

# ── Patch 3: Update predict_binary to pass models (not hardcoded keys) ────────
old_bin = '''def predict_binary(X_df: pd.DataFrame) -> dict:
    """Binary risk: SAFE or DANGEROUS."""
    w   = models["bin_weights"]
    p   = _ensemble_proba(
        [models["bin_xgb"], models["bin_lgb"], models["bin_cb"]],
        [w.get("xgb", 0.4), w.get("lgb", 0.35), w.get("cb", 0.25)],
        X_df
    )'''

new_bin = '''def predict_binary(X_df: pd.DataFrame) -> dict:
    """Binary risk: SAFE or DANGEROUS."""
    w   = models["bin_weights"]
    p   = _ensemble_proba(
        [models["bin_xgb"], models["bin_lgb"], models["bin_cb"]],
        [w.get("xgb", 0.55), w.get("lgb", 0.45), w.get("cb", 0.25)],
        X_df
    )'''

assert old_bin in content, "predict_binary block not found"
content = content.replace(old_bin, new_bin)

# ── Patch 4: Update predict_category similarly ────────────────────────────────
old_cat = '''def predict_category(X_df: pd.DataFrame) -> dict:
    """Multi-class crime category."""
    w    = models["cat_weights"]
    p    = _ensemble_proba(
        [models["cat_xgb"], models["cat_lgb"], models["cat_cb"]],
        [w.get("xgb", 0.4), w.get("lgb", 0.35), w.get("cb", 0.25)],
        X_df
    )'''

new_cat = '''def predict_category(X_df: pd.DataFrame) -> dict:
    """Multi-class crime category."""
    w    = models["cat_weights"]
    p    = _ensemble_proba(
        [models["cat_xgb"], models["cat_lgb"], models["cat_cb"]],
        [w.get("xgb", 0.55), w.get("lgb", 0.45), w.get("cb", 0.25)],
        X_df
    )'''

assert old_cat in content, "predict_category block not found"
content = content.replace(old_cat, new_cat)

# ── Patch 5: Update predict_severity to skip None sev_cb ──────────────────────
old_sev = '''def predict_severity(X_df: pd.DataFrame) -> dict:
    """Severity: LOW / MEDIUM / HIGH / CRITICAL."""
    sev_xgb = models["sev_xgb"].predict_proba(X_df)
    sev_lgb = models["sev_lgb"].predict_proba(X_df)
    sev_cb  = models["sev_cb"].predict_proba(X_df)
    p       = sev_xgb * 0.4 + sev_lgb * 0.35 + sev_cb * 0.25'''

new_sev = '''def predict_severity(X_df: pd.DataFrame) -> dict:
    """Severity: LOW / MEDIUM / HIGH / CRITICAL."""
    sev_xgb = models["sev_xgb"].predict_proba(X_df)
    sev_lgb = models["sev_lgb"].predict_proba(X_df)
    if models["sev_cb"] is not None:
        sev_cb = models["sev_cb"].predict_proba(X_df)
        p      = sev_xgb * 0.4 + sev_lgb * 0.35 + sev_cb * 0.25
    else:
        p      = sev_xgb * 0.55 + sev_lgb * 0.45'''

assert old_sev in content, "predict_severity block not found"
content = content.replace(old_sev, new_sev)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: app.py patched — CatBoost now optional, ensemble falls back to XGB+LGB")
print("Total lines:", content.count('\n'))

# Quick sanity check
checks = ['bin_cb"]  = None', 'active = [(m, w)', 'sev_cb is not None', 'LAPD_DIVISIONS', 'Rpt Dist No']
for c in checks:
    status = "OK" if c in content else "MISSING"
    print(f"  [{status}] {c}")
