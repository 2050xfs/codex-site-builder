import { NextRequest } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

type ChatRole = "user" | "assistant" | "system";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type AgentDiff = {
  path: string;
  content: string;
  description?: string;
};

type AgentReply = {
  role: "assistant";
  content: string;
};

type AgentResult = {
  reply: AgentReply;
  diffs: AgentDiff[];
};

type StreamPayload =
  | { type: "status"; message: string }
  | { type: "diff"; message: string; diff: AgentDiff }
  | { type: "complete"; message: string; reply: AgentReply; diffs: AgentDiff[] }
  | { type: "error"; message: string };

const encoder = new TextEncoder();

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return Response.json(
      { error: "Request body must be an object." },
      { status: 400 }
    );
  }

  const { siteId, messages } = body as {
    siteId?: unknown;
    messages?: unknown;
  };

  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    return Response.json(
      { error: "`siteId` is required and must be a string." },
      { status: 400 }
    );
  }

  if (!Array.isArray(messages)) {
    return Response.json(
      { error: "`messages` must be an array." },
      { status: 400 }
    );
  }

  const sanitizedMessages: ChatMessage[] = [];

  for (const entry of messages) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const { role, content } = entry as {
      role?: unknown;
      content?: unknown;
    };

    if (typeof content !== "string" || content.trim().length === 0) {
      continue;
    }

    let normalizedRole: ChatRole = "user";

    if (role === "assistant" || role === "system" || role === "user") {
      normalizedRole = role;
    }

    sanitizedMessages.push({ role: normalizedRole, content });
  }

  const stream = new TransformStream<Uint8Array, Uint8Array>();
  const writer = stream.writable.getWriter();

  const push = async (payload: StreamPayload) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
  };

  (async () => {
    try {
      await push({ type: "status", message: "Received chat request." });
      await push({ type: "status", message: "Forwarding conversation to editor agent." });
      await delay(120);

      const agentResult = await simulateAgentConversation(siteId, sanitizedMessages);

      await push({ type: "status", message: "Applying generated file updates." });
      const appliedDiffs = await applyDiffs(siteId, agentResult.diffs);

      for (const diff of appliedDiffs) {
        const description = diff.description ?? `Updated ${diff.path}`;
        await push({ type: "diff", message: description, diff });
      }

      await push({
        type: "complete",
        message: "Editor agent completed the request.",
        reply: agentResult.reply,
        diffs: appliedDiffs,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected server error.";
      await push({ type: "error", message });
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

async function simulateAgentConversation(
  siteId: string,
  messages: ChatMessage[]
): Promise<AgentResult> {
  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  const summary = lastUserMessage?.content ?? "No specific request provided.";
  const sanitizedSite = siteId.replace(/[^a-zA-Z0-9-_]/g, "-");
  const fileName = `${sanitizedSite}-notes.md`;
  const contentLines = [
    `# Update for ${siteId}`,
    "",
    summary.trim(),
    "",
    `Generated at ${new Date().toISOString()}.`,
  ];

  const reply: AgentReply = {
    role: "assistant",
    content: `Documented your latest request in \`${fileName}\`. Let me know if you would like to iterate further.`,
  };

  await delay(180);

  return {
    reply,
    diffs: [
      {
        path: fileName,
        content: contentLines.join("\n"),
        description: `Wrote ${fileName} with the most recent feedback.`,
      },
    ],
  };
}

async function applyDiffs(siteId: string, diffs: AgentDiff[]): Promise<AgentDiff[]> {
  const baseDirectory = path.join(process.cwd(), "data", "sites", siteId);
  await mkdir(baseDirectory, { recursive: true });

  const applied: AgentDiff[] = [];

  for (const diff of diffs) {
    const normalizedPath = path.posix
      .normalize(diff.path.replace(/\\/g, "/"))
      .replace(/^\.\/?/, "");

    if (normalizedPath.startsWith("..")) {
      throw new Error("Diff paths may not traverse outside of the site directory.");
    }

    const targetPath = path.join(baseDirectory, normalizedPath);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, diff.content, "utf8");

    applied.push({ ...diff, path: normalizedPath });
  }

  return applied;
}

function delay(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });
}

