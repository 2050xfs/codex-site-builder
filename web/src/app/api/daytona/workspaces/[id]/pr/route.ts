import { NextRequest, NextResponse } from "next/server";
import { openPullRequest } from "@/daytona/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const pr = await openPullRequest({ workspaceId: id, ...body });
  return NextResponse.json(pr);
}
