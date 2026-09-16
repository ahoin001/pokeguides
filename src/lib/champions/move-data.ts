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
    }
  >;
};

const file = movesJson as MovesFile;

export function getChampionsMove(name: string): DamageMove | undefined {
  const direct = file.moves[name];
  const row =
    direct ??
    Object.values(file.moves).find((m) => m.name.toLowerCase() === name.toLowerCase());
  if (!row) {
    const type = MOVE_TYPE[name.toLowerCase()];
    if (!type || !isDamagingMove(name)) return undefined;
    // Fallback estimate when sync missed a name
    return { name, type, category: "physical", basePower: 80 };
  }
  return {
    name: row.name,
    type: row.type as TypeId,
    category: row.category,
    basePower: row.basePower,
    priority: row.priority,
  };
}

export function championsMoveNames() {
  return Object.keys(file.moves).sort((a, b) => a.localeCompare(b));
}
