## 1. Cloudflare setup

- [ ] 1.1 Confirm a Cloudflare account exists and authenticate Wrangler (`wrangler login`, or set `CLOUDFLARE_API_TOKEN`)
- [ ] 1.2 Confirm the `vamonossoftware.com` DNS zone is manageable in Cloudflare (needed to bind the custom domain)

## 2. Repo configuration

- [x] 2.1 Add `wrangler` as a devDependency (`pnpm add -D wrangler`); keep `gh-pages`
- [x] 2.2 Create `wrangler.toml` with `name = "leave-planner"` and `pages_build_output_dir = "dist"`
- [x] 2.3 Remove the hard-coded `base: '/leave-planner/'` from `vite.config.ts` (default base becomes `/`)
- [x] 2.4 Update `package.json` scripts:
  - `build:cf` = `vue-tsc -b && vite build --base=/`
  - `build:gh` = `vue-tsc -b && vite build --base=/leave-planner/`
  - `deploy:cf` = `npm run build:cf && wrangler pages deploy dist`
  - `deploy:gh` = `npm run build:gh && gh-pages -d dist`
  - `deploy` = `npm run deploy:cf && npm run deploy:gh`
  - keep `build` = `build:cf`

## 3. Cloudflare deploy + custom domain

- [ ] 3.1 Run `npm run deploy:cf`; confirm Wrangler creates/uses the `leave-planner` Pages project and publishes to `<project>.pages.dev`
- [ ] 3.2 In the Cloudflare dashboard, bind the custom domain `leaveplanner.vamonossoftware.com` to the Pages project; confirm DNS + HTTPS cert issue
- [ ] 3.3 Load `https://leaveplanner.vamonossoftware.com`; confirm JS/CSS/manifest/service worker load with no 404s at root and the PWA installs

## 4. GitHub Pages deploy (verify unchanged)

- [ ] 4.1 Run `npm run deploy:gh`; confirm GitHub Pages still serves at the `/leave-planner/` URL with no 404s
- [ ] 4.2 Run `npm run deploy` and confirm both targets publish in one command
