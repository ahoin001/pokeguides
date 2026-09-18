"use client";

import Link from "next/link";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { PageFrame } from "@/components/chrome/PageFrame";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import {
  MANUAL_FAMILY_LABEL,
  isBoxedManual,
  manualFamily,
  packList,
  resolveManual,
  resolvePackStrategy,
  validatePackId,
  type TeamManual,
} from "@/content/manuals";
import { flowsFor } from "@/content/classroom-flows";
import { ManualToc, MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { ManualGameplan } from "@/components/manuals/ManualGameplan";
import { ManualInsights } from "@/components/manuals/ManualInsights";
import {
  ManualPackageHero,
  type PackageViewMode,
} from "@/components/manuals/ManualPackageHero";
import { ManualGameBoard } from "@/components/manuals/ManualGameBoard";
import { ManualSection } from "@/components/manuals/ManualSection";
import { ManualWinPath } from "@/components/manuals/ManualWinPath";
import { ManualBriefing } from "@/components/manuals/ManualBriefing";
import type { CoverageMember } from "@/lib/champions/team-coverage";

const VIEW_MODES = ["carousel", "menu"] as const;

function coverageFromSlots(manual: TeamManual): CoverageMember[] {
  const out: CoverageMember[] = [];
  for (const slot of manual.slots) {
    const p = slot.slug ? getPokemon(slot.slug) : undefined;
    if (!p) continue;
    out.push({
      name: p.name,
      slug: p.slug,
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
  const [viewParam, setViewParam] = useQueryState(
    "view",
    parseAsStringLiteral(VIEW_MODES).withDefault("carousel"),
  );
  const activeId = validatePackId(parent, packParam) ?? "";
  const manual = resolveManual(parent, activeId || undefined);
  const activePack = packs.find((p) => p.id === activeId);
  const viewMode = viewParam as PackageViewMode;

  function selectPack(id: string) {
    void setPackParam(id);
  }

  const mons = manual.slugs.map((s) => (s ? getPokemon(s) : undefined));
  const wash = mons.find(Boolean);
  const hazards = manual.hazards.filter((h) => h.title || h.body);
  const advantages = (manual.advantages ?? []).filter((a) => a.title || a.body);
  const victims = (manual.victims ?? []).filter((v) => v.name || v.why);
  const counters = (manual.counters ?? []).filter((c) => c.name || c.why);
  const flows = flowsFor(manual);
  const hasGame =
    flows.length > 0 ||
    manual.loops.some((l) => l.title || l.body) ||
    (manual.switches ?? []).some((s) => s.into || s.send) ||
    Boolean(activePack?.gameStates?.length);
  const modeKey = activeId || "default";
  const hasMatchups = Boolean(victims.length || counters.length || advantages.length || hazards.length);
  const endgames = parent.construction?.endgames ?? [];
  const packCoverage = coverageFromSlots(manual);
  const strategy = activePack ? resolvePackStrategy(activePack) : null;
  const hasGameplan = Boolean(
    strategy || manual.plan?.some((b) => b.title || b.play),
  );
  const sixSummary = parent.sixSummary?.trim() || parent.lede?.trim();

  return (
    <PageFrame variant="board" sticky="local" style={wash ? cssVars(wash.palette) : undefined}>
      <article>
        <ManualToc
          manual={manual}
          boxed={boxed}
          packKey={modeKey}
          parent={parent}
          packLabel={activePack?.label}
          packSlugs={activePack?.slugs}
        />

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
          {sixSummary ? (
            <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-muted">{sixSummary}</p>
          ) : null}
        </header>

        {boxed && packs.length && activeId ? (
          <ManualPackageHero
            parent={parent}
            manual={manual}
            packs={packs}
            activeId={activeId}
            onSelectPack={selectPack}
            viewMode={viewMode}
            onViewMode={(mode) => void setViewParam(mode)}
            coverageMembers={packCoverage}
            coverageNotes={activePack?.coverageNotes ?? manual.coverageNotes}
          />
        ) : null}

        {endgames.length || strategy?.winCondition ? (
          <ManualSection
            id="endgames"
            title="Win path"
            purpose="How this package closes — and which endgames on the six it pursues."
          >
            <ManualWinPath parent={parent} pack={activePack} />
          </ManualSection>
        ) : null}

        {hasGameplan ? (
          <ManualSection
            id="plan"
            title="Gameplan"
            purpose="Mantra, checklist, and the Lead → Mid → Late clock for this three."
          >
            <ManualGameplan parent={parent} pack={activePack} plan={manual.plan ?? []} />
          </ManualSection>
        ) : null}

        {hasGame ? (
          <ManualGameBoard key={modeKey} manual={manual} pack={activePack} parent={parent} />
        ) : null}

        <ManualBriefing manual={manual} />

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
