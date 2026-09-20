import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ChampionsIndex } from "../src/lib/champions-battle/types";

const ROOT = path.resolve(process.cwd());
const INDEX_URL = "https://championsbattledata.com/api";
export const CBD_INDEX_CACHE = path.join(ROOT, ".cache", "champions-api-index.json");

export async function loadCbdIndex(fromCache = false): Promise<ChampionsIndex> {
  if (fromCache) {
    return JSON.parse(await readFile(CBD_INDEX_CACHE, "utf8")) as ChampionsIndex;
  }
  const res = await fetch(INDEX_URL);
  if (!res.ok) throw new Error(`Champions Battle Data index ${res.status}`);
  const json = (await res.json()) as ChampionsIndex;
  await mkdir(path.dirname(CBD_INDEX_CACHE), { recursive: true });
  await writeFile(CBD_INDEX_CACHE, JSON.stringify(json));
  return json;
}
