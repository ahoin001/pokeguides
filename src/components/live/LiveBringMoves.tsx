"use client";

import { useMemo, useState } from "react";
import { getPokemon } from "@/lib/catalog/lookup";
import { getRankedBySlug } from "@/lib/ranked/load";
import { getChampionsMove, championsMoveNames } from "@/lib/champions/move-data";
import { TYPE_LABEL } from "@/lib/champions/types";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { useLiveMatchStore, MAX_MOVES } from "@/stores/live-match";
import type { DamageMove } from "@/lib/champions/damage";

function damagingPool(slug: string, query: string): DamageMove[] {
  const ranked = getRankedBySlug(slug)?.moves.map((m) => m.name) ?? [];
  const fromRanked = ranked
    .map((n) => getChampionsMove(n))
    .filter((m): m is DamageMove => Boolean(m && m.category !== "status" && m.basePower > 0));

  const q = query.trim().toLowerCase();
  if (!q) return fromRanked;

  const rankedSet = new Set(fromRanked.map((m) => m.name.toLowerCase()));
  const extras = championsMoveNames()
    .map((n) => getChampionsMove(n))
    .filter(
      (m): m is DamageMove =>
        Boolean(
          m &&
            m.category !== "status" &&
            m.basePower > 0 &&
            !rankedSet.has(m.name.toLowerCase()) &&
            (m.name.toLowerCase().includes(q) || TYPE_LABEL[m.type].toLowerCase().includes(q)),
        ),
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 20);

  const rankedHits = fromRanked.filter(
    (m) =>
      m.name.toLowerCase().includes(q) || TYPE_LABEL[m.type].toLowerCase().includes(q),
  );
  return [...rankedHits, ...extras];
}

/** Pick up to four damaging moves for each bring mon — feeds the field matrix. */
export function LiveBringMoves({ ourSlugs }: { ourSlugs: string[] }) {
  const bringMoves = useLiveMatchStore((s) => s.bringMoves);
  const toggleBringMove = useLiveMatchStore((s) => s.toggleBringMove);
  const setBringMoves = useLiveMatchStore((s) => s.setBringMoves);
  const clearBringMoves = useLiveMatchStore((s) => s.clearBringMoves);
  const focusSlug = useLiveMatchStore((s) => s.focusSlug);
  const setFocus = useLiveMatchStore((s) => s.setFocus);
  const [query, setQuery] = useState("");

  const activeSlug = ourSlugs.includes(focusSlug ?? "")
    ? (focusSlug as string)
    : ourSlugs[0] ?? null;

  const active = activeSlug ? getPokemon(activeSlug) : undefined;
  const selected = activeSlug ? bringMoves[activeSlug] ?? [] : [];

  const filtered = useMemo(
    () => (activeSlug ? damagingPool(activeSlug, query) : []),
    [activeSlug, query],
  );

  function seedLadder() {
    if (!activeSlug) return;
    const names =
      getRankedBySlug(activeSlug)
        ?.moves.map((m) => m.name)
        .filter((n) => {
          const move = getChampionsMove(n);
          return move && move.category !== "status" && move.basePower > 0;
        })
        .slice(0, MAX_MOVES) ?? [];
    setBringMoves(activeSlug, names);
  }

  if (!ourSlugs.length) return null;

  return (
    <div className="rounded-[28px] border border-line/70 bg-bg/35 p-4 md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Bring kit
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">Moves for the field</h2>
          <p className="mt-1 max-w-[42ch] text-sm text-muted">
            Pick up to {MAX_MOVES} damaging moves per Pokémon. The matrix uses these for “You hit”
            instead of STAB-only guesses.
          </p>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {ourSlugs.map((slug) => {
          const p = getPokemon(slug);
          if (!p) return null;
          const count = bringMoves[slug]?.length ?? 0;
          const on = slug === activeSlug;
          return (
            <li key={slug}>
              <button
                type="button"
                onClick={() => setFocus(slug)}
                className={`flex items-center gap-2 rounded-2xl border px-2.5 py-2 transition ${
                  on
                    ? "border-ink/40 bg-white/10"
                    : "border-line/70 bg-raised/30 hover:bg-raised/50"
                }`}
                style={cssVars(p.palette)}
              >
                <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={36} />
                <span className="text-left">
                  <span className="block text-sm font-medium">{p.name}</span>
                  <span className="font-mono text-[10px] text-muted">
                    {count}/{MAX_MOVES} moves
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {active && activeSlug ? (
        <div className="mt-5 space-y-4" style={cssVars(active.palette)}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{active.name} kit</p>
            <button
              type="button"
              onClick={seedLadder}
              className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted hover:text-ink"
            >
              Use ladder damaging moves
            </button>
            {selected.length ? (
              <button
                type="button"
                onClick={() => clearBringMoves(activeSlug)}
                className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted hover:text-ink"
              >
                Clear
              </button>
            ) : null}
          </div>

          {selected.length ? (
            <ul className="flex flex-wrap gap-2">
              {selected.map((name) => {
                const move = getChampionsMove(name);
                return (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => toggleBringMove(activeSlug, name)}
                      className="inline-flex items-center gap-2 rounded-full border border-ink/30 bg-white/10 px-3 py-1.5 text-sm"
                    >
                      {move ? <TypeBadge type={move.type} size="sm" /> : null}
                      <span>{name}</span>
                      <span className="text-muted">×</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted">
              No moves yet — field will score STAB types only until you pick a kit.
            </p>
          )}

          <div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all damaging moves or types…"
              className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-sm placeholder:text-muted/70"
            />
            <p className="mt-2 text-[11px] text-muted">
              {query.trim()
                ? "Showing ladder hits plus coverage search."
                : "Ladder damaging moves shown. Search to add coverage not on the sample."}
            </p>
            <ul className="mt-3 grid max-h-48 gap-1 overflow-y-auto sm:grid-cols-2">
              {filtered.map((move) => {
                const on = selected.some((m) => m.toLowerCase() === move.name.toLowerCase());
                const full = !on && selected.length >= MAX_MOVES;
                return (
                  <li key={move.name}>
                    <button
                      type="button"
                      disabled={full}
                      onClick={() => toggleBringMove(activeSlug, move.name)}
                      className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition disabled:opacity-40 ${
                        on ? "bg-white/12" : "hover:bg-white/6"
                      }`}
                    >
                      <TypeBadge type={move.type} size="sm" />
                      <span className="min-w-0 flex-1 truncate font-medium">{move.name}</span>
                      <span className="font-mono text-[11px] text-muted">{move.basePower}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
