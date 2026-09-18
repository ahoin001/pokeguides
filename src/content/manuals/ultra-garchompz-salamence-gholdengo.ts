import { train } from "@/content/manual-train";
import type {
  ManualFlow,
  ManualPack,
  SlotManual,
  TeamManual,
} from "@/content/manuals";

const BOX = [
  "garchomp-mega-z",
  "salamence-mega",
  "gholdengo",
  "rillaboom",
  "primarina",
  "kingambit",
] as const;

const CORE: [string, string, string] = [
  "salamence-mega",
  "primarina",
  "gholdengo",
];

const ROSTER: SlotManual[] = [
  {
    slug: "garchomp-mega-z",
    title: "Nuclear speed",
    job: "mega",
    literacy: "wallbreaker",
    role: "Immediate special nuke at 203 Spe.",
    primaryJob: "Special breaker / speed",
    ability: "Levitate",
    item: "Garchompite Z",
    itemWhy: "Mega Z turns Chomp into a Modest special breaker; stone locks the Mega once.",
    nature: "Modest",
    training: {
      ...train(2, 0, 0, 32, 0, 32, {
        label: "Modest nuke",
        why: "203 Spe already clears the bracket that matters; buy SpA until a 204–223 target appears.",
        spend: ["SpA", "Spe"],
      }),
      rule: "Modest until a specific 204–223 Spe target forces Timid.",
    },
    moves: [
      { name: "Draco Meteor", why: "Primary nuke into Dragons and neutrals" },
      { name: "Earth Power", why: "Ground STAB that survives Grassy Terrain" },
      { name: "Flamethrower", why: "Steel and Fairy coverage" },
      { name: "Protect", why: "Scout and bank a safe Mega turn" },
    ],
    objective: "Delete a frail threat on entry, then outspeed what remains.",
    howToPlay:
      "Mega when the board is soft. Click Draco or Earth Power into the softest target. Protect once to bait. Do not donate into Ice or Fairy.",
    gives: ["203 Spe special pressure", "Ground via Earth Power", "Steel answer via Flamethrower"],
    answers: ["Frail offense", "Slow Water/Ground cores", "Speed-reliant threes"],
  },
  {
    slug: "salamence-mega",
    title: "Physical Mega wincon",
    job: "mega",
    literacy: "sweeper",
    role: "Intimidate entry into Dragon Dance snowball.",
    primaryJob: "Mega physical wincon",
    ability: "Intimidate",
    item: "Salamencite",
    itemWhy: "Physical Mega wincon; Intimidate before Mega, Aerilate Double-Edge after.",
    nature: "Adamant",
    training: train(2, 32, 0, 0, 0, 32, {
      label: "Adamant DD",
      why: "Atk for Double-Edge after DD; 32 Spe keeps pace with common mid-ladder.",
      spend: ["Atk", "Spe"],
    }),
    moves: [
      { name: "Double-Edge", why: "Aerilate STAB after Mega" },
      { name: "Dragon Dance", why: "The setup win you force them to stop" },
      { name: "Earthquake", why: "Steel and Electric coverage" },
      { name: "Roost", why: "Buy turns after Intimidate or DD" },
    ],
    objective: "Create one safe DD turn, then sweep with Aerilate Double-Edge.",
    howToPlay:
      "Lead or mid-send for Intimidate tax. Mega when DD is free. Roost if they chip; Earthquake Steels. Hide from Ice and Fairy until Primarina or Gholdengo clears space.",
    gives: ["Intimidate", "DD wincon", "Flying Ground typing"],
    answers: ["Physical attackers", "Setup-respecting balance", "Slow special walls"],
  },
  {
    slug: "gholdengo",
    title: "Special glue",
    job: "breaker",
    literacy: "wallbreaker",
    role: "Nasty Plot Steel/Ghost with status blank and Balloon Ground sit.",
    primaryJob: "Special setup breaker",
    ability: "Good as Gold",
    item: "Air Balloon",
    itemWhy: "Temporary Ground immunity muddies EQ reads next to Dragons and Kingambit.",
    nature: "Modest",
    training: {
      ...train(2, 0, 0, 32, 0, 32, {
        label: "Modest NP",
        why: "Power over speculative Spe; ladder already prefers Modest.",
        spend: ["SpA", "Spe"],
      }),
      rule: "Modest until a concrete Spe race justifies Timid.",
    },
    moves: [
      { name: "Make It Rain", why: "Steel STAB into Fairy and Grass" },
      { name: "Shadow Ball", why: "Ghost STAB into Psychic and Ghost" },
      { name: "Nasty Plot", why: "Setup win parallel to Salamence DD" },
      { name: "Recover", why: "Sit status and Ground until Balloon pops" },
    ],
    objective: "Force answers with NP, then Make It Rain / Shadow Ball the soft side.",
    howToPlay:
      "Enter on status or resisted hits. NP when they cannot punish. Recover to keep the Balloon turn useful. Do not greed NP into priority Dark.",
    gives: ["Status immunity", "Air Balloon Ground sit", "Steel/Ghost pressure"],
    answers: ["Status cores", "Fairy/Grass", "Ground-heavy brings"],
  },
  {
    slug: "rillaboom",
    title: "Tempo / priority",
    job: "support",
    literacy: "pivot",
    role: "Grassy Glide punish, Knock strip, U-turn tempo.",
    primaryJob: "Priority / pivot",
    ability: "Grassy Surge",
    item: "Miracle Seed",
    itemWhy: "Boosts Grassy Glide without competing for Life Orb HP.",
    nature: "Adamant",
    training: train(32, 32, 0, 0, 0, 2, {
      label: "Bulky priority",
      why: "HP/Atk for Glide KOs; Spe is irrelevant under priority + terrain.",
      spend: ["HP", "Atk"],
    }),
    moves: [
      { name: "Grassy Glide", why: "Priority into weakened fast threats" },
      { name: "U-turn", why: "Tempo instead of a hard guess" },
      { name: "Knock Off", why: "Strip the item that stalls your wincon" },
      { name: "High Horsepower", why: "Fire and Steel coverage" },
    ],
    objective: "Set terrain, strip items, punish chips with Glide.",
    howToPlay:
      "Lead or mid for terrain and Knock. U-turn into the safer breaker. Glide when they are in KO range. Terrain also softens EQ into your grounded partners.",
    gives: ["Priority", "Knock Off", "Grassy Terrain", "U-turn"],
    answers: ["Frail speed", "Item-dependent walls", "Ground chip"],
  },
  {
    slug: "primarina",
    title: "Bulky stabilizer",
    job: "support",
    literacy: "wall",
    role: "Fairy/Water sit with Encore and Aqua Jet.",
    primaryJob: "Bulky special / stabilizer",
    ability: "Liquid Voice",
    item: "Sitrus Berry",
    itemWhy: "Extends the sit so Encore and Moonblast keep pressuring.",
    nature: "Modest",
    training: train(32, 0, 20, 14, 0, 0, {
      label: "Bulky Modest",
      why: "Not another glass cannon — HP/Def to stay and Encore commitments.",
      spend: ["HP", "Def", "SpA"],
    }),
    moves: [
      { name: "Moonblast", why: "Fairy STAB into Dragons and Dark" },
      { name: "Sparkling Aria", why: "Water STAB and burn clear" },
      { name: "Aqua Jet", why: "Priority into weakened fast foes" },
      { name: "Encore", why: "Lock Protect, DD, SD, or a soft defensive click" },
    ],
    objective: "Stabilize Dragon and Fighting matchups; Encore bad commitments.",
    howToPlay:
      "Send into Dragons and Fighting. Moonblast or Aria as needed. Encore setup or Protect. Aqua Jet finishes chips. Do not force it as a second Spe nuke.",
    gives: ["Fairy", "Water", "Encore", "Aqua Jet"],
    answers: ["Dragon stacks", "Fighting", "Setup spam"],
  },
  {
    slug: "kingambit",
    title: "Endgame cleaner",
    job: "breaker",
    literacy: "sweeper",
    role: "Late Sucker Punch / SD cleaner after trades.",
    primaryJob: "Endgame cleaner",
    ability: "Supreme Overlord",
    item: "Black Glasses",
    itemWhy: "Dark power for Kowtow and Sucker in the last three turns.",
    nature: "Adamant",
    training: train(32, 32, 2, 0, 0, 0, {
      label: "Bulky cleaner",
      why: "Survive to the endgame; Atk for Sucker and Kowtow.",
      spend: ["HP", "Atk"],
    }),
    moves: [
      { name: "Kowtow Cleave", why: "Accurate Dark STAB" },
      { name: "Sucker Punch", why: "Priority that rewrites late HP math" },
      { name: "Iron Head", why: "Fairy and Ice coverage" },
      { name: "Swords Dance", why: "Third setup threat on respect-setup packs" },
    ],
    objective: "Trade early, then clean damaged boards with Sucker / Kowtow.",
    howToPlay:
      "Do not force early. Enter when foes are chipped. Sucker the revenge click. SD only when they cannot punish. Iron Head Fairy.",
    gives: ["Priority Dark", "SD endgame", "Supreme Overlord scaling"],
    answers: ["Weakened fast wincons", "Late 1v1s", "Setup mirrors"],
  },
];

