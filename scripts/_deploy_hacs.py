"""Deploy with HACS resource path (no dev server dependency)."""
import os
import subprocess
import sys

os.environ["HA_TOKEN"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
os.environ["HA_CARD_URL"] = "/hacsfiles/ha-climate-dashboard/climate-command-center.js"

sys.exit(subprocess.call([sys.executable, "scripts/deploy_ha_ws.py"]))
