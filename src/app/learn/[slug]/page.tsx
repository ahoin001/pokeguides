import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LESSONS, LEARN_HUBS, getLesson } from "@/content/curriculum";
import { LessonView } from "@/components/learn/LessonView";

export function generateStaticParams() {
  return LESSONS.filter((c) => !LEARN_HUBS.has(c.slug) && c.slug !== "archetypes").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson || LEARN_HUBS.has(lesson.slug)) return { title: "Lesson" };
  return {
    title: lesson.title,
    description: lesson.thesis,
  };
}

export default async function LearnLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson || LEARN_HUBS.has(lesson.slug)) notFound();
  return <LessonView lesson={lesson} track="singles" />;
}
