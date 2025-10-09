"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GenerationResult, GenerationStatus } from "./GenerationStepper";

type PromptFormValues = {
  projectName: string;
  summary: string;
  goals: string;
};

interface PromptFormProps {
  onStatusChange?: (status: GenerationStatus) => void;
  onComplete?: (result: GenerationResult) => void;
  onError?: (message: string | null) => void;
}

export function PromptForm({ onStatusChange, onComplete, onError }: PromptFormProps) {
  const [values, setValues] = React.useState<PromptFormValues>({
    projectName: "",
    summary: "",
    goals: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  function updateValue<Key extends keyof PromptFormValues>(key: Key, value: PromptFormValues[Key]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);
    onError?.(null);
    setIsSubmitting(true);
    onStatusChange?.("pending");

    // Allow the pending state to render before showing running
    requestAnimationFrame(() => onStatusChange?.("running"));

    try {
      const response = await fetch("/api/agents/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to start generation");
      }

      const payload = (await response.json()) as GenerationResult;
      onStatusChange?.("complete");
      onComplete?.(payload);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong while starting the build.";
      setErrorMessage(message);
      onStatusChange?.("error");
      onError?.(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
        <CardHeader>
          <CardTitle>Describe your build</CardTitle>
          <CardDescription>
            Share the essentials so AutoSite can craft a tailored marketing experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Project name</span>
            <input
              className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-foreground/40"
              type="text"
              name="projectName"
              value={values.projectName}
              onChange={(event) => updateValue("projectName", event.target.value)}
              placeholder="e.g. Atlas AI Launch"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Brand & offering</span>
            <textarea
              className="min-h-[96px] rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-foreground/40"
              name="summary"
              value={values.summary}
              onChange={(event) => updateValue("summary", event.target.value)}
              placeholder="What makes this launch unique? Include voice, audience, and product pillars."
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Goals for this site</span>
            <textarea
              className="min-h-[96px] rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground shadow-inner focus:outline-none focus:ring-2 focus:ring-foreground/40"
              name="goals"
              value={values.goals}
              onChange={(event) => updateValue("goals", event.target.value)}
              placeholder="Outline the outcomes you want AutoSite to drive."
            />
          </label>
          {errorMessage ? (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-3 border-t border-foreground/10 text-left sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-foreground/60">
            Press <kbd className="rounded border border-foreground/20 bg-background px-1 py-0.5 text-[10px] uppercase tracking-wide">Enter</kbd> or use the button below.
          </p>
          <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} aria-live="polite">
            {isSubmitting ? "Starting build…" : "Generate with AutoSite"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
