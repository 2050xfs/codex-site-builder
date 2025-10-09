interface Step {
  title: string;
  detail: string;
}

interface DeploymentJourneyProps {
  steps: Step[];
}

export function DeploymentJourney({ steps }: DeploymentJourneyProps) {
  return (
    <section id="deploy" className="bg-[#05060f]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-blue-300/80">Deploy to Vercel</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Go from draft to production in minutes with Vercel automation baked in.
            </h2>
            <p className="text-slate-300">
              Connect your workspace once. Codex Builder manages preview links, environment variables, and edge caching so every update is a confident release.
            </p>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
              <span className="rounded-full border border-white/10 px-3 py-1">Preview URLs</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Edge-ready</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Audit logs</span>
            </div>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <div className="grid gap-6">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Step {index + 1}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{step.title}</p>
                    </div>
                    <span className="rounded-full border border-blue-400/40 bg-blue-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-blue-100">
                      Auto
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-300">{step.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Vercel connection</p>
                <p className="mt-2 text-sm text-slate-200">codex-builder.vercel.app</p>
              </div>
              <button className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-blue-50">
                Deploy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
