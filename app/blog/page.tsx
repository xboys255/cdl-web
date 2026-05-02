import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/blog";
import { AdSlot } from "@/components/ui/AdSlot";

export const metadata: Metadata = {
  title: "CDL Blog — Tips, Guides & Study Help | CDLPrepKit",
  description: "CDL study guides, endorsement tips, and trucking career advice. Learn how to pass your CDL knowledge tests and start your commercial driving career.",
  openGraph: {
    title: "CDL Blog — Tips, Guides & Study Help",
    description: "CDL study guides, endorsement tips, and trucking career advice.",
    url: "https://www.cdlprepkit.com/blog",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  "Getting Started": "bg-orange-100 text-orange-800",
  "Study Guides": "bg-blue-100 text-blue-800",
  "Endorsements": "bg-green-100 text-green-800",
  "CDL Basics": "bg-indigo-100 text-indigo-800",
  "Test Tips": "bg-purple-100 text-purple-800",
};

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">CDL Study Blog</h1>
        <p className="text-gray-500 mt-2">Guides, tips, and career advice for CDL applicants.</p>
      </div>

      <AdSlot slot="blog-top" format="banner" />

      {/* Featured post */}
      <Link href={`/blog/${featured.slug}`} className="block group">
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white rounded-2xl p-8 hover:from-orange-700 hover:to-orange-900 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">{featured.category}</span>
            <span className="text-orange-200 text-xs">{featured.readTime}</span>
          </div>
          <h2 className="text-2xl font-bold leading-tight group-hover:underline">{featured.title}</h2>
          <p className="text-orange-100 mt-2 leading-relaxed">{featured.description}</p>
          <div className="mt-4 text-sm font-semibold text-orange-200">Read article →</div>
        </div>
      </Link>

      {/* Post grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-700"}`}>
                {post.category}
              </span>
              <span className="text-xs text-gray-400">{post.readTime}</span>
            </div>
            <h2 className="font-bold text-gray-900 leading-snug group-hover:text-orange-600 transition-colors">{post.title}</h2>
            <p className="text-sm text-gray-500 mt-2 flex-1 leading-relaxed line-clamp-3">{post.description}</p>
            <div className="mt-3 text-xs font-semibold text-orange-600">Read more →</div>
          </Link>
        ))}
      </div>

      <AdSlot slot="blog-bottom" format="banner" />
    </div>
  );
}
