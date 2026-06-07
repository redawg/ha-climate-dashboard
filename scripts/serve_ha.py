#!/usr/bin/env python3
""""Serve built card for temporary HA testing."""
from __future__ import annotations

import http.server
import os
import socketserver
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "dist"
PORT = int(os.environ.get("HA_SERVE_PORT", "8765"))
HOST = os.environ.get("HA_SERVE_HOST", "0.0.0.0")

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

def main() -> None:
    js = ROOT / "climate-command-center.js"
    if not js.exists():
        raise SystemExit(f"Missing {js} - run npm run build first")
    os.chdir(ROOT)
    with socketserver.TCPServer((HOST, PORT), CORSRequestHandler) as httd:
        print(f"Serving {ROOT} at http://{HOST}:{PORT}/climate-command-center.js")
        httd.serve_forever()

if __name__ == "__main__":
    main()