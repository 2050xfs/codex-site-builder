"use client";

import { FormEvent, useMemo, useState } from "react";
import SandboxLauncher from "../components/builder/SandboxLauncher";

type GenerationStatus = "idle" | "running" | "success" | "error";

type GenerationResult = {
  summary: string;
  repositoryUrl: string;
};

export default function Home() {
  const [siteId, setSiteId] = useState("site-prod-001");
  const [repoUrl, setRepoUrl] = useState("https://github.com/example/repo");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("running");
    setError(null);
    setResult(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setResult({
        summary: `Site ${siteId} generated from ${repoUrl}.`,
        repositoryUrl: repoUrl,
      });
      setStatus("success");
    } catch (generationError) {
      setStatus("error");
      setError(
        generationError instanceof Error
          ? generationError.message
          : "An unknown error occurred while generating the site.",
      );
    }
  };

  const generationComplete = status === "success";

  const statusLabel = useMemo(() => {
    switch (status) {
      case "running":
        return "Generating site...";
      case "success":
        return "Generation complete.";
      case "error":
        return "Generation failed.";
      default:
        return "Awaiting input.";
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold text-white">Site Builder</h1>
          <p className="text-sm text-slate-300">
            Submit a site identifier and repository URL to generate the build artifacts. Once the
            generation succeeds, Daytona will launch a sandbox automatically.
          </p>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/30">
          <form className="flex flex-col gap-4" onSubmit={handleGenerate}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-200" htmlFor="site-id">
                Site ID
              </label>
              <input
                id="site-id"
                name="siteId"
                value={siteId}
                onChange={(event) => setSiteId(event.target.value)}
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="site-prod-001"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-200" htmlFor="repo-url">
                Repository URL
              </label>
              <input
                id="repo-url"
                name="repoUrl"
                value={repoUrl}
                onChange={(event) => setRepoUrl(event.target.value)}
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="https://github.com/example/repo"
                required
                type="url"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              disabled={status === "running"}
            >
              {status === "running" ? "Generating..." : "Generate site"}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/30">
          <div className="flex flex-col gap-3">
            <header className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-white">Generation results</h2>
              <p className="text-sm text-slate-300">{statusLabel}</p>
            </header>

            {status === "running" && (
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-500 border-r-transparent"></span>
                Preparing artifacts for {siteId}...
              </div>
            )}

            {result && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-200">
                <p>{result.summary}</p>
                <p className="mt-1 truncate text-slate-300" title={result.repositoryUrl}>
                  {result.repositoryUrl}
                </p>
              </div>
            )}

            {status === "error" && error && (
              <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-200">
                {error}
              </div>
            )}
          </div>

          {generationComplete && (
            <SandboxLauncher siteId={siteId} repoUrl={repoUrl} generationComplete={generationComplete} />
          )}
        </section>
      </main>
    </div>
  );
}
