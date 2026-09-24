/**
 * Recover architecture-metrics seed batches and merge into src/data/architecture-metrics.json
 * Sources: transcript (1a/1b/1c), Cursor local history (4A), docs/content (4B)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TRANSCRIPT =
  "C:/Users/ahoin/.cursor/projects/c-Users-ahoin-Desktop-Pokemon/agent-transcripts/3887a8b6-a45c-4aa8-be76-8f9c074c3b76/3887a8b6-a45c-4aa8-be76-8f9c074c3b76.jsonl";
const HIST_DIR =
  "C:/Users/ahoin/AppData/Roaming/Cursor/User/History/-1a8e1de";
const OUT = path.join(ROOT, "src/data/architecture-metrics.json");
const REG = path.join(ROOT, "src/data/regulation.json");

function parseLooseJson(raw) {
  const start = raw.indexOf("{");
  if (start < 0) throw new Error("no JSON object start");
  // Prefer full parse; fall back to last complete }
  try {
    return JSON.parse(raw.slice(start));
  } catch {
    const end = raw.lastIndexOf("}");
    return JSON.parse(raw.slice(start, end + 1));
  }
}

function extractUserJsonFromTranscriptLine(line) {
  const row = JSON.parse(line);
  const text = row.message?.content?.find?.((c) => c.type === "text")?.text;
  if (!text) throw new Error("no text content");
  // Strip timestamp / leading prose before first {
  const idx = text.indexOf("{");
  if (idx < 0) throw new Error("no JSON in user message");
  return parseLooseJson(text.slice(idx));
}

function loadTranscriptBatches() {
  const lines = fs.readFileSync(TRANSCRIPT, "utf8").split(/\n/);
  const targets = {
    2763: "1a",
    2768: "1b",
    2771: "1c",
  };
  const out = {};
  for (const [lineNo, label] of Object.entries(targets)) {
    const line = lines[Number(lineNo) - 1];
    if (!line) throw new Error(`missing transcript line ${lineNo}`);
    const j = extractUserJsonFromTranscriptLine(line);
    out[label] = j;
    console.log(
      `transcript ${label}: ${(j.profiles || []).length} profiles (${j.profiles?.[0]?.slug} → ${j.profiles?.at(-1)?.slug})`,
    );
  }
  return out;
}

function loadHistory4A() {
  const raw = fs.readFileSync(path.join(HIST_DIR, "JRWC"), "utf8");
  const j = parseLooseJson(raw);
  console.log(
    `history 4A: ${(j.profiles || []).length} profiles (${j.profiles?.[0]?.slug} → ${j.profiles?.at(-1)?.slug})`,
  );
  return j;
}

function loadDocs4B() {
  const raw = fs.readFileSync(path.join(ROOT, "docs/content"), "utf8");
  const j = parseLooseJson(raw);
  console.log(
    `docs 4B: ${(j.profiles || []).length} profiles (${j.profiles?.[0]?.slug} → ${j.profiles?.at(-1)?.slug})`,
  );
  return j;
}

function main() {
  const t = loadTranscriptBatches();
  const a4 = loadHistory4A();
  const b4 = loadDocs4B();

  const batches = [t["1a"], t["1b"], t["1c"], a4, b4];
  const bySlug = new Map();
  for (const b of batches) {
    for (const p of b.profiles || []) {
      if (!p?.slug) continue;
      if (bySlug.has(p.slug)) {
        console.warn(`duplicate slug (keeping first): ${p.slug}`);
        continue;
      }
      bySlug.set(p.slug, p);
    }
  }

  // Use meta/metricDefs/teamContextRules from last complete seed (4B) or 1a
  const base = b4.meta ? b4 : t["1a"];
  const merged = {
    meta: {
      ...base.meta,
      seededFrom: ["1a", "1b", "1c", "4A", "4B"],
      profileCount: bySlug.size,
      mergedAt: new Date().toISOString().slice(0, 10),
    },
    metricDefs: base.metricDefs || t["1a"].metricDefs,
    teamContextRules: base.teamContextRules || t["1a"].teamContextRules,
    profiles: [...bySlug.values()].sort((a, b) =>
      a.slug.localeCompare(b.slug),
    ),
  };

  // Drop seed-only noise keys if present on profiles
  for (const p of merged.profiles) {
    // keep as-is; don't strip notes
  }

  const reg = JSON.parse(fs.readFileSync(REG, "utf8"));
  const regSlugs = new Set(reg.slugs);
  const scored = new Set(merged.profiles.map((p) => p.slug));
  const missing = [...regSlugs].filter((s) => !scored.has(s)).sort();
  const extra = [...scored].filter((s) => !regSlugs.has(s)).sort();

  console.log(
    JSON.stringify(
      {
        profiles: merged.profiles.length,
        metricDefs: merged.metricDefs?.length,
        teamContextRules: Object.keys(merged.teamContextRules || {}),
        missingFromReg: missing.length,
        missingSample: missing.slice(0, 15),
        extraNotInReg: extra.length,
        extraSample: extra.slice(0, 15),
      },
      null,
      2,
    ),
  );

  // Spot-check connector/conversion examples
  for (const slug of [
    "salamence",
    "salamence-mega",
    "gholdengo",
    "floette-eternal",
    "camerupt",
  ]) {
    const p = bySlug.get(slug);
    if (!p) {
      console.log("MISSING spot", slug);
      continue;
    }
    console.log("spot", slug, {
      archetype: p.archetype,
      tax: p.scores?.engineExclusivityTax,
      bridge: p.scores?.bridgeQuality,
      create: p.scores?.createFanOut,
      convert: p.scores?.convertFanOut,
      ecc: p.scores?.engineConverterContinuity,
    });
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(merged, null, 2) + "\n");
  console.log("wrote", OUT);

  // Also stash recovered batch copies so overwrite can't lose them again
  const stash = path.join(ROOT, "docs/architecture-seed");
  fs.mkdirSync(stash, { recursive: true });
  fs.writeFileSync(
    path.join(stash, "1a.json"),
    JSON.stringify(t["1a"], null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(stash, "1b.json"),
    JSON.stringify(t["1b"], null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(stash, "1c.json"),
    JSON.stringify(t["1c"], null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(stash, "4a.json"),
    JSON.stringify(a4, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(stash, "4b.json"),
    JSON.stringify(b4, null, 2) + "\n",
  );
  console.log("stashed docs/architecture-seed/{1a,1b,1c,4a,4b}.json");
}

main();
