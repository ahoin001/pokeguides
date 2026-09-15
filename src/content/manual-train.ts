import type { SampleSp } from "@/types/pokemon";

export type TrainAlt = {
  name: string;
  sp: SampleSp;
  why: string;
  spend?: string[];
};

export type TrainSpread = {
  sp: SampleSp;
  why: string;
  label?: string;
  spend?: string[];
  alts?: TrainAlt[];
};

export function train(
  hp: number,
  atk: number,
  def: number,
  spa: number,
  spd: number,
  spe: number,
  copy: { label: string; why: string; spend: string[] },
  alts?: TrainAlt[],
): TrainSpread {
  return { sp: { hp, atk, def, spa, spd, spe }, ...copy, alts };
}

export function alt(
  name: string,
  hp: number,
  atk: number,
  def: number,
  spa: number,
  spd: number,
  spe: number,
  why: string,
  spend?: string[],
): TrainAlt {
  return { name, sp: { hp, atk, def, spa, spd, spe }, why, spend };
}
