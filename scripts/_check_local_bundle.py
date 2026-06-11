from pathlib import Path

p = Path("dist/climate-command-center.js")
data = p.read_bytes()
text = data.decode("utf-8", errors="replace")
print("size", len(data))
for m in ["officejet", "printer", "toner", "deye", "ubiquiti"]:
    idx = text.find(m)
    print(f"{m}: {idx >= 0} at {idx}")
    if idx >= 0:
        print("  context:", repr(text[max(0, idx - 30): idx + len(m) + 30]))
