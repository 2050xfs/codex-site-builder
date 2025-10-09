"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const promptPreviews = [
  {
    label: "Brand New Startup",
    prompt:
      "Design a launch page for FluxFlow, an AI data platform. Hero must include a single sentence value proposition, social proof badges, and a call-to-action button.",
    layout: [
      "Hero with gradient background, centered headline, CTA",
      "Feature trio describing insights, automation, and security",
      "Customer logos row and testimonial",
      "Pricing cards with monthly toggle"
    ],
    copy:
      "FluxFlow translates raw data into real-time insight. Trusted by teams shipping faster, with security built in and pricing that flexes with your growth."
  },
  {
    label: "Agency Portfolio",
    prompt:
      "Create an agency site for Studio North that feels editorial. Include a full-bleed hero, rotating case study, team snapshot, and inquiry form.",
    layout: [
      "Immersive hero with layered typography",
      "Case study slider featuring latest work",
      "Team grid with biographies",
      "Minimal contact form with calendar embed"
    ],
    copy:
      "Studio North shapes high-conversion brand experiences. Every pixel is strategy-led, every launch is measurable, and every client has a direct line to the makers."
  },
  {
    label: "Product Docs",
    prompt:
      "Generate a product documentation hub for NovaDrive. Needs quickstart, API reference, changelog, and ‘Deploy to Vercel’ CTA.",
    layout: [
      "Sidebar navigation with section anchors",
      "Quickstart cards for SDKs",
      "Inline code samples with copy buttons",
      "Contextual Vercel deployment banner"
    ],
    copy:
      "NovaDrive ships updates in hours, not weeks. The documentation builder autogenerates code snippets, diagrams, and deployment guides tailored to your stack."
  }
];

const editorPanels = [
  {
    title: "Structure",
    description:
      "Drag, stack, and remix atomic sections. The editor knows responsive design and keeps everything aligned without manual tweaking.",
    action: "Add Section"
  },
  {
    title: "Styling",
    description:
      "Dial your brand identity in seconds. Swap palettes, typography systems, and component tone with AI suggestions derived from your assets.",
    action: "Generate Theme"
  },
  {
    title: "Copy",
    description:
      "Never start from a blank page. Context-aware copywriting adapts voice and length across your entire site with one edit.",
    action: "Rewrite Page"
  }
];

const deploymentSteps = [
  {
    title: "Preview",
    detail:
      "Every edit is live in your staging environment. Share links with stakeholders and capture feedback inline before launch."
  },
  {
    title: "Optimize",
    detail:
      "Performance, accessibility, and SEO checks run automatically. Resolve suggestions with one-click fixes powered by AI."
  },
  {
    title: "Deploy",
    detail:
      "Connect your Vercel account once. Push to production or create a preview branch directly from the editor with audit logs included."
  }
];

