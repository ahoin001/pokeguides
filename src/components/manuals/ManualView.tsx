"use client";

import { useState } from "react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { PageFrame } from "@/components/chrome/PageFrame";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import { ManualToc, MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { ManualRosterHero } from "@/components/manuals/ManualRosterHero";
import { ManualSetTabs } from "@/components/manuals/ManualSetTabs";
import { ManualPackagePicker } from "@/components/manuals/ManualPackagePicker";
import { ManualPackageGuide } from "@/components/manuals/ManualPackageGuide";
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
import { formatBringLabel, formatManualEyebrow, manualsHref } from "@/lib/format";

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
  const [focusSlug, setFocusSlug] = useState<string | null>(null);
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

  return (
    <PageFrame
      variant="board"
      sticky="local"
      style={wash ? cssVars(wash.palette) : undefined}
      className={manualFormat(parent) === "doubles" ? "[--manual-accent:var(--format-doubles-accent)]" : undefined}
    >
      <article data-format={manualFormat(parent)}>
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
            <Link
              href={manualsHref(manualFormat(parent))}
              className="hover:text-ink"
            >
              Field manuals
            </Link>
            {sourced === "local" ? " · Yours" : ""}
            {activePack ? ` · ${activePack.label}` : ""}
          </p>
          <p
            className={`mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] ${
              manualFormat(parent) === "doubles"
                ? "text-[var(--format-doubles-accent)]"
                : "text-muted"
            }`}
          >
            {formatManualEyebrow(manualFormat(parent))} · {formatBringLabel(manualFormat(parent))}
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

        {boxed ? (
          <ManualRosterHero
            parent={parent}
            packs={packs}
            activeId={activeId}
            onSelectPack={selectPack}
            focusSlug={focusSlug ?? defaultFocus}
            onFocusSlug={setFocusSlug}
          />
        ) : null}

        <ManualSetTabs
          parent={parent}
          pack={activePack}
          focusSlug={focusSlug ?? defaultFocus}
          onFocusSlug={setFocusSlug}
        />

        {boxed && packs.length ? (
          <ManualPackagePicker
            packs={packs}
            activeId={activeId}
            onSelectPack={selectPack}
          />
        ) : null}

        <ManualPackageGuide
          parent={parent}
          manual={manual}
          pack={activePack}
          coverageMembers={packCoverage}
        />
      </article>
    </PageFrame>
  );
}
