import { train } from "@/content/manual-train";
import type { TeamManual } from "@/content/manuals";

export const R4_COUNTERPLAY_CLOSURE_MANUAL = {
    id: "r4-counterplay-closure-manual",
    title: "R4 — Counterplay Closure",
    lede: "Fast Raichu, slow Golisopod, Trick Room Farigiraf, Coil Milotic, and dual positional pivots attack the opponent's exits from multiple directions.",
    format: "doubles",
    philosophy: "Do not merely present fast and slow modes. Close the opponent's escape routes: Armor Tail attacks priority, Trick Room attacks speed, Psychic Noise attacks recovery, Encore attacks passivity, Competitive attacks stat control, and Coil/Hypnosis attacks inactivity.",
    archetype: "balance",
    family: "room",
    meta: "Regulation M-C",
    setsNote: "Starting architecture spend (66 SP, max 32). Recommended configuration — not claimed as mathematically optimal vs every M-C threshold.",
    pilot: {
      thesis: "Make every normal escape from one clock expose the opponent to another.",
      rule: "Pick the package whose clock the opponent cannot answer first.",
      fail: "Forcing one engine after the opponent has already closed that route.",
    },
    box: [
      "raichu",
      "farigiraf",
      "incineroar",
      "rillaboom",
      "milotic",
      "golisopod",
    ],
    core: [
      "farigiraf",
      "milotic",
      "golisopod",
    ],
    slugs: [
      "farigiraf",
      "milotic",
      "golisopod",
    ],
    slots: [],
    roster: [
      {
        slug: "raichu",
        title: "Raichu",
        job: "mega",
        literacy: "wallbreaker",
        primaryJob: "Exploit Mega timing rather than treating Mega evolution as automatic.",
        role: "Pre-Mega Electric protection that transitions into No Guard burst and Encore control.",
        item: "Raichunite Y",
        ability: "Lightning Rod",
        nature: "Timid",
        moves: [
          {
            name: "Zap Cannon",
            why: "No Guard turns normally unreliable Electric pressure into guaranteed-accuracy burst with paralysis utility.",
          },
          {
            name: "Focus Blast",
            why: "No Guard converts high-power Fighting coverage into reliable pressure.",
          },
          {
            name: "Protect",
            why: "Preserves Mega timing and lets Trick Room or partner positioning develop.",
          },
          {
            name: "Encore",
            why: "Punishes Protect, setup, and passive attempts to wait out the team's clocks.",
          },
        ],
        objective: "Use Lightning Rod before Mega when it matters; Mega only when offensive No Guard conversion is more valuable.",
        howToPlay: "Raichu is a state-transition Pokémon. Delay Mega evolution when Electric redirection protects the board; Mega when Zap Cannon, Focus Blast, or fast Encore becomes the stronger rule.",
        training: train(2, 0, 0, 32, 0, 32, {
            "label": "Timid max SpA / Speed",
            "why": "Recommended starting spread for the exact fast offensive/control identity used by the tournament team.",
            "spend": [
              "2 HP",
              "32 SpA",
              "32 Spe"
            ],
            "rule": "66 SP max 32 per stat; recommended starting spread, not claimed optimal."
          }),
        networkJobs: {
          creates: "Electric protection; Encore lock",
          converts: "No Guard burst",
          protects: "golisopod; milotic",
        },
        abilityStages: {
          before: "Pre-Mega: Lightning Rod protects partners from Electric targeting.",
          after: "Post-Mega: No Guard makes Zap Cannon and Focus Blast reliable.",
          when: "Post-Mega: No Guard makes Zap Cannon and Focus Blast reliable.",
        },
        ampTargets: [
          {
            slug: "golisopod",
            becomes: "Amp target",
          },
          {
            slug: "milotic",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "The Mega stone creates a deliberate before/after ability transition rather than a simple stat upgrade.",
            },
          ],
        },
      },
      {
        slug: "farigiraf",
        title: "Farigiraf",
        job: "speed",
        literacy: "setter",
        primaryJob: "Make fast and priority-based counterplay unreliable.",
        role: "Speed inverter, priority gate, and recovery-denial controller.",
        item: "Sitrus Berry",
        ability: "Armor Tail",
        nature: "Bold",
        moves: [
          {
            name: "Trick Room",
            why: "Inverts speed when the opponent leans into faster modes.",
          },
          {
            name: "Psychic Noise",
            why: "Attacks recovery-based counterplay while dealing useful STAB damage.",
          },
          {
            name: "Thunderbolt",
            why: "Adds direct Electric conversion instead of becoming purely passive.",
          },
          {
            name: "Protect",
            why: "Preserves Armor Tail and Trick Room timing.",
          },
        ],
        objective: "Use Farigiraf only when speed inversion, priority denial, or recovery denial meaningfully closes the matchup.",
        howToPlay: "Do not click Trick Room by default. If the opponent already moves slowly, Armor Tail and Psychic Noise may be the more important functions.",
        training: train(32, 0, 32, 2, 0, 0, {
            "label": "Bold max HP / Defense",
            "why": "Recommended starting spread for surviving physical pressure while establishing Trick Room or Psychic Noise.",
            "spend": [
              "32 HP",
              "32 Def",
              "2 SpA"
            ],
            "rule": "66 SP max 32 per stat; recommended starting spread, not claimed optimal."
          }),
        networkJobs: {
          creates: "Trick Room; Priority denial; Recovery denial",
          converts: "Psychic Noise pressure",
          protects: "Golisopod slow mode",
        },
        ampTargets: [
          {
            slug: "golisopod",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "Sitrus Berry extends the number of turns Armor Tail and speed control remain on the board.",
            },
          ],
        },
      },
      {
        slug: "incineroar",
        title: "Incineroar",
        job: "support",
        literacy: "pivot",
        primaryJob: "Create safer setup and Trick Room turns without becoming passive.",
        role: "Physical stabilizer, Fake Out engine, and voluntary reset valve.",
        item: "Expert Belt",
        ability: "Intimidate",
        nature: "Adamant",
        moves: [
          {
            name: "Darkest Lariat",
            why: "Reliable Dark conversion that keeps Incineroar from being only support.",
          },
          {
            name: "Flare Blitz",
            why: "Immediate Fire pressure into targets that would otherwise ignore the pivot.",
          },
          {
            name: "Parting Shot",
            why: "Resets Intimidate and manufactures safer entries for the team's scalers.",
          },
          {
            name: "Fake Out",
            why: "Buys Trick Room, Coil, or Swords Dance turns.",
          },
        ],
        objective: "Lower incoming physical pressure and hand the board to the correct win condition.",
        howToPlay: "Use Parting Shot as a resource loop, not merely an escape button. The target is the next favorable entry state.",
        training: train(20, 32, 0, 0, 14, 0, {
            "label": "Adamant Attack with mixed bulk",
            "why": "Recommended starting spread reflecting the published offensive Expert Belt identity while preserving useful bulk.",
            "spend": [
              "20 HP",
              "32 Atk",
              "14 SpD"
            ],
            "rule": "66 SP max 32 per stat; recommended starting spread, not claimed optimal."
          }),
        networkJobs: {
          creates: "Fake Out free turn; Intimidate; Parting Shot reset",
          converts: "Flare Blitz; Darkest Lariat",
          protects: "farigiraf; milotic; golisopod",
        },
        ampTargets: [
          {
            slug: "farigiraf",
            becomes: "Amp target",
          },
          {
            slug: "milotic",
            becomes: "Amp target",
          },
          {
            slug: "golisopod",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "Expert Belt preserves real offensive consequence while Incineroar performs support work.",
            },
          ],
        },
      },
      {
        slug: "rillaboom",
        title: "Rillaboom",
        job: "support",
        literacy: "wallbreaker",
        primaryJob: "Create tempo while retaining enough damage that the opponent cannot simply ignore it.",
        role: "Offensive Fake Out engine, terrain setter, and priority converter.",
        item: "Life Orb",
        ability: "Grassy Surge",
        nature: "Adamant",
        moves: [
          {
            name: "Fake Out",
            why: "Buys Coil, Trick Room, or Swords Dance access.",
          },
          {
            name: "Wood Hammer",
            why: "Immediate high-power conversion when the team needs damage now.",
          },
          {
            name: "Grassy Glide",
            why: "Priority cleanup outside Trick Room.",
          },
          {
            name: "High Horsepower",
            why: "Ground coverage that does not interfere with the partner.",
          },
        ],
        objective: "Function as both infrastructure and a credible immediate attacker.",
        howToPlay: "Life Orb means supporting forever is often wrong. Once the free turn has been created, convert with damage.",
        training: train(14, 32, 0, 0, 0, 20, {
            "label": "Adamant max Attack with speed utility",
            "why": "Recommended starting spread for an offensive Life Orb role rather than a purely bulky support build.",
            "spend": [
              "14 HP",
              "32 Atk",
              "20 Spe"
            ],
            "rule": "66 SP max 32 per stat; recommended starting spread, not claimed optimal."
          }),
        networkJobs: {
          creates: "Grassy Terrain; Fake Out free turn",
          converts: "Wood Hammer; Grassy Glide",
          protects: "milotic; farigiraf",
        },
        ampTargets: [
          {
            slug: "milotic",
            becomes: "Amp target",
          },
          {
            slug: "golisopod",
            becomes: "Amp target",
          },
          {
            slug: "farigiraf",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "Life Orb turns Fake Out infrastructure into immediate offensive threat on subsequent turns.",
            },
          ],
        },
      },
      {
        slug: "milotic",
        title: "Milotic",
        job: "support",
        literacy: "disruptor",
        primaryJob: "Create a speed-independent win route through Coil and Hypnosis.",
        role: "Adaptive control scaler and Intimidate failure inverter.",
        item: "Leftovers",
        ability: "Competitive",
        nature: "Calm",
        moves: [
          {
            name: "Coil",
            why: "Improves Defense and accuracy so the control package becomes more reliable.",
          },
          {
            name: "Muddy Water",
            why: "Spread pressure with additional accuracy-control upside.",
          },
          {
            name: "Hypnosis",
            why: "Converts Coil accuracy into lost opponent actions.",
          },
          {
            name: "Protect",
            why: "Preserves boosts and Leftovers while Trick Room, terrain, or positioning changes.",
          },
        ],
        objective: "Win boards where neither pure fast nor pure slow offense is ideal.",
        howToPlay: "Milotic is the team's third speed state: it can stop caring about the speed race and instead control actions.",
        training: train(32, 0, 14, 0, 20, 0, {
            "label": "Calm bulky Coil control",
            "why": "Recommended starting spread for the published Coil/Hypnosis identity; prioritize staying power over a guessed speed benchmark.",
            "spend": [
              "32 HP",
              "14 Def",
              "20 SpD"
            ],
            "rule": "66 SP max 32 per stat; recommended starting spread, not claimed optimal."
          }),
        networkJobs: {
          creates: "Sleep pressure; Accuracy pressure",
          converts: "Competitive; Coil",
          protects: "Long-game state",
          scales: "Coil",
        },
        itemLoop: {
          beats: [
            {
              click: "Leftovers plus Grassy Terrain rewards every extra turn created by Coil, sleep, Fake Out, or Protect.",
            },
          ],
        },
      },
      {
        slug: "golisopod",
        title: "Golisopod",
        job: "breaker",
        literacy: "sweeper",
        primaryJob: "Exploit slow boards without becoming useless on fast boards.",
        role: "Slow Mega converter that retains Sucker Punch outside Trick Room.",
        item: "Golisopite",
        ability: "Emergency Exit",
        nature: "Adamant",
        moves: [
          {
            name: "Swords Dance",
            why: "Turns one protected Trick Room or Fake Out turn into a threatening slow clock.",
          },
          {
            name: "Leech Life",
            why: "Primary STAB conversion with built-in resource recovery.",
          },
          {
            name: "Sucker Punch",
            why: "Preserves priority pressure when Trick Room is absent.",
          },
          {
            name: "Protect",
            why: "Preserves setup, Mega timing, and Trick Room turns.",
          },
        ],
        objective: "Become the slow-mode win condition while maintaining an out-of-room priority route.",
        howToPlay: "Do not assume Trick Room is required. Sucker Punch and natural bulk let Golisopod participate before or after the room state.",
        training: train(32, 32, 0, 0, 2, 0, {
            "label": "Adamant max HP / Attack",
            "why": "Recommended starting spread for a slow physical setup and Trick Room conversion role.",
            "spend": [
              "32 HP",
              "32 Atk",
              "2 SpD"
            ],
            "rule": "66 SP max 32 per stat; recommended starting spread, not claimed optimal."
          }),
        networkJobs: {
          creates: "Swords Dance threat",
          converts: "Trick Room; Fake Out turns",
          protects: "Own longevity through Leech Life",
          scales: "Swords Dance",
        },
        abilityStages: {
          before: "Pre-Mega: Emergency Exit can create an involuntary reposition.",
          after: "Mega: convert the slot into the dedicated slow physical win condition.",
          when: "Mega: convert the slot into the dedicated slow physical win condition.",
        },
        itemLoop: {
          beats: [
            {
              click: "Golisopite turns the slow-mode slot into the team's principal Mega option when Raichu should retain Lightning Rod.",
            },
          ],
        },
      },
    ],
    packs: [
      {
        id: "r4-room-break",
        label: "Room Breaker",
        when: "Bring this when the opponent is strongly optimized for moving first and does not gain more from Trick Room than Golisopod does.",
        identity: "Farigiraf flips speed while Golisopod becomes the slow physical clock.",
        slugs: [
          "farigiraf",
          "golisopod",
          "incineroar",
          "milotic",
        ],
        strategy: {
          opponentPattern: "Fast offense or priority-dependent offense.",
          bring: [
            "farigiraf",
            "golisopod",
            "incineroar",
            "milotic",
          ],
          purpose: "Invert speed while retaining a second control win condition.",
          targets: [
            "Fast single-regime offense",
            "Priority-reliant cleanup",
          ],
          refuses: [
            "Blind turn-one Trick Room",
            "Forcing Golisopod setup into obvious double-targeting",
          ],
          winCondition: "Establish the correct slow state, then choose Golisopod burst or Milotic control.",
          gamePlan: "Stabilize → invert speed if favorable → scale one win condition → close recovery/priority exits.",
          mantra: "Room only when Room helps us more.",
          turnChecklist: [
            "Who wins under Trick Room?",
            "Can Fake Out buy Room safely?",
            "Should Golisopod attack or Swords Dance?",
            "Can Milotic become the second clock?",
          ],
        },
        roles: [
          {
            slug: "farigiraf",
            macro: "Speed and priority control",
            micro: "Set Room only when it improves the package.",
          },
          {
            slug: "golisopod",
            macro: "Slow converter",
            micro: "Choose immediate Leech Life or Swords Dance.",
          },
          {
            slug: "incineroar",
            macro: "Setup access",
            micro: "Fake Out or Parting Shot to manufacture the first state.",
          },
          {
            slug: "milotic",
            macro: "Second win condition",
            micro: "Use Coil when Golisopod draws the opponent's attention.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "incineroar",
            "farigiraf",
          ],
          leadWhy: "Fake Out plus Intimidate gives Farigiraf the safest opportunity to decide whether Trick Room is correct.",
          backPair: [
            "golisopod",
            "milotic",
          ],
          backJobs: [
            {
              slug: "golisopod",
              job: "Enter once the slow state is established and convert Room turns.",
            },
            {
              slug: "milotic",
              job: "Punish Intimidate or become the control fallback if Golisopod is checked.",
            },
          ],
          pairEdges: [
            {
              from: "incineroar",
              to: "farigiraf",
              creates: "Fake Out free turn",
              converts: "Trick Room",
            },
            {
              from: "farigiraf",
              to: "golisopod",
              creates: "Trick Room",
              converts: "Slow physical pressure",
            },
            {
              from: "incineroar",
              to: "milotic",
              creates: "Reduced physical pressure",
              converts: "Safer Coil",
            },
          ],
          turn1: "Fake Out only if it creates a genuinely favorable Room or Psychic Noise state; otherwise preserve the ambiguity.",
          bringInTriggers: [
            "Room is established → bring Golisopod.",
            "Opponent commits stat control or the board stabilizes → bring Milotic.",
          ],
        },
        defaultLeadPair: [
          "incineroar",
          "farigiraf",
        ],
        backPair: [
          "golisopod",
          "milotic",
        ],
        identityCard: {
          engine: [
            "farigiraf",
            "incineroar",
          ],
          connector: [
            "incineroar",
          ],
          converter: [
            "golisopod",
          ],
          scaler: [
            "golisopod",
            "milotic",
          ],
          control: [
            "farigiraf",
            "milotic",
          ],
          winCondition: "Make the opponent's fast mode bad, then convert the slower state with Golisopod or Milotic.",
          clock: "Slow plus speed-independent",
          commitment: "Medium",
          autonomy: "High",
          triggerBreadth: "Opponent speed, Fake Out access, stat drops, or a quiet Coil turn.",
        },
        pilotDecision: {
          chooseWhen: [
            "Opponent depends heavily on speed.",
            "Golisopod is advantaged under Room.",
            "Armor Tail meaningfully constrains priority.",
          ],
          avoidWhen: [
            "Opponent's slow threats benefit more from Trick Room.",
            "Farigiraf would be forced into a predictable turn-one Room.",
          ],
          previewQuestion: "Who actually benefits most if Trick Room goes up?",
          primaryMistake: "Treating Farigiraf as a mandatory Trick Room button.",
        },
        engineIds: [
          "room-break",
          "coil-lock",
          "position-loop",
        ],
        winRouteIds: [
          "room-break",
          "coil-lock",
        ],
        endgameIds: [
          "goli-room",
          "milotic-lock",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "room-good",
                when: "Our slow mode clearly benefits more",
                then: "Create and convert Trick Room.",
              },
              {
                id: "room-bad",
                when: "Opponent also wants the slow board",
                then: "Use Farigiraf for Armor Tail/Psychic Noise and play Milotic control.",
              },
            ],
          },
        ],
        loops: [
          {
            id: "r4-fake-room",
            type: "infrastructure",
            title: "Fake Out to Room",
            body: "When the opponent's speed advantage is the main problem, Incineroar uses Fake Out while Farigiraf establishes Trick Room. Bring Golisopod into the resulting slow state and choose Swords Dance only if the opponent cannot punish the setup. End with Golisopod converting Room while Armor Tail constrains priority.",
          },
          {
            id: "r4-milo-back",
            type: "counterplay",
            title: "Milotic Backstop",
            body: "When the opponent adapts to Golisopod with Intimidate, defensive positioning, or concentrated physical control, bring Milotic rather than forcing the slow breaker. Use Coil if the board is quiet or cash Competitive immediately if triggered. End with the opponent facing a special/control clock instead of the physical one they prepared for.",
          },
        ],
        victims: [
          {
            name: "Fast priority-reliant offense",
            why: "Trick Room and Armor Tail attack two of its preferred conversion axes.",
            play: "Do not overcomplicate the first speed inversion.",
            trap: "Setting Room against an opposing slow mode.",
          },
        ],
        counters: [
          {
            name: "Naturally slow offense with strong Farigiraf pressure",
            why: "It can make Trick Room actively unfavorable.",
            play: "Keep Room optional and use Milotic or direct damage.",
            trap: "Assuming the slow package always requires Room.",
          },
        ],
        advantages: [
          {
            title: "Orthogonal second clock",
            body: "If Golisopod's physical route is controlled, Milotic attacks from a different failure axis.",
          },
        ],
        hazards: [
          {
            title: "Room autopilot",
            body: "The package is strongest when Trick Room remains a threat rather than a compulsory click.",
          },
        ],
      },
      {
        id: "r4-fast-control",
        label: "Fast Control",
        when: "Bring this when Lightning Rod, Mega Raichu speed, and Rillaboom/Incineroar tempo matter more than Trick Room.",
        identity: "Fast Raichu backed by double positional infrastructure and Milotic control.",
        slugs: [
          "raichu",
          "rillaboom",
          "incineroar",
          "milotic",
        ],
        strategy: {
          opponentPattern: "Balanced or moderately fast boards.",
          bring: [
            "raichu",
            "rillaboom",
            "incineroar",
            "milotic",
          ],
          purpose: "Play fast without sacrificing a slower control endgame.",
          targets: [
            "Electric-reliant pressure",
            "Protect-heavy balance",
          ],
          refuses: [
            "Automatic Mega evolution",
            "Raw Hypnosis before setup when Coil is available",
          ],
          winCondition: "Force defensive actions with Raichu, close those actions with Encore, then let Milotic take the long game.",
          gamePlan: "Protect board with Lightning Rod → transition to No Guard → pivot and Coil when opponent slows.",
          mantra: "Use the right Raichu state.",
          turnChecklist: [
            "Keep Lightning Rod or Mega?",
            "Can Encore punish their defensive action?",
            "Which Fake Out creates the best future turn?",
            "Can Milotic Coil now?",
          ],
        },
        roles: [
          {
            slug: "raichu",
            macro: "Fast converter",
            micro: "Transition from Lightning Rod to No Guard at the correct time.",
          },
          {
            slug: "rillaboom",
            macro: "Tempo/offense",
            micro: "Fake Out once, then become a Life Orb attacker.",
          },
          {
            slug: "incineroar",
            macro: "Reset engine",
            micro: "Enter when physical suppression or Parting Shot creates the second wave.",
          },
          {
            slug: "milotic",
            macro: "Control closer",
            micro: "Take over when the opponent slows the pace.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "raichu",
            "rillaboom",
          ],
          leadWhy: "Rillaboom provides one immediate denied action while Raichu decides whether to remain Lightning Rod or become the fast Mega converter.",
          backPair: [
            "incineroar",
            "milotic",
          ],
          backJobs: [
            {
              slug: "incineroar",
              job: "Reset the physical board and create the next favorable entry.",
            },
            {
              slug: "milotic",
              job: "Become the slow-control closer after fast resources are spent.",
            },
          ],
          pairEdges: [
            {
              from: "rillaboom",
              to: "raichu",
              creates: "Fake Out free turn",
              converts: "No Guard pressure",
            },
            {
              from: "incineroar",
              to: "milotic",
              creates: "Reduced physical pressure",
              converts: "Safer Coil",
            },
          ],
          turn1: "Preserve Lightning Rod unless Mega Raichu immediately creates more value; use Rillaboom to deny the highest-value opposing action.",
          bringInTriggers: [
            "Physical pressure rises → Incineroar.",
            "Opponent begins protecting or stabilizing → Milotic.",
          ],
        },
        defaultLeadPair: [
          "raichu",
          "rillaboom",
        ],
        backPair: [
          "incineroar",
          "milotic",
        ],
        identityCard: {
          engine: [
            "rillaboom",
            "incineroar",
          ],
          connector: [
            "rillaboom",
            "incineroar",
          ],
          converter: [
            "raichu",
          ],
          scaler: [
            "milotic",
          ],
          control: [
            "raichu",
            "incineroar",
          ],
          winCondition: "Use fast Raichu to force defensive actions, then punish those actions with Encore or Coil Milotic.",
          clock: "Fast into scaling",
          commitment: "Low",
          autonomy: "High",
          triggerBreadth: "Electric attacks, Fake Out turns, Protect, setup, Intimidate, or Coil access.",
        },
        pilotDecision: {
          chooseWhen: [
            "Electric targeting matters.",
            "Opponent is not strongly faster than Raichu.",
            "Trick Room would be unnecessary or risky.",
          ],
          avoidWhen: [
            "Opponent's speed profile makes Raichu unable to create meaningful pressure without Room support.",
          ],
          previewQuestion: "Do I gain more from Lightning Rod before Mega or No Guard after Mega?",
          primaryMistake: "Mega evolving immediately and throwing away Lightning Rod utility.",
        },
        engineIds: [
          "mega-raichu",
          "coil-lock",
          "position-loop",
        ],
        winRouteIds: [
          "mega-raichu",
          "coil-lock",
        ],
        endgameIds: [
          "raichu-fast",
          "milotic-lock",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "keep-lightning",
                when: "Electric protection still constrains the opponent",
                then: "Delay Mega.",
              },
              {
                id: "mega-now",
                when: "No Guard offense immediately creates greater value",
                then: "Mega and press the attack.",
              },
            ],
          },
        ],
        loops: [
          {
            id: "r4-lightning-transition",
            type: "conversion",
            title: "Lightning Rod to No Guard",
            body: "When Electric protection matters, keep Raichu non-Mega while Rillaboom controls one opposing action. Once the Electric threat or target pattern changes, Mega evolve and convert with Zap Cannon or Focus Blast. End with the opponent forced into Protect or repositioning that Encore can punish.",
          },
          {
            id: "r4-control-back",
            type: "resource",
            title: "Fast Front, Slow Back",
            body: "When the opponent spends resources containing Raichu, bring Incineroar or Milotic rather than forcing the fast game. Incineroar lowers physical output and Milotic Coils into the quieter board. End with the pace of the game shifted from burst to control.",
          },
        ],
        victims: [
          {
            name: "Electric-reliant balance",
            why: "Lightning Rod changes targeting before Raichu transitions into offense.",
            play: "Extract defensive value before spending the Mega transition.",
            trap: "Mega evolving before Electric protection has finished its job.",
          },
        ],
        counters: [
          {
            name: "Very fast non-Electric hyper offense",
            why: "Can reduce Raichu's conversion window without feeding Lightning Rod.",
            play: "Use Fake Out and Incineroar, or choose the Farigiraf package instead.",
            trap: "Insisting on the fast package when the speed matchup is poor.",
          },
        ],
        advantages: [
          {
            title: "State-transition value",
            body: "Raichu offers defensive utility before Mega and reliable offense after Mega.",
          },
        ],
        hazards: [
          {
            title: "Mega collision",
            body: "Selecting Mega Raichu means Golisopod is not the Mega this battle; preview must justify the resource.",
          },
        ],
      },
      {
        id: "r4-closure",
        label: "Counterplay Closure",
        when: "Bring this when the opponent relies on speed, priority, Protect, or recovery to stabilize.",
        identity: "The four directly attacks common escape routes instead of only generating raw damage.",
        slugs: [
          "raichu",
          "farigiraf",
          "milotic",
          "golisopod",
        ],
        strategy: {
          opponentPattern: "Bulky balance or structured offense with clear defensive exits.",
          bring: [
            "raichu",
            "farigiraf",
            "milotic",
            "golisopod",
          ],
          purpose: "Attack speed, priority, recovery, and passive defense from separate directions.",
          targets: [
            "Recovery-heavy balance",
            "Priority-dependent endgames",
            "Protect-dependent positioning",
          ],
          refuses: [
            "Letting the opponent reset for free",
            "Treating Trick Room as the only Farigiraf function",
          ],
          winCondition: "Close enough exits that one of Raichu, Golisopod, or Milotic gets an uncontested clock.",
          gamePlan: "Identify escape → remove it → force second escape → convert with opposite-speed win condition.",
          mantra: "Do not just threaten them; close the exits.",
          turnChecklist: [
            "Is their exit speed, priority, healing, or Protect?",
            "Which move closes that exit?",
            "Which Mega belongs in this game?",
            "Can Milotic win without contesting speed?",
          ],
        },
        roles: [
          {
            slug: "raichu",
            macro: "Fast closure",
            micro: "Use Encore or No Guard offense once the slow mode draws defensive actions.",
          },
          {
            slug: "farigiraf",
            macro: "Rule setter",
            micro: "Choose between Room, priority denial, and recovery denial.",
          },
          {
            slug: "milotic",
            macro: "Speed-independent closer",
            micro: "Coil once the opponent's exits are narrowed.",
          },
          {
            slug: "golisopod",
            macro: "Slow breaker",
            micro: "Force the opponent to respect the opposite speed extreme.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "farigiraf",
            "golisopod",
          ],
          leadWhy: "The pair immediately presents the opponent with the possibility of Room plus a slow physical threat while Armor Tail constrains priority.",
          backPair: [
            "raichu",
            "milotic",
          ],
          backJobs: [
            {
              slug: "raichu",
              job: "Punish the fast or defensive adaptation with No Guard offense and Encore.",
            },
            {
              slug: "milotic",
              job: "Take the game if both players slow down and begin trading resources.",
            },
          ],
          pairEdges: [
            {
              from: "farigiraf",
              to: "golisopod",
              creates: "Trick Room threat",
              converts: "Slow physical pressure",
            },
            {
              from: "farigiraf",
              to: "raichu",
              creates: "Priority denial",
              converts: "Fast No Guard offense",
            },
            {
              from: "milotic",
              to: "golisopod",
              creates: "Sleep pressure",
              converts: "Swords Dance window",
            },
          ],
          turn1: "Force the opponent to respect Trick Room without committing to it unless the resulting slow state is genuinely favorable.",
          bringInTriggers: [
            "Opponent Protects or plays passively around the slow threat → bring Raichu for Encore.",
            "Opponent settles into an attrition game → bring Milotic.",
          ],
        },
        defaultLeadPair: [
          "farigiraf",
          "golisopod",
        ],
        backPair: [
          "raichu",
          "milotic",
        ],
        identityCard: {
          engine: [
            "farigiraf",
          ],
          connector: [
            "farigiraf",
            "raichu",
          ],
          converter: [
            "raichu",
            "golisopod",
          ],
          scaler: [
            "milotic",
            "golisopod",
          ],
          control: [
            "raichu",
            "farigiraf",
            "milotic",
          ],
          winCondition: "Remove the opponent's clean escape routes until one of three very different clocks becomes unavoidable.",
          clock: "Fast + slow + speed-independent",
          commitment: "Medium",
          autonomy: "Very high",
          triggerBreadth: "Speed, priority, recovery, Protect, stat drops, or inactivity.",
        },
        pilotDecision: {
          chooseWhen: [
            "Opponent depends on Protect cycles.",
            "Recovery is central to their long game.",
            "Priority is central to their cleanup.",
            "Their speed mode is identifiable.",
          ],
          avoidWhen: [
            "Immediate raw offense matters more than layered control and neither Farigiraf nor Milotic can survive.",
          ],
          previewQuestion: "What is their escape route once my first threat is answered?",
          primaryMistake: "Trying to use every closure tool in one game rather than identifying the two that matter.",
        },
        engineIds: [
          "room-break",
          "mega-raichu",
          "coil-lock",
        ],
        winRouteIds: [
          "room-break",
          "mega-raichu",
          "coil-lock",
        ],
        endgameIds: [
          "goli-room",
          "raichu-fast",
          "milotic-lock",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "room",
                when: "Their speed is the main advantage",
                then: "Invert it.",
              },
              {
                id: "noise",
                when: "Recovery is the main escape",
                then: "Use Psychic Noise without committing to Room.",
              },
              {
                id: "raichu-back",
                when: "They overadapt to the slow mode",
                then: "Transition to the fast backline.",
              },
            ],
          },
        ],
        loops: [
          {
            id: "r4-close-recovery",
            type: "counterplay",
            title: "Close Recovery",
            body: "When the opponent plans to stabilize through healing, Farigiraf uses Psychic Noise while Golisopod or Milotic continues applying pressure. Do not waste the denial turn on low-value damage. End with their long-game resource removed while your own scaler remains active.",
          },
          {
            id: "r4-protect-encore",
            type: "counterplay",
            title: "Protect Becomes a Trap",
            body: "When the opponent Protects to wait out Trick Room, sleep, or Golisopod pressure, transition Raichu onto the field if safe. Encore the passive action or use No Guard offense into the exposed partner. End with the defensive turn becoming another constrained state instead of a reset.",
          },
          {
            id: "r4-opposite-speed",
            type: "conversion",
            title: "Opposite-Speed Second Wave",
            body: "When the opponent adapts heavily to Golisopod and Trick Room, bring Raichu from the back rather than extending the slow mode. Mega only if Lightning Rod has completed its job, then pressure from the opposite speed extreme. End with the opponent's slow-mode preparation becoming a fast-mode liability.",
          },
        ],
        victims: [
          {
            name: "Structured balance with predictable defensive exits",
            why: "The package can attack speed, healing, priority, and Protect on separate axes.",
            play: "Identify which exit matters first.",
            trap: "Using the correct closure tool at the wrong time.",
          },
        ],
        counters: [
          {
            name: "Immediate mixed burst with minimal setup or recovery dependence",
            why: "It gives the closure tools fewer strategic exits to punish.",
            play: "Simplify and attack; do not overbuild the control state.",
            trap: "Trying to manufacture a long game the opponent is not offering.",
          },
        ],
        advantages: [
          {
            title: "Counterplay closure",
            body: "The package does not merely create threats; it attacks the opponent's normal ways of escaping those threats.",
          },
        ],
        hazards: [
          {
            title: "Tool overload",
            body: "You do not need Trick Room, Psychic Noise, Encore, Coil, and Swords Dance every game. Select the closure tools the matchup actually requires.",
          },
        ],
      },
      {
        id: "r4-coil-position",
        label: "Coil Position",
        when: "Bring this when the opponent's main plan is physical pressure, Intimidate cycling, or a slower positional game.",
        identity: "Double Fake Out and Intimidate manufacture the Milotic control state while Golisopod supplies the physical endgame.",
        slugs: [
          "rillaboom",
          "incineroar",
          "milotic",
          "golisopod",
        ],
        strategy: {
          opponentPattern: "Physical balance or positional grind.",
          bring: [
            "rillaboom",
            "incineroar",
            "milotic",
            "golisopod",
          ],
          purpose: "Turn positional turns into a durable Milotic or Golisopod endgame.",
          targets: [
            "Physical offense",
            "Intimidate cycling",
            "Slow positional teams",
          ],
          refuses: [
            "Tempo with no conversion",
            "Raw Hypnosis before a safer Coil line",
          ],
          winCondition: "Establish Milotic control, then use Golisopod as the physical threat that benefits from the forced responses.",
          gamePlan: "Fake Out/Intimidate → Coil → sleep or Muddy Water → Golisopod second wave.",
          mantra: "Every denied action must buy something permanent.",
          turnChecklist: [
            "Which Fake Out buys the best state?",
            "Can Milotic Coil?",
            "Will Parting Shot improve the next entry?",
            "Is Golisopod ready to punish the stabilized board?",
          ],
        },
        roles: [
          {
            slug: "rillaboom",
            macro: "First setup access",
            micro: "Fake Out once, then threaten Life Orb damage.",
          },
          {
            slug: "incineroar",
            macro: "Reset engine",
            micro: "Enter when Intimidate or Parting Shot creates the next control turn.",
          },
          {
            slug: "milotic",
            macro: "Primary control scaler",
            micro: "Coil before Hypnosis whenever the board permits.",
          },
          {
            slug: "golisopod",
            macro: "Physical second wave",
            micro: "Exploit sleep, lowered damage, or forced switches.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "rillaboom",
            "milotic",
          ],
          leadWhy: "Fake Out plus Grassy recovery gives Milotic one of its cleanest Coil-access patterns.",
          backPair: [
            "incineroar",
            "golisopod",
          ],
          backJobs: [
            {
              slug: "incineroar",
              job: "Reset physical pressure and create another protected turn.",
            },
            {
              slug: "golisopod",
              job: "Enter once Milotic has forced passive or sleeping turns and convert physically.",
            },
          ],
          pairEdges: [
            {
              from: "rillaboom",
              to: "milotic",
              creates: "Fake Out plus recovery",
              converts: "Safer Coil",
            },
            {
              from: "incineroar",
              to: "milotic",
              creates: "Intimidate plus reset",
              converts: "Longer control state",
            },
            {
              from: "milotic",
              to: "golisopod",
              creates: "Sleep pressure",
              converts: "Physical setup window",
            },
          ],
          turn1: "Fake Out the action that most threatens Milotic and Coil only when the second slot cannot punish the setup.",
          bringInTriggers: [
            "Physical pressure increases → Incineroar.",
            "Opponent becomes passive, asleep, or forced to switch → Golisopod.",
          ],
        },
        defaultLeadPair: [
          "rillaboom",
          "milotic",
        ],
        backPair: [
          "incineroar",
          "golisopod",
        ],
        identityCard: {
          engine: [
            "rillaboom",
            "incineroar",
          ],
          connector: [
            "rillaboom",
            "incineroar",
          ],
          converter: [
            "golisopod",
          ],
          scaler: [
            "milotic",
            "golisopod",
          ],
          control: [
            "incineroar",
            "milotic",
          ],
          winCondition: "Use positional infrastructure to generate one stable scaler, then let the other become the closing threat.",
          clock: "Tempo into control",
          commitment: "Medium",
          autonomy: "High",
          triggerBreadth: "Fake Out, Intimidate, Competitive, Coil, Swords Dance, or priority.",
        },
        pilotDecision: {
          chooseWhen: [
            "Opponent is physical-heavy.",
            "Stat drops are likely.",
            "The game can be slowed safely.",
          ],
          avoidWhen: [
            "Opponent has overwhelming special burst and no need to interact with Intimidate.",
          ],
          previewQuestion: "Can I reliably manufacture the first Coil without giving up too much damage?",
          primaryMistake: "Using both Fake Outs for short-term denial without converting either into a lasting state.",
        },
        engineIds: [
          "coil-lock",
          "position-loop",
        ],
        winRouteIds: [
          "coil-lock",
        ],
        endgameIds: [
          "milotic-lock",
          "goli-room",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "coil",
                when: "Fake Out genuinely protects Milotic",
                then: "Coil.",
              },
              {
                id: "attack",
                when: "The second opposing slot still threatens too much",
                then: "Use immediate Muddy Water or Rillaboom damage.",
              },
            ],
          },
        ],
        loops: [
          {
            id: "r4-coil-entry",
            type: "scaling",
            title: "Buy the Coil",
            body: "When one opposing action can be denied safely, Rillaboom uses Fake Out and Milotic uses Coil. On following turns, use Hypnosis or Muddy Water according to whether denying one action or pressuring both slots matters more. End with Milotic controlling the board rather than merely gambling on sleep.",
          },
          {
            id: "r4-goli-second",
            type: "conversion",
            title: "Sleep into Golisopod",
            body: "When Milotic has forced sleep, Protect, or a defensive switch, bring Golisopod into the reduced-action state. Use Swords Dance only if the remaining active threat cannot punish it; otherwise convert immediately with Leech Life. End with a physical threat occupying the turns Milotic created.",
          },
        ],
        victims: [
          {
            name: "Physical positional teams",
            why: "Intimidate, Competitive, Coil, and Grassy recovery all make their normal control pattern awkward.",
            play: "Convert the first quiet turn into a permanent Milotic state.",
            trap: "Using support turns without gaining lasting value.",
          },
        ],
        counters: [
          {
            name: "Immediate special burst",
            why: "Can deny the setup-access premise before Coil begins compounding.",
            play: "Attack immediately or choose the Farigiraf/Raichu package.",
            trap: "Trying to force a long game into a board that will not permit one.",
          },
        ],
        advantages: [
          {
            title: "Failure inversion",
            body: "Stat drops aimed at the physical half can accelerate Milotic instead.",
          },
        ],
        hazards: [
          {
            title: "Support saturation",
            body: "Rillaboom and Incineroar must convert their control into Milotic or Golisopod progress; denial alone is not a win condition.",
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
        title: "Fake Out to Room",
        body: "When the opponent's speed advantage is the main problem, Incineroar uses Fake Out while Farigiraf establishes Trick Room. Bring Golisopod into the resulting slow state and choose Swords Dance only if the opponent cannot punish the setup. End with Golisopod converting Room while Armor Tail constrains priority.",
      },
      {
        title: "Milotic Backstop",
        body: "When the opponent adapts to Golisopod with Intimidate, defensive positioning, or concentrated physical control, bring Milotic rather than forcing the slow breaker. Use Coil if the board is quiet or cash Competitive immediately if triggered. End with the opponent facing a special/control clock instead of the physical one they prepared for.",
      },
      {
        title: "Lightning Rod to No Guard",
        body: "When Electric protection matters, keep Raichu non-Mega while Rillaboom controls one opposing action. Once the Electric threat or target pattern changes, Mega evolve and convert with Zap Cannon or Focus Blast. End with the opponent forced into Protect or repositioning that Encore can punish.",
      },
    ],
    hazards: [
      {
        title: "Dual-Mega collision",
        body: "Raichu and Golisopod both carry Mega stones; choosing one necessarily leaves the other stone inactive.",
      },
      {
        title: "Overusing Trick Room",
        body: "The team is dual-speed, not hard Trick Room. Farigiraf remains useful without setting it.",
      },
      {
        title: "Raw Hypnosis temptation",
        body: "Milotic's cleanest plan is usually to manufacture Coil first when the board permits.",
      },
    ],
    victims: [
      {
        name: "Single-speed teams",
        why: "Farigiraf can invert speed while Raichu and Golisopod occupy opposite extremes.",
      },
      {
        name: "Priority-dependent endgames",
        why: "Armor Tail changes a major opponent conversion rule.",
      },
      {
        name: "Intimidate-heavy physical control",
        why: "Competitive Milotic can turn that answer into a resource.",
      },
      {
        name: "Recovery-dependent balance",
        why: "Psychic Noise attacks the opponent's long-game exit.",
      },
    ],
    counters: [
      {
        name: "Immediate mixed burst",
        why: "Can reduce the time available for Trick Room, Coil, and Swords Dance before the closure tools begin compounding.",
      },
      {
        name: "Naturally slow offense",
        why: "Can make Trick Room neutral or actively favorable for the opponent.",
      },
    ],
    advantages: [
      {
        title: "Counterplay closure",
        body: "Speed, priority, recovery, Protect, and stat-control exits are attacked by different members.",
      },
      {
        title: "Three speed philosophies",
        body: "Raichu plays fast, Golisopod plays slow, and Milotic can largely ignore the speed race.",
      },
      {
        title: "Tournament proof",
        body: "The exact six and exact published moves/items/natures finished second at Maddo's Cup #12. ([PokeSynergy][3])",
      },
    ],
    coreArchitecture: {
      identity: "A counterplay-closure balance team that can play fast, slow, or speed-independent control while denying priority, recovery, passive Protect lines, and stat-drop counterplay.",
      primaryEngine: "Farigiraf decides whether speed should be inverted while Rillaboom and Incineroar manufacture setup turns.",
      conversionModel: "Golisopod converts slow states, Raichu converts Mega timing into No Guard burst, and Milotic converts quiet turns or stat drops into control.",
      scalingModel: "Golisopod uses Swords Dance; Milotic uses Coil; Raichu changes offensive state through Mega evolution.",
      controlModel: "Armor Tail, Psychic Noise, Encore, Fake Out, Intimidate, Parting Shot, Hypnosis, and Competitive close common escape routes.",
      speedModel: "Raichu occupies the fast extreme, Golisopod the slow extreme, Farigiraf flips the board, and Milotic can ignore the race.",
      resourceModel: "Priority access, Trick Room turns, Grassy recovery, Leftovers, Fake Out turns, and Mega timing are intentionally separate resources.",
      threatProfile: [
        "Fast No Guard burst",
        "Slow Swords Dance conversion",
        "Coil/Hypnosis control",
        "Priority asymmetry",
        "Recovery denial",
        "Encore punishment",
      ],
    },
    architecture: [
      {
        title: "Engine",
        body: "Farigiraf controls speed and priority, Rillaboom/Incineroar manufacture turns, and Raichu changes from Lightning Rod infrastructure into No Guard offense.",
      },
      {
        title: "Converter",
        body: "Golisopod converts Trick Room into slow physical pressure, Milotic converts quiet turns or stat drops into control, and Raichu converts Mega timing into perfectly accurate burst.",
      },
      {
        title: "Endgame",
        body: "Close through Swords Dance Golisopod, Coil Milotic, or Mega Raichu once speed, priority, recovery, or Protect counterplay has been constrained.",
      },
    ],
    clocks: [
      {
        id: "fast-raichu",
        owner: [
          "raichu",
        ],
        speed: "immediate",
        goal: "Use Mega No Guard offense and Encore before the opponent establishes control.",
      },
      {
        id: "room-golisopod",
        owner: [
          "farigiraf",
          "golisopod",
        ],
        speed: "room",
        goal: "Invert faster opponents and convert with Swords Dance or Leech Life.",
      },
      {
        id: "milotic-control",
        owner: [
          "milotic",
        ],
        speed: "scaling",
        goal: "Step outside the speed war and control actions through Coil/Hypnosis.",
      },
      {
        id: "position-loop",
        owner: [
          "incineroar",
          "rillaboom",
        ],
        speed: "tempo",
        goal: "Repeatedly manufacture low-cost setup and entry turns.",
      },
    ],
    winRoutes: [
      {
        id: "room-break",
        name: "Room into Golisopod",
        requires: [
          "farigiraf",
          "golisopod",
        ],
        sequence: [
          "Farigiraf establishes or threatens Trick Room.",
          "Armor Tail removes opposing priority as an escape.",
          "Golisopod uses Swords Dance or immediate Leech Life.",
          "Psychic Noise prevents recovery-based stabilization.",
          "Golisopod or the fast backline closes.",
        ],
        finish: "The opponent is trapped between a slow physical threat and reduced recovery/priority options.",
        failurePoint: "Trick Room helps the opponent more than Golisopod or Farigiraf cannot establish the state.",
        dependencies: [
          {
            slug: "farigiraf",
            importance: "critical",
          },
          {
            slug: "golisopod",
            importance: "critical",
          },
        ],
      },
      {
        id: "mega-raichu",
        name: "Lightning Rod to No Guard",
        requires: [
          "raichu",
        ],
        sequence: [
          "Keep Raichu non-Mega while Lightning Rod protects the board if needed.",
          "Mega evolve when offensive conversion becomes more valuable.",
          "Use accurate Zap Cannon or Focus Blast to force damage.",
          "Use Encore when the opponent escapes through Protect or setup.",
          "Preserve Raichu or hand the board to the alternate slow/control route.",
        ],
        finish: "Raichu either closes directly or forces the defensive action another teammate exploits.",
        failurePoint: "Mega evolution is spent too early and Lightning Rod was still strategically necessary.",
        dependencies: [
          {
            slug: "raichu",
            importance: "critical",
          },
        ],
      },
      {
        id: "coil-lock",
        name: "Coil Lock",
        requires: [
          "milotic",
        ],
        sequence: [
          "Rillaboom or Incineroar manufactures a quiet turn.",
          "Milotic uses Coil.",
          "Hypnosis removes an action lane.",
          "Muddy Water degrades both HP and accuracy.",
          "Partners convert while Milotic preserves itself.",
        ],
        finish: "The opponent has fewer reliable actions and fewer safe ways to wait.",
        failurePoint: "Immediate burst removes Milotic before the first Coil.",
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
            slug: "incineroar",
            importance: "supportive",
          },
        ],
      },
    ],
    failureRoutes: [
      {
        failedRoute: "room-break",
        why: "Trick Room is denied or would favor the opponent.",
        fallback: "Keep Farigiraf for Armor Tail/Psychic Noise and pivot to Raichu or Milotic.",
        nextRoute: "mega-raichu",
      },
      {
        failedRoute: "mega-raichu",
        why: "Fast offense is checked or Mega Raichu is removed.",
        fallback: "Invert speed through Farigiraf or abandon speed competition through Milotic.",
        nextRoute: "coil-lock",
      },
      {
        failedRoute: "coil-lock",
        why: "Milotic cannot safely establish Coil.",
        fallback: "Use immediate Muddy Water and positional Fake Out while Golisopod or Raichu becomes the closer.",
        nextRoute: "room-break",
      },
    ],
    construction: {
      thesis: "Build around failure inversion and counterplay closure rather than one preferred speed state.",
      method: "Pair fast, slow, and speed-independent clocks with tools that attack priority, recovery, Protect, and stat control.",
      winCondition: "Force the opponent to commit to one escape route, then use the teammate that specifically closes that exit.",
      endgames: [
        {
          id: "goli-room",
          label: "Golisopod Room",
          path: "Establish favorable Trick Room, deny priority, and preserve Golisopod through setup or Leech Life.",
          how: "Golisopod closes while the opponent lacks reliable speed or priority escape.",
        },
        {
          id: "raichu-fast",
          label: "Mega Raichu Fast",
          path: "Retain Lightning Rod until it is no longer needed, then Mega evolve and exploit No Guard.",
          how: "Accurate Zap Cannon/Focus Blast plus Encore creates the fast endgame.",
        },
        {
          id: "milotic-lock",
          label: "Milotic Lock",
          path: "Create one Coil and preserve Milotic through Leftovers, terrain, and denied actions.",
          how: "Hypnosis and Muddy Water progressively reduce opponent action quality.",
        },
      ],
      altSlots: [],
    },
    engines: [
      {
        id: "room-break",
        label: "Trick Room Golisopod",
        path: [
          "Incineroar or Farigiraf · stabilize the opening",
          "Farigiraf · Trick Room",
          "Golisopod · Swords Dance or immediate Leech Life",
          "Farigiraf · Psychic Noise to close recovery",
          "Golisopod · convert the remaining Room turns",
        ],
        how: "This engine exists to punish opponents who optimize heavily for moving first. Farigiraf changes the speed state while Armor Tail makes opposing priority a less reliable escape. Golisopod converts the slower board through immediate damage or Swords Dance, and Psychic Noise can deny recovery-based stabilization. Press the engine only when Trick Room is genuinely favorable; the team does not require Room every game. If Room is denied or would help the opponent, preserve Farigiraf's other control functions and use Raichu or Milotic instead.",
        dependsOn: "Trick Room must favor Golisopod more than the opposing board.",
        disrupt: "Taunt-like denial, immediate Farigiraf removal, or opposing slow attackers that benefit from Room.",
        fallback: "Use Armor Tail/Psychic Noise without Room and transition to Raichu or Coil Milotic.",
      },
      {
        id: "mega-raichu",
        label: "Mega State Transition",
        path: [
          "Raichu · remain Lightning Rod if Electric protection matters",
          "Partner · establish favorable positioning",
          "Raichu · Mega evolve when offense matters more",
          "Mega Raichu · Zap Cannon or Focus Blast",
          "Mega Raichu · Encore defensive counterplay when available",
        ],
        how: "Raichu is valuable because Mega evolution changes its strategic function rather than simply increasing stats. Before Mega, Lightning Rod protects partners and can discourage Electric targeting. After Mega, No Guard converts Zap Cannon and Focus Blast into reliable attacks and makes fast Encore a powerful closure tool. Press the transition when the board no longer needs Lightning Rod or when immediate burst will create more value. If Mega Raichu is a poor fit, preserve the Mega resource for Golisopod.",
        dependsOn: "The pilot must correctly judge whether Lightning Rod or No Guard is more valuable in the current state.",
        disrupt: "Premature Mega evolution, strong special answers, or losing Raichu before the transition matters.",
        fallback: "Use Golisopod as the Mega and shift toward Trick Room or Milotic control.",
      },
      {
        id: "coil-lock",
        label: "Coil Hypnosis",
        path: [
          "Rillaboom or Incineroar · buy one quieter turn",
          "Milotic · Coil",
          "Milotic · Hypnosis the highest-value action",
          "Partner · convert the lost opponent turn",
          "Milotic · Muddy Water or Protect to retain control",
        ],
        how: "Milotic is the architecture's speed-independent mode. Fake Out, Intimidate, Parting Shot, or Grassy recovery can manufacture the initial Coil turn. Coil improves Defense and accuracy, allowing Hypnosis and Muddy Water to become progressively more reliable. Competitive means opposing stat control may accelerate the same slot instead of containing the team. If the opponent never allows setup, Milotic still contributes Muddy Water pressure while another clock becomes primary.",
        dependsOn: "Milotic must receive one low-cost turn without being immediately overwhelmed.",
        disrupt: "Focused burst before Coil or relentless double targeting.",
        fallback: "Skip setup, use Muddy Water immediately, and move the win condition to Raichu or Golisopod.",
      },
      {
        id: "position-loop",
        label: "Double Positional Infrastructure",
        path: [
          "Rillaboom or Incineroar · Fake Out",
          "Partner · Trick Room, Coil, Swords Dance, or attack",
          "Incineroar · Parting Shot when the board asks for reset",
          "Rillaboom · terrain and priority convert the second wave",
          "Win condition · take the preserved board",
        ],
        how: "Rillaboom and Incineroar provide overlapping Fake Out access but convert that overlap into different second-wave states. Incineroar adds Intimidate and Parting Shot, while Rillaboom adds terrain, healing, and priority damage. Use the pair to manufacture setup only when the setup creates more future value than immediate offense. The engine is vulnerable to priority denial, but Farigiraf can alter that axis and the team does not require Fake Out to function. When Fake Out is unavailable, use direct damage or the speed/control engines instead.",
        dependsOn: "At least one opposing slot must be meaningfully constrained by Fake Out or the positional threat it represents.",
        disrupt: "Psychic Terrain, Armor Tail-style denial from the opponent, Ghost interactions, or Protect-heavy scouting.",
        fallback: "Use Farigiraf, Raichu, or immediate offense rather than forcing Fake Out.",
      },
    ],
    network: {
      thesis: "Every major counterplay axis is either inverted, denied, or converted into a different clock.",
      edges: [
        {
          from: "farigiraf",
          to: "golisopod",
          creates: "Trick Room",
          converts: "Slow physical pressure",
          engineId: "room-break",
        },
        {
          from: "farigiraf",
          to: "golisopod",
          creates: "Priority denial",
          converts: "Safer slow turns",
          engineId: "room-break",
        },
        {
          from: "incineroar",
          to: "milotic",
          creates: "Reduced physical pressure",
          converts: "Safer Coil",
          engineId: "coil-lock",
        },
        {
          from: "rillaboom",
          to: "milotic",
          creates: "Fake Out plus recovery",
          converts: "Coil control",
          engineId: "coil-lock",
        },
        {
          from: "incineroar",
          to: "farigiraf",
          creates: "Fake Out free turn",
          converts: "Trick Room",
          engineId: "position-loop",
        },
        {
          from: "rillaboom",
          to: "golisopod",
          creates: "Fake Out free turn",
          converts: "Swords Dance",
          engineId: "position-loop",
        },
        {
          from: "raichu",
          to: "golisopod",
          creates: "Electric protection",
          converts: "Safer Mega pressure",
          engineId: "mega-raichu",
        },
        {
          from: "farigiraf",
          to: "raichu",
          creates: "Priority denial",
          converts: "Fast No Guard offense",
          engineId: "mega-raichu",
        },
        {
          from: "milotic",
          to: "golisopod",
          creates: "Sleep pressure",
          converts: "Swords Dance window",
          engineId: "coil-lock",
        },
      ],
    },
    commandments: [
      "Trick Room is an option, not an obligation.",
      "Delay Mega Raichu when Lightning Rod still protects the board.",
      "A safe Coil is worth more than a desperate raw Hypnosis.",
      "Use Psychic Noise and Encore to close exits, not merely deal damage.",
      "If the opponent answers one speed mode, switch states rather than fighting on the same axis.",
    ],
    controlPlanes: [
      {
        id: "trick-room",
        label: "Trick Room",
        setterSlug: "farigiraf",
        effect: "Trick Room",
        whoBenefits: "Golisopod and slow converters",
      },
      {
        id: "armor-tail",
        label: "Armor Tail",
        setterSlug: "farigiraf",
        effect: "Armor Tail",
        whoBenefits: "Priority denial",
      },
      {
        id: "psychic-noise",
        label: "Psychic Noise",
        setterSlug: "farigiraf",
        effect: "Psychic Noise",
        whoBenefits: "Recovery denial",
      },
      {
        id: "encore",
        label: "Encore",
        setterSlug: "incineroar",
        effect: "Encore",
        whoBenefits: "Locking passive or setup turns",
      },
      {
        id: "fake-out",
        label: "Fake Out",
        setterSlug: "rillaboom",
        effect: "Fake Out",
        whoBenefits: "Partners needing a free turn",
      },
      {
        id: "intimidate",
        label: "Intimidate",
        setterSlug: "salamence",
        effect: "Intimidate",
        whoBenefits: "Physical defense and Milotic Competitive",
      },
      {
        id: "parting-shot",
        label: "Parting Shot",
        setterSlug: "incineroar",
        effect: "Parting Shot",
        whoBenefits: "Pivot control",
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
        id: "grassy-terrain",
        label: "Grassy Terrain",
        setterSlug: "rillaboom",
        effect: "Grassy Terrain",
        whoBenefits: "Recovery and Grassy Glide",
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
          slug: "raichu",
          stone: "Raichunite Y",
          when: "Use when No Guard burst and Encore are more valuable than retaining Lightning Rod or Mega Golisopod.",
        },
        {
          slug: "golisopod",
          stone: "Golisopite",
          when: "Use when the slow physical mode is the central win condition.",
        },
      ],
    },
    matchupScripts: [
      {
        id: "script-1",
        foe: "Fast offense with limited slow-mode answers",
        why: "Fast offense with limited slow-mode answers",
        packId: "r4-room-break",
        sequence: {
          beats: [
            {
              click: "Fast offense with limited slow-mode answers",
            },
          ],
        },
      },
      {
        id: "script-2",
        foe: "Bulky balance relying on recovery and Protect",
        why: "Bulky balance relying on recovery and Protect",
        packId: "r4-closure",
        sequence: {
          beats: [
            {
              click: "Bulky balance relying on recovery and Protect",
            },
          ],
        },
      },
      {
        id: "script-3",
        foe: "Electric pressure plus moderate speed",
        why: "Electric pressure plus moderate speed",
        packId: "r4-fast-control",
        sequence: {
          beats: [
            {
              click: "Electric pressure plus moderate speed",
            },
          ],
        },
      },
      {
        id: "script-4",
        foe: "Physical offense with Intimidate interactions",
        why: "Physical offense with Intimidate interactions",
        packId: "r4-coil-position",
        sequence: {
          beats: [
            {
              click: "Physical offense with Intimidate interactions",
            },
          ],
        },
      },
    ],
    evidence: {
      season: "Regulation M-C",
      asOf: "2026-09-22",
      source: "The exact R4 roster, items, abilities, natures, and moves are taken from shaikhvgc786's #2 Maddo's Cup #12 team sheet. ([PokeSynergy][3]) Milotic's current tournament profile independently shows Leftovers, Coil, Farigiraf, Mega Golisopod, Rillaboom, and Incineroar as real current M-C usage patterns. ([PokeSynergy][4])",
      caveat: "Package plans and SP allocations are our recommended pilot architecture, not claimed to be the original player's exact training or matchup scripts. Authored to the attached Ringside Doubles TeamManual requirements, including bring-four packages, fieldPlan, network, engines, loops, full kits, and recommended Champions SP. ",
    },
  } satisfies TeamManual;
