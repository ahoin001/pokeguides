import type { ArchetypeId, LiteracyRoleId, RoleId, SampleSp } from "@/types/pokemon";

export type MoveAlt = {
  name: string;
  why: string;
};

export type MoveNote = {
  name: string;
  why: string;
  alts?: MoveAlt[];
};

export type SlotTrainingAlt = {
  name: string;
  sp: SampleSp;
  why: string;
  spend?: string[];
};

export type SlotTraining = {
  sp: SampleSp;
  why: string;
  /** One line: what this spread is for. */
  label?: string;
  /** What each pile of points buys. */
  spend?: string[];
  alts?: SlotTrainingAlt[];
};

export type SlotManual = {
  slug: string;
  title: string;
  job: RoleId;
  literacy?: LiteracyRoleId;
  role: string;
  ability?: string;
  item?: string;
  itemWhy?: string;
  itemAlts?: MoveAlt[];
  nature?: string;
  training?: SlotTraining;
  moves: MoveNote[];
  objective: string;
  howToPlay: string;
};

function train(
  hp: number,
  atk: number,
  def: number,
  spa: number,
  spd: number,
  spe: number,
  copy: { label: string; why: string; spend: string[] },
  alts?: SlotTrainingAlt[],
): SlotTraining {
  return { sp: { hp, atk, def, spa, spd, spe }, ...copy, alts };
}

function alt(
  name: string,
  hp: number,
  atk: number,
  def: number,
  spa: number,
  spd: number,
  spe: number,
  why: string,
  spend?: string[],
): SlotTrainingAlt {
  return { name, sp: { hp, atk, def, spa, spd, spe }, why, spend };
}

