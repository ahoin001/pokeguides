import {
  resolveRosterSlot,
  type TeamManual,
} from "@/content/manuals";
import {
  normalizeBring,
  normalizeMoves,
  type TeamPreset,
} from "@/stores/team-presets";

/** Snapshot a field manual’s registered six into a Live/Team-applyable preset. */
export function teamPresetFromManual(manual: TeamManual): TeamPreset | null {
  const slugs = normalizeBring(manual.box ?? []);
  if (!slugs.length) return null;
  const moves: Record<string, string[]> = {};
  for (const slug of slugs) {
    const names = resolveRosterSlot(manual, slug)
      .moves.map((m) => m.name)
      .filter(Boolean);
    const kit = normalizeMoves(names);
    if (kit.length) moves[slug] = kit;
  }
  return {
    id: `manual:${manual.id}`,
    name: manual.title.slice(0, 48),
    slugs,
    moves,
    savedAt: 0,
  };
}
