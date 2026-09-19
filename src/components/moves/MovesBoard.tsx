"use client";

import { useMemo } from "react";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { PageFrame } from "@/components/chrome/PageFrame";
import { TypeIcon } from "@/components/pokemon/TypeIcon";
import { TYPE_IDS } from "@/types/pokemon";
import { TYPE_LABEL } from "@/lib/champions/types";
import {
  MOVE_PRIORITY_FILTERS,
  MOVE_TAG_IDS,
  MOVE_TAG_LABEL,
  categoryLabel,
  filterChampionsMoves,
  listChampionsMoves,
  priorityFilterLabel,
  sortChampionsMoves,
  type MovePriorityFilterId,
  type MoveSortKey,
  type MoveTagId,
  type IndexedMove,
} from "@/lib/champions/move-index";
import type { MoveCategory } from "@/lib/champions/damage";
import type { TypeId } from "@/types/pokemon";

const SORTS = ["name", "power", "priority", "type", "category"] as const;
const CATEGORIES = ["", "physical", "special", "status"] as const;
const PRIORITY_IDS = MOVE_PRIORITY_FILTERS.map((f) => f.id);

const INK_DARK: TypeId[] = ["electric", "ice", "fairy", "fighting", "ground"];

export function MovesBoard() {
  const all = useMemo(() => listChampionsMoves(), []);
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [type, setType] = useQueryState("type", parseAsString.withDefault(""));
  const [category, setCategory] = useQueryState("cat", parseAsString.withDefault(""));
  const [tag, setTag] = useQueryState("tag", parseAsString.withDefault(""));
  const [priority, setPriority] = useQueryState(
    "pri",
    parseAsStringLiteral(PRIORITY_IDS).withDefault(""),
  );
  const [sort, setSort] = useQueryState("sort", parseAsStringLiteral(SORTS).withDefault("name"));

  const rows = useMemo(() => {
    const found = filterChampionsMoves(all, {
      q,
      type: (type || "") as TypeId | "",
      category: (category || "") as MoveCategory | "",
      tag: (tag || "") as MoveTagId | "",
      priority: priority as MovePriorityFilterId,
    });
    return sortChampionsMoves(found, sort as MoveSortKey);
  }, [all, q, type, category, tag, priority, sort]);

  return (
    <PageFrame variant="board">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Move appendix</h1>
          <p className="mt-2 text-muted">
            {rows.length} of {all.length} Champions moves
            {priority ? ` · Pri ${priorityFilterLabel(priority)}` : ""}
            {tag ? ` · ${MOVE_TAG_LABEL[tag as MoveTagId]}` : ""}
            {category ? ` · ${categoryLabel(category as MoveCategory)}` : ""}
            {type ? ` · ${TYPE_LABEL[type as TypeId]}` : ""}.
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, type, effect…"
          className="w-full rounded-2xl border border-line bg-sunken px-4 py-3 md:max-w-sm"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {TYPE_IDS.map((t) => {
            const on = type === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                title={TYPE_LABEL[t]}
                onClick={() => setType(on ? "" : t)}
                className={`rounded-full p-0.5 transition ${on ? "ring-2 ring-ink" : "opacity-50 hover:opacity-100"}`}
              >
                <TypeIcon type={t} size="sm" />
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const on = category === c;
            const label = c ? categoryLabel(c) : "All cats";
            return (
              <button
                key={c || "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  on ? "border-ink bg-ink text-bg" : "border-line bg-raised text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {MOVE_PRIORITY_FILTERS.map((f) => {
            const on = priority === f.id;
            return (
              <button
                key={f.id || "pri-any"}
                type="button"
                aria-pressed={on}
                onClick={() => setPriority(f.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  on ? "border-ink bg-ink text-bg" : "border-line bg-raised text-muted hover:text-ink"
                }`}
              >
                {f.id ? `Pri ${f.label}` : f.label}
              </button>
            );
          })}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
          className="rounded-full border border-line bg-raised px-3 py-2 text-sm"
        >
          <option value="name">Name</option>
          <option value="power">Base power</option>
          <option value="priority">Priority</option>
          <option value="type">Type</option>
          <option value="category">Category</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {MOVE_TAG_IDS.map((id) => {
          const on = tag === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              onClick={() => setTag(on ? "" : id)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                on ? "border-ink bg-ink text-bg" : "border-line/80 bg-canvas/40 text-muted hover:text-ink"
              }`}
            >
              {MOVE_TAG_LABEL[id]}
            </button>
          );
        })}
      </div>

      <ul className="mt-8 divide-y divide-line/50 overflow-hidden rounded-[28px] border border-line/70 bg-raised/25">
        {rows.map((m) => (
          <li key={m.name}>
            <MoveRow move={m} />
          </li>
        ))}
        {!rows.length ? (
          <li className="px-5 py-10 text-center text-sm text-muted">
            No moves match those filters.
          </li>
        ) : null}
      </ul>
    </PageFrame>
  );
}

function MoveRow({ move }: { move: IndexedMove }) {
  const ink = INK_DARK.includes(move.type) ? "text-[#1a1a1a]" : "text-white";
  const pri =
    move.priority !== 0
      ? move.priority > 0
        ? `+${move.priority}`
        : String(move.priority)
      : null;

  return (
    <div className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-start sm:gap-4 md:px-5">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <TypeIcon type={move.type} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold tracking-tight">{move.name}</p>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${ink}`}
              style={{ background: `var(--type-${move.type})` }}
            >
              {TYPE_LABEL[move.type]}
            </span>
            <span className="rounded-full border border-line/70 px-2 py-0.5 text-[10px] font-medium text-muted">
              {categoryLabel(move.category)}
            </span>
          </div>
          {move.shortEffect ? (
            <p className="mt-1 text-sm leading-snug text-muted">{move.shortEffect}</p>
          ) : (
            <p className="mt-1 text-sm text-muted/70">No effect text synced yet.</p>
          )}
          {move.tags.length ? (
            <ul className="mt-2 flex flex-wrap gap-1">
              {move.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-canvas/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-muted"
                >
                  {MOVE_TAG_LABEL[t]}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 pl-11 sm:flex-col sm:items-end sm:gap-1 sm:pl-0">
        <p className="font-mono text-sm tabular-nums">
          {move.basePower > 0 ? (
            <>
              <span className="text-muted">BP </span>
              {move.basePower}
            </>
          ) : (
            <span className="text-muted">—</span>
          )}
        </p>
        {pri ? (
          <p className="font-mono text-xs tabular-nums text-muted">
            Pri <span className="text-ink">{pri}</span>
          </p>
        ) : (
          <p className="hidden font-mono text-xs text-muted/40 sm:block">Pri 0</p>
        )}
      </div>
    </div>
  );
}
