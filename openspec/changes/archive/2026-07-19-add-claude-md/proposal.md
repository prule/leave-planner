## Why

The repo has no `CLAUDE.md`, so AI coding agents (and new contributors) must re-derive the stack, architecture, conventions, and deploy flow every session. A concise root `CLAUDE.md` captures the non-obvious facts (Pinia + LocalStorage state, dual-target build base paths, no test/lint tooling) so work starts correctly.

## What Changes

- Add a root `CLAUDE.md` documenting: project purpose, tech stack, directory layout, state/data model, build & dual deploy commands, and conventions/gotchas.
- Keep it concise and factual — no invented tooling; reflect the repo as it actually is (no tests, no eslint, `vue-tsc` as the only typecheck).

## Capabilities

### New Capabilities
- `contributor-guidance`: A root `CLAUDE.md` that orients an AI agent or contributor to the codebase's stack, structure, and workflows.

### Modified Capabilities
<!-- none -->

## Impact

- New file `CLAUDE.md` at repo root. No code, dependency, or build changes.
- Sources of truth referenced: `package.json` (scripts/deps), `vite.config.ts`, `src/stores/leaveStore.ts` (data model), `README.md` (features/privacy).
