import Link from "next/link";
import { getPokemon } from "@/lib/catalog/lookup";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import type { Lesson, LessonBeat, LessonExample } from "@/content/curriculum";

const TURN_STEPS = ["Switch", "Mega", "Moves by Speed"] as const;

export function FightClassroom({ lesson }: { lesson: Lesson }) {
  const [order, action, damage, preview] = lesson.beats;

  return (
    <div className="mt-10 space-y-16">
      {lesson.body.map((p) => (
        <p key={p} className="max-w-[58ch] text-[17px] leading-relaxed text-muted">
          {p}
        </p>
      ))}

      {lesson.rules?.length ? (
        <section aria-label="Format rules">
          <h2 className="text-2xl font-semibold tracking-tight">The board you play on</h2>
          <p className="mt-2 max-w-[48ch] text-sm text-muted">
            Same rules every game. Memorize the constraints; the rest of Learn is how to use them.
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

      {order ? <TurnOrderBeat beat={order} /> : null}
      {action ? <DecisionBeat beat={action} /> : null}
      {damage ? <DamageBeat beat={damage} /> : null}
      {preview ? <PreviewBeat beat={preview} /> : null}
    </div>
  );
}

function TurnOrderBeat({ beat }: { beat: LessonBeat }) {
  return (
    <section className="grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{beat.title}</h2>
        <p className="mt-3 max-w-[52ch] text-[17px] leading-relaxed text-muted">{beat.body}</p>

        <ol className="mt-6 flex flex-wrap items-center gap-2">
          {TURN_STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-sunken/80 px-3.5 py-1.5 text-sm font-medium">
                <span className="font-mono text-[11px] tabular-nums text-muted">{i + 1}</span>
                {step}
              </span>
              {i < TURN_STEPS.length - 1 ? (
                <span className="hidden text-muted sm:inline" aria-hidden>
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        {beat.rows?.length ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-line">
            <p className="border-b border-line bg-sunken/60 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Priority cuts the Speed line
            </p>
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

        {beat.takeaway ? <Takeaway text={beat.takeaway} /> : null}
      </div>
      <ExamplePanel example={beat.example} />
    </section>
  );
}

function DecisionBeat({ beat }: { beat: LessonBeat }) {
  return (
    <section className="rounded-[28px] border border-line bg-raised/35 px-5 py-7 sm:px-8 sm:py-9">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.55fr)] md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{beat.title}</h2>
          <p className="mt-3 max-w-[54ch] text-[17px] leading-relaxed text-muted">{beat.body}</p>
          {beat.takeaway ? <Takeaway text={beat.takeaway} /> : null}
        </div>
        <ExamplePanel example={beat.example} compact />
      </div>
    </section>
  );
}

function DamageBeat({ beat }: { beat: LessonBeat }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">{beat.title}</h2>
      <p className="mt-3 max-w-[54ch] text-[17px] leading-relaxed text-muted">{beat.body}</p>

      {beat.rows?.length ? (
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {beat.rows.map((row) => (
            <li key={row.label} className="rounded-2xl border border-line bg-sunken/50 px-4 py-5">
              <p className="text-lg font-semibold tracking-tight">{row.label}</p>
              <p className="mt-2 text-sm text-muted">{row.detail}</p>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6">
        <ExamplePanel example={beat.example} horizontal />
      </div>
    </section>
  );
}

function PreviewBeat({ beat }: { beat: LessonBeat }) {
  const flow = [
    { n: "0", label: "Preview", detail: "See their three" },
    { n: "1", label: "Answer", detail: "Pick your three" },
    { n: "2", label: "Lead", detail: "Choose first send" },
  ] as const;

  return (
    <section>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-start">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{beat.title}</h2>
          <p className="mt-3 max-w-[52ch] text-[17px] leading-relaxed text-muted">{beat.body}</p>
        </div>
        <ol className="overflow-hidden rounded-2xl border border-line">
          {flow.map((step, i) => (
            <li
              key={step.label}
              className={`flex items-start gap-4 px-4 py-4 ${i > 0 ? "border-t border-line" : ""} bg-raised/40`}
            >
              <span className="font-mono text-sm tabular-nums text-muted">{step.n}</span>
              <span>
                <span className="block font-medium tracking-tight">{step.label}</span>
                <span className="mt-0.5 block text-sm text-muted">{step.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {beat.takeaway ? (
          <p className="max-w-[48ch] border-t border-line pt-4 text-[15px] leading-snug text-ink sm:border-0 sm:pt-0">
            {beat.takeaway}
          </p>
        ) : (
          <span />
        )}
        <ExamplePanel example={beat.example} horizontal />
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

function ExamplePanel({
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
