"""Query HP printer sensor entities from HA."""
import asyncio
import json
import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"

KEYWORDS = ["hp", "printer", "ink", "toner", "cartridge"]


def matches(entity):
    eid = entity["entity_id"].lower()
    attrs = entity.get("attributes", {})
    name = (attrs.get("friendly_name") or "").lower()
    hay = f"{eid} {name}"
    return any(k in hay for k in KEYWORDS)


async def main():
    async with websockets.connect(WS) as ws:
        hello = json.loads(await ws.recv())
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        auth = json.loads(await ws.recv())
        if auth.get("type") != "auth_ok":
            print("Auth failed:", auth)
            return

        await ws.send(json.dumps({"id": 2, "type": "get_states"}))
        result = json.loads(await ws.recv())
        states = result.get("result", [])

        sensors = [
            e for e in states
            if e["entity_id"].startswith("sensor.") and matches(e)
        ]

        print(f"=== HP/PRINTER SENSORS ({len(sensors)} found) ===")
        for e in sorted(sensors, key=lambda x: x["entity_id"]):
            attrs = e.get("attributes", {})
            name = attrs.get("friendly_name", "")
            unit = attrs.get("unit_of_measurement", "")
            dc = attrs.get("device_class", "")
            print(f"  {e['entity_id']}")
            print(f"    name: {name}")
            print(f"    unit: {unit}")
            print(f"    device_class: {dc}")
            print(f"    state: {e.get('state')}")

        pct = [e for e in sensors if e.get("attributes", {}).get("unit_of_measurement") == "%"]
        print(f"\n=== WITH unit_of_measurement '%' ({len(pct)} found) ===")
        for e in sorted(pct, key=lambda x: x["entity_id"]):
            attrs = e.get("attributes", {})
            print(f"  {e['entity_id']} | {attrs.get('friendly_name', '')} | {e.get('state')}%")


if __name__ == "__main__":
    asyncio.run(main())
