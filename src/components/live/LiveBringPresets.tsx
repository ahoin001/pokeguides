"use client";

import { useMemo } from "react";
import { useLiveMatchStore } from "@/stores/live-match";
import { TeamPresetsBar } from "@/components/team/TeamPresetsBar";
import type { TeamPreset } from "@/stores/team-presets";

/** Save / load shared team presets from Live Match. */
export function LiveBringPresets() {
  const bring = useLiveMatchStore((s) => s.bring);
  const bringMoves = useLiveMatchStore((s) => s.bringMoves);
  const loadBring = useLiveMatchStore((s) => s.loadBring);
  const setBringMoves = useLiveMatchStore((s) => s.setBringMoves);
  const clearBringMoves = useLiveMatchStore((s) => s.clearBringMoves);
  const selectBring = useLiveMatchStore((s) => s.selectBring);

  const party = useMemo(() => bring.filter(Boolean), [bring]);

  function apply(preset: TeamPreset) {
    loadBring(preset.slugs);
    clearBringMoves();
    for (const slug of preset.slugs) {
      const moves = preset.moves[slug];
      if (moves?.length) setBringMoves(slug, moves);
    }
    if (preset.slugs[0]) selectBring(preset.slugs[0]);
  }

  return (
    <TeamPresetsBar
      party={party}
      moves={bringMoves}
      onApply={apply}
      hint="Save a Live/Team preset, or pin manuals from their detail pages."
    />
  );
}
