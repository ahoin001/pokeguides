import { train } from "@/content/manual-train";
import type { TeamManual } from "@/content/manuals";

export const R2_MIXED_AUTONOMOUS_SAND_MANUAL = {
    id: "r2-mixed-autonomous-sand-manual",
    title: "R2 — Mixed Autonomous Sand",
    lede: "Sand is the threat you see first. The real team is a network of independent clocks that can keep winning after Sand stops mattering.",
    format: "doubles",
    philosophy: "R2 is built around a simple idea: never make one piece of infrastructure responsible for the whole team. Sand can create overwhelming speed for Excadrill, but Salamence, Rillaboom, Gholdengo, and Milotic can form a complete second team without it. The pilot's job is not to force Sand every game. It is to identify which resource the opponent has the hardest time stopping, create that resource cheaply, and hand the resulting turn to the teammate that converts it best.",
    archetype: "balance",
    family: "weather",
    meta: "Regulation M-C Pokémon Champions doubles. This manual treats Coil / Hypnosis / Muddy Water / Protect Milotic as the default R2 control-scaler. Nature, item, and Champions SP recommendations below are starting points for this architecture, not claimed tournament-optimized damage or speed benchmarks.",
    setsNote: "Starting architecture spend (66 SP, max 32). Recommended configuration — not claimed as mathematically optimal vs every M-C threshold.",
    pilot: {
      thesis: "Do not ask, 'How do I make Sand work?' Ask, 'Which of my clocks becomes easiest to activate when they respect Sand?'",
      rule: "R2 looks like a Sand team, but you should think of it as several smaller teams sharing the same six Pokémon. Sometimes Tyranitar and Excadrill are the stars. Sometimes they are distractions that make Gholdengo or Milotic easier to set up. A good R2 player changes plans before the opponent's answer becomes useful.",
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
        literacy: "wallbreaker",
        primaryJob: "Create Sand at the moment Sand changes the board, then make the opponent pay for respecting Excadrill.",
        role: "Weather root, physical breaker, Rock pressure, and preview anchor.",
        item: "Tyranitarite",
        ability: "Sand Stream",
        nature: "Adamant",
        moves: [
          {
            name: "Rock Slide",
            why: "Spread Rock pressure that converts Sand turns and punishes Flying threats such as Salamence.",
          },
          {
            name: "Knock Off",
            why: "Strong Dark pressure that also attacks the opponent's resource economy by removing items.",
          },
          {
            name: "Low Kick",
            why: "Coverage for heavy Steel, Rock, and opposing Tyranitar-style targets that resist the primary STABs.",
          },
          {
            name: "Protect",
            why: "Preserves the weather setter and lets Excadrill or another partner exploit the opponent's focus.",
          },
        ],
        objective: "Do not spend Tyranitar like a disposable attacker when its future Sand switch is worth more than its current damage.",
        howToPlay: "Against neutral teams, Tyranitar can begin the damage race. Against Rain or weather-dependent teams, often keep it back so its entrance deletes the opponent's infrastructure at the moment they need it most.",
        training: train(2, 32, 0, 0, 0, 32, {
            "label": "Adamant offensive Sand root",
            "why": "Recommended starting spread: maximize immediate physical conversion while keeping strong natural bulk. Exact speed benchmarks should be adjusted after matchup testing.",
            "spend": [
              "2 HP",
              "32 Atk",
              "32 Spe"
            ],
            "rule": "66 SP max, 32 per stat; recommended starting spread, not claimed damage-calced optimal."
          }),
        networkJobs: {
          creates: "Sand; Weather replacement; Rock / Dark targeting pressure",
          converts: "Forced weather switches; Excadrill-created Protect turns",
          protects: "Excadrill speed state; Rain matchup structure",
          scales: "Mega transformation",
        },
        abilityStages: {
          before: "Pre-Mega Sand Stream establishes weather.",
          after: "Mega timing adds raw combat power while preserving the team's Sand identity.",
          when: "Mega timing adds raw combat power while preserving the team's Sand identity.",
        },
        ampTargets: [
          {
            slug: "Excadrill Sand Rush",
            becomes: "Amp target",
          },
          {
            slug: "Weather denial",
            becomes: "Amp target",
          },
          {
            slug: "Flying-type Rock pressure",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "Mega only when the extra Tyranitar stats matter more than preserving Salamence as the possible Mega choice.",
            },
          ],
        },
        gives: [
          "Sand Rush activation",
          "Weather control",
          "Flying pressure",
          "Item removal",
        ],
        answers: [
          "Rain infrastructure",
          "Flying Dragons",
          "Special attackers that struggle into Tyranitar's natural special bulk",
        ],
      },
      {
        slug: "excadrill",
        title: "Excadrill",
        job: "speed",
        literacy: "sweeper",
        primaryJob: "Turn Tyranitar's weather into immediate action advantage before the opponent can stabilize.",
        role: "Sand converter, Steel attacker, Ground breaker, and immediate tempo clock.",
        item: "Focus Sash",
        ability: "Sand Rush",
        nature: "Jolly",
        moves: [
          {
            name: "High Horsepower",
            why: "Primary single-target Ground conversion without relying on spread Ground damage that conflicts with partners.",
          },
          {
            name: "Iron Head",
            why: "Steel pressure for Ice- and Fairy-type targets and an important direct answer to Baxcalibur-style Dragons.",
          },
          {
            name: "Rock Slide",
            why: "Fast spread pressure under Sand that complements Tyranitar's targeting and punishes Flying targets.",
          },
          {
            name: "Protect",
            why: "Lets Sand turns, partner pressure, and opponent targeting create safer follow-up attacks.",
          },
        ],
        objective: "Make every Sand turn expensive for the opponent.",
        howToPlay: "Excadrill should rarely spend its strongest speed turns making low-value attacks. Ask which target must disappear before Sand ends. If physical denial becomes excessive, Excadrill has already done part of its job by pulling answers away from Gholdengo and Milotic.",
        training: train(2, 32, 0, 0, 0, 32, {
            "label": "Jolly max Attack / Speed",
            "why": "Recommended starting spread because Excadrill's architectural job is immediate conversion. Specific speed benchmarks should be tested rather than assumed.",
            "spend": [
              "2 HP",
              "32 Atk",
              "32 Spe"
            ],
            "rule": "66 SP max, 32 per stat; recommended starting spread."
          }),
        networkJobs: {
          creates: "Immediate physical pressure; Forced Protects; Forced Ground immunities",
          converts: "Sand; Tailwind; Weather denial",
          protects: "Gholdengo by drawing physical answers; Tyranitar by removing Steel threats",
          scales: "Not primarily a scaler; its value spikes through external speed infrastructure",
        },
        ampTargets: [
          {
            slug: "Sand Rush",
            becomes: "Amp target",
          },
          {
            slug: "Tailwind",
            becomes: "Amp target",
          },
          {
            slug: "Fake Out turns",
            becomes: "Amp target",
          },
          {
            slug: "Opponent weather reset turns",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "Focus Sash supports one guaranteed conversion attempt when healthy; avoid wasting it on incidental chip when the matchup requires Excadrill to survive a decisive hit.",
            },
          ],
        },
        gives: [
          "Fast Ground pressure",
          "Steel pressure",
          "Spread Rock pressure",
          "Physical response tax",
        ],
        answers: [
          "Baxcalibur-style Ice Dragons",
          "Steel targets weak to Ground",
          "Fast neutral boards under Sand",
        ],
      },
      {
        slug: "salamence",
        title: "Salamence",
        job: "mega",
        literacy: "pivot",
        primaryJob: "Change the terms of the battle without committing the six to one engine.",
        role: "Universal bridge: Intimidate, Tailwind, Dragon execution, Ground immunity, and alternate Mega.",
        item: "Salamencite",
        ability: "Intimidate",
        nature: "Modest",
        moves: [
          {
            name: "Hyper Voice",
            why: "Reliable spread special pressure that gives R2 a damage axis unaffected by Intimidate.",
          },
          {
            name: "Draco Meteor",
            why: "Critical immediate Dragon punishment that lets Milotic keep Coil / Hypnosis instead of carrying Ice coverage.",
          },
          {
            name: "Tailwind",
            why: "Creates a second speed engine so the team is not dependent on Sand Rush.",
          },
          {
            name: "Protect",
            why: "Preserves the bridge while the partner exploits Intimidate or the opponent overtargets Salamence.",
          },
        ],
        objective: "Enter at moments where one Salamence action improves two or more teammates.",
        howToPlay: "Salamence is not just a damage dealer. Intimidate can buy Milotic a Coil, buy Gholdengo a Nasty Plot, or reduce the urgency of opposing physical setup. Tailwind gives the non-Sand half of the team a full speed engine. Draco Meteor prevents opposing Dragons from assuming Salamence is only support.",
        training: train(2, 0, 0, 32, 0, 32, {
            "label": "Modest special pressure / Speed",
            "why": "Recommended starting spread for the special Tailwind / Draco Meteor bridge role. Adjust bulk and speed only after identifying concrete tournament benchmarks.",
            "spend": [
              "2 HP",
              "32 SpA",
              "32 Spe"
            ],
            "rule": "66 SP max, 32 per stat; recommended starting spread."
          }),
        networkJobs: {
          creates: "Intimidate; Tailwind; Ground immunity; Dragon pressure",
          converts: "Fake Out-protected Tailwind turns; Physical boards weakened by Rillaboom terrain",
          protects: "Milotic's first Coil; Gholdengo's Nasty Plot access; Ground-weak teammates",
          scales: "Mega transformation",
        },
        abilityStages: {
          before: "Pre-Mega Intimidate is an important resource and should often be captured before Mega evolution.",
          after: "Mega evolution changes Salamence from connector into a stronger autonomous damage source.",
          when: "Mega evolution changes Salamence from connector into a stronger autonomous damage source.",
        },
        ampTargets: [
          {
            slug: "Milotic Coil",
            becomes: "Amp target",
          },
          {
            slug: "Gholdengo Nasty Plot",
            becomes: "Amp target",
          },
          {
            slug: "Excadrill outside Sand",
            becomes: "Amp target",
          },
          {
            slug: "Rillaboom heavy attacks",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "Do not Mega automatically. In games where Tyranitar is the more important Mega, Salamence can still perform its bridge job through Intimidate, Tailwind, and Draco Meteor.",
            },
          ],
        },
        gives: [
          "Intimidate",
          "Tailwind",
          "Ground immunity",
          "Dragon coverage",
        ],
        answers: [
          "Physical Dragons",
          "Ground-heavy boards",
          "Speed-control needs outside Sand",
        ],
      },
      {
        slug: "rillaboom",
        title: "Rillaboom",
        job: "support",
        literacy: "pivot",
        primaryJob: "Create one-action advantages that another R2 piece converts immediately.",
        role: "Tempo connector, Rain breaker, terrain controller, and priority cleaner.",
        item: "Miracle Seed",
        ability: "Grassy Surge",
        nature: "Adamant",
        moves: [
          {
            name: "Fake Out",
            why: "Creates the cleanest one-turn resource on the team for Nasty Plot, Coil, Tailwind, or focused damage.",
          },
          {
            name: "Grassy Glide",
            why: "Turns accumulated chip into priority cleanup and gives the team a speed-independent finishing tool.",
          },
          {
            name: "Wood Hammer",
            why: "Immediate high-power Grass pressure, especially valuable into Water / Ground structures.",
          },
          {
            name: "Protect",
            why: "Keeps the connector available for terrain, priority, and late-game cleanup rather than trading it unnecessarily.",
          },
        ],
        objective: "Use Fake Out and terrain to manufacture the turn the actual win condition needs.",
        howToPlay: "New players often overvalue Fake Out as a generic safe move. On R2, ask what Fake Out is buying. If it buys Gholdengo a boost, Milotic a Coil, Salamence Tailwind, or a decisive double target, it is excellent. If it merely delays the game without improving the next board, attack instead.",
        training: train(32, 32, 2, 0, 0, 0, {
            "label": "Adamant bulky offense",
            "why": "Recommended starting spread: maximize Grass damage while giving Rillaboom enough general bulk to survive repeated connector duty. Exact defensive thresholds are unverified.",
            "spend": [
              "32 HP",
              "32 Atk",
              "2 Def"
            ],
            "rule": "66 SP max, 32 per stat; recommended starting spread."
          }),
        networkJobs: {
          creates: "Fake Out free turn; Grassy Terrain; Priority pressure; Ground damage reduction",
          converts: "Rain's Water / Ground cores; Late-game chip",
          protects: "Milotic through recovery; Ground-sensitive teammates through terrain; Setup turns through Fake Out",
          scales: "Endgame value increases as targets enter Grassy Glide range",
        },
        ampTargets: [
          {
            slug: "Gholdengo Nasty Plot",
            becomes: "Amp target",
          },
          {
            slug: "Milotic Coil",
            becomes: "Amp target",
          },
          {
            slug: "Salamence Tailwind",
            becomes: "Amp target",
          },
          {
            slug: "Water / Ground punishment",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "Miracle Seed keeps Rillaboom's offensive conversion meaningful without sacrificing Protect.",
            },
          ],
        },
        gives: [
          "Fake Out",
          "Terrain",
          "Priority",
          "Water / Ground pressure",
        ],
        answers: [
          "Mega Swampert-style Rain structures",
          "Ground spread pressure",
          "Low-health fast attackers",
        ],
      },
      {
        slug: "gholdengo",
        title: "Gholdengo",
        job: "breaker",
        literacy: "sweeper",
        primaryJob: "Convert one protected turn into a special damage clock that ignores Intimidate.",
        role: "Autonomous special scaler and primary punishment for opponents who overprepare for R2's physical half.",
        item: "Leftovers",
        ability: "Good as Gold",
        nature: "Modest",
        moves: [
          {
            name: "Make It Rain",
            why: "Primary spread conversion after a free turn; attacks both slots and punishes boards built to stop physical Sand.",
          },
          {
            name: "Shadow Ball",
            why: "Single-target special damage when Make It Rain's stat drop or targeting is undesirable.",
          },
          {
            name: "Nasty Plot",
            why: "Turns one manufactured free turn into a self-contained win condition.",
          },
          {
            name: "Protect",
            why: "Punishes overtargeting and helps cycle Fake Out, Tailwind, terrain recovery, or partner pressure.",
          },
        ],
        objective: "Become the reason the opponent regrets spending its resources on Tyranitar and Excadrill.",
        howToPlay: "Gholdengo does not need Nasty Plot every game. Sometimes its best contribution is immediate Make It Rain while the opponent is still arranging its Sand answers. Use Nasty Plot when Rillaboom, Salamence, Protect pressure, or a forced switch makes the setup turn genuinely low-cost.",
        training: train(2, 0, 0, 32, 0, 32, {
            "label": "Modest max SpA / Speed",
            "why": "Recommended starting spread for immediate special conversion after Nasty Plot. Exact speed and bulk benchmarks should be refined through testing.",
            "spend": [
              "2 HP",
              "32 SpA",
              "32 Spe"
            ],
            "rule": "66 SP max, 32 per stat; recommended starting spread."
          }),
        networkJobs: {
          creates: "Special spread pressure; Status-resistant board presence; Forced special-defense responses",
          converts: "Fake Out turns; Intimidate turns; Tailwind; Physical defensive overcommitment",
          protects: "Physical attackers by forcing special answers",
          scales: "Nasty Plot",
        },
        ampTargets: [
          {
            slug: "Fake Out turns",
            becomes: "Amp target",
          },
          {
            slug: "Intimidate turns",
            becomes: "Amp target",
          },
          {
            slug: "Tailwind",
            becomes: "Amp target",
          },
          {
            slug: "Opponent physical-defense commitments",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "Leftovers supports repeated Protect and setup cycles in slower packages.",
            },
          ],
        },
        gives: [
          "Special spread pressure",
          "Nasty Plot scaling",
          "Steel offense",
          "Status-resistant presence",
        ],
        answers: [
          "Physical walls",
          "Intimidate-heavy plans",
          "Bulk Up-style physical defense scaling",
        ],
      },
      {
        slug: "milotic",
        title: "Milotic",
        job: "support",
        literacy: "wall",
        primaryJob: "Make scaling strategies spend turns without receiving reliable actions in return.",
        role: "Adaptive control scaler, Intimidate inverter, and universal answer to opponents that need repeated setup turns.",
        item: "Leftovers",
        ability: "Competitive",
        nature: "Bold",
        moves: [
          {
            name: "Coil",
            why: "Raises Defense and accuracy at once, improving survival, Hypnosis reliability, and Muddy Water consistency.",
          },
          {
            name: "Hypnosis",
            why: "Stops a boosted threat by denying actions instead of trying to erase its stat changes.",
          },
          {
            name: "Muddy Water",
            why: "Provides spread progress while Coil improves its reliability and potential accuracy-pressure value.",
          },
          {
            name: "Protect",
            why: "Preserves Coil investment, Competitive boosts, sleep turns, and terrain recovery.",
          },
        ],
        objective: "Turn a board that wants to scale into a board where one opposing slot rarely gets to act.",
        howToPlay: "Milotic is not the team's Ice Beam slot. Draco Meteor, Rock pressure, and Steel attacks handle Dragons elsewhere. Milotic's value is broader: Coil lets it survive physical escalation, Hypnosis attacks any threat that depends on taking repeated actions, and Competitive punishes stat-lowering counterplay aimed at R2's physical side.",
        training: train(32, 0, 32, 0, 2, 0, {
            "label": "Bold physical control",
            "why": "Recommended starting spread for the Coil / Hypnosis job: survive physical setup pressure long enough for Coil to compound. This is a role-based starting point, not a verified tournament calc.",
            "spend": [
              "32 HP",
              "32 Def",
              "2 SpD"
            ],
            "rule": "66 SP max, 32 per stat; recommended starting spread."
          }),
        networkJobs: {
          creates: "Sleep pressure; Muddy Water spread pressure; Intimidate punishment",
          converts: "Fake Out turns; Intimidate-reduced physical boards; Passive setup boards",
          protects: "The team from runaway setup; Physical attackers from repeated Intimidate through Competitive threat",
          scales: "Coil; Competitive",
        },
        ampTargets: [
          {
            slug: "Salamence Intimidate turns",
            becomes: "Amp target",
          },
          {
            slug: "Rillaboom Fake Out",
            becomes: "Amp target",
          },
          {
            slug: "Grassy Terrain recovery",
            becomes: "Amp target",
          },
          {
            slug: "Opponent Intimidate through Competitive",
            becomes: "Amp target",
          },
        ],
        itemLoop: {
          beats: [
            {
              click: "Leftovers plus Protect and terrain recovery reward preserving Coil investment instead of trading Milotic quickly.",
            },
          ],
        },
        gives: [
          "Anti-setup control",
          "Competitive inversion",
          "Physical scaling durability",
          "Sleep",
        ],
        answers: [
          "Physical boosters",
          "Bulky setup Pokémon",
          "Intimidate-heavy teams",
          "Slow endgames",
        ],
      },
    ],
    packs: [
      {
        id: "pack-sand-overdrive",
        label: "Sand Overdrive",
        when: "Bring this when the opponent lacks comfortable Ground / Steel answers, depends on conventional speed control, or cannot repeatedly reset Sand without losing tempo.",
        identity: "The most direct version of R2: immediate Sand pressure backed by Salamence's speed bridge and Gholdengo's special punishment.",
        slugs: [
          "tyranitar",
          "excadrill",
          "salamence",
          "gholdengo",
        ],
        strategy: {
          opponentPattern: "Conventional balance, speed-reliant offense, or teams whose Sand answer is primarily physical.",
          bring: [
            "tyranitar",
            "excadrill",
            "salamence",
            "gholdengo",
          ],
          purpose: "Force immediate Sand respect and punish the defensive response with special conversion.",
          targets: [
            "Flying threats with Rock pressure",
            "Steel targets with Ground pressure",
            "Physical defensive pivots with Gholdengo",
            "Dragons with Draco Meteor",
          ],
          refuses: [
            "Long passive games where Fake Out or Milotic control would be more valuable",
            "Repeatedly restoring Sand without gaining an action",
          ],
          winCondition: "Create a two-clock dilemma between Excadrill speed and Gholdengo special scaling.",
          gamePlan: "Break with Sand → bridge with Intimidate / Tailwind → finish with the converter the opponent failed to cover.",
          mantra: "Make them answer Sand, then punish the answer.",
        },
        roles: [
          {
            slug: "tyranitar",
            macro: "Create and restore Sand.",
            micro: "Choose whether this turn is about damage or preserving the next weather reset.",
          },
          {
            slug: "excadrill",
            macro: "Convert Sand into immediate material advantage.",
            micro: "Target the piece whose removal makes the back-line clock easiest.",
          },
          {
            slug: "salamence",
            macro: "Bridge Sand into the non-Sand speed and special game.",
            micro: "Use Intimidate / Tailwind only when they change the following turn.",
          },
          {
            slug: "gholdengo",
            macro: "Punish physical defensive commitments.",
            micro: "Distinguish a real Nasty Plot turn from a greedy one.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "tyranitar",
            "excadrill",
          ],
          leadWhy: "The lead makes the opponent answer speed, Ground pressure, Rock pressure, and weather immediately. That information tells you whether the back-line special route should become primary.",
          backPair: [
            "salamence",
            "gholdengo",
          ],
          backJobs: [
            {
              slug: "salamence",
              job: "Reset physical pressure with Intimidate, establish Tailwind if Sand stops controlling speed, and threaten Dragons with Draco Meteor.",
            },
            {
              slug: "gholdengo",
              job: "Punish physical defensive overcommitment and convert any forced Protect / switch sequence into special pressure.",
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
              to: "gholdengo",
              creates: "Intimidate setup window",
              converts: "Nasty Plot",
            },
            {
              from: "salamence",
              to: "excadrill",
              creates: "Tailwind",
              converts: "Second speed mode",
            },
          ],
          turn1: "If the opposing lead cannot safely absorb Excadrill plus Tyranitar pressure, attack immediately; do not use a setup turn just because the back line contains setup.",
          bringInTriggers: [
            "Opponent commits Intimidate or Ground immunity into Excadrill → bring Salamence or Gholdengo and change axes.",
            "Sand is removed but the opponent is still speed-reliant → bring Salamence and use Tailwind as the replacement engine.",
            "Opponent begins protecting around Sand turns → bring Gholdengo to convert passive turns.",
          ],
        },
        defaultLeadPair: [
          "tyranitar",
          "excadrill",
        ],
        backPair: [
          "salamence",
          "gholdengo",
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
            "gholdengo",
          ],
          scaler: [
            "gholdengo",
          ],
          control: [
            "tyranitar",
            "salamence",
          ],
          winCondition: "Use Sand for immediate pressure; if the opponent overdefends physically, convert the breathing room into Gholdengo.",
          clock: "Fastest R2 package. Sand first, Tailwind second, Gholdengo last.",
          commitment: "Medium-high. This four wants active tempo and does not contain Milotic or Fake Out for recovery.",
          autonomy: "High because Salamence / Gholdengo remains a coherent special route when Sand is denied.",
          triggerBreadth: "Sand, Tailwind, Intimidate turns, physical defensive overcommitment.",
        },
        pilotDecision: {
          chooseWhen: [
            "The opposing four is vulnerable to fast Ground / Steel / Rock pressure.",
            "The opponent's best Sand answer is physical defense rather than immediate special burst.",
            "You want to threaten a very fast Game 1 while still retaining Gholdengo as a different clock.",
          ],
          avoidWhen: [
            "Rain control requires Rillaboom.",
            "Multiple physical setup threats make Milotic essential.",
            "The opponent's board can comfortably reverse speed with Trick Room.",
          ],
          previewQuestion: "If they stop Excadrill, does that answer also stop Gholdengo?",
          primaryMistake: "Continuing to force Sand after the opponent has already spent its roster slots solving Sand.",
        },
        engineIds: [
          "sand-rush-engine",
          "tailwind-bridge-engine",
          "connector-setup-engine",
        ],
        winRouteIds: [
          "route-sand-collapse",
          "route-tailwind-conversion",
          "route-gold-scaling",
        ],
        endgameIds: [
          "endgame-excadrill",
          "endgame-gholdengo",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "lead-0",
                when: "Their lead cannot comfortably stop Sand.",
                then: "Attack immediately and force the first defensive answer.",
              },
              {
                id: "lead-1",
                when: "They lead hard Sand denial.",
                then: "Preserve Excadrill and transition quickly into Salamence / Gholdengo instead of proving the bad matchup.",
              },
            ],
          },
        ],
        loops: [
          {
            title: "Sand Forces the Answer",
            body: "When Tyranitar plus Excadrill threatens immediate damage, attack the piece that makes the opponent's defensive structure function. If they Protect or switch to preserve it, use that revealed response to decide whether Salamence or Gholdengo should enter next. The board you want is one where the opponent has spent a defensive action while you still have Sand pressure or a fresh special converter.",
            id: "sand-force-switch",
            type: "conversion",
            trigger: "Opponent cannot ignore Sand Rush pressure.",
            sequence: [
              "Tyranitar establishes Sand.",
              "Excadrill threatens the key target.",
              "Opponent reveals Protect, switch, Intimidate, or immunity.",
              "R2 pivots into the route that punishes that answer.",
            ],
            payoff: "Information plus tempo without locking the team into Sand.",
          },
          {
            title: "Replace Sand with Tailwind",
            body: "If Sand is removed or Excadrill's Sand turns become awkward, bring Salamence into a physical attack or a predicted defensive turn. Use Intimidate to lower the immediate cost of Tailwind, then let Excadrill or Gholdengo convert the new speed state. The board you want is a fast mixed-offense position that no longer cares which weather is active.",
            id: "tailwind-second-engine",
            type: "infrastructure",
            trigger: "Sand no longer controls speed cleanly.",
            sequence: [
              "Salamence enters.",
              "Intimidate reduces pressure.",
              "Salamence sets Tailwind.",
              "Excadrill or Gholdengo converts.",
            ],
            payoff: "A second independent speed engine.",
          },
          {
            title: "Their Sand Answer Becomes Gold",
            body: "When the opponent commits Intimidate, bulky physical walls, or repeated Protects to surviving Excadrill, stop asking Excadrill to break that structure. Bring Gholdengo into the lower-pressure turn and either attack immediately or Nasty Plot if the setup is genuinely safe. The desired board is boosted or healthy Gholdengo facing resources that were chosen to stop physical Sand.",
            id: "physical-answer-gold",
            type: "counterplay",
            trigger: "Opponent overcommits to physical Sand defense.",
            sequence: [
              "Opponent reveals physical denial.",
              "Preserve Excadrill if useful.",
              "Bring Gholdengo.",
              "Convert through special damage.",
            ],
            payoff: "Failure inversion: stopping Plan A opens Plan B.",
          },
        ],
        victims: [
          {
            name: "Speed-reliant balance",
            why: "Sand Rush and Tailwind create two distinct ways to control action order.",
            play: "Force them to reveal which speed mode they prepared for, then use the other.",
            trap: "Do not spend both Salamence and Tyranitar merely maintaining speed.",
          },
          {
            name: "Physical-defense-heavy anti-Sand teams",
            why: "Gholdengo attacks from a special axis that their Sand answers may not cover.",
            play: "Use Excadrill to draw the answer rather than trying to overpower it.",
            trap: "Do not lose Gholdengo before the physical answers are committed.",
          },
        ],
        counters: [
          {
            name: "Hard Trick Room with immediate pressure",
            why: "This four is biased toward controlling conventional speed and lacks Milotic's slower control route.",
            play: "Use immediate damage and avoid unnecessary Tailwind.",
            trap: "Setting Tailwind into a guaranteed Trick Room can make your own positioning worse.",
          },
          {
            name: "Rain requiring Rillaboom",
            why: "Without Rillaboom, Water / Ground rain cores can force Tyranitar to carry too much of the matchup.",
            play: "Choose the Rain package instead.",
            trap: "Do not treat weather control alone as a complete Rain answer.",
          },
        ],
        advantages: [
          {
            title: "Two speed engines",
            body: "Sand Rush and Tailwind fail to different forms of disruption.",
          },
          {
            title: "Mixed conversion",
            body: "Excadrill punishes special-defense investment; Gholdengo punishes physical-defense investment.",
          },
        ],
        hazards: [
          {
            title: "Sand tunnel vision",
            body: "The package becomes much worse if you spend multiple turns recreating Sand while the opponent calmly develops a stronger board.",
          },
        ],
      },
      {
        id: "pack-autonomous-balance",
        label: "Autonomous Balance",
        when: "Bring this when Sand is awkward, weather is contested, the opponent is prepared for Tyranitar / Excadrill, or you want the highest density of independent non-Sand win conditions.",
        identity: "The hidden second team inside R2: Intimidate + Fake Out manufacture turns for two autonomous special/control scalers.",
        slugs: [
          "salamence",
          "rillaboom",
          "gholdengo",
          "milotic",
        ],
        strategy: {
          opponentPattern: "Anti-Sand structures, balanced teams, physical offense, and matchups where board control matters more than immediate weather damage.",
          bring: [
            "salamence",
            "rillaboom",
            "gholdengo",
            "milotic",
          ],
          purpose: "Play a fully functional non-Sand game using connectors to feed two independent scalers.",
          targets: [
            "Physical attackers with Intimidate",
            "Passive turns with Nasty Plot or Coil",
            "Setup threats with Hypnosis",
            "Chipped fast targets with Grassy Glide",
          ],
          refuses: [
            "Forcing weather into a bad weather matchup",
            "Racing every board on raw speed",
          ],
          winCondition: "Make one scaler demand an answer, then let the other scaler exploit the resources spent on that answer.",
          gamePlan: "Control with Intimidate / Fake Out → choose Gholdengo or Milotic → preserve Rillaboom priority for the finish.",
          mantra: "One scaler is the threat; the other is the punishment.",
        },
        roles: [
          {
            slug: "salamence",
            macro: "Control physical damage and speed.",
            micro: "Choose the exact turn where Intimidate turns into Tailwind or Draco pressure.",
          },
          {
            slug: "rillaboom",
            macro: "Manufacture tempo and preserve priority.",
            micro: "Fake Out the action that matters, not simply the easiest legal target.",
          },
          {
            slug: "gholdengo",
            macro: "Create the fast special scaling clock.",
            micro: "Take one high-quality Nasty Plot rather than two greedy ones.",
          },
          {
            slug: "milotic",
            macro: "Create the slow control clock.",
            micro: "Coil before Hypnosis when the board allows it; attack immediately when it does not.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "rillaboom",
            "gholdengo",
          ],
          leadWhy: "Rillaboom creates immediate tempo while Gholdengo forces the opponent to respect either damage or Nasty Plot. This lead teaches you very quickly whether the opponent intends to attack, Protect, or pivot defensively.",
          backPair: [
            "salamence",
            "milotic",
          ],
          backJobs: [
            {
              slug: "salamence",
              job: "Enter into physical pressure, reset Attack with Intimidate, and establish Tailwind when the board wants faster conversion.",
            },
            {
              slug: "milotic",
              job: "Enter when the opponent begins playing passively, cycling Intimidate, or building a physical setup threat; convert the slower board with Coil.",
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
              creates: "Intimidate damage reduction",
              converts: "Safer Coil",
            },
            {
              from: "rillaboom",
              to: "milotic",
              creates: "Grassy recovery",
              converts: "Long control loop",
            },
          ],
          turn1: "Fake Out only if it creates a profitable Gholdengo action; otherwise use Rillaboom's damage and let Gholdengo attack immediately.",
          bringInTriggers: [
            "Opponent commits physical attackers → bring Salamence for Intimidate.",
            "Opponent slows the game or begins setup → bring Milotic and start the Coil decision tree.",
            "Gholdengo forces Protects → use the passive turn to reposition a connector rather than automatically Nasty Plotting again.",
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
            "milotic",
          ],
          scaler: [
            "gholdengo",
            "milotic",
          ],
          control: [
            "salamence",
            "rillaboom",
            "milotic",
          ],
          winCondition: "Manufacture one low-cost setup turn, then make the opponent choose between stopping a special damage clock and a sleep/control clock.",
          clock: "Medium-speed adaptive game with two very different scaling destinations.",
          commitment: "Low. Every member functions independently and the package can change its intended win condition midgame.",
          autonomy: "Extremely high; this is the package that proves R2 is not actually dependent on Sand.",
          triggerBreadth: "Fake Out, Intimidate, Tailwind, Competitive, Coil, Nasty Plot, terrain recovery, priority.",
        },
        pilotDecision: {
          chooseWhen: [
            "The opponent overprepares for Tyranitar / Excadrill.",
            "Weather control is too unstable to make Sand a reliable primary engine.",
            "The matchup rewards repeated positioning and setup access.",
            "You expect physical Intimidate cycling that can activate Milotic.",
          ],
          avoidWhen: [
            "The opponent is so immediately offensive that neither scaler can safely take a setup turn.",
            "Tyranitar's weather control is essential.",
            "Excadrill's Ground pressure is required to remove a specific Steel threat.",
          ],
          previewQuestion: "Which scaler becomes harder to stop after they show their answer to the other one?",
          primaryMistake: "Trying to set up both Gholdengo and Milotic instead of identifying which scaler the matchup actually gives you.",
        },
        engineIds: [
          "connector-setup-engine",
          "tailwind-bridge-engine",
          "coil-control-engine",
        ],
        winRouteIds: [
          "route-tailwind-conversion",
          "route-gold-scaling",
          "route-coil-lock",
        ],
        endgameIds: [
          "endgame-gholdengo",
          "endgame-milotic",
          "endgame-rillaboom",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "lead-0",
                when: "Fake Out creates a genuine Nasty Plot turn.",
                then: "Take the boost and begin the Gholdengo clock immediately.",
              },
              {
                id: "lead-1",
                when: "They lead overwhelming Gholdengo pressure.",
                then: "Attack or Protect rather than forcing setup; use Salamence / Milotic as the second wave.",
              },
            ],
          },
        ],
        loops: [
          {
            title: "Fake Out Into Gold",
            body: "When one opposing slot is the clear source of immediate pressure and can be flinched, Rillaboom uses Fake Out while Gholdengo decides between Nasty Plot and immediate damage. If the second opposing slot cannot meaningfully punish Gholdengo, take the boost. The desired board is a boosted Gholdengo with Rillaboom still alive to provide priority or another terrain cycle later.",
            id: "fakeout-plot",
            type: "scaling",
            trigger: "One flinch meaningfully reduces the opponent's productive actions.",
            sequence: [
              "Rillaboom uses Fake Out.",
              "Gholdengo evaluates setup versus attack.",
              "Opponent is forced to respect boosted special pressure.",
              "Back line enters behind that pressure.",
            ],
            payoff: "A one-turn resource becomes a full special win condition.",
          },
          {
            title: "Intimidate Into Coil",
            body: "When the opposing board is primarily physical, bring Salamence into the attack and reduce the damage before Milotic commits to Coil. Milotic then becomes harder to remove while Hypnosis becomes more dependable. The desired board is a physically weakened opponent facing a Milotic that gets more difficult to attack every turn.",
            id: "intimidate-coil",
            type: "scaling",
            trigger: "Physical offense gives Salamence a safe Intimidate entry.",
            sequence: [
              "Salamence enters.",
              "Intimidate reduces Attack.",
              "Milotic uses Coil.",
              "Milotic begins sleep / Muddy Water control.",
            ],
            payoff: "The opponent's physical clock slows while Milotic's control clock accelerates.",
          },
          {
            title: "The Second Scaler",
            body: "When the opponent starts spending both targeting and defensive resources on Gholdengo, stop demanding that Gholdengo win alone. Protect or reposition Gholdengo and bring Milotic into the reduced-pressure board. The board you want is one where their anti-Gholdengo actions have created the first safe Coil.",
            id: "gold-to-coil",
            type: "counterplay",
            trigger: "Opponent overtargets Gholdengo.",
            sequence: [
              "Gholdengo draws concentrated pressure.",
              "Gholdengo Protects or leaves.",
              "Milotic enters.",
              "Milotic takes Coil or begins control.",
            ],
            payoff: "The answer to one scaler activates the other.",
          },
          {
            title: "Sleep Creates Priority Range",
            body: "When Milotic has stabilized a dangerous opposing Pokémon with Hypnosis, use the sleeping turns to attack the second slot instead of repeatedly targeting the sleeper. Rillaboom and Salamence accumulate chip while Milotic uses Muddy Water. The desired board is an opponent waking up into Grassy Glide or Gholdengo KO range rather than a reset neutral board.",
            id: "coil-to-grass",
            type: "resource",
            trigger: "Hypnosis lands on the opponent's main converter.",
            sequence: [
              "Milotic puts main threat to sleep.",
              "Partner attacks the other slot.",
              "Muddy Water adds spread chip.",
              "Rillaboom converts chip with priority.",
            ],
            payoff: "Control turns become damage progress rather than merely delay.",
          },
        ],
        victims: [
          {
            name: "Intimidate-heavy physical balance",
            why: "Salamence reduces physical damage while Milotic can punish opposing Intimidate through Competitive.",
            play: "Let the opponent's stat control decide which scaler receives the easier game.",
            trap: "Do not leave Milotic out of the four if Competitive meaningfully changes their best line.",
          },
          {
            name: "Teams whose Sand answer consumes several roster slots",
            why: "This package ignores Sand entirely.",
            play: "Make their anti-Sand preparation functionally dead.",
            trap: "Do not bring Tyranitar / Excadrill simply because they are the nominal core.",
          },
        ],
        counters: [
          {
            name: "Immediate strong special burst",
            why: "Intimidate and Coil are less helpful if both opposing slots attack specially and deny setup access.",
            play: "Prioritize Tailwind and immediate damage over slow setup.",
            trap: "Do not assume every board offers a Coil or Nasty Plot turn.",
          },
          {
            name: "Status immunity plus setup denial",
            why: "This can reduce Milotic's most universal anti-scaling route.",
            play: "Shift the primary clock to Gholdengo and Salamence.",
            trap: "Do not spend multiple turns forcing Hypnosis into an immune or protected route.",
          },
        ],
        advantages: [
          {
            title: "No Sand dependency",
            body: "All four remain coherent even if weather never favors R2.",
          },
          {
            title: "Two independent scalers",
            body: "Gholdengo wants special damage conversion; Milotic wants a slower control board. Their failure conditions differ.",
          },
        ],
        hazards: [
          {
            title: "Setup greed",
            body: "The presence of two setup Pokémon does not mean both should boost. Usually one is the clock and the other is insurance.",
          },
        ],
      },
      {
        id: "pack-rain-inversion",
        label: "Rain Inversion",
        when: "Bring this into Pelipper-style Rain, Mega Swampert structures, or teams where removing weather simultaneously reduces damage, removes speed, and activates Excadrill.",
        identity: "Weather denial plus Grass pressure. Tyranitar attacks Rain's infrastructure while Rillaboom attacks the Water / Ground pieces that try to exploit it.",
        slugs: [
          "tyranitar",
          "excadrill",
          "rillaboom",
          "milotic",
        ],
        strategy: {
          opponentPattern: "Rain offense with Pelipper, Swampert, Archaludon, or similar weather-dependent conversion.",
          bring: [
            "tyranitar",
            "excadrill",
            "rillaboom",
            "milotic",
          ],
          purpose: "Turn opposing weather infrastructure into a repeated positional tax.",
          targets: [
            "Weather setter",
            "Water / Ground converter",
            "Archaludon-style scaler",
            "Ground attacks weakened by terrain",
          ],
          refuses: [
            "Trading Tyranitar before weather control matters",
            "Repeatedly attacking Stamina-style targets with low-value physical hits",
          ],
          winCondition: "Deny one decisive Rain turn, remove the Water / Ground converter, and finish through Sand Rush or Milotic control.",
          gamePlan: "Preserve weather control → force Rain commitment → replace weather → punish the reset.",
          mantra: "Do not win the weather war every turn. Win the weather turn that matters.",
        },
        roles: [
          {
            slug: "tyranitar",
            macro: "Delete Rain at the decisive moment.",
            micro: "Enter on the turn where weather replacement changes multiple opponent resources at once.",
          },
          {
            slug: "excadrill",
            macro: "Punish the weather reset.",
            micro: "Use Sand Rush to hit the piece that made Rain dangerous.",
          },
          {
            slug: "rillaboom",
            macro: "Pressure Water / Ground and create setup turns.",
            micro: "Preserve enough health to threaten Grassy Glide after weather exchanges.",
          },
          {
            slug: "milotic",
            macro: "Control Rain's scaler or physical conversion route.",
            micro: "Coil only when Rain's immediate burst has been reduced enough to make the turn cheap.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "rillaboom",
            "milotic",
          ],
          leadWhy: "Rillaboom immediately threatens common Rain converters while Milotic can absorb a slower game. Keeping Tyranitar in back makes the weather reset a surprise action rather than a starting condition.",
          backPair: [
            "tyranitar",
            "excadrill",
          ],
          backJobs: [
            {
              slug: "tyranitar",
              job: "Enter exactly when replacing Rain removes speed, damage, or a one-turn Rain interaction.",
            },
            {
              slug: "excadrill",
              job: "Convert Tyranitar's weather reset into immediate Sand Rush pressure, especially into Steel targets vulnerable to Ground.",
            },
          ],
          pairEdges: [
            {
              from: "rillaboom",
              to: "milotic",
              creates: "Fake Out free turn",
              converts: "First Coil",
            },
            {
              from: "tyranitar",
              to: "excadrill",
              creates: "Weather replacement",
              converts: "Sand Rush attack",
            },
            {
              from: "rillaboom",
              to: "tyranitar",
              creates: "Water / Ground pressure",
              converts: "Safer Sand entry",
            },
          ],
          turn1: "If Rillaboom can immediately threaten the Rain converter, force it to respect Grass pressure before revealing Tyranitar.",
          bringInTriggers: [
            "Opponent commits to a Rain-powered attack or speed state → bring Tyranitar.",
            "Tyranitar changes Rain to Sand with Excadrill still healthy → bring or activate Excadrill immediately.",
            "Archaludon begins accumulating value → use Ground pressure or Milotic sleep rather than feeding it low-value attacks.",
          ],
        },
        defaultLeadPair: [
          "rillaboom",
          "milotic",
        ],
        backPair: [
          "tyranitar",
          "excadrill",
        ],
        identityCard: {
          engine: [
            "tyranitar",
            "rillaboom",
          ],
          connector: [
            "rillaboom",
          ],
          converter: [
            "excadrill",
            "milotic",
          ],
          scaler: [
            "milotic",
          ],
          control: [
            "tyranitar",
            "rillaboom",
            "milotic",
          ],
          winCondition: "Make Rain spend turns rebuilding infrastructure while R2 converts those turns into Grass pressure, Sand Rush attacks, or Coil.",
          clock: "Weather-tempo clock with a slow Milotic fallback.",
          commitment: "Medium. Tyranitar must be preserved for meaningful weather exchanges.",
          autonomy: "High because Rillaboom and Milotic remain useful even if Sand is immediately replaced.",
          triggerBreadth: "Drizzle, Water / Ground targets, weather-reset turns, physical Rain attackers, Archaludon setup.",
        },
        pilotDecision: {
          chooseWhen: [
            "The opponent's Rain meaningfully powers speed or damage.",
            "Mega Swampert or another Water / Ground threat makes Rillaboom essential.",
            "Archaludon or another Rain scaler needs a control answer.",
          ],
          avoidWhen: [
            "Rain is incidental and the opponent's actual threats are special attackers that punish Tyranitar / Rillaboom heavily.",
            "The matchup demands Salamence's Draco Meteor for Dragons.",
            "The opponent's weather setter is not worth spending Tyranitar's health to contest.",
          ],
          previewQuestion: "What disappears from their game plan the moment Rain disappears?",
          primaryMistake: "Leading Tyranitar automatically and letting it take unnecessary Water damage before the decisive weather turn.",
        },
        engineIds: [
          "weather-inversion-engine",
          "sand-rush-engine",
          "coil-control-engine",
        ],
        winRouteIds: [
          "route-weather-inversion",
          "route-sand-collapse",
          "route-coil-lock",
        ],
        endgameIds: [
          "endgame-excadrill",
          "endgame-milotic",
          "endgame-rillaboom",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "lead-0",
                when: "Rillaboom threatens their main Rain converter.",
                then: "Lead Rillaboom and preserve Tyranitar.",
              },
              {
                id: "lead-1",
                when: "Their Turn 1 Rain attack is immediately catastrophic.",
                then: "Consider exposing Tyranitar earlier because the weather denial itself is worth the risk.",
              },
            ],
          },
        ],
        loops: [
          {
            title: "Hold Tyranitar",
            body: "When the opponent can establish Rain on Turn 1 but does not immediately force a knockout, keep Tyranitar in back. Let Rillaboom pressure the Water / Ground converter first, then bring Tyranitar when Rain is actively powering speed or damage. The desired board is Sand appearing after the opponent has already committed its Rain attacker to the field.",
            id: "hold-the-sand",
            type: "counterplay",
            trigger: "Rain matters more on the second exchange than on Turn 1.",
            sequence: [
              "Lead without Tyranitar.",
              "Pressure Rain converter.",
              "Opponent commits to Rain-powered turn.",
              "Tyranitar replaces Rain.",
            ],
            payoff: "Weather replacement removes value instead of merely changing the icon.",
          },
          {
            title: "The Weather Flip",
            body: "When Tyranitar replaces Rain with Sand and Excadrill is healthy, immediately ask whether Excadrill can take a decisive Ground, Steel, or Rock action. Do not spend the weather flip on low-value chip. The desired board is one where the opponent must choose between restoring Rain and surviving Excadrill's new speed.",
            id: "sand-after-rain",
            type: "conversion",
            trigger: "Tyranitar successfully replaces Rain.",
            sequence: [
              "Tyranitar enters.",
              "Rain disappears.",
              "Sand Rush activates.",
              "Excadrill pressures the key Rain piece.",
            ],
            payoff: "One switch simultaneously denies their engine and starts yours.",
          },
          {
            title: "Do Not Race the Tower",
            body: "When an Archaludon-style target begins accumulating Stamina or special boosts, avoid repeatedly feeding it weak physical hits. Use Excadrill's meaningful Ground pressure when a knockout is available; otherwise let Milotic Coil and threaten Hypnosis. The desired board is a sleeping or heavily pressured scaler while Rillaboom attacks the partner that was protecting it.",
            id: "rain-scaler-sleep",
            type: "scaling",
            trigger: "Rain's bulky scaler is gaining more from the exchange than R2.",
            sequence: [
              "Stop low-value physical chip.",
              "Position Milotic or Excadrill.",
              "Use High Horsepower or Hypnosis.",
              "Attack the partner while the scaler is controlled.",
            ],
            payoff: "R2 attacks actions and infrastructure instead of losing a stat race.",
          },
        ],
        victims: [
          {
            name: "Pelipper + Mega Swampert-style Rain",
            why: "Rillaboom directly pressures Water / Ground while Tyranitar can remove Swift Swim's preferred weather.",
            play: "Preserve both pieces until the Rain converter commits.",
            trap: "Losing Rillaboom early makes Tyranitar shoulder too much of the matchup.",
          },
        ],
        counters: [
          {
            name: "Rain with overwhelming special Grass / Fighting coverage",
            why: "Tyranitar and Rillaboom may both become difficult to position safely.",
            play: "Lean harder on Milotic control and use Excadrill only on decisive Sand turns.",
            trap: "Do not repeatedly pivot Tyranitar into attacks merely to change weather.",
          },
        ],
        advantages: [
          {
            title: "One switch, multiple denials",
            body: "Tyranitar can simultaneously weaken Water damage, remove weather-dependent speed, and activate Excadrill.",
          },
          {
            title: "Rillaboom attacks the converter",
            body: "R2 does not rely on weather control alone; it also pressures the Pokémon trying to exploit Rain.",
          },
        ],
        hazards: [
          {
            title: "Weather ego",
            body: "The goal is not to have Sand on screen more turns than the opponent has Rain. The goal is to own the turns where weather changes the result.",
          },
        ],
      },
      {
        id: "pack-scaler-hunt",
        label: "Scaler Hunt",
        when: "Bring this when the opponent has multiple physical boosters, bulky setup Pokémon, Corviknight-style defensive scaling, Dragon Dance threats, or a board that becomes dangerous only after receiving several free actions.",
        identity: "R2's anti-snowball package: Intimidate and Fake Out slow the first boost while Milotic attacks the concept of repeated setup itself.",
        slugs: [
          "salamence",
          "rillaboom",
          "milotic",
          "excadrill",
        ],
        strategy: {
          opponentPattern: "Dragon Dance, Bulk Up, Swords Dance, Stamina-style boards, or other repeated-action scalers.",
          bring: [
            "salamence",
            "rillaboom",
            "milotic",
            "excadrill",
          ],
          purpose: "Break the opponent's action chain before its boosts become a complete game state.",
          targets: [
            "Physical setup",
            "Dragons",
            "Bulky scalers",
            "Ground-sensitive Steel threats",
          ],
          refuses: [
            "Passive observation while the opponent stacks boosts",
            "Repeated low-value attacks into a scaler that benefits from them",
          ],
          winCondition: "Use Intimidate / Fake Out to create Milotic control, then finish the slowed board with Excadrill or Rillaboom.",
          gamePlan: "Interrupt → Coil → sleep the key converter → remove its partner → clean.",
          mantra: "Do not beat the boost; beat the actions the boost needs.",
        },
        roles: [
          {
            slug: "salamence",
            macro: "Reduce physical scaling and threaten Dragons.",
            micro: "Use Draco when the Dragon itself must be removed; use Intimidate / Tailwind when the whole board must be reshaped.",
          },
          {
            slug: "rillaboom",
            macro: "Delete one action and preserve priority.",
            micro: "Fake Out the move that enables the scaler, not automatically the scaler itself.",
          },
          {
            slug: "milotic",
            macro: "Turn denied actions into a control lock.",
            micro: "Coil before the accuracy-dependent loop when possible.",
          },
          {
            slug: "excadrill",
            macro: "Finish the controlled board.",
            micro: "Avoid feeding defensive scalers meaningless physical chip; attack only when the hit changes the game.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "salamence",
            "rillaboom",
          ],
          leadWhy: "The lead attacks both halves of physical setup: Intimidate lowers damage and Fake Out can remove the setup or conversion action entirely.",
          backPair: [
            "milotic",
            "excadrill",
          ],
          backJobs: [
            {
              slug: "milotic",
              job: "Enter once physical pressure has been reduced, take Coil, and deny the central scaler actions through Hypnosis.",
            },
            {
              slug: "excadrill",
              job: "Provide immediate Ground / Steel finishing pressure after the setup board has been disrupted.",
            },
          ],
          pairEdges: [
            {
              from: "salamence",
              to: "milotic",
              creates: "Intimidate damage reduction",
              converts: "Safer Coil",
            },
            {
              from: "rillaboom",
              to: "milotic",
              creates: "Fake Out free turn",
              converts: "Coil or Hypnosis",
            },
            {
              from: "salamence",
              to: "excadrill",
              creates: "Tailwind",
              converts: "Fast cleanup",
            },
          ],
          turn1: "Reduce the opponent's ability to make progress first; do not reveal Milotic until the board is ready for it to take over.",
          bringInTriggers: [
            "Physical scaler remains after Intimidate → bring Milotic.",
            "Scaler is asleep or forced defensive → bring Excadrill and attack the partner.",
            "Opponent abandons setup and switches to immediate speed → Salamence can pivot into Tailwind.",
          ],
        },
        defaultLeadPair: [
          "salamence",
          "rillaboom",
        ],
        backPair: [
          "milotic",
          "excadrill",
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
            "milotic",
            "excadrill",
          ],
          scaler: [
            "milotic",
          ],
          control: [
            "salamence",
            "rillaboom",
            "milotic",
          ],
          winCondition: "Deny the opponent enough consecutive productive actions that its setup investment never becomes a functioning clock.",
          clock: "Control first, then Excadrill or Rillaboom cleanup.",
          commitment: "Low-medium. The package can abandon Milotic scaling and convert through Tailwind offense.",
          autonomy: "High because Intimidate, Fake Out, Tailwind, sleep, and priority remain useful independently.",
          triggerBreadth: "Dragon Dance, Bulk Up, Swords Dance, physical offense, passive setup, Intimidate.",
        },
        pilotDecision: {
          chooseWhen: [
            "One or more opposing Pokémon become overwhelming after two or three consecutive actions.",
            "Physical setup is more dangerous than raw immediate special damage.",
            "The matchup rewards stopping a clock rather than winning a damage race.",
          ],
          avoidWhen: [
            "The opponent's important threats are almost entirely special and immediate.",
            "Gholdengo's Steel / special damage is required to break the matchup.",
            "Sand weather control is mandatory.",
          ],
          previewQuestion: "Which opposing Pokémon becomes unacceptable if it is allowed to act three turns in a row?",
          primaryMistake: "Treating Hypnosis as the first move instead of first creating the board where Hypnosis becomes reliable and valuable.",
        },
        engineIds: [
          "coil-control-engine",
          "connector-setup-engine",
          "tailwind-bridge-engine",
        ],
        winRouteIds: [
          "route-coil-lock",
          "route-tailwind-conversion",
        ],
        endgameIds: [
          "endgame-milotic",
          "endgame-excadrill",
          "endgame-rillaboom",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "lead-0",
                when: "Their scaler is physical.",
                then: "Lead Salamence + Rillaboom and reduce its first turn.",
              },
              {
                id: "lead-1",
                when: "Their apparent scaler is actually special.",
                then: "Do not force the anti-physical script; use Tailwind and immediate attacks instead.",
              },
            ],
          },
        ],
        loops: [
          {
            title: "Intimidate Plus Fake Out",
            body: "When the opponent leads a physical scaler beside support, Salamence enters for Intimidate while Rillaboom uses Fake Out on whichever slot enables the setup most efficiently. If the scaler still boosts, its immediate damage is reduced; if it attacks, one action has already been removed. The desired board is a slower physical threat that Milotic can safely enter against.",
            id: "double-denial",
            type: "counterplay",
            trigger: "Opponent's primary win condition is physical setup.",
            sequence: [
              "Salamence Intimidates.",
              "Rillaboom Fake Outs key enabler.",
              "Opponent's first setup turn loses efficiency.",
              "Milotic enters.",
            ],
            payoff: "Milotic receives a cheaper first Coil.",
          },
          {
            title: "Coil Before the Coin Flip",
            body: "When Milotic can survive the next physical exchange, use Coil before relying on Hypnosis. The Defense boost makes the following turn safer while the accuracy boost makes Hypnosis and Muddy Water more dependable. The desired board is not simply a sleeping target; it is a Milotic that can repeat the control loop if the first sleep ends.",
            id: "coil-hypnosis-lock",
            type: "scaling",
            trigger: "Milotic gets a low-cost first setup turn.",
            sequence: [
              "Milotic uses Coil.",
              "Defense and accuracy rise.",
              "Milotic uses Hypnosis on main scaler.",
              "Partner attacks the remaining slot.",
            ],
            payoff: "Repeatable control rather than one desperate sleep attempt.",
          },
          {
            title: "Ignore the Sleeping Threat",
            body: "When Hypnosis lands on the opponent's central scaler, stop pouring attacks into the sleeping slot unless the knockout is immediate. Bring Excadrill or preserve Rillaboom and remove the active partner first. The desired board is the sleeping scaler waking up alone into a two-versus-one or priority endgame.",
            id: "sleep-and-clean",
            type: "conversion",
            trigger: "Key scaler is asleep.",
            sequence: [
              "Milotic lands Hypnosis.",
              "Partner attacks second slot.",
              "Excadrill or Rillaboom enters.",
              "Second slot falls before sleeper regains control.",
            ],
            payoff: "Sleep becomes board compression instead of temporary delay.",
          },
        ],
        victims: [
          {
            name: "Dragon Dance physical offense",
            why: "Intimidate, Draco Meteor, Fake Out, and Hypnosis attack different parts of the setup sequence.",
            play: "Force the Dragon to spend more turns reaching a winning state than R2 spends controlling it.",
            trap: "Do not assume Intimidate alone solves Speed boosts.",
          },
          {
            name: "Bulk Up / defensive physical scaling",
            why: "Milotic attacks actions rather than Defense boosts.",
            play: "Use Hypnosis to stop the converter and attack its partner.",
            trap: "Do not repeatedly feed high-Defense targets physical attacks that accomplish too little.",
          },
        ],
        counters: [
          {
            name: "Fast special setup plus status immunity",
            why: "This removes both Intimidate value and part of Milotic's universal control route.",
            play: "Use Tailwind and immediate offensive conversion.",
            trap: "Do not spend turns building Coil if Hypnosis cannot meaningfully affect the target.",
          },
        ],
        advantages: [
          {
            title: "Different anti-setup layers",
            body: "Fake Out denies an action, Intimidate reduces physical conversion, Draco Meteor threatens Dragons directly, and Hypnosis attacks future actions.",
          },
        ],
        hazards: [
          {
            title: "Over-controlling",
            body: "Once the opponent's setup clock is broken, switch from disruption to damage. Control without conversion merely gives them time to rebuild.",
          },
        ],
      },
      {
        id: "pack-double-scaler",
        label: "Double Scaler",
        when: "Bring this against slower balance, defensive teams, and opponents that can answer either Gholdengo or Milotic individually but struggle to pressure both scaling paths while also respecting Tyranitar.",
        identity: "The slowest, greediest R2 package: Tyranitar supplies immediate board respect while Gholdengo and Milotic present incompatible scaling problems.",
        slugs: [
          "tyranitar",
          "rillaboom",
          "gholdengo",
          "milotic",
        ],
        strategy: {
          opponentPattern: "Slow balance, defensive pivots, Intimidate cycling, and teams with limited immediate burst.",
          bring: [
            "tyranitar",
            "rillaboom",
            "gholdengo",
            "milotic",
          ],
          purpose: "Force the opponent to choose the wrong scaling war.",
          targets: [
            "Intimidate cycling",
            "Passive recovery",
            "Protect-heavy play",
            "Physical walls",
          ],
          refuses: [
            "Pure speed races",
            "Greedy simultaneous setup",
          ],
          winCondition: "Make one scaler draw the answer; let the other scaler inherit the free turn.",
          gamePlan: "Apply Tyranitar / Rillaboom pressure → reveal their anti-scaler plan → activate the opposite scaler.",
          mantra: "Show one clock. Win with the other.",
        },
        roles: [
          {
            slug: "tyranitar",
            macro: "Create immediate respect without consuming the scaling slot.",
            micro: "Preserve weather utility if it will matter later.",
          },
          {
            slug: "rillaboom",
            macro: "Choose which scaler receives the free turn.",
            micro: "Keep Fake Out purposeful and preserve priority.",
          },
          {
            slug: "gholdengo",
            macro: "Punish physical and Milotic-oriented answers.",
            micro: "Boost once, then convert.",
          },
          {
            slug: "milotic",
            macro: "Punish physical setup and stat control.",
            micro: "Build Coil only when the opponent cannot immediately invalidate the investment.",
          },
        ],
        fieldPlan: {
          leadPair: [
            "tyranitar",
            "rillaboom",
          ],
          leadWhy: "Tyranitar plus Rillaboom can attack, Fake Out, manipulate weather, and pressure Water / Ground without committing the actual scaling win condition.",
          backPair: [
            "gholdengo",
            "milotic",
          ],
          backJobs: [
            {
              slug: "gholdengo",
              job: "Enter when the opponent's resources are biased toward stopping physical damage or Milotic.",
            },
            {
              slug: "milotic",
              job: "Enter when Intimidate, passive play, or physical setup creates a safer long game.",
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
              from: "rillaboom",
              to: "milotic",
              creates: "Fake Out free turn",
              converts: "Coil",
            },
            {
              from: "milotic",
              to: "gholdengo",
              creates: "Sleeping threat",
              converts: "Nasty Plot window",
            },
          ],
          turn1: "Use Tyranitar and Rillaboom to gather information; do not reveal which scaler matters until the opponent shows what it is willing to spend.",
          bringInTriggers: [
            "Opponent reveals physical wall / Intimidate line → bring Gholdengo.",
            "Opponent reveals physical setup / passive line → bring Milotic.",
            "Opponent overtargets one scaler → Protect or switch and activate the other.",
          ],
        },
        defaultLeadPair: [
          "tyranitar",
          "rillaboom",
        ],
        backPair: [
          "gholdengo",
          "milotic",
        ],
        identityCard: {
          engine: [
            "rillaboom",
            "tyranitar",
          ],
          connector: [
            "rillaboom",
          ],
          converter: [
            "gholdengo",
            "milotic",
          ],
          scaler: [
            "gholdengo",
            "milotic",
          ],
          control: [
            "tyranitar",
            "rillaboom",
            "milotic",
          ],
          winCondition: "Use Tyranitar's immediate pressure and Rillaboom's tempo to activate whichever scaler the opponent is less capable of containing.",
          clock: "Slow adaptive scaling with priority cleanup.",
          commitment: "High. This package intentionally gives up Salamence and Excadrill's speed tools.",
          autonomy: "High in neutral boards, lower when external speed control is mandatory.",
          triggerBreadth: "Fake Out, Competitive, Nasty Plot, Coil, weather pressure, terrain recovery.",
        },
        pilotDecision: {
          chooseWhen: [
            "The opponent is slow enough that Tailwind is unnecessary.",
            "The opponent has one obvious answer to Gholdengo and a different obvious answer to Milotic.",
            "You expect a long resource game rather than a short speed race.",
          ],
          avoidWhen: [
            "The opponent has explosive speed that demands Salamence or Excadrill.",
            "Dragon pressure makes Draco Meteor essential.",
            "The matchup cannot afford multiple setup-oriented turns.",
          ],
          previewQuestion: "Which of my two scalers forces them to expose the answer that helps the other one?",
          primaryMistake: "Trying to activate both scalers before the opponent has committed to stopping either.",
        },
        engineIds: [
          "connector-setup-engine",
          "coil-control-engine",
        ],
        winRouteIds: [
          "route-gold-scaling",
          "route-coil-lock",
        ],
        endgameIds: [
          "endgame-gholdengo",
          "endgame-milotic",
          "endgame-rillaboom",
        ],
        flows: [
          {
            id: "lead",
            title: "Lead",
            forks: [
              {
                id: "lead-0",
                when: "Opponent reveals Intimidate immediately.",
                then: "Consider Milotic as the primary clock because Competitive may make the intended counterplay actively bad.",
              },
              {
                id: "lead-1",
                when: "Opponent reveals strong physical walling.",
                then: "Preserve Tyranitar and transition to Gholdengo rather than forcing physical damage.",
              },
            ],
          },
        ],
        loops: [
          {
            title: "Hide the Clock",
            body: "When the opponent has not yet shown how it intends to stop R2's late game, lead Tyranitar plus Rillaboom and make ordinary high-value plays. Do not expose Gholdengo or Milotic merely to start setting up. The desired board is one where the opponent reveals its defensive resources before you reveal which scaler those resources must answer.",
            id: "hide-the-clock",
            type: "resource",
            trigger: "Preview does not clearly identify the better scaler.",
            sequence: [
              "Lead Tyranitar + Rillaboom.",
              "Apply damage / Fake Out pressure.",
              "Observe opponent's defensive response.",
              "Bring the scaler that punishes it.",
            ],
            payoff: "Information determines the win condition instead of guesswork.",
          },
          {
            title: "Gold Draws the Fire",
            body: "When Gholdengo becomes the opponent's central targeting priority, Protect or reposition it instead of insisting on another attack. Bring Milotic into the reduced-pressure turn and Coil if the board allows it. The desired board is Milotic gaining its first control boost because the opponent spent both attention and coverage on Gholdengo.",
            id: "gold-draws-fire",
            type: "counterplay",
            trigger: "Opponent overtargets Gholdengo.",
            sequence: [
              "Gholdengo draws attacks.",
              "Gholdengo Protects or leaves.",
              "Milotic enters.",
              "Milotic Coils.",
            ],
            payoff: "Counterplay to one scaler creates the other scaler.",
          },
          {
            title: "Milotic Opens Make It Rain",
            body: "When Milotic's Coil / Hypnosis threat causes the opponent to concentrate special damage or Taunt-style denial into Milotic, use Rillaboom's Fake Out or Tyranitar pressure to make a Gholdengo entry safe. Gholdengo should usually attack immediately unless the board truly grants Nasty Plot. The desired board is a special attacker facing resources that were chosen to stop a bulky Water control piece.",
            id: "coil-draws-pressure",
            type: "counterplay",
            trigger: "Opponent commits anti-Milotic resources.",
            sequence: [
              "Milotic demands answer.",
              "Opponent targets Milotic's control route.",
              "Gholdengo enters.",
              "Gholdengo converts immediately.",
            ],
            payoff: "The two scalers alternate rather than competing for setup turns.",
          },
        ],
        victims: [
          {
            name: "Slow balance",
            why: "The package has enough time to let the opponent reveal which scaler it is equipped to stop.",
            play: "Use the first turns for information and resource advantage.",
            trap: "Do not race a team that is already volunteering to play slowly.",
          },
        ],
        counters: [
          {
            name: "High-tempo special offense",
            why: "This four lacks Salamence Tailwind and Excadrill Sand Rush, so immediate special burst can deny both scaling routes.",
            play: "Choose a faster package.",
            trap: "Do not mistake theoretical late-game superiority for guaranteed setup access.",
          },
        ],
        advantages: [
          {
            title: "Incompatible answers",
            body: "The resources used to stop boosted Gholdengo are often different from those used to stop Coil / Hypnosis Milotic.",
          },
        ],
        hazards: [
          {
            title: "Too much setup, not enough conversion",
            body: "A +2 Gholdengo and +2 Milotic are not automatically better than one boosted threat plus immediate pressure. Spend boosts.",
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
        title: "Sand Pulls, Gold Pushes",
        body: "Opponent commits physical resources to surviving Tyranitar / Excadrill. Present Sand pressure. Opponent reveals physical answer. Preserve or pivot the Sand piece. Bring Gholdengo. Convert with immediate special damage or Nasty Plot. The opponent's correct Sand response creates a special win condition.",
        id: "team-loop-sand-to-special",
        type: "counterplay",
        trigger: "Opponent commits physical resources to surviving Tyranitar / Excadrill.",
        sequence: [
          "Present Sand pressure.",
          "Opponent reveals physical answer.",
          "Preserve or pivot the Sand piece.",
          "Bring Gholdengo.",
          "Convert with immediate special damage or Nasty Plot.",
        ],
        payoff: "The opponent's correct Sand response creates a special win condition.",
      },
      {
        title: "Physical Pressure Feeds Milotic",
        body: "Opponent relies on physical attackers or Intimidate. Salamence reduces damage with Intimidate. Rillaboom can remove one action with Fake Out. Milotic takes Coil. Milotic uses Hypnosis to deny the main converter. Partner attacks the remaining slot. The opponent's physical game progressively becomes less efficient while Milotic's control becomes more reliable.",
        id: "team-loop-physical-to-coil",
        type: "scaling",
        trigger: "Opponent relies on physical attackers or Intimidate.",
        sequence: [
          "Salamence reduces damage with Intimidate.",
          "Rillaboom can remove one action with Fake Out.",
          "Milotic takes Coil.",
          "Milotic uses Hypnosis to deny the main converter.",
          "Partner attacks the remaining slot.",
        ],
        payoff: "The opponent's physical game progressively becomes less efficient while Milotic's control becomes more reliable.",
      },
      {
        title: "Their Weather Starts Ours",
        body: "Opponent commits to Rain-dependent speed or damage. Preserve Tyranitar. Opponent establishes the Rain turn. Tyranitar replaces Rain with Sand. Excadrill gains Sand Rush. Rillaboom pressures the Water / Ground converter. One switch denies their infrastructure and activates R2's.",
        id: "team-loop-rain-flip",
        type: "infrastructure",
        trigger: "Opponent commits to Rain-dependent speed or damage.",
        sequence: [
          "Preserve Tyranitar.",
          "Opponent establishes the Rain turn.",
          "Tyranitar replaces Rain with Sand.",
          "Excadrill gains Sand Rush.",
          "Rillaboom pressures the Water / Ground converter.",
        ],
        payoff: "One switch denies their infrastructure and activates R2's.",
      },
      {
        title: "Control Becomes Grassy Glide",
        body: "Milotic or Salamence has slowed the opponent's damage output. Milotic / Salamence reduce productive actions. Partners accumulate chip. Rillaboom is preserved. Targets enter Grassy Glide range. Priority closes without needing another speed-control turn. Slow control turns are converted into a speed-independent endgame.",
        id: "team-loop-control-to-priority",
        type: "conversion",
        trigger: "Milotic or Salamence has slowed the opponent's damage output.",
        sequence: [
          "Milotic / Salamence reduce productive actions.",
          "Partners accumulate chip.",
          "Rillaboom is preserved.",
          "Targets enter Grassy Glide range.",
          "Priority closes without needing another speed-control turn.",
        ],
        payoff: "Slow control turns are converted into a speed-independent endgame.",
      },
    ],
    hazards: [
      {
        title: "Calling it a Sand team",
        body: "The fastest way to pilot R2 badly is to believe Tyranitar + Excadrill must appear in every four. Sand is one architecture root inside a larger strategy generator.",
      },
      {
        title: "Setting up because you can",
        body: "Nasty Plot and Coil are only valuable when the following turn converts the investment. A free turn with no safe conversion is not actually free.",
      },
      {
        title: "Using Fake Out without a purchase",
        body: "Fake Out should buy Tailwind, Coil, Nasty Plot, a knockout, or a critical positional transition. Delaying the game by one turn is not automatically progress.",
      },
      {
        title: "Sacrificing Tyranitar in weather matchups",
        body: "Against Rain, Tyranitar's future switch can be worth more than its current attack because the switch may simultaneously remove several opposing resources.",
      },
      {
        title: "Treating Milotic like coverage glue",
        body: "Coil / Hypnosis Milotic is valuable because it attacks scaling as a strategy. Do not judge it by whether it has a super-effective move for every Dragon.",
      },
      {
        title: "Forgetting the fallback clock",
        body: "Before Turn 1, identify what happens if your first plan is denied. If the answer is 'I try the same plan harder,' you probably selected the wrong four.",
      },
    ],
    victims: [
      {
        name: "Teams with one-dimensional speed control",
        why: "R2 can access Sand Rush, Tailwind, priority, or a Milotic route that does not need to win the speed race.",
      },
      {
        name: "Intimidate-heavy physical control",
        why: "Gholdengo ignores Attack drops, while Milotic can actively profit through Competitive.",
      },
      {
        name: "Teams whose anti-Sand plan consumes multiple slots",
        why: "The Salamence / Rillaboom / Gholdengo / Milotic package can function as an entirely separate team.",
      },
      {
        name: "Physical setup teams",
        why: "Intimidate, Fake Out, Draco pressure, Coil, and Hypnosis attack the setup sequence from several directions.",
      },
    ],
    counters: [
      {
        name: "Fast special offense with little dependence on Attack drops",
        why: "It can reduce the value of Salamence's Intimidate and deny Milotic's first Coil before R2's slower engines activate.",
      },
      {
        name: "Status-immune or sleep-resistant scaling",
        why: "This attacks one of Coil Milotic's most important universal control routes and forces R2 to win through damage instead.",
      },
      {
        name: "Multiple simultaneous special scalers",
        why: "R2's strongest reactive tools are particularly efficient into physical progress. Two independent special clocks can strain Fake Out and Hypnosis because each action controls only one target.",
      },
      {
        name: "Hard Trick Room with immediate conversion",
        why: "Sand Rush and Tailwind can become poor resources if moving first is no longer the desirable speed state.",
      },
    ],
    advantages: [
      {
        title: "Embedded second team",
        body: "Salamence / Rillaboom / Gholdengo / Milotic is a coherent bring-four with no dependence on Sand. Weather denial therefore does not erase R2's strategic identity.",
      },
      {
        title: "Physical and special clocks",
        body: "Excadrill and Tyranitar demand physical answers; Gholdengo attacks from the special side; Milotic attacks through control rather than direct stat racing.",
      },
      {
        title: "Failure inversion",
        body: "Intimidate can activate Competitive, physical Sand answers can create Gholdengo turns, and aggressive Gholdengo targeting can create Milotic turns.",
      },
      {
        title: "Distributed Dragon interaction",
        body: "Salamence supplies Draco Meteor and Intimidate, Tyranitar supplies Rock pressure, Excadrill / Gholdengo supply Steel pressure, Rillaboom suppresses Ground-heavy Dragon structures, and Milotic controls setup.",
      },
      {
        title: "Rain interaction is architectural",
        body: "Tyranitar does not merely change weather; its switch can remove Rain speed and damage while activating Excadrill, while Rillaboom independently pressures common Water / Ground converters.",
      },
      {
        title: "Setup access from several sources",
        body: "Fake Out, Intimidate, forced Protects, weather resets, and opponent overtargeting can all become the low-cost turn that Gholdengo or Milotic needs.",
      },
    ],
    coreArchitecture: {
      identity: "A modular balance team with an explosive Sand branch and a fully functional non-Sand branch. Its strongest turns come from converting small resources such as Fake Out, Intimidate, Tailwind, weather control, or forced targeting into either immediate damage or a setup turn.",
      primaryEngine: "Tyranitar creates Sand and Excadrill converts it into immediate speed and pressure.",
      conversionModel: "Infrastructure is deliberately shared. Sand feeds Excadrill; Fake Out and Intimidate manufacture setup turns; Tailwind feeds every offensive member; forced defensive responses to physical pressure give Gholdengo and Milotic room to scale.",
      scalingModel: "Gholdengo scales offensively through Nasty Plot. Milotic scales defensively and operationally through Coil, then converts accuracy into reliable Hypnosis and Muddy Water. These two scalers attack very different forms of counterplay.",
      controlModel: "Rillaboom controls tempo with Fake Out and terrain. Salamence controls physical damage with Intimidate and speed with Tailwind. Tyranitar controls weather. Milotic controls individual threats through sleep and Muddy Water accuracy pressure.",
      speedModel: "The team can win through Sand Rush, Tailwind, priority Grassy Glide, or by refusing the speed race and letting Milotic scale. R2 therefore does not have one speed mode.",
      resourceModel: "The six repeatedly creates free or reduced-cost turns. Fake Out, Intimidate, weather replacement, Ground immunity, Grassy Terrain, Protect pressure, and offensive double-target threats all create turns that another node converts.",
      threatProfile: [
        "Immediate Sand Rush offense",
        "Tailwind-enabled mixed offense",
        "Nasty Plot Gholdengo scaling",
        "Coil / Hypnosis Milotic control",
        "Rillaboom priority cleanup",
        "Dual-Mega preview pressure from Tyranitar and Salamence",
        "Distributed Dragon answers through Draco Meteor, Rock pressure, Steel pressure, and sleep",
        "Rain disruption through Sand plus Rillaboom",
      ],
    },
    architecture: [
      {
        title: "Engine",
        body: "Tyranitar, Salamence, and Rillaboom manufacture the team's most important resources: Sand, speed control, Intimidate turns, Fake Out turns, terrain, and forced targeting.",
      },
      {
        title: "Converter",
        body: "Excadrill converts Sand into immediate KOs; Gholdengo converts protected turns into Nasty Plot or Make It Rain pressure; Milotic converts passive or physical boards into Coil and Hypnosis control.",
      },
      {
        title: "Endgame",
        body: "The match usually finishes through one of four clocks: Sand Rush cleanup, boosted Gholdengo spread damage, stabilized Milotic control, or Rillaboom priority after the opposing board has been chipped.",
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
        goal: "Turn Sand into a short damage race the opponent cannot stabilize before Excadrill takes a decisive KO.",
      },
      {
        id: "tailwind-clock",
        owner: [
          "salamence",
          "gholdengo",
          "excadrill",
          "rillaboom",
        ],
        speed: "tempo",
        goal: "Use Tailwind to turn otherwise fair attackers into consecutive first-move threats.",
      },
      {
        id: "gold-clock",
        owner: [
          "gholdengo",
        ],
        speed: "scaling",
        goal: "Find one low-cost Nasty Plot turn, then force the opponent to survive repeated special spread pressure.",
      },
      {
        id: "coil-clock",
        owner: [
          "milotic",
        ],
        speed: "scaling",
        goal: "Reach a board where Milotic is too physically durable to remove comfortably and accurate enough to make Hypnosis and Muddy Water oppressive.",
      },
      {
        id: "grass-clock",
        owner: [
          "rillaboom",
        ],
        speed: "reactive",
        goal: "Turn accumulated chip into Grassy Glide cleanup while Fake Out and terrain keep the opposing offense from regaining tempo.",
      },
    ],
    winRoutes: [
      {
        id: "route-sand-collapse",
        name: "Sand Collapse",
        requires: [
          "Tyranitar can establish or re-establish Sand",
          "Excadrill is positioned safely enough to attack",
        ],
        sequence: [
          "Establish Sand with Tyranitar.",
          "Use Excadrill's Sand Rush to move before conventional speed control can stabilize.",
          "Threaten two-target pressure with Rock Slide plus Tyranitar's damage or a focused double target.",
          "Force Protects, switches, or KOs.",
          "Use the resulting numerical or positional advantage to finish with Excadrill, Tyranitar, or a back-line cleaner.",
        ],
        finish: "Excadrill remains faster than the surviving board and the opponent no longer has enough healthy pieces to trade efficiently.",
        failurePoint: "Sand is removed, Excadrill is heavily Intimidated, or the opponent presents a board that safely absorbs Ground / Steel / Rock pressure.",
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
          {
            slug: "rillaboom",
            importance: "supportive",
          },
        ],
      },
      {
        id: "route-tailwind-conversion",
        name: "Tailwind Conversion",
        requires: [
          "Salamence gets a safe Tailwind turn",
          "At least one high-value converter remains healthy",
        ],
        sequence: [
          "Use Salamence's Intimidate or immediate Draco / Hyper Voice pressure to make an attack into Salamence inefficient.",
          "Set Tailwind when the opponent spends the turn defending, switching, or reducing damage.",
          "Bring in Gholdengo, Excadrill, or Rillaboom under the speed advantage.",
          "Use the remaining Tailwind turns for high-value attacks rather than unnecessary setup.",
          "Finish with priority, spread damage, or Sand after Tailwind expires.",
        ],
        finish: "The opponent enters its final two Pokémon already chipped or down a piece while R2 still has a priority or weather endgame.",
        failurePoint: "Salamence is removed before Tailwind or the opponent's speed mode ignores Tailwind entirely.",
        dependencies: [
          {
            slug: "salamence",
            importance: "critical",
          },
          {
            slug: "gholdengo",
            importance: "supportive",
          },
          {
            slug: "excadrill",
            importance: "supportive",
          },
        ],
      },
      {
        id: "route-gold-scaling",
        name: "Golden Free Turn",
        requires: [
          "A Fake Out, Intimidate, Protect, forced switch, or passive opposing turn creates setup access",
          "Gholdengo is not under immediate overwhelming Ground, Dark, or Fire pressure",
        ],
        sequence: [
          "Use Rillaboom or Salamence to reduce the opponent's productive actions.",
          "Place Gholdengo beside the connector rather than exposing it alone.",
          "Take Nasty Plot only when the opponent is paying more to stop the partner than it can spend punishing Gholdengo.",
          "Convert the boost immediately through Make It Rain or the appropriate single-target attack.",
          "Preserve Gholdengo if one more protected turn can create a second spread-damage cycle.",
        ],
        finish: "A boosted Gholdengo controls both opposing slots and forces defensive turns that the back line converts.",
        failurePoint: "The pilot becomes greedy and uses Nasty Plot when immediate damage was already enough.",
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
        id: "route-coil-lock",
        name: "Coil Lock",
        requires: [
          "Milotic can survive the next physical exchange",
          "The opponent cannot immediately remove or invalidate Milotic",
        ],
        sequence: [
          "Use Intimidate, Fake Out, terrain recovery, or offensive pressure to reduce the cost of Milotic's first Coil.",
          "Coil raises Defense while improving the accuracy of both Hypnosis and Muddy Water.",
          "Put the most dangerous opposing converter to sleep instead of trying to win its stat race directly.",
          "Use Muddy Water to keep making progress while the partner pressures the second slot.",
          "Protect when necessary to preserve Competitive boosts, sleep turns, or terrain recovery.",
        ],
        finish: "Milotic becomes a durable control piece that repeatedly removes one enemy action while its partner wins the remaining one-on-one exchange.",
        failurePoint: "Strong special pressure, status immunity, or immediate Taunt-style denial prevents the first Coil or makes Hypnosis unavailable.",
        dependencies: [
          {
            slug: "milotic",
            importance: "critical",
          },
          {
            slug: "salamence",
            importance: "supportive",
          },
          {
            slug: "rillaboom",
            importance: "supportive",
          },
        ],
      },
      {
        id: "route-weather-inversion",
        name: "Weather Inversion",
        requires: [
          "The opponent depends materially on Rain or another weather state",
        ],
        sequence: [
          "Hold Tyranitar until replacing weather changes more than damage.",
          "Switch Tyranitar in to remove the opposing weather.",
          "Use the same switch to activate Sand Rush Excadrill.",
          "Force the opponent to spend another action restoring its weather.",
          "Convert that forced weather action with Rillaboom pressure, Excadrill damage, or Milotic setup.",
        ],
        finish: "The opposing weather setter becomes a tax instead of an engine and R2 controls the tempo of subsequent weather changes.",
        failurePoint: "Tyranitar is exposed too early and removed before the decisive weather exchange.",
        dependencies: [
          {
            slug: "tyranitar",
            importance: "critical",
          },
          {
            slug: "excadrill",
            importance: "supportive",
          },
          {
            slug: "rillaboom",
            importance: "supportive",
          },
        ],
      },
    ],
    failureRoutes: [
      {
        failedRoute: "Sand Collapse",
        why: "The opponent denies Sand, walls Excadrill, or repeatedly Intimidates the physical mode.",
        fallback: "Stop spending turns restoring Sand unless it creates immediate value. Transition into Salamence / Rillaboom support for Gholdengo or Milotic.",
        nextRoute: "Golden Free Turn or Coil Lock",
      },
      {
        failedRoute: "Golden Free Turn",
        why: "Gholdengo is pressured too aggressively to set up.",
        fallback: "Use the pressure aimed at Gholdengo as a reason to attack immediately, pivot, or let Milotic become the scaler instead.",
        nextRoute: "Coil Lock",
      },
      {
        failedRoute: "Coil Lock",
        why: "Milotic faces strong special pressure, status immunity, or setup denial.",
        fallback: "Do not force Coil. Treat Milotic as a bulky Muddy Water / Protect piece and move the clock to Gholdengo, Sand, or Tailwind.",
        nextRoute: "Tailwind Conversion or Sand Collapse",
      },
      {
        failedRoute: "Tailwind Conversion",
        why: "The opponent uses Trick Room or another speed state that makes moving first undesirable.",
        fallback: "Stop racing speed. Preserve Salamence for Intimidate and use Milotic or bulkier Tyranitar positions to play a slower resource game.",
        nextRoute: "Coil Lock",
      },
    ],
    construction: {
      thesis: "Pair one explosive weather engine with multiple autonomous clocks so the opponent cannot solve the six by solving Sand.",
      method: "Use Tyranitar / Excadrill to create immediate respect, Salamence / Rillaboom to create low-cost turns, and Gholdengo / Milotic to convert those turns along different offensive and control axes.",
      winCondition: "Identify the least-correlated clock at preview, use the other threats to manufacture its activation turn, and preserve one fallback clock for the endgame.",
      endgames: [
        {
          id: "endgame-excadrill",
          label: "Sand Rush Cleanup",
          path: "Opposing Ground checks and priority are chipped or removed; Tyranitar restores Sand.",
          how: "Excadrill moves first and finishes the remaining board with the appropriate single-target or spread attack.",
        },
        {
          id: "endgame-gholdengo",
          label: "Golden Board",
          path: "Gholdengo reaches a boost or favorable Tailwind turn while its major Ground / Dark answers are damaged.",
          how: "Make It Rain or Shadow Ball forces consecutive defensive turns until the opponent cannot cover both slots.",
        },
        {
          id: "endgame-milotic",
          label: "Coil Lock",
          path: "Milotic has one or more Coils and the opponent lacks immediate special burst or status immunity.",
          how: "Hypnosis removes one enemy action stream while Muddy Water plus the partner steadily wins the other slot.",
        },
        {
          id: "endgame-rillaboom",
          label: "Grassy Glide Checkmate",
          path: "The faster opposing pieces have been chipped into priority range.",
          how: "Rillaboom no longer needs to win the speed war because Grassy Glide converts accumulated chip directly into KOs.",
        },
      ],
    },
    engines: [
      {
        id: "sand-rush-engine",
        label: "Sand Rush Overdrive",
        path: [
          "Tyranitar · enter and establish Sand",
          "Excadrill · gain Sand Rush speed",
          "Tyranitar · threaten Rock / Dark pressure",
          "Excadrill · force immediate Ground / Steel / Rock damage",
          "Opponent · Protect, switch, or lose material",
          "Back line · convert the forced defensive turn",
        ],
        how: "This is the obvious engine, which is exactly why it is so useful even when you do not intend to win through it. Tyranitar turns one field effect into both a weather advantage and Excadrill speed. Excadrill then forces the opponent to respect immediate damage, which often produces Protects and switches. Those defensive actions are resources for the rest of R2: Salamence can Tailwind, Gholdengo can find Nasty Plot, or Milotic can find Coil. Press this engine hardest when the opponent has no comfortable Ground immunity or weather reset. Do not confuse 'Sand is available' with 'Sand must be the win condition.'",
        dependsOn: "Excadrill must be healthy enough to convert Sand immediately, and Tyranitar must not be sacrificed before weather matters.",
        disrupt: "Weather replacement, Intimidate, Ground immunities, priority, defensive Steel / Ground answers, or removing Tyranitar before Excadrill activates.",
        fallback: "Use the opponent's Sand answers as information. If they overcommit to physical denial, rotate into Gholdengo or Milotic.",
      },
      {
        id: "connector-setup-engine",
        label: "Manufactured Free Turn",
        path: [
          "Rillaboom · Fake Out or Salamence · Intimidate",
          "Opponent · loses damage or one action",
          "Gholdengo / Milotic · survive the reduced-pressure turn",
          "Gholdengo · Nasty Plot or Milotic · Coil",
          "Connector · attacks, pivots, or protects the scaler",
          "Scaler · converts the boost on the next exchange",
        ],
        how: "R2's most important engine is not Sand; it is the creation of cheap setup turns. Rillaboom can remove one opposing action with Fake Out, while Salamence can make an entire physical board hit less hard with Intimidate. The scaler beside them spends that reduced pressure on Nasty Plot or Coil. This is why R2's pieces feel more connected than a normal balance team: the support action is not the end goal, it is a currency that another Pokémon spends. Use this engine when the opponent's board is threatening but not capable of overwhelming both slots at once. If the setup turn is not truly cheap, attack instead.",
        dependsOn: "The connector must meaningfully reduce the opponent's productive actions for one turn.",
        disrupt: "Ghost / immunity interactions into Fake Out, special attackers ignoring Intimidate, Taunt-style setup denial, or overwhelming double-target pressure.",
        fallback: "Use the connector's tempo for immediate damage instead of setup; the same Fake Out or Intimidate turn still has value.",
      },
      {
        id: "tailwind-bridge-engine",
        label: "Tailwind Bridge",
        path: [
          "Salamence · enter for Intimidate or immediate Dragon pressure",
          "Opponent · defends against Salamence or its partner",
          "Salamence · Tailwind",
          "Fast converter · enters or begins attacking",
          "Partner · pressures the second defensive answer",
          "Rillaboom / Sand · carries the game after Tailwind expires",
        ],
        how: "Tailwind is the bridge between R2's Sand and non-Sand identities. It lets Excadrill function even when Sand is inconvenient, turns Gholdengo into a much harder immediate damage threat, and lets Rillaboom use strong Grass attacks without relying only on priority. Salamence is especially good at creating Tailwind turns because Intimidate and Draco Meteor make ignoring it dangerous. Press Tailwind when two or more teammates gain meaningful action order from it; do not spend a turn on Tailwind merely because the move exists. The ideal Tailwind does not win the battle by itself. It delivers the board to a cleaner that remains useful after the four-turn clock ends.",
        dependsOn: "At least two members of the current four should gain meaningful conversion value from moving first.",
        disrupt: "Trick Room, extreme priority, opposing Tailwind mirrors, or removing Salamence before it can set speed.",
        fallback: "Use Salamence as an Intimidate / Draco Meteor bridge and move the win condition to Milotic or Sand.",
      },
      {
        id: "coil-control-engine",
        label: "Coil Into Control",
        path: [
          "Connector · reduce incoming physical pressure",
          "Milotic · Coil",
          "Milotic · gain Defense and accuracy",
          "Milotic · Hypnosis the highest-value converter",
          "Partner · attack the remaining active slot",
          "Milotic · Muddy Water while sleep / Protect cycles preserve control",
        ],
        how: "Coil Milotic is not here to be an Ice Beam coverage patch. Its job is to attack the idea of scaling itself. Coil makes physical removal harder while simultaneously making Hypnosis and Muddy Water more dependable. That means one move improves survival, disruption, and damage consistency at the same time. Use this route when the opponent wants several turns to turn one Pokémon into an unbeatable board state, especially physical boosters or bulky setup pieces. Milotic does not need to erase their boosts if it can deny the boosted Pokémon actions. The opponent's correct answer is often to pressure Milotic early, which creates space for R2's other clocks.",
        dependsOn: "Milotic must receive at least one turn where Coil does not cost more board position than it gains.",
        disrupt: "Strong special double targets, status immunity, setup denial, or immediate burst before the first Coil.",
        fallback: "Use Muddy Water and Protect as low-commitment control while Gholdengo, Salamence, or Sand becomes the actual clock.",
      },
      {
        id: "weather-inversion-engine",
        label: "Turn Their Weather Off",
        path: [
          "Opponent · establish Rain or weather-dependent offense",
          "Tyranitar · switch in and replace weather",
          "Excadrill · gain Sand Rush",
          "Rillaboom · threaten Water / Ground pieces",
          "Opponent · spend an action restoring weather",
          "R2 · attack or set up during that restoration",
        ],
        how: "Against Rain, Tyranitar does much more than reduce Water damage. Replacing Rain can remove Swift Swim speed, weaken Water attacks, and change how moves such as Electro Shot function, all while activating Excadrill. Rillaboom then pressures the Water / Ground structures that commonly accompany Rain. The important beginner lesson is to avoid treating Tyranitar as a Turn 1 obligation. Weather control is strongest when the switch itself destroys an opposing plan that is already committed to the field. If the opponent must repeatedly return to its weather setter, those switches become predictable actions that R2 can convert.",
        dependsOn: "Tyranitar must remain available for the weather exchange instead of being traded too early.",
        disrupt: "Repeated opposing weather resets, immediate Water pressure into Tyranitar, or removing Rillaboom before the Water / Ground core is controlled.",
        fallback: "Use Rillaboom as the primary Rain pressure and let Milotic / Gholdengo play the longer game while Tyranitar is preserved.",
      },
    ],
    network: {
      thesis: "R2 wins by turning small board-state resources into different clocks, then switching clocks when the opponent overanswers one.",
      edges: [
        {
          from: "tyranitar",
          to: "excadrill",
          creates: "Sand",
          converts: "Sand Rush pressure",
          engineId: "sand-rush-engine",
        },
        {
          from: "tyranitar",
          to: "excadrill",
          creates: "Weather replacement",
          converts: "Speed inversion",
          engineId: "weather-inversion-engine",
        },
        {
          from: "salamence",
          to: "milotic",
          creates: "Intimidate damage reduction",
          converts: "Safer Coil",
          engineId: "coil-control-engine",
        },
        {
          from: "salamence",
          to: "gholdengo",
          creates: "Intimidate setup window",
          converts: "Nasty Plot",
          engineId: "connector-setup-engine",
        },
        {
          from: "salamence",
          to: "excadrill",
          creates: "Tailwind",
          converts: "Non-Sand speed",
          engineId: "tailwind-bridge-engine",
        },
        {
          from: "salamence",
          to: "gholdengo",
          creates: "Tailwind",
          converts: "Fast special pressure",
          engineId: "tailwind-bridge-engine",
        },
        {
          from: "rillaboom",
          to: "gholdengo",
          creates: "Fake Out free turn",
          converts: "Nasty Plot",
          engineId: "connector-setup-engine",
        },
        {
          from: "rillaboom",
          to: "milotic",
          creates: "Fake Out free turn",
          converts: "First Coil",
          engineId: "connector-setup-engine",
        },
        {
          from: "rillaboom",
          to: "milotic",
          creates: "Grassy recovery",
          converts: "Longer control loop",
          engineId: "coil-control-engine",
        },
        {
          from: "rillaboom",
          to: "salamence",
          creates: "Ground damage reduction",
          converts: "Safer positioning",
        },
        {
          from: "rillaboom",
          to: "tyranitar",
          creates: "Water / Ground pressure",
          converts: "Safer weather control",
          engineId: "weather-inversion-engine",
        },
        {
          from: "excadrill",
          to: "gholdengo",
          creates: "Physical defensive response",
          converts: "Special setup window",
        },
        {
          from: "gholdengo",
          to: "excadrill",
          creates: "Special defensive response",
          converts: "Physical breakthrough",
        },
        {
          from: "milotic",
          to: "tyranitar",
          creates: "Sleep pressure",
          converts: "Safe Rock pressure",
        },
        {
          from: "milotic",
          to: "gholdengo",
          creates: "Sleeping threat",
          converts: "Nasty Plot window",
          engineId: "coil-control-engine",
        },
      ],
    },
    commandments: [
      "Sand is one engine, not the identity of every game.",
      "A free setup turn is valuable only if the boost converts before the opponent resets the board.",
      "Preserve Tyranitar against weather teams until changing weather changes the actual turn.",
      "If the opponent overcommits to stopping the physical mode, stop proving that the physical mode works and hand the game to Gholdengo or Milotic.",
      "Before selecting four, name your primary clock and your fallback clock.",
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
        id: "sand-rush",
        label: "Sand Rush",
        setterSlug: "excadrill",
        effect: "Sand Rush",
        whoBenefits: "Immediate Ground / Steel / Rock conversion",
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
        id: "coil",
        label: "Coil",
        setterSlug: "milotic",
        effect: "Coil",
        whoBenefits: "Physical bulk and accuracy scaling",
      },
      {
        id: "hypnosis",
        label: "Hypnosis",
        setterSlug: "milotic",
        effect: "Hypnosis",
        whoBenefits: "Denying actions from setup threats",
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
      {
        id: "weather-control",
        label: "Weather control",
        setterSlug: "tyranitar",
        effect: "Weather control",
        whoBenefits: "Excadrill and Rain inversion",
      },
    ],
    megaPool: {
      rule: "One Mega Stone per battle — preview which Mega candidate matters more.",
      previewPressure: "Decide which Mega path the opponent most fears before locking the stone.",
      candidates: [
        {
          slug: "tyranitar",
          stone: "Tyranitarite",
          when: "Primary Sand Mega when raw physical pressure, weather permanence, and Rock / Dark damage matter most.",
        },
        {
          slug: "salamence",
          stone: "Salamencite",
          when: "Alternative Mega when Tailwind, Intimidate sequencing, special Dragon pressure, and a more autonomous non-Sand game matter more.",
        },
      ],
    },
    matchupScripts: [
      {
        id: "script-1",
        foe: "Script 1",
        why: "Preserve Tyranitar for the important Rain turn, use Rillaboom to threaten Water / Ground converters, and make the opponent pay every time it restores weather.",
        packId: "pack-rain-inversion",
        sequence: {
          beats: [
            {
              click: "Preserve Tyranitar for the important Rain turn, use Rillaboom to threaten Water / Ground converters, and make the opponent pay every time it restores weather.",
            },
          ],
        },
      },
      {
        id: "script-2",
        foe: "Script 2",
        why: "Use Salamence's Draco Meteor and Intimidate for direct Dragon interaction, then use Milotic to prevent repeated setup turns.",
        packId: "pack-scaler-hunt",
        sequence: {
          beats: [
            {
              click: "Use Salamence's Draco Meteor and Intimidate for direct Dragon interaction, then use Milotic to prevent repeated setup turns.",
            },
          ],
        },
      },
      {
        id: "script-3",
        foe: "Script 3",
        why: "Leave Tyranitar and Excadrill on the bench if their answers do not also solve Salamence / Rillaboom / Gholdengo / Milotic.",
        packId: "pack-autonomous-balance",
        sequence: {
          beats: [
            {
              click: "Leave Tyranitar and Excadrill on the bench if their answers do not also solve Salamence / Rillaboom / Gholdengo / Milotic.",
            },
          ],
        },
      },
      {
        id: "script-4",
        foe: "Script 4",
        why: "Hide the real win condition until the opponent reveals whether it is better equipped to stop Gholdengo or Milotic.",
        packId: "pack-double-scaler",
        sequence: {
          beats: [
            {
              click: "Hide the real win condition until the opponent reveals whether it is better equipped to stop Gholdengo or Milotic.",
            },
          ],
        },
      },
      {
        id: "script-5",
        foe: "Script 5",
        why: "Force immediate respect with Sand, then use Salamence and Gholdengo to punish the first defensive adaptation.",
        packId: "pack-sand-overdrive",
        sequence: {
          beats: [
            {
              click: "Force immediate respect with Sand, then use Salamence and Gholdengo to punish the first defensive adaptation.",
            },
          ],
        },
      },
    ],
    evidence: {
      source: "Team-building framework and Ringside doubles manual structure supplied by the user; R2 architecture and Coil / Hypnosis Milotic reflect the preceding team-building discussion.",
      caveat: "Training spreads and several held-item choices are recommended architecture-first starting points, not claimed tournament-calced optimizations. Validate exact Champions damage, bulk, and speed benchmarks on-device before locking a tournament registration.",
    },
  } satisfies TeamManual;
