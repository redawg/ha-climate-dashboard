#!/usr/bin/env python3
"""Refresh HACS repo, re-download, and cache-bust resource URL."""
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
REPO_FULL = "redawg/ha-climate-dashboard"
RESOURCE_BASE = "/hacsfiles/ha-climate-dashboard/climate-command-center.js"


async def ws_call(ws, msg_id, msg_type, **payload):
    await ws.send(json.dumps({"id": msg_id, "type": msg_type, **payload}))
    while True:
        raw = await ws.recv()
        data = json.loads(raw)
        if data.get("id") == msg_id:
            return data


async def main():
    async with websockets.connect(WS_URL, max_size=10*1024*1024) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": HA_TOKEN}))
        auth = json.loads(await ws.recv())
        if auth.get("type") != "auth_ok":
            print("Auth failed:", auth)
            return

        repos = await ws_call(ws, 1, "hacs/repositories/list")
        repo = next(
            (r for r in repos.get("result", []) if r.get("full_name") == REPO_FULL),
            None,
        )
        if not repo:
            print("Repo not found in HACS, adding...")
            await ws_call(ws, 2, "hacs/repositories/add", repository=REPO_FULL, category="plugin")
            repos = await ws_call(ws, 3, "hacs/repositories/list")
            repo = next(
                (r for r in repos.get("result", []) if r.get("full_name") == REPO_FULL),
                None,
            )

        if repo:
            repo_id = repo.get("id")
            print(f"Found repo id={repo_id}, refreshing...")
            r = await ws_call(ws, 10, "hacs/repository/refresh", repository=repo_id)
            print("Refresh:", r.get("success"))
            await asyncio.sleep(2)
            r = await ws_call(ws, 11, "hacs/repository/download", repository=repo_id)
            print("Download:", r.get("success"))
        else:
            print("ERROR: Could not find repo even after adding!")
            return

        ts = int(time.time())
        resource_url = f"{RESOURCE_BASE}?v={ts}"
        lr = await ws_call(ws, 20, "lovelace/resources")
        resources = lr.get("result", [])
        existing = next(
            (r for r in resources if RESOURCE_BASE in r.get("url", "")), None
        )
        if existing:
            r = await ws_call(
                ws, 21, "lovelace/resources/update",
                resource_id=existing["id"], url=resource_url,
            )
            print(f"Resource updated: {resource_url} -> {r.get('success')}")
        else:
            urls = [r.get("url") for r in resources]
            print(f"Resource not found. Existing URLs: {urls}")

        print("Done!")


if __name__ == "__main__":
    asyncio.run(main())
