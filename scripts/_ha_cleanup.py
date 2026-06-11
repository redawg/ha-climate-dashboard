#!/usr/bin/env python3
"""Disable low-value unavailable entities on HA Forest (dry-run by default)."""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import re
import sys

try:
    import websockets
except ImportError:
    import subprocess

    subprocess.check_call([sys.executable, "-m", "pip", "install", "websockets", "-q"])
    import websockets

HA_URL = os.environ.get("HA_URL", "http://172.16.255.250:8123").rstrip("/")
TOKEN = os.environ.get(
    "HA_TOKEN",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs",
)
WS = HA_URL.replace("http://", "ws://").replace("https://", "wss://") + "/api/websocket"

DISABLE_RULES: list[tuple[str, re.Pattern[str], set[str]]] = [
    ("plex_unavailable", re.compile(r"^media_player\.plex", re.I), {"unavailable", "unknown"}),
    (
        "deye_charge_point",
        re.compile(r"deye|sunsynk|sol_ark|gen_charge_point|grid_charge_point", re.I),
        {"unknown", "unavailable"},
    ),
    (
        "unifi_led",
        re.compile(r"^(light|sensor)\..*(led|_poe)", re.I),
        {"unavailable", "unknown"},
    ),
    (
        "duplicate_weather_sensor",
        re.compile(r"desert hot springs|desert_hot_springs", re.I),
        {"unavailable", "unknown"},
    ),
]

CLIMATE_KEEP = re.compile(
    r"climate\.|floor_temperature|room_temperature|thermostat|sensorlinx|heated floor|redawghome",
    re.I,
)


def should_disable(entity_id: str, friendly_name: str, state: str) -> str | None:
    hay = f"{entity_id} {friendly_name}"
    if CLIMATE_KEEP.search(hay):
        return None
    for label, pattern, states in DISABLE_RULES:
        if state in states and pattern.search(hay):
            return label
    return None


async def main() -> int:
    parser = argparse.ArgumentParser(description="Disable noisy unavailable HA entities")
    parser.add_argument("--apply", action="store_true", help="Actually disable entities (default: dry-run)")
    args = parser.parse_args()

    async with websockets.connect(WS, max_size=32_000_000, open_timeout=90) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        auth = json.loads(await ws.recv())
        if auth.get("type") != "auth_ok":
            print("Auth failed:", auth, file=sys.stderr)
            return 1

        mid = 1

        async def call(msg_type: str, **payload):
            nonlocal mid
            await ws.send(json.dumps({"id": mid, "type": msg_type, **payload}))
            while True:
                data = json.loads(await ws.recv())
                if data.get("id") == mid:
                    mid += 1
                    return data

        states = (await call("get_states")).get("result", [])
        registry = (await call("config/entity_registry/list")).get("result", [])

        disabled_in_registry = {
            e["entity_id"] for e in registry if e.get("disabled_by")
        }

        candidates: list[tuple[str, str, str]] = []
        for s in states:
            eid = s["entity_id"]
            if eid in disabled_in_registry:
                continue
            fn = (s.get("attributes") or {}).get("friendly_name") or eid
            reason = should_disable(eid, fn, s.get("state", ""))
            if reason:
                candidates.append((eid, reason, fn))

        print(f"Found {len(candidates)} disable candidates ({'APPLY' if args.apply else 'dry-run'})")
        by_reason: dict[str, int] = {}
        for eid, reason, fn in candidates:
            by_reason[reason] = by_reason.get(reason, 0) + 1
            print(f"  [{reason}] {eid} — {fn}")

        print("\nBy reason:")
        for reason, count in sorted(by_reason.items(), key=lambda x: -x[1]):
            print(f"  {reason}: {count}")

        if not args.apply:
            print("\nRe-run with --apply to disable these entities.")
            return 0

        ok = 0
        for eid, reason, _fn in candidates:
            resp = await call(
                "config/entity_registry/update",
                entity_id=eid,
                disabled_by="user",
            )
            if resp.get("success"):
                ok += 1
            else:
                print(f"Failed to disable {eid}: {resp.get('error')}", file=sys.stderr)

        print(f"\nDisabled {ok}/{len(candidates)} entities.")
        return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
