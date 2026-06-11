"""Verify deployed JS has HP exclude patterns."""
import urllib.request

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
BASE = "http://172.16.255.250:8123/hacsfiles/ha-climate-dashboard/climate-command-center.js"

for suffix in ["", "?v=check"]:
    url = BASE + suffix
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=15) as resp:
        body = resp.read().decode("utf-8", errors="replace")
        print(f"URL {url}: HTTP {resp.status}, len={len(body)}")
        for m in ["officejet", "printer", "toner", "deye", "ubiquiti"]:
            print(f"  '{m}': {m in body}")
