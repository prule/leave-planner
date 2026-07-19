## Context

Leave Planner is a privacy-first, browser-only Vue 3 SPA (Vite + TypeScript). State lives in a single Pinia store persisted to LocalStorage; there is no backend. The build has two targets with different base paths (Cloudflare Pages at `/`, GitHub Pages at `/leave-planner/`). There is no test runner and no linter — `vue-tsc` typecheck (run inside `build`) is the only automated gate. A `CLAUDE.md` must capture exactly this, without implying tooling that does not exist.

## Goals / Non-Goals

**Goals:**
- One root `CLAUDE.md` an agent can read at session start to work correctly.
- Accurate stack, layout, data model, build/deploy, and gotchas.

**Non-Goals:**
- Duplicating README end-user content (install/PWA instructions).
- Adding tests, lint, or any tooling (documenting reality only).
- OpenSpec workflow docs (the `openspec/` dir speaks for itself).

## Decisions

- **Location: repo root `CLAUDE.md`.** Standard discovery path for Claude Code; not `.claude/` (that dir holds local settings, gitignored here).
- **Content outline:**
  1. One-line project summary + privacy/local-only nature.
  2. Tech stack (Vue 3, TS, Vite, Pinia, Tailwind v4, chart.js/vue-chartjs, vite-plugin-pwa; pnpm).
  3. Directory map (`src/components`, `src/composables`, `src/stores`, key files).
  4. State & data model — Pinia `leaveStore` types (`Settings`, `LeaveEntry`, `MonthlyBalance`), LocalStorage persistence via `watch`.
  5. Commands — `dev`, `build` (= `build:cf`), `build:cf`/`build:gh` and their base paths, `deploy`/`deploy:cf`/`deploy:gh`.
  6. Conventions / gotchas — no tests, no eslint; `vue-tsc` is the typecheck; base-path duality; `dist` is gitignored; hours-as-source-of-truth domain rule.
- **Tone: terse, factual, skimmable.** Bullets over prose.
- **Derive every claim from the repo** (package.json, vite.config.ts, store, README) — no assumptions.

## Risks / Trade-offs

- [Doc drifts from code over time] → Keep it short and point to sources of truth (package.json, the store) rather than duplicating detail.
- [Over-documenting] → Cap at ~1 page; omit anything an agent can read directly from a single obvious file.

## Migration Plan

Single-file addition; no migration. Verify by reading the file and cross-checking commands/paths against `package.json` and `vite.config.ts`.

## Open Questions

- None.
