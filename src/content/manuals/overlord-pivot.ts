import { alt, train } from "@/content/manual-train";
import type {
  ManualFlow,
  ManualNote,
  ManualPack,
  ManualPhase,
  SlotManual,
  TeamManual,
} from "@/content/manuals";

const BOX = [
  "garchomp",
  "corviknight",
  "kingambit",
  "primarina",
  "meowscarada",
  "rotom-wash",
] as const;

const CORE: [string, string, string] = ["garchomp", "corviknight", "kingambit"];

function garchompSlot(): SlotManual {
  return {
    slug: "garchomp",
    title: "The Breaker",
    job: "breaker",
    literacy: "sweeper",
    role: "Forces switches. Breaks walls. Hide until Ice and Fairy are scouted.",
    ability: "Rough Skin",
    item: "Life Orb",
    itemWhy: "KO on the switch-in. Choice Scarf is the revenge alt when their cleaner outruns you.",
    itemAlts: [
      {
        name: "Choice Scarf",
        why: "Lock one revenge click when their cleaner outspeeds Life Orb Garchomp.",
      },
      { name: "Focus Sash", why: "Live one Ice or Fairy you already scouted. Prefer the flex that answers it." },
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
        why: "Cap Attack and Speed. Ice is still four times — flex owns that answer, not bulk here.",
        spend: [
          "32 Atk — Earthquake and Fire Fang force the switch.",
          "32 Spe — Jolly race.",
          "2 SpD — leftover.",
          "0 HP — leave early on Ice or Fairy.",
        ],
      },
    ),
    moves: [
      { name: "Earthquake", why: "Ground STAB. Hits Steel that panic into Dragon." },
      { name: "Fire Fang", why: "Punishes Steel and Grass switch-ins." },
      {
        name: "Dragon Claw",
        why: "Dragon STAB that does not lock. Outrage only after Fairy is gone.",
        alts: [
          { name: "Outrage", why: "Fairy confirmed out." },
          { name: "Scale Shot", why: "Speed stages after Protect when Fairy is gone." },
          { name: "Stealth Rock", why: "Chip Sashes and Flying before the mid-game." },
        ],
      },
      {
        name: "Swords Dance",
        why: "Boost into Protect or a free switch.",
        alts: [{ name: "Protect", why: "Scout Ice or Fairy on first entry." }],
      },
    ],
    objective: "Force switches. Break the wall. Leave Ice and Fairy to flex.",
    howToPlay:
      "Come in on Electric, Fire into a resist, or after a pivot chips.\nEarthquake grounded non-Grass. Fire Fang Steel panic-switches.\nIce or Fairy: leave. Do not Outrage while Fairy is healthy.",
  };
}

function corviknightSlot(): SlotManual {
  return {
    slug: "corviknight",
    title: "The Scout",
    job: "support",
    literacy: "pivot",
    role: "Blind lead. Rocky Helmet sponge. Slow U-turn. Fairy answer.",
    ability: "Mirror Armor",
    item: "Rocky Helmet",
    itemWhy: "Contact pays HP. Physical scout and Fairy/Poison/Grass emergency.",
    itemAlts: [
      { name: "Leftovers", why: "Roost stay against special chip." },
      { name: "Occa Berry", why: "Emergency Fire live — prefer Rotom or Primarina when you can." },
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
        why: "Take the hit, U-turn after they move. Speed at 0.",
        spend: ["32 HP — the stay.", "32 Def — Impish wall.", "2 SpD — leftover.", "0 Spe — slow U-turn."],
      },
    ),
    moves: [
      {
        name: "U-turn",
        why: "Slow hand-off into Garchomp or Kingambit. If you outspeed Ice, do not U-turn into Garchomp.",
      },
      { name: "Brave Bird", why: "Grass answer. Recoil is the tax." },
      {
        name: "Roost",
        why: "Stay against a locked physical resist.",
        alts: [{ name: "Iron Defense", why: "With Body Press, two stages doubles Press." }],
      },
      {
        name: "Body Press",
        why: "Defense-based Fighting. Hits Dark.",
        alts: [{ name: "Iron Head", why: "Steel into Fairy when Garchomp is down." }],
      },
    ],
    objective: "Scout, chip, Fairy answer. Leave Electric and Fire.",
    howToPlay:
      "Lead vs physical, Grass, or Poison.\nElectric and Fire leave — Garchomp or Rotom.\nNever U-turn into Garchomp while faster than Ice.",
  };
}

function kingambitSlot(): SlotManual {
  return {
    slug: "kingambit",
    title: "The Closer",
    job: "breaker",
    literacy: "wallbreaker",
    role: "Supreme Overlord closer. Bag until a partner trades.",
    ability: "Supreme Overlord",
    item: "Black Glasses",
    itemWhy: "Dark STAB finishes. Stacks with Overlord after a partner falls.",
    itemAlts: [
      { name: "Life Orb", why: "Raw damage into bulky walls after chip." },
      { name: "Leftovers", why: "Sit against a resist. Prefer Glasses for the close." },
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
        why: "Slow on purpose. Sucker Punch is the Speed plan. Fighting is 1× — not free.",
        spend: ["32 Atk — Kowtow and Sucker Punch close.", "32 HP — live one hit after a trade.", "2 Def — leftover.", "0 Spe — Sucker Punch is +1."],
      },
    ),
    moves: [
      { name: "Kowtow Cleave", why: "Dark STAB that never misses." },
      { name: "Sucker Punch", why: "Priority if they attack. Fails on Protect." },
      {
        name: "Iron Head",
        why: "Steel into Fairy.",
        alts: [{ name: "Swords Dance", why: "Free turn after a KO." }],
      },
      {
        name: "Low Kick",
        why: "Fighting coverage into their Kingambit.",
        alts: [{ name: "Protect", why: "Scout Fighting priority." }],
      },
    ],
    objective: "Close after trades. Do not lead into Fighting.",
    howToPlay:
      "Stay bagged until Garchomp or a flex has traded.\nSucker Punch attackers. Kowtow walls that Protect.\nFighting: leave to Rotom or Corvi.",
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
    itemWhy: "You stay. One burst after the first hit.",
    itemAlts: [
      { name: "Leftovers", why: "Calm Mind stay when they cannot KO." },
      { name: "Choice Specs", why: "One locked Moonblast or Sparkling Aria. Do not lock into Steel." },
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
        why: "SpD anchor — Garchomp and Kingambit lean physical.",
        spend: ["32 HP — Sitrus stay.", "16 SpD — live special Ice and Water.", "14 SpA — Moonblast still hurts.", "4 Def — crumb.", "0 Spe — Garchomp races."],
      },
    ),
    moves: [
      { name: "Moonblast", why: "Fairy STAB. Dragon and Fighting." },
      {
        name: "Sparkling Aria",
        why: "Water STAB. Hits Fire and Ground.",
        alts: [{ name: "Surf", why: "Stronger Water without burn heal." }],
      },
      { name: "Ice Beam", why: "Hits their Garchomp four times as hard." },
      {
        name: "Aqua Jet",
        why: "Water priority. Revenge Fire.",
        alts: [
          { name: "Calm Mind", why: "Boost when the stay is real." },
          { name: "Encore", why: "Lock Protect or setup, then Moonblast." },
        ],
      },
    ],
    objective: "Answer Ice, Dragon, special Water. Leave Grass and Poison.",
    howToPlay:
      "Bring vs Ice, Fire, Dragon, Fighting, or rain specials.\nIce Beam their dragon. Moonblast Fighting.\nGrass or Poison: leave to Kingambit or Meowscarada.",
  };
}

