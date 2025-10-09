import { cn } from "@/lib/utils";

export type GenerationStatus = "idle" | "pending" | "running" | "complete" | "error";

export interface GenerationResult {
  previewUrl?: string;
  deploymentId?: string;
  message?: string;
}

const steps: Array<{ key: Exclude<GenerationStatus, "idle" | "error">; label: string; description: string }> = [
  {
    key: "pending",
    label: "Queued",
    description: "Preparing the AutoSite agents",
  },
  {
    key: "running",
    label: "Generating",
    description: "Building your tailored site",
  },
  {
    key: "complete",
    label: "Ready",
    description: "Preview or handoff your build",
  },
];

interface GenerationStepperProps {
  status: GenerationStatus;
  result?: GenerationResult | null;
  error?: string | null;
}

export function GenerationStepper({ status, result, error }: GenerationStepperProps) {
  return (
    <div className="space-y-4" aria-live="polite">
      <ol className="space-y-3">
        {steps.map((step, index) => {
          const isActive = status === step.key;
          const isComplete =
            status === "complete" || steps.findIndex((s) => s.key === status) > index;
          return (
            <li key={step.key} className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  isComplete
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                    : isActive
                      ? "border-foreground bg-foreground/10 text-foreground"
                      : "border-foreground/20 text-foreground/60",
                )}
                aria-hidden
              >
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{step.label}</p>
                <p className="text-xs text-foreground/70">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
      {status === "complete" && result ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-600">
          {result.previewUrl ? (
            <p>
              Preview ready: {" "}
              <a
                href={result.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-4"
              >
                Open preview
              </a>
            </p>
          ) : result.deploymentId ? (
            <p>Deployment prepared (ID: {result.deploymentId})</p>
          ) : (
            <p>{result.message ?? "Your build is ready."}</p>
          )}
        </div>
      ) : null}
      {status === "error" && error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-600" role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}
