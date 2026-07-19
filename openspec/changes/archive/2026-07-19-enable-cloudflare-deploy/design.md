## Context

The app is a static Vue + Vite SPA with a PWA service worker (`vite-plugin-pwa`). It builds to `dist/` and deploys to GitHub Pages via `gh-pages -d dist`. `vite.config.ts` sets `base: '/leave-planner/'` because GitHub Pages serves the repo at `username.github.io/leave-planner/`.

The user wants to deploy to **both** GitHub Pages (unchanged, for existing users) and Cloudflare Pages at the custom domain `leaveplanner.vamonossoftware.com`, using the Wrangler CLI. Cloudflare serves the app at the domain root, so it needs `base: '/'`; GitHub Pages still needs `base: '/leave-planner/'`. Vite bakes the base path into asset URLs at build time, so a single build artifact cannot serve both — two builds are required.

## Goals / Non-Goals

**Goals:**
- Publish the same app to both GitHub Pages (`/leave-planner/`) and Cloudflare Pages (custom domain, root path).
- Each target's assets, PWA manifest, and service worker resolve correctly for that target's base path.
- One combined command deploys both; per-target commands available.

**Non-Goals:**
- Removing GitHub Pages.
- Git-connected auto-build in the Cloudflare dashboard (using CLI instead).
- Switching analytics to a Cloudflare Pages binding (tracked by `remove-google-analytics`).

## Decisions

- **Two builds with explicit `--base` over one shared build.** Vite's `base` is compiled into asset paths and the PWA manifest/SW scope, so root vs subpath cannot coexist in one artifact. `base: './'` (relative) was considered — it can break PWA manifest `start_url`, service-worker scope, and deep-link asset resolution — so it is rejected in favor of two explicit builds.
- **Remove the hard-coded `base` from `vite.config.ts`; pass it per build.**
  - `build:cf` → `vite build --base=/` (default; Cloudflare custom domain root)
  - `build:gh` → `vite build --base=/leave-planner/` (GitHub Pages subpath)
  - Each is followed by publishing the resulting `dist/`. Builds are sequential (both write `dist/`), so `deploy` runs one target fully before rebuilding for the next.
- **Wrangler CLI over Git-connected build.** `wrangler pages deploy dist` keeps deploy explicit and local, matching the existing `gh-pages` workflow.
- **Config via `wrangler.toml`** with `name = "leave-planner"` and `pages_build_output_dir = "dist"`.
- **Custom domain `leaveplanner.vamonossoftware.com`** bound to the Pages project in the Cloudflare dashboard, with a CNAME to `<project>.pages.dev` (automatic if the domain's DNS is on Cloudflare).
- **Auth via `wrangler login` (local) or `CLOUDFLARE_API_TOKEN` (CI).** Not stored in the repo.
- **Script layout:**
  - `build` (default) = `build:cf`
  - `deploy:cf` = `build:cf && wrangler pages deploy dist`
  - `deploy:gh` = `build:gh && gh-pages -d dist`
  - `deploy` = `deploy:cf && deploy:gh` (both targets)

## Risks / Trade-offs

- [Wrong base baked into a target if built once and pushed to both] → Each deploy script rebuilds with its own `--base`; never publish a `dist/` to the other target.
- [Two origins each register a service worker] → Scopes are per-origin (`github.io/leave-planner/` vs `leaveplanner.vamonossoftware.com/`), so no cross-target SW conflict; a returning user on a given origin still gets that origin's SW correctly.
- [Custom-domain DNS not yet configured] → First Cloudflare deploy still works on `<project>.pages.dev`; the custom domain is bound separately in the dashboard/DNS. Documented as its own task.
- [Wrangler auth not configured] → `deploy:cf` fails clearly asking for `wrangler login`; documented.
- [Pages project must exist] → `wrangler pages deploy` creates it on first run if missing.

## Migration Plan

1. Authenticate Wrangler; confirm the `vamonossoftware.com` zone is manageable in Cloudflare (for the custom domain).
2. Remove hard-coded `base`, add per-target build/deploy scripts, add `wrangler` dep and `wrangler.toml`.
3. Run `npm run deploy:cf`; Wrangler creates the `leave-planner` Pages project and publishes.
4. Bind `leaveplanner.vamonossoftware.com` to the Pages project; verify DNS resolves and HTTPS is issued.
5. Run `npm run deploy:gh`; verify GitHub Pages still serves at `/leave-planner/`.
6. Verify both URLs: assets/manifest/SW load, PWA installs.

Rollback: revert `package.json`/`vite.config.ts`/`wrangler.toml`; GitHub Pages deploy is unaffected.

## Open Questions

- None outstanding — custom domain confirmed as `leaveplanner.vamonossoftware.com`.
