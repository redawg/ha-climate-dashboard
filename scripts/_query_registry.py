"""Query HA entity registry for ecobee and remote sensor entries."""
import asyncio
import json
import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"


async def recv_result(ws, msg_id):
    while True:
        data = json.loads(await ws.recv())
        if data.get("id") == msg_id:
            return data


async def main():
    async with websockets.connect(WS) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        auth = json.loads(await ws.recv())
        if auth.get("type") != "auth_ok":
            print("Auth failed:", auth)
            return

        await ws.send(json.dumps({"id": 3, "type": "config/entity_registry/list"}))
        entities = (await recv_result(ws, 3)).get("result", [])

        patterns = ["ecobee", "remote", "main_floor", "redmond", "thermostat"]
        for p in patterns:
            print(f"\n=== Registry matching '{p}' ===")
            for e in sorted(entities, key=lambda x: x.get("entity_id", "")):
                eid = e.get("entity_id", "")
                name = e.get("name") or e.get("original_name") or ""
                platform = e.get("platform", "")
                area_id = e.get("area_id", "")
                hay = f"{eid} {name} {platform}".lower()
                if p in hay:
                    print(f"  {eid}")
                    print(f"    name: {name}, platform: {platform}, area: {area_id}")

        print("\n=== All humidity sensors ===")
        for e in sorted(entities, key=lambda x: x.get("entity_id", "")):
            eid = e.get("entity_id", "")
            if not eid.startswith("sensor."):
                continue
            # need states for device_class - get from registry doesn't have it
            if "humidity" in eid.lower():
                print(f"  {eid} platform={e.get('platform')}")


if __name__ == "__main__":
    asyncio.run(main())
