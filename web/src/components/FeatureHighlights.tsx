interface Feature {
  title: string;
  description: string;
  tag: string;
}

interface FeatureHighlightsProps {
  features: Feature[];
}

export function FeatureHighlights({ features }: FeatureHighlightsProps) {
  return (
    <section className="bg-[#05060f]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
        <div className="space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-300/80">Why teams switch</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Built for modern product teams that ship weekly.
          </h2>
          <p className="mx-auto max-w-2xl text-slate-300">
            Codex Builder pairs AI generation with guardrails for compliance, performance, and brand fidelity. Every feature is designed to remove friction from ideation to launch.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-blue-400/40 hover:bg-white/[0.06]"
            >
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_65%)] opacity-0 transition group-hover:opacity-100" />
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/60">
                {feature.tag}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200 opacity-0 transition group-hover:opacity-100">
                <span>Explore feature</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
