"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { DecisionTree } from "@/components/learn/DecisionTree";
import { ManualLoopStrip } from "@/components/manuals/ManualLoopStrip";
import { ManualSwitchStrip } from "@/components/manuals/ManualSwitchStrip";
import { ManualSection } from "@/components/manuals/ManualSection";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { flowsFor } from "@/content/classroom-flows";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import type { ManualFlow, ManualGameState, ManualPack, TeamManual } from "@/content/manuals";

type Stage = {
  id: string;
  label: string;
  hint: string;
  kind: "flow" | "switches" | "plays" | "states";
  flow?: ManualFlow;
};

function buildStages(
  flows: ManualFlow[],
  loops: { title: string; body: string }[],
  switches: { into: string; send: string }[],
  gameStates: ManualGameState[],
): Stage[] {
  const lead = flows.find((f) => f.id === "lead" || f.title.toLowerCase() === "lead");
  const mid = flows.find((f) => f.id === "mid" || f.title.toLowerCase() === "mid");
  const late = flows.find((f) => f.id === "late" || f.title.toLowerCase() === "late");
  const used = new Set([lead?.id, mid?.id, late?.id].filter(Boolean));
  const stages: Stage[] = [];

  if (lead) {
    stages.push({
      id: lead.id,
      label: "Lead",
      hint: "Opening click from preview",
      kind: "flow",
      flow: lead,
    });
  }
  if (mid) {
    stages.push({
      id: mid.id,
      label: "Mid",
      hint: "Board after the first trade",
      kind: "flow",
      flow: mid,
    });
  }
  if (late) {
    stages.push({
      id: late.id,
      label: "Late",
      hint: "How you close",
      kind: "flow",
      flow: late,
    });
  }

  for (const flow of flows) {
    if (used.has(flow.id)) continue;
    if (flow.id === "macro" || flow.title.toLowerCase().includes("package")) {
      stages.push({
        id: flow.id,
        label: flow.title || "Package",
        hint: flow.lede ?? "Whole-package path",
        kind: "flow",
        flow,
      });
      continue;
    }
    if ((flow.forks?.length ?? 0) === 0) continue;
    stages.push({
      id: flow.id,
      label: flow.title || flow.id,
      hint: flow.lede ?? "Situation branch",
      kind: "flow",
      flow,
    });
  }

  if (switches.length) {
    stages.push({
      id: "switches",
      label: "Switches",
      hint: "They click a type — who walks in",
      kind: "switches",
    });
  }
  if (loops.length) {
    stages.push({
      id: "plays",
      label: "Plays",
      hint: "Named loops you repeat",
      kind: "plays",
    });
  }
  if (gameStates.length) {
    stages.push({
      id: "states",
      label: "States",
      hint: "Recognize the board, then act",
      kind: "states",
    });
  }
  return stages;
}

