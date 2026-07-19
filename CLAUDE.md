# CLAUDE.md

Leave Planner — a privacy-first, browser-only SPA to track leave balances and plan holidays. No backend, no logins; all data lives in the browser's LocalStorage.

## Tech stack

- **Vue 3** (`<script setup>`, Composition API) + **TypeScript**
- **Vite 7** build tooling; **pnpm** package manager
- **Pinia** for state
- **Tailwind CSS v4** (via `@tailwindcss/postcss`) + PostCSS/autoprefixer
- **chart.js** + **vue-chartjs** (+ `chartjs-plugin-datalabels`) for the projection chart
- **vite-plugin-pwa** (Workbox) — installable PWA, `registerType: 'prompt'`

## Layout

```
index.html            App shell; loads /src/main.ts; Cloudflare Web Analytics beacon
src/
  main.ts             App bootstrap (Vue + Pinia)
  App.vue             Root component / view switching
  stores/
    leaveStore.ts     Single Pinia store — all app state + data model
  composables/
    useLeaveCalculations.ts   Projection / balance math
    usePublicHolidays.ts      Public-holiday fetching
  components/         Views + modals (SpreadsheetView, BalanceChart, SettingsView,
                     AboutView, LeaveModal, WfhModal, FeedbackModal, ReloadPrompt)
vite.config.ts        Vite + PWA config (no hard-coded base — passed per build)
wrangler.toml         Cloudflare Pages project config
```

## State & data model

All state is in `src/stores/leaveStore.ts` (Pinia), persisted to **LocalStorage** via a `watch`. Import/export uses the `LeavePlannerData` type. Core types:

- `Settings` — `startBalance`, `startDate`, `defaultAccrualRate`, `projectionHorizon`, `hoursPerDay`, `financialYearStartMonth`, holiday URL/country/county.
- `LeaveEntry` — a booked leave period (`startDate`, `endDate`, `hoursTaken`, `description`).
- `MonthlyBalance` — per-month `accrual`/`balance` (`null` = use default / auto-calculate) + `notes`.

Domain rule: **hours are the source of truth**; days are derived via `hoursPerDay`. Manual balance overrides re-anchor all future projections.

## Commands

- `pnpm dev` — Vite dev server
- `pnpm build` — alias of `build:cf` (runs `vue-tsc -b` typecheck, then `vite build`)
- `pnpm build:cf` — build with base `/` (Cloudflare custom domain root)
- `pnpm build:gh` — build with base `/leave-planner/` (GitHub Pages subpath)
- `pnpm preview` — preview a build
- `pnpm deploy` — deploy both targets (`deploy:cf` then `deploy:gh`)
- `pnpm deploy:cf` — build (base `/`) + `wrangler pages deploy dist`
- `pnpm deploy:gh` — build (base `/leave-planner/`) + `gh-pages -d dist`

## Conventions & gotchas

- **No test runner and no linter.** The only automated check is the `vue-tsc -b` typecheck run inside `build`. Run `pnpm build` to verify a change compiles.
- **Two build base paths.** The app deploys to Cloudflare Pages (`leaveplanner.vamonossoftware.com`, base `/`) and GitHub Pages (base `/leave-planner/`). A single build cannot serve both — always use the matching `build:*`/`deploy:*` script; never publish one target's `dist/` to the other.
- **`dist/` is gitignored** (a build artifact). `vite.config.js` is a stale compiled copy of `vite.config.ts` — edit the `.ts`; don't commit regenerated `.js`.
- **Privacy:** never introduce a backend, remote storage, or personal-data upload — data stays in the browser by design.
- Planning docs and specs live under `openspec/` (OpenSpec workflow).
