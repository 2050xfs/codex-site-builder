"use client";

import Link from "next/link";
import { useState } from "react";
import { GenerationResult, GenerationStatus, GenerationStepper } from "@/components/builder/GenerationStepper";
import { PromptForm } from "@/components/builder/PromptForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const workflow = [
  {
    title: "Collect context",
    description: "Summarize your brand voice, campaign goals, and content pillars in one brief.",
  },
  {
    title: "Coordinate agents",
    description: "AutoSite orchestrates research, design, and copy agents to build in parallel.",
  },
  {
    title: "Review the preview",
    description: "Inspect an interactive staging link before handoff or deployment.",
  },
  {
    title: "Deploy anywhere",
    description: "Export to your stack or push live with a single approval.",
  },
];

export default function Home() {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleStatusChange(next: GenerationStatus) {
    setStatus(next);
    if (next === "pending") {
      setResult(null);
      setError(null);
    }
  }

  function handleComplete(data: GenerationResult) {
    setResult(data);
    setError(null);
  }

  function handleError(message: string | null) {
    setError(message);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-16 sm:px-10 lg:flex-row lg:items-start lg:gap-16 lg:py-24">
        <section className="flex-1 space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
            AutoSite workflow
          </span>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Launch expressive marketing sites in minutes, not sprints.
            </h1>
            <p className="max-w-xl text-base text-foreground/80 sm:text-lg">
              AutoSite blends brand intelligence with production-ready code so teams can move from idea to launch without breaking their rhythm. Provide the brief, and our agentic pipeline delivers polished experiences tuned to your voice.
            </p>
          </div>
          <div className="flex flex-col gap-6 rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-6 shadow-inner sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground/60">
              How it works
            </h2>
            <dl className="grid gap-6 sm:grid-cols-2">
              {workflow.map((step) => (
                <div key={step.title} className="space-y-2">
                  <dt className="text-sm font-medium text-foreground">{step.title}</dt>
                  <dd className="text-sm text-foreground/70">{step.description}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
              <Link
                href="#builder"
                className="rounded-md border border-foreground/20 bg-foreground text-background px-4 py-2 font-medium shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground hover:bg-foreground/90"
              >
                Start building
              </Link>
              <a
                href="mailto:team@autosite.dev"
                className="text-sm font-medium text-foreground/70 underline-offset-4 transition hover:text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                Talk with our team
              </a>
            </div>
          </div>
        </section>
        <section id="builder" className="flex w-full flex-1 flex-col gap-6 pb-10 lg:sticky lg:top-16">
          <PromptForm
            onStatusChange={handleStatusChange}
            onComplete={handleComplete}
            onError={handleError}
          />
          <Card aria-live="polite">
            <CardHeader>
              <CardTitle>Generation status</CardTitle>
              <CardDescription>
                Track each stage while AutoSite assembles your site and delivers a preview link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GenerationStepper status={status} result={result} error={error} />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
