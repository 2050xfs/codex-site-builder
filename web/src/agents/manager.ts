import { tools } from "./tools";
import type { RepoSpec, SiteDesignPlannerArgs, CodeWriterArgs, QualityCheck, BrandTokens } from "./types";
import { zipRepoToBase64 } from "@/lib/zip";
import { saveRun, saveChecks } from "@/data/agents";
import { assertOk, shortId } from "@/lib/utils";

type ManagerArgs = {
  siteId: string;
  brief: string;
  goals?: string[];
  pagesHint?: string[];
  brandHint?: Partial<BrandTokens>;
  preview?: boolean;
  maxFixRetries?: number;
};

export async function runManager(args: ManagerArgs) {
  const { siteId, brief, goals, pagesHint, brandHint } = args;
  const runId = shortId();

  // PLAN
  const planArgs: SiteDesignPlannerArgs = { businessBrief: brief, goals, pagesHint, brandHint };
  const plan = await tools.site_design_planner.execute(planArgs);
  await saveRun({ siteId, runId, phase: "plan", status: "ok", output: plan });

  // SCAFFOLD
  const scaffold = await tools.repo_scaffolder.execute({ plan, preset: "marketing-full" });
  await saveRun({ siteId, runId, phase: "scaffold", status: "ok", output: { count: scaffold.files.length } });

  // CODE
  let repo: RepoSpec = await tools.code_writer.execute({ repo: scaffold });
  await saveRun({ siteId, runId, phase: "code", status: "ok", output: { count: repo.files.length } });

  // QA (with small fix loop)
  let checks: QualityCheck[] = await tools.quality_gate.execute({ repo });
  await saveChecks(siteId, checks);
  let retries = 0;
  const MAX = args.maxFixRetries ?? 2;
  while (checks.some((c) => c.status === "fail") && retries < MAX) {
    const fix = await tools.fix_it_agent.execute({ repo, failedChecks: checks });
    repo = await tools.code_writer.execute({ repo, diffs: fix.diffs } as CodeWriterArgs);
    checks = await tools.quality_gate.execute({ repo });
    await saveChecks(siteId, checks);
    retries++;
  }
  assertOk(!checks.some((c) => c.status === "fail"), "Quality gate failed after retries.");

  // DEPLOY
  const b64 = await zipRepoToBase64(repo.files);
  const deploy = await tools.vercel_deployer.execute({
    siteId,
    repoZipBase64: b64,
    preview: args.preview ?? true,
  });
  await saveRun({ siteId, runId, phase: "deploy", status: "ok", output: deploy });

  return deploy;
}
