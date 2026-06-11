"""Commit HP printer exclude fix, push, HACS refresh, and verify."""
import asyncio
import json
import subprocess
import sys
import time
import urllib.request

import websockets

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"
CWD = r"C:\Users\andre\Projects\lovelace-climate-command-center"
JS_PATH = "/hacsfiles/ha-climate-dashboard/climate-command-center.js"


async def ws_call(ws, msg_id, msg_type, **payload):
    await ws.send(json.dumps({"id": msg_id, "type": msg_type, **payload}))
    while True:
        data = json.loads(await ws.recv())
        if data.get("id") == msg_id:
            return data


def git_push():
    proc = subprocess.Popen(
        ["git", "credential", "fill"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    out, err = proc.communicate("protocol=https\nhost=github.com\n\n")
    for line in out.splitlines():
        if line.startswith("password="):
            token = line.split("=", 1)[1]
            url = f"https://x-access-token:{token}@github.com/redawg/ha-climate-dashboard.git"
            result = subprocess.run(
                ["git", "push", url, "main"],
                capture_output=True,
                text=True,
                cwd=CWD,
            )
            print("Push stdout:", result.stdout)
            print("Push stderr:", result.stderr)
            return result.returncode == 0
    print("No token from credential fill:", err)
    return False


async def hacs_and_resource():
    async with websockets.connect(WS, max_size=16_000_000) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN}))
        auth = json.loads(await ws.recv())
        if auth.get("type") != "auth_ok":
            print("Auth failed:", auth)
            return False

        msg_id = 1
        repos = await ws_call(ws, msg_id, "hacs/repositories/list")
        msg_id += 1
        repo_id = None
        for r in repos.get("result", []):
            full = (r.get("full_name") or "").lower()
            if "ha-climate-dashboard" in full:
                repo_id = r.get("id")
                print(f"Found repo: {r.get('full_name')} id={repo_id}")
                break
        if not repo_id:
            print("ha-climate-dashboard repo not found in HACS")
            return False

        dl = await ws_call(ws, msg_id, "hacs/repository/download", repository=repo_id)
        msg_id += 1
        print(f"download: success={dl.get('success')}")

        resources = await ws_call(ws, msg_id, "lovelace/resources/list")
        msg_id += 1
        bust = int(time.time())
        new_url = f"{JS_PATH}?v={bust}"
        for r in resources.get("result", []):
            if "climate-command-center" in r.get("url", ""):
                rid = r.get("id")
                upd = await ws_call(
                    ws,
                    msg_id,
                    "lovelace/resources/update",
                    resource_id=rid,
                    res_type=r.get("res_type", "module"),
                    url=new_url,
                )
                msg_id += 1
                print(f"resource update: success={upd.get('success')} url={new_url}")
                break

        return True


def verify_http():
    url = f"http://172.16.255.250:8123{JS_PATH}"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=15) as resp:
        body = resp.read().decode("utf-8", errors="replace")
        print(f"HTTP {resp.status}")
        markers = ["officejet", "laserjet", "deskjet", "cartridge", "toner"]
        for m in markers:
            print(f"  contains '{m}': {m in body}")
        return resp.status == 200


def main():
    msg = (
        "Exclude HP printer sensors from climate card.\n\n"
        "Ink/toner level percentages and printer status entities are not room climate sensors."
    )
    subprocess.run(
        ["git", "add", "src/utils/entity-resolver.ts", "dist/climate-command-center.js"],
        check=True,
        cwd=CWD,
    )
    commit = subprocess.run(["git", "commit", "-m", msg], capture_output=True, text=True, cwd=CWD)
    print(commit.stdout)
    print(commit.stderr)
    if commit.returncode != 0:
        print("Commit failed or nothing to commit")
        if "nothing to commit" in commit.stdout + commit.stderr:
            pass
        else:
            sys.exit(1)

    if not git_push():
        sys.exit(1)

    ok = asyncio.run(hacs_and_resource())
    if not ok:
        sys.exit(1)
    verify_http()


if __name__ == "__main__":
    main()
