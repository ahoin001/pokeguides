import type { ArchetypeId, LiteracyRoleId, RoleId } from "@/types/pokemon";

export type MoveNote = {
  name: string;
  why: string;
};

export type SlotManual = {
  slug: string;
  title: string;
  job: RoleId;
  literacy?: LiteracyRoleId;
  role: string;
  ability?: string;
  item?: string;
  moves: MoveNote[];
  objective: string;
  howToPlay: string;
};

export type ManualBranch = {
  when: string;
  then: string;
  why?: string;
};

export type ManualPhase = {
  id: string;
  title: string;
  lede?: string;
  branches: ManualBranch[];
};

export type ManualSwitch = {
  into: string;
  send: string;
};

export type TeamManual = {
  id: string;
  title: string;
  lede: string;
  philosophy: string;
  archetype: ArchetypeId;
  slugs: [string, string, string];
  meta: string;
  press?: string[];
  refuse?: string[];
  switches?: ManualSwitch[];
  slots: SlotManual[];
  phases: ManualPhase[];
  loops: { title: string; body: string }[];
  hazards: { title: string; body: string }[];
};

export function playLines(howToPlay: string) {
  return howToPlay
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

export const MANUAL_PHASE_IDS = ["preview", "lead", "mid", "late"] as const;

export const CANONICAL_MANUALS: TeamManual[] = [
  {
    id: "balance-whimsicott-corviknight-garchomp",
    title: "Honest Balance: Whimsicott, Corviknight, Garchomp",
    lede: "Prankster clock, Steel U-turn, Garchomp cleans. One send. Fast U-turn is not a free switch.",
    philosophy:
      "No Intimidate, no Fake Out. Whimsicott owns Speed. Corviknight eats the hit Garchomp cannot, then leaves only when the incoming name wants that click. Garchomp stays in the back until the slot is safe.",
    archetype: "balance",
    slugs: ["whimsicott", "corviknight", "garchomp"],
    meta: "Physical and Fighting cores. You have no Fire STAB — Brave Bird is the Grass answer.",
    press: ["Physical leads", "Fighting cores", "Fairy into Corvi", "Dragons that lose Tailwind"],
    refuse: ["Special Ice on Corvi", "Fire into Cott or Corvi", "Fast U-turn into Ice", "Encore on Dark"],
    switches: [
      { into: "Ice", send: "Corviknight — neutral, not a resist" },
      { into: "Fairy", send: "Corviknight" },
      { into: "Fire / Electric", send: "Garchomp" },
      { into: "Water", send: "Whimsicott" },
      { into: "Poison", send: "Corviknight (Steel immune)" },
      { into: "Ground", send: "Corviknight (Flying immune)" },
    ],
    slots: [
      {
        slug: "whimsicott",
        title: "The Time-Bender",
        job: "speed",
        literacy: "setter",
        role: "Priority clock. Tailwind or Encore, then leave.",
        ability: "Prankster",
        item: "Focus Sash or Covert Cloak",
        moves: [
          { name: "Tailwind", why: "Hits your side — still works vs Dark. The click counts as turn one of four." },
          { name: "Encore", why: "Locks Protect or setup. Fails on Dark." },
          { name: "Moonblast", why: "STAB into Fighting and Dragon. The click when Encore is illegal." },
          { name: "Taunt or Substitute", why: "Taunt shuts Trick Room, fails on Dark. Sub still works." },
        ],
        objective: "Win the Speed race or lock a waste, then get out.",
        howToPlay:
          "Lead only if it lives the send and Garchomp needs the race.\nTailwind if the race matters. Encore if they Protect or set up and are not Dark.\nDo not stay to chip. Dead Cott means Speed is Garchomp's 102.",
      },
      {
        slug: "corviknight",
        title: "The Armor",
        job: "support",
        literacy: "pivot",
        role: "Takes the hit, Roosts, or slow U-turns.",
        ability: "Mirror Armor",
        item: "Rocky Helmet or Leftovers",
        moves: [
          { name: "U-turn", why: "If you outspeed, they hit whoever came in. Slow U-turn is the safe hand-off." },
          { name: "Brave Bird", why: "Grass answer. Recoil is real — do not farm it." },
          { name: "Roost", why: "Stay against a locked physical resist. The wall can win 3v3." },
          { name: "Iron Head or Body Press", why: "Steel STAB / Iron Defense wincon. Pick one kit." },
        ],
        objective: "Absorb Ice, Fairy, Fighting. Leave only when the next name wants in.",
        howToPlay:
          "Usual lead into physical or Fairy.\nMirror Armor bounces Intimidate — keep it vs Incineroar.\nNever U-turn into Garchomp while faster than Ice.",
      },
      {
        slug: "garchomp",
        title: "The Cleaner",
        job: "breaker",
        literacy: "sweeper",
        role: "Late KO. Hidden until the slot is safe.",
        ability: "Rough Skin",
        item: "Loaded Dice, Life Orb, or Yache Berry",
        moves: [
          { name: "Earthquake", why: "One target. Zero on Flying/Levitate. Grass resists it." },
          { name: "Scale Shot or Dragon Claw", why: "Birds and Levitate. Scale Shot is backup Speed if Cott dies." },
          { name: "Stone Edge", why: "Flying coverage. Still one Pokémon." },
          { name: "Swords Dance", why: "The Protect branch. Do not slam the shield." },
        ],
        objective: "Enter on a slow U-turn. Take KOs before Tailwind dies.",
        howToPlay:
          "Do not lead into Ice, Fairy, or Water.\nCome in on Electric (immune) or a slow U-turn.\nEQ if grounded and not Grass. Rock or Dragon if they fly.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "One first send. You cannot lead Cott and Corvi together.",
        branches: [
          { when: "Physical lead Corvi walls", then: "Send Corviknight. Slow U-turn later.", why: "Armor first. Cleaner stays hidden." },
          { when: "They outrun Garchomp without Tailwind", then: "Send Whimsicott if it lives. Tailwind first." },
          { when: "Dark lead", then: "Tailwind still works. Do not Encore or Taunt." },
          { when: "Ice on their three", then: "Corvi is the switch — 1× Ice, not a resist." },
          { when: "Fire lead", then: "Garchomp. Cott and Corvi are both 2× Fire." },
          { when: "Rillaboom / Grass", then: "Brave Bird. Do not Earthquake Grass." },
          { when: "Trick Room look", then: "Lead Cott. Taunt the setter." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        lede: "Tailwind costs this turn. U-turn does not protect the incoming name if you moved first.",
        branches: [
          { when: "Cott out, Garchomp needs the race", then: "Tailwind. Then switch or Moonblast." },
          { when: "Cott out, they Protect or set up, not Dark", then: "Encore. Next turn Tailwind or leave." },
          { when: "Cott out into Dark", then: "Moonblast or switch. Never Encore." },
          { when: "Corvi out, locked physical resist", then: "Stay. Roost or Iron Head. U-turn only when the next name wants in." },
          { when: "Corvi out, want Garchomp in", then: "U-turn only if slower, they switched, or the click is Fire/Electric/Rock." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Slow U-turn, stay on the wall, or re-up the clock.",
        branches: [
          { when: "Corvi healthy, they slower or locked into a Garchomp resist", then: "U-turn into Garchomp." },
          { when: "Ice or Fairy onto Garchomp", then: "Corvi in. Fairy resists. Ice is neutral — Roost after." },
          { when: "Electric or Fire onto Corvi", then: "Garchomp. Immune / resists." },
          { when: "Water onto Garchomp", then: "Whimsicott. Chomp is 2× Water." },
          { when: "Tailwind dying, still need Speed", then: "Cott in. Re-up before it fades." },
          { when: "Locked physical on Corvi, no KO this turn", then: "Stay. Roost. Wall wins long games." },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "One target. No spread fantasy.",
        branches: [
          { when: "Grounded, not Grass", then: "Earthquake. Take the KO." },
          { when: "Flying or Levitate", then: "Stone Edge or Dragon STAB. EQ is a zero." },
          { when: "Grass still up", then: "Brave Bird from Corvi. Do not EQ." },
          { when: "You read Protect", then: "Swords Dance. Next hit is the KO." },
          { when: "Ice or Fairy onto Garchomp", then: "Corvi if alive. Else you refused preview." },
          { when: "Cott dead, they still outrun", then: "Scale Shot or Scarf next game. Click coverage that KOs after they move." },
        ],
      },
    ],
    loops: [
      { title: "Slow U-turn", body: "Corvi takes the hit, then leaves. Fast U-turn under Tailwind delivers Garchomp into Ice." },
      { title: "Encore then Dance", body: "Lock Protect. Next turn Garchomp Swords Dance. Dark blanks the first half." },
      { title: "Tailwind timer", body: "Four turns including the click. On turn three, re-up, Scale Shot, or close." },
    ],
    hazards: [
      { title: "Ice is not a Corvi resist", body: "Flying/Steel is 1× Ice. Special Ice still chunks. Roost. Do not sit." },
      { title: "Fast U-turn into Ice", body: "Damage, then switch, then they attack. If Corvi is faster, Ice hits Garchomp." },
      { title: "Prankster vs Dark", body: "Encore and Taunt fail. Tailwind and Moonblast do not." },
      { title: "No Fire STAB", body: "Grass wants Brave Bird. EQ into Grass is a gift." },
      { title: "Poison into Cott", body: "4×. Corvi is immune. Switch." },
    ],
  },
  {
    id: "balance-whimsicott-incineroar-garchomp",
    title: "Control Balance: Whimsicott, Incineroar, Garchomp",
    lede: "Flinch, drop, hand the baton. You cannot Fake Out and Tailwind the same turn.",
    philosophy:
      "Stranglehold, not a wall. You traded Corvi's U-turn for Intimidate, Fake Out, Fire STAB, and Parting Shot. Parting Shot is −6: they hit the cat, then Garchomp is in. Champions cut Knock Off — the fourth slot is Taunt, Will-O-Wisp, or Snarl.",
    archetype: "balance",
    slugs: ["whimsicott", "incineroar", "garchomp"],
    meta: "Physical leads, Grass, setup. Fighting is now 2× on the pivot — Cott or Garchomp take that slot.",
    press: ["Physical leads", "Ice (Fire resist)", "Grass / Kingambit", "Protect and setup"],
    refuse: ["Fighting into Incineroar", "Fairy onto cat or Chomp", "Water / Ground / Rock into the cat", "Ghost Fake Out", "Parting Shot into Gholdengo"],
    switches: [
      { into: "Ice", send: "Incineroar" },
      { into: "Fighting / Dragon", send: "Whimsicott" },
      { into: "Water / Ground", send: "Whimsicott" },
      { into: "Electric / Rock", send: "Garchomp" },
      { into: "Grass / Steel", send: "Incineroar Flare Blitz" },
      { into: "Fairy", send: "Whimsicott; Tinkaton → Flare Blitz" },
    ],
    slots: [
      {
        slug: "whimsicott",
        title: "The Accelerator",
        job: "speed",
        literacy: "setter",
        role: "Clock and trap. Fake Out is the backup if Cott dies.",
        ability: "Prankster",
        item: "Focus Sash or Covert Cloak",
        moves: [
          { name: "Tailwind", why: "Whole turn in singles. Still works vs Dark." },
          { name: "Encore", why: "After Fake Out, this turns Protect into a free Garchomp send. Fails on Dark." },
          { name: "Moonblast", why: "Fighting (Incineroar's hole) and Dragon (Cott is immune)." },
          { name: "Taunt or Substitute", why: "Taunt vs Trick Room. Fails on Dark." },
        ],
        objective: "Clock or lock, then leave. Fighting and Dragon leads are yours.",
        howToPlay:
          "Lead vs Fighting or Dragon, or when Garchomp must outrun what is left.\nEncore only if not Dark.\nDead Cott is not a lost Speed plan — Fake Out still exists. It is a lost Tailwind.",
      },
      {
        slug: "incineroar",
        title: "The Bodyguard",
        job: "support",
        literacy: "pivot",
        role: "Flinch, Fire, −6 delivery. Fourth slot is support, not item removal.",
        ability: "Intimidate",
        item: "Rocky Helmet, Safety Goggles, or Sitrus",
        moves: [
          { name: "Fake Out", why: "+3 first turn out. Ghost is a zero. Cloak / Inner Focus keep their turn." },
          { name: "Parting Shot", why: "−6. They hit you, then Garchomp arrives. Fails on Good as Gold. Dies in KO range before −6." },
          { name: "Flare Blitz", why: "Grass and Kingambit. Recoil — take the KO, do not farm." },
          { name: "Taunt, Will-O-Wisp, or Snarl", why: "No Knock Off in Champions. Taunt Dark setup (Cott Encore fails). Burn stacks with Intimidate and −6. Snarl is Dark into Ghost." },
        ],
        objective: "Buy the next send. Delete Grass. Leave before Water/Fighting KO.",
        howToPlay:
          "Usual lead into physical, Grass, or Ice.\nFake Out turn one. Next is Parting Shot unless Flare Blitz KOs now.\nWill-O-Wisp the physical truck. Taunt Dark Protect/setup. Snarl Ghost and Gholdengo.\nSwitch out and back to refresh Fake Out.",
      },
      {
        slug: "garchomp",
        title: "The Finisher",
        job: "breaker",
        literacy: "sweeper",
        role: "Enters on −6. Ends it.",
        ability: "Rough Skin",
        item: "Loaded Dice, Life Orb, or Yache Berry",
        moves: [
          { name: "Earthquake", why: "One target. Grass is Incineroar's job." },
          { name: "Scale Shot or Dragon Claw", why: "Birds. Backup Speed if Cott is dead and Fake Out is spent." },
          { name: "Stone Edge", why: "Flying coverage." },
          { name: "Swords Dance", why: "Protect branch." },
        ],
        objective: "Stay back until Intimidate or Tailwind has bought the slot.",
        howToPlay:
          "Come in on Parting Shot, Electric, Fighting, or Rock.\nDo not lead Ice, Fairy, Water, or Dragon.\nEQ grounded non-Grass. Dance on Protect.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "Queue Fake Out → Tailwind → Parting Shot. Never two names out.",
        branches: [
          { when: "Physical Incineroar lives", then: "Send the cat. Fake Out, then Blitz or Parting Shot." },
          { when: "They outrun Garchomp", then: "Cott first if it lives. Fake Out waits." },
          { when: "Fighting lead, not Poison", then: "Cott. Incineroar is 2× Fighting." },
          { when: "Sneasler / Fighting-Poison", then: "Garchomp. Cott is 4× Poison." },
          { when: "Water or Ground lead", then: "Cott. Do not bodyguard a Waterfall." },
          { when: "Dark lead", then: "Tailwind still works. Fake Out still works. No Encore." },
          { when: "Fairy lead", then: "Cott Moonblast. Tinkaton is Flare Blitz." },
          { when: "Rillaboom", then: "Incineroar. Fake Out the Glide turn." },
          { when: "Trick Room look", then: "Taunt if not Dark. Fake Out still functions in the room." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        branches: [
          { when: "Cat out, they can KO or set up", then: "Fake Out. Next is Parting Shot or Blitz." },
          { when: "Cat out into Ghost", then: "Snarl, Will-O-Wisp, or Parting Shot. Never Fake Out." },
          { when: "Cat out, Cloak / Inner Focus", then: "Expect their attack. Parting Shot before KO range." },
          { when: "Cat out, Dark setup or Protect", then: "Taunt. Cott Encore is illegal on Dark." },
          { when: "Cat out, physical still hitting", then: "Will-O-Wisp, then Parting Shot. Burn plus Intimidate plus −6." },
          { when: "Grass or Steel Blitz KOs", then: "Fake Out if needed, then Blitz. Be aggressive." },
          { when: "Cott out, need the race", then: "Tailwind." },
          { when: "Cott out, Protect/setup, not Dark", then: "Encore. Fake Out later." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { when: "Slot safe after Intimidate", then: "Parting Shot into Garchomp." },
          { when: "Blitz KO is there", then: "Stay. Take it. Pivot next send." },
          { when: "Water, Ground, Fighting, Rock threaten the cat", then: "Leave before KO. −6 does not save 0 HP." },
          { when: "Ice onto predicted Garchomp", then: "Stay on Incineroar. Fire resists." },
          { when: "Fairy in", then: "Cott. Do not Parting Shot Garchomp into Fairy." },
          { when: "Gholdengo in", then: "Snarl. Fake Out is Normal. Taunt, burn, and Parting Shot fail on Good as Gold." },
          { when: "Mirror Armor Corvi", then: "Intimidate bounces. Fake Out and Fire still work." },
          { when: "Fake Out spent, slot still ugly", then: "Leave and come back. Refresh." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { when: "Grounded, not Grass", then: "Earthquake. One target." },
          { when: "Flying or Levitate", then: "Rock or Dragon STAB." },
          { when: "Grass", then: "Flare Blitz if the cat lives. Do not EQ." },
          { when: "Protect", then: "Swords Dance." },
          { when: "Ice or Fairy onto Garchomp", then: "Ice → cat. Fairy → Cott." },
          { when: "Cott dead, they still outrun", then: "Fake Out refresh or Scale Shot." },
        ],
      },
    ],
    loops: [
      { title: "Parting Shot loop", body: "Fake Out (first turn out), then −6. Garchomp arrives after their hit. Leave a turn sooner if HP is in KO range." },
      { title: "Priority queue", body: "+3 Fake Out, then +1 Tailwind. Never the same turn. Doubles 'both at once' is illegal here." },
      { title: "Fake Out refresh", body: "Switch the cat out and back. Second flinch is the Speed plan after Cott dies." },
    ],
    hazards: [
      { title: "Fighting into Incineroar", body: "2× Dark. Cott and Garchomp resist. Exception: Sneasler — Cott is 4× Poison, send Garchomp." },
      { title: "Fairy", body: "2× on cat and Chomp. You cut the Steel wall. Moonblast is the answer." },
      { title: "Ghost, Cloak, Good as Gold", body: "Fake Out fails on Ghost. Cloak keeps their turn. Gholdengo blanks Parting Shot, Taunt, and burn — Snarl is the remaining Dark click." },
      { title: "No Knock Off", body: "Champions omitted it. Fourth slot is Taunt, Will-O-Wisp, or Snarl. Do not bring a VGC item-removal script." },
      { title: "Mirror Armor", body: "Intimidate and Parting Shot bounce. Play Fake Out and Fire." },
      { title: "Blitz recoil", body: "Take the Grass KO. Keep HP for the Ice resist after." },
    ],
  },
  {
    id: "grassy-rillaboom-sneasler-salamence-mega",
    title: "Grassy Offense: Rillaboom, Sneasler, Mega Salamence",
    lede: "Terrain on entry, Unburden after the seed, Aerilate to close. One Fake Out per turn.",
    philosophy:
      "Early M-C cups keep handing first to Mega Salamence next to Rillaboom. Sneasler is the usual third. Fake Out, then U-turn into Grassy Seed. Hide the Mega until Ice is gone.",
    archetype: "grassy",
    slugs: ["rillaboom", "sneasler", "salamence-mega"],
    meta: "Garchomp and Kingambit cores. Terrain cuts Earthquake. Armor Tail turns the engine off.",
    press: ["Garchomp / EQ", "Kingambit", "Tailwind Cott (Fake Out is +3)", "Setup"],
    refuse: ["Fire into Rillaboom", "Ice / Rock into the Mega", "Psychic / Flying into Sneasler", "Armor Tail / Psychic Terrain"],
    switches: [
      { into: "Ice", send: "Rillaboom" },
      { into: "Fire", send: "Mega Salamence" },
      { into: "Fairy", send: "Sneasler Dire Claw" },
      { into: "Electric", send: "Rillaboom" },
      { into: "Rock", send: "Sneasler" },
      { into: "Ground", send: "Mega (immune) or Rillaboom" },
    ],
    slots: [
      {
        slug: "rillaboom",
        title: "The Room",
        job: "support",
        literacy: "setter",
        role: "Terrain on entry. Flinch, Glide, or deliver the Seed.",
        ability: "Grassy Surge",
        item: "Miracle Seed or Assault Vest",
        moves: [
          { name: "Fake Out", why: "First turn out. Ghost / Armor Tail / Psychic Terrain are zeros." },
          { name: "Grassy Glide", why: "+1 in terrain. Fails into Armor Tail and Psychic Terrain." },
          { name: "Wood Hammer", why: "When Glide is not enough. Recoil — terrain heals a sliver." },
          { name: "U-turn", why: "Hand-off into Sneasler. Slow after Fake Out so the Seed pops clean." },
        ],
        objective: "Put the room up, skip a turn, Glide a KO or deliver Unburden.",
        howToPlay:
          "Usual lead unless their lead is Fire.\nFake Out if they would KO or Tailwind.\nGlide if the KO is there — do not U-turn a free KO.",
      },
      {
        slug: "sneasler",
        title: "The Unburden",
        job: "speed",
        literacy: "sweeper",
        role: "Seed pops, Speed doubles, punch a hole.",
        ability: "Unburden",
        item: "Grassy Seed",
        moves: [
          { name: "Dire Claw", why: "Poison into Fairy. Can poison, para, or sleep. Steel laughs — that is Boom or the Mega." },
          { name: "Close Combat", why: "Kingambit and Incineroar. Defense drops; no White Herb." },
          { name: "Fake Out", why: "Second flinch after a refresh. Not a double lead." },
          { name: "Protect or U-turn", why: "Scout Flying/Psychic. Escape into the Mega." },
        ],
        objective: "Enter on terrain, pop the Seed, take one or two KOs.",
        howToPlay:
          "Do not lead unless Boom cannot appear (Fire).\nNo Seed without terrain. No Unburden without the Seed.\nSpend the doubled Speed. They revenge next turn.",
      },
      {
        slug: "salamence-mega",
        title: "The Mega",
        job: "mega",
        literacy: "sweeper",
        role: "Intimidate on entry, Mega, Aerilate Flying.",
        ability: "Aerilate",
        item: "Salamencite",
        moves: [
          { name: "Double-Edge", why: "Aerilate STAB. Recoil is the tax. Not EQ through your own terrain." },
          { name: "Dragon Dance or Hyper Voice", why: "Dance on Protect. Hyper Voice is the special cup line. Commit to one." },
          { name: "Earthquake", why: "Steel/Fire coverage. Terrain cuts it. Coverage tax, not Garchomp EQ." },
          { name: "Protect or Dragon Claw", why: "Scout Ice. 4× Ice is the hole." },
        ],
        objective: "Hidden until Ice and Rock are gone. Then Mega and KO.",
        howToPlay:
          "Switch in as base Salamence so Intimidate drops Attack, then Mega.\nAerilate does not exist until you Mega.\nOne stone. No second Mega.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "First send is almost never the Mega. Seed is not free until Sneasler steps onto terrain.",
        branches: [
          { when: "Physical Boom lives", then: "Rillaboom. Fake Out, then U-turn or Glide." },
          { when: "Fire lead", then: "Mega Salamence. Dragon resists Fire." },
          { when: "Ice on their three", then: "Boom is the Ice switch. Never the Mega." },
          { when: "Fairy on their three", then: "Sneasler after terrain. Dire Claw." },
          { when: "Indeedee / Farigiraf", then: "Priority is off. Wood Hammer, Dire Claw, Double-Edge." },
          { when: "Kingambit or Incineroar", then: "Fake Out, then Close Combat." },
          { when: "Whimsicott Tailwind three", then: "Fake Out the Cott (+3 vs +1). Terrain cuts EQ." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        branches: [
          { when: "Boom out, they KO / set up / Tailwind", then: "Fake Out. Next is U-turn or Glide." },
          { when: "Boom out into Ghost", then: "U-turn or Wood Hammer." },
          { when: "Glide KO is there", then: "Glide. Be aggressive." },
          { when: "Want Sneasler in", then: "U-turn only if slower, they switched, or not Flying/Psychic." },
          { when: "Had to lead Sneasler", then: "Play 120 Speed. No Seed yet. Leave to Mega into Fire." },
          { when: "Clean Mega lead", then: "Intimidate happened. Mega. Double-Edge." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { when: "Sneasler entered on terrain with Seed", then: "Dire Claw Fairy/Ghost. Close Combat Dark/Steel. Spend it." },
          { when: "Fire onto Boom", then: "Mega Salamence." },
          { when: "Ice or Rock onto the Mega", then: "Rillaboom (Ice) or Sneasler (Rock)." },
          { when: "Psychic or Flying onto Sneasler", then: "Leave. Boom takes Psychic. Mega takes Flying." },
          { when: "Gholdengo / Steel on Dire Claw", then: "Wood Hammer or Mega EQ." },
          { when: "Armor Tail still in", then: "Stop Fake Out and Glide. Hit it raw." },
          { when: "Unburden spent, Ice gone", then: "Mega. Intimidate, Mega, Double-Edge." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { when: "Not Steel, Ice already scouted gone", then: "Double-Edge. One target." },
          { when: "Steel or Fire resists Flying", then: "EQ, Glide, or Close Combat." },
          { when: "Protect", then: "Dragon Dance. Do not recoil the shield." },
          { when: "Ice or Fairy onto Mega", then: "Ice → Boom. Fairy → Dire Claw." },
          { when: "Boom dead, terrain down, Seed still held", then: "Seed will not pop. Play 120. Mega is Speed." },
        ],
      },
    ],
    loops: [
      { title: "Fake Out, then Seed", body: "Flinch, U-turn into Sneasler on terrain, Unburden, punch. Fast U-turn without the flinch is Flying on entry." },
      { title: "Intimidate, then Aerilate", body: "Enter as base Salamence. Attack drops. Mega. Double-Edge is Flying." },
      { title: "Priority queue", body: "Fake Out +3, Glide +1. Armor Tail turns both off. Then Unburden and Aerilate win raw." },
    ],
    hazards: [
      { title: "Fire into Rillaboom", body: "The setter is Grass. Mega is the Fire switch." },
      { title: "Ice and Rock into the Mega", body: "4× Ice, 2× Rock. Hide it. Cups that won still hid it." },
      { title: "Armor Tail / Psychic Terrain", body: "Fake Out and Glide fail. Play like three attackers with no engine." },
      { title: "Unburden without the Seed", body: "No terrain, no double Speed. Do not click as if you were 240." },
      { title: "Your own Earthquake", body: "Terrain cuts Ground for everyone. Double-Edge is the STAB." },
    ],
  },
  {
    id: "rain-pelipper-archaludon-basculegion",
    title: "Rain: Pelipper, Archaludon, Basculegion",
    lede: "Drizzle on entry. Electro Shot fires the same turn. Swift Swim closes. One send — rain is not a partner Tailwind.",
    philosophy:
      "Pelipper walks in and the field is already wet. Archaludon turns that into a 130 BP Electric nuke with no charge. Basculegion is the physical closer under Swift Swim. If Drought overwrites you, the three is three Waters with no engine.",
    archetype: "rain",
    slugs: ["pelipper", "archaludon", "basculegion-male"],
    meta: "Fire cores and Charizard Y. Pack the Electric switch (Archaludon) and respect Grass.",
    press: ["Fire / Mega Charizard Y", "Kingambit", "Sun if you keep rain", "Steel that hates Water"],
    refuse: ["Electric into Pelipper", "Grass into the Waters", "Drought overwrite", "Trick Room"],
    switches: [
      { into: "Electric", send: "Archaludon" },
      { into: "Grass", send: "Archaludon (Steel/Dragon resists)" },
      { into: "Fire", send: "Anyone — rain cuts Fire" },
      { into: "Rock into Pelipper", send: "Archaludon or Basculegion" },
      { into: "Dragon", send: "Pelipper or Basculegion" },
    ],
    slots: [
      {
        slug: "pelipper",
        title: "The Cloud",
        job: "weather",
        literacy: "setter",
        role: "Drizzle on entry. Hurricane never misses in rain.",
        ability: "Drizzle",
        item: "Damp Rock or Focus Sash",
        moves: [
          { name: "Hurricane", why: "Never misses in rain. Flying STAB into Fighting and Grass." },
          { name: "Weather Ball", why: "Water in rain. The special nuke from a setter." },
          { name: "U-turn", why: "Hand-off into Archaludon or Basc. Fast U-turn still delivers the hit to whoever came in." },
          { name: "Roost", why: "4× Electric is why you do not sit. Roost after a resisted hit, not after Thunder." },
        ],
        objective: "Put rain up. Chip or leave. Do not eat Electric.",
        howToPlay:
          "Lead unless they have a fast Electric that OHKOs through sash math.\nHurricane or Weather Ball if the KO is there.\nU-turn into Archaludon for Electro Shot on a free turn.",
      },
      {
        slug: "archaludon",
        title: "The Railgun",
        job: "breaker",
        literacy: "wallbreaker",
        role: "Electro Shot in one turn. Stamina if they hit you.",
        ability: "Stamina",
        item: "Assault Vest or White Herb",
        moves: [
          { name: "Electro Shot", why: "No charge in rain. 130 BP Electric. This is the hole-punch." },
          { name: "Flash Cannon or Draco Meteor", why: "Steel STAB / Dragon nuke. Meteor if you need the KO now." },
          { name: "Body Press or Flash Cannon", why: "Stamina makes Body Press scale. Vest sets skip status." },
          { name: "Protect", why: "Scout Drought and Electric. Not on the Electro Shot turn you needed." },
        ],
        objective: "Fire Electro Shot while rain is up. Break what Water does not.",
        howToPlay:
          "Come in on Grass or Electric.\nClick Electro Shot in rain. It is not a charge.\nIf sun overwrites, you are a slow Steel. Leave or Draco.",
      },
      {
        slug: "basculegion-male",
        title: "The Wave",
        job: "breaker",
        literacy: "sweeper",
        role: "Swift Swim closer. Last Respects scales if a partner fell.",
        ability: "Swift Swim",
        item: "Life Orb or Choice Band",
        moves: [
          { name: "Wave Crash", why: "Water STAB in rain. Recoil. Take the KO." },
          { name: "Last Respects", why: "Ghost nuke after a KO on your side. Do not lead it at +0 unless you have to." },
          { name: "Aqua Jet", why: "Priority if rain is gone or they Protect-scouted Speed." },
          { name: "Flip Turn or Crunch", why: "Pivot out / Dark into Ghost. Band sets skip Flip Turn." },
        ],
        objective: "Enter under rain. Outspeed. Close.",
        howToPlay:
          "Do not lead into Electric or Grass.\nSwift Swim does nothing without rain.\nLast Respects after Pelipper or Archaludon falls — that is the 2v1.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "Rain is on Pelipper's entry. Y's Drought overwrites if they send it.",
        branches: [
          { when: "Fire lead, no Electric", then: "Pelipper. Rain cuts Fire. Hurricane Fighting/Grass." },
          { when: "Fast Electric (Raichu, Kilowattrel)", then: "Archaludon. Pelipper is 4× Electric." },
          { when: "Grass / Rillaboom", then: "Archaludon. Do not send either Water." },
          { when: "Mega Charizard Y on their three", then: "Do not gift Pelipper into Drought+Heat Wave. Archaludon or wait the Mega out." },
          { when: "Kingambit", then: "Pelipper Hurricane or Basc Wave Crash. Fighting is not on this three." },
          { when: "Trick Room look", then: "You are the fast three. Taunt is not here. Play to KO the setter or lose the clock." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        branches: [
          { when: "Pelipper out, rain just went up", then: "Hurricane or Weather Ball. U-turn if Archaludon wants the next click." },
          { when: "Pelipper out into Electric", then: "Leave now. Archaludon." },
          { when: "Archaludon out, rain up", then: "Electro Shot. It fires this turn." },
          { when: "Archaludon out, sun went up", then: "You lost the engine. Draco or leave. Electro Shot charges again." },
          { when: "Had to lead Basc", then: "Only if rain is already up from a prior send. Else you are a slow Water." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { when: "Rain up, Archaludon healthy", then: "Electro Shot until they bring a Ground or a vest that sits." },
          { when: "Electric onto Pelipper", then: "Archaludon." },
          { when: "Grass onto Waters", then: "Archaludon. Steel/Dragon resists Grass." },
          { when: "Drought Mega comes in", then: "If you move first, KO it. If not, rain is gone — Basc is no longer Swift Swim." },
          { when: "Partner already fainted", then: "Basc Last Respects. That is the closer." },
          { when: "Rain fading, still need a KO", then: "Basc Aqua Jet or Archaludon while it lasts. Damp Rock bought you this turn." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { when: "Rain up, they are grounded", then: "Wave Crash or Electro Shot. One target." },
          { when: "They Protect", then: "Do not recoil Wave Crash. Electro Shot or wait." },
          { when: "Rain gone", then: "Aqua Jet, Last Respects, or Archaludon raw. Do not pretend Swift Swim is up." },
          { when: "Electric still in", then: "Archaludon only. Both Waters die." },
        ],
      },
    ],
    loops: [
      { title: "Drizzle, then Shot", body: "Pelipper in (rain). U-turn or KO. Archaludon Electro Shot the same weather. No charge." },
      { title: "Swift Swim close", body: "Basc enters under rain and outspeeds. Wave Crash. Last Respects if someone already fell." },
      { title: "Weather war", body: "Last weather ability wins. Y overwrite on switch-in. Re-send Pelipper to steal it back — that costs a turn." },
    ],
    hazards: [
      { title: "4× Electric", body: "Pelipper dies to Thunderbolt. Archaludon is the switch. Do not Roost on the Electric." },
      { title: "Grass", body: "Both Waters are 2×. Archaludon is ¼. Send the railgun." },
      { title: "Drought", body: "Sun overwrites rain. Electro Shot charges. Swift Swim dies. KO Y or re-set." },
      { title: "No rain, no Basc", body: "Swift Swim is not a personality. Aqua Jet is the remaining Speed." },
      { title: "Recoil", body: "Wave Crash plus Life Orb will KO you. Take the KO; do not farm." },
    ],
  },
  {
    id: "trick-room-farigiraf-kingambit-gholdengo",
    title: "Trick Room: Farigiraf, Kingambit, Gholdengo",
    lede: "Flip the clock. Armor Tail blanks Fake Out. Good as Gold blanks Parting Shot. Four turns, then you re-set or you race.",
    philosophy:
      "This three is slow on purpose. Farigiraf sets the room and shuts priority. Kingambit cashes the turns. Gholdengo is the special Steel and the Ghost answer the truck hates. Fast teams look scary in preview. Under the room they move last.",
    archetype: "trick-room",
    slugs: ["farigiraf", "kingambit", "gholdengo"],
    meta: "Fake Out balance and Tailwind HO. Taunt on the setter is the preview you respect.",
    press: ["Fake Out cores", "Tailwind HO", "Sneasler Unburden", "Priority spam"],
    refuse: ["Taunt the setter", "Fighting into Kingambit", "Fire / Ground into Gholdengo", "A faster Trick Room"],
    switches: [
      { into: "Fake Out / Grassy Glide", send: "Farigiraf (Armor Tail)" },
      { into: "Fighting", send: "Gholdengo (Ghost immune)" },
      { into: "Fire", send: "Farigiraf" },
      { into: "Dark", send: "Kingambit" },
      { into: "Status / Parting Shot", send: "Gholdengo (Good as Gold)" },
      { into: "Dragon", send: "Gholdengo or Farigiraf" },
    ],
    slots: [
      {
        slug: "farigiraf",
        title: "The Clock",
        job: "speed",
        literacy: "setter",
        role: "Armor Tail plus Trick Room. Protect the four turns.",
        ability: "Armor Tail",
        item: "Mental Herb or Sitrus Berry",
        moves: [
          { name: "Trick Room", why: "The whole plan. Mental Herb eats one Taunt." },
          { name: "Psychic", why: "STAB into Fighting and Poison. Sneasler hates this." },
          { name: "Dazzling Gleam or Thunder Wave", why: "Fairy into Dragon, or para if the room is already up." },
          { name: "Protect", why: "Scout Taunt. Mental Herb is the other Taunt answer." },
        ],
        objective: "Set the room. Blank Fake Out while you are in. Get out once the truck can cash.",
        howToPlay:
          "Lead if they look like Fake Out. Armor Tail makes their +3 a zero.\nTrick Room turn one unless they Taunt — Mental Herb.\nDo not stay to chip. Kingambit needs the turns.",
      },
      {
        slug: "kingambit",
        title: "The Truck",
        job: "breaker",
        literacy: "wallbreaker",
        role: "Supreme Overlord. Slow on purpose. First under the room.",
        ability: "Supreme Overlord",
        item: "Leftovers or Black Glasses",
        moves: [
          { name: "Kowtow Cleave", why: "Dark STAB that never misses. The hole-punch." },
          { name: "Sucker Punch", why: "Priority if the room is down. Fails if they Protect or status." },
          { name: "Swords Dance or Iron Head", why: "Dance under the room. Iron Head for Fairy." },
          { name: "Protect", why: "Scout Fighting. Dark/Steel is 1× Fighting — not free, not death." },
        ],
        objective: "Move first under Trick Room. Delete walls. Overlord scales if a partner fell.",
        howToPlay:
          "Do not lead unless the room is up or they cannot Fighting you.\nFighting is 2× Dark × ½ Steel = 1× — not free, not death.\nSucker Punch is the Speed plan after the room dies.",
      },
      {
        slug: "gholdengo",
        title: "The Vault",
        job: "breaker",
        literacy: "wall",
        role: "Good as Gold. Status bounce. Special Steel.",
        ability: "Good as Gold",
        item: "Leftovers or Choice Specs",
        moves: [
          { name: "Make It Rain", why: "Steel STAB. Drops SpA — Specs or accept the drop." },
          { name: "Shadow Ball", why: "Ghost STAB. 2× into Psychic." },
          { name: "Nasty Plot or Focus Blast", why: "Setup under the room, or Fighting coverage into Kingambit mirrors." },
          { name: "Protect", why: "Scout Fire and Ground. You are 2× both." },
        ],
        objective: "Blank Parting Shot and Encore. Special break. Ghost-immune Fighting switch.",
        howToPlay:
          "Come in on Fake Out (if Farigiraf already left), Parting Shot, or Fighting.\nGood as Gold does not blank Fake Out — it is an attack. Armor Tail does.\nFire and Ground leave.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "Protect the setter. If they Taunt without Herb, the four turns never start.",
        branches: [
          { when: "Fake Out lead (Incineroar, Rillaboom, Sneasler)", then: "Farigiraf. Armor Tail blanks the flinch. Then Trick Room." },
          { when: "Taunt look (Whimsicott, Grimmsnarl)", then: "Mental Herb on Farigiraf, or lead Gholdengo (Good as Gold blanks Taunt)." },
          { when: "Fighting lead", then: "Gholdengo. Ghost immune. Not Kingambit." },
          { when: "Fire or Ground", then: "Farigiraf. Both Steels hate it." },
          { when: "They are also Trick Room", then: "Speed tie on the room. Faster setter or Taunt. Do not assume yours sticks." },
          { when: "Tailwind HO", then: "Farigiraf. Flip the clock. Their Tailwind is inverted." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        branches: [
          { when: "Farigiraf out, they Fake Out", then: "It fails. Trick Room." },
          { when: "Farigiraf out, they Taunt, you have Herb", then: "Herb eats it. Trick Room." },
          { when: "Farigiraf out, they Taunt, no Herb", then: "You lost the click. Psychic or leave to Gholdengo." },
          { when: "Gholdengo lead into Taunt / Parting Shot", then: "It fails. Make It Rain or Nasty Plot." },
          { when: "Kingambit out, room not up", then: "You misread. Protect or Sucker Punch. Get Farigiraf in." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "The four turns are the match. Count them.",
        branches: [
          { when: "Room up, Kingambit in", then: "Kowtow or Dance. Move first. Be aggressive." },
          { when: "Room up, they switch to Fighting", then: "Gholdengo. Immune." },
          { when: "Room up, they switch to Fire", then: "Farigiraf. Do not sit either Steel." },
          { when: "A partner fainted", then: "Kingambit Overlord is live. That is extra damage — spend the remaining turns." },
          { when: "Room on last turn", then: "KO now or re-set Farigiraf next. Do not waffle." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { when: "Room still up, one of theirs left", then: "Kowtow or Make It Rain. Close." },
          { when: "Room down, they outrun the truck", then: "Sucker Punch if they attack. Gholdengo if they are Fighting." },
          { when: "They Protect", then: "Swords Dance or Nasty Plot. Do not Sucker Punch the shield." },
          { when: "Farigiraf alive, room down, still slow", then: "Re-set. The match is another four turns or you lose the race." },
        ],
      },
    ],
    loops: [
      { title: "Blank, then flip", body: "Farigiraf in. Fake Out fails. Trick Room. Kingambit cashes." },
      { title: "Overlord snowball", body: "A KO on your side buffs Kingambit. Under the room that is often the game." },
      { title: "Room timer", body: "Four turns including the click. Re-set or Sucker Punch when it dies." },
    ],
    hazards: [
      { title: "Taunt without Herb", body: "The setter does nothing. Gholdengo blanks Taunt — that is the backup lead." },
      { title: "Fire and Ground", body: "Both Steels are 2×. Farigiraf takes those slots." },
      { title: "Fake Out vs Gholdengo", body: "Good as Gold does not stop Fake Out. Armor Tail does. Know which blank you have in the slot." },
      { title: "Sucker Punch vs Protect", body: "The priority fails. Dance instead." },
      { title: "Fighting is 1× on Kingambit", body: "Not 4×, not free. Gholdengo is still the real Fighting immune." },
    ],
  },
  {
    id: "sun-charizard-y-garchomp-cinderace",
    title: "Sun: Mega Charizard Y, Garchomp, Cinderace",
    lede: "Drought walks in with the Mega. Fire does not charge. Garchomp patches Rock. Libero closes. Y is the field and the wincon.",
    philosophy:
      "Sun on this three is Mega Charizard Y. You do not splash Drought onto a rain team. Garchomp punches what Fire does not. Cinderace is the second Fire that stays fast if Y goes down. Rock and Water are the preview you refuse to donate Y into.",
    archetype: "sun",
    slugs: ["charizard-mega-y", "garchomp", "cinderace"],
    meta: "Grass, Steel, Rillaboom. Rain if you overwrite. Everyone here is 2× Water — that is the hole.",
    press: ["Grass / Rillaboom", "Steel", "Rain if you steal sun", "Bug / Ice into Cinderace"],
    refuse: ["Rock into Y", "Water into anyone", "Faster Drought", "Trick Room"],
    switches: [
      { into: "Rock", send: "Garchomp" },
      { into: "Electric", send: "Garchomp (immune)" },
      { into: "Ice", send: "Cinderace" },
      { into: "Grass", send: "Y or Cinderace" },
      { into: "Water", send: "Nobody is good — leave Y, chip, do not sit" },
      { into: "Dragon", send: "Cinderace or Y" },
    ],
    slots: [
      {
        slug: "charizard-mega-y",
        title: "The Drought",
        job: "mega",
        literacy: "sweeper",
        role: "Setter and wincon. Heat Wave in sun. Solar Beam does not charge.",
        ability: "Drought",
        item: "Charizardite Y",
        moves: [
          { name: "Heat Wave or Flamethrower", why: "Fire STAB in sun. The reason Y exists." },
          { name: "Solar Beam", why: "No charge in sun. Grass and Water answers that would sit on Fire." },
          { name: "Ancient Power or Air Slash", why: "Rock chip into other Fires / Flying coverage. Ancient Power is not a Rock resist for you." },
          { name: "Protect", why: "Scout Rock and Water. 4× Rock. Do not lead into it." },
        ],
        objective: "Sun on entry. Burn Grass and Steel. Leave Rock.",
        howToPlay:
          "Lead if they cannot Rock or Water you turn one.\nMega immediately. Drought is the Mega ability.\nSolar Beam only while sun is up. If rain overwrites, you charge.",
      },
      {
        slug: "garchomp",
        title: "The Patch",
        job: "breaker",
        literacy: "wallbreaker",
        role: "Rock and Electric switch. Ground hole-punch.",
        ability: "Rough Skin",
        item: "Loaded Dice, Life Orb, or Yache Berry",
        moves: [
          { name: "Earthquake", why: "One target. Hits Y's Fire answers that are grounded." },
          { name: "Dragon Claw or Scale Shot", why: "Dragon STAB. Scale Shot if Y died and you need Speed." },
          { name: "Stone Edge", why: "Flying. Ironic coverage from the Rock switch." },
          { name: "Swords Dance", why: "Protect branch." },
        ],
        objective: "Take Rock and Electric. Punch what Fire does not.",
        howToPlay:
          "Come in on Rock, Electric, or a resisted Fire.\nYou are 2× Water and 4× Ice — same holes as always.\nDo not 'patch' a Waterfall. Nobody here resists Water.",
      },
      {
        slug: "cinderace",
        title: "The Libero",
        job: "speed",
        literacy: "sweeper",
        role: "Picks a type and commits. Fast Fire if Y is gone.",
        ability: "Libero",
        item: "Life Orb or Heavy-Duty Boots",
        moves: [
          { name: "Pyro Ball", why: "Fire STAB in sun. Libero makes you Fire on the click." },
          { name: "High Jump Kick", why: "Fighting into Kingambit and Incineroar. Miss is a self-KO risk." },
          { name: "Sucker Punch", why: "Dark priority. Backup Speed if sun is gone." },
          { name: "U-turn or Gunk Shot", why: "Pivot / Poison into Fairy. U-turn still has the fast-switch trap." },
        ],
        objective: "Second wincon. Ice switch. Close after Y punched a hole.",
        howToPlay:
          "Lead vs Ice if Y would eat it (Y is 1× Ice, you resist).\nLibero is the click's type — you are Fire after Pyro Ball, Fighting after HJK.\nDo not High Jump Kick a Ghost.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "Y is 4× Rock. Water hits all three for 2×. Preview is where you refuse both.",
        branches: [
          { when: "Grass / Rillaboom lead", then: "Y. Drought, Heat Wave. Glide is Fire-weak." },
          { when: "Steel / Kingambit", then: "Y Heat Wave or Cinderace High Jump Kick." },
          { when: "Rock lead", then: "Garchomp. Never Y." },
          { when: "Water / Pelipper", then: "Do not lead Y. If you must fight rain, send Y only to overwrite — you still take Water." },
          { when: "Electric lead", then: "Garchomp. Immune." },
          { when: "Ice lead", then: "Cinderace. Garchomp is 4×. Y is neutral." },
          { when: "They also have Drought", then: "Last weather wins. Speed on the Mega or you play their sun." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        branches: [
          { when: "Y out, sun just went up", then: "Heat Wave or Solar Beam. Take the KO." },
          { when: "Y out into Rock or Water", then: "Leave to Garchomp (Rock) or anyone who is not 4× (Water is ugly on all)." },
          { when: "Garchomp out on Rock", then: "Earthquake. You patched." },
          { when: "Cinderace out, sun up", then: "Pyro Ball. Libero Fire." },
          { when: "Rain overwrote sun", then: "Re-send Y to steal weather, or play Garchomp/Cinderace raw." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { when: "Sun up, Grass or Steel in", then: "Y. Be aggressive." },
          { when: "Rock onto Y", then: "Garchomp immediately." },
          { when: "Water in", then: "Solar Beam from Y if sun is still up. Else you are losing this slot — chip and do not sit." },
          { when: "Electric onto Y", then: "Garchomp." },
          { when: "Y fainted, sun fading", then: "Cinderace is the remaining Fire. Sucker Punch if they outrun." },
          { when: "They Protect", then: "Swords Dance Garchomp or wait. Do not Solar Beam the shield." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { when: "Sun up, they cannot Rock you", then: "Heat Wave. Close." },
          { when: "Y dead, one of theirs left", then: "Cinderace Pyro Ball or Garchomp EQ. One target." },
          { when: "Sun gone", then: "Sucker Punch, EQ, Scale Shot. Solar Beam now charges — do not click it." },
          { when: "Water still in", then: "Solar Beam only if sun is up. Otherwise you are fishing." },
        ],
      },
    ],
    loops: [
      { title: "Drought, then burn", body: "Y in. Sun up. Heat Wave Grass/Steel. Solar Beam the Water answer." },
      { title: "Rock patch", body: "Never leave Y in on Stone Edge. Garchomp is the whole reason the Mega can exist on a three." },
      { title: "Libero close", body: "If Y punched a hole and fainted, Cinderace finishes. Type is the move you click." },
    ],
    hazards: [
      { title: "4× Rock", body: "Y dies to Stone Edge. Garchomp is the switch. Preview is where you refuse the lead." },
      { title: "Water on everyone", body: "All three are 2× Water. Solar Beam is the patch while sun lasts. There is no resist." },
      { title: "Weather war", body: "Pelipper overwrite on entry. Re-send Y to steal sun back. That is a turn." },
      { title: "Solar Beam without sun", body: "It charges. You donate a turn. Do not." },
      { title: "High Jump Kick miss / Ghost", body: "Cinderace can KO itself. Dire read. Pyro Ball is the safe Fire click." },
    ],
  },
];

export function getCanonicalManual(id: string) {
  return CANONICAL_MANUALS.find((m) => m.id === id);
}

export function isCanonicalManualId(id: string) {
  return CANONICAL_MANUALS.some((m) => m.id === id);
}

export function manualHref(id: string) {
  return `/manuals/${id}` as const;
}

export function emptySlot(slug = ""): SlotManual {
  return {
    slug,
    title: "",
    job: "breaker",
    role: "",
    moves: [
      { name: "", why: "" },
      { name: "", why: "" },
      { name: "", why: "" },
      { name: "", why: "" },
    ],
    objective: "",
    howToPlay: "",
  };
}

export function emptyPhase(id: string, title: string): ManualPhase {
  return {
    id,
    title,
    lede: "",
    branches: [{ when: "", then: "" }],
  };
}

export function emptyManual(id: string): TeamManual {
  return {
    id,
    title: "",
    lede: "",
    philosophy: "",
    archetype: "balance",
    slugs: ["", "", ""],
    meta: "",
    slots: [emptySlot(), emptySlot(), emptySlot()],
    phases: MANUAL_PHASE_IDS.map((phaseId) =>
      emptyPhase(
        phaseId,
        phaseId === "preview" ? "Preview" : phaseId === "lead" ? "Lead" : phaseId === "mid" ? "Mid" : "Late",
      ),
    ),
    press: [""],
    refuse: [""],
    switches: [{ into: "", send: "" }],
    loops: [{ title: "", body: "" }],
    hazards: [{ title: "", body: "" }],
  };
}
