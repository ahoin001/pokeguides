"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ArchetypeId } from "@/types/pokemon";
import { normalizeMoves } from "@/stores/team-presets";

const EMPTY: (string | null)[] = [null, null, null];
const EMPTY_BOX: (string | null)[] = [null, null, null, null, null, null];
const MAX_MOVES = 4;

type TeamState = {
  /** The three you bring. */
  slugs: (string | null)[];
  /** Optional registered six from a boxed manual. Empty when sketching a three. */
  box: (string | null)[];
  intent: ArchetypeId | null;
  /** Canonical or local manual this three was loaded from. Cleared on slot edits. */
  manualId: string | null;
  /** Damaging moves keyed by species slug (up to 4). Shared with presets / Live. */
  slotMoves: Record<string, string[]>;
  setSlot: (index: number, slug: string | null) => void;
  setIntent: (intent: ArchetypeId | null) => void;
  setSlotMoves: (slug: string, moves: string[]) => void;
  toggleSlotMove: (slug: string, move: string) => void;
  clearSlotMoves: (slug?: string) => void;
  add: (slug: string) => boolean;
  remove: (slug: string) => void;
  loadThree: (
    next: string[],
    intent?: ArchetypeId | null,
    manualId?: string | null,
    box?: string[],
    moves?: Record<string, string[]>,
  ) => void;
  clear: () => void;
};

function toThree(next: (string | null)[]) {
  const three: (string | null)[] = [null, null, null];
  const seen = new Set<string>();
  let i = 0;
  for (const slug of next) {
    if (!slug || seen.has(slug) || i >= 3) continue;
    three[i] = slug;
    seen.add(slug);
    i += 1;
  }
  return three;
}

function toSix(next: (string | null)[]) {
  const six: (string | null)[] = [null, null, null, null, null, null];
  const seen = new Set<string>();
  let i = 0;
  for (const slug of next) {
    if (!slug || seen.has(slug) || i >= 6) continue;
    six[i] = slug;
    seen.add(slug);
    i += 1;
  }
  return six;
}

function scopeMoves(slugs: (string | null)[], moves: Record<string, string[]>) {
  const keep = new Set(slugs.filter(Boolean) as string[]);
  const next: Record<string, string[]> = {};
  for (const [slug, list] of Object.entries(moves)) {
    if (!keep.has(slug)) continue;
    const cleaned = normalizeMoves(list);
    if (cleaned.length) next[slug] = cleaned;
  }
  return next;
}

export function sameThree(a: (string | null)[], b: string[]) {
  const left = toThree(a).filter(Boolean) as string[];
  const right = toThree(b).filter(Boolean) as string[];
  if (left.length !== right.length || left.length !== 3) return false;
  return left.every((slug, i) => slug === right[i]);
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      slugs: EMPTY,
      box: EMPTY_BOX,
      intent: null,
      manualId: null,
      slotMoves: {},
      setSlot: (index, slug) =>
        set((s) => {
          const next = [...s.slugs];
          next[index] = slug;
          const three = toThree(next);
          return { slugs: three, manualId: null, slotMoves: scopeMoves(three, s.slotMoves) };
        }),
      setIntent: (intent) => set({ intent }),
      setSlotMoves: (slug, moves) =>
        set((s) => ({
          slotMoves: { ...s.slotMoves, [slug]: normalizeMoves(moves).slice(0, MAX_MOVES) },
        })),
      toggleSlotMove: (slug, move) =>
        set((s) => {
          const current = s.slotMoves[slug] ?? [];
          const key = move.toLowerCase();
          const has = current.some((m) => m.toLowerCase() === key);
          const next = has
            ? current.filter((m) => m.toLowerCase() !== key)
            : normalizeMoves([...current, move]);
          return { slotMoves: { ...s.slotMoves, [slug]: next } };
        }),
      clearSlotMoves: (slug) =>
        set((s) => {
          if (!slug) return { slotMoves: {} };
          const next = { ...s.slotMoves };
          delete next[slug];
          return { slotMoves: next };
        }),
      add: (slug) => {
        const { slugs } = get();
        if (slugs.includes(slug)) return false;
        const i = slugs.findIndex((s) => !s);
        if (i === -1) return false;
        const next = [...slugs];
        next[i] = slug;
        set({ slugs: toThree(next), manualId: null });
        return true;
      },
      remove: (slug) =>
        set((s) => {
          const three = toThree(s.slugs.map((x) => (x === slug ? null : x)));
          return {
            slugs: three,
            manualId: null,
            slotMoves: scopeMoves(three, s.slotMoves),
          };
        }),
      loadThree: (next, intent, manualId, box, moves) =>
        set((s) => {
          const three = toThree(next);
          const six = box?.length ? toSix(box) : EMPTY_BOX;
          const merged = moves
            ? scopeMoves([...three, ...six], { ...s.slotMoves, ...moves })
            : scopeMoves([...three, ...six], s.slotMoves);
          return {
            slugs: three,
            box: six,
            intent: intent === undefined ? s.intent : intent,
            manualId: manualId === undefined ? null : manualId,
            slotMoves: merged,
          };
        }),
      clear: () =>
        set({ slugs: EMPTY, box: EMPTY_BOX, intent: null, manualId: null, slotMoves: {} }),
    }),
    {
      name: "ringside-team",
      version: 6,
      migrate: (persisted) => {
        const raw = persisted as
          | {
              slugs?: (string | null)[];
              box?: (string | null)[];
              intent?: ArchetypeId | null;
              manualId?: unknown;
              slotMoves?: Record<string, string[]>;
            }
          | undefined;
        const slugs = toThree(raw?.slugs ?? []);
        const box = toSix(raw?.box ?? []);
        return {
          slugs,
          box,
          intent: raw?.intent ?? null,
          manualId: typeof raw?.manualId === "string" ? raw.manualId : null,
          slotMoves: scopeMoves([...slugs, ...box], raw?.slotMoves ?? {}),
        };
      },
    },
  ),
);
