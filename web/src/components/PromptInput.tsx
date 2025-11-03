"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Upflex AutoSite Builder
          </h1>
          <p className="text-xl text-muted-foreground">
            Describe your website and watch it come to life
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a modern landing page for a SaaS product that helps teams collaborate. Include a hero section, features, pricing, and testimonials..."
              className="w-full min-h-[200px] px-6 py-4 text-lg border-2 border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
                Generating...
              </>
            ) : (
              "Create Site"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>Powered by AI agents that handle planning, coding, and deployment</p>
        </div>
      </div>
    </div>
  );
}

