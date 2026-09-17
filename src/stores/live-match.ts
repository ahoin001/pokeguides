"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { liveDebug } from "@/lib/live/debug";

const MAX_FOES = 6;
const MAX_BRING = 6;
/** Shared MRU of foe + bring picks — about a meta’s worth without clutter. */
const MAX_RECENT = 10;
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
  /** Your side on the clock — up to the full registered six. */
  bring: string[];
  foes: string[];
  recent: string[];
  /** Last-tapped mon for palette wash. */
  focusSlug: string | null;
  /** Your selected bring for the duel. */
  activeBringSlug: string | null;
  /** Their selected / lead foe for the duel. */
  activeFoeSlug: string | null;
  attackerSlug: string | null;
  defenderSlug: string | null;
  weather: LiveWeather;
  burned: boolean;
  screens: boolean;
  attackerPreset: SpPreset;
  defenderPreset: SpPreset;
  /** Damage calc drawer open. */
  calcOpen: boolean;
  /** Legacy bring moves (presets may still store them). */
  bringMoves: Record<string, string[]>;
  bringPresets: BringPreset[];
  addBring: (slug: string) => void;
  removeBring: (slug: string) => void;
  setBringSlot: (index: number, slug: string | null) => void;
  loadBring: (slugs: string[]) => void;
  clearBring: () => void;
  addFoe: (slug: string) => void;
  removeFoe: (slug: string) => void;
  clearFoes: () => void;
  setFocus: (slug: string | null) => void;
  setActiveBring: (slug: string | null) => void;
  setActiveFoe: (slug: string | null) => void;
  /** Tap a bring mon: select for duel + wash. */
  selectBring: (slug: string) => void;
  /** Tap a foe: select for duel + wash. */
  selectFoe: (slug: string) => void;
  setAttacker: (slug: string | null) => void;
  setDefender: (slug: string | null) => void;
  setWeather: (w: LiveWeather) => void;
  setBurned: (v: boolean) => void;
  setScreens: (v: boolean) => void;
  setAttackerPreset: (p: SpPreset) => void;
  setDefenderPreset: (p: SpPreset) => void;
  setCalcOpen: (open: boolean) => void;
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

