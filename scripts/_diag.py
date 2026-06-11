#!/usr/bin/env python3
"""Diagnose HACS deployment issues."""
import asyncio
import json
import sys
import urllib.request

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
    # 1. Check JS file via HTTP
    print("=== 1. JS FILE SERVED? ===")
    js_url = HA_URL + "/hacsfiles/ha-climate-dashboard/climate-command-center.js"
    try:
        req = urllib.request.Request(js_url)
        req.add_header("Authorization", "Bearer " + HA_TOKEN)
        resp = urllib.request.urlopen(req, timeout=10)
        body = resp.read(500).decode("utf-8", errors="replace")
        cl = resp.headers.get("Content-Length", "unknown")
        ct = resp.headers.get("Content-Type", "unknown")
        print(f"  URL: {js_url}")
        print(f"  Status: {resp.status}")
        print(f"  Content-Length: {cl}")
        print(f"  Content-Type: {ct}")
        print(f"  First 200 chars: {body[:200]}")
    except Exception as ex:
        print(f"  ERROR: {ex}")

    # 2. WebSocket checks
    print("\n=== 2. WEBSOCKET CHECKS ===")
    msg_id = 1
    async with websockets.connect(WS_URL, max_size=16_000_000) as ws:
        hello = json.loads(await ws.recv())
        await ws.send(json.dumps({"type": "auth", "access_token": HA_TOKEN}))
        auth = json.loads(await ws.recv())
        if auth.get("type") != "auth_ok":
            print("Auth failed:", auth)
            return

        # Resources
        print("\n--- Lovelace Resources ---")
        res = await ws_call(ws, msg_id, "lovelace/resources/list")
        msg_id += 1
        for r in res.get("result", []):
            url = r.get("url", "")
            if "climate" in url.lower():
                print(f"  id={r.get('id')} type={r.get('res_type')} url={url}")

        # Dashboard config
        print("\n--- Dashboard Config ---")
        dashboards = await ws_call(ws, msg_id, "lovelace/dashboards/list")
        msg_id += 1
        dash = None
        for d in dashboards.get("result", []):
            if d.get("url_path") == "climate-dashboard":
                dash = d
                print(f"  Dashboard: {d.get('url_path')} mode={d.get('mode')}")
                break
        if not dash:
            print("  Dashboard 'climate-dashboard' NOT FOUND")

        if dash:
            cfg = await ws_call(ws, msg_id, "lovelace/config",
                                url_path="climate-dashboard")
            msg_id += 1
            if cfg.get("success"):
                config = cfg.get("result", {})
                views = config.get("views", [])
                print(f"  Views: {len(views)}")
                for v in views:
                    cards = v.get("cards", [])
                    print(f"    View '{v.get('title')}' path={v.get('path')} panel={v.get('panel')} cards={len(cards)}")
                    for c in cards:
                        print(f"      Card type: {c.get('type')}")
            else:
                print(f"  Config fetch error: {json.dumps(cfg)[:300]}")

        # HACS repo status
        print("\n--- HACS Repo Status ---")
        hacs = await ws_call(ws, msg_id, "hacs/repositories/list")
        msg_id += 1
        for r in hacs.get("result", []):
            fn = r.get("full_name", "") or ""
            if "ha-climate-dashboard" in fn.lower():
                print(f"  full_name: {r.get('full_name')}")
                print(f"  installed: {r.get('installed')}")
                print(f"  installed_version: {r.get('installed_version')}")
                print(f"  available_version: {r.get('available_version')}")
                print(f"  category: {r.get('category')}")
                print(f"  status: {r.get('status')}")
                break

    print("\n=== DONE ===")


if __name__ == "__main__":
    asyncio.run(main())
