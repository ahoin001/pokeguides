"use client";

import { motion, useReducedMotion } from "motion/react";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import {
  LIVE_STAT_KEYS,
  LIVE_STAT_LABEL,
  type LiveStatKey,
} from "@/lib/live/compare";
import type { Stats } from "@/types/pokemon";

/** Fixed win/lose palette — readable without glasses; ignores Pokémon wash. */
const WIN = "#3ecf8e";
const WIN_SOFT = "color-mix(in srgb, #3ecf8e 55%, transparent)";
const LOSE = "#6b2430";
const LOSE_SOFT = "color-mix(in srgb, #6b2430 70%, transparent)";
const TIE = "color-mix(in srgb, var(--ink) 28%, transparent)";
const TIE_TEXT = "var(--muted)";

type Side = {
  stats: Stats;
  wash: string;
  vibrant: string;
};

function winner(key: LiveStatKey, ours: number, theirs: number): "us" | "them" | "tie" {
  if (ours > theirs) return "us";
  if (theirs > ours) return "them";
  return "tie";
}

export function LiveStatCompare({
  ours,
  theirs,
}: {
  ours: Side;
  theirs: Side;
}) {
  const reduce = useReducedMotion();
  const max = Math.max(
    ...LIVE_STAT_KEYS.flatMap((k) => [ours.stats[k], theirs.stats[k]]),
    1,
  );

  return (
    <ul className="space-y-2.5">
      {LIVE_STAT_KEYS.map((key) => {
        const ov = ours.stats[key];
        const tv = theirs.stats[key];
        const who = winner(key, ov, tv);
        const ourPct = Math.max(10, (ov / max) * 100);
        const theirPct = Math.max(10, (tv / max) * 100);

        const ourBar =
          who === "us" ? WIN : who === "them" ? LOSE : TIE;
        const theirBar =
          who === "them" ? WIN : who === "us" ? LOSE : TIE;
        const ourNum =
          who === "us" ? WIN : who === "them" ? LOSE_SOFT : TIE_TEXT;
        const theirNum =
          who === "them" ? WIN : who === "us" ? LOSE_SOFT : TIE_TEXT;
        const labelColor =
          who === "us" ? WIN : who === "them" ? WIN : TIE_TEXT;

        return (
          <li key={key} className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-2">
            <span
              className="text-right font-mono text-[12px] font-semibold tabular-nums"
              style={{ color: ourNum }}
            >
              {ov}
            </span>
            <div className="min-w-0">
              <div className="mb-1 flex items-center justify-center gap-2">
                <span
                  className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: labelColor }}
                >
                  {LIVE_STAT_LABEL[key]}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="flex justify-end overflow-hidden rounded-full bg-black/35">
                  <motion.div
                    className={`rounded-full ${who === "us" ? "h-2.5" : "h-2"}`}
                    style={{
                      background: ourBar,
                      width: `${ourPct}%`,
                      boxShadow: who === "us" ? `0 0 12px ${WIN_SOFT}` : undefined,
                    }}
                    initial={reduce ? false : { scaleX: 0.2, originX: 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: motionTokens.layout, ease: easeOut }}
                  />
                </div>
                <div className="overflow-hidden rounded-full bg-black/35">
                  <motion.div
                    className={`rounded-full ${who === "them" ? "h-2.5" : "h-2"}`}
                    style={{
                      background: theirBar,
                      width: `${theirPct}%`,
                      boxShadow: who === "them" ? `0 0 12px ${WIN_SOFT}` : undefined,
                    }}
                    initial={reduce ? false : { scaleX: 0.2, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: motionTokens.layout, ease: easeOut }}
                  />
                </div>
              </div>
            </div>
            <span
              className="font-mono text-[12px] font-semibold tabular-nums"
              style={{ color: theirNum }}
            >
              {tv}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
