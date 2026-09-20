"use client";

import { useEffect, useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/lookup";
import { getRankedBySlug } from "@/lib/ranked/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import {
  calcDamage,
  damageVerdict,
  maxOffenseSp,
  ZERO_SP,
  type DamageMove,
  type DamageResult,
} from "@/lib/champions/damage";
import { getChampionsMove, searchChampionsDamagingMoves } from "@/lib/champions/move-data";
import { MoveChip } from "@/components/moves/MoveChip";
import { useLiveMatchStore, type SpPreset } from "@/stores/live-match";
import type { SampleSp } from "@/types/pokemon";

const COACH_KEY = "ringside-calc-coach-dismissed";

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

function effectivenessLabel(mult: number): string | null {
  if (mult === 0) return "Immune";
  if (mult >= 4) return "4× super effective";
  if (mult >= 2) return "Super effective";
  if (mult <= 0.25) return "Heavily resisted";
  if (mult < 1) return "Resisted";
  return null;
}

function MoveSearch({
  value,
  onChange,
  ladderMoves,
  disabled,
}: {
  value: string;
  onChange: (name: string) => void;
  ladderMoves: DamageMove[];
  disabled?: boolean;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const selected = value ? getChampionsMove(value) : undefined;

  const ladderNames = useMemo(() => new Set(ladderMoves.map((m) => m.name)), [ladderMoves]);

  const results = useMemo(() => {
    const searched = searchChampionsDamagingMoves(q, 30);
    if (!q.trim()) {
      const rest = searched.filter((m) => !ladderNames.has(m.name));
      return [...ladderMoves, ...rest].slice(0, 30);
    }
    // Keep ladder hits first when searching
    const ladderHits = ladderMoves.filter(
      (m) =>
        m.name.toLowerCase().includes(q.trim().toLowerCase()) ||
        m.type.includes(q.trim().toLowerCase()),
    );
    const seen = new Set(ladderHits.map((m) => m.name));
    return [...ladderHits, ...searched.filter((m) => !seen.has(m.name))].slice(0, 30);
  }, [q, ladderMoves, ladderNames]);

  return (
    <div className="relative space-y-1.5">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        Move
      </span>
      {ladderMoves.length ? (
        <div className="flex flex-wrap gap-1">
          {ladderMoves.slice(0, 8).map((m) => (
            <MoveChip
              key={m.name}
              name={m.name}
              type={m.type}
              selected={value === m.name}
              disabled={disabled}
              onClick={() => {
                onChange(m.name);
                setQ("");
                setOpen(false);
              }}
              title={`Common on Singles ladder · ${m.type} · ${m.basePower}`}
            />
          ))}
        </div>
      ) : null}
      <input
        value={open || q ? q : selected ? `${selected.name}` : q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setQ("");
        }}
        onBlur={() => {
          // delay so click on result registers
          window.setTimeout(() => setOpen(false), 120);
        }}
        disabled={disabled}
        placeholder="Search Champions moves… (Earthquake, Moonblast)"
        className="w-full rounded-xl border border-line bg-sunken px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-ink/40 disabled:opacity-50 md:max-w-[24rem]"
        autoComplete="off"
        spellCheck={false}
      />
      {selected && !open ? (
        <p className="text-[11px] text-muted">
          Selected: {selected.name} · {selected.type} · power {selected.basePower} · {selected.category}
          {ladderNames.has(selected.name) ? " · ladder kit" : " · Champions pool"}
        </p>
      ) : (
        <p className="text-[11px] text-muted">
          Pills are this Pokémon’s common ranked moves. Search any damaging move from the Champions
          move list (status moves like Yawn are excluded).
        </p>
      )}
      {open && !disabled ? (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-line bg-bg shadow-[var(--shadow)] md:max-w-[24rem]">
          {results.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-muted">No damaging moves match.</li>
          ) : (
            results.map((m) => {
              const onLadder = ladderNames.has(m.name);
              return (
                <li key={m.name}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(m.name);
                      setQ("");
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-white/6 ${
                      value === m.name ? "bg-white/8" : ""
                    }`}
                  >
                    <span className="min-w-0 truncate font-medium">
                      {m.name}
                      {onLadder ? (
                        <span className="ml-2 font-mono text-[10px] uppercase tracking-wide text-muted">
                          ladder
                        </span>
                      ) : null}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-muted">
                      {m.type} · {m.basePower} · {m.category}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}

function PresetToggle({
  value,
  onChange,
  side,
}: {
  value: SpPreset;
  onChange: (p: SpPreset) => void;
  side: "attacker" | "defender";
}) {
  const opts: { id: SpPreset; label: string; hint: string }[] = [
    {
      id: "ranked",
      label: "Ladder set",
      hint: side === "attacker" ? "Most common ranked attack invest" : "Most common ranked bulk",
    },
    {
      id: "max-offense",
      label: "Max offense",
      hint: "Assumes they dumped SP into the attacking / defending side of this hit",
    },
    {
      id: "zero",
      label: "No invest",
      hint: "0 SP in those stats — weakest plausible hit / softest wall",
    },
  ];
  const active = opts.find((o) => o.id === value) ?? opts[0];
  return (
    <div className="min-w-0 space-y-1.5">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        {side === "attacker" ? "Attacker invest" : "Defender invest"}
      </p>
      <div className="flex flex-wrap gap-1">
        {opts.map((o) => (
          <button
            key={o.id}
            type="button"
            title={o.hint}
            onClick={() => onChange(o.id)}
            className={`rounded-full px-2.5 py-1 text-[11px] transition ${
              value === o.id ? "bg-ink text-bg" : "bg-white/6 text-muted hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="text-[11px] leading-snug text-muted">{active.hint}</p>
    </div>
  );
}

function ResultPanel({
  result,
  moveName,
  defenderName,
}: {
  result: DamageResult;
  moveName: string;
  defenderName: string;
}) {
  const verdict = damageVerdict(result);
  const eff = effectivenessLabel(result.effectiveness);
  const toneClass =
    verdict.tone === "ko"
      ? "border-emerald-500/35 bg-emerald-500/10"
      : verdict.tone === "likely"
        ? "border-amber-400/35 bg-amber-400/10"
        : verdict.tone === "immune" || verdict.tone === "weak"
          ? "border-rose-400/30 bg-rose-400/8"
          : "border-line/70 bg-sunken/50";

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        What the numbers mean
      </p>
      <p className="mt-1 text-lg font-semibold tracking-tight">{verdict.headline}</p>
      <p className="mt-1 max-w-[42ch] text-sm leading-snug text-ink/85">{verdict.detail}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">
            {result.min}–{result.max}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            damage to {defenderName} ({result.minPct}–{result.maxPct}% of {result.defenderHp} HP)
          </p>
        </div>
        <ul className="flex flex-wrap gap-1.5 text-[11px]">
          {eff ? (
            <li className="rounded-full bg-white/8 px-2.5 py-1 text-ink/90">{eff}</li>
          ) : null}
          {result.stab ? (
            <li className="rounded-full bg-white/8 px-2.5 py-1 text-ink/90" title="Same-type attack bonus — matching type moves hit harder">
              STAB (+50%)
            </li>
          ) : null}
          <li className="rounded-full bg-white/8 px-2.5 py-1 capitalize text-ink/90">
            {result.category}
          </li>
        </ul>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/25">
        <span
          className="block h-full rounded-full bg-[var(--mon-vibrant,#c8b48a)]"
          style={{ width: `${Math.min(100, result.maxPct)}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] leading-snug text-muted">
        {moveName} rolls a random number between the low and high each time. That is why calcs show a
        range, not one number.
      </p>
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
  const activeBringSlug = useLiveMatchStore((s) => s.activeBringSlug);
  const activeFoeSlug = useLiveMatchStore((s) => s.activeFoeSlug);
  const setWeather = useLiveMatchStore((s) => s.setWeather);
  const setBurned = useLiveMatchStore((s) => s.setBurned);
  const setScreens = useLiveMatchStore((s) => s.setScreens);
  const setAttackerPreset = useLiveMatchStore((s) => s.setAttackerPreset);
  const setDefenderPreset = useLiveMatchStore((s) => s.setDefenderPreset);
  const setCalcOpen = useLiveMatchStore((s) => s.setCalcOpen);
  const swapCalcSides = useLiveMatchStore((s) => s.swapCalcSides);
  const setAttacker = useLiveMatchStore((s) => s.setAttacker);
  const setDefender = useLiveMatchStore((s) => s.setDefender);

  const attacker = attackerSlug ? getPokemon(attackerSlug) : undefined;
  const defender = defenderSlug ? getPokemon(defenderSlug) : undefined;
  const rankedAtk = attackerSlug ? getRankedBySlug(attackerSlug) : undefined;

  const [coachOpen, setCoachOpen] = useState(true);
  const [moveName, setMoveName] = useState<string>("");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(COACH_KEY) === "1") setCoachOpen(false);
    } catch {
      /* ignore */
    }
  }, []);

  const dismissCoach = () => {
    setCoachOpen(false);
    try {
      sessionStorage.setItem(COACH_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const fillFromDuel = () => {
    if (activeBringSlug) setAttacker(activeBringSlug);
    if (activeFoeSlug) setDefender(activeFoeSlug);
  };

  const ladderMoves = useMemo(() => {
    const names = rankedAtk?.moves.map((m) => m.name) ?? [];
    return names
      .map((n) => getChampionsMove(n))
      .filter((m): m is DamageMove => Boolean(m && m.category !== "status" && m.basePower > 0));
  }, [rankedAtk]);

  // When attacker changes, prefer their top ladder move if current pick is empty / invalid.
  useEffect(() => {
    if (!attackerSlug) {
      setMoveName("");
      return;
    }
    setMoveName((prev) => {
      if (prev && getChampionsMove(prev)) return prev;
      return ladderMoves[0]?.name ?? "";
    });
  }, [attackerSlug, ladderMoves]);

  const move = moveName ? getChampionsMove(moveName) : undefined;

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

  const missingSteps: string[] = [];
  if (!attacker) missingSteps.push("Pick who is attacking (left side).");
  if (!defender) missingSteps.push("Pick who is getting hit (right side).");
  if (attacker && !move) missingSteps.push("Search or tap a damaging move.");

  const collapsedVerdict = result ? damageVerdict(result).headline : null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 border-t border-line/80 bg-bg/95 backdrop-blur-md md:bottom-0">
      {!calcOpen ? (
        <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-3 px-4 py-2.5 md:px-6">
          <div className="min-w-0">
            <p className="text-sm text-ink">
              Damage calc
              {attacker && defender ? (
                <span className="text-muted">
                  {" "}
                  · {attacker.name} → {defender.name}
                </span>
              ) : (
                <span className="text-muted"> · answers “does this KO?”</span>
              )}
            </p>
            {result && collapsedVerdict ? (
              <p className="truncate text-[11px] text-muted">
                {collapsedVerdict} · {result.min}–{result.max} ({result.minPct}–{result.maxPct}%)
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setCalcOpen(true)}
            className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs font-medium transition hover:border-ink/40"
          >
            Open
          </button>
        </div>
      ) : (
        <div className="mx-auto max-h-[min(70dvh,36rem)] max-w-[1680px] overflow-y-auto px-4 py-3 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Damage calculator
              </p>
              <p className="mt-0.5 text-sm text-ink/90">
                Estimate how hard one move hits — before you click it in battle.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {!coachOpen ? (
                <button
                  type="button"
                  onClick={() => setCoachOpen(true)}
                  className="rounded-full border border-line px-2.5 py-1 text-[10px] uppercase tracking-wide text-muted hover:text-ink"
                >
                  How it works
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setCalcOpen(false)}
                className="rounded-full border border-line px-2.5 py-1 text-[10px] uppercase tracking-wide text-muted hover:text-ink"
              >
                Hide
              </button>
            </div>
          </div>

          {coachOpen ? (
            <div className="mt-3 rounded-2xl border border-line/70 bg-raised/50 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2 text-sm leading-snug text-ink/90">
                  <p className="font-medium">First time? Three steps.</p>
                  <ol className="list-decimal space-y-1 pl-4 text-muted">
                    <li>
                      Set <span className="text-ink">attacker</span> (who clicks) and{" "}
                      <span className="text-ink">defender</span> (who takes it). Use Swap to flip
                      “you hit them” ↔ “they hit you.”
                    </li>
                    <li>Search or tap a damaging move. Status moves (Yawn, Wisp) are not calced here.</li>
                    <li>
                      Read the verdict: <span className="text-ink">Always KOs</span>,{" "}
                      <span className="text-ink">Sometimes KOs</span>, or chip. The range is random
                      roll luck each hit.
                    </li>
                  </ol>
                  <p className="text-[11px] text-muted">
                    Shortcuts: from the duel stage, tap <span className="text-ink">Open damage calc</span>{" "}
                    to load your active bring into the foe automatically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={dismissCoach}
                  className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[10px] uppercase tracking-wide text-muted hover:text-ink"
                >
                  Got it
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <SideChip label="Attacker" hint="Clicks the move" mon={attacker} empty="Not set" />
                <button
                  type="button"
                  onClick={swapCalcSides}
                  className="rounded-full border border-line px-2.5 py-1.5 text-[11px] text-muted transition hover:border-ink/40 hover:text-ink"
                  title="Flip who attacks and who defends"
                >
                  Swap sides
                </button>
                <SideChip label="Defender" hint="Takes the hit" mon={defender} empty="Not set" />
                {(!attacker || !defender) && (activeBringSlug || activeFoeSlug) ? (
                  <button
                    type="button"
                    onClick={fillFromDuel}
                    className="rounded-full border border-line bg-ink px-3 py-1.5 text-[11px] font-medium text-bg"
                  >
                    Use duel pair
                  </button>
                ) : null}
              </div>

              <MoveSearch
                value={moveName}
                onChange={setMoveName}
                ladderMoves={ladderMoves}
                disabled={!attacker}
              />

              {missingSteps.length ? (
                <div className="rounded-2xl border border-dashed border-line/80 bg-sunken/40 px-4 py-3">
                  <p className="text-sm font-medium">Still need:</p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-muted">
                    {missingSteps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <PresetToggle value={attackerPreset} onChange={setAttackerPreset} side="attacker" />
                <PresetToggle value={defenderPreset} onChange={setDefenderPreset} side="defender" />
              </div>

              <div className="space-y-1.5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Field (optional)
                </p>
                <p className="text-[11px] text-muted">
                  Only turn these on if they are true in the battle — they change the math.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(["none", "rain", "sun"] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      title={
                        w === "none"
                          ? "No weather"
                          : w === "rain"
                            ? "Water moves stronger, Fire weaker"
                            : "Fire stronger, Water weaker"
                      }
                      onClick={() => setWeather(w)}
                      className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${
                        weather === w ? "bg-ink text-bg" : "bg-white/6 text-muted"
                      }`}
                    >
                      {w === "none" ? "No weather" : w}
                    </button>
                  ))}
                  <button
                    type="button"
                    title="Burn halves physical damage from the attacker"
                    onClick={() => setBurned(!burned)}
                    className={`rounded-full px-2.5 py-1 text-[11px] ${
                      burned ? "bg-ink text-bg" : "bg-white/6 text-muted"
                    }`}
                  >
                    Attacker burned
                  </button>
                  <button
                    type="button"
                    title="Reflect / Light Screen — halves this category of damage in singles"
                    onClick={() => setScreens(!screens)}
                    className={`rounded-full px-2.5 py-1 text-[11px] ${
                      screens ? "bg-ink text-bg" : "bg-white/6 text-muted"
                    }`}
                  >
                    Screens up
                  </button>
                </div>
              </div>
            </div>

            <div>
              {result && move && defender ? (
                <ResultPanel result={result} moveName={move.name} defenderName={defender.name} />
              ) : (
                <div className="flex h-full min-h-[10rem] items-center rounded-2xl border border-dashed border-line/70 bg-sunken/30 px-4 py-6 text-sm text-muted">
                  The KO verdict appears here once attacker, defender, and a move are set.
                </div>
              )}
              <p className="mt-2 text-[10px] leading-snug text-muted">
                Estimate only: Level 50 Champions singles math. Abilities, items, crits, and multi-hit
                quirks are not fully modeled.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SideChip({
  label,
  hint,
  mon,
  empty,
}: {
  label: string;
  hint: string;
  mon: ReturnType<typeof getPokemon>;
  empty: string;
}) {
  if (!mon) {
    return (
      <span
        className="rounded-2xl border border-dashed border-line px-3 py-2 text-xs text-muted"
        title={hint}
      >
        <span className="font-mono text-[9px] uppercase tracking-wide">{label}</span>
        <span className="mt-0.5 block">{empty}</span>
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-2 rounded-2xl border border-line bg-raised/50 py-1.5 pl-1.5 pr-3 text-xs"
      style={cssVars(mon.palette)}
      title={hint}
    >
      <span className="pl-1 font-mono text-[9px] uppercase tracking-wide text-muted">{label}</span>
      <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={28} />
      <span className="max-w-[10ch] truncate font-medium">{mon.name}</span>
    </span>
  );
}
