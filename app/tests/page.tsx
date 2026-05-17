export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdSlot } from "@/components/ui/AdSlot";

export const metadata: Metadata = {
  title: "Free CDL Practice Tests 2026 — All Knowledge Exams",
  description: "Free CDL knowledge practice tests for General Knowledge, Air Brakes, HazMat, Combination Vehicles, Passenger, Tanker, and Doubles/Triples. Instant pass/fail scoring.",
  openGraph: {
    title: "Free CDL Practice Tests — All Knowledge Exams",
    description: "Practice every CDL written knowledge test with instant pass/fail scoring.",
    url: "https://www.cdlprepkit.com/tests",
  },
};

const TYPE_COLORS: Record<string, string> = {
  GENERAL_KNOWLEDGE: "bg-orange-100 text-orange-800 border-orange-200",
  AIR_BRAKES: "bg-red-100 text-red-800 border-red-200",
  COMBINATION: "bg-blue-100 text-blue-800 border-blue-200",
  HAZMAT: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PASSENGER: "bg-green-100 text-green-800 border-green-200",
  TANKER: "bg-indigo-100 text-indigo-800 border-indigo-200",
  DOUBLES_TRIPLES: "bg-purple-100 text-purple-800 border-purple-200",
  SCHOOL_BUS: "bg-pink-100 text-pink-800 border-pink-200",
};

const TYPE_LABEL: Record<string, string> = {
  GENERAL_KNOWLEDGE: "General Knowledge",
  AIR_BRAKES: "Air Brakes",
  COMBINATION: "Combination Vehicles",
  HAZMAT: "HazMat",
  PASSENGER: "Passenger",
  TANKER: "Tanker",
  DOUBLES_TRIPLES: "Doubles/Triples",
  SCHOOL_BUS: "School Bus",
};

export default async function TestsPage() {
  const tests = await prisma.test.findMany({
    include: { sections: { select: { id: true, code: true, name: true, questionCount: true } } },
    orderBy: { name: "asc" },
  });

  type TestRow = typeof tests[number];
  type SectionRow = TestRow["sections"][number];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All CDL Practice Tests</h1>
        <p className="text-gray-500 mt-1">Choose a test to begin. You need 80% to pass — just like the real exam.</p>
      </div>

      <AdSlot slot="tests-top" format="banner" />

      {/* Disclaimer */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
        <span className="text-lg leading-none mt-0.5">⚠️</span>
        <p>
          These are <strong>unofficial practice questions</strong> modeled after the CDL knowledge exam — not from the actual test.
          For official study materials, see your state DMV handbook or{" "}
          <a href="https://www.fmcsa.dot.gov/registration/commercial-drivers-license/drivers" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-amber-900">
            FMCSA.dot.gov
          </a>.
        </p>
      </div>

      <div className="space-y-4">
        {tests.map((test: TestRow) => (
          <div key={test.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-gray-900">{test.name}</h2>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${TYPE_COLORS[test.type] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
                    {TYPE_LABEL[test.type] ?? test.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{test.description}</p>
                <p className="text-xs text-gray-400 mt-1">Time limit: {test.timeLimit} min · Pass: 80% · {test.sections.length} section{test.sections.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link
                  href={`/start?test=${test.slug}&mode=full`}
                  className="px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 text-center"
                >
                  Full Test
                </Link>
                <Link
                  href={`/quiz?test=${test.slug}`}
                  className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 text-center"
                >
                  Quick Quiz
                </Link>
                <Link
                  href={`/flashcards/${test.slug}`}
                  className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 text-center"
                >
                  Flashcards
                </Link>
              </div>
            </div>

            {test.sections.length > 0 && (
              <div className="px-5 pb-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {test.sections.map((s: SectionRow) => (
                  <Link
                    key={s.id}
                    href={`/start?test=${test.slug}&mode=section&section=${s.code}`}
                    className="flex items-center justify-between px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 transition-colors"
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

      <AdSlot slot="tests-bottom" format="banner" />
    </div>
  );
}
