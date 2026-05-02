export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdSlot } from "@/components/ui/AdSlot";

export const metadata: Metadata = {
  title: "Free CDL Practice Test 2026 — General Knowledge, Air Brakes, HazMat | CDLTestPrep",
  description: "Free CDL practice tests for 2026. Study for General Knowledge, Air Brakes, HazMat, Combination Vehicles, and all CDL endorsements with 500+ real-style questions and instant pass/fail scoring.",
  alternates: { canonical: "https://www.cdltestprep.com" },
  openGraph: {
    title: "Free CDL Practice Test 2026 — All Knowledge Exams",
    description: "Free CDL practice tests for General Knowledge, Air Brakes, HazMat, Combination Vehicles, and more. Instant scoring.",
    url: "https://www.cdltestprep.com",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CDLTestPrep",
  url: "https://www.cdltestprep.com",
  description: "Free CDL knowledge test practice for all endorsements and CDL classes.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://www.cdltestprep.com/endorsements?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many questions are on the CDL General Knowledge test?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The CDL General Knowledge test has 50 questions. You must answer at least 40 correctly (80%) to pass. It covers topics like vehicle inspection, basic controls, shifting, backing, coupling/uncoupling, pre-trip inspection, and hazardous materials basics.",
      },
    },
    {
      "@type": "Question",
      name: "What is the passing score for CDL knowledge tests?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You must score at least 80% on all CDL written knowledge tests. For the General Knowledge test, that means 40 out of 50 questions correct. For endorsement tests, the number of required correct answers varies by state.",
      },
    },
    {
      "@type": "Question",
      name: "What CDL endorsements are there?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CDL endorsements include: H (Hazardous Materials), N (Tank Vehicles), T (Doubles/Triples), P (Passenger Transport), S (School Bus), and X (combination of H and N). Each requires passing a separate written knowledge test.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between CDL Class A, B, and C?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CDL Class A covers combination vehicles with a GCWR of 26,001+ lbs where the towed unit exceeds 10,000 lbs (semi-trucks). Class B covers single vehicles 26,001+ lbs or towing up to 10,000 lbs (dump trucks, buses). Class C covers vehicles carrying 16+ passengers or hazmat that don't qualify as Class A or B.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need Air Brakes endorsement for a CDL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You don't need a separate Air Brakes endorsement — instead, if you fail the Air Brakes knowledge test or take your skills test in a vehicle without air brakes, your CDL will have an 'Air Brakes Restriction' (L restriction). To drive vehicles with air brakes, you must pass the Air Brakes written test.",
      },
    },
  ],
};

export default async function HomePage() {
  const [testCount, questionCount] = await Promise.all([
    prisma.test.count(),
    prisma.question.count(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-block bg-orange-500/30 border border-orange-400/30 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            Free CDL Test Prep
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Pass Your CDL Knowledge Test
          </h1>
          <p className="text-orange-100 text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Practice General Knowledge, Air Brakes, HazMat, Combination Vehicles, and all endorsements with real-style questions and instant pass/fail scoring.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/start?test=cdl-general&mode=full" className="px-6 py-3 text-base font-bold bg-white text-orange-700 rounded-xl hover:bg-orange-50 shadow-lg">
              Start General Knowledge
            </Link>
            <Link href="/tests" className="px-6 py-3 text-base font-semibold text-white border border-white/40 rounded-xl hover:bg-white/10">
              All Tests
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-3 gap-6 text-center">
          {[
            { n: questionCount.toLocaleString(), label: "Practice Questions" },
            { n: testCount.toString(), label: "Knowledge Tests" },
            { n: "80%", label: "Required to Pass" },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-orange-600">{s.n}</div>
              <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
        <AdSlot slot="home-top" format="banner" />

        {/* Test cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Choose Your Test</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { slug: "cdl-general", name: "General Knowledge", desc: "Required for ALL CDL applicants. 50 questions, 80% to pass.", tag: "Required", tagColor: "bg-orange-100 text-orange-800" },
              { slug: "cdl-air-brakes", name: "Air Brakes", desc: "Required to drive vehicles equipped with air brakes.", tag: "Essential", tagColor: "bg-red-100 text-red-800" },
              { slug: "cdl-combination", name: "Combination Vehicles", desc: "Required for Class A CDL (semi-trucks, tractor-trailers).", tag: "Class A", tagColor: "bg-blue-100 text-blue-800" },
              { slug: "cdl-hazmat", name: "Hazardous Materials", desc: "Required for HazMat endorsement (H). Background check required.", tag: "Endorsement H", tagColor: "bg-yellow-100 text-yellow-800" },
              { slug: "cdl-passenger", name: "Passenger Transport", desc: "Required for Passenger endorsement (P). Buses and vans.", tag: "Endorsement P", tagColor: "bg-green-100 text-green-800" },
              { slug: "cdl-tanker", name: "Tank Vehicles", desc: "Required for Tank endorsement (N). Liquid/gas tankers.", tag: "Endorsement N", tagColor: "bg-indigo-100 text-indigo-800" },
            ].map(t => (
              <div key={t.slug} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{t.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.tagColor}`}>{t.tag}</span>
                </div>
                <p className="text-sm text-gray-500 flex-1 mb-4">{t.desc}</p>
                <div className="flex gap-2">
                  <Link href={`/start?test=${t.slug}&mode=full`} className="flex-1 text-center py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700">
                    Full Test
                  </Link>
                  <Link href={`/quiz?test=${t.slug}`} className="flex-1 text-center py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100">
                    Quick Quiz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CDL Classes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">CDL Classes</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { cls: "Class A", title: "Tractor-Trailer", desc: "Any combination vehicle with GCWR 26,001+ lbs, towed unit over 10,000 lbs. Includes semi-trucks, flatbeds, tankers.", color: "border-orange-400 bg-orange-50" },
              { cls: "Class B", title: "Straight Truck / Bus", desc: "Single vehicle 26,001+ lbs. Includes dump trucks, box trucks, city buses, and most RVs.", color: "border-blue-400 bg-blue-50" },
              { cls: "Class C", title: "Passenger / HazMat", desc: "Smaller vehicles carrying 16+ passengers or placarded hazmat that don't qualify as Class A or B.", color: "border-green-400 bg-green-50" },
            ].map(c => (
              <div key={c.cls} className={`rounded-xl border-2 p-5 ${c.color}`}>
                <div className="text-2xl font-black text-gray-900">{c.cls}</div>
                <div className="font-semibold text-gray-800 mt-1">{c.title}</div>
                <p className="text-sm text-gray-600 mt-2">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Why Practice Here?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: "✅", title: "Pass/Fail Scoring", desc: "Every test shows exactly whether you hit the 80% threshold required by FMCSA." },
              { icon: "📖", title: "Real-Style Questions", desc: "Questions modeled after the actual CDL knowledge exam with detailed explanations." },
              { icon: "🔖", title: "All Endorsements", desc: "Practice for H, N, P, T, S, and X endorsements in one place." },
            ].map(f => (
              <div key={f.title} className="p-5 bg-gray-50 rounded-xl">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-bold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <AdSlot slot="home-bottom" format="banner" />

        {/* FAQ */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((item, i) => (
              <details key={i} className="group border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-gray-800 hover:text-orange-600">
                  {item.name}
                  <span className="ml-3 text-gray-400 group-open:rotate-180 transition-transform text-lg">▾</span>
                </summary>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
