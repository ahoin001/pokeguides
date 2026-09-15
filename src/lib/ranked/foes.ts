import { getPokemon } from "@/lib/catalog/load";
import { rankedSingles } from "@/lib/ranked/load";

function stem(slug: string) {
  return slug
    .replace(/-mega(-[xy])?$/, "")
    .replace(/-disguised$/, "")
    .replace(/-(male|female)$/, "");
}

/** Top ranked names this three will actually see — not partners, foes. */
export function rankedFoesFor(teamSlugs: string[], n = 3): string[] {
  const blocked = new Set(teamSlugs.filter(Boolean).map(stem));
  const out: string[] = [];
  for (const row of rankedSingles.pokemon) {
    if (!row.slug || blocked.has(stem(row.slug))) continue;
    if (!getPokemon(row.slug)) continue;
    out.push(row.slug);
    if (out.length >= n) break;
  }
  return out;
}
