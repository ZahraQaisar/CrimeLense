"""
Quick debug: load models and run engineer_features directly (no Flask needed)
to verify the feature vector looks correct before hitting the model.
"""
import sys, os, json
sys.path.insert(0, r'C:\Users\Admin\Desktop\Rafia\CrimeLense Website\backend\ml-service')
os.chdir(r'C:\Users\Admin\Desktop\Rafia\CrimeLense Website\backend\ml-service')

# Directly import app to trigger load_models()
import importlib.util
spec = importlib.util.spec_from_file_location("app", r'C:\Users\Admin\Desktop\Rafia\CrimeLense Website\backend\ml-service\app.py')
app_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_mod)

print("Models ready:", app_mod.ready)
print("Feature cols:", app_mod.models['feature_cols'])
print()

# Test engineer_features
X = app_mod.engineer_features(34.044, -118.243, 22, 4, 0)
print("Feature vector for Downtown LA 10PM:")
print(X.to_string())
print()

# Run full prediction chain
binary   = app_mod.predict_binary(X)
category = app_mod.predict_category(X)
print("Binary:", binary)
print("Category:", category)

X_sev = X.copy()
X_sev["predicted_category"] = list(app_mod.models["cat_encoder"].classes_).index(category["label"])
X_sev["binary_risk"] = 1 if binary["label"] == "DANGEROUS" else 0
severity = app_mod.predict_severity(X_sev)
print("Severity:", severity)

score = app_mod.get_risk_score(binary, severity)
print("FINAL RISK SCORE:", score)
