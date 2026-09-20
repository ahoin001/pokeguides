import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CatalogEntry } from "../src/types/pokemon";
import { applyCbdSpeed } from "../src/lib/champions-battle/showdown";
import { loadCbdSpeedBySlug } from "./cbd-speed-map";

const ROOT = path.resolve(process.cwd());
const CATALOG = path.join(ROOT, "src", "data", "catalog.json");

async function main() {
  const fromCache = process.argv.includes("--from-cache");
  const catalog = JSON.parse(await readFile(CATALOG, "utf8")) as CatalogEntry[];
  const speBySlug = await loadCbdSpeedBySlug(catalog, fromCache);

  const diffs: string[] = [];
  let patched = 0;
  let unchanged = 0;

  for (let i = 0; i < catalog.length; i++) {
    const mon = catalog[i];
    const spe = speBySlug.get(mon.slug);
    if (spe == null) continue;
    const old = mon.stats.spe;
    catalog[i] = applyCbdSpeed(mon, spe);
    if (old === spe) {
      unchanged += 1;
    } else {
      diffs.push(`${mon.slug}: ${old} → ${spe}`);
      patched += 1;
    }
  }

  const unmatched = catalog.filter((mon) => !speBySlug.has(mon.slug)).map((mon) => mon.slug);

  await writeFile(CATALOG, `${JSON.stringify(catalog, null, 2)}\n`);

  if (diffs.length) console.log(diffs.join("\n"));
  console.log(
    `CBD Speed: ${patched} changed, ${unchanged} already matched, ${unmatched.length} unmatched (PokeAPI Spe kept).`,
  );
  if (unmatched.length) console.log(`Unmatched: ${unmatched.join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
