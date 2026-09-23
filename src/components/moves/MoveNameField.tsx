"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { X } from "@phosphor-icons/react";
import { getChampionsMove } from "@/lib/champions/move-data";
import {
  filterChampionsMoves,
  listChampionsMoves,
  type IndexedMove,
} from "@/lib/champions/move-index";
import { getRankedBySlug } from "@/lib/ranked/load";
import { MoveChip } from "@/components/moves/MoveChip";
import { MoveCategoryIcon } from "@/components/moves/MoveCategoryIcon";

const SUGGEST_LIMIT = 28;

function searchAllMoves(query: string, limit = SUGGEST_LIMIT): IndexedMove[] {
  const all = listChampionsMoves();
  if (!query.trim()) return all.slice(0, limit);
  return filterChampionsMoves(all, { q: query }).slice(0, limit);
}

function metaFor(m: IndexedMove | ReturnType<typeof getChampionsMove>) {
  if (!m) return null;
  if (m.category === "status" || !m.basePower) return m.category;
  return `${m.category.slice(0, 3)} · ${m.basePower}`;
}

/**
 * Single-slot move picker — Champions move DB search with type chips and kit metadata.
 * Keeps freeform “why” elsewhere; this only owns the move name.
 */
export function MoveNameField({
  value,
  onChange,
  exclude = [],
  slug,
  placeholder = "Search moves…",
  autoFocus = false,
}: {
  value: string;
  onChange: (name: string) => void;
  /** Other kit names already taken (case-insensitive). */
  exclude?: string[];
  /** Optional species slug — surfaces ladder moves first when the query is empty. */
  slug?: string;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(!value.trim());

  useEffect(() => {
    if (!value.trim()) setEditing(true);
  }, [value]);

  const taken = useMemo(
    () => new Set(exclude.map((n) => n.toLowerCase()).filter(Boolean)),
    [exclude],
  );

  const ladderMoves = useMemo(() => {
    if (!slug) return [] as IndexedMove[];
    const row = getRankedBySlug(slug);
    if (!row?.moves?.length) return [];
    const all = listChampionsMoves();
    const byName = new Map(all.map((m) => [m.name.toLowerCase(), m]));
    const out: IndexedMove[] = [];
    for (const share of row.moves.slice(0, 12)) {
      const hit = byName.get(share.name.toLowerCase());
      if (hit) out.push(hit);
    }
    return out;
  }, [slug]);

  const ladderNames = useMemo(
    () => new Set(ladderMoves.map((m) => m.name.toLowerCase())),
    [ladderMoves],
  );

  const results = useMemo(() => {
    const searched = searchAllMoves(q);
    if (!q.trim() && ladderMoves.length) {
      const rest = searched.filter((m) => !ladderNames.has(m.name.toLowerCase()));
      return [...ladderMoves, ...rest].slice(0, SUGGEST_LIMIT);
    }
    if (!q.trim()) return searched;
    const needle = q.trim().toLowerCase();
    const ladderHits = ladderMoves.filter(
      (m) =>
        m.name.toLowerCase().includes(needle) ||
        m.type.includes(needle) ||
        m.tokens.includes(needle),
    );
    const seen = new Set(ladderHits.map((m) => m.name.toLowerCase()));
    return [...ladderHits, ...searched.filter((m) => !seen.has(m.name.toLowerCase()))].slice(
      0,
      SUGGEST_LIMIT,
    );
  }, [q, ladderMoves, ladderNames]);

  const selected = value.trim() ? getChampionsMove(value) : undefined;
  const selectedIndexed = useMemo(() => {
    if (!value.trim()) return undefined;
    return listChampionsMoves().find(
      (m) => m.name.toLowerCase() === value.trim().toLowerCase(),
    );
  }, [value]);

  function pick(name: string) {
    onChange(name);
    setQ("");
    setOpen(false);
    setEditing(false);
  }

  function clear() {
    onChange("");
    setQ("");
    setEditing(true);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!editing && value.trim()) {
    const effect =
      selected?.shortEffect ||
      selectedIndexed?.shortEffect ||
      null;
    const pri = selectedIndexed?.priority ?? selected?.priority ?? 0;
    return (
      <div className="rounded-2xl border border-line/60 bg-raised/25 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <MoveChip
            as="span"
            name={selected?.name ?? value}
            type={selected?.type ?? selectedIndexed?.type}
            size="md"
            meta={
              selected
                ? metaFor(selected)
                : selectedIndexed
                  ? metaFor(selectedIndexed)
                  : null
            }
          />
          {pri ? (
            <span className="font-mono text-[10px] text-muted">
              Pri {pri > 0 ? `+${pri}` : pri}
            </span>
          ) : null}
          <span className="ml-auto flex gap-1">
            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setQ(value);
                setOpen(true);
              }}
              className="rounded-full px-2 py-1 text-[11px] text-muted hover:bg-white/8 hover:text-ink"
            >
              Change
            </button>
            <button
              type="button"
              onClick={clear}
              className="rounded-full p-1 text-muted hover:bg-white/8 hover:text-ink"
              aria-label={`Clear ${value}`}
            >
              <X className="h-3.5 w-3.5" weight="bold" />
            </button>
          </span>
        </div>
        {effect ? (
          <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-muted">{effect}</p>
        ) : selected || selectedIndexed ? null : (
          <p className="mt-2 text-[11px] text-amber-200/90">
            Not in the Champions move DB — change to pick a legal name.
          </p>
        )}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-line bg-sunken px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-ink/40"
        autoComplete="off"
        spellCheck={false}
        autoFocus={autoFocus}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
      />
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-2xl border border-line bg-bg shadow-[var(--shadow)]"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-muted">No matches.</li>
          ) : (
            results.map((m) => {
              const blocked =
                taken.has(m.name.toLowerCase()) &&
                m.name.toLowerCase() !== value.trim().toLowerCase();
              const ladder = ladderNames.has(m.name.toLowerCase());
              return (
                <li key={m.name} role="option" aria-selected={false}>
                  <button
                    type="button"
                    disabled={blocked}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(m.name)}
                    className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-white/6 disabled:opacity-40"
                  >
                    <MoveChip as="span" name={m.name} type={m.type} size="sm" className="shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
                        <MoveCategoryIcon category={m.category} className="h-3.5 w-3.5" />
                        <span className="capitalize">{m.category}</span>
                        {m.basePower > 0 ? <span>· {m.basePower}</span> : null}
                        {m.priority ? (
                          <span>· Pri {m.priority > 0 ? `+${m.priority}` : m.priority}</span>
                        ) : null}
                        {ladder ? <span className="text-ink">· ladder</span> : null}
                      </span>
                      {m.shortEffect ? (
                        <span className="mt-0.5 line-clamp-1 block text-[11px] text-muted">
                          {m.shortEffect}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
      {value.trim() && editing ? (
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setQ("");
            setOpen(false);
          }}
          className="mt-1.5 text-[11px] text-muted hover:text-ink"
        >
          Keep {value}
        </button>
      ) : null}
    </div>
  );
}