function meowscaradaSlot(): SlotManual {
  return {
    slug: "meowscarada",
    title: "The Revenge",
    job: "breaker",
    literacy: "sweeper",
    role: "Speed threat. Flower Trick. Knock Off. U-turn pivot.",
    ability: "Overgrow",
    item: "Choice Scarf",
    itemWhy: "Outrun medium Speed and revenge. Life Orb is the freer click alt.",
    itemAlts: [
      { name: "Life Orb", why: "Flower Trick without locking. Recoil is real." },
      { name: "Focus Sash", why: "Live one hit to flower the revenge." },
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
        label: "Scarf race",
        why: "Cap Attack and Speed. Scarf multiplies the race.",
        spend: ["32 Atk — Flower Trick has to KO.", "32 Spe — the race before Scarf.", "2 SpD — leftover.", "0 HP — revenge, not wall."],
      },
      [
        alt("Life Orb", 4, 32, 0, 0, 0, 30, "Free clicks. Pull a little Speed into HP.", [
          "32 Atk — still the punch.",
          "30 Spe — Jolly race without Scarf.",
          "4 HP — leftover.",
        ]),
      ],
    ),
    moves: [
      { name: "Flower Trick", why: "Grass STAB that never misses and always crits." },
      { name: "Knock Off", why: "Strip Leftovers and Choice. Softens walls." },
      {
        name: "U-turn",
        why: "Pivot into Garchomp or Corviknight after chip.",
        alts: [{ name: "Triple Axel", why: "Ice coverage into Dragons when Primarina is benched." }],
      },
      {
        name: "Play Rough",
        why: "Fairy into Fighting and Dragon.",
        alts: [{ name: "Thunder Punch", why: "Electric into Water/Flying when Rotom is benched." }],
      },
    ],
    objective: "Revenge and strip. Leave Fire and Ice.",
    howToPlay:
      "Bring vs HO and soft fields that need Speed.\nFlower Trick the revenge. Knock then U-turn into Chomp.\nFire or Ice: leave to Corvi or Primarina.",
  };
}

function rotomWashSlot(): SlotManual {
  return {
    slug: "rotom-wash",
    title: "The Volt Pivot",
    job: "support",
    literacy: "pivot",
    role: "Volt Switch. Fighting sponge for Kingambit. Water absorb.",
    ability: "Levitate",
    item: "Sitrus Berry",
    itemWhy: "Sit one hit then Volt Switch. Leftovers is the longer stay.",
    itemAlts: [
      { name: "Leftovers", why: "Will-O / Pain Split stay." },
      { name: "Choice Specs", why: "Lock Hydro Pump or Thunderbolt. Do not sit." },
    ],
    nature: "Modest",
    training: train(
      32,
      0,
      0,
      20,
      14,
      0,
      {
        label: "Bulky pivot",
        why: "Live Fighting for Gambit. Cap HP. Split SpA and SpD.",
        spend: ["32 HP — the stay.", "20 SpA — Hydro and Thunderbolt hurt.", "14 SpD — live special chip.", "0 Spe — Volt Switch after they move when possible."],
      },
    ),
    moves: [
      { name: "Volt Switch", why: "Electric damage plus hand-off into Garchomp or Kingambit." },
      { name: "Hydro Pump", why: "Water STAB. Hits Ground that blanks Volt Switch.", alts: [{ name: "Surf", why: "Safer Water without the miss." }] },
      {
        name: "Will-O-Wisp",
        why: "Burn physical attackers before you leave.",
        alts: [{ name: "Thunder Wave", why: "Para the race when burn is resisted." }],
      },
      {
        name: "Pain Split",
        why: "Equalize HP against a tank.",
        alts: [{ name: "Protect", why: "Scout and stall Leftovers." }],
      },
    ],
    objective: "Absorb Fighting. Pivot with Volt Switch. Leave Grass and Dark.",
    howToPlay:
      "Bring vs Fighting-heavy previews.\nWill-O physical, Volt Switch into Gambit or Chomp.\nGrass or Dark: leave to Corvi or Meow.",
  };
}

const ROSTER: SlotManual[] = [
  garchompSlot(),
  corviknightSlot(),
  kingambitSlot(),
  primarinaSlot(),
  meowscaradaSlot(),
  rotomWashSlot(),
];

function corePhases(): ManualPhase[] {
  return [
    {
      id: "preview",
      title: "Preview",
      lede: "Register six. After you see their six, bring three. Ice and Fairy hide Garchomp.",
      branches: [
        { when: "Blind / balanced six", then: "Core pack — Garchomp, Corviknight, Kingambit." },
        { when: "Special spam, Ice, or Dragon", then: "Special pack — Primarina in, Corvi out." },
        { when: "Hyper offense / speed races", then: "Speed pack — Meowscarada in." },
        { when: "Fighting-heavy", then: "Pivot pack — Rotom-Wash + Corvi + Gambit." },
        { when: "Soft field, need Speed + closer", then: "Break pack — Chomp, Meow, Gambit." },
      ],
    },
    {
      id: "lead",
      title: "Lead",
      lede: "Corviknight is the blind lead. Garchomp is the Electric lead. Kingambit is not a lead.",
      branches: [
        { out: "corviknight", when: "Physical contact", then: "Stay. Helmet chips." },
        { out: "corviknight", when: "Want Garchomp, slower", then: "U-turn." },
        { out: "corviknight", when: "Want Garchomp, outspeed Ice", then: "Do not U-turn into Chomp." },
        { out: "garchomp", when: "Electric", then: "Earthquake if grounded." },
        { out: "kingambit", when: "You led the truck", then: "Misread. Protect. Get Corvi or Chomp in." },
      ],
    },
    {
      id: "mid",
      title: "Mid",
      lede: "Helmet absorb. Punish Steel. Fuel Overlord.",
      branches: [
        { out: "corviknight", when: "Locked physical resist", then: "Roost or Body Press." },
        { out: "garchomp", when: "Steel switches in", then: "Fire Fang." },
        { out: "garchomp", when: "Fairy or Ice", then: "Corviknight." },
        { out: "kingambit", when: "Partner fainted", then: "Overlord close." },
      ],
    },
    {
      id: "late",
      title: "Late",
      lede: "Overlord closes. Chomp cleans if Ice and Fairy are gone.",
      branches: [
        { out: "kingambit", when: "They attack", then: "Sucker Punch." },
        { out: "kingambit", when: "They Protect", then: "Kowtow. Not Sucker Punch." },
        { out: "garchomp", when: "Ice gone, grounded", then: "Earthquake." },
      ],
    },
  ];
}

