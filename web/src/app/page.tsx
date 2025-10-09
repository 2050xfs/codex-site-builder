"use client";

import { useMemo, useState } from "react";
import ChatPanel from "@/components/builder/ChatPanel";

const generationSteps = [
  "Scaffolding initial site",
  "Configuring deployment preview",
  "Running quality checks",
  "Finalising hand-off to operators",
];

export default function Home() {
  const [generationComplete, setGenerationComplete] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const siteId = "demo-site";

  const stepLabels = useMemo(
    () =>
      generationSteps.map((label, index) => ({
        label,
        status:
          generationComplete || index < activeStep
            ? "complete"
            : index === activeStep
              ? "running"
              : "pending",
      })),
    [generationComplete, activeStep]
  );

  const advanceGeneration = () => {
    setActiveStep((previous) => {
      const next = Math.min(previous + 1, generationSteps.length - 1);
      if (next === generationSteps.length - 1) {
        setGenerationComplete(true);
      }
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Site builder</h1>
          <p className="text-sm text-slate-400">
            Monitor generation progress and iterate on the deployed preview without leaving the
            builder UI.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-6 rounded-xl border border-slate-900 bg-slate-950/80 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Deployment preview</h2>
              {!generationComplete ? (
                <button
                  type="button"
                  onClick={advanceGeneration}
                  className="rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
                >
                  {activeStep === generationSteps.length - 1 ? "Mark complete" : "Advance"}
                </button>
              ) : (
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-300">
                  Ready for iteration
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <ol className="space-y-3 text-sm">
                {stepLabels.map((step) => (
                  <li
                    key={step.label}
                    className="flex items-center justify-between rounded border border-slate-900 bg-slate-900/60 px-3 py-2"
                  >
                    <span>{step.label}</span>
                    <span
                      className={
                        step.status === "complete"
                          ? "text-green-400"
                          : step.status === "running"
                            ? "text-blue-400"
                            : "text-slate-500"
                      }
                    >
                      {step.status === "complete"
                        ? "Complete"
                        : step.status === "running"
                          ? "In progress"
                          : "Pending"}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="rounded-lg border border-slate-900 bg-slate-900/60 p-6">
                <h3 className="text-base font-semibold">Preview placeholder</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Deployments are simulated in this sandbox. Use the chat panel to request
                  adjustments and the editor agent will apply them to the generated workspace.
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-xl border border-slate-900 bg-slate-950/80 p-6">
            {generationComplete ? (
              <ChatPanel siteId={siteId} />
            ) : (
              <div className="flex h-full flex-col justify-center gap-4 text-sm text-slate-300">
                <p>
                  The editor chat becomes available once generation finishes. Use the controls on the
                  left to walk through the build steps.
                </p>
                <p className="text-xs text-slate-500">
                  Progress is simulated for demonstration purposes. Once complete, you can iterate on
                  the preview directly from this page.
                </p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
