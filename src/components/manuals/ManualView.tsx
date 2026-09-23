"use client";

import { useState } from "react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { PageFrame } from "@/components/chrome/PageFrame";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import { ManualToc, MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { ManualSetTabs } from "@/components/manuals/ManualSetTabs";
import { ManualTeamPackageHero } from "@/components/manuals/ManualTeamPackageHero";
import { ManualPackageGuide } from "@/components/manuals/ManualPackageGuide";
import {
  ManualDoublesArchitecture,
  ManualMatchupScripts,
  ManualPreviewTrees,
  ManualTradeLedger,
} from "@/components/manuals/ManualDoublesChapters";
import { ManualWinRecipes } from "@/components/manuals/ManualApproachableChapters";
import { ManualNetworkGraph } from "@/components/manuals/ManualNetworkGraph";
import { ManualSection } from "@/components/manuals/ManualSection";
import type { CoverageMember } from "@/lib/champions/team-coverage";
import {
  MANUAL_FAMILY_LABEL,
  isBoxedManual,
  manualFamily,
  manualFormat,
  packList,
  resolveActiveBox,
  resolveManual,
  validatePackId,
  type TeamManual,
} from "@/content/manuals";
import { formatBringLabel, formatManualEyebrow } from "@/lib/format";

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
  overridden = false,
}: {
  manual: TeamManual;
  sourced: "canonical" | "local";
  /** Classroom id with a device override saved. */
  overridden?: boolean;
}) {
  const packs = packList(parent);
  const boxed = isBoxedManual(parent);
  const doubles = manualFormat(parent) === "doubles";
  /** Win recipes + network exist — unlock How-it-wins chapters for either format. */
  const hasWinMeat = Boolean(
    parent.engines?.length || parent.network?.edges?.length || parent.commandments?.length,
  );
  /**
   * Doubles approachable compact path: win meat first, skip Sets/Guide.
   * Singles always keeps Sets + Guide when win meat is present.
   */
  const compactDoubles = doubles && hasWinMeat;

  const [packParam, setPackParam] = useQueryState(
    "pack",
    parseAsString.withDefault(validatePackId(parent) ?? ""),
  );
  const [focusSlug, setFocusSlug] = useState<string | null>(null);
  const [recipeOpen, setRecipeOpen] = useState<string | null>(parent.engines?.[0]?.id ?? null);

  const activeId = validatePackId(parent, packParam) ?? "";
  const manual = resolveManual(parent, activeId || undefined);
  const activePack = packs.find((p) => p.id === activeId);
  const box = resolveActiveBox(parent, activeId || undefined);
  const modeKey = activeId || "default";

  function selectPack(id: string) {
    void setPackParam(id);
  }

  const mons = manual.slugs.map((s) => (s ? getPokemon(s) : undefined));
  const wash = mons.find(Boolean);
  const packCoverage = coverageFromSlots(manual);
  const defaultFocus = box[0] ?? (manual.slugs.find(Boolean) as string | undefined) ?? null;
  const focus = focusSlug ?? defaultFocus;

  const whisperMon = focus ? getPokemon(focus)?.name : undefined;

  return (
    <PageFrame
      variant="board"
      sticky="local"
      style={wash ? cssVars(wash.palette) : undefined}
      className={doubles ? "[--manual-accent:var(--format-doubles-accent)]" : undefined}
    >
      <article data-format={manualFormat(parent)}>
        <ManualToc
          manual={manual}
          boxed={boxed}
          packKey={modeKey}
          parent={parent}
          packLabel={activePack?.label}
          packSlugs={activePack?.slugs}
          whisper={whisperMon}
          hasWinMeat={hasWinMeat}
          compactDoubles={compactDoubles}
        />

        <header id="top" className={`${MANUAL_SCROLL_MT}`}>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl lg:leading-[1.05]">
              {parent.title}
            </h1>
            {overridden ? (
              <span className="text-sm text-muted">Edited on device</span>
            ) : sourced === "local" ? (
              <span className="text-sm text-muted">Yours</span>
            ) : null}
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span
              className={
                doubles ? "font-medium text-[var(--format-doubles-accent)]" : "font-medium text-ink"
              }
            >
              {formatManualEyebrow(manualFormat(parent))} · {formatBringLabel(manualFormat(parent))}
            </span>
            <span aria-hidden>·</span>
            <span>{MANUAL_FAMILY_LABEL[manualFamily(manual)]}</span>
            <span aria-hidden>·</span>
            <Link href={archetypeHref(manual.archetype)} className="hover:text-ink">
              {ARCHETYPE_LABEL[manual.archetype]}
            </Link>
            {boxed && packs.length ? (
              <>
                <span aria-hidden>·</span>
                <span>{packs.length} packs</span>
              </>
            ) : null}
          </p>
        </header>

        {boxed && packs.length ? (
          <ManualTeamPackageHero
            parent={parent}
            packs={packs}
            activeId={activeId}
            onSelectPack={selectPack}
            focusSlug={focus}
            onFocusSlug={setFocusSlug}
          />
        ) : null}

        {hasWinMeat ? (
          <>
            {(parent.engines?.length ?? 0) > 0 ? (
              <ManualWinRecipes
                engines={parent.engines ?? []}
                commandments={parent.commandments}
                highlightIds={activePack?.engineIds}
                expandId={recipeOpen}
                onExpand={setRecipeOpen}
              />
            ) : null}

            {parent.network?.edges?.length ? (
              <ManualNetworkGraph
                network={parent.network}
                box={(parent.box ?? []).filter(Boolean) as string[]}
                onNode={(slug) => {
                  setFocusSlug(slug);
                  document.getElementById("team")?.scrollIntoView({ behavior: "smooth" });
                }}
                onEdge={(engineId) => {
                  if (engineId) {
                    setRecipeOpen(engineId);
                    document.getElementById("wins")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            ) : null}
          </>
        ) : null}

        {!compactDoubles ? (
          <>
            {doubles && !hasWinMeat ? <ManualDoublesArchitecture parent={parent} /> : null}

            <ManualSetTabs
              parent={parent}
              pack={activePack}
              focusSlug={focus}
              onFocusSlug={setFocusSlug}
            />

            {(parent.previewTrees?.length ?? 0) > 0 ? (
              <ManualSection
                id="preview"
                title="Preview"
                purpose={
                  parent.pilot?.rule ??
                  (doubles
                    ? "The question to memorize before you pick four."
                    : "The question to memorize before you pick three.")
                }
              >
                <ManualPreviewTrees trees={parent.previewTrees ?? []} onSelectPack={selectPack} />
              </ManualSection>
            ) : null}

            {(parent.matchupScripts?.length ?? 0) > 0 ? (
              <ManualSection
                id="scripts"
                title="Scripts"
                purpose={
                  doubles
                    ? "Named boards. Tapping a package loads that four into the guide."
                    : "Named boards. Tapping a package loads that three into the guide."
                }
              >
                <ManualMatchupScripts
                  scripts={parent.matchupScripts ?? []}
                  packs={packs.map((p) => ({ id: p.id, label: p.label }))}
                  onSelectPack={selectPack}
                />
              </ManualSection>
            ) : null}

            <ManualPackageGuide
              parent={parent}
              manual={manual}
              pack={activePack}
              coverageMembers={packCoverage}
            />

            {doubles && parent.ledger ? (
              <ManualSection id="ledger" title="Ledger" purpose={parent.evidence?.caveat}>
                <ManualTradeLedger ledger={parent.ledger} />
                {parent.setsNote ? (
                  <p className="mt-6 max-w-[52ch] text-sm text-muted">{parent.setsNote}</p>
                ) : null}
              </ManualSection>
            ) : null}
          </>
        ) : null}
      </article>
    </PageFrame>
  );
}
