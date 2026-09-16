import { getPokemon } from "@/lib/catalog/load";
import { rankedSingles } from "@/lib/ranked/load";
import { scoutSlot, type ScoutSide } from "@/lib/champions/vs";
import type { CatalogEntry } from "@/types/pokemon";

function stem(slug: string) {
  return slug
    .replace(/-mega(-[xy])?$/, "")
    .replace(/-disguised$/, "")
    .replace(/-(male|female)$/, "");
}

export type TeamThreat = {
  slug: string;
  name: string;
  types: CatalogEntry["types"];
  artwork: string;
  sprite: string;
  /** Teammates hit >1× by this foe's STABs. */
  weakCount: number;
  teamSize: number;
  /** Ranked usage order (0 = most used). */
  rank: number;
  weakSlugs: string[];
};

/**
 * Meta threats that pressure the bench: ranked foes whose STABs
 * super-effectively hit enough of the team.
 */
export function teamThreats(
  team: readonly CatalogEntry[],
  opts: { limit?: number; minWeak?: number } = {},
): TeamThreat[] {
  if (!team.length) return [];
  const limit = opts.limit ?? 12;
  const minWeak = opts.minWeak ?? Math.max(1, Math.ceil(team.length / 2));
  const blocked = new Set(team.map((m) => stem(m.slug)));
  const sides: ScoutSide[] = team.map((m) => ({ slug: m.slug, types: m.types }));
  const out: TeamThreat[] = [];

  rankedSingles.pokemon.forEach((row, rank) => {
    if (!row.slug || blocked.has(stem(row.slug))) return;
    const foe = getPokemon(row.slug);
    if (!foe) return;
    const weakSlugs: string[] = [];
    for (const side of sides) {
      const slot = scoutSlot(side, foe.types);
      if (slot.worstTaken > 1) weakSlugs.push(side.slug);
    }
    if (weakSlugs.length < minWeak) return;
    out.push({
      slug: foe.slug,
      name: foe.name,
      types: foe.types,
      artwork: foe.artwork,
      sprite: foe.sprite,
      weakCount: weakSlugs.length,
      teamSize: team.length,
      rank,
      weakSlugs,
    });
  });

  out.sort((a, b) => b.weakCount - a.weakCount || a.rank - b.rank);
  return out.slice(0, limit);
}
