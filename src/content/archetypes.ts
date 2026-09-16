import type { ArchetypeId, LiteracyRoleId, RoleId } from "@/types/pokemon";
import {
  PLAYBOOK_EXTRA,
  type ArchetypePlaybookExtra,
} from "@/content/archetype-playbook-extra";

export type ArchetypeSlot = {
  job: RoleId;
  literacy: LiteracyRoleId;
  alias: string;
  why: string;
  exampleSlug: string;
};

/** Preview signal — if you see this Pokémon, you are likely facing the style. */
export type ArchetypeTell = {
  slug: string;
  why: string;
};

/** Matchup edge with concrete Pokémon examples for preparation. */
export type ArchetypeEdge = {
  vs: ArchetypeId;
  why: string;
  /** Pokémon to reach for when you are this style into `vs` — or when facing this style, your answers. */
  yourExamples: string[];
  /** Pokémon on the opposing style that define the matchup. */
  theirExamples: string[];
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
  /** Signature Pokémon that scream this plan on preview. */
  tells: ArchetypeTell[];
  /** Styles this plan is generally strong into. */
  favors: ArchetypeEdge[];
  /** Styles this plan is generally weak into. */
  struggles: ArchetypeEdge[];
};

export type ArchetypePlaybookGuide = ArchetypeGuide & ArchetypePlaybookExtra;

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
      "Balance is the default Champions three: something that punches holes, something that finishes, and a typing that covers the other two. You do not try to end the match on the first send. You switch, you chip, and you strike when a threat is gone. On preview, a Tailwind name — Whimsicott — is a clock you can read before they click it. Balance often hybridizes with that clock.",
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
    tells: [
      {
        slug: "salamence",
        why: "#1 M-C. Mega or kite — still Balance when Primarina / Hippo sit beside it.",
      },
      {
        slug: "garchomp",
        why: "#2 Ground cleaner on a mixed list — classic Balance wincon kept in the bag.",
      },
      {
        slug: "primarina",
        why: "#3 Special Fairy/Water patch. Two attackers plus this is midrange, not HO glass.",
      },
      {
        slug: "golisopod",
        why: "#4 Emergency Exit pivot. Hands off after the chip — Balance tempo.",
      },
      {
        slug: "hippowdon",
        why: "#5 Sand wall. Fat Ground that soaks Fire and sets the board for the cleaner.",
      },
      {
        slug: "gholdengo",
        why: "#8 Ghost/Steel patch. Good Stuff glue when the Ice hole needs covering.",
      },
      {
        slug: "aegislash-shield",
        why: "#11 Stance Change pivot. King’s Shield into the Mega, then Blade.",
      },
      {
        slug: "corviknight",
        why: "#15 Fat Flying pivot. Honest Balance soaks Ice and hands off to the cleaner.",
      },
      {
        slug: "rotom-wash",
        why: "#23 Burn + Volt Switch. Classic Balance glue into Ground and Fire.",
      },
      {
        slug: "meowscarada",
        why: "#13 Protean / Scarf seat. Balance Speed control without going full HO.",
      },
      {
        slug: "whimsicott",
        why: "Prankster Tailwind clock sitting on Balance. Read the four turns before they click.",
      },
      {
        slug: "kingambit",
        why: "#34 Dark truck that cracks Steel. Balance and TR both love it — look for the patch next.",
      },
    ],
    favors: [
      {
        vs: "hyper-offense",
        why: "You have switches. Their sprint dies if the first KO fails and Corvi or Gholdengo eats the Mega.",
        yourExamples: ["corviknight", "gholdengo", "primarina"],
        theirExamples: ["salamence-mega", "cinderace", "dragonite"],
      },
      {
        vs: "sun",
        why: "Rock and Water answers sit on Y. Drought only hurts if you donate the Mega a free turn.",
        yourExamples: ["archaludon", "primarina", "hippowdon"],
        theirExamples: ["charizard-mega-y", "garchomp"],
      },
    ],
    struggles: [
      {
        vs: "trick-room",
        why: "Your Speed plan is the wrong clock. Farigiraf blanks Fake Out and the truck moves first for four turns.",
        yourExamples: ["meowscarada", "gholdengo", "whimsicott"],
        theirExamples: ["farigiraf", "kingambit", "gholdengo"],
      },
      {
        vs: "rain",
        why: "Drizzle plus Swift Swim outruns midrange pivots. Electric and Steel must be in the bring.",
        yourExamples: ["raichu", "archaludon", "kilowattrel"],
        theirExamples: ["pelipper", "basculegion-male", "archaludon"],
      },
    ],
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
    tells: [
      {
        slug: "salamence-mega",
        why: "Aerilate snowball with no fat pivot beside it. Classic HO wincon.",
      },
      {
        slug: "cinderace",
        why: "#21 Libero / Scarf Fire that punches first. HO clock without Tailwind.",
      },
      {
        slug: "dragonite",
        why: "#30 Multiscale kite. Scale Sweep — Ice is the hole, Excadrill often leads.",
      },
      {
        slug: "mimikyu-disguised",
        why: "#10 Disguise Sweep. Costume buys the turn the kite needs.",
      },
      {
        slug: "excadrill",
        why: "Mold Breaker sand lead into Multiscale. HO front-end, not a Balance patch.",
      },
      {
        slug: "greninja",
        why: "#19 Sash / Protean. Glass that opens HO races before the Mega appears.",
      },
      {
        slug: "gyarados",
        why: "#14 Intimidate into Dance. HO that still pretends to soak one hit.",
      },
      {
        slug: "baxcalibur",
        why: "Ice breaker that deletes Dragons. Common HO / Balance hybrid wincon.",
      },
      {
        slug: "glimmora",
        why: "Sash hazards lead. HO that taxes switches before the snowball.",
      },
      {
        slug: "talonflame",
        why: "Gale Wings priority into Fire. Pure HO Speed pressure.",
      },
    ],
    favors: [
      {
        vs: "balance",
        why: "If you delete the patch before they pivot, their cleaner never gets a free entry.",
        yourExamples: ["cinderace", "salamence-mega", "excadrill"],
        theirExamples: ["gholdengo", "corviknight", "garchomp"],
      },
      {
        vs: "grassy",
        why: "Fire and Speed pressure Rillaboom before Grassy Glide snowballs.",
        yourExamples: ["cinderace", "talonflame", "salamence-mega"],
        theirExamples: ["rillaboom", "sneasler"],
      },
    ],
    struggles: [
      {
        vs: "trick-room",
        why: "Your Speed is the wrong story. Under the room their truck moves first and your Mega dies on entry.",
        yourExamples: ["meowscarada", "gholdengo", "primarina"],
        theirExamples: ["farigiraf", "kingambit"],
      },
      {
        vs: "rain",
        why: "Hurricane always hits and Swift Swim outspeeds glass that expected a dry race.",
        yourExamples: ["raichu", "archaludon", "kilowattrel"],
        theirExamples: ["pelipper", "basculegion-male"],
      },
    ],
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
    tells: [
      {
        slug: "farigiraf",
        why: "Must-appear setter. Armor Tail blanks Fake Out — plan as if it is coming.",
      },
      {
        slug: "kingambit",
        why: "#34 Slow Dark truck next to the setter. Under the room it moves first.",
      },
      {
        slug: "gholdengo",
        why: "#8 Special Steel that still moves under Trick Room. Common TR patch.",
      },
      {
        slug: "annihilape",
        why: "Rage Fist truck. Bulk + boost under the room deletes HO glass.",
      },
      {
        slug: "banette",
        why: "Prankster / Ghost support seen next to Basculegion and Pawmot cores.",
      },
      {
        slug: "whimsicott",
        why: "With Farigiraf: Tail Room hybrid. Two clocks — room or Tailwind race.",
      },
      {
        slug: "basculegion-male",
        why: "#16 Sometimes cashes TR with Last Respects after early KOs.",
      },
      {
        slug: "armarouge",
        why: "Expanding Force special under Psychic Terrain hybrids sitting on TR.",
      },
    ],
    favors: [
      {
        vs: "hyper-offense",
        why: "Their Speed becomes last. Armor Tail blanks Fake Out; the truck deletes the Mega.",
        yourExamples: ["farigiraf", "kingambit", "gholdengo"],
        theirExamples: ["salamence-mega", "cinderace", "dragonite"],
      },
      {
        vs: "balance",
        why: "Midrange Speed control is irrelevant for four turns. Slow trucks outpace their pivots.",
        yourExamples: ["farigiraf", "kingambit"],
        theirExamples: ["garchomp", "whimsicott", "corviknight"],
      },
    ],
    struggles: [
      {
        vs: "grassy",
        why: "Grassy Glide priority and Unburden still threaten under or after the room. Fire answers matter less than speed control disruption.",
        yourExamples: ["cinderace", "talonflame", "primarina"],
        theirExamples: ["rillaboom", "sneasler", "kingambit"],
      },
      {
        vs: "sun",
        why: "Y threatens the setter and the truck with Fire before the room is safe.",
        yourExamples: ["archaludon", "primarina", "hippowdon"],
        theirExamples: ["charizard-mega-y", "cinderace"],
      },
    ],
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
    tells: [
      {
        slug: "pelipper",
        why: "Must-appear Drizzle (~#52). No bird, no rain — plan the lead as if it is coming.",
      },
      {
        slug: "basculegion-male",
        why: "#16 Swift Swim / Last Respects under rain. The cleaner that cashes the field.",
      },
      {
        slug: "archaludon",
        why: "#9 Electro Shot / special Steel twin. Rain’s Electric answer on the six.",
      },
      {
        slug: "swampert",
        why: "Rain Ground/Water. Common Pelipper mate that punches Electric answers.",
      },
      {
        slug: "golisopod",
        why: "#4 Often rides rain cores as a pivot / Mega seat next to Pelipper.",
      },
      {
        slug: "garchomp",
        why: "Ground coverage in rain lists — punches Electric and keeps the board.",
      },
      {
        slug: "greninja",
        why: "#19 Protean Water under rain when they want Speed without Swift Swim.",
      },
      {
        slug: "kingambit",
        why: "Dark truck that still shows on rain hybrids when Electric is the hole.",
      },
    ],
    favors: [
      {
        vs: "sun",
        why: "Drizzle overwrites Drought when Pelipper walks in. Fire wilts; Hurricane never misses.",
        yourExamples: ["pelipper", "basculegion-male", "archaludon"],
        theirExamples: ["charizard-mega-y", "garchomp"],
      },
      {
        vs: "hyper-offense",
        why: "Rain Speed and accuracy punish glass that expected a dry race.",
        yourExamples: ["basculegion-male", "pelipper"],
        theirExamples: ["cinderace", "salamence-mega", "dragonite"],
      },
    ],
    struggles: [
      {
        vs: "balance",
        why: "Fat Electric and Steel patches sit on Water. If they bring Raichu or Archaludon, the field is a trap.",
        yourExamples: ["archaludon", "gholdengo", "corviknight"],
        theirExamples: ["raichu", "kilowattrel", "hippowdon"],
      },
      {
        vs: "grassy",
        why: "Terrain cuts Earthquake and Grassy Glide races your midgame. Fire pressure on the bird matters.",
        yourExamples: ["cinderace", "charizard-mega-y", "talonflame"],
        theirExamples: ["rillaboom", "sneasler"],
      },
    ],
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
    tells: [
      {
        slug: "charizard",
        why: "#18 with Charizardite Y. Setter and wincon in one registered slot.",
      },
      {
        slug: "charizard-mega-y",
        why: "Drought form. Solar Beam no charge — plan Rock/Water before it transforms.",
      },
      {
        slug: "garchomp",
        why: "Ground twin beside Y. Punches Rock and Water answers.",
      },
      {
        slug: "cinderace",
        why: "#21 Second Fire that keeps pressure if Y is forced out.",
      },
      {
        slug: "mimikyu-disguised",
        why: "#10 Common Y partner — Disguise buys the turn Drought needs.",
      },
      {
        slug: "hippowdon",
        why: "#5 Sand / Rock answer seat that still shows next to Charizard cores.",
      },
      {
        slug: "primarina",
        why: "#3 Special Fairy that patches Dragons while Y pressures Grass.",
      },
      {
        slug: "talonflame",
        why: "Gale Wings Fire backup when they want priority under or after Drought.",
      },
    ],
    favors: [
      {
        vs: "grassy",
        why: "Fire deletes Rillaboom and wilts the terrain story before Unburden cashes.",
        yourExamples: ["charizard-mega-y", "cinderace", "talonflame"],
        theirExamples: ["rillaboom", "sneasler"],
      },
      {
        vs: "balance",
        why: "Drought pressures Grass and Steel patches; Y forces awkward switches on midrange lists.",
        yourExamples: ["charizard-mega-y", "garchomp"],
        theirExamples: ["gholdengo", "corviknight", "kingambit"],
      },
    ],
    struggles: [
      {
        vs: "rain",
        why: "Pelipper overwrites Drought. Water hits harder and Fire wilts.",
        yourExamples: ["hippowdon", "primarina", "archaludon"],
        theirExamples: ["pelipper", "basculegion-male"],
      },
      {
        vs: "hyper-offense",
        why: "Faster glass and Rock coverage delete Y before Drought matters. Priority into the Mega ends the plan.",
        yourExamples: ["primarina", "corviknight", "archaludon"],
        theirExamples: ["excadrill", "dragonite", "salamence-mega"],
      },
    ],
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
    tells: [
      {
        slug: "rillaboom",
        why: "#12 Must-appear Grassy Surge. No Boom, no room — Unburden without it is a bluff.",
      },
      {
        slug: "sneasler",
        why: "#22 Unburden cleaner that cashes terrain after the berry pops.",
      },
      {
        slug: "indeedee-female",
        why: "#24 Psychic Terrain partner — Expanding Force cores next to Sneasler.",
      },
      {
        slug: "kingambit",
        why: "#34 Dark truck that likes weaker Earthquakes under Grassy Terrain.",
      },
      {
        slug: "armarouge",
        why: "Expanding Force seat on terrain / Psychic hybrids.",
      },
      {
        slug: "blastoise",
        why: "Seen with Sneasler cores — Water Mega that soaks Fire answers.",
      },
      {
        slug: "salamence",
        why: "Often sits on Grassy Balance hybrids as the Mega / kite wincon.",
      },
      {
        slug: "garchomp",
        why: "Ground cleaner that still shows next to Boom when Ice is patched.",
      },
    ],
    favors: [
      {
        vs: "trick-room",
        why: "Grassy Glide priority and Unburden still pressure after the room ends — or through midgame trades.",
        yourExamples: ["rillaboom", "sneasler", "kingambit"],
        theirExamples: ["farigiraf", "kingambit"],
      },
      {
        vs: "balance",
        why: "Terrain softens Earthquake cores and Glide races midrange pivots that expected a chess match.",
        yourExamples: ["rillaboom", "sneasler"],
        theirExamples: ["garchomp", "hippowdon", "corviknight"],
      },
    ],
    struggles: [
      {
        vs: "sun",
        why: "Drought Fire deletes Rillaboom and wilts the engine before Sneasler cashes.",
        yourExamples: ["charizard-mega-y", "cinderace", "talonflame"],
        theirExamples: ["charizard-mega-y", "cinderace"],
      },
      {
        vs: "hyper-offense",
        why: "Faster Fire and Mega pressure Boom on send. If the setter dies, Unburden never starts.",
        yourExamples: ["cinderace", "salamence-mega", "talonflame"],
        theirExamples: ["cinderace", "salamence-mega", "excadrill"],
      },
    ],
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

/** Guide + playbook extras (staples, answers, scripts) for Team archetype pages. */
export function getArchetypePlaybook(id: string): ArchetypePlaybookGuide | undefined {
  const base = getArchetype(id);
  if (!base) return undefined;
  return { ...base, ...PLAYBOOK_EXTRA[base.id] };
}

export function archetypeHref(id: ArchetypeId) {
  return `/team/archetypes/${id}` as const;
}

export function archetypeHubHref() {
  return "/team/archetypes" as const;
}

/** Styles that list this slug as a preview tell. */
export function tellsForSlug(slug: string) {
  const needle = slug.toLowerCase();
  return ARCHETYPES.filter((a) => a.tells.some((t) => t.slug === needle)).map((a) => ({
    style: a,
    tell: a.tells.find((t) => t.slug === needle)!,
  }));
}
