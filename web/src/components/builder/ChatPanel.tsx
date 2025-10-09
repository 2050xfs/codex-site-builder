"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

type ChatRole = "user" | "assistant" | "system";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type TimelineEntry = {
  id: string;
  kind: "status" | "diff" | "error";
  message: string;
  diffPath?: string;
  diffContent?: string;
};

type StreamPayload =
  | { type: "status"; message: string }
  | { type: "diff"; message: string; diff: { path: string; content: string } }
  | {
      type: "complete";
      message: string;
      reply: { role: "assistant"; content: string };
      diffs: { path: string; content: string }[];
    }
  | { type: "error"; message: string };

type ChatPanelProps = {
  siteId: string;
  initialMessages?: ChatMessage[];
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
};

export default function ChatPanel({ siteId, initialMessages }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initialMessages && initialMessages.length > 0
      ? initialMessages
      : [
          {
            id: createId(),
            role: "assistant",
            content:
              "I'm ready to help iterate on your site. Share feedback or tasks and I'll apply them.",
          },
        ]
  );
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messageContainerRef.current;

    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const renderedTimeline = useMemo(
    () =>
      timeline.map((entry) => (
        <li
          key={entry.id}
          className="rounded border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200"
        >
          <p className="font-medium">
            {entry.kind === "status" && "Status"}
            {entry.kind === "diff" && "Applied diff"}
            {entry.kind === "error" && "Error"}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-slate-300">{entry.message}</p>
          {entry.kind === "diff" && entry.diffPath ? (
            <details className="mt-2 rounded border border-slate-800 bg-slate-950/60 p-2">
              <summary className="cursor-pointer text-xs uppercase tracking-wide text-slate-400">
                {entry.diffPath}
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-300">
                {entry.diffContent}
              </pre>
            </details>
          ) : null}
        </li>
      )),
    [timeline]
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isSending) {
        return;
      }

      const trimmed = input.trim();

      if (trimmed.length === 0) {
        setError("Please provide a message before sending.");
        return;
      }

      setError(null);

      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        content: trimmed,
      };

      const payloadMessages = [...messages, userMessage].map((message) => ({
        role: message.role,
        content: message.content,
      }));

      setMessages((previous) => [...previous, userMessage]);
      setTimeline((previous) => [
        ...previous,
        {
          id: createId(),
          kind: "status",
          message: "Sending request to the editor agent…",
        },
      ]);
      setIsSending(true);
      setInput("");

      try {
        const response = await fetch("/api/editor/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ siteId, messages: payloadMessages }),
        });

        if (!response.ok) {
          let message = "The editor agent was unable to process your request.";

          try {
            const result = await response.json();
            if (result?.error) {
              message = String(result.error);
            }
          } catch {
            try {
              message = await response.text();
            } catch {
              // Ignore parsing errors and use the fallback message.
            }
          }

          setTimeline((previous) => [
            ...previous,
            {
              id: createId(),
              kind: "error",
              message,
            },
          ]);
          setError(message);
          return;
        }

        if (!response.body) {
          const message = "The server did not return a response body.";
          setTimeline((previous) => [
            ...previous,
            {
              id: createId(),
              kind: "error",
              message,
            },
          ]);
          setError(message);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantReply: ChatMessage | null = null;

        const handlePayload = (payload: StreamPayload) => {
          if (payload.type === "status") {
            setTimeline((previous) => [
              ...previous,
              {
                id: createId(),
                kind: "status",
                message: payload.message,
              },
            ]);
          } else if (payload.type === "diff") {
            setTimeline((previous) => [
              ...previous,
              {
                id: createId(),
                kind: "diff",
                message: payload.message,
                diffPath: payload.diff.path,
                diffContent: payload.diff.content,
              },
            ]);
          } else if (payload.type === "complete") {
            setTimeline((previous) => [
              ...previous,
              {
                id: createId(),
                kind: "status",
                message: payload.message,
              },
            ]);

            assistantReply = {
              id: createId(),
              role: payload.reply.role,
              content: payload.reply.content,
            };
          } else if (payload.type === "error") {
            setTimeline((previous) => [
              ...previous,
              {
                id: createId(),
                kind: "error",
                message: payload.message,
              },
            ]);
            setError(payload.message);
          }
        };

        const processBuffer = () => {
          let boundary = buffer.indexOf("\n\n");

          while (boundary !== -1) {
            const rawEvent = buffer.slice(0, boundary).trim();
            buffer = buffer.slice(boundary + 2);

            if (rawEvent.length > 0) {
              const dataLine = rawEvent
                .split("\n")
                .find((line) => line.startsWith("data:"));

              if (dataLine) {
                const json = dataLine.replace(/^data:\s*/, "");

                try {
                  const parsed = JSON.parse(json) as StreamPayload;
                  handlePayload(parsed);
                } catch {
                  setTimeline((previous) => [
                    ...previous,
                    {
                      id: createId(),
                      kind: "error",
                      message: "Received malformed data from the server.",
                    },
                  ]);
                }
              }
            }

            boundary = buffer.indexOf("\n\n");
          }
        };

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            buffer += decoder.decode();
            processBuffer();
            break;
          }

          if (value) {
            buffer += decoder.decode(value, { stream: true });
            processBuffer();
          }
        }

        if (assistantReply) {
          setMessages((previous) => [...previous, assistantReply]);
        }
      } catch (networkError) {
        const message =
          networkError instanceof Error
            ? networkError.message
            : "Failed to connect to the editor agent.";

        setTimeline((previous) => [
          ...previous,
          {
            id: createId(),
            kind: "error",
            message,
          },
        ]);
        setError(message);
      } finally {
        setIsSending(false);
      }
    },
    [input, isSending, messages, siteId]
  );

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-900/80 p-4">
        <h2 className="text-lg font-semibold text-slate-100">Editor chat</h2>
        <div
          ref={messageContainerRef}
          className="flex max-h-80 flex-col gap-3 overflow-y-auto pr-1"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[80%] rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
                  : "mr-auto max-w-[80%] rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-100"
              }
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-sm font-medium text-slate-200" htmlFor="chat-input">
          New request
        </label>
        <textarea
          id="chat-input"
          name="message"
          className="min-h-24 w-full resize-y rounded border border-slate-800 bg-slate-950 p-3 text-sm text-slate-100 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Describe the change you'd like to make…"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={isSending}
          required
        />
        {error ? (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Messages are routed to the editor agent responsible for {siteId}.
          </p>
          <button
            type="submit"
            disabled={isSending}
            className="rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>

      <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Timeline
        </h3>
        {timeline.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">
            Status updates will appear here as the editor processes your request.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">{renderedTimeline}</ul>
        )}
      </div>
    </div>
  );
}
