"""Simulate entity-resolver discovery logic against live HA states."""
import asyncio
import json
import re
import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"

EXCLUDE_PATTERNS = [
    "deye", "sunsynk", "sol-ark", "battery", "oven", "cavity", "inverter",
    "outdoor", "outside", "exterior", "sensorlinx",
    "weather", "tempest", "wet bulb", "dew point", "feels like",
]
WEATHER_PATTERNS = EXCLUDE_PATTERNS  # simplified


def normalize(value):
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def is_excluded(name, entity_id):
    haystack = f"{normalize(name)} {normalize(entity_id)}"
    return any(p in haystack for p in [normalize(x) for x in EXCLUDE_PATTERNS])


def climate_zone_slug(climate_entity_id):
    slug = climate_entity_id.replace("climate.", "")
    parts = slug.split("_")
    if len(parts) >= 2 and len(parts) % 2 == 0:
        half = len(parts) // 2
        first = "_".join(parts[:half])
        second = "_".join(parts[half:])
        if first == second:
            return first
    return slug


def floor_heat_sensor_ids(states):
    ids = set()
    for e in states:
        if not e["entity_id"].startswith("climate."):
            continue
        zone_slug = climate_zone_slug(e["entity_id"])
        ids.add(f"sensor.{zone_slug}_floor_temperature")
        ids.add(f"sensor.{zone_slug}_room_temperature")
    return ids


def is_climate_linked_sensor(entity_id, name, floor_heat_ids):
    if entity_id in floor_heat_ids:
        return True
    n = normalize(name)
    return "current temperature" in n and "thermostat" in n


async def main():
    async with websockets.connect(WS, max_size=10 * 1024 * 1024) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        await ws.recv()
        await ws.send(json.dumps({"id": 2, "type": "get_states"}))
        states = json.loads(await ws.recv()).get("result", [])

        zones = []
        for e in states:
            if e["entity_id"].startswith("climate."):
                zones.append({
                    "name": e["attributes"].get("friendly_name", e["entity_id"]),
                    "climate_entity": e["entity_id"],
                })

        print("=== ZONES ===")
        for z in zones:
            print(f"  {z['climate_entity']}: {z['name']}")

        floor_heat_ids = floor_heat_sensor_ids(states)
        linked = set()
        for z in zones:
            for e in states:
                eid = e["entity_id"]
                if not eid.startswith("sensor."):
                    continue
                dc = e.get("attributes", {}).get("device_class")
                if dc not in ("temperature", "humidity"):
                    continue
                name = e["attributes"].get("friendly_name", eid)
                zn = normalize(z["name"])
                nn = normalize(name)
                ni = normalize(eid)
                if zn in nn or zn.replace(" ", "_") in ni:
                    linked.add(eid)

        print("\n=== ASSIGNABLE SENSORS ===")
        unassigned = []
        for e in sorted(states, key=lambda x: x["entity_id"]):
            eid = e["entity_id"]
            if not eid.startswith("sensor."):
                continue
            dc = e.get("attributes", {}).get("device_class")
            if dc not in ("temperature", "humidity"):
                continue
            name = e["attributes"].get("friendly_name", eid)
            if linked.has(eid) if hasattr(linked, 'has') else eid in linked:
                continue
            if is_excluded(name, eid):
                reason = "EXCLUDED"
            elif is_climate_linked_sensor(eid, name, floor_heat_ids):
                reason = "CLIMATE_LINKED"
            else:
                reason = "ASSIGNABLE"
                unassigned.append((eid, name, e.get("state")))
            if reason != "ASSIGNABLE":
                print(f"  SKIP ({reason}): {eid} | {name}")

        print("\n=== WOULD BE ASSIGNED ===")
        for eid, name, state in unassigned:
            sensor_name = re.sub(r"\s+(temperature|humidity|temp)$", "", name, flags=re.I)
            matched = None
            for z in zones:
                zn = normalize(z["name"])
                sn = normalize(sensor_name)
                if sn in zn or zn in sn:
                    matched = z["name"]
                    break
            print(f"  {eid} | {sensor_name} | state={state} -> zone: {matched or 'UNASSIGNED'}")


if __name__ == "__main__":
    asyncio.run(main())
