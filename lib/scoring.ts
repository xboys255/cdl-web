export type SectionScores = Record<string, { correct: number; total: number }>;

export interface ScoreReport {
  raw: { correct: number; total: number };
  pct: number;
  passed: boolean;
  sectionBreakdown: Record<string, { correct: number; total: number; pct: number; passed: boolean }>;
}

export function computeScore(sectionScores: SectionScores): ScoreReport {
  let totalCorrect = 0;
  let totalQ = 0;

  const sectionBreakdown: ScoreReport["sectionBreakdown"] = {};

  for (const [code, s] of Object.entries(sectionScores)) {
    const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    sectionBreakdown[code] = { correct: s.correct, total: s.total, pct, passed: pct >= 80 };
    totalCorrect += s.correct;
    totalQ += s.total;
  }

  const pct = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;

  return {
    raw: { correct: totalCorrect, total: totalQ },
    pct,
    passed: pct >= 80,
    sectionBreakdown,
  };
}
