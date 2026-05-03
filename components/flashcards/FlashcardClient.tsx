"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface FlashcardQuestion {
  id: string;
  text: string;
  explanation: string;
  difficulty: string;
  section: { name: string; code: string };
  answers: Answer[];
}

interface FlashcardClientProps {
  questions: FlashcardQuestion[];
  testName: string;
}

type CardStatus = "known" | "missed" | "unseen";

export function FlashcardClient({ questions: initialQuestions, testName }: FlashcardClientProps) {
  const [queue, setQueue] = useState<FlashcardQuestion[]>(initialQuestions);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, CardStatus>>({});
  const [done, setDone] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const question = queue[current];
  const correctAnswer = question?.answers.find((a) => a.isCorrect);

  const total = queue.length;
  const knownCount = Object.values(statusMap).filter((s) => s === "known").length;
  const missedCount = Object.values(statusMap).filter((s) => s === "missed").length;

  const advance = useCallback(() => {
    if (current + 1 >= queue.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setFlipped(false);
    }
  }, [current, queue.length]);

  const markKnown = useCallback(() => {
    setStatusMap((prev) => ({ ...prev, [question.id]: "known" }));
    advance();
  }, [question?.id, advance]);

  const markMissed = useCallback(() => {
    setStatusMap((prev) => ({ ...prev, [question.id]: "missed" }));
    advance();
  }, [question?.id, advance]);

  const skipCard = useCallback(() => {
    advance();
  }, [advance]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (e.key === "ArrowRight") skipCard();
      if (flipped && e.key === "g") markKnown();
      if (flipped && e.key === "r") markMissed();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flipped, done, skipCard, markKnown, markMissed]);

  const restartWithMissed = () => {
    const missed = initialQuestions.filter((q) => statusMap[q.id] === "missed");
    if (missed.length === 0) return;
    setQueue(missed);
    setCurrent(0);
    setFlipped(false);
    setStatusMap({});
    setDone(false);
    setReviewMode(true);
  };

  const restartAll = () => {
    setQueue(initialQuestions);
    setCurrent(0);
    setFlipped(false);
    setStatusMap({});
    setDone(false);
    setReviewMode(false);
  };

  const difficultyColor = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
  } as Record<string, string>;

  // ── Done screen ─────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center space-y-6">
          <div className="text-5xl">🎉</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {reviewMode ? "Review Complete!" : "Deck Complete!"}
            </h2>
            <p className="text-gray-500 mt-1">You went through all {total} cards.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-600">{knownCount}</div>
              <div className="text-sm text-green-700 mt-1">Got it ✓</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-red-500">{missedCount}</div>
              <div className="text-sm text-red-600 mt-1">Need review</div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {missedCount > 0 && (
              <button
                onClick={restartWithMissed}
                className="w-full py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700"
              >
                Review {missedCount} Missed Card{missedCount !== 1 ? "s" : ""}
              </button>
            )}
            <button
              onClick={restartAll}
              className="w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Start Over (All {initialQuestions.length} Cards)
            </button>
            <Link
              href="/flashcards"
              className="w-full py-2.5 text-sm font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 text-center"
            >
              ← Back to Flashcards
            </Link>
            <Link
              href="/tests"
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Take a Full Practice Test
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Flashcard screen ─────────────────────────────────────────────────────────
  const progress = Math.round(((current) / total) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Link href="/flashcards" className="text-sm text-gray-400 hover:text-gray-600">← Exit</Link>
          <div className="flex-1 max-w-xs">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{reviewMode ? "Review Mode" : testName}</span>
              <span>{current + 1} / {total}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-gray-400 text-right">
            <span className="text-green-600 font-semibold">{knownCount}✓</span>
            {" / "}
            <span className="text-red-500 font-semibold">{missedCount}↩</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Flashcard */}
        <div
          className="cursor-pointer"
          style={{ perspective: "1000px" }}
          onClick={() => setFlipped((f) => !f)}
        >
          <div
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.45s ease",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              position: "relative",
              minHeight: "320px",
            }}
          >
            {/* Front */}
            <div
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
              className="absolute inset-0 bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  {question.section.name}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColor[question.difficulty] ?? "bg-gray-100 text-gray-600"}`}>
                  {question.difficulty}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center py-6">
                <p className="text-xl font-semibold text-gray-900 text-center leading-relaxed">
                  {question.text}
                </p>
              </div>
              <div className="text-center text-sm text-gray-400">
                Tap to reveal answer · <kbd className="bg-gray-100 px-1 rounded text-xs">Space</kbd>
              </div>
            </div>

            {/* Back */}
            <div
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              className="absolute inset-0 bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400">ANSWER</span>
              </div>
              <div className="space-y-2 flex-1">
                {question.answers.map((a) => (
                  <div
                    key={a.id}
                    className={`px-4 py-3 rounded-lg text-sm font-medium ${
                      a.isCorrect
                        ? "bg-green-50 border border-green-300 text-green-800"
                        : "bg-gray-50 border border-gray-200 text-gray-500"
                    }`}
                  >
                    {a.isCorrect && <span className="mr-2">✓</span>}
                    {a.text}
                  </div>
                ))}
              </div>
              {question.explanation && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-800">
                  <span className="font-semibold">Why: </span>{question.explanation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        {!flipped ? (
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setFlipped(true)}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700"
            >
              Flip Card
            </button>
            <button
              onClick={skipCard}
              className="px-4 py-2.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Skip →
            </button>
          </div>
        ) : (
          <div className="flex gap-3 justify-center">
            <button
              onClick={markMissed}
              className="flex-1 max-w-[180px] py-3 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600"
            >
              ↩ Review Again
              <span className="block text-xs font-normal opacity-75">(press R)</span>
            </button>
            <button
              onClick={markKnown}
              className="flex-1 max-w-[180px] py-3 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700"
            >
              ✓ Got It
              <span className="block text-xs font-normal opacity-75">(press G)</span>
            </button>
          </div>
        )}

        {/* Keyboard hint */}
        <p className="text-center text-xs text-gray-400">
          <kbd className="bg-gray-100 px-1 rounded">Space</kbd> flip ·{" "}
          <kbd className="bg-gray-100 px-1 rounded">→</kbd> skip ·{" "}
          <kbd className="bg-gray-100 px-1 rounded">G</kbd> got it ·{" "}
          <kbd className="bg-gray-100 px-1 rounded">R</kbd> review again
        </p>
      </div>
    </div>
  );
}
