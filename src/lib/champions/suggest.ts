import type { ArchetypeId, CatalogEntry, RoleId } from "@/types/pokemon";
import { catalog, getEditorial } from "@/lib/catalog/load";
import { getArchetype } from "@/content/archetypes";
import { ROLE_LABEL } from "@/content/roles";
import { TYPE_LABEL, defenseMultiplier, sharedWeaknesses } from "@/lib/champions/types";
import { jobOf, offenseBias, scorePokemon, type OffenseBias } from "@/lib/champions/role-score";
import { jobsForMon } from "@/lib/champions/team-readout";

export type Suggestion = {
  pokemon: CatalogEntry;
  job: RoleId;
  why: string;
};

function teamOffense(mons: CatalogEntry[]): OffenseBias | "empty" {
  if (!mons.length) return "empty";
  const biases = mons.map(offenseBias).filter((b) => b !== "mixed");
  if (!biases.length) return "mixed";
  if (biases.every((b) => b === "physical")) return "physical";
  if (biases.every((b) => b === "special")) return "special";
  return "mixed";
}

function neededJobs(intent: ArchetypeId | null, filled: CatalogEntry[]): RoleId[] {
  const style = intent ? getArchetype(intent) : null;
  if (style) return style.jobs;
  const have = new Set(filled.map(jobOf));
  return (["support", "speed", "breaker"] as RoleId[]).filter((j) => !have.has(j));
}

function partnerBoost(slug: string, filled: CatalogEntry[]) {
  let n = 0;
  for (const m of filled) {
    if ((getEditorial(m.slug)?.partners ?? []).includes(slug)) n += 3;
  }
  const reverse = getEditorial(slug)?.partners ?? [];
  for (const m of filled) {
    if (reverse.includes(m.slug)) n += 2;
  }
  return n;
}

function sampleBoost(slug: string, intent: ArchetypeId | null) {
  if (!intent) return 0;
  const style = getArchetype(intent);
  if (!style) return 0;
  if ((style.core.slugs as string[]).includes(slug)) return 5;
  if (style.sampleSix.includes(slug)) return 4;
  if (style.roster.some((s) => s.exampleSlug === slug)) return 3;
  return 0;
}

function holeBoost(mon: CatalogEntry, holes: ReturnType<typeof sharedWeaknesses>) {
  if (!holes.length) return 0;
  let n = 0;
  for (const hole of holes) {
    const mult = defenseMultiplier(mon.types, hole);
    if (mult === 0) n += 4;
    else if (mult < 1) n += 3;
  }
  return n;
}

function spectrumBoost(mon: CatalogEntry, teamBias: OffenseBias | "empty") {
  if (teamBias === "physical" && offenseBias(mon) === "special") return 3;
  if (teamBias === "special" && offenseBias(mon) === "physical") return 3;
  return 0;
}

export function suggestForTeam(
  filled: CatalogEntry[],
  intent: ArchetypeId | null,
  exclude: string[],
): Suggestion[] {
  const blocked = new Set(exclude);
  const haveJobs = new Set(filled.flatMap((m) => jobsForMon(m, intent)));
  const holes = filled.length ? sharedWeaknesses(filled.map((m) => m.types)) : [];
  const bias = teamOffense(filled);
  const wanted = neededJobs(intent, filled).filter((j) => {
    if (j === "mega") return !filled.some((m) => m.form === "mega" || m.form === "mega-z" || jobsForMon(m, intent).includes("mega"));
    return !haveJobs.has(j);
  });
  const styleJobs = intent ? (getArchetype(intent)?.jobs ?? []) : [];
  const jobsToFill = wanted.length ? wanted : styleJobs.length ? styleJobs : (["support", "speed", "breaker"] as RoleId[]);

  const partnerNames = new Map<string, string>();
  for (const m of filled) {
    for (const slug of getEditorial(m.slug)?.partners ?? []) {
      if (!partnerNames.has(slug)) partnerNames.set(slug, m.name);
    }
  }

  type Ranked = Suggestion & { score: number };
  const ranked: Ranked[] = [];

  for (const mon of catalog) {
    if (blocked.has(mon.slug)) continue;
    const job = jobOf(mon);
    if (!jobsToFill.includes(job)) continue;

    let score = 1;
    if (mon.role === job) score += 4;
    if (wanted.includes(job)) score += 3;
    score += partnerBoost(mon.slug, filled);
    score += sampleBoost(mon.slug, intent);
    score += holeBoost(mon, holes);
    score += spectrumBoost(mon, bias);
    if (mon.featured) score += 1;

    const partner = partnerNames.get(mon.slug);
    let why: string;
    if (partner) why = `Often with ${partner}. ${ROLE_LABEL[job]}.`;
    else if (intent && getArchetype(intent)?.sampleSix.includes(mon.slug)) {
      why = `On the ${getArchetype(intent)!.name} sample. ${ROLE_LABEL[job]}.`;
    } else {
      const hole = holes.find((h) => defenseMultiplier(mon.types, h) < 1);
      if (hole) why = `Takes ${TYPE_LABEL[hole]}. The hole on this three.`;
      else if (bias === "physical" && offenseBias(mon) === "special") {
        why = "Special attacker. The three is all physical.";
      } else if (bias === "special" && offenseBias(mon) === "physical") {
        why = "Physical attacker. The three is all special.";
      } else why = scorePokemon(mon).why[0] ?? `${ROLE_LABEL[job]} for this style.`;
    }

    ranked.push({ pokemon: mon, job, why, score });
  }

  ranked.sort((a, b) => b.score - a.score || a.pokemon.name.localeCompare(b.pokemon.name));

  const used = new Set<string>();
  const out: Suggestion[] = [];
  for (const job of jobsToFill) {
    let n = 0;
    for (const row of ranked) {
      if (row.job !== job || used.has(row.pokemon.slug)) continue;
      used.add(row.pokemon.slug);
      out.push({ pokemon: row.pokemon, job: row.job, why: row.why });
      n += 1;
      if (n >= 2) break;
    }
  }
  if (out.length < 6) {
    for (const row of ranked) {
      if (used.has(row.pokemon.slug)) continue;
      used.add(row.pokemon.slug);
      out.push({ pokemon: row.pokemon, job: row.job, why: row.why });
      if (out.length >= 6) break;
    }
  }
  return out.slice(0, 6);
}

export function teamOffenseBias(mons: CatalogEntry[]) {
  return teamOffense(mons);
}
