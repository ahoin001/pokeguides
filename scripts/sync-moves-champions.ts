/**
 * Build src/data/moves-champions.json for every move name in ranked-singles.json.
 * Fetches PokeAPI move endpoints (cached under .cache/moves/).
 *
 *   npm run sync:moves
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const RANKED = path.join(ROOT, "src", "data", "ranked-singles.json");
const OUT = path.join(ROOT, "src", "data", "moves-champions.json");
const CACHE = path.join(ROOT, ".cache", "moves");

type RankedFile = {
  pokemon: { moves?: { name: string }[] }[];
};

type MoveRow = {
  name: string;
  type: string;
  category: "physical" | "special" | "status";
  basePower: number;
  priority: number;
  /** English short effect from PokeAPI (plain-English what the move does). */
  shortEffect?: string;
};

function pokeSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function cleanEffect(raw: string, chance?: number | null) {
  return raw
    .replace(/\$effect_chance/g, chance != null ? String(chance) : "a")
    .replace(/[\n\f\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchMove(name: string): Promise<MoveRow | null> {
  const slug = pokeSlug(name);
  const cachePath = path.join(CACHE, `${slug}.json`);
  try {
    const cached = JSON.parse(await readFile(cachePath, "utf8")) as MoveRow;
    if (cached.shortEffect) return { ...cached, name };
  } catch {
    /* fetch */
  }

  const res = await fetch(`https://pokeapi.co/api/v2/move/${slug}`);
  if (!res.ok) {
    console.warn(`skip ${name} → ${res.status}`);
    return null;
  }
  const data = (await res.json()) as {
    name: string;
    type: { name: string };
    damage_class: { name: string };
    power: number | null;
    priority: number;
    effect_chance: number | null;
    effect_entries?: { language: { name: string }; short_effect: string; effect: string }[];
    flavor_text_entries?: {
      language: { name: string };
      flavor_text: string;
      version_group: { name: string };
    }[];
  };
  const en =
    data.effect_entries?.find((e) => e.language.name === "en") ??
    data.effect_entries?.[0];
  const chance = data.effect_chance;
  let shortEffect = en?.short_effect ? cleanEffect(en.short_effect, chance) : undefined;
  if (!shortEffect) {
    const flavors = (data.flavor_text_entries ?? []).filter((e) => e.language.name === "en");
    const preferred =
      [...flavors]
        .reverse()
        .find((f) => /scarlet|violet|legends-za|sword|shield/.test(f.version_group.name)) ??
      flavors.at(-1);
    if (preferred?.flavor_text) {
      shortEffect = cleanEffect(preferred.flavor_text);
    }
  }
  const row: MoveRow = {
    name,
    type: data.type.name,
    category: data.damage_class.name as MoveRow["category"],
    basePower: data.power ?? 0,
    priority: data.priority ?? 0,
    shortEffect,
  };
  await writeFile(cachePath, JSON.stringify(row), "utf8");
  return row;
}

async function main() {
  await mkdir(CACHE, { recursive: true });
  const ranked = JSON.parse(await readFile(RANKED, "utf8")) as RankedFile;
  const names = new Set<string>();
  for (const mon of ranked.pokemon) {
    for (const m of mon.moves ?? []) {
      if (m.name) names.add(m.name);
    }
  }

  const byName: Record<string, MoveRow> = {};
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  console.log(`Fetching ${sorted.length} moves…`);
  for (const name of sorted) {
    const row = await fetchMove(name);
    if (row) byName[name] = row;
    await new Promise((r) => setTimeout(r, 40));
  }

  const payload = {
    fetchedAt: new Date().toISOString(),
    count: Object.keys(byName).length,
    moves: byName,
  };
  await writeFile(OUT, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Wrote ${payload.count} moves → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
