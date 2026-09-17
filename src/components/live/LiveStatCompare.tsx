"use client";

import { motion, useReducedMotion } from "motion/react";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import {
  LIVE_STAT_KEYS,
  LIVE_STAT_LABEL,
  type LiveStatKey,
} from "@/lib/live/compare";
import type { Stats } from "@/types/pokemon";

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
        const ourPct = Math.max(8, (ov / max) * 100);
        const theirPct = Math.max(8, (tv / max) * 100);
        const ourColor = who === "us" ? ours.vibrant : who === "tie" ? "color-mix(in srgb, var(--ink) 28%, transparent)" : "color-mix(in srgb, var(--ink) 14%, transparent)";
        const theirColor = who === "them" ? theirs.vibrant : who === "tie" ? "color-mix(in srgb, var(--ink) 28%, transparent)" : "color-mix(in srgb, var(--ink) 14%, transparent)";
        const labelColor =
          who === "us"
            ? ours.vibrant
            : who === "them"
              ? theirs.vibrant
              : undefined;

        return (
          <li key={key} className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2">
            <span
              className={`text-right font-mono text-[11px] font-semibold tabular-nums ${
                who === "us" ? "text-ink" : "text-muted"
              }`}
              style={who === "us" ? { color: ours.vibrant } : undefined}
            >
              {ov}
            </span>
            <div className="min-w-0">
              <div className="mb-1 flex items-center justify-center gap-2">
                <span
                  className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style={labelColor ? { color: labelColor } : undefined}
                >
                  {LIVE_STAT_LABEL[key]}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="flex justify-end overflow-hidden rounded-full bg-white/[0.04]">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ background: ourColor, width: `${ourPct}%` }}
                    initial={reduce ? false : { scaleX: 0.2, originX: 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: motionTokens.layout, ease: easeOut }}
                  />
                </div>
                <div className="overflow-hidden rounded-full bg-white/[0.04]">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ background: theirColor, width: `${theirPct}%` }}
                    initial={reduce ? false : { scaleX: 0.2, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: motionTokens.layout, ease: easeOut }}
                  />
                </div>
              </div>
            </div>
            <span
              className={`font-mono text-[11px] font-semibold tabular-nums ${
                who === "them" ? "text-ink" : "text-muted"
              }`}
              style={who === "them" ? { color: theirs.vibrant } : undefined}
            >
              {tv}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
