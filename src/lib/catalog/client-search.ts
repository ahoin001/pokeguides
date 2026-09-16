import type { CatalogEntry, RoleId, TypeId } from "@/types/pokemon";
import { searchCatalog } from "@/lib/catalog/search";

let roster: CatalogEntry[] | null = null;
let bySlug: Map<string, CatalogEntry> | null = null;
let pending: Promise<CatalogEntry[]> | null = null;

export function ensureSearchRoster() {
  if (roster) return Promise.resolve(roster);
  if (!pending) {
    pending = import("@/lib/catalog/roster").then((mod) => {
      roster = mod.legalRoster();
      bySlug = new Map(roster.map((p) => [p.slug, p]));
      return roster;
    });
  }
  return pending;
}

export function searchLegal(
  query: string,
  filters: {
    type?: TypeId | "";
    role?: RoleId | "";
    mega?: boolean;
    featured?: boolean;
  } = {},
) {
  if (!roster) return [];
  return searchCatalog(roster, query, filters);
}

export function pokemonFromSearch(slug: string) {
  return bySlug?.get(slug);
}
