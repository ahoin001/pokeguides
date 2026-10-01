import {
  isCanonicalManualId,
  MANUAL_FAMILY_IDS,
  type ManualFamilyId,
  type TeamManual,
} from "@/content/manuals";
import { getPokemon } from "@/lib/catalog/load";
import type { BattleFormat } from "@/lib/format";
import { ARCHETYPE_IDS, type ArchetypeId } from "@/types/pokemon";

export type ImportPasteResult =
  | { ok: true; manual: TeamManual; notes: string[] }
  | { ok: false; error: string };

function joinJobs(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.filter(Boolean).map(String).join("; ");
  return String(value);
}

function normalizeOpening(opening: unknown) {
  if (!Array.isArray(opening)) return undefined;
  return opening.map((item) => {
    if (item && typeof item === "object" && "ask" in item) {
      const row = item as { ask?: unknown; then?: unknown };
      return {
        ask: String(row.ask ?? ""),
        then: String(row.then ?? "Decide before you lock."),
      };
    }
    return { ask: String(item), then: "Decide before you lock the turn." };
  });
}

function normalizeNetworkJobs(jobs: unknown) {
  if (!jobs || typeof jobs !== "object") return undefined;
  const row = jobs as Record<string, unknown>;
  return {
    creates: joinJobs(row.creates),
    converts: joinJobs(row.converts),
    protects: joinJobs(row.protects),
    scales: joinJobs(row.scales),
    repositions: joinJobs(row.repositions),
    archetype: typeof row.archetype === "string" ? row.archetype : undefined,
    teamContextNote: typeof row.teamContextNote === "string" ? row.teamContextNote : undefined,
  };
}

function normalizeMegaPool(raw: unknown) {
  if (!raw) return undefined;
  if (!Array.isArray(raw) && typeof raw === "object" && "candidates" in raw) return raw;
  if (!Array.isArray(raw)) return undefined;
  const candidates = raw.map((candidate) => {
    const row = (candidate ?? {}) as Record<string, unknown>;
    return {
      slug: String(row.slug ?? ""),
      stone: String(row.stone ?? row.item ?? "TODO stone"),
      when: String(row.when ?? row.identity ?? "Choose when this Mega answers the board."),
    };
  });
  return {
    rule: "One Mega Evolution per battle. Carry both stones only if the preview supports either win condition.",
    previewPressure:
      "Dual stones cost two item slots. Pick the Mega whose support resources actually work together this game.",
    cost: "Second stone occupies an item slot that could be Choice / Leftovers / Sash elsewhere.",
    candidates,
  };
}

function normalizeSlot(slot: unknown) {
  const row = { ...((slot ?? {}) as Record<string, unknown>) };
  const amp = row.ampTargets;
  if (Array.isArray(amp) && amp.length && typeof amp[0] === "string") {
    row.ampTargets = amp.map((slug) => ({
      slug,
      becomes: "Partner receives amp / support from this mon",
    }));
  }
  row.networkJobs = normalizeNetworkJobs(row.networkJobs);
  row.opening = normalizeOpening(row.opening);
  return row;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function assignLocalId(rawId: unknown, title: string) {
  const fromRaw = typeof rawId === "string" ? slugify(rawId) : "";
  let base = fromRaw || slugify(title) || "manual";
  if (base.startsWith("local-")) base = base.slice("local-".length);
  let id = `local-${base}`;
  if (isCanonicalManualId(id) || (typeof rawId === "string" && isCanonicalManualId(rawId))) {
    id = `local-copy-${base}`;
  }
  return id;
}

function stringField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Every fenced block, plus every top-level `{...}` so a sample before the manual is not the one we keep. */
function jsonCandidates(text: string): string[] {
  const chunks: string[] = [];
  const fence = /```(?:json)?\s*([\s\S]*?)```/gi;
  let match: RegExpExecArray | null;
  while ((match = fence.exec(text))) {
    const body = match[1]?.trim();
    if (body) chunks.push(body);
  }
  chunks.push(...scanTopLevelObjects(text));
  if (!chunks.length) {
    const trimmed = text.trim();
    if (trimmed) chunks.push(trimmed);
  }
  return chunks;
}

function scanTopLevelObjects(text: string): string[] {
  const found: string[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escape = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        found.push(text.slice(start, i + 1));
        start = -1;
      }
      if (depth < 0) depth = 0;
    }
  }
  return found;
}

function parseLoose(chunk: string): unknown {
  try {
    return JSON.parse(chunk);
  } catch {
    const loosened = chunk
      .replace(/^\uFEFF/, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:\\])\/\/.*$/gm, "$1")
      .replace(/,(\s*[}\]])/g, "$1");
    try {
      return JSON.parse(loosened);
    } catch {
      return undefined;
    }
  }
}

