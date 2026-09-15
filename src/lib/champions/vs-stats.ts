import type { CatalogEntry, Stats } from "@/types/pokemon";
import { statsWithSp } from "@/lib/champions/stats";

const ZERO_SP = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 } as const;

export type SpeBand = {
  at0: number;
  at32: number;
};

/** Nature-neutral Level 50 stats at 0 SP. */
export function level50At0(base: Stats): Stats {
  return statsWithSp(base, ZERO_SP, 1);
}

export function speBand(entry: Pick<CatalogEntry, "speedAt0" | "speedAt32">): SpeBand {
  return { at0: entry.speedAt0, at32: entry.speedAt32 };
}

/**
 * Band race (nature-neutral):
 * - always: our floor beats their ceiling
 * - can: our ceiling beats their floor (investment races)
 * - tie-band: bands overlap with neither floor beating the other ceiling cleanly as always/outsped
 * - outsped: their floor beats our ceiling
 */
export type SpeRaceKind = "always" | "can" | "tie-band" | "outsped";

export type SpeRace = {
  kind: SpeRaceKind;
  ours: SpeBand;
  theirs: SpeBand;
};

export function speRace(ours: SpeBand, theirs: SpeBand): SpeRace {
  if (ours.at0 > theirs.at32) return { kind: "always", ours, theirs };
  if (theirs.at0 > ours.at32) return { kind: "outsped", ours, theirs };
  if (ours.at0 === theirs.at0 && ours.at32 === theirs.at32) {
    return { kind: "tie-band", ours, theirs };
  }
  return { kind: "can", ours, theirs };
}

export function formatSpeRace(kind: SpeRaceKind): string {
  switch (kind) {
    case "always":
      return "You always outspeed";
    case "can":
      return "Invest to race";
    case "tie-band":
      return "Speed bands tie";
    case "outsped":
      return "They always outspeed";
  }
}

/** Short glyph label for matrix cells. */
export function speRaceGlyph(kind: SpeRaceKind): string {
  switch (kind) {
    case "always":
      return "Spe+";
    case "can":
      return "Spe~";
    case "tie-band":
      return "Spe=";
    case "outsped":
      return "Spe−";
  }
}
