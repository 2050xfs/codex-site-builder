import { NextRequest, NextResponse } from "next/server";
import { openPullRequest } from "@/daytona/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const pr = await openPullRequest({ workspaceId: params.id, ...body });
  return NextResponse.json(pr);
}
