import { notFound } from "next/navigation";
import { getLesson } from "@/content/curriculum";
import { LessonView } from "@/components/learn/LessonView";

export default function ArchetypesLesson() {
  const lesson = getLesson("archetypes");
  if (!lesson) notFound();
  return <LessonView lesson={lesson} />;
}
