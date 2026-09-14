"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CompareState = {
  slugs: string[];
  add: (slug: string) => boolean;
  remove: (slug: string) => void;
  toggle: (slug: string) => void;
  clear: () => void;
};

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      slugs: [],
      add: (slug) => {
        const { slugs } = get();
        if (slugs.includes(slug) || slugs.length >= 3) return false;
        set({ slugs: [...slugs, slug] });
        return true;
      },
      remove: (slug) => set((s) => ({ slugs: s.slugs.filter((x) => x !== slug) })),
      toggle: (slug) => {
        const { slugs, add, remove } = get();
        if (slugs.includes(slug)) remove(slug);
        else add(slug);
      },
      clear: () => set({ slugs: [] }),
    }),
    { name: "ringside-compare" },
  ),
);
