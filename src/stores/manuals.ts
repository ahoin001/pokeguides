"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TeamManual } from "@/content/manuals";
import { isCanonicalManualId } from "@/content/manuals";

type ManualsState = {
  notes: Record<string, string>;
  local: TeamManual[];
  setNote: (id: string, body: string) => void;
  saveLocal: (manual: TeamManual) => void;
  removeLocal: (id: string) => void;
};

export function newLocalId() {
  return `local-${Date.now()}`;
}

export const useManualsStore = create<ManualsState>()(
  persist(
    (set) => ({
      notes: {},
      local: [],
      setNote: (id, body) =>
        set((s) => ({
          notes: { ...s.notes, [id]: body },
        })),
      saveLocal: (manual) =>
        set((s) => {
          if (isCanonicalManualId(manual.id)) return s;
          const i = s.local.findIndex((m) => m.id === manual.id);
          const local = i === -1 ? [...s.local, manual] : s.local.map((m) => (m.id === manual.id ? manual : m));
          return { local };
        }),
      removeLocal: (id) =>
        set((s) => ({
          local: s.local.filter((m) => m.id !== id),
          notes: Object.fromEntries(Object.entries(s.notes).filter(([key]) => key !== id)),
        })),
    }),
    { name: "ringside-manuals", version: 1 },
  ),
);

export function findLocalManual(id: string, local: TeamManual[]) {
  return local.find((m) => m.id === id);
}
