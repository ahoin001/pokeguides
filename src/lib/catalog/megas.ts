import { catalog } from "@/lib/catalog/roster";
import { getPokemon } from "@/lib/catalog/lookup";
import type { CatalogEntry, PokemonForm } from "@/types/pokemon";

/** Strip mega suffixes so garchomp / garchomp-mega / garchomp-mega-z share a key. */
export function megaBaseSlug(slug: string) {
  return slug.replace(/-mega(?:-[xyz])?$/, "");
}

export function isMegaForm(form: PokemonForm) {
  return form === "mega" || form === "mega-z";
}

/** Base + legal megas that evolve from the same species key. */
export function megaFamily(slug: string): CatalogEntry[] {
  const key = megaBaseSlug(slug);
  if (!getPokemon(slug)) return [];
  return catalog.filter(
    (p) =>
      p.isLegal &&
      megaBaseSlug(p.slug) === key &&
      (p.slug === key || isMegaForm(p.form)),
  );
}

/** Other forms in the family to swap to (chips under a bring slot). */
export function megaAltChips(slug: string): CatalogEntry[] {
  return megaFamily(slug).filter((p) => p.slug !== slug);
}

/** Short chip label: Mega / Mega X / Mega Y / Mega Z / Base. */
export function megaChipLabel(entry: CatalogEntry) {
  if (!isMegaForm(entry.form)) return "Base";
  if (entry.slug.endsWith("-mega-z")) return "Mega Z";
  if (entry.slug.endsWith("-mega-x")) return "Mega X";
  if (entry.slug.endsWith("-mega-y")) return "Mega Y";
  return "Mega";
}
