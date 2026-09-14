import type { SampleSp, Stats } from "@/types/pokemon";

const LEVEL = 50;
const IV = 31;

export function statAtLevel50(base: number, sp: number, nature = 1) {
  return Math.floor((Math.floor(((2 * base + IV) * LEVEL) / 100) + 5 + sp) * nature);
}

export function hpAtLevel50(base: number, sp: number) {
  return Math.floor(((2 * base + IV) * LEVEL) / 100) + LEVEL + 10 + sp;
}

export function speedAt(baseSpe: number, sp: number, nature = 1) {
  return statAtLevel50(baseSpe, sp, nature);
}

export function sampleSpTotal(sp: SampleSp) {
  return sp.hp + sp.atk + sp.def + sp.spa + sp.spd + sp.spe;
}

export function assertSpBudget(sp: SampleSp) {
  const total = sampleSpTotal(sp);
  const maxed = Object.values(sp).some((n) => n > 32);
  return total <= 66 && !maxed;
}

export function statsWithSp(base: Stats, sp: SampleSp, nature = 1): Stats {
  const hp = hpAtLevel50(base.hp, sp.hp);
  const atk = statAtLevel50(base.atk, sp.atk, nature);
  const def = statAtLevel50(base.def, sp.def, nature);
  const spa = statAtLevel50(base.spa, sp.spa, nature);
  const spd = statAtLevel50(base.spd, sp.spd, nature);
  const spe = statAtLevel50(base.spe, sp.spe, nature);
  return { hp, atk, def, spa, spd, spe, bst: hp + atk + def + spa + spd + spe };
}
