"""Force HACS refresh + download, then verify deployed JS."""
import asyncio
import json
import time
import urllib.request

import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"
REPO_ID = "1261676218"
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
        for call in ["hacs/repository/refresh", "hacs/repository/update"]:
            res = await ws_call(ws, msg_id, call, repository=REPO_ID)
            msg_id += 1
            print(f"{call}: success={res.get('success')}")

        dl = await ws_call(ws, msg_id, "hacs/repository/download", repository=REPO_ID)
        msg_id += 1
        print(f"download: success={dl.get('success')}")

        bust = int(time.time())
        resources = await ws_call(ws, msg_id, "lovelace/resources/list")
        msg_id += 1
        for r in resources.get("result", []):
            if "climate-command-center" in r.get("url", ""):
                upd = await ws_call(
                    ws,
                    msg_id,
                    "lovelace/resources/update",
                    resource_id=r["id"],
                    res_type=r.get("res_type", "module"),
                    url=f"{JS_PATH}?v={bust}",
                )
                msg_id += 1
                print(f"resource update: {upd.get('success')} v={bust}")

    url = f"http://172.16.255.250:8123{JS_PATH}?v={bust}"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=15) as resp:
        body = resp.read()
        print(f"HTTP {resp.status} len={len(body)}")
        text = body.decode("utf-8", errors="replace")
        print(f"officejet: {'officejet' in text}")
        print(f"printer: {'printer' in text}")


if __name__ == "__main__":
    asyncio.run(main())
