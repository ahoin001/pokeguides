import type { ArchetypeId, LiteracyRoleId, RoleId, SampleSp } from "@/types/pokemon";
import { alt, train } from "@/content/manual-train";
import { ULTRA_GARCHOMPZ_SALAMENCE_GHOLDENGO_MANUAL } from "@/content/manuals/ultra-garchompz-salamence-gholdengo";

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
  /** Nature / SP rule of thumb (e.g. Modest until a 204 Spe target appears). */
  rule?: string;
  label?: string;
  spend?: string[];
  alts?: SlotTrainingAlt[];
};

/** Alternate job for one species on the registered six (e.g. Mega / Scarf / Sash Garchomp). */
export type SlotMode = {
  id: string;
  label: string;
  /** Short job name shown in the mode picker. */
  job: string;
  /** When preview should pick this mode. */
  when: string;
  item: string;
  itemWhy?: string;
  nature?: string;
  training?: SlotTraining;
  moves: MoveNote[];
  objective?: string;
  howToPlay?: string;
};

export type SlotManual = {
  slug: string;
  title: string;
  job: RoleId;
  literacy?: LiteracyRoleId;
  role: string;
  /** Freeform six-table job (e.g. "Special breaker / speed"). */
  primaryJob?: string;
  ability?: string;
  item?: string;
  itemWhy?: string;
  itemAlts?: MoveAlt[];
  nature?: string;
  training?: SlotTraining;
  moves: MoveNote[];
  objective: string;
  howToPlay: string;
  /** What this slot gives the win condition / six (Fairy resist, priority, etc.). */
  gives?: string[];
  /** Threats this slot answers for the primary wincon. */
  answers?: string[];
  /**
   * Distinct preview identities for the same species.
   * Default item/moves remain the teaching baseline; modes are the real decision tree.
   */
  modes?: SlotMode[];
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
  /** Short chain: Break → Control → Finish. */
  gamePlan?: string;
  /** Preferred Mega for this bring when the six has multiple stones. */
  megaChoice?: string;
  /** Acceptable Mega options when preview still leaves ambiguity. */
  megaOptions?: string[];
  /** Which mode of a multi-mode species this pack wants (e.g. garchomp sash). */
  winconMode?: string;
};

/** Per-mon job inside one preview package. */
export type ManualPackRole = {
  slug: string;
  /** Macro step on the package flowchart (Break / Control / Finish). */
  macro: string;
  /** One-line micro job in this bring. */
  micro: string;
  /** What this mon uniquely gives the package. */
  gives?: string;
};

