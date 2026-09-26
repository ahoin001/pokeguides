/**
 * Normalize Ringside_Dual_Mega_Farigiraf_Full_Manual.json → TeamManual-shaped JSON
 * and emit a thin TS module.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "docs/Ringside_Dual_Mega_Farigiraf_Full_Manual.json");
const OUT_JSON = path.join(
  ROOT,
  "src/content/manuals/dual-mega-farigiraf-contrary-z.json",
);
const OUT_TS = path.join(
  ROOT,
  "src/content/manuals/dual-mega-farigiraf-contrary-z.ts",
);

function joinJobs(v) {
  if (v == null) return undefined;
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.filter(Boolean).join("; ");
  return String(v);
}

function normalizeOpening(opening) {
  if (!Array.isArray(opening)) return undefined;
  return opening.map((item) => {
    if (item && typeof item === "object" && "ask" in item) {
      return { ask: item.ask, then: item.then ?? "Decide before you lock." };
    }
    return {
      ask: String(item),
      then: "Decide before you lock the turn.",
    };
  });
}

function normalizeNetworkJobs(jobs) {
  if (!jobs) return undefined;
  return {
    creates: joinJobs(jobs.creates),
    converts: joinJobs(jobs.converts),
    protects: joinJobs(jobs.protects),
    scales: joinJobs(jobs.scales),
    repositions: joinJobs(jobs.repositions),
    archetype: jobs.archetype,
    teamContextNote: jobs.teamContextNote,
  };
}

function normalizeMegaPool(raw) {
  if (!raw) return undefined;
  if (!Array.isArray(raw) && typeof raw === "object" && "candidates" in raw) {
    return raw;
  }
  if (!Array.isArray(raw)) return undefined;
  const candidates = raw.map((c) => ({
    slug: c.slug,
    stone: c.stone ?? c.item ?? "TODO stone",
    when: c.when ?? c.identity ?? "Choose when this Mega answers the board.",
  }));
  return {
    rule: "One Mega Evolution per battle. Carry both stones only if the preview supports either win condition.",
    previewPressure:
      "Dual stones cost two item slots. Pick the Mega whose support resources actually work together this game.",
    cost: "Second stone occupies an item slot that could be Choice / Leftovers / Sash elsewhere.",
    candidates,
  };
}

function normalizeSlot(slot) {
  let ampTargets = slot.ampTargets;
  if (Array.isArray(ampTargets) && ampTargets.length && typeof ampTargets[0] === "string") {
    ampTargets = ampTargets.map((slug) => ({
      slug,
      becomes: "Partner receives amp / support from this mon",
    }));
  }

  return {
    ...slot,
    ampTargets,
    answers: Array.isArray(slot.answers) ? slot.answers : slot.answers,
    gives: Array.isArray(slot.gives) ? slot.gives : slot.gives,
    networkJobs: normalizeNetworkJobs(slot.networkJobs),
    opening: normalizeOpening(slot.opening),
  };
}

function main() {
  const raw = JSON.parse(fs.readFileSync(SRC, "utf8"));

  const roster = Array.isArray(raw.roster)
    ? raw.roster.map((s) => normalizeSlot(s))
    : [];

  const construction = raw.construction;
  if (construction?.altSlots && Array.isArray(construction.altSlots)) {
    construction.altSlots = construction.altSlots.map((a) => {
      const next = { ...a };
      if (Array.isArray(next.answers)) next.answers = next.answers.join("; ");
      if (Array.isArray(next.costs)) next.costs = next.costs.join("; ");
      if (next.slot && typeof next.slot === "object") {
        next.slot = normalizeSlot(next.slot);
      }
      return next;
    });
  }

  const phases = Array.isArray(raw.phases)
    ? raw.phases.map((p) => {
        if (p.branches) return p;
        return {
          id: p.id,
          title: p.title,
          lede: p.lede ?? p.body,
          branches: p.body
            ? [{ when: "This phase", then: p.body }]
            : [],
        };
      })
    : [];

  const loops = Array.isArray(raw.loops)
    ? raw.loops.map((l) => ({
        title: l.title ?? l.id ?? "Loop",
        body: typeof l.body === "string" ? l.body : JSON.stringify(l.body ?? ""),
        type: l.type,
        id: l.id,
      }))
    : [];

  const manual = {
    ...raw,
    id: "dual-mega-farigiraf-contrary-z-manual",
    roster,
    slots: Array.isArray(raw.slots) ? raw.slots : [],
    phases,
    loops,
    megaPool: normalizeMegaPool(raw.megaPool),
    slugs: raw.slugs ?? raw.core ?? raw.box?.slice(0, 4) ?? [],
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(manual, null, 2) + "\n");
  fs.writeFileSync(
    OUT_TS,
    `import type { TeamManual } from "@/content/manuals";
import raw from "./dual-mega-farigiraf-contrary-z.json";

/** Dual-Mega Farigiraf: Contrary Staraptor vs Garchomp-Z branches. */
export const DUAL_MEGA_FARIGIRAF_CONTRARY_Z_MANUAL = raw as unknown as TeamManual;
`,
  );

  console.log(
    JSON.stringify(
      {
        wrote: [OUT_JSON, OUT_TS],
        id: manual.id,
        box: manual.box,
        packs: manual.packs?.length,
        roster: roster.length,
        megaCandidates: manual.megaPool?.candidates?.length,
      },
      null,
      2,
    ),
  );
}

main();
