"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_FOES = 3;
const MAX_RECENT = 6;

export type LiveWeather = "none" | "rain" | "sun";
export type SpPreset = "zero" | "ranked" | "max-offense";

type LiveMatchState = {
  foes: string[];
  recent: string[];
  focusSlug: string | null;
  attackerSlug: string | null;
  defenderSlug: string | null;
  weather: LiveWeather;
  burned: boolean;
  screens: boolean;
  attackerPreset: SpPreset;
  defenderPreset: SpPreset;
  addFoe: (slug: string) => void;
  removeFoe: (slug: string) => void;
  clearFoes: () => void;
  setFocus: (slug: string | null) => void;
  setAttacker: (slug: string | null) => void;
  setDefender: (slug: string | null) => void;
  setWeather: (w: LiveWeather) => void;
  setBurned: (v: boolean) => void;
  setScreens: (v: boolean) => void;
  setAttackerPreset: (p: SpPreset) => void;
  setDefenderPreset: (p: SpPreset) => void;
  swapCalcSides: () => void;
};

function uniqCap(list: string[], slug: string, max: number) {
  const next = [slug, ...list.filter((s) => s !== slug)];
  return next.slice(0, max);
}

export const useLiveMatchStore = create<LiveMatchState>()(
  persist(
    (set, get) => ({
      foes: [],
      recent: [],
      focusSlug: null,
      attackerSlug: null,
      defenderSlug: null,
      weather: "none",
      burned: false,
      screens: false,
      attackerPreset: "ranked",
      defenderPreset: "ranked",
      addFoe: (slug) => {
        const { foes, recent } = get();
        if (foes.includes(slug)) {
          set({ focusSlug: slug, recent: uniqCap(recent, slug, MAX_RECENT) });
          return;
        }
        const next =
          foes.length >= MAX_FOES ? [...foes.slice(1), slug] : [...foes, slug];
        set({
          foes: next,
          focusSlug: slug,
          recent: uniqCap(recent, slug, MAX_RECENT),
        });
      },
      removeFoe: (slug) =>
        set((s) => ({
          foes: s.foes.filter((f) => f !== slug),
          focusSlug: s.focusSlug === slug ? s.foes.find((f) => f !== slug) ?? null : s.focusSlug,
          attackerSlug: s.attackerSlug === slug ? null : s.attackerSlug,
          defenderSlug: s.defenderSlug === slug ? null : s.defenderSlug,
        })),
      clearFoes: () => set({ foes: [], focusSlug: null }),
      setFocus: (slug) => set({ focusSlug: slug }),
      setAttacker: (slug) => set({ attackerSlug: slug }),
      setDefender: (slug) => set({ defenderSlug: slug }),
      setWeather: (weather) => set({ weather }),
      setBurned: (burned) => set({ burned }),
      setScreens: (screens) => set({ screens }),
      setAttackerPreset: (attackerPreset) => set({ attackerPreset }),
      setDefenderPreset: (defenderPreset) => set({ defenderPreset }),
      swapCalcSides: () =>
        set((s) => ({
          attackerSlug: s.defenderSlug,
          defenderSlug: s.attackerSlug,
        })),
    }),
    {
      name: "ringside-live-match",
      version: 1,
      partialize: (s) => ({
        foes: s.foes,
        recent: s.recent,
        focusSlug: s.focusSlug,
        attackerSlug: s.attackerSlug,
        defenderSlug: s.defenderSlug,
        weather: s.weather,
        burned: s.burned,
        screens: s.screens,
        attackerPreset: s.attackerPreset,
        defenderPreset: s.defenderPreset,
      }),
    },
  ),
);

export { MAX_FOES };
