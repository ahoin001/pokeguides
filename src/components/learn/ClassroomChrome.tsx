import Link from "next/link";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import type { Lesson, LessonBeat, LessonExample } from "@/content/curriculum";

/** Shared presentation chrome for Great Ball classrooms (abilities, moves). */
export function ClassroomLead({ lesson }: { lesson: Lesson }) {
  return (
    <>
      {lesson.body.map((p) => (
        <p key={p} className="max-w-[58ch] text-[17px] leading-relaxed text-muted">
          {p}
        </p>
      ))}
    </>
  );
}

export function RulesGrid({
  title,
  lede,
  rules,
}: {
  title: string;
  lede: string;
  rules: { label: string; detail: string }[];
}) {
  if (!rules.length) return null;
  return (
    <section aria-label={title}>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-[48ch] text-sm text-muted">{lede}</p>
      <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {rules.map((rule) => (
          <li key={rule.label} className="bg-raised/80 px-4 py-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              {rule.label}
            </p>
            <p className="mt-1.5 text-[15px] font-medium tracking-tight">{rule.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Takeaway({ text }: { text: string }) {
  return (
    <p className="mt-5 max-w-[48ch] border-t border-line pt-4 text-[15px] leading-snug text-ink">
      {text}
    </p>
  );
}

export function ExampleLink({
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
          size={compact ? 72 : 112}
        />
        <div className={compact ? "min-w-0" : "mt-4"}>
          <p className="font-semibold tracking-tight">{mon.name}</p>
          <p className={`text-sm text-muted ${compact ? "mt-0.5" : "mt-1"}`}>{example.caption}</p>
        </div>
      </div>
    </Link>
  );
}

export function ChipRow({ examples }: { examples?: LessonExample[] }) {
  if (!examples?.length) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {examples.map((chip) => {
        const mon = getPokemon(chip.slug);
        if (!mon) return null;
        return (
          <li key={`${chip.slug}-${chip.caption}`}>
            <Link
              href={`/pokemon/${mon.slug}`}
              title={chip.caption}
              className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-raised/40 py-1 pl-1 pr-3 text-sm transition hover:border-ink/40"
              style={cssVars(mon.palette)}
            >
              <PokemonArt
                slug={mon.slug}
                src={mon.sprite || mon.artwork}
                name={mon.name}
                size={32}
              />
              <span className="min-w-0">
                <span className="block font-medium leading-tight">{mon.name}</span>
                <span className="block max-w-[18ch] truncate text-[11px] text-muted">{chip.caption}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Alternating beat layout: text + rows + takeaway + face. */
export function StrategyBeat({ beat, flip }: { beat: LessonBeat; flip?: boolean }) {
  return (
    <section
      className={`grid gap-8 md:items-start ${
        flip
          ? "md:grid-cols-[minmax(14rem,0.85fr)_minmax(0,1.15fr)]"
          : "md:grid-cols-[minmax(0,1.15fr)_minmax(14rem,0.85fr)]"
      }`}
    >
      <div className={flip ? "md:order-2" : undefined}>
        <h2 className="text-2xl font-semibold tracking-tight">{beat.title}</h2>
        <p className="mt-3 max-w-[54ch] text-[17px] leading-relaxed text-muted">{beat.body}</p>

        {beat.rows?.length ? (
          <ul className="mt-6 overflow-hidden rounded-2xl border border-line">
            {beat.rows.map((row, i) => (
              <li
                key={row.label}
                className={`grid gap-1 px-4 py-3 sm:grid-cols-[7.5rem_1fr] sm:gap-3 ${
                  i > 0 ? "border-t border-line" : ""
                } bg-raised/40`}
              >
                <span
                  className={`font-mono text-[11px] font-semibold uppercase tracking-[0.1em] ${
                    row.label === "Counter" || row.label === "Answer" ? "text-ink" : "text-muted"
                  }`}
                >
                  {row.label}
                </span>
                <span className="text-sm leading-snug text-ink">{row.detail}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {beat.takeaway ? <Takeaway text={beat.takeaway} /> : null}
        {beat.examples?.length ? (
          <div className="mt-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Common faces
            </p>
            <ChipRow examples={beat.examples} />
          </div>
        ) : (
          <ChipRow examples={beat.examples} />
        )}
      </div>
      <div className={flip ? "md:order-1" : undefined}>
        <ExampleLink example={beat.example} />
      </div>
    </section>
  );
}

/** Callout beat — full-bleed raised panel for a critical rule. */
export function CalloutBeat({ beat }: { beat: LessonBeat }) {
  return (
    <section className="rounded-[28px] border border-line bg-raised/35 px-5 py-7 sm:px-8 sm:py-9">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.55fr)] md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{beat.title}</h2>
          <p className="mt-3 max-w-[54ch] text-[17px] leading-relaxed text-muted">{beat.body}</p>
          {beat.rows?.length ? (
            <ul className="mt-5 overflow-hidden rounded-2xl border border-line">
              {beat.rows.map((row, i) => (
                <li
                  key={row.label}
                  className={`grid gap-1 px-4 py-3 sm:grid-cols-[7.5rem_1fr] sm:gap-3 ${
                    i > 0 ? "border-t border-line" : ""
                  } bg-raised/40`}
                >
                  <span
                    className={`font-mono text-[11px] font-semibold uppercase tracking-[0.1em] ${
                      row.label === "Counter" || row.label === "Answer" ? "text-ink" : "text-muted"
                    }`}
                  >
                    {row.label}
                  </span>
                  <span className="text-sm leading-snug text-ink">{row.detail}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {beat.takeaway ? <Takeaway text={beat.takeaway} /> : null}
          {beat.examples?.length ? (
            <div className="mt-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Common faces
              </p>
              <ChipRow examples={beat.examples} />
            </div>
          ) : null}
        </div>
        <ExampleLink example={beat.example} compact />
      </div>
    </section>
  );
}
