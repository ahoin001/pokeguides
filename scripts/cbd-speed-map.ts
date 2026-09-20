import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildCbdSpeedBySlug,
  buildStatSlugIndex,
  catalogSlugForCbdStat,
  compactShowdownId,
  readMetadataSpe,
} from "../src/lib/champions-battle/showdown";
import { loadCbdIndex } from "./load-cbd-index";

const ROOT = path.resolve(process.cwd());
const META_CACHE = path.join(ROOT, ".cache", "cbd-metadata");
const META_CONCURRENCY = 8;

type MetadataFile = {
  missing?: boolean;
  rows?: { saved_name?: string; form?: string; spe?: number | string }[];
};

function metadataRouteNames(slug: string): string[] {
  const base = slug.replace(/-mega(?:-[xyz])?$/, "");
  const names = new Set<string>([base, base.split("-")[0] ?? base]);
  if (/^(mr|mime|tapu|type|porygon|ho|jangmo|hakamo|kommo)-/.test(base)) {
    names.add(base.split("-").slice(0, 2).join("-"));
  }
  return [...names].filter(Boolean);
}

async function loadMetadata(name: string): Promise<MetadataFile> {
  const file = path.join(META_CACHE, `${compactShowdownId(name) || name}.json`);
  try {
    return JSON.parse(await readFile(file, "utf8")) as MetadataFile;
  } catch {
    const res = await fetch(`https://championsbattledata.com/api/metadata/${encodeURIComponent(name)}`);
    const json: MetadataFile = res.ok ? ((await res.json()) as MetadataFile) : { missing: true };
    if (!res.ok) json.missing = true;
    await mkdir(META_CACHE, { recursive: true });
    await writeFile(file, JSON.stringify(json));
    return json;
  }
}

async function pool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const item = items[i++];
        await fn(item);
      }
    }),
  );
}

/** Index first (exact forme), then metadata rows for leftover catalog slugs. */
export async function loadCbdSpeedBySlug(
  catalog: readonly { slug: string }[],
  fromCache = false,
): Promise<Map<string, number>> {
  const byCompact = buildStatSlugIndex(catalog);
  const index = await loadCbdIndex(fromCache);
  const speBySlug = buildCbdSpeedBySlug(index.pokemon ?? [], catalog, byCompact);

  const unmatched = catalog.map((p) => p.slug).filter((slug) => !speBySlug.has(slug));
  const routes = [...new Set(unmatched.flatMap(metadataRouteNames))];
  await pool(routes, META_CONCURRENCY, async (name) => {
    const meta = await loadMetadata(name);
    for (const row of meta.rows ?? []) {
      const spe = readMetadataSpe(row);
      if (spe == null) continue;
      const saved = row.saved_name ?? "";
      const slug =
        catalogSlugForCbdStat(saved, byCompact) ??
        (row.form ? catalogSlugForCbdStat(`${saved} ${row.form}`, byCompact) : undefined);
      if (!slug || speBySlug.has(slug)) continue;
      speBySlug.set(slug, spe);
    }
  });

  return speBySlug;
}
