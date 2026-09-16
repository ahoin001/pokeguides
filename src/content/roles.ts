import type { ArchetypeId, LiteracyRoleId, RoleId } from "@/types/pokemon";

export type RoleGuide = {
  id: RoleId;
  name: string;
  oneLiner: string;
  job: string;
  spot: string[];
  needs: string[];
  exampleSlug: string;
  secondExampleSlug: string;
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
    oneLiner: "Buys turns so the other two can win. Not the Pokémon that racks up KOs.",
    job: "Support changes what the next turn is allowed to be: Intimidate, Fake Out, burn, para, Taunt, Tailwind, pivots, screens. On a three, missing support means your breaker eats every hit raw. Teambuilding needs this job so someone creates the free click — then a breaker cashes it.",
    spot: [
      "Status, Fake Out, Intimidate, U-turn / Parting Shot, Tailwind, or screens.",
      "Bulk enough to take the hit you are offering. Speed is nice, not required.",
      "If the kit only damages and never buys a turn, it is not support.",
    ],
    needs: ["A breaker that KOs once the turn is bought.", "A typing that can take the hit you are offering."],
    exampleSlug: "incineroar",
    secondExampleSlug: "whimsicott",
    literacy: ["wall", "disruptor", "pivot"],
    usedBy: ["balance", "hyper-offense", "trick-room", "rain", "sun", "grassy"],
  },
  {
    id: "breaker",
    name: "Breaker",
    oneLiner: "Takes KOs and forces progress. Walls do not sit forever against a real breaker.",
    job: "A breaker exists to end Pokémon — crack a wall or clean leftovers. You do not ask it to absorb two super-effective hits. Without a breaker, support only delays the loss. Teambuilding needs this job or the three never converts turns into wins.",
    spot: [
      "Attack or Special Attack that jumps off the page. Coverage that hits common walls.",
      "Life Orb, Choice, or setup — kits built to KO.",
      "Priority or a Speed plan so the KO actually lands.",
    ],
    needs: ["A Speed number or priority for the races you care about.", "A patch for the types that wall it."],
    exampleSlug: "kingambit",
    secondExampleSlug: "excadrill",
    literacy: ["wallbreaker", "sweeper"],
    usedBy: ["balance", "hyper-offense", "trick-room", "rain", "sun", "grassy"],
  },
  {
    id: "speed",
    name: "Speed",
    oneLiner: "Wins or flips who moves first. Without it every turn is a guess.",
    job: "Scarf, 32 Spe, priority, Unburden, weather Speed, Tailwind, or Trick Room. Champions singles punishes threes with no Speed plan. Teambuilding needs this job so you are not hoping their cleaner is slower.",
    spot: [
      "Choice Scarf, Sucker Punch, Extreme Speed, or a racing ability.",
      "Trick Room or Tailwind as the other clock.",
      "High base Speed plus 32 Spe is a statement — read it as one.",
    ],
    needs: ["Partners that benefit once you win the race.", "A plan for priority the other way."],
    exampleSlug: "cinderace",
    secondExampleSlug: "sneasler",
    literacy: ["disruptor", "setter", "sweeper"],
    usedBy: ["balance", "hyper-offense", "trick-room", "rain", "sun", "grassy"],
  },
  {
    id: "weather",
    name: "Weather",
    oneLiner: "Sets the field on entry. The other two must cash it — or the setter is a wasted slot.",
    job: "Drizzle, Drought, sand, snow, or terrain rewrite damage and Speed. You do not splash a setter onto a three that cannot use the field. Teambuilding around weather means partners exist to win while that board is up.",
    spot: [
      "Drizzle, Drought, Sand Stream, Snow Warning, or Grassy Surge.",
      "Partners with Swift Swim, Chlorophyll, Sand Rush, or weather moves.",
      "The lead is often the setter — field up before the first KO.",
    ],
    needs: ["At least one Pokémon that gets stronger in that weather.", "An answer to opposing overwrite."],
    exampleSlug: "pelipper",
    secondExampleSlug: "charizard-mega-y",
    literacy: ["setter"],
    usedBy: ["rain", "sun"],
  },
  {
    id: "mega",
    name: "Mega",
    oneLiner: "Once-per-battle closer. The Mega stone is the wincon slot, not a flex.",
    job: "Hold the stone, press the Omni Ring, attack the same turn. Teambuilding treats Mega as how you win if it gets going. If it is not the wincon, you spent the item slot on vanity.",
    spot: [
      "Mega stone as the item. Stats that jump a tier after the form.",
      "A turn to Mega without eating a revenge KO.",
      "A three that still has a game if that Mega is the wrong send.",
    ],
    needs: ["Partners that remove the Mega’s checks.", "Coverage so one typing does not wall the closer."],
    exampleSlug: "salamence-mega",
    secondExampleSlug: "charizard-mega-y",
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
