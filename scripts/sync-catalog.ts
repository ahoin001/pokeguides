import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { TYPE_IDS, type CatalogEntry, type PokemonForm, type SpeciesColor, type TypeId } from "../src/types/pokemon";
import { speedAt } from "../src/lib/champions/stats";
import { kitTagsFromMoves } from "../src/lib/champions/kit-tags";
import { roleToolsFromLearnset } from "../src/lib/champions/role-index";
import { fallbackPalette, paletteFromHex } from "../src/lib/champions/palette";
import { displayName, pokeGet, type PokePokemon, type PokeSpecies } from "../src/lib/pokeapi/client";

const ROOT = path.resolve(process.cwd());
const CACHE = path.join(ROOT, ".cache", "pokeapi");
const CONCURRENCY = 6;

type RegulationFile = {
  id: string;
  name: string;
  starts: string;
  ends: string;
  notes: string;
  featured: string[];
  slugs: string[];
};

type Editorial = { slug: string; role: CatalogEntry["role"] };

function isType(v: string): v is TypeId {
  return (TYPE_IDS as readonly string[]).includes(v);
}

function isColor(v: string): v is SpeciesColor {
  return ["black", "blue", "brown", "gray", "green", "pink", "purple", "red", "white", "yellow"].includes(v);
}

function formOf(slug: string): PokemonForm {
  if (slug.includes("mega-z")) return "mega-z";
  if (slug.includes("-mega")) return "mega";
  if (slug.endsWith("-alola")) return "alolan";
  if (slug.endsWith("-galar") || slug.endsWith("-galarian")) return "galarian";
  if (slug.includes("hisui")) return "hisuian";
  if (slug.includes("-mega") || slug.endsWith("-eternal")) return "other";
  return "base";
}

async function cachedJson<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const file = path.join(CACHE, `${key}.json`);
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch {
    const data = await loader();
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(data));
    return data;
  }
}

