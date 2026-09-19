import Link from "next/link";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import type { Lesson, LessonBeat, LessonExample } from "@/content/curriculum";

/** Doubles open lesson — same shape as FightClassroom, pair language + teal chrome. */
export function DoublesFightClassroom({ lesson }: { lesson: Lesson }) {
  return (
    <div className="mt-10 space-y-16 [--classroom-accent:var(--format-doubles-accent)]">
      {lesson.body.map((p) => (
        <p key={p} className="max-w-[58ch] text-[17px] leading-relaxed text-muted">
          {p}
        </p>
      ))}

      {lesson.rules?.length ? (
        <section aria-label="Doubles format rules">
          <h2 className="text-2xl font-semibold tracking-tight">The board you play on</h2>
          <p className="mt-2 max-w-[48ch] text-sm text-muted">
            Same constraints every doubles game. Memorize the pair verbs; the rest of this track is how to use them.
          </p>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--format-doubles-accent)_45%,var(--line))] bg-[color-mix(in_srgb,var(--format-doubles-accent)_35%,var(--line))] sm:grid-cols-2 lg:grid-cols-3">
            {lesson.rules.map((rule) => (
              <li key={rule.label} className="bg-raised/90 px-4 py-4">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--format-doubles-accent)]">
                  {rule.label}
                </p>
                <p className="mt-1.5 text-[15px] font-medium tracking-tight">{rule.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lesson.beats.map((beat) => (
        <PairBeat key={beat.title} beat={beat} />
      ))}
    </div>
  );
}

function PairBeat({ beat }: { beat: LessonBeat }) {
  return (
    <section className="grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{beat.title}</h2>
        <p className="mt-3 max-w-[52ch] text-[17px] leading-relaxed text-muted">{beat.body}</p>
        {beat.takeaway ? (
          <p className="mt-4 max-w-[48ch] border-t border-line pt-3 text-[15px] leading-snug">
            {beat.takeaway}
          </p>
        ) : null}
        {beat.rows?.length ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-line">
            <ul className="divide-y divide-line">
              {beat.rows.map((row) => (
                <li
                  key={row.label}
                  className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-3 px-4 py-3 text-sm sm:grid-cols-[10rem_1fr]"
                >
                  <span className="font-medium tracking-tight">{row.label}</span>
                  <span className="text-muted">{row.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <ExamplePanel example={beat.example} />
    </section>
  );
}

function ExamplePanel({ example }: { example?: LessonExample }) {
  if (!example) return null;
  const mon = getPokemon(example.slug);
  if (!mon) return null;
  return (
    <Link
      href={`/pokemon/${mon.slug}`}
      className="block rounded-[28px] border border-[color-mix(in_srgb,var(--format-doubles-accent)_40%,var(--line))] bg-[var(--format-doubles-wash)] p-5 transition hover:border-[var(--format-doubles-accent)]"
      style={cssVars(mon.palette)}
    >
      <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={96} />
      <p className="mt-3 text-lg font-semibold tracking-tight">{mon.name}</p>
      <p className="mt-1 text-sm text-muted">{example.caption}</p>
    </Link>
  );
}
