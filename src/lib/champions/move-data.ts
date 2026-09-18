import movesJson from "@/data/moves-champions.json";
import type { TypeId } from "@/types/pokemon";
import type { DamageMove, MoveCategory } from "@/lib/champions/damage";
import { MOVE_TYPE, isDamagingMove } from "@/lib/champions/moves";

type MovesFile = {
  moves: Record<
    string,
    {
      name: string;
      type: string;
      category: MoveCategory;
      basePower: number;
      priority?: number;
      shortEffect?: string;
    }
  >;
};

const file = movesJson as MovesFile;

export type ChampionsMove = DamageMove & {
  shortEffect?: string;
};

export function getChampionsMove(name: string): ChampionsMove | undefined {
  const direct = file.moves[name];
  const row =
    direct ??
    Object.values(file.moves).find((m) => m.name.toLowerCase() === name.toLowerCase());
  if (!row) {
    const type = MOVE_TYPE[name.toLowerCase()];
    if (!type || !isDamagingMove(name)) return undefined;
    return { name, type, category: "physical", basePower: 80 };
  }
  return {
    name: row.name,
    type: row.type as TypeId,
    category: row.category,
    basePower: row.basePower,
    priority: row.priority,
    shortEffect: row.shortEffect,
  };
}

export function championsMoveNames() {
  return Object.keys(file.moves).sort((a, b) => a.localeCompare(b));
}

/** All damaging Champions moves (status excluded) — for calc search. */
let damagingCache: DamageMove[] | null = null;

export function listChampionsDamagingMoves(): DamageMove[] {
  if (damagingCache) return damagingCache;
  damagingCache = Object.values(file.moves)
    .filter((m) => m.category !== "status" && m.basePower > 0)
    .map((m) => ({
      name: m.name,
      type: m.type as TypeId,
      category: m.category,
      basePower: m.basePower,
      priority: m.priority,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return damagingCache;
}

export function searchChampionsDamagingMoves(query: string, limit = 24): DamageMove[] {
  const needle = query.trim().toLowerCase();
  const all = listChampionsDamagingMoves();
  if (!needle) return all.slice(0, limit);
  const hits = all.filter(
    (m) =>
      m.name.toLowerCase().includes(needle) ||
      m.type.includes(needle) ||
      m.category.startsWith(needle),
  );
  return hits.slice(0, limit);
}
