"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPct } from "@/lib/ranked/format";

export type UsageBoardRow = {
  rank: number;
  name: string;
  showdownId: string;
  slug?: string;
  move?: string;
  movePct?: number;
  item?: string;
};

export function UsageExplorer({ rows }: { rows: UsageBoardRow[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) =>
      [r.name, r.showdownId, r.move, r.item].filter(Boolean).join(" ").toLowerCase().includes(needle),
    );
  }, [q, rows]);

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">All Singles usage</h2>
          <p className="mt-1 text-sm text-muted">{filtered.length} Pokémon with a current Singles sample.</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, move, item"
          className="w-full rounded-2xl border border-line bg-sunken px-4 py-3 sm:max-w-xs"
        />
      </div>
      <div className="mt-6 overflow-hidden rounded-[28px] border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-raised/80 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Pokémon</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Lead move</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Item</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((row) => (
              <tr key={row.showdownId} className="transition hover:bg-raised/50">
                <td className="px-4 py-3 font-mono tabular-nums text-muted">{row.rank}</td>
                <td className="px-4 py-3">
                  <Link href={`/usage/${row.showdownId}`} className="font-medium tracking-tight hover:underline">
                    {row.name}
                  </Link>
                  {row.slug ? (
                    <Link href={`/pokemon/${row.slug}`} className="ml-2 text-xs text-muted hover:text-ink">
                      dex
                    </Link>
                  ) : null}
                </td>
                <td className="hidden px-4 py-3 text-muted sm:table-cell">
                  {row.move ?? "—"}
                  {formatPct(row.movePct) ? (
                    <span className="font-mono text-xs"> · {formatPct(row.movePct)}</span>
                  ) : null}
                </td>
                <td className="hidden px-4 py-3 text-muted md:table-cell">{row.item ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
