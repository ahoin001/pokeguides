import { getPokemon } from "@/lib/catalog/load";
import { ARCHETYPE_LABEL } from "@/content/archetypes";
import {
  MANUAL_FAMILY_LABEL,
  manualFamily,
  type ManualFamilyId,
  type TeamManual,
} from "@/content/manuals";
import type { ArchetypeId } from "@/types/pokemon";

export const MANUAL_SORTS = ["shelf", "title", "archetype"] as const;
export type ManualSort = (typeof MANUAL_SORTS)[number];

export function matchesManualQuery(manual: TeamManual, q: string) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = manualHaystack(manual);
  return words.every((word) => hay.includes(word));
}

function monTerms(slug: string) {
  if (!slug) return [];
  const pokemon = getPokemon(slug);
  if (!pokemon) return [slug];
  return [pokemon.slug, pokemon.name, pokemon.tokens];
}

function manualHaystack(manual: TeamManual) {
  const core = manual.slugs.flatMap(monTerms);
  const box = (manual.box ?? []).flatMap(monTerms);
  const lineupMons = (manual.lineups ?? []).flatMap((l) => l.slugs.flatMap(monTerms));
  const lineupCopy = (manual.lineups ?? []).flatMap((l) => [l.label, l.when, l.identity]);
  return [
    manual.title,
    manual.lede,
    manual.id,
    ARCHETYPE_LABEL[manual.archetype],
    MANUAL_FAMILY_LABEL[manualFamily(manual)],
    ...(manual.press ?? []),
    ...core,
    ...box,
    ...lineupMons,
    ...lineupCopy,
  ]
    .join(" ")
    .toLowerCase();
}

export function filterManuals(
  list: TeamManual[],
  opts: { q?: string; family?: ManualFamilyId | ""; archetype?: ArchetypeId | "" },
) {
  return list.filter((manual) => {
    if (opts.family && manualFamily(manual) !== opts.family) return false;
    if (opts.archetype && manual.archetype !== opts.archetype) return false;
    return matchesManualQuery(manual, opts.q ?? "");
  });
}

export function sortManuals(list: TeamManual[], sort: ManualSort) {
  const copy = [...list];
  if (sort === "title") {
    copy.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "archetype") {
    copy.sort(
      (a, b) =>
        ARCHETYPE_LABEL[a.archetype].localeCompare(ARCHETYPE_LABEL[b.archetype]) ||
        a.title.localeCompare(b.title),
    );
  }
  return copy;
}
