#!/usr/bin/env python3
"""Extract the ThermalBoard floor plan from PDF, redact dimension labels
and other text directly in the PDF, then darken for HA dark theme."""
import base64
import io
import fitz
from PIL import Image, ImageEnhance, ImageOps

PDF_PATH = r"D:\Downloads\TB_Andrew Schoenfeld Project_v5_Packet (4).pdf"
OUT_TS = r"C:\Users\andre\Projects\lovelace-climate-command-center\src\floorplan-image.ts"
OUT_REF = r"C:\Users\andre\Projects\lovelace-climate-command-center\floorplan-cropped.png"
OUT_PRE = r"C:\Users\andre\Projects\lovelace-climate-command-center\floorplan-pre-invert.png"

doc = fitz.open(PDF_PATH)
page = doc[0]

# Find all text on the page and identify what to remove
text_blocks = page.get_text("dict")["blocks"]
remove_strings = [
    "FLOOR VENT", "MANIFOLD LOCATION", "MANIFOLD", "ZONING", "Scale:",
    "1/4", "1'-0", "1'-6", "4'-7", "5'-0", "7'-6", "7'-0",
    "26'", "13'", "sq ft", "Family", "Kitchen", "Main Hallway",
    "Pantry", "hallway", "TOTAL", "ZONE", "SQ FT",
    "NOTE:", "SHADED", "THERMALBOARD", "INFILLED", "SHEET GOODS",
    "TB_ANDREW", "REDMOND", "Sheet", "DMB",
]

redact_count = 0
for block in text_blocks:
    if "lines" not in block:
        continue
    for line in block["lines"]:
        for span in line["spans"]:
            text = span["text"].strip()
            if not text:
                continue
            should_remove = False
            for s in remove_strings:
                if s.lower() in text.lower():
                    should_remove = True
                    break
            # Also remove pure numbers that look like dimensions or sqft
            stripped = text.replace("'", "").replace('"', '').replace("-", "").replace(",", "")
            if stripped.replace(".", "").isdigit() and len(stripped) <= 5:
                should_remove = True

            if should_remove:
                rect = fitz.Rect(span["bbox"])
                # Expand slightly to cover the text fully
                rect.x0 -= 2
                rect.y0 -= 2
                rect.x1 += 2
                rect.y1 += 2
                page.add_redact_annot(rect, fill=None)
                redact_count += 1

print(f"Redacting {redact_count} text spans")

# Apply redactions - this removes the text and fills with the page background
page.apply_redactions()

# Render the cleaned page
rect = page.rect
# Extend bottom to keep vent markers; redaction handles the text
clip = fitz.Rect(rect.x0 + 105, rect.y0 + 70, rect.x1 - 225, rect.y1 - 280)
pix = page.get_pixmap(dpi=200, clip=clip)

img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
w, h = img.size

# Trim bottom: keep vent markers but cut the legend symbols below the house
img = img.crop((0, 0, w, int(h * 0.89)))

img.save(OUT_PRE)
print(f"Pre-inversion: {img.width}x{img.height}")

# Resize
img = img.resize((1100, int(1100 * img.height / img.width)), Image.LANCZOS)
print(f"Final size: {img.width}x{img.height}")

# Invert for dark theme
img = ImageOps.invert(img)
img = ImageEnhance.Brightness(img).enhance(0.5)
img = ImageEnhance.Color(img).enhance(1.3)
img = ImageEnhance.Contrast(img).enhance(1.15)

buf = io.BytesIO()
img.save(buf, format="PNG", optimize=True)
b64 = base64.b64encode(buf.getvalue()).decode()
print(f"Base64: {len(b64)//1024} KB")

with open(OUT_TS, "w") as f:
    f.write("export const FLOORPLAN_IMAGE = 'data:image/png;base64,")
    f.write(b64)
    f.write("';\n")
print(f"Wrote {OUT_TS}")

img.save(OUT_REF)
print(f"Saved {OUT_REF}")
