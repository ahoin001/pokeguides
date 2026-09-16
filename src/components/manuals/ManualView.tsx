"use client";

import { useState } from "react";
import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import {
  FAMILY_LESSON,
  MANUAL_FAMILY_LABEL,
  defaultPackId,
  manualFamily,
  resolveManual,
  type TeamManual,
} from "@/content/manuals";
import { getLesson, lessonHref } from "@/content/curriculum";
import { flowsFor } from "@/content/classroom-flows";
import { ManualBriefing } from "@/components/manuals/ManualBriefing";
import { ManualToc, MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { ManualPlan } from "@/components/manuals/ManualPlan";
import { ManualFlowchart } from "@/components/manuals/ManualFlowchart";
import { ManualLoopStrip } from "@/components/manuals/ManualLoopStrip";
import { ManualSwitchStrip } from "@/components/manuals/ManualSwitchStrip";
import { ManualInsights } from "@/components/manuals/ManualInsights";
import { ManualLead } from "@/components/manuals/ManualLead";
import { ManualPocket } from "@/components/manuals/ManualPocket";
import { ManualWalkthrough } from "@/components/manuals/ManualWalkthrough";
import { ManualBringSix, ManualPreviewBar } from "@/components/manuals/ManualPreviewBar";

function packForSlug(parent: TeamManual, slug: string): string | undefined {
  const packs = parent.packs?.length ? parent.packs : parent.lineups;
  if (!packs?.length) return undefined;
  const corePack = packs.find((p) => p.id === "core") ?? packs[0];
  const coreSet = new Set(parent.core ?? corePack?.slugs ?? []);
  if (!coreSet.has(slug)) {
    return packs.find((p) => (p.slugs as string[]).includes(slug))?.id ?? corePack?.id;
  }
  return corePack?.id;
}

export function ManualView({
  manual: parent,
  sourced,
}: {
  manual: TeamManual;
  sourced: "canonical" | "local";
}) {
  const [packId, setPackId] = useState(() => defaultPackId(parent) ?? "");
  const packs = parent.packs?.length ? parent.packs : parent.lineups;
  const activeId = packId && packs?.some((p) => p.id === packId) ? packId : defaultPackId(parent) ?? "";
  const manual = resolveManual(parent, activeId || undefined);

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
  const leadFlow = flows.find((f) => f.id.includes("lead") || f.title.toLowerCase() === "lead");
  const midFlow = flows.find((f) => f.id.includes("mid") || f.title.toLowerCase() === "mid");
  const lateFlow = flows.find((f) => f.id.includes("late") || f.title.toLowerCase() === "late");
  const otherFlows = flows.filter((f) => f !== leadFlow && f !== midFlow && f !== lateFlow);
  const hasGame = flows.length > 0 || loops.length > 0 || switches.length > 0;
  const teamSlugs = manual.slugs.filter((s): s is string => Boolean(s));
  const box = parent.box;
  const roster = parent.roster;
  const core = parent.core ?? (packs?.[0]?.slugs as [string, string, string] | undefined);
  const modeKey = activeId || "default";
  const boxed = Boolean(box?.length && packs?.length && roster?.length && core);

  return (
    <article className="mx-auto w-full" style={wash ? cssVars(wash.palette) : undefined}>
      <ManualToc manual={manual} boxed={boxed} />

      <header id="top" className={`${MANUAL_SCROLL_MT} max-w-3xl`}>
        <p className="text-sm text-muted">
          <Link href="/manuals" className="hover:text-ink">
            Field manuals
          </Link>
          {sourced === "local" ? " · Yours" : ""}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">{parent.title}</h1>
        <p className="mt-3 text-lg text-muted">{parent.lede}</p>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className="rounded-full bg-white/8 px-3 py-1 font-medium text-ink">
            {MANUAL_FAMILY_LABEL[manualFamily(manual)]}
          </span>
          <Link
            href={archetypeHref(manual.archetype)}
            className="rounded-full border border-line px-3 py-1 font-medium text-ink transition hover:border-ink/40"
          >
            {ARCHETYPE_LABEL[manual.archetype]}
          </Link>
          {boxed ? (
            <span className="rounded-full border border-line px-3 py-1 text-muted">6-box · preview packs</span>
          ) : null}
        </p>
      </header>

      {boxed && box && roster && core && packs && activeId ? (
        <>
          <ManualBringSix
            box={[...box]}
            core={[...core]}
            roster={roster}
            activeSlugs={[...manual.slugs]}
            onPickSlug={(slug) => {
              const next = packForSlug(parent, slug);
              if (next) setPackId(next);
            }}
          />
          <ManualPreviewBar packs={packs} packId={activeId} onSelect={setPackId} />
        </>
      ) : null}

      <div key={modeKey}>
        <ManualWalkthrough manual={manual} />

        <ManualLead
          thesis={manual.pilot?.thesis ?? family?.thesis}
          rule={manual.pilot?.rule ?? family?.clockRule}
          fail={manual.pilot?.fail ?? family?.commonFail}
          failLabel={manual.pilot ? "Never." : "Common fail."}
          philosophy={manual.philosophy}
          meta={manual.meta}
          lessons={
            lessons.length ? (
              <p className="text-sm text-muted">
                If this word is new:{" "}
                {lessons.slice(0, 2).map((l, i) =>
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
            ) : undefined
          }
        />

        <ManualPocket manual={manual} />

        <ManualBriefing manual={manual} />

        {manual.plan?.length ? <ManualPlan plan={manual.plan} /> : null}

        {hasGame ? (
          <section id="game" className={`mt-10 ${MANUAL_SCROLL_MT}`}>
            <h2 className="text-2xl font-semibold tracking-tight">How a game goes</h2>
            <p className="mt-2 max-w-[52ch] text-sm text-muted">
              Open on Lead. Learn the named plays. Use the switch board for type sends. Mid and Late cover situations the
              board does not.
            </p>

            {leadFlow ? <ManualFlowchart flow={leadFlow} /> : null}
            {loops.length ? <ManualLoopStrip loops={loops} /> : null}
            {switches.length ? <ManualSwitchStrip switches={switches} teamSlugs={teamSlugs} /> : null}
            {midFlow ? <ManualFlowchart flow={midFlow} /> : null}
            {lateFlow ? <ManualFlowchart flow={lateFlow} /> : null}
            {otherFlows.map((flow) => (
              <ManualFlowchart key={flow.id} flow={flow} />
            ))}
          </section>
        ) : null}

        <ManualInsights victims={victims} counters={counters} advantages={advantages} hazards={hazards} />
      </div>
    </article>
  );
}
