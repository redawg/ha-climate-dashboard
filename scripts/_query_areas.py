"""Query HA areas and entity assignments for climate zones."""
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
    async with websockets.connect(WS, max_size=10 * 1024 * 1024) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        await ws.recv()

        # Get areas
        await ws.send(json.dumps({"id": 10, "type": "config/area_registry/list"}))
        areas = (await recv_result(ws, 10)).get("result", [])
        area_map = {a["area_id"]: a["name"] for a in areas}
        print("=== AREAS ===")
        for a in areas:
            print(f"  {a['area_id']}: {a['name']}")

        climate_ids = [
            "climate.laundry_laundry", "climate.living_room_living_room",
            "climate.main_area_main_area", "climate.main_floor",
            "climate.main_office_main_office",
        ]
        print("\n=== CLIMATE ZONE AREAS ===")
        for eid in climate_ids:
            await ws.send(json.dumps({"id": 20, "type": "config/entity_registry/get", "entity_id": eid}))
            reg = (await recv_result(ws, 20)).get("result", {})
            area_id = reg.get("area_id")
            print(f"  {eid} -> area: {area_map.get(area_id, area_id)}")

        # Sample room sensors with areas
        sensor_ids = [
            "sensor.family_room_temperature", "sensor.living_room_temperature",
            "sensor.office_temperature", "sensor.main_floor_current_temperature",
            "sensor.pn37_temperature", "sensor.ba_temperature",
        ]
        print("\n=== ROOM SENSOR AREAS ===")
        for eid in sensor_ids:
            await ws.send(json.dumps({"id": 30, "type": "config/entity_registry/get", "entity_id": eid}))
            reg = (await recv_result(ws, 30)).get("result", {})
            area_id = reg.get("area_id")
            platform = reg.get("platform", "")
            print(f"  {eid} -> area: {area_map.get(area_id, area_id)}, platform: {platform}")

        # Search registry for ecobee platform entities (paginated via search)
        print("\n=== Ecobee platform entities (registry search) ===")
        await ws.send(json.dumps({
            "id": 40, "type": "config/entity_registry/list_for_display",
            "type_filter": ["sensor"],
        }))
        # might not work - try websocket search
        await ws.send(json.dumps({"id": 41, "type": "search/related", "item_type": "entity", "item": "climate.main_floor"}))
        related = (await recv_result(ws, 41)).get("result", {})
        for key, items in related.items():
            if items:
                print(f"  {key}: {len(items)} items")
                for item in items[:20]:
                    if isinstance(item, dict):
                        print(f"    {item.get('entity_id', item)}")


if __name__ == "__main__":
    asyncio.run(main())
