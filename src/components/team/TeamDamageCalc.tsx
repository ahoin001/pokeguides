"use client";

import { useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/lookup";
import { calcDamage, maxOffenseSp, ZERO_SP } from "@/lib/champions/damage";
import { getChampionsMove } from "@/lib/champions/move-data";
import { getRankedBySlug } from "@/lib/ranked/load";
import type { CatalogEntry } from "@/types/pokemon";

/**
 * Optional damage check on Team builder.
 * Rough Lv50 estimate — Live Match remains the clock tool.
 */
export function TeamDamageCalc({
  team,
  slotMoves,
}: {
  team: CatalogEntry[];
  slotMoves: Record<string, string[]>;
}) {
  const [attackerSlug, setAttackerSlug] = useState(team[0]?.slug ?? "");
  const [defenderSlug, setDefenderSlug] = useState(team[1]?.slug ?? team[0]?.slug ?? "");
  const [moveName, setMoveName] = useState("");

  const attacker = attackerSlug ? getPokemon(attackerSlug) : undefined;
  const defender = defenderSlug ? getPokemon(defenderSlug) : undefined;
  const kit = slotMoves[attackerSlug] ?? [];

  const move = moveName ? getChampionsMove(moveName) : undefined;

  const result = useMemo(() => {
    if (!attacker || !defender || !move) return null;
    const rankedAtk = getRankedBySlug(attacker.slug);
    const rankedDef = getRankedBySlug(defender.slug);
    return calcDamage(
      {
        types: attacker.types,
        base: attacker.stats,
        sp: maxOffenseSp(move.category),
        nature: rankedAtk?.nature?.name,
      },
      {
        types: defender.types,
        base: defender.stats,
        sp: ZERO_SP,
        nature: rankedDef?.nature?.name,
      },
      move,
      { weather: "none", burned: false, screens: false },
    );
  }, [attacker, defender, move]);

  if (!team.length) return null;

  return (
    <section className="rounded-[28px] border border-line bg-raised/30 p-4 md:p-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Luxury</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">Damage check</h2>
        <p className="mt-1 max-w-[48ch] text-sm text-muted">
          Attacker at max offense SP vs defender at 0 SP. No items or abilities. Use Live Match for
          full clock calcs.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Attacker</span>
          <select
            value={attackerSlug}
            onChange={(e) => {
              setAttackerSlug(e.target.value);
              setMoveName("");
            }}
            className="mt-1.5 w-full rounded-xl border border-line bg-sunken px-3 py-2"
          >
            {team.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Defender</span>
          <select
            value={defenderSlug}
            onChange={(e) => setDefenderSlug(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-sunken px-3 py-2"
          >
            {team.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs text-muted">Move from the attacker’s kit:</p>
        {kit.length ? (
          <div className="flex flex-wrap gap-1.5">
            {kit.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setMoveName(name)}
                className={`rounded-full px-3 py-1.5 text-xs transition ${
                  moveName === name ? "bg-ink text-bg" : "border border-line text-muted hover:text-ink"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Add moves on the focus rail first, then pick one here.
          </p>
        )}
      </div>

      {result && move ? (
        <div className="mt-5 rounded-2xl border border-line bg-sunken/60 px-4 py-3">
          <p className="text-sm font-medium">
            {attacker?.name} · {move.name} → {defender?.name}
          </p>
          <p className="mt-2 font-mono text-2xl tabular-nums tracking-tight">
            {result.min}–{result.max}
            <span className="ml-2 text-sm font-sans text-muted">
              ({result.minPct.toFixed(0)}–{result.maxPct.toFixed(0)}%)
            </span>
          </p>
          <p className="mt-1 text-[11px] text-muted">
            {result.stab ? "STAB · " : ""}
            {result.effectiveness}× type · {result.category}
          </p>
        </div>
      ) : null}
    </section>
  );
}
