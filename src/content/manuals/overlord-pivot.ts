import { alt, train } from "@/content/manual-train";
import type {
  ManualFlow,
  ManualLineup,
  ManualNote,
  ManualPhase,
  SlotManual,
  TeamManual,
} from "@/content/manuals";

const BOX = ["garchomp", "corviknight", "kingambit", "rillaboom", "primarina", "incineroar"] as const;

function garchompSlot(roleExtra: string): SlotManual {
  return {
    slug: "garchomp",
    title: "The Breaker",
    job: "breaker",
    literacy: "sweeper",
    role: `Forces switches. Breaks walls. ${roleExtra}`,
    ability: "Rough Skin",
    item: "Life Orb",
    itemWhy:
      "You want the KO on the switch-in. Life Orb pays HP for damage. Choice Scarf is the revenge alt when their cleaner outruns you.",
    itemAlts: [
      {
        name: "Choice Scarf",
        why: "Use when their cleaner outspeeds Life Orb Garchomp and you need one locked revenge click. You give up Swords Dance and the free switch read.",
      },
      {
        name: "Focus Sash",
        why: "Use only if you must live one Ice or Fairy you already scouted. Prefer switching to the flex pivot instead.",
      },
    ],
    nature: "Jolly",
    training: train(
      0,
      32,
      0,
      0,
      2,
      32,
      {
        label: "Attack race",
        why: "Garchomp is the Speed cleaner on this spine. Cap Attack and Speed. Ice still hits four times as hard — the flex pivot owns that answer, not bulk on Garchomp.",
        spend: [
          "32 Atk — Earthquake and Fire Fang have to force the switch.",
          "32 Spe — Jolly race. Nothing on the spine doubles Speed for you.",
          "2 SpD — leftover crumb.",
          "0 HP — you are not the wall. Leave early on Ice or Fairy.",
        ],
      },
      [
        alt(
          "Choice Scarf",
          0,
          32,
          0,
          0,
          2,
          32,
          "Same points. Scarf multiplies Speed. Lock Earthquake or Fire Fang — do not lock Outrage into Fairy.",
          [
            "32 Atk — the locked click has to KO.",
            "32 Spe — Scarf is the whole race.",
            "2 SpD — leftover.",
          ],
        ),
      ],
    ),
    moves: [
      {
        name: "Earthquake",
        why: "Ground STAB. Hits Steel that panic-switch into Dragon. Does nothing to Flying or Levitate.",
      },
      {
        name: "Fire Fang",
        why: "Punishes Steel and Grass switch-ins that block Dragon. The read that makes Garchomp force panic.",
        alts: [{ name: "Fire Blast", why: "Special alt if you somehow run mixed. Prefer Fang on physical Life Orb." }],
      },
      {
        name: "Dragon Claw",
        why: "Dragon STAB that does not lock. Outrage is the nuke only after Fairy is gone.",
        alts: [
          {
            name: "Outrage",
            why: "Use when Fairy is confirmed out. A Fairy switch knocks you out while locked.",
          },
          {
            name: "Scale Shot",
            why: "Use when you need Speed stages after they Protect, and Fairy is already gone.",
          },
        ],
      },
      {
        name: "Swords Dance",
        why: "Boost into a Protect or a free switch. Never Dance into a known Ice or Fairy.",
        alts: [{ name: "Protect", why: "Scout Ice or Fairy on the first entry. Prefer the flex pivot if you already know." }],
      },
    ],
    objective: "Force switches. Break the wall. Leave Ice and Fairy to the flex pivot.",
    howToPlay:
      "Come in on Electric, Fire into a resist, or after the pivot chips.\nEarthquake grounded non-Grass. Fire Fang on Steel panic-switches.\nIce or Fairy: leave. Do not Outrage while Fairy is healthy.",
  };
}

function kingambitSlot(roleExtra: string): SlotManual {
  return {
    slug: "kingambit",
    title: "The Closer",
    job: "breaker",
    literacy: "wallbreaker",
    role: `Supreme Overlord closer. ${roleExtra}`,
    ability: "Supreme Overlord",
    item: "Black Glasses",
    itemWhy:
      "Dark STAB has to finish. Glasses stacks with Overlord after a partner falls. Life Orb is the punchier alt when you already won the chip war.",
    itemAlts: [
      {
        name: "Life Orb",
        why: "Use when you need raw damage into bulky Walls and already expect a KO trade. Recoil is real on a slow mon.",
      },
      {
        name: "Leftovers",
        why: "Use when you sit against a resist and need residual. Prefer Glasses for the close.",
      },
    ],
    nature: "Adamant",
    training: train(
      32,
      32,
      2,
      0,
      0,
      0,
      {
        label: "Overlord truck",
        why: "You are slow on purpose. Cap Attack and HP. Sucker Punch is the Speed plan — not Stat Points. Fighting is 1× (Dark weak × Steel resist) — not free, not death.",
        spend: [
          "32 Atk — Kowtow and Sucker Punch have to close.",
          "32 HP — live one hit after a partner traded.",
          "2 Def — leftover crumb.",
          "0 Spe — Sucker Punch is +1. Do not race Fighting with Speed.",
        ],
      },
      [
        alt(
          "Special chip",
          20,
          32,
          0,
          0,
          14,
          0,
          "Use when the table is special spam and Primarina is not in. Pull HP into Special Defense.",
          ["32 Atk — still the punch.", "20 HP / 14 SpD — live special chip.", "0 Spe — still the truck."],
        ),
      ],
    ),
    moves: [
      { name: "Kowtow Cleave", why: "Dark STAB that never misses. Breaks walls that stall Sucker Punch." },
      {
        name: "Sucker Punch",
        why: "Priority if they attack. Fails on Protect or status. Do not click it into a shield.",
      },
      {
        name: "Iron Head",
        why: "Steel into Fairy. Flinches sometimes — not a plan, a bonus.",
        alts: [{ name: "Swords Dance", why: "Use when you get a free turn after a KO. Overlord plus Dance ends games." }],
      },
      {
        name: "Low Kick",
        why: "Fighting coverage into their Kingambit or Normal walls. Weight matters.",
        alts: [
          { name: "Brick Break", why: "Fixed power Fighting. Screens breaker if the table runs Reflect." },
          { name: "Protect", why: "Scout Fighting priority. You take normal Fighting — leave if their Close Combat is live." },
        ],
      },
    ],
    objective: "Close after trades. Overlord scales when a partner falls. Do not lead into Fighting.",
    howToPlay:
      "Stay in the bag until Garchomp or the flex has traded.\nSucker Punch healthy sweepers that attack. Kowtow walls that Protect.\nFighting into you: leave to the flex if it answers, or Protect once to scout.",
  };
}

function corviknightSlot(): SlotManual {
  return {
    slug: "corviknight",
    title: "The Scout",
    job: "support",
    literacy: "pivot",
    role: "Blind lead. Rocky Helmet sponge. Slow U-turn into Garchomp.",
    ability: "Mirror Armor",
    item: "Rocky Helmet",
    itemWhy: "Contact into you pays HP. You are the physical scout and the Fairy/Poison/Grass emergency.",
    itemAlts: [
      { name: "Leftovers", why: "Use when you Roost and win the slot against special chip. Helmet is worse when they never make contact." },
      { name: "Occa Berry", why: "Emergency Fire live. Prefer switching to Incineroar or Primarina from the box when you can." },
    ],
    nature: "Impish",
    training: train(
      32,
      0,
      32,
      0,
      2,
      0,
      {
        label: "Physical wall, slow on purpose",
        why: "Take the hit, then U-turn after they move. Cap HP and Defense. Speed at 0 so the hand-off is safe.",
        spend: [
          "32 HP — the stay.",
          "32 Def — Impish wall. Body Press still hurts.",
          "2 SpD — leftover. Ice deals normal damage.",
          "0 Spe — slow U-turn. Fast U-turn is Ice on Garchomp.",
        ],
      },
    ),
    moves: [
      {
        name: "U-turn",
        why: "Slow hand-off into Garchomp or Kingambit after they already moved. If you outspeed Ice, do not U-turn into Garchomp — switch to a flex that resists.",
      },
      { name: "Brave Bird", why: "Grass answer. Recoil is the tax." },
      {
        name: "Roost",
        why: "Stay against a locked physical resist.",
        alts: [{ name: "Iron Defense", why: "With Body Press, two stages doubles Press. You become the wincon." }],
      },
      {
        name: "Body Press",
        why: "Defense-based Fighting. Hits Dark. Kingambit takes normal Fighting — bulky Press still hurts.",
        alts: [{ name: "Iron Head", why: "Steel into Fairy when Garchomp is down." }],
      },
    ],
    objective: "Scout, chip, Fairy answer. Leave Electric and Fire.",
    howToPlay:
      "Lead vs physical, Grass, or Poison. Steel blanks Poison. Flying blanks Ground.\nElectric and Fire leave — Garchomp for Electric, a Fire resist from the box if available.\nNever U-turn into Garchomp while faster than Ice.",
  };
}

