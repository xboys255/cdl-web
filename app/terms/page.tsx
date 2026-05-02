import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | CDLPrepKit",
  description: "Terms of use for CDLPrepKit.com — unofficial CDL practice tests for educational purposes only.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Terms of Use</h1>
        <p className="text-gray-500 mt-2">Last updated: May 2026</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
        <strong>Important:</strong> CDLPrepKit.com provides unofficial practice questions for educational purposes only.
        It is not affiliated with FMCSA, any state DMV, or any official CDL testing authority.
      </div>

      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CDLPrepKit.com, you agree to be bound by these Terms of Use. If you do not agree, please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. Educational Use Only</h2>
          <p>
            All practice questions, answers, and explanations on CDLPrepKit.com are for educational and practice purposes only. They are not official CDL exam questions and are not sourced from the actual CDL knowledge tests administered by state DMVs.
          </p>
          <p className="mt-2">
            Your scores on CDLPrepKit.com do not predict, guarantee, or reflect your performance on any official CDL examination. Always study from your state&apos;s official Commercial Driver License Manual and official FMCSA resources.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">3. No Affiliation</h2>
          <p>
            CDLPrepKit.com is not affiliated with, endorsed by, or connected to the Federal Motor Carrier Safety Administration (FMCSA), any state Department of Motor Vehicles (DMV), or any official CDL testing program.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">4. Accuracy Disclaimer</h2>
          <p>
            While we strive to provide accurate and up-to-date practice questions based on the CDL knowledge exam topics, we make no warranties, express or implied, about the accuracy, completeness, or suitability of any content on this site. CDL requirements and regulations may vary by state and change over time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">5. Limitation of Liability</h2>
          <p>
            CDLPrepKit.com shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of or inability to use this site, including reliance on any content provided herein.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">6. Intellectual Property</h2>
          <p>
            All content on CDLPrepKit.com, including practice questions, explanations, and site design, is owned by CDLPrepKit.com and may not be copied, reproduced, or distributed without written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the site following any changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">8. Governing Law</h2>
          <p>
            These terms are governed by applicable law. Any disputes will be resolved in the appropriate courts.
          </p>
        </section>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Link href="/" className="text-sm text-orange-600 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
