export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CDL Flashcard Study Mode | CDLPrepKit",
  description: "Study CDL knowledge questions as flashcards — flip through answers, mark what you know, and focus on what you need to review. No timer, no pressure.",
  openGraph: {
    title: "CDL Flashcard Study Mode",
    description: "Flip through CDL practice questions as flashcards. Great for reviewing tricky topics.",
    url: "https://www.cdlprepkit.com/flashcards",
  },
};

export default async function FlashcardsPage() {
  const tests = await prisma.test.findMany({
    include: {
      sections: {
        select: { id: true, code: true, name: true, questionCount: true },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  type TestRow = typeof tests[number];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Flashcard Study Mode</h1>
        <p className="text-gray-500 mt-2">
          Flip through questions, reveal answers, and mark what you know. No timer — study at your own pace.
        </p>
      </div>

      {/* How it works */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: "🃏", title: "Flip the card", desc: "See the question, then tap or press Space to reveal the answer and explanation." },
          { icon: "✓", title: "Mark what you know", desc: "Mark cards as 'Got it' or 'Review Again' to focus your study." },
          { icon: "🔁", title: "Review missed cards", desc: "At the end, replay only the cards you missed until you have them all." },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl mb-2">{item.icon}</div>
            <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Test selection */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Choose a Test</h2>
        {tests.map((test: TestRow) => (
          <div key={test.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{test.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {test.sections.reduce((sum, s) => sum + s.questionCount, 0)} total cards
                </p>
              </div>
              <Link
                href={`/flashcards/${test.slug}`}
                className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Study All Cards
              </Link>
            </div>

            {/* Section buttons */}
            {test.sections.length > 0 && (
              <div className="px-5 pb-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {test.sections.map((s) => (
                  <Link
                    key={s.id}
                    href={`/flashcards/${test.slug}?section=${s.code}`}
                    className="flex items-center justify-between px-3 py-2 text-sm bg-gray-50 hover:bg-purple-50 hover:border-purple-200 rounded-lg border border-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-700">{s.name}</span>
                    <span className="text-xs text-gray-400">{s.questionCount}q</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
