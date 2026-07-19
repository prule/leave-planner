# contributor-guidance

## Purpose

Orientation material (a root `CLAUDE.md`) that helps an AI agent or new contributor work in this codebase correctly.

## Requirements

### Requirement: Root CLAUDE.md orientation file

The repository SHALL contain a root `CLAUDE.md` that orients an AI agent or new contributor to the project, and every factual claim in it SHALL be consistent with the actual repository.

#### Scenario: File exists at repo root

- **WHEN** the repository root is listed
- **THEN** a `CLAUDE.md` file is present

#### Scenario: Documents stack, layout, and commands

- **WHEN** `CLAUDE.md` is read
- **THEN** it describes the tech stack, the `src/` directory layout, the Pinia/LocalStorage state model, and the build/deploy commands from `package.json`

#### Scenario: No invented tooling

- **WHEN** `CLAUDE.md` describes checks or tooling
- **THEN** it reflects the repository as it is (no test runner, no linter; `vue-tsc` typecheck via `build`) and does not reference tools that are not configured

#### Scenario: Captures the base-path duality

- **WHEN** `CLAUDE.md` describes building or deploying
- **THEN** it notes that `build:cf` uses base `/` and `build:gh` uses base `/leave-planner/`
