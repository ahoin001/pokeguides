import type {
  BattleRow,
  DailyBattleSlice,
  DailyMovePoint,
  KitShare,
  KitSpread,
  ParsedBattleKit,
} from "./types";

function num(v: number | string | undefined) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function pctOf(row: BattleRow): number | undefined {
  if (row.percentage_value == null || Number.isNaN(Number(row.percentage_value))) return undefined;
  return Number(row.percentage_value);
}

function shares(rows: BattleRow[], category: string, limit = 8): KitShare[] {
  return rows
    .filter((r) => r.category === category && r.name)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((r) => {
      const pct = pctOf(r);
      return pct == null ? { name: r.name } : { name: r.name, pct };
    });
}

function spreads(rows: BattleRow[], limit = 5): KitSpread[] {
  return rows
    .filter((r) => r.category === "stat_points")
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((r) => {
      const pct = pctOf(r);
      return {
        hp: num(r.hp_points),
        atk: num(r.attack_points),
        def: num(r.defense_points),
        spa: num(r.sp_atk_points),
        spd: num(r.sp_def_points),
        spe: num(r.speed_points),
        ...(pct == null ? {} : { pct }),
      };
    });
}

export function parseBattleKit(rows: BattleRow[]): ParsedBattleKit {
  return {
    moves: shares(rows, "move", 10),
    items: shares(rows, "held_item", 8),
    abilities: shares(rows, "ability", 4),
    natures: shares(rows, "stat_alignment", 6),
    spreads: spreads(rows, 5),
    teammates: shares(rows, "teammate", 8),
  };
}

export function parseDailyMoveTrend(daily: DailyBattleSlice[]): DailyMovePoint[] {
  return daily.map((day) => {
    const kit = parseBattleKit(day.rows ?? []);
    return {
      date: day.date,
      season: day.season,
      move: kit.moves[0]?.name,
      movePct: kit.moves[0]?.pct,
      item: kit.items[0]?.name,
      itemPct: kit.items[0]?.pct,
    };
  });
}

/** Folder dates are DD_MM_YYYY → ISO-ish label. */
export function formatBattleDate(folder: string) {
  const [dd, mm, yyyy] = folder.split("_");
  if (!dd || !mm || !yyyy) return folder;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${Number(dd)} ${months[Number(mm) - 1] ?? mm} ${yyyy}`;
}
