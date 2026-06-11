from pathlib import Path

p = Path("scripts/_committed.js")
data = p.read_bytes()
text = data.decode("utf-8", errors="replace")
print("committed extract size", len(data))
for m in ["officejet", "printer", "ubiquiti"]:
    print(m, m in text)
