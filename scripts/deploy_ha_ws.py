#!/usr/bin/env python3
"""Deploy Climate Command Center via Home Assistant WebSocket API."""
from __future__ import annotations

import asyncio
import json
import os
import sys
from pathlib import Path

try:
    import websockets
except ImportError:
    import subprocess

    subprocess.check_call([sys.executable, "-m", "pip", "install", "websockets", "-q"])
    import websockets

HA_URL = os.environ.get("HA_URL", "http://172.16.255.250:8123").rstrip("/")
WS_URL = HA_URL.replace("https://", "wss://").replace("http://", "ws://") + "/api/websocket"
HA_TOKEN = os.environ.get("HA_TOKEN", "")

DASHBOARD_URL_PATH = os.environ.get("HA_DASHBOARD_PATH", "climate-dashboard")
DASHBOARD_VIEW = "climate"
RESOURCE_URL = os.environ.get(
    "HA_CARD_URL",
    "/hacsfiles/climate-command-center/climate-command-center.js",
)

CARD_CONFIG = {
    "type": "custom:climate-command-center",
    "title": "Climate Command Center",
    "auto_discover": True,
    "show_weather": True,
    "show_room_sensors": True,
    "group_by_floor": True,
}


async def ws_call(ws, msg_id: int, msg_type: str, **payload):
    await ws.send(json.dumps({"id": msg_id, "type": msg_type, **payload}))
    while True:
        raw = await ws.recv()
        data = json.loads(raw)
        if data.get("id") == msg_id:
            if not data.get("success", True):
                raise RuntimeError(data)
            return data.get("result")


async def main() -> int:
    if not HA_TOKEN:
        print("Set HA_TOKEN", file=sys.stderr)
        return 1

    msg_id = 1
    async with websockets.connect(WS_URL, max_size=8_000_000) as ws:
        hello = json.loads(await ws.recv())
        assert hello.get("type") == "auth_required", hello
        await ws.send(json.dumps({"type": "auth", "access_token": HA_TOKEN}))
        auth = json.loads(await ws.recv())
        if auth.get("type") != "auth_ok":
            print("Auth failed:", auth, file=sys.stderr)
            return 1
        print("WebSocket authenticated")

        dashboards = await ws_call(ws, msg_id, "lovelace/dashboards/list")
        msg_id += 1
        dash = next((d for d in dashboards if d.get("url_path") == DASHBOARD_URL_PATH), None)
        if not dash:
            dash = await ws_call(
                ws,
                msg_id,
                "lovelace/dashboards/create",
                title="Climate",
                icon="mdi:thermometer",
                url_path=DASHBOARD_URL_PATH,
                require_admin=False,
                show_in_sidebar=True,
            )
            msg_id += 1
            print("Created dashboard", dash.get("url_path"))
        else:
            print("Dashboard exists", dash.get("url_path"))

        resources = await ws_call(ws, msg_id, "lovelace/resources/list")
        msg_id += 1
        resource = next((r for r in resources if RESOURCE_URL in (r.get("url") or "")), None)
        if not resource:
            resource = await ws_call(
                ws,
                msg_id,
                "lovelace/resources/create",
                res_type="module",
                url=RESOURCE_URL,
            )
            msg_id += 1
            print("Registered resource", RESOURCE_URL)
        else:
            print("Resource exists", resource.get("url"))

        config = {
            "views": [
                {
                    "title": "Climate",
                    "path": DASHBOARD_VIEW,
                    "icon": "mdi:thermometer",
                    "cards": [CARD_CONFIG],
                }
            ]
        }
        await ws_call(
            ws,
            msg_id,
            "lovelace/config/save",
            url_path=DASHBOARD_URL_PATH,
            config=config,
        )
        msg_id += 1
        print("Saved dashboard config")

    print("DEPLOY_OK")
    print(f"Open: {HA_URL}/{DASHBOARD_URL_PATH}/{DASHBOARD_VIEW}")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
