/** Species-level architecture metrics (Champions doubles overlay). */

export const ARCHITECTURE_ARCHETYPES = [
  "connector",
  "bridge",
  "conversion-monster",
  "engine",
  "scaler",
  "cleaner",
  "disruptor",
  "hybrid",
] as const;

export type ArchitectureArchetype = (typeof ARCHITECTURE_ARCHETYPES)[number];

export const ARCHITECTURE_METRIC_IDS = [
  "engineParticipation",
  "engineExclusivityTax",
  "bridgeQuality",
  "createFanOut",
  "convertFanOut",
  "mag",
  "moduleElasticity",
  "engineConverterContinuity",
] as const;

export type ArchitectureMetricId = (typeof ARCHITECTURE_METRIC_IDS)[number];

export type ArchitectureMetricDef = {
  id: ArchitectureMetricId;
  label: string;
  meaning: string;
  scale: string;
};

export type ArchitectureScores = Record<ArchitectureMetricId, number>;

export type ArchitectureCreateEdge = {
  resource: string;
  consumers: string[];
};

export type ArchitectureConvertEdge = {
  resource: string;
  into: string;
};

export type ArchitectureProfile = {
  slug: string;
  name: string;
  archetype: ArchitectureArchetype;
  archetypeSecondary?: ArchitectureArchetype | null;
  scores: ArchitectureScores;
  creates: ArchitectureCreateEdge[];
  converts: ArchitectureConvertEdge[];
  engines: string[];
  whyUnderOrOverRated?: string | null;
  conversionMonsterNote?: string | null;
  antiPatterns?: string[];
  caveat?: string | null;
};

export type TeamContextRules = {
  cMagHint: string;
  exclusivityGivenSix: string;
  saturation: string;
};

export type ArchitectureMetricsDoc = {
  meta: {
    format: string;
    regulation: string;
    asOf: string;
    caveat: string;
    scale: string;
    seededFrom?: string[];
    profileCount?: number;
    mergedAt?: string;
  };
  metricDefs: ArchitectureMetricDef[];
  teamContextRules: TeamContextRules;
  profiles: ArchitectureProfile[];
};

export type TeamContextOverlay = {
  /** Species-baseline MAG adjusted for duplicated territory in the six. */
  cMag: number;
  /** Exclusivity tax adjusted for whether the other five already serve this mon. */
  exclusivityTax: number;
  /** True when the six already has a same-archetype peer that saturates the route. */
  saturated: boolean;
  /** Short UI lines (not essays). */
  notes: string[];
};
