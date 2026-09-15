"use client";

import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import { FAMILY_LESSON, MANUAL_FAMILY_LABEL, manualFamily, type TeamManual } from "@/content/manuals";
import { getLesson, lessonHref } from "@/content/curriculum";
import { flowsFor } from "@/content/classroom-flows";
import { ManualBriefing } from "@/components/manuals/ManualBriefing";
import { ManualToc, MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { ManualPlan } from "@/components/manuals/ManualPlan";
import { ManualFlowchart } from "@/components/manuals/ManualFlowchart";
import { ManualLoopStrip } from "@/components/manuals/ManualLoopStrip";
import { ManualSwitchStrip } from "@/components/manuals/ManualSwitchStrip";
import { ManualInsights } from "@/components/manuals/ManualInsights";

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
  const advantages = (manual.advantages ?? []).filter((a) => a.title || a.body);
  const victims = (manual.victims ?? []).filter((v) => v.name || v.why);
  const counters = (manual.counters ?? []).filter((c) => c.name || c.why);
  const family = manual.pilot ? undefined : FAMILY_LESSON[manualFamily(manual)];
  const lessons = (manual.relatedLessons ?? []).map((slug) => getLesson(slug)).filter(Boolean);
  const flows = flowsFor(manual);
  const firstFlowId = flows[0]?.id;
  const midFlow = flows.find((f) => f.id.includes("mid") || f.title.toLowerCase() === "mid");

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

      {manual.pilot ? (
        <aside className="mt-6 max-w-3xl rounded-[28px] border border-line bg-raised/40 px-5 py-4">
          <p className="font-semibold tracking-tight">{manual.pilot.thesis}</p>
          <p className="mt-2 text-sm text-muted">{manual.pilot.rule}</p>
          <p className="mt-2 text-sm text-muted">
            <span className="font-medium text-ink">Never. </span>
            {manual.pilot.fail}
          </p>
        </aside>
      ) : family ? (
        <aside className="mt-6 max-w-3xl rounded-[28px] border border-line bg-raised/40 px-5 py-4">
          <p className="font-semibold tracking-tight">{family.thesis}</p>
          <p className="mt-2 text-sm text-muted">{family.clockRule}</p>
          <p className="mt-2 text-sm text-muted">
            <span className="font-medium text-ink">Common fail. </span>
            {family.commonFail}
          </p>
        </aside>
      ) : null}

      {manual.philosophy ? (
        <p className="mt-6 max-w-prose text-[17px] leading-relaxed">{manual.philosophy}</p>
      ) : null}
      {manual.meta ? <p className="mt-3 max-w-prose text-sm text-muted">{manual.meta}</p> : null}

      <ManualBriefing manual={manual} />

      {manual.plan?.length ? <ManualPlan plan={manual.plan} /> : null}

      {flows.map((flow) => (
        <div key={flow.id}>
          <ManualFlowchart flow={flow} />
          {flow.id === firstFlowId && loops.length ? <ManualLoopStrip loops={loops} /> : null}
          {flow.id === (midFlow?.id ?? firstFlowId) && switches.length ? (
            <ManualSwitchStrip switches={switches} />
          ) : null}
        </div>
      ))}

      {!flows.length && loops.length ? <ManualLoopStrip loops={loops} /> : null}
      {!flows.length && switches.length ? <ManualSwitchStrip switches={switches} /> : null}

      <ManualInsights victims={victims} counters={counters} advantages={advantages} hazards={hazards} />

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
