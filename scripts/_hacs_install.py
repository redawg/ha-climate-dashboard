#!/usr/bin/env python3
"""Install/update ha-climate-dashboard via HACS WebSocket API."""
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
REPO_FULL = "redawg/ha-climate-dashboard"


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
        print("Authenticated to HA")

        # List HACS repositories
        result = await ws_call(ws, msg_id, "hacs/repositories/list")
        msg_id += 1
        if not result.get("success"):
            print("HACS list failed:", json.dumps(result)[:300])
            return 1

        repos = result.get("result", [])
        print(f"HACS has {len(repos)} repositories")

        # Find our repo
        our_repo = None
        for r in repos:
            fn = r.get("full_name", "") or ""
            if "ha-climate-dashboard" in fn.lower():
                our_repo = r
                break

        if our_repo:
            rid = our_repo.get("id", "")
            fname = our_repo.get("full_name", "")
            inst = our_repo.get("installed", False)
            iv = our_repo.get("installed_version", "?")
            av = our_repo.get("available_version", "?")
            print(f"Found: {fname} id={rid} installed={inst} v_installed={iv} v_avail={av}")
        else:
            print(f"Repo NOT in HACS, adding {REPO_FULL} ...")
            add_res = await ws_call(ws, msg_id, "hacs/repositories/add",
                                    repository=REPO_FULL, category="plugin")
            msg_id += 1
            print("Add success:", add_res.get("success"))
            if not add_res.get("success"):
                print("Add error:", json.dumps(add_res)[:400])
                return 1

            # Re-list to get the repo entry
            result2 = await ws_call(ws, msg_id, "hacs/repositories/list")
            msg_id += 1
            for r in result2.get("result", []):
                fn = r.get("full_name", "") or ""
                if "ha-climate-dashboard" in fn.lower():
                    our_repo = r
                    break
            if our_repo:
                print(f"Added: {our_repo.get('full_name')} id={our_repo.get('id')}")
            else:
                print("ERROR: repo added but not found in list")
                return 1

        # Download / update the repo
        repo_id = str(our_repo.get("id", ""))
        print(f"Downloading/updating repo {repo_id} ...")
        dl = await ws_call(ws, msg_id, "hacs/repository/download", repository=repo_id)
        msg_id += 1
        print("Download success:", dl.get("success"))
        if not dl.get("success"):
            print("Download error:", json.dumps(dl)[:400])
            return 1

        print("\nHACS install/update complete!")

        # Verify the file is accessible
        import urllib.request
        check_url = f"{HA_URL}/hacsfiles/ha-climate-dashboard/climate-command-center.js"
        try:
            req = urllib.request.Request(check_url, method="HEAD")
            req.add_header("Authorization", f"Bearer {HA_TOKEN}")
            resp = urllib.request.urlopen(req, timeout=10)
            print(f"File check: {check_url} -> HTTP {resp.status}")
        except Exception as ex:
            print(f"File check: {check_url} -> {ex}")

        # Now deploy the dashboard config
        print("\nDeploying dashboard config...")
        RESOURCE_URL = f"/hacsfiles/ha-climate-dashboard/climate-command-center.js?v={int(time.time())}"

        resources = await ws_call(ws, msg_id, "lovelace/resources/list")
        msg_id += 1
        resource = None
        for r in resources.get("result", []):
            if "climate-command-center" in (r.get("url") or ""):
                resource = r
                break

        if not resource:
            await ws_call(ws, msg_id, "lovelace/resources/create",
                          res_type="module", url=RESOURCE_URL)
            msg_id += 1
            print(f"Registered resource: {RESOURCE_URL}")
        else:
            await ws_call(ws, msg_id, "lovelace/resources/update",
                          resource_id=resource["id"], res_type="module", url=RESOURCE_URL)
            msg_id += 1
            print(f"Updated resource: {RESOURCE_URL}")

        print("\nDONE - dashboard should be live at:")
        print(f"  {HA_URL}/climate-dashboard/climate")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
