"""Query HA for UniFi/Ubiquiti network device temperature sensors."""
import asyncio
import json
import re
import websockets

HA_WS = "ws://172.16.255.250:8123/api/websocket"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"

UNIFI_PATTERNS = re.compile(
    r"unifi|ubiquiti|udm|usg|usw|uap|u6|u7|uxg|udr|unvr|usw_|usg_|uap_|udm_|switch|access point|gateway|dream machine|dream router|dream wall",
    re.IGNORECASE,
)
TEMP_UNITS = {"°C", "°F", "C", "F", "celsius", "fahrenheit"}


async def main():
    async with websockets.connect(HA_WS) as ws:
        hello = json.loads(await ws.recv())
        if hello.get("type") != "auth_required":
            raise SystemExit(f"Unexpected hello: {hello}")

        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        auth = json.loads(await ws.recv())
        if auth.get("type") != "auth_ok":
            raise SystemExit(f"Auth failed: {auth}")

        await ws.send(json.dumps({"id": 2, "type": "get_states"}))
        result = json.loads(await ws.recv())
        states = result.get("result", [])

        # First: all temp sensors matching unifi patterns
        matches = []
        all_temps = []
        for s in states:
            if s.get("state") in ("unavailable", "unknown"):
                continue
            entity_id = s["entity_id"]
            if not entity_id.startswith("sensor."):
                continue
            attrs = s.get("attributes", {})
            device_class = attrs.get("device_class", "")
            unit = attrs.get("unit_of_measurement", "")
            friendly = attrs.get("friendly_name", "")

            is_temp = device_class == "temperature" or unit in TEMP_UNITS or "°" in unit
            if not is_temp:
                continue

            all_temps.append((entity_id, friendly, device_class, unit))
            haystack = f"{entity_id} {friendly}"
            if UNIFI_PATTERNS.search(haystack):
                matches.append((entity_id, friendly, device_class, unit))

        print(f"Found {len(matches)} UniFi/Ubiquiti temperature sensors:\n")
        for eid, name, dc, unit in sorted(matches):
            print(f"  {eid}")
            print(f"    name: {name}")
            print(f"    device_class: {dc}, unit: {unit}")
            print()

        # Also search entity registry for unifi devices
        await ws.send(json.dumps({"id": 3, "type": "config/entity_registry/list"}))
        reg_result = json.loads(await ws.recv())
        entities = reg_result.get("result", [])

        unifi_entity_ids = set()
        for ent in entities:
            eid = ent.get("entity_id", "")
            platform = ent.get("platform", "")
            name = ent.get("name") or ent.get("original_name") or ""
            hay = f"{eid} {name} {platform}"
            if re.search(r"unifi|ubiquiti", hay, re.IGNORECASE):
                unifi_entity_ids.add(eid)

        print(f"\n=== Entity registry: {len(unifi_entity_ids)} unifi/ubiquiti entities ===")
        temp_from_registry = []
        for s in states:
            eid = s["entity_id"]
            if eid not in unifi_entity_ids:
                continue
            attrs = s.get("attributes", {})
            dc = attrs.get("device_class", "")
            unit = attrs.get("unit_of_measurement", "")
            friendly = attrs.get("friendly_name", "")
            is_temp = dc == "temperature" or unit in TEMP_UNITS or "°" in unit or "temp" in eid.lower()
            if is_temp:
                temp_from_registry.append((eid, friendly, dc, unit))

        print(f"Temperature sensors from UniFi registry entities: {len(temp_from_registry)}\n")
        for eid, name, dc, unit in sorted(temp_from_registry):
            print(f"  {eid}")
            print(f"    name: {name}")
            print(f"    device_class: {dc}, unit: {unit}")
            print()

        # Search device registry
        await ws.send(json.dumps({"id": 4, "type": "config/device_registry/list"}))
        dev_result = json.loads(await ws.recv())
        devices = dev_result.get("result", [])

        unifi_device_ids = set()
        for dev in devices:
            name = dev.get("name_by_user") or dev.get("name") or ""
            model = dev.get("model") or ""
            manufacturer = dev.get("manufacturer") or ""
            hay = f"{name} {model} {manufacturer}"
            if re.search(r"unifi|ubiquiti", hay, re.IGNORECASE):
                unifi_device_ids.add(dev.get("id"))

        print(f"\n=== Device registry: {len(unifi_device_ids)} unifi/ubiquiti devices ===")
        for dev in devices:
            if dev.get("id") not in unifi_device_ids:
                continue
            print(f"  {dev.get('name')} ({dev.get('model')}) - {dev.get('manufacturer')}")

        # Match entities to unifi devices
        unifi_device_entity_temps = []
        for ent in entities:
            if ent.get("device_id") not in unifi_device_ids:
                continue
            eid = ent.get("entity_id", "")
            if not eid.startswith("sensor."):
                continue
            for s in states:
                if s["entity_id"] != eid:
                    continue
                attrs = s.get("attributes", {})
                dc = attrs.get("device_class", "")
                unit = attrs.get("unit_of_measurement", "")
                friendly = attrs.get("friendly_name", "")
                is_temp = dc == "temperature" or unit in TEMP_UNITS or "°" in unit or "temp" in eid.lower()
                if is_temp:
                    unifi_device_entity_temps.append((eid, friendly, dc, unit))

        print(f"\n=== Temperature sensors on UniFi devices: {len(unifi_device_entity_temps)} ===\n")
        for eid, name, dc, unit in sorted(unifi_device_entity_temps):
            print(f"  {eid}")
            print(f"    name: {name}")
            print(f"    device_class: {dc}, unit: {unit}")
            print()


if __name__ == "__main__":
    asyncio.run(main())
