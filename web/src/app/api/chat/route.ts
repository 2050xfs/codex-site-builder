import { NextRequest, NextResponse } from "next/server";
import { tools } from "@/agents/tools";
import type { CodeWriterArgs, RepoSpec } from "@/agents/types";
import { zipRepoToBase64 } from "@/lib/zip";
import { shortId } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { siteId, message, currentRepo } = await req.json();

    if (!siteId || !message) {
      return NextResponse.json({ error: "siteId and message are required" }, { status: 400 });
    }

    // TODO: In a real implementation, this would:
    // 1. Use an LLM to understand the user's request
    // 2. Generate appropriate diffs to modify the repo
    // 3. Apply the diffs using code_writer
    // 4. Optionally deploy the updated version

    // For now, we'll simulate the process with intelligent responses
    const repo: RepoSpec = currentRepo || { files: [] };

    // Generate a more contextual response based on the message
    let response = "";
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("color") || lowerMessage.includes("colour")) {
      response = "I've updated the color scheme on your site. The changes should be visible in the preview now!";
    } else if (lowerMessage.includes("header") || lowerMessage.includes("nav")) {
      response = "I've modified the header/navigation. Check the preview to see the updates!";
    } else if (lowerMessage.includes("button") || lowerMessage.includes("cta")) {
      response = "I've updated the buttons and call-to-action elements. The preview has been refreshed!";
    } else if (lowerMessage.includes("text") || lowerMessage.includes("content")) {
      response = "I've updated the text content on your site. Take a look at the preview!";
    } else if (lowerMessage.includes("add") || lowerMessage.includes("create")) {
      response = "I've added the new element you requested. You can see it in the preview!";
    } else if (lowerMessage.includes("remove") || lowerMessage.includes("delete")) {
      response = "I've removed that element from your site. The preview has been updated!";
    } else if (lowerMessage.includes("fix") || lowerMessage.includes("error")) {
      response = "I've fixed the issue you mentioned. The site should be working correctly now!";
    } else {
      response = `I understand you want to: "${message}". I've made those changes to your site. Check the preview to see the updates!`;
    }

    // Apply changes (simplified - in reality would use code_writer with diffs)
    const updatedRepo = await tools.code_writer.execute({
      repo,
      // In a real implementation, diffs would be generated from the LLM response
    } as CodeWriterArgs);

    // Optionally deploy the updated version
    // For now, we'll just return the updated repo structure
    const b64 = await zipRepoToBase64(updatedRepo.files);

    return NextResponse.json({
      response,
      repo: updatedRepo,
      repoZipBase64: b64,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process chat message" },
      { status: 500 }
    );
  }
}

