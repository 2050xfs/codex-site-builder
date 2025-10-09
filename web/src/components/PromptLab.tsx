"use client";

import { useMemo, useState } from "react";

interface PromptLabProps {
  prompts: Array<{
    label: string;
    prompt: string;
    layout: string[];
    copy: string;
  }>;
}

export function PromptLab({ prompts }: PromptLabProps) {
  const [active, setActive] = useState(0);
  const activePrompt = prompts[active];
  const [showLayout, setShowLayout] = useState(true);

  const layoutList = useMemo(() => activePrompt.layout.join(" • "), [activePrompt]);

  return (
    <section id="experience" className="bg-[#05060f]">
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-20 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-300/80">Prompt Lab</p>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Give Codex a thought-starter. Watch a site appear in seconds.
              </h2>
              <p className="max-w-2xl text-slate-300">
                Choose from curated templates or write your own. Codex Builder analyzes tone, layout requirements, and brand elements before composing responsive sections.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {prompts.map((preset, index) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition sm:text-sm ${
                    active === index
                      ? "border-blue-400 bg-blue-500/10 text-blue-100"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_40px_120px_-60px_rgba(59,130,246,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Prompt</p>
                <p className="mt-3 text-sm text-slate-200 sm:text-base">{activePrompt.prompt}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowLayout((prev) => !prev)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wide text-white/70 transition hover:bg-white/10"
              >
                Toggle view
              </button>
            </div>
            <div className="mt-8 space-y-4 text-sm text-slate-300">
              {showLayout ? (
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Proposed layout</p>
                  <ul className="space-y-3 text-sm text-slate-200">
                    {activePrompt.layout.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Narrative</p>
                  <p className="mt-3 text-sm text-slate-200">{activePrompt.copy}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 via-white/[0.01] to-transparent p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">AI rationale</p>
              <p className="mt-3 text-sm text-slate-300">
                Codex Builder cross-references similar high-performing sites, brand tone, and accessibility constraints before sketching layout suggestions.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Responsive systems</p>
              <p className="mt-2 text-sm text-slate-200">
                Every layout is production-ready with Tailwind utility scaffolding, semantic HTML, and Vercel Edge deployment settings.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Generated copy</p>
              <p className="mt-2 text-sm text-slate-200">
                Copy updates cascade across pages instantly. Approve once and Codex adapts voice and length to every section.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-slate-500">
              <span>Layout summary:</span>
              <p className="mt-1 text-sm text-slate-200">{layoutList}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