export type ManualBranch = {
  when: string;
  then: string;
  why?: string;
  /** Catalog slug of who is already in the slot. Groups the playbook. */
  out?: string;
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

export type ManualPlanBeat = {
  title: string;
  goal: string;
  play: string;
  next?: string;
};

export type FlowFork = {
  id: string;
  when: string;
  then?: string;
  move?: string;
  send?: string;
  out?: string;
  why?: string;
  forks?: FlowFork[];
};

export type ManualFlow = {
  id: string;
  title: string;
  lede?: string;
  forks: FlowFork[];
};

export type ManualFamilyLesson = {
  thesis: string;
  clockRule: string;
  commonFail: string;
};

export type ManualNote = {
  title: string;
  body: string;
};

export type ManualMatchup = {
  name: string;
  why: string;
};

export type ManualPilot = {
  thesis: string;
  rule: string;
  fail: string;
};

export type TeamManual = {
  id: string;
  title: string;
  lede: string;
  philosophy: string;
  archetype: ArchetypeId;
  /** Classroom shelf. Clock / kite / weather / terrain / room. */
  family?: ManualFamilyId;
  /** Replaces the shared family aside when present. */
  pilot?: ManualPilot;
  slugs: [string, string, string];
  meta: string;
  press?: string[];
  refuse?: string[];
  switches?: ManualSwitch[];
  plan?: ManualPlanBeat[];
  /** Verbs this three teaches. Learn deep-links here. */
  skills?: string[];
  relatedLessons?: string[];
  /** How this three spends 66 Stat Points. Replaces the generic dump. */
  setsNote?: string;
  victims?: ManualMatchup[];
  counters?: ManualMatchup[];
  advantages?: ManualNote[];
  slots: SlotManual[];
  phases: ManualPhase[];
  flows?: ManualFlow[];
  loops: { title: string; body: string }[];
  hazards: ManualNote[];
};

export function playLines(howToPlay: string) {
  return howToPlay
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

function branchToLeaf(phaseId: string, branch: ManualBranch, gi: number, bi: number): FlowFork {
  return {
    id: `${phaseId}-${branch.out ?? "field"}-${gi}-${bi}`,
    when: branch.when,
    then: branch.then,
    why: branch.why,
    out: branch.out,
  };
}

export function flowsFromPhases(phases: ManualPhase[]): ManualFlow[] {
  return phases
    .filter((p) => p.branches.some((b) => b.when || b.then))
    .map((phase) => {
      const live = phase.branches.filter((b) => b.when || b.then);
      const groups: { out?: string; items: ManualBranch[] }[] = [];
      for (const branch of live) {
        const last = groups[groups.length - 1];
        if (last && last.out === branch.out) last.items.push(branch);
        else groups.push({ out: branch.out, items: [branch] });
      }
      const wrap = groups.some((g) => g.out);
      const forks: FlowFork[] = wrap
        ? groups.map((g, gi) => ({
            id: `${phase.id}-${g.out ?? "field"}-${gi}`,
            when: g.out ? "This Pokémon is out" : "The slot",
            out: g.out,
            forks: g.items.map((b, bi) => branchToLeaf(phase.id, b, gi, bi)),
          }))
        : groups.flatMap((g, gi) => g.items.map((b, bi) => branchToLeaf(phase.id, b, gi, bi)));
      return { id: phase.id, title: phase.title, lede: phase.lede, forks };
    });
}

export function resolveFlows(manual: TeamManual): ManualFlow[] {
  const authored = (manual.flows ?? []).filter((f) => f.forks.length);
  return authored.length ? authored : flowsFromPhases(manual.phases);
}

export const MANUAL_PHASE_IDS = ["preview", "lead", "mid", "late"] as const;

export const MANUAL_FAMILY_IDS = ["clock", "kite", "weather", "terrain", "room"] as const;
export type ManualFamilyId = (typeof MANUAL_FAMILY_IDS)[number];
export const MANUAL_FAMILY_LABEL: Record<ManualFamilyId, string> = {
  clock: "Clock",
  kite: "Kite",
  weather: "Weather",
  terrain: "Terrain",
  room: "Room",
};

export const MANUAL_FAMILY_BLURB: Record<ManualFamilyId, string> = {
  clock: "Take Speed first. Tailwind or Fake Out, then hand the slot.",
  kite: "A late sweeper stays in the bag until Ice and Fairy are gone.",
  weather: "Rain or sun walks in with the setter. Overwrite is the funeral.",
  terrain: "The field is the engine. Terrain on entry, then Unburden or the Mega.",
  room: "Slow on purpose. Four turns, then you re-set or you race.",
};

export const FAMILY_LESSON: Record<ManualFamilyId, ManualFamilyLesson> = {
  clock: {
    thesis: "Take Speed before they dictate. The clock is a turn, then you leave.",
    clockRule: "Prankster Tailwind is +1. Fake Out is +3. You cannot Fake Out and Tailwind the same turn.",
    commonFail: "U-turn a 184 Speed Cott into the cleaner. Fast U-turn under Tailwind is Ice on Garchomp.",
  },
  kite: {
    thesis: "The sweeper stays in the bag until Ice and Fairy are gone.",
    clockRule: "Disguise or Multiscale is the free turn. Spend it on a Dance, not chip.",
    commonFail: "Leading the kite into Ice. Mold Breaker Drill ignores Multiscale.",
  },
  weather: {
    thesis: "The setter walks in and the field is already up. The other two cash it.",
    clockRule: "One field wins. Drought overwrite is a funeral. Swift Swim and Chlorophyll only count if the field is up.",
    commonFail: "Sitting the setter into the 4× (Electric on Pelipper, Rock on Y).",
  },
  terrain: {
    thesis: "Terrain on entry. Unburden after the seed. Hide the Mega until Ice is gone.",
    clockRule: "Fake Out, then U-turn into Grassy Seed. Armor Tail turns the engine off.",
    commonFail: "Clicking as if Unburden were 240 when the seed never popped.",
  },
  room: {
    thesis: "Slow on purpose. Four turns including the click, then re-set or race.",
    clockRule: "Armor Tail blanks Fake Out. Taunt on the setter is the refuse — Mental Herb eats one.",
    commonFail: "Sitting Kingambit in Fighting as if it were 4×. It is 1×. Gholdengo is the immune.",
  },
};

export function manualFamily(manual: Pick<TeamManual, "family" | "archetype">): ManualFamilyId {
  if (manual.family) return manual.family;
  switch (manual.archetype) {
    case "rain":
    case "sun":
      return "weather";
    case "grassy":
      return "terrain";
    case "trick-room":
      return "room";
    case "hyper-offense":
      return "kite";
    default:
      return "clock";
  }
}

export const CANONICAL_MANUALS: TeamManual[] = [
  {
    id: "balance-whimsicott-corviknight-garchomp",
    title: "Honest Balance: Whimsicott, Corviknight, Garchomp",
    lede: "Whimsicott sets Tailwind. Corviknight takes the hit. Garchomp knocks things out while Tailwind lasts.",
    philosophy:
      "You bring Whimsicott, Corviknight, and Garchomp. Whimsicott uses Prankster Tailwind so your whole three moves first for a few turns. Tailwind is priority +1. Fake Out is +3, so Fake Out still flinches Whimsicott first. After Tailwind, switch — do not U-turn, because Whimsicott is fast and they will hit whoever comes in. Corviknight takes the physical hit and Ice, Fairy, and Poison. Garchomp knocks things out while Tailwind is still up. Ice hits Garchomp four times as hard — send Corviknight.",
    archetype: "balance",
    family: "clock",
    pilot: {
      thesis: "Whimsicott sets Tailwind so your three moves first. Then you switch into Corviknight or Garchomp.",
      rule: "After Tailwind, switch. Do not U-turn. Fake Out still flinches Whimsicott first.",
      fail: "Sending Garchomp into Ice, or U-turning while Corviknight is faster than their Ice attack.",
    },
    slugs: ["whimsicott", "corviknight", "garchomp"],
    meta: "You have no Fire move. Brave Bird is the Grass answer. Tailwind lasts four turns including the click.",
    press: ["Physical leads", "Fighting", "Fairy into Corviknight", "Dragons once Tailwind is up"],
    refuse: ["Poison into Whimsicott", "Fire into Whimsicott or Corviknight", "U-turn into Ice", "Encore on Dark"],
    switches: [
      { into: "Ice", send: "Corviknight. Ice deals normal damage — it is not a resist. Garchomp takes Ice four times as hard." },
      { into: "Fairy", send: "Corviknight, or stay on Whimsicott — Fairy does nothing to Fairy." },
      { into: "Fire / Electric", send: "Garchomp. Fire deals double to Whimsicott and Corviknight. Garchomp ignores Electric." },
      { into: "Water", send: "Whimsicott or Corviknight. Both resist. Garchomp takes normal Water." },
      { into: "Poison", send: "Corviknight. Steel ignores Poison. Poison hits Whimsicott four times as hard." },
      { into: "Ground", send: "Corviknight. Flying ignores Ground." },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Put Tailwind up before they dictate Speed.",
        play: "Lead Whimsicott. Click Tailwind. Tailwind makes your whole three move first for a few turns. Prankster is +1, not +3 — Fake Out still flinches you first. Dark does not stop Tailwind. Encore and Taunt still fail on Dark.",
        next: "Switch out. Do not U-turn. U-turn attacks, then switches. Whimsicott is fast, so after Tailwind you moved first, then they hit whoever came in.",
      },
      {
        title: "Shield",
        goal: "Live the physical hit, Ice, Fairy, or Poison.",
        play: "Default: Corviknight comes in after Tailwind. Exception: if Whimsicott cannot live turn 1 — Poison four times as hard, Fire, Fake Out into a KO — send Corviknight first and Tailwind later.",
        next: "Absorb the hit. Slow U-turn into Garchomp only if you are slower than they are, or they switched. Fast U-turn under Tailwind delivers Ice onto Garchomp.",
      },
      {
        title: "Clean",
        goal: "Knock things out before Tailwind dies. Four turns including the click.",
        play: "Earthquake grounded non-Grass. Stone Edge or Dragon on Flying — not Rock Slide, not Earthquake into birds. Swords Dance if they Protect.",
        next: "Protect is a scout for Ice or Fairy, not a stall button. If Tailwind is dying, click the KO.",
      },
    ],
    skills: ["Tailwind", "U-turn", "Prankster"],
    relatedLessons: ["speed", "preview", "turns"],
    setsNote:
      "Each Pokémon spends 66 Stat Points. One point is +1 to that stat at Level 50. You may put at most 32 in a single stat. Whimsicott puts 32 in Speed and 32 in Special Attack because it sometimes has to Moonblast instead of Tailwind. Corviknight puts 32 in HP and 32 in Defense, and 0 in Speed, so U-turn happens after they already moved. Garchomp puts 32 in Attack and 0 in Speed because Tailwind already doubles Speed.",
    slots: [
      {
        slug: "whimsicott",
        title: "The Time-Bender",
        job: "speed",
        literacy: "setter",
        role: "Default lead. Tailwind, Encore, Moonblast, or leave.",
        ability: "Prankster",
        item: "Focus Sash",
        itemWhy: "You lead. Fake Out flinches. Sash keeps 1 HP. Tailwind is turn two. Matches the 2 HP spread.",
        itemAlts: [
          { name: "Covert Cloak", why: "Use when they have Incineroar. Fake Out does not flinch. Tailwind is turn one. You do not spend Sash. Use the Cloak bulk spread." },
          { name: "Mental Herb", why: "Use when they have Taunt. Taunt stops Prankster Tailwind. Herb eats the Taunt once so Tailwind still goes up. Keep the sash spread." },
          { name: "Fairy Feather", why: "Use when you need Moonblast to KO Dragon and Fighting. You are no longer sash — do not lead into Fake Out or Poison." },
        ],
        nature: "Timid",
        training: train(2, 0, 0, 32, 0, 32, {
          label: "Fast sash attacker",
          why: "Put 32 Speed so Moonblast still fires first if Tailwind is not the click. Put 32 Special Attack so that Moonblast KOs Fighting and Dragon. The leftover 2 goes in HP. Focus Sash already lets you live one hit — extra bulk would not save a second.",
          spend: [
            "32 Spe — you move first when you have to Moonblast instead of Tailwind.",
            "32 SpA — Moonblast into Fighting and Dragon. Tailwind does not need this; the sash games do.",
            "2 HP — leftover. Sash is the live. Prankster Tailwind already moves first, so these Speed points are for after you leave the setter seat.",
          ],
        }, [
          alt("Cloak bulk", 32, 0, 14, 0, 20, 0, "Use when Covert Cloak is the item. Fake Out does not flinch. Spend the cap on HP and the rest on defenses so you live the next hit and still click Tailwind. Moonblast is weaker — Corviknight and Garchomp KO.", [
            "32 HP — you are no longer sash. This is the stay.",
            "20 SpD / 14 Def — survive the hit after Fake Out fails.",
            "0 Spe — Prankster Tailwind already goes first. Do not spend Speed here.",
          ]),
        ]),
        moves: [
          { name: "Tailwind", why: "Hits your side — still works vs Dark. The click is turn one of four. Prankster +1 loses to Fake Out +3." },
          {
            name: "Encore",
            why: "Locks Protect or setup. Fails on Dark.",
            alts: [
              { name: "Substitute", why: "Use when they would KO you on the Encore turn. Sub first, then Tailwind behind it." },
              { name: "Thunder Wave", why: "Use when you need a lasting Speed drop after Tailwind dies. Prankster Thunder Wave fails on Dark. Ground ignores Electric — Stun Spore is the Ground para." },
            ],
          },
          { name: "Moonblast", why: "Fairy STAB into Fighting and Dragon. The click when Encore is illegal." },
          {
            name: "Taunt",
            why: "Shuts Trick Room. Fails on Dark.",
            alts: [
              { name: "Energy Ball", why: "Use when they have Pelipper or Archaludon. Garchomp Earthquake does nothing to Flying. Corviknight Brave Bird deals normal damage to Steel/Flying. This is the rain answer on Whimsicott." },
              { name: "Substitute", why: "Use when you already locked Encore and need the puppet more than the room shut." },
            ],
          },
        ],
        objective: "Win the Speed race or lock a waste, then get out.",
        howToPlay:
          "Lead unless Poison or Fire would KO you turn one — then Corviknight.\nTailwind if Corviknight or Garchomp need the race. Encore Protect or setup if not Dark. Moonblast Fighting and Dragon.\nAfter Tailwind, switch. Whimsicott U-turn is a fast pivot into their attack.",
      },
      {
        slug: "corviknight",
        title: "The Armor",
        job: "support",
        literacy: "pivot",
        role: "Default second send. Emergency lead if Whimsicott cannot live.",
        ability: "Mirror Armor",
        item: "Rocky Helmet",
        itemWhy: "The physical wall. Contact into U-turn, Brave Bird, and Body Press pays HP. You are the slow hand-off.",
        itemAlts: [
          { name: "Leftovers", why: "Use when you Roost and win the slot. Helmet is worse when they never make contact — special Ice, Gholdengo." },
          { name: "Occa Berry", why: "Use when you had to lead Corviknight into Fire and still need the slow U-turn. Fire deals double to Whimsicott and Corviknight. Garchomp is the Fire switch." },
          { name: "Sitrus Berry", why: "Use when the wall has to win 3v3, not hand off. One burst heal after Fake Out or Brave Bird recoil. Helmet chips them; Sitrus keeps you." },
        ],
        nature: "Impish",
        training: train(32, 0, 32, 0, 2, 0, {
          label: "Physical wall, slow on purpose",
          why: "Corviknight's job is to take a physical hit and hand off. Cap HP and Defense. Leave Speed at 0 so U-turn lets Garchomp come in after they already moved. If you are faster, they hit Garchomp on the way in — that is Ice on the cleaner.",
          spend: [
            "32 HP — the stay. You are the physical sponge.",
            "32 Def — Impish wall. Brave Bird and Body Press live.",
            "2 SpD — leftover crumb. Ice deals normal damage, not a resist; if special Ice is their click, use the swap.",
            "0 Spe — slow U-turn. Fast U-turn is Ice on Garchomp.",
          ],
        }, [
          alt("Special Ice", 32, 0, 20, 0, 14, 0, "Use when they click Ice Beam or Freeze-Dry, not physical Ice. Ice deals normal damage to Corviknight — it is not a resist. Pull 12 from Defense into Special Defense so you still hand off.", [
            "32 HP — still the stay.",
            "20 Def / 14 SpD — split the wall toward special Ice.",
            "0 Spe — still the slow hand-off.",
          ]),
        ]),
        moves: [
          { name: "U-turn", why: "If you outspeed, they hit whoever came in. Slow U-turn is the safe hand-off." },
          { name: "Brave Bird", why: "Grass answer. Recoil is real — do not farm it." },
          {
            name: "Roost",
            why: "Stay against a locked physical resist. The wall can win 3v3.",
            alts: [
              { name: "Bulk Up", why: "Use when you need Attack and Defense. Brave Bird becomes the Grass KO and Press still hurts." },
              { name: "Iron Defense", why: "Use only with Body Press. Two stages doubles Press. You are now the wincon — Garchomp can stay in the bag." },
              { name: "Taunt", why: "Use when they are Dark. Whimsicott's Taunt fails on Dark. Corviknight Taunt still works." },
            ],
          },
          {
            name: "Body Press",
            why: "Defense-based Fighting. Hits Dark. Kingambit takes normal Fighting — bulky Press still hurts, it is not four times as hard.",
            alts: [{ name: "Iron Head", why: "Use when Garchomp is already down and you need Steel into Fairy and Ice. Press is the Dark answer; Head is the Mimikyu answer." }],
          },
        ],
        objective: "Absorb Ice, Fairy, Fighting, Poison. Leave only when Garchomp wants in.",
        howToPlay:
          "Come in after Whimsicott's Tailwind, or lead if Whimsicott dies on send.\nMirror Armor bounces Intimidate — keep it vs Incineroar.\nNever U-turn into Garchomp while faster than Ice.",
      },
      {
        slug: "garchomp",
        title: "The Cleaner",
        job: "breaker",
        literacy: "sweeper",
        role: "Late KO. Hidden until the slot is safe.",
        ability: "Rough Skin",
        item: "Loaded Dice",
        itemWhy: "Scale Shot is the Speed plan if Whimsicott dies. Dice makes it hit five times. Tailwind is still how Garchomp moves first.",
        itemAlts: [
          { name: "Life Orb", why: "Use when you want a single-hit KO, not Speed stages. Dragon Claw over Scale Shot. Tailwind is still how Garchomp moves first — you do not need Dice if Whimsicott lives." },
          { name: "Roseli Berry", why: "Use when Corviknight is already down and you still have to send into Fairy. Fairy deals double. Corviknight is the Fairy switch." },
          { name: "Yache Berry", why: "Use when you must send Garchomp into Ice. Ice hits four times as hard. The berry is one live, not a resist. Preview Ice or do not send." },
          { name: "Clear Amulet", why: "Use when Incineroar is still in and Corviknight is gone. Intimidate would cut the Attack Tailwind paid for. Corviknight Mirror Armor already bounces Incineroar if Corviknight is alive." },
        ],
        nature: "Jolly",
        training: train(20, 32, 14, 0, 0, 0, {
          label: "Tailwind cleaner",
          why: "Tailwind already doubles your Speed. Put 32 in Attack. Leave Speed at 0 — under Tailwind you move first against almost everything. The rest keeps you alive on the swap-in. Spending 32 on Speed while Tailwind is up is wasted points.",
          spend: [
            "32 Atk — Earthquake and Scale Shot have to KO.",
            "20 HP / 14 Def — live the send after Whimsicott or Corviknight.",
            "0 Spe — Tailwind is the race. Loaded Dice Scale Shot is the backup Speed plan if Whimsicott dies.",
          ],
        }, [
          alt("Whimsicott died", 2, 32, 0, 0, 0, 32, "Use when Tailwind is gone. You win Speed yourself. Put 32 in Speed so Garchomp usually moves first against bulky Pokémon. You give up the stay.", [
            "32 Spe — this is the race when Tailwind is dead.",
            "32 Atk — still the punch.",
            "2 HP — leftover. You are glass now.",
          ]),
        ]),
        moves: [
          { name: "Earthquake", why: "One target. Does nothing to Flying or Levitate. Grass resists it." },
          {
            name: "Scale Shot or Dragon Claw",
            why: "Birds and Levitate. Scale Shot is backup Speed if Whimsicott dies.",
            alts: [{ name: "Outrage", why: "Use when Fairy is gone. You lock. A Fairy switch knocks Garchomp out." }],
          },
          {
            name: "Stone Edge",
            why: "Flying coverage. One target — not Rock Slide.",
            alts: [
              { name: "Fire Fang", why: "Use when Corviknight is down and you still need Fire into Steel or Bug. This three has no Fire STAB. Corviknight Brave Bird already answers Grass." },
              { name: "Rock Slide", why: "Do not. One target, one Stone Edge." },
            ],
          },
          {
            name: "Swords Dance",
            why: "The Protect branch. Do not slam the shield. Next hit is the KO.",
            alts: [{ name: "Protect", why: "Scout Ice or Fairy. Do not Protect on Tailwind's last turns when you need the KO." }],
          },
        ],
        objective: "Enter on a slow U-turn or a safe switch. Take KOs before Tailwind dies.",
        howToPlay:
          "Do not come in on Ice or Fairy. Water deals normal damage — not an emergency.\nCome in on Electric (immune), Fire (resists), or a slow U-turn.\nEarthquake if grounded and not Grass. Rock or Dragon if they fly.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "Default send is Whimsicott. Corviknight first is the emergency — not a second default.",
        branches: [
          { when: "Whimsicott lives the send", then: "Whimsicott. Tailwind, then switch. Not U-turn." },
          { when: "Whimsicott dies to the lead (Poison four times as hard, Fire, Fake Out into KO)", then: "Corviknight first. Tailwind later." },
          { when: "They outrun Garchomp", then: "Tailwind turn one. The race is the whole plan." },
          { when: "Protect or setup, not Dark", then: "Encore is legal. Tailwind can wait a turn." },
          { when: "Dark on the lead", then: "Tailwind or Moonblast. Encore and Taunt fail." },
          { when: "Fighting or Dragon lead", then: "Moonblast. Fairy STAB is the click before you leave." },
          { when: "Poison on their three", then: "Do not sit. Corviknight ignores Poison. Poison hits Whimsicott four times as hard." },
          { when: "Fire on their three", then: "Tailwind if sash lives, then Garchomp. Fire deals double to Whimsicott and Corviknight." },
          { when: "Ice on their three", then: "Tailwind, then Corviknight. Ice deals normal damage to Corviknight. Ice hits Garchomp four times as hard." },
          { when: "Grass / Rillaboom", then: "Tailwind, then Brave Bird. Do not Earthquake Grass." },
          { when: "Trick Room look", then: "Taunt the setter if not Dark. Then Tailwind or leave." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        lede: "Whimsicott is usually in the slot. Tailwind costs this turn. Then you switch — you do not U-turn.",
        branches: [
          { out: "whimsicott", when: "Corviknight or Garchomp need the race", then: "Tailwind. Then switch or one Moonblast." },
          { out: "whimsicott", when: "Tailwind is up", then: "Switch to Corviknight (Ice, Fairy, physical) or Garchomp (Fire, Electric). Not U-turn." },
          { out: "whimsicott", when: "They Protect or set up, not Dark", then: "Encore. Next turn Tailwind or leave." },
          { out: "whimsicott", when: "Dark in", then: "Moonblast or switch. Never Encore. Never Taunt." },
          { out: "whimsicott", when: "Fighting or Dragon in", then: "Moonblast. Then leave unless Tailwind is still the plan." },
          { out: "whimsicott", when: "Trick Room setter, not Dark", then: "Taunt. The room does not go up." },
          { out: "whimsicott", when: "Poison STAB coming", then: "Switch to Corviknight now. Four times as hard. Do not Tailwind into it." },
          { out: "whimsicott", when: "Fire STAB coming", then: "Switch to Garchomp. Corviknight also takes double Fire." },
          { out: "whimsicott", when: "Ice or Flying coming", then: "Switch to Corviknight. Both deal double to Whimsicott. Ice deals normal damage to Corviknight." },
          { out: "whimsicott", when: "Electric coming", then: "Stay or Tailwind. Grass resists. Garchomp is the later immune." },
          { out: "whimsicott", when: "Sash popped / they can KO", then: "Leave this turn. A dead Whimsicott leaves Garchomp without Tailwind." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Slow U-turn, stay on the wall, or send Whimsicott back to re-up Tailwind.",
        branches: [
          { out: "corviknight", when: "Had to lead Corviknight", then: "Take the hit. Slow U-turn later. Tailwind is still in the bag." },
          { out: "corviknight", when: "Locked into a physical resist, no KO this turn", then: "Stay. Roost, Press, or Iron Defense. The wall can win." },
          { out: "corviknight", when: "Want Garchomp, and you are slower or they switched", then: "U-turn. They hit Corviknight, then Garchomp is in." },
          { out: "corviknight", when: "Want Garchomp, but you outspeed Ice", then: "Do not U-turn. Fast U-turn delivers Ice into Garchomp." },
          { out: "corviknight", when: "Grass in", then: "Brave Bird. Recoil is the tax. Do not farm." },
          { out: "corviknight", when: "Fire or Electric onto Corviknight", then: "Garchomp. Resists Fire. Immune to Electric." },
          { out: "garchomp", when: "Ice or Fairy onto Garchomp", then: "Corviknight. Fairy resists. Ice deals normal damage — Roost after." },
          { out: "garchomp", when: "Water onto Garchomp", then: "Optional Whimsicott or Corviknight (both resist). Garchomp takes normal Water." },
          { out: "whimsicott", when: "Tailwind dying, still need Speed", then: "Whimsicott back in. Re-up before it fades." },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "One target. No spread fantasy.",
        branches: [
          { out: "garchomp", when: "Grounded, not Grass", then: "Earthquake. Take the KO." },
          { out: "garchomp", when: "Flying or Levitate", then: "Stone Edge or Dragon STAB. Earthquake does nothing." },
          { out: "garchomp", when: "You read Protect", then: "Swords Dance. Next hit is the KO." },
          { out: "garchomp", when: "Need to scout Ice or Fairy", then: "Protect. Not on Tailwind's last turns." },
          { out: "garchomp", when: "Fairy is gone, you need the nuke", then: "Outrage. You lock. Do not click it into Fairy." },
          { out: "garchomp", when: "Ice or Fairy still in", then: "Corviknight if alive. Else you donated Ice four times as hard, or Fairy double." },
          { out: "garchomp", when: "Whimsicott dead, they still outrun", then: "Scale Shot. Coverage that KOs after they move." },
          { out: "corviknight", when: "Grass still up", then: "Brave Bird. Do not send Garchomp to Earthquake it." },
        ],
      },
    ],
    loops: [
      { title: "Slow U-turn", body: "Corviknight takes the hit, then leaves. Fast U-turn under Tailwind delivers Garchomp into Ice." },
      { title: "Encore then Dance", body: "Lock Protect. Next turn Garchomp Swords Dance. Dark blanks the first half." },
      { title: "Tailwind timer", body: "Four turns including the click. On turn three, re-up, Scale Shot, or close." },
    ],
    victims: [
      { name: "Fighting", why: "Whimsicott Moonblast. Fairy hits Fighting for super-effective damage." },
      { name: "Physical leads", why: "Corviknight takes the hit. Rocky Helmet chips contact. Slow U-turn after." },
      { name: "Dragon once Tailwind is up", why: "Whimsicott Moonblast, or Garchomp Earthquake and Dragon while they move last." },
    ],
    counters: [
      { name: "Poison into Whimsicott", why: "Poison hits Fairy four times as hard. Send Corviknight. Steel ignores Poison." },
      { name: "Fire into Whimsicott or Corviknight", why: "Fire deals double to both. Send Garchomp. Garchomp resists Fire." },
      { name: "Ice after a fast U-turn", why: "If Corviknight is faster than their Ice, U-turn puts Garchomp in, then Ice hits four times as hard. Switch instead." },
      { name: "Fake Out into sash-less Whimsicott", why: "Fake Out is +3. Tailwind is +1. Without Focus Sash, the flinch plus the next hit can KO. Lead Corviknight, or keep Sash." },
    ],
    advantages: [
      { title: "Whimsicott vs Fighting", body: "Moonblast is super-effective Fairy. This is a lead you want after Tailwind, or instead of it." },
      { title: "Corviknight vs physical leads", body: "High Defense, Mirror Armor, Rocky Helmet. Take the hit. Hand off slow." },
      { title: "Corviknight vs Poison", body: "Steel ignores Poison. Whimsicott dies to it. This is why Corviknight is the emergency lead." },
      { title: "Garchomp under Tailwind", body: "Tailwind already doubles Speed. Earthquake and Stone Edge KO while they still move last." },
      { title: "Garchomp vs Electric", body: "Ground ignores Electric. Fire also deals half. These are the safe sends." },
    ],
    hazards: [
      { title: "Prankster is not Fake Out", body: "Tailwind is +1. Fake Out is +3. They still flinch you, then you Tailwind next turn if you live." },
      { title: "Whimsicott U-turn is not free", body: "Whimsicott is fast. After Tailwind you are even faster. They hit whoever came in. Switch instead." },
      { title: "Ice is not a Corviknight resist", body: "Flying/Steel takes normal Ice. Special Ice still chunks. Roost. Do not sit." },
      { title: "Fast U-turn into Ice", body: "Damage, then switch, then they attack. If Corviknight is faster, Ice hits Garchomp four times as hard." },
      { title: "Prankster vs Dark", body: "Encore, Taunt, and Thunder Wave fail. Tailwind and Moonblast do not. Corviknight Taunt still works on Dark." },
      { title: "No Fire STAB", body: "Grass wants Brave Bird. Earthquake into Grass is a gift." },
      { title: "Poison into Whimsicott", body: "Four times as hard. Corviknight ignores it. Emergency lead." },
      { title: "Outrage lock", body: "A Fairy switch knocks Garchomp out. Dragon Claw or Scale Shot if Fairy is still in the bag." },
    ],
  },
  {
    id: "balance-corviknight-primarina-garchomp",
    title: "Patch Balance: Corviknight, Primarina, Garchomp",
    lede: "Corviknight takes the physical hit. Primarina resists Ice and Fire, then Moonblast. Garchomp knocks things out. You have no Tailwind.",
    philosophy:
      "You bring Corviknight, Primarina, and Garchomp. Corviknight takes the physical hit, then U-turn. U-turn deals damage, then switches. Leave Speed at 0 on Corviknight so they already moved before whoever comes in. Primarina resists Ice and Fire. Moonblast hits Dragon and Fighting. Ice Beam hits their Garchomp four times as hard. Garchomp knocks things out. You have no Tailwind, so put 32 Speed on Garchomp. Never lead Garchomp into Ice. Send Primarina.",
    archetype: "balance",
    family: "clock",
    pilot: {
      thesis: "Corviknight soaks the physical hit. Primarina patches Ice, Fire, Dragon, and Fighting. Garchomp finishes.",
      rule: "You have no Tailwind. Put 32 Speed on Garchomp. Slow U-turn only. Ice onto Garchomp: send Primarina.",
      fail: "Leading Garchomp into Ice, or U-turning while Corviknight is faster than their Ice attack.",
    },
    slugs: ["corviknight", "primarina", "garchomp"],
    meta: "Garchomp and Primarina sit at the top of ranked singles. Corviknight is the physical U-turn next to both. Sitrus Primarina stays. Garchomp spends Speed because nobody doubles it.",
    press: ["Physical leads", "Fighting", "Dragon", "Fire into Primarina", "Their Garchomp"],
    refuse: ["Ice into Garchomp", "Electric into Corviknight or Primarina", "Grass into Primarina", "Poison into Primarina"],
    switches: [
      { into: "Ice", send: "Primarina. Water/Fairy resists Ice. Corviknight takes normal Ice. Never Garchomp — Ice hits it four times as hard." },
      { into: "Fire", send: "Primarina. Water resists Fire. Corviknight takes double. Garchomp resists Fire if Primarina is down." },
      { into: "Electric", send: "Garchomp. Ground ignores Electric. Corviknight and Primarina both take double." },
      { into: "Fairy", send: "Corviknight. Steel resists Fairy. Garchomp takes double. Primarina is Fairy — stay if you already won the slot." },
      { into: "Dragon", send: "Primarina. Fairy ignores Dragon. Moonblast is super-effective." },
      { into: "Fighting", send: "Primarina Moonblast, or Corviknight Body Press. Both resist Fighting." },
      { into: "Poison", send: "Corviknight. Steel ignores Poison. Primarina takes double." },
      { into: "Grass", send: "Corviknight Brave Bird. Primarina takes double. Garchomp Earthquake is resisted." },
      { into: "Ground", send: "Corviknight. Flying ignores Ground." },
      { into: "Water", send: "Primarina or Corviknight. Both resist. Garchomp takes normal Water." },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Win the first slot without Tailwind.",
        play: "Lead Corviknight into physical, Grass, or Poison. Lead Primarina into Ice, Fire, Dragon, or Fighting. Lead Garchomp only into Electric — both partners take double Electric. Never lead Garchomp into Ice.",
        next: "Corviknight U-turn is slow on purpose. Primarina Moonblast or Ice Beam, then stay or leave. Garchomp comes in after they already moved.",
      },
      {
        title: "Shield",
        goal: "Live Ice, Fire, Fairy, and Poison. Hand off slow.",
        play: "Ice onto Garchomp: Primarina. Fire onto Corviknight: Primarina. Fairy onto Garchomp: Corviknight. Poison onto Primarina: Corviknight. Electric onto either wall: Garchomp. Grass onto Primarina: Corviknight Brave Bird.",
        next: "If Corviknight is faster than their Ice, do not U-turn into Garchomp. Switch, or U-turn into Primarina. Primarina resists Ice.",
      },
      {
        title: "Clean",
        goal: "Garchomp knocks things out while it still moves first.",
        play: "Earthquake grounded non-Grass. Stone Edge or Dragon on Flying. Ice Beam from Primarina if their Garchomp or Dragonite is the leftover. Swords Dance if they Protect.",
        next: "Outrage locks Garchomp. A Fairy switch knocks it out. Primarina Moonblast is the Fairy click. Aqua Jet is the only priority on this three.",
      },
    ],
    skills: ["U-turn", "Ice Beam", "Roost"],
    relatedLessons: ["preview", "types", "turns"],
    setsNote:
      "Each Pokémon spends 66 Stat Points. One point is +1 to that stat at Level 50. You may put at most 32 in a single stat. Corviknight puts 32 in HP and 32 in Defense, and 0 in Speed, so U-turn happens after they already moved. Primarina puts 32 in HP and the rest in Defense and Special Attack because Sitrus is the stay — Moonblast still has to hit. Garchomp puts 32 in Attack and 32 in Speed because nothing on this three doubles Speed.",
    slots: [
      {
        slug: "corviknight",
        title: "The Armor",
        job: "support",
        literacy: "pivot",
        role: "Default physical lead. Slow U-turn. Emergency Poison and Grass switch.",
        ability: "Mirror Armor",
        item: "Rocky Helmet",
        itemWhy: "The physical wall. Contact into U-turn, Brave Bird, and Body Press pays HP. You are the slow hand-off.",
        itemAlts: [
          { name: "Leftovers", why: "Use when you Roost and win the slot. Helmet is worse when they never make contact — special Ice, Gholdengo." },
          { name: "Occa Berry", why: "Use when you had to lead Corviknight into Fire and still need the slow U-turn. Prefer switching to Primarina — Water resists Fire." },
          { name: "Sitrus Berry", why: "Use when the wall has to win 3v3, not hand off. One burst heal after Fake Out or Brave Bird recoil." },
        ],
        nature: "Impish",
        training: train(32, 0, 32, 0, 2, 0, {
          label: "Physical wall, slow on purpose",
          why: "Corviknight's job is to take a physical hit and hand off. Cap HP and Defense. Leave Speed at 0 so U-turn lets Garchomp or Primarina come in after they already moved. If you are faster than their Ice, U-turn puts Garchomp in, then Ice hits four times as hard — send Primarina instead.",
          spend: [
            "32 HP — the stay. You are the physical sponge.",
            "32 Def — Impish wall. Brave Bird and Body Press live.",
            "2 SpD — leftover crumb. Ice deals normal damage, not a resist.",
            "0 Spe — slow U-turn. Fast U-turn is Ice on Garchomp.",
          ],
        }, [
          alt("Special Ice", 32, 0, 20, 0, 14, 0, "Use when they click Ice Beam, not physical Ice, and Primarina is already down. Ice deals normal damage to Corviknight. Pull Defense into Special Defense so you still hand off.", [
            "32 HP — still the stay.",
            "20 Def / 14 SpD — split the wall toward special Ice.",
            "0 Spe — still the slow hand-off.",
          ]),
        ]),
        moves: [
          { name: "U-turn", why: "If you outspeed, they hit whoever came in. Slow U-turn is the safe hand-off into Garchomp or Primarina." },
          { name: "Brave Bird", why: "Grass answer. Primarina takes double Grass. Recoil is real — do not farm it." },
          {
            name: "Roost",
            why: "Stay against a locked physical resist. The wall can win 3v3.",
            alts: [
              { name: "Bulk Up", why: "Use when you need Attack and Defense. Brave Bird becomes the Grass KO and Press still hurts." },
              { name: "Iron Defense", why: "Use only with Body Press. Two stages doubles Press. You are now the wincon — Garchomp can stay in the bag." },
              { name: "Taunt", why: "Use when they are Dark, or they want to Roost and set up. Taunt still works on Dark." },
            ],
          },
          {
            name: "Body Press",
            why: "Defense-based Fighting. Hits Dark. Kingambit takes normal Fighting — bulky Press still hurts.",
            alts: [{ name: "Iron Head", why: "Use when Garchomp is already down and you need Steel into Fairy and Ice. Press is the Dark answer; Head is the Mimikyu answer." }],
          },
        ],
        objective: "Absorb physical, Fairy, Poison, Grass. Leave Fire and Electric.",
        howToPlay:
          "Lead vs physical, Grass, or Poison. Steel ignores Poison. Flying ignores Ground.\nFire and Electric deal double — leave to Primarina (Fire) or Garchomp (Electric).\nNever U-turn into Garchomp while faster than Ice. Primarina resists Ice. Switch there instead.",
      },
      {
        slug: "primarina",
        title: "The Patch",
        job: "breaker",
        literacy: "wallbreaker",
        role: "Ice, Fire, Dragon, Fighting lead. Special stay. Ice Beam their Garchomp.",
        ability: "Torrent",
        item: "Sitrus Berry",
        itemWhy: "You stay. Calm Mind or Encore, then Moonblast or Sparkling Aria. Sitrus is one burst heal after the first hit. Leftovers is slower. Choice Specs does not sit.",
        itemAlts: [
          { name: "Leftovers", why: "Use when you Roost the slot with Calm Mind and they cannot KO. Slower heal than Sitrus. Same stay spread." },
          { name: "Choice Specs", why: "Use when the wall is special-bulky and one locked click has to KO. You cannot sit. Use the Specs race spread. Do not lock Moonblast into Steel." },
          { name: "Mystic Water", why: "Use when Choice would donate into a Steel and you still want stronger Water. You can still Ice Beam and Moonblast." },
          { name: "Lum Berry", why: "Use when they have Will-O-Wisp or Thunder Wave. Burn cuts Sparkling Aria. Lum clears it once." },
        ],
        nature: "Modest",
        training: train(32, 0, 20, 14, 0, 0, {
          label: "Sitrus stay",
          why: "Primarina is slow. Put 32 HP so Sitrus keeps you in the slot. Put Defense next so physical leftovers do not KO. Special Attack gets 14 — Calm Mind supplies the rest, or Moonblast still chips. Leave Speed at 0. Garchomp is the race.",
          spend: [
            "32 HP — the stay. Sitrus is the live.",
            "20 Def — live a physical hit after they fail to KO.",
            "14 SpA — Moonblast and Ice Beam still hurt. Calm Mind is the rest.",
            "0 Spe — you are not racing. Garchomp is.",
          ],
        }, [
          alt("Choice Specs", 2, 0, 0, 32, 0, 32, "Use when you lock one click and that click has to KO. Cap Special Attack. Cap Speed so Modest still moves first against bulky Pokémon. Leftover 2 in HP. Do not sit.", [
            "32 SpA — Moonblast or Sparkling Aria has to break the wall.",
            "32 Spe — Modest does not boost Speed. These points are the whole race on Primarina.",
            "2 HP — leftover. Choice does not sit.",
          ]),
        ]),
        moves: [
          { name: "Moonblast", why: "Fairy STAB. Dragon and Fighting. Fairy ignores Dragon — you can lead that." },
          {
            name: "Sparkling Aria",
            why: "Water STAB. Hits Fire and Ground. Heals a burn on the target — Incineroar Will-O-Wisp on Garchomp is the reason.",
            alts: [
              { name: "Surf", why: "Use when you want the stronger Water and do not need the burn heal. Same type. One target in singles." },
              { name: "Hydro Pump", why: "Do not on the stay set. Miss donates the slot. Specs already commits; Surf is safer." },
            ],
          },
          {
            name: "Ice Beam",
            why: "Hits their Garchomp four times as hard. Hits Dragonite and Salamence. This is how you punish Ice weak dragons without sending your Garchomp.",
            alts: [{ name: "Psychic", why: "Use when Poison is the hole. Primarina takes double Poison. Psychic hits Poison. Corviknight is still the Poison switch." }],
          },
          {
            name: "Aqua Jet",
            why: "Water priority. The only priority on this three. Revenge Fire after they move. Kingambit resists Water — Earthquake that.",
            alts: [
              { name: "Encore", why: "Use when they Protect or set up. Lock the waste, then Calm Mind or Moonblast. You are no longer packing priority." },
              { name: "Calm Mind", why: "Use when the stay is real. Boost, then Moonblast. You give up Aqua Jet." },
              { name: "Flip Turn", why: "Use when you want a Water pivot into Garchomp. They hit Primarina, then Garchomp is in — only if you are slower or they switched." },
            ],
          },
        ],
        objective: "Lead into Ice, Fire, Dragon, Fighting. Ice Beam their Garchomp. Leave Electric, Grass, Poison.",
        howToPlay:
          "Lead vs Ice, Fire, Dragon, or Fighting. Fairy ignores Dragon. Water resists Ice and Fire.\nElectric, Grass, Poison deal double. Electric to Garchomp. Grass to Corviknight Brave Bird. Poison to Corviknight.\nIce Beam their Garchomp. Do not send your Garchomp into Ice.\nChoice Specs: do not Moonblast a Steel that wanted Sparkling Aria.",
      },
      {
        slug: "garchomp",
        title: "The Cleaner",
        job: "breaker",
        literacy: "sweeper",
        role: "Late KO. 32 Speed because nothing doubles it. Hidden from Ice.",
        ability: "Rough Skin",
        item: "Life Orb",
        itemWhy: "You have no Tailwind. The hit has to KO. Life Orb matches 32 Attack. Recoil is the tax.",
        itemAlts: [
          { name: "Loaded Dice", why: "Use when they outrun this Garchomp and you need Scale Shot to hit five times. Tailwind is not here. Dice is the backup Speed plan." },
          { name: "Yache Berry", why: "Use when you must send Garchomp into Ice. Ice hits four times as hard. The berry is one live, not a resist. Prefer Primarina." },
          { name: "Choice Scarf", why: "Use when their Garchomp also put 32 in Speed and you must move first. You lock. Do not Swords Dance in the scarf." },
          { name: "Clear Amulet", why: "Use when Incineroar is still in and Corviknight is gone. Intimidate would cut the Attack. Corviknight Mirror Armor already bounces Incineroar if Corviknight is alive." },
          { name: "Garchompite Z", why: "Do not on this three. Mega Garchomp is slower than base Garchomp. You have no Tailwind. Keep the 32 Speed." },
        ],
        nature: "Jolly",
        training: train(2, 32, 0, 0, 0, 32, {
          label: "No-clock cleaner",
          why: "Put 32 Speed so Garchomp usually moves first against bulky Pokémon. You still lose to a Garchomp that also put 32 in Speed — when you see that Garchomp, do not try to outrun it after they Swords Dance; send Primarina Ice Beam. Put 32 Attack so Earthquake and Stone Edge KO. Leftover 2 in HP.",
          spend: [
            "32 Spe — you have no Tailwind. This is the race against bulky Pokémon. Do not race a Speed-capped Garchomp after it Dances.",
            "32 Atk — Earthquake and Stone Edge have to KO.",
            "2 HP — leftover. Life Orb is the punch. Bulk does not save Ice.",
          ],
        }, [
          alt("They are slow", 20, 32, 14, 0, 0, 0, "Use when their lead is Kingambit or Trick Room and you already move first. Move Speed into HP and Defense so Life Orb is not the only live.", [
            "32 Atk — still Earthquake the truck.",
            "20 HP / 14 Def — sit a hit if they are slower.",
            "0 Spe — you already outspeed Kingambit.",
          ]),
        ]),
        moves: [
          { name: "Earthquake", why: "One target. Does nothing to Flying or Levitate. Grass resists it. Corviknight Brave Bird is the Grass click." },
          {
            name: "Scale Shot or Dragon Claw",
            why: "Birds and Levitate. Scale Shot is backup Speed if they outrun you.",
            alts: [{ name: "Outrage", why: "Use when Fairy is gone. You lock. A Fairy switch knocks Garchomp out. Primarina Moonblast is the Fairy click." }],
          },
          {
            name: "Stone Edge",
            why: "Flying coverage. One target — not Rock Slide.",
            alts: [
              { name: "Fire Fang", why: "Use when Corviknight is down and you still need Fire into Steel or Bug. Primarina Sparkling Aria already answers Fire-weak if Primarina lives." },
              { name: "Rock Slide", why: "Do not. One target, one Stone Edge." },
            ],
          },
          {
            name: "Swords Dance",
            why: "The Protect branch. Do not slam the shield. Next hit is the KO.",
            alts: [{ name: "Protect", why: "Scout Ice or Fairy. Ice: leave to Primarina. Fairy: leave to Corviknight." }],
          },
        ],
        objective: "Enter on a slow U-turn or Electric. Take KOs. Never the Ice lead.",
        howToPlay:
          "Do not come in on Ice or Fairy. Water deals normal damage — not an emergency.\nCome in on Electric (immune), Fire (resists), or a slow U-turn.\nEarthquake if grounded and not Grass. Rock or Dragon if they fly.\nTheir Garchomp: Primarina Ice Beam. Do not Speed-tie into Outrage.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "Name Corviknight or Primarina. Garchomp stays in the bag unless the lead is Electric.",
        branches: [
          { when: "Physical, Grass, or Poison", then: "Corviknight. Rocky Helmet. Steel ignores Poison. Brave Bird Grass." },
          { when: "Ice, Fire, Dragon, or Fighting", then: "Primarina. Water resists Ice and Fire. Fairy ignores Dragon. Moonblast Fighting." },
          { when: "Electric", then: "Garchomp. Ground ignores Electric. Both partners take double." },
          { when: "Ice still healthy", then: "Keep Garchomp back. Primarina resists Ice. Corviknight takes normal Ice." },
          { when: "Their Garchomp", then: "Primarina Ice Beam. Ice hits Garchomp four times as hard." },
          { when: "Fairy on their three", then: "Corviknight. Steel resists. Do not Outrage Garchomp into it." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        lede: "Corviknight or Primarina. Garchomp is here only for Electric.",
        branches: [
          { out: "corviknight", when: "Physical coming", then: "Stay. Take the hit. Rocky Helmet chips contact." },
          { out: "corviknight", when: "Grass in", then: "Brave Bird. Recoil is the tax. Do not farm." },
          { out: "corviknight", when: "Poison coming", then: "Stay. Steel ignores Poison." },
          { out: "corviknight", when: "Fire coming", then: "Leave to Primarina. You take double Fire." },
          { out: "corviknight", when: "Electric coming", then: "Leave to Garchomp. You take double Electric." },
          { out: "corviknight", when: "Want Garchomp, and you are slower or they switched", then: "U-turn. They hit Corviknight, then Garchomp is in." },
          { out: "corviknight", when: "Want Garchomp, but you outspeed Ice", then: "Do not U-turn into Garchomp. Switch to Primarina. Ice is resisted there." },
          { out: "primarina", when: "Ice, Fire, or Dragon", then: "Stay. Resist Ice and Fire. Ignore Dragon. Moonblast or Ice Beam." },
          { out: "primarina", when: "Fighting in", then: "Moonblast. Fairy is super-effective." },
          { out: "primarina", when: "Their Garchomp", then: "Ice Beam. Four times as hard." },
          { out: "primarina", when: "Electric, Grass, or Poison coming", then: "Leave. Double. Electric to Garchomp. Grass or Poison to Corviknight." },
          { out: "garchomp", when: "Electric in", then: "Stay. Ground ignores it. Earthquake if they are grounded." },
          { out: "garchomp", when: "Ice or Fairy coming", then: "You mis-led. Primarina for Ice. Corviknight for Fairy." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Slow U-turn. Ice goes to Primarina. Electric goes to Garchomp.",
        branches: [
          { out: "corviknight", when: "Locked into a physical resist, no KO this turn", then: "Stay. Roost, Press, or Iron Defense. The wall can win." },
          { out: "corviknight", when: "Fire onto Corviknight", then: "Primarina. Water resists Fire." },
          { out: "corviknight", when: "Electric onto Corviknight", then: "Garchomp. Immune." },
          { out: "primarina", when: "Electric onto Primarina", then: "Garchomp. Immune." },
          { out: "primarina", when: "Grass or Poison onto Primarina", then: "Corviknight. Brave Bird Grass. Steel ignores Poison." },
          { out: "primarina", when: "Physical wall sitting on Primarina", then: "Calm Mind if Sitrus, or U-turn Corviknight, or Garchomp if Ice is gone." },
          { out: "garchomp", when: "Ice onto Garchomp", then: "Primarina. Resists Ice." },
          { out: "garchomp", when: "Fairy onto Garchomp", then: "Corviknight. Steel resists Fairy." },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "One target. Ice Beam their dragon. Earthquake the rest.",
        branches: [
          { out: "garchomp", when: "Grounded, not Grass", then: "Earthquake. Take the KO." },
          { out: "garchomp", when: "Flying or Levitate", then: "Stone Edge or Dragon STAB. Earthquake does nothing." },
          { out: "garchomp", when: "You read Protect", then: "Swords Dance. Next hit is the KO." },
          { out: "garchomp", when: "Ice still in", then: "Primarina if alive. Else you donated four times Ice." },
          { out: "garchomp", when: "Fairy still in", then: "Corviknight if alive. Else do not Outrage." },
          { out: "garchomp", when: "They still outrun", then: "Scale Shot, or leave to Primarina Aqua Jet if Fire." },
          { out: "primarina", when: "Their Garchomp or Dragonite still up", then: "Ice Beam. Ice hits Garchomp four times as hard." },
          { out: "primarina", when: "Torrent live, one of theirs left", then: "Sparkling Aria or Moonblast. Aqua Jet if they would move first." },
          { out: "corviknight", when: "Grass still up", then: "Brave Bird. Do not send Garchomp to Earthquake it." },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Preview their three. One send. Garchomp never walks in first unless the lead is Electric.",
        forks: [
          {
            id: "p-lead-corvi",
            when: "Physical, Grass, or Poison",
            then: "Lead Corviknight. Rocky Helmet. Steel ignores Poison. Brave Bird Grass.",
            send: "corviknight",
            forks: [
              {
                id: "p-lead-corvi-phys",
                when: "Physical coming",
                then: "Stay. Take the hit. Rocky Helmet chips contact.",
                send: "corviknight",
              },
              {
                id: "p-lead-corvi-grass",
                when: "Grass in",
                then: "Brave Bird. Recoil is the tax.",
                move: "Brave Bird",
                send: "corviknight",
              },
              {
                id: "p-lead-corvi-fire",
                when: "Fire coming",
                then: "Leave to Primarina. You take double Fire.",
                send: "primarina",
              },
              {
                id: "p-lead-corvi-elec",
                when: "Electric coming",
                then: "Leave to Garchomp. You take double Electric.",
                send: "garchomp",
              },
              {
                id: "p-lead-corvi-uturn",
                when: "Want Garchomp, and you are slower or they switched",
                then: "U-turn. They hit Corviknight, then Garchomp is in.",
                move: "U-turn",
                send: "garchomp",
              },
              {
                id: "p-lead-corvi-ice",
                when: "Want Garchomp, but you outspeed Ice",
                then: "Do not U-turn into Garchomp. Switch to Primarina.",
                send: "primarina",
                why: "Ice hits Garchomp four times as hard. Primarina resists Ice.",
              },
            ],
          },
          {
            id: "p-lead-prima",
            when: "Ice, Fire, Dragon, or Fighting",
            then: "Lead Primarina. Water resists Ice and Fire. Fairy ignores Dragon. Moonblast Fighting.",
            send: "primarina",
            forks: [
              {
                id: "p-lead-prima-ice",
                when: "Ice or their Garchomp",
                then: "Ice Beam. Four times as hard on Garchomp. Resisted Ice on you.",
                move: "Ice Beam",
                send: "primarina",
              },
              {
                id: "p-lead-prima-moon",
                when: "Dragon or Fighting",
                then: "Moonblast. You are immune to Dragon.",
                move: "Moonblast",
                send: "primarina",
              },
              {
                id: "p-lead-prima-fire",
                when: "Fire in",
                then: "Sparkling Aria. Water is super-effective.",
                move: "Sparkling Aria",
                send: "primarina",
              },
              {
                id: "p-lead-prima-elec",
                when: "Electric coming",
                then: "Leave to Garchomp. You take double Electric.",
                send: "garchomp",
              },
              {
                id: "p-lead-prima-leave",
                when: "Grass or Poison coming",
                then: "Leave to Corviknight. Brave Bird Grass. Steel ignores Poison.",
                send: "corviknight",
              },
            ],
          },
          {
            id: "p-lead-chomp",
            when: "Electric",
            then: "Lead Garchomp. Ground ignores Electric. Both partners take double.",
            send: "garchomp",
            why: "This is the only Garchomp lead. Ice and Fairy still hide it.",
            forks: [
              {
                id: "p-lead-chomp-eq",
                when: "They are grounded",
                then: "Earthquake.",
                move: "Earthquake",
                send: "garchomp",
              },
              {
                id: "p-lead-chomp-ice",
                when: "Ice or Fairy coming",
                then: "Leave. Primarina for Ice. Corviknight for Fairy.",
                send: "primarina",
              },
            ],
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Slow U-turn. Ice to Primarina. Electric to Garchomp. Do not donate the cleaner.",
        forks: [
          {
            id: "p-mid-corvi",
            when: "This Pokémon is out",
            out: "corviknight",
            forks: [
              {
                id: "p-mid-corvi-stay",
                when: "Locked into a physical resist, no KO this turn",
                then: "Stay. Roost, Press, or Iron Defense.",
                move: "Roost",
                send: "corviknight",
              },
              {
                id: "p-mid-corvi-fire",
                when: "Fire onto Corviknight",
                then: "Primarina. Water resists Fire.",
                send: "primarina",
              },
              {
                id: "p-mid-corvi-elec",
                when: "Electric onto Corviknight",
                then: "Garchomp. Immune.",
                send: "garchomp",
              },
            ],
          },
          {
            id: "p-mid-prima",
            when: "This Pokémon is out",
            out: "primarina",
            forks: [
              {
                id: "p-mid-prima-elec",
                when: "Electric onto Primarina",
                then: "Garchomp. Immune.",
                send: "garchomp",
              },
              {
                id: "p-mid-prima-grass",
                when: "Grass or Poison onto Primarina",
                then: "Corviknight. Brave Bird Grass. Steel ignores Poison.",
                send: "corviknight",
              },
              {
                id: "p-mid-prima-wall",
                when: "Physical wall sitting on Primarina",
                then: "Calm Mind if Sitrus, or leave to Garchomp if Ice is gone.",
                move: "Calm Mind",
                send: "primarina",
              },
            ],
          },
          {
            id: "p-mid-chomp",
            when: "This Pokémon is out",
            out: "garchomp",
            forks: [
              {
                id: "p-mid-chomp-ice",
                when: "Ice onto Garchomp",
                then: "Primarina. Resists Ice.",
                send: "primarina",
                why: "You mis-sent if this is a full Ice Beam.",
              },
              {
                id: "p-mid-chomp-fairy",
                when: "Fairy onto Garchomp",
                then: "Corviknight. Iron Head or stay. Steel resists Fairy.",
                send: "corviknight",
              },
            ],
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Ice Beam their dragon. Earthquake the rest. Aqua Jet is the only priority.",
        forks: [
          {
            id: "p-late-chomp",
            when: "This Pokémon is out",
            out: "garchomp",
            forks: [
              {
                id: "p-late-chomp-eq",
                when: "Grounded, not Grass",
                then: "Earthquake. Take the KO.",
                move: "Earthquake",
                send: "garchomp",
              },
              {
                id: "p-late-chomp-fly",
                when: "Flying or Levitate",
                then: "Stone Edge or Dragon STAB. Earthquake does nothing.",
                move: "Stone Edge",
                send: "garchomp",
              },
              {
                id: "p-late-chomp-protect",
                when: "You read Protect",
                then: "Swords Dance. Next hit is the KO.",
                move: "Swords Dance",
                send: "garchomp",
              },
              {
                id: "p-late-chomp-ice",
                when: "Ice still in",
                then: "Primarina if alive. Else you donated four times Ice.",
                send: "primarina",
              },
              {
                id: "p-late-chomp-fairy",
                when: "Fairy still in",
                then: "Corviknight if alive. Else do not Outrage.",
                send: "corviknight",
              },
              {
                id: "p-late-chomp-slow",
                when: "They still outrun",
                then: "Scale Shot, or leave to Primarina Aqua Jet if Fire.",
                move: "Scale Shot",
                send: "garchomp",
              },
            ],
          },
          {
            id: "p-late-prima",
            when: "This Pokémon is out",
            out: "primarina",
            forks: [
              {
                id: "p-late-prima-ice",
                when: "Their Garchomp or Dragonite still up",
                then: "Ice Beam.",
                move: "Ice Beam",
                send: "primarina",
              },
              {
                id: "p-late-prima-jet",
                when: "Torrent live, they would move first",
                then: "Aqua Jet if Fire. Moonblast if Dragon or Fighting.",
                move: "Aqua Jet",
                send: "primarina",
              },
            ],
          },
          {
            id: "p-late-corvi",
            when: "This Pokémon is out",
            out: "corviknight",
            forks: [
              {
                id: "p-late-corvi-grass",
                when: "Grass still up",
                then: "Brave Bird. Do not send Garchomp to Earthquake it.",
                move: "Brave Bird",
                send: "corviknight",
              },
            ],
          },
        ],
      },
    ],
    loops: [
      { title: "Slow U-turn", body: "Corviknight takes the hit, then leaves. Fast U-turn under a Speed tie delivers Garchomp into Ice. Primarina resists Ice — switch there." },
      { title: "Sitrus stay", body: "Primarina lives the first hit. Encore Protect, or Calm Mind, then Moonblast or Ice Beam. Specs does not get this loop." },
      { title: "Ice Beam their Garchomp", body: "Do not send your Garchomp into theirs. Primarina Ice Beam hits four times as hard. Then Garchomp cleans what is left." },
    ],
    victims: [
      { name: "Physical leads", why: "Corviknight takes the hit. Rocky Helmet chips contact. Slow U-turn after." },
      { name: "Fighting", why: "Primarina Moonblast. Fairy hits Fighting for super-effective damage. Corviknight also resists." },
      { name: "Dragon", why: "Primarina Moonblast. Fairy ignores Dragon." },
      { name: "Fire", why: "Primarina Sparkling Aria. Water hits Fire. Corviknight cannot sit this." },
      { name: "Their Garchomp", why: "Primarina Ice Beam. Ice hits Garchomp four times as hard." },
    ],
    counters: [
      { name: "Ice into Garchomp", why: "Ice hits four times as hard. Send Primarina. Corviknight takes normal Ice. Never stay." },
      { name: "Electric into Corviknight or Primarina", why: "Both take double. Send Garchomp. Ground ignores Electric." },
      { name: "Grass into Primarina", why: "Grass deals double. Send Corviknight Brave Bird. Garchomp Earthquake is resisted." },
      { name: "Poison into Primarina", why: "Poison deals double. Send Corviknight. Steel ignores Poison." },
      { name: "A Speed-capped Garchomp after Swords Dance", why: "Your Garchomp does not win that race. Ice Beam from Primarina. Do not Outrage into the mirror." },
    ],
    advantages: [
      { title: "Primarina vs Ice", body: "Water/Fairy resists Ice. This is why Garchomp can exist on the three. Lead this into Ice." },
      { title: "Primarina vs Dragon", body: "Fairy ignores Dragon. Moonblast is super-effective. You can lead this." },
      { title: "Primarina vs their Garchomp", body: "Ice Beam is four times as hard. Do not send your Garchomp." },
      { title: "Corviknight vs physical leads", body: "High Defense, Mirror Armor, Rocky Helmet. Take the hit. Hand off slow." },
      { title: "Corviknight vs Poison", body: "Steel ignores Poison. Primarina dies to it. This is why Corviknight is the Poison lead." },
      { title: "Garchomp vs Electric", body: "Ground ignores Electric. Both partners take double. This is the only Garchomp lead." },
    ],
    hazards: [
      { title: "No Tailwind", body: "Nobody doubles Speed. Put 32 Speed on Garchomp. Primarina Aqua Jet is the only priority. A faster Garchomp after Swords Dance outruns you — Ice Beam it." },
      { title: "Ice into Garchomp", body: "Ice hits four times as hard. Primarina resists. Corviknight takes normal Ice. Keep Garchomp in the bag until Ice is gone or chunked." },
      { title: "Electric into the walls", body: "Corviknight and Primarina both take double Electric. Switch to Garchomp immediately." },
      { title: "Grass into Primarina", body: "Double. Brave Bird from Corviknight. Do not Earthquake Grass." },
      { title: "Poison into Primarina", body: "Double. Corviknight ignores it. Emergency switch." },
      { title: "Fast U-turn into Ice", body: "If Corviknight is faster than their Ice, U-turn puts Garchomp in, then Ice hits four times as hard. Switch to Primarina instead." },
      { title: "Choice lock", body: "Do not Specs-Moonblast a Steel that wanted Sparkling Aria, and vice versa. Sitrus is the default because you stay." },
      { title: "Outrage lock", body: "A Fairy switch knocks Garchomp out. Primarina Moonblast or Corviknight Iron Head if Fairy is still in the bag." },
      { title: "Mega Garchomp", body: "Mega Garchomp is slower than base Garchomp. This three has no Tailwind. Keep 32 Speed. Do not slot Garchompite Z." },
    ],
  },
  {
    id: "balance-whimsicott-incineroar-garchomp",
    title: "Control Balance: Whimsicott, Incineroar, Garchomp",
    lede: "Flinch, drop, hand the baton. You cannot Fake Out and Tailwind the same turn.",
    philosophy:
      "Stranglehold, not a wall. You traded Corvi's U-turn for Intimidate, Fake Out, Fire STAB, and Parting Shot. Parting Shot is −6: they hit the cat, then Garchomp is in. Champions cut Knock Off — the fourth slot is Taunt, Will-O-Wisp, or Snarl.",
    archetype: "balance",
    family: "clock",
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
    plan: [
      {
        title: "Clock",
        goal: "Flinch, drop, then clock",
        play: "Lead Incineroar. Fake Out, Intimidate. You cannot Fake Out and Tailwind the same turn. If the cat dies on send, Cott is the backup clock.",
        next: "Parting Shot is −6: they hit the cat, then Garchomp is in. Do not stay to farm Flare Blitz unless Grass is the KO you need.",
      },
      {
        title: "Shield",
        goal: "Live Fighting, Fairy, and the Ice you traded Corvi for",
        play: "Fighting is 2× on the cat — Cott or Garchomp take that slot. Fairy is 2× on cat and Chomp. Moonblast is the answer. Ice goes to Incineroar.",
        next: "Ghost Fake Out, Cloak, and Gholdengo blank the cat’s tricks. Snarl remains.",
      },
      {
        title: "Clean",
        goal: "Garchomp after the drop and the clock",
        play: "Earthquake grounded non-Grass. Stone Edge or Dragon on Flying. Swords Dance if they Protect.",
        next: "If Tailwind is not up and they still outrun Chomp, you needed the clock. Do not clean on hope.",
      },
    ],
    skills: ["Fake Out", "Intimidate", "Parting Shot"],
    relatedLessons: ["moves", "abilities", "turns"],
    slots: [
      {
        slug: "whimsicott",
        title: "The Accelerator",
        job: "speed",
        literacy: "setter",
        role: "Clock and trap. Fake Out is the backup if Cott dies.",
        ability: "Prankster",
        item: "Focus Sash",
        itemWhy: "The cat already Fake Outs. Cott is the backup clock. Sash lives the send you should not have taken.",
        itemAlts: [
          { name: "Covert Cloak", why: "If Cott leads into Fake Out. Tailwind the same turn. Use the Cloak bulk spread." },
        ],
        nature: "Timid",
        training: train(2, 0, 0, 32, 0, 32, {
          label: "Fast sash attacker",
          why: "Same sash pattern as Honest: cap Speed and Special Attack, leftover 2 in HP. You are not the Fake Out — Incineroar is. These Speed points are so Moonblast still wins Fighting if you have to click it instead of clocking.",
          spend: [
            "32 Spe — 184 Timid. Moonblast before the format if Tailwind is not the click.",
            "32 SpA — Fighting (Incineroar's hole) and Dragon.",
            "2 HP — leftover. Sash is the live.",
          ],
        }, [
          alt("Cloak bulk", 32, 0, 14, 0, 20, 0, "If Incineroar always leads, Cott clocks after the flinch. Spend the cap on HP so you live turn two. Moonblast is weaker — the cat and Garchomp KO.", [
            "32 HP — the stay after Fake Out fails to flinch you.",
            "20 SpD / 14 Def — live the next hit, then Tailwind.",
            "0 Spe — Prankster already moves first.",
          ]),
        ]),
        moves: [
          { name: "Tailwind", why: "Whole turn in singles. Still works vs Dark." },
          { name: "Encore", why: "Locks Protect or setup. Fails on Dark. Not the same turn as Fake Out — one send." },
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
        item: "Rocky Helmet",
        itemWhy: "Fake Out is contact. They pay for the flinch, then Parting Shot. Helmet is the stay.",
        itemAlts: [
          { name: "Sitrus Berry", why: "If they never make contact — special Grass, Snarl wars. One heal, then leave." },
          { name: "Safety Goggles", why: "Rillaboom Spore tables. Fake Out still functions. Powder does not." },
        ],
        nature: "Careful",
        training: train(32, 4, 10, 0, 20, 0, {
          label: "Flinch, then live the −6",
          why: "Fake Out is +3 priority — Speed points do not make it faster. Cap HP. Careful boosts Special Defense so you live special chip and still click Parting Shot. A crumb in Attack is enough for Fake Out; Flare Blitz KOs come from base 115, not from a second cap.",
          spend: [
            "32 HP — Parting Shot has to happen. 0 HP is −0, not −6.",
            "20 SpD — Careful wall. Snarl wars and special Grass.",
            "10 Def / 4 Atk — leftover. Fake Out chip, not a sweeper Attack cap.",
            "0 Spe — Fake Out already moves first. Do not race.",
          ],
        }, [
          alt("Blitz KOs", 20, 32, 0, 0, 0, 14, "If Grass and Kingambit die this send. Cap Attack, keep a little Speed so you leave after the KO. Do not sit on Water or Fighting — those are still not your slot.", [
            "32 Atk — Flare Blitz has to KO.",
            "20 HP — recoil plus Helmet contact.",
            "14 Spe — enough to leave after the KO. Careful still drops Speed — this is not a race.",
          ]),
        ]),
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
        item: "Life Orb",
        itemWhy: "Tailwind is optional. You need the KO on the −6 send. Orb is the punch.",
        itemAlts: [
          { name: "Loaded Dice", why: "If Cott always clocks. Scale Shot is extra Speed you do not need. Dice is then just damage." },
          { name: "Yache Berry", why: "Ice on the table. One live. Fire from the cat is the real Ice answer." },
        ],
        nature: "Jolly",
        training: train(2, 32, 0, 0, 0, 32, {
          label: "Self-sufficient cleaner",
          why: "Tailwind is optional on this three. Cap Attack and Speed so you still clean if Cott died and Fake Out is spent. Jolly 32 Spe is 169 — the usual Champions race. Leftover 2 in HP. Glass is the cost of not needing the clock.",
          spend: [
            "32 Spe — 169 Jolly. Outruns uninvested 90s and most of the format without Tailwind.",
            "32 Atk — the KO on the −6 send.",
            "2 HP — leftover. Life Orb already spends HP; bulk is not this slot.",
          ],
        }, [
          alt("Clock always up", 20, 32, 14, 0, 0, 0, "If Cott leads every game, Tailwind is already the Speed. Move the 32 Speed points into HP and Defense so you live the swap-in.", [
            "32 Atk — still the punch.",
            "20 HP / 14 Def — the stay under Tailwind.",
            "0 Spe — the clock is the race.",
          ]),
        ]),
        moves: [
          { name: "Earthquake", why: "One target. Grass is Incineroar's job." },
          { name: "Scale Shot or Dragon Claw", why: "Birds. Backup Speed if Cott is dead and Fake Out is spent." },
          { name: "Stone Edge", why: "Flying coverage." },
          { name: "Swords Dance", why: "Protect branch." },
        ],
        objective: "Stay back until Intimidate or Tailwind has bought the slot.",
        howToPlay:
          "Come in on Parting Shot, Electric, Fighting, or Rock.\nDo not come in on Ice, Fairy, or Dragon. Water is 1× on Garchomp.\nEQ grounded non-Grass. Dance on Protect.",
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
        lede: "Whoever you sent is in the slot. Fake Out and Tailwind are never the same turn.",
        branches: [
          { out: "incineroar", when: "They can KO or set up", then: "Fake Out. Next is Parting Shot or Blitz." },
          { out: "incineroar", when: "Ghost in", then: "Snarl, Will-O-Wisp, or Parting Shot. Never Fake Out." },
          { out: "incineroar", when: "Cloak / Inner Focus", then: "Expect their attack. Parting Shot before KO range." },
          { out: "incineroar", when: "Dark setup or Protect", then: "Taunt. Cott Encore is illegal on Dark." },
          { out: "incineroar", when: "Physical still hitting", then: "Will-O-Wisp, then Parting Shot. Burn plus Intimidate plus −6." },
          { out: "incineroar", when: "Grass or Steel, Blitz KOs", then: "Fake Out if needed, then Blitz. Be aggressive." },
          { out: "whimsicott", when: "Garchomp needs the race", then: "Tailwind. Fake Out already happened or waits." },
          { out: "whimsicott", when: "Protect or setup, not Dark", then: "Encore. Fake Out later." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { out: "incineroar", when: "Slot safe after Intimidate", then: "Parting Shot into Garchomp." },
          { out: "incineroar", when: "Blitz KO is there", then: "Stay. Take it. Pivot next send." },
          { out: "incineroar", when: "Water, Ground, Fighting, or Rock threaten", then: "Leave before KO. −6 does not save 0 HP." },
          { out: "incineroar", when: "Ice onto predicted Garchomp", then: "Stay. Fire resists Ice. Garchomp is 4×." },
          { out: "incineroar", when: "Gholdengo in", then: "Snarl. Fake Out is Normal. Taunt, burn, and Parting Shot fail on Good as Gold." },
          { out: "incineroar", when: "Mirror Armor Corvi", then: "Intimidate bounces. Fake Out and Fire still work." },
          { out: "incineroar", when: "Fake Out spent, slot still ugly", then: "Leave and come back. Refresh." },
          { out: "whimsicott", when: "Fairy in", then: "Moonblast. Do not Parting Shot Garchomp into Fairy." },
          { out: "garchomp", when: "Fairy onto Garchomp", then: "Cott. Both cat and Chomp are 2× Fairy." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { out: "garchomp", when: "Grounded, not Grass", then: "Earthquake. One target." },
          { out: "garchomp", when: "Flying or Levitate", then: "Rock or Dragon STAB." },
          { out: "garchomp", when: "Protect", then: "Swords Dance." },
          { out: "garchomp", when: "Ice onto Garchomp", then: "Cat. Fire resists." },
          { out: "garchomp", when: "Fairy onto Garchomp", then: "Cott. Moonblast." },
          { out: "incineroar", when: "Grass still in", then: "Flare Blitz if the cat lives. Do not EQ." },
          { out: "incineroar", when: "Cott dead, they still outrun", then: "Fake Out refresh or Scale Shot." },
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
    family: "terrain",
    slugs: ["rillaboom", "sneasler", "salamence-mega"],
    meta: "Garchomp and Kingambit cores. Terrain cuts Earthquake. Armor Tail turns the engine off.",
    press: ["Garchomp / EQ", "Incineroar (Close Combat is 2×)", "Tailwind Cott (Fake Out is +3)", "Setup"],
    refuse: ["Fire into Rillaboom", "Ice / Rock into the Mega", "Psychic / Flying into Sneasler", "Armor Tail / Psychic Terrain"],
    switches: [
      { into: "Ice", send: "Rillaboom" },
      { into: "Fire", send: "Mega Salamence" },
      { into: "Fairy", send: "Sneasler Dire Claw" },
      { into: "Electric", send: "Rillaboom" },
      { into: "Rock", send: "Sneasler" },
      { into: "Ground", send: "Mega (immune) or Rillaboom" },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Terrain on entry, then the Seed",
        play: "Fake Out, then U-turn into Grassy Seed. Unburden doubles Speed after the item is gone. One Fake Out per turn.",
        next: "Armor Tail and Psychic Terrain turn the engine off. Then you are three attackers with no field.",
      },
      {
        title: "Shield",
        goal: "Hide the Mega until Ice is gone",
        play: "Rillaboom takes Ice. Mega takes Fire. Sneasler Dire Claw is the Fairy. Do not send Aerilate into Ice or Rock.",
        next: "Cups that won still hid the Mega. Extreme Speed is the revenge, not the lead.",
      },
      {
        title: "Clean",
        goal: "Aerilate once Ice is spent. Unburden if the Seed popped",
        play: "Double-Edge is Flying STAB. Terrain cuts Earthquake — do not click Ground as if it were 1×. Sneasler Close Combat the cat.",
        next: "If the Seed never popped, do not click as if you were 240 Speed.",
      },
    ],
    skills: ["Fake Out", "Unburden", "Grassy Surge"],
    relatedLessons: ["abilities", "speed", "preview"],
    slots: [
      {
        slug: "rillaboom",
        title: "The Room",
        job: "support",
        literacy: "setter",
        role: "Terrain on entry. Flinch, Glide, or deliver the Seed.",
        ability: "Grassy Surge",
        item: "Miracle Seed",
        itemWhy: "STAB on Glide and Wood Hammer. U-turn stays legal. Vest would lock you in the slot.",
        itemAlts: [
          { name: "Assault Vest", why: "If you drop U-turn. Special chip on the setter. You are no longer the Seed delivery." },
        ],
        nature: "Adamant",
        training: train(20, 32, 14, 0, 0, 0, {
          label: "Priority setter, slow hand-off",
          why: "Grassy Glide is +1 priority in terrain — Speed points do not make it faster. Cap Attack. Put the rest in HP and Defense so Fake Out into U-turn still delivers a live Sneasler. Stay slower than what is in so U-turn is a slow hand-off.",
          spend: [
            "32 Atk — Glide and Wood Hammer have to KO.",
            "20 HP / 14 Def — live Fake Out contact, then U-turn.",
            "0 Spe — Glide is the race. Slow U-turn so the Seed pops on Sneasler, not into their attack.",
          ],
        }, [
          alt("Terrain down", 2, 32, 0, 0, 0, 32, "Armor Tail or Psychic Terrain turns Glide off. You have to win Speed yourself. Adamant 32 Spe is 137 — Wood Hammer still moves before uninvested 90s.", [
            "32 Spe — 137 Adamant. Glide is illegal; this is raw Speed.",
            "32 Atk — Wood Hammer is now the click.",
            "2 HP — leftover.",
          ]),
        ]),
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
        itemWhy: "The Unburden item. Terrain pops it, Speed doubles. No Seed, no burst.",
        itemAlts: [
          { name: "Focus Sash", why: "Fire lead, Boom cannot appear, terrain never goes up. You play 120 raw with the No Seed spread." },
        ],
        nature: "Jolly",
        training: train(20, 32, 0, 0, 0, 14, {
          label: "Unburden burst",
          why: "The Seed doubles Speed when terrain pops it. You do not need a Speed cap — Jolly 14 Spe is 169, then Unburden makes that 338. Cap Attack. Put the rest in HP so you live the send. If terrain never goes up, 14 Spe is still a real number; the No Seed swap is the full race.",
          spend: [
            "32 Atk — Close Combat and Dire Claw have to KO while you are doubled.",
            "20 HP — live the swap-in so Unburden actually happens.",
            "14 Spe — 169 Jolly before the Seed. Backup if terrain is late. After Unburden you outrun everything.",
          ],
        }, [
          alt("No Seed", 2, 32, 0, 0, 0, 32, "Fire lead, Boom cannot appear, or Armor Tail. You play 120 raw Speed. Jolly 32 Spe is 189 — the format's top race without Unburden.", [
            "32 Spe — 189 Jolly. No double. This is the meta Speed cap.",
            "32 Atk — still the punch.",
            "2 HP — leftover. Sash if you held it.",
          ]),
        ]),
        moves: [
          { name: "Dire Claw", why: "Poison into Fairy. Can poison, para, or sleep. Steel laughs — that is Boom or the Mega." },
          { name: "Close Combat", why: "Incineroar is 2×. Kingambit is 1× Dark/Steel — Unburden still punches, it is not 4×. Defense drops; no White Herb." },
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
        itemWhy: "The Mega. Aerilate does not exist until you click it. One stone. No swap.",
        nature: "Adamant",
        training: train(2, 32, 0, 0, 0, 32, {
          label: "Fast Aerilate sweeper",
          why: "The usual glass pattern: cap Attack and Speed, leftover 2 in HP. Adamant 32 Spe is 172 before Dragon Dance. Bulk does not save 4× Ice — hide until Ice is gone, then Mega. You cannot cap both Attack and Special Attack; pick Double-Edge.",
          spend: [
            "32 Spe — 172 Adamant. Outruns uninvested 100s before Dance.",
            "32 Atk — Aerilate Double-Edge is the KO.",
            "2 HP — leftover. 4× Ice still KOs through HP.",
          ],
        }, [
          alt("Hyper Voice", 2, 0, 0, 32, 0, 32, "Special cup line. Switch to Modest. Cap Special Attack instead. You cannot run both 32 Atk and 32 SpA on 66 points.", [
            "32 Spe — still the race. Modest, so Speed is not nature-boosted — the 32 Spe is the whole race.",
            "32 SpA — Hyper Voice.",
            "2 HP — leftover.",
          ]),
        ]),
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
          { when: "Kingambit or Incineroar", then: "Fake Out, then Close Combat. Incineroar is 2×. Kingambit is 1× Dark/Steel." },
          { when: "Whimsicott Tailwind three", then: "Fake Out the Cott (+3 vs +1). Terrain cuts EQ." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        lede: "Boom is the usual first send. The Mega is almost never in this slot yet.",
        branches: [
          { out: "rillaboom", when: "They KO / set up / Tailwind", then: "Fake Out. Next is U-turn or Glide." },
          { out: "rillaboom", when: "Ghost in", then: "U-turn or Wood Hammer. Fake Out is Normal." },
          { out: "rillaboom", when: "Glide KO is there", then: "Glide. Be aggressive." },
          { out: "rillaboom", when: "Want Sneasler in", then: "U-turn only if slower, they switched, or not Flying/Psychic." },
          { out: "sneasler", when: "Had to lead (Fire on Boom)", then: "Play 120 Speed. No Seed yet. Leave to Mega into Fire." },
          { out: "salamence-mega", when: "Clean Mega lead (Fire)", then: "Intimidate happened. Mega. Double-Edge." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { out: "sneasler", when: "Entered on terrain with Seed", then: "Dire Claw Fairy/Ghost. Close Combat Dark/Steel. Spend it." },
          { out: "sneasler", when: "Psychic or Flying onto Sneasler", then: "Leave. Boom takes Psychic. Mega takes Flying." },
          { out: "sneasler", when: "Unburden spent, Ice gone", then: "Mega. Intimidate, Mega, Double-Edge." },
          { out: "rillaboom", when: "Fire onto Boom", then: "Mega Salamence. Dragon resists Fire." },
          { out: "rillaboom", when: "Gholdengo / Steel on Dire Claw", then: "Wood Hammer. Steel laughs at Poison." },
          { out: "rillaboom", when: "Armor Tail still in", then: "Stop Fake Out and Glide. Wood Hammer raw." },
          { out: "salamence-mega", when: "Ice onto the Mega", then: "Rillaboom. 4× Ice is the hole." },
          { out: "salamence-mega", when: "Rock onto the Mega", then: "Sneasler. Fighting resists Rock." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { out: "salamence-mega", when: "Not Steel, Ice already gone", then: "Double-Edge. One target." },
          { out: "salamence-mega", when: "Steel or Fire resists Flying", then: "Earthquake if terrain is down. Dragon Claw if it is up — terrain cuts Ground." },
          { out: "salamence-mega", when: "Protect", then: "Dragon Dance. Do not recoil the shield." },
          { out: "salamence-mega", when: "Ice or Fairy onto Mega", then: "Ice → Boom. Fairy → Dire Claw." },
          { out: "sneasler", when: "Boom dead, terrain down, Seed still held", then: "Seed will not pop. Play 120. Mega is Speed." },
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
    family: "weather",
    slugs: ["pelipper", "archaludon", "basculegion-male"],
    meta: "Fire cores and Charizard Y. Pack the Electric switch (Archaludon) and respect Grass.",
    press: ["Fire / Mega Charizard Y", "Dragons (Hurricane)", "Sun if you keep rain"],
    refuse: ["Electric into Pelipper", "Grass into the Waters", "Drought overwrite", "Trick Room", "Kingambit (Hurricane and Wave Crash are ½ — no Fighting STAB)"],
    switches: [
      { into: "Electric", send: "Archaludon" },
      { into: "Grass", send: "Archaludon (Steel/Dragon resists)" },
      { into: "Fire", send: "Anyone — rain cuts Fire" },
      { into: "Rock into Pelipper", send: "Archaludon or Basculegion" },
      { into: "Dragon", send: "Pelipper or Basculegion" },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Drizzle walks in. The field is already wet",
        play: "Lead Pelipper unless Electric is the send. Hurricane never misses. Damp Rock is eight turns, not five.",
        next: "If Drought overwrites you, Electro Shot charges and Swift Swim dies. KO Y or re-set.",
      },
      {
        title: "Shield",
        goal: "Archaludon is the Electric and Grass switch",
        play: "Pelipper is 4× Electric. Both Waters are 2× Grass. The railgun is ¼ Grass and resists Electric. Do not Roost on the Thunderbolt.",
        next: "Kingambit walls Hurricane and Wave Crash. You have no Fighting STAB. Do not sit that 1v1.",
      },
      {
        title: "Clean",
        goal: "Electro Shot the same turn. Swift Swim closes",
        play: "Archaludon charges in rain. Basculegion Wave Crash under Swift Swim. Aqua Jet if rain dies.",
        next: "Wave Crash plus Life Orb will KO you. Take the KO. Do not farm.",
      },
    ],
    skills: ["Drizzle", "Electro Shot", "Swift Swim"],
    relatedLessons: ["abilities", "speed", "holes"],
    slots: [
      {
        slug: "pelipper",
        title: "The Cloud",
        job: "weather",
        literacy: "setter",
        role: "Drizzle on entry. Hurricane never misses in rain.",
        ability: "Drizzle",
        item: "Damp Rock",
        itemWhy: "Rain is the three. Eight turns, not five. Archaludon and Basculegion cash the extra.",
        itemAlts: [
          { name: "Focus Sash", why: "Fast Electric on the table. You gift one Thunderbolt and still Hurricane. Use the Sash spread." },
        ],
        nature: "Modest",
        training: train(20, 0, 0, 32, 0, 14, {
          label: "Damp Rock setter",
          why: "Drizzle is on entry — you do not spend points to set rain. Cap Special Attack so Hurricane and Weather Ball chip. A little Speed so U-turn happens before uninvested walls. Do not dump the rest into HP to 'tank Electric' — Pelipper is 4× Electric. Leave.",
          spend: [
            "32 SpA — Hurricane / Weather Ball. Modest. This is the chip.",
            "20 HP — live a resisted hit, then Roost or U-turn.",
            "14 Spe — 99 Modest. U-turn before some uninvested walls. Pelipper is not Swift Swim; rain does not make you faster.",
          ],
        }, [
          alt("Sash", 2, 0, 0, 32, 0, 32, "Focus Sash into fast Electric. You gift one Thunderbolt and still Hurricane. Cap Speed so you fire before the next one. 32 Spe is 117 Modest — rain does not add Speed to Pelipper.", [
            "32 Spe — 117 Modest. You move, then sash, then fire.",
            "32 SpA — still the chip.",
            "2 HP — leftover. Sash is the live.",
          ]),
        ]),
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
        item: "Life Orb",
        itemWhy: "Protect is in the kit — Vest is illegal with it. Orb is the Electro Shot punch while rain is up.",
        itemAlts: [
          { name: "Assault Vest", why: "Drop Protect. Stamina plus Vest is the stay. Use the Vest stay spread." },
          { name: "White Herb", why: "Draco Meteor is the fourth click. Herb eats the SpA drop. Shot still fires." },
        ],
        nature: "Modest",
        training: train(20, 0, 0, 32, 0, 14, {
          label: "Rain railgun",
          why: "Electro Shot in rain has no charge and boosts Special Attack as it fires. Cap Special Attack anyway — the +1 is on top of the cap, not instead of it. A little Speed so you fire before uninvested 85s. Life Orb is the punch. If you swap to Assault Vest, use the stay spread — Vest cannot hold Protect.",
          spend: [
            "32 SpA — Electro Shot is the hole-punch.",
            "20 HP — live Grass or Electric on the way in.",
            "14 Spe — 119 Modest. Fire before uninvested 85s. Stamina bulk is the Vest swap, not this spread.",
          ],
        }, [
          alt("Vest stay", 32, 0, 14, 20, 0, 0, "Drop Protect. You already outspeed enough if they hit you — Stamina plus Vest is the stay. Pull Speed into HP and Defense. 20 SpA still nukes because Shot's +1 is the rest.", [
            "32 HP / 14 Def — Stamina scales Defense when they hit you.",
            "20 SpA — Shot's +1 Special Attack covers the missing 12.",
            "0 Spe — they hit you first; you get Stamina, then you fire.",
          ]),
        ]),
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
        item: "Life Orb",
        itemWhy: "Wave Crash closer. Orb is the KO. Recoil plus Orb will KO you — take the KO, do not farm.",
        itemAlts: [
          { name: "Choice Band", why: "If you drop Flip Turn. Locked Wave Crash. Stronger, no pivot." },
        ],
        nature: "Adamant",
        training: train(24, 32, 10, 0, 0, 0, {
          label: "Swift Swim closer",
          why: "Rain doubles your Speed. Adamant with 0 Spe is already 98 — under Swift Swim that is 196. Putting 32 in Speed while rain is up is wasted. Cap Attack. Put the rest in HP and Defense so Wave Crash plus Life Orb does not KO you before they faint. Aqua Jet is the race if rain dies.",
          spend: [
            "32 Atk — Wave Crash and Last Respects have to KO.",
            "24 HP / 10 Def — recoil plus Orb. Take the KO; do not farm.",
            "0 Spe — Swift Swim is the race. 32 Spe here does nothing extra in rain.",
          ],
        }, [
          alt("Rain stolen", 2, 32, 0, 0, 0, 32, "Drought on the table. Swim is dead. Cap Speed so Last Respects and Aqua Jet still function. Adamant 32 Spe is 130 without rain — you are no longer the closer, you are revenge.", [
            "32 Spe — 130 Adamant. The race without Swim.",
            "32 Atk — still the punch.",
            "2 HP — leftover.",
          ]),
        ]),
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
          { when: "Kingambit", then: "Chip with Electro Shot (1×). Hurricane and Wave Crash are ½ on Dark/Steel. You have no Fighting STAB — do not assume 2×." },
          { when: "Trick Room look", then: "You are the fast three. Taunt is not here. Play to KO the setter or lose the clock." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        lede: "Pelipper is the usual send — rain is already up. Electro Shot is not a charge.",
        branches: [
          { out: "pelipper", when: "Rain just went up", then: "Hurricane or Weather Ball. U-turn if Archaludon wants the next click." },
          { out: "pelipper", when: "Electric in", then: "Leave now. Archaludon. Pelipper is 4× Electric." },
          { out: "pelipper", when: "Grass in", then: "Leave to Archaludon. Both Waters are 2× Grass." },
          { out: "archaludon", when: "Rain is up", then: "Electro Shot. It fires this turn." },
          { out: "archaludon", when: "Sun went up", then: "You lost the engine. Draco or leave. Electro Shot charges again." },
          { out: "basculegion-male", when: "Had to lead Basc", then: "Only if rain is already up. Else you are a slow Water." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { out: "archaludon", when: "Rain up, Archaludon healthy", then: "Electro Shot until they bring a Ground or a vest that sits." },
          { out: "pelipper", when: "Electric onto Pelipper", then: "Archaludon." },
          { out: "pelipper", when: "Grass onto Waters", then: "Archaludon. Steel/Dragon resists Grass." },
          { out: "pelipper", when: "Drought Mega comes in", then: "If you move first, KO it. If not, rain is gone — Basc is no longer Swift Swim." },
          { out: "basculegion-male", when: "Partner already fainted", then: "Last Respects. That is the closer." },
          { out: "basculegion-male", when: "Rain fading, still need a KO", then: "Aqua Jet or Wave Crash while it lasts. Damp Rock bought you this turn." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { out: "basculegion-male", when: "Rain up, they are grounded", then: "Wave Crash. One target." },
          { out: "archaludon", when: "Rain up, they sit on Water", then: "Electro Shot. One target." },
          { out: "basculegion-male", when: "They Protect", then: "Do not recoil Wave Crash. Aqua Jet or wait." },
          { out: "basculegion-male", when: "Rain gone", then: "Aqua Jet or Last Respects. Do not pretend Swift Swim is up." },
          { out: "archaludon", when: "Electric still in", then: "Stay. Both Waters die to Electric." },
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
    family: "room",
    slugs: ["farigiraf", "kingambit", "gholdengo"],
    meta: "Fake Out balance and Tailwind HO. Taunt on the setter is the preview you respect.",
    press: ["Fake Out cores", "Tailwind HO", "Sneasler Unburden", "Priority spam"],
    refuse: ["Taunt the setter", "Sitting Kingambit in Fighting (1×, not a resist — Gholdengo is immune)", "Fire / Ground into Gholdengo", "A faster Trick Room"],
    switches: [
      { into: "Fake Out / Grassy Glide", send: "Farigiraf (Armor Tail)" },
      { into: "Fighting", send: "Gholdengo (Ghost immune)" },
      { into: "Fire", send: "Farigiraf" },
      { into: "Dark", send: "Kingambit" },
      { into: "Status / Parting Shot", send: "Gholdengo (Good as Gold)" },
      { into: "Dragon", send: "Gholdengo or Farigiraf" },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Flip it. Armor Tail blanks Fake Out",
        play: "Lead Farigiraf unless Taunt is the preview you respect — then Herb, or Gholdengo as the backup lead. Four turns including the click.",
        next: "If Taunt lands without Herb, the setter does nothing. Re-set before the room dies or you race.",
      },
      {
        title: "Shield",
        goal: "Gholdengo blanks Parting Shot. Fighting is a Ghost immune",
        play: "Kingambit is 1× Fighting, not a resist. Gholdengo is immune. Fire and Ground go to Farigiraf — both Steels are 2×.",
        next: "Good as Gold does not stop Fake Out. Armor Tail does. Know which blank is in the slot.",
      },
      {
        title: "Clean",
        goal: "Kingambit cashes the four turns",
        play: "Kowtow the walls. Sucker Punch when the room dies. Dance if they Protect — Sucker Punch fails into Protect.",
        next: "Overlord snowballs a KO on your side. Under the room that is often the game.",
      },
    ],
    skills: ["Trick Room", "Armor Tail", "Sucker Punch"],
    relatedLessons: ["speed", "building", "turns"],
    slots: [
      {
        slug: "farigiraf",
        title: "The Clock",
        job: "speed",
        literacy: "setter",
        role: "Armor Tail plus Trick Room. Protect the four turns.",
        ability: "Armor Tail",
        item: "Mental Herb",
        itemWhy: "Taunt is the refuse. Herb eats one. The room goes up. Sitrus does not beat Taunt.",
        itemAlts: [
          { name: "Sitrus Berry", why: "If they never Taunt. One heal after Fake Out fails. You still click Trick Room." },
        ],
        nature: "Quiet",
        training: train(32, 0, 14, 20, 0, 0, {
          label: "Trick Room setter, last on purpose",
          why: "Quiet lowers Speed. 0 Spe Quiet is 72 — under Trick Room, slower is first. Cap HP so you live the Taunt turn if Mental Herb is gone. Special Attack is 20, not a cap: Psychic chips, it does not sweep. Kingambit is the KO.",
          spend: [
            "32 HP — live Taunt or the second hit, then click the room.",
            "20 SpA — Psychic into Fighting and Poison. Not a sweeper cap.",
            "14 Def — leftover. Armor Tail already blanks Fake Out.",
            "0 Spe — Quiet. Trick Room wants you last.",
          ],
        }, [
          alt("They always Fake Out", 32, 0, 20, 14, 0, 0, "Armor Tail already blanks the flinch. Pull Special Attack into Defense so you live the second hit and still click Trick Room.", [
            "32 HP / 20 Def — the stay after Fake Out does nothing.",
            "14 SpA — enough Psychic. The room is the job.",
            "0 Spe — still last.",
          ]),
        ]),
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
        item: "Leftovers",
        itemWhy: "The truck stays under the room. Leftovers is the four turns. Overlord scales if a partner fell — you do not need Glasses for that.",
        itemAlts: [
          { name: "Black Glasses", why: "If the room is a punch, not a stay. Kowtow now. You give up the residual." },
        ],
        nature: "Adamant",
        training: train(32, 32, 2, 0, 0, 0, {
          label: "Trick Room truck",
          why: "Base 50 Speed is a virtue under the room — you move first by being last. Do not put points in Speed. Cap Attack and HP. Sucker Punch is the race after the four turns, not Stat Points. Leftover 2 in Defense.",
          spend: [
            "32 Atk — Kowtow has to break walls. Overlord adds more if a partner fell.",
            "32 HP — sit the four turns. Leftovers is the residual.",
            "2 Def — leftover crumb.",
            "0 Spe — under the room, slower is first. After the room, Sucker Punch is +1.",
          ],
        }, [
          alt("Special chip", 20, 32, 0, 0, 14, 0, "If the table is Heat Wave and Make It Rain, not Close Combat. Pull HP into Special Defense. Fighting is still 1× — Gholdengo is the immune.", [
            "32 Atk — still the punch.",
            "20 HP / 14 SpD — live special chip under the room.",
            "0 Spe — still last.",
          ]),
        ]),
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
        item: "Leftovers",
        itemWhy: "Protect and Nasty Plot are in the kit. Specs would lock. Leftovers is the Fighting immune that sits.",
        itemAlts: [
          { name: "Choice Specs", why: "Drop Protect and Plot. Make It Rain is the only click. Use the 32 SpA race spread." },
        ],
        nature: "Modest",
        training: train(14, 0, 0, 32, 0, 20, {
          label: "Special Steel, race when the room dies",
          why: "Cap Special Attack — Make It Rain is the click. Put 20 in Speed (124 Modest) so you outrun uninvested 80s when Trick Room is down. Fighting is Ghost-immune, so those leftover points are a Speed race, not a bulk dump. Ghost does not need HP to 'tank Fighting'.",
          spend: [
            "32 SpA — Make It Rain. Modest.",
            "20 Spe — 124 Modest. The race after the four turns.",
            "14 HP — leftover. You are not the wall; you are the immune that punches.",
          ],
        }, [
          alt("Room stay", 20, 0, 14, 32, 0, 0, "If Farigiraf always flips the clock, you move first by being slow. Pull Speed into HP and Defense vs Fire and Ground chip you cannot afford.", [
            "32 SpA — still Make It Rain.",
            "20 HP / 14 Def — sit the room.",
            "0 Spe — slower is first under Trick Room.",
          ]),
        ]),
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
        lede: "Farigiraf is the Fake Out lead. Gholdengo is the Taunt lead. Kingambit should not be here yet.",
        branches: [
          { out: "farigiraf", when: "They Fake Out", then: "It fails. Trick Room." },
          { out: "farigiraf", when: "They Taunt, you have Herb", then: "Herb eats it. Trick Room." },
          { out: "farigiraf", when: "They Taunt, no Herb", then: "You lost the click. Psychic or leave to Gholdengo." },
          { out: "gholdengo", when: "Taunt or Parting Shot", then: "It fails. Make It Rain or Nasty Plot." },
          { out: "kingambit", when: "Room is not up", then: "You misread. Protect or Sucker Punch. Get Farigiraf in." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "The four turns are the match. Count them.",
        branches: [
          { out: "kingambit", when: "Room up", then: "Kowtow or Dance. Move first. Be aggressive." },
          { out: "kingambit", when: "They switch to Fighting", then: "Gholdengo. Ghost immune." },
          { out: "kingambit", when: "A partner fainted", then: "Overlord is live. Spend the remaining turns." },
          { out: "gholdengo", when: "Room up, Fighting in", then: "Make It Rain or Shadow Ball. You are immune." },
          { out: "farigiraf", when: "They switch to Fire", then: "Stay. Both Steels are 2× Fire." },
          { out: "farigiraf", when: "Room on last turn", then: "KO now or re-set next. Do not waffle." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { out: "kingambit", when: "Room still up, one of theirs left", then: "Kowtow. Close." },
          { out: "kingambit", when: "Room down, they outrun the truck", then: "Sucker Punch if they attack." },
          { out: "kingambit", when: "They Protect", then: "Swords Dance. Do not Sucker Punch the shield." },
          { out: "gholdengo", when: "Room down, Fighting still in", then: "Stay. Ghost immune." },
          { out: "farigiraf", when: "Room down, still slow", then: "Re-set. The match is another four turns or you lose the race." },
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
    family: "weather",
    slugs: ["charizard-mega-y", "garchomp", "cinderace"],
    meta: "Grass, Steel, Rillaboom. Rain if you overwrite. Y and Cinderace are 2× Water. Garchomp is 1× Water, 4× Ice.",
    press: ["Grass / Rillaboom", "Steel", "Rain if you steal sun", "Bug / Ice into Cinderace"],
    refuse: ["Rock into Y", "Water into Y or Cinderace", "Faster Drought", "Trick Room"],
    switches: [
      { into: "Rock", send: "Garchomp" },
      { into: "Electric", send: "Garchomp (immune)" },
      { into: "Ice", send: "Cinderace" },
      { into: "Grass", send: "Y or Cinderace" },
      { into: "Water", send: "Nobody is good — leave Y, chip, do not sit" },
      { into: "Dragon", send: "Cinderace or Y" },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Drought walks in with the Mega",
        play: "Y is the field and the wincon. Heat Wave in sun. Solar Beam does not charge. Do not splash this stone onto a rain three.",
        next: "If a faster Drought overwrites you, Fire charges again. KO their setter or leave Y.",
      },
      {
        title: "Shield",
        goal: "Garchomp patches Rock. Nobody likes Water",
        play: "Rock into Y is a donation. Water into Y or Cinderace is 2×. Garchomp is 1× Water, 4× Ice. Cinderace takes Ice.",
        next: "Leave Y on Water, chip, do not sit. Electric is Garchomp immune.",
      },
      {
        title: "Clean",
        goal: "Heat Wave the Grass. Libero closes if Y goes down",
        play: "Y and Cinderace hit Grass and Steel. Garchomp punches what Fire does not. Trick Room is a refuse — you are the fast three.",
        next: "If Y dies, Cinderace is still a Fire. It is not Drought. Play the race, not the field.",
      },
    ],
    skills: ["Drought", "Solar Beam", "Libero"],
    relatedLessons: ["abilities", "jobs", "holes"],
    slots: [
      {
        slug: "charizard-mega-y",
        title: "The Drought",
        job: "mega",
        literacy: "sweeper",
        role: "Setter and wincon. Heat Wave in sun. Solar Beam does not charge.",
        ability: "Drought",
        item: "Charizardite Y",
        itemWhy: "Drought is the Mega ability. No stone, no sun. No swap.",
        nature: "Modest",
        training: train(2, 0, 0, 32, 0, 32, {
          label: "Fast Drought sweeper",
          why: "4× Rock. Bulk does not save Stone Edge — leftover 2 in HP is the tax, not a wall. Cap Special Attack and Speed. Modest does not boost Speed, so the 32 Spe (152) is the whole race vs 90s and other Droughts.",
          spend: [
            "32 Spe — 152 Modest. Modest does not boost Speed; these points are the race.",
            "32 SpA — Heat Wave in sun. The reason Y exists.",
            "2 HP — leftover. 4× Rock still KOs.",
          ],
        }, [
          alt("They never Rock", 14, 0, 0, 32, 0, 20, "Grass-heavy table, no Archaludon or Tyranitar. Pull 12 Speed into HP so Heat Wave lives a resisted hit. Do not do this into Rock.", [
            "32 SpA — still the burn.",
            "20 Spe — 140 Modest. Enough vs Grass; not the Rock race.",
            "14 HP — live a resisted hit.",
          ]),
        ]),
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
        item: "Yache Berry",
        itemWhy: "Ice is 4×. The berry is one live so you can patch Rock. Not Loaded Dice — you are the check, not the cleaner.",
        itemAlts: [
          { name: "Loaded Dice", why: "If Ice is already gone. Scale Shot is Speed after Y dies." },
          { name: "Life Orb", why: "Electric soak, then EQ. You are not eating Ice Beam." },
        ],
        nature: "Jolly",
        training: train(2, 32, 0, 0, 0, 32, {
          label: "Fast Rock patch",
          why: "No Tailwind on this three. Cap Attack and Speed so you patch Rock before they click it twice. Jolly 32 Spe is 169. Yache is the Ice live, not HP — 4× Ice still KOs through a bulk dump.",
          spend: [
            "32 Spe — 169 Jolly. Patch Rock this turn, not next turn.",
            "32 Atk — Earthquake the Fire answers that are grounded.",
            "2 HP — leftover. Yache is the item. HP does not beat Ice Beam.",
          ],
        }, [
          alt("Y always leads", 20, 32, 14, 0, 0, 0, "If Drought is always up and you only come in on Electric. You are not racing Rock — you are soaking Thunderbolt. Move Speed into HP and Defense.", [
            "32 Atk — still EQ.",
            "20 HP / 14 Def — soak Electric. Ground immune is the switch; bulk is the stay.",
            "0 Spe — Y already burned what you would have raced.",
          ]),
        ]),
        moves: [
          { name: "Earthquake", why: "One target. Hits Y's Fire answers that are grounded." },
          { name: "Dragon Claw or Scale Shot", why: "Dragon STAB. Scale Shot if Y died and you need Speed." },
          { name: "Stone Edge", why: "Flying. Ironic coverage from the Rock switch." },
          { name: "Swords Dance", why: "Protect branch." },
        ],
        objective: "Take Rock and Electric. Punch what Fire does not.",
        howToPlay:
          "Come in on Rock, Electric, or a resisted Fire.\nYou are 4× Ice. Water is 1× — Y and Cinderace are the 2× Waters.\nDo not 'patch' a Waterfall for them. Nobody here resists Water.",
      },
      {
        slug: "cinderace",
        title: "The Libero",
        job: "speed",
        literacy: "sweeper",
        role: "Picks a type and commits. Fast Fire if Y is gone.",
        ability: "Libero",
        item: "Life Orb",
        itemWhy: "Libero closer. Orb is the KO after Y. Rocks are real — Boots is the swap, not the default punch.",
        itemAlts: [
          { name: "Heavy-Duty Boots", why: "Stealth Rock on the table. Cinderace is 2× Rock. You enter clean, you hit weaker." },
        ],
        nature: "Jolly",
        training: train(2, 32, 0, 0, 0, 32, {
          label: "Fast Libero closer",
          why: "Base 119 Speed. Jolly 32 Spe is 188 — you outrun what Y did not KO. Cap Attack. Leftover 2 in HP. Boots vs Orb is the item question, not a bulk question. Libero commits a type on the click; Speed is how you use that type first.",
          spend: [
            "32 Spe — 188 Jolly. Top-end race after Y.",
            "32 Atk — Pyro Ball and High Jump Kick.",
            "2 HP — leftover. Orb already spends HP.",
          ],
        }, [
          alt("Y closed", 20, 32, 0, 0, 0, 14, "If Mega Y is the wincon and you are revenge. 14 Spe is 168 Jolly — still faster than uninvested 100s. Spend the rest on HP so Sucker Punch / High Jump Kick lives a chip.", [
            "32 Atk — still the punch.",
            "20 HP — live the revenge send.",
            "14 Spe — 168 Jolly. Y already won the first race.",
          ]),
        ]),
        moves: [
          { name: "Pyro Ball", why: "Fire STAB in sun. Libero makes you Fire on the click." },
          { name: "High Jump Kick", why: "Fighting into Incineroar (2×). Kingambit is 1× Dark/Steel. Miss is a self-KO. Ghost is a zero." },
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
        lede: "Y is 4× Rock. Y and Cinderace are 2× Water. Preview is where you refuse to donate the Mega.",
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
        lede: "Y is the usual send into Grass and Steel. Garchomp is the Rock send. Cinderace is the Ice send.",
        branches: [
          { out: "charizard-mega-y", when: "Sun just went up", then: "Heat Wave or Solar Beam. Take the KO." },
          { out: "charizard-mega-y", when: "Rock in", then: "Leave to Garchomp now. Y is 4× Rock." },
          { out: "charizard-mega-y", when: "Water in", then: "Solar Beam if sun is up, then leave. Y is 2× Water." },
          { out: "garchomp", when: "Rock in", then: "Earthquake. You patched." },
          { out: "cinderace", when: "Sun is up", then: "Pyro Ball. Libero Fire." },
          { out: "cinderace", when: "Ice in", then: "Stay. You resist. Garchomp is 4×. Y is 1× Ice." },
          { out: "charizard-mega-y", when: "Rain overwrote sun", then: "Re-send Y later to steal weather, or play Garchomp/Cinderace raw." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        branches: [
          { out: "charizard-mega-y", when: "Sun up, Grass or Steel in", then: "Heat Wave. Be aggressive." },
          { out: "charizard-mega-y", when: "Rock onto Y", then: "Garchomp immediately." },
          { out: "charizard-mega-y", when: "Water in", then: "Solar Beam if sun is still up. Else chip and do not sit." },
          { out: "charizard-mega-y", when: "Electric onto Y", then: "Garchomp. Immune." },
          { out: "cinderace", when: "Y fainted, sun fading", then: "Pyro Ball. Sucker Punch if they outrun." },
          { out: "garchomp", when: "They Protect", then: "Swords Dance. Do not Solar Beam the shield." },
        ],
      },
      {
        id: "late",
        title: "Late",
        branches: [
          { out: "charizard-mega-y", when: "Sun up, they cannot Rock you", then: "Heat Wave. Close." },
          { out: "cinderace", when: "Y dead, one of theirs left", then: "Pyro Ball. One target." },
          { out: "garchomp", when: "Y dead, grounded leftover", then: "Earthquake. One target." },
          { out: "charizard-mega-y", when: "Sun gone", then: "Do not Solar Beam — it charges. Leave or chip Fire." },
          { out: "cinderace", when: "Sun gone", then: "Sucker Punch or High Jump Kick. Pyro Ball is slower Fire." },
          { out: "charizard-mega-y", when: "Water still in", then: "Solar Beam only if sun is up. Otherwise you are fishing." },
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
      { title: "Water on Y and Cinderace", body: "Both Fires are 2× Water. Garchomp is 1×. Solar Beam is the patch while sun lasts. There is no Water resist." },
      { title: "Weather war", body: "Pelipper overwrite on entry. Re-send Y to steal sun back. That is a turn." },
      { title: "Solar Beam without sun", body: "It charges. You donate a turn. Do not." },
      { title: "High Jump Kick miss / Ghost", body: "Cinderace can KO itself. Dire read. Pyro Ball is the safe Fire click." },
    ],
  },
  {
    id: "balance-excadrill-primarina-dragonite",
    title: "Scale Sweep: Excadrill, Primarina, Dragonite",
    lede: "Drill breaks, Prima patches, Dragonite sweeps. Dragon is not a Drill threat. Stone Edge, not Rock Slide. Never lead the kite.",
    philosophy:
      "Clock is Excadrill or Primarina — whoever the preview names. Dragonite stays in the bag until Ice (4×) and Fairy are gone or chunked. Sand Rush is dead without a sand setter. Multiscale is full HP only. Extreme Speed is Normal — Ghosts laugh.",
    archetype: "balance",
    family: "kite",
    slugs: ["excadrill", "primarina", "dragonite"],
    meta: "Kingambit and Steel, Rock, Electric into Prima, Dragons into Prima. Ice is Dragonite's funeral. Fire / Water / Fighting are Drill's. Electric is Prima's — Drill is immune.",
    press: ["Kingambit / Steel", "Rock", "Electric into Primarina", "Dragons into Primarina"],
    refuse: [
      "Ice into Dragonite",
      "Fire / Water / Fighting into Drill",
      "Fairy while Dragonite is the only answer",
      "Ghost Extreme Speed",
    ],
    switches: [
      { into: "Fire / Water / Fighting", send: "Primarina — Drill is 2×. Prima resists." },
      { into: "Ice", send: "Primarina (resists). Drill is 1×. Dragonite is 4× — never." },
      { into: "Fairy", send: "Excadrill (Iron Head). Do not park Dragonite." },
      { into: "Electric", send: "Excadrill (immune). Prima is 2×." },
      { into: "Grass", send: "Dragonite later (¼) if Ice/Fairy are gone. Drill is 1× now." },
      { into: "Dragon", send: "Primarina (Fairy immune). Drill resists Dragon — Steel does." },
      { into: "Physical wall on Drill", send: "Primarina special" },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Break or patch on the first send — not Dragonite",
        play: "Physical, Steel, Rock, or Electric: Excadrill. Fire, Water, Fighting, or Dragon: Primarina. Dragonite never walks in first.",
        next: "Sash Dance on Drill if they live. Specs punch on Prima. Then leave the slot for the kite.",
      },
      {
        title: "Shield",
        goal: "Pivot the shared holes so Dragonite still has Multiscale",
        play: "Ice and Fairy onto Dragonite → Drill (Iron Head Fairy, EQ or Iron Head Ice). Fire / Water / Fighting onto Drill → Prima. Electric onto Prima → Drill. Physical wall sitting on Drill → Prima special.",
        next: "Choice lock is a donated turn. Do not Specs-Moonblast a Steel that wanted Surf.",
      },
      {
        title: "Clean",
        goal: "Dragon Dance, then Outrage or Extreme Speed",
        play: "Send Dragonite only after Ice and Fairy are gone or chunked. Dance into a Protect or a free turn. Outrage if the last two cannot Fairy. Extreme Speed the revenge — not Ghost.",
        next: "Outrage locks. A Fairy switch ends the sweep. Multiscale is gone after the first chip.",
      },
    ],
    skills: ["Mold Breaker", "Dragon Dance", "Extreme Speed"],
    relatedLessons: ["preview", "abilities", "archetypes"],
    slots: [
      {
        slug: "excadrill",
        title: "The Drill",
        job: "breaker",
        literacy: "wallbreaker",
        role: "Default physical lead. Mold Breaker. Sash Dance.",
        ability: "Mold Breaker",
        item: "Focus Sash",
        itemWhy: "Sash Dance. You live one, +2, KO. Matches the 2 HP spread. Leftovers does not survive Fire, Water, or Fighting.",
        itemAlts: [
          { name: "Life Orb", why: "Kingambit / Trick Room table where you already outspeed. Skip the Dance and punch. Recoil is real — you are not the kite." },
          { name: "Choice Scarf", why: "Jolly 32 Spe is 154. Scarf is 231 — you outrun Jolly Garchomp (169) and Sneasler. You lock. Dragonite is the setup sweeper now; Drill is revenge. Do not Dance in the scarf." },
          { name: "Occa Berry", why: "Fire is 2×. Prima is the Fire switch. Occa is if you mis-led Drill into Charizard and still need the Earthquake on Kingambit next." },
        ],
        nature: "Jolly",
        training: train(2, 32, 0, 0, 0, 32, {
          label: "Sash Dance lead",
          why: "The classroom glass pattern: cap Attack and Speed, leftover 2 in HP. Focus Sash is the live — extra HP would not save Fire, Water, or Fighting. Jolly 32 Spe is 154: outruns uninvested Garchomp (122), not Jolly Garchomp (169). Sand Rush is off; there is no sand setter.",
          spend: [
            "32 Spe — 154 Jolly. Dance, then KO before they click Fire/Water/Fighting.",
            "32 Atk — Earthquake (Kingambit) and Iron Head (Fairy).",
            "2 HP — leftover. Sash is the one live. Bulk does not beat those 2× types.",
          ],
        }, [
          alt("They are slow", 20, 32, 14, 0, 0, 0, "Kingambit or Trick Room table. You already outspeed the truck. Move Speed into HP and Defense so Sash is not the only live — you can skip Dance and punch.", [
            "32 Atk — still EQ the truck.",
            "20 HP / 14 Def — sit a hit if they are slower.",
            "0 Spe — you already outspeed 50 Spe Kingambit.",
          ]),
        ]),
        moves: [
          { name: "Swords Dance", why: "Sash is the turn. Next hit is the KO. Do not Dance into a guaranteed Fire/Water/Fighting." },
          {
            name: "Earthquake",
            why: "Ground STAB. vs Kingambit click EQ — not Iron Head. Steel resists Steel.",
          },
          { name: "Iron Head", why: "Steel STAB into Fairy and Ice. Flinch is a gift, not the plan." },
          {
            name: "Stone Edge",
            why: "Flying. Singles — not Rock Slide.",
            alts: [
              { name: "Rapid Spin", why: "Stealth Rock is 2× Flying. One chip ends Dragonite's Multiscale. Glimmora is the table. Prima still Ice Beams birds — you can drop Edge. The kite is the whole three." },
              { name: "Rock Slide", why: "Do not. Spread fantasy from doubles. One target, one Edge." },
            ],
          },
        ],
        objective: "Lead into physical, Steel, Rock, Electric (immune). Punch Kingambit. Leave Fire, Water, Fighting, Ground.",
        howToPlay:
          "Lead vs physical, Steel, Rock, or Electric. You are immune to Electric.\nvs Kingambit: Earthquake. Iron Head is resisted.\nFire, Water, Fighting, Ground leave — not Dragon. Steel resists Dragon.\nSand Rush needs sand. There is no setter. Mold Breaker is the ability.",
      },
      {
        slug: "primarina",
        title: "The Patch",
        job: "breaker",
        literacy: "wallbreaker",
        role: "Special break. Fire / Water / Fighting / Dragon lead. The physical-wall answer.",
        ability: "Torrent",
        item: "Choice Specs",
        itemWhy: "The patch is a locked click. Surf or Moonblast, then leave. Matches the 32 SpA / 32 Spe spread.",
        itemAlts: [
          { name: "Sitrus Berry", why: "Champions singles majority. Calm Mind + Encore, sit, then punch. Use when Incineroar and Protect are the table and Prima has to win the slot, not just hole it for the kite. Swap Psychic for Encore. Use the Leftovers Calm Mind spread." },
          { name: "Leftovers", why: "Same stay set as Sitrus, slower heal. Sit, boost, Surf. You are slower. Drill and Dragonite are the race." },
          { name: "Mystic Water", why: "No lock, no berry. Surf and Sparkling Aria get 20%. You can still Ice Beam Garchomp and Moonblast Dragons. Use when Choice would donate into a Steel." },
        ],
        nature: "Modest",
        training: train(2, 0, 0, 32, 0, 32, {
          label: "Choice Specs patch",
          why: "You lock one click, so that click has to KO. Cap Special Attack. Cap Speed because Modest does not boost Speed — 32 Spe is 112, which outruns uninvested 70s. That is the difference between KO and revenge. Leftover 2 in HP.",
          spend: [
            "32 SpA — Surf or Moonblast has to break the wall. Specs locks it.",
            "32 Spe — 112 Modest. Modest does not boost Speed; these points are the whole race.",
            "2 HP — leftover. Choice does not sit.",
          ],
        }, [
          alt("Leftovers Calm Mind", 32, 0, 0, 20, 14, 0, "Not Choice. Sit, boost, Surf. Move Speed into HP and Special Defense. You are the patch that stays, not the race.", [
            "32 HP — the stay.",
            "20 SpA / 14 SpD — Calm Mind supplies the rest of the punch.",
            "0 Spe — you are not racing. Drill and Dragonite are.",
          ]),
        ]),
        moves: [
          {
            name: "Surf",
            why: "Safe Water STAB. Hits Fire and Ground that threaten Drill.",
            alts: [
              { name: "Sparkling Aria", why: "90 Water that heals burns. Incineroar Will-O-Wisp ends the kite if it lands on Dragonite. Aria is the cat table. Specs still locks it." },
              { name: "Hydro Pump", why: "The miss-tax. Specs already commits the slot. Surf is the classroom click." },
            ],
          },
          { name: "Moonblast", why: "Fairy STAB. Dragons and Fighting. Fairy immune to Dragon — you can lead that." },
          {
            name: "Ice Beam",
            why: "Dragonite's Ice checks, and Dragons that would sit on Moonblast. Garchomp is 4×.",
            alts: [{ name: "Aqua Jet", why: "Torrent priority. Revenge Charizard and Cinderace after Drill is gone. Kingambit resists Water — still Earthquake that." }],
          },
          {
            name: "Psychic",
            why: "Poison that would 2× you. Specs lock — pick before you click.",
            alts: [
              { name: "Energy Ball", why: "Grass into Waters that shrug Moonblast. Drill is 1× Grass; Dragonite is ¼ later." },
              { name: "Encore", why: "Sitrus / Leftovers set. Lock Protect or setup, then Calm Mind. You are no longer Choice." },
              { name: "Calm Mind", why: "Leftovers or Sitrus set. You are no longer Choice. Slower break, no lock." },
            ],
          },
        ],
        objective: "Lead into Fire, Water, Fighting, Dragon. Patch physical walls. Leave Electric, Grass, Poison (2×).",
        howToPlay:
          "Lead vs Fire, Water, Fighting, or Dragon. Fairy immune to Dragon.\nElectric, Grass, Poison are 2× — Electric to Drill (immune), Grass to Dragonite (¼) once Ice/Fairy are gone.\nChoice lock: do not Moonblast a Steel that wanted Surf, and vice versa.",
      },
      {
        slug: "dragonite",
        title: "The Kite",
        job: "breaker",
        literacy: "sweeper",
        role: "Late wincon. Hidden until Ice and Fairy are gone.",
        ability: "Multiscale",
        item: "Lum Berry",
        itemWhy: "Multiscale is full HP. Status or Outrage confusion ends the kite. Lum is the one clean Dance.",
        itemAlts: [
          { name: "Heavy-Duty Boots", why: "Stealth Rock is 2× Flying. One chip ends Multiscale. Boots keeps the kite at full until Dance. If they have Glimmora, this or Rapid Spin on Drill — pick one." },
          { name: "Yache Berry", why: "Ice is 4×. Prima resists Ice; this berry is if Prima is already down and you still have to send. One live, not a resist." },
          { name: "Life Orb", why: "The Dance already happened and you need the KO through Multiscale chip. Recoil pops the scale on the first hit you deal — only if the last one cannot revenge." },
        ],
        nature: "Adamant",
        training: train(2, 32, 0, 0, 0, 32, {
          label: "Multiscale kite",
          why: "Never the lead. Cap Attack and Speed. Adamant 32 Spe is 132; one Dragon Dance is 198. Extra HP does not restore Multiscale — it is full HP or it is gone. Leftover 2 in HP is the tax. Lum keeps the one clean Dance.",
          spend: [
            "32 Spe — 132 Adamant. One Dance is 198. That is the sweep.",
            "32 Atk — Outrage and Extreme Speed.",
            "2 HP — leftover. HP after the first chip does not bring Multiscale back.",
          ],
        }, [
          alt("You always Dance", 20, 32, 0, 0, 0, 14, "If the free turn is real every game. 14 Spe is 114, Dance is 171. Move the rest into HP so the first chip after Multiscale drops does not KO.", [
            "32 Atk — still the kite.",
            "20 HP — live the hit after Multiscale is gone.",
            "14 Spe — 114 Adamant, 171 after Dance. Enough if the free turn is guaranteed.",
          ]),
        ]),
        moves: [
          { name: "Dragon Dance", why: "The free turn. Protect branch. Multiscale still up if you are full." },
          {
            name: "Outrage",
            why: "The sweep click. You lock. A Fairy switch ends Dragonite.",
            alts: [{ name: "Dragon Claw", why: "If you fear the Fairy switch. Less damage. You can leave." }],
          },
          {
            name: "Earthquake",
            why: "Steel that resists Dragon. Grounded leftovers. Hits Ghost — Extreme Speed does not.",
            alts: [{ name: "Fire Punch", why: "Corviknight is Flying/Steel — EQ is a zero. Drill Stone Edge is the bird answer while Drill lives. Punch is if Drill is down and a Steel bird is left." }],
          },
          {
            name: "Extreme Speed",
            why: "Normal priority. Revenge after Dance. Ghost is immune.",
            alts: [{ name: "Roost", why: "Full HP brings Multiscale back. Use when they cannot KO through the roost and Ice/Fairy are gone. You give up revenge — Prima Aqua Jet is not here; Drill has no priority." }],
          },
        ],
        objective: "Never the lead. Dance, then Outrage or Extreme Speed. Keep Multiscale for one hit.",
        howToPlay:
          "Do not lead. Hide until Ice (4×) and Fairy are gone or chunked.\nMultiscale only on full HP. The first chip ends it. Fake Out still flinches — Inner Focus is the alt, not the default.\nOutrage locks. Extreme Speed is Normal — do not click it into Ghost.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "One send. Name Drill or Prima. Dragonite stays in the bag.",
        branches: [
          { when: "Physical, Steel, Rock, or Electric", then: "Excadrill. Mold Breaker. Sash. Electric immune." },
          { when: "Fire, Water, Fighting, or Dragon", then: "Primarina. Fairy immune to Dragon. Surf or Moonblast." },
          { when: "Ice or Fairy still healthy", then: "Keep Dragonite back. Patch with Prima or Drill first." },
          { when: "Kingambit on their three", then: "Drill. Earthquake — not Iron Head. Steel resists Steel." },
          { when: "They look like Fake Out", then: "Do not lead Dragonite. Multiscale still flinches." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        lede: "Drill or Prima. Dragonite is not here yet.",
        branches: [
          { out: "excadrill", when: "Kingambit or a Steel that resists Iron Head", then: "Earthquake. Steel resists Steel." },
          { out: "excadrill", when: "Fairy", then: "Iron Head." },
          { out: "excadrill", when: "Flying", then: "Stone Edge. Not Rock Slide." },
          { out: "excadrill", when: "They Protect or you live the hit", then: "Swords Dance. Sash is the turn." },
          { out: "excadrill", when: "Fire, Water, Fighting, or Ground coming", then: "Leave. Steel does not resist those. Dragon is fine — Steel resists Dragon." },
          { out: "primarina", when: "Dragon or Fighting", then: "Moonblast." },
          { out: "primarina", when: "Fire or a grounded Water", then: "Surf. Hydro Pump is the miss-tax alt." },
          { out: "primarina", when: "Dragonite's Ice check is in", then: "Ice Beam." },
          { out: "primarina", when: "Electric, Grass, or Poison", then: "Leave. 2×. Electric → Drill (immune). Grass → Dragonite later (¼)." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Pivot the holes. Do not donate a Choice lock. Do not send the kite yet.",
        branches: [
          { out: "excadrill", when: "Physical wall sitting on Drill", then: "Primarina. Special break." },
          { out: "excadrill", when: "Fire, Water, or Fighting onto Drill", then: "Primarina. Both resist. Drill is 2×." },
          { out: "primarina", when: "Electric onto Prima", then: "Excadrill. Immune." },
          { out: "primarina", when: "Grass onto Prima", then: "Drill now (1×) or Dragonite later (¼) if Ice and Fairy are gone." },
          { out: "primarina", when: "Poison onto Prima", then: "Drill. Steel immune to Poison. Psychic if you are not locked into Water." },
          { out: "primarina", when: "Specs locked Moonblast, Steel in", then: "You donated. That Steel wanted Surf. Leave if you can." },
          { out: "primarina", when: "Specs locked Surf, Dragon or Fighting in", then: "You wanted Moonblast. Chip or leave." },
          { out: "dragonite", when: "Ice or Fairy onto Dragonite", then: "Excadrill. Iron Head Fairy. EQ or Iron Head Ice. Prima resists Ice." },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Ice and Fairy gone or chunked. Then the kite.",
        branches: [
          { out: "dragonite", when: "Ice and Fairy gone or chunked", then: "Dragon Dance, then Outrage or Extreme Speed." },
          { out: "dragonite", when: "They Protect", then: "Dragon Dance. Multiscale still wants full HP." },
          { out: "dragonite", when: "Ghost in", then: "Earthquake. Extreme Speed is Normal — Ghost immune." },
          { out: "dragonite", when: "Steel leftover", then: "Earthquake. Outrage is resisted." },
          { out: "dragonite", when: "Outrage locked, Fairy switches in", then: "The sweep is over. Claw is the alt if you feared this." },
          { out: "dragonite", when: "Multiscale broken", then: "You take real damage now. Do not eat a second hit for free." },
          { out: "excadrill", when: "Sash still in, a wall left", then: "Swords Dance and break. Dragonite can wait one more KO." },
          { out: "primarina", when: "Torrent live, one of theirs left", then: "Surf or Moonblast. Specs already picked the click." },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Preview their three. One send. Dragonite never walks in first.",
        forks: [
          {
            id: "lead-drill",
            when: "Physical, Steel, Rock, or Electric",
            then: "Lead Excadrill. Mold Breaker. Sash. Electric immune.",
            send: "excadrill",
            forks: [
              {
                id: "lead-drill-eq",
                when: "Kingambit or a Steel that resists Iron Head",
                then: "Earthquake. Steel resists Steel.",
                move: "Earthquake",
                send: "excadrill",
                why: "Iron Head is the wrong Kingambit click.",
              },
              {
                id: "lead-drill-fairy",
                when: "Fairy",
                then: "Iron Head.",
                move: "Iron Head",
                send: "excadrill",
              },
              {
                id: "lead-drill-flying",
                when: "Flying",
                then: "Stone Edge. Not Rock Slide.",
                move: "Stone Edge",
                send: "excadrill",
                why: "One target. Spread fantasy stays out.",
              },
              {
                id: "lead-drill-dance",
                when: "They Protect or you live the hit",
                then: "Swords Dance. Sash is the turn.",
                move: "Swords Dance",
                send: "excadrill",
              },
              {
                id: "lead-drill-leave",
                when: "Fire, Water, Fighting, or Ground coming",
                then: "Leave to Primarina. Steel does not resist those.",
                send: "primarina",
                why: "Dragon is fine on Drill — Steel resists Dragon. Do not treat Dragon as a Drill threat.",
              },
            ],
          },
          {
            id: "lead-prima",
            when: "Fire, Water, Fighting, or Dragon",
            then: "Lead Primarina. Fairy immune to Dragon. Surf is the safe Water.",
            send: "primarina",
            forks: [
              {
                id: "lead-prima-moon",
                when: "Dragon or Fighting",
                then: "Moonblast.",
                move: "Moonblast",
                send: "primarina",
              },
              {
                id: "lead-prima-surf",
                when: "Fire or a grounded Water",
                then: "Surf. Hydro Pump is the miss-tax alt.",
                move: "Surf",
                send: "primarina",
              },
              {
                id: "lead-prima-ice",
                when: "Dragonite's Ice check is in",
                then: "Ice Beam. Chunk it before the kite comes out.",
                move: "Ice Beam",
                send: "primarina",
              },
              {
                id: "lead-prima-leave",
                when: "Electric, Grass, or Poison",
                then: "Leave. You are 2×.",
                send: "excadrill",
                why: "Electric → Drill (immune). Grass → Dragonite later (¼) once Ice and Fairy are gone.",
              },
            ],
          },
          {
            id: "lead-hide",
            when: "Ice or Fairy still healthy",
            then: "Keep Dragonite back. Patch with Primarina or Excadrill first.",
            why: "Dragonite is 4× Ice. Fairy ends Outrage. Never the lead. Fake Out still flinches Multiscale.",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Pivot the shared holes. Choice lock is a donated turn.",
        forks: [
          {
            id: "mid-drill",
            when: "This Pokémon is out",
            out: "excadrill",
            forks: [
              {
                id: "mid-drill-wall",
                when: "Physical wall sitting on Drill",
                then: "Primarina. Special break.",
                send: "primarina",
              },
              {
                id: "mid-drill-fwf",
                when: "Fire, Water, or Fighting onto Drill",
                then: "Primarina. Both resist. Drill is 2×.",
                send: "primarina",
              },
            ],
          },
          {
            id: "mid-prima",
            when: "This Pokémon is out",
            out: "primarina",
            forks: [
              {
                id: "mid-prima-elec",
                when: "Electric onto Prima",
                then: "Excadrill. Immune.",
                send: "excadrill",
              },
              {
                id: "mid-prima-grass",
                when: "Grass onto Prima",
                then: "Drill now (1×), or Dragonite later (¼) if Ice and Fairy are gone.",
                send: "excadrill",
              },
              {
                id: "mid-prima-poison",
                when: "Poison onto Prima",
                then: "Drill. Steel immune to Poison.",
                send: "excadrill",
                why: "Psychic if Specs is not locked into Water.",
              },
              {
                id: "mid-prima-lock-moon",
                when: "Specs locked Moonblast, Steel in",
                then: "You donated. That Steel wanted Surf.",
                why: "Leave if the lock lets you. Do not Moonblast a Steel on purpose.",
              },
              {
                id: "mid-prima-lock-surf",
                when: "Specs locked Surf, Dragon or Fighting in",
                then: "You wanted Moonblast. Chip or leave.",
                move: "Surf",
              },
            ],
          },
          {
            id: "mid-nite",
            when: "This Pokémon is out",
            out: "dragonite",
            forks: [
              {
                id: "mid-nite-ice-fairy",
                when: "Ice or Fairy onto Dragonite",
                then: "Excadrill. Iron Head Fairy. EQ or Iron Head Ice.",
                send: "excadrill",
                why: "Prima resists Ice. Dragonite is 4× Ice — you mis-sent if this is full HP Ice.",
              },
            ],
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Ice and Fairy gone or chunked. Then Dance.",
        forks: [
          {
            id: "late-nite",
            when: "This Pokémon is out",
            out: "dragonite",
            forks: [
              {
                id: "late-nite-go",
                when: "Ice and Fairy gone or chunked",
                then: "Dragon Dance, then Outrage or Extreme Speed.",
                move: "Dragon Dance",
                send: "dragonite",
              },
              {
                id: "late-nite-protect",
                when: "They Protect",
                then: "Dragon Dance. Multiscale still wants full HP.",
                move: "Dragon Dance",
                send: "dragonite",
              },
              {
                id: "late-nite-ghost",
                when: "Ghost in",
                then: "Earthquake. Extreme Speed is Normal — Ghost immune.",
                move: "Earthquake",
                send: "dragonite",
              },
              {
                id: "late-nite-steel",
                when: "Steel leftover",
                then: "Earthquake. Outrage is resisted.",
                move: "Earthquake",
                send: "dragonite",
              },
              {
                id: "late-nite-fairy-lock",
                when: "Outrage locked, Fairy switches in",
                then: "The sweep is over. Claw is the alt if you feared this.",
                move: "Outrage",
                why: "Do not click Outrage while a Fairy is in the bag unless you can KO through the switch.",
              },
              {
                id: "late-nite-scale",
                when: "Multiscale broken",
                then: "You take real damage now. Do not eat a second hit for free.",
                send: "dragonite",
              },
            ],
          },
          {
            id: "late-drill",
            when: "This Pokémon is out",
            out: "excadrill",
            forks: [
              {
                id: "late-drill-sash",
                when: "Sash still in, a wall left",
                then: "Swords Dance and break. Dragonite can wait one more KO.",
                move: "Swords Dance",
                send: "excadrill",
              },
            ],
          },
          {
            id: "late-prima",
            when: "This Pokémon is out",
            out: "primarina",
            forks: [
              {
                id: "late-prima-torrent",
                when: "Torrent live, one of theirs left",
                then: "Surf or Moonblast. Specs already picked the click.",
                send: "primarina",
              },
            ],
          },
        ],
      },
    ],
    loops: [
      { title: "Sash Dance", body: "Drill lives on Sash. Swords Dance. Next hit is Earthquake, Iron Head, or Stone Edge — one target." },
      { title: "Specs punch", body: "Prima locks a click. Surf the Fire/Ground. Moonblast the Dragon/Fighting. Ice Beam the Ice check. Wrong lock is a donated turn." },
      { title: "Multiscale Dance", body: "Full HP Dragonite in. Dragon Dance on a free turn. Outrage if Fairy is gone. Extreme Speed the revenge — not Ghost." },
    ],
    hazards: [
      { title: "4× Ice", body: "Dragonite dies to Ice Beam. Prima resists. Drill is 1×. Preview is where you refuse the kite lead." },
      { title: "Outrage lock", body: "A Fairy switch ends the sweep. Dragon Claw is the alt if the Fairy is still in the bag." },
      { title: "Hydro miss", body: "Specs already committed the slot. Surf is the classroom Water. Hydro Pump is the miss-tax." },
      { title: "Choice lock", body: "Do not Specs-Moonblast a Steel that wanted Surf, and vice versa." },
      { title: "Fake Out into Dragonite", body: "Multiscale still flinches. Inner Focus is the alt, not the default. Do not lead the kite into Incineroar." },
      { title: "Drill vs Fire / Water / Fighting", body: "All 2×. Prima resists all three. Dragon is not on this list — Steel resists Dragon." },
    ],
  },
  {
    id: "balance-mimikyu-excadrill-dragonite",
    title: "Disguise Sweep: Mimikyu, Excadrill, Dragonite",
    lede: "Mimikyu Dances behind Disguise. Excadrill breaks Steel. Dragonite finishes after Ice and Fairy are gone.",
    philosophy:
      "You bring Mimikyu, Excadrill, and Dragonite. Mimikyu’s Disguise blocks the first damaging attack; use that turn to Swords Dance. Excadrill breaks Steel and pops the opponent’s Mimikyu because Mold Breaker ignores Disguise. Dragonite wins late: keep it in the bag until Ice and Fairy are gone. Ice hits Dragonite four times as hard. Mimikyu and Excadrill only take normal Ice damage — they do not resist it. Never lead Dragonite.",
    archetype: "balance",
    family: "kite",
    pilot: {
      thesis: "Mimikyu Dances behind Disguise. Excadrill breaks Steel. Dragonite finishes after Ice and Fairy are gone.",
      rule: "Never lead Dragonite. Ice hits it four times as hard. Mimikyu and Excadrill take normal Ice damage.",
      fail: "Leading Dragonite, or clicking Outrage while they still have a Fairy.",
    },
    slugs: ["mimikyu-disguised", "excadrill", "dragonite"],
    meta: "Disguise is one free hit, not a wall. Status still lands. After the costume pops, Mimikyu is fragile.",
    press: ["Fake Out", "Fighting", "Dragon", "Kingambit", "Their Mimikyu"],
    refuse: ["Ice into Dragonite", "Ghost or Steel after Disguise pops", "Fairy into Outrage", "Fire or Water into Excadrill"],
    switches: [
      { into: "Fake Out / Fighting / Dragon", send: "Mimikyu. Ghost ignores Fake Out and Fighting. Fairy ignores Dragon." },
      { into: "Fire / Water", send: "Mimikyu. Those hits deal normal damage. They deal double to Excadrill." },
      { into: "Ice", send: "Mimikyu or Excadrill. Both take normal Ice. Never Dragonite — Ice hits it four times as hard." },
      { into: "Fairy", send: "Excadrill. Click Iron Head. Do not leave Dragonite in." },
      { into: "Ghost / Steel into Mimikyu", send: "Excadrill. Steel resists Ghost. Iron Head hits Fairy. Mold Breaker pops their Disguise." },
      { into: "Electric", send: "Excadrill. Ground is immune to Electric." },
      { into: "Physical wall on Excadrill", send: "Mimikyu after Disguise Dance, or Dragonite later if Ice and Fairy are gone." },
    ],
    plan: [
      {
        title: "Clock",
        goal: "Swords Dance behind Disguise, or break with Excadrill. Not Dragonite.",
        play: "Lead Mimikyu into Fake Out, Fighting, or Dragon. Lead Excadrill into Steel, Rock, or Electric. Lead Mimikyu into Fire or Water — those hits deal double to Excadrill. Never send Dragonite first.",
        next: "Disguise blocks the first damaging hit. Swords Dance that turn. Then Play Rough or Shadow Sneak. If Excadrill lives on Focus Sash, Swords Dance, then Earthquake, Iron Head, or Stone Edge.",
      },
      {
        title: "Shield",
        goal: "Get Mimikyu off Ghost and Steel. Keep Dragonite at full health.",
        play: "Ghost or Steel onto Mimikyu: send Excadrill. Ice onto Dragonite: send Mimikyu or Excadrill, never stay. Fairy onto Dragonite: send Excadrill and click Iron Head. Fire, Water, or Fighting onto Excadrill: send Mimikyu. Fighting does nothing to Ghost. Fire and Water deal normal damage to Mimikyu.",
        next: "Life Orb recoil starts after Disguise pops. Do not sit a second Fire or Water for free.",
      },
      {
        title: "Clean",
        goal: "Dragon Dance, then Outrage or Extreme Speed.",
        play: "Send Dragonite only after Ice and Fairy are gone or badly damaged. Dragon Dance into Protect or a free turn. Outrage if the last two Pokémon cannot switch in a Fairy. Extreme Speed is Normal priority — it does nothing to Ghost. Mimikyu Shadow Sneak is the Ghost revenge.",
        next: "Outrage locks you in. A Fairy switch knocks Dragonite out. Multiscale is gone after the first chip.",
      },
    ],
    skills: ["Disguise", "Swords Dance", "Fake Out"],
    relatedLessons: ["abilities", "moves", "preview"],
    setsNote:
      "Each Pokémon spends 66 Stat Points. One point is +1 to that stat at Level 50. You may put at most 32 in a single stat. Mimikyu puts 32 in Attack and 32 in Speed so Play Rough hits hard and, after Swords Dance, Mimikyu usually moves first against bulky Pokémon. Excadrill does the same — Focus Sash is the live, leftover 2 goes in HP. Dragonite puts 32 in Attack and 32 in Speed so one Dragon Dance is enough to move first. Leftover 2 in HP: Multiscale only works at full health.",
    slots: [
      {
        slug: "mimikyu-disguised",
        title: "The Costume",
        job: "breaker",
        literacy: "wallbreaker",
        role: "Lead into Fake Out, Fighting, or Dragon. Swords Dance behind Disguise. Sit Fire and Water that would KO Excadrill.",
        ability: "Disguise",
        item: "Life Orb",
        itemWhy:
          "Disguise is the live. After the costume pops you need the knockout. Life Orb makes Play Rough and Shadow Sneak hit hard enough to finish. Leftovers does not cash the Dance.",
        itemAlts: [
          { name: "Lum Berry", why: "Use when they have Will-O-Wisp or Thunder Wave. Status still lands through Disguise. Lum clears it so Swords Dance still happens." },
          { name: "Mental Herb", why: "Use when they have Taunt. Taunt stops Swords Dance. Herb eats the Taunt once." },
          { name: "Fairy Feather", why: "Use when you want stronger Play Rough without Life Orb recoil. Ghost attacks are weaker. Send Excadrill into Steel." },
          { name: "Kasib Berry", why: "Use when you must stay in against Ghost after Disguise pops. Prefer switching to Excadrill." },
        ],
        nature: "Jolly",
        training: train(2, 32, 0, 0, 0, 32, {
          label: "Disguise Dance",
          why: "Put 32 Speed so after Swords Dance you usually move first against bulky Pokémon. You still lose to a Garchomp that also put 32 in Speed — when you see that Garchomp, do not try to outrun it with Mimikyu; send Excadrill or keep Dragonite in the bag until Ice is gone. Put 32 Attack so Play Rough and Shadow Sneak KO. Leftover 2 in HP. Disguise is the one free hit — extra HP does not save Ghost or Steel after the costume pops.",
          spend: [
            "32 Spe — after Swords Dance, Mimikyu usually moves first against bulky Pokémon. Do not race a Garchomp that also put 32 in Speed.",
            "32 Atk — Play Rough into Dragon and Fighting. Shadow Sneak for revenge.",
            "2 HP — leftover. Disguise is the live. Bulk does not beat Ghost or Steel once the costume is gone.",
          ],
        }, [
          alt("Adamant punch", 2, 32, 0, 0, 0, 32, "Use when their lead is slow — Kingambit or Incineroar — and you need the extra Attack. Adamant with 32 Speed still beats those. Do not pick this if you expect a Garchomp that put 32 in Speed.", [
            "32 Atk — Adamant, not Jolly. The Dance KO.",
            "32 Spe — still faster than bulky leads. Not faster than a Speed-capped Garchomp.",
            "2 HP — leftover. Disguise is still the live.",
          ]),
        ]),
        moves: [
          { name: "Swords Dance", why: "Disguise is the turn. Next hit is the KO. Do not Dance into a guaranteed Ghost or Steel." },
          { name: "Play Rough", why: "Fairy STAB. Hits Dragon and Fighting. You are immune to Dragon — you can lead that." },
          { name: "Shadow Sneak", why: "Ghost priority. Revenge, and the Ghosts Extreme Speed cannot touch." },
          {
            name: "Shadow Claw",
            why: "Ghost STAB when you already outspeed. Stronger than Shadow Sneak if the Dance won the race.",
            alts: [
              { name: "Wood Hammer", why: "Use when they have Water or Ground that resists Play Rough. Recoil starts after Disguise is gone. One click, then leave." },
              { name: "Drain Punch", why: "Do not. Fighting is weak on Steel. Excadrill Iron Head is the Steel answer." },
            ],
          },
        ],
        objective: "Lead into Fake Out, Fighting, Dragon. Sit Fire and Water that would KO Excadrill. Leave Ghost and Steel.",
        howToPlay:
          "Lead vs Fake Out, Fighting, or Dragon. Ghost ignores Fake Out and Fighting. Fairy ignores Dragon.\nFire and Water deal normal damage to Mimikyu. They deal double to Excadrill — sit them here.\nGhost and Steel deal double to Mimikyu after Disguise pops — leave to Excadrill. Mold Breaker Iron Head pops their Mimikyu.\nDisguise is one damaging hit. Status still lands. Life Orb recoil starts after the costume pops.",
      },
      {
        slug: "excadrill",
        title: "The Drill",
        job: "breaker",
        literacy: "wallbreaker",
        role: "Default physical lead. Mold Breaker. Sash Dance. The answer to their Mimikyu.",
        ability: "Mold Breaker",
        item: "Focus Sash",
        itemWhy: "You live one hit, Swords Dance, then KO. Matches the 2 HP spread. Leftovers does not survive Fire, Water, or Fighting.",
        itemAlts: [
          { name: "Life Orb", why: "Use when they are slow — Kingambit or Trick Room — and you already move first. Skip the Dance and punch. Recoil is real. Do not also give Mimikyu Life Orb unless both need the extra damage." },
          { name: "Choice Scarf", why: "Use when you must outrun a Garchomp that put 32 in Speed. You lock into one move. Mimikyu is the Disguise dancer; Excadrill is revenge. Do not Swords Dance in the scarf." },
          { name: "Occa Berry", why: "Use when you already sent Excadrill into Fire and still need Iron Head on their Mimikyu. Prefer switching to Mimikyu — Fire deals normal damage there." },
        ],
        nature: "Jolly",
        training: train(2, 32, 0, 0, 0, 32, {
          label: "Sash Dance lead",
          why: "Put 32 Speed so after Focus Sash you can Swords Dance and then usually attack first against bulky Pokémon. When you see a Garchomp that also put 32 in Speed, do not try to outrun it with this spread; send Mimikyu or keep Dragonite until Ice is gone. Put 32 Attack so Earthquake and Iron Head KO. Leftover 2 in HP. Focus Sash is the live — extra HP would not save Fire, Water, or Fighting.",
          spend: [
            "32 Spe — Dance, then KO before they click Fire, Water, or Fighting. Do not race a Speed-capped Garchomp with this spread.",
            "32 Atk — Earthquake into Kingambit. Iron Head into Fairy and their Mimikyu.",
            "2 HP — leftover. Sash is the one live. Bulk does not beat Fire, Water, or Fighting.",
          ],
        }, [
          alt("They are slow", 20, 32, 14, 0, 0, 0, "Use when their lead is Kingambit or Trick Room and you already move first. Move Speed into HP and Defense so Sash is not the only live — you can skip Dance and punch.", [
            "32 Atk — still Earthquake the truck.",
            "20 HP / 14 Def — sit a hit if they are slower.",
            "0 Spe — you already outspeed Kingambit.",
          ]),
        ]),
        moves: [
          {
            name: "Swords Dance",
            why: "Sash is the turn. Next hit is the KO. Do not Dance into a guaranteed Fire, Water, or Fighting.",
            alts: [{ name: "Rapid Spin", why: "Use when they set Stealth Rock and you kept Stone Edge. Mimikyu already Dances. You sash-punch, then Spin so Dragonite still has Multiscale." }],
          },
          {
            name: "Earthquake",
            why: "Ground STAB. vs Kingambit click Earthquake — not Iron Head. Steel resists Steel.",
          },
          { name: "Iron Head", why: "Steel STAB into Fairy and Ice. Flinch is a gift, not the plan. Mold Breaker pops their Mimikyu." },
          {
            name: "Stone Edge",
            why: "Flying. One target — not Rock Slide. Keep this. Mimikyu Play Rough deals normal damage to Flying, and you have no Ice move.",
            alts: [
              { name: "Rapid Spin", why: "Stealth Rock chips Dragonite and ends Multiscale. Do not drop Stone Edge for birds. Swap Swords Dance for Spin instead: sash-punch, Mimikyu is the dancer." },
              { name: "Rock Slide", why: "Do not. One target, one Stone Edge." },
            ],
          },
        ],
        objective: "Lead into physical, Steel, Rock, Electric. Punch their Mimikyu. Leave Fire, Water, Fighting, Ground.",
        howToPlay:
          "Lead vs physical, Steel, Rock, or Electric. Ground is immune to Electric.\nvs Kingambit: Earthquake. Iron Head is resisted.\nvs Mimikyu: Iron Head. Mold Breaker ignores Disguise. Earthquake deals normal Ground damage.\nFire, Water, Fighting, Ground: leave. Fighting to Mimikyu (Ghost ignores it). Fire and Water to Mimikyu (normal damage).\nDragon is fine on Excadrill — Steel resists Dragon. Sand Rush needs sand. This three has no sand setter.",
      },
      {
        slug: "dragonite",
        title: "The Kite",
        job: "breaker",
        literacy: "sweeper",
        role: "Late wincon. Hidden until Ice and Fairy are gone.",
        ability: "Multiscale",
        item: "Lum Berry",
        itemWhy: "Multiscale only works at full HP. Status or Outrage confusion ends the sweep. Lum is the one clean Dragon Dance.",
        itemAlts: [
          { name: "Heavy-Duty Boots", why: "Use when they set Stealth Rock. Rock chips Flying and ends Multiscale. Boots keeps Dragonite at full until Dance." },
        ],
        nature: "Adamant",
        training: train(2, 32, 0, 0, 0, 32, {
          label: "Multiscale kite",
          why: "Never the lead. Put 32 Speed so one Dragon Dance usually lets Dragonite move first. Put 32 Attack so Outrage and Extreme Speed KO. Leftover 2 in HP. Extra HP does not restore Multiscale — it is full HP or it is gone.",
          spend: [
            "32 Spe — one Dragon Dance is the sweep. You usually move first after that boost.",
            "32 Atk — Outrage and Extreme Speed.",
            "2 HP — leftover. HP after the first chip does not bring Multiscale back.",
          ],
        }, [
          alt("You always Dance", 20, 32, 0, 0, 0, 14, "Use when the free turn is real every game. Put less in Speed and more in HP so the first chip after Multiscale drops does not KO.", [
            "32 Atk — still Outrage and Extreme Speed.",
            "20 HP — live the hit after Multiscale is gone.",
            "14 Spe — enough if the free Dragon Dance is guaranteed.",
          ]),
        ]),
        moves: [
          { name: "Dragon Dance", why: "The free turn. Protect branch. Multiscale still up if you are full." },
          {
            name: "Outrage",
            why: "The sweep click. You lock. A Fairy switch ends Dragonite.",
            alts: [{ name: "Dragon Claw", why: "If you fear the Fairy switch. Less damage. You can leave." }],
          },
          { name: "Earthquake", why: "Steel that resists Dragon. Grounded leftovers. Hits Ghost — Extreme Speed does not." },
          {
            name: "Extreme Speed",
            why: "Normal priority. Revenge after Dance. Ghost is immune — Mimikyu Shadow Sneak is that revenge.",
          },
        ],
        objective: "Never the lead. Dance, then Outrage or Extreme Speed. Keep Multiscale for one hit.",
        howToPlay:
          "Do not lead. Hide until Ice and Fairy are gone or badly damaged.\nIce hits Dragonite four times as hard. Mimikyu and Excadrill take normal Ice damage — they do not resist it. Preview is where you refuse to send Dragonite.\nMultiscale only on full HP. Fake Out still flinches — send Mimikyu into Incineroar, not Dragonite. Ghost ignores Fake Out.\nOutrage locks. Extreme Speed is Normal — do not click it into Ghost.",
      },
    ],
    phases: [
      {
        id: "preview",
        title: "Preview",
        lede: "One send. Name Mimikyu or Excadrill. Dragonite stays in the bag.",
        branches: [
          { when: "Fake Out, Fighting, or Dragon", then: "Mimikyu. Ghost ignores Fake Out and Fighting. Fairy ignores Dragon." },
          { when: "Physical, Steel, Rock, or Electric", then: "Excadrill. Mold Breaker. Focus Sash. Ground ignores Electric." },
          { when: "Fire or Water", then: "Mimikyu. Those hits deal normal damage. They deal double to Excadrill. Sit, then Swords Dance." },
          { when: "Ice or Fairy still healthy", then: "Keep Dragonite back. Nobody resists Ice. Patch with Mimikyu or Excadrill first." },
          { when: "Kingambit on their three", then: "Excadrill. Earthquake — not Iron Head. Steel resists Steel." },
          { when: "Their Mimikyu", then: "Excadrill Iron Head. Mold Breaker ignores Disguise." },
        ],
      },
      {
        id: "lead",
        title: "Lead",
        lede: "Mimikyu or Excadrill. Dragonite is not here yet.",
        branches: [
          { out: "mimikyu-disguised", when: "Fake Out coming", then: "Stay. Ghost ignores it. Then Swords Dance." },
          { out: "mimikyu-disguised", when: "Dragon or Fighting", then: "Play Rough. You are immune." },
          { out: "mimikyu-disguised", when: "They Protect or Disguise still up", then: "Swords Dance. Disguise is the turn." },
          { out: "mimikyu-disguised", when: "Ghost or Steel coming", then: "Leave to Excadrill. You take double." },
          { out: "mimikyu-disguised", when: "Need revenge on a Ghost", then: "Shadow Sneak. Extreme Speed is Normal." },
          { out: "excadrill", when: "Kingambit or a Steel that resists Iron Head", then: "Earthquake. Steel resists Steel." },
          { out: "excadrill", when: "Fairy or their Mimikyu", then: "Iron Head. Mold Breaker pops Disguise." },
          { out: "excadrill", when: "Flying", then: "Stone Edge. Not Rock Slide." },
          { out: "excadrill", when: "They Protect or you live the hit", then: "Swords Dance. Sash is the turn." },
          { out: "excadrill", when: "Fire, Water, Fighting, or Ground coming", then: "Leave to Mimikyu. Ghost ignores Fighting. Fire and Water deal normal damage. Ground deals normal damage to Mimikyu." },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Get Mimikyu off Ghost and Steel. Do not send Dragonite yet.",
        branches: [
          { out: "mimikyu-disguised", when: "Ghost or Steel onto Mimikyu", then: "Excadrill. Steel resists Ghost. Iron Head the Fairy." },
          { out: "mimikyu-disguised", when: "Disguise popped, Life Orb recoil stacking", then: "You are glass now. KO or leave. Do not farm Fire or Water." },
          { out: "excadrill", when: "Fire, Water, or Fighting onto Excadrill", then: "Mimikyu. Ghost ignores Fighting. Fire and Water deal normal damage." },
          { out: "excadrill", when: "Physical wall sitting on Excadrill", then: "Mimikyu Dance, or Dragonite later if Ice and Fairy are gone." },
          { out: "dragonite", when: "Ice onto Dragonite", then: "Mimikyu or Excadrill. Both take normal Ice. You mis-sent if this is a full Ice Beam." },
          { out: "dragonite", when: "Fairy onto Dragonite", then: "Excadrill. Iron Head." },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Ice and Fairy gone or badly damaged. Then Dragonite.",
        branches: [
          { out: "dragonite", when: "Ice and Fairy gone or badly damaged", then: "Dragon Dance, then Outrage or Extreme Speed." },
          { out: "dragonite", when: "They Protect", then: "Dragon Dance. Multiscale still wants full HP." },
          { out: "dragonite", when: "Ghost in", then: "Earthquake, or leave to Mimikyu Shadow Sneak. Extreme Speed is Normal." },
          { out: "dragonite", when: "Steel leftover", then: "Earthquake. Outrage is resisted." },
          { out: "dragonite", when: "Outrage locked, Fairy switches in", then: "The sweep is over. Dragon Claw is the alt if you feared this." },
          { out: "dragonite", when: "Multiscale broken", then: "You take real damage now. Do not eat a second hit for free." },
          { out: "mimikyu-disguised", when: "Disguise still in, a wall left", then: "Swords Dance and Play Rough. Dragonite can wait one more KO." },
          { out: "excadrill", when: "Sash still in, a wall left", then: "Swords Dance and break. Dragonite can wait one more KO." },
        ],
      },
    ],
    flows: [
      {
        id: "lead",
        title: "Lead",
        lede: "Preview their three. One send. Dragonite never walks in first.",
        forks: [
          {
            id: "lead-mimi",
            when: "Fake Out, Fighting, or Dragon",
            then: "Lead Mimikyu. Ghost ignores Fake Out and Fighting. Fairy ignores Dragon.",
            send: "mimikyu-disguised",
            forks: [
              {
                id: "lead-mimi-fo",
                when: "Fake Out coming",
                then: "Stay. Ghost ignores it. Then Swords Dance.",
                move: "Swords Dance",
                send: "mimikyu-disguised",
                why: "Incineroar's Fake Out does nothing to Ghost. Do not send Dragonite into Incineroar.",
              },
              {
                id: "lead-mimi-fairy",
                when: "Dragon or Fighting",
                then: "Play Rough. You are immune.",
                move: "Play Rough",
                send: "mimikyu-disguised",
              },
              {
                id: "lead-mimi-dance",
                when: "They Protect or Disguise still up",
                then: "Swords Dance. Disguise is the turn.",
                move: "Swords Dance",
                send: "mimikyu-disguised",
              },
              {
                id: "lead-mimi-leave",
                when: "Ghost or Steel coming",
                then: "Leave to Excadrill. You take double.",
                send: "excadrill",
                why: "Steel resists Ghost. Iron Head pops Fairy and their Mimikyu.",
              },
            ],
          },
          {
            id: "lead-fw",
            when: "Fire or Water",
            then: "Lead Mimikyu. Fire and Water deal normal damage to Mimikyu. They deal double to Excadrill.",
            send: "mimikyu-disguised",
            forks: [
              {
                id: "lead-fw-dance",
                when: "Disguise eats the first Fire or Water",
                then: "Swords Dance, then Play Rough or leave. Life Orb recoil starts next hit.",
                move: "Swords Dance",
                send: "mimikyu-disguised",
              },
            ],
          },
          {
            id: "lead-drill",
            when: "Physical, Steel, Rock, or Electric",
            then: "Lead Excadrill. Mold Breaker. Focus Sash. Ground ignores Electric.",
            send: "excadrill",
            forks: [
              {
                id: "lead-drill-eq",
                when: "Kingambit or a Steel that resists Iron Head",
                then: "Earthquake. Steel resists Steel.",
                move: "Earthquake",
                send: "excadrill",
              },
              {
                id: "lead-drill-mimi",
                when: "Fairy or their Mimikyu",
                then: "Iron Head. Mold Breaker ignores Disguise.",
                move: "Iron Head",
                send: "excadrill",
                why: "Earthquake deals normal Ground damage to Mimikyu. Iron Head is the pop.",
              },
              {
                id: "lead-drill-flying",
                when: "Flying",
                then: "Stone Edge. Not Rock Slide.",
                move: "Stone Edge",
                send: "excadrill",
              },
              {
                id: "lead-drill-dance",
                when: "They Protect or you live the hit",
                then: "Swords Dance. Sash is the turn.",
                move: "Swords Dance",
                send: "excadrill",
              },
              {
                id: "lead-drill-leave",
                when: "Fire, Water, Fighting, or Ground coming",
                then: "Leave to Mimikyu. Ghost ignores Fighting. Fire and Water deal normal damage.",
                send: "mimikyu-disguised",
                why: "Dragon is fine on Excadrill — Steel resists Dragon.",
              },
            ],
          },
          {
            id: "lead-hide",
            when: "Ice or Fairy still healthy",
            then: "Keep Dragonite back. Patch with Mimikyu or Excadrill first.",
            why: "Ice hits Dragonite four times as hard. Mimikyu and Excadrill take normal Ice damage. They do not resist it. Fairy ends Outrage. Fake Out still flinches Multiscale — send Mimikyu into Incineroar.",
          },
        ],
      },
      {
        id: "mid",
        title: "Mid",
        lede: "Get Mimikyu off Ghost and Steel. Do not send Dragonite yet.",
        forks: [
          {
            id: "mid-mimi",
            when: "This Pokémon is out",
            out: "mimikyu-disguised",
            forks: [
              {
                id: "mid-mimi-ghost-steel",
                when: "Ghost or Steel onto Mimikyu",
                then: "Excadrill. Steel resists Ghost. Iron Head the Fairy.",
                send: "excadrill",
              },
              {
                id: "mid-mimi-popped",
                when: "Disguise popped, Life Orb recoil stacking",
                then: "You are glass now. KO or leave. Do not farm Fire or Water.",
                send: "mimikyu-disguised",
              },
            ],
          },
          {
            id: "mid-drill",
            when: "This Pokémon is out",
            out: "excadrill",
            forks: [
              {
                id: "mid-drill-fwf",
                when: "Fire, Water, or Fighting onto Excadrill",
                then: "Mimikyu. Ghost ignores Fighting. Fire and Water deal normal damage.",
                send: "mimikyu-disguised",
              },
              {
                id: "mid-drill-wall",
                when: "Physical wall sitting on Excadrill",
                then: "Mimikyu Dance, or Dragonite later if Ice and Fairy are gone.",
                send: "mimikyu-disguised",
              },
            ],
          },
          {
            id: "mid-nite",
            when: "This Pokémon is out",
            out: "dragonite",
            forks: [
              {
                id: "mid-nite-ice",
                when: "Ice onto Dragonite",
                then: "Mimikyu or Excadrill. Both take normal Ice.",
                send: "mimikyu-disguised",
                why: "Ice hits Dragonite four times as hard. You mis-sent if this is a full Ice Beam.",
              },
              {
                id: "mid-nite-fairy",
                when: "Fairy onto Dragonite",
                then: "Excadrill. Iron Head.",
                send: "excadrill",
              },
            ],
          },
        ],
      },
      {
        id: "late",
        title: "Late",
        lede: "Ice and Fairy gone or badly damaged. Then Dragon Dance.",
        forks: [
          {
            id: "late-nite",
            when: "This Pokémon is out",
            out: "dragonite",
            forks: [
              {
                id: "late-nite-go",
                when: "Ice and Fairy gone or badly damaged",
                then: "Dragon Dance, then Outrage or Extreme Speed.",
                move: "Dragon Dance",
                send: "dragonite",
              },
              {
                id: "late-nite-protect",
                when: "They Protect",
                then: "Dragon Dance. Multiscale still wants full HP.",
                move: "Dragon Dance",
                send: "dragonite",
              },
              {
                id: "late-nite-ghost",
                when: "Ghost in",
                then: "Earthquake, or leave to Mimikyu Shadow Sneak. Extreme Speed is Normal.",
                move: "Earthquake",
                send: "dragonite",
              },
              {
                id: "late-nite-steel",
                when: "Steel leftover",
                then: "Earthquake. Outrage is resisted.",
                move: "Earthquake",
                send: "dragonite",
              },
              {
                id: "late-nite-fairy-lock",
                when: "Outrage locked, Fairy switches in",
                then: "The sweep is over. Dragon Claw is the alt if you feared this.",
                move: "Outrage",
              },
              {
                id: "late-nite-scale",
                when: "Multiscale broken",
                then: "You take real damage now. Do not eat a second hit for free.",
                send: "dragonite",
              },
            ],
          },
          {
            id: "late-mimi",
            when: "This Pokémon is out",
            out: "mimikyu-disguised",
            forks: [
              {
                id: "late-mimi-dance",
                when: "Disguise still in, a wall left",
                then: "Swords Dance and Play Rough. Dragonite can wait one more KO.",
                move: "Swords Dance",
                send: "mimikyu-disguised",
              },
            ],
          },
          {
            id: "late-drill",
            when: "This Pokémon is out",
            out: "excadrill",
            forks: [
              {
                id: "late-drill-sash",
                when: "Sash still in, a wall left",
                then: "Swords Dance and break. Dragonite can wait one more KO.",
                move: "Swords Dance",
                send: "excadrill",
              },
            ],
          },
        ],
      },
    ],
    loops: [
      { title: "Disguise Dance", body: "Mimikyu eats one damaging hit. Swords Dance. Next hit is Play Rough or Shadow Sneak. Status still lands. Life Orb recoil starts after the costume pops." },
      { title: "Sash Dance", body: "Excadrill lives on Focus Sash. Swords Dance. Next hit is Earthquake, Iron Head, or Stone Edge — one target. Iron Head pops their Mimikyu." },
      { title: "Multiscale Dance", body: "Full HP Dragonite in. Dragon Dance on a free turn. Outrage if Fairy is gone. Extreme Speed the revenge — not Ghost. Mimikyu Shadow Sneak is the Ghost revenge." },
    ],
    victims: [
      { name: "Incineroar Fake Out", why: "Ghost ignores Fake Out. Send Mimikyu. Then Swords Dance." },
      { name: "Fighting", why: "Ghost ignores Fighting. Mimikyu Play Rough hits Fighting for super-effective damage." },
      { name: "Dragon", why: "Fairy ignores Dragon. Mimikyu Play Rough hits Dragon for super-effective damage." },
      { name: "Kingambit", why: "Excadrill Earthquake. Do not Iron Head — Steel resists Steel." },
      { name: "Their Mimikyu", why: "Excadrill Iron Head. Mold Breaker ignores Disguise." },
    ],
    counters: [
      { name: "Ice Beam / Ice Shard", why: "Ice hits Dragonite four times as hard. Send Mimikyu or Excadrill. Both take normal Ice. They do not resist it." },
      { name: "Ghost or Steel after Disguise pops", why: "Both deal double to Mimikyu once the costume is gone. Switch to Excadrill." },
      { name: "Their Mold Breaker Excadrill", why: "Mold Breaker ignores your Disguise. Do not lead Mimikyu into it. Send your Excadrill." },
      { name: "Fairy into Outrage", why: "Outrage locks Dragonite. A Fairy switch knocks it out. Click Dragon Claw if Fairy is still in their bag, or send Excadrill Iron Head." },
      { name: "Fire / Water into Excadrill", why: "Both deal double. Switch to Mimikyu. Those hits deal normal damage there." },
    ],
    advantages: [
      { title: "Mimikyu vs Fighting", body: "Ghost ignores Fighting. Play Rough is super-effective. This is a lead you want." },
      { title: "Mimikyu vs Fake Out", body: "Ghost ignores Fake Out. Disguise still blocks the next damaging hit. Swords Dance that turn." },
      { title: "Mimikyu vs Dragon", body: "Fairy ignores Dragon. Play Rough is super-effective. You can lead this." },
      { title: "Excadrill vs their Mimikyu", body: "Mold Breaker ignores Disguise. Iron Head pops the costume and hits Fairy." },
      { title: "Excadrill vs Kingambit", body: "Earthquake is super-effective Ground. Iron Head is resisted. This is why Excadrill is on the three." },
      { title: "Dragonite after Ice and Fairy are gone", body: "One Dragon Dance, then Outrage or Extreme Speed. Keep it in the bag until that moment." },
    ],
    hazards: [
      { title: "Ice into Dragonite", body: "Ice hits Dragonite four times as hard. Mimikyu and Excadrill take normal Ice — they do not resist it. Keep Dragonite in the bag. Send Mimikyu or Excadrill first." },
      { title: "Ghost / Steel into Mimikyu", body: "Both deal double once Disguise is gone. Switch to Excadrill. Do not Swords Dance into a guaranteed Iron Head or Shadow Ball." },
      { title: "Their Mold Breaker Excadrill", body: "Mold Breaker ignores your Disguise. Do not lead Mimikyu into it." },
      { title: "Outrage lock", body: "A Fairy switch knocks Dragonite out. Click Dragon Claw if Fairy is still in their bag." },
      { title: "Fake Out into Dragonite", body: "Multiscale still flinches. Send Mimikyu into Incineroar. Ghost ignores Fake Out." },
      { title: "Fire / Water / Fighting into Excadrill", body: "All deal double. Switch to Mimikyu. Ghost ignores Fighting. Fire and Water deal normal damage there. Dragon is fine on Excadrill — Steel resists Dragon." },
      { title: "Life Orb after Disguise", body: "The costume is one hit. Recoil and the next attack both land on a small HP pool. KO or leave." },
    ],
  },
];

export function getCanonicalManual(id: string) {
  return CANONICAL_MANUALS.find((m) => m.id === id);
}

export function isCanonicalManualId(id: string) {
  return CANONICAL_MANUALS.some((m) => m.id === id);
}

export function manualsFeaturing(slug: string) {
  return CANONICAL_MANUALS.filter(
    (m) => m.slugs.includes(slug) || m.slots.some((s) => s.slug === slug),
  );
}

export function manualsForArchetype(id: string) {
  return CANONICAL_MANUALS.filter((m) => m.archetype === id);
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
    family: "clock",
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
    plan: [
      { title: "", goal: "", play: "" },
      { title: "", goal: "", play: "" },
      { title: "", goal: "", play: "" },
    ],
    loops: [{ title: "", body: "" }],
    hazards: [{ title: "", body: "" }],
  };
}
