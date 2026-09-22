import { train } from "@/content/manual-train";
import type { TeamManual } from "@/content/manuals";

const BOX = [
  "raichu",
  "rillaboom",
  "staraptor",
  "gholdengo",
  "sylveon",
  "garchomp",
] as const;

const SP_NOTE =
  "Starting architecture spend (66 SP, max 32). Recommended configuration — not claimed as mathematically optimal vs every M-C threshold.";

export const CONVERSION_NETWORK_MODULAR_MC_MANUAL = {
    id: "conversion-network-modular-mc-manual",
    title: "Garchomp Conversion Network",
    lede: "A modular M-C balance network built around board control, immediate conversion, Tailwind positioning, and swappable reactive/scaling modules.",
    format: "doubles",
    philosophy: "Create board states with Fake Out, terrain, Intimidate and speed control, then convert them through Garchomp, Gholdengo and Sylveon.",
    archetype: "balance",
    family: "clock",
    meta: "Pokémon Champions Doubles, Regulation M-C. Modular conversion network with swappable bench modules and competing Mega packages.",
    setsNote: SP_NOTE,
    press: [
      "Fake Out",
      "Tailwind",
      "Garchomp",
      "Modular bench",
    ],
    pilot: {
      thesis: "Create a positional advantage, convert immediately, then force the opponent to answer a second independent threat.",
      rule: "Use two different Mega packages rather than forcing both Mega candidates into the same four.",
      fail: "Forcing Mega, Tailwind, or setup when immediate conversion is already favored.",
    },
    box: [...BOX],
    core: [
      "garchomp",
      "rillaboom",
      "sylveon",
      "gholdengo",
    ],
    slugs: [
      "garchomp",
      "rillaboom",
      "sylveon",
      "gholdengo",
    ],
    slots: [],
    coreArchitecture: {
      identity: "Swiss Army knife conversion network",
      primaryEngine: "Rillaboom plus Raichu or Staraptor creates tempo and board control.",
      conversionModel: "Immediate conversion through Garchomp/Sylveon/Gholdengo rather than requiring every attacker to set up.",
      scalingModel: "Gholdengo provides the primary special scaling clock while the bench can add Ceruledge or Annihilape scaling.",
      controlModel: "Fake Out, Intimidate, Lightning Rod, Protect and Tailwind manipulate the board before committing damage.",
      speedModel: "Two distinct speed modes: Mega Raichu natural speed and Staraptor Tailwind.",
      resourceModel: "Fake Out turns, terrain, Intimidate resets, Protect cycles and positional switches are the primary resources.",
      threatProfile: [
        "immediate physical conversion",
        "immediate special spread damage",
        "special scaling",
        "speed control",
        "Intimidate control",
        "Electric redirection",
        "priority",
      ],
    },
    clocks: [
      {
        id: "tempo-clock",
        owner: [
          "raichu",
          "rillaboom",
        ],
        speed: "immediate",
        goal: "Fake Out and terrain create the first conversion window.",
      },
      {
        id: "speed-clock",
        owner: [
          "staraptor",
        ],
        speed: "fast",
        goal: "Tailwind compresses the board before the opponent stabilizes.",
      },
      {
        id: "conversion-clock",
        owner: [
          "garchomp",
          "sylveon",
          "gholdengo",
        ],
        speed: "fast",
        goal: "Turn positional advantage into immediate or scaling damage.",
      },
    ],
    winRoutes: [
      {
        id: "route_raichu",
        name: "Fake Out → Mega Raichu → Special Fork",
        requires: [],
        sequence: [
          "Fake Out control",
          "Mega Raichu conversion",
          "force target selection",
        ],
        finish: "Gholdengo/Sylveon finish",
      },
      {
        id: "route_tailwind",
        name: "Intimidate → Tailwind → Garchomp",
        requires: [],
        sequence: [
          "Intimidate",
          "Tailwind",
          "Garchomp conversion",
        ],
        finish: "Gholdengo second wave",
      },
      {
        id: "route_no_mega",
        name: "Garchomp → Sylveon → Gholdengo",
        requires: [],
        sequence: [
          "Garchomp immediate pressure",
          "defensive rotation",
          "Sylveon spread",
        ],
        finish: "Gholdengo finish",
      },
      {
        id: "route_reactive",
        name: "Swap into Reactive Control",
        requires: [],
        sequence: [
          "Replace Garchomp with Milotic",
          "punish Intimidate",
          "create special advantage",
        ],
        finish: "scale Gholdengo",
      },
      {
        id: "route_scaling",
        name: "Swap into Self-Scaling",
        requires: [],
        sequence: [
          "Replace Sylveon with Ceruledge",
          "Grassy Seed",
          "Swords Dance",
        ],
        finish: "force dual-scaler dilemma",
      },
      {
        id: "route_counterplay",
        name: "Swap into Counterplay",
        requires: [],
        sequence: [
          "Replace Garchomp with Annihilape",
          "feed Defiant/Rage Fist",
          "force targeting",
        ],
        finish: "Gholdengo converts",
      },
    ],
    failureRoutes: [
      {
        failedRoute: "Mega Raichu is neutralized early.",
        why: "The planned route no longer has a safe conversion window.",
        fallback: "Use Gholdengo/Sylveon special conversion and preserve Rillaboom priority.",
        nextRoute: "Special conversion through Gholdengo and Sylveon.",
      },
      {
        failedRoute: "Staraptor cannot establish Tailwind.",
        why: "The planned route no longer has a safe conversion window.",
        fallback: "Use Rillaboom Fake Out and immediate Garchomp conversion.",
        nextRoute: "Immediate physical conversion through Garchomp and Rillaboom.",
      },
      {
        failedRoute: "Garchomp cannot safely convert.",
        why: "The planned route no longer has a safe conversion window.",
        fallback: "Shift toward Sylveon/Gholdengo special pressure.",
        nextRoute: "Special conversion through Gholdengo and Sylveon.",
      },
      {
        failedRoute: "Gholdengo is removed.",
        why: "The planned route no longer has a safe conversion window.",
        fallback: "Use Garchomp plus Sylveon or Rillaboom to finish through immediate conversion.",
        nextRoute: "Immediate physical conversion through Garchomp and Rillaboom.",
      },
    ],
    bench: {
      purpose: "Swap one module to change the conversion clock without rebuilding tempo infrastructure.",
      slots: [
        {
          slug: "milotic",
          insteadOf: "garchomp",
          category: "reactive-control",
          useWhen: [
            "Intimidate is central to the opponent.",
            "Physical pressure is the main problem.",
            "You want a reactive control route.",
          ],
          avoidWhen: [
            "Immediate Ground conversion is critical.",
            "Opponent can simply ignore Competitive.",
          ],
          changesArchitecture: true,
        },
        {
          slug: "ceruledge",
          insteadOf: "sylveon",
          category: "self-scaling",
          useWhen: [
            "Grassy Terrain creates safe setup.",
            "Opponent has limited answers to physical scaling.",
          ],
          avoidWhen: [
            "Immediate spread damage is required.",
            "Opponent has strong Fire pressure.",
          ],
          changesArchitecture: true,
        },
        {
          slug: "annihilape",
          insteadOf: "garchomp",
          category: "counterplay",
          useWhen: [
            "Opponent must attack.",
            "Opponent uses Intimidate.",
            "You can create repeated interaction.",
          ],
          avoidWhen: [
            "Opponent can ignore Annihilape.",
            "Immediate coverage is more important.",
          ],
          changesArchitecture: true,
        },
      ],
    },
    benchDiagnostics: [
      {
        problem: "Physical teams repeatedly overpower the main six.",
        symptoms: [
          "Intimidate cycling",
          "physical setup",
          "difficulty trading",
        ],
        recommendedModules: [
          "milotic",
        ],
      },
      {
        problem: "Opponent can comfortably answer immediate damage.",
        symptoms: [
          "passive boards",
          "long games",
          "single defensive answer",
        ],
        recommendedModules: [
          "ceruledge",
        ],
      },
      {
        problem: "Opponent attacks or Intimidates into the team repeatedly.",
        symptoms: [
          "forced targeting",
          "frequent stat drops",
          "many attacks into one slot",
        ],
        recommendedModules: [
          "annihilape",
        ],
      },
      {
        problem: "Need immediate Ground coverage and autonomous conversion.",
        symptoms: [
          "Steel-heavy board",
          "Fire pressure",
          "need to attack without setup",
        ],
        recommendedModules: [
          "garchomp",
        ],
      },
    ],
    replacementRelationships: [
      {
        out: "garchomp",
        in: "milotic",
        adds: [
          "Intimidate",
          "physical attackers",
          "stat-drop strategies",
        ],
        loses: [
          "loses Garchomp Ground coverage",
          "less immediate autonomous physical damage",
        ],
        changes: [
          "autonomous conversion → reactive special control",
        ],
      },
      {
        out: "sylveon",
        in: "ceruledge",
        adds: [
          "passive teams",
          "physical walls",
          "single-answer defensive plans",
        ],
        loses: [
          "loses immediate Fairy spread",
          "more setup-dependent",
        ],
        changes: [
          "immediate special conversion → self-scaling physical conversion",
        ],
      },
      {
        out: "garchomp",
        in: "annihilape",
        adds: [
          "Intimidate",
          "attack-heavy teams",
          "forced targeting",
        ],
        loses: [
          "loses immediate Ground coverage",
          "Rage Fist value has high positional commitment",
        ],
        changes: [
          "autonomous physical conversion → interaction-reactive scaling",
        ],
      },
    ],
    roster: [
      {
        slug: "raichu",
        title: "Raichu",
        job: "mega",
        literacy: "disruptor",
        primaryJob: "tempo engine",
        role: "Fast Fake Out controller and Mega special converter.",
        objective: "Create a safe turn for Gholdengo or Sylveon while threatening immediate Electric damage.",
        howToPlay: "Use Fake Out to create the first conversion window, Lightning Rod to manipulate Electric targeting, then Mega when the special-pressure route is the correct clock.",
        item: "Raichunite Y",
        ability: "Lightning Rod",
        nature: "Timid",
        moves: [
          {
            name: "Fake Out",
            why: "Creates the tempo window that lets a partner convert safely.",
          },
          {
            name: "Zap Cannon",
            why: "Mega special conversion with paralysis pressure.",
          },
          {
            name: "Focus Blast",
            why: "Punishes Steel, Dark and Rock targets that resist Electric pressure.",
          },
          {
            name: "Protect",
            why: "Preserves Mega Raichu while its partner consumes the created advantage.",
          },
        ],
        networkJobs: {
          creates: "Fake Out turns, Electric redirection, speed pressure",
          converts: "Zap Cannon and Focus Blast damage",
          protects: "Partners through Lightning Rod and Fake Out",
          scales: "Mega special pressure",
        },
        training: train(2, 0, 0, 32, 0, 32, {
            "label": "Fast special pressure",
            "why": "Prioritize Speed and Special Attack while preserving a small HP buffer.",
            "spend": [
              "2 HP",
              "32 SpA",
              "32 Spe"
            ],
            "rule": "Initial architecture spread; optimize exact defensive benchmarks after ladder testing."
          }),
      },
      {
        slug: "rillaboom",
        title: "Rillaboom",
        job: "support",
        literacy: "pivot",
        primaryJob: "terrain and tempo engine",
        role: "Terrain setter, Fake Out user and priority converter.",
        objective: "Control the first turn and preserve endgame priority.",
        howToPlay: "Use Fake Out and terrain to create safe positioning, then pivot or apply immediate Grass pressure.",
        item: "Miracle Seed",
        ability: "Grassy Surge",
        nature: "Adamant",
        moves: [
          {
            name: "Fake Out",
            why: "Creates a second tempo source alongside Raichu.",
          },
          {
            name: "Grassy Glide",
            why: "Provides priority conversion after the board has been softened.",
          },
          {
            name: "Wood Hammer",
            why: "Provides high immediate Grass damage when priority is insufficient.",
          },
          {
            name: "High Horsepower",
            why: "Provides Ground coverage without depending on Garchomp.",
          },
        ],
        networkJobs: {
          creates: "Grassy Terrain, Fake Out turns, priority windows",
          converts: "Grass and Ground damage",
          protects: "Team through terrain recovery and tempo",
          scales: "Endgame priority value",
        },
        training: train(2, 32, 0, 0, 0, 32, {
            "label": "Physical pressure",
            "why": "Maximize immediate Attack pressure while maintaining useful Speed.",
            "spend": [
              "2 HP",
              "32 Atk",
              "32 Spe"
            ],
            "rule": "Initial architecture spread; defensive benchmarks can replace Speed investment after testing."
          }),
      },
      {
        slug: "staraptor",
        title: "Staraptor",
        job: "mega",
        literacy: "pivot",
        primaryJob: "Tailwind and physical-control engine",
        role: "Speed setter, Intimidate pivot and physical converter.",
        objective: "Create a Tailwind board without sacrificing offensive pressure.",
        howToPlay: "Lead when Tailwind changes the speed regime. Intimidate first, Tailwind when safe, then either attack or Protect while the back pair converts.",
        item: "Staraptite",
        ability: "Intimidate",
        nature: "Jolly",
        moves: [
          {
            name: "Tailwind",
            why: "Creates the speed regime that unlocks Garchomp and Gholdengo.",
          },
          {
            name: "Brave Bird",
            why: "Stops Staraptor from becoming a passive speed setter.",
          },
          {
            name: "Close Combat",
            why: "Immediate Fighting conversion into Steel, Dark and Rock targets.",
          },
          {
            name: "Protect",
            why: "Preserves the Tailwind engine while the back pair takes over.",
          },
        ],
        networkJobs: {
          creates: "Tailwind and Attack drops",
          converts: "Flying and Fighting damage",
          protects: "Physical teammates through Intimidate",
          scales: "Speed advantage across subsequent turns",
        },
        training: train(2, 32, 0, 0, 0, 32, {
            "label": "Fast physical control",
            "why": "Maximize Speed and Attack for reliable Tailwind positioning and Mega damage.",
            "spend": [
              "2 HP",
              "32 Atk",
              "32 Spe"
            ],
            "rule": "Initial architecture spread; bulk benchmarks can replace HP/Speed allocation after testing."
          }),
      },
      {
        slug: "gholdengo",
        title: "Gholdengo",
        job: "breaker",
        literacy: "sweeper",
        primaryJob: "special scaling converter",
        role: "Special damage engine and status/utility blocker.",
        objective: "Turn protected tempo into increasingly difficult special pressure.",
        howToPlay: "Avoid exposing Gholdengo unnecessarily early. Use Fake Out, Tailwind or Intimidate to create the setup turn, then choose between immediate damage and Nasty Plot.",
        item: "Life Orb",
        ability: "Good as Gold",
        nature: "Modest",
        moves: [
          {
            name: "Make It Rain",
            why: "Primary spread conversion after the team creates a safe attack window.",
          },
          {
            name: "Shadow Ball",
            why: "Single-target Ghost conversion without lowering Special Attack.",
          },
          {
            name: "Nasty Plot",
            why: "Creates the scaling clock when the opponent gives a protected turn.",
          },
          {
            name: "Protect",
            why: "Lets the team spend opponent pressure before Gholdengo commits.",
          },
        ],
        networkJobs: {
          creates: "Special scaling threat",
          converts: "Make It Rain and Shadow Ball",
          protects: "Team utility by blocking status/ability-based disruption",
          scales: "Nasty Plot",
        },
        training: train(2, 0, 0, 32, 0, 32, {
            "label": "Special damage",
            "why": "Maximize Special Attack and Speed while retaining a small HP buffer.",
            "spend": [
              "2 HP",
              "32 SpA",
              "32 Spe"
            ],
            "rule": "Initial architecture spread; exact Speed benchmark should be tuned to the ladder."
          }),
      },
      {
        slug: "sylveon",
        title: "Sylveon",
        job: "breaker",
        literacy: "wallbreaker",
        primaryJob: "immediate special converter",
        role: "Spread-damage converter and physical-pressure relief valve.",
        objective: "Apply immediate special spread pressure without requiring setup.",
        howToPlay: "Bring Sylveon when the opponent cannot comfortably absorb repeated Fairy spread damage. Use its immediate damage to force awkward defensive turns for Gholdengo or Garchomp.",
        item: "Fairy Feather",
        ability: "Pixilate",
        nature: "Modest",
        moves: [
          {
            name: "Hyper Voice",
            why: "Reliable Pixilate spread conversion.",
          },
          {
            name: "Hyper Beam",
            why: "High-commitment finishing conversion once a target is already in range.",
          },
          {
            name: "Quick Attack",
            why: "Provides emergency priority conversion in endgames.",
          },
          {
            name: "Detect",
            why: "Preserves Sylveon while the opponent commits into another threat.",
          },
        ],
        networkJobs: {
          creates: "Targeting pressure and spread damage",
          converts: "Pixilate Fairy damage",
          protects: "Endgame through Detect and priority",
          scales: "Damage through positioning rather than setup",
        },
        training: train(32, 0, 0, 32, 2, 0, {
            "label": "Bulky special converter",
            "why": "Maximize Special Attack while using the remaining investment to improve general survivability.",
            "spend": [
              "32 HP",
              "32 SpA",
              "2 SpD"
            ],
            "rule": "Initial architecture spread; Speed can be substituted if a specific Tailwind benchmark emerges."
          }),
      },
      {
        slug: "garchomp",
        title: "Garchomp",
        job: "breaker",
        literacy: "wallbreaker",
        primaryJob: "autonomous physical converter",
        role: "Coverage bridge and immediate Ground/Dragon/Rock pressure.",
        objective: "Give the six a physical attacker that does not need a particular opponent response or setup turn.",
        howToPlay: "Bring Garchomp when immediate Ground coverage and autonomous damage are more valuable than another reactive or scaling engine. Use Staraptor's Tailwind or Rillaboom's Fake Out to create its conversion window.",
        item: "Clear Amulet",
        ability: "Rough Skin",
        nature: "Jolly",
        moves: [
          {
            name: "Earthquake",
            why: "High-value spread Ground conversion when the partner is protected or positioned to avoid it.",
          },
          {
            name: "Dragon Claw",
            why: "Reliable single-target Dragon conversion without committing to Outrage.",
          },
          {
            name: "Rock Slide",
            why: "Adds Flying, Fire and flinch pressure while broadening coverage.",
          },
          {
            name: "Protect",
            why: "Allows Garchomp to preserve itself while its partner exploits the opponent's response.",
          },
        ],
        networkJobs: {
          creates: "Immediate physical threat",
          converts: "Ground, Dragon and Rock damage",
          protects: "Partners through autonomous threat saturation",
          scales: "Board advantage through repeated coverage pressure",
        },
        training: train(2, 32, 0, 0, 0, 32, {
            "label": "Fast autonomous converter",
            "why": "The initial architecture emphasizes Speed and Attack with a small HP buffer.",
            "spend": [
              "2 HP",
              "32 Atk",
              "32 Spe"
            ],
            "rule": "Initial architecture spread; benchmark against the actual M-C ladder before finalizing."
          }),
      },
    ],
    packs: [
      {
        id: "pack_raichu_conversion",
        label: "Raichu Conversion",
        when: "Bring this when Fake Out plus Mega Raichu special pressure can dictate the first two turns.",
        identity: "Fast special conversion with redundant Fake Out.",
        slugs: [
          "raichu",
          "rillaboom",
          "gholdengo",
          "sylveon",
        ],
        strategy: {
          opponentPattern: "Fast offense or teams vulnerable to dual special pressure.",
          purpose: "Win the first two positioning exchanges.",
          targets: [
            "Steel checks",
            "Dark attackers",
            "fast offensive leads",
          ],
          refuses: [
            "long uncontrolled physical wars",
            "free setup from opposing sweepers",
          ],
          winCondition: "Fake Out creates the first conversion, then Gholdengo and Sylveon overwhelm the board.",
          gamePlan: "Break with Fake Out and Mega Raichu, control with terrain and Protect, finish through double-special spread.",
          mantra: "Create one free turn; make it worth more than one turn.",
          turnChecklist: [
            "Which opponent most threatens my converter?",
            "Who gets the Fake Out?",
            "Do I Mega now or preserve the option?",
            "Which back mon best converts the board?",
            "Can I preserve Rillaboom for priority?",
          ],
          bring: [
            "raichu",
            "rillaboom",
            "gholdengo",
            "sylveon",
          ],
          contrast: "Uses Mega Raichu instead of Tailwind Staraptor.",
        },
        roles: [
          {
            slug: "raichu",
            macro: "tempo",
            micro: "Fake Out and Mega special pressure",
          },
          {
            slug: "rillaboom",
            macro: "terrain",
            micro: "Fake Out and priority",
          },
          {
            slug: "gholdengo",
            macro: "scaler",
            micro: "special spread conversion",
          },
          {
            slug: "sylveon",
            macro: "converter",
            micro: "immediate Fairy spread",
          },
        ],
        fieldPlan: {
          leadPair: [
            "raichu",
            "rillaboom",
          ],
          leadWhy: "Double Fake Out creates maximum first-turn control.",
          backPair: [
            "gholdengo",
            "sylveon",
          ],
          backJobs: [
            {
              slug: "gholdengo",
              job: "Enter after Fake Out and either scale with Nasty Plot or immediately spread damage.",
            },
            {
              slug: "sylveon",
              job: "Provide immediate Fairy spread pressure when setup is unnecessary.",
            },
          ],
          pairEdges: [
            {
              from: "raichu",
              to: "rillaboom",
              creates: "double Fake Out control",
              converts: "safe positioning",
            },
            {
              from: "rillaboom",
              to: "raichu",
              creates: "terrain plus tempo",
              converts: "Mega Electric pressure",
            },
            {
              from: "gholdengo",
              to: "sylveon",
              creates: "special target saturation",
              converts: "Fairy spread pressure",
            },
          ],
          turn1: "Fake Out the piece that most threatens the next conversion; do not Mega automatically.",
          bringInTriggers: [
            "When the opposing physical attacker is controlled → bring Gholdengo to exploit the free turn.",
            "When Steel or Ghost pressure is low → bring Sylveon to convert immediately.",
          ],
        },
        defaultLeadPair: [
          "raichu",
          "rillaboom",
        ],
        backPair: [
          "gholdengo",
          "sylveon",
        ],
        identityCard: {
          winCondition: "Fast special conversion.",
        },
        pilotDecision: {
          chooseWhen: [
            "Opponent has fragile fast leads.",
            "Electric redirection creates value.",
            "Fairy spread has strong targets.",
          ],
          avoidWhen: [
            "Opponent has overwhelming Ground pressure.",
            "Speed control completely invalidates Raichu.",
          ],
          previewQuestion: "What does the opponent fear more: Mega Raichu or double-special spread?",
          primaryMistake: "Using both Fake Outs without converting the resulting turn.",
        },
        engineIds: [
          "engine_tempo_conversion",
          "engine_threat_fork",
        ],
        endgameIds: [
          "endgame_special_fork",
          "endgame_conversion",
        ],
        loops: [
          {
            title: "Double Fake Out",
            body: "If the opponent has two threatening leads, use Raichu Fake Out on the piece that disrupts the conversion and Rillaboom Fake Out on the piece that threatens the second turn, then bring in the strongest converter.",
          },
          {
            title: "Gholdengo Wave",
            body: "When Fake Out has removed the immediate threat, bring Gholdengo into the protected slot and choose Nasty Plot or Make It Rain based on whether the opponent can punish setup.",
          },
          {
            title: "Sylveon Close",
            body: "If the opponent has been chipped into spread-damage range, bring Sylveon forward and use Hyper Voice while preserving Rillaboom for priority.",
          },
        ],
        victims: [
          {
            name: "fragile fast offense",
            why: "fragile fast offense",
          },
          {
            name: "Dark attackers",
            why: "Dark attackers",
          },
          {
            name: "teams relying on Electric attacks",
            why: "teams relying on Electric attacks",
          },
        ],
        counters: [
          {
            name: "Ground pressure",
            why: "Ground pressure",
          },
          {
            name: "Psychic Terrain",
            why: "Psychic Terrain",
          },
          {
            name: "strong speed control",
            why: "strong speed control",
          },
        ],
        advantages: [
          {
            title: "dual Fake Out",
            body: "dual Fake Out",
          },
          {
            title: "high special pressure",
            body: "high special pressure",
          },
          {
            title: "Lightning Rod",
            body: "Lightning Rod",
          },
        ],
        hazards: [
          {
            title: "Ground targeting",
            body: "Ground targeting",
          },
          {
            title: "overcommitting Mega Raichu",
            body: "overcommitting Mega Raichu",
          },
          {
            title: "letting Gholdengo take unnecessary damage",
            body: "letting Gholdengo take unnecessary damage",
          },
        ],
      },
      {
        id: "pack_staraptor_tailwind",
        label: "Staraptor Tailwind",
        when: "Bring this when Tailwind lets Garchomp and Gholdengo attack before the opponent can stabilize.",
        identity: "Physical-control Tailwind package with autonomous Ground conversion.",
        slugs: [
          "staraptor",
          "rillaboom",
          "garchomp",
          "gholdengo",
        ],
        strategy: {
          opponentPattern: "Physical offense or teams relying on a narrow speed regime.",
          purpose: "Compress the opponent's defensive and speed resources.",
          targets: [
            "Steel types",
            "Fire types",
            "physical attackers",
          ],
          refuses: [
            "slow passive positioning",
            "single-target physical checks",
          ],
          winCondition: "Tailwind creates a Garchomp/Gholdengo double clock.",
          gamePlan: "Break with Tailwind-enabled attacks, control with Intimidate and Fake Out, finish with the surviving faster converter.",
          mantra: "Make their first answer too slow.",
          turnChecklist: [
            "Is Tailwind safe?",
            "Which physical attacker receives Intimidate?",
            "Which back mon benefits most from the speed window?",
            "Can Garchomp attack without damaging its partner?",
            "When does Staraptor Protect?",
          ],
          bring: [
            "staraptor",
            "rillaboom",
            "garchomp",
            "gholdengo",
          ],
          contrast: "Uses Mega Staraptor and Garchomp instead of Mega Raichu and Sylveon.",
        },
        roles: [
          {
            slug: "staraptor",
            macro: "speed",
            micro: "Tailwind and Intimidate",
          },
          {
            slug: "rillaboom",
            macro: "control",
            micro: "Fake Out and terrain",
          },
          {
            slug: "garchomp",
            macro: "converter",
            micro: "autonomous Ground pressure",
          },
          {
            slug: "gholdengo",
            macro: "scaler",
            micro: "special conversion",
          },
        ],
        fieldPlan: {
          leadPair: [
            "staraptor",
            "rillaboom",
          ],
          leadWhy: "Intimidate plus Fake Out protects the Tailwind turn.",
          backPair: [
            "garchomp",
            "gholdengo",
          ],
          backJobs: [
            {
              slug: "garchomp",
              job: "Enter under Tailwind and immediately convert Ground/Dragon/Rock coverage.",
            },
            {
              slug: "gholdengo",
              job: "Exploit the same speed window as the special second wave.",
            },
          ],
          pairEdges: [
            {
              from: "staraptor",
              to: "rillaboom",
              creates: "Intimidate plus speed",
              converts: "safe Fake Out cycle",
            },
            {
              from: "staraptor",
              to: "garchomp",
              creates: "Tailwind speed",
              converts: "Ground pressure",
            },
            {
              from: "rillaboom",
              to: "gholdengo",
              creates: "Fake Out window",
              converts: "special scaling",
            },
          ],
          turn1: "Intimidate the physical board and Tailwind if safe; otherwise Fake Out first and establish Tailwind on turn two.",
          bringInTriggers: [
            "When Tailwind is active → bring Garchomp to exploit immediate Ground pressure.",
            "When opposing physical pressure is weakened → bring Gholdengo to create the special fork.",
          ],
        },
        defaultLeadPair: [
          "staraptor",
          "rillaboom",
        ],
        backPair: [
          "garchomp",
          "gholdengo",
        ],
        identityCard: {
          winCondition: "Tailwind compression.",
        },
        pilotDecision: {
          chooseWhen: [
            "Garchomp has valuable Ground targets.",
            "Opponent has limited speed control.",
            "Physical Intimidate value is high.",
          ],
          avoidWhen: [
            "Opponent has overwhelming special pressure.",
            "Tailwind is easily reversed.",
          ],
          previewQuestion: "Which opposing Pokémon becomes unable to function if Garchomp moves first?",
          primaryMistake: "Treating Staraptor as the damage dealer instead of the speed/control engine.",
        },
        engineIds: [
          "engine_tailwind",
          "engine_threat_fork",
        ],
        endgameIds: [
          "endgame_tailwind",
          "endgame_conversion",
        ],
        loops: [
          {
            title: "Tailwind Wave",
            body: "If Staraptor can survive the opening exchange, use Intimidate and Tailwind, then bring Garchomp into the safest slot and immediately pressure the highest-value target.",
          },
          {
            title: "Fake Out Delay",
            body: "When Tailwind is unsafe, use Rillaboom Fake Out while Staraptor Protects or repositions, then establish Tailwind after the opposing threat has been removed.",
          },
          {
            title: "Second Wave Gholdengo",
            body: "If Garchomp forces the opponent to commit physical answers, bring Gholdengo into the protected side and convert the resulting special opening.",
          },
        ],
        victims: [
          {
            name: "physical offense",
            why: "physical offense",
          },
          {
            name: "Steel cores",
            why: "Steel cores",
          },
          {
            name: "slow attackers",
            why: "slow attackers",
          },
        ],
        counters: [
          {
            name: "special spread pressure",
            why: "special spread pressure",
          },
          {
            name: "speed reversal",
            why: "speed reversal",
          },
          {
            name: "strong priority",
            why: "strong priority",
          },
        ],
        advantages: [
          {
            title: "Intimidate",
            body: "Intimidate",
          },
          {
            title: "Tailwind",
            body: "Tailwind",
          },
          {
            title: "Garchomp coverage",
            body: "Garchomp coverage",
          },
        ],
        hazards: [
          {
            title: "Tailwind timing",
            body: "Tailwind timing",
          },
          {
            title: "Earthquake positioning",
            body: "Earthquake positioning",
          },
          {
            title: "Staraptor being focused before Tailwind",
            body: "Staraptor being focused before Tailwind",
          },
        ],
      },
      {
        id: "pack_garchomp_fairy",
        label: "Garchomp + Sylveon Conversion",
        when: "Bring this when Ground and Fairy pressure attack different defensive layers.",
        identity: "Four-way conversion network without relying on either Mega.",
        slugs: [
          "garchomp",
          "rillaboom",
          "sylveon",
          "gholdengo",
        ],
        strategy: {
          opponentPattern: "Balanced teams with separate Ground and Fairy vulnerabilities.",
          purpose: "Attack two defensive layers without committing a Mega.",
          targets: [
            "Steel targets for Garchomp",
            "Dark targets for Sylveon",
            "physical walls for Gholdengo",
          ],
          refuses: [
            "single-axis damage races",
            "unprotected Gholdengo setup",
          ],
          winCondition: "Garchomp forces physical responses while Sylveon and Gholdengo convert the exposed special axis.",
          gamePlan: "Break with Garchomp, control with Rillaboom, convert with Sylveon, finish with Gholdengo.",
          mantra: "Make the first answer create the second target.",
          turnChecklist: [
            "What does Garchomp immediately threaten?",
            "Which target cannot afford Hyper Voice?",
            "When does Gholdengo become safe?",
            "Can I preserve Rillaboom for the endgame?",
            "Do I actually need a Mega?",
          ],
          bring: [
            "garchomp",
            "rillaboom",
            "sylveon",
            "gholdengo",
          ],
          contrast: "The safest no-Mega package; preserves both Mega options for later battles.",
        },
        roles: [
          {
            slug: "garchomp",
            macro: "breaker",
            micro: "immediate Ground conversion",
          },
          {
            slug: "rillaboom",
            macro: "control",
            micro: "Fake Out and terrain",
          },
          {
            slug: "sylveon",
            macro: "converter",
            micro: "Fairy spread",
          },
          {
            slug: "gholdengo",
            macro: "scaler",
            micro: "special scaling",
          },
        ],
        fieldPlan: {
          leadPair: [
            "garchomp",
            "rillaboom",
          ],
          leadWhy: "Fake Out protects Garchomp while giving immediate physical pressure.",
          backPair: [
            "sylveon",
            "gholdengo",
          ],
          backJobs: [
            {
              slug: "sylveon",
              job: "Enter against Dark/Dragon/Fighting-heavy boards and convert immediately.",
            },
            {
              slug: "gholdengo",
              job: "Enter when the opponent commits physical answers and begin the special clock.",
            },
          ],
          pairEdges: [
            {
              from: "rillaboom",
              to: "garchomp",
              creates: "Fake Out opening",
              converts: "Earthquake pressure",
            },
            {
              from: "garchomp",
              to: "sylveon",
              creates: "defensive target split",
              converts: "Fairy spread",
            },
            {
              from: "sylveon",
              to: "gholdengo",
              creates: "special target saturation",
              converts: "Nasty Plot",
            },
          ],
          turn1: "Fake Out the biggest Garchomp threat and use Garchomp's immediate coverage rather than fishing for setup.",
          bringInTriggers: [
            "When Dark/Dragon/Fighting targets are exposed → bring Sylveon for immediate spread pressure.",
            "When physical answers commit to Garchomp → bring Gholdengo and begin the special clock.",
          ],
        },
        defaultLeadPair: [
          "garchomp",
          "rillaboom",
        ],
        backPair: [
          "sylveon",
          "gholdengo",
        ],
        identityCard: {
          winCondition: "No-Mega conversion package.",
        },
        pilotDecision: {
          chooseWhen: [
            "Both Mega candidates have poor matchups.",
            "Ground plus Fairy coverage is excellent.",
            "You want maximum flexibility for later games.",
          ],
          avoidWhen: [
            "The opponent requires Mega speed immediately.",
          ],
          previewQuestion: "Can Garchomp and Sylveon force different defensive answers?",
          primaryMistake: "Trying to make every turn explosive instead of preserving the conversion chain.",
        },
        engineIds: [
          "engine_tempo_conversion",
          "engine_threat_fork",
        ],
        endgameIds: [
          "endgame_conversion",
          "endgame_special_fork",
        ],
        loops: [
          {
            title: "Ground Opening",
            body: "If a target is vulnerable to Ground pressure, use Rillaboom Fake Out to suppress its partner and let Garchomp immediately convert the opening.",
          },
          {
            title: "Fairy Second Wave",
            body: "When the opponent rotates in a physical answer to Garchomp, bring Sylveon into the safer side and use Hyper Voice to punish the defensive rotation.",
          },
          {
            title: "Gholdengo Finish",
            body: "If Sylveon forces the opponent to commit Steel or Poison answers, bring Gholdengo into the resulting opening and scale or spread damage.",
          },
        ],
        victims: [
          {
            name: "balanced teams",
            why: "balanced teams",
          },
          {
            name: "Dark-heavy teams",
            why: "Dark-heavy teams",
          },
          {
            name: "Ground-weak Steel cores",
            why: "Ground-weak Steel cores",
          },
        ],
        counters: [
          {
            name: "strong Flying pressure",
            why: "strong Flying pressure",
          },
          {
            name: "speed control",
            why: "speed control",
          },
          {
            name: "wide special pressure",
            why: "wide special pressure",
          },
        ],
        advantages: [
          {
            title: "no Mega commitment",
            body: "no Mega commitment",
          },
          {
            title: "broad coverage",
            body: "broad coverage",
          },
          {
            title: "multiple independent converters",
            body: "multiple independent converters",
          },
        ],
        hazards: [
          {
            title: "Garchomp Earthquake positioning",
            body: "Garchomp Earthquake positioning",
          },
          {
            title: "Sylveon being too slow without Tailwind",
            body: "Sylveon being too slow without Tailwind",
          },
          {
            title: "Gholdengo overexposure",
            body: "Gholdengo overexposure",
          },
        ],
      },
      {
        id: "pack_milotic_swap",
        label: "Reactive Control Module",
        when: "Use when Intimidate-heavy physical teams or setup-heavy boards demand punishment rather than more immediate damage.",
        identity: "Converts opponent stat manipulation into special pressure and adds reactive control.",
        slugs: [
          "raichu",
          "rillaboom",
          "gholdengo",
          "milotic",
        ],
        strategy: {
          opponentPattern: "Intimidate-heavy physical offense or setup teams.",
          purpose: "Turn opponent board manipulation into our special advantage.",
          targets: [
            "Intimidate users",
            "physical attackers",
            "Ground/Fire attackers",
          ],
          refuses: [
            "unpunished Intimidate cycling",
            "passive physical attrition",
          ],
          winCondition: "Competitive plus Gholdengo create a dual special clock.",
          gamePlan: "Control with Fake Out, react with Competitive, scale with Gholdengo, finish through special pressure.",
          mantra: "If they manipulate stats, make the manipulation expensive.",
          turnChecklist: [
            "Are they about to Intimidate?",
            "Is Milotic safe to enter?",
            "Which special attacker should receive the opening?",
            "Can I preserve Rillaboom for priority?",
            "Do I need to reveal Mega Raichu?",
          ],
          bring: [
            "raichu",
            "rillaboom",
            "gholdengo",
            "milotic",
          ],
        },
        roles: [
          {
            slug: "raichu",
            macro: "tempo",
            micro: "Fake Out and redirection",
          },
          {
            slug: "rillaboom",
            macro: "control",
            micro: "terrain and Fake Out",
          },
          {
            slug: "gholdengo",
            macro: "scaler",
            micro: "special pressure",
          },
          {
            slug: "milotic",
            macro: "reactive",
            micro: "Competitive and control",
          },
        ],
        fieldPlan: {
          leadPair: [
            "raichu",
            "rillaboom",
          ],
          leadWhy: "Dual Fake Out protects Milotic's eventual entry and controls early setup.",
          backPair: [
            "gholdengo",
            "milotic",
          ],
          backJobs: [
            {
              slug: "gholdengo",
              job: "Provides independent special scaling while Milotic punishes physical stat drops.",
            },
            {
              slug: "milotic",
              job: "Enters against Intimidate and physical pressure, then converts Competitive into special damage.",
            },
          ],
          pairEdges: [
            {
              from: "raichu",
              to: "rillaboom",
              creates: "double Fake Out control",
              converts: "safe Milotic entry",
            },
            {
              from: "rillaboom",
              to: "milotic",
              creates: "protected entry window",
              converts: "Competitive pressure",
            },
            {
              from: "milotic",
              to: "gholdengo",
              creates: "special pressure",
              converts: "Nasty Plot",
            },
          ],
          turn1: "Use Fake Out to deny the most important attacker, then preserve the board until Milotic can enter into a favorable state.",
          bringInTriggers: [
            "When Intimidate appears → bring Milotic into the affected position and activate Competitive.",
            "When physical pressure is redirected toward Milotic → bring Gholdengo into the freed lane.",
          ],
        },
        defaultLeadPair: [
          "raichu",
          "rillaboom",
        ],
        backPair: [
          "gholdengo",
          "milotic",
        ],
        identityCard: {
          winCondition: "Reactive special control.",
        },
        pilotDecision: {
          chooseWhen: [
            "Intimidate is central to the opponent.",
            "Physical attackers dominate their preview.",
            "Setup needs to be punished.",
          ],
          avoidWhen: [
            "Opponent has little stat manipulation.",
            "Immediate Ground conversion is more valuable.",
          ],
          previewQuestion: "Will the opponent naturally feed Milotic value?",
          primaryMistake: "Bringing Milotic without a reason for its reactive engine to activate.",
        },
        engineIds: [
          "engine_tempo_conversion",
          "engine_threat_fork",
        ],
        endgameIds: [
          "endgame_special_fork",
          "endgame_bench_module",
        ],
        loops: [
          {
            title: "Competitive Punish",
            body: "If the opponent Intimidates, bring Milotic into the affected slot and use the Competitive boost to immediately pressure the board rather than merely accepting the boost.",
          },
          {
            title: "Special Rotation",
            body: "When Milotic draws physical attacks, Protect or reposition Milotic while Gholdengo takes the free turn and begins its own scaling route.",
          },
        ],
        victims: [
          {
            name: "Intimidate teams",
            why: "Intimidate teams",
          },
          {
            name: "physical balance",
            why: "physical balance",
          },
          {
            name: "setup reliant on stat drops",
            why: "setup reliant on stat drops",
          },
        ],
        counters: [
          {
            name: "special offense",
            why: "special offense",
          },
          {
            name: "status pressure",
            why: "status pressure",
          },
          {
            name: "teams that simply refuse to trigger Competitive",
            why: "teams that simply refuse to trigger Competitive",
          },
        ],
        advantages: [
          {
            title: "reactive conversion",
            body: "reactive conversion",
          },
          {
            title: "special redundancy",
            body: "special redundancy",
          },
          {
            title: "low positional commitment",
            body: "low positional commitment",
          },
        ],
        hazards: [
          {
            title: "narrow trigger",
            body: "narrow trigger",
          },
          {
            title: "being ignored",
            body: "being ignored",
          },
          {
            title: "overvaluing Competitive",
            body: "overvaluing Competitive",
          },
        ],
        requiresSwap: {
          out: "garchomp",
          in: "milotic",
        },
      },
      {
        id: "pack_ceruledge_swap",
        label: "Self-Scaling Module",
        when: "Use when the opponent gives setup windows or struggles to remove a physical scaler.",
        identity: "Tailwind plus dual scaling.",
        slugs: [
          "staraptor",
          "rillaboom",
          "gholdengo",
          "ceruledge",
        ],
        strategy: {
          opponentPattern: "Teams with limited answers to simultaneous physical and special scaling.",
          purpose: "Create two independent scaling clocks.",
          targets: [
            "passive teams",
            "physical walls",
            "teams with one primary scaler answer",
          ],
          refuses: [
            "single-target defensive plans",
            "slow attrition without setup",
          ],
          winCondition: "Force the opponent to choose which scaler receives the free turn.",
          gamePlan: "Create setup windows with Tailwind/Intimidate/Fake Out, scale two attackers, finish whichever scaler survives.",
          mantra: "They only get one answer at a time.",
          turnChecklist: [
            "Which scaler is safer?",
            "Is Grassy Seed activated?",
            "Does Tailwind make setup unnecessary?",
            "Which target is forced to answer Ceruledge?",
            "Can Gholdengo scale instead?",
          ],
          bring: [
            "staraptor",
            "rillaboom",
            "gholdengo",
            "ceruledge",
          ],
        },
        roles: [
          {
            slug: "staraptor",
            macro: "speed",
            micro: "Tailwind and Intimidate",
          },
          {
            slug: "rillaboom",
            macro: "control",
            micro: "terrain and Fake Out",
          },
          {
            slug: "gholdengo",
            macro: "scaler",
            micro: "special setup",
          },
          {
            slug: "ceruledge",
            macro: "scaler",
            micro: "physical setup",
          },
        ],
        fieldPlan: {
          leadPair: [
            "staraptor",
            "rillaboom",
          ],
          leadWhy: "Intimidate and Fake Out create the setup window for the back scalers.",
          backPair: [
            "gholdengo",
            "ceruledge",
          ],
          backJobs: [
            {
              slug: "gholdengo",
              job: "Scales specially while Ceruledge threatens physical setup.",
            },
            {
              slug: "ceruledge",
              job: "Uses Grassy Seed and Swords Dance to become progressively harder to answer.",
            },
          ],
          pairEdges: [
            {
              from: "staraptor",
              to: "rillaboom",
              creates: "safe setup window",
              converts: "Fake Out control",
            },
            {
              from: "rillaboom",
              to: "ceruledge",
              creates: "Grassy Seed activation",
              converts: "Swords Dance",
            },
            {
              from: "ceruledge",
              to: "gholdengo",
              creates: "physical target pressure",
              converts: "Nasty Plot",
            },
          ],
          turn1: "Use Intimidate plus Fake Out to identify which scaler can safely take the next turn.",
          bringInTriggers: [
            "When physical answers are distracted by Gholdengo → bring Ceruledge into Grassy Terrain.",
            "When Ceruledge draws Fire/physical attention → bring Gholdengo into the free lane.",
          ],
        },
        defaultLeadPair: [
          "staraptor",
          "rillaboom",
        ],
        backPair: [
          "gholdengo",
          "ceruledge",
        ],
        identityCard: {
          winCondition: "Dual scaling.",
        },
        pilotDecision: {
          chooseWhen: [
            "Opponent lacks immediate setup denial.",
            "Grassy Terrain has strong value.",
            "You expect long games.",
          ],
          avoidWhen: [
            "Opponent has overwhelming immediate spread damage.",
            "Setup turns are unavailable.",
          ],
          previewQuestion: "Can they answer both Gholdengo and Ceruledge without giving one a free turn?",
          primaryMistake: "Setting up both scalers when immediate damage would already win the exchange.",
        },
        engineIds: [
          "engine_tailwind",
          "engine_threat_fork",
        ],
        endgameIds: [
          "endgame_tailwind",
          "endgame_bench_module",
        ],
        loops: [
          {
            title: "Grassy Setup",
            body: "If Rillaboom has established Grassy Terrain and Ceruledge can enter safely, bring Ceruledge in, activate Grassy Seed and use Swords Dance only when the opponent cannot punish the setup.",
          },
          {
            title: "Double Scaler Fork",
            body: "When the opponent commits to stopping Ceruledge, use Gholdengo's free turn to Nasty Plot or attack, then preserve whichever scaler survives for the endgame.",
          },
        ],
        victims: [
          {
            name: "passive balance",
            why: "passive balance",
          },
          {
            name: "single-answer defensive teams",
            why: "single-answer defensive teams",
          },
          {
            name: "physical-only counterplay",
            why: "physical-only counterplay",
          },
        ],
        counters: [
          {
            name: "immediate spread damage",
            why: "immediate spread damage",
          },
          {
            name: "strong setup denial",
            why: "strong setup denial",
          },
          {
            name: "Fire pressure into Ceruledge",
            why: "Fire pressure into Ceruledge",
          },
        ],
        advantages: [
          {
            title: "dual scaling",
            body: "dual scaling",
          },
          {
            title: "Grassy Seed",
            body: "Grassy Seed",
          },
          {
            title: "Tailwind support",
            body: "Tailwind support",
          },
        ],
        hazards: [
          {
            title: "over-setting up",
            body: "over-setting up",
          },
          {
            title: "Fire targeting",
            body: "Fire targeting",
          },
          {
            title: "losing both scalers simultaneously",
            body: "losing both scalers simultaneously",
          },
        ],
        requiresSwap: {
          out: "sylveon",
          in: "ceruledge",
        },
      },
      {
        id: "pack_annihilape_swap",
        label: "Counterplay Module",
        when: "Use when attacking your Pokémon or dropping their stats naturally gives Annihilape value.",
        identity: "Opponent-action scaling network.",
        slugs: [
          "staraptor",
          "rillaboom",
          "gholdengo",
          "annihilape",
        ],
        strategy: {
          opponentPattern: "Teams that must attack or naturally lower stats to function.",
          purpose: "Convert opponent interaction into future offensive value.",
          targets: [
            "Intimidate users",
            "physical attackers",
            "teams with forced targeting",
          ],
          refuses: [
            "passive ignoring of Annihilape",
            "single-target solutions",
          ],
          winCondition: "Make attacking Annihilape increase the cost of every subsequent interaction.",
          gamePlan: "Create counterplay triggers, scale Rage Fist, force targeting decisions, then let Gholdengo convert the uncovered board.",
          mantra: "Their correct interaction is still useful to us.",
          turnChecklist: [
            "What attacks Annihilape?",
            "Can Intimidate activate Defiant?",
            "Is Rage Fist worth preserving?",
            "Which threat is being ignored?",
            "Should Annihilape stay in or reset?",
          ],
          bring: [
            "staraptor",
            "rillaboom",
            "gholdengo",
            "annihilape",
          ],
        },
        roles: [
          {
            slug: "staraptor",
            macro: "control",
            micro: "Intimidate and Tailwind",
          },
          {
            slug: "rillaboom",
            macro: "tempo",
            micro: "Fake Out and terrain",
          },
          {
            slug: "annihilape",
            macro: "reactive scaler",
            micro: "Rage Fist and Defiant",
          },
          {
            slug: "gholdengo",
            macro: "scaler",
            micro: "special conversion",
          },
        ],
        fieldPlan: {
          leadPair: [
            "staraptor",
            "rillaboom",
          ],
          leadWhy: "Intimidate and Fake Out create the exact interaction economy Annihilape wants.",
          backPair: [
            "annihilape",
            "gholdengo",
          ],
          backJobs: [
            {
              slug: "annihilape",
              job: "Accumulate Rage Fist power while converting Intimidate into Defiant value.",
            },
            {
              slug: "gholdengo",
              job: "Provides an independent special threat while opponents are forced to interact with Annihilape.",
            },
          ],
          pairEdges: [
            {
              from: "staraptor",
              to: "annihilape",
              creates: "Intimidate trigger",
              converts: "Defiant boost",
            },
            {
              from: "rillaboom",
              to: "annihilape",
              creates: "Fake Out tempo",
              converts: "Rage Fist positioning",
            },
            {
              from: "annihilape",
              to: "gholdengo",
              creates: "targeting dilemma",
              converts: "free special turns",
            },
          ],
          turn1: "Use Intimidate and Fake Out to make the opponent choose whether to attack the future Rage Fist threat or the special threat.",
          bringInTriggers: [
            "When the opponent has already spent attacks into the board → bring Annihilape to exploit accumulated Rage Fist value.",
            "When Annihilape attracts concentrated pressure → bring Gholdengo into the free lane.",
          ],
        },
        defaultLeadPair: [
          "staraptor",
          "rillaboom",
        ],
        backPair: [
          "annihilape",
          "gholdengo",
        ],
        identityCard: {
          winCondition: "Opponent-action scaling.",
        },
        pilotDecision: {
          chooseWhen: [
            "Opponent has Intimidate.",
            "Opponent must attack Annihilape.",
            "You expect repeated board interaction.",
          ],
          avoidWhen: [
            "Opponent can ignore Annihilape indefinitely.",
            "You need immediate Ground coverage.",
          ],
          previewQuestion: "What opponent action naturally feeds Annihilape?",
          primaryMistake: "Treating Rage Fist as permanent value after switching Annihilape out.",
        },
        engineIds: [
          "engine_tempo_conversion",
          "engine_threat_fork",
        ],
        endgameIds: [
          "endgame_special_fork",
          "endgame_bench_module",
        ],
        loops: [
          {
            title: "Defiant Trigger",
            body: "If Staraptor's Intimidate lowers an opposing physical attacker's Attack and Annihilape is ready to enter, bring Annihilape into the board and convert the drop into immediate offensive pressure.",
          },
          {
            title: "Rage Fist Funnel",
            body: "When the opponent must attack Annihilape, keep it on the field long enough to accumulate Rage Fist value while Gholdengo exploits the target they are not attacking.",
          },
          {
            title: "Reset Decision",
            body: "If Annihilape has accumulated valuable Rage Fist power but would otherwise be removed, Protect or reposition only when preserving the accumulated resource outweighs losing board position.",
          },
        ],
        victims: [
          {
            name: "Intimidate teams",
            why: "Intimidate teams",
          },
          {
            name: "attack-heavy offense",
            why: "attack-heavy offense",
          },
          {
            name: "forced-targeting compositions",
            why: "forced-targeting compositions",
          },
        ],
        counters: [
          {
            name: "ignoring Annihilape",
            why: "ignoring Annihilape",
          },
          {
            name: "special pressure",
            why: "special pressure",
          },
          {
            name: "forcing Annihilape to switch",
            why: "forcing Annihilape to switch",
          },
        ],
        advantages: [
          {
            title: "broad trigger breadth",
            body: "broad trigger breadth",
          },
          {
            title: "Defiant",
            body: "Defiant",
          },
          {
            title: "Rage Fist scaling",
            body: "Rage Fist scaling",
          },
        ],
        hazards: [
          {
            title: "high positional commitment",
            body: "high positional commitment",
          },
          {
            title: "Rage Fist reset on leaving",
            body: "Rage Fist reset on leaving",
          },
          {
            title: "physical damage concentration",
            body: "physical damage concentration",
          },
        ],
        requiresSwap: {
          out: "garchomp",
          in: "annihilape",
        },
      },
    ],
    construction: {
      thesis: "Create board states with Fake Out, terrain, Intimidate and speed control, then convert them through Garchomp, Gholdengo and Sylveon.",
      method: "Use two different Mega packages rather than forcing both Mega candidates into the same four.",
      winCondition: "Create a positional advantage, convert immediately, then force the opponent to answer a second independent threat.",
      endgames: [
        {
          id: "endgame_conversion",
          label: "Immediate Conversion",
          path: "Create tempo → Open a safe attacker → Convert immediately → Trade efficiently → Close with priority or spread damage",
          how: "Rillaboom or Raichu creates the first favorable interaction. Garchomp, Gholdengo or Sylveon immediately converts that opening into damage. The opponent is forced to spend resources answering the active threat. The back Pokémon then enters into the weakened board and closes the game.",
        },
        {
          id: "endgame_tailwind",
          label: "Tailwind Compression",
          path: "Intimidate → Tailwind → Outspeed → Double-pressure → Protect through retaliation → Finish",
          how: "Staraptor reduces physical pressure while establishing Tailwind. Garchomp and Gholdengo use the speed window to attack before the opponent can stabilize. Rillaboom preserves Fake Out and terrain resources for the second wave. Protect and switching then preserve the speed advantage until the opponent runs out of safe positions.",
        },
        {
          id: "endgame_special_fork",
          label: "Special Threat Fork",
          path: "Establish board control → Expose physical threat → Force target selection → Scale Gholdengo → Convert with Sylveon",
          how: "The opponent must decide whether to respect the physical threat or the special threat. Gholdengo uses protected turns to accumulate value while Sylveon supplies immediate spread pressure. Rillaboom and Raichu manipulate targeting through Fake Out and Lightning Rod. The opponent eventually cannot cover every conversion route simultaneously.",
        },
        {
          id: "endgame_bench_module",
          label: "Architecture Swap",
          path: "Identify structural problem → Swap one module → Change clock → Attack the new weakness → Finish",
          how: "The registered six is deliberately not treated as the final architecture. Milotic adds reactive control, Ceruledge adds autonomous physical scaling, and Annihilape adds opponent-action scaling. The swap changes what the opponent must prepare for rather than merely changing one Pokémon. The remaining infrastructure stays intact so the pilot does not have to relearn the entire team.",
        },
      ],
      altSlots: [
        {
          slug: "milotic",
          insteadOf: "garchomp",
          why: "Changes the six from autonomous physical conversion toward reactive special control.",
          answers: "Intimidate; physical attackers; stat-drop strategies",
          costs: "loses Garchomp Ground coverage; less immediate autonomous physical damage",
          unlocks: [
            "pack_milotic_swap",
          ],
          module: {
            identity: "Reactive Control",
          },
          architectureChange: {
            from: "autonomous conversion",
            to: "reactive special control",
          },
          useWhen: [
            "Intimidate is central to the opponent.",
            "Physical pressure is the main problem.",
            "You want a reactive control route.",
          ],
          avoidWhen: [
            "Immediate Ground conversion is critical.",
            "Opponent can simply ignore Competitive.",
          ],
          slot: {
            title: "Milotic",
            job: "breaker",
            role: "Changes the six from autonomous physical conversion toward reactive special control.",
            objective: "Changes the six from autonomous physical conversion toward reactive special control.",
            howToPlay: "Intimidate is central to the opponent.",
            item: "Sitrus Berry",
            ability: "Competitive",
            nature: "Calm",
            moves: [
              {
                name: "Muddy Water",
                why: "Special spread pressure and accuracy disruption.",
              },
              {
                name: "Ice Beam",
                why: "Coverage against Dragon and Ground targets.",
              },
              {
                name: "Coil",
                why: "Provides a scaling route when the opponent cannot immediately punish setup.",
              },
              {
                name: "Protect",
                why: "Preserves Milotic while its reactive value compounds.",
              },
            ],
            training: train(32, 0, 16, 16, 2, 0, {
                "label": "Bulky reactive special",
                "why": "Prioritize survivability and Special Attack while retaining useful Speed.",
                "spend": [
                  "32 HP",
                  "16 Def",
                  "16 SpA",
                  "2 SpD"
                ],
                "rule": "Starting architecture spread; tune against actual Intimidate and special-damage benchmarks."
              }),
          },
        },
        {
          slug: "ceruledge",
          insteadOf: "sylveon",
          why: "Changes immediate Fairy conversion into autonomous physical scaling.",
          answers: "passive teams; physical walls; single-answer defensive plans",
          costs: "loses immediate Fairy spread; more setup-dependent",
          unlocks: [
            "pack_ceruledge_swap",
          ],
          module: {
            identity: "Self-Scaling",
          },
          architectureChange: {
            from: "immediate special conversion",
            to: "self-scaling physical conversion",
          },
          useWhen: [
            "Grassy Terrain creates safe setup.",
            "Opponent has limited answers to physical scaling.",
          ],
          avoidWhen: [
            "Immediate spread damage is required.",
            "Opponent has strong Fire pressure.",
          ],
          slot: {
            title: "Ceruledge",
            job: "breaker",
            role: "Changes immediate Fairy conversion into autonomous physical scaling.",
            objective: "Changes immediate Fairy conversion into autonomous physical scaling.",
            howToPlay: "Grassy Terrain creates safe setup.",
            item: "Grassy Seed",
            ability: "Flash Fire",
            nature: "Adamant",
            moves: [
              {
                name: "Bitter Blade",
                why: "Provides damage while restoring health and extending positional commitment.",
              },
              {
                name: "Shadow Sneak",
                why: "Provides priority for endgame conversion.",
              },
              {
                name: "Swords Dance",
                why: "Creates the physical scaling clock.",
              },
              {
                name: "Protect",
                why: "Protects the setup investment.",
              },
            ],
            training: train(32, 32, 0, 0, 2, 0, {
                "label": "Physical scaler",
                "why": "Prioritize Attack and survivability.",
                "spend": [
                  "32 HP",
                  "32 Atk",
                  "2 SpD"
                ],
                "rule": "Starting architecture spread; optimize Speed only if a specific benchmark matters."
              }),
          },
        },
        {
          slug: "annihilape",
          insteadOf: "garchomp",
          why: "Changes autonomous conversion into opponent-action scaling.",
          answers: "Intimidate; attack-heavy teams; forced targeting",
          costs: "loses immediate Ground coverage; Rage Fist value has high positional commitment",
          unlocks: [
            "pack_annihilape_swap",
          ],
          module: {
            identity: "Counterplay",
          },
          architectureChange: {
            from: "autonomous physical conversion",
            to: "interaction-reactive scaling",
          },
          useWhen: [
            "Opponent must attack.",
            "Opponent uses Intimidate.",
            "You can create repeated interaction.",
          ],
          avoidWhen: [
            "Opponent can ignore Annihilape.",
            "Immediate coverage is more important.",
          ],
          slot: {
            title: "Annihilape",
            job: "breaker",
            role: "Changes autonomous conversion into opponent-action scaling.",
            objective: "Changes autonomous conversion into opponent-action scaling.",
            howToPlay: "Opponent must attack.",
            item: "Leftovers",
            ability: "Defiant",
            nature: "Adamant",
            moves: [
              {
                name: "Rage Fist",
                why: "Turns repeated incoming attacks into a scaling damage resource.",
              },
              {
                name: "Drain Punch",
                why: "Provides sustain and Fighting conversion.",
              },
              {
                name: "Protect",
                why: "Preserves accumulated Rage Fist value while forcing targeting decisions.",
              },
              {
                name: "Bulk Up",
                why: "Creates a self-scaling route when the opponent refuses to attack.",
              },
            ],
            training: train(32, 32, 0, 0, 2, 0, {
                "label": "Durable interaction scaler",
                "why": "Prioritize HP and Attack for positional commitment.",
                "spend": [
                  "32 HP",
                  "32 Atk",
                  "2 SpD"
                ],
                "rule": "Starting architecture spread; Speed can be tuned after observing common opposing speed control."
              }),
          },
        },
      ],
    },
    megaPool: {
      rule: "Never use Raichu and Staraptor in the same bring-four. They both occupy a Mega Stone slot; select the Mega according to the package.",
      previewPressure: "Opponent must respect Raichu Y special pressure or Staraptor Tailwind — pick the Mega with the package, not habit.",
      candidates: [
        {
          slug: "raichu",
          stone: "Raichunite Y",
          when: "fast special Mega",
        },
        {
          slug: "staraptor",
          stone: "Staraptite",
          when: "Tailwind physical-control Mega",
        },
      ],
    },
    controlPlanes: [
      {
        id: "tempo",
        label: "Tempo",
        setterSlug: "rillaboom",
        effect: "Control which side gets the next meaningful action.",
        whoBenefits: "Garchomp, Gholdengo, Sylveon",
      },
      {
        id: "speed",
        label: "Speed",
        setterSlug: "staraptor",
        effect: "Change which conversion clock gets to act first.",
        whoBenefits: "Garchomp, Gholdengo",
      },
      {
        id: "targeting",
        label: "Targeting",
        setterSlug: "raichu",
        effect: "Make the opponent's target selection create opportunities elsewhere.",
        whoBenefits: "Gholdengo, Sylveon, partners",
      },
      {
        id: "resource",
        label: "Resources",
        setterSlug: "rillaboom",
        effect: "Preserve endgame resources instead of spending everything early.",
        whoBenefits: "Endgame priority and Protect lines",
      },
    ],
    network: {
      thesis: "The six does not rely on one core; it generates different four-Pokémon systems around the same tempo infrastructure.",
      edges: [
        {
          from: "rillaboom",
          to: "garchomp",
          creates: "Fake Out positioning",
          converts: "Ground pressure",
        },
        {
          from: "rillaboom",
          to: "gholdengo",
          creates: "safe setup turns",
          converts: "Nasty Plot",
        },
        {
          from: "raichu",
          to: "gholdengo",
          creates: "Fake Out tempo",
          converts: "Make It Rain",
          engineId: "engine_tempo_conversion",
        },
        {
          from: "staraptor",
          to: "garchomp",
          creates: "Tailwind speed",
          converts: "Earthquake pressure",
          engineId: "engine_tailwind",
        },
        {
          from: "staraptor",
          to: "gholdengo",
          creates: "Tailwind speed",
          converts: "special scaling",
          engineId: "engine_tailwind",
        },
        {
          from: "rillaboom",
          to: "sylveon",
          creates: "Fake Out window",
          converts: "Hyper Voice",
        },
        {
          from: "raichu",
          to: "sylveon",
          creates: "targeting disruption",
          converts: "Fairy spread",
        },
        {
          from: "garchomp",
          to: "gholdengo",
          creates: "physical targeting pressure",
          converts: "special free turns",
          engineId: "engine_threat_fork",
        },
      ],
    },
    engines: [
      {
        id: "engine_tempo_conversion",
        label: "Fake Out Conversion",
        path: [
          "Lead Raichu or Rillaboom",
          "Fake Out the key opposing piece",
          "Partner takes the created window",
          "Convert into damage or setup",
          "Force the opponent to answer the new board",
          "Bring the back converter into the weakened position",
        ],
        how: "Raichu and Rillaboom provide redundant Fake Out infrastructure. The first Fake Out is not the win condition; it is a resource that creates a safe conversion window. Garchomp, Gholdengo or Sylveon spends that window immediately. Once the opponent answers, the back pair enters against a board that has already been altered.",
        dependsOn: "A safe first-turn Fake Out target and a partner capable of converting the turn.",
        disrupt: "Protect, Fake Out immunity, Psychic Terrain, priority denial and speed control.",
        fallback: "Use the Fake Out user as the switch/pivot while preserving the converter for the second wave.",
      },
      {
        id: "engine_tailwind",
        label: "Tailwind Compression",
        path: [
          "Lead Staraptor",
          "Apply Intimidate",
          "Establish Tailwind",
          "Bring Garchomp or Gholdengo forward",
          "Attack before the opponent stabilizes",
          "Protect through retaliation",
        ],
        how: "Staraptor changes both the defensive and speed state of the board. Tailwind then allows Garchomp or Gholdengo to convert before the opponent can recover positioning. Staraptor does not need to attack immediately because its value is already being converted by its partner. The endgame becomes a sequence of protected attacks rather than a race to establish another speed-control effect.",
        dependsOn: "Staraptor surviving long enough to establish Tailwind.",
        disrupt: "Opposing speed control, priority, Taunt, Protect cycles and strong special attacks.",
        fallback: "Use Intimidate and Protect to preserve Staraptor while Rillaboom establishes a Fake Out-based second wave.",
      },
      {
        id: "engine_threat_fork",
        label: "Physical-Special Fork",
        path: [
          "Expose Garchomp or Sylveon",
          "Force target selection",
          "Protect or reposition the threatened side",
          "Activate Gholdengo",
          "Convert the uncovered target",
          "Close with priority",
        ],
        how: "The team presents physical and special threats simultaneously. Garchomp forces Ground/Dragon/Rock answers while Gholdengo and Sylveon punish teams that overcommit to physical defense. The opponent's first defensive decision determines which threat receives the next free turn. Rillaboom and Raichu amplify this fork through Fake Out and targeting manipulation.",
        dependsOn: "At least two live damage threats.",
        disrupt: "Very strong wide-area pressure, dedicated speed control or defensive positioning that answers both axes.",
        fallback: "Shift from threat fork into direct Sylveon spread pressure or Garchomp endgame conversion.",
      },
      {
        id: "engine_priority_endgame",
        label: "Priority Close",
        path: [
          "Preserve Rillaboom",
          "Chip opposing threats",
          "Use Protect to force inefficient attacks",
          "Grassy Glide or Quick Attack",
          "Trade the final vulnerable target",
        ],
        how: "The team deliberately preserves its priority users instead of spending them for early damage. Once opposing attackers are chipped, Grassy Glide and Sylveon's Quick Attack become conversion tools. Protect forces the opponent to reveal which piece must attack. The endgame is therefore not dependent on winning a final speed check.",
        dependsOn: "Rillaboom or Sylveon surviving into the endgame.",
        disrupt: "Priority denial, Psychic Terrain and healthy resistant targets.",
        fallback: "Use Tailwind or natural Speed from the surviving offensive piece.",
      },
    ],
    commandments: [
      "Do not bring Raichu and Staraptor together.",
      "Do not spend Fake Out merely for damage when it can create a conversion turn.",
      "Garchomp is the immediate converter; do not force it into a setup role.",
      "Protect the second wave more than the first wave.",
      "If the opponent answers one clock, activate another.",
    ],
    phases: [
      {
        id: "preview",
        title: "Preview — Pick the package",
        lede: "Select four Pokémon and a Mega mode.",
        branches: [
          {
            when: "Need Fake Out plus special fork?",
            then: "Raichu Conversion or Garchomp + Sylveon when Megas are preserved.",
          },
          {
            when: "Need Tailwind compression?",
            then: "Staraptor Tailwind with Garchomp forward.",
          },
          {
            when: "Structural problem visible?",
            then: "Consider Milotic, Ceruledge, or Annihilape swap packages.",
          },
        ],
      },
      {
        id: "opening",
        title: "Opening — Spend tempo",
        branches: [
          {
            when: "Fake Out or Tailwind is live",
            then: "Convert the window — do not autopilot damage without a converter ready.",
          },
        ],
      },
      {
        id: "finish",
        title: "Finish — Second clock",
        branches: [
          {
            when: "First converter is answered",
            then: "Activate Gholdengo, Sylveon, or priority before complexity returns.",
          },
        ],
      },
    ],
    loops: [
      {
        title: "Tempo → convert",
        body: "Fake Out or Tailwind creates a window; Garchomp, Sylveon, or Gholdengo spends it.",
      },
      {
        title: "Fork → finish",
        body: "Physical-special fork forces target selection; the uncovered axis closes.",
      },
    ],
    hazards: [
      {
        title: "Bringing Raichu and Staraptor together",
        body: "Bringing Raichu and Staraptor together",
      },
      {
        title: "Fake Out without conversion",
        body: "Fake Out without conversion",
      },
      {
        title: "Forcing Garchomp setup",
        body: "Forcing Garchomp setup",
      },
    ],
    victims: [],
    counters: [],
    advantages: [],
    matchupScripts: [
      {
        id: "rain",
        foe: "Politoed/Pelipper plus Archaludon or Basculegion",
        why: "Preserve Raichu's Electric pressure and use Rillaboom to disrupt rain positioning.",
        packId: "pack_raichu_conversion",
        sequence: {
          beats: [
            {
              click: "Preserve Raichu's Electric pressure and use Rillaboom to disrupt rain positioning.",
            },
            {
              click: "Avoid giving Archaludon free turns.",
            },
            {
              click: "Gholdengo or Sylveon becomes the second conversion axis.",
            },
          ],
        },
      },
      {
        id: "sand",
        foe: "Tyranitar plus Excadrill",
        why: "Use Garchomp to contest Ground positioning and Rillaboom to control Tyranitar.",
        packId: "pack_garchomp_fairy",
        sequence: {
          beats: [
            {
              click: "Use Garchomp to contest Ground positioning and Rillaboom to control Tyranitar.",
            },
            {
              click: "Sylveon provides immediate pressure into the Dark/Fighting side of the board.",
            },
          ],
        },
      },
      {
        id: "sun",
        foe: "Charizard-Y plus Fire/Grass offense",
        why: "Use Tailwind and Garchomp's Rock/Ground coverage while preserving Rillaboom for terrain control.",
        packId: "pack_staraptor_tailwind",
        sequence: {
          beats: [
            {
              click: "Use Tailwind and Garchomp's Rock/Ground coverage while preserving Rillaboom for terrain control.",
            },
            {
              click: "Do not allow the opponent to dictate the speed regime.",
            },
          ],
        },
      },
      {
        id: "psyspam",
        foe: "Indeedee-F plus Expanding Force attackers",
        why: "Avoid relying on Fake Out as the sole control mechanism.",
        packId: "pack_staraptor_tailwind",
        sequence: {
          beats: [
            {
              click: "Avoid relying on Fake Out as the sole control mechanism.",
            },
            {
              click: "Use Tailwind and immediate physical pressure to attack the board before Psychic Terrain becomes the entire game.",
            },
          ],
        },
      },
      {
        id: "trick_room",
        foe: "Indeedee/Farigiraf plus slow attackers",
        why: "Prioritize immediate conversion and avoid unnecessary Tailwind investment.",
        packId: "pack_garchomp_fairy",
        sequence: {
          beats: [
            {
              click: "Prioritize immediate conversion and avoid unnecessary Tailwind investment.",
            },
            {
              click: "Preserve Protect and pressure the setter before the room becomes the opponent's clock.",
            },
          ],
        },
      },
      {
        id: "rillaboom_sneasler",
        foe: "Rillaboom plus Sneasler",
        why: "Use dual Fake Out to disrupt the opening and force Sneasler to reveal its intended target.",
        packId: "pack_raichu_conversion",
        sequence: {
          beats: [
            {
              click: "Use dual Fake Out to disrupt the opening and force Sneasler to reveal its intended target.",
            },
            {
              click: "Gholdengo and Sylveon provide two different ways to punish the resulting positioning.",
            },
          ],
        },
      },
      {
        id: "kingambit",
        foe: "Kingambit balance",
        why: "Preserve Garchomp's Ground pressure and avoid relying exclusively on Intimidate.",
        packId: "pack_garchomp_fairy",
        sequence: {
          beats: [
            {
              click: "Preserve Garchomp's Ground pressure and avoid relying exclusively on Intimidate.",
            },
            {
              click: "Sylveon provides a separate special route while Rillaboom supplies priority.",
            },
          ],
        },
      },
      {
        id: "screens_balance",
        foe: "Screens or defensive balance",
        why: "Swap Sylveon for Ceruledge when the opponent can repeatedly blunt immediate damage.",
        packId: "pack_ceruledge_swap",
        sequence: {
          beats: [
            {
              click: "Swap Sylveon for Ceruledge when the opponent can repeatedly blunt immediate damage.",
            },
            {
              click: "Force them to answer two scaling clocks instead of one.",
            },
          ],
        },
      },
    ],
  } satisfies TeamManual;
