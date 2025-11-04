import { NextRequest, NextResponse } from "next/server";
import { createWorkspace, listWorkspaces } from "@/daytona/server";

export async function GET() {
  const rows = await listWorkspaces();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const args = await req.json();
  const ws = await createWorkspace(args);
  return NextResponse.json(ws);
}
