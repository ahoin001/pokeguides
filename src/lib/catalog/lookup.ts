import editorialJson from "@/data/editorial.json";
import { catalog } from "@/lib/catalog/roster";
import type { Editorial } from "@/types/pokemon";

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
