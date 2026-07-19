## Why

The app loads Google Analytics (gtag.js, `G-YBC4E2Q97S`) from `index.html`. Google Analytics sets cookies, adds third-party tracking, and hurts privacy and page-load weight. Cloudflare Web Analytics is cookieless and privacy-friendly, and works on the current GitHub Pages deployment via a single beacon script.

## What Changes

- Remove the Google Analytics tag (`gtag.js` script + inline `dataLayer`/`gtag(...)` config) from `index.html`.
- Add the Cloudflare Web Analytics beacon script to `index.html`, configured with the site token.
- Document the analytics setup (provider, token source, privacy stance) for future maintenance.

## Capabilities

### New Capabilities
- `web-analytics`: Client-side page-view analytics for the deployed app — which provider is used, how it is loaded, and its privacy properties.

### Modified Capabilities
<!-- none -->

## Impact

- `index.html` — removes Google Analytics snippet, adds Cloudflare beacon.
- No runtime code (`src/`) changes; no dependency changes.
- External: stops sending data to Google Analytics; starts sending to Cloudflare Web Analytics. Requires a Cloudflare Web Analytics site token (obtained from the Cloudflare dashboard).
