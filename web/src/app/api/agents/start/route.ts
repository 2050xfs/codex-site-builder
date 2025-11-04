import { NextRequest, NextResponse } from "next/server";
import { runManager } from "@/agents/manager";
import { storeSite } from "@/app/api/preview/[siteId]/route";

export async function POST(req: NextRequest) {
  try {
    const { siteId, brief, goals, pagesHint, brandHint, preview } = await req.json();
    const res = await runManager({ siteId, brief, goals, pagesHint, brandHint, preview: preview ?? true });
    
    // Store the generated repo for preview
    if (res.repo) {
      storeSite(siteId, res.repo);
    }
    
    return NextResponse.json(res);
  } catch (error) {
    console.error("Agent start error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start agent" },
      { status: 500 }
    );
  }
}
