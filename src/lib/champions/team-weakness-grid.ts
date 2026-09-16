import type { CatalogEntry, TypeId } from "@/types/pokemon";
import { TYPE_IDS_ALPHA, TYPE_LABEL, defenseMultiplier } from "@/lib/champions/types";

export type WeaknessMemberHit = {
  slug: string;
  name: string;
  mult: number;
};

export type WeaknessTile = {
  type: TypeId;
  /** Members hit for >1×. */
  weak: WeaknessMemberHit[];
  /** Members at 0×. */
  immune: { slug: string; name: string }[];
  /** Members at <1× (and not immune). */
  resist: WeaknessMemberHit[];
  /** Number of teammates weak to this type. */
  weakCount: number;
  /** Worst multiplier into any teammate. */
  worst: number;
  hasImmune: boolean;
  tone: "weak-many" | "weak-some" | "immune" | "neutral";
};

export function teamWeaknessGrid(members: readonly CatalogEntry[]): WeaknessTile[] {
  return TYPE_IDS_ALPHA.map((attack) => {
    const weak: WeaknessMemberHit[] = [];
    const immune: { slug: string; name: string }[] = [];
    const resist: WeaknessMemberHit[] = [];
    let worst = 1;
    for (const m of members) {
      const mult = defenseMultiplier(m.types, attack);
      if (mult === 0) immune.push({ slug: m.slug, name: m.name });
      else if (mult > 1) {
        weak.push({ slug: m.slug, name: m.name, mult });
        worst = Math.max(worst, mult);
      } else if (mult < 1) {
        resist.push({ slug: m.slug, name: m.name, mult });
      }
    }
    weak.sort((a, b) => b.mult - a.mult);
    resist.sort((a, b) => a.mult - b.mult);
    const weakCount = weak.length;
    const hasImmune = immune.length > 0;
    let tone: WeaknessTile["tone"] = "neutral";
    if (weakCount >= 3) tone = "weak-many";
    else if (weakCount >= 1) tone = "weak-some";
    else if (hasImmune) tone = "immune";

    return {
      type: attack,
      weak,
      immune,
      resist,
      weakCount,
      worst,
      hasImmune,
      tone,
    };
  });
}

export function weaknessTileLabel(tile: WeaknessTile) {
  const name = TYPE_LABEL[tile.type];
  if (!tile.weakCount && !tile.hasImmune && !tile.resist.length) return `${name} — neutral`;
  const parts: string[] = [];
  if (tile.weakCount) {
    parts.push(
      `${tile.weakCount}× weak${tile.worst >= 4 ? " (incl. 4×)" : ""}`,
    );
  }
  if (tile.resist.length) parts.push(`${tile.resist.length}× resist`);
  if (tile.hasImmune) parts.push(`${tile.immune.length}× immune`);
  return `${name} — ${parts.join(", ")}`;
}
