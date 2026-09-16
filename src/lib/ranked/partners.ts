import { getPokemon } from "@/lib/catalog/load";
import {
  getRankedBySlug,
  legalSlugForRanked,
  legalSlugFromRankedName,
  rankedSingles,
} from "@/lib/ranked/load";
import { formatAsOf } from "@/lib/ranked/format";

export type RankedPartner = {
  slug: string;
  /** How many current team members list this mon in their top teammates. */
  endorsements: number;
  /** True if at least one endorsement is mutual (A lists B and B lists A). */
  mutual: boolean;
  /** Best (lowest) 1-based position on any endorser's teammate list. */
  bestSlot: number;
  /** Usage rank of the candidate, if known. */
  usageRank?: number;
  /** Team members who list this partner (display names). */
  withNames: string[];
};

function stem(slug: string) {
  return slug
    .replace(/-mega(-[xy])?$/, "")
    .replace(/-disguised$/, "")
    .replace(/-(male|female)$/, "")
    .replace(/-shield$/, "")
    .replace(/-amped$/, "")
    .replace(/-zero$/, "");
}

function teamName(slug: string) {
  return getPokemon(slug)?.name ?? slug;
}

/**
 * Usual partners for the current bring-three from Ranked Singles Battle Data.
 * Co-occurrence only (top teammate lists) — not win rate, not a guarantee.
 * Skips names that do not resolve to a legal catalog species.
 */
export function rankedPartnersFor(teamSlugs: string[], n = 8): RankedPartner[] {
  const filled = teamSlugs.filter(Boolean);
  if (!filled.length) return [];

  const blocked = new Set(filled.flatMap((s) => [s, stem(s)]));
  const agg = new Map<
    string,
    { endorsements: number; mutual: boolean; bestSlot: number; withNames: string[] }
  >();

  for (const slug of filled) {
    const row = getRankedBySlug(slug);
    if (!row) continue;
    const selfName = row.name.toLowerCase();

    row.teammates.forEach((name, index) => {
      const partnerSlug = legalSlugFromRankedName(name);
      if (!partnerSlug) return;
      if (blocked.has(partnerSlug) || blocked.has(stem(partnerSlug))) return;

      const partnerRow = getRankedBySlug(partnerSlug);
      const mutual = Boolean(
        partnerRow?.teammates.some((t) => t.toLowerCase() === selfName),
      );
      const slot = index + 1;
      const prev = agg.get(partnerSlug);
      if (!prev) {
        agg.set(partnerSlug, {
          endorsements: 1,
          mutual,
          bestSlot: slot,
          withNames: [teamName(slug)],
        });
        return;
      }
      prev.endorsements += 1;
      prev.mutual = prev.mutual || mutual;
      prev.bestSlot = Math.min(prev.bestSlot, slot);
      if (!prev.withNames.includes(teamName(slug))) prev.withNames.push(teamName(slug));
    });
  }

  const out: RankedPartner[] = [];
  for (const [slug, meta] of agg) {
    const ranked = getRankedBySlug(slug);
    out.push({
      slug,
      endorsements: meta.endorsements,
      mutual: meta.mutual,
      bestSlot: meta.bestSlot,
      usageRank: ranked?.rank,
      withNames: meta.withNames,
    });
  }

  out.sort((a, b) => {
    if (b.endorsements !== a.endorsements) return b.endorsements - a.endorsements;
    if (Number(b.mutual) !== Number(a.mutual)) return Number(b.mutual) - Number(a.mutual);
    if (a.bestSlot !== b.bestSlot) return a.bestSlot - b.bestSlot;
    const ra = a.usageRank ?? 9999;
    const rb = b.usageRank ?? 9999;
    if (ra !== rb) return ra - rb;
    return teamName(a.slug).localeCompare(teamName(b.slug));
  });

  return out.slice(0, n);
}

/** Short citation for UI copy — season + date, no invented stats. */
export function rankedPartnerCite() {
  const { season, asOf } = rankedSingles;
  return `Singles ${season} · ${formatAsOf(asOf)}`;
}

export function rankedPartnerWhy(partner: RankedPartner): string {
  const cite = rankedPartnerCite();
  const names = partner.withNames;
  if (names.length >= 2) {
    return `Ranked with ${names.join(" + ")} (${cite}). Co-occurrence, not win rate.`;
  }
  if (partner.bestSlot === 1) {
    return `Top ranked teammate of ${names[0]} (${cite}).`;
  }
  if (partner.bestSlot === 2) {
    return `#2 ranked teammate of ${names[0]} (${cite}).`;
  }
  return `Ranked teammate of ${names[0]} (#${partner.bestSlot} on their list · ${cite}).`;
}

/** Top legal usage names when the three is empty — starters, not partners. */
export function rankedStartersFor(exclude: string[], n = 6): string[] {
  const blocked = new Set(exclude.filter(Boolean).map(stem));
  const out: string[] = [];
  for (const row of rankedSingles.pokemon) {
    const slug = legalSlugForRanked(row);
    if (!slug || blocked.has(slug) || blocked.has(stem(slug))) continue;
    out.push(slug);
    if (out.length >= n) break;
  }
  return out;
}
