import { getPokemon } from "@/lib/catalog/load";
import type { CatalogEntry } from "@/types/pokemon";
import type { TeamManual } from "@/content/manuals";

export function legalSlug(slug: string) {
  return Boolean(slug && getPokemon(slug));
}

export function hydrateManual(manual: TeamManual) {
  const mons = manual.slugs.map((slug) => (slug ? getPokemon(slug) : undefined));
  return { manual, mons: mons.filter((p): p is CatalogEntry => Boolean(p)) };
}

export function syncSlugsFromSlots(manual: TeamManual): TeamManual {
  const slugs = manual.slots.map((s) => s.slug).filter(Boolean);
  const three: [string, string, string] = [slugs[0] ?? "", slugs[1] ?? "", slugs[2] ?? ""];
  return { ...manual, slugs: three };
}

export function validateManual(manual: TeamManual) {
  const errors: string[] = [];
  if (!manual.title.trim()) errors.push("Name the three.");
  const slugs = manual.slots.map((s) => s.slug).filter(Boolean);
  if (slugs.length !== 3) errors.push("Pick three Pokémon.");
  if (new Set(slugs).size !== slugs.length) errors.push("Species clause. No duplicates.");
  for (const slug of slugs) {
    if (!legalSlug(slug)) errors.push(`${slug} is not legal in this regulation.`);
  }
  return errors;
}
