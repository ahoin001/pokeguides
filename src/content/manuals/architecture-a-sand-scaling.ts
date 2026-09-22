import { train, type TeamManual } from "@/content/manuals";

const BOX = [
  "tyranitar-mega",
  "excadrill",
  "sneasler",
  "corviknight",
  "milotic",
  "gholdengo",
] as const;

const PACK_SAND = "sand-engine";
const PACK_COACH = "sand-coaching";
const PACK_FORTRESS = "corviknight-scaling";
const PACK_ANTI_RAIN = "anti-rain";
const PACK_ESCAPE = "gholdengo-escape";
const PACK_MIXED = "mixed-scaling";
const PACK_STARAPTOR = "staraptor-sand-tempo";
const PACK_PSYCHIC = "psychic-sand-scaling";

const SP_NOTE =
  "Starting architecture spend (66 SP, max 32). Recommended configuration — not claimed as mathematically optimal vs every M-C threshold.";

export const ARCHITECTURE_A_SAND_SCALING_MANUAL = {
  id: "architecture-a-sand-scaling-manual",
  title: "Architecture A — Sand Scaling",
  lede: "A four-Pokémon package engine built around Sand, Sand Rush, Coaching, Competitive control and two independent scaling endgames.",
  format: "doubles",
  philosophy:
    "Do not pilot this as a Tyranitar + Excadrill combo. Pilot it as a strategy generator. Sand creates the state, Excadrill converts it into speed, Sneasler converts temporary openings into permanent stats, Corviknight converts those gains into a durable endgame, Milotic controls the opponent's speed and Intimidate game, and Gholdengo supplies an independent special win condition.",
  archetype: "balance",
  family: "weather",
  meta: "Champions Doubles, Regulation M-C (began September 9, 2026). 66 Stat Points, max 32 in one stat, level 50, one Mega Evolution per battle; duplicate held items are not allowed.",
  setsNote: SP_NOTE,
  press: ["Sand", "Sand Rush", "Coaching", "Dual endgames"],
  pilot: {
    thesis:
      "Can we create a favorable first state with Sand or control, convert that tempo into Coaching or Nasty Plot, then finish through Sand Rush, Corviknight scaling, or Gholdengo special damage?",
    rule: "Start with a four-Pokémon package. Sand is a state, not the win condition.",
    fail: "Refreshing Sand for its own sake, bringing Excadrill into every Rain board, or Mega Evolving without a package reason.",
  },
  box: [...BOX],
  core: ["tyranitar-mega", "excadrill", "sneasler"],
  slugs: ["tyranitar-mega", "excadrill", "sneasler", "corviknight"],
  slots: [],
  phases: [
    {
      id: "preview",
      title: "Preview — Choose the Engine",
      lede: "Ask which state matters most.",
      branches: [
        {
          when: "Sand, speed control, Competitive, physical scaling, or special scaling?",
          then: "Choose the four that maximize that package — not the six that look strongest on paper.",
        },
        {
          when: "Rain or multiple Sand answers visible?",
          then: "Prefer Tyranitar + Milotic + Sneasler + Gholdengo. Excadrill is no longer automatic.",
        },
      ],
    },
    {
      id: "opening",
      title: "Opening — Manufacture Advantage",
      branches: [
        {
          when: "Weather control or Rock/Dark pressure matters",
          then: "Establish Sand, deny their weather, or create the first safe Coaching / Icy Wind / Nasty Plot window.",
        },
        {
          when: "Sand is already favorable",
          then: "Do not expose Tyranitar merely to refresh it.",
        },
      ],
    },
    {
      id: "conversion",
      title: "Conversion — Tempo Into Resources",
      branches: [
        {
          when: "A stronger conversion exists than the immediate KO",
          then: "Spend the advantage on Coaching, speed control, or setup — not autopilot damage.",
        },
        {
          when: "The partner can already finish",
          then: "Attack. Coaching is an investment, not a mandatory click.",
        },
      ],
    },
    {
      id: "scaling",
      title: "Scaling — Harden the Board",
      branches: [
        {
          when: "Corviknight has a safe Bulk Up path",
          then: "Stop playing for small trades; protect the emerging endgame.",
        },
        {
          when: "Gholdengo has a Nasty Plot window",
          then: "Manufacture and spend that turn — do not force it into double-target.",
        },
      ],
    },
    {
      id: "finish",
      title: "Finish — Compress",
      branches: [
        {
          when: "Their answers are removed or weakened",
          then: "Power Trip, Make It Rain, Sand Rush attacks, or Milotic control — stop creating complexity.",
        },
      ],
    },
  ],
  loops: [
    {
      title: "Sand → Speed",
      body: "Tyranitar creates Sand; Excadrill becomes the speed converter.",
    },
    {
      title: "Speed → Coaching",
      body: "Excadrill's speed advantage forces defensive play, allowing Sneasler to Coach.",
    },
    {
      title: "Coaching → Corviknight",
      body: "Permanent boosts make Bulk Up / Power Trip arrive faster.",
    },
    {
      title: "Failure → Alternate Route",
      body: "If Sand fails, Milotic control. If physical scaling fails, Gholdengo. If setup fails, direct Sand pressure.",
    },
  ],
  hazards: [
    {
      title: "Do not confuse Sand with the win condition",
      body: "Ask what advantage Sand creates before it disappears — not whether you can keep it forever.",
    },
    {
      title: "Do not bring Excadrill automatically",
      body: "Against Rain or repeated weather overwrite, Excadrill loses its engine. Anti-Rain deliberately omits it.",
    },
    {
      title: "Do not Coach automatically",
      body: "Coaching only pays when the recipient can exploit the boost for multiple turns.",
    },
    {
      title: "Corviknight requires patience",
      body: "Bulk Up + Roost only after their answer is understood. Setting up into the hard counter donates turns.",
    },
    {
      title: "Gholdengo is the escape hatch",
      body: "If preview prepares for Sand, do not give them the Sand game they built for.",
    },
    {
      title: "Mega resource",
      body: "Tyranitar is the default Mega. One Mega per battle — tie the click to the package win condition.",
    },
  ],
  commandments: [
    "Sand is a state, not the win condition.",
    "Select a package of four — never force all six into one plan.",
    "Coach the Pokémon most likely to remain on the field, not the flashiest attacker.",
    "If they prepared for Sand, punish the preparation with Gholdengo / Milotic.",
    "Do not Mega simply because the stone is available.",
  ],
  architecture: [
    {
      title: "Engine",
      body: "Weather setter plus Sand Rush converter.",
      slugs: ["tyranitar-mega", "excadrill"],
    },
    {
      title: "Converter",
      body: "Temporary tempo into permanent Attack and Defense.",
      slugs: ["sneasler"],
    },
    {
      title: "Endgames",
      body: "Physical scaling and independent special escape.",
      slugs: ["corviknight", "gholdengo"],
    },
    {
      title: "Control",
      body: "Competitive, Icy Wind, Water stabilizer after Sand expires.",
      slugs: ["milotic"],
    },
  ],
  engines: [
    {
      id: "sand-rush-collapse",
      label: "Sand Rush Collapse",
      path: [
        "Tyranitar · Sand Stream",
        "Excadrill · Sand Rush speed",
        "Excadrill · High Horsepower / Iron Head / Rock Slide",
        "Optional · Protect to preserve Sash",
        "Transition · Coaching or Corviknight if the game slows",
      ],
      how: "Sand is a temporary speed regime, not a sweep timer. Excadrill needs to force losing exchanges for the opponent — KOs, forced Protects, or free Coaching windows — while Sand is up. Preserve Focus Sash until the critical exchange. If Sand is overwritten mid-line, stop treating Excadrill as the primary converter and pivot to Milotic control or Gholdengo.",
      dependsOn: "Sand active and Excadrill healthy enough to act under Sand Rush",
      disrupt: "Rain / Sun overwrite, strong Water/Ground into Excadrill, or Sash broken before the key turn",
      fallback: "Icy Wind from Milotic, Unburden from Sneasler, or abandon Sand Rush for the Gholdengo package",
    },
    {
      id: "coached-corviknight",
      label: "Coached Corviknight",
      path: [
        "Sneasler · Coaching",
        "Corviknight · Brave Bird (while answering)",
        "Weaken their Corviknight answer",
        "Corviknight · Bulk Up",
        "Corviknight · Roost",
        "Corviknight · Power Trip",
      ],
      how: "First use Corviknight as a normal defensive attacker. Do not reveal Bulk Up + Roost as the entire plan while their hard answer is untouched. Once that answer is removed or weakened, begin Bulk Up cycles and convert accumulated boosts through Power Trip. Coaching accelerates the timeline; Mirror Armor punishes Intimidate attempts into the scaling piece.",
      dependsOn: "Their Corviknight answer identified and weakened; Sneasler or free turns available",
      disrupt: "Strong Electric / Fire pressure, phazing, or forcing Corviknight to die before Bulk Up sticks",
      fallback: "Keep Corviknight as a defensive piece and win through Gholdengo or Sand Rush instead",
    },
    {
      id: "gholdengo-special",
      label: "Nasty Plot Gholdengo",
      path: [
        "Tempo / control turn manufactured",
        "Gholdengo · Nasty Plot",
        "Gholdengo · Make It Rain",
        "Gholdengo · Shadow Ball / Protect",
      ],
      how: "Abandon the Sand win condition once they overcommit to answering it. Nasty Plot is scarce — create the turn with Icy Wind, Coaching pressure, Protect, or weather denial rather than demanding Gholdengo invent it alone. If a target is exposed, attack first; setup is optional when raw Make It Rain already wins the exchange.",
      dependsOn: "One safe setup turn or an opponent that cannot switch into Make It Rain",
      disrupt: "Fast Dark / Ghost pressure, immediate double-target, or forcing Protect every turn",
      fallback: "Direct Life Orb damage without setup, or return to physical scaling",
    },
    {
      id: "milotic-control",
      label: "Milotic Control Endgame",
      path: [
        "Milotic · receive Intimidate → Competitive",
        "Milotic · Icy Wind",
        "Milotic · Recover",
        "Milotic · Muddy Water / Hypnosis",
      ],
      how: "Use when their physical attackers and speed control matter more than immediate Sand offense. Competitive turns Intimidate into Special Attack. Icy Wind creates weather-independent speed for Excadrill, Sneasler, or Gholdengo. Do not reveal Hypnosis early — spend free turns on Recover and speed control first.",
      dependsOn: "Intimidate or physical boards where Competitive and Water typing matter",
      disrupt: "Strong Grass / Electric pressure, or status locking Milotic out of Recover cycles",
      fallback: "Gholdengo special collapse or Sand Engine if weather is still available",
    },
    {
      id: "dual-scaler",
      label: "Dual Scaling",
      path: [
        "Sneasler · Coaching (physical axis)",
        "Corviknight · Bulk Up path",
        "Gholdengo · Nasty Plot threat",
        "Force them to pick an axis",
      ],
      how: "Develop both physical and special scaling so answering one leaves the other free. Do not split damage evenly — identify the weaker defensive axis and compress into it while the other route remains credible.",
      dependsOn: "Both Corviknight and Gholdengo healthy enough to threaten",
      disrupt: "Immediate hyper offense that denies both setup windows",
      fallback: "Collapse into a single clearer endgame rather than half-building both",
    },
  ],
  network: {
    thesis:
      "Sand creates speed → speed creates action advantage → Coaching converts that into permanent stats → Corviknight or Gholdengo finishes.",
    edges: [
      {
        from: "tyranitar-mega",
        to: "excadrill",
        creates: "Sand",
        converts: "Sand Rush speed",
        engineId: "sand-rush-collapse",
      },
      {
        from: "excadrill",
        to: "sneasler",
        creates: "Forced Protect / speed pressure",
        converts: "Safe Coaching turn",
        engineId: "coached-corviknight",
      },
      {
        from: "sneasler",
        to: "corviknight",
        creates: "Coaching Atk/Def",
        converts: "Bulk Up + Power Trip endgame",
        engineId: "coached-corviknight",
      },
      {
        from: "sneasler",
        to: "excadrill",
        creates: "Coaching",
        converts: "Stronger Sand Rush conversion",
        engineId: "sand-rush-collapse",
      },
      {
        from: "sneasler",
        to: "tyranitar-mega",
        creates: "Coaching",
        converts: "Harder Rock Slide / Knock Off midgame",
      },
      {
        from: "milotic",
        to: "gholdengo",
        creates: "Icy Wind speed differential",
        converts: "Safer Nasty Plot",
        engineId: "gholdengo-special",
      },
      {
        from: "milotic",
        to: "excadrill",
        creates: "Icy Wind",
        converts: "Speed outside Sand",
        engineId: "milotic-control",
      },
      {
        from: "tyranitar-mega",
        to: "gholdengo",
        creates: "Weather denial / Knock Off",
        converts: "Neutral board for special setup",
        engineId: "gholdengo-special",
      },
      {
        from: "corviknight",
        to: "gholdengo",
        creates: "Physical overcommitment",
        converts: "Special setup window",
        engineId: "dual-scaler",
      },
      {
        from: "gholdengo",
        to: "corviknight",
        creates: "Special overcommitment",
        converts: "Freer Bulk Up cycles",
        engineId: "dual-scaler",
      },
    ],
  },
  controlPlanes: [
    {
      id: "weather",
      label: "Sand",
      setterSlug: "tyranitar-mega",
      effect: "Overwrite opposing weather; enable Sand Rush",
      whoBenefits: "Excadrill first; whole board via weather denial",
    },
    {
      id: "speed",
      label: "Speed control",
      setterSlug: "excadrill",
      effect: "Sand Rush dominance; Unburden and Icy Wind as weather-independent backups",
      whoBenefits: "Excadrill, Sneasler, Gholdengo",
    },
    {
      id: "stat-control",
      label: "Stat control",
      setterSlug: "sneasler",
      effect: "Coaching raises allies; Competitive punishes Intimidate; Bulk Up self-scales",
      whoBenefits: "Tyranitar, Excadrill, Corviknight, Milotic",
    },
    {
      id: "positioning",
      label: "Positioning",
      setterSlug: "gholdengo",
      effect: "Protect, threat compression, and Good as Gold force predictable answers",
      whoBenefits: "Anyone needing a manufactured setup or Protect turn",
    },
  ],
  previewTrees: [
    {
      ask: "What is their dominant structure?",
      branches: [
        {
          when: "No clear archetype",
          then: "Start from Sand Engine; ask whether Corviknight or Gholdengo is the better fourth.",
          bringPackId: PACK_SAND,
        },
        {
          when: "Pelipper / Archaludon / Basculegion / Swampert / Golisopod",
          then: "Rain Breaker — Tyranitar + Milotic + Sneasler + Gholdengo.",
          bringPackId: PACK_ANTI_RAIN,
        },
        {
          when: "Multiple Intimidate or physical attackers",
          then: "Milotic rises — Competitive turns Intimidate into offense.",
          bringPackId: PACK_COACH,
        },
        {
          when: "No immediate Corviknight pressure",
          then: "Sneasler + Corviknight Fortress endgame.",
          bringPackId: PACK_FORTRESS,
        },
        {
          when: "Multiple Sand answers",
          then: "Cut Excadrill dependence; bring Gholdengo / Milotic.",
          bringPackId: PACK_ESCAPE,
        },
        {
          when: "Priority-heavy offense",
          then: "Consider Indeedee-M flex over Milotic.",
          bringPackId: PACK_PSYCHIC,
        },
      ],
    },
  ],
  matchupScripts: [
    {
      id: "rain",
      foe: "Rain",
      why: "Overwrite weather, then attack rain infrastructure — Excadrill is not automatic.",
      packId: PACK_ANTI_RAIN,
      sequence: {
        title: "Deny → slow → convert",
        beats: [
          { slug: "tyranitar-mega", click: "Overwrite Rain", why: "Sand denial" },
          { slug: "milotic", click: "Icy Wind", why: "Speed control" },
          { slug: "sneasler", click: "Close Combat", why: "Pressure Archaludon" },
          { slug: "gholdengo", click: "Special endgame", why: "If physical route stalls" },
        ],
      },
      trap: "Do not assume Tyranitar alone solves Archaludon or Basculegion.",
    },
    {
      id: "intimidate",
      foe: "Intimidate-heavy physical balance",
      why: "Position Milotic for Competitive while Sneasler develops the physical endgame.",
      packId: PACK_COACH,
      sequence: {
        beats: [
          { slug: "milotic", click: "Receive Intimidate", why: "Competitive" },
          { slug: "sneasler", click: "Coaching" },
          { slug: "excadrill", click: "Convert under Sand or Icy Wind" },
        ],
      },
    },
    {
      id: "anti-sand",
      foe: "Multiple Sand answers",
      why: "Do not fight on their chosen axis — use the special escape hatch.",
      packId: PACK_ESCAPE,
      sequence: {
        beats: [
          { slug: "gholdengo", click: "Nasty Plot or Make It Rain" },
          { slug: "milotic", click: "Icy Wind" },
          { slug: "tyranitar-mega", click: "Selective weather / Knock Off" },
        ],
      },
    },
    {
      id: "fast-offense",
      foe: "Fast offense",
      why: "Establish Sand early; preserve Excadrill's Sash.",
      packId: PACK_SAND,
      sequence: {
        beats: [
          { slug: "tyranitar-mega", click: "Sand" },
          { slug: "excadrill", click: "Sand Rush pressure" },
          { slug: "sneasler", click: "Coach or attack" },
        ],
      },
      trap: "If Sand cannot be held, switch to Icy Wind or Unburden.",
    },
    {
      id: "slow-balance",
      foe: "Slow balance",
      why: "Identify the one mon that removes Corviknight, weaken it, then Bulk Up / Roost.",
      packId: PACK_FORTRESS,
      sequence: {
        beats: [
          { slug: "tyranitar-mega", click: "Knock Off their answer" },
          { slug: "sneasler", click: "Coaching" },
          { slug: "corviknight", click: "Bulk Up → Roost → Power Trip" },
        ],
      },
    },
  ],
  megaPool: {
    rule: "One Mega Evolution per battle.",
    previewPressure:
      "Default Mega is Tyranitar. Staraptor flex adds a second stone — only Mega if that package needs it more than Sand Stream pressure.",
    candidates: [
      {
        slug: "tyranitar-mega",
        stone: "Tyranitarite",
        when: "Default Sand Scaling game",
      },
      {
        slug: "staraptor",
        stone: "Staraptite",
        when: "Staraptor flex — Tailwind / Intimidate package",
      },
    ],
  },
  evidence: {
    season: "Regulation M-C",
    asOf: "2026-09-21",
    source:
      "Champions News M-C rules; community Mega Tyranitar / Milotic / Excadrill / Sneasler / Corviknight cores; M-C Milotic and Gholdengo usage examples",
    caveat:
      "Pokémon, items, abilities and moves are grounded in current M-C examples where cited. Exact Architecture A six, package structure and 66-point spreads are a pilotable starting configuration — not a claim every spread is optimal.",
  },
  construction: {
    thesis:
      "Architecture A is a weather-to-scaling machine: Sand creates speed, speed creates action advantage, Coaching converts that into permanent stats, and Corviknight or Gholdengo turns those resources into an endgame.",
    method:
      "Use packages of four rather than one universal lead. Sand package = engine; Sneasler = converter; Milotic = control valve; Corviknight = physical endgame; Gholdengo = special escape hatch.",
    winCondition:
      "Create a favorable first state with Sand or control, convert into Coaching or Nasty Plot, finish with Sand Rush offense, boosted Corviknight, or Gholdengo spread.",
    endgames: [
      {
        id: "sand-rush-collapse",
        label: "Sand Rush Collapse",
        path: "excadrill",
        how: "Tyranitar → Sand → Excadrill speed → repeated favorable exchanges",
      },
      {
        id: "coached-corviknight",
        label: "Coached Corviknight",
        path: "corviknight",
        how: "Coaching → Bulk Up → Roost → Power Trip",
      },
      {
        id: "gholdengo-special",
        label: "Nasty Plot Gholdengo",
        path: "gholdengo",
        how: "Tempo turn → Nasty Plot → Make It Rain + Shadow Ball",
      },
      {
        id: "milotic-control",
        label: "Milotic Control",
        path: "milotic",
        how: "Competitive → Icy Wind → Recover → Water pressure",
      },
      {
        id: "dual-scaler",
        label: "Dual Scaling",
        path: "corviknight",
        how: "Physical Coaching path while Gholdengo threatens special scaling",
      },
    ],
    altSlots: [
      {
        slug: "staraptor",
        insteadOf: "corviknight",
        why: "Replace slow defensive scaling with immediate Tailwind, Intimidate and active tempo.",
        answers:
          "Speed-control wars, physical offense, and boards that cannot wait for Corviknight to scale.",
        costs: "Loses Roost, Power Trip, defensive scaling and the most durable physical endgame.",
        unlocks: [PACK_STARAPTOR],
        slot: {
          title: "Staraptor",
          job: "speed",
          literacy: "disruptor",
          role: "Tailwind / Intimidate / physical tempo",
          item: "Staraptite",
          itemWhy: "Optional Mega — Tyranitar remains the default Mega candidate.",
          ability: "Intimidate",
          nature: "Jolly",
          training: train(2, 32, 0, 0, 0, 32, {
            label: "Jolly max offense",
            why: "Tailwind infrastructure with real Brave Bird / Close Combat damage.",
            spend: ["2 HP", "32 Atk", "32 Spe"],
            rule: SP_NOTE,
          }),
          moves: [
            { name: "Brave Bird", why: "Immediate Flying pressure." },
            { name: "Close Combat", why: "Immediate Fighting pressure." },
            { name: "Tailwind", why: "Second speed-control regime beside Sand Rush." },
            { name: "Protect", why: "Preserves Staraptor while Tailwind and Intimidate create value." },
          ],
          objective: "Make Sand more flexible with a conventional speed-control mode.",
          howToPlay:
            "Bring when Tailwind beats Corviknight scaling. Do not Mega automatically — Tyranitar usually stays the Mega.",
        },
      },
      {
        slug: "indeedee-male",
        insteadOf: "milotic",
        why: "Replace Water / Icy Wind control with Psychic Terrain, priority denial, Trick and a stronger Corviknight connector.",
        answers: "Priority, Fighting pressure, disruptive items and setup-support boards.",
        costs: "Loses Water damage, Icy Wind, Recover and Competitive anti-Intimidate.",
        unlocks: [PACK_PSYCHIC],
        slot: {
          title: "Indeedee-M",
          job: "support",
          literacy: "disruptor",
          role: "Psychic Terrain / Trick / priority denial",
          item: "Choice Scarf",
          ability: "Psychic Surge",
          nature: "Timid",
          training: train(2, 0, 0, 32, 0, 32, {
            label: "Timid Scarf",
            why: "Terrain setter that can still move first into mid-speed boards.",
            spend: ["2 HP", "32 SpA", "32 Spe"],
            rule: SP_NOTE,
          }),
          moves: [
            { name: "Expanding Force", why: "Converts Psychic Terrain into spread Psychic pressure." },
            { name: "Mystical Fire", why: "Coverage and Special Attack control." },
            { name: "Trick", why: "Disrupts an opposing win condition or defensive piece." },
            { name: "Protect", why: "Preserves Terrain and positioning." },
          ],
          objective: "Dual-state Sand + Psychic Terrain scaling engine.",
          howToPlay:
            "Use Terrain to deny priority and enable Corviknight's Psychic Seed. Do not swap Indeedee in merely because it has more utility text than Milotic.",
        },
      },
    ],
  },
  ledger: {
    dropped: {
      slug: "salamence-mega",
      lost: [
        "Second Mega stone on the registered six",
        "Intimidate / Aerilate midgame on the default box",
        "Tailwind without a Staraptor flex",
      ],
    },
    gained: [
      "Independent special endgame (Gholdengo)",
      "Clearer Sand → Coaching → Corviknight pipeline",
      "Milotic Competitive / Icy Wind control valve",
      "Anti-Sand escape hatch without abandoning weather denial",
    ],
    laterTests: [
      {
        slug: "gholdengo",
        change: "Confirm Life Orb vs other items once Nasty Plot windows are measured",
        whenToTest: "After first ladder block on Special Escape Hatch",
      },
      {
        slug: "corviknight",
        change: "Psychic Seed timing vs leftover Def/SpD allocation",
        whenToTest: "When Indeedee flex is in the active six",
      },
      {
        slug: "milotic",
        change: "Hypnosis vs Ice Beam / Scald lines from M-C battle data",
        whenToTest: "If Hypnosis hit rate underperforms Recover cycles",
      },
    ],
  },
  victims: [
    {
      name: "Slow balance",
      why: "Sand Rush creates immediate speed while Coaching and Corviknight create a long scaling threat.",
      play: "Exploit early Sand turns, then transition — do not spend the whole window Protecting.",
    },
    {
      name: "Intimidate-heavy physical teams",
      why: "Competitive Milotic makes repeated Intimidate cycling expensive.",
      play: "Position Milotic where it receives the trigger.",
      trap: "Do not expose Milotic to free Grass / Electric.",
    },
    {
      name: "Teams overprepared for physical Sand",
      why: "Gholdengo ignores Attack drops and answers the wrong preparation.",
      play: "Cut Excadrill; bring the special escape hatch.",
    },
    {
      name: "Weather-dependent teams",
      why: "Tyranitar overwrites weather while the rest retains independent function.",
      play: "Deny weather, then attack infrastructure — not only the setter.",
    },
  ],
  counters: [
    {
      name: "Rain with multiple converters",
      why: "Overwriting Rain does not remove Archaludon, Basculegion, Golisopod or Swampert.",
      play: "Use the anti-Rain four; omit Excadrill.",
    },
    {
      name: "Strong Fire / Electric pressure",
      why: "Denies Corviknight's preferred scaling route.",
      play: "Pivot to Gholdengo and Tyranitar conversion.",
    },
    {
      name: "Strong Ground / Water pressure",
      why: "Tyranitar and Excadrill both suffer when Sand is lost.",
      play: "Milotic stabilizer + Gholdengo.",
    },
    {
      name: "Immediate special offense",
      why: "Coaching Defense is weak vs special damage.",
      play: "Raise Milotic / Gholdengo priority in preview.",
    },
    {
      name: "Priority-heavy offense",
      why: "Default six has no Psychic Terrain.",
      play: "Indeedee flex, or answer priority through positioning.",
    },
  ],
  advantages: [
    {
      title: "Engine → Converter → Scaler",
      body: "Tyranitar creates Sand, Excadrill converts speed, Sneasler converts permanent stats, Corviknight finishes.",
    },
    {
      title: "Weather is not the actual win condition",
      body: "After Sand expires the team still has Unburden, Icy Wind, Corviknight scaling and Gholdengo setup.",
    },
    {
      title: "Anti-counter architecture",
      body: "Heavy Sand prep invites Gholdengo / Milotic; heavy Gholdengo prep opens physical scaling.",
    },
  ],
  roster: [
    {
      slug: "tyranitar-mega",
      title: "Mega Tyranitar",
      job: "weather",
      literacy: "wallbreaker",
      role: "sand engine / weather control / physical breaker",
      primaryJob:
        "Create Sand, deny opposing weather, threaten broad physical damage and provide a durable midgame anchor.",
      item: "Tyranitarite",
      ability: "Sand Stream",
      nature: "Adamant",
      training: train(17, 17, 0, 0, 0, 32, {
        label: "Adamant midgame Spe",
        why: "Enough Spe to contest mid-speed boards while keeping Rock Slide / Knock Off relevant.",
        spend: ["17 HP", "17 Atk", "32 Spe"],
        rule: SP_NOTE,
      }),
      moves: [
        {
          name: "Rock Slide",
          why: "Primary spread — Sand plus bulk into board-wide pressure.",
        },
        {
          name: "Knock Off",
          why: "Removes items while applying Dark pressure for later endgames.",
        },
        {
          name: "Low Kick",
          why: "Punishes heavy Steel, Dark and Normal targets that resist Rock Slide.",
        },
        {
          name: "Protect",
          why: "Preserves the weather engine while the partner converts.",
        },
      ],
      objective: "Establish the state that makes the rest of the team better — not a mandatory sweep.",
      howToPlay:
        "Bring when weather control or Rock/Dark pressure matters. If Sand is already favorable, do not expose Tyranitar merely to refresh it.",
      gives: [
        "Sand",
        "weather denial",
        "Rock spread",
        "Knock Off",
        "physical bulk",
        "second Coaching target",
      ],
      answers: ["Rain", "Sun", "Flying", "Fire", "Psychic via Dark"],
      networkJobs: {
        creates: "Sand",
        converts: "Rock / Dark pressure",
        protects: "weather control",
      },
      opening: [
        {
          ask: "Do I need Sand this game, or only selective weather denial?",
          then: "Refresh Sand only when it creates a concrete window — not for its own sake.",
        },
      ],
    },
    {
      slug: "excadrill",
      title: "Excadrill",
      job: "breaker",
      literacy: "sweeper",
      role: "Sand Rush converter / Steel-Ground attacker / speed engine",
      primaryJob: "Convert Sand into immediate speed dominance and turn that into KOs or Coaching windows.",
      item: "Focus Sash",
      itemWhy: "Insurance so the speed converter acts before dying to chip or priority.",
      ability: "Sand Rush",
      nature: "Adamant",
      training: train(2, 32, 0, 0, 0, 32, {
        label: "Adamant max Atk / Spe",
        why: "Under Sand Rush, raw conversion power matters more than bulk.",
        spend: ["2 HP", "32 Atk", "32 Spe"],
        rule: SP_NOTE,
      }),
      moves: [
        {
          name: "High Horsepower",
          why: "Ground STAB for Steel, Fire, Rock and Electric without hitting the partner.",
        },
        {
          name: "Iron Head",
          why: "Steel STAB for Fairy and Ice; secondary neutral route.",
        },
        {
          name: "Rock Slide",
          why: "Spread when Ground is poorly positioned.",
        },
        {
          name: "Protect",
          why: "Preserves Sash and extends Sand Rush advantage a turn.",
        },
      ],
      objective: "Be the fastest meaningful attacker while Sand is active.",
      howToPlay:
        "Do not attack every turn. Sand Rush can protect a Coaching turn, force Protects, or free Tyranitar's click.",
      gives: [
        "Sand Rush",
        "Ground pressure",
        "Steel pressure",
        "Rock spread",
        "Focus Sash",
        "clearest speed conversion",
      ],
      answers: ["Steel", "Fairy", "Electric", "Rock", "slower offense"],
      modes: [
        {
          id: "excadrill-sand-rush",
          label: "Sand Rush",
          job: "breaker",
          when: "Default when Tyranitar is part of the intended package.",
          item: "Focus Sash",
          moves: [
            { name: "High Horsepower", why: "Primary Ground conversion." },
            { name: "Iron Head", why: "Steel conversion." },
            { name: "Rock Slide", why: "Spread pressure." },
            { name: "Protect", why: "Preserve the Sand Rush attacker." },
          ],
          objective: "Convert Sand into speed and immediate board pressure.",
          howToPlay: "Preserve Sand whenever Excadrill's speed threshold matters more than damage.",
        },
      ],
      networkJobs: {
        creates: "speed dominance",
        converts: "KOs and forced Protects",
        protects: "itself via Sash",
      },
    },
    {
      slug: "sneasler",
      title: "Sneasler",
      job: "support",
      literacy: "disruptor",
      role: "Coaching connector / Unburden converter / physical support",
      primaryJob: "Turn Sand-generated tempo into permanent offensive and defensive scaling.",
      item: "White Herb",
      itemWhy: "Close Combat insurance and Unburden trigger once consumed.",
      ability: "Unburden",
      nature: "Adamant",
      training: train(9, 24, 1, 0, 0, 32, {
        label: "Adamant connector",
        why: "Benchmarked M-C Coaching connector — Spe first, enough Atk to threaten.",
        spend: ["9 HP", "24 Atk", "1 Def", "32 Spe"],
        rule: SP_NOTE,
      }),
      moves: [
        {
          name: "Coaching",
          why: "Central network move — permanent Atk/Def for Tyranitar, Excadrill or Corviknight.",
        },
        {
          name: "Dire Claw",
          why: "Poison damage and disruption while retaining support value.",
        },
        {
          name: "Close Combat",
          why: "Stops passivity; hits Dark, Steel, Normal and Rock; can consume White Herb.",
        },
        {
          name: "Protect",
          why: "Preserves Sneasler while they respect Coaching.",
        },
      ],
      objective: "Transition temporary tempo into permanent advantage.",
      howToPlay:
        "If the partner can safely attack or set up, Coaching is often highest value. White Herb + Close Combat enables a second speed mode independent of Sand.",
      gives: [
        "Coaching",
        "Unburden",
        "Close Combat",
        "Dire Claw",
        "Attack scaling",
        "Defense scaling",
        "speed without Sand",
      ],
      answers: ["Dark", "Steel", "slower teams", "physical attackers via Def boosts", "weather-neutral endgames"],
      ampTargets: [
        { slug: "corviknight", becomes: "Irreversible physical endgame" },
        { slug: "excadrill", becomes: "Stronger Sand Rush conversion" },
        { slug: "tyranitar-mega", becomes: "Harder weather-engine midgame" },
      ],
      modes: [
        {
          id: "sneasler-coaching",
          label: "Coaching",
          job: "support",
          when: "Default when turning a temporary opening into a scaling endgame.",
          item: "White Herb",
          moves: [
            { name: "Coaching", why: "Permanent ally scaling." },
            { name: "Dire Claw", why: "Disruption and secondary damage." },
            { name: "Close Combat", why: "Direct physical conversion." },
            { name: "Protect", why: "Preserve connector value." },
          ],
          objective: "Coach the Pokémon that creates the best long-term board.",
          howToPlay: "Coach who stays on the field — not who looks strongest this turn.",
        },
      ],
      networkJobs: {
        creates: "Coaching",
        converts: "temporary tempo → permanent stats",
        scales: "allies",
        repositions: "Unburden speed",
      },
      opening: [
        {
          ask: "Who is most likely to remain on the field for several turns?",
          then: "Coach that Pokémon — not the flashiest attacker.",
        },
      ],
    },
    {
      slug: "corviknight",
      title: "Corviknight",
      job: "support",
      literacy: "sweeper",
      role: "defensive scaler / Coaching sink / irreversible endgame",
      primaryJob:
        "Convert Coaching and Psychic-independent defensive turns into a self-sustaining late-game win condition.",
      item: "Psychic Seed",
      itemWhy: "Defense boost under Psychic Terrain (Indeedee flex); still a durable item without it.",
      ability: "Mirror Armor",
      nature: "Impish",
      training: train(32, 5, 16, 0, 13, 0, {
        label: "Impish fortress",
        why: "Benchmarked M-C Corviknight — maximize survival into Bulk Up cycles.",
        spend: ["32 HP", "5 Atk", "16 Def", "13 SpD"],
        rule: SP_NOTE,
      }),
      moves: [
        {
          name: "Brave Bird",
          why: "Immediate Flying damage when converting a turn instead of setting up.",
        },
        {
          name: "Power Trip",
          why: "Endgame conversion — every accumulated boost raises the ceiling.",
        },
        {
          name: "Bulk Up",
          why: "Self-contained Atk/Def scaling when Sneasler is gone.",
        },
        {
          name: "Roost",
          why: "Turns defensive investment into an endgame that is hard to remove.",
        },
      ],
      objective: "Become the Pokémon they can no longer efficiently remove.",
      howToPlay:
        "Play as a defensive attacker first. Once their strongest answer is weakened, Bulk Up cycles and Power Trip.",
      gives: [
        "defensive scaling",
        "Attack scaling",
        "Roost sustain",
        "Power Trip",
        "Mirror Armor",
        "endgame independent of Sand",
      ],
      answers: [
        "physical pressure",
        "Intimidate via Mirror Armor",
        "long games",
        "teams lacking Electric / Fire",
        "attrition",
      ],
      networkJobs: {
        converts: "Coaching into fortress",
        scales: "Bulk Up + Power Trip",
        protects: "itself via Roost / Mirror Armor",
      },
      opening: [
        {
          ask: "What removes Corviknight, and is it weakened yet?",
          then: "Do not start Bulk Up until that answer is accounted for.",
        },
      ],
    },
    {
      slug: "milotic",
      title: "Milotic",
      job: "support",
      literacy: "wall",
      role: "Competitive punish / speed control / Water control",
      primaryJob:
        "Punish Intimidate, control speed with Icy Wind and stabilize with Water after Sand expires.",
      item: "Sitrus Berry",
      ability: "Competitive",
      nature: "Calm",
      training: train(32, 0, 19, 10, 0, 5, {
        label: "Calm control",
        why: "Bulk first; enough SpA for Muddy Water; leftover Spe.",
        spend: ["32 HP", "19 Def", "10 SpA", "5 Spe"],
        rule: SP_NOTE,
      }),
      moves: [
        {
          name: "Muddy Water",
          why: "Spread Water when they expect Sand to be the only board control.",
        },
        {
          name: "Icy Wind",
          why: "Speed control that works without Sand.",
        },
        {
          name: "Recover",
          why: "Keeps Competitive and Water pressure available long-term.",
        },
        {
          name: "Hypnosis",
          why: "High-impact disruption on a free turn — do not reveal early.",
        },
      ],
      objective: "Make Intimidate and speed control expensive while holding a reliable Water slot.",
      howToPlay:
        "Bring vs physical / Intimidate boards. Icy Wind often matters more than damage — it lets Excadrill, Sneasler or Gholdengo operate outside Sand.",
      gives: [
        "Competitive",
        "Icy Wind",
        "Water pressure",
        "recovery",
        "anti-Intimidate",
        "anti-Rain stabilization",
      ],
      answers: ["Intimidate", "Fire", "Ground", "physical attackers", "speed-reliant teams"],
      networkJobs: {
        creates: "Icy Wind / Competitive",
        converts: "Intimidate into SpA",
        protects: "post-Sand board",
      },
    },
    {
      slug: "gholdengo",
      title: "Gholdengo",
      job: "breaker",
      literacy: "sweeper",
      role: "independent special win condition / spread breaker",
      primaryJob:
        "Separate win condition so the team does not collapse when Sand, Coaching or Corviknight are answered.",
      item: "Life Orb",
      ability: "Good as Gold",
      nature: "Modest",
      training: train(2, 0, 0, 32, 0, 32, {
        label: "Modest max SpA / Spe",
        why: "Independent special converter — speed and power to take over once ahead.",
        spend: ["2 HP", "32 SpA", "32 Spe"],
        rule: SP_NOTE,
      }),
      moves: [
        {
          name: "Make It Rain",
          why: "Primary spread conversion once Gholdengo is ahead.",
        },
        {
          name: "Shadow Ball",
          why: "Reliable single-target Ghost when Make It Rain is inefficient.",
        },
        {
          name: "Nasty Plot",
          why: "Converts a protected or forced turn into a separate scaling win condition.",
        },
        {
          name: "Protect",
          why: "Preserves Gholdengo while they respect boosted damage.",
        },
      ],
      objective: "Force them to prepare for a special endgame even if they think the team is Sand-only.",
      howToPlay:
        "Nasty Plot is not mandatory. Attack exposed targets; manufacture setup with Fake Out equivalents from partners (Icy Wind, Protect, Coaching, weather).",
      gives: [
        "independent special wincon",
        "Make It Rain",
        "Good as Gold",
        "Steel / Ghost coverage",
        "non-Sand endgame",
      ],
      answers: ["status-heavy", "Fairy", "physical defensive structures", "boards overprepared for Sand"],
      modes: [
        {
          id: "gholdengo-life-orb",
          label: "Life Orb Setup",
          job: "breaker",
          when: "Default independent special win condition.",
          item: "Life Orb",
          moves: [
            { name: "Make It Rain", why: "Spread conversion." },
            { name: "Shadow Ball", why: "Single-target conversion." },
            { name: "Nasty Plot", why: "Scaling route." },
            { name: "Protect", why: "Preserve the setup piece." },
          ],
          objective: "One safe Nasty Plot or exploit unsafe switches.",
          howToPlay: "Use the other three to manufacture the turn — do not demand Gholdengo create it alone.",
        },
      ],
      networkJobs: {
        creates: "special threat",
        converts: "Nasty Plot → Make It Rain",
        protects: "status via Good as Gold",
      },
      opening: [
        {
          ask: "Did they preview for Sand? What is their Gholdengo answer?",
          then: "If Sand prep is heavy, bring the Special Escape Hatch.",
        },
      ],
    },
  ],
  packs: [
    {
      id: PACK_SAND,
      label: "Sand Engine",
      when: "Default into teams that can be outrun or overwhelmed once Sand is established.",
      identity: "Tyranitar + Excadrill creates the engine; Sneasler converts speed into scaling.",
      slugs: ["tyranitar-mega", "excadrill", "sneasler", "corviknight"],
      winconMode: "excadrill-sand-rush",
      engineIds: ["sand-rush-collapse", "coached-corviknight"],
      endgameIds: ["sand-rush-collapse", "coached-corviknight"],
      strategy: {
        opponentPattern: "Teams without a strong way to overwrite Sand or immediately punish Excadrill.",
        bring: ["tyranitar-mega", "excadrill", "sneasler", "corviknight"],
        purpose: "Establish Sand, convert into speed, then convert speed into permanent scaling.",
        targets: [
          "opposing weather setter",
          "opposing speed control",
          "physical attacker threatening Corviknight",
          "Steel / Fairy for Excadrill",
        ],
        refuses: [
          "sacrificing Tyranitar just to get Sand once",
          "Coaching when direct damage wins the turn",
          "revealing Corviknight's full plan before their answer is weakened",
        ],
        winCondition:
          "Enough Sand turns for Excadrill to force favorable exchanges, then Corviknight if the game slows.",
        gamePlan: "Break: Sand + Excadrill. Control: Coaching + Protect. Finish: boosted Corviknight.",
        mantra: "Sand is a state, not the win condition.",
        contrast: "Maximizes the Sand engine; minimizes the special route.",
        turnChecklist: [
          "Who controls weather?",
          "How many Sand turns matter?",
          "Can Excadrill safely attack?",
          "Should Sneasler Coach or attack?",
          "When does Corviknight become the better wincon?",
        ],
        defaultLead: "Tyranitar + Excadrill.",
        winconMode: "excadrill-sand-rush",
      },
      roles: [
        { slug: "tyranitar-mega", macro: "Engine", micro: "Sand" },
        { slug: "excadrill", macro: "Converter", micro: "Sand Rush" },
        { slug: "sneasler", macro: "Connector", micro: "Coaching" },
        { slug: "corviknight", macro: "Scaler", micro: "Bulk Up + Roost + Power Trip" },
      ],
      loops: [
        {
          title: "Sand → Speed",
          body: "Use when they lack immediate weather overwrite. Tyranitar establishes Sand; Excadrill becomes the speed engine under Sand Rush. Attack or Protect based on whether the KO or the tempo window matters more. End state: they are answering Excadrill's speed, not your weather text.",
        },
        {
          title: "Speed → Coaching",
          body: "Use when Excadrill's speed forces Protect or a bad action. Spend Sneasler's turn Coaching the piece most likely to stay alive (often Corviknight or Excadrill). If they double Sneasler, Protect or attack instead. End state: temporary Sand advantage became permanent stats.",
        },
        {
          title: "Coaching → Corviknight",
          body: "Use when their Corviknight answer is already weakened. Take the Coaching boost, then begin Bulk Up / Roost rather than forcing Brave Bird every turn. If Electric / Fire is still free, keep Corviknight defensive and finish with Excadrill. End state: irreversible physical endgame or a clean Sand Rush close.",
        },
      ],
      flows: [
        {
          id: "lead",
          title: "Lead",
          forks: [
            {
              id: "lead-0",
              when: "No immediate Sand answer",
              then: "Lead Tyranitar + Excadrill and force the speed question.",
            },
            {
              id: "lead-1",
              when: "Faster immediate threat",
              then: "Protect or trade with Tyranitar; preserve Excadrill's Sash.",
            },
            {
              id: "lead-2",
              when: "Obvious weather control",
              then: "Prioritize weather positioning over immediate damage.",
            },
          ],
        },
      ],
      victims: [
        {
          name: "Slow offense",
          why: "Sand Rush creates a large speed advantage.",
          play: "Exploit the first two Sand turns aggressively.",
          trap: "Do not spend the entire Sand window Protecting.",
        },
      ],
      counters: [
        {
          name: "Rain",
          why: "Overwrites Sand and threatens Tyranitar / Excadrill.",
          play: "Transition to Milotic / Gholdengo packages.",
          trap: "Sand control alone does not solve Archaludon or Basculegion.",
        },
      ],
      advantages: [
        {
          title: "Speed conversion",
          body: "Sand immediately creates a second state through Sand Rush — not just chip weather.",
        },
      ],
      hazards: [],
    },
    {
      id: PACK_COACH,
      label: "Sand + Coaching",
      when: "Opponent cannot immediately remove Sneasler or the selected physical target.",
      identity: "Use Sand to buy Sneasler the first Coaching turn.",
      slugs: ["tyranitar-mega", "excadrill", "sneasler", "milotic"],
      winconMode: "sneasler-coaching",
      engineIds: ["sand-rush-collapse", "milotic-control"],
      endgameIds: ["sand-rush-collapse", "milotic-control"],
      strategy: {
        opponentPattern: "Physical boards that cannot punish Sneasler immediately.",
        bring: ["tyranitar-mega", "excadrill", "sneasler", "milotic"],
        purpose: "Sand Rush as temporary protection for permanent stat investment.",
        targets: ["physical attacker", "Intimidate user", "speed control", "Fire / Ground"],
        refuses: [
          "Coaching into obvious double-target",
          "letting Milotic die before Competitive pays",
          "using Excadrill only as a speed gimmick",
        ],
        winCondition: "Coach Excadrill, Tyranitar or Milotic enough that trades stop favoring them.",
        gamePlan: "Break: Sand Rush. Control: Icy Wind or Coaching. Finish: boosted physical attacker.",
        mantra: "Use temporary speed to create permanent stats.",
        contrast: "More control-oriented than Sand Engine.",
        turnChecklist: [
          "Who benefits most from Coaching?",
          "Can Milotic punish Intimidate?",
          "Do I need Icy Wind instead?",
          "Can Sand last long enough?",
          "Which Pokémon must survive?",
        ],
        defaultLead: "Tyranitar + Sneasler or Tyranitar + Excadrill.",
        winconMode: "sneasler-coaching",
      },
      roles: [
        { slug: "tyranitar-mega", macro: "Engine", micro: "Sand" },
        { slug: "excadrill", macro: "Speed", micro: "Sand Rush" },
        { slug: "sneasler", macro: "Support", micro: "Coaching" },
        { slug: "milotic", macro: "Control", micro: "Competitive + Icy Wind" },
      ],
      loops: [
        {
          title: "Sand → Coach",
          body: "Use when Excadrill's speed forces defensive play. Establish Sand, threaten with Excadrill, then Coach the survivor most likely to cash the boost. If they ignore Sneasler, Coach; if they target Sneasler, Protect or Close Combat. End state: permanent Atk/Def on a piece that outlasts Sand.",
        },
        {
          title: "Intimidate → Competitive",
          body: "Use when they cycle Intimidate. Position Milotic to receive it, then spend the SpA into Muddy Water or keep pressure while Icy Wind slows the board for Excadrill. End state: their anti-physical tool became your special resource.",
        },
      ],
      flows: [],
      victims: [
        {
          name: "Intimidate-heavy physical teams",
          why: "Milotic makes Intimidate cycling costly.",
          play: "Position for the Competitive trigger.",
          trap: "Do not expose Milotic to strong Grass / Electric.",
        },
      ],
      counters: [
        {
          name: "Strong special offense",
          why: "Coaching Defense is less relevant.",
          play: "Use Gholdengo packages instead.",
          trap: "Do not overvalue physical bulk.",
        },
      ],
      advantages: [
        {
          title: "Permanent conversion",
          body: "A two-turn Sand window can become a much longer stat advantage.",
        },
      ],
      hazards: [],
    },
    {
      id: PACK_FORTRESS,
      label: "Corviknight Fortress",
      when: "Opponent lacks an immediate way to remove Corviknight or reset its scaling.",
      identity: "Sneasler and Corviknight form the most irreversible physical endgame.",
      slugs: ["sneasler", "corviknight", "tyranitar-mega", "gholdengo"],
      winconMode: "sneasler-coaching",
      engineIds: ["coached-corviknight", "gholdengo-special", "dual-scaler"],
      endgameIds: ["coached-corviknight", "gholdengo-special"],
      strategy: {
        opponentPattern: "Balanced teams whose strongest answers can be weakened before Corviknight scales.",
        bring: ["sneasler", "corviknight", "tyranitar-mega", "gholdengo"],
        purpose: "Force a choice between Corviknight physical scaling and Gholdengo special scaling.",
        targets: [
          "Fire / Electric answer to Corviknight",
          "Ghost / Dark answer to Gholdengo",
          "Intimidate user",
          "strongest physical breaker",
        ],
        refuses: [
          "setting up Corviknight while its hard counter is untouched",
          "sacrificing Gholdengo without identifying the endgame",
          "all Coaching turns on one mon before answers are known",
        ],
        winCondition: "They spend resources answering Corviknight while Gholdengo can still take over.",
        gamePlan:
          "Break: identify Corviknight's answer. Control: Coaching + Protect. Finish: Power Trip or Make It Rain.",
        mantra: "Force them to answer two endgames at once.",
        contrast: "Less dependent on Sand than Sand Engine.",
        turnChecklist: [
          "What removes Corviknight?",
          "What removes Gholdengo?",
          "Can Sneasler safely Coach?",
          "Should Tyranitar Knock Off?",
          "When is Power Trip stronger than Brave Bird?",
        ],
        defaultLead: "Sneasler + Corviknight when they lack immediate pressure.",
        winconMode: "sneasler-coaching",
      },
      roles: [
        { slug: "sneasler", macro: "Connector", micro: "Coaching" },
        { slug: "corviknight", macro: "Scaler", micro: "Bulk Up + Roost" },
        { slug: "tyranitar-mega", macro: "Breaker", micro: "Knock Off + Rock Slide" },
        { slug: "gholdengo", macro: "Alternate wincon", micro: "Nasty Plot" },
      ],
      loops: [
        {
          title: "Coach → Bulk Up",
          body: "Use when Corviknight's answer is weakened. First Coaching sticks; then Corviknight continues scaling itself. If they still have a free Electric / Fire, delay Bulk Up and chip with Brave Bird / Knock Off. End state: self-sustaining fortress.",
        },
        {
          title: "Physical Threat → Special Setup",
          body: "Use when they overcommit to stopping Corviknight. Preserve Gholdengo, manufacture one Protect or Icy Wind-equivalent free turn, then Nasty Plot. End state: they answered the wrong axis.",
        },
        {
          title: "Knock Off → Endgame",
          body: "Use when their Corviknight answer holds a key item. Tyranitar Knock Offs first, then commit to Bulk Up / Power Trip. End state: the answer is softer before the long game starts.",
        },
      ],
      flows: [],
      victims: [
        {
          name: "Balance without hard Corviknight answers",
          why: "Corviknight becomes self-sustaining.",
          play: "Identify the one breaker and remove or weaken it.",
          trap: "Do not Bulk Up until that answer is accounted for.",
        },
      ],
      counters: [
        {
          name: "Strong Electric / Fire",
          why: "Prevents Corviknight from reaching its scaling state.",
          play: "Gholdengo and Tyranitar as alternate converters.",
          trap: "Do not force Corviknight into a matchup it cannot scale through.",
        },
      ],
      advantages: [
        {
          title: "Two independent scaling axes",
          body: "Physical fortress and special Make It Rain develop in parallel.",
        },
      ],
      hazards: [],
    },
    {
      id: PACK_ANTI_RAIN,
      label: "Rain Breaker",
      when: "Pelipper, Archaludon, Basculegion, Golisopod or Swampert are visible.",
      identity: "Weather denial plus infrastructure attack — Excadrill deliberately omitted.",
      slugs: ["tyranitar-mega", "milotic", "sneasler", "gholdengo"],
      engineIds: ["gholdengo-special", "milotic-control"],
      endgameIds: ["gholdengo-special", "milotic-control"],
      strategy: {
        opponentPattern: "Rain teams that need several Water / Steel / speed pieces alive.",
        bring: ["tyranitar-mega", "milotic", "sneasler", "gholdengo"],
        purpose: "Deny weather while Milotic, Sneasler and Gholdengo attack rain infrastructure.",
        targets: ["Pelipper", "Archaludon", "Basculegion", "Swampert", "Golisopod"],
        refuses: [
          "assuming Tyranitar alone solves Rain",
          "bringing Excadrill automatically into Water-heavy boards",
          "letting Archaludon or Basculegion take free turns",
        ],
        winCondition: "Remove or weaken one critical rain converter, then collapse with the remaining three.",
        gamePlan: "Break: overwrite Rain and pressure the key node. Control: Icy Wind / Coaching. Finish: Gholdengo or Milotic.",
        mantra: "Overwrite the weather; attack the infrastructure.",
        contrast: "Unlike Sand Engine, Excadrill is omitted because Rain erases its primary engine.",
        turnChecklist: [
          "Who is the actual rain converter?",
          "Is Pelipper worth attacking immediately?",
          "Can Milotic slow the board?",
          "Can Sneasler pressure Archaludon?",
          "Can Gholdengo become the endgame?",
        ],
        defaultLead: "Tyranitar + Milotic.",
      },
      roles: [
        { slug: "tyranitar-mega", macro: "Weather", micro: "Sand denial" },
        { slug: "milotic", macro: "Control", micro: "Icy Wind + Water" },
        { slug: "sneasler", macro: "Breaker", micro: "Close Combat" },
        { slug: "gholdengo", macro: "Wincon", micro: "Nasty Plot" },
      ],
      loops: [
        {
          title: "Sand → Icy Wind",
          body: "Use when Rain is active. Tyranitar overwrites; Milotic immediately slows the board so the setter cannot translate weather into free tempo. If Pelipper Tailwinds first, treat that as the next priority. End state: weather is contested and speed is yours.",
        },
        {
          title: "Weather Denial → Gholdengo",
          body: "Use once Rain is off and a rain converter is weakened. Preserve Gholdengo for the special endgame rather than early trading. End state: weather-agnostic closer.",
        },
        {
          title: "Icy Wind → Coaching",
          body: "Use when Milotic creates a speed window. Sneasler Coaches instead of racing damage if the boost recipient survives. End state: control plus permanent stats without Excadrill.",
        },
      ],
      flows: [],
      victims: [
        {
          name: "Pelipper rain",
          why: "Tyranitar contests Drizzle; Milotic punishes Water-oriented boards.",
          play: "Do not only attack the setter while converters survive.",
          trap: "Pelipper can still Tailwind before dying.",
        },
        {
          name: "Water-heavy offense",
          why: "Milotic and Gholdengo give non-Excadrill routes.",
          play: "Milotic as stabilizer.",
          trap: "Milotic cannot absorb unlimited Grass / Electric.",
        },
      ],
      counters: [
        {
          name: "Rain plus strong Grass / Electric",
          why: "Milotic vulnerable; Tyranitar overwhelmed before denial matters.",
          play: "Gholdengo and Sneasler aggressively.",
          trap: "Do not let Tyranitar be the only piece holding the board.",
        },
      ],
      advantages: [
        {
          title: "Weather-agnostic fallback",
          body: "Even if Tyranitar loses the weather war, Milotic and Gholdengo still function.",
        },
      ],
      hazards: [],
    },
    {
      id: PACK_ESCAPE,
      label: "Special Escape Hatch",
      when: "Opponent preview heavily prepares for Sand, physical damage or Corviknight.",
      identity: "Abandon the obvious Sand win condition and attack from the special side.",
      slugs: ["gholdengo", "tyranitar-mega", "milotic", "sneasler"],
      winconMode: "gholdengo-life-orb",
      engineIds: ["gholdengo-special"],
      endgameIds: ["gholdengo-special"],
      strategy: {
        opponentPattern: "Teams overloaded with physical checks, Intimidate or anti-Sand tools.",
        bring: ["gholdengo", "tyranitar-mega", "milotic", "sneasler"],
        purpose: "Use their anti-Sand preparation against them.",
        targets: ["Steel / Fairy", "physical walls", "Intimidate users", "the mon stopping Nasty Plot"],
        refuses: [
          "forcing Excadrill where Sand is repeatedly removed",
          "using Gholdengo as disposable damage",
          "Nasty Plot without accounting for double-target",
        ],
        winCondition: "One safe Nasty Plot; Make It Rain becomes primary board control.",
        gamePlan: "Break: immediate special damage. Control: Icy Wind / Coaching. Finish: boosted Make It Rain.",
        mantra: "If they prepared for Sand, punish the preparation.",
        contrast: "Gives up Excadrill's speed conversion for independent special scaling.",
        turnChecklist: [
          "What is their Gholdengo answer?",
          "Can Milotic create a setup turn?",
          "Does Tyranitar need to Mega?",
          "Which target must Sneasler remove?",
          "When should Nasty Plot happen?",
        ],
        defaultLead: "Gholdengo + Milotic or Gholdengo + Sneasler.",
        winconMode: "gholdengo-life-orb",
      },
      roles: [
        { slug: "gholdengo", macro: "Wincon", micro: "Nasty Plot" },
        { slug: "milotic", macro: "Control", micro: "Icy Wind" },
        { slug: "sneasler", macro: "Support", micro: "Coaching" },
        { slug: "tyranitar-mega", macro: "Disruptor", micro: "Knock Off + weather" },
      ],
      loops: [
        {
          title: "Icy Wind → Nasty Plot",
          body: "Use when Gholdengo's setup is unsafe at equal speed. Milotic Icy Winds; Gholdengo Nasty Plots or Protects into the next cycle. If they Protect Gholdengo, take free board damage with Sneasler / Tyranitar. End state: boosted Make It Rain.",
        },
        {
          title: "Coaching → Mixed Pressure",
          body: "Use when they respect Gholdengo enough to leave a physical opening. Sneasler Coaches Tyranitar or stays threatening with Close Combat while Gholdengo scales specially. End state: both axes developing.",
        },
      ],
      flows: [],
      victims: [
        {
          name: "Anti-Sand balance",
          why: "Defensive prep aimed at the wrong axis.",
          play: "Remove the special answer before committing to Nasty Plot.",
          trap: "Anti-Sand teams may still have strong Gholdengo answers.",
        },
      ],
      counters: [
        {
          name: "Fast Dark / Ghost pressure",
          why: "Denies Gholdengo before scaling.",
          play: "Sneasler aggressively; preserve Tyranitar.",
          trap: "Protect alone does not create a safe setup.",
        },
      ],
      advantages: [
        {
          title: "Anti-counter architecture",
          body: "They cannot allocate all resources against every conversion route.",
        },
      ],
      hazards: [],
    },
    {
      id: PACK_MIXED,
      label: "Mixed Scaling",
      when: "Opponent has one obvious physical wall or one obvious special wall.",
      identity: "Attack both defensive axes simultaneously.",
      slugs: ["sneasler", "corviknight", "milotic", "gholdengo"],
      engineIds: ["coached-corviknight", "gholdengo-special", "milotic-control", "dual-scaler"],
      endgameIds: ["coached-corviknight", "gholdengo-special", "milotic-control"],
      strategy: {
        opponentPattern: "Balance with asymmetric defensive investment.",
        bring: ["sneasler", "corviknight", "milotic", "gholdengo"],
        purpose: "Make their best defensive axis insufficient.",
        targets: ["physical wall", "special wall", "speed controller", "Corviknight answer"],
        refuses: [
          "trying to win with only Corviknight",
          "letting Gholdengo die before identifying structure",
          "using Milotic only as a damage dealer",
        ],
        winCondition: "Coach Corviknight while Gholdengo pressures special and Milotic controls speed.",
        gamePlan: "Break: identify the weaker axis. Control: Icy Wind + Coaching. Finish: Power Trip or Make It Rain.",
        mantra: "Do not fight their strongest wall.",
        contrast: "Minimizes Sand; maximizes network property.",
        turnChecklist: [
          "Which defensive axis is weaker?",
          "What removes Corviknight?",
          "What removes Gholdengo?",
          "Can Milotic slow the board?",
          "Can Sneasler safely Coach?",
        ],
        defaultLead: "Sneasler + Milotic or Sneasler + Gholdengo.",
      },
      roles: [
        { slug: "sneasler", macro: "Connector", micro: "Coaching" },
        { slug: "corviknight", macro: "Scaler", micro: "Bulk Up" },
        { slug: "milotic", macro: "Control", micro: "Icy Wind" },
        { slug: "gholdengo", macro: "Wincon", micro: "Nasty Plot" },
      ],
      loops: [
        {
          title: "Speed Control → Scaling",
          body: "Use when equal-speed boards threaten Coaching. Milotic Icy Winds so Sneasler can Coach. End state: permanent stats without Sand.",
        },
        {
          title: "Physical → Special",
          body: "Use when they commit resources to Corviknight. Gholdengo takes the resulting opening. End state: the weaker axis collapses.",
        },
      ],
      flows: [],
      victims: [
        {
          name: "Asymmetric balance",
          why: "Package attacks whichever defensive axis is weaker.",
          play: "Identify the axis before committing to an endgame.",
          trap: "Do not split damage evenly just because four are available.",
        },
      ],
      counters: [
        {
          name: "Immediate hyper offense",
          why: "Package takes time to convert.",
          play: "Sand Engine or Sand + Coaching instead.",
          trap: "Do not attempt a slow endgame while losing every first exchange.",
        },
      ],
      advantages: [
        {
          title: "Defensive-axis compression",
          body: "They must solve physical and special scaling at once.",
        },
      ],
      hazards: [],
    },
    {
      id: PACK_STARAPTOR,
      label: "Staraptor Sand Tempo",
      when: "Swap Corviknight for Staraptor when Tailwind and Intimidate beat defensive scaling.",
      identity: "Sand plus Tailwind — two independent speed regimes.",
      slugs: ["tyranitar-mega", "excadrill", "sneasler", "staraptor"],
      requiresSwap: { out: "corviknight", in: "staraptor" },
      winconMode: "excadrill-sand-rush",
      engineIds: ["sand-rush-collapse"],
      endgameIds: ["sand-rush-collapse"],
      strategy: {
        opponentPattern: "Fast physical teams or matchups where Corviknight is too slow to establish.",
        bring: ["tyranitar-mega", "excadrill", "sneasler", "staraptor"],
        purpose: "Add Tailwind and Intimidate without abandoning Sand Rush.",
        targets: ["physical attackers", "opposing speed control", "Flying / Grass", "slow support"],
        refuses: [
          "using Staraptor only as another attacker",
          "Mega Evolving automatically",
          "assuming Tailwind and Sand Rush must always run together",
        ],
        winCondition: "Use whichever speed regime is better, then convert into physical pressure.",
        gamePlan: "Break: Intimidate / Brave Bird. Control: Tailwind / Sand. Finish: Excadrill or Sneasler.",
        mantra: "Two speed engines, one board.",
        contrast: "Default six wins through Corviknight scaling; this version wins through immediate speed.",
        turnChecklist: [
          "Do I need Tailwind or Sand?",
          "Which speed mode survives longer?",
          "Does Intimidate change damage?",
          "Should Tyranitar Mega?",
          "What did losing Corviknight cost?",
        ],
        defaultLead: "Tyranitar + Staraptor or Tyranitar + Excadrill.",
        winconMode: "excadrill-sand-rush",
      },
      roles: [
        { slug: "tyranitar-mega", macro: "Weather", micro: "Sand" },
        { slug: "excadrill", macro: "Speed", micro: "Sand Rush" },
        { slug: "sneasler", macro: "Support", micro: "Coaching" },
        { slug: "staraptor", macro: "Speed", micro: "Tailwind + Intimidate" },
      ],
      loops: [
        {
          title: "Intimidate → Sand",
          body: "Use vs physical offense. Intimidate on entry, then establish Sand so Excadrill exploits the softer board. End state: reduced physical damage plus Sand Rush.",
        },
        {
          title: "Tailwind → Coaching",
          body: "Use when Tailwind alone creates the speed lead. Sneasler Coaches instead of racing. End state: permanent stats under conventional speed control.",
        },
      ],
      flows: [],
      victims: [
        {
          name: "Physical offense",
          why: "Intimidate plus two speed engines make first exchanges inefficient.",
          play: "Preserve Staraptor for a second Intimidate cycle.",
          trap: "Special attackers ignore Intimidate.",
        },
      ],
      counters: [
        {
          name: "Strong Electric / Ice / Rock",
          why: "Staraptor hard to preserve.",
          play: "Excadrill and Tyranitar for immediate pressure.",
          trap: "Do not drop Corviknight without accounting for the lost fortress.",
        },
      ],
      advantages: [
        {
          title: "Dual speed architecture",
          body: "Operate through Sand Rush or Tailwind — not locked to one mechanism.",
        },
      ],
      hazards: [],
    },
    {
      id: PACK_PSYCHIC,
      label: "Psychic Sand Variant",
      when: "Swap Milotic for Indeedee-M when priority denial, Trick or Psychic Terrain beat Water / Icy Wind.",
      identity: "Sand + Psychic Terrain + Coaching + Corviknight — concentrated scaling.",
      slugs: ["tyranitar-mega", "sneasler", "corviknight", "indeedee-male"],
      requiresSwap: { out: "milotic", in: "indeedee-male" },
      winconMode: "sneasler-coaching",
      engineIds: ["coached-corviknight", "sand-rush-collapse"],
      endgameIds: ["coached-corviknight", "sand-rush-collapse"],
      strategy: {
        opponentPattern: "Priority-heavy teams or item / positioning disrupted by Trick.",
        bring: ["tyranitar-mega", "sneasler", "corviknight", "indeedee-male"],
        purpose: "Trade Milotic's Water control for Terrain, priority denial and disruption.",
        targets: ["priority attackers", "support", "setup", "item-dependent threats"],
        refuses: [
          "this swap into Water-heavy matchups where Milotic typing matters",
          "letting Indeedee overwrite useful terrain without reason",
          "assuming Terrain automatically improves every Corviknight line",
        ],
        winCondition: "Terrain removes priority interference while Sand and Coaching establish the scaling board.",
        gamePlan: "Break: Sand or immediate pressure. Control: Psychic Terrain + Trick. Finish: Corviknight.",
        mantra: "Protect the scaling engine from priority.",
        contrast: "Stronger Terrain + Sand scaling than the default six; loses Milotic's Rain and Intimidate utility.",
        turnChecklist: [
          "Do I need priority denial?",
          "Is Trick valuable?",
          "Does losing Icy Wind hurt?",
          "Can Psychic Terrain protect Corviknight / Seed?",
          "Which state should dominate?",
        ],
        defaultLead: "Indeedee + Sneasler or Tyranitar + Indeedee.",
        winconMode: "sneasler-coaching",
      },
      roles: [
        { slug: "tyranitar-mega", macro: "Weather", micro: "Sand" },
        { slug: "sneasler", macro: "Scaler", micro: "Coaching" },
        { slug: "corviknight", macro: "Endgame", micro: "Bulk Up + Psychic Seed" },
        { slug: "indeedee-male", macro: "Control", micro: "Psychic Terrain + Trick" },
      ],
      loops: [
        {
          title: "Terrain → Corviknight",
          body: "Use when priority or Seed matters. Indeedee sets Psychic Terrain; Corviknight's Psychic Seed activates; Sneasler Coaches into the safer board. End state: priority-proofed fortress path.",
        },
        {
          title: "Priority Denial → Coaching",
          body: "Use when they rely on priority to stop setup. Keep Terrain up; spend Sneasler's turn Coaching rather than racing. End state: permanent stats without eating Extreme Speed / First Impression into the scaling piece.",
        },
      ],
      flows: [],
      victims: [
        {
          name: "Priority-dependent offense",
          why: "Psychic Terrain removes a major conversion tool.",
          play: "Keep Indeedee healthy enough to preserve Terrain.",
          trap: "Terrain can be overwritten.",
        },
      ],
      counters: [
        {
          name: "Rain",
          why: "Milotic's Water typing and Icy Wind are gone.",
          play: "Tyranitar for weather; Gholdengo from the box as fallback bring.",
          trap: "Do not pretend Indeedee replaces Milotic's anti-Rain role.",
        },
      ],
      advantages: [
        {
          title: "Priority-proof scaling",
          body: "Terrain protects the slower scaling route from priority disruption.",
        },
      ],
      hazards: [],
    },
  ],
} satisfies TeamManual;
