import { train } from "@/content/manual-train";
import type { TeamManual } from "@/content/manuals";

export const R2_MIXED_AUTONOMOUS_SAND_MANUAL = {
    id: "r2-mixed-autonomous-sand-manual",
    title: "R2 — Mixed Autonomous Sand",
    lede: "Sand is one route, not the operating system: Excadrill speed, Salamence Tailwind, Gholdengo scaling, Rillaboom tempo, and Coil Milotic all win differently.",
    format: "doubles",
    philosophy: "Create several autonomous clocks whose failure conditions overlap as little as possible. Sand supplies explosive conversion, but the six can abandon Sand entirely and still function through Gholdengo, Salamence, Rillaboom, and Coil Milotic.",
    archetype: "balance",
    family: "weather",
    meta: "Regulation M-C",
    setsNote: "Starting architecture spend (66 SP, max 32). Recommended configuration — not claimed as mathematically optimal vs every M-C threshold.",
    pilot: {
      thesis: "Use Sand when it is cheap; otherwise let one of the autonomous converters become the game.",
      rule: "Pick the package whose clock the opponent cannot answer first.",
      fail: "Forcing one engine after the opponent has already closed that route.",
    },
    box: [
      "tyranitar",
      "excadrill",
      "salamence",
      "rillaboom",
      "gholdengo",
      "milotic",
    ],
    core: [
      "tyranitar",
      "excadrill",
      "salamence",
    ],
    slugs: [
      "tyranitar",
      "excadrill",
      "salamence",
    ],
    slots: [],
    roster: [
      {
        slug: "tyranitar",
        title: "Tyranitar",
        job: "weather",
        literacy: "setter",
        primaryJob: "Create Sand without becoming a passive weather slot.",
        role: "Sand engine and independent physical pressure.",
        item: "Tyranitarite",
        ability: "Sand Stream",
        nature: "Jolly",
        moves: [
          {
            name: "Rock Slide",
            why: "Primary spread pressure once Sand or Tailwind creates the speed edge.",
          },
          {
            name: "Knock Off",
            why: "Single-target Dark pressure that also strips opposing resources.",
          },
          {
            name: "Low Kick",
            why: "Targets heavy Steel, Rock, and opposing Tyranitar-style threats without relying on spread damage.",
          },
          {
            name: "Protect",
            why: "Preserves the weather engine while partners convert Sand or reposition.",
          },
        ],
        objective: "Set Sand when Excadrill can immediately cash it in; otherwise preserve Tyranitar as a durable attacker.",
        howToPlay: "Do not Mega evolve automatically. Keep Mega Salamence available when Intimidate, Tailwind, or special pressure matters more.",
        training: train(2, 32, 0, 0, 0, 32, {
            "label": "Jolly max Attack / Speed",
            "why": "Recommended starting spread for immediate Sand pressure; verify exact speed and bulk benchmarks on device.",
            "spend": [
              "2 HP",
              "32 Atk",
              "32 Spe"
            ],
            "rule": "66 SP max 32 per stat; recommended starting spread, not claimed optimal."
          }),
        networkJobs: {
          creates: "Sand",
          converts: "Rock Slide pressure; Knock Off progress",
          protects: "Excadrill speed mode",
          scales: "Mega bulk and pressure",
        },
        abilityStages: {
          before: "Entry: Sand Stream creates the speed resource.",
          after: "Mega decision: only spend the Mega resource when Tyranitar itself needs the upgrade.",
          when: "Mega decision: only spend the Mega resource when Tyranitar itself needs the upgrade.",
        },
        ampTargets: [
          {
            slug: "excadrill",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "Tyranitarite creates Mega flexibility with Salamence; one stone will be inactive each battle, so preview must justify which Mega matters.",
            },
          ],
        },
      },
      {
        slug: "excadrill",
        title: "Excadrill",
        job: "breaker",
        literacy: "sweeper",
        primaryJob: "Turn one weather activation into immediate positional and damage pressure.",
        role: "Immediate Sand Rush converter.",
        item: "Focus Sash",
        ability: "Sand Rush",
        nature: "Jolly",
        moves: [
          {
            name: "Rock Slide",
            why: "Fast spread conversion after Sand activates.",
          },
          {
            name: "High Horsepower",
            why: "Reliable single-target Ground pressure that avoids hitting the partner.",
          },
          {
            name: "Iron Head",
            why: "Steel conversion into Fairy and Ice targets.",
          },
          {
            name: "Protect",
            why: "Keeps Focus Sash and Sand turns usable while the partner controls the board.",
          },
        ],
        objective: "Take immediate KOs or force defensive actions during Sand turns.",
        howToPlay: "Treat Excadrill as a converter, not an engine. If Sand is awkward, bench it and use the other clocks.",
        training: train(2, 32, 0, 0, 0, 32, {
            "label": "Jolly max Attack / Speed",
            "why": "Recommended starting spread for the team's fastest Sand conversion role.",
            "spend": [
              "2 HP",
              "32 Atk",
              "32 Spe"
            ],
            "rule": "66 SP max 32 per stat; recommended starting spread, not claimed optimal."
          }),
        networkJobs: {
          creates: "Fast spread threat",
          converts: "Sand; Tailwind",
          protects: "Partner by forcing Protects",
        },
        itemLoop: {
          beats: [
            {
              click: "Focus Sash keeps one conversion turn available even when the board is hostile.",
            },
          ],
        },
      },
      {
        slug: "salamence",
        title: "Salamence",
        job: "speed",
        literacy: "pivot",
        primaryJob: "Create an independent speed regime when Sand is unavailable or unnecessary.",
        role: "Universal bridge: Intimidate, Tailwind, special damage, and alternate Mega.",
        item: "Salamencite",
        ability: "Intimidate",
        nature: "Timid",
        moves: [
          {
            name: "Hyper Voice",
            why: "Repeatable spread pressure that does not depend on Sand.",
          },
          {
            name: "Draco Meteor",
            why: "Immediate single-target burst when a key target must disappear.",
          },
          {
            name: "Tailwind",
            why: "Creates the team's second major speed state.",
          },
          {
            name: "Protect",
            why: "Preserves Intimidate and Mega timing while partners reposition.",
          },
        ],
        objective: "Bridge Sand, Gholdengo, Milotic, and Rillaboom packages without forcing any of them to depend on Salamence.",
        howToPlay: "Use Intimidate before thinking about Mega evolution. Tailwind is valuable when it creates multiple conversions, not merely because it is available.",
        training: train(2, 0, 0, 32, 0, 32, {
            "label": "Timid max SpA / Speed",
            "why": "Recommended starting spread for immediate special pressure and Tailwind access.",
            "spend": [
              "2 HP",
              "32 SpA",
              "32 Spe"
            ],
            "rule": "66 SP max 32 per stat; recommended starting spread, not claimed optimal."
          }),
        networkJobs: {
          creates: "Intimidate turns; Tailwind",
          converts: "Hyper Voice; Draco Meteor",
          protects: "Milotic Coil turn; Gholdengo setup turn",
        },
        abilityStages: {
          before: "Pre-Mega: Intimidate manufactures defensive time.",
          after: "Mega: convert the preserved slot into stronger direct special pressure.",
          when: "Mega: convert the preserved slot into stronger direct special pressure.",
        },
        ampTargets: [
          {
            slug: "milotic",
            becomes: "Amp target",
          },
          {
            slug: "gholdengo",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "Dual-Mega flexibility with Tyranitar creates preview value but one Mega stone is inactive each battle.",
            },
          ],
        },
      },
      {
        slug: "rillaboom",
        title: "Rillaboom",
        job: "support",
        literacy: "pivot",
        primaryJob: "Manufacture safe turns without becoming passive.",
        role: "Tempo engine, terrain resource, priority cleaner, and independent physical converter.",
        item: "Miracle Seed",
        ability: "Grassy Surge",
        nature: "Adamant",
        moves: [
          {
            name: "Wood Hammer",
            why: "Immediate Grass conversion when priority damage is insufficient.",
          },
          {
            name: "Grassy Glide",
            why: "Turns terrain into priority cleanup.",
          },
          {
            name: "High Horsepower",
            why: "Adds single-target Ground coverage without disturbing the partner.",
          },
          {
            name: "Fake Out",
            why: "Manufactures the first Coil, Nasty Plot, Tailwind, or clean attack turn.",
          },
        ],
        objective: "Create one safe conversion turn, then remain a real damage threat.",
        howToPlay: "Do not spend Fake Out automatically. Ask which partner turns that one denied action into the largest future advantage.",
        training: train(20, 32, 0, 0, 0, 14, {
            "label": "Adamant Attack with mixed bulk/speed utility",
            "why": "Recommended starting spread: maximize physical conversion while retaining extra HP and some speed investment.",
            "spend": [
              "20 HP",
              "32 Atk",
              "14 Spe"
            ],
            "rule": "66 SP max 32 per stat; recommended starting spread, not claimed optimal."
          }),
        networkJobs: {
          creates: "Grassy Terrain; Fake Out free turn",
          converts: "Grassy Glide; Wood Hammer",
          protects: "Milotic; Gholdengo",
        },
        ampTargets: [
          {
            slug: "milotic",
            becomes: "Amp target",
          },
          {
            slug: "gholdengo",
            becomes: "Amp target",
          },
          {
            slug: "salamence",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "Miracle Seed turns the infrastructure Pokémon into a legitimate attacker.",
            },
          ],
        },
      },
      {
        slug: "gholdengo",
        title: "Gholdengo",
        job: "breaker",
        literacy: "sweeper",
        primaryJob: "Convert any free turn supplied by the rest of the six into special pressure.",
        role: "Portable autonomous special win condition.",
        item: "Life Orb",
        ability: "Good as Gold",
        nature: "Modest",
        moves: [
          {
            name: "Shadow Ball",
            why: "Single-target special conversion when spread damage is undesirable.",
          },
          {
            name: "Make It Rain",
            why: "Primary spread payoff after a free turn or speed advantage.",
          },
          {
            name: "Nasty Plot",
            why: "Turns one protected tempo window into an independent win clock.",
          },
          {
            name: "Protect",
            why: "Preserves Life Orb pressure while partners cycle weather, terrain, or Intimidate.",
          },
        ],
        objective: "Punish opponents who overprepare for the physical Sand half.",
        howToPlay: "Do not force Nasty Plot. Immediate Make It Rain is correct when the board already gives enough conversion.",
        training: train(20, 0, 0, 32, 0, 14, {
            "label": "Modest max SpA with HP / Speed split",
            "why": "Recommended starting spread for strong immediate conversion with some retained bulk; verify desired speed tier on device.",
            "spend": [
              "20 HP",
              "32 SpA",
              "14 Spe"
            ],
            "rule": "66 SP max 32 per stat; recommended starting spread, not claimed optimal."
          }),
        networkJobs: {
          creates: "Special setup threat",
          converts: "Fake Out turns; Tailwind",
          protects: "Team from status-oriented disruption via Good as Gold",
          scales: "Nasty Plot",
        },
        itemLoop: {
          beats: [
            {
              click: "Life Orb prioritizes conversion speed over long-term preservation.",
            },
          ],
        },
      },
      {
        slug: "milotic",
        title: "Milotic",
        job: "support",
        literacy: "disruptor",
        primaryJob: "Punish stat suppression while retaining an autonomous Coil/Hypnosis route.",
        role: "Adaptive control scaler and failure inverter.",
        item: "Leftovers",
        ability: "Competitive",
        nature: "Calm",
        moves: [
          {
            name: "Coil",
            why: "Creates Defense and accuracy resources so Hypnosis and Muddy Water become increasingly reliable.",
          },
          {
            name: "Hypnosis",
            why: "Converts Coil accuracy into action denial and extra setup turns.",
          },
          {
            name: "Muddy Water",
            why: "Spread conversion that can also degrade opposing accuracy.",
          },
          {
            name: "Protect",
            why: "Preserves boosts, Leftovers turns, and partner positioning.",
          },
        ],
        objective: "Become productive whether the opponent triggers Competitive or refuses to.",
        howToPlay: "First ask whether the team can manufacture one safe Coil. Hypnosis is the payoff, not the opening assumption.",
        training: train(32, 0, 14, 0, 20, 0, {
            "label": "Calm bulky Coil control",
            "why": "Recommended starting spread for repeated Coil, Hypnosis, and Leftovers turns; not a sourced damage benchmark.",
            "spend": [
              "32 HP",
              "14 Def",
              "20 SpD"
            ],
            "rule": "66 SP max 32 per stat; recommended starting spread, not claimed optimal."
          }),
        networkJobs: {
          creates: "Sleep pressure; Accuracy control",
          converts: "Competitive boosts; Coil turns",
          protects: "Long-game board state",
          scales: "Coil",
        },
        itemLoop: {
          beats: [
            {
              click: "Leftovers plus Grassy Terrain can turn every protected or denied action into additional staying power.",
            },
          ],
        },
      },
    ],
    packs: [
      {
        id: "r2-sand-pressure",
        label: "Sand Pressure",
        when: "Bring this when Tyranitar can establish Sand cheaply and Excadrill threatens immediate meaningful damage.",
        identity: "Immediate Sand conversion with two speed-independent backline answers.",
        slugs: [
          "tyranitar",
          "excadrill",
          "salamence",
          "milotic",
        ],
        strategy: {
          opponentPattern: "Boards where immediate speed and damage matter but a bulky fallback is needed.",
          bring: [
            "tyranitar",
            "excadrill",
            "salamence",
            "milotic",
          ],
          purpose: "Force immediate Sand respect without becoming dependent on Sand.",
          targets: [
            "Teams with limited weather overwrite",
            "Physical-control teams that may trigger Competitive",
          ],
          refuses: [
            "A weather war that consumes every turn",
            "Automatic Mega Tyranitar",
          ],
          winCondition: "Convert Sand early, then preserve Salamence or Milotic as the second clock.",
          gamePlan: "Break with Sand → bridge with Salamence → control or finish with Milotic/Excadrill.",
          mantra: "Take the cheap Sand advantage; do not marry it.",
          turnChecklist: [
            "Is Sand safe?",
            "Can Excadrill take real progress now?",
            "Does Salamence need to preserve Intimidate?",
            "Can Milotic safely Coil?",
          ],
        },
        roles: [
          {
            slug: "tyranitar",
            macro: "Weather engine",
            micro: "Set Sand and force immediate Rock/Dark respect.",
          },
          {
            slug: "excadrill",
            macro: "Immediate converter",
            micro: "Spend Sand turns on the highest-value damage.",
          },
          {
            slug: "salamence",
            macro: "Bridge",
            micro: "Intimidate or Tailwind when Sand no longer solves the board.",
          },
          {
            slug: "milotic",
            macro: "Control scaler",
            micro: "Exploit the stabilized board with Coil or immediate Muddy Water.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "tyranitar",
            "excadrill",
          ],
          leadWhy: "This is the highest-velocity conversion pair when weather is favorable.",
          backPair: [
            "salamence",
            "milotic",
          ],
          backJobs: [
            {
              slug: "salamence",
              job: "Reset physical pressure and provide Tailwind when Sand expires.",
            },
            {
              slug: "milotic",
              job: "Punish stat control and become the slow-board win condition.",
            },
          ],
          pairEdges: [
            {
              from: "tyranitar",
              to: "excadrill",
              creates: "Sand",
              converts: "Sand Rush pressure",
            },
            {
              from: "salamence",
              to: "milotic",
              creates: "Intimidate breathing room",
              converts: "Safer Coil",
            },
          ],
          turn1: "Set Sand naturally; attack with Excadrill only if the exchange is actually favorable rather than automatic.",
          bringInTriggers: [
            "Sand expires or physical pressure rises → bring Salamence.",
            "Opponent begins stat-control or the board slows → bring Milotic.",
          ],
        },
        defaultLeadPair: [
          "tyranitar",
          "excadrill",
        ],
        backPair: [
          "salamence",
          "milotic",
        ],
        identityCard: {
          engine: [
            "tyranitar",
            "salamence",
          ],
          connector: [
            "salamence",
          ],
          converter: [
            "excadrill",
          ],
          scaler: [
            "milotic",
          ],
          control: [
            "salamence",
            "milotic",
          ],
          winCondition: "Take early Sand progress, then close with whichever of Excadrill or Milotic remains structurally favored.",
          clock: "Immediate into scaling",
          commitment: "Medium",
          autonomy: "High",
          triggerBreadth: "Sand, Intimidate, Tailwind, Coil, or Competitive can each create progress.",
        },
        pilotDecision: {
          chooseWhen: [
            "Weather control is favorable.",
            "Excadrill has several clean targets.",
            "The opponent's physical control could feed Milotic.",
          ],
          avoidWhen: [
            "Opponent can overwrite weather repeatedly with little cost.",
            "Spread denial plus strong Excadrill answers make Sand inefficient.",
          ],
          previewQuestion: "If Sand disappears after turn one, do Salamence and Milotic still give me a winning four?",
          primaryMistake: "Spending every turn trying to restore Sand after the matchup has already shifted.",
        },
        engineIds: [
          "sand-rush",
          "tailwind-bridge",
          "coil-control",
        ],
        winRouteIds: [
          "sand-rush",
          "coil-control",
        ],
        endgameIds: [
          "sand-clean",
          "milotic-lock",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "sand-open",
                when: "Weather is safe and Excadrill has pressure",
                then: "Commit to the first Sand conversion.",
              },
              {
                id: "weather-contested",
                when: "Opponent can cheaply overwrite Sand",
                then: "Protect resources and pivot toward Salamence/Milotic.",
              },
            ],
          },
        ],
        loops: [
          {
            id: "r2-sand-hit",
            type: "conversion",
            title: "Take the Sand Turn",
            body: "When Sand gives Excadrill a clean damage window, Tyranitar protects or pressures while Excadrill takes the highest-value attack. Do not spend the turn setting extra infrastructure. End with the opponent forced defensive and your backline still hidden.",
          },
          {
            id: "r2-milo-second-wave",
            type: "scaling",
            title: "Milotic Second Wave",
            body: "When the opponent stabilizes against Sand, bring Milotic into the lower-pressure board. Coil if Salamence or prior damage has bought the turn, then threaten Hypnosis while Excadrill or Tyranitar finishes damaged targets. End with Milotic controlling actions instead of contesting speed.",
          },
        ],
        victims: [
          {
            name: "Single-speed offensive boards",
            why: "Sand Rush creates an immediate speed regime while Milotic supplies a different second clock.",
            play: "Take early Sand progress, then stop racing once Milotic becomes better.",
            trap: "Do not assume speed advantage alone wins.",
          },
        ],
        counters: [
          {
            name: "Repeated weather overwrite plus Excadrill control",
            why: "It can reduce the value of the opening pair simultaneously.",
            play: "Abandon the weather fight and pivot into Salamence/Milotic.",
            trap: "Repeatedly switching Tyranitar solely to restore Sand.",
          },
        ],
        advantages: [
          {
            title: "Low route correlation",
            body: "Weather denial hurts Excadrill but does not remove Tailwind or Coil Milotic.",
          },
        ],
        hazards: [
          {
            title: "Mega autopilot",
            body: "Do not spend the unique Mega resource before deciding whether Tyranitar or Salamence matters more.",
          },
        ],
      },
      {
        id: "r2-grassy-special",
        label: "Grassy Special",
        when: "Bring this when the opponent's plan is strongest into Tyranitar/Excadrill and weaker into special scaling plus terrain tempo.",
        identity: "No-Sand pressure built around Fake Out, Gholdengo, Tailwind, and Coil.",
        slugs: [
          "rillaboom",
          "gholdengo",
          "salamence",
          "milotic",
        ],
        strategy: {
          opponentPattern: "Anti-Sand previews or bulky balance.",
          bring: [
            "rillaboom",
            "gholdengo",
            "salamence",
            "milotic",
          ],
          purpose: "Play an entirely functional game without Tyranitar or Excadrill.",
          targets: [
            "Anti-Sand structures",
            "Intimidate-heavy balance",
          ],
          refuses: [
            "Weather dependency",
            "Double setup greed",
          ],
          winCondition: "Establish one scaler while Salamence and Rillaboom keep the board favorable.",
          gamePlan: "Create turn → scale once → preserve converter → close with special/control pressure.",
          mantra: "One free turn is enough.",
          turnChecklist: [
            "Can Fake Out buy Nasty Plot?",
            "Would Coil be safer?",
            "Does Tailwind matter?",
            "Which scaler should remain hidden?",
          ],
        },
        roles: [
          {
            slug: "rillaboom",
            macro: "Tempo engine",
            micro: "Create one free turn or simply convert with Grass damage.",
          },
          {
            slug: "gholdengo",
            macro: "Primary converter",
            micro: "Choose immediate Make It Rain or Nasty Plot.",
          },
          {
            slug: "salamence",
            macro: "Speed and defensive bridge",
            micro: "Enter when physical pressure or speed becomes the relevant axis.",
          },
          {
            slug: "milotic",
            macro: "Second scaler",
            micro: "Take over once the opponent spends resources on Gholdengo.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "rillaboom",
            "gholdengo",
          ],
          leadWhy: "Fake Out creates the cleanest first conversion window for Gholdengo.",
          backPair: [
            "salamence",
            "milotic",
          ],
          backJobs: [
            {
              slug: "salamence",
              job: "Enter on physical pressure and create Tailwind if the board needs speed.",
            },
            {
              slug: "milotic",
              job: "Become the second long-game clock after Gholdengo draws attention.",
            },
          ],
          pairEdges: [
            {
              from: "rillaboom",
              to: "gholdengo",
              creates: "Fake Out free turn",
              converts: "Nasty Plot",
            },
            {
              from: "salamence",
              to: "milotic",
              creates: "Reduced physical pressure",
              converts: "Safer Coil",
            },
          ],
          turn1: "Fake Out only if it produces a meaningful Gholdengo conversion; otherwise attack immediately.",
          bringInTriggers: [
            "Physical attacker threatens the lead → Salamence.",
            "Opponent spends resources containing Gholdengo → Milotic.",
          ],
        },
        defaultLeadPair: [
          "rillaboom",
          "gholdengo",
        ],
        backPair: [
          "salamence",
          "milotic",
        ],
        identityCard: {
          engine: [
            "rillaboom",
            "salamence",
          ],
          connector: [
            "salamence",
            "rillaboom",
          ],
          converter: [
            "gholdengo",
          ],
          scaler: [
            "gholdengo",
            "milotic",
          ],
          control: [
            "rillaboom",
            "milotic",
          ],
          winCondition: "Use one free turn to establish Gholdengo or Milotic, then attack from the axis the opponent did not prepare for.",
          clock: "Tempo into scaling",
          commitment: "Low to medium",
          autonomy: "Very high",
          triggerBreadth: "Fake Out, Intimidate, Tailwind, Coil, Competitive, or raw damage.",
        },
        pilotDecision: {
          chooseWhen: [
            "Sand is awkward.",
            "The opponent overindexes on Ground/Rock counterplay.",
            "Fake Out can create a high-value setup turn.",
          ],
          avoidWhen: [
            "Rillaboom has no safe entry and Gholdengo is immediately pressured from both slots.",
          ],
          previewQuestion: "Which scaler gets the first free turn: Gholdengo or Milotic?",
          primaryMistake: "Trying to set up both scalers instead of letting one create space for the other.",
        },
        engineIds: [
          "gold-conversion",
          "coil-control",
          "tailwind-bridge",
        ],
        winRouteIds: [
          "gold-conversion",
          "coil-control",
        ],
        endgameIds: [
          "gold-endgame",
          "milotic-lock",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "setup-free",
                when: "One slot is Fake Out-vulnerable and the other cannot punish Gholdengo",
                then: "Use Nasty Plot.",
              },
              {
                id: "setup-not-free",
                when: "Opponent can immediately pressure Gholdengo",
                then: "Attack or Protect and preserve the second-wave scalers.",
              },
            ],
          },
        ],
        loops: [
          {
            id: "r2-fake-gold",
            type: "conversion",
            title: "Fake Out to Gold",
            body: "When one opposing slot can be denied safely, Rillaboom uses Fake Out and Gholdengo chooses Nasty Plot only if the second slot cannot punish it. On the next turn convert with Make It Rain or Shadow Ball rather than stacking setup. End with Gholdengo ahead and Rillaboom still threatening priority.",
          },
          {
            id: "r2-mence-milo",
            type: "resource",
            title: "Intimidate into Coil",
            body: "When the opponent pivots toward physical pressure, bring Salamence to reduce damage and expose Milotic later. Milotic uses the quieter board to Coil, then Hypnosis attacks the opponent's action economy. End with a speed-independent control state.",
          },
        ],
        victims: [
          {
            name: "Physical-control balance",
            why: "Intimidate does little to Gholdengo and can feed Milotic's Competitive.",
            play: "Keep the special/control clocks separated.",
            trap: "Do not expose both scalers to the same burst turn.",
          },
        ],
        counters: [
          {
            name: "Immediate dual-slot special burst",
            why: "It can deny both Nasty Plot and Coil access.",
            play: "Use Salamence speed and immediate attacks rather than setup.",
            trap: "Greedy turn-one scaling.",
          },
        ],
        advantages: [
          {
            title: "Sandless identity",
            body: "This package proves the six does not require its nominal weather root.",
          },
        ],
        hazards: [
          {
            title: "Setup saturation",
            body: "Gholdengo and Milotic are alternate scalers, not a requirement to set up both.",
          },
        ],
      },
      {
        id: "r2-hybrid-sand-special",
        label: "Hybrid Sand + Gold",
        when: "Bring this when Sand is useful but the opponent has enough physical counterplay that a special second wave is mandatory.",
        identity: "Sand forces immediate answers; Gholdengo punishes those answers.",
        slugs: [
          "tyranitar",
          "excadrill",
          "gholdengo",
          "milotic",
        ],
        strategy: {
          opponentPattern: "Mixed counterplay into Sand.",
          bring: [
            "tyranitar",
            "excadrill",
            "gholdengo",
            "milotic",
          ],
          purpose: "Overload physical answers with two special/control backline routes.",
          targets: [
            "Intimidate-heavy Sand answers",
            "Teams with narrow special counterplay",
          ],
          refuses: [
            "Single-axis physical offense",
          ],
          winCondition: "Use Sand to force resources, then finish from the special or control axis.",
          gamePlan: "Pressure physically → identify their answer → deploy Gholdengo or Milotic.",
          mantra: "Make their Sand answer choose the next winner.",
          turnChecklist: [
            "What are they spending to stop Excadrill?",
            "Does that create Gholdengo room?",
            "Does it trigger Competitive?",
            "Can Milotic Coil instead of racing?",
          ],
        },
        roles: [
          {
            slug: "tyranitar",
            macro: "Engine",
            micro: "Create Sand and force an immediate answer.",
          },
          {
            slug: "excadrill",
            macro: "First-wave converter",
            micro: "Spend Sand turns aggressively.",
          },
          {
            slug: "gholdengo",
            macro: "Special second wave",
            micro: "Punish overcommitted physical defense.",
          },
          {
            slug: "milotic",
            macro: "Reactive/control second wave",
            micro: "Punish stat drops or take the long game.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "tyranitar",
            "excadrill",
          ],
          leadWhy: "The lead forces the opponent to reveal how they intend to contain the physical Sand axis.",
          backPair: [
            "gholdengo",
            "milotic",
          ],
          backJobs: [
            {
              slug: "gholdengo",
              job: "Punish physical commitments with special conversion.",
            },
            {
              slug: "milotic",
              job: "Punish stat-control and slower stabilization attempts.",
            },
          ],
          pairEdges: [
            {
              from: "tyranitar",
              to: "excadrill",
              creates: "Sand",
              converts: "Sand Rush pressure",
            },
            {
              from: "milotic",
              to: "gholdengo",
              creates: "Sleep or control pressure",
              converts: "Special attack window",
            },
          ],
          turn1: "Use the Sand lead to reveal the opponent's defensive plan; preserve at least one backline clock.",
          bringInTriggers: [
            "Opponent commits Intimidate or physical walls → bring Milotic or Gholdengo.",
            "Opponent slows the board → favor Milotic over forcing Excadrill.",
          ],
        },
        defaultLeadPair: [
          "tyranitar",
          "excadrill",
        ],
        backPair: [
          "gholdengo",
          "milotic",
        ],
        identityCard: {
          engine: [
            "tyranitar",
          ],
          connector: [
            "milotic",
          ],
          converter: [
            "excadrill",
            "gholdengo",
          ],
          scaler: [
            "gholdengo",
            "milotic",
          ],
          control: [
            "milotic",
          ],
          winCondition: "Force physical answers with Sand, then convert the opponent's adjustment through Gholdengo or Milotic.",
          clock: "Immediate plus two independent scaling clocks",
          commitment: "Medium",
          autonomy: "Very high",
          triggerBreadth: "Weather, setup opportunity, stat drops, or Coil access.",
        },
        pilotDecision: {
          chooseWhen: [
            "Sand pressures preview but will not win alone.",
            "Opponent relies heavily on Intimidate or physical checks.",
          ],
          avoidWhen: [
            "The matchup demands Tailwind or Fake Out more than raw converter density.",
          ],
          previewQuestion: "What does the opponent need to spend to survive Excadrill, and which backline mon punishes that spend?",
          primaryMistake: "Treating Gholdengo as backup rather than a deliberately separate clock.",
        },
        engineIds: [
          "sand-rush",
          "gold-conversion",
          "coil-control",
        ],
        winRouteIds: [
          "sand-rush",
          "gold-conversion",
          "coil-control",
        ],
        endgameIds: [
          "sand-clean",
          "gold-endgame",
          "milotic-lock",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "sand-winning",
                when: "Their Sand answer is weak",
                then: "Keep converting with Excadrill.",
              },
              {
                id: "sand-contained",
                when: "Their Sand answer is effective",
                then: "Do not force it; expose the special/control backline.",
              },
            ],
          },
        ],
        loops: [
          {
            id: "r2-reveal-answer",
            type: "counterplay",
            title: "Make Them Show the Sand Answer",
            body: "When the preview suggests physical answers, lead Sand anyway if the exchange is safe. Use the first turn to force their answer rather than overextend. Once their response is visible, transition into Gholdengo or Milotic so the board state they created becomes your second-wave advantage.",
          },
          {
            id: "r2-special-back",
            type: "conversion",
            title: "Special Backline",
            body: "When Excadrill has forced Protects, switches, or stat control, bring Gholdengo or Milotic into that reduced-pressure state. Gholdengo converts through immediate damage or Nasty Plot; Milotic converts through Coil or Competitive. End with the opponent answering a different damage axis than the one they prepared for.",
          },
        ],
        victims: [
          {
            name: "Narrow anti-Sand game plans",
            why: "The package deliberately carries two backline routes that do not share Excadrill's answers.",
            play: "Force the anti-Sand resource first.",
            trap: "Do not sacrifice both leads before converting the information.",
          },
        ],
        counters: [
          {
            name: "Broad mixed offense",
            why: "It can pressure both physical and special backline without committing to one answer.",
            play: "Use Protect and selective trades; do not assume setup.",
            trap: "Giving away Milotic or Gholdengo before their axis matters.",
          },
        ],
        advantages: [
          {
            title: "Counterplay debt",
            body: "Resources spent containing Sand can create the opening for Gholdengo or Milotic.",
          },
        ],
        hazards: [
          {
            title: "Lead overcommitment",
            body: "The purpose of the lead is often to reveal and tax the answer, not necessarily to sweep.",
          },
        ],
      },
      {
        id: "r2-no-sand",
        label: "No-Sand Adaptive",
        when: "Bring this when weather is actively unfavorable or the opposing six is built to make Tyranitar/Excadrill inefficient.",
        identity: "Tailwind, Fake Out, special scaling, and Coil control without either Sand Pokémon.",
        slugs: [
          "salamence",
          "rillaboom",
          "gholdengo",
          "milotic",
        ],
        strategy: {
          opponentPattern: "Weather-hostile or anti-Sand preview.",
          bring: [
            "salamence",
            "rillaboom",
            "gholdengo",
            "milotic",
          ],
          purpose: "Demonstrate the team's architecture remains complete without its nominal root.",
          targets: [
            "Heavy weather control",
            "Bulky mixed balance",
          ],
          refuses: [
            "Forced weather wars",
          ],
          winCondition: "Create one favorable turn, then preserve the converter the opponent is least equipped to answer.",
          gamePlan: "Intimidate/Fake Out → Gholdengo or Milotic conversion → Tailwind or priority cleanup.",
          mantra: "The weather slot can stay home.",
          turnChecklist: [
            "Which scaler has cleaner access?",
            "Is Tailwind necessary?",
            "Can Rillaboom attack instead of support?",
            "Which back mon should remain hidden?",
          ],
        },
        roles: [
          {
            slug: "salamence",
            macro: "Speed/defensive bridge",
            micro: "Enter when Intimidate or Tailwind has concrete value.",
          },
          {
            slug: "rillaboom",
            macro: "Tempo and priority",
            micro: "Buy the first conversion turn.",
          },
          {
            slug: "gholdengo",
            macro: "Special win condition",
            micro: "Convert the free turn aggressively.",
          },
          {
            slug: "milotic",
            macro: "Control win condition",
            micro: "Take over when immediate speed matters less.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "rillaboom",
            "gholdengo",
          ],
          leadWhy: "The pair creates immediate Fake Out versus special-conversion ambiguity without exposing either Sand slot.",
          backPair: [
            "salamence",
            "milotic",
          ],
          backJobs: [
            {
              slug: "salamence",
              job: "Reset physical pressure and create Tailwind later rather than telegraphing it.",
            },
            {
              slug: "milotic",
              job: "Take the long game if the opponent survives Gholdengo's first wave.",
            },
          ],
          pairEdges: [
            {
              from: "rillaboom",
              to: "gholdengo",
              creates: "Fake Out free turn",
              converts: "Special scaling",
            },
            {
              from: "salamence",
              to: "milotic",
              creates: "Intimidate breathing room",
              converts: "Coil control",
            },
          ],
          turn1: "Use Fake Out only if it converts into a decisive Gholdengo state; otherwise preserve resources.",
          bringInTriggers: [
            "Physical pressure rises → Salamence.",
            "Game slows or stat drops appear → Milotic.",
          ],
        },
        defaultLeadPair: [
          "rillaboom",
          "gholdengo",
        ],
        backPair: [
          "salamence",
          "milotic",
        ],
        identityCard: {
          engine: [
            "salamence",
            "rillaboom",
          ],
          connector: [
            "salamence",
            "rillaboom",
          ],
          converter: [
            "gholdengo",
          ],
          scaler: [
            "gholdengo",
            "milotic",
          ],
          control: [
            "milotic",
          ],
          winCondition: "Win as a four-Pokémon balance team without touching weather.",
          clock: "Flexible tempo/scaling",
          commitment: "Low",
          autonomy: "Very high",
          triggerBreadth: "Intimidate, Fake Out, Tailwind, Coil, Competitive, or direct damage.",
        },
        pilotDecision: {
          chooseWhen: [
            "Opponent's weather denial is central.",
            "Sand would expose too many poor trades.",
            "The matchup rewards repeated autonomous decisions.",
          ],
          avoidWhen: [
            "Excadrill has a clearly dominant Sand matchup.",
          ],
          previewQuestion: "Would I still choose this four if Tyranitar and Excadrill were not on the team sheet?",
          primaryMistake: "Feeling obligated to bring Sand because the registered six contains Sand.",
        },
        engineIds: [
          "tailwind-bridge",
          "gold-conversion",
          "coil-control",
        ],
        winRouteIds: [
          "gold-conversion",
          "coil-control",
        ],
        endgameIds: [
          "gold-endgame",
          "milotic-lock",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "gold-route",
                when: "Gholdengo gets a safe first conversion",
                then: "Press the special clock.",
              },
              {
                id: "control-route",
                when: "Opponent immediately contains Gholdengo",
                then: "Preserve it and pivot toward Milotic.",
              },
            ],
          },
        ],
        loops: [
          {
            id: "r2-sandless-open",
            type: "conversion",
            title: "Sandless Opening",
            body: "When weather is a liability, lead Rillaboom and Gholdengo instead of trying to repair the matchup with Tyranitar. Use Fake Out to create the first profitable attack or Nasty Plot. End with the opponent committed to answering a special route while Salamence and Milotic remain unrevealed.",
          },
          {
            id: "r2-second-clock",
            type: "resource",
            title: "Second Clock Entry",
            body: "When the opponent commits enough resources to Gholdengo, bring Salamence or Milotic according to the axis they used. Salamence creates speed and damage reduction; Milotic creates a slower control clock. End with a second win condition that does not share Gholdengo's failure condition.",
          },
        ],
        victims: [
          {
            name: "Teams whose anti-Sand investment narrows their special/control answers",
            why: "This four ignores the matchup assumptions created by Tyranitar and Excadrill at preview.",
            play: "Keep the Sand slots benched and exploit preview tax.",
            trap: "Revealing the non-Sand plan too early in a set without reason.",
          },
        ],
        counters: [
          {
            name: "High-output mixed offense",
            why: "Can reduce setup access for both Gholdengo and Milotic.",
            play: "Use immediate damage and Tailwind rather than insisting on setup.",
            trap: "Treating every game as a scaling game.",
          },
        ],
        advantages: [
          {
            title: "Package entropy",
            body: "The six can register as Sand while this bring functions as an independent balance team.",
          },
        ],
        hazards: [
          {
            title: "Identity confusion",
            body: "Once this four is selected, stop making decisions as though Sand is still the plan.",
          },
        ],
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "Choose the package that matches the opponent's speed and control profile.",
        branches: [
          {
            when: "Preview is unclear",
            then: "Default to the safest core package.",
          },
        ],
      },
    ],
    loops: [
      {
        title: "Take the Sand Turn",
        body: "When Sand gives Excadrill a clean damage window, Tyranitar protects or pressures while Excadrill takes the highest-value attack. Do not spend the turn setting extra infrastructure. End with the opponent forced defensive and your backline still hidden.",
      },
      {
        title: "Milotic Second Wave",
        body: "When the opponent stabilizes against Sand, bring Milotic into the lower-pressure board. Coil if Salamence or prior damage has bought the turn, then threaten Hypnosis while Excadrill or Tyranitar finishes damaged targets. End with Milotic controlling actions instead of contesting speed.",
      },
      {
        title: "Fake Out to Gold",
        body: "When one opposing slot can be denied safely, Rillaboom uses Fake Out and Gholdengo chooses Nasty Plot only if the second slot cannot punish it. On the next turn convert with Make It Rain or Shadow Ball rather than stacking setup. End with Gholdengo ahead and Rillaboom still threatening priority.",
      },
    ],
    hazards: [
      {
        title: "Dual-Mega item tax",
        body: "Tyranitar and Salamence both hold Mega stones, so one item is inactive every battle; the preview flexibility must justify it.",
      },
      {
        title: "Experimental Milotic overlay",
        body: "The exact documented R2 tournament version used Sitrus Berry with Scald / Ice Beam / Coil / Protect; this manual intentionally tests the independently successful Leftovers Coil / Hypnosis / Muddy Water / Protect identity instead. ([PokeSynergy][2])",
      },
    ],
    victims: [
      {
        name: "Single-axis anti-Sand structures",
        why: "The six can simply route through Gholdengo, Milotic, Rillaboom, and Salamence.",
      },
      {
        name: "Intimidate-heavy physical control",
        why: "Milotic can invert stat-drop counterplay while Gholdengo attacks specially.",
      },
    ],
    counters: [
      {
        name: "High-output mixed offense with broad speed control",
        why: "It can reduce the safe turns needed by both Gholdengo and Milotic while pressuring Sand.",
      },
      {
        name: "Repeated weather control plus strong Ground/Steel answers",
        why: "It compresses the value of the Sand package and forces precise package selection.",
      },
    ],
    advantages: [
      {
        title: "Multiple autonomous converters",
        body: "Five members can create meaningful progress without the primary Sand engine.",
      },
      {
        title: "Low failure correlation",
        body: "Weather denial, Intimidate, setup denial, and speed reversal do not all hit the same routes.",
      },
      {
        title: "Empirical root",
        body: "Excadrill/Gholdengo/Milotic/Salamence has 28 recorded teams, 19 Top-16 finishes, and 2.61× expected Top-16 performance; Tyranitar/Rillaboom completes 25 of those cores at 66.8% full-team win rate. ([Pokémon Zone - Pokémon TCG Pocket][1])",
      },
    ],
    coreArchitecture: {
      identity: "A modular Sand balance team whose strongest property is that most members remain functional when the preferred engine disappears.",
      primaryEngine: "Sand gives Excadrill the fastest conversion, but the six deliberately carries multiple non-Sand engines.",
      conversionModel: "Convert Sand, Tailwind, Fake Out, Intimidate, or a quiet Coil turn into immediate damage or an autonomous scaler.",
      scalingModel: "Gholdengo scales specially through Nasty Plot; Milotic scales defensively/control-wise through Coil; Mega choices add situational power.",
      controlModel: "Intimidate, Fake Out, Competitive, sleep pressure, terrain, and Protect cycles manufacture and preserve favorable states.",
      speedModel: "Sand Rush is the explosive mode; Tailwind is the portable mode; priority and bulky Milotic cover boards where moving first is not guaranteed.",
      resourceModel: "Weather, terrain, Fake Out turns, Intimidate reductions, boosts, Leftovers recovery, and Mega choice are separate resources rather than one chain.",
      threatProfile: [
        "Fast Sand Rush burst",
        "Independent special setup",
        "Coil/Hypnosis control",
        "Tailwind special pressure",
        "Priority cleanup",
      ],
    },
    architecture: [
      {
        title: "Engine",
        body: "Tyranitar supplies Sand, Salamence supplies Tailwind and Intimidate, Rillaboom supplies Fake Out and terrain, and Milotic can manufacture its own Coil state.",
      },
      {
        title: "Converter",
        body: "Excadrill converts Sand immediately, Gholdengo converts free turns into Nasty Plot or Make It Rain, and Milotic converts quiet turns into reliable Hypnosis control.",
      },
      {
        title: "Endgame",
        body: "Finish with whichever clock survived: Sand Rush cleanup, boosted Gholdengo, Coil Milotic control, Salamence pressure, or Grassy Glide priority.",
      },
    ],
    clocks: [
      {
        id: "sand-clock",
        owner: [
          "tyranitar",
          "excadrill",
        ],
        speed: "immediate",
        goal: "Convert weather into immediate KOs before defensive positioning stabilizes.",
      },
      {
        id: "special-clock",
        owner: [
          "gholdengo",
          "rillaboom",
        ],
        speed: "scaling",
        goal: "Create one free Nasty Plot or a clean Make It Rain exchange.",
      },
      {
        id: "control-clock",
        owner: [
          "milotic",
        ],
        speed: "scaling",
        goal: "Coil once, then convert accuracy into sleep and Muddy Water pressure.",
      },
      {
        id: "tailwind-clock",
        owner: [
          "salamence",
        ],
        speed: "tempo",
        goal: "Give the non-Sand half a temporary speed advantage.",
      },
    ],
    winRoutes: [
      {
        id: "sand-rush",
        name: "Sand Rush Conversion",
        requires: [
          "tyranitar",
          "excadrill",
        ],
        sequence: [
          "Tyranitar establishes Sand.",
          "Excadrill converts Sand Rush into immediate pressure.",
          "Use Protect or Salamence positioning to preserve useful Sand turns.",
          "Finish with Excadrill or the backline priority/special attacker.",
        ],
        finish: "Opponent is forced into defensive play while a healthy backline closes.",
        failurePoint: "Weather is overwritten or Excadrill cannot safely convert.",
        dependencies: [
          {
            slug: "tyranitar",
            importance: "critical",
          },
          {
            slug: "excadrill",
            importance: "critical",
          },
          {
            slug: "salamence",
            importance: "supportive",
          },
        ],
      },
      {
        id: "gold-conversion",
        name: "Free Turn to Gholdengo",
        requires: [
          "gholdengo",
        ],
        sequence: [
          "Rillaboom, Salamence, or natural board pressure creates a safe turn.",
          "Gholdengo chooses Nasty Plot or immediate Make It Rain.",
          "Preserve Gholdengo with Protect while the second wave enters.",
          "Finish through special spread or Shadow Ball.",
        ],
        finish: "Boosted or healthy Gholdengo controls the special endgame.",
        failurePoint: "Gholdengo is forced to trade before obtaining sufficient value.",
        dependencies: [
          {
            slug: "gholdengo",
            importance: "critical",
          },
          {
            slug: "rillaboom",
            importance: "supportive",
          },
          {
            slug: "salamence",
            importance: "supportive",
          },
        ],
      },
      {
        id: "coil-control",
        name: "Coil Control",
        requires: [
          "milotic",
        ],
        sequence: [
          "Use Intimidate, Fake Out, or defensive pressure to create one quiet turn.",
          "Milotic uses Coil.",
          "Hypnosis removes an opposing action lane.",
          "Muddy Water and partners convert the immobilized board.",
        ],
        finish: "Milotic remains healthy while the opponent loses reliable action economy.",
        failurePoint: "Milotic is burst down before the first Coil or cannot afford setup.",
        dependencies: [
          {
            slug: "milotic",
            importance: "critical",
          },
          {
            slug: "rillaboom",
            importance: "supportive",
          },
          {
            slug: "salamence",
            importance: "supportive",
          },
        ],
      },
    ],
    failureRoutes: [
      {
        failedRoute: "sand-rush",
        why: "Weather control or Excadrill pressure removes the clean Sand conversion.",
        fallback: "Move to Rillaboom/Gholdengo or Salamence/Milotic positioning.",
        nextRoute: "gold-conversion",
      },
      {
        failedRoute: "gold-conversion",
        why: "Gholdengo is targeted or setup is denied.",
        fallback: "Use physical Sand or Coil Milotic rather than adding more setup commitment.",
        nextRoute: "coil-control",
      },
      {
        failedRoute: "coil-control",
        why: "Opponent applies immediate burst and never allows Milotic a quiet turn.",
        fallback: "Treat Milotic as immediate Muddy Water pressure and accelerate through Sand or Tailwind.",
        nextRoute: "sand-rush",
      },
    ],
    construction: {
      thesis: "Combine a proven Tyranitar/Excadrill/Salamence/Milotic root with Rillaboom/Gholdengo to create multiple independent conversion paths.",
      method: "Preserve Sand as the fastest engine while ensuring weather loss never ends the game plan.",
      winCondition: "Reach an endgame where at least one of Excadrill, Gholdengo, Milotic, Salamence, or Rillaboom retains an uncontested clock.",
      endgames: [
        {
          id: "sand-clean",
          label: "Sand Cleanup",
          path: "Preserve Sand turns and Excadrill HP until opposing defensive resources are spent.",
          how: "Excadrill closes through Sand Rush plus single-target or spread pressure.",
        },
        {
          id: "gold-endgame",
          label: "Golden Endgame",
          path: "Create one free turn, then preserve Gholdengo after Nasty Plot or favorable Make It Rain trades.",
          how: "Gholdengo closes from the special axis while physical answers are exhausted.",
        },
        {
          id: "milotic-lock",
          label: "Milotic Control",
          path: "Create one Coil, then use Hypnosis, Muddy Water, Protect, and recovery turns to reduce opposing actions.",
          how: "Milotic wins by making the opponent's remaining turns unreliable.",
        },
      ],
      altSlots: [],
    },
    engines: [
      {
        id: "sand-rush",
        label: "Sand Rush",
        path: [
          "Tyranitar · enter and set Sand",
          "Excadrill · gain Sand Rush speed",
          "Excadrill · choose single-target or Rock Slide pressure",
          "Partner · Protect, attack, or cover the response",
          "Backline · finish once the opponent spends defensive resources",
        ],
        how: "Sand is the fastest way for this team to create immediate advantage. Tyranitar creates the state and Excadrill converts it without requiring a setup turn. Press this engine when weather control is favorable and Excadrill can threaten meaningful damage immediately. Do not treat Sand as mandatory: opposing weather, Wide Guard, or poor Excadrill positioning can make another route more efficient. When denied, transition to Salamence speed, Gholdengo setup, or Milotic control rather than fighting endlessly for weather.",
        dependsOn: "Tyranitar must establish Sand and Excadrill must have a useful attack lane.",
        disrupt: "Weather overwrite, focused Excadrill pressure, spread denial, or defensive positioning.",
        fallback: "Use Tailwind plus Gholdengo/Rillaboom, or manufacture a Coil turn for Milotic.",
      },
      {
        id: "gold-conversion",
        label: "Gholdengo Conversion",
        path: [
          "Rillaboom or Salamence · manufacture a safer turn",
          "Gholdengo · Nasty Plot if the board permits",
          "Gholdengo · Make It Rain or Shadow Ball",
          "Partner · preserve tempo with Fake Out, Intimidate, or damage",
          "Gholdengo · finish the special endgame",
        ],
        how: "This is the principal non-Sand special win route. The important resource is not a specific partner; it is one low-cost turn created by Fake Out, Intimidate, Tailwind, or forced defensive play. Gholdengo converts that turn through Nasty Plot when the opponent cannot immediately punish it, but immediate damage is preferred when setup is unnecessary. This engine is particularly valuable when the opponent overprepares for Tyranitar and Excadrill. If Gholdengo is denied, the team still retains Milotic and physical conversion.",
        dependsOn: "Gholdengo needs either a safe setup turn or an already favorable attacking board.",
        disrupt: "Immediate focused damage, strong special resistance, or denying the free turn.",
        fallback: "Shift to Sand pressure or Coil Milotic.",
      },
      {
        id: "coil-control",
        label: "Coil Control",
        path: [
          "Salamence or Rillaboom · reduce immediate pressure",
          "Milotic · Coil",
          "Milotic · threaten increasingly reliable Hypnosis",
          "Partner · attack the immobilized or defensive board",
          "Milotic · Muddy Water and Protect to retain control",
        ],
        how: "Milotic gives the team an autonomous long-game state that does not require Sand or Tailwind. Coil increases physical durability and accuracy, making Hypnosis and Muddy Water progressively more reliable. Press this engine when the opponent lacks immediate burst or when Fake Out and Intimidate can manufacture the first quiet turn. Competitive is a bonus failure-inversion layer if the opponent uses stat drops, but the route does not depend on that trigger. If Coil is impossible, Milotic can still contribute immediate spread pressure while another converter becomes the win condition.",
        dependsOn: "Milotic must survive the first setup turn without giving away decisive board position.",
        disrupt: "Immediate burst, repeated double-targeting, or pressure that prevents setup.",
        fallback: "Skip Coil and play immediate Muddy Water while Sand or Tailwind carries conversion.",
      },
      {
        id: "tailwind-bridge",
        label: "Tailwind Bridge",
        path: [
          "Salamence · enter and Intimidate",
          "Salamence · Tailwind when multiple partners benefit",
          "Rillaboom or Gholdengo · convert the speed window",
          "Salamence · add Hyper Voice or Draco Meteor",
          "Backline · clean before Tailwind expires",
        ],
        how: "Tailwind prevents the six from becoming weather-dependent. Salamence first creates defensive time through Intimidate and can then convert that time into a speed advantage. Use this route when Sand is contested or when Gholdengo and Rillaboom benefit more from broad speed control than Excadrill benefits from weather. The route is less valuable when the opponent is deliberately playing a slower Trick Room state. If Tailwind is inverted, preserve Salamence and lean into Milotic or priority instead.",
        dependsOn: "At least two members of the active package must materially benefit from Tailwind.",
        disrupt: "Trick Room, immediate Salamence pressure, or boards where speed is not the relevant axis.",
        fallback: "Use Milotic's speed-independent control or Grassy Glide priority.",
      },
    ],
    network: {
      thesis: "Independent engines share bridge resources without sharing one common failure condition.",
      edges: [
        {
          from: "tyranitar",
          to: "excadrill",
          creates: "Sand",
          converts: "Sand Rush pressure",
          engineId: "sand-rush",
        },
        {
          from: "salamence",
          to: "gholdengo",
          creates: "Intimidate free turn",
          converts: "Nasty Plot",
          engineId: "gold-conversion",
        },
        {
          from: "salamence",
          to: "milotic",
          creates: "Reduced physical pressure",
          converts: "Safer Coil",
          engineId: "coil-control",
        },
        {
          from: "rillaboom",
          to: "gholdengo",
          creates: "Fake Out free turn",
          converts: "Nasty Plot",
          engineId: "gold-conversion",
        },
        {
          from: "rillaboom",
          to: "milotic",
          creates: "Fake Out plus recovery",
          converts: "Coil control",
          engineId: "coil-control",
        },
        {
          from: "salamence",
          to: "excadrill",
          creates: "Tailwind",
          converts: "Non-Sand speed",
          engineId: "tailwind-bridge",
        },
        {
          from: "rillaboom",
          to: "tyranitar",
          creates: "Fake Out tempo",
          converts: "Safer Rock pressure",
        },
        {
          from: "milotic",
          to: "gholdengo",
          creates: "Sleep pressure",
          converts: "Special attack window",
          engineId: "coil-control",
        },
      ],
    },
    commandments: [
      "Sand is a weapon, not an obligation.",
      "Spend Fake Out on the teammate that converts the turn best.",
      "Do not click Hypnosis as though Coil never existed.",
      "Choose the Mega for the matchup, not from habit.",
      "When one route is denied, switch clocks instead of forcing it.",
    ],
    controlPlanes: [
      {
        id: "sand",
        label: "Sand",
        setterSlug: "tyranitar",
        effect: "Sand",
        whoBenefits: "Excadrill and Sand-dependent pressure",
      },
      {
        id: "tailwind",
        label: "Tailwind",
        setterSlug: "salamence",
        effect: "Tailwind",
        whoBenefits: "Physical and special converters",
      },
      {
        id: "fake-out",
        label: "Fake Out",
        setterSlug: "rillaboom",
        effect: "Fake Out",
        whoBenefits: "Partners needing a free turn",
      },
      {
        id: "grassy-terrain",
        label: "Grassy Terrain",
        setterSlug: "rillaboom",
        effect: "Grassy Terrain",
        whoBenefits: "Recovery and Grassy Glide",
      },
      {
        id: "intimidate",
        label: "Intimidate",
        setterSlug: "salamence",
        effect: "Intimidate",
        whoBenefits: "Physical defense and Milotic Competitive",
      },
      {
        id: "competitive",
        label: "Competitive",
        setterSlug: "milotic",
        effect: "Competitive",
        whoBenefits: "Special pressure after Attack drops",
      },
      {
        id: "coil-hypnosis",
        label: "Coil / Hypnosis",
        setterSlug: "milotic",
        effect: "Coil / Hypnosis",
        whoBenefits: "Control endgames",
      },
      {
        id: "nasty-plot",
        label: "Nasty Plot",
        setterSlug: "gholdengo",
        effect: "Nasty Plot",
        whoBenefits: "Special scaling clock",
      },
      {
        id: "priority",
        label: "Priority",
        setterSlug: "rillaboom",
        effect: "Priority",
        whoBenefits: "Late-game conversion",
      },
    ],
    megaPool: {
      rule: "One Mega Stone per battle — preview which Mega candidate matters more.",
      previewPressure: "Decide which Mega path the opponent most fears before locking the stone.",
      candidates: [
        {
          slug: "tyranitar",
          stone: "Tyranitarite",
          when: "Use when Tyranitar itself must become the durable physical centerpiece.",
        },
        {
          slug: "salamence",
          stone: "Salamencite",
          when: "Use when Intimidate plus faster special conversion is the more valuable Mega path.",
        },
      ],
    },
    matchupScripts: [
      {
        id: "script-1",
        foe: "Opponent lacks reliable weather control",
        why: "Opponent lacks reliable weather control",
        packId: "r2-sand-pressure",
        sequence: {
          beats: [
            {
              click: "Opponent lacks reliable weather control",
            },
          ],
        },
      },
      {
        id: "script-2",
        foe: "Opponent overprepares for physical Sand",
        why: "Opponent overprepares for physical Sand",
        packId: "r2-grassy-special",
        sequence: {
          beats: [
            {
              click: "Opponent overprepares for physical Sand",
            },
          ],
        },
      },
      {
        id: "script-3",
        foe: "Opponent uses heavy Intimidate or positional physical control",
        why: "Opponent uses heavy Intimidate or positional physical control",
        packId: "r2-hybrid-sand-special",
        sequence: {
          beats: [
            {
              click: "Opponent uses heavy Intimidate or positional physical control",
            },
          ],
        },
      },
      {
        id: "script-4",
        foe: "Weather war looks expensive",
        why: "Weather war looks expensive",
        packId: "r2-no-sand",
        sequence: {
          beats: [
            {
              click: "Weather war looks expensive",
            },
          ],
        },
      },
    ],
    evidence: {
      season: "Regulation M-C",
      asOf: "2026-09-22",
      source: "The Excadrill/Gholdengo/Milotic/Salamence core has 2.61× expected Top-16 performance, with Tyranitar/Rillaboom completing 89.3% of those recorded cores at 66.8% team win rate. Related overlapping fours also recur successfully. ([Pokémon Zone - Pokémon TCG Pocket][1])",
      caveat: "Core percentages are observational tournament data, not controlled matchup estimates. Milotic's Coil/Hypnosis set is an intentional architecture experiment layered onto a proven six. Authored to the attached Ringside Doubles requirements: bring four, full kits, fieldPlan, engines, network, package loops, and 66-SP recommendations. ",
    },
  } satisfies TeamManual;
