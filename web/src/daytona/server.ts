import type {
  DaytonaCreateArgs,
  DaytonaCreateResult,
  DaytonaWorkspace,
  DaytonaCommitPRArgs,
  DaytonaCommitPRResult,
} from "./types";

const DAYTONA_API = process.env.DAYTONA_API!;
const DAYTONA_TOKEN = process.env.DAYTONA_TOKEN!;

async function daytonaFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${DAYTONA_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${DAYTONA_TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Daytona ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// TODO: persist to Supabase as needed
async function saveWorkspace(ws: DaytonaWorkspace) {
  void ws;
}
async function readWorkspace(id: string): Promise<DaytonaWorkspace | null> {
  void id;
  return null;
}
async function savePR(wsId: string, pr: DaytonaCommitPRResult) {
  void wsId;
  void pr;
}

export async function listWorkspaces(): Promise<DaytonaWorkspace[]> {
  return daytonaFetch(`/workspaces`, { method: "GET" });
}

export async function createWorkspace(args: DaytonaCreateArgs): Promise<DaytonaCreateResult> {
  const branch = args.branchName ?? `edit-${Date.now()}`;
  const ws = await daytonaFetch(`/workspaces`, {
    method: "POST",
    body: JSON.stringify({ repoUrl: args.repoUrl, baseBranch: args.baseBranch, branch, env: args.env ?? {} }),
  });
  const started = await daytonaFetch(`/workspaces/${ws.id}/start`, { method: "POST" });
  const workspace: DaytonaWorkspace = {
    id: ws.id,
    status: started.status ?? "running",
    devUrl: started.devUrl,
    repoUrl: args.repoUrl,
    branch,
    createdAt: new Date().toISOString(),
  };
  await saveWorkspace(workspace);
  return workspace;
}

export async function getWorkspace(id: string): Promise<DaytonaWorkspace> {
  const cached = await readWorkspace(id);
  if (cached) return cached;
  return daytonaFetch(`/workspaces/${id}`, { method: "GET" });
}

export async function stopWorkspace(id: string): Promise<DaytonaWorkspace> {
  return daytonaFetch(`/workspaces/${id}/stop`, { method: "POST" });
}

export async function openPullRequest(args: DaytonaCommitPRArgs): Promise<DaytonaCommitPRResult> {
  if (args.maxFilesChanged) {
    const diff = await daytonaFetch(`/workspaces/${args.workspaceId}/diff`, { method: "GET" });
    if (diff.filesChanged > args.maxFilesChanged) {
      throw new Error(`Too many files: ${diff.filesChanged}`);
    }
  }
  const pre = await daytonaFetch(`/workspaces/${args.workspaceId}/exec`, {
    method: "POST",
    body: JSON.stringify({ cmd: "npm run quality:pre" }),
  });
  if (pre.exitCode !== 0) {
    throw new Error(`quality:pre failed. See workspace logs.`);
  }
  const pr = await daytonaFetch(`/workspaces/${args.workspaceId}/pull-request`, {
    method: "POST",
    body: JSON.stringify({ title: args.title, body: args.body ?? "", reviewers: args.reviewers ?? [] }),
  });
  const result: DaytonaCommitPRResult = { prUrl: pr.url, prNumber: pr.number, branch: pr.branch };
  await savePR(args.workspaceId, result);
  return result;
}