async function cachedBuffer(key: string, url: string) {
  const file = path.join(CACHE, "art", key);
  try {
    return await readFile(file);
  } catch {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`art ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, buf);
    return buf;
  }
}

function saturation(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

async function extractHex(buf: Buffer) {
  const { data, info } = await sharp(buf)
    .resize(48, 48, { fit: "cover" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buckets = new Map<string, { n: number; sat: number }>();
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = info.channels === 4 ? data[i + 3] : 255;
    if (a < 140) continue;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max > 245 && min > 230) continue;
    if (max < 18) continue;
    const qr = Math.min(240, Math.round(r / 16) * 16);
    const qg = Math.min(240, Math.round(g / 16) * 16);
    const qb = Math.min(240, Math.round(b / 16) * 16);
    const key = `${qr},${qg},${qb}`;
    const sat = saturation(r, g, b);
    const prev = buckets.get(key);
    if (prev) {
      prev.n += 1;
      prev.sat += sat;
    } else buckets.set(key, { n: 1, sat });
  }

  let best = { key: "80,80,90", score: -1 };
  for (const [key, val] of buckets) {
    const avgSat = val.sat / val.n;
    const score = val.n * (0.45 + avgSat);
    if (score > best.score) best = { key, score };
  }
  const [r, g, b] = best.key.split(",").map(Number);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

async function pool<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>) {
  const out: R[] = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: size }, () => worker()));
  return out;
}

async function cachedPokemon(slug: string): Promise<PokePokemon> {
  const file = path.join(CACHE, `pokemon-${slug}.json`);
  try {
    const data = JSON.parse(await readFile(file, "utf8")) as PokePokemon;
    if (data.moves?.length) return data;
  } catch {
    /* refetch */
  }
  const data = await pokeGet<PokePokemon>(`/pokemon/${slug}`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(data));
  return data;
}

async function buildEntry(
  slug: string,
  featured: Set<string>,
  roles: Map<string, CatalogEntry["role"]>,
): Promise<CatalogEntry | null> {
  try {
    const pokemon = await cachedPokemon(slug);
    const species = await cachedJson<PokeSpecies>(`species-${pokemon.species.name}`, () =>
      pokeGet<PokeSpecies>(`/pokemon-species/${pokemon.species.name}`),
    );

    const types = pokemon.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name)
      .filter(isType) as TypeId[];
    if (!types.length) return null;

    const stat = (name: string) =>
      pokemon.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;
    const hp = stat("hp");
    const atk = stat("attack");
    const def = stat("defense");
    const spa = stat("special-attack");
    const spd = stat("special-defense");
    const spe = stat("speed");
    const bst = hp + atk + def + spa + spd + spe;

    const artwork =
      pokemon.sprites.other?.["official-artwork"]?.front_default ??
      pokemon.sprites.front_default ??
      "";
    const sprite = pokemon.sprites.front_default ?? artwork;
    const speciesColor = isColor(species.color.name) ? species.color.name : "gray";

    let palette = fallbackPalette(speciesColor);
    if (artwork) {
      try {
        const buf = await cachedBuffer(`${slug}.png`, artwork);
        const hex = await extractHex(buf);
        palette = paletteFromHex(hex, "artwork");
      } catch {
        palette = fallbackPalette(speciesColor);
      }
    }

    const name = displayName(species, slug);
    const moveNames = pokemon.moves.map((m) => m.move.name);
    const abilitySlugs = pokemon.abilities.map((a) => a.ability.name);
    const abilities = abilitySlugs.map((a) => a.replace(/-/g, " "));
    const kitTags = kitTagsFromMoves(moveNames);
    const roleTools = roleToolsFromLearnset(moveNames, abilitySlugs);
    const tokens = [name, slug, ...types, ...abilities, speciesColor, ...kitTags, ...roleTools]
      .join(" ")
      .toLowerCase();

    return {
      id: pokemon.id,
      slug,
      name,
      dexNo: species.id,
      types: types.length === 1 ? [types[0]] : [types[0], types[1]],
      form: formOf(slug),
      isLegal: true,
      featured: featured.has(slug),
      role: roles.get(slug),
      stats: { hp, atk, def, spa, spd, spe, bst },
      speedAt0: speedAt(spe, 0),
      speedAt32: speedAt(spe, 32),
      abilities,
      kitTags,
      roleTools,
      artwork,
      sprite,
      tokens,
      speciesColor,
      palette,
      source: "pokeapi",
    };
  } catch (err) {
    console.warn(`skip ${slug}:`, err instanceof Error ? err.message : err);
    return null;
  }
}

async function main() {
  const raw = JSON.parse(
    await readFile(path.join(ROOT, "content/regulations/m-c.json"), "utf8"),
  ) as RegulationFile;
  const editorial = JSON.parse(
    await readFile(path.join(ROOT, "src/data/editorial.json"), "utf8"),
  ) as Editorial[];

  const slugs = [...new Set(raw.slugs)];
  const featured = new Set(raw.featured);
  const roles = new Map(editorial.map((e) => [e.slug, e.role]));

  console.log(`Syncing ${slugs.length} slugs (concurrency ${CONCURRENCY})`);
  const entries = (await pool(slugs, CONCURRENCY, (slug) => buildEntry(slug, featured, roles))).filter(
    (e): e is CatalogEntry => Boolean(e),
  );
  entries.sort((a, b) => a.dexNo - b.dexNo || a.id - b.id);

  const dataDir = path.join(ROOT, "src/data");
  await mkdir(dataDir, { recursive: true });
  await writeFile(path.join(dataDir, "catalog.json"), JSON.stringify(entries, null, 2));
  await writeFile(
    path.join(dataDir, "regulation.json"),
    JSON.stringify(
      {
        id: raw.id,
        name: raw.name,
        starts: raw.starts,
        ends: raw.ends,
        notes: raw.notes,
        slugs: entries.map((e) => e.slug),
      },
      null,
      2,
    ),
  );

  const missing = slugs.filter((s) => !entries.some((e) => e.slug === s));
  console.log(`Wrote ${entries.length} Pokémon. Missing ${missing.length}.`);
  if (missing.length) console.log("Missing:", missing.join(", "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