function rillaboomSlot(): SlotManual {
  return {
    slug: "rillaboom",
    title: "The Terrain",
    job: "support",
    literacy: "pivot",
    role: "Grassy Surge lead. Priority Glide vs rain abusers. Anti-Water weapon.",
    ability: "Grassy Surge",
    item: "Assault Vest",
    itemWhy: "You walk in and the field is up. Vest lets you tank a special Water or Fire and click Glide or Wood Hammer. Choice Band is the locked nuke alt.",
    itemAlts: [
      { name: "Choice Band", why: "Lock Wood Hammer or Glide. Use when one click has to delete Barraskewda or a Water wall." },
      { name: "Grassy Seed", why: "Defense boost on entry. Unburden is not on this set — Seed is bulk, not Speed." },
      { name: "Life Orb", why: "Raw Glide damage. Recoil plus Wood Hammer recoil stacks — careful." },
    ],
    nature: "Adamant",
    training: train(
      32,
      32,
      2,
      0,
      0,
      0,
      {
        label: "Terrain truck",
        why: "Grassy Glide is priority under terrain — you do not need Speed points to outrun rain abusers. Cap Attack and HP.",
        spend: [
          "32 Atk — Glide and Wood Hammer have to KO.",
          "32 HP — live the Fire or Poison answer once.",
          "2 Def — leftover.",
          "0 Spe — Glide is +1 under Grassy Terrain.",
        ],
      },
      [
        alt(
          "Choice Band race",
          4,
          32,
          0,
          0,
          0,
          30,
          "If you lock Band and still want to move before medium-Speed Waters without Glide. Prefer Glide under terrain.",
          ["32 Atk — Band locked click.", "30 Spe — race without priority.", "4 HP — leftover."],
        ),
      ],
    ),
    moves: [
      {
        name: "Grassy Glide",
        why: "Grass priority under Grassy Terrain. Deletes Barraskewda and other rain abusers before they move.",
      },
      {
        name: "Wood Hammer",
        why: "Chunks grounded walls. Recoil is real — Grassy Terrain heals a tick after.",
      },
      {
        name: "U-turn",
        why: "Pivot into Garchomp or Kingambit when Fire or Poison walks in. Terrain still heals whoever stays grounded.",
      },
      {
        name: "Fake Out",
        why: "Flinch the first entry. Buy a free Glide or hand-off next turn.",
        alts: [
          { name: "Knock Off", why: "Strip Leftovers or Assault Vest from a wall before Garchomp breaks it." },
          { name: "High Horsepower", why: "Ground coverage into Fire that resists Grass." },
        ],
      },
    ],
    objective: "Overwrite weather. Priority-hunt Water. Pivot when Fire or Poison arrives.",
    howToPlay:
      "Lead into Rain, Water, or Ground-heavy previews.\nGlide the rain abuser under terrain. U-turn on Fire or Poison.\nDo not sit idle — force the pivot, then hand Garchomp the break.",
  };
}

function primarinaSlot(): SlotManual {
  return {
    slug: "primarina",
    title: "The Special Wall",
    job: "breaker",
    literacy: "wallbreaker",
    role: "Ice and Dragon patch. Rain sponge. Special Defense anchor.",
    ability: "Torrent",
    item: "Sitrus Berry",
    itemWhy: "You stay. Sitrus is one burst after the first hit. Leftovers is slower. Specs does not sit.",
    itemAlts: [
      { name: "Leftovers", why: "Calm Mind stay when they cannot KO. Slower than Sitrus." },
      { name: "Choice Specs", why: "One locked Moonblast or Sparkling Aria has to KO. Do not lock into Steel." },
      { name: "Mystic Water", why: "Stronger Water without locking. Still Ice Beam and Moonblast." },
    ],
    nature: "Modest",
    training: train(
      32,
      0,
      4,
      14,
      16,
      0,
      {
        label: "Special stay",
        why: "This lineup needs a Special Defense anchor — Garchomp and Kingambit lean physical. Cap HP. Split Defense and Special Defense. Special Attack gets enough for Moonblast.",
        spend: [
          "32 HP — Sitrus stay.",
          "16 SpD — live special Ice and Water in rain.",
          "14 SpA — Moonblast and Ice Beam still hurt.",
          "4 Def — crumb vs physical leftovers.",
          "0 Spe — Garchomp is the race.",
        ],
      },
      [
        alt(
          "Choice Specs",
          2,
          0,
          0,
          32,
          0,
          32,
          "Lock one click. Cap Special Attack and Speed. Do not sit.",
          ["32 SpA — the locked KO.", "32 Spe — Modest race.", "2 HP — leftover."],
        ),
      ],
    ),
    moves: [
      { name: "Moonblast", why: "Fairy STAB. Dragon and Fighting. Blanks Dragon damage into you." },
      {
        name: "Sparkling Aria",
        why: "Water STAB. Hits Fire and Ground. Heals burn on the target — useful if Incineroar burned your Garchomp earlier.",
        alts: [{ name: "Surf", why: "Stronger Water without the burn heal." }],
      },
      {
        name: "Ice Beam",
        why: "Hits their Garchomp four times as hard. Answers Dragon without sending your Garchomp into Ice.",
      },
      {
        name: "Aqua Jet",
        why: "Water priority. Revenge Fire. Kingambit resists Water — Earthquake that from Garchomp.",
        alts: [
          { name: "Calm Mind", why: "Boost when the stay is real. You give up Aqua Jet." },
          { name: "Encore", why: "Lock Protect or a setup move, then Moonblast." },
        ],
      },
    ],
    objective: "Answer Ice, Dragon, special Water. Do not sit into Grass or Poison.",
    howToPlay:
      "Lead vs Ice, Fire, Dragon, Fighting, or rain specials.\nIce Beam their dragon. Moonblast Fighting and Dragon.\nGrass or Poison: leave to Kingambit (Poison) or Garchomp carefully — prefer not sitting.",
  };
}

function incineroarSlot(): SlotManual {
  return {
    slug: "incineroar",
    title: "The Intimidate",
    job: "support",
    literacy: "pivot",
    role: "Intimidate pivot. Knock Off. Physical disruption into hyper offense.",
    ability: "Intimidate",
    item: "Rocky Helmet",
    itemWhy: "Contact plus Intimidate. Helmet chips the physical attacker you just cut. Sitrus is the stay alt.",
    itemAlts: [
      { name: "Sitrus Berry", why: "One burst heal after Fake Out or Knock. Prefer when you sit." },
      { name: "Assault Vest", why: "Special bulk into mixed tables. You lose Fake Out and Parting Shot if those are status — Vest blocks status moves." },
    ],
    nature: "Impish",
    training: train(
      32,
      2,
      32,
      0,
      0,
      0,
      {
        label: "Physical pivot",
        why: "Intimidate is free Attack cut. Cap HP and Defense. Attack gets a crumb for Knock Off and Flare Blitz.",
        spend: [
          "32 HP — the stay after Intimidate.",
          "32 Def — live the cut physical hit.",
          "2 Atk — Knock and Fake Out still register.",
          "0 Spe — Parting Shot / U-turn after they move when possible.",
        ],
      },
      [
        alt(
          "Careful special",
          32,
          0,
          4,
          0,
          30,
          0,
          "When the table is special physical hybrids. Pull Defense into Special Defense.",
          ["32 HP — still the stay.", "30 SpD — live special.", "4 Def — crumb."],
        ),
      ],
    ),
    moves: [
      { name: "Fake Out", why: "Flinch lead. Buy Intimidate value and a free Knock or Parting Shot." },
      {
        name: "Knock Off",
        why: "Strip Leftovers, Assault Vest, or Choice. Softens walls Corviknight could not break alone.",
      },
      {
        name: "Parting Shot",
        why: "Attack and SpA cut, then leave into Garchomp or Kingambit.",
        alts: [{ name: "U-turn", why: "Damage plus switch when you need chip more than the drop." }],
      },
      {
        name: "Flare Blitz",
        why: "Fire STAB into Steel and Grass walls. Recoil is real — Intimidate entry should already have cut them.",
        alts: [
          { name: "Will-O-Wisp", why: "Permanent Attack cut when you cannot risk Blitz recoil." },
          { name: "Throat Chop", why: "Dark STAB into Psychic / Ghost without recoil." },
        ],
      },
    ],
    objective: "Cut Attack, strip items, hand off. Leave Water and Ground.",
    howToPlay:
      "Lead vs hyper offense physical or bulky Steel/Grass.\nFake Out, Knock, Parting Shot into Garchomp.\nWater or Ground: leave to Garchomp (Ground blanks Electric too) or Kingambit carefully.",
  };
}

