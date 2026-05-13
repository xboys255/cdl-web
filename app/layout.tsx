import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";
const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const metadata: Metadata = {
  title: {
    default: "CDLPrepKit — Free CDL Practice Tests 2026",
    template: "%s | CDLPrepKit",
  },
  description: "Free CDL practice tests for General Knowledge, Air Brakes, HazMat, Combination Vehicles, and more. Instant scoring and state-by-state requirements.",
  metadataBase: new URL("https://www.cdlprepkit.com"),
  openGraph: {
    type: "website",
    siteName: "CDLPrepKit",
    title: "CDLPrepKit — Free CDL Practice Tests 2026",
    description: "Free CDL practice tests for General Knowledge, Air Brakes, HazMat, Combination Vehicles, and more.",
    url: "https://www.cdlprepkit.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "CDLPrepKit — Free CDL Practice Tests",
    description: "Free practice tests for every CDL knowledge exam. Instant scoring and pass/fail feedback.",
  },
  alternates: { canonical: "https://www.cdlprepkit.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}</Script>
        </>
      )}
      {adsenseClient && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-extrabold text-orange-600 text-lg tracking-tight">
              CDL<span className="text-gray-900">PrepKit</span>
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/tests" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors">
                Tests
              </Link>
              <Link href="/quiz" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors">
                Quick Quiz
              </Link>
              <Link href="/flashcards" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors">
                Flashcards
              </Link>
              <Link href="/endorsements" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors">
                Endorsements
              </Link>
              <Link href="/states" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors">
                States
              </Link>
              <Link href="/blog" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors">
                Blog
              </Link>
              <Link href="/progress" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors">
                My Progress
              </Link>
              <Link href="/start?test=cdl-general&mode=full" className="ml-2 px-3 py-1.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
                Practice Now
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>
        <Analytics />

        <footer className="border-t border-gray-200 bg-white mt-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-500 text-center sm:text-left space-y-1">
              <p>© {new Date().getFullYear()} CDLPrepKit — Free CDL knowledge test practice.</p>
              <p className="text-xs text-gray-400">
                Not affiliated with FMCSA or any state DMV. CDL requirements vary by state — verify with your local licensing authority.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <Link href="/tests" className="hover:text-gray-600">Tests</Link>
              <Link href="/endorsements" className="hover:text-gray-600">Endorsements</Link>
              <Link href="/blog" className="hover:text-gray-600">Blog</Link>
              <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-600">Terms</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
