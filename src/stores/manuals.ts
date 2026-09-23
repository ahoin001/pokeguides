"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getCanonicalManual,
  isCanonicalManualId,
  type TeamManual,
} from "@/content/manuals";
import {
  legacyNotesToEntries,
  sanitizeEntries,
  sortNotes,
  withNotePatch,
  type FieldNote,
} from "@/lib/manuals/field-notes";

type ManualsState = {
  entries: Record<string, FieldNote[]>;
  local: TeamManual[];
  addNote: (manualId: string, note: FieldNote) => void;
  updateNote: (manualId: string, noteId: string, patch: object) => void;
  removeNote: (manualId: string, noteId: string) => void;
  /** Persist a manual on this device — including overrides of classroom (canonical) ids. */
  saveLocal: (manual: TeamManual) => void;
  removeLocal: (id: string) => void;
};

export function newLocalId() {
  return `local-${Date.now()}`;
}

export const useManualsStore = create<ManualsState>()(
  persist(
    (set) => ({
      entries: {},
      local: [],
      addNote: (manualId, note) =>
        set((s) => ({
          entries: {
            ...s.entries,
            [manualId]: sortNotes([note, ...(s.entries?.[manualId] ?? []).filter((n) => n.id !== note.id)]),
          },
        })),
      updateNote: (manualId, noteId, patch) =>
        set((s) => {
          const list = s.entries?.[manualId] ?? [];
          return {
            entries: {
              ...s.entries,
              [manualId]: sortNotes(list.map((n) => (n.id === noteId ? withNotePatch(n, patch) : n))),
            },
          };
        }),
      removeNote: (manualId, noteId) =>
        set((s) => ({
          entries: {
            ...s.entries,
            [manualId]: (s.entries?.[manualId] ?? []).filter((n) => n.id !== noteId),
          },
        })),
      saveLocal: (manual) =>
        set((s) => {
          const i = s.local.findIndex((m) => m.id === manual.id);
          const local =
            i === -1 ? [...s.local, manual] : s.local.map((m) => (m.id === manual.id ? manual : m));
          return { local };
        }),
      removeLocal: (id) =>
        set((s) => ({
          local: s.local.filter((m) => m.id !== id),
          // Keep field notes when resetting a classroom override; only wipe notes for pure local manuals.
          entries: isCanonicalManualId(id)
            ? s.entries
            : Object.fromEntries(Object.entries(s.entries).filter(([key]) => key !== id)),
        })),
    }),
    {
      name: "ringside-manuals",
      version: 2,
      partialize: (s) => ({ entries: s.entries, local: s.local }),
      merge: (persisted, current) => {
        const raw = (persisted ?? {}) as {
          notes?: unknown;
          entries?: unknown;
          local?: TeamManual[];
        };
        return {
          ...current,
          local: Array.isArray(raw.local) ? raw.local : current.local,
          entries: {
            ...legacyNotesToEntries(raw.notes),
            ...sanitizeEntries(raw.entries),
          },
        };
      },
      migrate: (persisted, version) => {
        const raw = (persisted ?? {}) as {
          notes?: unknown;
          entries?: unknown;
          local?: TeamManual[];
        };
        const local = Array.isArray(raw.local) ? raw.local : [];
        if (version >= 2) {
          return { entries: sanitizeEntries(raw.entries), local };
        }
        return { entries: legacyNotesToEntries(raw.notes), local };
      },
    },
  ),
);

export function findLocalManual(id: string, local: TeamManual[]) {
  return local.find((m) => m.id === id);
}

/** Local copy wins when present (device override of a classroom manual, or pure local). */
export function resolveManualById(id: string, local: TeamManual[]) {
  return findLocalManual(id, local) ?? getCanonicalManual(id);
}

export function isDeviceOverride(id: string, local: TeamManual[]) {
  return isCanonicalManualId(id) && local.some((m) => m.id === id);
}

/** Classroom shelf: canonical list with device overrides substituted in. */
export function withDeviceOverrides(canonical: TeamManual[], local: TeamManual[]) {
  const byId = new Map(local.map((m) => [m.id, m]));
  return canonical.map((m) => byId.get(m.id) ?? m);
}

/** Pure device manuals — excludes overrides of classroom ids. */
export function pureLocalManuals(local: TeamManual[]) {
  return local.filter((m) => !isCanonicalManualId(m.id));
}

export type ManualSource = "canonical" | "local" | "override";

export function manualSource(id: string, local: TeamManual[]): ManualSource | null {
  const hasLocal = local.some((m) => m.id === id);
  const hasCanon = isCanonicalManualId(id);
  if (hasLocal && hasCanon) return "override";
  if (hasLocal) return "local";
  if (hasCanon) return "canonical";
  return null;
}
