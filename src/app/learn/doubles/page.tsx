import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { BallIcon } from "@/components/learn/BallIcon";
import { BANDS } from "@/content/curriculum";
import {
  DOUBLES_LESSONS,
  DOUBLES_BAND_SKIP,
  doublesLessonHref,
  doublesLessonsByBand,
} from "@/content/curriculum-doubles";

export default function DoublesLearnIndex() {
  return (
    <div>
      <p className="text-sm text-muted">
        <Link href="/learn" className="hover:text-ink">
          Learn
        </Link>
      </p>
      <h1 className="mt-2 max-w-[16ch] text-4xl font-semibold tracking-tight md:text-5xl">Doubles</h1>
      <p className="mt-4 max-w-[52ch] text-lg text-muted">
        Pick four from six. Two Pokémon on the field. This classroom is doubles only — perish trap, dual Mega, pair
        Protect. Team, manuals, and Ranked Meta on this app stay 3v3 singles.
      </p>

      <div className="mt-14 space-y-16">
        {BANDS.map((band) => {
          const lessons = doublesLessonsByBand(band.id);
          if (!lessons.length) return null;
          return (
            <section key={band.id} id={band.id}>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BallIcon band={band.id} size={40} decorative={false} />
                  <h2 className="text-2xl font-semibold tracking-tight">{band.title}</h2>
                </div>
                <p className="max-w-[42ch] text-sm text-muted">{DOUBLES_BAND_SKIP[band.id]}</p>
              </div>
              <ul className="mt-5 grid gap-3 md:grid-cols-2">
                {lessons.map((lesson, i) => (
                  <li key={lesson.slug}>
                    <DoublesCard slug={lesson.slug} index={i + 1} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="mt-20 grid gap-3 md:grid-cols-3">
        <Link
          href="/learn/review"
          className="block rounded-[28px] border border-line bg-raised/40 p-6 transition hover:bg-raised"
        >
          <h2 className="text-xl font-semibold tracking-tight">Review</h2>
          <p className="mt-2 text-sm text-muted">After-battle is the same skill. Name the turn. Then stop if you tilt.</p>
        </Link>
        <Link
          href="/learn/keeping-up"
          className="block rounded-[28px] border border-line bg-raised/40 p-6 transition hover:bg-raised"
        >
          <h2 className="text-xl font-semibold tracking-tight">Keeping up</h2>
          <p className="mt-2 text-sm text-muted">Usage and sets. Ranked Meta here is a singles snapshot.</p>
        </Link>
        <Link
          href="/learn"
          className="block rounded-[28px] border border-line bg-raised/40 p-6 transition hover:bg-raised"
        >
          <h2 className="text-xl font-semibold tracking-tight">3v3 singles</h2>
          <p className="mt-2 text-sm text-muted">Poké Ball to Master Ball. Manuals are the exam.</p>
        </Link>
      </section>
    </div>
  );
}

function DoublesCard({ slug, index }: { slug: string; index: number }) {
  const lesson = DOUBLES_LESSONS.find((l) => l.slug === slug);
  if (!lesson) return null;
  const faces = lesson.examples.slice(0, 3).map((e) => getPokemon(e.slug));
  return (
    <Link
      href={doublesLessonHref(lesson.slug)}
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
