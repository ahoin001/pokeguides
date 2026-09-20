import abilitiesJson from "@/data/abilities-champions.json";
import { getPokemon } from "@/lib/catalog/lookup";
import { abilityMatchesFamily, isRoleFamilyId, type RoleFamilyId } from "@/lib/champions/role-index";

type AbilitiesFile = {
  abilities: Record<
    string,
    {
      name: string;
      slug: string;
      shortEffect?: string;
      carriers: string[];
    }
  >;
};

const file = abilitiesJson as AbilitiesFile;

export const ABILITY_TAG_IDS = [
  "weather",
  "terrain",
  "speed",
  "immunity",
  "intimidate",
  "priority",
  "recovery",
  "contact",
  "mold-break",
  "setup",
  "form",
  "magic-bounce",
  "disguise",
  "unburden",
  "sturdy",
  "stamina",
  "shadow-tag",
  "protean",
  "flame-body",
  "prankster",
] as const;

export type AbilityTagId = (typeof ABILITY_TAG_IDS)[number];

export const ABILITY_TAG_LABEL: Record<AbilityTagId, string> = {
  weather: "Weather",
  terrain: "Terrain",
  speed: "Speed boost",
  immunity: "Immunity / absorb",
  intimidate: "Intimidate-like",
  priority: "Priority",
  recovery: "Recovery",
  contact: "Contact punish",
  "mold-break": "Mold Breaker",
  setup: "Stat boost",
  form: "Form / once",
  "magic-bounce": "Magic Bounce",
  disguise: "Disguise",
  unburden: "Unburden",
  sturdy: "Sturdy",
  stamina: "Stamina",
  "shadow-tag": "Shadow Tag",
  protean: "Protean",
  "flame-body": "Flame Body",
  prankster: "Prankster",
};

const WEATHER = new Set([
  "drizzle",
  "drought",
  "sand-stream",
  "snow-warning",
  "orichalcum-pulse",
  "hadron-engine",
  "cloud-nine",
  "air-lock",
]);
const TERRAIN = new Set([
  "grassy-surge",
  "electric-surge",
  "psychic-surge",
  "misty-surge",
  "seed-sower",
]);
const SPEED = new Set([
  "swift-swim",
  "chlorophyll",
  "sand-rush",
  "slush-rush",
  "unburden",
  "surge-surfer",
  "quark-drive",
  "protosynthesis",
  "speed-boost",
  "motor-drive",
  "steadfast",
  "quick-feet",
]);
const IMMUNITY = new Set([
  "flash-fire",
  "water-absorb",
  "volt-absorb",
  "lightning-rod",
  "storm-drain",
  "levitate",
  "dry-skin",
  "earth-eater",
  "well-baked-body",
  "sap-sipper",
  "motor-drive",
  "lightning-rod",
  "bulletproof",
  "soundproof",
  "wonder-guard",
  "good-as-gold",
  "purifying-salt",
  "thick-fat",
  "heatproof",
  "water-bubble",
  "fluffy",
]);
const INTIMIDATE = new Set(["intimidate", "sword-of-ruin", "beads-of-ruin", "tablets-of-ruin", "vessel-of-ruin"]);
const PRIORITY = new Set(["prankster", "gale-wings", "triage", "quick-draw"]);
const RECOVERY = new Set([
  "regenerator",
  "poison-heal",
  "ice-body",
  "rain-dish",
  "dry-skin",
  "hydration",
  "shed-skin",
  "natural-cure",
  "healer",
]);
const CONTACT = new Set([
  "flame-body",
  "static",
  "effect-spore",
  "poison-point",
  "cute-charm",
  "rough-skin",
  "iron-barbs",
  "gooey",
  "tangling-hair",
  "perish-body",
  "cursed-body",
  "aftermath",
]);
const MOLD = new Set(["mold-breaker", "teravolt", "turboblaze", "mycelium-might"]);
const SETUP = new Set([
  "moxie",
  "beast-boost",
  "soul-heart",
  "defiant",
  "competitive",
  "justified",
  "download",
  "weak-armor",
  "anger-point",
  "berserk",
  "steam-engine",
  "electromorphosis",
  "wind-power",
]);
const FORM = new Set([
  "disguise",
  "stance-change",
  "battle-bond",
  "schooling",
  "shields-down",
  "zen-mode",
  "power-construct",
  "hunger-switch",
  "ice-face",
  "zero-to-hero",
  "commander",
  "protosynthesis",
  "quark-drive",
]);

