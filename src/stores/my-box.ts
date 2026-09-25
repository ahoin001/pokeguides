"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Seeded from the site owner's collection.
 * Catalog only has legal Champions forms — Hisuian / unevolved / illegal
 * names are mapped to the closest legal slug or kept in `extras`.
 */
export const OWNER_BOX_SEED: string[] = [
  "zoroark", // Hisuian Zoroark → Unovan until Hisuian is legal in catalog
  "whimsicott",
  "tinkaton",
  "sneasler",
  "samurott", // Hisuian Samurott → Unovan until Hisuian is legal
  "salamence",
  "sableye",
  "rotom-wash",
  "rillaboom",
  "raichu-alola",
  "primarina",
  "mimikyu-disguised",
  "kingambit",
  "incineroar",
  "glimmora",
  "garchomp",
  "excadrill",
  "dragonite",
  "corviknight",
  "clefable",
  "baxcalibur",
  "armarouge",
  "arcanine",
  "absol",
  "aegislash-shield",
  "meowscarada",
  "basculegion-male",
  "mawile",
  "skeledirge",
  "raichu",
  "charizard",
  "golisopod",
  "lucario",
  "gholdengo",
  "perrserker",
  "froslass",
  "hippowdon",
];

export type BoxExtra = {
  name: string;
  note: string;
};

export const OWNER_BOX_EXTRAS_SEED: BoxExtra[] = [
  { name: "Hisuian Zoroark", note: "Owned — catalog uses Unovan Zoroark until Hisuian is legal." },
  { name: "Hisuian Samurott", note: "Owned — catalog uses Unovan Samurott until Hisuian is legal." },
  { name: "Rotom", note: "Owned base form — Champions catalog only lists appliance forms (Wash is in the legal box)." },
  { name: "Scorbunny", note: "Owned — unevolved; not Champions-legal as Scorbunny." },
];

/** Extras that became legal catalog faces — drop from persisted extras on migrate. */
const PROMOTED_EXTRA_NAMES = new Set(
  ["Perrserker", "Froslass", "Hippowdon"].map((n) => n.toLowerCase()),
);

type MyBoxState = {
  /** Legal catalog slugs you own. */
  owned: string[];
  /** Names you own that are not (yet) on the legal roster. */
  extras: BoxExtra[];
  /** When true, Team / Live pickers prefer or restrict to owned. */
  filterBuilders: boolean;
  add: (slug: string) => boolean;
  remove: (slug: string) => void;
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  addExtra: (extra: BoxExtra) => void;
  removeExtra: (name: string) => void;
  setFilterBuilders: (v: boolean) => void;
  resetToSeed: () => void;
};

function uniqSorted(slugs: string[]) {
  return [...new Set(slugs.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export const useMyBoxStore = create<MyBoxState>()(
  persist(
    (set, get) => ({
      owned: uniqSorted(OWNER_BOX_SEED),
      extras: OWNER_BOX_EXTRAS_SEED,
      filterBuilders: true,
      add: (slug) => {
        const { owned } = get();
        if (owned.includes(slug)) return false;
        set({ owned: uniqSorted([...owned, slug]) });
        return true;
      },
      remove: (slug) => set((s) => ({ owned: s.owned.filter((x) => x !== slug) })),
      toggle: (slug) => {
        const { owned, add, remove } = get();
        if (owned.includes(slug)) remove(slug);
        else add(slug);
      },
      has: (slug) => get().owned.includes(slug),
      addExtra: (extra) =>
        set((s) => ({
          extras: s.extras.some((e) => e.name.toLowerCase() === extra.name.toLowerCase())
            ? s.extras
            : [...s.extras, extra],
        })),
      removeExtra: (name) =>
        set((s) => ({
          extras: s.extras.filter((e) => e.name.toLowerCase() !== name.toLowerCase()),
        })),
      setFilterBuilders: (filterBuilders) => set({ filterBuilders }),
      resetToSeed: () =>
        set({
          owned: uniqSorted(OWNER_BOX_SEED),
          extras: OWNER_BOX_EXTRAS_SEED,
          filterBuilders: true,
        }),
    }),
    {
      name: "ringside-my-box",
      version: 4,
      migrate: (persisted, fromVersion) => {
        const raw = persisted as
          | { owned?: string[]; extras?: BoxExtra[]; filterBuilders?: boolean }
          | undefined;
        // v2 refreshed the owner seed. v3+ unions seed again so new legal faces
        // appear in My box search without wiping custom adds.
        if (fromVersion < 2) {
          return {
            owned: uniqSorted(OWNER_BOX_SEED),
            extras: OWNER_BOX_EXTRAS_SEED,
            filterBuilders: raw?.filterBuilders ?? true,
          };
        }
        const owned = uniqSorted([
          ...(raw?.owned?.length ? raw.owned : []),
          ...OWNER_BOX_SEED,
        ]);
        const prevExtras = raw?.extras?.length ? raw.extras : OWNER_BOX_EXTRAS_SEED;
        const extras =
          fromVersion < 4
            ? prevExtras.filter((e) => !PROMOTED_EXTRA_NAMES.has(e.name.toLowerCase()))
            : prevExtras;
        return {
          owned: owned.length ? owned : uniqSorted(OWNER_BOX_SEED),
          extras: extras.length ? extras : OWNER_BOX_EXTRAS_SEED,
          filterBuilders: raw?.filterBuilders ?? true,
        };
      },
    },
  ),
);
