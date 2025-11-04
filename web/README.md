# Upflex AutoSite Builder

This Next.js workspace hosts the agent pipeline, Daytona integration, and UI baseline for the Upflex AutoSite builder.

## Project Structure

- `src/agents` — Type definitions, schemas, tool registry, and the manager orchestrator for the PLAN → SCAFFOLD → CODE → QA → DEPLOY pipeline.
- `src/daytona` — Daytona workspace client/server helpers and API routes used by Code Mode.
- `src/app` — Next.js app routes, including the `/api/agents/start` orchestrator entrypoint.
- `scripts/quality-pre.mjs` — Pre-deploy quality gate that runs type checking, linting, and heuristics.
- `tailwind.preset.cjs` & `app/globals.css` — Token-aware Tailwind configuration applied from brand settings.

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3000. Update pages under `src/app` to iterate on the UI.

## Admin Setup

Before launching the service for editors, complete the admin onboarding steps in [`docs/admin-setup.md`](docs/admin-setup.md). The guide covers required API keys, environment configuration, persistence wiring, and how to operate the agent pipeline safely.

## Quality Checks

Run the bundled quality suite locally or inside Daytona before opening a PR:

```bash
npm run quality:pre
```

This wraps `npm run typecheck`, `npm run lint`, basic accessibility heuristics, and SEO metadata checks.
