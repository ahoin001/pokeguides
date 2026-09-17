"use client";

import { ARCHETYPE_LABEL, tellsForSlug } from "@/content/archetypes";
import type { ArchetypeId } from "@/types/pokemon";

/** Soft read from logged foes — never claims certainty. */
export function LiveArchetypeHint({ foeSlugs }: { foeSlugs: string[] }) {
  if (foeSlugs.length < 2) return null;

  const scores = new Map<ArchetypeId, number>();
  for (const slug of foeSlugs) {
    for (const hit of tellsForSlug(slug)) {
      scores.set(hit.style.id, (scores.get(hit.style.id) ?? 0) + 1);
    }
  }
  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const top = ranked[0];
  if (!top || top[1] < 2) return null;
  const second = ranked[1];
  if (second && second[1] === top[1]) return null;

  return (
    <p className="rounded-2xl border border-line/50 bg-raised/30 px-4 py-3 text-sm text-muted">
      Soft read: often looks like{" "}
      <span className="font-medium text-ink/90">{ARCHETYPE_LABEL[top[0]]}</span>
      {" "}from the names logged — many Pokémon wear more than one hat.
    </p>
  );
}