export function ManualGameBoard({
  manual,
  pack,
}: {
  manual: TeamManual;
  pack?: ManualPack;
}) {
  const switches = (manual.switches ?? []).filter((s) => s.into || s.send);
  const loops = manual.loops.filter((l) => l.title || l.body);
  const gameStates = pack?.gameStates ?? [];
  const flows = flowsFor(manual);

  const stages = useMemo(
    () => buildStages(flows, loops, switches, gameStates),
    [flows, loops, switches, gameStates],
  );

  const [stageId, setStageId] = useState(stages[0]?.id ?? "lead");

  useEffect(() => {
    if (!stages.some((s) => s.id === stageId)) {
      setStageId(stages[0]?.id ?? "lead");
    }
  }, [stages, stageId]);

  if (!stages.length) return null;

  const stage = stages.find((s) => s.id === stageId) ?? stages[0];
  const teamSlugs = manual.slugs.filter((s): s is string => Boolean(s));
  const wash = getPokemon(teamSlugs[0]);

  return (
    <MotionConfig reducedMotion="user">
      <ManualSection
        id="game"
        title="Game"
        purpose="Walk the match from a situation. Tap a stage, then follow one branch."
      >
        <div
          className="relative overflow-hidden rounded-[32px] border border-line/70 bg-sunken/60 shadow-[0_22px_60px_rgba(0,0,0,0.28)]"
          style={wash ? cssVars(wash.palette) : undefined}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            aria-hidden
            style={{
              background: wash
                ? `radial-gradient(80% 60% at 0% 0%, color-mix(in srgb, var(--mon-wash) 22%, transparent), transparent 55%)`
                : undefined,
            }}
          />

          <div className="relative border-b border-line/60 px-4 py-4 sm:px-5">
            <ol className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {stages.map((s, i) => {
                const on = s.id === stage.id;
                return (
                  <li key={s.id} className="flex shrink-0 items-center gap-2">
                    {i > 0 ? (
                      <span aria-hidden className="hidden text-muted sm:inline">
                        →
                      </span>
                    ) : null}
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setStageId(s.id)}
                      className={`min-w-[7.5rem] rounded-[20px] px-3.5 py-2.5 text-left transition ${
                        on
                          ? "bg-ink text-bg shadow-[0_12px_28px_rgba(0,0,0,0.32)]"
                          : "border border-line/70 bg-raised/40 text-muted hover:border-ink/30 hover:text-ink"
                      }`}
                    >
                      <span className="block text-sm font-semibold tracking-tight">{s.label}</span>
                      <span className={`mt-0.5 block max-w-[14rem] truncate text-[11px] ${on ? "text-bg/65" : ""}`}>
                        {s.hint}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${pack?.id ?? "team"}-${stage.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: motionTokens.state, ease: easeOut }}
              className="relative px-3 py-5 sm:px-5 sm:py-6"
            >
              {stage.kind === "flow" && stage.flow ? <FlowStage flow={stage.flow} /> : null}
              {stage.kind === "switches" ? (
                <ManualSwitchStrip switches={switches} teamSlugs={teamSlugs} embed />
              ) : null}
              {stage.kind === "plays" ? <ManualLoopStrip loops={loops} embed /> : null}
              {stage.kind === "states" ? <StateMap states={gameStates} /> : null}
            </motion.div>
          </AnimatePresence>
        </div>

        {pack?.cheatSheet?.length ? (
          <div className="mt-6 overflow-hidden rounded-[24px] border border-line/70">
            <div className="border-b border-line/60 px-4 py-3">
              <p className="text-sm font-semibold tracking-tight">Quick reads</p>
              <p className="mt-0.5 text-xs text-muted">
                Situation → preferred thought for {pack.label}
              </p>
            </div>
            <ul className="divide-y divide-line/50">
              {pack.cheatSheet.map((row) => (
                <li
                  key={row.situation}
                  className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-4"
                >
                  <p className="text-sm text-muted">{row.situation}</p>
                  <p className="text-sm font-medium text-ink/90">{row.thought}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </ManualSection>
    </MotionConfig>
  );
}

function FlowStage({ flow }: { flow: ManualFlow }) {
  return (
    <div>
      <div className="mb-4 max-w-[56ch] px-1">
        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{flow.title}</h3>
        {flow.lede ? <p className="mt-2 text-sm leading-relaxed text-muted">{flow.lede}</p> : null}
        <p className="mt-3 text-xs text-muted">
          Tap a branch to open the next fork. Escape backs up one step.
        </p>
      </div>
      <DecisionTree key={flow.id} flow={flow} embed />
    </div>
  );
}

function StateMap({ states }: { states: ManualGameState[] }) {
  return (
    <div>
      <div className="mb-4 max-w-[52ch] px-1">
        <h3 className="text-xl font-semibold tracking-tight">Board states</h3>
        <p className="mt-2 text-sm text-muted">
          Name the state you are in, then play the line — do not invent a fourth job mid-game.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {states.map((s, i) => {
          const mon = s.slug ? getPokemon(s.slug) : undefined;
          return (
            <li
              key={s.id}
              className="relative overflow-hidden rounded-[24px] border border-line/70 bg-raised/35 px-4 py-4"
              style={mon ? cssVars(mon.palette) : undefined}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    State {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-tight">{s.label}</p>
                </div>
                {mon ? (
                  <PokemonArt
                    slug={mon.slug}
                    src={mon.sprite || mon.artwork}
                    name={mon.name}
                    size={40}
                  />
                ) : null}
              </div>
              <p className="mt-1 text-[12px] text-muted">{s.trigger}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/90">{s.play}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
