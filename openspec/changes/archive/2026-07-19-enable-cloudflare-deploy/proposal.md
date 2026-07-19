## Why

The app currently deploys only to GitHub Pages (`gh-pages -d dist`) under the subpath `/leave-planner/`. Adding Cloudflare Pages (custom domain `leaveplanner.vamonossoftware.com`) gives a root-domain URL and faster global CDN, and aligns hosting with the move to Cloudflare Web Analytics — while keeping GitHub Pages live so existing users' bookmarks keep working.

## What Changes

- Add a Cloudflare Pages deploy path using the Wrangler CLI (`wrangler pages deploy dist`), served at the custom domain `leaveplanner.vamonossoftware.com`.
- **Keep** the GitHub Pages deploy alongside Cloudflare.
- Because the two targets need different base paths (GH Pages = `/leave-planner/`, Cloudflare root domain = `/`), build twice with an explicit `--base` per target instead of a hard-coded `base` in `vite.config.ts`.
- Add `wrangler` as a dev dependency and a `wrangler.toml` with the Pages project name and output dir.
- Add per-target npm scripts (`build:gh`/`build:cf`, `deploy:gh`/`deploy:cf`) and keep a combined `deploy`.
- Document the dual deploy flow, custom-domain DNS, and Cloudflare auth requirements.

## Capabilities

### New Capabilities
- `deployment`: How the app is built and published — the two target hosts, per-target base path, and deploy commands.

### Modified Capabilities
<!-- none committed yet -->

## Impact

- `package.json` — keep `gh-pages`; add `wrangler` dep; add per-target build/deploy scripts.
- `vite.config.ts` — remove hard-coded `base` (default `/`); GH build overrides with `--base=/leave-planner/`.
- New `wrangler.toml` (Pages project config).
- External: requires a Cloudflare account, a Pages project, Wrangler auth (`CLOUDFLARE_API_TOKEN` or `wrangler login`), and a DNS record / custom-domain binding for `leaveplanner.vamonossoftware.com`.
- Related: pairs with the pending `remove-google-analytics` change (both move the app onto Cloudflare).
