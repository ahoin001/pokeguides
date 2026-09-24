import { getArchitectureProfile } from "@/lib/architecture/load";
import type {
  ArchitectureArchetype,
  ArchitectureProfile,
  TeamContextOverlay,
} from "@/lib/architecture/types";

function clampScore(n: number): number {
  return Math.max(0, Math.min(5, Math.round(n)));
}

function engineOverlap(a: ArchitectureProfile, b: ArchitectureProfile): number {
  if (!a.engines?.length || !b.engines?.length) return 0;
  const set = new Set(b.engines);
  return a.engines.filter((e) => set.has(e)).length;
}

function createResourceOverlap(a: ArchitectureProfile, b: ArchitectureProfile): number {
  const other = new Set((b.creates ?? []).map((c) => c.resource.toLowerCase()));
  return (a.creates ?? []).filter((c) => other.has(c.resource.toLowerCase())).length;
}

/**
 * Team-context overlays from locked teamContextRules rubrics.
 * Does not invent species scores — only adjusts display hints for the current six.
 */
export function computeTeamContext(
  focusSlug: string,
  partySlugs: string[],
): TeamContextOverlay | null {
  const focus = getArchitectureProfile(focusSlug);
  if (!focus) return null;

  const mates = partySlugs
    .filter((s) => s && s !== focusSlug)
    .map((s) => getArchitectureProfile(s))
    .filter((p): p is ArchitectureProfile => Boolean(p));

  if (!mates.length) {
    return {
      cMag: focus.scores.mag,
      exclusivityTax: focus.scores.engineExclusivityTax,
      saturated: false,
      notes: ["No teammates scored yet — showing species-baseline MAG and tax."],
    };
  }

  let cMag = focus.scores.mag;
  let tax = focus.scores.engineExclusivityTax;
  const notes: string[] = [];

  const sameArchetype = mates.filter(
    (m) =>
      m.archetype === focus.archetype ||
      m.archetypeSecondary === focus.archetype ||
      focus.archetypeSecondary === m.archetype,
  );

  let totalEngineOverlap = 0;
  let totalCreateOverlap = 0;
  for (const m of mates) {
    totalEngineOverlap += engineOverlap(focus, m);
    totalCreateOverlap += createResourceOverlap(focus, m);
  }

  // cMagHint: lower when duplicated territory; keep high when new convert route
  if (sameArchetype.length && totalCreateOverlap + totalEngineOverlap >= 2) {
    cMag -= 1 + Math.min(1, sameArchetype.length - 1);
    notes.push(
      `C-MAG down — ${sameArchetype.map((m) => m.name).join(", ")} already cover similar ${focus.archetype} territory.`,
    );
  } else if (totalEngineOverlap === 0 && focus.scores.convertFanOut >= 4) {
    cMag += 1;
    notes.push("C-MAG up — adds a conversion route the rest of the six does not already share.");
  }

  // exclusivityGivenSix: lower tax when mates already supply infrastructure this mon wants
  const focusCreates = new Set((focus.creates ?? []).map((c) => c.resource.toLowerCase()));
  const mateCreates = new Set(
    mates.flatMap((m) => (m.creates ?? []).map((c) => c.resource.toLowerCase())),
  );
  const mateConverts = mates.flatMap((m) => m.converts ?? []);
  const servedByMates = mateConverts.filter((c) =>
    [...focusCreates].some((r) => c.resource.toLowerCase().includes(r) || r.includes(c.resource.toLowerCase())),
  ).length;

  const sharedInfra = [...focusCreates].filter((r) => mateCreates.has(r)).length;
  if (sharedInfra >= 1 || servedByMates >= 1) {
    tax -= Math.min(2, sharedInfra + (servedByMates > 0 ? 1 : 0));
    notes.push("Tax down — the other five already create infrastructure this mon can spend.");
  }
  if (focus.scores.engineExclusivityTax >= 4 && sharedInfra === 0 && servedByMates === 0) {
    tax += 1;
    notes.push("Tax up — few mates create what this mon needs; package may bend around it.");
  }

  const saturated =
    sameArchetype.length > 0 &&
    totalCreateOverlap + totalEngineOverlap >= 2 &&
    focus.scores.convertFanOut <= 3;

  if (saturated) {
    notes.push(
      "Saturation — same archetype peer without a clearly different convert path. Functional redundancy only if endgames diverge.",
    );
  }

  return {
    cMag: clampScore(cMag),
    exclusivityTax: clampScore(tax),
    saturated,
    notes: notes.slice(0, 3),
  };
}

export function archetypeLabel(id: ArchitectureArchetype): string {
  switch (id) {
    case "conversion-monster":
      return "Conversion monster";
    case "connector":
      return "Connector";
    case "bridge":
      return "Bridge";
    case "engine":
      return "Engine";
    case "scaler":
      return "Scaler";
    case "cleaner":
      return "Cleaner";
    case "disruptor":
      return "Disruptor";
    case "hybrid":
      return "Hybrid";
    default:
      return id;
  }
}
