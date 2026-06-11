"""Find all temperature sensors that look like network device temps."""
import asyncio
import json
import re
import websockets

HA_WS = "ws://172.16.255.250:8123/api/websocket"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"

NETWORK_TEMP_PATTERNS = re.compile(
    r"unifi|ubiquiti|udm|usg|usw|uap|u6|u7|uxg|udr|unvr|"
    r"switch.*temp|temp.*switch|access point|gateway.*temp|"
    r"dream machine|dream router|dream wall|poe.*temp|cpu temp|board temp",
    re.IGNORECASE,
)


async def main():
    async with websockets.connect(HA_WS, max_size=20 * 1024 * 1024) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        await ws.recv()

        await ws.send(json.dumps({"id": 2, "type": "get_states"}))
        states = json.loads(await ws.recv()).get("result", [])

        await ws.send(json.dumps({"id": 3, "type": "config/entity_registry/list"}))
        entities = json.loads(await ws.recv()).get("result", [])

        entity_platform = {e["entity_id"]: e.get("platform", "") for e in entities}

        print("=== All temperature sensors on unifi platform ===")
        for s in sorted(states, key=lambda x: x["entity_id"]):
            eid = s["entity_id"]
            if not eid.startswith("sensor."):
                continue
            platform = entity_platform.get(eid, "")
            if platform != "unifi":
                continue
            attrs = s.get("attributes", {})
            dc = attrs.get("device_class", "")
            unit = attrs.get("unit_of_measurement", "")
            friendly = attrs.get("friendly_name", "")
            is_temp = dc == "temperature" or "°" in unit or "temp" in eid.lower()
            if is_temp:
                print(f"  {eid} | {friendly} | dc={dc} unit={unit}")

        print("\n=== Network-like temperature sensors (pattern match) ===")
        for s in sorted(states, key=lambda x: x["entity_id"]):
            eid = s["entity_id"]
            if not eid.startswith("sensor."):
                continue
            attrs = s.get("attributes", {})
            dc = attrs.get("device_class", "")
            unit = attrs.get("unit_of_measurement", "")
            friendly = attrs.get("friendly_name", "")
            is_temp = dc == "temperature" or "°" in unit
            if not is_temp:
                continue
            hay = f"{eid} {friendly}"
            if NETWORK_TEMP_PATTERNS.search(hay):
                platform = entity_platform.get(eid, "")
                print(f"  {eid} | {friendly} | platform={platform}")


if __name__ == "__main__":
    asyncio.run(main())
