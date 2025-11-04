export type DaytonaWorkspace = {
  id: string;
  status: "starting" | "running" | "stopped" | "error";
  devUrl?: string;
  repoUrl: string;
  branch: string;
  createdAt: string;
};

export type DaytonaCreateArgs = {
  siteId: string;
  repoUrl: string;
  baseBranch: string;
  branchName?: string;
  env?: Record<string, string>;
};

export type DaytonaCreateResult = DaytonaWorkspace;

export type DaytonaCommitPRArgs = {
  workspaceId: string;
  title: string;
  body?: string;
  reviewers?: string[];
  maxFilesChanged?: number;
};

export type DaytonaCommitPRResult = {
  prUrl: string;
  prNumber: number;
  branch: string;
};
