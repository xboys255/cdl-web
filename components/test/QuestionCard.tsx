"use client";

import { cn } from "@/lib/utils";
import type { QuestionWithAnswers } from "@/types";

interface QuestionCardProps {
  question: QuestionWithAnswers;
  selectedId: string | undefined;
  onSelect: (answerId: string) => void;
  showResult?: boolean;
}

const LETTERS = ["A", "B", "C", "D", "E"];

export function QuestionCard({ question, selectedId, onSelect, showResult = false }: QuestionCardProps) {
  return (
    <div className="space-y-4">
      <p className="text-base font-medium text-gray-900 leading-relaxed whitespace-pre-line">
        {question.text}
      </p>

      <div className="space-y-2">
        {question.answers.map((answer, i) => {
          const isSelected = selectedId === answer.id;
          const isCorrect = answer.isCorrect;

          let stateClass = "border-gray-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer";
          if (showResult) {
            if (isCorrect) stateClass = "border-green-400 bg-green-50 cursor-default";
            else if (isSelected && !isCorrect) stateClass = "border-red-400 bg-red-50 cursor-default";
            else stateClass = "border-gray-200 cursor-default opacity-60";
          } else if (isSelected) {
            stateClass = "border-orange-500 bg-orange-50 cursor-pointer";
          }

          return (
            <button
              key={answer.id}
              onClick={() => !showResult && onSelect(answer.id)}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3 rounded-lg border text-left transition-all",
                stateClass
              )}
            >
              <span className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full border-2 text-xs font-bold flex items-center justify-center mt-0.5",
                isSelected && !showResult ? "border-orange-500 bg-orange-500 text-white" :
                showResult && isCorrect ? "border-green-500 bg-green-500 text-white" :
                showResult && isSelected ? "border-red-500 bg-red-500 text-white" :
                "border-gray-300 text-gray-500"
              )}>
                {LETTERS[i]}
              </span>
              <span className="text-sm text-gray-800 leading-relaxed">{answer.text}</span>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Explanation</p>
          <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
