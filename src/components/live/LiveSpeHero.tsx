"use client";

import { motion, useReducedMotion } from "motion/react";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import {
  liveSpeScenarios,
  SPE_SCENARIO_META,
  type SpeScenarioKey,
} from "@/lib/live/compare";
import type { CatalogEntry } from "@/types/pokemon";

const WIN = "#3ecf8e";
const WIN_SOFT = "color-mix(in srgb, #3ecf8e 55%, transparent)";
const LOSE = "#6b2430";
const LOSE_SOFT = "color-mix(in srgb, #6b2430 70%, transparent)";
const TIE = "color-mix(in srgb, var(--ink) 28%, transparent)";
const TIE_TEXT = "var(--muted)";

const ORDER: SpeScenarioKey[] = ["base", "invest", "max"];

function whoWins(ours: number, theirs: number): "us" | "them" | "tie" {
  if (ours > theirs) return "us";
  if (theirs > ours) return "them";
  return "tie";
}

function scenarioVerdict(
  ours: ReturnType<typeof liveSpeScenarios>,
  theirs: ReturnType<typeof liveSpeScenarios>,
): string {
  const ourFloor = ours.base;
  const ourCeil = ours.max;
  const theirFloor = theirs.base;
  const theirCeil = theirs.max;

  if (ourFloor > theirCeil) {
    return "You outspeed every Spe scenario — even their max Spe + nature.";
  }
  if (theirFloor > ourCeil) {
    return "They outspeed every Spe scenario — even your max Spe + nature.";
  }
  if (ourCeil > theirCeil && ourFloor >= theirFloor) {
    return "You hold the Spe edge across most invest levels — watch if they max Spe + nature into a race.";
  }
  if (theirCeil > ourCeil && theirFloor >= ourFloor) {
    return "They hold the Spe edge across most invest levels — you need max Spe + nature (or priority) to contest.";
  }
  return "Spe depends on invest. Compare the three rows: base, +32 SP, and +32 SP with a Spe nature.";
}

export function LiveSpeHero({
  ours,
  theirs,
}: {
  ours: CatalogEntry;
  theirs: CatalogEntry;
}) {
  const reduce = useReducedMotion();
  const ourScenarios = liveSpeScenarios(ours);
  const theirScenarios = liveSpeScenarios(theirs);
  const max = Math.max(
    ...ORDER.flatMap((k) => [ourScenarios[k], theirScenarios[k]]),
    1,
  );

  return (
    <div className="rounded-[24px] border border-line/70 bg-sunken/50 px-4 py-4 md:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Speed race
          </p>
          <p className="mt-1 max-w-[48ch] text-sm leading-snug text-ink/90">
            {scenarioVerdict(ourScenarios, theirScenarios)}
          </p>
        </div>
        <p className="max-w-[28ch] text-[11px] leading-snug text-muted">
          Green is faster in that scenario. Assume they may run 32 Spe SP and a Spe nature
          (Timid / Jolly / Hasty / Naive).
        </p>
      </div>

      <ul className="mt-4 space-y-3">
        {ORDER.map((key) => {
          const ov = ourScenarios[key];
          const tv = theirScenarios[key];
          const who = whoWins(ov, tv);
          const ourPct = Math.max(12, (ov / max) * 100);
          const theirPct = Math.max(12, (tv / max) * 100);
          const meta = SPE_SCENARIO_META[key];
          const ourBar = who === "us" ? WIN : who === "them" ? LOSE : TIE;
          const theirBar = who === "them" ? WIN : who === "us" ? LOSE : TIE;
          const ourNum = who === "us" ? WIN : who === "them" ? LOSE_SOFT : TIE_TEXT;
          const theirNum = who === "them" ? WIN : who === "us" ? LOSE_SOFT : TIE_TEXT;

          return (
            <li key={key} className="grid grid-cols-[3.25rem_1fr_3.25rem] items-center gap-2 md:grid-cols-[3.75rem_1fr_3.75rem]">
              <span
                className="text-right font-mono text-sm font-semibold tabular-nums md:text-base"
                style={{ color: ourNum }}
              >
                {ov}
              </span>
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-col items-center gap-0.5 text-center">
                  <span
                    className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: who === "tie" ? TIE_TEXT : WIN }}
                  >
                    {meta.label}
                  </span>
                  <span className="text-[10px] text-muted">{meta.hint}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="flex justify-end overflow-hidden rounded-full bg-black/40">
                    <motion.div
                      className={`rounded-full ${who === "us" ? "h-3" : "h-2.5"}`}
                      style={{
                        background: ourBar,
                        width: `${ourPct}%`,
                        boxShadow: who === "us" ? `0 0 14px ${WIN_SOFT}` : undefined,
                      }}
                      initial={reduce ? false : { scaleX: 0.2, originX: 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: motionTokens.layout, ease: easeOut }}
                    />
                  </div>
                  <div className="overflow-hidden rounded-full bg-black/40">
                    <motion.div
                      className={`rounded-full ${who === "them" ? "h-3" : "h-2.5"}`}
                      style={{
                        background: theirBar,
                        width: `${theirPct}%`,
                        boxShadow: who === "them" ? `0 0 14px ${WIN_SOFT}` : undefined,
                      }}
                      initial={reduce ? false : { scaleX: 0.2, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: motionTokens.layout, ease: easeOut }}
                    />
                  </div>
                </div>
                <p className="mt-1.5 text-center font-mono text-[10px] uppercase tracking-wide text-muted">
                  {who === "us"
                    ? "You faster"
                    : who === "them"
                      ? "They faster"
                      : "Speed tie"}
                </p>
              </div>
              <span
                className="font-mono text-sm font-semibold tabular-nums md:text-base"
                style={{ color: theirNum }}
              >
                {tv}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
