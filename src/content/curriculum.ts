import type { ArchetypeSlot } from "@/content/archetypes";

export type LearnTrack = "singles" | "doubles";

export type LessonBand = "poke-ball" | "great-ball" | "ultra-ball" | "master-ball";

export type LessonViz =
  | "none"
  | "types"
  | "speed-tape"
  | "roster"
  | "wincon-stack"
  | "flowchart"
  | "preview-board"
  | "matchup"
  | "ability-field"
  | "chooser"
  | "stadium"
  | "training"
  | "archetype-tells";

export type LessonExample = {
  slug: string;
  caption: string;
};

export type LessonBeat = {
  title: string;
  body: string;
  example?: LessonExample;
  /** One-line takeaway shown as a pull quote under the body. */
  takeaway?: string;
  /** Compact labeled rows — priority lists, compare strips, etc. */
  rows?: { label: string; detail: string }[];
};

export type LessonRule = {
  label: string;
  detail: string;
};

export type Lesson = {
  slug: string;
  band: LessonBand;
  title: string;
  thesis: string;
  skipIf: string;
  body: string[];
  /** Compact format facts shown as a rule strip (used by FightClassroom). */
  rules?: LessonRule[];
  beats: LessonBeat[];
  examples: LessonExample[];
  viz: LessonViz;
  flowId?: string;
  relatedManuals: string[];
  next?: string;
  track?: LearnTrack;
};

export const BANDS: { id: LessonBand; title: string; skipIf: string }[] = [
  {
    id: "poke-ball",
    title: "Poké Ball",
    skipIf: "Skip if you already see a three and can name what it is trying to do.",
  },
  {
    id: "great-ball",
    title: "Great Ball",
    skipIf: "Skip if Fake Out, 66 SP, Speed races, and jobs already click.",
  },
  {
    id: "ultra-ball",
    title: "Ultra Ball",
    skipIf: "Skip if you can name a wincon, a hole, and a preview sentence.",
  },
  {
    id: "master-ball",
    title: "Master Ball",
    skipIf: "Skip if you already play the board, review the game, and check usage. Go to manuals.",
  },
];

export const BAND_FIRST: Record<LessonBand, string> = {
  "poke-ball": "the-fight",
  "great-ball": "abilities",
  "ultra-ball": "building",
  "master-ball": "turns",
};

