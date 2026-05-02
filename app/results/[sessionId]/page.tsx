export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeScore } from "@/lib/scoring";
import { pct } from "@/lib/utils";
import type { SectionScores } from "@/lib/scoring";
import { ReviewSection } from "./ReviewSection";
import { AdSlot } from "@/components/ui/AdSlot";
import Link from "next/link";

interface Props { params: Promise<{ sessionId: string }> }

export default async function ResultsPage({ params }: Props) {
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

  if (!session) notFound();

  type AnswerRow = NonNullable<typeof session>["answers"][number];

  const sectionScores: SectionScores = {};
  for (const sa of session.answers) {
    const code = sa.question.section.code;
    if (!sectionScores[code]) sectionScores[code] = { correct: 0, total: 0 };
    sectionScores[code].total++;
    const correct = sa.question.answers.find((a: { id: string; isCorrect: boolean }) => a.isCorrect);
    if (sa.answerId === correct?.id) sectionScores[code].correct++;
  }

  const score = computeScore(sectionScores);
  const overallPct = pct(score.raw.correct, score.raw.total);
  const passed = score.passed;

  const reviewItems = session.answers.map((sa: AnswerRow) => ({
    questionId: sa.questionId,
    questionText: sa.question.text,
    explanation: sa.question.explanation,
    sectionCode: sa.question.section.code,
    sectionName: sa.question.section.name,
    difficulty: sa.question.difficulty,
    selectedAnswerId: sa.answerId,
    answers: sa.question.answers,
    isCorrect: sa.question.answers.find((a: { id: string; isCorrect: boolean }) => a.isCorrect)?.id === sa.answerId,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div>
          <p className="text-sm text-gray-500">{session.test.name} · {session.mode} mode</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Your Results</h1>
        </div>

        {/* Pass / Fail banner */}
        {passed ? (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-bold text-green-800 text-lg">You Passed!</p>
              <p className="text-sm text-green-700">You scored {overallPct}% — above the 80% required to pass this CDL knowledge test.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
            <span className="text-2xl">❌</span>
            <div>
              <p className="font-bold text-red-800 text-lg">Not Quite — Keep Practicing</p>
              <p className="text-sm text-red-700">You scored {overallPct}% — you need 80% to pass. Review the questions below and try again.</p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          <span className="text-lg leading-none mt-0.5">⚠️</span>
          <p>
            <strong>Practice estimate only.</strong> These scores are based on unofficial practice questions and do not predict your actual CDL exam result.
            For official study materials, see your state DMV handbook or{" "}
            <a href="https://www.fmcsa.dot.gov/registration/commercial-drivers-license/drivers" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-amber-900">
              FMCSA.dot.gov
            </a>.
          </p>
        </div>

        {/* Ad slot */}
        <AdSlot slot="results-top" format="banner" />

        {/* Score card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Circle score */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3.5" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={passed ? "#22c55e" : overallPct >= 60 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="3.5"
                  strokeDasharray={`${overallPct} ${100 - overallPct}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{overallPct}%</span>
                <span className="text-xs text-gray-500">{score.raw.correct}/{score.raw.total}</span>
              </div>
            </div>

            <div className="flex-1 space-y-3 w-full">
              {/* Pass threshold indicator */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700 text-sm">Pass Threshold</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">80%</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
              </div>

              {/* Section breakdown */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(sectionScores).map(([code, s]) => {
                  const sectionPct = pct(s.correct, s.total);
                  return (
                    <div key={code} className="flex justify-between px-3 py-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">{code}</span>
                      <span className={`font-semibold ${sectionPct >= 80 ? "text-green-700" : "text-red-600"}`}>{sectionPct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section detail breakdown */}
        {Object.keys(score.sectionBreakdown).length > 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Section Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(score.sectionBreakdown).map(([code, s]) => (
                <div key={code}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{code}</span>
                    <span className={`text-sm font-semibold ${s.passed ? "text-green-700" : "text-red-600"}`}>{s.pct}% ({s.correct}/{s.total})</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${s.passed ? "bg-green-500" : "bg-red-400"}`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ad slot */}
        <AdSlot slot="results-mid" format="rectangle" className="mx-auto" />

        {/* Question review */}
        <ReviewSection items={reviewItems} />

        {/* Bottom CTA */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href={`/start?test=${session.test.slug}&mode=full`} className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700">
            Retake Test
          </Link>
          <Link href="/tests" className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            All Tests
          </Link>
          <Link href="/" className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Home
          </Link>
        </div>

        <AdSlot slot="results-bottom" format="banner" />
      </div>
    </div>
  );
}
