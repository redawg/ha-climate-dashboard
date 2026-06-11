"""Fetch raw JS from GitHub and compare with HA."""
import urllib.request

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
GH = "https://raw.githubusercontent.com/redawg/ha-climate-dashboard/main/dist/climate-command-center.js"
HA = "http://172.16.255.250:8123/hacsfiles/ha-climate-dashboard/climate-command-center.js"

for label, url, auth in [
    ("github", GH, False),
    ("ha", HA, True),
]:
    req = urllib.request.Request(url)
    if auth:
        req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read()
        text = body.decode("utf-8", errors="replace")
        print(f"{label}: HTTP {resp.status} len={len(body)} officejet={('officejet' in text)}")
