"use client";

import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import {
  resolvePackStrategy,
  type ManualPack,
  type ManualPlanBeat,
  type TeamManual,
} from "@/content/manuals";

const CLOCK = ["Lead", "Mid", "Late"] as const;

function stanceOf(title: string): (typeof CLOCK)[number] | "Beat" {
  const t = title.toLowerCase();
  if (t.includes("lead") || t.includes("open") || t.includes("set")) return "Lead";
  if (t.includes("late") || t.includes("finish") || t.includes("clean")) return "Late";
  if (t.includes("mid") || t.includes("defend") || t.includes("control")) return "Mid";
  return "Beat";
}

export function ManualGameplan({
  pack,
  plan = [],
}: {
  pack?: ManualPack;
  plan?: ManualPlanBeat[];
  /** Parent unused for now — kept for future pack/team contrast. */
  parent?: TeamManual;
}) {
  const strategy = pack ? resolvePackStrategy(pack) : null;
  if (!strategy && !plan.length) return null;

  return (
    <div className="space-y-10">
      {strategy ? (
        <div className="space-y-6">
          {strategy.mantra ? (
            <p className="max-w-[48ch] text-2xl font-semibold tracking-tight sm:text-3xl">
              {strategy.mantra}
            </p>
          ) : null}
          {strategy.gamePlan ? (
            <p className="max-w-[52ch] text-lg text-muted">{strategy.gamePlan}</p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-raised/40 p-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Purpose
              </p>
              <p className="mt-2 text-sm leading-snug">{strategy.purpose}</p>
            </div>
            {strategy.preserveRule ? (
              <div className="rounded-2xl border border-line bg-raised/40 p-4">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Preserve
                </p>
                <p className="mt-2 text-sm leading-snug">{strategy.preserveRule}</p>
              </div>
            ) : null}
          </div>

          {strategy.turnChecklist?.length ? (
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Turn checklist
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-snug">
                {strategy.turnChecklist.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            </div>
          ) : null}

          {strategy.defaultLead ? (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-raised/30 px-4 py-3">
              {(() => {
                const mon = getPokemon(strategy.defaultLead!);
                if (!mon) return null;
                return (
                  <>
                    <span style={cssVars(mon.palette)}>
                      <PokemonArt
                        slug={mon.slug}
                        src={mon.sprite || mon.artwork}
                        name={mon.name}
                        size={44}
                      />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Default lead · {mon.name}</p>
                      {strategy.defaultLeadWhy ? (
                        <p className="mt-0.5 text-xs text-muted">{strategy.defaultLeadWhy}</p>
                      ) : null}
                    </div>
                  </>
                );
              })()}
            </div>
          ) : null}
        </div>
      ) : null}

      {plan.length ? (
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Clock
          </p>
          <ol className="mt-4 space-y-4">
            {plan.map((beat, i) => {
              const stance = stanceOf(beat.title);
              return (
                <li
                  key={`${beat.title}-${i}`}
                  className="grid gap-3 rounded-[24px] border border-line bg-raised/40 p-5 sm:grid-cols-[6rem_1fr]"
                >
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                      {stance === "Beat" ? `Beat ${i + 1}` : stance}
                    </p>
                    <p className="mt-2 font-semibold tracking-tight">{beat.title}</p>
                  </div>
                  <div className="space-y-2 text-sm leading-snug">
                    <p>
                      <span className="font-medium">Goal. </span>
                      <span className="text-muted">{beat.goal}</span>
                    </p>
                    <p>
                      <span className="font-medium">Play. </span>
                      <span className="text-muted">{beat.play}</span>
                    </p>
                    {beat.next ? (
                      <p>
                        <span className="font-medium">Next. </span>
                        <span className="text-muted">{beat.next}</span>
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
