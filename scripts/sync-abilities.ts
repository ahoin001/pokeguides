/**
 * Build src/data/abilities-champions.json for every ability on the legal catalog.
 * Fetches PokeAPI ability endpoints (cached under .cache/abilities/).
 *
 *   npm run sync:abilities
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const CATALOG = path.join(ROOT, "src", "data", "catalog.json");
const OUT = path.join(ROOT, "src", "data", "abilities-champions.json");
const CACHE = path.join(ROOT, ".cache", "abilities");

type CatalogMon = {
  slug: string;
  name: string;
  abilities?: string[];
};

type AbilityRow = {
  name: string;
  slug: string;
  shortEffect?: string;
  carriers: string[];
};

function pokeSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(slug: string) {
  return slug
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function cleanEffect(raw: string) {
  return raw.replace(/\s+/g, " ").trim();
}

async function fetchAbility(name: string): Promise<Omit<AbilityRow, "carriers"> | null> {
  const slug = pokeSlug(name);
  const cachePath = path.join(CACHE, `${slug}.json`);
  try {
    const cached = JSON.parse(await readFile(cachePath, "utf8")) as Omit<AbilityRow, "carriers">;
    if (cached.shortEffect) return { ...cached, name: cached.name || titleCase(name) };
  } catch {
    /* fetch */
  }

  const res = await fetch(`https://pokeapi.co/api/v2/ability/${slug}`);
  if (!res.ok) {
    console.warn(`skip ${name} → ${res.status}`);
    return null;
  }
  const data = (await res.json()) as {
    name: string;
    names?: { name: string; language: { name: string } }[];
    effect_entries?: { language: { name: string }; short_effect: string; effect: string }[];
  };
  const enName = data.names?.find((n) => n.language.name === "en")?.name;
  const en =
    data.effect_entries?.find((e) => e.language.name === "en") ??
    data.effect_entries?.[0];
  const row: Omit<AbilityRow, "carriers"> = {
    name: enName || titleCase(name),
    slug,
    shortEffect: en?.short_effect ? cleanEffect(en.short_effect) : undefined,
  };
  await mkdir(CACHE, { recursive: true });
  await writeFile(cachePath, JSON.stringify(row), "utf8");
  return row;
}

async function main() {
  await mkdir(CACHE, { recursive: true });
  const catalog = JSON.parse(await readFile(CATALOG, "utf8")) as CatalogMon[];
  const carriers = new Map<string, Set<string>>();
  for (const mon of catalog) {
    for (const raw of mon.abilities ?? []) {
      const key = raw.toLowerCase().trim();
      if (!key) continue;
      const set = carriers.get(key) ?? new Set();
      set.add(mon.slug);
      carriers.set(key, set);
    }
  }

  const sorted = [...carriers.keys()].sort((a, b) => a.localeCompare(b));
  console.log(`Fetching ${sorted.length} abilities…`);
  const bySlug: Record<string, AbilityRow> = {};
  for (const key of sorted) {
    const fetched = await fetchAbility(key);
    if (!fetched) continue;
    bySlug[fetched.slug] = {
      ...fetched,
      carriers: [...(carriers.get(key) ?? [])].sort(),
    };
  }

  const payload = {
    fetchedAt: new Date().toISOString(),
    count: Object.keys(bySlug).length,
    abilities: bySlug,
  };
  await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`Wrote ${payload.count} abilities → ${path.relative(ROOT, OUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
