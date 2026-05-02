import type { Difficulty, TestType } from "@prisma/client";

export type { Difficulty, TestType };

export interface QuestionWithAnswers {
  id: string;
  text: string;
  imageUrl: string | null;
  difficulty: Difficulty;
  explanation: string;
  sectionId: string;
  section: { code: string; name: string };
  answers: AnswerOption[];
}

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface SessionState {
  sessionId: string;
  questions: QuestionWithAnswers[];
  current: number;
  selected: Record<string, string>; // questionId -> answerId
  flagged: Set<string>;
  submittedAt: string | null;
}
