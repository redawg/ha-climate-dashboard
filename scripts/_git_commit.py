import subprocess

msg = (
    "Exclude UniFi network device temperatures from climate card.\n\n"
    "Switch/AP/gateway board temps are not room climate sensors and should not appear on the card."
)
subprocess.run(["git", "add", "src/utils/entity-resolver.ts", "dist/climate-command-center.js"], check=True)
result = subprocess.run(["git", "commit", "-m", msg], capture_output=True, text=True)
print(result.stdout)
print(result.stderr)
print("exit:", result.returncode)
