#!/usr/bin/env python3
"""Force HACS to refresh repo metadata and re-download latest."""
import asyncio
import json
import sys
import time

try:
    import websockets
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "websockets", "-q"])
    import websockets

HA_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS_URL = "ws://172.16.255.250:8123/api/websocket"
HA_URL = "http://172.16.255.250:8123"


async def ws_call(ws, msg_id, msg_type, **payload):
    await ws.send(json.dumps({"id": msg_id, "type": msg_type, **payload}))
    while True:
        raw = await ws.recv()
        data = json.loads(raw)
        if data.get("id") == msg_id:
            return data


async def main():
    msg_id = 1
    async with websockets.connect(WS_URL, max_size=16_000_000) as ws:
        hello = json.loads(await ws.recv())
        await ws.send(json.dumps({"type": "auth", "access_token": HA_TOKEN}))
        auth = json.loads(await ws.recv())
        if auth.get("type") != "auth_ok":
            print("Auth failed:", auth)
            return 1
        print("Authenticated")

        # Find repo
        res = await ws_call(ws, msg_id, "hacs/repositories/list")
        msg_id += 1
        repo = None
        for r in res.get("result", []):
            if "ha-climate-dashboard" in (r.get("full_name", "") or "").lower():
                repo = r
                break

        if not repo:
            print("Repo not found in HACS!")
            return 1

        repo_id = str(repo.get("id", ""))
        print(f"Repo: {repo.get('full_name')} id={repo_id}")
        print(f"  installed_version: {repo.get('installed_version')}")
        print(f"  available_version: {repo.get('available_version')}")

        # Force refresh repo info
        print("\nRefreshing repository info...")
        refresh = await ws_call(ws, msg_id, "hacs/repository/refresh",
                                repository=repo_id)
        msg_id += 1
        print(f"  Refresh success: {refresh.get('success')}")

        # Wait a moment for HACS to update
        await asyncio.sleep(3)

        # Re-check versions
        res2 = await ws_call(ws, msg_id, "hacs/repositories/list")
        msg_id += 1
        for r in res2.get("result", []):
            if "ha-climate-dashboard" in (r.get("full_name", "") or "").lower():
                print(f"  After refresh - installed: {r.get('installed_version')}, available: {r.get('available_version')}")
                break

        # Download latest
        print("\nDownloading latest...")
        dl = await ws_call(ws, msg_id, "hacs/repository/download",
                           repository=repo_id)
        msg_id += 1
        print(f"  Download success: {dl.get('success')}")

        # Update resource with cache-bust
        RESOURCE_URL = f"/hacsfiles/ha-climate-dashboard/climate-command-center.js?v={int(time.time())}"
        resources = await ws_call(ws, msg_id, "lovelace/resources/list")
        msg_id += 1
        for r in resources.get("result", []):
            if "climate-command-center" in (r.get("url") or ""):
                await ws_call(ws, msg_id, "lovelace/resources/update",
                              resource_id=r["id"], res_type="module", url=RESOURCE_URL)
                msg_id += 1
                print(f"  Updated resource: {RESOURCE_URL}")
                break

        # Verify
        import urllib.request
        check_url = f"{HA_URL}/hacsfiles/ha-climate-dashboard/climate-command-center.js"
        try:
            req = urllib.request.Request(check_url)
            req.add_header("Authorization", f"Bearer {HA_TOKEN}")
            resp = urllib.request.urlopen(req, timeout=10)
            print(f"\nFile verified: HTTP {resp.status}, size={resp.headers.get('Content-Length', '?')}")
        except Exception as ex:
            print(f"\nFile check failed: {ex}")

        print("\nDone! Hard-refresh browser.")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
