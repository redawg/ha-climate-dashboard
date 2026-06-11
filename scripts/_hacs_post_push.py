"""Push to GitHub, set repo topics, and force HACS re-download."""
import asyncio
import json
import subprocess
import time
import urllib.request

TOKEN_HA = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNDM2OWE2YTVmYjk0ODIzOTFmNDA3OTdiM2NiZmFiYyIsImlhdCI6MTc3ODU0NzMyNCwiZXhwIjoyMDkzOTA3MzI0fQ.Kh_2jOBqDJnevRqvrEGnZ1E849jrRK0_-SOdr6lr2Fs"
WS = "ws://172.16.255.250:8123/api/websocket"
JS_PATH = "/hacsfiles/ha-climate-dashboard/climate-command-center.js"
REPO = "redawg/ha-climate-dashboard"
TOPICS = [
    "home-assistant",
    "hacs",
    "lovelace",
    "lovelace-custom-card",
    "climate",
    "dashboard",
]


def git_token():
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
            return line.split("=", 1)[1]
    raise RuntimeError(f"No git token: {out} {err}")


def push_main(token):
    url = f"https://x-access-token:{token}@github.com/redawg/ha-climate-dashboard.git"
    result = subprocess.run(
        ["git", "push", url, "main"],
        capture_output=True,
        text=True,
        cwd=r"C:\Users\andre\Projects\lovelace-climate-command-center",
    )
    print("Push stdout:", result.stdout)
    print("Push stderr:", result.stderr)
    print("Exit code:", result.returncode)
    return result.returncode == 0


def set_github_topics(token):
    body = json.dumps({"names": TOPICS}).encode()
    req = urllib.request.Request(
        f"https://api.github.com/repos/{REPO}/topics",
        data=body,
        method="PUT",
        headers={
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.mercy-preview+json",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())
        print("Topics:", data.get("names", data))


async def ws_call(ws, msg_id, msg_type, **payload):
    await ws.send(json.dumps({"id": msg_id, "type": msg_type, **payload}))
    while True:
        data = json.loads(await ws.recv())
        if data.get("id") == msg_id:
            return data


async def hacs_refresh():
    import websockets

    async with websockets.connect(WS, max_size=16_000_000) as ws:
        await ws.recv()
        await ws.send(json.dumps({"type": "auth", "access_token": TOKEN_HA}))
        await ws.recv()

        msg_id = 1
        repos = await ws_call(ws, msg_id, "hacs/repositories/list")
        msg_id += 1
        repo_id = None
        for r in repos.get("result", []):
            full = r.get("full_name", "")
            name = r.get("name", "")
            if "ha-climate-dashboard" in full or name == "ha-climate-dashboard":
                repo_id = r.get("id")
                print(f"Found repo: {full} id={repo_id}")
                break
        if not repo_id:
            raise RuntimeError("ha-climate-dashboard not found in HACS")

        for call in ["hacs/repository/refresh", "hacs/repository/update"]:
            res = await ws_call(ws, msg_id, call, repository=repo_id)
            msg_id += 1
            print(f"{call}: success={res.get('success')}")

        dl = await ws_call(ws, msg_id, "hacs/repository/download", repository=repo_id)
        msg_id += 1
        print(f"download: success={dl.get('success')}")

        bust = int(time.time())
        resources = await ws_call(ws, msg_id, "lovelace/resources/list")
        msg_id += 1
        for r in resources.get("result", []):
            if "climate-command-center" in r.get("url", ""):
                upd = await ws_call(
                    ws,
                    msg_id,
                    "lovelace/resources/update",
                    resource_id=r["id"],
                    res_type=r.get("res_type", "module"),
                    url=f"{JS_PATH}?v={bust}",
                )
                msg_id += 1
                print(f"resource update: {upd.get('success')} v={bust}")

        url = f"http://172.16.255.250:8123{JS_PATH}?v={bust}"
        req = urllib.request.Request(url)
        req.add_header("Authorization", f"Bearer {TOKEN_HA}")
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read()
            print(f"HTTP {resp.status} len={len(body)}")


async def main():
    token = git_token()
    if not push_main(token):
        raise RuntimeError("git push failed")
    try:
        set_github_topics(token)
    except Exception as exc:
        print(f"Topics update warning: {exc}")
    await hacs_refresh()


if __name__ == "__main__":
    asyncio.run(main())
