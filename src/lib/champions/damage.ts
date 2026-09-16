import type { SampleSp, Stats, TypeId } from "@/types/pokemon";
import { defenseMultiplier } from "@/lib/champions/types";
import { hpAtLevel50, statAtLevel50 } from "@/lib/champions/stats";
import { natureFactor } from "@/lib/champions/natures";
import type { LiveWeather } from "@/stores/live-match";

export type MoveCategory = "physical" | "special" | "status";

export type DamageMove = {
  name: string;
  type: TypeId;
  category: MoveCategory;
  basePower: number;
  priority?: number;
};

export type DamageSide = {
  types: readonly TypeId[];
  base: Stats;
  sp: SampleSp;
  nature?: string | null;
};

export type DamageOptions = {
  weather?: LiveWeather;
  burned?: boolean;
  /** Reflect (physical) / Light Screen (special) — ×0.5 in singles. */
  screens?: boolean;
};

export type DamageResult = {
  min: number;
  max: number;
  minPct: number;
  maxPct: number;
  defenderHp: number;
  effectiveness: number;
  stab: boolean;
  category: MoveCategory;
};

function weatherMult(moveType: TypeId, weather: LiveWeather): number {
  if (weather === "rain") {
    if (moveType === "water") return 1.5;
    if (moveType === "fire") return 0.5;
  }
  if (weather === "sun") {
    if (moveType === "fire") return 1.5;
    if (moveType === "water") return 0.5;
  }
  return 1;
}

function rollDamage(base: number, roll: number) {
  return Math.max(1, Math.floor((base * roll) / 100));
}

/**
 * Champions Singles damage estimate (Gen formula, Level 50, perfect IVs, SP).
 * Ignores abilities, items, crits, and multi-hit exact counts.
 */
export function calcDamage(
  attacker: DamageSide,
  defender: DamageSide,
  move: DamageMove,
  opts: DamageOptions = {},
): DamageResult | null {
  if (move.category === "status" || move.basePower <= 0) return null;

  const atkNature = natureFactor(attacker.nature, move.category === "physical" ? "atk" : "spa");
  const defNature = natureFactor(defender.nature, move.category === "physical" ? "def" : "spd");

  const A =
    move.category === "physical"
      ? statAtLevel50(attacker.base.atk, attacker.sp.atk, atkNature)
      : statAtLevel50(attacker.base.spa, attacker.sp.spa, atkNature);
  const D =
    move.category === "physical"
      ? statAtLevel50(defender.base.def, defender.sp.def, defNature)
      : statAtLevel50(defender.base.spd, defender.sp.spd, defNature);

  const level = 50;
  let base = Math.floor(Math.floor((Math.floor((2 * level) / 5 + 2) * move.basePower * A) / D) / 50) + 2;

  const stab = attacker.types.includes(move.type);
  if (stab) base = Math.floor(base * 1.5);

  const effectiveness = defenseMultiplier(defender.types, move.type);
  base = Math.floor(base * effectiveness);
  if (effectiveness === 0) {
    const hp = hpAtLevel50(defender.base.hp, defender.sp.hp);
    return {
      min: 0,
      max: 0,
      minPct: 0,
      maxPct: 0,
      defenderHp: hp,
      effectiveness: 0,
      stab,
      category: move.category,
    };
  }

  base = Math.floor(base * weatherMult(move.type, opts.weather ?? "none"));

  if (opts.burned && move.category === "physical") {
    base = Math.floor(base * 0.5);
  }
  if (opts.screens) {
    base = Math.floor(base * 0.5);
  }

  const min = rollDamage(base, 85);
  const max = rollDamage(base, 100);
  const defenderHp = hpAtLevel50(defender.base.hp, defender.sp.hp);

  return {
    min,
    max,
    minPct: Math.round((min / defenderHp) * 1000) / 10,
    maxPct: Math.round((max / defenderHp) * 1000) / 10,
    defenderHp,
    effectiveness,
    stab,
    category: move.category,
  };
}

/** 66 SP max-offense: 32 into attacking stat, 32 Spe, 2 HP (or remaining). */
export function maxOffenseSp(category: MoveCategory): SampleSp {
  const offense = category === "special" ? "spa" : "atk";
  const sp: SampleSp = { hp: 2, atk: 0, def: 0, spa: 0, spd: 0, spe: 32 };
  sp[offense] = 32;
  return sp;
}

export const ZERO_SP: SampleSp = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
