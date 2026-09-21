import type { CatalogEntry } from "@/types/pokemon";
import { getRankedBySlug } from "@/lib/ranked/load";

/** BSS Role Compendium families — utility compression, not classroom jobs. */
export const ROLE_FAMILY_IDS = [
  "choice-lock",
  "cleric",
  "disruption",
  "phaze",
  "pivot",
  "priority",
  "scout",
  "speed-self",
  "speed-target",
  "trap",
  "trick-room",
  "ohko",
  "retaliate",
  "stored-power",
  "sleep",
  "paralysis",
  "burn",
  "poison",
  "rocks",
  "spikes",
  "tspikes",
  "webs",
  "screens",
  "rain",
  "sun",
  "sand",
  "snow",
  "notable-ability",
] as const;

export type RoleFamilyId = (typeof ROLE_FAMILY_IDS)[number];

export type RoleToolKind = "move" | "ability" | "item";

export type RoleTool = {
  id: string;
  label: string;
  kind: RoleToolKind;
};

export type RoleFamily = {
  id: RoleFamilyId;
  label: string;
  group: "utility" | "tempo" | "status" | "field" | "offense" | "ability";
  tools: readonly RoleTool[];
};

export const ROLE_FAMILY_GROUPS = [
  { id: "utility", label: "Utility" },
  { id: "tempo", label: "Tempo" },
  { id: "status", label: "Status" },
  { id: "field", label: "Field" },
  { id: "offense", label: "Offense" },
  { id: "ability", label: "Abilities" },
] as const;

const move = (id: string, label: string): RoleTool => ({ id, label, kind: "move" });
const ability = (id: string, label: string): RoleTool => ({ id, label, kind: "ability" });
const item = (id: string, label: string): RoleTool => ({ id, label, kind: "item" });

