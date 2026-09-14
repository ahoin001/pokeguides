import MiniSearch from "minisearch";
import type { CatalogEntry, RoleId, TypeId } from "@/types/pokemon";

let index: MiniSearch<CatalogEntry> | null = null;

function getIndex(list: CatalogEntry[]) {
  if (index) return index;
  index = new MiniSearch({
    fields: ["name", "tokens", "slug"],
    storeFields: ["slug"],
    searchOptions: { prefix: true, fuzzy: 0.15 },
  });
  index.addAll(list);
  return index;
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
  let rows = q
    ? getIndex(list)
        .search(q)
        .map((hit) => list.find((p) => p.slug === hit.slug))
        .filter((p): p is CatalogEntry => Boolean(p))
    : [...list];

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
