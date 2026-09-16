/** Nature → Atk / Def / SpA / SpD / Spe multipliers (HP never changed). */
export type NatureMods = {
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
};

const NEUTRAL: NatureMods = { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 };

const NATURES: Record<string, NatureMods> = {
  hardy: NEUTRAL,
  docile: NEUTRAL,
  serious: NEUTRAL,
  bashful: NEUTRAL,
  quirky: NEUTRAL,
  lonely: { atk: 1.1, def: 0.9, spa: 1, spd: 1, spe: 1 },
  adamant: { atk: 1.1, def: 1, spa: 0.9, spd: 1, spe: 1 },
  naughty: { atk: 1.1, def: 1, spa: 1, spd: 0.9, spe: 1 },
  brave: { atk: 1.1, def: 1, spa: 1, spd: 1, spe: 0.9 },
  bold: { atk: 0.9, def: 1.1, spa: 1, spd: 1, spe: 1 },
  impish: { atk: 1, def: 1.1, spa: 0.9, spd: 1, spe: 1 },
  lax: { atk: 1, def: 1.1, spa: 1, spd: 0.9, spe: 1 },
  relaxed: { atk: 1, def: 1.1, spa: 1, spd: 1, spe: 0.9 },
  modest: { atk: 0.9, def: 1, spa: 1.1, spd: 1, spe: 1 },
  mild: { atk: 1, def: 0.9, spa: 1.1, spd: 1, spe: 1 },
  rash: { atk: 1, def: 1, spa: 1.1, spd: 0.9, spe: 1 },
  quiet: { atk: 1, def: 1, spa: 1.1, spd: 1, spe: 0.9 },
  calm: { atk: 0.9, def: 1, spa: 1, spd: 1.1, spe: 1 },
  gentle: { atk: 1, def: 0.9, spa: 1, spd: 1.1, spe: 1 },
  careful: { atk: 1, def: 1, spa: 0.9, spd: 1.1, spe: 1 },
  sassy: { atk: 1, def: 1, spa: 1, spd: 1.1, spe: 0.9 },
  timid: { atk: 0.9, def: 1, spa: 1, spd: 1, spe: 1.1 },
  hasty: { atk: 1, def: 0.9, spa: 1, spd: 1, spe: 1.1 },
  jolly: { atk: 1, def: 1, spa: 0.9, spd: 1, spe: 1.1 },
  naive: { atk: 1, def: 1, spa: 1, spd: 0.9, spe: 1.1 },
};

export function natureMods(name?: string | null): NatureMods {
  if (!name) return NEUTRAL;
  return NATURES[name.toLowerCase()] ?? NEUTRAL;
}

/** Per-stat nature factor for Level 50 calc (HP always 1). */
export function natureFactor(name: string | null | undefined, stat: keyof NatureMods | "hp"): number {
  if (stat === "hp") return 1;
  return natureMods(name)[stat];
}
