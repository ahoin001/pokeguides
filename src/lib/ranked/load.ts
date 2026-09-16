import rankedJson from "@/data/ranked-singles.json";
import { getPokemon } from "@/lib/catalog/load";
import { usageIndex, usageForSlug, type UsageIndexEntry } from "@/lib/ranked/usage-client";
import type { RankedRow, RankedSinglesEntry, RankedSinglesSnapshot } from "./types";

export const rankedSingles = rankedJson as RankedSinglesSnapshot;
export type { RankedRow };
export type { UsageIndexEntry };
export { usageIndex, usageForSlug };

const byShowdownId = new Map(rankedSingles.pokemon.map((p) => [p.showdownId, p]));
const byName = new Map(rankedSingles.pokemon.map((p) => [p.name.toLowerCase(), p]));
const bySlug = new Map(
  rankedSingles.pokemon.filter((p) => p.slug).map((p) => [p.slug as string, p]),
);

export function getRanked(showdownId: string) {
  return byShowdownId.get(showdownId);
}

export function getRankedBySlug(slug: string) {
  return bySlug.get(slug);
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
