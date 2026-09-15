"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { cssVars } from "@/lib/champions/palette";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { useTeamStore } from "@/stores/team";
import type { RankedRow, RankedShare, RankedSpread } from "@/lib/ranked/types";
import {
  RANK_BANDS,
  bandFor,
  formatPct,
  legalTypes,
  megaHint,
  searchRanked,
} from "@/lib/ranked/format";

const STATS: { key: keyof Omit<RankedSpread, "pct">; label: string }[] = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "Atk" },
  { key: "def", label: "Def" },
  { key: "spa", label: "SpA" },
  { key: "spd", label: "SpD" },
  { key: "spe", label: "Spe" },
];

type SnapshotMeta = {
  asOf: string;
  season: string;
  source: string;
  sourceUrl: string;
  note: string;
  count: number;
};

function ShareLine({ share }: { share?: RankedShare }) {
  if (!share?.name) return <span className="text-muted">—</span>;
  const pct = formatPct(share.pct);
  return (
    <span>
      {share.name}
      {pct ? <span className="font-mono text-muted"> · {pct}</span> : null}
    </span>
  );
}

function SpreadBars({ spread }: { spread?: RankedSpread }) {
  if (!spread) return <p className="text-sm text-muted">No leading spread in this snapshot.</p>;
  const total = STATS.reduce((sum, s) => sum + spread[s.key], 0);
  return (
    <div>
      <p className="font-mono text-xs text-muted">
        {total} / 66 SP{formatPct(spread.pct) ? ` · ${formatPct(spread.pct)} of sets` : ""}
      </p>
      <dl className="mt-3 space-y-2">
        {STATS.map((s) => (
          <div key={s.key} className="grid grid-cols-[2.5rem_1fr_2rem] items-center gap-3 text-sm">
            <dt className="font-mono text-xs text-muted">{s.label}</dt>
            <dd className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full rounded-full bg-[var(--mon-vibrant)]"
                style={{ width: `${(spread[s.key] / 32) * 100}%` }}
              />
            </dd>
            <dd className="font-mono text-xs tabular-nums">{spread[s.key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
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

      <div className="mt-8 space-y-8">
        <section>
          <h3 className="text-sm font-semibold">Hold</h3>
          <p className="mt-2 text-lg">
            <ShareLine share={row.item} />
          </p>
          {row.items.length > 1 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {row.items.slice(1).map((item) => (
                <li key={item.name} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
                  {item.name}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section>
          <h3 className="text-sm font-semibold">Kit</h3>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Ability</dt>
              <dd className="mt-1">
                <ShareLine share={row.ability} />
              </dd>
            </div>
            <div>
              <dt className="text-muted">Nature</dt>
              <dd className="mt-1">
                <ShareLine share={row.nature} />
              </dd>
            </div>
          </dl>
          <div className="mt-5">
            <SpreadBars spread={row.spread} />
          </div>
          <ol className="mt-5 space-y-1.5 text-sm">
            {row.moves.map((move, i) => (
              <li key={move.name} className="flex justify-between gap-4">
                <span>
                  <span className="font-mono text-xs text-muted">{i + 1}.</span> {move.name}
                </span>
                {formatPct(move.pct) ? <span className="font-mono text-xs text-muted">{formatPct(move.pct)}</span> : null}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3 className="text-sm font-semibold">Company</h3>
          <p className="mt-1 text-sm text-muted">Most common teammates in this snapshot.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {row.teammates.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => onTeammate(name)}
                  className="rounded-full border border-line bg-raised px-3 py-1.5 text-sm hover:border-ink/40"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </section>
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
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-10" style={selected?.palette ? cssVars(selected.palette) : undefined}>
      <div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Ranked singles</h1>
        <p className="mt-3 max-w-[62ch] text-muted">
          {meta.season} snapshot · {meta.asOf} · {meta.count} Pokémon. {meta.note}{" "}
          <a href={meta.sourceUrl} className="underline" target="_blank" rel="noreferrer">
            {meta.source}
          </a>
          .
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
                            <span className="block truncate text-sm text-muted">{row.item?.name ?? "No leading item"}</span>
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

      <aside className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-3xl border border-line/80 bg-raised/60 p-6 lg:block">
        {selected ? <Kit row={selected} onTeammate={pick} /> : null}
      </aside>
    </div>
  );
}
