export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FlashcardClient } from "@/components/flashcards/FlashcardClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ testSlug: string }>;
  searchParams: Promise<{ section?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testSlug } = await params;
  const test = await prisma.test.findUnique({ where: { slug: testSlug } });
  if (!test) return {};
  return {
    title: `${test.name} Flashcards | CDLPrepKit`,
    description: `Study ${test.name} questions as flashcards. Flip, review, and master every topic at your own pace.`,
  };
}

export default async function FlashcardDeckPage({ params, searchParams }: Props) {
  const { testSlug } = await params;
  const { section } = await searchParams;

  const test = await prisma.test.findUnique({
    where: { slug: testSlug },
    include: { sections: true },
  });
  if (!test) notFound();

  const sectionFilter = section
    ? { section: { testId: test.id, code: section } }
    : { section: { testId: test.id } };

  const questions = await prisma.question.findMany({
    where: sectionFilter,
    include: {
      answers: true,
      section: { select: { name: true, code: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  if (questions.length === 0) notFound();

  const deckName = section
    ? `${test.name} — ${test.sections.find((s) => s.code === section)?.name ?? section}`
    : test.name;

  return (
    <FlashcardClient
      questions={questions.map((q) => ({
        id: q.id,
        text: q.text,
        explanation: q.explanation ?? "",
        difficulty: q.difficulty,
        section: q.section,
        answers: q.answers,
      }))}
      testName={deckName}
    />
  );
}
