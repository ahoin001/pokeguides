"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ArchetypeId } from "@/types/pokemon";

const EMPTY: (string | null)[] = [null, null, null];

type TeamState = {
  slugs: (string | null)[];
  intent: ArchetypeId | null;
  /** Canonical or local manual this three was loaded from. Cleared on slot edits. */
  manualId: string | null;
  setSlot: (index: number, slug: string | null) => void;
  setIntent: (intent: ArchetypeId | null) => void;
  add: (slug: string) => boolean;
  remove: (slug: string) => void;
  loadSix: (next: string[], intent?: ArchetypeId | null, manualId?: string | null) => void;
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
      intent: null,
      manualId: null,
      setSlot: (index, slug) =>
        set((s) => {
          const next = [...s.slugs];
          next[index] = slug;
          return { slugs: toThree(next), manualId: null };
        }),
      setIntent: (intent) => set({ intent }),
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
        set((s) => ({ slugs: toThree(s.slugs.map((x) => (x === slug ? null : x))), manualId: null })),
      loadSix: (next, intent, manualId) =>
        set((s) => ({
          slugs: toThree(next),
          intent: intent === undefined ? s.intent : intent,
          manualId: manualId === undefined ? null : manualId,
        })),
      clear: () => set({ slugs: EMPTY, intent: null, manualId: null }),
    }),
    {
      name: "ringside-team",
      version: 4,
      migrate: (persisted) => {
        const raw = persisted as
          | { slugs?: (string | null)[]; intent?: ArchetypeId | null; manualId?: unknown }
          | undefined;
        return {
          slugs: toThree(raw?.slugs ?? []),
          intent: raw?.intent ?? null,
          manualId: typeof raw?.manualId === "string" ? raw.manualId : null,
        };
      },
    },
  ),
);
