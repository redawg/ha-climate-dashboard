"""Push to GitHub using credential fill (avoids credential manager GUI hang)."""
import subprocess

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
            cwd=r"C:\Users\andre\Projects\lovelace-climate-command-center",
        )
        print("Push stdout:", result.stdout)
        print("Push stderr:", result.stderr)
        print("Exit code:", result.returncode)
        break
else:
    print("No token found in credential fill")
    print("stdout:", out)
    print("stderr:", err)
