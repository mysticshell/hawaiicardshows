# 📲 recaps/social — Instagram assets, ready to post

This is where every Instagram asset lives, organized so **you can find and post it in seconds**.

## The one rule: one folder = one Instagram post

```
recaps/social/<YYYY-MM-DD>-<slug>-<format>/
```

- **date** = the day it's meant to post (folders sort chronologically, newest at the bottom)
- **slug** = what it's about (`big-week`, `community-moments`, `giveaway`)
- **format** = `carousel` (multi-image feed) · `stories` · `feed` (single image) · `story` (single)

### Inside each folder
```
01-cover.png          ← the images, numbered in POST ORDER (just select 01,02,03… in IG)
02-bayview.png
03-keep-it-aloha.png
04-west-side.png
05-closer.png
caption.txt           ← the exact caption to copy/paste (+ any run notes below a divider)
src/                  ← HTML build files — IGNORE THIS when posting (it's how the PNGs are made)
```

## How you post (every time, same steps)
1. Open the folder for the post you want.
2. Upload the `.png` files **in number order** (01, 02, 03…). That's the order they'll appear.
3. Open `caption.txt`, copy the caption, paste it into Instagram.
4. Anything in `caption.txt` below a `═══ RUN NOTES ═══` divider is for you, **not** part of the caption.
5. If a graphic has `[[ PRIZE ]]` / `[[ DATE ]]` style brackets, it's a draft — those get filled first.

## How you ask me to make a new one
Just tell me the show/campaign and the format, e.g.:
> "Make a carousel + stories for the Paradise recap"

I'll create `recaps/social/<date>-paradise-carousel/` (and `-stories/`), build the slides in `src/`,
render the numbered PNGs, and drop a `caption.txt`. You just open the folder and post.

## Current drops
| Folder | Post type | What it is |
|---|---|---|
| `2026-06-09-big-week-carousel` | Feed carousel (5) | The big week: Bayview → KIA #2 → West Side/Max |
| `2026-06-09-big-week-stories` | Stories (5) | Same arc, vertical |
| `2026-06-09-community-moments` | Feed (1) | "Send us your moments" community call-out |
| `2026-06-09-giveaway-feed` | Feed (1) | 100-subscriber giveaway *(fill prize + date)* |
| `2026-06-09-giveaway-story` | Story (1) | Giveaway, vertical *(fill prize + date)* |
| `2026-06-06-max-holloway-promo-carousel` | Feed carousel (4) | Prior week's Max Holloway pre-show promo |
| `2026-06-06-max-holloway-promo-stories` | Stories (4) | Prior promo, vertical |

---
*Rendering (my job, not yours): `print/render-slides.sh <folder>/src <WxH> <folder>`. Canvas sizes —
feed/carousel `1080x1350`, stories `1080x1920`. Shop counter-cards (a different thing) still live in `print/`.*
