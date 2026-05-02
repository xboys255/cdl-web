import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const session = await prisma.testSession.update({
    where: { id: sessionId },
    data: { submittedAt: new Date() },
  });

  return NextResponse.json({ ok: true, submittedAt: session.submittedAt });
}
