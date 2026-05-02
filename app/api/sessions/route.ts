import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { shuffle } from "@/lib/utils";
type Difficulty = "easy" | "medium" | "hard";

export async function POST(req: NextRequest) {
  const { testSlug, sectionCode, mode, difficulty, count } = await req.json();

  const test = await prisma.test.findUnique({
    where: { slug: testSlug },
    include: { sections: true },
  });
  if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });

  type QuestionResult = Awaited<ReturnType<typeof prisma.question.findMany<{ include: { answers: true; section: { select: { code: true; name: true } } } }>>>;
  let questions: QuestionResult | undefined;

  type SectionRow = typeof test.sections[number];

  if (mode === "full") {
    const allQ: QuestionResult = [];
    for (const section of test.sections) {
      const sectionQs = await prisma.question.findMany({
        where: { sectionId: section.id },
        include: { answers: true, section: { select: { code: true, name: true } } },
      });
      const shuffled = shuffle(sectionQs).slice(0, section.questionCount);
      allQ.push(...shuffled);
    }
    questions = allQ;
  } else if (mode === "section" && sectionCode) {
    const section = test.sections.find((s: SectionRow) => s.code === sectionCode);
    if (!section) return NextResponse.json({ error: "Section not found" }, { status: 404 });
    const sectionQs = await prisma.question.findMany({
      where: { sectionId: section.id },
      include: { answers: true, section: { select: { code: true, name: true } } },
    });
    questions = shuffle(sectionQs).slice(0, section.questionCount);
  } else if (mode === "quiz") {
    const qCount = Math.min(count || 20, 50);
    const where: Record<string, unknown> = {};
    if (sectionCode) {
      const section = test.sections.find((s: SectionRow) => s.code === sectionCode);
      if (section) where.sectionId = section.id;
    } else {
      where.section = { testId: test.id };
    }
    if (difficulty) where.difficulty = difficulty as Difficulty;

    const allQs = await prisma.question.findMany({
      where,
      include: { answers: true, section: { select: { code: true, name: true } } },
    });
    questions = shuffle(allQs).slice(0, qCount);
  } else {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: "No questions found" }, { status: 404 });
  }

  // Shuffle answer order for each question
  type QuestionRow = QuestionResult[number];
  const questionsWithShuffledAnswers = questions.map((q: QuestionRow) => ({
    ...q,
    answers: shuffle(q.answers),
  }));

  // Create session and session answers separately (HTTP mode doesn't support nested transactions)
  const session = await prisma.testSession.create({
    data: {
      testId: test.id,
      sectionCode: sectionCode || null,
      mode,
      difficulty: (difficulty as Difficulty) || null,
      totalQ: questions.length,
    },
  });

  await prisma.sessionAnswer.createMany({
    data: questions.map((q: QuestionRow) => ({ sessionId: session.id, questionId: q.id })),
  });

  return NextResponse.json({ sessionId: session.id, questions: questionsWithShuffledAnswers });
}
