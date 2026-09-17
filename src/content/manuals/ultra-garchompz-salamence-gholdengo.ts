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
    when: "They lack one blanket answer to DD, NP, and SD.",
    identity: "Three setup wincons they cannot cover with one wall.",
    slugs: ["salamence-mega", "gholdengo", "kingambit"],
    megaChoice: "salamence-mega",
    strategy: {
      opponentPattern: "Balance that answers one setup style but not three",
      bring: ["salamence-mega", "gholdengo", "kingambit"],
      purpose: "Force them to respect DD, Nasty Plot, and Swords Dance at once.",
      targets: ["One-wall balance", "Passive special sponges", "Status cores"],
      refuses: ["Triple setup hate + strong priority Dark", "Hard Fairy + Fighting stack"],
      winCondition: "One of the three setups sticks; the others punish the answer.",
      gamePlan: "DD wincon → NP wincon → SD cleaner",
      megaChoice: "salamence-mega",
    },
    roles: [
      {
        slug: "salamence-mega",
        macro: "Setup",
        micro: "Intimidate into Dragon Dance",
        gives: "Physical Mega wincon",
      },
      {
        slug: "gholdengo",
        macro: "Force answers",
        micro: "Nasty Plot behind Good as Gold / Balloon",
        gives: "Special setup + status blank",
      },
      {
        slug: "kingambit",
        macro: "Clean",
        micro: "SD or Sucker after trades",
        gives: "Third setup + priority",
      },
    ],
    coverageNotes: [
      {
        title: "Ground muddle",
        body: "Salamence Flying + Gholdengo Balloon make EQ awkward; Kingambit still hates it after Balloon pops.",
        watch: "Double Ground pressure",
      },
    ],
    flows: [
      macroFlow("rs", [
        {
          title: "Setup",
          when: "Intimidate turn is free",
          then: "Mega Salamence and Dragon Dance.",
        },
        {
          title: "Force answers",
          when: "They sit a special wall or status",
          then: "Gholdengo Nasty Plot / Make It Rain.",
        },
        {
          title: "Clean",
          when: "Board is damaged",
          then: "Kingambit SD or Sucker Punch.",
        },
      ]),
      phaseFlow("lead", "Lead", "Tax Attack or blank status.", [
        {
          id: "rs-lead-mence",
          when: "Physical lead",
          then: "Lead Salamence for Intimidate.",
          send: "salamence-mega",
        },
        {
          id: "rs-lead-ghold",
          when: "Status or Fairy lead",
          then: "Lead Gholdengo.",
          send: "gholdengo",
          move: "Make It Rain",
        },
        {
          id: "rs-lead-gambit",
          when: "They lead a hard Mega check",
          then: "Keep Mega in pocket; lead Gholdengo or Gambit.",
          why: "Do not burn the stone into a dead slot.",
        },
      ]),
      phaseFlow("mid", "Mid", "Swap which setup they must answer.", [
        {
          id: "rs-mid-dd",
          when: "Safe DD turn",
          then: "Dragon Dance.",
          move: "Dragon Dance",
          send: "salamence-mega",
        },
        {
          id: "rs-mid-np",
          when: "They brought a physical answer",
          then: "Gholdengo Nasty Plot.",
          move: "Nasty Plot",
          send: "gholdengo",
        },
        {
          id: "rs-mid-roost",
          when: "Chipped after Intimidate",
          then: "Roost, then re-press DD.",
          move: "Roost",
          send: "salamence-mega",
        },
      ]),
      phaseFlow("late", "Late", "Execute the stuck setup.", [
        {
          id: "rs-late-de",
          when: "Mence is +1 and healthy",
          then: "Double-Edge the softest target.",
          move: "Double-Edge",
          send: "salamence-mega",
        },
        {
          id: "rs-late-mir",
          when: "Gholdengo is +2",
          then: "Make It Rain or Shadow Ball.",
          move: "Make It Rain",
          send: "gholdengo",
        },
        {
          id: "rs-late-sucker",
          when: "Foe must click damage",
          then: "Sucker Punch.",
          move: "Sucker Punch",
          send: "kingambit",
        },
      ]),
    ],
    loops: [
      {
        title: "Setup ping-pong",
        body: "They answer Mence → Gholdengo NP. They answer Steel → Mence DD or Gambit SD.",
      },
      {
        title: "Intimidate bank",
        body: "Intimidate → Roost → DD when the physical threat is taxed.",
      },
      {
        title: "Overlord clean",
        body: "Trade one ally → Supreme Overlord Sucker the last revenge.",
      },
    ],
    hazards: [],
  },
  {
    id: "balanced-pressure",
    label: "Balanced pressure",
    when: "Preview does not scream a specific hole — default three.",
    identity: "Physical Mega + Fairy stabilizer + special setup glue.",
    slugs: ["salamence-mega", "primarina", "gholdengo"],
    megaChoice: "salamence-mega",
    strategy: {
      opponentPattern: "Standard balance / unclear preview",
      bring: ["salamence-mega", "primarina", "gholdengo"],
      purpose: "Controlled pressure with typing, Intimidate, Encore, and dual setup.",
      targets: ["Midladder balance", "Dragon stacks", "Status + physical mixes"],
      refuses: ["Hard Fairy + Fighting that blanks Mence and Gholdengo together"],
      winCondition: "Mence or Gholdengo setup lands while Primarina Encores the answer.",
      gamePlan: "Physical pressure → Stabilizer / Encore → Special setup",
      megaChoice: "salamence-mega",
    },
    roles: [
      {
        slug: "salamence-mega",
        macro: "Pressure",
        micro: "Intimidate and DD physical threat",
        gives: "Mega wincon",
      },
      {
        slug: "primarina",
        macro: "Stabilize",
        micro: "Moonblast Dragons; Encore bad clicks",
        gives: "Fairy Water glue",
      },
      {
        slug: "gholdengo",
        macro: "Setup",
        micro: "Nasty Plot Steel/Ghost pressure",
        gives: "Special wincon + Balloon",
      },
    ],
    coverageNotes: [
      {
        title: "Ground answers",
        body: "Flying Mence + Balloon Gholdengo; Primarina still takes EQ after.",
      },
      {
        title: "Dragon insurance",
        body: "Primarina Moonblast is why this three sits Dragons without Kingambit.",
      },
    ],
    flows: [
      macroFlow("bp", [
        {
          title: "Pressure",
          when: "Physical side is open",
          then: "Salamence Intimidate / DD.",
        },
        {
          title: "Control",
          when: "They click setup or Protect",
          then: "Primarina Encore or Moonblast.",
        },
        {
          title: "Finish",
          when: "Special wall or Fairy appears",
          then: "Gholdengo NP into Make It Rain.",
        },
      ]),
      phaseFlow("lead", "Lead", "Default: tax or Fairy sit.", [
        {
          id: "bp-lead-mence",
          when: "Physical or neutral lead",
          then: "Lead Salamence.",
          send: "salamence-mega",
        },
        {
          id: "bp-lead-prima",
          when: "Dragon or Fighting lead",
          then: "Lead Primarina.",
          send: "primarina",
          move: "Moonblast",
        },
        {
          id: "bp-lead-ghold",
          when: "Status or Fairy lead",
          then: "Lead Gholdengo.",
          send: "gholdengo",
        },
      ]),
      phaseFlow("mid", "Mid", "Encore the commitment, then setup.", [
        {
          id: "bp-mid-encore",
          when: "They Protect or DD",
          then: "Encore.",
          move: "Encore",
          send: "primarina",
        },
        {
          id: "bp-mid-dd",
          when: "Encore locked a soft move",
          then: "Salamence Dragon Dance.",
          move: "Dragon Dance",
          send: "salamence-mega",
        },
        {
          id: "bp-mid-recover",
          when: "Balloon still up and they chip",
          then: "Gholdengo Recover, then NP.",
          move: "Recover",
          send: "gholdengo",
        },
      ]),
      phaseFlow("late", "Late", "Close with the live wincon.", [
        {
          id: "bp-late-de",
          when: "Mence is boosted",
          then: "Double-Edge.",
          move: "Double-Edge",
          send: "salamence-mega",
        },
        {
          id: "bp-late-mir",
          when: "Gholdengo is boosted",
          then: "Make It Rain.",
          move: "Make It Rain",
          send: "gholdengo",
        },
        {
          id: "bp-late-jet",
          when: "Fast foe is chipped",
          then: "Aqua Jet.",
          move: "Aqua Jet",
          send: "primarina",
        },
      ]),
    ],
    loops: [
      {
        title: "Encore → DD",
        body: "Primarina Encore → Salamence DD on the locked turn.",
      },
      {
        title: "Fairy pivot",
        body: "Moonblast the Dragon → Gholdengo NP on the Fairy answer.",
      },
      {
        title: "Balloon sit",
        body: "Gholdengo Recover on Ground until Balloon pops, then rotate Mence.",
      },
    ],
    hazards: [],
  },
  {
    id: "anti-ground",
    label: "Anti-Ground",
    when: "Ground-heavy or bulky item cores on preview.",
    identity: "Balloon Steel + terrain tempo + Fairy Water glue.",
    slugs: ["gholdengo", "rillaboom", "primarina"],
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
