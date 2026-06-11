#!/usr/bin/env python3
"""Upload climate-command-center.js to HA's www directory via REST API."""
import os
import sys
import requests

HA_URL = os.environ.get("HA_URL", "http://172.16.255.250:8123").rstrip("/")
TOKEN = os.environ.get(
    "HA_TOKEN",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs",
)
JS_FILE = os.path.join(os.path.dirname(__file__), "..", "dist", "climate-command-center.js")

headers = {"Authorization": f"Bearer {TOKEN}"}

# Try uploading via media upload (which can write to /config/www/)
# HA provides /api/config/custom_components but not direct file write.
# Instead, let's use the /api/states endpoint as a test, and the
# actual file needs to go via a different mechanism.

# Check if we can reach HA
r = requests.get(f"{HA_URL}/api/", headers=headers)
print(f"HA API status: {r.status_code}")

# Try the www folder via the built-in web server
# First check if /local/ works at all
r2 = requests.get(f"{HA_URL}/local/", headers=headers)
print(f"/local/ status: {r2.status_code}")

# HA doesn't have a REST endpoint to write files to www/
# We need to use a different approach. Let's check if the SSH add-on API is available.
r3 = requests.get(f"{HA_URL}/api/hassio/addons", headers=headers)
if r3.status_code == 200:
    addons = r3.json().get("data", {}).get("addons", [])
    ssh_addons = [a for a in addons if "ssh" in a.get("slug", "").lower() or "ssh" in a.get("name", "").lower()]
    print(f"SSH addons found: {[a.get('slug') for a in ssh_addons]}")
    for a in ssh_addons:
        print(f"  {a.get('slug')}: state={a.get('state')}")
else:
    print(f"Hassio API: {r3.status_code}")

# Check if terminal/SSH addon is available
r4 = requests.post(
    f"{HA_URL}/api/hassio/addons/core_ssh/info",
    headers=headers,
)
if r4.status_code == 200:
    info = r4.json().get("data", {})
    print(f"SSH addon: state={info.get('state')}, port={info.get('port')}")
else:
    # Try advanced SSH
    r5 = requests.post(
        f"{HA_URL}/api/hassio/addons/a0d7b954_ssh/info",
        headers=headers,
    )
    if r5.status_code == 200:
        info = r5.json().get("data", {})
        print(f"Advanced SSH addon: state={info.get('state')}, port={info.get('port')}")
    else:
        print(f"No SSH addon found (core: {r4.status_code}, advanced: {r5.status_code})")
