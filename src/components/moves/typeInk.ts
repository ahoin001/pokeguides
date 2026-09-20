import type { TypeId } from "@/types/pokemon";

/**
 * Champions type discs that need dark label ink (light fills).
 * Unified — was duplicated and divergent across Live / Moves / DecisionTree.
 */
const TYPE_INK_DARK = new Set<TypeId>([
  "normal",
  "electric",
  "ice",
  "fighting",
  "flying",
  "bug",
  "rock",
  "steel",
  "fairy",
  "ground",
]);

/** Tailwind text class for type-filled move chips. */
export function typeFillInkClass(type: TypeId): "text-[#1a1a1a]" | "text-white" {
  return TYPE_INK_DARK.has(type) ? "text-[#1a1a1a]" : "text-white";
}

export function needsDarkTypeInk(type: TypeId): boolean {
  return TYPE_INK_DARK.has(type);
}
