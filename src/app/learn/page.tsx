import Link from "next/link";
import { PageFrame } from "@/components/chrome/PageFrame";
import { getPokemon } from "@/lib/catalog/load";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { BallIcon } from "@/components/learn/BallIcon";
import { BANDS, LESSONS, lessonHref, lessonsByBand } from "@/content/curriculum";

export default function LearnIndex() {
  return (
    <PageFrame variant="tool">
      <h1 className="max-w-[12ch] text-4xl font-semibold tracking-tight md:text-5xl">Learn</h1>
      <p className="mt-4 max-w-[52ch] text-lg text-muted">
        Poké Ball to Master Ball for Champions 3v3 singles. Skip any rank. Manuals are the exam. Doubles — pick four,
        two on the field — is a separate classroom.
      </p>

      <div className="mt-14 space-y-16">
        {BANDS.map((band) => (
          <section key={band.id} id={band.id}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex items-center gap-3">
                <BallIcon band={band.id} size={40} decorative={false} />
                <h2 className="text-2xl font-semibold tracking-tight">{band.title}</h2>
              </div>
              <p className="max-w-[42ch] text-sm text-muted">{band.skipIf}</p>
            </div>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {lessonsByBand(band.id).map((lesson, i) => (
                <li key={lesson.slug}>
                  <LessonCard slug={lesson.slug} index={i + 1} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-20 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/learn/doubles"
          className="block rounded-[28px] border border-line bg-raised/40 p-6 transition hover:bg-raised"
        >
          <h2 className="text-xl font-semibold tracking-tight">Doubles</h2>
          <p className="mt-2 text-sm text-muted">Pick four, two on the field. Perish, dual Mega, pair Protect.</p>
        </Link>
        <Link
          href="/manuals"
          className="block rounded-[28px] border border-line bg-raised/40 p-6 transition hover:bg-raised"
        >
          <h2 className="text-xl font-semibold tracking-tight">Field manuals</h2>
          <p className="mt-2 text-sm text-muted">The practicum. If/Then trees on classroom threes.</p>
        </Link>
        <Link
          href="/meta"
          className="block rounded-[28px] border border-line bg-raised/40 p-6 transition hover:bg-raised"
        >
          <h2 className="text-xl font-semibold tracking-tight">Ranked Meta</h2>
          <p className="mt-2 text-sm text-muted">Dated singles snapshot. Homework after you can read a preview.</p>
        </Link>
        <Link
          href="/glossary"
          className="block rounded-[28px] border border-line bg-raised/40 p-6 transition hover:bg-raised"
        >
          <h2 className="text-xl font-semibold tracking-tight">Glossary</h2>
          <p className="mt-2 text-sm text-muted">Check, counter, never-leave, 50/50. The words other guides use.</p>
        </Link>
      </section>
    </PageFrame>
  );
}

function LessonCard({ slug, index }: { slug: string; index: number }) {
  const lesson = LESSONS.find((l) => l.slug === slug);
  if (!lesson) return null;
  const faces = lesson.examples.slice(0, 3).map((e) => getPokemon(e.slug));
  return (
    <Link
      href={lessonHref(lesson.slug)}
      className="block rounded-[28px] border border-line bg-raised/40 p-5 transition hover:bg-raised"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Lesson {index}</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight">{lesson.title}</h3>
          <p className="mt-2 text-sm text-muted">{lesson.thesis}</p>
        </div>
        <div className="flex shrink-0 -space-x-2">
          {faces.map((p) =>
            p ? (
              <span key={p.slug} className="rounded-full bg-sunken ring-2 ring-raised">
                <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={40} />
              </span>
            ) : null,
          )}
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">{lesson.skipIf}</p>
    </Link>
  );
}
