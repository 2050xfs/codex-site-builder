"use client";

import { useState, useCallback } from "react";
import { PromptInput } from "./PromptInput";
import { ChatPanel, type Message } from "./ChatPanel";
import { PreviewPanel } from "./PreviewPanel";
import { shortId } from "@/lib/utils";

type ViewState = "prompt" | "building" | "chat";

export function SiteBuilder() {
  const [viewState, setViewState] = useState<ViewState>("prompt");
  const [siteId, setSiteId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRepo, setCurrentRepo] = useState<any>(null);

  const handleInitialPrompt = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setViewState("building");
    const newSiteId = shortId();
    setSiteId(newSiteId);

    // Add user message immediately
    const userMessage: Message = {
      id: shortId(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };
    setMessages([userMessage]);

    // Add building message
    const buildingMessage: Message = {
      id: shortId(),
      role: "assistant",
      content: "🚀 Starting to build your site... This may take a moment.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, buildingMessage]);

    try {
      // Show progress updates
      const progressMessages = [
        "📋 Planning your site structure...",
        "⚙️ Scaffolding the codebase...",
        "💻 Writing the code...",
        "✅ Running quality checks...",
        "🚀 Deploying your site...",
      ];

      let progressIndex = 0;
      const progressInterval = setInterval(() => {
        if (progressIndex < progressMessages.length) {
          const progressMsg: Message = {
            id: shortId(),
            role: "assistant",
            content: progressMessages[progressIndex],
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, progressMsg]);
          progressIndex++;
        }
      }, 2000);

      const response = await fetch("/api/agents/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: newSiteId,
          brief: prompt,
          preview: true,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`Build failed: ${response.statusText}`);
      }

      const data = await response.json();
      // Use the preview URL from the response, or construct it from siteId
      const previewUrl = data.vercelUrl || `/api/preview/${newSiteId}`;
      setPreviewUrl(previewUrl);

      // Add success message
      const successMessage: Message = {
        id: shortId(),
        role: "assistant",
        content: `✅ Your site is ready! I've deployed it to ${data.vercelUrl || "the preview URL"}. You can now chat with me to make any changes you'd like.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);

      setViewState("chat");
    } catch (error) {
      console.error("Build error:", error);
      const errorMessage: Message = {
        id: shortId(),
        role: "assistant",
        content: `❌ Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again with a different prompt.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setViewState("chat");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChatMessage = useCallback(async (message: string) => {
    if (!siteId) return;

    const userMessage: Message = {
      id: shortId(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          message,
          currentRepo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.statusText}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: shortId(),
        role: "assistant",
        content: data.response || "I've made those changes to your site. Check the preview!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentRepo(data.repo || currentRepo);

      // If we got a new deployment URL, update it
      if (data.vercelUrl) {
        setPreviewUrl(data.vercelUrl);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: shortId(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [siteId, currentRepo]);

  if (viewState === "prompt") {
    return <PromptInput onSubmit={handleInitialPrompt} isLoading={isLoading} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/3 min-w-[400px] max-w-[500px]">
        <ChatPanel
          messages={messages}
          onSendMessage={handleChatMessage}
          isLoading={isLoading}
        />
      </div>
      <div className="flex-1">
        <PreviewPanel previewUrl={previewUrl || undefined} isLoading={isLoading} />
      </div>
    </div>
  );
}

