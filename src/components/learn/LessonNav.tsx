import Link from "next/link";
import {
  BANDS,
  BAND_FIRST,
  getLesson,
  lessonHref,
  nextLesson,
  type LearnTrack,
  type Lesson,
} from "@/content/curriculum";
import {
  DOUBLES_BAND_FIRST,
  DOUBLES_BAND_SKIP,
  doublesLessonHref,
  nextDoublesLesson,
} from "@/content/curriculum-doubles";

export function LessonNav({
  lesson,
  track = lesson.track ?? "singles",
}: {
  lesson: Lesson;
  track?: LearnTrack;
}) {
  const doubles = track === "doubles";
  const next = doubles ? nextDoublesLesson(lesson.slug) : nextLesson(lesson.slug);
  const band = BANDS.find((b) => b.id === lesson.band);
  const first = doubles ? DOUBLES_BAND_FIRST : BAND_FIRST;
  const hrefFor = doubles ? doublesLessonHref : lessonHref;
  const jumps = BANDS.map((b) => ({ ...b, href: hrefFor(first[b.id]) }));

  return (
    <nav
      aria-label="On this lesson"
      className="sticky top-0 z-30 -mx-4 -mt-6 border-b border-line/70 bg-bg/90 px-4 py-2 backdrop-blur-md md:top-16 md:-mx-6 md:-mt-10 md:px-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ul className="flex gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {jumps.map((j) => {
            const on = j.id === lesson.band;
            return (
              <li key={j.id} className="shrink-0">
                <Link
                  href={j.href}
                  className={`inline-flex min-h-9 items-center rounded-full px-3.5 text-sm transition ${
                    on ? "bg-ink text-bg" : "bg-white/6 text-muted hover:bg-white/10 hover:text-ink"
                  }`}
                >
                  {j.title}
                </Link>
              </li>
            );
          })}
        </ul>
        {next ? (
          <Link href={next.href} className="shrink-0 text-sm text-muted hover:text-ink">
            Up next: {next.title}
          </Link>
        ) : null}
      </div>
      {band ? (
        <p className="mt-1 hidden text-[11px] text-muted sm:block">
          {doubles ? DOUBLES_BAND_SKIP[band.id] : band.skipIf}
        </p>
      ) : null}
    </nav>
  );
}

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