function tagsFor(slug: string, effect: string): AbilityTagId[] {
  const tags = new Set<AbilityTagId>();
  const e = effect.toLowerCase();
  if (
    WEATHER.has(slug) ||
    (/\b(rain|sunlight|sandstorm|snow|hail)\b/.test(e) && /\b(summon|weather|negate)\b/.test(e))
  ) {
    tags.add("weather");
  }
  if (TERRAIN.has(slug) || /\bterrain\b/.test(e)) tags.add("terrain");
  if (SPEED.has(slug) || /\b(speed|doubled)\b/.test(e) && /\b(rain|sun|sand|snow|electric)\b/.test(e)) {
    tags.add("speed");
  }
  if (IMMUNITY.has(slug) || /\b(immune|immunity|absorb|no effect)\b/.test(e)) tags.add("immunity");
  if (INTIMIDATE.has(slug) || /\bintimidate\b/.test(e) || /\blower.*(attack|defense|special)\b/.test(e) && /\benter\b/.test(e)) {
    tags.add("intimidate");
  }
  if (PRIORITY.has(slug) || /\bpriority\b/.test(e)) tags.add("priority");
  if (RECOVERY.has(slug) || /\b(restore|heal|regenerat)\b/.test(e)) tags.add("recovery");
  if (CONTACT.has(slug) || /\bcontact\b/.test(e)) tags.add("contact");
  if (MOLD.has(slug) || /\bignores?.*(abilit|opposing)\b/.test(e)) tags.add("mold-break");
  if (SETUP.has(slug) || /\braises?.*(attack|defense|speed|special)\b/.test(e)) tags.add("setup");
  if (FORM.has(slug) || /\b(transform|form|disguise|once per)\b/.test(e)) tags.add("form");
  if (slug === "magic-bounce" || /\bbounce.*status|reflects? status\b/.test(e)) tags.add("magic-bounce");
  if (slug === "disguise") tags.add("disguise");
  if (slug === "unburden") tags.add("unburden");
  if (slug === "sturdy") tags.add("sturdy");
  if (slug === "stamina") tags.add("stamina");
  if (slug === "shadow-tag") tags.add("shadow-tag");
  if (slug === "protean" || slug === "libero") tags.add("protean");
  if (slug === "flame-body" || slug === "spicy-spray") tags.add("flame-body");
  if (slug === "prankster") tags.add("prankster");
  return [...tags];
}

export type AbilityCarrier = {
  slug: string;
  name: string;
  artwork: string;
  sprite: string;
};

export type IndexedAbility = {
  name: string;
  slug: string;
  shortEffect: string;
  tags: AbilityTagId[];
  carriers: AbilityCarrier[];
  tokens: string;
};

let cache: IndexedAbility[] | null = null;

export function listChampionsAbilities(): IndexedAbility[] {
  if (cache) return cache;
  cache = Object.values(file.abilities)
    .map((row) => {
      const shortEffect = row.shortEffect ?? "";
      const tags = tagsFor(row.slug, shortEffect);
      const carriers: AbilityCarrier[] = row.carriers
        .map((slug) => getPokemon(slug))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .map((p) => ({
          slug: p.slug,
          name: p.name,
          artwork: p.artwork,
          sprite: p.sprite || p.artwork,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      const tokens = [
        row.name,
        row.slug,
        shortEffect,
        ...tags.map((t) => ABILITY_TAG_LABEL[t]),
        ...carriers.map((c) => c.name),
      ]
        .join(" ")
        .toLowerCase();
      return {
        name: row.name,
        slug: row.slug,
        shortEffect,
        tags,
        carriers,
        tokens,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return cache;
}

export type AbilitySortKey = "name" | "carriers";

export function filterChampionsAbilities(
  abilities: readonly IndexedAbility[],
  opts: {
    q?: string;
    tag?: AbilityTagId | "";
    family?: RoleFamilyId | "";
  },
): IndexedAbility[] {
  const needle = opts.q?.trim().toLowerCase() ?? "";
  return abilities.filter((a) => {
    if (opts.tag && !a.tags.includes(opts.tag)) return false;
    if (opts.family && isRoleFamilyId(opts.family) && !abilityMatchesFamily(a.slug, opts.family)) {
      return false;
    }
    if (needle && !a.tokens.includes(needle)) return false;
    return true;
  });
}

export function sortChampionsAbilities(
  abilities: IndexedAbility[],
  sort: AbilitySortKey,
): IndexedAbility[] {
  const next = [...abilities];
  if (sort === "carriers") {
    next.sort((a, b) => b.carriers.length - a.carriers.length || a.name.localeCompare(b.name));
  } else {
    next.sort((a, b) => a.name.localeCompare(b.name));
  }
  return next;
}
