"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_FOES = 3;
const MAX_RECENT = 6;
const MAX_MOVES = 4;
const MAX_PRESETS = 12;

export type LiveWeather = "none" | "rain" | "sun";
export type SpPreset = "zero" | "ranked" | "max-offense";

export type BringPreset = {
  id: string;
  name: string;
  slugs: string[];
  moves: Record<string, string[]>;
  savedAt: number;
};

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
  /** Selected damaging moves per bring slug (up to 4). Used for field coverage. */
  bringMoves: Record<string, string[]>;
  bringPresets: BringPreset[];
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
  setBringMoves: (slug: string, moves: string[]) => void;
  toggleBringMove: (slug: string, move: string) => void;
  clearBringMoves: (slug?: string) => void;
  saveBringPreset: (name: string, slugs: string[], moves: Record<string, string[]>) => string | null;
  deleteBringPreset: (id: string) => void;
  renameBringPreset: (id: string, name: string) => void;
};

function uniqCap(list: string[], slug: string, max: number) {
  const next = [slug, ...list.filter((s) => s !== slug)];
  return next.slice(0, max);
}

function normalizeMoves(moves: string[]) {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const raw of moves) {
    const name = raw.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(name);
    if (next.length >= MAX_MOVES) break;
  }
  return next;
}

function newPresetId() {
  return `bring-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
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
      bringMoves: {},
      bringPresets: [],
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
      setBringMoves: (slug, moves) =>
        set((s) => ({
          bringMoves: { ...s.bringMoves, [slug]: normalizeMoves(moves) },
        })),
      toggleBringMove: (slug, move) =>
        set((s) => {
          const current = s.bringMoves[slug] ?? [];
          const key = move.toLowerCase();
          const has = current.some((m) => m.toLowerCase() === key);
          const next = has
            ? current.filter((m) => m.toLowerCase() !== key)
            : normalizeMoves([...current, move]);
          return { bringMoves: { ...s.bringMoves, [slug]: next } };
        }),
      clearBringMoves: (slug) =>
        set((s) => {
          if (!slug) return { bringMoves: {} };
          const next = { ...s.bringMoves };
          delete next[slug];
          return { bringMoves: next };
        }),
      saveBringPreset: (name, slugs, moves) => {
        const trimmed = name.trim();
        const three = slugs.filter(Boolean).slice(0, 3);
        if (!trimmed || three.length === 0) return null;
        const scopedMoves: Record<string, string[]> = {};
        for (const slug of three) {
          const list = moves[slug];
          if (list?.length) scopedMoves[slug] = normalizeMoves(list);
        }
        const id = newPresetId();
        const preset: BringPreset = {
          id,
          name: trimmed.slice(0, 40),
          slugs: three,
          moves: scopedMoves,
          savedAt: Date.now(),
        };
        set((s) => ({
          bringPresets: [preset, ...s.bringPresets].slice(0, MAX_PRESETS),
        }));
        return id;
      },
      deleteBringPreset: (id) =>
        set((s) => ({
          bringPresets: s.bringPresets.filter((p) => p.id !== id),
        })),
      renameBringPreset: (id, name) => {
        const trimmed = name.trim().slice(0, 40);
        if (!trimmed) return;
        set((s) => ({
          bringPresets: s.bringPresets.map((p) =>
            p.id === id ? { ...p, name: trimmed } : p,
          ),
        }));
      },
    }),
    {
      name: "ringside-live-match",
      version: 2,
      migrate: (persisted) => {
        const raw = persisted as Partial<LiveMatchState> | undefined;
        return {
          foes: raw?.foes ?? [],
          recent: raw?.recent ?? [],
          focusSlug: raw?.focusSlug ?? null,
          attackerSlug: raw?.attackerSlug ?? null,
          defenderSlug: raw?.defenderSlug ?? null,
          weather: raw?.weather ?? "none",
          burned: raw?.burned ?? false,
          screens: raw?.screens ?? false,
          attackerPreset: raw?.attackerPreset ?? "ranked",
          defenderPreset: raw?.defenderPreset ?? "ranked",
          bringMoves: raw?.bringMoves ?? {},
          bringPresets: raw?.bringPresets ?? [],
        };
      },
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
        bringMoves: s.bringMoves,
        bringPresets: s.bringPresets,
      }),
    },
  ),
);

export { MAX_FOES, MAX_MOVES };
