/**
 * Build slug map from all Champions AttackDex type pages, then sync Battle Effects
 * into moves-champions.json (Champions in-game wording).
 *
 *   npm run sync:move-effects-champions
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const OUT = path.join(ROOT, "src", "data", "moves-champions.json");
const CACHE = path.join(ROOT, ".cache", "champions-move-effects");
const INDEX_CACHE = path.join(CACHE, "_index.json");

const TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

type MoveRow = {
  name: string;
  type: string;
  category: "physical" | "special" | "status";
  basePower: number;
  priority: number;
  shortEffect?: string;
  /** Champions AttackDex battle effect (preferred display text). */
  championsEffect?: string;
  source?: "champions-attackdex" | "pokeapi" | "manual";
};

type MovesFile = {
  fetchedAt: string;
  count: number;
  moves: Record<string, MoveRow>;
  effectsSource?: string;
};

function normalizeKey(name: string) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function cleanText(raw: string) {
  return raw
    .replace(/&eacute;/gi, "é")
    .replace(/&aacute;/gi, "á")
    .replace(/&iacute;/gi, "í")
    .replace(/&oacute;/gi, "ó")
    .replace(/&uacute;/gi, "ú")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; RingsideSync/1.0; +local)" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function buildSlugIndex(): Promise<Record<string, string>> {
  try {
    const cached = JSON.parse(await readFile(INDEX_CACHE, "utf8")) as Record<string, string>;
    if (Object.keys(cached).length > 500) return cached;
  } catch {
    /* rebuild */
  }

  const byKey: Record<string, string> = {};

  // Global move dropdown on any AttackDex page is the complete Champions move list.
  const seedHtml = await fetchHtml("https://www.serebii.net/attackdex-champions/makeitrain.shtml");
  for (const m of seedHtml.matchAll(
    /<option value="\/attackdex-champions\/([a-z0-9-]+)\.shtml">([^<]+)<\/option>/gi,
  )) {
    const slug = m[1].toLowerCase();
    const label = cleanText(m[2]);
    if (!label) continue;
    byKey[normalizeKey(label)] = slug;
    byKey[normalizeKey(slug)] ??= slug;
  }

  // Type pages as a backup for any missed anchors.
  for (const type of TYPES) {
    const html = await fetchHtml(`https://www.serebii.net/attackdex-champions/${type}.shtml`);
    for (const m of html.matchAll(
      /href="\/attackdex-champions\/([a-z0-9-]+)\.shtml"[^>]*>([^<]{2,60})</gi,
    )) {
      const slug = m[1].toLowerCase();
      const label = cleanText(m[2]);
      if (!label || /attackdex|type/i.test(label)) continue;
      byKey[normalizeKey(label)] = slug;
    }
    for (const m of html.matchAll(/href="\/attackdex-champions\/([a-z0-9-]+)\.shtml"/gi)) {
      const slug = m[1].toLowerCase();
      byKey[normalizeKey(slug)] ??= slug;
    }
    await new Promise((r) => setTimeout(r, 60));
  }

  await mkdir(CACHE, { recursive: true });
  await writeFile(INDEX_CACHE, JSON.stringify(byKey, null, 2), "utf8");
  console.log(`Indexed ${Object.keys(byKey).length} Champions AttackDex entries`);
  return byKey;
}

function extractBattleEffect(html: string): string | undefined {
  const m =
    html.match(
      /Battle Effect:<\/td>\s*<\/tr>\s*<tr>\s*<td[^>]*class="fooinfo"[^>]*>([\s\S]*?)<\/td>/i,
    ) ??
    html.match(/Battle Effect:[\s\S]{0,80}?class="fooinfo"[^>]*>([\s\S]*?)<\/td>/i);
  if (!m) return undefined;
  const text = cleanText(m[1]);
  return text || undefined;
}

function extractInDepth(html: string): string | undefined {
  const m = html.match(
    /In-Depth Effect:<\/td>\s*<\/tr>\s*<tr>\s*<td[^>]*class="fooinfo"[^>]*>([\s\S]*?)<\/td>/i,
  );
  if (!m) return undefined;
  const text = cleanText(m[1]);
  return text || undefined;
}

