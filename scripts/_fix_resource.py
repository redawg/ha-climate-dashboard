#!/usr/bin/env python3
"""Fix the Lovelace resource type and re-deploy."""
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
RESOURCE_URL = f"/hacsfiles/ha-climate-dashboard/climate-command-center.js?v={int(time.time())}"


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

        # List all resources
        res = await ws_call(ws, msg_id, "lovelace/resources/list")
        msg_id += 1
        resources = res.get("result", [])

        print("Current resources:")
        for r in resources:
            print(f"  id={r.get('id')} type={r.get('res_type')} url={r.get('url')}")

        # Find and fix our resource
        for r in resources:
            url = r.get("url", "")
            if "climate-command-center" in url:
                rid = r.get("id")
                old_type = r.get("res_type")
                print(f"\nFixing resource {rid}: type={old_type} -> module")

                # Delete and recreate to ensure clean state
                print("Deleting old resource...")
                del_res = await ws_call(ws, msg_id, "lovelace/resources/delete",
                                        resource_id=rid)
                msg_id += 1
                print(f"  Delete success: {del_res.get('success')}")

                print(f"Creating new resource with type=module ...")
                create_res = await ws_call(ws, msg_id, "lovelace/resources/create",
                                           res_type="module", url=RESOURCE_URL)
                msg_id += 1
                print(f"  Create success: {create_res.get('success')}")
                if create_res.get("success"):
                    new_r = create_res.get("result", {})
                    print(f"  New id={new_r.get('id')} type={new_r.get('res_type')} url={new_r.get('url')}")
                else:
                    print(f"  Error: {json.dumps(create_res)[:300]}")
                break
        else:
            print("\nNo climate-command-center resource found, creating fresh...")
            create_res = await ws_call(ws, msg_id, "lovelace/resources/create",
                                       res_type="module", url=RESOURCE_URL)
            msg_id += 1
            print(f"  Create success: {create_res.get('success')}")

        # Verify
        print("\nVerifying resources after fix:")
        res2 = await ws_call(ws, msg_id, "lovelace/resources/list")
        msg_id += 1
        for r in res2.get("result", []):
            url = r.get("url", "")
            if "climate" in url.lower():
                print(f"  id={r.get('id')} type={r.get('res_type')} url={url}")

        print("\nDone! Hard-refresh your browser (Ctrl+Shift+R)")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
