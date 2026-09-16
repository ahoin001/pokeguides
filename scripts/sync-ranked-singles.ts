import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CatalogEntry } from "../src/types/pokemon";
import type { RankedShare, RankedSinglesEntry, RankedSinglesSnapshot } from "../src/lib/ranked/types";

const ROOT = path.resolve(process.cwd());
const INDEX_URL = "https://championsbattledata.com/api";
const CACHE = path.join(ROOT, ".cache", "champions-api-index.json");
const OUT = path.join(ROOT, "src", "data", "ranked-singles.json");

const ALIAS: Record<string, string> = {
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
};

type BattleTop = {
  name?: string;
  percentage_value?: number | null;
  column_position?: number;
  hp_points?: number | string;
  attack_points?: number | string;
  defense_points?: number | string;
  sp_atk_points?: number | string;
  sp_def_points?: number | string;
  speed_points?: number | string;
};

type IndexPokemon = {
  name: string;
  showdownId: string;
  slug?: string;
  summary?: {
    types?: string[];
    battleSummary?: {
      Current?: {
        Singles?: {
          top?: {
            move?: BattleTop;
            held_item?: BattleTop;
            teammate?: BattleTop;
            stat_alignment?: BattleTop;
            stat_points?: BattleTop;
            ability?: BattleTop;
          };
          values?: {
            move?: string[];
            held_item?: string[];
            teammate?: string[];
          };
        };
      };
    };
  };
};

type IndexFile = {
  generatedAt?: string;
  defaultSeason?: string;
  dailyDataFolders?: string[];
  pokemon?: IndexPokemon[];
};

function compact(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function share(name?: string, pct?: number | null): RankedShare | undefined {
  if (!name) return undefined;
  return pct == null || Number.isNaN(Number(pct)) ? { name } : { name, pct: Number(pct) };
}

function num(v: number | string | undefined) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function mapSlug(showdownId: string, catalog: CatalogEntry[]) {
  const alias = ALIAS[compact(showdownId)];
  if (alias && catalog.some((p) => p.slug === alias)) return alias;
  const hit = catalog.find((p) => compact(p.slug) === compact(showdownId));
  return hit?.slug;
}

async function loadIndex(fromCache: boolean): Promise<IndexFile> {
  if (fromCache) {
    return JSON.parse(await readFile(CACHE, "utf8")) as IndexFile;
  }
  const res = await fetch(INDEX_URL);
  if (!res.ok) throw new Error(`index ${res.status}`);
  const json = (await res.json()) as IndexFile;
  await mkdir(path.dirname(CACHE), { recursive: true });
  await writeFile(CACHE, JSON.stringify(json));
  return json;
}

async function main() {
  const fromCache = process.argv.includes("--from-cache");
  const catalog = JSON.parse(
    await readFile(path.join(ROOT, "src", "data", "catalog.json"), "utf8"),
  ) as CatalogEntry[];

  const index = await loadIndex(fromCache);
  const latestDaily = (index.dailyDataFolders ?? []).find((f) => f.startsWith("M6/")) ?? "";
  const [seasonFolder, dayFolder] = latestDaily.split("/");
  const season = seasonFolder || index.defaultSeason || "Current";
  const asOf = dayFolder
    ? (() => {
        const [dd, mm, yyyy] = dayFolder.split("_");
        return `${yyyy}-${mm}-${dd}`;
      })()
    : (index.generatedAt ?? new Date().toISOString()).slice(0, 10);

  const rows: RankedSinglesEntry[] = [];
  for (const mon of index.pokemon ?? []) {
    const singles = mon.summary?.battleSummary?.Current?.Singles;
    const rank = singles?.top?.move?.column_position;
    if (!singles || !rank) continue;
    const top = singles.top ?? {};
    const values = singles.values ?? {};
    const itemNames = (values.held_item ?? []).filter(Boolean).slice(0, 6);
    const moveNames = (values.move ?? []).filter(Boolean).slice(0, 8);
    const items = itemNames.map((name, i) => (i === 0 ? share(name, top.held_item?.percentage_value) : { name })).filter(Boolean) as RankedShare[];
    const moves = moveNames.map((name, i) => (i === 0 ? share(name, top.move?.percentage_value) : { name })).filter(Boolean) as RankedShare[];
    const spreadTop = top.stat_points;
    rows.push({
      rank,
      showdownId: mon.showdownId,
      name: mon.name,
      slug: mapSlug(mon.showdownId, catalog),
      types: (mon.summary?.types ?? []).map((t) => t.toLowerCase()),
      ability: share(top.ability?.name, top.ability?.percentage_value),
      nature: share(top.stat_alignment?.name, top.stat_alignment?.percentage_value),
      spread: spreadTop
        ? {
            hp: num(spreadTop.hp_points),
            atk: num(spreadTop.attack_points),
            def: num(spreadTop.defense_points),
            spa: num(spreadTop.sp_atk_points),
            spd: num(spreadTop.sp_def_points),
            spe: num(spreadTop.speed_points),
            pct: spreadTop.percentage_value == null ? undefined : Number(spreadTop.percentage_value),
          }
        : undefined,
      item: share(top.held_item?.name, top.held_item?.percentage_value),
      items,
      moves,
      teammates: (values.teammate ?? []).filter(Boolean).slice(0, 6),
    });
  }

  rows.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));

  const snapshot: RankedSinglesSnapshot = {
    fetchedAt: new Date().toISOString(),
    generatedAt: index.generatedAt ?? new Date().toISOString(),
    asOf,
    season,
    regulation: "m-c",
    format: "singles",
    source: "In-game Ranked Battle Data",
    sourceUrl: "https://championsbattledata.com/",
    note: "Position is the usage order in Champions Ranked Singles Battle Data. Not tournament doubles. Not a win rate.",
    count: rows.length,
    pokemon: rows,
  };

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);

  const usageBySlug: Record<
    string,
    {
      rank: number;
      showdownId: string;
      name: string;
      move?: string;
      movePct?: number;
      item?: string;
      itemPct?: number;
    }
  > = {};
  for (const row of rows) {
    if (!row.slug) continue;
    usageBySlug[row.slug] = {
      rank: row.rank,
      showdownId: row.showdownId,
      name: row.name,
      move: row.moves[0]?.name,
      movePct: row.moves[0]?.pct,
      item: row.item?.name,
      itemPct: row.item?.pct,
    };
  }
  const usageOut = path.join(ROOT, "src", "data", "usage-index.json");
  await writeFile(
    usageOut,
    `${JSON.stringify({ asOf, season, count: Object.keys(usageBySlug).length, bySlug: usageBySlug })}\n`,
  );

  let patched = 0;
  for (const mon of catalog) {
    const hit = usageBySlug[mon.slug];
    const next = hit?.rank;
    if (mon.usageRank !== next) {
      mon.usageRank = next;
      patched += 1;
    }
  }
  if (patched) {
    await writeFile(
      path.join(ROOT, "src", "data", "catalog.json"),
      `${JSON.stringify(catalog, null, 2)}\n`,
    );
  }

  console.log(
    `Wrote ${rows.length} singles ranks (${season}); usage-index ${Object.keys(usageBySlug).length}; catalog usageRank patches ${patched}. Top 8: ${rows
      .slice(0, 8)
      .map((r) => `${r.rank} ${r.name}`)
      .join(", ")}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
