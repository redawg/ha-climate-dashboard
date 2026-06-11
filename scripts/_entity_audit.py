#!/usr/bin/env python3
"""Audit HA Forest entity load and API timing baseline."""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
import time
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

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
OUT = Path(__file__).resolve().parent / "entity_audit_baseline.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Audit HA Forest entity load")
    parser.add_argument(
        "--output",
        default=str(OUT),
        help="Write JSON report to this path (default: entity_audit_baseline.json)",
    )
    return parser.parse_args()


def integration_prefix(entity_id: str) -> str:
    """Rough integration bucket from entity_id."""
    eid = entity_id.lower()
    if eid.startswith("media_player.plex"):
        return "plex"
    if "unifi" in eid or "ubiquiti" in eid or "_poe" in eid or eid.endswith("_led"):
        return "unifi"
    if "deye" in eid or "sunsynk" in eid or "sol_ark" in eid:
        return "deye_solar"
    if "weatherflow" in eid or "tempest" in eid or eid.startswith("weather."):
        return "weather"
    if "sensorlinx" in eid or "outdoor_reset" in eid:
        return "sensorlinx"
    if eid.startswith("climate."):
        return "climate"
    domain = entity_id.split(".", 1)[0]
    return domain


def audit_states(states: list[dict]) -> dict:
    by_domain: Counter[str] = Counter()
    by_integration: Counter[str] = Counter()
    bad_state: Counter[str] = Counter()
    plex_unavailable = 0
    names: dict[str, list[str]] = defaultdict(list)

    for s in states:
        eid = s["entity_id"]
        domain = eid.split(".", 1)[0]
        by_domain[domain] += 1
        by_integration[integration_prefix(eid)] += 1
        st = s.get("state", "")
        if st in ("unavailable", "unknown"):
            bad_state[st] += 1
        if eid.startswith("media_player.plex") and st == "unavailable":
            plex_unavailable += 1
        fn = (s.get("attributes") or {}).get("friendly_name") or eid
        key = fn.strip().lower()
        if len(names[key]) < 5:
            names[key].append(eid)

    dup_clusters = {k: v for k, v in names.items() if len(v) > 1}

    return {
        "total": len(states),
        "by_domain": dict(by_domain.most_common(20)),
        "by_integration": dict(by_integration.most_common(15)),
        "unavailable": bad_state.get("unavailable", 0),
        "unknown": bad_state.get("unknown", 0),
        "plex_unavailable": plex_unavailable,
        "duplicate_name_clusters": len(dup_clusters),
        "top_duplicate_names": [
            {"name": k, "entities": v[:8]}
            for k, v in sorted(dup_clusters.items(), key=lambda x: -len(x[1]))[:10]
        ],
    }


async def main() -> int:
    args = parse_args()
    out_path = Path(args.output)
    headers = {"Authorization": f"Bearer {TOKEN}"}

    print("=== HA Forest Entity Audit ===\n")

    t0 = time.time()
    try:
        req = urllib.request.Request(f"{HA_URL}/api/states", headers=headers)
        with urllib.request.urlopen(req, timeout=60) as resp:
            rest_states = json.loads(resp.read())
        rest_ms = (time.time() - t0) * 1000
        print(f"REST GET /api/states: {len(rest_states)} entities in {rest_ms:.0f} ms")
    except urllib.error.URLError as exc:
        print(f"REST /api/states failed: {exc}", file=sys.stderr)
        return 1

    summary = audit_states(rest_states)
    print(f"\nTotal entities: {summary['total']}")
    print(f"Unavailable: {summary['unavailable']}  Unknown: {summary['unknown']}")
    print(f"Plex unavailable media players: {summary['plex_unavailable']}")
    print("\nBy domain (top 15):")
    for domain, count in list(summary["by_domain"].items())[:15]:
        print(f"  {domain}: {count}")
    print("\nBy integration bucket (top 12):")
    for bucket, count in list(summary["by_integration"].items())[:12]:
        print(f"  {bucket}: {count}")

    ws_ms = None
    try:
        t1 = time.time()
        async with websockets.connect(WS, max_size=32_000_000, open_timeout=90) as ws:
            await ws.recv()
            await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
            auth = json.loads(await ws.recv())
            print(f"\nWebSocket auth: {auth.get('type')} (HA {auth.get('ha_version', '?')})")
            await ws.send(json.dumps({"id": 1, "type": "get_states"}))
            while True:
                msg = json.loads(await ws.recv())
                if msg.get("id") == 1:
                    ws_ms = (time.time() - t1) * 1000
                    ws_count = len(msg.get("result", []))
                    print(f"WS get_states: {ws_count} entities in {ws_ms:.0f} ms")
                    break
    except Exception as exc:
        print(f"\nWebSocket get_states failed: {exc}")

    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "ha_url": HA_URL,
        "rest_get_states_ms": round(rest_ms, 1),
        "ws_get_states_ms": round(ws_ms, 1) if ws_ms else None,
        **summary,
    }
    out_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"\nReport written to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
