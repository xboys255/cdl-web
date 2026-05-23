import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CDLPrepKit — Free CDL Practice Tests",
  description: "CDLPrepKit provides free CDL knowledge practice tests for General Knowledge, Air Brakes, HazMat, Combination Vehicles, and more — helping drivers pass their CDL exam.",
  alternates: { canonical: "https://www.cdlprepkit.com/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">About CDLPrepKit</h1>
        <p className="text-gray-500 mt-2">Helping CDL applicants pass their knowledge exams — completely free.</p>
      </div>

      <section className="space-y-4 text-gray-700 leading-relaxed">
        <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
        <p>
          CDLPrepKit was built to give every commercial driver applicant free, high-quality practice for the CDL
          knowledge exams. Whether you&apos;re pursuing a Class A, Class B, or Class C license — or adding endorsements
          like HazMat, Tanker, or Passenger — the right score on your knowledge test is the first step, and we want
          to help you get there.
        </p>
        <p>
          Our practice tests cover all major CDL knowledge areas: <strong>General Knowledge</strong>,{" "}
          <strong>Air Brakes</strong>, <strong>HazMat</strong>, <strong>Combination Vehicles</strong>,{" "}
          <strong>Doubles &amp; Triples</strong>, <strong>Passenger Transport</strong>, <strong>School Bus</strong>,
          and more. Every question is written to reflect the style and subject matter of the actual FMCSA-based
          state CDL knowledge exams.
        </p>
      </section>

      <section className="space-y-4 text-gray-700 leading-relaxed">
        <h2 className="text-xl font-bold text-gray-900">What We Offer</h2>
        <ul className="space-y-3 list-none">
          {[
            { icon: "📝", title: "500+ Practice Questions", desc: "Covering General Knowledge, Air Brakes, HazMat, Combination Vehicles, endorsements, and more — written to match real exam difficulty." },
            { icon: "⚡", title: "Instant Scoring & Explanations", desc: "Get immediate feedback on every answer with detailed explanations so you learn from each mistake." },
            { icon: "🎯", title: "Topic-Focused Drills", desc: "Zero in on your weakest areas — practice individual sections like Air Brakes or HazMat placarding independently." },
            { icon: "🗺️", title: "State-by-State Requirements", desc: "Look up CDL requirements, fees, and testing locations for all 50 states so you know exactly what to expect." },
            { icon: "📊", title: "Progress Tracking", desc: "Track your scores over time so you can see your improvement and know when you&apos;re ready for the real exam." },
          ].map((item) => (
            <li key={item.title} className="flex gap-3 bg-gray-50 rounded-xl p-4">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 text-gray-700 leading-relaxed">
        <h2 className="text-xl font-bold text-gray-900">Why Free?</h2>
        <p>
          Getting a CDL can be expensive — training programs, licensing fees, and medical exams all add up. We
          believe the cost of exam prep shouldn&apos;t be another barrier. That&apos;s why CDLPrepKit is — and
          always will be — completely free to use. No sign-up required, no credit card, no hidden fees.
        </p>
        <p>
          The site is supported by advertising, which keeps the lights on while keeping every feature free for users.
        </p>
      </section>

      <section className="space-y-4 text-gray-700 leading-relaxed">
        <h2 className="text-xl font-bold text-gray-900">Disclaimer</h2>
        <p>
          CDLPrepKit is an independent study resource and is <strong>not affiliated with the FMCSA, any state DMV,
          or any commercial driver training school</strong>. Our practice questions are original content modeled after
          published CDL test specifications — they are not actual exam questions.
        </p>
        <p>
          CDL requirements, passing scores, and fees vary by state. Always verify current requirements with your
          state&apos;s DMV or licensing authority before testing.
        </p>
      </section>

      <section className="bg-orange-50 border border-orange-200 rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-900">Get in Touch</h2>
        <p className="text-gray-600">
          Found an error in a question, have a suggestion, or just want to say hi? We&apos;d love to hear from you.
        </p>
        <Link href="/contact" className="inline-block px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
          Contact Us →
        </Link>
      </section>
    </div>
  );
}
