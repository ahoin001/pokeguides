import { train } from "@/content/manual-train";
import type {
  ManualPack,
  SlotManual,
  TeamManual,
} from "@/content/manuals";

const BOX = [
  "ninetales-alola",
  "garchomp",
  "lucario",
  "charizard",
  "primarina",
  "meowscarada",
] as const;

const CORE: [string, string, string] = [
  "ninetales-alola",
  "garchomp",
  "lucario",
];

const ROSTER: SlotManual[] = [
  {
    slug: "ninetales-alola",
    title: "Snow / Veil enabler",
    job: "weather",
    literacy: "setter",
    role: "Creates the defensive environment that lets the rest of the team take risks.",
    primaryJob: "Veil setter, speed control, setup enabler",
    ability: "Snow Warning",
    item: "Light Clay",
    itemWhy: "Extends Aurora Veil so Garchomp or Lucario can take the free turns it creates.",
    nature: "Timid",
    training: train(2, 0, 0, 32, 0, 32, {
      label: "Timid Clay",
      why: "TODO: confirm final EV spread before locking paste. Spe + SpA teaching baseline.",
      spend: ["SpA", "Spe"],
    }),
    moves: [
      {
        name: "Aurora Veil",
        why: "Cuts physical and special damage in Snow — create a safe turn for Garchomp or Lucario.",
      },
      {
        name: "Freeze-Dry",
        why: "Super-effective into Water; keeps Ninetales from being fully passive.",
      },
      {
        name: "Encore",
        why: "Lock a predictable click (setup / recovery / soft move) into a free turn.",
      },
      {
        name: "Blizzard",
        why: "Snow-boosted Ice hit when attacking beats preserving Ninetales.",
      },
    ],
    objective:
      "Get Aurora Veil up when it creates a real advantage, then Encore, attack, or pivot into the teammate that cashes it.",
    howToPlay:
      "Do not auto-Veil turn 1. If they cannot threaten Ninetales, Veil is usually default. If they set up or click something predictable, Encore may be stronger. If Ninetales is already low-value, attack instead of preserving it.",
    gives: ["Snow", "Aurora Veil", "Encore tempo", "Ice offense"],
    answers: ["Passive balance", "Setup-respecting boards", "Water cores Freeze-Dry can punish"],
  },
  {
    slug: "garchomp",
    title: "Physical glue",
    job: "breaker",
    literacy: "wallbreaker",
    role: "Punishes Fire, Rock, Steel, and Electric answers while bridging both weather packages.",
    primaryJob: "Physical attacker / Ground pressure / structural glue",
    ability: "Rough Skin",
    item: "Life Orb",
    itemWhy: "Keeps Chomp as an attacker first — hazard is optional, not the identity.",
    nature: "Jolly",
    training: train(2, 32, 0, 0, 0, 32, {
      label: "Jolly LO",
      why: "TODO: confirm final EV spread. Fast physical teaching baseline.",
      spend: ["Atk", "Spe"],
    }),
    moves: [
      {
        name: "Earthquake",
        why: "Primary Ground — punish Steel, Rock, Fire, Electric.",
      },
      {
        name: "Dragon Claw",
        why: "Reliable Dragon STAB without accuracy or stat-drop drawbacks.",
      },
      {
        name: "Fire Fang",
        why: "Coverage for Steel / Ice / Grass that resist EQ or Dragon Claw.",
      },
      {
        name: "Stealth Rock",
        why: "Only when expected switches make the hazard worth more than another attack.",
      },
    ],
    objective:
      "Force progress without becoming passive utility. Attack first; set Stealth Rock only when the board demands it.",
    howToPlay:
      "Bridge both engines. With Charizard, punish Rock and Electric answers. With Ninetales and Lucario, pressure Steel / Fire / Poison and ride Veil to stay on longer.",
    gives: ["Ground STAB", "Dragon STAB", "Optional Rocks", "Answer-punisher for both Megas"],
    answers: ["Fire", "Rock", "Steel", "Electric"],
  },
  {
    slug: "lucario",
    title: "Mega Lucario Z",
    job: "mega",
    literacy: "sweeper",
    role: "Uses Aurora Veil and forced switches to turn one safe setup turn into an endgame.",
    primaryJob: "Primary setup sweeper",
    ability: "Aura Guard",
    item: "Lucarionite Z",
    itemWhy: "One Mega per battle — Lucario is the Snow/Veil engine's closer.",
    nature: "Timid",
    training: train(2, 0, 0, 32, 0, 32, {
      label: "Timid NP",
      why: "TODO: confirm final EV spread. SpA + Spe teaching baseline for Nasty Plot.",
      spend: ["SpA", "Spe"],
    }),
    moves: [
      {
        name: "Nasty Plot",
        why: "Doubles SpA — turns Lucario from a threat into a cleaner.",
      },
      {
        name: "Aura Sphere",
        why: "Reliable Fighting STAB after Nasty Plot.",
      },
      {
        name: "Flash Cannon",
        why: "Steel coverage for Fairy / Ice / Rock that resist Aura Sphere.",
      },
      {
        name: "Dark Pulse",
        why: "Ghost / Psychic coverage that Fighting cannot clean alone.",
      },
    ],
    objective:
      "Do not expose Lucario early unless necessary. Preserve it until answers are identified or weakened, then Nasty Plot into a sweep.",
    howToPlay:
      "Default partner is Ninetales. Veil makes setup safer — it does not guarantee a free Plot. If a healthy answer remains, attack or switch. Lucario also works without Ninetales when Meowscarada or Garchomp already opened the board.",
    gives: ["Nasty Plot endgame", "Fighting / Steel / Dark coverage", "Mega wincon A"],
    answers: ["Dark", "Psychic", "Normal walls after Plot", "Boards that respect Veil"],
  },
  {
    slug: "charizard",
    title: "Mega Charizard Y",
    job: "mega",
    literacy: "wallbreaker",
    role: "Creates an entirely different offensive package from the Ninetales / Lucario plan.",
    primaryJob: "Secondary Mega / Sun setter / immediate special wallbreaker",
    ability: "Drought",
    item: "Charizardite Y",
    itemWhy: "One Mega per battle — Charizard is the Sun engine, not a partner for Ninetales.",
    nature: "Modest",
    training: train(2, 0, 0, 32, 0, 32, {
      label: "Modest Y",
      why: "TODO: confirm final EV spread. Modest matches current Season 6 preference.",
      spend: ["SpA", "Spe"],
    }),
    moves: [
      {
        name: "Solar Beam",
        why: "Instant Grass under Sun — punish Water / Ground / Rock without a charge turn.",
      },
      {
        name: "Flamethrower",
        why: "Reliable Sun-boosted Fire — forces immediate respect.",
      },
      {
        name: "Air Slash",
        why: "Flying STAB when Fire is resisted.",
      },
      {
        name: "Roost",
        why: "Buy turns so Charizard keeps forcing switches instead of being a one-and-done.",
      },
    ],
    objective:
      "Create immediate pressure and force the opponent to reveal Fire, Rock, Water, or Dragon answers.",
    howToPlay:
      "Opposite engine to Ninetales — do not bring them together by default. If the board is soft to Sun Fire, Charizard is the primary Mega. Garchomp is the preferred partner to punish Rock / Electric answers.",
    gives: ["Drought", "Sun Fire", "Solar Beam coverage", "Mega wincon B"],
    answers: ["Steel", "Grass", "Ice", "Bug", "boards soft to immediate special Fire"],
  },
  {
    slug: "primarina",
    title: "Water / Fairy anchor",
    job: "support",
    literacy: "wall",
    role: "Defensive and offensive bridge between the two weather engines.",
    primaryJob: "Water/Fairy stabilizer vs Fire / Dragon",
    ability: "Liquid Voice",
    item: "Sitrus Berry",
    itemWhy: "Bulk + recovery for long exchanges; TODO confirm ability if your ruleset differs.",
    nature: "Modest",
    training: train(32, 0, 0, 32, 0, 2, {
      label: "Modest Sitrus",
      why: "TODO: confirm final EV spread. Bulk + SpA teaching baseline.",
      spend: ["HP", "SpA"],
    }),
    moves: [
      {
        name: "Moonblast",
        why: "Fairy STAB into Dragon / Fighting / Dark.",
      },
      {
        name: "Sparkling Aria",
        why: "Water STAB into Fire / Ground / Rock.",
      },
      {
        name: "Aqua Jet",
        why: "Priority finish — not primary damage.",
      },
      {
        name: "Encore",
        why: "Punish setup / recovery and steal tempo.",
      },
    ],
    objective:
      "Water answer without losing Fairy pressure; safer third when neither weather engine is ideal.",
    howToPlay:
      "Bring when Fire, Rock, Dragon, or Ground pressure matters. Anchor, don't disposable-sacrifice. Aqua Jet finishes; Encore turns their recovery/setup into your turn.",
    gives: ["Water", "Fairy", "Priority finish", "Encore"],
    answers: ["Fire", "Dragon", "Ground-oriented lines", "Fighting"],
  },
  {
    slug: "meowscarada",
    title: "Fast disruptor",
    job: "speed",
    literacy: "disruptor",
    role: "No-weather option and speed-based pressure tool.",
    primaryJob: "Fast attacker / item disruption / pivot",
    ability: "Protean",
    item: "Choice Scarf",
    itemWhy: "Speed lock — think about the switch-in before committing a click.",
    nature: "Jolly",
    training: train(2, 32, 0, 0, 0, 32, {
      label: "Jolly Scarf",
      why: "TODO: confirm final EV spread. Fast physical teaching baseline.",
      spend: ["Atk", "Spe"],
    }),
    moves: [
      {
        name: "Flower Trick",
        why: "Always-crit Grass into Water / Ground.",
      },
      {
        name: "Triple Axel",
        why: "Ice coverage for Dragon / Flying / Grass.",
      },
      {
        name: "Knock Off",
        why: "Strip items so defensive pieces become easier to wear down.",
      },
      {
        name: "U-turn",
        why: "Damage + pivot into the teammate that wins the next exchange.",
      },
    ],
    objective:
      "Provide speed, item disruption, and positioning when weather is unnecessary or awkward.",
    howToPlay:
      "Gain information. Knock Off when the item matters; U-turn on expected switches; attack when they cannot absorb. Do not Choice-lock without reading the incoming mon.",
    gives: ["Scarf speed", "Knock Off", "U-turn pivot", "Grass / Ice / Dark pressure"],
    answers: ["Water", "Ground", "item-reliant walls", "anti-weather boards"],
  },
];

