import Link from "next/link";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import type { Lesson, LessonBeat, LessonExample } from "@/content/curriculum";

export function TypesClassroom({ lesson }: { lesson: Lesson }) {
  const [resist, immune, shared] = lesson.beats;

  return (
    <div className="mt-10 space-y-16">
      {lesson.body.map((p) => (
        <p key={p} className="max-w-[58ch] text-[17px] leading-relaxed text-muted">
          {p}
        </p>
      ))}

      {lesson.rules?.length ? (
        <section aria-label="Type multipliers">
          <h2 className="text-2xl font-semibold tracking-tight">The numbers on the chart</h2>
          <p className="mt-2 max-w-[48ch] text-sm text-muted">
            Five ideas cover almost every type decision you make in singles.
          </p>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {lesson.rules.map((rule) => (
              <li key={rule.label} className="bg-raised/80 px-4 py-4">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  {rule.label}
                </p>
                <p className="mt-1.5 text-[15px] font-medium tracking-tight">{rule.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {resist ? <ResistBeat beat={resist} /> : null}
      {immune ? <ImmuneBeat beat={immune} /> : null}
      {shared ? <SharedWeaknessBeat beat={shared} /> : null}
    </div>
  );
}

function ResistBeat({ beat }: { beat: LessonBeat }) {
  return (
    <section className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{beat.title}</h2>
        <p className="mt-3 max-w-[52ch] text-[17px] leading-relaxed text-muted">{beat.body}</p>
        {beat.takeaway ? <Takeaway text={beat.takeaway} /> : null}
      </div>
      <div className="space-y-3">
        {beat.rows?.length ? (
          <ul className="overflow-hidden rounded-2xl border border-line">
            {beat.rows.map((row, i) => (
              <li
                key={row.label}
                className={`px-4 py-4 ${i > 0 ? "border-t border-line" : ""} bg-raised/40`}
              >
                <p className="font-medium tracking-tight">{row.label}</p>
                <p className="mt-1 text-sm text-muted">{row.detail}</p>
              </li>
            ))}
          </ul>
        ) : null}
        <ExampleLink example={beat.example} horizontal />
      </div>
    </section>
  );
}

function ImmuneBeat({ beat }: { beat: LessonBeat }) {
  return (
    <section className="rounded-[28px] border border-line bg-raised/35 px-5 py-7 sm:px-8 sm:py-9">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.55fr)] md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{beat.title}</h2>
          <p className="mt-3 max-w-[54ch] text-[17px] leading-relaxed text-muted">{beat.body}</p>
          {beat.takeaway ? <Takeaway text={beat.takeaway} /> : null}
        </div>
        <ExampleLink example={beat.example} compact />
      </div>
    </section>
  );
}

function SharedWeaknessBeat({ beat }: { beat: LessonBeat }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">{beat.title}</h2>
      <p className="mt-3 max-w-[54ch] text-[17px] leading-relaxed text-muted">{beat.body}</p>

      {beat.rows?.length ? (
        <ol className="mt-8 grid gap-3 sm:grid-cols-3">
          {beat.rows.map((row, i) => (
            <li key={row.label} className="rounded-2xl border border-line bg-sunken/50 px-4 py-5">
              <p className="font-mono text-[11px] tabular-nums text-muted">{i + 1}</p>
              <p className="mt-2 text-lg font-semibold tracking-tight">{row.label}</p>
              <p className="mt-2 text-sm text-muted">{row.detail}</p>
            </li>
          ))}
        </ol>
      ) : null}

      {beat.takeaway ? <Takeaway text={beat.takeaway} /> : null}
      <div className="mt-6">
        <ExampleLink example={beat.example} horizontal />
      </div>
    </section>
  );
}

function Takeaway({ text }: { text: string }) {
  return (
    <p className="mt-5 max-w-[48ch] border-t border-line pt-4 text-[15px] leading-snug text-ink">
      {text}
    </p>
  );
}

function ExampleLink({
  example,
  compact,
  horizontal,
}: {
  example?: LessonExample;
  compact?: boolean;
  horizontal?: boolean;
}) {
  if (!example) return null;
  const mon = getPokemon(example.slug);
  if (!mon) return null;

  if (horizontal) {
    return (
      <Link
        href={`/pokemon/${mon.slug}`}
        className="inline-flex max-w-full items-center gap-3 rounded-2xl border border-line bg-raised/50 px-3 py-2 transition hover:border-ink/30"
        style={cssVars(mon.palette)}
      >
        <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={52} />
        <span className="min-w-0">
          <span className="block truncate font-medium tracking-tight">{mon.name}</span>
          <span className="block text-sm text-muted">{example.caption}</span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/pokemon/${mon.slug}`}
      className={`block rounded-[28px] border border-line bg-raised/50 transition hover:border-ink/30 ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
      style={cssVars(mon.palette)}
    >
      <div className={`flex ${compact ? "items-center gap-3" : "flex-col items-center text-center"}`}>
        <PokemonArt
          slug={mon.slug}
          src={mon.artwork}
          name={mon.name}
          size={compact ? 72 : 128}
        />
        <div className={compact ? "min-w-0" : "mt-4"}>
          <p className="font-semibold tracking-tight">{mon.name}</p>
          <p className={`text-sm text-muted ${compact ? "mt-0.5" : "mt-1"}`}>{example.caption}</p>
        </div>
      </div>
    </Link>
  );
}
