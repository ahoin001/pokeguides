"use client";

import { motion, useReducedMotion } from "motion/react";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import {
  applyChoiceScarf,
  liveSpeScenarios,
  SPE_SCENARIO_META,
  SPE_SCENARIO_ORDER,
  type SpeScenarioKey,
} from "@/lib/live/compare";
import type { CatalogEntry } from "@/types/pokemon";

const WIN = "#3ecf8e";
const WIN_SOFT = "color-mix(in srgb, #3ecf8e 55%, transparent)";
const LOSE = "#6b2430";
const LOSE_SOFT = "color-mix(in srgb, #6b2430 70%, transparent)";
const TIE = "color-mix(in srgb, var(--ink) 28%, transparent)";
const TIE_TEXT = "var(--muted)";

function whoWins(ours: number, theirs: number): "us" | "them" | "tie" {
  if (ours > theirs) return "us";
  if (theirs > ours) return "them";
  return "tie";
}

function winLabel(who: "us" | "them" | "tie") {
  if (who === "us") return "You faster";
  if (who === "them") return "They faster";
  return "Speed tie";
}

function scenarioVerdict(
  ours: ReturnType<typeof liveSpeScenarios>,
  theirs: ReturnType<typeof liveSpeScenarios>,
): string {
  const ourFloor = ours.base;
  const ourCeil = ours.max;
  const theirFloor = theirs.base;
  const theirCeil = theirs.max;
  const theirScarfCeil = applyChoiceScarf(theirCeil);
  const ourScarfCeil = applyChoiceScarf(ourCeil);

  if (ourFloor > theirScarfCeil) {
    return "You outspeed every Spe scenario — even their max Spe + nature + Choice Scarf.";
  }
  if (theirFloor > ourScarfCeil) {
    return "They outspeed every Spe scenario — even your max Spe + nature + Choice Scarf.";
  }
  if (ourFloor > theirCeil && ourFloor <= theirScarfCeil) {
    return "You outspeed without items — but Choice Scarf on them can flip the race. Check the Scarf rows.";
  }
  if (theirFloor > ourCeil && theirFloor <= ourScarfCeil) {
    return "They outspeed without items — your Choice Scarf can flip the race. Check the Scarf rows.";
  }
  if (ourCeil > theirCeil && ourFloor >= theirFloor) {
    return "You hold the Spe edge across most invest levels — still watch Scarf and max Spe + nature.";
  }
  if (theirCeil > ourCeil && theirFloor >= ourFloor) {
    return "They hold the Spe edge across most invest levels — contest with max Spe + nature, Scarf, or priority.";
  }
  return "Spe depends on invest and Scarf. Compare bare rows, then each Choice Scarf case.";
}

function RaceRow({
  label,
  hint,
  ours,
  theirs,
  scaleMax,
  reduce,
  emphasize,
}: {
  label: string;
  hint: string;
  ours: number;
  theirs: number;
  scaleMax: number;
  reduce: boolean | null;
  emphasize?: boolean;
}) {
  const who = whoWins(ours, theirs);
  const ourPct = Math.max(12, (ours / scaleMax) * 100);
  const theirPct = Math.max(12, (theirs / scaleMax) * 100);
  const ourBar = who === "us" ? WIN : who === "them" ? LOSE : TIE;
  const theirBar = who === "them" ? WIN : who === "us" ? LOSE : TIE;
  const ourNum = who === "us" ? WIN : who === "them" ? LOSE_SOFT : TIE_TEXT;
  const theirNum = who === "them" ? WIN : who === "us" ? LOSE_SOFT : TIE_TEXT;

  return (
    <li
      className={`grid grid-cols-[3.25rem_1fr_3.25rem] items-center gap-2 md:grid-cols-[3.75rem_1fr_3.75rem] ${
        emphasize ? "" : "opacity-95"
      }`}
    >
      <span
        className={`text-right font-mono font-semibold tabular-nums ${emphasize ? "text-sm md:text-base" : "text-xs md:text-sm"}`}
        style={{ color: ourNum }}
      >
        {ours}
      </span>
      <div className="min-w-0">
        <div className="mb-1.5 flex flex-col items-center gap-0.5 text-center">
          <span
            className={`font-mono font-semibold uppercase tracking-[0.12em] ${emphasize ? "text-[11px]" : "text-[10px]"}`}
            style={{ color: who === "tie" ? TIE_TEXT : WIN }}
          >
            {label}
          </span>
          <span className="text-[10px] text-muted">{hint}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex justify-end overflow-hidden rounded-full bg-black/40">
            <motion.div
              className={`rounded-full ${who === "us" ? (emphasize ? "h-3" : "h-2.5") : emphasize ? "h-2.5" : "h-2"}`}
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
              className={`rounded-full ${who === "them" ? (emphasize ? "h-3" : "h-2.5") : emphasize ? "h-2.5" : "h-2"}`}
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
          {winLabel(who)}
        </p>
      </div>
      <span
        className={`font-mono font-semibold tabular-nums ${emphasize ? "text-sm md:text-base" : "text-xs md:text-sm"}`}
        style={{ color: theirNum }}
      >
        {theirs}
      </span>
    </li>
  );
}

