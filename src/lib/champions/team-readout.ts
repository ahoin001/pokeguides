import type { ArchetypeId, CatalogEntry, RoleId } from "@/types/pokemon";
import { ROLE_LABEL } from "@/content/roles";
import { ARCHETYPE_LABEL, getArchetype } from "@/content/archetypes";
import { jobOf } from "@/lib/champions/role-score";

const CORE_JOBS: RoleId[] = ["support", "speed", "breaker"];

export type TeamReadout = {
  filled: number;
  tagged: number;
  jobs: RoleId[];
  hasMega: boolean;
  missing: RoleId[];
  archetypeId: ArchetypeId | null;
  headline: string;
  detail: string;
};

export function jobsForMon(mon: CatalogEntry, intent: ArchetypeId | null | undefined): RoleId[] {
  const style = intent ? getArchetype(intent) : null;
  const fromRoster = style?.roster.filter((s) => s.exampleSlug === mon.slug).map((s) => s.job) ?? [];
  if (fromRoster.length) return fromRoster;
  return [jobOf(mon)];
}

function uniqueJobs(mons: CatalogEntry[], intent: ArchetypeId | null | undefined): RoleId[] {
  const seen = new Set<RoleId>();
  for (const m of mons) {
    for (const job of jobsForMon(m, intent)) seen.add(job);
  }
  return [...seen];
}

export function slotJob(mon: CatalogEntry, intent: ArchetypeId | null | undefined): RoleId {
  return jobsForMon(mon, intent)[0] ?? jobOf(mon);
}

function neededJobs(intent: ArchetypeId | null | undefined): RoleId[] {
  if (!intent) return [...CORE_JOBS, "mega"];
  return [...(getArchetype(intent)?.jobs ?? CORE_JOBS)];
}

function missingJobs(jobs: RoleId[], hasMega: boolean, needed: RoleId[]): RoleId[] {
  return needed.filter((j) => {
    if (j === "mega") return !hasMega && !jobs.includes("mega");
    return !jobs.includes(j);
  });
}

function missingSentence(missing: RoleId[]) {
  if (!missing.length) return "The usual jobs are on the three.";
  const names = missing.map((id) => ROLE_LABEL[id]);
  if (names.length === 1) return `Still missing ${names[0]}.`;
  if (names.length === 2) return `Still missing ${names[0]} and ${names[1]}.`;
  return `Still missing ${names.slice(0, -1).join(", ")}, and ${names.at(-1)}.`;
}

export function readTeam(mons: CatalogEntry[], intent?: ArchetypeId | null): TeamReadout {
  const filled = mons.length;
  const slugs = new Set(mons.map((m) => m.slug));

  let slugGuess: ArchetypeId | null = null;
  if (slugs.has("pelipper")) slugGuess = "rain";
  else if (slugs.has("rillaboom")) slugGuess = "grassy";
  else if (slugs.has("farigiraf")) slugGuess = "trick-room";
  else if (slugs.has("salamence-mega")) slugGuess = "hyper-offense";
  else if (slugs.has("charizard-mega-y")) slugGuess = "sun";
  else if (slugs.has("garchomp") && slugs.has("kingambit") && slugs.has("gholdengo")) slugGuess = "balance";

  const styleKey = intent ?? slugGuess;
  const jobs = uniqueJobs(mons, styleKey);
  const tagged = mons.filter((m) => m.role || m.form === "mega" || m.form === "mega-z").length;
  const hasMega = mons.some(
    (m) => m.form === "mega" || m.form === "mega-z" || jobsForMon(m, styleKey).includes("mega"),
  );
  const needed = neededJobs(intent ?? slugGuess);
  const missing = missingJobs(jobs, hasMega, needed);

  const empty: Omit<TeamReadout, "headline" | "detail" | "archetypeId"> = {
    filled,
    tagged,
    jobs,
    hasMega,
    missing,
  };

  if (filled === 0) {
    return {
      ...empty,
      archetypeId: intent ?? null,
      headline: intent ? `Building as ${ARCHETYPE_LABEL[intent]}` : "Empty field",
      detail: intent
        ? `Load a sample, or pick the ${needed.map((j) => ROLE_LABEL[j]).join(", ")} this style wants.`
        : "Pick a style, load a sample three from Learn, or pick from the dex.",
    };
  }

  if (filled < 3) {
    return {
      ...empty,
      archetypeId: intent ?? null,
      headline: intent ? `Building as ${ARCHETYPE_LABEL[intent]}` : "Still building",
      detail: `${3 - filled} more. ${missingSentence(missing)}`,
    };
  }

  const frailAttackers = ["garchomp", "cinderace", "sneasler", "salamence-mega", "kingambit", "basculegion-male"];
  const frailCount = frailAttackers.filter((s) => slugs.has(s)).length;

  let guessed = slugGuess;
  if (!guessed && frailCount >= 2 && !slugs.has("gholdengo")) guessed = "hyper-offense";
  else if (!guessed && jobs.includes("support") && jobs.includes("breaker")) guessed = "balance";

  const archetypeId = intent ?? guessed;

  if (!archetypeId) {
    return {
      ...empty,
      archetypeId: null,
      headline: tagged < filled ? "Mixed three" : "No named style yet",
      detail:
        tagged < filled
          ? `Jobs are guessed from stats and kit on ${filled - tagged} of ${filled}. ${missingSentence(missing)}`
          : `This three mixes jobs. Pick a style and cut the pieces that fight it. ${missingSentence(missing)}`,
    };
  }

  return {
    ...empty,
    archetypeId,
    headline: `This three plays like ${ARCHETYPE_LABEL[archetypeId]}`,
    detail: missing.length ? missingSentence(missing) : "Jobs line up with the style. Preview is where you send first.",
  };
}
