"use client";

import { motion } from "motion/react";
import type { CatalogEntry } from "@/types/pokemon";
import {
  formatSpeRace,
  formatSpeRaceShort,
  speBand,
  speRace,
  type SpeRaceKind,
} from "@/lib/champions/vs-stats";
import { cssVars } from "@/lib/champions/palette";
import { easeOut, fadeUp, motionTokens } from "@/components/motion/tokens";
import { PokemonArt } from "@/components/pokemon/PokemonArt";

const KIND_TONE: Record<SpeRaceKind, string> = {
  always: "text-ink",
  can: "text-muted",
  "tie-band": "text-muted",
  outsped: "text-[#c2185b]",
};

export function VsSpeRace({
  ours,
  foe,
  compact = false,
}: {
  ours: CatalogEntry[];
  foe: CatalogEntry;
  compact?: boolean;
}) {
  const theirBand = speBand(foe);

  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Speed race</p>
          <p className="truncate text-xs text-muted">
            vs <span className="font-medium text-ink">{foe.name}</span>
          </p>
        </div>
        <ul className="mt-2 divide-y divide-line/70">
          {ours.map((mon) => {
            const oursBand = speBand(mon);
            const race = speRace(oursBand, theirBand);
            return (
              <li
                key={mon.slug}
                className="flex items-center gap-2.5 py-2"
                style={cssVars(mon.palette)}
              >
                <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-semibold tracking-tight">{mon.name}</p>
                    <p className={`shrink-0 text-[11px] font-medium ${KIND_TONE[race.kind]}`}>
                      {formatSpeRaceShort(race.kind)}
                    </p>
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                    <DuelInline label="Base" you={oursBand.at0} them={theirBand.at0} />
                    <DuelInline label="Max" you={oursBand.at32} them={theirBand.at32} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <motion.div {...fadeUp} className="rounded-[24px] border border-line bg-raised/40 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Speed race</p>
          <p className="mt-1 text-sm text-muted">Level 50 Spe · 0 SP base vs 32 SP max. Nature off.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>vs</span>
          <PokemonArt slug={foe.slug} src={foe.sprite || foe.artwork} name={foe.name} size={32} />
          <span className="font-medium text-ink">{foe.name}</span>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {ours.map((mon, i) => {
          const oursBand = speBand(mon);
          const race = speRace(oursBand, theirBand);
          return (
            <motion.li
              key={mon.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: motionTokens.state, ease: easeOut, delay: i * 0.04 }}
              className="rounded-2xl border border-line/70 bg-bg/40 p-3"
              style={cssVars(mon.palette)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={40} />
                  <p className="truncate text-sm font-semibold tracking-tight">{mon.name}</p>
                </div>
                <p className={`shrink-0 text-xs font-medium ${KIND_TONE[race.kind]}`}>
                  {formatSpeRace(race.kind)}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <DuelCell label="Base" you={oursBand.at0} them={theirBand.at0} />
                <DuelCell label="Max" you={oursBand.at32} them={theirBand.at32} />
              </div>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

function DuelCell({ label, you, them }: { label: string; you: number; them: number }) {
  const youWins = you > them;
  const themWins = them > you;
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2 text-center">
      <p className="font-mono text-[10px] uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 flex items-baseline justify-center gap-1.5 font-mono tabular-nums">
        <span className={youWins ? "text-lg font-semibold text-ink" : "text-base text-muted"}>{you}</span>
        <span className="text-[10px] text-muted">vs</span>
        <span className={themWins ? "text-lg font-semibold text-ink" : "text-base text-muted"}>{them}</span>
      </p>
    </div>
  );
}

function DuelInline({ label, you, them }: { label: string; you: number; them: number }) {
  const youWins = you > them;
  const themWins = them > you;
  return (
    <span className="inline-flex items-baseline gap-1 font-mono text-xs tabular-nums">
      <span className="text-[10px] uppercase tracking-wide text-muted">{label}</span>
      <span className={youWins ? "font-semibold text-ink" : "text-muted"}>{you}</span>
      <span className="text-[10px] text-muted">vs</span>
      <span className={themWins ? "font-semibold text-ink" : "text-muted"}>{them}</span>
    </span>
  );
}
