"""Search all HA entities for ecobee/remote patterns."""
import asyncio
import json
import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"


async def main():
    async with websockets.connect(WS, max_size=10 * 1024 * 1024) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        auth = json.loads(await ws.recv())
        if auth.get("type") != "auth_ok":
            print("Auth failed:", auth)
            return

        await ws.send(json.dumps({"id": 2, "type": "get_states"}))
        result = json.loads(await ws.recv())
        states = result.get("result", [])

        patterns = ["ecobee", "remote_sensor", "remote sensor", "redmond"]
        for p in patterns:
            print(f"\n=== ALL entities matching '{p}' ===")
            for e in sorted(states, key=lambda x: x["entity_id"]):
                eid = e["entity_id"]
                name = e.get("attributes", {}).get("friendly_name", "")
                hay = f"{eid} {name}".lower()
                if p.replace("_", " ") in hay or p in hay:
                    dc = e.get("attributes", {}).get("device_class", "")
                    print(f"  {eid} | {name} | dc={dc} | state={e.get('state')}")

        # Also show main_floor related
        print("\n=== main_floor entities ===")
        for e in sorted(states, key=lambda x: x["entity_id"]):
            if "main_floor" in e["entity_id"]:
                attrs = e.get("attributes", {})
                print(f"  {e['entity_id']} | {attrs.get('friendly_name','')} | dc={attrs.get('device_class','')}")


if __name__ == "__main__":
    asyncio.run(main())
