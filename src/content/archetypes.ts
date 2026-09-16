import type { ArchetypeId, LiteracyRoleId, RoleId } from "@/types/pokemon";

export type ArchetypeSlot = {
  job: RoleId;
  literacy: LiteracyRoleId;
  alias: string;
  why: string;
  exampleSlug: string;
};

export type ArchetypeGuide = {
  id: ArchetypeId;
  name: string;
  oneLiner: string;
  philosophy: string;
  lead: string;
  margin: "forgiving" | "medium" | "thin";
  pacing: "chess" | "sprint" | "clock";
  turnByTurn: { lead: string; mid: string; late: string };
  jobs: RoleId[];
  roster: ArchetypeSlot[];
  core: { name: string; slugs: [string, string]; why: string };
  sampleSix: string[];
  sampleNote?: string;
  fitsWhen: string[];
  hardWhen: string[];
  compareTo: ArchetypeId[];
};

export const ARCHETYPE_LABEL: Record<ArchetypeId, string> = {
  balance: "Balance",
  "hyper-offense": "Hyper Offense",
  "trick-room": "Trick Room",
  rain: "Rain",
  sun: "Sun",
  grassy: "Grassy",
};

export const MARGIN_LABEL: Record<ArchetypeGuide["margin"], string> = {
  forgiving: "Forgiving",
  medium: "Medium",
  thin: "Razor-thin",
};

export const PACING_LABEL: Record<ArchetypeGuide["pacing"], string> = {
  chess: "Chess match",
  sprint: "Sprint",
  clock: "Flip the clock",
};

