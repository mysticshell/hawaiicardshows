import json, urllib.request, time, os, base64, subprocess

env = {}
with open('.agents/.env') as f:
    for line in f:
        if '=' in line:
            k, v = line.strip().split('=', 1)
            env[k] = v.strip('"')

PRIVATE_KEY = env.get('GA4_PRIVATE_KEY', '').replace('\\n', '\n')
CLIENT_EMAIL = env.get('GA4_CLIENT_EMAIL', '')
PROPERTY_ID = env.get('GA4_PROPERTY_ID', '')

with open('/tmp/key.pem', 'w') as f:
    f.write(PRIVATE_KEY)

def b64enc(b):
    return base64.urlsafe_b64encode(b).decode('utf-8').rstrip('=')

header = b64enc(json.dumps({"alg": "RS256", "typ": "JWT"}).encode('utf-8'))
now = int(time.time())
payload = b64enc(json.dumps({
    "iss": CLIENT_EMAIL,
    "sub": CLIENT_EMAIL,
    "scope": "https://www.googleapis.com/auth/analytics.readonly",
    "aud": "https://oauth2.googleapis.com/token",
    "iat": now,
    "exp": now + 3600
}).encode('utf-8'))

to_sign = f"{header}.{payload}".encode('utf-8')
with open('/tmp/req.txt', 'wb') as f:
    f.write(to_sign)

subprocess.run(["openssl", "dgst", "-sha256", "-sign", "/tmp/key.pem", "-out", "/tmp/sig.bin", "/tmp/req.txt"], check=True)

with open('/tmp/sig.bin', 'rb') as f:
    sig = b64enc(f.read())

jwt = f"{header}.{payload}.{sig}"
data = urllib.parse.urlencode({
    "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
    "assertion": jwt
}).encode('utf-8')

req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data)
try:
    with urllib.request.urlopen(req) as response:
        access_token = json.loads(response.read().decode('utf-8'))['access_token']
except Exception as e:
    print("Error getting token:", e)
    import sys; sys.exit(1)

def run_report(dimensions, metrics, date_range={"startDate": "7daysAgo", "endDate": "today"}, desc=""):
    print(f"\n--- {desc} ---")
    url = f"https://analyticsdata.googleapis.com/v1beta/properties/{PROPERTY_ID}:runReport"
    body = json.dumps({
        "dateRanges": [date_range],
        "dimensions": [{"name": d} for d in dimensions],
        "metrics": [{"name": m} for m in metrics]
    }).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers={
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    })
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            if 'rows' not in res:
                print("No data.")
                return
            for row in res['rows']:
                dims = " | ".join([v['value'] for v in row.get('dimensionValues', [])])
                if not dims: dims = "Total"
                mets = " | ".join([v['value'] for v in row.get('metricValues', [])])
                print(f"{dims} => {mets}")
    except Exception as e:
        print("Error in report:", getattr(e, 'read', lambda: e)())

# 1. Traffic Overview
print("Metrics: sessions | activeUsers | newUsers | bounceRate")
run_report([], ["sessions", "activeUsers", "newUsers", "bounceRate"], desc="Traffic Overview")
print("\nMetrics: sessions")
run_report(["date"], ["sessions"], desc="Daily Trend")

# 2. Acquisition
print("\nMetrics: sessions")
run_report(["sessionDefaultChannelGroup"], ["sessions"], desc="Acquisition Channels")
run_report(["sessionSource", "sessionMedium"], ["sessions"], desc="Specific Sources")

# 3. Content
print("\nMetrics: screenPageViews | sessions")
run_report(["pagePath"], ["screenPageViews", "sessions"], desc="Top Pages")
print("\nMetrics: sessions")
run_report(["landingPagePlusQueryString"], ["sessions"], desc="Entry Pages")

# 4. User Behavior
print("\nMetrics: eventCount")
run_report(["eventName"], ["eventCount"], desc="Events (Form Subs / Clicks)")

print("\nMetrics: sessions")
run_report(["deviceCategory"], ["sessions"], desc="Device Category")
run_report(["country", "region"], ["sessions"], desc="Geographic Breakdown")
