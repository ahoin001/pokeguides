"use client";

import { useState } from "react";
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
  scarfOpen: boolean,
): string {
  const ourFloor = ours.base;
  const ourCeil = ours.max;
  const theirFloor = theirs.base;
  const theirCeil = theirs.max;
  const theirScarfCeil = applyChoiceScarf(theirCeil);
  const ourScarfCeil = applyChoiceScarf(ourCeil);

  if (!scarfOpen) {
    if (ourFloor > theirCeil) {
      return "You outspeed every Spe scenario without items — toggle Scarf if they might lock Choice Scarf.";
    }
    if (theirFloor > ourCeil) {
      return "They outspeed every Spe scenario without items — toggle Scarf to see if yours flips it.";
    }
    if (ourCeil > theirCeil && ourFloor >= theirFloor) {
      return "You hold the Spe edge across most invest levels — toggle Scarf for Choice Scarf races.";
    }
    if (theirCeil > ourCeil && theirFloor >= ourFloor) {
      return "They hold the Spe edge across most invest levels — toggle Scarf or look at priority.";
    }
    return "Spe depends on invest. Toggle Choice Scarf when either side might lock it.";
  }

  if (ourFloor > theirScarfCeil) {
    return "You outspeed every Spe scenario — even their max Spe + nature + Choice Scarf.";
  }
  if (theirFloor > ourScarfCeil) {
    return "They outspeed every Spe scenario — even your max Spe + nature + Choice Scarf.";
  }
  if (ourFloor > theirCeil && ourFloor <= theirScarfCeil) {
    return "You outspeed without items — but Choice Scarf on them can flip the race.";
  }
  if (theirFloor > ourCeil && theirFloor <= ourScarfCeil) {
    return "They outspeed without items — your Choice Scarf can flip the race.";
  }
  return "Scarf rows show one-sided Choice Scarf (×1.5). Usually only one side locks it.";
}

function RaceRow({
  label,
  hint,
  ours,
  theirs,
  scaleMax,
  reduce,
}: {
  label: string;
  hint: string;
  ours: number;
  theirs: number;
  scaleMax: number;
  reduce: boolean | null;
}) {
  const who = whoWins(ours, theirs);
  const ourPct = Math.max(12, (ours / scaleMax) * 100);
  const theirPct = Math.max(12, (theirs / scaleMax) * 100);
  const ourBar = who === "us" ? WIN : who === "them" ? LOSE : TIE;
  const theirBar = who === "them" ? WIN : who === "us" ? LOSE : TIE;
  const ourNum = who === "us" ? WIN : who === "them" ? LOSE_SOFT : TIE_TEXT;
  const theirNum = who === "them" ? WIN : who === "us" ? LOSE_SOFT : TIE_TEXT;

  return (
    <li className="grid grid-cols-[3.25rem_1fr_3.25rem] items-center gap-2 md:grid-cols-[3.75rem_1fr_3.75rem]">
      <span
        className="text-right font-mono text-sm font-semibold tabular-nums md:text-base"
        style={{ color: ourNum }}
      >
        {ours}
      </span>
      <div className="min-w-0">
        <div className="mb-1.5 flex flex-col items-center gap-0.5 text-center">
          <span
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: who === "tie" ? TIE_TEXT : WIN }}
          >
            {label}
          </span>
          <span className="text-[10px] text-muted">{hint}</span>
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
          {winLabel(who)}
        </p>
      </div>
      <span
        className="font-mono text-sm font-semibold tabular-nums md:text-base"
        style={{ color: theirNum }}
      >
        {theirs}
      </span>
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
  const [scarfOpen, setScarfOpen] = useState(false);
  const ourScenarios = liveSpeScenarios(ours);
  const theirScenarios = liveSpeScenarios(theirs);

  const scaleMax = Math.max(
    ...SPE_SCENARIO_ORDER.flatMap((k) => {
      const o = ourScenarios[k];
      const t = theirScenarios[k];
      if (!scarfOpen) return [o, t];
      return [o, t, applyChoiceScarf(o), applyChoiceScarf(t)];
    }),
    1,
  );

  return (
    <div className="rounded-[24px] border border-line/70 bg-sunken/50 px-4 py-4 md:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Speed race
          </p>
          <p className="mt-1 max-w-[52ch] text-sm leading-snug text-ink/90">
            {scenarioVerdict(ourScenarios, theirScenarios, scarfOpen)}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={scarfOpen}
          onClick={() => setScarfOpen((v) => !v)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
            scarfOpen
              ? "bg-ink text-bg"
              : "border border-line text-muted hover:border-ink/40 hover:text-ink"
          }`}
        >
          {scarfOpen ? "Choice Scarf on" : "Choice Scarf"}
        </button>
      </div>

      <p className="mt-2 text-[11px] leading-snug text-muted">
        {scarfOpen
          ? "Showing one-sided Scarf races under each invest level (×1.5 — usually only one side locks it)."
          : "Base · +32 Spe · +32 + Spe nature. Turn on Choice Scarf when either side might lock it."}
      </p>

      <ul className="mt-4 space-y-4">
        {SPE_SCENARIO_ORDER.map((key: SpeScenarioKey) => {
          const meta = SPE_SCENARIO_META[key];
          const ourBare = ourScenarios[key];
          const theirBare = theirScenarios[key];
          const ourScarf = applyChoiceScarf(ourBare);
          const theirScarf = applyChoiceScarf(theirBare);

          return (
            <li
              key={key}
              className={
                scarfOpen
                  ? "rounded-2xl border border-line/50 bg-raised/30 px-3 py-3 md:px-4"
                  : undefined
              }
            >
              <ul className="space-y-3">
                <RaceRow
                  label={meta.label}
                  hint={scarfOpen ? `${meta.hint} · no item` : meta.hint}
                  ours={ourBare}
                  theirs={theirBare}
                  scaleMax={scaleMax}
                  reduce={reduce}
                />
                {scarfOpen ? (
                  <>
                    <RaceRow
                      label="They Choice Scarf"
                      hint={`Your ${ourBare} vs their Scarf ${theirScarf}`}
                      ours={ourBare}
                      theirs={theirScarf}
                      scaleMax={scaleMax}
                      reduce={reduce}
                    />
                    <RaceRow
                      label="You Choice Scarf"
                      hint={`Your Scarf ${ourScarf} vs their ${theirBare}`}
                      ours={ourScarf}
                      theirs={theirBare}
                      scaleMax={scaleMax}
                      reduce={reduce}
                    />
                  </>
                ) : null}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
