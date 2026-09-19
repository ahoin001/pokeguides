import movesJson from "@/data/moves-champions.json";
import type { TypeId } from "@/types/pokemon";
import type { MoveCategory } from "@/lib/champions/damage";
import { TYPE_LABEL } from "@/lib/champions/types";

type MovesFile = {
  moves: Record<
    string,
    {
      name: string;
      type: string;
      category: MoveCategory;
      basePower: number;
      priority?: number;
      shortEffect?: string;
    }
  >;
};

const file = movesJson as MovesFile;

export const MOVE_TAG_IDS = [
  "priority",
  "buff",
  "debuff",
  "weather",
  "terrain",
  "heal",
  "drain",
  "recoil",
  "pivot",
  "flinch",
  "ailment",
  "protect",
  "hazard",
  "screen",
] as const;

export type MoveTagId = (typeof MOVE_TAG_IDS)[number];

export const MOVE_TAG_LABEL: Record<MoveTagId, string> = {
  priority: "Priority",
  buff: "Buff",
  debuff: "Debuff",
  weather: "Weather",
  terrain: "Terrain",
  heal: "Heal",
  drain: "Drain",
  recoil: "Recoil",
  pivot: "Pivot / phaze",
  flinch: "Flinch",
  ailment: "Status ailment",
  protect: "Protect",
  hazard: "Hazard",
  screen: "Screens",
};

export type IndexedMove = {
  name: string;
  type: TypeId;
  category: MoveCategory;
  basePower: number;
  priority: number;
  shortEffect: string;
  tags: MoveTagId[];
  /** Lowercase blob for search. */
  tokens: string;
};

const WEATHER_NAME =
  /\b(rain dance|sunny day|sandstorm|snowscape|hail|chilly reception|weather ball|aurora veil)\b/i;
const WEATHER_EFFECT = /\b(weather|hail|sandstorm|rain|harsh sunlight|snow)\b/i;
const TERRAIN_NAME = /\b(grassy terrain|psychic terrain|misty terrain|electric terrain|expanding force|rising voltage|grassy glide|terrain pulse|misty explosion|psyblade)\b/i;
const TERRAIN_EFFECT = /\bterrain\b/i;
const HAZARD =
  /\b(stealth rock|spikes|toxic spikes|sticky web|rapid spin|defog|court change|mortal spin)\b/i;
const SCREEN =
  /\b(light screen|reflect|aurora veil|barrier)\b/i;
const PROTECT =
  /\b(protect|detect|king.?s shield|baneful bunker|spiky shield|obstruct|endure|silk trap|burning bulwark)\b/i;
const PIVOT_NAME =
  /\b(u-?turn|volt switch|flip turn|parting shot|baton pass|teleport|shed tail|chilly reception)\b/i;
const PIVOT_EFFECT =
  /\b(user switches|switches the user|forced to switch|switches out|blow.*away|roar|whirlwind)\b/i;

function tagsFor(row: {
  name: string;
  category: MoveCategory;
  basePower: number;
  priority?: number;
  shortEffect?: string;
}): MoveTagId[] {
  const tags = new Set<MoveTagId>();
  const name = row.name;
  const effect = (row.shortEffect ?? "").replace(/[\u2018\u2019\u02BC]/g, "'");
  const blob = `${name} ${effect}`;

  if ((row.priority ?? 0) !== 0) tags.add("priority");

  if (/raises? (all of )?the user/i.test(effect) || /raise the user/i.test(effect)) {
    tags.add("buff");
  }
  if (/lowers? the target/i.test(effect) && /stage/i.test(effect)) tags.add("debuff");

  if (WEATHER_NAME.test(name) || WEATHER_EFFECT.test(effect)) tags.add("weather");
  if (TERRAIN_NAME.test(blob) || TERRAIN_EFFECT.test(effect)) tags.add("terrain");
  if (HAZARD.test(blob)) tags.add("hazard");
  if (SCREEN.test(blob)) tags.add("screen");
  if (PROTECT.test(blob) || /\bprotects the user\b/i.test(effect)) tags.add("protect");

  if (/\bheal/i.test(effect) || /\brestores?\b/i.test(effect) || /\brecover/i.test(effect)) {
    if (!/\bdrain/i.test(effect)) tags.add("heal");
  }
  if (/\bdrain/i.test(effect) || /\bsteals? hp\b/i.test(effect)) {
    tags.add("drain");
  }
  if (
    /\b(drain punch|giga drain|leech life|horn leech|draining kiss|oblivion wing|parabolic charge|matcha gotcha|bitter blade)\b/i.test(
      name,
    )
  ) {
    tags.add("drain");
  }

  if (/\brecoil\b/i.test(effect)) tags.add("recoil");
  if (/\bflinch\b/i.test(effect)) tags.add("flinch");
  if (/\b(burn|paralyze|paralys|poison|badly poison|sleep|freeze|confus)/i.test(effect)) {
    tags.add("ailment");
  }

  if (
    PIVOT_NAME.test(name) ||
    PIVOT_EFFECT.test(effect) ||
    /\b(circle throw|dragon tail|roar|whirlwind)\b/i.test(name)
  ) {
    tags.add("pivot");
  }

  return [...tags];
}

let cache: IndexedMove[] | null = null;

export function listChampionsMoves(): IndexedMove[] {
  if (cache) return cache;
  cache = Object.values(file.moves)
    .map((row) => {
      const tags = tagsFor(row);
      const type = row.type as TypeId;
      const shortEffect = row.shortEffect ?? "";
      const tokens = [
        row.name,
        type,
        TYPE_LABEL[type] ?? type,
        row.category,
        shortEffect,
        ...tags.map((t) => MOVE_TAG_LABEL[t]),
      ]
        .join(" ")
        .toLowerCase();
      return {
        name: row.name,
        type,
        category: row.category,
        basePower: row.basePower,
        priority: row.priority ?? 0,
        shortEffect,
        tags,
        tokens,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return cache;
}

export type MoveSortKey = "name" | "power" | "priority" | "type" | "category";

export function filterChampionsMoves(
  moves: readonly IndexedMove[],
  opts: {
    q?: string;
    type?: TypeId | "";
    category?: MoveCategory | "";
    tag?: MoveTagId | "";
  },
): IndexedMove[] {
  const needle = opts.q?.trim().toLowerCase() ?? "";
  return moves.filter((m) => {
    if (opts.type && m.type !== opts.type) return false;
    if (opts.category && m.category !== opts.category) return false;
    if (opts.tag && !m.tags.includes(opts.tag)) return false;
    if (needle && !m.tokens.includes(needle)) return false;
    return true;
  });
}

export function sortChampionsMoves(moves: IndexedMove[], sort: MoveSortKey): IndexedMove[] {
  const next = [...moves];
  switch (sort) {
    case "power":
      next.sort((a, b) => b.basePower - a.basePower || a.name.localeCompare(b.name));
      break;
    case "priority":
      next.sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
      break;
    case "type":
      next.sort(
        (a, b) =>
          TYPE_LABEL[a.type].localeCompare(TYPE_LABEL[b.type]) || a.name.localeCompare(b.name),
      );
      break;
    case "category":
      next.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
      break;
    case "name":
    default:
      next.sort((a, b) => a.name.localeCompare(b.name));
  }
  return next;
}

export function categoryLabel(category: MoveCategory) {
  switch (category) {
    case "physical":
      return "Physical";
    case "special":
      return "Special";
    case "status":
      return "Status";
  }
}
