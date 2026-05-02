import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tests = await prisma.test.findMany({
    include: {
      sections: {
        select: { id: true, code: true, name: true, questionCount: true, timeLimit: true },
      },
      _count: { select: { sessions: true } },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(tests);
}
