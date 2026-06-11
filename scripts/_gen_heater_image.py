#!/usr/bin/env python3
"""Generate heater-image.ts with base64-embedded Optimal heater photo."""
import base64, io, os
from PIL import Image

root = os.path.join(os.path.dirname(__file__), "..")
src = os.path.join(root, "dist", "optimal-heater.png")
dst = os.path.join(root, "src", "heater-image.ts")

img = Image.open(src)
img = img.resize((200, int(200 * img.height / img.width)), Image.LANCZOS)
buf = io.BytesIO()
img.save(buf, format="PNG", optimize=True)
b64 = base64.b64encode(buf.getvalue()).decode()

with open(dst, "w") as f:
    f.write(f"export const DEFAULT_HEATER_IMAGE = 'data:image/png;base64,{b64}';\n")

print(f"Written {os.path.getsize(dst)} bytes to {dst}")
