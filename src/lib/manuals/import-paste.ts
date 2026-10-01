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

function extractJson(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
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
  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(text));
  } catch {
    return {
      ok: false,
      error: "That isn’t JSON. Paste the manual object the model returned, fences included are fine.",
    };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "Expected one manual object, not a list." };
  }

  const raw = parsed as Record<string, unknown>;
  const notes: string[] = [];
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) return { ok: false, error: "The manual needs a title." };

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