const CORE_SWITCHES = [
  {
    into: "Ice",
    send: "Corviknight. Ice deals normal damage to Steel/Flying. Never Garchomp — Ice hits Dragon/Ground four times as hard. Kingambit takes normal Ice.",
  },
  {
    into: "Fairy",
    send: "Corviknight. Steel resists Fairy. Garchomp takes double Fairy. Kingambit Iron Head if Corvi is down.",
  },
  {
    into: "Electric",
    send: "Garchomp. Ground takes no Electric. Corviknight takes double — leave immediately.",
  },
  {
    into: "Fire",
    send: "Garchomp resists Fire. Corviknight takes double — leave. Kingambit takes double Fire — do not sit.",
  },
  {
    into: "Fighting",
    send: "Corviknight Body Press trade, or Garchomp if you can threaten first. Kingambit takes normal Fighting (1×) — not free. Prefer not leading the truck into Close Combat.",
  },
  {
    into: "Ground",
    send: "Corviknight. Flying takes no Ground.",
  },
  {
    into: "Water",
    send: "Corviknight resists. Garchomp takes normal Water — not an emergency. Kingambit resists Water.",
  },
  {
    into: "Grass",
    send: "Corviknight Brave Bird. Garchomp Earthquake is resisted — do not send him to break Grass alone.",
  },
  {
    into: "Poison",
    send: "Corviknight. Steel takes no Poison. Kingambit resists Poison.",
  },
  {
    into: "Dragon",
    send: "Kingambit Iron Head, or Garchomp if you won the speed. Corviknight takes normal Dragon.",
  },
];

const CORE_PLAN = [
  {
    title: "Clock",
    goal: "Scout without donating Garchomp into Ice.",
    play: "Lead Corviknight into physical, Grass, or Poison. Lead Garchomp only into Electric. Keep Kingambit in the bag until a partner has traded or the field is soft.",
    next: "Rocky Helmet chips contact. Slow U-turn into Garchomp after they move.",
  },
  {
    title: "Shield",
    goal: "Helmet absorb, then punish the panic switch.",
    play: "Sit Corviknight into physical attackers. U-turn into Garchomp on Electric or Fire predictions. Fire Fang Steel that switch into Dragon Claw.",
    next: "Ice or Fairy onto Garchomp: back to Corviknight. Do not Outrage while Fairy is healthy.",
  },
  {
    title: "Clean",
    goal: "Kingambit closes after trades fuel Overlord.",
    play: "When Garchomp or Corviknight falls, Kingambit enters with Overlord stacks. Sucker Punch healthy attackers. Kowtow walls that Protect.",
    next: "Fighting priority still hurts. Iron Head Fairy leftovers. Do not Sucker Punch Protect.",
  },
];

const CORE_LOOPS = [
  {
    title: "Helmet, then hand-off",
    body: "Corviknight takes contact. Rocky Helmet chips. Slow U-turn into Garchomp after they already moved. Earthquake or Fire Fang the switch-in.",
  },
  {
    title: "Steel panic Fang",
    body: "Garchomp clicks Dragon. They panic into Steel. Fire Fang. The read that forces the next pivot.",
  },
  {
    title: "Overlord close",
    body: "A partner falls. Kingambit walks in with Supreme Overlord. Sucker Punch the cleaner that attacks, or Kowtow the wall that stalls.",
  },
];

const CORE_HAZARDS: ManualNote[] = [
  {
    title: "Ice into Garchomp",
    body: "Ice hits Garchomp four times as hard.",
    watch: "Ice coverage or Ice Fang on their lead.",
    play: "Send Corviknight. Do not U-turn into Garchomp while you outspeed Ice.",
    rule: "Never leave Garchomp in on known Ice.",
  },
  {
    title: "Fairy into Garchomp",
    body: "Fairy deals double to Dragon/Ground.",
    watch: "Moonblast, Play Rough, or Mimikyu still healthy.",
    play: "Corviknight resists. Iron Head from Kingambit if Corvi is down.",
    rule: "Do not Outrage while Fairy is in their bag.",
  },
  {
    title: "Fighting into Kingambit",
    body: "Fighting is 1× on Dark/Steel — not free, not death.",
    watch: "Close Combat, Mach Punch, or Fighting priority.",
    play: "Protect once to scout, or leave to Corviknight Body Press. Do not greed Kowtow into a guaranteed Fighting KO.",
    rule: "Do not lead Kingambit into a live Fighting attacker.",
  },
  {
    title: "Fire into Corviknight or Kingambit",
    body: "Both take double Fire.",
    watch: "Flare Blitz, Heat Wave, or Fire Blast.",
    play: "Garchomp resists Fire. Hand off before the KO.",
    rule: "Do not Roost Corviknight into a Fire lock.",
  },
  {
    title: "Rain / Water spam",
    body: "Core Corvi resists Water but cannot priority-hunt Barraskewda.",
    watch: "Pelipper plus a Swift Swim cleaner.",
    play: "Swap to Terrain (Rillaboom) or Special (Primarina) from the box before the series.",
    rule: "Do not stubborn Core into a known rain team.",
  },
];

const CORE_ADVANTAGES: ManualNote[] = [
  {
    title: "Physical hyper offense",
    body: "Helmet Corvi plus Overlord Kingambit loves contact spam.",
    watch: "Multiple contact Fake Out / Band attackers.",
    play: "Lead Corvi, chip, U-turn into Chomp, close with Gambit.",
    rule: "Still respect Ice coverage on those attackers.",
  },
  {
    title: "Steel walls",
    body: "Garchomp Fire Fang and Kingambit Kowtow both pressure Steel.",
    watch: "Assault Vest Steel or Leftovers walls.",
    play: "Force the switch with Dragon, Fang the Steel, or Knock with Incineroar mode.",
    rule: "Do not lock Choice Scarf Outrage into that Steel.",
  },
];

function corePhases(): ManualPhase[] {
  return [
    {
      id: "preview",
      title: "Preview",
      lede: "Name Ice and Fairy before Garchomp walks in. Kingambit stays bagged.",
      branches: [
        { when: "Physical lead, Grass, or Poison", then: "Corviknight." },
        { when: "Electric lead", then: "Garchomp. Both partners hate Electric." },
        { when: "Ice or Fairy visible", then: "Corviknight. Hide Garchomp." },
        { when: "Fighting lead", then: "Corviknight. Not Kingambit." },
        { when: "Rain / Water heavy", then: "Wrong mode. Bring Terrain or Special from the box." },
      ],
    },
    {
      id: "lead",
      title: "Lead",
      lede: "Corviknight is the blind lead. Garchomp is the Electric lead. Kingambit is not a lead.",
      branches: [
        { out: "corviknight", when: "Physical contact", then: "Stay. Helmet chips. Roost if they are locked into a resist." },
        { out: "corviknight", when: "Want Garchomp, you are slower", then: "U-turn. They hit Corvi, then Chomp is in." },
        { out: "corviknight", when: "Want Garchomp, you outspeed Ice", then: "Do not U-turn into Chomp. Stay or hard switch after scouting." },
        { out: "garchomp", when: "Electric in", then: "Earthquake if grounded." },
        { out: "garchomp", when: "Ice or Fairy coming", then: "Leave to Corviknight." },
        { out: "kingambit", when: "You led the truck", then: "Misread. Protect or Sucker Punch. Get Corvi or Chomp in." },
      ],
    },
    {
      id: "mid",
      title: "Mid",
      lede: "Helmet absorb. Punish Steel switches. Fuel Overlord without panicking.",
      branches: [
        { out: "corviknight", when: "Locked physical resist", then: "Roost or Body Press. Wall can win 3v3." },
        { out: "garchomp", when: "Steel switches in", then: "Fire Fang." },
        { out: "garchomp", when: "Fairy or Ice", then: "Corviknight." },
        { out: "kingambit", when: "A partner fainted", then: "Overlord is live. Kowtow or Sucker Punch." },
        { out: "kingambit", when: "Fighting switches in", then: "Protect or leave to Corvi." },
      ],
    },
    {
      id: "late",
      title: "Late",
      lede: "One target. Overlord closes. Chomp cleans if Ice is gone.",
      branches: [
        { out: "kingambit", when: "They attack", then: "Sucker Punch." },
        { out: "kingambit", when: "They Protect or status", then: "Kowtow or Dance. Not Sucker Punch." },
        { out: "garchomp", when: "Ice gone, grounded", then: "Earthquake." },
        { out: "garchomp", when: "Fairy still in", then: "Dragon Claw only. No Outrage." },
        { out: "corviknight", when: "Grass leftover", then: "Brave Bird." },
      ],
    },
  ];
}

