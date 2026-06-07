#!/usr/bin/env python3
import asyncio
import json
import os
import websockets

TOKEN = os.environ.get(
    "HA_TOKEN",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs",
)
WS = "ws://172.16.255.250:8123/api/websocket"


async def main() -> None:
    async with websockets.connect(WS, max_size=8_000_000) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        print("auth:", await ws.recv())
        mid = 1

        async def call(msg_type: str, **payload):
            nonlocal mid
            await ws.send(json.dumps({"id": mid, "type": msg_type, **payload}))
            while True:
                data = json.loads(await ws.recv())
                if data.get("id") == mid:
                    mid += 1
                    return data

        states = (await call("get_states")).get("result", [])
        for c in sorted(
            (s for s in states if s["entity_id"].startswith("climate.")),
            key=lambda s: s["entity_id"],
        ):
            print("climate", c["entity_id"], c["attributes"].get("friendly_name"))

        areas = (await call("config/area_registry/list")).get("result", [])
        print("\nareas:")
        for a in sorted(areas, key=lambda x: x["name"]):
            print(f"  {a['area_id']}: {a['name']}")

        ents = (await call("config/entity_registry/list")).get("result", [])
        devices = (await call("config/device_registry/list")).get("result", [])
        dev_by_id = {d["id"]: d for d in devices}
        print("\nclimate registry areas:")
        for e in sorted(ents, key=lambda x: x["entity_id"]):
            if e["entity_id"].startswith("climate."):
                dev = dev_by_id.get(e.get("device_id"))
                area_id = e.get("area_id") or (dev.get("area_id") if dev else None)
                area_name = next((a["name"] for a in areas if a["area_id"] == area_id), None)
                print(
                    f"  {e['entity_id']} entity_area={e.get('area_id')} "
                    f"device_area={dev.get('area_id') if dev else None} -> {area_name}"
                )

        for path in ("climate-dashboard",):
            cfg = await call("lovelace/config", url_path=path)
            print(f"\ndashboard {path}:")
            print(json.dumps(cfg.get("result"), indent=2)[:8000])


if __name__ == "__main__":
    asyncio.run(main())
