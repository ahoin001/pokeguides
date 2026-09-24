import architectureJson from "@/data/architecture-metrics.json";
import type {
  ArchitectureMetricDef,
  ArchitectureMetricsDoc,
  ArchitectureProfile,
  TeamContextRules,
} from "@/lib/architecture/types";

const doc = architectureJson as ArchitectureMetricsDoc;

const bySlug = new Map<string, ArchitectureProfile>(
  doc.profiles.map((p) => [p.slug, p]),
);

export const architectureMeta = doc.meta;
export const architectureMetricDefs: ArchitectureMetricDef[] = doc.metricDefs;
export const teamContextRules: TeamContextRules = doc.teamContextRules;

export function getArchitectureProfile(slug: string): ArchitectureProfile | undefined {
  return bySlug.get(slug);
}

export function listArchitectureProfiles(): ArchitectureProfile[] {
  return doc.profiles;
}

export function hasArchitectureProfile(slug: string): boolean {
  return bySlug.has(slug);
}

/** Search scored profiles by name / slug / archetype (max `limit`). */
export function searchArchitectureProfiles(query: string, limit = 12): ArchitectureProfile[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return doc.profiles.slice(0, limit);
  const out: ArchitectureProfile[] = [];
  for (const p of doc.profiles) {
    if (
      p.name.toLowerCase().includes(needle) ||
      p.slug.includes(needle) ||
      p.archetype.includes(needle) ||
      (p.archetypeSecondary && p.archetypeSecondary.includes(needle))
    ) {
      out.push(p);
      if (out.length >= limit) break;
    }
  }
  return out;
}
