import type { ArchetypeSlot } from "@/content/archetypes";

export type LessonBand = "format" | "verbs" | "three" | "reads";

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
  | "training";

export type LessonExample = {
  slug: string;
  caption: string;
};

export type LessonBeat = {
  title: string;
  body: string;
  example?: LessonExample;
};

export type Lesson = {
  slug: string;
  band: LessonBand;
  title: string;
  thesis: string;
  skipIf: string;
  body: string[];
  beats: LessonBeat[];
  examples: LessonExample[];
  viz: LessonViz;
  flowId?: string;
  relatedManuals: string[];
  next?: string;
};

export const BANDS: { id: LessonBand; title: string; skipIf: string }[] = [
  {
    id: "format",
    title: "The fight",
    skipIf: "Skip if you already play Champions singles.",
  },
  {
    id: "verbs",
    title: "The verbs",
    skipIf: "Skip if Fake Out, 66 SP, and Speed races already click.",
  },
  {
    id: "three",
    title: "The three",
    skipIf: "Skip if you can name a wincon, a hole, and a style.",
  },
  {
    id: "reads",
    title: "The reads",
    skipIf: "Skip if preview already feels like turn 0. Go to manuals.",
  },
];

export const LESSONS: Lesson[] = [
  {
    slug: "the-fight",
    band: "format",
    title: "This is not the story mode",
    thesis: "3v3, one Pokémon out, 66 Stat Points, one Mega, open lists. Your turn is the whole turn.",
    skipIf: "Skip if you already play Champions ranked singles.",
    body: [
      "They see your three. You see theirs. One Pokémon is in the slot. Fake Out, Protect, and U-turn spend your action — there is no partner to click them for you.",
      "Everyone is Level 50. You have 66 Stat Points, at most 32 in one stat. Mega Evolution happens the same turn you attack. Species clause: no duplicates.",
    ],
    beats: [
      {
        title: "Turn order",
        body: "Switches resolve first. Then Mega. Then moves, fastest to slowest. Priority ignores Speed: Protect is +4, Fake Out is +3, Prankster Tailwind is +1, Sucker Punch is +1 if they attack. Trick Room and Parting Shot go last. If you switch, they still get to hit whoever comes in — unless they also switched.",
        example: { slug: "incineroar", caption: "Fake Out is +3. It flinches before Tailwind. Ghost is immune." },
      },
      {
        title: "One action",
        body: "Attack or switch. Switching is a turn they get to hit you. Ask whether the damage you would deal this turn is worth more than the switch. Beginners stay in and click super-effective. Intermediate players leave when the next hit KOs and they have the answer in the bag.",
        example: { slug: "garchomp", caption: "Earthquake is the attack. Coming in on Ice is the donated KO." },
      },
      {
        title: "Physical, special, STAB",
        body: "Physical hits Defense. Special hits Special Defense. Same-type attack bonus is 1.5× — most kits start with a STAB. A three that only punches Attack loses to one physical wall.",
        example: { slug: "kingambit", caption: "Kowtow Cleave is physical Dark. Make It Rain on Gholdengo is the special Steel." },
      },
      {
        title: "Open lists, one Mega",
        body: "Preview is turn 0. You pick the three that answers their list, then the first send. The Omni Ring is once. If two of yours can Mega, preview is where you pick.",
        example: { slug: "salamence-mega", caption: "Aerilate is the wincon, not a flex. Hide it until Ice is gone." },
      },
    ],
    examples: [
      { slug: "whimsicott", caption: "Clock" },
      { slug: "corviknight", caption: "Shield" },
      { slug: "garchomp", caption: "Clean" },
      { slug: "incineroar", caption: "Fake Out is +3" },
    ],
    viz: "stadium",
    relatedManuals: ["balance-whimsicott-corviknight-garchomp"],
    next: "types",
  },
  {
    slug: "types",
    band: "format",
    title: "Types are switch math",
    thesis: "You are not memorizing a chart. You are asking: can I come in.",
    skipIf: "Skip if you already switch on type, not on panic.",
    body: [
      "Super-effective is 2×. A resist is ½. Immune is 0. Dual typing multiplies. Garchomp is Dragon/Ground: Ice is 4×, Fairy is 2×, Electric is 0.",
      "STAB is 1.5× on your own type. Coverage is the one extra type that hits what walls you. The skill is seeing the STAB that hits two of yours.",
    ],
    beats: [
      {
        title: "Come in on a resist",
        body: "Garchomp into Fairy is a donation. Corviknight into Fairy is a Steel resist. The type chart is a switch list, not trivia.",
        example: { slug: "corviknight", caption: "Steel/Flying. Fairy is ½. Ground is 0. Ice is 1× — not a resist, still better than Garchomp’s 4×." },
      },
      {
        title: "Immune is a free turn",
        body: "Ground into Corviknight does nothing. Ghost Fake Out into Mimikyu does nothing. That is not a resist. That is a turn they spent for free.",
        example: { slug: "mimikyu-disguised", caption: "Ghost/Fairy. Fake Out is Normal. Immune. Then you Dance." },
      },
      {
        title: "Two names, one STAB",
        body: "If Ice hits two of yours super-effectively, they will click Ice. The third slot is the patch or the loss condition. Full check-versus-counter lives in Holes.",
        example: { slug: "garchomp", caption: "Dragon/Ground plus Salamence is an Ice hole. Corviknight or Incineroar is the patch." },
      },
    ],
    examples: [
      { slug: "garchomp", caption: "4× Ice. Immune Electric." },
      { slug: "corviknight", caption: "The Fairy and Ground patch." },
    ],
    viz: "types",
    relatedManuals: ["balance-whimsicott-corviknight-garchomp"],
    next: "abilities",
  },
  {
    slug: "abilities",
    band: "verbs",
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
        title: "The field",
        body: "Drizzle, Drought, Grassy Surge, Unburden. Weather overwrite is a funeral — one field wins. Unburden only doubles Speed after the item is gone.",
        example: { slug: "pelipper", caption: "Drizzle on entry. Hurricane never misses. Archaludon Electro Shots the same turn." },
      },
    ],
    examples: [
      { slug: "incineroar", caption: "Intimidate" },
      { slug: "mimikyu-disguised", caption: "Disguise" },
      { slug: "dragonite", caption: "Multiscale" },
      { slug: "whimsicott", caption: "Prankster" },
      { slug: "excadrill", caption: "Mold Breaker" },
      { slug: "pelipper", caption: "Drizzle" },
    ],
    viz: "ability-field",
    relatedManuals: [
      "balance-whimsicott-incineroar-garchomp",
      "balance-mimikyu-excadrill-dragonite",
      "rain-pelipper-archaludon-basculegion",
    ],
    next: "moves",
  },
  {
    slug: "moves",
    band: "verbs",
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
        body: "Momentum. You leave on your terms. Hard switching is a turn they attack. Parting Shot is −1 Attack and Special Attack, then you leave — they hit the cat, Garchomp is in.",
        example: { slug: "incineroar", caption: "Parting Shot is −6 priority. They hit Incineroar. The cleaner is already in." },
      },
      {
        title: "Dance, rocks, priority",
        body: "Swords Dance, Dragon Dance, Calm Mind need a free turn — Disguise, Intimidate, or a KO. Stealth Rock taxes every switch and pops Multiscale; on a three that is still real. Burn and Life Orb chip the same way. Sucker Punch, Extreme Speed, Aqua Jet win races you already lost.",
        example: { slug: "kingambit", caption: "Sucker Punch is Dark priority. It fails into Protect and into faster priority." },
      },
      {
        title: "Status is tempo",
        body: "Will-O-Wisp halves Attack. Thunder Wave cuts Speed. Taunt shuts Trick Room and Tailwind. Burn and para are not chip for its own sake — they buy the cleaner a turn.",
        example: { slug: "incineroar", caption: "Will-O-Wisp on a physical breaker. Taunt on Cott into a setter." },
      },
    ],
    examples: [
      { slug: "incineroar", caption: "Fake Out, Parting Shot" },
      { slug: "kingambit", caption: "Sucker Punch, Swords Dance" },
    ],
    viz: "flowchart",
    flowId: "they-fake-out",
    relatedManuals: [
      "balance-whimsicott-incineroar-garchomp",
      "balance-whimsicott-corviknight-garchomp",
    ],
    next: "training",
  },
  {
    slug: "training",
    band: "verbs",
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
    relatedManuals: ["balance-whimsicott-corviknight-garchomp", "sun-charizard-y-garchomp-cinderace"],
    next: "speed",
  },
  {
    slug: "speed",
    band: "verbs",
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
      "balance-whimsicott-corviknight-garchomp",
      "balance-excadrill-primarina-dragonite",
    ],
    next: "jobs",
  },
  {
    slug: "jobs",
    band: "three",
    title: "A Pokémon is a job",
    thesis: "Support, breaker, speed, weather, Mega. Two examples each. Sweeper is a translation, not a slot.",
    skipIf: "Skip if you already build from the job, not the name.",
    body: [
      "Stats tell the body. Ability and movepool tell the job. High Speed plus Attack looks like a sweeper — without a Dance, priority, or a Scarf story it is just a fast breaker.",
    ],
    beats: [
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
      "balance-whimsicott-incineroar-garchomp",
      "grassy-rillaboom-sneasler-salamence-mega",
    ],
    next: "building",
  },
  {
    slug: "building",
    band: "three",
    title: "How you build a three",
    thesis: "Win condition, the partner that lets it fire, the patch for the shared hole. Then phys/spec mix and a Speed plan.",
    skipIf: "Skip if you already say the sentence out loud before you pick names.",
    body: [
      "Beginners pick three they like. Intermediate players pick a sentence: this three wins if Kingambit gets a free Sucker Punch. That sentence is the win condition. Everything else makes it true, or keeps you alive when it is not.",
    ],
    beats: [
      {
        title: "Name the win condition",
        body: "The Pokémon or mode that ends the match if the plan works. One sentence. If it needs two wincons, you are already asking the three to do too much.",
        example: { slug: "kingambit", caption: "Free Sucker Punch after Attack is dropped and a wall is gone." },
      },
      {
        title: "The partner that lets it fire",
        body: "Not a second favorite. Intimidate so the breaker lives. A pivot so you leave on your terms. Trick Room so the truck moves first. If that partner does not change a calculation, cut it.",
        example: { slug: "garchomp", caption: "The cleaner once Kingambit cracked the wall. Or Cott’s Tailwind so Garchomp races." },
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
    relatedManuals: ["trick-room-farigiraf-kingambit-gholdengo"],
    next: "archetypes",
  },
  {
    slug: "archetypes",
    band: "three",
    title: "How a three wants to play",
    thesis: "Balance is chess. Hyper Offense is a sprint. Trick Room flips the clock. Rain, sun, Grassy are field engines.",
    skipIf: "Skip if you already pick a style before you pick names.",
    body: [
      "An archetype is the plan, not the species list. Family language on manuals: clock, kite, weather, terrain, room. Load a classroom three. Then open the manual — that is the exam.",
    ],
    beats: [
      {
        title: "Balance — clock",
        body: "Breaker, cleaner, patch. If the lead goes wrong you still have a game. Honest Balance clocks with Cott, soaks with Corvi, cleans with Garchomp.",
        example: { slug: "whimsicott", caption: "Honest Balance. Tailwind, then the hand-off." },
      },
      {
        title: "Hyper Offense — kite",
        body: "Win by turn 4 or the snowball dies. The kite stays in the bag until Ice and Fairy are gone. Scale Sweep hides Dragonite. Disguise Sweep hides it behind Mimikyu’s costume.",
        example: { slug: "dragonite", caption: "Multiscale kite. Extreme Speed after the wall is gone." },
      },
      {
        title: "Trick Room — room",
        body: "Slow on purpose. Four turns including the click. Armor Tail blanks Fake Out. Then the truck cashes.",
        example: { slug: "farigiraf", caption: "The setter. Kingambit and Gholdengo cash the room." },
      },
      {
        title: "Rain, sun, Grassy",
        body: "The field walks in with the setter. Overwrite is the funeral. Terrain cuts Earthquake. Unburden needs the seed gone.",
        example: { slug: "pelipper", caption: "Rain. Y is sun. Rillaboom is the room." },
      },
    ],
    examples: [
      { slug: "whimsicott", caption: "Balance" },
      { slug: "dragonite", caption: "Kite" },
      { slug: "farigiraf", caption: "Room" },
      { slug: "pelipper", caption: "Rain" },
    ],
    viz: "chooser",
    relatedManuals: [
      "balance-whimsicott-corviknight-garchomp",
      "balance-excadrill-primarina-dragonite",
      "trick-room-farigiraf-kingambit-gholdengo",
      "rain-pelipper-archaludon-basculegion",
      "sun-charizard-y-garchomp-cinderace",
      "grassy-rillaboom-sneasler-salamence-mega",
    ],
    next: "holes",
  },
  {
    slug: "holes",
    band: "three",
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
      "balance-whimsicott-corviknight-garchomp",
      "trick-room-farigiraf-kingambit-gholdengo",
    ],
    next: "preview",
  },
  {
    slug: "preview",
    band: "reads",
    title: "Preview is turn 0",
    thesis: "Name their wincon, their Speed plan, their hole. Then pick a send that respects all three.",
    skipIf: "Skip if you already write one sentence before you confirm the lead.",
    body: [
      "Open lists. You are looking at three names. Beginners send their strongest Pokémon. Intermediate players send the Pokémon that answers their likely lead, or that forces the switch the wincon needs.",
    ],
    beats: [
      {
        title: "Six questions",
        body: "What is their wincon. What is their Speed control. Which of yours is compromised. Safe lead or committed. Which of yours must never leave. Say the game in one sentence. If you cannot say it, you do not have a plan.",
        example: { slug: "dragonite", caption: "Scale Sweep’s wincon. Ice is the hole. Excadrill is the likely lead." },
      },
      {
        title: "Do not lead the kite into Ice",
        body: "A good lead takes their lead, makes them switch, or sets the field. A bad lead donates the wincon so you can feel aggressive. Safe lead when unsure. Committed lead when you can name theirs.",
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
      { slug: "excadrill", caption: "Their lead" },
      { slug: "primarina", caption: "Their special" },
      { slug: "dragonite", caption: "Their kite" },
    ],
    viz: "preview-board",
    relatedManuals: [
      "balance-whimsicott-corviknight-garchomp",
      "balance-excadrill-primarina-dragonite",
    ],
    next: "turns",
  },
  {
    slug: "turns",
    band: "reads",
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
        body: "Momentum vs hard switch. Never-leave stays in. Overprediction is the beginner tax — click what beats the Pokémon in front of you unless the read is cheap to be wrong. If you will not KO, they hit back: chip is only correct when the next hit does not end you.",
        example: { slug: "incineroar", caption: "Parting Shot is how you leave without donating Earthquake." },
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
      "balance-whimsicott-corviknight-garchomp",
      "balance-whimsicott-incineroar-garchomp",
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

/** Compatibility during migration from LearnChapter. */
export const LEARN_HUBS = new Set(["roles"]);
