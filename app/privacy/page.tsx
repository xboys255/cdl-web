import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | CDLPrepKit",
  description: "Privacy policy for CDLPrepKit.com — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-500 mt-2">Last updated: May 2026</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. Information We Collect</h2>
          <p>
            CDLPrepKit.com does not require account registration. We collect minimal data necessary to operate the service, including:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Anonymous session data (test answers, scores) stored temporarily to show your results</li>
            <li>Standard server logs (IP addresses, browser type, pages visited) for security and analytics</li>
            <li>Cookie data used by Google AdSense to serve relevant advertisements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. Cookies and Advertising</h2>
          <p>
            We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this website or other websites. You can opt out of personalized advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline">Google Ads Settings</a>.
          </p>
          <p className="mt-2">
            We also use analytics tools to understand how visitors use our site. No personally identifiable information is collected through these tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">3. How We Use Your Data</h2>
          <p>Session data is used solely to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Display your test results on the results page</li>
            <li>Calculate your score and section breakdown</li>
          </ul>
          <p className="mt-2">We do not sell, trade, or share your data with third parties beyond the advertising and analytics services described above.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">4. Third-Party Links</h2>
          <p>
            Our site may contain links to external sites such as FMCSA.dot.gov and state DMV websites. We are not responsible for the privacy practices of those sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">5. Data Retention</h2>
          <p>
            Anonymous test session data may be retained for up to 30 days for troubleshooting purposes, then automatically deleted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">6. Children&apos;s Privacy</h2>
          <p>
            CDLPrepKit.com is intended for adults pursuing a Commercial Driver&apos;s License. We do not knowingly collect information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">7. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be posted on this page with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">8. Contact</h2>
          <p>
            If you have questions about this privacy policy, you can contact us through the information on our website.
          </p>
        </section>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Link href="/" className="text-sm text-orange-600 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