function ScenarioBlock({
  scenarioKey,
  ourBare,
  theirBare,
  scaleMax,
  reduce,
}: {
  scenarioKey: SpeScenarioKey;
  ourBare: number;
  theirBare: number;
  scaleMax: number;
  reduce: boolean | null;
}) {
  const meta = SPE_SCENARIO_META[scenarioKey];
  const ourScarf = applyChoiceScarf(ourBare);
  const theirScarf = applyChoiceScarf(theirBare);

  return (
    <li className="rounded-2xl border border-line/50 bg-raised/30 px-3 py-3 md:px-4">
      <ul className="space-y-3">
        <RaceRow
          label={meta.label}
          hint={`${meta.hint} · no item`}
          ours={ourBare}
          theirs={theirBare}
          scaleMax={scaleMax}
          reduce={reduce}
          emphasize
        />
        <RaceRow
          label="They Choice Scarf"
          hint={`Your ${ourBare} vs their Scarf ${theirScarf} (×1.5)`}
          ours={ourBare}
          theirs={theirScarf}
          scaleMax={scaleMax}
          reduce={reduce}
        />
        <RaceRow
          label="You Choice Scarf"
          hint={`Your Scarf ${ourScarf} (×1.5) vs their ${theirBare}`}
          ours={ourScarf}
          theirs={theirBare}
          scaleMax={scaleMax}
          reduce={reduce}
        />
      </ul>
    </li>
  );
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

  const scaleMax = Math.max(
    ...SPE_SCENARIO_ORDER.flatMap((k) => [
      ourScenarios[k],
      theirScenarios[k],
      applyChoiceScarf(ourScenarios[k]),
      applyChoiceScarf(theirScenarios[k]),
    ]),
    1,
  );

  return (
    <div className="rounded-[24px] border border-line/70 bg-sunken/50 px-4 py-4 md:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Speed race
          </p>
          <p className="mt-1 max-w-[52ch] text-sm leading-snug text-ink/90">
            {scenarioVerdict(ourScenarios, theirScenarios)}
          </p>
        </div>
        <p className="max-w-[30ch] text-[11px] leading-snug text-muted">
          Each block is one invest level. Top row is no item; then{" "}
          <span className="text-ink/80">they Scarf</span> and{" "}
          <span className="text-ink/80">you Scarf</span> (Choice Scarf ×1.5 — usually only one side).
        </p>
      </div>

      <ul className="mt-4 space-y-4">
        {SPE_SCENARIO_ORDER.map((key) => (
          <ScenarioBlock
            key={key}
            scenarioKey={key}
            ourBare={ourScenarios[key]}
            theirBare={theirScenarios[key]}
            scaleMax={scaleMax}
            reduce={reduce}
          />
        ))}
      </ul>
    </div>
  );
}
