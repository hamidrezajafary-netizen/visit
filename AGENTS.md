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
- **Geometry:** trim 85 × 55 mm, bleed 3 mm (canvas 91 × 61 mm), safe margin
  6 mm. Defined once in `src/lib/defaults.js` (`PRINT`) and mirrored in
  `src/styles/card.css`. Keep the two in sync.
- **Two export capture targets.** The print PDF captures the bleed element
  (`.card-bleed`, 91 × 61 mm) and the digital PNG captures the trim element
  (`.card-trim`, 85 × 55 mm) — the trim element therefore needs its own opaque
  background, or the PNG comes out with transparent edges.
- **The export rig is always mounted.** Export uses an off-screen copy at a
  fixed `--mm`, so exporting works from any preview mode. Capturing the visible
  node instead would fail whenever that side is not currently shown.
- Export uses `html-to-image` with `pixelRatio`, which raises the canvas
  resolution without touching computed styles — this avoids reflow/scale bugs.
  Fonts are bundled via `@fontsource`, which keeps them same-origin and
  therefore embeddable in the export.
- Sandbox-only settings in `vite.config.js` (allowed hosts, wss HMR on 443,
  polling watcher) are gated on `BASE44_PREVIEW_MODE === '1'` and are absent
  outside the preview.

## Content integrity

Contact details on the card are deliberately editable placeholders
(`[Your Email]`, …). Never fill in invented emails, phone numbers or web
addresses. The status line on the back of the card exists to separate what is
built (browser AI receptionist, storefront, order/booking flows) from what is
planned (production telephony, multi-tenant provisioning, in-store
translation) — keep that distinction whenever card copy is edited.
