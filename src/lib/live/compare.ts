import type { CatalogEntry, SampleSp, Stats } from "@/types/pokemon";
import { getRankedBySlug } from "@/lib/ranked/load";
import { hpAtLevel50, speedAt, statAtLevel50 } from "@/lib/champions/stats";
import { natureFactor } from "@/lib/champions/natures";
import { speBand, speRace, type SpeRaceKind } from "@/lib/champions/vs-stats";

const ZERO_SP: SampleSp = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

export type LiveStatKey = "hp" | "atk" | "def" | "spa" | "spd" | "spe";

/** Body stats only — Spe lives in LiveSpeHero. */
export const LIVE_STAT_KEYS: LiveStatKey[] = ["hp", "atk", "def", "spa", "spd"];

export const LIVE_STAT_LABEL: Record<LiveStatKey, string> = {
  hp: "HP",
  atk: "Atk",
  def: "Def",
  spa: "SpA",
  spd: "SpD",
  spe: "Spe",
};

/** Nature-neutral and Spe-boosted Spe floors for race assessment. */
export type LiveSpeScenarios = {
  /** 0 Spe SP, neutral nature */
  base: number;
  /** 32 Spe SP, neutral nature */
  invest: number;
  /** 32 Spe SP + Spe-up nature (+10%) */
  max: number;
};

/** Choice Scarf multiplies Spe by 1.5 after SP + nature (floored). */
export function applyChoiceScarf(spe: number) {
  return Math.floor(spe * 1.5);
}

export function liveSpeScenarios(mon: CatalogEntry): LiveSpeScenarios {
  const baseSpe = mon.stats.spe;
  return {
    base: speedAt(baseSpe, 0, 1),
    invest: speedAt(baseSpe, 32, 1),
    max: speedAt(baseSpe, 32, 1.1),
  };
}

/** Same invest rows with Choice Scarf on that side. */
export function liveSpeScenariosScarfed(mon: CatalogEntry): LiveSpeScenarios {
  const bare = liveSpeScenarios(mon);
  return {
    base: applyChoiceScarf(bare.base),
    invest: applyChoiceScarf(bare.invest),
    max: applyChoiceScarf(bare.max),
  };
}

export type SpeScenarioKey = keyof LiveSpeScenarios;

export const SPE_SCENARIO_META: Record<
  SpeScenarioKey,
  { label: string; hint: string }
> = {
  base: { label: "Base Spe", hint: "0 Spe SP · neutral nature" },
  invest: { label: "+32 Spe", hint: "Max Spe SP · still neutral nature" },
  max: { label: "+32 + nature", hint: "Max Spe SP · Timid / Jolly / Hasty / Naive (+10%)" },
};

export const SPE_SCENARIO_ORDER: SpeScenarioKey[] = ["base", "invest", "max"];

/** Level-50 stats using ranked leading SP + nature when available. */
export function liveStatsForSlug(slug: string, mon: CatalogEntry): {
  stats: Stats;
  sp: SampleSp;
  nature?: string;
  fromRanked: boolean;
} {
  const ranked = getRankedBySlug(slug);
  const nature = ranked?.nature?.name;
  const sp: SampleSp = ranked?.spread
    ? {
        hp: ranked.spread.hp,
        atk: ranked.spread.atk,
        def: ranked.spread.def,
        spa: ranked.spread.spa,
        spd: ranked.spread.spd,
        spe: ranked.spread.spe,
      }
    : { ...ZERO_SP };

  const stats: Stats = {
    hp: hpAtLevel50(mon.stats.hp, sp.hp),
    atk: statAtLevel50(mon.stats.atk, sp.atk, natureFactor(nature, "atk")),
    def: statAtLevel50(mon.stats.def, sp.def, natureFactor(nature, "def")),
    spa: statAtLevel50(mon.stats.spa, sp.spa, natureFactor(nature, "spa")),
    spd: statAtLevel50(mon.stats.spd, sp.spd, natureFactor(nature, "spd")),
    spe: statAtLevel50(mon.stats.spe, sp.spe, natureFactor(nature, "spe")),
    bst: 0,
  };
  stats.bst = stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;

  return { stats, sp, nature, fromRanked: Boolean(ranked?.spread) };
}

export function liveSpeCallout(kind: SpeRaceKind): string {
  switch (kind) {
    case "always":
      return "You usually outspeed";
    case "can":
      return "Speed race";
    case "tie-band":
      return "Speed bands match";
    case "outsped":
      return "They usually outspeed";
  }
}

export function liveSpeRace(ours: CatalogEntry, theirs: CatalogEntry) {
  return speRace(speBand(ours), speBand(theirs));
}

export function ladderSpeLine(
  ourSlug: string,
  ourMon: CatalogEntry,
  theirSlug: string,
  theirMon: CatalogEntry,
): string | null {
  const a = liveStatsForSlug(ourSlug, ourMon);
  const b = liveStatsForSlug(theirSlug, theirMon);
  if (!a.fromRanked && !b.fromRanked) return null;
  const ourSpe = a.fromRanked
    ? a.stats.spe
    : speedAt(ourMon.stats.spe, 0);
  const theirSpe = b.fromRanked
    ? b.stats.spe
    : speedAt(theirMon.stats.spe, 0);
  return `Ladder sets: You Spe ${ourSpe} · Them Spe ${theirSpe}`;
}

/** Short why labels for common M-C partners. */
const TEAMMATE_WHY: Record<string, string> = {
  primarina: "Fairy glue",
  gholdengo: "Fairy resist",
  golisopod: "Priority",
  "golisopod-mega": "Priority Mega",
  salamence: "DD wincon",
  "salamence-mega": "Mega snowball",
  garchomp: "Ground breaker",
  "garchomp-mega": "Mega Ground",
  lucario: "Special Plot",
  "lucario-mega": "Mega Plot",
  rillaboom: "Grassy engine",
  pelipper: "Drizzle",
  charizard: "Drought Mega",
  "charizard-mega-y": "Drought Mega",
  farigiraf: "Trick Room",
  kingambit: "Dark truck",
  whimsicott: "Tailwind clock",
  "mimikyu-disguised": "Disguise",
  hippowdon: "Sand wall",
  corviknight: "Ice soak",
  "rotom-wash": "Burn pivot",
  "aegislash-shield": "Stance pivot",
  baxcalibur: "Ice breaker",
  archaludon: "Steel special",
  dragonite: "Multiscale kite",
  cinderace: "Libero punch",
  meowscarada: "Speed control",
  sneasler: "Unburden",
  "indeedee-female": "Terrain partner",
  "basculegion-male": "Rain cleaner",
};

export function teammateWhy(slug: string, name: string): string {
  return TEAMMATE_WHY[slug] ?? TEAMMATE_WHY[name.toLowerCase().replace(/\s+/g, "-")] ?? "Common partner";
}
