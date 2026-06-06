#!/usr/bin/env python3
"""Deploy Climate Command Center card + dashboard to Forest Home Assistant."""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

HA_URL = os.environ.get("HA_URL", "http://172.16.255.250:8123").rstrip("/")
HA_TOKEN = os.environ.get("HA_TOKEN", "")
HA_SSH_HOST = os.environ.get("HA_SSH_HOST", "172.16.255.250")
HA_SSH_USER = os.environ.get("HA_SSH_USER", "root")
HA_SSH_PASSWORD = os.environ.get("HA_SSH_PASSWORD", "")

PROJECT = Path(__file__).resolve().parent.parent
CARD_SRC = PROJECT / "dist" / "climate-command-center.js"
REMOTE_WWW = "/config/www/climate-command-center"
REMOTE_JS = f"{REMOTE_WWW}/climate-command-center.js"
RESOURCE_URL = "/local/climate-command-center/climate-command-center.js"
DASHBOARD_URL_PATH = "climate-command-center"
DASHBOARD_TITLE = "Climate"


def api(method: str, path: str, data: dict | None = None):
    body = None
    headers = {
        "Authorization": f"Bearer {HA_TOKEN}",
        "Content-Type": "application/json",
    }
    if data is not None:
        body = json.dumps(data).encode()
    req = urllib.request.Request(f"{HA_URL}{path}", data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode()
            return resp.status, json.loads(raw) if raw else None
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            parsed = raw
        return e.code, parsed


def deploy_card_ssh() -> bool:
    if not CARD_SRC.exists():
        print(f"Missing built card: {CARD_SRC}", file=sys.stderr)
        return False
    try:
        import paramiko
    except ImportError:
        import subprocess

        subprocess.check_call([sys.executable, "-m", "pip", "install", "paramiko", "-q"])
        import paramiko

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    for user in (HA_SSH_USER, "root", "homeassistant"):
        try:
            kwargs = {
                "hostname": HA_SSH_HOST,
                "username": user,
                "timeout": 15,
                "look_for_keys": True,
                "allow_agent": True,
            }
            if HA_SSH_PASSWORD:
                kwargs["password"] = HA_SSH_PASSWORD
                kwargs["look_for_keys"] = False
                kwargs["allow_agent"] = False
            client.connect(**kwargs)
            print(f"SSH connected as {user}")
            break
        except Exception as exc:
            print(f"SSH {user} failed: {exc}")
    else:
        return False

    stdin, stdout, stderr = client.exec_command(f"mkdir -p {REMOTE_WWW}")
    stdout.channel.recv_exit_status()
    sftp = client.open_sftp()
    print(f"Uploading {CARD_SRC} -> {REMOTE_JS}")
    sftp.put(str(CARD_SRC), REMOTE_JS)
    sftp.close()
    client.close()
    return True


def ensure_resource() -> bool:
    code, resources = api("GET", "/api/lovelace/resources")
    print("GET resources", code)
    if code != 200:
        return False
    if not isinstance(resources, list):
        print("Unexpected resources payload", type(resources))
        return False

    for item in resources:
        if item.get("url") == RESOURCE_URL:
            print("Resource already registered:", item.get("id"))
            return True

    code, created = api(
        "POST",
        "/api/lovelace/resources",
        {"url": RESOURCE_URL, "type": "module"},
    )
    print("POST resource", code, created)
    return code in (200, 201)


def ensure_dashboard() -> str | None:
    code, dashboards = api("GET", "/api/lovelace/dashboards")
    print("GET dashboards", code)
    if code != 200 or not isinstance(dashboards, list):
        return None

    for dash in dashboards:
        if dash.get("url_path") == DASHBOARD_URL_PATH:
            print("Dashboard exists:", dash.get("id"))
            return dash.get("id")

    code, created = api(
        "POST",
        "/api/lovelace/dashboards",
        {
            "title": DASHBOARD_TITLE,
            "icon": "mdi:thermometer",
            "url_path": DASHBOARD_URL_PATH,
            "require_admin": False,
            "show_in_sidebar": True,
        },
    )
    print("POST dashboard", code, created)
    if code not in (200, 201) or not isinstance(created, dict):
        return None
    return created.get("id")


def set_dashboard_config() -> bool:
    config = {
        "views": [
            {
                "title": DASHBOARD_TITLE,
                "path": "default_view",
                "icon": "mdi:thermometer",
                "cards": [
                    {
                        "type": "custom:climate-command-center",
                        "title": "Climate Command Center",
                        "auto_discover": True,
                        "show_weather": True,
                        "show_room_sensors": True,
                        "group_by_floor": True,
                    }
                ],
            }
        ]
    }
    code, result = api("POST", f"/api/lovelace/config/{DASHBOARD_URL_PATH}", config)
    print("POST dashboard config", code)
    if code not in (200, 201):
        print(result)
        return False
    return True


def main() -> int:
    if not HA_TOKEN:
        print("Set HA_TOKEN", file=sys.stderr)
        return 1

    code, ha_info = api("GET", "/api/")
    print("HA API", code, ha_info.get("message") if isinstance(ha_info, dict) else ha_info)
    if code != 200:
        return 1

    if not deploy_card_ssh():
        print("Card deploy via SSH failed", file=sys.stderr)
        return 1

    if not ensure_resource():
        print("Resource registration failed", file=sys.stderr)
        return 1

    dash_id = ensure_dashboard()
    if not dash_id:
        print("Dashboard creation failed", file=sys.stderr)
        return 1

    if not set_dashboard_config():
        print("Dashboard config failed", file=sys.stderr)
        return 1

    print("DEPLOY_OK")
    print(f"Open: {HA_URL}/{DASHBOARD_URL_PATH}/default_view")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
