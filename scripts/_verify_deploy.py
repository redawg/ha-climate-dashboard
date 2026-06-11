"""Verify deployed JS contains fix markers and HTTP 200."""
import urllib.request

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
URL = "http://172.16.255.250:8123/hacsfiles/ha-climate-dashboard/climate-command-center.js"

req = urllib.request.Request(URL)
req.add_header("Authorization", f"Bearer {TOKEN}")
with urllib.request.urlopen(req, timeout=15) as resp:
    print(f"HTTP {resp.status}")
    body = resp.read().decode("utf-8", errors="replace")
    markers = ["outdoor", "sensorlinx", "floor_temperature", "Outdoor reset target", "ecobee"]
    for m in markers:
        print(f"  contains '{m}': {m in body}")
