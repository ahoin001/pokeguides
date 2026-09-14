"use client";

import { create } from "zustand";

type MotionSession = {
  originSlug: string | null;
  setOrigin: (slug: string | null) => void;
};

export const useMotionSession = create<MotionSession>((set) => ({
  originSlug: null,
  setOrigin: (slug) => set({ originSlug: slug }),
}));
