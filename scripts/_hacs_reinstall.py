"""Remove and reinstall HACS repo to force fresh download."""
import asyncio
import json
import time
import urllib.request

import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"
REPO_ID = "1261676218"
REPO_FULL = "redawg/ha-climate-dashboard"
JS_PATH = "/hacsfiles/ha-climate-dashboard/climate-command-center.js"


async def ws_call(ws, msg_id, msg_type, **payload):
    await ws.send(json.dumps({"id": msg_id, "type": msg_type, **payload}))
    while True:
        data = json.loads(await ws.recv())
        if data.get("id") == msg_id:
            return data


async def main():
    async with websockets.connect(WS, max_size=16_000_000) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        await ws.recv()

        msg_id = 1
        rm = await ws_call(ws, msg_id, "hacs/repository/remove", repository=REPO_ID)
        msg_id += 1
        print("remove:", rm.get("success"), json.dumps(rm)[:200])

        add = await ws_call(ws, msg_id, "hacs/repositories/add", repository=REPO_FULL, category="plugin")
        msg_id += 1
        print("add:", add.get("success"))

        repos = await ws_call(ws, msg_id, "hacs/repositories/list")
        msg_id += 1
        repo_id = REPO_ID
        for r in repos.get("result", []):
            if r.get("full_name") == REPO_FULL:
                repo_id = r.get("id")
                print("repo id:", repo_id)
                break

        dl = await ws_call(ws, msg_id, "hacs/repository/download", repository=repo_id)
        msg_id += 1
        print("download:", dl.get("success"))

        bust = int(time.time())
        resources = await ws_call(ws, msg_id, "lovelace/resources/list")
        msg_id += 1
        for r in resources.get("result", []):
            if "climate-command-center" in r.get("url", ""):
                await ws_call(
                    ws, msg_id, "lovelace/resources/update",
                    resource_id=r["id"],
                    res_type=r.get("res_type", "module"),
                    url=f"{JS_PATH}?v={bust}",
                )
                msg_id += 1
                print("resource bust:", bust)

    url = f"http://172.16.255.250:8123{JS_PATH}?v={bust}"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Cache-Control", "no-cache")
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read()
        text = body.decode("utf-8", errors="replace")
        print(f"HTTP {resp.status} len={len(body)} officejet={'officejet' in text}")


if __name__ == "__main__":
    asyncio.run(main())
