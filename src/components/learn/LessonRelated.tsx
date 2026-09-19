import Link from "next/link";
import { LoadSampleSix } from "@/components/learn/LoadSampleSix";
import { SampleSix } from "@/components/learn/SampleSix";
import { nextLesson, type LearnTrack, type Lesson } from "@/content/curriculum";
import { nextDoublesLesson } from "@/content/curriculum-doubles";
import { CANONICAL_MANUALS, manualHref } from "@/content/manuals";
import { ARCHETYPES, archetypeHref } from "@/content/archetypes";
import { manualsHref } from "@/lib/format";

export function LessonRelated({
  lesson,
  track,
}: {
  lesson: Lesson;
  track: LearnTrack;
}) {
  const doubles = track === "doubles";
  const manuals = doubles ? [] : CANONICAL_MANUALS.filter((m) => lesson.relatedManuals.includes(m.id));

  return (
    <>
      {lesson.slug === "archetypes" ? (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Classroom threes</h2>
          <ul className="mt-6 space-y-8">
            {ARCHETYPES.map((style) => (
              <li key={style.id} className="rounded-[28px] border border-line bg-raised/40 p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <Link href={archetypeHref(style.id)} className="text-xl font-semibold tracking-tight hover:underline">
                      {style.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{style.oneLiner}</p>
                  </div>
                  <LoadSampleSix slugs={style.sampleSix} intent={style.id} />
                </div>
                <div className="mt-4">
                  <SampleSix slugs={style.sampleSix} note={style.sampleNote} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lesson.slug === "jobs" ? (
        <p className="mt-10 text-sm text-muted">
          Jump into a job:{" "}
          <Link href="/learn/roles" className="underline">
            the five chapters
          </Link>
          . Sweeper and wall are translations.
        </p>
      ) : null}

      {manuals.length ? (
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Exam</h2>
          <p className="mt-2 text-sm text-muted">Manuals are the practicum. The tree is the test.</p>
          <ul className="mt-4 divide-y divide-line rounded-[28px] border border-line">
            {manuals.map((m) => (
              <li key={m.id}>
                <Link href={manualHref(m.id)} className="block px-5 py-4 transition hover:bg-raised/70">
                  <p className="font-semibold tracking-tight">{m.title}</p>
                  <p className="mt-1 text-sm text-muted">{m.lede}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {doubles ? (
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Doubles shelf</h2>
          <p className="mt-2 text-sm text-muted">
            Same write-up schema as Singles. Team, Live, and Ranked Meta stay Singles tools — study here, then Review.
          </p>
          <ul className="mt-4 divide-y divide-line rounded-[28px] border border-[color-mix(in_srgb,var(--format-doubles-accent)_40%,var(--line))]">
            <li>
              <Link
                href={manualsHref("doubles")}
                className="block px-5 py-4 transition hover:bg-[var(--format-doubles-wash)]"
              >
                <p className="font-semibold tracking-tight">Doubles field manuals</p>
                <p className="mt-1 text-sm text-muted">Bring-4 packages · pair language · teal chrome</p>
              </Link>
            </li>
            <li>
              <Link href="/learn/review" className="block px-5 py-4 transition hover:bg-raised/70">
                <p className="font-semibold tracking-tight">Shared Review</p>
                <p className="mt-1 text-sm text-muted">After-battle skill is format-agnostic. Name the turn.</p>
              </Link>
            </li>
          </ul>
        </section>
      ) : null}

      {lesson.slug === "keeping-up" ||
      lesson.slug === "review" ||
      lesson.slug === "positioning" ||
      lesson.slug === "tempo" ? (
        <p className="mt-10 text-sm text-muted">
          Dated snapshot:{" "}
          <Link href="/meta" className="underline">
            Ranked Meta
          </Link>
          {doubles ? " (singles usage — say so when you use it)" : ""}. Words you will hear:{" "}
          <Link href="/glossary" className="underline">
            Glossary
          </Link>
          .
        </p>
      ) : null}

      {doubles && lesson.slug === "doubles-positioning" ? (
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">After the battle</h2>
          <p className="mt-2 text-sm text-muted">
            Review and keeping up are the same skills on singles. Ranked Meta here is a 3v3 snapshot.
          </p>
          <ul className="mt-4 divide-y divide-line rounded-[28px] border border-line">
            <li>
              <Link href="/learn/review" className="block px-5 py-4 transition hover:bg-raised/70">
                <p className="font-semibold tracking-tight">Why did that happen?</p>
                <p className="mt-1 text-sm text-muted">Name the turn. Take the loss. Know when to stop.</p>
              </Link>
            </li>
            <li>
              <Link href="/learn/keeping-up" className="block px-5 py-4 transition hover:bg-raised/70">
                <p className="font-semibold tracking-tight">What is everyone using?</p>
                <p className="mt-1 text-sm text-muted">Usage and sets. Then the Champion practicum on manuals.</p>
              </Link>
            </li>
          </ul>
        </section>
      ) : null}

      <LessonNext slug={lesson.slug} track={track} />
    </>
  );
}

function LessonNext({ slug, track }: { slug: string; track: LearnTrack }) {
  const next = track === "doubles" ? nextDoublesLesson(slug) : nextLesson(slug);
  if (!next) return null;
  return (
    <Link href={next.href} className="mt-12 block text-sm text-muted hover:text-ink">
      Next: {next.title}
    </Link>
  );
}
