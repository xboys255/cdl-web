export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestClient } from "./TestClient";

interface Props {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<Record<string, string>>;
}

export default async function TestPage({ params, searchParams: _sp }: Props) {
  const { sessionId } = await params;

  const session = await prisma.testSession.findUnique({
    where: { id: sessionId },
    include: {
      test: { select: { name: true, timeLimit: true } },
      answers: {
        include: {
          question: {
            include: {
              answers: true,
              section: { select: { code: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!session) notFound();

  type AnswerRow = NonNullable<typeof session>["answers"][number];

  if (session.submittedAt) {
    // Already submitted — redirect to results
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">This test has already been submitted.</p>
          <a href={`/results/${sessionId}`} className="text-orange-600 underline">View Results</a>
        </div>
      </div>
    );
  }

  // Deterministic shuffle so answer order is consistent across page reloads
  // but different for each question (seeded by sessionId + questionId)
  function seededShuffle<T>(arr: T[], seed: number): T[] {
    const a = [...arr];
    let s = seed >>> 0;
    for (let i = a.length - 1; i > 0; i--) {
      s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
      s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
      s = s ^ (s >>> 16);
      const j = (s >>> 0) % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function strHash(str: string): number {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  const questions = session.answers.map((sa: AnswerRow) => ({
    ...sa.question,
    answers: seededShuffle(sa.question.answers, strHash(sessionId + sa.questionId)),
  }));

  // Restore previously selected answers so they show on reload
  const savedAnswers: Record<string, string> = {};
  for (const sa of session.answers) {
    if (sa.answerId) savedAnswers[sa.questionId] = sa.answerId;
  }

  // Compute elapsed seconds so the timer can account for time already used
  const elapsedSeconds = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000);

  return (
    <TestClient
      sessionId={sessionId}
      questions={questions}
      testName={session.test.name}
      timeLimitSeconds={Math.max(0, session.test.timeLimit * 60 - elapsedSeconds)}
      savedAnswers={savedAnswers}
    />
  );
}
