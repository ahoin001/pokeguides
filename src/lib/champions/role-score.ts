/**
 * Role is a score, not a fact.
 *
 * 1. Stat shape — what the body wants to do
 * 2. Ability — what the body is allowed to be
 * 3. Movepool (kitTags) — what the job actually is
 * 4. Editorial.role — the classroom override; always wins the Champions job
 *
 * Same Pokémon can be several literacy roles (Incineroar is wall, pivot, disruptor).
 * The catalog names the body. Only a set names the job on a given three.
 */
import type { CatalogEntry, KitTag, LiteracyRoleId, RoleId } from "@/types/pokemon";
import { LITERACY_ROLE_IDS } from "@/types/pokemon";
import { ROLE_LABEL } from "@/content/roles";
import { getLiteracyRole } from "@/content/literacy-roles";

export type OffenseBias = "physical" | "special" | "mixed";

export type RoleScore = {
  role: RoleId;
  guessed: boolean;
  literacy: LiteracyRoleId;
  literacyScores: Record<LiteracyRoleId, number>;
  why: string[];
  offense: OffenseBias;
};

const WEATHER_ABILITIES = new Set(["drizzle", "drought", "sand stream", "snow warning"]);
const TERRAIN_ABILITIES = new Set(["grassy surge", "electric surge", "psychic surge", "misty surge"]);
const PIVOT_ABILITIES = new Set(["regenerator", "intimidate"]);
const SPEED_ABILITIES = new Set(["swift swim", "chlorophyll", "sand rush", "unburden", "prankster"]);

function hasTag(mon: CatalogEntry, tag: KitTag) {
  return (mon.kitTags ?? []).includes(tag);
}