function normalizeBring(slugs: string[]) {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const slug of slugs) {
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    next.push(slug);
    if (next.length >= MAX_BRING) break;
  }
  return next;
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
      bring: [],
      foes: [],
      recent: [],
      focusSlug: null,
      activeBringSlug: null,
      activeFoeSlug: null,
      attackerSlug: null,
      defenderSlug: null,
      weather: "none",
      burned: false,
      screens: false,
      attackerPreset: "ranked",
      defenderPreset: "ranked",
      calcOpen: false,
      bringMoves: {},
      bringPresets: [],
      addBring: (slug) => {
        const { bring, recent } = get();
        liveDebug("[live/store] addBring", { slug, before: bring });
        if (bring.includes(slug)) {
          set({
            focusSlug: slug,
            activeBringSlug: slug,
            recent: uniqCap(recent, slug, MAX_RECENT),
          });
          return;
        }
        if (bring.length >= MAX_BRING) {
          const next = [...bring.slice(1), slug];
          set({
            bring: next,
            focusSlug: slug,
            activeBringSlug: slug,
            recent: uniqCap(recent, slug, MAX_RECENT),
          });
          return;
        }
        set({
          bring: [...bring, slug],
          focusSlug: slug,
          activeBringSlug: slug,
          recent: uniqCap(recent, slug, MAX_RECENT),
        });
      },
      removeBring: (slug) => {
        liveDebug("[live/store] removeBring", { slug });
        set((s) => {
          const bring = s.bring.filter((b) => b !== slug);
          const fallback = bring[bring.length - 1] ?? bring[0] ?? null;
          return {
            bring,
            focusSlug: s.focusSlug === slug ? fallback : s.focusSlug,
            activeBringSlug: s.activeBringSlug === slug ? fallback : s.activeBringSlug,
            attackerSlug: s.attackerSlug === slug ? null : s.attackerSlug,
            defenderSlug: s.defenderSlug === slug ? null : s.defenderSlug,
          };
        });
      },
      setBringSlot: (index, slug) => {
        if (index < 0 || index >= MAX_BRING) return;
        set((s) => {
          const padded = [...s.bring];
          while (padded.length <= index) padded.push("");
          const prev = padded[index] || null;
          if (!slug) {
            const next = padded.map((x, i) => (i === index ? "" : x)).filter(Boolean);
            return {
              bring: next,
              activeBringSlug:
                s.activeBringSlug === prev
                  ? next[next.length - 1] ?? null
                  : s.activeBringSlug,
            };
          }
          if (padded.includes(slug) && padded[index] !== slug) return s;
          padded[index] = slug;
          return {
            bring: padded.filter(Boolean),
            activeBringSlug: slug,
            focusSlug: slug,
          };
        });
      },
      loadBring: (slugs) => {
        const bring = normalizeBring(slugs);
        liveDebug("[live/store] loadBring", { bring });
        set({
          bring,
          activeBringSlug: bring[0] ?? null,
          focusSlug: bring[0] ?? get().focusSlug,
        });
      },
      clearBring: () => {
        liveDebug("[live/store] clearBring");
        set({ bring: [], activeBringSlug: null });
      },
      addFoe: (slug) => {
        const { foes, recent } = get();
        liveDebug("[live/store] addFoe", { slug, before: foes });
        if (foes.includes(slug)) {
          set({
            focusSlug: slug,
            activeFoeSlug: slug,
            recent: uniqCap(recent, slug, MAX_RECENT),
          });
          return;
        }
        const next =
          foes.length >= MAX_FOES ? [...foes.slice(1), slug] : [...foes, slug];
        set({
          foes: next,
          focusSlug: slug,
          activeFoeSlug: slug,
          recent: uniqCap(recent, slug, MAX_RECENT),
        });
      },
      removeFoe: (slug) => {
        liveDebug("[live/store] removeFoe", { slug });
        set((s) => {
          const foes = s.foes.filter((f) => f !== slug);
          const fallback = foes[foes.length - 1] ?? foes[0] ?? null;
          return {
            foes,
            focusSlug: s.focusSlug === slug ? fallback : s.focusSlug,
            activeFoeSlug: s.activeFoeSlug === slug ? fallback : s.activeFoeSlug,
            attackerSlug: s.attackerSlug === slug ? null : s.attackerSlug,
            defenderSlug: s.defenderSlug === slug ? null : s.defenderSlug,
          };
        });
      },
      clearFoes: () => {
        liveDebug("[live/store] clearFoes");
        set({ foes: [], focusSlug: null, activeFoeSlug: null });
      },
      setFocus: (slug) => set({ focusSlug: slug }),
      setActiveBring: (slug) => set({ activeBringSlug: slug }),
      setActiveFoe: (slug) => set({ activeFoeSlug: slug }),
      selectBring: (slug) => {
        liveDebug("[live/store] selectBring", { slug });
        set({ activeBringSlug: slug, focusSlug: slug });
      },
      selectFoe: (slug) => {
        liveDebug("[live/store] selectFoe", { slug });
        set({ activeFoeSlug: slug, focusSlug: slug });
      },
      setAttacker: (slug) => set({ attackerSlug: slug }),
      setDefender: (slug) => set({ defenderSlug: slug }),
      setWeather: (weather) => set({ weather }),
      setBurned: (burned) => set({ burned }),
      setScreens: (screens) => set({ screens }),
      setAttackerPreset: (attackerPreset) => set({ attackerPreset }),
      setDefenderPreset: (defenderPreset) => set({ defenderPreset }),
      setCalcOpen: (calcOpen) => set({ calcOpen }),
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
        const party = normalizeBring(slugs);
        if (!trimmed || party.length === 0) return null;
        const scopedMoves: Record<string, string[]> = {};
        for (const slug of party) {
          const list = moves[slug];
          if (list?.length) scopedMoves[slug] = normalizeMoves(list);
        }
        const id = newPresetId();
        const preset: BringPreset = {
          id,
          name: trimmed.slice(0, 40),
          slugs: party,
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
      version: 4,
      migrate: (persisted) => {
        const raw = persisted as (Partial<LiveMatchState> & { bring?: string[] }) | undefined;
        return {
          bring: normalizeBring(raw?.bring ?? []),
          foes: (raw?.foes ?? []).slice(0, MAX_FOES),
          recent: raw?.recent ?? [],
          focusSlug: raw?.focusSlug ?? null,
          activeBringSlug: raw?.activeBringSlug ?? null,
          activeFoeSlug: raw?.activeFoeSlug ?? raw?.focusSlug ?? null,
          attackerSlug: raw?.attackerSlug ?? null,
          defenderSlug: raw?.defenderSlug ?? null,
          weather: raw?.weather ?? "none",
          burned: raw?.burned ?? false,
          screens: raw?.screens ?? false,
          attackerPreset: raw?.attackerPreset ?? "ranked",
          defenderPreset: raw?.defenderPreset ?? "ranked",
          calcOpen: false,
          bringMoves: raw?.bringMoves ?? {},
          bringPresets: raw?.bringPresets ?? [],
        };
      },
      partialize: (s) => ({
        bring: s.bring,
        foes: s.foes,
        recent: s.recent,
        focusSlug: s.focusSlug,
        activeBringSlug: s.activeBringSlug,
        activeFoeSlug: s.activeFoeSlug,
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

export { MAX_FOES, MAX_BRING, MAX_MOVES, MAX_RECENT };