const bySlug = (slug: string) => ROSTER.find((s) => s.slug === slug)!;

const PACKS: ManualPack[] = [
  {
    id: "pack-a",
    label: "Veil Lucario",
    when:
      "Opponent's Lucario answers are manageable via Garchomp, and Mega Lucario has a plausible safe setup path.",
    identity: "Snow support → Garchomp pressure → Mega Lucario converts.",
    slugs: ["ninetales-alola", "garchomp", "lucario"],
    endgameIds: ["veil-lucario"],
    strategy: {
      opponentPattern:
        "Manageable Lucario answer; cannot immediately punish Ninetales + Garchomp; or passive pieces Encore can lock.",
      bring: ["ninetales-alola", "garchomp", "lucario"],
      purpose: "Create a safe setup environment for Mega Lucario.",
      targets: [
        "Steel that Garchomp pressures",
        "Fire that dislikes Garchomp",
        "Dark / Psychic Lucario Dark Pulses",
        "Passive pieces Encore can lock",
      ],
      refuses: [
        "Multiple ways to overwhelm Ninetales before Veil matters",
        "Assuming Veil guarantees Nasty Plot",
        "Exposing Lucario while answers are healthy and unrevealed",
      ],
      winCondition: "Veil creates favorable turns → Mega Lucario Nasty Plot cleans.",
      gamePlan:
        "Break: Garchomp attacks or forces answers. Control: Ninetales Veil/Encore. Finish: Mega Lucario sets up and sweeps.",
      mantra: "Veil creates the opportunity; Garchomp creates the opening; Lucario cashes it in.",
      turnChecklist: [
        "Name their best Lucario answer",
        "Veil vs Encore on the first click",
        "Do not burn Garchomp HP before Lucario's endgame",
        "Set up Lucario only when the response is understood",
        "Once Lucario cleans, stop gambling",
      ],
    },
    roles: [
      { slug: "ninetales-alola", macro: "Support", micro: "Snow + Veil, then Encore or attack." },
      {
        slug: "garchomp",
        macro: "Breaker",
        micro: "Pressure Fire / Steel / Rock / Electric before Lucario.",
      },
      {
        slug: "lucario",
        macro: "Finisher",
        micro: "One safe Nasty Plot → broad coverage cleans.",
      },
    ],
    loops: [
      {
        title: "Veil → pressure → setup",
        body: "If Veil sticks, use Garchomp to force their Lucario answer. When that answer is weak or out, Lucario Plots.",
      },
      {
        title: "Encore → free turn",
        body: "Lock a soft click with Encore, then send Garchomp or Lucario into the free turn.",
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead Ninetales",
        forks: [
          {
            id: "lead-0",
            when: "They cannot immediately threaten Ninetales.",
            then: "Aurora Veil, then decide Garchomp vs Lucario.",
          },
          {
            id: "lead-1",
            when: "They will setup / recover / click something predictable.",
            then: "Encore first, then steal positioning.",
          },
          {
            id: "lead-2",
            when: "They threaten big immediate damage.",
            then: "Do not blind Veil — attack, Encore, or preserve.",
          },
        ],
      },
      {
        id: "mid",
        title: "Garchomp pressure",
        forks: [
          {
            id: "mid-0",
            when: "Fire / Rock / Steel / Electric enters.",
            then: "Attack with the right Garchomp move — not Rocks by default.",
          },
          {
            id: "mid-1",
            when: "They are clearly saving the Lucario answer.",
            then: "Preserve Garchomp and chip into a safer Lucario entry.",
          },
        ],
      },
      {
        id: "late",
        title: "Lucario finish",
        forks: [
          {
            id: "late-0",
            when: "Lucario survives their strongest response after Plot.",
            then: "Nasty Plot and attack.",
          },
          {
            id: "late-1",
            when: "Setup is still unsafe.",
            then: "Do not force Plot — reopen with Garchomp or Ninetales.",
          },
        ],
      },
    ],
    hazards: [],
  },
  {
    id: "pack-b",
    label: "Sun Charizard",
    when:
      "They dislike Sun-boosted Fire (Steel / Grass / Ice / Bug) or their Charizard answers fold to Garchomp + Primarina.",
    identity: "Immediate Sun offense — not Veil setup.",
    slugs: ["charizard", "garchomp", "primarina"],
    endgameIds: ["sun-charizard"],
    strategy: {
      opponentPattern:
        "Lucario answers soft to Charizard Fire, or Fire-resistant structure Garchomp + Primarina can dismantle.",
      bring: ["charizard", "garchomp", "primarina"],
      purpose: "Force immediate defensive decisions with Charizard, then punish answers.",
      targets: [
        "Steel",
        "Grass",
        "Ice",
        "Bug",
        "Water / Rock answers Solar Beam or Garchomp can pressure",
      ],
      refuses: [
        "Do not bring Ninetales into this three by default — Snow undoes Sun",
        "Do not stay in on obvious Rock / Electric just because Sun is up",
        "Do not treat Charizard as disposable if it is your only break",
      ],
      winCondition: "Reveal and weaken Charizard answers → Charizard or a partner finishes.",
      gamePlan:
        "Break: Charizard Sun pressure. Control: Garchomp punishes Rock/Electric; Primarina stabilizes Water/Fire/Dragon. Finish: Charizard or surviving partner closes.",
      mantra: "Sun creates pressure; Garchomp punishes the answers; Primarina keeps the package standing.",
      turnChecklist: [
        "Name their safest Charizard switch-in",
        "Do not waste Sun turns on low-value clicks",
        "Garchomp on Rock / Electric",
        "Primarina on Water / Fire / Dragon pressure",
        "Preserve whoever they failed to answer",
      ],
    },
    roles: [
      {
        slug: "charizard",
        macro: "Breaker",
        micro: "Drought + Fire force the first defensive commit.",
      },
      {
        slug: "garchomp",
        macro: "Answer-punisher",
        micro: "Punish Rock / Electric; pressure Fire-resistant targets.",
      },
      {
        slug: "primarina",
        macro: "Anchor",
        micro: "Absorb Fire / Water / Dragon / Ground lines and retaliate.",
      },
    ],
    loops: [
      {
        title: "Charizard → answer → Garchomp",
        body: "Rock or Electric into Charizard reveals the Garchomp entry — punish the specific answer they needed.",
      },
      {
        title: "Charizard → Water → Primarina",
        body: "Repeated Water denial → Primarina takes over; once that Water is weak, Charizard is harder to stop.",
      },
      {
        title: "Sun → forced switch → attack",
        body: "On a forced switch, pick Solar Beam vs Flamethrower vs Air Slash for the likely incoming mon.",
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead Charizard",
        forks: [
          {
            id: "lead-0",
            when: "No obvious immediate Rock / Electric threat.",
            then: "Attack aggressively and force the first defensive commitment.",
          },
          {
            id: "lead-1",
            when: "They lead a likely Charizard answer.",
            then: "Avoid free damage — move to Garchomp or Primarina.",
          },
        ],
      },
      {
        id: "mid",
        title: "Punish the answer",
        forks: [
          {
            id: "mid-0",
            when: "Rock enters.",
            then: "Garchomp Ground unless Primarina is clearly safer.",
          },
          {
            id: "mid-1",
            when: "Water enters.",
            then: "Primarina or Charizard Solar Beam depending on the specific threat.",
          },
        ],
      },
      {
        id: "late",
        title: "Finish",
        forks: [
          {
            id: "late-0",
            when: "Charizard counters are weakened.",
            then: "Keep Charizard alive and close with immediate damage.",
          },
          {
            id: "late-1",
            when: "Charizard is no longer the best finisher.",
            then: "Let Garchomp or Primarina finish — do not force Charizard.",
          },
        ],
      },
    ],
    hazards: [],
  },
  {
    id: "pack-c",
    label: "Fast No-Weather",
    when:
      "Both weather plans look awkward, they have anti-weather structure, or speed + Knock Off beats setup.",
    identity: "Speed, disruption, direct pressure — no weather setter.",
    slugs: ["meowscarada", "garchomp", "lucario"],
    endgameIds: ["fast-physical"],
    strategy: {
      opponentPattern:
        "Punishes Ninetales or Charizard, but folds to fast Grass / Dark / Ice / Ground / Fighting.",
      bring: ["meowscarada", "garchomp", "lucario"],
      purpose: "Remove items, force switches, create a Lucario or Garchomp endgame.",
      targets: [
        "Water via Flower Trick",
        "Dragon / Flying via Triple Axel",
        "Item-dependent walls via Knock Off",
        "Ghost / Psychic via Knock Off or Lucario Dark Pulse",
      ],
      refuses: [
        "Ignoring their fastest threat when Scarf Meowscarada is your speed control",
        "Choice-locking without reading the switch",
        "Boards that comfortably absorb this physical suite",
      ],
      winCondition:
        "Meowscarada speed + disruption exposes structure → Garchomp or Mega Lucario finishes.",
      gamePlan:
        "Break: Meowscarada Knock Off / attack. Control: Garchomp Ground pressure. Finish: Lucario opening or Garchomp clean.",
      mantra: "No weather needed: disrupt, pressure, then finish.",
      turnChecklist: [
        "Name their fastest Pokémon",
        "Name the highest-value item to strip",
        "U-turn when info > damage",
        "Preserve the mon that wins the final speed/coverage exchange",
        "Do not force Lucario setup if direct attacks already win",
      ],
    },
    roles: [
      {
        slug: "meowscarada",
        macro: "Disruptor",
        micro: "Speed, Knock Off, U-turn to expose the plan.",
      },
      {
        slug: "garchomp",
        macro: "Breaker",
        micro: "Punish Ground- or Steel-weak answers Meowscarada exposes.",
      },
      {
        slug: "lucario",
        macro: "Finisher",
        micro: "Exploit the weakened structure with special coverage.",
      },
    ],
    loops: [
      {
        title: "Knock Off → exploit",
        body: "Strip the key item, then send Garchomp or Lucario into the newly soft target.",
      },
      {
        title: "U-turn → favorable attacker",
        body: "On an expected switch, U-turn into the teammate that punishes the incoming mon.",
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead Meowscarada",
        forks: [
          {
            id: "lead-0",
            when: "You can safely strip an important item.",
            then: "Knock Off.",
          },
          {
            id: "lead-1",
            when: "You expect a switch.",
            then: "U-turn into the punisher.",
          },
          {
            id: "lead-2",
            when: "Flower Trick or Triple Axel is free.",
            then: "Attack directly.",
          },
        ],
      },
      {
        id: "mid",
        title: "Pressure",
        forks: [
          {
            id: "mid-0",
            when: "Garchomp wins the mon Meowscarada exposed.",
            then: "Bring Garchomp and attack — Rocks only if switches demand it.",
          },
          {
            id: "mid-1",
            when: "Their Lucario answer is weak or gone.",
            then: "Preserve Lucario for the endgame.",
          },
        ],
      },
      {
        id: "late",
        title: "Clean",
        forks: [
          {
            id: "late-0",
            when: "Lucario outspeeds or survives after Plot.",
            then: "Nasty Plot and finish.",
          },
          {
            id: "late-1",
            when: "Garchomp has the cleaner matchup.",
            then: "Keep Lucario unused; Garchomp closes.",
          },
        ],
      },
    ],
    hazards: [],
  },
  {
    id: "pack-d",
    label: "Bulky Three-Way Balance",
    when: "Mixed offensive threats; neither weather engine has a clear target.",
    identity: "Water/Fairy + Ground/Dragon + Grass/Dark — no Mega required.",
    slugs: ["primarina", "garchomp", "meowscarada"],
    endgameIds: ["chip-and-finish"],
    strategy: {
      opponentPattern:
        "Mixed threats answered by Water/Fairy, Ground/Dragon, and fast Grass/Dark.",
      bring: ["primarina", "garchomp", "meowscarada"],
      purpose: "Win via coverage, positioning, Knock Off, and repeated favorable exchanges.",
      targets: [
        "Fire via Primarina",
        "Water / Ground via Meowscarada",
        "Electric / Steel via Garchomp",
        "Dragon via Primarina or Triple Axel",
      ],
      refuses: [
        "Clear Mega-based setup that needs Lucario or Charizard to answer",
        "Burning Meowscarada HP when its speed is still needed",
        "Sacrificing Primarina before their Fire / Dragon is accounted for",
      ],
      winCondition: "Force favorable exchanges until one remaining mon cleans.",
      gamePlan:
        "Break: Meowscarada + Garchomp force coverage checks. Control: Primarina stabilizes Fire/Water/Dragon. Finish: preserve the strongest surviving attacker.",
      mantra: "Do not force a sweep; win three favorable exchanges.",
      turnChecklist: [
        "Name their biggest Fire / Water / Dragon / Electric threats",
        "Preserve the unique answer to the biggest threat",
        "Knock Off before long defensive exchanges",
        "Aqua Jet only when it changes the KO race",
        "Pick the cleaner from the board, not the original plan",
      ],
    },
    roles: [
      {
        slug: "primarina",
        macro: "Anchor",
        micro: "Stabilize Fire / Water / Dragon / Fighting.",
      },
      {
        slug: "garchomp",
        macro: "Breaker",
        micro: "Ground / Dragon pressure; punish Steel / Rock / Electric.",
      },
      {
        slug: "meowscarada",
        macro: "Speed / disruption",
        micro: "Strip items, pressure Water / Ground, pivot.",
      },
    ],
    loops: [
      {
        title: "Knock Off → safer exchange",
        body: "Meowscarada strips the item, then the teammate that now wins the exchange enters.",
      },
      {
        title: "Primarina → Garchomp",
        body: "Poison / Electric / Steel into Primarina → look for the Garchomp punish.",
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Choose the information lead",
        forks: [
          {
            id: "lead-0",
            when: "Vulnerable Water / Ground.",
            then: "Lead Meowscarada; threaten Flower Trick.",
          },
          {
            id: "lead-1",
            when: "Obvious Fire or Dragon pressure.",
            then: "Consider Primarina lead.",
          },
          {
            id: "lead-2",
            when: "Soft Steel / Rock / Electric structure.",
            then: "Consider Garchomp lead.",
          },
        ],
      },
      {
        id: "mid",
        title: "Rotate answers",
        forks: [
          {
            id: "mid-0",
            when: "Only one teammate comfortably handles the revealed threat.",
            then: "Protect that teammate; use the other two to open.",
          },
        ],
      },
      {
        id: "late",
        title: "Select the cleaner",
        forks: [
          {
            id: "late-0",
            when: "Meowscarada still owns speed.",
            then: "Preserve it; clean with Flower Trick / Triple Axel / positioning.",
          },
          {
            id: "late-1",
            when: "Garchomp has the broadest remaining coverage.",
            then: "Keep Garchomp healthy and close.",
          },
          {
            id: "late-2",
            when: "Primarina hits everything left neutrally or better.",
            then: "Preserve Primarina; Aqua Jet only for final KOs.",
          },
        ],
      },
    ],
    hazards: [],
  },
];