function expandManuals(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.flatMap(expandManuals);
  if (!value || typeof value !== "object") return [];
  const row = value as Record<string, unknown>;
  const nested = ["manual", "teamManual", "TeamManual", "data", "result", "payload", "json"].flatMap(
    (key) => expandManuals(row[key]),
  );
  return [row, ...nested];
}

function manualScore(row: Record<string, unknown>): number {
  let score = 0;
  const box = Array.isArray(row.box) ? row.box.length : 0;
  const roster = Array.isArray(row.roster) ? row.roster.length : 0;
  if (box >= 6) score += 100;
  else if (box > 0) score += box * 5;
  if (roster >= 6) score += 80;
  else if (roster > 0) score += roster * 4;
  if (stringField(row.title) || stringField(row.name) || stringField(row.teamName)) score += 30;
  if (row.format === "singles" || row.format === "doubles") score += 15;
  if (Array.isArray(row.packs)) score += 10 + Math.min(row.packs.length, 8);
  if (Array.isArray(row.engines)) score += 8;
  if (row.fieldPlan && box === 0 && roster === 0) score -= 40;
  return score;
}

function pickManual(text: string): Record<string, unknown> | undefined {
  let best: Record<string, unknown> | undefined;
  let bestScore = -1;
  for (const chunk of jsonCandidates(text)) {
    const parsed = parseLoose(chunk);
    if (parsed === undefined) continue;
    for (const row of expandManuals(parsed)) {
      const score = manualScore(row);
      if (score > bestScore) {
        best = row;
        bestScore = score;
      }
    }
  }
  return bestScore > 0 ? best : undefined;
}

