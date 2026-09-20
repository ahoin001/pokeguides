import type { CatalogEntry } from "@/types/pokemon";
import { speedAt } from "@/lib/champions/stats";
import type { IndexPokemon } from "./types";

export function compactShowdownId(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const FORME_JUNK = /(?:form|forme|variety|pattern|breed|plumage)$/;

export function compactLooseId(s: string) {
  let c = compactShowdownId(s);
  while (FORME_JUNK.test(c)) c = c.replace(FORME_JUNK, "");
  return c;
}

/** Mega Lucario → lucariomega. Does not rewrite Meganium. */
export function megaPrefixToSuffix(compactId: string) {
  if (!compactId.startsWith("mega")) return compactId;
  const rest = compactId.slice(4);
  if (!rest) return compactId;
  if (rest.startsWith("z") && rest.length > 1) return `${rest.slice(1)}megaz`;
  if (rest.endsWith("z") && rest.length > 1) return `${rest.slice(0, -1)}megaz`;
  if (rest.endsWith("x") && rest.length > 1) return `${rest.slice(0, -1)}megax`;
  if (rest.endsWith("y") && rest.length > 1) return `${rest.slice(0, -1)}megay`;
  return `${rest}mega`;
}

export type CbdSpeedSource = Pick<IndexPokemon, "showdownId"> & {
  summary?: { baseStats?: Record<string, number> };
};

/** Ranked usage defaults. Speed matching treats these as weakest fallback. */
export const CBD_SLUG_ALIAS: Record<string, string> = {
  mimikyu: "mimikyu-disguised",
  aegislash: "aegislash-shield",
  palafin: "palafin-zero",
  indeedee: "indeedee-female",
  indeedeef: "indeedee-female",
  indeedeefemale: "indeedee-female",
  indeedeem: "indeedee-male",
  indeedeemale: "indeedee-male",
  basculegion: "basculegion-male",
  basculegionf: "basculegion-female",
  toxtricity: "toxtricity-amped",
  dudunsparce: "dudunsparce-two-segment",
  tatsugiri: "tatsugiri-curly",
  lycanroc: "lycanroc-dusk",
  floetteeternal: "floette-eternal",
  floetteeternalflower: "floette-eternal",
  staraptormega: "staraptor-mega",
  raichumegax: "raichu-mega-x",
  raichumegay: "raichu-mega-y",
  eelektrossmega: "eelektross-mega",
  dragonitemega: "dragonite-mega",
  garchompmegaz: "garchomp-mega-z",
  gourgeistjumbo: "gourgeist-super",
};

/** Showdown's default forme — used so bare IDs do not steal a ranked alias. */
const SHOWDOWN_DEFAULT: Record<string, string> = {
  "mimikyu-disguised": "mimikyu",
  "aegislash-shield": "aegislash",
  "palafin-zero": "palafin",
  "indeedee-male": "indeedee",
  "toxtricity-amped": "toxtricity",
  "dudunsparce-two-segment": "dudunsparce",
  "tatsugiri-curly": "tatsugiri",
  "lycanroc-midday": "lycanroc",
  "gourgeist-average": "gourgeist",
  "morpeko-full-belly": "morpeko",
  "maushold-family-of-four": "maushold",
  "squawkabilly-green-plumage": "squawkabilly",
  "meowstic-male": "meowstic",
  "pyroar-male": "pyroar",
  "basculegion-male": "basculegion",
};

function addKey(keys: Set<string>, value: string) {
  if (value) keys.add(value);
}

function megaPrefixKeys(compactSlug: string) {
  const keys: string[] = [];
  const z = compactSlug.match(/^(.+)megaz$/);
  if (z) {
    keys.push(`mega${z[1]}z`, `megaz${z[1]}`);
    return keys;
  }
  const xy = compactSlug.match(/^(.+)mega([xy])$/);
  if (xy) {
    keys.push(`mega${xy[1]}${xy[2]}`);
    return keys;
  }
  const mega = compactSlug.match(/^(.+)mega$/);
  if (mega) {
    keys.push(`mega${mega[1]}`);
    const gendered = mega[1].match(/^(.*)(male|female)$/);
    if (gendered?.[1]) {
      keys.push(`mega${gendered[1]}`, `${gendered[1]}mega`);
    }
  }
  return keys;
}

function regionalPrefixKeys(compactSlug: string) {
  const keys: string[] = [];
  const alola = compactSlug.match(/^(.+)alola$/);
  if (alola) keys.push(`alolan${alola[1]}`);
  const galar = compactSlug.match(/^(.+)galar$/);
  if (galar) keys.push(`galarian${galar[1]}`);
  const hisui = compactSlug.match(/^(.+)hisui$/);
  if (hisui) keys.push(`hisuian${hisui[1]}`);
  const paldea = compactSlug.match(/^(.+)paldea(.*)$/);
  if (paldea) keys.push(`paldean${paldea[1]}${paldea[2]}`);
  return keys;
}

/** Compact keys that identify this catalog slug without collapsing mega → base. */
export function compactKeysForSlug(slug: string): string[] {
  const keys = new Set<string>();
  const canonical = compactShowdownId(slug);
  addKey(keys, canonical);
  addKey(keys, compactLooseId(slug));
  for (const extra of megaPrefixKeys(canonical)) addKey(keys, extra);
  for (const extra of regionalPrefixKeys(canonical)) addKey(keys, extra);
  const def = SHOWDOWN_DEFAULT[slug];
  if (def) addKey(keys, compactShowdownId(def));
  return [...keys];
}

export function buildStatSlugIndex(catalog: readonly { slug: string }[]): Map<string, string> {
  const ranked = new Map<string, { slug: string; weight: number }>();
  const claim = (key: string, slug: string, weight: number) => {
    const prev = ranked.get(key);
    if (!prev || weight > prev.weight) ranked.set(key, { slug, weight });
  };
  for (const mon of catalog) {
    const canonical = compactShowdownId(mon.slug);
    for (const key of compactKeysForSlug(mon.slug)) {
      claim(key, mon.slug, key === canonical ? 3 : 2);
    }
  }
  for (const [from, to] of Object.entries(CBD_SLUG_ALIAS)) {
    if (catalog.some((p) => p.slug === to)) claim(from, to, 1);
  }
  return new Map([...ranked].map(([key, hit]) => [key, hit.slug]));
}

export function catalogSlugForCbdStat(
  id: string,
  byCompact: Map<string, string>,
): string | undefined {
  const key = compactShowdownId(id);
  const loose = compactLooseId(id);
  const shifted = megaPrefixToSuffix(key);
  return byCompact.get(key) ?? byCompact.get(loose) ?? byCompact.get(shifted) ?? byCompact.get(megaPrefixToSuffix(loose));
}

export function catalogSlugForShowdownId(
  showdownId: string,
  catalog: readonly { slug: string }[],
): string | undefined {
  const key = compactShowdownId(showdownId);
  const alias = CBD_SLUG_ALIAS[key];
  if (alias && catalog.some((p) => p.slug === alias)) return alias;
  const direct = catalog.find((p) => compactShowdownId(p.slug) === key)?.slug;
  if (direct) return direct;
  const shifted = megaPrefixToSuffix(key);
  if (shifted !== key) return catalog.find((p) => compactShowdownId(p.slug) === shifted)?.slug;
}

/** Exact-forme only. Never strips -mega onto the base species. */
export function buildCbdSpeedBySlug(
  pokemon: readonly CbdSpeedSource[],
  catalog: readonly { slug: string }[],
  byCompact = buildStatSlugIndex(catalog),
): Map<string, number> {
  const hits = new Map<string, { spe: number; weight: number }>();
  for (const mon of pokemon) {
    const spe = readCbdSpeed(mon.summary?.baseStats);
    if (spe == null) continue;
    const slug = catalogSlugForCbdStat(mon.showdownId, byCompact);
    if (!slug) continue;
    const weight = compactShowdownId(slug) === compactShowdownId(mon.showdownId) ? 3 : 2;
    const prev = hits.get(slug);
    if (!prev || weight > prev.weight) hits.set(slug, { spe, weight });
  }
  return new Map([...hits].map(([slug, hit]) => [slug, hit.spe]));
}

export function readCbdSpeed(baseStats: Record<string, number> | undefined): number | undefined {
  if (!baseStats) return undefined;
  const raw = baseStats.speed ?? baseStats.spe ?? baseStats.Speed ?? baseStats.Spe;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.round(n);
}

export function readMetadataSpe(row: { spe?: number | string }): number | undefined {
  const n = Number(row.spe);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.round(n);
}

/** Overlay Champions base Spe; leave other bases; recompute BST and L50 bands. */
export function applyCbdSpeed<T extends Pick<CatalogEntry, "stats" | "speedAt0" | "speedAt32">>(
  entry: T,
  spe: number,
): T {
  const { hp, atk, def, spa, spd } = entry.stats;
  return {
    ...entry,
    stats: { ...entry.stats, spe, bst: hp + atk + def + spa + spd + spe },
    speedAt0: speedAt(spe, 0),
    speedAt32: speedAt(spe, 32),
  };
}
