import { NextRequest, NextResponse } from "next/server";
import { getWorkspace, stopWorkspace } from "@/daytona/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const ws = await getWorkspace(params.id);
  return NextResponse.json(ws);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const ws = await stopWorkspace(params.id);
  return NextResponse.json(ws);
}
