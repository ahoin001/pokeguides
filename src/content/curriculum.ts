import type { ArchetypeSlot } from "@/content/archetypes";
import { MOVE_SHEET_LESSONS } from "@/content/move-sheets";
import { ITEMS_LESSON } from "@/content/items-sheet";

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
  /** Extra species chips for identification lessons (e.g. archetype tells). */
  examples?: LessonExample[];
  /** Compact labeled rows — priority lists, compare strips, etc. */
  rows?: { label: string; detail: string }[];
  /** Short badge on move sheets — "+3", "Burn", "Field". */
  tag?: string;
};

/** Great Ball move-reference pages — verbs first, users second. */
export const MOVE_SHEET_SLUGS = [
  "moves",
  "status-moves",
  "field-moves",
  "boost-moves",
  "pivot-moves",
  "defense-moves",
  "blank-turns",
] as const;

export type MoveSheetSlug = (typeof MOVE_SHEET_SLUGS)[number];

export function isMoveSheet(slug: string): slug is MoveSheetSlug {
  return (MOVE_SHEET_SLUGS as readonly string[]).includes(slug);
}

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
    skipIf: "Skip if priority, status, field, boosts, pivots, defense, blanks, items, and jobs already click.",
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
    next: "archetypes",
  },
  {
    slug: "abilities",
    band: "great-ball",
    title: "Abilities that change the game",
    thesis: "Intimidate is a tax. Disguise is a turn. Cursed Body is a trap. Drizzle is the team.",
    skipIf: "Skip if you already play around Intimidate, Disguise, Cursed Body contact, and weather overwrite.",
    body: [
      "Most abilities are flavor. These are not. Learn what the ability does and why it wins turns — then memorize which ranked faces carry it.",
      "On preview, name the dangerous abilities on their list. The turn an ability reveals, write it down. Flash Fire is not Flame Body. Cursed Body is not Levitate. That line is a free knowledge gap for the rest of the game.",
    ],
    rules: [
      { label: "Switch-in tax", detail: "Intimidate drops Attack on entry. Mirror Armor and Clear Body answer it." },
      { label: "Free turn", detail: "Disguise and Multiscale buy one hit. Spend it on a Dance, not on chip." },
      { label: "Priority verb", detail: "Prankster is +1 on status. Fake Out is still +3. Dark blanks Taunt and Encore." },
      { label: "Contact trap", detail: "Cursed Body, Flame Body, Static, Rough Skin — contact clicks can punish the attacker." },
      { label: "Ignore", detail: "Mold Breaker punches through Multiscale, Disguise, and Levitate." },
      { label: "Field", detail: "Drizzle, Drought, Grassy Surge. One field wins. Overwrite is a funeral." },
      { label: "Unaware", detail: "Ignores their Attack and Defense boosts into you. Not their Speed." },
      { label: "Priority blank", detail: "Armor Tail makes Fake Out and most priority fail." },
    ],
    beats: [
      {
        title: "Intimidate",
        body: "On switch-in, Intimidate lowers the opponent’s Attack one stage. That tax lasts for the rest of the send — every physical hit they throw is weaker. It is useful as free progress on entry: you punish physical wincons without spending a move. Pair it with pivots and Fake Out and you open the game on your terms. Special attackers ignore the drop.",
        takeaway: "If their wincon is physical, Intimidate on the list is a preview sentence. Mirror Armor, Clear Body, or a special answer denies the tax.",
        rows: [
          { label: "Does", detail: "On entry, −1 Attack to the opposing Pokémon." },
          { label: "Useful", detail: "Free physical tax every send. Slows setup sweepers and Choice Band trucks." },
          { label: "Answer", detail: "Mirror Armor bounces it. Clear Body ignores it. Special attackers shrug. Do not hard-switch your physical cleaner in for free." },
        ],
        example: { slug: "incineroar", caption: "Intimidate — the format’s switch-in tax." },
        examples: [
          { slug: "salamence", caption: "Intimidate" },
          { slug: "incineroar", caption: "Intimidate" },
          { slug: "gyarados", caption: "Intimidate" },
          { slug: "mawile", caption: "Intimidate" },
          { slug: "arcanine", caption: "Intimidate" },
          { slug: "staraptor", caption: "Intimidate" },
        ],
      },
      {
        title: "Disguise",
        body: "Disguise blocks the first damaging hit the user takes — the costume breaks, the HP does not. Status, weather chip, and some indirect effects do not always spend it the way a nuke does. It is useful as a free turn: Dance, setup, or a safe pivot behind the costume. After it breaks, the Pokémon is ordinary.",
        takeaway: "The free hit is the plan. Do not farm the costume with chip and then eat a boosted STAB.",
        rows: [
          { label: "Does", detail: "Negates the first damaging hit; then the costume is gone." },
          { label: "Useful", detail: "Buys a Swords Dance, a safe hit, or a pivot on the free turn." },
          { label: "Answer", detail: "Mold Breaker ignores it. Status and hazards pressure. Knock it once, then punish the setup." },
        ],
        example: { slug: "mimikyu-disguised", caption: "Disguise — one free hit." },
        examples: [{ slug: "mimikyu-disguised", caption: "Disguise" }],
      },
      {
        title: "Multiscale",
        body: "From full HP, Multiscale halves the damage of the first hit the user takes. Any prior chip — Stealth Rock, Life Orb recoil on the foe’s side does not matter; rocks on your switch do — removes it before the fight. It is useful as a live into revenge or a free Dragon Dance window. Once HP is no longer full, Multiscale is offline.",
        takeaway: "Chip Multiscale before the nuke. Rocks on the switch are enough.",
        rows: [
          { label: "Does", detail: "Halves damage from the first hit while at full HP." },
          { label: "Useful", detail: "Lives a revenge hit or buys a Dance from full." },
          { label: "Answer", detail: "Stealth Rock or any chip before the big hit. Mold Breaker ignores it. Fake Out then follow up." },
        ],
        example: { slug: "dragonite", caption: "Multiscale — half damage from full." },
        examples: [{ slug: "dragonite", caption: "Multiscale" }],
      },
      {
        title: "Prankster",
        body: "Prankster gives +1 priority to status moves — Tailwind, Thunder Wave, Taunt, Encore, Will-O-Wisp. It does not speed up damaging moves. Fake Out is still +3, so flinch still beats Prankster Tailwind. Dark types are immune to Prankster status aimed at them; Tailwind still goes up because it targets your side, not the Dark Pokémon.",
        takeaway: "Prankster is +1 on support verbs. Fake Out still wins the lead race. Dark blanks Taunt and Encore.",
        rows: [
          { label: "Does", detail: "+1 priority on status moves only." },
          { label: "Useful", detail: "Sets Tailwind, Taunt, Encore, or Wave before most attacks resolve." },
          { label: "Answer", detail: "Fake Out the setter. Dark blanks Prankster status. Taunt first if you outspeed the +1." },
        ],
        example: { slug: "whimsicott", caption: "Prankster — +1 on the support click." },
        examples: [
          { slug: "whimsicott", caption: "Prankster" },
          { slug: "grimmsnarl", caption: "Prankster" },
          { slug: "sableye", caption: "Prankster" },
          { slug: "klefki", caption: "Prankster" },
        ],
      },
      {
        title: "Cursed Body",
        body: "When a move makes contact with a Cursed Body Pokémon, there is a chance the attacker’s last used move becomes Disabled for several turns. Contact cleaners and Fake Out users can lock themselves out of their only KO button. It is not Flash Fire — the hit still lands; the trap is the disable that follows. Ghosts like Gengar, Banette, and Froslass carry it as a hidden wall against physical pressure.",
        takeaway: "Contact into Cursed Body can erase the move you needed next turn. Prefer non-contact coverage or Protect when you must stay.",
        rows: [
          { label: "Does", detail: "On contact, chance to Disable the move that just hit." },
          { label: "Useful", detail: "Punishes Fake Out, Extreme Speed, and contact STAB loops." },
          { label: "Answer", detail: "Use non-contact moves (specials, status, U-turn lines that do not rely on that STAB). Protect, switch, or Knock them before the loop matters." },
        ],
        example: { slug: "gengar", caption: "Cursed Body — contact can Disable your STAB." },
        examples: [
          { slug: "gengar", caption: "Cursed Body" },
          { slug: "banette", caption: "Cursed Body" },
          { slug: "froslass", caption: "Cursed Body" },
        ],
      },
      {
        title: "Flame Body · Static · Poison Point",
        body: "Contact can inflict a status on the attacker: Flame Body burns, Static paralyzes, Poison Point poisons. Effect Spore can sleep, poison, or paralyze on contact. The damage still lands — the tax is the status that ruins physical wincons and Choice locks. Read the ability on reveal: Talonflame Flame Body is not Chandelure Flash Fire.",
        takeaway: "Contact into Flame Body / Static is how cleaners donate burn or para. Prefer specials or non-contact when the ability is known.",
        rows: [
          { label: "Does", detail: "Contact may burn, para, poison, or (Effect Spore) sleep the attacker." },
          { label: "Useful", detail: "Soft-walls physical pressure without spending a Will-O-Wisp turn." },
          { label: "Answer", detail: "Non-contact damage. Status from range. Protect. Do not Autopilot Fake Out into Flame Body." },
        ],
        example: { slug: "talonflame", caption: "Flame Body — contact burn tax." },
        examples: [
          { slug: "talonflame", caption: "Flame Body" },
          { slug: "raichu", caption: "Static" },
          { slug: "roserade", caption: "Poison Point" },
        ],
      },
      {
        title: "Rough Skin",
        body: "Contact into Rough Skin chips the attacker’s HP. It does not blank the hit — it taxes every physical click that touches. Garchomp and Sharpedo lines make contact loops expensive over a short game. Iron Barbs works the same way when present. Pair with Rocky Helmet on some sets and contact becomes a losing trade.",
        takeaway: "Contact chip adds up. Into Rough Skin, prefer specials or non-contact coverage when the race is close.",
        rows: [
          { label: "Does", detail: "Contact deals residual damage to the attacker." },
          { label: "Useful", detail: "Punishes Extreme Speed, Fake Out, and multi-hit contact spam." },
          { label: "Answer", detail: "Special attacks. Non-contact moves. Status. Knock Off the Helmet if it is paired." },
        ],
        example: { slug: "garchomp", caption: "Rough Skin — contact pays chip." },
        examples: [
          { slug: "garchomp", caption: "Rough Skin" },
          { slug: "sharpedo", caption: "Rough Skin" },
        ],
      },
      {
        title: "Armor Tail",
        body: "Armor Tail makes most priority moves aimed at the user fail — Fake Out, Extreme Speed, Aqua Jet, Sucker Punch, and similar +1 or higher attacks do not land. It is useful as the reason Farigiraf can set Trick Room without eating lead Fake Out. It does not stop non-priority attacks or status. Mold Breaker and some effects still pierce ability-based denial — treat Armor Tail as priority insurance, not full immunity.",
        takeaway: "Fake Out into Armor Tail is a blank turn. If Farigiraf is on the list, plan the lead without relying on flinch.",
        rows: [
          { label: "Does", detail: "Priority moves targeting the user fail." },
          { label: "Useful", detail: "Protects Trick Room / support clicks from Fake Out and revenge priority." },
          { label: "Answer", detail: "Attack at normal priority. Taunt. Status. KO before the room goes up." },
        ],
        example: { slug: "farigiraf", caption: "Armor Tail — Fake Out fails." },
        examples: [{ slug: "farigiraf", caption: "Armor Tail" }],
      },
      {
        title: "Mold Breaker",
        body: "Mold Breaker makes your moves ignore the target’s ability when resolving the hit. Multiscale, Disguise, Levitate, Flash Fire, and similar soft walls do not apply. It is useful as the answer to free-turn abilities and Ground immunities that would otherwise stall your STAB. The ability does not boost power by itself — it removes their safety net.",
        takeaway: "If Disguise or Multiscale is their free turn, ask whether Mold Breaker is on their list.",
        rows: [
          { label: "Does", detail: "Your moves ignore the foe’s ability for that hit." },
          { label: "Useful", detail: "Breaks Multiscale, Disguise, Levitate, Flash Fire soft walls." },
          { label: "Answer", detail: "Do not hide behind those abilities. Resist the type, Protect, or KO the Mold Breaker first." },
        ],
        example: { slug: "excadrill", caption: "Mold Breaker — soft walls do not apply." },
        examples: [
          { slug: "excadrill", caption: "Mold Breaker" },
          { slug: "tinkaton", caption: "Mold Breaker" },
        ],
      },
      {
        title: "Unaware",
        body: "Unaware ignores the opponent’s Attack and Defense stage boosts when calculating damage involving you — their Swords Dance does not make their hit harder into you, and their Defense boosts do not soften your attacks the same way. It does not ignore Speed, Special Defense, or the type chart. It is useful as a hard stop to physical and Defense-stacking setup.",
        takeaway: "Setup is not a wincon into Unaware. Speed races, status, and SpD still are.",
        rows: [
          { label: "Does", detail: "Ignores foe Atk/Def boosts in damage involving the Unaware user." },
          { label: "Useful", detail: "Shuts Dance and Defense stacks that would otherwise snowball." },
          { label: "Answer", detail: "Outspeed and status. Special attacks into SpD. Phaze. Do not keep stacking Attack into it." },
        ],
        example: { slug: "skeledirge", caption: "Unaware — their Attack boosts do not count." },
        examples: [
          { slug: "skeledirge", caption: "Unaware" },
          { slug: "clefable", caption: "Unaware" },
          { slug: "dondozo", caption: "Unaware" },
          { slug: "clodsire", caption: "Unaware" },
        ],
      },
      {
        title: "Drizzle",
        body: "Drizzle sets rain on entry. Water moves strengthen, Fire weakens, Thunder and Hurricane become accurate, and Swift Swim doubles Speed while rain lasts. It is useful because the ability is the team — every partner cashes the field. Overwrite from Drought or sand ends the package.",
        takeaway: "No Drizzle setter on the list usually means no rain. Plan the lead as if the bird is coming.",
        rows: [
          { label: "Does", detail: "Sets rain when the user enters." },
          { label: "Useful", detail: "Enables Swift Swim, Electro Shot, accurate Hurricane, Water offense." },
          { label: "Answer", detail: "Sun or sand overwrite. KO the setter. Resist Water. Play Speed as if rain ends." },
        ],
        example: { slug: "pelipper", caption: "Drizzle — rain on entry." },
        examples: [
          { slug: "pelipper", caption: "Drizzle" },
          { slug: "politoed", caption: "Drizzle" },
        ],
      },
      {
        title: "Drought",
        body: "Drought sets harsh sunlight on entry. Fire strengthens, Water weakens, Chlorophyll doubles Speed, and Growth jumps. Mega stones that grant Drought make the item and the field the same wincon. It is useful as an instant offense mode for sun teams.",
        takeaway: "Drought on the list = play sun until the setter or Mega is gone.",
        rows: [
          { label: "Does", detail: "Sets sun when the user enters." },
          { label: "Useful", detail: "Fire nukes, Chlorophyll racers, Growth stacks." },
          { label: "Answer", detail: "Rock and Water resists. Rain overwrite. KO the Drought setter." },
        ],
        example: { slug: "charizard-mega-y", caption: "Drought — sun on entry." },
        examples: [
          { slug: "charizard-mega-y", caption: "Drought" },
          { slug: "torkoal", caption: "Drought" },
          { slug: "ninetales", caption: "Drought" },
        ],
      },
      {
        title: "Grassy Surge",
        body: "Grassy Surge sets Grassy Terrain on entry. Grounded Pokémon heal each turn, Earthquake softens, and Grassy Glide becomes +1 priority. It is useful as both residual recovery and a priority engine for Grass attackers. Without the terrain, Glide is just a slow Grass move.",
        takeaway: "No Grassy Surge, no Grassy room. Remove or overwrite terrain before you race Glide.",
        rows: [
          { label: "Does", detail: "Sets Grassy Terrain on entry." },
          { label: "Useful", detail: "Heals grounded allies. Enables priority Grassy Glide. Softens Earthquake." },
          { label: "Answer", detail: "Overwrite terrain. Flying / Levitate ignore grounded rules. Resist Grass. Fake Out or KO the setter." },
        ],
        example: { slug: "rillaboom", caption: "Grassy Surge — terrain on entry." },
        examples: [{ slug: "rillaboom", caption: "Grassy Surge" }],
      },
      {
        title: "Flash Fire",
        body: "Flash Fire grants immunity to Fire moves and powers up the user’s Fire attacks after absorbing one. It is useful as a hard switch into Torch Song, Flare Blitz, and other Fire STABs — the predicted Fire click becomes their wasted turn and your boost. Other abilities on the same species (Weak Armor, Flame Body) play completely differently, so the reveal matters.",
        takeaway: "Do not click Fire into Flash Fire. Note the ability the turn it reveals — the species alone is not enough.",
        rows: [
          { label: "Does", detail: "Immune to Fire; Fire moves power up after absorbing a hit." },
          { label: "Useful", detail: "Punishes Fire STAB and setup Fire moves on the switch." },
          { label: "Answer", detail: "Hit with anything but Fire. Mold Breaker ignores it. Status and coverage." },
        ],
        example: { slug: "ceruledge", caption: "Flash Fire — Fire clicks fail." },
        examples: [
          { slug: "ceruledge", caption: "Flash Fire" },
          { slug: "chandelure", caption: "Flash Fire" },
        ],
      },
    ],
    examples: [
      { slug: "incineroar", caption: "Intimidate" },
      { slug: "mimikyu-disguised", caption: "Disguise" },
      { slug: "dragonite", caption: "Multiscale" },
      { slug: "whimsicott", caption: "Prankster" },
      { slug: "gengar", caption: "Cursed Body" },
      { slug: "talonflame", caption: "Flame Body" },
      { slug: "farigiraf", caption: "Armor Tail" },
      { slug: "excadrill", caption: "Mold Breaker" },
      { slug: "skeledirge", caption: "Unaware" },
      { slug: "pelipper", caption: "Drizzle" },
      { slug: "rillaboom", caption: "Grassy Surge" },
      { slug: "ceruledge", caption: "Flash Fire" },
    ],
    viz: "ability-field",
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
    next: "moves",
  },
  ...MOVE_SHEET_LESSONS,
  ITEMS_LESSON,
  {
    slug: "speed",
    band: "great-ball",
    title: "You race their whole list",
    thesis: "Not the Pokémon in front of you. The three they brought. 32 Spe, Scarf, Mega, Trick Room, weather, priority.",
    skipIf: "Skip if you already pack a plan for the race you lose.",
    body: [
      "Whoever moves first often decides the KO. On a three there is no partner Tailwind. If their fastest outruns your fastest and can OHKO it, that race is the match unless you packed priority, a clock, or a field.",
      "Spend 66 Stat Points with a max of 32 in one stat. 32 Spe is a statement. Choice Scarf is another. If a clock or weather already solves Speed, move those points into bulk.",
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
    next: "jobs",
  },
  {
    slug: "jobs",
    band: "great-ball",
    title: "A Pokémon is a job",
    thesis: "Support, breaker, Speed, weather, Mega. Build the jobs first — names come second.",
    skipIf: "Skip if you already build from the job, not the name, and can say how yours wins.",
    body: [
      "Stats tell the body. Ability and movepool tell the job. High Speed plus Attack looks like a sweeper — without a Dance, priority, or a Scarf story it is just a fast breaker.",
      "On a three you only get three slots. Each job answers a different failure mode: no turns bought, no KOs, no Speed plan, no field, no closer. Learn the job, why teambuilding needs it, then who fills it in ranked.",
    ],
    rules: [
      { label: "Support", detail: "Buys turns. Does not win by KOing." },
      { label: "Breaker", detail: "Takes KOs. Cracks walls and forces progress." },
      { label: "Speed", detail: "Wins races — Scarf, priority, Unburden, or Room." },
      { label: "Weather", detail: "Sets the field. The other two must cash it." },
      { label: "Mega", detail: "Once-per-battle closer. The stone is the wincon slot." },
      { label: "Digest", detail: "Name the jobs on your three before you queue." },
    ],
    beats: [
      {
        title: "Support",
        body: "Support buys turns so the rest of the three can win. Intimidate, Fake Out, burn, para, Taunt, Tailwind, U-turn, Parting Shot, screens — the verbs that change what the next turn is allowed to be. Support does not exist to rack up KOs. On a three, missing support means your breaker eats every hit raw and your Speed plan never gets a free click.",
        takeaway: "If the slot only damages and never buys a turn, it is not support — it is a second breaker wearing a bulky name.",
        rows: [
          {
            label: "Does",
            detail: "Buys turns: tax Attack, flinch, status, pivot, clock, or screens.",
          },
          {
            label: "Why it matters",
            detail: "Creates the free hit your breaker needs. Without it, every send is a pure damage race you often lose.",
          },
          {
            label: "Build",
            detail: "Pair with a breaker that cashes the turn. Do not stack three supports with nobody to KO.",
          },
        ],
        example: { slug: "incineroar", caption: "Support — tax, flinch, leave." },
        examples: [
          { slug: "incineroar", caption: "Fake Out / Intimidate" },
          { slug: "whimsicott", caption: "Tailwind / Taunt" },
          { slug: "grimmsnarl", caption: "Screens / Taunt" },
          { slug: "rotom-wash", caption: "Wisp / Volt Switch" },
          { slug: "corviknight", caption: "Pivot shield" },
          { slug: "farigiraf", caption: "Trick Room support" },
        ],
      },
      {
        title: "Breaker",
        body: "A breaker exists to take KOs and force progress. Wallbreakers crack fat pivots; cleaners finish whatever is left. You do not ask a breaker to absorb two super-effective hits — you ask it to punch, leave, and punch again. Without a breaker, support only delays the loss: you burn and pivot forever while their wall sits.",
        takeaway: "Every three needs something that ends Pokémon. Support without a breaker is stall with a timer.",
        rows: [
          {
            label: "Does",
            detail: "Deletes threats. Forces switches. Turns a free turn into a KO.",
          },
          {
            label: "Why it matters",
            detail: "Progress. On a three you cannot out-stall forever — someone has to crack the wall.",
          },
          {
            label: "Build",
            detail: "Give it a Speed plan or priority. Patch the types that wall it. Do not ask it to also be the shield.",
          },
        ],
        example: { slug: "kingambit", caption: "Breaker — the truck that KOs." },
        examples: [
          { slug: "kingambit", caption: "Dark truck" },
          { slug: "garchomp", caption: "Ground cleaner" },
          { slug: "excadrill", caption: "Mold Breaker punch" },
          { slug: "dragonite", caption: "Multiscale / Extreme Speed" },
          { slug: "gholdengo", caption: "Special Steel" },
          { slug: "meowscarada", caption: "Fast physical break" },
        ],
      },
      {
        title: "Speed",
        body: "The Speed job answers who moves first. That can be honest 32 Spe, Choice Scarf, priority (Sucker Punch, Extreme Speed, Fake Out), weather Speed (Swift Swim, Chlorophyll), Unburden, Tailwind, or Trick Room. Without a Speed plan you guess every race — and Champions singles punishes guessing. Teambuilding that ignores Speed builds a three that loses to one Scarf cleaner.",
        takeaway: "Name how you win races you already lose on the number. If you have no answer, rebuild before you queue.",
        rows: [
          {
            label: "Does",
            detail: "Wins or flips the Speed line: race, revenge, clock, or priority.",
          },
          {
            label: "Why it matters",
            detail: "Whoever moves first often decides the KO. No Speed job means every turn is a coin.",
          },
          {
            label: "Build",
            detail: "Spend Speed on the Pokémon that must move first for the wincon. Pack priority or a clock for the rest.",
          },
        ],
        example: { slug: "cinderace", caption: "Speed — the race is the job." },
        examples: [
          { slug: "cinderace", caption: "Honest / Scarf race" },
          { slug: "sneasler", caption: "Unburden" },
          { slug: "whimsicott", caption: "Tailwind clock" },
          { slug: "farigiraf", caption: "Trick Room" },
          { slug: "basculegion-male", caption: "Swift Swim" },
          { slug: "kingambit", caption: "Sucker Punch revenge" },
        ],
      },
      {
        title: "Weather",
        body: "Weather (and terrain) setters rewrite the board on entry. Drizzle, Drought, Sand Stream, Snow Warning, Grassy Surge — the field is the team. Partners cash Swift Swim, Chlorophyll, Hurricane accuracy, Electro Shot, Grassy Glide. You do not splash a setter onto a three that cannot use the field. Teambuilding around weather means the other two slots exist to win while that field is up — and to survive overwrite.",
        takeaway: "If the setter is on the list, the other two must cash the field. Ornamental weather is a wasted slot.",
        rows: [
          {
            label: "Does",
            detail: "Sets rain, sun, sand, snow, or terrain when it enters.",
          },
          {
            label: "Why it matters",
            detail: "Changes damage, Speed, and accuracy for the whole match until overwritten.",
          },
          {
            label: "Build",
            detail: "At least one partner that gets stronger in that field. An answer to the opposing weather.",
          },
        ],
        example: { slug: "pelipper", caption: "Weather — the field is the team." },
        examples: [
          { slug: "pelipper", caption: "Drizzle" },
          { slug: "charizard-mega-y", caption: "Drought Mega" },
          { slug: "torkoal", caption: "Drought" },
          { slug: "rillaboom", caption: "Grassy Surge" },
          { slug: "politoed", caption: "Drizzle" },
        ],
      },
      {
        title: "Mega",
        body: "Mega Evolution is a once-per-battle transform via the Omni Ring. The Mega stone fills the item slot — that Pokémon is usually the closer: Aerilate snowball, Drought nuke, raw Mega Attack. Teambuilding treats Mega as the win condition, not a flex. If two on the three can Mega, preview picks which stone fires. If the Mega is not how you win, you spent the Omni Ring on vanity.",
        takeaway: "The stone is the wincon slot. Build the other two to get that Mega a free turn — or to win without it when the Mega is the wrong send.",
        rows: [
          {
            label: "Does",
            detail: "Once per match: transform and attack the same turn. Stats and ability jump.",
          },
          {
            label: "Why it matters",
            detail: "Highest ceiling on many threes. Wrong Mega send often loses the game immediately.",
          },
          {
            label: "Build",
            detail: "Partners that remove the Mega’s checks. A backup plan if Mega is walled or revenge-KOd.",
          },
        ],
        example: { slug: "salamence-mega", caption: "Mega — the Omni Ring closer." },
        examples: [
          { slug: "salamence-mega", caption: "Aerilate kite" },
          { slug: "charizard-mega-y", caption: "Drought nuke" },
          { slug: "garchomp", caption: "Mega Chomp lines" },
          { slug: "lucario", caption: "Mega Lucario" },
          { slug: "mawile", caption: "Mega Mawile" },
        ],
      },
      {
        title: "Digest the three",
        body: "Before you queue, name the jobs out loud: who buys turns, who takes KOs, how you win Speed races, whether a field or Mega is the closer. A three that is “three attackers I like” has no jobs — only hope. Cut any slot that does not change one of those sentences.",
        takeaway: "If you cannot say the jobs in four sentences, you do not understand the three yet.",
        rows: [
          {
            label: "Ask",
            detail: "Support verb? Breaker? Speed plan? Field or Mega closer?",
          },
          {
            label: "Fail",
            detail: "Three names with no jobs = you will invent a plan mid-match and lose.",
          },
          {
            label: "Pass",
            detail: "Each slot has a job sentence. Then open manuals and play.",
          },
        ],
        example: { slug: "whimsicott", caption: "Clock support. The cleaner inherits the job." },
        examples: [
          { slug: "whimsicott", caption: "Support / Speed" },
          { slug: "corviknight", caption: "Support shield" },
          { slug: "garchomp", caption: "Breaker" },
        ],
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
    next: "holes",
  },
  {
    slug: "archetypes",
    band: "poke-ball",
    title: "What are they trying to do?",
    thesis:
      "Name their plan on preview before you name a lead. Balance pivots. Hyper Offense sprints. Trick Room flips. Weather and terrain cash a field. Tailwind is a clock you can read — not its own three.",
    skipIf: "Skip if you already identify their style in one look, including hybrids, and can name two tells per style.",
    body: [
      "An archetype is the game plan, not the species list. Regulation M-C Singles is six registered, three brought after a 90-second preview. Ask what their three is trying to accomplish. If you cannot name it, you are already behind.",
      "The September 2026 ladder is thick with Balance cores — Salamence, Garchomp, Primarina, Golisopod, Hippowdon, Gholdengo — plus Mega stones as once-per-battle resources. Field styles (rain, sun, Grassy) and Trick Room still show; they are rarer but louder on preview because a setter must appear.",
      "Squads hybridize. Rain that still Volt Switches is still rain. Trick Room with a Tailwind backup is Tail Room — they win if either clock lands. Read the mode they can force, then the backup.",
      "Ultra Ball later turns the name into a bring plan. This chapter is identification and self-fit: what they want, what you want to play.",
    ],
    beats: [
      {
        title: "Balance — they want to pivot",
        body: "M-C’s default ladder shape. A breaker, a cleaner, and a patch that covers the hole those two share. If the lead goes wrong they still have a game. Top usage clusters around Salamence (often Mega), Garchomp, Primarina, Golisopod, Hippowdon, Gholdengo, Aegislash, Corviknight, Rotom-Wash, and Meowscarada. Honest Balance clocks with Whimsicott. Fire-Water-Grass cores are the same idea: complementary types so they can switch. Classroom manuals — Clockwork, Pressure Balance, Pressure Clock, Overlord — are all Balance families with different clocks.",
        takeaway: "Two attackers plus a living switch = Balance. No fat pivot and everyone damages = look at Hyper Offense.",
        example: { slug: "salamence", caption: "#1 M-C. Mega or kite — still usually Balance when Primarina / Hippo sit beside it." },
        examples: [
          { slug: "garchomp", caption: "Cleaner / Mega Z" },
          { slug: "primarina", caption: "Special patch" },
          { slug: "golisopod", caption: "Emergency Exit pivot" },
          { slug: "hippowdon", caption: "Sand wall" },
          { slug: "gholdengo", caption: "Ghost/Steel patch" },
          { slug: "aegislash-shield", caption: "Stance pivot" },
          { slug: "corviknight", caption: "Ice soak" },
          { slug: "rotom-wash", caption: "Burn + Volt Switch" },
          { slug: "meowscarada", caption: "Scarf / Protean" },
          { slug: "whimsicott", caption: "Tailwind clock" },
          { slug: "lucario", caption: "Mega / plot" },
          { slug: "kingambit", caption: "Dark truck" },
        ],
      },
      {
        title: "Hyper Offense — they want KOs now",
        body: "Win by turn 4 or the snowball dies. Recovery is rare. The three is Speed plus glass: Cinderace, Choice / Focus Sash leads, Multiscale Dragonite, Disguise Mimikyu, Mold Breaker Excadrill, or a Mega that attacks the same turn it transforms. On M-C, glass often still borrows Balance names — Mimikyu #10, Dragonite #30, Cinderace #21, Excadrill #67 — so read the whole six. If there is no Corvi / Hippo / Primarina net and three frail attackers, call HO.",
        takeaway: "No net + everyone damages = Hyper Offense. One fat name does not make it Balance.",
        example: { slug: "dragonite", caption: "Scale Sweep. Extreme Speed after the wall is gone." },
        examples: [
          { slug: "cinderace", caption: "Libero / Scarf punch" },
          { slug: "mimikyu-disguised", caption: "Disguise Sweep" },
          { slug: "excadrill", caption: "Mold Breaker lead" },
          { slug: "salamence-mega", caption: "Aerilate snowball" },
          { slug: "greninja", caption: "Sash / Protean" },
          { slug: "gyarados", caption: "Intimidate / Dance" },
          { slug: "baxcalibur", caption: "Ice breaker" },
          { slug: "glimmora", caption: "Sash hazards" },
        ],
      },
      {
        title: "Tailwind is a clock you can read",
        body: "Whimsicott on preview (and similar Prankster Tailwind names when legal) means they want to double Speed and cash slower wincons without a Scarf. It is a hybrid sitting on Balance or Hyper Offense — not a separate three you pick in Team. Four turns including the click. After that they are slow again. M-C sees Whimsicott around the mid-ladder next to Garchomp and Salamence — treat it as a readable clock on a Balance six until the rest of the list is pure glass.",
        takeaway: "Name the clock, then name the style underneath it.",
        example: { slug: "whimsicott", caption: "Prankster Tailwind. Then they leave." },
        examples: [
          { slug: "garchomp", caption: "Often inherits the clock" },
          { slug: "salamence", caption: "Common Cott partner" },
          { slug: "charizard", caption: "Y or Dance under Tailwind" },
          { slug: "lucario", caption: "Plot under the clock" },
        ],
      },
      {
        title: "Trick Room — they flip the race",
        body: "Slow on purpose. Four turns including the click. Farigiraf is the must-appear setter — Armor Tail blanks Fake Out — then trucks cash. Kingambit, Gholdengo, Annihilape, Banette, and bulky specials are common cashers. Tail Room is the hybrid: Farigiraf plus a Tailwind name so they still race if the room gets Taunted. Farigiraf is uncommon on the raw usage board (#210) but unmistakable when it shows. Plan the lead as if the setter is coming even if they bluff something else first.",
        takeaway: "No Farigiraf, no room. Slow trucks without a setter are usually just bulky Balance.",
        example: { slug: "farigiraf", caption: "The setter. Plan as if it must appear." },
        examples: [
          { slug: "kingambit", caption: "Room truck" },
          { slug: "gholdengo", caption: "Special Steel under TR" },
          { slug: "annihilape", caption: "Rage Fist truck" },
          { slug: "banette", caption: "Prankster / TR support" },
          { slug: "whimsicott", caption: "Tail Room backup" },
          { slug: "basculegion-male", caption: "Sometimes cashes TR" },
        ],
      },
      {
        title: "Rain — Drizzle is the team",
        body: "Pelipper walks in and the field is yours. Swift Swim and Electro Shot partners cash it. On M-C, Pelipper (~#52) clusters with Archaludon, Swampert, Golisopod, Basculegion, and Garchomp. Rain that still pivots is a hybrid — the field is still the tell. Overwrite is the funeral: Drought on the other side ends Drizzle. Electric answers (Raichu, Kilowattrel, Scarf Archaludon) are why rain packs a Steel.",
        takeaway: "No Pelipper, no rain. Plan the lead as if the bird is coming.",
        example: { slug: "pelipper", caption: "Must-appear Drizzle." },
        examples: [
          { slug: "basculegion-male", caption: "Swift Swim / Last Respects" },
          { slug: "archaludon", caption: "Electro Shot / Steel" },
          { slug: "swampert", caption: "Rain Ground/Water" },
          { slug: "golisopod", caption: "Rain pivot / Mega" },
          { slug: "garchomp", caption: "Ground coverage in rain" },
        ],
      },
      {
        title: "Sun — Drought Mega",
        body: "In this regulation sun is usually Charizard holding Charizardite Y — setter and wincon in one slot (#18 Charizard). Solar Beam does not charge; Fire hits through rain’s worst dreams until Pelipper overwrites. Partners look like Garchomp, Primarina, Mimikyu, Hippowdon, or a second Fire. You do not splash Y onto a rain three. Rock and Water on their three are the funeral.",
        takeaway: "Charizardite Y on the list = plan for Drought until the Mega is gone.",
        example: { slug: "charizard", caption: "Y stone. Field and wincon." },
        examples: [
          { slug: "charizard-mega-y", caption: "Drought form" },
          { slug: "garchomp", caption: "Ground twin" },
          { slug: "cinderace", caption: "Second Fire" },
          { slug: "mimikyu-disguised", caption: "Common Y partner" },
          { slug: "hippowdon", caption: "Sand / Rock answer seat" },
        ],
      },
      {
        title: "Grassy — terrain is the room",
        body: "Rillaboom walks in (#12), Grassy Terrain goes up, Grassy Glide goes first. Unburden Sneasler (#22) with Indeedee (#24) is the clearest modern cash — Psychic Seed / Expanding Force partners show on the same sixes. Kingambit likes weaker Earthquakes under terrain. Fire deletes the engine. Pack Fire when you see Boom.",
        takeaway: "No Rillaboom, no Grassy room. Unburden without Boom is usually a bluff.",
        example: { slug: "rillaboom", caption: "Must-appear Grassy Surge." },
        examples: [
          { slug: "sneasler", caption: "Unburden cleaner" },
          { slug: "indeedee-female", caption: "Terrain partner" },
          { slug: "kingambit", caption: "Dark truck under terrain" },
          { slug: "armarouge", caption: "Expanding Force seat" },
          { slug: "blastoise", caption: "Seen with Sneasler cores" },
        ],
      },
    ],
    examples: [
      { slug: "salamence", caption: "Balance Mega" },
      { slug: "dragonite", caption: "HO kite" },
      { slug: "farigiraf", caption: "Room" },
      { slug: "pelipper", caption: "Rain" },
      { slug: "charizard", caption: "Sun" },
      { slug: "rillaboom", caption: "Grassy" },
    ],
    viz: "chooser",
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
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
    relatedManuals: ["ultra-garchompz-salamence-gholdengo"],
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