function coreFlows(): ManualFlow[] {
  return [
    {
      id: "lead",
      title: "Lead",
      lede: "Corviknight blind. Garchomp for Electric. Kingambit bagged.",
      forks: [
        {
          id: "op-lead-corvi",
          when: "Physical, Grass, Poison, or blind",
          then: "Lead Corviknight.",
          send: "corviknight",
          why: "Scout and Fairy answer.",
          forks: [
            {
              id: "op-lead-corvi-phys",
              when: "Physical contact",
              then: "Stay. Helmet chips.",
              send: "corviknight",
            },
            {
              id: "op-lead-corvi-uturn",
              when: "Want Garchomp, slower or they switched",
              then: "U-turn into Garchomp.",
              move: "U-turn",
              send: "garchomp",
            },
            {
              id: "op-lead-corvi-ice",
              when: "Want Garchomp, outspeed Ice",
              then: "Do not U-turn into Garchomp.",
              send: "corviknight",
            },
            {
              id: "op-lead-corvi-elec",
              when: "Electric",
              then: "Leave to Garchomp.",
              send: "garchomp",
            },
          ],
        },
        {
          id: "op-lead-chomp",
          when: "Electric",
          then: "Lead Garchomp.",
          send: "garchomp",
          forks: [
            {
              id: "op-lead-chomp-eq",
              when: "Grounded",
              then: "Earthquake.",
              move: "Earthquake",
              send: "garchomp",
            },
            {
              id: "op-lead-chomp-ice",
              when: "Ice or Fairy",
              then: "Leave to Corviknight.",
              send: "corviknight",
            },
          ],
        },
      ],
    },
    {
      id: "mid",
      title: "Mid",
      lede: "Type sends on the switch board. Here: locks and Overlord fuel.",
      forks: [
        {
          id: "op-mid-corvi",
          when: "This Pokémon is out",
          out: "corviknight",
          forks: [
            {
              id: "op-mid-corvi-stay",
              when: "Locked physical resist",
              then: "Roost or Body Press.",
              move: "Roost",
              send: "corviknight",
            },
            {
              id: "op-mid-corvi-hand",
              when: "Ice scouted gone",
              then: "Slow U-turn into Garchomp.",
              move: "U-turn",
              send: "garchomp",
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
              when: "Steel switches in",
              then: "Fire Fang.",
              move: "Fire Fang",
              send: "garchomp",
            },
            {
              id: "op-mid-chomp-fairy",
              when: "Fairy or Ice",
              then: "Leave to Corviknight.",
              send: "corviknight",
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
              when: "Partner fainted",
              then: "Kowtow or Sucker Punch.",
              send: "kingambit",
            },
            {
              id: "op-mid-gambit-fight",
              when: "Fighting",
              then: "Protect or leave to Corviknight.",
              send: "corviknight",
            },
          ],
        },
      ],
    },
    {
      id: "late",
      title: "Late",
      lede: "Overlord closes. Chomp cleans if Ice and Fairy are gone.",
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
            },
            {
              id: "op-late-gambit-kowtow",
              when: "Protect or status",
              then: "Kowtow Cleave.",
              move: "Kowtow Cleave",
              send: "kingambit",
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
            },
          ],
        },
      ],
    },
  ];
}

const CORE_HAZARDS: ManualNote[] = [
  {
    title: "Ice into Garchomp",
    body: "Ice hits Garchomp four times as hard.",
    watch: "Ice coverage on their six.",
    play: "Bring Special (Primarina) or keep Corvi. Do not U-turn into Chomp while faster than Ice.",
    rule: "Never leave Garchomp in on known Ice.",
  },
  {
    title: "Fairy into Garchomp",
    body: "Fairy deals double to Dragon/Ground.",
    watch: "Moonblast or Play Rough still healthy.",
    play: "Corviknight resists. Iron Head from Kingambit if Corvi is down.",
    rule: "Do not Outrage while Fairy is in their bag.",
  },
  {
    title: "Fighting into Kingambit",
    body: "Fighting is 1× on Dark/Steel — not free.",
    watch: "Close Combat or Fighting priority.",
    play: "Bring Pivot (Rotom) or Corvi Body Press. Do not lead the truck.",
    rule: "Do not lead Kingambit into live Fighting.",
  },
  {
    title: "Hyper offense Speed",
    body: "Core Corvi is slow on purpose.",
    watch: "Multiple Band or Scarf cleaners.",
    play: "Bring Speed (Meowscarada) or Break pack.",
    rule: "Do not stubborn Core into a known HO six.",
  },
];

