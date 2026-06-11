import os
for f in ["dist/climate-command-center.js", "src/climate-command-center.ts", "src/styles.ts", "src/floorplan-image.ts", ".gitignore"]:
    sz = os.path.getsize(f)
    print(f"  {sz/1024:7.0f} KB  {f}")
