"use client";

import { motion } from "motion/react";
import { cssVars } from "@/lib/champions/palette";
import { scoutField, type ScoutTeamResult } from "@/lib/champions/vs";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { VsStatStrip } from "@/components/scout/VsStatStrip";
import { VsSpeRace } from "@/components/scout/VsSpeRace";
import { VsMatchMatrix } from "@/components/scout/VsMatchMatrix";
import { VsSlotCard } from "@/components/scout/VsSlotCard";
import { SafeSwitchCallout } from "@/components/scout/SafeSwitchCallout";
import type { CatalogEntry } from "@/types/pokemon";

export function VsScoutReport({
  multi,
  field,
  opponentSlugs,
  focusSlug,
  onFocus,
  focusFoe,
  focusReport,
  ourMons,
  hasMoves,
}: {
  multi: boolean;
  field: ReturnType<typeof scoutField> | null;
  opponentSlugs: string[];
  focusSlug: string | null;
  onFocus: (slug: string) => void;
  focusFoe: CatalogEntry | undefined;
  focusReport: ScoutTeamResult | null;
  ourMons: CatalogEntry[];
  hasMoves: boolean;
}) {
  return (
    <motion.div
      key="report"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: motionTokens.layout, ease: easeOut }}
      className="mt-5 space-y-5"
    >
      {multi && field ? (
        <VsMatchMatrix field={field} foeSlugs={opponentSlugs} focusSlug={focusSlug} onFocus={onFocus} />
      ) : null}

      {focusFoe && focusReport ? (
        <motion.div
          key={`detail-${focusFoe.slug}`}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.layout, ease: easeOut }}
          className="space-y-4"
          style={cssVars(focusFoe.palette)}
        >
          {multi ? (
            <p className="text-sm">
              <span className="font-medium">Focused. </span>
              <span className="text-muted">{focusFoe.name}</span>
            </p>
          ) : null}

          <SafeSwitchCallout slug={focusReport.safeSwitchSlug} holes={focusReport.sharedHoles} />
          <VsStatStrip foe={focusFoe} />
          {ourMons.length ? <VsSpeRace ours={ourMons} foe={focusFoe} /> : null}

          <div className="grid gap-3 md:grid-cols-3">
            {focusReport.slots.map((slot) => (
              <VsSlotCard key={slot.slug} result={slot} hasMoves={hasMoves} />
            ))}
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