function packCore(): ManualPack {
  return {
    id: "core",
    label: "Core",
    when: "Blind ladder / balanced six",
    identity: "Corviknight scouts and chips. Garchomp breaks. Kingambit closes on trades.",
    slugs: ["garchomp", "corviknight", "kingambit"],
    pilot: {
      thesis:
        "Register six. After preview, bring Corviknight, Garchomp, and Kingambit for balanced foes. Corvi buys information. Chomp breaks. Gambit closes.",
      rule: "Blind lead Corviknight. Slow U-turn into Garchomp. Ice onto Garchomp: Corviknight. Kingambit stays bagged until a partner falls.",
      fail: "U-turning into Garchomp while faster than Ice, leading Kingambit into Fighting, or Outrage while Fairy is healthy.",
    },
    meta: "Default bring. Garchomp and Kingambit are the wincon spine. Corviknight is the wall.",
    philosophy:
      "You register six: Garchomp, Corviknight, Kingambit, Primarina, Meowscarada, Rotom-Wash. At preview you bring three. Core is the blind bring — Corvi scouts, Chomp breaks, Gambit closes on Supreme Overlord.",
    press: ["Physical leads", "Steel walls", "Electric", "Contact spam"],
    refuse: ["Ice into Garchomp", "Fairy into Garchomp", "Fighting lead into Kingambit", "Known HO without Speed pack"],
    switches: [
      { into: "Ice", send: "Corviknight. Never Garchomp — Ice hits four times as hard." },
      { into: "Fairy", send: "Corviknight. Steel resists. Kingambit Iron Head if Corvi is down." },
      { into: "Electric", send: "Garchomp. Ground blanks Electric." },
      { into: "Fire", send: "Garchomp resists. Corviknight and Kingambit take double — leave." },
      { into: "Fighting", send: "Corviknight Body Press. Kingambit takes normal Fighting — not a lead." },
      { into: "Ground", send: "Corviknight. Flying blanks Ground." },
      { into: "Water", send: "Corviknight resists. Kingambit resists." },
      { into: "Grass", send: "Corviknight Brave Bird. Do not Earthquake Grass with Garchomp alone." },
      { into: "Poison", send: "Corviknight. Steel blanks Poison." },
      { into: "Dragon", send: "Kingambit Iron Head, or Garchomp if you won Speed." },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Scout without donating Garchomp into Ice.",
        play: "Lead Corviknight into physical, Grass, or Poison. Lead Garchomp only into Electric. Keep Kingambit bagged.",
        next: "Rocky Helmet chips. Slow U-turn into Garchomp after they move.",
      },
      {
        title: "Shield",
        goal: "Helmet absorb, then punish the panic switch.",
        play: "Sit Corviknight into physical. U-turn into Garchomp on Electric or Fire. Fire Fang Steel that switch into Dragon.",
        next: "Ice or Fairy onto Garchomp: back to Corviknight.",
      },
      {
        title: "Clean",
        goal: "Kingambit closes after trades fuel Overlord.",
        play: "When a partner falls, Kingambit enters stacked. Sucker Punch attackers. Kowtow walls that Protect.",
        next: "Do not Sucker Punch Protect.",
      },
    ],
    loops: [
      {
        title: "Helmet, then hand-off",
        body: "Corviknight takes contact. Rocky Helmet chips. Slow U-turn into Garchomp. Earthquake or Fire Fang the switch-in.",
      },
      {
        title: "Steel panic Fang",
        body: "Garchomp clicks Dragon. They panic into Steel. Fire Fang.",
      },
      {
        title: "Overlord close",
        body: "A partner falls. Kingambit walks in with Supreme Overlord. Sucker Punch or Kowtow ends it.",
      },
    ],
    hazards: CORE_HAZARDS,
    advantages: [
      {
        title: "Physical hyper offense",
        body: "Helmet Corvi plus Overlord loves contact spam.",
        watch: "Multiple contact Fake Out / Band attackers.",
        play: "Lead Corvi, chip, U-turn into Chomp, close with Gambit.",
        rule: "Still respect Ice coverage.",
      },
    ],
    victims: [
      { name: "Physical hyper offense", why: "Helmet Corvi chips contact. Overlord loves the trades." },
      { name: "Steel pivots", why: "Fire Fang punishes the panic switch into Dragon." },
      { name: "Electric leads", why: "Garchomp blanks Electric." },
    ],
    counters: [
      { name: "Special spam / Ice", why: "Bring Special — Primarina." },
      { name: "Hyper offense Speed", why: "Bring Speed — Meowscarada." },
      { name: "Fighting-heavy", why: "Bring Pivot — Rotom-Wash." },
    ],
    phases: corePhases(),
    flows: coreFlows(),
  };
}

