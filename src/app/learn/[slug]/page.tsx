import { notFound } from "next/navigation";
import { LESSONS, LEARN_HUBS, getLesson } from "@/content/curriculum";
import { LessonView } from "@/components/learn/LessonView";

export function generateStaticParams() {
  return LESSONS.filter((c) => !LEARN_HUBS.has(c.slug) && c.slug !== "archetypes").map((c) => ({ slug: c.slug }));
}

export default async function LearnLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson || LEARN_HUBS.has(lesson.slug)) notFound();
  return <LessonView lesson={lesson} />;
}
