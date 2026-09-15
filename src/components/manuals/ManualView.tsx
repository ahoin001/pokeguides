"use client";

import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import { type TeamManual } from "@/content/manuals";
import { flowsFor } from "@/content/classroom-flows";
import { ManualBriefing } from "@/components/manuals/ManualBriefing";
import { ManualToc, MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { ManualPlan } from "@/components/manuals/ManualPlan";
import { ManualFlowchart } from "@/components/manuals/ManualFlowchart";
import { SlotCard } from "@/components/manuals/SlotCard";

export function ManualView({
  manual,
  sourced,
}: {
  manual: TeamManual;
  sourced: "canonical" | "local";
}) {
  const mons = manual.slugs.map((s) => (s ? getPokemon(s) : undefined));
  const wash = mons.find(Boolean);
  const switches = (manual.switches ?? []).filter((s) => s.into || s.send);
  const loops = manual.loops.filter((l) => l.title || l.body);
  const hazards = manual.hazards.filter((h) => h.title || h.body);

  return (
    <article className="mx-auto w-full" style={wash ? cssVars(wash.palette) : undefined}>
      <ManualToc manual={manual} />

      <header id="top" className={`${MANUAL_SCROLL_MT} max-w-3xl`}>
        <p className="text-sm text-muted">
          <Link href="/manuals" className="hover:text-ink">
            Field manuals
          </Link>
          {sourced === "local" ? " · Yours" : ""}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">{manual.title}</h1>
        <p className="mt-3 text-lg text-muted">{manual.lede}</p>
        <p className="mt-2 text-sm text-muted">
          <Link href={archetypeHref(manual.archetype)} className="underline">
            {ARCHETYPE_LABEL[manual.archetype]}
          </Link>
          {" · "}
          {mons
            .map((p) => p?.name)
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      <ManualBriefing manual={manual} />

      {manual.philosophy ? (
        <p className="mt-10 max-w-prose text-[17px] leading-relaxed">{manual.philosophy}</p>
      ) : null}
      {manual.meta ? <p className="mt-4 max-w-prose text-sm text-muted">{manual.meta}</p> : null}

      {manual.plan?.length ? <ManualPlan plan={manual.plan} /> : null}

      <section
        id="three"
        className={`mt-16 ${MANUAL_SCROLL_MT} rounded-[32px] bg-sunken/55 p-4 ring-1 ring-line/70 sm:p-6 lg:p-8`}
      >
        <h2 className="text-3xl font-semibold tracking-tight">The three</h2>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted">
          You have 66 Stat Points. One point is +1 to that stat at Level 50. You may put at most 32 in a single stat.
          Classroom default: 32 in the stat that KOs, 32 in Speed if you must move first, leftover 2 in HP. If Tailwind,
          rain, Trick Room, or Unburden already solves Speed, those 32 Speed points move into HP and Defense instead. A
          swap is the same Pokémon trained for a different table — not a second Pokémon.
        </p>
        <ol className="mt-8 grid items-start gap-5 xl:grid-cols-3 xl:gap-6">
          {manual.slots.map((slot) => (
            <SlotCard key={`${slot.slug}-${slot.title}`} slot={slot} />
          ))}
        </ol>
      </section>

      {flowsFor(manual).map((flow) => (
        <ManualFlowchart key={flow.id} flow={flow} />
      ))}

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
        {switches.length ? (
          <section id="switches" className={`mt-16 ${MANUAL_SCROLL_MT}`}>
            <h2 className="text-2xl font-semibold tracking-tight">Switches</h2>
            <ul className="mt-5 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-raised/40">
              {switches.map((row) => (
                <li key={`${row.into}-${row.send}`} className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-3 px-4 py-3">
                  <p className="font-medium">{row.into}</p>
                  <p className="text-xs uppercase tracking-wide text-muted">send</p>
                  <p className="font-medium">{row.send}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {loops.length ? (
          <section id="loops" className={`mt-16 ${MANUAL_SCROLL_MT}`}>
            <h2 className="text-2xl font-semibold tracking-tight">Loops</h2>
            <ol className="mt-5 space-y-4">
              {loops.map((loop, i) => (
                <li key={loop.title || i} className="flex gap-4">
                  <span className="mt-0.5 w-6 shrink-0 text-sm text-muted">{i + 1}.</span>
                  <div>
                    <h3 className="font-semibold">{loop.title}</h3>
                    <p className="mt-1 text-sm text-muted">{loop.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>

      {hazards.length ? (
        <section id="hazards" className={`mt-16 ${MANUAL_SCROLL_MT}`}>
          <h2 className="text-2xl font-semibold tracking-tight">Hazards</h2>
          <ul className="mt-5 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
            {hazards.map((hazard) => (
              <li key={hazard.title} className="bg-raised/90 px-4 py-3">
                <h3 className="font-semibold">{hazard.title}</h3>
                <p className="mt-1 text-sm text-muted">{hazard.body}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