function abilitySet(mon: CatalogEntry) {
  return new Set(mon.abilities.map((a) => a.toLowerCase()));
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function offenseBias(mon: CatalogEntry): OffenseBias {
  const { atk, spa } = mon.stats;
  const gap = Math.abs(atk - spa);
  if (gap < 15) return "mixed";
  return atk > spa ? "physical" : "special";
}

function literacyScores(mon: CatalogEntry): { scores: Record<LiteracyRoleId, number>; why: string[] } {
  const { hp, atk, def, spa, spd, spe, bst } = mon.stats;
  const offensive = Math.max(atk, spa);
  const bulk = hp + def + spd;
  const abilities = abilitySet(mon);
  const why: string[] = [];

  const atkShare = offensive / Math.max(bst, 1);
  const speShare = spe / Math.max(bst, 1);
  const bulkShare = bulk / Math.max(bst, 1);

  const weather = [...abilities].some((a) => WEATHER_ABILITIES.has(a));
  const terrain = [...abilities].some((a) => TERRAIN_ABILITIES.has(a));
  const intimidate = abilities.has("intimidate");
  const regenerator = abilities.has("regenerator");
  const prankster = abilities.has("prankster");
  const speedAbility = [...abilities].some((a) => SPEED_ABILITIES.has(a));

  let sweeper = clamp01(atkShare * 1.4 + speShare * 1.8 - 0.35);
  if (spe >= 100 && offensive >= 100) sweeper = Math.max(sweeper, 0.72);
  if (hasTag(mon, "setup") && spe >= 80) sweeper = Math.min(1, sweeper + 0.18);
  if (speedAbility && offensive >= 90) sweeper = Math.min(1, sweeper + 0.12);

  let wall = clamp01(bulkShare * 1.6 - atkShare * 0.4 - 0.25);
  if (bulk >= 280 && offensive < 110) wall = Math.max(wall, 0.7);
  if (hasTag(mon, "recovery")) wall = Math.min(1, wall + 0.2);
  if (intimidate || regenerator) wall = Math.min(1, wall + 0.12);

  let wallbreaker = clamp01(atkShare * 2.1 - speShare * 0.6 - 0.2);
  if (offensive >= 125) wallbreaker = Math.max(wallbreaker, 0.68);
  if (hasTag(mon, "setup") && spe < 90) wallbreaker = Math.min(1, wallbreaker + 0.12);

  let pivot = hasTag(mon, "pivot") ? 0.55 : 0.05;
  if (hasTag(mon, "pivot") && bulkShare > 0.48) pivot = Math.min(1, pivot + 0.2);
  if (regenerator && hasTag(mon, "pivot")) pivot = Math.min(1, pivot + 0.15);

  let disruptor = hasTag(mon, "status") ? 0.5 : 0.08;
  if (prankster) disruptor = Math.min(1, disruptor + 0.25);
  if (hasTag(mon, "status") && offensive < 110) disruptor = Math.min(1, disruptor + 0.12);
  if (intimidate) disruptor = Math.min(1, disruptor + 0.1);

  let setter = weather || terrain ? 0.85 : 0.05;
  if (hasTag(mon, "trick-room") || hasTag(mon, "tailwind")) setter = Math.max(setter, 0.78);
  if (hasTag(mon, "hazards") && !weather) setter = Math.max(setter, 0.45);

  const scores = { sweeper, wall, disruptor, wallbreaker, pivot, setter };
  const literacy = topLiteracy(scores);

  if (literacy === "sweeper") why.push("High Speed and Attack or Special Attack — sweeper body.");
  else if (literacy === "wallbreaker") why.push("Attack or Special Attack jumps off the page — wallbreaker body.");
  else if (literacy === "wall") why.push("HP and the defenses are the stats that jump — wall body.");
  else if (literacy === "pivot") why.push("A pivot move plus enough bulk to take a hit.");
  else if (literacy === "disruptor") why.push("Utility first. Damage is a side effect.");
  else if (literacy === "setter") why.push("The field or the clock changes when this Pokémon works.");

  if (weather) why.push("Weather ability on entry. The field is the team.");
  else if (terrain) why.push("Terrain on entry. The rest of the three should cash it.");
  if (hasTag(mon, "pivot")) why.push("Learns U-turn, Volt Switch, Flip Turn, or Parting Shot — can pivot.");
  if (hasTag(mon, "priority")) why.push("Priority in the kit. A Speed plan even when the number loses.");
  if (hasTag(mon, "setup")) why.push("A boosting move. Sweeper or wallbreaker depending on Speed.");
  if (hasTag(mon, "recovery")) why.push("Recovery in the kit. It can sit and take a hit.");
  if (hasTag(mon, "status")) why.push("Status, Taunt, or Encore — disruptor tools.");
  if (hasTag(mon, "trick-room")) why.push("Trick Room in the kit. That is a Speed Controller.");
  if (hasTag(mon, "tailwind")) why.push("Tailwind in the kit. In singles it costs your turn.");
  if (intimidate) why.push("Intimidate. A switch-in that buys the next send.");
  if (prankster) why.push("Prankster. Status or Tailwind goes first.");

  if (!why.length) {
    why.push("Stats, ability, and kit do not scream one job. Read the partners before you lock it.");
  }

  return {
    scores,
    why,
  };
}

function topLiteracy(scores: Record<LiteracyRoleId, number>): LiteracyRoleId {
  let best: LiteracyRoleId = "sweeper";
  let n = -1;
  for (const id of LITERACY_ROLE_IDS) {
    if (scores[id] > n) {
      n = scores[id];
      best = id;
    }
  }
  return best;
}

function roleFromGuess(mon: CatalogEntry, literacy: LiteracyRoleId, scores: Record<LiteracyRoleId, number>): RoleId {
  if (mon.form === "mega" || mon.form === "mega-z") return "mega";
  const abilities = abilitySet(mon);
  if ([...abilities].some((a) => WEATHER_ABILITIES.has(a))) return "weather";

  if (literacy === "setter") {
    if (hasTag(mon, "trick-room") || hasTag(mon, "tailwind")) return "speed";
    if ([...abilities].some((a) => TERRAIN_ABILITIES.has(a))) return "support";
    return "weather";
  }
  if (literacy === "sweeper") {
    if (mon.stats.spe >= 100 || scores.sweeper - scores.wallbreaker > 0.08) return "speed";
    return "breaker";
  }
  if (literacy === "wallbreaker") return "breaker";
  return "support";
}

export function scorePokemon(mon: CatalogEntry): RoleScore {
  const { scores, why } = literacyScores(mon);
  const literacy = topLiteracy(scores);
  const guessedRole = roleFromGuess(mon, literacy, scores);
  const editorial = mon.role;
  const offense = offenseBias(mon);

  if (editorial) {
    const mapped = getLiteracyRole(literacy);
    const extra =
      mapped && !mapped.mapsTo.includes(editorial)
        ? [`Classroom job is ${ROLE_LABEL[editorial]}. The body still reads as ${mapped.name.toLowerCase()}.`]
        : [];
    return {
      role: editorial,
      guessed: false,
      literacy,
      literacyScores: scores,
      why: [...why, ...extra],
      offense,
    };
  }

  return {
    role: guessedRole,
    guessed: true,
    literacy,
    literacyScores: scores,
    why,
    offense,
  };
}

export function jobOf(mon: CatalogEntry): RoleId {
  return scorePokemon(mon).role;
}

export function hasSpeedPlan(mon: CatalogEntry) {
  const tags = mon.kitTags ?? [];
  if (tags.includes("priority") || tags.includes("trick-room") || tags.includes("tailwind")) return true;
  const abilities = abilitySet(mon);
  if ([...abilities].some((a) => SPEED_ABILITIES.has(a))) return true;
  if (jobOf(mon) === "speed") return true;
  if (scorePokemon(mon).literacy === "wall") return true;
  return mon.stats.spe >= 110;
}
