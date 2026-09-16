import type { ArchetypeId, LiteracyRoleId, RoleId, SampleSp } from "@/types/pokemon";
import { alt, train } from "@/content/manual-train";
import { OVERLORD_PIVOT_MANUAL } from "@/content/manuals/overlord-pivot";
import { PRESSURE_BALANCE_MANUAL } from "@/content/manuals/pressure-balance";
import { CLOCKWORK_BALANCE_MANUAL } from "@/content/manuals/clockwork-balance";

export { alt, train };

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
  label?: string;
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

export type ManualBranch = {
  when: string;
  then: string;
  why?: string;
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
  watch?: string;
  play?: string;
  rule?: string;
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

/**
 * First-class preview counter-plan: identify what their six bullies,
 * then bring the three that bully that structure back.
 */
export type ManualPackStrategy = {
  /** What their six is trying to bully you with (preview read). */
  opponentPattern: string;
  /** The three selected from the registered six. */
  bring: [string, string, string];
  /** Why this package answers that pattern. */
  purpose: string;
  /** Structures / threats this package attacks. */
  targets: string[];
  /** Structures where you should refuse this package. */
  refuses: string[];
  /** How this three wins once selected. */
  winCondition: string;
};

/** One preview bring of three from the registered six. */
export type ManualPack = {
  id: string;
  label: string;
  when: string;
  identity: string;
  slugs: [string, string, string];
  /** Explicit reason for choosing this three from six. */
  strategy?: ManualPackStrategy;
  pilot?: ManualPilot;
  meta?: string;
  philosophy?: string;
  press?: string[];
  refuse?: string[];
  switches?: ManualSwitch[];
  plan?: ManualPlanBeat[];
  victims?: ManualMatchup[];
  counters?: ManualMatchup[];
  advantages?: ManualNote[];
  phases?: ManualPhase[];
  flows?: ManualFlow[];
  loops: { title: string; body: string }[];
  hazards: ManualNote[];
};

/** Resolve authored strategy, or derive a thin one from pack fields. */
export function resolvePackStrategy(pack: ManualPack): ManualPackStrategy {
  if (pack.strategy) return pack.strategy;
  return {
    opponentPattern: pack.when,
    bring: pack.slugs,
    purpose: pack.identity,
    targets: pack.press ?? [],
    refuses: pack.refuse ?? [],
    winCondition: pack.pilot?.thesis ?? pack.philosophy ?? pack.identity,
  };
}

export type TeamManual = {
  id: string;
  title: string;
  lede: string;
  philosophy: string;
  archetype: ArchetypeId;
  family?: ManualFamilyId;
  pilot?: ManualPilot;
  /** Resolved active three — filled by resolveManual for boxed manuals. */
  slugs: [string, string, string];
  meta: string;
  press?: string[];
  refuse?: string[];
  switches?: ManualSwitch[];
  plan?: ManualPlanBeat[];
  skills?: string[];
  relatedLessons?: string[];
  setsNote?: string;
  victims?: ManualMatchup[];
  counters?: ManualMatchup[];
  advantages?: ManualNote[];
  /** Resolved active slots — filled by resolveManual for boxed manuals. */
  slots: SlotManual[];
  phases: ManualPhase[];
  flows?: ManualFlow[];
  loops: { title: string; body: string }[];
  hazards: ManualNote[];
  /** Registered six for Champions preview. */
  box?: [string, string, string, string, string, string] | string[];
  /** All six sets once. Packs reference by slug. */
  roster?: SlotManual[];
  /** Default identity three. */
  core?: [string, string, string];
  /** Preview packs — threes drawn from the box. */
  packs?: ManualPack[];
};

export function packList(manual: TeamManual): ManualPack[] {
  return manual.packs ?? [];
}

function slotsForPack(manual: TeamManual, slugs: [string, string, string]): SlotManual[] {
  const roster = manual.roster ?? manual.slots;
  const bySlug = new Map(roster.map((s) => [s.slug, s]));
  return slugs.map((slug) => {
    const hit = bySlug.get(slug);
    if (hit) return hit;
    return {
      slug,
      title: slug,
      job: "breaker" as RoleId,
      role: "",
      moves: [],
      objective: "",
      howToPlay: "",
    };
  });
}

/** Overlay a preview pack. Parent id / title / box / roster / packs stay. */
export function resolveManual(manual: TeamManual, packId?: string | null): TeamManual {
  const packs = packList(manual);
  if (!packs.length) return manual;
  const pack = (packId ? packs.find((p) => p.id === packId) : undefined) ?? packs[0];
  if (!pack) return manual;
  const resolvedSlots = manual.roster?.length
    ? slotsForPack(manual, pack.slugs)
    : manual.slots.length === 3 && manual.slots.every((s, i) => s.slug === pack.slugs[i])
      ? manual.slots
      : slotsForPack(manual, pack.slugs);

  return {
    ...manual,
    slugs: pack.slugs,
    slots: resolvedSlots,
    pilot: pack.pilot ?? manual.pilot,
    meta: pack.meta ?? manual.meta,
    philosophy: pack.philosophy ?? manual.philosophy,
    press: pack.press ?? manual.press,
    refuse: pack.refuse ?? manual.refuse,
    switches: pack.switches ?? manual.switches,
    plan: pack.plan ?? manual.plan,
    victims: pack.victims ?? manual.victims,
    counters: pack.counters ?? manual.counters,
    advantages: pack.advantages ?? manual.advantages,
    phases: pack.phases ?? manual.phases,
    flows: pack.flows ?? manual.flows,
    loops: pack.loops,
    hazards: pack.hazards,
  };
}

export function defaultPackId(manual: TeamManual): string | undefined {
  const packs = packList(manual);
  if (!packs.length) return undefined;
  if (manual.core) {
    const coreKey = [...manual.core].sort().join("|");
    const match = packs.find((p) => [...p.slugs].sort().join("|") === coreKey);
    if (match) return match.id;
  }
  return packs[0]?.id;
}

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
  CLOCKWORK_BALANCE_MANUAL,
  PRESSURE_BALANCE_MANUAL,
  OVERLORD_PIVOT_MANUAL,
];

export function getCanonicalManual(id: string) {
  return CANONICAL_MANUALS.find((m) => m.id === id);
}

export function isCanonicalManualId(id: string) {
  return CANONICAL_MANUALS.some((m) => m.id === id);
}

export function manualsFeaturing(slug: string) {
  return CANONICAL_MANUALS.filter((m) => {
    if (m.slugs.includes(slug) || m.slots.some((s) => s.slug === slug)) return true;
    if (m.box?.includes(slug)) return true;
    if (m.roster?.some((s) => s.slug === slug)) return true;
    return packList(m).some((p) => p.slugs.includes(slug));
  });
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
    loops: [{ title: "", body: "Use when you need this sequence. " }],
    hazards: [
      {
        title: "",
        body: "",
        watch: "",
        play: "Answer  immediately using the switch board and plan.",
        rule: "Do not ignore  — it ends games on this three.",
      },
    ],
  };
}