function synthesizePlainDamage(move: MoveRow): string {
  if (move.category === "status") return "No additional effect listed.";
  if (move.priority > 0) {
    return `Inflicts damage with increased priority (+${move.priority}).`;
  }
  if (move.priority < 0) {
    return `Inflicts damage with decreased priority (${move.priority}).`;
  }
  return "Inflicts regular damage.";
}

type EffectHit = { effect: string; emptyBattleEffect?: boolean };

async function fetchChampionsEffect(slug: string, move: MoveRow): Promise<EffectHit | undefined> {
  const cachePath = path.join(CACHE, `${slug}.json`);
  try {
    const cached = JSON.parse(await readFile(cachePath, "utf8")) as {
      effect?: string;
      emptyBattleEffect?: boolean;
    };
    if (cached.effect) return { effect: cached.effect, emptyBattleEffect: cached.emptyBattleEffect };
  } catch {
    /* fetch */
  }
  const html = await fetchHtml(`https://www.serebii.net/attackdex-champions/${slug}.shtml`);
  const battle = extractBattleEffect(html);
  const depth = extractInDepth(html);
  let effect = battle || depth;
  let emptyBattleEffect = false;
  if (!effect) {
    // Many Champions pages leave Battle Effect blank for plain damaging moves.
    effect = synthesizePlainDamage(move);
    emptyBattleEffect = true;
  }
  await mkdir(CACHE, { recursive: true });
  await writeFile(
    cachePath,
    JSON.stringify({ slug, effect, emptyBattleEffect, battle, depth }, null, 2),
    "utf8",
  );
  return { effect, emptyBattleEffect };
}

function resolveSlug(name: string, index: Record<string, string>): string | undefined {
  const key = normalizeKey(name);
  if (index[key]) return index[key];
  // Common alt forms
  const alts = [
    key,
    key.replace(/^u/, "u"), // noop
  ];
  for (const a of alts) {
    if (index[a]) return index[a];
  }
  return undefined;
}

async function main() {
  await mkdir(CACHE, { recursive: true });
  const forceIndex = process.argv.includes("--refresh-index");
  const onlyMissing = process.argv.includes("--missing");
  if (forceIndex) {
    try {
      const { unlink } = await import("node:fs/promises");
      await unlink(INDEX_CACHE);
    } catch {
      /* ignore */
    }
  }

  const index = await buildSlugIndex();
  const file = JSON.parse(await readFile(OUT, "utf8")) as MovesFile;

  let updated = 0;
  let missing: string[] = [];
  const names = Object.keys(file.moves)
    .sort((a, b) => a.localeCompare(b))
    .filter((name) => {
      if (!onlyMissing) return true;
      return file.moves[name].source !== "champions-attackdex";
    });
  console.log(`Syncing Champions battle effects for ${names.length} moves…`);

  for (const name of names) {
    const slug = resolveSlug(name, index);
    if (!slug) {
      missing.push(name);
      continue;
    }
    try {
      const hit = await fetchChampionsEffect(slug, file.moves[name]);
      if (!hit?.effect) {
        missing.push(`${name} (no effect on ${slug})`);
        continue;
      }
      const prev = file.moves[name];
      file.moves[name] = {
        ...prev,
        shortEffect: hit.effect,
        championsEffect: hit.effect,
        source: "champions-attackdex",
      };
      updated += 1;
      if (updated % 25 === 0) console.log(`… ${updated} updated`);
    } catch (err) {
      missing.push(`${name} (${String(err)})`);
    }
    await new Promise((r) => setTimeout(r, 60));
  }

  file.fetchedAt = new Date().toISOString();
  file.effectsSource = "serebii.net/attackdex-champions";
  file.count = Object.keys(file.moves).length;
  await writeFile(OUT, JSON.stringify(file, null, 2) + "\n", "utf8");

  console.log(`Updated ${updated}/${names.length}`);
  console.log(`Unresolved ${missing.length}`);
  if (missing.length) console.log(missing.join("\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
