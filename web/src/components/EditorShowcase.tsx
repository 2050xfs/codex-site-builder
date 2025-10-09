"use client";

import { useMemo, useState } from "react";

interface Panel {
  title: string;
  description: string;
  action: string;
}

interface EditorShowcaseProps {
  panels: Panel[];
}

export function EditorShowcase({ panels }: EditorShowcaseProps) {
  const [activePanel, setActivePanel] = useState(panels[0]?.title ?? "");

  const activeDescription = useMemo(
    () => panels.find((panel) => panel.title === activePanel)?.description ?? "",
    [activePanel, panels]
  );

  const activeAction = useMemo(
    () => panels.find((panel) => panel.title === activePanel)?.action ?? "",
    [activePanel, panels]
  );

  return (
    <section id="editor" className="bg-[#05060f]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-blue-300/80">Visual editor</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Powerful enough for power users. Friendly enough for your entire team.
            </h2>
            <p className="text-slate-300">
              The Codex canvas understands responsive heuristics, motion, and spacing. Switch between structure, styling, and copy panels to orchestrate changes together in real time.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {panels.map((panel) => (
                <button
                  key={panel.title}
                  type="button"
                  onClick={() => setActivePanel(panel.title)}
                  className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${
                    panel.title === activePanel
                      ? "border-blue-400 bg-blue-500/10 text-blue-100 shadow-[0_15px_45px_-30px_rgba(96,165,250,0.9)]"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{panel.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/90">{panel.description}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="relative rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent p-6">
            <div className="absolute -left-8 top-1/2 hidden -translate-y-1/2 rotate-90 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.4em] text-white/60 sm:block">
              Canvas
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0b0d1a] p-6 shadow-[0_30px_80px_-40px_rgba(15,118,255,0.6)]">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-yellow-300" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="ml-3 text-white/50">/pages/landing.tsx</span>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-sm text-slate-200">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Active panel</p>
                  <p className="mt-2 text-base text-white">{activePanel}</p>
                  <p className="mt-3 text-sm text-slate-300">{activeDescription}</p>
                  <button className="mt-4 inline-flex w-max items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_-15px_rgba(59,130,246,0.7)] transition hover:bg-blue-400">
                    {activeAction}
                  </button>
                </div>
                <div className="grid gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Spacing intelligence</span>
                    <span>Auto</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Responsive breakpoints</span>
                    <span>XS · SM · LG · XL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Motion presets</span>
                    <span>Ease · Frictionless</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AI versioning</span>
                    <span>On</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