export const ARCHETYPES: ArchetypeGuide[] = [
  {
    id: "balance",
    name: "Balance",
    oneLiner: "A breaker, a cleaner, and a patch. If the lead goes wrong, you still have a game.",
    philosophy:
      "Balance is the default Champions three: something that punches holes, something that finishes, and a typing that covers the other two. You do not try to end the match on the first send. You switch, you chip, and you strike when a threat is gone. On preview, a Tailwind name — Whimsicott, Murkrow — is a clock you can read before they click it. Balance often hybridizes with that clock.",
    lead: "Calculated. If the matchup is ugly you pivot. You do not donate a KO to prove a point.",
    margin: "forgiving",
    pacing: "chess",
    turnByTurn: {
      lead: "Send the Pokémon that takes their lead. Keep the cleaner in the back until a wall is gone.",
      mid: "Trade and pivot. Force the switch that lets Kingambit or Garchomp in for free.",
      late: "The cleaner finishes. That is the win condition. Everything else was setup for this.",
    },
    jobs: ["breaker", "speed", "support"],
    roster: [
      {
        job: "breaker",
        literacy: "wallbreaker",
        alias: "Wall-breaker",
        why: "Kingambit cracks the Steel and Rock that would sit on a cleaner all match. The three wins after that wall is gone.",
        exampleSlug: "kingambit",
      },
      {
        job: "speed",
        literacy: "sweeper",
        alias: "Clean-up sweeper",
        why: "Garchomp is the late-game. Keep it in the back until the wall is gone, then it finishes what is left.",
        exampleSlug: "garchomp",
      },
      {
        job: "support",
        literacy: "pivot",
        alias: "Patch / pivot",
        why: "Gholdengo covers Ghost and status, the hole the first two share. That is the net. Good Stuff without a patch is just two attackers.",
        exampleSlug: "gholdengo",
      },
    ],
    core: {
      name: "Garchomp + Kingambit",
      slugs: ["garchomp", "kingambit"],
      why: "Earthquake and Sucker Punch cover different races. Gholdengo patches the Ghost and status holes.",
    },
    sampleSix: ["garchomp", "kingambit", "gholdengo"],
    fitsWhen: [
      "You are learning preview and want room to mispredict.",
      "You want one three that can answer Dragons, Steel, and a special wall.",
    ],
    hardWhen: [
      "A Hyper Offense lead that already outruns your whole list.",
      "A Trick Room team that ignores your Speed plan for four turns.",
    ],
    compareTo: ["hyper-offense"],
  },
  {
    id: "hyper-offense",
    name: "Hyper Offense",
    oneLiner: "No nets. Hit first, hit so hard they never take a turn, snowball before they breathe.",
    philosophy:
      "Hyper Offense drops the defensive pivot. Recovery is rare. The three is Speed plus glass. You fire, and the match is supposed to be over by turn 4. If it is not, you are out of Pokémon.",
    lead: "Aggressive. A Mega that attacks the same turn, or a Scarf that deletes their send. You are already behind if you switched to a resist.",
    margin: "thin",
    pacing: "sprint",
    turnByTurn: {
      lead: "Aim at the Pokémon that would stop the snowball, not the one that looks free.",
      mid: "There is no mid. You are still attacking.",
      late: "If two of yours are up and theirs are chipped, you won. If your sweeper ate a revenge KO, you lost the win condition.",
    },
    jobs: ["speed", "breaker", "mega"],
    roster: [
      {
        job: "speed",
        literacy: "sweeper",
        alias: "Speed Controller",
        why: "Cinderace has to move first. There is no partner Tailwind in singles — if you set Tailwind, it costs this three a turn. Raw Speed or a Scarf is the usual clock.",
        exampleSlug: "cinderace",
      },
      {
        job: "breaker",
        literacy: "wallbreaker",
        alias: "Wall-breaker",
        why: "Something still has to KO the one Pokémon that would sit on the Mega. Garchomp is the Ground hole-punch.",
        exampleSlug: "garchomp",
      },
      {
        job: "mega",
        literacy: "sweeper",
        alias: "Mega win condition",
        why: "Mega Salamence is the snowball. If it eats a revenge KO, the sprint is over. The other two exist to get it a free hit.",
        exampleSlug: "salamence-mega",
      },
    ],
    core: {
      name: "Cinderace + Mega Salamence",
      slugs: ["cinderace", "salamence-mega"],
      why: "Libero or a fast Fire punches first. Aerilate Flying cleans what is left. Garchomp is the Ground answer.",
    },
    sampleSix: ["cinderace", "salamence-mega", "garchomp"],
    fitsWhen: [
      "You like a short game and you are willing to lose to one resist.",
      "You already know the Balance script and want to practice offense-only preview.",
    ],
    hardWhen: [
      "A wall that shrugs off both STABs.",
      "Priority into your Mega on the turn you needed the KO.",
    ],
    compareTo: ["balance"],
  },
  {
    id: "trick-room",
    name: "Trick Room",
    oneLiner: "Slowest Pokémon move first. You flip the clock and you cash four turns of it.",
    philosophy:
      "Trick Room is a mode, not a sprinkle. The three is built slow on purpose. Farigiraf sets the room. Kingambit and a bulky special eat the turns. Fast teams look scary in preview. Under Trick Room they move last. Some lists pack Tailwind as a backup — Tail Room. If the room gets Taunted they still race. Read both clocks.",
    lead: "Protect the setter. If they Taunt, you needed a backup plan before preview ended.",
    margin: "medium",
    pacing: "clock",
    turnByTurn: {
      lead: "Set Trick Room or bait the Taunt. Do not send the truck first unless the room is already up.",
      mid: "The four turns are the match. Fire the breakers. Do not switch into a fast revenge unless the room is gone.",
      late: "If the room ends and you still have a slow truck, you either re-set or you lose the race.",
    },
    jobs: ["speed", "breaker", "support"],
    roster: [
      {
        job: "speed",
        literacy: "setter",
        alias: "Speed Controller",
        why: "Farigiraf is the clock. Trick Room is the whole plan. Protect the setter from Taunt or the four turns never start.",
        exampleSlug: "farigiraf",
      },
      {
        job: "breaker",
        literacy: "wallbreaker",
        alias: "Wall-breaker",
        why: "Kingambit is the truck that cashes the room. Slow on purpose. Under Trick Room it moves first and deletes walls.",
        exampleSlug: "kingambit",
      },
      {
        job: "support",
        literacy: "wall",
        alias: "Patch / wall",
        why: "Gholdengo is the special Steel that keeps moving when the room is up, and the Ghost answer the Dark truck hates.",
        exampleSlug: "gholdengo",
      },
    ],
    core: {
      name: "Farigiraf + Kingambit",
      slugs: ["farigiraf", "kingambit"],
      why: "Armor Tail and a slow Dark truck. Gholdengo is the special Steel that keeps moving when the room is up.",
    },
    sampleSix: ["farigiraf", "kingambit", "gholdengo"],
    fitsWhen: [
      "You are tired of racing fast teams and you want the math inverted.",
      "Your favorite Pokémon is slow and hits like a truck.",
    ],
    hardWhen: [
      "Taunt on the setter before the room goes up.",
      "Opposing Trick Room. Now it is a room war, not a free four turns.",
    ],
    compareTo: ["hyper-offense", "balance"],
  },
  {
    id: "rain",
    name: "Rain",
    oneLiner: "Drizzle on entry. Water hits harder, Fire wilts, Hurricane always connects.",
    philosophy:
      "Rain is a weather mode. Pelipper walks in and the field is yours. Swift Swim and Electro Shot partners cash it. The three is built around the field, not around a single cleaner. Rain that still U-turns is a hybrid — the field is still the tell, and Pelipper must appear.",
    lead: "Pelipper plus a rain abuser. Do not donate the bird for free.",
    margin: "medium",
    pacing: "sprint",
    turnByTurn: {
      lead: "Get rain up. Hurricane or U-turn if the slot is ugly.",
      mid: "Basculegion or Archaludon punch holes. Electric answers are why you packed a Steel.",
      late: "If rain is still up and they have no Electric, you close. If they killed the setter, you are a mediocre Water team.",
    },
    jobs: ["weather", "breaker", "speed"],
    roster: [
      {
        job: "weather",
        literacy: "setter",
        alias: "Weather setter",
        why: "Pelipper walks in and rain is up. The field is the team. Do not donate the bird for a chip KO.",
        exampleSlug: "pelipper",
      },
      {
        job: "speed",
        literacy: "sweeper",
        alias: "Clean-up sweeper",
        why: "Basculegion's Swift Swim is the cleaner once rain is up. Wave Crash under rain is the hole in the wall.",
        exampleSlug: "basculegion-male",
      },
      {
        job: "breaker",
        literacy: "wallbreaker",
        alias: "Special patch",
        why: "Archaludon is the special twin and the Electric answer. Rain without a Steel is a gift to Raichu.",
        exampleSlug: "archaludon",
      },
    ],
    core: {
      name: "Pelipper + Basculegion",
      slugs: ["pelipper", "basculegion-male"],
      why: "Drizzle plus Swift Swim. Wave Crash under rain is the hole in the wall. Archaludon is the special twin.",
    },
    sampleSix: ["pelipper", "basculegion-male", "archaludon"],
    fitsWhen: [
      "You want a field that does work even when you mispredict the lead.",
      "You like Water attackers and you packed an Electric answer.",
    ],
    hardWhen: ["A fast Electric in the rain.", "Sun on the other side. Drought overwrites Drizzle."],
    compareTo: ["sun", "balance"],
  },
  {
    id: "sun",
    name: "Sun",
    oneLiner: "Drought Mega. Fire hits through rain's worst dreams. Solar Beam does not charge.",
    philosophy:
      "Sun in this regulation is usually Mega Charizard Y. The Mega is the setter and the win condition. You do not bring Charizard Y as a cute Mega on a rain team. The other two exist to cover Rock and Water and to finish if Y goes down.",
    lead: "If they cannot punish Drought, lead the Mega. If they can, lead the patch and bring Y in after.",
    margin: "thin",
    pacing: "sprint",
    turnByTurn: {
      lead: "Sun goes up with the Mega. Fire at the Pokémon that would wall you later.",
      mid: "Garchomp punches what Fire does not. The third slot answers Rock.",
      late: "Y either swept or it got Rock- and Water-typed out. The rest of the three has to finish without the field.",
    },
    jobs: ["mega", "weather", "breaker"],
    roster: [
      {
        job: "mega",
        literacy: "sweeper",
        alias: "Mega win condition",
        why: "Mega Charizard Y is the setter and the win condition. Drought walks in with the Mega. The other two exist to cover Rock and Water.",
        exampleSlug: "charizard-mega-y",
      },
      {
        job: "weather",
        literacy: "setter",
        alias: "Weather setter",
        why: "Sun is on the Mega, not on a fourth Pokémon. You do not splash Drought onto a rain three. If Y goes down, the field usually goes with it.",
        exampleSlug: "charizard-mega-y",
      },
      {
        job: "breaker",
        literacy: "wallbreaker",
        alias: "Wall-breaker",
        why: "Garchomp punches what Fire does not. Earthquake hits the Rock and Water answers that would sit on Y.",
        exampleSlug: "garchomp",
      },
    ],
    core: {
      name: "Mega Charizard Y + Garchomp",
      slugs: ["charizard-mega-y", "garchomp"],
      why: "Drought plus Ground coverage. Fire hits the Grass and Steel that would sit on a Dragon. Earthquake hits what Fire does not.",
    },
    sampleSix: ["charizard-mega-y", "garchomp", "cinderace"],
    fitsWhen: [
      "You want the Mega to be the whole plan, not a backup.",
      "The format's Grass and Water answers are what you hate seeing.",
    ],
    hardWhen: ["Rock and Water on their three.", "Pelipper. Rain and sun cannot share a field."],
    compareTo: ["rain", "hyper-offense"],
  },
  {
    id: "grassy",
    name: "Grassy",
    oneLiner: "Rillaboom walks in, Grassy Terrain goes up, Grassy Glide goes first. Pack Fire.",
    philosophy:
      "Grassy Terrain is M-C's problem child. Rillaboom sets it and Grassy Glide gets priority. The other two should like the room: Unburden, a Dark truck, a Steel that hates Earthquake. This is still a three with a named engine, not a stall team.",
    lead: "Rillaboom if their lead is not Fire. If it is, send the patch first.",
    margin: "forgiving",
    pacing: "chess",
    turnByTurn: {
      lead: "Terrain on entry. Grassy Glide if the KO is already there.",
      mid: "Sneasler and Kingambit cash the room. Earthquake from the other side is weaker. That is the hidden bonus.",
      late: "If they killed Rillaboom, you still have two attackers. If they did not pack Fire, you snowball.",
    },
    jobs: ["support", "breaker", "speed"],
    roster: [
      {
        job: "support",
        literacy: "setter",
        alias: "Terrain setter",
        why: "Rillaboom walks in and Grassy Terrain is the room. Grassy Glide goes first. This is still an engine, not a stall piece.",
        exampleSlug: "rillaboom",
      },
      {
        job: "speed",
        literacy: "sweeper",
        alias: "Clean-up sweeper",
        why: "Sneasler's Unburden is the cleaner once the berry pops. Terrain is the room it cashes.",
        exampleSlug: "sneasler",
      },
      {
        job: "breaker",
        literacy: "wallbreaker",
        alias: "Wall-breaker",
        why: "Kingambit is the Dark truck that likes weaker Earthquakes under terrain. If they killed Rillaboom, this is who still punches.",
        exampleSlug: "kingambit",
      },
    ],
    core: {
      name: "Rillaboom + Sneasler",
      slugs: ["rillaboom", "sneasler"],
      why: "Grassy Surge plus Unburden. Terrain is the room. Dire Claw is the cleaner once the berry pops.",
    },
    sampleSix: ["rillaboom", "sneasler", "kingambit"],
    fitsWhen: [
      "You want a field that also attacks.",
      "You like a Balance game with a named engine instead of a generic Mega.",
    ],
    hardWhen: ["Fire-types that ignore the terrain story.", "A faster priority user that deletes Rillaboom on the send."],
    compareTo: ["balance", "trick-room"],
  },
];

export const STALL_NOTE =
  "Full stall is hard on a three. You only have three KOs to give, and the game cap is still a clock. If a three looks fat, it is usually Balance with bulk, not a recovery loop. Chip and recover can be a piece. It is not the whole plan.";

export const STYLE_ALIASES = [
  {
    name: "Good Stuff",
    mapsTo: "balance" as const,
    body: "Other sites call a pile of individually strong Pokémon Good Stuff. In Champions that is Balance: a breaker, a cleaner, and a patch that covers the hole those two share.",
  },
  {
    name: "Hyper Offense",
    mapsTo: "hyper-offense" as const,
    body: "In VGC, HO often means screens or Tailwind on turn 1 while a partner attacks. In Champions singles, Tailwind costs your turn. HO here is Speed plus glass. Win by turn 4 or the sprint is over.",
  },
  {
    name: "Stall / Control",
    mapsTo: null,
    body: STALL_NOTE,
  },
] as const;

export function getArchetype(id: string) {
  return ARCHETYPES.find((a) => a.id === id);
}

export function archetypeHref(id: ArchetypeId) {
  return `/learn/archetypes/${id}` as const;
}
