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
  packUsesSharedGameplan,
  resolveManual,
  validatePackId,
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
import { ManualLineup } from "@/components/manuals/ManualPreviewBar";
import { ManualThesis } from "@/components/manuals/ManualThesis";
import { ManualSection, ManualSubnav } from "@/components/manuals/ManualSection";
import {
  ManualArchitectureStrip,
  ManualBenchmarkTable,
  ManualEndgameTiles,
  ManualPackDossier,
} from "@/components/manuals/ManualPackDossier";
import { TeamCoverage } from "@/components/manuals/TeamCoverage";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import type { CoverageMember } from "@/lib/champions/team-coverage";

function packForSlug(parent: TeamManual, slug: string): string | undefined {
  const packs = packList(parent);
  if (!packs.length) return undefined;
  const corePack = packs.find((p) => p.id === "core") ?? packs[0];
  const coreSet = new Set(parent.core ?? corePack?.slugs ?? []);
  if (!coreSet.has(slug)) {
    return packs.find((p) => (p.slugs as string[]).includes(slug))?.id ?? corePack?.id;
  }
  return corePack?.id;
}

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

function coverageFromRoster(manual: TeamManual): CoverageMember[] {
  const roster = manual.roster ?? manual.slots;
  const out: CoverageMember[] = [];
  for (const slot of roster) {
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
  const sharedGameplan = boxed && packUsesSharedGameplan(parent, activeId);

  function selectPack(id: string) {
    void setPackParam(id);
  }

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
  const macroFlow = flows.find(
    (f) => f.id === "macro" || f.title.toLowerCase().includes("package"),
  );
  const leadFlow = flows.find((f) => f.id.includes("lead") || f.title.toLowerCase() === "lead");
  const midFlow = flows.find((f) => f.id.includes("mid") || f.title.toLowerCase() === "mid");
  const lateFlow = flows.find((f) => f.id.includes("late") || f.title.toLowerCase() === "late");
  const otherFlows = flows.filter(
    (f) => f !== leadFlow && f !== midFlow && f !== lateFlow && f !== macroFlow,
  );
  const hasGame = flows.length > 0 || loops.length > 0 || switches.length > 0;
  const teamSlugs = manual.slugs.filter((s): s is string => Boolean(s));
  const box = parent.box;
  const roster = parent.roster;
  const core = parent.core ?? (packs?.[0]?.slugs as [string, string, string] | undefined);
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
  const hasPocket = Boolean(
    manual.pilot?.fail || family?.commonFail || (manual.switches ?? []).some((s) => s.into || s.send),
  );
  const hasThesis = Boolean(parent.construction || parent.megaPool || parent.evidence);
  const hasMatchups = Boolean(victims.length || counters.length || advantages.length || hazards.length);
  const endgames = parent.construction?.endgames ?? [];
  const architecture = parent.architecture ?? [];
  const benchmarks = parent.speedBenchmarks ?? [];
  const packCoverage = coverageFromSlots(manual);
  const sixCoverage = boxed ? coverageFromRoster(parent) : [];
  const gameSubnav = [
    ...(leadFlow ? [{ href: `#flow-${leadFlow.id}`, label: "Lead" }] : []),
    ...(loops.length ? [{ href: "#loops", label: "Loops" }] : []),
    ...(switches.length ? [{ href: "#switches", label: "Switches" }] : []),
    ...(midFlow ? [{ href: `#flow-${midFlow.id}`, label: "Mid" }] : []),
    ...(lateFlow ? [{ href: `#flow-${lateFlow.id}`, label: "Late" }] : []),
    ...otherFlows.map((f) => ({ href: `#flow-${f.id}`, label: f.title || f.id })),
  ];

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

        {boxed && roster?.length ? (
          <ManualSection
            id="six"
            title="The six"
            purpose="Every member earns a slot. Jobs first — expand kits in the active package."
          >
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roster.map((slot) => {
                const p = getPokemon(slot.slug);
                if (!p) return null;
                return (
                  <li
                    key={slot.slug}
                    className="flex gap-3 rounded-[24px] border border-line/70 bg-raised/30 p-3"
                    style={cssVars(p.palette)}
                  >
                    <PokemonArt
                      slug={p.slug}
                      src={p.sprite || p.artwork}
                      name={p.name}
                      size={56}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold tracking-tight">{p.name}</p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        {slot.primaryJob ?? slot.role}
                      </p>
                      {slot.gives?.length ? (
                        <p className="mt-2 line-clamp-2 text-[12px] text-muted">
                          {slot.gives.join(" · ")}
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
            {sixCoverage.length ? (
              <div className="mt-6">
                <TeamCoverage
                  members={sixCoverage}
                  notes={parent.coverageNotes}
                  defaultOpen={false}
                  title="Six · kit coverage"
                />
              </div>
            ) : null}
          </ManualSection>
        ) : null}

        {architecture.length ? (
          <ManualSection
            id="architecture"
            title="Architecture"
            purpose="How the six layers — not a flat rank list."
          >
            <ManualArchitectureStrip layers={architecture} />
          </ManualSection>
        ) : null}

        {hasThesis ? (
          <ManualSection
            id="thesis"
            title="How this six was built"
            purpose="Ladder evidence into a preview toolbox — not a paste of top usage."
          >
            <ManualThesis
              construction={parent.construction}
              megaPool={parent.megaPool}
              evidence={parent.evidence}
            />
          </ManualSection>
        ) : null}

        {endgames.length ? (
          <ManualSection
            id="endgames"
            title="Three endgames"
            purpose="You are not asking which three are strongest — you are asking which close this preview wants."
          >
            <ManualEndgameTiles endgames={endgames} />
          </ManualSection>
        ) : null}

        {benchmarks.length ? (
          <ManualSection
            id="benchmarks"
            title="Speed benchmarks"
            purpose="Nature and SP stay soft until these races are checked."
          >
            <ManualBenchmarkTable rows={benchmarks} />
          </ManualSection>
        ) : null}

        {boxed && box && roster && core && packs.length && activeId ? (
          <ManualSection
            id="packages"
            title="Packages"
            purpose="Five different teams inside the six. Pick from preview, then pilot the dossier."
          >
            <ManualLineup
              box={[...box]}
              core={[...core]}
              roster={roster}
              packs={packs}
              packId={activeId}
              activeSlugs={[...manual.slugs]}
              onPickSlug={(slug) => {
                const next = packForSlug(parent, slug);
                if (next) selectPack(next);
              }}
              onSelectPack={selectPack}
            />
            {activePack ? (
              <div className="mt-10">
                <ManualPackDossier
                  pack={activePack}
                  coverageMembers={packCoverage}
                  notes={activePack.coverageNotes ?? manual.coverageNotes}
                />
              </div>
            ) : null}
          </ManualSection>
        ) : null}

        {sharedGameplan ? (
          <p className="mt-6 max-w-[52ch] rounded-2xl border border-line/70 bg-raised/30 px-4 py-3 text-sm text-muted">
            This bring uses the <span className="font-medium text-ink">shared gameplan</span> below.
          </p>
        ) : null}

        <ManualWalkthrough key={modeKey} manual={manual} />

        {hasPocket ? (
          <ManualSection
            id="pocket"
            title="Pocket"
            purpose="Lead, never, and switch sends — then load this bring onto Team."
          >
            <ManualPocket manual={manual} packLabel={activePack?.label} />
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
          <ManualSection
            id="game"
            title="How a game goes"
            purpose="Lead opens. Loops name the plays. Mid and Late cover the board."
          >
            <ManualSubnav items={gameSubnav} />
            {leadFlow ? <ManualFlowchart flow={leadFlow} /> : null}
            {loops.length ? <ManualLoopStrip loops={loops} /> : null}
            {switches.length ? <ManualSwitchStrip switches={switches} teamSlugs={teamSlugs} /> : null}
            {midFlow ? <ManualFlowchart flow={midFlow} /> : null}
            {lateFlow ? <ManualFlowchart flow={lateFlow} /> : null}
            {otherFlows.map((flow) => (
              <ManualFlowchart key={flow.id} flow={flow} />
            ))}
          </ManualSection>
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
