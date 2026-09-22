import { train, type TeamManual } from "@/content/manuals";

const BOX = [
  "raichu",
  "rillaboom",
  "staraptor",
  "gholdengo",
  "arcanine-hisui",
  "sylveon",
] as const;

const PACK_FAIRY = "pack-conversion-fairy";
const PACK_GARCHOMP = "pack-autonomous-garchomp";
const PACK_MILOTIC = "pack-reactive-milotic";
const PACK_CERULEDGE = "pack-ceruledge-scaling";
const PACK_ANNIHILAPE = "pack-annihilape-counterplay";

const SP_NOTE =
  "Starting architecture spend (66 SP, max 32). Recommended configuration — not claimed as mathematically optimal vs every M-C threshold.";

export const CONVERSION_NETWORK_MODULAR_MC_MANUAL = {
  id: "conversion-network-modular-mc-manual",
  title: "Conversion Network — Modular M-C",
  lede: "A board-state generator built around Raichu, Rillaboom and Staraptor, with Gholdengo plus modular converters that change how the six wins.",
  format: "doubles",
  philosophy:
    "Build a network of competing clocks rather than one rigid six. Raichu, Rillaboom and Staraptor create tempo and board states; Gholdengo scales; the final slot pair determines whether the team converts immediately, scales, reacts, or weaponizes opponent actions.",
  archetype: "balance",
  family: "clock",
  meta: "Pokémon Champions Regulation M-C. Modular ladder architecture designed around immediate conversion, scaling, reactive control and opponent-action conversion.",
  setsNote: SP_NOTE,
  press: ["Fake Out", "Tailwind", "Nasty Plot", "Modular bench"],
  pilot: {
    thesis:
      "Can we create a favorable board state, convert it on the right clock, and keep a second route alive when the first is denied?",
    rule: "Pick a four-Pokémon package and a Mega plan before turn one — not mid-game improvisation.",
    fail: "Forcing Gholdengo setup, Tailwind, or Rage Fist when the board already favors immediate conversion.",
  },
  box: [...BOX],
  core: ["raichu", "rillaboom", "gholdengo", "sylveon"],
  slugs: ["raichu", "rillaboom", "gholdengo", "sylveon"],
  slots: [],
  coreArchitecture: {
    identity: "Conversion Network",
    primaryEngine: "Raichu + Rillaboom + Staraptor generate tempo, terrain, speed control and positioning.",
    conversionModel:
      "Gholdengo provides scaling special conversion; Hisuian Arcanine provides immediate nuclear physical conversion; Sylveon provides immediate Fairy spread conversion.",
    scalingModel:
      "Gholdengo compounds value through Nasty Plot while the infrastructure buys positioning and protects its setup windows.",
    controlModel: "Fake Out + Lightning Rod + Grassy Terrain + Intimidate + Tailwind + Protect.",
    speedModel: "Mega Raichu provides immediate speed pressure; Staraptor provides Tailwind as a second speed-control route.",
    resourceModel:
      "Fake Out turns, terrain, priority, Intimidate, positioning and setup opportunities are converted into damage or safer endgames.",
    threatProfile: [
      "tempo engine",
      "terrain engine",
      "speed control",
      "Intimidate",
      "special scaling",
      "immediate physical conversion",
      "Fairy spread conversion",
      "priority",
    ],
  },
  clocks: [
    {
      id: "tempo-clock",
      owner: ["raichu", "rillaboom", "staraptor"],
      speed: "immediate",
      goal: "Control action order and create safe conversion windows.",
    },
    {
      id: "immediate-conversion-clock",
      owner: ["arcanine-hisui", "sylveon"],
      speed: "fast",
      goal: "Turn one favorable board state into immediate damage.",
    },
    {
      id: "scaling-clock",
      owner: ["gholdengo"],
      speed: "medium",
      goal: "Use protected turns to become progressively harder to answer.",
    },
    {
      id: "resource-clock",
      owner: ["rillaboom", "raichu", "staraptor"],
      speed: "continuous",
      goal: "Accumulate positioning, terrain, Fake Out and speed-control advantages.",
    },
  ],
  winRoutes: [
    {
      id: "fake-out-immediate-conversion",
      name: "Fake Out → Immediate Conversion",
      requires: ["raichu", "rillaboom", "arcanine-hisui"],
      sequence: [
        "Use Fake Out to remove one immediate response.",
        "Position Hisuian Arcanine against the exposed target.",
        "Convert the free turn into Flare Blitz, Head Smash or Extreme Speed.",
        "Use the resulting KO or HP advantage to control the next turn.",
      ],
      finish: "Hisuian Arcanine or Rillaboom closes after the opponent loses a key piece.",
      failurePoint: "The opponent absorbs the first attack with Protect, resistances or defensive positioning.",
      dependencies: [
        { slug: "raichu", importance: "supportive" },
        { slug: "rillaboom", importance: "supportive" },
        { slug: "arcanine-hisui", importance: "critical" },
      ],
    },
    {
      id: "tailwind-immediate-pressure",
      name: "Tailwind → Immediate Pressure",
      requires: ["staraptor", "arcanine-hisui"],
      sequence: [
        "Establish Tailwind when Staraptor can survive or trade favorably.",
        "Use the speed advantage to place immediate pressure with Hisuian Arcanine.",
        "Force defensive turns or remove a vulnerable target.",
        "Use priority and Fake Out to preserve the speed advantage.",
      ],
      finish: "The opponent cannot regain board control before the physical converters close.",
      failurePoint: "Tailwind is denied or the opponent's speed control remains active.",
      dependencies: [
        { slug: "staraptor", importance: "critical" },
        { slug: "arcanine-hisui", importance: "supportive" },
      ],
    },
    {
      id: "fake-out-nasty-plot",
      name: "Fake Out → Nasty Plot",
      requires: ["raichu", "gholdengo"],
      sequence: [
        "Use Fake Out to suppress the immediate threat.",
        "Use Gholdengo's protected turn for Nasty Plot.",
        "Transition from setup into Make It Rain or Shadow Ball pressure.",
        "Use Rillaboom and Staraptor to maintain positioning while Gholdengo scales.",
      ],
      finish: "Gholdengo becomes the dominant special threat while the infrastructure prevents clean counterplay.",
      failurePoint: "The opponent can immediately double Gholdengo or deny its setup.",
      dependencies: [
        { slug: "gholdengo", importance: "critical" },
        { slug: "raichu", importance: "supportive" },
      ],
    },
    {
      id: "fairy-spread-conversion",
      name: "Position → Hyper Voice",
      requires: ["sylveon", "rillaboom"],
      sequence: [
        "Use Fake Out, terrain or positioning to reduce immediate counterpressure.",
        "Place Sylveon where both opposing slots are meaningful targets.",
        "Use Hyper Voice to convert one safe turn into spread damage.",
        "Use Hyper Beam or priority from teammates to finish weakened targets.",
      ],
      finish: "Multiple opposing Pokémon are simultaneously pushed into KO range.",
      failurePoint:
        "The opponent separates targets or applies enough immediate pressure to prevent Sylveon from attacking safely.",
      dependencies: [
        { slug: "sylveon", importance: "critical" },
        { slug: "rillaboom", importance: "supportive" },
      ],
    },
  ],
  failureRoutes: [
    {
      failedRoute: "Gholdengo setup",
      why: "The opponent applies immediate pressure and denies Nasty Plot.",
      fallback: "Stop investing turns into setup.",
      nextRoute: "Immediate physical conversion through Hisuian Arcanine or Rillaboom.",
    },
    {
      failedRoute: "Hisuian Arcanine conversion",
      why: "The opponent Protects, resists the attack or pivots around the threat.",
      fallback: "Exploit the defensive turn instead of repeatedly forcing damage.",
      nextRoute: "Gholdengo scaling or Sylveon spread pressure.",
    },
    {
      failedRoute: "Tailwind",
      why: "Opponent denies Staraptor or establishes opposing speed control.",
      fallback: "Stop treating speed advantage as mandatory.",
      nextRoute: "Fake Out positioning plus priority and immediate conversion.",
    },
    {
      failedRoute: "Sylveon spread pressure",
      why: "Opponent separates targets or pressures Sylveon before it can attack.",
      fallback: "Use Sylveon as a defensive Fairy presence while another converter operates.",
      nextRoute: "Gholdengo scaling or Hisuian Arcanine pressure.",
    },
  ],
  bench: {
    purpose:
      "Change the team's strategic personality when the default conversion profile is poorly matched to the opponent.",
    slots: [
      {
        slug: "garchomp",
        insteadOf: "sylveon",
        category: "autonomous-converter",
        priority: "high",
        useWhen: [
          "The team needs more autonomous immediate damage.",
          "Ground or Rock coverage materially improves the matchup.",
          "The opponent can exploit the Fairy-dependent conversion route.",
        ],
        avoidWhen: [
          "Fairy spread pressure is specifically valuable.",
          "The matchup rewards special spread damage more than autonomous physical coverage.",
        ],
        changesArchitecture: true,
        moduleId: "garchomp-autonomous-conversion",
      },
      {
        slug: "milotic",
        insteadOf: "sylveon",
        category: "reactive-control",
        priority: "high",
        useWhen: [
          "The opponent relies heavily on Intimidate or physical stat manipulation.",
          "The matchup is likely to become attritional.",
          "Reactive punishment is more valuable than immediate spread damage.",
        ],
        avoidWhen: [
          "Immediate Fairy spread damage is the primary requirement.",
          "The game must be won quickly before reactive value accumulates.",
        ],
        changesArchitecture: true,
        moduleId: "milotic-reactive-control",
      },
      {
        slug: "ceruledge",
        insteadOf: "arcanine-hisui",
        category: "self-scaler",
        priority: "high",
        useWhen: [
          "The matchup allows a protected setup turn.",
          "Grassy Terrain can be converted into Grassy Seed value.",
          "The game is likely to reward sustained scaling.",
        ],
        avoidWhen: [
          "Immediate damage is required from turn one.",
          "The opponent can deny setup consistently.",
        ],
        changesArchitecture: true,
        moduleId: "ceruledge-self-scaling",
      },
      {
        slug: "annihilape",
        insteadOf: "arcanine-hisui",
        category: "counterplay-scaler",
        priority: "medium",
        useWhen: [
          "The opponent must attack into Annihilape.",
          "Intimidate or other stat drops are common.",
          "The matchup rewards opponent-action conversion.",
        ],
        avoidWhen: [
          "The opponent can simply ignore Annihilape.",
          "Immediate nuclear conversion is more valuable than accumulated Rage Fist value.",
        ],
        changesArchitecture: true,
        moduleId: "annihilape-counterplay",
      },
    ],
  },
  modules: [
    {
      id: "garchomp-autonomous-conversion",
      type: "bench-module",
      requiresSwap: { out: "sylveon", in: "garchomp" },
      architecture: "Autonomous Conversion Network",
      packages: [PACK_GARCHOMP],
    },
    {
      id: "milotic-reactive-control",
      type: "bench-module",
      requiresSwap: { out: "sylveon", in: "milotic" },
      architecture: "Control Network",
      packages: [PACK_MILOTIC],
    },
    {
      id: "ceruledge-self-scaling",
      type: "bench-module",
      requiresSwap: { out: "arcanine-hisui", in: "ceruledge" },
      architecture: "Self-Scaling Network",
      packages: [PACK_CERULEDGE],
    },
    {
      id: "annihilape-counterplay",
      type: "bench-module",
      requiresSwap: { out: "arcanine-hisui", in: "annihilape" },
      architecture: "Counterplay Network",
      packages: [PACK_ANNIHILAPE],
    },
  ],
  benchDiagnostics: [
    {
      problem: "The team creates openings but fails to convert them immediately.",
      symptoms: [
        "Free turns do not produce enough damage.",
        "Opponent repeatedly survives the first conversion attempt.",
      ],
      recommendedModules: ["garchomp-autonomous-conversion"],
    },
    {
      problem: "The opponent is manipulating physical stats or winning attrition.",
      symptoms: [
        "Repeated Intimidate creates problems for the physical core.",
        "Games remain unresolved after the first exchanges.",
      ],
      recommendedModules: ["milotic-reactive-control"],
    },
    {
      problem: "The matchup allows a self-scaling win condition.",
      symptoms: [
        "Opponent lacks reliable immediate pressure.",
        "Grassy Terrain can safely create setup opportunities.",
      ],
      recommendedModules: ["ceruledge-self-scaling"],
    },
    {
      problem: "The opponent's normal attacks and stat manipulation create value for our side.",
      symptoms: [
        "Opponent must repeatedly target our scaler.",
        "Intimidate or similar stat drops are common.",
      ],
      recommendedModules: ["annihilape-counterplay"],
    },
    {
      problem: "The opponent separates targets and makes Sylveon's spread damage inefficient.",
      symptoms: [
        "Hyper Voice is difficult to convert into meaningful multi-target pressure.",
        "Opponent's positioning removes Fairy spread value.",
      ],
      recommendedModules: ["garchomp-autonomous-conversion", "milotic-reactive-control"],
    },
  ],
  replacementRelationships: [
    {
      out: "sylveon",
      in: "garchomp",
      preserves: ["immediate conversion", "threat saturation", "independent offensive pressure"],
      adds: ["Ground coverage", "Rock coverage", "autonomous conversion", "physical threat diversity"],
      loses: ["Fairy spread pressure", "Pixilate special damage", "strong Dragon immunity"],
      changes: ["damage distribution", "targeting profile", "conversion autonomy", "coverage profile"],
    },
    {
      out: "sylveon",
      in: "milotic",
      preserves: ["special offensive presence", "independent conversion"],
      adds: ["Competitive", "Coil", "Muddy Water", "reactive control", "attrition value"],
      loses: ["Fairy spread pressure", "Pixilate Hyper Voice"],
      changes: ["immediate damage into reactive damage", "low-commitment offense into state-reactive control"],
    },
    {
      out: "arcanine-hisui",
      in: "ceruledge",
      preserves: ["physical pressure", "Fire typing", "independent offensive route"],
      adds: ["Grassy Seed interaction", "Swords Dance scaling", "Bitter Blade sustain", "Shadow Sneak priority"],
      loses: ["immediate nuclear Head Smash pressure", "Extreme Speed"],
      changes: ["immediate conversion into self-scaling", "short clock into medium clock"],
    },
    {
      out: "arcanine-hisui",
      in: "annihilape",
      preserves: ["physical offensive pressure", "independent win route"],
      adds: ["Rage Fist scaling", "Defiant", "opponent-action conversion"],
      loses: ["immediate Head Smash damage", "Extreme Speed", "Rock coverage"],
      changes: [
        "autonomous conversion into interaction-reactive scaling",
        "low positional commitment into higher positional commitment",
      ],
    },
  ],
  phases: [
    {
      id: "create-state",
      title: "Create board state",
      lede: "Infrastructure before conversion.",
      branches: [
        {
          when: "One opponent must act first",
          then: "Fake Out that threat while the partner creates terrain, Tailwind, or positioning.",
        },
        {
          when: "Electric pressure is live",
          then: "Position Raichu so Lightning Rod changes their targeting.",
        },
      ],
    },
    {
      id: "choose-clock",
      title: "Choose conversion clock",
      branches: [
        {
          when: "An exposed target exists now",
          then: "Favor immediate conversion (H-Arcanine, Sylveon, or Garchomp module).",
        },
        {
          when: "Setup cannot be punished this turn",
          then: "Favor Gholdengo or Ceruledge scaling clocks.",
        },
      ],
    },
    {
      id: "protect-route",
      title: "Protect the active route",
      branches: [
        {
          when: "The scaler is threatened",
          then: "Protect, Fake Out, or redirect — do not donate the invested turns.",
        },
        {
          when: "The opponent shifts to stop your clock",
          then: "Recognize denial and switch clocks via failureRoutes.",
        },
      ],
    },
    {
      id: "convert",
      title: "Convert",
      branches: [
        {
          when: "The safe window is open",
          then: "Click the converter — Hyper Voice, Head Smash, Earthquake, Nasty Plot, or Rage Fist.",
        },
        {
          when: "They Protect into your main threat",
          then: "Take the free reposition or attack the partner slot.",
        },
      ],
    },
    {
      id: "endgame",
      title: "Transition to endgame",
      branches: [
        {
          when: "Opponents are chipped into priority range",
          then: "Grassy Glide, Extreme Speed, Quick Attack, or Shadow Sneak — compress.",
        },
        {
          when: "One scaler is dominant",
          then: "Stop creating complexity; protect the closer.",
        },
      ],
    },
  ],
  loops: [
    {
      title: "Fake Out → Conversion",
      body: "If one opponent prevents your converter from acting, suppress that target with Fake Out and use the resulting action to create immediate progress.",
    },
    {
      title: "Tempo → Gholdengo",
      body: "When the infrastructure creates a safe turn, convert that turn into Nasty Plot or another Gholdengo pressure action.",
    },
    {
      title: "Tailwind → Damage",
      body: "When Tailwind changes the relevant speed order, use the faster converter immediately rather than treating Tailwind as an end in itself.",
    },
  ],
  hazards: [
    {
      title: "One Mega per battle",
      body: "Raichu and Staraptor both carry Mega stones on the registered six. The bring must commit to Mega Raichu Y or Mega Staraptor — not both.",
    },
    {
      title: "Over-engineering",
      body: "Do not spend multiple turns creating a perfect board when an immediate converter can already capitalize.",
    },
    {
      title: "Grassy Terrain versus Ground",
      body: "Rillaboom's terrain changes the value of Ground attacks — especially for Garchomp. Choose the click based on active terrain.",
    },
    {
      title: "Setup greed",
      body: "Gholdengo and Ceruledge only invest setup turns when the opponent cannot convert that investment into a decisive trade.",
    },
    {
      title: "Route commitment",
      body: "When Plan A is denied, change clocks rather than repeatedly forcing the same route.",
    },
  ],
  commandments: [
    "Create the opening before committing the converter.",
    "Do not force a Pokémon's trigger when its normal kit already provides value.",
    "Maintain at least two independent win routes.",
    "Use the bench to repair a problem, not because the replacement is generically stronger.",
    "When Plan A is denied, change clocks rather than repeatedly forcing the same route.",
  ],
  architecture: [
    {
      title: "Engine",
      body: "Tempo, terrain, Tailwind, and Intimidate infrastructure.",
      slugs: ["raichu", "rillaboom", "staraptor"],
    },
    {
      title: "Converter",
      body: "Immediate and scaling routes that spend the manufactured turn.",
      slugs: ["gholdengo", "arcanine-hisui", "sylveon"],
    },
    {
      title: "Endgame",
      body: "Closers once the active clock has paid off.",
      slugs: ["gholdengo", "arcanine-hisui", "sylveon"],
    },
  ],
  engines: [
    {
      id: "tempo-infrastructure",
      label: "Tempo Infrastructure",
      path: [
        "Raichu · Fake Out",
        "Rillaboom · Fake Out or Grassy Surge",
        "Staraptor · Intimidate or Tailwind",
        "Infrastructure creates a safe action",
        "Converter uses the opening",
      ],
      how: "The infrastructure layer does not need to win by itself. It creates action-order and positioning advantages that another Pokémon converts. Fake Out suppresses one action, terrain changes board resources, and Intimidate lowers physical pressure. Tailwind creates a second speed route. The engine succeeds when the converter receives a better action than the opponent rather than when the support Pokémon deal the most damage.",
      dependsOn: "At least one converter on the bring can exploit the created opening.",
      disrupt: "Immediate pressure, opposing speed control, redirection or Protect can deny the intended conversion.",
      fallback: "Stop forcing the original converter and shift to the other clock.",
    },
    {
      id: "special-scaling",
      label: "Gholdengo Scaling",
      path: [
        "Raichu · Fake Out",
        "Gholdengo · Nasty Plot",
        "Rillaboom/Staraptor · preserve positioning",
        "Gholdengo · Make It Rain / Shadow Ball",
        "Infrastructure protects the endgame",
      ],
      how: "Gholdengo turns a protected action into a compounding special threat. The infrastructure's job is to prevent the opponent from converting that setup turn into a decisive trade. Once Gholdengo scales, the opponent must spend more resources to answer it. Good as Gold preserves independence from many status-based lines. If setup is denied, return to immediate physical or spread conversion.",
      dependsOn: "A protected setup opportunity on the current board.",
      disrupt: "Immediate double targeting, strong Steel-resistant answers, or speed control that makes Gholdengo manageable.",
      fallback: "Use H-Arcanine, Sylveon, or the active bench module as the immediate alternate converter.",
    },
    {
      id: "immediate-conversion",
      label: "Immediate Conversion",
      path: [
        "Raichu/Rillaboom · Fake Out",
        "Staraptor · Tailwind or Intimidate",
        "H-Arcanine · immediate attack",
        "Rillaboom · priority cleanup",
        "Opponent loses the ability to reset",
      ],
      how: "Hisuian Arcanine prevents the architecture from becoming overly setup-dependent. Once infrastructure creates a favorable board, Arcanine converts immediately rather than spending another turn scaling. Head Smash, Flare Blitz and Extreme Speed create different conversion speeds. If the first attack fails to produce enough value, move to Gholdengo or Sylveon instead of forcing another burst.",
      dependsOn: "An exposed target or a speed/positioning advantage on the board.",
      disrupt: "Protect, resistances, Intimidate, defensive pivots or immediate pressure.",
      fallback: "Transition to Gholdengo scaling or Sylveon spread damage.",
    },
  ],
  network: {
    thesis:
      "The team is a conversion graph: infrastructure creates states, converters turn those states into advantage, and scalers prevent the opponent from resetting the board.",
    edges: [
      {
        from: "raichu",
        to: "gholdengo",
        creates: "Safe setup turn through Fake Out",
        converts: "Nasty Plot",
        engineId: "special-scaling",
      },
      {
        from: "rillaboom",
        to: "ceruledge",
        creates: "Grassy Terrain and Fake Out windows",
        converts: "Grassy Seed and Swords Dance",
      },
      {
        from: "staraptor",
        to: "garchomp",
        creates: "Tailwind and Intimidate positioning",
        converts: "Immediate coverage damage",
        engineId: "immediate-conversion",
      },
      {
        from: "raichu",
        to: "sylveon",
        creates: "Fake Out protection and Lightning Rod pressure",
        converts: "Hyper Voice",
        engineId: "immediate-conversion",
      },
      {
        from: "rillaboom",
        to: "arcanine-hisui",
        creates: "Fake Out, terrain and positioning",
        converts: "Flare Blitz / Head Smash / Extreme Speed",
        engineId: "immediate-conversion",
      },
      {
        from: "staraptor",
        to: "milotic",
        creates: "Intimidate and physical stat drops",
        converts: "Competitive pressure",
      },
      {
        from: "rillaboom",
        to: "annihilape",
        creates: "Fake Out and terrain positioning",
        converts: "Rage Fist accumulation",
      },
      {
        from: "staraptor",
        to: "annihilape",
        creates: "Intimidate stat drops",
        converts: "Defiant conversion",
      },
    ],
  },
  controlPlanes: [
    {
      id: "fake-out",
      label: "Fake Out",
      setterSlug: "raichu",
      effect: "Guaranteed interruption → one free decision",
      whoBenefits: "Converters and scalers needing a protected turn",
    },
    {
      id: "grassy",
      label: "Grassy Terrain",
      setterSlug: "rillaboom",
      effect: "Recovery, Grass priority, Seed activation",
      whoBenefits: "Ceruledge module and board longevity",
    },
    {
      id: "tailwind",
      label: "Tailwind",
      setterSlug: "staraptor",
      effect: "Team-wide speed inversion",
      whoBenefits: "Garchomp and immediate physical converters",
    },
  ],
  megaPool: {
    rule: "One Mega Evolution per battle.",
    previewPressure:
      "Mega Raichu Y is the default special-tempo Mega. Mega Staraptor is the alternate when Tailwind and physical board control matter more.",
    candidates: [
      { slug: "raichu", stone: "Raichunite Y", when: "Default tempo and special pressure package" },
      { slug: "staraptor", stone: "Staraptite", when: "Autonomous Garchomp or Tailwind-heavy brings" },
    ],
  },
  construction: {
    thesis: "Build a six that generates board states rather than depending on one rigid combo.",
    method:
      "Raichu, Rillaboom and Staraptor create tempo and positioning; Gholdengo provides scaling; the two conversion slots determine whether the team emphasizes immediate Fairy/Fire pressure, autonomous coverage, reactive control or opponent-action scaling.",
    winCondition:
      "Create a favorable board state, convert it immediately or begin a scaling clock, then use the remaining infrastructure to prevent the opponent from resetting the game.",
    endgames: [
      {
        id: "gholdengo-cleanup",
        label: "Gholdengo Cleanup",
        path: "gholdengo",
        how: "Protect Gholdengo through early positioning → Nasty Plot → repeated special damage.",
      },
      {
        id: "physical-conversion-cleanup",
        label: "Physical Conversion Cleanup",
        path: "arcanine-hisui",
        how: "Fake Out or Tailwind → H-Arcanine pressure → Rillaboom priority.",
      },
      {
        id: "fairy-spread-cleanup",
        label: "Fairy Spread Cleanup",
        path: "sylveon",
        how: "Position Sylveon → Hyper Voice pressure → finish weakened targets.",
      },
      {
        id: "autonomous-garchomp-cleanup",
        label: "Garchomp Autonomous Cleanup",
        path: "garchomp",
        how: "Tailwind/Fake Out positioning → Garchomp coverage → priority or Gholdengo finish.",
      },
      {
        id: "reactive-control-cleanup",
        label: "Reactive Control Cleanup",
        path: "milotic",
        how: "Opponent creates Competitive/Coil value → Milotic accumulates pressure → Gholdengo or Rillaboom closes.",
      },
    ],
    altSlots: [
      {
        slug: "garchomp",
        insteadOf: "sylveon",
        why: "Replace Fairy spread conversion with autonomous multi-axis physical coverage.",
        answers: "Ground, Rock and independent physical conversion.",
        costs: "Loses Fairy spread pressure and Pixilate special damage.",
        unlocks: [PACK_GARCHOMP],
        architectureChange: { from: "Conversion Network", to: "Autonomous Conversion Network" },
        module: {
          identity: "Autonomous Converter",
          strategicRole: "Multi-axis immediate pressure",
          adds: ["Ground pressure", "Rock coverage", "autonomous damage"],
          removes: ["Fairy spread", "Pixilate special pressure"],
          changes: ["damage distribution", "targeting ambiguity", "conversion autonomy"],
        },
        slot: {
          title: "Garchomp",
          job: "breaker",
          role: "Autonomous multi-axis converter",
          item: "Choice Scarf",
          itemWhy: "Outruns key threats and converts Tailwind/Fake Out windows without setup.",
          ability: "Rough Skin",
          nature: "Jolly",
          training: train(2, 32, 0, 0, 0, 32, {
            label: "Jolly Choice Scarf",
            why: "Recommended max Atk/Spe — autonomous conversion when infrastructure creates the opening.",
            spend: ["2 HP", "32 Atk", "32 Spe"],
            rule: SP_NOTE,
          }),
          moves: [
            { name: "Earthquake", why: "Primary Ground conversion when terrain permits." },
            { name: "Rock Slide", why: "Spread Rock pressure and Flying/Fire coverage." },
            { name: "Dragon Claw", why: "Reliable Dragon STAB without setup commitment." },
            { name: "Protect", why: "Preserves Garchomp while infrastructure creates the next window." },
          ],
          objective: "Convert board states independently rather than requiring a specific setup engine.",
          howToPlay:
            "Use Garchomp when the team needs immediate autonomous pressure. Choose Earthquake, Rock Slide, or Dragon Claw based on terrain and targets — not autopilot Ground.",
        },
      },
      {
        slug: "milotic",
        insteadOf: "sylveon",
        why: "Replace immediate Fairy spread with reactive control and Competitive conversion.",
        answers: "Punishes Intimidate and supports longer games.",
        costs: "Loses immediate Fairy spread pressure.",
        unlocks: [PACK_MILOTIC],
        architectureChange: { from: "Conversion Network", to: "Control Network" },
        module: {
          identity: "Reactive Controller",
          strategicRole: "Convert opponent state manipulation into pressure",
          adds: ["Competitive", "Coil", "Muddy Water", "reactive scaling"],
          removes: ["Fairy spread", "Pixilate pressure"],
          changes: ["immediate conversion into reactive conversion", "short clock into longer clock"],
        },
        slot: {
          title: "Milotic",
          job: "support",
          role: "Reactive special controller",
          item: "Sitrus Berry",
          ability: "Competitive",
          nature: "Calm",
          training: train(32, 0, 19, 10, 0, 5, {
            label: "Calm control",
            why: "Recommended bulk-first spread; enough SpA for Muddy Water pressure.",
            spend: ["32 HP", "19 Def", "10 SpA", "5 Spe"],
            rule: SP_NOTE,
          }),
          moves: [
            { name: "Muddy Water", why: "Spread pressure with accuracy disruption potential." },
            { name: "Ice Beam", why: "Coverage against Dragon and Ground targets." },
            { name: "Coil", why: "Turns safe board states into progressive scaling." },
            { name: "Protect", why: "Preserves Competitive value while infrastructure repositions." },
          ],
          objective: "Turn opponent stat manipulation and safe positioning into a longer-term control advantage.",
          howToPlay:
            "Do not force Milotic to create the entire win condition. Use it as the reactive layer that makes their control tools less reliable.",
        },
      },
      {
        slug: "ceruledge",
        insteadOf: "arcanine-hisui",
        why: "Trade nuclear immediate conversion for self-scaling and sustain.",
        answers: "Creates a longer scaling route through Grassy Seed and Swords Dance.",
        costs: "Loses Head Smash and Extreme Speed immediate pressure.",
        unlocks: [PACK_CERULEDGE],
        architectureChange: { from: "Conversion Network", to: "Self-Scaling Network" },
        module: {
          identity: "Self-Scaling Converter",
          strategicRole: "Turn terrain and safe turns into progressive physical pressure",
          adds: ["Grassy Seed", "Swords Dance", "Bitter Blade sustain", "Shadow Sneak"],
          removes: ["Head Smash nuclear pressure", "Extreme Speed"],
          changes: ["fast clock into scaling clock", "burst damage into sustain"],
        },
        slot: {
          title: "Ceruledge",
          job: "breaker",
          role: "Self-scaling physical converter",
          item: "Grassy Seed",
          ability: "Flash Fire",
          nature: "Adamant",
          training: train(2, 32, 0, 0, 0, 32, {
            label: "Adamant max offense",
            why: "Recommended physical scaling after Swords Dance; terrain supplies sustain context.",
            spend: ["2 HP", "32 Atk", "32 Spe"],
            rule: SP_NOTE,
          }),
          moves: [
            { name: "Bitter Blade", why: "Converts damage into sustain while maintaining Fire pressure." },
            { name: "Shadow Sneak", why: "Priority cleanup after scaling creates KO ranges." },
            { name: "Swords Dance", why: "Turns a protected turn into a new physical damage clock." },
            { name: "Protect", why: "Preserves the scaling resource while infrastructure manipulates the next turn." },
          ],
          objective: "Use Grassy Terrain and protected turns to become progressively harder to stop.",
          howToPlay:
            "Treat Ceruledge as a medium-clock threat. Swords Dance only when the opponent cannot punish the setup turn.",
        },
      },
      {
        slug: "annihilape",
        insteadOf: "arcanine-hisui",
        why: "Replace immediate nuclear damage with opponent-action scaling.",
        answers: "Punishes repeated attacks and stat drops.",
        costs: "Loses immediate Head Smash and Extreme Speed conversion.",
        unlocks: [PACK_ANNIHILAPE],
        architectureChange: { from: "Conversion Network", to: "Counterplay Network" },
        module: {
          identity: "Opponent-Action Scaler",
          strategicRole: "Convert enemy actions into future offensive power",
          adds: ["Rage Fist scaling", "Defiant", "counterplay conversion"],
          removes: ["Extreme Speed", "Head Smash burst"],
          changes: [
            "autonomous conversion into interaction-reactive scaling",
            "low commitment into higher positional commitment",
          ],
        },
        slot: {
          title: "Annihilape",
          job: "breaker",
          role: "Opponent-action scaler",
          item: "Sitrus Berry",
          ability: "Defiant",
          nature: "Adamant",
          training: train(32, 32, 0, 0, 0, 2, {
            label: "Adamant bulk / attack",
            why: "Recommended to stay on field for Rage Fist while still threatening Close Combat.",
            spend: ["32 HP", "32 Atk", "2 Spe"],
            rule: SP_NOTE,
          }),
          moves: [
            { name: "Rage Fist", why: "Turns incoming attacks into increasing Ghost-type pressure." },
            { name: "Close Combat", why: "Immediate Fighting conversion when Rage Fist is not yet charged." },
            { name: "Bulk Up", why: "Accelerates physical scaling when interaction value is already accumulating." },
            { name: "Protect", why: "Preserves accumulated threat while infrastructure controls targeting." },
          ],
          objective: "Make the opponent's necessary attacks contribute to the eventual win condition.",
          howToPlay:
            "Do not expose Annihilape unnecessarily. Use infrastructure to make their attacks costly while Rage Fist accumulates.",
        },
      },
    ],
  },
  ledger: {
    dropped: {
      slug: "linear-conversion",
      lost: ["Single Fairy-or-Fire conversion dependency", "One rigid bring every preview"],
    },
    gained: [
      "Four architectural bench modules",
      "Competing Mega modes (Raichu Y vs Staraptor)",
      "Five distinct four-Pokémon packages",
      "Multiple independent clocks",
    ],
    laterTests: [
      {
        slug: "sylveon",
        change: "Compare Sylveon versus Garchomp over a controlled ladder sample",
        whenToTest: "When Fairy spread underperforms autonomous conversion",
      },
      {
        slug: "raichu",
        change: "Compare Mega Raichu versus Mega Staraptor selection frequency",
        whenToTest: "After ten preview games with both stones on the six",
      },
      {
        slug: "milotic",
        change: "Test Milotic replacing Sylveon in Intimidate-heavy matchup families",
        whenToTest: "When Competitive never triggers but Coil value is consistent",
      },
      {
        slug: "annihilape",
        change: "Test Annihilape positional commitment versus trigger breadth",
        whenToTest: "When Rage Fist games are lost despite sufficient interaction",
      },
      {
        slug: "gholdengo",
        change: "Measure win-route execution and missed routes",
        whenToTest: "When losses cluster on denied Nasty Plot rather than conversion",
      },
    ],
  },
  victims: [
    {
      name: "Clustered offensive boards",
      why: "Fake Out plus spread conversion can punish both slots.",
      play: "Create one safe attack window.",
      trap: "Do not force spread damage into obvious Protect cycles.",
    },
    {
      name: "Physical-heavy boards",
      why: "Intimidate, terrain, Fake Out and priority provide multiple forms of physical control.",
      play: "Use Staraptor and Rillaboom to manipulate the first exchange.",
      trap: "Do not rely on Intimidate alone against Defiant/Competitive effects.",
    },
  ],
  counters: [
    {
      name: "Strong immediate pressure",
      why: "Can prevent the protected conversion turns the team wants.",
      play: "Favor immediate conversion over setup.",
      trap: "Do not repeatedly attempt Nasty Plot or Tailwind when the board is collapsing.",
    },
    {
      name: "Opposing speed control",
      why: "Can remove the advantage created by Staraptor or Mega Raichu.",
      play: "Use Fake Out, priority and positioning rather than assuming speed control will remain.",
      trap: "Do not treat Tailwind as the team's only speed plan.",
    },
  ],
  advantages: [
    {
      title: "Multiple conversion clocks",
      body: "The default six can win immediately through H-Arcanine, through spread damage with Sylveon, or progressively through Gholdengo.",
    },
    {
      title: "High connector density",
      body: "Raichu, Rillaboom and Staraptor each create board states that multiple converters can exploit.",
    },
    {
      title: "Bench architecture",
      body: "Garchomp, Milotic, Ceruledge and Annihilape change the team's conversion, scaling and control model — not just coverage.",
    },
  ],
  roster: [
    {
      slug: "raichu",
      title: "Mega Raichu Y",
      job: "mega",
      literacy: "disruptor",
      role: "Tempo engine / Lightning Rod / Fake Out",
      primaryJob: "Create safe actions and manipulate Electric targeting.",
      item: "Raichunite Y",
      ability: "Lightning Rod",
      nature: "Modest",
      training: train(2, 0, 0, 32, 0, 32, {
        label: "Modest max SpA / Spe",
        why: "Recommended special tempo Mega with Fake Out infrastructure.",
        spend: ["2 HP", "32 SpA", "32 Spe"],
        rule: SP_NOTE,
      }),
      moves: [
        { name: "Fake Out", why: "Creates the protected action converters and scalers need." },
        { name: "Zap Cannon", why: "High-impact Electric conversion against exposed targets." },
        { name: "Focus Blast", why: "Coverage against Steel and Dark that absorb Electric pressure." },
        { name: "Protect", why: "Preserves Raichu while the team converts elsewhere." },
      ],
      objective: "Control the first exchange and make Electric targeting unfavorable.",
      howToPlay:
        "Raichu is primarily infrastructure. Use Fake Out to create a specific conversion window. Mega when the Mega value matters to the line — not automatically.",
      modes: [
        {
          id: "raichu-mega-y",
          label: "Mega Raichu Y",
          job: "mega",
          when: "Raichu's speed and special pressure beat Mega Staraptor for this preview.",
          item: "Raichunite Y",
          itemWhy: "Mega conversion of Raichu's speed and offensive profile.",
          nature: "Modest",
          training: train(2, 0, 0, 32, 0, 32, {
            label: "Modest max SpA / Spe",
            why: "Recommended Mega tempo spread.",
            spend: ["2 HP", "32 SpA", "32 Spe"],
            rule: SP_NOTE,
          }),
          moves: [
            { name: "Fake Out", why: "Primary tempo click." },
            { name: "Zap Cannon", why: "Primary Electric conversion." },
            { name: "Focus Blast", why: "Coverage conversion." },
            { name: "Protect", why: "Preserves the tempo engine." },
          ],
          objective: "Use Mega Raichu as the team's primary tempo Mega.",
          howToPlay: "Mega when the team benefits from Raichu's speed and immediate special pressure.",
        },
      ],
      gives: ["Fake Out", "Lightning Rod", "speed", "special pressure"],
      answers: ["Electric targeting", "tempo-dependent leads"],
    },
    {
      slug: "rillaboom",
      title: "Rillaboom",
      job: "support",
      literacy: "pivot",
      role: "Terrain engine / Fake Out / priority",
      primaryJob: "Generate Grassy Terrain, control tempo and provide priority.",
      item: "Miracle Seed",
      ability: "Grassy Surge",
      nature: "Adamant",
      training: train(32, 32, 0, 0, 0, 2, {
        label: "Adamant bulk / attack",
        why: "Recommended durable Grass converter with leftover Spe.",
        spend: ["32 HP", "32 Atk", "2 Spe"],
        rule: SP_NOTE,
      }),
      moves: [
        { name: "Fake Out", why: "Creates free actions for converters and scalers." },
        { name: "Grassy Glide", why: "Priority conversion after chip damage." },
        { name: "Wood Hammer", why: "High-power physical conversion when immediate damage is required." },
        { name: "High Horsepower", why: "Ground coverage without relying on Earthquake." },
      ],
      objective: "Keep the team connected through terrain, Fake Out and priority.",
      howToPlay:
        "Preserve Rillaboom when terrain or priority will matter in the endgame, but spend Fake Out freely when it creates a decisive conversion window.",
      gives: ["Grassy Terrain", "Fake Out", "priority", "physical pressure"],
      answers: ["terrain-dependent strategies", "fragile offensive leads"],
    },
    {
      slug: "staraptor",
      title: "Mega Staraptor",
      job: "mega",
      literacy: "pivot",
      role: "Tailwind / Intimidate / physical connector",
      primaryJob: "Create a second speed-control route and soften physical threats.",
      item: "Staraptite",
      ability: "Intimidate",
      nature: "Jolly",
      training: train(2, 32, 0, 0, 0, 32, {
        label: "Jolly max offense",
        why: "Recommended Tailwind and Brave Bird pressure.",
        spend: ["2 HP", "32 Atk", "32 Spe"],
        rule: SP_NOTE,
      }),
      moves: [
        { name: "Tailwind", why: "Creates the fast clock for immediate converters." },
        { name: "Brave Bird", why: "Immediate Flying conversion." },
        { name: "Close Combat", why: "Immediate Fighting conversion." },
        { name: "Protect", why: "Preserves Tailwind positioning and Mega value." },
      ],
      objective: "Provide Tailwind, Intimidate and a second physical pressure vector.",
      howToPlay:
        "Staraptor is a connector. Use Intimidate when preserving the board matters and Tailwind when it changes the converter's speed profile.",
      modes: [
        {
          id: "staraptor-mega",
          label: "Mega Staraptor",
          job: "mega",
          when: "Tailwind plus Mega Staraptor's physical pressure beat Mega Raichu for this preview.",
          item: "Staraptite",
          itemWhy: "Enables the alternate Mega architecture.",
          nature: "Jolly",
          training: train(2, 32, 0, 0, 0, 32, {
            label: "Jolly max offense",
            why: "Recommended Mega Staraptor spread.",
            spend: ["2 HP", "32 Atk", "32 Spe"],
            rule: SP_NOTE,
          }),
          moves: [
            { name: "Tailwind", why: "Primary speed-control conversion." },
            { name: "Brave Bird", why: "Immediate Flying pressure." },
            { name: "Close Combat", why: "Immediate Fighting pressure." },
            { name: "Protect", why: "Preserves the speed engine." },
          ],
          objective: "Use Staraptor as the team's alternate Mega and speed engine.",
          howToPlay: "Select this Mega when Tailwind and physical board control are more important than Mega Raichu's special tempo.",
        },
      ],
      gives: ["Intimidate", "Tailwind", "physical pressure"],
      answers: ["physical offense", "speed-control matchups"],
    },
    {
      slug: "gholdengo",
      title: "Gholdengo",
      job: "breaker",
      literacy: "sweeper",
      role: "Special scaler",
      primaryJob: "Turn protected actions into a compounding special win condition.",
      item: "Life Orb",
      ability: "Good as Gold",
      nature: "Modest",
      training: train(2, 0, 0, 32, 0, 32, {
        label: "Modest max SpA / Spe",
        why: "Recommended special scaling and conversion reliability.",
        spend: ["2 HP", "32 SpA", "32 Spe"],
        rule: SP_NOTE,
      }),
      moves: [
        { name: "Make It Rain", why: "Primary spread conversion after setup." },
        { name: "Shadow Ball", why: "Reliable single-target special pressure." },
        { name: "Nasty Plot", why: "Turns one protected action into a scaling clock." },
        { name: "Protect", why: "Preserves the scaling resource and punishes overcommitment." },
      ],
      objective: "Become the team's progressively harder-to-stop special threat.",
      howToPlay:
        "Do not automatically Nasty Plot. Identify whether the opponent can punish the setup turn — if yes, attack or reposition.",
      gives: ["special scaling", "Good as Gold", "spread damage"],
      answers: ["status-based disruption", "teams vulnerable to special scaling"],
    },
    {
      slug: "arcanine-hisui",
      title: "Hisuian Arcanine",
      job: "breaker",
      literacy: "wallbreaker",
      role: "Nuclear immediate converter",
      primaryJob: "Turn one favorable board state into immediate physical damage.",
      item: "Focus Sash",
      ability: "Rock Head",
      nature: "Jolly",
      training: train(2, 32, 0, 0, 0, 32, {
        label: "Jolly max offense",
        why: "Recommended explosive first exchange with Extreme Speed cleanup.",
        spend: ["2 HP", "32 Atk", "32 Spe"],
        rule: SP_NOTE,
      }),
      moves: [
        { name: "Extreme Speed", why: "Priority cleanup after the main conversion." },
        { name: "Head Smash", why: "Primary nuclear Rock conversion without recoil." },
        { name: "Flare Blitz", why: "Immediate Fire conversion." },
        { name: "Protect", why: "Preserves the converter when immediate damage is not yet available." },
      ],
      objective: "Prevent the team from becoming overly setup-dependent.",
      howToPlay:
        "Enter when the board is ready to be converted. Do not spend turns perfecting setup when an exposed target already exists.",
      gives: ["immediate damage", "Rock coverage", "Fire coverage", "priority"],
      answers: ["Fire-weak targets", "Flying/Fire matchup pressure"],
    },
    {
      slug: "sylveon",
      title: "Sylveon",
      job: "breaker",
      literacy: "wallbreaker",
      role: "Fairy spread converter",
      primaryJob: "Convert safe positioning into immediate spread Fairy damage.",
      item: "Fairy Feather",
      ability: "Pixilate",
      nature: "Modest",
      training: train(32, 0, 0, 32, 0, 2, {
        label: "Modest bulk / SpA",
        why: "Recommended self-contained spread route without setup dependency.",
        spend: ["32 HP", "32 SpA", "2 Spe"],
        rule: SP_NOTE,
      }),
      moves: [
        { name: "Hyper Voice", why: "Primary immediate spread conversion." },
        { name: "Hyper Beam", why: "High-power single-target finishing conversion." },
        { name: "Quick Attack", why: "Priority cleanup after Hyper Voice damage." },
        { name: "Protect", why: "Preserves Sylveon when the opponent can punish the attack." },
      ],
      objective: "Turn one safe turn into meaningful spread pressure without setup.",
      howToPlay:
        "Sylveon is an immediate converter. Use infrastructure to create one attack window, then reassess exposure.",
      gives: ["Fairy pressure", "spread damage", "priority cleanup"],
      answers: ["Dragon targets", "clustered boards"],
    },
  ],
  packs: [
    {
      id: PACK_FAIRY,
      label: "Fairy Conversion",
      when: "Opponent is vulnerable to immediate spread pressure or cannot safely isolate Sylveon.",
      identity: "Immediate Fairy spread plus infrastructure tempo.",
      slugs: ["raichu", "rillaboom", "gholdengo", "sylveon"],
      winconMode: "raichu-mega-y",
      engineIds: ["tempo-infrastructure", "special-scaling"],
      endgameIds: ["fairy-spread-cleanup", "gholdengo-cleanup"],
      winRouteIds: ["fake-out-nasty-plot", "fairy-spread-conversion"],
      identityCard: {
        engine: ["raichu", "rillaboom"],
        connector: ["rillaboom"],
        converter: ["sylveon"],
        scaler: ["gholdengo"],
        control: ["fake-out", "terrain"],
        winCondition: "Use tempo to create one safe spread-damage window, then let Sylveon and Gholdengo compound pressure.",
        clock: "fast-to-medium",
        commitment: "low",
        autonomy: "medium",
        triggerBreadth: "medium",
      },
      pilotDecision: {
        chooseWhen: [
          "Two opposing targets can be pressured by Hyper Voice.",
          "The opponent has limited immediate pressure into Sylveon.",
          "Gholdengo can exploit attention spent on Sylveon.",
        ],
        avoidWhen: [
          "The opponent easily isolates Sylveon.",
          "Physical autonomous conversion is more valuable.",
        ],
        previewQuestion: "Can Sylveon attack both targets while Raichu/Rillaboom protect the turn?",
        primaryMistake: "Treating Sylveon as a setup sweeper instead of an immediate converter.",
      },
      strategy: {
        opponentPattern: "Opponent relies on positioning or multiple targets punishable by spread damage.",
        bring: ["raichu", "rillaboom", "gholdengo", "sylveon"],
        purpose: "Convert one safe turn into immediate spread damage or Gholdengo scaling.",
        targets: ["Dragon targets", "Dark targets", "clustered board positions"],
        refuses: [
          "Do not repeatedly force Sylveon into isolated targets.",
          "Do not spend multiple turns setting up when Hyper Voice already converts the position.",
        ],
        winCondition: "Create a spread-damage opening and finish through Sylveon plus Gholdengo.",
        gamePlan: "Break: Fake Out or positioning. Control: preserve Sylveon/Gholdengo. Finish: Hyper Voice or boosted Gholdengo.",
        mantra: "Make one safe turn worth two attacks.",
        contrast: "Highest-immediacy special conversion package on the default six.",
        winconMode: "raichu-mega-y",
        turnChecklist: [
          "Which target can stop Sylveon?",
          "Can Fake Out remove it?",
          "Does Gholdengo want the same free turn?",
          "Can Hyper Voice hit both targets?",
          "What does the opponent do after the first spread attack?",
        ],
      },
      roles: [
        { slug: "raichu", macro: "tempo", micro: "Fake Out and Lightning Rod manipulate the first exchange." },
        { slug: "rillaboom", macro: "infrastructure", micro: "Terrain, Fake Out and priority preserve tempo." },
        { slug: "gholdengo", macro: "scaler", micro: "Uses protected turns to reach Nasty Plot pressure." },
        { slug: "sylveon", macro: "converter", micro: "Converts one safe turn into spread Fairy damage." },
      ],
      loops: [
        {
          id: "fairy-fakeout-loop",
          type: "conversion",
          title: "Fake Out → Hyper Voice",
          body: "If one opposing Pokémon is the main threat to Sylveon, use Fake Out to suppress it and Hyper Voice with the resulting safe action. Preserve Sylveon after the first conversion if the opponent can retaliate. End state: immediate spread damage without setup.",
          trigger: "One target prevents Sylveon from attacking freely.",
        },
        {
          id: "gholdengo-sylveon-split",
          type: "scaling",
          title: "Two Special Clocks",
          body: "When the opponent can only answer one special threat, put Gholdengo and Sylveon on different clocks. Use Sylveon's immediate damage if the board is open; otherwise protect Gholdengo and scale. End state: the opponent cannot efficiently stop both conversion routes.",
          trigger: "Opponent cannot comfortably target both special attackers.",
        },
      ],
      flows: [
        {
          id: "lead",
          title: "Lead",
          forks: [
            {
              id: "lead-0",
              when: "Fake Out creates a safe Hyper Voice turn.",
              then: "Use the immediate Fairy conversion.",
            },
            {
              id: "lead-1",
              when: "Sylveon is threatened immediately.",
              then: "Use Raichu/Rillaboom to control the first exchange and preserve the special attackers.",
            },
          ],
        },
      ],
      victims: [
        {
          name: "Dragon-heavy boards",
          why: "Fairy pressure creates immediate type-based pressure.",
          play: "Position Sylveon to attack without giving the opponent a free double target.",
          trap: "Do not assume Hyper Voice is safe if Steel or Poison pressure is present.",
        },
      ],
      counters: [
        {
          name: "Strong Steel pressure",
          why: "It reduces Sylveon's immediate conversion.",
          play: "Shift pressure toward Gholdengo or Rillaboom.",
          trap: "Do not repeatedly force Sylveon into bad targets.",
        },
      ],
      advantages: [
        { title: "Immediate special conversion", body: "The package can create damage without requiring Sylveon to set up." },
      ],
      hazards: [
        {
          title: "Mega choice",
          body: "If Raichu is Mega in this package, do not plan around Staraptor's Mega kit simultaneously.",
        },
      ],
    },
    {
      id: PACK_GARCHOMP,
      label: "Autonomous Garchomp",
      when: "Ground/Rock coverage and independent physical conversion beat Fairy spread.",
      identity: "Replace Sylveon's spread conversion with Garchomp's autonomous multi-axis pressure.",
      slugs: ["raichu", "rillaboom", "staraptor", "garchomp"],
      requiresSwap: { out: "sylveon", in: "garchomp" },
      winconMode: "staraptor-mega",
      engineIds: ["tempo-infrastructure", "immediate-conversion"],
      endgameIds: ["autonomous-garchomp-cleanup"],
      winRouteIds: ["tailwind-immediate-pressure"],
      identityCard: {
        engine: ["staraptor", "raichu", "rillaboom"],
        connector: ["staraptor"],
        converter: ["garchomp"],
        scaler: [],
        control: ["tailwind", "fake-out", "intimidate"],
        winCondition: "Create speed or targeting advantage and let Garchomp convert without setup.",
        clock: "fast",
        commitment: "low-to-medium",
        autonomy: "high",
        triggerBreadth: "high",
      },
      pilotDecision: {
        chooseWhen: [
          "The matchup rewards Ground or Rock coverage.",
          "The team needs autonomous damage.",
          "The opponent can isolate Sylveon.",
        ],
        avoidWhen: [
          "Fairy spread is uniquely valuable.",
          "The board makes Garchomp's Ground attacks difficult to use.",
        ],
        previewQuestion: "Can Garchomp turn Tailwind, Fake Out or Intimidate into immediate damage?",
        primaryMistake: "Treating Garchomp as a one-dimensional Earthquake user.",
      },
      strategy: {
        opponentPattern: "Targets vulnerable to Ground/Rock/Dragon coverage or boards that punish slower special conversion.",
        bring: ["raichu", "rillaboom", "staraptor", "garchomp"],
        purpose: "Generate an opening and immediately convert through Garchomp.",
        targets: ["Fire targets", "Steel targets", "Flying targets vulnerable to Rock", "Electric targets vulnerable to Ground"],
        refuses: [
          "Do not force Earthquake into Grassy Terrain if another click is superior.",
          "Do not spend turns setting up when Garchomp already has a conversion window.",
        ],
        winCondition: "Use infrastructure to make Garchomp's broad coverage difficult to answer simultaneously.",
        gamePlan: "Break: Fake Out or Tailwind. Control: Intimidate and positioning. Finish: Garchomp coverage plus Rillaboom priority.",
        mantra: "Create the opening, then convert without asking permission.",
        contrast: "Sacrifices Fairy spread for autonomous physical coverage.",
        winconMode: "staraptor-mega",
        turnChecklist: [
          "Which Garchomp move hits the most valuable target?",
          "Is Grassy Terrain active?",
          "Can Tailwind turn Garchomp into the faster threat?",
          "What target is forced to respect Rock coverage?",
          "Can Rillaboom finish what Garchomp starts?",
        ],
      },
      roles: [
        { slug: "raichu", macro: "tempo", micro: "Creates free turns and redirects Electric pressure." },
        { slug: "rillaboom", macro: "infrastructure", micro: "Fake Out, terrain and priority stabilize Garchomp." },
        { slug: "staraptor", macro: "connector", micro: "Tailwind and Intimidate convert position into Garchomp access." },
        { slug: "garchomp", macro: "converter", micro: "Autonomously converts speed and positioning into coverage damage." },
      ],
      loops: [
        {
          id: "tailwind-garchomp",
          type: "conversion",
          title: "Tailwind → Garchomp",
          body: "When Garchomp can outspeed the important opposing threats under Tailwind, establish speed control and immediately attack the most valuable target. Use Tailwind only when it changes Garchomp's conversion range. End state: Garchomp converts speed control into immediate damage.",
          trigger: "Tailwind creates a meaningful speed breakpoint.",
        },
        {
          id: "fakeout-garchomp",
          type: "infrastructure",
          title: "Fake Out → Autonomous Conversion",
          body: "If one opposing Pokémon prevents Garchomp from converting safely, Fake Out that target and attack the second slot. Preserve the remaining infrastructure for the following turn. End state: Garchomp produces value without setup.",
          trigger: "One target is the main obstacle to Garchomp.",
        },
      ],
      flows: [
        {
          id: "lead",
          title: "Lead",
          forks: [
            {
              id: "lead-0",
              when: "Opponent has a clear Garchomp target.",
              then: "Use Tailwind or Fake Out to create immediate conversion.",
            },
            {
              id: "lead-1",
              when: "Opponent can punish Garchomp immediately.",
              then: "Use the infrastructure to reposition before committing Garchomp.",
            },
          ],
        },
      ],
      victims: [
        {
          name: "Fire/Steel targets",
          why: "Ground coverage creates immediate pressure.",
          play: "Use positioning and speed control to make the Ground attack safe.",
          trap: "Do not ignore terrain effects.",
        },
      ],
      counters: [
        {
          name: "Strong Flying/Levitate boards",
          why: "They reduce Ground conversion.",
          play: "Use Rock coverage or shift to Rillaboom/other routes.",
          trap: "Do not repeatedly force Ground attacks into immunity.",
        },
      ],
      advantages: [
        { title: "Autonomous conversion", body: "Garchomp does not require a specific reactive trigger or setup state to contribute." },
      ],
      hazards: [
        {
          title: "Grassy Terrain",
          body: "Rillaboom's own terrain changes the value of Ground attacks — choose the attack rather than autopiloting Earthquake.",
        },
      ],
    },
    {
      id: PACK_MILOTIC,
      label: "Reactive Milotic",
      when: "Opponent relies on Intimidate, physical manipulation or attrition.",
      identity: "Convert opponent state manipulation into special pressure and longer-game control.",
      slugs: ["raichu", "rillaboom", "milotic", "gholdengo"],
      requiresSwap: { out: "sylveon", in: "milotic" },
      winconMode: "raichu-mega-y",
      engineIds: ["tempo-infrastructure", "special-scaling"],
      endgameIds: ["reactive-control-cleanup", "gholdengo-cleanup"],
      winRouteIds: ["fake-out-nasty-plot"],
      identityCard: {
        engine: ["raichu", "rillaboom"],
        connector: ["rillaboom"],
        converter: ["milotic"],
        scaler: ["milotic", "gholdengo"],
        control: ["fake-out", "competitive", "protect"],
        winCondition: "Make opponent stat manipulation create value, then outscale the board.",
        clock: "medium-to-long",
        commitment: "low-to-medium",
        autonomy: "medium",
        triggerBreadth: "medium",
      },
      pilotDecision: {
        chooseWhen: [
          "Intimidate is likely.",
          "The opponent cannot immediately overwhelm Milotic.",
          "A longer game favors accumulated value.",
        ],
        avoidWhen: [
          "The game requires immediate Fairy spread.",
          "Opponent can simply ignore Milotic and win elsewhere.",
        ],
        previewQuestion: "Will the opponent's normal control actions create Competitive or safe scaling opportunities?",
        primaryMistake: "Treating Competitive as mandatory instead of treating Milotic as useful without the trigger.",
      },
      strategy: {
        opponentPattern: "Physical or stat-control team that must interact with Milotic.",
        bring: ["raichu", "rillaboom", "milotic", "gholdengo"],
        purpose: "Turn reactive value into a stable midgame and let Gholdengo finish.",
        targets: ["Intimidate users", "physical attackers", "teams vulnerable to Muddy Water"],
        refuses: ["Do not chase Competitive triggers.", "Do not expose Milotic before the opponent has committed resources."],
        winCondition: "Survive the first exchanges, accumulate reactive value and close with Milotic or Gholdengo.",
        gamePlan: "Break: punish the opponent's first control action. Control: accumulate value. Finish: boosted special damage and priority cleanup.",
        mantra: "Make their control tools expensive.",
        contrast: "Replaces immediate Fairy conversion with reactive control.",
        winconMode: "raichu-mega-y",
        turnChecklist: [
          "Is Intimidate likely?",
          "What happens if they ignore Milotic?",
          "Can Gholdengo scale while Milotic absorbs attention?",
          "Is Coil safe?",
          "What is the endgame if Milotic is removed?",
        ],
      },
      roles: [
        { slug: "raichu", macro: "tempo", micro: "Buys Milotic and Gholdengo safe turns." },
        { slug: "rillaboom", macro: "infrastructure", micro: "Controls terrain and preserves board stability." },
        { slug: "milotic", macro: "reactive-control", micro: "Turns opponent state manipulation into pressure." },
        { slug: "gholdengo", macro: "scaler", micro: "Uses the slower game to accumulate special pressure." },
      ],
      loops: [
        {
          id: "competitive-conversion",
          type: "counterplay",
          title: "Intimidate → Competitive",
          body: "When the opponent uses Intimidate into Milotic, accept the stat drop and immediately evaluate the new offensive range. Use the resulting pressure to force a defensive response while Gholdengo gains time elsewhere. End state: their Intimidate becomes an offensive resource.",
          trigger: "Opponent uses Intimidate.",
        },
        {
          id: "dual-special-scaling",
          type: "scaling",
          title: "Milotic + Gholdengo",
          body: "If the opponent commits resources to Milotic, use Gholdengo to scale; if they commit to Gholdengo, preserve Milotic and accumulate control value. Do not force both attackers to scale simultaneously. End state: two scaling mechanisms create targeting ambiguity.",
          trigger: "Opponent cannot answer both special threats equally.",
        },
      ],
      flows: [
        {
          id: "lead",
          title: "Lead",
          forks: [
            {
              id: "lead-0",
              when: "Opponent strongly signals Intimidate.",
              then: "Position Milotic to make the stat drop costly.",
            },
            {
              id: "lead-1",
              when: "Opponent lacks immediate Milotic pressure.",
              then: "Use Raichu/Rillaboom tempo to establish Gholdengo scaling.",
            },
          ],
        },
      ],
      victims: [
        {
          name: "Intimidate-heavy physical teams",
          why: "Competitive converts their stat-control action into offensive value.",
          play: "Keep Milotic positioned to receive the drop.",
          trap: "Do not assume every Intimidate activation is automatically favorable if the opponent has a better target elsewhere.",
        },
      ],
      counters: [
        {
          name: "Teams that ignore Milotic",
          why: "Competitive may never activate.",
          play: "Use Milotic's attacks and control tools rather than waiting for the trigger.",
          trap: "Do not make the entire game plan depend on Intimidate.",
        },
      ],
      advantages: [
        { title: "Reactive conversion", body: "The opponent can create Milotic's value through normal board-control actions." },
      ],
      hazards: [
        {
          title: "Low trigger dependence",
          body: "Milotic remains useful without Competitive; do not manufacture bad positions just to activate it.",
        },
      ],
    },
    {
      id: PACK_CERULEDGE,
      label: "Ceruledge Scaling",
      when: "The opponent permits a protected setup turn and Grassy Terrain can be converted into long-term value.",
      identity: "Self-scaling physical route backed by the infrastructure.",
      slugs: ["raichu", "rillaboom", "ceruledge", "gholdengo"],
      requiresSwap: { out: "arcanine-hisui", in: "ceruledge" },
      winconMode: "raichu-mega-y",
      engineIds: ["tempo-infrastructure", "special-scaling"],
      endgameIds: ["gholdengo-cleanup"],
      winRouteIds: ["fake-out-nasty-plot"],
      identityCard: {
        engine: ["rillaboom", "raichu"],
        connector: ["rillaboom"],
        converter: ["ceruledge"],
        scaler: ["ceruledge", "gholdengo"],
        control: ["fake-out", "terrain"],
        winCondition: "Use Grassy Terrain and protected turns to create two independent scaling threats.",
        clock: "medium",
        commitment: "medium",
        autonomy: "medium",
        triggerBreadth: "medium",
      },
      pilotDecision: {
        chooseWhen: [
          "Opponent lacks immediate setup denial.",
          "Grassy Terrain provides meaningful sustain or Seed activation.",
          "Long-term scaling is more valuable than immediate burst.",
        ],
        avoidWhen: [
          "Opponent has reliable immediate pressure into Ceruledge.",
          "The matchup requires instant damage.",
        ],
        previewQuestion: "Can Ceruledge receive one protected turn and become meaningfully harder to remove?",
        primaryMistake: "Swords Dancing without first securing the board.",
      },
      strategy: {
        opponentPattern: "Opponent has difficulty stopping setup and sustain simultaneously.",
        bring: ["raichu", "rillaboom", "ceruledge", "gholdengo"],
        purpose: "Create a board where either Ceruledge or Gholdengo receives the scaling turn.",
        targets: ["Teams weak to sustained Fire/Ghost pressure", "Teams with limited setup denial"],
        refuses: [
          "Do not Swords Dance into obvious double-target pressure.",
          "Do not sacrifice the infrastructure before the scaling route has paid off.",
        ],
        winCondition: "One scaler reaches a point where the opponent can no longer trade efficiently.",
        gamePlan: "Break: Fake Out and positioning. Control: protect the scaling piece. Finish: Bitter Blade/Shadow Sneak or Gholdengo.",
        mantra: "One safe turn creates the next threat.",
        contrast: "Medium-clock scaling package.",
        winconMode: "raichu-mega-y",
        turnChecklist: [
          "Can Ceruledge survive the next turn?",
          "Is Grassy Seed already active?",
          "Who is the opponent targeting?",
          "Would Gholdengo benefit more from the free turn?",
          "Can Shadow Sneak finish something?",
        ],
      },
      roles: [
        { slug: "raichu", macro: "tempo", micro: "Creates protected setup windows." },
        { slug: "rillaboom", macro: "engine", micro: "Creates terrain and Fake Out opportunities." },
        { slug: "ceruledge", macro: "scaler", micro: "Turns safe turns into progressively stronger physical pressure." },
        { slug: "gholdengo", macro: "scaler", micro: "Creates the second independent scaling clock." },
      ],
      loops: [
        {
          id: "grassy-seed-scale",
          type: "scaling",
          title: "Terrain → Seed → Swords Dance",
          body: "When Grassy Terrain gives Ceruledge a safe durability window, use the Seed value to absorb pressure and only Swords Dance when the opponent cannot punish the setup. Then use Bitter Blade to turn offensive pressure back into sustain. End state: Ceruledge is harder to remove and more dangerous.",
          trigger: "Ceruledge has a protected setup window.",
        },
        {
          id: "two-scaler-dilemma",
          type: "counterplay",
          title: "Ceruledge or Gholdengo",
          body: "If the opponent commits to stopping Ceruledge, use Gholdengo's free turn to scale; if they stop Gholdengo, let Ceruledge accumulate value. Preserve whichever scaler is less contested. End state: two scaling threats create targeting ambiguity.",
          trigger: "Opponent cannot fully deny both scaling routes.",
        },
      ],
      flows: [
        {
          id: "lead",
          title: "Lead",
          forks: [
            {
              id: "lead-0",
              when: "Opponent has weak immediate pressure.",
              then: "Prioritize the Ceruledge scaling route.",
            },
            {
              id: "lead-1",
              when: "Opponent heavily pressures Ceruledge.",
              then: "Use Gholdengo as the alternate scaling route.",
            },
          ],
        },
      ],
      victims: [
        {
          name: "Passive setup-denial-light teams",
          why: "Ceruledge can accumulate value without being immediately removed.",
          play: "Use the infrastructure to create one protected setup turn.",
          trap: "Do not assume a passive-looking board cannot punish greed.",
        },
      ],
      counters: [
        {
          name: "Immediate double-target pressure",
          why: "It can prevent Ceruledge from reaching its scaling threshold.",
          play: "Pivot toward Gholdengo and preserve Ceruledge.",
          trap: "Do not repeatedly attempt Swords Dance.",
        },
      ],
      advantages: [
        {
          title: "Two independent scaling clocks",
          body: "Ceruledge and Gholdengo become progressively harder to answer in different ways.",
        },
      ],
      hazards: [
        {
          title: "Setup greed",
          body: "The module is scaling — not blind Swords Dance whenever available.",
        },
      ],
    },
    {
      id: PACK_ANNIHILAPE,
      label: "Counterplay Network",
      when: "Opponent must attack or use stat manipulation into Annihilape.",
      identity: "Convert opponent actions into Rage Fist and Defiant value.",
      slugs: ["raichu", "rillaboom", "annihilape", "gholdengo"],
      requiresSwap: { out: "arcanine-hisui", in: "annihilape" },
      winconMode: "raichu-mega-y",
      engineIds: ["tempo-infrastructure", "special-scaling"],
      endgameIds: ["gholdengo-cleanup"],
      winRouteIds: ["fake-out-nasty-plot"],
      identityCard: {
        engine: ["raichu", "rillaboom"],
        connector: ["raichu", "rillaboom"],
        converter: ["annihilape"],
        scaler: ["annihilape", "gholdengo"],
        control: ["fake-out", "defiant"],
        winCondition:
          "Make the opponent's required attacks increase Annihilape's future threat while Gholdengo provides an independent scaling route.",
        clock: "medium",
        commitment: "high",
        autonomy: "medium",
        triggerBreadth: "high",
      },
      pilotDecision: {
        chooseWhen: [
          "Opponent must attack Annihilape.",
          "Intimidate or other stat drops are likely.",
          "The matchup rewards prolonged board interaction.",
        ],
        avoidWhen: ["Opponent can ignore Annihilape.", "Immediate nuclear conversion is required."],
        previewQuestion: "What happens if the opponent attacks Annihilape twice?",
        primaryMistake: "Treating Rage Fist as free damage without respecting its positional commitment.",
      },
      strategy: {
        opponentPattern: "Opponent must interact directly with Annihilape or manipulate its stats.",
        bring: ["raichu", "rillaboom", "annihilape", "gholdengo"],
        purpose: "Make ordinary opponent actions increase the team's future conversion power.",
        targets: ["Intimidate users", "physical attackers", "teams that cannot safely ignore Annihilape"],
        refuses: [
          "Do not expose Annihilape merely to charge Rage Fist.",
          "Do not sacrifice Gholdengo because Annihilape is accumulating value.",
        ],
        winCondition:
          "Annihilape accumulates enough interaction value to become a dominant threat while Gholdengo creates the alternate clock.",
        gamePlan: "Break: identify the opponent's forced interaction. Control: preserve Annihilape's HP and positioning. Finish: boosted Rage Fist or Gholdengo.",
        mantra: "Make their correct attacks expensive.",
        contrast: "Highest counterplay-conversion package.",
        winconMode: "raichu-mega-y",
        turnChecklist: [
          "Must they attack Annihilape?",
          "Will the attack actually improve Rage Fist enough?",
          "Is Defiant likely?",
          "Can Gholdengo scale while they interact with Annihilape?",
          "Is Annihilape's accumulated resource worth staying in?",
        ],
      },
      roles: [
        { slug: "raichu", macro: "tempo", micro: "Creates turns and protects the Rage Fist resource." },
        { slug: "rillaboom", macro: "infrastructure", micro: "Fake Out and terrain control create better Annihilape positions." },
        { slug: "annihilape", macro: "counterplay-scaler", micro: "Turns attacks and stat drops into future offensive value." },
        { slug: "gholdengo", macro: "scaler", micro: "Provides an independent special clock." },
      ],
      loops: [
        {
          id: "rage-fist-resource",
          type: "counterplay",
          title: "Attack Me → Rage Fist",
          body: "When the opponent must attack Annihilape, preserve its position and allow the accumulated Rage Fist resource to increase. Use Fake Out and positioning to prevent the opponent from converting their attack into a favorable trade. End state: opponent interaction becomes future offensive power.",
          trigger: "Opponent must target Annihilape.",
        },
        {
          id: "defiant-conversion",
          type: "counterplay",
          title: "Stat Drop → Defiant",
          body: "When the opponent uses a stat-dropping action into Annihilape, treat Defiant as an immediate conversion window. Attack the newly valuable target while the opponent is forced to reconsider its control plan. End state: their control action creates offensive momentum.",
          trigger: "Opponent uses a stat-dropping effect.",
        },
      ],
      flows: [
        {
          id: "lead",
          title: "Lead",
          forks: [
            {
              id: "lead-0",
              when: "Opponent must attack Annihilape.",
              then: "Protect its positioning and allow Rage Fist to accumulate.",
            },
            {
              id: "lead-1",
              when: "Opponent can ignore Annihilape.",
              then: "Do not force the Rage Fist route; use Gholdengo as the primary scaler.",
            },
          ],
        },
      ],
      victims: [
        {
          name: "Intimidate-heavy teams",
          why: "Defiant turns stat drops into offensive value.",
          play: "Keep Annihilape positioned to receive the drop.",
          trap: "Do not assume Intimidate alone makes Annihilape safe.",
        },
      ],
      counters: [
        {
          name: "Teams that ignore Annihilape",
          why: "Rage Fist requires interaction to accumulate.",
          play: "Shift the win condition toward Gholdengo.",
          trap: "Do not sacrifice board position trying to force Rage Fist.",
        },
      ],
      advantages: [
        {
          title: "Broad trigger breadth",
          body: "Attacks and stat manipulation can both create value, giving the module multiple reactive entry points.",
        },
      ],
      hazards: [
        {
          title: "Resource lock",
          body: "Rage Fist accumulation rewards staying on the field — leaving at the wrong time can destroy accumulated value.",
        },
      ],
    },
  ],
} satisfies TeamManual;
