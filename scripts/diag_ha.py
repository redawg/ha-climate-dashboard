#!/usr/bin/env python3
import asyncio
import json
import os
import sys
import urllib.error
import urllib.request

try:
    import websockets
except ImportError:
    import subprocess

    subprocess.check_call([sys.executable, "-m", "pip", "install", "websockets", "-q"])
    import websockets

HA_URL = os.environ.get("HA_URL", "http://172.16.255.250:8123").rstrip("/")
TOKEN = os.environ.get("HA_TOKEN", "")
WS = HA_URL.replace("http://", "ws://").replace("https://", "wss://") + "/api/websocket"
OUT = Path = __import__("pathlib").Path(__file__).resolve().parent.parent / "diag_out.txt"


def check_url(url: str) -> str:
    full = url if url.startswith("http") else HA_URL + url
    try:
        with urllib.request.urlopen(full, timeout=8) as resp:
            return f"OK {resp.status} len={resp.headers.get('Content-Length','?')}"
    except Exception as exc:
        return f"FAIL {exc}"


async def main() -> int:
    lines: list[str] = []
    if not TOKEN:
        lines.append("HA_TOKEN missing")
        OUT.write_text("\n".join(lines), encoding="utf-8")
        return 1

    urls = [
        "/local/climate-command-center/climate-command-center.js",
        "/hacsfiles/climate-command-center/climate-command-center.js",
        "http://172.16.1.32:8765/climate-command-center.js",
    ]
    for u in urls:
        lines.append(f"URL {u}: {check_url(u)}")

    async with websockets.connect(WS, max_size=8_000_000) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        auth = json.loads(await ws.recv())
        lines.append(f"auth: {auth.get('type')}")

        mid = 1

        async def call(msg_type: str, **payload):
            nonlocal mid
            await ws.send(json.dumps({"id": mid, "type": msg_type, **payload}))
            while True:
                data = json.loads(await ws.recv())
                if data.get("id") == mid:
                    mid += 1
                    return data

        dashboards = await call("lovelace/dashboards/list")
        lines.append("dashboards: " + json.dumps(dashboards.get("result"), indent=2)[:2000])

        resources = await call("lovelace/resources/list")
        lines.append("resources: " + json.dumps(resources.get("result"), indent=2)[:2000])

        for path in ("climate-dashboard", "climate", "climate-command-center"):
            try:
                cfg = await call("lovelace/config", url_path=path)
                lines.append(f"config/{path}: " + json.dumps(cfg, indent=2)[:3000])
            except Exception as exc:
                lines.append(f"config/{path}: error {exc}")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(OUT.read_text(encoding="utf-8"))
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
