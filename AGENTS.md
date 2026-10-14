# AGENTS.md

## What this repository is

The repository originally contained only two pitch documents
(`Maison_AI_One_Page_Startup_Brief_Tampere_2026.pdf`,
`Maison_AI_Startup_Pitch_Tampere_2026_COMPLETE.pdf`) — no application code.
The Business Card Studio in `src/` was built on top of those documents.

It is a single-page, client-only React + Vite app. There is **no backend, no
database and no external service**: QR codes, PNG export and the print PDF are
all produced in the browser.

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

The first start runs `npm install` into the `node_modules` named volume, which
takes a minute or two. `docker compose ps` should show `web` as healthy once
Vite answers on port 3000.

- Host port 3000 is the preview entry point.
- Dependencies are installed at container start (not baked into an image), so
  editing `package.json` is picked up by simply restarting the service.
- `node_modules` lives in a named volume, never in the working tree.

## Non-obvious details

- **The card is dimensioned in millimetres.** A single `--mm` custom property
  drives every size through `calc(n * var(--mm))`. Changing `--mm` scales the
  whole card, which is how the on-screen preview and the 300 DPI export render
  from identical markup. Do not convert these values to px.
- **Geometry:** trim 89 × 51 mm (3.5 × 2 in), bleed 3 mm (canvas 95 × 57 mm),
  safe margin 5 mm. Defined once in `src/lib/defaults.js` (`PRINT`) and mirrored
  in `src/styles/card.css`. Keep the two in sync.
- **The preview scale clamps in `src/styles/app.css` are tied to the trim size.**
  They are tuned so the 89 mm trim always fits inside the stage at every
  breakpoint. If the trim size changes, retune those `--mm` clamps — a page-level
  "no horizontal scroll" check will NOT catch a too-large card, because `.stage`
  has `overflow: hidden` and silently clips it instead. Check
  `.stage` `scrollWidth - clientWidth`, or the card's rect against the stage rect.
- **The gilded strip must bleed.** `.card-bleed--back::before` extends the strip
  colour past the trim on all sides, because the strip sits on the trim edge and
  would otherwise leave a purple sliver after cutting. It is painted behind
  `.card-trim` (which is opaque over the trim area) and matches the strip's base
  colour exactly, so the two cannot seam. Keep the foil sheen
  (`.back-strip::before`) inside the trim for the same reason.
- **Padding lives on the faces, not on `.card-trim`.** Absolute children of
  `.card-trim` would otherwise be inset by that padding and could not reach the
  trim edge, which the strip needs. `.face--back` is unpadded so `.back-lattice`
  and `.back-strip` can bleed.
- **Two export capture targets.** The print PDF captures the bleed element
  (`.card-bleed`, 95 × 57 mm) and the digital PNG captures the trim element
  (`.card-trim`, 89 × 51 mm) — the trim element therefore needs its own opaque
  background, or the PNG comes out with transparent edges.
- **The print PDF is one page per side on a 103 × 65 mm sheet**: the 95 × 57 mm
  bleed placed at 4 mm (`TRIM_MARK_GUTTER`), with corner trim marks drawn in that
  slug so they can never land on the trimmed card. 300 DPI comes from the raster
  ratio, so the bleed stays exactly 3 mm per edge. Verified by driving the button
  in the preview: the export runs clean and the rig measures 95 × 57 mm bleed /
  89 × 51 mm trim at 300 DPI. The generated PDF itself cannot be opened in the
  sandbox browser, so its page internals are not machine-checked here.
- **The export rig is always mounted and lives outside the mockup.** Export uses
  an off-screen copy at a fixed `--mm`, so exporting works from any preview mode
  and is unaffected by the stage's 3D transforms and rounded-corner clipping.
  Capturing the visible node instead would fail whenever that side is not shown.
- **Print guides force square corners** (`.card-mock--square`): the mockup's
  rounded-corner clip otherwise shaves the trim/bleed outlines.
- Export uses `html-to-image` with `pixelRatio`, which raises the canvas
  resolution without touching computed styles — this avoids reflow/scale bugs.
  Fonts are bundled via `@fontsource`, which keeps them same-origin and therefore
  embeddable in the export.
- **The front wordmark has its own bundled serif** (`DISPLAY_FONT` — Cormorant
  Garamond, imported in `src/main.jsx`, applied as `--font-display`). It is
  deliberately independent of the Typography selector, which only drives the body
  font (`--font`); do not "fix" it to follow `--font`. Front order is emblem →
  wordmark → tagline → rule → supporting line, so the tagline sits directly
  beneath the wordmark.
- **Avoid `background-clip: text` for the gold foil lettering.** It is fragile
  under html-to-image cloning and fails invisibly (transparent text). Gold is a
  solid colour plus emboss text-shadows and a sheen overlay instead.
- Sandbox-only settings in `vite.config.js` (allowed hosts, wss HMR on 443,
  polling watcher) are gated on `BASE44_PREVIEW_MODE === '1'` and are absent
  outside the preview.

## Content integrity

- Contact details, the address and the social handle are deliberately editable
  placeholders (`[Your Email Address]`, …). Never fill in invented emails, phone
  numbers, web addresses or social accounts.
- The prototype status line is **off by default** so the card presents as a pure
  brand piece, but the control is kept: the platform's browser AI receptionist,
  storefront and order/booking flows are built and manually tested, while
  production telephony, multi-tenant provisioning and in-store translation are
  planned, not deployed. Do not add copy that presents the planned parts as live.