function packSpecial(): ManualPack {
  return {
    id: "special",
    label: "Special",
    when: "Special spam, Ice, Dragon on their six",
    identity: "Primarina patches Ice and special. Garchomp and Kingambit stay the spine.",
    slugs: ["garchomp", "primarina", "kingambit"],
    pilot: {
      thesis: "Saw Ice, Dragon, or special walls on preview — bring Primarina instead of Corviknight.",
      rule: "Lead Primarina into Ice, Fire, Dragon, Fighting. Lead Garchomp into Electric. Ice onto Garchomp: Primarina.",
      fail: "Leading Garchomp into Ice, or sitting Primarina into Grass or Poison.",
    },
    meta: "Corvi out, Primarina in. You lose Helmet chip — gain SpD and Ice Beam.",
    press: ["Special attackers", "Dragon", "Ice", "Rain specials"],
    refuse: ["Grass into Primarina", "Poison into Primarina", "Ice into Garchomp", "Electric into Primarina"],
    switches: [
      { into: "Ice", send: "Primarina. Never Garchomp." },
      { into: "Fire", send: "Primarina. Water resists." },
      { into: "Dragon", send: "Primarina. Fairy blanks Dragon." },
      { into: "Fairy", send: "Kingambit Iron Head. Garchomp takes double." },
      { into: "Electric", send: "Garchomp. Primarina takes double." },
      { into: "Fighting", send: "Primarina Moonblast." },
      { into: "Grass", send: "Kingambit. Primarina takes double — leave." },
      { into: "Poison", send: "Kingambit. Steel resists." },
      { into: "Water", send: "Primarina. Resists Water even in rain." },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Patch Ice and special before Chomp enters.",
        play: "Lead Primarina into Ice, Fire, Dragon, Fighting. Lead Garchomp only into Electric.",
        next: "Moonblast or Ice Beam first. Hand off after Ice is soft.",
      },
      {
        title: "Shield",
        goal: "Special stay, then break.",
        play: "Sitrus Primarina sits. Fairy: Kingambit Iron Head. Grass or Poison: Kingambit immediately.",
        next: "Garchomp Earthquake after Ice leaves.",
      },
      {
        title: "Clean",
        goal: "Chomp or Overlord finishes.",
        play: "Aqua Jet revenge Fire. Kingambit Sucker Punch after trades.",
        next: "Outrage only if Fairy is gone.",
      },
    ],
    loops: [
      { title: "Ice Beam the dragon", body: "Primarina answers their Garchomp without sending yours into Ice." },
      { title: "Moonblast, then Chomp", body: "Fairy deletes Fighting or Dragon. Switch to Garchomp on Electric." },
      { title: "Overlord close", body: "Primarina trades still stack Supreme Overlord." },
    ],
    hazards: [
      {
        title: "Grass into Primarina",
        body: "Grass deals double.",
        watch: "Rillaboom or Leaf Storm.",
        play: "Kingambit. Do not Calm Mind into Grass.",
        rule: "Never sit Primarina into known Grass.",
      },
      {
        title: "Ice into Garchomp",
        body: "Still 4×.",
        watch: "Ice Beam after a force-switch.",
        play: "Primarina. She resists Ice.",
        rule: "Special pack exists to stop this donate.",
      },
    ],
    advantages: [
      {
        title: "Special hyper offense",
        body: "Primarina is the SpD anchor the spine lacked.",
        watch: "Choice Specs specials.",
        play: "Lead Primarina. Hand Chomp or Gambit the KO.",
        rule: "Respect Grass coverage.",
      },
    ],
    victims: [
      { name: "Dragon cores", why: "Moonblast blanks Dragon. Ice Beam hits Ice-weak dragons." },
      { name: "Special attackers", why: "Sitrus Primarina is the SpD wall." },
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
          { out: "kingambit", when: "Fairy", then: "Iron Head." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { out: "kingambit", when: "They attack", then: "Sucker Punch." },
          { out: "primarina", when: "Fire revenge", then: "Aqua Jet." },
          { out: "garchomp", when: "Ice and Fairy gone", then: "Earthquake." },
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
            id: "sp-lead-prima",
            when: "Ice, Fire, Dragon, Fighting, or rain special",
            then: "Lead Primarina.",
            send: "primarina",
            forks: [
              {
                id: "sp-lead-ice",
                when: "Ice or their dragon",
                then: "Ice Beam.",
                move: "Ice Beam",
                send: "primarina",
              },
              {
                id: "sp-lead-moon",
                when: "Dragon or Fighting",
                then: "Moonblast.",
                move: "Moonblast",
                send: "primarina",
              },
              {
                id: "sp-lead-grass",
                when: "Grass or Poison",
                then: "Leave to Kingambit.",
                send: "kingambit",
              },
              {
                id: "sp-lead-elec",
                when: "Electric",
                then: "Leave to Garchomp.",
                send: "garchomp",
              },
            ],
          },
          {
            id: "sp-lead-chomp",
            when: "Electric",
            then: "Lead Garchomp.",
            send: "garchomp",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Stay special. Hand the break when Ice is soft.",
        forks: [
          {
            id: "sp-mid-prima",
            when: "This Pokémon is out",
            out: "primarina",
            forks: [
              {
                id: "sp-mid-cm",
                when: "Physical wall sitting, Sitrus live",
                then: "Calm Mind, then Moonblast.",
                move: "Calm Mind",
                send: "primarina",
              },
              {
                id: "sp-mid-leave",
                when: "Ice soft",
                then: "Switch to Garchomp.",
                send: "garchomp",
              },
            ],
          },
          {
            id: "sp-mid-chomp",
            when: "This Pokémon is out",
            out: "garchomp",
            forks: [
              {
                id: "sp-mid-ice",
                when: "Ice",
                then: "Leave to Primarina.",
                send: "primarina",
              },
              {
                id: "sp-mid-fairy",
                when: "Fairy",
                then: "Leave to Kingambit.",
                send: "kingambit",
              },
            ],
          },
          {
            id: "sp-mid-gambit",
            when: "This Pokémon is out",
            out: "kingambit",
            forks: [
              {
                id: "sp-mid-iron",
                when: "Fairy",
                then: "Iron Head.",
                move: "Iron Head",
                send: "kingambit",
              },
              {
                id: "sp-mid-overlord",
                when: "Partner down",
                then: "Sucker Punch or Kowtow.",
                send: "kingambit",
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
            id: "sp-late-prima",
            when: "This Pokémon is out",
            out: "primarina",
            forks: [
              {
                id: "sp-late-jet",
                when: "Fire would move first",
                then: "Aqua Jet.",
                move: "Aqua Jet",
                send: "primarina",
              },
            ],
          },
          {
            id: "sp-late-gambit",
            when: "This Pokémon is out",
            out: "kingambit",
            forks: [
              {
                id: "sp-late-sucker",
                when: "They attack",
                then: "Sucker Punch.",
                move: "Sucker Punch",
                send: "kingambit",
              },
            ],
          },
        ],
      },
    ],
  };
}

function packSpeed(): ManualPack {
  return {
    id: "speed",
    label: "Speed",
    when: "Hyper offense / revenge races on their six",
    identity: "Meowscarada brings the race. Corviknight still walls. Garchomp breaks.",
    slugs: ["garchomp", "meowscarada", "corviknight"],
    pilot: {
      thesis: "Saw HO or multiple Speed threats — bring Meowscarada. Kingambit stays on the bench this game.",
      rule: "Lead Corvi into physical. Scarf Meow revenge. Hand Garchomp the break when Ice is soft.",
      fail: "Flower Trick into Fire, or U-turning Meow into Garchomp while Ice is live.",
    },
    meta: "Gambit out, Meow in. You lose Overlord close — gain Scarf revenge and Knock.",
    press: ["Hyper offense", "Medium Speed cleaners", "Item walls"],
    refuse: ["Fire into Meowscarada", "Ice into Garchomp", "Fairy into Garchomp"],
    switches: [
      { into: "Ice", send: "Corviknight. Never Garchomp." },
      { into: "Fairy", send: "Corviknight." },
      { into: "Fire", send: "Garchomp or Corvi. Meow takes double — leave." },
      { into: "Electric", send: "Garchomp." },
      { into: "Fighting", send: "Corviknight or Meow Play Rough." },
      { into: "Water", send: "Corviknight. Meow Flower Trick chunks Water." },
      { into: "Grass", send: "Corviknight Brave Bird or Meow Knock." },
      { into: "Ground", send: "Corviknight." },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Wall first, revenge second.",
        play: "Lead Corviknight into physical. Meowscarada comes in after a KO or free switch for Flower Trick.",
        next: "Knock Off stay items before Chomp breaks.",
      },
      {
        title: "Shield",
        goal: "Scarf covers what Corvi cannot outrun.",
        play: "U-turn Corvi into Meow only when Ice is scouted. Flower Trick the revenge.",
        next: "Fire onto Meow: Corvi or Chomp immediately.",
      },
      {
        title: "Clean",
        goal: "Chomp finishes without Overlord.",
        play: "No Kingambit this bring — Garchomp is the closer. Soft field with Knock, then Earthquake.",
        next: "Do not greed Scale Shot into Fairy.",
      },
    ],
    loops: [
      { title: "Knock, then Chomp", body: "Meowscarada strips Leftovers. U-turn into Garchomp. Earthquake the soft wall." },
      { title: "Scarf Flower", body: "After a KO, Meowscarada Flower Tricks the next attacker before they move." },
      { title: "Helmet absorb", body: "Corvi still chips contact. Hand Meow or Chomp the race." },
    ],
    hazards: [
      {
        title: "Fire into Meowscarada",
        body: "Fire deals double to Grass/Dark.",
        watch: "Flare Blitz or Heat Wave.",
        play: "Leave to Garchomp or Corvi.",
        rule: "Never sit Meow into known Fire.",
      },
      {
        title: "No Overlord",
        body: "Kingambit is benched.",
        watch: "Late 1v1 scramble.",
        play: "Garchomp must clean. Play for health.",
        rule: "Do not trade as if Overlord were coming.",
      },
    ],
    advantages: [
      {
        title: "Band hyper offense",
        body: "Scarf Meow outruns medium Speeds Corvi cannot.",
        watch: "Multiple Band attackers under 100 base Speed.",
        play: "Corvi chip, Meow revenge, Chomp clean.",
        rule: "Scout Ice before Chomp entry.",
      },
    ],
    victims: [
      { name: "Medium Speed HO", why: "Scarf Flower Trick deletes the revenge window." },
      { name: "Leftovers walls", why: "Knock Off before Chomp breaks." },
    ],
    counters: [
      { name: "Fire spam", why: "Meow hates Fire. Chomp is the resist." },
      { name: "Late Overlord need", why: "Wrong pack — bring Break or Core if you need Gambit." },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        branches: [
          { when: "HO / Speed", then: "This pack." },
          { when: "Fire lead", then: "Corvi or Chomp — not Meow." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        branches: [
          { out: "corviknight", when: "Physical", then: "Helmet, then hand off." },
          { out: "meowscarada", when: "Free revenge", then: "Flower Trick." },
          { out: "garchomp", when: "Electric", then: "Earthquake." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { out: "meowscarada", when: "Item wall", then: "Knock Off, then U-turn or Flower." },
          { out: "garchomp", when: "Steel", then: "Fire Fang." },
          { out: "corviknight", when: "Fairy or Ice onto Chomp", then: "Stay." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { out: "meowscarada", when: "They attack first next", then: "Flower Trick." },
          { out: "garchomp", when: "Ice gone", then: "Earthquake." },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Corvi walls. Meow revenges. Chomp for Electric.",
        forks: [
          {
            id: "spd-lead-corvi",
            when: "Physical or blind",
            then: "Lead Corviknight.",
            send: "corviknight",
            forks: [
              {
                id: "spd-lead-uturn-meow",
                when: "Want Meow after chip",
                then: "U-turn into Meowscarada if Ice is soft.",
                move: "U-turn",
                send: "meowscarada",
              },
              {
                id: "spd-lead-uturn-chomp",
                when: "Electric or soft physical",
                then: "U-turn into Garchomp.",
                move: "U-turn",
                send: "garchomp",
              },
            ],
          },
          {
            id: "spd-lead-meow",
            when: "Free Speed revenge already",
            then: "Lead Meowscarada carefully — prefer Corvi first.",
            send: "meowscarada",
            forks: [
              {
                id: "spd-lead-flower",
                when: "They are in range",
                then: "Flower Trick.",
                move: "Flower Trick",
                send: "meowscarada",
              },
              {
                id: "spd-lead-fire",
                when: "Fire",
                then: "Leave to Garchomp.",
                send: "garchomp",
              },
            ],
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Knock, race, break.",
        forks: [
          {
            id: "spd-mid-meow",
            when: "This Pokémon is out",
            out: "meowscarada",
            forks: [
              {
                id: "spd-mid-knock",
                when: "Stay item up",
                then: "Knock Off.",
                move: "Knock Off",
                send: "meowscarada",
              },
              {
                id: "spd-mid-uturn",
                when: "Want Chomp",
                then: "U-turn into Garchomp.",
                move: "U-turn",
                send: "garchomp",
              },
            ],
          },
          {
            id: "spd-mid-chomp",
            when: "This Pokémon is out",
            out: "garchomp",
            forks: [
              {
                id: "spd-mid-fang",
                when: "Steel",
                then: "Fire Fang.",
                move: "Fire Fang",
                send: "garchomp",
              },
              {
                id: "spd-mid-ice",
                when: "Ice or Fairy",
                then: "Leave to Corviknight.",
                send: "corviknight",
              },
            ],
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "No Gambit. Chomp or Meow finishes.",
        forks: [
          {
            id: "spd-late-meow",
            when: "This Pokémon is out",
            out: "meowscarada",
            forks: [
              {
                id: "spd-late-flower",
                when: "They would move first without Scarf",
                then: "Flower Trick.",
                move: "Flower Trick",
                send: "meowscarada",
              },
            ],
          },
          {
            id: "spd-late-chomp",
            when: "This Pokémon is out",
            out: "garchomp",
            forks: [
              {
                id: "spd-late-eq",
                when: "Ice gone",
                then: "Earthquake.",
                move: "Earthquake",
                send: "garchomp",
              },
            ],
          },
        ],
      },
    ],
  };
}

function packPivot(): ManualPack {
  return {
    id: "pivot",
    label: "Pivot",
    when: "Fighting-heavy six / need Volt Switch loops",
    identity: "Rotom-Wash sponges Fighting for Gambit. Corviknight walls. Kingambit closes.",
    slugs: ["corviknight", "rotom-wash", "kingambit"],
    pilot: {
      thesis: "Saw Fighting spam — bench Garchomp. Rotom and Corvi protect Kingambit's entry.",
      rule: "Lead Corvi or Rotom. Will-O physical. Volt Switch into Gambit after a trade. Do not lead Kingambit.",
      fail: "Leading Kingambit into Fighting, or sitting Rotom into Grass.",
    },
    meta: "Chomp out, Rotom in. You lose Earthquake break — gain Fighting sponge and Volt Switch.",
    press: ["Fighting", "Physical HO", "Ground (Levitate)"],
    refuse: ["Grass into Rotom", "Dark into Rotom", "Leading Kingambit"],
    switches: [
      { into: "Fighting", send: "Rotom-Wash or Corviknight. Never lead Kingambit." },
      { into: "Ground", send: "Rotom Levitate or Corvi Flying." },
      { into: "Fairy", send: "Corviknight. Kingambit Iron Head." },
      { into: "Fire", send: "Rotom Hydro. Corvi takes double — leave." },
      { into: "Water", send: "Corviknight or Rotom." },
      { into: "Grass", send: "Corviknight Brave Bird. Rotom takes double — leave." },
      { into: "Electric", send: "Corviknight takes double — leave carefully. Kingambit resists." },
      { into: "Ice", send: "Corviknight. Kingambit takes normal Ice." },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Absorb Fighting before Gambit walks in.",
        play: "Lead Corvi into physical or Rotom into Fighting. Will-O, then Volt Switch.",
        next: "Kingambit enters only after a partner has chipped or traded.",
      },
      {
        title: "Shield",
        goal: "Volt Switch loops keep Gambit healthy.",
        play: "Pain Split or Sitrus on Rotom. Helmet on Corvi. Hand Gambit a −1 burned attacker.",
        next: "Grass onto Rotom: Corvi immediately.",
      },
      {
        title: "Clean",
        goal: "Overlord close without Chomp.",
        play: "No Earthquake — Kowtow and Sucker Punch finish. Iron Head Fairy.",
        next: "Do not Sucker Punch Protect.",
      },
    ],
    loops: [
      { title: "Will-O, Volt, truck", body: "Rotom burns the physical. Volt Switch into Kingambit. Overlord or raw Kowtow." },
      { title: "Helmet, then Gambit", body: "Corvi chips contact. Slow hand-off into Kingambit on a soft field." },
      { title: "Overlord close", body: "A partner falls. Sucker Punch the cleaner." },
    ],
    hazards: [
      {
        title: "Grass into Rotom",
        body: "Grass deals double to Water/Electric.",
        watch: "Rillaboom or Leaf Storm.",
        play: "Corviknight Brave Bird.",
        rule: "Never sit Rotom into known Grass.",
      },
      {
        title: "No Garchomp",
        body: "Earthquake is gone.",
        watch: "Steel walls that need Fang.",
        play: "Corvi Press or Gambit Kowtow. Consider Core or Break next game.",
        rule: "Do not play as if Fire Fang were available.",
      },
    ],
    advantages: [
      {
        title: "Fighting cores",
        body: "Rotom and Corvi both answer Fighting better than Chomp.",
        watch: "Close Combat / Aura Sphere spam.",
        play: "Lead Rotom or Corvi. Gambit closes after burn.",
        rule: "Still Protect once if Gambit must enter into Fighting.",
      },
    ],
    victims: [
      { name: "Fighting HO", why: "Rotom sponges. Gambit closes after burn." },
      { name: "Ground leads", why: "Levitate blanks Earthquake." },
    ],
    counters: [
      { name: "Grass", why: "Rotom takes double. Corvi must answer." },
      { name: "Steel walls needing Fang", why: "Wrong pack — bring Core or Break." },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        branches: [
          { when: "Fighting-heavy", then: "This pack." },
          { when: "Grass lead", then: "Corvi — not Rotom." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        branches: [
          { out: "rotom-wash", when: "Fighting", then: "Will-O or Volt Switch." },
          { out: "corviknight", when: "Physical / Grass", then: "Helmet or Brave Bird." },
          { out: "kingambit", when: "You led the truck", then: "Misread." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { out: "rotom-wash", when: "Burned attacker", then: "Volt Switch into Kingambit." },
          { out: "kingambit", when: "Partner down", then: "Overlord." },
          { out: "corviknight", when: "Fairy", then: "Stay or Iron Head hand-off." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { out: "kingambit", when: "They attack", then: "Sucker Punch." },
          { out: "rotom-wash", when: "One left", then: "Hydro or Volt." },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Rotom or Corvi first. Gambit bagged.",
        forks: [
          {
            id: "pv-lead-rotom",
            when: "Fighting or Ground",
            then: "Lead Rotom-Wash.",
            send: "rotom-wash",
            forks: [
              {
                id: "pv-lead-wisp",
                when: "Physical",
                then: "Will-O-Wisp.",
                move: "Will-O-Wisp",
                send: "rotom-wash",
              },
              {
                id: "pv-lead-volt",
                when: "Want Gambit",
                then: "Volt Switch into Kingambit.",
                move: "Volt Switch",
                send: "kingambit",
              },
              {
                id: "pv-lead-grass",
                when: "Grass",
                then: "Leave to Corviknight.",
                send: "corviknight",
              },
            ],
          },
          {
            id: "pv-lead-corvi",
            when: "Physical, Grass, Poison",
            then: "Lead Corviknight.",
            send: "corviknight",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Burn, pivot, stack Overlord.",
        forks: [
          {
            id: "pv-mid-rotom",
            when: "This Pokémon is out",
            out: "rotom-wash",
            forks: [
              {
                id: "pv-mid-volt",
                when: "Soft field",
                then: "Volt Switch into Kingambit.",
                move: "Volt Switch",
                send: "kingambit",
              },
            ],
          },
          {
            id: "pv-mid-gambit",
            when: "This Pokémon is out",
            out: "kingambit",
            forks: [
              {
                id: "pv-mid-overlord",
                when: "Partner fainted",
                then: "Kowtow or Sucker Punch.",
                send: "kingambit",
              },
              {
                id: "pv-mid-fight",
                when: "Fighting",
                then: "Protect or leave to Rotom.",
                send: "rotom-wash",
              },
            ],
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Overlord without Chomp.",
        forks: [
          {
            id: "pv-late-gambit",
            when: "This Pokémon is out",
            out: "kingambit",
            forks: [
              {
                id: "pv-late-sucker",
                when: "They attack",
                then: "Sucker Punch.",
                move: "Sucker Punch",
                send: "kingambit",
              },
            ],
          },
        ],
      },
    ],
  };
}

function packBreak(): ManualPack {
  return {
    id: "break",
    label: "Break",
    when: "Soft field — need Speed and Overlord together",
    identity: "Meowscarada races. Garchomp breaks. Kingambit closes. No Corvi wall.",
    slugs: ["garchomp", "meowscarada", "kingambit"],
    pilot: {
      thesis: "Their six looks soft or already scouted — bring Meow + Chomp + Gambit. Play short and aggressive.",
      rule: "Meow Knock and Flower. Chomp Fire Fang and Earthquake. Gambit closes. Ice must be gone before Chomp sits.",
      fail: "Leading Gambit, or bringing this pack into unknown Ice without Primarina.",
    },
    meta: "Corvi and Rotom out. Maximum offense from the box.",
    press: ["Soft walls", "Medium Speed", "Item-reliant tanks"],
    refuse: ["Unknown Ice", "Fairy without Iron Head ready", "Fighting lead into Gambit"],
    switches: [
      { into: "Ice", send: "Meowscarada takes normal Ice — not great. Prefer Special pack if Ice is live. Never Garchomp." },
      { into: "Fairy", send: "Kingambit Iron Head. Garchomp takes double." },
      { into: "Fire", send: "Garchomp. Meow takes double — leave." },
      { into: "Electric", send: "Garchomp." },
      { into: "Fighting", send: "Meow Play Rough. Kingambit takes normal — not a lead." },
      { into: "Water", send: "Meow Flower Trick. Kingambit resists." },
      { into: "Grass", send: "Meow Knock or Chomp Fire Fang." },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Strip and race immediately.",
        play: "Lead Meow into soft physical or free Flower. Lead Chomp into Electric. Gambit bagged.",
        next: "Knock before Chomp commits.",
      },
      {
        title: "Shield",
        goal: "No wall — play prediction.",
        play: "U-turn Meow into Chomp only when Ice is confirmed gone. Fairy: Gambit Iron Head.",
        next: "Fighting onto Gambit: Meow or Protect.",
      },
      {
        title: "Clean",
        goal: "Speed plus Overlord.",
        play: "Meow Flower the revenge. Gambit Sucker Punch after trades. Chomp Earthquake leftovers.",
        next: "Short games. Do not stall.",
      },
    ],
    loops: [
      { title: "Knock, Fang, truck", body: "Meow Knock. Chomp Fire Fang Steel. Gambit Kowtow the rest." },
      { title: "Scarf into Overlord", body: "Meow trades. Gambit enters stacked. Sucker Punch." },
      { title: "Electric Chomp", body: "Lead Chomp into Electric. Earthquake. Meow cleans Speed." },
    ],
    hazards: [
      {
        title: "Ice without Corvi or Prima",
        body: "No Ice sponge on this bring.",
        watch: "Ice Beam on their six.",
        play: "Wrong pack — bring Special or Core.",
        rule: "Do not Break into known Ice.",
      },
      {
        title: "Fairy",
        body: "No Corvi Steel resist on the pivot.",
        watch: "Moonblast.",
        play: "Kingambit Iron Head is mandatory.",
        rule: "Do not bag Gambit while Fairy cleans Chomp.",
      },
    ],
    advantages: [
      {
        title: "Soft balanced six",
        body: "Speed plus Overlord ends games fast.",
        watch: "No Ice, weak Fighting.",
        play: "Meow pressure, Chomp break, Gambit close.",
        rule: "Confirm Ice is absent on preview.",
      },
    ],
    victims: [
      { name: "Item walls", why: "Knock plus Fang plus Kowtow." },
      { name: "Medium Speed offense", why: "Scarf Meow and Sucker Punch both race." },
    ],
    counters: [
      { name: "Ice", why: "No sponge. Bring Special." },
      { name: "Fighting priority", why: "No Rotom. Protect or Meow." },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        branches: [
          { when: "Soft field, Ice gone", then: "This pack." },
          { when: "Ice visible", then: "Special or Core instead." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        branches: [
          { out: "meowscarada", when: "Soft physical", then: "Knock or Flower." },
          { out: "garchomp", when: "Electric", then: "Earthquake." },
          { out: "kingambit", when: "Led truck", then: "Misread." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { out: "meowscarada", when: "Want Chomp", then: "U-turn if Ice gone." },
          { out: "garchomp", when: "Steel", then: "Fire Fang." },
          { out: "kingambit", when: "Partner down", then: "Overlord." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { out: "kingambit", when: "They attack", then: "Sucker Punch." },
          { out: "meowscarada", when: "Revenge", then: "Flower Trick." },
          { out: "garchomp", when: "Grounded", then: "Earthquake." },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Aggressive. Meow or Chomp. Gambit bagged.",
        forks: [
          {
            id: "br-lead-meow",
            when: "Soft physical or free Flower",
            then: "Lead Meowscarada.",
            send: "meowscarada",
            forks: [
              {
                id: "br-lead-knock",
                when: "Item up",
                then: "Knock Off.",
                move: "Knock Off",
                send: "meowscarada",
              },
              {
                id: "br-lead-flower",
                when: "In range",
                then: "Flower Trick.",
                move: "Flower Trick",
                send: "meowscarada",
              },
              {
                id: "br-lead-fire",
                when: "Fire",
                then: "Leave to Garchomp.",
                send: "garchomp",
              },
            ],
          },
          {
            id: "br-lead-chomp",
            when: "Electric",
            then: "Lead Garchomp.",
            send: "garchomp",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Race and stack Overlord.",
        forks: [
          {
            id: "br-mid-meow",
            when: "This Pokémon is out",
            out: "meowscarada",
            forks: [
              {
                id: "br-mid-uturn",
                when: "Ice gone, want Chomp",
                then: "U-turn into Garchomp.",
                move: "U-turn",
                send: "garchomp",
              },
            ],
          },
          {
            id: "br-mid-chomp",
            when: "This Pokémon is out",
            out: "garchomp",
            forks: [
              {
                id: "br-mid-fang",
                when: "Steel",
                then: "Fire Fang.",
                move: "Fire Fang",
                send: "garchomp",
              },
              {
                id: "br-mid-fairy",
                when: "Fairy",
                then: "Leave to Kingambit.",
                send: "kingambit",
              },
            ],
          },
          {
            id: "br-mid-gambit",
            when: "This Pokémon is out",
            out: "kingambit",
            forks: [
              {
                id: "br-mid-overlord",
                when: "Partner fainted",
                then: "Sucker Punch or Kowtow.",
                send: "kingambit",
              },
            ],
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Speed and Overlord finish.",
        forks: [
          {
            id: "br-late-gambit",
            when: "This Pokémon is out",
            out: "kingambit",
            forks: [
              {
                id: "br-late-sucker",
                when: "They attack",
                then: "Sucker Punch.",
                move: "Sucker Punch",
                send: "kingambit",
              },
            ],
          },
          {
            id: "br-late-meow",
            when: "This Pokémon is out",
            out: "meowscarada",
            forks: [
              {
                id: "br-late-flower",
                when: "Revenge",
                then: "Flower Trick.",
                move: "Flower Trick",
                send: "meowscarada",
              },
            ],
          },
        ],
      },
    ],
  };
}

export const OVERLORD_PIVOT_MANUAL: TeamManual = (() => {
  const core = packCore();
  const packs = [core, packSpecial(), packSpeed(), packPivot(), packBreak()];
  return {
    id: "balance-garchomp-corviknight-kingambit",
    title: "Overlord Pivot",
    lede: "Register six. Preview their six. Bring three. Garchomp breaks, Kingambit closes, and the third slot answers what you saw.",
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
    skills: ["U-turn", "Sucker Punch", "Volt Switch"],
    relatedLessons: ["reading-their-six", "preview", "types", "turns"],
    setsNote:
      "Each Pokémon spends 66 Stat Points at Level 50. Cap is 32 in one stat. Garchomp and Meowscarada race Attack and Speed. Kingambit caps Attack and HP with 0 Speed. Corviknight and Rotom spend bulk. Primarina splits HP and SpD.",
    victims: core.victims,
    counters: core.counters,
    advantages: core.advantages,
    slots: ROSTER.filter((s) => (core.slugs as string[]).includes(s.slug)).sort(
      (a, b) => core.slugs.indexOf(a.slug) - core.slugs.indexOf(b.slug),
    ),
    phases: core.phases!,
    flows: core.flows,
    loops: core.loops,
    hazards: core.hazards,
    box: [...BOX],
    roster: ROSTER,
    core: CORE,
    packs,
  };
})();
