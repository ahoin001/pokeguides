import type { CatalogEntry, TypeId } from "@/types/pokemon";
import { TYPE_IDS_ALPHA, TYPE_LABEL, attackMultiplier } from "@/lib/champions/types";

export type CoverageHit = {
  slug: string;
  name: string;
  /** STAB type used for the hit. */
  stab: TypeId;
  mult: number;
};

export type CoverageTile = {
  type: TypeId;
  /** Members whose STAB hits this type for >1×. */
  hits: CoverageHit[];
  hitCount: number;
  /** Best multiplier any teammate gets into this type. */
  best: number;
  tone: "cover-many" | "cover-some" | "soft" | "none";
};

/**
 * For each defending type, how many of our three hit it super-effectively with STAB.
 * Teaching view — not move-level coverage.
 */
export function teamCoverageGrid(members: readonly CatalogEntry[]): CoverageTile[] {
  return TYPE_IDS_ALPHA.map((defend) => {
    const hits: CoverageHit[] = [];
    let best = 0;
    for (const m of members) {
      let monBest = 0;
      let monStab: TypeId | null = null;
      for (const stab of m.types) {
        const mult = attackMultiplier(stab, defend);
        if (mult > monBest) {
          monBest = mult;
          monStab = stab;
        }
      }
      if (monBest > 1 && monStab) {
        hits.push({ slug: m.slug, name: m.name, stab: monStab, mult: monBest });
        best = Math.max(best, monBest);
      }
    }
    hits.sort((a, b) => b.mult - a.mult || a.name.localeCompare(b.name));
    const hitCount = hits.length;
    let tone: CoverageTile["tone"] = "none";
    if (hitCount >= 2) tone = "cover-many";
    else if (hitCount === 1) tone = "cover-some";
    else if (best > 0 && best < 1) tone = "soft";
    // Check if anyone resists (hits for <1) without SE — mark soft when no SE
    if (hitCount === 0) {
      let anyContact = false;
      for (const m of members) {
        for (const stab of m.types) {
          const mult = attackMultiplier(stab, defend);
          if (mult > 0 && mult < 1) anyContact = true;
        }
      }
      if (anyContact) tone = "soft";
    }

    return { type: defend, hits, hitCount, best, tone };
  });
}

export function coverageTileLabel(tile: CoverageTile) {
  const name = TYPE_LABEL[tile.type];
  if (!tile.hitCount) {
    return tile.tone === "soft" ? `${name} — resisted` : `${name} — no STAB SE`;
  }
  const parts = [`${tile.hitCount}× SE`];
  if (tile.best >= 4) parts.push("incl. 4×");
  return `${name} — ${parts.join(", ")}`;
}
