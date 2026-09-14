import catalogJson from "@/data/catalog.json";
import editorialJson from "@/data/editorial.json";
import regulationJson from "@/data/regulation.json";
import type { CatalogEntry, Editorial, Regulation } from "@/types/pokemon";

export const regulation = regulationJson as Regulation;
export const catalog = catalogJson as CatalogEntry[];
export const editorial = editorialJson as Editorial[];

const bySlug = new Map(catalog.map((p) => [p.slug, p]));
const editorialBySlug = new Map(editorial.map((e) => [e.slug, e]));

export function getPokemon(slug: string) {
  return bySlug.get(slug);
}

export function getEditorial(slug: string) {
  return editorialBySlug.get(slug);
}

export function featuredPokemon() {
  return catalog.filter((p) => p.featured);
}

export function requireCatalog() {
  if (!catalog.length) {
    throw new Error("Catalog is empty. Run npm run sync:catalog");
  }
  return catalog;
}
