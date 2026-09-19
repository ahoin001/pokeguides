/**
 * Fill missing shortEffect on moves in moves-champions.json.
 * Gen 9+ often lack PokeAPI effect_entries — fall back to English flavor text.
 *
 *   npx tsx scripts/fill-move-effects.ts
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const OUT = path.join(ROOT, "src", "data", "moves-champions.json");
const CACHE = path.join(ROOT, ".cache", "moves");

type MoveRow = {
  name: string;
  type: string;
  category: "physical" | "special" | "status";
  basePower: number;
  priority: number;
  shortEffect?: string;
};

type MovesFile = {
  fetchedAt: string;
  count: number;
  moves: Record<string, MoveRow>;
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

async function resolveEffect(name: string): Promise<string | undefined> {
  const slug = pokeSlug(name);
  const res = await fetch(`https://pokeapi.co/api/v2/move/${slug}`);
  if (!res.ok) {
    console.warn(`PokeAPI miss ${name} → ${res.status}`);
    return undefined;
  }
  const data = (await res.json()) as {
    effect_chance: number | null;
    effect_entries?: { language: { name: string }; short_effect: string; effect: string }[];
    flavor_text_entries?: { language: { name: string }; flavor_text: string; version_group: { name: string } }[];
  };
  const enEffect =
    data.effect_entries?.find((e) => e.language.name === "en") ?? data.effect_entries?.[0];
  if (enEffect?.short_effect) {
    return cleanEffect(enEffect.short_effect, data.effect_chance);
  }
  const flavors = (data.flavor_text_entries ?? []).filter((e) => e.language.name === "en");
  // Prefer Scarlet/Violet / newest last entry
  const preferred =
    [...flavors].reverse().find((f) => /scarlet|violet|legends-za|sword|shield/.test(f.version_group.name)) ??
    flavors.at(-1);
  if (preferred?.flavor_text) return cleanEffect(preferred.flavor_text);

  // Manual competitive one-liners for anything still empty (Champions-relevant Gen 9).
  return MANUAL[name];
}

/** Authoritative one-liners when PokeAPI has neither effect nor usable flavor. */
const MANUAL: Record<string, string> = {
  "Alluring Voice":
    "Inflicts damage. Confuses the target if its stats were raised this turn.",
  "Aqua Cutter": "Inflicts damage with a high critical-hit ratio.",
  "Aqua Step": "Inflicts damage and raises the user's Speed by one stage.",
  "Armor Cannon":
    "Inflicts damage, then lowers the user's Defense and Special Defense by one stage each.",
  "Barb Barrage":
    "Inflicts damage with a chance to poison. Power doubles if the target is already poisoned.",
  "Bitter Blade": "Inflicts damage and restores HP by half the damage dealt.",
  "Bitter Malice":
    "Inflicts damage and lowers the target's Attack by one stage. Power doubles if the target is statused.",
  "Ceaseless Edge":
    "Inflicts damage with a high critical-hit ratio and sets a layer of Spikes on the target's side.",
  "Chilling Water": "Inflicts damage and lowers the target's Attack by one stage.",
  "Chilly Reception":
    "The user switches out and summons snow. Fails if there is no ally to switch to.",
  Comeuppance:
    "Deals damage equal to 1.5× the damage the user took from the last hit that turn, to that attacker.",
  "Dire Claw":
    "Inflicts damage with a chance to poison, paralyze, or put the target to sleep.",
  "Double Shock":
    "Inflicts Electric damage, then the user loses its Electric typing until it switches out.",
  "Electro Shot":
    "Charges on turn one (raises Sp. Atk) and attacks on turn two. Skips the charge turn in rain.",
  "Fickle Beam": "Inflicts damage. Has a chance to hit with double power.",
  "Flower Trick": "Always hits and always results in a critical hit.",
  "Gigaton Hammer": "Inflicts damage. Cannot be selected twice in a row.",
  "Glaive Rush":
    "Inflicts damage. Until the end of the next turn, moves targeting the user can't miss and deal double damage.",
  "Headlong Rush":
    "Inflicts damage, then lowers the user's Defense and Special Defense by one stage each.",
  "Ice Spinner": "Inflicts damage and removes any terrain.",
  "Infernal Parade":
    "Inflicts damage with a chance to burn. Power doubles if the target has a status condition.",
  "Jet Punch": "Inflicts damage with increased priority.",
  "Kowtow Cleave": "Inflicts damage and never misses.",
  "Last Respects":
    "Inflicts damage. Power rises by 50 for each ally that has fainted this battle.",
  "Lumina Crash": "Inflicts damage and lowers the target's Special Defense by two stages.",
  "Make It Rain":
    "Inflicts damage to all adjacent foes and lowers the user's Special Attack by one stage. Scatters coins after battle.",
  "Matcha Gotcha":
    "Inflicts damage to all adjacent foes, restores HP by half the damage dealt, and may burn.",
  "Mortal Spin":
    "Inflicts damage, poisons the target, and removes entry hazards and Leech Seed from the user's side.",
  "Mountain Gale": "Inflicts damage with a chance to make the target flinch.",
  "Population Bomb":
    "Hits 1–10 times. Each hit has its own accuracy check; a miss stops further hits.",
  "Psychic Noise":
    "Inflicts damage and prevents the target from healing for two turns.",
  "Psyshield Bash": "Inflicts damage and raises the user's Defense by one stage.",
  "Rage Fist":
    "Inflicts damage. Power rises by 50 for each time the user has been hit this battle.",
  "Raging Bull":
    "Inflicts damage (type depends on the user's breed) and removes screens from the target's side.",
  "Revival Blessing":
    "Revives a fainted party Pokémon and restores half its max HP. The user loses its turn to switch animations.",
  "Salt Cure":
    "Inflicts damage and salts the target, dealing residual damage each turn (more to Steel/Water).",
  "Shed Tail":
    "Creates a Substitute using half the user's HP, then switches out and passes the Substitute to the replacement.",
  Shelter: "Raises the user's Defense by two stages.",
  "Stone Axe":
    "Inflicts damage with a high critical-hit ratio and sets Stealth Rock on the target's side.",
  "Supercell Slam":
    "Inflicts damage. If it misses, the user takes crash damage.",
  "Temper Flare":
    "Inflicts damage. Power doubles if the user's previous move failed.",
  "Tidy Up":
    "Raises the user's Attack and Speed by one stage each and clears substitutes and entry hazards on both sides.",
  "Torch Song": "Inflicts damage and raises the user's Special Attack by one stage.",
  Trailblaze: "Inflicts damage and raises the user's Speed by one stage.",
  "Triple Arrows":
    "Inflicts damage with a raised critical-hit ratio, chance to lower Defense, and chance to flinch.",
  "Twin Beam": "Inflicts damage, hitting twice.",
  "Upper Hand":
    "Priority move that only works if the target is using a priority move; also makes the target flinch.",
  "Wave Crash": "Inflicts damage with heavy recoil to the user.",
};

async function main() {
  await mkdir(CACHE, { recursive: true });
  const file = JSON.parse(await readFile(OUT, "utf8")) as MovesFile;
  const missing = Object.values(file.moves).filter((m) => !m.shortEffect?.trim());
  console.log(`Filling ${missing.length} moves without effect text…`);

  let filled = 0;
  const stillMissing: string[] = [];
  for (const move of missing) {
    const effect = await resolveEffect(move.name);
    if (!effect) {
      stillMissing.push(move.name);
      continue;
    }
    file.moves[move.name] = { ...move, shortEffect: effect };
    const cachePath = path.join(CACHE, `${pokeSlug(move.name)}.json`);
    await writeFile(cachePath, JSON.stringify(file.moves[move.name]), "utf8");
    filled += 1;
    console.log(`✓ ${move.name}`);
    await new Promise((r) => setTimeout(r, 50));
  }

  file.fetchedAt = new Date().toISOString();
  await writeFile(OUT, JSON.stringify(file, null, 2) + "\n", "utf8");
  console.log(`Filled ${filled}. Still missing: ${stillMissing.length}`);
  if (stillMissing.length) console.log(stillMissing.join(", "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
