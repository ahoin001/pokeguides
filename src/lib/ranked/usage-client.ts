import usageIndexJson from "@/data/usage-index.json";

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

export function usageForSlug(slug: string): UsageIndexEntry | undefined {
  return usageIndex.bySlug[slug];
}
