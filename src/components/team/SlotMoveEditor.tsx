"use client";

import { useMemo, useState } from "react";
import { X } from "@phosphor-icons/react";
import { getChampionsMove, searchChampionsDamagingMoves } from "@/lib/champions/move-data";
import { getRankedBySlug } from "@/lib/ranked/load";
import { MoveChip } from "@/components/moves/MoveChip";
import type { DamageMove } from "@/lib/champions/damage";

const MAX_MOVES = 4;

/** Compact move kit editor — ladder pills + Champions damaging-move search. */
export function SlotMoveEditor({
  slug,
  moves,
  onChange,
  compact,
}: {
  slug: string;
  moves: string[];
  onChange: (moves: string[]) => void;
  compact?: boolean;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const ladderMoves = useMemo(() => {
    const row = getRankedBySlug(slug);
    if (!row?.moves?.length) return [] as DamageMove[];
    const out: DamageMove[] = [];
    for (const share of row.moves.slice(0, 10)) {
      const hit = getChampionsMove(share.name);
      if (hit && hit.category !== "status" && hit.basePower > 0) out.push(hit);
    }
    return out;
  }, [slug]);

  const ladderNames = useMemo(() => new Set(ladderMoves.map((m) => m.name)), [ladderMoves]);
  const selectedKeys = useMemo(
    () => new Set(moves.map((m) => m.toLowerCase())),
    [moves],
  );

  const results = useMemo(() => {
    const searched = searchChampionsDamagingMoves(q, 28);
    if (!q.trim()) {
      const rest = searched.filter((m) => !ladderNames.has(m.name));
      return [...ladderMoves, ...rest].slice(0, 28);
    }
    const needle = q.trim().toLowerCase();
    const ladderHits = ladderMoves.filter(
      (m) => m.name.toLowerCase().includes(needle) || m.type.includes(needle),
    );
    const seen = new Set(ladderHits.map((m) => m.name));
    return [...ladderHits, ...searched.filter((m) => !seen.has(m.name))].slice(0, 28);
  }, [q, ladderMoves, ladderNames]);

  function add(name: string) {
    if (selectedKeys.has(name.toLowerCase())) return;
    if (moves.length >= MAX_MOVES) return;
    onChange([...moves, name]);
    setQ("");
    setOpen(false);
  }

  function remove(name: string) {
    onChange(moves.filter((m) => m.toLowerCase() !== name.toLowerCase()));
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Moves · {moves.length}/{MAX_MOVES}
        </p>
        {moves.length ? (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] text-muted hover:text-ink"
          >
            Clear kit
          </button>
        ) : null}
      </div>

      {moves.length ? (
        <ul className="flex flex-wrap gap-1.5">
          {moves.map((name) => {
            const meta = getChampionsMove(name);
            return (
              <li key={name} className="inline-flex items-center gap-0.5">
                <MoveChip as="span" name={name} type={meta?.type} size="sm" />
                <button
                  type="button"
                  onClick={() => remove(name)}
                  className="rounded-full p-1 text-muted hover:bg-white/10 hover:text-ink"
                  aria-label={`Remove ${name}`}
                >
                  <X className="h-3.5 w-3.5" weight="bold" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-[11px] text-muted">
          No kit yet — STAB typing drives coverage. Add moves to see move-level clicks.
        </p>
      )}

      {ladderMoves.length && moves.length < MAX_MOVES ? (
        <div className="flex flex-wrap gap-1">
          {ladderMoves.slice(0, 8).map((m) => {
            const on = selectedKeys.has(m.name.toLowerCase());
            return (
              <MoveChip
                key={m.name}
                name={m.name}
                type={m.type}
                selected={on}
                disabled={on || moves.length >= MAX_MOVES}
                onClick={() => add(m.name)}
                title={`Ladder · ${m.type} · ${m.basePower}`}
                className={on ? "opacity-50 line-through" : undefined}
              />
            );
          })}
        </div>
      ) : null}

      {moves.length < MAX_MOVES ? (
        <div className="relative">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
            placeholder="Search damaging moves…"
            className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-ink/40"
            autoComplete="off"
            spellCheck={false}
          />
          {open ? (
            <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-line bg-bg shadow-[var(--shadow)]">
              {results.length === 0 ? (
                <li className="px-3 py-2 text-sm text-muted">No matches.</li>
              ) : (
                results.map((m) => {
                  const taken = selectedKeys.has(m.name.toLowerCase());
                  return (
                    <li key={m.name}>
                      <button
                        type="button"
                        disabled={taken}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => add(m.name)}
                        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-white/6 disabled:opacity-40"
                      >
                        <span className="font-medium">{m.name}</span>
                        <span className="text-[11px] text-muted">
                          {m.type} · {m.basePower}
                          {ladderNames.has(m.name) ? " · ladder" : ""}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
