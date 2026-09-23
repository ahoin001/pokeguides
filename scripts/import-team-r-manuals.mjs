/**
 * Import doubles manuals from content/regulations/updates.json
 * (falls back to content/regulations/team-r) into src/content/manuals/.
 * Strips markdown footnotes, normalizes to TeamManual, emits TS + registers.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_UPDATES = path.join(ROOT, "content/regulations/updates.json");
const SRC_TEAM_R = path.join(ROOT, "content/regulations/team-r");
const SRC = fs.existsSync(SRC_UPDATES) ? SRC_UPDATES : SRC_TEAM_R;
const OUT_DIR = path.join(ROOT, "src/content/manuals");
const MANUALS_INDEX = path.join(ROOT, "src/content/manuals.ts");

const SP_NOTE =
  "Starting architecture spend (66 SP, max 32). Recommended configuration — not claimed as mathematically optimal vs every M-C threshold.";

const PACK_ID_FIX = {
  "r2-adaptive-control": "r2-hybrid-sand-special",
};

const CONTROL_PLANE_META = {
  sand: { label: "Sand", setterSlug: "tyranitar", whoBenefits: "Excadrill and Sand-dependent pressure" },
  "sand-rush": { label: "Sand Rush", setterSlug: "excadrill", whoBenefits: "Immediate Ground / Steel / Rock conversion" },
  tailwind: { label: "Tailwind", setterSlug: "salamence", whoBenefits: "Physical and special converters" },
  "fake-out": { label: "Fake Out", setterSlug: "rillaboom", whoBenefits: "Partners needing a free turn" },
  "grassy-terrain": { label: "Grassy Terrain", setterSlug: "rillaboom", whoBenefits: "Recovery and Grassy Glide" },
  intimidate: { label: "Intimidate", setterSlug: "salamence", whoBenefits: "Physical defense and Milotic Competitive" },
  competitive: { label: "Competitive", setterSlug: "milotic", whoBenefits: "Special pressure after Attack drops" },
  coil: { label: "Coil", setterSlug: "milotic", whoBenefits: "Physical bulk and accuracy scaling" },
  hypnosis: { label: "Hypnosis", setterSlug: "milotic", whoBenefits: "Denying actions from setup threats" },
  "coil-hypnosis": { label: "Coil / Hypnosis", setterSlug: "milotic", whoBenefits: "Control endgames" },
  "nasty-plot": { label: "Nasty Plot", setterSlug: "gholdengo", whoBenefits: "Special scaling clock" },
  priority: { label: "Priority", setterSlug: "rillaboom", whoBenefits: "Late-game conversion" },
  "weather-control": { label: "Weather control", setterSlug: "tyranitar", whoBenefits: "Excadrill and Rain inversion" },
  "trick-room": { label: "Trick Room", setterSlug: "farigiraf", whoBenefits: "Golisopod and slow converters" },
  "armor-tail": { label: "Armor Tail", setterSlug: "farigiraf", whoBenefits: "Priority denial" },
  "psychic-noise": { label: "Psychic Noise", setterSlug: "farigiraf", whoBenefits: "Recovery denial" },
  encore: { label: "Encore", setterSlug: "incineroar", whoBenefits: "Locking passive or setup turns" },
  "parting-shot": { label: "Parting Shot", setterSlug: "incineroar", whoBenefits: "Pivot control" },
};

const MEGA_STONE_BY_SLUG = {
  tyranitar: "Tyranitarite",
  salamence: "Salamencite",
  garchomp: "Garchompite",
  charizard: "Charizardite Y",
  swampert: "Swampertite",
  gardevoir: "Gardevoirite",
  mawile: "Mawilite",
  gyarados: "Gyaradosite",
  metagross: "Metagrossite",
};

function joinLines(v) {
  if (v == null) return undefined;
  if (Array.isArray(v)) return v.filter(Boolean).join("; ") || undefined;
  if (typeof v === "string") return v;
  return String(v);
}

function emitTrain(sp, meta, indent) {
  const pad = " ".repeat(indent);
  const copy = {
    label: meta.label ?? "Spread",
    why: meta.why ?? "",
    ...(meta.spend ? { spend: meta.spend } : {}),
    ...(meta.rule ? { rule: meta.rule } : {}),
  };
  const copyJson = JSON.stringify(copy, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : pad + line))
    .join("\n");
  return `train(${sp.hp ?? 0}, ${sp.atk ?? 0}, ${sp.def ?? 0}, ${sp.spa ?? 0}, ${sp.spd ?? 0}, ${sp.spe ?? 0}, ${copyJson})`;
}

function emitValue(v, indent = 2) {
  if (v && v.__train) {
    return emitTrain(v.sp, v, indent + 2);
  }
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    return `[\n${v.map((x) => `${" ".repeat(indent + 2)}${emitValue(x, indent + 2)},`).join("\n")}\n${" ".repeat(indent)}]`;
  }
  if (v && typeof v === "object") {
    const keys = Object.keys(v);
    if (!keys.length) return "{}";
    return `{\n${keys
      .map((k) => {
        const val = emitValue(v[k], indent + 2);
        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
        return `${" ".repeat(indent + 2)}${key}: ${val},`;
      })
      .join("\n")}\n${" ".repeat(indent)}}`;
  }
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "boolean" || typeof v === "number") return String(v);
  if (v == null) return "undefined";
  return String(v);
}

function normalizeNetworkJobs(jobs) {
  if (!jobs) return undefined;
  const out = {};
  for (const k of ["creates", "converts", "protects", "scales", "repositions"]) {
    const s = joinLines(jobs[k]);
    if (s) out[k] = s;
  }
  return Object.keys(out).length ? out : undefined;
}

function normalizeAbilityStages(stages) {
  if (!stages) return undefined;
  if (Array.isArray(stages)) {
    if (stages.length < 2) return undefined;
    return {
      before: String(stages[0]),
      after: String(stages[1]),
      when: String(stages[2] ?? stages[1]),
    };
  }
  if (stages.before && stages.after && stages.when) return stages;
  return undefined;
}

function normalizeAmpTargets(targets) {
  if (!targets?.length) return undefined;
  return targets.map((t) =>
    typeof t === "string" ? { slug: t, becomes: "Amp target" } : t,
  );
}

function normalizeItemLoop(loop) {
  if (!loop) return undefined;
  if (typeof loop === "string") {
    return {
      beats: [{ click: loop }],
    };
  }
  if (loop.beats) return loop;
  return undefined;
}

function normalizeSlot(slot) {
  const sp = slot.training?.sp ?? null;
  const training = sp
    ? {
        __train: true,
        sp,
        label: slot.training?.label,
        why: slot.training?.why,
        spend: slot.training?.spend,
        rule: slot.training?.rule,
      }
    : undefined;

  const out = {
    slug: slot.slug,
    title: slot.title ?? slot.species ?? slot.slug,
    job: slot.job ?? "breaker",
    ...(slot.literacy ? { literacy: slot.literacy } : {}),
    ...(slot.primaryJob ? { primaryJob: slot.primaryJob } : {}),
    role: slot.role ?? "",
    ...(slot.item ? { item: slot.item } : {}),
    ...(slot.ability ? { ability: slot.ability } : {}),
    ...(slot.nature ? { nature: slot.nature } : {}),
    moves: slot.moves ?? [],
    objective: slot.objective ?? "",
    howToPlay: slot.howToPlay ?? "",
    ...(training ? { training } : {}),
  };

  const networkJobs = normalizeNetworkJobs(slot.networkJobs);
  if (networkJobs) out.networkJobs = networkJobs;

  const abilityStages = normalizeAbilityStages(slot.abilityStages);
  if (abilityStages) out.abilityStages = abilityStages;

  const ampTargets = normalizeAmpTargets(slot.ampTargets);
  if (ampTargets) out.ampTargets = ampTargets;

  const itemLoop = normalizeItemLoop(slot.itemLoop);
  if (itemLoop) out.itemLoop = itemLoop;

  if (slot.gives) out.gives = slot.gives;
  if (slot.answers) out.answers = slot.answers;
  if (slot.itemWhy) out.itemWhy = slot.itemWhy;
  if (slot.modes) out.modes = slot.modes;
  if (slot.contrast) out.contrast = slot.contrast;

  return out;
}

function normalizeControlPlanes(planes, box) {
  if (!planes?.length) return undefined;
  return planes.map((p, i) => {
    if (typeof p === "string") {
      const meta = CONTROL_PLANE_META[p] ?? {};
      return {
        id: p,
        label: meta.label ?? p,
        setterSlug: meta.setterSlug ?? box[0] ?? "",
        effect: meta.label ?? p,
        whoBenefits: meta.whoBenefits ?? "Partners that convert the created state",
      };
    }
    return {
      id: p.id ?? `plane-${i}`,
      label: p.label ?? p.id ?? `Plane ${i + 1}`,
      setterSlug: p.setterSlug ?? box[0] ?? "",
      effect: p.effect ?? p.purpose ?? p.label ?? "",
      whoBenefits: p.whoBenefits ?? "Converters",
    };
  });
}

function megaStoneFor(slug, c = {}) {
  return (
    c.stone ??
    c.item ??
    MEGA_STONE_BY_SLUG[slug] ??
    ""
  );
}

function normalizeMegaPool(pool, box) {
  if (!pool) return undefined;
  if (Array.isArray(pool)) {
    if (!pool.length) return undefined;
    return {
      rule: "One Mega Stone per battle — preview which Mega candidate matters more.",
      previewPressure: "Decide which Mega path the opponent most fears before locking the stone.",
      candidates: pool.map((c) => ({
        slug: c.slug,
        stone: megaStoneFor(c.slug, c),
        when: c.when ?? c.reason ?? c.role ?? "",
      })),
    };
  }
  return {
    rule: pool.rule ?? "One Mega Stone per battle.",
    previewPressure: pool.previewPressure ?? "",
    ...(pool.cost ? { cost: pool.cost } : {}),
    candidates: (pool.candidates ?? []).map((c) => ({
      slug: c.slug,
      stone: megaStoneFor(c.slug, c),
      when: c.when ?? c.reason ?? c.role ?? "",
    })),
  };
}

function normalizeMatchupScripts(scripts, packs) {
  const packIds = new Set((packs ?? []).map((p) => p.id));
  return (scripts ?? []).map((s, i) => {
    let packId = PACK_ID_FIX[s.packId] ?? s.packId;
    if (!packIds.has(packId) && packs?.[0]) packId = packs[0].id;
    const foe = s.foe ?? s.pattern ?? `Script ${i + 1}`;
    const why = s.why ?? s.pattern ?? s.script ?? "Bring the package that answers this preview.";
    const sequence =
      s.sequence?.beats
        ? s.sequence
        : {
            beats: String(s.script ?? why)
              .split(/(?<=\.)\s+/)
              .filter(Boolean)
              .slice(0, 4)
              .map((click) => ({ click })),
          };
    if (!sequence.beats.length) sequence.beats = [{ click: why }];
    return {
      id: s.id ?? `script-${i + 1}`,
      foe,
      why,
      packId,
      sequence,
      ...(s.trap ? { trap: s.trap } : {}),
    };
  });
}

function normalizeArchitecture(layers) {
  return (layers ?? []).map((l) => ({
    title: l.title ?? l.layer ?? "Layer",
    body: l.body ?? l.summary ?? "",
    ...(l.slugs ? { slugs: l.slugs } : {}),
  }));
}

function normalizeLoop(loop) {
  if (!loop) return null;
  const fromParts = [loop.trigger, ...(loop.sequence ?? []), loop.payoff]
    .filter(Boolean)
    .join(" ");
  const body = loop.body || fromParts || loop.title || "";
  return {
    title: loop.title ?? "Loop",
    body,
    ...(loop.id ? { id: loop.id } : {}),
    ...(loop.type ? { type: loop.type } : {}),
    ...(loop.trigger ? { trigger: loop.trigger } : {}),
    ...(loop.sequence ? { sequence: loop.sequence } : {}),
    ...(loop.payoff ? { payoff: loop.payoff } : {}),
  };
}

function normalizeStrategy(strategy, pack) {
  if (!strategy) return undefined;
  const {
    turnChecklist: _tc,
    defaultLeadPair: _dlp,
    defaultLeadWhy: _dlw,
    contrast: strategyContrast,
    ...rest
  } = strategy;
  return {
    ...rest,
    bring: strategy.bring ?? pack.slugs,
    ...(pack.contrast && !strategyContrast ? { contrast: pack.contrast } : {}),
    ...(strategyContrast ? { contrast: strategyContrast } : {}),
  };
}

function normalizePack(pack) {
  const strategy = normalizeStrategy(pack.strategy, pack);
  const loops = (pack.loops ?? []).map(normalizeLoop).filter(Boolean);

  return {
    id: pack.id,
    label: pack.label,
    when: pack.when ?? "",
    identity: pack.identity ?? "",
    slugs: pack.slugs,
    ...(strategy ? { strategy } : {}),
    ...(pack.roles ? { roles: pack.roles } : {}),
    ...(pack.fieldPlan ? { fieldPlan: pack.fieldPlan } : {}),
    ...(pack.defaultLeadPair
      ? { defaultLeadPair: pack.defaultLeadPair }
      : pack.strategy?.defaultLeadPair
        ? { defaultLeadPair: pack.strategy.defaultLeadPair }
        : {}),
    ...(pack.backPair
      ? { backPair: pack.backPair }
      : pack.fieldPlan?.backPair
        ? { backPair: pack.fieldPlan.backPair }
        : {}),
    ...(pack.identityCard ? { identityCard: pack.identityCard } : {}),
    ...(pack.pilotDecision ? { pilotDecision: pack.pilotDecision } : {}),
    ...(pack.engineIds ? { engineIds: pack.engineIds } : {}),
    ...(pack.winRouteIds ? { winRouteIds: pack.winRouteIds } : {}),
    ...(pack.endgameIds ? { endgameIds: pack.endgameIds } : {}),
    ...(pack.flows ? { flows: pack.flows } : {}),
    ...(loops.length ? { loops } : { loops: [] }),
    ...(pack.phases ? { phases: pack.phases } : {}),
    ...(pack.victims ? { victims: pack.victims } : {}),
    ...(pack.counters ? { counters: pack.counters } : {}),
    ...(pack.advantages ? { advantages: pack.advantages } : {}),
    ...(pack.hazards ? { hazards: pack.hazards } : {}),
    ...(pack.requiresSwap ? { requiresSwap: pack.requiresSwap } : {}),
    ...(pack.pilot ? { pilot: pack.pilot } : {}),
  };
}

function exportConstName(id) {
  return (
    id
      .replace(/-/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .toUpperCase() + "_MANUAL"
  );
}

function fileStem(id) {
  return id.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

function normalizeManual(raw) {
  const box = raw.box ?? [];
  const core = raw.core?.length ? raw.core : box.slice(0, 4);
  const packs = (raw.packs ?? raw.packages ?? []).map(normalizePack);
  const roster = (raw.roster ?? []).map(normalizeSlot);

  const construction = raw.construction
    ? {
        thesis: raw.construction.thesis ?? "",
        method: raw.construction.method ?? "",
        winCondition: raw.construction.winCondition ?? "",
        ...(raw.construction.endgames ? { endgames: raw.construction.endgames } : {}),
        ...(raw.construction.endgame && !raw.construction.endgames
          ? { endgames: raw.construction.endgame }
          : {}),
        ...(raw.construction.omissions ? { omissions: raw.construction.omissions } : {}),
        ...(raw.construction.substitutions
          ? { substitutions: raw.construction.substitutions }
          : {}),
        ...(raw.construction.altSlots ? { altSlots: raw.construction.altSlots } : {}),
      }
    : undefined;

  const pilot = {
    thesis: raw.pilot?.thesis ?? raw.philosophy ?? "",
    rule:
      raw.pilot?.rule ??
      raw.pilot?.beginnerTranslation ??
      "Pick the package whose clock the opponent cannot answer first.",
    fail: raw.pilot?.fail ?? "Forcing one engine after the opponent has already closed that route.",
  };

  const phases =
    raw.phases?.length
      ? raw.phases
      : [
          {
            id: "preview",
            title: "Preview",
            lede: "Choose the package that matches the opponent's speed and control profile.",
            branches: [{ when: "Preview is unclear", then: "Default to the safest core package." }],
          },
        ];

  const loops =
    raw.loops?.length
      ? raw.loops.map(normalizeLoop).filter(Boolean)
      : packs
          .flatMap((p) => p.loops ?? [])
          .slice(0, 3)
          .map((l) => ({
            title: l.title,
            body: l.body,
          }));

  const hazards = raw.hazards?.length
    ? raw.hazards
    : [{ title: "Preview misread", body: "Bringing the wrong speed philosophy can waste the six." }];

  return {
    id: `${raw.id}-manual`,
    title: raw.title,
    lede: raw.lede,
    format: raw.format ?? "doubles",
    philosophy: raw.philosophy ?? "",
    archetype: raw.archetype ?? "balance",
    ...(raw.family ? { family: raw.family } : {}),
    meta: raw.meta ?? "Regulation M-C",
    setsNote: SP_NOTE,
    pilot,
    box,
    core,
    slugs: core,
    slots: [],
    roster,
    packs,
    phases,
    loops: loops.length ? loops : [{ title: "Convert", body: "Create a resource, then spend it immediately." }],
    hazards,
    ...(raw.press ? { press: raw.press } : {}),
    ...(raw.refuse ? { refuse: raw.refuse } : {}),
    ...(raw.victims ? { victims: raw.victims } : {}),
    ...(raw.counters ? { counters: raw.counters } : {}),
    ...(raw.advantages ? { advantages: raw.advantages } : {}),
    ...(raw.coreArchitecture ? { coreArchitecture: raw.coreArchitecture } : {}),
    ...(raw.architecture ? { architecture: normalizeArchitecture(raw.architecture) } : {}),
    ...(raw.clocks ? { clocks: raw.clocks } : {}),
    ...(raw.winRoutes ? { winRoutes: raw.winRoutes } : {}),
    ...(raw.failureRoutes ? { failureRoutes: raw.failureRoutes } : {}),
    ...(construction ? { construction } : {}),
    ...(raw.engines ? { engines: raw.engines } : {}),
    ...(raw.network ? { network: raw.network } : {}),
    ...(raw.commandments ? { commandments: raw.commandments } : {}),
    controlPlanes: normalizeControlPlanes(raw.controlPlanes, box),
    megaPool: normalizeMegaPool(raw.megaPool, box),
    matchupScripts: normalizeMatchupScripts(raw.matchupScripts, packs),
    ...(raw.evidence
      ? {
          evidence: {
            ...(raw.evidence.season ? { season: raw.evidence.season } : {}),
            ...(raw.evidence.asOf ? { asOf: raw.evidence.asOf } : {}),
            ...(raw.evidence.source ? { source: raw.evidence.source } : {}),
            ...(raw.evidence.caveat || raw.evidence.templateBasis
              ? {
                  caveat: [raw.evidence.caveat, raw.evidence.templateBasis]
                    .filter(Boolean)
                    .join(" "),
                }
              : {}),
            ...(raw.evidence.ladderTop ? { ladderTop: raw.evidence.ladderTop } : {}),
            ...(raw.evidence.stats ? { stats: raw.evidence.stats } : {}),
          },
        }
      : {}),
    ...(raw.bench ? { bench: raw.bench } : {}),
    ...(raw.modules ? { modules: raw.modules } : {}),
    ...(raw.benchDiagnostics ? { benchDiagnostics: raw.benchDiagnostics } : {}),
  };
}

function emitFile(manual, constName) {
  const body = emitValue(manual, 2);
  return `import { train } from "@/content/manual-train";
import type { TeamManual } from "@/content/manuals";

export const ${constName} = ${body} satisfies TeamManual;
`;
}

// --- main ---
const cliSrc = process.argv[2]
  ? path.resolve(ROOT, process.argv[2])
  : SRC;
let rawText = fs.readFileSync(cliSrc, "utf8");
const end = rawText.lastIndexOf("}");
rawText = rawText.slice(0, end + 1);
const payload = JSON.parse(rawText);
const manuals = Array.isArray(payload.manuals)
  ? payload.manuals
  : payload.id && payload.box
    ? [payload]
    : [];
if (!manuals.length) {
  console.error("No manuals found in", path.relative(ROOT, cliSrc));
  process.exit(1);
}
console.log("importing from", path.relative(ROOT, cliSrc));

const emitted = [];
for (const raw of manuals) {
  const manual = normalizeManual(raw);
  const constName = exportConstName(raw.id);
  const stem = fileStem(raw.id);
  const outPath = path.join(OUT_DIR, `${stem}.ts`);
  fs.writeFileSync(outPath, emitFile(manual, constName), "utf8");
  emitted.push({ constName, stem, id: manual.id, title: manual.title, packs: manual.packs.length });
  console.log("wrote", outPath, "→", manual.id, `(${manual.packs.length} packs)`);
}

// Register in manuals.ts
let index = fs.readFileSync(MANUALS_INDEX, "utf8");
for (const e of emitted) {
  const importLine = `import { ${e.constName} } from "@/content/manuals/${e.stem}";`;
  if (!index.includes(e.constName)) {
    // Insert import after last manuals import
    const lastImport = [...index.matchAll(/^import \{ .+ \} from "@\/content\/manuals\/.+";$/gm)].at(-1);
    if (lastImport) {
      const insertAt = lastImport.index + lastImport[0].length;
      index = index.slice(0, insertAt) + "\n" + importLine + index.slice(insertAt);
    } else {
      index = importLine + "\n" + index;
    }
  }
  if (!index.includes(e.constName) || !/CANONICAL_MANUALS[\s\S]*?\b/.test(index)) {
    // noop for clarity
  }
  if (!new RegExp(`\\b${e.constName}\\b`).test(index.match(/export const CANONICAL_MANUALS: TeamManual\[\] = \[[\s\S]*?\];/)?.[0] ?? "")) {
    index = index.replace(
      /(export const CANONICAL_MANUALS: TeamManual\[\] = \[[\s\S]*?)(\n\];)/,
      `$1\n  ${e.constName},$2`,
    );
  }
}
fs.writeFileSync(MANUALS_INDEX, index, "utf8");
console.log("registered", emitted.map((e) => e.constName).join(", "));
console.log(JSON.stringify(emitted, null, 2));
