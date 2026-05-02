"use client";

import { cn } from "@/lib/utils";

interface NavDotsProps {
  total: number;
  current: number;
  answered: string[];   // questionIds answered
  questions: string[];  // all questionIds in order
  onNavigate: (index: number) => void;
}

export function NavDots({ total, current, answered, questions, onNavigate }: NavDotsProps) {
  const answeredSet = new Set(answered);

  return (
    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
      {questions.map((qId, i) => {
        const isAnswered = answeredSet.has(qId);
        const isCurrent = i === current;

        return (
          <button
            key={qId}
            onClick={() => onNavigate(i)}
            title={`Question ${i + 1}${isAnswered ? " (answered)" : ""}`}
            className={cn(
              "w-7 h-7 rounded text-xs font-medium transition-all",
              isCurrent && "ring-2 ring-orange-500 ring-offset-1",
              isAnswered ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
