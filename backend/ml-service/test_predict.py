import urllib.request, json

def predict(lat, lon, hour, month, weapon=0):
    data = json.dumps({
        'latitude': lat, 'longitude': lon,
        'hour': hour, 'month': month, 'weapon_used': weapon
    }).encode()
    req  = urllib.request.Request(
        'http://localhost:5000/predict/full', data=data,
        headers={'Content-Type': 'application/json'}
    )
    resp = urllib.request.urlopen(req, timeout=15)
    return json.loads(resp.read())

tests = [
    ('Downtown LA  - 10 PM no weapon',    34.044, -118.243, 22, 4, 0),
    ('Hollywood   -  2 AM no weapon',     34.098, -118.327,  2, 4, 0),
    ('West Valley -  9 AM no weapon',     34.183, -118.571,  9, 4, 0),
    ('77th St     -  2 AM WITH weapon',   33.951, -118.287,  2, 4, 1),
    ('Wilshire    - 10 PM no weapon',     34.061, -118.344, 22, 4, 0),
    ('Harbor      -  3 PM no weapon',     33.753, -118.284, 15, 4, 0),
    ('Southeast   -  3 AM WITH weapon',   33.922, -118.229,  3, 4, 1),
]

print(f"{'Area':<40} | {'Score':>5} | {'Binary':<10} | {'Danger%':>7} | Severity")
print('-' * 90)
for label, lat, lon, hour, month, wpn in tests:
    try:
        d = predict(lat, lon, hour, month, wpn)
        b = d.get('binary', {})
        s = d.get('severity', {})
        score     = d.get('risk_score', 'ERR')
        lbl       = b.get('label', '?')
        danger    = b.get('danger_prob', 0)
        severity  = s.get('label', '?')
        print(f"{label:<40} | {str(score):>5} | {lbl:<10} | {danger:>7.1f}% | {severity}")
    except Exception as e:
        print(f"{label:<40} | ERROR: {e}")
