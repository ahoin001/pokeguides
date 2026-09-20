import rankedJson from "@/data/ranked-singles.json";
import { megaBaseSlug } from "@/lib/catalog/megas";
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

/**
 * Keys to try when ranked data is stored under a base/default forme
 * (CBD has Salamence, not Salamence-Mega; Mimikyu not Mimikyu-Disguised, etc.).
 */
function rankedLookupKeys(slug: string): string[] {
  const keys: string[] = [];
  const seen = new Set<string>();
  const add = (raw: string) => {
    const s = raw.trim();
    if (!s || seen.has(s)) return;
    seen.add(s);
    keys.push(s);
    const c = compactId(s);
    if (c && !seen.has(c)) {
      seen.add(c);
      keys.push(c);
    }
  };

  add(slug);
  add(megaBaseSlug(slug));

  let cur = megaBaseSlug(slug);
  const suffixes = [
    /-disguised$/,
    /-busted$/,
    /-shield$/,
    /-blade$/,
    /-amped$/,
    /-low-key$/,
    /-zero$/,
    /-hero$/,
    /-male$/,
    /-female$/,
    /-dusk$/,
    /-midday$/,
    /-midnight$/,
    /-hisui$/,
    /-galar$/,
    /-alola$/,
    /-curly$/,
    /-droopy$/,
    /-stretchy$/,
    /-two-segment$/,
    /-three-segment$/,
    /-family-of-four$/,
    /-family-of-three$/,
    /-green-plumage$/,
    /-blue-plumage$/,
    /-yellow-plumage$/,
    /-white-plumage$/,
    /-paldea-combat-breed$/,
    /-paldea-blaze-breed$/,
    /-paldea-aqua-breed$/,
    /-eternal$/,
    /-full-belly$/,
    /-hangry$/,
  ] as const;

  for (const re of suffixes) {
    const next = cur.replace(re, "");
    if (next !== cur) {
      cur = next;
      add(cur);
    }
  }

  return keys;
}

const byShowdownId = new Map(rankedSingles.pokemon.map((p) => [p.showdownId, p]));
const byCompactId = new Map(rankedSingles.pokemon.map((p) => [compactId(p.showdownId), p]));
const byName = new Map(rankedSingles.pokemon.map((p) => [p.name.toLowerCase(), p]));

/** Legal catalog only — never invent forms or illegal species. */
const catalogByCompact = new Map(
  catalog.filter((p) => p.isLegal).map((p) => [compactId(p.slug), p.slug]),
);

/** Explicit slug + compact showdownId resolution for every ranked row. */
const bySlug = new Map<string, RankedSinglesEntry>();
for (const entry of rankedSingles.pokemon) {
  if (entry.slug) bySlug.set(entry.slug, entry);
  const resolved = entry.slug ?? catalogByCompact.get(compactId(entry.showdownId));
  if (resolved) bySlug.set(resolved, entry);
  bySlug.set(entry.showdownId, entry);
  bySlug.set(compactId(entry.showdownId), entry);
}

export function getRanked(showdownId: string) {
  return byShowdownId.get(showdownId) ?? byCompactId.get(compactId(showdownId));
}

/**
 * Ladder row for a catalog slug. Falls back to base / default forme when CBD
 * only publishes one row for the species (megas, Mimikyu Disguised, etc.).
 */
export function getRankedBySlug(slug: string) {
  for (const key of rankedLookupKeys(slug)) {
    const hit = bySlug.get(key) ?? byShowdownId.get(key) ?? byCompactId.get(compactId(key));
    if (hit) return hit;
  }
  return undefined;
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
