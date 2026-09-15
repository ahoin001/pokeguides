"use client";

import { useState } from "react";
import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import {
  FAMILY_LESSON,
  MANUAL_FAMILY_LABEL,
  manualFamily,
  type TeamManual,
} from "@/content/manuals";
import { getLesson, lessonHref } from "@/content/curriculum";
import { flowsFor } from "@/content/classroom-flows";
import { ManualBriefing } from "@/components/manuals/ManualBriefing";
import { ManualToc, MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { ManualPlan } from "@/components/manuals/ManualPlan";
import { ManualFlowchart } from "@/components/manuals/ManualFlowchart";
import { SlotCard } from "@/components/manuals/SlotCard";
import { Button } from "@/components/ui/Button";

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
  const family = FAMILY_LESSON[manualFamily(manual)];
  const lessons = (manual.relatedLessons ?? []).map((slug) => getLesson(slug)).filter(Boolean);
  const [openThree, setOpenThree] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);

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
          {MANUAL_FAMILY_LABEL[manualFamily(manual)]}
          {" · "}
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

      {family ? (
        <aside className="mt-8 max-w-3xl rounded-[28px] border border-line bg-raised/40 px-5 py-4">
          <p className="font-semibold tracking-tight">{family.thesis}</p>
          <p className="mt-2 text-sm text-muted">{family.clockRule}</p>
          <p className="mt-2 text-sm text-muted">
            <span className="font-medium text-ink">Common fail. </span>
            {family.commonFail}
          </p>
        </aside>
      ) : null}

      <ManualBriefing manual={manual} />

      {manual.philosophy ? (
        <p className="mt-10 max-w-prose text-[17px] leading-relaxed">{manual.philosophy}</p>
      ) : null}
      {manual.meta ? <p className="mt-4 max-w-prose text-sm text-muted">{manual.meta}</p> : null}

      {manual.plan?.length ? <ManualPlan plan={manual.plan} /> : null}

      {flowsFor(manual).map((flow) => (
        <ManualFlowchart key={flow.id} flow={flow} />
      ))}

      <section className={`mt-16 ${MANUAL_SCROLL_MT}`}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="three" className="text-3xl font-semibold tracking-tight">
            The three
          </h2>
          <Button type="button" variant="ghost" className="text-xs" onClick={() => setOpenThree((v) => !v)}>
            {openThree ? "Hide sets" : "Open the sets"}
          </Button>
        </div>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted">
          You have 66 Stat Points. One point is +1 to that stat at Level 50. You may put at most 32 in a single stat.
          Classroom default: 32 in the stat that KOs, 32 in Speed if you must move first, leftover 2 in HP.
        </p>
        {openThree ? (
          <div className="mt-8 rounded-[32px] bg-sunken/55 p-4 ring-1 ring-line/70 sm:p-6 lg:p-8">
            <ol className="grid items-start gap-5 xl:grid-cols-3 xl:gap-6">
              {manual.slots.map((slot) => (
                <SlotCard key={`${slot.slug}-${slot.title}`} slot={slot} />
              ))}
            </ol>
          </div>
        ) : null}
      </section>

      {switches.length || loops.length || hazards.length ? (
        <div className="mt-12">
          <Button type="button" variant="line" className="text-xs" onClick={() => setOpenNotes((v) => !v)}>
            {openNotes ? "Hide switches and hazards" : "Switches, loops, hazards"}
          </Button>
        </div>
      ) : null}

      {openNotes ? (
        <>
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
            {switches.length ? (
              <section id="switches" className={`mt-10 ${MANUAL_SCROLL_MT}`}>
                <h2 className="text-2xl font-semibold tracking-tight">Switches</h2>
                <ul className="mt-5 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-raised/40">
                  {switches.map((row) => (
                    <li
                      key={`${row.into}-${row.send}`}
                      className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-3 px-4 py-3"
                    >
                      <p className="font-medium">{row.into}</p>
                      <p className="text-xs uppercase tracking-wide text-muted">send</p>
                      <p className="font-medium">{row.send}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {loops.length ? (
              <section id="loops" className={`mt-10 ${MANUAL_SCROLL_MT}`}>
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
            <section id="hazards" className={`mt-10 ${MANUAL_SCROLL_MT}`}>
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
        </>
      ) : null}

      {lessons.length ? (
        <p className="mt-12 max-w-3xl text-sm text-muted">
          Taught in Learn:{" "}
          {lessons.map((l, i) =>
            l ? (
              <span key={l.slug}>
                {i ? ", " : ""}
                <Link href={lessonHref(l.slug)} className="underline">
                  {l.title}
                </Link>
              </span>
            ) : null,
          )}
        </p>
      ) : null}
    </article>
  );
}
