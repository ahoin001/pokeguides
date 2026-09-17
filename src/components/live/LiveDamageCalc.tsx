"use client";

import { useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/lookup";
import { getRankedBySlug } from "@/lib/ranked/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import {
  calcDamage,
  maxOffenseSp,
  ZERO_SP,
  type DamageMove,
} from "@/lib/champions/damage";
import { getChampionsMove } from "@/lib/champions/move-data";
import { useLiveMatchStore, type SpPreset } from "@/stores/live-match";
import type { SampleSp } from "@/types/pokemon";

function resolveSp(slug: string, preset: SpPreset, move: DamageMove | undefined): SampleSp {
  if (preset === "zero") return { ...ZERO_SP };
  if (preset === "max-offense") return maxOffenseSp(move?.category === "special" ? "special" : "physical");
  const ranked = getRankedBySlug(slug);
  if (ranked?.spread) {
    const { hp, atk, def, spa, spd, spe } = ranked.spread;
    return { hp, atk, def, spa, spd, spe };
  }
  return maxOffenseSp(move?.category === "special" ? "special" : "physical");
}

function PresetToggle({
  value,
  onChange,
}: {
  value: SpPreset;
  onChange: (p: SpPreset) => void;
}) {
  const opts: { id: SpPreset; label: string }[] = [
    { id: "zero", label: "0 SP" },
    { id: "ranked", label: "Ranked" },
    { id: "max-offense", label: "Max atk" },
  ];
  return (
    <div className="flex flex-wrap gap-1">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-full px-2.5 py-1 text-[11px] transition ${
            value === o.id ? "bg-ink text-bg" : "bg-white/6 text-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function LiveDamageCalc() {
  const attackerSlug = useLiveMatchStore((s) => s.attackerSlug);
  const defenderSlug = useLiveMatchStore((s) => s.defenderSlug);
  const weather = useLiveMatchStore((s) => s.weather);
  const burned = useLiveMatchStore((s) => s.burned);
  const screens = useLiveMatchStore((s) => s.screens);
  const attackerPreset = useLiveMatchStore((s) => s.attackerPreset);
  const defenderPreset = useLiveMatchStore((s) => s.defenderPreset);
  const calcOpen = useLiveMatchStore((s) => s.calcOpen);
  const setWeather = useLiveMatchStore((s) => s.setWeather);
  const setBurned = useLiveMatchStore((s) => s.setBurned);
  const setScreens = useLiveMatchStore((s) => s.setScreens);
  const setAttackerPreset = useLiveMatchStore((s) => s.setAttackerPreset);
  const setDefenderPreset = useLiveMatchStore((s) => s.setDefenderPreset);
  const setCalcOpen = useLiveMatchStore((s) => s.setCalcOpen);
  const swapCalcSides = useLiveMatchStore((s) => s.swapCalcSides);

  const attacker = attackerSlug ? getPokemon(attackerSlug) : undefined;
  const defender = defenderSlug ? getPokemon(defenderSlug) : undefined;
  const rankedAtk = attackerSlug ? getRankedBySlug(attackerSlug) : undefined;

  const moveOptions = useMemo(() => {
    const names = rankedAtk?.moves.map((m) => m.name) ?? [];
    return names
      .map((n) => getChampionsMove(n))
      .filter((m): m is DamageMove => Boolean(m && m.category !== "status" && m.basePower > 0));
  }, [rankedAtk]);

  const [moveName, setMoveName] = useState<string>("");
  const activeMoveName = moveName && moveOptions.some((m) => m.name === moveName)
    ? moveName
    : moveOptions[0]?.name ?? "";
  const move = activeMoveName ? getChampionsMove(activeMoveName) : undefined;

  const result = useMemo(() => {
    if (!attacker || !defender || !move || !attackerSlug || !defenderSlug) return null;
    const atkSp = resolveSp(attackerSlug, attackerPreset, move);
    const defSp = resolveSp(defenderSlug, defenderPreset, move);
    return calcDamage(
      {
        types: attacker.types,
        base: attacker.stats,
        sp: atkSp,
        nature: rankedAtk?.nature?.name,
      },
      {
        types: defender.types,
        base: defender.stats,
        sp: defSp,
        nature: getRankedBySlug(defenderSlug)?.nature?.name,
      },
      move,
      { weather, burned, screens },
    );
  }, [
    attacker,
    defender,
    move,
    attackerSlug,
    defenderSlug,
    attackerPreset,
    defenderPreset,
    rankedAtk,
    weather,
    burned,
    screens,
  ]);

  return (
    <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 border-t border-line/80 bg-bg/95 backdrop-blur-md md:bottom-0">
      {!calcOpen ? (
        <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-3 px-4 py-2.5 md:px-6">
          <p className="text-sm text-muted">
            Damage calc
            {attacker && defender ? (
              <span className="text-ink/80">
                {" "}
                · {attacker.name} → {defender.name}
                {result ? ` · ${result.min}–${result.max}` : ""}
              </span>
            ) : (
              <span> · collapsed</span>
            )}
          </p>
          <button
            type="button"
            onClick={() => setCalcOpen(true)}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium transition hover:border-ink/40"
          >
            Open
          </button>
        </div>
      ) : (
        <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-6 md:px-6">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setCalcOpen(false)}
              className="rounded-full border border-line px-2.5 py-1 text-[10px] uppercase tracking-wide text-muted hover:text-ink"
            >
              Hide
            </button>
            <SideChip label="Atk" mon={attacker} empty="Set attacker" />
            <button
              type="button"
              onClick={swapCalcSides}
              className="rounded-full border border-line px-2 py-1 text-[10px] uppercase tracking-wide text-muted hover:text-ink"
            >
              Swap
            </button>
            <SideChip label="Def" mon={defender} empty="Set defender" />

            <select
              value={activeMoveName}
              onChange={(e) => setMoveName(e.target.value)}
              disabled={!moveOptions.length}
              className="min-w-[10rem] flex-1 rounded-xl border border-line bg-sunken px-3 py-2 text-sm md:max-w-[14rem]"
            >
              {!moveOptions.length ? <option>No damaging moves</option> : null}
              {moveOptions.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} ({m.basePower})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PresetToggle value={attackerPreset} onChange={setAttackerPreset} />
            <span className="text-[10px] text-muted">→</span>
            <PresetToggle value={defenderPreset} onChange={setDefenderPreset} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["none", "rain", "sun"] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeather(w)}
                className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${
                  weather === w ? "bg-ink text-bg" : "bg-white/6 text-muted"
                }`}
              >
                {w === "none" ? "Clear" : w}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setBurned(!burned)}
              className={`rounded-full px-2.5 py-1 text-[11px] ${
                burned ? "bg-ink text-bg" : "bg-white/6 text-muted"
              }`}
            >
              Burn
            </button>
            <button
              type="button"
              onClick={() => setScreens(!screens)}
              className={`rounded-full px-2.5 py-1 text-[11px] ${
                screens ? "bg-ink text-bg" : "bg-white/6 text-muted"
              }`}
            >
              Screens
            </button>
          </div>

          <div className="min-w-[9rem] md:text-right">
            {result ? (
              <div>
                <p className="text-lg font-semibold tabular-nums tracking-tight">
                  {result.min}–{result.max}
                </p>
                <p className="font-mono text-xs text-muted">
                  {result.minPct}–{result.maxPct}% · HP {result.defenderHp}
                  {result.effectiveness !== 1 ? ` · ${result.effectiveness}×` : ""}
                  {result.stab ? " · STAB" : ""}
                </p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-full rounded-full bg-[var(--mon-vibrant,#c8b48a)]"
                    style={{ width: `${Math.min(100, result.maxPct)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">Pick attacker, defender, and a move.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SideChip({
  label,
  mon,
  empty,
}: {
  label: string;
  mon: ReturnType<typeof getPokemon>;
  empty: string;
}) {
  if (!mon) {
    return (
      <span className="rounded-full border border-dashed border-line px-3 py-1.5 text-xs text-muted">
        {label}: {empty}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-line bg-raised/50 py-1 pl-1 pr-3 text-xs"
      style={cssVars(mon.palette)}
    >
      <span className="font-mono text-[9px] uppercase text-muted">{label}</span>
      <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={28} />
      <span className="max-w-[8ch] truncate font-medium">{mon.name}</span>
    </span>
  );
}
