#!/usr/bin/env python3
import asyncio
import json
import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"


async def main() -> None:
    async with websockets.connect(WS, max_size=8_000_000, open_timeout=90) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        await ws.recv()
        await ws.send(json.dumps({"id": 1, "type": "get_states"}))
        while True:
            data = json.loads(await ws.recv())
            if data.get("id") != 1:
                continue
            for state in sorted(data["result"], key=lambda s: s["entity_id"]):
                eid = state["entity_id"].lower()
                fn = str(state.get("attributes", {}).get("friendly_name", "")).lower()
                hay = eid + " " + fn
                if any(
                    k in hay
                    for k in (
                        "sensorlinx",
                        "away_mode",
                        "wwsd",
                        "warm weather",
                        "warm_weather",
                        "outdoor_reset",
                    )
                ):
                    print(
                        state["entity_id"],
                        state["state"],
                        state.get("attributes", {}).get("friendly_name"),
                    )
            break


if __name__ == "__main__":
    asyncio.run(main())
