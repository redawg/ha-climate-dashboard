"""Force HACS to refresh repo info and download latest commit."""
import asyncio
import json
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
        # Refresh repository metadata from GitHub
        for call_type in ["hacs/repository/refresh", "hacs/repository/update"]:
            res = await ws_call(ws, msg_id, call_type, repository=REPO_ID)
            msg_id += 1
            print(f"{call_type}: success={res.get('success')}")

        dl = await ws_call(ws, msg_id, "hacs/repository/download", repository=REPO_ID)
        msg_id += 1
        print(f"download: success={dl.get('success')}")

        info = await ws_call(ws, msg_id, "hacs/repositories/list")
        for r in info.get("result", []):
            if "ha-climate-dashboard" in (r.get("full_name") or "").lower():
                print(f"installed={r.get('installed_version')} available={r.get('available_version')}")


if __name__ == "__main__":
    asyncio.run(main())
