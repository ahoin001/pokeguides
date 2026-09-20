import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CatalogEntry } from "../src/types/pokemon";
import { kitTagsFromMoves } from "../src/lib/champions/kit-tags";
import { roleToolsFromLearnset } from "../src/lib/champions/role-index";

const ROOT = path.resolve(process.cwd());
const CATALOG = path.join(ROOT, "src/data/catalog.json");
const CACHE = path.join(ROOT, ".cache/pokeapi");

type CachedPokemon = {
  moves?: { move: { name: string } }[];
  abilities?: { ability: { name: string } }[];
};

async function main() {
  const catalog = JSON.parse(await readFile(CATALOG, "utf8")) as CatalogEntry[];
  let stamped = 0;
  let missing = 0;

  for (const mon of catalog) {
    const cacheFile = path.join(CACHE, `pokemon-${mon.slug}.json`);
    try {
      const pokemon = JSON.parse(await readFile(cacheFile, "utf8")) as CachedPokemon;
      const moveNames = (pokemon.moves ?? []).map((m) => m.move.name);
      const abilitySlugs = (pokemon.abilities ?? []).map((a) => a.ability.name);
      mon.kitTags = kitTagsFromMoves(moveNames);
      mon.roleTools = roleToolsFromLearnset(moveNames, abilitySlugs);
      const extra = mon.roleTools.join(" ");
      const base = mon.tokens.replace(/\s+/g, " ").trim();
      if (extra && !mon.roleTools.every((t) => base.includes(t))) {
        mon.tokens = `${base} ${extra}`.toLowerCase();
      }
      stamped += 1;
    } catch {
      mon.roleTools = mon.roleTools ?? [];
      missing += 1;
    }
  }

  await writeFile(CATALOG, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Stamped roleTools on ${stamped} Pokémon (${missing} missing cache).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
