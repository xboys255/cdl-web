import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const { questionId, answerId } = await req.json();

  await prisma.sessionAnswer.upsert({
    where: { sessionId_questionId: { sessionId, questionId } },
    update: { answerId },
    create: { sessionId, questionId, answerId },
  });

  return NextResponse.json({ ok: true });
}
