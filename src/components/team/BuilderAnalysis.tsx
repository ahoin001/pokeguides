"use client";

import { AnimatePresence, motion } from "motion/react";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { WeaknessGrid } from "@/components/team/WeaknessGrid";
import { CoverageGrid } from "@/components/team/CoverageGrid";
import { ThreatsList } from "@/components/team/ThreatsList";
import { SpeedTier } from "@/components/team/SpeedTier";
import type { TeamThreat } from "@/lib/champions/team-threats";
import type { CatalogEntry, TypeId } from "@/types/pokemon";

export type AnalysisTab = "weaknesses" | "coverage" | "threats" | "speed";

const TABS: { id: AnalysisTab; label: string }[] = [
  { id: "weaknesses", label: "Weaknesses" },
  { id: "coverage", label: "Strong against" },
  { id: "threats", label: "Threats" },
  { id: "speed", label: "Speed" },
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
}) {
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
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: motionTokens.state, ease: easeOut }}
          >
            {tab === "weaknesses" ? (
              <WeaknessGrid team={team} selectedType={selectedType} onSelectType={onSelectType} />
            ) : null}
            {tab === "coverage" ? (
              <CoverageGrid team={team} selectedType={selectedType} onSelectType={onSelectType} />
            ) : null}
            {tab === "threats" ? <ThreatsList threats={threats} onScout={onScout} /> : null}
            {tab === "speed" ? (
              <SpeedTier team={team} selectedSlug={selectedSlug} onSelectSlug={onSelectSlug} />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
