import type { TypeId } from "@/types/pokemon";
import { defenseMultiplier } from "@/lib/champions/types";
import { isDamagingMove, moveType } from "@/lib/champions/moves";
import { speBand, speRace, type SpeBand, type SpeRace } from "@/lib/champions/vs-stats";

export type Threat = {
  type: TypeId;
  mult: number;
  /** Move name when this threat comes from a kit click. */
  move?: string;
};

export type BestMove = {
  name: string;
  type: TypeId;
  mult: number;
};

export type ScoutSide = {
  slug: string;
  types: readonly TypeId[];
  moves?: string[];
};

export type ScoutSlotResult = {
  slug: string;
  youHit: Threat[];
  theyHit: Threat[];
  bestMove: BestMove | null;
  /** Worst STAB they land into this slot. */
  worstTaken: number;
  /** Best STAB (or kit move) you land into them. */
  bestDealt: number;
};

export type ScoutTeamResult = {
  slots: ScoutSlotResult[];
  safeSwitchSlug: string | null;
  sharedHoles: TypeId[];
};

export type ScoutFoe = {
  slug: string;
  types: readonly TypeId[];
  speedAt0: number;
  speedAt32: number;
};

export type ScoutFieldResult = {
  foes: string[];
  /** Per-foe team reports, same order as foes. */
  byFoe: ScoutTeamResult[];
  /** cells[sideIndex][foeIndex] */
  cells: ScoutSlotResult[][];
  /** races[sideIndex][foeIndex] */
  races: SpeRace[][];
};

/** STAB threats: each attacker type into the defending typing. */
export function stabThreats(
  attackerTypes: readonly TypeId[],
  defendTypes: readonly TypeId[],
  sort: "offense" | "defense" = "offense",
): Threat[] {
  const rows = attackerTypes.map((type) => ({
    type,
    mult: defenseMultiplier(defendTypes, type),
  }));
  rows.sort((a, b) => (sort === "offense" ? b.mult - a.mult : b.mult - a.mult));
  return rows;
}

/** Damaging kit moves into the defending typing. Unknown / status names skipped. */
export function moveThreats(moveNames: readonly string[], defendTypes: readonly TypeId[]): Threat[] {
  const seen = new Set<string>();
  const rows: Threat[] = [];
  for (const raw of moveNames) {
    const parts = raw.split(/\s*(?:[/]|,\s*| or )\s*/).map((s) => s.trim()).filter(Boolean);
    for (const name of parts) {
      if (!isDamagingMove(name)) continue;
      const type = moveType(name);
      if (!type) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        type,
        mult: defenseMultiplier(defendTypes, type),
        move: name,
      });
    }
  }
  rows.sort((a, b) => b.mult - a.mult);
  return rows;
}

export function scoutSlot(side: ScoutSide, opponentTypes: readonly TypeId[]): ScoutSlotResult {
  const stabOut = stabThreats(side.types, opponentTypes, "offense");
  const kitOut = side.moves?.length ? moveThreats(side.moves, opponentTypes) : [];
  const youHit = kitOut.length ? kitOut : stabOut;
  const theyHit = stabThreats(opponentTypes, side.types, "defense");

  const bestFromKit = kitOut[0];
  const bestMove: BestMove | null =
    bestFromKit?.move && bestFromKit.type
      ? { name: bestFromKit.move, type: bestFromKit.type, mult: bestFromKit.mult }
      : null;

  const bestDealt = Math.max(
    0,
    ...stabOut.map((t) => t.mult),
    ...kitOut.map((t) => t.mult),
  );
  const worstTaken = Math.max(0, ...theyHit.map((t) => t.mult));

  return {
    slug: side.slug,
    youHit,
    theyHit,
    bestMove,
    worstTaken,
    bestDealt,
  };
}

export function scoutTeam(sides: readonly ScoutSide[], opponentTypes: readonly TypeId[]): ScoutTeamResult {
  const slots = sides.map((s) => scoutSlot(s, opponentTypes));

  // Prefer a slot that does not die to their STABs and still threatens them.
  const ranked = [...slots].sort((a, b) => {
    const aSafe = a.worstTaken <= 1 ? 0 : a.worstTaken;
    const bSafe = b.worstTaken <= 1 ? 0 : b.worstTaken;
    if (aSafe !== bSafe) return aSafe - bSafe;
    return b.bestDealt - a.bestDealt;
  });
  const safe = ranked.find((s) => s.worstTaken <= 1 && s.bestDealt > 1) ?? ranked.find((s) => s.worstTaken <= 1) ?? null;

  const sharedHoles: TypeId[] = [];
  for (const t of opponentTypes) {
    if (slots.length && slots.every((s) => s.theyHit.some((h) => h.type === t && h.mult > 1))) {
      sharedHoles.push(t);
    }
  }

  return {
    slots,
    safeSwitchSlug: safe?.slug ?? null,
    sharedHoles,
  };
}

/** Multi-foe field: our sides × their list. Pure; UI never nests chart loops. */
export function scoutField(
  sides: readonly ScoutSide[],
  foes: readonly ScoutFoe[],
  ourSpe: readonly SpeBand[],
): ScoutFieldResult {
  const byFoe = foes.map((f) => scoutTeam(sides, f.types));
  const cells = sides.map((side) => foes.map((f) => scoutSlot(side, f.types)));
  const races = sides.map((_, i) => {
    const ours = ourSpe[i] ?? { at0: 0, at32: 0 };
    return foes.map((f) => speRace(ours, speBand(f)));
  });
  return { foes: foes.map((f) => f.slug), byFoe, cells, races };
}

export function formatMult(mult: number): string {
  if (mult === 0) return "0×";
  if (mult === 0.25) return "¼×";
  if (mult === 0.5) return "½×";
  if (mult === 1) return "1×";
  if (mult === 2) return "2×";
  if (mult === 4) return "4×";
  return `${mult}×`;
}
