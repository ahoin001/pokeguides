import { TYPE_IDS, type TypeId } from "@/types/pokemon";

export const TYPE_LABEL: Record<TypeId, string> = {
  normal: "Normal",
  fire: "Fire",
  water: "Water",
  electric: "Electric",
  grass: "Grass",
  ice: "Ice",
  fighting: "Fighting",
  poison: "Poison",
  ground: "Ground",
  flying: "Flying",
  psychic: "Psychic",
  bug: "Bug",
  rock: "Rock",
  ghost: "Ghost",
  dragon: "Dragon",
  dark: "Dark",
  steel: "Steel",
  fairy: "Fairy",
};

/** Attacker -> defender -> multiplier. Official chart. */
const CHART: Record<TypeId, Partial<Record<TypeId, number>>> = {
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

export function attackMultiplier(attack: TypeId, defend: TypeId) {
  return CHART[attack][defend] ?? 1;
}

export function defenseMultiplier(
  defendTypes: readonly TypeId[],
  attack: TypeId,
) {
  return defendTypes.reduce((acc, d) => acc * attackMultiplier(attack, d), 1);
}

export function offensiveCoverage(attack: TypeId) {
  const superEffective: TypeId[] = [];
  const resisted: TypeId[] = [];
  const immune: TypeId[] = [];
  for (const defend of TYPE_IDS) {
    const m = attackMultiplier(attack, defend);
    if (m > 1) superEffective.push(defend);
    else if (m === 0) immune.push(defend);
    else if (m < 1) resisted.push(defend);
  }
  return { superEffective, resisted, immune };
}

export function defensiveMatchup(defendTypes: readonly TypeId[]) {
  const weak: { type: TypeId; mult: number }[] = [];
  const resist: { type: TypeId; mult: number }[] = [];
  const immune: TypeId[] = [];
  for (const attack of TYPE_IDS) {
    const mult = defenseMultiplier(defendTypes, attack);
    if (mult === 0) immune.push(attack);
    else if (mult > 1) weak.push({ type: attack, mult });
    else if (mult < 1) resist.push({ type: attack, mult });
  }
  weak.sort((a, b) => b.mult - a.mult);
  resist.sort((a, b) => a.mult - b.mult);
  return { weak, resist, immune };
}

export function teamWeaknessCounts(teamTypes: readonly (readonly TypeId[])[]) {
  const counts = Object.fromEntries(TYPE_IDS.map((t) => [t, 0])) as Record<
    TypeId,
    number
  >;
  for (const types of teamTypes) {
    for (const attack of TYPE_IDS) {
      if (defenseMultiplier(types, attack) > 1) counts[attack] += 1;
    }
  }
  return counts;
}

/** Community sheet pairing: left column starters / field, right column the rest. */
export const TYPE_SHEET_ROWS: readonly [TypeId, TypeId][] = [
  ["grass", "normal"],
  ["fire", "poison"],
  ["water", "psychic"],
  ["electric", "ghost"],
  ["flying", "ice"],
  ["bug", "dragon"],
  ["fighting", "dark"],
  ["rock", "steel"],
  ["ground", "fairy"],
];

export function typeSheet(type: TypeId) {
  const weak: TypeId[] = [];
  const resist: TypeId[] = [];
  const immuneIn: TypeId[] = [];
  const hits: TypeId[] = [];
  const soft: TypeId[] = [];
  const fails: TypeId[] = [];
  for (const other of TYPE_IDS) {
    const incoming = attackMultiplier(other, type);
    if (incoming === 0) immuneIn.push(other);
    else if (incoming > 1) weak.push(other);
    else if (incoming < 1) resist.push(other);

    const outgoing = attackMultiplier(type, other);
    if (outgoing === 0) fails.push(other);
    else if (outgoing > 1) hits.push(other);
    else if (outgoing < 1) soft.push(other);
  }
  return { weak, resist, immuneIn, hits, soft, fails };
}

export function teamOffenseCounts(teamTypes: readonly (readonly TypeId[])[]) {
  const counts = Object.fromEntries(TYPE_IDS.map((t) => [t, 0])) as Record<
    TypeId,
    number
  >;
  for (const types of teamTypes) {
    for (const attack of types) {
      for (const defend of TYPE_IDS) {
        if (attackMultiplier(attack, defend) > 1) counts[defend] += 1;
      }
    }
  }
  return counts;
}

export function sharedWeaknesses(teamTypes: readonly (readonly TypeId[])[]) {
  const counts = teamWeaknessCounts(teamTypes);
  return TYPE_IDS.filter((t) => counts[t] >= 2);
}