function coreFlows(): ManualFlow[] {
  return [
    {
      id: "lead",
      title: "Lead",
      lede: "Preview their three. Corviknight is the blind lead. Garchomp only for Electric. Kingambit stays bagged.",
      forks: [
        {
          id: "op-lead-corvi",
          when: "Physical, Grass, Poison, or blind",
          then: "Lead Corviknight. Rocky Helmet chips contact. Scout before Garchomp enters.",
          send: "corviknight",
          why: "Because Corvi is the Fairy/Poison/Grass answer and the slow hand-off.",
          forks: [
            {
              id: "op-lead-corvi-phys",
              when: "Physical contact coming",
              then: "Stay. Take the hit. Helmet chips.",
              send: "corviknight",
              why: "Because your job is soak and scout, not a risky early Chomp entry.",
            },
            {
              id: "op-lead-corvi-uturn",
              when: "Want Garchomp, and you are slower or they switched",
              then: "U-turn into Garchomp.",
              move: "U-turn",
              send: "garchomp",
              why: "Because slow U-turn lets them hit Corvi, then Chomp enters after they moved.",
            },
            {
              id: "op-lead-corvi-ice",
              when: "Want Garchomp, but you outspeed Ice",
              then: "Do not U-turn into Garchomp.",
              send: "corviknight",
              why: "Because fast U-turn brings Chomp in before Ice — four times damage.",
            },
            {
              id: "op-lead-corvi-elec",
              when: "Electric coming",
              then: "Leave to Garchomp.",
              send: "garchomp",
              why: "Because Ground blanks Electric and Corvi takes double.",
            },
            {
              id: "op-lead-corvi-fire",
              when: "Fire coming",
              then: "Leave to Garchomp. Corvi takes double Fire.",
              send: "garchomp",
              why: "Because Garchomp resists Fire.",
            },
          ],
        },
        {
          id: "op-lead-chomp",
          when: "Electric",
          then: "Lead Garchomp. Partners both hate Electric.",
          send: "garchomp",
          why: "Because this is the only clean Garchomp lead on Core.",
          forks: [
            {
              id: "op-lead-chomp-eq",
              when: "They are grounded",
              then: "Earthquake.",
              move: "Earthquake",
              send: "garchomp",
              why: "Because you already won the type.",
            },
            {
              id: "op-lead-chomp-ice",
              when: "Ice or Fairy coming",
              then: "Leave to Corviknight.",
              send: "corviknight",
              why: "Because you mis-led if Ice or Fairy walks in.",
            },
          ],
        },
        {
          id: "op-lead-gambit",
          when: "You are tempted to lead Kingambit",
          then: "Do not. Bag the truck until a partner trades.",
          send: "corviknight",
          why: "Because Fighting and early pressure punish a naked Overlord lead.",
        },
      ],
    },
    {
      id: "mid",
      title: "Mid",
      lede: "Type sends live on the switch board. Here: locks, Steel reads, and Overlord fuel.",
      forks: [
        {
          id: "op-mid-corvi",
          when: "This Pokémon is out",
          out: "corviknight",
          forks: [
            {
              id: "op-mid-corvi-stay",
              when: "Locked into a physical resist",
              then: "Roost or Body Press. The wall can win without handing off.",
              move: "Roost",
              send: "corviknight",
              why: "Because a free heal keeps Chomp and Gambit healthy for the close.",
            },
            {
              id: "op-mid-corvi-hand",
              when: "Soft field, Ice scouted gone",
              then: "Slow U-turn into Garchomp.",
              move: "U-turn",
              send: "garchomp",
              why: "Because the breaker needs a safe entry.",
            },
          ],
        },
        {
          id: "op-mid-chomp",
          when: "This Pokémon is out",
          out: "garchomp",
          forks: [
            {
              id: "op-mid-chomp-steel",
              when: "Steel switches in on Dragon",
              then: "Fire Fang.",
              move: "Fire Fang",
              send: "garchomp",
              why: "Because Steel panic-switches are the punish loop.",
            },
            {
              id: "op-mid-chomp-fairy",
              when: "Fairy or Ice",
              then: "Leave to Corviknight.",
              send: "corviknight",
              why: "Because Chomp is 2× Fairy and 4× Ice.",
            },
            {
              id: "op-mid-chomp-dance",
              when: "You read Protect",
              then: "Swords Dance. Next hit is the KO.",
              move: "Swords Dance",
              send: "garchomp",
              why: "Because Protect gave a free turn.",
            },
          ],
        },
        {
          id: "op-mid-gambit",
          when: "This Pokémon is out",
          out: "kingambit",
          forks: [
            {
              id: "op-mid-gambit-overlord",
              when: "A partner fainted",
              then: "Kowtow or Sucker Punch. Overlord is live.",
              send: "kingambit",
              why: "Because trades are the plan, not a panic.",
            },
            {
              id: "op-mid-gambit-fight",
              when: "Fighting switches in",
              then: "Protect or leave to Corviknight.",
              send: "corviknight",
              why: "Because Fighting is 1× but Close Combat still chunks.",
            },
          ],
        },
      ],
    },
    {
      id: "late",
      title: "Late",
      lede: "Overlord closes. Chomp cleans only if Ice and Fairy are gone.",
      forks: [
        {
          id: "op-late-gambit",
          when: "This Pokémon is out",
          out: "kingambit",
          forks: [
            {
              id: "op-late-gambit-sucker",
              when: "They attack",
              then: "Sucker Punch.",
              move: "Sucker Punch",
              send: "kingambit",
              why: "Because priority wins the 1v1 scramble.",
            },
            {
              id: "op-late-gambit-kowtow",
              when: "They Protect or status",
              then: "Kowtow Cleave. Do not Sucker Punch the shield.",
              move: "Kowtow Cleave",
              send: "kingambit",
              why: "Because Sucker Punch fails on Protect.",
            },
            {
              id: "op-late-gambit-fairy",
              when: "Fairy leftover",
              then: "Iron Head.",
              move: "Iron Head",
              send: "kingambit",
              why: "Because Steel hits Fairy hard.",
            },
          ],
        },
        {
          id: "op-late-chomp",
          when: "This Pokémon is out",
          out: "garchomp",
          forks: [
            {
              id: "op-late-chomp-eq",
              when: "Grounded, Ice gone",
              then: "Earthquake.",
              move: "Earthquake",
              send: "garchomp",
              why: "Because the cleaner job is now safe.",
            },
            {
              id: "op-late-chomp-outrage",
              when: "Fairy still in",
              then: "Dragon Claw only. No Outrage.",
              move: "Dragon Claw",
              send: "garchomp",
              why: "Because a Fairy switch knocks locked Outrage out.",
            },
          ],
        },
      ],
    },
  ];
}

function lineupCore(): ManualLineup {
  const slots = [
    garchompSlot("Hide behind Corviknight until Ice and Fairy are scouted."),
    corviknightSlot(),
    kingambitSlot("Bag the truck until a partner trades."),
  ];
  return {
    id: "core",
    label: "Core",
    when: "Blind ladder / balanced foes",
    identity: "Corviknight scouts and chips. Garchomp breaks. Kingambit closes on trades.",
    slugs: ["garchomp", "corviknight", "kingambit"],
    slots,
    pilot: {
      thesis: "Corviknight buys information and Helmet chip. Garchomp forces switches and breaks. Kingambit closes after trades fuel Supreme Overlord.",
      rule: "Blind lead Corviknight. Slow U-turn into Garchomp. Ice onto Garchomp: Corviknight. Kingambit stays bagged until a partner falls or the field is soft.",
      fail: "U-turning into Garchomp while faster than Ice, leading Kingambit into Fighting, or Outrage while Fairy is healthy.",
    },
    meta: "Garchomp and Kingambit sit as the wincon spine. Corviknight is the default flex — Rocky Helmet U-turn into a Life Orb or Scarf Chomp, then Overlord closes.",
    philosophy:
      "You bring Garchomp, Corviknight, and Kingambit. Corviknight is the scout and the Fairy answer. Garchomp is the breaker — Earthquake and Fire Fang force panic switches. Kingambit is the closer — Supreme Overlord grows when a partner falls, then Sucker Punch or Kowtow ends the game. Ice hits Garchomp four times as hard — send Corviknight. Fighting into Kingambit is normal damage, not free — do not lead the truck.",
    press: ["Physical leads", "Steel walls", "Electric", "Contact spam"],
    refuse: ["Ice into Garchomp", "Fairy into Garchomp", "Fighting lead into Kingambit", "Known rain without a mode swap"],
    switches: CORE_SWITCHES,
    plan: CORE_PLAN,
    loops: CORE_LOOPS,
    hazards: CORE_HAZARDS,
    advantages: CORE_ADVANTAGES,
    victims: [
      { name: "Physical hyper offense", why: "Helmet Corvi chips contact. Overlord Kingambit loves the trades they force." },
      { name: "Steel pivots", why: "Fire Fang punishes the panic switch into Dragon." },
      { name: "Electric leads", why: "Garchomp blanks Electric. Both partners would take double." },
    ],
    counters: [
      { name: "Rain + Barraskewda", why: "Core cannot priority-hunt Swift Swim. Bring Terrain." },
      { name: "Special walls / Calm Mind", why: "Corvi is physical. Bring Special (Primarina)." },
      { name: "Bulky Grass / Steel that shrug Brave Bird", why: "Bring Intimidate (Incineroar) for Knock Off and Flare Blitz." },
    ],
    phases: corePhases(),
    flows: coreFlows(),
  };
}

