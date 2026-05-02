import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, getAllSlugs, posts } from "@/lib/blog";
import { AdSlot } from "@/components/ui/AdSlot";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | CDLTestPrep`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.cdltestprep.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "CDLTestPrep" },
    publisher: {
      "@type": "Organization",
      name: "CDLTestPrep",
      url: "https://www.cdltestprep.com",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.cdltestprep.com/blog/${post.slug}` },
  };

  // Related posts (same category, different slug)
  const related = posts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  const otherRelated = related.length < 3
    ? [...related, ...posts.filter((p) => p.slug !== post.slug && p.category !== post.category).slice(0, 3 - related.length)]
    : related;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-orange-600">Blog</Link>
        <span>›</span>
        <span className="text-gray-800 truncate">{post.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">{post.category}</span>
          <span className="text-gray-400 text-xs">{post.readTime}</span>
          <span className="text-gray-400 text-xs">·</span>
          <span className="text-gray-400 text-xs">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{post.title}</h1>
        <p className="text-gray-500 mt-3 text-lg leading-relaxed">{post.description}</p>
      </div>

      <AdSlot slot="blog-post-top" format="banner" />

      {/* Article body */}
      <article
        className="blog-content mt-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* CTA */}
      <div className="mt-10 bg-orange-50 border border-orange-200 rounded-xl p-5">
        <h3 className="font-bold text-orange-900">Ready to Practice?</h3>
        <p className="text-sm text-orange-800 mt-1">Put your knowledge to the test with free CDL practice questions.</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link href="/start?test=cdl-general&mode=full" className="text-sm font-semibold text-white bg-orange-600 px-4 py-2 rounded-lg hover:bg-orange-700">
            General Knowledge Test
          </Link>
          <Link href="/tests" className="text-sm font-medium text-orange-700 bg-white border border-orange-300 px-4 py-2 rounded-lg hover:bg-orange-50">
            All Tests
          </Link>
        </div>
      </div>

      <AdSlot slot="blog-post-bottom" format="banner" />

      {/* Related posts */}
      {otherRelated.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">More Articles</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {otherRelated.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <span className="text-xs font-semibold text-orange-600">{p.category}</span>
                <h3 className="text-sm font-bold text-gray-900 mt-1 leading-snug group-hover:text-orange-600">{p.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{p.readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
