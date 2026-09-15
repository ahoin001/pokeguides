import rankedJson from "@/data/ranked-singles.json";
import { getPokemon } from "@/lib/catalog/load";
import type { RankedRow, RankedSinglesEntry, RankedSinglesSnapshot } from "./types";

export const rankedSingles = rankedJson as RankedSinglesSnapshot;
export type { RankedRow };

const byShowdownId = new Map(rankedSingles.pokemon.map((p) => [p.showdownId, p]));
const byName = new Map(rankedSingles.pokemon.map((p) => [p.name.toLowerCase(), p]));

export function getRanked(showdownId: string) {
  return byShowdownId.get(showdownId);
}

export function rankedByName(name: string) {
  return byName.get(name.toLowerCase());
}

export function catalogForRanked(entry: RankedSinglesEntry) {
  if (!entry.slug) return undefined;
  return getPokemon(entry.slug);
}

export function rankedRows(): RankedRow[] {
  return rankedSingles.pokemon.map((entry) => {
    const c = catalogForRanked(entry);
    return {
      ...entry,
      artwork: c?.artwork,
      sprite: c?.sprite,
      palette: c?.palette,
    };
  });
}
