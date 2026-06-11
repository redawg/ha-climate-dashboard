"""Inspect HACS repo and force re-download."""
import asyncio
import json
import urllib.request

import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"
REPO_ID = "1261676218"


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
        info = await ws_call(ws, msg_id, "hacs/repository", repository=REPO_ID)
        msg_id += 1
        r = info.get("result", {})
        keys = [
            "full_name", "local_path", "ref", "selected_tag", "selected_branch",
            "installed_version", "available_version", "last_updated", "last_fetched",
            "updated_info", "config",
        ]
        for k in keys:
            print(f"{k}: {r.get(k)}")

        refresh = await ws_call(ws, msg_id, "hacs/repository/refresh", repository=REPO_ID)
        msg_id += 1
        print("refresh:", refresh.get("success"))

        dl = await ws_call(ws, msg_id, "hacs/repository/download", repository=REPO_ID)
        msg_id += 1
        print("download:", dl.get("success"), json.dumps(dl)[:200])

    url = "http://172.16.255.250:8123/hacsfiles/ha-climate-dashboard/climate-command-center.js"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=15) as resp:
        body = resp.read()
        text = body.decode("utf-8", errors="replace")
        print(f"HA file len={len(body)} officejet={'officejet' in text}")


if __name__ == "__main__":
    asyncio.run(main())
