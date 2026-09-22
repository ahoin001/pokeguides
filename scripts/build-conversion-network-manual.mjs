import fs from "node:fs";
import path from "node:path";

const parsedPath =
  "C:/Users/ahoin/AppData/Local/Cursor/AgentStores/cursor_agent_stores/3887a8b6-a45c-4aa8-be76-8f9c074c3b76/files/garchomp-conversion-parsed.json";
const outPath = "C:/Users/ahoin/Desktop/Pokemon/src/content/manuals/conversion-network-modular-mc.ts";

const raw = JSON.parse(fs.readFileSync(parsedPath, "utf8"));

const SP_NOTE =
  "Starting architecture spend (66 SP, max 32). Recommended configuration — not claimed as mathematically optimal vs every M-C threshold.";

const STAT_ORDER = ["hp", "atk", "def", "spa", "spd", "spe"];
const SPEND_LABEL = { hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe" };

function spendObjectToTrain(spendObj) {
  const map = {
    hp: spendObj.HP ?? spendObj.hp ?? 0,
    atk: spendObj.Atk ?? spendObj.atk ?? 0,
    def: spendObj.Def ?? spendObj.def ?? 0,
    spa: spendObj.SpA ?? spendObj.spa ?? 0,
    spd: spendObj.SpD ?? spendObj.spd ?? 0,
    spe: spendObj.Spe ?? spendObj.spe ?? 0,
  };
  return map;
}

function spendStrings(sp) {
  return STAT_ORDER.filter((k) => sp[k] > 0).map((k) => `${sp[k]} ${SPEND_LABEL[k]}`);
}

function emitTrain(training, indent) {
  const sp = spendObjectToTrain(training.spend ?? {});
  const spend = training.spendList ?? spendStrings(sp);
  const copy = {
    label: training.label ?? "Spread",
    why: training.why ?? "",
    spend,
    ...(training.rule ? { rule: training.rule } : {}),
  };
  const pad = " ".repeat(indent + 2);
  const copyJson = JSON.stringify(copy, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : pad + line))
    .join("\n");
  return `train(${sp.hp}, ${sp.atk}, ${sp.def}, ${sp.spa}, ${sp.spd}, ${sp.spe}, ${copyJson})`;
}

