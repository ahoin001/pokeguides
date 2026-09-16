"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { cssVars } from "@/lib/champions/palette";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { KitUsagePanel } from "@/components/ladder/KitUsage";
import { useTeamStore } from "@/stores/team";
import type { RankedRow } from "@/lib/ranked/types";
import {
  RANK_BANDS,
  bandFor,
  megaHint,
  searchRanked,
  legalTypes,
} from "@/lib/ranked/format";
import type { ParsedBattleKit } from "@/lib/champions-battle/types";

type SnapshotMeta = {
  asOf: string;
  season: string;
  source: string;
  sourceUrl: string;
  note: string;
  count: number;
};

function rowToKit(row: RankedRow): ParsedBattleKit {
  return {
    moves: row.moves,
    items: row.items.length ? row.items : row.item ? [row.item] : [],
    abilities: row.ability ? [row.ability] : [],
    natures: row.nature ? [row.nature] : [],
    spreads: row.spread ? [row.spread] : [],
    teammates: row.teammates.map((name) => ({ name })),
  };
}

function Kit({
  row,
  onTeammate,
}: {
  row: RankedRow;
  onTeammate: (name: string) => void;
}) {
  const addTeam = useTeamStore((s) => s.add);
  const types = legalTypes(row.types);
  const mega = megaHint(row.item?.name);
  const art = row.artwork || row.sprite || "";

  return (
    <div>
      <div className="flex items-start gap-4">
        {art ? (
          <PokemonArt slug={row.slug ?? row.showdownId} src={art} name={row.name} size={96} className="shrink-0" />
        ) : (
          <div className="h-24 w-24 shrink-0 rounded-full bg-white/5" />
        )}
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted">#{String(row.rank).padStart(2, "0")}</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">
            {row.name}
            {mega ? <span className="ml-2 align-middle text-base font-medium text-muted">{mega}</span> : null}
          </h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {types.map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <KitUsagePanel kit={rowToKit(row)} onTeammate={onTeammate} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {row.slug ? (
          <>
            <Link href={`/pokemon/${row.slug}`} className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg">
              Open in dex
            </Link>
            <button
              type="button"
              onClick={() => addTeam(row.slug!)}
              className="rounded-full border border-line px-4 py-2 text-sm"
            >
              Add to team
            </button>
          </>
        ) : (
          <p className="text-sm text-muted">Not in the current legal catalog. Ranked still saw it.</p>
        )}
      </div>
    </div>
  );
}

export function RankedBoard({
  meta,
  pokemon,
  initialMon,
  initialQ,
}: {
  meta: SnapshotMeta;
  pokemon: RankedRow[];
  initialMon: string;
  initialQ: string;
}) {
  const [ready, setReady] = useState(false);
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [mon, setMon] = useQueryState("mon", parseAsString.withDefault(""));
  useEffect(() => {
    setReady(true);
  }, []);

  const query = ready ? q : q || initialQ;
  const selectedId = ready ? mon : mon || initialMon;
  const rows = useMemo(() => searchRanked(pokemon, query), [pokemon, query]);
  const needle = query.trim().toLowerCase();
  const selected =
    rows.find((r) => r.showdownId === selectedId) ??
    rows.find((r) => r.name.toLowerCase() === needle || r.showdownId === needle) ??
    pokemon.find((r) => r.showdownId === selectedId) ??
    rows[0];

  const grouped = useMemo(() => {
    return RANK_BANDS.map((band) => ({
      ...band,
      rows: rows.filter((r) => bandFor(r.rank) === band.id),
    })).filter((band) => band.rows.length);
  }, [rows]);

  function pick(name: string) {
    const hit = pokemon.find((r) => r.name.toLowerCase() === name.toLowerCase());
    if (!hit) return;
    void setQ("");
    void setMon(hit.showdownId);
  }

  return (
    <div
      className="lg:grid lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start lg:gap-10"
      style={selected?.palette ? cssVars(selected.palette) : undefined}
    >
      <div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Ranked singles</h1>
        <p className="mt-3 max-w-[62ch] text-muted">
          {meta.season} snapshot · {meta.asOf} · {meta.count} Pokémon. {meta.note}{" "}
          <a href={meta.sourceUrl} className="underline" target="_blank" rel="noreferrer">
            {meta.source}
          </a>
          . Dated teaching board — live CBD is the other mode.
        </p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, item, move, teammate"
          className="mt-6 w-full rounded-2xl border border-line bg-sunken px-4 py-3 md:max-w-md"
        />

        {rows.length === 0 ? (
          <p className="mt-10 text-muted">No Pokémon on this snapshot match that search. Clear it to see the board.</p>
        ) : (
          <div className="mt-10 space-y-12">
            {grouped.map((band) => (
              <section key={band.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xl font-semibold tracking-tight">{band.label}</h2>
                  <p className="text-sm text-muted">{band.blurb}</p>
                </div>
                <ol className="mt-4 divide-y divide-line/70 border-y border-line/70">
                  {band.rows.map((row) => {
                    const on = selected?.showdownId === row.showdownId;
                    const art = row.sprite || row.artwork || "";
                    return (
                      <li key={row.showdownId}>
                        <button
                          type="button"
                          id={`ranked-${row.showdownId}`}
                          aria-current={on ? "true" : undefined}
                          onClick={() => void setMon(row.showdownId)}
                          className={`flex w-full items-center gap-3 py-2.5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                            on ? "bg-[color-mix(in_srgb,var(--mon-wash)_18%,transparent)]" : "hover:bg-white/5"
                          }`}
                        >
                          <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-muted">
                            {String(row.rank).padStart(2, "0")}
                          </span>
                          {art ? (
                            <PokemonArt
                              slug={row.slug ?? row.showdownId}
                              src={art}
                              name={row.name}
                              size={40}
                              className="shrink-0"
                            />
                          ) : (
                            <span className="h-10 w-10 shrink-0 rounded-full bg-white/5" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{row.name}</span>
                            <span className="block truncate text-sm text-muted">
                              {row.moves[0]?.name ?? row.item?.name ?? "No leading move"}
                              {row.item?.name && row.moves[0]?.name ? ` · ${row.item.name}` : ""}
                            </span>
                          </span>
                          {megaHint(row.item?.name) ? (
                            <span className="hidden shrink-0 font-mono text-[10px] text-muted sm:inline">
                              {megaHint(row.item?.name)}
                            </span>
                          ) : null}
                        </button>
                        {on ? (
                          <div className="border-t border-line/50 py-6 lg:hidden">
                            <Kit row={row} onTeammate={pick} />
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
        )}
      </div>

      <aside className="sticky top-[calc(var(--sticky-stack)+1.5rem)] hidden max-h-[calc(100dvh-var(--sticky-stack)-2rem)] overflow-y-auto rounded-3xl border border-line/80 bg-raised/60 p-6 lg:block">
        {selected ? <Kit row={selected} onTeammate={pick} /> : null}
      </aside>
    </div>
  );
}
