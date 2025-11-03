import { NextRequest, NextResponse } from "next/server";
import { getWorkspace, stopWorkspace } from "@/daytona/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ws = await getWorkspace(id);
  return NextResponse.json(ws);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ws = await stopWorkspace(id);
  return NextResponse.json(ws);
}
