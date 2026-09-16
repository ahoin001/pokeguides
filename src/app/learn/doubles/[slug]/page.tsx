import { notFound } from "next/navigation";
import { LessonView } from "@/components/learn/LessonView";
import { DOUBLES_LESSONS, getDoublesLesson } from "@/content/curriculum-doubles";

export function generateStaticParams() {
  return DOUBLES_LESSONS.map((c) => ({ slug: c.slug }));
}

export default async function DoublesLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getDoublesLesson(slug);
  if (!lesson) notFound();
  return <LessonView lesson={lesson} track="doubles" />;
}
