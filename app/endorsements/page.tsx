export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdSlot } from "@/components/ui/AdSlot";

export const metadata: Metadata = {
  title: "CDL Endorsements & Requirements — H, N, P, T, S, X | CDLPrepKit",
  description: "Complete guide to all CDL endorsements: HazMat (H), Tanker (N), Passenger (P), Doubles/Triples (T), School Bus (S), and X. Requirements, knowledge tests, and job types.",
  openGraph: {
    title: "CDL Endorsements — H, N, P, T, S, X Requirements",
    description: "Guide to every CDL endorsement, what knowledge test is required, and which driving jobs need them.",
    url: "https://www.cdlprepkit.com/endorsements",
  },
};

const CLASS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  A: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  B: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  C: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  all: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
};

export default async function EndorsementsPage() {
  const endorsements = await prisma.cDLEndorsement.findMany({ orderBy: { code: "asc" } });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">CDL Endorsements & Classes</h1>
        <p className="text-gray-500 mt-2">Every CDL endorsement, what test you need to pass, and which jobs require it.</p>
      </div>

      <AdSlot slot="endorsements-top" format="banner" />

      {/* CDL Classes summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { cls: "A", label: "Class A — Combination", desc: "Tractor-trailers, semis, flatbeds, tankers with trailer. GCWR 26,001+ lbs, towed unit over 10,000 lbs.", jobs: "Long-haul trucker, flatbed driver, tanker driver" },
          { cls: "B", label: "Class B — Straight Truck", desc: "Dump trucks, box trucks, cement mixers, city buses, delivery vehicles. Single vehicle 26,001+ lbs.", jobs: "Bus driver, dump truck, delivery" },
          { cls: "C", label: "Class C — Other", desc: "Vehicles 16+ passengers or placarded hazmat not meeting Class A/B.", jobs: "Shuttle driver, hazmat delivery, paratransit" },
        ].map(c => {
          const col = CLASS_COLORS[c.cls];
          return (
            <div key={c.cls} className={`rounded-xl border-2 p-5 ${col.bg} ${col.border}`}>
              <h2 className={`text-xl font-bold ${col.text}`}>{c.label}</h2>
              <p className="text-sm text-gray-600 mt-2">{c.desc}</p>
              <p className="text-xs text-gray-500 mt-2"><strong>Jobs:</strong> {c.jobs}</p>
            </div>
          );
        })}
      </div>

      {/* Endorsements list */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Endorsements</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {endorsements.map(e => {
            const col = CLASS_COLORS[e.cdlClass] ?? CLASS_COLORS.all;
            return (
              <div key={e.id} className={`bg-white rounded-xl border-2 p-5 ${col.border} hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-black ${col.text}`}>{e.code}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{e.name}</h3>
                      <p className="text-xs text-gray-500">Class {e.cdlClass.toUpperCase()}</p>
                    </div>
                  </div>
                  {e.testSlug && (
                    <Link
                      href={`/start?test=${e.testSlug}&mode=full`}
                      className="text-xs font-semibold text-white bg-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-700 flex-shrink-0"
                    >
                      Practice
                    </Link>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-3">{e.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How-it-works CTA */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
        <h3 className="font-bold text-orange-900">How to Get Your CDL</h3>
        <ol className="text-sm text-orange-800 mt-2 space-y-1 list-decimal pl-4">
          <li>Get a Commercial Learner's Permit (CLP) by passing the General Knowledge test + any needed endorsement tests</li>
          <li>Hold your CLP for at least 14 days</li>
          <li>Pass the CDL skills test: pre-trip inspection, basic controls, and road test</li>
          <li>Pay your state's licensing fee — your CDL is issued</li>
        </ol>
        <Link href="/start?test=cdl-general&mode=full" className="mt-4 inline-block text-sm font-semibold text-white bg-orange-600 px-4 py-2 rounded-lg hover:bg-orange-700">
          Start General Knowledge Practice
        </Link>
      </div>

      <AdSlot slot="endorsements-bottom" format="banner" />
    </div>
  );
}
