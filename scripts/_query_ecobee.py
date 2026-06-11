"""Query HA for Ecobee and outdoor sensor entities."""
import asyncio
import json
import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"


async def main():
    async with websockets.connect(WS) as ws:
        hello = json.loads(await ws.recv())
        if hello.get("type") != "auth_required":
            print("Unexpected hello:", hello)
            return
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        auth = json.loads(await ws.recv())
        if auth.get("type") != "auth_ok":
            print("Auth failed:", auth)
            return

        await ws.send(json.dumps({"id": 2, "type": "get_states"}))
        result = json.loads(await ws.recv())
        states = result.get("result", [])

        patterns = ["ecobee", "sensorlinx", "outdoor", "outside", "remote sensor"]
        for p in patterns:
            print(f"\n=== Matching '{p}' ===")
            for e in sorted(states, key=lambda x: x["entity_id"]):
                eid = e["entity_id"]
                attrs = e.get("attributes", {})
                name = attrs.get("friendly_name", "")
                dc = attrs.get("device_class", "")
                hay = f"{eid} {name}".lower()
                if p in hay:
                    print(f"  {eid}")
                    print(f"    name: {name}")
                    print(f"    device_class: {dc}")
                    print(f"    state: {e.get('state')}")


if __name__ == "__main__":
    asyncio.run(main())
