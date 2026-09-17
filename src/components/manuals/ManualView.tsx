"use client";

import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { PageFrame } from "@/components/chrome/PageFrame";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import {
  FAMILY_LESSON,
  MANUAL_FAMILY_LABEL,
  isBoxedManual,
  manualFamily,
  packList,
  resolveManual,
  validatePackId,
  type TeamManual,
} from "@/content/manuals";
import { getLesson, lessonHref } from "@/content/curriculum";
import { flowsFor } from "@/content/classroom-flows";
import { ManualToc, MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { ManualPlan } from "@/components/manuals/ManualPlan";
import { ManualInsights } from "@/components/manuals/ManualInsights";
import { ManualLead } from "@/components/manuals/ManualLead";
import { ManualSpotlight } from "@/components/manuals/ManualSpotlight";
import { ManualGameBoard } from "@/components/manuals/ManualGameBoard";
import { ManualSection } from "@/components/manuals/ManualSection";
import { ManualEndgameTiles } from "@/components/manuals/ManualPackDossier";
import { ManualBriefing } from "@/components/manuals/ManualBriefing";
import type { CoverageMember } from "@/lib/champions/team-coverage";

function coverageFromSlots(manual: TeamManual): CoverageMember[] {
  const out: CoverageMember[] = [];
  for (const slot of manual.slots) {
    const p = slot.slug ? getPokemon(slot.slug) : undefined;
    if (!p) continue;
    out.push({
      name: p.name,
      types: p.types,
      moves: slot.moves.map((m) => m.name),
    });
  }
  return out;
}

export function ManualView({
  manual: parent,
  sourced,
}: {
  manual: TeamManual;
  sourced: "canonical" | "local";
}) {
  const packs = packList(parent);
  const boxed = isBoxedManual(parent);
  const [packParam, setPackParam] = useQueryState(
    "pack",
    parseAsString.withDefault(validatePackId(parent) ?? ""),
  );
  const activeId = validatePackId(parent, packParam) ?? "";
  const manual = resolveManual(parent, activeId || undefined);
  const activePack = packs.find((p) => p.id === activeId);

  function selectPack(id: string) {
    void setPackParam(id);
  }

  const mons = manual.slugs.map((s) => (s ? getPokemon(s) : undefined));
  const wash = mons.find(Boolean);
  const hazards = manual.hazards.filter((h) => h.title || h.body);
  const advantages = (manual.advantages ?? []).filter((a) => a.title || a.body);
  const victims = (manual.victims ?? []).filter((v) => v.name || v.why);
  const counters = (manual.counters ?? []).filter((c) => c.name || c.why);
  const family = manual.pilot ? undefined : FAMILY_LESSON[manualFamily(manual)];
  const lessons = (manual.relatedLessons ?? []).map((slug) => getLesson(slug)).filter(Boolean);
  const flows = flowsFor(manual);
  const hasGame =
    flows.length > 0 ||
    manual.loops.some((l) => l.title || l.body) ||
    (manual.switches ?? []).some((s) => s.into || s.send) ||
    Boolean(activePack?.gameStates?.length);
  const modeKey = activeId || "default";
  const hasDoctrine = Boolean(
    manual.pilot?.thesis ||
      manual.pilot?.rule ||
      manual.pilot?.fail ||
      family?.thesis ||
      family?.clockRule ||
      family?.commonFail ||
      manual.philosophy?.trim() ||
      manual.meta?.trim(),
  );
  const hasMatchups = Boolean(victims.length || counters.length || advantages.length || hazards.length);
  const endgames = parent.construction?.endgames ?? [];
  const packCoverage = coverageFromSlots(manual);

  return (
    <PageFrame variant="board" sticky="local" style={wash ? cssVars(wash.palette) : undefined}>
      <article>
        <ManualToc manual={manual} boxed={boxed} packKey={modeKey} parent={parent} />

        <header id="top" className={`${MANUAL_SCROLL_MT} max-w-3xl`}>
          <p className="text-sm text-muted">
            <Link href="/manuals" className="hover:text-ink">
              Field manuals
            </Link>
            {sourced === "local" ? " · Yours" : ""}
            {activePack ? ` · ${activePack.label}` : ""}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">{parent.title}</h1>
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
              <span className="rounded-full border border-line px-3 py-1 text-muted">
                6-box · {packs.length} packs
              </span>
            ) : null}
          </p>
        </header>

        {hasDoctrine ? (
          <ManualSection
            id="doctrine"
            title="Doctrine"
            purpose="The idea, the hard rule, and what you never do."
          >
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
          </ManualSection>
        ) : null}

        {boxed && packs.length && activeId ? (
          <ManualSpotlight
            parent={parent}
            manual={manual}
            packs={packs}
            activeId={activeId}
            onSelectPack={selectPack}
            coverageMembers={packCoverage}
            coverageNotes={activePack?.coverageNotes ?? manual.coverageNotes}
          />
        ) : null}

        {endgames.length ? (
          <ManualSection
            id="endgames"
            title="Three endgames"
            purpose="Which close this preview wants — not which three look strongest on paper."
          >
            <ManualEndgameTiles endgames={endgames} />
          </ManualSection>
        ) : null}

        <ManualBriefing manual={manual} />

        {manual.plan?.length ? (
          <ManualSection
            id="plan"
            title="Plan"
            purpose="How the three wins across the clock."
          >
            <ManualPlan plan={manual.plan} />
          </ManualSection>
        ) : null}

        {hasGame ? (
          <ManualGameBoard key={modeKey} manual={manual} pack={activePack} />
        ) : null}

        {hasMatchups ? (
          <ManualSection
            id="matchups"
            title="Matchups"
            purpose="Favored lines and trap lines."
          >
            <ManualInsights
              victims={victims}
              counters={counters}
              advantages={advantages}
              hazards={hazards}
            />
          </ManualSection>
        ) : null}
      </article>
    </PageFrame>
  );
}
