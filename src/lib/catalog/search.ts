import MiniSearch from "minisearch";
import type { CatalogEntry, RoleId, TypeId } from "@/types/pokemon";

/** One MiniSearch index per roster array reference (avoids stale singleton misses). */
const indexes = new WeakMap<object, MiniSearch<CatalogEntry>>();

function getIndex(list: CatalogEntry[]) {
  const key = list as object;
  const cached = indexes.get(key);
  if (cached) return cached;

  const index = new MiniSearch<CatalogEntry>({
    idField: "slug",
    fields: ["name", "tokens", "slug"],
    storeFields: ["slug"],
    searchOptions: { prefix: true, fuzzy: 0.15, boost: { name: 3, slug: 2, tokens: 1 } },
  });
  index.addAll(list);
  indexes.set(key, index);
  return index;
}

function substringHits(list: CatalogEntry[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const exact: CatalogEntry[] = [];
  const prefix: CatalogEntry[] = [];
  const soft: CatalogEntry[] = [];
  for (const p of list) {
    const name = p.name.toLowerCase();
    const slug = p.slug.toLowerCase();
    if (name === q || slug === q) {
      exact.push(p);
      continue;
    }
    if (name.startsWith(q) || slug.startsWith(q)) {
      prefix.push(p);
      continue;
    }
    if (
      name.includes(q) ||
      slug.includes(q) ||
      p.tokens.toLowerCase().includes(q) ||
      p.abilities.some((a) => a.toLowerCase().includes(q))
    ) {
      soft.push(p);
    }
  }
  return [...exact, ...prefix, ...soft];
}

export function searchCatalog(
  list: CatalogEntry[],
  query: string,
  filters: {
    type?: TypeId | "";
    role?: RoleId | "";
    mega?: boolean;
    featured?: boolean;
  } = {},
) {
  const q = query.trim();
  let rows: CatalogEntry[];

  if (!q) {
    rows = [...list];
  } else {
    const fromIndex = getIndex(list)
      .search(q)
      .map((hit) => list.find((p) => p.slug === hit.slug))
      .filter((p): p is CatalogEntry => Boolean(p));

    // Substring pass catches anything MiniSearch ranks out or misses (new legal faces, odd tokens).
    const fromSub = substringHits(list, q);
    const seen = new Set<string>();
    rows = [];
    for (const p of [...fromSub, ...fromIndex]) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      rows.push(p);
    }
  }

  if (filters.type) {
    rows = rows.filter((p) => p.types.includes(filters.type as TypeId));
  }
  if (filters.role) {
    rows = rows.filter((p) => p.role === filters.role);
  }
  if (filters.mega) {
    rows = rows.filter((p) => p.form === "mega" || p.form === "mega-z");
  }
  if (filters.featured) {
    rows = rows.filter((p) => p.featured);
  }
  return rows;
}

export type SortKey = "dex" | "name" | "bst" | "spe" | "usage";

export function sortCatalog(list: CatalogEntry[], key: SortKey) {
  const copy = [...list];
  copy.sort((a, b) => {
    if (key === "name") return a.name.localeCompare(b.name);
    if (key === "bst") return b.stats.bst - a.stats.bst;
    if (key === "spe") return b.stats.spe - a.stats.spe;
    if (key === "usage") return (a.usageRank ?? 999) - (b.usageRank ?? 999);
    return a.dexNo - b.dexNo || a.id - b.id;
  });
  return copy;
}
