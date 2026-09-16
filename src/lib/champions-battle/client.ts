import "server-only";

import { unstable_cache } from "next/cache";
import type {
  BattleResponse,
  ChampionsFormat,
  ChampionsIndex,
  DailyBattleResponse,
} from "./types";

const BASE = "https://championsbattledata.com";

/** Cache tags for on-demand revalidation via /api/champions/revalidate */
export const CBD_CACHE_TAGS = {
  index: "cbd-index",
  battle: "cbd-battle",
  daily: "cbd-daily",
  board: "cbd-board",
} as const;

/** Seconds — battle data updates daily; refresh within the day. */
export const CBD_REVALIDATE = {
  index: 60 * 60 * 6,
  battle: 60 * 60,
  daily: 60 * 60 * 6,
  board: 60 * 60 * 6,
} as const;

export type UsageBoardRow = {
  rank: number;
  name: string;
  showdownId: string;
  move?: string;
  movePct?: number;
  item?: string;
  itemPct?: number;
};

export type UsageBoardSnapshot = {
  generatedAt?: string;
  season: string;
  rows: UsageBoardRow[];
};

async function cbdFetch<T>(
  path: string,
  tags: string[],
  revalidate: number,
  /** Full index exceeds Next's 2MB Data Cache — skip fetch cache, trim via unstable_cache instead. */
  skipFetchCache = false,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...(skipFetchCache
      ? { cache: "no-store" as const }
      : { next: { revalidate, tags } }),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Champions Battle Data ${path} → ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Raw index — do not put this in Next fetch cache (≈4MB). Prefer getUsageBoard(). */
export async function fetchChampionsIndex(): Promise<ChampionsIndex> {
  return cbdFetch<ChampionsIndex>("/api", [CBD_CACHE_TAGS.index], CBD_REVALIDATE.index, true);
}

function boardFromIndex(index: ChampionsIndex): UsageBoardSnapshot {
  const rows: UsageBoardRow[] = [];
  for (const mon of index.pokemon ?? []) {
    const top = mon.summary?.battleSummary?.Current?.Singles?.top;
    const rank = top?.move?.column_position;
    if (!rank) continue;
    rows.push({
      rank,
      name: mon.name,
      showdownId: mon.showdownId,
      move: top?.move?.name,
      movePct: top?.move?.percentage_value ?? undefined,
      item: top?.held_item?.name,
      itemPct: top?.held_item?.percentage_value ?? undefined,
    });
  }
  rows.sort((a, b) => a.rank - b.rank);

  return {
    generatedAt: index.generatedAt,
    season: index.defaultSeason || "Current",
    rows,
  };
}

/** Slim Singles board — cached under 2MB via unstable_cache. */
export const getUsageBoard = unstable_cache(
  async (): Promise<UsageBoardSnapshot> => {
    const index = await fetchChampionsIndex();
    return boardFromIndex(index);
  },
  ["cbd-usage-board-v1"],
  { revalidate: CBD_REVALIDATE.board, tags: [CBD_CACHE_TAGS.board, CBD_CACHE_TAGS.index] },
);

export async function fetchBattle(
  format: ChampionsFormat,
  showdownId: string,
): Promise<BattleResponse> {
  const id = encodeURIComponent(showdownId.toLowerCase());
  return cbdFetch<BattleResponse>(
    `/api/battle/${format}/${id}`,
    [CBD_CACHE_TAGS.battle, `cbd-battle-${format}-${id}`],
    CBD_REVALIDATE.battle,
  );
}

export async function fetchBattleDaily(
  format: ChampionsFormat,
  showdownId: string,
  days = 7,
  season?: string,
): Promise<DailyBattleResponse> {
  const id = encodeURIComponent(showdownId.toLowerCase());
  const q = new URLSearchParams({ days: String(Math.min(31, Math.max(1, days))) });
  if (season) q.set("season", season);
  return cbdFetch<DailyBattleResponse>(
    `/api/battle/${format}/${id}?${q}`,
    [CBD_CACHE_TAGS.daily, `cbd-daily-${format}-${id}`],
    CBD_REVALIDATE.daily,
  );
}

export async function fetchPokemonRecord(
  showdownId: string,
  format: ChampionsFormat,
  opts?: { days?: number; season?: string },
) {
  const id = encodeURIComponent(showdownId.toLowerCase());
  const q = new URLSearchParams({ format });
  if (opts?.days) q.set("days", String(opts.days));
  if (opts?.season) q.set("season", opts.season);
  return cbdFetch<Record<string, unknown>>(
    `/api/pokemon/${id}?${q}`,
    [CBD_CACHE_TAGS.index, `cbd-pokemon-${id}`],
    CBD_REVALIDATE.index,
  );
}
