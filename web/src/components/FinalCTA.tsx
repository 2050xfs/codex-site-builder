import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="bg-[#05060f]">
      <div className="mx-auto max-w-5xl space-y-8 rounded-[40px] border border-blue-500/40 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.2),_rgba(2,6,23,0.95))] px-8 py-16 text-center shadow-[0_40px_120px_-60px_rgba(37,99,235,0.8)]">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-100/70">Try Codex Builder</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Launch a lovable site in an afternoon. Your team keeps creative control, Codex handles the rest.
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-slate-200">
          Start with the free workspace to prototype. Invite collaborators, connect Vercel, and publish when you’re ready.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="#experience"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
          >
            Generate my site
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
