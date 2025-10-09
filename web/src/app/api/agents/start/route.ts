import { NextRequest, NextResponse } from "next/server";
import { runManager } from "@/agents/manager";

export async function POST(req: NextRequest) {
  const { siteId, brief, goals, pagesHint, brandHint, preview } = await req.json();
  const res = await runManager({ siteId, brief, goals, pagesHint, brandHint, preview: preview ?? true });
  return NextResponse.json(res);
}
