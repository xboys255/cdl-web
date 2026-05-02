import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const urlDiag = dbUrl
    ? `set (starts with: ${dbUrl.slice(0, 20)}...)`
    : "MISSING";

  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.test.count();
    return NextResponse.json({ ok: true, tests: count, db: "connected", urlDiag });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg, urlDiag }, { status: 500 });
  }
}
