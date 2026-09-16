import Link from "next/link";
import { getLesson, nextLesson } from "@/content/curriculum";

/** Compact skip/jump line used under classroom bodies. */
export function JumpShelf({ current }: { current: string }) {
  const lesson = getLesson(current);
  if (!lesson) return null;
  const next = nextLesson(current);
  return (
    <p className="mt-12 text-sm text-muted">
      Skip if you already {lesson.skipIf.replace(/^Skip if you already /i, "").replace(/\.$/, "")}.{" "}
      {next ? (
        <Link href={next.href} className="underline hover:text-ink">
          Jump to {next.title}
        </Link>
      ) : null}
    </p>
  );
}

/** @deprecated Prefer LessonPlanNav — kept for any lingering imports. */
export { LessonPlanNav as LessonNav } from "@/components/learn/LessonPlanNav";