export default function Home() {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const activePrompt = promptPreviews[activePromptIndex];
  const [activePanel, setActivePanel] = useState(editorPanels[0].title);

  const activePanelDescription = useMemo(
    () => editorPanels.find((panel) => panel.title === activePanel)?.description,
    [activePanel]
  );

  const activePanelAction = useMemo(
    () => editorPanels.find((panel) => panel.title === activePanel)?.action ?? "",
    [activePanel]
  );

  return (
    <div className="min-h-screen bg-[#05060f] text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_#3b82f680,_transparent_55%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-32 pt-20 sm:px-10 lg:px-16">
          <header className="flex flex-col gap-10">
            <div className="flex items-center justify-between gap-6">
              <span className="text-sm uppercase tracking-[0.35em] text-blue-300/80">Codex Builder</span>
              <Link
                href="#deploy"
                className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/10 sm:block"
              >
                Deploy to Vercel
              </Link>
            </div>
            <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs uppercase tracking-wide text-blue-200">
                  AI Native Website Builder
                </div>
                <h1 className="text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                  Design, edit, and launch a production-ready site from a single conversation.
                </h1>
                <p className="max-w-xl text-base text-slate-300 sm:text-lg">
                  Codex Builder combines conversational AI with a precision visual editor. Explore layouts, iterate on copy, and ship to Vercel with zero context switching.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="#experience"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_20px_60px_-25px_rgba(148,163,184,0.7)] transition hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    Start building
                  </Link>
                  <Link
                    href="#editor"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/5"
                  >
                    Watch how it works
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
                  <div className="grid gap-2 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>AI generated sections</span>
                      <span>92%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Manual overrides</span>
                      <span>8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
              <div>
                <p className="font-semibold text-white">Production-grade code</p>
                <p>Next.js, Tailwind, and custom components generated with clean version control.</p>
              </div>
              <div>
                <p className="font-semibold text-white">Real-time AI pair design</p>
                <p>Guide the builder with natural language while editing visually in the same canvas.</p>
              </div>
              <div>
                <p className="font-semibold text-white">Vercel native deployments</p>
                <p>Provision preview or production deployments without leaving the editor.</p>
              </div>
            </div>
          </header>

          <section id="experience" className="space-y-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-blue-300/70">Conversational build flow</p>
                <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Describe it once. Watch the site take shape.</h2>
              </div>
              <p className="max-w-2xl text-sm text-slate-300 md:text-base">
                Pick a prompt persona and explore the generated structure. Codex Builder instantly drafts layout, copy, and theme suggestions while staying fully editable.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex flex-wrap gap-2">
                  {promptPreviews.map((preview, index) => (
                    <button
                      key={preview.label}
                      onClick={() => setActivePromptIndex(index)}
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        activePromptIndex === index
                          ? "bg-white text-slate-900 shadow"
                          : "bg-white/10 text-white/80 hover:bg-white/20"
                      }`}
                    >
                      {preview.label}
                    </button>
                  ))}
                </div>
                <div className="mt-6 space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-900">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Prompt</p>
                    <p className="mt-3 rounded-xl bg-slate-900/90 p-4 text-slate-100 shadow-inner">
                      “{activePrompt.prompt}”
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Layout plan</p>
                    <ul className="mt-3 space-y-2 text-slate-100/90">
                      {activePrompt.layout.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-blue-500/10 p-4 text-sm text-slate-100">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-blue-200">AI copy draft</p>
                    <p className="mt-3 leading-relaxed text-slate-100/90">{activePrompt.copy}</p>
                  </div>
                </div>
              </div>
              <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-blue-900/40 p-6">
                <div>
                  <p className="text-sm font-semibold text-white">Always-on co-designer</p>
                  <p className="mt-3 text-sm text-slate-300">
                    Combine AI suggestions with pixel-perfect control. Accept, tweak, or regenerate in seconds.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/60 p-5 text-sm text-slate-200 shadow-xl">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Snapshot</p>
                  <p className="mt-4 text-lg font-semibold text-white">Three-click publishing workflow</p>
                  <ul className="mt-4 space-y-3 text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-200">1</span>
                      <span>Approve generated sections and drag in your library components.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-200">2</span>
                      <span>Switch to edit mode to finesse interactions, animations, and responsive behavior.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-200">3</span>
                      <span>Send to Vercel for zero-config deployment with instant rollbacks.</span>
                    </li>
                  </ul>
                </div>
                <div className="text-xs text-slate-400">
                  <p>“Codex Builder lets our product team ship new microsites on the same day we dream them up.”</p>
                  <p className="mt-2 text-white">— Mia Chen, Director of Brand at Signalist</p>
                </div>
              </div>
            </div>
          </section>

          <section id="editor" className="space-y-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-blue-300/70">Visual editor</p>
                <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">A canvas that respects your intent.</h2>
              </div>
              <p className="max-w-2xl text-sm text-slate-300 md:text-base">
                Swap between AI and manual controls without losing context. Codex Builder auto-generates production-ready components that you can override with smart defaults.
              </p>
            </div>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div className="space-y-4">
                {editorPanels.map((panel) => (
                  <button
                    key={panel.title}
                    onClick={() => setActivePanel(panel.title)}
                    className={`w-full rounded-2xl border p-5 text-left transition ${
                      activePanel === panel.title
                        ? "border-blue-400 bg-blue-500/10 text-white shadow"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <p className="text-lg font-semibold">{panel.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {panel.description}
                    </p>
                  </button>
                ))}
              </div>
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 shadow-[0_40px_120px_-60px_rgba(56,189,248,0.6)]">
                <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                    <span>Realtime Editor</span>
                    <span>{activePanel}</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/60 p-5 text-slate-100">
                    <p className="text-sm font-semibold">{activePanel}</p>
                    <p className="mt-3 text-sm text-slate-300">{activePanelDescription}</p>
                    <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-400">
                      {activePanelAction}
                    </button>
                  </div>
                  <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-xs text-slate-300">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Version history</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3 text-slate-200">
                        <span>Landing page refresh</span>
                        <span>Just now</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-slate-900/50 px-4 py-3">
                        <span>Accessibility fixes</span>
                        <span>8 min ago</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-slate-900/40 px-4 py-3">
                        <span>Brand palette sync</span>
                        <span>22 min ago</span>
                      </div>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Live collaboration</p>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {["ME", "MC", "YA"].map((initials) => (
                          <span
                            key={initials}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] font-semibold text-white"
                          >
                            {initials}
                          </span>
                        ))}
                      </div>
                      <span className="text-slate-400">3 collaborators adjusting animations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="deploy" className="space-y-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-blue-300/70">Ship in sync</p>
                <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Deploy to Vercel without breaking your flow.</h2>
              </div>
              <p className="max-w-2xl text-sm text-slate-300 md:text-base">
                Codex Builder ships with a secure Vercel integration so you can preview, QA, and push to production directly from the editor. No repos to connect, no CI scripts to babysit.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                  <span>Deployment timeline</span>
                  <span>Today</span>
                </div>
                <div className="mt-6 space-y-6">
                  {deploymentSteps.map((step, index) => (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/40 bg-blue-500/10 text-sm font-semibold text-blue-100">
                        {index + 1}
                      </div>
                      <div className="space-y-2">
                        <p className="text-base font-semibold text-white">{step.title}</p>
                        <p className="text-sm text-slate-300">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-blue-400/40 bg-gradient-to-br from-blue-600/40 via-blue-500/20 to-cyan-500/20 p-6">
                <div>
                  <p className="text-sm font-semibold text-white">Vercel integration</p>
                  <p className="mt-3 text-sm text-slate-200">
                    Trigger previews on every conversation turn or schedule automated releases with confidence checks baked in.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-black/60 p-5 text-sm text-slate-100">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">Live status</p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-slate-900/80 px-4 py-3">
                      <span className="text-slate-200">vercel.app</span>
                      <span className="text-emerald-300">Operational</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3">
                      <span className="text-slate-200">preview.codex.build</span>
                      <span className="text-amber-200">Queued</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-900/60 px-4 py-3">
                      <span className="text-slate-200">staging.codex.build</span>
                      <span className="text-slate-400">Idle</span>
                    </div>
                  </div>
                  <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow hover:bg-blue-50">
                    Connect Vercel Workspace
                  </button>
                </div>
                <div className="text-xs text-slate-200">
                  SOC 2 Type II compliant • Role-based access control • One-click rollbacks
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-blue-300/70">Pricing that scales</p>
                <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Launch your next idea today.</h2>
              </div>
              <p className="max-w-2xl text-sm text-slate-300 md:text-base">
                Choose the plan that meets your team where you are. Every subscription includes unlimited AI generations, smart collaboration, and Vercel deploys.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  name: "Creator",
                  price: "$29",
                  cadence: "per month",
                  highlights: [
                    "Unlimited AI site generations",
                    "One workspace",
                    "Export clean Next.js code"
                  ]
                },
                {
                  name: "Team",
                  price: "$79",
                  cadence: "per month",
                  highlights: [
                    "Shared component libraries",
                    "Version history & comments",
                    "Automatic Vercel preview deploys"
                  ],
                  featured: true
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  cadence: "",
                  highlights: [
                    "Dedicated AI fine-tuning",
                    "SSO & compliance reports",
                    "Guaranteed launch support"
                  ]
                }
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-3xl border p-6 transition ${
                    plan.featured
                      ? "border-blue-400 bg-blue-500/10 shadow-xl"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-white">{plan.name}</p>
                    {plan.featured && (
                      <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.4em] text-white">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-4 flex items-baseline gap-2 text-4xl font-semibold text-white">
                    {plan.price}
                    <span className="text-sm font-normal text-slate-300">{plan.cadence}</span>
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-200">
                    {plan.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-300" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
                      plan.featured
                        ? "bg-white text-slate-900 hover:bg-slate-100"
                        : "border border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    {plan.featured ? "Start free trial" : "Talk to us"}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <footer className="border-t border-white/10 pt-10 text-sm text-slate-500">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Codex Builder. Crafted for teams who ship fast.</p>
              <div className="flex gap-4 text-xs uppercase tracking-[0.3em]">
                <Link href="#experience" className="text-slate-400 transition hover:text-white">
                  Features
                </Link>
                <Link href="#deploy" className="text-slate-400 transition hover:text-white">
                  Deploy
                </Link>
                <Link href="#" className="text-slate-400 transition hover:text-white">
                  Docs
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
