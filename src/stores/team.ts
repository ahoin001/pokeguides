"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ArchetypeId } from "@/types/pokemon";

const EMPTY: (string | null)[] = [null, null, null];

type TeamState = {
  slugs: (string | null)[];
  intent: ArchetypeId | null;
  setSlot: (index: number, slug: string | null) => void;
  setIntent: (intent: ArchetypeId | null) => void;
  add: (slug: string) => boolean;
  remove: (slug: string) => void;
  loadSix: (next: string[], intent?: ArchetypeId | null) => void;
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

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      slugs: EMPTY,
      intent: null,
      setSlot: (index, slug) =>
        set((s) => {
          const next = [...s.slugs];
          next[index] = slug;
          return { slugs: toThree(next) };
        }),
      setIntent: (intent) => set({ intent }),
      add: (slug) => {
        const { slugs } = get();
        if (slugs.includes(slug)) return false;
        const i = slugs.findIndex((s) => !s);
        if (i === -1) return false;
        const next = [...slugs];
        next[i] = slug;
        set({ slugs: toThree(next) });
        return true;
      },
      remove: (slug) =>
        set((s) => ({ slugs: toThree(s.slugs.map((x) => (x === slug ? null : x))) })),
      loadSix: (next, intent) =>
        set((s) => ({
          slugs: toThree(next),
          intent: intent === undefined ? s.intent : intent,
        })),
      clear: () => set({ slugs: EMPTY, intent: null }),
    }),
    {
      name: "ringside-team",
      version: 3,
      migrate: (persisted) => {
        const raw = persisted as { slugs?: (string | null)[]; intent?: ArchetypeId | null } | undefined;
        return { slugs: toThree(raw?.slugs ?? []), intent: raw?.intent ?? null };
      },
    },
  ),
);
