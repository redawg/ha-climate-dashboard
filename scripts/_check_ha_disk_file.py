"""Check on-disk HACS file via Supervisor/host commands."""
import json
import urllib.request

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
HA = "http://172.16.255.250:8123"
PATH = "/config/www/community/ha-climate-dashboard/climate-command-center.js"


def api(path, method="GET", data=None):
    req = urllib.request.Request(f"{HA}{path}", method=method, data=data)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    if data:
        req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status, resp.read()


# Try supervisor host command (HA OS)
cmd = f"wc -c {PATH}; grep -o officejet {PATH} | head -1 || true"
body = json.dumps({"endpoint": "core_ssh", "method": "POST", "data": {"command": cmd}})
for ep in [
    "/api/hassio/app/core_ssh/run",
    "/api/hassio/app/a0d7b954_ssh/run",
]:
    try:
        status, raw = api(ep, "POST", body.encode())
        print(ep, status, raw.decode()[:500])
    except Exception as e:
        print(ep, "error:", e)

# List addons
try:
    status, raw = api("/api/hassio/addons", "GET")
    data = json.loads(raw)
    for a in data.get("data", {}).get("addons", []):
        slug = a.get("slug", "")
        if "ssh" in slug.lower() or "terminal" in slug.lower():
            print("addon:", slug, a.get("state"))
except Exception as e:
    print("addons error:", e)
