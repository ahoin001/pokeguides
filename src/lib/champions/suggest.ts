import type { ArchetypeId, CatalogEntry, RoleId } from "@/types/pokemon";
import { getEditorial, getPokemon, legalRoster } from "@/lib/catalog/load";
import { getArchetype } from "@/content/archetypes";
import { ROLE_LABEL } from "@/content/roles";
import { TYPE_LABEL, defenseMultiplier, sharedWeaknesses } from "@/lib/champions/types";
import { jobOf, offenseBias, scorePokemon, type OffenseBias } from "@/lib/champions/role-score";
import { jobsForMon } from "@/lib/champions/team-readout";
import {
  rankedPartnerCite,
  rankedPartnerWhy,
  rankedPartnersFor,
  rankedStartersFor,
  type RankedPartner,
} from "@/lib/ranked/partners";
import { getRankedBySlug } from "@/lib/ranked/load";

export type SuggestionSource = "ranked" | "starter" | "classroom" | "coverage" | "archetype";

export type Suggestion = {
  pokemon: CatalogEntry;
  job: RoleId;
  /** Honest reason — cites ranked season when co-occurrence, labels guesses. */
  why: string;
  source: SuggestionSource;
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

function roleLine(mon: CatalogEntry): string {
  const score = scorePokemon(mon);
  const label = ROLE_LABEL[score.role];
  return score.guessed ? `Guessed ${label}` : label;
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

function sampleBoost(slug: string, intent: ArchetypeId | null) {
  if (!intent) return 0;
  const style = getArchetype(intent);
  if (!style) return 0;
  if ((style.core.slugs as string[]).includes(slug)) return 5;
  if (style.sampleSix.includes(slug)) return 4;
  if (style.roster.some((s) => s.exampleSlug === slug)) return 3;
  return 0;
}

function partnerScore(p: RankedPartner) {
  // Endorsement and mutual beat soft heuristics — nerds check the list order.
  return p.endorsements * 12 + (p.mutual ? 6 : 0) + Math.max(0, 7 - p.bestSlot) * 2;
}

function coverageWhy(
  mon: CatalogEntry,
  holes: ReturnType<typeof sharedWeaknesses>,
  bias: OffenseBias | "empty",
  job: RoleId,
): string {
  const hole = holes.find((h) => defenseMultiplier(mon.types, h) < 1);
  if (hole) {
    return `Coverage — takes ${TYPE_LABEL[hole]} on this three. Not a top ranked partner. ${roleLine(mon)}.`;
  }
  if (bias === "physical" && offenseBias(mon) === "special") {
    return `Coverage — special attacker; the three is all physical. ${roleLine(mon)}.`;
  }
  if (bias === "special" && offenseBias(mon) === "physical") {
    return `Coverage — physical attacker; the three is all special. ${roleLine(mon)}.`;
  }
  return `Coverage — ${roleLine(mon)} hole. Not from ranked teammate lists.`;
}

/**
 * Dynamic builder suggestions. Ranked Singles co-occurrence first when the three
 * has members; honest labels when we fall back to classroom/coverage heuristics.
 */
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
    if (j === "mega") {
      return !filled.some(
        (m) => m.form === "mega" || m.form === "mega-z" || jobsForMon(m, intent).includes("mega"),
      );
    }
    return !haveJobs.has(j);
  });
  const cite = rankedPartnerCite();
  const out: Suggestion[] = [];
  const used = new Set<string>();

  function push(s: Suggestion) {
    if (blocked.has(s.pokemon.slug) || used.has(s.pokemon.slug)) return;
    used.add(s.pokemon.slug);
    out.push(s);
  }

  // Empty three: high-usage legal starters, not invented partners.
  if (!filled.length) {
    for (const slug of rankedStartersFor([...blocked], 6)) {
      const mon = getPokemon(slug);
      if (!mon?.isLegal) continue;
      const rank = getRankedBySlug(slug)?.rank;
      push({
        pokemon: mon,
        job: jobOf(mon),
        source: "starter",
        why: rank
          ? `#${rank} on Ranked Singles (${cite}). Start here — partners unlock after you add one.`
          : `Legal on the board (${cite}).`,
      });
    }
    return out.slice(0, 6);
  }

  // Primary: ranked co-occurrence (only legal, resolvable names).
  const partners = rankedPartnersFor(
    filled.map((m) => m.slug),
    10,
  );
  const rankedRows = partners
    .map((p) => {
      const mon = getPokemon(p.slug);
      if (!mon?.isLegal) return null;
      return { partner: p, mon, score: partnerScore(p) };
    })
    .filter((r): r is { partner: RankedPartner; mon: CatalogEntry; score: number } => Boolean(r));

  rankedRows.sort((a, b) => b.score - a.score || a.mon.name.localeCompare(b.mon.name));
  for (const row of rankedRows) {
    if (out.length >= 6) break;
    const job = jobOf(row.mon);
    push({
      pokemon: row.mon,
      job,
      source: "ranked",
      why: `${rankedPartnerWhy(row.partner)} ${roleLine(row.mon)}.`,
    });
  }

  // Classroom editorial partners — only if not already ranked, clearly labeled.
  for (const m of filled) {
    for (const slug of getEditorial(m.slug)?.partners ?? []) {
      if (out.length >= 6) break;
      const mon = getPokemon(slug);
      if (!mon?.isLegal) continue;
      push({
        pokemon: mon,
        job: jobOf(mon),
        source: "classroom",
        why: `Classroom partner of ${m.name} — teaching note, not ladder co-occurrence. ${roleLine(mon)}.`,
      });
    }
  }

  // Archetype sample / core when intent is set.
  if (intent && out.length < 6) {
    const style = getArchetype(intent);
    if (style) {
      for (const slug of [...style.core.slugs, ...style.sampleSix]) {
        if (out.length >= 6) break;
        const mon = getPokemon(slug);
        if (!mon?.isLegal) continue;
        push({
          pokemon: mon,
          job: jobOf(mon),
          source: "archetype",
          why: `On the ${style.name} sample/core. Style prior, not ranked teammates. ${roleLine(mon)}.`,
        });
      }
    }
  }

  // Coverage fillers only if we still have room and a clear hole — labeled as such.
  if (out.length < 6 && (holes.length || bias === "physical" || bias === "special" || wanted.length)) {
    type Ranked = Suggestion & { score: number };
    const coverage: Ranked[] = [];
    for (const mon of legalRoster()) {
      if (blocked.has(mon.slug) || used.has(mon.slug)) continue;
      const job = jobOf(mon);
      let score = holeBoost(mon, holes) + spectrumBoost(mon, bias) + sampleBoost(mon.slug, intent);
      if (wanted.includes(job)) score += 2;
      if (score < 3) continue;
      coverage.push({
        pokemon: mon,
        job,
        source: "coverage",
        why: coverageWhy(mon, holes, bias, job),
        score,
      });
    }
    coverage.sort((a, b) => b.score - a.score || a.pokemon.name.localeCompare(b.pokemon.name));
    for (const row of coverage) {
      if (out.length >= 6) break;
      push(row);
    }
  }

  return out.slice(0, 6);
}

export function teamOffenseBias(mons: CatalogEntry[]) {
  return teamOffense(mons);
}