export const LESSONS: Lesson[] = [
  {
    slug: "the-fight",
    band: "poke-ball",
    title: "This is not the story mode",
    thesis:
      "Ranked singles is 3v3 with one Pokémon on the field. You spend 66 Stat Points, get one Mega, and both team lists are open from the start.",
    skipIf: "Skip if you already play Champions ranked singles.",
    body: [
      "Story mode hides half the game. Here both sides show their three before anyone leads. One Pokémon fights at a time — Fake Out, Protect, and U-turn all cost your action. Nobody else covers for you.",
    ],
    rules: [
      { label: "Format", detail: "3v3 · one on the field" },
      { label: "Level", detail: "50 for everyone" },
      { label: "Stat Points", detail: "66 total · max 32 in one stat" },
      { label: "Mega", detail: "Once · same turn you attack" },
      { label: "Lists", detail: "Open at preview" },
      { label: "Species", detail: "No duplicates" },
    ],
    beats: [
      {
        title: "How a turn resolves",
        body: "Switches resolve first. Mega Evolution is next. After that, moves go in Speed order — unless priority jumps the line.",
        takeaway:
          "If you switch, they still hit whoever comes in — unless they switched too.",
        rows: [
          { label: "Protect", detail: "+4 priority" },
          { label: "Fake Out", detail: "+3 · flinches before Tailwind" },
          { label: "Prankster Tailwind", detail: "+1" },
          { label: "Sucker Punch", detail: "+1 only if they attack" },
          { label: "Trick Room · Parting Shot", detail: "Go last" },
        ],
        example: {
          slug: "incineroar",
          caption: "Fake Out is +3. Ghost types ignore it.",
        },
      },
      {
        title: "Attack or leave",
        body: "Every turn you either attack or switch. Switching hands them a free hit on whatever comes in. Stay when this turn’s damage matters more than getting out. Leave when the next hit would KO you and you already have the answer waiting.",
        takeaway: "Super-effective is fine. Donating a KO because you stayed one turn too long is not.",
        example: {
          slug: "garchomp",
          caption: "Earthquake is the attack. Switching into Ice is a free KO for them.",
        },
      },
      {
        title: "Physical, special, and STAB",
        body: "Physical moves hit Defense. Special moves hit Special Defense. Same-type attack bonus (STAB) is 1.5× — most kits lead with at least one STAB move. A team that only stacks Attack gets stopped cold by one solid physical wall.",
        rows: [
          { label: "Physical", detail: "Hits Defense" },
          { label: "Special", detail: "Hits Special Defense" },
          { label: "STAB", detail: "1.5× on your own type" },
        ],
        example: {
          slug: "kingambit",
          caption: "Kowtow Cleave is physical Dark. Make It Rain on Gholdengo is special Steel.",
        },
      },
      {
        title: "Open lists and one Mega",
        body: "Before the fight starts, both sides open their lists. You pick the three that answers theirs, then choose who leads. The Omni Ring Mega is once per game. If two of yours can Mega, decide which one here — not mid-match when you’re already locked in.",
        takeaway: "Mega is the plan. Tip it early only if you have to — often you wait until the answer for it is gone.",
        example: {
          slug: "salamence-mega",
          caption: "Aerilate is the win condition. Hide it until Ice is off the field.",
        },
      },
    ],
    examples: [
      { slug: "whimsicott", caption: "Clock" },
      { slug: "corviknight", caption: "Shield" },
      { slug: "garchomp", caption: "Cleaner" },
      { slug: "incineroar", caption: "Fake Out +3" },
    ],
    viz: "stadium",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "types",
  },
  {
    slug: "types",
    band: "poke-ball",
    title: "Types are switch math",
    thesis:
      "You are not memorizing a chart for a quiz. Every turn, the type chart answers one question: is it safe to switch this Pokémon in?",
    skipIf: "Skip if you already switch based on types, not panic.",
    body: [
      "Every damaging move has a type. Against the Pokémon on the other side, that type either hits harder, hits softer, or does nothing. Dual-typed Pokémon multiply both numbers — so Garchomp (Dragon/Ground) takes 4× from Ice, 2× from Fairy, and 0 from Electric.",
    ],
    rules: [
      { label: "Super-effective", detail: "2× damage · 4× if both types are weak" },
      { label: "Resist", detail: "½ damage · ¼ if both types resist" },
      { label: "Immune", detail: "0 — the move does nothing" },
      { label: "STAB", detail: "1.5× when the move matches your type" },
      { label: "Coverage", detail: "An extra type that hits what walls your STAB" },
    ],
    beats: [
      {
        title: "Switch in on a resist",
        body: "When they lock into a Fairy move, sending Garchomp in is a gift — Fairy hits Dragon for 2×. Corviknight is Steel/Flying, so Fairy only does half. Use the chart as a switch list: pick the Pokémon that takes the incoming hit best.",
        takeaway: "Before you switch, ask: what on my team resists this move?",
        rows: [
          { label: "Garchomp in", detail: "Fairy hits Dragon for 2× — bad switch" },
          { label: "Corviknight in", detail: "Steel resists Fairy (½) — good switch" },
        ],
        example: {
          slug: "corviknight",
          caption: "Steel/Flying. Fairy is ½. Ground is 0. Ice is neutral — still safer than Garchomp’s 4× Ice.",
        },
      },
      {
        title: "Immune means a free turn",
        body: "A resist still takes some damage. An immunity takes none — they spent their turn and nothing happened. Ground moves do nothing to Corviknight. Fake Out is Normal, so it does nothing to Mimikyu (Ghost). That empty turn is yours to use.",
        takeaway: "Immunity is not “a strong resist.” It is a turn they gave you for free.",
        example: {
          slug: "mimikyu-disguised",
          caption: "Ghost/Fairy. Fake Out does nothing. Then you can set up.",
        },
      },
      {
        title: "When one type threatens two of yours",
        body: "Look at your three. If the same attacking type is super-effective against two of them, your opponent will keep clicking that type. Your third Pokémon has to answer it — by resisting it, being immune to it, or knocking out the Pokémon that carries it. If none of those are true, that shared weakness is how games slip away.",
        takeaway:
          "You’ll dig into checks and counters later in Holes. For now, just learn to spot a shared weakness on your own three.",
        rows: [
          { label: "Garchomp", detail: "Dragon/Ground — weak to Ice" },
          { label: "Salamence", detail: "Dragon/Flying — also weak to Ice" },
          { label: "Your answer", detail: "Corviknight or Incineroar takes Ice better" },
        ],
        example: {
          slug: "garchomp",
          caption: "Two Dragons share an Ice weakness. Something else on the three has to cover Ice.",
        },
      },
    ],
    examples: [
      { slug: "garchomp", caption: "4× Ice. Immune to Electric." },
      { slug: "corviknight", caption: "Patches Fairy and Ground." },
    ],
    viz: "types",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "archetypes",
  },
  {
    slug: "abilities",
    band: "great-ball",
    title: "Abilities that change the game",
    thesis: "Intimidate is a tax. Disguise is a turn. Drizzle is the team. Prankster is +1, not +3.",
    skipIf: "Skip if you already play around Intimidate, Disguise, and weather overwrite.",
    body: [
      "Most abilities are flavor. These are not. If it is on the card, the rest of the three should cash it — or the rest of their three should deny it.",
    ],
    beats: [
      {
        title: "Intimidate",
        body: "Incineroar walks in and Attack drops. That is a switch-in tax on every physical attacker. Mirror Armor bounces it. Clear Body ignores it.",
        example: { slug: "incineroar", caption: "The cat. Fake Out plus the drop plus Parting Shot." },
      },
      {
        title: "Disguise and Multiscale",
        body: "Mimikyu’s costume eats one hit. Dragonite’s Multiscale halves the first hit at full HP. Both are a free turn if you spend them on a Dance, not on chip.",
        example: { slug: "mimikyu-disguised", caption: "Costume, then Swords Dance. Do not farm Fire after it pops." },
      },
      {
        title: "Prankster is +1",
        body: "Whimsicott Tailwind is priority +1. Fake Out is +3. Fake Out still flinches Cott. Dark does not stop Tailwind. Encore and Taunt still fail on Dark.",
        example: { slug: "whimsicott", caption: "Clock. Then switch — do not U-turn into Garchomp." },
      },
      {
        title: "Mold Breaker",
        body: "Excadrill ignores Multiscale, Disguise, and Levitate. The kite you hid is not safe if Drill is in.",
        example: { slug: "excadrill", caption: "Mold Breaker Earthquake. Sand Force in sand." },
      },
      {
        title: "Unaware",
        body: "Skeledirge ignores their Attack and Defense boosts when they hit it. A Moody or Calm Mind stack that looks scary is a Torch Song if you stayed. Unaware does not ignore their Speed, and it does not ignore Special Defense when you attack — do not assume the nuke always lands.",
        example: { slug: "skeledirge", caption: "Unaware plus Slack Off. Setup is not a wincon into this slot." },
      },
      {
        title: "The field",
        body: "Drizzle, Drought, Grassy Surge, Unburden. Weather overwrite is a funeral — one field wins. Unburden only doubles Speed after the item is gone.",
        example: { slug: "pelipper", caption: "Drizzle on entry. Hurricane never misses. Archaludon Electro Shots the same turn." },
      },
      {
        title: "Information",
        body: "Flame Body vs Flash Fire is a game. Volcarona that burns on contact is not the Volcarona Skeledirge walls. Ceruledge that absorbs Torch Song is not Weak Armor. Write the ability the turn you see it. That is a free knowledge gap.",
        example: { slug: "ceruledge", caption: "Flash Fire on Torch Song. Not Weak Armor. The rest of the game just changed." },
      },
    ],
    examples: [
      { slug: "incineroar", caption: "Intimidate" },
      { slug: "mimikyu-disguised", caption: "Disguise" },
      { slug: "dragonite", caption: "Multiscale" },
      { slug: "whimsicott", caption: "Prankster" },
      { slug: "excadrill", caption: "Mold Breaker" },
      { slug: "pelipper", caption: "Drizzle" },
      { slug: "skeledirge", caption: "Unaware" },
      { slug: "ceruledge", caption: "Flash Fire" },
    ],
    viz: "ability-field",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "moves",
  },
  {
    slug: "moves",
    band: "great-ball",
    title: "Moves that steal turns",
    thesis: "Fake Out, Protect, U-turn, Dance, rocks, priority. Each one is a sentence, not a slot filler.",
    skipIf: "Skip if you already know when not to Sucker Punch into Protect.",
    body: [
      "In singles these cost your turn. There is no partner Fake Out. Protect is a scout and a Sucker Punch stall — not leftover farming. U-turn is how you leave without donating a hit.",
    ],
    beats: [
      {
        title: "Fake Out",
        body: "Priority +3, flinch, once per send. Ghost is immune. Armor Tail blanks it. Protect wastes it. After a KO they can Fake Out again.",
        example: { slug: "incineroar", caption: "The format’s Fake Out. Then Parting Shot or Flare Blitz." },
      },
      {
        title: "Protect",
        body: "Priority +4. Scout a coverage move, stall Sucker Punch, burn a Choice lock. Consecutive Protect can fail. Clicking it to farm HP donates a free switch.",
        example: { slug: "garchomp", caption: "Protect into Ice/Fairy is a scout. Protect into a wall is a wasted KO window." },
      },
      {
        title: "U-turn and Parting Shot",
        body: "Momentum. You leave on your terms. Hard switching is a turn they attack. Parting Shot is −1 Attack and Special Attack, then you leave — they hit the cat, Garchomp is in. U-turn is also the covering click: if they stay you still damage, if they switch you still leave. Meowscarada Triple Axel into a Ground wall that might be Volcarona is a coin. U-turn covers both.",
        example: { slug: "meowscarada", caption: "U-turn covers stay and swap. Triple Axel only covers stay." },
      },
      {
        title: "Dance, rocks, priority",
        body: "Swords Dance, Dragon Dance, Calm Mind need a free turn — Disguise, Intimidate, or a KO. Stealth Rock taxes every switch and pops Multiscale; on a three that is still real — do not pivot through rocks just to feel busy. Burn and Life Orb chip the same way. Sucker Punch, Extreme Speed, Aqua Jet win races you already lost. Kingambit that is faster and low will Sucker Punch. Roost or Thunder Wave is the outplay if you outspeed.",
        example: { slug: "kingambit", caption: "Sucker Punch is Dark priority. It fails into Protect, into status, and into faster priority." },
      },
      {
        title: "Status is tempo",
        body: "Will-O-Wisp halves Attack. Thunder Wave cuts Speed. Taunt shuts Trick Room and Tailwind. Burn and para are not chip for its own sake — they buy the cleaner a turn. Wisp is the covering status: if they stay on a physical, Attack dies; if they switch to another physical, you still burn the slot that came in. Click it when two of their answers hate the burn.",
        example: { slug: "skeledirge", caption: "Wisp into a Ground wall that might be Garchomp. Both hate the burn." },
      },
      {
        title: "Once-per-item",
        body: "Poltergeist hits the held item. After that, that target has no item for Poltergeist to grab. Ceruledge that already Poltergeisted you cannot do it again. Play the second turn as if the nuke is gone. Same family as Fake Out once per send — the verb expired.",
        example: { slug: "ceruledge", caption: "Poltergeist once. Slack Off on the second send. The item is already spent." },
      },
    ],
    examples: [
      { slug: "incineroar", caption: "Fake Out, Parting Shot" },
      { slug: "meowscarada", caption: "U-turn covers both" },
      { slug: "skeledirge", caption: "Wisp covers two switch-ins" },
      { slug: "kingambit", caption: "Sucker Punch, Swords Dance" },
    ],
    viz: "flowchart",
    flowId: "they-fake-out",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "training",
  },
  {
    slug: "training",
    band: "great-ball",
    title: "66 points is a statement",
    thesis: "Max 32 in one stat. Sitrus vs Sash vs Choice vs Mega stone. Leftover 2 lives in HP.",
    skipIf: "Skip if you already spend 32 Spe on purpose and know why Sash is not Sitrus.",
    body: [
      "There are no EVs. 66 Stat Points. One point is +1 at Level 50. 32 in a stat is the cap — that is a statement, not a default. Nature still pluses one stat and minuses another.",
    ],
    beats: [
      {
        title: "The pile",
        body: "Classroom default: 32 in the stat that KOs, 32 in Speed if you must move first, leftover 2 in HP. If Tailwind, rain, Trick Room, or Unburden already solves Speed, those 32 move into HP and Defense.",
        example: { slug: "garchomp", caption: "32 Atk / 32 Spe if the race is the plan. Bulk if Cott already clocked." },
      },
      {
        title: "Sitrus vs Sash",
        body: "Sitrus is a second HP bar after you take a hit and stay. Sash is one guaranteed live from full — then you are glass. Sash on a Tailwind setter lives the Fake Out. Sitrus on a wall stays in the slot.",
        example: { slug: "whimsicott", caption: "Sash lives the send you should not have taken. Cloak lives Fake Out without the flinch." },
      },
      {
        title: "Choice vs Mega stone",
        body: "Choice Specs or Band is power and a lock. Protect and switch punish the lock. The Mega stone is the Omni Ring — once per battle, the form is the wincon. You do not splash a Mega onto a three that already had a closer.",
        example: { slug: "charizard-mega-y", caption: "Charizardite Y is Drought and the nuke. The item slot is gone." },
      },
    ],
    examples: [
      { slug: "whimsicott", caption: "Sash clock" },
      { slug: "garchomp", caption: "32 Spe statement" },
      { slug: "charizard-mega-y", caption: "The stone" },
    ],
    viz: "training",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "speed",
  },
  {
    slug: "speed",
    band: "great-ball",
    title: "You race their whole list",
    thesis: "Not the Pokémon in front of you. The three they brought. 32 Spe, Scarf, Mega, Trick Room, weather, priority.",
    skipIf: "Skip if you already pack a plan for the race you lose.",
    body: [
      "Whoever moves first often decides the KO. On a three there is no partner Tailwind. If their fastest outruns your fastest and can OHKO it, that race is the match unless you packed priority, a clock, or a field.",
    ],
    beats: [
      {
        title: "The number",
        body: "32 Spe is a statement. Choice Scarf is another. A Mega that jumps a Speed tier is a third. Speed ties are a coin flip — do not build a three that needs to win ties.",
        example: { slug: "cinderace", caption: "Libero plus 32 Spe. The race is the job." },
      },
      {
        title: "When you lose the number",
        body: "Revenge: a faster or priority Pokémon that KOs whatever just got a KO. Priority: Sucker Punch, Aqua Jet, Fake Out, Extreme Speed. A clock: Trick Room, so the slow truck moves first. Weather Speed: Swift Swim and Chlorophyll only count if the field is up. Tailwind costs the setter’s turn.",
        example: { slug: "basculegion-male", caption: "Swift Swim under Pelipper. Aqua Jet if rain dies. That is revenge, not a personality." },
      },
      {
        title: "Pick the races you care about",
        body: "You cannot outrun everyone. Spend Speed on the Pokémon that must move first for the wincon to fire. Leave the rest on bulk or attack. A three that is kind of fast loses to a three that chose.",
        example: { slug: "whimsicott", caption: "184 Timid. Tailwind then leave. The cleaner inherits the clock." },
      },
    ],
    examples: [
      { slug: "whimsicott", caption: "Honest clock" },
      { slug: "corviknight", caption: "Slow shield" },
      { slug: "garchomp", caption: "Cleans under Tailwind" },
      { slug: "excadrill", caption: "Scale Sweep sand" },
      { slug: "primarina", caption: "Special wall" },
      { slug: "dragonite", caption: "Multiscale kite" },
    ],
    viz: "speed-tape",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "jobs",
  },
  {
    slug: "jobs",
    band: "great-ball",
    title: "A Pokémon is a job",
    thesis: "Support, breaker, speed, weather, Mega. Digest your three in four sentences before you queue.",
    skipIf: "Skip if you already build from the job, not the name, and can say how yours wins.",
    body: [
      "Stats tell the body. Ability and movepool tell the job. High Speed plus Attack looks like a sweeper — without a Dance, priority, or a Scarf story it is just a fast breaker.",
      "Before you queue, digest the three: what field or clock you force, whether you win by attacking or pivoting, which Mega you pick if two could, and which support verbs you actually click. If you cannot say those four, you do not understand the three yet.",
    ],
    beats: [
      {
        title: "Four sentences — Honest Balance",
        body: "Field: Tailwind, four turns, Cott clicks it then leaves. Offense vs defense: Corvi soaks Ice and Fairy so Garchomp can clean. Mega: none on this three — the Omni Ring is not the wincon. Support verbs: Tailwind, U-turn, Brave Bird chip. Say that out loud. Then queue.",
        example: { slug: "whimsicott", caption: "Clock. Corvi soaks. Garchomp cleans. No Mega." },
      },
      {
        title: "Support",
        body: "Buys turns: Intimidate, Fake Out, burn, pivot. Does not win by knocking things out. Incineroar and Whimsicott are both support. One flinches. One clocks.",
        example: { slug: "incineroar", caption: "Pivot. The other example is Cott." },
      },
      {
        title: "Breaker",
        body: "Takes KOs. Kingambit cracks walls. Excadrill punches what Steel does not like. You do not ask a breaker to absorb two super-effective hits.",
        example: { slug: "kingambit", caption: "The truck. Drill is the other." },
      },
      {
        title: "Speed",
        body: "Outrun, revenge, or flip the clock. Cinderace races. Sneasler Unburdens. Farigiraf sets Trick Room. Without this job you guess every turn.",
        example: { slug: "cinderace", caption: "The racer. Sneasler is the Unburden clock." },
      },
      {
        title: "Weather",
        body: "The field is the team. Pelipper is rain. Mega Charizard Y is sun. You do not splash weather. The other two cash it.",
        example: { slug: "pelipper", caption: "Drizzle. Y is Drought and the nuke." },
      },
      {
        title: "Mega",
        body: "One per battle. Mega Salamence Aerilates. Mega Charizard Y Droughts. If it is not the wincon, you spent the Omni Ring on a flex.",
        example: { slug: "salamence-mega", caption: "The kite. Y is the other stone." },
      },
    ],
    examples: [
      { slug: "incineroar", caption: "Support" },
      { slug: "whimsicott", caption: "Support" },
      { slug: "kingambit", caption: "Breaker" },
      { slug: "excadrill", caption: "Breaker" },
      { slug: "cinderace", caption: "Speed" },
      { slug: "sneasler", caption: "Speed" },
      { slug: "pelipper", caption: "Weather" },
      { slug: "charizard-mega-y", caption: "Weather / Mega" },
      { slug: "salamence-mega", caption: "Mega" },
    ],
    viz: "roster",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "building",
  },
  {
    slug: "building",
    band: "ultra-ball",
    title: "How you build a three",
    thesis: "Win condition, the partner that lets it fire, the patch for the shared hole. Then phys/spec mix and a Speed plan.",
    skipIf: "Skip if you already say the sentence out loud before you pick names.",
    body: [
      "Beginners pick three they like. Intermediate players pick a sentence: this three wins if Kingambit gets a free Sucker Punch. That sentence is the win condition. Everything else makes it true, or keeps you alive when it is not.",
      "Same four sentences as jobs, now as a build check. Field or clock. Offense vs defense. Mega pick. Support verbs. If a slot does not change one of those sentences, cut it.",
    ],
    beats: [
      {
        title: "Four sentences on the three you built",
        body: "Honest Balance: Tailwind is the field. Corvi is the defense so Garchomp can be the offense. No Mega. Support is Tailwind then U-turn. Control Balance swaps Cott for Incineroar — Fake Out and Parting Shot instead of a clock, so Garchomp must spend Speed. If you cannot tell those two threes apart in four sentences, you do not understand either.",
        example: { slug: "corviknight", caption: "Shield on Honest. The patch that lets Garchomp be the clean." },
      },
      {
        title: "Name the win condition",
        body: "The Pokémon or mode that ends the match if the plan works. One sentence. If it needs two wincons, you are already asking the three to do too much.",
        example: { slug: "kingambit", caption: "Free Sucker Punch after Attack is dropped and a wall is gone." },
      },
      {
        title: "The partner that lets it fire",
        body: "Not a second favorite. Intimidate so the breaker lives. A pivot so you leave on your terms. Trick Room so the truck moves first. Name the Pokémon that stops your wincon, then pack the slot that answers it. Meowscarada Triple Axel is how Garchomp does not lead on your Mega. Dragonite is how Scovillain does not burn the Mega. If that partner does not change a calculation, cut it.",
        example: { slug: "meowscarada", caption: "Ice into Garchomp so the Mega is not the lead. The wincon stays in the bag." },
      },
      {
        title: "Patch the hole those two share",
        body: "Garchomp and Kingambit both hate a special Fairy. That is the hole. Gholdengo is the patch: Ghost Steel, status immunity. On a three you cannot hide a shared weakness.",
        example: { slug: "gholdengo", caption: "Good as Gold. Fighting immune. The Fairy patch." },
      },
      {
        title: "Cores, not type soup",
        body: "A core is two Pokémon that work as a unit: type synergy and checks-and-counters synergy. Kingambit plus Gholdengo is a Steel core that still needs a Ground answer. Type overlap without a threat answer is a list, not a core. Build a breaking core first — something that forces progress — then the shield.",
        example: { slug: "kingambit", caption: "Breaker plus Gholdengo. Garchomp is the Ground patch and the clean." },
      },
      {
        title: "Mix physical and special",
        body: "If all three punch Attack, a physical wall sits there all match. You need one Pokémon that hits the side the other two cannot.",
        example: { slug: "gholdengo", caption: "Make It Rain. The other two are physical." },
      },
      {
        title: "Pack a Speed plan",
        body: "Outrun them, priority them, flip the clock, or sit a wall that does not care who moves first. If your three has none of these, you are guessing every race.",
        example: { slug: "garchomp", caption: "32 Spe, or Tailwind, or Sucker Punch on the truck." },
      },
      {
        title: "Write the threatlist",
        body: "Name five Pokémon you will see that wall or sweep this three. If you have no switch, no revenge, and no deny for one of them, rebuild that slot. Do not patch by adding a fourth job — you only have three.",
        example: { slug: "kingambit", caption: "Fighting is 1×, not a resist. Gholdengo is the immune. If you cut Gholdengo, write what now answers Close Combat." },
      },
      {
        title: "Play, then change one thing",
        body: "Ten games. Write what swept you. Swap one slot or one item. Do not rebuild the whole three because one rain team beat you. Manuals are the exam: load the classroom three, walk the tree, then steal the script onto yours.",
        example: { slug: "gholdengo", caption: "If Fairy kept sitting, the patch was the slot. Not the wincon." },
      },
    ],
    examples: [
      { slug: "kingambit", caption: "Wincon" },
      { slug: "garchomp", caption: "Lets it fire" },
      { slug: "gholdengo", caption: "The patch" },
    ],
    viz: "wincon-stack",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "holes",
  },
  {
    slug: "archetypes",
    band: "poke-ball",
    title: "What are they trying to do?",
    thesis: "Name their plan on preview before you name a lead. Balance pivots. Hyper Offense sprints. Trick Room flips. Weather and terrain cash a field. Tailwind is a clock you can read.",
    skipIf: "Skip if you already identify their style in one look, including hybrids.",
    body: [
      "An archetype is the game plan, not the species list. Ask what their three is trying to accomplish. If you cannot name it, you are already behind on preview.",
      "Squads hybridize. Rain that still pivots is still rain. Trick Room with a Tailwind backup is Tail Room — they win if either clock lands. Read the mode they can force, then the backup.",
      "Later, Ultra Ball turns the name into a bring plan: if you see these Pokémon, you are likely facing that style — and which styles it beats or loses to.",
    ],
    beats: [
      {
        title: "Balance — they want to pivot",
        body: "Good spread of offense and a switch that lives. If the lead goes wrong they still have a game. Honest Balance clocks with Cott, soaks with Corvi, cleans with Garchomp. Fire-Water-Grass cores are the same idea: complementary types so they can switch.",
        example: { slug: "whimsicott", caption: "Honest Balance. Tailwind, then the hand-off." },
      },
      {
        title: "Hyper Offense — they want KOs now",
        body: "Win by turn 4 or the snowball dies. One support, everyone else damages. The kite stays in the bag until Ice and Fairy are gone. Scale Sweep hides Dragonite. Disguise Sweep hides it behind Mimikyu’s costume.",
        example: { slug: "dragonite", caption: "Multiscale kite. Extreme Speed after the wall is gone." },
      },
      {
        title: "Tailwind is a clock you can read",
        body: "Whimsicott, Murkrow, Tornadus on preview means they want to double Speed and cash slower names without a Scarf. It is often a hybrid sitting on Balance or Hyper Offense — not a separate three you pick in Team. Four turns including the click. After that they are slow again.",
        example: { slug: "whimsicott", caption: "Prankster Tailwind. Then they leave. The cleaner inherits the clock." },
      },
      {
        title: "Trick Room — they flip the race",
        body: "Slow on purpose. Four turns including the click. Armor Tail blanks Fake Out. Then the truck cashes. Tail Room is the hybrid: Farigiraf plus a Tailwind name so they still race if the room gets Taunted.",
        example: { slug: "farigiraf", caption: "The setter. Kingambit and Gholdengo cash the room." },
      },
      {
        title: "Rain, sun, Grassy — the field is the team",
        body: "The field walks in with the setter. Overwrite is the funeral. Terrain cuts Earthquake. Unburden needs the seed gone. Pelipper is rain. Mega Charizard Y is sun. Rillaboom is the grass room. Hybrids exist: rain that still U-turns is rain with a Balance backup.",
        example: { slug: "pelipper", caption: "Rain. Y is sun. Rillaboom is the room." },
      },
    ],
    examples: [
      { slug: "whimsicott", caption: "Balance / Tailwind" },
      { slug: "dragonite", caption: "Kite" },
      { slug: "farigiraf", caption: "Room" },
      { slug: "pelipper", caption: "Rain" },
    ],
    viz: "chooser",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "abilities",
  },
  {
    slug: "holes",
    band: "ultra-ball",
    title: "Holes, checks, and coverage",
    thesis: "If two of yours share a hole, the match is already about that hole. A resist is not a counter.",
    skipIf: "Skip if you already refuse to bring two 4× Ice names without a patch.",
    body: [
      "Type trivia is not the skill. The skill is seeing the STAB that hits two of yours, and knowing whether you have a switch or a prayer. Open preview makes that hole public.",
    ],
    beats: [
      {
        title: "Shared weakness",
        body: "Write the type that super-effectives two names. If you have no switch that takes that hit, rebuild. Garchomp plus Salamence is a Dragon hole. Pelipper plus Basculegion is an Electric hole.",
        example: { slug: "garchomp", caption: "With Mega Salamence: 4× Ice twice. With Kingambit and Gholdengo: Ice is patched." },
      },
      {
        title: "Check versus counter",
        body: "A counter switches in on any of their attacks and wins. A check wins if both are already in, but dies to a predicted coverage. Beginners treat every resist as a counter. Kingambit into Garchomp is not a counter if Earthquake plus a boost still KOs.",
        example: { slug: "kingambit", caption: "Steel resists Dragon. Earthquake is Ground. That was a check, not a counter." },
      },
      {
        title: "Coverage",
        body: "STABs do the job most turns. The extra move is for the Pokémon that would sit there otherwise. If the three still cannot make that Pokémon leave, you picked the wrong wincon.",
        example: { slug: "garchomp", caption: "Stone Edge or Dragon on Flying. Not Rock Slide spam into birds that live it." },
      },
    ],
    examples: [
      { slug: "garchomp", caption: "Hole" },
      { slug: "salamence-mega", caption: "Same Ice hole" },
      { slug: "gholdengo", caption: "The patch" },
    ],
    viz: "matchup",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "reading-their-six",
  },
  {
    slug: "reading-their-six",
    band: "ultra-ball",
    title: "If you see these, you’re facing that",
    thesis:
      "Preview is a classification problem. Signature Pokémon name the plan. Then name what that plan beats, what beats it, and which Pokémon to reach for.",
    skipIf: "Skip if you already map Pelipper → rain, Farigiraf → room, and know which styles punish each.",
    body: [
      "You already learned to name styles. This chapter is the opponent-facing board: tell → archetype → preparation. Ladder sixes still hide three; the IQ is the same — classify what can walk out of the back.",
      "Tailwind and Tail Room are hybrid clocks, not separate Team picks. Stall is usually fat Balance. Read the mode they can force, then the backup.",
    ],
    beats: [
      {
        title: "Must-appear setters",
        body: "Pelipper is rain or the rain is a lie. Farigiraf is Trick Room or the room never starts. Rillaboom is Grassy or Unburden partners are a bluff. Mega Charizard Y is sun. Plan the lead as if that name is coming even if they bluff something else first.",
        example: { slug: "pelipper", caption: "No bird, no rain. Must appear." },
      },
      {
        title: "Frail HO cores",
        body: "Mega Salamence, Dragonite, Excadrill, Disguise Mimikyu with no fat pivot beside them — Hyper Offense. They win by turn 4 or the sprint is over. Ice, priority, and walls that shrug both STABs are your prep list.",
        example: { slug: "salamence-mega", caption: "Snowball Mega. No Corvi beside it → HO." },
      },
      {
        title: "Balance versus Good Stuff",
        body: "Garchomp plus Kingambit plus a Ghost/Steel patch is Balance. Whimsicott or Corviknight on the same six is still Balance with a readable clock or soak. Good Stuff is the same plan under another name.",
        example: { slug: "gholdengo", caption: "The patch. Two attackers without this is just HO glass." },
      },
      {
        title: "Weather and terrain fields",
        body: "The field walks in with the setter. Overwrite is the funeral — Drought versus Drizzle, Fire into Rillaboom. Bring the answer that sits on the field, not only the answer that sits on one attacker.",
        example: { slug: "charizard-mega-y", caption: "Drought Mega. Rock and Water punish; rain overwrites." },
      },
      {
        title: "Hybrid clocks",
        body: "Whimsicott next to Farigiraf is Tail Room — they win if either clock lands. Rain that still U-turns is rain with a Balance backup. Do not prepare for only one story.",
        example: { slug: "whimsicott", caption: "Tailwind clock. On Balance or Tail Room, read both modes." },
      },
      {
        title: "Turn the read into a bring",
        body: "Once you name their style, open Strong into / Weak into. Reach for the example Pokémon that punish their plan. Then Preview teaches the lead sentence — this chapter only classifies and prepares.",
        example: { slug: "raichu", caption: "Into rain: Electric is the bring, not a surprise mid-match." },
      },
    ],
    examples: [
      { slug: "pelipper", caption: "Rain tell" },
      { slug: "farigiraf", caption: "Room tell" },
      { slug: "rillaboom", caption: "Grassy tell" },
      { slug: "charizard-mega-y", caption: "Sun tell" },
      { slug: "salamence-mega", caption: "HO tell" },
      { slug: "gholdengo", caption: "Balance patch" },
    ],
    viz: "archetype-tells",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "preview",
  },
  {
    slug: "preview",
    band: "ultra-ball",
    title: "Preview is turn 0",
    thesis: "Name their plan and yours. List the threats. Find the Pokémon that must appear. Then pick a lead that answers both of their modes.",
    skipIf: "Skip if you already write one sentence before you confirm the lead.",
    body: [
      "Open lists. You are looking at three names. Beginners send their strongest Pokémon. Intermediate players send the Pokémon that answers their likely lead, or that forces the switch the wincon needs.",
      "You should already have classified their style and which Pokémon punish it. Bring that digest together with yours. What are they trying to do. What are you trying to do. The lead is the first line of that plan, not a favorite. Ladder rentals are often six — you pick three into their list. The classroom three is the three you already picked. The IQ is the same: name what can come from the back.",
    ],
    beats: [
      {
        title: "Name what they want",
        body: "Before you click, write their likely line: stay and Fake Out, switch to the Ground, switch to the special. A Ground wall into Skeledirge wants Earthquake, rocks, or Yawn — or a switch to Garchomp or Rotom-Wash. If you cannot name two things they want, you do not have a covering click yet.",
        example: { slug: "skeledirge", caption: "Will-O-Wisp is safe into the stay and into two of the switch-ins." },
      },
      {
        title: "Six questions",
        body: "What is their wincon. What is their Speed control. Which of yours is compromised. Safe lead or committed. Which of yours must never leave. Say the game in one sentence. If you cannot say it, you do not have a plan.",
        example: { slug: "dragonite", caption: "Scale Sweep’s wincon. Ice is the hole. Excadrill is the likely lead." },
      },
      {
        title: "List the biggest threats",
        body: "Write the names that actually end you: their weather setter, their Mega, their cleaner. Honest into Scale Sweep: Excadrill Mold Breaker, Primarina Ice/Fairy, Dragonite Extreme Speed. If you cannot name three threats you are guessing the lead.",
        example: { slug: "excadrill", caption: "Mold Breaker into Multiscale. The threat you answer before the kite comes." },
      },
      {
        title: "The Pokémon that must appear",
        body: "On a three, some names are on every mode. Pelipper must appear or rain is a lie. Farigiraf must appear or Trick Room never starts. Rillaboom must appear or Grassy Unburden is dead. Your game plan must account for that name even if they bluff the lead. That is the singles version of reading a must-bring.",
        example: { slug: "pelipper", caption: "No Pelipper, no rain. Plan the lead as if the bird is coming." },
      },
      {
        title: "A lead that answers both modes",
        body: "Hybrids have two ways to win. Rain that still pivots. Trick Room with a Tailwind backup. Do not lead a Pokémon that only beats one story. Honest into Scale Sweep: Cott Tailwind answers the sand race and still leaves Corvi for Ice. Leading Garchomp into Ice answers nothing.",
        example: { slug: "whimsicott", caption: "Honest clock into Scale Sweep. Tailwind, then Corvi if Ice comes." },
      },
      {
        title: "Never-leave",
        body: "The Pokémon that must survive to execute your wincon. Protect it in preview. Do not send it into its answer. Do not switch it out once it is winning.",
        example: { slug: "garchomp", caption: "Honest’s cleaner. Keep it in the bag until Ice is spent." },
      },
    ],
    examples: [
      { slug: "whimsicott", caption: "Your clock" },
      { slug: "corviknight", caption: "Your shield" },
      { slug: "garchomp", caption: "Your clean" },
      { slug: "skeledirge", caption: "Covering Wisp" },
      { slug: "excadrill", caption: "Their lead" },
      { slug: "primarina", caption: "Their special" },
      { slug: "dragonite", caption: "Their kite" },
    ],
    viz: "preview-board",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "turns",
  },
  {
    slug: "turns",
    band: "master-ball",
    title: "Lead, mid, late",
    thesis: "The lead buys the mid. The mid buys the late. 50/50s are structured so the wrong guess is cheap.",
    skipIf: "Skip if you already play the room you are in, not the preview you wrote.",
    body: [
      "Risk is a play that donates your only answer for chip. Reward is a play that keeps that answer and still threatens. Seasoned players do not win coin flips. They refuse the coin flip that ends the match.",
      "After every turn, write what you now know: item, Speed, coverage, whether they like Protect. Prediction is information plus a cheap wrong guess — not a hunch from a video.",
    ],
    beats: [
      {
        title: "Lead",
        body: "Take their lead, deny their field, or gather information. Have a backup send if they bluff. Update the sentence when they do not lead what you previewed. Assume they click what beats what is in front of them until they prove they predict.",
        example: { slug: "incineroar", caption: "Fake Out lead. Then Parting Shot into the answer." },
      },
      {
        title: "Mid",
        body: "Momentum vs hard switch. Never-leave stays in. Overprediction is the beginner tax — click what beats the Pokémon in front of you unless the read is cheap to be wrong. If you will not KO, they hit back: chip is only correct when the next hit does not end you. Do not donate a free Swords Dance: sending Meowscarada to chip Kingambit is tempo you gave away. Send the answer, or Fake Out and leave.",
        example: { slug: "kingambit", caption: "Do not chip it with a Pokémon it can Dance on. That is donated tempo." },
      },
      {
        title: "Late",
        body: "The wincon fires. Click the KO. Protect is a coverage scout, not a stall. If this Pokémon is your only answer to what they have left, do not donate it. Crits and 10% burns happen. Play the line that wins more often, then take the next game.",
        example: { slug: "garchomp", caption: "Earthquake the grounded. Stone Edge the bird. Tailwind is dying." },
      },
    ],
    examples: [
      { slug: "incineroar", caption: "Lead" },
      { slug: "corviknight", caption: "Mid shield" },
      { slug: "garchomp", caption: "Late clean" },
    ],
    viz: "flowchart",
    flowId: "turns",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "tempo",
  },
  {
    slug: "tempo",
    band: "master-ball",
    title: "Who is forcing the next switch?",
    thesis: "Name what they want. Click the line that covers two of those wants. Safe when ahead. Predict when behind. Do not donate a Dance.",
    skipIf: "Skip if you already know when a covering U-turn is better than a heroic Triple Axel.",
    body: [
      "Tempo is who decides the next switch. Ahead means they have to leave. Behind means you have to leave. Neutral means both can stay. Singles IQ is reading that, then picking a covering click — a move that still works if they stay and still works if they switch.",
      "Safe plays win most games. A hard predict is what you spend when you are already behind and a safe click keeps you behind. Information — Flash Fire, Flame Body, Poltergeist spent, Body Press not Brave Bird — is tempo you bank for later.",
    ],
    beats: [
      {
        title: "Cover two options",
        body: "Skeledirge into a Ground wall: they stay for Earthquake, rocks, or Yawn, or they switch to Garchomp or Rotom-Wash. Will-O-Wisp burns the stay and two of the physical switch-ins. Meowscarada into that same wall: Triple Axel only covers stay. U-turn covers stay and the Volcarona that would otherwise eat Ice. The covering click is the one that is still correct on two of their lines.",
        example: { slug: "skeledirge", caption: "Wisp covers stay and the physical switch. Torch Song only covers stay." },
      },
      {
        title: "Do not donate setup",
        body: "Chip is not free if they can Swords Dance, Moody, or Calm Mind on the Pokémon you sent. Kingambit into Meowscarada is a Dance if you stay for a resisted knock. Fake Out and leave, or send the Fighting answer. Unnecessary chip is tempo you handed them.",
        example: { slug: "kingambit", caption: "If you are not KOing this turn, you are offering a Dance. Don’t." },
      },
      {
        title: "Behind means you predict",
        body: "Meowscarada into Corviknight is behind — you cannot hit the bird, so you U-turn. They can U-turn too and keep the tempo. The safe send eats whatever comes in. The steal is reading their pivot and sending the Pokémon that hated seeing Corvi — your Mega — now that the bird is leaving. If you are wrong you ate Brave Bird. That is the tax for being behind. When ahead, do not pay it.",
        example: { slug: "corviknight", caption: "They U-turn, you send the Mega. The bird was their check. That was the steal." },
      },
      {
        title: "Reset on the right matchup",
        body: "Skeledirge Slack Off in front of Corviknight is a tempo reset: Ghost is immune to Body Press, U-turn is quad resisted. You do not need a KO. You need HP back and the bird stuck. Do not waste Dragonite’s Multiscale on a Thunder Wave if the hit still KOs. Spend the free turn on damage.",
        example: { slug: "skeledirge", caption: "Slack Off vs Corvi is the steal. You were behind. Now you are not." },
      },
      {
        title: "Write what you learned",
        body: "Flame Body vs Flash Fire. Poltergeist already used. They clicked Body Press, not Brave Bird. Kingambit held for Supreme Overlord at the end. Each of those is a covering click next turn. Prediction without that list is a hunch.",
        example: { slug: "ceruledge", caption: "Flash Fire on Torch Song. The 1v1 just flipped. Bank it." },
      },
    ],
    examples: [
      { slug: "skeledirge", caption: "Covering Wisp / Slack Off" },
      { slug: "meowscarada", caption: "Covering U-turn" },
      { slug: "corviknight", caption: "The bird that puts you behind" },
      { slug: "kingambit", caption: "Do not donate the Dance" },
    ],
    viz: "flowchart",
    flowId: "tempo",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "positioning",
  },
  {
    slug: "positioning",
    band: "master-ball",
    title: "The wincon can change",
    thesis: "Turn 1’s plan is not turn 10’s. Pivot, Protect, or sacrifice. Count the timers. Steal the field.",
    skipIf: "Skip if you already change the wincon when the board changes, and you count Tailwind and rain.",
    body: [
      "A win condition is the Pokémon or mode you need to win right now. It can change. Tailwind Garchomp is the wincon until Ice is in the slot and Corvi has to become the 3v3. Play the board in front of you, not the preview sentence you wrote.",
      "After the lead/mid/late classroom: ask what wins this position. Then spend a turn on the line that makes that true.",
    ],
    beats: [
      {
        title: "Pivot, Protect, or sacrifice",
        body: "Pivot (U-turn, Parting Shot) takes a hit on the way out so the next Pokémon comes in with an offensive advantage. Protect stalls a timer, scouts coverage, or denies Sucker Punch — consecutive Protect can fail. Sacrifice is sending a Pokémon you know will faint to retake weather, burn a Choice lock, or put the cleaner in for free. All three are positioning. Clicking super-effective because it is in front of you is not.",
        example: { slug: "incineroar", caption: "Parting Shot is the pivot. Protect is the stall. The cat can also be the sacrifice into a locked Ice." },
      },
      {
        title: "Count the timers",
        body: "Tailwind is four turns including the click. Trick Room is four including the click. Weather lasts until overwritten or the setter is gone. If they need two more turns of room to KO you, stall. If your Tailwind dies next turn, the cleaner must KO now or you lose the race. Sacrifice exists so you can live to the end of their timer.",
        example: { slug: "farigiraf", caption: "Room is four. Stall the fifth and their truck is slow again." },
      },
      {
        title: "Steal the field — Electro Shot has to charge",
        body: "Rain Archaludon Electro Shots the same turn if rain is up. If you walk Tyranitar or Mega Charizard Y in, rain dies. Electro Shot must charge. That turn is the KO window — Archaludon is pinned. Same script as stealing rain so Swift Swim Basculegion is just a Water-type. Weather wars are positioning, not flavor.",
        example: { slug: "archaludon", caption: "Electro Shot in rain is a nuke. Electro Shot in sand is a charge. Steal Pelipper’s field." },
      },
      {
        title: "Worked board: rain vs a sand answer",
        body: "They have Pelipper and Archaludon. Rain is up. Your Staraptor or Corvi is in and cannot KO Archaludon this turn. If you stay, Electro Shot KOs. If you switch to the weather setter, you take a hit and rain dies — next turn they charge, you KO. The wincon was not “Garchomp cleans.” The wincon became “I own the weather.” That is the read.",
        example: { slug: "tyranitar", caption: "Sand Stream overwrite. The sacrifice send if the slot is already lost." },
      },
    ],
    examples: [
      { slug: "tyranitar", caption: "Steal rain" },
      { slug: "archaludon", caption: "Charge if rain dies" },
      { slug: "whimsicott", caption: "Four-turn clock" },
      { slug: "incineroar", caption: "Pivot or sacrifice" },
    ],
    viz: "none",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "review",
  },
  {
    slug: "review",
    band: "master-ball",
    title: "Why did that happen?",
    thesis: "Wins and losses are both information. Name the turn. Take the loss. Know when to stop.",
    skipIf: "Skip if you already write why you won or lost before you queue again.",
    body: [
      "It is not about the W or the L. It is about why. Bad lead, wrong read, bad positioning, or they outplayed you. If you cannot name the turn, you will repeat it.",
      "Champions is best-of-one with open lists. One turn can decide it. That is why review is a skill, not a mood.",
    ],
    beats: [
      {
        title: "Name the turn",
        body: "Did you lead wrong. Did you click Protect into a KO you needed. Did you donate the never-leave. Did you donate a Dance. Did they have a coverage you refused to scout. Write one sentence. Manual notes exist so that sentence has a home. “I lost to rain” is not a review. “I stayed Corvi into Electro Shot instead of sending the weather steal” is. “I Triple Axelled when U-turn covered the Volcarona” is.",
        example: { slug: "corviknight", caption: "The turn you stayed is the review, not the match result." },
      },
      {
        title: "Why you won counts too",
        body: "Do not take a good lead for granted. Did you deduce their archetype. Did you protect the never-leave. Did the wincon you named on preview still fire, or did a new one appear. If you cannot say why you won, you cannot repeat it.",
        example: { slug: "garchomp", caption: "Clean after Ice was spent. That was the plan. Write that it worked." },
      },
      {
        title: "Take accountability",
        body: "Crits, 10% burns, and cheese exist. Best players still win more because they review. If every loss is RNG or “broken,” you have boxed yourself: nothing you do can change the next game. The ladder resets often. This morning does not decide this afternoon.",
        example: { slug: "kingambit", caption: "Sucker Punch into Protect is on you. The crit on the next hit is not the lesson." },
      },
      {
        title: "Know when to stop",
        body: "Tilt is a lose streak you choose. After a bad loss, if you are clicking without a sentence, log off. Touch grass. A week away is cheaper than rage-queueing Master Ball down to Ultra. Concentration is the wincon you cannot pack in Stat Points.",
        example: { slug: "whimsicott", caption: "If the next lead is a coin flip you do not care about, you are already gone." },
      },
    ],
    examples: [
      { slug: "corviknight", caption: "The turn" },
      { slug: "garchomp", caption: "Why the win" },
      { slug: "kingambit", caption: "Accountability" },
    ],
    viz: "none",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "keeping-up",
  },
  {
    slug: "keeping-up",
    band: "master-ball",
    title: "What is everyone using?",
    thesis: "Knowledge is a gap. Ranked Meta is usage. Manuals are the common sets. Then you already know their three.",
    skipIf: "Skip if you already check usage and a classroom set before you blame the ladder.",
    body: [
      "If they bring a meta three and you already know the builds, you have a gap. If you bring something off-kilter and they have never seen it, you have a gap the other way. You only get either if you look.",
      "This app’s Ranked Meta is the usage board. Classroom manuals are the common sets and the if/then. You do not need a second website to start. After you can read a preview, the snapshot is homework, not trivia.",
    ],
    beats: [
      {
        title: "Usage is who you must answer",
        body: "Open Ranked Meta. Sort by how often a name appears. Those are the five on your threatlist, not a vibes list. If Garchomp and Primarina sit at the top, your three needs an Ice or Fairy answer that is not a prayer. Dated snapshot — read the as-of.",
        example: { slug: "garchomp", caption: "If it is everywhere, write the switch before you queue." },
      },
      {
        title: "Sets are how they actually click",
        body: "Usage without sets is a name. Manuals show the classroom item, spread, and Never line. Ranked Meta shows common moves and Stat Point piles when we have them. You are looking for the difference between Sitrus Corvi and Helmet Corvi, Specs Primarina and leftover, Archaludon that Electro Shots versus Body Press. That is the knowledge gap.",
        example: { slug: "primarina", caption: "Moonblast is the name. The item is the set. The set is the preview." },
      },
      {
        title: "Stay a week ahead",
        body: "When a three gets popular, ladder fills with it. If you already walked the manual — Honest, Scale Sweep, rain — you know the lead, the hole, and the never-leave. That is half the battle. Do not copy a rental you cannot digest in four sentences.",
        example: { slug: "pelipper", caption: "Rain is on the board. Walk the rain manual before you invent a counter." },
      },
      {
        title: "Then the exam",
        body: "Keeping up is not a substitute for playing. Ten games, change one thing, review the turn. Manuals are the Champion practicum: load a classroom three, walk the tree, steal the script onto yours.",
        example: { slug: "whimsicott", caption: "Honest is the exam. Meta is the homework. Review is the habit." },
      },
    ],
    examples: [
      { slug: "garchomp", caption: "Usage" },
      { slug: "primarina", caption: "Sets" },
      { slug: "pelipper", caption: "A three you already studied" },
    ],
    viz: "none",
    relatedManuals: [
      "balance-salamence-primarina-aegislash",
      "aggressive-balance-garchomp-primarina-corviknight",
      "balance-garchomp-corviknight-kingambit",
    ],
    next: "manuals",
  },
];

