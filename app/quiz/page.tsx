"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Section { code: string; name: string }
interface Test { slug: string; name: string; sections: Section[] }

function QuizForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const defaultTest = sp.get("test") ?? "cdl-general";

  const [tests, setTests] = useState<Test[]>([]);
  const [testSlug, setTestSlug] = useState(defaultTest);
  const [section, setSection] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [count, setCount] = useState(20);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/tests").then(r => r.json()).then(setTests);
  }, []);

  const currentTest = tests.find(t => t.slug === testSlug);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testSlug,
          mode: "quiz",
          sectionCode: section || undefined,
          difficulty: difficulty || undefined,
          count,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      if (!data.sessionId) throw new Error("No session");
      router.push(`/test/${data.sessionId}`);
    } catch {
      alert("Failed to start quiz. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quick Quiz</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Test</label>
          <select
            value={testSlug}
            onChange={e => { setTestSlug(e.target.value); setSection(""); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {tests.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Section</label>
          <select
            value={section}
            onChange={e => setSection(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All sections</option>
            {currentTest?.sections.map(s => (
              <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Questions: {count}</label>
          <input
            type="range" min={5} max={50} step={5} value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-orange-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5</span><span>50</span></div>
        </div>

        <button
          onClick={handleStart}
          disabled={loading || tests.length === 0}
          className="w-full py-3 text-sm font-semibold text-white bg-orange-600 rounded-xl hover:bg-orange-700 disabled:opacity-60"
        >
          {loading ? "Starting…" : `Start ${count}-Question Quiz`}
        </button>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>}><QuizForm /></Suspense>;
}
