import urllib.request, json

def test(label, lat, lon, hour, weapon=0):
    body = json.dumps({"latitude":lat,"longitude":lon,"hour":hour,"month":4,"weapon_used":weapon}).encode()
    req  = urllib.request.Request("http://localhost:5000/predict/full", data=body,
                                   headers={"Content-Type":"application/json"})
    r    = json.loads(urllib.request.urlopen(req, timeout=15).read())
    cat  = r["category"]["label"]
    conf = r["category"]["confidence"]
    sev  = r["severity"]["label"]
    bkd  = r["severity"]["breakdown"]
    dp   = r["binary"]["danger_prob"]
    sc   = r["risk_score"]
    print(f"{label}")
    print(f"  category  : {cat} ({conf}%)")
    print(f"  severity  : {sev}  {bkd}")
    print(f"  danger%   : {dp}%")
    print(f"  score     : {sc}")
    print()

test("Downtown 10PM no weapon",  34.044, -118.243, 22, 0)
test("Downtown 2AM + weapon",    34.044, -118.243,  2, 1)
test("77th St  2AM + weapon",    33.951, -118.287,  2, 1)
test("Hollywood 2AM no weapon",  34.098, -118.327,  2, 0)
test("Wilshire  6PM no weapon",  34.061, -118.344, 18, 0)
test("West Valley 9AM no weapon",34.183, -118.571,  9, 0)
test("Devonshire  9AM no weapon",34.289, -118.502,  9, 0)
