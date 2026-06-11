"""List HACS repo details for ha-climate-dashboard."""
import asyncio
import json

import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"


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

        res = await ws_call(ws, 1, "hacs/repositories/list")
        for r in res.get("result", []):
            fn = (r.get("full_name") or "").lower()
            if "climate" in fn or "ha-climate" in fn:
                print(json.dumps(r, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
