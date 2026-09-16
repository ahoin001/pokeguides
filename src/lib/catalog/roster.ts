import catalogJson from "@/data/catalog.json";
import regulationJson from "@/data/regulation.json";
import type { CatalogEntry, Regulation } from "@/types/pokemon";

export const regulation = regulationJson as Regulation;
export const catalog = catalogJson as CatalogEntry[];

export function legalRoster() {
  return catalog.filter((p) => p.isLegal);
}

export function requireCatalog() {
  if (!catalog.length) {
    throw new Error("Catalog is empty. Run npm run sync:catalog");
  }
  return catalog;
}
