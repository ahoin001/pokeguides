"use client";

import { motion } from "motion/react";
import { getPokemon } from "@/lib/catalog/load";
import { TYPE_LABEL } from "@/lib/champions/types";
import { speRaceGlyph } from "@/lib/champions/vs-stats";
import type { ScoutFieldResult } from "@/lib/champions/vs";
import { easeOut, fadeUp, motionTokens } from "@/components/motion/tokens";
import { MultChip } from "@/components/scout/MultChip";
import { PokemonArt } from "@/components/pokemon/PokemonArt";

export function VsMatchMatrix({
  field,
  foeSlugs,
  focusSlug,
  onFocus,
}: {
  field: ScoutFieldResult;
  foeSlugs: string[];
  focusSlug: string | null;
  onFocus: (slug: string) => void;
}) {
  return (
    <motion.div {...fadeUp} className="overflow-x-auto rounded-[24px] border border-line bg-raised/30">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead>
          <tr>
            <th className="p-3 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Us \ Them
            </th>
            {foeSlugs.map((slug, fi) => {
              const foe = getPokemon(slug);
              if (!foe) return null;
              const report = field.byFoe[fi];
              const active = focusSlug === slug;
              return (
                <th key={slug} className="p-3 text-center align-bottom">
                  <button
                    type="button"
                    onClick={() => onFocus(slug)}
                    className={`mx-auto flex w-full max-w-[9rem] flex-col items-center gap-2 rounded-2xl p-2 transition-colors ${
                      active ? "bg-ink text-bg" : "hover:bg-white/6"
                    }`}
                  >
                    <PokemonArt slug={foe.slug} src={foe.artwork} name={foe.name} size={48} share />
                    <span className="truncate text-xs font-semibold">{foe.name}</span>
                  </button>
                  {report?.safeSwitchSlug || report?.sharedHoles.length ? (
                    <p className="mt-2 text-[10px] leading-snug text-muted">
                      {report.safeSwitchSlug
                        ? `Safe: ${getPokemon(report.safeSwitchSlug)?.name ?? report.safeSwitchSlug}`
                        : null}
                      {report.sharedHoles.length
                        ? `${report.safeSwitchSlug ? " · " : ""}Hole: ${report.sharedHoles
                            .map((t) => TYPE_LABEL[t])
                            .join(", ")}`
                        : null}
                    </p>
                  ) : null}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {field.cells.map((row, si) => {
            const mon = getPokemon(row[0]?.slug);
            if (!mon) return null;
            return (
              <tr key={mon.slug} className="border-t border-line/60">
                <th className="p-3 text-left">
                  <div className="flex items-center gap-2">
                    <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={36} />
                    <span className="text-sm font-medium">{mon.name}</span>
                  </div>
                </th>
                {row.map((cell, fi) => {
                  const race = field.races[si]?.[fi];
                  const foeSlug = foeSlugs[fi];
                  const active = focusSlug === foeSlug;
                  return (
                    <td key={`${cell.slug}-${foeSlug}`} className="p-2">
                      <motion.button
                        type="button"
                        onClick={() => onFocus(foeSlug)}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: motionTokens.feedback, ease: easeOut }}
                        className={`flex w-full flex-col items-center gap-1.5 rounded-2xl border px-2 py-2 ${
                          active ? "border-ink/35 bg-white/8" : "border-transparent hover:bg-white/5"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-center gap-1">
                          <MultChip mult={cell.bestDealt} lane="out" />
                          <MultChip mult={cell.worstTaken} lane="in" />
                        </div>
                        {race ? (
                          <span className="font-mono text-[10px] text-muted" title={race.kind}>
                            {speRaceGlyph(race.kind)}
                          </span>
                        ) : null}
                      </motion.button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-line/60 px-3 py-2 text-[10px] text-muted">
        Blue = best you deal · Pink = worst you take · Spe+/~/−/= = speed race. Tap a column for full
        lanes.
      </p>
    </motion.div>
  );
}