export const SNOW_SUN_DUAL_ENGINE_MANUAL: TeamManual = {
  id: "snow-sun-dual-engine",
  title: "Snow & Sun Dual Engine",
  format: "singles",
  lede:
    "Two battle plans on one six: Ninetales-A opens setup for Mega Lucario; Mega Charizard Y runs a separate Sun offense. Garchomp, Primarina, and Meowscarada connect the engines and give strong non-Mega threes.",
  sixSummary:
    "The opponent cannot prep for only one game plan. Snow + Veil + Lucario, Sun + Charizard + Garchomp, or Meowscarada / Primarina no-weather pressure — preview picks which three attacks their structure.",
  philosophy:
    "Do not lock your three before reading their six. Identify which package attacks their structure, then bring those three. The two Mega candidates are alternate win conditions — not partners that must share a battle.",
  archetype: "balance",
  family: "weather",
  pilot: {
    thesis: "Pick the engine that bullies their six — Snow/Veil, Sun, or no-weather.",
    rule: "One Mega per battle. Do not bring Ninetales and Charizard together by default.",
    fail: "Auto-picking a weather package when Meowscarada / Primarina / Garchomp already wins the preview.",
  },
  slugs: CORE,
  meta:
    "Season 6 M-C Singles · Garchomp / Primarina / Meowscarada / Charizard / Ninetales-A ladder presence · Charizardite Y dominant Charizard Mega · EV spreads marked TODO until re-benchmarked",
  relatedLessons: ["preview", "weather", "building"],
  setsNote:
    "SP spreads are teaching baselines — confirm EVs before locking a competitive paste. Primarina ability assumed Liquid Voice; verify for your ruleset.",
  box: [...BOX],
  roster: ROSTER,
  core: CORE,
  slots: CORE.map(bySlug),
  construction: {
    thesis:
      "Build the six around two genuinely different Mega-centered engines — not a six that must all work together every game.",
    method:
      "At preview: Snow + Veil + Lucario vs Sun + Charizard + Garchomp vs no-weather Meowscarada / Primarina. Never pick a package only because the individuals are strong.",
    winCondition:
      "Create a favorable board with Veil, Sun, Knock Off, or forced switches — then preserve the Mega that finishes once answers are weak or revealed.",
    endgames: [
      {
        id: "veil-lucario",
        label: "Aurora Veil Lucario sweep",
        path: "ninetales-alola → garchomp → lucario",
        how: "Snow + Veil → Garchomp weakens Steel/Fire answers → Mega Lucario finds a real Nasty Plot turn. Veil is not an automatic setup button.",
      },
      {
        id: "sun-charizard",
        label: "Sun Charizard wallbreak",
        path: "charizard → garchomp → primarina",
        how: "Drought pressure → force switches → Garchomp punishes Rock/Electric → Primarina stabilizes. Charizard need not sweep; weakening two answers can be enough.",
      },
      {
        id: "fast-physical",
        label: "Fast no-weather pressure",
        path: "meowscarada → garchomp → lucario",
        how: "When both weathers are awkward — Meowscarada info/Knock Off → Garchomp → Lucario or Garchomp finishes.",
      },
      {
        id: "chip-and-finish",
        label: "Progressive chip",
        path: "meowscarada → garchomp → primarina",
        how: "Knock Off / U-turn → Garchomp pressure or Rocks → Primarina forces defensive responses → a Mega finishes if needed. Do not chase a one-turn sweep.",
      },
    ],
    altSlots: [],
  },
  megaPool: {
    rule: "One Mega Evolution per battle. Lucario and Charizard both hold stones — pick at preview.",
    previewPressure:
      "If they prep Mega Lucario / Veil, lean Sun Charizard. If they prep Charizard Y, lean Veil Lucario or no-weather.",
    cost: "The unused Mega still occupies its item slot — the ambiguity is intentional.",
    candidates: [
      {
        slug: "lucario",
        stone: "Lucarionite Z",
        when: "Snow/Veil path is live and they cannot stop one Plot turn.",
      },
      {
        slug: "charizard",
        stone: "Charizardite Y",
        when: "Immediate Sun Fire pressure beats setup, or Lucario answers are soft to Fire.",
      },
    ],
  },
  evidence: {
    season: "Season 6 M-C Singles",
    asOf: "2026-09-19",
    source: "Pokémon Zone ranked Singles · Champions Battle Data · PokeTools",
    caveat:
      "Usage and move popularity support construction — not a claim of proven best win rate. EV spreads remain TODO.",
    ladderTop: [
      "Garchomp #2",
      "Primarina #3",
      "Meowscarada #12",
      "Charizard #15",
      "Ninetales-A #23",
    ],
  },
  packs: PACKS,
  press: [
    "Soft Lucario answers",
    "Steel / Grass soft to Sun Fire",
    "Passive balance Encore can lock",
    "Anti-weather boards soft to Scarf Meowscarada",
  ],
  refuse: [
    "Hard dual Mega answers with no soft target",
    "Boards that auto-punish both Ninetales and Charizard leads",
  ],
  switches: [
    { into: "Rock / Electric (into Charizard)", send: "garchomp" },
    { into: "Water (into Charizard)", send: "primarina" },
    { into: "Fire / Steel (into Lucario path)", send: "garchomp" },
    { into: "Setup / recovery", send: "ninetales-alola" },
  ],
  phases: [
    {
      id: "preview",
      title: "Preview",
      lede: "Engine first — then the three.",
      branches: [
        {
          when: "They cannot stop Veil + Lucario setup.",
          then: "Pack A — Veil Lucario.",
        },
        {
          when: "They are soft to Sun Fire or Lucario answers hate Charizard.",
          then: "Pack B — Sun Charizard.",
        },
        {
          when: "Both weathers look awkward.",
          then: "Pack C Fast No-Weather or Pack D Bulky Balance.",
        },
      ],
    },
  ],
  loops: [
    {
      title: "Package selection",
      body: "Preview → name their wincon → name what stops your Mega → pick the package that attacks those answers → preserve the mon that wins the final exchange.",
    },
    {
      title: "Answer-punishment",
      body: "They reveal an answer → ask which teammate punishes it → switch or attack into that punish → reassess.",
    },
    {
      title: "Weather decision",
      body: "Does Snow or Sun improve the next three turns? If neither, use Meowscarada / Garchomp / Primarina.",
    },
    {
      title: "Mega preservation",
      body: "Before sacrificing a Mega candidate, ask whether the remaining two can still win. If not, preserve the Mega.",
    },
    {
      title: "Setup",
      body: "Name the setup target → name its answer → weaken or lock that answer → take the safe setup turn → attack until they cannot answer.",
    },
  ],
  hazards: [
    {
      title: "Do not run both weather engines by default",
      body: "Ninetales-A and Mega Charizard Y are alternate anchors. Snow supports Veil; Sun supports Charizard. Bringing both without a reason undoes one engine.",
    },
    {
      title: "Mega choice is made at preview",
      body: "Only one Mega per battle. The unused stone still forces respect for a different package.",
    },
    {
      title: "Do not overvalue Stealth Rock",
      body: "Garchomp is an attacker first. Set Rocks only when expected switches make the hazard worth more than a hit.",
    },
    {
      title: "Veil is not an automatic setup button",
      body: "Aurora Veil cuts damage — it does not remove status, typing, or force-outs. Lucario still needs a real Plot turn.",
    },
    {
      title: "Choice Scarf commitment",
      body: "Meowscarada locks into one move until it switches. Read the incoming mon before clicking.",
    },
    {
      title: "Information before damage",
      body: "Encore, Knock Off, U-turn, and safe switches often matter more than maximum turn-1 damage.",
    },
  ],
};
