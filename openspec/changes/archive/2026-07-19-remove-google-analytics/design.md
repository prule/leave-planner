## Context

`index.html` loads Google Analytics via `gtag.js` (measurement ID `G-YBC4E2Q97S`) plus an inline `dataLayer`/`gtag('config', ...)` block. The app is a static Vue SPA built with Vite and deployed to GitHub Pages (`npm run deploy` → `gh-pages -d dist`). Analytics is client-side only; there is no server component.

Cloudflare Web Analytics is a cookieless, privacy-first analytics product that works on any site (not just Cloudflare-hosted ones) by injecting a single beacon script tag carrying a site token.

## Goals / Non-Goals

**Goals:**
- Remove all Google Analytics code from the app.
- Add Cloudflare Web Analytics via its beacon script.
- Keep the change contained to `index.html` (no build/runtime code changes).

**Non-Goals:**
- Migrating hosting to Cloudflare Pages (staying on GitHub Pages).
- Custom event tracking or a consent banner (page views only; Cloudflare Web Analytics is cookieless so no consent prompt is required for it).
- Preserving historical Google Analytics data.

## Decisions

- **Provider: Cloudflare Web Analytics (beacon) over Cloudflare Pages Web Analytics binding.** The site is on GitHub Pages, so the beacon-script variant is the only option. It requires a site token created in the Cloudflare dashboard (Analytics & Logs → Web Analytics → Add a site).
- **Placement: single `<script defer>` beacon tag before `</body>`.** Standard Cloudflare snippet:
  ```html
  <script defer src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "<CF_TOKEN>"}'></script>
  ```
  `defer` keeps it off the critical path.
- **Token handling: hard-coded in `index.html`.** The beacon token is public by design (visible to any site visitor), so no secret management is needed. Placeholder `<CF_TOKEN>` in the repo until the real token is issued.
- **Remove, not comment out, the GA snippet** to avoid dead third-party code.

## Risks / Trade-offs

- [Token not yet issued] → Add the beacon with a placeholder token; the real token must be pasted in before deploy. Track as an open question / task.
- [SPA route changes not counted as page views] → Cloudflare Web Analytics uses SPA-aware navigation tracking automatically; acceptable for this app's needs.
- [Loss of GA historical data] → Accepted per Non-Goals; export from GA manually if ever needed (out of scope).

## Migration Plan

1. Create a site in Cloudflare Web Analytics dashboard, obtain the beacon token.
2. Edit `index.html`: remove GA snippet, add Cloudflare beacon with the token.
3. Build and deploy (`npm run deploy`).
4. Verify in Cloudflare dashboard that page views appear.

Rollback: revert the `index.html` change to restore the GA snippet.

## Open Questions

- What is the real Cloudflare Web Analytics site token? (Needs dashboard access; placeholder used until provided.)
