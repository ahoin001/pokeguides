/**
 * Overwrite ability shortEffect from Serebii AbilityDex Game Text.
 *
 *   npm run sync:ability-effects
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const OUT = path.join(ROOT, "src", "data", "abilities-champions.json");
const CACHE = path.join(ROOT, ".cache", "champions-ability-effects");
const INDEX_CACHE = path.join(CACHE, "_index.json");

type AbilityRow = {
  name: string;
  slug: string;
  shortEffect?: string;
  carriers: string[];
  source?: string;
};

type AbilitiesFile = {
  fetchedAt: string;
  count: number;
  abilities: Record<string, AbilityRow>;
  effectsSource?: string;
};

function cleanText(raw: string) {
  return raw
    .replace(/&eacute;/gi, "é")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(name: string) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

async function buildIndex(): Promise<Record<string, string>> {
  try {
    const cached = JSON.parse(await readFile(INDEX_CACHE, "utf8")) as Record<string, string>;
    if (Object.keys(cached).length > 200) return cached;
  } catch {
    /* rebuild */
  }
  const html = await (
    await fetch("https://www.serebii.net/abilitydex/flashfire.shtml", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RingsideSync/1.0)" },
    })
  ).text();
  const byKey: Record<string, string> = {};
  for (const m of html.matchAll(
    /<option value="\/abilitydex\/([^"]+)\.shtml">([^<]+)<\/option>/gi,
  )) {
    const pageSlug = m[1];
    const label = cleanText(m[2]);
    byKey[normalizeKey(label)] = pageSlug;
    byKey[normalizeKey(pageSlug)] ??= pageSlug;
  }
  await mkdir(CACHE, { recursive: true });
  await writeFile(INDEX_CACHE, JSON.stringify(byKey, null, 2), "utf8");
  console.log(`Indexed ${Object.keys(byKey).length} AbilityDex entries`);
  return byKey;
}

async function fetchEffect(pageSlug: string): Promise<string | undefined> {
  const cachePath = path.join(CACHE, `${pageSlug.replace(/[\\/]/g, "_")}.json`);
  try {
    const cached = JSON.parse(await readFile(cachePath, "utf8")) as { effect?: string };
    if (cached.effect) return cached.effect;
  } catch {
    /* fetch */
  }

  const res = await fetch(`https://www.serebii.net/abilitydex/${pageSlug}.shtml`, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; RingsideSync/1.0)" },
  });
  if (!res.ok) {
    console.warn(`skip ${pageSlug} → ${res.status}`);
    return undefined;
  }
  const html = await res.text();
  const m =
    html.match(/<td class="fooinfo" colspan="4">([\s\S]*?)<\/td>/i) ??
    html.match(/Game Text[\s\S]{0,80}?fooinfo[^>]*>([\s\S]*?)<\/td>/i);
  const effect = m ? cleanText(m[1]) : undefined;
  if (effect) {
    await mkdir(CACHE, { recursive: true });
    await writeFile(cachePath, JSON.stringify({ slug: pageSlug, effect }, null, 2), "utf8");
  }
  return effect;
}

async function main() {
  await mkdir(CACHE, { recursive: true });
  const index = await buildIndex();
  const file = JSON.parse(await readFile(OUT, "utf8")) as AbilitiesFile;
  const slugs = Object.keys(file.abilities).sort();
  let updated = 0;
  const missing: string[] = [];
  console.log(`Syncing AbilityDex text for ${slugs.length} abilities…`);

  for (const slug of slugs) {
    const row = file.abilities[slug];
    const pageSlug =
      index[normalizeKey(row.name)] ??
      index[normalizeKey(slug)] ??
      slug.replace(/-/g, "");
    try {
      const effect = await fetchEffect(pageSlug);
      if (!effect) {
        missing.push(`${slug} (${pageSlug})`);
        continue;
      }
      file.abilities[slug] = {
        ...row,
        shortEffect: effect,
        source: "serebii-abilitydex",
      };
      updated += 1;
      if (updated % 25 === 0) console.log(`… ${updated}`);
    } catch (err) {
      missing.push(`${slug} (${String(err)})`);
    }
    await new Promise((r) => setTimeout(r, 40));
  }

  file.fetchedAt = new Date().toISOString();
  file.effectsSource = "serebii.net/abilitydex";
  file.count = Object.keys(file.abilities).length;
  await writeFile(OUT, JSON.stringify(file, null, 2) + "\n", "utf8");
  console.log(`Updated ${updated}/${slugs.length}`);
  console.log(`Unresolved ${missing.length}`);
  if (missing.length) console.log(missing.join("\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
