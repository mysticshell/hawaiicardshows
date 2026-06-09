#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
#  render-slides.sh — render a folder of slide HTML → PNG via headless Chrome
# ─────────────────────────────────────────────────────────────────────
#  Hawaii Card Shows uses this for IG carousels, Stories, and single posts.
#  Each slide is a standalone .html file sized to the canvas; this script
#  screenshots each one at exact pixel dimensions, ready to upload.
#
#  USAGE:
#    print/render-slides.sh <src-dir> [WIDTHxHEIGHT] [out-dir]
#
#  - <src-dir>   folder of *.html slides to render
#  - [WxH]       canvas size (default 1080x1350 — IG portrait feed). Stories: 1080x1920
#  - [out-dir]   where the PNGs go (default: same as src-dir)
#
#  OUR CONVENTION (see recaps/social/README.md):
#    Postable assets live in   recaps/social/<date>-<slug>-<format>/
#    HTML sources live in       recaps/social/<date>-<slug>-<format>/src/
#    So render src/ → parent so the PNGs sit next to caption.txt, clean:
#
#      print/render-slides.sh recaps/social/2026-06-09-big-week-carousel/src \
#                             1080x1350 \
#                             recaps/social/2026-06-09-big-week-carousel
#
#  It renders EVERY *.html in <src-dir> to <out-dir>/<same-basename>.png.
#  Name the HTML files 01-cover.html, 02-bayview.html … so the PNGs sort
#  in POST ORDER (Finder + IG upload both respect filename order).
# ─────────────────────────────────────────────────────────────────────
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="${1:?Usage: render-slides.sh <src-dir> [WIDTHxHEIGHT] [out-dir]}"
SIZE="${2:-1080x1350}"
OUT="${3:-$SRC}"

WIDTH="${SIZE%x*}"
HEIGHT="${SIZE#*x}"

if [ ! -x "$CHROME" ]; then
  echo "ERROR: Chrome not found at $CHROME" >&2
  exit 1
fi
if [ ! -d "$SRC" ]; then
  echo "ERROR: source directory not found: $SRC" >&2
  exit 1
fi
mkdir -p "$OUT"

shopt -s nullglob
slides=("$SRC"/*.html)
if [ ${#slides[@]} -eq 0 ]; then
  echo "No .html slides found in $SRC" >&2
  exit 1
fi

echo "Rendering ${#slides[@]} slide(s) from $SRC → $OUT at ${WIDTH}x${HEIGHT}…"
for html in "${slides[@]}"; do
  base="$(basename "${html%.html}")"
  out="$OUT/$base.png"
  # --virtual-time-budget gives webfonts (Phudu/Archivo) + images time to load
  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 \
    --window-size="${WIDTH},${HEIGHT}" \
    --default-background-color=00000000 \
    --virtual-time-budget=15000 \
    --screenshot="$out" \
    "file://$(cd "$(dirname "$html")" && pwd)/$(basename "$html")" >/dev/null 2>&1
  echo "  ✓ $base.png"
done
echo "Done. PNGs are in $OUT/"
