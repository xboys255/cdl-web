"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

function StartForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const testSlug = sp.get("test") ?? "cdl-general";
  const mode = (sp.get("mode") ?? "full") as "full" | "section" | "quiz";
  const section = sp.get("section") ?? undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testSlug, mode, sectionCode: section }),
    });
    if (!res.ok) { setError("Failed to start session. Please try again."); setLoading(false); return; }
    let data: { sessionId?: string } = {};
    try { data = await res.json(); } catch { setError("Failed to start session. Please try again."); setLoading(false); return; }
    if (!data.sessionId) { setError("Failed to start session. Please try again."); setLoading(false); return; }
    router.push(`/test/${data.sessionId}`);
  };

  // Auto-start on mount
  if (!loading && !error) {
    handleStart();
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Starting test…</p></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading && <p className="text-gray-500">Starting test…</p>}
      {error && (
        <div className="text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <button onClick={handleStart} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm">Retry</button>
        </div>
      )}
    </div>
  );
}

export default function StartPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading…</p></div>}><StartForm /></Suspense>;
}
