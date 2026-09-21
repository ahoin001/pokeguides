import { alt, train, type TeamManual } from "@/content/manuals";

const BOX = [
  "tyranitar-mega",
  "excadrill",
  "salamence-mega",
  "sneasler",
  "corviknight",
  "milotic",
] as const;

const PACK_SAND = "pack-sand";
const PACK_SAND_WATER = "pack-sand-water";
const PACK_SCALE = "pack-coaching-scale";
const PACK_FLEX = "pack-flexible";

const SP_RULE =
  "Initial ladder analog of the Showdown EVs. Moves, items, and abilities are firmer than this spend — optimize once speed benchmarks are known.";

export const SAND_COACHING_TAILWIND_MILOTIC_MANUAL = {
  id: "sand-coaching-tailwind-milotic-manual",
  title: "Sand · Coaching · Tailwind — Master Ball Ladder",
  lede: "Keep Baltimore’s three engines. Drop Indeedee-M. Add Milotic and a second Tailwind so Sand is no longer the only speed plan.",
  format: "doubles",
  philosophy:
    "Ask which of the three engines their team has the hardest time stopping. If Sand is denied, Tailwind. If Tailwind is denied, Icy Wind. If speed control is denied, Coaching. This is more redundant than the tournament six — that is the point of a Master Ball grind.",
  archetype: "balance",
  family: "weather",
  meta: "Champions Doubles, Regulation M-C. Ladder edition — not a claim this is stronger than Joseph’s Baltimore tournament six.",
  setsNote:
    "Moves, items, and abilities are firmer than the exact investment. Public tournament lists often omit EVs. The SP grids are Champions analogs of the initial Showdown spreads, not speed-benchmarked Champions spends.",
  box: [...BOX],
  core: ["tyranitar-mega", "excadrill", "sneasler", "salamence-mega"],
  slugs: ["tyranitar-mega", "excadrill", "salamence-mega", "sneasler"],
  slots: [],
  phases: [
    {
      id: "preview",
      title: "Preview",
      lede: "Do not ask which four of yours are strongest.",
      branches: [
        {
          when: "What beats my Sand?",
          then: "Water → Milotic. Trick Room → Corv / Mence. Fast offense → Sand + Excadrill.",
        },
        {
          when: "What is their win condition?",
          then: "Physical → Corviknight + Intimidate + Coaching. Special → Milotic + Mence.",
        },
      ],
    },
    {
      id: "lead",
      title: "Lead",
      branches: [
        {
          when: "Playing aggressive",
          then: "Salamence Tailwind, then pressure.",
        },
        {
          when: "Already in the scaling position",
          then: "Sneasler Coaching into Corviknight; Tailwind later from Corv.",
        },
      ],
    },
    {
      id: "mid",
      title: "Mid",
      branches: [
        {
          when: "Sand is up and Excadrill is healthy",
          then: "Execute. Coaching if the KO is not free.",
        },
        {
          when: "Sand is denied",
          then: "Tailwind + Icy Wind. Do not force Excadrill through weather war.",
        },
      ],
    },
    {
      id: "late",
      title: "Late",
      branches: [
        {
          when: "Corviknight has Bulk Ups",
          then: "Brave Bird. Tailwind if the board is still fast.",
        },
        {
          when: "Rain core is weakened",
          then: "Tyranitar in. Weather reset + Sand Rush bomb.",
        },
      ],
    },
  ],
  loops: [
    {
      title: "Corviknight scale",
      body: "Bulk Up → Roost → Bulk Up → Brave Bird. Sneasler Coaching skips a turn of setup.",
    },
    {
      title: "White Herb Unburden",
      body: "Close Combat → White Herb clears drops → Unburden → Sneasler is now the fast attacker.",
    },
  ],
  hazards: [
    {
      title: "Rillaboom lead",
      body: "Do not auto-lead Tyranitar + Excadrill into Grassy Terrain, Fake Out, and Grass pressure.",
      play: "Bring Salamence / Milotic / Sneasler / Corviknight and turn it into a positioning problem.",
    },
    {
      title: "Trick Room",
      body: "We no longer have Scarf Indeedee + Trick. Icy Wind does not answer TR while it is up.",
      play: "Deny setup, then punish the speed-control transition after the room ends. Corviknight is comfortable slow.",
    },
  ],
  roster: [
    {
      slug: "tyranitar-mega",
      title: "Mega Tyranitar",
      job: "mega",
      literacy: "setter",
      role: "Sand setter + physical breaker + weather control.",
      primaryJob: "Activate Sand and provide immediate pressure. Excadrill needs that Sand.",
      item: "Tyranitarite",
      itemWhy: "Mega stone. Dual Mega is legal in Champions doubles — Salamence also carries a stone.",
      ability: "Sand Stream",
      nature: "Adamant",
      training: train(32, 32, 0, 0, 2, 0, {
        label: "Adamant bulk/attack",
        why: "Adamant over Jolly for the first ladder version. Sand is for Excadrill. Current M-C data has Adamant as the most common Mega Tyranitar nature (~65%; Jolly ~31%).",
        spend: ["32 HP", "32 Atk", "2 SpD"],
        rule: SP_RULE,
        exportEvs: "252 HP / 252 Atk / 4 SpD",
        ivsNote: "31 across",
      }),
      moves: [
        { name: "Rock Slide", why: "Primary spread attack and Sand-pressure tool." },
        { name: "Knock Off", why: "In doubles, removing an item can be as important as dealing damage." },
        { name: "Low Kick", why: "Immediate coverage into heavy targets. Most common fourth attack." },
        { name: "Protect", why: "Mandatory for a Pokémon this important." },
      ],
      objective: "Set Sand and hit something the same turn. Do not sit waiting for Dragon Dance.",
      howToPlay:
        "Job is activate Sand and provide immediate pressure. Excadrill needs that Sand. Keep the cleanest version first.",
      gives: ["Sand", "Rock spread", "Knock Off"],
      answers: ["Flying", "Fire", "Psychic"],
      lock: "later-test",
      lockWhy:
        "Dragon Dance is viable (~21% of current Mega Tyranitar lists) but the first ladder version must be immediately useful rather than setup-dependent. Test DD later if TTar consistently gets setup turns.",
    },
    {
      slug: "excadrill",
      title: "Excadrill",
      job: "breaker",
      literacy: "sweeper",
      role: "Sand's executioner.",
      primaryJob: "Tyranitar → Sand → Sand Rush → attack before almost everything.",
      item: "Focus Sash",
      itemWhy:
        "You don't get to simply delete the Sand win condition. Survive an unexpected super-effective hit, some double-targets, and still get one crucial attack when positioning is messy.",
      ability: "Sand Rush",
      nature: "Adamant",
      training: train(
        0,
        32,
        2,
        0,
        0,
        32,
        {
          label: "Adamant Sand Rush",
          why: "Sand Rush already solves speed. Turn 'I outspeed you' into 'I outspeed you and this attack is devastating.'",
          spend: ["32 Atk", "2 Def", "32 Spe"],
          rule: SP_RULE,
          exportEvs: "252 Atk / 4 Def / 252 Spe",
          ivsNote: "31 across",
        },
        [
          alt(
            "Jolly later",
            0,
            32,
            2,
            0,
            0,
            32,
            "Test Jolly if important speed benchmarks appear that Sand Rush plus Adamant still loses.",
          ),
        ],
      ),
      moves: [
        { name: "High Horsepower", why: "Primary Ground STAB for the Sand Rush sweep." },
        { name: "Iron Head", why: "Steel STAB into Fairy and Ice that Ground does not cover." },
        { name: "Rock Slide", why: "Spread Rock for Flying and Fire, flinch chance in doubles." },
        { name: "Protect", why: "Keeps Sash meaningful and dodges Fake Out / double target." },
      ],
      objective: "Live through the first hit, then cash Sand Rush KOs.",
      howToPlay:
        "This is the emergency button. Ridiculous ladder leads happen. Sash gives Excadrill a chance to actually execute.",
      gives: ["Sand Rush sweep", "Ground/Steel STAB"],
      answers: ["Fire", "Electric", "Rock"],
      lock: "do-not-change",
      lockWhy: "Focus Sash Sand Rush with this four-move set is the dominant competitive build. Do not change the kit. Jolly is a later-test nature, not a move change.",
    },
    {
      slug: "salamence-mega",
      title: "Mega Salamence",
      job: "mega",
      literacy: "sweeper",
      role: "Speed control + Intimidate + spread damage.",
      primaryJob: "Land Tailwind without a Sand Rush multiplier, then Hyper Voice the board.",
      item: "Salamencite",
      itemWhy: "Mega stone. Intimidate on entry, Aerilate Hyper Voice after Mega.",
      ability: "Intimidate",
      nature: "Timid",
      training: train(2, 0, 0, 32, 0, 32, {
        label: "Timid Tailwind",
        why: "Salamence does not get a free Sand Rush multiplier. Timid so Tailwind lands before opposing fast Pokémon interfere.",
        spend: ["2 HP", "32 SpA", "32 Spe"],
        rule: SP_RULE,
        exportEvs: "4 HP / 252 SpA / 252 Spe",
        ivsNote: "31 across",
      }),
      moves: [
        { name: "Hyper Voice", why: "Reliable Aerilate spread attack." },
        { name: "Draco Meteor", why: "Single-target nuclear option." },
        {
          name: "Tailwind",
          why: "Aggressive speed conversion for the whole team. Turns the six into a speed-control team rather than Sand-only.",
        },
        { name: "Protect", why: "Stay in to Intimidate again and preserve Tailwind opportunities." },
      ],
      objective: "Establish Tailwind, chip the board, keep Intimidate cycling.",
      howToPlay:
        "Salamence Tailwind means you are playing aggressively. Corviknight Tailwind is the other click — already in a defensive seat, converting that seat into speed.",
      gives: ["Tailwind", "Intimidate", "Aerilate spread"],
      answers: ["Dragon", "Fighting", "Grass"],
      contrast: {
        vs: "Baltimore championship",
        theyUsed: "Hyper Voice / Draco Meteor / Flamethrower / Protect (Timid)",
        weUse: "Hyper Voice / Draco Meteor / Tailwind / Protect (Timid)",
        why: "Ladder grind, not one tournament matchup map. Milotic now supplies Ice; we want three speed plans.",
      },
      abilityStages: {
        before: "Intimidate",
        after: "Aerilate",
        when: "On Mega",
      },
    },
    {
      slug: "sneasler",
      title: "Sneasler",
      job: "support",
      literacy: "disruptor",
      role: "The team's stat amplifier.",
      primaryJob: "Coaching into Excadrill, Tyranitar, or Corviknight — then become a fast attacker via Unburden.",
      item: "White Herb",
      itemWhy: "Makes Unburden reliable after Close Combat: drops gone, then extremely fast.",
      ability: "Unburden",
      nature: "Adamant",
      training: train(0, 32, 2, 0, 0, 32, {
        label: "Adamant Unburden",
        why: "Attack first. Unburden plus White Herb supplies the speed after Close Combat.",
        spend: ["32 Atk", "2 Def", "32 Spe"],
        rule: SP_RULE,
        exportEvs: "252 Atk / 4 Def / 252 Spe",
        ivsNote: "31 across",
      }),
      moves: [
        { name: "Dire Claw", why: "Poison STAB with status rolls — Sneasler's own damage button." },
        { name: "Close Combat", why: "Fighting STAB that also pops White Herb for Unburden." },
        { name: "Coaching", why: "The reason Corviknight stays on the six. Turns a partner into the win condition." },
        { name: "Protect", why: "Doubles glue. Fake Out and double-target exist." },
      ],
      objective: "Boost the right partner, then convert into a fast attacker the same game.",
      howToPlay: "Start as support. Close Combat when you are ready to become the fast attacker. Do not change this Pokémon.",
      gives: ["Coaching", "Unburden attacker", "Fighting/Poison"],
      answers: ["Psychic", "Flying", "Fairy"],
      lock: "do-not-change",
      lockWhy: "White Herb + Coaching is one of the reasons Corviknight stays. Baltimore used this exact architecture.",
      ampTargets: [
        { slug: "excadrill", becomes: "Sand Rush + boosted Attack" },
        { slug: "tyranitar-mega", becomes: "boosted Mega Tyranitar" },
        { slug: "corviknight", becomes: "a rapidly scaling defensive monster" },
      ],
      itemLoop: {
        title: "White Herb Unburden",
        beats: [
          { click: "Close Combat" },
          { click: "White Herb activates", why: "Stat drops removed" },
          { click: "Unburden activates" },
          { click: "Sneasler is extremely fast" },
        ],
      },
    },
    {
      slug: "corviknight",
      title: "Corviknight",
      job: "support",
      literacy: "wall",
      role: "Defensive anchor → scaling win condition → secondary speed control.",
      primaryJob: "Leftovers Bulk Up + Roost, Tailwind when scaling is not the right play.",
      item: "Leftovers",
      itemWhy: "Self-sufficient. Psychic Seed is gone with Indeedee. Leftovers is the most common Corviknight item.",
      ability: "Mirror Armor",
      nature: "Impish",
      training: train(32, 0, 14, 0, 20, 0, {
        label: "Impish leftover split",
        why: "Sit and scale. Tailwind is the productive click when Bulk Up is not free.",
        spend: ["32 HP", "14 Def", "20 SpD"],
        rule: SP_RULE,
        exportEvs: "252 HP / 100 Def / 156 SpD",
        ivsNote: "31 across",
      }),
      moves: [
        { name: "Brave Bird", why: "The payoff after Bulk Ups. Recoil is why Roost exists." },
        { name: "Bulk Up", why: "Defense and Attack. Coaching from Sneasler accelerates it." },
        { name: "Roost", why: "Stay in the scaling seat." },
        {
          name: "Tailwind",
          why: "Already in a defensive/scaling position — convert that position into speed. Not the same click as Salamence Tailwind.",
        },
      ],
      objective: "Become the defensive Pokémon that turns into a fast win condition.",
      howToPlay:
        "Less explosive than Psychic Seed Power Trip, much harder to disrupt through terrain. Tailwind gives Corviknight something productive to do when scaling is wrong.",
      gives: ["Mirror Armor", "Bulk Up endgame", "second Tailwind"],
      answers: ["Intimidate spam", "physical wincons", "Trick Room boards"],
      contrast: {
        vs: "Baltimore championship",
        theyUsed: "Psychic Seed + Power Trip (Indeedee terrain package)",
        weUse: "Leftovers + Brave Bird / Bulk Up / Roost / Tailwind",
        why: "Indeedee is off the six. This Corviknight is self-contained and matches current leftover/Tailwind usage.",
      },
      itemLoop: {
        title: "Bulk Up loop",
        beats: [
          { slug: "corviknight", click: "Bulk Up", why: "Defense ↑ Attack ↑" },
          { slug: "corviknight", click: "Roost" },
          { slug: "corviknight", click: "Bulk Up" },
          { slug: "corviknight", click: "Brave Bird" },
        ],
      },
    },
    {
      slug: "milotic",
      title: "Milotic",
      job: "support",
      literacy: "wallbreaker",
      role: "Water attacker + anti-Intimidate + speed control.",
      primaryJob: "The Pokémon that makes this version ours.",
      item: "Sitrus Berry",
      itemWhy: "A recent 4th-place M-C team used Sitrus Milotic with this exact four-move set in the TTar/Exca/Sneasler/Mence shell.",
      ability: "Competitive",
      nature: "Modest",
      training: train(32, 0, 2, 32, 0, 0, {
        label: "Modest Sitrus",
        why: "Special attack after Competitive. HP to live the Intimidate bait.",
        spend: ["32 HP", "2 Def", "32 SpA"],
        rule: SP_RULE,
        exportEvs: "252 HP / 4 Def / 252 SpA",
        ivsNote: "31 across",
      }),
      moves: [
        { name: "Scald", why: "Water damage Sand teams invite, plus burn." },
        { name: "Ice Beam", why: "Dragons and Ground-types that sit on Sand." },
        { name: "Icy Wind", why: "Third speed plane: their entire team gets slower." },
        { name: "Protect", why: "Doubles glue; Competitive can wait a turn." },
      ],
      objective: "Check Water answers, punish Intimidate, and Icy Wind the speed war.",
      howToPlay:
        "Self-contained. Not package-dependent like Indeedee. After Intimidate, Scald / Ice Beam becomes terrifying. Icy Wind is why Milotic is here.",
      gives: ["Water/Ice", "Competitive", "Icy Wind"],
      answers: ["Intimidate cores", "Dragon", "Ground", "Fire"],
    },
  ],
  construction: {
    thesis:
      "Keep Sand → Excadrill, Sneasler → Coaching, and Corviknight scaling. Replace Indeedee's Psychic Terrain package with Milotic so the team has Water, Icy Wind, and Competitive. Package D (TTar / Sneasler / Corv / Milotic) is the ladder default — don't commit to one plan until you see them.",
    method:
      "Baltimore tournament six as architecture, current M-C leftover/Tailwind Corviknight and Sitrus Milotic in the TTar/Exca/Sneasler/Mence shell as direction. Not copying one event's matchup map.",
    winCondition: "One of three: Sand Rush sweep, Corviknight Bulk Up endgame, or Tailwind + Icy Wind offense.",
    endgames: [
      {
        id: "sand-rush",
        label: "Excadrill Sand Rush",
        path: "Tyranitar → Sand → Excadrill",
        how: "KO → KO. Coaching if the first hit is not enough.",
      },
      {
        id: "corv-scale",
        label: "Corviknight Bulk Up",
        path: "Sneasler Coaching → Bulk Up → Roost → Brave Bird",
        how: "The defensive Pokémon becomes a fast win condition once Tailwind is up.",
      },
      {
        id: "speed-offense",
        label: "Tailwind + Icy Wind",
        path: "Salamence Tailwind · Milotic Icy Wind · Sneasler Coaching",
        how: "Fast boosted attackers without requiring Excadrill to live forever.",
      },
    ],
    omissions: [
      {
        slug: "indeedee-male",
        insteadKept: "milotic",
        why: "Psychic Terrain + Seed + Trick + Expanding Force is powerful but package-dependent. Milotic expands the matchup architecture instead of performing a similar job.",
      },
    ],
  },
  megaPool: {
    rule: "Champions doubles: both Mega stones can come. Tyranitarite sets the weather; Salamencite is Intimidate + Aerilate Tailwind.",
    previewPressure: "If they hate Sand, Mence is the Mega you show first. If they hate physical board control, TTar.",
    candidates: [
      { slug: "tyranitar-mega", stone: "Tyranitarite", when: "You need Sand and immediate Rock/Dark pressure." },
      { slug: "salamence-mega", stone: "Salamencite", when: "You need Intimidate, Tailwind, and spread Flying." },
    ],
  },
  evidence: {
    season: "M-C",
    source: "Current M-C usage and a 266-player tournament 4th (Mark Ian Abayon: Mega Salamence / Excadrill / Mega Tyranitar / Milotic / Sneasler / Indeedee).",
    caveat:
      "This is a ladder-redundancy build, not a claim it is objectively stronger than Joseph’s Baltimore six. Usage figures cited in the kits are directional, not a win-rate proof. Doubles Champions and singles Pikalytics should not be treated as the same dataset.",
    stats: [
      { label: "Mega TTar Adamant", value: "~65%", note: "Jolly ~31%. Dragon Dance on ~21% of lists." },
      { label: "Sneasler usage", value: "~36.6%", note: "Large current dataset — stay on White Herb Coaching." },
      { label: "Rillaboom", value: "~41.8%", note: "Most-used; do not auto-Sand into it." },
    ],
  },
  architecture: [
    {
      title: "Sand",
      body: "Tyranitar → Sand → Excadrill Sand Rush.",
      slugs: ["tyranitar-mega", "excadrill"],
    },
    {
      title: "Coaching",
      body: "Sneasler into TTar, Excadrill, or Corviknight.",
      slugs: ["sneasler", "corviknight"],
    },
    {
      title: "Tailwind",
      body: "Salamence for aggression. Corviknight for converting a defensive seat.",
      slugs: ["salamence-mega", "corviknight"],
    },
    {
      title: "Icy Wind",
      body: "Milotic slows their board. Third speed plan.",
      slugs: ["milotic"],
    },
  ],
  engines: [
    {
      id: "sand-excadrill",
      label: "Sand → Excadrill",
      path: ["Tyranitar", "Sand", "Excadrill", "Sand Rush", "KO"],
      how: "Primary weather win condition. Sash exists so ladder leads cannot simply delete it.",
      dependsOn: "Tyranitar on the field or waiting to reset weather.",
      disrupt: "Rain, Grassy Terrain Fake Out, Trick Room.",
      fallback: "Tailwind + Icy Wind. Do not force Excadrill through a weather war.",
    },
    {
      id: "coaching-scaler",
      label: "Sneasler → Coaching",
      path: ["Sneasler", "Coaching", "partner +1/+1"],
      how: "Turns Excadrill, Mega Tyranitar, or Corviknight into the closer.",
      dependsOn: "A partner that wants Attack and Defense.",
      disrupt: "Removing Sneasler before the click.",
      fallback: "Sneasler itself becomes the fast attacker after White Herb Unburden.",
    },
    {
      id: "corv-bulk-up",
      label: "Corviknight Bulk Up",
      path: ["Leftovers", "Bulk Up", "Roost", "Bulk Up", "Brave Bird"],
      how: "Less explosive than Psychic Seed Power Trip. Harder to disrupt with terrain.",
      dependsOn: "Time. Coaching skips a turn.",
      disrupt: "Special pressure that ignores the Bulk Up.",
      fallback: "Corviknight Tailwind — still contributing when scaling is wrong.",
    },
  ],
  controlPlanes: [
    {
      id: "sand",
      label: "Sand",
      setterSlug: "tyranitar-mega",
      effect: "Sand Stream",
      whoBenefits: "Excadrill (Sand Rush)",
    },
    {
      id: "tailwind",
      label: "Tailwind",
      setterSlug: "salamence-mega",
      effect: "Our team goes first",
      whoBenefits: "Entire bring — second setter is Corviknight",
    },
    {
      id: "icy-wind",
      label: "Icy Wind",
      setterSlug: "milotic",
      effect: "Opponent −1 Speed",
      whoBenefits: "Anyone racing without Sand Rush",
    },
    {
      id: "coaching",
      label: "Coaching",
      setterSlug: "sneasler",
      effect: "Partner +1 Atk / +1 Def",
      whoBenefits: "Excadrill, Tyranitar, Corviknight",
    },
  ],
  previewTrees: [
    {
      ask: "What beats my Sand?",
      branches: [
        { when: "Water", then: "Bring Milotic. Icy Wind.", bringPackId: PACK_SAND_WATER },
        { when: "Trick Room", then: "Corv / Mence. Tailwind and a slower game.", bringPackId: PACK_SCALE },
        { when: "Fast offense", then: "Sand. Excadrill.", bringPackId: PACK_SAND },
      ],
    },
    {
      ask: "What is their win condition?",
      branches: [
        {
          when: "Physical",
          then: "Corviknight + Intimidate. Then Coaching. Scale or clean.",
          bringPackId: PACK_FLEX,
        },
        { when: "Special", then: "Milotic + Mence.", bringPackId: PACK_SCALE },
      ],
    },
  ],
  matchupScripts: [
    {
      id: "rillaboom",
      foe: "Rillaboom",
      why: "Most-used in the large M-C dataset (~41.8%). Do not auto-lead Tyranitar + Excadrill into terrain, Grass, and Fake Out.",
      packId: PACK_SCALE,
      trap: "Giving Rillaboom a way to disrupt Sand instead of making it a positioning problem.",
      sequence: {
        beats: [
          { slug: "salamence-mega", click: "Intimidate", why: "Weaken physical pressure" },
          { slug: "milotic", click: "Icy Wind / Scald" },
          { slug: "salamence-mega", click: "Tailwind" },
          { slug: "sneasler", click: "Coaching" },
          { slug: "corviknight", click: "Bulk Up" },
        ],
      },
    },
    {
      id: "rain",
      foe: "Rain",
      why: "Do not win the weather war immediately. Weakened rain cores eat a late Tyranitar.",
      packId: PACK_SCALE,
      trap: "Clicking Sand into a live rain setter.",
      sequence: {
        title: "Then late Sand bomb",
        beats: [
          { slug: "milotic", click: "Icy Wind" },
          { slug: "salamence-mega", click: "Tailwind" },
          { slug: "sneasler", click: "Coaching" },
          { slug: "corviknight", click: "Scale" },
          { slug: "tyranitar-mega", click: "Enter", why: "Weather reset + Sand Rush Excadrill" },
        ],
      },
    },
    {
      id: "hyper-offense",
      foe: "Hyper Offense",
      why: "Here you want the old team. Don't overcomplicate it.",
      packId: PACK_SAND,
      sequence: {
        beats: [
          { click: "Sand" },
          { click: "Sand Rush" },
          { click: "Tailwind if needed" },
          { click: "Coaching" },
          { click: "Kill something" },
        ],
      },
    },
    {
      id: "trick-room",
      foe: "Trick Room",
      why: "Advantage: we don't depend entirely on Sand Rush. Disadvantage: no Scarf Indeedee + Trick. Icy Wind is for after the room ends.",
      packId: PACK_SCALE,
      trap: "Clicking Icy Wind as if it answered TR while the room is up.",
      sequence: {
        beats: [
          { click: "Deny the setup" },
          { click: "Play the slower game on Corviknight" },
          { click: "Icy Wind after the room", why: "Punish their speed-control transition" },
        ],
      },
    },
    {
      id: "intimidate",
      foe: "Intimidate spam",
      why: "Two punishments: Competitive on Milotic and Mirror Armor on Corviknight.",
      packId: PACK_FLEX,
      sequence: {
        beats: [
          { slug: "milotic", click: "Competitive", why: "+2 SpA → Scald / Ice Beam" },
          { slug: "corviknight", click: "Mirror Armor", why: "Reflected stat drop" },
        ],
      },
    },
  ],
  ledger: {
    dropped: {
      slug: "indeedee-male",
      lost: [
        "Psychic Terrain",
        "priority denial",
        "Expanding Force",
        "Trick",
        "Psychic Seed",
        "Scarf speed",
        "the original Corviknight boost engine",
      ],
    },
    gained: [
      "Water coverage",
      "Icy Wind",
      "Competitive",
      "Tailwind (two setters)",
      "less terrain dependence",
      "a more self-contained Corviknight",
      "better flexibility against Intimidate",
      "multiple speed-control routes",
    ],
    rejectedAlts: [
      {
        slug: "farigiraf",
        whyNot:
          "Would preserve Psychic Terrain + Corviknight support. If Indeedee is coming off, the replacement should expand matchup architecture, not perform a similar job. Not for v1.",
      },
    ],
    laterTests: [
      {
        slug: "tyranitar-mega",
        change: "Dragon Dance over Low Kick or Protect",
        whenToTest: "If Tyranitar consistently gets free setup turns on ladder.",
      },
      {
        slug: "excadrill",
        change: "Jolly instead of Adamant",
        whenToTest: "If important speed benchmarks appear that Sand Rush + Adamant still lose.",
      },
    ],
  },
  packs: [
    {
      id: PACK_SAND,
      label: "Package A — Sand",
      when: "Opponent is vulnerable to immediate physical pressure.",
      identity: "The original aggressive package.",
      slugs: ["tyranitar-mega", "excadrill", "salamence-mega", "sneasler"],
      engineIds: ["sand-excadrill", "coaching-scaler"],
      endgameIds: ["sand-rush"],
      sequence: [
        {
          beats: [
            { slug: "tyranitar-mega", click: "Sand" },
            { slug: "excadrill", click: "Sand Rush" },
            { slug: "sneasler", click: "Coaching if appropriate" },
            { click: "KO → KO → win" },
          ],
        },
      ],
      strategy: {
        opponentPattern: "Fast offense / boards that die to Sand Rush.",
        bring: ["tyranitar-mega", "excadrill", "salamence-mega", "sneasler"],
        purpose: "Set Sand and execute. Tailwind if the first wave is not enough.",
        targets: ["Hyper offense", "slow balance without Water"],
        refuses: ["Rillaboom-centered Grass cores", "live Rain", "Trick Room setters"],
        winCondition: "Excadrill KOs under Sand, Coaching if needed.",
        gamePlan: "Sand → Rush → Tailwind if needed → Coaching → kill something.",
        mantra: "Don't overcomplicate it.",
        contrast: "Old team. No Milotic, no Corviknight.",
        turnChecklist: ["Sand up?", "Sash still there?", "Coaching target?"],
      },
      roles: [
        { slug: "tyranitar-mega", macro: "Break", micro: "Sand + Rock Slide" },
        { slug: "excadrill", macro: "Finish", micro: "Sand Rush executioner" },
        { slug: "salamence-mega", macro: "Control", micro: "Intimidate + Tailwind" },
        { slug: "sneasler", macro: "Control", micro: "Coaching the sweeper" },
      ],
      loops: [{ title: "Rush", body: "Sand, then Excadrill attacks. Protect the Sash turn if they double." }],
      hazards: [{ title: "Rillaboom", body: "Wrong package. Switch to Coaching scaling." }],
      flows: [
        {
          id: "lead",
          title: "Lead",
          forks: [{ id: "sand-lead", when: "They look frail", then: "Sand and hit. Tailwind only if you lose the race." }],
        },
      ],
    },
    {
      id: PACK_SAND_WATER,
      label: "Package B — Sand + Water",
      when: "Teams that make pure Sand uncomfortable — especially Water answers.",
      identity: "Win the speed war without requiring Excadrill to survive forever.",
      slugs: ["tyranitar-mega", "excadrill", "milotic", "salamence-mega"],
      engineIds: ["sand-excadrill"],
      endgameIds: ["sand-rush", "speed-offense"],
      sequence: [
        {
          beats: [
            { slug: "tyranitar-mega", click: "Sand" },
            { slug: "milotic", click: "Water / Ice · Icy Wind" },
            { slug: "salamence-mega", click: "Tailwind" },
          ],
        },
      ],
      strategy: {
        opponentPattern: "Water answers, Dragons, Ground that sit on Sand.",
        bring: ["tyranitar-mega", "excadrill", "milotic", "salamence-mega"],
        purpose: "Sand still exists, but Icy Wind + Tailwind are the backup clock.",
        targets: ["Fire", "Ground", "Dragon", "boards that hate Water"],
        refuses: ["Heavy Grass without a Dragon to Ice"],
        winCondition: "Speed war via three planes; Excadrill is optional late.",
        gamePlan: "Sand + Icy Wind + Tailwind.",
        mantra: "Excadrill does not have to live forever.",
        contrast: "Adds Milotic to the aggressive four; drops Sneasler.",
      },
      roles: [
        { slug: "tyranitar-mega", macro: "Break", micro: "Sand" },
        { slug: "excadrill", macro: "Finish", micro: "Rush if the window opens" },
        { slug: "milotic", macro: "Control", micro: "Icy Wind + Water/Ice" },
        { slug: "salamence-mega", macro: "Control", micro: "Tailwind" },
      ],
      loops: [{ title: "Speed triangle", body: "Sand, Tailwind, Icy Wind — pick two if you cannot have three." }],
      hazards: [],
    },
    {
      id: PACK_SCALE,
      label: "Package C — Coaching scaling",
      when: "Anti-Sand. Rillaboom, Rain, Trick Room, special wincons.",
      identity: "The four that does not need weather to function.",
      slugs: ["sneasler", "corviknight", "salamence-mega", "milotic"],
      engineIds: ["coaching-scaler", "corv-bulk-up"],
      endgameIds: ["corv-scale", "speed-offense"],
      sequence: [
        {
          beats: [
            { slug: "salamence-mega", click: "Tailwind" },
            { slug: "sneasler", click: "Coaching" },
            { slug: "corviknight", click: "Bulk Up" },
            { slug: "corviknight", click: "Roost" },
            { slug: "corviknight", click: "Bulk Up" },
            { slug: "corviknight", click: "Brave Bird" },
          ],
        },
      ],
      strategy: {
        opponentPattern: "Sand-hate, Rillaboom, Rain, Trick Room.",
        bring: ["sneasler", "corviknight", "salamence-mega", "milotic"],
        purpose: "Intimidate, Icy Wind, Tailwind, Coaching, scale. Tyranitar waits for a late weather reset.",
        targets: ["Rillaboom", "Rain", "Trick Room", "Intimidate physical"],
        refuses: ["Frail HO that dies to Sand Rush — use Package A."],
        winCondition: "Corviknight Bulk Up endgame under Tailwind, or Milotic after Competitive.",
        gamePlan: "Tailwind → Coaching → Bulk Up. Milotic Icy Winds anything racing you.",
        mantra: "Turn their Rillaboom into a positioning problem.",
        contrast: "No Tyranitar, no Excadrill. Anti-Sand four.",
      },
      roles: [
        { slug: "sneasler", macro: "Control", micro: "Coaching" },
        { slug: "corviknight", macro: "Finish", micro: "Scale + second Tailwind" },
        { slug: "salamence-mega", macro: "Control", micro: "Intimidate + Tailwind" },
        { slug: "milotic", macro: "Control", micro: "Icy Wind + Competitive" },
      ],
      loops: [{ title: "Scale", body: "Coaching into Corv, then Bulk Up / Roost. Tailwind if Bulk Up is not free." }],
      hazards: [{ title: "Special wallbreakers", body: "Bulk Up does not save Corviknight. Milotic and Mence have to win the special war." }],
      victims: [
        { name: "Rillaboom", why: "Intimidate + Icy Wind + scale instead of feeding it Sand.", slug: "rillaboom" },
        { name: "Intimidate cores", why: "Competitive and Mirror Armor both punish.", play: "Let them click it." },
      ],
      counters: [
        { name: "Trick Room (while up)", why: "Icy Wind does not reverse the room.", play: "Deny setup, then Icy Wind after." },
      ],
    },
    {
      id: PACK_FLEX,
      label: "Package D — Full flexible",
      when: "You are not committing to one plan until you see what they're doing.",
      identity: "Weather, Coaching, Intimidate punishment, defensive scaling, Water, speed reduction, Rock, Fighting.",
      slugs: ["tyranitar-mega", "sneasler", "corviknight", "milotic"],
      engineIds: ["sand-excadrill", "coaching-scaler", "corv-bulk-up"],
      endgameIds: ["corv-scale", "speed-offense"],
      strategy: {
        opponentPattern: "Unknown. Ladder default.",
        bring: ["tyranitar-mega", "sneasler", "corviknight", "milotic"],
        purpose: "Hold Sand in the bag, hold the scaler, hold Competitive. Decide mid-preview.",
        targets: ["Physical wincons", "Intimidate", "boards that hate Knock Off + Water"],
        refuses: ["You already know they are HO — Package A is cleaner."],
        winCondition: "Whatever engine they cannot stop.",
        gamePlan: "See them. Then Sand or scale.",
        mantra: "I'm not committing until I see what you're doing.",
        contrast: "Drops Excadrill and Salamence. Keeps TTar in the four so Sand is still a late option.",
      },
      roles: [
        { slug: "tyranitar-mega", macro: "Break", micro: "Weather + Knock Off" },
        { slug: "sneasler", macro: "Control", micro: "Coaching" },
        { slug: "corviknight", macro: "Finish", micro: "Scale / Mirror Armor" },
        { slug: "milotic", macro: "Control", micro: "Competitive / Icy Wind" },
      ],
      loops: [{ title: "Wait", body: "If they ignore Corviknight, Bulk Up. If they focus Corviknight, TTar / Milotic get room." }],
      hazards: [],
    },
  ],
  press: ["Sand Rush", "Coaching", "two Tailwinds", "Icy Wind", "Competitive", "Mirror Armor"],
  refuse: ["Auto-Sand into Rillaboom", "Dragon Dance on week one", "Farigiraf as the Indeedee replacement"],
  victims: [
    { name: "Hyper offense", why: "Package A is the old team. Sand Rush plus Tailwind." },
    { name: "Intimidate spam", why: "Competitive + Mirror Armor." },
  ],
  counters: [
    { name: "Trick Room (active)", why: "Lost Scarf Indeedee Trick. Play deny-setup and the post-room Icy Wind." },
    { name: "Live Rain", why: "Don't weather-war turn one. Scale first, TTar bomb later." },
  ],
  advantages: [
    {
      title: "Two Tailwinds",
      body: "Salamence Tailwind is aggressive. Corviknight Tailwind converts an already-defensive seat into speed. Not redundant.",
    },
    {
      title: "Redundancy",
      body: "Sand denied → Tailwind. Tailwind denied → Icy Wind. Speed denied → Coaching. Physical Intimidate → Milotic. Intimidate on Corv → Mirror Armor.",
    },
  ],
  pilot: {
    thesis: "Which of my three engines does their team have the hardest time stopping?",
    rule: "Do not ask which four of mine are strongest.",
    fail: "Leading TTar + Exca into Rillaboom because Sand is the identity.",
  },
} satisfies TeamManual;