export const ROLE_FAMILIES: readonly RoleFamily[] = [
  {
    id: "choice-lock",
    label: "Choice locking",
    group: "utility",
    tools: [move("trick", "Trick"), move("switcheroo", "Switcheroo")],
  },
  {
    id: "cleric",
    label: "Cleric",
    group: "utility",
    tools: [move("healing-wish", "Healing Wish"), move("wish", "Wish"), move("lunar-dance", "Lunar Dance")],
  },
  {
    id: "disruption",
    label: "Disruption",
    group: "utility",
    tools: [
      move("curse", "Curse"),
      move("destiny-bond", "Destiny Bond"),
      move("encore", "Encore"),
      move("knock-off", "Knock Off"),
      move("perish-song", "Perish Song"),
      move("salt-cure", "Salt Cure"),
      move("taunt", "Taunt"),
      move("haze", "Haze"),
      move("clear-smog", "Clear Smog"),
      move("coaching", "Coaching"),
    ],
  },
  {
    id: "phaze",
    label: "Phazing",
    group: "utility",
    tools: [
      move("dragon-tail", "Dragon Tail"),
      move("roar", "Roar"),
      move("whirlwind", "Whirlwind"),
      move("circle-throw", "Circle Throw"),
    ],
  },
  {
    id: "pivot",
    label: "Pivoting",
    group: "utility",
    tools: [
      move("u-turn", "U-turn"),
      move("volt-switch", "Volt Switch"),
      move("flip-turn", "Flip Turn"),
      move("splash-turn", "Splash Turn"),
      move("parting-shot", "Parting Shot"),
      move("chilly-reception", "Chilly Reception"),
      move("baton-pass", "Baton Pass"),
      move("teleport", "Teleport"),
      move("shed-tail", "Shed Tail"),
    ],
  },
  {
    id: "priority",
    label: "Priority",
    group: "tempo",
    tools: [
      move("aqua-jet", "Aqua Jet"),
      move("bullet-punch", "Bullet Punch"),
      move("extreme-speed", "Extreme Speed"),
      move("fake-out", "Fake Out"),
      move("ice-shard", "Ice Shard"),
      move("jet-punch", "Jet Punch"),
      move("mach-punch", "Mach Punch"),
      move("quick-attack", "Quick Attack"),
      move("shadow-sneak", "Shadow Sneak"),
      move("sucker-punch", "Sucker Punch"),
      move("upper-hand", "Upper Hand"),
      move("water-shuriken", "Water Shuriken"),
      move("accelerock", "Accelerock"),
      move("first-impression", "First Impression"),
      move("grassy-glide", "Grassy Glide"),
      move("vacuum-wave", "Vacuum Wave"),
      ability("gale-wings", "Gale Wings"),
    ],
  },
  {
    id: "scout",
    label: "Scouting",
    group: "utility",
    tools: [
      move("poltergeist", "Poltergeist"),
      ability("frisk", "Frisk"),
      move("transform", "Transform"),
      ability("imposter", "Imposter"),
    ],
  },
  {
    id: "speed-self",
    label: "Speed control (self)",
    group: "tempo",
    tools: [
      move("agility", "Agility"),
      move("flame-charge", "Flame Charge"),
      move("scale-shot", "Scale Shot"),
      move("tailwind", "Tailwind"),
      move("aqua-step", "Aqua Step"),
      ability("unburden", "Unburden"),
      ability("weak-armor", "Weak Armor"),
      item("choice-scarf", "Choice Scarf"),
    ],
  },
  {
    id: "speed-target",
    label: "Speed control (target)",
    group: "tempo",
    tools: [
      move("bulldoze", "Bulldoze"),
      move("icy-wind", "Icy Wind"),
      move("low-sweep", "Low Sweep"),
      move("rock-tomb", "Rock Tomb"),
      move("electroweb", "Electroweb"),
      move("scary-face", "Scary Face"),
    ],
  },
  {
    id: "trap",
    label: "Trapping",
    group: "utility",
    tools: [
      move("infestation", "Infestation"),
      move("whirlpool", "Whirlpool"),
      move("fire-spin", "Fire Spin"),
      move("snap-trap", "Snap Trap"),
      move("spirit-shackle", "Spirit Shackle"),
      move("jaw-lock", "Jaw Lock"),
      ability("shadow-tag", "Shadow Tag"),
    ],
  },
  {
    id: "trick-room",
    label: "Trick Room",
    group: "tempo",
    tools: [move("trick-room", "Trick Room")],
  },
  {
    id: "ohko",
    label: "One-hit knockout",
    group: "offense",
    tools: [
      move("fissure", "Fissure"),
      move("guillotine", "Guillotine"),
      move("horn-drill", "Horn Drill"),
      move("sheer-cold", "Sheer Cold"),
    ],
  },
  {
    id: "retaliate",
    label: "Retaliation",
    group: "offense",
    tools: [
      move("metal-burst", "Metal Burst"),
      move("mirror-coat", "Mirror Coat"),
      move("counter", "Counter"),
      move("comeuppance", "Comeuppance"),
    ],
  },
  {
    id: "stored-power",
    label: "Stat-boost abuse",
    group: "offense",
    tools: [move("stored-power", "Stored Power"), move("power-trip", "Power Trip")],
  },
  {
    id: "sleep",
    label: "Sleep",
    group: "status",
    tools: [
      move("hypnosis", "Hypnosis"),
      move("sleep-powder", "Sleep Powder"),
      move("yawn", "Yawn"),
      move("spore", "Spore"),
      move("dark-void", "Dark Void"),
    ],
  },
  {
    id: "paralysis",
    label: "Paralysis",
    group: "status",
    tools: [
      move("thunder-wave", "Thunder Wave"),
      move("glare", "Glare"),
      move("nuzzle", "Nuzzle"),
      move("stun-spore", "Stun Spore"),
    ],
  },
  {
    id: "burn",
    label: "Burn",
    group: "status",
    tools: [
      move("will-o-wisp", "Will-O-Wisp"),
      ability("flame-body", "Flame Body"),
      ability("spicy-spray", "Spicy Spray"),
    ],
  },
  {
    id: "poison",
    label: "Poison",
    group: "status",
    tools: [
      move("toxic", "Toxic"),
      move("mortal-spin", "Mortal Spin"),
      move("poison-gas", "Poison Gas"),
      move("poison-powder", "Poison Powder"),
      ability("toxic-debris", "Toxic Debris"),
    ],
  },
  {
    id: "rocks",
    label: "Stealth Rock",
    group: "field",
    tools: [move("stealth-rock", "Stealth Rock"), move("stone-axe", "Stone Axe")],
  },
  {
    id: "spikes",
    label: "Spikes",
    group: "field",
    tools: [move("spikes", "Spikes"), move("ceaseless-edge", "Ceaseless Edge")],
  },
  {
    id: "tspikes",
    label: "Toxic Spikes",
    group: "field",
    tools: [move("toxic-spikes", "Toxic Spikes"), ability("toxic-debris", "Toxic Debris")],
  },
  {
    id: "webs",
    label: "Sticky Web",
    group: "field",
    tools: [move("sticky-web", "Sticky Web")],
  },
  {
    id: "screens",
    label: "Screens",
    group: "field",
    tools: [
      move("aurora-veil", "Aurora Veil"),
      move("light-screen", "Light Screen"),
      move("reflect", "Reflect"),
      move("defog", "Defog"),
      move("brick-break", "Brick Break"),
      move("psychic-fangs", "Psychic Fangs"),
      move("raging-bull", "Raging Bull"),
    ],
  },
  {
    id: "rain",
    label: "Rain",
    group: "field",
    tools: [
      ability("drizzle", "Drizzle"),
      move("rain-dance", "Rain Dance"),
      ability("rain-dish", "Rain Dish"),
      ability("swift-swim", "Swift Swim"),
      ability("hydration", "Hydration"),
    ],
  },
  {
    id: "sun",
    label: "Sun",
    group: "field",
    tools: [
      ability("drought", "Drought"),
      move("sunny-day", "Sunny Day"),
      ability("chlorophyll", "Chlorophyll"),
      ability("solar-power", "Solar Power"),
      ability("mega-sol", "Mega Sol"),
      ability("leaf-guard", "Leaf Guard"),
    ],
  },
  {
    id: "sand",
    label: "Sand",
    group: "field",
    tools: [
      ability("sand-stream", "Sand Stream"),
      move("sandstorm", "Sandstorm"),
      ability("sand-spit", "Sand Spit"),
      ability("sand-force", "Sand Force"),
      ability("sand-rush", "Sand Rush"),
      ability("sand-veil", "Sand Veil"),
    ],
  },
  {
    id: "snow",
    label: "Snow",
    group: "field",
    tools: [
      ability("snow-warning", "Snow Warning"),
      move("chilly-reception", "Chilly Reception"),
      move("snowscape", "Snowscape"),
      ability("slush-rush", "Slush Rush"),
    ],
  },
  {
    id: "notable-ability",
    label: "Notable abilities",
    group: "ability",
    tools: [
      ability("disguise", "Disguise"),
      ability("innards-out", "Innards Out"),
      ability("levitate", "Levitate"),
      ability("magic-bounce", "Magic Bounce"),
      ability("mega-sol", "Mega Sol"),
      ability("mold-breaker", "Mold Breaker"),
      ability("bulletproof", "Bulletproof"),
      ability("soundproof", "Soundproof"),
      ability("prankster", "Prankster"),
      ability("protean", "Protean"),
      ability("spicy-spray", "Spicy Spray"),
      ability("stamina", "Stamina"),
      ability("sturdy", "Sturdy"),
    ],
  },
] as const;

