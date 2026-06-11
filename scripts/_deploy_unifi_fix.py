"""Push HACS update and cache-bust Lovelace resource."""
import asyncio
import json
import time
import urllib.request
import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"
JS_URL = "http://172.16.255.250:8123/hacsfiles/ha-climate-dashboard/climate-command-center.js"


async def ws_call(ws, msg_id, msg_type, **payload):
    await ws.send(json.dumps({"id": msg_id, "type": msg_type, **payload}))
    while True:
        data = json.loads(await ws.recv())
        if data.get("id") == msg_id:
            return data


async def main():
    async with websockets.connect(WS, max_size=16_000_000) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        auth = json.loads(await ws.recv())
        if auth.get("type") != "auth_ok":
            print("Auth failed:", auth)
            return

        msg_id = 1
        repos = await ws_call(ws, msg_id, "hacs/repositories/list")
        msg_id += 1
        repo_id = None
        for r in repos.get("result", []):
            name = (r.get("full_name") or r.get("name") or "").lower()
            if "ha-climate-dashboard" in name or "climate-dashboard" in name:
                repo_id = r.get("id")
                print(f"Found repo: {r.get('full_name')} id={repo_id}")
                break
        if not repo_id:
            print("Repo not found!")
            return

        dl = await ws_call(ws, msg_id, "hacs/repository/download", repository=repo_id)
        msg_id += 1
        print(f"download: success={dl.get('success')}")

        resources = await ws_call(ws, msg_id, "lovelace/resources/list")
        msg_id += 1
        cache_bust = f"?v={int(time.time())}"
        for r in resources.get("result", []):
            url = r.get("url", "")
            if "climate-command-center" in url:
                base = url.split("?")[0]
                new_url = base + cache_bust
                upd = await ws_call(
                    ws, msg_id, "lovelace/resources/update",
                    resource_id=r["id"], res_type=r.get("res_type", "module"), url=new_url,
                )
                msg_id += 1
                print(f"resource update: success={upd.get('success')} url={new_url}")
                break

    verify_url = JS_URL + cache_bust
    req = urllib.request.Request(verify_url)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=15) as resp:
        body = resp.read().decode("utf-8", errors="replace")
        print(f"HTTP GET {verify_url}: {resp.status}")
        print(f"  contains 'poe temperature': {'poe temperature' in body}")
        print(f"  contains 'ubiquiti': {'ubiquiti' in body}")


if __name__ == "__main__":
    asyncio.run(main())
