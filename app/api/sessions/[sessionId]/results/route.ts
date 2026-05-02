import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeScore } from "@/lib/scoring";
import type { SectionScores } from "@/lib/scoring";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const session = await prisma.testSession.findUnique({
    where: { id: sessionId },
    include: {
      test: true,
      answers: {
        include: {
          question: {
            include: {
              answers: true,
              section: { select: { code: true, name: true } },
            },
          },
          answer: true,
        },
      },
    },
  });

  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  type AnswerRow = NonNullable<typeof session>["answers"][number];

  const sectionScores: SectionScores = {};

  for (const sa of session.answers) {
    const code = sa.question.section.code;
    if (!sectionScores[code]) sectionScores[code] = { correct: 0, total: 0 };
    sectionScores[code].total++;
    const correctAnswer = sa.question.answers.find((a: { id: string; isCorrect: boolean }) => a.isCorrect);
    if (sa.answerId && sa.answerId === correctAnswer?.id) {
      sectionScores[code].correct++;
    }
  }

  const scoreReport = computeScore(sectionScores);

  return NextResponse.json({
    session: {
      id: session.id,
      testName: session.test.name,
      mode: session.mode,
      startedAt: session.startedAt,
      submittedAt: session.submittedAt,
      totalQ: session.totalQ,
    },
    scoreReport,
    answers: session.answers.map((sa: AnswerRow) => ({
      questionId: sa.questionId,
      questionText: sa.question.text,
      explanation: sa.question.explanation,
      sectionCode: sa.question.section.code,
      sectionName: sa.question.section.name,
      selectedAnswerId: sa.answerId,
      answers: sa.question.answers,
      isCorrect: sa.question.answers.find((a: { id: string; isCorrect: boolean }) => a.isCorrect)?.id === sa.answerId,
    })),
  });
}
