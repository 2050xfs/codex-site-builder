export type UUID = string;

export type BrandTokens = {
  name?: string;
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
    neutral?: string;
    success?: string;
    warning?: string;
    danger?: string;
    background?: string;
    foreground?: string;
  };
  radius?: { sm?: string; md?: string; lg?: string; xl?: string; full?: string };
  shadow?: { sm?: string; md?: string; lg?: string; xl?: string };
  spacing?: { sm?: string; md?: string; lg?: string; xl?: string };
  font?: { heading?: string; body?: string; mono?: string };
};

export type PageSection = {
  kind: string;
  props?: Record<string, unknown>;
};

export type PagePlan = {
  slug: string;
  title: string;
  sections: PageSection[];
};

export type SitePlan = {
  pages: PagePlan[];
  brand: BrandTokens;
  dataModels?: Array<{ name: string; fields: Array<{ name: string; type: string; required?: boolean }> }>;
};

export type FileSpec = {
  path: string;
  contents: string;
  mode?: "text" | "binary";
};

export type RepoSpec = {
  files: FileSpec[];
};

export type DiffHunk = {
  file: string;
  op: "create" | "modify" | "delete";
  from?: string;
  to?: string;
};

export type RepoWithDiffs = {
  base: RepoSpec;
  diffs?: DiffHunk[];
};

export type QualityCheck = {
  name: string;
  status: "pass" | "fail" | "warn";
  details?: Record<string, unknown>;
};

// Tool IO contracts
export type SiteDesignPlannerArgs = {
  businessBrief: string;
  goals?: string[];
  pagesHint?: string[];
  brandHint?: Partial<BrandTokens>;
};
export type SiteDesignPlannerResult = SitePlan;

export type RepoScaffolderArgs = {
  plan: SitePlan;
  preset?: "marketing-min" | "marketing-full" | "saas-min";
};
export type RepoScaffolderResult = RepoSpec;

export type CodeWriterArgs = {
  repo: RepoSpec;
  diffs?: DiffHunk[];
  content?: Record<string, unknown>;
  brand?: Partial<BrandTokens>;
};
export type CodeWriterResult = RepoSpec;

export type QualityGateArgs = { repo: RepoSpec; checks?: string[] };
export type QualityGateResult = QualityCheck[];

export type VercelDeployerArgs = {
  siteId: UUID;
  repoZipBase64: string;
  preview?: boolean;
};
export type VercelDeployerResult = { vercelUrl: string };

export type ContentAgentArgs = {
  plan: SitePlan;
  tone?: "neutral" | "friendly" | "bold" | "luxury";
  audience?: string;
};
export type ContentAgentResult = {
  copyByPage: Record<string, Record<string, string>>;
  seoByPage: Record<string, { title: string; description: string }>;
  imagePrompts?: Record<string, string[]>;
};

export type FixItAgentArgs = { repo: RepoSpec; failedChecks: QualityCheck[] };
export type FixItAgentResult = { diffs: DiffHunk[] };
