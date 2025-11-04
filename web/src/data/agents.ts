export async function saveRun(row: { siteId: string; runId: string; phase: string; status: string; output: unknown }) {
  // TODO: upsert into supabase.agent_runs
  return row;
}

export async function saveChecks(siteId: string, checks: unknown[]) {
  // TODO: insert into supabase.checks
  return { siteId, checks };
}