export const JOB_ROSTER: ArchetypeSlot[] = [
  {
    job: "support",
    literacy: "disruptor",
    alias: "Intimidate pivot",
    why: "Fake Out, drop Attack, Parting Shot. The other two get a free hit. Support is the turn buyer, not the KO.",
    exampleSlug: "incineroar",
  },
  {
    job: "support",
    literacy: "setter",
    alias: "Prankster clock",
    why: "Tailwind is +1. Then switch — Cott is too fast for a safe U-turn. The second support example is the clock, not a second cat.",
    exampleSlug: "whimsicott",
  },
  {
    job: "breaker",
    literacy: "wallbreaker",
    alias: "The truck",
    why: "Kowtow Cleave and Sucker Punch. Cracks the Steel and Rock that would sit on a cleaner all match.",
    exampleSlug: "kingambit",
  },
  {
    job: "breaker",
    literacy: "wallbreaker",
    alias: "Mold Breaker sand",
    why: "Earthquake ignores Multiscale and Disguise. The other breaker. Same job, different hole it punches.",
    exampleSlug: "excadrill",
  },
  {
    job: "speed",
    literacy: "sweeper",
    alias: "Libero racer",
    why: "32 Spe plus Pyro Ball. The race is the job. Without this slot you guess every turn.",
    exampleSlug: "cinderace",
  },
  {
    job: "speed",
    literacy: "sweeper",
    alias: "Unburden",
    why: "Grassy Seed, then double Speed. Dire Claw. The second Speed example — a clock you consume, not a Scarf.",
    exampleSlug: "sneasler",
  },
  {
    job: "weather",
    literacy: "setter",
    alias: "Drizzle",
    why: "Walks in and the field is wet. Hurricane never misses. The other two cash rain.",
    exampleSlug: "pelipper",
  },
  {
    job: "weather",
    literacy: "sweeper",
    alias: "Drought Mega",
    why: "The field and the wincon. Heat Wave in sun. Solar Beam does not charge. Second weather example is also the Mega.",
    exampleSlug: "charizard-mega-y",
  },
  {
    job: "mega",
    literacy: "sweeper",
    alias: "Aerilate kite",
    why: "One Omni Ring. Hide it until Ice is gone. Double-Edge becomes Flying. The kite.",
    exampleSlug: "salamence-mega",
  },
  {
    job: "mega",
    literacy: "sweeper",
    alias: "Charizardite Y",
    why: "Second Mega example. Sun on entry. You do not splash this stone onto a rain three.",
    exampleSlug: "charizard-mega-y",
  },
];