export const ROLE_FAMILY_LABEL: Record<RoleFamilyId, string> = Object.fromEntries(
  ROLE_FAMILIES.map((f) => [f.id, f.label]),
) as Record<RoleFamilyId, string>;

const FAMILY_BY_ID = new Map(ROLE_FAMILIES.map((f) => [f.id, f]));
const TOOL_BY_ID = new Map<string, RoleTool>();
for (const family of ROLE_FAMILIES) {
  for (const tool of family.tools) {
    if (!TOOL_BY_ID.has(tool.id)) TOOL_BY_ID.set(tool.id, tool);
  }
}

export function getRoleFamily(id: string | undefined): RoleFamily | undefined {
  if (!id) return undefined;
  return FAMILY_BY_ID.get(id as RoleFamilyId);
}

export function getRoleTool(id: string | undefined): RoleTool | undefined {
  if (!id) return undefined;
  return TOOL_BY_ID.get(id);
}

export function isRoleFamilyId(id: string): id is RoleFamilyId {
  return FAMILY_BY_ID.has(id as RoleFamilyId);
}

/** PokeAPI / ranked display names → kebab tool ids. */
export function kebabToolId(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const MOVE_TOOL_IDS = new Set(
  ROLE_FAMILIES.flatMap((f) => f.tools.filter((t) => t.kind === "move").map((t) => t.id)),
);
const ABILITY_TOOL_IDS = new Set(
  ROLE_FAMILIES.flatMap((f) => f.tools.filter((t) => t.kind === "ability").map((t) => t.id)),
);

/** Stamp onto catalog from a PokeAPI learnset + ability list. */
export function roleToolsFromLearnset(
  moveNames: readonly string[],
  abilityNames: readonly string[] = [],
): string[] {
  const found = new Set<string>();
  for (const name of moveNames) {
    const id = kebabToolId(name);
    if (MOVE_TOOL_IDS.has(id)) found.add(id);
  }
  for (const name of abilityNames) {
    const id = kebabToolId(name);
    if (ABILITY_TOOL_IDS.has(id)) found.add(id);
  }
  return [...found].sort();
}

function abilityIds(mon: CatalogEntry): string[] {
  return mon.abilities.map(kebabToolId);
}

function rankedToolIds(slug: string): { moves: Set<string>; abilities: Set<string>; items: Set<string> } {
  const row = getRankedBySlug(slug);
  const moves = new Set<string>();
  const abilities = new Set<string>();
  const items = new Set<string>();
  if (!row) return { moves, abilities, items };
  for (const m of row.moves) moves.add(kebabToolId(m.name));
  if (row.ability?.name) abilities.add(kebabToolId(row.ability.name));
  if (row.item?.name) items.add(kebabToolId(row.item.name));
  for (const it of row.items ?? []) items.add(kebabToolId(it.name));
  return { moves, abilities, items };
}

export type RoleMatchHow = "learns" | "runs";

function hasTool(mon: CatalogEntry, tool: RoleTool, ranked: ReturnType<typeof rankedToolIds>): boolean {
  if (tool.kind === "move") {
    const ids =
      tool.id === "flip-turn" || tool.id === "splash-turn"
        ? ["flip-turn", "splash-turn"]
        : [tool.id];
    return ids.some((id) => mon.roleTools?.includes(id) || ranked.moves.has(id));
  }
  if (tool.kind === "ability") {
    if (mon.roleTools?.includes(tool.id)) return true;
    if (abilityIds(mon).includes(tool.id)) return true;
    if (ranked.abilities.has(tool.id)) return true;
    return false;
  }
  return ranked.items.has(tool.id);
}

export function pokemonHasRole(
  mon: CatalogEntry,
  familyId: RoleFamilyId | "",
  toolId?: string,
): boolean {
  if (!familyId) return true;
  const family = FAMILY_BY_ID.get(familyId);
  if (!family) return true;
  const ranked = rankedToolIds(mon.slug);
  if (toolId) {
    const tool = family.tools.find((t) => t.id === toolId);
    if (!tool) return false;
    return hasTool(mon, tool, ranked);
  }
  return family.tools.some((tool) => hasTool(mon, tool, ranked));
}

export function pokemonRunsTool(mon: CatalogEntry, tool: RoleTool): boolean {
  const ranked = rankedToolIds(mon.slug);
  if (tool.kind === "move") return ranked.moves.has(tool.id);
  if (tool.kind === "ability") return ranked.abilities.has(tool.id);
  return ranked.items.has(tool.id);
}

export function moveMatchesFamily(moveName: string, familyId: RoleFamilyId | ""): boolean {
  if (!familyId) return true;
  const family = FAMILY_BY_ID.get(familyId);
  if (!family) return true;
  const id = kebabToolId(moveName);
  return family.tools.some((t) => t.kind === "move" && t.id === id);
}

export function abilityMatchesFamily(abilitySlug: string, familyId: RoleFamilyId | ""): boolean {
  if (!familyId) return true;
  const family = FAMILY_BY_ID.get(familyId);
  if (!family) return true;
  const id = kebabToolId(abilitySlug);
  return family.tools.some((t) => t.kind === "ability" && t.id === id);
}
