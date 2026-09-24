"use client";

import { AnimatePresence, motion } from "motion/react";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { ArchitectureProfileSearch } from "@/components/architecture/ArchitectureProfileSearch";
import { WeaknessGrid } from "@/components/team/WeaknessGrid";
import { CoverageGrid } from "@/components/team/CoverageGrid";
import { ThreatsList } from "@/components/team/ThreatsList";
import { SpeedTier } from "@/components/team/SpeedTier";
import { TeamCoverage } from "@/components/manuals/TeamCoverage";
import type { TeamThreat } from "@/lib/champions/team-threats";
import type { CoverageMember } from "@/lib/champions/team-coverage";
import type { CatalogEntry, TypeId } from "@/types/pokemon";

export type AnalysisTab = "weaknesses" | "coverage" | "threats" | "speed" | "architecture";
export type CoverageMode = "stab" | "moves";

const TABS: { id: AnalysisTab; label: string }[] = [
  { id: "weaknesses", label: "Weaknesses" },
  { id: "coverage", label: "Coverage" },
  { id: "threats", label: "Threats" },
  { id: "speed", label: "Speed" },
  { id: "architecture", label: "Architecture" },
];

export function BuilderAnalysis({
  tab,
  onTab,
  team,
  threats,
  selectedType,
  onSelectType,
  selectedSlug,
  onSelectSlug,
  onScout,
  coverageMode = "stab",
  onCoverageMode,
  coverageMembers = [],
}: {
  tab: AnalysisTab;
  onTab: (tab: AnalysisTab) => void;
  team: CatalogEntry[];
  threats: TeamThreat[];
  selectedType: TypeId | null;
  onSelectType: (type: TypeId | null) => void;
  selectedSlug: string | null;
  onSelectSlug: (slug: string) => void;
  onScout: (slug: string) => void;
  coverageMode?: CoverageMode;
  onCoverageMode?: (mode: CoverageMode) => void;
  coverageMembers?: CoverageMember[];
}) {
  const hasKits = coverageMembers.some((m) => (m.moves?.length ?? 0) > 0);

  return (
    <section className="min-w-0 rounded-[28px] border border-line bg-raised/30 p-4 md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Analysis</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Team health</h2>
        </div>
        <div
          role="tablist"
          aria-label="Team analysis"
          className="flex max-w-full flex-wrap gap-1 rounded-full bg-bg/60 p-1"
        >
          {TABS.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => onTab(t.id)}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors sm:px-3.5 ${
                  on ? "bg-ink text-bg" : "text-muted hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab === "coverage" ? `${tab}-${coverageMode}` : tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: motionTokens.state, ease: easeOut }}
          >
            {tab === "weaknesses" ? (
              <WeaknessGrid team={team} selectedType={selectedType} onSelectType={onSelectType} />
            ) : null}
            {tab === "coverage" ? (
              <div className="space-y-4">
                {onCoverageMode ? (
                  <div
                    role="tablist"
                    aria-label="Coverage mode"
                    className="inline-flex rounded-full border border-line bg-bg/50 p-1"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={coverageMode === "stab"}
                      onClick={() => onCoverageMode("stab")}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        coverageMode === "stab" ? "bg-ink text-bg" : "text-muted hover:text-ink"
                      }`}
                    >
                      Natural (STAB)
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={coverageMode === "moves"}
                      onClick={() => onCoverageMode("moves")}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        coverageMode === "moves" ? "bg-ink text-bg" : "text-muted hover:text-ink"
                      }`}
                    >
                      Move kits
                    </button>
                  </div>
                ) : null}
                {coverageMode === "moves" ? (
                  hasKits ? (
                    <TeamCoverage
                      members={coverageMembers}
                      defaultOpen
                      title="Move coverage"
                    />
                  ) : (
                    <p className="text-sm text-muted">
                      Add moves on the focus rail to see which types your kits actually click. Until
                      then, switch to Natural (STAB) for typing coverage.
                    </p>
                  )
                ) : (
                  <CoverageGrid
                    team={team}
                    selectedType={selectedType}
                    onSelectType={onSelectType}
                  />
                )}
              </div>
            ) : null}
            {tab === "threats" ? <ThreatsList threats={threats} onScout={onScout} /> : null}
            {tab === "speed" ? (
              <SpeedTier team={team} selectedSlug={selectedSlug} onSelectSlug={onSelectSlug} />
            ) : null}
            {tab === "architecture" ? (
              <ArchitectureProfileSearch
                partySlugs={team.map((m) => m.slug)}
                initialSlug={selectedSlug}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