export const BUILDING_PLAN = [
  {
    title: "Clock",
    goal: "Take Speed or tempo before they dictate",
    play: "Name how this three moves first: 32 Spe on Garchomp, Tailwind on Cott, Fake Out on the cat, Trick Room on Farigiraf, rain on Pelipper. If you cannot say it, you do not have a clock.",
    next: "The clock is a turn. Then you hand the slot. Do not U-turn a 184 Speed Cott into the cleaner.",
  },
  {
    title: "Shield",
    goal: "Live the STAB that hits the other two",
    play: "Kingambit plus Garchomp hate special Fairy. Gholdengo is the patch. Honest Balance uses Corvi for Ice, Fairy, Poison. If two names share a 2× and the third also dies, rebuild.",
    next: "A shield that cannot KO anything loses to a Dance. The patch has to threaten, not just sit.",
  },
  {
    title: "Clean",
    goal: "End it once the wall is gone",
    play: "Kingambit Sucker Punch. Garchomp Earthquake. Dragonite Extreme Speed. One sentence: this Pokémon wins if it gets a free hit after X is gone.",
    next: "If the sentence needs two cleaners, you already asked the three to do too much.",
  },
];

export function lessonsByBand(band: LessonBand) {
  return LESSONS.filter((l) => l.band === band);
}

export function getLesson(slug: string) {
  return LESSONS.find((l) => l.slug === slug);
}

export function lessonHref(slug: string) {
  if (slug === "manuals") return "/manuals" as const;
  if (slug === "meta") return "/meta" as const;
  return `/learn/${slug}` as const;
}

export function nextLesson(slug: string) {
  const lesson = getLesson(slug);
  if (!lesson?.next) return undefined;
  if (lesson.next === "manuals") return { slug: "manuals", title: "Field manuals", href: "/manuals" as const };
  const next = getLesson(lesson.next);
  if (!next) return undefined;
  return { slug: next.slug, title: next.title, href: lessonHref(next.slug) };
}

export const LEARN_HUBS = new Set(["roles"]);
