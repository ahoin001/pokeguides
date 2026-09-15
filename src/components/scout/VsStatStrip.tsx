"use client";

import { motion } from "motion/react";
import type { CatalogEntry } from "@/types/pokemon";
import { level50At0, speBand } from "@/lib/champions/vs-stats";
import { easeOut, fadeUp, motionTokens } from "@/components/motion/tokens";

const STAT_KEYS = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "Atk" },
  { key: "def", label: "Def" },
  { key: "spa", label: "SpA" },
  { key: "spd", label: "SpD" },
  { key: "spe", label: "Spe" },
] as const;

export function VsStatStrip({ foe }: { foe: CatalogEntry }) {
  const l50 = level50At0(foe.stats);
  const band = speBand(foe);

  return (
    <motion.div
      key={foe.slug}
      {...fadeUp}
      className="rounded-[24px] border border-line bg-raised/40 p-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Level 50 · 0 SP · nature off
        </p>
        <p className="font-mono text-sm font-semibold tracking-tight">
          Spe {band.at0}
          <span className="text-muted"> / </span>
          {band.at32}
        </p>
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {STAT_KEYS.map(({ key, label }, i) => {
          const value = key === "spe" ? band.at0 : l50[key];
          const hero = key === "spe";
          return (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: motionTokens.state, ease: easeOut, delay: i * 0.03 }}
              className={`rounded-2xl px-2 py-2 text-center ${
                hero ? "bg-[var(--mon-wash)] ring-1 ring-ink/15" : "bg-white/4"
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-wide text-muted">{label}</p>
              <p className={`mt-0.5 font-mono text-base font-semibold tabular-nums ${hero ? "text-ink" : ""}`}>
                {value}
              </p>
              {hero ? (
                <p className="mt-0.5 font-mono text-[10px] text-muted">→ {band.at32}</p>
              ) : null}
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
