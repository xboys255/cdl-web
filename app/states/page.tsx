import type { Metadata } from "next";
import Link from "next/link";
import { states } from "@/lib/states";

export const metadata: Metadata = {
  title: "CDL Practice Tests by State 2026 | CDLPrepKit",
  description: "Find CDL practice tests and state-specific CDL requirements for all 50 states. Free practice questions for General Knowledge, Air Brakes, HazMat, and more.",
  openGraph: {
    title: "CDL Practice Tests by State",
    description: "CDL requirements and free practice tests for all 50 states.",
    url: "https://www.cdlprepkit.com/states",
  },
  alternates: { canonical: "https://www.cdlprepkit.com/states" },
};

export default function StatesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">CDL Practice Tests by State</h1>
        <p className="text-gray-500 mt-2">
          Select your state to see CDL requirements, DMV links, and start free practice tests.
        </p>
      </div>

      {/* CTA */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-orange-900">Ready to practice right now?</p>
          <p className="text-sm text-orange-700 mt-0.5">Our practice tests work for every state — same federal CDL knowledge requirements.</p>
        </div>
        <Link
          href="/start?test=cdl-general&mode=full"
          className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700"
        >
          Start Practice Test
        </Link>
      </div>

      {/* State grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {states.map((state) => (
          <Link
            key={state.slug}
            href={`/states/${state.slug}`}
            className="group flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all"
          >
            <span className="text-sm font-bold text-orange-600 w-7 flex-shrink-0">{state.abbr}</span>
            <span className="text-sm font-medium text-gray-800 group-hover:text-orange-700 leading-tight">{state.name}</span>
          </Link>
        ))}
      </div>

      {/* Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm text-gray-600">
        <p>
          <strong>Note:</strong> CDL knowledge tests follow federal FMCSA standards — the core questions are the same in every state.
          State pages show local DMV links, test fees, and specific requirements. Always verify current requirements with your state DMV before applying.
        </p>
      </div>
    </div>
  );
}
