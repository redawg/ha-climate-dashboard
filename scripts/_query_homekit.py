"""Find HomeKit Ecobee remote sensor entities."""
import asyncio
import json
import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"


async def main():
    async with websockets.connect(WS, max_size=10 * 1024 * 1024) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        await ws.recv()

        await ws.send(json.dumps({"id": 2, "type": "get_states"}))
        result = json.loads(await ws.recv())
        states = result.get("result", [])

        # HomeKit ecobee remote sensors often have occupancy binary sensors
        print("=== binary_sensor with occupancy (potential ecobee remotes) ===")
        for e in sorted(states, key=lambda x: x["entity_id"]):
            if not e["entity_id"].startswith("binary_sensor."):
                continue
            attrs = e.get("attributes", {})
            dc = attrs.get("device_class", "")
            name = attrs.get("friendly_name", "")
            if dc == "occupancy" or "occupancy" in name.lower():
                print(f"  {e['entity_id']} | {name}")

        # All sensors without standard device_class but with temperature unit
        print("\n=== Sensors with °F unit but no temperature device_class ===")
        for e in sorted(states, key=lambda x: x["entity_id"]):
            if not e["entity_id"].startswith("sensor."):
                continue
            attrs = e.get("attributes", {})
            dc = attrs.get("device_class", "")
            unit = attrs.get("unit_of_measurement", "")
            if dc == "temperature":
                continue
            if unit in ("°F", "°C", "F"):
                name = attrs.get("friendly_name", "")
                print(f"  {e['entity_id']} | {name} | unit={unit} | state={e.get('state')}")

        # unavailable sensors
        print("\n=== unavailable temperature sensors ===")
        for e in sorted(states, key=lambda x: x["entity_id"]):
            if e.get("state") != "unavailable":
                continue
            if not e["entity_id"].startswith("sensor."):
                continue
            attrs = e.get("attributes", {})
            dc = attrs.get("device_class", "")
            name = attrs.get("friendly_name", "")
            if dc == "temperature" or "temperature" in name.lower() or "temp" in e["entity_id"]:
                print(f"  {e['entity_id']} | {name} | dc={dc}")


if __name__ == "__main__":
    asyncio.run(main())
