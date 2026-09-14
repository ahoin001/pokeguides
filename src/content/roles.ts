import type { ArchetypeId, LiteracyRoleId, RoleId } from "@/types/pokemon";

export type RoleGuide = {
  id: RoleId;
  name: string;
  oneLiner: string;
  job: string;
  spot: string[];
  needs: string[];
  exampleSlug: string;
  literacy: LiteracyRoleId[];
  usedBy: ArchetypeId[];
};

export const ROLE_LABEL: Record<RoleId, string> = {
  support: "Support",
  breaker: "Breaker",
  speed: "Speed",
  weather: "Weather",
  mega: "Mega",
};

export const LEARN_ROLE_IDS: RoleId[] = ["support", "breaker", "speed", "weather", "mega"];

export const ROLES: RoleGuide[] = [
  {
    id: "support",
    name: "Support",
    oneLiner: "Status, hazards, a pivot. The Pokémon that makes the other two able to win.",
    job: "Support does not win the game by knocking things out. It buys turns: burn a physical attacker, drop Speed, force a switch with U-turn or Parting Shot, or keep a win condition alive one more turn. On a three that is the difference between your breaker getting a free hit and your breaker eating a super-effective STAB.",
    spot: [
      "Will-O-Wisp, Thunder Wave, Stealth Rock, U-turn, Volt Switch, or Parting Shot.",
      "Bulky HP and defenses. Speed is nice, not required.",
      "It looks like a wall until you watch the first switch. Then it is a tempo piece.",
    ],
    needs: ["A breaker that actually KOs once the turn is bought.", "A typing that can take the hit you are offering."],
    exampleSlug: "incineroar",
    literacy: ["wall", "disruptor", "pivot"],
    usedBy: ["balance", "hyper-offense", "trick-room", "rain", "sun", "grassy"],
  },
  {
    id: "breaker",
    name: "Breaker",
    oneLiner: "The Pokémon that knocks holes. If a wall is sitting there, this is who shatters it.",
    job: "A breaker exists to take KOs. Some are fast and clean leftovers. Some are slow trucks that ignore bulk. You do not ask a breaker to absorb two super-effective hits. You ask it to punch, then switch, then punch again.",
    spot: [
      "Attack or Special Attack that jumps off the page. Speed is optional.",
      "STABs that hit the format's common walls, or a coverage move that ignores a defensive type.",
      "Items and kits built for damage: Life Orb, Choice, boosting moves.",
    ],
    needs: ["A Speed number that wins the races you care about, or priority.", "A type that the format's walls do not like."],
    exampleSlug: "kingambit",
    literacy: ["wallbreaker", "sweeper"],
    usedBy: ["balance", "hyper-offense", "trick-room", "rain", "sun", "grassy"],
  },
  {
    id: "speed",
    name: "Speed",
    oneLiner: "Outrun them, revenge them, or flip the clock. 3v3 is a Speed game first.",
    job: "Whoever moves first often decides the KO. Speed is the job that changes that math: a Choice Scarf, a priority move, a Trick Room setter, or a Pokémon that already outruns the format after a boost. Without this job you are guessing every turn.",
    spot: [
      "Choice Scarf, Sucker Punch, Extreme Speed, or an ability that races (Unburden, Swift Swim).",
      "A slow Psychic or Normal with Trick Room in the kit is the other clock.",
      "High base Speed plus 32 SP in Spe is a statement. Read it as one.",
    ],
    needs: ["Partners that actually benefit once you win the race.", "A plan for priority the other way."],
    exampleSlug: "cinderace",
    literacy: ["disruptor", "setter", "sweeper"],
    usedBy: ["balance", "hyper-offense", "trick-room", "rain", "sun", "grassy"],
  },
  {
    id: "weather",
    name: "Weather",
    oneLiner: "Rain, sun, sand, or snow the moment it enters. The field is the team.",
    job: "A weather setter changes every Water, Fire, Ice, and Rock calculation on the field. Pelipper's Drizzle is the rain team. Mega Charizard Y's Drought is the sun team. You do not splash weather on a three. If this Pokémon is on the list, the other two should cash the field.",
    spot: [
      "Drizzle, Drought, Sand Stream, or Snow Warning.",
      "Partners with Swift Swim, Chlorophyll, Sand Rush, or Weather Ball / Hurricane / Solar Beam.",
      "The lead is often the setter itself. They want the field up before the first KO.",
    ],
    needs: ["At least one Pokémon that gets stronger in that weather.", "An answer to the other weather, because only one field wins."],
    exampleSlug: "pelipper",
    literacy: ["setter"],
    usedBy: ["rain", "sun"],
  },
  {
    id: "mega",
    name: "Mega",
    oneLiner: "One per battle. The Omni Ring pick is your win condition, not a flex.",
    job: "Mega Evolution is a once-per-match transform. You hold the stone, you press the Omni Ring, you attack the same turn. The Pokémon that Mega Evolves should be the one that wins if it gets going: Mega Salamence's Aerilate, Mega Charizard Y's sun. If two on the three can Mega, preview is where you pick.",
    spot: [
      "Mega or Mega Z in the name. The stone is the item.",
      "Stats that jump a tier after the form. That jump is the whole point.",
      "A three that still has a game if that Mega is the wrong send.",
    ],
    needs: ["A turn to Mega without eating a revenge KO.", "Coverage so the Mega is not walled by one typing."],
    exampleSlug: "salamence-mega",
    literacy: ["sweeper", "wallbreaker"],
    usedBy: ["balance", "hyper-offense", "sun"],
  },
];

export function getRole(id: string) {
  return ROLES.find((r) => r.id === id);
}

export function roleHref(id: RoleId) {
  return `/learn/roles/${id}` as const;
}