function emitValue(v, indent = 2) {
  if (v && v.__train) {
    return emitTrain(v, indent + 2);
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
  return String(v);
}

function noteList(strings) {
  return (strings ?? []).map((s) => ({
    title: s,
    body: s,
  }));
}

function matchupList(strings) {
  return (strings ?? []).map((s) => ({
    name: s,
    why: s,
  }));
}

function normalizeSlot(slot) {
  const { species, training, ...rest } = slot;
  const out = {
    slug: rest.slug,
    title: species ?? rest.slug,
    job: rest.job,
    ...(rest.literacy ? { literacy: rest.literacy } : {}),
    ...(rest.primaryJob ? { primaryJob: rest.primaryJob } : {}),
    role: rest.role,
    objective: rest.objective,
    howToPlay: rest.howToPlay,
    ...(rest.item ? { item: rest.item } : {}),
    ...(rest.ability ? { ability: rest.ability } : {}),
    ...(rest.nature ? { nature: rest.nature } : {}),
    moves: rest.moves ?? [],
    ...(rest.networkJobs ? { networkJobs: rest.networkJobs } : {}),
  };
  if (training) {
    out.training = {
      __train: true,
      ...training,
      spend: training.spend ?? {},
    };
  }
  return out;
}

function normalizeAlt(alt) {
  const answers = Array.isArray(alt.answers) ? alt.answers.join("; ") : alt.answers;
  const costs = Array.isArray(alt.costs) ? alt.costs.join("; ") : alt.costs;
  const module =
    typeof alt.module === "string" ? { identity: alt.module } : alt.module;
  const slot = alt.slot
    ? (() => {
        const base = normalizeSlot({
          slug: alt.slug,
          job: alt.slot.job ?? "breaker",
          role: alt.slot.role ?? alt.why,
          objective: alt.slot.objective ?? alt.why,
          howToPlay: alt.slot.howToPlay ?? alt.useWhen?.[0] ?? alt.why,
          ...alt.slot,
          species: alt.species ?? alt.slug,
        });
        const { slug: _slug, ...slotBody } = base;
        return slotBody;
      })()
    : undefined;
  const { species, slot: _s, ...rest } = alt;
  return {
    slug: rest.slug,
    insteadOf: rest.insteadOf,
    why: rest.why,
    ...(answers ? { answers } : {}),
    ...(costs ? { costs } : {}),
    ...(rest.unlocks ? { unlocks: rest.unlocks } : {}),
    ...(module ? { module } : {}),
    ...(rest.architectureChange ? { architectureChange: rest.architectureChange } : {}),
    ...(rest.useWhen ? { useWhen: rest.useWhen } : {}),
    ...(rest.avoidWhen ? { avoidWhen: rest.avoidWhen } : {}),
    ...(slot ? { slot } : {}),
  };
}

function normalizePack(pkg) {
  const endgameIds = (pkg.endgameIds ?? []).map((id) =>
    id === "endgame_priority" ? "endgame_conversion" : id,
  );
  let identityCard = pkg.identityCard;
  if (typeof identityCard === "string") {
    identityCard = { winCondition: identityCard };
  }
  const strategy = pkg.strategy
    ? {
        ...pkg.strategy,
        bring: pkg.slugs,
        ...(pkg.contrast && !pkg.strategy.contrast ? { contrast: pkg.contrast } : {}),
      }
    : { bring: pkg.slugs, opponentPattern: "", purpose: "", targets: [], refuses: [], winCondition: "" };

  return {
    id: pkg.id,
    label: pkg.label,
    when: pkg.when,
    identity: pkg.identity,
    slugs: pkg.slugs,
    strategy,
    ...(pkg.roles ? { roles: pkg.roles } : {}),
    ...(pkg.fieldPlan ? { fieldPlan: pkg.fieldPlan } : {}),
    ...(pkg.defaultLeadPair ? { defaultLeadPair: pkg.defaultLeadPair } : {}),
    ...(pkg.backPair ? { backPair: pkg.backPair } : {}),
    ...(identityCard ? { identityCard } : {}),
    ...(pkg.pilotDecision ? { pilotDecision: pkg.pilotDecision } : {}),
    ...(pkg.engineIds ? { engineIds: pkg.engineIds } : {}),
    ...(endgameIds.length ? { endgameIds } : {}),
    loops: pkg.loops ?? [],
    victims: matchupList(pkg.victims),
    counters: matchupList(pkg.counters),
    advantages: noteList(pkg.advantages),
    hazards: noteList(pkg.hazards),
    ...(pkg.requiresSwap ? { requiresSwap: pkg.requiresSwap } : {}),
  };
}

function normalizeWinRoutes(routes) {
  return (routes ?? []).map((r) => {
    const parts = (r.path ?? "").split(" → ").filter(Boolean);
    return {
      id: r.id,
      name: r.label ?? r.name ?? r.id,
      requires: r.requires ?? [],
      sequence: r.sequence ?? parts.slice(0, -1).length ? parts.slice(0, -1) : parts,
      finish: r.finish ?? parts[parts.length - 1] ?? r.path ?? "",
    };
  });
}

function normalizeFailureRoutes(routes) {
  return (routes ?? []).map((r, i) => ({
    failedRoute: r.failedRoute,
    why: r.why ?? "The planned route no longer has a safe conversion window.",
    fallback: r.fallback,
    nextRoute:
      r.nextRoute ??
      (r.fallback?.includes("Gholdengo")
        ? "Special conversion through Gholdengo and Sylveon."
        : r.fallback?.includes("Garchomp")
          ? "Immediate physical conversion through Garchomp and Rillaboom."
          : "Alternate package or bench module from preview."),
  }));
}

const CONTROL_MAP = {
  tempo: { label: "Tempo", setterSlug: "rillaboom", whoBenefits: "Garchomp, Gholdengo, Sylveon" },
  speed: { label: "Speed", setterSlug: "staraptor", whoBenefits: "Garchomp, Gholdengo" },
  targeting: { label: "Targeting", setterSlug: "raichu", whoBenefits: "Gholdengo, Sylveon, partners" },
  resource: { label: "Resources", setterSlug: "rillaboom", whoBenefits: "Endgame priority and Protect lines" },
};

function normalizeControlPlanes(planes) {
  return (planes ?? []).map((p) => {
    const hint = CONTROL_MAP[p.id] ?? {};
    return {
      id: p.id,
      label: p.label ?? hint.label ?? p.id,
      setterSlug: p.setterSlug ?? hint.setterSlug ?? "rillaboom",
      effect: p.effect ?? p.purpose ?? "",
      whoBenefits: p.whoBenefits ?? hint.whoBenefits ?? "The active converters",
    };
  });
}

function normalizeMegaPool(pool, megaRule) {
  const candidates = (pool ?? []).map((c) => ({
    slug: c.slug,
    stone: c.item ?? c.stone,
    when: c.when ?? c.role ?? "When this Mega matches the selected package.",
  }));
  return {
    rule: megaRule ?? "One Mega Evolution per battle; never bring both Mega candidates in the same four.",
    previewPressure:
      "Opponent must respect Raichu Y special pressure or Staraptor Tailwind — pick the Mega with the package, not habit.",
    candidates,
  };
}

function normalizeMatchupScripts(scripts) {
  return (scripts ?? []).map((s) => {
    const text = s.script ?? s.why ?? "";
    const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    const beats = sentences.length
      ? sentences.map((sentence) => ({ click: sentence }))
      : [{ click: text || "Execute the selected package." }];
    return {
      id: s.id,
      foe: s.foe ?? s.pattern ?? s.id,
      why: s.why ?? sentences[0] ?? text.slice(0, 120),
      packId: s.packId,
      sequence: { beats },
    };
  });
}

function normalizeEndgames(endgames) {
  return (endgames ?? []).map((e) => ({
    id: e.id,
    label: e.label,
    path: Array.isArray(e.path) ? e.path.join(" → ") : e.path,
    how: e.how,
  }));
}

const coreArch = raw.construction?.coreArchitecture ?? {};
const megaRule = raw.construction?.megaRule;
const packs = (raw.packages ?? []).map(normalizePack);
const defaultPack = packs.find((p) => p.id === "pack_garchomp_fairy") ?? packs[0];
const coreSlugs = defaultPack?.slugs ?? raw.box.slice(0, 4);

const manual = {
  id: "conversion-network-modular-mc-manual",
  title: raw.title,
  lede: raw.lede,
  format: raw.format ?? "doubles",
  philosophy: raw.construction?.thesis ?? raw.lede,
  archetype: raw.archetype ?? "balance",
  family: raw.family ?? "clock",
  meta:
    raw.meta ??
    "Pokémon Champions Doubles, Regulation M-C. Modular conversion network with swappable bench modules and competing Mega packages.",
  setsNote: "__SP_NOTE__",
  press: ["Fake Out", "Tailwind", "Garchomp", "Modular bench"],
  pilot: raw.pilot ?? {
    thesis: raw.construction?.winCondition ?? raw.lede,
    rule: raw.construction?.method ?? "Pick one four-Pokémon package and one Mega before turn one.",
    fail: "Forcing Mega, Tailwind, or setup when immediate conversion is already favored.",
  },
  box: raw.box,
  core: coreSlugs,
  slugs: coreSlugs,
  slots: [],
  coreArchitecture: coreArch,
  clocks: raw.clocks ?? [
    {
      id: "tempo-clock",
      owner: ["raichu", "rillaboom"],
      speed: "immediate",
      goal: "Fake Out and terrain create the first conversion window.",
    },
    {
      id: "speed-clock",
      owner: ["staraptor"],
      speed: "fast",
      goal: "Tailwind compresses the board before the opponent stabilizes.",
    },
    {
      id: "conversion-clock",
      owner: ["garchomp", "sylveon", "gholdengo"],
      speed: "fast",
      goal: "Turn positional advantage into immediate or scaling damage.",
    },
  ],
  winRoutes: normalizeWinRoutes(raw.winRoutes),
  failureRoutes: normalizeFailureRoutes(raw.failureRoutes),
  bench: raw.bench ?? {
    purpose: "Swap one module to change the conversion clock without rebuilding tempo infrastructure.",
    slots: (raw.altSlots ?? []).map((a) => ({
      slug: a.slug,
      insteadOf: a.insteadOf,
      category: typeof a.module === "string" ? a.module.toLowerCase().replace(/\s+/g, "-") : a.slug,
      useWhen: a.useWhen,
      avoidWhen: a.avoidWhen,
      changesArchitecture: true,
    })),
  },
  modules: raw.modules,
  benchDiagnostics: raw.benchDiagnostics,
  replacementRelationships:
    raw.replacementRelationships ??
    (raw.altSlots ?? []).map((a) => ({
      out: a.insteadOf,
      in: a.slug,
      adds: Array.isArray(a.answers) ? a.answers : a.answers ? [a.answers] : [],
      loses: Array.isArray(a.costs) ? a.costs : a.costs ? [a.costs] : [],
      changes: a.architectureChange ? [`${a.architectureChange.from} → ${a.architectureChange.to}`] : [],
    })),
  roster: raw.roster.map(normalizeSlot),
  packs,
  construction: {
    thesis: raw.construction.thesis,
    method: raw.construction.method,
    winCondition: raw.construction.winCondition,
    endgames: normalizeEndgames(raw.construction.endgames),
    altSlots: (raw.altSlots ?? []).map(normalizeAlt),
  },
  megaPool: normalizeMegaPool(raw.megaPool, megaRule),
  controlPlanes: normalizeControlPlanes(raw.controlPlanes),
  network: raw.network,
  engines: raw.engines,
  commandments: raw.commandments,
  phases: raw.phases ?? [
    {
      id: "preview",
      title: "Preview — Pick the package",
      lede: "Select four Pokémon and a Mega mode.",
      branches: [
        {
          when: "Need Fake Out plus special fork?",
          then: "Raichu Conversion or Garchomp + Sylveon when Megas are preserved.",
        },
        {
          when: "Need Tailwind compression?",
          then: "Staraptor Tailwind with Garchomp forward.",
        },
        {
          when: "Structural problem visible?",
          then: "Consider Milotic, Ceruledge, or Annihilape swap packages.",
        },
      ],
    },
    {
      id: "opening",
      title: "Opening — Spend tempo",
      branches: [
        {
          when: "Fake Out or Tailwind is live",
          then: "Convert the window — do not autopilot damage without a converter ready.",
        },
      ],
    },
    {
      id: "finish",
      title: "Finish — Second clock",
      branches: [
        {
          when: "First converter is answered",
          then: "Activate Gholdengo, Sylveon, or priority before complexity returns.",
        },
      ],
    },
  ],
  loops: raw.loops ?? [
    {
      title: "Tempo → convert",
      body: "Fake Out or Tailwind creates a window; Garchomp, Sylveon, or Gholdengo spends it.",
    },
    {
      title: "Fork → finish",
      body: "Physical-special fork forces target selection; the uncovered axis closes.",
    },
  ],
  hazards: noteList(
    raw.hazards ?? [
      "Bringing Raichu and Staraptor together",
      "Fake Out without conversion",
      "Forcing Garchomp setup",
    ],
  ),
  victims: matchupList(raw.victims),
  counters: matchupList(raw.counters),
  advantages: noteList(raw.advantages),
  matchupScripts: normalizeMatchupScripts(raw.matchupScripts),
  architecture: raw.architecture,
  ledger: raw.ledger,
  previewTrees: raw.previewTrees,
};

const header = `import { train, type TeamManual } from "@/content/manuals";

const BOX = [
  "raichu",
  "rillaboom",
  "staraptor",
  "gholdengo",
  "sylveon",
  "garchomp",
] as const;

const SP_NOTE =
  "Starting architecture spend (66 SP, max 32). Recommended configuration — not claimed as mathematically optimal vs every M-C threshold.";

export const CONVERSION_NETWORK_MODULAR_MC_MANUAL = `;

const footer = " satisfies TeamManual;\n";

// Emit with custom manual walker (train() for SP spreads)
function emitManual(obj, indent = 0) {
  const pad = " ".repeat(indent);
  if (obj && obj.__train) {
    return emitTrain(obj, indent);
  }
  if (Array.isArray(obj)) {
    if (!obj.length) return "[]";
    return `[\n${obj.map((x) => `${pad}  ${emitManual(x, indent + 2)},`).join("\n")}\n${pad}]`;
  }
  if (obj && typeof obj === "object") {
    const entries = Object.entries(obj).filter(
      ([k, v]) => k !== "__train" && v !== undefined,
    );
    return `{\n${entries
      .map(([k, v]) => {
        if (k === "training" && v && v.__train) {
          return `${pad}  training: ${emitTrain(v, indent + 2)},`;
        }
        return `${pad}  ${k}: ${emitManual(v, indent + 2)},`;
      })
      .join("\n")}\n${pad}}`;
  }
  return JSON.stringify(obj);
}

const manualForEmit = {
  ...manual,
  box: "__BOX__",
};

let tsBody = emitManual(manualForEmit, 2);
tsBody = tsBody.replace('"__BOX__"', "[...BOX]");
tsBody = tsBody.replace('"__SP_NOTE__"', "SP_NOTE");

const file = `${header}${tsBody}${footer}`;
fs.writeFileSync(outPath, file);
console.log("Wrote", outPath, "bytes", file.length);
console.log("Packs", packs.length, "AltSlots", manual.construction.altSlots.length);
