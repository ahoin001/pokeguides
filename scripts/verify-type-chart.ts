/**
 * Vet `src/lib/champions/types.ts` against the official Gen 6+ type chart.
 * Only non-1× cells are listed; everything else must default to 1.
 *
 * Run: npx tsx scripts/verify-type-chart.ts
 */
import assert from "node:assert/strict";
import { TYPE_IDS, type TypeId } from "../src/types/pokemon";
import {
  attackMultiplier,
  defenseMultiplier,
  defensiveMatchup,
} from "../src/lib/champions/types";

/** Attacker → defender → multiplier for every non-neutral interaction. */
const OFFICIAL: Record<TypeId, Partial<Record<TypeId, number>>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2,
  },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

const errors: string[] = [];

for (const attack of TYPE_IDS) {
  for (const defend of TYPE_IDS) {
    const expected = OFFICIAL[attack][defend] ?? 1;
    const got = attackMultiplier(attack, defend);
    if (got !== expected) {
      errors.push(`${attack} → ${defend}: expected ${expected}, got ${got}`);
    }
  }
}

assert.equal(errors.length, 0, `Type chart mismatches:\n${errors.join("\n")}`);

// Dual-type spot checks (Live Match / dex use these paths)
const cases: { name: string; types: TypeId[]; attack: TypeId; mult: number }[] = [
  { name: "Archaludon", types: ["steel", "dragon"], attack: "fighting", mult: 2 },
  { name: "Archaludon", types: ["steel", "dragon"], attack: "ground", mult: 2 },
  { name: "Archaludon", types: ["steel", "dragon"], attack: "fairy", mult: 1 }, // 2×Steel × 0×Fairy? Fairy vs Steel 0.5, Fairy vs Dragon 2 → 1
  { name: "Archaludon", types: ["steel", "dragon"], attack: "fire", mult: 1 }, // 2×Steel × 0.5×Dragon
  { name: "Gholdengo", types: ["steel", "ghost"], attack: "fighting", mult: 0 },
  { name: "Gholdengo", types: ["steel", "ghost"], attack: "ground", mult: 2 },
  { name: "Gholdengo", types: ["steel", "ghost"], attack: "dark", mult: 2 },
  { name: "Kingambit", types: ["dark", "steel"], attack: "fighting", mult: 4 }, // 2×Dark × 2×Steel
  { name: "Salamence", types: ["dragon", "flying"], attack: "ice", mult: 4 },
  { name: "Excadrill", types: ["ground", "steel"], attack: "fighting", mult: 2 },
  { name: "Excadrill", types: ["ground", "steel"], attack: "water", mult: 2 },
  { name: "Excadrill", types: ["ground", "steel"], attack: "electric", mult: 0 },
  { name: "Corviknight", types: ["flying", "steel"], attack: "fighting", mult: 1 }, // 2×Steel × 0.5×Flying
  { name: "Corviknight", types: ["flying", "steel"], attack: "electric", mult: 2 },
  { name: "Whimsicott", types: ["grass", "fairy"], attack: "poison", mult: 4 },
  { name: "Whimsicott", types: ["grass", "fairy"], attack: "steel", mult: 2 },
];

for (const c of cases) {
  const got = defenseMultiplier(c.types, c.attack);
  assert.equal(
    got,
    c.mult,
    `${c.name} (${c.types.join("/")}) vs ${c.attack}: expected ${c.mult}, got ${got}`,
  );
}

const arch = defensiveMatchup(["steel", "dragon"]);
assert.ok(
  arch.weak.some((w) => w.type === "fighting" && w.mult === 2),
  "Archaludon must list Fighting as a 2× weakness",
);
assert.ok(
  !arch.resist.some((r) => r.type === "fighting"),
  "Archaludon must not resist Fighting",
);

console.log(
  `OK — ${TYPE_IDS.length * TYPE_IDS.length} chart cells + ${cases.length} dual-type checks.`,
);