function terrainSwitches() {
  return [
    {
      into: "Water",
      send: "Rillaboom. Grassy Glide under terrain outspeeds rain abusers. Garchomp takes normal Water.",
    },
    {
      into: "Fire",
      send: "Garchomp resists Fire. Rillaboom takes double — U-turn out immediately.",
    },
    {
      into: "Poison",
      send: "Kingambit resists Poison. Rillaboom takes double — leave.",
    },
    {
      into: "Ice",
      send: "Rillaboom takes half Ice. Never Garchomp — 4× Ice. Kingambit takes normal Ice.",
    },
    {
      into: "Fairy",
      send: "Kingambit Iron Head. Garchomp takes double Fairy. Rillaboom takes normal Fairy.",
    },
    {
      into: "Electric",
      send: "Garchomp. Ground blanks Electric. Rillaboom takes normal Electric.",
    },
    {
      into: "Flying",
      send: "Kingambit or Garchomp Dragon/Rock coverage. Rillaboom Glide does nothing useful into Flying resists — Wood Hammer is resisted by Flying.",
    },
    {
      into: "Ground",
      send: "Rillaboom. Grassy Terrain cuts Earthquake damage. Garchomp is fine on offense.",
    },
  ];
}

function lineupTerrain(): ManualLineup {
  return {
    id: "terrain",
    label: "Terrain",
    when: "Rain, Water spam, weather wars, Ground chip",
    identity: "Rillaboom overwrites the field and priority-hunts Water. Garchomp and Kingambit still close.",
    slugs: ["garchomp", "rillaboom", "kingambit"],
    slots: [
      garchompSlot("Enter after Glide chips or U-turn. Ice still leaves to Rillaboom."),
      rillaboomSlot(),
      kingambitSlot("Same closer — trades from Rillaboom still fuel Overlord."),
    ],
    pilot: {
      thesis: "Rillaboom sets Grassy Terrain on entry, hunts rain abusers with Grassy Glide, then hands Garchomp the break. Kingambit still closes.",
      rule: "Lead Rillaboom into Rain or Water. Glide under terrain. U-turn on Fire or Poison. Ice onto Garchomp: Rillaboom resists.",
      fail: "Sitting Rillaboom into Fire, or bringing Core Corvi into a known rain team you already scouted.",
    },
    meta: "Swap Corviknight for Rillaboom when weather and Water are the problem. You lose the physical Steel wall — play more aggressively.",
    philosophy:
      "Same spine: Garchomp breaks, Kingambit closes. Rillaboom replaces Corviknight to own the field. Grassy Surge overwrites rain and sun on entry. Grassy Glide becomes priority — Barraskewda does not get the turn. Wood Hammer chunks grounded walls. Without Corvi you do not sponge physical as well — trade harder into Overlord.",
    press: ["Rain", "Water", "Ground chip", "Weather setters"],
    refuse: ["Fire into Rillaboom", "Poison into Rillaboom", "Ice into Garchomp"],
    switches: terrainSwitches(),
    plan: [
      {
        title: "Clock",
        goal: "Terrain up before their weather dictates.",
        play: "Lead Rillaboom into Water, Rain, or Ground-heavy. Fake Out if available, then Glide the abuser.",
        next: "Fire or Poison: U-turn into Garchomp or Kingambit while terrain ticks heal.",
      },
      {
        title: "Shield",
        goal: "Priority hunt, then break.",
        play: "Glide keeps Water from sweeping. Hand Garchomp Earthquake or Fire Fang once the rain threat is soft.",
        next: "Ice onto Garchomp: Rillaboom. Fairy: Kingambit Iron Head.",
      },
      {
        title: "Clean",
        goal: "Aggressive close without Corvi's wall.",
        play: "Wood Hammer into remaining anchors. Kingambit Overlord after trades. Sucker Punch leftovers.",
        next: "You play shorter games — do not stall.",
      },
    ],
    loops: [
      {
        title: "Surge, then Glide",
        body: "Rillaboom enters. Terrain overwrites rain. Grassy Glide deletes the Swift Swim cleaner before it moves.",
      },
      {
        title: "Chip, then Chomp",
        body: "U-turn from Rillaboom into Garchomp while terrain heals. Earthquake the softened field.",
      },
      {
        title: "Overlord still closes",
        body: "Rillaboom or Garchomp falls. Kingambit walks in stacked. Same Sucker / Kowtow endgame.",
      },
    ],
    hazards: [
      {
        title: "Fire into Rillaboom",
        body: "Fire deals double to Grass.",
        watch: "Fire Blast, Flare Blitz, or Drought.",
        play: "U-turn to Garchomp. Do not Wood Hammer the Fire type.",
        rule: "Never sit Rillaboom into known Fire.",
      },
      {
        title: "Ice into Garchomp",
        body: "Still 4×.",
        watch: "Ice Beam on rain teams.",
        play: "Rillaboom resists Ice. Hand off.",
        rule: "Terrain mode does not make Garchomp Ice-proof.",
      },
      {
        title: "Flying / Levitate",
        body: "Earthquake and Glide lose targets.",
        watch: "Corviknight or Zapdos.",
        play: "Kingambit Iron Head / Kowtow, or Garchomp Dragon coverage.",
        rule: "Do not click Earthquake into Flying.",
      },
    ],
    advantages: [
      {
        title: "Rain teams",
        body: "Terrain overwrite plus Glide priority.",
        watch: "Pelipper + Barraskewda / Archaludon.",
        play: "Lead Rillaboom. Glide the cleaner. Chomp or Gambit finish.",
        rule: "Respect Ice coverage on the rain team.",
      },
    ],
    victims: [
      { name: "Rain offense", why: "Grassy Surge deletes their weather. Glide deletes their cleaner." },
      { name: "Water walls", why: "Wood Hammer and Glide chunk Water that Corvi only resisted." },
    ],
    counters: [
      { name: "Fire spam", why: "No Corvi. Garchomp is the Fire resist — do not mis-lead Rillaboom." },
      { name: "Poison", why: "Rillaboom takes double. Kingambit is the switch." },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        branches: [
          { when: "Rain or Water heavy", then: "Rillaboom." },
          { when: "Fire lead", then: "Garchomp. Not Rillaboom." },
          { when: "Poison lead", then: "Kingambit or Garchomp — not Rillaboom." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        branches: [
          { out: "rillaboom", when: "Rain abuser in", then: "Grassy Glide under terrain." },
          { out: "rillaboom", when: "Fire coming", then: "U-turn to Garchomp." },
          { out: "garchomp", when: "Electric or Fire", then: "Stay. Earthquake or threaten." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { out: "rillaboom", when: "Wall grounded", then: "Wood Hammer." },
          { out: "garchomp", when: "Steel switch", then: "Fire Fang." },
          { out: "kingambit", when: "Partner down", then: "Overlord close." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { out: "kingambit", when: "They attack", then: "Sucker Punch." },
          { out: "garchomp", when: "Ice gone", then: "Earthquake." },
          { out: "rillaboom", when: "Water leftover", then: "Glide." },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Terrain lead into Rain and Water. Hide Rillaboom from Fire.",
        forks: [
          {
            id: "op-t-lead-rilla",
            when: "Rain, Water, or Ground-heavy",
            then: "Lead Rillaboom. Terrain is up on entry.",
            send: "rillaboom",
            why: "Because Grassy Surge overwrites their weather and enables Glide.",
            forks: [
              {
                id: "op-t-lead-glide",
                when: "Rain abuser in",
                then: "Grassy Glide.",
                move: "Grassy Glide",
                send: "rillaboom",
                why: "Because priority under terrain beats Swift Swim Speed.",
              },
              {
                id: "op-t-lead-fire",
                when: "Fire coming",
                then: "U-turn to Garchomp.",
                move: "U-turn",
                send: "garchomp",
                why: "Because Grass takes double Fire.",
              },
              {
                id: "op-t-lead-poison",
                when: "Poison coming",
                then: "Leave to Kingambit.",
                send: "kingambit",
                why: "Because Steel resists Poison.",
              },
            ],
          },
          {
            id: "op-t-lead-chomp",
            when: "Fire or Electric",
            then: "Lead Garchomp.",
            send: "garchomp",
            why: "Because Rillaboom hates Fire and Chomp blanks Electric.",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Hunt Water. Hand the break. Fuel Overlord.",
        forks: [
          {
            id: "op-t-mid-rilla",
            when: "This Pokémon is out",
            out: "rillaboom",
            forks: [
              {
                id: "op-t-mid-hammer",
                when: "Grounded wall",
                then: "Wood Hammer.",
                move: "Wood Hammer",
                send: "rillaboom",
                why: "Because you are clearing the path for Chomp without Corvi's Press.",
              },
              {
                id: "op-t-mid-uturn",
                when: "Soft Water, want Chomp",
                then: "U-turn into Garchomp.",
                move: "U-turn",
                send: "garchomp",
                why: "Because terrain still heals the grounded entry.",
              },
            ],
          },
          {
            id: "op-t-mid-chomp",
            when: "This Pokémon is out",
            out: "garchomp",
            forks: [
              {
                id: "op-t-mid-fang",
                when: "Steel switches in",
                then: "Fire Fang.",
                move: "Fire Fang",
                send: "garchomp",
                why: "Same punish loop as Core.",
              },
              {
                id: "op-t-mid-ice",
                when: "Ice",
                then: "Leave to Rillaboom.",
                send: "rillaboom",
                why: "Grass resists Ice. Chomp is 4×.",
              },
            ],
          },
          {
            id: "op-t-mid-gambit",
            when: "This Pokémon is out",
            out: "kingambit",
            forks: [
              {
                id: "op-t-mid-overlord",
                when: "Partner fainted",
                then: "Kowtow or Sucker Punch.",
                send: "kingambit",
                why: "Trades still fuel the close.",
              },
            ],
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Aggressive finish. No Corvi stall.",
        forks: [
          {
            id: "op-t-late-gambit",
            when: "This Pokémon is out",
            out: "kingambit",
            forks: [
              {
                id: "op-t-late-sucker",
                when: "They attack",
                then: "Sucker Punch.",
                move: "Sucker Punch",
                send: "kingambit",
                why: "Priority close.",
              },
            ],
          },
          {
            id: "op-t-late-rilla",
            when: "This Pokémon is out",
            out: "rillaboom",
            forks: [
              {
                id: "op-t-late-glide",
                when: "Water leftover",
                then: "Grassy Glide.",
                move: "Grassy Glide",
                send: "rillaboom",
                why: "Finish the rain piece.",
              },
            ],
          },
        ],
      },
    ],
  };
}

function lineupSpecial(): ManualLineup {
  return {
    id: "special",
    label: "Special",
    when: "Special attackers, Ice/Dragon pressure, rain check without terrain",
    identity: "Primarina is the special wall and Ice answer. Garchomp and Kingambit stay the spine.",
    slugs: ["garchomp", "primarina", "kingambit"],
    slots: [
      garchompSlot("Enter on Electric or after Primarina softens Ice. Fairy leaves to Kingambit Iron Head."),
      primarinaSlot(),
      kingambitSlot("Fairy answer when Primarina is down. Still the Overlord closer."),
    ],
    pilot: {
      thesis: "Primarina soaks special Water, Ice, and Dragon. Moonblast and Ice Beam patch what Garchomp cannot sit. Kingambit still closes.",
      rule: "Lead Primarina into Ice, Fire, Dragon, Fighting, or rain specials. Lead Garchomp into Electric. Ice onto Garchomp: Primarina.",
      fail: "Leading Garchomp into Ice, or sitting Primarina into Grass or Poison.",
    },
    meta: "Swap Corviknight for Primarina when special damage and Ice are the problem. You lose Helmet chip — gain a Fairy STAB and Aqua Jet.",
    philosophy:
      "Same spine. Primarina replaces Corviknight as the flex wall — Special Defense, Ice resist, Fairy STAB. Rain Water hits her for resisted damage even without terrain. Ice Beam answers their Garchomp. Kingambit Iron Head is the Fairy backup when Primarina falls. You no longer sponge pure physical as well — respect Band attackers.",
    press: ["Special attackers", "Dragon", "Ice pressure", "Rain specials"],
    refuse: ["Grass into Primarina", "Poison into Primarina", "Ice into Garchomp", "Electric into Primarina"],
    switches: [
      {
        into: "Ice",
        send: "Primarina. Water/Fairy takes half Ice. Never Garchomp.",
      },
      {
        into: "Fire",
        send: "Primarina. Water resists Fire. Garchomp also resists — Primarina if you need the special stay.",
      },
      {
        into: "Dragon",
        send: "Primarina. Fairy takes no Dragon. Moonblast hits back.",
      },
      {
        into: "Fairy",
        send: "Kingambit Iron Head. Garchomp takes double. Primarina is Fairy — stay only if you already won.",
      },
      {
        into: "Electric",
        send: "Garchomp. Primarina takes double Electric.",
      },
      {
        into: "Fighting",
        send: "Primarina Moonblast. Kingambit takes normal Fighting — not the lead.",
      },
      {
        into: "Grass",
        send: "Kingambit or Garchomp carefully. Primarina takes double Grass — leave.",
      },
      {
        into: "Poison",
        send: "Kingambit. Steel resists. Primarina takes double — leave.",
      },
      {
        into: "Water",
        send: "Primarina. Resists Water even in rain. Kingambit also resists.",
      },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Patch Ice and special before Chomp enters.",
        play: "Lead Primarina into Ice, Fire, Dragon, Fighting, or rain specials. Lead Garchomp only into Electric.",
        next: "Moonblast or Ice Beam first turn. Hand off only after Ice is soft.",
      },
      {
        title: "Shield",
        goal: "Special stay, then break.",
        play: "Sitrus Primarina sits Calm Mind or Encore when safe. Garchomp Earthquake after Ice leaves. Fairy: Kingambit Iron Head.",
        next: "Grass or Poison onto Primarina: Kingambit immediately.",
      },
      {
        title: "Clean",
        goal: "Chomp or Overlord finishes.",
        play: "Aqua Jet revenge Fire. Kingambit Sucker Punch after trades. Garchomp cleans grounded leftovers.",
        next: "Outrage only if Fairy is confirmed gone.",
      },
    ],
    loops: [
      {
        title: "Ice Beam the dragon",
        body: "Primarina answers their Garchomp or Dragonite with Ice Beam without sending your own Chomp into Ice.",
      },
      {
        title: "Moonblast, then Chomp",
        body: "Fairy deletes Fighting or Dragon. Switch to Garchomp on Electric or a soft physical leftover.",
      },
      {
        title: "Overlord close",
        body: "Same truck endgame. Primarina trades still stack Supreme Overlord.",
      },
    ],
    hazards: [
      {
        title: "Grass into Primarina",
        body: "Grass deals double to Water/Fairy.",
        watch: "Rillaboom, Kartana, or Leaf Storm.",
        play: "Leave to Kingambit. Do not Calm Mind into Grass.",
        rule: "Never sit Primarina into known Grass.",
      },
      {
        title: "Poison into Primarina",
        body: "Poison deals double.",
        watch: "Sludge Bomb or Gunk Shot.",
        play: "Kingambit. Steel resists.",
        rule: "Poison is an emergency leave.",
      },
      {
        title: "Ice into Garchomp",
        body: "Still 4×.",
        watch: "Ice Beam after they force a switch.",
        play: "Primarina. She resists Ice.",
        rule: "Special mode exists to stop this donate.",
      },
    ],
    advantages: [
      {
        title: "Special hyper offense",
        body: "Primarina is the SpD anchor the spine lacked.",
        watch: "Choice Specs specials or Calm Mind sweepers.",
        play: "Lead Primarina. Sitrus stay. Hand Chomp or Gambit the KO.",
        rule: "Still respect Grass coverage.",
      },
      {
        title: "Rain without Barraskewda",
        body: "Primarina resists Water; Ice Beam answers Dragons on rain teams.",
        watch: "Pelipper + special Water.",
        play: "Lead Primarina. Sparkling Aria. Save Terrain mode for priority Swift Swim.",
        rule: "If Barraskewda is in, prefer Terrain.",
      },
    ],
    victims: [
      { name: "Dragon cores", why: "Moonblast blanks Dragon. Ice Beam hits Ice-weak dragons." },
      { name: "Special attackers", why: "Sitrus Primarina is the SpD wall Garchomp and Kingambit are not." },
    ],
    counters: [
      { name: "Grass", why: "Primarina takes double. Kingambit must answer." },
      { name: "Band physical without Corvi", why: "You lost Helmet. Play tighter leads." },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        branches: [
          { when: "Ice, Fire, Dragon, Fighting, rain special", then: "Primarina." },
          { when: "Electric", then: "Garchomp." },
          { when: "Grass or Poison", then: "Kingambit — not Primarina." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        branches: [
          { out: "primarina", when: "Ice or their Garchomp", then: "Ice Beam." },
          { out: "primarina", when: "Dragon or Fighting", then: "Moonblast." },
          { out: "primarina", when: "Grass or Poison", then: "Leave to Kingambit." },
          { out: "garchomp", when: "Electric", then: "Earthquake." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { out: "primarina", when: "Can stay", then: "Calm Mind or Encore, then Moonblast." },
          { out: "garchomp", when: "Ice soft", then: "Earthquake / Fire Fang." },
          { out: "kingambit", when: "Fairy in", then: "Iron Head." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { out: "kingambit", when: "They attack", then: "Sucker Punch." },
          { out: "primarina", when: "Fire revenge", then: "Aqua Jet." },
          { out: "garchomp", when: "Ice and Fairy gone", then: "Earthquake or Outrage." },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Primarina patches Ice and special. Garchomp only for Electric.",
        forks: [
          {
            id: "op-s-lead-prima",
            when: "Ice, Fire, Dragon, Fighting, or rain special",
            then: "Lead Primarina.",
            send: "primarina",
            why: "Because she is the SpD patch and Ice answer.",
            forks: [
              {
                id: "op-s-lead-ice",
                when: "Ice or their dragon",
                then: "Ice Beam.",
                move: "Ice Beam",
                send: "primarina",
                why: "Four times on Garchomp without sending yours.",
              },
              {
                id: "op-s-lead-moon",
                when: "Dragon or Fighting",
                then: "Moonblast.",
                move: "Moonblast",
                send: "primarina",
                why: "Fairy blanks Dragon and hurts Fighting.",
              },
              {
                id: "op-s-lead-grass",
                when: "Grass or Poison",
                then: "Leave to Kingambit.",
                send: "kingambit",
                why: "Primarina takes double from both.",
              },
              {
                id: "op-s-lead-elec",
                when: "Electric",
                then: "Leave to Garchomp.",
                send: "garchomp",
                why: "Water/Fairy takes double Electric.",
              },
            ],
          },
          {
            id: "op-s-lead-chomp",
            when: "Electric",
            then: "Lead Garchomp.",
            send: "garchomp",
            why: "Both partners hate Electric; Ground blanks it.",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Stay special. Hand the break when Ice is soft.",
        forks: [
          {
            id: "op-s-mid-prima",
            when: "This Pokémon is out",
            out: "primarina",
            forks: [
              {
                id: "op-s-mid-cm",
                when: "Physical wall sitting, Sitrus live",
                then: "Calm Mind, then Moonblast.",
                move: "Calm Mind",
                send: "primarina",
                why: "Boost wins the sit without donating Chomp early.",
              },
              {
                id: "op-s-mid-leave",
                when: "Ice soft, want breaker",
                then: "Switch to Garchomp on a free turn.",
                send: "garchomp",
                why: "Chomp finishes what Primarina softened.",
              },
            ],
          },
          {
            id: "op-s-mid-chomp",
            when: "This Pokémon is out",
            out: "garchomp",
            forks: [
              {
                id: "op-s-mid-ice",
                when: "Ice",
                then: "Leave to Primarina.",
                send: "primarina",
                why: "4× Ice is why this mode exists.",
              },
              {
                id: "op-s-mid-fairy",
                when: "Fairy",
                then: "Leave to Kingambit.",
                send: "kingambit",
                why: "Iron Head answers Fairy; Primarina is Fairy herself.",
              },
            ],
          },
          {
            id: "op-s-mid-gambit",
            when: "This Pokémon is out",
            out: "kingambit",
            forks: [
              {
                id: "op-s-mid-iron",
                when: "Fairy in",
                then: "Iron Head.",
                move: "Iron Head",
                send: "kingambit",
                why: "Steel into Fairy.",
              },
              {
                id: "op-s-mid-overlord",
                when: "Partner down",
                then: "Sucker Punch or Kowtow.",
                send: "kingambit",
                why: "Overlord close.",
              },
            ],
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Aqua Jet revenge. Overlord or Chomp finishes.",
        forks: [
          {
            id: "op-s-late-prima",
            when: "This Pokémon is out",
            out: "primarina",
            forks: [
              {
                id: "op-s-late-jet",
                when: "Fire would move first",
                then: "Aqua Jet.",
                move: "Aqua Jet",
                send: "primarina",
                why: "Only priority on this three besides Sucker Punch.",
              },
            ],
          },
          {
            id: "op-s-late-gambit",
            when: "This Pokémon is out",
            out: "kingambit",
            forks: [
              {
                id: "op-s-late-sucker",
                when: "They attack",
                then: "Sucker Punch.",
                move: "Sucker Punch",
                send: "kingambit",
                why: "Priority close.",
              },
            ],
          },
        ],
      },
    ],
  };
}

function lineupIntimidate(): ManualLineup {
  return {
    id: "intimidate",
    label: "Intimidate",
    when: "Hyper offense physical, Knock Off value, Steel/Grass walls",
    identity: "Incineroar cuts Attack and strips items. Garchomp and Kingambit cash the soft field.",
    slugs: ["garchomp", "incineroar", "kingambit"],
    slots: [
      garchompSlot("Enter after Parting Shot or Knock. Ice is weaker without Corvi — scout harder."),
      incineroarSlot(),
      kingambitSlot("Knock Off into Kowtow. Overlord after Incineroar trades."),
    ],
    pilot: {
      thesis: "Incineroar Intimidates, Fake Outs, and Knocks. Parting Shot hands Garchomp or Kingambit a softer attacker. Same Overlord close.",
      rule: "Lead Incineroar into physical HO or bulky Steel/Grass. Fake Out, Knock, Parting Shot into Garchomp. Water or Ground: leave.",
      fail: "Sitting Incineroar into Water or Ground, or treating Intimidate as Ice protection for Garchomp — it is not.",
    },
    meta: "Swap Corviknight for Incineroar when you need Intimidate and Knock Off more than Helmet Fairy resists. Fairy answer shifts to Kingambit Iron Head.",
    philosophy:
      "Same spine. Incineroar replaces Corviknight as the flex pivot — Intimidate on entry, Fake Out, Knock Off, Parting Shot. You break walls Corvi only chipped. You lose Steel's Fairy resist on the pivot — Kingambit Iron Head owns Fairy. Ice onto Garchomp is scarier without Corvi; scout before the hand-off.",
    press: ["Physical HO", "Leftovers walls", "Steel", "Grass"],
    refuse: ["Water into Incineroar", "Ground into Incineroar", "Ice into Garchomp unscouted", "Fairy without Iron Head ready"],
    switches: [
      {
        into: "Water",
        send: "Kingambit resists Water. Garchomp takes normal. Incineroar takes double — leave.",
      },
      {
        into: "Ground",
        send: "Garchomp is fine offensively; Incineroar takes double Ground — leave. Flying is gone without Corvi.",
      },
      {
        into: "Fairy",
        send: "Kingambit Iron Head. Garchomp takes double. Incineroar takes normal Fairy.",
      },
      {
        into: "Ice",
        send: "Incineroar takes half Ice. Never Garchomp. Scout before any U-turn or Parting Shot into Chomp.",
      },
      {
        into: "Fighting",
        send: "Incineroar resists Fighting. Kingambit takes normal — prefer Incineroar.",
      },
      {
        into: "Electric",
        send: "Garchomp. Incineroar takes normal Electric.",
      },
      {
        into: "Dragon",
        send: "Kingambit Iron Head or Garchomp if speed won. Incineroar takes normal Dragon.",
      },
      {
        into: "Grass",
        send: "Incineroar Flare Blitz. Garchomp Earthquake is resisted — prefer the cat.",
      },
      {
        into: "Steel",
        send: "Incineroar Flare Blitz or Knock, then Garchomp Fire Fang.",
      },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Intimidate and strip before the break.",
        play: "Lead Incineroar into physical HO or Steel/Grass walls. Fake Out, Knock Off, Parting Shot into Garchomp.",
        next: "Water or Ground: leave immediately. Do not greed Blitz.",
      },
      {
        title: "Shield",
        goal: "Cut Attack, then punish.",
        play: "Intimidate stacks with Helmet if you run it. Will-O-Wisp if Blitz is too risky. Hand Chomp Fire Fang on Steel.",
        next: "Ice scout before Parting Shot into Garchomp. Fairy: Kingambit.",
      },
      {
        title: "Clean",
        goal: "Soft field into Overlord.",
        play: "Knocked walls fall to Kowtow. Sucker Punch HO leftovers. Garchomp cleans Electric and grounded.",
        next: "You play for trades — Incineroar falling still fuels Overlord.",
      },
    ],
    loops: [
      {
        title: "Fake Out, Knock, Part",
        body: "Incineroar leads. Flinch. Strip the item. Parting Shot into Garchomp on a −1 attacker.",
      },
      {
        title: "Blitz the wall",
        body: "Flare Blitz Steel or Grass that shrugged Corvi. Recoil is fine if Knock already landed.",
      },
      {
        title: "Overlord close",
        body: "Same truck. Incineroar trades are Overlord fuel.",
      },
    ],
    hazards: [
      {
        title: "Water into Incineroar",
        body: "Water deals double to Fire/Dark.",
        watch: "Rain or Surf.",
        play: "Kingambit or Garchomp. Prefer Terrain/Special modes for rain series.",
        rule: "Never sit the cat into Water.",
      },
      {
        title: "Ground into Incineroar",
        body: "Ground deals double.",
        watch: "Earthquake.",
        play: "Leave to Garchomp. You lost Corvi's Flying immunity.",
        rule: "Ground is an emergency leave.",
      },
      {
        title: "Ice into Garchomp",
        body: "No Corvi resist. Incineroar resists Ice — use it.",
        watch: "Ice Fang after Parting Shot.",
        play: "Do not Part into Chomp until Ice is scouted. Send Incineroar into Ice.",
        rule: "Intimidate does not reduce Ice damage.",
      },
      {
        title: "Fairy without Iron Head",
        body: "You lost Corvi's Steel resist on the pivot.",
        watch: "Moonblast.",
        play: "Kingambit Iron Head is mandatory coverage this mode.",
        rule: "Do not bag Gambit while Fairy cleans Chomp.",
      },
    ],
    advantages: [
      {
        title: "Band hyper offense",
        body: "Intimidate plus Fake Out stalls their clock.",
        watch: "Multiple Band contact attackers.",
        play: "Lead Incineroar. Cut, Knock, Part into Chomp or Gambit.",
        rule: "Scout Ice before the Chomp hand-off.",
      },
      {
        title: "Leftovers / Vest walls",
        body: "Knock Off removes the stay item Corvi could not.",
        watch: "Assault Vest Steel or Leftovers tanks.",
        play: "Knock, then Flare Blitz or Chomp Fang.",
        rule: "Do not Blitz into a Water absorb.",
      },
    ],
    victims: [
      { name: "Physical HO", why: "Intimidate and Fake Out wreck contact offense." },
      { name: "Item-reliant walls", why: "Knock Off turns Leftovers and Vest into paper." },
    ],
    counters: [
      { name: "Rain / Water", why: "Cat hates Water. Bring Terrain or Special." },
      { name: "Ground spam", why: "No Flying immunity. Chomp must answer." },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        branches: [
          { when: "Physical HO or Steel/Grass wall", then: "Incineroar." },
          { when: "Water or Ground lead", then: "Garchomp or Kingambit — not Incineroar." },
          { when: "Electric", then: "Garchomp." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        branches: [
          { out: "incineroar", when: "Physical", then: "Fake Out, then Knock or Part." },
          { out: "incineroar", when: "Water or Ground", then: "Leave immediately." },
          { out: "garchomp", when: "Electric", then: "Earthquake." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { out: "incineroar", when: "Wall with item", then: "Knock Off, then Blitz or Part." },
          { out: "garchomp", when: "Steel switch", then: "Fire Fang." },
          { out: "kingambit", when: "Fairy", then: "Iron Head." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { out: "kingambit", when: "They attack", then: "Sucker Punch." },
          { out: "garchomp", when: "Soft field", then: "Earthquake." },
          { out: "incineroar", when: "−1 attacker leftover", then: "Parting Shot into Gambit or Chomp." },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Intimidate lead into physical. Hide the cat from Water and Ground.",
        forks: [
          {
            id: "op-i-lead-incin",
            when: "Physical HO, Steel, or Grass",
            then: "Lead Incineroar. Intimidate on entry.",
            send: "incineroar",
            why: "Because Attack cut plus Fake Out wins the opener.",
            forks: [
              {
                id: "op-i-lead-fake",
                when: "They are physical",
                then: "Fake Out.",
                move: "Fake Out",
                send: "incineroar",
                why: "Free turn into Knock or Part.",
              },
              {
                id: "op-i-lead-knock",
                when: "They hold a stay item",
                then: "Knock Off.",
                move: "Knock Off",
                send: "incineroar",
                why: "Strip Leftovers or Vest before Chomp breaks.",
              },
              {
                id: "op-i-lead-part",
                when: "Want Garchomp on a −1 attacker",
                then: "Parting Shot into Garchomp.",
                move: "Parting Shot",
                send: "garchomp",
                why: "Attack and SpA drop plus a free hand-off.",
              },
              {
                id: "op-i-lead-water",
                when: "Water or Ground",
                then: "Leave. Cat takes double.",
                send: "kingambit",
                why: "Kingambit resists Water; Chomp answers Ground offensively.",
              },
            ],
          },
          {
            id: "op-i-lead-chomp",
            when: "Electric",
            then: "Lead Garchomp.",
            send: "garchomp",
            why: "Ground blanks Electric.",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Strip, cut, hand off. Scout Ice before Chomp.",
        forks: [
          {
            id: "op-i-mid-incin",
            when: "This Pokémon is out",
            out: "incineroar",
            forks: [
              {
                id: "op-i-mid-blitz",
                when: "Steel or Grass wall, Knock done",
                then: "Flare Blitz.",
                move: "Flare Blitz",
                send: "incineroar",
                why: "Fire STAB breaks what Corvi only chipped.",
              },
              {
                id: "op-i-mid-ice",
                when: "Want Chomp but Ice unscouted",
                then: "Stay or Part only into Kingambit. Do not donate Chomp.",
                send: "kingambit",
                why: "No Corvi Ice sponge. Incineroar resists Ice.",
              },
            ],
          },
          {
            id: "op-i-mid-chomp",
            when: "This Pokémon is out",
            out: "garchomp",
            forks: [
              {
                id: "op-i-mid-fang",
                when: "Steel switches in",
                then: "Fire Fang.",
                move: "Fire Fang",
                send: "garchomp",
                why: "Same punish loop.",
              },
              {
                id: "op-i-mid-fairy",
                when: "Fairy",
                then: "Leave to Kingambit.",
                send: "kingambit",
                why: "Iron Head is the Fairy answer this mode.",
              },
            ],
          },
          {
            id: "op-i-mid-gambit",
            when: "This Pokémon is out",
            out: "kingambit",
            forks: [
              {
                id: "op-i-mid-iron",
                when: "Fairy",
                then: "Iron Head.",
                move: "Iron Head",
                send: "kingambit",
                why: "You lost Corvi Steel resist on the pivot.",
              },
              {
                id: "op-i-mid-overlord",
                when: "Partner down",
                then: "Sucker Punch or Kowtow.",
                send: "kingambit",
                why: "Overlord close.",
              },
            ],
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Soft field. Overlord or Chomp finishes.",
        forks: [
          {
            id: "op-i-late-gambit",
            when: "This Pokémon is out",
            out: "kingambit",
            forks: [
              {
                id: "op-i-late-sucker",
                when: "They attack",
                then: "Sucker Punch.",
                move: "Sucker Punch",
                send: "kingambit",
                why: "Priority close.",
              },
            ],
          },
          {
            id: "op-i-late-chomp",
            when: "This Pokémon is out",
            out: "garchomp",
            forks: [
              {
                id: "op-i-late-eq",
                when: "Grounded, Ice scouted gone",
                then: "Earthquake.",
                move: "Earthquake",
                send: "garchomp",
                why: "Cleaner job.",
              },
            ],
          },
        ],
      },
    ],
  };
}

export const OVERLORD_PIVOT_MANUAL: TeamManual = (() => {
  const core = lineupCore();
  const lineups = [core, lineupTerrain(), lineupSpecial(), lineupIntimidate()];
  return {
    id: "balance-garchomp-corviknight-kingambit",
    title: "Overlord Pivot",
    lede: "Garchomp breaks. Kingambit closes on trades. The third slot is a flex pivot — Corviknight by default, or Rillaboom, Primarina, or Incineroar when the matchup demands it.",
    philosophy: core.philosophy!,
    archetype: "balance",
    family: "clock",
    pilot: core.pilot,
    slugs: core.slugs,
    meta: core.meta!,
    press: core.press,
    refuse: core.refuse,
    switches: core.switches,
    plan: core.plan,
    skills: ["U-turn", "Sucker Punch", "Earthquake"],
    relatedLessons: ["preview", "types", "turns"],
    setsNote:
      "Each Pokémon spends 66 Stat Points at Level 50. Cap is 32 in one stat. Garchomp races Attack and Speed. Kingambit caps Attack and HP with 0 Speed — Sucker Punch is the race. The flex pivot spends bulk: Corviknight and Incineroar on Defense, Primarina on HP/SpD, Rillaboom on Attack/HP for Glide.",
    victims: core.victims,
    counters: core.counters,
    advantages: core.advantages,
    slots: core.slots,
    phases: core.phases!,
    flows: core.flows,
    loops: core.loops,
    hazards: core.hazards,
    box: [...BOX],
    lineups,
  };
})();
