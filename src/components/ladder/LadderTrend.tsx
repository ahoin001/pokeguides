import type { DailyMovePoint } from "@/lib/champions-battle/types";
import { formatBattleDate } from "@/lib/champions-battle/parse";

export function LadderTrend({ points }: { points: DailyMovePoint[] }) {
  const series = [...points].reverse();
  if (!series.length) {
    return <p className="text-sm text-muted">No daily snapshots in this window.</p>;
  }
  const max = Math.max(...series.map((p) => p.movePct ?? 0), 1);

  return (
    <div>
      <ul className="flex items-end gap-1.5 sm:gap-2">
        {series.map((p) => {
          const h = Math.max(8, ((p.movePct ?? 0) / max) * 88);
          return (
            <li key={`${p.season}-${p.date}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span className="font-mono text-[10px] tabular-nums text-muted">
                {p.movePct != null ? `${p.movePct % 1 ? p.movePct.toFixed(1) : p.movePct}%` : "—"}
              </span>
              <span
                className="w-full max-w-[2.5rem] rounded-t-md bg-[var(--mon-vibrant,#c8b48a)]/80"
                style={{ height: h }}
                title={p.move ? `${p.move} · ${formatBattleDate(p.date)}` : formatBattleDate(p.date)}
              />
              <span className="w-full truncate text-center font-mono text-[9px] text-muted">
                {formatBattleDate(p.date).split(" ").slice(0, 2).join(" ")}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm text-muted">
        Leading move share across the last {series.length} daily snapshots
        {series[series.length - 1]?.move ? (
          <>
            {" "}
            — latest peak: <span className="text-ink">{series[series.length - 1]?.move}</span>
          </>
        ) : null}
        .
      </p>
    </div>
  );
}
