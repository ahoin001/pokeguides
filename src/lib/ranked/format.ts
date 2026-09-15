import { TYPE_IDS, type TypeId } from "@/types/pokemon";
import type { RankedShare, RankedSinglesEntry } from "./types";

export const RANK_BANDS = [
  { id: "board", label: "The board", blurb: "You will see these.", from: 1, to: 12 },
  { id: "next", label: "The next twelve", blurb: "Pack an answer.", from: 13, to: 24 },
  { id: "field", label: "The field", blurb: "Everyone else on Battle Data.", from: 25, to: Number.POSITIVE_INFINITY },
] as const;

export type RankBandId = (typeof RANK_BANDS)[number]["id"];

export function bandFor(rank: number): RankBandId {
  if (rank <= 12) return "board";
  if (rank <= 24) return "next";
  return "field";
}

export function formatPct(pct?: number) {
  if (pct == null || Number.isNaN(pct)) return undefined;
  return `${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1)}%`;
}

export function shareLabel(share?: RankedShare) {
  if (!share?.name) return undefined;
  const pct = formatPct(share.pct);
  return pct ? `${share.name} · ${pct}` : share.name;
}

export function formatAsOf(isoDate: string) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return `${d} ${months[m - 1]} ${y}`;
}

export function megaHint(item?: string) {
  if (!item) return undefined;
  if (/ite z$/i.test(item)) return "Mega Z";
  if (/ite y$/i.test(item)) return "Mega Y";
  if (/ite x$/i.test(item)) return "Mega X";
  if (/ite$/i.test(item)) return "Mega";
  return undefined;
}

export function legalTypes(types: string[]): TypeId[] {
  return types.filter((t): t is TypeId => (TYPE_IDS as readonly string[]).includes(t));
}

export function searchRanked<T extends RankedSinglesEntry>(rows: T[], q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter((row) => {
    const hay = [
      row.name,
      row.showdownId,
      ...row.types,
      row.ability?.name,
      row.nature?.name,
      row.item?.name,
      ...row.items.map((i) => i.name),
      ...row.moves.map((m) => m.name),
      ...row.teammates,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(needle);
  });
}
