# Print assets

Source files for printable / laminated marketing pieces.

## shop-card

5×7" laminated counter card for distributing to Hawaii card shops.
QR code points to `hawaiicardshows.com/?utm_source=shop&utm_medium=qr`.

**Files:**
- `shop-card.html` — source HTML, self-contained (logo + QR embedded as base64)
- `shop-card.pdf` — print-ready PDF at 5×7" page size
- `shop-card-preview.png` — web preview for quick reference
- `qr-shop-generic.png` — raw QR PNG (in case it needs to be reused)

**Regenerate with a per-shop UTM:**
```bash
URL="https://hawaiicardshows.com/?utm_source=toylynx&utm_medium=qr"
curl -s "https://api.qrserver.com/v1/create-qr-code/?size=600x600&ecc=H&margin=10&data=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$URL'))")" -o /tmp/qr.png
# Then edit the html base64-embedded QR + run Chrome headless --print-to-pdf
```

The page uses Phudu (headings) + Archivo (body) via Google Fonts, the
ocean / lava / amber / teal palette from site.css, and the same
3-circle gradient watercolor wash as the homepage — but tuned smaller
to fit a 5×7 canvas.
