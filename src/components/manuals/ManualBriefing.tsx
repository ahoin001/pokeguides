"use client";

import { getPokemon } from "@/lib/catalog/load";
import { VsScout } from "@/components/scout/VsScout";
import type { TeamManual } from "@/content/manuals";
import type { ScoutSide } from "@/lib/champions/vs";
import { rankedFoesFor } from "@/lib/ranked/foes";

/** Scout only — kits live in ManualSpotlight under the active package. */
export function ManualBriefing({ manual }: { manual: TeamManual }) {
  const scoutSide: ScoutSide[] = [];
  for (const slot of manual.slots) {
    const p = slot.slug ? getPokemon(slot.slug) : undefined;
    if (!p) continue;
    scoutSide.push({
      slug: p.slug,
      types: p.types,
      moves: slot.moves.map((m) => m.name),
    });
  }

  if (!scoutSide.length) return null;

  return (
    <VsScout
      id="scout"
      side={scoutSide}
      ourMons={scoutSide
        .map((s) => getPokemon(s.slug))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))}
      lede="Search who they previewed — typing and kit before you lead."
      suggestedFoes={rankedFoesFor([...manual.slugs])}
    />
  );
}
