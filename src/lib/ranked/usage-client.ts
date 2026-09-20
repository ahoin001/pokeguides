import usageIndexJson from "@/data/usage-index.json";
import { megaBaseSlug } from "@/lib/catalog/megas";

export type UsageIndexEntry = {
  rank: number;
  showdownId: string;
  name: string;
  move?: string;
  movePct?: number;
  item?: string;
  itemPct?: number;
};

type UsageIndex = {
  asOf: string;
  season: string;
  count: number;
  bySlug: Record<string, UsageIndexEntry>;
};

export const usageIndex = usageIndexJson as UsageIndex;

function compactId(id: string) {
  return id.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Mirror getRankedBySlug fallbacks for the thinner usage-index map. */
export function usageForSlug(slug: string): UsageIndexEntry | undefined {
  const keys = [slug, megaBaseSlug(slug), compactId(slug), compactId(megaBaseSlug(slug))];
  for (const key of keys) {
    const hit = usageIndex.bySlug[key];
    if (hit) return hit;
  }
  return undefined;
}
