# Admin Setup Guide

This guide walks administrators through preparing the AutoSite Builder stack for production use. Complete every section before inviting editors or connecting the system to external services.

## 1. Prerequisites

- **Runtime:** Node.js 18+ and npm 9+ on any machine that will run scripts or the Next.js server.
- **Access:** Ability to configure environment variables/secrets for your hosting platform (Vercel, Render, etc.) and Daytona.
- **Accounts:** Daytona workspace access and a persistence layer (Supabase recommended) for run/check logging.

## 2. Required Environment Variables

Use the provided `.env.example` as a template and define the following secrets in your hosting environment and Daytona workspace templates:

| Variable | Required | Description |
| --- | --- | --- |
| `DAYTONA_API` | ✅ | Base URL for your Daytona instance (e.g. `https://api.daytona.io/v1`). Used by `src/daytona/server.ts` for all workspace operations. |
| `DAYTONA_TOKEN` | ✅ | API token with permission to create/start/stop workspaces and open PRs. Injected into Daytona server helpers. |
| `SUPABASE_URL` | ⚠️ | URL for your Supabase project (needed once `saveRun`/`saveChecks` are implemented). |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ | Service role key for persisting agent runs and QA check results. Store securely and restrict usage to server-side code. |
| `OPENAI_API_KEY` | ⚠️ | Only required when you connect the tool stubs in `src/agents/tools.ts` to live OpenAI Agents/Responses. |

> ⚠️ Variables marked optional (⚠️) are only necessary when the corresponding integrations are activated. Keep them ready to avoid redeploys later.

### Daytona Workspace Template

When creating Daytona workspace templates, mirror the same environment variables so `npm run quality:pre` and other scripts can access API keys during Code Mode sessions.

## 3. Persistence Wiring

The helper functions in `src/data/agents.ts` and `src/data/brand.ts` are currently stubbed. Implement the following to enable run history and brand personalization:

1. **Agent Run Logging (`saveRun`)** — Upsert each phase into a table such as `agent_runs` keyed by `site_id` and `run_id`.
2. **Quality Check Storage (`saveChecks`)** — Persist each check row (name, status, metadata) for auditing and UI surfacing.
3. **Brand Tokens (`getSiteBrandTokens`)** — Fetch per-site token JSON to drive Tailwind CSS variables at runtime. Provide sensible defaults if no record exists.

Document your schema choices so future operators can audit data flow.

## 4. Agent Pipeline Flow

The orchestrator in `src/agents/manager.ts` runs the following steps:

1. **Plan** — Calls `tools.site_design_planner` to translate briefs/goals into a `SitePlan`.
2. **Scaffold** — Generates a repo spec via `tools.repo_scaffolder`.
3. **Code** — Applies diffs or fills content through `tools.code_writer`.
4. **Quality Gate** — Executes `tools.quality_gate` and optional fix-it retries.
5. **Deploy** — Zips the repo (`zipRepoToBase64`) and ships it with `tools.vercel_deployer`.

Ensure each tool is backed by a model/service before exposing the `/api/agents/start` route publicly. Use staging keys to validate prompts and rate limits.

## 5. Operating Procedures

- **Kick off a run:** POST to `/api/agents/start` with `{ siteId, brief, goals?, pagesHint?, brandHint?, preview? }`.
- **Monitor progress:** Persisted runs/checks (Section 3) should feed your admin dashboard. Until persistence is wired, watch server logs.
- **Quality gate failures:** The manager retries up to `maxFixRetries` (default `2`). Tune this value or disable deployment until checks pass.
- **Manual deploys:** If automated deploy fails, download the zipped repo from logs, validate locally, then redeploy through Vercel.

## 6. Daytona & Code Mode

1. Use `POST /api/daytona/workspaces` to provision an editing workspace tied to a repository/branch.
2. Daytona automatically runs `npm run quality:pre` before opening a PR. Keep dependencies installed and ensure the script completes in <5 minutes.
3. Guard `openPullRequest` with `maxFilesChanged` to prevent runaway diffs. Adjust the default threshold (`40`) as your repo grows.

## 7. Security & Access Control

- Scope Daytona tokens to specific projects and rotate them quarterly.
- Limit who can invoke `/api/agents/start` (e.g. require authenticated POSTs through your CMS/admin UI).
- Store service-role Supabase keys only in server-side environments; never expose them to the browser.
- Audit quality gate logs regularly to keep heuristics tuned.

## 8. Change Management

- Require `npm run quality:pre` to pass before merging any PR (local or Daytona-generated).
- Version control prompt changes for each tool implementation and review diff hunks carefully.
- Keep this guide updated whenever new services or environment variables are introduced.
