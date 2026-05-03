import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getState, getAllStateSlugs, states } from "@/lib/states";

interface Props {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  return getAllStateSlugs().map((s) => ({ state: s }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const info = getState(stateSlug);
  if (!info) return {};
  return {
    title: `${info.name} CDL Practice Test 2026 | CDLPrepKit`,
    description: `Free CDL practice tests for ${info.name}. Study for the General Knowledge, Air Brakes, HazMat, and endorsement exams. ${info.dmvName} requirements and links.`,
    openGraph: {
      title: `${info.name} CDL Practice Test`,
      description: `Free CDL practice for ${info.name} — requirements, DMV links, and practice questions.`,
      url: `https://www.cdlprepkit.com/states/${stateSlug}`,
    },
    alternates: { canonical: `https://www.cdlprepkit.com/states/${stateSlug}` },
  };
}

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params;
  const info = getState(stateSlug);
  if (!info) notFound();

  // Nearby states (same region, simple neighbor logic via index)
  const idx = states.findIndex((s) => s.slug === stateSlug);
  const nearby = [
    states[idx - 2],
    states[idx - 1],
    states[idx + 1],
    states[idx + 2],
  ].filter(Boolean).slice(0, 4);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${info.name} CDL Practice Test`,
    description: `Free CDL practice tests and requirements for ${info.name}.`,
    url: `https://www.cdlprepkit.com/states/${stateSlug}`,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <span>›</span>
        <Link href="/states" className="hover:text-orange-600">States</Link>
        <span>›</span>
        <span className="text-gray-800">{info.name}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl font-black text-orange-600">{info.abbr}</span>
          <h1 className="text-3xl font-bold text-gray-900">{info.name} CDL Practice Test</h1>
        </div>
        <p className="text-gray-500 leading-relaxed">
          Free CDL practice tests for {info.name} — the same topics covered on the official {info.dmvName} knowledge exam.
          {" "}{info.notes}
        </p>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/start?test=cdl-general&mode=full"
          className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700"
        >
          Start General Knowledge Test
        </Link>
        <Link
          href="/tests"
          className="px-5 py-2.5 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100"
        >
          All Practice Tests
        </Link>
      </div>

      {/* State requirements card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">{info.name} CDL Requirements</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="px-6 py-4 flex items-start justify-between gap-4">
            <span className="text-sm font-medium text-gray-600 w-36 flex-shrink-0">Minimum Age</span>
            <span className="text-sm text-gray-900 flex-1">{info.minAge}</span>
          </div>
          <div className="px-6 py-4 flex items-start justify-between gap-4">
            <span className="text-sm font-medium text-gray-600 w-36 flex-shrink-0">CLP Wait Period</span>
            <span className="text-sm text-gray-900 flex-1">{info.waitPeriod}</span>
          </div>
          <div className="px-6 py-4 flex items-start justify-between gap-4">
            <span className="text-sm font-medium text-gray-600 w-36 flex-shrink-0">Test Fees</span>
            <span className="text-sm text-gray-900 flex-1">{info.testFee} (estimated — verify with {info.dmvName})</span>
          </div>
          <div className="px-6 py-4 flex items-start justify-between gap-4">
            <span className="text-sm font-medium text-gray-600 w-36 flex-shrink-0">Licensing Agency</span>
            <span className="text-sm text-gray-900 flex-1">
              <a
                href={info.dmvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                {info.dmvName} ↗
              </a>
            </span>
          </div>
          <div className="px-6 py-4 flex items-start justify-between gap-4">
            <span className="text-sm font-medium text-gray-600 w-36 flex-shrink-0">CDL Manual</span>
            <span className="text-sm text-gray-900 flex-1">
              <a
                href={info.manualUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                Download {info.abbr} CDL Manual ↗
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* What the test covers */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">What the {info.name} CDL Knowledge Tests Cover</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          The CDL knowledge tests in {info.name} follow federal FMCSA standards, so the core topics are the same in every state.
          You&apos;ll be tested on:
        </p>
        <ul className="text-sm text-gray-700 space-y-2">
          {[
            ["General Knowledge", "Required for every CDL applicant — covers vehicle inspection, driving safely, transporting cargo, and basic HazMat rules. 50 questions, 80% to pass."],
            ["Air Brakes", "Required to drive vehicles with air brakes. Skip this and you get the L restriction. 25 questions, 80% to pass."],
            ["Combination Vehicles", "Required for Class A CDL — covers coupling, uncoupling, anti-jackknife, and trailer handling."],
            ["HazMat (H Endorsement)", "Required to transport hazardous materials that need placarding. Includes TSA background check."],
            ["Tanker (N Endorsement)", "Required for liquid/gas tank vehicles of 1,000 gallons or more."],
            ["Passenger (P Endorsement)", "Required to drive buses carrying 16+ passengers."],
            ["Doubles/Triples (T Endorsement)", "Required to pull double or triple trailer combinations."],
          ].map(([name, desc]) => (
            <li key={name} className="flex gap-3">
              <span className="text-orange-500 font-bold mt-0.5">✓</span>
              <span><strong>{name}</strong> — {desc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
        <span className="text-lg leading-none mt-0.5">⚠️</span>
        <p>
          Requirements, fees, and procedures can change. Always verify current information directly with the{" "}
          <a href={info.dmvUrl} target="_blank" rel="noopener noreferrer" className="underline font-medium">
            {info.dmvName}
          </a>{" "}
          before applying. CDLPrepKit is not affiliated with any state DMV or FMCSA.
        </p>
      </div>

      {/* Other states */}
      {nearby.length > 0 && (
        <div>
          <h2 className="font-bold text-gray-900 mb-3">Other States</h2>
          <div className="flex flex-wrap gap-2">
            {nearby.map((s) => (
              <Link
                key={s.slug}
                href={`/states/${s.slug}`}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:text-orange-700 transition-colors"
              >
                {s.name}
              </Link>
            ))}
            <Link
              href="/states"
              className="px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
            >
              All 50 States →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
