## 1. Author CLAUDE.md

- [x] 1.1 Create root `CLAUDE.md` with: one-line project summary + privacy/local-only note
- [x] 1.2 Add tech stack section (Vue 3, TS, Vite, Pinia, Tailwind v4, chart.js/vue-chartjs, vite-plugin-pwa; pnpm)
- [x] 1.3 Add directory map (`src/components`, `src/composables`, `src/stores`, key files)
- [x] 1.4 Add state & data model section (Pinia `leaveStore`; `Settings`/`LeaveEntry`/`MonthlyBalance`; LocalStorage persistence)
- [x] 1.5 Add commands section (`dev`, `build`, `build:cf`/`build:gh` with base paths, `deploy`/`deploy:cf`/`deploy:gh`)
- [x] 1.6 Add conventions/gotchas (no tests, no eslint, `vue-tsc` typecheck; base-path duality; `dist` gitignored; hours as source of truth)

## 2. Verify

- [x] 2.1 Cross-check every command/path in `CLAUDE.md` against `package.json` and `vite.config.ts`
- [x] 2.2 Confirm no references to non-existent tooling (tests/lint)