function bySlug(slug: string): SlotManual {
  const hit = ROSTER.find((s) => s.slug === slug);
  if (!hit) throw new Error(`Missing roster slug: ${slug}`);
  return hit;
}

function macroFlow(
  idPrefix: string,
  steps: [{ title: string; when: string; then: string }, { title: string; when: string; then: string }, { title: string; when: string; then: string }],
): ManualFlow {
  const [a, b, c] = steps;
  return {
    id: "macro",
    title: "Package flow",
    lede: "Break → Control → Finish.",
    forks: [
      {
        id: `${idPrefix}-break`,
        when: a.when,
        then: a.then,
        out: "break",
        forks: [
          {
            id: `${idPrefix}-control`,
            when: b.when,
            then: b.then,
            out: "control",
            forks: [
              {
                id: `${idPrefix}-finish`,
                when: c.when,
                then: c.then,
                out: "finish",
              },
            ],
          },
        ],
      },
    ],
  };
}

function phaseFlow(
  id: "lead" | "mid" | "late",
  title: string,
  lede: string,
  forks: ManualFlow["forks"],
): ManualFlow {
  return { id, title, lede, forks };
}

const PACKS: ManualPack[] = [
  {
    id: "delete-offense",
    label: "Delete offense",
    when: "Frail offense, fast attackers, or no clean Chomp answer.",
    identity: "Garchomp breaks → Rillaboom controls → Kingambit finishes.",
    slugs: ["garchomp-mega-z", "rillaboom", "kingambit"],
    megaChoice: "garchomp-mega-z",
    endgameIds: ["garchomp", "kingambit-clean"],
    strategy: {
      opponentPattern: "Frail offense / speed cores / soft Ground-Water without a Chomp answer",
      bring: ["garchomp-mega-z", "rillaboom", "kingambit"],
      purpose: "Delete their fast threats immediately, then clean the leftovers.",
      targets: ["HO", "fast Water/Ground", "item-dependent offense"],
      refuses: ["Hard Chomp checks + Fairy stack", "Trick Room"],
      winCondition: "Chomp removes one; Glide/Knock softens; Sucker cleans.",
      gamePlan: "Break with Mega Z → Control board with Rillaboom → Finish with Kingambit",
      megaChoice: "garchomp-mega-z",
    },
    roles: [
      {
        slug: "garchomp-mega-z",
        macro: "Break",
        micro: "Delete frail offense with Draco / Earth Power",
        gives: "203 Spe special nuke",
      },
      {
        slug: "rillaboom",
        macro: "Control",
        micro: "Glide punish, Knock strip, U-turn tempo",
        gives: "Priority + terrain",
      },
      {
        slug: "kingambit",
        macro: "Finish",
        micro: "Sucker / Kowtow the chipped board",
        gives: "Late priority Dark",
      },
    ],
    coverageNotes: [
      {
        title: "Steel answer",
        body: "Flamethrower from Chomp and High Horsepower from Rilla cover Steels Kingambit hates.",
      },
      {
        title: "Fairy hole",
        body: "No Primarina — refuse heavy Fairy if Chomp cannot force the soft side first.",
        watch: "Moonblast / Play Rough revenge",
      },
    ],
    flows: [
      macroFlow("do", [
        {
          title: "Break",
          when: "Board is soft for Mega Z",
          then: "Mega Garchomp. Draco or Earth Power the frail slot.",
        },
        {
          title: "Control",
          when: "Something is chipped or item-dependent",
          then: "Rillaboom Knock or Glide; U-turn if the slot is wrong.",
        },
        {
          title: "Finish",
          when: "Foes sit in Sucker range",
          then: "Kingambit cleans with Sucker Punch or Kowtow.",
        },
      ]),
      phaseFlow("lead", "Lead", "Open with pressure or terrain.", [
        {
          id: "do-lead-chomp",
          when: "They lead frail or slow",
          then: "Lead Garchomp Z and Mega if safe.",
          send: "garchomp-mega-z",
          move: "Draco Meteor",
        },
        {
          id: "do-lead-rilla",
          when: "They lead a Chomp check",
          then: "Lead Rillaboom for terrain + Knock.",
          send: "rillaboom",
          move: "Knock Off",
        },
        {
          id: "do-lead-gambit",
          when: "They lead a Fairy you cannot click into",
          then: "Do not lead Chomp. Rilla or wait for a better send.",
          why: "Fairy blanks the Break step.",
        },
      ]),
      phaseFlow("mid", "Mid", "Keep tempo after the first KO.", [
        {
          id: "do-mid-glide",
          when: "Fast foe is in Glide range",
          then: "Rillaboom Grassy Glide.",
          move: "Grassy Glide",
          send: "rillaboom",
        },
        {
          id: "do-mid-protect",
          when: "Unsure of the revenge",
          then: "Chomp Protect once, then retarget.",
          move: "Protect",
          send: "garchomp-mega-z",
        },
        {
          id: "do-mid-uturn",
          when: "Wrong Rilla matchup",
          then: "U-turn into Chomp or Gambit.",
          move: "U-turn",
          send: "rillaboom",
        },
      ]),
      phaseFlow("late", "Late", "Hand the board to Kingambit.", [
        {
          id: "do-late-sucker",
          when: "Foe must attack and is chipped",
          then: "Sucker Punch.",
          move: "Sucker Punch",
          send: "kingambit",
        },
        {
          id: "do-late-sd",
          when: "They cannot punish setup",
          then: "Swords Dance then Kowtow.",
          move: "Swords Dance",
          send: "kingambit",
        },
        {
          id: "do-late-iron",
          when: "Fairy left",
          then: "Iron Head — do not Sucker into Fairy.",
          move: "Iron Head",
          send: "kingambit",
        },
      ]),
    ],
    loops: [
      {
        title: "Break → pivot → finish",
        body: "Chomp KO → Rilla U-turn or Glide → Gambit Sucker the revenge click.",
      },
      {
        title: "Knock loop",
        body: "Rilla Knock the stall item → Chomp forces the soft switch → Gambit cleans.",
      },
      {
        title: "Terrain chip",
        body: "Keep Grassy up so Glide always has priority and EQ into your side softens.",
      },
    ],
    hazards: [],
  },
  {
    id: "respect-setup",
    label: "Respect setup",
    when: "They lack one blanket answer to DD, NP, and SD — force a setup dilemma.",
    identity: "Create multiple setup threats → force their answer → exploit the commitment.",
    slugs: ["salamence-mega", "gholdengo", "kingambit"],
    megaChoice: "salamence-mega",
    endgameIds: ["salamence-dd", "kingambit-clean"],
    philosophy:
      "Package A damages progressively. Package B exhausts answers. You are not solving one problem three times — they are.",
    pilot: {
      thesis: "Make them respect Dragon Dance, Nasty Plot, and Swords Dance at once.",
      rule: "When they reveal an answer, do not fight it — pivot to the setup that makes that answer uncomfortable.",
      fail: "Greedy setup into a KO, or stubbornly attacking into the dedicated counter.",
    },
    strategy: {
      opponentPattern: "Balance that stops one setup style but not three different ones",
      bring: ["salamence-mega", "gholdengo", "kingambit"],
      purpose:
        "Create a setup dilemma: they must choose which threat to respect, then you exploit the commitment.",
      targets: [
        "One-wall balance",
        "Passive special sponges",
        "Status cores",
        "Answer-overlap teams",
      ],
      refuses: [
        "Triple setup hate + strong priority Dark",
        "Hard Fairy + Fighting stack",
        "Dedicated stoppers for all three with no overlap to punish",
      ],
      winCondition:
        "One setup sticks after they reveal; the other two punish or finish the answer.",
      gamePlan: "Create opportunity → Set up → Force answer → Pivot → Set up again → Clean",
      megaChoice: "salamence-mega",
    },
    roles: [
      {
        slug: "salamence-mega",
        macro: "Create opportunity",
        micro: "Intimidate tax → safe Dragon Dance when they cannot punish",
        gives: "Physical Mega wincon + flexible Roost",
        threatens: ["Speed", "Physical damage", "Ground coverage", "Long games via Roost"],
      },
      {
        slug: "gholdengo",
        macro: "Force answers",
        micro: "Nasty Plot when status/passive/Balloon buys a free turn",
        gives: "Special setup + Good as Gold + Balloon Ground sit",
        threatens: ["Special damage", "Steel STAB", "Ghost STAB", "Status cores"],
      },
      {
        slug: "kingambit",
        macro: "Clean",
        micro: "Sit back while others fragment answers; SD or Sucker late",
        gives: "Third setup + priority Dark finish",
        threatens: ["Physical nuke", "Dark STAB", "Steel STAB", "Sucker Punch"],
      },
    ],
    coverageNotes: [
      {
        title: "Ground muddle",
        body: "Flying Mence + Balloon Gholdengo make EQ awkward until Balloon pops; then Kingambit needs the Ground answers gone.",
        watch: "Double Ground after Balloon",
      },
      {
        title: "Answer overlap",
        body: "Use Salamence to draw the physical/Fairy answer, then Gholdengo enters into that commitment.",
      },
    ],
    gameStates: [
      {
        id: "setup-opportunity",
        label: "1 · Setup opportunity",
        trigger: "Opponent cannot punish the turn.",
        play: "Set up (DD / NP / SD).",
      },
      {
        id: "force-response",
        label: "2 · Force response",
        trigger: "You already have boosts.",
        play: "Attack or position until they must answer.",
      },
      {
        id: "answer-revealed",
        label: "3 · Answer revealed",
        trigger: "They send the dedicated stopper.",
        play: "Do not fight it — switch to the mon that makes it uncomfortable.",
      },
      {
        id: "endgame",
        label: "4 · Endgame",
        trigger: "Their team is fragmented / chipped.",
        play: "Kingambit enters — Sucker / Kowtow / optional SD.",
      },
    ],
    cheatSheet: [
      {
        situation: "Physical attacker into Salamence",
        thought: "Intimidate → look for DD",
      },
      {
        situation: "Passive Pokémon into Gholdengo",
        thought: "Look for Nasty Plot",
      },
      {
        situation: "Opponent forced to attack Kingambit",
        thought: "Sucker Punch becomes powerful",
      },
      {
        situation: "Salamence answer revealed",
        thought: "Pivot to Gholdengo / Kingambit",
      },
      {
        situation: "Gholdengo answer revealed",
        thought: "Pivot to Salamence / Kingambit",
      },
      {
        situation: "Kingambit answer revealed",
        thought: "Preserve Gambit; use the others",
      },
      {
        situation: "Free setup turn",
        thought: "Set up",
      },
      {
        situation: "Guaranteed KO available",
        thought: "Take the KO instead of boosting",
      },
      {
        situation: "Setup would expose a KO",
        thought: "Don't set up",
      },
      {
        situation: "Opponent heavily weakened",
        thought: "Kingambit endgame",
      },
      {
        situation: "Unsure which threat to preserve",
        thought: "Preserve the one whose answer is already weakened/removed",
      },
    ],
    plan: [
      {
        title: "Preview lists",
        goal: "Name who stops each setup",
        play: "Salamence: Fairy/Ice/phys wall/revenge. Gholdengo: Dark/Ground/Fire/special wall. Kingambit: Fighting/Ground/Fire/setup denial.",
        next: "Find answer overlap",
      },
      {
        title: "Lead",
        goal: "Open the dilemma",
        play: "Physical threat → Mence. Passive lead → Gholdengo. Aggressive / Sucker-vulnerable → Kingambit.",
      },
      {
        title: "Mid",
        goal: "Force and read answers",
        play: "One safe boost → they commit → pivot to the other setup threat.",
      },
      {
        title: "Late",
        goal: "Exhaust answers, then clean",
        play: "Do not force Mence→Ghold→Gambit order. Preserve the live wincon; Kingambit finishes.",
      },
    ],
    flows: [
      {
        id: "macro",
        title: "Package flow",
        lede: "Create opportunity → set up → force answer → exploit → clean. Not Break→Pivot→Clean.",
        forks: [
          {
            id: "rs-preview",
            when: "90s preview",
            then: "List who stops Mence, Gholdengo, and Kingambit. Find overlap.",
            forks: [
              {
                id: "rs-lead-pick",
                when: "Lead chosen",
                then: "Create a free setup turn (Intimidate / Balloon / status blank / chip).",
                forks: [
                  {
                    id: "rs-boost",
                    when: "Free turn exists",
                    then: "+1 Mence, +2 Gholdengo, or +2 Gambit — only if they cannot KO.",
                    forks: [
                      {
                        id: "rs-reveal",
                        when: "They answer the boost",
                        then: "Name the answer. Pivot to the mon it does not stop.",
                        forks: [
                          {
                            id: "rs-clean",
                            when: "Answers exhausted / board soft",
                            then: "Kingambit Sucker / Kowtow — or let the live sweeper close.",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      phaseFlow("lead", "Lead", "Three legitimate leads — pick from preview.", [
        {
          id: "rs-lead-phys",
          when: "Obvious physical threat on their lead",
          then: "Lead Salamence — Intimidate has immediate value.",
          send: "salamence-mega",
          forks: [
            {
              id: "rs-lead-phys-dd",
              when: "They cannot threaten KO after Intimidate",
              then: "Look for Dragon Dance.",
              move: "Dragon Dance",
            },
            {
              id: "rs-lead-phys-atk",
              when: "They can KO on the DD turn",
              then: "Attack or switch — do not greedy DD.",
            },
          ],
        },
        {
          id: "rs-lead-passive",
          when: "No physical threat — opponent looks passive / status-reliant",
          then: "Lead Gholdengo.",
          send: "gholdengo",
          forks: [
            {
              id: "rs-lead-passive-np",
              when: "Free turn (switch, weak hit, blocked status)",
              then: "Nasty Plot.",
              move: "Nasty Plot",
            },
            {
              id: "rs-lead-passive-mir",
              when: "They stay in soft",
              then: "Make It Rain or Shadow Ball.",
              move: "Make It Rain",
            },
          ],
        },
        {
          id: "rs-lead-aggro",
          when: "Neither — they look aggressive / Sucker-vulnerable",
          then: "Lead Kingambit if Fighting response is weak.",
          send: "kingambit",
          why: "Force respect for SD / Sucker without burning Mega early.",
        },
      ]),
      {
        id: "mence",
        title: "Salamence tree",
        lede: "DD only when the worst punish is acceptable — not because you can.",
        forks: [
          {
            id: "rs-mence-intim",
            when: "Salamence enters",
            then: "Intimidate taxes Attack.",
            send: "salamence-mega",
            forks: [
              {
                id: "rs-mence-ko",
                when: "They can immediately threaten KO",
                then: "Do not set up — attack or switch.",
              },
              {
                id: "rs-mence-safe",
                when: "No immediate KO",
                then: "Ask: free DD turn?",
                forks: [
                  {
                    id: "rs-mence-dd",
                    when: "Worst case is chip (~20%)",
                    then: "Dragon Dance.",
                    move: "Dragon Dance",
                    forks: [
                      {
                        id: "rs-mence-ans",
                        when: "They switch to the Mence answer",
                        then: "Great — pivot to Gholdengo or Kingambit.",
                        why: "Answer revealed; do not fight the counter.",
                      },
                      {
                        id: "rs-mence-atk",
                        when: "They attack and you live",
                        then: "Double-Edge / Earthquake — or Roost if chip is high.",
                        move: "Double-Edge",
                      },
                    ],
                  },
                  {
                    id: "rs-mence-nodd",
                    when: "Worst case is Fairy in / KO",
                    then: "Attack or leave. Setup is a tool, not the objective.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "gholdengo",
        title: "Gholdengo tree",
        lede: "NP when they switch, click weak, or waste status into Good as Gold. +2 is usually enough.",
        forks: [
          {
            id: "rs-ghold-in",
            when: "Gholdengo on the field",
            then: "Can they threaten KO?",
            send: "gholdengo",
            forks: [
              {
                id: "rs-ghold-ko",
                when: "Yes — real damage incoming",
                then: "Attack or switch. Do not NP.",
              },
              {
                id: "rs-ghold-free",
                when: "No — free turn (passive / blocked status / soft switch)",
                then: "Nasty Plot.",
                move: "Nasty Plot",
                forks: [
                  {
                    id: "rs-ghold-plus2",
                    when: "+2 Gholdengo",
                    then: "What switches in?",
                    forks: [
                      {
                        id: "rs-ghold-dark",
                        when: "Dark answer",
                        then: "Shadow Ball or pivot — do not NP again.",
                        move: "Shadow Ball",
                      },
                      {
                        id: "rs-ghold-ground",
                        when: "Ground answer",
                        then: "Make It Rain if Balloon up; else leave.",
                        move: "Make It Rain",
                        why: "Do not reveal Balloon unless needed.",
                      },
                      {
                        id: "rs-ghold-fast",
                        when: "Fast attacker",
                        then: "Can they KO? If yes attack; if no, one hit then evaluate.",
                      },
                    ],
                  },
                ],
              },
              {
                id: "rs-ghold-status",
                when: "They click status into Good as Gold",
                then: "Free turn — Nasty Plot.",
                move: "Nasty Plot",
              },
              {
                id: "rs-ghold-recover",
                when: "Damaged vs slow wall that cannot KO",
                then: "Recover to keep the setup threat alive.",
                move: "Recover",
                why: "If Recover lets a dangerous attacker in free, attack instead.",
              },
            ],
          },
        ],
      },
      {
        id: "kingambit",
        title: "Kingambit tree",
        lede: "Ideal entry is late — after Mence/Ghold fragment physical and special checks.",
        forks: [
          {
            id: "rs-gambit-in",
            when: "Kingambit enters",
            then: "Can they KO?",
            send: "kingambit",
            forks: [
              {
                id: "rs-gambit-ko",
                when: "Yes — Fighting / strong physical",
                then: "Attack or switch. Do not SD into the stopper.",
              },
              {
                id: "rs-gambit-sd",
                when: "No — soft board / forced attack",
                then: "Swords Dance if safe; else Kowtow / Sucker.",
                forks: [
                  {
                    id: "rs-gambit-dance",
                    when: "Safe SD turn",
                    then: "Swords Dance.",
                    move: "Swords Dance",
                  },
                  {
                    id: "rs-gambit-sucker",
                    when: "Foe must click damage / chipped fast mon",
                    then: "Sucker Punch.",
                    move: "Sucker Punch",
                  },
                  {
                    id: "rs-gambit-kowtow",
                    when: "Neutral switch or wall chip",
                    then: "Kowtow Cleave.",
                    move: "Kowtow Cleave",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "wincon",
        title: "Which setup wins?",
        lede: "Do not force Mence → Ghold → Gambit. Preserve the live wincon.",
        forks: [
          {
            id: "rs-win-easiest",
            when: "Which mon has the easiest setup right now?",
            then: "Set that one up first.",
            forks: [
              {
                id: "rs-win-mence-ans",
                when: "They reveal a Mence answer",
                then: "Pivot to Gholdengo; set up there.",
                send: "gholdengo",
              },
              {
                id: "rs-win-ghold-ans",
                when: "They reveal a Gholdengo answer",
                then: "Pivot to Kingambit (or Mence if that answer is soft to DD).",
                send: "kingambit",
              },
              {
                id: "rs-win-gambit-ans",
                when: "They reveal a Kingambit answer",
                then: "Preserve Gambit — use Mence/Ghold to remove that piece.",
              },
              {
                id: "rs-win-sweep",
                when: "One sweeper is already rolling",
                then: "Do not force the third setup — take KOs.",
                why: "Setup is a tool. Guaranteed KO beats another boost.",
              },
            ],
          },
        ],
      },
      phaseFlow("mid", "Mid", "Setup chain and pivots.", [
        {
          id: "rs-mid-chain",
          when: "Mence drew the Fairy / phys wall",
          then: "Leave into Gholdengo — their answer faces the wrong problem.",
          send: "gholdengo",
        },
        {
          id: "rs-mid-np",
          when: "They switch or click weak into Gholdengo",
          then: "Nasty Plot once.",
          move: "Nasty Plot",
          send: "gholdengo",
        },
        {
          id: "rs-mid-take-ko",
          when: "Foe sits at ~35% and Double-Edge KOs",
          then: "Take the KO — skip DD.",
          move: "Double-Edge",
          send: "salamence-mega",
        },
      ]),
      phaseFlow("late", "Late", "Endgame classification.", [
        {
          id: "rs-late-gambit",
          when: "Board is chipped; Fighting answer gone",
          then: "Kingambit — SD if free, else Sucker / Kowtow.",
          send: "kingambit",
        },
        {
          id: "rs-late-mence",
          when: "Mence is the live wincon",
          then: "Double-Edge / EQ — do not donate into Ice/Fairy.",
          move: "Double-Edge",
          send: "salamence-mega",
        },
        {
          id: "rs-late-ghold",
          when: "Gholdengo is +2 and healthy",
          then: "Make It Rain / Shadow Ball — one NP is enough.",
          move: "Make It Rain",
          send: "gholdengo",
        },
      ]),
    ],
    loops: [
      {
        title: "Mental loop",
        body: "Create opportunity → Set up → Force answer → Identify → Don't fight it → Switch setup threat → Set up again → Defense collapses → Kingambit clean.",
      },
      {
        title: "Answer overlap",
        body: "Mence draws the stopper → commit revealed → Gholdengo enters into that Pokémon.",
      },
      {
        title: "Free-turn test",
        body: "Before DD/NP/SD: what is the worst punish? Chip → ok. KO or hard counter in → don't.",
      },
      {
        title: "Uncertainty tax",
        body: "Sometimes just attack. Making them guess DD / NP / SD has value even without the boost.",
      },
      {
        title: "Never",
        body: "DD every free chance. NP twice greedily. SD into Fighting. Fight the dedicated answer. Reveal Gambit early when it is the endgame.",
      },
    ],
    hazards: [],
  },
  {
    id: "balanced-pressure",
    label: "Control the board",
    when: "Preview is unclear — default / blind balanced bring.",
    identity:
      "Salamence controls physical threats → Primarina stabilizes and punishes overcommitment → Gholdengo exploits passive turns as the special wincon.",
    slugs: ["salamence-mega", "primarina", "gholdengo"],
    megaChoice: "salamence-mega",
    endgameIds: ["salamence-dd"],
    philosophy:
      "You are not trying to overwhelm immediately like Package A, and not forcing a three-way setup dilemma like Package B. Make good trades, keep defensive options, and gradually make one of the three impossible to stop.",
    pilot: {
      thesis:
        "Stabilize → gain information → improve positioning → apply pressure → identify the endgame.",
      rule: "Every turn: who has positional advantage right now — and which of my three currently has the best remaining endgame?",
      fail: "Sacrificing options for chip like Package A, greedy setup into a KO, or fighting a dedicated answer instead of rotating the triangle.",
    },
    strategy: {
      opponentPattern: "Standard balance / unclear preview / midladder that does not scream a specific hole",
      bring: ["salamence-mega", "primarina", "gholdengo"],
      purpose:
        "Control the matchup until one of your three can take over. Tools for many situations without needing a hard read of how the battle unfolds.",
      targets: [
        "Midladder balance",
        "Dragon stacks",
        "Status + physical mixes",
        "Teams without a blanket answer to Mence + Prima + Gholdengo",
      ],
      refuses: [
        "Hard Fairy + Fighting that blanks Mence and Gholdengo together",
        "Dedicated stoppers for all three with no rotation to punish",
      ],
      winCondition:
        "One of the three loses its remaining checks — then stop playing balanced and convert that mon into the win.",
      gamePlan: "Physical control → Matchup stabilize / Encore → Special pressure → Find the wincon",
      mantra:
        "Stabilize → gain information → improve positioning → apply pressure → identify the endgame.",
      contrast:
        "Package A (Chomp / Rilla / Gambit) breaks them down. Package B (Mence / Ghold / Gambit) exhausts their answers. Package C controls until one of three takes over — the blind/default balanced bring.",
      defaultLead: "salamence-mega",
      defaultLeadWhy:
        "Intimidate gives information and defensive flexibility immediately. You do not have to commit to offense — you observe.",
      previewQuestions: [
        "What on their team hits me physically?",
        "What hits me specially?",
        "What can set up?",
        "What is their best answer to each of my three?",
      ],
      turnChecklist: [
        "What can kill my active Pokémon?",
        "What is their safest switch?",
        "Do I have a free setup turn?",
        "Do I need to preserve this Pokémon?",
        "Which of my three currently has the best endgame?",
      ],
      healthPriority: [
        {
          slug: "salamence-mega",
          why: "Intimidate opportunities, Dragon Dance, Roost, and physical checking.",
        },
        {
          slug: "primarina",
          why: "Stabilizer that must switch into threats; Sitrus longevity; Aqua Jet late.",
        },
        {
          slug: "gholdengo",
          why: "Needs setup windows; Recover keeps the special wincon live — do not chip it for free.",
        },
      ],
      preserveRule:
        "Package A is comfortable trading Chomp after it breaks. Package C prefers keeping all three healthy enough that you retain the ability to choose your response.",
      megaChoice: "salamence-mega",
    },
    roles: [
      {
        slug: "salamence-mega",
        macro: "Physical control",
        micro: "Intimidate tax → evaluate → DD or pivot",
        primary: "Physical pressure / setup",
        secondary: "Intimidate + Ground immunity + Roost",
        gives: "Mega wincon + scout lead",
        threatens: ["Physical attackers", "Speed via DD", "Ground coverage", "Long games via Roost"],
        watch: [
          "Do not DD into a special attacker Intimidate does not touch",
          "Fairy answers — rotate to Primarina, do not stubbornly stay",
        ],
        states: [
          {
            id: "mence-defend",
            label: "Defend",
            when: "Physical threat is on the field and damage is unclear",
            play: "Intimidate / Roost — evaluate before committing.",
          },
          {
            id: "mence-pressure",
            label: "Pressure",
            when: "You can attack or force a switch without dying",
            play: "Attack / Earthquake — force the answer.",
          },
          {
            id: "mence-sweep",
            label: "Sweep",
            when: "They cannot KO after Intimidate and physical checks are soft",
            play: "Dragon Dance → Double-Edge / EQ.",
          },
        ],
      },
      {
        slug: "primarina",
        macro: "Matchup control",
        micro: "Reset button — Encore commitments, Fairy/Water sit, Aqua Jet cleans",
        primary: "Defensive stabilizer",
        secondary: "Fairy pressure + Encore + priority",
        gives: "Fairy Water glue + disruption",
        threatens: ["Dragons", "Setup spam", "Protect loops", "Chipped fast foes"],
        watch: [
          "Encore damaging moves that they happily repeat",
          "Do not throw Primarina away — it is the reset button for the whole three",
        ],
        states: [
          {
            id: "prima-check",
            label: "Check",
            when: "Salamence (or Gholdengo) faces an awkward matchup",
            play: "Switch in safely — Moonblast / Aria as needed.",
          },
          {
            id: "prima-punish",
            label: "Punish",
            when: "They click setup, Protect, or another predictable non-attack",
            play: "Encore — lock the commitment, then exploit.",
          },
          {
            id: "prima-clean",
            label: "Clean",
            when: "Foes are chipped and speed races matter",
            play: "Aqua Jet / Moonblast — convert chip into KOs.",
          },
        ],
      },
      {
        slug: "gholdengo",
        macro: "Special control",
        micro: "Pressure release — NP when they go passive",
        primary: "Special breaker / setup",
        secondary: "Status immunity + Balloon Ground sit",
        gives: "Special wincon + Good as Gold",
        threatens: ["Passive play", "Status cores", "Steel STAB", "Ghost STAB"],
        watch: [
          "Do not NP into a faster KO",
          "When threatened, rotate to Primarina — Gholdengo can return later",
        ],
        states: [
          {
            id: "ghold-pivot",
            label: "Pivot",
            when: "Opponent became passive or does not threaten KO",
            play: "Enter safely — Recover if Balloon still buys time.",
          },
          {
            id: "ghold-setup",
            label: "Setup",
            when: "Free turn exists",
            play: "Nasty Plot → force the response.",
          },
          {
            id: "ghold-clean",
            label: "Clean",
            when: "+2 and checks are gone or soft",
            play: "Make It Rain / Shadow Ball — close.",
          },
        ],
      },
    ],
    coverageNotes: [
      {
        title: "Ground answers",
        body: "Flying Mence + Balloon Gholdengo; Primarina still takes EQ after Balloon pops.",
      },
      {
        title: "Dragon insurance",
        body: "Primarina Moonblast is why this three sits Dragons without Kingambit.",
      },
      {
        title: "Priority gap vs Package A",
        body: "Aqua Jet is your late priority — chip conversion matters more here than Glide / Sucker.",
        watch: "Fast healthy revenge",
      },
    ],
    decisionRules: [
      {
        id: "dd",
        title: "When to Dragon Dance",
        ask: "Did Intimidate actually make their damage manageable — and can they still KO?",
        good: "Physical attacker → Intimidate → damage manageable → they cannot KO → Dragon Dance.",
        bad: "Strong special attacker → Intimidate does nothing → they threaten huge damage → DD into a KO.",
      },
      {
        id: "encore",
        title: "When to Encore",
        ask: "Did they just give me a move that becomes terrible if repeated?",
        good: "Dragon Dance / Swords Dance / Nasty Plot / Protect / Substitute → Encore → they are committed → exploit.",
        bad: "Damaging move → Encore → they keep attacking → you gained little.",
      },
      {
        id: "np",
        title: "When to Nasty Plot",
        ask: "Do I have a setup opportunity — or only the setup move?",
        good: "Opponent passive / cannot threaten KO → Nasty Plot → force response.",
        bad: "Faster attacker can KO → NP into a KO.",
      },
    ],
    gameStates: [
      {
        id: "scout-pressure",
        label: "Scout → pressure",
        trigger: "Salamence just Intimidated.",
        play: "Evaluate their move. Stay and pressure if safe; Primarina if the matchup is awkward.",
        slug: "salamence-mega",
      },
      {
        id: "reset",
        label: "Reset button",
        trigger: "Active mon faces an unfavorable matchup.",
        play: "Ask: does Primarina make this simpler? If yes, go Primarina.",
        slug: "primarina",
      },
      {
        id: "pressure-valve",
        label: "Pressure valve",
        trigger: "Opponent went passive or cannot threaten Gholdengo.",
        play: "Gholdengo enters → look for Nasty Plot.",
        slug: "gholdengo",
      },
      {
        id: "triangle",
        label: "Decision triangle",
        trigger: "One mon is uncomfortable.",
        play: "Rotate to another corner — do not force one mon to do everything.",
      },
      {
        id: "wincon-ask",
        label: "Who is my wincon?",
        trigger: "Midgame — checks are disappearing.",
        play: "Preserve the mon with the fewest remaining checks; remove those checks; convert.",
      },
      {
        id: "momentum-loss",
        label: "Regain momentum",
        trigger: "Opponent has momentum.",
        play: "Primarina stabilize → Salamence physical pressure → Gholdengo special pressure.",
      },
    ],
    cheatSheet: [
      {
        situation: "Physical attacker appears",
        thought: "Salamence / Intimidate",
      },
      {
        situation: "Salamence gets an unfavorable matchup",
        thought: "Primarina",
      },
      {
        situation: "Opponent uses predictable setup / Protect",
        thought: "Encore",
      },
      {
        situation: "Opponent is passive",
        thought: "Gholdengo",
      },
      {
        situation: "Gholdengo gets a free turn",
        thought: "Nasty Plot",
      },
      {
        situation: "Opponent is weakened",
        thought: "Aqua Jet can convert damage into KOs",
      },
      {
        situation: "You don't know what they'll do",
        thought: "Preserve positioning — do not overpredict",
      },
      {
        situation: "One Pokémon's checks are disappearing",
        thought: "That Pokémon becomes your win condition",
      },
      {
        situation: "Your active is threatened",
        thought: "Don't stay just because you want setup",
      },
      {
        situation: "You're ahead",
        thought: "Preserve three-way flexibility",
      },
      {
        situation: "You're behind",
        thought: "Look for Encore / setup / matchup reversal",
      },
    ],
    plan: [
      {
        title: "Preview map",
        goal: "Build a matchup map — not just a lead",
        play: "List physical threats, special threats, setup threats, and their best answer to each of your three.",
        next: "Choose lead",
      },
      {
        title: "Lead",
        goal: "Open with information",
        play: "Default Salamence unless preview screams Primarina (Dragon/Fighting) or Gholdengo (status/Fairy).",
      },
      {
        title: "Mid",
        goal: "Force commitments, learn structure",
        play: "Scout → pressure → Primarina reset → Gholdengo valve. Every switch teaches item, speed, and preferred answers.",
      },
      {
        title: "Late",
        goal: "Convert the live wincon",
        play: "Count remaining checks. Boost or Aqua Jet the mon whose answers are gone — stop playing balanced.",
      },
    ],
    flows: [
      {
        id: "macro",
        title: "Control the board",
        lede: "Preview map → stabilize → force responses → learn structure → find the wincon → clean.",
        forks: [
          {
            id: "bp-preview",
            when: "Team preview",
            then: "Identify physical attackers, special attackers, setup threats, and their answers to each of your three.",
            forks: [
              {
                id: "bp-lead",
                when: "Choose lead",
                then: "Default Salamence for Intimidate scouting unless preview forces Prima or Gholdengo.",
                forks: [
                  {
                    id: "bp-stabilize",
                    when: "Board opened",
                    then: "Create a good switch, apply pressure, then ask who has positional edge.",
                    forks: [
                      {
                        id: "bp-pressure-fork",
                        when: "Pressure available",
                        then: "Mence DD, Primarina Encore, or Gholdengo NP — only if the turn is free.",
                        forks: [
                          {
                            id: "bp-response",
                            when: "Opponent responds",
                            then: "Maintain favorable positioning. Update the matchup map.",
                            forks: [
                              {
                                id: "bp-wincon",
                                when: "One mon has the fewest remaining checks",
                                then: "Preserve it, remove those checks, convert — stop rotating for balance.",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      phaseFlow("lead", "Lead", "Default Salamence — Intimidate first, commit second.", [
        {
          id: "bp-lead-mence",
          when: "Physical or neutral lead — or unclear",
          then: "Lead Salamence. Intimidate, then evaluate before DD.",
          send: "salamence-mega",
          forks: [
            {
              id: "bp-lead-phys",
              when: "They led a physical attacker",
              then: "Evaluate damage. Safe DD if they cannot KO; else attack or switch.",
              move: "Dragon Dance",
            },
            {
              id: "bp-lead-spec",
              when: "They led a special attacker",
              then: "Intimidate does little — Primarina often simplifies.",
              send: "primarina",
            },
            {
              id: "bp-lead-passive",
              when: "They led a passive Pokémon",
              then: "Consider DD if free; otherwise stay flexible.",
              move: "Dragon Dance",
            },
          ],
        },
        {
          id: "bp-lead-prima",
          when: "Dragon or Fighting lead",
          then: "Lead Primarina — Moonblast / stabilize immediately.",
          send: "primarina",
          move: "Moonblast",
        },
        {
          id: "bp-lead-ghold",
          when: "Status or Fairy lead",
          then: "Lead Gholdengo — Good as Gold / special pressure.",
          send: "gholdengo",
        },
      ]),
      phaseFlow("mid", "Mid", "Triangle rotation — reset, then pressure.", [
        {
          id: "bp-mid-scout",
          when: "Salamence is active after Intimidate",
          then: "Can Mence stay? If yes, pressure or DD. If no, Primarina.",
          send: "salamence-mega",
          forks: [
            {
              id: "bp-mid-stay",
              when: "Matchup is fine",
              then: "DD if free, otherwise attack.",
              move: "Dragon Dance",
            },
            {
              id: "bp-mid-reset",
              when: "Matchup is awkward (e.g. Fairy)",
              then: "Primarina — does this make the board simpler?",
              send: "primarina",
            },
          ],
        },
        {
          id: "bp-mid-encore",
          when: "They Protect or set up",
          then: "Encore only if the lock creates board advantage.",
          move: "Encore",
          send: "primarina",
          forks: [
            {
              id: "bp-mid-encore-exploit",
              when: "They are locked",
              then: "Salamence DD or Gholdengo NP on the free turn.",
            },
          ],
        },
        {
          id: "bp-mid-valve",
          when: "Opponent went passive or soft into Steel/Ghost",
          then: "Gholdengo — can I force them to react? Look for NP.",
          send: "gholdengo",
          move: "Nasty Plot",
        },
        {
          id: "bp-mid-return",
          when: "Gholdengo is threatened",
          then: "Primarina — do not force Gholdengo to stay. Learn their answer, return later.",
          send: "primarina",
        },
        {
          id: "bp-mid-steel",
          when: "Passive Steel blanks Primarina",
          then: "Gholdengo NP into Make It Rain / Shadow Ball.",
          send: "gholdengo",
          move: "Nasty Plot",
        },
      ]),
      phaseFlow("late", "Late", "Count remaining checks — convert the live wincon.", [
        {
          id: "bp-late-mence",
          when: "Salamence checks are gone or soft",
          then: "Preserve Mence → Dragon Dance → clean.",
          move: "Dragon Dance",
          send: "salamence-mega",
        },
        {
          id: "bp-late-ghold",
          when: "Gholdengo checks are gone",
          then: "Preserve Gholdengo → Nasty Plot → Make It Rain.",
          move: "Nasty Plot",
          send: "gholdengo",
        },
        {
          id: "bp-late-jet",
          when: "Board is chipped and speed races matter",
          then: "Primarina Aqua Jet / Moonblast — convert chip into KOs.",
          move: "Aqua Jet",
          send: "primarina",
        },
      ]),
      {
        id: "safe-hierarchy",
        title: "When unsure",
        lede: "Safe-move hierarchy — avoid losing to overprediction.",
        forks: [
          {
            id: "bp-safe-ko",
            when: "Can I get a KO?",
            then: "Usually take it.",
            forks: [
              {
                id: "bp-safe-setup",
                when: "No KO — can I set up safely?",
                then: "Consider DD / NP / Encore.",
                forks: [
                  {
                    id: "bp-safe-switch",
                    when: "No free setup — can I make a safe switch?",
                    then: "Preserve structure.",
                    forks: [
                      {
                        id: "bp-safe-info",
                        when: "Still unsure",
                        then: "Gather information (positioning / Encore). High-risk prediction is last.",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    loops: [
      {
        title: "Scout → pressure",
        body: "Salamence Intimidate → evaluate their move → stay and pressure if safe, or Primarina if not. Repeat: who has positional advantage?",
      },
      {
        title: "Three-step cycle",
        body: "If when: Mence applies physical pressure. When: they bring special/anti-Mence. Then: Primarina stabilizes. When: they become predictable. Then: Gholdengo Nasty Plot. The cycle can reverse.",
      },
      {
        title: "Encore → exploit",
        body: "If when: they click setup or Protect. Then: Encore only if the lock is terrible for them. Then: DD or NP on the free turn.",
      },
      {
        title: "Gholdengo → Primarina return",
        body: "If when: Gholdengo is threatened. Then: Primarina. Their response reveals information — Gholdengo returns later. Do not force one linear plan.",
      },
      {
        title: "Force commitment",
        body: "Make a safe positioning play → they respond and commit → choose the mon that exploits that commitment → repeat.",
      },
      {
        title: "Information loop",
        body: "Every turn updates speed, damage, and switch info. By turns 5–7 you should know items, speed relations, preferred switches, and emergency checks.",
      },
    ],
    hazards: [
      {
        title: "Do not sacrifice options",
        body: "Healthy three-way flexibility is the package's resource. Chip trades that delete a rotation path are Package A thinking.",
        rule: "Preserve the ability to choose your response.",
      },
      {
        title: "Setup ≠ opportunity",
        body: "Having Dragon Dance or Nasty Plot is not the same as having a free turn to click it.",
        watch: "Greedy DD / NP into KO",
      },
    ],
  },
  {
    id: "anti-ground",
    label: "Anti-Ground",
    when: "Ground-heavy or bulky item cores on preview.",
    identity: "Balloon Steel + terrain tempo + Fairy Water glue.",
    slugs: ["gholdengo", "rillaboom", "primarina"],
    endgameIds: [],
    strategy: {
      opponentPattern: "Ground spam, bulky Water/Ground, item-reliant walls",
      bring: ["gholdengo", "rillaboom", "primarina"],
      purpose: "Sit Ground, strip items, and pressure with Grass/Fairy/Water/Steel.",
      targets: ["Hippo cores", "EQ spam", "Sitrus / Lefties walls"],
      refuses: ["Heavy Fire + Ice with no Ground to punish", "Priority Dark into Gholdengo"],
      winCondition: "Knock + terrain softens; Gholdengo or Primarina closes.",
      gamePlan: "Ground sit + Steel → Terrain tempo / Knock → Fairy Water glue",
    },
    roles: [
      {
        slug: "gholdengo",
        macro: "Sit",
        micro: "Balloon Ground sit into NP / Make It Rain",
        gives: "Temporary Ground immunity",
      },
      {
        slug: "rillaboom",
        macro: "Tempo",
        micro: "Knock Off + Glide + High Horsepower",
        gives: "Priority and item strip",
      },
      {
        slug: "primarina",
        macro: "Glue",
        micro: "Moonblast Dragons; Aria Fire; Encore",
        gives: "Fairy Water stabilizer",
      },
    ],
    coverageNotes: [
      {
        title: "No Mega",
        body: "This three spends no Mega — fine when their stone already answers your Dragons.",
      },
      {
        title: "Fire hole",
        body: "Primarina Aria and Rilla coverage must respect Fire; do not greed Gholdengo into it.",
        watch: "Flash Fire / sun Fire",
      },
    ],
    flows: [
      macroFlow("ag", [
        {
          title: "Sit",
          when: "Ground is on the field",
          then: "Gholdengo enters on Balloon.",
        },
        {
          title: "Tempo",
          when: "Item or Water/Ground is awkward",
          then: "Rillaboom Knock / Glide / High Horsepower.",
        },
        {
          title: "Glue",
          when: "Dragon or Fighting appears",
          then: "Primarina Moonblast or Encore.",
        },
      ]),
      phaseFlow("lead", "Lead", "Contest Ground or set terrain.", [
        {
          id: "ag-lead-ghold",
          when: "Ground lead",
          then: "Lead Gholdengo on Balloon.",
          send: "gholdengo",
        },
        {
          id: "ag-lead-rilla",
          when: "Water or item wall lead",
          then: "Lead Rillaboom.",
          send: "rillaboom",
          move: "Knock Off",
        },
        {
          id: "ag-lead-prima",
          when: "Dragon lead",
          then: "Lead Primarina.",
          send: "primarina",
          move: "Moonblast",
        },
      ]),
      phaseFlow("mid", "Mid", "Strip, then setup or Encore.", [
        {
          id: "ag-mid-knock",
          when: "Sitrus / Balloon / Lefties up",
          then: "Knock Off.",
          move: "Knock Off",
          send: "rillaboom",
        },
        {
          id: "ag-mid-np",
          when: "Ground is answered",
          then: "Gholdengo Nasty Plot.",
          move: "Nasty Plot",
          send: "gholdengo",
        },
        {
          id: "ag-mid-encore",
          when: "They lock a soft move",
          then: "Encore.",
          move: "Encore",
          send: "primarina",
        },
      ]),
      phaseFlow("late", "Late", "Close without a Mega.", [
        {
          id: "ag-late-mir",
          when: "Gholdengo boosted",
          then: "Make It Rain.",
          move: "Make It Rain",
          send: "gholdengo",
        },
        {
          id: "ag-late-glide",
          when: "Foe in priority range",
          then: "Grassy Glide or Aqua Jet.",
          move: "Grassy Glide",
          send: "rillaboom",
        },
        {
          id: "ag-late-aria",
          when: "Fire left",
          then: "Sparkling Aria.",
          move: "Sparkling Aria",
          send: "primarina",
        },
      ]),
    ],
    loops: [
      {
        title: "Knock → NP",
        body: "Rilla Knock the sit item → Gholdengo NP on the forced switch.",
      },
      {
        title: "Terrain soft EQ",
        body: "Keep Grassy up so residual Ground into Primarina hurts less.",
      },
      {
        title: "Encore pivot",
        body: "Encore Protect → Rilla Glide or Gholdengo free turn.",
      },
    ],
    hazards: [],
  },
  {
    id: "dragon-trap",
    label: "Dragon trap",
    when: "Their six is built to punish Dragons.",
    identity: "Immediate special Chomp + Fairy insurance + late Sucker.",
    slugs: ["garchomp-mega-z", "primarina", "kingambit"],
    megaChoice: "garchomp-mega-z",
    endgameIds: ["garchomp", "kingambit-clean"],
    strategy: {
      opponentPattern: "Ice/Fairy tools aimed at Dragon Megas; multi-Dragon hate",
      bring: ["garchomp-mega-z", "primarina", "kingambit"],
      purpose: "Keep special Dragon pressure without leaning on Salamence.",
      targets: ["Dragon-punish balance", "Ice revenge", "Fighting into Steel"],
      refuses: ["Hard Chomp + Primarina blank (e.g. dual Steel special walls)"],
      winCondition: "Chomp deletes one; Primarina walls Dragons; Gambit Suckers the end.",
      gamePlan: "Immediate special → Dragon insurance → Late Sucker",
      megaChoice: "garchomp-mega-z",
    },
    roles: [
      {
        slug: "garchomp-mega-z",
        macro: "Break",
        micro: "Immediate Modest special pressure",
        gives: "Fast Mega nuke",
      },
      {
        slug: "primarina",
        macro: "Insurance",
        micro: "Moonblast Dragons; Encore setup",
        gives: "Fairy answer so you skip Salamence",
      },
      {
        slug: "kingambit",
        macro: "Finish",
        micro: "Sucker Punch the weakened revenge",
        gives: "Endgame priority",
      },
    ],
    coverageNotes: [
      {
        title: "Why no Mence",
        body: "Primarina is the Dragon insurance — you are not forced to Mega Salamence into Ice.",
      },
      {
        title: "Ground weakness",
        body: "Kingambit and Primarina both fear Ground; Chomp Levitate helps only while it is out.",
        watch: "EQ into the backline",
      },
    ],
    flows: [
      macroFlow("dt", [
        {
          title: "Break",
          when: "Soft target for Mega Z",
          then: "Garchomp Draco / Earth Power / Flamethrower.",
        },
        {
          title: "Insurance",
          when: "Dragon or Fighting appears",
          then: "Primarina Moonblast / Encore.",
        },
        {
          title: "Finish",
          when: "Board is chipped",
          then: "Kingambit Sucker or Kowtow.",
        },
      ]),
      phaseFlow("lead", "Lead", "Nuke or Fairy sit.", [
        {
          id: "dt-lead-chomp",
          when: "No Ice/Fairy lead",
          then: "Lead Garchomp Z.",
          send: "garchomp-mega-z",
        },
        {
          id: "dt-lead-prima",
          when: "Dragon lead",
          then: "Lead Primarina.",
          send: "primarina",
          move: "Moonblast",
        },
        {
          id: "dt-lead-gambit",
          when: "Fairy lead that blanks Chomp",
          then: "Lead Kingambit or Primarina — do not donate Mega.",
          send: "kingambit",
        },
      ]),
      phaseFlow("mid", "Mid", "Trade into a cleaner board.", [
        {
          id: "dt-mid-flame",
          when: "Steel switch",
          then: "Flamethrower.",
          move: "Flamethrower",
          send: "garchomp-mega-z",
        },
        {
          id: "dt-mid-encore",
          when: "They DD or Protect",
          then: "Encore.",
          move: "Encore",
          send: "primarina",
        },
        {
          id: "dt-mid-protect",
          when: "Revenge unclear",
          then: "Chomp Protect, then retarget.",
          move: "Protect",
          send: "garchomp-mega-z",
        },
      ]),
      phaseFlow("late", "Late", "Sucker the last revenge.", [
        {
          id: "dt-late-sucker",
          when: "Foe must attack",
          then: "Sucker Punch.",
          move: "Sucker Punch",
          send: "kingambit",
        },
        {
          id: "dt-late-jet",
          when: "Fast chip left",
          then: "Aqua Jet.",
          move: "Aqua Jet",
          send: "primarina",
        },
        {
          id: "dt-late-kowtow",
          when: "They click status or switch",
          then: "Kowtow Cleave.",
          move: "Kowtow Cleave",
          send: "kingambit",
        },
      ]),
    ],
    loops: [
      {
        title: "Nuke → Fairy sit",
        body: "Chomp KO → Primarina takes the Dragon revenge → Gambit cleans.",
      },
      {
        title: "Encore → Sucker",
        body: "Encore a soft click → Kingambit free damage or SD.",
      },
      {
        title: "Flamethrower bridge",
        body: "Steel blanks Dark — Chomp Flamethrower before Gambit enters.",
      },
    ],
    hazards: [],
  },
];

export const ULTRA_GARCHOMPZ_SALAMENCE_GHOLDENGO_MANUAL: TeamManual = {
  id: "ultra-garchompz-salamence-gholdengo",
  title: "Ultra Ball Toolbox",
  lede: "Six Pokémon, five preview threes. Pick the package that bullies their structure — not your favorite three.",
  sixSummary:
    "Three endgames (Mega Chomp, Mega Mence DD, Kingambit clean) share one registered six. Preview asks which package of three bullies their structure — then play that three’s win path.",
  philosophy:
    "Endgames are Garchomp nuke, Salamence DD, or Kingambit clean. Preview asks which path their six forces.",
  archetype: "balance",
  family: "clock",
  pilot: {
    thesis: "Read what they bully → bring the three that bullies it back.",
    rule: "One Mega per battle; Modest Chomp until a 204 Spe target appears.",
    fail: "Bringing both stones into a board that only needs one — or Timid for no race.",
  },
  slugs: CORE,
  meta: "Season 6 M-C Singles · as of 2026-09-17 · classroom Ultra Ball six",
  relatedLessons: ["preview", "speed", "building"],
  setsNote: "SP spreads are teaching baselines — re-benchmark before locking every point.",
  box: [...BOX],
  roster: ROSTER,
  core: CORE,
  slots: CORE.map(bySlug),
  construction: {
    thesis:
      "Build a preview toolbox with three endgames and five packages — not a paste of top usage.",
    method:
      "Start from ladder partners and item modes, then keep only pieces that create distinct threes.",
    winCondition: "Force a soft board, then close with Chomp, Mence DD, or Gambit Sucker.",
    endgames: [
      {
        id: "garchomp",
        label: "Garchomp wins",
        path: "garchomp-mega-z",
        how: "Safe Mega entry → delete one → outspeed what remains.",
      },
      {
        id: "salamence-dd",
        label: "Salamence DD",
        path: "salamence-mega",
        how: "Intimidate → free DD → Aerilate Double-Edge sweep.",
      },
      {
        id: "kingambit-clean",
        label: "Kingambit clean",
        path: "kingambit",
        how: "Trade early → chip the field → Sucker / Kowtow the endgame.",
      },
    ],
    omissions: [
      {
        slug: "hippowdon",
        insteadKept: "kingambit",
        why: "Hippo is #4 hazard control — a different six. This toolbox wants Gambit endgame pressure.",
      },
      {
        slug: "corviknight",
        insteadKept: "kingambit",
        why: "Mence + Primarina + Gholdengo already sit; Corvi adds defense, not a new endgame.",
      },
      {
        slug: "meowscarada",
        insteadKept: "rillaboom",
        why: "Competes for Grass tempo; Glide priority beats Scarf-dependent Flower Trick here.",
      },
    ],
  },
  megaPool: {
    rule: "One Mega Evolution per battle. Two stones are intentional ambiguity — not free power.",
    previewPressure:
      "If they prep Mega Salamence, Mega Garchomp Z instead. If they prep Chomp, Mega Mence.",
    cost: "The non-Mega still holds its stone — that item slot is spent either way.",
    candidates: [
      {
        slug: "garchomp-mega-z",
        stone: "Garchompite Z",
        when: "Need immediate 203 Spe special deletion.",
      },
      {
        slug: "salamence-mega",
        stone: "Salamencite",
        when: "Need Intimidate + DD physical wincon.",
      },
    ],
  },
  evidence: {
    season: "Season 6 M-C Singles",
    asOf: "2026-09-17",
    source: "Champions Battle Data / Pokémon Zone ranked singles",
    caveat: "Usage supports construction — not a claim of proven best WR.",
    ladderTop: [
      "Salamence #1",
      "Garchomp #2",
      "Primarina #3",
      "Gholdengo #9",
      "Rillaboom #10",
      "Kingambit #34",
    ],
    stats: [
      { label: "Garchompite Z", value: "35.4%", note: "Garchomp’s top item" },
      { label: "Salamencite", value: "97.7%", note: "Near-universal Mega" },
      { label: "Gholdengo Air Balloon", value: "66.3%", note: "Dominant item" },
      { label: "Rillaboom Grassy Glide", value: "96.3%", note: "Priority staple" },
      { label: "Kingambit Sucker Punch", value: "99%", note: "Endgame identity" },
    ],
  },
  architecture: [
    {
      title: "Immediate speed",
      body: "Modest Mega Garchomp Z — 203 Spe special nuke.",
      slugs: ["garchomp-mega-z"],
    },
    {
      title: "Setup + Intimidate",
      body: "Mega Salamence — physical DD wincon with defensive entry.",
      slugs: ["salamence-mega"],
    },
    {
      title: "Special setup glue",
      body: "Gholdengo — NP + Good as Gold + Balloon Ground sit.",
      slugs: ["gholdengo"],
    },
    {
      title: "Stabilize → clean",
      body: "Rillaboom + Primarina matchup glue; Kingambit final cleanup.",
      slugs: ["rillaboom", "primarina", "kingambit"],
    },
  ],
  speedBenchmarks: [
    {
      target: "Common midladder / Mega Salamence bracket",
      theirSpe: "≤189",
      yourSpe: "203 Modest Mega Z",
      natureImplication: "Modest already clears — keep SpA.",
    },
    {
      target: "Hypothetical 204–223 Spe threat",
      theirSpe: "204–223",
      yourSpe: "223 Timid Mega Z",
      natureImplication: "Only then consider Timid over Modest.",
    },
    {
      target: "Mega Salamence (Adamant 32 Spe)",
      theirSpe: "189",
      yourSpe: "189 own Mega Mence",
      natureImplication: "Mence does not need to outrun Chomp Z — different job.",
    },
  ],
  coverageNotes: [
    {
      title: "Steel",
      body: "Chomp Flamethrower, Rilla High Horsepower, Gambit Iron Head, Gholdengo Make It Rain.",
    },
    {
      title: "Fairy",
      body: "Primarina Moonblast is the dedicated answer; Gholdengo Make It Rain helps.",
    },
    {
      title: "Ground",
      body: "Levitate Chomp, Flying Mence, Balloon Gholdengo — still respect EQ into Prima/Gambit.",
      watch: "Balloon pop",
    },
    {
      title: "Dragon",
      body: "Primarina insurance plus Chomp/Mence STAB into other Dragons.",
    },
    {
      title: "Priority",
      body: "Grassy Glide, Aqua Jet, Sucker Punch cover chips across packs.",
    },
    {
      title: "Status",
      body: "Gholdengo Good as Gold blanks Will-O / Thunder Wave styles.",
    },
  ],
  packs: PACKS,
  press: ["Frail offense", "One-wall balance", "Ground-heavy sixes", "Unclear preview"],
  refuse: ["Trick Room", "Hard dual answers to both Megas with no soft target"],
  switches: [
    { into: "Dragon", send: "primarina" },
    { into: "Status", send: "gholdengo" },
    { into: "Physical attacker", send: "salamence-mega" },
    { into: "Frail speed", send: "garchomp-mega-z" },
  ],
  plan: [
    { title: "Preview", goal: "Name their bully", play: "Pick the pack that attacks that structure." },
    { title: "Mid", goal: "Force the soft side", play: "Break or Encore — do not greed both stones." },
    { title: "Late", goal: "Pick an endgame", play: "Chomp speed, Mence DD, or Gambit Sucker." },
  ],
  phases: [
    {
      id: "preview",
      title: "Preview",
      lede: "Ninety seconds: which package bullies their six?",
      branches: [
        { when: "Frail offense", then: "Bring delete-offense.", out: "delete-offense" },
        { when: "One defensive answer", then: "Bring respect-setup.", out: "respect-setup" },
        { when: "Unclear", then: "Bring balanced-pressure.", out: "balanced-pressure" },
        { when: "Ground / bulky items", then: "Bring anti-ground.", out: "anti-ground" },
        { when: "Dragon hate", then: "Bring dragon-trap.", out: "dragon-trap" },
      ],
    },
    {
      id: "lead",
      title: "Lead",
      lede: "Pack flows own the lead tree — team default is soft.",
      branches: [
        { when: "Physical lead", then: "Salamence Intimidate or Rilla Knock." },
        { when: "Dragon lead", then: "Primarina Moonblast." },
      ],
    },
    {
      id: "mid",
      title: "Mid",
      lede: "Execute Break → Control from the active pack.",
      branches: [
        { when: "Setup is free", then: "DD or NP — do not both same turn." },
        { when: "Item stalls", then: "Knock Off first." },
      ],
    },
    {
      id: "late",
      title: "Late",
      lede: "Commit to one endgame.",
      branches: [
        { when: "Board soft for Spe", then: "Chomp closes." },
        { when: "Chips everywhere", then: "Gambit Sucker." },
        { when: "+1 Mence healthy", then: "Double-Edge sweep." },
      ],
    },
  ],
  flows: [
    {
      id: "team-macro",
      title: "Six → package",
      lede: "Packs carry the real flowchart.",
      forks: [
        {
          id: "tm-read",
          when: "Preview locked",
          then: "Select the pack that attacks their bully pattern.",
          out: "pack",
        },
      ],
    },
  ],
  loops: [
    {
      title: "Package first",
      body: "Do not play “favorite three.” Play the pack that matches preview.",
    },
    {
      title: "One Mega",
      body: "Stone choice is the first midgame commit — do not waffle after Mega.",
    },
  ],
  hazards: [],
};
