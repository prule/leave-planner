# deployment

## Purpose

How the app is built and published — the target hosts, per-target base path, and deploy commands.

## Requirements

### Requirement: Dual-target deployment

The app SHALL be publishable to both GitHub Pages and Cloudflare Pages, each built with the base path that its host requires.

#### Scenario: Cloudflare deploy publishes at root base

- **WHEN** a maintainer runs `npm run deploy:cf` with Wrangler authenticated
- **THEN** the app is built with base `/` and published to the Cloudflare Pages project via `wrangler pages deploy dist`

#### Scenario: GitHub Pages deploy publishes at subpath base

- **WHEN** a maintainer runs `npm run deploy:gh`
- **THEN** the app is built with base `/leave-planner/` and published to GitHub Pages via `gh-pages -d dist`

#### Scenario: Combined deploy publishes both

- **WHEN** a maintainer runs `npm run deploy`
- **THEN** the app is deployed to both Cloudflare Pages and GitHub Pages, each with its correct base path

#### Scenario: Assets resolve on each target

- **WHEN** either deployed site is loaded at its URL (`leaveplanner.vamonossoftware.com` or the GitHub Pages `/leave-planner/` URL)
- **THEN** JavaScript, CSS, PWA manifest, and service worker load without 404s for that target's base path

### Requirement: Cloudflare custom domain

The Cloudflare Pages project SHALL be served at the custom domain `leaveplanner.vamonossoftware.com`.

#### Scenario: Custom domain serves the app over HTTPS

- **WHEN** a user visits `https://leaveplanner.vamonossoftware.com`
- **THEN** the app loads over HTTPS from the Cloudflare Pages project

### Requirement: Deploy configuration in repo

The repository SHALL contain the Cloudflare Pages project configuration so deployment requires no ad-hoc flags.

#### Scenario: Wrangler config present

- **WHEN** `wrangler pages deploy dist` is run from the repo root
- **THEN** the project name and output directory are read from `wrangler.toml` (`name`, `pages_build_output_dir = "dist"`) without additional command-line arguments
