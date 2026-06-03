# IntuiNO — PWA Maintenance Rules

## Critical PWA Files — Do Not Break
- `manifest.json` — Web app manifest. Must remain valid JSON with all required fields.
- `service-worker.js` — Workbox-based service worker. Must stay at project root for `/` scope.
- `install-prompt.js` — Auto-triggers the native browser install dialog.
- `index.html` — Contains PWA meta tags, manifest link, and SW registration script.

## Rules
1. **Never remove** the `<link rel="manifest">`, `<meta name="theme-color">`, or `<link rel="apple-touch-icon">` tags from `index.html`.
2. **Never remove** the service worker registration `<script>` block at the end of `<body>` in `index.html`.
3. **Never move** `service-worker.js` out of the project root — it must be registered from `/` for full scope.
4. **When adding new static assets** (CSS, JS, images), add them to the precache list in `service-worker.js` and bump the `revision` string.
5. **When changing cached assets**, bump the `revision` values in the precache manifest so the service worker picks up updates.
6. **Icons**: The `/icons/` directory holds the shared icon-universe set — `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-192.png`, `icon-maskable-512.png` (generated from the brain-emblem master). `manifest.json` references the 192/512 + maskable PNGs; `index.html` links `favicon.ico`/16/32 + `apple-touch-icon.png`.
7. **Testing**: After any PWA change, run a Lighthouse PWA audit in Chrome DevTools to verify the score stays at 100.
