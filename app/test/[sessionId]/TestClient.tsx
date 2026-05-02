"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QuestionCard } from "@/components/test/QuestionCard";
import { Timer } from "@/components/test/Timer";
import { ProgressBar } from "@/components/test/ProgressBar";
import { NavDots } from "@/components/test/NavDots";
import type { QuestionWithAnswers } from "@/types";
import { ChevronLeft, ChevronRight, Send, AlertCircle } from "lucide-react";

interface TestClientProps {
  sessionId: string;
  questions: QuestionWithAnswers[];
  testName: string;
  timeLimitSeconds: number;
  savedAnswers?: Record<string, string>;
}

export function TestClient({ sessionId, questions, testName, timeLimitSeconds, savedAnswers = {} }: TestClientProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>(savedAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const question = questions[current];
  const answeredIds = Object.keys(selected);

  const handleSelect = useCallback(async (answerId: string) => {
    const qId = questions[current].id;
    setSelected(prev => ({ ...prev, [qId]: answerId }));
    await fetch(`/api/sessions/${sessionId}/answer`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: qId, answerId }),
    });
  }, [current, questions, sessionId]);

  const handleSubmit = () => setConfirmOpen(true);

  const confirmSubmit = async () => {
    setConfirmOpen(false);
    setSubmitting(true);
    await fetch(`/api/sessions/${sessionId}/submit`, { method: "POST" });
    router.push(`/results/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Confirmation modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <h2 className="font-semibold text-gray-900">Submit Test?</h2>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              You&apos;ve answered <strong>{answeredIds.length}</strong> of <strong>{questions.length}</strong> questions.
              {answeredIds.length < questions.length && (
                <span className="text-amber-600"> {questions.length - answeredIds.length} unanswered questions will be marked incorrect.</span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <span className="font-semibold text-gray-900 text-sm">{testName}</span>
          <div className="flex-1 max-w-sm">
            <ProgressBar current={current} total={questions.length} answered={answeredIds.length} />
          </div>
          <Timer startSeconds={timeLimitSeconds} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 flex gap-6">
        {/* Main question area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
              {question.section.name} · Q{current + 1}/{questions.length}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                question.difficulty === "easy" ? "bg-green-100 text-green-700" :
                question.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>{question.difficulty}</span>
            </div>

            <QuestionCard
              question={question}
              selectedId={selected[question.id]}
              onSelect={handleSelect}
            />
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setCurrent(c => c - 1)}
              disabled={current === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent(c => c + 1)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60"
              >
                <Send className="w-4 h-4" /> {submitting ? "Submitting…" : "Submit Test"}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar: nav dots */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm sticky top-24">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Question Map</p>
            <NavDots
              total={questions.length}
              current={current}
              answered={answeredIds}
              questions={questions.map(q => q.id)}
              onNavigate={setCurrent}
            />
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded inline-block" /> Answered</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 border border-gray-300 rounded inline-block" /> Skipped</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-4 w-full py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit Test"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
