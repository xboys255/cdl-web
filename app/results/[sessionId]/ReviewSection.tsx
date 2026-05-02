"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/test/QuestionCard";
import { ChevronDown, ChevronUp } from "lucide-react";
type Difficulty = "easy" | "medium" | "hard";

interface ReviewItem {
  questionId: string;
  questionText: string;
  explanation: string;
  sectionCode: string;
  sectionName: string;
  difficulty: Difficulty;
  selectedAnswerId: string | null;
  answers: { id: string; text: string; isCorrect: boolean }[];
  isCorrect: boolean;
}

export function ReviewSection({ items }: { items: ReviewItem[] }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "wrong" | "correct">("all");

  const filtered = items.filter(i =>
    filter === "all" ? true :
    filter === "wrong" ? !i.isCorrect :
    i.isCorrect
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50"
      >
        <div>
          <h2 className="font-bold text-gray-900 text-left">Review All Questions</h2>
          <p className="text-sm text-gray-500 text-left">
            {items.filter(i => !i.isCorrect).length} incorrect · {items.filter(i => i.isCorrect).length} correct
          </p>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100">
          {/* Filter tabs */}
          <div className="flex gap-2 p-4 border-b border-gray-100">
            {(["all", "wrong", "correct"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-all ${
                  filter === f ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "all" ? `All (${items.length})` :
                 f === "wrong" ? `Wrong (${items.filter(i => !i.isCorrect).length})` :
                 `Correct (${items.filter(i => i.isCorrect).length})`}
              </button>
            ))}
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.map((item, idx) => (
              <div key={item.questionId} className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    item.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>{item.isCorrect ? "✓" : "✗"}</span>
                  <span className="text-xs text-gray-400">{item.sectionName} · Q{idx + 1}</span>
                </div>
                <QuestionCard
                  question={{
                    id: item.questionId,
                    text: item.questionText,
                    explanation: item.explanation,
                    imageUrl: null,
                    difficulty: item.difficulty,
                    sectionId: "",
                    section: { code: item.sectionCode, name: item.sectionName },
                    answers: item.answers,
                  }}
                  selectedId={item.selectedAnswerId ?? undefined}
                  onSelect={() => {}}
                  showResult
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
