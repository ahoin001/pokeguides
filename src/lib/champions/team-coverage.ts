import type { TypeId } from "@/types/pokemon";
import { damagingMoveTypes } from "@/lib/champions/moves";
import {
  TYPE_IDS_ALPHA,
  TYPE_LABEL,
  defenseMultiplier,
} from "@/lib/champions/types";

export type CoverageMember = {
  name: string;
  types: readonly TypeId[];
  moves?: readonly string[];
};

export type CoverageClick = {
  type: TypeId;
  /** Damaging type nobody on the three is. Ice Beam on Primarina. */
  extra: boolean;
};

export type CoverageSit = {
  name: string;
  how: "ignores" | "resists";
};

export type CoverageThreat = {
  type: TypeId;
  count: number;
  worst: number;
  weak: string[];
  sits: CoverageSit[];
};

export type TeamCoverageSummary = {
  clicks: CoverageClick[];
  threats: CoverageThreat[];
};

function attackTypesFor(member: CoverageMember): TypeId[] {
  const fromKit = damagingMoveTypes(member.moves ?? []);
  return fromKit.length ? fromKit : [...member.types];
}

export function summarizeTeamCoverage(members: readonly CoverageMember[]): TeamCoverageSummary {
  const stab = new Set(members.flatMap((m) => m.types));
  const seen = new Set<TypeId>();
  const clicks: CoverageClick[] = [];
  for (const member of members) {
    for (const type of attackTypesFor(member)) {
      if (seen.has(type)) continue;
      seen.add(type);
      clicks.push({ type, extra: !stab.has(type) });
    }
  }
  clicks.sort((a, b) => TYPE_LABEL[a.type].localeCompare(TYPE_LABEL[b.type]));

  const threats: CoverageThreat[] = [];
  for (const attack of TYPE_IDS_ALPHA) {
    const weak: string[] = [];
    const sits: CoverageSit[] = [];
    let worst = 1;
    for (const member of members) {
      const mult = defenseMultiplier(member.types, attack);
      if (mult > 1) {
        weak.push(member.name);
        worst = Math.max(worst, mult);
      } else if (mult === 0) {
        sits.push({ name: member.name, how: "ignores" });
      } else if (mult < 1) {
        sits.push({ name: member.name, how: "resists" });
      }
    }
    if (weak.length >= 2 || worst >= 4) {
      threats.push({ type: attack, count: weak.length, worst, weak, sits });
    }
  }
  threats.sort((a, b) => b.worst - a.worst || b.count - a.count);

  return { clicks, threats };
}

export function threatLine(threat: CoverageThreat) {
  const type = TYPE_LABEL[threat.type];
  const names = joinAnd(threat.weak);
  const hit =
    threat.worst >= 4 && threat.weak.length === 1
      ? `${type} hits ${names} four times as hard.`
      : `${type} hits ${names}.`;
  if (!threat.sits.length) return `${hit} Nobody resists ${type}.`;
  const sit = threat.sits.map((s) => `${s.name} ${s.how} it`).join(". ") + ".";
  return `${hit} ${sit}`;
}

function joinAnd(names: string[]) {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}