function readTitle(raw: Record<string, unknown>, box: string[]): string {
  for (const value of [raw.title, raw.name, raw.teamName, raw.heading, raw.label]) {
    const text = stringField(value);
    if (text) return text;
  }
  const core = raw.coreArchitecture;
  if (core && typeof core === "object") {
    const identity = stringField((core as { identity?: unknown }).identity);
    if (identity) return identity.length > 90 ? `${identity.slice(0, 87)}…` : identity;
  }
  const pilot = raw.pilot;
  if (pilot && typeof pilot === "object") {
    const thesis = stringField((pilot as { thesis?: unknown }).thesis);
    if (thesis) return thesis.length > 90 ? `${thesis.slice(0, 87)}…` : thesis;
  }
  const network = raw.network;
  if (network && typeof network === "object") {
    const thesis = stringField((network as { thesis?: unknown }).thesis);
    if (thesis) return thesis.length > 90 ? `${thesis.slice(0, 87)}…` : thesis;
  }
  const lede = stringField(raw.lede);
  if (lede) return lede.length > 90 ? `${lede.slice(0, 87)}…` : lede;
  const philosophy = stringField(raw.philosophy);
  if (philosophy) return philosophy.length > 90 ? `${philosophy.slice(0, 87)}…` : philosophy;
  const id = stringField(raw.id);
  if (id && id !== "kebab-id") {
    const words = id
      .replace(/^local-/, "")
      .split(/[-_]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    if (words) return words;
  }
  const names = box
    .map((slug) => getPokemon(slug)?.name ?? slug)
    .filter(Boolean)
    .slice(0, 3);
  if (names.length) return `${names.join(" · ")} six`;
  return "";
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map(String);
}

/**
 * Turn an AI-authored manual JSON blob into a device-local TeamManual.
 * Array-shaped fields from the authoring prompt are joined or wrapped so the reader can render them.
 */
export function importPastedManual(
  text: string,
  options: { format: BattleFormat },
): ImportPasteResult {
  const raw = pickManual(text);
  if (!raw) {
    return {
      ok: false,
      error: "Couldn’t find a manual in that paste. Paste the JSON object the model returned — a ```json fence is fine.",
    };
  }

  const notes: string[] = [];
  const explicitTitle = stringField(raw.title) || stringField(raw.name) || stringField(raw.teamName);
  const box = asStringArray(raw.box);
  const rosterRaw = Array.isArray(raw.roster) ? raw.roster : [];
  const rosterSlugs = rosterRaw
    .map((slot) => (slot && typeof slot === "object" ? String((slot as { slug?: unknown }).slug ?? "") : ""))
    .filter(Boolean);
  const registered = box?.length ? box : rosterSlugs;
  if (registered.length < 6) {
    return { ok: false, error: "Need a registered six in box (or six roster entries)." };
  }

  const unknown = registered.slice(0, 6).filter((slug) => !getPokemon(slug));
  if (unknown.length) {
    return {
      ok: false,
      error: `Unknown Pokémon in the six: ${unknown.join(", ")}. Use catalog slugs (for example garchomp, farigiraf).`,
    };
  }

  const title = readTitle(raw, registered.slice(0, 6));
  if (!title) return { ok: false, error: "The manual needs a title." };
  if (!explicitTitle) notes.push("No title in the JSON, so this one is named from the team.");

  const roster = rosterRaw.map((slot) => normalizeSlot(slot));
  const construction =
    raw.construction && typeof raw.construction === "object"
      ? { ...(raw.construction as Record<string, unknown>) }
      : undefined;
  if (construction && Array.isArray(construction.altSlots)) {
    construction.altSlots = construction.altSlots.map((alt) => {
      const next = { ...((alt ?? {}) as Record<string, unknown>) };
      if (Array.isArray(next.answers)) next.answers = next.answers.map(String).join("; ");
      if (Array.isArray(next.costs)) next.costs = next.costs.map(String).join("; ");
      if (next.slot && typeof next.slot === "object") next.slot = normalizeSlot(next.slot);
      return next;
    });
  }

  const phases = Array.isArray(raw.phases)
    ? raw.phases.map((phase, index) => {
        const row = (phase ?? {}) as Record<string, unknown>;
        if (Array.isArray(row.branches)) return row;
        const body = typeof row.body === "string" ? row.body : "";
        return {
          id: typeof row.id === "string" ? row.id : `phase-${index + 1}`,
          title: typeof row.title === "string" ? row.title : `Phase ${index + 1}`,
          lede: typeof row.lede === "string" ? row.lede : body || undefined,
          branches: body ? [{ when: "This phase", then: body }] : [],
        };
      })
    : [];

  const loops = Array.isArray(raw.loops)
    ? raw.loops.map((loop, index) => {
        const row = (loop ?? {}) as Record<string, unknown>;
        return {
          ...row,
          title: typeof row.title === "string" ? row.title : typeof row.id === "string" ? row.id : `Loop ${index + 1}`,
          body: typeof row.body === "string" ? row.body : row.body == null ? "" : JSON.stringify(row.body),
        };
      })
    : [];

  const hazards = Array.isArray(raw.hazards)
    ? raw.hazards.map((note, index) => {
        if (typeof note === "string") return { title: `Hazard ${index + 1}`, body: note };
        const row = (note ?? {}) as Record<string, unknown>;
        return {
          ...row,
          title: typeof row.title === "string" ? row.title : `Hazard ${index + 1}`,
          body: typeof row.body === "string" ? row.body : "",
        };
      })
    : [];

  let format: BattleFormat = options.format;
  if (raw.format === "singles" || raw.format === "doubles") {
    format = raw.format;
    if (format !== options.format) {
      notes.push(`Saved on the ${format} shelf, matching the JSON.`);
    }
  } else {
    notes.push(`No format in the JSON, so this lands on the ${options.format} shelf.`);
  }

  let archetype: ArchetypeId = "balance";
  if (typeof raw.archetype === "string" && (ARCHETYPE_IDS as readonly string[]).includes(raw.archetype)) {
    archetype = raw.archetype as ArchetypeId;
  } else if (raw.archetype) {
    notes.push("Archetype wasn’t one this shelf knows, so it was set to Balance.");
  }

  let family: ManualFamilyId | undefined;
  if (typeof raw.family === "string" && (MANUAL_FAMILY_IDS as readonly string[]).includes(raw.family)) {
    family = raw.family as ManualFamilyId;
  } else if (raw.family) {
    notes.push("Family wasn’t one this shelf knows, so it was left off.");
  }

  const lede = typeof raw.lede === "string" && raw.lede.trim() ? raw.lede.trim() : title;
  const philosophy =
    typeof raw.philosophy === "string" && raw.philosophy.trim() ? raw.philosophy.trim() : lede;
  const id = assignLocalId(raw.id, title);
  if (typeof raw.id === "string" && isCanonicalManualId(raw.id)) {
    notes.push("Saved as yours on this device so the classroom copy of this manual stays put.");
  }

  const manual = {
    ...raw,
    id,
    title,
    lede,
    format,
    philosophy,
    archetype,
    family,
    meta: typeof raw.meta === "string" ? raw.meta : "",
    slugs: asStringArray(raw.slugs) ?? asStringArray(raw.core) ?? registered.slice(0, 4),
    slots: Array.isArray(raw.slots) ? raw.slots : [],
    phases,
    loops,
    hazards,
    box: registered.slice(0, 6),
    roster,
    construction,
    megaPool: normalizeMegaPool(raw.megaPool),
  };

  return { ok: true, manual: manual as unknown as TeamManual, notes };
}
