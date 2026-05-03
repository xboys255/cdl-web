"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ProgressEntry } from "@/components/ui/SaveProgress";

const STORAGE_KEY = "cdl_progress";

export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const data: ProgressEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      setEntries(data);
    } catch {
      setEntries([]);
    }
    setLoaded(true);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEntries([]);
  };

  if (!loaded) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-400">Loading…</div>
    );
  }

  const totalTests = entries.length;
  const avgScore = totalTests > 0
    ? Math.round(entries.reduce((sum, e) => sum + e.score, 0) / totalTests)
    : 0;
  const passRate = totalTests > 0
    ? Math.round((entries.filter((e) => e.passed).length / totalTests) * 100)
    : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
          <p className="text-gray-500 mt-1">Your CDL practice test history — stored locally in your browser.</p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            Clear History
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        /* Empty state */
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No tests taken yet</h2>
          <p className="text-gray-500 mb-6">Complete a practice test and your scores will appear here.</p>
          <Link
            href="/tests"
            className="inline-block px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700"
          >
            Start a Practice Test
          </Link>
        </div>
      ) : (
        <>
          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <div className="text-3xl font-bold text-gray-900">{totalTests}</div>
              <div className="text-sm text-gray-500 mt-1">Tests Taken</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <div className={`text-3xl font-bold ${avgScore >= 80 ? "text-green-600" : "text-amber-600"}`}>
                {avgScore}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Avg Score</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <div className={`text-3xl font-bold ${passRate >= 80 ? "text-green-600" : "text-amber-600"}`}>
                {passRate}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Pass Rate</div>
            </div>
          </div>

          {/* History list */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Test History</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {entries.map((entry, i) => (
                <div key={i} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{entry.testName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-lg font-bold ${entry.score >= 80 ? "text-green-600" : "text-red-500"}`}>
                      {entry.score}%
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      entry.passed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {entry.passed ? "PASSED" : "FAILED"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/tests"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700"
            >
              Take Another Test
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Home
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
