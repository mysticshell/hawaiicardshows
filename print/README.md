# Print assets

Source files for printable / laminated marketing pieces.

## shop-card

5×7" laminated counter card for distributing to Hawaii card shops.

### Generic (template)

- `shop-card.html` — source HTML, self-contained (logo + QR embedded as base64)
- `shop-card.pdf` — print-ready PDF at 5×7" page size
- `shop-card-preview.png` — web preview for quick reference
- `qr-shop-generic.png` — raw QR PNG → `hawaiicardshows.com/?utm_source=shop&utm_medium=qr`

### Per-shop variants — in `per-shop/`

Each shop gets a card with a unique UTM source so GA4 can attribute
exactly which shop drove each scan. Same visual design as the generic
template; only the QR differs.

| Shop | UTM source | File |
|---|---|---|
| ToyLynx | `toylynx` | `per-shop/shop-card-toylynx.pdf` |
| Best of the Best | `best-of-the-best` | `per-shop/shop-card-best-of-the-best.pdf` |
| TCG Tavern | `tcg-tavern` | `per-shop/shop-card-tcg-tavern.pdf` |
| From the Heart | `from-the-heart` | `per-shop/shop-card-from-the-heart.pdf` |
| 808 Showcase | `808-showcase` | `per-shop/shop-card-808-showcase.pdf` |
| Box Jellyz | `box-jellyz` | `per-shop/shop-card-box-jellyz.pdf` |

### Tracking in GA4

After cards are placed, view scan-by-shop in GA4:
1. Reports → Acquisition → Traffic acquisition
2. Filter Session source = `toylynx` (or any of the slugs above)
3. Compare with Sessions / Engagement / Conversions metrics

Or build an exploration with dimension = `Session source`
filtered to medium = `qr`.

### Regenerate (e.g. new shop or refreshed copy)

```bash
SLUG="newshop"
URL="https://hawaiicardshows.com/?utm_source=${SLUG}&utm_medium=qr"
curl -s "https://api.qrserver.com/v1/create-qr-code/?size=600x600&ecc=H&margin=10&data=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$URL")" -o /tmp/qr-${SLUG}.png
QR_B64=$(base64 -i /tmp/qr-${SLUG}.png | tr -d '\n')

python3 -c "
import re
html = open('print/shop-card.html').read()
html = re.sub(r'data:image/png;base64,[A-Za-z0-9+/=]+(?=\" alt=\"QR)', 'data:image/png;base64,${QR_B64}', html, count=1)
open('print/per-shop/shop-card-${SLUG}.html', 'w').write(html)
"

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --no-pdf-header-footer --print-to-pdf=print/per-shop/shop-card-${SLUG}.pdf \
  --virtual-time-budget=15000 "file://$(pwd)/print/per-shop/shop-card-${SLUG}.html"
```

### Design tokens

Brand-consistent with the website:
- Phudu (headings) + Archivo (body) via Google Fonts
- Ocean #1a6b5a / Lava #d4582a / Amber #ffc625 / Teal #2cdfb6 palette
- Same 3-circle gradient watercolor wash as the homepage,
  tuned smaller for the 5×7 canvas
