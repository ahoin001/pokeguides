import rankedJson from "@/data/ranked-singles.json";
import { catalog, getPokemon } from "@/lib/catalog/load";
import { usageIndex, usageForSlug, type UsageIndexEntry } from "@/lib/ranked/usage-client";
import type { RankedRow, RankedSinglesEntry, RankedSinglesSnapshot } from "./types";

export const rankedSingles = rankedJson as RankedSinglesSnapshot;
export type { RankedRow };
export type { UsageIndexEntry };
export { usageIndex, usageForSlug };

function compactId(id: string) {
  return id.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const byShowdownId = new Map(rankedSingles.pokemon.map((p) => [p.showdownId, p]));
const byName = new Map(rankedSingles.pokemon.map((p) => [p.name.toLowerCase(), p]));
const bySlug = new Map(
  rankedSingles.pokemon.filter((p) => p.slug).map((p) => [p.slug as string, p]),
);
/** Legal catalog only — never invent forms or illegal species. */
const catalogByCompact = new Map(catalog.filter((p) => p.isLegal).map((p) => [compactId(p.slug), p.slug]));

export function getRanked(showdownId: string) {
  return byShowdownId.get(showdownId);
}

export function getRankedBySlug(slug: string) {
  return bySlug.get(slug) ?? byShowdownId.get(slug);
}

export function rankedByName(name: string) {
  return byName.get(name.toLowerCase());
}

/**
 * Resolve a ranked row to a legal catalog slug.
 * Uses explicit slug, then compact showdownId↔slug match. Returns undefined if not legal.
 */
export function legalSlugForRanked(entry: RankedSinglesEntry): string | undefined {
  if (entry.slug) {
    const hit = getPokemon(entry.slug);
    if (hit?.isLegal) return entry.slug;
  }
  const fromId = catalogByCompact.get(compactId(entry.showdownId));
  if (fromId) return fromId;
  return undefined;
}

/** Resolve a CBD teammate display name to a legal catalog slug, or undefined. */
export function legalSlugFromRankedName(name: string): string | undefined {
  const row = rankedByName(name);
  if (!row) return undefined;
  return legalSlugForRanked(row);
}

export function catalogForRanked(entry: RankedSinglesEntry) {
  const slug = legalSlugForRanked(entry);
  return slug ? getPokemon(slug) : undefined;
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
