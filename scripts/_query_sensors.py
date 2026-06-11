"""Query all climate and temperature sensor entities from HA."""
import asyncio
import json
import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"


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

        print("=== CLIMATE ENTITIES ===")
        for e in sorted(states, key=lambda x: x["entity_id"]):
            if e["entity_id"].startswith("climate."):
                attrs = e.get("attributes", {})
                print(f"  {e['entity_id']}")
                print(f"    name: {attrs.get('friendly_name', '')}")
                print(f"    state: {e.get('state')}")

        print("\n=== TEMPERATURE SENSORS (device_class=temperature) ===")
        for e in sorted(states, key=lambda x: x["entity_id"]):
            if not e["entity_id"].startswith("sensor."):
                continue
            attrs = e.get("attributes", {})
            dc = attrs.get("device_class", "")
            if dc != "temperature":
                continue
            name = attrs.get("friendly_name", "")
            print(f"  {e['entity_id']}")
            print(f"    name: {name}")
            print(f"    state: {e.get('state')}")

        print("\n=== SENSORS with 'temperature' in name/id but no device_class ===")
        for e in sorted(states, key=lambda x: x["entity_id"]):
            if not e["entity_id"].startswith("sensor."):
                continue
            attrs = e.get("attributes", {})
            dc = attrs.get("device_class", "")
            if dc == "temperature":
                continue
            eid = e["entity_id"]
            name = attrs.get("friendly_name", "")
            hay = f"{eid} {name}".lower()
            if "temperature" in hay or "temp" in hay or "remote" in hay:
                print(f"  {eid}")
                print(f"    name: {name}")
                print(f"    device_class: {dc}")
                print(f"    state: {e.get('state')}")


if __name__ == "__main__":
    asyncio.run(main())
