"use client";

import Link from "next/link";

interface HeroProps {
  statBlocks: Array<{
    label: string;
    value: string;
    description: string;
  }>;
}

export function Hero({ statBlocks }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#05060f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(63,99,255,0.35),_transparent_55%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-32 pt-20 sm:px-10 lg:px-16">
        <header className="flex flex-col gap-12">
          <div className="flex items-center justify-between gap-6">
            <span className="text-sm uppercase tracking-[0.35em] text-blue-300/80">
              Codex Builder
            </span>
            <Link
              href="#deploy"
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/10 sm:block"
            >
              Deploy to Vercel
            </Link>
          </div>
          <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs uppercase tracking-wide text-blue-200">
                AI Native Website Builder
              </span>
              <h1 className="text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                Design, edit, and deploy a production-ready site from a single conversation.
              </h1>
              <p className="max-w-xl text-base text-slate-300 sm:text-lg">
                Codex Builder thinks like a creative director and codes like your senior engineer. Start with natural language prompts, iterate visually, and launch to Vercel when you love what you see.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#experience"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_20px_60px_-25px_rgba(148,163,184,0.7)] transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  Start building free
                </Link>
                <Link
                  href="#editor"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/5"
                >
                  Watch the editor demo
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live builds</p>
                  <p className="mt-2 text-4xl font-semibold text-white">12,482</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Deployments</p>
                  <p className="mt-2 text-3xl font-semibold text-white">+326%</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Avg. build time</span>
                  <span>2m 34s</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>AI suggestions accepted</span>
                  <span>93%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700">
                  <div className="h-full w-[93%] rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-sky-300" />
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {statBlocks.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{stat.value}</p>
                    <p className="text-[11px] text-slate-500">{stat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>
      </div>
    </section>
  );
}