export type ManualCoverageNote = {
  title: string;
  body: string;
  watch?: string;
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
  /** Macro + micro jobs for each bring member (boxed guides). */
  roles?: ManualPackRole[];
  /** Pack-specific coverage narrative (supplements computed kit coverage). */
  coverageNotes?: ManualCoverageNote[];
  /** Preferred Mega stone / species for this pack (when the six carries several). */
  megaChoice?: string;
  /** Acceptable Mega options left ambiguous until mid-preview. */
  megaOptions?: string[];
  /** Multi-mode wincon identity this pack assumes (SlotMode.id). */
  winconMode?: string;
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

/** Ladder / patch evidence behind the construction (optional). */
export type ManualEvidenceStat = {
  label: string;
  value: string;
  note?: string;
};

export type ManualEvidence = {
  season?: string;
  asOf?: string;
  source?: string;
  /** Why this is not claimed as proven best WR. */
  caveat?: string;
  ladderTop?: string[];
  stats?: ManualEvidenceStat[];
};

/** Conscious substitution vs raw teammate frequency. */
export type ManualSubstitution = {
  dropped: string;
  kept: string;
  why: string;
};

export type ManualAltSlot = {
  slug: string;
  insteadOf?: string;
  why: string;
};

export type ManualEndgame = {
  id: string;
  label: string;
  /** Who closes (slug or short name). */
  path: string;
  how: string;
};

export type ManualOmission = {
  slug: string;
  /** Who stayed on the six instead. */
  insteadKept: string;
  why: string;
};

export type ManualArchitectureLayer = {
  title: string;
  body: string;
  slugs?: string[];
};

export type ManualSpeedBenchmark = {
  target: string;
  theirSpe: string;
  yourSpe: string;
  natureImplication: string;
};

/** How the six was built from meta evidence — not just “top six usage.” */
export type ManualConstruction = {
  thesis: string;
  /** How teammate / usage data was interpreted. */
  method: string;
  /** One-line summary of the primary win path. */
  winCondition: string;
  /** Distinct late-game closes this six can pursue. */
  endgames?: ManualEndgame[];
  /** Species deliberately left off this six. */
  omissions?: ManualOmission[];
  substitutions?: ManualSubstitution[];
  altSlots?: ManualAltSlot[];
};

export type ManualMegaCandidate = {
  slug: string;
  stone: string;
  when: string;
};

/** Multiple Mega stones on one six; one Mega per battle. */
export type ManualMegaPool = {
  rule: string;
  previewPressure: string;
  /** Cost of carrying two stones (item slot on the non-Mega). */
  cost?: string;
  candidates: ManualMegaCandidate[];
};

/** Resolve authored strategy, or derive a thin one from pack fields. */
export function resolvePackStrategy(pack: ManualPack): ManualPackStrategy {
  if (pack.strategy) {
    return {
      ...pack.strategy,
      gamePlan: pack.strategy.gamePlan,
      megaChoice: pack.strategy.megaChoice ?? pack.megaChoice,
      megaOptions: pack.strategy.megaOptions ?? pack.megaOptions,
      winconMode: pack.strategy.winconMode ?? pack.winconMode,
    };
  }
  return {
    opponentPattern: pack.when,
    bring: pack.slugs,
    purpose: pack.identity,
    targets: pack.press ?? [],
    refuses: pack.refuse ?? [],
    winCondition: pack.pilot?.thesis ?? pack.philosophy ?? pack.identity,
    megaChoice: pack.megaChoice,
    megaOptions: pack.megaOptions,
    winconMode: pack.winconMode,
  };
}

/**
 * Classroom field manual.
 *
 * Ownership layers (boxed manuals):
 * - Manual (`box` / `roster` / `core` / construction / megaPool / evidence):
 *   the registered six, sets authored once, and build thesis.
 * - Pack (`slugs` / `strategy` / optional pilot·plan·flows·loops):
 *   one preview bring of three and pack-specific gameplan when it differs.
 * - Shared fallback: when a pack omits flows/loops/phases, `resolveManual`
 *   inherits the team-level gameplan — UI must label that with
 *   `packUsesSharedGameplan`.
 */
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
  /** How / why this six was constructed from ladder evidence. */
  construction?: ManualConstruction;
  /** Multiple Mega candidates on the registered six. */
  megaPool?: ManualMegaPool;
  /** Season / usage evidence supporting the build. */
  evidence?: ManualEvidence;
  /** Layered read of the six (speed / setup / glue / cleaner). */
  architecture?: ManualArchitectureLayer[];
  /** Nature / Spe decision records before locking SP. */
  speedBenchmarks?: ManualSpeedBenchmark[];
  /** Authored six-wide coverage notes (supplements computed kit coverage). */
  coverageNotes?: ManualCoverageNote[];
};

export function packList(manual: TeamManual): ManualPack[] {
  return manual.packs ?? [];
}

function slotsForPack(
  manual: TeamManual,
  slugs: [string, string, string],
  winconMode?: string | null,
): SlotManual[] {
  const roster = manual.roster ?? manual.slots;
  const bySlug = new Map(roster.map((s) => [s.slug, s]));
  return slugs.map((slug) => {
    const hit = bySlug.get(slug);
    if (!hit) {
      return {
        slug,
        title: slug,
        job: "breaker" as RoleId,
        role: "",
        moves: [],
        objective: "",
        howToPlay: "",
      };
    }
    if (!winconMode || !hit.modes?.length) return hit;
    const mode = hit.modes.find((m) => m.id === winconMode);
    if (!mode) return hit;
    return {
      ...hit,
      item: mode.item,
      itemWhy: mode.itemWhy ?? hit.itemWhy,
      nature: mode.nature ?? hit.nature,
      training: mode.training ?? hit.training,
      moves: mode.moves,
      objective: mode.objective ?? hit.objective,
      howToPlay: mode.howToPlay ?? hit.howToPlay,
      role: mode.job || hit.role,
    };
  });
}

