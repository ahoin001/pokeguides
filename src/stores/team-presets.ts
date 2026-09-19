"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_PRESETS = 12;
const MAX_BRING = 6;
const MAX_MOVES = 4;

export type TeamPreset = {
  id: string;
  name: string;
  /** 1–6 registered / Live bring. Team builder uses first 3 as the bring. */
  slugs: string[];
  moves: Record<string, string[]>;
  savedAt: number;
};

type TeamPresetsState = {
  presets: TeamPreset[];
  savePreset: (name: string, slugs: string[], moves: Record<string, string[]>) => string | null;
  deletePreset: (id: string) => void;
  renamePreset: (id: string, name: string) => void;
  /** One-shot import (e.g. migrate Live presets). Skips duplicate ids. */
  importPresets: (incoming: TeamPreset[]) => void;
};

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
  return `team-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function readLegacyLivePresets(): TeamPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("ringside-live-match");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as {
      state?: { bringPresets?: TeamPreset[] };
      bringPresets?: TeamPreset[];
    };
    const list = parsed.state?.bringPresets ?? parsed.bringPresets ?? [];
    if (!Array.isArray(list)) return [];
    return list
      .filter((p) => p && typeof p.id === "string" && Array.isArray(p.slugs))
      .map((p) => ({
        id: p.id,
        name: String(p.name ?? "Bring").slice(0, 40),
        slugs: normalizeBring(p.slugs),
        moves: Object.fromEntries(
          Object.entries(p.moves ?? {}).map(([slug, moves]) => [
            slug,
            normalizeMoves(Array.isArray(moves) ? moves : []),
          ]),
        ),
        savedAt: typeof p.savedAt === "number" ? p.savedAt : Date.now(),
      }))
      .filter((p) => p.slugs.length > 0);
  } catch {
    return [];
  }
}

export const useTeamPresetsStore = create<TeamPresetsState>()(
  persist(
    (set, get) => ({
      presets: [],
      savePreset: (name, slugs, moves) => {
        const trimmed = name.trim();
        const party = normalizeBring(slugs);
        if (!trimmed || party.length === 0) return null;
        const scopedMoves: Record<string, string[]> = {};
        for (const slug of party) {
          const list = moves[slug];
          if (list?.length) scopedMoves[slug] = normalizeMoves(list);
        }
        const id = newPresetId();
        const preset: TeamPreset = {
          id,
          name: trimmed.slice(0, 40),
          slugs: party,
          moves: scopedMoves,
          savedAt: Date.now(),
        };
        set((s) => ({
          presets: [preset, ...s.presets].slice(0, MAX_PRESETS),
        }));
        return id;
      },
      deletePreset: (id) =>
        set((s) => ({
          presets: s.presets.filter((p) => p.id !== id),
        })),
      renamePreset: (id, name) => {
        const trimmed = name.trim().slice(0, 40);
        if (!trimmed) return;
        set((s) => ({
          presets: s.presets.map((p) => (p.id === id ? { ...p, name: trimmed } : p)),
        }));
      },
      importPresets: (incoming) => {
        if (!incoming.length) return;
        const have = new Set(get().presets.map((p) => p.id));
        const add = incoming.filter((p) => p.slugs.length && !have.has(p.id));
        if (!add.length) return;
        set((s) => ({
          presets: [...add, ...s.presets]
            .sort((a, b) => b.savedAt - a.savedAt)
            .slice(0, MAX_PRESETS),
        }));
      },
    }),
    {
      name: "ringside-team-presets",
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.presets.length) return;
        const legacy = readLegacyLivePresets();
        if (legacy.length) state.importPresets(legacy);
      },
    },
  ),
);

export { MAX_PRESETS, MAX_BRING, MAX_MOVES, normalizeBring, normalizeMoves };