/** Overlay a preview pack. Parent id / title / box / roster / packs stay. */
export function resolveManual(manual: TeamManual, packId?: string | null): TeamManual {
  const packs = packList(manual);
  if (!packs.length) return manual;
  const pack = (packId ? packs.find((p) => p.id === packId) : undefined) ?? packs[0];
  if (!pack) return manual;
  const strategy = resolvePackStrategy(pack);
  const winconMode = strategy.winconMode ?? pack.winconMode;
  const resolvedSlots = manual.roster?.length
    ? slotsForPack(manual, pack.slugs, winconMode)
    : manual.slots.length === 3 && manual.slots.every((s, i) => s.slug === pack.slugs[i])
      ? slotsForPack(manual, pack.slugs, winconMode)
      : slotsForPack(manual, pack.slugs, winconMode);

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
    flows: (() => {
      const packFlows = pack.flows ?? [];
      if (!packFlows.length) return manual.flows;
      const packIds = new Set(packFlows.map((f) => f.id));
      const extras = (manual.flows ?? []).filter(
        (f) => !packIds.has(f.id) && (f.forks?.length ?? 0) > 0,
      );
      return extras.length ? [...extras, ...packFlows] : packFlows;
    })(),
    loops: pack.loops?.length ? pack.loops : manual.loops,
    hazards: pack.hazards?.length ? pack.hazards : manual.hazards,
    coverageNotes: pack.coverageNotes?.length ? pack.coverageNotes : manual.coverageNotes,
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

/** Registered six + roster + packs + core — pack-first reading model. */
export function isBoxedManual(manual: TeamManual): boolean {
  return Boolean(manual.box?.length && manual.packs?.length && manual.roster?.length && manual.core);
}

/**
 * True when this pack has no own flowchart/loops/phases and will inherit
 * the parent manual's gameplan via resolveManual.
 */
export function packUsesSharedGameplan(manual: TeamManual, packId?: string | null): boolean {
  const packs = packList(manual);
  if (!packs.length) return false;
  const pack = (packId ? packs.find((p) => p.id === packId) : undefined) ?? packs[0];
  if (!pack) return false;
  const hasOwn =
    (pack.flows?.length ?? 0) > 0 ||
    (pack.loops?.length ?? 0) > 0 ||
    (pack.phases?.length ?? 0) > 0;
  if (hasOwn) return false;
  const parentHas =
    (manual.flows?.length ?? 0) > 0 ||
    (manual.loops?.length ?? 0) > 0 ||
    (manual.phases?.length ?? 0) > 0;
  return parentHas;
}

export function manualPackHref(id: string, packId?: string | null) {
  if (!packId) return manualHref(id);
  return `/manuals/${id}?pack=${encodeURIComponent(packId)}` as const;
}

export function validatePackId(manual: TeamManual, packId?: string | null): string | undefined {
  const packs = packList(manual);
  if (!packs.length) return undefined;
  if (packId && packs.some((p) => p.id === packId)) return packId;
  return defaultPackId(manual);
}

/** Prev/next within the same family (canonical shelf order). */
export function siblingManuals(id: string): {
  family: ManualFamilyId;
  prev?: TeamManual;
  next?: TeamManual;
} {
  const current = getCanonicalManual(id);
  const family = current ? manualFamily(current) : "clock";
  if (!current) return { family };
  const peers = CANONICAL_MANUALS.filter((m) => manualFamily(m) === family);
  const i = peers.findIndex((m) => m.id === id);
  if (i < 0) return { family };
  return {
    family,
    prev: i > 0 ? peers[i - 1] : undefined,
    next: i < peers.length - 1 ? peers[i + 1] : undefined,
  };
}

/**
 * Related classroom manuals: prefer ≥2 shared box/bring slugs, then same family.
 */
export function relatedManuals(id: string, limit = 4): TeamManual[] {
  const current = getCanonicalManual(id);
  if (!current) return [];
  const family = manualFamily(current);
  const ours = new Set(
    [...(current.box ?? []), ...current.slugs].filter((s): s is string => Boolean(s)),
  );

  return CANONICAL_MANUALS.filter((m) => m.id !== id)
    .map((m) => {
      const theirs = new Set(
        [...(m.box ?? []), ...m.slugs].filter((s): s is string => Boolean(s)),
      );
      let shared = 0;
      for (const slug of ours) {
        if (theirs.has(slug)) shared += 1;
      }
      const sameFamily = manualFamily(m) === family;
      return { m, shared, score: shared * 3 + (sameFamily ? 1 : 0) };
    })
    .filter((row) => row.shared >= 2 || row.score >= 1)
    .sort((a, b) => b.score - a.score || a.m.title.localeCompare(b.m.title))
    .slice(0, limit)
    .map((row) => row.m);
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
  ULTRA_GARCHOMPZ_SALAMENCE_GHOLDENGO_MANUAL,
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
